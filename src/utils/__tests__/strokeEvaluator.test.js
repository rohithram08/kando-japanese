import { describe, it, expect } from 'vitest';
import {
  resampleStroke,
  parseSvgPathToPoints,
  evaluateSingleStroke,
  evaluateKanjiDrawing,
} from '../strokeEvaluator';

describe('strokeEvaluator', () => {
  describe('resampleStroke', () => {
    it('handles empty or single point stroke safely', () => {
      expect(resampleStroke([])).toEqual([]);
      const single = [{ x: 10, y: 10 }];
      expect(resampleStroke(single, 5).length).toBe(5);
      expect(resampleStroke(single, 5)[0]).toEqual({ x: 10, y: 10 });
    });

    it('resamples a straight line into equidistant points', () => {
      const line = [{ x: 0, y: 0 }, { x: 100, y: 0 }];
      const resampled = resampleStroke(line, 5);
      expect(resampled.length).toBe(5);
      expect(resampled[0].x).toBeCloseTo(0);
      expect(resampled[2].x).toBeCloseTo(50);
      expect(resampled[4].x).toBeCloseTo(100);
    });
  });

  describe('parseSvgPathToPoints', () => {
    it('parses M and L commands into coordinate points', () => {
      const d = 'M 10 20 L 50 20 L 90 20';
      const pts = parseSvgPathToPoints(d);
      expect(pts.length).toBe(3);
      expect(pts[0]).toEqual({ x: 10, y: 20 });
      expect(pts[2]).toEqual({ x: 90, y: 20 });
    });

    it('parses cubic bezier curve commands (c/C)', () => {
      const d = 'M 25 32 c 1.5 0.5 4 0.6 5.5 0.5 c 7 -0.5 35 -3 48 -3.5';
      const pts = parseSvgPathToPoints(d);
      expect(pts.length).toBeGreaterThan(5);
      expect(pts[0].x).toBeCloseTo(25);
    });
  });

  describe('evaluateSingleStroke', () => {
    const horizontalRef = 'M 25 32 L 80 30';

    it('rewards accurate strokes with high score and isMatch=true', () => {
      const goodUserStroke = [
        { x: 26, y: 32 },
        { x: 50, y: 31 },
        { x: 79, y: 30 },
      ];
      const result = evaluateSingleStroke(goodUserStroke, horizontalRef);
      expect(result.score).toBeGreaterThanOrEqual(85);
      expect(result.isMatch).toBe(true);
    });

    it('rejects strokes drawn in reverse direction (right to left)', () => {
      const reverseUserStroke = [
        { x: 79, y: 30 },
        { x: 50, y: 31 },
        { x: 26, y: 32 },
      ];
      const result = evaluateSingleStroke(reverseUserStroke, horizontalRef);
      expect(result.isMatch).toBe(false);
      expect(result.score).toBe(0);
      expect(result.reason).toContain('reverse');
    });

    it('rejects perpendicular/vertical strokes for a horizontal line', () => {
      const verticalStroke = [
        { x: 50, y: 10 },
        { x: 50, y: 70 },
      ];
      const result = evaluateSingleStroke(verticalStroke, horizontalRef);
      expect(result.isMatch).toBe(false);
      expect(result.score).toBe(0);
    });

    it('penalizes arched / crooked roof-like strokes', () => {
      // Arched stroke that starts low, peaks in the middle, and drops down
      const archedStroke = [
        { x: 25, y: 55 },
        { x: 50, y: 25 },
        { x: 75, y: 55 },
      ];
      const result = evaluateSingleStroke(archedStroke, horizontalRef);
      // Arched stroke should have significant angle and spatial deviation
      expect(result.score).toBeLessThan(75);
    });
  });

  describe('evaluateKanjiDrawing', () => {
    const niSvgData = {
      strokes: [
        'M 25.3 32.4 c 1.45 0.5 4.12 0.61 5.57 0.5 c 7.13 -0.52 35.13 -3.02 48.38 -3.52',
        'M 12 80.8 c 2.25 0.7 4.7 0.44 7 0.2 c 15.75 -1.62 55.75 -3.88 77.88 -4',
      ],
    };

    it('returns empty status when no strokes have been drawn', () => {
      const res = evaluateKanjiDrawing([], niSvgData, { targetCount: 2 });
      expect(res.status).toBe('empty');
      expect(res.isValid).toBe(false);
      expect(res.message).toBe('0 / 2 strokes');
    });

    it('detects incomplete drawing and reports progress', () => {
      const oneStroke = [
        [{ x: 26, y: 32 }, { x: 50, y: 31 }, { x: 78, y: 30 }],
      ];
      const res = evaluateKanjiDrawing(oneStroke, niSvgData, { targetCount: 2 });
      expect(res.status).toBe('incomplete');
      expect(res.isValid).toBe(false);
      expect(res.message).toContain('1 / 2 strokes');
    });

    it('marks high quality drawing as perfect', () => {
      const twoGoodStrokes = [
        [{ x: 26, y: 32 }, { x: 50, y: 31 }, { x: 78, y: 30 }],
        [{ x: 14, y: 81 }, { x: 55, y: 79 }, { x: 95, y: 77 }],
      ];
      const res = evaluateKanjiDrawing(twoGoodStrokes, niSvgData, { targetCount: 2 });
      expect(res.status).toBe('perfect');
      expect(res.isValid).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(75);
      expect(res.message).toContain('✓ Perfect!');
    });

    it('correctly scales user coordinates drawn on a 300px canvas', () => {
      const scale = 300 / 109;
      const strokesOn300px = [
        [{ x: 26 * scale, y: 32 * scale }, { x: 50 * scale, y: 31 * scale }, { x: 78 * scale, y: 30 * scale }],
        [{ x: 14 * scale, y: 81 * scale }, { x: 55 * scale, y: 79 * scale }, { x: 95 * scale, y: 77 * scale }],
      ];
      const res = evaluateKanjiDrawing(strokesOn300px, niSvgData, { targetCount: 2, canvasSize: 300 });
      expect(res.status).toBe('perfect');
      expect(res.isValid).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(75);
    });

    it('does NOT mark wrongly drawn arched strokes as Perfect', () => {
      // Arched roof strokes like in user screenshot
      const twoArchedStrokes = [
        [{ x: 35, y: 55 }, { x: 50, y: 25 }, { x: 75, y: 55 }],
        [{ x: 30, y: 75 }, { x: 55, y: 65 }, { x: 75, y: 95 }],
      ];
      const res = evaluateKanjiDrawing(twoArchedStrokes, niSvgData, { targetCount: 2 });
      expect(res.status).not.toBe('perfect');
      expect(res.isValid).toBe(false);
      expect(res.message).not.toContain('✓ Perfect!');
    });

    it('flags too many strokes when exceeding targetCount', () => {
      const threeStrokes = [
        [{ x: 26, y: 32 }, { x: 50, y: 31 }],
        [{ x: 14, y: 81 }, { x: 55, y: 79 }],
        [{ x: 10, y: 50 }, { x: 90, y: 50 }],
      ];
      const res = evaluateKanjiDrawing(threeStrokes, niSvgData, { targetCount: 2 });
      expect(res.status).toBe('over');
      expect(res.isValid).toBe(false);
      expect(res.message).toContain('Too many strokes');
    });
  });
});
