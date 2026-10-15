# Curriculum Localization Architecture & Expansion Plan

## 1. Architectural Separation: Linguistic Source vs. Explanations

The core invariant of the **Nihongo Master** curriculum system is the strict architectural separation of:
1. **Linguistic Facts (Immutable Japanese Source)**:
   - Japanese characters (Kanji, Hiragana, Katakana)
   - Verified readings (On'yomi, Kun'yomi, Furigana)
   - Tokyo pitch accent contours and drop positions
   - Japanese example sentences and dialogue exchanges
   - Grammatical formations and particle rules
2. **Pedagogical Explanations & Translations (Multilingual Metadata)**:
   - Definitions and meanings in the learner's chosen language
   - Grammatical explanations, usage notes, and cultural context
   - Translated example sentences

The Japanese linguistic source is stored in `src/data/canonical/canonicalCurriculum.json` and linked by stable string IDs (`n5v001`, `n5k001`, `n5g001`, `n5l001`). Human-written translations reside exclusively in `src/locales/{locale}/curriculum.json`.

---

## 2. Curriculum Coverage Gap Analysis

| Curriculum Domain | Total Items | English Coverage | Tamil Coverage | Hindi Coverage | Other 22 Locales | Gap to Bridge |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Vocabulary** | 176 | 176 (100%) | 61 (34.7%) | 61 (34.7%) | Fallback to `en` | 115 items (N4–N1 vocabulary words & sentences) |
| **Kanji** | 940 | 940 (100%) | 516 (54.9%) | 516 (54.9%) | Fallback to `en` | 424 items (N2–N1 characters & compounds) |
| **Grammar** | 130 | 130 (100%) | 90 (69.2%) | 90 (69.2%) | Fallback to `en` | 40 items (N2–N1 complex grammar patterns) |
| **Lessons** | 25 | 25 (100%) | 0 (0%) | 0 (0%) | Fallback to `en` | 25 lesson descriptions & cultural notes |
| **Total** | **1,271** | **1,271 (100%)**| **667 (52.5%)** | **667 (52.5%)** | Fallback to `en` | **604 items per language** |

---

## 3. Dynamic Resolution Hierarchy

Whenever any component (Flashcard, Detail Panel, Quiz, Reading lookup, Sensei RAG) renders a curriculum item, it queries the central resolver:
```
Target Explanation Language (`explanationLanguage`)
         │
         ▼ (If translation exists & non-empty)
   Render Localized Meaning / Explanation
         │
         ▼ (If translation missing in target locale)
   English Canonical Fallback (`en`)
         │
         ▼ (If English unexpectedly missing)
   Japanese Headword (Kanji / Kana)
```

### Safety Guarantees:
1. **Zero Runtime Crashes**: A missing translation in Spanish, Tamil, or Korean never throws an `undefined` error or renders `[object Object]`. It cleanly yields the English meaning.
2. **Zero Japanese Alteration**: The resolver never modifies the underlying Japanese character, okurigana, or pitch accent data.
3. **Transparent Status**: When an entry is resolved via English fallback, UI components can optionally render a subtle `[EN]` badge so learners know a translation is pending.

---

## 4. Human-in-the-Loop Translation Workflow

To expand curriculum coverage across Tamil, Hindi, Spanish, Korean, Chinese, and other languages without sacrificing quality:
1. **Extraction of Untranslated Entries**:
   A script scans `CANONICAL_INDEX` against `src/locales/{locale}/curriculum.json` to identify entries lacking localized strings.
2. **Bilingual Lexicographer Template**:
   Translations are authored in structured JSON format with:
   - `meaning`: Concise, natural definition
   - `example`: Accurate, culturally natural translation of the Japanese sentence
   - `explanation`: Pedagogical breakdown suited to the target language's grammatical analogies
3. **Peer Review & Verification**:
   Translations are reviewed by a native speaker fluent in Japanese and the target language before being committed to `curriculum.json`.
4. **Automated Parity Gate**:
   The CI test suite (`localizationParity.test.ts`) verifies that every newly committed translation references a valid canonical ID and contains zero corrupted formatting.
