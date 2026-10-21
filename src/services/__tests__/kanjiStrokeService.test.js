import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getKanjiHex, parseKanjiVgSvg, fetchKanjiStrokes } from '../kanjiStrokeService';

describe('kanjiStrokeService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getKanjiHex', () => {
    it('returns 5-digit lowercase hex for Japanese kanji', () => {
      expect(getKanjiHex('日')).toBe('065e5');
      expect(getKanjiHex('一')).toBe('04e00');
      expect(getKanjiHex('愛')).toBe('0611b');
    });

    it('returns null for empty or invalid input', () => {
      expect(getKanjiHex('')).toBeNull();
      expect(getKanjiHex(null)).toBeNull();
      expect(getKanjiHex(undefined)).toBeNull();
    });
  });

  describe('parseKanjiVgSvg', () => {
    const sampleSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
        <g id="kvg:StrokePaths_065e5">
          <path id="kvg:065e5-s1" d="M31.5,24.5c1.12,1.12,1.74,2.75,1.74,4.75"/>
          <path id="kvg:065e5-s2" d="M33.48,26c0.8-0.05,37.67-3.01,40.77-3.25"/>
        </g>
        <g id="kvg:StrokeNumbers_065e5">
          <text transform="matrix(1 0 0 1 25.5 32.5)">1</text>
          <text transform="matrix(1 0 0 1 37.5 22.5)">2</text>
        </g>
      </svg>
    `;

    it('correctly parses stroke paths, numbers, and tips', () => {
      const result = parseKanjiVgSvg(sampleSvg);
      expect(result).toBeDefined();
      expect(result.strokes.length).toBe(2);
      expect(result.strokes[0]).toContain('M31.5,24.5');
      expect(result.numbers.length).toBe(2);
      expect(result.numbers[0].num).toBe(1);
      expect(result.numbers[0].x).toBe(25.5);
      expect(result.numbers[0].y).toBe(32.5);
      expect(result.tips.length).toBe(2);
    });

    it('returns null for empty or non-string input', () => {
      expect(parseKanjiVgSvg('')).toBeNull();
      expect(parseKanjiVgSvg(null)).toBeNull();
    });
  });

  describe('fetchKanjiStrokes', () => {
    it('fetches and caches KanjiVG SVG data', async () => {
      const mockSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109">
          <g id="kvg:StrokePaths_04e00">
            <path id="kvg:04e00-s1" d="M11.88,52.36c4.12,0.89,7.94,0.47,11.26,0.11"/>
          </g>
          <g id="kvg:StrokeNumbers_04e00">
            <text transform="matrix(1 0 0 1 5.5 53.5)">1</text>
          </g>
        </svg>
      `;

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockSvg),
      });

      const data = await fetchKanjiStrokes('一');
      expect(data).toBeDefined();
      expect(data.strokes.length).toBe(1);
      expect(data.numbers[0].num).toBe(1);
    });

    it('handles network failure gracefully', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });

      const data = await fetchKanjiStrokes('䴓');
      expect(data).toBeNull();
    });
  });
});
