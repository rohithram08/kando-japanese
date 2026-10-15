# Nihongo Master — Dictionary Feature Gap Analysis & Architecture Specification

**Audit Date:** 2026-10-14  
**Auditor:** Antigravity System Audit  
**Repository:** `rohithram08/nihongo_master`  
**Current Git Branch:** `main` (Preserving uncommitted working tree changes)

---

## 1. Executive Summary

While Nihongo Master's marketing copy cites *"one-tap dictionary lookup with Add to SRS"*, the repository currently contains **no general Japanese-English dictionary lookup system**. The existing lookup capability is strictly confined to hardcoded, manually tokenized words inside 6 graded reader stories and a static list of 176 vocabulary cards.

To transform Nihongo Master into a serious Japanese learning platform, a comprehensive, properly licensed lexical lookup engine must be implemented.

---

## 2. Inventory of Current Lookup Implementations

| Component / File | Scope | Mechanism | Data Source | Limitations |
| :--- | :--- | :--- | :--- | :--- |
| `VocabLookupModal.jsx` | Graded Reader words | Modal popover triggered by clicking pre-tokenized story words | `n4_stories.js`, `n5_stories.js` | Works ONLY on explicitly pre-authored story tokens. No free-form search. |
| `VocabularyPage.jsx` | Vocabulary browsing | Substring filter input (`searchQuery`) | `src/data/vocabulary/*` | Only searches the 176 bundled words. No inflection search, no fuzzy match. |
| `pitchData.js` | Tokyo pitch accent lookup | O(1) Map lookup via `getPitchAccent(word, reading)` | `VERIFIED_PITCH_DICTIONARY` | Only contains 77 curated words. All other words return `null`. |
| `audioService.js` | Pronunciation audio | Web Speech API (`SpeechSynthesisUtterance`) | Browser speech engine | Synthetic voice quality varies heavily across OS/browser; no recorded audio. |

---

## 3. Critical Capability Gaps

### 3.1 Search & Input Gaps
1. **No Inflected Form Search (Deconjugation):**
   - If a user searches for past tense 食べた (*tabeta*), potential 食べられる (*taberareru*), or negative 食べない (*tabenai*), zero results are returned.
   - The app has no morphological analyzer or deconjugation engine to reduce inflected forms to their dictionary headword (食べる, *taberu*).
2. **No Unified Multi-Script Search:**
   - Searching requires exact script matches. Searching *"arigatou"* in romaji does not find ありがとう (*arigatou*) unless a hardcoded romaji field exists.
   - Katakana loanwords and Hiragana equivalents do not cross-reference.
3. **No English-to-Japanese Reverse Indexing:**
   - Full-text search for English glosses (e.g. searching "eat" or "delicious") only scans the top-level string on 176 cards, with no synonym expansion or part-of-speech filtering.

### 3.2 Entry Detail Gaps
1. **Single Meaning Limitation:** Bundled vocabulary entries only feature 1 or 2 translated words (e.g. `meaning: "eat"`), omitting nuance, transitive/intransitive pairs, secondary senses, and formal registers.
2. **Missing Kanji Breakdown:** Dictionary cards do not link headword kanji to radical components, stroke count, or on/kun readings.
3. **Pitch Accent Provenance:** Pitch accent is only available for 77 hardcoded words.

---

## 4. Dataset Evaluation & Licensing Analysis

To expand dictionary coverage from 176 words to a production standard (15,000–180,000 entries), Nihongo Master should leverage established, open-source lexical databases.

| Dataset | Provider / Project | Size & Scope | License | Attribution Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **JMdict (Japanese-Multilingual Dictionary)** | Electronic Dictionary Research & Development Group (EDRDG) | ~190,000 entries; full inflections, senses, parts of speech, JLPT tags | CC BY-SA 3.0 / EDRDG License | **Mandatory:** Must display EDRDG copyright statement and link in app settings/about. |
| **KANJIDIC2** | EDRDG | 13,108 kanji; Joyo/Jinmeiyo grades, radicals, stroke count, frequency | CC BY-SA 3.0 | Mandatory EDRDG attribution. |
| **Tatoeba Project** | Tatoeba.org | 200,000+ bilingual Japanese-English example sentences | CC BY 2.0 FR | Mandatory attribution to Tatoeba contributors. |
| **Kanjium Pitch Accent** | Kanjium / NHK Accent Corpus | ~40,000 words with Tokyo pitch drop positions ($F_0$) | CC BY-SA 4.0 | Mandatory CC BY-SA 4.0 attribution (already referenced in `pitchData.js`). |

> [!IMPORTANT]
> **Licensing Compliance:** Incorporating JMdict and KANJIDIC2 is free for commercial and non-commercial use provided the EDRDG copyright statement is prominently displayed in the app UI (e.g., in a "Legal & Attributions" section).

---

## 5. Recommended Architecture & Implementation Design

### 5.1 Hybrid Strategy: Client Core + Backend Full-Text API
To balance instant offline response with complete lexical depth, a two-tier hybrid architecture is recommended:

```
[User Search Query]
       │
       ▼
┌──────────────────────────────────────────────┐
│ Tier 1: Client-Side Core (Offline / Instant) │
│ - Top 15,000 Core Headwords (N5–N1 + Common) │
│ - Lightweight Deconjugation Tree             │
│ - Compressed JSON (~3.2 MB gzip)             │
│ - Instant <5ms auto-complete & lookup        │
└──────────────────────┬───────────────────────┘
                       │ If no match or extended details needed
                       ▼
┌──────────────────────────────────────────────┐
│ Tier 2: Backend Dictionary API (Full Search) │
│ - Full JMdict + Kanjidic2 (190,000+ entries) │
│ - TiDB Full-Text Search / SQLite FTS5        │
│ - Example sentences from Tatoeba             │
│ - Endpoint: GET /api/dictionary/search       │
└──────────────────────────────────────────────┘
```

### 5.2 Deconjugation Engine Design
A rule-based deconjugator should be implemented in `src/utils/deconjugator.ts`:
- **Verb Classes:**
  - *Ichidan (る-verbs):* Strip ました, ます, て, た, ない, られる, させる, れば.
  - *Godan (う-verbs):* Parse i-stem, e-stem, o-stem, te-form changes (e.g. 行った → 行く, 書いた → 書く, 泳いだ → 泳ぐ, 飲んだ → 飲む).
  - *Irregular:* Handle する (して, した, しない, できる) and 来る (きて, きた, こない).
- **Adjectives:**
  - *I-adjectives:* Strip かった, くない, くて, ければ → い.
  - *Na-adjectives:* Strip な, だった, じゃない, で.

### 5.3 Dictionary UI Integration Points
1. **Dedicated `/dictionary` Page:**
   - Search bar supporting Romaji, Hiragana, Katakana, Kanji, and English.
   - Filter chips: JLPT Level (N5–N1), Part of Speech (Noun, Verb, Adjective), Common Words Only.
   - Results list with instant pitch accent contour visualization and audio button.
2. **One-Tap "Add to SRS":**
   - Every dictionary card contains a `+ Add to SRS` button that creates an `srs_cards` entry with type `'vocabulary'`, linking to the card for spaced repetition review.
3. **In-Reader Text Selection Lookup:**
   - Allow users in Graded Readers or Lessons to highlight any arbitrary Japanese phrase to trigger a popup dictionary lookup.
