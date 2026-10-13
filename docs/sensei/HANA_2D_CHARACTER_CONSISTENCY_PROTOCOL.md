# HANA-SENSEI — 2D CHARACTER CONSISTENCY PROTOCOL

**Document Version**: 1.0.0  
**Purpose**: Defines the mandatory workflow, rules, and verification gates to ensure every Hana-sensei image — past, present, and future — depicts the SAME character.

---

## 1. The Problem This Protocol Solves

Generative AI image tools (and even skilled illustrators) naturally produce "character drift" — subtle changes in face shape, eye size, hair color, costume details, and proportions between images. Over many generations, the character becomes unrecognizable.

**For Hana-sensei, character drift is unacceptable.**

She must be immediately identifiable across:
- Front, side, back views
- 12+ facial expressions
- 13+ body poses
- 2D illustrations and 3D renders
- UI thumbnails and full-screen compositions
- Marketing materials and social media

---

## 2. The Consistency Hierarchy

```
                CANONICAL MASTER IMAGE
            (art/hana/master/hana-front-neutral.jpg)
                         │
                         ▼
              REFERENCE IMAGE SET
     (art/hana/references/ — 5 user-provided refs)
                         │
                         ▼
              CONSISTENCY LOCK
     (This protocol + locked hex palette + proportion chart)
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
      TURNAROUND    EXPRESSIONS     POSES
      (5 views)     (12 faces)      (13 bodies)
           │             │             │
           └─────────────┼─────────────┘
                         ▼
              2D QUALITY GATE
              (Section 5 checklist)
                         │
                         ▼
              APPROVED 2D PACKAGE
                         │
                         ▼
              3D RECONSTRUCTION INPUT
```

### Rule: Every Image References the Master

No image is generated independently. Every turnaround view, expression, and pose MUST be generated using the canonical master image as a visual reference input. This prevents the AI from "reinventing" Hana with each generation.

---

## 3. Generation Rules

### 3.1 — Anchor Image Rule
- The file `art/hana/master/hana-front-neutral.jpg` is the **ANCHOR**.
- When generating any new Hana image, this anchor MUST be provided as a reference/input image.
- If the generation tool supports image-to-image or character reference features, they MUST be used.

### 3.2 — Description Consistency Rule
- Every generation prompt MUST include these non-negotiable descriptors:
  ```
  Hana-sensei character, dark chocolate-brown long wavy hair with straight bangs,
  warm amber-brown anime eyes, dark navy mortarboard graduation cap with gold tassel
  and pink sakura flower, lavender-purple furisode kimono with pink sakura cherry
  blossom pattern, dark navy obi belt with gold braided cord, golden magical sakura
  wand with circular ring containing glowing pink sakura flower, purple bead
  dangling earrings, white inner collar
  ```
- Omitting ANY of these identifiers risks character drift.

### 3.3 — Color Lock Rule
- Generated images MUST match the canonical hex palette (see HANA_2D_MASTER_CHARACTER_SPEC.md Section 7).
- If a generation produces incorrect colors (e.g., blue kimono, black hair, green eyes), the image is **REJECTED** — it is not Hana.

### 3.4 — Proportion Lock Rule
- Hana is 6.8 heads tall. Her head is slightly larger than photorealistic to emphasize expressions.
- If a generation produces significantly different proportions (e.g., 8 heads tall, chibi, or super-deformed), the image is **REJECTED**.

### 3.5 — No Costume Invention Rule
- AI generators frequently hallucinate accessories: extra ribbons, glasses, wings, flowers not in the spec, different shoe styles.
- Any accessory NOT in the canonical spec (Section 6 of HANA_2D_MASTER_CHARACTER_SPEC.md) is a **REJECTION** trigger.
- The ONLY accessories are: mortarboard cap, gold tassel, sakura hair clip, purple bead earrings, golden wand, obi bow.

---

## 4. Post-Generation Verification Checklist

After generating ANY Hana image, verify against this checklist before accepting:

### Identity Check (HARD REJECT if any fail)
- [ ] Same face shape (soft oval, delicate chin) — matches master
- [ ] Same eye color (warm amber-brown `#8b5a2b`) — not blue, green, or black
- [ ] Same eye style (large anime, dual specular highlights) — matches master
- [ ] Same hair color (dark chocolate brown `#3d2215`) — not black, auburn, or blonde
- [ ] Same hair style (long wavy, straight bangs, side framing strands) — not short, curly, or ponytail

### Costume Check (HARD REJECT if any fail)
- [ ] Kimono is lavender-purple `#9b6cc4` — not blue, pink, red, or white
- [ ] Kimono has sakura cherry blossom pattern — not roses, butterflies, or plain
- [ ] Kimono crossover is LEFT over RIGHT — not reversed
- [ ] Inner white collar visible at neckline
- [ ] Dark navy obi belt present with gold cord
- [ ] Gold edge trim visible on collar/sleeves

### Accessory Check (SOFT REJECT — fix or regenerate)
- [ ] Mortarboard cap present, dark navy color
- [ ] Gold tassel hanging on right side
- [ ] Sakura hair clip on right temple
- [ ] Purple bead earrings visible
- [ ] Golden wand with sakura ring present (unless pose specifically excludes it)
- [ ] No hallucinated extra accessories (glasses, wings, ribbons, necklaces)

### Proportion Check (SOFT REJECT)
- [ ] Approximately 6.8 heads tall (not chibi, not hyper-elongated)
- [ ] Head-to-body ratio consistent with master
- [ ] Hands have correct finger count (5 per hand)
- [ ] No distorted or malformed limbs

---

## 5. 2D Quality Gate — Package-Level Verification

Before declaring the 2D master package complete, ALL of these must be verified:

| # | Criterion | Status |
|---|---|---|
| 1 | Same face across ALL views (front, ¾, side, back) | ☐ |
| 2 | Same eyes (color, size, style) across all expressions | ☐ |
| 3 | Same hair (color, style, length) across all views | ☐ |
| 4 | Same kimono (color, pattern, construction) across all views | ☐ |
| 5 | Same cap (placement, color) across all views | ☐ |
| 6 | Same wand (design, proportions) across all views | ☐ |
| 7 | Same proportions (6.8 heads) across all views | ☐ |
| 8 | Same color palette (within ±10% of canonical hex) across all images | ☐ |
| 9 | Same accessories (no additions, no omissions) across all views | ☐ |
| 10 | Same character identity — "Is this recognizably Hana?" | ☐ |
| 11 | No accidental costume changes between views | ☐ |
| 12 | No AI-hallucinated extra accessories | ☐ |
| 13 | No missing or extra fingers | ☐ |
| 14 | No malformed hands | ☐ |
| 15 | No inconsistent sleeve geometry | ☐ |
| 16 | No distorted wand | ☐ |
| 17 | No perspective corruption in turnaround | ☐ |

**Gate Rule**: If ANY item is ☐ (unchecked), the package is NOT complete.  
**Human Review Required**: A human must visually confirm items 1, 2, 3, 4, and 10.

---

## 6. Consistency Recovery Protocol

If character drift is detected in a generated image:

1. **DO NOT** try to "fix it" by generating more variations — this compounds drift.
2. **STOP** and identify exactly which features drifted (eyes? hair? kimono color?).
3. **RE-GENERATE** using the canonical master as a stronger reference input.
4. If the tool cannot maintain consistency:
   - Simplify the prompt (remove complex pose/expression instructions).
   - Generate the base character first, then edit expressions/poses.
   - Consider manual touch-up in an image editor to correct drifted features.
5. **DOCUMENT** the drift pattern so future generations can avoid the same trigger.

---

## 7. Version Control

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-09-01 | Initial canonical consistency protocol |

All changes to this protocol require explicit Project Owner approval.
