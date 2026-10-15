# Nihongo Master — Comprehensive Bug & Gap Register

**Audit Date:** 2026-10-14  
**Auditor:** Antigravity System Audit  
**Repository:** `rohithram08/nihongo_master`  
**Current Git Branch:** `main` (Preserving uncommitted working tree changes)

---

## 1. Summary Classification

| Severity | Confirmed Bugs | Suspected Issues | Product Gaps | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Critical** | 1 | 0 | 0 | **1** |
| **High** | 8 | 1 | 1 | **10** |
| **Medium** | 6 | 2 | 2 | **10** |
| **Low** | 3 | 1 | 0 | **4** |
| **Total** | **18** | **4** | **3** | **25** |

---

## 2. Detailed Bug & Gap Register

### BUG-001: Repeated Lesson XP & Streak Milestone Farming
- **Severity:** `Critical`
- **Status:** `Confirmed`
- **Location:** [`backend/src/routes/progress.ts#L225-L277`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/progress.ts#L225-L277)
- **Reproduction Steps:**
  1. Authenticate with a valid user token.
  2. Send a `POST` request to `/api/progress/lesson` with payload: `{"lessonId": "n5l001", "status": "completed", "score": 100}`.
  3. Observe XP awarded (50 XP) and streak bonus awarded.
  4. Repeat the identical request 10 times consecutively.
- **Root Cause:** In `handleLessonProgress`, `xpGained = calculateLessonXP(score)` is computed unconditionally on line 232. The database updates `users.xpPoints = sql`${users.xpPoints} + ${totalXpToAdd}`` on line 274 without querying if `userLessonProgress` for this user and `lessonId` was already marked as `'completed'`.
- **User Impact:** Any client or automated script can farm unlimited XP, instantly reach maximum user level, trigger all XP milestones, and manipulate global leaderboards.
- **Recommended Fix:** Query `userLessonProgress` first. If `existing?.status === 'completed'`, award `0` XP (or a nominal repetition XP of 5 XP capped at 1 repeat per day) and skip milestone bonuses.
- **Required Regression Test:** Send two consecutive completion payloads for the same lesson; assert the second payload returns `xpGained: 0` and total XP is unchanged.

---

### BUG-002: Repeated Quiz XP Farming & Ephemeral Score Persistence
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/components/quiz/QuizEngine.jsx#L206-L239`](file:///e:/Nihongo-testing/nihongo-master/src/components/quiz/QuizEngine.jsx#L206-L239) & [`backend/src/routes/progress.ts#L670-L716`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/progress.ts#L670-L716)
- **Reproduction Steps:**
  1. Complete a quiz at `/quiz/n5l001` with score 100%.
  2. Observe XP awarded (+30 XP).
  3. Retake or re-submit the quiz repeatedly; observe +30 XP awarded on every attempt.
  4. Navigate away from the page and inspect `userLessonProgress.score` in the database.
- **Root Cause:** `QuizEngine.jsx` invokes `awardQuizXP(user.id, finalScore)`, which sends `POST /api/progress/xp` with `{ event: 'quiz_completed', score: finalScore }`. The backend increments XP on every hit without idempotency or score checking. Furthermore, quiz scores are never written to `userLessonProgress.score` or any `user_quiz_progress` table.
- **User Impact:** Users can endlessly repeat easy quizzes to inflate XP; users cannot review past quiz history or prove quiz completion.
- **Recommended Fix:** Only award XP if the new score exceeds the user's historical high score for that quiz, or award XP only once per quiz. Persist the score in `user_quiz_progress`.
- **Required Regression Test:** Retake a quiz with the same or lower score; verify no additional XP is granted.

---

### BUG-003: Uncaught TypeError for Unauthenticated Guest Quiz Completion
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/components/quiz/QuizEngine.jsx#L221`](file:///e:/Nihongo-testing/nihongo-master/src/components/quiz/QuizEngine.jsx#L221)
- **Reproduction Steps:**
  1. Open Nihongo Master in an Incognito/Private window (no logged-in user).
  2. Navigate directly to `/quiz/n5l001`.
  3. Answer all questions to reach the completion screen.
  4. Observe the console and UI crash.
- **Root Cause:** Line 221 executes `await awardQuizXP(user.id, finalScore)`. Because `user` is `null` for guests, accessing `user.id` throws `TypeError: Cannot read properties of null (reading 'id')`.
- **User Impact:** The quiz completion screen breaks for guest users; guest onboarding flow is interrupted.
- **Recommended Fix:** Use optional chaining: `await awardQuizXP(user?.id, finalScore)` and gracefully handle guest session scores in local state.
- **Required Regression Test:** Mount `QuizEngine` without an authenticated session, simulate quiz completion, and verify no crash occurs and completion modal renders.

---

### BUG-004: Kana Progress Spoofs Kanji XP Event
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/store/progressStore.ts#L306-L309`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts#L306-L309)
- **Reproduction Steps:**
  1. Study a hiragana or katakana character on `/kana`.
  2. Inspect the network request dispatched to the backend.
  3. Inspect user stats and badges.
- **Root Cause:** `awardKanaXP` invokes `addXP(10, userId, { event: 'kanji_learned' })`. It submits the `'kanji_learned'` event to `/api/progress/xp`, causing the backend to log kanji activity instead of kana.
- **User Impact:** Studying kana characters triggers kanji badges (`kanji_10`, `kanji_50`) and distorts user study analytics.
- **Recommended Fix:** Define a distinct event `kana_learned` in `xpEventSchema` and `progressStore.ts`.
- **Required Regression Test:** Trigger `awardKanaXP` and verify the payload contains `event: 'kana_learned'` and `kanjiLearned` does not increment.

---

### BUG-005: Premature XP Award on SRS Intake (+SRS Button)
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/pages/KanjiPage.jsx#L68-L70`](file:///e:/Nihongo-testing/nihongo-master/src/pages/KanjiPage.jsx#L68-L70) & [`src/pages/VocabularyPage.jsx#L40`](file:///e:/Nihongo-testing/nihongo-master/src/pages/VocabularyPage.jsx#L40)
- **Reproduction Steps:**
  1. Browse `/kanji` or `/vocabulary`.
  2. Click the `+ SRS` bookmark button on any item.
  3. Observe immediate award of +15 XP and mastery set to 1.
- **Root Cause:** Clicking `+ SRS` simultaneously calls `addCardToSRS` and `awardKanjiXP` / `awardVocabXP`. Adding a card to a review queue is not a learning or recall event.
- **User Impact:** Users earn full learning XP without reading, studying, or reviewing cards.
- **Recommended Fix:** `+ SRS` button should strictly enqueue the card via `addCardToSRS` (`POST /api/srs/cards`). XP should be awarded only when the user reviews and recalls the card in `/srs`.
- **Required Regression Test:** Click `+ SRS`; verify card is added to SRS store and user XP does not change.

---

### BUG-006: Disconnected Grammar Learning & Missing Backend Persistence
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/pages/GrammarPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/GrammarPage.jsx) & [`backend/src/db/schema.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/db/schema.ts)
- **Reproduction Steps:**
  1. Navigate to `/grammar`.
  2. Review multiple grammar patterns and explanations.
  3. Check user profile or database for recorded grammar progress.
- **Root Cause:** `GrammarPage.jsx` does not import `useProgressStore`, does not invoke `awardGrammarXP`, contains no "Mark as Studied" or "Mastered" controls, and no `user_grammar_progress` table exists in the database schema.
- **User Impact:** Grammar learning is completely untracked. Users cannot track which grammar points they know, and grammar achievements cannot be earned legitimately.
- **Recommended Fix:** Add `user_grammar_progress` table in `schema.ts`, create `/api/progress/grammar` endpoints, and add study/mastery toggle buttons to grammar cards in `GrammarPage.jsx`.
- **Required Regression Test:** Mark a grammar point as studied; verify database record created and progress reflected in dashboard.

---

### BUG-007: Optimistic State Desynchronization on API Failure
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/store/progressStore.ts#L154-L215`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts#L154-L215)
- **Reproduction Steps:**
  1. Simulate network disconnect or simulate 500 error from `/api/progress/xp`.
  2. Complete an activity in the UI.
  3. Observe UI updates XP immediately and writes to `localStorage`.
  4. Reload page; observe XP reverts to server value.
- **Root Cause:** `addXP` optimistically updates local Zustand state and caches to `localStorage` before `submitXPEvent` finishes. In the `catch (err)` block, the error is merely logged with `console.error` without rolling back the state.
- **User Impact:** Confusing XP fluctuations and broken state consistency during intermittent connectivity.
- **Recommended Fix:** Store previous state before optimistic mutation and restore previous state in the `catch` block while alerting the user.
- **Required Regression Test:** Mock API rejection; assert store rolls back to original XP and warns the user.

---

### BUG-008: SRS Badges Unobtainable Due to Hardcoded Zero Count
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`backend/src/routes/progress.ts#L152`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/progress.ts#L152) & [`backend/src/services/progressCalculator.ts#L103-L104`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/progressCalculator.ts#L103-L104)
- **Reproduction Steps:**
  1. Perform 100+ or 500+ SRS reviews in `/srs`.
  2. Fetch `/api/progress` summary and inspect `cardsReviewed`.
  3. Inspect badges awarded.
- **Root Cause:** `backend/src/routes/progress.ts:152` hardcodes `cardsReviewed: 0` in `statsData`. The badge logic in `progressCalculator.ts` requires `(s.cardsReviewed || 0) >= 100` for `srs_100` ("Review Rookie") and `>= 500` for `srs_500` ("Memory Builder").
- **User Impact:** Both SRS review badges can never be unlocked by any user.
- **Recommended Fix:** Compute actual review count by summing `reviewCount` from `user_kanji_progress` and `user_vocabulary_progress`, or query `srsCards` review events.
- **Required Regression Test:** Seed 100 reviews; call `/api/progress` and verify `srs_100` badge is awarded and `cardsReviewed` is 100.

---

### BUG-009: Unvalidated Direct XP Modification Endpoint
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`backend/src/routes/progress.ts#L670-L716`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/progress.ts#L670-L716)
- **Reproduction Steps:**
  1. Send `POST /api/progress/xp` with body `{"amount": 999999}`.
  2. Check response and profile.
- **Root Cause:** `xpEventSchema` allows arbitrary positive integer `amount`. When provided, `handleXPIncrement` directly executes `users.xpPoints = sql`${users.xpPoints} + ${amount}`` without verifying the originating event or proof of work.
- **User Impact:** Client can grant themselves any amount of XP at will, undermining the gamification integrity.
- **Recommended Fix:** Remove the raw `amount` parameter; allow XP awards only through specific validated event types calculated server-side.
- **Required Regression Test:** Send `{"amount": 5000}`; verify server responds with `400 Bad Request`.

---

### BUG-010: 100% Missing Example Sentences in N4 and N3 Kanji Datasets
- **Severity:** `High`
- **Status:** `Confirmed`
- **Location:** [`src/data/kanji/n4_kanji.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/kanji/n4_kanji.js) & [`src/data/kanji/n3_kanji.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/kanji/n3_kanji.js)
- **Reproduction Steps:**
  1. Open `/kanji`.
  2. Select JLPT Level N4 or N3.
  3. Click any kanji card to view its Detail Panel.
  4. Switch to the "Examples" tab.
- **Root Cause:** All 190 entries in `n4_kanji.js` and all 239 entries in `n3_kanji.js` completely omit the `examples` property. The normalizer in `src/data/index.js:82` falls back to `examples: []`.
- **User Impact:** 429 kanji (45.6% of the entire kanji curriculum) show blank example sections, crippling contextual learning for intermediate students.
- **Recommended Fix:** Populate all N4 and N3 kanji entries with verified compound words, readings, and English translations.
- **Required Regression Test:** Automated schema test asserting `examples.length >= 2` for all kanji across all levels.

---

### BUG-011: 12 Duplicate Kanji Entries Within Level Files
- **Severity:** `Medium`
- **Status:** `Confirmed`
- **Location:**
  - `src/data/kanji/n4_kanji.js`: `着` (x2), `太` (x2), `社` (x2), `味` (x2), `意` (x2), `験` (x2)
  - `src/data/kanji/n3_kanji.js`: `論` (x2), `表` (x2), `際` (x2), `産` (x2), `仮` (x2)
  - `src/data/kanji/n2_kanji.js`: `拡` (x2)
- **Root Cause:** Manual dataset compilation without uniqueness deduplication checks.
- **User Impact:** Duplicate flashcards, repeated SRS additions, and inaccurate kanji count reporting.
- **Recommended Fix:** Deduplicate entries in each file; ensure unique kanji characters per JLPT level.
- **Required Regression Test:** Test asserting `new Set(levelKanji.map(k => k.kanji)).size === levelKanji.length`.

---

### BUG-012: Lessons Contain Zero Kanji References
- **Severity:** `Medium`
- **Status:** `Confirmed`
- **Location:** [`src/data/lessons/*_lessons.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/lessons/)
- **Root Cause:** In all 25 lesson files across N5 through N1, the `kanji` array in every lesson object is empty (`kanji: []`).
- **User Impact:** The lesson flow only teaches vocabulary and grammar without introducing or integrating kanji study.
- **Recommended Fix:** Associate 3–5 relevant kanji characters with each lesson matching the lesson's theme and vocabulary.

---

### BUG-013: Extremely Low Vocabulary Dataset Size (176 Words Total)
- **Severity:** `Medium`
- **Status:** `Confirmed`
- **Location:** [`src/data/vocabulary/*_vocabulary.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/vocabulary/)
- **Details:** N5: 61 words; N4: 30 words; N3: 25 words; N2: 30 words; N1: 30 words. Total = 176 words.
- **User Impact:** Far below standard JLPT benchmarks (N5 requires ~800; N1 requires ~10,000). The app cannot serve as a serious vocabulary platform without dataset expansion.
- **Recommended Fix:** Expand vocabulary to at least 500 words for N5 and 1,000 for N4, or integrate an open-source dictionary.

---

### BUG-014: Absence of General Dictionary Lookup Functionality
- **Severity:** `Medium`
- **Status:** `Confirmed`
- **Location:** Entire codebase
- **Details:** The app advertises dictionary lookup in marketing copy, but the only implementation is a popover for pre-annotated reading tokens in `VocabLookupModal.jsx`. There is no dictionary search by kanji, kana, romaji, or English, and no deconjugation parser.
- **User Impact:** Learners cannot look up unfamiliar words encountered in free-form study.
- **Recommended Fix:** Build a dedicated `/dictionary` page and search widget powered by a compressed JMdict dataset or API.

---

### BUG-015: Audio Race Condition on Rapid Sentence Clicking
- **Severity:** `Medium`
- **Status:** `Confirmed`
- **Location:** [`src/hooks/useStoryAudio.ts`](file:///e:/Nihongo-testing/nihongo-master/src/hooks/useStoryAudio.ts) & [`src/services/audioService.js`](file:///e:/Nihongo-testing/nihongo-master/src/services/audioService.js)
- **Details:** In `useStoryAudio.ts`, if a user rapidly clicks different sentences in a story reader, speech synthesis utterances can queue up or cut off abruptly without resolving the previous sentence's state.
- **Recommended Fix:** Ensure synchronous `window.speechSynthesis.cancel()` and clean state resetting prior to each speech dispatch.

---

### BUG-016: Lesson Completion Score Hardcoded to 100%
- **Severity:** `Low`
- **Status:** `Confirmed`
- **Location:** [`src/components/lessons/LessonViewer.jsx#L135`](file:///e:/Nihongo-testing/nihongo-master/src/components/lessons/LessonViewer.jsx#L135)
- **Details:** `completeLesson` always sends `score: 100`, regardless of how many exercise questions the user answered correctly during the lesson.
- **Recommended Fix:** Calculate actual exercise score percentage in `LessonViewer.jsx` before submitting.

---

### BUG-017: Lack of Kanji Stroke Order Data for Levels N4–N1
- **Severity:** `Low`
- **Status:** `Confirmed`
- **Location:** [`src/components/kanji/StrokeOrder.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/kanji/StrokeOrder.jsx)
- **Details:** Stroke order SVG animations rely on KanjiVG files stored in `/public/strokes/`, which currently only cover a small fraction of N5 kanji.
- **Recommended Fix:** Bundle or lazy-fetch KanjiVG SVGs dynamically from a CDN or complete SVG sprite sheet.

---

### BUG-018: Inconsistent Data Export Formats Across JLPT Levels
- **Severity:** `Low`
- **Status:** `Confirmed`
- **Location:** [`src/data/index.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/index.js)
- **Details:** N5/N4/N3 kanji export `char`, `en`, `strokes`, while N2/N1 export `kanji`, `meaning`, `strokeCount`. Requiring heavy normalization in `index.js`.
- **Recommended Fix:** Standardize all data files to a single canonical TypeScript interface.
