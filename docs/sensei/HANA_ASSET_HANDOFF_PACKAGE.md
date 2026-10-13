# HANA-SENSEI — 3D ASSET PRODUCTION & ARTIST HANDOFF PACKAGE

**Document Version**: 1.0.0  
**Target File Path**: `public/models/hana-sensei.glb`  
**Master Source File**: `_source/hana-sensei-master.blend`  
**Target Engine**: Three.js (v0.160+) / React Three Fiber / `@react-three/drei` (v9.0+)

---

## 1. Character Identity & Visual Design Specification

```
                          ┌────────────────────────────┐
                          │    HANA-SENSEI (花先生)     │
                          │   Master 3D Character Spec │
                          └─────────────┬──────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
      [FACIAL / HEAD]            [COSTUME / ATTIRE]         [PROPS & ACCENTS]
• Soft oval anime face     • Lavender Furisode Kimono • Golden Sakura Wand (45cm)
• Amber eyes (#8b5a2b)       (#9b6cc4 / #6b3fa0)      • Floating ring & flower
• Dark brown hair (#3d2215)• Plum Obi Belt (#2d1b4e)  • Sakura hairpin & beads
• Flowing waist-length lock• Golden Obijime cord      • Navy mortarboard cap
• Straight textured bangs  • Butterfly musubi bow     • Gold silk tassel
```

### Turnaround Views & Proportions:
* **Height & Scale**: Standard female anime proportion (162cm real-world scale / 1.62 Three.js units / ~6.7 heads tall).
* **Front View**: Symmetrical resting stance, kimono crossover (left over right strictly), upright academic cap tilted 5° to the right, sleeves draping 40cm below elbows.
* **3/4 View**: Visible depth in layered hair strands, defined facial plane, volumetric obi belt and musubi bow protruding gracefully at rear waist.
* **Side Profile**: Refined anime facial slope (subtle nose bridge, soft lip curvature, delicate chin), natural spinal S-curve, dynamic drape on furisode sleeves.
* **Back View**: Long brown hair cascading over shoulders down to waist with natural split around the obi bow; multi-loop butterfly musubi bow centered above hips.

---

## 2. Technical Asset Budgets & Performance Limits

| Metric | Production Limit | Hard Rejection Threshold |
|---|---|---|
| **Triangle Count (Total)** | **18,000 – 24,000 tris** | > 28,000 tris |
| **Material Count** | **2 Draw Calls** (1 Body/Clothing, 1 Alpha/Emissive) | > 3 Draw Calls |
| **Texture Maps** | **1x 2048×2048 RGBA** (BaseColor) + **1x 1024×1024** (Emissive/Roughness) | > 2048×2048 |
| **Texture Format** | PNG Source $\rightarrow$ WebP / KTX2 compressed | Uncompressed TGA/TIFF |
| **Export File Format** | **Binary GLTF (.glb)** with Draco mesh compression | Raw `.gltf` / `.obj` / `.fbx` |
| **File Size on Wire** | **≤ 3.2 MB** | > 4.5 MB |
| **Animation Frame Rate** | **30 FPS baked keyframes** (Linear / Quaternion) | Unbaked spline curves |

---

## 3. Skeletal Rig & Bone Hierarchy Specification

The skeleton must follow standard humanoid hierarchy (Mixamo / Unreal humanoid compatible) with dedicated secondary bones:

```
Root (Scene Origin [0,0,0])
 └── Hips
      ├── Spine ── Spine1 ── Spine2 ── Neck ── Head
      │                                         ├── Jaw
      │                                         ├── LeftEye / RightEye
      │                                         ├── Bone_Cap (Child of Head)
      │                                         │    └── Bone_Tassel_01 ── Bone_Tassel_02 ── Bone_Tassel_03
      │                                         ├── Bone_Hair_Front_L / Bone_Hair_Front_R
      │                                         └── Bone_Hair_Back_01 ── Bone_Hair_Back_02 ── Bone_Hair_Back_03
      ├── LeftShoulder ── LeftArm ── LeftForeArm ── LeftHand (Fingers 1-5 articulated)
      │                    └── Bone_Sleeve_L_01 ── Bone_Sleeve_L_02 (Physics drape)
      ├── RightShoulder ── RightArm ── RightForeArm ── RightHand (Fingers 1-5 articulated)
      │                     ├── Bone_Sleeve_R_01 ── Bone_Sleeve_R_02 (Physics drape)
      │                     └── Bone_Wand_Attach (Child of RightHand palm socket)
      │                          └── Bone_Wand_Flower (Emissive spinner)
      └── LeftUpLeg ── LeftLeg ── LeftFoot ── LeftToeBase
          RightUpLeg ── RightLeg ── RightFoot ── RightToeBase
```

---

## 4. Multi-Standard Facial Rigging & Blendshape Compatibility Matrix

To support versatile facial animation across custom DCC tools, ARKit tracking, and standard VRM workflows, the facial mesh must support the following canonical morph targets:

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Canonical NihonGo Name  │ ARKit Standard Alias    │ VRM 0.x / 1.0 Alias     │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ `blink_L`               │ `eyeBlinkLeft`          │ `blink_l` / `blinkLeft` │
│ `blink_R`               │ `eyeBlinkRight`         │ `blink_r` / `blinkRight`│
│ `eyes_wide`             │ `eyeWideLeft` / `Right` │ `surprised`             │
│ `eyes_happy_arch`       │ `eyeSquintLeft` /`Right`│ `happy` / `relaxed`     │
│ `brow_angry`            │ `browDownLeft` / `Right`│ `angry`                 │
│ `brow_sad`              │ `browInnerUp`           │ `sad`                   │
│ `brow_surprised`        │ `browOuterUpLeft`       │ `surprised`             │
│ `mouth_smile`           │ `mouthSmileLeft` /`Right│ `happy`                 │
│ `mouth_sad`             │ `mouthFrownLeft` /`Right│ `sad`                   │
│ `mouth_open_wide`       │ `jawOpen`               │ `aa`                    │
│ `vowel_A`               │ `jawOpen` (0.8)         │ `aa`                    │
│ `vowel_I`               │ `mouthPucker` (-0.5)    │ `ih`                    │
│ `vowel_U`               │ `mouthPucker` (0.8)     │ `ou`                    │
│ `vowel_E`               │ `mouthFunnel` (0.5)     │ `ee`                    │
│ `vowel_O`               │ `mouthFunnel` (0.9)     │ `oh`                    │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 5. Complete Animation Clip Specification (14 Tracks)

All animations must be authored at **30 FPS**, exported with normalized root transforms (`Root` bone stays at `[0,0,0]`), and loop seamlessly where designated:

| # | Clip Name | Duration | Loop | Primary Bones | Description & Gesture Nuance |
|---|---|---|---|---|---|
| 1 | `idle` | 3.2s | **Yes** | Spine, Neck, Arms, Hair | Gentle breathing sway (~14 bpm), soft arm resting posture, subtle head micro-movement. |
| 2 | `greeting` | 2.4s | No | RightArm, Head, Spine | Right hand raises in warm, cheerful wave; head tilts 4° with friendly smile. |
| 3 | `waving` | 2.0s | **Yes** | RightArm, RightHand | Continuous gentle wave cycle (used during prolonged greetings or onboarding callouts). |
| 4 | `talking` | 2.8s | **Yes** | Spine, LeftArm, Head | Conversational hand gestures, subtle chest accentuation, open teacher posture. |
| 5 | `thinking` | 3.0s | **Yes** | Head, Neck, RightArm | Left hand supports chin or right index taps cheek; eyes glance upward thoughtfully. |
| 6 | `happy` | 2.2s | No | Spine, Arms, Head | Cheerful head bob, arms draw slightly inward, warm joyful demeanor. |
| 7 | `encouraging` | 2.6s | No | RightArm, Spine | Gentle forward nod with right hand placed gently over heart in sincere encouragement. |
| 8 | `confused` | 2.5s | **Yes** | Head, Eyebrows, Arms | Slight head cock to left, hands turn palms slightly upward in gentle puzzlement. |
| 9 | `celebrating` | 3.2s | No | Arms, Spine, Hips | Joyous double arm raise with wand flourish, triumphant bounce and wide joyful expression. |
| 10| `teaching` | 3.5s | **Yes** | RightArm, Wand, Head | Right arm holds wand extended toward UI board; left hand gestures toward lesson content. |
| 11| `pointing` | 2.0s | **Yes** | RightArm, RightForeArm | Direct, crisp pointing gesture with wand tip toward screen left/target element. |
| 12| `listening` | 2.8s | **Yes** | Head, Spine, Arms | Attentive leaning forward posture with subtle periodic affirmative nodding. |
| 13| `error` | 2.4s | No | Head, Spine, Arms | Apologetic gentle bow or sympathetic head tilt with soft console expression. |
| 14| `sleeping` | 4.0s | **Yes** | Neck, Head, Spine | Deep relaxed breathing, head gently nodding downward in restful sleep state. |

---

## 6. Multi-Tier Lip-Sync Architecture

To avoid misrepresenting procedural flap-sync as true lip-sync, the runtime architecture follows a strict 3-tier hierarchy:

```
                          ┌──────────────────────────────────────┐
                          │        VOICE PLAYBACK EVENT          │
                          └──────────────────┬───────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             [TIER 1: PHONEME STREAM]                    [TIER 2: AUDIO STREAM]
          (TTS viseme events / boundary)                (Raw ArrayBuffer / WebAudio)
                       │                                           │
                       ▼                                           ▼
            Map phonemes to exact                      Fast Fourier Transform (FFT)
             Japanese Vowels (A,I,U,E,O)                Frequency bin analysis
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             │
                                             ▼ (If Tier 1 & 2 unavailable)
                                 ┌───────────────────────┐
                                 │ TIER 3: MORA FLAP-SYNC│
                                 │ (Procedural Fallback) │
                                 └───────────────────────┘
```

* **Tier 1 (Primary / Target)**: Uses TTS word/phoneme timing markers (`SpeechSynthesisUtterance.onboundary` or cloud TTS viseme timestamps) to directly drive `vowel_A`, `vowel_I`, `vowel_U`, `vowel_E`, `vowel_O` blendshapes.
* **Tier 2 (Secondary / Audio-Driven)**: When audio elements are streamed, an `AnalyserNode` performs real-time FFT amplitude analysis, scaling mouth openness proportionally with audio loudness.
* **Tier 3 (Fallback)**: When audio streams cannot be inspected directly (e.g. standard browser Web Speech API), the procedural Japanese mora cadence oscillates viseme weights during active speech, pausing during silence.

---

## 7. Character Creation Pipeline Evaluation & Selection

| Pipeline Option | Visual Quality | Dev Speed | Unit Cost | Reference Match | Verdict |
|---|---|---|---|---|---|
| **Pipeline A: VRoid Studio + Blender** | High (Anime standard) | **Fast (3–5 days)** | **Low ($0–$200)** | Very High (90%) | **RECOMMENDED FOR SOLO DEV** |
| **Pipeline B: AI 3D Mesh (Meshy/Tripo)** | Very Low (Broken mesh) | Slow (Fixing topology) | Moderate ($50/mo) | Low (40%) | **REJECTED (Triangle soup)** |
| **Pipeline C: Custom 3D Modeler (Blender)** | **Maximum (100%)** | Slow (2–4 weeks) | High ($600–$1800) | **Maximum (100%)** | **RECOMMENDED FOR STUDIO QUALITY** |
| **Pipeline D: AI Concept + Freelancer** | High (95%) | Moderate (1–2 weeks) | Moderate ($300–$600)| High (95%) | **STRONG ALTERNATIVE** |

### Selected Strategies:
1. **Best Studio Quality**: **Pipeline C** (Custom Blender modeling by experienced anime character artist using `HANA_ASSET_HANDOFF_PACKAGE.md`).
2. **Best Solo / Fast Execution**: **Pipeline A** (Base mesh sculpted in VRoid Studio for topology & ARKit morphs, exported to Blender for custom furisode sleeves, mortarboard cap, and sakura wand modeling, then exported as optimized GLB).

---

## 8. Handoff File Structure & Naming Conventions

When delivering the final asset package, the external artist / pipeline must adhere strictly to this folder layout:

```
hana-sensei-delivery-package/
├── hana-sensei.glb                     <-- Final production file (Must be copied to public/models/)
├── source/
│   ├── hana-sensei-master.blend        <-- Master Blender 4.x scene with rig & modifier stack
│   └── textures/
│       ├── hana_body_diffuse.png       <-- 2048x2048 Diffuse color map
│       ├── hana_body_normal.png        <-- 2048x2048 Normal map (optional)
│       └── hana_emissive.png           <-- 1024x1024 Wand and blossom glow map
├── preview/
│   ├── hana_turnaround_render.mp4      <-- 360-degree turntable video preview
│   └── hana_animation_reel.mp4         <-- Verification video showing all 14 animation clips
└── validation_report.txt               <-- Completed verification checklist signed by artist
```
