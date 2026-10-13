# HANA-SENSEI — 3D GENERATION OPTIONS INVESTIGATION

**Date**: 2026-09-07  
**Purpose**: Evaluate all viable paths from approved 2D Hana master → real 3D character  
**Visual Target**: `art/hana/master/hana-front-neutral.jpg`

---

## 1. Options Evaluated

### OPTION 1: Blender Portable + Python Scripted Character

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | Blender bpy/bmesh can generate proper quad topology with edge loops around eyes/mouth. Subdivision Surface modifier produces smooth anime faces. Not as good as manual sculpting, but far superior to primitives. | 7/10 |
| **Anime style** | Blender is the industry standard for anime 3D. Complete control over proportions, eye size, face shape. | 9/10 |
| **Topology** | bmesh allows proper quad-dominant topology with animation-ready edge loops. | 8/10 |
| **Hair** | Can create proper hair card geometry, particle-based or mesh-based strands. Far better than cones/cylinders. | 7/10 |
| **Clothing (kimono)** | Cloth simulation, manual modeling, or scripted geometry with proper UV mapping. Can apply sakura texture patterns. | 8/10 |
| **Facial rig** | Native Blender shape keys on real face geometry. Genuine vertex deformation. | 9/10 |
| **Humanoid rig** | Full armature system. 55+ bone humanoid rig with IK chains, constraints. | 10/10 |
| **Animation support** | Full NLA editor, keyframe animation, baked to GLB. Multi-bone tracks. | 10/10 |
| **Texture quality** | UV unwrap → texture paint or external image application. PBR material nodes. | 9/10 |
| **Consistency** | Complete control — reproducible via Python scripts. | 9/10 |
| **Licensing** | Blender is GPL. Assets YOU create are YOUR copyright. No restrictions. | ✅ CLEAR |
| **Export quality** | Native glTF 2.0 exporter. Industry standard. | 10/10 |
| **Web suitability** | Direct GLB export optimized for three.js/R3F. | 10/10 |
| **Installation** | Portable ZIP, ~800MB, no admin. | ✅ EASY |
| **Hardware concern** | Low RAM (7.3GB), integrated GPU. Eevee works. Cycles slow. | ⚠️ TIGHT |

**OVERALL: 8.7/10 — RECOMMENDED PRIMARY PATH**

**License**: GPL (Blender) — assets created by user are fully owned by user. No attribution needed. Full commercial rights.

---

### OPTION 2: Rodin AI (Hyper3D) — Image-to-3D

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | Dedicated anime presets. Multi-view synthesis from reference images. Good for initial geometry generation. | 7/10 |
| **Anime style** | Has anime-specific workflow toggles. | 7/10 |
| **Topology** | AI-generated mesh. Quality varies. May need retopology. | 5/10 |
| **Hair** | AI will attempt to model hair from reference. Results vary. | 5/10 |
| **Clothing (kimono)** | Can capture kimono shape from reference image. No fabric detail control. | 5/10 |
| **Facial rig** | ❌ Does NOT generate morph targets. Separate rigging step needed. | 0/10 |
| **Humanoid rig** | ❌ Does NOT generate skeleton. Separate rigging step needed. | 0/10 |
| **Animation support** | ❌ None. Static mesh only. | 0/10 |
| **Texture quality** | PBR textures from reference. Quality depends on input image. | 6/10 |
| **Consistency** | Somewhat unpredictable. Multiple generations may differ. | 4/10 |
| **Licensing** | Free tier available. Created assets are yours to use commercially. | ✅ CLEAR |
| **Export quality** | GLB, FBX, OBJ, USDZ export. | 8/10 |
| **Web suitability** | Output GLB needs optimization. | 6/10 |

**OVERALL: 4.5/10 — USEFUL AS BASE MESH GENERATOR, NOT COMPLETE SOLUTION**

**License**: Free tier. Generated assets owned by user. Commercial use allowed.

**Critical gap**: No rig, no morphs, no animation. Still needs Blender for production pipeline.

---

### OPTION 3: Meshy AI — Image-to-3D + Auto-Rig

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | Good multi-view synthesis. Anime faces are adequate. | 6/10 |
| **Anime style** | Supports stylized models. Not anime-specialized. | 5/10 |
| **Topology** | AI mesh. Often needs cleanup. | 5/10 |
| **Hair** | Captures hair silhouette. Internal detail limited. | 5/10 |
| **Clothing (kimono)** | Captures basic shape. No fabric detail or sakura pattern. | 4/10 |
| **Facial rig** | ❌ No facial morph targets generated. | 0/10 |
| **Humanoid rig** | ✅ Auto-rigging included. | 6/10 |
| **Animation support** | ✅ 600+ animation presets. Can apply after rigging. | 6/10 |
| **Texture quality** | PBR textures. Quality varies. | 5/10 |
| **Consistency** | Unpredictable per generation. | 4/10 |
| **Licensing** | Free plan (limited credits). API requires paid plan. | ⚠️ LIMITED FREE |
| **Export quality** | GLB, FBX, OBJ, BLEND export. | 7/10 |
| **Web suitability** | Output needs optimization. | 6/10 |

**OVERALL: 4.5/10 — SIMILAR TO RODIN, SLIGHTLY BETTER RIGGING**

**License**: Free tier for web app. No free API. Created models owned by user for commercial use (check plan terms).

---

### OPTION 4: Tripo3D — Image-to-3D

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | High fidelity reconstruction. Good for stylized. | 7/10 |
| **Anime style** | Good stylized support. | 6/10 |
| **Topology** | Quad-remeshing available. Better than Meshy baseline. | 6/10 |
| **Hair** | Good hair silhouette capture. | 6/10 |
| **Clothing (kimono)** | Captures shape. Limited detail control. | 5/10 |
| **Facial rig** | Parts segmentation helps. No direct morph generation. | 2/10 |
| **Humanoid rig** | Auto-rigging + animation retargeting available. | 7/10 |
| **Animation support** | Animation retargeting feature. | 6/10 |
| **Texture quality** | PBR with good quality. | 7/10 |
| **Consistency** | Better than average AI tools. | 5/10 |
| **Licensing** | Free tier (limited). Full export may require paid. | ⚠️ LIMITED FREE |
| **Export quality** | GLB, FBX, OBJ export. | 7/10 |
| **Web suitability** | Smart low-poly option available. | 7/10 |

**OVERALL: 5.5/10 — BEST AI-ONLY OPTION BUT STILL NEEDS BLENDER**

**License**: Free tier limited. Paid for full export. Created assets owned by user.

---

### OPTION 5: VRoid Studio — Anime Character Creator

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | Purpose-built for anime faces. Excellent eye/face customization. | 9/10 |
| **Anime style** | ✅ THE best tool for anime-style 3D characters. | 10/10 |
| **Topology** | Optimized anime topology. Quad-based face mesh. | 8/10 |
| **Hair** | Strand-by-strand hair editing. Excellent anime hair. | 9/10 |
| **Clothing (kimono)** | ⚠️ Limited built-in clothing. Kimono may need custom textures or community assets. Furisode specifically is uncommon. | 4/10 |
| **Facial rig** | ✅ Built-in blend shapes (blink, mouth, emotions). | 8/10 |
| **Humanoid rig** | ✅ Full humanoid skeleton (VRM standard). | 9/10 |
| **Animation support** | ⚠️ VRM format has spring bones for hair/cloth physics. No baked animation clips. Needs external animation source. | 3/10 |
| **Texture quality** | Custom texture painting. Layer-based. Good for anime. | 7/10 |
| **Consistency** | Deterministic — same inputs produce same outputs. | 10/10 |
| **Licensing** | ✅ FREE. Commercial use allowed. You own what you create. | ✅ CLEAR |
| **Export quality** | VRM format (glTF-based). Can rename to .glb or use @pixiv/three-vrm. | 7/10 |
| **Web suitability** | three-vrm already in project dependencies. Native web support. | 9/10 |
| **Limitation** | ⚠️ GUI application — cannot be scripted headlessly. Requires manual interaction. | ⚠️ MANUAL |

**OVERALL: 7.3/10 — EXCELLENT FOR FACE + HAIR + RIG, WEAK FOR KIMONO + ANIMATION**

**License**: FREE. Pixiv Inc. You own created models. Commercial use permitted. Cannot build competing software.

**Critical insight**: VRoid excels at anime face/hair/rig. But a traditional furisode kimono with sakura patterns would need custom texture work. And animation clips need to come from an external source (Mixamo, Blender, custom).

---

### OPTION 6: Candidate B (Current Procedural Proxy)

| Criterion | Assessment | Score |
|---|---|:---:|
| **Face quality** | Sphere. No face. | 1/10 |
| **Anime style** | No resemblance to anime character. | 1/10 |
| **Topology** | Primitive parametric topology. | 1/10 |
| **Hair** | Cones and cylinders. | 1/10 |
| **Clothing (kimono)** | Tapered cylinder. | 1/10 |
| **Facial rig** | 18 named morphs on a sphere. 2.2% vertex affect. | 1/10 |
| **Humanoid rig** | 0 bones. No skeleton. | 0/10 |
| **Animation support** | Single-track group rotations. Not real animation. | 1/10 |
| **Texture quality** | Flat PBR colors. No textures. | 1/10 |
| **Consistency** | Deterministic (scripted). | 10/10 |
| **Licensing** | N/A — created in-project. | ✅ CLEAR |
| **Export quality** | Valid GLB container. | 5/10 |
| **Web suitability** | Loads in Three.js. | 5/10 |

**OVERALL: 2.2/10 — REJECTED AS PRODUCTION CHARACTER**

**Verdict**: Candidate B **CANNOT** genuinely become Hana. Its only value is as a naming/architecture reference.

---

## 2. Recommendation Matrix

| Approach | Total Score | Facial Quality | Rig Quality | Animation | Feasibility |
|---|:---:|:---:|:---:|:---:|:---:|
| **Blender Portable** | 8.7 | 7 | 10 | 10 | ✅ |
| **VRoid Studio** | 7.3 | 9 | 9 | 3 | ✅ |
| **Tripo3D** | 5.5 | 7 | 7 | 6 | ⚠️ |
| **Meshy AI** | 4.5 | 6 | 6 | 6 | ⚠️ |
| **Rodin AI** | 4.5 | 7 | 0 | 0 | ⚠️ |
| **Candidate B** | 2.2 | 1 | 0 | 1 | ✅ |

---

## 3. RECOMMENDED STRATEGY

### Primary: VRoid Studio + Blender Portable (Hybrid)

```
VRoid Studio (manual, GUI)
  → Create anime face, hair, body, eyes
  → Export VRM
        ↓
Blender Portable (scripted, headless)
  → Import VRM
  → Customize kimono texture (sakura patterns)
  → Add accessories (cap, wand, earrings, obi details)
  → Create/refine facial morph targets (shape keys)
  → Add bones for hair physics, sleeve physics, tassel
  → Create 14 animation clips with multi-bone keyframes
  → Optimize mesh for web (decimate, merge, atlas)
  → Export final GLB with existing naming convention
```

**Why this hybrid**:
- VRoid produces the BEST anime face + hair + base rig (score 9-10)
- Blender fills VRoid's gaps: custom clothing, animations, morph refinement, GLB optimization
- Both tools are FREE with clear commercial licensing
- VRoid is GUI (requires manual interaction by user)
- Blender can be scripted headlessly after VRoid base is ready

### Fallback: Blender Portable Only

If VRoid is not acceptable (requires GUI interaction), Blender alone can produce the entire character via Python scripting:
- bmesh for face topology
- Subdivision Surface for smooth anime faces
- UV unwrap + texture painting
- Full armature + shape keys + animation
- Direct GLB export

This is lower quality for anime face/hair than VRoid but fully automatable.

### Secondary: AI-Assisted Base (Rodin/Tripo) + Blender

Use an AI service to generate a base mesh from the 2D reference, then refine in Blender:
- Faster initial geometry
- Quality depends on AI output
- Still needs Blender for rig, morphs, animation

---

## 4. Phase D Verdict: Candidate B

**REJECTED** as production base.

Candidate B's only salvageable elements:
- ✅ 22-submesh naming convention → preserved as naming spec
- ✅ 18 morph target dictionary → preserved as morph naming spec
- ✅ 14 animation clip names → preserved as animation naming spec
- ✅ 9 material hex values → preserved as color spec

Everything else must be rebuilt from real geometry.

---

## 5. Next Steps Required

1. **Install Blender Portable** — Required for ANY production path
2. **Decide on VRoid vs Blender-only** — VRoid needs user's manual GUI interaction
3. **Begin face prototype** — Phase H (highest priority)
4. **Iterate until face matches Hana** — Stop and revise if face doesn't match
