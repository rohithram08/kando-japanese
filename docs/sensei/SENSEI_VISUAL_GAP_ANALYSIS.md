# AI Sensei — Visual Gap Analysis (25-Point)

> **Audit Date**: 2026-08-30  
> **Auditor**: Product Reconstruction Audit  
> **Status**: ANALYSIS ONLY — NO CODE CHANGES

---

## Reference Images

The TARGET design is defined by 5 turntable-style reference images of Hana-sensei (花先生), depicting a **semi-realistic anime-style 3D character** rendered at high fidelity (likely Unreal/Unity/Blender PBR render or AI-generated concept art).

---

## Scoring Legend

| Score | Meaning |
|-------|---------|
| ✅ MATCH | Current implementation faithfully represents this element |
| ⚠️ PARTIAL | Element exists but quality, detail, or fidelity falls significantly short |
| ❌ MISSING | Element is entirely absent or fundamentally wrong |

---

## 25-Point Visual Comparison

### Category 1 — Character Body & Silhouette

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 1 | **Overall Body Proportions** | Full semi-realistic anime proportions (~7-head tall), elegant feminine silhouette with kimono draping | Cone geometry torso (42cm radius × 85cm height). No waist, hips, legs, feet. Geometric primitive, not humanoid. | ❌ MISSING |
| 2 | **Body Mesh Quality** | Smooth, high-poly sculpted mesh with PBR materials, subsurface scattering on skin, fabric simulation on kimono | Raw Three.js `coneGeometry`, `sphereGeometry`, `boxGeometry` with flat `MeshStandardMaterial`. No UV mapping, no normal maps, no texture detail. | ❌ MISSING |
| 3 | **Posture & Pose** | Natural feminine standing pose with one hand open in welcoming gesture, slight S-curve in spine, weight on one leg | Static upright cone with no skeleton, no spine curvature, no weight distribution. Arms are floating box geometries. | ❌ MISSING |
| 4 | **Hands & Fingers** | Articulated human hands with individual fingers; one hand holds wand, other is open in welcoming gesture | Two small spheres (0.06 radius) representing entire hands. No fingers, no palm, no articulation. | ❌ MISSING |
| 5 | **Feet & Lower Body** | Full legs visible beneath kimono hem, proper footwear (likely geta/zori sandals or covered by kimono) | Cone terminates abruptly at base. No legs, no feet, no hem detail. | ❌ MISSING |

### Category 2 — Kimono & Clothing

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 6 | **Kimono Fabric** | Rich purple/lavender fabric with visible weave texture, sakura blossom pattern (pink cherry blossoms on branches), gold edge trim along sleeves and collar, semi-transparent overlapping layers | Single flat purple color (`#9333ea`), no texture, no pattern, no transparency, no layering, no fabric simulation. | ❌ MISSING |
| 7 | **Kimono Collar (Eri)** | Traditional V-neck kimono collar with white inner layer visible, proper left-over-right wrapping | Small `boxGeometry` (22cm × 12cm × 5cm) in lavender. No V-shape, no inner layer, no proper wrapping. | ❌ MISSING |
| 8 | **Sleeves (Sode)** | Long furisode-style flowing sleeves with sakura pattern, gold edge trim, fabric draping and physics simulation | Two `boxGeometry` blocks (14cm × 32cm × 22cm) in lavender. No drape, no flow, no pattern. | ❌ MISSING |
| 9 | **Obi Belt** | Dark navy/deep purple obi with sakura pattern, proper width and layering | Pink cylinder (`#e879f9`, 18cm tall). Wrong color (should be dark navy), wrong shape, no pattern. | ⚠️ PARTIAL |
| 10 | **Obijime Cord** | Golden braided cord with tassels tied in a bow across the obi front | Single gold torus (6cm radius). Correct position but wrong representation — no braiding, no bow, no tassels. | ⚠️ PARTIAL |
| 11 | **Obi Bow (Back)** | Large dark navy butterfly bow at back with sakura pattern and visible tassels | Not visible / not implemented (back of character not rendered in companion UI). | ❌ MISSING |

### Category 3 — Face & Head

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 12 | **Face Shape & Skin** | Oval anime face with natural skin tone (light warm), subtle blush, defined jawline, soft cheekbones | Yellow sphere (`#fde047`) — unrealistic skin color, perfectly round, no facial structure. | ❌ MISSING |
| 13 | **Eyes** | Large warm brown anime eyes with detailed iris (gradient brown/amber), upper eyelashes, eye sparkle highlights, subtle eyeliner | Two small purple capsule geometries (`#4c1d95`) with tiny white sphere sparkles. Wrong color, wrong shape, no iris detail, no lashes. | ❌ MISSING |
| 14 | **Mouth & Expression** | Soft pink lips with natural smile, visible teeth in open smile, subtle lip definition | Single red sphere (`#e11d48`, 3cm radius) that scales for lip-sync. No lip shape, no teeth, no smile definition. | ❌ MISSING |
| 15 | **Blush** | Subtle soft pink blush on cheeks, naturally blended | Two flat pink circles (`#f472b6`, 60% opacity). Position correct but rendering is flat billboard circles, not blended. | ⚠️ PARTIAL |
| 16 | **Nose** | Small defined anime nose (typically subtle shadow/highlight) | Not implemented. No nose at all. | ❌ MISSING |

### Category 4 — Hair

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 17 | **Hair Style** | Long flowing dark brown wavy hair reaching below waist, side-swept bangs framing face, partial braid detail at back | Dark plum sphere (`#581c87`, 34cm) behind head + cone ponytail (14cm × 40cm). Wrong color (plum vs dark brown), no waves, no bangs, no flow. | ❌ MISSING |
| 18 | **Hair Accessories** | Sakura flower clips (pink), cascading purple bead chain dangling from one side, wisteria-style pendant beads | Single pink sphere (6cm) at back of head representing "ribbon". No sakura clips, no bead chains, no pendant. | ❌ MISSING |
| 19 | **Earrings** | Purple crystal/bead drop earrings | Not implemented. | ❌ MISSING |

### Category 5 — Accessories

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 20 | **Graduation Mortarboard Cap** | Dark navy mortarboard with golden tassel hanging from center button, sakura flower accent on side, properly seated on head | Navy cylinder + box board (65cm) + gold sphere button + gold cylinder tassel. Shape is approximately correct but oversized (65cm board), no sakura accent, tassel is a cylinder not a proper tassel. | ⚠️ PARTIAL |
| 21 | **Teaching Wand** | Golden staff (~body-length), golden ring at tip encircling a glowing sakura flower, small purple tassel below ring, golden ornamental ball joints along shaft | Orange cylinder shaft (`#d97706`) + yellow octahedron tip (`#fde047`). Wrong style entirely — should be golden staff with sakura ring tip, not wooden stick with diamond. | ❌ MISSING |
| 22 | **Wand Sparkles/Magic Effect** | Soft golden glow emanating from sakura flower, subtle sparkle particles | Two octahedron sparkles orbiting tip. Minimal but directionally correct. | ⚠️ PARTIAL |

### Category 6 — Environment & Presentation

| # | Visual Element | Target Design | Current Implementation | Gap Score |
|---|---|---|---|---|
| 23 | **Background** | Soft purple/lavender gradient with falling sakura petals, decorative cherry blossom branches framing the character | R3F canvas with `Environment preset="city"` HDR. No sakura petals, no gradient, no branches. The companion UI uses Tailwind gradient (`from-primary/10`) which is a pale red, not lavender. | ❌ MISSING |
| 24 | **Lighting** | Soft studio lighting with rim light, subtle warm fill, character-centric spotlight creating gentle shadows | Ambient (1.2) + two directional lights (1.8 from top-right, 0.8 lavender from left). Basic but not studio-quality. No rim light, no soft shadows, no spotlight. | ⚠️ PARTIAL |
| 25 | **Overall Visual Fidelity** | Production-quality 3D render comparable to gacha game character art or VTuber model; immediate brand identity and emotional connection | Prototype-quality procedural placeholder clearly built from geometric primitives. No textures, no materials, no UV mapping, no normal maps. Developer badge ("🌸 VRM Drop-in Ready") visible. | ❌ MISSING |

---

## Gap Summary

| Gap Score | Count | Percentage |
|-----------|-------|------------|
| ❌ MISSING | 19 | 76% |
| ⚠️ PARTIAL | 6 | 24% |
| ✅ MATCH | 0 | 0% |

---

## Critical Assessment

The current `PlaceholderSensei.tsx` was explicitly designed as a **temporary infrastructure fallback** to prove the controller architecture (animation states, lip-sync, movement, expression) works before a real VRM/GLB asset is available. It was never intended to represent the final character.

### What Works (KEEP)
- Controller architecture (Animation, Expression, LipSync, Movement) — well-designed modular system
- 12-state animation state machine — comprehensive
- VRM loader pipeline with graceful fallback — production-ready pattern
- Companion UI (chat, drag, guidance, modes) — functional and polished
- Backend AI brain (Groq + RAG + Guardrails + Context) — 30/30 tests passing
- Zustand store and API integration — clean and complete

### What Must Be Rebuilt (REPLACE)
- The entire visual character (mesh, materials, textures, rig, animations)
- Character environment/background presentation
- Lighting and staging
- Visual effects (sakura petals, wand glow, ambient particles)
- Hair and clothing physics/simulation
- Facial rig and expression system (eyes, mouth, blush, eyebrows)

### Fundamental Gap
The target design requires a **professionally-modeled 3D character asset** (GLB/VRM). This cannot be achieved through procedural Three.js primitives regardless of how sophisticated the geometry code becomes. The gap is an **asset creation** problem, not a **code** problem.
