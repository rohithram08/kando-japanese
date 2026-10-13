# HANA-SENSEI — FINAL PRODUCTION REBUILD PLAN & ACCEPTANCE GATE

**Document Version**: 1.0.0  
**Status**: STRATEGIC RECONSTRUCTION PLAN  
**Pre-condition**: Strictly NO CODE MODIFICATIONS until this plan is reviewed and explicitly approved by the Project Owner.

---

## 1. Master Reconstruction Plan (10 Distinct Phases)

This plan outlines the exact roadmap to transition NihonGo Master from the current prototype state to the target commercial design (`media_1788068460550.jpg`).

```
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                               MASTER REBUILD ROADMAP OVERVIEW                                 │
├─────────┬───────────────────────────────────┬─────────────────────────────────────────────────┤
│ Phase   │ Focus Area                        │ Core Deliverables & Milestones                  │
├─────────┼───────────────────────────────────┼─────────────────────────────────────────────────┤
│ Phase 1 │ **AI Runtime & Connection Fix**   │ Fix Groq JSON schema / tools conflict & auth    │
│ Phase 2 │ **Dedicated `/sensei` Page & UI** │ Build full-page 3-column layout matching target │
│ Phase 3 │ **Hana 3D Asset Production**      │ Produce rigged GLB in Blender/VRoid pipeline    │
│ Phase 4 │ **3D Staging & Character Setup**  │ Stage Hana in Japanese study room with lights   │
│ Phase 5 │ **Animation Integration (14)**    │ Wire up 14 baked animation clips in Three.js    │
│ Phase 6 │ **Voice & Lip-Sync Engine**       │ Wire multi-tier viseme & audio synchronization  │
│ Phase 7 │ **Teaching & Pointing Actions**   │ Implement wand gestures & context highlights    │
│ Phase 8 │ **Onboarding & Guided Tour**      │ Implement "Start Tour" card & walkthrough flow  │
│ Phase 9 │ **Daily Planner & Progress Sync** │ Connect Daily Reminder & "What to study today"  │
│ Phase 10│ **Visual QA & Mobile Polish**     │ 24-state regression test & responsive tuning    │
└─────────┴───────────────────────────────────┴─────────────────────────────────────────────────┘
```

---

### Phase 1: Fix AI Runtime & Connection Robustness
* **Objective**: Eliminate *"Sorry, my connection is a bit fuzzy right now! 🌸"* completely.
* **Tasks**:
  1. Audit `backend/src/services/senseiService.ts` Groq completions call.
  2. Decouple JSON output parsing from tool-calling if the model rejects simultaneous parameters.
  3. Add robust validation for `GROQ_API_KEY` and graceful fallback responses with rich educational markdown.
  4. Verify authentication cookie persistence across all sensei routes (`/chat`, `/history`, `/tour`).

### Phase 2: Dedicated `/sensei` Page & Layout Reconstruction
* **Objective**: Replace the cramped floating widget with a full commercial Japanese learning sanctuary.
* **Tasks**:
  1. Add `/sensei` to React Router in `src/App.tsx`.
  2. Highlight `AI Sensei` tab in the left navigation sidebar.
  3. Build the **3-column master layout**:
     - Left: Main Navigation + Fixed "Start Tour" card with mini Hana.
     - Center: Hero 3D character stage + Top Hero Speech Bubble + Glassmorphic Chat + Bottom 7-badge capability shelf.
     - Right: Daily Reminder Card (winking chibi Hana) + Progress Stats + "What shall we study today?" list.
  4. Retain a minimal, non-intrusive 64px floating mascot on other routes (`/dashboard`, `/lessons`, `/review`) that clicks through to `/sensei`.

### Phase 3: Produce Real Hana 3D Asset
* **Objective**: Create the physical `public/models/hana-sensei.glb` file matching canonical specifications.
* **Tasks**:
  1. Execute **Pipeline C** (Custom Blender 4.x) or **Pipeline A** (VRoid Studio 1.26+ + Blender).
  2. Sculpt face, waist-length dark chocolate brown hair with straight bangs, lavender/violet furisode kimono, plum obi with rear butterfly bow, navy mortarboard cap tilted 5°, and 45cm golden sakura wand.
  3. Rig with standard humanoid armature, articulated 5-finger hands, sleeve chains, and wand attachment bone.
  4. Author 15 shape keys (11 semantic expressions + 5 Japanese vowels A, I, U, E, O).
  5. Export Draco-compressed GLB ($\le 24\text{k tris}$, $\le 3.2\text{ MB}$, 2 draw calls).

### Phase 4: 3D Staging & Environmental Rendering
* **Objective**: Seamlessly stage Hana in an atmospheric Japanese dojo/study.
* **Tasks**:
  1. In `src/pages/SenseiPage.tsx`, construct the Three.js viewport occupying the left-center stage.
  2. Add warm Japanese study room background (shoji screens, soft lantern lighting, depth-of-field blur).
  3. Configure three-point stage lighting (key warm light, soft lavender fill, golden rim highlight).
  4. Add instanced falling sakura petals floating gently across the scene.

### Phase 5: Animation System Integration (14 Tracks)
* **Objective**: Bring Hana to life with smooth, natural anime gestures.
* **Tasks**:
  1. Load all 14 animation clips via `@react-three/drei`'s `useAnimations`:
     - `idle`, `greeting`, `waving`, `talking`, `thinking`, `happy`, `encouraging`, `confused`, `celebrating`, `teaching`, `pointing`, `listening`, `error`, `sleeping`.
  2. Implement 0.25s cross-fades between animation states based on conversational intent.
  3. Wire the Expression Controller to blend facial morph targets synchronously with gestures.

### Phase 6: Voice, TTS & Lip-Sync Engine
* **Objective**: Natural Japanese speech paired with synchronized mouth movement.
* **Tasks**:
  1. Connect `audioService.ts` to trigger speaking state with female Japanese voice priority (`ja-JP`).
  2. Implement Multi-Tier Lip-Sync:
     - Tier 1: Phoneme/Viseme boundary events driving `vowel_a`, `vowel_i`, `vowel_u`, `vowel_e`, `vowel_o`.
     - Tier 2: Audio amplitude envelope fallback.
     - Tier 3: Procedural Japanese mora cadence.
  3. Provide interactive audio controls (mute, volume slider, speech stop button).

### Phase 7: Teaching & Pointing Interactions
* **Objective**: Active contextual mentor interactions.
* **Tasks**:
  1. Enable `guideTo(targetId, message)` to aim Hana's wand at specific UI elements.
  2. Highlight targeted cards with a subtle glowing aura (`sensei-highlighted-target`).
  3. Animate wand sparkles and celebratory confetti upon lesson completion or streak milestones.

### Phase 8: Onboarding & Interactive Tour
* **Objective**: Welcome new users with an unforgettable first impression.
* **Tasks**:
  1. Wire the "Start Tour" card on `/sensei` to trigger the interactive onboarding walkthrough.
  2. Hana guides the student through Dashboard, Lessons, Kanji, SRS Review, and Drama modules.
  3. Persist tour completion in TiDB Cloud (`senseiTourProgress`).

### Phase 9: Daily Planner & Study Recommendations
* **Objective**: Dynamic personalized daily study plans.
* **Tasks**:
  1. Wire the "Daily Reminder" card to calculate user review queues and pending SRS items.
  2. Generate dynamic recommendations based on user JLPT level and recent weak areas.
  3. Enable one-click navigation from study suggestions directly into quiz sessions.

### Phase 10: Final Visual Polish & Cross-Device QA
* **Objective**: Flawless execution across desktop, tablet, and mobile.
* **Tasks**:
  1. Execute the 24-state Visual Regression Matrix (8 states $\times$ 3 viewports).
  2. Ensure responsive drawer transitions and virtual keyboard compatibility on mobile (390×844).
  3. Verify 60 FPS performance on desktop and $\ge 30\text{ FPS}$ on mobile with $< 45\text{ MB}$ VRAM.

---

## 2. Strict 18-Point Acceptance Criteria Gate

The implementation cannot be signed off as complete unless **ALL 18 conditions** are verified with live browser evidence:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        18-POINT MANDATORY COMPLETION CRITERIA                          │
├─────┬───────────────────────────────────────────┬──────────────────────────────────────┤
│ #   │ Verification Item                         │ Acceptance Standard                  │
├─────┼───────────────────────────────────────────┼──────────────────────────────────────┤
│ [ ] │ 1. Reference Character Match              │ Visually matches target reference art│
│ [ ] │ 2. Body Proportions                       │ Symmetrical 6.8-heads-tall anime body│
│ [ ] │ 3. Face & Expressiveness                  │ Recognizable anime face with morphs  │
│ [ ] │ 4. Hair Fidelity                          │ Waist-length dark brown with bangs   │
│ [ ] │ 5. Kimono Authenticity                    │ Lavender/violet furisode with obi bow│
│ [ ] │ 6. Mortarboard Cap & Tassel               │ Navy cap tilted 5° with gold tassel  │
│ [ ] │ 7. Magical Sakura Wand                    │ 45cm gold wand with glowing blossom  │
│ [ ] │ 8. Visual Hierarchy                       │ Hero character occupies 45% center   │
│ [ ] │ 9. Target UI Match                        │ Dedicated 3-column /sensei layout    │
│ [ ] │ 10. Integrated Glassmorphic Chat          │ Dark purple translucent chat panel   │
│ [ ] │ 11. Japanese Voice Synthesis              │ Clear TTS speech with audio controls │
│ [ ] │ 12. 14 Baked Animations                   │ Smooth 60 FPS cross-fading clips     │
│ [ ] │ 13. Interactive Pointing                  │ Wand aims accurately at UI targets   │
│ [ ] │ 14. Teaching Mode                         │ Contextual lessons with sakura bullet│
│ [ ] │ 15. Celebration FX                        │ Confetti and triumphant wand flourish│
│ [ ] │ 16. AI Brain Reliability                  │ 0 connection errors; 100% Groq uptime│
│ [ ] │ 17. Mobile & Tablet Polish                │ Clean responsive layouts (no clipping│
│ [ ] │ 18. Zero Debug Elements                   │ No "Asset Pending" or raw error text │
└─────┴───────────────────────────────────────────┴──────────────────────────────────────┘
```
