# Madina Masjid Medavakkam Community Mobile App

A modern, peaceful, and accessible mobile web application for Masjid prayers, events, community services, Qibla compass, Tasbeeh counter, daily Duas, and Islamic life. Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

---

## 🚀 Quick Vercel Deployment Guide

This project is fully optimized and ready for zero-configuration or one-click deployment on **Vercel**.

### Vercel Project Settings Summary

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (leave default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | `18.x`, `20.x`, or `22.x` (all supported) |
| **Required Environment Variables** | None (100% self-contained frontend) |

---

### Step-by-Step Deployment Instructions

#### Method 1: Deploy via GitHub & Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Madina Masjid Medavakkam Community App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** > **"Project"**.
   - Select your GitHub repository.

3. **Verify Build Settings**:
   - Vercel automatically detects `Vite` thanks to `vercel.json` and `vite.config.ts`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Deploy**:
   - Click **"Deploy"**.
   - In less than 1 minute, your live site will be deployed at `https://your-project.vercel.app`.

---

#### Method 2: Deploy using Vercel CLI

1. **Install Vercel CLI globally (if not already installed)**:
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel
   ```
   Follow the interactive prompts (select default options).

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

---

## 🛠 Local Development & Testing

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Production Build Locally
```bash
npm run build
```
This generates the optimized production bundle inside the `dist/` folder.

### 4. Preview the Production Build
```bash
npm run preview
```
Serves the `dist/` directory at `http://localhost:3000`.

---

## 📁 Key Project Files

- **`vercel.json`**: Configures Vercel's Vite framework detection and Single Page Application (SPA) URL rewrites so deep links and page refreshes work seamlessly.
- **`vite.config.ts`**: Configured with `@tailwindcss/vite`, `@vitejs/plugin-react`, cross-environment path resolution, and clean output directory management.
- **`package.json`**: Standard dependencies and scripts (`build`, `dev`, `preview`, `lint`, `clean`).
- **`index.html`**: Clean HTML5 document with mobile viewport-fit optimizations, web fonts, favicons, and OpenGraph metadata.
- **`src/`**: All application logic, screens, components, audio engine, haptics, and mock community data.
- **`public/`**: Static assets, including `favicon.svg` and `favicon.ico`.

---

## 🕌 Application Architecture & Features

- **Mobile Shell Experience**: Focused mobile layout optimized for smartphones and mobile browsers (`viewport-fit=cover`, `-webkit-tap-highlight-color`).
- **Interactive Salah Timetable**: Countdown timer to next prayer, Adhan & Iqamah schedules, Jama'ah notices, and calculation methods.
- **Synthesized Audio Adhan & Chimes**: Built-in Web Audio API synthesizer for Makkah, Madinah, Al-Aqsa maqams, soothing Bismillah chime, and custom MP3 file upload support.
- **Tactile Haptic Feedback**: Native vibration API integration combined with micro-acoustic clicks for Tasbeeh beads.
- **Digital Tasbeeh Counter**: Target counts (33, 99, 100), Dhikr presets (SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah), and progress tracking.
- **Qibla Compass**: Interactive directional indicator to Ka'bah (Makkah).
- **Masjid Locator**: Interactive list of nearby mosques with distance, directions, and facilities.
- **Events & Services**: Registration forms, Jummah booking, funeral services, matrimonial, and community education.
- **Elderly / Senior Text Mode**: One-tap toggle for enlarged text hierarchy and higher visual contrast.
- **Multi-language Support**: English, Tamil (தமிழ்), and Arabic (العربية).

---

## 📄 License
MIT License. Open for community use.
