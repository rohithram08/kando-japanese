# HANA-SENSEI — QUICK VRoid SETUP (10 MINUTES)

**You only need to do 3 things: Install → Customize → Export.**  
Everything else is automated.

---

## INSTALL (1 minute)

Open PowerShell and run:

```powershell
winget install pixivInc.VRoidStudio
```

Or download from: https://vroid.com/en/studio

Launch VRoid Studio after installation.

---

## CREATE (8 minutes)

Click **Create New** → **Female**

### Face (2 min)

Open the reference image side-by-side:  
`art/hana/master/hana-front-neutral.jpg`

| Setting | Value | Why |
|---|---|---|
| **Face shape** | Slightly narrow chin, full cheeks | Soft oval anime face |
| **Eye size** | Larger than default | Expressive teacher eyes |
| **Iris color** | Warm amber `#C48B38` | Canonical Hana eye color |
| **Iris highlight** | Golden `#FFDD80` | Lively sparkle |
| **Eyebrow color** | Dark brown `#3D2215` | Match hair |
| **Eyebrow shape** | Soft arch | Gentle, encouraging |
| **Mouth** | Default resting position | Neutral ready |
| **Skin tone** | Porcelain peach `#FDF2E9` | Warm anime skin |

### Hair (4 min)

| Setting | Value |
|---|---|
| **Hair color** | Dark chocolate brown `#3D2215` |
| **Highlight** | Warm chestnut `#5A3622` |
| **Front bangs** | Straight, neat, ending just above eyebrows |
| **Side hair** | Two face-framing strands down to chest |
| **Back hair** | Long wavy layers reaching waist |

### Body (1 min)

| Setting | Value |
|---|---|
| **Height** | Around `162 cm` on the slider |
| **Proportions** | Standard anime female (default is fine) |

### Outfit (1 min)

Pick **any simple base outfit** (underwear, basic shirt, anything).  
Our scripts will replace it with the kimono.

---

## EXPORT (1 minute)

1. Click **Export** (top-right) → **Export as VRM**
2. Optimization settings:
   - Reduce Polygons: **None** (our scripts handle this)
   - Delete Transparent Meshes: **Checked**
3. Character info:
   - Title: `Hana-sensei`
   - Author: your name
   - Commercial Use: **Allow**
4. **Save to this exact path:**

```
e:\Nihongo-testing\nihongo-master\_source\hana-base.vrm
```

---

## DONE

After saving, tell Antigravity you've placed the file.  
The automated pipeline handles everything from here:  
costume, accessories, rig, morphs, animations, optimization, and export.
