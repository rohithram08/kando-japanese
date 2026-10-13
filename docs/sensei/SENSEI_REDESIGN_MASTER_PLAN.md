# AI Sensei — Complete Redesign Master Plan

> **Audit Date**: 2026-08-30  
> **Status**: ARCHITECTURE & PLANNING ONLY — NO CODE CHANGES  
> **Prerequisite**: [SENSEI_VISUAL_GAP_ANALYSIS.md](file:///e:/Nihongo-testing/nihongo-master/docs/sensei/SENSEI_VISUAL_GAP_ANALYSIS.md) (25-point gap: 19 ❌ / 6 ⚠️ / 0 ✅)

---

## Executive Summary

The current AI Sensei implementation has a **strong backend brain** (Groq + RAG + Guardrails: 30/30 tests) and a **well-architected frontend controller system** (12-state animation machine, modular controllers, Zustand store), but the visual character is a **procedural geometric placeholder** that scores 0/25 matches against the target design.

This plan defines a **complete visual reconstruction** while preserving and building upon the existing backend, controller, and UI infrastructure. The core challenge is **asset creation** — producing a high-fidelity 3D character that matches the reference images.

---

## Table of Contents

1. [Visual Gap Analysis Summary](#1-visual-gap-analysis-summary)
2. [3D Technology Evaluation](#2-3d-technology-evaluation)
3. [Character Creation Pipeline](#3-character-creation-pipeline)
4. [UI Reconstruction Design](#4-ui-reconstruction-design)
5. [Movable Character Interaction Model](#5-movable-character-interaction-model)
6. [Character State Machine](#6-character-state-machine)
7. [Voice + Lip Sync Audit](#7-voice--lip-sync-audit)
8. [Visual Design System](#8-visual-design-system)
9. [Product Experience Flow](#9-product-experience-flow)
10. [Current Code Audit](#10-current-code-audit)
11. [Test Strategy](#11-test-strategy)
12. [Performance Budgets](#12-performance-budgets)
13. [Phased Implementation Plan](#13-phased-implementation-plan)
14. [Risks & Mitigations](#14-risks--mitigations)

---

## 1. Visual Gap Analysis Summary

**Full analysis**: [SENSEI_VISUAL_GAP_ANALYSIS.md](file:///e:/Nihongo-testing/nihongo-master/docs/sensei/SENSEI_VISUAL_GAP_ANALYSIS.md)

| Category | Elements | ❌ Missing | ⚠️ Partial | ✅ Match |
|----------|----------|-----------|-----------|---------|
| Body & Silhouette | 5 | 5 | 0 | 0 |
| Kimono & Clothing | 6 | 4 | 2 | 0 |
| Face & Head | 5 | 4 | 1 | 0 |
| Hair | 3 | 3 | 0 | 0 |
| Accessories | 3 | 1 | 2 | 0 |
| Environment | 3 | 2 | 1 | 0 |
| **TOTAL** | **25** | **19** | **6** | **0** |

**Root Cause**: The placeholder was designed as infrastructure, not visual art. The gap requires a **3D character asset**, not more procedural geometry code.

---

## 2. 3D Technology Evaluation

### 2.1 Format Comparison

| Technology | Pros | Cons | Recommendation |
|------------|------|------|----------------|
| **VRM** (current setup) | Standard avatar format, built-in blendshapes (VRM 1.0), spring bone physics, expression presets, `@pixiv/three-vrm` already installed | Limited to humanoid models, less flexible than raw GLB, tooling ecosystem smaller, harder to add custom props (wand, cap) | ⚠️ KEEP as optional path but not primary |
| **GLB/GLTF** | Universal 3D format, full flexibility (custom rigs, props, particles), larger tooling ecosystem (Blender, Maya, 3DS Max), animation clips, PBR materials | Must implement blendshape/expression system manually, no built-in spring bone (needs cannon.js or custom) | ✅ **PRIMARY RECOMMENDATION** |
| **Live2D** | Industry standard for 2D character animation (VTubers, gacha games), deformation-based animation, lightweight | 2D only (no 3D rotation), limited interaction paradigm, separate SDK license cost, doesn't match R3F architecture | ❌ NOT RECOMMENDED for this project |
| **2D Sprite/Spine** | Very lightweight, simple pipeline, good for mobile | Cannot achieve the 3D depth and rotation shown in references | ❌ NOT RECOMMENDED |
| **Hybrid (2D Art + 3D Scene)** | High-quality 2D character art overlaid on 3D environment, simpler asset pipeline | Limited pose/rotation flexibility, breaks the "3D companion" paradigm | ⚠️ VIABLE FALLBACK if 3D asset timeline is unacceptable |

### 2.2 Recommended Architecture: GLB + R3F

```
┌─────────────────────────────────────────────────┐
│               SENSEI BRAIN                       │
│  Groq/LLaMA → RAG → Guardrails → User Context  │
│  Output: { text, emotion, gesture, action }     │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│            CHARACTER BRAIN                       │
│  Animation Controller → Emotion Engine          │
│  → Gesture Engine → Facial Engine               │
│                                                 │
│  Input: { emotion, gesture }                    │
│  Output: bone rotations, blendshapes, clips     │
└───────────────────┬─────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│           CHARACTER RENDERER                     │
│  R3F Canvas → GLB Model → Animation Mixer       │
│  → Blendshape Driver → Spring Physics           │
│  → Particle System → Post-Processing            │
└─────────────────────────────────────────────────┘
```

### 2.3 Why GLB over VRM

1. **Prop flexibility**: Wand, cap, earrings, hair accessories can be separate meshes parented to bones
2. **Animation clips**: Pre-baked `.glb` animation clips (idle, wave, point, celebrate) from Blender/Mixamo
3. **Material control**: Full PBR + custom shaders for sakura pattern, fabric shimmer, wand glow
4. **Tooling**: Blender → GLB export is the most mature 3D web pipeline
5. **Backward compatibility**: The existing controller architecture works with both GLB and VRM (just needs adapter)

---

## 3. Character Creation Pipeline

### 3.1 Asset Requirements Specification

| Asset | Format | Poly Budget | Texture Budget | Notes |
|-------|--------|-------------|---------------|-------|
| **Character Body** | GLB | 15K–30K tris | 2K diffuse + 2K normal | Single mesh or skinned mesh with skeleton |
| **Kimono** | Part of body GLB | Included above | Sakura pattern baked into diffuse | Sleeve physics via spring bones or cloth sim |
| **Hair** | Part of body GLB | 5K–10K tris | 1K diffuse + 1K alpha | Alpha-tested strands or solid mesh hair |
| **Cap** | Part of body GLB | 500–1K tris | Shared atlas | Parented to head bone |
| **Wand** | Part of body GLB | 500–1K tris | 512 diffuse + 512 emissive | Parented to right hand bone |
| **Earrings & Accessories** | Part of body GLB | 200–500 tris | Shared atlas | Parented to head bone |
| **Animation: Idle** | GLB clip or JSON | — | — | 2–4 second loop, subtle breathing + sway |
| **Animation: Wave** | GLB clip | — | — | 1.5 second greeting gesture |
| **Animation: Point** | GLB clip | — | — | Wand extended forward |
| **Animation: Celebrate** | GLB clip | — | — | Both arms up, happy bounce |
| **Animation: Think** | GLB clip | — | — | Head tilt, hand to chin |
| **Animation: Talk** | Blendshape-driven | — | — | A/I/U/E/O visemes + emotions |
| **Sakura Petals** | Instanced mesh or sprite | 50–100 particles | 64×64 alpha sprite | GPU instanced for performance |

### 3.2 Tool Pipeline Options

#### Option A — Professional 3D Artist (Recommended for Production)

```
Concept Art (reference images)
    → Blender/ZBrush High-Poly Sculpt
    → Retopology → Low-Poly Game-Ready Mesh
    → UV Unwrap → PBR Texture Paint (Substance Painter)
    → Rigging (Blender Armature / Mixamo Auto-Rig)
    → Blendshape Sculpting (face shapes: happy, sad, surprised, A/I/U/E/O)
    → Animation (Blender NLA / Mixamo clips adapted)
    → Export GLB (Draco compression)
    → R3F Integration
```

**Timeline**: 2–4 weeks for experienced character artist  
**Cost**: \$500–\$2,000 (freelance) or internal resource  
**Quality**: Highest fidelity, matches reference exactly

#### Option B — AI-Assisted Pipeline

```
Reference Images (5 provided)
    → Autodesk Flow Studio / Sorceress 3D Studio (text/image → 3D)
    → Manual cleanup in Blender (retopology, UV, materials)
    → Mixamo auto-rig + animation
    → Blendshape manual sculpting in Blender
    → Export GLB
    → R3F Integration
```

**Timeline**: 1–2 weeks  
**Cost**: Tool subscription costs  
**Quality**: Good but may need manual refinement for production polish

#### Option C — VRoid Studio + VRM (Fastest Prototype)

```
VRoid Studio character creation
    → Export VRM
    → Custom material editing in Blender → re-export VRM
    → Drop into public/models/sensei.vrm
    → Existing VRM loader activates automatically
```

**Timeline**: 1–3 days  
**Cost**: Free (VRoid Studio is free)  
**Quality**: Moderate — VRoid characters have a distinctive "VRoid look" that may not match the semi-realistic reference style exactly. Best for rapid prototyping.

#### Option D — Hybrid 2D Fallback (Risk Mitigation)

```
Commission high-quality 2D character art (matching references)
    → Multiple poses/expressions as PNG sprites with alpha
    → CSS/Framer Motion animation (idle bob, expression swap, scale)
    → Overlaid on gradient/particle background in HTML
    → No Three.js canvas needed for character (keep for particles only)
```

**Timeline**: 3–5 days  
**Cost**: \$200–\$500 (2D artist commission)  
**Quality**: Can look excellent (many gacha games use this approach), but loses 3D interactivity

### 3.3 Recommended Approach: Option B → Option A

1. **Start with Option B** for rapid prototyping (1 week)
2. If quality is acceptable, ship with refinements
3. If not, **commission Option A** for production asset while using Option B as development placeholder
4. **Option C** (VRoid) as immediate dev-test fallback

---

## 4. UI Reconstruction Design

### 4.1 Current UI Architecture

```
┌─────────────────────────────────────┐
│ Layout.jsx                          │
│   └── <SenseiCompanion />           │ ← Fixed bottom-right, z-100
│        ├── Floating Button (64×64)  │ ← Mini 3D canvas inside circle
│        ├── Chat Window (420×580)    │ ← Expandable dialog
│        │   ├── Header + Controls    │
│        │   ├── 3D Viewport (h-36/56)│ ← R3F Canvas
│        │   ├── Message History      │
│        │   ├── Quick Actions        │
│        │   └── Input + Send         │
│        └── Guidance Popup           │ ← Target-pointing mode
└─────────────────────────────────────┘
```

### 4.2 Proposed UI Reconstruction

The UI should evolve from "chat widget with 3D viewport" to "interactive Sensei companion with integrated learning".

```
┌──────────────────────────────────────────────┐
│ MINIMIZED STATE (Floating Companion)         │
│                                              │
│   ┌──────────────────────┐                   │
│   │  2D/3D Hana-sensei   │ ← Character art   │
│   │  avatar in circle    │   or mini 3D      │
│   │  with sakura glow    │   viewport        │
│   │  ring + idle bounce  │                   │
│   └──────────────────────┘                   │
│   Speech bubble on hover: "Need help? 🌸"    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ EXPANDED STATE (Full Companion Panel)        │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ╔══════════════════════════════════╗   │  │
│  │ ║  Hana-sensei Character Area     ║   │  │
│  │ ║                                  ║   │  │
│  │ ║  3D/2D character with:          ║   │  │
│  │ ║  - Sakura gradient background   ║   │  │
│  │ ║  - Falling petal particles      ║   │  │
│  │ ║  - Current emotion expression   ║   │  │
│  │ ║  - Wand sparkle effect         ║   │  │
│  │ ╚══════════════════════════════════╝   │  │
│  │                                        │  │
│  │ ┌──────────────────────────────────┐   │  │
│  │ │ 💬 Speech Bubble Area            │   │  │
│  │ │ "Konnichiwa! Ready to study?"   │   │  │
│  │ │ [emotion indicator] [voice btn] │   │  │
│  │ └──────────────────────────────────┘   │  │
│  │                                        │  │
│  │ ┌──────────────────────────────────┐   │  │
│  │ │ Chat Messages (scrollable)      │   │  │
│  │ │ User: "Teach me て-form"        │   │  │
│  │ │ Sensei: "Let me explain!..."    │   │  │
│  │ └──────────────────────────────────┘   │  │
│  │                                        │  │
│  │ ┌──────────────────────────────────┐   │  │
│  │ │ Quick Actions (horizontal scroll)│   │  │
│  │ │ [Today's Lesson] [Review SRS]   │   │  │
│  │ │ [Practice Kanji] [Take Quiz]    │   │  │
│  │ └──────────────────────────────────┘   │  │
│  │                                        │  │
│  │ ┌──────────────────────────────────┐   │  │
│  │ │ [💬 Type a message...    ] [▶️]  │   │  │
│  │ └──────────────────────────────────┘   │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### 4.3 Key UI Changes

| Element | Current | Proposed | Rationale |
|---------|---------|----------|-----------|
| Character viewport background | `from-primary/10 via-background` (pale red) | Lavender/purple gradient matching reference images | Brand consistency with character design |
| Floating button | Mini 3D canvas in 64px circle | High-quality character avatar image or mini 3D + sakura ring animation | First impression matters — avatar must look polished |
| Chat header emoji | 🌸 emoji in circle | Miniature character portrait | Professional product feel |
| Speech bubble | Inline in chat stream | Separate "current speech" area above chat history | Sensei's current speech should feel like she's speaking, not like a chat log entry |
| Sakura particles | None | Subtle CSS/canvas particle overlay in character area | Matches reference design atmosphere |
| Quick actions | Horizontal scroll chips | Context-aware chips that change based on user's current page and learning state | More useful, less generic |

---

## 5. Movable Character Interaction Model

### 5.1 Current Implementation (KEEP)

The drag interaction model is well-implemented:
- Framer Motion `drag` with `dragMomentum={false}` and `dragElastic={0.1}`
- Position persisted in `localStorage` (`nihongo-sensei-pos`)
- Works across all routes (mounted in Layout.jsx)
- Keyboard escape handler for dismissal
- Click/double-click handlers (open chat / greeting)

### 5.2 Proposed Enhancements

| Feature | Status | Enhancement |
|---------|--------|-------------|
| Drag to move | ✅ Implemented | Add snap-to-edge behavior (left/right screen edges) |
| Resize companion panel | ❌ Missing | Add corner drag handle for panel resize |
| Minimize to tray | ✅ Implemented | Improve minimize animation (character waves goodbye) |
| Context-aware positioning | ❌ Missing | Auto-reposition when companion overlaps active content |
| Page-aware behavior | ❌ Missing | Sensei reacts to page changes (e.g., celebrates on quiz completion page) |
| Idle behavior | ⚠️ Basic (sine bob) | Add idle curiosity (looks at cursor, occasional blink, yawn after inactivity) |

---

## 6. Character State Machine

### 6.1 Current States (12 — KEEP)

`'idle' | 'talking' | 'speaking' | 'thinking' | 'happy' | 'celebrating' | 'encouraging' | 'confused' | 'error' | 'waving' | 'pointing' | 'teaching'`

### 6.2 Proposed States (14 — ADD 2)

| # | State | Trigger | Animation | Expression | Audio | New? |
|---|-------|---------|-----------|------------|-------|------|
| 1 | `idle` | Default / timeout | Breathing, subtle sway, occasional blink | Neutral smile | None | No |
| 2 | `talking` | During AI response text streaming | Head nods, hand gestures | Engaged, mouth moving | None | No |
| 3 | `speaking` | TTS audio playing | Lip-sync visemes (A/I/U/E/O), head micro-movements | Animated mouth | TTS voice | No |
| 4 | `thinking` | After user sends message, before AI responds | Head tilt, hand to chin, wand lowered | Pensive, eyes slightly up | Soft "hmm" SFX | No |
| 5 | `happy` | AI response with positive emotion | Smile broadens, eyes sparkle, slight bounce | Wide smile, sparkle eyes | Happy chime SFX | No |
| 6 | `celebrating` | Quiz passed, milestone, achievement | Both arms up, jump, wand sparkles burst | Excited, mouth open smile | Confetti SFX | No |
| 7 | `encouraging` | User made error, needs motivation | Gentle nod, hand forward, warm expression | Warm smile, soft eyes | Gentle tone | No |
| 8 | `confused` | Cannot understand user input | Head tilt opposite, question mark particle | Surprised eyes, slight frown | "Hmm?" SFX | No |
| 9 | `error` | API failure, network error | Slight slouch, worried expression | Sad/worried | Error tone | No |
| 10 | `waving` | Chat opened, greeting, first login | Right hand wave, bright smile | Happy, welcoming | "Konnichiwa!" voice | No |
| 11 | `pointing` | Guiding user to UI element | Wand extended toward target, body turns | Focused, determined | — | No |
| 12 | `teaching` | Explaining grammar/vocabulary/kanji | Wand raised, demonstrative gesture, blackboard mode | Professional, engaged | — | No |
| 13 | `**listening**` | User is typing or recording voice | Attentive lean forward, head slightly cocked | Open, receptive, slight smile | — | **NEW** |
| 14 | `**sleeping**` | Long inactivity (>5 min) | Eyes closed, gentle breathing, head droops | Peaceful, closed eyes | Soft snore SFX (optional) | **NEW** |

### 6.3 State Transition Rules

```
idle → {thinking, waving, pointing, teaching, listening, sleeping}
thinking → {talking, speaking, error, confused}
talking → {speaking, idle, happy, encouraging}
speaking → {idle, happy, celebrating}
happy → {idle, celebrating}
celebrating → {idle, happy}
encouraging → {idle}
confused → {idle, thinking}
error → {idle}
waving → {idle, talking}
pointing → {idle, teaching}
teaching → {idle, talking, pointing}
listening → {thinking}  // user finishes typing
sleeping → {waving}     // user interacts, Sensei wakes up
```

---

## 7. Voice + Lip Sync Audit

### 7.1 Current TTS System (KEEP)

| Component | Status | Notes |
|-----------|--------|-------|
| `audioService.js` | ✅ Working | Web Speech API, Japanese voice priority selection, rate/pitch control |
| Japanese voice selection | ✅ Working | Priority: Female ja-JP local → Kyoko → Otoya → any ja-JP |
| Lip-sync controller | ✅ Working (VRM only) | `SenseiLipSyncController` drives A/I/U/E/O visemes procedurally |
| Speech state sync | ✅ Working | Store syncs `onStart`/`onEnd`/`onError` callbacks with animation state |

### 7.2 Proposed Enhancements

| Enhancement | Priority | Notes |
|-------------|----------|-------|
| **Audio-reactive lip-sync** | HIGH | Use Web Audio API `AnalyserNode` to drive viseme weights from actual audio amplitude/frequency instead of procedural sine wave |
| **Custom voice** | LOW | Future: Integrate ElevenLabs or Azure Neural TTS for a custom Hana-sensei voice instead of browser default |
| **Sound effects library** | MEDIUM | Add ambient SFX: sakura chime on open, sparkle on celebration, gentle tone on thinking |
| **GLB blendshape adapter** | HIGH | Current lip-sync controller targets VRM expression names (`aa`, `ih`, `ou`, `ee`, `oh`). For GLB, need adapter to map to custom blendshape names |

---

## 8. Visual Design System

### 8.1 Sensei Color Palette (derived from reference images)

| Token | Value | Usage |
|-------|-------|-------|
| `--sensei-kimono` | `#9b6cc4` | Primary kimono purple |
| `--sensei-kimono-light` | `#c9a0e8` | Kimono highlights, lighter areas |
| `--sensei-kimono-dark` | `#6b3fa0` | Kimono shadows, deep folds |
| `--sensei-obi` | `#2d1b4e` | Dark navy obi belt |
| `--sensei-gold` | `#d4a843` | Golden accents (wand, obijime, tassel) |
| `--sensei-sakura` | `#f8c8d4` | Cherry blossom petals |
| `--sensei-sakura-dark` | `#e8a0b4` | Sakura accent darker |
| `--sensei-skin` | `#fce4d6` | Natural warm skin tone |
| `--sensei-hair` | `#3d2215` | Dark brown hair |
| `--sensei-cap` | `#1a1040` | Dark navy mortarboard |
| `--sensei-bg-start` | `#e8d4f0` | Background gradient start (light lavender) |
| `--sensei-bg-end` | `#b89cd8` | Background gradient end (deeper lavender) |
| `--sensei-glow` | `rgba(212, 168, 67, 0.4)` | Wand golden glow |

### 8.2 Typography in Sensei UI

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Sensei name ("Hana-sensei") | Inter | 600 (semibold) | 14px |
| Status text | Inter | 400 | 11px |
| Chat messages (English) | Inter | 400 | 14px |
| Chat messages (Japanese) | Noto Sans JP | 400 | 14px |
| Quick action chips | Inter | 500 | 12px |
| Input placeholder | Inter | 400 | 14px |

### 8.3 Sakura Particle System Specification

| Property | Value |
|----------|-------|
| Particle count | 15–30 (in character viewport) |
| Particle shape | 5-petal sakura flower (2D sprite with alpha) |
| Fall speed | 20–40px/sec (randomized per particle) |
| Rotation | Slow tumble (0.5–1.5 rad/sec) |
| Opacity | 0.3–0.7 (randomized) |
| Color | `#f8c8d4` to `#ffffff` gradient |
| Respawn | Loop from top when reaching bottom |
| Performance | CSS `will-change: transform` or GPU instanced Three.js |

---

## 9. Product Experience Flow

### 9.1 First Login → Onboarding Tour

```
User logs in for first time
    → Sensei appears with entrance animation (sakura petals burst)
    → "Konnichiwa! I'm Hana-sensei, your AI Japanese teacher! 🌸"
    → Start Tour button
    → Step 1: Dashboard overview (Sensei points to stats)
    → Step 2: Lessons section (Sensei points to sidebar)
    → Step 3: Grammar study (Sensei demonstrates)
    → Step 4: Kanji practice (Sensei shows stroke order area)
    → Step 5: Vocabulary (Sensei introduces SRS)
    → Step 6: Quiz / Review (Sensei explains spaced repetition)
    → Step 7: Drama / Listening (Sensei recommends content)
    → Step 8: Settings (Sensei shows language/voice settings)
    → Tour Complete: "Ganbatte! Let's start your journey! 🎌"
    → Sensei minimizes to floating companion
```

### 9.2 Daily Returning User

```
User opens app
    → Sensei greets with time-appropriate Japanese greeting
    → Proactive recommendations based on:
        - Unfinished lessons
        - SRS cards due for review
        - Streak maintenance
        - New content at user's level
    → Quick action chips update based on context
    → Sensei idles until user interacts
```

### 9.3 Context-Aware Page Reactions

| User navigates to | Sensei reaction |
|-------------------|-----------------|
| `/dashboard` | Time-appropriate greeting + daily summary |
| `/lessons` | "Let's continue where you left off!" + highlight next lesson |
| `/quiz` | "Ganbatte! You've got this!" + encouraging pose |
| `/quiz/:id` (completion) | Celebrate if passed, encourage if failed |
| `/review` | "Your SRS cards are waiting!" + point to review area |
| `/kanji` | Teaching mode + "Let me help you with these kanji!" |
| `/grammar` | Teaching mode + explain grammar on request |
| `/drama` | "Let's practice listening!" + recommend by level |
| `/settings` | Idle / minimal — don't distract in settings |

---

## 10. Current Code Audit — File-by-File Disposition

### 10.1 Frontend Sensei Files

| File | Size | Disposition | Rationale |
|------|------|-------------|-----------|
| [`SenseiCompanion.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/SenseiCompanion.tsx) | 18.3KB | **REFACTOR** | UI structure is solid. Refactor: replace mini 3D button with avatar image, add sakura gradient background, add speech bubble area, improve quick action context-awareness. |
| [`SenseiCharacter.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/SenseiCharacter.tsx) | 4.7KB | **REFACTOR** | VRM loader pipeline is clean. Refactor: add GLB loader path alongside VRM, add sakura petal particle system, improve lighting setup, add background gradient plane. |
| [`PlaceholderSensei.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/PlaceholderSensei.tsx) | 12.3KB | **KEEP (dev only)** | Retain as development fallback. Will be bypassed once GLB/VRM asset exists. Remove "VRM Drop-in Ready" badge for production. |
| [`useSenseiTarget.ts`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/useSenseiTarget.ts) | 1.7KB | **KEEP** | Clean utility hook. No changes needed. |
| [`SenseiAnimationController.ts`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/controllers/SenseiAnimationController.ts) | 5.0KB | **REFACTOR** | Add `listening` and `sleeping` states, add GLB `AnimationMixer` integration for clip-based animations, keep VRM arm poses as fallback. |
| [`SenseiExpressionController.ts`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/controllers/SenseiExpressionController.ts) | 2.5KB | **REFACTOR** | Add GLB blendshape name mapping adapter. Current VRM blendshape targeting is correct. |
| [`SenseiLipSyncController.ts`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/controllers/SenseiLipSyncController.ts) | 2.3KB | **REFACTOR** | Add Web Audio API amplitude-reactive mode. Current procedural mode is functional fallback. |
| [`SenseiMovementController.ts`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/controllers/SenseiMovementController.ts) | 3.0KB | **REFACTOR** | Add AnimationMixer clip playback for pre-baked animations. Keep procedural breathing as fallback. |

### 10.2 Frontend Store & API

| File | Size | Disposition | Rationale |
|------|------|-------------|-----------|
| [`senseiStore.ts`](file:///e:/Nihongo-testing/nihongo-master/src/store/senseiStore.ts) | 9.4KB | **REFACTOR** | Add `listening` and `sleeping` states, add page-context-awareness, add proactive recommendation triggers. Core architecture is solid. |
| [`sensei.ts`](file:///e:/Nihongo-testing/nihongo-master/src/api/sensei.ts) | 405B | **KEEP** | Clean API client. May need new endpoints for proactive recommendations. |
| [`audioService.js`](file:///e:/Nihongo-testing/nihongo-master/src/services/audioService.js) | 5.1KB | **REFACTOR** | Add Web Audio API `AnalyserNode` for audio-reactive lip-sync data extraction. Keep existing TTS pipeline. |

### 10.3 Backend Sensei Files

| File | Size | Disposition | Rationale |
|------|------|-------------|-----------|
| [`senseiService.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/senseiService.ts) | 5.4KB | **REFACTOR** | Add emotion extraction from LLM response (currently hardcodes `'neutral'`), add proactive recommendation endpoint, add context-aware greeting endpoint. |
| [`senseiGuardrails.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/sensei/senseiGuardrails.ts) | 2.2KB | **KEEP** | Working correctly. 30/30 test cases passing. |
| [`senseiKnowledge.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/sensei/senseiKnowledge.ts) | 3.2KB | **KEEP** | Working correctly. 1,284 items loaded. |
| [`senseiContext.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/sensei/senseiContext.ts) | 1.2KB | **REFACTOR** | Add SRS due count, current page context, last login time for proactive features. |
| [`senseiPrompts.ts`](file:///e:/Nihongo-testing/nihongo-master/backend/src/services/sensei/senseiPrompts.ts) | 2.2KB | **REFACTOR** | Add emotion/gesture instruction in system prompt so LLM returns structured `{emotion, gesture}` alongside text response. |

### 10.4 Other Related Files

| File | Disposition | Rationale |
|------|-------------|-----------|
| [`Layout.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/layout/Layout.jsx) | **KEEP** | `<SenseiCompanion />` integration is correct. |
| [`index.css`](file:///e:/Nihongo-testing/nihongo-master/src/index.css) (sensei section) | **REFACTOR** | Add sensei color tokens, sakura particle CSS, improved glow animation. |
| `backend/src/routes/sensei.ts` | **REFACTOR** | Add proactive recommendation endpoint, context-aware greeting endpoint. |
| `backend/src/db/schema.ts` | **KEEP** | `senseiConversations` and `senseiTourProgress` tables are correct. |

### 10.5 Files to CREATE

| File | Purpose |
|------|---------|
| `src/components/sensei/SenseiGLBLoader.tsx` | GLB model loader with AnimationMixer, blendshape driver |
| `src/components/sensei/SakuraParticles.tsx` | Sakura petal particle system (R3F instanced mesh or CSS) |
| `src/components/sensei/SenseiBackground.tsx` | Lavender gradient background plane for character viewport |
| `src/components/sensei/SenseiSpeechBubble.tsx` | Dedicated speech bubble component with emotion indicator |
| `src/components/sensei/SenseiAvatar.tsx` | 2D avatar image for minimized floating button |
| `src/hooks/useSenseiPageContext.ts` | Hook to detect current page and trigger context-aware behaviors |
| `public/models/hana-sensei.glb` | The actual 3D character model (external asset) |
| `public/images/sensei-avatar.png` | 2D avatar for floating button and chat header |
| `public/sfx/sensei-open.mp3` | UI sound: companion opens |
| `public/sfx/sensei-sparkle.mp3` | UI sound: celebration sparkle |

### 10.6 Files to DELETE

| File | Reason |
|------|--------|
| None | No files should be deleted. PlaceholderSensei stays as dev fallback. |

---

## 11. Test Strategy

### 11.1 Existing Tests (KEEP & EXTEND)

| Test Suite | Count | Status | Notes |
|------------|-------|--------|-------|
| Vitest unit tests (controllers + store) | 35 | ✅ PASSING | Extend with `listening`/`sleeping` state tests |
| Playwright browser tests | 18 | ✅ PASSING | Extend with GLB loading test, particle rendering, speech bubble |
| Backend evaluation (guardrails + RAG) | 30 | ✅ PASSING | Extend with emotion extraction tests |

### 11.2 New Tests Required

| Test Category | Tests | Priority |
|---------------|-------|----------|
| GLB loader (loads model, activates AnimationMixer) | 3 | HIGH |
| GLB blendshape adapter (maps expressions correctly) | 4 | HIGH |
| Sakura particle system (renders, respawns, performs) | 2 | MEDIUM |
| Page context hook (detects route changes, triggers reactions) | 5 | MEDIUM |
| Emotion extraction from LLM response | 4 | HIGH |
| Proactive recommendation endpoint | 3 | MEDIUM |
| Audio-reactive lip-sync (AnalyserNode integration) | 2 | LOW |
| Full E2E: Login → Greeting → Tour → Daily Use | 1 | HIGH |

---

## 12. Performance Budgets

| Metric | Budget | Current | Notes |
|--------|--------|---------|-------|
| **GLB model file size** | < 5 MB (Draco compressed) | N/A (no model) | Target: 2–3 MB with Draco, 8–12 MB raw |
| **Initial load impact (LCP)** | < 200ms additional | ~150ms (R3F canvas init) | Lazy-load model after first paint |
| **Companion idle GPU** | < 5% GPU utilization | ~3% (placeholder) | Monitor with complex GLB |
| **Particle system FPS** | Maintain 60 FPS | N/A | Use instanced rendering, limit to 30 particles |
| **Memory (3D scene)** | < 50 MB VRAM | ~15 MB (placeholder) | Texture budgets enforce this |
| **Bundle size (JS)** | < 20 KB additional | 0 (no new deps planned) | R3F/Drei/Three already bundled |
| **TTS latency** | < 100ms to first audio | ~50–200ms (varies by OS) | Acceptable |
| **Chat API latency** | < 3 seconds (Groq) | ~1–2 seconds | Acceptable |

### Performance Optimization Strategies

1. **Lazy load GLB**: Use `React.lazy()` for `SenseiGLBLoader`, load after first page render
2. **LOD switching**: Render lower-detail model in minimized floating button, full detail in expanded panel
3. **Texture compression**: Use KTX2/Basis compressed textures for GPU-efficient loading
4. **Animation blending**: Use `AnimationMixer.crossFadeTo()` for smooth state transitions
5. **Particle pooling**: Pre-allocate sakura petal instances, reuse with position reset

---

## 13. Phased Implementation Plan

### Phase 1 — Asset Preparation (External)
**Duration**: 1–2 weeks (parallel with Phases 2–3)  
**Files**: `public/models/hana-sensei.glb`, `public/images/sensei-avatar.png`  
**Dependencies**: None  
**Tasks**:
- [ ] Create/commission 3D model matching reference images
- [ ] Rig with standard humanoid skeleton
- [ ] Create 5+ blendshapes (happy, sad, surprised, A, I, U, E, O)
- [ ] Create 6 animation clips (idle, wave, point, celebrate, think, talk)
- [ ] Export optimized GLB with Draco compression
- [ ] Create 2D avatar PNG (512×512) for floating button
- [ ] Validate in R3F test scene

**Risks**: 3D asset quality may not match reference; timeline depends on artist availability  
**Acceptance**: Model renders in R3F canvas matching ≥20/25 visual gap analysis points

---

### Phase 2 — GLB Loader & Adapter
**Duration**: 2–3 days  
**Files**: `SenseiGLBLoader.tsx`, `SenseiCharacter.tsx` (refactor)  
**Dependencies**: Phase 1 (can use placeholder GLB for development)  
**Tasks**:
- [ ] Create `SenseiGLBLoader` component with `useGLTF` + `AnimationMixer`
- [ ] Build blendshape name mapping adapter for GLB ↔ controller interface
- [ ] Refactor `SenseiCharacter.tsx` to try GLB → VRM → Placeholder fallback chain
- [ ] Add animation clip loading and crossfade transitions
- [ ] Add `listening` and `sleeping` states to animation controller

**Risks**: Blendshape naming conflicts between different 3D tools  
**Acceptance**: GLB model renders with correct idle animation and state transitions

---

### Phase 3 — Visual Environment
**Duration**: 2–3 days  
**Files**: `SenseiBackground.tsx`, `SakuraParticles.tsx`, `SenseiCharacter.tsx` (lighting), `index.css`  
**Dependencies**: None (can work with placeholder)  
**Tasks**:
- [ ] Create lavender gradient background plane/shader
- [ ] Implement sakura petal particle system (instanced mesh or sprite)
- [ ] Improve lighting setup (rim light, soft shadows, warm fill)
- [ ] Add sensei color tokens to CSS design system
- [ ] Add post-processing bloom for wand glow

**Risks**: Particle system performance on mobile  
**Acceptance**: Character viewport matches reference atmosphere; 60 FPS on mid-range mobile

---

### Phase 4 — UI Reconstruction
**Duration**: 3–4 days  
**Files**: `SenseiCompanion.tsx` (refactor), `SenseiSpeechBubble.tsx`, `SenseiAvatar.tsx`  
**Dependencies**: Phase 3  
**Tasks**:
- [ ] Replace floating button mini-3D with avatar image (or optimized mini viewport)
- [ ] Add separate speech bubble component above chat
- [ ] Improve character viewport background to lavender gradient
- [ ] Add sakura ring glow animation to floating button
- [ ] Add context-aware quick action chips
- [ ] Mobile responsive improvements
- [ ] Add UI sound effects (open, close, sparkle)

**Risks**: Mobile viewport sizing  
**Acceptance**: Companion feels like a polished product feature, not a widget

---

### Phase 5 — Emotion Engine
**Duration**: 2–3 days  
**Files**: `senseiService.ts` (refactor), `senseiPrompts.ts` (refactor), `senseiStore.ts` (refactor)  
**Dependencies**: None  
**Tasks**:
- [ ] Modify system prompt to instruct LLM to return `{emotion, gesture}` in structured format
- [ ] Parse emotion/gesture from LLM response in `senseiService.ts`
- [ ] Map emotions to animation states in `senseiStore.ts`
- [ ] Add proactive recommendation endpoint
- [ ] Add context-aware greeting endpoint

**Risks**: LLM may not reliably return structured emotion data  
**Acceptance**: Sensei's expression matches the content of her response in ≥80% of interactions

---

### Phase 6 — Audio-Reactive Lip Sync
**Duration**: 1–2 days  
**Files**: `SenseiLipSyncController.ts` (refactor), `audioService.js` (refactor)  
**Dependencies**: Phase 2  
**Tasks**:
- [ ] Add Web Audio API `AnalyserNode` to `audioService.js`
- [ ] Extract amplitude data during TTS playback
- [ ] Feed amplitude to lip-sync controller for reactive viseme weights
- [ ] Add GLB blendshape name adapter to lip-sync controller

**Risks**: Browser Audio API restrictions (autoplay policies)  
**Acceptance**: Mouth animation visually correlates with spoken audio

---

### Phase 7 — Page Context Awareness
**Duration**: 2 days  
**Files**: `useSenseiPageContext.ts`, `senseiStore.ts` (refactor), `senseiContext.ts` (refactor)  
**Dependencies**: Phase 5  
**Tasks**:
- [ ] Create page context detection hook
- [ ] Add page-change reaction triggers to store
- [ ] Add SRS due count to user context for proactive reminders
- [ ] Implement context-aware greetings per page
- [ ] Add idle → sleeping transition after 5 min inactivity

**Risks**: Excessive Sensei interruptions annoying users  
**Acceptance**: Sensei reacts appropriately to page changes without being intrusive

---

### Phase 8 — Guided Tour System
**Duration**: 3–4 days  
**Files**: `SenseiTour.tsx` (new), `senseiStore.ts` (tour actions), API endpoints  
**Dependencies**: Phases 4, 5, 7  
**Tasks**:
- [ ] Build multi-step tour UI component with step indicators
- [ ] Implement 8-step onboarding sequence
- [ ] Connect to existing `senseiTourProgress` database table
- [ ] Add first-login detection and tour auto-trigger
- [ ] Add skip/resume tour functionality
- [ ] Sensei points to UI elements using existing `useSenseiTarget`

**Risks**: Tour must not break if UI layout changes  
**Acceptance**: New user can complete full tour; progress persists across sessions

---

### Phase 9 — Testing & Polish
**Duration**: 2–3 days  
**Files**: Test files, all sensei files (bug fixes)  
**Dependencies**: Phases 1–8  
**Tasks**:
- [ ] Extend unit test suite (target: 50+ tests)
- [ ] Extend Playwright E2E suite (target: 30+ tests)
- [ ] Performance profiling and optimization
- [ ] Mobile testing (iOS Safari, Android Chrome)
- [ ] Dark mode verification
- [ ] Accessibility audit (ARIA, keyboard nav, screen reader)
- [ ] Memory leak testing (long session)

**Risks**: Edge cases in animation state transitions  
**Acceptance**: All tests pass; no regressions; 60 FPS on mobile

---

### Phase 10 — Production Finalization
**Duration**: 1–2 days  
**Files**: Build config, asset optimization, documentation  
**Dependencies**: Phase 9  
**Tasks**:
- [ ] Remove dev badges from PlaceholderSensei
- [ ] Optimize GLB with Draco compression
- [ ] Compress textures to KTX2/Basis
- [ ] Update documentation
- [ ] Create production deployment checklist
- [ ] Final visual comparison against reference (25-point re-audit)

**Risks**: Asset file size exceeding CDN limits  
**Acceptance**: ≥20/25 visual gap analysis points match; production build passes all tests

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **3D asset quality doesn't match reference** | MEDIUM | HIGH | Use Option C (VRoid) for prototype, commission professional artist for final. Multiple iteration rounds budgeted. |
| **GLB file too large for web** | LOW | MEDIUM | Draco compression, LOD system, lazy loading. Budget: <5MB. |
| **Performance regression on mobile** | MEDIUM | HIGH | Performance budgets enforced. Particle count reduction on mobile. Canvas resolution scaling. |
| **LLM emotion extraction unreliable** | MEDIUM | MEDIUM | Fallback to keyword-based emotion detection. Default to `neutral` if parsing fails. |
| **Browser TTS quality varies** | HIGH | LOW | Already mitigated by existing voice priority system. Future: custom voice API. |
| **Tour breaks with UI layout changes** | LOW | MEDIUM | Tour steps use `data-sensei-target` attributes (existing), which are layout-independent. |
| **User finds Sensei annoying** | MEDIUM | HIGH | All proactive behaviors dismissable. Frequency caps on unsolicited messages. Settings to reduce/disable proactive mode. |
| **Scope creep** | HIGH | HIGH | Strict phase boundaries. Each phase has explicit acceptance criteria. No phase starts without prior phase accepted. |

---

## Appendix: Dependency Matrix

```
Phase 1 (Asset)      ────────────────────────────────┐
Phase 2 (GLB Loader) ← Phase 1                       │
Phase 3 (Environment) ← (independent)                │
Phase 4 (UI)         ← Phase 3                       │ All parallel
Phase 5 (Emotion)    ← (independent)                 │ where possible
Phase 6 (Lip Sync)   ← Phase 2                       │
Phase 7 (Page Ctx)   ← Phase 5                       │
Phase 8 (Tour)       ← Phases 4, 5, 7                │
Phase 9 (Testing)    ← Phases 1–8                    │
Phase 10 (Ship)      ← Phase 9                      ─┘
```

Critical path: **Phase 1 → Phase 2 → Phase 6** (asset blocks GLB loader blocks lip sync)

Parallel tracks:
- Track A: Phases 3, 4 (visual environment + UI) — can proceed with placeholder
- Track B: Phases 5, 7 (emotion + context) — backend work, no asset dependency
- Track C: Phase 8 (tour) — depends on Track A + Track B completion
