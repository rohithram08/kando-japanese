# HANA-SENSEI — VROID STUDIO CONFIGURATION GUIDE
**Canonical Visual Reference**: `art/hana/master/hana-front-neutral.jpg`  
**Purpose**: Step-by-step instructions for creating the authentic 3D base mesh in VRoid Studio (10–15 minutes)

---

## 1. Quick Overview

VRoid Studio (Free by Pixiv for Windows) is the industry standard for creating stylized 3D anime characters. You only need to create Hana's **face, hair, and body**.

> [!TIP]
> **You do NOT need to model the kimono, cap, or wand in VRoid Studio!**  
> Our automated Blender pipeline (`art/hana/blender/`) will automatically build and attach the educational furisode kimono, structured obi belt, graduation mortarboard cap, silk tassel, and magical sakura wand onto your base model.

---

## 2. Installation (1 Minute)

- **Option A (Winget)**: Open PowerShell and run:
  ```powershell
  winget install pixivInc.VRoidStudio
  ```
- **Option B (Direct Download)**: Download from [vroid.com/en/studio](https://vroid.com/en/studio) or Steam.
- Launch **VRoid Studio** and select **Create New** $\rightarrow$ **Female**.

---

## 3. Step-by-Step Character Configuration

### A. Face Editor (Face Tab)

Follow the canonical 2D master illustration (`art/hana/master/hana-front-neutral.jpg`):

1. **Face Shape**:
   - Chin Width: `-15%` (gentle tapering anime chin, not sharp)
   - Chin Length: `-10%`
   - Cheek Fullness: `+20%` (youthful, warm, friendly teacher aesthetic)
2. **Eyes**:
   - Eye Position: Centered, standard anime spacing
   - Eye Size: `+15%` (large, clear, expressive teacher eyes)
   - Eye Slant: `0%` (neutral/gentle)
   - Iris Color: **Amber / Warm Hazelnut**
     - Base color: `#8b5a2b`
     - Midtone: `#d48b38`
     - Highlight: `#ffdd80`
3. **Eyebrows**:
   - Soft arched shape, dark chocolate brown (`#3d2215`)
   - Position: slightly above eyelids for a gentle, encouraging expression
4. **Nose & Mouth**:
   - Nose: Minimalist anime button nose
   - Mouth: Gentle resting smile (corners slightly lifted)
   - Lip Color: Soft coral/peach (`#fca5a5`)

---

### B. Hairstyle Editor (Hair Tab)

Hana has long, voluminous, wavy dark-chocolate hair with neat front bangs and side framing hime strands.

1. **Base Hair Color**:
   - Main Color: `#3d2215` (Dark Chocolate Brown)
   - Highlight Color: `#5a3622` (Warm Chestnut)
   - Shadow Color: `#2c1810`
2. **Front Bangs**:
   - Select **Bangs** $\rightarrow$ Straight, neat anime fringe ending just above the eyebrow line.
3. **Side Framing Locks (Hime Strands)**:
   - Select **Side Hair** $\rightarrow$ Two narrow strands framing both cheeks, extending down to chest level (~35cm).
4. **Back Hair**:
   - Select **Back Hair** $\rightarrow$ Long, soft wavy layers reaching the waist (~75cm).

---

### C. Body Editor (Body Tab)

1. **Height**: Adjust height slider to **165 cm** (approx. 5'5").
2. **Head-to-Body Ratio**: Set to `1 : 6.5` (standard anime proportion, balanced between realism and stylized appeal).
3. **Shoulder Width**: Standard slender female proportion.
4. **Skin Color**:
   - Base skin tone: `#fdf2e9` (soft porcelain peach)
   - Shadow tone: `#f8d7c4`

---

### D. Outfit Editor (Outfit Tab)

- Select any simple basic bodysuit or inner wear (e.g. underwear or basic shirt/shorts).
- *Note*: Our Blender script (`02_character_cleanup.py` and `03_costume.py`) will automatically replace the outfit with the ceremonial furisode kimono.

---

## 4. Exporting the Model

1. Click the **Export** button in the upper right corner.
2. Select **Export as VRM**.
3. In the Optimization settings:
   - **Reduce Polygons**: None or light (target is high quality, Blender will optimize to $\le 24\text{k}$ tris).
   - **Reduce Materials**: Keep default.
   - **Delete Transparent Meshes**: Checked.
4. Fill in character information:
   - Title: `Hana-sensei Base`
   - Author: `NihonGo Master Team`
   - Commercial Use: `Allow`
5. Save the exported file directly to:
   ```
   e:\Nihongo-testing\nihongo-master\_source\hana-base.vrm
   ```

---

## 5. What Happens Next

As soon as `_source/hana-base.vrm` exists, run:
```powershell
& "E:\Nihongo-testing\blender-4.2.0-windows-x64\blender.exe" --background --python art/hana/blender/run_pipeline.py
```
The automated Blender pipeline will execute all 10 production steps in under 60 seconds and deliver `public/models/hana-sensei.glb` and `_source/hana-sensei-master.blend`.
