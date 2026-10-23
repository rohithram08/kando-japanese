// src/utils/japaneseDetector.ts
// ─────────────────────────────────────────────────────────────────────────────
// Real-time script and search intention detector for Kando Dictionary
// ─────────────────────────────────────────────────────────────────────────────

export interface QueryDetection {
  type: 'kanji' | 'kana' | 'romaji' | 'meaning';
  label: string;
  badgeColor: string;
  icon: string;
  placeholderText: string;
}

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

  // Romaji check
  const clean = q.toLowerCase();
  const isRomajiCandidate =
    /^[a-z\s\-]+$/.test(clean) &&
    clean.length >= 2 &&
    !/[bcdfghjklmpqrstvwxyz]$/i.test(clean) &&
    !/(ea|oa|ee|th|wh|ck|ng|igh|tion|ment|er$|est$)/i.test(clean);

  if (isRomajiCandidate) {
    return {
      type: 'romaji',
      label: 'Searching Romaji (Romanized Japanese)',
      badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      icon: '🔤',
      placeholderText: 'Searching Romaji…',
    };
  }

  // Native Meaning in User's Preferred Language
  return {
    type: 'meaning',
    label: `Searching Meaning (${languageLabel})`,
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    icon: '🌐',
    placeholderText: `Searching meaning in ${languageLabel}…`,
  };
}
