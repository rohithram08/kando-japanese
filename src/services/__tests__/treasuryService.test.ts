// src/services/__tests__/treasuryService.test.ts
import { describe, it, expect } from 'vitest';
import {
  rollTreasuryFreezeReward,
  isTreasuryChallengeAvailable,
  getTreasuryWeekKey,
  getTimeUntilTreasuryReset,
  getTreasuryChallengeQuestions,
} from '../treasuryService';

describe('treasuryService', () => {
  describe('rollTreasuryFreezeReward (Probability Waterfall)', () => {
    it('awards 5 freezes when roll 1 is below 0.05 (5% max jackpot)', () => {
      const reward = rollTreasuryFreezeReward(() => 0.04);
      expect(reward.freezes).toBe(5);
      expect(reward.tier).toBe('jackpot');
      expect(reward.title).toContain('5 Jelly Freezes');
    });

    it('awards 4 freezes when roll 1 fails (>=0.05) and roll 2 is below 0.15 (15% chance)', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        if (callCount === 1) return 0.10; // Fails step 1 (< 0.05)
        if (callCount === 2) return 0.12; // Passes step 2 (< 0.15)
        return 0.5;
      };
      const reward = rollTreasuryFreezeReward(rng);
      expect(reward.freezes).toBe(4);
      expect(reward.tier).toBe('epic');
    });

    it('awards 3 freezes when rolls 1-2 fail and roll 3 is below 0.25 (25% chance)', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        if (callCount === 1) return 0.10;
        if (callCount === 2) return 0.20;
        if (callCount === 3) return 0.24; // Passes step 3 (< 0.25)
        return 0.5;
      };
      const reward = rollTreasuryFreezeReward(rng);
      expect(reward.freezes).toBe(3);
      expect(reward.tier).toBe('rare');
    });

    it('awards 2 freezes when rolls 1-3 fail and roll 4 is below 0.50 (50% chance)', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        if (callCount === 1) return 0.10;
        if (callCount === 2) return 0.20;
        if (callCount === 3) return 0.30;
        if (callCount === 4) return 0.45; // Passes step 4 (< 0.50)
        return 0.99;
      };
      const reward = rollTreasuryFreezeReward(rng);
      expect(reward.freezes).toBe(2);
      expect(reward.tier).toBe('common');
    });

    it('awards 1 freeze when rolls 1-4 fail and roll 5 is below 0.99 (99% chance)', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        if (callCount === 1) return 0.10;
        if (callCount === 2) return 0.20;
        if (callCount === 3) return 0.30;
        if (callCount === 4) return 0.60;
        if (callCount === 5) return 0.85; // Passes step 5 (< 0.99)
        return 0.99;
      };
      const reward = rollTreasuryFreezeReward(rng);
      expect(reward.freezes).toBe(1);
      expect(reward.tier).toBe('basic');
    });

    it('returns better luck next time (0 freezes) when rolls 1-5 fail (1% roll >= 0.99)', () => {
      let callCount = 0;
      const rng = () => {
        callCount++;
        if (callCount === 1) return 0.10;
        if (callCount === 2) return 0.20;
        if (callCount === 3) return 0.30;
        if (callCount === 4) return 0.60;
        if (callCount === 5) return 0.995; // Fails step 5 (1% miss)
        return 1.0;
      };
      const reward = rollTreasuryFreezeReward(rng);
      expect(reward.freezes).toBe(0);
      expect(reward.tier).toBe('miss');
      expect(reward.title).toContain('Better Luck Next Time');
    });
  });

  describe('isTreasuryChallengeAvailable (Weekly Limit)', () => {
    it('computes consistent ISO week key for a given date', () => {
      const d = new Date('2026-10-31T12:00:00Z');
      const weekKey = getTreasuryWeekKey(d);
      expect(weekKey).toMatch(/^2026-W\d{2}$/);
    });

    it('is available if never claimed before', () => {
      expect(isTreasuryChallengeAvailable(null)).toBe(true);
      expect(isTreasuryChallengeAvailable(undefined)).toBe(true);
      expect(isTreasuryChallengeAvailable('')).toBe(true);
    });

    it('is NOT available if already claimed in the current ISO week', () => {
      const now = new Date('2026-10-31T12:00:00Z');
      const claimedSameWeek = new Date('2026-10-28T10:00:00Z').toISOString();
      expect(isTreasuryChallengeAvailable(claimedSameWeek, now)).toBe(false);
    });

    it('IS available if claimed in a previous week', () => {
      const now = new Date('2026-10-31T12:00:00Z');
      const claimedPreviousWeek = new Date('2026-10-20T10:00:00Z').toISOString();
      expect(isTreasuryChallengeAvailable(claimedPreviousWeek, now)).toBe(true);
    });
  });

  describe('getTimeUntilTreasuryReset', () => {
    it('calculates remaining time until next Monday', () => {
      const wednesday = new Date('2026-10-28T12:00:00');
      const reset = getTimeUntilTreasuryReset(wednesday);
      expect(reset.days).toBeGreaterThan(0);
      expect(reset.formatted).toBeTruthy();
    });
  });

  describe('getTreasuryChallengeQuestions', () => {
    it('returns requested number of questions', () => {
      const questions = getTreasuryChallengeQuestions(3);
      expect(questions).toHaveLength(3);
      expect(questions[0].choices).toBeDefined();
      expect(questions[0].correctIndex).toBeGreaterThanOrEqual(0);
    });
  });
});
