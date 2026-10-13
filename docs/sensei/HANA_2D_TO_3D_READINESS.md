# HANA-SENSEI — 2D TO 3D READINESS ASSESSMENT

**Document Version**: 2.0.0 — v1 READY FOR OWNER REVIEW  
**Purpose**: Evaluates the 2D master package for 3D reconstruction readiness and defines the exact pipeline from approved 2D assets → production `.glb` web character.

> [!IMPORTANT]
> **MANDATORY PRODUCTION GATE**: No 3D conversion, candidate selection, or mesh generation may begin until the Project Owner explicitly reviews and visually approves the 2D master sheets.

---

## 1. Current 2D Asset Inventory

| Asset | File | 3D Utility | Status |
|---|---|---|---|
| Front Full Body (Neutral) | `art/hana/master/hana-front-neutral.jpg` | Primary modeling anchor & scale reference | ✅ Generated |
| 5-View Turnaround | `art/hana/turnaround/hana-turnaround-sheet.jpg` | Orthographic modeling blueprint (Front / ¾ Front / Side / ¾ Back / Back) | ✅ Generated |
| 8-Expression Sheet | `art/hana/expressions/hana-expression-sheet.jpg` | Facial blendshape / morph target reference | ✅ Generated |
| 5-Viseme & 4-Blink Sheet | `art/hana/expressions/hana-viseme-blink-sheet.jpg` | Japanese speech lip-sync (A/I/U/E/O) & eyelid blink states | ✅ Generated |
| 8-Pose Sheet | `art/hana/poses/hana-pose-sheet.jpg` | 14-clip animation keyframe reference | ✅ Generated |
| Prop Detail Sheet | `art/hana/props/hana-prop-sheet.jpg` | Isolated prop modeling reference (Cap, Tassel, Wand, Hairpin, Obi, Fabric) | ✅ Generated |
| 5 User Reference Images | `art/hana/references/ref-*.jpg` | Style authority and 3D visual target | ✅ Archived |
| Color Palette (hex lock) | `HANA_2D_MASTER_CHARACTER_SPEC.md §7` | 20 locked design tokens for PBR materials & textures | ✅ Documented |
| Proportion Chart | `HANA_2D_MASTER_CHARACTER_SPEC.md §2` | 162cm / 6.8 heads humanoid scale calibration | ✅ Documented |

---

## 2. 3D Readiness Evaluation

### ✅ READY: Elements Fully Specified for 3D Modeling

| Element | Why It's Ready |
|---|---|
| **Body proportions** | Locked at 162cm / 6.8 heads with explicit measurements for every segment (head 23.8cm, shoulders 36cm, neck 10cm, arms 55cm, legs 78cm) |
| **Face topology** | Oval jawline, delicate chin, eye placement, subtle nose, and expressive mouth all clearly referenced |
| **Hair silhouette** | Straight bangs, 35cm side framing locks, 70cm cascading back hair — visible in all 5 turnaround angles |
| **Kimono body** | Rectangular furisode silhouette, left-over-right crossover, 40cm sleeve drop below elbow, gold trim piping |
| **Obi & Rear Bow** | Front: 16cm structured band with gold obijime cord. Rear: structured butterfly musubi bow with gold trim |
| **Academic Cap** | 22cm × 22cm square brim, 5° tilt to right, gold center pin with sakura emblem |
| **Magical Wand** | 45cm gold shaft, 12cm circular ring head, floating 5-petal sakura bloom, purple tassel, ball joints |
| **Facial Expressions** | 8 major emotional states (neutral, happy, thinking, surprised, encouraging, confused, celebrating, sad) |
| **Speech Visemes** | 5 Japanese phoneme mouth shapes: `viseme_a` (あ), `viseme_i` (い), `viseme_u` (う), `viseme_e` (え), `viseme_o` (お) |
| **Eyelid Blinks** | 4 states: open (0.0), half-blink (0.5), fully closed (1.0), smiling squint (happy closed) |
| **Animation Poses** | 8 full-body poses representing target animation keyframes |
| **Color Palette** | 20 exact hex codes locked across costume, skin, hair, eyes, and props |

### ⚠️ PARTIALLY READY: Elements To Refine During 3D Sculpting / Texturing

| Element | What to Refine | How It Will Be Handled |
|---|---|---|
| **Hair physics zones** | Differentiating rigid hair roots from dynamic physics strands | Rigging phase: assign physics bones to the lower 40cm of back hair and side locks only |
| **Kimono UV layout** | Continuous sakura branch wrap across seams | Hand-painted / projected in Blender texture paint mode directly onto UV map |
| **Sleeve interior lining** | Color/depth inside the open furisode cuffs | Lavender `#9b6cc4` interior with gold rim depth extrusion |

---

## 3. Approved 2D → 3D Master Production Pipeline

```
                       2D MASTER v1
                            ↓
                  OWNER VISUAL APPROVAL
                            ↓
                3D CANDIDATE GENERATION
                  ├── AI 3D Candidate A
                  ├── AI 3D Candidate B
                  └── Hybrid / Blender Candidate
                            ↓
                SIDE-BY-SIDE COMPARISON
          (docs/sensei/HANA_3D_CANDIDATE_COMPARISON.md)
                            ↓
                    SELECT BEST BASE
                            ↓
                     BLENDER CLEANUP
                            ↓
                       RETOPOLOGY
                   (≤ 24,000 Triangles)
                            ↓
                     UV + TEXTURING
                 (20-Color Hex Palette)
                            ↓
                      HUMANOID RIG
                     (55–65 Bones)
                            ↓
                       FACIAL RIG
             (11 Expressions + 5 Visemes + Blinks)
                            ↓
                  HAIR / SLEEVE PHYSICS
                            ↓
                   14 ANIMATION CLIPS
                            ↓
                    GLB OPTIMIZATION
                   (≤ 3.2 MB File Size)
                            ↓
                    WEBGL VALIDATION
                   (Three.js / R3F)
                            ↓
                     CERTIFIED HANA
```

---

## 4. 3D Candidate Comparison Framework (Next Checkpoint)

When 3D candidate generation begins, each candidate model will be evaluated across **17 strict criteria**:

1. **Face Identity**: Does the face match the 2D master anchor?
2. **Eye Shape & Depth**: Are the eyes correctly shaped, placed, and textured?
3. **Hair Silhouette**: Does the hair volume, bangs, and side locks match the reference?
4. **Kimono Silhouette**: Does the furisode drape naturally with correct proportions?
5. **Sleeve Geometry**: Are the sleeves open rectangular tubes, not solid blocks?
6. **Obi & Musubi Bow**: Is the rear butterfly bow properly modeled as 3D geometry?
7. **Mortarboard Cap**: Is the cap positioned on the crown with a 5° right tilt?
8. **Gold Tassel**: Does the tassel drape naturally down to the right shoulder?
9. **Magical Wand**: Is the wand scale, circular ring, and sakura center accurate?
10. **Body Proportions**: Does the height match 162cm / 6.8 heads tall?
11. **Color Fidelity**: Are all materials mapped to the locked 20 hex colors?
12. **Anime Shading Style**: Does the model avoid uncanny photorealism or excessive chibi deformation?
13. **Back-View Correctness**: Is the back of the hair, cap, and kimono clean and coherent?
14. **Topology Quality**: Is the mesh quad-dominant with clean edge loops around eyes/mouth/joints?
15. **Rigging Suitability**: Can a standard humanoid armature be fitted without mesh distortion?
16. **Facial Animation Suitability**: Are facial vertices arranged for clean morph target deformation?
17. **Web Performance Budget**: Triangle count $\le 24,000$ and GLB file size $\le 3.2\text{ MB}$.

---

## 5. Phase Gate Checklist

| Gate | Milestone | Status |
|---|---|---|
| **G0.1** | Canonical front view master generated | ✅ COMPLETE |
| **G0.2** | 5-view turnaround sheet generated | ✅ COMPLETE |
| **G0.3** | 8-facial expression sheet generated | ✅ COMPLETE |
| **G0.4** | 5-Japanese viseme & 4-blink sheet generated | ✅ COMPLETE |
| **G0.5** | 8-pose animation reference sheet generated | ✅ COMPLETE |
| **G0.6** | Isolated prop reference sheet generated | ✅ COMPLETE |
| **G0.7** | 20-color canonical hex palette locked | ✅ COMPLETE |
| **G0.8** | Character consistency protocol documented | ✅ COMPLETE |
| **G0.9** | **Project Owner Visual Approval of 2D Package** | ⏳ **AWAITING APPROVAL** |
| **G1.0** | 3D Candidate Generation & Comparison Report | 🔒 LOCKED (Requires G0.9) |
| **G1.1** | Base Model Selection & Blender Retopology | 🔒 LOCKED |
| **G1.2** | Humanoid & Facial Rigging (Visemes + Blinks) | 🔒 LOCKED |
| **G1.3** | 14 Animation Clips Production | 🔒 LOCKED |
| **G1.4** | GLB Export & WebGL Validation | 🔒 LOCKED |

**Current Position**: We are at **Gate G0.9 (Project Owner Visual Review)**.  
No 3D generation or code changes will proceed until the 2D package is explicitly approved.
