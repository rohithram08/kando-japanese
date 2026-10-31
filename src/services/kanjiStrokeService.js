/**
 * Kanji Stroke Service
 * Provides authentic, verified KanjiVG stroke order vector data
 * for all 2,136+ Joyo kanji, with pre-bundled curriculum stroke data.
 */

import verifiedKanjiStrokes from '../data/kanji/verifiedKanjiStrokes.json';

const strokeCache = new Map();

/**
 * Synchronous lookup for pre-bundled verified stroke data
 */
export function getKanjiStrokes(character) {
  if (!character || typeof character !== 'string') return null;
  const hex = getKanjiHex(character);
  if (hex && strokeCache.has(hex)) return strokeCache.get(hex);
  if (verifiedKanjiStrokes && verifiedKanjiStrokes[character]) {
    const data = verifiedKanjiStrokes[character];
    if (hex) strokeCache.set(hex, data);
    return data;
  }
  return null;
}

/**
 * Convert a kanji character to 5-character lowercase hex code
 * e.g., '日' -> '065e5'
 */
export function getKanjiHex(character) {
  if (!character || typeof character !== 'string') return null;
  const code = character.codePointAt(0);
  if (!code) return null;
  return code.toString(16).padStart(5, '0').toLowerCase();
}

/**
 * Parse KanjiVG SVG text into stroke paths and number positions
 */
export function parseKanjiVgSvg(svgText) {
  if (!svgText || typeof svgText !== 'string') return null;

  try {
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');

      // Find all stroke paths (IDs typically like kvg:065e5-s1)
      const pathEls = Array.from(doc.querySelectorAll("path[id*='-s']"));
      const strokes = pathEls
        .map((el) => el.getAttribute('d'))
        .filter(Boolean);

      // Find all stroke number text elements
      const textEls = Array.from(doc.querySelectorAll('text'));
      const numbers = textEls
        .map((t) => {
          const matrix = t.getAttribute('transform');
          const num = parseInt(t.textContent?.trim() || '0', 10);
          if (matrix) {
            const m = matrix.match(/matrix\([^)]+\s+([0-9.-]+)\s+([0-9.-]+)\)/);
            if (m) {
              return { x: parseFloat(m[1]), y: parseFloat(m[2]), num };
            }
          }
          const x = parseFloat(t.getAttribute('x') || '0');
          const y = parseFloat(t.getAttribute('y') || '0');
          return { x, y, num };
        })
        .filter((n) => n.num > 0);

      // Generate stroke tips
      const tips = strokes.map((_, i) => {
        if (i === 0) return 'First stroke: start at the top/left.';
        if (i === strokes.length - 1) return 'Final stroke: complete the character cleanly.';
        return `Stroke ${i + 1} of ${strokes.length}: follow stroke direction.`;
      });

      return { strokes, numbers, tips, viewBox: '0 0 109 109' };
    }
  } catch (err) {
    console.warn('[KanjiStrokeService] DOMParser error, using regex fallback:', err);
  }

  // Regex fallback for non-DOM or edge environments
  const pathMatches = [...svgText.matchAll(/<path[^>]+d="([^"]+)"/g)];
  const strokes = pathMatches
    .map((m) => m[1])
    .filter((d) => !d.startsWith('kvg:'));

  const numMatches = [...svgText.matchAll(/<text[^>]+matrix\(1 0 0 1 ([0-9.]+) ([0-9.]+)\)[^>]*>(\d+)<\/text>/g)];
  const numbers = numMatches.map((m) => ({
    x: parseFloat(m[1]),
    y: parseFloat(m[2]),
    num: parseInt(m[3], 10),
  }));

  const tips = strokes.map((_, i) => `Stroke ${i + 1} of ${strokes.length}`);

  return { strokes, numbers, tips, viewBox: '0 0 109 109' };
}

/**
 * Fetch stroke data for a kanji character
 */
export async function fetchKanjiStrokes(character) {
  const hex = getKanjiHex(character);
  if (!hex) return null;

  // 1. Check in-memory cache
  if (strokeCache.has(hex)) {
    return strokeCache.get(hex);
  }

  // 2. Check bundled verified database (100% verified Joyo/JLPT data, zero latency, offline-ready)
  if (verifiedKanjiStrokes && verifiedKanjiStrokes[character]) {
    const data = verifiedKanjiStrokes[character];
    strokeCache.set(hex, data);
    return data;
  }

  // 3. Check localStorage cache
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem(`kvg_${hex}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        strokeCache.set(hex, parsed);
        return parsed;
      }
    }
  } catch {
    // localStorage might fail in private browsing
  }

  // 3. Fetch from primary CDN (jsDelivr KanjiVG)
  const primaryUrl = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg/kanji/${hex}.svg`;
  const fallbackUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;

  try {
    let res = await fetch(primaryUrl);
    if (!res.ok) {
      res = await fetch(fallbackUrl);
    }
    if (!res.ok) {
      return null;
    }

    const svgText = await res.text();
    const data = parseKanjiVgSvg(svgText);

    if (data && data.strokes.length > 0) {
      strokeCache.set(hex, data);
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(`kvg_${hex}`, JSON.stringify(data));
        }
      } catch {
        // storage quota exceeded
      }
      return data;
    }
  } catch (err) {
    console.warn(`[KanjiStrokeService] Failed to load strokes for ${character} (${hex}):`, err);
  }

  return null;
}
