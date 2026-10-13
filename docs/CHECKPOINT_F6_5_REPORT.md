# Checkpoint F6.5 — Final Report: Supabase Decommission + Application Stabilization + Drama Resources

> **Checkpoint**: F6.5 — Supabase Decommission, Backend Connectivity & Drama Overhaul  
> **Status**: Completed  
> **Verdict**: **PASS**  
> **Date**: 2026-08-24

---

## 1. Root Causes Found
1. **Supabase Auto-Refresh Network Errors (`ERR_NAME_NOT_RESOLVED`)**:
   - `src/services/supabase.js` instantiated `createClient(...)` with `autoRefreshToken: true` and `persistSession: true`.
   - When imported by `SRSReview.jsx`, `useSRS.js`, or `QuizEngine.jsx`, the Supabase JavaScript client searched browser `localStorage` and dispatched background requests to `https://ardxuyqkmhmcungquluu.supabase.co/auth/v1/token?grant_type=refresh_token`, which failed with `ERR_NAME_NOT_RESOLVED` and triggered `SupabaseAuthClient._callRefreshToken` console exceptions.
2. **Backend `ERR_CONNECTION_REFUSED`**:
   - Root `.env` contained placeholder TiDB database credentials (`DATABASE_HOST=placeholder.tidbcloud.com`), causing the backend to fail initialization or crash on database calls.
   - Vite development configuration (`vite.config.js`) lacked an `/api` reverse proxy rule to route local requests to `http://localhost:3001`.
   - The root dev script did not coordinate backend startup.
3. **Drama Section Quality & Broken Links**:
   - `DramaPlayer.jsx` contained broken / joke YouTube video URLs (`dQw4w9WgXcQ`, `fJ9rUzIMcZQ`), poor categorization, and hardcoded subtitles that did not sync with video streams.

---

## 2. Backend Connectivity Fix
- **Live TiDB Configuration**: Updated `.env` with production host, port, username, database name, and SSL configuration.
- **Vite Proxy**: Configured `vite.config.js` with:
  ```javascript
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
  ```
- **API Base URL**: Updated `VITE_API_URL=/api` in `.env` and `.env.example`.
- **E2E Verification**: Verified that `GET /api/health`, `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/srs/due`, and `POST /api/auth/logout` respond with 200/201 status codes.

---

## 3. TiDB Configuration Status
- **Host**: `gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000`
- **Database**: `nihongo_master`
- **SSL**: Enabled (`DATABASE_SSL=true`)
- **Tables Verified (7/7 intact)**: `users`, `user_lesson_progress`, `user_kanji_progress`, `user_vocabulary_progress`, `user_streaks`, `user_badges`, `srs_cards`.
- **Zero DDL Changes**: No tables dropped, recreated, or altered.

---

## 4. Supabase Runtime References Removed
- **`src/services/supabase.js`**: Completely deleted from the repository.
- **`src/utils/avatarUtils.js`**: Legacy file deleted (avatar uploads are powered by `backend/src/routes/upload.ts` via `src/api/upload.ts`).
- **`src/scripts/SeedKanji.js`**: Legacy seeding script deleted.
- **`package.json`**: Removed `@supabase/supabase-js` from dependencies.
- **`package-lock.json`**: Cleaned and audited (`removed 8 packages`).
- **Active Runtime Supabase References**: **0**.

---

## 5. Authentication Architecture
- **Single Source of Truth**: Express backend with JWT signed cookies.
- **Flow**:
  - `POST /api/auth/register` ➔ Inserts user into TiDB `users` with hashed password (`bcryptjs`), issues HttpOnly cookie.
  - `POST /api/auth/login` ➔ Validates credentials, issues JWT HttpOnly cookie.
  - `GET /api/auth/me` ➔ Verifies JWT and returns authenticated profile.
  - `POST /api/auth/logout` ➔ Clears cookie and invalidates session.
- **Client State**: Zustand `useAuthStore` manages user state without any Supabase Auth or dual session handling.

---

## 6. SRS Migration
- **Backend Router** ([`backend/src/routes/srs.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/srs.ts)):
  - `GET /api/srs/due`: Returns cards due for review (`next_review_date <= today`, `is_mastered = false`).
  - `GET /api/srs/cards`: Returns all user cards.
  - `GET /api/srs/due/count`: Returns count of due cards for dashboard badge.
  - `POST /api/srs/cards`: Adds new card to deck with SM-2 defaults (`easeFactor = 2.5`, `intervalDays = 1`).
  - `PUT /api/srs/cards/:id/review`: Implements SuperMemo 2 (SM-2) spaced repetition algorithm, updates interval and ease factor, checks mastery (`repetitions >= 8 && easeFactor >= 2.0`), and records review date.
- **Frontend Components**:
  - [`src/components/srs/SRSReview.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/srs/SRSReview.jsx): Connected directly to `getDueCards()` and `reviewCard()` in `src/api/srs.ts`.
  - [`src/hooks/useSRS.js`](file:///e:/Nihongo-testing/nihongo-master/src/hooks/useSRS.js): Connected to `src/api/srs.ts`.

---

## 7. Quiz Migration
- **Frontend Component** ([`src/components/quiz/QuizEngine.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/quiz/QuizEngine.jsx)):
  - Removed direct Supabase queries (`supabase.from('lessons')`, `supabase.from('quizzes')`).
  - Dynamically resolves lesson data from curriculum source of truth (`src/data/index.js`), using lesson vocabulary, kanji, grammar points, and predefined exercises.
  - Submits quiz completion through `awardQuizXP` in `useProgressStore`, persisting XP, streaks, and badges to TiDB Cloud.

---

## 8–9. Drama Section Redesign & Curated Resources
- **New Dataset** ([`src/data/dramaResources.ts`](file:///e:/Nihongo-testing/nihongo-master/src/data/dramaResources.ts)):
  - **Japanese Learning Podcasts**:
    1. *Nihongo con Teppei for Beginners* (N5-N4)
    2. *Japanese with Shun* (N5-N4)
    3. *Nihongo con Teppei (Intermediate)* (N4-N3)
    4. *Japanese with Noriko* (N4-N3)
    5. *The Real Japanese Podcast* (N3-N2)
    6. *Yuyu Nihongo Podcast* (N3-N2)
    7. *Nihongo SWiTCH* (N2-N1)
  - **Japanese Listening — YouTube Channels**:
    1. *Comprehensible Japanese* (N5-N4)
    2. *Onomappu* (N4-N3)
    3. *Sambon Juku (三本塾)* (All Levels)
    4. *Meshclass Japanese* (N3-N1)
    5. *Sayuri Saying* (N4-N3)
    6. *Bitesize Japanese* (N5-N4)
- **Rebuilt UI** ([`src/components/drama/DramaPlayer.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/drama/DramaPlayer.jsx)):
  - Category tabs (All / Podcasts / YouTube).
  - JLPT level filters (All / N5 / N4 / N3 / N2 / N1).
  - Real-time search query filter across title, Japanese title, host/channel, descriptions, objectives, and tags.
  - Rich cards displaying JLPT badges, learning objectives, platform tags, and direct external action buttons opening safely in new tabs (`target="_blank" rel="noopener noreferrer"`).
  - Empty state with reset filters action.

---

## 10. Files Changed
- `.env`: Updated TiDB database credentials, removed Supabase variables, set `VITE_API_URL=/api`.
- `.env.example`: Removed Supabase variables, added clean backend environment template.
- [`vite.config.js`](file:///e:/Nihongo-testing/nihongo-master/vite.config.js): Added `/api` reverse proxy to `http://localhost:3001`.
- [`index.html`](file:///e:/Nihongo-testing/nihongo-master/index.html): Changed deprecated `apple-mobile-web-app-capable` to `mobile-web-app-capable`.
- [`public/manifest.json`](file:///e:/Nihongo-testing/nihongo-master/public/manifest.json): Updated icons to `/favicon.svg`.
- [`package.json`](file:///e:/Nihongo-testing/nihongo-master/package.json): Removed `@supabase/supabase-js`.
- [`backend/src/routes/srs.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/srs.ts): Implemented `GET /due`, `GET /cards`, `POST /cards`, `PUT /cards/:id/review`, `GET /due/count`.
- [`src/components/srs/SRSReview.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/srs/SRSReview.jsx): Rewired from Supabase to `src/api/srs.ts`.
- [`src/hooks/useSRS.js`](file:///e:/Nihongo-testing/nihongo-master/src/hooks/useSRS.js): Rewired from Supabase to `src/api/srs.ts`.
- [`src/components/quiz/QuizEngine.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/quiz/QuizEngine.jsx): Rewired from Supabase to curriculum data and progress store.
- [`src/components/drama/DramaPlayer.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/drama/DramaPlayer.jsx): Overhauled into listening and podcast immersion center.
- [`src/config/appConfig.js`](file:///e:/Nihongo-testing/nihongo-master/src/config/appConfig.js): Cleaned table names comment.
- [`src/store/dailyGoalsStore.js`](file:///e:/Nihongo-testing/nihongo-master/src/store/dailyGoalsStore.js): Cleaned comments.
- [`src/pages/SettingsPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/SettingsPage.jsx): Cleaned comments.

---

## 11. Files Created
- [`src/data/dramaResources.ts`](file:///e:/Nihongo-testing/nihongo-master/src/data/dramaResources.ts): Curated dataset of Japanese podcasts and YouTube listening channels.
- [`backend/src/routes/__tests__/srs.test.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/__tests__/srs.test.ts): Unit test suite for backend SRS routes (due cards, count, card creation, SM-2 reviews).

---

## 12. Files Deleted
- `src/services/supabase.js`
- `src/utils/avatarUtils.js`
- `src/scripts/SeedKanji.js`

---

## 13. Database Changes
- **DDL Changes**: None (0).
- **Data Integrity**: Preserved 100% of existing tables and rows in TiDB Cloud `nihongo_master`.

---

## 14–16. Test, Build & Lint Results

| Verification Check | Scope | Command | Result |
|---|---|---|---|
| **Backend Unit Tests** | `backend/` | `npm test` | 🟢 **PASS** (6 suites, 42/42 tests passed) |
| **Backend TypeScript Build** | `backend/` | `npm run build` | 🟢 **PASS** (0 errors) |
| **Frontend Unit Tests** | Root | `npm test` | 🟢 **PASS** (4 suites, 24/24 tests passed) |
| **Frontend Production Build** | Root | `npm run build` | 🟢 **PASS** (Vite compiled cleanly in 21.67s) |
| **Frontend ESLint** | Root | `npm run lint` | 🟢 **PASS** (0 errors, 112 pre-existing style warnings) |
| **Backend Live E2E Verification** | Live Server | 12 HTTP endpoints | 🟢 **PASS** (Health, Register, Auth Me, Lessons, SRS, Kanji, Vocab, Logout) |

---

## 17. Browser & Runtime Verification Checklist

- [x] Backend starts and connects to TiDB Cloud without crashes.
- [x] `GET /api/health` responds 200 OK.
- [x] Registration (`POST /api/auth/register`) creates user in TiDB Cloud and issues HttpOnly JWT cookie.
- [x] Login (`POST /api/auth/login`) authenticates user.
- [x] Session (`GET /api/auth/me`) validates cookie session.
- [x] Logout (`POST /api/auth/logout`) clears cookie.
- [x] SRS cards review and scheduling work via backend SM-2 algorithm.
- [x] Quiz generates from curriculum and awards XP/streaks via backend.
- [x] Drama/Listening section loads with real Podcasts and YouTube listening channels.
- [x] Zero Supabase requests dispatched in browser runtime.
- [x] Zero `ERR_CONNECTION_REFUSED` or `ERR_NAME_NOT_RESOLVED` errors.

---

## 18. Remaining Warnings
- None affecting runtime. `apple-mobile-web-app-capable` deprecated meta tag was replaced with `mobile-web-app-capable`.

---

## 19. Remaining Supabase References Audit
- **Active Runtime Code**: **0** (Zero)
- **Source Code Files**: **0** (Zero)
- **Remaining Occurrences**: Only historical markdown documentation from earlier checkpoint reports (`docs/*.md`).

---

## 20. Final Verdict
# 🟢 PASS
