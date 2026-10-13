# HANA-SENSEI — CURRENT IMPLEMENTATION GAP & FILE DISPOSITION AUDIT

**Document Version**: 1.0.0  
**Status**: ACTIVE AUDIT — CHECKPOINT H  
**Scope**: Codebase Forensic Audit, Asset Reality Check, Controller Assumptions, File-by-File Disposition

---

## 1. Executive Asset Reality Check

| Category | Asset Item | Disk Path | Status on Disk | Reality Assessment |
|---|---|---|---|---|
| **3D Production Mesh** | Hana-sensei Rigged GLB | `public/models/hana-sensei.glb` | ❌ **NONEXISTENT** (Directory `public/models/` is empty / missing) | **HARD ASSET BLOCKER**. The primary 3D character does not exist. |
| **VRM Legacy Mesh** | Sensei VRM Avatar | `public/models/sensei.vrm` | ❌ **NONEXISTENT** | VRM pipeline is deprecated and file never existed on disk. |
| **Source 3D File** | Blender Master File | `_source/hana-master.blend` | ❌ **NONEXISTENT** | No DCC source files exist in the repository. |
| **Audio SFX Assets** | UI & Magic Sound Effects | `public/sfx/*.mp3` | ❌ **NONEXISTENT** | Sound effects (`sensei-open.mp3`, `sensei-sparkle.mp3`) are referenced in specs but missing on disk. |
| **2D Fallback Asset** | Generated Anime Fallback | `public/images/sensei-avatar-fallback.jpg` | ✅ **EXISTS** (747,811 bytes) | Single 2D static portrait image. Used by `ErrorBoundary` in `SenseiCharacter.tsx`. **NOT A 3D ASSET**. |
| **Procedural 3D Fallback**| Three.js Math/Primitive Character | `src/components/sensei/PlaceholderSensei.tsx` | ⚠️ **EXISTS BUT DORMANT** (309 lines) | Primitive cones/spheres animated with `Math.sin()`. Dormant in current code. **REJECTED AS PRODUCTION ASSET**. |

---

## 2. Hardcoded Controller Assumptions on Nonexistent Assets

The current software layer compiles and runs, but operates entirely on mathematical and naming assumptions about an asset that has not yet been delivered:

### A. Animation State & Clip Name Assumptions (`SenseiAnimationController.ts`, `SenseiGLBLoader.tsx`)
`SenseiGLBLoader.tsx` queries `@react-three/drei`'s `actions[state]` or `actions['idle']`. It assumes the incoming GLB contains embedded `AnimationClip` tracks named:
1. `idle`
2. `greeting` (aliased from `waving`)
3. `talking` (aliased from `speaking`)
4. `thinking`
5. `teaching`
6. `pointing`
7. `encouraging`
8. `celebrating` (aliased from `happy`)
9. `confused`
10. `listening`
11. `sleeping`
12. `error`

*Gap*: If an external artist delivers a model with different animation clip names (e.g. `Idle_01`, `Armature|Talk`, `mixamo.com`), all animations silently fail to play and default to T-pose/rest pose.

### B. Facial Morph Target / Blendshape Assumptions (`SenseiExpressionController.ts`)
`SenseiExpressionController.ts` traverses the Three.js scene graph for meshes where `mesh.morphTargetDictionary` exists, and updates influences for **15 specific blendshape strings**:
* **Facial Emotion Morphs (8)**: `eyes_happy_arch`, `eyes_wide`, `brow_angry`, `brow_sad`, `brow_surprised`, `mouth_smile`, `mouth_sad`, `mouth_open_wide`
* **Blinking Morphs (2)**: `blink_L`, `blink_R`
* **Viseme Morphs (5)**: `vowel_A`, `vowel_I`, `vowel_U`, `vowel_E`, `vowel_O`

*Gap*: Standard ARKit blendshapes use names like `eyeBlinkLeft`, `jawOpen`, `browInnerUp`. Standard VRM blendshapes use `blink_l`, `aa`, `ih`, `ou`, `ee`, `oh`, `happy`, `sad`. If an external model arrives using standard ARKit or VRM names, the current controller influences will find 0 matching dictionary keys and all facial expressions / blinks will remain static.

### C. Lip-Sync Implementation Gap (`SenseiLipSyncController.ts`, `audioService.js`)
* **Current Implementation**: A procedural sine-wave oscillator simulating Japanese mora timing ("flap-sync") alternating between `vowel_A`, `vowel_I`, `vowel_O`, `vowel_E`.
* **Gap**: This is not real lip-sync. It does not extract phonemes from text or audio. When the voice engine pauses on punctuation or consonants, the mouth continues flapping rhythmically.

### D. Procedural Bone Manipulation Dependency (`SenseiMovementController.ts`)
* `SenseiMovementController.ts` explicitly imports `@pixiv/three-vrm` and queries `vrm.humanoid.getNormalizedBoneNode('head')`, `spine`, and `chest` to apply breathing sways.
* *Gap*: In the GLB-first architecture, VRM humanoid wrappers do not exist. This controller is completely dormant and cannot operate on standard Three.js `THREE.SkinnedMesh` without a bone dictionary resolver.

---

## 3. File-by-File Technical & Product Disposition

Every file related to AI Sensei in the repository has been evaluated under strict production quality gates:

| File Path | Lines | Classification | Rationale & Required Action |
|---|---|---|---|
| `src/components/sensei/SenseiCompanion.tsx` | 419 | **KEEP & REFACTOR** | **Keep** global positioning, drag controls, and state orchestration. **Refactor** UI styling to replace generic SaaS borders with Japanese anime-themed glassmorphic styling, refine character-to-dialog visual balance, and wire audio cues. |
| `src/components/sensei/SenseiCharacter.tsx` | 108 | **KEEP** | Standard R3F `<Canvas>` wrapper with stage lights, environment, `<ErrorBoundary>`, and fallback handling. Must be preserved as the 3D viewport harness. |
| `src/components/sensei/SenseiGLBLoader.tsx` | 79 | **KEEP & REFACTOR** | **Keep** `useGLTF` and `useAnimations` pipeline. **Refactor** to introduce an asset naming normalization layer that maps incoming clip/morph names from various standards (ARKit, VRM, custom) to our internal schema. |
| `src/components/sensei/SenseiSpeechBubble.tsx` | 41 | **KEEP** | Clean, lightweight glassmorphic card for proactive page guidance. Responsive and accessible. |
| `src/components/sensei/SenseiGuidedTour.tsx` | 109 | **KEEP & REFACTOR** | **Keep** step navigation flow. **Refactor** to ensure automated page routing occurs during step transitions. |
| `src/components/sensei/SenseiBackground.tsx` | 44 | **KEEP** | Custom GLSL gradient shader (soft lavender to deep purple). Self-contained, lightweight, zero asset dependencies. |
| `src/components/sensei/SakuraParticles.tsx` | 70 | **KEEP** | Instanced Three.js cherry blossom particle mesh. Efficient and visually harmonious. |
| `src/components/sensei/PlaceholderSensei.tsx` | 309 | **DELETE** | Legacy procedural geometry character (capsule, cones, math sine waves). **Must be permanently removed** once the 3D asset arrives to prevent accidental regressions to placeholder visuals. |
| `src/components/sensei/controllers/SenseiAnimationController.ts` | 36 | **KEEP & REFACTOR** | **Keep** state machine enum and aliasing logic. **Refactor** to provide cross-fade durations and transition weights per animation state. |
| `src/components/sensei/controllers/SenseiExpressionController.ts` | 123 | **REFACTOR** | **Refactor** to include a multi-standard compatibility layer (ARKit, VRM 0.x, VRM 1.0, Custom) so morph targets are found regardless of naming conventions used by the 3D artist. |
| `src/components/sensei/controllers/SenseiLipSyncController.ts` | 61 | **REFACTOR** | **Refactor** to establish a formal multi-tiered architecture: Tier 1 (Phoneme/Viseme timing), Tier 2 (Audio buffer approximation), Tier 3 (Procedural mora flap-sync fallback). |
| `src/components/sensei/controllers/SenseiMovementController.ts` | 89 | **REPLACE** | **Replace** VRM-specific bone node lookups with a standard Three.js `THREE.Bone` search utility (`findBone(scene, ['head', 'Head', 'mixamorig:Head'])`) to support procedural idle breathing on any standard humanoid GLB. |
| `src/components/sensei/useSenseiTarget.ts` | 63 | **KEEP** | Clean DOM target coordinate tracker with highlight box calculations. |
| `src/hooks/useSenseiPageContext.ts` | 38 | **KEEP** | Route listener triggering contextual recommendations. |
| `src/store/senseiStore.ts` | 319 | **KEEP** | Central Zustand store managing conversation state, emotion, tour, and TTS speech. Complete and fully functional. |
| `backend/src/services/senseiService.ts` | 190 | **KEEP** | Complete backend orchestrator with Drizzle ORM, Guardrails, RAG, and Groq JSON structured output. |
| `backend/src/services/sensei/senseiPrompts.ts` | 45 | **KEEP** | System prompt enforcing JSON schema `{ message, emotion }`. |
| `backend/src/services/sensei/senseiKnowledge.ts` | 128 | **KEEP** | Deterministic RAG search over 1,284 curriculum items. 30/30 test verified. |
| `backend/src/services/sensei/senseiGuardrails.ts` | 95 | **KEEP** | Domain classification and prompt injection defense. |
| `backend/src/services/sensei/senseiContext.ts` | 74 | **KEEP** | User context aggregator from database. |

---

## 4. Engineering Foundation vs Visual Production Separation

To prevent premature claims of project completion, the status of the AI Sensei project is strictly divided into three independent gates:

```
┌────────────────────────────────────────────────────────┐
│ GATE 1: ENGINEERING FOUNDATION                         │
│ Status: ✅ PASS                                        │
│ - Backend RAG, Guardrails, JSON API, TiDB Schema       │
│ - Frontend R3F Canvas, Zustand Store, ErrorBoundary   │
│ - Routing, Proactive Tooltips, Guided Tour Flow        │
│ - TypeScript compilation & build pass clean            │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ GATE 2: 3D ASSET VALIDATION (CHECKPOINT H)             │
│ Status: ❌ BLOCKED ON EXTERNAL 3D ASSET                │
│ - Topology, Polygons, UVs, Textures, Shaders           │
│ - Rigging, Skeletal Bones, Weight Painting             │
│ - Morph Targets / Blendshapes Compatibility            │
│ - 14 Baked Animation Clips & Cross-fades               │
│ - Visual Match against Approved Reference Artwork      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ GATE 3: FINAL PRODUCTION COMPLETE                      │
│ Status: ❌ BLOCKED                                     │
│ - Real character loaded in WebGL Canvas                │
│ - Visual QA across Mobile, Tablet, Desktop             │
│ - Live Lip-sync and Expression Timing Validated        │
│ - Performance (60 FPS / <50MB VRAM) Verified           │
└────────────────────────────────────────────────────────┘
```
