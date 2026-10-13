# HANA-SENSEI (花先生) — CANONICAL CHARACTER SPECIFICATION

**Document Version**: 1.0.0 — CANONICAL LOCK  
**Status**: SOLE AUTHORITATIVE SOURCE OF TRUTH (CHECKPOINT I)  
**Supersedes**: All prior character briefs, Checkpoint C specifications, and draft pipeline documents.

---

## 1. Character Identity & Visual Overview

```
                      ┌──────────────────────────────────────┐
                      │          HANA-SENSEI (花先生)        │
                      │  Official AI Sensei Character Spec   │
                      └──────────────────┬───────────────────┘
                                         │
     ┌───────────────────────────────────┼───────────────────────────────────┐
     ▼                                   ▼                                   ▼
[ANATOMY & PROFILE]             [COSTUME & TEXTILES]               [PROPS & ACCESSORIES]
• Name: Hana-sensei (花先生)     • Lavender Furisode Kimono         • Academic Mortarboard Cap
• Age Appearance: 22–24 years     (#9b6cc4 / #6b3fa0)                (#2d1b4e with Gold Pin)
• Height: Exactly 162 cm         • Plum/Navy Obi Belt (#2d1b4e)     • Flowing Gold Tassel (18cm)
• Proportions: 6.8 heads tall    • Gold Obijime Cord (#d4a843)      • Magical Sakura Wand (45cm)
• Skin: Fair Peach (#fdf2e9)     • Butterfly Musubi Bow (Rear)      • Floating Sakura Ring
• Hair: Chocolate Brown (#3d2215)• White Inner Collar (#ffffff)     • Sakura Hairpin & Earrings
• Eyes: Warm Amber (#8b5a2b)     • Gold Trim Piping (#d4a843)       • Soft Emissive Bloom
```

Hana-sensei is the warm, elegant, encouraging AI Japanese teacher and learning mentor of NihonGo Master. She combines traditional Japanese aesthetic elements (furisode kimono, sakura blossoms, obi bow) with academic symbolism (graduation mortarboard cap) and magical anime charm (golden sakura wand).

---

## 2. Anatomical & Facial Specifications

| Feature | Canonical Specification | Detail & Implementation Rule |
|---|---|---|
| **Height & Scale** | **162 cm** (1.62 Three.js world units) | Sized accurately to human scale; origin $[0,0,0]$ at ground plane between feet. |
| **Body Proportions** | **6.8 heads tall** | Semi-realistic anime standard. Slender shoulders (36cm wide), delicate neck (10cm), graceful upright posture. |
| **Face Structure** | Soft oval anime jawline | Tapers smoothly to a delicate chin; subtle cheek blush (`#fca5a5` @ 20% opacity); clean dark contour line. |
| **Eyes & Iris** | Warm Amber / Honey Brown (`#8b5a2b`) | Multi-layered iris: `#8b5a2b` base, `#d48b38` midtone, `#ffdd80` lower crescent highlight. Dark brown pupil (`#2c1810`), crisp upper eyeliner (`#1a0f0a`), dual white specular highlights (primary top-left, secondary small bottom-right). |
| **Eyebrows** | Slender, expressive arches (`#3d2215`) | Positioned just above eye frame; fully articulated with morph targets for emotion. |
| **Skin Shading** | Fair peach complexion | Base tone: `#fdf2e9`. Soft shadow tone: `#f8d7c4`. Warm subsurface scatter tint along neck and jaw contour. |
| **Hair Color** | Dark chocolate brown | Base color: `#3d2215`. Soft warm chestnut sheen highlight: `#5a3622`. |
| **Hairstyle** | Flowing waist-length with bangs | 1. Straight textured front bangs resting cleanly just above the eyebrows.<br>2. Symmetrical side-framing locks (35cm) tapering past the clavicle.<br>3. Long back hair (70cm) cascading down to lower waist with a natural separation around the rear obi bow.<br>4. Sakura blossom hair clip on right temple; dangling lavender bead earrings. |

---

## 3. Costume & Attire Specifications

### A. Furisode Kimono (振袖)
* **Silhouette**: Traditional Japanese long-sleeved furisode kimono with graceful draping sleeves extending 40cm below elbows.
* **Crossover**: Traditional Japanese standard — **Left side wrapped over Right side strictly** (Right over Left is funerary and strictly forbidden).
* **Fabric Colors**: Soft Lavender (`#9b6cc4`) on main body, transitioning into a deep Royal Violet gradient (`#6b3fa0`) along the hemline and sleeve borders.
* **Ornamentation**: Delicate cherry blossom (sakura) branch motif cascading across the left shoulder and lower skirt hem (`#f8c8d4` petals with soft brown twigs `#5a3622`).
* **Trim**: Metallic gold edge piping (`#d4a843`) 1.5cm wide running along the collar, sleeve cuffs, and skirt opening.
* **Inner Collar (Juban)**: Crisp, clean pure white layered inner collar (`#ffffff`) visible at neckline.

### B. Obi Belt & Musubi Bow (帯・結び)
* **Obi Band**: Broad 16cm structured plum/navy fabric band (`#2d1b4e`) wrapped securely around the midriff.
* **Obijime Cord (帯締め)**: Metallic gold braided decorative cord (`#d4a843`) tied horizontally across the center of the obi with a small floral toggle.
* **Musubi Bow (Rear)**: Multi-loop structured butterfly bow (`#2d1b4e` with `#d4a843` gold edge trim) positioned at the upper back waist above the hips.

---

## 4. Props & Headwear Specifications

### A. Academic Mortarboard Cap
* **Crown & Brim**: Navy/deep plum fabric (`#2d1b4e`) matching the obi. 22cm × 22cm flat square brim with soft bevel.
* **Placement**: Fitted snugly over the crown of the hair, tilted **5° toward the character's right side** for a stylish anime silhouette.
* **Center Anchor**: 2.5cm metallic gold button pin (`#d4a843`) stamped with a miniature sakura blossom emblem.

### B. Golden Tassel
* **Cord & Drape**: 18cm long metallic gold silk cord and tassel bundle (`#d4a843`).
* **Behavior**: Anchored to the center cap pin, drapes smoothly across the right side of the cap brim, cascading down to shoulder level with secondary physics bones.

### C. Magical Sakura Teaching Wand
* **Shaft**: 45cm slender metallic gold staff (`#d4a843`), 1.8cm diameter, with an ergonomic grip held firmly in the right hand.
* **Head Ornament**: An open circular metallic gold ring (12cm diameter) topped with tiny petal filigree.
* **Floating Bloom**: A stylized 5-petal sakura blossom (`#f8c8d4`) floating freely within the center of the ring, rotating slowly with a soft pink emissive glow (`#ffb7c5`, 0.8 intensity bloom).

---

## 5. Canonical Color Palette (Authoritative Hex Lock)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CANONICAL COLOR PALETTE                               │
├──────────────────────┬───────────┬──────────────────────────────────────────────┤
│ Element              │ Hex Code  │ RGB Values / Description                     │
├──────────────────────┼───────────┼──────────────────────────────────────────────┤
│ Kimono Body          │ `#9b6cc4` │ (155, 108, 196) — Soft Lavender              │
│ Kimono Gradient Hem  │ `#6b3fa0` │ (107,  63, 160) — Royal Violet               │
│ Obi & Academic Cap   │ `#2d1b4e` │ ( 45,  27,  78) — Deep Plum Navy             │
│ Metallic Gold Trim   │ `#d4a843` │ (212, 168,  67) — Warm Antique Gold          │
│ Sakura Blossom Petals│ `#f8c8d4` │ (248, 200, 212) — Pastel Sakura Pink         │
│ Wand Emissive Glow   │ `#ffb7c5` │ (255, 183, 197) — Luminous Blossom Pink      │
│ Skin Complexion Base │ `#fdf2e9` │ (253, 242, 233) — Fair Anime Peach           │
│ Skin Shadow Tone     │ `#f8d7c4` │ (248, 215, 196) — Soft Warm Shadow           │
│ Hair Base Tone       │ `#3d2215` │ ( 61,  34,  21) — Dark Chocolate Brown      │
│ Hair Sheen Highlight │ `#5a3622` │ ( 90,  54,  34) — Warm Chestnut Sheen        │
│ Eye Iris Base        │ `#8b5a2b` │ (139,  90,  43) — Warm Amber Brown           │
│ Inner Collar (Juban) │ `#ffffff` │ (255, 255, 255) — Pure Crisp White           │
└──────────────────────┴───────────┴──────────────────────────────────────────────┘
```
