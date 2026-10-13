# Database Architecture — Nihongo Master

> **Date**: 2026-08-23  
> **Status**: F0 — Schema Reconciliation  
> **Source**: Code analysis + Drizzle schema comparison

---

## 1. Schema Comparison: Supabase (Code-Inferred) vs Drizzle

### ⚠️ Critical Finding: The current Drizzle schema is INCOMPLETE

The Drizzle schema has **7 tables**. The application code references **at least 11 tables** plus **3-4 join tables**. Several columns referenced in code are also missing.

| Supabase Table | In Drizzle? | Drizzle Name | Missing Columns | Missing Tables | Status |
|---|---|---|---|---|---|
| `user_profiles` | ✅ (as `users`) | `users` | `streak_days` | — | **FIX NEEDED** |
| `user_lesson_progress` | ✅ | `userLessonProgress` | `time_spent` vs `time_spent_seconds` naming | — | VERIFY |
| `user_kanji_progress` | ✅ | `userKanjiProgress` | `recognition_level` (code uses `.gte('recognition_level', 1)`) | — | **FIX NEEDED** |
| `user_vocabulary_progress` | ✅ | `userVocabularyProgress` | `mastery_level` (code uses `.gte('mastery_level', 1)`) | — | **FIX NEEDED** |
| `user_streaks` | ✅ | `userStreaks` | `minutes_studied`, `xp` | — | **FIX NEEDED** |
| `user_badges` | ✅ | `userBadges` | `badge_name` | — | **FIX NEEDED** |
| `srs_cards` | ✅ | `srsCards` | — | — | ✅ OK |
| `lessons` | ❌ | — | — | **MISSING** | **CREATE NEEDED** |
| `quizzes` | ❌ | — | — | **MISSING** | **CREATE NEEDED** |
| `kanji` | ❌ | — | — | **MISSING** | **CREATE NEEDED** |
| `vocabulary` | ❌ | — | — | **MISSING** | **CREATE NEEDED** |
| `lesson_vocabulary` (join) | ❌ | — | — | **MISSING** | **DECISION NEEDED** |
| `lesson_kanji` (join) | ❌ | — | — | **MISSING** | **DECISION NEEDED** |
| `lesson_grammar` (join) | ❌ | — | — | **MISSING** | **DECISION NEEDED** |

---

## 2. Column-Level Gaps

### `users` (maps to Supabase `user_profiles`)

| Column | In Drizzle? | In Code? | Notes |
|--------|-------------|----------|-------|
| `id` | ✅ | ✅ | UUID PK |
| `email` | ✅ | ✅ | Unique |
| `username` | ✅ | ✅ | |
| `password_hash` | ✅ | N/A (Supabase auth handles) | New for JWT auth |
| `native_language` | ✅ | ✅ | |
| `current_level` | ✅ | ✅ | JLPT level |
| `avatar_url` | ✅ | ✅ | |
| `avatar_id` | ✅ | ✅ | |
| `xp_points` | ✅ | ✅ | |
| `streak_days` | ❌ **MISSING** | ✅ (progressStore reads it) | **Add to Drizzle** |
| `created_at` | ✅ | ✅ | |
| `updated_at` | ✅ | ✅ | |

### `user_kanji_progress`

| Column | In Drizzle? | In Code? | Notes |
|--------|-------------|----------|-------|
| `user_id` | ✅ | ✅ | FK |
| `kanji_id` | ✅ | ✅ | |
| `mastered` | ✅ | ❌ | Drizzle has this but code doesn't use it |
| `review_count` | ✅ | ❌ | Drizzle has this but code doesn't use it |
| `recognition_level` | ❌ **MISSING** | ✅ (`.gte('recognition_level', 1)`) | **Either add column or map `mastered` boolean** |

### `user_vocabulary_progress`

| Column | In Drizzle? | In Code? | Notes |
|--------|-------------|----------|-------|
| `user_id` | ✅ | ✅ | FK |
| `vocabulary_id` | ✅ | ✅ | |
| `mastered` | ✅ | ❌ | Drizzle has this but code doesn't use it |
| `review_count` | ✅ | ❌ | Drizzle has this but code doesn't use it |
| `mastery_level` | ❌ **MISSING** | ✅ (`.gte('mastery_level', 1)`) | **Either add column or map logic** |

### `user_streaks`

| Column | In Drizzle? | In Code? | Notes |
|--------|-------------|----------|-------|
| `user_id` | ✅ | ✅ | FK |
| `date` | ✅ | ✅ | |
| `lessons_completed` | ✅ | ✅ | |
| `minutes_studied` | ❌ **MISSING** | ✅ (`ProgressChart.jsx` fetches it) | **Add to Drizzle** |
| `xp` | ❌ **MISSING** | ✅ (`useProgress.js` upserts it) | **Add to Drizzle** |

### `user_badges`

| Column | In Drizzle? | In Code? | Notes |
|--------|-------------|----------|-------|
| `id` | ✅ | ✅ | UUID PK |
| `user_id` | ✅ | ✅ | FK |
| `badge_type` | ✅ | ✅ | |
| `badge_name` | ❌ **MISSING** | ✅ (`useProgress.js` inserts it) | **Add to Drizzle** |
| `awarded_at` | ✅ | ✅ | |

---

## 3. Badge Uniqueness — VERIFIED CORRECT ✅

The Drizzle schema defines:
```typescript
userBadgeUnique: uniqueIndex('user_badge_unique').on(table.userId, table.badgeType)
```

This is a **composite unique index on (userId, badgeType)** — NOT a global unique on `badge_type` alone.

**Behavior**: User A and User B can both have `first_lesson` badge. But User A cannot have two `first_lesson` badges. This is the correct and intended behavior.

---

## 4. XP Integrity — Design Decision

### Current Supabase Approach
- Uses an RPC function `add_xp(p_user_id, p_xp)` which performs an atomic `UPDATE SET xp_points = xp_points + p_xp`
- The `progressStore.addXP()` in the frontend also does a **non-atomic read-modify-write** as a fallback: reads local `totalXP`, adds amount, sends absolute `UPDATE` — this is the **P0 race condition**

### Required Backend Approach
The backend must:
1. **Never accept XP totals from the client** — only events
2. **Calculate XP amounts server-side** based on the event type
3. **Use atomic SQL increment**: `SET xp_points = xp_points + ?`
4. **Use transactions** when XP + badge + streak must update together

```typescript
// Backend approach — Drizzle ORM atomic increment
import { sql, eq } from 'drizzle-orm';

await db.update(users)
  .set({ xpPoints: sql`${users.xpPoints} + ${calculatedXP}` })
  .where(eq(users.id, authenticatedUserId));
```

### XP Event Types (from code analysis)

| Event | XP Amount | Source |
|-------|-----------|--------|
| `lesson_completed` | Calculated by `calculateLessonXP(score, timeSpent, isFirstTime)` | `progressCalculator.js` |
| `quiz_completed` | Calculated by `calculateQuizXP(score, totalQuestions)` | `progressCalculator.js` |
| `srs_review` | Calculated by `calculateSRSReviewXP(quality, streak)` | `progressCalculator.js` |
| `kanji_learned` | Fixed amount | `progressCalculator.js` |
| `vocab_learned` | Fixed amount | `progressCalculator.js` |
| `grammar_studied` | Fixed amount | `progressCalculator.js` |
| `daily_goal_complete` | Fixed amount | `progressCalculator.js` |

> [!IMPORTANT]
> The XP calculation functions in `progressCalculator.js` must be ported to the backend. The client should NOT calculate XP — only submit the event.

---

## 5. Content Tables — DECISION NEEDED

### How lessons are currently loaded

The `lessonStore.js` performs:
```javascript
supabase.from('lessons')
  .select('*, lesson_vocabulary(*), lesson_kanji(*), lesson_grammar(*)')
```

This means lesson content is stored in the **Supabase database** with join tables linking lessons to their vocabulary, kanji, and grammar items.

**However**, the repository also contains large **static data files** in `src/data/`:
- `n1_lessons.js` through `n5_lessons.js`
- `n1_kanji.js` through `n5_kanji.js`
- `n1_vocabulary.js` through `n5_vocabulary.js`
- `n1_grammar.js` through `n5_grammar.js`

### Design Decision Required

**Option A: Database-driven content** (current Supabase approach)
- Pros: Updateable without deploys, relational integrity
- Cons: Requires 4+ additional Drizzle tables, seed scripts, migration complexity
- Tables needed: `lessons`, `vocabulary`, `kanji`, `grammar`, `lesson_vocabulary`, `lesson_kanji`, `lesson_grammar`

**Option B: Static data files served by API** (recommended)
- Pros: Simpler schema, data already exists in `src/data/`, no seeding needed
- Cons: Requires redeploy to update content
- Backend serves data from imported static files, no additional DB tables

**Option C: Hybrid** 
- Static content from files, user progress in database
- This is what the current `src/data/` files already support

> [!IMPORTANT]
> **Recommendation: Option B/C** — Serve lesson content from the existing static data files through the backend API. User progress stays in the database. This eliminates the need for `lessons`, `vocabulary`, `kanji`, `grammar`, and join tables in TiDB, reducing schema complexity significantly.
>
> **If the Supabase database contains lesson content that differs from the static files**, we must export and compare before deciding. Mark this as **UNVERIFIED** until Supabase export is available.

---

## 6. Corrected Schema (Proposed)

Based on the reconciliation, the Drizzle schema needs these additions:

### Changes to existing tables:
1. `users`: Add `streakDays` column (INT, default 0)
2. `userKanjiProgress`: Add `recognitionLevel` column (INT, default 0) — OR remap to `reviewCount`
3. `userVocabularyProgress`: Add `masteryLevel` column (INT, default 0) — OR remap to `reviewCount`
4. `userStreaks`: Add `minutesStudied` (INT, default 0) and `xp` (INT, default 0) columns
5. `userBadges`: Add `badgeName` column (VARCHAR)

### New tables (only if Option A is chosen for content):
- `lessons` — lesson metadata
- `vocabulary` — vocabulary items
- `kanji` — kanji items  
- `grammar` — grammar items
- Join tables for lesson ↔ content relationships

### Tables NOT needed (if Option B/C):
- `lessons`, `quizzes`, `kanji`, `vocabulary` content tables
- Content served from `src/data/` static files through API

---

## 7. RPC Function Equivalents

| Supabase RPC | Purpose | Backend Equivalent |
|---|---|---|
| `add_xp(p_user_id, p_xp)` | Atomic XP increment | `sql\`xp_points = xp_points + ?\`` in Drizzle |
| `calculate_streak(p_user_id)` | Count consecutive streak days | Backend service: query `user_streaks` for consecutive dates ending today |

> [!WARNING]
> The `calculate_streak` RPC logic is **UNVERIFIED** — we don't know the exact PostgreSQL function body. The backend must implement streak calculation as a service function that queries the `user_streaks` table for consecutive dates.
