# HANA-SENSEI: FINAL 3D ASSET SPECIFICATION
*(For External Art Team / 3D Pipeline)*

## 1. Project Overview
* **Character**: Hana-sensei (花先生), an AI Japanese-learning companion.
* **Target Engine**: React Three Fiber / Three.js (Web).
* **Final Format**: `.glb` (GLTF Binary).
* **Compression**: Draco compression REQUIRED on geometry.
* **Size Budget**: ≤ 3.5 MB total.
* **Polygon Budget**: ≤ 25,000 triangles.

## 2. Visual & Stylistic Requirements
* **Style**: High-quality, semi-realistic anime (similar to modern premium gacha games or VTubers). NOT hyper-realistic, NOT chibi.
* **Face**: Soft oval, large expressive brown/amber eyes, dark brown hair with straight bangs and side-swept framing strands. Hair cascades past waist.
* **Clothing**: Purple/lavender Furisode (long-sleeved) kimono. Sakura (cherry blossom) pattern over the fabric. Dark navy/plum Obi belt with large back bow (musubi). Gold trim.
* **Headwear**: Navy academic mortarboard (graduation cap) with golden tassel and small pink sakura pinned to the edge. Must look physically attached.
* **Prop**: Golden magical teaching wand held in right hand. Tip features a floating golden ring enclosing a glowing pink sakura flower.

## 3. Rigging Requirements
* **Skeleton**: Standard humanoid skeleton (Mixamo/Unreal compatible base).
* **Fingers**: Fully articulated fingers required for precise pointing and wand gripping.
* **Prop Bones**: 
  * `bone_wand` (Parented to right hand, adjustable).
  * `bone_cap` (Parented to head).
* **Physics/Dynamic Bones**: (These will be animated procedurally or via pre-baked clips, but bones must exist).
  * Hair (Front bangs, side framing, long back hair).
  * Kimono Sleeves (Furisode drapes).

## 4. Facial System (Custom Blendshapes / Morph Targets)
Do NOT use a generic 52-shape ARKit map. The face must be modeled with these 14 specific stylized anime blendshapes:

**Eyes:**
1. `blink_L` (Left eye closed)
2. `blink_R` (Right eye closed)
3. `eyes_wide` (Surprised/alert)
4. `eyes_happy_arch` (Classic anime ^ ^ smiling eyes)

**Brows:**
5. `brow_angry` (Slanted inward)
6. `brow_sad` (Slanted outward, concerned)
7. `brow_surprised` (Raised high)

**Mouth (Emotions):**
8. `mouth_smile` (Closed happy curve)
9. `mouth_sad` (Closed sad curve)
10. `mouth_open_wide` (Surprise/celebration)

**Mouth (Lip Sync / Visemes):**
11. `vowel_A` (Wide open, neutral shape)
12. `vowel_I` (Wide flat, showing teeth slightly)
13. `vowel_U` (Puckered)
14. `vowel_O` (Rounded)

## 5. Required Animation Clips (Baked into GLB)
The `.glb` must contain the following named animation clips (Tracks) in its `animations` array. Frame rate should be 30 FPS.

1. **`idle`** (Loop): Gentle breathing, slight weight shift, subtle wand idle.
2. **`greeting`** (Play Once): Raising left hand, friendly wave, slight head tilt.
3. **`talking`** (Loop): Small, rhythmic hand gestures, shifting weight.
4. **`thinking`** (Loop): Left hand touches chin, head tilted, looking slightly up.
5. **`teaching`** (Loop): Wand raised, presenting toward the user.
6. **`pointing`** (Hold/Loop): Extending the wand straight forward/diagonally.
7. **`encouraging`** (Loop): Both hands clasped near the chest, slight leaning forward.
8. **`celebrating`** (Play Once): Quick joyful jump, wand raised high, big smile.
9. **`confused`** (Loop): Head tilt, slight shoulder shrug.
10. **`listening`** (Loop): Leaning in slightly, still, attentive.
11. **`sleeping`** (Loop): Head drooped forward, slow deep breathing.
12. **`error`** (Loop): Slouched slightly, looking down, concerned.

## 6. Textures & Materials
* **Shading**: Use standard PBR materials, but paint the albedo textures in a stylized, hand-painted anime aesthetic (often called "Guilty Gear" style or unlit/shadeless stylized PBR). 
* **Atlas**: Consolidate into a single 2048x2048 Diffuse atlas if possible.
* **Emissive**: The wand's sakura center should map to an emissive channel to allow post-processing glow in Three.js.
* **Format**: Compress textures internally to KTX2 or WebP format for web delivery.

## 7. Deliverables Checklist
- [ ] `hana-sensei-source.blend` (The master Blender file with all modifiers unapplied).
- [ ] `hana-sensei.glb` (The final exported, Draco-compressed web asset).
- [ ] Texture source files (.png or .psd).
