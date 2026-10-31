// backend/src/services/dictionaryService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Hybrid Japanese-Multilingual Dictionary Service for Kando Japanese
// Combines:
// 1. Authoritative Kando Curriculum Vocabulary (curated English, Tamil, Hindi)
// 2. Open Japanese Lexicon (Jisho.org API via server-side proxy)
// 3. AI Translation & Semantic Adaptation Layer (Groq Llama 3)
// 4. In-Memory Search Cache for instantaneous sub-10ms repeat queries
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs';
import path from 'path';
import { callGroq } from '../routes/ai.js';

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

// ─── Hiragana to Hepburn Romaji Map ──────────────────────────────────────────
const KANA_ROMAJI: Record<string, string> = {
  // Yōon (combos)
  'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
  'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
  'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
  'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
  'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
  'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
  'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
  'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
  'じゃ': 'ja',  'じゅ': 'ju',  'じょ': 'jo',
  'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
  'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
  // Basic Kana
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'o', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
};

/** Convert Katakana to Hiragana */
function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

/** Convert any Kana string to clean Hepburn Romaji */
export function kanaToRomaji(kana: string): string {
  if (!kana) return '';
  const hira = katakanaToHiragana(kana);
  let res = '';
  let i = 0;

  while (i < hira.length) {
    // Sokuon (small tsu っ)
    if (hira[i] === 'っ') {
      const nextPair = hira.slice(i + 1, i + 3);
      const nextSingle = hira[i + 1];
      const nextRomaji = KANA_ROMAJI[nextPair] || KANA_ROMAJI[nextSingle] || '';
      if (nextRomaji) {
        res += nextRomaji[0];
      }
      i++;
      continue;
    }

    // Try two-character yōon combo
    const two = hira.slice(i, i + 2);
    if (KANA_ROMAJI[two]) {
      res += KANA_ROMAJI[two];
      i += 2;
      continue;
    }

    // Single character
    const one = hira[i];
    if (KANA_ROMAJI[one]) {
      res += KANA_ROMAJI[one];
    } else if (one === 'ー') {
      // Long vowel prolonger
      const lastChar = res[res.length - 1];
      if (lastChar && ['a', 'i', 'u', 'e', 'o'].includes(lastChar)) {
        res += lastChar;
      }
    } else {
      res += one;
    }
    i++;
  }

  return res;
}

// ─── Script Detection ────────────────────────────────────────────────────────
export function isJapanese(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

export function isKana(text: string): boolean {
  return /^[\u3040-\u309F\u30A0-\u30FF\u30FC\s]+$/.test(text);
}

export function isKanji(text: string): boolean {
  return /[\u4E00-\u9FAF]/.test(text);
}

export function isTamil(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

export function isHindi(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

const ENGLISH_STOPWORDS = new Set([
  'to', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'by', 'for', 'with', 'from',
  'and', 'or', 'of', 'it', 'be', 'do', 'have', 'give', 'get', 'go', 'eat', 'drink', 'see', 'look',
  'buy', 'sell', 'say', 'speak', 'talk', 'read', 'write', 'learn', 'study', 'make', 'take', 'come',
  'leave', 'live', 'love', 'like', 'know', 'think', 'want', 'feel', 'good', 'bad', 'big', 'small',
  'new', 'old', 'water', 'cat', 'dog', 'book', 'car', 'friend', 'school', 'house', 'person', 'time'
]);

export function isRomaji(text: string): boolean {
  const clean = text.trim().toLowerCase();
  if (!/^[a-z\s\-]+$/.test(clean) || clean.length < 2) return false;
  // If starts with English infinitive "to <verb>", it is NOT Romaji
  if (/^to\s+[a-z]/i.test(clean)) return false;
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.some((w) => ENGLISH_STOPWORDS.has(w))) return false;
  // Characters forbidden in standard Hepburn Romaji: v, l, q, x, c (not followed by h)
  if (/[vlqx]|c(?!h)/i.test(clean)) return false;

  const romajiRegex = /^(?:[ksthmyrwgzdbp]?[aiueo]|[ksthmyrwgzdbp]y[auo]|ch[aiueo]|sh[aiueo]|ts[aiueo]|j[aiueo]|n|[aeiou]|(?:kk|ss|tt|pp)[aiueo])+$/i;
  return words.every((w) => {
    if (w.length < 2 && !/^[aeioun]$/i.test(w)) return false;
    // In Japanese Romaji, syllables end in a vowel or 'n'
    if (/[bcdfghjklmpqrstvwxyz]$/i.test(w) && !/n$/i.test(w)) return false;
    // Cannot contain non-Japanese consonant clusters or English vowel combos
    if (/(ea|oa|ee|th|wh|ck|ng|igh|tion|ment|er$|est$)/i.test(w)) return false;
    return romajiRegex.test(w);
  });
}

export function detectQueryType(text: string): 'kanji' | 'kana' | 'romaji' | 'meaning' {
  const trimmed = text.trim();
  if (!trimmed) return 'meaning';
  if (isKanji(trimmed)) return 'kanji';
  if (isKana(trimmed)) return 'kana';
  if (isTamil(trimmed) || isHindi(trimmed)) return 'meaning';
  if (isRomaji(trimmed)) return 'romaji';
  return 'meaning';
}

// ─── Local Curriculum Store ──────────────────────────────────────────────────
interface RawCurriculumItem {
  id: string;
  word: string;
  reading: string;
  romaji?: string;
  pos?: string;
  level: string;
  tags?: string[];
  example?: {
    jp: string;
    reading?: string;
  };
}

interface LoadedCurriculumWord {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  pos: string;
  level: string;
  meaningEn: string;
  meaningTa?: string;
  meaningHi?: string;
  exampleJp: string;
  exampleEn?: string;
  exampleTa?: string;
  exampleHi?: string;
}

let curriculumWordsCache: LoadedCurriculumWord[] | null = null;

function loadCurriculumWords(): LoadedCurriculumWord[] {
  if (curriculumWordsCache) return curriculumWordsCache;

  const words: LoadedCurriculumWord[] = [];
  const root = process.cwd();

  const possibleContentDirs = [
    path.resolve(root, 'content'),
    path.resolve(root, '../content'),
    path.resolve(root, '../../content'),
  ];

  let contentDir = possibleContentDirs.find((d) => fs.existsSync(path.join(d, 'vocabulary/n5.json')));
  if (!contentDir) {
    console.warn('[DictionaryService] Content directory not found, running with empty local cache');
    curriculumWordsCache = [];
    return [];
  }

  try {
    const enTrans: Record<string, { meaning?: string; example?: string }> =
      JSON.parse(fs.readFileSync(path.join(contentDir, 'translations/en/vocabulary.json'), 'utf8') || '{}');
    const taTrans: Record<string, { meaning?: string; example?: string }> =
      JSON.parse(fs.readFileSync(path.join(contentDir, 'translations/ta/vocabulary.json'), 'utf8') || '{}');
    const hiTrans: Record<string, { meaning?: string; example?: string }> =
      JSON.parse(fs.readFileSync(path.join(contentDir, 'translations/hi/vocabulary.json'), 'utf8') || '{}');

    const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
    for (const lvl of levels) {
      const filePath = path.join(contentDir, `vocabulary/${lvl}.json`);
      if (!fs.existsSync(filePath)) continue;

      const rawItems: RawCurriculumItem[] = JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
      for (const item of rawItems) {
        const en = enTrans[item.id] || {};
        const ta = taTrans[item.id] || {};
        const hi = hiTrans[item.id] || {};

        const romaji = item.romaji || kanaToRomaji(item.reading || item.word);

        words.push({
          id: item.id,
          word: item.word,
          reading: item.reading || item.word,
          romaji,
          pos: item.pos || 'vocabulary',
          level: (item.level || lvl).toUpperCase(),
          meaningEn: en.meaning || '',
          meaningTa: ta.meaning || undefined,
          meaningHi: hi.meaning || undefined,
          exampleJp: item.example?.jp || '',
          exampleEn: en.example || undefined,
          exampleTa: ta.example || undefined,
          exampleHi: hi.example || undefined,
        });
      }
    }

    curriculumWordsCache = words;
    console.log(`[DictionaryService] Successfully loaded ${words.length} curriculum words into memory`);
  } catch (err) {
    console.error('[DictionaryService] Failed to index curriculum vocabulary:', err);
    curriculumWordsCache = [];
  }

  return curriculumWordsCache;
}

// ─── Curriculum Local Search ─────────────────────────────────────────────────
function searchCurriculum(query: string, locale: string): DictionaryEntry[] {
  const words = loadCurriculumWords();
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // If query is an English infinitive like "to give", extract the verb "give"
  const verbStem = q.startsWith('to ') ? q.slice(3).trim() : null;

  interface ScoredItem {
    item: LoadedCurriculumWord;
    score: number;
  }

  const scored: ScoredItem[] = [];

  for (const item of words) {
    let score = 0;
    const itemWord = item.word.toLowerCase();
    const itemReading = item.reading.toLowerCase();
    const itemRomaji = item.romaji.toLowerCase();
    const itemMeaningEn = (item.meaningEn || '').toLowerCase();
    const itemMeaningLoc = locale === 'ta'
      ? (item.meaningTa || '').toLowerCase()
      : locale === 'hi'
      ? (item.meaningHi || '').toLowerCase()
      : itemMeaningEn;

    // 1. Exact Japanese word / reading match
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
    // 3. Segment match in comma/semicolon-separated definitions (e.g. "to give, to present")
    else {
      const segments = itemMeaningEn.split(/[,;/]\s*/).map((s) => s.trim());
      if (segments.some((s) => s === q || (verbStem && (s === verbStem || s === `to ${verbStem}`)))) {
        score = 800;
      } else if (segments.some((s) => s.startsWith(q) || (verbStem && s.startsWith(verbStem)))) {
        score = 700;
      } else if (itemMeaningEn.startsWith(q) || (verbStem && itemMeaningEn.startsWith(verbStem))) {
        score = 650;
      } else {
        // Whole word regex match (e.g. \bgive\b)
        const wordRegex = new RegExp(`\\b${verbStem || q}\\b`, 'i');
        if (wordRegex.test(itemMeaningEn) || (locale !== 'en' && wordRegex.test(itemMeaningLoc))) {
          score = 500;
        } else if (itemWord.includes(q) || itemReading.includes(q)) {
          score = 300;
        } else if (itemRomaji.includes(q)) {
          score = 200;
        } else if (itemMeaningEn.includes(q) || (locale !== 'en' && itemMeaningLoc.includes(q))) {
          // If query is short (<= 4 chars like "to g"), don't loosely match in the middle
          if (q.length <= 4) continue;
          score = 100;
        }
      }
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  // Sort strictly by relevance score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 15).map(({ item }) => {
    let localizedMeaning = item.meaningEn;
    let localizedExample = item.exampleEn;

    if (locale === 'ta' && item.meaningTa) {
      localizedMeaning = item.meaningTa;
      localizedExample = item.exampleTa || item.exampleEn;
    } else if (locale === 'hi' && item.meaningHi) {
      localizedMeaning = item.meaningHi;
      localizedExample = item.exampleHi || item.exampleEn;
    }

    const examples: ExampleSentence[] = [];
    if (item.exampleJp) {
      examples.push({
        jp: item.exampleJp,
        reading: item.reading,
        translation: localizedExample || localizedMeaning || '',
      });
    }

    return {
      id: `curriculum:${item.id}`,
      word: item.word,
      reading: item.reading,
      romaji: item.romaji,
      partOfSpeech: formatPartOfSpeech(item.pos),
      level: item.level,
      isCommon: true,
      meaning: localizedMeaning || item.meaningEn || item.word,
      meaningEn: item.meaningEn || undefined,
      examples,
      source: 'curriculum',
      isCurated: true,
    };
  });
}

// ─── Format Part of Speech ───────────────────────────────────────────────────
function formatPartOfSpeech(pos: string | string[]): string {
  if (Array.isArray(pos)) {
    return pos.map(formatSinglePos).filter(Boolean).slice(0, 2).join(', ');
  }
  return formatSinglePos(pos);
}

function formatSinglePos(p: string): string {
  if (!p) return 'Word';
  const clean = p.replace(/\s*\(.*?\)/g, '').trim();
  const lower = clean.toLowerCase();
  if (lower.includes('ichidan')) return 'Ichidan Verb (一段動詞)';
  if (lower.includes('godan')) return 'Godan Verb (五段動詞)';
  if (lower.includes('suru')) return 'Suru Verb (する動詞)';
  if (lower.includes('noun')) return 'Noun (名詞)';
  if (lower.includes('i-adjective') || lower.includes('keiyoushi')) return 'I-Adjective (い形容詞)';
  if (lower.includes('na-adjective') || lower.includes('keiyoudoushi')) return 'Na-Adjective (な形容詞)';
  if (lower.includes('adverb')) return 'Adverb (副詞)';
  if (lower.includes('particle')) return 'Particle (助詞)';
  if (lower.includes('expression')) return 'Expression (表現)';
  return clean || 'Word';
}

// ─── Jisho API Service ───────────────────────────────────────────────────────
const JISHO_API_URL = 'https://jisho.org/api/v1/search/words';

interface JishoItem {
  slug: string;
  is_common?: boolean;
  jlpt?: string[];
  japanese: Array<{ word?: string; reading?: string }>;
  senses: Array<{
    english_definitions: string[];
    parts_of_speech: string[];
  }>;
}

async function fetchJisho(keyword: string): Promise<JishoItem[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${JISHO_API_URL}?keyword=${encodeURIComponent(keyword)}`, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
    });

    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`[DictionaryService] Jisho HTTP ${res.status} for keyword "${keyword}"`);
      return [];
    }

    const data: any = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err: any) {
    if (err?.name !== 'AbortError') {
      console.warn('[DictionaryService] Jisho fetch error:', err.message);
    }
    return [];
  }
}

// ─── In-Memory Search Cache (1 Hour TTL) ──────────────────────────────────────
interface CacheEntry {
  timestamp: number;
  data: DictionarySearchResult;
}

const SEARCH_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(key: string): DictionarySearchResult | null {
  const item = SEARCH_CACHE.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    SEARCH_CACHE.delete(key);
    return null;
  }
  return { ...item.data, fromCache: true };
}

function setCache(key: string, data: DictionarySearchResult) {
  if (SEARCH_CACHE.size > 1000) {
    // Evict oldest 200 entries
    const keys = Array.from(SEARCH_CACHE.keys()).slice(0, 200);
    keys.forEach((k) => SEARCH_CACHE.delete(k));
  }
  SEARCH_CACHE.set(key, { timestamp: Date.now(), data });
}

// ─── AI Translation & Semantic Adaptation Layer ──────────────────────────────

/**
 * If query is non-English and non-Japanese (e.g. Tamil or Hindi),
 * map it to equivalent English & Japanese search keywords so Jisho and curriculum match accurately.
 */
async function mapQueryToKeywords(query: string, locale: string): Promise<string[]> {
  const keywords = [query];
  if (process.env.NODE_ENV === 'test') return keywords;
  try {
    const prompt = `Translate the following word/phrase "${query}" from language "${locale}" into 1-2 concise English search keywords and 1-2 standard Japanese words.
Return ONLY valid JSON (no markdown):
{
  "english": ["water"],
  "japanese": ["水"]
}`;

    const raw = await callGroq([{ role: 'user', content: prompt }], 256);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed.english)) keywords.push(...parsed.english);
    if (Array.isArray(parsed.japanese)) keywords.push(...parsed.japanese);
  } catch (e) {
    console.debug('[DictionaryService] Query mapping fallback:', e);
  }
  return Array.from(new Set(keywords.filter(Boolean)));
}

/**
 * Localizes Jisho results into the user's preferred platform language (Tamil, Hindi, etc.)
 * and generates 1-2 authentic Japanese example sentences with readings and localized translations.
 */
async function enrichAndLocalizeEntries(
  entries: DictionaryEntry[],
  locale: string
): Promise<DictionaryEntry[]> {
  if (entries.length === 0) return [];
  if (process.env.NODE_ENV === 'test') return entries;
  if (locale === 'en') {
    // For English users, simply provide 1 clean example sentence if none exists
    return entries.map((entry) => {
      if (entry.examples.length === 0) {
        entry.examples.push({
          jp: `${entry.word}は便利です。`,
          reading: `${entry.reading} は べんり です。`,
          translation: `${entry.word} (${entry.meaning}) is useful.`,
        });
      }
      return entry;
    });
  }

  // Need localization for non-English users (Tamil, Hindi, Spanish, French, etc.)
  const entriesToEnrich = entries.filter((e) => !e.isCurated).slice(0, 6);
  if (entriesToEnrich.length === 0) return entries;

  try {
    const payload = entriesToEnrich.map((e) => ({
      id: e.id,
      word: e.word,
      reading: e.reading,
      definitions: e.meaningEn || e.meaning,
    }));

    const prompt = `You are a Japanese linguist and multilingual dictionary translator.
Translate the meanings of these Japanese words into "${locale}" (e.g. ta=Tamil, hi=Hindi, es=Spanish, etc.).
Also provide 1 natural Japanese example sentence with its reading (furigana style) and translation in "${locale}".

Words to translate:
${JSON.stringify(payload, null, 2)}

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "id": "item-id",
    "localizedMeaning": "Translated meaning in ${locale}",
    "exampleJp": "Natural Japanese sentence with this word",
    "exampleReading": "Reading of the sentence",
    "exampleTranslation": "Translation in ${locale}"
  }
]`;

    const raw = await callGroq([{ role: 'user', content: prompt }], 1024);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const enrichedList = JSON.parse(cleaned);

    const enrichmentMap = new Map<string, any>();
    if (Array.isArray(enrichedList)) {
      enrichedList.forEach((item) => {
        if (item.id) enrichmentMap.set(item.id, item);
      });
    }

    return entries.map((entry) => {
      const match = enrichmentMap.get(entry.id);
      if (match) {
        return {
          ...entry,
          meaning: match.localizedMeaning || entry.meaning,
          examples: [
            {
              jp: match.exampleJp || `${entry.word}を使います。`,
              reading: match.exampleReading || `${entry.reading} を つかいます。`,
              translation: match.exampleTranslation || match.localizedMeaning || '',
            },
          ],
          source: 'ai-enhanced',
        };
      }
      return entry;
    });
  } catch (err) {
    console.debug('[DictionaryService] AI localization error, using graceful fallback:', err);
    return entries;
  }
}

// ─── Main Unified Search Method ──────────────────────────────────────────────
export async function searchHybridDictionary(
  rawQuery: string,
  rawLocale: string = 'en',
  options: { jlpt?: string; pos?: string } = {}
): Promise<DictionarySearchResult> {
  const query = rawQuery.trim();
  const locale = (rawLocale || 'en').toLowerCase().trim();
  const cacheKey = `${query.toLowerCase()}:${locale}:${options.jlpt || ''}:${options.pos || ''}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const detectedType = detectQueryType(query);

  // 1. Search Curriculum
  const localCurriculum = searchCurriculum(query, locale);

  // 2. Resolve query keywords for online Lexicon
  let searchKeywords = [query];
  if (query.toLowerCase().startsWith('to ')) {
    const stem = query.slice(3).trim();
    if (stem) searchKeywords = [stem, query];
  }
  if (localCurriculum.length < 3 && detectedType === 'meaning' && locale !== 'en') {
    if (process.env.NODE_ENV !== 'test') {
      const mapped = await mapQueryToKeywords(query, locale);
      searchKeywords = mapped;
    }
  }

  // 3. Query Jisho API
  const jishoResults: DictionaryEntry[] = [];
  const seenWords = new Set<string>(localCurriculum.map((c) => c.word));
  const maxJisho = localCurriculum.length > 0 ? 5 : 10;

  for (const kw of searchKeywords.slice(0, 2)) {
    const items = await fetchJisho(kw);
    for (const item of items) {
      const jp = item.japanese?.[0] || {};
      const word = jp.word || jp.reading || item.slug || '';
      const reading = jp.reading || jp.word || item.slug || '';

      if (!word || seenWords.has(word)) continue;
      seenWords.add(word);

      const senses = item.senses || [];
      const englishDefs = senses.flatMap((s) => s.english_definitions || []).slice(0, 5).join('; ');
      if (!englishDefs) continue;

      const posList = [...new Set(senses.flatMap((s) => s.parts_of_speech || []))];
      const levelStr = item.jlpt?.[0]?.replace('jlpt-', '').toUpperCase() || null;
      const romaji = kanaToRomaji(reading);

      jishoResults.push({
        id: `jisho:${encodeURIComponent(word)}`,
        word,
        reading,
        romaji,
        partOfSpeech: formatPartOfSpeech(posList),
        level: levelStr,
        isCommon: Boolean(item.is_common),
        meaning: englishDefs,
        meaningEn: englishDefs,
        examples: [],
        source: 'jisho',
        isCurated: false,
      });

      if (jishoResults.length >= maxJisho) break;
    }
    if (jishoResults.length >= maxJisho) break;
  }

  // 4. Enrich & Localize Jisho Entries (Translate into user's preferred language + create example sentences)
  const enrichedJisho = await enrichAndLocalizeEntries(jishoResults, locale);

  // 5. Combine: Curriculum entries first, then extended lexicon
  let combined = [...localCurriculum, ...enrichedJisho];

  // 6. Apply optional filters
  if (options.jlpt) {
    const targetJlpt = options.jlpt.toUpperCase();
    combined = combined.filter((e) => e.level?.toUpperCase() === targetJlpt);
  }

  if (options.pos) {
    const targetPos = options.pos.toLowerCase();
    combined = combined.filter((e) => e.partOfSpeech.toLowerCase().includes(targetPos));
  }

  const result: DictionarySearchResult = {
    query,
    detectedType,
    locale,
    total: combined.length,
    results: combined.slice(0, 40),
  };

  setCache(cacheKey, result);
  return result;
}
