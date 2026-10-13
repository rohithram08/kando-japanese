# AI SENSEI CHARACTER DESIGN SPECIFICATION — NIHONGO MASTER

**Character Name**: Hana-sensei (花先生 / AI Sensei)  
**Role**: Official Japanese Language Mentor, Tour Guide & Learning Companion for NihonGo Master  
**Target 3D File Location**: `public/models/sensei.vrm`  

---

## 1. Visual & Character Identity

### 1.1 Core Concept
Hana-sensei is a warm, charming, and highly knowledgeable female Japanese educator. She is designed with cute anime-inspired proportions, combining traditional Japanese cultural elements with a whimsical, magical educator motif. She embodies encouragement, patience, and scholarly authority without being intimidating or corporate.

### 1.2 Appearance & Costume Specification
- **Gender / Persona**: Female Japanese teacher, friendly, cute, professional, and encouraging.
- **Outfit (Kimono)**:
  - Base Color: Rich royal lavender and soft purple (`#9333ea` / `#a855f7` / `#c084fc`).
  - Accents: White plum / sakura blossom prints, soft golden trim along the collar and obi belt (`#fbbf24`).
  - Sleeves: Flowing traditional kimono sleeves with subtle physics/sway.
- **Headwear (Teacher / Graduation Cap)**:
  - Scholar / Graduation mortarboard cap in deep navy/indigo (`#1e1b4b`).
  - Golden silk tassel hanging gracefully on the side, reacting softly to character motion.
- **Teaching Tool (Magical Wand / Pointer)**:
  - Polished wooden wand tipped with a glowing golden sakura star (`#fbbf24` / `#fef08a`).
  - Used dynamically to point at UI elements (e.g. today's lesson, kanji cards, review button) with sparkling particle trails.
- **Facial Features & Hair**:
  - Eyes: Large, expressive, warm amber/purple eyes.
  - Hair: Neat dark brown / plum hair in a gentle ponytail or bun, suitable for an energetic teacher.
  - Expression: Naturally smiling, approachable, with clear eyebrow and mouth blendshapes for rich pedagogical emotions.

---

## 2. Character State Machine & Animations

The Sensei companion supports a comprehensive animation state machine:

| Animation State | Visual Character Behavior | Facial Expression | Use Case |
|---|---|---|---|
| `idle` | Gentle breathing, subtle head tilt, natural blinking, slight wand sway | Warm smile, relaxed eyes | Waiting for user interaction |
| `talking` / `speaking` | Expressive hand gestures, active lip-sync (A/I/U/E/O), bobbing | Friendly, engaged | Explaining grammar, speaking TTS |
| `thinking` | Tilted head, wand touched to chin, floating glowing question marks | Pondering, looking upwards | Processing API/LLM response |
| `happy` | Cheerful bounce, slight eye squint smile, head nod | Beaming, blushing cheeks | Praising correct answers |
| `celebrating` | Triumphant wand wave, jump/spin, confetti particle burst | Joyful closed-eye smile | Level up, streak milestones, quiz complete |
| `encouraging` | Gentle nod, hands clasped or fist pump gesture | Determined, warm, supportive | After a mistake, motivating daily study |
| `confused` | Head tilted sideways, slight shrug, question mark emote | Soft puzzled look | Ambiguous or unrecognized query |
| `error` | Apologetic bow / hands up, subtle sweatdrop effect | Sheepish, apologetic | Network error or system glitch |
| `waving` | Cheerful hand wave towards user | Bright greeting smile | Greeting on open / tour start |
| `pointing` / `teaching` | Wand extended directly towards targeted DOM element | Focused, helpful | Guiding to UI components / lessons |

---

## 3. Companion Modes & UI Architecture

### 3.1 Mode Definitions
1. **`MINIMIZED`**:
   - Small floating mascot button / mini 3D head avatar.
   - Draggable across the screen with mouse or touch.
   - Shows badge for SRS reviews due or daily reminders.
2. **`CHAT`**:
   - Interactive dialogue window with real-time 3D character viewport at top.
   - Integrated with Groq RAG knowledge base, TTS voice synthesis, and quick action chips.
3. **`TEACHING` / `POINTING`**:
   - Sensei floats alongside a specific UI component (`[data-sensei-target="..."]`).
   - Highlights the element with a glowing pulse and points her wand towards it.
4. **`TOUR`**:
   - Step-by-step guided onboarding tour navigating across the 8 core platform routes.
5. **`CELEBRATION`**:
   - Fullscreen or anchored celebratory reaction with confetti particles and congratulatory speech.

---

## 4. VRM Asset Integration & Fallback Strategy

- **Target Path**: `public/models/sensei.vrm` (Standard VRM 0.x / 1.0 format).
- **Blendshape Standards**:
  - Eyes: `blink`, `blinkLeft`, `blinkRight`, `surprised`.
  - Mouth (Vowels): `aa`, `ih`, `ou`, `ee`, `oh` (standard VRM expressions).
  - Emotions: `happy`, `angry`, `sad`, `relaxed`, `neutral`.
- **Placeholder Fallback**:
  - When `sensei.vrm` is not yet present on disk, a high-fidelity stylized 3D procedural character model renders with the exact color scheme (lavender kimono, navy scholar cap, golden wand) to enable complete UI, physics, movement, and interaction testing without blocking development.
