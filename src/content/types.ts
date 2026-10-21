// src/content/types.ts
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type SupportedLanguage = 'en' | 'ta' | 'hi';

// Raw Content Items (Language-Agnostic)
export interface RawVocabularyItem {
  id: string;
  word: string;
  reading: string;
  romaji?: string;
  pos: string;
  level: JLPTLevel;
  tags?: string[];
  example?: {
    jp: string;
  };
  audio?: string;
  related?: string[];
}

export interface RawKanjiItem {
  id: string;
  kanji: string;
  readings: {
    on: string[];
    kun: string[];
  };
  strokeCount: number;
  level: JLPTLevel;
  radical?: string;
  examples?: {
    word: string;
    reading?: string;
    meaning?: string;
  }[];
}

export interface RawGrammarItem {
  id: string;
  pattern: string;
  romaji?: string;
  formation: string;
  level: JLPTLevel;
  tags?: string[];
  examples?: {
    jp: string;
    reading?: string;
  }[];
}

export interface RawLessonItem {
  id: string;
  titleJp: string;
  level: JLPTLevel;
  order: number;
  duration: string;
  xp: number;
  vocabulary: string[];
  grammar: string[];
  dialogue?: {
    speaker: string;
    jp: string;
  }[];
  exercises?: any[];
  culturalNote?: string;
}

// Translations
export interface VocabularyTranslation {
  meaning: string;
  notes?: string;
  example?: string;
}

export interface KanjiTranslation {
  meaning: string;
}

export interface GrammarTranslation {
  meaning: string;
  explanation: string;
  example?: string;
}

export interface LessonTranslation {
  title: string;
  description: string;
  culturalNote?: string;
  dialogue?: string[];
}

// Enriched / Localized Items (Used by UI components)
export interface LocalizedVocabularyItem extends RawVocabularyItem {
  meaning: string;
  example: {
    jp: string;
    translated?: string;
    en?: string;
    ta?: string;
    hi?: string;
  };
  translations: {
    en?: VocabularyTranslation;
    ta?: VocabularyTranslation;
    hi?: VocabularyTranslation;
  };
}

export interface LocalizedKanjiItem extends RawKanjiItem {
  meaning: string;
  translations: {
    en?: KanjiTranslation;
    ta?: KanjiTranslation;
    hi?: KanjiTranslation;
  };
}

export interface LocalizedGrammarItem extends RawGrammarItem {
  meaning: string;
  explanation: string;
  examples: {
    jp: string;
    reading?: string;
    translated?: string;
    en?: string;
    ta?: string;
    hi?: string;
  }[];
  translations: {
    en?: GrammarTranslation;
    ta?: GrammarTranslation;
    hi?: GrammarTranslation;
  };
}

export interface LocalizedLessonItem extends RawLessonItem {
  title: string;
  description: string;
  culturalNote: string;
  dialogue: {
    speaker: string;
    jp: string;
    translated?: string;
  }[];
  translations: {
    en?: LessonTranslation;
    ta?: LessonTranslation;
    hi?: LessonTranslation;
  };
}

// Search
export interface ContentSearchResult {
  type: 'vocabulary' | 'kanji' | 'grammar' | 'lesson';
  id: string;
  level: JLPTLevel;
  title: string;
  reading?: string;
  meaning: string;
  matchField: string;
}
