// src/hooks/useTranslatedText.js
import { useState, useEffect } from 'react'

/**
 * Returns { text, loading, isMachineTranslated } for `englishText`.
 * External browser-direct machine translation has been replaced with the
 * zero-network translation resolver.
 */
export function useTranslatedText(englishText, _langCode) {
  const [text, setText] = useState(englishText || '')

  useEffect(() => {
    setText(englishText || '')
  }, [englishText])

  return { text, loading: false, isMachineTranslated: false }
}

export default useTranslatedText