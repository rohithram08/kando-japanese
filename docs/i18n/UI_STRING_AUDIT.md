# Nihongo Master — Phase 2.2: UI String Audit & Classification Report

## 1. Overview & Methodology

To ensure that no visible UI chrome or interactive control across the application is unintentionally hardcoded in English, an exhaustive audit and AST/string scan was performed on all primary learning journeys and auxiliary views across `src/pages/` and `src/components/`.

Each visible string candidate was classified into one of four categories:
1. **Category 1: Intentionally Immutable Japanese Content** (kanji headwords, furigana readings, example sentences, audio text, JLPT level markers, brand identifiers).
2. **Category 2: User-Generated or Dynamic Data** (user names, streak numbers, card counts, timestamps, accuracy percentages).
3. **Category 3: Visible UI Text Using `t()`** (page headers, search inputs, action buttons, status pills, filter tabs, modal dialogs, empty states).
4. **Category 4: Legitimate English Fallbacks** (fallback strings provided to `t(key, fallback)` ensuring graceful degradation if an external or experimental locale lacks a key).

---

## 2. Classification Inventory

### Category 1: Intentionally Immutable Content
These strings represent authentic Japanese language material or standardized linguistic nomenclature and MUST NOT be translated:
- **Japanese Headwords & Kanji:** `日`, `月`, `火`, `食べる`, `本`, `学生`, `日本語`, etc.
- **Furigana Readings & Kana:** `ひらがな`, `かたかな`, `にほんご`, `ほん`, etc.
- **Linguistic / JLPT Terms:** `N5`, `N4`, `N3`, `N2`, `N1`, `Gojūon`, `Dakuten`, `Handakuten`, `Yōon`.
- **Brand & Persona Identifiers:** `Nihongo Master`, `Hana-sensei`.
- **Audio Language Tags & Synthesizer Utterances:** `ja-JP`, Japanese speech synthesis cues.

### Category 2: Dynamic & User-Generated Data
These strings are populated dynamically at runtime:
- User display name, profile initials, email addresses.
- Numerical progression values: `{score}/{total}`, `{count} XP`, `{accuracy}%`, `Day {n}`.
- Timestamps and durations: `{minutes} min`, `{seconds}s`.

---

## 3. Screen-by-Screen UI Localization Audit (All 11 Screens)

In Phase 2.2, all 11 core application routes and views were connected to `useI18n()` to ensure immediate reactive translation across all 12 supported locales:

| Screen / Flow | Primary Files Audited & Updated | UI Chrome Localized via `useI18n()` | Japanese Content Preserved |
| :--- | :--- | :--- | :---: |
| **1. Lessons** | [`LessonsPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/LessonsPage.jsx), [`LessonViewer.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/lessons/LessonViewer.jsx) | Header, subtitle, search bar, level selector, category tabs, clear button, empty state, lesson completion modal. | 100% Intact |
| **2. Graded Readers** | [`ReadingPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/ReadingPage.jsx), [`StoryReader.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/reading/StoryReader.jsx), [`StoryAudioPlayer.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/reading/StoryAudioPlayer.jsx), [`VocabLookupModal.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/reading/VocabLookupModal.jsx) | Stories catalog header, stat cards, empty state, reader navigation, audio player controls ("Listen", "Pause", "Speaking"), vocab lookup counts. | 100% Intact |
| **3. Grammar** | [`GrammarPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/GrammarPage.jsx), [`GrammarCard.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/lessons/GrammarCard.jsx) | Action buttons ("Mark as Studied", "Mark Mastered", "Reset"), studied/mastered tags, search bar, status count badges. | 100% Intact |
| **4. Kanji UI** | [`KanjiPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/KanjiPage.jsx), [`KanjiCard.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/lessons/KanjiCard.jsx) | DetailPanel tabs (Overview, Stroke Order, Examples, Mnemonics), SRS action buttons, search, and filters. | 100% Intact |
| **5. Hana-sensei** | [`SenseiPage.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/SenseiPage.tsx), [`SenseiCompanion.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/sensei/SenseiCompanion.tsx) | Input placeholder, guidance panel, dialogue header, speech bubble actions, audio triggers. | 100% Intact |
| **6. Conversation** | [`ChatDojo.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/ChatDojo.jsx), [`ConversationPracticePage.tsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/ConversationPracticePage.tsx) | Scenario selector headers, level selector header, back button, message input placeholder, send button. | 100% Intact |
| **7. Speech Practice** | [`SpeechPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/SpeechPage.jsx) | Page title, subtitle, listen button, next sentence button, recording prompt, pronunciation feedback indicators. | 100% Intact |
| **8. Drama Theater** | [`DramaPlayer.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/components/drama/DramaPlayer.jsx) | Drama theater banner, search bar, category filters, episode card action buttons, empty states. | 100% Intact |
| **9. Your Progress** | [`ProgressPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/ProgressPage.jsx) | Hero stats strip, level progression details, category breakdown tabs, study streaks. | 100% Intact |
| **10. Achievements** | [`AchievementsPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/AchievementsPage.jsx) | Page title, search bar, category filter tabs, locked/unlocked status badges, progress counts. | 100% Intact |
| **11. Settings** | [`SettingsPage.jsx`](file:///e:/Nihongo-testing/nihongo-master/src/pages/SettingsPage.jsx) | Preferences headers, language selector dropdown, decoupled nativeLanguage selector, danger zone actions. | 100% Intact |

---

## 4. Category 4: Legitimate English Fallbacks
In all components, `t(key, fallback)` supplies a human-readable English fallback rather than leaving blank space or printing raw key identifiers (e.g. `quiz.score_label`). If a newly added or experimental locale lacks a key, it gracefully presents English text without crashing or showing error boundaries.

---

## 5. Remaining Static/Seed Data Notes
For honest reporting, the following non-UI static datasets remain in English:
- **Seed Roleplay Scenarios in `ChatDojo.jsx`**: Conversational roleplay prompts ("Ordering at a Ramen Shop", "Asking for Directions") are stored in English prompt seed structures pending curriculum translation.
- **Badge Seed Metadata in `AchievementsPage.jsx`**: Mock achievement descriptions in static demo lists ("Complete your first lesson", "Maintain a 7-day streak") remain in English content seeds.

All interactive chrome, buttons, headers, search bars, modals, toasts, audio controls, and navigation elements across all 11 screens are fully connected to the translation resolver.
