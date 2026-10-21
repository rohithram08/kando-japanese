// src/store/celebrationStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// Global Celebration Store for 2D Animated Popups
// Handles Level Up (Subway Surfers run-in), XP Gain (6 Slime Cheer types),
// and Streak Claim (Slime stepping forward onto stone path).
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';

export type CheerType =
  | 'confetti_cannon'
  | 'pompom_cheer'
  | 'sparkle_twirl'
  | 'wave_bubble'
  | 'golden_trophy'
  | 'onigiri_feast';

export const CHEER_TYPES: CheerType[] = [
  'confetti_cannon',
  'pompom_cheer',
  'sparkle_twirl',
  'wave_bubble',
  'golden_trophy',
  'onigiri_feast',
];

export interface CelebrationItem {
  id: string;
  type: 'level_up' | 'xp_gain' | 'streak_claim';
  data: {
    oldLevel?: number;
    newLevel?: number;
    amount?: number;
    currentXP?: number;
    cheerType?: CheerType;
    oldStreak?: number;
    newStreak?: number;
    reason?: string;
  };
}

interface CelebrationState {
  activeCelebration: CelebrationItem | null;
  queue: CelebrationItem[];
  triggerLevelUp: (oldLevel: number, newLevel: number) => void;
  triggerXPGain: (amount: number, currentXP?: number, reason?: string) => void;
  triggerStreakClaim: (oldStreak: number, newStreak: number) => void;
  dismiss: () => void;
  clearAll: () => void;
}

export const useCelebrationStore = create<CelebrationState>((set, get) => ({
  activeCelebration: null,
  queue: [],

  triggerLevelUp: (oldLevel, newLevel) => {
    if (newLevel <= oldLevel) return;
    const item: CelebrationItem = {
      id: `levelup_${Date.now()}_${Math.random()}`,
      type: 'level_up',
      data: { oldLevel, newLevel },
    };

    const { activeCelebration, queue } = get();
    // Level Up takes top priority!
    if (!activeCelebration) {
      set({ activeCelebration: item });
    } else {
      // Prepend right after active item or queue it
      set({ queue: [item, ...queue] });
    }
  },

  triggerXPGain: (amount, currentXP, reason) => {
    if (amount <= 0) return;
    // Pick 1 of 6 Slime Cheer types randomly!
    const randomIndex = Math.floor(Math.random() * CHEER_TYPES.length);
    const cheerType = CHEER_TYPES[randomIndex];

    const item: CelebrationItem = {
      id: `xp_${Date.now()}_${Math.random()}`,
      type: 'xp_gain',
      data: {
        amount,
        currentXP,
        cheerType,
        reason,
      },
    };

    const { activeCelebration, queue } = get();
    if (!activeCelebration) {
      set({ activeCelebration: item });
    } else {
      set({ queue: [...queue, item] });
    }
  },

  triggerStreakClaim: (oldStreak, newStreak) => {
    const item: CelebrationItem = {
      id: `streak_${Date.now()}_${Math.random()}`,
      type: 'streak_claim',
      data: {
        oldStreak,
        newStreak,
      },
    };

    const { activeCelebration, queue } = get();
    if (!activeCelebration) {
      set({ activeCelebration: item });
    } else {
      set({ queue: [...queue, item] });
    }
  },

  dismiss: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const [next, ...remaining] = queue;
      set({ activeCelebration: next, queue: remaining });
    } else {
      set({ activeCelebration: null });
    }
  },

  clearAll: () => {
    set({ activeCelebration: null, queue: [] });
  },
}));
