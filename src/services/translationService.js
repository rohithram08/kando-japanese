// src/services/translationService.js
//
// Live machine translation for languages that don't have curated,
// human-written content in the lesson data (only English, Tamil, and
// Hindi do — see meaning_en/meaning_ta/meaning_hi in src/data). For every
// other language on the Native Language picker, this calls MyMemory — a
// free, CORS-enabled, no-API-key translation service that works directly
// from the browser — and caches results so the same word is never
// re-translated twice.
//
// This is honest machine translation, not curated content: it's clearly
// labeled as such in the UI (see TranslatedText.jsx and useTranslatedText.js)
// so learners know the difference in reliability from the human-written
// English/Tamil/Hindi.

const CACHE_KEY = 'nihongo_translation_cache'
const CACHE_VERSION = 1
const MAX_CACHE_ENTRIES = 2000

// Internal native_language values (full words, matching profile.native_language)
// → MyMemory's ISO 639-1 target codes. Covers every non-English language —
// note Tamil and Hindi are included here too: while their word meanings
// are curated (meaning_ta/meaning_hi), example sentences have no curated
// translation in any language, so those still need a live call even for
// Tamil/Hindi.
export const MT_LANG_CODES = {
  tamil: 'ta',
  hindi: 'hi',
  portuguese: 'pt',
  chinese: 'zh',
  korean: 'ko',
  russian: 'ru',
  spanish: 'es',
  arabic: 'ar',
  french: 'fr',
}

// Languages with curated, human-written WORD MEANINGS in the lesson data
// (meaning_en / meaning_ta / meaning_hi). Used only for UI labeling
// ("hand-written" vs "(live)") — translateText() itself doesn't care
// about this distinction, callers decide whether to prefer curated data.
export const CURATED_LANGUAGES = ['english', 'tamil', 'hindi']
export const MACHINE_TRANSLATED_LANGUAGES = Object.keys(MT_LANG_CODES)

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed.v === CACHE_VERSION ? parsed.entries : {}
  } catch {
    return {}
  }
}

function saveCache(entries) {
  try {
    const keys = Object.keys(entries)
    // Trim oldest entries if the cache grows too large
    const trimmed = keys.length > MAX_CACHE_ENTRIES
      ? Object.fromEntries(keys.slice(keys.length - MAX_CACHE_ENTRIES).map((k) => [k, entries[k]]))
      : entries
    localStorage.setItem(CACHE_KEY, JSON.stringify({ v: CACHE_VERSION, entries: trimmed }))
  } catch {
    /* localStorage full or unavailable — non-critical, cache just won't persist */
  }
}

let memoryCache = loadCache()
const inFlight = new Map() // dedupes simultaneous requests for the same text+lang

function cacheKey(text, langCode) {
  return `${langCode}::${text}`
}

/**
 * Translate `text` (English) into the target language.
 * `langCode` is a full native_language value ('chinese', 'tamil', etc.).
 * Returns the original text unchanged for English, for languages with no
 * MT mapping, or if translation fails for any reason — this never throws
 * and never leaves the UI blank. Callers that have curated, hand-written
 * data for a field (e.g. word meanings for english/tamil/hindi) should
 * prefer that over calling this at all — see isCurated().
 */
export async function translateText(text, langCode) {
  const mtCode = MT_LANG_CODES[langCode]
  if (!text || !mtCode) return text

  const key = cacheKey(text, langCode)
  if (memoryCache[key]) return memoryCache[key]

  if (inFlight.has(key)) return inFlight.get(key)

  const promise = (async () => {
    try {
      const params = new URLSearchParams({ q: text, langpair: `en|${mtCode}` })
      const res = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`)
      if (!res.ok) throw new Error(`Translation request failed: ${res.status}`)
      const data = await res.json()
      const translated = data?.responseData?.translatedText

      // MyMemory returns plain English-looking error strings (instead of
      // an HTTP error) when quota is exhausted or the query is malformed —
      // detect that and fall back rather than display it as a "translation".
      if (!translated || /NO QUERY SPECIFIED|INVALID LANGUAGE|QUOTA/i.test(translated)) {
        return text
      }

      memoryCache[key] = translated
      saveCache(memoryCache)
      return translated
    } catch (err) {
      console.warn('Translation failed, showing English instead:', err)
      return text
    } finally {
      inFlight.delete(key)
    }
  })()

  inFlight.set(key, promise)
  return promise
}

export function isCurated(langCode) {
  return CURATED_LANGUAGES.includes(langCode)
}

export function needsMachineTranslation(langCode) {
  return langCode in MT_LANG_CODES
}