import { describe, it, expect, vi, beforeEach } from 'vitest';

const values = vi.fn();
vi.mock('../../db/index.js', () => ({
  db: { insert: vi.fn(() => ({ values })), select: vi.fn() },
}));

import { db } from '../../db/index.js';
import { normalizeXpEvent, recordXpEvent } from '../xpLedger.js';

describe('normalizeXpEvent', () => {
  it('ignores zero, negative and non-finite amounts (nothing to record)', () => {
    expect(normalizeXpEvent(0, 'kanji')).toBeNull();
    expect(normalizeXpEvent(-5, 'kanji')).toBeNull();
    expect(normalizeXpEvent(Number.NaN, 'kanji')).toBeNull();
    expect(normalizeXpEvent(Number.POSITIVE_INFINITY, 'kanji')).toBeNull();
  });

  it('rounds amounts and minutes, defaults minutes to 0, truncates long refs', () => {
    expect(normalizeXpEvent(9.6, 'lesson', { minutes: 2.4 })).toEqual({ amount: 10, source: 'lesson', refId: null, minutes: 2 });
    expect(normalizeXpEvent(5, 'grammar', { refId: 'x'.repeat(300) })!.refId).toHaveLength(100);
    expect(normalizeXpEvent(5, 'grammar', { minutes: -3 })!.minutes).toBe(0);
  });
});

describe('recordXpEvent', () => {
  beforeEach(() => { values.mockReset(); (db.insert as any).mockClear(); });

  it('inserts a row with a generated id', async () => {
    values.mockResolvedValue(undefined);
    await recordXpEvent('u1', 10, 'grammar', { refId: 'n5_g001' });
    expect(values).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1', amount: 10, source: 'grammar', refId: 'n5_g001', minutes: 0, id: expect.any(String),
    }));
  });

  it('does not touch the database for zero-XP awards', async () => {
    await recordXpEvent('u1', 0, 'kanji');
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('never throws when the insert fails (XP is already granted)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    values.mockRejectedValue(new Error('db down'));
    await expect(recordXpEvent('u1', 10, 'kanji')).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
