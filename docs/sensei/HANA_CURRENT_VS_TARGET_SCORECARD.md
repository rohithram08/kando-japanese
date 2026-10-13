# HANA-SENSEI — CURRENT VS TARGET 20-SUBSYSTEM SCORECARD

**Document Version**: 1.0.0  
**Audit Mode**: Objective Quantitative & Qualitative Visual Evaluation  
**Scoring Scale**: 0 (Nonexistent / Completely Broken) to 10 (Production-Grade Match with Target)

---

## 1. Comprehensive Subsystem Scorecard

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 20-SUBSYSTEM VISUAL & FUNCTIONAL SCORECARD                                 │
├────┬─────────────────────────────┬───────┬─────────────────────────────────────────────────────────────────┤
│ #  │ Subsystem                   │ Score │ Objective Rationale & Defect Explanation                        │
├────┼─────────────────────────────┼───────┼─────────────────────────────────────────────────────────────────┤
│ 1  │ **Character Mesh**          │  1/10 │ 3D GLB missing. Renders flat 2D fallback JPG via ErrorBoundary. │
│ 2  │ **Character Presentation**  │  2/10 │ Confined to a 144px box in a floating modal; no stage presence. │
│ 3  │ **Face**                    │  3/10 │ 2D image face is pretty but static; no 3D facial depth.         │
│ 4  │ **Hair**                    │  2/10 │ Static 2D crop; no physics, no 3D strand volume or flow.        │
│ 5  │ **Kimono**                  │  2/10 │ Truncated at chest; furisode sleeves and drape invisible.       │
│ 6  │ **Academic Cap**            │  4/10 │ Present in 2D image, but missing 3D tilt, physics, and tassel.  │
│ 7  │ **Magical Wand**            │  1/10 │ Cropped completely out of current chat viewport.                │
│ 8  │ **Lighting & Staging**      │  3/10 │ Basic Three.js stage; missing Japanese room and ambient warmth. │
│ 9  │ **3D Engine Quality**       │  2/10 │ Canvas runs smoothly, but displays no real 3D character asset.  │
│ 10 │ **Character Framing**       │  1/10 │ Severe vertical crop; character is suffocated in header box.    │
│ 11 │ **Chat UI**                 │  4/10 │ Functional chat, but generic SaaS look; lacks target polish.    │
│ 12 │ **Dashboard Integration**   │  3/10 │ Floating modal severely occludes dashboard when open.           │
│ 13 │ **Navigation**              │  4/10 │ Whitelist routing works, but lacks dedicated /sensei nav tab.   │
│ 14 │ **Recommendations**         │  5/10 │ Action chips present, but lack target sakura formatting.        │
│ 15 │ **Speech Bubble**           │  4/10 │ Small toast exists, but lacks target hero speech bubble layout. │
│ 16 │ **Voice UX**                │  5/10 │ Web Speech TTS functional, but prone to browser voice variation.│
│ 17 │ **Animation Engine**        │  2/10 │ Controller logic ready, but 0 clips playing on static fallback. │
│ 18 │ **Emotional Presence**      │  2/10 │ Static facial image cannot convey living teacher personality.   │
│ 19 │ **Learning Integration**    │  6/10 │ RAG knowledge search & TiDB user context working on backend.    │
│ 20 │ **Overall Visual Polish**   │  3/10 │ Huge gap between floating widget and target commercial design.  │
├────┴─────────────────────────────┼───────┼─────────────────────────────────────────────────────────────────┤
│ **OVERALL WEIGHTED AVERAGE**     │**2.95**│ **CRITICAL RECONSTRUCTION REQUIRED BEFORE COMMERCIAL LAUNCH**   │
└──────────────────────────────────┴───────┴─────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Qualitative Breakdown by Subsystem

### 1. Character Mesh (Score: 1/10)
* *Current State*: File `public/models/hana-sensei.glb` does not exist. `SenseiCharacter.tsx` relies on React `ErrorBoundary` to render `sensei-avatar-fallback.jpg`.
* *Target State*: Full 3D rigged character ($<24\text{k tris}$) rendered with PBR textures, soft rim lighting, and subsurface skin scattering.
* *Gap*: 9/10 gap. Complete absence of a physical 3D asset.

### 2. Character Presentation & Staging (Score: 2/10)
* *Current State*: Character is stuffed into a 144px header bar above a chat log inside a 420px wide floating window.
* *Target State*: Hana-sensei stands proudly on the left half of a dedicated `/sensei` environment, rendered from the knees up with a 600px hero height inside a Japanese study room.
* *Gap*: 8/10 gap. Fundamental layout mismatch.

### 3. Face & Expressions (Score: 3/10)
* *Current State*: 2D fallback JPG has a static anime face. No real-time blinking, no eyebrow emotion, no mouth movement.
* *Target State*: 15 morph targets dynamically reacting to conversation state (`happy`, `thinking`, `confused`, `encouraging`, `celebrating`).
* *Gap*: 7/10 gap. Face is completely static.

### 4. Hair & Physics (Score: 2/10)
* *Current State*: 2D cropped hair illustration.
* *Target State*: Voluminous waist-length dark brown hair with straight bangs, side locks, and secondary bone chain physics swaying gently with idle breathing.
* *Gap*: 8/10 gap. No depth or motion.

### 5. Kimono & Textiles (Score: 2/10)
* *Current State*: Only collar visible in crop.
* *Target State*: Lavender-to-royal-violet furisode kimono with pink cherry blossom branch pattern, gold edge piping, layered white inner collar, and plum obi butterfly bow.
* *Gap*: 8/10 gap. 80% of costume is off-screen.

### 6. Academic Mortarboard Cap (Score: 4/10)
* *Current State*: Cap is partially visible in 2D image crop.
* *Target State*: Fitted navy cap tilted 5° right with golden sakura pin and an 18cm gold tassel cascading with secondary bone physics.
* *Gap*: 6/10 gap. Static representation lacking depth and motion.

### 7. Magical Sakura Wand (Score: 1/10)
* *Current State*: Wand is completely off-screen in the avatar crop.
* *Target State*: 45cm golden wand held in right hand with a floating, glowing sakura blossom bloom that sparkles during teaching and celebration actions.
* *Gap*: 9/10 gap. Key prop is entirely absent.

### 8. Lighting & Staging (Score: 3/10)
* *Current State*: Simple 3-point light setup in an empty R3F scene over a gradient sphere.
* *Target State*: Warm ambient illumination evoking a traditional Japanese study at sunset, with soft lantern light, shoji screen depth-of-field, and magic bloom.
* *Gap*: 7/10 gap. Completely lacks environmental atmosphere.

### 9. 3D Engine Quality (Score: 2/10)
* *Current State*: R3F and `@react-three/drei` are configured, but currently display nothing beyond the 2D image overlay.
* *Target State*: 60 FPS WebGL rendering with shadow maps, bloom pass, and smooth camera framing.
* *Gap*: 8/10 gap. Engine is idling without assets.

### 10. Character Framing (Score: 1/10)
* *Current State*: Cramped, awkward square framing inside a narrow floating modal.
* *Target State*: Wide, cinematic composition allowing Hana to breathe and gesture freely across the screen.
* *Gap*: 9/10 gap. Extreme claustrophobic framing.

### 11. Chat UI & Aesthetics (Score: 4/10)
* *Current State*: Functional vertical chat box with generic borders and small message bubbles.
* *Target State*: Dark purple/navy glassmorphic interface with sakura bullet formatting, suggestion pills, and integrated pill input with microphone button.
* *Gap*: 6/10 gap. Feels like standard SaaS rather than a magical anime learning platform.

### 12. Dashboard Integration & Coexistence (Score: 3/10)
* *Current State*: Floating window covers 40% of the dashboard screen when open.
* *Target State*: Dedicated `/sensei` route in main navigation bar + subtle non-blocking floating mascot when browsing lessons.
* *Gap*: 7/10 gap. Destructive screen occlusion.

### 13. Navigation Integration (Score: 4/10)
* *Current State*: Navigation relies on whitelist actions triggered from chat. No dedicated "AI Sensei" tab in the left sidebar.
* *Target State*: "AI Sensei" highlighted as a primary sidebar navigation destination with active purple pill.
* *Gap*: 6/10 gap. Missing top-level navigation placement.

### 14. Recommendation System (Score: 5/10)
* *Current State*: 5 quick action chips along the bottom of the chat box.
* *Target State*: Multi-tiered recommendations: contextual suggestion pills inside chat, right-sidebar "What shall we study today?" list, and bottom 7-badge capability shelf.
* *Gap*: 5/10 gap. Good start, but needs target layout parity.

### 15. Speech Bubble Presentation (Score: 4/10)
* *Current State*: Tiny `SenseiSpeechBubble` toast above floating button.
* *Target State*: Expansive, beautifully styled hero speech bubble anchoring the top of the screen: *"Konnichiwa! 🌸 I'm your AI Sensei!..."*.
* *Gap*: 6/10 gap. Lacks hero visual weight.

### 16. Voice UX & Audio (Score: 5/10)
* *Current State*: Web Speech API integration functional with Japanese voice fallback.
* *Target State*: Smooth audio playback with animated speech indicators, stop button, and synchronous lip-sync cadence.
* *Gap*: 5/10 gap. Audio works, but visual pairing is weak.

### 17. Animation System (Score: 2/10)
* *Current State*: `SenseiGLBLoader` has `useAnimations` wired, but 0 animations play because the 3D model is missing.
* *Target State*: 14 seamless animation clips (idle breathing, greeting, teaching wand point, triumph celebration).
* *Gap*: 8/10 gap. Complete lack of visible motion.

### 18. Emotional Presence & Personality (Score: 2/10)
* *Current State*: Static image with generic text responses.
* *Target State*: Living, breathing companion that smiles, ponders, points, and cheers in sync with the student's progress.
* *Gap*: 8/10 gap. Emotional resonance is near zero.

### 19. Learning Integration & Curriculum Grounding (Score: 6/10)
* *Current State*: Backend RAG search over 1,284 curriculum items, user context injection, and guardrails passing 30/30 test cases.
* *Target State*: Deeply contextual learning explanations paired with animated gesture demonstrations.
* *Gap*: 4/10 gap. Strongest subsystem in the application today.

### 20. Overall Visual Polish (Score: 3/10)
* *Current State*: Looks like an early developer prototype with a floating popup and connection error messages.
* *Target State*: Commercial-grade, beautifully styled, cohesive Japanese learning flagship experience.
* *Gap*: 7/10 gap. Major visual overhaul required.
