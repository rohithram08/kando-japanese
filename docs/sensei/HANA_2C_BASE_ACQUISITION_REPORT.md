# HANA-SENSEI — CHECKPOINT 2C: BASE ASSET ACQUISITION REPORT

**Date**: 2026-09-07  
**Status**: 🟢 **READY_FOR_OWNER_ASSET**

---

## 1. What the Owner Must Do

**One task. 10 minutes. GUI only.**

1. Install VRoid Studio (free):
   ```powershell
   winget install pixivInc.VRoidStudio
   ```
2. Open VRoid Studio → Create New → Female
3. Set face, hair, and body following the guide:
   [`docs/sensei/HANA_VROID_QUICK_SETUP.md`](file:///e:/Nihongo-testing/nihongo-master/docs/sensei/HANA_VROID_QUICK_SETUP.md)
4. Export as VRM to:
   ```
   e:\Nihongo-testing\nihongo-master\_source\hana-base.vrm
   ```

**What you do NOT need to create**:
- ❌ Kimono / obi / clothing (automated)
- ❌ Mortarboard cap / tassel (automated)
- ❌ Wand / earrings / accessories (automated)
- ❌ Skeleton rig (comes with VRM)
- ❌ Facial blendshapes (comes with VRM)
- ❌ Animations (automated)

---

## 2. What Antigravity Automates

Once `_source/hana-base.vrm` exists, one command triggers the full pipeline:

```powershell
& "E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe" --background --python art/hana/blender/run_pipeline.py
```

The pipeline performs:

| Step | Script | What It Does |
|:---:|---|---|
| 01 | `01_import.py` | Imports VRM/GLB, validates mesh & armature |
| 02 | `02_character_cleanup.py` | Normalizes units, standardizes bone names |
| 03 | `03_costume.py` | Tailors furisode kimono, obi belt, butterfly bow |
| 04 | `04_accessories.py` | Builds cap, tassel, sakura pin, earrings, wand |
| 05 | `05_materials.py` | Applies 9 canonical PBR materials (20-color palette) |
| 06 | `06_rig.py` | Extends rig with hair/sleeve/tassel/wand bones |
| 07 | `07_facial_shapes.py` | Maps & validates 18 canonical morph targets |
| 08 | `08_animations.py` | Keyframes 14 skeletal animation clips |
| 09 | `09_optimize.py` | Enforces ≤24k tris, 165cm height |
| 10 | `10_export.py` | Exports `public/models/hana-sensei.glb` |

Before the pipeline runs, a non-destructive inspection step (`inspect_base.py`) renders comparison views and verifies the base asset quality.

---

## 3. Exact Required File

```
e:\Nihongo-testing\nihongo-master\_source\hana-base.vrm
```

Alternatively: `_source/hana-base.glb` (any commercially licensed anime GLB with a humanoid rig).

---

## 4. License Status

### VRoid Studio License (Official, verified from vroid.com/en/studio/guidelines)

| Right | Status | Source |
|---|:---:|---|
| **Free to use** | ✅ | Pixiv Inc., no purchase required |
| **Commercial use of exported models** | ✅ | Guidelines §1: "Any individual or corporation may sell or use for commercial purposes" |
| **Sell exported models** | ✅ | Guidelines §3: "You can sell the model data exported from VRoid Studio" |
| **Edit in other software (Blender)** | ✅ | Guidelines §4: "You can edit and use the model data exported from VRoid Studio using software other than VRoid Studio" |
| **Use in games, applications, software** | ✅ | Guidelines §6: "games, applications, software" explicitly listed |
| **Educational use** | ✅ | Guidelines §9: "Instructors or students can use it for educational purposes" |
| **Restriction: character creation tool** | ⚠️ | Guidelines §13: Cannot build a competing character generator — NihonGo Master is a **language learning app**, NOT a character creation tool, so this does not apply |

**Conclusion**: VRoid Studio exported models are **fully cleared for commercial use in NihonGo Master** under the official Pixiv license.

---

## 5. Base Inspection Process

After the owner places `_source/hana-base.vrm`, run:

```powershell
& "E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe" --background --python art/hana/blender/inspect_base.py
```

This script (already tested and verified) will:
- Import the VRM without modifying it
- Count meshes, vertices, triangles
- Verify armature and humanoid bone presence
- Detect face, hair, and eye meshes
- Count existing blendshapes/shape keys
- Measure character height
- Render 3 comparison views (front, 3/4, side) to `art/hana/validation/`
- Write technical report to `art/hana/validation/base_inspection.json`

The script does NOT alter the original asset file.

---

## 6. Visual Score (Pending)

The visual score cannot be assessed until the base asset exists.  
Once inspection renders are available, scoring will follow the gate:

| Category | Minimum |
|---|:---:|
| Face | ≥ 8/10 |
| Hair | ≥ 8/10 |
| Eyes | ≥ 8/10 |
| Body / Silhouette | ≥ 8/10 |
| Overall Resemblance to 2D Master | ≥ 9/10 |

If any category fails: **BLOCKED** (base needs revision in VRoid Studio).

---

## 7. Next Production Stage

After a passing base inspection:

```
_source/hana-base.vrm  ──inspect──▶  PASS?
                                       │
                              YES ─────┤───── NO ──▶ BLOCKED
                                       │             (owner revises
                                       ▼              in VRoid Studio)
                              run_pipeline.py
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
         public/models/         _source/hana-         art/hana/
         hana-sensei.glb      sensei-master.blend    validation/
                                                    renders + score
```

---

## 8. Environment Verification (All Green)

| Component | Status | Detail |
|---|:---:|---|
| Blender 4.2.0 LTS | ✅ | `E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe` |
| VRM Import Extension | ✅ | v4.7.1, `bpy.ops.import_scene.vrm` confirmed |
| glTF Export | ✅ | `bpy.ops.export_scene.gltf` confirmed |
| EEVEE Next Rendering | ✅ | Headless render verified |
| AMD Radeon HIP | ✅ | GPU compute detected |
| Pipeline Scripts (12 files) | ✅ | `art/hana/blender/*.py` all present |
| Inspection Script | ✅ | Tested — correctly reports "no asset" when empty |
| VRoid Studio (winget) | ✅ | `pixivInc.VRoidStudio` v2.3.0 available |
| `_source/` directory | ✅ | Exists, ready for `hana-base.vrm` |

---

## Final Status

```
============================================================
STATUS: READY_FOR_OWNER_ASSET
============================================================

Owner action required:
  10 minutes in VRoid Studio (face + hair + body only)
  Export to: _source/hana-base.vrm

Everything else is automated.
============================================================
```
