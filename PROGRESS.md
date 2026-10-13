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

## Phase 1: Verify Phase A (Completed)
- [x] Audit existing Phase A implementation against specifications (hero, 3D buttons, sticky header, reduced motion, sound synthesizer)
- [x] Verified Indigo/Violet primary gradient with #3730a3 bottom bevel
- [x] Verified sticky header hidden CTA aria-hidden and tabIndex -1 accessibility
- [x] Verified touch device detection disables mouse parallax
- [x] Verified sound effects opt-in and Web Audio synthesizer
- [x] All Phase A component tests passing (LandingPage.test.tsx, HanaSenseiCharacter2D.test.tsx, soundEffects.test.ts)

---

## Phase B: Scroll Storytelling (Completed)
- [x] Alternating scroll reveals for Steps 01–05 in `LearningJourneyPath.jsx` (`x: -36 / 36`, `y: 24`, spring physics)
- [x] Animated connecting SVG scroll spine (`useScroll`, `useTransform`, `useSpring`)
- [x] Parallax numeral watermarks (`01`–`05` with `useTransform` scroll offset)
- [x] Safeguards for `IntersectionObserver` & `prefers-reduced-motion`
- [x] Added `src/test/setup.ts` and unit tests in `LearningJourneyPath.test.tsx` (4 tests passing)
- [x] Quality gate verified (frontend vitest: 27 files / 229 tests, build clean, backend tsc clean, backend vitest: 8 files / 71 tests)
- [x] Browser screenshots captured across desktop (1280x800) and mobile (375x812) in light and dark modes (`docs/quality/screenshots/phase_b/`)

---

## Phase C: 5 Tappable Mini-Demos (Completed)
- [x] Demo 1: Kana Studio (`KanaMiniDemo.jsx` — tile spring for vowel row あいうえお, speech synthesis, animated SVG strokes from real `KANA_STROKES`, floating +10 XP pop)
- [x] Demo 2: Graded Reader (`ReaderMiniDemo.jsx` — real story data from Kenta's First Train, furigana ruby toggling, interactive word lookup with pitch accent contours, native speech playback, guest and auth `+ Add to SRS` integration)
- [x] Demo 3: Conversation Dojo (`DojoMiniDemo.jsx` — host prompt, two natural Japanese reply chips, gentle shake + retry explanation on party-size ordering error, celebration + host response + rate-limited confetti on polite reply)
- [x] Demo 4: SRS Flashcards (`SRSMiniDemo.jsx` — 3D card flip for 食べる, real example sentences, SM-2 memory intervals 1d → 3d → 7d → 14d → 30d Mastered ✨)
- [x] Demo 5: Hana-Sensei Daily Spark (`SparkMiniDemo.jsx` — rotating canonical sparks from real data, speech pronunciation, animated 7-day flame streak bonus banner)
- [x] Test coverage added in `src/components/landing/__tests__/miniDemos.test.tsx` (6 unit tests, all green)
- [x] Quality gates passed: frontend vitest (28 files / 235 tests), Vite build clean, backend tsc clean, backend vitest (8 files / 71 tests)
- [x] Browser screenshots captured across desktop (1280x800) and mobile (375x812) in light and dark modes (`docs/quality/screenshots/phase_c/`)


---

## Phase D: Level Picker & Polish (Completed)
- [x] JLPT N5–N1 chunky selectable cards in `src/components/landing/JLPTLevelPicker.jsx` ("I want to start at..." pattern) with hover lift, raised 3D bottom bevel (`border-b-4`), press-down on click, selected state with halo & checkmark, and spring bounce
- [x] Dynamic CTA update: `"Start ${selectedLevel} Journey"` with raised `.btn-3d-primary` styling, arrow icon, and rate-limited celebratory confetti trigger
- [x] Authentic curriculum counters in `src/components/landing/StatCounters.jsx` (46 Foundation Kana, 6 Graded Readers, 49 AI Scenarios, 2,136 Joyo Kanji) with smooth cubic ease-out count-up animations on scroll reveal and reduced-motion fallback
- [x] Rate-limited confetti utility (`src/utils/confettiHelper.ts`) ensuring maximum 1 trigger per 2.5s and automatic reduced-motion suppression
- [x] Component unit test coverage added:
  - `src/components/landing/__tests__/JLPTLevelPicker.test.tsx` (4 tests passing)
  - `src/components/landing/__tests__/StatCounters.test.tsx` (1 test passing)
  - `src/pages/__tests__/LandingPage.test.tsx` (9 tests passing)
- [x] All 4 Quality Gates passed: frontend vitest (30 files / 240 tests), Vite build clean, backend tsc clean, backend vitest (8 files / 71 tests)
- [x] Browser screenshots captured across desktop (1280x800) and mobile (375x812) in light and dark modes (`docs/quality/screenshots/phase_d/`)


---

## Phase E: Improvements & Final Report (Completed)
- [x] Bundle weight report generated in `docs/performance/BUNDLE_REPORT.md` (Landing page is 149.65 kB raw / 27.44 kB gzip; 717 kB Three.js chunk strictly isolated)
- [x] Repository weight report generated in `docs/REPO_WEIGHT_REPORT.md` (Clean 2.55 MB frontend code footprint; zero modifications to protected binary assets)
- [x] Single source of truth documentation for learning content (Curriculum benchmarks anchored to real `src/data/` files)
- [x] Auth & security review notes documented (JWT expiration validation, guest SRS local isolation, timezone client header)
- [x] Accessibility pass completed (`aria-label`, `tabIndex={-1}` for hidden sticky CTA, reduced-motion fallbacks, zero canvas initial load)
- [x] Copy risk documentation verified (zero fabricated user numbers or stats; 100% authentic Japanese linguistic content)
- [x] Comprehensive final report published in `docs/quality/FINAL_REPORT.md`
- [x] All 4 Quality Gates 100% Green across all phases (38 test files / 311 automated tests passing)


---

## Architectural & Technical Decisions Log
- **Branch:** Working strictly on `feat/stabilize-and-animate`.
- **Primary CTAs:** Maintained brand indigo/violet gradient (`linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)`) with darker bevel (`#3730a3`).
- **Sound Effects:** Procedural Web Audio API synthesis in `src/utils/soundEffects.js` (zero extra audio assets, muted by default, AudioContext created only on user interaction).
- **Date Handling Strategy:** All streak calculations are to be anchored to user's local calendar day (`YYYY-MM-DD` string arithmetic via IANA timezone) rather than server UTC.
