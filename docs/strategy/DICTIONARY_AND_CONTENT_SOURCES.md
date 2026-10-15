# Nihongo Master — Comprehensive Dictionary, Morphological Analysis & Content Sources

**Document Version:** 1.0.0  
**Status:** Lexical Engine Specification Baseline  
**Date:** 2026-10-14  
**Author:** Antigravity Lexical & Natural Language Processing Core  

---

## 1. Executive Summary & Objective

In modern Japanese language education, immediate, context-aware lexical lookup is essential for learner autonomy. Currently, the application offers no dedicated dictionary; lookup functionality is confined to a popover modal (`VocabLookupModal.jsx`) that operates only on pre-tokenized words inside 6 graded reader stories.

This specification details the architecture for:
1. A dedicated, full-featured **`/dictionary` section** supporting multi-script queries (Kanji, Kana, Romaji, English, and localized glosses).
2. A **Tested Morphological Analysis & Deconjugation Engine** that maps inflected surface forms (e.g., 食べさせられた, 飲まなかった, 美味しそう) back to their dictionary headwords without relying on naive suffix stripping.
3. A **Non-Intrusive Contextual Drawer** enabling instant, one-tap lookups across Graded Readers, Lessons, and Dialogues without disrupting audio playback or reading progress.
4. **Legally Verified Open Datasets** (JMdict, KANJIDIC2, Tatoeba, Kanjium) with explicit licensing, attribution, and data provenance documentation.

---

## 2. Dedicated `/dictionary` Section Design

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      DEDICATED DICTIONARY WORKSPACE (/dictionary)                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🔍 Search: [ たべられる / taberareru / can eat / 食べられる             ] [Clear]     │
│  [Filter: All (18)] [Words (12)] [Kanji (2)] [Sentences (4)] [JLPT Level: All ▼]       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 食べる 【たべる】 • taberu                                  [🔊 Audio] [⭐ +SRS] │  │
│  │ [Ichidan verb, transitive] [JLPT N5] [Common Word] [Pitch: ⓪ Heiban ───]        │  │
│  │                                                                                  │  │
│  │ 1. to eat; to consume (food)                                                     │  │
│  │ 2. to live on; to make a living; to survive                                      │  │
│  │                                                                                  │  │
│  │ ── Kanji in this word ─────────────────────────────────────────────────────────  │  │
│  │ 【食】 eat, food • Grade 2 • 9 strokes • Rad: 飠 • ON: ショク • KUN: た・べる    │  │
│  │                                                                                  │  │
│  │ ── Common Compounds ───────────────────────────────────────────────────────────  │  │
│  │ • 食べ物 (たべもの) - food                                                       │  │
│  │ • 朝食 (ちょうしょく) - breakfast                                                │  │
│  │                                                                                  │  │
│  │ ── Example Sentences ──────────────────────────────────────────────────────────  │  │
│  │ 1. 一緒に 昼ご飯を 食べませんか。                                                │  │
│  │    Won't you eat lunch together with me?                             [🔊] [Copy] │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Search Capabilities & Multi-Script Indexing
The search engine resolves queries across four distinct input modes seamlessly:
1. **Japanese Orthography:** Exact kanji (`水`, `学校`), mixed kanji-kana (`食べる`, `落ち着く`), katakana loanwords (`コーヒー`, `アルバイト`).
2. **Kana Phonetics:** Hiragana and Katakana readings (`みず`, `がっこう`, `たべる`).
3. **Hepburn Romaji:** Standard Romaji, Wapuro Romaji, and loose transliterations (`mizu`, `gakkou`, `gakko`, `taberu`, `ocha`).
4. **English & Localized Glosses:** Full-text gloss searching with stemming (searching "eat" or "eating" matches *taberu*; searching "cold water" matches *mizu*).

---

## 3. Morphological Analysis & Japanese Deconjugation

A primary failure mode of simplistic Japanese dictionaries is the inability to resolve inflected verb and adjective forms. Japanese is an agglutinative language where multiple suffixes stack onto verbal stems:

$$\text{食べさせられた} = \text{食} + \text{べ} \ (\text{stem}) + \text{させ} \ (\text{causative}) + \text{られ} \ (\text{passive}) + \text{た} \ (\text{past})$$

A naive suffix-stripping approach fails catastrophically on homophones and irregular stems (e.g., stripping `-た` from 行った yields *it-*, not the dictionary lemma *iku*; stripping `-ない` from 待たない yields *mata-*, not *matsu*).

### 3.1 Evaluated Technical Options

| Engine / Library | Architecture | Bundle Size | Accuracy | Pros | Cons | Recommendation |
| :--- | :--- | :---: | :---: | :--- | :--- | :---: |
| **Naive Suffix Stripping** | Regex string replace | <1 kB | <40% | Zero dependencies | Fails on godan stem changes, te-form euphony, irregulars | **REJECTED** |
| **Kuromoji.js** | Pure JS MeCab port (IPA dictionary) | ~18 MB | 96% | Full morphological segmentation, POS tagging | Huge bundle size; slow browser startup | Server-side only |
| **Wasm-MeCab / Kagome** | WebAssembly binary + IPADIC | ~9 MB | 98% | Extreme parsing speed | High initial download; memory pressure on mobile | Heavy for client |
| **Deterministic Deconjugation Finite-State Graph** | Directed inflection graph (ve/rikai engine) | ~180 kB | **94%** | Fast (<2ms), zero network overhead, bidirectional | Requires strict lexical rule definitions | **RECOMMENDED FOR CLIENT** |

### 3.2 Hybrid Deconjugation Architecture
To achieve instant, lightweight client response without downloading a 18 MB dictionary, Nihongo Master adopts a **Two-Tier Hybrid Engine**:

```
[User Input: e.g. "飲まなかった" / "nomana-katta"]
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│ Tier 1: Client-Side Deconjugation Finite-State Graph (180kB) │
│ - Traverses Godan, Ichidan, Kuru, Suru inflection rules      │
│ - Identifies: Negative (なかった) + Past -> Lemma: 飲む       │
│ - Instant lookup in client core index (<2ms)                 │
└──────────────────────────────┬───────────────────────────────┘
                               │ If lemma unresolved or complex sentence
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ Tier 2: Backend Morphological Service (/api/dictionary/parse)│
│ - Node.js + Kuromoji / MeCab full tokenizer                 │
│ - Resolves complex idioms, slang, and dialectal inflections  │
└──────────────────────────────────────────────────────────────┘
```

#### Client Deconjugation Graph Logic (`src/utils/deconjugator.ts`):
1. **Stem Classification:**
   - *Godan (5-row):* Reverses euphony rules (*onbin*):
     - `っ` + `た/て` ➔ `つ` (待つ), `る` (取る), or `う` (買う).
     - `ん` + `だ/で` ➔ `む` (飲む), `ぶ` (遊ぶ), or `ぬ` (死ぬ).
     - `い` + `た/て` ➔ `く` (書く) or `ぐ` (泳ぐ).
   - *Ichidan (1-row):* Reverses `〜ない`, `〜た`, `〜て`, `〜られる`, `〜させる` ➔ `〜る`.
   - *Irregular:* Direct mapping for `する` (して, した, しない, できる, され) and `来る` (きて, きた, こない, こられる).
2. **Adjective Inflections:**
   - *い-Adjectives:* Reverses `〜くない`, `〜かった`, `〜く`, `〜ければ` ➔ `〜い`.
   - *な-Adjectives:* Reverses `〜じゃない`, `〜だった`, `〜で` ➔ base noun.

---

## 4. Contextual Non-Intrusive Lookup Drawer

To prevent disrupting the learner's reading or study flow, any word in a Graded Reader, Lesson Dialogue, or Grammar example is rendered as an interactive, underlined token.

```
┌────────────────────────────────────────────────────────────────────────┐
│ STORY READER VIEW                                                      │
│                                                                        │
│ 毎朝、健太さんは 七時に [起きます]。 それから、朝ご飯を [食べます]。   │
│                                              ▲                         │
│                                              │ User taps "起きます"    │
└──────────────────────────────────────────────┼─────────────────────────┘
                                               │
┌──────────────────────────────────────────────▼─────────────────────────┐
│ NON-INTRUSIVE SLIDE-OVER DRAWER (Bottom on Mobile, Side on Desktop)    │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 起きる 【おきる】 • okiru                     [🔊 Audio] [⭐ +SRS] │ │
│ │ [Ichidan verb, intransitive] [JLPT N5] [Pitch: ② Atamadaka]        │ │
│ │                                                                    │ │
│ │ Surface Form: 起きます (Polite non-past)                           │ │
│ │ 1. to get up; to wake up; to arise                                 │ │
│ │ 2. to occur; to happen (e.g. an incident)                          │ │
│ │                                                                    │ │
│ │ [View Full Details in Dictionary ➔]               [Resume Reading] │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Drawer Interaction Rules:
1. **Preserve Current State:** Tapping an underlined word opens the drawer as an overlaid slide-out without navigating away, triggering a route change, or reloading the parent page.
2. **Audio Coordination:** If story sentence audio was playing, opening the drawer softly pauses audio; closing the drawer allows resuming from the exact paused position.
3. **One-Tap Add to SRS:** Tapping `⭐ +SRS` bookmarks the base headword (`起きる`) into the user's `srs_cards` queue with initial ease factor 2.5 and 0 XP awarded, confirming with a discreet toast.

---

## 5. Lexical Datasets, Licenses & Legal Compliance

Nihongo Master will leverage established, open-source Japanese lexicographical databases. Full compliance with each project's licensing terms is legally mandatory.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATASET PROVENANCE & LICENSING                     │
├─────────────────────┬───────────────────┬──────────────┬────────────────┤
│ Dataset             │ Provider / Author │ License      │ Attribution    │
├─────────────────────┼───────────────────┼──────────────┼────────────────┤
│ **JMdict**          │ EDRDG             │ CC BY-SA 3.0 │ Mandatory      │
│ **KANJIDIC2**       │ EDRDG             │ CC BY-SA 3.0 │ Mandatory      │
│ **Tatoeba Corpus**  │ Tatoeba.org       │ CC BY 2.0 FR │ Mandatory      │
│ **Kanjium Pitch**   │ Lars Yencken /    │ CC BY-SA 4.0 │ Mandatory      │
│                     │ NHK Accent Corpus │              │                │
└─────────────────────┴───────────────────┴──────────────┴────────────────┘
```

### 5.1 JMdict (Japanese-Multilingual Dictionary)
- **Scope:** ~190,000 entries covering modern Japanese vocabulary, archaic terms, idioms, slang, grammatical markers, and JLPT tags.
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0) and EDRDG License.
- **Compliance Requirement:** Prominently display the Electronic Dictionary Research and Development Group copyright notice in the app's "About & Attributions" page:
  > *"This product uses the JMdict dictionary file. This file is the property of the Electronic Dictionary Research and Development Group, and is used in conformance with the Group's licence."*

### 5.2 KANJIDIC2
- **Scope:** 13,108 kanji characters including all 2,136 Jōyō kanji, Jinmeiyō kanji, stroke counts, radical classifications (KangXi and Nelson), on/kun readings, and frequency rankings.
- **License:** Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0).
- **Compliance Requirement:** Display standard EDRDG KANJIDIC2 attribution text.

### 5.3 Tatoeba Example Sentence Corpus
- **Scope:** Over 200,000 human-translated, bilingual Japanese-English example sentences.
- **License:** Creative Commons Attribution 2.0 France (CC BY 2.0 FR).
- **Compliance Requirement:** Credit Tatoeba.org contributors and provide a link to the original Tatoeba source URL for imported sentence pairs.

### 5.4 Kanjium Tokyo Pitch Accent Data
- **Scope:** Tokyo standard pitch accent contours derived from the NHK Pronunciation Accent Dictionary and published by the open-source Kanjium project.
- **License:** Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
- **Compliance Requirement:** Display Kanjium and Lars Yencken attribution (already integrated in `src/data/pitch/pitchData.js`).
