// src/components/celebration/__tests__/celebrationSystem.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useCelebrationStore, CHEER_TYPES } from '../../../store/celebrationStore';
import CelebrationPortal from '../CelebrationPortal';
import SidebarWaveXPBox from '../../layout/SidebarWaveXPBox';

describe('2D Animation Celebration System', () => {
  beforeEach(() => {
    act(() => {
      useCelebrationStore.getState().clearAll();
    });
  });

  describe('celebrationStore', () => {
    it('triggers Level Up celebration correctly', () => {
      act(() => {
        useCelebrationStore.getState().triggerLevelUp(4, 5);
      });

      const active = useCelebrationStore.getState().activeCelebration;
      expect(active).not.toBeNull();
      expect(active?.type).toBe('level_up');
      expect(active?.data.oldLevel).toBe(4);
      expect(active?.data.newLevel).toBe(5);
    });

    it('triggers XP Gain celebration picking 1 of 6 valid Slime cheer types', () => {
      act(() => {
        useCelebrationStore.getState().triggerXPGain(80, 450, 'quiz_complete');
      });

      const active = useCelebrationStore.getState().activeCelebration;
      expect(active).not.toBeNull();
      expect(active?.type).toBe('xp_gain');
      expect(active?.data.amount).toBe(80);
      expect(active?.data.currentXP).toBe(450);
      expect(CHEER_TYPES).toContain(active?.data.cheerType);
    });

    it('triggers Streak Claim celebration with stepping stone data', () => {
      act(() => {
        useCelebrationStore.getState().triggerStreakClaim(2, 3);
      });

      const active = useCelebrationStore.getState().activeCelebration;
      expect(active).not.toBeNull();
      expect(active?.type).toBe('streak_claim');
      expect(active?.data.oldStreak).toBe(2);
      expect(active?.data.newStreak).toBe(3);
    });

    it('queues multiple celebrations and processes them sequentially via dismiss()', () => {
      act(() => {
        useCelebrationStore.getState().triggerXPGain(30);
        useCelebrationStore.getState().triggerStreakClaim(1, 2);
        useCelebrationStore.getState().triggerLevelUp(1, 2);
      });

      // Level up gets priority or was queued
      expect(useCelebrationStore.getState().activeCelebration).not.toBeNull();
      expect(useCelebrationStore.getState().queue.length).toBeGreaterThan(0);

      act(() => {
        useCelebrationStore.getState().dismiss();
      });
      expect(useCelebrationStore.getState().activeCelebration).not.toBeNull();

      act(() => {
        useCelebrationStore.getState().dismiss();
      });
      expect(useCelebrationStore.getState().activeCelebration).not.toBeNull();

      act(() => {
        useCelebrationStore.getState().dismiss();
      });
      expect(useCelebrationStore.getState().activeCelebration).toBeNull();
    });
  });

  describe('CelebrationPortal Component', () => {
    it('renders Level Up modal when active', () => {
      act(() => {
        useCelebrationStore.getState().triggerLevelUp(3, 4);
      });

      render(<CelebrationPortal />);
      expect(screen.getByText(/LEVEL UP! レベルアップ！/i)).toBeDefined();
      expect(screen.getByText(/Lv.3/i)).toBeDefined();
      expect(screen.getByText(/Lv.4/i)).toBeDefined();
    });

    it('renders XP Gain modal with cheer phrase and Wave XP callout', () => {
      act(() => {
        useCelebrationStore.getState().triggerXPGain(95, 380);
      });

      render(<CelebrationPortal />);
      expect(screen.getByText(/\+95 Wave XP/i)).toBeDefined();
      expect(screen.getByText(/Total: 380 Wave XP/i)).toBeDefined();
    });

    it('renders Streak Claim modal with stepping stone transition', () => {
      act(() => {
        useCelebrationStore.getState().triggerStreakClaim(6, 7);
      });

      render(<CelebrationPortal />);
      expect(screen.getByText(/JELLY STREAK EXTENDED! 毎日の一歩/i)).toBeDefined();
      expect(screen.getByText(/Day 6/i)).toBeDefined();
      expect(screen.getByText(/Day 7/i)).toBeDefined();
    });
  });

  describe('SidebarWaveXPBox Component', () => {
    it('renders total XP, adventurer level, and level progress bar', () => {
      render(<SidebarWaveXPBox totalXP={376} userLevel={5} />);
      expect(screen.getAllByText(/376/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText(/Wave XP/i)).toBeDefined();
      expect(screen.getByText(/Lv.5 Adventurer/i)).toBeDefined();
    });
  });
});
