// src/utils/romaji.ts
// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive Hepburn Kana-to-Romaji Conversion Engine
// Supports standard gojuon, dakuon, handakuon, yoon (digraphs), sokuon (っ/ッ),
// choonpu (ー), and mixed text.
// ─────────────────────────────────────────────────────────────────────────────

const KANA_TO_ROMAJI_MAP: Record<string, string> = {
  // Digraphs (Yoon) - Hiragana
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja',  じゅ: 'ju',  じょ: 'jo',
  ぢゃ: 'ja',  ぢゅ: 'ju',  ぢょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',

  // Digraphs (Yoon) - Katakana
  キャ: 'kya', キュ: 'kyu', キョ: 'kyo',
  シャ: 'sha', シュ: 'shu', ショ: 'sho',
  チャ: 'cha', チュ: 'chu', チョ: 'cho',
  ニャ: 'nya', ニュ: 'nyu', ニョ: 'nyo',
  ヒャ: 'hya', ヒュ: 'hyu', ヒョ: 'hyo',
  ミャ: 'mya', ミュ: 'myu', ミョ: 'myo',
  リャ: 'rya', リュ: 'ryu', リョ: 'ryo',
  ギャ: 'gya', ギュ: 'gyu', ギョ: 'gyo',
  ジャ: 'ja',  ジュ: 'ju',  ジョ: 'jo',
  ヂャ: 'ja',  ヂュ: 'ju',  ヂョ: 'jo',
  ビャ: 'bya', ビュ: 'byu', ビョ: 'byo',
  ピャ: 'pya', ピュ: 'pyu', ピョ: 'pyo',

  // Basic Gojuon & Variations - Hiragana
  あ: 'a',  い: 'i',  う: 'u',  え: 'e',  お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi',す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi',つ: 'tsu',て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya',           ゆ: 'yu',           よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'wi',           ゑ: 'we', を: 'wo',
  ん: 'n',

  // Voiced & Semi-voiced (Dakuon & Handakuon) - Hiragana
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',

  // Basic Gojuon & Variations - Katakana
  ア: 'a',  イ: 'i',  ウ: 'u',  エ: 'e',  オ: 'o',
  カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  サ: 'sa', シ: 'shi',ス: 'su', セ: 'se', ソ: 'so',
  タ: 'ta', チ: 'chi',ツ: 'tsu',テ: 'te', ト: 'to',
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no',
  ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo',
  ヤ: 'ya',           ユ: 'yu',           ヨ: 'yo',
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  ワ: 'wa', ヰ: 'wi',           ヱ: 'we', ヲ: 'wo',
  ン: 'n',

  // Voiced & Semi-voiced - Katakana
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
  ヴ: 'vu',

  // Small standalone kana
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o',
  ァ: 'a', ィ: 'i', ゥ: 'u', ェ: 'e', ォ: 'o',
};

/**
 * Converts any Hiragana / Katakana string to standard Hepburn Romaji.
 */
export function toRomaji(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let result = '';
  let i = 0;

  while (i < text.length) {
    const currentChar = text[i];
    const nextChar = text[i + 1] || '';
    const twoChars = currentChar + nextChar;

    // Check for small sokuon (っ / ッ)
    if (currentChar === 'っ' || currentChar === 'ッ') {
      // Find following consonant
      if (nextChar) {
        const nextRomaji = KANA_TO_ROMAJI_MAP[twoChars] || KANA_TO_ROMAJI_MAP[nextChar];
        if (nextRomaji && nextRomaji.length > 0) {
          const firstLetter = nextRomaji[0];
          // Special Hepburn rule: ch -> tch
          if (nextRomaji.startsWith('ch')) {
            result += 't';
          } else {
            result += firstLetter;
          }
        }
      }
      i++;
      continue;
    }

    // Check for chōonpu (ー)
    if (currentChar === 'ー') {
      const lastChar = result.slice(-1);
      if (lastChar && /[aiueo]/i.test(lastChar)) {
        result += lastChar;
      }
      i++;
      continue;
    }

    // Check 2-character digraphs first
    if (KANA_TO_ROMAJI_MAP[twoChars]) {
      result += KANA_TO_ROMAJI_MAP[twoChars];
      i += 2;
      continue;
    }

    // Check 1-character kana
    if (KANA_TO_ROMAJI_MAP[currentChar]) {
      result += KANA_TO_ROMAJI_MAP[currentChar];
      i++;
      continue;
    }

    // Japanese punctuation & spacing
    if (currentChar === '、' || currentChar === '，') {
      result += ', ';
      i++;
      continue;
    }
    if (currentChar === '。' || currentChar === '．') {
      result += '. ';
      i++;
      continue;
    }
    if (currentChar === '！') {
      result += '! ';
      i++;
      continue;
    }
    if (currentChar === '？') {
      result += '? ';
      i++;
      continue;
    }
    if (currentChar === '　') {
      result += ' ';
      i++;
      continue;
    }

    // Default pass-through (alphanumeric, spaces, non-kana)
    result += currentChar;
    i++;
  }

  return result.replace(/\s+/g, ' ').trim();
}

/**
 * Parses kanji examples in the legacy format "一つ(ひとつ)" or `{ word, reading }`
 * into a fully structured, readable object with Romaji and fallback meaning.
 */
export function parseKanjiExample(
  ex: any,
  fallbackMeaning?: string
): { word: string; reading: string; romaji: string; meaning: string } {
  if (!ex) {
    return { word: '', reading: '', romaji: '', meaning: '' };
  }

  let word = typeof ex === 'string' ? ex : (ex.word || '');
  let reading = typeof ex === 'object' && ex.reading ? ex.reading : '';
  const meaning = typeof ex === 'object' && ex.meaning ? ex.meaning : '';

  // Extract parentheses: e.g. "一つ(ひとつ)" or "一日(いちにち)"
  const parenMatch = word.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
  if (parenMatch) {
    word = parenMatch[1].trim();
    if (!reading) reading = parenMatch[2].trim();
  }

  const romaji = ex.romaji || toRomaji(reading || word);

  return {
    word,
    reading,
    romaji,
    meaning: meaning || fallbackMeaning || '',
  };
}

/**
 * Converts a Japanese example sentence to clean, spaced Hepburn Romaji.
 * Requires a kana reading (or kana-only text). If the input still contains
 * unresolved Kanji, returns empty string to prevent displaying garbled mixed text.
 */
export function toSentenceRomaji(japaneseText: string, reading?: string): string {
  const source = (reading || japaneseText || '').trim();
  if (!source) return '';

  // If text still contains raw Kanji, cannot reliably romanize without phonetic reading
  if (/[\u4e00-\u9faf]/.test(source)) {
    return '';
  }

  // Insert natural spacing around common grammatical particles
  const spaced = source
    .replace(/([^\s])を/g, '$1 を ')
    .replace(/([^\s])が/g, '$1 が ')
    .replace(/([^\s])に/g, '$1 に ')
    .replace(/([^\s])で/g, '$1 で ')
    .replace(/([^\s])へ/g, '$1 へ ')
    .replace(/([^\s])と/g, '$1 と ')
    .replace(/([^\s])から/g, '$1 から ')
    .replace(/([^\s])まで/g, '$1 まで ')
    .replace(/([^\s])は/g, '$1 は ')
    .replace(/([^\s])の/g, '$1 の ');

  let raw = toRomaji(spaced);

  // Particle transliteration adjustments for natural readability
  raw = raw
    .replace(/\bwo\b/g, 'o')
    .replace(/\s+/g, ' ')
    .trim();

  // If raw still has any Kanji, do not show
  if (/[\u4e00-\u9faf]/.test(raw)) {
    return '';
  }

  return raw;
}
