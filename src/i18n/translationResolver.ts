import { CurriculumTranslationEntry, CurriculumTranslations, UiTranslations } from './types'
import { normalizeLocale, DEFAULT_LOCALE, applyLocaleDirection, isSupportedLocale } from './languageUtils'
import { useSettingsStore } from '../store/settingsStore'

// Dynamically import all UI and Curriculum translations from locales folder
const uiModules = import.meta.glob('../locales/*/ui.json', { eager: true }) as Record<string, { default: UiTranslations }>
const curriculumModules = import.meta.glob('../locales/*/curriculum.json', { eager: true }) as Record<string, { default: CurriculumTranslations }>

export const UI_DATA: Record<string, UiTranslations> = {}
for (const [path, mod] of Object.entries(uiModules)) {
  const code = path.match(/locales\/([^/]+)\//)?.[1]
  if (code && mod?.default) {
    UI_DATA[code] = mod.default
    UI_DATA[code.toLowerCase()] = mod.default
  }
}

const CURRICULUM_DATA: Record<string, CurriculumTranslations> = {}
for (const [path, mod] of Object.entries(curriculumModules)) {
  const code = path.match(/locales\/([^/]+)\//)?.[1]
  if (code && mod?.default) {
    CURRICULUM_DATA[code] = mod.default
    CURRICULUM_DATA[code.toLowerCase()] = mod.default
  }
}

/**
 * True only when real UI translation data is bundled (or registered) for the
 * locale. SUPPORTED_LOCALES is a catalogue of *intended* languages; this is the
 * source of truth for which of them actually translate the interface today.
 */
export function hasUiTranslations(locale?: string | null): boolean {
  if (!locale) return false
  const raw = locale.trim().replace(/_/g, '-')
  return Boolean(UI_DATA[raw] || UI_DATA[raw.toLowerCase()])
}

const MAX_MISSING_KEYS = 500
const missingKeysTracker = new Set<string>()

/**
 * Returns a list of all detected missing translation keys in format "locale:key".
 */
export function getMissingKeys(): string[] {
  return Array.from(missingKeysTracker)
}

/**
 * Reset the missing translation keys tracker.
 */
export function clearMissingKeys(): void {
  missingKeysTracker.clear()
}

/**
 * Register additional UI translations dynamically.
 */
export function registerUiLocale(locale: string, translations: UiTranslations): void {
  UI_DATA[locale] = translations
  UI_DATA[locale.toLowerCase()] = translations
}

/**
 * Register additional Curriculum translations dynamically.
 */
export function registerCurriculumLocale(locale: string, translations: CurriculumTranslations): void {
  CURRICULUM_DATA[locale] = translations
  CURRICULUM_DATA[locale.toLowerCase()] = translations
}

/**
 * Safely retrieve the currently active displayLanguage from the settings store.
 */
function getActiveDisplayLocale(): string {
  try {
    const store = (useSettingsStore as any)?.getState?.()
    return store?.displayLanguage || store?.nativeLanguage || DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/**
 * Resolve a UI translation string with dot notation (e.g. 'nav.vocabulary')
 * and dynamic parameter interpolation (e.g. { count: 5 }).
 *
 * Supports flexible polymorphic call signatures:
 *   - t('nav.lessons')
 *   - t('nav.lessons', 'ko')
 *   - t('nav.lessons', 'Default Label')
 *   - t('nav.lessons', 'ko', 'Default Label')
 *   - t('common.streak', { count: 5 })
 *   - t('common.streak', { count: 5 }, '5 Day Streak')
 *   - t('common.streak', 'ko', { count: 5 })
 *   - t('common.streak', 'ko', { count: 5 }, '5 Day Streak')
 *
 * Fallbacks: target locale -> 'en' -> fallbackArg -> key string.
 */
export function t(
  key: string,
  arg1?: any,
  arg2?: any,
  arg3?: string
): string {
  if (!key) return ''

  let targetLocale: string
  let params: Record<string, string | number> | undefined
  let fallback: string | undefined

  if (arg1 && typeof arg1 === 'object') {
    // t(key, params, fallback)
    targetLocale = getActiveDisplayLocale()
    params = arg1
    fallback = typeof arg2 === 'string' ? arg2 : undefined
  } else if (typeof arg1 === 'string') {
    if (isSupportedLocale(arg1) || UI_DATA[arg1] || UI_DATA[arg1.toLowerCase()]) {
      // t(key, locale, paramsOrFallback, fallback)
      targetLocale = arg1
      if (arg2 && typeof arg2 === 'object') {
        params = arg2
        fallback = typeof arg3 === 'string' ? arg3 : undefined
      } else if (typeof arg2 === 'string') {
        fallback = arg2
      } else {
        fallback = arg3
      }
    } else {
      // arg1 is not a recognized locale -> treat as fallback string!
      // t(key, fallback, params)
      targetLocale = getActiveDisplayLocale()
      fallback = arg1
      if (arg2 && typeof arg2 === 'object') {
        params = arg2
      }
    }
  } else {
    // arg1 is undefined/null
    targetLocale = getActiveDisplayLocale()
    if (arg2 && typeof arg2 === 'object') {
      params = arg2
      fallback = typeof arg3 === 'string' ? arg3 : undefined
    } else if (typeof arg2 === 'string') {
      fallback = arg2
    } else {
      fallback = arg3
    }
  }

  const rawKey = targetLocale ? targetLocale.trim().replace(/_/g, '-') : ''
  const locale = UI_DATA[rawKey]
    ? rawKey
    : UI_DATA[rawKey.toLowerCase()]
    ? rawKey.toLowerCase()
    : normalizeLocale(targetLocale)

  const parts = key.split('.')

  // 1. Try target locale
  let val: any = UI_DATA[locale]
  for (const part of parts) {
    if (val && typeof val === 'object' && part in val) {
      val = val[part]
    } else {
      val = undefined
      break
    }
  }

  let template: string | undefined

  if (typeof val === 'string' && val.trim() !== '') {
    template = val
  } else if (locale !== DEFAULT_LOCALE) {
    // Record missing key in target locale (bounded to MAX_MISSING_KEYS)
    if (missingKeysTracker.size < MAX_MISSING_KEYS) {
      missingKeysTracker.add(`${locale}:${key}`)
    }

    // 2. Fall back to English if target was non-English
    let fallbackVal: any = UI_DATA[DEFAULT_LOCALE]
    for (const part of parts) {
      if (fallbackVal && typeof fallbackVal === 'object' && part in fallbackVal) {
        fallbackVal = fallbackVal[part]
      } else {
        fallbackVal = undefined
        break
      }
    }
    if (typeof fallbackVal === 'string' && fallbackVal.trim() !== '') {
      template = fallbackVal
    }
  }

  if (!template) {
    // 3. Fallback argument or key
    template = fallback !== undefined ? fallback : key
  }

  // 4. Perform parameter interpolation: replace {paramName}
  if (params && typeof params === 'object') {
    let interpolated = template
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      const valStr = paramVal !== undefined && paramVal !== null ? String(paramVal) : ''
      interpolated = interpolated.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), valStr)
    })
    return interpolated
  }

  return template
}

/**
 * Get curriculum translation entry for an ID.
 * Merges target locale translation over English translation so any missing
 * fields gracefully fall back to English.
 */
export function getCurriculumTranslation(id: string, localeRaw?: string | null): CurriculumTranslationEntry | undefined {
  const rawKey = localeRaw ? localeRaw.trim() : ''
  const locale = CURRICULUM_DATA[rawKey] || CURRICULUM_DATA[rawKey.toLowerCase()]
    ? (CURRICULUM_DATA[rawKey] ? rawKey : rawKey.toLowerCase())
    : normalizeLocale(localeRaw)
  const enEntry = CURRICULUM_DATA.en?.[id]
  const targetEntry = CURRICULUM_DATA[locale]?.[id]

  if (!enEntry && !targetEntry) {
    return undefined
  }

  if (locale === 'en' || !targetEntry) {
    return enEntry
  }

  return {
    ...(enEntry || {}),
    ...Object.fromEntries(
      Object.entries(targetEntry).filter(([_, v]) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true))
    ),
  }
}

/**
 * Resolves the display meaning for any curriculum item (vocab, kanji, grammar)
 * with robust fallbacks:
 * 1. Target locale meaning
 * 2. English locale meaning
 * 3. Legacy meaning field on the object
 * 4. Japanese headword (kanji / word / char / pattern)
 */
export function getCurriculumMeaning(item: any, localeRaw?: string | null): string {
  if (!item) return ''
  const locale = normalizeLocale(localeRaw)

  if (item.id) {
    const entry = getCurriculumTranslation(item.id, locale)
    if (entry?.meaning && entry.meaning.trim() !== '') {
      return entry.meaning
    }
  }

  // Fallback to direct properties on legacy object
  if (locale === 'ta' && item.meaning_ta) return item.meaning_ta
  if (locale === 'hi' && item.meaning_hi) return item.meaning_hi
  if (item.meaning && typeof item.meaning === 'string') return item.meaning
  if (item.meaning_en && typeof item.meaning_en === 'string') return item.meaning_en
  if (item.en && typeof item.en === 'string') return item.en

  // Final fallback to Japanese headword
  return item.word || item.kanji || item.char || item.pattern || ''
}

/**
 * Resolves explanation for a grammar or lesson item.
 */
export function getCurriculumExplanation(item: any, localeRaw?: string | null): string {
  if (!item) return ''
  const locale = normalizeLocale(localeRaw)

  if (item.id) {
    const entry = getCurriculumTranslation(item.id, locale)
    if (entry?.explanation && entry.explanation.trim() !== '') {
      return entry.explanation
    }
  }

  if (locale === 'ta' && item.explanation_ta) return item.explanation_ta
  if (locale === 'hi' && item.explanation_hi) return item.explanation_hi
  if (item.explanation && typeof item.explanation === 'string') return item.explanation
  if (item.explanation_en && typeof item.explanation_en === 'string') return item.explanation_en

  return ''
}

/**
 * Synchronize document direction with locale
 */
export function syncDocumentDirection(localeRaw?: string | null): void {
  applyLocaleDirection(localeRaw)
}
