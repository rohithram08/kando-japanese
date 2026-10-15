# Nihongo Master — Phased Implementation Roadmap & Operational Execution Plan

**Document Version:** 1.0.0  
**Status:** Implementation Roadmap Baseline  
**Date:** 2026-10-14  
**Author:** Antigravity Engineering & Product Core  

---

## 1. Executive Summary & Phased Architecture Overview

To ensure continuous system stability, zero data loss, and uninterrupted test pass rates, the product transformation is organized into **six sequential, testable phases**. Each phase is self-contained, introduces additive changes, and requires strict verification against automated quality gates before proceeding to the next.

```
┌────────────────────────────────────────────────────────────────────────┐
│                     SIX-PHASE TRANSFORMATION TIMELINE                  │
├────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Rebrand, i18n Core & Dataset Decoupling                       │
│          • Brand identity migration (selected candidate)               │
│          • 3-tier multilingual separation (locales/ & i18n engine)     │
│                                                                        │
│ PHASE 2: Database Schema & Live Migration Integrity                    │
│          • Additive schema: lives, quiz attempts, level gating         │
│          • Read-only live DB verification protocol                     │
│                                                                        │
│ PHASE 3: Server-Authoritative Gamification & Placement Engine          │
│          • 100 HP life bar, mistake penalties, practice recovery       │
│          • 30-question diagnostic placement test (<= 30% error gate)   │
│                                                                        │
│ PHASE 4: Lexical Engine, Morphological Deconjugator & Popover          │
│          • Dedicated /dictionary section (JMdict + Tatoeba core)       │
│          • Deterministic inflection parser & contextual reading drawer │
│                                                                        │
│ PHASE 5: Comprehensive N5–N1 Curriculum Expansion                     │
│          • 9-section structured path per level (~45–54 lessons/level)  │
│          • Integrated kanji, contextual vocabulary & verified audio    │
│                                                                        │
│ PHASE 6: Learning Path UI Redesign, Leagues & Bundle Optimization      │
│          • Node-based learning roadmap dashboard                       │
│          • Weekly promotion leagues & Three.js lazy-loading isolation  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Phase Specifications

### Phase 1: Rebrand, i18n Core & Dataset Decoupling
- **Objective:** Establish the cleared brand identity and decouple English/Tamil/Hindi translations from raw Japanese curriculum datasets into clean locale files.
- **Key Tasks:**
  1. Select and approve preferred brand candidate (e.g., *KotobaQuest* or *Renwa*) following legal clearance.
  2. Implement `react-i18next` across the frontend; extract all hardcoded UI strings into `src/locales/en/ui.json`.
  3. Execute AST extraction script on `n5_vocabulary.js` and `n5_kanji.js` to create `locales/en/curriculum.json`, `locales/ta/curriculum.json`, and `locales/hi/curriculum.json`.
  4. Standardize all language identifiers to ISO 639-1 (`'en'`, `'ta'`, `'hi'`, etc.) across `settingsStore`, `LanguageSelector`, and backend schemas.
- **Files Modified/Created:**
  - `src/locales/*` (new locale files)
  - `src/i18n.ts` (new i18n config)
  - `src/store/settingsStore.js`
  - `src/components/common/LanguageSelector.jsx`
- **Acceptance Criteria & Test Gates:**
  - Automated translation parity test asserts 100% of existing Tamil and Hindi strings match.
  - Toggling language updates both UI labels and lesson word glosses synchronously without partial-switch glitches.

---

### Phase 2: Database Schema & Live Migration Integrity
- **Objective:** Prepare the database for lives, quiz tracking, level gating, and dictionary bookmarks using strictly additive, zero-downtime DDL.
- **Key Tasks:**
  1. Define new tables in `backend/src/db/schema.ts`:
     - `user_lives`: `(user_id, current_hp, max_hp, last_depleted_at, practice_completed_at)`
     - `user_quiz_attempts`: `(id, user_id, quiz_id, attempt_hash, score, mistakes, xp_awarded, created_at)`
     - `user_unlocked_levels`: `(user_id, level, unlocked_at, placement_score)`
     - `user_dictionary_bookmarks`: `(user_id, entry_id, card_type, created_at)`
  2. Author additive migration `0005_lives_quiz_and_levels.sql` and register in `meta/_journal.json`.
  3. Formulate the read-only live database schema verification script (`scripts/verify-live-schema.ts`) with bounded 3-second timeouts.
- **Acceptance Criteria & Test Gates:**
  - Drizzle migration dry-run succeeds with zero errors.
  - Zero existing user data, streaks, or badge records are modified or dropped.

---

### Phase 3: Server-Authoritative Gamification & Placement Engine
- **Objective:** Deploy the 100-point life bar, mistake penalty rules, zero-lives practice recovery, and diagnostic placement test.
- **Key Tasks:**
  1. Implement server routes in `backend/src/routes/progress.ts`:
     - `POST /api/progress/quiz/submit`: Validates answers, logs attempt hash, calculates delta XP, updates life bar.
     - `GET /api/progress/lives`: Returns current HP and recovery status.
     - `POST /api/progress/lives/practice`: Restores +20 HP per successfully reviewed missed question.
     - `POST /api/progress/placement`: Grades 30-question diagnostic exam; awards earned level tier.
  2. Implement client `gameStore.ts` tracking life bar HUD, penalty notifications, and Practice Dojo modal.
  3. Enforce backend level gating: `verifyLevelAccess` middleware rejects unauthorized queries to locked levels with `403 Forbidden`.
- **Acceptance Criteria & Test Gates:**
  - Integration tests verify that 3 mistakes trigger a 15 XP penalty clamped safely at 0 total XP.
  - Concurrent duplicate quiz submissions return identical cached responses without double-awarding XP.
  - Placement test unlocks only the earned tier (<= 30% incorrect rule).

---

### Phase 4: Lexical Engine, Morphological Deconjugator & Popover
- **Objective:** Deliver universal Japanese dictionary search and non-intrusive in-context lookup across all learning views.
- **Key Tasks:**
  1. Author rule-based deconjugator (`src/utils/deconjugator.ts`) resolving Godan, Ichidan, Kuru, Suru, and I/Na adjectives to dictionary lemmas.
  2. Ingest top 15,000 common JMdict headwords + KANJIDIC2 entries into compressed client lookup trie (`public/data/dict_core.json.gz`).
  3. Deploy backend full-text dictionary endpoints (`GET /api/dictionary/search` and `GET /api/dictionary/entry/:id`).
  4. Build non-intrusive slide-over `LookupDrawer.jsx` triggered by tapping any underlined word in Graded Readers or Lessons.
  5. Build dedicated `/dictionary` page with multi-script search, kanji breakdown, and Tatoeba bilingual example sentences.
- **Acceptance Criteria & Test Gates:**
  - Unit tests verify deconjugation of 50+ irregular, potential, causative, and passive verb forms.
  - Lookup popover opens and closes without resetting story reader audio or scroll position.

---

### Phase 5: Comprehensive N5–N1 Curriculum Expansion
- **Objective:** Expand the structured lesson catalog from 25 isolated units to 240+ cohesive, kanji-integrated lessons across 9 sections per level.
- **Key Tasks:**
  1. Standardize all curriculum data to the 10-Component Lesson Specification (`dialogue`, `vocab`, `kanji`, `grammar`, `audio`, `examples >= 3`, `quiz`).
  2. Populate compound words, readings, and translations for the 429 blank N4 and N3 kanji entries.
  3. Deduplicate the 12 duplicate kanji characters across level files.
  4. Expand vocabulary corpus from 176 words to a minimum of 800 words for N5 and 1,500 words for N4.
  5. Expand N4 and N3 grammar from 15 patterns to 60 patterns per level.
  6. Execute native peer-review protocol on all newly authored example sentences and dialogues.
- **Acceptance Criteria & Test Gates:**
  - Schema test suite asserts `lesson.kanji.length >= 2` and `examples.length >= 3` across 100% of lessons.
  - Zero duplicate kanji characters within any JLPT level dataset.

---

### Phase 6: Learning Path UI Redesign, Leagues & Bundle Optimization
- **Objective:** Deploy the node-based learning roadmap dashboard, weekly promotion leagues, and complete Three.js asset isolation.
- **Key Tasks:**
  1. Redesign `Dashboard.jsx`: Replace scattered tiles with the vertical node-based Learning Path winding through Sections 1–9.
  2. Implement weekly 30-learner leaderboards with Monday-to-Sunday scoring, promotion/relegation tiers, and daily quests.
  3. Encapsulate Three.js (`three`) and `@pixiv/three-vrm` strictly inside `React.lazy` for `/sensei` studio only; verify 0 kB Three.js on `/reading` and `/lessons`.
  4. Perform accessibility audit: verify full keyboard navigation (`1-4`, `Space`, `Enter`), ARIA landmarks, and `prefers-reduced-motion` compliance.
- **Acceptance Criteria & Test Gates:**
  - Production build bundle analysis confirms core learning routes exclude Three.js chunks.
  - WCAG 2.1 AA contrast audit passes with 0 violations.
  - All 6 quality gates exit with code 0.

---

## 3. Database Migration Safety & Live Schema Verification

Executing database migrations against live production clusters (TiDB Cloud / MySQL) carries inherent risks of connection timeouts, transaction rollbacks, or lock contention.

### Zero-Downtime Safe Verification Protocol:
1. **Never Execute Raw Migrations in Audits:** Migrations must never be triggered during inspection or audit tasks.
2. **Strict Additive-Only Changes:**
   - Use `CREATE TABLE IF NOT EXISTS` for all new entities (`user_lives`, `user_quiz_attempts`, etc.).
   - Use `ADD COLUMN IF NOT EXISTS` for new user properties.
   - Never use `DROP COLUMN`, `DROP TABLE`, or destructive column type alters on production.
3. **Bounded Pre-Flight Verification Script (`scripts/verify-live-db.ts`):**
   ```typescript
   // Bounded read-only verification query with 3000ms hard timeout
   const pool = createPool({ uri: process.env.DATABASE_URL, connectTimeout: 3000 });
   const [rows] = await pool.query(
     "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()"
   );
   await pool.end(); // Guaranteed pool closure
   ```
4. **Rollback Plan:** Every migration SQL file must be paired with an explicit, tested down-migration script (`0005_down.sql`).

---

## 4. Immediate Next Implementation Task (Phase 1, Task 1.1)

Upon formal review and approval of this Phase 0 strategy blueprint, the immediate first operational task to execute will be:

**Task 1.1: AST Extraction & Locale File Generation (Multilingual Foundation)**
- **Scope:** 
  1. Create `src/locales/` directory structure (`en/`, `ta/`, `hi/`).
  2. Execute an automated extraction script on `src/data/vocabulary/n5_vocabulary.js` and `src/data/kanji/n5_kanji.js`.
  3. Extract human-written Tamil and Hindi glosses into `src/locales/ta/curriculum.json` and `src/locales/hi/curriculum.json`.
  4. Generate English reference locale in `src/locales/en/curriculum.json` and base UI strings in `src/locales/en/ui.json`.
  5. Add unit test `src/locales/__tests__/localeParity.test.ts` verifying 100% identical translation preservation.
- **Safety Boundary:** Leaves all existing legacy data files intact; no database queries, no migrations, no commits.
