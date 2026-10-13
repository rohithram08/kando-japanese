# HANA-SENSEI — ASSET CREATION WORKFLOW & TOOLCHAIN DECISION

**Document Version**: 1.0.0 — CANONICAL LOCK  
**Status**: PRODUCTION PIPELINE GUIDE (CHECKPOINT I)  
**Scope**: 2D Reference Package, Toolchain Evaluation, Primary/Fallback Strategy, Decision Deadlines

---

## 1. Mandatory 2D Reference Package Requirements

Before 3D polygon modeling begins, the artist or toolchain must have the complete **2D Master Reference Package** assembled and approved. 3D modeling without this package is strictly prohibited to prevent anatomical or stylistic drift.

```
                          ┌──────────────────────────────────────┐
                          │     2D MASTER REFERENCE PACKAGE      │
                          │   (Mandatory Pre-Production Asset)   │
                          └──────────────────┬───────────────────┘
                                             │
             ┌───────────────────────────────┼───────────────────────────────┐
             ▼                               ▼                               ▼
    [1. TURNAROUND VIEWS]          [2. FACIAL & EXPRESSIONS]        [3. POSES & PROPS]
• Full Body Front View (T-pose)• Face Close-up (Neutral)      • P1: Pointing with Wand
• Full Body Side View (Profile)• E1: Happy / Rejoice          • P2: Warm Greeting Wave
• Full Body 3/4 View (Hero)    • E2: Thinking / Pondering     • P3: Teaching / Presentation
• Full Body Back View (Obi bow)• E3: Encouraging Smile        • Prop 1: Sakura Wand (Orthographic)
• Orthographic alignment lines • E4: Confused / Inquiring     • Prop 2: Mortarboard Cap & Tassel
                               • E5: Celebrating Triumph      • Prop 3: Obi Musubi Butterfly Bow
```

### Orthographic Alignment Criteria:
* Eye level, chin level, shoulder line, obi belt top/bottom, skirt hemline, and floor line must match with pixel precision across Front, Side, and Back views.
* All colors must strictly match the canonical hex palette defined in `HANA_CANONICAL_CHARACTER_SPEC.md`.

---

## 2. Production Toolchain Evaluation & Comparative Matrix

| Toolchain / Pipeline | Visual Quality | Rig & Animation | Dev Timeline | Unit Cost | Reference Match | Verdict |
|---|---|---|---|---|---|---|
| **Pipeline A: VRoid Studio + Blender** | High (Clean Anime) | Native Humanoid + ARKit Morphs | **3–5 Days** | **$0 (Solo Dev)** | **90%** (Slight VRoid silhouette) | **RECOMMENDED FALLBACK / SOLO DEV** |
| **Pipeline B: AI 3D Mesh (Meshy / Tripo)**| Unusable (Artifacts) | Broken / No Morphs | 1–2 Days | $50/mo | 35% (Hallucinated mess) | ❌ **STRICTLY REJECTED (Unusable)** |
| **Pipeline C: Professional Modeler (Blender)**| **Maximum (100% Studio)**| **Custom Optimized Rig & Morphs**| **2–3 Weeks** | **$400–$900 (Freelance)** | **100% (Exact Match)** | 🌟 **RECOMMENDED PRIMARY PATH** |
| **Pipeline D: AI Concept + 3D Sculptor**| High (95%) | Custom Rigged in Blender | 1–2 Weeks | $300–$500 | 95% | **STRONG SECONDARY PATH** |

---

## 3. Recommended Primary Strategy vs. Rapid Fallback

```
                               ┌─────────────────────────────┐
                               │   PRIMARY PRODUCTION PATH   │
                               │   (Pipeline C: Blender DCC) │
                               └──────────────┬──────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
         [INTERNAL 3D ARTIST]                               [EXTERNAL FREELANCER]
    Using HANA_FINAL_ASSET_HANDOFF.md                  Hired via ArtStation / CGTrader
    Models base, textures, rigs & animates             Deliverables gated by acceptance criteria
                      │                                               │
                      └───────────────────────┬───────────────────────┘
                                              │
                         ┌────────────────────┴────────────────────┐
                         │ Gated by 7-Day Sprint / Progress Check │
                         └────────────────────┬────────────────────┘
                                              │
                          ┌───────────────────┴───────────────────┐
                          │                                       │
                    [ON TRACK]                               [OFF TRACK]
                 Proceed to Gate 8                  Trigger Rapid Fallback (Pipeline A)
                                                    VRoid 1.26 + Blender 4.x (3-Day Turnaround)
```

### Primary Path: Pipeline C (Custom Blender 4.x Production)
* **Objective**: 100% visual parity with approved Hana-sensei concept art.
* **Process**:
  1. Base topology modeled cleanly in quads (subdivision-ready, baked down to 22k tris).
  2. UV unwrap packed tightly into 1x 2048x2048 Diffuse island and 1x 1024x1024 Emissive island.
  3. Armature built with Rigify / standard humanoid, 5-finger articulation, sleeve chains, and wand socket.
  4. Sculpt 15 shape keys covering 11 semantic expressions and 5 visemes.
  5. Author 14 NLA animation tracks at 30 FPS.
  6. Export via Blender glTF 2.0 with Draco compression enabled.

### Rapid Fallback Path: Pipeline A (VRoid Studio 1.26+ + Blender 4.x)
* **Objective**: Deliver a production-grade asset in 3 to 5 days with zero freelance budget.
* **Process**:
  1. Sculpt face, eyes, bangs, and long hair in VRoid Studio matching Hana's facial proportions.
  2. Export VRM with standard 52 ARKit blendshapes and clean humanoid rigging.
  3. Import VRM into Blender 4.x; delete standard clothes.
  4. Model custom Furisode kimono with draping sleeves, plum obi with butterfly musubi bow, mortarboard cap with gold tassel, and magical sakura wand.
  5. Weight-paint custom clothes to the VRoid armature; parent wand to right hand bone.
  6. Bake the 14 required animation clips onto the armature.
  7. Export as `hana-sensei.glb` with Draco compression.

---

## 4. Production Decision Deadlines & Stop Conditions

1. **Kickoff / Handoff**: Project Owner provides `HANA_FINAL_ASSET_HANDOFF.md` and 2D reference package to 3D artist.
2. **Day 4 Milestone (Topology & Rig Review)**: Artist delivers initial `.blend` / turntable video showing T-pose mesh ($<24\text{k tris}$) and skeletal bone hierarchy.
   * *Stop Condition*: If topology is triangulated scan mess or exceeds 28,000 tris, reject immediately.
3. **Day 8 Milestone (Facial Rig & Textures Review)**: Artist demonstrates 15 blendshapes morphing cleanly and PBR textures matching canonical color hex codes.
4. **Day 12 Milestone (Animations & GLB Export)**: Artist delivers all 14 animation clips and final `hana-sensei.glb` file.
5. **Fallback Trigger Deadline**: If Primary Path (Pipeline C) fails to deliver a passing Day 4 or Day 8 milestone, immediately execute Fallback Path (Pipeline A) for guaranteed 72-hour delivery.
