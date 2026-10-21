// src/components/celebration/CelebrationPortal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Global Celebration Portal
// Subscribes to useCelebrationStore and renders the appropriate 2D celebration:
//  - Level Up (Subway Surfers running Slime high score celebration)
//  - XP Gain (6 Slime Cheering types)
//  - Streak Claim (Slime stepping forward onto stone path)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCelebrationStore } from '../../store/celebrationStore';
import LevelUpCelebrationModal from './LevelUpCelebrationModal';
import XPGainCelebrationModal from './XPGainCelebrationModal';
import StreakClaimCelebrationModal from './StreakClaimCelebrationModal';

export default function CelebrationPortal() {
  const activeCelebration = useCelebrationStore((s) => s.activeCelebration);
  const dismiss = useCelebrationStore((s) => s.dismiss);

  if (!activeCelebration) return null;

  return (
    <AnimatePresence mode="wait">
      {activeCelebration.type === 'level_up' && (
        <LevelUpCelebrationModal
          key={activeCelebration.id}
          oldLevel={activeCelebration.data.oldLevel ?? 1}
          newLevel={activeCelebration.data.newLevel ?? 2}
          onDismiss={dismiss}
        />
      )}

      {activeCelebration.type === 'xp_gain' && (
        <XPGainCelebrationModal
          key={activeCelebration.id}
          amount={activeCelebration.data.amount ?? 50}
          currentXP={activeCelebration.data.currentXP ?? 0}
          cheerType={activeCelebration.data.cheerType ?? 'confetti_cannon'}
          reason={activeCelebration.data.reason}
          onDismiss={dismiss}
        />
      )}

      {activeCelebration.type === 'streak_claim' && (
        <StreakClaimCelebrationModal
          key={activeCelebration.id}
          oldStreak={activeCelebration.data.oldStreak ?? 0}
          newStreak={activeCelebration.data.newStreak ?? 1}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  );
}
