// src/hooks/useTranslatedText.js
import { useState, useEffect } from 'react'
import { translateText, MT_LANG_CODES } from '../services/translationService'

/**
 * Returns { text, loading, isMachineTranslated } for `englishText` in the
 * given native_language. Always returns the English text unchanged (no
 * network call) for langCode 'english' or any language with no MT
 * mapping.
 *
 * This is a uniform live-translation hook — it doesn't know about
 * curated data living elsewhere (e.g. meaning_ta/meaning_hi). Callers
 * that have a curated field for the current language (word meanings in
 * english/tamil/hindi) should compute that themselves and prefer it over
 * this hook's result; use this hook directly for fields with no curated
 * alternative (e.g. example sentences, which have none in any language).
 */
export function useTranslatedText(englishText, langCode) {
  const [text, setText] = useState(englishText)
  const [loading, setLoading] = useState(false)
  const needsTranslation = langCode in MT_LANG_CODES

  useEffect(() => {
    let cancelled = false

    if (!englishText || !needsTranslation) {
      setText(englishText)
      setLoading(false)
      return
    }

    setLoading(true)
    translateText(englishText, langCode).then((result) => {
      if (!cancelled) {
        setText(result)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [englishText, langCode, needsTranslation])

  return { text, loading, isMachineTranslated: needsTranslation }
}

export default useTranslatedText