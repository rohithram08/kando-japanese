import { describe, it, expect } from 'vitest';
import { resolveCardContent } from '../srsCardResolver';
import type { SRSCard } from '../../types/models';

describe('srsCardResolver', () => {
  it('resolves vocabulary cards correctly from dataset', () => {
    const card: SRSCard = {
      id: 'test-srs-1',
      userId: 'u1',
      cardType: 'vocabulary',
      cardRefId: 'n5v001',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 4,
      isMastered: true,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolved = resolveCardContent(card);
    expect(resolved).toBeDefined();
    expect(resolved.id).toBe('test-srs-1');
    expect(resolved.cardType).toBe('vocabulary');
    expect(resolved.repetitions).toBe(4);
    expect(resolved.isMastered).toBe(true);
    expect(resolved.easeFactor).toBe(2.5);
    expect(resolved.front).toBeTruthy();
    expect(resolved.meaning).toBeTruthy();
    expect(resolved.reading).toBeTruthy();
  });

  it('resolves kanji cards correctly from dataset', () => {
    const card: SRSCard = {
      id: 'test-srs-2',
      userId: 'u1',
      cardType: 'kanji',
      cardRefId: '日',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolved = resolveCardContent(card);
    expect(resolved).toBeDefined();
    expect(resolved.id).toBe('test-srs-2');
    expect(resolved.cardType).toBe('kanji');
    expect(resolved.front).toBe('日');
    expect(resolved.meaning.toLowerCase()).toContain('sun');
  });

  it('resolves kana cards correctly from dataset by ID and character', () => {
    const cardById: SRSCard = {
      id: 'test-srs-kana-1',
      userId: 'u1',
      cardType: 'kana',
      cardRefId: 'h_a',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolvedById = resolveCardContent(cardById);
    expect(resolvedById).toBeDefined();
    expect(resolvedById.id).toBe('test-srs-kana-1');
    expect(resolvedById.cardType).toBe('kana');
    expect(resolvedById.front).toBe('あ');
    expect(resolvedById.reading).toBe('a');
    expect(resolvedById.romaji).toBe('a');
    expect(resolvedById.strokeCount).toBe(3);
    expect(resolvedById.mnemonic).toContain('Apple');
    expect(resolvedById.meaning).toBe('Hiragana character: a');

    const cardByChar: SRSCard = {
      id: 'test-srs-kana-2',
      userId: 'u1',
      cardType: 'kana',
      cardRefId: 'シ',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolvedByChar = resolveCardContent(cardByChar);
    expect(resolvedByChar).toBeDefined();
    expect(resolvedByChar.front).toBe('シ');
    expect(resolvedByChar.reading).toBe('shi');
    expect(resolvedByChar.meaning).toBe('Katakana character: shi');
  });

  it('provides safe fallback for unknown cards without crashing', () => {
    const card: SRSCard = {
      id: 'test-srs-3',
      userId: 'u1',
      cardType: 'vocabulary',
      cardRefId: 'unknown_word_xyz_999',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolved = resolveCardContent(card);
    expect(resolved).toBeDefined();
    expect(resolved.front).toBe('unknown_word_xyz_999');
    expect(resolved.meaning).toBe('Vocabulary word');
  });

  it('provides safe fallback for unknown kana cards', () => {
    const unknownKanaCard: SRSCard = {
      id: 'test-srs-kana-unknown',
      userId: 'u1',
      cardType: 'kana',
      cardRefId: 'unknown_kana_123',
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      nextReviewDate: '2026-10-11',
      createdAt: '2026-10-11',
      updatedAt: '2026-10-11',
    };

    const resolved = resolveCardContent(unknownKanaCard);
    expect(resolved).toBeDefined();
    expect(resolved.cardType).toBe('kana');
    expect(resolved.front).toBe('unknown_kana_123');
    expect(resolved.meaning).toBe('Kana character');
  });
});

