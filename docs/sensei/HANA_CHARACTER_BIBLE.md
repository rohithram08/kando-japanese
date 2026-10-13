# Hana-sensei (花先生) - Official Character Bible

## Core Identity
* **Name**: Hana-sensei (花先生)
* **Role**: Primary Japanese-learning AI companion for NihonGo Master.
* **Archetype**: The encouraging, knowledgeable, and slightly magical mentor.
* **Age Appearance**: Young adult (early-to-mid 20s).
* **Style**: High-quality, semi-realistic anime 3D rendering (not chibi, not hyper-realistic).

## 1. Visual Specification

### Face & Head
* **Face Shape**: Soft oval, classic anime proportions with a defined but gentle jawline.
* **Eye Proportions**: Large, expressive anime eyes taking up roughly 1/3 of the facial height.
* **Eye Style**: Detailed, multi-layered iris with depth. Thick, well-defined upper eyelashes.
* **Iris Design**: Gradient warm brown to amber, with distinct crystalline/light-catching depths.
* **Pupil Design**: Dark brown/black, distinct but blending softly into the iris gradient.
* **Eyebrows**: Thin, expressive, matching hair color (dark brown), resting gently above the eyes.
* **Nose**: Subtle, stylized anime nose (often just a hint of shadow/highlight bridge and tip).
* **Mouth**: Small but highly expressive. Capable of distinct phonetic shapes (A/I/U/E/O) and emotional curves.
* **Blush**: Soft, diffused pink/peach gradient on the upper cheeks, adjusting intensity with emotion.
* **Facial Proportions**: Eyes set relatively low (middle of head), maximizing forehead space (covered by bangs) to enhance the youthful, cute aesthetic.

### Hair
* **Hairstyle**: Long, flowing, wavy hair cascading down past the waist.
* **Bangs**: Straight-cut but slightly textured front bangs falling just above the eyes, with longer side-swept framing strands (hime-cut adjacent but softer).
* **Back Hair**: Voluminous, thick waves that react well to physics/wind.
* **Hair Color**: Deep, rich dark brown (`#3d2215`).
* **Highlights**: Subtle warm specular highlights to give depth and prevent the hair from looking like a solid mass.
* **Accessories**: 
  * Pink sakura (cherry blossom) flower clips pinned on the right side.
  * Delicate purple bead dangling earrings with chain clusters.

### Body & Silhouette
* **Approximate Proportions**: ~6.5 to 7 heads tall (standard semi-realistic anime proportion).
* **Head/Body Ratio**: Head is slightly larger than realistic proportions to emphasize facial expressions.
* **Shoulders**: Narrow, sloping softly (feminine anime standard), heavily draped by the kimono.
* **Arms**: Slender, completely concealed by the furisode sleeves, except for the hands.
* **Hands**: Delicate, articulate fingers. Right hand must be rigged to grip the wand; left hand rigged for open, welcoming gestures.
* **Overall Silhouette**: A bell-like triangle formed by the flowing kimono sleeves and skirt, topped by the distinct flat horizontal line of the mortarboard cap.

### Clothing (Kimono & Accessories)
* **Kimono Style**: Furisode (long-sleeved) stylized kimono.
* **Main Color**: Rich purple/lavender base.
* **Pattern**: Pink sakura (cherry blossom) branches and falling petals patterned across the fabric.
* **Sleeves**: Extremely wide, flowing furisode sleeves that require cloth physics. Gold edge trim along the cuffs.
* **Collar (Eri)**: Traditional crossed collar, left over right, showing a crisp white inner layer.
* **Obi Belt**: Wide, dark navy/deep purple base with subtle pink sakura patterns.
* **Obijime (Cord)**: Golden braided cord tied at the front waist, ending in hanging golden tassels.
* **Obi Bow (Musubi)**: Large, structural butterfly-style bow at the back, matching the dark navy obi fabric.
* **Cap**: Deep navy blue academic mortarboard (graduation cap) sitting squarely on the head.
* **Cap Tassel**: Golden tassel hanging off the right front edge. A small pink sakura flower is pinned where the tassel attaches to the board.

### The Magical Wand
* **Shape**: A sleek, body-length staff.
* **Material**: Golden metallic base.
* **Tip**: A golden floating ring enclosing a pink, glowing sakura flower.
* **Details**: A small purple tassel hangs below the ring. Decorative golden ball joints punctuate the handle.
* **VFX**: Emits a soft golden/white ambient glow and subtle, orbiting sparkle particles.

## 2. Color Palette (Hex Codes)
* **Kimono Primary**: `#9b6cc4` (Lavender Purple)
* **Kimono Shadow**: `#6b3fa0` (Deep Purple)
* **Obi / Cap**: `#2d1b4e` (Dark Navy/Plum)
* **Gold Accents**: `#d4a843` (Metallic Gold)
* **Sakura Pink**: `#f8c8d4` (Soft Pink)
* **Sakura Dark**: `#e8a0b4` (Deep Pink)
* **Hair**: `#3d2215` (Dark Chocolate Brown)
* **Skin Base**: `#fce4d6` (Warm Pale Peach)
* **Eye Iris**: `#8b5a2b` (Warm Amber Brown)
* **Wand Glow**: `rgba(212, 168, 67, 0.6)` (Golden Radiance)

## 3. Maintaining Character Consistency
To ensure one canonical Hana-sensei identity across all assets, poses, and angles:

1. **Avoid Pure GenAI for Final Assets**: Generative AI (Midjourney, DALL-E) suffers from "character drift" (hallucinating changing details across generations). AI should *only* be used for concept generation and texture ideation.
2. **The 3D Source of Truth**: The final character must be a singular, hand-refined 3D mesh (GLB). Every frame rendered in the app comes from this exact mathematical mesh, guaranteeing 100% geometric and textural consistency.
3. **Rig-Based Expression**: Emotions are not swapped textures (which can look inconsistent) but morph targets (blendshapes) moving the canonical face mesh.
4. **Baked Materials**: Patterns (like the sakura on the kimono) must be baked into the UV map of the 3D model, ensuring the pattern wraps exactly the same way regardless of the viewing angle.

## 4. 2D Master Character Sheet Requirements
Before any 3D production begins, a definitive **2D Master Character Sheet (Turnaround)** must be created. This acts as the blueprint for the 3D modeler (human or AI).

**Required Package:**
1. **Turnaround (T-Pose / A-Pose)**: Front, 3/4 Front, Side, 3/4 Back, Back views (Crucial for 3D modeling).
2. **Face Detail**: Close-up of eyes (open/closed), mouth shapes (A, I, U, E, O).
3. **Prop Callouts**: Detailed orthographic views of the Wand and Cap.
4. **Expression Sheet**: Neutral, Happy, Thinking, Confused, Encouraging, Surprised. (Used as reference for creating 3D blendshapes).
5. **Pose Sheet**: Idle, Teaching, Pointing, Celebrating. (Used as reference for the animator).
