# HANA-SENSEI — FINAL 3D ASSET HANDOFF SPECIFICATION

**Document Version**: 1.0.0 — CANONICAL LOCK  
**Canonical Production File**: `public/models/hana-sensei.glb`  
**Master Source File**: `_source/hana-sensei-master.blend`  
**Target Runtime**: Three.js (r160+) / React Three Fiber / `@react-three/drei`  
**Coordinate System**: Right-handed, Y-up (1 unit = 1 meter)

---

## 1. Locked Runtime Engine & Format Selection

```
┌────────────────────────────────────────────────────────────────────────┐
│                   RUNTIME FORMAT DECISION: LOCKED                      │
│                                                                        │
│   SELECTED FORMAT: Binary GLTF (.glb) with Draco Mesh Compression      │
│   REJECTED FORMAT: VRM (.vrm) / @pixiv/three-vrm Runtime               │
└────────────────────────────────────────────────────────────────────────┘
```

### Technical Justification for GLB Lock over VRM:
1. **Engine Integration**: Three.js / React Three Fiber provides native, zero-overhead `useGLTF` and `useAnimations` hooks. VRM requires heavy secondary parsing via `@pixiv/three-vrm`, adding bundle weight and runtime memory overhead.
2. **Prop & Accessory Attachment**: GLB supports rigid bone sockets and custom hierarchy parenting (`Bone_Wand_Attach`, `Bone_Cap`, `Bone_Tassel`) natively, whereas VRM humanoid constraints restrict non-standard bone attachments.
3. **Secondary Clothing Physics**: Long furisode sleeves and flowing kimono drapes can be authored with standard bone chains and baked into animation clips or processed with lightweight spring physics without proprietary SpringBone limitations.
4. **Shader Freedom**: GLB supports standard glTF PBR, custom glTF extensions, or direct material swapping in Three.js for custom cel-shading shaders without VRM MToon dependency.

---

## 2. Locked Performance & Technical Budgets

All technical limits are locked as single, strict thresholds (no ambiguous ranges):

| Performance Dimension | Canonical Limit | Hard Rejection Gate |
|---|---|---|
| **Triangle Count (Total)** | **Strict Max 24,000 Triangles** | $\gt 24,000$ tris |
| **GLB File Size (Draco)** | **Strict Max 3.2 MB** | $\gt 3.2\text{ MB}$ |
| **Draw Calls** | **Strict Max 2 Draw Calls** | $\gt 2$ draw calls |
| **Materials** | **Strict Max 2 Materials** (`M_Hana_Body`, `M_Hana_Alpha_Glow`) | $\gt 2$ materials |
| **Texture Atlas 1 (Body/Cloth)**| **2048 × 2048 RGBA** (BaseColor + Normal) | $\gt 2048 \times 2048$ |
| **Texture Atlas 2 (Glow/Alpha)**| **1024 × 1024 RGBA** (Emissive + Roughness/Metallic) | $\gt 1024 \times 1024$ |
| **Texture Compression** | **WebP / KTX2 (Basis Universal)** | Uncompressed textures |
| **GPU VRAM Allocation** | **$< 45\text{ MB}$ total** | $\gt 50\text{ MB}$ |
| **Desktop Performance** | **Solid 60 FPS** (1080p WebGL) | $\lt 60\text{ FPS}$ |
| **Mobile Performance** | **Solid 30–60 FPS** (390×844 viewport) | $\lt 30\text{ FPS}$ |

---

## 3. Locked Skeletal Rig & Bone Hierarchy

The model must be rigged to a standard humanoid armature with articulated 5-finger hands, secondary clothing/hair bone chains, and dedicated prop attachment points:

```
Root (World Origin [0, 0, 0] on ground plane)
 └── Hips (Height: 0.88m)
      ├── Spine (0.98m) ── Spine1 (1.10m) ── Spine2 (1.22m) ── Neck (1.42m) ── Head (1.50m)
      │    │                                                                     ├── LeftEye (1.54m) / RightEye (1.54m)
      │    │                                                                     ├── Jaw (1.46m)
      │    │                                                                     ├── Bone_Cap (Attached to Head top)
      │    │                                                                     │    └── Bone_Tassel_01 ── Bone_Tassel_02 ── Bone_Tassel_03
      │    │                                                                     ├── Bone_Hair_Front_L / Bone_Hair_Front_R
      │    │                                                                     └── Bone_Hair_Back_01 ── Bone_Hair_Back_02 ── Bone_Hair_Back_03
      │    ├── LeftShoulder ── LeftArm ── LeftForeArm ── LeftHand (Fingers: Thumb, Index, Middle, Ring, Pinky 1-3)
      │    │                    └── Bone_Sleeve_L_01 ── Bone_Sleeve_L_02 (Furisode drape)
      │    └── RightShoulder ── RightArm ── RightForeArm ── RightHand (Fingers: Thumb, Index, Middle, Ring, Pinky 1-3)
      │                         ├── Bone_Sleeve_R_01 ── Bone_Sleeve_R_02 (Furisode drape)
      │                         └── Bone_Wand_Attach (Right palm socket)
      │                              └── Bone_Wand_Flower (Emissive blossom spinner)
      └── LeftUpLeg ── LeftLeg ── LeftFoot ── LeftToeBase
          RightUpLeg ── RightLeg ── RightFoot ── RightToeBase
```

---

## 4. Locked Facial Rig & Multi-Standard Adapter

The facial mesh must provide morph targets covering **11 Semantic Expressions** and **5 Japanese Vowel Visemes**. The runtime adapter maps these seamlessly across naming conventions:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            FACIAL RIG COMPATIBILITY ADAPTER MATRIX                          │
├─────────────────────┬───────────────────────┬───────────────────────┬───────────────────────┤
│ Canonical Semantic  │ Custom Target Name    │ ARKit Standard Target │ VRM 0.x / 1.0 Target  │
├─────────────────────┼───────────────────────┼───────────────────────┼───────────────────────┤
│ Left Eye Blink      │ `blink_left`          │ `eyeBlinkLeft`        │ `blink_l` / `blinkLeft│
│ Right Eye Blink     │ `blink_right`         │ `eyeBlinkRight`       │ `blink_r` / `blinkRigh│
│ Eyes Wide           │ `eyes_wide`           │ `eyeWideLeft` / `Right│ `surprised`           │
│ Happy Eyes (Arch)   │ `eyes_happy`          │ `eyeSquintLeft` /`Righ│ `happy` / `relaxed`   │
│ Sad / Droop Eyes    │ `eyes_sad`            │ `eyeLookDownLeft` /`Ri│ `sad`                 │
│ Surprised Eyes      │ `eyes_surprised`      │ `eyeWideLeft` / `Right│ `surprised`           │
│ Brow Anger          │ `brow_angry`          │ `browDownLeft` /`Right│ `angry`               │
│ Brow Sadness        │ `brow_sad`            │ `browInnerUp`         │ `sad`                 │
│ Brow Surprise       │ `brow_surprised`      │ `browOuterUpLeft` /`Ri│ `surprised`           │
│ Smile Mouth         │ `mouth_smile`         │ `mouthSmileLeft` /`Rig│ `happy`               │
│ Sad / Frown Mouth   │ `mouth_sad`           │ `mouthFrownLeft` /`Rig│ `sad`                 │
│ Wide Open Mouth     │ `mouth_open_wide`     │ `jawOpen`             │ `aa`                  │
├─────────────────────┼───────────────────────┼───────────────────────┼───────────────────────┤
│ Japanese Vowel A    │ `vowel_a`             │ `jawOpen` (0.85)      │ `aa`                  │
│ Japanese Vowel I    │ `vowel_i`             │ `mouthPucker` (-0.4)  │ `ih`                  │
│ Japanese Vowel U    │ `vowel_u`             │ `mouthPucker` (0.8)   │ `ou`                  │
│ Japanese Vowel E    │ `vowel_e`             │ `mouthFunnel` (0.5)   │ `ee`                  │
│ Japanese Vowel O    │ `vowel_o`             │ `mouthFunnel` (0.9)   │ `oh`                  │
└─────────────────────┴───────────────────────┴───────────────────────┴───────────────────────┘
```

---

## 5. Locked Animation Specification (14 Canonical Tracks)

All 14 animation clips must be authoritatively authored at **30 FPS**, exported with normalized in-place root motion (`Root` bone fixed at $[0,0,0]$), and use strict lowercase identifiers:

| # | Clip Identifier | Duration | Looping | Active Bone Groups | Action & Emotional Expression |
|---|---|---|---|---|---|
| 1 | `idle` | 3.2s | **Loop** | Spine, Neck, Arms, Hair, Sleeves | Gentle natural breathing cycle (~14 bpm); subtle arm sway; soft eye micro-movements. |
| 2 | `greeting` | 2.4s | **Once** | RightArm, Head, Spine, LeftArm | Right hand raises in warm, cheerful welcome wave; slight head tilt with welcoming smile (`mouth_smile: 0.8`). |
| 3 | `waving` | 2.0s | **Loop** | RightArm, RightForeArm, Hand | Continuous looping wave with joyful rhythmic wrist movement for onboarding/callouts. |
| 4 | `talking` | 2.8s | **Loop** | Spine, LeftArm, Head, Sleeves | Conversational teaching gestures; expressive open palms; periodic affirming head nods. |
| 5 | `thinking` | 3.0s | **Loop** | Head, Neck, RightArm, LeftArm | Right index finger touches cheek/temple; head tilts 6° left; eyes glance upward thoughtfully. |
| 6 | `happy` | 2.2s | **Once** | Spine, BothArms, Head | Cheerful head bob with arms drawing slightly inward; bright joyful expression (`eyes_happy: 0.8`). |
| 7 | `encouraging` | 2.6s | **Once** | RightArm, Spine, Head | Right hand placed gently over heart; warm forward nod communicating sincere teacher support. |
| 8 | `confused` | 2.5s | **Loop** | Head, Brows, Arms | Puzzled head cock to right; open palms turn slightly upward; gentle questioning brow furrow. |
| 9 | `celebrating` | 3.2s | **Once** | BothArms, Wand, Hips, Spine | Triumphant double-arm raise with wand twirl flourish; joyful bounce; wide celebratory smile. |
| 10| `teaching` | 3.5s | **Loop** | RightArm, Wand, Head, LeftArm | Right arm extends wand toward virtual chalkboard; left hand gestures eloquently toward lesson text. |
| 11| `pointing` | 2.0s | **Loop** | RightArm, RightForeArm, Wand | Crisp, steady pointing gesture directing wand tip toward specific UI elements (`[data-sensei-target]`). |
| 12| `listening` | 2.8s | **Loop** | Head, Neck, Spine, Arms | Attentive forward-leaning posture; subtle affirmative nods showing active engagement. |
| 13| `error` | 2.4s | **Once** | Head, Spine, BothArms | Sympathetic soft head tilt or polite apologetic mini-bow; consoling gentle expression. |
| 14| `sleeping` | 4.0s | **Loop** | Neck, Head, Spine, Hair | Relaxed slow breathing cycle; head gently resting downward; eyes closed in tranquil sleep. |

---

## 6. Handoff File Structure & Delivery Package

External artists or internal pipelines must deliver the final asset package structured as follows:

```
hana-sensei-production-package/
├── hana-sensei.glb                     <-- Final Draco-compressed GLB (Target: public/models/hana-sensei.glb)
├── source/
│   ├── hana-sensei-master.blend        <-- Master Blender 4.x project (Armature + Modifiers + Morphs)
│   └── textures/
│       ├── hana_body_diffuse.png       <-- 2048x2048 Diffuse/BaseColor map
│       ├── hana_body_normal.png        <-- 2048x2048 Normal map
│       └── hana_emissive_glow.png      <-- 1024x1024 Wand bloom and alpha mask
├── preview/
│   ├── hana_turnaround.mp4             <-- 360-degree turntable video render (front, 3/4, side, back)
│   └── hana_animation_reel.mp4         <-- Verification video showcasing all 14 animation clips
└── validation_checklist.pdf            <-- Signed verification report passing all 8 acceptance gates
```
