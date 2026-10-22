import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from '../ProfilePage';

vi.mock('../../api/progress', () => ({
  getProgress: vi.fn().mockResolvedValue({
    lessonsCompleted: 10,
    kanjiLearned: 50,
    vocabLearned: 150,
    cardsMastered: 40,
  }),
  getStreakHistory: vi.fn().mockResolvedValue([
    { date: new Date().toISOString(), lessonsCompleted: 2, minutesStudied: 1200, xpEarned: 100 },
  ]),
}));

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user-123', email: 'samurai@example.com', username: 'SamuraiX', created_at: '2026-01-01' },
    profile: {
      username: 'SamuraiX',
      current_level: 'N5',
      streak_days: 14,
      xp_points: 1200,
      avatar_id: 'avatar-1',
    },
    refreshProfile: vi.fn(),
  }),
}));

vi.mock('../../store/progressStore', () => ({
  useProgressStore: () => ({
    totalXP: 1200,
    streak: 14,
    jlptLevel: 'N5',
    lessonsCompleted: 10,
    kanjiLearned: 50,
    vocabLearned: 150,
    cardsMastered: 40,
    grammarLearned: 12,
  }),
}));

describe('ProfilePage Component', () => {
  it('renders profile username, level, streak, and XP without crashing', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(screen.getByText('SamuraiX')).toBeTruthy();
    expect(screen.getAllByText(/N5/).length).toBeGreaterThan(0);
    expect(screen.getByText('Skill Overview')).toBeTruthy();
  });

  it('switches to Achievements tab and displays real achievements from store', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const achievementsTabBtn = screen.getByRole('button', { name: /Achievements/i });
    fireEvent.click(achievementsTabBtn);

    await waitFor(() => {
      expect(screen.getByText('All Achievements')).toBeTruthy();
      expect(screen.getByText('First Steps')).toBeTruthy();
    });
  });

  it('switches to Activity tab and displays Weekly XP Activity', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    const activityTabBtn = screen.getByRole('button', { name: /Activity/i });
    fireEvent.click(activityTabBtn);

    await waitFor(() => {
      expect(screen.getByText('Weekly XP Activity')).toBeTruthy();
    });
  });
});
