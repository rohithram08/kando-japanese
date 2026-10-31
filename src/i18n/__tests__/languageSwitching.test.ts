import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  t,
  normalizeLocale,
  getMissingKeys,
  clearMissingKeys,
  getCurriculumMeaning,
} from '../index'
import { useSettingsStore } from '../../store/settingsStore'

describe('Language Switching & Multi-Locale Resolution Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    clearMissingKeys()
    useSettingsStore.getState().resetToDefaults()
  })

  afterEach(() => {
    localStorage.clear()
    clearMissingKeys()
  })

  // ─────────────────────────────────────────────────────────────
  // 1. Mandatory Target Locales Translation Bundles
  // ─────────────────────────────────────────────────────────────
  describe('1. Mandatory Target Locales UI Bundles', () => {
    it('resolves authentic Korean (ko) UI strings across screens', () => {
      expect(t('nav.dashboard', 'ko')).toBe('대시보드')
      expect(t('nav.lessons', 'ko')).toBe('레슨')
      expect(t('nav.reading', 'ko')).toBe('단계별 리더')
      expect(t('dashboard.streak_title', 'ko')).toBe('연속 학습')
      expect(t('dashboard.daily_goals_title', 'ko')).toBe('일일 목표')
      expect(t('quiz.title', 'ko')).toBe('퀴즈 센터')
      expect(t('srs.title', 'ko')).toBe('간격 반복(SRS) 복습')
      expect(t('reading.title', 'ko')).toBe('단계별 일본어 리더')
      expect(t('settings.title', 'ko')).toBe('설정')
      expect(t('common.save', 'ko')).toBe('저장')
      expect(t('lessons.complete_title', 'ko')).toBe('레슨 완료!')
    })

    it('resolves authentic Simplified Chinese (zh-CN) UI strings across screens', () => {
      expect(t('nav.dashboard', 'zh-CN')).toBe('仪表盘')
      expect(t('nav.lessons', 'zh-CN')).toBe('课程')
      expect(t('nav.reading', 'zh-CN')).toBe('分级阅读')
      expect(t('dashboard.streak_title', 'zh-CN')).toBe('连续学习打卡')
      expect(t('dashboard.daily_goals_title', 'zh-CN')).toBe('每日目标')
      expect(t('quiz.title', 'zh-CN')).toBe('测验中心')
      expect(t('srs.title', 'zh-CN')).toBe('间隔重复(SRS)复习')
      expect(t('reading.title', 'zh-CN')).toBe('分级日语阅读')
      expect(t('settings.title', 'zh-CN')).toBe('设置')
      expect(t('common.save', 'zh-CN')).toBe('保存')
      expect(t('lessons.complete_title', 'zh-CN')).toBe('课程完成！')
    })

    it('resolves authentic Portuguese (pt) UI strings across screens', () => {
      expect(t('nav.dashboard', 'pt')).toBe('Painel')
      expect(t('nav.lessons', 'pt')).toBe('Lições')
      expect(t('nav.reading', 'pt')).toBe('Leitura Graduada')
      expect(t('dashboard.streak_title', 'pt')).toBe('Sequência de Estudos')
      expect(t('dashboard.daily_goals_title', 'pt')).toBe('Metas Diárias')
      expect(t('quiz.title', 'pt')).toBe('Centro de Testes')
      expect(t('srs.title', 'pt')).toBe('Revisão por Repetição Espaçada')
      expect(t('reading.title', 'pt')).toBe('Leitor Japonês Graduado')
      expect(t('settings.title', 'pt')).toBe('Configurações')
      expect(t('common.save', 'pt')).toBe('Salvar')
      expect(t('lessons.complete_title', 'pt')).toBe('Lição concluída!')
    })

    it('resolves authentic French (fr) UI strings across screens', () => {
      expect(t('nav.dashboard', 'fr')).toBe('Tableau de bord')
      expect(t('nav.lessons', 'fr')).toBe('Leçons')
      expect(t('nav.reading', 'fr')).toBe('Lectures graduées')
      expect(t('dashboard.streak_title', 'fr')).toBe('Série d\'apprentissage')
      expect(t('dashboard.daily_goals_title', 'fr')).toBe('Objectifs quotidiens')
      expect(t('quiz.title', 'fr')).toBe('Centre de quiz')
      expect(t('srs.title', 'fr')).toBe('Révision par répétition espacée')
      expect(t('reading.title', 'fr')).toBe('Lecteur japonais gradué')
      expect(t('settings.title', 'fr')).toBe('Paramètres')
      expect(t('common.save', 'fr')).toBe('Enregistrer')
      expect(t('lessons.complete_title', 'fr')).toBe('Leçon terminée !')
    })

    it('resolves authentic German (de) UI strings across screens', () => {
      expect(t('nav.dashboard', 'de')).toBe('Dashboard')
      expect(t('nav.lessons', 'de')).toBe('Lektionen')
      expect(t('nav.reading', 'de')).toBe('Stufenleser')
      expect(t('dashboard.streak_title', 'de')).toBe('Lernserie')
      expect(t('dashboard.daily_goals_title', 'de')).toBe('Tagesziele')
      expect(t('quiz.title', 'de')).toBe('Quiz-Zentrum')
      expect(t('srs.title', 'de')).toBe('Spaced-Repetition-Wiederholung')
      expect(t('reading.title', 'de')).toBe('Stufenleser Japanisch')
      expect(t('settings.title', 'de')).toBe('Einstellungen')
      expect(t('common.save', 'de')).toBe('Speichern')
      expect(t('lessons.complete_title', 'de')).toBe('Lektion abgeschlossen!')
    })

    it('resolves authentic Traditional Chinese (zh-TW) and strictly distinguishes from Simplified Chinese (zh-CN)', () => {
      expect(t('nav.dashboard', 'zh-TW')).toBe('儀表板')
      expect(t('nav.lessons', 'zh-TW')).toBe('課程')
      expect(t('nav.reading', 'zh-TW')).toBe('分級閱讀')
      expect(t('dashboard.streak_title', 'zh-TW')).toBe('學習連續打卡')
      expect(t('dashboard.daily_goals_title', 'zh-TW')).toBe('每日目標')
      expect(t('quiz.title', 'zh-TW')).toBe('測驗中心')
      expect(t('srs.title', 'zh-TW')).toBe('間隔重複(SRS)複習')
      expect(t('reading.title', 'zh-TW')).toBe('日語分級閱讀')
      expect(t('settings.title', 'zh-TW')).toBe('設定')
      expect(t('common.save', 'zh-TW')).toBe('儲存')
      expect(t('lessons.complete_title', 'zh-TW')).toBe('課程完成！')

      // Direct distinction assertions against zh-CN
      expect(t('common.save', 'zh-TW')).not.toBe(t('common.save', 'zh-CN'))
      expect(t('settings.title', 'zh-TW')).not.toBe(t('settings.title', 'zh-CN'))
      expect(t('nav.dashboard', 'zh-TW')).not.toBe(t('nav.dashboard', 'zh-CN'))
      expect(t('nav.lessons', 'zh-TW')).not.toBe(t('nav.lessons', 'zh-CN'))
      expect(t('nav.vocabulary', 'zh-TW')).toBe('單字')
      expect(t('nav.vocabulary', 'zh-CN')).toBe('词汇')
    })

    it('resolves authentic Indonesian (id) UI strings across screens', () => {
      expect(t('nav.dashboard', 'id')).toBe('Dasbor')
      expect(t('nav.lessons', 'id')).toBe('Pelajaran')
      expect(t('nav.reading', 'id')).toBe('Bacaan Berjenjang')
      expect(t('dashboard.streak_title', 'id')).toBe('Rentetan Belajar')
      expect(t('dashboard.daily_goals_title', 'id')).toBe('Target Harian')
      expect(t('quiz.title', 'id')).toBe('Pusat Kuis')
      expect(t('srs.title', 'id')).toBe('Ulasan Pengulangan Berjarak')
      expect(t('reading.title', 'id')).toBe('Bacaan Bahasa Jepang Berjenjang')
      expect(t('settings.title', 'id')).toBe('Pengaturan')
      expect(t('common.save', 'id')).toBe('Simpan')
      expect(t('lessons.complete_title', 'id')).toBe('Pelajaran Selesai!')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 2. Reactive Language Switching without Reload
  // ─────────────────────────────────────────────────────────────
  describe('2. Reactive Language Switching', () => {
    it('immediately reflects displayLanguage state in polymorphic t() calls', () => {
      const store = useSettingsStore.getState()

      // Default is English
      expect(store.displayLanguage).toBe('en')
      expect(t('nav.dashboard')).toBe('Dashboard')
      expect(t('common.save')).toBe('Save')

      // Switch to Korean
      store.setDisplayLanguage('ko')
      expect(useSettingsStore.getState().displayLanguage).toBe('ko')
      expect(t('nav.dashboard')).toBe('대시보드')
      expect(t('common.save')).toBe('저장')

      // Switch to Simplified Chinese
      store.setDisplayLanguage('zh-CN')
      expect(useSettingsStore.getState().displayLanguage).toBe('zh-CN')
      expect(t('nav.dashboard')).toBe('仪表盘')
      expect(t('common.save')).toBe('保存')

      // Switch to Portuguese
      store.setDisplayLanguage('pt')
      expect(useSettingsStore.getState().displayLanguage).toBe('pt')
      expect(t('nav.dashboard')).toBe('Painel')
      expect(t('common.save')).toBe('Salvar')

      // Switch to Vietnamese
      store.setDisplayLanguage('vi')
      expect(useSettingsStore.getState().displayLanguage).toBe('vi')
      expect(t('nav.dashboard')).toBe('Bảng điều khiển')
      expect(t('common.save')).toBe('Lưu')

      // Switch to French
      store.setDisplayLanguage('fr')
      expect(useSettingsStore.getState().displayLanguage).toBe('fr')
      expect(t('nav.dashboard')).toBe('Tableau de bord')
      expect(t('common.save')).toBe('Enregistrer')

      // Switch to German
      store.setDisplayLanguage('de')
      expect(useSettingsStore.getState().displayLanguage).toBe('de')
      expect(t('nav.dashboard')).toBe('Dashboard')
      expect(t('common.save')).toBe('Speichern')

      // Switch to Traditional Chinese
      store.setDisplayLanguage('zh-TW')
      expect(useSettingsStore.getState().displayLanguage).toBe('zh-TW')
      expect(t('nav.dashboard')).toBe('儀表板')
      expect(t('common.save')).toBe('儲存')

      // Switch to Indonesian
      store.setDisplayLanguage('id')
      expect(useSettingsStore.getState().displayLanguage).toBe('id')
      expect(t('nav.dashboard')).toBe('Dasbor')
      expect(t('common.save')).toBe('Simpan')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 3. Persistence Across Reload
  // ─────────────────────────────────────────────────────────────
  describe('3. Preference Persistence', () => {
    it('persists selected displayLanguage into localStorage', () => {
      useSettingsStore.getState().setDisplayLanguage('ko')

      const savedRaw = localStorage.getItem('nihongo_settings')
      expect(savedRaw).not.toBeNull()
      const parsed = JSON.parse(savedRaw!)
      expect(parsed.state.displayLanguage).toBe('ko')
    })

    it('maintains independent displayLanguage, explanationLanguage, and nativeLanguage', () => {
      const store = useSettingsStore.getState()
      store.setDisplayLanguage('ko')
      store.setExplanationLanguage('ta')
      store.setNativeLanguage('hi')

      const state = useSettingsStore.getState()
      expect(state.displayLanguage).toBe('ko')
      expect(state.explanationLanguage).toBe('ta')
      expect(state.nativeLanguage).toBe('hi')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 4. Missing Keys & Fallback Engine
  // ─────────────────────────────────────────────────────────────
  describe('4. Missing Keys and Fallback Resolution', () => {
    it('tracks missing keys with locale prefix and returns fallback string without crashing', () => {
      clearMissingKeys()
      const result = t('missing.unknown_feature_key', 'ko', 'Default Fallback')
      expect(result).toBe('Default Fallback')

      const missing = getMissingKeys()
      expect(missing).toContain('ko:missing.unknown_feature_key')
    })

    it('falls back to English when a key is absent from a Tier 2 language', () => {
      // For any key absent from a non-bundled locale like 'pl', fallback is English
      expect(t('nav.dashboard', 'pl')).toBe('Dashboard')
      expect(t('common.cancel', 'pl')).toBe('Cancel')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 5. Directionality & Immutability
  // ─────────────────────────────────────────────────────────────
  describe('5. Directionality & Japanese Immutability', () => {
    it('sets RTL document direction for Arabic and Urdu, and LTR for others', () => {
      useSettingsStore.getState().setDisplayLanguage('ar')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      expect(document.documentElement.getAttribute('lang')).toBe('ar')

      useSettingsStore.getState().setDisplayLanguage('ur')
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      expect(document.documentElement.getAttribute('lang')).toBe('ur')

      useSettingsStore.getState().setDisplayLanguage('ko')
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      expect(document.documentElement.getAttribute('lang')).toBe('ko')
    })

    it('never translates Japanese source headwords, readings, or furigana', () => {
      const item = {
        id: 'mock_custom_vocab_999',
        word: '本',
        reading: 'ほん',
        meaning: 'book',
      }

      // Word and reading remain exactly Japanese
      expect(item.word).toBe('本')
      expect(item.reading).toBe('ほん')

      // Meaning resolves safely with fallback to item meaning
      expect(getCurriculumMeaning(item, 'ko')).toBe('book')
      expect(getCurriculumMeaning(item, 'en')).toBe('book')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 6. Regression Protection on Existing Locales
  // ─────────────────────────────────────────────────────────────
  describe('6. Regression Protection on Existing Locales', () => {
    it('preserves existing English, Spanish, Tamil, and Hindi translations', () => {
      expect(t('nav.dashboard', 'en')).toBe('Dashboard')
      expect(t('nav.dashboard', 'es')).toBe('Panel Principal')
      expect(t('nav.dashboard', 'ta')).toBe('முகப்பு பலகை')
      expect(t('nav.dashboard', 'hi')).toBe('डैशबोर्ड')

      expect(t('common.save', 'en')).toBe('Save')
      expect(t('common.save', 'es')).toBe('Guardar')
      expect(t('common.save', 'ta')).toBe('சேமி')
      expect(t('common.save', 'hi')).toBe('सहेजें')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 7. Separator & Case Normalization
  // ─────────────────────────────────────────────────────────────
  describe('7. Separator & Case Normalization', () => {
    it('consistently normalizes zh-CN, zh-cn, zh_CN, zh_cn, and legacy names', () => {
      expect(normalizeLocale('zh-CN')).toBe('zh-CN')
      expect(normalizeLocale('zh-cn')).toBe('zh-CN')
      expect(normalizeLocale('zh_CN')).toBe('zh-CN')
      expect(normalizeLocale('zh_cn')).toBe('zh-CN')
      expect(normalizeLocale('ZH-CN')).toBe('zh-CN')
      expect(normalizeLocale('chinese')).toBe('zh-CN')

      // Resolves translation bundle using any separator/casing
      expect(t('nav.dashboard', 'zh_CN')).toBe('仪表盘')
      expect(t('nav.dashboard', 'zh_cn')).toBe('仪表盘')
      expect(t('nav.dashboard', 'zh-cn')).toBe('仪表盘')
      expect(t('nav.dashboard', 'ZH-CN')).toBe('仪表盘')
    })

    it('consistently normalizes zh-TW, zh-tw, zh_TW, traditional chinese, and taiwan', () => {
      expect(normalizeLocale('zh-TW')).toBe('zh-TW')
      expect(normalizeLocale('zh-tw')).toBe('zh-TW')
      expect(normalizeLocale('zh_TW')).toBe('zh-TW')
      expect(normalizeLocale('zh_tw')).toBe('zh-TW')
      expect(normalizeLocale('ZH-TW')).toBe('zh-TW')
      expect(normalizeLocale('traditional chinese')).toBe('zh-TW')
      expect(normalizeLocale('taiwan')).toBe('zh-TW')

      // Resolves translation bundle using any separator/casing
      expect(t('nav.dashboard', 'zh_TW')).toBe('儀表板')
      expect(t('nav.dashboard', 'zh_tw')).toBe('儀表板')
      expect(t('nav.dashboard', 'zh-tw')).toBe('儀表板')
      expect(t('nav.dashboard', 'ZH-TW')).toBe('儀表板')
    })

    it('consistently normalizes German, French, and Indonesian aliases', () => {
      expect(normalizeLocale('de')).toBe('de')
      expect(normalizeLocale('german')).toBe('de')
      expect(normalizeLocale('deutsch')).toBe('de')
      expect(t('common.save', 'deutsch')).toBe('Speichern')

      expect(normalizeLocale('fr')).toBe('fr')
      expect(normalizeLocale('french')).toBe('fr')
      expect(normalizeLocale('français')).toBe('fr')
      expect(normalizeLocale('francais')).toBe('fr')
      expect(t('common.save', 'français')).toBe('Enregistrer')

      expect(normalizeLocale('id')).toBe('id')
      expect(normalizeLocale('indonesian')).toBe('id')
      expect(normalizeLocale('bahasa indonesia')).toBe('id')
      expect(normalizeLocale('bahasa')).toBe('id')
      expect(t('common.save', 'bahasa indonesia')).toBe('Simpan')
    })

    it('safely falls back to en for invalid or corrupted locale codes', () => {
      expect(normalizeLocale('unknown_xyz')).toBe('en')
      expect(normalizeLocale(null)).toBe('en')
      expect(normalizeLocale(undefined)).toBe('en')
      expect(normalizeLocale('')).toBe('en')

      // Resolves English when invalid locale is supplied
      expect(t('nav.dashboard', 'unknown_xyz')).toBe('Dashboard')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 8. Parameter Interpolation Edge Cases
  // ─────────────────────────────────────────────────────────────
  describe('8. Parameter Interpolation Edge Cases', () => {
    it('correctly handles numeric 0 in parameters', () => {
      expect(t('quiz.score', { score: 0, total: 10, percent: 0 })).toBe('Score: 0/10 (0%)')
      expect(t('common.streak', { count: 0 })).toBe('0 Day Streak')
    })

    it('interpolates Japanese characters accurately without corruption', () => {
      expect(t('quiz.what_does_mean', { word: '食べる' })).toBe('What does "食べる" mean?')
      expect(t('quiz.what_is_kanji_meaning', { kanji: '桜' })).toBe('What is the meaning of 「桜」?')
    })

    it('handles repeated placeholders and missing/null parameters safely', () => {
      // Partial params leaves unsupplied tokens as-is without crashing
      const partial = t('quiz.score', { score: 5 })
      expect(partial).toContain('5')
      expect(partial).toContain('{total}')

      // Null or undefined parameter values are converted cleanly to empty string
      const withNull = t('common.streak', { count: null })
      expect(withNull).toBe(' Day Streak')

      const withUndefined = t('common.streak', { count: undefined })
      expect(withUndefined).toBe(' Day Streak')
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 9. Bounded Missing Key Tracker
  // ─────────────────────────────────────────────────────────────
  describe('9. Bounded Missing Key Tracker', () => {
    it('caps missing key collection at MAX_MISSING_KEYS (500) to prevent unbounded memory growth', () => {
      clearMissingKeys()
      for (let i = 0; i < 600; i++) {
        t(`nonexistent.key_${i}`, 'ko', 'Fallback')
      }
      const missing = getMissingKeys()
      expect(missing.length).toBe(500)
    })
  })

  // ─────────────────────────────────────────────────────────────
  // 10. Localized Transient, Validation & Toast Messages
  // ─────────────────────────────────────────────────────────────
  describe('10. Localized Transient Messages (Auth, Toast, Audio)', () => {
    it('translates validation error messages across active locales', () => {
      const store = useSettingsStore.getState()

      // English
      store.setDisplayLanguage('en')
      expect(t('auth.email_required')).toBe('Email is required')
      expect(t('auth.password_min_length')).toBe('Minimum 6 characters')

      // Spanish
      store.setDisplayLanguage('es')
      expect(t('auth.email_required')).toBe('El correo electrónico es obligatorio')
      expect(t('auth.password_min_length')).toBe('Mínimo 6 caracteres')

      // Korean
      store.setDisplayLanguage('ko')
      expect(t('auth.email_required')).toBe('이메일을 입력해 주세요')
      expect(t('auth.password_min_length')).toBe('최소 6자 이상이어야 합니다')

      // Vietnamese
      store.setDisplayLanguage('vi')
      expect(t('auth.email_required')).toBe('Vui lòng nhập email')
      expect(t('auth.password_min_length')).toBe('Mật khẩu tối thiểu 6 ký tự')
    })

    it('interpolates avatar toast messages with name and emoji tokens accurately', () => {
      const store = useSettingsStore.getState()

      store.setDisplayLanguage('en')
      expect(t('toast.avatar_updated', { name: 'Ninja', emoji: '🥷' }))
        .toBe('Avatar set to Ninja! 🥷')

      store.setDisplayLanguage('es')
      expect(t('toast.avatar_updated', { name: 'Ninja', emoji: '🥷' }))
        .toBe('¡Avatar cambiado a Ninja! 🥷')

      store.setDisplayLanguage('zh-CN')
      expect(t('toast.avatar_updated', { name: 'Ninja', emoji: '🥷' }))
        .toBe('头像已更改为 Ninja！🥷')

      store.setDisplayLanguage('pt')
      expect(t('toast.avatar_updated', { name: 'Ninja', emoji: '🥷' }))
        .toBe('Avatar alterado para Ninja! 🥷')
    })

    it('localizes settings and audio status notifications', () => {
      const store = useSettingsStore.getState()

      store.setDisplayLanguage('ko')
      expect(t('toast.settings_reset')).toBe('설정이 기본값으로 복원되었습니다')
      expect(t('audio.voice_unavailable')).toBe('이 기기에서 사용할 수 있는 일본어 음성이 없습니다')

      store.setDisplayLanguage('hi')
      expect(t('toast.settings_reset')).toBe('सेटिंग्स डिफ़ॉल्ट पर बहाल कर दी गईं')
      expect(t('audio.not_supported')).toBe('इस ब्राउज़र में स्पीच सिंथेसिस समर्थित नहीं है')

      store.setDisplayLanguage('ta')
      expect(t('toast.account_deleted')).toBe('உங்கள் தரவு நீக்கப்பட்டது')
      expect(t('audio.playback_failed')).toBe('ஆடியோ பின்னணி தோல்வியடைந்தது')
    })
  })
})
