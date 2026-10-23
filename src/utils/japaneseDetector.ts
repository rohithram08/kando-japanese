// src/utils/japaneseDetector.ts
// ─────────────────────────────────────────────────────────────────────────────
// Real-time script and search intention detector for Kando Dictionary
// Disambiguates between Japanese (Kanji/Kana), Romaji, and localized meanings.
// ─────────────────────────────────────────────────────────────────────────────

export interface QueryDetection {
  type: 'kanji' | 'kana' | 'romaji' | 'meaning';
  label: string;
  badgeColor: string;
  icon: string;
  placeholderText: string;
}

const ENGLISH_WORDS_REGEX = /\b(to|the|a|an|is|are|was|were|in|on|at|by|for|with|from|and|or|of|it|be|do|have|give|get|go|eat|drink|see|look|buy|sell|say|speak|talk|read|write|learn|study|make|take|come|leave|live|love|like|know|think|want|feel|good|bad|big|small|new|old|water|cat|dog|book|car|friend|school|house|person|people|day|year|time)\b/i;

export function detectSearchQuery(query: string, languageLabel: string = 'English'): QueryDetection {
  const q = String(query || '').trim();
  if (!q) {
    return {
      type: 'meaning',
      label: `Japanese or ${languageLabel}`,
      badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
      icon: '✨',
      placeholderText: 'Search Kanji, Kana, Romaji, or Meaning…',
    };
  }

  // Kanji
  if (/[\u4E00-\u9FAF]/.test(q)) {
    return {
      type: 'kanji',
      label: 'Searching Japanese (Kanji)',
      badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
      icon: '漢',
      placeholderText: 'Searching Kanji…',
    };
  }

  // Kana (Hiragana or Katakana)
  if (/^[\u3040-\u309F\u30A0-\u30FF\u30FC\s]+$/.test(q)) {
    return {
      type: 'kana',
      label: 'Searching Japanese (Kana)',
      badgeColor: 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20',
      icon: 'あ',
      placeholderText: 'Searching Kana reading…',
    };
  }

  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(q)) {
    return {
      type: 'meaning',
      label: 'Searching Meaning (Tamil / தமிழ்)',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: '🌐',
      placeholderText: 'Searching meaning in Tamil…',
    };
  }

  // Devanagari / Hindi script
  if (/[\u0900-\u097F]/.test(q)) {
    return {
      type: 'meaning',
      label: 'Searching Meaning (Hindi / हिन्दी)',
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: '🌐',
      placeholderText: 'Searching meaning in Hindi…',
    };
  }

  const clean = q.toLowerCase();

  // English infinitive "to <verb>" or common English words
  if (/^to\s+[a-z]/i.test(clean) || ENGLISH_WORDS_REGEX.test(clean)) {
    return {
      type: 'meaning',
      label: `Searching Meaning (${languageLabel})`,
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: '🌐',
      placeholderText: `Searching meaning in ${languageLabel}…`,
    };
  }

  // Characters forbidden in standard Hepburn Romaji: v, l, q, x, c (not followed by h)
  if (/[vlqx]|c(?!h)/i.test(clean)) {
    return {
      type: 'meaning',
      label: `Searching Meaning (${languageLabel})`,
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      icon: '🌐',
      placeholderText: `Searching meaning in ${languageLabel}…`,
    };
  }

  // Strict Hepburn mora validation
  const romajiMoraRegex = /^(?:[ksthmyrwgzdbp]?[aiueo]|[ksthmyrwgzdbp]y[auo]|ch[aiueo]|sh[aiueo]|ts[aiueo]|j[aiueo]|n|[aeiou]|(?:kk|ss|tt|pp)[aiueo])+$/i;
  const words = clean.split(/\s+/).filter(Boolean);
  const isStrictRomaji = words.length > 0 && words.every((w) => {
    if (w.length < 2 && !/^[aeioun]$/i.test(w)) return false;
    if (/[bcdfghjklmpqrstvwxyz]$/i.test(w) && !/n$/i.test(w)) return false;
    if (/(ea|oa|ee|th|wh|ck|ng|igh|tion|ment|er$|est$)/i.test(w)) return false;
    return romajiMoraRegex.test(w);
  });

  if (isStrictRomaji) {
    return {
      type: 'romaji',
      label: 'Searching Romaji (Romanized Japanese)',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      icon: '🔤',
      placeholderText: 'Searching Romaji…',
    };
  }

  // Default to Meaning
  return {
    type: 'meaning',
    label: `Searching Meaning (${languageLabel})`,
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    icon: '🌐',
    placeholderText: `Searching meaning in ${languageLabel}…`,
  };
}
