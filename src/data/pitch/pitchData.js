// src/data/pitch/pitchData.js
// ─────────────────────────────────────────────────────────────────────────────
// Tokyo Japanese Pitch Accent ($F_0$) Data Model & Verified Dictionary
// Source Attribution: NHK 日本語発音アクセント新辞典 & Kanjium Pitch Dataset
// Licence: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
//
// LINGUISTIC RULES:
// 1. A mora (拍) is the phonetic time unit of Japanese, NOT character count.
//    - Standalone kana (あ, か, さ, etc.) = 1 mora
//    - Digraphs / Yōon (きゃ, しゅ, ちょ, etc.) = 1 mora
//    - Sokuon (っ / ッ) = 1 mora
//    - Nasal (ん / ン) = 1 mora
//    - Chōonpu (ー) or prolonged vowels = 1 mora
// 2. Main Tokyo Pitch Accent Categories:
//    - ⓪ 平板 (Heiban / Flat): Drop = 0. Mora 1 is Low, Moras 2..N are High.
//      Pitch DOES NOT drop; stays High into following particles (e.g., さくら-が [L-H-H-H]).
//    - ① 頭高 (Atamadaka / Head-High): Drop = 1. Mora 1 is High, all others Low.
//      Drops immediately after mora 1; particles are Low (e.g., いのち-が [H-L-L-L]).
//    - ②, ③... 中高 (Nakadaka / Mid-High): Drop = k (1 < k < N).
//      Mora 1 is Low, Moras 2..k are High, then drops to Low on mora k+1.
//      Particles are Low (e.g., たまご-が [L-H-L-L], drop after mora 2).
//    - [N] 尾高 (Odaka / Tail-High): Drop = N.
//      Mora 1 is Low, Moras 2..N are High. Drops on the FOLLOWING PARTICLE!
//      (e.g., おとこ-が [L-H-H-L], drop after mora 3 onto particle が).
// ─────────────────────────────────────────────────────────────────────────────

// Small kana that combine with the preceding character to form a SINGLE mora (Yōon digraphs)
const CONTRACTED_KANA = new Set([
  'ゃ', 'ゅ', 'ょ',
  'ャ', 'ュ', 'ョ',
  'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ',
  'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
  'ゎ', 'ヮ'
]);

/**
 * Segments a Japanese reading into linguistically correct morae.
 * @param {string} reading - Hiragana or Katakana string (e.g. 'とうきょう', 'がっこう')
 * @returns {string[]} Array of mora units (e.g. ['と', 'う', 'きょ', 'う'])
 */
export function segmentMorae(reading) {
  if (!reading || typeof reading !== 'string') return [];
  const chars = Array.from(reading.trim());
  const morae = [];

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (CONTRACTED_KANA.has(char) && morae.length > 0) {
      // Combines with previous mora
      morae[morae.length - 1] += char;
    } else {
      morae.push(char);
    }
  }

  return morae;
}

/**
 * Computes high/low pitch levels and particle pitch for a given mora count and drop position.
 * @param {number} moraCount - Total number of morae
 * @param {number} dropPosition - 0 for Heiban, 1 for Atamadaka, 2..N-1 for Nakadaka, N for Odaka
 * @returns {{ pitchHeights: ('H'|'L')[], particlePitch: ('H'|'L'), pattern: string, dropPosition: number }}
 */
export function computePitchHeights(moraCount, dropPosition) {
  if (moraCount <= 0) {
    return { pitchHeights: [], particlePitch: 'L', pattern: 'heiban', dropPosition: 0 };
  }

  if (moraCount === 1) {
    if (dropPosition === 1) {
      return { pitchHeights: ['H'], particlePitch: 'L', pattern: 'atamadaka', dropPosition: 1 };
    }
    return { pitchHeights: ['L'], particlePitch: 'H', pattern: 'heiban', dropPosition: 0 };
  }

  // Multi-mora words (moraCount >= 2)
  if (dropPosition === 0) {
    // ⓪ Heiban (Flat): Mora 1 Low, Moras 2..N High, Particle High
    const heights = ['L'];
    for (let i = 1; i < moraCount; i++) heights.push('H');
    return { pitchHeights: heights, particlePitch: 'H', pattern: 'heiban', dropPosition: 0 };
  }

  if (dropPosition === 1) {
    // ① Atamadaka (Head-High): Mora 1 High, Moras 2..N Low, Particle Low
    const heights = ['H'];
    for (let i = 1; i < moraCount; i++) heights.push('L');
    return { pitchHeights: heights, particlePitch: 'L', pattern: 'atamadaka', dropPosition: 1 };
  }

  if (dropPosition === moraCount) {
    // 尾高 (Odaka / Tail-High): Mora 1 Low, Moras 2..N High, Particle Low (drop on particle)
    const heights = ['L'];
    for (let i = 1; i < moraCount; i++) heights.push('H');
    return { pitchHeights: heights, particlePitch: 'L', pattern: 'odaka', dropPosition: moraCount };
  }

  // 中高 (Nakadaka / Mid-High): Mora 1 Low, Moras 2..drop High, Moras drop+1..N Low, Particle Low
  const heights = ['L'];
  for (let i = 1; i < moraCount; i++) {
    if (i < dropPosition) {
      heights.push('H');
    } else {
      heights.push('L');
    }
  }
  return { pitchHeights: heights, particlePitch: 'L', pattern: 'nakadaka', dropPosition };
}

/**
 * Human-friendly labels and descriptions for Tokyo Pitch Accent categories.
 */
export const PITCH_PATTERN_META = {
  heiban: {
    kanji: '平板',
    romaji: 'Heiban',
    english: 'Flat / Low-to-High',
    code: 0,
    badgeColor: 'blue',
    description: 'Starts low, rises on the 2nd mora and stays high through any attached particle (が, を, は). No pitch drop.',
  },
  atamadaka: {
    kanji: '頭高',
    romaji: 'Atamadaka',
    english: 'Head-High',
    code: 1,
    badgeColor: 'red',
    description: 'Starts high on the 1st mora, then drops immediately to low. All following morae and particles are low.',
  },
  nakadaka: {
    kanji: '中高',
    romaji: 'Nakadaka',
    english: 'Mid-High',
    code: 2,
    badgeColor: 'amber',
    description: 'Starts low, rises on the 2nd mora, stays high, and drops to low in the middle of the word.',
  },
  odaka: {
    kanji: '尾高',
    romaji: 'Odaka',
    english: 'Tail-High',
    code: 3,
    badgeColor: 'purple',
    description: 'Starts low and stays high throughout the word, but drops to low immediately on the attached particle (が, を, は).',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED TOKYO PITCH ACCENT REPOSITORY
// All entries curated and verified against NHK Accent Dictionary consensus.
// ─────────────────────────────────────────────────────────────────────────────
export const VERIFIED_PITCH_DICTIONARY = [
  // ── Famous Minimal Pairs (Crucial for Japanese differentiation) ──
  {
    word: '箸',
    reading: 'はし',
    dropPosition: 1,
    meaning: 'chopsticks',
    notes: '① Atamadaka: H-L. Distinguishes from 橋 (bridge) and 端 (edge).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '橋',
    reading: 'はし',
    dropPosition: 2,
    meaning: 'bridge',
    notes: '② Odaka: L-H-[L]. Drops on the following particle (e.g. 橋が ha-SHI-ga).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '端',
    reading: 'はし',
    dropPosition: 0,
    meaning: 'edge / corner',
    notes: '⓪ Heiban: L-H-[H]. Particle stays high (e.g. 端が ha-SHI-GA).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '雨',
    reading: 'あめ',
    dropPosition: 1,
    meaning: 'rain',
    notes: '① Atamadaka: H-L. Distinguishes from 飴 (candy).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '飴',
    reading: 'あめ',
    dropPosition: 0,
    meaning: 'candy',
    notes: '⓪ Heiban: L-H-[H].',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '花',
    reading: 'はな',
    dropPosition: 2,
    meaning: 'flower',
    notes: '② Odaka: L-H-[L]. Drops on the following particle (花が ha-NA-ga). Distinguishes from 鼻 (nose).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '鼻',
    reading: 'はな',
    dropPosition: 0,
    meaning: 'nose',
    notes: '⓪ Heiban: L-H-[H]. Particle stays high (鼻が ha-NA-GA).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '柿',
    reading: 'かき',
    dropPosition: 0,
    meaning: 'persimmon',
    notes: '⓪ Heiban: L-H-[H]. Distinguishes from 牡蠣 (oyster).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '牡蠣',
    reading: 'かき',
    dropPosition: 1,
    meaning: 'oyster',
    notes: '① Atamadaka: KA-ki (H-L). Primary NHK standard Tokyo accent. Colloquially heard as Odaka ② in western dialects.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '垣',
    reading: 'かき',
    dropPosition: 2,
    meaning: 'fence / hedge',
    notes: '② Odaka: ka-KI-[ga]. Drops on following particle.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },

  // ── Pronouns & People ──
  {
    word: '私',
    reading: 'わたし',
    dropPosition: 0,
    meaning: 'I / me',
    notes: '⓪ Heiban: wa-TA-SHI (wa is low, ta-shi are high).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: 'あなた',
    reading: 'あなた',
    dropPosition: 2,
    meaning: 'you',
    notes: '② Nakadaka: a-NA-ta (na is high, drops on ta).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '彼',
    reading: 'かれ',
    dropPosition: 1,
    meaning: 'he / him',
    notes: '① Atamadaka: KA-re.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '彼女',
    reading: 'かのじょ',
    dropPosition: 1,
    meaning: 'she / her',
    notes: '① Atamadaka: KA-no-jo.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '先生',
    reading: 'せんせい',
    dropPosition: 3,
    meaning: 'teacher',
    notes: '③ Nakadaka: se-N-SE-i (drops on i). 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '学生',
    reading: 'がくせい',
    dropPosition: 0,
    meaning: 'student',
    notes: '⓪ Heiban: ga-KU-SE-I. 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '友達',
    reading: 'ともだち',
    dropPosition: 0,
    meaning: 'friend',
    notes: '⓪ Heiban: to-MO-DA-CHI. 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '子供',
    reading: 'こども',
    dropPosition: 0,
    meaning: 'child',
    notes: '⓪ Heiban: ko-DO-MO.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '男',
    reading: 'おとこ',
    dropPosition: 3,
    meaning: 'man',
    notes: '③ Odaka: o-TO-KO-[ga].',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '女',
    reading: 'おんな',
    dropPosition: 3,
    meaning: 'woman',
    notes: '③ Odaka: o-N-NA-[ga]. (ん is mora 2).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },

  // ── Core Verbs (Dictionary Form) ──
  {
    word: '食べる',
    reading: 'たべる',
    dropPosition: 2,
    meaning: 'to eat',
    notes: '② Nakadaka: ta-BE-ru (drops after be).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '飲む',
    reading: 'のむ',
    dropPosition: 1,
    meaning: 'to drink',
    notes: '① Atamadaka: NO-mu.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '行く',
    reading: 'いく',
    dropPosition: 0,
    meaning: 'to go',
    notes: '⓪ Heiban: i-KU.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '来る',
    reading: 'くる',
    dropPosition: 1,
    meaning: 'to come',
    notes: '① Atamadaka: KU-ru.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '見る',
    reading: 'みる',
    dropPosition: 1,
    meaning: 'to see / look',
    notes: '① Atamadaka: MI-ru.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '聞く',
    reading: 'きく',
    dropPosition: 0,
    meaning: 'to listen / hear',
    notes: '⓪ Heiban: ki-KU.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '話す',
    reading: 'はなす',
    dropPosition: 2,
    meaning: 'to speak',
    notes: '② Nakadaka: ha-NA-su.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '買う',
    reading: 'かう',
    dropPosition: 0,
    meaning: 'to buy',
    notes: '⓪ Heiban: ka-U.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '待つ',
    reading: 'まつ',
    dropPosition: 1,
    meaning: 'to wait',
    notes: '① Atamadaka: MA-tsu.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '読む',
    reading: 'よむ',
    dropPosition: 1,
    meaning: 'to read',
    notes: '① Atamadaka: YO-mu.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '書く',
    reading: 'かく',
    dropPosition: 1,
    meaning: 'to write',
    notes: '① Atamadaka: KA-ku.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '寝る',
    reading: 'ねる',
    dropPosition: 0,
    meaning: 'to sleep',
    notes: '⓪ Heiban: ne-RU.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '起きる',
    reading: 'おきる',
    dropPosition: 2,
    meaning: 'to wake up',
    notes: '② Nakadaka: o-KI-ru.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '帰る',
    reading: 'かえる',
    dropPosition: 1,
    meaning: 'to return home',
    notes: '① Atamadaka: KA-e-ru.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },

  // ── Core Adjectives ──
  {
    word: '大きい',
    reading: 'おおきい',
    dropPosition: 3,
    meaning: 'big / large',
    notes: '③ Nakadaka: o-O-KI-i (drops after ki). 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '小さい',
    reading: 'ちいさい',
    dropPosition: 3,
    meaning: 'small',
    notes: '③ Nakadaka: chi-I-SA-i (drops after sa). 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '高い',
    reading: 'たかい',
    dropPosition: 2,
    meaning: 'high / expensive',
    notes: '② Nakadaka: ta-KA-i.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '安い',
    reading: 'やすい',
    dropPosition: 2,
    meaning: 'cheap / inexpensive',
    notes: '② Nakadaka: ya-SU-i.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '新しい',
    reading: 'あたらしい',
    dropPosition: 4,
    meaning: 'new',
    notes: '④ Nakadaka: a-TA-RA-SHI-i (drops after shi). 5 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '古い',
    reading: 'ふるい',
    dropPosition: 2,
    meaning: 'old',
    notes: '② Nakadaka: fu-RU-i.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: 'いい',
    reading: 'いい',
    dropPosition: 1,
    meaning: 'good',
    notes: '① Atamadaka: I-i.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },

  // ── Common Everyday Nouns ──
  {
    word: '本',
    reading: 'ほん',
    dropPosition: 1,
    meaning: 'book',
    notes: '① Atamadaka: HO-n. 2 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '水',
    reading: 'みず',
    dropPosition: 0,
    meaning: 'water',
    notes: '⓪ Heiban: mi-ZU.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: 'お茶',
    reading: 'おちゃ',
    dropPosition: 0,
    meaning: 'tea / green tea',
    notes: '⓪ Heiban: o-CHA. 2 morae (ちゃ is 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '車',
    reading: 'くるま',
    dropPosition: 0,
    meaning: 'car',
    notes: '⓪ Heiban: ku-RU-MA.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '学校',
    reading: 'がっこう',
    dropPosition: 0,
    meaning: 'school',
    notes: '⓪ Heiban: ga-K-KO-U. 4 morae (っ counts as 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '日本',
    reading: 'にほん',
    dropPosition: 2,
    meaning: 'Japan',
    notes: '② Nakadaka: ni-HO-n. 3 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '日本語',
    reading: 'にほんご',
    dropPosition: 0,
    meaning: 'Japanese language',
    notes: '⓪ Heiban: ni-HO-N-GO. 4 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '東京',
    reading: 'とうきょう',
    dropPosition: 0,
    meaning: 'Tokyo',
    notes: '⓪ Heiban: to-U-KYO-U. 4 morae (きょ counts as 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '犬',
    reading: 'いぬ',
    dropPosition: 2,
    meaning: 'dog',
    notes: '② Odaka: i-NU-[ga]. Drops on following particle.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '猫',
    reading: 'ねこ',
    dropPosition: 1,
    meaning: 'cat',
    notes: '① Atamadaka: NE-ko.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '山',
    reading: 'やま',
    dropPosition: 2,
    meaning: 'mountain',
    notes: '② Odaka: ya-MA-[ga]. Drops on particle.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '川',
    reading: 'かわ',
    dropPosition: 2,
    meaning: 'river',
    notes: '② Odaka: ka-WA-[ga]. Drops on particle.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '今日',
    reading: 'きょう',
    dropPosition: 1,
    meaning: 'today',
    notes: '① Atamadaka: KYO-u. 2 morae (きょ counts as 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '明日',
    reading: 'あした',
    dropPosition: 3,
    meaning: 'tomorrow',
    notes: '③ Odaka: a-SHI-TA-[ga]. Drops on particle.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '名前',
    reading: 'なまえ',
    dropPosition: 0,
    meaning: 'name',
    notes: '⓪ Heiban: na-MA-E.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '時間',
    reading: 'じかん',
    dropPosition: 0,
    meaning: 'time',
    notes: '⓪ Heiban: ji-KA-N. 3 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '写真',
    reading: 'しゃしん',
    dropPosition: 0,
    meaning: 'photograph',
    notes: '⓪ Heiban: sha-SHI-N. 3 morae (しゃ is 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '朝',
    reading: 'あさ',
    dropPosition: 1,
    meaning: 'morning',
    notes: '① Atamadaka: A-sa.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '夜',
    reading: 'よる',
    dropPosition: 1,
    meaning: 'night',
    notes: '① Atamadaka: YO-ru.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '寿司',
    reading: 'すし',
    dropPosition: 1,
    meaning: 'sushi',
    notes: '① Atamadaka: SU-shi (traditional Tokyo). Also heard as Heiban in modern Tokyo.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: 'コーヒー',
    reading: 'コーヒー',
    dropPosition: 3,
    meaning: 'coffee',
    notes: '③ Nakadaka: ko-O-HI-i. 4 morae (ー counts as separate mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '映画',
    reading: 'えいが',
    dropPosition: 0,
    meaning: 'movie',
    notes: '⓪ Heiban: e-I-GA. 3 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '傘',
    reading: 'かさ',
    dropPosition: 1,
    meaning: 'umbrella',
    notes: '① Atamadaka: KA-sa.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '手紙',
    reading: 'てがみ',
    dropPosition: 0,
    meaning: 'letter',
    notes: '⓪ Heiban: te-GA-MI.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '時計',
    reading: 'とけい',
    dropPosition: 0,
    meaning: 'clock / watch',
    notes: '⓪ Heiban: to-KE-I. 3 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '部屋',
    reading: 'へや',
    dropPosition: 2,
    meaning: 'room',
    notes: '② Odaka: he-YA-[ga].',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '駅',
    reading: 'えき',
    dropPosition: 1,
    meaning: 'train station',
    notes: '① Atamadaka: E-ki.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '海',
    reading: 'うみ',
    dropPosition: 1,
    meaning: 'sea / ocean',
    notes: '① Atamadaka: U-mi.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '空',
    reading: 'そら',
    dropPosition: 1,
    meaning: 'sky',
    notes: '① Atamadaka: SO-ra.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '肉',
    reading: 'にく',
    dropPosition: 2,
    meaning: 'meat',
    notes: '② Odaka: ni-KU-[ga].',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '魚',
    reading: 'さかな',
    dropPosition: 0,
    meaning: 'fish',
    notes: '⓪ Heiban: sa-KA-NA.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '卵',
    reading: 'たまご',
    dropPosition: 2,
    meaning: 'egg',
    notes: '② Nakadaka: ta-MA-go.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '帽子',
    reading: 'ぼうし',
    dropPosition: 0,
    meaning: 'hat / cap',
    notes: '⓪ Heiban: bo-U-SHI. 3 morae.',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '病院',
    reading: 'びょういん',
    dropPosition: 0,
    meaning: 'hospital',
    notes: '⓪ Heiban: byo-U-I-N. 4 morae (びょ is 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '旅行',
    reading: 'りょこう',
    dropPosition: 0,
    meaning: 'travel / trip',
    notes: '⓪ Heiban: ryo-KO-U. 3 morae (りょ is 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
  {
    word: '宿題',
    reading: 'しゅくだい',
    dropPosition: 0,
    meaning: 'homework',
    notes: '⓪ Heiban: shu-KU-DA-I. 4 morae (しゅ is 1 mora).',
    source: 'NHK Accent Dictionary / Kanjium (CC BY-SA 4.0)',
    verified: true,
  },
];

// Map index for O(1) query by word and reading
const PITCH_INDEX = new Map();

for (const entry of VERIFIED_PITCH_DICTIONARY) {
  const morae = segmentMorae(entry.reading);
  const heightsInfo = computePitchHeights(morae.length, entry.dropPosition);
  const enriched = {
    ...entry,
    morae,
    moraCount: morae.length,
    pitchHeights: heightsInfo.pitchHeights,
    particlePitch: heightsInfo.particlePitch,
    pattern: heightsInfo.pattern,
    patternMeta: PITCH_PATTERN_META[heightsInfo.pattern],
  };

  // Index by word + reading, and also by reading alone if unambiguous
  PITCH_INDEX.set(`${entry.word}_${entry.reading}`, enriched);
  if (!PITCH_INDEX.has(entry.word)) {
    PITCH_INDEX.set(entry.word, enriched);
  }
}

/**
 * Retrieves verified Tokyo pitch accent data for a word.
 * If unannotated, returns null to avoid fabricating data.
 * @param {string} word - Japanese word/kanji (e.g. '食べる', '箸')
 * @param {string} [reading] - Optional reading (e.g. 'たべる', 'はし')
 * @returns {object|null} Enriched pitch accent info or null if unverified
 */
export function getPitchAccent(word, reading) {
  if (!word) return null;

  if (reading) {
    const exact = PITCH_INDEX.get(`${word}_${reading}`);
    if (exact) return exact;
  }

  const byWord = PITCH_INDEX.get(word);
  if (byWord) return byWord;

  if (reading) {
    const byReading = PITCH_INDEX.get(reading);
    if (byReading) return byReading;
  }

  return null;
}
