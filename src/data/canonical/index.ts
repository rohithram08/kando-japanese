import canonicalData from './canonicalCurriculum.json'

export interface CanonicalVocabularyItem {
  id: string
  word: string
  reading: string
  romaji: string
  partOfSpeech: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  example: {
    jp: string
  }
}

export interface CanonicalKanjiItem {
  id: string
  kanji: string
  readings: {
    on: string[]
    kun: string[]
  }
  strokeCount: number
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  radical: string
  examples: {
    word: string
  }[]
}

export interface CanonicalGrammarItem {
  id: string
  pattern: string
  romaji: string
  formation: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  examples: {
    jp: string
    reading?: string
  }[]
  tags: string[]
}

export interface CanonicalLessonItem {
  id: string
  titleJp: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  order: number
  duration: string
  xp: number
  vocabulary: string[]
  grammar: string[]
  dialogue: {
    speaker: string
    jp: string
  }[]
}

export interface CanonicalCurriculum {
  vocabulary: CanonicalVocabularyItem[]
  kanji: CanonicalKanjiItem[]
  grammar: CanonicalGrammarItem[]
  lessons: CanonicalLessonItem[]
}

export const CANONICAL_CURRICULUM: CanonicalCurriculum = canonicalData as CanonicalCurriculum

export const CANONICAL_VOCABULARY = CANONICAL_CURRICULUM.vocabulary
export const CANONICAL_KANJI = CANONICAL_CURRICULUM.kanji
export const CANONICAL_GRAMMAR = CANONICAL_CURRICULUM.grammar
export const CANONICAL_LESSONS = CANONICAL_CURRICULUM.lessons

// Fast lookup index by ID
export const CANONICAL_INDEX = new Map<string, {
  type: 'vocabulary' | 'kanji' | 'grammar' | 'lesson'
  item: CanonicalVocabularyItem | CanonicalKanjiItem | CanonicalGrammarItem | CanonicalLessonItem
}>()

CANONICAL_VOCABULARY.forEach(v => CANONICAL_INDEX.set(v.id, { type: 'vocabulary', item: v }))
CANONICAL_KANJI.forEach(k => CANONICAL_INDEX.set(k.id, { type: 'kanji', item: k }))
CANONICAL_GRAMMAR.forEach(g => CANONICAL_INDEX.set(g.id, { type: 'grammar', item: g }))
CANONICAL_LESSONS.forEach(l => CANONICAL_INDEX.set(l.id, { type: 'lesson', item: l }))
