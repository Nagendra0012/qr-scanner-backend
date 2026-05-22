/**
 * QR Security Scanner — Backend
 * Node.js + Express
 *
 * Endpoints:
 *   POST /api/scan        — scan a QR image (multipart or base64)
 *   GET  /api/health      — health check
 */

require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const multer      = require('multer');
const Jimp        = require('jimp');
const jsQR        = require('jsqr');
const axios       = require('axios');
const rateLimit   = require('express-rate-limit');
const { URL }     = require('url');

const app  = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { error: 'Too many requests — please wait before scanning again.' }
});
app.use('/api/', limiter);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// ─── Heuristic URL Analyser ───────────────────────────────────────────────────

function analyzeURL(rawInput) {
  const threats  = [];
  const warnings = [];
  let score = 0; // 0–100, higher = more dangerous

  /* ── 1. Non-HTTP protocols that execute code ── */
  if (/^javascript:/i.test(rawInput)) {
    threats.push({ id: 'JS_URI', msg: 'JavaScript URI — direct code execution attempt' });
    score += 100;
    return { threats, warnings, score: 100 };
  }
  if (/^data:/i.test(rawInput)) {
    threats.push({ id: 'DATA_URI', msg: 'Data URI — may embed and execute malicious content' });
    score += 80;
  }
  if (/^vbscript:/i.test(rawInput)) {
    threats.push({ id: 'VBSCRIPT_URI', msg: 'VBScript URI — code execution attempt' });
    score += 100;
    return { threats, warnings, score: 100 };
  }

  /* ── 2. Parse URL ── */
  let url;
  try {
    url = new URL(rawInput);
  } catch {
    threats.push({ id: 'MALFORMED', msg: 'Malformed or unparseable URL' });
    return { threats, warnings, score: Math.min(score + 40, 100) };
  }

  /* ── 3. Protocol ── */
  if (url.protocol === 'http:') {
    warnings.push({ id: 'NO_HTTPS', msg: 'Unencrypted HTTP connection — data sent in plain text' });
    score += 10;
  }

  /* ── 4. IP address instead of domain ── */
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(url.hostname)) {
    threats.push({ id: 'IP_HOST', msg: 'Raw IP address used instead of a domain name' });
    score += 35;
  }

  /* ── 5. Suspicious TLDs ── */
  const suspiciousTLDs = [
    'xyz','tk','ml','ga','cf','gq','top','click','download',
    'loan','work','date','party','racing','stream','bid','win',
    'men','review','science','accountant'
  ];
  const tld = url.hostname.split('.').pop().toLowerCase();
  if (suspiciousTLDs.includes(tld)) {
    warnings.push({ id: 'SUSPICIOUS_TLD', msg: `High-risk TLD detected: .${tld}` });
    score += 20;
  }

  /* ── 6. Excessive subdomains ── */
  const parts = url.hostname.split('.');
  if (parts.length > 4) {
    warnings.push({ id: 'DEEP_SUBDOMAIN', msg: `Unusually deep subdomain chain (${parts.length - 2} levels)` });
    score += 15;
  }

  /* ── 7. Homograph / IDN attack ── */
  if (/[^\x00-\x7F]/.test(url.hostname)) {
    threats.push({ id: 'HOMOGRAPH', msg: 'Non-ASCII characters in domain name (possible homograph / IDN attack)' });
    score += 45;
  }

  /* ── 8. URL shorteners ── */
  const shorteners = [
    'bit.ly','tinyurl.com','t.co','goo.gl','ow.ly','is.gd',
    'buff.ly','adf.ly','j.mp','rebrand.ly','cutt.ly','rb.gy',
    'qrco.de','qr.ae'
  ];
  if (shorteners.some(s => url.hostname.endsWith(s))) {
    warnings.push({ id: 'URL_SHORTENER', msg: 'URL shortener detected — final destination is hidden' });
    score += 20;
  }

  /* ── 9. Brand impersonation in domain ── */
  const brands = ['paypal','amazon','google','microsoft','apple','facebook','instagram',
                  'netflix','bank','wellsfargo','chase','citibank','coinbase','binance'];
  const domainLower = url.hostname.toLowerCase();
  const impersonated = brands.filter(b => domainLower.includes(b));
  if (impersonated.length > 0 && !impersonated.some(b => domainLower === `${b}.com` || domainLower === `www.${b}.com`)) {
    threats.push({ id: 'BRAND_IMPERSONATION', msg: `Brand name "${impersonated[0]}" detected in non-official domain` });
    score += 40;
  }

  /* ── 10. Phishing keywords in path/query ── */
  const phishingKw = ['login','signin','verify','secure','account','update',
                      'confirm','password','credential','wallet','recovery','suspend'];
  const pathQuery   = (url.pathname + url.search).toLowerCase();
  const foundKw     = phishingKw.filter(k => pathQuery.includes(k));
  if (foundKw.length >= 2) {
    warnings.push({ id: 'PHISHING_KEYWORDS', msg: `Phishing-related keywords in URL path: ${foundKw.join(', ')}` });
    score += foundKw.length * 5;
  }

  /* ── 11. Double-encoding ── */
  if (rawInput.includes('%25')) {
    warnings.push({ id: 'DOUBLE_ENCODE', msg: 'Double URL-encoding detected (common obfuscation technique)' });
    score += 15;
  }

  /* ── 12. Extremely long URL ── */
  if (rawInput.length > 500) {
    warnings.push({ id: 'LONG_URL', msg: `Unusually long URL (${rawInput.length} chars) — possible obfuscation` });
    score += 10;
  }

  /* ── 13. Hex / unicode escapes in host ── */
  if (/%[0-9a-fA-F]{2}/.test(url.hostname)) {
    threats.push({ id: 'ENCODED_HOST', msg: 'Percent-encoded characters in hostname — likely obfuscation' });
    score += 30;
  }

  return { threats, warnings, score: Math.min(score, 100) };
}

// ─── VirusTotal Integration ───────────────────────────────────────────────────

async function checkVirusTotal(urlString) {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey || apiKey === 'your_virustotal_api_key_here') return null;

  try {
    // Step 1 — submit URL
    const submitRes = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      `url=${encodeURIComponent(urlString)}`,
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    const analysisId = submitRes.data.data.id;

    // Step 2 — wait for analysis
    await new Promise(r => setTimeout(r, 3500));

    // Step 3 — fetch report
    const reportRes = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: { 'x-apikey': apiKey },
        timeout: 10000
      }
    );

    const attrs = reportRes.data.data.attributes;
    const stats = attrs.stats;

    return {
      status:     attrs.status,
      malicious:  stats.malicious  || 0,
      suspicious: stats.suspicious || 0,
      harmless:   stats.harmless   || 0,
      undetected: stats.undetected || 0,
      total: (stats.malicious + stats.suspicious + stats.harmless + stats.undetected) || 0,
      permalink: `https://www.virustotal.com/gui/url/${Buffer.from(urlString).toString('base64').replace(/=+$/, '')}`
    };
  } catch (err) {
    console.error('[VirusTotal]', err.message);
    return null;
  }
}

// ─── Google Safe Browsing Integration ────────────────────────────────────────

async function checkGoogleSafeBrowsing(urlString) {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey || apiKey === 'your_google_safe_browsing_api_key_here') return null;

  try {
    const res = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        client: { clientId: 'qr-security-scanner', clientVersion: '1.0.0' },
        threatInfo: {
          threatTypes:      ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
          platformTypes:    ['ANY_PLATFORM'],
          threatEntryTypes: ['URL'],
          threatEntries:    [{ url: urlString }]
        }
      },
      { timeout: 8000 }
    );

    const matches = res.data.matches || [];
    return {
      safe:    matches.length === 0,
      threats: matches.map(m => ({ type: m.threatType, platform: m.platformType }))
    };
  } catch (err) {
    console.error('[SafeBrowsing]', err.message);
    return null;
  }
}

// ─── QR Decoder ──────────────────────────────────────────────────────────────

async function decodeQRFromBuffer(imageBuffer) {
  const image  = await Jimp.read(imageBuffer);

  // Try original, then greyscale + contrast-enhanced variants for robustness
  const variants = [
    image.clone(),
    image.clone().greyscale().contrast(0.4),
    image.clone().greyscale().brightness(0.1),
  ];

  for (const variant of variants) {
    const { data, width, height } = variant.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height, { inversionAttempts: 'attemptBoth' });
    if (code) return code.data;
  }

  return null;
}

// ─── Classify QR Content ─────────────────────────────────────────────────────

function classifyContent(content) {
  if (/^https?:\/\//i.test(content))           return 'URL';
  if (/^mailto:/i.test(content))               return 'EMAIL';
  if (/^tel:/i.test(content))                  return 'PHONE';
  if (/^smsto:/i.test(content))                return 'SMS';
  if (/^WIFI:/i.test(content))                 return 'WIFI';
  if (/^BEGIN:VCARD/i.test(content))           return 'VCARD';
  if (/^BEGIN:VEVENT/i.test(content))          return 'CALENDAR';
  if (/^bitcoin:|^ethereum:/i.test(content))   return 'CRYPTO';
  if (/^javascript:|^data:|^vbscript:/i.test(content)) return 'DANGEROUS_SCRIPT';
  return 'TEXT';
}

function deriveRiskLevel(heuristics, virusTotal, safeBrowsing) {
  if (
    heuristics.score >= 70 ||
    (virusTotal   && virusTotal.malicious  > 0) ||
    (safeBrowsing && safeBrowsing.threats && safeBrowsing.threats.length > 0)
  ) return 'HIGH';

  if (
    heuristics.score >= 30 ||
    (virusTotal   && virusTotal.suspicious > 0)
  ) return 'MEDIUM';

  return 'LOW';
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    virusTotalConfigured:   !!process.env.VIRUSTOTAL_API_KEY && process.env.VIRUSTOTAL_API_KEY !== 'your_virustotal_api_key_here',
    safeBrowsingConfigured: !!process.env.GOOGLE_SAFE_BROWSING_API_KEY && process.env.GOOGLE_SAFE_BROWSING_API_KEY !== 'your_google_safe_browsing_api_key_here',
    vtKeyLength:  process.env.VIRUSTOTAL_API_KEY ? process.env.VIRUSTOTAL_API_KEY.length : 0,
    sbKeyLength:  process.env.GOOGLE_SAFE_BROWSING_API_KEY ? process.env.GOOGLE_SAFE_BROWSING_API_KEY.length : 0,
    timestamp: new Date().toISOString()
  });
});
app.post('/api/scan', upload.single('image'), async (req, res) => {
  const startTime = Date.now();

  try {
    /* ── 1. Get image buffer ── */
    let imageBuffer;

    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body.imageData) {
      const base64 = req.body.imageData.replace(/^data:image\/[a-z+]+;base64,/, '');
      imageBuffer  = Buffer.from(base64, 'base64');
    } else {
      return res.status(400).json({ error: 'No image provided. Send multipart "image" field or JSON "imageData" base64.' });
    }

    /* ── 2. Decode QR ── */
    const qrContent = await decodeQRFromBuffer(imageBuffer);

    if (!qrContent) {
      return res.status(422).json({ error: 'No QR code detected in the image. Try a clearer photo.' });
    }

    /* ── 3. Classify content type ── */
    const contentType = classifyContent(qrContent);

    /* ── 4. Heuristic analysis (always) ── */
    let heuristics = { threats: [], warnings: [], score: 0 };
    if (['URL', 'DANGEROUS_SCRIPT'].includes(contentType)) {
      heuristics = analyzeURL(qrContent);
    }

    /* ── 5. External API checks (parallel, non-blocking) ── */
    let virusTotal   = null;
    let safeBrowsing = null;

    if (['URL', 'DANGEROUS_SCRIPT'].includes(contentType)) {
      [virusTotal, safeBrowsing] = await Promise.all([
        checkVirusTotal(qrContent),
        checkGoogleSafeBrowsing(qrContent)
      ]);
    }

    /* ── 6. Derive overall risk level ── */
    const riskLevel = deriveRiskLevel(heuristics, virusTotal, safeBrowsing);

    /* ── 7. Respond ── */
    return res.json({
      success:     true,
      qrContent,
      contentType,
      riskLevel,
      heuristics,
      virusTotal,
      safeBrowsing,
      scanDurationMs: Date.now() - startTime,
      scannedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('[/api/scan]', err);
    return res.status(500).json({ error: 'Internal scan error: ' + err.message });
  }
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Unexpected server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🛡️  QR Security Scanner backend running on http://localhost:${PORT}`);
  console.log(`   VirusTotal API:      ${process.env.VIRUSTOTAL_API_KEY && process.env.VIRUSTOTAL_API_KEY !== 'your_virustotal_api_key_here' ? '✅ configured' : '⚠️  not configured'}`);
  console.log(`   Google SafeBrowsing: ${process.env.GOOGLE_SAFE_BROWSING_API_KEY && process.env.GOOGLE_SAFE_BROWSING_API_KEY !== 'your_google_safe_browsing_api_key_here' ? '✅ configured' : '⚠️  not configured'}\n`);
});
