# HANA-SENSEI (花先生) — 2D MASTER CHARACTER SPECIFICATION

**Document Version**: 2.0.0 — v1 READY FOR OWNER REVIEW  
**Status**: 2D MASTER v1 — AWAITING PROJECT OWNER VISUAL APPROVAL  
**Supersedes**: All prior character briefs, Checkpoint C/I specifications, and HANA_CANONICAL_CHARACTER_SPEC.md  
**Purpose**: This document is the definitive visual blueprint for producing ALL future Hana-sensei assets (2D illustrations, 3D model, animations, UI sprites, marketing materials).

> [!IMPORTANT]
> **MANDATORY GATE RULE**: The generated 2D sheets are references, not automatically accepted artwork. No 3D conversion may begin until the Project Owner explicitly approves the canonical front character, turnaround, expressions, poses, and props. This prevents declaring success merely because assets were technically generated.

---

## 1. Character Identity

| Field | Canonical Value |
|---|---|
| **Full Name** | Hana-sensei / 花先生 |
| **Role** | Primary AI Japanese-learning companion & teacher of NihonGo Master |
| **Archetype** | Warm, magical, scholarly anime mentor |
| **Gender** | Female |
| **Age Appearance** | 22–24 years (young adult teacher) |
| **Personality** | Warm · Intelligent · Encouraging · Slightly playful · Patient · Elegant · Approachable · Wholesome-magical |
| **Art Style** | Premium semi-realistic anime (NOT chibi, NOT photorealistic, NOT generic VTuber/VRoid) |

### Identity Rule
Hana must be **immediately recognizable** regardless of:
- Pose, expression, camera angle, animation frame
- Lighting conditions, UI context, scale
- 2D illustration vs 3D render

**Character consistency > visual novelty.** Every asset must depict the SAME Hana.

---

## 2. Anatomical Proportions (Locked)

| Measurement | Canonical Value | Notes |
|---|---|---|
| **Overall Height** | 162 cm | Origin at ground plane between feet |
| **Head-to-Body Ratio** | 6.8 heads tall | Semi-realistic anime standard |
| **Head Height** | ~23.8 cm | Measured crown-to-chin |
| **Shoulder Width** | 36 cm | Narrow, feminine, draped by kimono |
| **Neck Height** | 10 cm | Delicate, slender |
| **Arm Length** (shoulder→wrist) | ~55 cm | Mostly concealed by furisode sleeves |
| **Hand Size** | ~16 cm (wrist→fingertip) | Delicate, articulate fingers |
| **Leg Length** (hip→sole) | ~78 cm | Hidden by kimono skirt |
| **Hair Length** | 70 cm (back hair, crown→tips) | Waist-length |
| **Side-Framing Strands** | 35 cm | Past clavicle |
| **Wand Length** | 45 cm | Held in right hand |
| **Cap Brim** | 22 cm × 22 cm | Flat square with soft bevel |
| **Tassel Length** | 18 cm | Drapes to shoulder level |

### Proportion Diagram
```
        ┌───┐  ← Cap (22cm brim)
        │ H │  ← Head (~23.8cm) — HEAD 1
        │ E │     Bangs rest just above eyes
        │ A │     Large amber eyes at ~50% head height
        │ D │     Small chin, gentle jawline
        └─┬─┘
          │    ← Neck (10cm)
       ┌──┴──┐ ← Shoulders (36cm wide) — HEAD 2
       │White│    Inner collar (juban) visible
       │Collar│
       │     │ ← Kimono body — HEAD 3
       │ OBI │ ← Obi belt (16cm wide) at natural waist
       │CORD │    Gold obijime with tassels — HEAD 4
       │     │
       │     │ ← Lower kimono — HEAD 5
       │     │
       │     │ ← — HEAD 6
       │     │
       └──┬──┘ ← Hemline — HEAD 6.8
        ┌─┴─┐
        │ 足 │ ← White tabi socks + zōri sandals
        └───┘
```

---

## 3. Facial Specifications

| Feature | Specification |
|---|---|
| **Face Shape** | Soft oval, classic anime proportions, delicate chin |
| **Eyes** | Large, expressive warm amber-brown anime eyes (`#8b5a2b` base) |
| **Eye Detail** | Multi-layered iris: `#8b5a2b` base → `#d48b38` midtone → `#ffdd80` lower crescent. Dark brown pupil (`#2c1810`). Crisp upper eyeliner (`#1a0f0a`). Dual white specular highlights (primary top-left, secondary bottom-right) |
| **Eyebrows** | Slender expressive arches (`#3d2215`), just above eye frame |
| **Nose** | Subtle anime-stylized (hint of shadow/highlight at bridge and tip) |
| **Mouth** | Small, highly expressive, capable of A/I/U/E/O viseme shapes |
| **Blush** | Soft diffused pink/peach on upper cheeks (`#fca5a5` at 20% opacity) |
| **Skin** | Fair peach complexion. Base: `#fdf2e9`. Shadow: `#f8d7c4` |

---

## 4. Hair Specifications

| Feature | Specification |
|---|---|
| **Style** | Long, flowing, wavy/slightly curved |
| **Length** | Waist-length (70cm from crown) |
| **Bangs** | Straight-cut, slightly textured, resting just above eyebrows |
| **Side Strands** | Symmetrical hime-cut-adjacent framing locks (35cm), past clavicle |
| **Back Hair** | Voluminous waves, natural separation around rear obi bow |
| **Color** | Dark chocolate brown. Base: `#3d2215`. Highlight: `#5a3622` |
| **Accessories** | Sakura blossom clip on RIGHT temple. Cascading purple bead chain from clip. |

---

## 5. Costume Specifications

### A. Furisode Kimono (振袖)
| Element | Specification |
|---|---|
| **Silhouette** | Traditional long-sleeved furisode, sleeves extend ~40cm below elbows |
| **Crossover** | **LEFT over RIGHT** (strictly — right-over-left is funerary) |
| **Body Color** | Soft lavender `#9b6cc4`, gradient to deep violet `#6b3fa0` at hem/sleeve borders |
| **Pattern** | Pink sakura branch motif (`#f8c8d4` petals, `#5a3622` twigs) cascading across left shoulder and lower hem |
| **Trim** | Gold edge piping (`#d4a843`) 1.5cm wide at collar, sleeve cuffs, skirt opening |
| **Inner Collar** | Crisp white layered juban collar (`#ffffff`) visible at neckline |

### B. Obi Belt & Musubi Bow (帯・結び)
| Element | Specification |
|---|---|
| **Obi Band** | 16cm wide, deep plum/navy (`#2d1b4e`), wrapped at midriff |
| **Obijime Cord** | Gold braided cord (`#d4a843`) tied horizontally with floral toggle, ending in small tassels |
| **Musubi Bow** | Multi-loop butterfly bow at upper back waist (`#2d1b4e` with `#d4a843` gold edge trim) |

### C. Footwear
| Element | Specification |
|---|---|
| **Tabi** | White split-toe socks |
| **Zōri** | Traditional sandals, visible below kimono hem |

---

## 6. Props & Headwear

### A. Academic Mortarboard Cap
- **Material**: Navy/deep plum fabric (`#2d1b4e`) matching obi
- **Dimensions**: 22cm × 22cm flat square brim, soft bevel
- **Placement**: Fitted over crown of hair, tilted **5° right** for anime silhouette
- **Center Pin**: 2.5cm gold button (`#d4a843`) with miniature sakura emblem

### B. Golden Tassel
- **Length**: 18cm metallic gold silk cord + tassel bundle (`#d4a843`)
- **Anchor**: Center cap pin, drapes right side to shoulder level

### C. Magical Sakura Teaching Wand
- **Shaft**: 45cm gold staff (`#d4a843`), 1.8cm diameter
- **Grip**: Ergonomic, held firmly in RIGHT hand
- **Head**: Open circular gold ring (12cm diameter) with petal filigree
- **Floating Bloom**: 5-petal sakura (`#f8c8d4`) inside ring, slow rotation, soft pink emissive glow (`#ffb7c5`, 0.8 intensity)
- **Sub-Detail**: Small purple tassel below ring, decorative gold ball joints on handle

### D. Earrings
- **Style**: Delicate dangling purple bead cluster earrings
- **Both ears**: Symmetric

### E. Hair Ornament
- **Type**: Pink sakura flower clip on RIGHT temple
- **Chain**: Cascading purple bead chain with gold connectors

---

## 7. Canonical Color Palette (LOCKED HEX VALUES)

| Element | Hex Code | RGB | Swatch Description |
|---|---|---|---|
| Kimono Body | `#9b6cc4` | (155, 108, 196) | Soft Lavender |
| Kimono Gradient/Hem | `#6b3fa0` | (107, 63, 160) | Royal Violet |
| Kimono Shadow | `#7a52a8` | (122, 82, 168) | Mid-tone Violet |
| Obi / Cap | `#2d1b4e` | (45, 27, 78) | Deep Plum Navy |
| Gold Trim / Wand / Tassel | `#d4a843` | (212, 168, 67) | Warm Antique Gold |
| Sakura Petals | `#f8c8d4` | (248, 200, 212) | Pastel Sakura Pink |
| Wand Emissive Glow | `#ffb7c5` | (255, 183, 197) | Luminous Blossom Pink |
| Skin Base | `#fdf2e9` | (253, 242, 233) | Fair Anime Peach |
| Skin Shadow | `#f8d7c4` | (248, 215, 196) | Warm Peach Shadow |
| Cheek Blush | `#fca5a5` | (252, 165, 165) | Soft Pink Blush (20% opacity) |
| Hair Base | `#3d2215` | (61, 34, 21) | Dark Chocolate Brown |
| Hair Highlight | `#5a3622` | (90, 54, 34) | Warm Chestnut Sheen |
| Eye Iris Base | `#8b5a2b` | (139, 90, 43) | Warm Amber Brown |
| Eye Iris Midtone | `#d48b38` | (212, 139, 56) | Golden Amber |
| Eye Highlight Crescent | `#ffdd80` | (255, 221, 128) | Luminous Gold |
| Eye Pupil | `#2c1810` | (44, 24, 16) | Dark Brown-Black |
| Eyeliner | `#1a0f0a` | (26, 15, 10) | Near-Black Brown |
| Inner Collar (Juban) | `#ffffff` | (255, 255, 255) | Pure White |
| Sakura Twigs | `#5a3622` | (90, 54, 34) | Warm Brown |
| Purple Bead Earrings | `#6b3fa0` | (107, 63, 160) | Royal Violet |

---

## 8. Expression Definitions (12 Canonical Expressions)

| # | Expression | Face Description | Mouth | Eyes | Brows | Blush |
|---|---|---|---|---|---|---|
| 1 | **Neutral** | Calm, gentle resting face | Small closed smile | Open, relaxed | Natural arch | Light |
| 2 | **Happy** | Bright, warm joy | Wide open smile | Closed/squinted crescents | Raised | Medium |
| 3 | **Smiling** | Friendly teacher smile | Closed smile, teeth hidden | Open, warm | Slightly raised | Light |
| 4 | **Encouraging** | Confident, supportive | Warm determined smile | Open, focused | Slightly raised | Light |
| 5 | **Thinking** | Contemplative, curious | Slightly pursed | Looking up-left | One raised | None |
| 6 | **Confused** | Puzzled, uncertain | Slight frown | Slightly narrowed | Furrowed | None |
| 7 | **Surprised** | Delighted shock | Small O shape | Wide open | Raised high | Light |
| 8 | **Concerned** | Gentle worry | Slight downturn | Soft, empathetic | Inner brows raised | None |
| 9 | **Sad/Apologetic** | Gentle sadness | Downturned | Downcast | Inner brows up | None |
| 10 | **Celebrating** | Ecstatic triumph | Wide open grin | Sparkling/closed | Raised | Strong |
| 11 | **Listening** | Attentive, focused | Neutral/slight smile | Open, focused | Neutral | Light |
| 12 | **Sleeping** | Peaceful rest | Closed, relaxed | Closed | Relaxed | Light |

---

## 8.1. Viseme & Eyelid Morph Target Specifications

For lip-sync speech audio and natural eye blinking in 3D:

### A. Japanese Phoneme Visemes (Mouth Shapes)
| Viseme | Phoneme Target | Visual Specification |
|---|---|---|
| `viseme_a` | **あ (A)** | Open vertical oval mouth, tongue resting low |
| `viseme_i` | **い (I)** | Wide horizontal smiling mouth, teeth lightly visible |
| `viseme_u` | **う (U)** | Small rounded puckered mouth, lips pushed slightly forward |
| `viseme_e` | **え (E)** | Mid-open spread mouth, relaxed jaw |
| `viseme_o` | **お (O)** | Open rounded O-shape, rounded lips |

### B. Eyelid & Blink States
| State | Blendshape Target | Visual Specification |
|---|---|---|
| `blink_open` | Default (0.0) | Fully open amber-brown anime eyes with dual specular highlights |
| `blink_half` | `eye_blink_half` (0.5) | Eyelids descended 50%, used in intermediate transition frames |
| `blink_closed` | `eye_blink` (1.0) | Eyelids fully closed, natural downward curvature of eyelashes |
| `blink_happy` | `eye_squint_happy` (1.0) | Joyful curved crescent upward arc for laughing/celebrating |

---

## 9. Pose Definitions (13 Canonical Poses)

| # | Pose | Body | Arms | Wand | Head |
|---|---|---|---|---|---|
| 1 | **Idle** | Standing relaxed, slight weight shift | Wand at side, left hand relaxed | Held loosely at side | Gentle forward tilt |
| 2 | **Greeting** | Slight bow (15°) | Both hands together or open palm | Held vertically | Bowed |
| 3 | **Waving** | Upright | Left hand raised, palm open waving | Right hand holding wand at side | Slight tilt, smiling |
| 4 | **Talking** | Upright, slight lean forward | Left hand gesturing naturally | Held at mid-height | Animated, slight movements |
| 5 | **Thinking** | Slight lean back | Left hand touching chin | Held vertically at side | Tilted up-left |
| 6 | **Teaching** | Confident upright | Wand raised, pointing forward | Extended toward viewer | Direct, confident |
| 7 | **Pointing** | Upright | Wand arm extended to side | Pointing at target | Looking at target direction |
| 8 | **Encouraging** | Leaning slightly forward | Left fist pump or thumbs up | Held at side | Nodding, warm expression |
| 9 | **Confused** | Slight lean, weight shifted | One hand behind head | Lowered | Tilted to side |
| 10 | **Celebrating** | Dynamic upward stretch | Both arms raised | Raised high above head | Tilted back, eyes sparkling |
| 11 | **Listening** | Slight lean forward | Hand near ear | At side | Tilted, attentive |
| 12 | **Error** | Slight shrink/apologetic lean | Hands together, apologetic | Behind back | Slight bow, apologetic |
| 13 | **Sleeping** | Leaning/head resting | Arms folded or at sides | Resting | Tilted to side, eyes closed |

---

## 10. Master Asset Package — File Manifest

```
art/
  hana/
    master/
      hana-front-neutral.jpg         ← CANONICAL FRONT VIEW (primary reference)
    turnaround/
      hana-turnaround-sheet.jpg      ← 5-view turnaround (front / ¾ front / side / ¾ back / back)
    expressions/
      hana-expression-sheet.jpg      ← 8 expression grid (neutral through sad/apologetic)
      hana-viseme-blink-sheet.jpg    ← 5 Japanese phonetic visemes (A/I/U/E/O) + 4 eyelid blink states
    poses/
      hana-pose-sheet.jpg            ← 8 pose grid (idle through listening)
    props/
      hana-prop-sheet.jpg            ← Isolated prop details with dimensions
    colors/
      (hex values defined in this document, Section 7)
    references/
      ref-front-3d-style.jpg         ← User-provided 3D-style front reference
      ref-three-quarter-back.jpg     ← User-provided ¾ back reference
      ref-three-quarter-front.jpg    ← User-provided ¾ front reference
      ref-back-view.jpg              ← User-provided back reference
      ref-side-view.jpg              ← User-provided side reference
```

---

## 11. Design Constraints for 3D Readiness

These constraints ensure the 2D design can be faithfully reconstructed as a 3D humanoid model:

1. **No impossible anatomy**: All limb proportions are consistent and biomechanically plausible.
2. **Sleeve geometry documented**: Furisode sleeves are rectangular tubes (40cm drop below elbow, ~30cm wide) with gold-trimmed open ends.
3. **Hand positions visible**: Fingers articulate naturally; right hand grips wand shaft.
4. **Hair volume separated from body**: Back hair flows OVER the obi bow, separating naturally around it — NOT intersecting through it.
5. **All accessories positioned explicitly**: Cap sits ON crown (not floating), earrings hang from earlobes, hair clip attaches at right temple.
6. **Kimono crossover direction is LEFT over RIGHT**: This MUST be maintained in the 3D model UV mapping.
7. **Obi bow is a separate piece**: Modeled as its own geometry attached at the back waist, not painted on.
8. **No asymmetrical costume details** without documentation: The only intentional asymmetries are (a) cap tilted 5° right, (b) sakura hair clip on RIGHT temple, (c) wand held in RIGHT hand.
