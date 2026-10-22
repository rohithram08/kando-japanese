// src/services/translationService.js
// Curated localization lookup and helpers for supported native languages.

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
};

// Languages with curated, human-written WORD MEANINGS in the lesson data
export const CURATED_LANGUAGES = ['english', 'tamil', 'hindi'];
export const MACHINE_TRANSLATED_LANGUAGES = Object.keys(MT_LANG_CODES);

/**
 * Translate `text` (English) into the target language.
 * Third-party machine translation is disabled in favor of curated localization.
 * Returns the original text safely without leaking user data.
 */
export async function translateText(text, _langCode) {
  return text || '';
}

export function isCurated(langCode) {
  return CURATED_LANGUAGES.includes(langCode);
}

export function needsMachineTranslation(langCode) {
  return langCode in MT_LANG_CODES;
}
