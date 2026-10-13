# HANA-SENSEI — ASSET VALIDATION PROTOCOL & ACCEPTANCE GATE

**Document Version**: 1.0.0  
**Status**: MANDATORY PRODUCTION GATE — CHECKPOINT H  
**Principle**: A technically valid GLB file or passing code build does NOT constitute a visual PASS.

---

## 1. The 8-Stage Sequential Acceptance Pipeline

Every 3D asset file (`hana-sensei.glb`) submitted for production integration must pass through all **8 validation stages** sequentially. A failure at any single stage results in an immediate **FAIL (REJECTED)** status, requiring revision prior to web integration.

```
                    ┌──────────────────────────────────────┐
                    │    INCOMING ASSET: hana-sensei.glb   │
                    └──────────────────┬───────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 1: TOPOLOGY & BUDGET GATE      │
                    │ • Tris ≤ 24,000 | Draco Compression  │
                    │ • Clean manifold quad-dominant mesh  │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 2: MATERIAL & TEXTURE GATE     │
                    │ • Max 2 draw calls (PBR / Cel-shade) │
                    │ • 1x 2048 Diffuse + 1x 1024 Emissive │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 3: SKELETAL RIG & WEIGHT GATE  │
                    │ • Standard Humanoid + Finger bones   │
                    │ • Sleeve & Hair secondary bone chain │
                    │ • Smooth skinning (no mesh tearing)  │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 4: FACIAL RIG & MORPH GATE     │
                    │ • 15 morph targets present & tested  │
                    │ • Left/Right eye blink isolation     │
                    │ • Vowel shapes (A, I, U, E, O)       │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 5: ANIMATION INTEGRITY GATE    │
                    │ • All 14 clips baked @ 30 FPS        │
                    │ • Origin [0,0,0] root transforms     │
                    │ • Seamless looping on idle/talking   │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 6: VISUAL REFERENCE COMPARISON │
                    │ • Turnaround match vs approved art   │
                    │ • Kimono purple / amber eyes fidelity│
                    │ • Wand & mortarboard cap silhouette  │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 7: WEBGL INTEGRATION & QA GATE │
                    │ • 60 FPS on desktop / 30+ on mobile  │
                    │ • VRAM usage < 50 MB                 │
                    │ • ErrorBoundary & Canvas recovery    │
                    └──────────────────┬───────────────────┘
                                       │ [PASS]
                                       ▼
                    ┌──────────────────────────────────────┐
                    │ STAGE 8: PRODUCTION CERTIFICATION    │
                    │ • Final sign-off by Lead Engineer    │
                    │ • Asset deployed to /public/models/  │
                    └──────────────────────────────────────┘
```

---

## 2. Detailed Verification Checklist per Stage

### Stage 1: Topology & Technical Budget Gate
- [ ] File exists at `public/models/hana-sensei.glb`.
- [ ] Total polygon count is strictly $\le 24,000$ triangles (verified via Three.js scene inspection or glTF-Transform).
- [ ] Mesh has no unstitched non-manifold geometry, duplicate coincident vertices, or inverted normal faces.
- [ ] Wire size is $\le 3.2\text{ MB}$ with Draco or meshopt compression.

### Stage 2: Material & Texture Quality Gate
- [ ] Material count is strictly $\le 2$ (1 main body opaque material + 1 transparent/emissive material).
- [ ] Textures are power-of-two (BaseColor $2048\times2048$, Emissive $1024\times1024$).
- [ ] No uncompressed heavy texture formats embedded (e.g. raw 32-bit bitmaps).
- [ ] Color values match canonical hex tokens (Kimono: `#9b6cc4`, Obi/Cap: `#2d1b4e`, Gold: `#d4a843`).

### Stage 3: Skeletal Rig & Skinning Gate
- [ ] Humanoid skeleton contains all standard body bones (`Hips`, `Spine`, `Chest`, `Neck`, `Head`, `LeftArm`, `RightArm`, `LeftLeg`, `RightLeg`).
- [ ] Hands have 5 articulated finger chains for expressive gestures.
- [ ] Sleeve bones (`Bone_Sleeve_L_01`, `Bone_Sleeve_R_01`) allow furisode fabric to drape with gravity.
- [ ] Tassel bone chain (`Bone_Tassel_01..03`) attached to mortarboard cap.
- [ ] Right hand has `Bone_Wand_Attach` child socket parenting the 45cm golden sakura wand.
- [ ] Extreme poses (e.g. `celebrating` arm raise, deep bow) exhibit zero vertex tearing or unweighted spikes.

### Stage 4: Facial Rig & Blendshape Compatibility Gate
- [ ] Target meshes contain `morphTargetDictionary` with verified keys:
  - Blinking: `blink_L`, `blink_R` (or aliased via compatibility map).
  - Emotion: `eyes_happy_arch`, `eyes_wide`, `brow_angry`, `brow_sad`, `brow_surprised`, `mouth_smile`, `mouth_sad`, `mouth_open_wide`.
  - Visemes: `vowel_A`, `vowel_I`, `vowel_U`, `vowel_E`, `vowel_O`.
- [ ] Morphing influence from $0.0 \rightarrow 1.0$ produces smooth, natural deformation without polygon intersection.

### Stage 5: Animation Integrity Gate
- [ ] Embedded GLTF animations contain all **14 canonical tracks**:
  - `idle`, `greeting`, `waving`, `talking`, `thinking`, `happy`, `encouraging`, `confused`, `celebrating`, `teaching`, `pointing`, `listening`, `error`, `sleeping`.
- [ ] No unwanted root translation on in-place animations (`idle`, `talking`, `thinking`).
- [ ] Cross-fading between arbitrary clips (e.g. `idle` $\rightarrow$ `teaching` $\rightarrow$ `celebrating`) transitions over 0.25s with zero popping.

### Stage 6: Visual Reference Comparison Gate
- [ ] Side-by-side comparison against master reference confirms high-fidelity match for:
  - Anime face contour and eye shading.
  - Waist-length dark brown hair silhouette.
  - Lavender kimono crossover, gold trim, and plum obi musubi bow.
  - Navy graduation cap tilt and flowing golden tassel.
  - Golden sakura staff with floating blossom ring.

### Stage 7: WebGL Integration & Performance QA Gate
- [ ] `SenseiGLBLoader.tsx` loads the model without throwing suspense errors or triggering `ErrorBoundary`.
- [ ] Three.js WebGL renderer achieves consistent 60 FPS on standard desktop (Chrome / Edge / Firefox).
- [ ] Achieves $\ge 30\text{ FPS}$ on simulated mobile viewport (390×844) without GPU thermal throttling.
- [ ] Total GPU VRAM footprint of character and canvas is $< 50\text{ MB}$.
- [ ] WebGL context loss and restoration tests recover the character scene cleanly.

---

## 3. Strict "No Premature Pass" Protocol

Under no circumstances may a report declare **"FINAL PRODUCT COMPLETE"** or **"HANA CHARACTER PASS"** unless **ALL 9 criteria below** have been verified and documented with photographic evidence / test logs:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                  MANDATORY FINAL SIGN-OFF REQUIREMENTS                     │
├────────────────────────────────────────────────────────────────────────────┤
│ [ ] 1. Final Hana 3D GLB asset physically exists on disk at public/models/ │
│ [ ] 2. The actual GLB model renders live in the WebGL Canvas               │
│ [ ] 3. Side-by-side screenshot verification against reference is complete   │
│ [ ] 4. All 15 facial expressions and blinks are visually verified in-browser│
│ [ ] 5. All 14 body animation clips are verified playing smoothly           │
│ [ ] 6. Live lip-sync synchronization is tested during voice TTS playback   │
│ [ ] 7. Wand pointing to DOM targets is verified in Teaching Mode           │
│ [ ] 8. Responsive layout & visual QA completed on Mobile, Tablet & Desktop │
│ [ ] 9. Runtime performance measured (60 FPS desktop / <50MB VRAM)          │
└────────────────────────────────────────────────────────────────────────────┘
```

If any of the above 9 items are unchecked:
* The build status MUST be reported as: **ENGINEERING FOUNDATION: PASS | 3D CHARACTER PRODUCT: BLOCKED ON ASSET**.
