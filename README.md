# Pashu Pehchaan (ಪಶು ಗುರುತು / पशु पहचान)

> **AI-Powered Indian Cattle & Buffalo Breed Recognition & Digital Animal Passport Platform**
> Grounded in ICAR-NBAGR taxonomies, built with React 19, Node.js 22, Express, Google Gemini 2.5 Flash Vision, and Capacitor for Android.

---

## 🌟 Key Features

1. **AI Vision & Breed Classification**
   - Direct image analysis via **Google Gemini 2.5 Flash Vision**.
   - Resemblance breakdown across multiple phenotypes (coat, horn curvature, hump structure, ear shape).
   - Authoritative ICAR-NBAGR accession codes (e.g., `INDIA_CATTLE_0400_GIR_03003`, `INDIA_BUFFALO_0500_MURRAH_01001`).
   - Zero mock data in production: real biological attributes, agricultural utility, dairy metrics, and heat tolerance.

2. **Digital Animal Passport (PDF Generation)**
   - Downloadable vector PDF passport formatted with ICAR accession code, identification timestamp, physical traits, and native region.
   - One-click **Download PDF** and native **Web Share / Copy Link** integration.

3. **Advanced Analytics Dashboard**
   - Total scans tracked in local storage.
   - Cattle vs. Buffalo species distribution.
   - Top 5 identified breeds distribution chart.
   - Monthly scan activity trends.
   - Geographical and state-level scan distributions.

4. **Bilingual Support (English & Kannada / ಕನ್ನಡ)**
   - Header language toggle with persistent user preference stored in `localStorage`.
   - Complete translations for navigation, dashboard statistics, camera capture instructions, breed comparison, and farmer advisories.

5. **Camera & Gallery Integration**
   - In-app **WebRTC Live Camera Viewfinder** with real-time video streaming, front/rear camera switching, and alignment guidelines.
   - Direct file picker supporting JPG, PNG, WEBP, and HEIC up to 20MB.

6. **Breed Comparison Tool**
   - Side-by-side comparison of 2 or 3 Indian indigenous breeds.
   - Evaluates native breeding tracts, horn shape, coat coloration, lactation yields, and draught utility.

7. **History & CSV Data Export**
   - Real-time search, filter by species (Cattle / Buffalo), and sorting.
   - Export scan history to CSV (`pashu-scan-records.csv`) for field veterinarians and agricultural extension officers.
   - Direct PDF passport regeneration for any previous scan.

8. **Farmer Information & Advisory Section**
   - **Rashtriya Gokul Mission (RGM)** guidelines and indigenous breed conservation grants.
   - A1 vs A2 beta-casein scientific advantages of Indian Zebu cattle (*Bos indicus*).
   - Seasonal fodder, silage management, and balanced ration formulas.
   - Complete vaccination calendar for FMD, HS, BQ, and Brucellosis.
   - Clear distinction between verified ICAR standards and AI vision estimations.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide Icons
- **Backend**: Node.js 22, Express, Multer, `@google/genai` (Gemini 2.5 Flash)
- **PDF Generation**: `jspdf`
- **Mobile Runtime**: Capacitor 7 (`@capacitor/core`, `@capacitor/cli`)
- **Package Manager**: npm

---

## 🚀 Local Development

### Prerequisites
- Node.js 20+ or 22+
- npm 9+
- A Google Gemini API key (`GEMINI_API_KEY`)

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/Sinchana-web/major-project.git
cd major-project

# 2. Install all dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and insert your GEMINI_API_KEY=your_key_here

# 4. Start local development server
npm run dev
```

The unified full-stack server starts on **http://localhost:3000** (handles both API endpoints and React Vite client).

---

## 📦 Production Build & Deployment

### Build Command
```bash
npm run build
```
This compiles the TypeScript Vite client to the `/dist` directory.

### Start Command
```bash
npm start
```
Runs `tsx server.ts`, which serves the production build from `/dist` and provides the backend API on port `3000` (or `process.env.PORT`).

### Deploying to Render.com
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository: `https://github.com/Sinchana-web/major-project`.
3. Set the following build and start configurations:
   - **Environment**: `Node`
   - **Node Version**: `22.x` (or `20.x`)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API Key)*
   - `NODE_ENV`: `production`

---

## 📱 Building the Android APK with Capacitor

This project is pre-configured with `capacitor.config.ts` (`appId: in.pashu.pehchaan`, `appName: Pashu Pehchaan`).

### Steps to Generate Android APK:

1. **Build the production web assets:**
   ```bash
   npm run build
   ```

2. **Add the Android platform (first time only):**
   ```bash
   npx cap add android
   ```

3. **Sync web code and plugins into the Android project:**
   ```bash
   npx cap sync
   ```

4. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

5. **Generate APK in Android Studio:**
   - In Android Studio, go to `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`.
   - Or to build from command line:
     ```bash
     cd android
     ./gradlew assembleDebug
     ```
   - The compiled debug APK will be created at:
     `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 Security & Privacy

- **Zero Key Leakage**: `GEMINI_API_KEY` is strictly read on the Node.js Express server (`server.ts` / `src/server/breedService.ts`). It is never bundled into client-side JS.
- **Input Validation**: Multer enforces file format whitelisting (`image/jpeg`, `image/png`, `image/webp`, `image/heic`) and 20MB file size limits.
- **Zero Owner Telemetry**: Conforms with ICAR-NBAGR public breed registry ethics; no private farmer biometric data or telemetry is collected.

---

## 📜 ICAR-NBAGR Breed Coverage

Includes 14+ indigenous Indian breeds:
- **Cattle**: Gir, Sahiwal, Hallikar, Amritmahal, Deoni, Kankrej, Ongole, Krishna Valley, Malnad Gidda, Kangayam, Tharparkar.
- **Buffalo**: Murrah, Jaffarabadi, Surti.
