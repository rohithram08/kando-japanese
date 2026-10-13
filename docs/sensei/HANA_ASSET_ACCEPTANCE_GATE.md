# HANA-SENSEI — ASSET ACCEPTANCE GATE & CERTIFICATION PROTOCOL

**Document Version**: 1.0.0 — CANONICAL LOCK  
**Status**: MANDATORY QUALITY CONTROL PROTOCOL (CHECKPOINT I)  
**Governing Rule**: Technical compilation $\ne$ Visual completion. An asset must pass all 8 sequential gates to achieve production certification.

---

## 1. The 8-Stage Sequential Acceptance Pipeline

```
                    ┌──────────────────────────────────────┐
                    │    SUBMITTED: public/models/         │
                    │         hana-sensei.glb              │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 1: TOPOLOGY & WIRE SIZE         │
                    │ • Total tris ≤ 24,000                │
                    │ • Draco compressed GLB ≤ 3.2 MB      │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 2: MATERIAL & DRAW CALLS        │
                    │ • Draw calls ≤ 2 (Body + Alpha/Glow) │
                    │ • Textures: 1x 2048x2048 + 1x 1024x  │
                    │ • Hex color codes strictly matched   │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 3: SKELETAL RIGGING & WEIGHTS   │
                    │ • Standard Humanoid + 5-finger hands │
                    │ • Furisode sleeve + Tassel chains    │
                    │ • Bone_Wand_Attach in RightHand palm │
                    │ • Zero skinning tears / spike bugs   │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 4: FACIAL RIG & VISEMES         │
                    │ • 11 Semantic Expressions functional │
                    │ • 5 Japanese Vowels (A, I, U, E, O)  │
                    │ • Independent left/right eye blinks  │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 5: ANIMATION INTEGRITY (14)     │
                    │ • All 14 clips baked @ 30 FPS        │
                    │ • In-place root motion ([0,0,0])     │
                    │ • Seamless 0.25s cross-fading        │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 6: VISUAL REFERENCE MATCH       │
                    │ • Turnaround comparison vs reference │
                    │ • Kimono lavender/violet gradient    │
                    │ • Mortarboard cap 5° tilt & tassel   │
                    │ • Floating sakura wand bloom         │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 7: WEBGL RUNTIME QA             │
                    │ • 60 FPS on Desktop (1080p)          │
                    │ • ≥ 30 FPS on Mobile (390×844)       │
                    │ • GPU VRAM < 45 MB                   │
                    │ • Zero WebGL context crash / errors  │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ GATE 8: PRODUCTION SIGN-OFF          │
                    │ • Signed off by Project Lead         │
                    │ • Release into production branch     │
                    └──────────────────────────────────────┘
```

---

## 2. Objective Acceptance Checklist

### Gate 1: Topology & Technical Budget
- [ ] File exists at `public/models/hana-sensei.glb`.
- [ ] Model geometry verified at $\le 24,000$ triangles total.
- [ ] File size is strictly $\le 3.2\text{ MB}$ using Draco mesh compression.
- [ ] Manifold quad-dominant topology with no unstitched vertex seams or inverted normals.

### Gate 2: Materials & Colors
- [ ] Total material count is strictly $\le 2$ (`M_Hana_Body`, `M_Hana_Alpha_Glow`).
- [ ] Total draw calls inside Three.js scene do not exceed 2.
- [ ] Texture maps: 1x $2048\times2048$ Diffuse (cloth/skin/hair) + 1x $1024\times1024$ Emissive/Roughness (wand/sakura glow).
- [ ] Colors match canonical tokens: Kimono `#9b6cc4`/`#6b3fa0`, Obi/Cap `#2d1b4e`, Gold `#d4a843`, Eyes `#8b5a2b`.

### Gate 3: Rigging & Skinning
- [ ] Armature contains standard humanoid bone hierarchy.
- [ ] Hands feature 5 fully articulated fingers with 3 phalange bones per finger.
- [ ] Furisode sleeves contain dedicated 2-bone chains (`Bone_Sleeve_L_01..02`, `Bone_Sleeve_R_01..02`) weighted for natural cloth drape.
- [ ] Mortarboard cap contains `Bone_Cap` with child 3-bone tassel chain (`Bone_Tassel_01..03`).
- [ ] Right hand contains `Bone_Wand_Attach` socket parenting the 45cm golden sakura wand.
- [ ] Poses in extreme ranges (e.g. `celebrating` arm raise, `greeting` wave) show zero mesh tearing or unweighted vertex spikes.

### Gate 4: Facial Expressions & Visemes
- [ ] Facial morph targets respond cleanly from weight $0.0 \rightarrow 1.0$:
  - Blinks: `blink_left`, `blink_right`.
  - Emotions: `eyes_happy`, `eyes_wide`, `eyes_sad`, `eyes_surprised`, `brow_angry`, `brow_sad`, `brow_surprised`, `mouth_smile`, `mouth_sad`, `mouth_open_wide`.
  - Visemes: `vowel_a`, `vowel_i`, `vowel_u`, `vowel_e`, `vowel_o`.
- [ ] Blinking occurs smoothly without clipping eye geometry or eyelashes through eyelid skin.

### Gate 5: 14 Animation Tracks
- [ ] All 14 clips baked at 30 FPS with in-place root motion:
  - `idle`, `greeting`, `waving`, `talking`, `thinking`, `happy`, `encouraging`, `confused`, `celebrating`, `teaching`, `pointing`, `listening`, `error`, `sleeping`.
- [ ] Looping clips (`idle`, `talking`, `thinking`, `waving`, `teaching`, `pointing`, `listening`, `sleeping`) loop with zero jerk or pop.
- [ ] Three.js `AnimationMixer` cross-fades smoothly over 0.25s between any arbitrary pair of animation clips.

### Gate 6: Visual Reference Match
- [ ] Side-by-side comparison against approved master artwork confirms high-fidelity match:
  - Anime facial proportions, jawline, and warm amber eye depth.
  - Dark chocolate waist-length hair silhouette with straight bangs.
  - Furisode lavender/violet kimono crossover (Left over Right).
  - Structured plum obi with 4-loop butterfly musubi bow.
  - Academic cap tilted 5° right with flowing golden tassel.
  - Golden sakura teaching wand with glowing pink blossom bloom.

### Gate 7: WebGL Performance & Runtime Stability
- [ ] Character renders smoothly inside `<SenseiCharacter />` without triggering `<ErrorBoundary>`.
- [ ] Sustained 60 FPS on standard desktop browser (Chrome, Edge, Firefox, Safari).
- [ ] Sustained $\ge 30\text{ FPS}$ on simulated mobile viewport (390×844).
- [ ] GPU VRAM footprint of the character canvas is $< 45\text{ MB}$.
- [ ] WebGL context loss recovery tests restore the character seamlessly without page reload.

### Gate 8: Final Certification
- [ ] All 7 preceding gates marked PASS.
- [ ] Signed off by Project Lead for production release.

---

## 3. Strict "No Premature Pass" Rule

Under no circumstances may any report or agent declare **"HANA-SENSEI PRODUCTION COMPLETE"** unless all 8 gates above have been verified with tangible artifacts (live WebGL screenshots, automated test logs, and performance traces).
