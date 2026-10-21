// src/data/canonical/index.ts
// Single source of truth index constructed directly from clean content architecture

import vN5 from '../../../content/vocabulary/n5.json'
import vN4 from '../../../content/vocabulary/n4.json'
import vN3 from '../../../content/vocabulary/n3.json'
import vN2 from '../../../content/vocabulary/n2.json'
import vN1 from '../../../content/vocabulary/n1.json'

import kN5 from '../../../content/kanji/n5.json'
import kN4 from '../../../content/kanji/n4.json'
import kN3 from '../../../content/kanji/n3.json'
import kN2 from '../../../content/kanji/n2.json'
import kN1 from '../../../content/kanji/n1.json'

import gN5 from '../../../content/grammar/n5.json'
import gN4 from '../../../content/grammar/n4.json'
import gN3 from '../../../content/grammar/n3.json'
import gN2 from '../../../content/grammar/n2.json'
import gN1 from '../../../content/grammar/n1.json'

import lN5 from '../../../content/lessons/n5.json'
import lN4 from '../../../content/lessons/n4.json'
import lN3 from '../../../content/lessons/n3.json'
import lN2 from '../../../content/lessons/n2.json'
import lN1 from '../../../content/lessons/n1.json'

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

const rawVocab = [...vN5, ...vN4, ...vN3, ...vN2, ...vN1] as any[]
const rawKanji = [...kN5, ...kN4, ...kN3, ...kN2, ...kN1] as any[]
const rawGrammar = [...gN5, ...gN4, ...gN3, ...gN2, ...gN1] as any[]
const rawLessons = [...lN5, ...lN4, ...lN3, ...lN2, ...lN1] as any[]

export const CANONICAL_CURRICULUM: CanonicalCurriculum = {
  vocabulary: rawVocab.map((v) => ({
    id: v.id,
    word: v.word,
    reading: v.reading,
    romaji: v.romaji || '',
    partOfSpeech: v.pos || v.partOfSpeech || 'noun',
    level: v.level,
    example: { jp: v.example?.jp || '' },
  })),
  kanji: rawKanji.map((k) => ({
    id: k.id,
    kanji: k.kanji,
    readings: k.readings || { on: [], kun: [] },
    strokeCount: k.strokeCount || 0,
    level: k.level,
    radical: k.radical || '',
    examples: (k.examples || []).map((e: any) => ({ word: typeof e === 'string' ? e : e.word })),
  })),
  grammar: rawGrammar.map((g) => ({
    id: g.id,
    pattern: g.pattern,
    romaji: g.romaji || '',
    formation: g.formation || '',
    level: g.level,
    examples: (g.examples || []).map((e: any) => ({ jp: e.jp, reading: e.reading || '' })),
    tags: g.tags || [],
  })),
  lessons: rawLessons.map((l) => ({
    id: l.id,
    titleJp: l.titleJp || l.title,
    level: l.level,
    order: l.order || 1,
    duration: l.duration || '20 min',
    xp: l.xp || 50,
    vocabulary: l.vocabulary || [],
    grammar: l.grammar || [],
    dialogue: (l.dialogue || []).map((d: any) => ({ speaker: d.speaker, jp: d.jp })),
  })),
}

export const CANONICAL_VOCABULARY = CANONICAL_CURRICULUM.vocabulary
export const CANONICAL_KANJI = CANONICAL_CURRICULUM.kanji
export const CANONICAL_GRAMMAR = CANONICAL_CURRICULUM.grammar
export const CANONICAL_LESSONS = CANONICAL_CURRICULUM.lessons

// Fast lookup index by ID
export const CANONICAL_INDEX = new Map<
  string,
  {
    type: 'vocabulary' | 'kanji' | 'grammar' | 'lesson'
    item: CanonicalVocabularyItem | CanonicalKanjiItem | CanonicalGrammarItem | CanonicalLessonItem
  }
>()

CANONICAL_VOCABULARY.forEach((v) => CANONICAL_INDEX.set(v.id, { type: 'vocabulary', item: v }))
CANONICAL_KANJI.forEach((k) => CANONICAL_INDEX.set(k.id, { type: 'kanji', item: k }))
CANONICAL_GRAMMAR.forEach((g) => CANONICAL_INDEX.set(g.id, { type: 'grammar', item: g }))
CANONICAL_LESSONS.forEach((l) => CANONICAL_INDEX.set(l.id, { type: 'lesson', item: l }))

export default CANONICAL_CURRICULUM
