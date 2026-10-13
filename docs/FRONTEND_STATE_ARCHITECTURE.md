# Frontend State Architecture — Nihongo Master

> **Date**: 2026-08-23  
> **Status**: F0 — Migration Readiness Audit  
> **Purpose**: Classify all frontend state before introducing TanStack Query

---

## 1. State Classification

All frontend state must be classified into one of four categories:

| Category | Description | Technology | Migration Action |
|----------|-------------|-----------|------------------|
| **A. Server State** | Data that lives in the database and is shared across devices | TanStack Query | Migrate FROM Zustand TO useQuery/useMutation |
| **B. Global Client State** | App-level client preferences that do NOT come from the server | Zustand (persist) | Keep in Zustand |
| **C. UI State** | Transient visual state (modals, tooltips, sidebar) | React useState/useReducer | Keep as-is |
| **D. Persistent Local State** | Data stored in localStorage for offline/cache purposes | localStorage / Zustand persist | Evaluate case-by-case |

---

## 2. Store Classification

### SERVER STATE — Migrate to TanStack Query

| Store | State Properties | Supabase Calls | Recommendation |
|-------|-----------------|----------------|----------------|
| **`authStore.js`** | `user`, `profile`, `session`, `loading`, `initialized` | `auth.getSession`, `auth.signIn`, `auth.signUp`, `auth.signOut`, `auth.onAuthStateChange`, `user_profiles` SELECT/UPSERT/UPDATE | **PARTIAL MIGRATE**: Auth lifecycle (login/logout/session) stays in Zustand (imperative flow). Profile fetching → `useQuery`. Profile mutation → `useMutation`. |
| **`progressStore.js`** | `streak`, `totalXP`, `dailyXP`, `userLevel`, `jlptLevel`, `lessonsCompleted`, `kanjiLearned`, `vocabLearned`, `cardsReviewed`, `cardsMastered`, `srsReviewsDue` | `user_lesson_progress` count, `user_kanji_progress` count, `user_vocabulary_progress` count, `srs_cards` count, `user_profiles` UPDATE | **FULL MIGRATE**: All stats are server-derived. Replace with `useQuery(['progress'])` and `useMutation` for XP/streak. |
| **`lessonStore.js`** | `lessons`, `currentLesson`, `currentSection`, `sections`, `vocabulary`, `kanji`, `grammar`, `userProgress` | `lessons` SELECT (list + detail with JOINs), `user_lesson_progress` SELECT | **FULL MIGRATE**: Lesson list → `useQuery(['lessons', level])`. Lesson detail → `useQuery(['lesson', level, day])`. Progress → `useQuery(['progress', 'lessons'])`. Keep `currentSection` in local state. |

### CLIENT STATE — Keep in Zustand

| Store | State Properties | Supabase Calls | Recommendation |
|-------|-----------------|----------------|----------------|
| **`settingsStore.js`** | `jlptLevel`, `fontSize`, `compactMode`, `animations`, `romaji`, `furigana`, `dailyGoal`, `autoPlay`, `showTranslation`, `srsInterval`, `dailyReminder`, `reminderTime`, `streakAlert`, `achievementAlert`, `weeklyReport`, `speechRate`, `speechPitch`, `autoSpeak`, `slowMode`, `analytics`, `crashReports` | None | **KEEP**: Pure client preferences. Zustand persist with `nihongo_settings` key is correct. Consider syncing to user profile later (optional). |
| **`themeStore.js`** | `theme`, `resolvedTheme`, `isDark` | None | **KEEP**: UI preference. Zustand persist with `nihongo-theme` key. |
| **`dailyGoalsStore.js`** | `date`, `lesson`, `review`, `kanji`, `chat` | None | **KEEP**: Local daily tracking. Auto-resets on date change. Consider server sync later (optional). |
| **`notificationStore.js`** | `notifications`, `seenBadgeIds`, `seenStreakMilestones`, `lastNotifiedJlptLevel`, `lastDailyGoalNotifDate` | None | **KEEP**: Client notification inbox. Cleared on logout via `clearAll()`. |

---

## 3. Hook Classification

### Hooks to REFACTOR for backend API

| Hook | Current Behavior | Supabase Calls | Recommendation |
|------|-----------------|----------------|----------------|
| **`useProgress.js`** | Fetches stats (lesson count, kanji count, vocab count, SRS count, badges). Submits lesson completions and badge awards. | SELECT × 5 tables, INSERT badges, UPSERT progress/streaks | **REPLACE** with `useQuery(['userStats'])` for read and `useMutation` for writes. This is the most critical refactor. |
| **`useSRS.js`** | Fetches due SRS cards, submits reviews, adds new cards. Delegates to `supabase.js` progressService. | `getSRSCards` (SELECT + JOIN), `updateSRSCard` (SELECT + UPDATE), `srs_cards` UPSERT | **REPLACE** with `useQuery(['srs', 'due'])` and `useMutation` for review/add. |
| **`useAuth.js`** | Thin wrapper around `authStore`. Adds an `onAuthStateChange` listener for logging. | `auth.onAuthStateChange` | **SIMPLIFY**: Remove direct Supabase listener. Keep as Zustand selector hook. |
| **`useTranslatedText.js`** | Calls translation API, caches results. | None (indirect API call) | **REFACTOR** to use `useQuery` for translation caching. |

### Hooks to KEEP as-is

| Hook | Purpose | Supabase Calls | Recommendation |
|------|---------|----------------|----------------|
| **`useAudio.js`** | Web Speech API TTS playback | None | **KEEP** — browser API only |
| **`useSpeech.js`** | Web Speech API STT recognition | None | **KEEP** — browser API only |
| **`useNotificationEngine.js`** | Watches state, creates notifications (SRS due, streaks, badges, goals) | None directly (reads progressStore) | **ADAPT** — will need to read from TanStack Query cache instead of progressStore after migration |

---

## 4. TanStack Query Integration Plan

### Query Keys Design

```typescript
// Auth & Profile
['auth', 'me']              // GET /api/auth/me
['user', 'profile']         // GET /api/users/profile

// Progress
['progress']                // GET /api/progress (all stats)
['progress', 'lessons']     // GET /api/progress/lessons
['progress', 'streaks']     // GET /api/progress/streaks
['progress', 'badges']      // GET /api/progress/badges

// Lessons
['lessons', level]          // GET /api/lessons?level=N5
['lesson', level, day]      // GET /api/lessons/:level/:day

// SRS
['srs', 'due']              // GET /api/srs/due
['srs', 'due', 'count']     // GET /api/srs/due/count

// Quiz
['quiz', lessonId]           // GET /api/quiz/:lessonId

// AI (mutations only — no queries)
```

### Mutation Invalidation Map

| Mutation | Invalidates | Reason |
|----------|-------------|--------|
| Complete lesson | `['progress']`, `['progress', 'lessons']` | Stats change |
| Add XP | `['progress']`, `['user', 'profile']` | XP/level change |
| Submit SRS review | `['srs', 'due']`, `['srs', 'due', 'count']`, `['progress']` | Due cards change, XP change |
| Award badge | `['progress', 'badges']`, `['progress']` | Badge list changes |
| Update profile | `['user', 'profile']`, `['auth', 'me']` | Profile data changes |
| Complete quiz | `['progress']` | Stats change |

### What NOT to Put in TanStack Query

- Auth session lifecycle (login/logout/token) — imperative, not declarative
- Theme/settings — pure client state
- Daily goals — local counters
- Notifications — client inbox
- Audio/Speech state — browser APIs
- Current lesson section — UI navigation state

---

## 5. Component-Level State (React Local State)

These are NOT in stores and should remain as React local state:

| Component | Local State | Type |
|-----------|-------------|------|
| `QuizEngine.jsx` | `currentQuestion`, `selectedAnswer`, `score`, `showExplanation` | UI |
| `LessonViewer.jsx` | `currentSection`, `isCompleted` | UI |
| `SRSReview.jsx` | `currentCard`, `showAnswer`, `rating` | UI |
| `FlashCard.jsx` | `isFlipped`, `currentDeck`, `currentIndex` | UI |
| `LoginPage.jsx` | `email`, `password`, `errors`, `step` | Form |
| `RegisterPage.jsx` | `step`, `formData`, `errors` | Form |
| `ProfilePage.jsx` | `isEditing`, `uploadProgress` | UI |
| `SettingsPage.jsx` | `activeTab`, `confirmDialog` | UI |
| `ProgressChart.jsx` | `chartData`, `timeRange` | UI |

---

## 6. State Flow After Migration

```
┌─────────────────────────────────────────────┐
│                 React App                    │
├──────────┬──────────┬───────────┬────────────┤
│ TanStack │ Zustand  │ React     │ localStorage│
│ Query    │ (client) │ useState  │ (persist)   │
├──────────┼──────────┼───────────┼────────────┤
│ profile  │ settings │ form data │ theme       │
│ progress │ theme    │ UI state  │ settings    │
│ lessons  │ goals    │ modals    │ daily goals │
│ srs cards│ notifs   │ nav state │ notifs      │
│ badges   │          │ quiz flow │ sidebar     │
│ streaks  │          │ sections  │             │
├──────────┼──────────┼───────────┼────────────┤
│    ↕     │   local  │   local   │   local     │
│ Backend  │   only   │   only    │   only      │
│ API      │          │           │             │
└──────────┴──────────┴───────────┴────────────┘
```

---

## 7. Migration Rules

1. **Do NOT replace Zustand entirely** — it remains for client/UI state
2. **Do NOT add TanStack Query for non-server state** — only for data from the API
3. **Do NOT call `useQuery` inside Zustand stores** — keep them separate
4. **DO use TanStack Query** for: fetching progress, lessons, SRS cards, profile
5. **DO use `useMutation`** for: submitting reviews, completing lessons, adding XP
6. **DO invalidate related queries** after mutations
7. **DO wrap the app with `QueryClientProvider`** — already has `@tanstack/react-query` installed
8. **DO migrate incrementally** — one hook/store at a time, verify after each

---

## 8. Auth State Special Handling

The auth state is the most complex migration because it bridges imperative session management with declarative data fetching.

### Proposed Architecture

```
Login → POST /api/auth/login → Backend sets httpOnly cookie
                              → Frontend receives user data
                              → authStore.setUser(data)
                              → queryClient.setQueryData(['auth', 'me'], data)

App Load → GET /api/auth/me → If 200: set user in authStore + query cache
                             → If 401: clear authStore, redirect to login

Logout → POST /api/auth/logout → Backend clears cookie
                                → authStore.clearUser()
                                → queryClient.clear()
```

### Key Difference from Supabase
- **Supabase**: Uses `onAuthStateChange` event listener (push model)
- **Backend JWT**: Uses `GET /api/auth/me` on app load + cookie auto-send (pull model)
- **No listener needed**: httpOnly cookies are sent automatically. Auth state is checked on app initialization and after login/logout actions.
