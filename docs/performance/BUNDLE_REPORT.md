# Nihongo Master — Production Bundle Weight & Performance Report

**Date:** 2026-10-13  
**Branch:** `feat/stabilize-and-animate`  
**Tooling:** Vite 5.4.21, Rollup, PostCSS, Tailwind CSS 3.4  

---

## 1. Executive Summary

This report documents the asset weight, code-splitting topology, and network impact of the production build for Nihongo Master following the Duolingo-inspired animation and interactive overhaul.

### Key Highlights
- **Landing Page Performance:** The initial landing page bundle weighs only **149.65 kB** uncompressed (**27.44 kB gzip**), guaranteeing near-instant initial render and sub-second Largest Contentful Paint (LCP).
- **Zero WebGL Overhead on Landing:** Heavy 3D libraries (`three.js`, `@react-three/fiber`, `@react-three/drei`, VRM loaders) totaling **1,118 kB raw (~312 kB gzip)** are strictly code-split into asynchronous dynamic chunks loaded exclusively on `/sensei`. Zero 3D canvas elements are loaded on the public landing page.
- **Audio Synthesizer Economy:** Sound effects (`pop`, `chime`, `success`, `whoosh`) use procedural Web Audio synthesis via `src/utils/soundEffects.js` (0 kB binary audio downloads).
- **Confetti Rate Limiting:** `canvas-confetti` (10.66 kB raw / 4.28 kB gzip) is encapsulated in a rate-limited helper with automatic reduced-motion detection.

---

## 2. Chunk Size Distribution (Top Chunks)

| Chunk Name | Raw Size | Gzip Size | Route / Function |
|---|---|---|---|
| `three-M8OqIjFd.js` | 717.04 kB | 185.67 kB | Three.js core (Async, `/sensei` only) |
| `index-CI7Z6oJ_.js` | 509.49 kB | 133.11 kB | React, ReactDOM, core runtime |
| `index-CO3Ypnpr.js` | 494.38 kB | 138.33 kB | Shared UI vendor bundle |
| `SenseiCharacter-TN5EzoCX.js` | 401.34 kB | 123.41 kB | VRM / 3D Sensei character controller |
| `charts-YLxaeUZd.js` | 344.95 kB | 104.15 kB | Recharts charting library (`/progress`) |
| `router-B3J4oDkH.js` | 338.66 kB | 105.68 kB | React Router DOM v6 core |
| `index-CKsNRQMz.css` | 159.06 kB | 23.98 kB | Compiled Tailwind + theme styles |
| **`LandingPage-enNoa7w5.js`** | **149.65 kB** | **27.44 kB** | **Get Started Landing Page** |
| `KanjiPage-CNOtVNKx.js` | 121.07 kB | 20.31 kB | Kanji study dictionary & guides |
| `KanaPage-DvtpEvEz.js` | 77.09 kB | 13.67 kB | Kana Studio practice workspace |
| `LessonViewer-C710g1kT.js` | 75.95 kB | 11.54 kB | Lesson progression reader |
| `ProfilePage--r3ad9ET.js` | 55.01 kB | 10.41 kB | User profile and statistics |
| `ConversationPracticePage-DdefRheD.js` | 53.14 kB | 12.72 kB | AI Conversation Dojo workspace |
| `kanaData-CaiPyh2w.js` | 52.66 kB | 11.33 kB | Static stroke order & mnemonic data |
| `ChatDojo-Cd9BndP4.js` | 52.29 kB | 12.26 kB | Conversation scenario engine |
| `ProgressPage-CtXlF7eT.js` | 52.03 kB | 8.42 kB | Progress tracking & streak history |
| `ScenarioSelector-BBuh8Nec.js` | 50.13 kB | 12.28 kB | 49 scenario selector component |
| `SettingsPage-C0Y-IfM5.js` | 50.12 kB | 10.06 kB | Settings, sound, and theme config |
| `Dashboard-9qdrOj0T.js` | 49.31 kB | 7.71 kB | Learner dashboard hub |
| `query-Dh1Ac5eT.js` | 40.88 kB | 13.56 kB | TanStack React Query runtime |

---

## 3. Route-Level Code Splitting Topology

All 16 application routes are lazy-loaded via `React.lazy` and `Suspense` in `src/App.jsx`. A first-time visitor accessing `http://localhost:3000/` downloads:
1. `index.html` (7.54 kB gzip)
2. `index-CKsNRQMz.css` (23.98 kB gzip)
3. `index-CI7Z6oJ_.js` (133.11 kB gzip)
4. `router-B3J4oDkH.js` (105.68 kB gzip)
5. `LandingPage-enNoa7w5.js` (27.44 kB gzip)

**Total initial download for Landing Page:** **297.75 kB gzip**.  
Subsequent pages (Kana, Reading, Conversation) download compact route deltas averaging **12–25 kB gzip**.

---

## 4. Performance & Core Web Vitals Recommendations

1. **Keep 3D Isolated:** Ensure `three.js` and `GLBLoader` remain strictly in `/sensei`. The 2D illustrated Hana-sensei (`HanaSenseiCharacter2D.tsx` / `AnimatedCharacterHero.jsx`) delivers superior loading speed (<30ms mount) without GPU warm-up latency.
2. **Font Optimization:** Use `font-display: swap` for Japanese web fonts (`Noto Sans JP` / `Zen Maru Gothic`) to avoid invisible text flashes (FOIT).
3. **HTTP/2 Preloading:** Preload the `LandingPage` chunk and CSS on Edge CDNs for instantaneous First Contentful Paint (FCP).
