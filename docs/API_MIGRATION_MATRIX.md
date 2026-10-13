# API Migration Matrix — Nihongo Master

> **Date**: 2026-08-23  
> **Status**: F0 — Migration Readiness Audit  
> **Source of truth**: Live repository inspection (not assumptions)

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total Supabase operations found** | **38** |
| **Files with Supabase dependencies** | **15** |
| **Supabase tables referenced** | **11** |
| **Supabase Auth operations** | **9** |
| **Supabase Storage operations** | **4** |
| **Supabase RPCs** | **2** |
| **localStorage server-data items** | **5** |
| **Backend endpoints required** | **~25** |

---

## Complete Supabase Dependency Inventory

### AUTH Operations

| # | Feature | File | Function | Supabase Operation | Backend Endpoint | Migration Status |
|---|---------|------|----------|--------------------|------------------|-----------------|
| A1 | Sign Up | `authStore.js` | `signUp()` | `supabase.auth.signUp()` | `POST /api/auth/register` | READY |
| A2 | Sign In | `authStore.js` | `signIn()` | `supabase.auth.signInWithPassword()` | `POST /api/auth/login` | READY |
| A3 | Google OAuth | `authStore.js` | `signInWithGoogle()` | `supabase.auth.signInWithOAuth()` | `POST /api/auth/google` | DEFERRED |
| A4 | Sign Out | `authStore.js` | `logout()` | `supabase.auth.signOut()` | `POST /api/auth/logout` | READY |
| A5 | Get Session | `authStore.js` | `initialize()` | `supabase.auth.getSession()` | `GET /api/auth/me` | READY |
| A6 | Auth Listener | `authStore.js`, `useAuth.js` | `onAuthStateChange()` | `supabase.auth.onAuthStateChange()` | Cookie-based auth (no listener needed) | DESIGN NEEDED |
| A7 | Get User | `authStore.js` | `refreshProfile()` | `supabase.auth.getUser()` | `GET /api/auth/me` | READY |
| A8 | Forgot Password | `LoginPage.jsx` | `handleForgotPassword()` | `supabase.auth.resetPasswordForEmail()` | `POST /api/auth/reset-password-request` | STUB |
| A9 | Reset Password | `ResetPasswordPage.jsx` | `handleReset()` | `supabase.auth.updateUser()` | `POST /api/auth/reset-password` | STUB |

### DATABASE Operations — `user_profiles` / `users`

| # | Feature | File | Function | Operation | Columns | Backend Endpoint | Status |
|---|---------|------|----------|-----------|---------|------------------|--------|
| D1 | Fetch profile | `authStore.js` | `initialize/signIn` | SELECT | `*` | `GET /api/users/profile` | READY |
| D2 | Create profile | `authStore.js` | `signUp()` | INSERT/UPSERT | `id, username, email, native_language, current_level` | `POST /api/auth/register` (combined) | READY |
| D3 | Update profile | `authStore.js` | `updateProfile()` | UPDATE | `username, native_language, current_level, avatar_url, avatar_id` | `PUT /api/users/profile` | READY |
| D4 | Update XP | `progressStore.js` | `addXP()` | UPDATE | `xp_points` | `POST /api/progress/xp` | READY (needs atomic) |
| D5 | Update streak | `progressStore.js` | `updateStreak()` | UPDATE | `streak_days` | `POST /api/progress/streak` | VERIFY (`streak_days` col missing in Drizzle) |
| D6 | Profile settings | `SettingsPage.jsx` | various | UPDATE | `username, avatar_url, avatar_id` | `PUT /api/users/profile` | READY |
| D7 | Avatar update | `ProfilePage.jsx` | `handleSelectAvatar/remove` | UPDATE | `avatar_id, avatar_url` | `PUT /api/users/profile` | READY |

### DATABASE Operations — `user_lesson_progress`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D8 | Fetch progress | `useProgress.js` | `fetchUserProgress` | SELECT count | `GET /api/progress` | READY |
| D9 | Fetch progress | `lessonStore.js` | `loadUserProgress` | SELECT `*` | `GET /api/progress/lessons` | READY |
| D10 | Complete lesson | `LessonViewer.jsx` | `completeLesson` | UPSERT | `POST /api/progress/lesson` | READY |
| D11 | Fetch stats | `ProfilePage.jsx` | `fetchStats` | SELECT count | `GET /api/progress` | READY |
| D12 | Fetch stats | `ProgressPage.jsx` | `fetchStats` | SELECT count | `GET /api/progress` | READY |
| D13 | Reset progress | `SettingsPage.jsx` | `resetProgress` | DELETE | `DELETE /api/progress/reset` | NEEDS ENDPOINT |
| D14 | Delete account | `SettingsPage.jsx` | `deleteAccount` | DELETE | `DELETE /api/users/account` | READY |

### DATABASE Operations — `user_kanji_progress`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D15 | Fetch count | `useProgress.js` | `fetchUserProgress` | SELECT count (`.gte('recognition_level', 1)`) | `GET /api/progress` | VERIFY (column mismatch) |
| D16 | Fetch stats | `ProfilePage.jsx`, `ProgressPage.jsx` | `fetchStats` | SELECT count | `GET /api/progress` | VERIFY |
| D17 | Reset | `SettingsPage.jsx` | `resetProgress` | DELETE | `DELETE /api/progress/reset` | NEEDS ENDPOINT |

### DATABASE Operations — `user_vocabulary_progress`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D18 | Fetch count | `useProgress.js` | `fetchUserProgress` | SELECT count (`.gte('mastery_level', 1)`) | `GET /api/progress` | VERIFY (column mismatch) |
| D19 | Fetch stats | `ProfilePage.jsx`, `ProgressPage.jsx` | `fetchStats` | SELECT count | `GET /api/progress` | VERIFY |
| D20 | Reset | `SettingsPage.jsx` | `resetProgress` | DELETE | `DELETE /api/progress/reset` | NEEDS ENDPOINT |

### DATABASE Operations — `user_streaks`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D21 | Fetch streaks | `ProgressChart.jsx` | `useEffect` | SELECT `*` (last 30 days) | `GET /api/progress/streaks` | NEEDS ENDPOINT |
| D22 | Update streak | `LessonViewer.jsx` | `completeLesson` | UPSERT | `POST /api/progress/streak` | READY |
| D23 | Update streak | `useProgress.js` | `addXP` | UPSERT (`minutes_studied`) | `POST /api/progress/streak` | VERIFY (`minutes_studied` missing in Drizzle) |

### DATABASE Operations — `user_badges`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D24 | Fetch badges | `useProgress.js` | `checkBadges` | SELECT | `GET /api/progress/badges` | READY |
| D25 | Award badge | `useProgress.js` | `checkBadges` | INSERT | `POST /api/progress/badges` | READY |
| D26 | Reset badges | `SettingsPage.jsx` | `resetProgress` | DELETE | `DELETE /api/progress/reset` | NEEDS ENDPOINT |

### DATABASE Operations — `srs_cards`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D27 | Fetch due cards | `supabase.js` | `getSRSCards` | SELECT with JOIN `vocabulary(*), kanji(*)` | `GET /api/srs/due` | READY |
| D28 | Update card | `supabase.js` | `updateSRSCard` | SELECT + UPDATE | `PUT /api/srs/cards/:id/review` | READY |
| D29 | Add card | `useSRS.js` | `addCardToSRS` | UPSERT | `POST /api/srs/cards` | READY |
| D30 | Fetch count | `progressStore.js` | `loadSRSDue` | SELECT count | `GET /api/srs/due/count` | NEEDS ENDPOINT |
| D31 | Fetch mastered | `useProgress.js` | `fetchUserProgress` | SELECT count | `GET /api/progress` | READY |
| D32 | Reset | `SettingsPage.jsx` | `resetProgress` | DELETE | `DELETE /api/progress/reset` | NEEDS ENDPOINT |

### DATABASE Operations — `lessons` & `quizzes`

| # | Feature | File | Function | Operation | Backend Endpoint | Status |
|---|---------|------|----------|-----------|------------------|--------|
| D33 | List lessons | `lessonStore.js` | `loadLessons` | SELECT `*` | `GET /api/lessons` | READY |
| D34 | Get lesson + content | `lessonStore.js` | `loadLesson` | SELECT with JOINs `vocabulary(*), kanji(*), grammar(*)` | `GET /api/lessons/:level/:day` | VERIFY (content tables missing in Drizzle) |
| D35 | Get lesson title | `QuizEngine.jsx` | `loadQuiz` | SELECT `title` | `GET /api/lessons/:id` | READY |
| D36 | Get quiz | `QuizEngine.jsx` | `loadQuiz` | SELECT `*` | `GET /api/quiz/:lessonId` | READY |

### STORAGE Operations

| # | Feature | File | Function | Operation | Bucket | Backend Endpoint | Status |
|---|---------|------|----------|-----------|--------|------------------|--------|
| S1 | Upload avatar | `ProfilePage.jsx` | `uploadAvatar` | `.upload()` | `avatars` | `POST /api/upload/avatar` | NEEDS ENDPOINT |
| S2 | Remove avatar | `ProfilePage.jsx` | `uploadAvatar` | `.remove()` | `avatars` | `DELETE /api/upload/avatar` | NEEDS ENDPOINT |
| S3 | Upload avatar | `SettingsPage.jsx` | `uploadAvatar` | `.upload()` | `avatars` | `POST /api/upload/avatar` | NEEDS ENDPOINT |
| S4 | Remove avatar | `SettingsPage.jsx` | `uploadAvatar` | `.remove()` | `avatars` | `DELETE /api/upload/avatar` | NEEDS ENDPOINT |

### RPC Operations

| # | Feature | File | Function | RPC | Backend Equivalent | Status |
|---|---------|------|----------|-----|--------------------|--------|
| R1 | Add XP | `supabase.js` | `addXP` | `add_xp(p_user_id, p_xp)` | Atomic SQL: `SET xp_points = xp_points + ?` | READY |
| R2 | Calc streak | `supabase.js` | `updateStreak` | `calculate_streak(p_user_id)` | Backend service logic | NEEDS IMPLEMENTATION |

---

## localStorage Dependencies (Server Data)

| # | Key | File | Data Stored | Database Candidate? | Risk |
|---|-----|------|-------------|---------------------|------|
| L1 | `srs_data` | `FlashCard.jsx` | SRS card states (interval, ease, reviews) | **YES** — conflicts with Supabase SRS | P1 desync |
| L2 | `nihongo_daily_xp` | `progressStore.js` | `{date, xp}` daily accumulator | **YES** — duplicates `user_streaks` | P2 desync |
| L3 | `nihongo_translations_v1` | `translationService.js` | Cached API translations | No — optimization cache | P3 |
| L4 | `nihongo-daily-goals` | `dailyGoalsStore.js` | Daily goal counters | Optional — currently local-only | P3 |
| L5 | `nihongo_settings` | `settingsStore.js` | User preferences | Optional — could sync to profile | P3 |
| L6 | `nihongo-theme` | `themeStore.js` | Light/dark mode | No — standard local | OK |
| L7 | `nihongo-notifications` | `notificationStore.js` | Notification inbox | No — client UI state | OK |
| L8 | `nihongo_sidebar_collapsed` | `Layout.jsx` | Sidebar state | No — UI preference | OK |

---

## Missing Backend Endpoints (Not Yet Created)

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `DELETE /api/progress/reset` | Reset all user progress | P1 |
| `GET /api/progress/streaks` | Fetch streak history (last 30 days) | P1 |
| `GET /api/srs/due/count` | Count of due SRS cards | P2 |
| `POST /api/upload/avatar` | Upload avatar file | P2 |
| `DELETE /api/upload/avatar` | Remove avatar file | P2 |
| `POST /api/auth/google` | Google OAuth | DEFERRED |

---

## AI Service (Already Migrated ✅)

| Feature | Frontend | Old Approach | New Approach | Status |
|---------|----------|-------------|-------------|--------|
| Chat start | `aiService.js` | Direct Groq API with `VITE_GROQ_API_KEY` | `POST /api/ai/chat/start` | ✅ MIGRATED |
| Chat continue | `aiService.js` | Direct Groq API | `POST /api/ai/chat` | ✅ MIGRATED |
| Writing check | `aiService.js` | Direct Groq API | `POST /api/ai/check-writing` | ✅ MIGRATED |
| Mnemonic gen | `aiService.js` | Direct Groq API | `POST /api/ai/generate-mnemonic` | ✅ MIGRATED |
| Quiz gen | `aiService.js` | Direct Groq API | `POST /api/ai/generate-quiz` | ✅ MIGRATED |
