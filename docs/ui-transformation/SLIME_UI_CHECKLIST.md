# Kando Japanese — Slime UI Transformation Checklist

## Phase A — Audit & Baseline
- [x] Fix 1: Route `/quiz` to `QuizPage` and `/quiz/:lessonId` to `QuizEngine` in `src/App.jsx`.
- [x] Fix 2: Update default `DATABASE_NAME` to `nihongo_master` in `backend/src/config/env.ts`.
- [x] Inspect layout containers: Identify source of excess blank margin gutters (`max-w-7xl` on desktop).
- [x] Inspect navbar right section: Restore missing/hidden "Get Started" CTA button.

## Phase B — Foundation & Slime Design System
- [x] Slime Color Tokens in `src/index.css`: Slime Green (`#A3E635`), Fresh Lime (`#BEF264`), Deep Forest (`#365314`), Dark Green (`#1F3D18`), Soft Cream (`#FFFDF5`), Pale Mint (`#ECFCCB`).
- [x] Tactile 3D Slime Buttons (`btn-3d-slime`) with Duolingo-style lower bevel depth and tactile active depression.
- [x] Responsive layout containers widened to `max-w-[1440px] 2xl:max-w-[1536px]` with fluid proportional padding (`px-4 sm:px-8 lg:px-12 xl:px-16`).

## Phase C — Core Landing Experience & Alignment
- [x] Navbar: Always display "Get Started Free" button alongside "Sign In" to eliminate awkward right-side void.
- [x] Alignment: Align logo, headline, and section containers to identical vertical grid guides.
- [x] Hero Section: Expand character stage to balanced `lg:col-span-5` proportion with interactive 2D Slime mascot.
- [x] Section Grids: Apply widened containers to `JLPTLevelPicker`, `StatCounters`, `LearningJourneyPath`, and `Features`.

## Phase D — Authenticated App Layout Polish
- [x] `Layout.jsx`: Widen main authenticated container to `max-w-[1440px]` with fluid responsive padding.
- [x] Slime tactile cards and pill badges across learning pages.

## Phase E — Verification & Safety
- [x] Vitest tests pass across frontend and backend.
- [x] TypeScript / build verification: `npm run build` passes with zero errors.
