# Nihongo Master — Repository File Inventory & Architecture Map

**Audit Date:** 2026-10-14  
**Auditor:** Antigravity System Audit  
**Repository:** `rohithram08/nihongo_master`  
**Current Git Branch:** `main` (Preserving uncommitted working tree changes)

---

## 1. Executive Structure Overview

Nihongo Master is structured as a dual frontend/backend monorepo:
- **Frontend (`/` root):** Vite 5.4 + React 18 SPA utilizing Tailwind CSS, Framer Motion, Zustand state stores, Lucide icons, and React Router v6.
- **Backend (`/backend`):** Node.js + Express + TypeScript API server utilizing Drizzle ORM connected to TiDB (MySQL dialect), Zod validation, JWT authentication, and bcrypt password hashing.

```
nihongo-master/
├── backend/                  # Express + TypeScript + Drizzle ORM API server
│   ├── src/
│   │   ├── config/           # Environment, CORS, and port configurations
│   │   ├── db/               # Drizzle database client, migrations, and schema
│   │   ├── middleware/       # Auth (JWT), error handler, rate limit, validation (Zod)
│   │   ├── routes/           # Express API route controllers (auth, progress, srs, users, etc.)
│   │   ├── services/         # Business logic (streakService, progressCalculator, senseiService)
│   │   └── types/            # TypeScript type declarations
│   ├── drizzle/              # Generated SQL migrations (0000, 0001, 0002, 0003)
│   └── package.json          # Backend scripts and dependencies
├── src/                      # Frontend Vite + React 18 SPA
│   ├── api/                  # Axios HTTP client wrappers (auth, progress, srs, user)
│   ├── components/           # UI components by domain (auth, common, landing, lessons, quiz, reading, etc.)
│   ├── config/               # Navigation sections and route constants
│   ├── data/                 # Static curriculum files (grammar, kanji, kana, lessons, pitch, reading, vocabulary)
│   ├── hooks/                # Custom React hooks (useAudio, useProgress, useSenseiPageContext, etc.)
│   ├── pages/                # Top-level page views (LandingPage, LessonsPage, KanjiPage, etc.)
│   ├── services/             # Client-side services (audioService.js)
│   ├── store/                # Zustand client state stores (authStore, progressStore, srsStore, themeStore, etc.)
│   ├── types/                # Frontend TypeScript declarations
│   └── utils/                # Helpers (dateUtils, formatters, progressCalculator)
├── docs/                     # Architectural specs, audit reports, and quality documentation
└── public/                   # Static assets, SVG audio/icons, Sensei 3D model/textures
```

---

## 2. Package Scripts & Build Tooling

### 2.1 Root (`package.json`)
- **Framework:** React 18.3.1, Vite 5.4.21
- **Testing:** Vitest 4.1.11, Testing Library React, Playwright 1.58.2
- **Key Dependencies:** `@radix-ui/*`, `framer-motion` (11.18.2), `lucide-react`, `zustand` (5.0.3), `canvas-confetti`, `react-hot-toast`, `zod` (3.24.1), `axios` (1.7.9)
- **Key Scripts:**
  - `npm run dev`: Runs Vite dev server on port 5173
  - `npm run build`: Type-checks and creates production Vite bundle
  - `npm test`: Runs Vitest in single-run mode (`vitest run`)
  - `npm run lint`: Runs ESLint flat config with auto-fix disabled
  - `npm run test:e2e`: Runs Playwright end-to-end tests

### 2.2 Backend (`backend/package.json`)
- **Runtime:** Node.js v24.13.0, TypeScript 5.7.3, tsx 4.19.2
- **Database & ORM:** Drizzle ORM 0.38.4, `mysql2` 3.12.0 (TiDB Cloud MySQL protocol), `drizzle-kit` 0.30.4
- **Security & Validation:** `jsonwebtoken`, `bcryptjs`, `cors`, `helmet`, `express-rate-limit`, `zod`
- **Key Scripts:**
  - `npm run dev`: Runs backend server with hot-reload via `tsx watch src/index.ts`
  - `npm run build`: Compiles TypeScript to `dist/`
  - `npm run db:generate`: Generates SQL migrations from schema
  - `npm run db:migrate`: Executes pending SQL migrations via Drizzle runner
  - `npm test`: Runs backend Vitest suite

---

## 3. Database Schema & Migration Inventory

The backend database schema is defined in [`backend/src/db/schema.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/db/schema.ts) targeting MySQL/TiDB.

| Table Name | Primary Key | Key Columns | Indexes & Constraints | Ownership / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `id` (VARCHAR 36 UUID) | `email`, `username`, `passwordHash`, `xpPoints`, `streakDays`, `timezone`, `role`, `currentLevel` | Unique on `email`, `username`; Index on `email`, `timezone` | Core user identity, cumulative XP, and streak count |
| `user_lesson_progress` | Composite (`user_id`, `lesson_id`) | `status` ('in_progress', 'completed'), `score`, `time_spent_seconds`, `completed_at` | Unique composite PK; Index on `user_id`, `status` | Tracks lesson completion state and time spent |
| `user_kanji_progress` | Composite (`user_id`, `kanji_id`) | `recognition_level` (0-10), `mastered` (tinyint), `review_count`, `last_reviewed_at` | Unique composite PK; Index on `user_id` | Kanji study state and recognition score |
| `user_vocabulary_progress` | Composite (`user_id`, `vocabulary_id`) | `mastery_level` (0-10), `mastered` (tinyint), `review_count`, `last_reviewed_at` | Unique composite PK; Index on `user_id` | Vocabulary mastery tracking |
| `user_streaks` | Composite (`user_id`, `activity_date`) | `xp_earned`, `minutes_studied`, `lessons_completed`, `reviews_completed` | Unique composite PK; Index on `user_id`, `activity_date` | Daily activity log for local-date streak calculation |
| `user_badges` | `id` (VARCHAR 36 UUID) | `user_id`, `badge_type`, `badge_name`, `awarded_at` | Unique composite on `(user_id, badge_type)` | Earned achievements and milestones |
| `srs_cards` | `id` (VARCHAR 36 UUID) | `user_id`, `card_type` ('vocabulary', 'kanji', 'kana'), `card_ref_id`, `ease_factor`, `interval_days`, `repetitions`, `next_review_date`, `is_mastered` | Index on `(user_id, next_review_date)`, `(user_id, card_type, card_ref_id)` | Spaced repetition card scheduling engine |
| `user_reading_progress` | Composite (`user_id`, `story_id`) | `furigana_mode`, `last_sentence_index`, `completed`, `quiz_score`, `time_spent_seconds` | Unique composite PK | Graded reader reading state and quiz score |
| `sensei_conversations` | `id` (VARCHAR 36 UUID) | `user_id`, `session_id`, `role`, `content`, `tokens_used`, `sentiment` | Index on `user_id`, `session_id` | Chat history with AI Sensei companion |
| `sensei_tour_progress` | Composite (`user_id`, `tour_id`) | `completed`, `steps_completed`, `completed_at` | Unique composite PK | Guided tour milestone progress |

### 3.1 Missing Tables Identified in Schema
1. **`user_grammar_progress` (MISSING):** No database table exists to record which grammar patterns a user has studied, practiced, or mastered.
2. **`user_kana_progress` (MISSING):** No database table exists to persist hiragana/katakana learning progress or mastery.
3. **`user_quiz_progress` (MISSING):** Quizzes taken outside of graded readers are never persisted to a dedicated table; scores are lost on page leave.
4. **`xp_transactions` / `xp_ledger` (MISSING):** No audit log exists for XP awards. All XP changes directly mutate `users.xpPoints` without idempotency keys or transaction tracking.

### 3.2 Migrations Journal
- `0000_curious_black_widow.sql`: Initial schema creation.
- `0001_sharp_ultimatum.sql`: Adds `user_reading_progress` and extended fields.
- `0002_user_timezone.sql`: Adds `timezone VARCHAR(64) DEFAULT 'UTC'` to `users`.
- `0003_repair_badge_emojis.sql`: Repairs corrupted question-mark badge emojis in `user_badges`.

---

## 4. Backend Route & Service Map

| Endpoint | Method | Middleware | Handler File & Function | Target Tables | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | `validate(registerSchema)` | `routes/auth.ts:handleRegister` | `users` | Creates account with initial 0 XP, 'UTC' timezone |
| `/api/auth/login` | POST | `validate(loginSchema)` | `routes/auth.ts:handleLogin` | `users` | Authenticates and issues JWT token |
| `/api/auth/me` | GET | `requireAuth` | `routes/auth.ts:handleGetMe` | `users` | Fetches authenticated user profile |
| `/api/progress` | GET | `requireAuth` | `routes/progress.ts:getProgressSummary` | `users`, `user_lesson_progress`, `user_kanji_progress`, `user_vocabulary_progress`, `srs_cards` | Aggregates user stats, daily streak, cards due |
| `/api/progress/lesson` | POST | `requireAuth`, `validate` | `routes/progress.ts:handleLessonProgress` | `user_lesson_progress`, `user_streaks`, `users` | Records lesson completion, calculates XP, updates streak |
| `/api/progress/kanji` | POST | `requireAuth`, `validate` | `routes/progress.ts:handleKanjiProgress` | `user_kanji_progress`, `user_streaks`, `users` | Upserts kanji mastery; awards 15 XP if newly learned |
| `/api/progress/vocabulary` | POST | `requireAuth`, `validate` | `routes/progress.ts:handleVocabProgress` | `user_vocabulary_progress`, `user_streaks`, `users` | Upserts vocab mastery; awards 15 XP if newly learned |
| `/api/progress/xp` | POST | `requireAuth`, `validate` | `routes/progress.ts:handleXPIncrement` | `users` | Direct XP increment with arbitrary amount support |
| `/api/srs/due` | GET | `requireAuth` | `routes/srs.ts:getDueCards` | `srs_cards` | Returns cards where `nextReviewDate <= today` |
| `/api/srs/cards` | POST | `requireAuth`, `validate` | `routes/srs.ts:addCard` | `srs_cards` | Enqueues a card into SRS deck |
| `/api/srs/cards/:id/review`| PUT | `requireAuth`, `validate` | `routes/srs.ts:reviewCard` | `srs_cards` | Updates card SM-2 ease factor and interval days |
| `/api/users/profile` | PUT | `requireAuth`, `validate` | `routes/users.ts:updateProfile` | `users` | Updates displayName, timezone, avatarUrl |
| `/api/users/avatar` | POST | `requireAuth`, `upload` | `routes/users.ts:uploadAvatar` | Local disk / `users` | Uploads profile picture with mime check |

---

## 5. Frontend Store & API Client Map

| Store Name | File Path | Persisted in LocalStorage? | API Integration | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| `useAuthStore` | [`src/store/authStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/authStore.ts) | Yes (`nihongo_token`, `nihongo_user`) | `/api/auth/*`, `/api/users/*` | JWT token management, user session, login/logout |
| `useProgressStore` | [`src/store/progressStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts) | Partial (`nihongo_daily_xp`, `nihongo_kana_mastery_*`) | `/api/progress/*` | XP totals, streak counters, lesson/kanji/vocab/kana counts |
| `useSRSStore` | [`src/store/srsStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/srsStore.ts) | Yes (`nihongo_srs_cards_guest`) | `/api/srs/*` | SRS active review session, card addition, due queue |
| `useLessonStore` | [`src/store/lessonStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/lessonStore.ts) | Yes (`nihongo_lessons_progress`) | None (Local only) | Active lesson playback position and section navigation |
| `useReadingStore` | [`src/store/readingStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/readingStore.ts) | Yes (`nihongo_reading_guest`) | `/api/reading/*` | Graded reader current sentence, furigana mode, quiz |
| `useSenseiStore` | [`src/store/senseiStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/senseiStore.ts) | Partial (`nihongo_sensei_settings`) | `/api/sensei/*` | 3D Sensei companion expressions, speech, animations |
| `useSettingsStore` | [`src/store/settingsStore.js`](file:///e:/Nihongo-testing/nihongo-master/src/store/settingsStore.js) | Yes (`nihongo_user_settings`) | None (Local only) | Audio speed, romaji toggle, auto-play, preferred level |
| `useThemeStore` | [`src/store/themeStore.js`](file:///e:/Nihongo-testing/nihongo-master/src/store/themeStore.js) | Yes (`nihongo_theme`) | None (Local only) | Light/dark mode switching |

---

## 6. Page Inventory & Domain Ownership

| Route Path | Page Component | Feature Domain | Authentication Required? | Primary Data Source |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `pages/LandingPage.jsx` | Marketing, Interactive Demos | Public | Mini-demos, static curriculum |
| `/lessons` | `pages/LessonsPage.jsx` | Structured Lesson Tracks (N5-N1) | Public (Guest allowed) | `src/data/lessons/*_lessons.js` |
| `/lessons/:lessonId` | `components/lessons/LessonViewer.jsx` | Interactive Step-by-Step Lesson | Public (Auth required to persist) | `src/data/lessons/` |
| `/quiz/:lessonId` | `pages/QuizPage.jsx` | Assessment Engine | Public (Guest allowed) | `src/data/lessons/` |
| `/grammar` | `pages/GrammarPage.jsx` | Grammar Pattern Reference | Public | `src/data/grammar/*_grammar.js` |
| `/kanji` | `pages/KanjiPage.jsx` | Kanji Study, Stroke Order, SRS | Public | `src/data/kanji/*_kanji.js` |
| `/vocabulary`| `pages/VocabularyPage.jsx` | Lexical Study & Flashcards | Public | `src/data/vocabulary/*_vocabulary.js` |
| `/kana` | `pages/KanaPage.jsx` | Hiragana/Katakana Chart & Tracing | Public | `src/data/kana/kanaData.js` |
| `/reading` | `pages/ReadingPage.jsx` | Graded Readers & Audio Player | Public | `src/data/reading/n4_stories.js`, `n5_stories.js` |
| `/srs` | `components/srs/SRSReview.jsx` | Spaced Repetition Review Deck | Auth Required (Guest fallback in store) | `/api/srs/due`, `srsCards` |
| `/achievements` | `pages/AchievementsPage.jsx`| Gamification Badges & Milestones | Public (Shows local or DB stats) | `backend/src/services/progressCalculator.ts` |
| `/progress` | `pages/ProgressPage.jsx` | Analytics, Heatmap, Streak Stats | Public (Shows local or DB stats) | `/api/progress` |
| `/sensei` | `pages/SenseiPage.tsx` | AI Interactive Companion | Public (Chat requires API) | `/api/sensei/*`, 3D GLB Asset |
| `/chat` | `pages/ChatDojo.jsx` | Roleplay Scenario Conversations | Public | Static scenario data |
| `/speech` | `pages/SpeechPage.jsx` | Pronunciation & Pitch Practice | Public | Web Speech API, `pitchData.js` |
| `/login` | `components/auth/LoginPage.jsx` | Account Sign-in | Public | `/api/auth/login` |
| `/register` | `components/auth/RegisterPage.jsx`| Account Creation | Public | `/api/auth/register` |
| `/settings` | `pages/SettingsPage.jsx` | User Preferences & Profile Edit | Auth Recommended | `useSettingsStore`, `/api/users/profile` |

---

## 7. Dead Code, Conflicts, and Legacy Artifacts

1. **Dead `awardGrammarXP` Function:** `src/store/progressStore.ts:311` defines `awardGrammarXP`, exported in `src/hooks/useProgress.ts`, but it is never referenced or invoked by `GrammarPage.jsx` or any other component.
2. **Disconnected `lessonStore.ts` Progress:** `src/store/lessonStore.ts` maintains an independent local progress object (`nihongo_lessons_progress`), completely disconnected from `user_lesson_progress` in the backend database.
3. **Dual Export Normalization Boilerplate:** `src/data/index.js` acts as a normalization bridge for mismatched naming conventions across curriculum files (e.g., `N5_KANJI` with `char` vs `n2Kanji` with `kanji`, `N3_GRAMMAR` named export vs `n1Grammar` default export).
4. **Duplicate Kanji Records across Levels:** 12 duplicate kanji characters exist within the same level files (`n4_kanji.js` has 6 duplicate pairs, `n3_kanji.js` has 5 duplicate pairs, `n2_kanji.js` has 1 duplicate pair).
5. **Hardcoded Zero Statistics:** `backend/src/routes/progress.ts:152` hardcodes `cardsReviewed: 0` in `statsData`, breaking SRS review progress reporting.
