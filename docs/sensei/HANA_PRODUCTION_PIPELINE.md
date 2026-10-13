# Hana-sensei Production Pipeline & Architecture

This document defines the final engineering and artistic architecture for the Hana-sensei AI companion.

## 1. Final Decision Summary

1. **Recommended Character Pipeline**: Pipeline C (Custom Blender Model) if budget allows, falling back to Pipeline A (VRoid + Blender editing) for speed.
2. **Recommended Tools**: Midjourney/Niji (Concept) → Blender (Modeling, Rigging, Animation) → Substance Painter (Texturing).
3. **Recommended Canonical Asset Format**: `.glb` (GLTF Binary). It is the most robust, performant web standard, supports Draco compression, and handles custom props (wand, cap) better than rigid VRM.
4. **Recommended Animation Format**: Pre-authored animation clips baked into the `.glb` file, played via Three.js `AnimationMixer`.
5. **Recommended Facial System**: Custom Morph Targets (Blendshapes). 
6. **Recommended Lip-Sync System**: Real-time Web Audio API amplitude analysis driving the Jaw/Mouth blendshapes (anime flap-sync style).

## 2. Facial System Design

Hana will use a custom blendshape (morph target) system instead of full ARKit mapping (which is overkill for stylized anime).

**Minimum Blendshape Requirements (14 shapes):**
* **Eyes**: `blink_L`, `blink_R`, `eyes_wide`, `eyes_happy_arch`
* **Brows**: `brow_angry`, `brow_sad`, `brow_surprised`
* **Mouth (Emotion)**: `mouth_smile`, `mouth_sad`, `mouth_open_wide`
* **Mouth (Lip Sync / Visemes)**: `vowel_A`, `vowel_I`, `vowel_U`, `vowel_O`

## 3. Body Animation System

**Architecture**: Pre-authored animation clips + Blending. Procedural animation should ONLY be used for physics (hair/sleeves) and dynamic head-look.

**Animation Clips (Baked into GLB):**
1. `Idle`: Gentle breathing, slight weight shift. (Loop)
2. `Greeting_Wave`: Raising hand, waving. (Once -> Idle)
3. `Talking_Explain`: Small hand gestures. (Loop)
4. `Thinking`: Hand to chin, head tilt. (Loop)
5. `Teaching_Wand`: Raising wand, presenting. (Loop)
6. `Pointing`: Extending wand forward. (Hold)
7. `Encouraging`: Both hands clasped near chest. (Loop)
8. `Celebrating`: Quick jump, hands up. (Once -> Idle)
9. `Confused`: Head tilt, shoulder shrug. (Loop)
10. `Listening`: Leaning in slightly. (Loop)
11. `Sleeping`: Head drooped, slow breathing. (Loop)
12. `Error`: Slouched, looking down. (Loop)

**Transitions**: Three.js `AnimationMixer.crossFadeTo()` will handle smooth 0.2s blending between these states, eliminating snapping.

## 4. Lip Sync Pipeline

**Chosen Method**: Browser Audio Analysis (Amplitude/Frequency based flap-sync).

**Why**: Web Speech API timing events (`onboundary`) are notoriously inconsistent across browsers (especially Safari/iOS). Heavy ML tools like Audio2Face are too heavy for web runtime. 

**Pipeline**:
1. Trigger TTS audio playback via `audioService`.
2. Hook `audioService` to a Web Audio API `AnalyserNode`.
3. In the R3F `useFrame` loop, read the frequency/amplitude data.
4. If volume > threshold, interpolate the `vowel_A` (open mouth) blendshape weight up.
5. If volume < threshold, interpolate weight to 0.
6. Randomly interject `vowel_I` or `vowel_O` on volume spikes to simulate varied phonemes.
*Result*: Snappy, low-latency anime-style lip sync that works perfectly in-browser.

## 5. Web Optimization Budgets

To ensure NihonGo Master's performance is not degraded, the asset MUST strictly adhere to:

* **Polygon Count**: < 25,000 triangles.
* **Texture Resolution**: 1x 2048x2048 Atlas (Diffuse), 1x 1024x1024 (Emissive/Wand).
* **Texture Format**: KTX2 or WEBP (baked into GLB).
* **Compression**: Draco compression applied to the GLB geometry.
* **Target File Size**: < 3.5 MB total over the wire.
* **Memory Budget**: < 50 MB VRAM.
* **Framerate Target**: 60 FPS (Desktop), 30-60 FPS (Mobile).
* **JS Bundle**: Lazy-load the `@react-three/fiber` and model components only when the user interacts or after the main dashboard renders.

## 6. Asset File Structure

Maintain the following structure in the project/repository:
* `_source/hana-master.blend`: The canonical Blender file (kept in Git LFS or external drive, NOT in the web repo).
* `public/models/hana-sensei.glb`: The optimized, Draco-compressed web asset.

## 7. Responsibility Division (AI vs. Code)

| Domain | Handled By | Implementation |
| :--- | :--- | :--- |
| **Character Concept** | Generative AI | Midjourney/Niji to create turnaround sheets. |
| **3D Modeling & Textures** | Human Artist | Blender, Substance Painter. |
| **Rigging & Blendshapes** | Human Artist | Blender. |
| **Motion/Animations** | Human Artist | Blender NLA Editor. |
| **Rendering & Lighting** | Code | React Three Fiber, Three.js shaders. |
| **State Machine & Logic** | Code | Zustand (`senseiStore.ts`). |
| **Emotion Selection** | Code (LLM) | Groq LLaMA returns structured `{emotion: "happy"}`. |
| **Lip Sync** | Code | Web Audio API analyzer. |
| **UI Interaction (Drag, Chat)**| Code | Framer Motion, React. |
| **Knowledge (RAG)** | Code | Backend TiDB / JSON embeddings. |

## 8. Final Recommended AI Character Pipeline

```
[1] CONCEPT PHASE
    Midjourney Niji 6 → Generate Character Bible & Turnarounds
           ↓
[2] MODELING PHASE
    Blender → Model low-poly mesh (≤25k tris)
    Substance Painter → Bake sakura patterns & textures (2K)
           ↓
[3] RIGGING PHASE
    Blender → Humanoid Skeleton + Custom bones for Wand/Sleeves
    Blender → Sculpt 14 core facial blendshapes
           ↓
[4] ANIMATION PHASE
    Blender NLA Editor → Bake 12 animation clips
           ↓
[5] OPTIMIZATION
    gltf-pipeline → Apply Draco compression + KTX2 textures
           ↓
[6] DEPLOYMENT
    Export to public/models/hana-sensei.glb
           ↓
[7] ENGINE INTEGRATION
    R3F + AnimationMixer + Web Audio LipSync
```
