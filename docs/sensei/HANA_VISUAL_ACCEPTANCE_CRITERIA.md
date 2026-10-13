# HANA-SENSEI — VISUAL ACCEPTANCE CRITERIA & QUALITY GATE

**Document Version**: 1.0.0  
**Status**: ACTIVE STANDARD — CHECKPOINT H  
**Scope**: Visual Source of Truth, Concrete Deviation Analysis, Visual Regression Matrix, UI Polish Gate

---

## 1. Concrete Visual Deviation Analysis

This section provides an objective comparison between the **Approved Visual Reference (Source of Truth)**, the **Generated 2D Fallback Portrait** (`public/images/sensei-avatar-fallback.jpg`), and the **Legacy Procedural Implementation** (`PlaceholderSensei.tsx`).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CONCRETE DEVIATION SCORECARD                                   │
├───────────────────────┬───────────────────────────────┬───────────────────────────────┬──────────┤
│ Visual Feature        │ 2D Fallback (`.jpg`)          │ Procedural 3D (`Placeholder`) │ Target   │
├───────────────────────┼───────────────────────────────┼───────────────────────────────┼──────────┤
│ Face & Chin           │ Partial Match (Too round)     │ Major Deviation (Low-poly)    │ PASS REQ │
│ Hair Flow & Bangs     │ Partial Match (Lacks detail)  │ Major Deviation (Clumpy mesh) │ PASS REQ │
│ Eyes & Iris Shading   │ High Match (Warm amber)       │ Major Deviation (Flat discs)  │ PASS REQ │
│ Body Proportions      │ N/A (Bust portrait only)      │ Major Deviation (Capsule body)│ PASS REQ │
│ Furisode Kimono       │ Partial Match (Flat texture)  │ Major Deviation (Cones)       │ PASS REQ │
│ Obi & Musubi Bow      │ Missing / Obscured            │ Major Deviation (Pink box)    │ PASS REQ │
│ Mortarboard Cap       │ High Match (Correct angle)    │ Partial Match (Cube + plane)  │ PASS REQ │
│ Golden Tassel         │ High Match (Flowing gold)     │ Partial Match (Static yellow) │ PASS REQ │
│ Magical Sakura Wand   │ Missing / Off-frame           │ Major Deviation (Star stick)  │ PASS REQ │
│ Color Fidelity        │ High Match (Lavender/Purple)  │ Partial Match (Vivid neon)    │ PASS REQ │
│ Silhouette Harmony    │ High Match (Upper body)       │ Major Deviation (Toy-like)    │ PASS REQ │
│ Expression Nuance     │ Static Smile                  │ Static / Morphing Eyeballs    │ PASS REQ │
│ Material / Shading    │ 2D Painterly Illustration     │ Unlit / Basic PBR Plastic     │ PASS REQ │
└───────────────────────┴───────────────────────────────┴───────────────────────────────┴──────────┘
```

### Detailed Breakdown of Visual Deviations:

1. **FACE & JAWLINE**:
   - *Target Reference*: Soft, elegant anime jawline tapering gently to a delicate chin; subtle cheek blush; clean cel-shaded contour.
   - *2D Fallback*: Slightly softer and rounder than the target reference; chin lacks the sharp anime contour; stylized for 2D painting rather than 3D projection.
   - *Procedural 3D*: Constructed from a primitive Three.js sphere; featureless, flat, and unappealing.

2. **HAIR & STRANDS**:
   - *Target Reference*: Voluminous dark chocolate brown hair (`#3d2215`) parted cleanly, falling into straight textured front bangs, side framing locks with layered tips, and long waist-length tresses flowing behind.
   - *2D Fallback*: Hair silhouette matches well, but lacks the individual strand depth and layered side locks necessary for 3D physics modeling.
   - *Procedural 3D*: Formed of extruded parametric cones/curved tubes with no hair texture, looking like rigid plastic blocks.

3. **EYES & PUPILS**:
   - *Target Reference*: Large, expressive, warm amber/honey-brown anime eyes (`#8b5a2b`) with deep pupil gradation, triple white highlight reflections, crisp black upper eyeliner, and delicate lower lashes.
   - *2D Fallback*: Captures the warm amber tone and highlights accurately. Strong visual standard for 2D.
   - *Procedural 3D*: Flat oval meshes with basic color textures; completely devoid of anime depth, gloss, or iris gradation.

4. **BODY PROPORTIONS**:
   - *Target Reference*: Semi-realistic anime proportions: 6.5 to 7.0 heads tall. Elegant neck, slender shoulders, upright teacher posture.
   - *2D Fallback*: N/A (Framed as a head-and-shoulders bust; lower torso and legs are not visible).
   - *Procedural 3D*: Disproportionate chibi/capsule geometry (~3.5 heads tall), violating the semi-realistic anime requirement.

5. **FURISODE KIMONO & SLEEVES**:
   - *Target Reference*: Traditional furisode kimono in soft lavender (`#9b6cc4`) with deep royal purple gradient accents (`#6b3fa0`), delicate cherry blossom branch patterns, gold edge piping, and long draping sleeves that hang gracefully.
   - *2D Fallback*: Shows lavender cloth and gold trim, but sleeve drape and pattern continuity are omitted.
   - *Procedural 3D*: Truncated cones intersecting at the torso with no sleeve drape or textile fold lines.

6. **OBI BELT & MUSUBI BOW**:
   - *Target Reference*: Broad navy/deep plum obi (`#2d1b4e`) wrapped securely around the midsection, fastened with a bright golden obijime cord, adorned with a multi-layered butterfly bow (musubi) at the rear.
   - *2D Fallback*: Obscured below the frame.
   - *Procedural 3D*: A simple neon-pink extruded cylinder (`#e879f9`) with a flat yellow box.

7. **ACADEMIC MORTARBOARD CAP & TASSEL**:
   - *Target Reference*: Crisp navy/dark plum scholar's cap matching the obi fabric, tilted slightly to the right, adorned with a golden sakura pin and a long, flowing metallic gold tassel (`#d4a843`) that drapes naturally across the brim.
   - *2D Fallback*: Cap geometry and tassel drape closely align with the reference aesthetic.
   - *Procedural 3D*: A rigid dark blue box with a thin yellow line representing the tassel.

8. **MAGICAL TEACHING WAND**:
   - *Target Reference*: Elegant 45cm golden teaching staff topped with an open metallic ring inside which a luminous cherry blossom bloom floats and radiates a soft pink glow.
   - *2D Fallback*: Not rendered in the portrait crop.
   - *Procedural 3D*: A yellow cylinder topped with an extruded 5-point star.

9. **COLOR PALETTE & HARMONY**:
   - *Target Reference*: Refined, harmonious palette: Soft Lavender (`#9b6cc4`), Royal Violet (`#6b3fa0`), Deep Plum/Navy (`#2d1b4e`), Warm Amber (`#8b5a2b`), Gold Trim (`#d4a843`), Sakura Petal Pink (`#f8c8d4`), Pure White Collar (`#ffffff`).
   - *2D Fallback*: Well-aligned with the target color harmonies.
   - *Procedural 3D*: Uses saturated neon primaries (`#9333ea`, `#e879f9`, `#fbbf24`), resulting in a toy-like appearance.

10. **MATERIAL & SHADING QUALITY**:
    - *Target Reference*: High-grade anime cel-shading with smooth light-wrap, subtle rim lighting (`#d4a843`), crisp shadow step, and emissive glow on magical elements.
    - *2D Fallback*: Digital 2D painting with soft airbrushed lighting.
    - *Procedural 3D*: Default Three.js `MeshStandardMaterial` with untextured roughness, producing specular plastic reflections.

---

## 2. Visual Regression Matrix (8 States × 3 Viewports)

To guarantee visual consistency, every release must be validated across **24 distinct visual scenarios** using automated screenshot captures:

```
┌─────────────────────────┬───────────────────┬───────────────────┬───────────────────┐
│ Interaction State       │ Mobile (390×844)  │ Tablet (768×1024) │ Desktop (1920×1080│
├─────────────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ 1. Minimized Mascot     │ Viewport Test 1.1 │ Viewport Test 1.2 │ Viewport Test 1.3 │
│ 2. Chat Dialog Open     │ Viewport Test 2.1 │ Viewport Test 2.2 │ Viewport Test 2.3 │
│ 3. Greeting Wave        │ Viewport Test 3.1 │ Viewport Test 3.2 │ Viewport Test 3.3 │
│ 4. Active Talking       │ Viewport Test 4.1 │ Viewport Test 4.2 │ Viewport Test 4.3 │
│ 5. Thinking Indicator   │ Viewport Test 5.1 │ Viewport Test 5.2 │ Viewport Test 5.3 │
│ 6. Teaching Context     │ Viewport Test 6.1 │ Viewport Test 6.2 │ Viewport Test 6.3 │
│ 7. Pointing to Target   │ Viewport Test 7.1 │ Viewport Test 7.2 │ Viewport Test 7.3 │
│ 8. Celebration Climax   │ Viewport Test 8.1 │ Viewport Test 8.2 │ Viewport Test 8.3 │
└─────────────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

### Validation Checkpoints per State:
1. **Minimized State**:
   - Floating badge is 64×64px, positioned bottom-right with 16px/24px margin.
   - Character bust is centered inside circular avatar ring.
   - Sparkle indicator is visible at top-right of badge.
   - Dragging moves smoothly without breaking layout bounds.
2. **Chat Dialog State**:
   - Dialog opens with smooth spring motion.
   - 3D character viewport sits prominently at the top (`h-36` default, `h-56` expanded).
   - Chat bubbles use semi-transparent glassmorphism with readable contrast (>4.5:1 WCAG AA).
   - Quick action chips horizontally scroll cleanly without clipping.
3. **Greeting State**:
   - Character plays greeting wave animation with welcoming smile (`mouth_smile: 0.8`, `eyes_happy_arch: 0.6`).
   - Dialogue shows warm introductory greeting in user's profile language.
4. **Talking State**:
   - Lip-sync morph targets trigger synchronously with speech cadence.
   - Idle breathing and subtle head nods layer naturally over talking animation.
   - Audio stop button (`Square` icon) appears dynamically in the header.
5. **Thinking State**:
   - Character tilts head slightly with contemplative brow (`brow_sad: 0.2`).
   - Three bouncing pink dots animate inside chat bubble.
   - Input field is cleanly disabled with reduced opacity.
6. **Teaching State**:
   - `SenseiSpeechBubble` renders above character with tail pointing towards avatar.
   - Character extends wand towards educational context.
   - Bubble dismiss (`X`) button is keyboard accessible.
7. **Pointing State**:
   - Character right arm points toward specific UI target element (`[data-sensei-target]`).
   - Target element gains `sensei-highlighted-target` pulsating glow border.
8. **Celebration State**:
   - Character raises hands with ecstatic expression (`eyes_happy_arch: 0.9`, `mouth_smile: 1.0`).
   - Instanced sakura particles increase density/speed momentarily.

---

## 3. UI Quality Gate & Composition Rules

The AI Sensei user interface must feel like an integrated anime learning companion, strictly avoiding generic SaaS chatbot patterns:

1. **Character as Focal Point**:
   - In all open dialog states, Hana-sensei's 3D character or avatar must occupy the top visual anchor of the card.
   - The character viewport must have depth via a soft gradient background (`#e8cdeb` to `#9b6cc4`) and falling sakura petals.
2. **Glassmorphism & Depth**:
   - Backgrounds must use backdrop blur (`backdrop-blur-md`) with high-translucency containers (`bg-card/90` or `bg-background/80`).
   - Borders must use delicate primary accent tints (`border-primary/20`) rather than harsh solid outlines.
3. **Typography & Japanese Accents**:
   - Header titles must feature Japanese typography accents (e.g. `花先生` / `先生のアドバイス`).
   - Font sizes must maintain strict hierarchy: 14px body text, 12px captions, 10px status badges.
4. **Mobile Usability & Layout Constraints**:
   - On screens < 640px wide, the chat dialog must automatically adjust width to `w-[calc(100vw-32px)]` with a max height of `calc(100vh-120px)` to prevent viewport overflow.
   - Virtual keyboard appearance must not push character or send button off-screen.
