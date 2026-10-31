// src/components/dashboard/__tests__/StreakCardTreasury.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import StreakCard from '../StreakCard';
import { useProgressStore } from '../../../store/progressStore';

describe('StreakCard — Treasury & Broken Streak Freeze', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useProgressStore.setState({
      streak: 5,
      streakFreezes: 2,
      brokenStreakInfo: null,
      isStreakFrozen: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the Treasury Box button on the StreakCard', () => {
    render(<StreakCard streak={5} />);
    expect(screen.getByText(/Treasury Box/i)).toBeTruthy();
  });

  it('opens TreasuryChallengeModal when clicking Treasury Box button', () => {
    render(<StreakCard streak={5} />);
    const treasuryBtn = screen.getByText(/Treasury Box/i);
    fireEvent.click(treasuryBtn);

    expect(screen.getByRole('dialog', { name: /Treasury Challenge Modal/i })).toBeTruthy();
  });

  it('displays the broken streak recovery banner when brokenStreakInfo exists', async () => {
    useProgressStore.setState({
      streak: 0,
      streakFreezes: 2,
      brokenStreakInfo: { count: 6, missedDate: '2026-10-30' },
    });

    render(<StreakCard streak={0} />);

    expect(screen.getByText(/Streak Ended \(6 Days\)!/i)).toBeTruthy();
    expect(screen.getByText(/Restore Streak/i)).toBeTruthy();

    // Click Restore Streak
    const restoreBtn = screen.getByText(/Restore Streak/i);
    fireEvent.click(restoreBtn);

    // Streak should be restored
    const state = useProgressStore.getState();
    expect(state.streak).toBe(6);
    expect(state.streakFreezes).toBe(1);
    expect(state.isStreakFrozen).toBe(true);
    expect(state.brokenStreakInfo).toBeNull();
  });
});
