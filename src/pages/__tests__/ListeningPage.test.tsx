import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListeningPage from '../ListeningPage';
import { useStudyLevel } from '../../hooks/useStudyLevel';
import { useAuthStore } from '../../store/authStore';

// Mock dependencies
vi.mock('../../hooks/useStudyLevel', () => ({
  useStudyLevel: vi.fn(),
}));

vi.mock('../../hooks/useStudyTracker', () => ({
  useStudyTracker: () => ({
    activeSeconds: 45,
    formattedTime: '00:45',
    isIdle: false,
    flush: vi.fn(),
  }),
}));

vi.mock('../../api/listening', () => ({
  getListeningScenarios: vi.fn().mockResolvedValue([]),
  saveListeningProgress: vi.fn().mockResolvedValue({ success: true }),
}));

describe('ListeningPage Level Gating & Duolingo Overhaul', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('strictly restricts level tabs and scenarios to N5 for an N5 learner', () => {
    // Mock user as JLPT N5
    vi.mocked(useStudyLevel).mockReturnValue({
      studyLevel: 'N5',
      unlocked: ['N5'],
      isUnlocked: (lvl: string) => lvl === 'N5',
    } as any);

    render(<ListeningPage />);

    // Header title
    expect(screen.getByText('JLPT Listening Dojo')).toBeTruthy();

    // Only N5 level tab should be present (N4, N3, N2, N1 must NOT exist)
    expect(screen.getByRole('button', { name: 'N5' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'N4' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'N3' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'N2' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'N1' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'All' })).toBeNull();

    // Should display N5 scenarios (e.g. Convenience store, Bakery)
    expect(screen.getAllByText('コンビニでのお買い物').length).toBeGreaterThanOrEqual(1);
  });

  it('allows N5 and N4 for an N4 learner', () => {
    // Mock user as JLPT N4
    vi.mocked(useStudyLevel).mockReturnValue({
      studyLevel: 'N4',
      unlocked: ['N5', 'N4'],
      isUnlocked: (lvl: string) => ['N5', 'N4'].includes(lvl),
    } as any);

    render(<ListeningPage />);

    // Tabs for N4 learner: All Unlocked, N5, N4
    expect(screen.getByRole('button', { name: 'All Unlocked' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'N5' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'N4' })).toBeTruthy();

    // Locked levels should NOT exist
    expect(screen.queryByRole('button', { name: 'N3' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'N2' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'N1' })).toBeNull();
  });
});
