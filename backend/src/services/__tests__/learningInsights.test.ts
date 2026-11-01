import { describe, it, expect } from 'vitest';
import { blockForHour, computeInsights, median, type AttemptRow } from '../learningInsights.js';
import { clampPage, escapeLike } from '../socialService.js';

const NOW = new Date('2026-10-31T12:00:00Z');
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000);

function rows(n: number, over: Partial<AttemptRow> & { pattern?: (i: number) => boolean } = {}): AttemptRow[] {
  const { pattern, ...rest } = over;
  return Array.from({ length: n }, (_, i) => ({
    itemType: 'vocabulary', itemId: `v${i}`, correct: pattern ? pattern(i) : true, responseMs: 2000,
    modality: 'recall', localHour: 9, createdAt: daysAgo(1), ...rest,
  }));
}

describe('computeInsights', () => {
  it('reports low confidence and asks for more data on small samples', () => {
    const r = computeInsights(rows(5), NOW);
    expect(r.confidence).toBe('low');
    expect(r.suggestions.map((s) => s.code)).toContain('collect_more_data');
    expect(r.modalitySignal).toBeNull();
    expect(r.timeSignal).toBeNull();
  });

  it('does not invent a modality signal below the minimum sample', () => {
    const a = rows(10, { modality: 'writing' });
    const b = rows(10, { modality: 'recognition', pattern: () => false });
    expect(computeInsights([...a, ...b], NOW).modalitySignal).toBeNull();
  });

  it('detects a real modality gap when both modalities are well sampled', () => {
    const a = rows(20, { modality: 'writing' }); // 100%
    const b = rows(20, { modality: 'listening', pattern: (i) => i % 2 === 0 }); // 50%
    const r = computeInsights([...a, ...b], NOW);
    expect(r.modalitySignal).toMatchObject({ best: 'writing', worst: 'listening' });
    expect(r.suggestions.map((s) => s.code)).toContain('prefer_modality');
  });

  it('ignores small modality differences (noise)', () => {
    const a = rows(20, { modality: 'writing' });
    const b = rows(20, { modality: 'listening', pattern: (i) => i !== 0 }); // 95%
    expect(computeInsights([...a, ...b], NOW).modalitySignal).toBeNull();
  });

  it('flags leeches: many attempts, mostly wrong', () => {
    const leech = Array.from({ length: 5 }, (_, i) => ({ ...rows(1)[0], itemId: 'kanji-bad', itemType: 'kanji', correct: i === 0 }));
    const fine = Array.from({ length: 5 }, () => ({ ...rows(1)[0], itemId: 'kanji-ok', itemType: 'kanji' }));
    const r = computeInsights([...leech, ...fine], NOW);
    expect(r.leeches).toHaveLength(1);
    expect(r.leeches[0]).toMatchObject({ itemId: 'kanji-bad', attempts: 5, accuracy: 0.2 });
  });

  it('throttles new items when accuracy is low and loosens them when it is very high', () => {
    const struggling = computeInsights(rows(40, { pattern: (i) => i % 2 === 0 }), NOW);
    const cruising = computeInsights(rows(40), NOW);
    expect(struggling.plan.newItemsCap).toBe(5);
    expect(cruising.plan.newItemsCap).toBe(15);
    expect(struggling.suggestions.map((s) => s.code)).toContain('slow_down_new_items');
    expect(cruising.suggestions.map((s) => s.code)).toContain('add_new_items');
  });

  it('only counts attempts inside the 30-day window for headline stats', () => {
    const old = rows(50, { createdAt: daysAgo(45), pattern: () => false });
    const r = computeInsights([...old, ...rows(10)], NOW);
    expect(r.sampleSize).toBe(10);
    expect(r.overall.accuracy).toBe(1);
  });

  it('counts distinct active days in the last 14', () => {
    const r = computeInsights([...rows(3, { createdAt: daysAgo(1) }), ...rows(3, { createdAt: daysAgo(3) }), ...rows(3, { createdAt: daysAgo(20) })], NOW);
    expect(r.consistency.activeDaysLast14).toBe(2);
  });

  it('handles an empty history', () => {
    const r = computeInsights([], NOW);
    expect(r.overall).toEqual({ attempts: 0, accuracy: null, recentAccuracy: null });
    expect(r.plan.newItemsCap).toBe(10);
  });
});

describe('helpers', () => {
  it('maps hours to blocks, including the wrap-around night block', () => {
    expect(blockForHour(5)).toBe('morning');
    expect(blockForHour(11)).toBe('morning');
    expect(blockForHour(12)).toBe('afternoon');
    expect(blockForHour(18)).toBe('evening');
    expect(blockForHour(23)).toBe('night');
    expect(blockForHour(0)).toBe('night');
    expect(blockForHour(4)).toBe('night');
  });
  it('median', () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(3);
  });
  it('escapes LIKE wildcards so searches are literal', () => {
    expect(escapeLike('50%_off\\')).toBe('50\\%\\_off\\\\');
  });
  it('clamps pagination', () => {
    expect(clampPage('999', '-4')).toEqual({ limit: 50, offset: 0 });
    expect(clampPage(undefined, undefined)).toEqual({ limit: 20, offset: 0 });
    expect(clampPage('abc', '10')).toEqual({ limit: 20, offset: 10 });
  });
});
