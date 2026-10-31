# Changelog

All notable changes to the **Kando Japanese (感動)** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.16] - 2026-10-31

### 🚀 Major Platform Upgrade from Version 1.0.0

#### ✍️ Authentic KanjiVG Stroke Order & Trajectory Evaluator
- **Authentic Calligraphy Data**: Pre-bundled all 831+ Joyo and JLPT kanji with verified KanjiVG vector stroke data aligned with Japanese Ministry of Education standards.
- **Intelligent Stroke Recognition**: Implemented [`strokeEvaluator.js`](src/utils/strokeEvaluator.js) providing vector dot-product direction checks, segment tangent angle deviation, spatial bounding checks, and reverse stroke detection.
- **Tiered Real-Time Feedback**: Replaced naive stroke counting with verified score thresholds:
  - Exact High Match (≥ 75%): `✓ Perfect!` in emerald green.
  - Moderate Match (50% – 74%): `⚠️ Check stroke shape & position` in amber.
  - Low Match (< 50%): `❌ Strokes do not match. Follow the guide!` in rose.
- **Unified Dual-Pane Learning Modal**: Redesigned kanji inspection into a zero-scroll dual-pane modal with animated Play All, step-by-step navigation, 5–6 verified examples with individual native audio, and one-tap SRS bookmarking.

#### 📖 Long-Form Graded Readers (Phase 1)
- **10–12 Minute Immersive Stories**: Rewrote N5 pilot stories into extended narrative journeys (28–30 sentences each) with structured vocabulary, grammar, particle, and kanji highlights.
- **Sentence-Level Audio Player**: Built audio controller supporting speed adjustment (`0.8x`, `1.0x`, `1.2x`), auto-advance, and loop mode.
- **Pedagogical Assessment**: Introduced story-specific quizzes with custom explanations for every option (both correct answers and distractors).

#### 🌸 3D Interactive AI Sensei (Hana)
- **Real-Time 3D VRM Model**: Seamlessly integrated Three.js / VRM 3D interactive teacher with natural Japanese pronunciation, idle breathing, and facial expressions.
- **Scenario Conversation Dojos**: Real-world dialogue simulations with audio speech synthesis and speech recognition lab.

#### 🌐 Internationalization & Curriculum Alignment
- **Trilingual Parity**: Complete coverage across English, Tamil (`தமிழ்`), and Hindi (`हिन्दी`) for all vocabulary, kanji definitions, grammar notes, and interface strings.
- **SuperMemo-2 Spaced Repetition (SRS)**: Advanced Leitner/SM-2 interval scheduling with optimistic local persistence and backend cloud sync.
- **Unified Platform Versioning**: Added centralized version configuration (`src/config/version.ts`) and live version status in Settings and Navigation rails.

---

## [1.0.0] - 2026-08-20

### Initial Release
- Basic Kana Studio with Hiragana and Katakana tables.
- Core JLPT N5–N1 curriculum browse view.
- Preliminary quiz engine and basic spaced repetition reviewer.
- Initial dashboard, streak tracker, and user profiles.
