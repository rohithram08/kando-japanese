# Nihongo Master — XP & Progress Flow Matrix

**Audit Date:** 2026-10-14  
**Auditor:** Antigravity System Audit  
**Repository:** `rohithram08/nihongo_master`  
**Current Git Branch:** `main` (Preserving uncommitted working tree changes)

---

## 1. End-to-End Activity Flow Matrix

This matrix traces every user activity from the UI click to database mutation and response handling.

| Activity | UI Entry Point | Store Function | API Endpoint & Payload | Backend Handler | Target DB Records | XP Formula & Reward | Idempotency / Farming Risk | Current Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Lesson Completion** | `LessonViewer.jsx#L126` (Complete Lesson Button) | `useProgressStore.incrementLessons()` | `POST /api/progress/lesson` `{ lessonId, score: 100, timeSpentSeconds }` | `routes/progress.ts:handleLessonProgress` | `user_lesson_progress`, `user_streaks`, `users.xpPoints` | `calculateLessonXP(score)`: 50 XP (≥90%), 40 XP (≥80%), 30 XP (≥70%), 20 XP (<70%) + streak bonus | **CRITICAL:** Zero duplicate protection. Repeat submissions award full XP endlessly. | **VULNERABLE (BUG-001)** |
| **Quiz Completion** | `QuizEngine.jsx#L206` (Finish Quiz Button) | `useProgressStore.awardQuizXP()` | `POST /api/progress/xp` `{ event: 'quiz_completed', score }` | `routes/progress.ts:handleXPIncrement` | `users.xpPoints` | `calculateQuizXP(score)`: 30 XP (≥90%), 20 XP (≥70%), 10 XP (≥50%), 5 XP (<50%) | **HIGH:** Unlimited repeats grant XP repeatedly. Scores not saved to DB. Guests crash on `user.id`. | **VULNERABLE (BUG-002, BUG-003)** |
| **Kanji Study** | `KanjiPage.jsx#L68` (+ SRS Bookmark Button) | `useProgressStore.awardKanjiXP()` | `POST /api/progress/kanji` `{ kanjiId, recognitionLevel: 1 }` | `routes/progress.ts:handleKanjiProgress` | `user_kanji_progress`, `user_streaks`, `users.xpPoints` | `XP_REWARDS.KANJI_LEARNED`: 15 XP | **HIGH (Logic Defect):** XP awarded when merely queueing in SRS without actual study. Backend has `isNewlyLearned` check. | **DEFECTIVE (BUG-005)** |
| **Vocabulary Study**| `VocabularyPage.jsx#L40` (+ SRS Bookmark Button) | `useProgressStore.awardVocabXP()` | `POST /api/progress/vocabulary` `{ vocabularyId, masteryLevel: 1 }` | `routes/progress.ts:handleVocabProgress` | `user_vocabulary_progress`, `user_streaks`, `users.xpPoints` | `XP_REWARDS.VOCAB_LEARNED`: 15 XP | **HIGH (Logic Defect):** XP awarded prematurely on SRS bookmarking. Backend has `isNewlyLearned` check. | **DEFECTIVE (BUG-005)** |
| **Kana Practice** | `KanaPage.jsx` (Kana detail/quiz) | `useProgressStore.awardKanaXP()` | `POST /api/progress/xp` `{ event: 'kanji_learned' }` (SPOOFED) | `routes/progress.ts:handleXPIncrement` | `users.xpPoints` | 10 XP (or 15 XP via spoofed kanji event) | **HIGH:** Submits `kanji_learned` event. No DB table for kana; persists only in client `localStorage`. | **DEFECTIVE (BUG-004)** |
| **Grammar Study** | `GrammarPage.jsx` | `awardGrammarXP()` (Dead Code) | None (`POST /api/progress/grammar` does not exist) | None | None (`user_grammar_progress` does not exist) | 10 XP (`XP_REWARDS.GRAMMAR_LEARNED`) | **DISCONNECTED:** UI has no action button; store function is dead; DB has no table. | **MISSING (BUG-006)** |
| **SRS Review** | `SRSReview.jsx#L78` (Rating 1–4 buttons) | `useProgressStore.awardSRSReviewXP()` | `PUT /api/srs/cards/:id/review` AND `POST /api/progress/xp` | `routes/srs.ts:reviewCard` & `routes/progress.ts:handleXPIncrement` | `srs_cards`, `users.xpPoints` | `calculateSRSReviewXP(quality)`: 10 XP (5), 8 XP (4), 5 XP (3), 2 XP (1–2) + 25 XP if mastered | **HIGH:** Disjointed dual-call architecture. `cardsReviewed: 0` hardcoded in summary, breaking badges. | **DEFECTIVE (BUG-008)** |
| **Daily Goal** | `useProgressStore.checkDailyGoals()` | `useProgressStore.awardDailyGoalXP()` | `POST /api/progress/xp` `{ event: 'daily_goal_complete' }` | `routes/progress.ts:handleXPIncrement` | `users.xpPoints` | `XP_REWARDS.DAILY_GOAL_COMPLETE`: 25 XP | Client-triggered. Vulnerable to direct API injection. | **PARTIALLY WORKING** |
| **Streak Bonus** | Daily First Activity | `useProgressStore.updateStreak()` | Handled server-side in `recordActivity` | `services/streakService.ts` | `user_streaks`, `users.streakDays` | Milestone XP: 7 days (+50 XP), 14 days (+100 XP), 30 days (+200 XP), etc. | Timezone-aware local calendar evaluation. Safe if activity record check holds. | **WORKING (Audited)** |
| **Arbitrary XP** | Direct HTTP POST | None | `POST /api/progress/xp` `{ amount: <number> }` | `routes/progress.ts:handleXPIncrement` | `users.xpPoints` | Arbitrary integer added directly to user account | **HIGH:** Completely unrestricted parameter. Any client can set XP to 1,000,000. | **VULNERABLE (BUG-009)** |

---

## 2. In-Depth Analysis of Critical Flow Failures

### 2.1 The Lesson XP Multiplication Exploit
In [`backend/src/routes/progress.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/routes/progress.ts#L225-L277):
```typescript
// Lines 232-233
const xpGained = calculateLessonXP(score);

// Lines 235-252: Upsert modifies completedAt, but does not guard against repeat calls
await db.insert(userLessonProgress).values({ ... }).onDuplicateKeyUpdate({ ... });

// Lines 271-277: Unconditional atomic XP addition
await db.update(users)
  .set({
    xpPoints: sql`${users.xpPoints} + ${totalXpToAdd}`,
    streakDays: streakResult.currentStreak,
  })
  .where(eq(users.id, userId));
```
Because there is no check testing if `userLessonProgress` was already completed prior to this request, a single completed lesson can be submitted repeatedly in an automated loop, generating thousands of XP.

### 2.2 Quiz Engine Guest User Null Pointer Crash
In [`src/components/quiz/QuizEngine.jsx#L221`](file:///e:/Nihongo-testing/nihongo-master/src/components/quiz/QuizEngine.jsx#L221):
```javascript
// Finish quiz using new XP system
const finishQuiz = async () => {
  ...
  try {
    // Award XP using the new unified system
    const result = await awardQuizXP(user.id, finalScore) // CRASH: user is null for guest!
```
For unauthenticated users trying out quizzes, `user` is `null`. Attempting to read `user.id` crashes with `TypeError: Cannot read properties of null (reading 'id')`.

### 2.3 Kana Spoofing Kanji XP
In [`src/store/progressStore.ts#L306-L309`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts#L306-L309):
```typescript
awardKanaXP: async (userId, kanaId, mastered = false) => {
  get().incrementKana();
  return get().addXP(10, userId, { event: 'kanji_learned' }); // Submits kanji_learned!
},
```
Instead of introducing a clean `kana_learned` event, kana progress piggybacks on `kanji_learned`. This corrupts analytics, incorrectly counts kana towards kanji achievements, and bypasses proper event typing.

### 2.4 Premature XP on SRS Card Intake
In [`src/pages/KanjiPage.jsx#L68-L70`](file:///e:/Nihongo-testing/nihongo-master/src/pages/KanjiPage.jsx#L68-L70):
```javascript
const handleAddToSRS = (kanji) => {
  addCardToSRS('kanji', kanji.id);
  awardKanjiXP(15, user?.id); // Awards XP immediately!
  recordKanjiProgress(user?.id, kanji.id, 1, false);
};
```
Enqueuing a card into an SRS deck merely signifies intent to review. Awarding full learning XP (+15 XP) and incrementing mastery level on intake disincentivizes actual retrieval practice.

### 2.5 Optimistic Local State Desynchronization
In [`src/store/progressStore.ts#L154-L215`](file:///e:/Nihongo-testing/nihongo-master/src/store/progressStore.ts#L154-L215):
```typescript
// 1. Eagerly update local Zustand store and localStorage
set({ totalXP: newTotal, dailyXP: newDaily, ... });
localStorage.setItem('nihongo_daily_xp', ...);

// 2. Dispatch to backend API
if (userId) {
  try {
    await submitXPEvent(...);
  } catch (err) {
    console.error('Failed to submit XP to backend:', err);
    // BUG: No rollback of totalXP or dailyXP!
  }
}
```
If the backend returns a 500 or network is interrupted, the client displays an inflated XP total that reverts unexpectedly on the next full session reload.
