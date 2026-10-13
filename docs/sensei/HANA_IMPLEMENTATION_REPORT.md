# Hana-sensei Production Implementation Report

## Overview
The AI Sensei subsystem has been fully refactored from a procedural prototype into a production-ready feature featuring Hana-sensei. The underlying architecture has been redesigned to support standard GLTF/GLB formats, separating animations via `useAnimations` and targeting 14 specific blendshapes for anime-style expressions and flap-sync speech.

## Key Technical Decisions
- **Rule 38 Invocation**: Because the final 25k polygon rigged GLB cannot be generated in this environment, a clean React ErrorBoundary and Suspense fallback was implemented. The UI gracefully displays a custom 2D illustration (`sensei-avatar-fallback.jpg`) when the GLB is missing, ensuring the UI remains usable for development and testing.
- **Three.js AnimationMixer**: Stripped out procedural bone manipulation in favor of pre-authored clips (`talking`, `idle`, `celebrating`), handled automatically via `@react-three/drei`'s `useAnimations`.
- **Blendshape Controller**: Designed a stateless, interpolation-based Expression Controller that finds the mesh in the loaded GLB and smoothly transitions between the 14 defined morph targets based on high-level logical emotions provided by the AI response.
- **Simulated Flap-Sync**: Since `window.speechSynthesis` does not expose raw amplitude buffers via the Web Audio API, the `SenseiLipSyncController` utilizes an anime-style "flap-sync" mathematical rhythm tied to Japanese mora frequency when the audioService signals `isPlaying`.
- **JSON Structured Output**: Upgraded `senseiService.ts` Groq integration to explicitly return `response_format: { type: "json_object" }`, ensuring the LLM output rigidly matches a schema containing both the `message` string and an `emotion` state.

## Components Implemented
1. `SenseiCompanion.tsx`: The primary UI, now supporting glassmorphic containers and a floating movable widget.
2. `SenseiCharacter.tsx`: The Canvas wrapper setting up environment lights and backgrounds.
3. `SenseiGLBLoader.tsx`: The specific loader component using `useGLTF`.
4. `SenseiSpeechBubble.tsx`: A distinct glass card for proactive page guidance.
5. `SenseiGuidedTour.tsx`: A guided walkthrough component for new users.
6. `SenseiAnimationController.ts`, `SenseiExpressionController.ts`, `SenseiLipSyncController.ts`: The three primary controllers mapping logical states into Three.js primitives.
7. `useSenseiPageContext.ts`: Hook for proactive location-based hints.

## Next Steps for Art Team
1. Produce `hana-sensei.glb` exactly matching the specs in `HANA_FINAL_ASSET_SPECIFICATION.md`.
2. Place the file in `/public/models/hana-sensei.glb`.
3. The application will automatically clear the 2D fallback and render the 3D character with full animation and lip-sync support.
