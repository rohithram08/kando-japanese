import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Raw imports
import { N5_VOCABULARY } from '../src/data/vocabulary/n5_vocabulary.js'
import n4Vocabulary from '../src/data/vocabulary/n4_vocabulary.js'
import n3Vocabulary from '../src/data/vocabulary/n3_vocabulary.js'
import n2Vocabulary from '../src/data/vocabulary/n2_vocabulary.js'
import n1Vocabulary from '../src/data/vocabulary/n1_vocabulary.js'

import { N5_KANJI } from '../src/data/kanji/n5_kanji.js'
import { N4_KANJI } from '../src/data/kanji/n4_kanji.js'
import { N3_KANJI } from '../src/data/kanji/n3_kanji.js'
import n2Kanji from '../src/data/kanji/n2_kanji.js'
import n1Kanji from '../src/data/kanji/n1_kanji.js'

import { N5_GRAMMAR } from '../src/data/grammar/n5_grammar.js'
import { N4_GRAMMAR } from '../src/data/grammar/n4_grammar.js'
import { N3_GRAMMAR } from '../src/data/grammar/n3_grammar.js'
import n2Grammar from '../src/data/grammar/n2_grammar.js'
import n1Grammar from '../src/data/grammar/n1_grammar.js'

import n5Lessons from '../src/data/lessons/n5_lessons.js'
import n4Lessons from '../src/data/lessons/n4_lessons.js'
import n3Lessons from '../src/data/lessons/n3_lessons.js'
import n2Lessons from '../src/data/lessons/n2_lessons.js'
import n1Lessons from '../src/data/lessons/n1_lessons.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

// 1. Build Canonical Items & Locales
const canonical = {
  vocabulary: [],
  kanji: [],
  grammar: [],
  lessons: []
}

const locales = {
  en: { curriculum: {}, ui: {} },
  ta: { curriculum: {}, ui: {} },
  hi: { curriculum: {}, ui: {} }
}

// ── VOCABULARY ──────────────────────────────────────────
// N5
N5_VOCABULARY.forEach((v, i) => {
  const id = `n5v${String(i + 1).padStart(3, '0')}`
  canonical.vocabulary.push({
    id,
    word: v.word,
    reading: v.reading,
    romaji: v.romaji || '',
    partOfSpeech: v.pos || '',
    level: 'N5',
    example: {
      jp: v.example_jp || ''
    }
  })

  // Translations
  locales.en.curriculum[id] = {
    meaning: v.en || '',
    example: v.example_en || ''
  }
  if (v.ta) {
    locales.ta.curriculum[id] = {
      meaning: v.ta,
      example: v.example_ta || ''
    }
  }
  if (v.hi) {
    locales.hi.curriculum[id] = {
      meaning: v.hi,
      example: v.example_hi || ''
    }
  }
})

// N4, N3, N2, N1 Vocab
const higherVocab = [
  { arr: n4Vocabulary, level: 'N4' },
  { arr: n3Vocabulary, level: 'N3' },
  { arr: n2Vocabulary, level: 'N2' },
  { arr: n1Vocabulary, level: 'N1' },
]

higherVocab.forEach(({ arr, level }) => {
  arr.forEach((v) => {
    const id = v.id
    canonical.vocabulary.push({
      id,
      word: v.word,
      reading: v.reading,
      romaji: v.romaji || '',
      partOfSpeech: v.partOfSpeech || '',
      level,
      example: {
        jp: v.example?.jp || ''
      }
    })

    locales.en.curriculum[id] = {
      meaning: v.meaning || '',
      example: v.example?.en || ''
    }
  })
})

// ── KANJI ───────────────────────────────────────────────
// N5, N4, N3 Flat shape: { char, en, ta, hi, on, kun, strokes, examples }
const flatKanji = [
  { arr: N5_KANJI, level: 'N5' },
  { arr: N4_KANJI, level: 'N4' },
  { arr: N3_KANJI, level: 'N3' },
]

flatKanji.forEach(({ arr, level }) => {
  arr.forEach((k, i) => {
    const id = `${level.toLowerCase()}k${String(i + 1).padStart(3, '0')}`
    canonical.kanji.push({
      id,
      kanji: k.char,
      readings: {
        on: k.on ? k.on.split('/').map(s => s.trim()).filter(Boolean) : [],
        kun: k.kun ? k.kun.split('/').map(s => s.trim()).filter(Boolean) : []
      },
      strokeCount: k.strokes || 0,
      level,
      radical: '',
      examples: (k.examples || []).map(ex => typeof ex === 'string' ? { word: ex } : { word: ex.word })
    })

    locales.en.curriculum[id] = {
      meaning: k.en || ''
    }
    if (k.ta) {
      locales.ta.curriculum[id] = {
        meaning: k.ta
      }
    }
    if (k.hi) {
      locales.hi.curriculum[id] = {
        meaning: k.hi
      }
    }
  })
})

// N2, N1 Structured shape: { id, kanji, readings, meaning, strokeCount, level, radical, examples }
const structKanji = [
  { arr: n2Kanji, level: 'N2' },
  { arr: n1Kanji, level: 'N1' },
]

structKanji.forEach(({ arr, level }) => {
  arr.forEach(k => {
    const id = k.id
    canonical.kanji.push({
      id,
      kanji: k.kanji,
      readings: {
        on: Array.isArray(k.readings?.on) ? k.readings.on : [],
        kun: Array.isArray(k.readings?.kun) ? k.readings.kun : []
      },
      strokeCount: k.strokeCount || 0,
      level,
      radical: k.radical || '',
      examples: (k.examples || []).map(ex => ({ word: ex.word || '' }))
    })

    locales.en.curriculum[id] = {
      meaning: k.meaning || ''
    }
  })
})

// ── GRAMMAR ─────────────────────────────────────────────
// N5, N4, N3
const rawGrammar = [
  { arr: N5_GRAMMAR, level: 'N5' },
  { arr: N4_GRAMMAR, level: 'N4' },
  { arr: N3_GRAMMAR, level: 'N3' },
]

rawGrammar.forEach(({ arr, level }) => {
  arr.forEach(g => {
    const id = g.id
    canonical.grammar.push({
      id,
      pattern: g.pattern,
      romaji: g.romaji || '',
      formation: g.structure || g.formation || '',
      level: g.jlpt_level || level,
      examples: (g.examples || []).map(e => ({ jp: e.jp, reading: e.reading || '' })),
      tags: g.tags || []
    })

    locales.en.curriculum[id] = {
      meaning: g.meaning_en || g.meaning || '',
      explanation: g.explanation_en || g.explanation || '',
      notes: g.notes || '',
      examples: (g.examples || []).map(e => e.en || '')
    }

    if (g.meaning_ta || g.explanation_ta) {
      locales.ta.curriculum[id] = {
        meaning: g.meaning_ta || '',
        explanation: g.explanation_ta || '',
        examples: (g.examples || []).map(e => e.ta || '')
      }
    }

    if (g.meaning_hi || g.explanation_hi) {
      locales.hi.curriculum[id] = {
        meaning: g.meaning_hi || '',
        explanation: g.explanation_hi || '',
        examples: (g.examples || []).map(e => e.hi || '')
      }
    }
  })
})

// N2, N1 Grammar
const higherGrammar = [
  { arr: n2Grammar, level: 'N2' },
  { arr: n1Grammar, level: 'N1' },
]

higherGrammar.forEach(({ arr, level }) => {
  arr.forEach((g, i) => {
    const id = g.id || `${level.toLowerCase()}g${String(i + 1).padStart(3, '0')}`
    canonical.grammar.push({
      id,
      pattern: g.pattern,
      romaji: g.romaji || '',
      formation: g.formation || g.structure || '',
      level,
      examples: (g.examples || []).map(e => ({ jp: e.jp })),
      tags: g.tags || []
    })

    locales.en.curriculum[id] = {
      meaning: g.meaning || '',
      explanation: g.explanation || '',
      notes: g.notes || '',
      examples: (g.examples || []).map(e => e.en || '')
    }
  })
})

// ── LESSONS ─────────────────────────────────────────────
const allLessons = [
  { arr: n5Lessons, level: 'N5' },
  { arr: n4Lessons, level: 'N4' },
  { arr: n3Lessons, level: 'N3' },
  { arr: n2Lessons, level: 'N2' },
  { arr: n1Lessons, level: 'N1' },
]

allLessons.forEach(({ arr, level }) => {
  arr.forEach(l => {
    const id = l.id
    canonical.lessons.push({
      id,
      titleJp: l.titleJp || '',
      level: l.level || level,
      order: l.order || 0,
      duration: l.duration || '',
      xp: l.xp || 50,
      vocabulary: l.vocabulary || [],
      grammar: l.grammar || [],
      dialogue: (l.dialogue || []).map(d => ({ speaker: d.speaker, jp: d.jp })),
    })

    locales.en.curriculum[id] = {
      title: l.title || '',
      description: l.description || '',
      dialogue: (l.dialogue || []).map(d => d.en || ''),
      culturalNote: l.culturalNote || ''
    }
  })
})

// ── UI Strings ──────────────────────────────────────────
locales.en.ui = {
  nav: {
    dashboard: 'Dashboard',
    learn: 'Learn',
    practice: 'Practice',
    journey: 'Your Journey',
    kana: 'Kana Studio',
    lessons: 'Lessons',
    kanji: 'Kanji',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    reading: 'Reading Immersion',
    srs: 'SRS Reviews',
    quiz: 'Quizzes',
    speech: 'Speech & Audio',
    chat: 'Chat Dojo',
    sensei: 'AI Sensei',
    drama: 'Drama Lab',
    achievements: 'Achievements',
    progress: 'Progress & Stats',
    settings: 'Settings'
  },
  common: {
    language: 'Display & Translation Language',
    search: 'Search...',
    all: 'All',
    level: 'Level',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    complete: 'Complete',
    addToSrs: 'Add to SRS',
    inSrs: 'In SRS Deck',
    meaning: 'Meaning',
    reading: 'Reading',
    examples: 'Examples',
    explanation: 'Explanation',
    pattern: 'Pattern',
    practice: 'Practice',
    studyTips: 'Study Tips',
    handwritten: 'Curated Translation',
    fallbackEnglish: 'English (Fallback)'
  },
  settings: {
    title: 'Settings',
    displayLanguageTitle: 'Display & Translation Language',
    displayLanguageDescription: 'Language used for platform interface labels and curriculum translations.',
    jlptLevelTitle: 'Target JLPT Level',
    appearanceTitle: 'Appearance',
    studyPreferencesTitle: 'Study Preferences'
  }
}

locales.ta.ui = {
  nav: {
    dashboard: 'முகப்பு பலகை',
    learn: 'கற்க',
    practice: 'பயிற்சி',
    journey: 'உங்கள் பயணம்',
    kana: 'கானா ஸ்டுடியோ',
    lessons: 'பாடங்கள்',
    kanji: 'கான்ஜி',
    vocabulary: 'சொற்களஞ்சியம்',
    grammar: 'இலக்கணம்',
    reading: 'வாசிப்பு பயிற்சி',
    srs: 'நினைவாற்றல் பயிற்சி',
    quiz: 'வினாடி வினா',
    speech: 'பேச்சு & உச்சரிப்பு',
    chat: 'உரையாடல் டோஜோ',
    sensei: 'சென்செய் வழிகாட்டி',
    drama: 'நாடக ஆய்வகம்',
    achievements: 'சாதனைகள்',
    progress: 'முன்னேற்றம்',
    settings: 'அமைப்புகள்'
  },
  common: {
    language: 'காட்சி & மொழிபெயர்ப்பு மொழி',
    search: 'தேடுக...',
    all: 'அனைத்தும்',
    level: 'நிலை',
    loading: 'ஏற்றுகிறது...',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    back: 'பின்செல்',
    next: 'அடுத்து',
    previous: 'முந்தைய',
    complete: 'முடிந்தது',
    addToSrs: 'SRS-ல் சேர்',
    inSrs: 'SRS-ல் உள்ளது',
    meaning: 'பொருள்',
    reading: 'வாசிப்பு',
    examples: 'உதாரணங்கள்',
    explanation: 'விளக்கம்',
    pattern: 'வடிவம்',
    practice: 'பயிற்சி',
    studyTips: 'படிப்பு குறிப்புகள்',
    handwritten: 'கைப்பட மொழிபெயர்ப்பு',
    fallbackEnglish: 'ஆங்கிலம் (மாற்று)'
  },
  settings: {
    title: 'அமைப்புகள்',
    displayLanguageTitle: 'காட்சி & மொழிபெயர்ப்பு மொழி',
    displayLanguageDescription: 'தள இடைமுகம் மற்றும் பாட மொழிபெயர்ப்புகளுக்கான மொழி.',
    jlptLevelTitle: 'இலக்கு JLPT நிலை',
    appearanceTitle: 'தோற்றம்',
    studyPreferencesTitle: 'படிப்பு விருப்பங்கள்'
  }
}

locales.hi.ui = {
  nav: {
    dashboard: 'डैशबोर्ड',
    learn: 'सीखें',
    practice: 'अभ्यास',
    journey: 'आपकी यात्रा',
    kana: 'काना स्टूडियो',
    lessons: 'पाठ',
    kanji: 'कांजी',
    vocabulary: 'शब्दावली',
    grammar: 'व्याकरण',
    reading: 'पठन अभ्यास',
    srs: 'स्मृति समीक्षा',
    quiz: 'प्रश्नोत्तरी',
    speech: 'भाषण व उच्चारण',
    chat: 'बातचीत डोजो',
    sensei: 'एआई सेंसेई',
    drama: 'ड्रामा लैब',
    achievements: 'उपलब्धियां',
    progress: 'प्रगति',
    settings: 'सेटिंग्स'
  },
  common: {
    language: 'प्रदर्शन और अनुवाद भाषा',
    search: 'खोजें...',
    all: 'सभी',
    level: 'स्तर',
    loading: 'लोड हो रहा है...',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    back: 'पीछे',
    next: 'अगला',
    previous: 'पिछला',
    complete: 'पूर्ण',
    addToSrs: 'SRS में जोड़ें',
    inSrs: 'SRS में मौजूद',
    meaning: 'अर्थ',
    reading: 'पठन',
    examples: 'उदाहरण',
    explanation: 'व्याख्या',
    pattern: 'पैटर्न',
    practice: 'अभ्यास',
    studyTips: 'अध्ययन सुझाव',
    handwritten: 'सत्यापित अनुवाद',
    fallbackEnglish: 'अंग्रेजी (वैकल्पिक)'
  },
  settings: {
    title: 'सेटिंग्स',
    displayLanguageTitle: 'प्रदर्शन और अनुवाद भाषा',
    displayLanguageDescription: 'इंटरफ़ेस और पाठ्यक्रम अनुवाद के लिए चुनी गई भाषा।',
    jlptLevelTitle: 'लक्षित JLPT स्तर',
    appearanceTitle: 'उपस्थिति',
    studyPreferencesTitle: 'अध्ययन प्राथमिकताएं'
  }
}

// ── OUTPUT FILES ────────────────────────────────────────
const canonicalDir = path.join(root, 'src', 'data', 'canonical')
const localesDir = path.join(root, 'src', 'locales')

fs.mkdirSync(canonicalDir, { recursive: true })
fs.mkdirSync(path.join(localesDir, 'en'), { recursive: true })
fs.mkdirSync(path.join(localesDir, 'ta'), { recursive: true })
fs.mkdirSync(path.join(localesDir, 'hi'), { recursive: true })

// Write canonical JSON
fs.writeFileSync(path.join(canonicalDir, 'canonicalCurriculum.json'), JSON.stringify(canonical, null, 2), 'utf-8');

// Write locales JSON
;['en', 'ta', 'hi'].forEach(lang => {
  fs.writeFileSync(path.join(localesDir, lang, 'curriculum.json'), JSON.stringify(locales[lang].curriculum, null, 2), 'utf-8')
  fs.writeFileSync(path.join(localesDir, lang, 'ui.json'), JSON.stringify(locales[lang].ui, null, 2), 'utf-8')
})

console.log('Successfully generated canonical data and locales!')
console.log('Canonical counts:')
console.log('- Vocabulary:', canonical.vocabulary.length)
console.log('- Kanji:', canonical.kanji.length)
console.log('- Grammar:', canonical.grammar.length)
console.log('- Lessons:', canonical.lessons.length)
console.log('\nCurriculum translations extracted:')
console.log('- English:', Object.keys(locales.en.curriculum).length)
console.log('- Tamil:', Object.keys(locales.ta.curriculum).length)
console.log('- Hindi:', Object.keys(locales.hi.curriculum).length)
