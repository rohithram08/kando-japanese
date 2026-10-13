# SRS Migration Plan — Nihongo Master

> **Date**: 2026-08-23  
> **Status**: F0 — Migration Readiness Audit

---

## 1. Two SRS Systems Found

The application contains **two completely separate** Spaced Repetition System implementations that do not communicate with each other.

---

## 2. System 1: Supabase-Backed SRS (Authoritative)

### Files
- [`src/services/supabase.js`](file:///e:/Nihongo-testing/nihongo-master/src/services/supabase.js) — `getSRSCards()`, `updateSRSCard()`
- [`src/services/srsAlgorithm.js`](file:///e:/Nihongo-testing/nihongo-master/src/services/srsAlgorithm.js) — SM-2 algorithm reference
- [`src/hooks/useSRS.js`](file:///e:/Nihongo-testing/nihongo-master/src/hooks/useSRS.js) — `getDueCards()`, `reviewCard()`, `addCardToSRS()`
- [`src/components/srs/SRSReview.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/srs/SRSReview.jsx) — Review UI

### Storage
- Supabase `srs_cards` table

### Card Data Shape
```
{
  id: UUID,
  user_id: UUID (FK → users),
  card_type: 'vocabulary' | 'kanji',
  item_id: UUID (FK → vocabulary/kanji),
  ease_factor: FLOAT (default 2.5),
  interval_days: INT (default 1),
  repetitions: INT (default 0),
  next_review_date: DATE,
  last_review_date: DATE,
  is_mastered: BOOLEAN (default false)
}
```

### SM-2 Algorithm (Standard)
```
if quality >= 3:
  if repetitions == 0: interval = 1
  elif repetitions == 1: interval = 6
  else: interval = round(interval * ease_factor)
  repetitions += 1
else:
  repetitions = 0
  interval = 1

ease_factor = max(1.3, ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
```

### Review Ratings
- 0 = Forgot
- 2 = Hard
- 4 = Good
- 5 = Easy

### Settings Integration
Uses `settingsStore.srsInterval` multiplier:
- `relaxed`: 1.3× (longer intervals)
- `balanced`: 1.0× (standard)
- `intense`: 0.65× (shorter intervals)

### Mastery Condition
`is_mastered = true` when `repetitions >= 8`

### Due Card Logic
```sql
SELECT * FROM srs_cards
WHERE user_id = ? AND next_review_date <= TODAY AND is_mastered = false
LIMIT 20
```

### Integration
- ✅ Awards XP via `calculateSRSReviewXP(quality, streak)`
- ✅ Updates JLPT level
- ✅ Increments daily goals (`addReview`)
- ✅ Tracks `cardsReviewed` and `cardsMastered` in progressStore

### Card Creation
Cards are added via `addCardToSRS(cardType, itemId)` which upserts into `srs_cards` with initial values.

---

## 3. System 2: localStorage-Backed SRS (Isolated/Legacy)

### Files
- [`src/components/srs/FlashCard.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/srs/FlashCard.jsx) — Contains everything: deck data, SRS logic, UI

### Storage
- `localStorage` key: `srs_data`

### Card Data Shape (Hardcoded)
```
// Static card definition (in FLASHCARD_DECKS constant)
{
  id: 'n5v1',     // static string ID
  front: '食べる',
  reading: 'たべる',
  back: 'to eat',
  example: '毎日ご飯を食べます',
  tags: ['verb', 'N5']
}

// SRS state (in localStorage)
{
  interval: INT (default 1),
  ease: FLOAT (default 2.5),
  reviews: INT (default 0),
  lastReview: timestamp,
  nextReview: timestamp
}
```

### Algorithm (Simplified — NOT standard SM-2)
```
EASY:  interval *= 2.5, ease += 0.15
GOOD:  interval *= 1.5
HARD:  interval *= 0.8, ease -= 0.15
AGAIN: interval = 1
ease = max(1.3, ease) // clamped
```

This is a **simplified multiplier system**, NOT the standard SM-2 formula.

### Review Ratings
- EASY, GOOD, HARD, AGAIN (different from System 1's numeric scale)

### Due Card Logic
**Does NOT filter by due date.** Users browse and review the entire deck at once. The `nextReview` field is computed and stored but **never used for scheduling**.

### Integration
- ❌ No XP awards
- ❌ No progress tracking
- ❌ No daily goals
- ❌ No badges
- ❌ No cross-device sync (localStorage only)

### Card Source
Cards are **hardcoded** in a massive `FLASHCARD_DECKS` object inside the component covering N5-N1 Vocabulary, Kanji, and Grammar. This is ~hundreds of cards per level.

---

## 4. Comparison Table

| Feature | System 1 (Supabase) | System 2 (localStorage) |
|---------|--------------------|-----------------------|
| Storage | Supabase DB | localStorage |
| Algorithm | Standard SM-2 | Simplified multiplier |
| Due date scheduling | ✅ Yes | ❌ Computed but unused |
| Settings integration | ✅ (interval mode) | ❌ None |
| Mastery tracking | ✅ (repetitions ≥ 8) | ❌ No mastery concept |
| XP integration | ✅ | ❌ |
| Progress tracking | ✅ | ❌ |
| Cross-device sync | ✅ | ❌ |
| Card source | Dynamic (DB references) | Static (hardcoded) |
| Card IDs | UUIDs (relational) | String literals (`n5v1`) |
| Data portability | ✅ (SQL export) | ❌ (browser-only) |

---

## 5. Migration Decision

### Authoritative System: **System 1 (Supabase-backed → TiDB-backed)**

Rationale:
- Standard SM-2 algorithm (mathematically correct)
- Due date scheduling actually works
- Integrated with gamification (XP, badges, progress)
- Relational data model (portable, queryable)
- Cross-device sync
- Settings-aware (interval mode)
- Mastery tracking

### System 2 Disposition: **Keep as standalone practice mode (optional) or remove**

Options:
1. **Remove entirely** — Delete `FlashCard.jsx`'s SRS logic. Replace with a simple "practice mode" that uses the DB-backed SRS cards.
2. **Keep as offline practice** — Allow users to practice flashcards without authentication, but clearly mark it as "offline mode" with no sync.
3. **Merge data** — NOT recommended. IDs are incompatible (string literals vs UUIDs) and algorithms differ.

> [!IMPORTANT]
> **Recommendation: Option 1** — Remove the localStorage SRS. The `FlashCard.jsx` component's deck data (N5-N1 content) should be extracted into `src/data/` files and served through the DB-backed SRS system. The component itself should be refactored to use `useSRS` hook like `SRSReview.jsx` does.

---

## 6. Migration Steps

1. **Keep both systems untouched** during F1-F6 migration phases
2. **In F7 (SRS migration)**:
   a. Extract `FLASHCARD_DECKS` content from `FlashCard.jsx` to data files
   b. Ensure the backend SRS endpoints are fully functional
   c. Refactor `FlashCard.jsx` to use the API-backed SRS
   d. Remove localStorage SRS logic
   e. Test: card creation, due date scheduling, review submission, mastery
3. **After F7**: Verify `srs_data` localStorage key is no longer written
4. **Clean up**: Remove `srsAlgorithm.js` if logic is fully in backend

---

## 7. SRS Backend Requirements

The backend `/api/srs/` routes must support:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/srs/due` | GET | Fetch cards due for review (with content) |
| `/api/srs/due/count` | GET | Count of due cards (for dashboard badge) |
| `/api/srs/cards` | POST | Add a new card to SRS deck |
| `/api/srs/cards/:id/review` | PUT | Submit review result |

The review endpoint must:
1. Validate the card belongs to the authenticated user
2. Apply SM-2 algorithm server-side
3. Apply the user's `srsInterval` setting
4. Update `ease_factor`, `interval_days`, `repetitions`, `next_review_date`, `is_mastered`
5. Award XP atomically
6. Return the updated card state
