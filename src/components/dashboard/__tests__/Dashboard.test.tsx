import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock auth store
vi.mock('../../../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    profile: {
      username: 'Rohith Ram',
      display_name: 'Rohith Ram',
      currentLevel: 'N5',
      streakDays: 4,
      xpPoints: 301,
    },
  }),
}));

// Mock progress store
const progressState = {
  totalXP: 301,
  streak: 4,
  dailyXP: 45,
  jlptLevel: 'N5',
  userLevel: 4,
  lessonsCompleted: 3,
  kanjiLearned: 15,
  vocabLearned: 45,
  srsReviewsDue: 0,
  loadSRSDue: vi.fn().mockResolvedValue(0),
  isStreakFrozen: false,
  checkAndMaintainStreak: vi.fn(),
};

vi.mock('../../../store/progressStore', () => ({
  useProgressStore: (selector?: any) =>
    typeof selector === 'function' ? selector(progressState) : progressState,
}));

// Mock reading store
vi.mock('../../../store/readingStore', () => ({
  useReadingStore: () => ({
    progressMap: {
      story_n5_01: { status: 'completed', quizScore: 100 },
    },
  }),
}));

// Mock settings store
vi.mock('../../../store/settingsStore', () => ({
  useSettingsStore: (selector: any) => selector({ displayLanguage: 'en', dailyGoal: 50 }),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard hero, user greeting, level, streak and XP badges without crashing', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Should render username
    expect(screen.getByText(/Rohith Ram!/i)).toBeDefined();

    // Should render Wave XP badge
    expect(screen.getAllByText(/301/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Wave XP/i).length).toBeGreaterThan(0);

    // Should render Jelly Streak
    expect(screen.getAllByText(/Jelly Streak/i).length).toBeGreaterThan(0);

    // Should render "Continue Graded Reader"
    expect(screen.getByText(/Continue Graded Reader/i)).toBeDefined();

    // Should render Learn section tiles
    expect(screen.getByText(/Kana Studio/i)).toBeDefined();
    expect(screen.getAllByText(/Graded Reader/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Grammar/i).length).toBeGreaterThan(0);
  });
});
