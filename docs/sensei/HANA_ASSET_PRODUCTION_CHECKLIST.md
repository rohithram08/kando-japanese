# Hana-sensei Asset Production Checklist

This checklist defines every artistic and technical asset that MUST exist and be validated *before* writing the final React Three Fiber implementation code for the Sensei component.

## Phase 1: Conceptualization
- [ ] **Character Bible Approved** (Personality, dimensions, colors defined)
- [ ] **2D Master Front View** (Neutral pose)
- [ ] **2D Master Side View**
- [ ] **2D Master Back View**
- [ ] **2D Master 3/4 View**
- [ ] **Prop Sheet**: Mortarboard Cap (detailed views)
- [ ] **Prop Sheet**: Magical Wand (detailed views)
- [ ] **Expression Sheet**: Neutral, Happy, Sad, Thinking, Confused, Surprised
- [ ] **Pose Sheet**: Idle, Teaching, Celebrating
- [ ] **Exact Hex Color Palette Finalized**

## Phase 2: 3D Modeling & Texturing
- [ ] **Base Mesh Complete**
- [ ] **Topology Check**: Clean edge loops around eyes and mouth (required for blendshapes)
- [ ] **Topology Check**: Clean grid topology on Kimono sleeves (required for physics/bending)
- [ ] **Polygon Budget Validated**: Mesh is under 25,000 triangles total.
- [ ] **UV Mapping Complete**: Non-overlapping UVs for main body/clothing.
- [ ] **Textures Painted**: Base Color (Diffuse)
- [ ] **Textures Painted**: Emissive map (for Wand glow)
- [ ] **Texture Budget Validated**: 1x 2048x2048 main atlas.

## Phase 3: Rigging & Blendshapes
- [ ] **Skeleton Bound**: Standard humanoid bone structure.
- [ ] **Prop Bones Added**: Wand bone (parented to Right Hand). Cap bone (parented to Head).
- [ ] **Physics Bones Added**: Bones for hair physics. Bones for furisode sleeve physics.
- [ ] **Skin Weights Painted**: No severe clipping when arms are raised.
- [ ] **Eye Blendshapes**: `blink_L`, `blink_R`, `eyes_wide`, `eyes_happy`
- [ ] **Brow Blendshapes**: `brow_angry`, `brow_sad`, `brow_surprised`
- [ ] **Mouth Emotion Blendshapes**: `mouth_smile`, `mouth_sad`
- [ ] **Mouth Viseme Blendshapes**: `vowel_A`, `vowel_I`, `vowel_U`, `vowel_O`

## Phase 4: Animation (Clips)
- [ ] `Idle` loop
- [ ] `Greeting_Wave`
- [ ] `Talking_Explain` loop
- [ ] `Thinking` loop
- [ ] `Teaching_Wand` loop
- [ ] `Pointing` hold
- [ ] `Encouraging` loop
- [ ] `Celebrating`
- [ ] `Confused` loop
- [ ] `Listening` loop
- [ ] `Sleeping` loop
- [ ] `Error` loop

## Phase 5: Export & Optimization
- [ ] **Export Format**: `.glb` (GLTF Binary) selected.
- [ ] **Animations Embedded**: All clips baked into the `.glb` timeline.
- [ ] **Compression Applied**: Draco geometry compression applied.
- [ ] **File Size Check**: Final `.glb` is < 3.5 MB.
- [ ] **Web Validation**: Drag and drop the `.glb` into a web-based GLTF viewer (e.g., [Don McCurdy's GLTF Viewer](https://gltf-viewer.donmccurdy.com/)) to verify textures, blendshapes, and animations play correctly in a browser environment.
