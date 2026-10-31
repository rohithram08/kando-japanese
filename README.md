# Kando Japanese (感動) — JLPT Mastery Platform

<div align="center">

![Kando Japanese Banner](https://img.shields.io/badge/%E6%84%9F%E5%8B%95-Kando%20Japanese-3b82f6?style=for-the-badge&logo=japan&logoColor=white)
<br/>

**The modern, interactive, and pedagogically authentic platform for mastering the Japanese Language Proficiency Test (JLPT N5 → N1).**

[![Platform Version](https://img.shields.io/badge/version-2.1.16-blue?style=flat-square&logo=semver)](package.json)
[![Build Status](https://img.shields.io/badge/Vite%20Build-Passing-emerald?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Test Suite](https://img.shields.io/badge/Vitest-78%20Files%20%2F%201605%20Tests%20Passing-brightgreen?style=flat-square&logo=vitest)](https://vitest.dev/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20VRM%20Sensei-black?style=flat-square&logo=three.js)](https://threejs.org/)
[![JLPT Levels](https://img.shields.io/badge/JLPT-N5%20|%20N4%20|%20N3%20|%20N2%20|%20N1-orange?style=flat-square)](#curriculum-levels)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](#)

</div>

---

## 🌟 Overview

**Kando Japanese (感動 - *deep emotional impression & inspiration*)** is an end-to-end Japanese language learning ecosystem built for serious learners. Moving beyond gamified repetition drills, Kando combines **authentic long-form reading passages**, **official stroke-by-stroke KanjiVG stroke orders**, **structured grammar classification**, **SuperMemo-2 spaced repetition (SRS)**, **AI scenario-based conversation dojos**, and a **real-time 3D VRM interactive AI sensei**.

Whether starting from zero with Hiragana and Katakana in the **Kana Studio**, advancing through N5 core vocabulary, or reading long-form stories with real-time furigana and pitch accent, Kando Japanese provides a structured, beautiful, and distraction-free path to fluency.

---

## 🚀 Key Features

### 📖 1. Long-Form Graded Readers (`/reading`)
- **Immersive Stories**: 10–12 minute full-length reading passages designed to develop sustained Japanese reading comprehension.
- **Furigana & Pitch Accent**: Real-time toggleable furigana (Auto / On / Off / Hover) with verified pitch accent markers.
- **Sentence-by-Sentence Audio Player**: Natural Japanese text-to-speech with speed controls (`0.8x`, `1.0x`, `1.2x`), auto-advance, and loop mode.
- **Interactive Vocabulary Drilldown**: Click any annotated word to open instant definition cards, grammar particle breakdowns, and JLPT levels without losing reading position.
- **In-Depth Comprehension Quizzes**: Story-specific assessment questions featuring detailed explanations for every option (both correct and incorrect).

### ✍️ 2. Kanji Mastery & Official Stroke Orders (`/kanji`)
- **100% Authentic KanjiVG Vector Data**: Pre-bundled with verified Japanese Ministry of Education calligraphy paths and stroke directions for all 831+ Joyo/JLPT kanji.
- **Zero-Scroll Unified Learning Modal**:
  - **Left Column**: Prominent kanji character, native pronunciation audio, level badge, On'yomi & Kun'yomi readings with Romaji, radicals, and 5–6 authentic vocabulary examples with individual audio buttons.
  - **Right Column**: Interactive canvas with animated **Play All**, step-by-step playback, numbered guide badges, and practice drawing canvas with stroke validation.
  - **Bottom Action Bar**: One-click **Add to SRS**, sequential navigation (`[< Previous]`, `[Next >]`, keyboard arrow keys), and session completion.

### 🔤 3. Interactive Kana Studio (`/kana`)
- Complete Hiragana and Katakana syllabaries with stroke animations, audio pronunciation, stroke directions, and interactive tracing canvas.
- Audio listening drills and Romaji input practice.

### 🧩 4. Functional Grammar Hub (`/grammar`)
- Thematic category grid: **Particles**, **Verb Forms & Conjugations**, **Adjective Patterns**, **Requests & Permissions**, **Giving & Receiving**, **Conditionals**, and **Keigo**.
- Contextual example sentences with furigana, romaji, and localized nuance breakdowns.

### 🧠 5. Spaced Repetition System (SRS Review — `/review`)
- Intelligent flashcard scheduling based on the **SuperMemo SM-2** algorithm.
- Supports both Kanji and Vocabulary decks with interval scheduling, difficulty ratings (Again, Hard, Good, Easy), and streak metrics.

### 💬 6. AI Conversation Dojo & Speech Lab (`/conversation`, `/speech`)
- Real-world dialogue simulations across everyday scenarios (restaurants, train stations, school, workplace, shopping).
- Free-talk mode with instant grammar error detection, correction explanations, and Japanese audio playback.
- Speech recognition and pronunciation scoring engine.

### 🎎 7. Hana-Sensei 3D VRM Companion (`/sensei`)
- Real-time 3D Japanese teacher powered by **Three.js**, **React Three Fiber**, and **`@pixiv/three-vrm`**.
- Dynamic facial expressions, lip-sync, idle animations, and motivational encouragement.

### 🏆 8. Gamification & Progression Journey
- **Wave XP System**: Earn experience points across reading, practice, quizzes, and reviews.
- **Weekly Competitive Leagues**: Advance through Bronze, Silver, Gold, Platinum, Diamond, and Master leagues with real-time promotion and demotion zones.
- **Level Gating & Placement Tests**: Automatic level qualification tests ensuring learners enter at their appropriate JLPT level while keeping profiles secure.
- **Custom Avatar Studio**: Generate custom avatars with diverse styles powered by DiceBear.

### 🌐 9. Multilingual Learning Support
- Localized vocabulary and curriculum definitions in **English (`en`)**, **Tamil (`ta`)**, **Hindi (`hi`)**, and **Japanese (`ja`)**.
- Instant language switching across all pages.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | React 18, Vite 5, React Router v6 |
| **Language & Tooling** | JavaScript (ESNext), TypeScript, ESLint 9, Node.js |
| **Styling & UI** | Tailwind CSS 3.4, Framer Motion 11, Lucide React, Canvas Confetti |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei`, `@pixiv/three-vrm` |
| **State Management** | Zustand (persistent local & session storage) |
| **Data & Content** | Official KanjiVG vector datasets, JLPT N5–N1 curriculum JSONs, EDICT/JMDict integration |
| **Audio & Speech** | Web Speech API (TTS & SpeechRecognition), Japanese Phonetic Audio Engine |
| **Testing** | Vitest 4, React Testing Library, jsdom |

---

## 📂 Project Architecture

```
nihongo-master/
├── content/                    # Curated JLPT curriculum data
│   ├── kanji/                  # N5 - N1 kanji with examples & stroke counts
│   ├── vocabulary/             # N5 - N1 vocabulary words with readings
│   ├── grammar/                # Grammar patterns, rules & categories
│   ├── stories/                # Source long-form graded reader stories
│   └── translations/           # Multilingual curriculum translations (en, ta, hi)
├── src/
│   ├── components/             # Reusable UI & domain components
│   │   ├── auth/               # Login, registration, profile guards
│   │   ├── kanji/              # StrokeOrder viewer, KanjiDetailModal, drawing canvas
│   │   ├── reading/            # StoryReader, passage controls, VocabLookupModal
│   │   ├── grammar/            # Grammar card grids, category chips, explanations
│   │   ├── sensei/             # 3D VRM Hana-Sensei character canvas & controllers
│   │   ├── league/             # Leaderboards, tier badges, weekly standings
│   │   └── avatar/             # DiceBear custom avatar creator
│   ├── data/                   # Compiled static datasets & verified stroke database
│   │   ├── kanji/              # verifiedKanjiStrokes.json (831+ verified KanjiVG paths)
│   │   ├── reading/            # Compiled expanded long-form stories
│   │   └── pitch/              # Pitch accent lookup tables
│   ├── hooks/                  # Custom React hooks (useStudyLevel, useStoryAudio, etc.)
│   ├── i18n/                   # Multilingual translation dictionaries & locale hooks
│   ├── pages/                  # Top-level application views & route entrypoints
│   ├── services/               # kanjiStrokeService, audioService, api client
│   ├── store/                  # Zustand state stores (auth, srs, settings, progress)
│   └── utils/                  # Romaji convertors, furigana parsers, level calculators
├── scripts/                    # Build tools, KanjiVG parsers, story generators
└── docs/                       # Architecture specs, audits & curriculum design docs
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohithram08/kando-japanese.git
   cd kando-japanese
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Kando Japanese maintains a strict testing bar with automated verification for curriculum parity, level gating, audio playback, and stroke accuracy:

```bash
# Run all unit and integration tests
npm test

# Run Vitest in watch mode
npx vitest

# Run ESLint linter
npm run lint

# Build production bundle
npm run build
```

**Test Coverage Summary**:
- **78 test files / 1,605+ automated tests passing**
- 100% stroke order parity across all N5 and N4 kanji
- Level gating and placement security tests
- Multilingual translation key coverage across all supported locales

---

## 📚 Curriculum Breakdown

| Level | Kanji | Vocabulary | Grammar Points | Graded Readers |
|---|---|---|---|---|
| **JLPT N5** | 124 | 700+ | 80+ | Full Long-Form Stories |
| **JLPT N4** | 190 | 1,200+ | 110+ | Complete Curriculum |
| **JLPT N3** | 239 | 1,800+ | 140+ | Complete Curriculum |
| **JLPT N2** | 367 | 2,500+ | 160+ | Complete Curriculum |
| **JLPT N1** | 40+ (Core) | 3,000+ | 120+ | Advanced Modules |

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Ensure all tests pass (`npm test && npm run build`).
4. Commit your changes (`git commit -m 'feat: add amazing feature'`).
5. Push to the branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## 📄 Acknowledgements & Data Sources

- **[KanjiVG](https://kanjivg.tagaini.net/)**: Vector graphics stroke order data created by Ulrich Apel and released under Creative Commons Attribution-Share Alike 3.0.
- **[EDICT / JMDict](http://www.edrdg.org/)**: Japanese-English Electronic Dictionary files property of the Electronic Dictionary Research and Development Group.
- **[Three.js](https://threejs.org/) & [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)**: WebGL 3D avatar animation runtimes.
- **[DiceBear](https://dicebear.com/)**: Avatar design library.

---

<div align="center">
  <sub>Crafted with ❤️ for Japanese learners worldwide. 頑張ってください！</sub>
</div>
