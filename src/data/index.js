// ─────────────────────────────────────────────────────────────
// src/data/index.js  –  Single source of truth for all content
// Normalises every data file into one consistent shape so pages
// never have to worry about default vs named exports.
// ─────────────────────────────────────────────────────────────

// ── Grammar ──────────────────────────────────────────────────
import n1Grammar      from './grammar/n1_grammar'
import n2Grammar      from './grammar/n2_grammar'
import { N3_GRAMMAR } from './grammar/n3_grammar'
import { N4_GRAMMAR } from './grammar/n4_grammar'
import { N5_GRAMMAR } from './grammar/n5_grammar'

// ── Kanji ────────────────────────────────────────────────────
import n1Kanji        from './kanji/n1_kanji'
import n2Kanji        from './kanji/n2_kanji'
import { N3_KANJI }   from './kanji/n3_kanji'
import { N4_KANJI }   from './kanji/n4_kanji'
import { N5_KANJI }   from './kanji/n5_kanji'

// ── Vocabulary ───────────────────────────────────────────────
import n1Vocabulary        from './vocabulary/n1_vocabulary'
import n2Vocabulary        from './vocabulary/n2_vocabulary'
import n3Vocabulary        from './vocabulary/n3_vocabulary'
import n4Vocabulary        from './vocabulary/n4_vocabulary'
import { N5_VOCABULARY }   from './vocabulary/n5_vocabulary'

// ── Lessons ──────────────────────────────────────────────────
import n1Lessons      from './lessons/n1_lessons'
import n2Lessons      from './lessons/n2_lessons'
import n3Lessons      from './lessons/n3_lessons'
import n4Lessons      from './lessons/n4_lessons'
import n5Lessons      from './lessons/n5_lessons'

// ─────────────────────────────────────────────────────────────
// GRAMMAR  – normalise N3/N4/N5 named-export arrays to match
//            N1/N2 default-export shape
// ─────────────────────────────────────────────────────────────
const normaliseGrammar = (arr, level) =>
  arr.map((g, i) => ({
    id:          g.id || `${level.toLowerCase()}g${String(i + 1).padStart(3, '0')}`,
    pattern:     g.pattern,
    romaji:      g.romaji      || '',
    meaning:     g.meaning_en  || g.meaning || '',
    level:       g.jlpt_level  || g.level   || level,
    formation:   g.structure   || g.formation || '',
    explanation: g.explanation_en || g.explanation || '',
    examples: (g.examples || []).map((e) => ({
      jp: e.jp,
      en: e.en,
    })),
    notes: g.notes || '',
    tags:  g.tags  || [],
  }))

export const GRAMMAR = {
  N1: normaliseGrammar(n1Grammar,  'N1'),
  N2: normaliseGrammar(n2Grammar,  'N2'),
  N3: normaliseGrammar(N3_GRAMMAR, 'N3'),
  N4: normaliseGrammar(N4_GRAMMAR, 'N4'),
  N5: normaliseGrammar(N5_GRAMMAR, 'N5'),
}

// ─────────────────────────────────────────────────────────────
// KANJI – normalise N3/N4/N5 (flat objects) to match N1/N2
// ─────────────────────────────────────────────────────────────
const normaliseKanji = (arr, level) =>
  arr.map((k, i) => {
    // N1/N2 shape: { id, kanji, readings, meaning, examples, strokeCount, level, radical }
    // N3/N4/N5 shape: { char, en, ta, hi, on, kun, strokes, examples? }
    if (k.kanji) return { ...k }          // already N1/N2 shape
    return {
      id:         `${level.toLowerCase()}k${String(i + 1).padStart(3, '0')}`,
      kanji:      k.char,
      readings: {
        on:  k.on  ? k.on.split('/').map((s) => s.trim())  : [],
        kun: k.kun ? k.kun.split('/').map((s) => s.trim()) : [],
      },
      meaning:     k.en,
      meaning_ta:  k.ta || '',
      meaning_hi:  k.hi || '',
      examples:   (k.examples || []).map((ex) =>
        typeof ex === 'string'
          ? { word: ex, reading: '', meaning: '' }
          : ex
      ),
      strokeCount: k.strokes || 0,
      level,
      radical:     '',
    }
  })

export const KANJI = {
  N1: normaliseKanji(n1Kanji,  'N1'),
  N2: normaliseKanji(n2Kanji,  'N2'),
  N3: normaliseKanji(N3_KANJI, 'N3'),
  N4: normaliseKanji(N4_KANJI, 'N4'),
  N5: normaliseKanji(N5_KANJI, 'N5'),
}

// ─────────────────────────────────────────────────────────────
// VOCABULARY – normalise N5 named-export shape to match N1–N4
// ─────────────────────────────────────────────────────────────
const normaliseVocab = (arr, level) =>
  arr.map((v, i) => {
    if (v.word && v.reading && v.meaning) return v   // N1–N4 shape (already has a unique id)
    // N5 shape
    return {
      id:           `${level.toLowerCase()}v${String(i + 1).padStart(3, '0')}`,
      word:         v.word,
      reading:      v.reading,
      romaji:       v.romaji || '',
      meaning:      v.en,
      meaning_ta:   v.ta || '',
      meaning_hi:   v.hi || '',
      partOfSpeech: v.pos || '',
      level:        v.level,
      example: {
        jp: v.example_jp || '',
        en: v.example_en || '',
      },
    }
  })

export const VOCABULARY = {
  N1: normaliseVocab(n1Vocabulary, 'N1'),
  N2: normaliseVocab(n2Vocabulary, 'N2'),
  N3: normaliseVocab(n3Vocabulary, 'N3'),
  N4: normaliseVocab(n4Vocabulary, 'N4'),
  N5: normaliseVocab(N5_VOCABULARY, 'N5'),
}

// ─────────────────────────────────────────────────────────────
// LESSONS – all already default-export arrays, consistent shape
// ─────────────────────────────────────────────────────────────
export const LESSONS = {
  N1: n1Lessons,
  N2: n2Lessons,
  N3: n3Lessons,
  N4: n4Lessons,
  N5: n5Lessons,
}

// ─────────────────────────────────────────────────────────────
import { LEVEL_META, LEVELS } from './levels'
export { LEVEL_META, LEVELS }

// ── Kana ─────────────────────────────────────────────────────
export * from './kana/kanaData'

// Counts for display
export const DATA_COUNTS = {
  grammar:    Object.fromEntries(LEVELS.map((l) => [l, GRAMMAR[l].length])),
  kanji:      Object.fromEntries(LEVELS.map((l) => [l, KANJI[l].length])),
  vocabulary: Object.fromEntries(LEVELS.map((l) => [l, VOCABULARY[l].length])),
  lessons:    Object.fromEntries(LEVELS.map((l) => [l, LESSONS[l].length])),
}