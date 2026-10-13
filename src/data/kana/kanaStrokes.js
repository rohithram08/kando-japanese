// src/data/kana/kanaStrokes.js
// Verified stroke paths and step-by-step descriptions for basic Japanese Kana.

export const KANA_STROKES = {
  // Hiragana Vowels
  あ: {
    strokeCount: 3,
    tips: [
      '1. Short horizontal line from left to right across top',
      '2. Vertical stroke cutting down through the middle',
      '3. Loop starting on the left, swirling down and around into a wide loop',
    ],
    strokes: [
      'M 25 35 L 75 35',
      'M 50 18 L 48 82',
      'M 40 45 C 22 55, 20 80, 48 80 C 75 80, 85 58, 68 45 C 55 35, 42 45, 38 65',
    ],
  },
  い: {
    strokeCount: 2,
    tips: [
      '1. Left curved vertical stroke curving slightly right with a small hook',
      '2. Right shorter vertical stroke parallel to the first',
    ],
    strokes: [
      'M 30 25 C 28 50, 32 70, 40 75',
      'M 70 35 C 72 50, 68 62, 65 68',
    ],
  },
  う: {
    strokeCount: 2,
    tips: [
      '1. Short diagonal dot near the top',
      '2. Curved arch bending down like an ear or bent back',
    ],
    strokes: [
      'M 42 20 L 58 28',
      'M 32 38 C 65 30, 78 52, 60 78 C 50 88, 38 82, 34 76',
    ],
  },
  え: {
    strokeCount: 2,
    tips: [
      '1. Short diagonal stroke at top',
      '2. Continuous zig-zag stroke: diagonal down-left, horizontal right, wave down and hook',
    ],
    strokes: [
      'M 45 18 L 56 26',
      'M 32 40 L 68 40 L 35 78 C 55 75, 75 75, 82 82',
    ],
  },
  お: {
    strokeCount: 3,
    tips: [
      '1. Top horizontal stroke left to right',
      '2. Vertical stroke down, looping back up and into a big round belly',
      '3. Upper-right accent dot',
    ],
    strokes: [
      'M 25 35 L 70 35',
      'M 48 20 L 48 60 C 48 78, 28 78, 35 62 C 45 48, 78 52, 75 75',
      'M 72 25 L 82 35',
    ],
  },

  // Katakana Vowels
  ア: {
    strokeCount: 2,
    tips: [
      '1. Horizontal stroke right, then curving diagonal down-left',
      '2. Sweeping curved vertical stroke through the left',
    ],
    strokes: [
      'M 25 30 L 75 30 L 52 58',
      'M 50 40 C 42 60, 32 78, 20 85',
    ],
  },
  イ: {
    strokeCount: 2,
    tips: [
      '1. Left diagonal stroke slanting down-left',
      '2. Straight vertical stroke down on the right',
    ],
    strokes: [
      'M 55 20 L 30 55',
      'M 48 40 L 48 85',
    ],
  },
  ウ: {
    strokeCount: 3,
    tips: [
      '1. Center top dot',
      '2. Left vertical tick',
      '3. Horizontal top line bending sharply into a diagonal down-left',
    ],
    strokes: [
      'M 50 15 L 50 25',
      'M 28 35 L 28 50',
      'M 28 35 L 75 35 L 45 82',
    ],
  },
  エ: {
    strokeCount: 3,
    tips: [
      '1. Top horizontal bar',
      '2. Center vertical stem down',
      '3. Bottom wider horizontal bar',
    ],
    strokes: [
      'M 30 25 L 70 25',
      'M 50 25 L 50 75',
      'M 20 75 L 80 75',
    ],
  },
  オ: {
    strokeCount: 3,
    tips: [
      '1. Top horizontal stroke left to right',
      '2. Vertical stroke cutting down with a left hook',
      '3. Diagonal stroke slanting down-left from center',
    ],
    strokes: [
      'M 25 35 L 75 35',
      'M 50 18 L 50 82 L 40 76',
      'M 48 40 L 25 80',
    ],
  },

  // Confusing Katakana Pairs
  シ: {
    strokeCount: 3,
    tips: [
      '1. Upper small dot (flattish)',
      '2. Lower small dot below and slightly left',
      '3. Bottom-left upward sweep curving up toward top-right (starts LOW, sweeps UP)',
    ],
    strokes: [
      'M 32 30 L 44 34',
      'M 26 50 L 38 54',
      'M 22 75 C 38 72, 60 52, 78 28',
    ],
  },
  ツ: {
    strokeCount: 3,
    tips: [
      '1. Left dot (steep downward slant)',
      '2. Middle dot to the right (also steep downward)',
      '3. Top-right downward slice curving down-left (starts HIGH, slices DOWN)',
    ],
    strokes: [
      'M 30 28 L 38 42',
      'M 50 24 L 58 38',
      'M 75 22 C 65 48, 48 72, 28 85',
    ],
  },
  ソ: {
    strokeCount: 2,
    tips: [
      '1. Top-left short stroke pointing steep down-right',
      '2. Main stroke starting from top-right slicing steep downward-left',
    ],
    strokes: [
      'M 34 28 L 44 44',
      'M 72 24 C 62 50, 48 72, 28 85',
    ],
  },
  ン: {
    strokeCount: 2,
    tips: [
      '1. Flatter dot at top-left',
      '2. Upward sweep starting low on left and sweeping up to top-right',
    ],
    strokes: [
      'M 30 38 L 42 42',
      'M 25 78 C 42 70, 62 48, 76 26',
    ],
  },

  // Confusing Hiragana Trio
  れ: {
    strokeCount: 2,
    tips: [
      '1. Straight vertical spine down on the left',
      '2. Zig-zag stroke up, across, down, then kicking foot out to the right',
    ],
    strokes: [
      'M 30 18 L 30 82',
      'M 20 42 L 65 36 L 40 68 C 55 60, 72 65, 82 78',
    ],
  },
  わ: {
    strokeCount: 2,
    tips: [
      '1. Straight vertical spine down on the left',
      '2. Across, then curving into a clean round open circle belly (no loop, no kick)',
    ],
    strokes: [
      'M 30 18 L 30 82',
      'M 20 42 L 65 36 L 40 65 C 55 45, 82 52, 72 75 C 65 85, 48 85, 42 78',
    ],
  },
  ね: {
    strokeCount: 2,
    tips: [
      '1. Straight vertical spine down on the left',
      '2. Across, curved belly, finishing with a small loop/knot at bottom right (cat tail)',
    ],
    strokes: [
      'M 30 18 L 30 82',
      'M 20 42 L 65 36 L 40 65 C 55 45, 82 52, 70 75 C 65 80, 58 75, 62 70 C 66 65, 74 72, 70 78',
    ],
  },
};

export function getKanaStrokeData(char) {
  return KANA_STROKES[char] || null;
}
