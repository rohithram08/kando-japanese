import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  normalizeLocale,
  getLocaleDirection,
  applyLocaleDirection,
  t,
  registerUiLocale,
  getCurriculumMeaning,
  getCurriculumExplanation,
} from '../index'
import { useSettingsStore, sanitizeLanguage } from '../../store/settingsStore'

describe('Full-Platform Multilingual Support & Decoupled Localization Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.getState().resetToDefaults()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // ─────────────────────────────────────────────────────────────
  // 1. 25-Locale Registry & Direction Handling
  // ─────────────────────────────────────────────────────────────
  describe('1. 25-Locale Registry & Direction Handling', () => {
    it('registers exactly 26 supported locales with correct tier distribution', () => {
      expect(SUPPORTED_LOCALES).toHaveLength(26)

      const tier1 = SUPPORTED_LOCALES.filter((l) => l.tier === 'tier1')
      const tier2 = SUPPORTED_LOCALES.filter((l) => l.tier === 'tier2')

      expect(tier1).toHaveLength(3) // en, ta, hi
      expect(tier2).toHaveLength(23) // es, pt, fr, de, ko, zh-CN, zh-TW, id, vi, th, ru, uk, pl, el, ar, ur, te, kn, ml, bn, mr, pa, cs

      const codes = SUPPORTED_LOCALES.map((l) => l.code)
      expect(codes).toContain('en')
      expect(codes).toContain('ta')
      expect(codes).toContain('hi')
      expect(codes).toContain('es')
      expect(codes).toContain('ar')
      expect(codes).toContain('ur')
      expect(codes).toContain('zh-CN')
    })

    it('correctly identifies RTL text direction for Arabic and Urdu, and LTR for others', () => {
      expect(getLocaleDirection('ar')).toBe('rtl')
      expect(getLocaleDirection('ur')).toBe('rtl')
      expect(getLocaleDirection('AR')).toBe('rtl')
      expect(getLocaleDirection('UR')).toBe('rtl')

      expect(getLocaleDirection('en')).toBe('ltr')
      expect(getLocaleDirection('ta')).toBe('ltr')
      expect(getLocaleDirection('hi')).toBe('ltr')
      expect(getLocaleDirection('es')).toBe('ltr')
      expect(getLocaleDirection('ja')).toBe('ltr') // fallback
    })

    it('applies lang and dir attributes to document element', () => {
      applyLocaleDirection('ar')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      expect(document.documentElement.getAttribute('lang')).toBe('ar')

      applyLocaleDirection('ta')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      expect(document.documentElement.getAttribute('lang')).toBe('ta')

      applyLocaleDirection('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      expect(document.documentElement.getAttribute('lang')).toBe('en')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 2. Parameter Interpolation Engine
  // ─────────────────────────────────────────────────────────────
  describe('2. Parameter Interpolation Engine', () => {
    it('interpolates numbers and strings into curly brace placeholders', () => {
      const enResult = t('quiz.score', 'en', { score: 9, total: 10, percent: 90 })
      expect(enResult).toBe('Score: 9/10 (90%)')

      const taResult = t('quiz.score', 'ta', { score: 9, total: 10, percent: 90 })
      expect(taResult).toBe('மதிப்பெண்: 9/10 (90%)')

      const hiResult = t('quiz.score', 'hi', { score: 9, total: 10, percent: 90 })
      expect(hiResult).toBe('अंक: 9/10 (90%)')

      const esResult = t('quiz.score', 'es', { score: 9, total: 10, percent: 90 })
      expect(esResult).toBe('Puntuación: 9/10 (90%)')
    })

    it('interpolates dynamic vocabulary quiz question prompts', () => {
      expect(t('quiz.what_does_mean', 'en', { word: '学生' })).toBe('What does "学生" mean?')
      expect(t('quiz.what_does_mean', 'ta', { word: '学生' })).toBe('"学生" என்பதன் பொருள் என்ன?')
      expect(t('quiz.what_does_mean', 'hi', { word: '学生' })).toBe('"学生" का अर्थ क्या है?')
      expect(t('quiz.what_does_mean', 'es', { word: '学生' })).toBe('¿Qué significa "学生"?')
    })

    it('interpolates streak and XP labels correctly across languages', () => {
      expect(t('common.streak', 'en', { count: 7 })).toBe('7 Day Streak')
      expect(t('common.streak', 'ta', { count: 7 })).toBe('7 நாள் தொடர்ச்சி')
      expect(t('common.streak', 'hi', { count: 7 })).toBe('7 दिन का स्ट्रीक')
      expect(t('common.streak', 'es', { count: 7 })).toBe('Racha de 7 Días')

      expect(t('common.xp', 'en', { count: 350 })).toBe('350 Wave XP')
    })

    it('safely retains unprovided placeholders without crashing', () => {
      const result = t('quiz.score', 'en', { score: 8 })
      expect(result).toContain('8/{total}')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 3. Multi-Tier Fallback and Extensibility
  // ─────────────────────────────────────────────────────────────
  describe('3. Multi-Tier Fallback and Dynamic Registration', () => {
    it('falls back to English when a string is missing in a Tier 2 locale', () => {
      // Spanish ui.json exists, but let's test a non-existent key in 'es' falling back to English
      const result = t('common.loading', 'es')
      expect(result).toBe('Cargando...') // present in es

      // For a locale that does not have a separate ui.json bundled yet (e.g. 'pl'), falls back to 'en'
      expect(t('common.save', 'pl')).toBe('Save')
      expect(t('dashboard.greeting_morning', 'pl')).toBe('Good Morning')
    })

    it('falls back to provided fallback argument when key does not exist anywhere', () => {
      expect(t('nonexistent.fake_key', 'en', 'Default Fallback')).toBe('Default Fallback')
      expect(t('nonexistent.fake_key', 'ta', 'தமிழ் மாற்று')).toBe('தமிழ் மாற்று')
    })

    it('allows dynamic registration of new UI locales via registerUiLocale', () => {
      registerUiLocale('it', {
        nav: {
          dashboard: 'Cruscotto',
          lessons: 'Lezioni',
        },
        common: {
          save: 'Salva',
        },
      })

      expect(t('nav.dashboard', 'it')).toBe('Cruscotto')
      expect(t('nav.lessons', 'it')).toBe('Lezioni')
      expect(t('common.save', 'it')).toBe('Salva')
      // Missing in 'it' -> falls back to 'en'
      expect(t('common.cancel', 'it')).toBe('Cancel')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 4. Decoupled Settings Store Architecture
  // ─────────────────────────────────────────────────────────────
  describe('4. Decoupled Settings Store Architecture', () => {
    it('maintains independent displayLanguage, explanationLanguage, and nativeLanguage', () => {
      const store = useSettingsStore.getState()
      expect(store.displayLanguage).toBe('en')
      expect(store.explanationLanguage).toBe('en')
      expect(store.nativeLanguage).toBe('en')

      // Set display language to Spanish (Tier 2 UI)
      store.setDisplayLanguage('es')
      expect(useSettingsStore.getState().displayLanguage).toBe('es')
      expect(useSettingsStore.getState().explanationLanguage).toBe('en')
      expect(useSettingsStore.getState().nativeLanguage).toBe('en')

      // Set explanation language to Tamil (Tier 1 Curriculum)
      store.setExplanationLanguage('ta')
      expect(useSettingsStore.getState().displayLanguage).toBe('es')
      expect(useSettingsStore.getState().explanationLanguage).toBe('ta')
      expect(useSettingsStore.getState().nativeLanguage).toBe('en')

      // Set native language (mother tongue) to Hindi
      store.setNativeLanguage('hi')
      expect(useSettingsStore.getState().displayLanguage).toBe('es')
      expect(useSettingsStore.getState().explanationLanguage).toBe('ta')
      expect(useSettingsStore.getState().nativeLanguage).toBe('hi')
    })

    it('sanitizes all 25 locales correctly in sanitizeLanguage', () => {
      expect(sanitizeLanguage('es')).toBe('es')
      expect(sanitizeLanguage('ar')).toBe('ar')
      expect(sanitizeLanguage('zh-CN')).toBe('zh-CN')
      expect(sanitizeLanguage('tamil')).toBe('ta')
      expect(sanitizeLanguage('invalid-code-xyz')).toBe('en')
    })

    it('applies document direction when displayLanguage changes via updateSettings', () => {
      useSettingsStore.getState().setDisplayLanguage('ar')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      expect(document.documentElement.getAttribute('lang')).toBe('ar')

      useSettingsStore.getState().setDisplayLanguage('en')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      expect(document.documentElement.getAttribute('lang')).toBe('en')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 5. Japanese Linguistic Immutability
  // ─────────────────────────────────────────────────────────────
  describe('5. Japanese Linguistic Immutability', () => {
    it('never alters Japanese linguistic tokens regardless of locale preference', () => {
      const sampleItem = {
        id: 'n5v001',
        word: '私',
        reading: 'わたし',
        romaji: 'watashi',
      }

      // Meaning adapts to locale
      const enMeaning = getCurriculumMeaning(sampleItem, 'en')
      const taMeaning = getCurriculumMeaning(sampleItem, 'ta')
      const hiMeaning = getCurriculumMeaning(sampleItem, 'hi')
      const esMeaning = getCurriculumMeaning(sampleItem, 'es')

      expect(enMeaning).toBe('I / me')
      expect(taMeaning).toBe('நான்')
      expect(hiMeaning).toBe('मैं')
      // Tier 2 falls back to English curriculum
      expect(esMeaning).toBe('I / me')

      // Japanese linguistic facts remain completely untouched
      expect(sampleItem.word).toBe('私')
      expect(sampleItem.reading).toBe('わたし')
      expect(sampleItem.romaji).toBe('watashi')
    })
  })
})
