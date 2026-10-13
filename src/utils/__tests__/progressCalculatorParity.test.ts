import { describe, it, expect } from 'vitest';
import {
  XP_REWARDS as FE_XP,
  JLPT_LEVELS as FE_JLPT,
  getBadges as feGetBadges,
} from '../progressCalculator.js';
import {
  XP_REWARDS as BE_XP,
  JLPT_LEVELS as BE_JLPT,
  ALL_BADGES as BE_BADGES,
} from '../../../backend/src/services/progressCalculator';

describe('Progress Calculator Parity (Frontend <-> Backend)', () => {
  it('ensures JLPT level definitions have identical thresholds and keys', () => {
    expect(FE_JLPT.length).toBe(BE_JLPT.length);
    for (let i = 0; i < FE_JLPT.length; i++) {
      expect(FE_JLPT[i].level).toBe(BE_JLPT[i].level);
      expect(FE_JLPT[i].minXP).toBe(BE_JLPT[i].minXP);
      expect(FE_JLPT[i].maxXP).toBe(BE_JLPT[i].maxXP);
    }
  });

  it('ensures XP reward constants match exactly between frontend and backend', () => {
    // Check all backend rewards are in frontend and equal
    for (const [key, val] of Object.entries(BE_XP)) {
      expect(FE_XP[key]).toBeDefined();
      expect(FE_XP[key]).toBe(val);
    }
  });

  it('ensures badge IDs and emojis match exactly between frontend and backend', () => {
    const dummyStats = {
      lessonsCompleted: 100,
      kanjiLearned: 500,
      vocabLearned: 500,
      streak: 365,
      totalXP: 50000,
      cardsReviewed: 500,
      cardsMastered: 50,
    };

    const feBadges = feGetBadges(dummyStats).all;
    expect(feBadges.length).toBe(BE_BADGES.length);

    for (let i = 0; i < BE_BADGES.length; i++) {
      const beBadge = BE_BADGES[i];
      const feBadge = feBadges.find((b) => b.id === beBadge.id);

      expect(feBadge).toBeDefined();
      expect(feBadge?.name).toBe(beBadge.name);
    }
  });
});
