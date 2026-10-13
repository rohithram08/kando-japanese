# HANA-SENSEI — EMERGENCY VISUAL & PRODUCT RECONSTRUCTION AUDIT

**Audit Date**: 2026-08-30  
**Audit Mode**: Forensic Visual Analysis, Root Cause Investigation, Architecture Reconstruction  
**Status**: ACTIVE AUDIT — STRICTLY NO CODE MODIFICATIONS DURING AUDIT

---

## PART 1 — CURRENT SCREENSHOT FORENSIC ANALYSIS (PIXEL & COMPOSITION LEVEL)

Analyzing the current rendered implementation vs. the application layout reveals deep compositional, hierarchical, and visual flaws:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CURRENT IMPLEMENTATION ANATOMY                                   │
├───────────────────────────────┬──────────────────────────────────────────────────────────────┤
│ Metric / Dimension            │ Forensic Observation & Defect Identification                 │
├───────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ **Character Size**            │ **Critically Undersized** (~140px height inside viewport).    │
│ **Character Framing**         │ **Suffocated in a tiny banner box** (h-36 / 144px).          │
│ **Character Visibility**      │ **Hidden inside chat widget**. Minimized to 64px floating orb│
│ **Character Crop**            │ Truncated at mid-chest. No lower body, sleeves, or wand base.│
│ **Character Position**        │ Trapped at the top of a cramped floating right-hand modal.   │
│ **Panel Dimensions**          │ Width: 420px (Desktop), Height: 580px (Cramped vertical box).│
│ **Panel Layering / Z-Index**  │ Floating modal (`z-[100]`) occluding the user's dashboard.   │
│ **Border Density**            │ Excessive nested borders (`border`, `border-b`, `border-t`). │
│ **Background & Lighting**     │ Flat Three.js canvas over a generic greyish-dark background. │
│ **Spacing & Typography**      │ Tight padding, small text (11px–14px), dense vertical stack. │
│ **Button Density**            │ 5 header icons crowded into top-right of the small card.     │
│ **Chat Proportions**          │ Chat history gets only ~250px vertical scrollable height.    │
│ **Avatar Representation**     │ 2D fallback image inside 3D canvas box; no 3D presence.      │
│ **Dashboard Interference**    │ Covers right-side dashboard widgets, review cards, and stats.│
│ **Visual Hierarchy**          │ Character is a secondary header decoration, not the hero.   │
│ **Empty Space Distribution**  │ Wasted margins outside the panel; claustrophobic interior.   │
│ **Error State Display**       │ Shows fallback connection failure text in chat history.      │
└───────────────────────────────┴──────────────────────────────────────────────────────────────┘
```

### Key Pixel & Spatial Defects:
1. **The "Chatbot Widget Trap"**: The character is crammed into a tiny 144px header box inside a floating modal. Instead of feeling like a living teacher inside a Japanese learning sanctuary, she feels like a standard Intercom/Zendesk customer support widget pasted onto a website.
2. **Extreme Occlusion**: When open, the 420×580px panel completely blocks the user's dashboard view, forcing a trade-off between interacting with Hana and seeing study progress.
3. **Severe Character Truncation**: Only the top 20% of the character is visible. The furisode kimono drape, the plum obi bow, the Japanese room setting, and the full magical sakura wand are completely cropped out.
4. **Visual Disconnect**: The background is a generic Three.js gradient with floating petals inside a small rectangular box, disconnected from the dashboard's design language.

---

## PART 2 — TARGET SCREENSHOT DECOMPOSITION (IMAGE 2 / TARGET)

Deconstructing the approved target design (`media_1788068460550.jpg`):

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       TARGET MASTER COMPOSITION (100% SCALE)                                 │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────────────────┤
│ LEFT NAV (18%)    │ CENTER HERO AREA (52%)                       │ RIGHT SIDEBAR (30%)                       │
│ • NihonGo Logo    │ • HERO HANA-SENSEI (Full 3D Character)       │ • User Profile (Yuki Tanaka Level 15)     │
│ • Dashboard       │   Occupies entire left half of center stage  │ • Daily Reminder Card + Winking Chibi     │
│ • Lessons         │ • Primary Floating Speech Bubble (Top)       │ • Your Progress (Level 15, Streak 127)    │
│ • Vocabulary      │ • Integrated Glassmorphic Chat (Center)      │ • "What shall we study today?" Action List│
│ • Kanji           │   - User & Sensei Message Cards              │   - Reading Practice, Vocabulary,         │
│ • Reading         │   - Quick Suggestion Pills (Yes/Show me)     │     Kanji Study, Listening (Drama)        │
│ • SRS Review      │   - Modern Pill Input with Voice Mic         │                                           │
│ • Quiz / Drama    │ • Bottom Category Shelf (7 Learning Badges)  │ • Bottom Right Floating Active Avatar     │
│ • ★ AI SENSEI ★   │ • Bottom Left "Start Tour" Floating Card     │   (AI Sensei Online Badge)                │
└───────────────────┴──────────────────────────────────────────────┴───────────────────────────────────────────┘
```

### 17-Point Structural Breakdown:
1. **Global Composition**: A dedicated full-page experience (`/sensei` / AI Sensei active in main navigation) with an immersive dark Japanese dojo/study backdrop.
2. **Character Scale & Staging**: Hana-sensei is the **central visual anchor**, rendered in high resolution from the knees up, occupying ~45% of the central viewport width (~600px tall).
3. **Character-to-Environment Integration**: Hana stands inside a warm, softly lit traditional Japanese study room with wooden shoji screens, soft ambient lanterns, and gentle floating sakura petals.
4. **Primary Speech Bubble**: Large, prominent speech bubble above the chat with a soft sakura icon header: *"Konnichiwa! 🌸 I'm your AI Sensei! Let's make learning fun, effective and magical! ✨"*.
5. **Chat Interface**: Centered glassmorphic container with deep purple/navy translucency, subtle border glows, and rich typography.
6. **Rich Response Cards**: Sensei responses are structured with custom sakura bullet points, markdown bolding, and conversational questions.
7. **Interactive Quick Actions**: Contextual response pills (`💡 Yes!`, `💡 Show me`, `💡 Not now`) right above the input bar.
8. **Input Bar**: Rounded pill input with integrated microphone icon for voice input and glowing purple send button.
9. **Daily Reminder Card**: Dedicated top-right widget with a winking chibi Hana holding her wand and a high-contrast *"Start Learning ✨"* CTA button.
10. **Progress Card**: Integrated Level 15 XP progress bar, 127 Day Streak counter, 2,450 Words Learned, and 89% Accuracy badge.
11. **Study Selector**: Direct interactive cards for Reading, Vocabulary, Kanji, and Drama.
12. **Bottom Capability Shelf**: Horizontal glass bar featuring 7 interactive badges: Reading, Vocabulary, Kanji, SRS Review, Quiz, Study Plan, Motivation.
13. **Start Tour Card**: Fixed bottom-left card with a cute mini Hana holding her wand to welcome new learners.
14. **Persistent Status Badge**: Bottom-right circular avatar with a green "Online" pulsating indicator.
15. **Lighting & Atmosphere**: Warm key light from the front-left illuminating Hana's face, soft pink rim light from the wand, and subtle depth-of-field blur on the background shoji screens.
16. **Color Harmony**: Deep midnight navy background (`#0d0b18`), soft plum containers (`#1e1633`), vibrant purple accents (`#7c3aed`), pastel pink sakura highlights (`#f472b6`), and golden wand luminescence (`#fbbf24`).
17. **Typography & Readability**: Clean modern sans-serif paired with Japanese font weights, high contrast text (>7:1 ratio), and generous letter-spacing.

---

## PART 4 — ROOT CAUSE ANALYSIS & RANKING

Why does the current implementation look so far from the target?

```
┌──────┬──────────────────────────────────────────┬────────────────────────────────────────────────────────────┐
│ Rank │ Root Cause Category                      │ Technical & Structural Mechanism                           │
├──────┼──────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
│  1   │ **F. Wrong UI Architecture**             │ Built as a floating overlay widget rather than a dedicated │
│      │                                          │ full-page Sensei learning environment.                     │
│  2   │ **A. Missing 3D Asset**                  │ No rigged GLB exists; falling back to a static 2D image.   │
│  3   │ **D. Wrong Character Scale & Camera**    │ Camera zoomed too tight; viewport confined to 144px box.   │
│  4   │ **E. Wrong Scene Composition**           │ Lacks the Japanese study room, shoji screens, and staging. │
│  5   │ **G. Wrong Layout & Dashboard Conflict** │ Floating modal blocks dashboard instead of coexisting.     │
│  6   │ **J/K. AI Runtime & Auth Failure**       │ LLM/API route throwing error, producing connection banner. │
│  7   │ **H. Wrong CSS & Styling**               │ Generic Tailwind border box instead of rich glassmorphism. │
│  8   │ **L. Wrong Fallback Strategy**           │ Shows a crude "Asset Pending" badge inside canvas.         │
└──────┴──────────────────────────────────────────┴────────────────────────────────────────────────────────────┘
```

---

## PART 5 — PRODUCTION CHARACTER PIPELINE DECISION

We explicitly reject procedural Three.js math geometry (`PlaceholderSensei.tsx`).

### Pipeline Evaluation:
1. **Generative AI 3D (Meshy/Tripo/Rodin)**: ❌ **REJECTED**. Produces non-manifold geometry, warped faces, no eye/mouth blendshapes, and broken UV seams.
2. **VRM / @pixiv/three-vrm**: ❌ **REJECTED**. Unnecessary runtime overhead, restrictive SpringBone physics on furisode sleeves, lack of rigid prop sockets for wand and mortarboard cap.
3. **2D Live2D / Spine**: ⚠️ **VIABLE 2D ALTERNATIVE**, but limits 3D camera staging, interactive 3D wand pointing, and lighting transitions.
4. **VRoid Studio 1.26+ $\rightarrow$ Blender 4.x $\rightarrow$ Draco GLB**: ✅ **BEST RAPID & SOLO PIPELINE**. Base anime head and topology sculpted in VRoid, exported to Blender for custom kimono sleeves, obi musubi bow, mortarboard cap, and wand modeling, baked with 14 animation clips.
5. **Bespoke Blender 4.x Anime Character**: 🌟 **HIGHEST PRODUCTION QUALITY**. 100% visual match to target reference.

**Final Locked Target**: `public/models/hana-sensei.glb` (Standard glTF 2.0 Binary with Draco compression).

---

## PART 6 — UI ARCHITECTURE RECONSTRUCTION

### The Core Problem:
The application treated AI Sensei as a **secondary floating chatbot modal** attached to other pages, whereas the target design is a **first-class dedicated learning experience (`/sensei`)** alongside a lightweight floating companion when navigating other routes.

### The Hybrid Master Architecture:
```
                               ┌─────────────────────────────────────────┐
                               │       NIHONGO MASTER APPLICATION        │
                               └────────────────────┬────────────────────┘
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      ▼                                                           ▼
         [PRIMARY: /sensei DEDICATED PAGE]                           [SECONDARY: COMPANION MODE]
• Full-screen immersive Japanese study room                 • Minimal 64px floating mascot on /dashboard,
• Hana-sensei rendered large (600px hero height)              /lessons, /kanji, /review, /drama
• Integrated glassmorphic chat & quick pills                • Non-intrusive speech bubble recommendations
• Daily reminder, Progress stats, & Study selectors         • Quick click opens side drawer or redirects
• Bottom 7-badge learning capability shelf                  • Zero dashboard occlusion
• Start tour and onboarding hub
```

---

## PART 7 — CONNECTION FAILURE ROOT CAUSE INVESTIGATION

The visible runtime error: *"Sorry, my connection is a bit fuzzy right now! 🌸"* occurs because:

1. **Frontend `sendMessage` in `src/store/senseiStore.ts`**:
   Calls `senseiApi.chat(message)` inside a `try/catch` block. Any non-200 HTTP response or unhandled rejection automatically triggers the fallback message.
2. **Backend Route `POST /api/sensei/chat` in `backend/src/routes/sensei.ts`**:
   - Uses `requireAuth` middleware. If the user session cookie/token is absent or expired, it rejects with 401 $\rightarrow$ frontend catch block triggers error.
   - `aiLimiter` rate-limiter can block frequent test messages.
3. **Backend Service `senseiService.ts`**:
   - Calls `https://api.groq.com/openai/v1/chat/completions` using `process.env.GROQ_API_KEY`.
   - If `GROQ_API_KEY` is not defined in the local `.env`, Groq returns 401/400 $\rightarrow$ route throws 500 $\rightarrow$ frontend triggers fallback error.
   - `response_format: { type: "json_object" }` combined with `tools: [...]` in Groq API can cause 400 Bad Request if the Groq model does not support simultaneous tools and JSON schema mode.
4. **Fix Strategy**:
   - Decouple JSON output prompt from Groq tool-calling, ensure robust auth error handling, validate `GROQ_API_KEY` at startup, and return structured fallback messages without breaking the conversation state.

---

## PART 8 — CHARACTER ASSET REALITY CHECK

* **File Check**: `public/models/hana-sensei.glb` does **NOT exist** on disk (0 bytes).
* **Current State**: The application is rendering a 2D fallback JPG (`sensei-avatar-fallback.jpg`) wrapped inside an `ErrorBoundary`.
* **Discipline Rule**: Under no circumstances should the software be described as "having a finished 3D AI Sensei". The 2D fallback is strictly an engineering placeholder until a valid GLB is delivered.

---

## PART 9 — RESPONSIBILITY SPLIT

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
│ ANTIGRAVITY (AI ASSISTANT) CAN DO    │ PROJECT OWNER / DEVELOPER MUST DO    │ 3D ARTIST / PIPELINE MUST DO         │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ • Build full /sensei page layout     │ • Provide valid GROQ_API_KEY in .env │ • Create 3D mesh in Blender/VRoid    │
│ • Build glassmorphic chat & cards    │ • Test user login and authentication │ • Model kimono, obi bow, cap, wand   │
│ • Implement Three.js lighting/scene  │ • Approve visual milestone reviews   │ • Rig skeleton & 5-finger hands      │
│ • Implement 14-state animation hook  │ • Place hana-sensei.glb in models/   │ • Sculpt 15 blendshape morph targets │
│ • Implement multi-tier lip-sync hook │                                      │ • Author 14 animation clips @ 30 FPS │
│ • Connect backend RAG & Groq API     │                                      │ • Export Draco-compressed GLB file   │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┘
```
