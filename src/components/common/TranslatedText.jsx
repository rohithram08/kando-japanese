// src/components/common/TranslatedText.jsx
import React from 'react'
import { useTranslatedText } from '../../hooks/useTranslatedText'

/**
 * Renders `englishText` translated into `lang`. Shows a brief loading
 * pulse while a live translation request is in flight, and an honest
 * "live" badge next to machine-translated content so it's never confused
 * with the curated English/Tamil/Hindi text.
 *
 * `as` lets the caller pick the wrapping element (defaults to a <span>);
 * `showBadge` can be turned off for tight spaces (the badge still helps
 * set expectations, so only hide it where space is genuinely too tight).
 */
export default function TranslatedText({ text, lang, as: Tag = 'span', className = '', showBadge = true }) {
  const { text: translated, loading, isMachineTranslated } = useTranslatedText(text, lang)

  if (loading) {
    return <Tag className={`inline-block h-[1em] w-24 rounded bg-muted animate-pulse align-middle ${className}`} />
  }

  return (
    <Tag className={className}>
      {translated}
      {showBadge && isMachineTranslated && (
        <span
          title="Translated live via machine translation, not hand-written"
          className="ml-1.5 inline-block text-[9px] font-bold px-1 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 align-middle"
        >
          live
        </span>
      )}
    </Tag>
  )
}