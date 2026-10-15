import { useCallback } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { SupportedLocale } from './types'
import { normalizeLocale, isSupportedLocale } from './languageUtils'
import {
  t as resolveT,
  getCurriculumTranslation as resolveCurriculumTranslation,
  getCurriculumMeaning as resolveCurriculumMeaning,
  getCurriculumExplanation as resolveCurriculumExplanation,
} from './translationResolver'

export function useI18n() {
  const displayLanguage = useSettingsStore(
    (s: any) => s.displayLanguage || s.nativeLanguage || 'en'
  )
  const explanationLanguage = useSettingsStore(
    (s: any) => s.explanationLanguage || 'en'
  )
  const nativeLanguage = useSettingsStore(
    (s: any) => s.nativeLanguage || 'en'
  )

  const setDisplayLanguage = useSettingsStore((s: any) => s.setDisplayLanguage)
  const setExplanationLanguage = useSettingsStore((s: any) => s.setExplanationLanguage)
  const setNativeLanguage = useSettingsStore((s: any) => s.setNativeLanguage)
  const updateSettings = useSettingsStore((s: any) => s.updateSettings)

  const locale: SupportedLocale = normalizeLocale(displayLanguage)

  const setLocale = useCallback(
    (newLocale: string) => {
      const normalized = normalizeLocale(newLocale)
      if (setDisplayLanguage) {
        setDisplayLanguage(normalized)
      } else if (updateSettings) {
        updateSettings({ displayLanguage: normalized })
      }
    },
    [setDisplayLanguage, updateSettings]
  )

  const setExplanationLocale = useCallback(
    (newLocale: string) => {
      const normalized = normalizeLocale(newLocale)
      if (setExplanationLanguage) {
        setExplanationLanguage(normalized)
      } else if (updateSettings) {
        updateSettings({ explanationLanguage: normalized })
      }
    },
    [setExplanationLanguage, updateSettings]
  )

  const setNativeLocale = useCallback(
    (newLocale: string) => {
      const normalized = normalizeLocale(newLocale)
      if (setNativeLanguage) {
        setNativeLanguage(normalized)
      } else if (updateSettings) {
        updateSettings({ nativeLanguage: normalized })
      }
    },
    [setNativeLanguage, updateSettings]
  )

  const t = useCallback(
    (
      key: string,
      arg1?: any,
      arg2?: any,
      arg3?: string
    ) => {
      if (typeof arg1 === 'string' && isSupportedLocale(arg1)) {
        return resolveT(key, arg1, arg2, arg3)
      }
      return resolveT(key, locale, arg1, arg2)
    },
    [locale]
  )

  const getCurriculumTranslation = useCallback(
    (id: string, overrideLocale?: string) => {
      return resolveCurriculumTranslation(id, overrideLocale || locale)
    },
    [locale]
  )

  const getCurriculumMeaning = useCallback(
    (item: any, overrideLocale?: string) => {
      return resolveCurriculumMeaning(item, overrideLocale || locale)
    },
    [locale]
  )

  const getCurriculumExplanation = useCallback(
    (item: any, overrideLocale?: string) => {
      return resolveCurriculumExplanation(item, overrideLocale || locale)
    },
    [locale]
  )

  return {
    locale,
    displayLanguage,
    explanationLanguage,
    nativeLanguage,
    setLocale,
    setDisplayLanguage: setLocale,
    setExplanationLocale,
    setNativeLocale,
    t,
    getCurriculumTranslation,
    getCurriculumMeaning,
    getCurriculumExplanation,
  }
}

export default useI18n
