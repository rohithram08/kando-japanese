// src/components/streak/__tests__/TreasuryChallengeModal.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import TreasuryChallengeModal from '../TreasuryChallengeModal';
import { useProgressStore } from '../../../store/progressStore';
import * as treasuryService from '../../../services/treasuryService';

describe('TreasuryChallengeModal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    useProgressStore.setState({
      streakFreezes: 2,
      brokenStreakInfo: null,
      streak: 5,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<TreasuryChallengeModal isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the intro phase with probability drop rates and 1x/week status', () => {
    render(<TreasuryChallengeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getAllByText(/Treasury Challenge/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/5 Freezes \(MAX\)/i)).toBeTruthy();
    expect(screen.getByText('5%')).toBeTruthy();
    expect(screen.getByText(/Start Treasury Challenge/i)).toBeTruthy();
    expect(screen.getByText(/1x Per Week/i)).toBeTruthy();
  });

  it('shows claimed status when already opened this week', () => {
    localStorage.setItem(
      treasuryService.TREASURY_STORAGE_KEYS.LAST_CLAIMED,
      new Date().toISOString()
    );

    render(<TreasuryChallengeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Treasury Box Opened This Week/i)).toBeTruthy();
    expect(screen.queryByText(/Start Treasury Challenge/i)).toBeNull();
  });

  it('starts challenge, answers 3 questions, and unlocks treasury box', async () => {
    render(<TreasuryChallengeModal isOpen={true} onClose={vi.fn()} />);

    // Start challenge
    fireEvent.click(screen.getByText(/Start Treasury Challenge/i));

    await waitFor(() => {
      expect(screen.getByText(/Question 1 of 3/i)).toBeTruthy();
    });

    // Answer Q1 correctly (index 0 is always correct in curated set)
    const options1 = screen.getAllByRole('button');
    const answerBtn1 = options1.find((b) => b.textContent && !b.getAttribute('aria-label'));
    expect(answerBtn1).toBeTruthy();
    fireEvent.click(answerBtn1!);

    // Advances to Q2
    await waitFor(() => {
      expect(screen.getByText(/Question 2 of 3/i)).toBeTruthy();
    }, { timeout: 2000 });

    const options2 = screen.getAllByRole('button');
    const answerBtn2 = options2.find((b) => b.textContent && !b.getAttribute('aria-label'));
    fireEvent.click(answerBtn2!);

    // Advances to Q3
    await waitFor(() => {
      expect(screen.getByText(/Question 3 of 3/i)).toBeTruthy();
    }, { timeout: 2000 });

    const options3 = screen.getAllByRole('button');
    const answerBtn3 = options3.find((b) => b.textContent && !b.getAttribute('aria-label'));
    fireEvent.click(answerBtn3!);

    // Box Ready!
    await waitFor(() => {
      expect(screen.getByText(/The Treasury Box is Ready!/i)).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('opens treasury box, reveals reward, and adds freezes to inventory', async () => {
    vi.spyOn(treasuryService, 'rollTreasuryFreezeReward').mockReturnValue({
      freezes: 4,
      tier: 'epic',
      tierName: 'Epic',
      title: '💎 EPIC DROP! 4 Jelly Freezes!',
      message: 'Incredible pull!',
      icon: '💎',
      rarityBadge: '15% EPIC',
    });

    render(<TreasuryChallengeModal isOpen={true} onClose={vi.fn()} />);

    // Fast-forward by completing questions or mocking phase
    fireEvent.click(screen.getByText(/Start Treasury Challenge/i));

    // Answer Q1, Q2, Q3
    for (let q = 1; q <= 3; q++) {
      await waitFor(() => {
        expect(screen.getByText(new RegExp(`Question ${q} of 3`, 'i'))).toBeTruthy();
      });
      const btns = screen.getAllByRole('button').filter((b) => b.textContent && !b.getAttribute('aria-label'));
      fireEvent.click(btns[0]);
    }

    await waitFor(() => {
      expect(screen.getByText(/The Treasury Box is Ready!/i)).toBeTruthy();
    });

    // Click Open Treasury Box
    fireEvent.click(screen.getByText(/Open Treasury Box!/i));

    await waitFor(() => {
      expect(screen.getByText(/EPIC DROP! 4 Jelly Freezes!/i)).toBeTruthy();
    }, { timeout: 3000 });

    // Inventory updated
    expect(useProgressStore.getState().streakFreezes).toBe(6); // Initial 2 + 4 won
  });

  it('prompts to restore ended streak when brokenStreakInfo exists', async () => {
    useProgressStore.setState({
      brokenStreakInfo: { count: 8, missedDate: '2026-10-30' },
      streak: 0,
      streakFreezes: 3,
    });

    render(<TreasuryChallengeModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Streak Ended \(8 Days\)!/i)).toBeTruthy();
  });
});
