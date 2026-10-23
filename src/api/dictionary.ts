// src/api/dictionary.ts
// ─────────────────────────────────────────────────────────────────────────────
// Frontend API client for Kando Bidirectional Multilingual Dictionary
// Includes offline curriculum fallback for maximum reliability
// ─────────────────────────────────────────────────────────────────────────────

import { get } from './client';
import { VOCABULARY } from '../data/index';
import { getCurriculumMeaning, normalizeLocale } from '../i18n';

export interface ExampleSentence {
  jp: string;
  reading?: string;
  translation: string;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  partOfSpeech: string;
  level: string | null;
  isCommon: boolean;
  meaning: string;
  meaningEn?: string;
  examples: ExampleSentence[];
  source: 'curriculum' | 'jisho' | 'ai-enhanced';
  isCurated: boolean;
}

export interface DictionarySearchResult {
  query: string;
  detectedType: 'kanji' | 'kana' | 'romaji' | 'meaning';
  locale: string;
  total: number;
  results: DictionaryEntry[];
  fromCache?: boolean;
}

const ALL_WORDS = Object.values(VOCABULARY).flat();

/**
 * Client-side fallback search using local curriculum data
 */
function localCurriculumFallback(query: string, locale: string): DictionarySearchResult {
  const q = String(query || '').trim().toLowerCase();
  const normalizedLocale = normalizeLocale(locale);

  const matched = ALL_WORDS.filter((item: any) => {
    let locMeaning = '';
    try {
      locMeaning = getCurriculumMeaning(item, normalizedLocale);
    } catch {
      locMeaning = item[`meaning_${normalizedLocale}`] || item.meaning || '';
    }
    return [item.word, item.reading, item.romaji, item.meaning, locMeaning, item.partOfSpeech]
      .some((field) => String(field || '').toLowerCase().includes(q));
  }).slice(0, 30);

  const results: DictionaryEntry[] = matched.map((item: any) => {
    let locMeaning = '';
    try {
      locMeaning = getCurriculumMeaning(item, normalizedLocale);
    } catch {
      locMeaning = item[`meaning_${normalizedLocale}`] || item.meaning || '';
    }

    const examples: ExampleSentence[] = [];
    if (item.example?.jp) {
      examples.push({
        jp: item.example.jp,
        reading: item.reading,
        translation: item.example[normalizedLocale] || item.example.en || locMeaning,
      });
    }

    return {
      id: `curriculum:${item.id || item.word}`,
      word: item.word,
      reading: item.reading || item.word,
      romaji: item.romaji || '',
      partOfSpeech: item.partOfSpeech || 'Vocabulary',
      level: item.level || 'N5',
      isCommon: true,
      meaning: locMeaning || item.meaning || item.word,
      meaningEn: item.meaning,
      examples,
      source: 'curriculum',
      isCurated: true,
    };
  });

  const isKanji = /[\u4E00-\u9FAF]/.test(query);
  const isKana = /^[\u3040-\u309F\u30A0-\u30FF\u30FC\s]+$/.test(query);

  return {
    query,
    detectedType: isKanji ? 'kanji' : isKana ? 'kana' : 'meaning',
    locale: normalizedLocale,
    total: results.length,
    results,
  };
}

/**
 * Searches the hybrid Japanese dictionary
 */
export async function searchDictionary(
  query: string,
  locale: string = 'en',
  options: { jlpt?: string; pos?: string } = {}
): Promise<DictionarySearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: '',
      detectedType: 'meaning',
      locale,
      total: 0,
      results: [],
    };
  }

  const params = new URLSearchParams({
    q: trimmed,
    locale: normalizeLocale(locale),
  });
  if (options.jlpt) params.set('jlpt', options.jlpt);
  if (options.pos) params.set('pos', options.pos);

  try {
    const res = await get<{ success: boolean; data: DictionarySearchResult }>(
      `/dictionary/search?${params.toString()}`
    );
    if (res?.data?.results) {
      return res.data;
    }
    return localCurriculumFallback(trimmed, locale);
  } catch (err) {
    console.warn('[DictionaryAPI] Backend search unavailable, using local curriculum fallback:', err);
    return localCurriculumFallback(trimmed, locale);
  }
}
