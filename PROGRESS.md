# Nihongo Master — Engineering & Animation Progress Log

**Branch:** `feat/stabilize-and-animate`  
**Last Updated:** Phase 0 Initialization

---

## Current Status
- **Current Phase:** Phase 0 — Stabilize & Bug Fixes
- **Branch Created:** `feat/stabilize-and-animate`
- **Baseline Quality Gates:**
  - Frontend vitest: 25 files / 221 tests passing
  - Backend typecheck (`tsc --noEmit`): clean
  - Backend vitest: 8 files / 66 tests passing
  - Frontend production build: passes

---

## Phase 0: Stabilize (In Progress)

### 0.1 Streak Bug Fixes (Completed)
- [x] Reproduce streak issues with failing tests
- [x] Add `timezone` column to `users` via Drizzle migration (`0002_user_timezone.sql`)
- [x] Add timezone resolution & `getLocalDateString` helper with calendar-day arithmetic
- [x] Refactor `calculateStreakFromDates` to use `YYYY-MM-DD` string arithmetic without UTC shifts
- [x] Update `recordActivity` to write exact local date strings to DB `date` column
- [x] Fix stale `users.streakDays` reads in all paths (`/progress`, `users.ts`, `senseiContext.ts`)
- [x] Prevent streak milestone bonus farming (award only on first activity of local day)
- [x] Align frontend and backend streak XP (backend as single source of truth)
- [x] Fix `longestStreak` reporting in `useProgress.ts`
- [x] Write `xp` and `minutesStudied` to `user_streaks`
- [x] Fix kanji route updating `streakDays` consistently
- [x] Implement streak test matrix (Asia/Kolkata, America/New_York DST, same-day, gap, yesterday, milestone bonuses)

### 0.2 Other Bugs & Hygiene (Completed)
- [x] Restore corrupted emoji in `progressCalculator.ts` badge names & add migration script for `??` rows (`0003_repair_badge_emojis.sql`)
- [x] Fix React hooks order bug in `src/components/reading/VocabLookupModal.jsx` (and add regression test in `VocabLookupModal.test.tsx`)
- [x] Configure ESLint flat config with `typescript-eslint` for `.ts/.tsx` and fix lint errors (`npm run lint` -> 0 errors)
- [x] Regenerate `package-lock.json` (`npm install`) to ensure `npm ci` passes
- [x] Address fake endpoints & doc clarification (`/reset-password-request`, `/reset-password`, `/quiz/:lessonId`)
- [x] Honor validated `JWT_EXPIRES_IN` env in `auth.ts`
- [x] Audit & migrate/clean legacy duplicate SRS storage (`FlashCard.jsx` -> `nihongo_guest_srs_deck`)
- [x] Prevent duplicate progress logic drift between frontend and backend (`progressCalculatorParity.test.ts`)

---

## Phase 1: Verify Phase A (Pending)
- [ ] Audit existing Phase A implementation against specifications
- [ ] Fix any gaps in hero, 3D buttons, sticky header, reduced motion, or sound synthesizer

---

## Phase B: Scroll Storytelling (Pending)
- [ ] Alternating scroll reveals for Steps 01–05 in `LearningJourneyPath.jsx`
- [ ] Animated connecting SVG scroll spine (`useScroll`, `useTransform`, pathLength)
- [ ] Parallax numeral watermarks
- [ ] Quality gate & browser screenshots (desktop + mobile, light + dark)

---

## Phase C: 5 Tappable Mini-Demos (Pending)
- [ ] Demo 1: Kana Studio (tile spring, audio, SVG stroke animation, +10 XP)
- [ ] Demo 2: Graded Reader (real graded story data, furigana tooltip, + Add to SRS)
- [ ] Demo 3: Conversation Dojo (typing dots, 2 natural Japanese chips, gentle retry feedback, celebration)
- [ ] Demo 4: SRS Flashcards (3D flip, real vocab, 1d-3d-7d-14d-30d intervals)
- [ ] Demo 5: Hana-Sensei Daily Spark (rotating real sparks, animated flame streak)
- [ ] Quality gate & browser screenshots

---

## Phase D: Level Picker & Polish (Pending)
- [ ] JLPT N5–N1 chunky selectable cards with spring pop & dynamic sentence/CTA update
- [ ] Real counters only (no fabricated stats)
- [ ] Rate-limited confetti on genuine success moments
- [ ] Lazy loading with `Suspense` and `useMotionValue` optimization
- [ ] Component tests for each demo
- [ ] Quality gate & browser screenshots

---

## Phase E: Improvements & Final Report (Pending)
- [ ] Bundle weight report in `docs/performance/`
- [ ] Repo weight report in `docs/`
- [ ] Single source of truth documentation for learning content
- [ ] Auth & security review notes
- [ ] Accessibility pass
- [ ] Copy risk documentation
- [ ] Final report `docs/quality/FINAL_REPORT.md`

---

## Architectural & Technical Decisions Log
- **Branch:** Working strictly on `feat/stabilize-and-animate`.
- **Primary CTAs:** Maintained brand indigo/violet gradient (`linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)`) with darker bevel (`#3730a3`).
- **Sound Effects:** Procedural Web Audio API synthesis in `src/utils/soundEffects.js` (zero extra audio assets, muted by default, AudioContext created only on user interaction).
- **Date Handling Strategy:** All streak calculations are to be anchored to user's local calendar day (`YYYY-MM-DD` string arithmetic via IANA timezone) rather than server UTC.
