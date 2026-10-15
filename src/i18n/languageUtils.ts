import { SupportedLocale, LocaleInfo } from './types'

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  // ── Tier 1: Curated Flagship Locales ─────────────────────────────────────
  {
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    tier: 'tier1',
    curriculumStatus: 'curated',
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier1',
    curriculumStatus: 'curated',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier1',
    curriculumStatus: 'curated',
  },

  // ── Tier 2: Extensible Core Locales (UI Localized, Curriculum in English) ─
  {
    code: 'es',
    label: 'Spanish',
    nativeLabel: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'pt',
    label: 'Portuguese',
    nativeLabel: 'Português',
    flag: '🇧🇷',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'fr',
    label: 'French',
    nativeLabel: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'de',
    label: 'German',
    nativeLabel: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'ko',
    label: 'Korean',
    nativeLabel: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'zh-CN',
    label: 'Chinese (Simplified)',
    nativeLabel: '简体中文',
    flag: '🇨🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'zh-TW',
    label: 'Chinese (Traditional)',
    nativeLabel: '繁體中文',
    flag: '🇹🇼',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'id',
    label: 'Indonesian',
    nativeLabel: 'Bahasa Indonesia',
    flag: '🇮🇩',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'vi',
    label: 'Vietnamese',
    nativeLabel: 'Tiếng Việt',
    flag: '🇻🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'th',
    label: 'Thai',
    nativeLabel: 'ไทย',
    flag: '🇹🇭',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'ru',
    label: 'Russian',
    nativeLabel: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'uk',
    label: 'Ukrainian',
    nativeLabel: 'Українська',
    flag: '🇺🇦',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'pl',
    label: 'Polish',
    nativeLabel: 'Polski',
    flag: '🇵🇱',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'el',
    label: 'Greek',
    nativeLabel: 'Ελληνικά',
    flag: '🇬🇷',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'ar',
    label: 'Arabic',
    nativeLabel: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'ur',
    label: 'Urdu',
    nativeLabel: 'اردو',
    flag: '🇵🇰',
    direction: 'rtl',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    flag: '🇧🇩',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'pa',
    label: 'Punjabi',
    nativeLabel: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
  {
    code: 'cs',
    label: 'Czech',
    nativeLabel: 'Čeština',
    flag: '🇨🇿',
    direction: 'ltr',
    tier: 'tier2',
    curriculumStatus: 'fallback_to_en',
  },
]

const LOCALE_CODE_MAP = new Map<string, LocaleInfo>()
SUPPORTED_LOCALES.forEach((loc) => {
  LOCALE_CODE_MAP.set(loc.code.toLowerCase(), loc)
})

const LEGACY_LANG_MAP: Record<string, string> = {
  english: 'en',
  tamil: 'ta',
  hindi: 'hi',
  spanish: 'es',
  portuguese: 'pt',
  french: 'fr',
  français: 'fr',
  francais: 'fr',
  german: 'de',
  deutsch: 'de',
  korean: 'ko',
  chinese: 'zh-CN',
  'simplified chinese': 'zh-CN',
  'chinese (simplified)': 'zh-CN',
  'simplified-chinese': 'zh-CN',
  simplified: 'zh-CN',
  'traditional chinese': 'zh-TW',
  'chinese (traditional)': 'zh-TW',
  'traditional-chinese': 'zh-TW',
  traditional: 'zh-TW',
  taiwan: 'zh-TW',
  indonesian: 'id',
  'bahasa indonesia': 'id',
  bahasa: 'id',
  vietnamese: 'vi',
  thai: 'th',
  russian: 'ru',
  ukrainian: 'uk',
  polish: 'pl',
  greek: 'el',
  arabic: 'ar',
  urdu: 'ur',
  telugu: 'te',
  kannada: 'kn',
  malayalam: 'ml',
  bengali: 'bn',
  marathi: 'mr',
  punjabi: 'pa',
  czech: 'cs',
}

/**
 * Check if a string corresponds to a known supported locale or legacy language alias.
 */
export function isSupportedLocale(raw?: string | null): boolean {
  if (!raw || typeof raw !== 'string') return false
  const clean = raw.trim().replace(/_/g, '-').toLowerCase()
  return LOCALE_CODE_MAP.has(clean) || Boolean(LEGACY_LANG_MAP[clean])
}

/**
 * Standardize any language string (legacy full word or ISO code) to a valid supported locale.
 * Always falls back safely to 'en'.
 */
export function normalizeLocale(raw?: string | null): string {
  if (!raw || typeof raw !== 'string') return DEFAULT_LOCALE
  const clean = raw.trim().replace(/_/g, '-').toLowerCase()

  if (LOCALE_CODE_MAP.has(clean)) {
    return LOCALE_CODE_MAP.get(clean)!.code
  }

  if (LEGACY_LANG_MAP[clean]) {
    return LEGACY_LANG_MAP[clean]
  }

  // Handle case-sensitive codes like zh-CN, zh-TW
  const match = SUPPORTED_LOCALES.find((l) => l.code.toLowerCase() === clean)
  if (match) return match.code

  return DEFAULT_LOCALE
}

/**
 * Get text direction for a locale ('ltr' | 'rtl')
 */
export function getLocaleDirection(localeRaw?: string | null): 'ltr' | 'rtl' {
  const code = normalizeLocale(localeRaw)
  const loc = LOCALE_CODE_MAP.get(code.toLowerCase())
  return loc?.direction || 'ltr'
}

/**
 * Apply dir and lang attributes to document root element
 */
export function applyLocaleDirection(localeRaw?: string | null): void {
  if (typeof document === 'undefined') return
  const code = normalizeLocale(localeRaw)
  const dir = getLocaleDirection(code)
  document.documentElement.setAttribute('lang', code)
  document.documentElement.setAttribute('dir', dir)
}

/**
 * Convert standardized ISO code to legacy full-word format for backward compatibility
 */
export function toLegacyLanguageName(locale: string): string {
  const code = normalizeLocale(locale)
  switch (code) {
    case 'ta':
      return 'tamil'
    case 'hi':
      return 'hindi'
    case 'en':
      return 'english'
    default:
      return code
  }
}
