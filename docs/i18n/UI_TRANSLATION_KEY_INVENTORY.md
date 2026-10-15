# UI Translation Key Inventory & Namespaced Schema

## 1. Architectural Conventions

To ensure zero hardcoded English strings across the platform and eliminate namespace collisions, all interface strings are organized into hierarchical, dot-delimited namespaces:
- `t('namespace.key', locale?, params?)`
- Interpolation syntax: `{paramName}` (e.g. `t('quiz.question_meaning', { word: '学生' })`).
- Multi-tier resolution: `Target Locale -> English ('en') -> Default Parameter -> Key String`.

---

## 2. Complete Namespaced Key Catalog

### 2.1 Navigation & Shell (`nav.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `nav.dashboard` | Dashboard | Main home dashboard link |
| `nav.learn` | Learn | Sidebar group header for study features |
| `nav.practice` | Practice & Review | Sidebar group header for practice features |
| `nav.journey` | Your Journey | Sidebar group header for stats & awards |
| `nav.kana` | Kana Studio | Hiragana & Katakana interactive studio |
| `nav.lessons` | Lessons | Structured curriculum courses |
| `nav.reading` | Graded Reader | Reading immersion tool |
| `nav.grammar` | Grammar | Grammar guide & patterns |
| `nav.kanji` | Kanji | Kanji library & stroke practice |
| `nav.vocabulary` | Vocabulary | Word bank & vocabulary cards |
| `nav.quiz` | Quiz Center | Timed assessments & games |
| `nav.srs` | SRS Reviews | Spaced repetition flashcard queue |
| `nav.sensei` | Hana-sensei 3D | 3D AI character teaching studio |
| `nav.conversation` | Conversation | Roleplay & open conversation practice |
| `nav.speech` | Speech Lab | Audio & pronunciation practice |
| `nav.drama` | Drama Theater | Subtitled Japanese video clips |
| `nav.progress` | Progress & Stats | Learning analytics and trends |
| `nav.achievements` | Achievements | Badges and milestones |
| `nav.settings` | Settings | User & application preferences |
| `nav.more` | More | Mobile bottom navigation trigger |
| `nav.notifications` | Notifications | Header notification drawer trigger |
| `nav.mark_all_read` | Mark all read | Clear unread notifications |
| `nav.no_notifications` | No notifications yet | Empty notification drawer state |
| `nav.profile_menu` | Profile Menu | User dropdown menu trigger |
| `nav.my_profile` | My Profile | User profile link |
| `nav.logout` | Log Out | End current user session |

### 2.2 Common UI Actions & Statuses (`common.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `common.save` | Save | Save button |
| `common.cancel` | Cancel | Cancel modal or action |
| `common.back` | Back | Return to previous view |
| `common.next` | Next | Advance to next item |
| `common.previous` | Previous | Return to previous item |
| `common.complete` | Complete | Finish task or session |
| `common.search` | Search... | Universal search input placeholder |
| `common.all` | All | Filter option for all items |
| `common.level` | Level | JLPT Level badge prefix |
| `common.loading` | Loading... | Universal loading state |
| `common.error` | An error occurred | Generic error state |
| `common.retry` | Retry | Retry failed network operation |
| `common.add_to_srs` | + SRS | Add item to spaced repetition review deck |
| `common.in_srs` | In Deck | Item already present in SRS review deck |
| `common.mastered` | Mastered | Item marked as mastered |
| `common.studied` | Studied | Item marked as studied |
| `common.streak` | {count} Day Streak | Dynamic streak label |
| `common.xp` | {count} XP | Dynamic XP amount label |
| `common.guest_mode` | Guest mode (local only) | Pill indicator for unauthenticated learners |
| `common.curated` | Curated Translation | Badge indicating human-verified translation |
| `common.fallback_en` | English (Fallback) | Badge indicating fallback to English content |

### 2.3 Dashboard (`dashboard.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `dashboard.greeting_morning` | Good Morning | Morning greeting subtitle |
| `dashboard.greeting_afternoon`| Good Afternoon | Afternoon greeting subtitle |
| `dashboard.greeting_evening` | Good Evening | Evening greeting subtitle |
| `dashboard.continue_lesson` | Continue Lesson | Primary action button in hero banner |
| `dashboard.reviews_due` | {count} Reviews Due | Primary action button when SRS cards are waiting |
| `dashboard.study_grammar` | Study Grammar | Action button when no SRS cards are due |
| `dashboard.lessons_done` | Lessons Done | Metric counter label |
| `dashboard.kanji_learned` | Kanji Learned | Metric counter label |
| `dashboard.vocab_learned` | Vocabulary | Metric counter label |
| `dashboard.reviews_waiting` | Reviews Waiting | Metric counter label |
| `dashboard.core_materials` | Core study material | Section subtitle for learn group |
| `dashboard.put_to_use` | Put it to use | Section subtitle for practice group |

### 2.4 Quizzes & Assessments (`quiz.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `quiz.title` | 🧠 Quiz Center | Page header title |
| `quiz.subtitle` | Test your Japanese knowledge | Page header subtitle |
| `quiz.matching_game` | Matching Game | Quiz mode card title |
| `quiz.matching_desc` | Match kanji with their meanings | Quiz mode card description |
| `quiz.lesson_quiz` | Lesson Quiz | Quiz mode card title |
| `quiz.lesson_desc` | Take a quiz from a specific lesson | Quiz mode card description |
| `quiz.what_does_mean` | What does "{word}" mean? | Dynamic question prompt for vocabulary |
| `quiz.what_is_kanji_meaning`| What is the meaning of 「{kanji}」? | Dynamic question prompt for kanji |
| `quiz.what_is_reading` | What is the reading of 「{kanji}」? | Dynamic question prompt for kanji readings |
| `quiz.correct` | Correct! 🎉 | Feedback banner for correct answers |
| `quiz.incorrect` | Incorrect | Feedback banner for wrong answers |
| `quiz.time_left` | Time Left | Quiz countdown timer label |
| `quiz.score` | Score: {score}/{total} ({percent}%) | Final score summary |
| `quiz.passed` | Quiz Passed! Outstanding work! 🌸 | Passing celebratory message |
| `quiz.failed` | Keep practicing and try again! 💪 | Score below passing threshold message |
| `quiz.finish` | Finish Quiz | Action button to complete test |

### 2.5 Spaced Repetition System (`srs.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `srs.title` | Spaced Repetition Review | Review header title |
| `srs.tap_to_reveal` | Tap to reveal meaning | Card front interaction prompt |
| `srs.quality_forgot` | Forgot | Rating button 1 (Quality 0) |
| `srs.quality_hard` | Hard | Rating button 2 (Quality 2) |
| `srs.quality_good` | Good | Rating button 3 (Quality 4) |
| `srs.quality_easy` | Easy | Rating button 4 (Quality 5) |
| `srs.session_complete` | Review Deck Complete! 🎉 | Summary screen header |
| `srs.cards_reviewed` | Cards Reviewed: {count} | Total cards reviewed stat |
| `srs.accuracy` | Retention Rate: {percent}% | Review session accuracy |
| `srs.return_dashboard` | Return to Dashboard | Post-session navigation |
| `srs.no_cards_due` | All caught up! No reviews due right now. | Empty deck state |

### 2.6 Graded Reader (`reading.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `reading.title` | Graded Japanese Reader | Main reader catalog title |
| `reading.subtitle` | JLPT-aligned stories with interactive furigana and word lookups | Subtitle |
| `reading.all_stories` | All Stories | Back navigation button |
| `reading.vocab_notes` | Vocabulary Notes | Drawer toggle button |
| `reading.prev_sentence` | Previous Sentence | Pagination button |
| `reading.next_sentence` | Next Sentence | Pagination button |
| `reading.take_quiz` | Take Comprehension Quiz | Final sentence CTA |
| `reading.lookup_title` | Word Lookup | Lookup dialog title |
| `reading.add_word_srs` | Add to SRS Review Deck | Action in lookup modal |
| `reading.story_complete`| Story Completed! | Completion notification |

### 2.7 AI Sensei & Conversation Practice (`sensei.*` / `chat.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `sensei.title` | Hana-sensei 3D Studio | Sensei studio header |
| `sensei.ask_placeholder`| Ask Hana-sensei anything about Japanese... | Chat input placeholder |
| `sensei.listening` | Listening to your voice... | Audio input active state |
| `sensei.scenario_mode` | Scenario Roleplay | Tab option |
| `sensei.free_talk` | Free Conversation | Tab option |
| `sensei.grammar_tip` | Grammar Feedback | AI correction card header |
| `sensei.natural_phrase` | Natural Japanese Phrasing | AI feedback pill |
| `sensei.reset_chat` | Reset Conversation | Action button |
| `sensei.download_transcript`| Download Transcript | Action button |

### 2.8 Settings & Preferences (`settings.*`)
| Key | Default English String | Description |
| :--- | :--- | :--- |
| `settings.title` | Settings & Preferences | Page title |
| `settings.profile_section` | Profile & Identity | Section tab |
| `settings.display_lang_title`| Display & Interface Language | Setting label for UI locale |
| `settings.display_lang_desc` | Choose the language used for all buttons, menus, and interface labels | Setting description |
| `settings.explanation_lang_title`| Learning Support & Explanation Language | Setting label for pedagogical explanations |
| `settings.explanation_lang_desc` | Choose the language Hana-sensei and grammar cards use to explain Japanese | Setting description |
| `settings.native_lang_title` | Native Language (Mother Tongue) | Demographic setting |
| `settings.jlpt_target` | Target JLPT Level | Target proficiency level |
| `settings.furigana_mode` | Furigana Reading Display | Adaptive, always, reveal, off |
| `settings.save_success` | Settings saved successfully! ✅ | Feedback toast |
| `settings.reset_progress` | Reset All Learning Progress | Danger zone action |

---

## 3. Parameter Interpolation Engine

The translation engine implements dynamic regex replacement for curly brace variables:
```typescript
t('quiz.score', { score: 9, total: 10, percent: 90 })
// English: "Score: 9/10 (90%)"
// Tamil: "மதிப்பெண்: 9/10 (90%)"
// Hindi: "अंक: 9/10 (90%)"
```
If a parameter is omitted from the arguments object, the placeholder string `{paramName}` is safely preserved to prevent silent rendering glitches.
