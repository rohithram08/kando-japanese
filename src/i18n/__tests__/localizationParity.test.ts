import { describe, it, expect, beforeEach } from 'vitest'
import {
  normalizeLocale,
  toLegacyLanguageName,
  SUPPORTED_LOCALES,
  t,
  getCurriculumTranslation,
  getCurriculumMeaning,
  getCurriculumExplanation,
  hasUiTranslations,
  UI_DATA,
} from '../index'
import { CANONICAL_INDEX, CANONICAL_CURRICULUM as canonicalCurriculum } from '../../data/canonical'
import enCurriculum from '../../locales/en/curriculum.json'
import taCurriculum from '../../locales/ta/curriculum.json'
import hiCurriculum from '../../locales/hi/curriculum.json'

import { VOCABULARY, KANJI, GRAMMAR, LESSONS } from '../../data'
import { useSettingsStore } from '../../store/settingsStore'

describe('Phase 1A: Safe Multilingual Foundation & Parity Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.getState().resetToDefaults()
  })

  // ─────────────────────────────────────────────────────────────
  // 1. 100% exact preservation of every extracted translation
  // ─────────────────────────────────────────────────────────────
  describe('1. Translation Parity (100% exact preservation)', () => {
    it('preserves 100% of legacy Vocabulary English, Tamil, and Hindi translations', () => {
      let vocabCount = 0
      let tamilMatches = 0
      let hindiMatches = 0

      Object.values(VOCABULARY).forEach((levelList) => {
        levelList.forEach((item) => {
          vocabCount++
          const id = item.id || `vocab_${item.word}`
          const enTrans = enCurriculum[id as keyof typeof enCurriculum]
          expect(enTrans).toBeDefined()
          expect(enTrans.meaning).toBe(item.meaning)

          if (item.example?.en) {
            expect(enTrans.example).toBe(item.example.en)
          }

          // Tamil parity
          if (item.meaning_ta) {
            const taTrans = taCurriculum[id as keyof typeof taCurriculum]
            expect(taTrans).toBeDefined()
            expect(taTrans.meaning).toBe(item.meaning_ta)
            tamilMatches++
            if (item.example?.ta) {
              expect(taTrans.example).toBe(item.example.ta)
            }
          }

          // Hindi parity
          if (item.meaning_hi) {
            const hiTrans = hiCurriculum[id as keyof typeof hiCurriculum]
            expect(hiTrans).toBeDefined()
            expect(hiTrans.meaning).toBe(item.meaning_hi)
            hindiMatches++
            if (item.example?.hi) {
              expect(hiTrans.example).toBe(item.example.hi)
            }
          }
        })
      })

      expect(vocabCount).toBe(2382)
      expect(tamilMatches).toBe(114)
      expect(hindiMatches).toBe(114)
    })

    it('preserves 100% of legacy Kanji English, Tamil, and Hindi translations', () => {
      let kanjiCount = 0
      let tamilMatches = 0
      let hindiMatches = 0

      Object.values(KANJI).forEach((levelList) => {
        levelList.forEach((item) => {
          kanjiCount++
          const id = item.id || `kanji_${item.kanji}`
          const enTrans = enCurriculum[id as keyof typeof enCurriculum]
          expect(enTrans).toBeDefined()
          expect(enTrans.meaning).toBe(item.meaning)

          if (item.meaning_ta) {
            const taTrans = taCurriculum[id as keyof typeof taCurriculum]
            expect(taTrans).toBeDefined()
            expect(taTrans.meaning).toBe(item.meaning_ta)
            tamilMatches++
          }

          if (item.meaning_hi) {
            const hiTrans = hiCurriculum[id as keyof typeof hiCurriculum]
            expect(hiTrans).toBeDefined()
            expect(hiTrans.meaning).toBe(item.meaning_hi)
            hindiMatches++
          }
        })
      })

      expect(kanjiCount).toBe(960)
      expect(tamilMatches).toBe(536)
      expect(hindiMatches).toBe(536)
    })

    it('preserves 100% of legacy Grammar English, Tamil, and Hindi translations', () => {
      let grammarCount = 0
      let tamilMatches = 0
      let hindiMatches = 0

      Object.values(GRAMMAR).forEach((levelList) => {
        levelList.forEach((item) => {
          grammarCount++
          const id = item.id
          const enTrans = enCurriculum[id as keyof typeof enCurriculum]
          expect(enTrans).toBeDefined()
          expect(enTrans.meaning).toBe(item.meaning)
          if (item.explanation) {
            expect(enTrans.explanation).toBe(item.explanation)
          }

          if (item.meaning_ta) {
            const taTrans = taCurriculum[id as keyof typeof taCurriculum]
            expect(taTrans).toBeDefined()
            expect(taTrans.meaning).toBe(item.meaning_ta)
            tamilMatches++
            if (item.explanation_ta) {
              expect(taTrans.explanation).toBe(item.explanation_ta)
            }
          }

          if (item.meaning_hi) {
            const hiTrans = hiCurriculum[id as keyof typeof hiCurriculum]
            expect(hiTrans).toBeDefined()
            expect(hiTrans.meaning).toBe(item.meaning_hi)
            hindiMatches++
            if (item.explanation_hi) {
              expect(hiTrans.explanation).toBe(item.explanation_hi)
            }
          }
        })
      })

      expect(grammarCount).toBe(464)
      expect(tamilMatches).toBe(125)
      expect(hindiMatches).toBe(125)
    })

    it('preserves 100% of legacy Lesson titles and descriptions', () => {
      let lessonCount = 0
      Object.values(LESSONS).flat().forEach((lesson) => {
        lessonCount++
        const enTrans = enCurriculum[lesson.id as keyof typeof enCurriculum]
        expect(enTrans).toBeDefined()
        expect(enTrans.title).toBe(lesson.title)
        expect(enTrans.description).toBe(lesson.description)
      })
      expect(lessonCount).toBe(250)
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 2. Canonical curriculum integrity & reference validation
  // ─────────────────────────────────────────────────────────────
  describe('2. Canonical Curriculum Integrity & Reference Validation', () => {
    it('contains exactly 4,056 canonical entries with valid schema', () => {
      const totalItems =
        canonicalCurriculum.vocabulary.length +
        canonicalCurriculum.kanji.length +
        canonicalCurriculum.grammar.length +
        canonicalCurriculum.lessons.length

      expect(totalItems).toBe(4056)
      expect(canonicalCurriculum.vocabulary.length).toBe(2382)
      expect(canonicalCurriculum.kanji.length).toBe(960)
      expect(canonicalCurriculum.grammar.length).toBe(464)
      expect(canonicalCurriculum.lessons.length).toBe(250)
      expect(CANONICAL_INDEX.size).toBe(4056)
    })

    it('verifies every localized curriculum entry maps to a valid canonical ID', () => {
      // English
      Object.keys(enCurriculum).forEach((id) => {
        expect(CANONICAL_INDEX.has(id)).toBe(true)
      })
      // Tamil
      Object.keys(taCurriculum).forEach((id) => {
        expect(CANONICAL_INDEX.has(id)).toBe(true)
      })
      // Hindi
      Object.keys(hiCurriculum).forEach((id) => {
        expect(CANONICAL_INDEX.has(id)).toBe(true)
      })
    })

    it('ensures canonical items contain zero hardcoded translation strings in linguistic fields', () => {
      canonicalCurriculum.vocabulary.forEach((v) => {
        expect(v.id).toBeTruthy()
        expect(v.word).toBeTruthy()
        expect(v.reading).toBeTruthy()
        expect((v as any).meaning).toBeUndefined()
        expect((v as any).meaning_ta).toBeUndefined()
        expect((v as any).meaning_hi).toBeUndefined()
      })

      canonicalCurriculum.kanji.forEach((k) => {
        expect(k.id).toBeTruthy()
        expect(k.kanji).toBeTruthy()
        expect((k as any).meaning).toBeUndefined()
        expect((k as any).meaning_ta).toBeUndefined()
        expect((k as any).meaning_hi).toBeUndefined()
      })

      canonicalCurriculum.grammar.forEach((g) => {
        expect(g.id).toBeTruthy()
        expect(g.pattern).toBeTruthy()
        expect((g as any).meaning).toBeUndefined()
        expect((g as any).meaning_ta).toBeUndefined()
        expect((g as any).meaning_hi).toBeUndefined()
      })
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 3. Fallback behavior without crashing
  // ─────────────────────────────────────────────────────────────
  describe('3. Fallback Behavior', () => {
    it('falls back to English when a Tamil translation is missing', () => {
      // N1 vocab has no Tamil translation
      const n1Vocab = VOCABULARY.N1[0]
      expect(n1Vocab.meaning_ta).toBeUndefined()

      const meaningInTa = getCurriculumMeaning(n1Vocab, 'ta')
      expect(meaningInTa).toBe(n1Vocab.meaning)
      expect(meaningInTa.length).toBeGreaterThan(0)
    })

    it('falls back to English when a Hindi translation is missing', () => {
      // N1 grammar has no Hindi explanation
      const n1Grammar = GRAMMAR.N1[0]
      expect(Boolean((n1Grammar as any).explanation_hi)).toBe(false)

      const expInHi = getCurriculumExplanation(n1Grammar, 'hi')
      expect(expInHi).toBe(n1Grammar.explanation)
      expect(expInHi?.length).toBeGreaterThan(0)
    })

    it('safely handles non-existent or corrupted keys without throwing', () => {
      expect(() => getCurriculumTranslation('non_existent_key_9999', 'ta')).not.toThrow()
      expect(getCurriculumTranslation('non_existent_key_9999', 'ta')).toBeUndefined()

      expect(() => getCurriculumMeaning({ id: 'invalid', word: '猫' }, 'ta')).not.toThrow()
      expect(getCurriculumMeaning({ id: 'invalid', word: '猫' }, 'ta')).toBe('猫')

      expect(() => t('non.existent.ui.key', 'ta', 'Default Text')).not.toThrow()
      expect(t('non.existent.ui.key', 'ta', 'Default Text')).toBe('Default Text')

      expect(t('non.existent.no.fallback', 'hi')).toBe('non.existent.no.fallback')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 4. Settings compatibility & ISO mapping
  // ─────────────────────────────────────────────────────────────
  describe('4. Settings Compatibility & ISO Language Mapping', () => {
    it('normalizes legacy full language names to ISO 639-1', () => {
      expect(normalizeLocale('english')).toBe('en')
      expect(normalizeLocale('ENGLISH')).toBe('en')
      expect(normalizeLocale('tamil')).toBe('ta')
      expect(normalizeLocale('TAMIL')).toBe('ta')
      expect(normalizeLocale('hindi')).toBe('hi')
      expect(normalizeLocale('HINDI')).toBe('hi')
    })

    it('handles ISO codes directly and falls back gracefully for invalid codes', () => {
      expect(normalizeLocale('en')).toBe('en')
      expect(normalizeLocale('ta')).toBe('ta')
      expect(normalizeLocale('hi')).toBe('hi')
      expect(normalizeLocale('zz')).toBe('en') // unsupported -> en
      expect(normalizeLocale(null)).toBe('en')
      expect(normalizeLocale(undefined)).toBe('en')
      expect(normalizeLocale('')).toBe('en')
    })

    it('converts ISO codes back to legacy names for backward-compatibility', () => {
      expect(toLegacyLanguageName('en')).toBe('english')
      expect(toLegacyLanguageName('ta')).toBe('tamil')
      expect(toLegacyLanguageName('hi')).toBe('hindi')
    })

    it('manages decoupled displayLanguage, explanationLanguage, and nativeLanguage in settingsStore', () => {
      const store = useSettingsStore.getState()
      expect(store.displayLanguage).toBe('en')
      expect(store.explanationLanguage).toBe('en')
      expect(store.nativeLanguage).toBe('en')

      store.setDisplayLanguage('ta')
      expect(useSettingsStore.getState().displayLanguage).toBe('ta')
      expect(useSettingsStore.getState().nativeLanguage).toBe('en')

      store.setExplanationLanguage('hi')
      expect(useSettingsStore.getState().explanationLanguage).toBe('hi')

      // Legacy name passed to setNativeLanguage
      store.setNativeLanguage('hindi')
      expect(useSettingsStore.getState().nativeLanguage).toBe('hi')
      expect(useSettingsStore.getState().displayLanguage).toBe('ta')
    })

    it('migrates legacy stored settings with english/tamil/hindi to ISO codes', () => {
      localStorage.setItem(
        'nihongo_settings',
        JSON.stringify({
          nativeLanguage: 'tamil',
          jlptLevel: 'N4',
        })
      )

      useSettingsStore.getState().init()
      const state = useSettingsStore.getState()
      expect(state.nativeLanguage).toBe('ta')
      expect(state.displayLanguage).toBe('ta')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 5. Changing language updates UI and curriculum meanings
  // ─────────────────────────────────────────────────────────────
  describe('5. UI and Curriculum Updates across Locales', () => {
    it('returns appropriate UI translations for all supported locales', () => {
      expect(t('nav.vocabulary', 'en')).toBe('Vocabulary')
      expect(t('nav.vocabulary', 'ta')).toBe('சொற்களஞ்சியம்')
      expect(t('nav.vocabulary', 'hi')).toBe('शब्दावली')

      expect(t('nav.kanji', 'en')).toBe('Kanji')
      expect(t('nav.kanji', 'ta')).toBe('கான்ஜி')
      expect(t('nav.kanji', 'hi')).toBe('कांजी')

      expect(t('common.language', 'en')).toBe('Display & Translation Language')
      expect(t('common.language', 'ta')).toBe('காட்சி & மொழிபெயர்ப்பு மொழி')
      expect(t('common.language', 'hi')).toBe('प्रदर्शन और अनुवाद भाषा')
    })

    it('updates curriculum meaning for bilingual items when language changes', () => {
      const n5Vocab = VOCABULARY.N5[0] // e.g. 学生 (student)
      const meaningEn = getCurriculumMeaning(n5Vocab, 'en')
      const meaningTa = getCurriculumMeaning(n5Vocab, 'ta')
      const meaningHi = getCurriculumMeaning(n5Vocab, 'hi')

      expect(meaningEn).toBe(n5Vocab.meaning)
      expect(meaningTa).toBe(n5Vocab.meaning_ta)
      expect(meaningHi).toBe(n5Vocab.meaning_hi)

      expect(meaningEn).not.toBe(meaningTa)
      expect(meaningTa).not.toBe(meaningHi)
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 6. Japanese text immutability
  // ─────────────────────────────────────────────────────────────
  describe('6. Japanese Text Immutability', () => {
    it('guarantees Japanese headwords, readings, and romaji are untouched by locale changes', () => {
      const vocabItem = { ...VOCABULARY.N5[0] }
      const originalWord = vocabItem.word
      const originalReading = vocabItem.reading
      const originalRomaji = vocabItem.romaji

      // Call lookups in all languages
      SUPPORTED_LOCALES.forEach((locale) => {
        getCurriculumMeaning(vocabItem, locale.code)
        getCurriculumTranslation(vocabItem.id, locale.code)
      })

      // Ensure object was not mutated
      expect(vocabItem.word).toBe(originalWord)
      expect(vocabItem.reading).toBe(originalReading)
      expect(vocabItem.romaji).toBe(originalRomaji)
    })

    it('guarantees 100% byte equality for all Japanese characters in canonical dataset', () => {
      VOCABULARY.N5.forEach((v) => {
        const canonical = CANONICAL_INDEX.get(v.id)?.item as any
        expect(canonical).toBeDefined()
        expect(canonical.word).toBe(v.word)
        expect(canonical.reading).toBe(v.reading)
      })

      KANJI.N5.forEach((k) => {
        const canonical = CANONICAL_INDEX.get(k.id)?.item as any
        expect(canonical).toBeDefined()
        expect(canonical.kanji).toBe(k.kanji)
      })

      GRAMMAR.N5.forEach((g) => {
        const canonical = CANONICAL_INDEX.get(g.id)?.item as any
        expect(canonical).toBeDefined()
        expect(canonical.pattern).toBe(g.pattern)
      })
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 7. UI Localization Integrity & 100% Key Parity
  // ─────────────────────────────────────────────────────────────
  describe('7. UI Localization Integrity & 100% Key Parity', () => {
    it('verifies every locale shown by hasUiTranslations actually exists in UI_DATA', () => {
      const activeLocales = SUPPORTED_LOCALES.filter((l) => hasUiTranslations(l.code))
      expect(activeLocales.length).toBeGreaterThanOrEqual(12)

      activeLocales.forEach((l) => {
        expect(UI_DATA[l.code] || UI_DATA[l.code.toLowerCase()]).toBeDefined()
      })
    })

    it('verifies that every bundled locale in UI_DATA has 100% key parity with English', () => {
      const en = UI_DATA['en']
      expect(en).toBeDefined()

      const bundledCodes = Object.keys(UI_DATA).filter((k) => k === k.toLowerCase())

      bundledCodes.forEach((code) => {
        const localeData = UI_DATA[code]
        expect(localeData).toBeDefined()

        Object.entries(en).forEach(([section, keys]) => {
          expect(localeData[section]).toBeDefined()
          Object.keys(keys as Record<string, any>).forEach((k) => {
            expect(
              (localeData[section] as any)?.[k],
              `Missing key "${section}.${k}" in locale "${code}"`
            ).toBeDefined()
          })
        })
      })
    })
  })
})
