// src/data/index.js — Unified Data Facade powered by the clean Content Architecture
import { contentProvider } from '../content/provider'
import { LEVEL_META, LEVELS } from './levels.js'

export { LEVEL_META, LEVELS }
export * from './kana/kanaData.js'

const ALL_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5']

const buildVocabulary = () => {
  const result = {}
  for (const lvl of ALL_LEVELS) {
    const items = contentProvider.getVocabulary(lvl, 'en')
    result[lvl] = items.map((v) => ({
      id: v.id,
      word: v.word,
      reading: v.reading,
      romaji: v.romaji || '',
      meaning: v.meaning,
      meaning_ta: v.translations.ta?.meaning || undefined,
      meaning_hi: v.translations.hi?.meaning || undefined,
      partOfSpeech: v.pos,
      level: v.level,
      example: {
        jp: v.example.jp,
        en: v.example.en || '',
        ta: v.example.ta || undefined,
        hi: v.example.hi || undefined,
      },
    }))
  }
  return result
}

const buildKanji = () => {
  const result = {}
  for (const lvl of ALL_LEVELS) {
    const items = contentProvider.getKanji(lvl, 'en')
    result[lvl] = items.map((k) => ({
      id: k.id,
      kanji: k.kanji,
      readings: k.readings,
      meaning: k.meaning,
      meaning_ta: k.translations.ta?.meaning || undefined,
      meaning_hi: k.translations.hi?.meaning || undefined,
      examples: k.examples || [],
      strokeCount: k.strokeCount,
      level: k.level,
      radical: k.radical || '',
    }))
  }
  return result
}

const buildGrammar = () => {
  const result = {}
  for (const lvl of ALL_LEVELS) {
    const items = contentProvider.getGrammar(lvl, 'en')
    result[lvl] = items.map((g) => ({
      id: g.id,
      pattern: g.pattern,
      romaji: g.romaji || '',
      meaning: g.meaning,
      meaning_ta: g.translations.ta?.meaning || undefined,
      meaning_hi: g.translations.hi?.meaning || undefined,
      level: g.level,
      formation: g.formation,
      explanation: g.explanation,
      explanation_ta: g.translations.ta?.explanation || undefined,
      explanation_hi: g.translations.hi?.explanation || undefined,
      examples: g.examples.map((e) => ({
        jp: e.jp,
        reading: e.reading || '',
        en: e.en || '',
        ta: e.ta || undefined,
        hi: e.hi || undefined,
      })),
      notes: '',
      tags: g.tags || [],
    }))
  }
  return result
}

const buildLessons = () => {
  const result = {}
  for (const lvl of ALL_LEVELS) {
    const items = contentProvider.getLessons(lvl, 'en')
    result[lvl] = items.map((l) => ({
      id: l.id,
      title: l.title,
      titleJp: l.titleJp,
      level: l.level,
      order: l.order,
      duration: l.duration,
      xp: l.xp,
      description: l.description,
      vocabulary: l.vocabulary,
      grammar: l.grammar,
      dialogue: (l.dialogue || []).map((d) => ({
        speaker: d.speaker,
        jp: d.jp,
        en: d.translated || '',
      })),
      exercises: l.exercises || [],
      culturalNote: l.culturalNote || '',
    }))
  }
  return result
}

export const VOCABULARY = buildVocabulary()
export const KANJI = buildKanji()
export const GRAMMAR = buildGrammar()
export const LESSONS = buildLessons()

export const DATA_COUNTS = {
  grammar: Object.fromEntries(LEVELS.map((l) => [l, GRAMMAR[l].length])),
  kanji: Object.fromEntries(LEVELS.map((l) => [l, KANJI[l].length])),
  vocabulary: Object.fromEntries(LEVELS.map((l) => [l, VOCABULARY[l].length])),
  lessons: Object.fromEntries(LEVELS.map((l) => [l, LESSONS[l].length])),
}