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
 * Client-side fallback search using local curriculum data with relevance scoring
 */
function localCurriculumFallback(query: string, locale: string): DictionarySearchResult {
  const q = String(query || '').trim().toLowerCase();
  const normalizedLocale = normalizeLocale(locale);
  if (!q) {
    return { query, detectedType: 'meaning', locale: normalizedLocale, total: 0, results: [] };
  }

  const verbStem = q.startsWith('to ') ? q.slice(3).trim() : null;

  interface ScoredLocalItem {
    item: any;
    score: number;
    locMeaning: string;
  }

  const scored: ScoredLocalItem[] = [];

  for (const item of ALL_WORDS) {
    let locMeaning = '';
    try {
      locMeaning = getCurriculumMeaning(item, normalizedLocale);
    } catch {
      locMeaning = item[`meaning_${normalizedLocale}`] || item.meaning || '';
    }

    const itemWord = String(item.word || '').toLowerCase();
    const itemReading = String(item.reading || '').toLowerCase();
    const itemRomaji = String(item.romaji || '').toLowerCase();
    const itemMeaningEn = String(item.meaning || '').toLowerCase();
    const itemMeaningLoc = String(locMeaning || '').toLowerCase();

    let score = 0;

    // 1. Exact Japanese word or reading
    if (itemWord === q || itemReading === q) {
      score = 1000;
    } else if (itemRomaji === q) {
      score = 900;
    }
    // 2. Exact Meaning match (e.g. "give" or "to give")
    else if (
      itemMeaningEn === q ||
      itemMeaningLoc === q ||
      (verbStem && (itemMeaningEn === verbStem || itemMeaningEn === `to ${verbStem}`))
    ) {
      score = 850;
    }
    // 3. Segment match in definitions (e.g. "to give, to present")
    else {
      const segments = itemMeaningEn.split(/[,;/]\s*/).map((s) => s.trim());
      if (segments.some((s) => s === q || (verbStem && (s === verbStem || s === `to ${verbStem}`)))) {
        score = 800;
      } else if (segments.some((s) => s.startsWith(q) || (verbStem && s.startsWith(verbStem)))) {
        score = 700;
      } else if (itemMeaningEn.startsWith(q) || (verbStem && itemMeaningEn.startsWith(verbStem))) {
        score = 650;
      } else {
        const wordRegex = new RegExp(`\\b${verbStem || q}\\b`, 'i');
        if (wordRegex.test(itemMeaningEn) || (normalizedLocale !== 'en' && wordRegex.test(itemMeaningLoc))) {
          score = 500;
        } else if (itemWord.includes(q) || itemReading.includes(q)) {
          score = 300;
        } else if (itemRomaji.includes(q)) {
          score = 200;
        } else if (itemMeaningEn.includes(q) || (normalizedLocale !== 'en' && itemMeaningLoc.includes(q))) {
          if (q.length <= 4) continue;
          score = 100;
        }
      }
    }

    if (score > 0) {
      scored.push({ item, score, locMeaning });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  const matched = scored.slice(0, 30);

  const results: DictionaryEntry[] = matched.map(({ item, locMeaning }) => {
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
  options: { jlpt?: string; pos?: string; signal?: AbortSignal } = {}
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
      `/dictionary/search?${params.toString()}`,
      { signal: options.signal }
    );
    if (res?.data?.results) {
      return res.data;
    }
    return localCurriculumFallback(trimmed, locale);
  } catch (err: any) {
    if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
      return { query: trimmed, detectedType: 'meaning', locale, total: 0, results: [] };
    }
    console.warn('[DictionaryAPI] Backend search unavailable, using local curriculum fallback:', err);
    return localCurriculumFallback(trimmed, locale);
  }
}
