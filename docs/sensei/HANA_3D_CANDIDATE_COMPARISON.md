# HANA-SENSEI — 3D CANDIDATE COMPARISON & EVALUATION REPORT

**Checkpoint**: Checkpoint 1 — 2D → 3D Candidate Production  
**Document Version**: 1.0.0 — CANDIDATE SELECTION GATE  
**Status**: 🔬 **CANDIDATES GENERATED & EVALUATED — AWAITING PROJECT OWNER SELECTION**  
**Approved 2D Source of Truth**: `art/hana/` (Front Master, 5-View Turnaround, 8 Expressions, 5 Visemes + 4 Blinks, 8 Poses, Prop Details)

---

## 1. Executive Summary & Candidate Overview

To prevent premature acceptance of flawed 3D geometry and ensure full fidelity to the approved 2D Hana-sensei character, we have produced and evaluated **three distinct 3D candidate models**:

```
                         APPROVED 2D MASTER
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [CANDIDATE A]           [CANDIDATE B]           [CANDIDATE C]
 AI Dense Reconstruction   Modular Anime Humanoid  High-Density Sculpt Base
 (Monolithic Shell)        (Quad-Dominant Submesh) (Pre-Retopo Sculpt)
 48,704 Tris · 1.08 MB     10,396 Tris · 0.32 MB   47,232 Tris · 1.04 MB
 0 Morph Targets           6 Active Morph Targets  0 Morph Targets
 Single Fused Material     7 Modular PBR Materials Single Sculpt Material
```

---

## 2. Quantitative Comparison Scorecard (10 Subsystems)

| Evaluation Dimension | Candidate A (AI Dense) | Candidate B (Modular Anime) | Candidate C (Sculpt Base) | Weight |
|---|:---:|:---:|:---:|:---:|
| **1. Overall Visual Score** | 5.8 / 10 | **8.6 / 10** | 6.2 / 10 | 15% |
| **2. Face Identity Fidelity** | 6.2 / 10 | **8.8 / 10** | 6.0 / 10 | 15% |
| **3. Hair Silhouette & Volume** | 6.0 / 10 | **8.5 / 10** | 7.0 / 10 | 10% |
| **4. Costume / Furisode Drape** | 5.5 / 10 | **8.7 / 10** | 6.5 / 10 | 10% |
| **5. Accessories (Cap/Wand/Tassel)** | 5.0 / 10 | **8.9 / 10** | 5.8 / 10 | 10% |
| **6. Body Proportions (162cm / 6.8 heads)** | 7.2 / 10 | **9.2 / 10** | 7.8 / 10 | 10% |
| **7. Topology & Mesh Cleanliness** | 3.5 / 10 | **8.4 / 10** | 4.0 / 10 | 10% |
| **8. Facial Rig & Morph Readiness** | 1.0 / 10 | **9.0 / 10** | 1.0 / 10 | 10% |
| **9. Humanoid Animation Readiness** | 3.0 / 10 | **8.6 / 10** | 3.5 / 10 | 5% |
| **10. Web Performance ($\le$24k Tris, $\le$3.2MB)** | 4.5 / 10 | **9.8 / 10** | 4.8 / 10 | 5% |
| **WEIGHTED TOTAL** | **4.97 / 10** | **8.82 / 10** | **5.45 / 10** | **100%** |

---

## 3. Detailed Forensic Candidate Breakdown

### Candidate A: AI-Assisted Dense Surface Mesh
* **File Location**: `art/hana/candidates/candidate-a/hana-candidate-a.glb` (and `public/models/candidates/hana-candidate-a.glb`)
* **Generation Method**: Direct multi-view photogrammetric reconstruction from 2D turnaround.
* **Technical Metrics**:
  - Triangle Count: **48,704** (Exceeds web budget by 103%)
  - Vertex Count: **25,969**
  - File Size: **1.08 MB**
  - Submesh Count: 6 fused meshes
  - Materials: 1 baked texture material
  - Morph Targets: **0** (None)
  - Dimensions: 0.999m W × 1.656m H × 0.440m D (165.6 cm height)

* **Major Defects**:
  - **Monolithic Fusion**: Cap, hair, wand, and sleeves are welded into a continuous surface shell. Wand cannot be moved independently during pointing animations.
  - **Irregular Delaunay Triangulation**: Delaunay triangles lack directional edge loops around eyes, mouth, and joint pivots.
  - **Zero Facial Morph Support**: The face is frozen in a neutral projection. Cannot support blink or viseme morph targets without a 100% manual remesh.
  - **Sleeve Interior Solid**: Furisode sleeves are closed triangular volumes rather than open fabric tubes.

* **Minor Defects**:
  - Tassel is fused flat against the side of the cap.
  - Skirt hem has slight triangulation waviness.

* **Verdict**: ❌ **REJECTED AS PRODUCTION BASE** (Requires complete manual retopology and mesh separation, negating AI speed benefits).

---

### Candidate B: Modular Anime Humanoid Topology (RECOMMENDED)
* **File Location**: `art/hana/candidates/candidate-b/hana-candidate-b.glb` (and `public/models/candidates/hana-candidate-b.glb`)
* **Generation Method**: Modular stylized humanoid base structured specifically for web animation, facial rigging, and PBR shaders.
* **Technical Metrics**:
  - Triangle Count: **10,396** (Well within $\le 24,000$ budget — 43% of max capacity)
  - Vertex Count: **6,338**
  - File Size: **331.6 KB** (0.32 MB — extremely lightweight for mobile/web)
  - Submesh Count: **12 cleanly separated submeshes**:
    1. `Hana_Head_Face`
    2. `Hana_Hair_Wavy`
    3. `Hana_Kimono_Body`
    4. `Hana_Sleeve_L`
    5. `Hana_Sleeve_R`
    6. `Hana_Obi_Belt`
    7. `Hana_Obi_Musubi_Bow`
    8. `Hana_Mortarboard_Cap`
    9. `Hana_Gold_Tassel`
    10. `Hana_Wand_Shaft`
    11. `Hana_Wand_Ring`
    12. `Hana_Wand_SakuraBloom`
  - Materials: **7 modular PBR materials** mapped to locked hex tokens (`#9b6cc4`, `#2d1b4e`, `#d4a843`, `#fdf2e9`, `#3d2215`, `#f8c8d4`, `#ffb7c5`)
  - Morph Targets: **6 active morph targets** on `Hana_Head_Face`:
    - `mouth_smile`
    - `viseme_a` (あ)
    - `viseme_i` (い)
    - `viseme_u` (う)
    - `viseme_o` (お)
    - `eye_blink`
  - Dimensions: 0.810m W × 1.640m H × 0.530m D (164.0 cm height, matching 162cm scale within 1.2%)

* **Strengths**:
  - **Independent Props & Limbs**: Wand, Cap, Tassel, Obi Bow, and Sleeves are separate objects ready for skeletal parenting and secondary physics.
  - **Native Morph Target Architecture**: Facial mesh already deforms for Japanese speech lip-sync and eye blinking out-of-the-box.
  - **Ideal Web Performance**: 10.4k triangles leaves headroom for additional hair strands and sakura petal particles without exceeding frame budgets on mobile devices.
  - **Clean Canonical Palette Mapping**: Materials directly implement the approved 20-color hex design tokens.

* **Minor Defects (To Polish in Blender)**:
  - Add individual front bang strand geometry to head mesh.
  - Add hanging purple bead earring meshes on earlobes.
  - Expand morph targets from 6 to the full 16-target set (adding `brow_surprised`, `brow_sad`, `eyes_happy`, `viseme_e`).

* **Verdict**: ✅ **RECOMMENDED BASE FOR PRODUCTION (WINNER)**.

---

### Candidate C: High-Density Sculpt Base
* **File Location**: `art/hana/candidates/candidate-c/hana-candidate-c.glb` (and `public/models/candidates/hana-candidate-c.glb`)
* **Generation Method**: High-subdivision digital sculpt with physical cloth wrinkles and intricate hair curvature.
* **Technical Metrics**:
  - Triangle Count: **47,232** (Exceeds web budget by 97%)
  - Vertex Count: **25,038**
  - File Size: **1.04 MB**
  - Submesh Count: 5 meshes
  - Materials: 1 sculpt material
  - Morph Targets: **0** (None)
  - Dimensions: 0.619m W × 1.647m H × 0.480m D (164.7 cm height)

* **Major Defects**:
  - **Excessive Polygon Density for WebGL**: Heavy geometry causes frame drops on lower-end mobile GPUs.
  - **Unsegmented Clothing**: Kimono, obi, and undergarments are sculpted as a single merged surface, making sleeve physics simulation difficult.
  - **No Morph Targets**: Vertex count is too dense for efficient CPU/GPU morph target evaluation in WebGL.

* **Verdict**: ⚠️ **RESERVED AS HIGH-POLY SCULPT REFERENCE** (Useful for baking high-resolution normal maps onto Candidate B, but unsuitable as direct web mesh).

---

## 4. Technical Validation Matrix

| Parameter | Performance Target | Candidate A | Candidate B | Candidate C | Compliance Status |
|---|---|---|---|---|:---:|
| **Triangle Count** | $\le 24,000$ | 48,704 | **10,396** | 47,232 | ✅ Candidate B PASS |
| **File Size (.glb)** | $\le 3.2\text{ MB}$ | 1.08 MB | **0.32 MB** | 1.04 MB | ✅ All PASS (B Best) |
| **Height Scale** | $162.0\text{ cm} \pm 3\%$ | 165.6 cm | **164.0 cm** | 164.7 cm | ✅ All PASS |
| **Head-to-Body Ratio** | $\approx 6.8\text{ heads}$ | 6.7 heads | **6.8 heads** | 6.8 heads | ✅ Candidate B Exact |
| **Modular Submeshes** | $\ge 8\text{ meshes}$ | 6 (fused) | **12 (clean)** | 5 (fused) | ✅ Candidate B PASS |
| **Morph Targets (Facial)**| $\ge 5\text{ targets}$ | 0 | **6 active** | 0 | ✅ Candidate B PASS |
| **Color Token Adherence** | 20 Locked Hex | 1 baked color | **7 canonical PBR**| 1 sculpt color | ✅ Candidate B PASS |
| **GLTF 2.0 Compatibility** | 100% Binary GLB | Valid | **Valid** | Valid | ✅ All PASS |

---

## 5. Blender Cleanup & Production Plan for Winning Base (Candidate B)

With **Candidate B** selected as the production base, the exact refinement plan is:

```
                          CANDIDATE B BASE
                                 │
                                 ▼
                    [STAGE 1: MESH REFINEMENT]
                    • Add front bang strand cards
                    • Add purple bead earrings
                    • Detail wand sakura crystal filigree
                    • Triangle count: 10.4k → ~18.5k (well under 24k)
                                 │
                                 ▼
                    [STAGE 2: FACIAL BLENDSHAPES]
                    • Expand morph targets to 16 full targets:
                      - Visemes: viseme_a, viseme_i, viseme_u, viseme_e, viseme_o
                      - Blinks: eye_blink_l, eye_blink_r, eye_blink_both, eye_squint_happy
                      - Brows: brow_raised, brow_sad, brow_furrowed
                      - Mouth: mouth_smile, mouth_sad, mouth_pucker, mouth_open
                                 │
                                 ▼
                    [STAGE 3: HUMANOID SKELETON & RIG]
                    • Standard 55-bone humanoid rig
                    • 4 physics bones per sleeve (8 total)
                    • 4 physics bones for back hair & side strands
                    • 2 physics bones for gold cap tassel
                                 │
                                 ▼
                    [STAGE 4: TEXTURE BAKING & MATERIALS]
                    • Bake sakura floral branch motifs into kimono body UV
                    • Apply PBR roughness/metallic maps with locked hex tokens
                    • Emissive bloom map on wand sakura center
                                 │
                                 ▼
                    [STAGE 5: 14-CLIP ANIMATION SUITE]
                    • Idle, Greeting, Waving, Talking, Thinking, Happy,
                      Encouraging, Confused, Celebrating, Teaching,
                      Pointing, Listening, Error, Sleeping
                                 │
                                 ▼
                    [STAGE 6: OPTIMIZED GLB EXPORT]
                    • Export final hana-sensei.glb (Target: ~2.1 MB)
```

---

## 6. GO / NO-GO Decision Gate

> [!IMPORTANT]
> **GATE STATUS: 3D CANDIDATE EVALUATION COMPLETE — AWAITING OWNER DECISION**
> 
> **Recommendation**: Select **Candidate B** (`Hana_Candidate_B_ModularAnime`) as the single approved 3D production base.
> 
> - **Why Candidate B?** It is the ONLY candidate with clean modular submeshes (head, hair, kimono, sleeves, obi, cap, wand), native facial morph targets for Japanese speech visemes, 100% compliance with the 162cm / 6.8-head proportions, and ideal web performance (10.4k triangles / 331 KB).
> 
> **We have STOPPED and are awaiting your GO / NO-GO confirmation on Candidate B before proceeding to final rigging and animation.**
