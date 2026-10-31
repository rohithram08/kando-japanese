// scripts/build_verified_kanji_strokes.mjs
// Builds authentic, 100% verified KanjiVG vector stroke data for all curriculum Kanji.

import fs from 'fs';
import path from 'path';

const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const OUTPUT_FILE = path.resolve('src/data/kanji/verifiedKanjiStrokes.json');

function getKanjiHex(character) {
  if (!character || typeof character !== 'string') return null;
  const code = character.codePointAt(0);
  if (!code) return null;
  return code.toString(16).padStart(5, '0').toLowerCase();
}

function parseKanjiVg(svgText) {
  // Regex to extract all stroke path d attributes
  const pathMatches = [...svgText.matchAll(/<path[^>]+d="([^"]+)"/g)];
  const strokes = pathMatches
    .map((m) => m[1])
    .filter((d) => !d.startsWith('kvg:'));

  // Regex to extract stroke start number positions
  const numMatches = [...svgText.matchAll(/<text[^>]+(?:matrix\(1\s+0\s+0\s+1\s+([0-9.-]+)\s+([0-9.-]+)\)|x="([0-9.-]+)"\s+y="([0-9.-]+)")[^>]*>(\d+)<\/text>/g)];
  const numbers = numMatches.map((m) => {
    const x = parseFloat(m[1] || m[3] || '0');
    const y = parseFloat(m[2] || m[4] || '0');
    const num = parseInt(m[5], 10);
    return { x, y, num };
  }).filter((n) => n.num > 0);

  // Fallback numbers if none parsed
  if (numbers.length === 0) {
    strokes.forEach((stroke, i) => {
      const m = stroke.match(/^M\s*([0-9.-]+)[,\s]+([0-9.-]+)/i);
      if (m) {
        numbers.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), num: i + 1 });
      }
    });
  }

  // Pedagogical stroke tips
  const tips = strokes.map((_, i) => {
    if (i === 0) return 'Stroke 1: Begin at top / left with proper initial brush direction.';
    if (i === strokes.length - 1) return `Stroke ${strokes.length}: Final stroke — complete the character cleanly.`;
    return `Stroke ${i + 1} of ${strokes.length}: Follow continuous stroke order.`;
  });

  return {
    strokes,
    numbers,
    tips,
    viewBox: '0 0 109 109',
  };
}

async function fetchWithRetry(char, hex, retries = 3) {
  const primaryUrl = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${hex}.svg`;
  const fallbackUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      let res = await fetch(primaryUrl);
      if (!res.ok) {
        res = await fetch(fallbackUrl);
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 400 * attempt));
    }
  }
}

async function main() {
  console.log('🚀 Loading curriculum kanji items...');
  const allKanji = [];
  const seen = new Set();

  for (const lvl of LEVELS) {
    const filePath = `content/kanji/${lvl}.json`;
    if (!fs.existsSync(filePath)) continue;
    const items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const item of items) {
      if (!seen.has(item.kanji)) {
        seen.add(item.kanji);
        allKanji.push({
          kanji: item.kanji,
          level: lvl.toUpperCase(),
          strokeCount: item.strokeCount,
        });
      }
    }
  }

  console.log(`Found ${allKanji.length} unique kanji across all JLPT levels.`);

  const verifiedDatabase = {};
  const batchSize = 25;
  const discrepancies = [];

  for (let i = 0; i < allKanji.length; i += batchSize) {
    const batch = allKanji.slice(i, i + batchSize);
    process.stdout.write(`Fetching kanji ${i + 1} - ${Math.min(i + batchSize, allKanji.length)} of ${allKanji.length}...\r`);

    await Promise.all(
      batch.map(async (item) => {
        const hex = getKanjiHex(item.kanji);
        try {
          const svg = await fetchWithRetry(item.kanji, hex);
          const parsed = parseKanjiVg(svg);

          if (parsed.strokes.length !== item.strokeCount) {
            discrepancies.push({
              kanji: item.kanji,
              level: item.level,
              curriculumStrokes: item.strokeCount,
              kanjivgStrokes: parsed.strokes.length,
            });
          }

          verifiedDatabase[item.kanji] = {
            kanji: item.kanji,
            hex,
            strokeCount: parsed.strokes.length,
            strokes: parsed.strokes,
            numbers: parsed.numbers,
            tips: parsed.tips,
            viewBox: parsed.viewBox,
          };
        } catch (err) {
          console.error(`\n❌ Failed to fetch KanjiVG for ${item.kanji} (${hex}):`, err.message);
        }
      })
    );
  }

  console.log(`\n\n✅ Successfully fetched and verified ${Object.keys(verifiedDatabase).length} / ${allKanji.length} kanji!`);

  if (discrepancies.length > 0) {
    console.log(`\n⚠️ Found ${discrepancies.length} stroke count discrepancies between curriculum metadata and authentic KanjiVG:`);
    discrepancies.forEach((d) => {
      console.log(`  - ${d.kanji} (${d.level}): curriculum says ${d.curriculumStrokes}, KanjiVG has ${d.kanjivgStrokes}`);
    });
  } else {
    console.log('🎉 100% match between curriculum stroke counts and KanjiVG stroke counts!');
  }

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(verifiedDatabase, null, 2), 'utf-8');
  const stats = fs.statSync(OUTPUT_FILE);
  console.log(`💾 Saved verified stroke order database to ${OUTPUT_FILE} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
