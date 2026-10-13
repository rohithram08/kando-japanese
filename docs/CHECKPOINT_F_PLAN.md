# Checkpoint F — Migration Plan

> **Date**: 2026-08-23  
> **Status**: F0 COMPLETE — Awaiting approval to begin F1  
> **Prerequisite**: All 4 audit documents reviewed

---

## Migration Phases

| Phase | Scope | Files Affected | Risk | Depends On |
|-------|-------|---------------|------|-----------|
| **F0** | Migration Readiness Audit | 0 (docs only) | None | — |
| **F1** | API Client + Types | ~6 new files | Low | F0 |
| **F2** | Authentication | ~6 files | **HIGH** | F1 |
| **F3** | User/Profile | ~3 files | Medium | F2 |
| **F4** | Progress/XP/Streaks/Badges | ~5 files | **HIGH** | F2, schema fixes |
| **F5** | Lessons | ~3 files | Medium | F1 |
| **F6** | Kanji & Vocabulary Progress | ~2 files | Medium | F4 |
| **F7** | SRS | ~4 files | **HIGH** | F4, schema correct |
| **F8** | Quiz | ~2 files | Low | F5 |
| **F9** | AI | 0 (already done) | None | — |
| **F10** | Storage (Avatars) | ~3 files | Medium | F3 |
| **F11** | Remove Supabase | ~3 files | Low | ALL above verified |

---

## Pre-Migration: Schema Fixes Required

> [!CAUTION]
> The current Drizzle schema is INCOMPLETE. These must be fixed BEFORE F4 begins.

### Missing Columns (add to existing tables)

| Table | Column | Type | Default | Reason |
|-------|--------|------|---------|--------|
| `users` | `streak_days` | `INT` | `0` | `progressStore` reads `profile.streak_days` |
| `user_kanji_progress` | `recognition_level` | `INT` | `0` | Code uses `.gte('recognition_level', 1)` |
| `user_vocabulary_progress` | `mastery_level` | `INT` | `0` | Code uses `.gte('mastery_level', 1)` |
| `user_streaks` | `minutes_studied` | `INT` | `0` | `ProgressChart.jsx` fetches it |
| `user_streaks` | `xp` | `INT` | `0` | `useProgress.js` upserts it |
| `user_badges` | `badge_name` | `VARCHAR(200)` | `NULL` | `useProgress.js` inserts it |

### Content Tables Decision

> [!IMPORTANT]
> **Decision required**: Should lesson/vocabulary/kanji content come from the database or static files?
>
> **Recommendation**: Serve from static `src/data/` files through the backend API. This avoids needing `lessons`, `vocabulary`, `kanji`, `grammar`, and join tables in TiDB.
>
> **If Supabase has different/additional content** not in the static files, we must export and compare first. This is currently **UNVERIFIED**.

### Missing Backend Endpoints

| Endpoint | Phase Needed | Purpose |
|----------|-------------|---------|
| `DELETE /api/progress/reset` | F4 | Reset all user progress |
| `GET /api/progress/streaks` | F4 | Fetch streak history (chart) |
| `GET /api/srs/due/count` | F7 | Dashboard due count |
| `POST /api/upload/avatar` | F10 | Upload avatar file |
| `DELETE /api/upload/avatar` | F10 | Remove avatar file |

---

## F1 — API Client + Types

### Goal
Create a centralized, typed API client that ALL subsequent migrations will use. No raw `fetch()` or `axios` calls in components.

### Files to Create

```
src/api/
  client.ts        — Base HTTP client (axios instance, interceptors)
  auth.ts          — Auth API functions
  users.ts         — User/profile API functions
  lessons.ts       — Lesson API functions
  progress.ts      — Progress/XP/streak API functions
  srs.ts           — SRS API functions
  quiz.ts          — Quiz API functions
  ai.ts            — AI API functions (update existing aiService)

src/types/
  api.ts           — Request/response type definitions
  models.ts        — Domain model types (User, Lesson, SRSCard, etc.)
```

### API Client Design

```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,  // send httpOnly cookie
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptors:
// - 401 → redirect to login, clear auth state
// - 429 → show rate limit toast
// - Network error → show offline toast
// - Response unwrap → return data directly
```

### Verification
- [ ] All type definitions compile with strict TS
- [ ] API client functions match backend endpoint signatures
- [ ] Error handling covers 401, 403, 404, 429, 500, network errors
- [ ] No Supabase imports in new files

---

## F2 — Authentication

### Goal
Replace Supabase auth with backend JWT auth. httpOnly cookie-based sessions.

### Changes

| File | Current | After |
|------|---------|-------|
| `authStore.js` → `.ts` | `supabase.auth.*` | `api.auth.*` |
| `useAuth.js` → `.ts` | `onAuthStateChange` listener | Simple Zustand selector |
| `LoginPage.jsx` | `authStore.signIn()` → Supabase | `authStore.signIn()` → Backend |
| `RegisterPage.jsx` | `authStore.signUp()` → Supabase | `authStore.register()` → Backend |
| `ResetPasswordPage.jsx` | `supabase.auth.updateUser()` | `api.auth.resetPassword()` |
| `AuthGuard.jsx` | Checks `user` from Supabase session | Checks `user` from `GET /api/auth/me` |
| `App.jsx` | `authStore.initialize()` → `getSession()` | `authStore.initialize()` → `GET /api/auth/me` |

### Critical Behavior Changes

1. **Session persistence**: Supabase uses localStorage tokens → Backend uses httpOnly cookies
2. **Auth listener removal**: `onAuthStateChange` is replaced by explicit check on app load
3. **Google OAuth**: DEFERRED — requires backend OAuth flow implementation
4. **Password reset**: Requires backend email sending (STUB for now)

### Auth Flow After Migration

```
App Load:
  → GET /api/auth/me (cookie sent automatically)
  → 200 + user data → authStore.setUser(data)
  → 401 → authStore.setUser(null), show login

Login:
  → POST /api/auth/login { email, password }
  → 200 → backend sets httpOnly cookie
  → authStore.setUser(response.data)
  → navigate('/dashboard')

Logout:
  → POST /api/auth/logout
  → backend clears cookie
  → authStore.clearUser()
  → queryClient.clear()
  → navigate('/login')
```

### Verification
- [ ] Registration creates user + sets cookie
- [ ] Login authenticates + sets cookie
- [ ] Logout clears cookie + state
- [ ] App refresh preserves session (cookie auto-sent)
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Invalid/expired token returns 401
- [ ] Build passes, lint passes

---

## F3 — User/Profile

### Changes

| File | Current | After |
|------|---------|-------|
| `ProfilePage.jsx` | `supabase.from('user_profiles')` | `api.users.getProfile()` |
| `SettingsPage.jsx` | `supabase.from('user_profiles').update()` | `api.users.updateProfile()` |
| `authStore` | `updateProfile()` → Supabase | `updateProfile()` → Backend API |

### Verification
- [ ] Profile loads correctly
- [ ] Profile updates persist
- [ ] Username change works
- [ ] Language/level change works
- [ ] Build passes

---

## F4 — Progress/XP/Streaks/Badges

> [!WARNING]
> This is the highest-risk migration phase. XP integrity, streak calculation, and badge awards are interconnected.

### Pre-requisites
- Schema fixes applied (missing columns added)
- Backend `DELETE /api/progress/reset` endpoint created
- Backend `GET /api/progress/streaks` endpoint created
- Backend XP calculation moved server-side (no client-provided XP amounts)

### XP Architecture Change

**Before** (race condition):
```
Client reads XP → calculates new XP → sends absolute UPDATE
```

**After** (atomic):
```
Client sends event → Backend validates → Backend atomically increments → Returns new XP
```

```typescript
// Client sends:
POST /api/progress/xp
{ event: 'lesson_completed', lessonId: '...', score: 85, timeSpent: 120 }

// Backend:
// 1. Validates lesson exists
// 2. Checks if already completed (prevent double XP)
// 3. Calculates XP amount server-side
// 4. Atomic: UPDATE users SET xp_points = xp_points + ? WHERE id = ?
// 5. Checks for badge awards
// 6. Updates streak
// 7. Returns { xpGained, totalXP, badgesAwarded, streakDays }
```

### Changes

| File | Current | After |
|------|---------|-------|
| `progressStore.js` → `.ts` | Zustand store with Supabase calls | **REMOVE** — Replace with TanStack Query hooks |
| `useProgress.js` → `.ts` | Direct Supabase queries | `useQuery(['progress'])` + `useMutation` |
| `ProgressPage.jsx` | Reads from progressStore/Supabase | Reads from `useQuery` |
| `ProgressChart.jsx` | Direct `supabase.from('user_streaks')` | `useQuery(['progress', 'streaks'])` |
| `SettingsPage.jsx` | `supabase.from(...).delete()` (reset) | `api.progress.resetAll()` |

### Verification
- [ ] Progress stats load correctly
- [ ] XP awards are atomic (no race condition)
- [ ] Streak calculation works
- [ ] Badge awards work (correct uniqueness constraint)
- [ ] Progress reset deletes all user data
- [ ] Progress chart shows last 30 days
- [ ] Build passes

---

## F5 — Lessons

### Changes

| File | Current | After |
|------|---------|-------|
| `lessonStore.js` → `.ts` | `supabase.from('lessons')` | `useQuery(['lessons', level])` |
| `LessonViewer.jsx` | Direct Supabase queries for lesson + completion | `useQuery` for fetch, `useMutation` for complete |
| `QuizEngine.jsx` | `supabase.from('lessons/quizzes')` | `useQuery(['quiz', lessonId])` |

### Decision: Static Data vs Database Content

If **static files** (recommended):
- Backend reads from `src/data/` and serves via API
- No `lessons` table needed in database
- `loadLessons` → `GET /api/lessons?level=N5` → Backend imports data files

If **database content**:
- Need to add `lessons`, `vocabulary`, `kanji`, `grammar` tables to Drizzle
- Need seed scripts to populate from static files or Supabase export
- More complex but more flexible

### Verification
- [ ] Lesson list loads for each JLPT level
- [ ] Lesson detail loads with vocabulary, kanji, grammar
- [ ] Lesson completion records in database
- [ ] Quiz loads for lesson
- [ ] Build passes

---

## F6 — Kanji & Vocabulary Progress

### Changes

| File | Current | After |
|------|---------|-------|
| `useProgress.js` | `supabase.from('user_kanji_progress')` | `api.progress.updateKanji()` |
| `useProgress.js` | `supabase.from('user_vocabulary_progress')` | `api.progress.updateVocab()` |

### Verification
- [ ] Kanji mastery tracking works
- [ ] Vocabulary mastery tracking works
- [ ] Progress counts match expectations
- [ ] Build passes

---

## F7 — SRS

> [!WARNING]
> See [SRS_MIGRATION.md](file:///e:/Nihongo-testing/nihongo-master/docs/SRS_MIGRATION.md) for full analysis.

### Changes

| File | Current | After |
|------|---------|-------|
| `useSRS.js` → `.ts` | `supabase.js` progressService | `useQuery(['srs', 'due'])` + `useMutation` |
| `SRSReview.jsx` | Uses `useSRS` hook | Unchanged (hook interface preserved) |
| `FlashCard.jsx` | Separate localStorage SRS | Refactor to use DB-backed SRS or keep as offline practice |
| `supabase.js` | `getSRSCards()`, `updateSRSCard()` | **DELETE** these functions |

### SM-2 Algorithm Location
- **Move to backend**: The SM-2 algorithm currently in `supabase.js` must be implemented in the backend `PUT /api/srs/cards/:id/review` route
- The client submits only: `{ quality: 0|2|4|5 }`
- The backend calculates: new ease_factor, interval, repetitions, next_review_date, is_mastered

### Verification
- [ ] Due cards load correctly
- [ ] Review submission updates card state
- [ ] SM-2 algorithm produces correct intervals
- [ ] Settings mode (relaxed/balanced/intense) affects intervals
- [ ] Mastery triggers at repetitions >= 8
- [ ] XP awarded on review
- [ ] Build passes

---

## F8 — Quiz

### Changes

| File | Current | After |
|------|---------|-------|
| `QuizEngine.jsx` | `supabase.from('quizzes')` + `supabase.from('lessons')` | `useQuery(['quiz', lessonId])` |

### Verification
- [ ] Quiz loads for lesson
- [ ] Quiz submission records score
- [ ] XP awarded on completion
- [ ] Build passes

---

## F9 — AI (Already Complete ✅)

`aiService.js` already migrated to proxy through `/api/ai/*` backend routes.

---

## F10 — Storage (Avatars)

### Changes

| File | Current | After |
|------|---------|-------|
| `ProfilePage.jsx` | `supabase.storage.from('avatars').upload/remove` | `api.upload.avatar()` / `api.upload.removeAvatar()` |
| `SettingsPage.jsx` | Same storage operations | Same API migration |

### Backend Requirement
Need `POST /api/upload/avatar` endpoint with:
- `multer` middleware for file parsing
- File validation (type, size)
- Storage to S3-compatible bucket or local filesystem
- Return public URL

### Decision Needed
- Where will avatar files be stored after Supabase removal?
- Options: S3-compatible storage, Cloudflare R2, local filesystem, or keep predefined avatars only

### Verification
- [ ] Avatar upload works
- [ ] Avatar removal works
- [ ] Public URL accessible
- [ ] File validation (type, size) works
- [ ] Build passes

---

## F11 — Remove Supabase

### Pre-requisites (ALL must be true)

- [ ] No frontend files import from `@supabase/supabase-js`
- [ ] No frontend files import from `src/services/supabase.js`
- [ ] No `supabase.from()` calls remain
- [ ] No `supabase.auth.*` calls remain
- [ ] No `supabase.storage.*` calls remain
- [ ] No `supabase.rpc()` calls remain
- [ ] No `VITE_SUPABASE_*` env vars referenced
- [ ] All backend endpoints have feature parity
- [ ] All critical features tested
- [ ] Build passes
- [ ] Lint passes

### Actions
1. Delete `src/services/supabase.js`
2. Remove `@supabase/supabase-js` from `package.json`
3. Remove `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env` and `.env.example`
4. Run `npm install` to clean lockfile
5. Build + lint + test

---

## After Each Phase

| Step | Command / Action |
|------|-----------------|
| 1 | `npm run build` (frontend) |
| 2 | `npx tsc --noEmit` (backend) |
| 3 | `npm run lint` (if configured) |
| 4 | Manual test of affected feature |
| 5 | Review diff for unintended changes |
| 6 | Update task.md with completion status |
| 7 | Only then proceed to next phase |

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| XP race condition reintroduced | Medium | **HIGH** — data corruption | Atomic SQL increment, no client XP values |
| Auth token mismatch (cookie not sent) | Medium | **HIGH** — all requests fail | CORS `credentials: true`, `withCredentials: true` |
| Missing Drizzle columns cause 500s | **HIGH** | Medium | Fix schema BEFORE F4 |
| Content tables decision wrong | Medium | Medium | Verify Supabase content vs static files first |
| Google OAuth breaks | Low | Low | Deferred, documented |
| Avatar storage unavailable | Low | Low | Use predefined avatars as fallback |
| SRS algorithm divergence | Medium | Medium | Port exact SM-2 logic, test with known inputs |
| Streak calculation differs from RPC | Medium | Medium | UNVERIFIED — implement and compare |

---

## Open Questions for User

1. **Content tables**: Should lesson/vocabulary/kanji content be served from static `src/data/` files (simpler) or stored in TiDB (more flexible)? Does the Supabase database contain content that differs from the static files?

2. **Google OAuth**: Should this be preserved in the migration or removed? If preserved, it needs a backend OAuth flow with callback handling.

3. **Avatar storage**: After Supabase removal, where should avatar files be stored? S3-compatible bucket, or use only predefined avatars?

4. **`calculate_streak` RPC**: The PostgreSQL function body is unknown. Should the backend calculate streak as "consecutive days with activity" or use a simpler "days since last activity" approach?
