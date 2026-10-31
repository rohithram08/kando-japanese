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
 * Converts a grammar pattern formula (e.g. "〜は〜です", "〜は〜ではありません", "〜を〜します")
 * to authentic, localized Hepburn Romaji with correct particle pronunciations
 * ("は" -> "wa", "を" -> "o", "へ" -> "e", "では" -> "dewa").
 */
export function toGrammarPatternRomaji(pattern: string): string {
  if (!pattern || typeof pattern !== 'string') return '';
  let p = pattern;

  // Normalize Japanese tildes to standard ~
  p = p.replace(/[〜～]/g, '~');

  // Grammar particles & copulas
  p = p.replace(/ではありません/g, 'dewa arimasen');
  p = p.replace(/じゃありません/g, 'ja arimasen');
  p = p.replace(/じゃないです/g, 'ja nai desu');
  p = p.replace(/じゃない/g, 'ja nai');
  p = p.replace(/ではない/g, 'dewa nai');
  p = p.replace(/です/g, 'desu');
  p = p.replace(/でした/g, 'deshita');
  p = p.replace(/てはいけない/g, 'te wa ikenai');
  p = p.replace(/てはいけません/g, 'te wa ikemasen');
  p = p.replace(/てはならない/g, 'te wa naranai');
  p = p.replace(/ては/g, 'te wa');
  p = p.replace(/では/g, 'de wa');
  p = p.replace(/たいです/g, 'tai desu');
  p = p.replace(/ましょう/g, 'mashou');
  p = p.replace(/てください/g, 'te kudasai');
  p = p.replace(/ている/g, 'te iru');
  p = p.replace(/ないでください/g, 'naide kudasai');
  p = p.replace(/から/g, 'kara');
  p = p.replace(/まで/g, 'made');

  // Topic marker & grammatical particles surrounded by pattern anchors
  p = p.replace(/(~|\b|\s)は(~|\b|\s|$)/g, '$1wa$2');
  p = p.replace(/(~|\b|\s)を(~|\b|\s|$)/g, '$1o$2');
  p = p.replace(/(~|\b|\s)へ(~|\b|\s|$)/g, '$1e$2');
  p = p.replace(/(~|\b|\s)が(~|\b|\s|$)/g, '$1ga$2');
  p = p.replace(/(~|\b|\s)に(~|\b|\s|$)/g, '$1ni$2');
  p = p.replace(/(~|\b|\s)で(~|\b|\s|$)/g, '$1de$2');

  return toRomaji(p);
}

const PARTICLE_STARTS = /^(は|が|を|に|へ|で|と|から|まで|より|の|も|や|など|です|でした|だ|だった|ではありません|じゃありません|じゃないです)/;

function formatKanaChunk(text: string, afterNoun: boolean): string {
  let s = text;
  // Polite copulas & negatives (evaluate before generic te/de replace)
  s = s.replace(/ではありません/g, ' dewa arimasen');
  s = s.replace(/じゃありません/g, ' ja arimasen');
  s = s.replace(/じゃないです/g, ' ja nai desu');
  s = s.replace(/じゃない/g, ' ja nai');
  s = s.replace(/ではない/g, ' dewa nai');
  s = s.replace(/です/g, ' desu');
  s = s.replace(/でした/g, ' deshita');

  // Demonstratives and pronouns followed by particle は (wa)
  s = s.replace(/^(これ|それ|あれ|どれ|ここ|そこ|あそこ|どこ|わたし|あなた|かれ|かのじょ|だれ|ぼく|おれ)は/g, '$1 wa ');
  // Honorifics followed by は
  s = s.replace(/(さん|くん|ちゃん|さま|様)は/g, '$1 wa ');
  // Verb te-form / de-form followed by は
  s = s.replace(/([てで])は/g, '$1 wa ');
  // Topic marker は directly after noun
  if (afterNoun && s.startsWith('は')) {
    s = s.replace(/^は/, 'wa ');
  }
  // Standalone は is topic marker
  if (s === 'は') {
    s = 'wa';
  }
  // Particle を (o)
  s = s.replace(/([^\s])を/g, '$1 o ');
  s = s.replace(/^を/g, 'o ');

  return toRomaji(s);
}

function formatKanaSentence(text: string): string {
  let s = text;
  // Polite copulas & negatives (evaluate before generic te/de replace)
  s = s.replace(/ではありません/g, ' dewa arimasen');
  s = s.replace(/じゃありません/g, ' ja arimasen');
  s = s.replace(/じゃないです/g, ' ja nai desu');
  s = s.replace(/じゃない/g, ' ja nai');
  s = s.replace(/ではない/g, ' dewa nai');
  s = s.replace(/です/g, ' desu');
  s = s.replace(/でした/g, ' deshita');

  s = s.replace(/(これ|それ|あれ|どれ|ここ|そこ|あそこ|どこ|わたし|あなた|かれ|かのじょ|だれ|ぼく|おれ)は/g, '$1 wa ');
  s = s.replace(/(さん|くん|ちゃん|さま|様)は/g, '$1 wa ');
  s = s.replace(/([てで])は/g, '$1 wa ');
  s = s.replace(/([^\s])を/g, '$1 o ');
  s = s.replace(/^を/g, 'o ');
  return cleanSentence(toRomaji(s));
}

function cleanSentence(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?:;])/g, '$1')
    .trim();
}

/**
 * Converts a Japanese example sentence to clean, natural, spaced Hepburn Romaji.
 * Intelligently aligns Kanji words with their phonetic Kana readings so that
 * multi-syllable words (e.g. 学生 -> gakusei, です -> desu) are never split,
 * and authentic particle pronunciations (は -> wa, を -> o, へ -> e) are respected.
 */
export function toSentenceRomaji(japaneseText: string, reading?: string): string {
  const jp = (japaneseText || '').trim();
  const r = (reading || jp).trim();
  if (!jp && !r) return '';

  // If text still contains raw Kanji and no phonetic reading is available, do not output broken text
  if (!reading && /[\u4e00-\u9faf]/.test(jp)) {
    return '';
  }

  // If sentence has no Kanji, use phonetic kana formatting directly
  if (!/[\u4e00-\u9faf]/.test(jp)) {
    return formatKanaSentence(r);
  }

  // Segment Kanji chunks vs non-Kanji chunks
  const chunks: { text: string; isKanji: boolean }[] = [];
  let current = '';
  let isK: boolean | null = null;
  for (const ch of jp) {
    const kanji = /[\u4e00-\u9faf]/.test(ch);
    if (isK === null) {
      current = ch;
      isK = kanji;
    } else if (kanji === isK) {
      current += ch;
    } else {
      chunks.push({ text: current, isKanji: isK });
      current = ch;
      isK = kanji;
    }
  }
  if (current && isK !== null) chunks.push({ text: current, isKanji: isK });

  let rIdx = 0;
  const segments: { text: string; reading: string; isKanji: boolean }[] = [];

  for (let c = 0; c < chunks.length; c++) {
    const chunk = chunks[c];
    if (chunk.isKanji) {
      const nextKanaChunk = chunks[c + 1];
      if (nextKanaChunk) {
        const found = r.indexOf(nextKanaChunk.text, rIdx);
        if (found !== -1) {
          const chunkReading = r.slice(rIdx, found);
          segments.push({ text: chunk.text, reading: chunkReading, isKanji: true });
          rIdx = found;
        } else {
          segments.push({ text: chunk.text, reading: '', isKanji: true });
        }
      } else {
        const chunkReading = r.slice(rIdx);
        segments.push({ text: chunk.text, reading: chunkReading, isKanji: true });
        rIdx = r.length;
      }
    } else {
      segments.push({ text: chunk.text, reading: chunk.text, isKanji: false });
      rIdx += chunk.text.length;
    }
  }

  // Assemble into clean, spaced Hepburn Romaji
  let result = '';
  for (let s = 0; s < segments.length; s++) {
    const seg = segments[s];
    if (seg.isKanji) {
      const rom = toRomaji(seg.reading);
      result += (result && !result.endsWith(' ') ? ' ' : '') + rom;
    } else {
      let kText = seg.reading;
      const isOkurigana =
        s > 0 &&
        segments[s - 1].isKanji &&
        !PARTICLE_STARTS.test(kText) &&
        !kText.startsWith('さん') &&
        !kText.startsWith('くん') &&
        !kText.startsWith('ちゃん');

      kText = formatKanaChunk(kText, s > 0 && segments[s - 1].isKanji && !isOkurigana);

      const needsSpace =
        !isOkurigana &&
        Boolean(result) &&
        !result.endsWith(' ') &&
        !kText.startsWith('.') &&
        !kText.startsWith(',') &&
        !kText.startsWith('!') &&
        !kText.startsWith('?');
      result += (needsSpace ? ' ' : '') + kText;
    }
  }

  const finalRomaji = cleanSentence(result);
  if (/[\u4e00-\u9faf]/.test(finalRomaji)) {
    return '';
  }

  return finalRomaji;
}
