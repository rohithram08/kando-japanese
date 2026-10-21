// src/content/provider.ts
import type {
  JLPTLevel,
  SupportedLanguage,
  RawVocabularyItem,
  RawKanjiItem,
  RawGrammarItem,
  RawLessonItem,
  VocabularyTranslation,
  KanjiTranslation,
  GrammarTranslation,
  LessonTranslation,
  LocalizedVocabularyItem,
  LocalizedKanjiItem,
  LocalizedGrammarItem,
  LocalizedLessonItem,
  ContentSearchResult
} from './types';

// Vocabulary Content
import vN5 from '../../content/vocabulary/n5.json';
import vN4 from '../../content/vocabulary/n4.json';
import vN3 from '../../content/vocabulary/n3.json';
import vN2 from '../../content/vocabulary/n2.json';
import vN1 from '../../content/vocabulary/n1.json';

// Kanji Content
import kN5 from '../../content/kanji/n5.json';
import kN4 from '../../content/kanji/n4.json';
import kN3 from '../../content/kanji/n3.json';
import kN2 from '../../content/kanji/n2.json';
import kN1 from '../../content/kanji/n1.json';

// Grammar Content
import gN5 from '../../content/grammar/n5.json';
import gN4 from '../../content/grammar/n4.json';
import gN3 from '../../content/grammar/n3.json';
import gN2 from '../../content/grammar/n2.json';
import gN1 from '../../content/grammar/n1.json';

// Lesson Content
import lN5 from '../../content/lessons/n5.json';
import lN4 from '../../content/lessons/n4.json';
import lN3 from '../../content/lessons/n3.json';
import lN2 from '../../content/lessons/n2.json';
import lN1 from '../../content/lessons/n1.json';

// Translations - English
import enVocab from '../../content/translations/en/vocabulary.json';
import enKanji from '../../content/translations/en/kanji.json';
import enGrammar from '../../content/translations/en/grammar.json';
import enLessons from '../../content/translations/en/lessons.json';

// Translations - Tamil
import taVocab from '../../content/translations/ta/vocabulary.json';
import taKanji from '../../content/translations/ta/kanji.json';
import taGrammar from '../../content/translations/ta/grammar.json';
import taLessons from '../../content/translations/ta/lessons.json';

// Translations - Hindi
import hiVocab from '../../content/translations/hi/vocabulary.json';
import hiKanji from '../../content/translations/hi/kanji.json';
import hiGrammar from '../../content/translations/hi/grammar.json';
import hiLessons from '../../content/translations/hi/lessons.json';

// Manifest
import manifestData from '../../content/manifest.json';

const RAW_VOCAB: Record<JLPTLevel, RawVocabularyItem[]> = {
  N5: vN5 as RawVocabularyItem[],
  N4: vN4 as RawVocabularyItem[],
  N3: vN3 as RawVocabularyItem[],
  N2: vN2 as RawVocabularyItem[],
  N1: vN1 as RawVocabularyItem[]
};

const RAW_KANJI: Record<JLPTLevel, RawKanjiItem[]> = {
  N5: kN5 as RawKanjiItem[],
  N4: kN4 as RawKanjiItem[],
  N3: kN3 as RawKanjiItem[],
  N2: kN2 as RawKanjiItem[],
  N1: kN1 as RawKanjiItem[]
};

const RAW_GRAMMAR: Record<JLPTLevel, RawGrammarItem[]> = {
  N5: gN5 as RawGrammarItem[],
  N4: gN4 as RawGrammarItem[],
  N3: gN3 as RawGrammarItem[],
  N2: gN2 as RawGrammarItem[],
  N1: gN1 as RawGrammarItem[]
};

const RAW_LESSONS: Record<JLPTLevel, RawLessonItem[]> = {
  N5: lN5 as RawLessonItem[],
  N4: lN4 as RawLessonItem[],
  N3: lN3 as RawLessonItem[],
  N2: lN2 as RawLessonItem[],
  N1: lN1 as RawLessonItem[]
};

const TRANSLATIONS = {
  en: {
    vocab: enVocab as Record<string, VocabularyTranslation>,
    kanji: enKanji as Record<string, KanjiTranslation>,
    grammar: enGrammar as Record<string, GrammarTranslation>,
    lessons: enLessons as Record<string, LessonTranslation>
  },
  ta: {
    vocab: taVocab as Record<string, VocabularyTranslation>,
    kanji: taKanji as Record<string, KanjiTranslation>,
    grammar: taGrammar as Record<string, GrammarTranslation>,
    lessons: taLessons as Record<string, LessonTranslation>
  },
  hi: {
    vocab: hiVocab as Record<string, VocabularyTranslation>,
    kanji: hiKanji as Record<string, KanjiTranslation>,
    grammar: hiGrammar as Record<string, GrammarTranslation>,
    lessons: hiLessons as Record<string, LessonTranslation>
  }
};

export class ContentProvider {
  private currentLanguage: SupportedLanguage = 'en';

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  // ── Vocabulary ──────────────────────────────────────────────
  public getVocabulary(level: JLPTLevel, lang?: SupportedLanguage): LocalizedVocabularyItem[] {
    const targetLang = lang || this.currentLanguage;
    const items = RAW_VOCAB[level] || [];

    return items.map((raw) => {
      const enT = TRANSLATIONS.en.vocab[raw.id];
      const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.vocab[raw.id] : undefined;
      const activeT = localizedT || enT || { meaning: '', example: '' };

      return {
        ...raw,
        meaning: activeT.meaning || enT?.meaning || '',
        example: {
          jp: raw.example?.jp || '',
          translated: activeT.example || enT?.example || '',
          en: enT?.example || '',
          ta: TRANSLATIONS.ta.vocab[raw.id]?.example || '',
          hi: TRANSLATIONS.hi.vocab[raw.id]?.example || ''
        },
        translations: {
          en: enT,
          ta: TRANSLATIONS.ta.vocab[raw.id],
          hi: TRANSLATIONS.hi.vocab[raw.id]
        }
      };
    });
  }

  public getVocabularyById(id: string, lang?: SupportedLanguage): LocalizedVocabularyItem | null {
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const match = RAW_VOCAB[level].find((v) => v.id === id);
      if (match) {
        const targetLang = lang || this.currentLanguage;
        const enT = TRANSLATIONS.en.vocab[id];
        const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.vocab[id] : undefined;
        const activeT = localizedT || enT || { meaning: '', example: '' };

        return {
          ...match,
          meaning: activeT.meaning || enT?.meaning || '',
          example: {
            jp: match.example?.jp || '',
            translated: activeT.example || enT?.example || '',
            en: enT?.example || '',
            ta: TRANSLATIONS.ta.vocab[id]?.example || '',
            hi: TRANSLATIONS.hi.vocab[id]?.example || ''
          },
          translations: {
            en: enT,
            ta: TRANSLATIONS.ta.vocab[id],
            hi: TRANSLATIONS.hi.vocab[id]
          }
        };
      }
    }
    return null;
  }

  // ── Kanji ───────────────────────────────────────────────────
  public getKanji(level: JLPTLevel, lang?: SupportedLanguage): LocalizedKanjiItem[] {
    const targetLang = lang || this.currentLanguage;
    const items = RAW_KANJI[level] || [];

    return items.map((raw) => {
      const enT = TRANSLATIONS.en.kanji[raw.id];
      const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.kanji[raw.id] : undefined;
      const activeT = localizedT || enT || { meaning: '' };

      return {
        ...raw,
        meaning: activeT.meaning || enT?.meaning || '',
        translations: {
          en: enT,
          ta: TRANSLATIONS.ta.kanji[raw.id],
          hi: TRANSLATIONS.hi.kanji[raw.id]
        }
      };
    });
  }

  public getKanjiById(id: string, lang?: SupportedLanguage): LocalizedKanjiItem | null {
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const match = RAW_KANJI[level].find((k) => k.id === id || k.kanji === id);
      if (match) {
        const targetLang = lang || this.currentLanguage;
        const enT = TRANSLATIONS.en.kanji[match.id];
        const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.kanji[match.id] : undefined;
        const activeT = localizedT || enT || { meaning: '' };

        return {
          ...match,
          meaning: activeT.meaning || enT?.meaning || '',
          translations: {
            en: enT,
            ta: TRANSLATIONS.ta.kanji[match.id],
            hi: TRANSLATIONS.hi.kanji[match.id]
          }
        };
      }
    }
    return null;
  }

  // ── Grammar ─────────────────────────────────────────────────
  public getGrammar(level: JLPTLevel, lang?: SupportedLanguage): LocalizedGrammarItem[] {
    const targetLang = lang || this.currentLanguage;
    const items = RAW_GRAMMAR[level] || [];

    return items.map((raw) => {
      const enT = TRANSLATIONS.en.grammar[raw.id];
      const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.grammar[raw.id] : undefined;
      const activeT = localizedT || enT || { meaning: '', explanation: '', example: '' };

      return {
        ...raw,
        meaning: activeT.meaning || enT?.meaning || '',
        explanation: activeT.explanation || enT?.explanation || '',
        examples: (raw.examples || []).map((ex, idx) => ({
          jp: ex.jp,
          reading: ex.reading,
          translated: idx === 0 ? (activeT.example || enT?.example || '') : '',
          en: idx === 0 ? (enT?.example || '') : '',
          ta: idx === 0 ? (TRANSLATIONS.ta.grammar[raw.id]?.example || '') : '',
          hi: idx === 0 ? (TRANSLATIONS.hi.grammar[raw.id]?.example || '') : ''
        })),
        translations: {
          en: enT,
          ta: TRANSLATIONS.ta.grammar[raw.id],
          hi: TRANSLATIONS.hi.grammar[raw.id]
        }
      };
    });
  }

  public getGrammarById(id: string, lang?: SupportedLanguage): LocalizedGrammarItem | null {
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const match = RAW_GRAMMAR[level].find((g) => g.id === id);
      if (match) {
        const targetLang = lang || this.currentLanguage;
        const enT = TRANSLATIONS.en.grammar[id];
        const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.grammar[id] : undefined;
        const activeT = localizedT || enT || { meaning: '', explanation: '', example: '' };

        return {
          ...match,
          meaning: activeT.meaning || enT?.meaning || '',
          explanation: activeT.explanation || enT?.explanation || '',
          examples: (match.examples || []).map((ex, idx) => ({
            jp: ex.jp,
            reading: ex.reading,
            translated: idx === 0 ? (activeT.example || enT?.example || '') : '',
            en: idx === 0 ? (enT?.example || '') : '',
            ta: idx === 0 ? (TRANSLATIONS.ta.grammar[id]?.example || '') : '',
            hi: idx === 0 ? (TRANSLATIONS.hi.grammar[id]?.example || '') : ''
          })),
          translations: {
            en: enT,
            ta: TRANSLATIONS.ta.grammar[id],
            hi: TRANSLATIONS.hi.grammar[id]
          }
        };
      }
    }
    return null;
  }

  // ── Lessons ─────────────────────────────────────────────────
  public getLessons(level: JLPTLevel, lang?: SupportedLanguage): LocalizedLessonItem[] {
    const targetLang = lang || this.currentLanguage;
    const items = RAW_LESSONS[level] || [];

    return items.map((raw) => {
      const enT = TRANSLATIONS.en.lessons[raw.id];
      const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.lessons[raw.id] : undefined;
      const activeT = localizedT || enT || { title: raw.titleJp, description: '', culturalNote: '', dialogue: [] };

      return {
        ...raw,
        title: activeT.title || enT?.title || raw.titleJp,
        description: activeT.description || enT?.description || '',
        culturalNote: activeT.culturalNote || enT?.culturalNote || '',
        dialogue: (raw.dialogue || []).map((d, i) => ({
          speaker: d.speaker,
          jp: d.jp,
          translated: activeT.dialogue?.[i] || enT?.dialogue?.[i] || ''
        })),
        translations: {
          en: enT,
          ta: TRANSLATIONS.ta.lessons[raw.id],
          hi: TRANSLATIONS.hi.lessons[raw.id]
        }
      };
    });
  }

  public getLessonById(id: string, lang?: SupportedLanguage): LocalizedLessonItem | null {
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const match = RAW_LESSONS[level].find((l) => l.id === id);
      if (match) {
        const targetLang = lang || this.currentLanguage;
        const enT = TRANSLATIONS.en.lessons[id];
        const localizedT = targetLang !== 'en' ? TRANSLATIONS[targetLang]?.lessons[id] : undefined;
        const activeT = localizedT || enT || { title: match.titleJp, description: '', culturalNote: '', dialogue: [] };

        return {
          ...match,
          title: activeT.title || enT?.title || match.titleJp,
          description: activeT.description || enT?.description || '',
          culturalNote: activeT.culturalNote || enT?.culturalNote || '',
          dialogue: (match.dialogue || []).map((d, i) => ({
            speaker: d.speaker,
            jp: d.jp,
            translated: activeT.dialogue?.[i] || enT?.dialogue?.[i] || ''
          })),
          translations: {
            en: enT,
            ta: TRANSLATIONS.ta.lessons[id],
            hi: TRANSLATIONS.hi.lessons[id]
          }
        };
      }
    }
    return null;
  }

  // ── Universal Search ────────────────────────────────────────
  public search(query: string, lang?: SupportedLanguage): ContentSearchResult[] {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results: ContentSearchResult[] = [];
    const targetLang = lang || this.currentLanguage;

    // Search Vocabulary
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const vocabList = this.getVocabulary(level, targetLang);
      for (const v of vocabList) {
        if (v.word.toLowerCase().includes(q)) {
          results.push({ type: 'vocabulary', id: v.id, level, title: v.word, reading: v.reading, meaning: v.meaning, matchField: 'word' });
        } else if (v.reading.toLowerCase().includes(q) || (v.romaji && v.romaji.toLowerCase().includes(q))) {
          results.push({ type: 'vocabulary', id: v.id, level, title: v.word, reading: v.reading, meaning: v.meaning, matchField: 'reading' });
        } else if (v.meaning.toLowerCase().includes(q)) {
          results.push({ type: 'vocabulary', id: v.id, level, title: v.word, reading: v.reading, meaning: v.meaning, matchField: 'meaning' });
        }
      }
    }

    // Search Kanji
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const kanjiList = this.getKanji(level, targetLang);
      for (const k of kanjiList) {
        if (k.kanji === q) {
          results.push({ type: 'kanji', id: k.id, level, title: k.kanji, meaning: k.meaning, matchField: 'kanji' });
        } else if (k.meaning.toLowerCase().includes(q)) {
          results.push({ type: 'kanji', id: k.id, level, title: k.kanji, meaning: k.meaning, matchField: 'meaning' });
        }
      }
    }

    // Search Grammar
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]) {
      const grammarList = this.getGrammar(level, targetLang);
      for (const g of grammarList) {
        if (g.pattern.toLowerCase().includes(q) || (g.romaji && g.romaji.toLowerCase().includes(q))) {
          results.push({ type: 'grammar', id: g.id, level, title: g.pattern, meaning: g.meaning, matchField: 'pattern' });
        } else if (g.meaning.toLowerCase().includes(q)) {
          results.push({ type: 'grammar', id: g.id, level, title: g.pattern, meaning: g.meaning, matchField: 'meaning' });
        }
      }
    }

    return results;
  }

  // ── Manifest and Counts ─────────────────────────────────────
  public getManifest() {
    return manifestData;
  }

  public getCounts() {
    return manifestData.stats;
  }
}

export const contentProvider = new ContentProvider();
export default contentProvider;
