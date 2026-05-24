# QR Threat Scanner — Complete Professional Documentation

**Version:** 1.0.0  
**Platform:** Android & iOS (React Native + Expo)  
**Backend:** Node.js + Express  
**Author:** Nagendra  
**Repository:** https://github.com/Nagendra0012

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Requirements](#2-system-requirements)
3. [Technology Stack](#3-technology-stack)
4. [Project Architecture](#4-project-architecture)
5. [Downloading the Project from GitHub](#5-downloading-the-project-from-github)
6. [Backend Setup](#6-backend-setup)
7. [Mobile App Setup](#7-mobile-app-setup)
8. [API Key Configuration](#8-api-key-configuration)
9. [Running the Application](#9-running-the-application)
10. [Testing the Application](#10-testing-the-application)
11. [How the App Works](#11-how-the-app-works)
12. [Threat Detection System](#12-threat-detection-system)
13. [App Screens Guide](#13-app-screens-guide)
14. [Deploying the Backend](#14-deploying-the-backend)
15. [Building for Production](#15-building-for-production)
16. [Publishing to Google Play Store](#16-publishing-to-google-play-store)
17. [Troubleshooting](#17-troubleshooting)
18. [Frequently Asked Questions](#18-frequently-asked-questions)

---

## 1. Project Overview

QR Threat Scanner is a full-stack mobile security application that allows users to scan QR codes and instantly analyze the embedded URL for potential threats, phishing attempts, malware, and other cybersecurity risks.

### What the app does

- Scans QR codes using the phone camera in real time
- Accepts uploaded images containing QR codes
- Extracts the URL or content from the QR code
- Runs the URL through 13+ heuristic security checks
- Checks the URL against VirusTotal (70+ antivirus engines)
- Checks the URL against Google Safe Browsing database
- Displays a detailed threat report with risk level (LOW, MEDIUM, HIGH)
- Allows sharing of the threat report

### What the app does NOT do

- Never opens scanned URLs automatically
- Never stores your scan history
- Never uploads your personal data
- Never shares your API keys

---

## 2. System Requirements

### Your Computer (Development Machine)

| Requirement | Minimum Version | How to Check |
|---|---|---|
| Operating System | Windows 10 or later | Settings → About |
| Node.js | v18.0.0 or later | `node --version` in CMD |
| npm | v9.0.0 or later | `npm --version` in CMD |
| Git | v2.30.0 or later | `git --version` in CMD |
| VS Code | Any recent version | Recommended editor |
| RAM | 8GB minimum | Task Manager |
| Storage | 2GB free space | File Explorer |

### Your Phone (Testing Device)

| Requirement | Details |
|---|---|
| Android | Version 8.0 (Oreo) or later |
| iOS | Version 13.0 or later |
| Expo Go App | Installed from App Store / Play Store |
| Camera | Required for live scanning |
| WiFi | Same network as your computer |
| Storage | 200MB free space |

---

## 3. Technology Stack

### Mobile App
| Technology | Version | Purpose |
|---|---|---|
| React Native | 0.81.5 | Mobile app framework |
| Expo | 54.0.0 | Development platform |
| expo-camera | 17.0.10 | Camera access and QR scanning |
| expo-image-picker | 17.0.11 | Gallery image selection |
| React Navigation | 6.x | Screen navigation |
| Axios | 1.7.2 | HTTP requests to backend |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express | 4.18.2 | Web server framework |
| jsQR | 1.4.0 | QR code decoding from images |
| Jimp | 0.22.12 | Image processing |
| Multer | 1.4.5 | File upload handling |
| Axios | 1.6.0 | External API calls |
| express-rate-limit | 7.1.5 | Rate limiting protection |

### External APIs
| API | Purpose | Cost |
|---|---|---|
| VirusTotal API | Check URL against 70+ antivirus engines | Free (4 req/min) |
| Google Safe Browsing | Check URL against Google threat database | Free |

---

## 4. Project Architecture

```
QR Threat Scanner
│
├── Mobile App (React Native)
│   ├── HomeScreen        — Landing page with scan options
│   ├── ScannerScreen     — Live camera QR scanner
│   ├── UploadScreen      — Image picker and upload
│   └── ResultScreen      — Threat analysis results
│
└── Backend API (Node.js)
    ├── POST /api/scan    — Decode QR + analyze threats
    └── GET  /api/health  — Server health check
```

### Data Flow

```
User scans QR code
        ↓
Mobile app captures image
        ↓
Image sent to backend API
        ↓
Backend decodes QR code from image
        ↓
URL extracted from QR code
        ↓
Heuristic analysis runs (13+ checks)
        ↓
VirusTotal API called
        ↓
Google Safe Browsing API called
        ↓
Risk level calculated (LOW/MEDIUM/HIGH)
        ↓
Full threat report returned to app
        ↓
User sees detailed results
```

---

## 5. Downloading the Project from GitHub

### Step 1 — Install Git (if not installed)

1. Open your browser and go to: `https://git-scm.com/download/win`
2. The download starts automatically — open the `.exe` file
3. Click **Next** on every screen — keep all defaults
4. Click **Install** → **Finish**
5. Close VS Code completely and reopen it
6. Verify installation:
   ```cmd
   git --version
   ```
   Expected output: `git version 2.44.0` (or similar)

---

### Step 2 — Install Node.js (if not installed)

1. Go to: `https://nodejs.org`
2. Click the **LTS** button (left green button)
3. Run the downloaded `.msi` installer
4. Click **Next** on every screen — keep all defaults
5. Click **Install** → **Finish**
6. **Restart your computer**
7. Verify installation:
   ```cmd
   node --version
   npm --version
   ```
   Expected output: `v20.x.x` and `10.x.x`

---

### Step 3 — Create project folder

Open **CMD** (press `Win + R` → type `cmd` → press Enter):

```cmd
mkdir M:\M_QR_CODE_SCANNER
mkdir M:\M_QR_CODE_SCANNER\backend
mkdir M:\M_QR_CODE_SCANNER\mobile
mkdir M:\M_QR_CODE_SCANNER\mobile\src
mkdir M:\M_QR_CODE_SCANNER\mobile\src\screens
mkdir M:\M_QR_CODE_SCANNER\mobile\src\services
mkdir M:\M_QR_CODE_SCANNER\mobile\src\utils
```

---

### Step 4 — Download Backend from GitHub

```cmd
cd M:\M_QR_CODE_SCANNER
git clone https://github.com/Nagendra0012/qr-scanner-backend.git backend
```

Verify it worked:
```cmd
dir M:\M_QR_CODE_SCANNER\backend
```

You should see:
```
.gitignore
package.json
server.js
```

---

### Step 5 — Download Mobile App from GitHub

```cmd
cd M:\M_QR_CODE_SCANNER
git clone https://github.com/Nagendra0012/qr-scanner-mobile.git mobile
```

Verify it worked:
```cmd
dir M:\M_QR_CODE_SCANNER\mobile
```

You should see:
```
src\
App.js
app.json
babel.config.js
package.json
.gitignore
```

---

## 6. Backend Setup

### Step 1 — Navigate to backend folder

```cmd
cd M:\M_QR_CODE_SCANNER\backend
```

### Step 2 — Install dependencies

```cmd
npm install
```

Wait 2-3 minutes for all packages to download.

### Step 3 — Create environment file

```cmd
copy NUL .env
```

Open `.env` in Notepad and paste:

```
VIRUSTOTAL_API_KEY=your_virustotal_key_here
GOOGLE_SAFE_BROWSING_API_KEY=your_google_key_here
PORT=3001
FRONTEND_URL=*
```

Save the file. See Section 8 for how to get the API keys.

### Step 4 — Verify backend files

```cmd
dir M:\M_QR_CODE_SCANNER\backend
```

You must see ALL of these:
```
node_modules\       ← created by npm install
.env                ← created by you
.gitignore
package.json
server.js
```

### Step 5 — Test the backend

```cmd
node server.js
```

Expected output:
```
🛡️  QR Security Scanner backend running on http://localhost:3001
   VirusTotal API:      ✅ configured
   Google SafeBrowsing: ✅ configured
```

Leave this CMD window open — the backend must keep running.

### Step 6 — Verify in browser

Open your browser and go to:
```
http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "virusTotalConfigured": true,
  "safeBrowsingConfigured": true
}
```

---

## 7. Mobile App Setup

### Step 1 — Navigate to mobile folder

Open a NEW CMD window (keep the backend one open):

```cmd
cd M:\M_QR_CODE_SCANNER\mobile
```

### Step 2 — Install dependencies

```cmd
npm install --legacy-peer-deps
```

Wait 3-5 minutes for all packages to download.

### Step 3 — Install Expo Go on your phone

- **Android:** Open Google Play Store → search "Expo Go" → Install
- **iPhone:** Open App Store → search "Expo Go" → Install

### Step 4 — Configure backend URL

Open `M:\M_QR_CODE_SCANNER\mobile\src\config.js` in VS Code.

If running locally (same WiFi):
1. Find your PC's IP address — open CMD and run `ipconfig`
2. Look for **IPv4 Address** under WiFi adapter e.g. `192.168.1.15`
3. Update the file:
   ```js
   export const BACKEND_URL = 'http://192.168.1.15:3001';
   ```

If using Railway (deployed backend):
```js
export const BACKEND_URL = 'https://your-railway-url.up.railway.app';
```

Press **Ctrl+S** to save.

### Step 5 — Start the development server

```cmd
npx expo start --clear
```

A QR code appears in the terminal.

### Step 6 — Open on your phone

**Android:**
1. Open Expo Go app
2. Tap **"Scan QR code"**
3. Scan the QR code from your terminal

**iPhone:**
1. Open the built-in Camera app
2. Point at the QR code in terminal
3. Tap the notification to open in Expo Go

The app loads on your phone in 20-30 seconds.

---

## 8. API Key Configuration

### VirusTotal API Key (Free)

1. Open browser and go to: `https://www.virustotal.com/gui/sign-in`
2. Click **"Join us"** to create a free account
3. Verify your email address
4. Log in to your account
5. Click your **profile icon** in the top right corner
6. Click **"API Key"**
7. Copy the long string of letters and numbers
8. Paste it in your `.env` file:
   ```
   VIRUSTOTAL_API_KEY=paste_your_key_here
   ```

Free tier limits: 4 requests per minute, 500 per day

---

### Google Safe Browsing API Key (Free)

1. Go to: `https://console.cloud.google.com`
2. Sign in with your Google account
3. Click **"Select a project"** at the top
4. Click **"New Project"**
5. Name it `qr-scanner` → click **"Create"**
6. In the search bar at the top type: `Safe Browsing API`
7. Click **"Safe Browsing API"** in results
8. Click the blue **"Enable"** button
9. Wait 10 seconds
10. Click **"Credentials"** in the left menu
11. Click **"+ Create Credentials"** → **"API Key"**
12. In the dropdown click **"Select API restrictions"**
13. Search for **"Safe Browsing"** → select it → click **OK**
14. Click **"Create"**
15. Copy the key that appears
16. Paste it in your `.env` file:
    ```
    GOOGLE_SAFE_BROWSING_API_KEY=paste_your_key_here
    ```

---

## 9. Running the Application

### Every time you want to use the app follow these steps:

#### Terminal 1 — Start Backend

```cmd
cd M:\M_QR_CODE_SCANNER\backend
node server.js
```

Keep this window open.

#### Terminal 2 — Start Mobile App

```cmd
cd M:\M_QR_CODE_SCANNER\mobile
npx expo start --clear
```

Keep this window open.

#### On Your Phone

1. Open **Expo Go**
2. Your app appears under **"Recently opened"** — tap it
3. OR scan the QR code shown in Terminal 2

---

## 10. Testing the Application

### How to test correctly

IMPORTANT: Always scan QR codes using the camera INSIDE your app — not your phone's default camera app.

Correct flow:
1. Open Expo Go → your app loads
2. Tap **"Scan with Camera"** button
3. Point camera at test QR code
4. Results appear automatically

### Generate test QR codes

Go to: `https://www.qr-code-generator.com`

Generate QR codes for these URLs to test each risk level:

#### LOW Risk (Green) — Expected score: 0-29
```
https://www.google.com
https://www.github.com
https://www.microsoft.com
```

#### MEDIUM Risk (Yellow) — Expected score: 30-69
```
http://bit.ly/testlink
http://example.com/login/verify/account
```

#### HIGH Risk (Red) — Expected score: 70-100
```
http://192.168.1.1/login/verify/password/confirm
http://paypal-secure-login.tk/verify/account/confirm
http://amazon-account-suspended.xyz/login/verify
```

### What to verify in each scan

- Risk banner shows correct color (green/yellow/red)
- Threat score matches expected range
- Findings list shows correct threats and warnings
- VirusTotal results appear (if API key configured)
- Safe Browsing results appear (if API key configured)
- No URL is opened automatically

---

## 11. How the App Works

### QR Code Scanning Process

1. User opens the Scanner screen
2. Camera activates and continuously captures frames
3. Each frame is analyzed by jsQR library
4. When a QR code is detected the phone vibrates
5. The camera frame is captured as an image
6. Image is sent to the backend via HTTP POST request
7. Backend decodes the QR code using jsQR + Jimp
8. Extracted URL goes through threat analysis
9. Results returned to the mobile app
10. Result screen displays the full threat report

### Image Upload Process

1. User opens the Upload screen
2. User picks an image from gallery or takes a photo
3. Image is sent to the backend via HTTP POST request
4. Backend decodes the QR code from the image
5. Extracted URL goes through threat analysis
6. Results returned to the mobile app
7. Result screen displays the full threat report

### Offline Fallback

If the backend is unreachable the app automatically falls back to client-side heuristic analysis. This means:
- QR code is decoded locally on the phone using jsQR
- 13+ heuristic checks still run
- VirusTotal and Safe Browsing checks are skipped
- Result is marked as "Local Scan"

---

## 12. Threat Detection System

### Heuristic Checks (Always Run)

| Check ID | What it detects | Threat Score |
|---|---|---|
| JS_URI | JavaScript URI — direct code execution | +100 |
| VBSCRIPT | VBScript URI — code execution | +100 |
| DATA_URI | Data URI — embedded malicious content | +80 |
| HOMOGRAPH | Non-ASCII domain characters | +45 |
| BRAND | Brand name in unofficial domain | +40 |
| MALFORMED | Invalid/unparseable URL | +40 |
| IP_HOST | Raw IP address as hostname | +35 |
| ENC_HOST | Percent-encoded hostname | +30 |
| SUSPICIOUS_TLD | High-risk top-level domain | +20 |
| SHORTENER | URL shortener detected | +20 |
| DBL_ENCODE | Double URL-encoding | +15 |
| SUBDOMAINS | Unusually deep subdomain chain | +15 |
| NO_HTTPS | Unencrypted HTTP connection | +10 |
| LONG_URL | Excessively long URL | +10 |
| PHISH_KW | Phishing keywords in URL path | +5 each |

### Risk Level Calculation

| Score Range | Risk Level | Color |
|---|---|---|
| 0 — 29 | LOW | Green |
| 30 — 69 | MEDIUM | Yellow |
| 70 — 100 | HIGH | Red |

Note: Any VirusTotal malicious detection OR Safe Browsing threat automatically sets risk to HIGH regardless of heuristic score.

### External API Checks

**VirusTotal:**
- Submits URL to VirusTotal for analysis
- Waits 3.5 seconds for analysis to complete
- Fetches results showing detections from 70+ engines
- Returns count of malicious, suspicious, harmless detections

**Google Safe Browsing:**
- Checks URL against Google's threat database
- Detects: MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, POTENTIALLY_HARMFUL_APPLICATION
- Returns safe/unsafe status with threat types

---

## 13. App Screens Guide

### Home Screen

What you see:
- QR Threat Scanner logo and title
- "Scan with Camera" button — opens live camera scanner
- "Upload an Image" button — opens image picker
- Feature pills showing detection capabilities
- Privacy notice

### Scanner Screen

What you see:
- Full-screen camera view
- Targeting frame with corner brackets
- Animated scan line moving up and down
- Flashlight toggle button (top right)
- Close button (top left)

How to use:
1. Hold phone steady
2. Align QR code inside the frame
3. App detects QR code automatically
4. Phone vibrates when detected
5. "Analyzing..." appears while checking threats
6. Results screen opens automatically

### Upload Screen

What you see:
- Image drop zone / picker area
- "Take a New Photo" button
- "Scan for Threats" button (disabled until image selected)
- How it works guide

How to use:
1. Tap the image area to open gallery
2. Select a photo containing a QR code
3. Preview appears in the image area
4. Tap "Scan for Threats"
5. Results screen opens

### Result Screen

What you see:
- Risk banner (green/yellow/red) with risk level label
- Threat score (0-100) with score bar
- QR content section showing the decoded URL
- Content type badge (URL/EMAIL/PHONE/WIFI etc.)
- Heuristic findings — list of threats and warnings
- VirusTotal results — engine detection counts
- Google Safe Browsing results — threat status
- Scan details — timestamp and duration
- Action buttons — Copy Report, Share Report, Scan Another

---

## 14. Deploying the Backend

### Deploy to Railway (Free)

Railway hosts your backend so it runs 24/7 and is accessible from anywhere.

#### Step 1 — Create Railway account
1. Go to: `https://railway.app`
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway
4. Verify your phone number

#### Step 2 — Connect GitHub repository
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Click **"Configure GitHub App"**
4. Select `qr-scanner-backend`
5. Click **"Install & Authorize"**
6. Select the repository
7. Click **"Deploy Now"**

#### Step 3 — Add environment variables
1. Click your project → click the service box
2. Click **"Variables"** tab
3. Add each variable:

| Variable Name | Value |
|---|---|
| VIRUSTOTAL_API_KEY | your key |
| GOOGLE_SAFE_BROWSING_API_KEY | your key |
| FRONTEND_URL | * |

#### Step 4 — Get your live URL
1. Click **"Settings"** tab
2. Click **"Generate Domain"**
3. Copy the URL e.g. `https://qr-scanner-backend-production.up.railway.app`

#### Step 5 — Test deployment
Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Expected response:
```json
{"status":"ok","virusTotalConfigured":true,"safeBrowsingConfigured":true}
```

#### Step 6 — Update mobile app config
Open `src/config.js` and update:
```js
export const BACKEND_URL = 'https://your-railway-url.up.railway.app';
```

---

## 15. Building for Production

### Build Android APK/AAB using EAS

#### Step 1 — Install EAS CLI
```cmd
npm install -g eas-cli
```

#### Step 2 — Login to Expo
```cmd
eas login
```
Enter your Expo account credentials. Create free account at `https://expo.dev` if needed.

#### Step 3 — Initialize EAS
```cmd
cd M:\M_QR_CODE_SCANNER\mobile
eas init
```

#### Step 4 — Configure build
```cmd
eas build:configure
```
Select **Android** when asked about platforms.

#### Step 5 — Build for Google Play Store (AAB format)
```cmd
eas build --platform android --profile production
```

When asked:
- Generate new keystore? → Y
- iOS encryption? → Y

Wait 10-15 minutes. Download link appears when done.

#### Step 6 — Build for direct installation (APK format)
```cmd
eas build --platform android --profile preview
```

This builds a direct installable APK you can share via WhatsApp or email.

#### Step 7 — Build for both platforms
```cmd
eas build --platform all --profile production
```

---

## 16. Publishing to Google Play Store

### Requirements
- Google Play Developer Account ($25 one-time fee)
- Signed AAB file (built in Section 15)
- App icon 512x512 PNG
- Feature graphic 1024x500 PNG
- At least 2 screenshots

### Step 1 — Create Developer Account
1. Go to: `https://play.google.com/console`
2. Sign in with Google account
3. Pay $25 one-time registration fee
4. Fill in developer profile
5. Wait 1-3 days for identity verification

### Step 2 — Create App
1. Click **"Create app"**
2. Fill in:
   - App name: `QR Threat Scanner`
   - Default language: `English (United States)`
   - App or game: `App`
   - Free or paid: `Free`
3. Check declaration boxes
4. Click **"Create app"**

### Step 3 — Fill Store Listing
Click **"Main store listing"** and fill in:

Short description (80 chars):
```
Scan QR codes and instantly detect malicious URLs and phishing threats.
```

Full description:
```
QR Threat Scanner protects you from malicious QR codes.

Features:
• Live camera QR code scanning
• Upload images containing QR codes
• 13+ heuristic threat detection checks
• VirusTotal integration — 70+ antivirus engines
• Google Safe Browsing integration
• Instant risk assessment (LOW, MEDIUM, HIGH)
• Detailed threat reports
• Share scan reports

Stay safe from phishing, malware, and brand impersonation attacks.
Your privacy is protected — URLs are never opened automatically.
```

### Step 4 — Upload Graphics
- App icon: 512×512 PNG
- Feature graphic: 1024×500 PNG
- Screenshots: minimum 2 phone screenshots

### Step 5 — Complete Required Sections
Complete all sections in the left sidebar:
- App content → Content rating → Fill questionnaire
- App content → Target audience → Select 18+
- App content → App access → All functionality available
- App content → Ads → No ads
- App content → Data safety → Fill accurately

### Step 6 — Create Production Release
1. Click **"Production"** in left menu
2. Click **"Create new release"**
3. Click **"Upload"** → select your `.aab` file
4. Release name: `1.0.0`
5. Release notes: `Initial release`
6. Click **"Save"** → **"Review release"**
7. Fix any warnings shown
8. Click **"Start rollout to Production"**

### Step 7 — Wait for Review
Google reviews apps in 3-7 business days. You receive an email when approved.

---

## 17. Troubleshooting

### Backend Issues

| Problem | Cause | Fix |
|---|---|---|
| `package.json not found` | Wrong directory | Run `cd M:\M_QR_CODE_SCANNER\backend` first |
| `npm not recognized` | Node.js not installed | Install from nodejs.org and restart PC |
| `Cannot find module 'jimp'` | Dependencies not installed | Run `npm install` |
| `Port 3001 already in use` | Another process using port | Run `npx kill-port 3001` |
| `VirusTotal configured: false` | API key not in .env | Check .env file has correct key name |
| `Application failed to respond` | Railway port mismatch | Remove PORT variable from Railway |

### Mobile App Issues

| Problem | Cause | Fix |
|---|---|---|
| `package.json not found` | Wrong directory | Run `cd M:\M_QR_CODE_SCANNER\mobile` first |
| Expo SDK version mismatch | Old package.json | Update expo to ~54.0.0 in package.json |
| `react-native-worklets error` | Reanimated v4 conflict | Remove react-native-reanimated from package.json |
| App stuck on loading | Network issue | Run `npx expo start --tunnel` |
| Camera not working | Permission denied | Tap Allow when app asks for camera permission |
| QR code not detected | Poor lighting | Improve lighting or try image upload instead |
| Backend not reachable | Wrong IP or backend offline | Check BACKEND_URL in config.js and ensure backend is running |
| URL being opened | Scanning outside app | Use camera INSIDE the app not phone camera |

### Windows-Specific Issues

| Problem | Fix |
|---|---|
| `rmdir /s /q` fails in PowerShell | Use `Remove-Item -Recurse -Force node_modules` |
| Scripts disabled error | Run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Git asks for password | Use Personal Access Token from github.com/settings/tokens |
| Drive not found | Run `M:` first to switch to M drive |

---

## 18. Frequently Asked Questions

**Q: Does the app work without API keys?**  
A: Yes. Without API keys the app runs heuristic analysis only (13+ checks). VirusTotal and Safe Browsing results will not appear but the app still detects many threats.

**Q: Is my data stored anywhere?**  
A: No. Images are processed and immediately discarded. No scan history is saved anywhere.

**Q: Can the app open malicious URLs accidentally?**  
A: No. The app never opens any URL automatically. It only displays the threat analysis report.

**Q: Why does the backend show "Application failed to respond"?**  
A: Railway uses a proxy — make sure `app.set('trust proxy', 1)` is in server.js and the PORT variable is not manually set in Railway variables.

**Q: Why is my risk score always 0?**  
A: The heuristic engine only scores URLs (http/https). If the QR code contains plain text, a phone number, WiFi credentials, or vCard contact, the score will be 0 which is correct behavior.

**Q: Can I use this app without the backend?**  
A: Yes. Set `CLIENT_ONLY_MODE = true` in `src/config.js`, and the app runs entirely on your phone using heuristics only.

**Q: How many scans can I do for free?**  
A: VirusTotal free tier allows 4 scans per minute and 500 per day. Google Safe Browsing has no practical limit for normal usage. Heuristic analysis has no limits.

**Q: Does this work on iPhone?**  
A: Yes. The app is built with React Native, which supports both Android and iOS. You need an Apple Developer Account ($99/year) to publish to the App Store.

**Q: What QR code types does the app support?**  
A: URL, Email (mailto:), Phone (tel:), SMS (smsto:), WiFi, vCard contacts, Calendar events, Crypto wallets, and plain text. Threat analysis runs only on URL types.

**Q: How accurate is the threat detection?**  
A: The heuristic engine catches common patterns with low false positives. VirusTotal and Safe Browsing significantly improve accuracy. No system is 100% accurate — always use your judgment.

---

## Contact and Support

- **GitHub Backend:** https://github.com/Nagendra0012/qr-scanner-backend
- **GitHub Mobile:** https://github.com/Nagendra0012/qr-scanner-mobile
- **Expo Project:** https://expo.dev/accounts/lucy0078/projects/qr-threat-scanner
- **Railway Backend:** Check your Railway dashboard for the live URL

---

*Documentation version 1.0.0 — Last updated May 2026*
