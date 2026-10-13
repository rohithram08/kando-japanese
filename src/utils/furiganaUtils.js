// src/utils/furiganaUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Adaptive Furigana Engine & Japanese Orthographic Segmentation
// Implements 3-stage adaptive fading assistance:
// 1. Always On (Beginner scaffolding)
// 2. Reveal on Demand (Hover/Tap peek for familiar items)
// 3. Off by Default (Reading independence for mastered items)
// ─────────────────────────────────────────────────────────────────────────────

const KANJI_REGEX = /[\u4e00-\u9faf\u3400-\u4dbf]/;

/**
 * Checks whether a character or string contains at least one Kanji.
 * @param {string} text
 * @returns {boolean}
 */
export function containsKanji(text) {
  if (!text || typeof text !== 'string') return false;
  return KANJI_REGEX.test(text);
}

/**
 * Segment a word and its reading into Kanji blocks with matched reading and unadorned Okurigana.
 * Example: 食べる + たべる => [{ text: '食', reading: 'たべ', isKanji: true }, { text: 'る', reading: null, isKanji: false }]
 * Example: お茶 + おちゃ => [{ text: 'お', reading: null, isKanji: false }, { text: '茶', reading: 'ちゃ', isKanji: true }]
 * Example: 私 + わたし => [{ text: '私', reading: 'わたし', isKanji: true }]
 * Example: ありがとう + ありがとう => [{ text: 'ありがとう', reading: null, isKanji: false }]
 *
 * @param {string} word - Headword (e.g. '食べる', '学校')
 * @param {string} reading - Full reading in kana (e.g. 'たべる', 'がっこう')
 * @returns {Array<{ text: string, reading: string|null, isKanji: boolean }>}
 */
export function parseFuriganaSegments(word, reading) {
  if (!word) return [];

  // 1. If already an array of segments, return as-is
  if (Array.isArray(word)) return word;

  // 2. Explicitly authored ruby syntax: e.g. "食[た]べる" or "食[た]べ物[もの]" or "今日[きょう]"
  if (typeof word === 'string' && word.includes('[') && word.includes(']')) {
    const bracketRegex = /([^\[\]]*?)([\u4e00-\u9faf\u3400-\u4dbf]+)\[([^\]]+)\]|([^\[\]]+)/g;
    const segments = [];
    let match;
    while ((match = bracketRegex.exec(word)) !== null) {
      if (match[2] && match[3]) {
        if (match[1]) {
          segments.push({
            text: match[1],
            reading: null,
            isKanji: containsKanji(match[1]),
          });
        }
        segments.push({
          text: match[2],
          reading: match[3],
          isKanji: true,
        });
      } else if (match[4]) {
        segments.push({
          text: match[4],
          reading: null,
          isKanji: containsKanji(match[4]),
        });
      }
    }
    if (segments.length > 0) return segments;
  }

  // 3. Fallback if no reading, kana-only, or word equals reading
  if (!reading || word === reading || !containsKanji(word)) {
    return [{ text: word, reading: null, isKanji: false }];
  }

  // 4. Calculate matching prefix kana
  let prefixLen = 0;
  while (
    prefixLen < word.length &&
    prefixLen < reading.length &&
    word[prefixLen] === reading[prefixLen] &&
    !containsKanji(word[prefixLen])
  ) {
    prefixLen++;
  }

  // 5. Calculate matching suffix kana
  let suffixLen = 0;
  while (
    suffixLen < word.length - prefixLen &&
    suffixLen < reading.length - prefixLen &&
    word[word.length - 1 - suffixLen] === reading[reading.length - 1 - suffixLen] &&
    !containsKanji(word[word.length - 1 - suffixLen])
  ) {
    suffixLen++;
  }

  const segments = [];

  // Prefix kana if present
  if (prefixLen > 0) {
    segments.push({
      text: word.slice(0, prefixLen),
      reading: null,
      isKanji: false,
    });
  }

  // Core portion
  const kanjiPart = word.slice(prefixLen, word.length - suffixLen);
  const readingPart = reading.slice(prefixLen, reading.length - suffixLen);

  if (kanjiPart) {
    // Check for single interstitial kana separator inside kanjiPart: e.g. 食べ物 (べ)
    const kanaMatch = kanjiPart.match(/^([\u4e00-\u9faf\u3400-\u4dbf]+)([^\u4e00-\u9faf\u3400-\u4dbf]+)([\u4e00-\u9faf\u3400-\u4dbf]+)$/);
    if (kanaMatch) {
      const [, k1, kanaSep, k2] = kanaMatch;
      const sepIdx = readingPart.indexOf(kanaSep);
      if (sepIdx > 0 && sepIdx + kanaSep.length < readingPart.length) {
        const r1 = readingPart.slice(0, sepIdx);
        const r2 = readingPart.slice(sepIdx + kanaSep.length);
        segments.push({ text: k1, reading: r1, isKanji: true });
        segments.push({ text: kanaSep, reading: null, isKanji: false });
        segments.push({ text: k2, reading: r2, isKanji: true });
      } else {
        // Safe fallback: entire cluster receives readingPart (e.g. jukujikun / ambiguous)
        segments.push({
          text: kanjiPart,
          reading: readingPart || null,
          isKanji: containsKanji(kanjiPart),
        });
      }
    } else {
      // Single kanji or uninterrupted kanji cluster (e.g. 学校, 今日, 日本語)
      segments.push({
        text: kanjiPart,
        reading: readingPart || null,
        isKanji: containsKanji(kanjiPart),
      });
    }
  }

  // Suffix kana if present
  if (suffixLen > 0) {
    segments.push({
      text: word.slice(word.length - suffixLen),
      reading: null,
      isKanji: false,
    });
  }

  return segments;
}

/**
 * Determines whether furigana should be visible, hidden, or revealed on demand
 * based on user setting, mastery level, and context (e.g. active testing vs browsing).
 *
 * @param {object} params
 * @param {'adaptive'|'always'|'reveal'|'off'} [params.mode='adaptive'] - User global preference
 * @param {number} [params.repetitions=0] - Number of successful SRS repetitions
 * @param {boolean} [params.isMastered=false] - Whether item is explicitly mastered
 * @param {boolean} [params.isTesting=false] - Whether in active SRS recall test
 * @returns {{ visibility: 'visible'|'hidden', canReveal: boolean, stage: string, reason: string }}
 */
export function getAdaptiveFuriganaMode({
  mode = 'adaptive',
  repetitions = 0,
  isMastered = false,
  isTesting = false,
} = {}) {
  // Manual global overrides
  if (mode === 'always') {
    if (isTesting) {
      return {
        visibility: 'hidden',
        canReveal: true,
        stage: 'testing',
        reason: 'Hidden during recall test so you can test your memory. Tap to reveal reading.',
      };
    }
    return {
      visibility: 'visible',
      canReveal: false,
      stage: 'always',
      reason: 'Furigana is set to Always On.',
    };
  }

  if (mode === 'off') {
    return {
      visibility: 'hidden',
      canReveal: true,
      stage: 'off',
      reason: 'Furigana is turned off in settings. Tap or click to reveal reading.',
    };
  }

  if (mode === 'reveal') {
    return {
      visibility: 'hidden',
      canReveal: true,
      stage: 'reveal',
      reason: 'Reveal-on-demand mode active. Hover or tap to peek at reading.',
    };
  }

  // ── Adaptive Mode (Cognitive Load & SRS Guided) ──
  if (isTesting) {
    return {
      visibility: 'hidden',
      canReveal: true,
      stage: 'testing',
      reason: 'Active recall test. Try to remember the reading before tapping to reveal.',
    };
  }

  // Stage 3: Mastered (5+ reviews or mastered flag) -> Off by Default
  if (isMastered || repetitions >= 5) {
    return {
      visibility: 'hidden',
      canReveal: true,
      stage: 'mastered',
      reason: 'Mastered word (5+ reviews). Reading assistance faded for authentic reading fluency.',
    };
  }

  // Stage 2: Familiar (3–4 reviews) -> Reveal on Demand
  if (repetitions >= 3) {
    return {
      visibility: 'hidden',
      canReveal: true,
      stage: 'familiar',
      reason: 'Familiar word (3+ reviews). Reading assistance hidden until you hover or tap.',
    };
  }

  // Stage 1: Learning (<3 reviews) -> Always On scaffolding
  return {
    visibility: 'visible',
    canReveal: false,
    stage: 'learning',
    reason: 'Learning stage. Full reading scaffolding provided.',
  };
}
