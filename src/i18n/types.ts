export type Tier1Locale = 'en' | 'ta' | 'hi'

export type Tier2Locale =
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'ko'
  | 'zh-CN'
  | 'zh-TW'
  | 'id'
  | 'vi'
  | 'th'
  | 'ru'
  | 'uk'
  | 'pl'
  | 'el'
  | 'ar'
  | 'ur'
  | 'te'
  | 'kn'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'pa'
  | 'cs'

export type SupportedLocale = Tier1Locale | Tier2Locale | string

export interface LocaleInfo {
  code: string
  label: string
  nativeLabel: string
  flag: string
  direction: 'ltr' | 'rtl'
  tier: 'tier1' | 'tier2'
  curriculumStatus: 'curated' | 'fallback_to_en'
}

export interface CurriculumTranslationEntry {
  meaning?: string
  example?: string
  explanation?: string
  notes?: string
  examples?: string[]
  title?: string
  description?: string
  dialogue?: string[]
  culturalNote?: string
}

export type CurriculumTranslations = Record<string, CurriculumTranslationEntry>

export interface UiTranslations {
  nav?: Record<string, string>
  common?: Record<string, string>
  dashboard?: Record<string, string>
  quiz?: Record<string, string>
  srs?: Record<string, string>
  reading?: Record<string, string>
  kana?: Record<string, string>
  sensei?: Record<string, string>
  settings?: Record<string, string>
  [section: string]: any
}
