# Full-Platform Multilingual Support: Audit & Screen Inventory

## 1. Executive Overview

This audit establishes a comprehensive baseline of internationalization (i18n) and localization across every user-facing screen, component, and data flow in **Nihongo Master**.

Prior to this phase, localization was focused on the canonical data schema and grammar progress in Phase 1A. However, a Duolingo-grade platform requires complete, consistent multilingual support across all application shells, navigation bars, interactive learning tools, assessments, spaced repetition flows, AI conversations, progress analytics, and error boundaries.

This document inventories every user-facing screen in the application and classifies its localization status into:
- **Fully Localized**: All interface labels, descriptions, and dynamic learning fields use the central translation resolver with verified locale keys and fallbacks.
- **Partially Localized**: Core curriculum fields or language selectors exist, but headings, button labels, search inputs, empty states, or toast alerts remain hardcoded in English.
- **Not Localized**: Component contains strictly hardcoded English text.

---

## 2. Complete Screen & Component Inventory

| Category | Component / Page | File Path | Current Status | Key Hardcoded Strings / Missing Localization | Curriculum Integration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Shell & Layout** | Navbar | `src/components/layout/Navbar.jsx` | Partially Localized | "Notifications", "Mark all read", "No notifications yet", "Lv.", "Log Out", profile menu items ("My Profile", "Progress", etc.) | N/A |
| **Shell & Layout** | Sidebar | `src/components/layout/Sidebar.jsx` | Partially Localized | Group titles ("Learn", "Practice", "Your Journey"), section labels, collapsed tooltips | N/A |
| **Shell & Layout** | MobileNav | `src/components/layout/MobileNav.jsx` | Not Localized | Pinned tab labels ("Home", "Lessons", "Review", "Kanji", "Conversation"), "More" drawer trigger | N/A |
| **Shell & Layout** | LanguageSelector | `src/components/common/LanguageSelector.jsx` | Fully Localized | Title tooltip, select label, ISO 639-1 metadata | N/A |
| **Shell & Layout** | Route Error Fallbacks | `src/components/common/RouteErrorBoundary.jsx` | Not Localized | "Something went wrong", "Reload Page", "Return to Dashboard", loading messages | N/A |
| **Dashboard** | Dashboard | `src/components/dashboard/Dashboard.jsx` | Partially Localized | Greeting ("Good Morning", etc.), "Continue Lesson", "{n} Reviews Due", "Study Grammar", Stat card labels ("Lessons Done", "Kanji Learned", etc.), explore section headers | Resolves stat counts, but UI copy is English |
| **Dashboard** | StreakCard | `src/components/dashboard/StreakCard.jsx` | Not Localized | "Day Streak", "Keep practicing daily to maintain your streak!", motivational messages | N/A |
| **Dashboard** | ProgressChart | `src/components/dashboard/ProgressChart.jsx` | Not Localized | "Level Progress", "Overall mastery towards {level}", metric labels | N/A |
| **Dashboard** | DailyGoal | `src/components/dashboard/DailyGoal.jsx` | Not Localized | "Daily Goal", "XP earned today", goal status messages | N/A |
| **Lessons** | Lessons Catalog | `src/pages/LessonsPage.jsx` | Partially Localized | Level descriptions, "Start Lesson", "Completed", "Review Lesson", lesson duration labels | Resolves lesson order and level |
| **Lessons** | Lesson Viewer | `src/components/lessons/LessonViewer.jsx` | Partially Localized | Step headers ("Vocabulary", "Grammar", "Dialogue", "Quiz"), "Next Step", "Previous Step", "Finish Lesson" | Vocab & Grammar cards localized, dialogue/notes English |
| **Lessons** | VocabCard | `src/components/lessons/VocabCard.jsx` | Fully Localized | Uses `getCurriculumMeaning` and `getCurriculumTranslation`, pitch accent labels | Resolves canonical vocab |
| **Lessons** | GrammarCard | `src/components/lessons/GrammarCard.jsx` | Fully Localized | Uses `getCurriculumMeaning` and `getCurriculumExplanation`, formation headers | Resolves canonical grammar |
| **Lessons** | Complete Modal | `src/components/lessons/LessonCompleteModal.jsx`| Not Localized | "Lesson Completed! 🎉", "XP Earned", "Return to Lessons", "Continue to Next Day" | N/A |
| **Kana Studio** | KanaPage | `src/pages/KanaPage.jsx` | Partially Localized | Tab titles ("Explorer", "Quiz", "Tracing", "Sensei Guide"), filter chips ("All", "Gojuon", etc.), toast messages | Kana items have romaji/kana, but UI is English |
| **Kana Studio** | KanaGrid | `src/components/kana/KanaGrid.jsx` | Partially Localized | Section headers, character count badges, "Mastered" indicator | N/A |
| **Kana Studio** | KanaDetailModal | `src/components/kana/KanaDetailModal.jsx`| Not Localized | "Stroke Order", "Audio Pronunciation", "Example Vocabulary", "Mark as Mastered", "Add to SRS" | Examples use English meanings |
| **Kana Studio** | KanaQuiz | `src/components/kana/KanaQuiz.jsx` | Not Localized | "What is the reading of...", "Choose the correct kana", "Question {n} of {total}", score summary | N/A |
| **Kana Studio** | TracingCanvas | `src/components/kana/KanaTracingCanvas.jsx`| Not Localized | "Trace the character", "Clear", "Next Stroke", "Accuracy: {n}%" | N/A |
| **Kanji** | KanjiPage | `src/pages/KanjiPage.jsx` | Partially Localized | Search placeholder, view toggles, tabs ("Browse", "Flashcards", "Practice", "Quiz", "Stroke Order"), filters | Card meanings localized via `getCurriculumMeaning` |
| **Kanji** | DetailPanel | `src/components/kanji/DetailPanel.jsx` | Partially Localized | "Readings", "On'yomi", "Kun'yomi", "Radical", "Stroke Count", "Example Compounds", "Study Tips" | Meanings localized, compound translations English |
| **Kanji** | KanjiStudy | `src/components/kanji/KanjiStudy.jsx` | Not Localized | "Tap card to reveal readings", "I know this", "Need practice", progress indicators | N/A |
| **Vocabulary** | VocabularyPage | `src/pages/VocabularyPage.jsx` | Partially Localized | Search placeholder, level chips, "Add to SRS", "In SRS Deck", pitch accent badges | Word meanings & examples localized |
| **Grammar** | GrammarPage | `src/pages/GrammarPage.jsx` | Partially Localized | Search placeholder, tag filters, "Mark as Studied", "Mark Mastered", "Reset", "Guest mode (local only)" | Patterns, explanations, examples localized |
| **Reading** | ReadingPage | `src/pages/ReadingPage.jsx` | Partially Localized | "Graded Stories", "Read authentic Japanese stories matched to your JLPT level", difficulty badges | Story titles & metadata English |
| **Reading** | StoryReader | `src/components/reading/StoryReader.jsx` | Partially Localized | "All Stories", "Vocabulary Notes", "Previous Sentence", "Next Sentence", "Take Quiz", "Sentence {n} of {m}" | Uses `InteractiveSentenceText` with lookup modal |
| **Reading** | VocabLookupModal | `src/components/reading/VocabLookupModal.jsx`| Not Localized | "Word Details", "Pitch Accent", "Add to SRS Review Deck", "Close" | Word meaning resolved, UI English |
| **Reading** | StoryAudioPlayer| `src/components/reading/StoryAudioPlayer.jsx`| Not Localized | "Play Story Audio", "Pause", "Speed: {n}x", "Autoplay Next" | N/A |
| **Reading** | ComprehensionQuiz | `src/components/reading/ComprehensionQuiz.jsx`| Not Localized | "Reading Comprehension Quiz", "Question {n} of {m}", "Submit Answer", "Score: {n}/{m}" | Question text in English |
| **SRS Review** | SRSReview | `src/components/srs/SRSReview.jsx` | Partially Localized | "Spaced Repetition Review", quality buttons ("Forgot", "Hard", "Good", "Easy"), "Session Complete" | Cards resolved via `srsCardResolver` |
| **SRS Review** | SRSReviewCard | `src/components/srs/SRSReviewCard.jsx` | Partially Localized | "Tap to reveal answer", "Readings", "Examples", "Tokyo Pitch Accent" | Word/kanji resolved, labels English |
| **Quiz** | QuizPage | `src/pages/QuizPage.jsx` | Partially Localized | "Quiz Center", "Test your Japanese knowledge", mode cards ("Matching Game", "Lesson Quiz") | N/A |
| **Quiz** | QuizEngine | `src/components/quiz/QuizEngine.jsx` | Partially Localized | "What does \"{word}\" mean?", "Time Left", "Quit Quiz", "Quiz Results", "Score: {n}%" | Options generated from English meanings |
| **Quiz** | MatchingGame | `src/components/quiz/MatchingGame.jsx` | Partially Localized | "Match pairs", "Moves: {n}", "Time: {n}s", "Congratulations!" | Kanji matched to English meanings |
| **Conversation** | Practice Page | `src/pages/ConversationPracticePage.jsx`| Partially Localized | Mode toggles ("Scenario Mode", "Free Talk"), "Reset Chat", "Download Transcript", Quick replies, hints | English prompt hints & correction cards |
| **Conversation** | ScenarioSelector| `src/components/chatbot/ScenarioSelector.jsx`| Not Localized | Category names ("Daily Life", "Travel", "Business"), scenario descriptions, difficulty tags | English scenario titles & objectives |
| **Sensei 3D** | SenseiPage | `src/pages/SenseiPage.tsx` | Partially Localized | Tour instructions, "Ask Hana-sensei", speech status, animation controls, microphone prompts | Dynamic AI responses need localized language context |
| **Drama** | DramaPlayer | `src/components/drama/DramaPlayer.jsx` | Not Localized | "Video Scene", "Interactive Subtitles", "Toggle Furigana", "Slow Motion" | Video subtitles English |
| **Speech** | SpeechPage | `src/pages/SpeechPage.jsx` | Not Localized | "Pronunciation Lab", "Speak Japanese phrases into the microphone", accuracy scoring, "Try Again" | Target sentences in Japanese, instructions English |
| **Progress** | ProgressPage | `src/pages/ProgressPage.jsx` | Not Localized | "Study Analytics", "Total XP", "Study Streak", "JLPT Readiness", Skill breakdown ("Reading", "Listening", etc.) | Hardcoded English metrics |
| **Achievements** | AchievementsPage| `src/pages/AchievementsPage.jsx` | Not Localized | Categories ("Lessons", "Kanji", "Vocabulary", "Streak"), rarity labels ("Common", "Rare", "Epic", "Legendary") | 50+ achievement titles & descriptions in English |
| **Profile** | ProfilePage | `src/pages/ProfilePage.jsx` | Not Localized | "User Profile", "Member since", "Badges Earned", "Recent Activity", "Edit Profile" | Hardcoded English labels |
| **Settings** | SettingsPage | `src/pages/SettingsPage.jsx` | Partially Localized | Section names ("Profile", "General", "Appearance", "Study", "Audio"), setting rows, descriptions, action buttons | Has "Display & Translation Language" picker |
| **Auth** | LoginPage | `src/components/auth/LoginPage.jsx` | Not Localized | "Sign in to Nihongo Master", "Email address", "Password", "Remember me", "Forgot password?", "Sign In" | Hardcoded English |
| **Auth** | RegisterPage | `src/components/auth/RegisterPage.jsx` | Not Localized | "Create your account", "Username", "Email", "Password", "Target JLPT Level", "Native Language", "Sign Up" | Hardcoded English |
| **Auth** | ResetPassword | `src/pages/ResetPasswordPage.jsx` | Not Localized | "Reset your password", "Enter your email to receive recovery instructions", "Send Reset Link" | Hardcoded English |
| **Landing** | LandingPage | `src/pages/LandingPage.jsx` | Partially Localized | Hero title, subtitle, CTA buttons ("Start Learning Free", "Explore Lessons"), feature highlights, testimonials | Hero subtitle has Japanese brand text |

---

## 3. Analysis of Critical Deficiencies

1. **Coupled Language Preferences**:
   `displayLanguage` and `nativeLanguage` were historically treated as identical in `settingsStore.js`. If a user set their native language to Tamil, the display language was forced to Tamil, and vice versa. There was no concept of a separate **Learning-Support / Explanation Language**.
2. **Missing UI Namespaces**:
   The initial locale files contained only 55 navigation and common strings. Critical user journeys (Quizzes, SRS reviews, Story reader, Kana tracing, Achievements, Dashboard) lacked structured translation keys, causing developers to leave hardcoded English strings.
3. **Hardcoded Assessment Logic**:
   `QuizEngine.jsx` synthesized question prompts using English template literals (`What does "${word}" mean?`) and selected distractors exclusively from `meaning_en`. A Tamil or Hindi learner taking a quiz was forced to read questions and select options in English.
4. **AI Prompt Language Blindness**:
   `buildSenseiSystemPrompt` on the backend instructed the AI to provide "clear English translations", ignoring whether the user was studying in Tamil, Hindi, or any other language.
5. **No Parameter Interpolation**:
   The translation resolver `t(key)` did not support parameter interpolation (e.g. `{count} reviews due`, `{score} of {total}`). Any string requiring dynamic numbers was built with manual JavaScript string concatenation, preventing proper grammatical word order in non-English languages.

---

## 4. Remediation Strategy

To achieve Duolingo-grade platform-wide multilingual support, we must:
1. **Decouple Language Preferences** in `settingsStore.js`:
   - `displayLanguage`: UI interface locale (e.g. navigation, buttons, titles).
   - `explanationLanguage`: Language used for curriculum translations, grammar explanations, and AI tutoring.
   - `nativeLanguage`: User's mother tongue (stored for personalization/demographics).
2. **Upgrade Translation Resolver** (`translationResolver.ts`):
   - Add parameter interpolation: `t('quiz.question_meaning', { word: '学生' })`.
   - Add graceful multi-tier fallback: `Target Locale -> English -> Default -> Key`.
3. **Expand UI Locale Bundles** (`src/locales/`):
   - Expand `ui.json` across all supported locales with complete coverage for Dashboard, Lessons, Kana, Kanji, Vocabulary, Grammar, Reading, SRS, Quiz, Sensei, Progress, and Settings.
4. **Establish Extensible Locale Registry**:
   - Register 25 languages with clear support tiers, text direction (`ltr`/`rtl`), native names, and flags.
5. **Update Component Consumers**:
   - Replace hardcoded English strings in shared layouts, navigation, and key learning features with reactive `t()` lookups.
