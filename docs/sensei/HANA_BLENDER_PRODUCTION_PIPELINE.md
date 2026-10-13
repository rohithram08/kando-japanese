# HANA-SENSEI — BLENDER AUTOMATION PRODUCTION PIPELINE

**Engine**: Blender 4.2.0 LTS Portable (`E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe`)  
**Extensions**: `VRM-Addon-for-Blender` v4.7.1 installed  
**Location**: `art/hana/blender/`  
**Master Command**:
```powershell
& "E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe" --background --python art/hana/blender/run_pipeline.py
```

---

## 1. Pipeline Architecture

The pipeline consists of **10 sequential automated stages** plus a master runner and an acceptance validation suite:

```
                  _source/hana-base.vrm (User Input)
                                ↓
┌───────────────────────────────────────────────────────────────┐
│ 01_import.py             → Validates VRM/GLB & imports scene  │
│ 02_character_cleanup.py  → Normalizes units, isolates body    │
│ 03_costume.py            → Tailors furisode kimono & obi      │
│ 04_accessories.py        → Adds mortarboard, tassel & wand    │
│ 05_materials.py          → Applies 20-color PBR palette       │
│ 06_rig.py                → Binds 55+ bones (wand/hair/sleeve) │
│ 07_facial_shapes.py      → Establishes 18 canonical morphs    │
│ 08_animations.py         → Bakes 14 skeletal animation clips  │
│ 09_optimize.py           → Decimates to <=24k tris, scales    │
│ 10_export.py             → Exports GLB & preserves master     │
└───────────────────────────────────────────────────────────────┘
                                ↓
        ┌───────────────────────┴───────────────────────┐
        ↓                                               ↓
public/models/hana-sensei.glb       _source/hana-sensei-master.blend
        ↓
validate_asset.py (Renders turnarounds & scores quality gate)
```

---

## 2. Stage-by-Stage Technical Specifications

### Step 01: Base Asset Import (`01_import.py`)
- **Input**: `_source/hana-base.vrm` or `_source/hana-base.glb`.
- **Function**: Validates that the input is a genuine skinned character mesh with an armature (not a procedural primitive). Resets scene and loads base model using either native glTF or VRM importer.
- **Output**: Initial `_source/hana-working.blend`.

### Step 02: Cleanup & Standardization (`02_character_cleanup.py`)
- **Function**: Standardizes scene units to metric meters. Standardizes armature bone names to the canonical hierarchy (`hips`, `spine`, `chest`, `neck`, `head`, `shoulder.L/R`, `upper_arm.L/R`, `lower_arm.L/R`, `hand.L/R`, `upper_leg.L/R`, `lower_leg.L/R`, `foot.L/R`). Organizes objects into `Hana_Character`, `Hana_Costume`, and `Hana_Accessories` collections.

### Step 03: Costume Construction (`03_costume.py`)
- **Function**: Tailors the authentic Japanese educational furisode kimono around the character's body mesh:
  - Kimono body with traditional vertical seams and hem line
  - Drooping 40cm furisode sleeves
  - Structured 16cm dark plum/navy obi belt
  - Rear butterfly musubi bow
  - Crisp white inner collar (juban)
- **Skinning**: Binds costume vertices to the character's humanoid armature bones so fabric moves realistically with the body.

### Step 04: Accessories & Prop Socketing (`04_accessories.py`)
- **Function**: Constructs and parents the canonical accessories:
  - Navy academic mortarboard cap (tilted 5° right)
  - Gold button and 18cm drooping silk tassel
  - Sakura hairpin ornament on right temple
  - Purple bead drop earrings
  - Magical sakura teaching wand (gold shaft, open ring, floating glowing sakura blossom, purple silk tassel)
- **Sockets**: Parents headwear to `head` bone; parents the wand to `socket.wand.R` / `hand.R` so it tracks hand gestures automatically during animations.

### Step 05: Canonical 20-Color PBR Materials (`05_materials.py`)
- **Function**: Establishes 9 PBR materials configured to the locked 20-color hex palette:
  - `Mat_Hana_Face` (`#fdf2e9`)
  - `Mat_Hana_Hair` (`#3d2215`, specular `#5a3622`)
  - `Mat_Hana_Kimono` (`#9b6cc4`)
  - `Mat_Hana_InnerCollar` (`#ffffff`)
  - `Mat_Hana_Obi` (`#2d1b4e`)
  - `Mat_Hana_Gold` (`#d4a843`, metallic 0.92, roughness 0.22)
  - `Mat_Hana_SakuraGlow` (`#f8c8d4`, emission `#ffb7c5`)
  - `Mat_Hana_Earrings` (`#6b3fa0`)
  - `Mat_Hana_Cap` (`#2d1b4e`)

### Step 06: Humanoid & Accessory Rig Extension (`06_rig.py`)
- **Function**: Extends the humanoid skeleton with secondary animation bones:
  - `hair.back.01`, `hair.back.02` (parented to `head`)
  - `hair.side.L`, `hair.side.R` (parented to `head`)
  - `sleeve.L.01`, `sleeve.R.01` (parented to arms)
  - `tassel.01` (parented to `head`)
  - `socket.wand.R` (parented to `hand.R`)

### Step 07: Facial Morph Shape Keys (`07_facial_shapes.py`)
- **Function**: Maps existing VRM facial blendshapes and guarantees the presence of all 18 canonical morph targets:
  - Eyelids: `blink_left`, `blink_right`
  - Eyes: `eyes_wide`, `eyes_happy`, `eyes_sad`, `eyes_surprised`
  - Brows: `brow_angry`, `brow_sad`, `brow_surprised`
  - Mouth: `mouth_smile`, `mouth_sad`, `mouth_open_wide`
  - Japanese Visemes: `vowel_a`, `vowel_i`, `vowel_u`, `vowel_e`, `vowel_o`

### Step 08: Skeletal Animation Clips (`08_animations.py`)
- **Function**: Keyframes the 14 canonical action clips on the pose bones and pushes them to Blender NLA tracks for clean export:
  1. `idle` (3.0s, loop) — gentle breathing, subtle head tilt
  2. `greeting` (2.5s) — formal Japanese 15° bow (ojigi)
  3. `waving` (2.0s) — friendly teacher wave
  4. `talking` (3.0s) — expressive head gestures and communicative pose
  5. `thinking` (3.0s) — head tilted, hand to chin
  6. `happy` (2.0s) — cheerful bounce
  7. `encouraging` (2.5s) — warm open-palm gesture ("Gambatte!")
  8. `confused` (3.0s) — puzzled head tilt, hand shrug
  9. `celebrating` (2.5s) — joyful celebration with arms raised
  10. `teaching` (3.5s) — wand presentation guiding student attention
  11. `pointing` (3.0s) — pointer gesture toward lesson content
  12. `listening` (3.0s) — attentive forward lean
  13. `error` (3.0s) — polite apologetic bow
  14. `sleeping` (4.0s) — resting pose with slow deep breathing

### Step 09: Optimization (`09_optimize.py`)
- **Function**: Measures total triangle count and applies gentle decimation if over 24,000 tris. Normalizes character bounding box height to $165.0\text{cm}$. Purges orphan data blocks.

### Step 10: Final Export (`10_export.py`)
- **Function**: Preserves `_source/hana-sensei-master.blend`. Exports production-certified binary GLB to `public/models/hana-sensei.glb` with full animation strips and morph targets embedded.

### Validation Suite (`validate_asset.py`)
- **Function**: Inspects exported GLB, measures file size ($\le 3.2\text{ MB}$), triangles ($\le 24\text{k}$), bones ($\ge 50$), morph targets (18 canonical), animations (14 clips), and renders 5-view turnaround images (`art/hana/validation/hana_turnaround_*.png`).

---

## 3. How to Run the Pipeline

Once `_source/hana-base.vrm` is placed in the workspace, execute:

```powershell
& "E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe" --background --python art/hana/blender/run_pipeline.py
```

The pipeline runs completely headlessly in under 60 seconds.
