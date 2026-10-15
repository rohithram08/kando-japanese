# Nihongo Master — Curriculum & Learning Data Quality Audit

**Audit Date:** 2026-10-14  
**Auditor:** Antigravity System Audit  
**Repository:** `rohithram08/nihongo_master`  
**Current Git Branch:** `main` (Preserving uncommitted working tree changes)

---

## 1. Executive Summary & Curriculum Sizing

All numbers in this audit are directly computed from the source files under `src/data/`. No numbers are estimated or fabricated.

| Curriculum Domain | N5 | N4 | N3 | N2 | N1 | Total Bundled | JLPT Standard Need | Coverage Ratio |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Kanji Characters** | 124 | 190 | 239 | 367 | 20 | **940** | 2,136 (Jōyō) | 44.0% |
| **Unique Kanji** | 124 | 184 | 234 | 366 | 20 | **928** | 2,136 | 43.4% |
| **Grammar Patterns** | 60 | 15 | 15 | 20 | 20 | **130** | ~800 | 16.2% |
| **Vocabulary Words** | 61 | 30 | 25 | 30 | 30 | **176** | ~10,000 | 1.8% |
| **Lessons** | 5 | 5 | 5 | 5 | 5 | **25** | — | — |
| **Graded Readers** | 4 | 2 | 0 | 0 | 0 | **6** | — | — |
| **Comprehension Questions**| 16 | 8 | 0 | 0 | 0 | **24** | — | — |
| **Kana Characters** | 107 (H) + 107 (K) = 214 total entries (Gojūon, Dakuon, Handakuon, Yōon) | Complete | Complete | 100% |
| **Verified Pitch Entries**| 77 Tokyo pitch dictionary entries (`src/data/pitch/pitchData.js`) | Baseline | Baseline | Baseline |

---

## 2. Kanji Dataset Inspection

### 2.1 Counts, Duplicates, and Schema Discrepancies
Kanji data files are split across two completely incompatible object schemas:
1. **N5, N4, N3 (`flat` schema):** Exported as named arrays (`N5_KANJI`, `N4_KANJI`, `N3_KANJI`). Object format: `{ char, en, ta, hi, on, kun, strokes }`. Lacks `id`, `radical`, `readings` object, and structured `examples`.
2. **N2, N1 (`full` schema):** Exported as default arrays (`n2Kanji`, `n1Kanji`). Object format: `{ id, kanji, readings: { on, kun }, meaning, examples: [{ word, reading, meaning }], strokeCount, level, radical }`.

| File | Total Count | Unique Characters | Internal Duplicates | Duplicate Characters | Example Sentences Breakdown |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `n5_kanji.js` | 124 | 124 | 0 | None | 124 flat string arrays (e.g. `["一つ(ひとつ)"]`), no English or furigana breakdown |
| `n4_kanji.js` | 190 | 184 | 6 pairs | `着` (x2), `太` (x2), `社` (x2), `味` (x2), `意` (x2), `験` (x2) | **0% examples** (190 / 190 entries have no `examples` field) |
| `n3_kanji.js` | 239 | 234 | 5 pairs | `論` (x2), `表` (x2), `際` (x2), `産` (x2), `仮` (x2) | **0% examples** (239 / 239 entries have no `examples` field) |
| `n2_kanji.js` | 367 | 366 | 1 pair | `拡` (x2) | 367 / 367 populated structured examples (3 per kanji) |
| `n1_kanji.js` | 20 | 20 | 0 | None | 20 / 20 populated structured examples (3 per kanji) |
| **Total** | **940** | **928** | **12** | **12 Duplicate Characters** | **429 kanji have zero example sentences** |

### 2.2 Critical Kanji Defects
- **The N4/N3 Example Void:** 429 out of 940 kanji (45.6%) render a completely blank "Examples" tab in `KanjiPage.jsx`.
- **Radical Omission:** Radicals are completely omitted for all N5, N4, and N3 entries. When normalized in `src/data/index.js:89`, `radical` is set to `''`.
- **N1 Truncation:** N1 contains only 20 kanji entries, representing a mere 0.9% of the required ~2,000+ advanced kanji corpus.

---

## 3. Grammar Dataset Inspection

### 3.1 Counts and Structure
All grammar files are exported through `src/data/index.js`, which normalizes N3/N4/N5 into the shape established by N1/N2.

| File | Pattern Count | Unique Patterns | Explicit IDs | Explanation Quality | Example Sentences |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `n5_grammar.js` | 60 | 60 | 60 | High (contains English explanation, formation, and examples) | 2–3 examples per pattern with romaji & English |
| `n4_grammar.js` | 15 | 15 | 15 | Medium (brief explanations) | 1–2 examples per pattern |
| `n3_grammar.js` | 15 | 15 | 15 | Medium (brief explanations) | 1–2 examples per pattern |
| `n2_grammar.js` | 20 | 20 | 20 | High (detailed structure, nuances) | 2–3 examples per pattern |
| `n1_grammar.js` | 20 | 20 | 20 | High (formal register notes) | 2–3 examples per pattern |
| **Total** | **130** | **130** | **130** | — | — |

### 3.2 Critical Grammar Defects
- **Curriculum Cliff:** N5 provides reasonable introductory coverage (60 patterns), but N4 and N3 drop steeply to only 15 patterns each. Typical N4 curriculums require ~130 patterns, and N3 requires ~150 patterns.
- **Missing Study Progress Integration:** Grammar patterns are static read-only cards. There is no user state to mark a pattern as "Studied", "Practiced", or "Mastered".

---

## 4. Vocabulary Dataset Inspection

### 4.1 Counts and Schema

| File | Word Count | Unique Words | Explicit IDs | Schema Format | Fields Present |
| :--- | :---: | :---: | :---: | :--- | :--- |
| `n5_vocabulary.js` | 61 | 61 | 0 (Auto-generated in index.js) | `{ word, reading, romaji, en, ta, hi, pos, level, example_jp, example_en }` | Multilingual (EN, TA, HI) + 1 example sentence |
| `n4_vocabulary.js` | 30 | 30 | 30 | `{ id, word, reading, romaji, meaning, partOfSpeech, level, example }` | English only + 1 example sentence |
| `n3_vocabulary.js` | 25 | 25 | 25 | `{ id, word, reading, romaji, meaning, partOfSpeech, level, example }` | English only + 1 example sentence |
| `n2_vocabulary.js` | 30 | 30 | 30 | `{ id, word, reading, romaji, meaning, partOfSpeech, level, example }` | English only + 1 example sentence |
| `n1_vocabulary.js` | 30 | 30 | 30 | `{ id, word, reading, romaji, meaning, partOfSpeech, level, example }` | English only + 1 example sentence |
| **Total** | **176** | **176** | **115** | Inconsistent across N5 vs N4–N1 | — |

### 4.2 Critical Vocabulary Defects
- **Critical Under-Sizing:** Total vocabulary across the entire application is 176 words. An entry-level JLPT N5 vocabulary list requires ~800 words; N4 requires ~1,500 words; N1 requires ~10,000 words.
- **Multilingual Inconsistency:** `n5_vocabulary.js` contains Tamil (`ta`) and Hindi (`hi`) translations, but N4, N3, N2, and N1 completely drop multilingual support.

---

## 5. Lessons & Exercises Inspection

### 5.1 Counts and Coverage

| File | Lessons Count | Exercises / Questions | Kanji Introduced | Grammar Referenced | Vocabulary Referenced |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `n5_lessons.js` | 5 | 11 | **0** (`kanji: []`) | 2–3 per lesson | 4–6 per lesson |
| `n4_lessons.js` | 5 | 8 | **0** (`kanji: []`) | 2–3 per lesson | 4–6 per lesson |
| `n3_lessons.js` | 5 | 7 | **0** (`kanji: []`) | 2–3 per lesson | 4–6 per lesson |
| `n2_lessons.js` | 5 | 8 | **0** (`kanji: []`) | 2–3 per lesson | 4–6 per lesson |
| `n1_lessons.js` | 5 | 9 | **0** (`kanji: []`) | 2–3 per lesson | 4–6 per lesson |
| **Total** | **25** | **43** | **0** | — | — |

### 5.2 Critical Lesson Defects
- **Zero Kanji in Lessons:** All 25 lessons across all 5 JLPT levels contain `kanji: []`. The core structured curriculum teaches vocabulary and grammar in isolation from kanji orthography.
- **Sparse Exercise Volume:** Only 43 total interactive exercise questions exist across 25 lessons (averaging 1.7 questions per lesson).

---

## 6. Graded Readers (Stories) Inspection

### 6.1 Counts and Structure
Stories are defined in `src/data/reading/n5_stories.js` and `n4_stories.js`.

| Story ID | JLPT Level | Title | Japanese Sentences | Comprehension Questions | Tokenized Words | Native / Synth Audio Support |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| `story_n5_01` | N5 | 学生の一日 (A Student's Day) | 10 | 4 | Yes | Yes |
| `story_n5_02` | N5 | 喫茶店へ行く (Going to the Cafe) | 10 | 4 | Yes | Yes |
| `story_n5_03` | N5 | スーパーで買い物 (Shopping at Supermarket) | 8 | 4 | Yes | Yes |
| `story_n5_04` | N5 | 公園へ散歩に行く (Walk in the Park) | 8 | 4 | Yes | Yes |
| `story_n4_01` | N4 | 初めての一人旅 (First Solo Trip) | 8 | 4 | Yes | Yes |
| `story_n4_02` | N4 | 友達へのプレゼント (Gift for a Friend) | 8 | 4 | Yes | Yes |
| **Total** | — | **6 Graded Readers** | **52 Sentences** | **24 Questions** | Complete | Complete |

### 6.2 Data Quality & Linguistic Verification
- **High Quality Baseline:** All 6 stories have explicit token boundaries, character-by-character furigana annotations, pitch contour metadata, grammar notes, and four multiple-choice comprehension questions with justified answer keys.
- **Absence of Advanced Levels:** Zero graded readers exist for N3, N2, or N1.

---

## 7. Pitch Accent Dataset Inspection

### 7.1 Provenance & Coverage
- **Source:** NHK 日本語発音アクセント新辞典 & Kanjium Dataset (CC BY-SA 4.0).
- **Location:** [`src/data/pitch/pitchData.js`](file:///e:/Nihongo-testing/nihongo-master/src/data/pitch/pitchData.js)
- **Verified Dictionary Entries:** **77 words**.
- **Coverage Strategy:** Strict fail-safe architecture. If a queried word is not in the 77-word verified list, `getPitchAccent()` returns `null` rather than generating speculative or unverified pitch contours.

---

## 8. Prioritized Curriculum Expansion Recommendations

1. **Populate N4 & N3 Kanji Examples (Immediate):** Add compound words, readings, and English translations for all 429 blank kanji entries.
2. **Deduplicate Kanji (Immediate):** Remove the 12 duplicate kanji characters across `n4_kanji.js`, `n3_kanji.js`, and `n2_kanji.js`.
3. **Link Kanji into Lessons:** Add 3–5 kanji characters to each of the 25 lessons.
4. **Expand Core Vocabulary:** Expand vocabulary dataset from 176 words to a minimum of 800 words for N5 and 1,500 words for N4.
5. **Expand N4/N3 Grammar:** Expand N4 and N3 grammar from 15 patterns each to at least 60 patterns each.
