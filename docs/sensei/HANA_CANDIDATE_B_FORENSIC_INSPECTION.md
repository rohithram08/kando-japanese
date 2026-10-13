# HANA-SENSEI — CANDIDATE B FORENSIC INSPECTION REPORT (HONEST)

**Target Asset**: `public/models/hana-sensei.glb` (previously claimed as "Final Production Asset")  
**Inspection Date**: 2026-09-07 (Re-Inspection)  
**Inspector**: Honest Forensic Inspection Suite (Three.js v185 / GLTFLoader)  
**Status**: ⛔ **FAILS PRODUCTION ACCEPTANCE — PROCEDURAL PRIMITIVE GEOMETRY**

---

## 1. Critical Finding: This Is NOT A Real Character

> [!CAUTION]
> The existing `hana-sensei.glb` is built entirely from **Three.js primitive geometry** (SphereGeometry, CylinderGeometry, BoxGeometry, ConeGeometry, TorusGeometry). When the GLB is exported, the `parameters` metadata is stripped, but the source code (`art/hana/build-hana-final.mjs`) conclusively proves every single mesh is a standard Three.js parametric primitive.
>
> **This directly violates Rule #3: "Do NOT create another procedural Three.js character."**

### What the code actually does:
- **Head**: `new THREE.SphereGeometry(0.118, 36, 28)` — A sphere scaled vertically
- **Back Hair**: `new THREE.ConeGeometry(0.26, 0.75, 32, 24)` — An inverted cone
- **Bangs**: `new THREE.CylinderGeometry(0.125, 0.13, 0.10, 24, 6, true, 0, Math.PI)` — A half cylinder
- **Side locks**: `new THREE.CylinderGeometry(0.015, 0.005, 0.35)` — Tapered cylinders
- **Kimono body**: `new THREE.CylinderGeometry(0.165, 0.235, 1.32)` — A tapered cylinder
- **Sleeves**: `new THREE.BoxGeometry(0.14, 0.46, 0.28)` — Rectangular boxes
- **Obi**: `new THREE.CylinderGeometry(0.178, 0.182, 0.16)` — A thin cylinder
- **Musubi bow**: `new THREE.BoxGeometry(0.24, 0.14, 0.09)` — A box
- **Cap**: `new THREE.BoxGeometry(0.26, 0.018, 0.26)` — A flat box
- **Earrings**: `new THREE.SphereGeometry(0.012)` — Tiny spheres
- **Wand shaft**: `new THREE.CylinderGeometry(0.009, 0.009, 0.45)` — A thin cylinder
- **Wand ring**: `new THREE.TorusGeometry(0.06, 0.008)` — A torus

**This is the EXACT kind of procedural capsule/primitive character that Rule #3 forbids.**

---

## 2. Measured Physical Metrics (Honest)

| Property | Measured | Target | Assessment |
|---|---|---|:---:|
| **File Size** | 826.1 KB (0.81 MB) | ≤ 3.2 MB | ✅ Under budget |
| **Triangles** | 23,322 | 20k–24k | ✅ Within budget |
| **Vertices** | 13,673 | — | — |
| **Height** | 165.0 cm | 162 cm ± 3% | ✅ Within range |
| **Submeshes** | 22 | ≥ 8 modular | ✅ Modular |
| **Materials** | 9 flat PBR | ≤ 4 draw calls | ⚠️ 9 materials |
| **Texture Maps** | **0** | 2048×2048 atlas | ❌ **NO TEXTURES** |
| **Skeletal Rig (Bones)** | **0** | 55–65 bone humanoid | ❌ **NO SKELETON** |
| **Blender Source (.blend)** | **Does not exist** | Required | ❌ **MISSING** |

---

## 3. Morph Targets: Technically Present But Low Quality

The face mesh has 18 named morph targets, but:
- The face itself is a **sphere** (SphereGeometry), not modeled facial topology
- Morph deltas only affect **24 of 1,073 vertices** (2.2%) — an extremely small deformation region
- There are no eyes, no mouth geometry, no nose — just a sphere with vertex offsets applied to approximate eye/mouth regions
- The visual effect of these morphs on a sphere is nearly invisible

| Morph Target | Present | Deforms Real Face Geometry? |
|---|:---:|:---:|
| `blink_left` | ✅ | ❌ Deforms sphere surface, no actual eyelid |
| `blink_right` | ✅ | ❌ Same |
| `mouth_smile` | ✅ | ❌ No mouth geometry exists to smile |
| `vowel_a` | ✅ | ❌ No jaw, no lips, no mouth opening |
| *(all 18)* | ✅ | ❌ None produce recognizable facial expressions |

---

## 4. Animation Clips: Technically Present But Minimal

All 14 clips exist, but each contains only **1 track** (except `idle` which has 2):
- Animations are simple quaternion rotations or position bounces on **group nodes**
- There is no skeletal animation (no bones exist)
- "waving" rotates `Hana_Sleeve_L` as a rigid box — it doesn't bend an arm
- "teaching" rotates the entire `Hana_Magical_Wand_Rig` group — there's no hand holding the wand
- "happy" bounces `Hana_Costume_Hierarchy` up and down 2cm
- None of these produce recognizable, distinct character body language

---

## 5. What Does NOT Exist

| Required Deliverable | Status |
|---|:---:|
| Real sculpted/modeled anime character geometry | ❌ Missing |
| Skeletal armature (55–65 bones) | ❌ Missing |
| Texture atlases (2048×2048 diffuse, 1024×1024 emissive) | ❌ Missing |
| Blender source file (`_source/hana-sensei-master.blend`) | ❌ Missing |
| Facial expressions that are visually recognizable | ❌ Missing |
| Skeletal animation with multi-bone tracks | ❌ Missing |
| Turnaround render comparison vs 2D master | ❌ Missing |
| Facial morph test renders | ❌ Missing |
| Animation validation renders | ❌ Missing |

---

## 6. What DOES Exist and Is Correct

| Accomplished Element | Status |
|---|:---:|
| Correct 22-submesh modular hierarchy naming convention | ✅ |
| Correct canonical color hex values in material definitions | ✅ |
| Correct 18 morph target naming dictionary | ✅ |
| Correct 14 animation clip naming convention | ✅ |
| Correct proportional scale (165 cm) | ✅ |
| Character conceptual layout (head, hair, kimono, obi, cap, wand) | ✅ |
| GLB container loads in Three.js without errors | ✅ |

**The structural specification is sound. The geometry content is not.**
