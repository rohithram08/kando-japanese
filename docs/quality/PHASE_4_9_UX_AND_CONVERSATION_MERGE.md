# Phase 4.9 UX Architecture: Public Landing & Unified Conversation Practice

**Document ID:** NM-DOC-QUAL-409-UX  
**Date:** October 2026  
**Subject:** Landing Page Onboarding Journey & Unified AI Conversation Practice Workspace  
**Status:** Implemented & Verified  

---

## 1. Context & Motivation

Prior to Phase 4.9, Nihongo Master experienced two major user experience friction points:
1. **Absence of a Public Landing Page:** The root URL `/` immediately redirected authenticated users to `/dashboard` and unauthenticated users to `/login`. New visitors had no opportunity to preview the platform's features, see the curriculum, or explore guest-accessible areas like Graded Readers and Kana Studio.
2. **Conversation Feature Fragmentation:** Japanese conversational practice was split between two separate routes and mental models:
   - `/chat` (`ChatInterface.jsx`): An AI-connected interface with a 49-scenario selector, but lacking roleplay quick-replies, session timers, and structured hints.
   - `/chat-dojo` (`ChatDojo.jsx`): A roleplay dojo featuring timers, hints, and quick-replies, but restricted to 6 hardcoded scenarios with simulated responses.

Phase 4.9 resolves both issues through architectural consolidation and purposeful UX design.

---

## 2. Public Landing Page & Onboarding Journey

### 2.1. Design Principles
- **Welcoming 2D Visual Identity:** Introduces Hana-sensei using a lightweight, responsive 2D avatar and dialog bubble. Crucially, this avoids loading Three.js or WebGL canvases on the landing page, ensuring instantaneous load times.
- **Clear Value Proposition:** Explicitly highlights the four pillars of the platform: Graded Readers, Conversation Practice, Kana Studio, and Spaced Repetition (SRS).
- **Interactive JLPT Curriculum Showcase:** An interactive level selector (N5 through N1) lets prospective learners explore kanji/vocabulary targets, core grammar points, and listen to authentic Japanese pronunciation directly from the page.
- **Frictionless Guest Exploration:** Unauthenticated learners can jump directly into the Graded Reader (`/reading`) or Kana Studio (`/kana`) without having to create an account first.

### 2.2. User Journey Mapping

```
                                [ Public Visitor ]
                                         │
                                         ▼
                                   GET / (Landing)
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              ▼                          ▼                          ▼
      [ Get Started Free ]         [ Guest Explore ]            [ Sign In ]
       (/register page)            (/reading, /kana)           (/login page)
              │                          │                          │
              ▼                          ▼                          ▼
      Create Account               Instant Learning           Access Account
              │                                                     │
              └──────────────────────────┬──────────────────────────┘
                                         ▼
                                   [ /dashboard ]
```

---

## 3. Unified Conversation Practice Workspace (`/conversation`)

### 3.1. Consolidation Architecture
The two legacy interfaces have been merged into a single cohesive workspace at `/conversation`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Conversation Practice (会話練習)                     │
├───────────────────────────────────┬────────────────────────────────────┤
│   Mode 1: 🎭 Scenario Roleplay    │      Mode 2: 💬 Free Talk (AI)     │
│   • 49 Real-world Scenarios       │      • Open-ended Conversation     │
│   • 9 Categories (Basics, Travel, │      • JLPT Level Selector (N5–N1) │
│     Daily Life, Business, etc.)   │      • Conversation Topic Starters │
│   • Quick Reply Chips             │      • Live Speech & Voice Input   │
│   • Contextual Dialogue Hints     │      • Live Grammar Corrections    │
│   • Interactive Dialogue History  │      • Native Voice TTS Playback   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 3.2. Mode 1 — Scenario Roleplay (49 Scenarios)
- **Scenario Drawer:** Filterable by 9 distinct categories (`Basics`, `Daily Life`, `Travel`, `Healthcare`, `Education`, `Business`, `Culture`, `Technology`, `Advanced`) and search terms.
- **Pedagogical Aids:**
  - **Quick Reply Chips:** Pre-authored, level-appropriate replies that learners can click to maintain conversation momentum.
  - **Contextual Hints:** Practical suggestions and grammar patterns relevant to the current scene.
  - **Live Grammar Correction Cards:** When the learner makes a particle, tense, or phrasing error, the system presents an inline correction card highlighting the original input, natural Japanese equivalent, and a clear explanation.
  - **Bilingual Toggles:** One-click toggles for Romaji and English translations.

### 3.3. Mode 2 — Free Conversation
- **Adaptive Level Control:** Allows learners to explicitly select their target JLPT level (N5 to N1), instructing the AI to calibrate vocabulary difficulty and sentence length accordingly.
- **Topic Starter Prompts:** Provides one-click conversation starters covering daily routines, food, travel, and cultural interests.

### 3.4. Technical Integration & Fallback Strategy
1. **Unified Navigation:** Replaced `/chat` and `/chat-dojo` in `src/config/sections.js` with a single entry (`id: 'conversation'`, path: `/conversation`).
2. **Backward Compatibility:** Permanent redirects configured in `src/App.jsx` for `/chat`, `/chat-dojo`, and `/chatbot` ensure bookmarks and internal links never 404.
3. **Legacy Section Resolvers:** `getSection('chat')` and `getSection('chat-dojo')` seamlessly resolve to `conversation`.
4. **Offline / Fallback Resilience:** If the backend AI proxy is temporarily unreachable, the system automatically falls back to contextual scenario mock responses with full grammar notes and translations.

---

## 4. Verification & Status

All components, route redirects, navigation links, and state stores have been thoroughly unit tested and verified in Vitest and production Vite builds.
