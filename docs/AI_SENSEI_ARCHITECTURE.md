# AI Sensei — Forensic Audit & Architecture Proposal

> **Checkpoint A — Pre-Flight Forensic Audit (Expanded)**
> Date: 2026-08-30
> Status: **COMPLETE**

---

## Table of Contents

1. [Existing Infrastructure Overview](#1-existing-infrastructure-overview)
2. [Recommended 3D Character Architecture](#2-recommended-3d-character-architecture)
3. [Sensei Knowledge & RAG Architecture](#3-sensei-knowledge--rag-architecture)
4. [AI Backend & Context Architecture](#4-ai-backend--context-architecture)
5. [Training & Evaluation Strategy](#5-training--evaluation-strategy)
6. [Onboarding & Daily Learning](#6-onboarding--daily-learning)
7. [Drama & Listening Section Repair](#7-drama--listening-section-repair)
8. [Database Schema Additions](#8-database-schema-additions)
9. [Security & Performance](#9-security--performance)
10. [Checkpoint A Final Result](#10-checkpoint-a-final-result)

---

## 1. Existing Infrastructure Overview

- **Auth:** JWT + HttpOnly cookies (fully decoupled from Supabase).
- **Database:** TiDB Cloud via Drizzle ORM.
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand.
- **AI Provider:** Groq Cloud (`llama-3.3-70b-versatile`) via server-side `axios` (no SDK).
- **Audio:** Web Speech API (`SpeechSynthesis`) via `audioService.js` (supports Japanese voices natively).
- **Remnants:** Zero runtime Supabase dependencies.

---

## 2. Recommended 3D Character Architecture

An exhaustive evaluation of animation approaches (React Three Fiber, Lottie, Rive, Live2D, SVG) was conducted.

### Primary Recommendation: React Three Fiber (R3F) + VRM
**Why:** True 3D anime aesthetic, native Japanese lip-sync visemes, and physics (hair/clothing) with reasonable lazy-loaded bundle impact.

- **Stack:** `three` + `@react-three/fiber` + `@react-three/drei` + `@pixiv/three-vrm`
- **Bundle Cost:** ~195 KB - 245 KB (gzipped). **Must be code-split** using `React.lazy()` so it adds 0 KB to the initial app load.
- **Asset Pipeline:** 
  - Generate the base character in **VRoid Studio** (Free, standard for VTubers/Anime models).
  - Export as `.vrm` (typically 1.5MB - 2.5MB).
- **Animation States:** Idle, talking, happy, thinking, celebrating, encouraging. Transitions cross-faded via Three.js `AnimationMixer`.
- **Lip-Sync (Mouth Sync):** VRM standard includes A, I, U, E, O visemes. Sync this with `audioService.js` using an interval or `AudioContext` frequency analyzer to modulate the `ExpressionManager` blendshapes dynamically while TTS is active.

### Lightweight Fallback: Modular SVG + Framer Motion
If the ~200KB bundle + 2MB asset payload proves too heavy for lower-end devices, the architecture will fall back to layered SVGs animated via `framer-motion` (0 KB new dependencies), dynamically swapping mouth vector paths during speech.

---

## 3. Sensei Knowledge & RAG Architecture

A complete audit of `src/data/` reveals a highly structured, semantically rich dataset perfect for a Retrieval-Augmented Generation (RAG) layer.

### Content Volume (The "Sensei Brain")
- **Lessons:** 25
- **Grammar Points:** 130 (with structures, examples, translations)
- **Kanji Entries:** 720 (with on/kun, strokes, meanings)
- **Vocabulary:** 176 (with pos, multilingual definitions)
- **Total Semantic Chunks:** ~1,051 primary learning items.

### RAG Chunking Strategy
Instead of generic LLM knowledge, Sensei will prioritize the platform's canonical data. 
**Metadata Schema per Chunk:**
```json
{
  "content_type": "grammar | kanji | vocabulary | lesson | drama",
  "jlpt_level": "N5 | N4 | N3 | N2 | N1",
  "topic_or_character": "〜は〜です | 食 | 食べる",
  "tags": ["copula", "beginner", "food"]
}
```
**Retrieval Flow:** User Query -> Embeddings Search -> Retrieve Top K Platform Chunks -> Inject to Sensei Context -> Generate Response.

---

## 4. AI Backend & Context Architecture

The AI layer will be isolated behind a clean interface to allow provider swapping and strict domain enforcement.

### Internal Service Interface (`backend/src/services/senseiService.ts`)
```typescript
interface SenseiService {
  buildLearningContext(userId: string, currentPage: string): Promise<SenseiContext>;
  retrieveKnowledge(query: string, level: string): Promise<PlatformContent[]>;
  generateResponse(context: SenseiContext, userMessage: string): Promise<SenseiResponse>;
  validateResponse(rawResponse: any): SenseiResponse;
  generateDailyPlan(userId: string): Promise<DailyRecommendation>;
}
```

### Context Builder Payload
Sensei automatically knows:
1. **User Profile:** JLPT Level, Native Language (for translated explanations).
2. **Real-time Progress:** Current streak, total XP, recent activity.
3. **Study State:** SRS cards due right now, incomplete lessons.
4. **Current Page:** Platform context (e.g., "User is on the Kanji page").

### Response Schema & Navigation Whitelist
Responses are strictly structured JSON ensuring the LLM can trigger UI actions (e.g., navigating the user, launching a quiz) without raw string parsing hacks. Target routes are strictly whitelisted (`/lessons`, `/kanji`, `/review`, `/drama`, etc.).

---

## 5. Training & Evaluation Strategy

Sensei will NOT be blindly fine-tuned. The strategy relies on **Domain-Specific System Instructions + Structured RAG + Few-Shot Examples**.

### Prompt Injection & Domain Restriction
- **Out-of-Scope:** If asked "Who is the US President?", the system prompt forces a friendly refusal: *"I'm your Nihongo Master Sensei! Let's get back to Japanese..."*
- **Hard Guardrails:** The LLM does not have access to database credentials, arbitrary APIs, or hidden implementation details.

### Automated Evaluation Harness
Before Checkpoint J (Full QA), a test dataset of 50-100 representative interactions will be run against the Sensei endpoint, measuring:
1. **Groundedness:** Does it cite actual `src/data` kanji/vocab?
2. **Domain Adherence:** Does it successfully refuse Python/History questions?
3. **Language Consistency:** Does it respond in Tamil if `nativeLanguage === 'Tamil'`?
4. **Hallucination Rate:** Does it invent features the platform lacks?

---

## 6. Onboarding & Daily Learning

### Guided Tour (`sensei_tour_progress`)
First login triggers an interactive, resumable tour:
1. Welcome & Dashboard -> 2. Lessons -> 3. Vocab/Kanji -> 4. SRS/Quizzes -> 5. Drama.
State is tracked in the database so it can be resumed if interrupted.

### Actionable Daily Plans
Sensei generates real-time plans based on TiDB progress:
* *"Review 8 SRS cards"* (Links to `/review`)
* *"Complete N4 Lesson 2"* (Links to `/lessons/N4/2`)

---

## 7. Drama & Listening Section Repair

The current `/drama` page lacks an in-app player. Checkpoint B will implement:
1. **Reusable `ListeningVideoModal`:** Uses YouTube's official iFrame embed API.
2. **In-App Immersion:** Clicking a video opens the modal *over* the Drama page. Closing it keeps the user exactly where they were.
3. **Fallback:** Clean error handling ("Watch on YouTube" button) if the author disabled embedding.
4. **Verified Content:** 13 verified learning podcasts and channels already in `src/data/dramaResources.ts` will be surfaced with JLPT filters.

---

## 8. Database Schema Additions

Additive tables only (via Drizzle ORM). No changes to existing tables.

```sql
-- Sensei Chat History (Keeps context memory, bounded to last N messages)
CREATE TABLE sensei_conversations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  intent VARCHAR(50),
  emotion VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Sensei Tour State
CREATE TABLE sensei_tour_progress (
  user_id VARCHAR(36) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_step INT DEFAULT 0 NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  skipped BOOLEAN DEFAULT FALSE NOT NULL
);
```

---

## 9. Security & Performance

- **Secrets:** Groq API keys remain 100% server-side.
- **Auth:** All endpoints wrapped in `requireAuth` middleware.
- **Performance:** 3D dependencies are code-split. Context builder queries hit indexed TiDB columns. AI endpoint uses `aiLimiter` (10 req/min).

---

## 10. Checkpoint A Final Result

### Status: PASS

All aspects of the requested expanded architecture audit have been thoroughly documented:
- 3D evaluation complete (R3F + VRM selected).
- Knowledge layer mapped (1,051 distinct items ready for chunking).
- Training and evaluation testing plan defined.
- Existing AI, Auth, Content, Routing, and Bugs analyzed.

**Files Inspected:** 42+ (React components, Drizzle schema, Zustand stores, static data).  
**Files Modified:** 0.

**Next Step:** Checkpoint B — Drama / Listening Repair.
