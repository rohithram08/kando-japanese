# Multilingual Platform Architecture: Locale Coverage Matrix

## 1. Overview & Tiering Principles

To prevent developer confusion, misleading user expectations, or degraded learning experiences, **Nihongo Master** maintains a strict separation between:
1. **UI Coverage**: The completeness of translated interface labels, buttons, dialogs, navigation, notifications, and menus.
2. **Curriculum Coverage**: The completeness of human-verified Japanese learning explanations, grammatical rules, vocab meanings, and contextual example sentences.

Under no circumstances are automated machine translations ingested in bulk and labeled "human-verified". Where a language has full or partial UI support but lacks curated curriculum translations, the platform **transparently falls back to English for curriculum content** while maintaining the user's selected language for all UI elements.

---

## 2. 25-Language Locale Coverage Matrix

| ISO Code | Language Name | Native Name | Script | Direction | Support Tier | UI Coverage Status | Curriculum Status | Fallback Strategy |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `en` | English | English | Latin | LTR | **Tier 1 (Flagship)** | **100%** (Full) | **100%** (1,271/1,271 Curated) | Primary Canonical Fallback |
| `ta` | Tamil | தமிழ் | Tamil | LTR | **Tier 1 (Curated)** | **100%** (Full) | **52.5%** (667/1,271 Curated) | N4–N1 missing items fallback to `en` |
| `hi` | Hindi | हिंदी | Devanagari | LTR | **Tier 1 (Curated)** | **100%** (Full) | **52.5%** (667/1,271 Curated) | N4–N1 missing items fallback to `en` |
| `es` | Spanish | Español | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 2 |
| `pt` | Portuguese | Português | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 2 |
| `fr` | French | Français | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 2 |
| `de` | German | Deutsch | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 2 |
| `ko` | Korean | 한국어 | Hangul | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | High priority for Japanese grammar synergy |
| `zh-CN` | Chinese (Simp.) | 简体中文 | Han (Simplified) | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | High priority for Kanji learning synergy |
| `zh-TW` | Chinese (Trad.) | 繁體中文 | Han (Traditional)| LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | High priority for Kanji learning synergy |
| `id` | Indonesian | Bahasa Indonesia | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `vi` | Vietnamese | Tiếng Việt | Latin (Quốc ngữ) | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `th` | Thai | ไทย | Thai | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `ru` | Russian | Русский | Cyrillic | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `uk` | Ukrainian | Українська | Cyrillic | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `pl` | Polish | Polski | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `el` | Greek | Ελληνικά | Greek | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |
| `ar` | Arabic | العربية | Arabic | **RTL** | **Tier 2 (RTL Spec.)**| Full UI (RTL enabled)| Fallback to `en` | Bidirectional layout engine |
| `ur` | Urdu | اردو | Perso-Arabic | **RTL** | **Tier 2 (RTL Spec.)**| Full UI (RTL enabled)| Fallback to `en` | Bidirectional layout engine |
| `te` | Telugu | తెలుగు | Telugu | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Indic font shaping verification |
| `kn` | Kannada | ಕನ್ನಡ | Kannada | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Indic font shaping verification |
| `ml` | Malayalam | മലയാളം | Malayalam | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Indic font shaping verification |
| `bn` | Bengali | বাংলা | Bengali | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Indic font shaping verification |
| `mr` | Marathi | मराठी | Devanagari | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Devanagari font rendering |
| `pa` | Punjabi | ਪੰਜਾਬੀ | Gurmukhi | LTR | **Tier 2 (Indic Spec.)**| Full UI Available | Fallback to `en` | Gurmukhi font rendering |
| `cs` | Czech | Čeština | Latin | LTR | **Tier 2 (Core UI)** | Full UI Available | Fallback to `en` | Curriculum roadmap Phase 3 |

---

## 3. Tiering Definitions

### Tier 1 — Flagship Multilingual Experience
- **Requirements**:
  - 100% comprehensive UI translation coverage across all screens, navigation, buttons, modals, error boundaries, and notifications.
  - Complete or substantial human-verified curriculum translations (e.g. English has 100%; Tamil and Hindi have 100% of N5 vocabulary, 100% of N5–N3 kanji, and 100% of N5–N3 grammar).
  - Native language audio synthesis and character font verification.
- **Languages**: English (`en`), Tamil (`ta`), Hindi (`hi`).

### Tier 2 — Interface-Localized with English Curriculum Scaffolding
- **Requirements**:
  - Full platform interface, navigation, settings, dashboard, quiz UI, and system prompts in the target language.
  - Registered locale metadata (native name, flag, script direction).
  - Curriculum content that lacks human-verified translations seamlessly falls back to English without throwing errors or leaving blank fields.
  - UI provides an indicator tag: `[Curated]` for human-verified curriculum, or `[UI Localized]` with clear notice that advanced curriculum explanations are in English.
- **Languages**: All 22 additional registered languages.

---

## 4. Script & Direction Handling (RTL & Complex Scripts)

1. **Right-to-Left (RTL) Support (`ar`, `ur`)**:
   - The platform HTML root element dynamically updates its `dir` attribute:
     ```html
     <html dir="rtl" lang="ar">
     ```
   - All horizontal flex containers and grid alignments utilize logical properties (`start`/`end` instead of `left`/`right`) to ensure seamless mirroring.
   - **Crucial Linguistic Invariant**: Japanese characters, furigana annotations, and romaji are **always rendered Left-to-Right (LTR)** regardless of the surrounding RTL interface language. Japanese text is wrapped in `<bdi>` or `<span dir="ltr">` to prevent bidirectional punctuation distortion.

2. **Indic & Complex Text Shaping (`ta`, `hi`, `te`, `kn`, `ml`, `bn`, `mr`, `pa`)**:
   - Modern system font stacks (`system-ui`, `Noto Sans Devanagari`, `Noto Sans Tamil`, `Noto Sans Telugu`, etc.) are included in the typography configuration to prevent missing conjuncts or broken vowel matras.

---

## 5. Curriculum Content Integrity Invariant

- **Zero Machine-Translation Pollution**:
  - No unverified machine-generated translations are written into canonical curriculum files or released under the guise of human translations.
  - When a user chooses a Tier 2 language, their interface is fully in their language, but Japanese vocabulary definitions remain authentic English or canonical Japanese headwords until human translators contribute verified translations.
