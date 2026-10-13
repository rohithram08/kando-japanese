# AI SENSEI - CURRENT STATE AUDIT

*Checkpoint A: Forensic Audit Before Coding*

## 1. What is actually implemented
- **Chat UI**: A floating, responsive interface (`SenseiCompanion.tsx`) using Tailwind CSS and Zustand (`senseiStore.ts`) for state.
- **Backend API**: The `/api/sensei/chat` endpoint is fully functional, using Drizzle ORM to save conversations to TiDB.
- **Groq Integration**: The backend sends structured payloads (including `tools` for `navigate_to` and `suggest_lesson`) directly to Groq.
- **Audio Service**: `audioService.js` wraps browser `SpeechSynthesis`, parses requested `lang`, and defaults to Japanese local service voices when available.
- **Quick Actions & Whitelisting**: The UI provides quick-action buttons that dispatch messages to the LLM. Structured AI navigation intents are guarded by an `executeAction` route whitelist.

## 2. What is only infrastructure
- **3D Character Rendering**: `SenseiCharacter.tsx` includes `@react-three/fiber` and `@pixiv/three-vrm` boilerplate, lighting, and camera configuration, but acts purely as infrastructure waiting for an asset.
- **Guided Tour**: Backend schema (`senseiTourProgress`) and API exist, but there is no frontend onboarding UI (no highlighting, next/back/skip functionality).
- **Daily Planner / Reminders**: The store has stubs and knowledge of TTS, but the daily proactive planner logic (Phase 6) and reminders integration (Phase 7) do not exist.

## 3. What is missing
- **The Final 3D Asset**: The actual `sensei.vrm` file is entirely missing from the repository.
- **Knowledge Retrieval Layer**: Comprehensive retrieval for Grammar rules, complete Kanji dictionaries, and Drama/Listening resources is unbuilt.
- **Deterministic Guardrails**: Prompt injection defense and strict domain out-of-bounds rejection relies solely on a generic system prompt, rather than a deterministic pipeline.
- **Current Page Context**: The AI is blind to what page the user is currently viewing.
- **Evaluation Suite**: No testing harness or dataset exists to evaluate the Sensei's hallucination or domain adherence (Phase 12).

## 4. What is mocked/placeholder
- **3D Character**: A CSS/Three.js purple capsule with a floating teacher cap and HTML text ("Missing VRM Asset") is rendered instead of the true 3D AI Sensei.
- **Lip-Sync**: The expression manager logic sets the `aa` blendshape, but since the VRM doesn't exist, this is purely theoretical and untested.

## 5. What is actually connected to TiDB
- `senseiConversations`: Saving all chat history.
- `senseiTourProgress`: Saving tour state (currently unused by UI).
- `users`: Fetching `currentLevel` and `nativeLanguage`.
- `userLessonProgress`: Fetching the 3 most recently accessed lessons.
- `userVocabularyProgress`: Fetching the 5 most recently mastered vocabulary words.

## 6. What is actually connected to Groq
- `backend/src/services/senseiService.ts` calls `https://api.groq.com/openai/v1/chat/completions` directly with `llama-3.3-70b-versatile`, passing the dynamically generated system prompt, the user's message, and the JSON schema for tools.

## 7. What is actually grounded in platform content
- **Lessons**: The backend successfully maps recent lesson IDs to `LESSONS_DATA` to provide the LLM with human-readable lesson titles and descriptions.
- **Vocabulary**: Mastered vocabulary IDs are embedded in the prompt context.
- **Profile Data**: The user's target JLPT level and native language preference are enforced in the system prompt.

## 8. What is NOT yet grounded
- **Grammar & Kanji Definitions**: The LLM relies on its pretrained weights to explain grammar and kanji, rather than citing exact `NihonGo Master` dictionary content.
- **SRS Queue Details**: The system prompt doesn't know exactly which cards are due today, meaning it cannot generate accurate, proactive study recommendations.
- **Drama Resources**: The LLM is unaware of the listening resources available in `dramaResources.ts`.

## 9. What is missing for multilingual behavior
- **Prompt Separation**: The system prompt instructs the model to use the `nativeLang` but does not enforce a rigid separation between `explanationLanguage` (e.g., Tamil) and `learningLanguage` (Japanese), risking cross-translation of the actual learning targets.
- **TTS Precision**: `audioService.js` attempts to guess if a string is Japanese via regex, but multi-lingual outputs (e.g., a sentence half-Tamil, half-Japanese) will degrade TTS quality.

## 10. What is missing for daily reminders
- **Planner Generation**: No backend logic exists to calculate streak, XP, and `srsReviewsDue` into a cohesive, daily proactive message ("Today's Japanese plan...").
- **Integration**: `useNotificationEngine.js` already tracks `srsReviewsDue`, `streak`, and `dailyGoals`, but AI Sensei is entirely disconnected from this engine.

## 11. What is missing for onboarding
- **Step-by-Step UI**: The visual overlay that highlights elements (Dashboard, Lessons, Vocabulary, etc.) and controls the sequence (Next/Back/Skip) is completely absent.

## 12. What is missing for the real 3D character
- **The Model**: `public/models/sensei.vrm`.
- **Validation**: Verifying actual facial expressions, idle animations, mouth movement matching the TTS, and ensuring memory performance isn't degraded on mobile viewports.

## 13. What remains untested
- **Domain Adherence & Injection**: Out-of-bounds questions (e.g., "Write a React app") are not deterministically blocked.
- **Real VRM Performance**: We do not know if `@pixiv/three-vrm` causes memory leaks or WebGL crashes on this app's stack when using the final complex asset.
- **Evaluation Dataset**: No ground-truth JSON test suite exists for CI/CD checks against the AI's logic.
