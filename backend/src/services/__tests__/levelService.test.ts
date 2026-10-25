import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/index.js', () => ({
  db: { query: { users: { findFirst: vi.fn() } }, select: vi.fn() },
}));

import { db } from '../../db/index.js';
import {
  unlockedLevels,
  isLevelUnlocked,
  nextLevel,
  levelFromContentId,
  assertContentUnlocked,
  weightedCoverage,
  getLevelTotals,
  type Category,
  type CategoryCoverage,
} from '../levelService.js';

const findFirst = db.query.users.findFirst as unknown as ReturnType<typeof vi.fn>;

describe('level rules', () => {
  it('unlocks cumulatively', () => {
    expect(unlockedLevels('N5')).toEqual(['N5']);
    expect(unlockedLevels('N4')).toEqual(['N5', 'N4']);
    expect(unlockedLevels('N3')).toEqual(['N5', 'N4', 'N3']);
    expect(unlockedLevels('N1')).toEqual(['N5', 'N4', 'N3', 'N2', 'N1']);
  });

  it('isLevelUnlocked respects ordering', () => {
    expect(isLevelUnlocked('N5', 'N4')).toBe(false);
    expect(isLevelUnlocked('N4', 'N5')).toBe(true);
    expect(isLevelUnlocked('N3', 'N3')).toBe(true);
  });

  it('nextLevel stops at N1', () => {
    expect(nextLevel('N5')).toBe('N4');
    expect(nextLevel('N1')).toBeNull();
  });

  it('infers level from every id format used in content', () => {
    expect(levelFromContentId('n5v001')).toBe('N5');
    expect(levelFromContentId('n3_001')).toBe('N3');
    expect(levelFromContentId('n4k012')).toBe('N4');
    expect(levelFromContentId('n5_g001')).toBe('N5');
    expect(levelFromContentId('n2g001')).toBe('N2');
    expect(levelFromContentId('story_n1_07')).toBe('N1');
    expect(levelFromContentId('lesson-abc')).toBeNull();
    expect(levelFromContentId('')).toBeNull();
    expect(levelFromContentId(undefined)).toBeNull();
  });
});

describe('assertContentUnlocked', () => {
  beforeEach(() => findFirst.mockReset());

  it('rejects content above the study level with LEVEL_LOCKED', async () => {
    findFirst.mockResolvedValue({ studyLevel: 'N5' });
    await expect(assertContentUnlocked('u1', 'n3k001')).rejects.toMatchObject({ statusCode: 403 });
  });

  it('allows same and lower levels', async () => {
    findFirst.mockResolvedValue({ studyLevel: 'N3' });
    await expect(assertContentUnlocked('u1', 'n3k001')).resolves.toBeUndefined();
    await expect(assertContentUnlocked('u1', 'n5v001')).resolves.toBeUndefined();
  });

  it('is lenient for unknown id formats and missing study level', async () => {
    findFirst.mockResolvedValue({ studyLevel: 'N5' });
    await expect(assertContentUnlocked('u1', 'custom-id')).resolves.toBeUndefined();
    findFirst.mockResolvedValue(undefined);
    await expect(assertContentUnlocked('u1', 'n1k001')).resolves.toBeUndefined();
  });
});

describe('coverage', () => {
  const c = (done: number, total: number): CategoryCoverage => ({ done, total, percent: 0 });

  it('weights categories and renormalises when one has no content', () => {
    const full: Record<Category, CategoryCoverage> = {
      vocabulary: c(100, 100), kanji: c(0, 100), grammar: c(0, 100), reading: c(0, 100),
    };
    expect(weightedCoverage(full)).toBeCloseTo(0.35);
    const noReading = { ...full, reading: c(0, 0) };
    expect(weightedCoverage(noReading)).toBeCloseTo(0.35 / 0.85);
    expect(weightedCoverage({ vocabulary: c(0, 0), kanji: c(0, 0), grammar: c(0, 0), reading: c(0, 0) })).toBe(0);
  });

  it('reads real content totals for every level', () => {
    const totals = getLevelTotals();
    for (const lvl of ['N5', 'N4', 'N3', 'N2', 'N1'] as const) {
      expect(totals[lvl].vocabulary).toBeGreaterThan(0);
      expect(totals[lvl].kanji).toBeGreaterThan(0);
      expect(totals[lvl].grammar).toBeGreaterThan(0);
    }
  });
});
