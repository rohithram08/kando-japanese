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
  // Honour selectors like the real zustand hook does
  useReadingStore: (selector?: (s: any) => any) => {
    const state = {
      progressMap: {
        story_n5_01: { storyId: 'story_n5_01', status: 'completed', quizScore: 100, completedAt: '2026-10-20T10:00:00Z' },
      },
      loadAllProgress: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
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

  it('shows story progress, quiz performance and level progress derived from persisted data', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // 1 completed story (mocked saved progress) out of the stories unlocked at the default N5 level
    expect(screen.getByTestId('stories-of-total').textContent).toMatch(/^1 of 50 stories completed$/);
    // Quiz performance comes from the saved quiz score, not a placeholder
    const perf = screen.getByTestId('quiz-performance');
    expect(perf.textContent).toMatch(/100%/);
    expect(perf.textContent).toMatch(/Quizzes completed/);
    // 301 Wave XP => level 4 (starts at 190), 39 XP short of level 5 (starts at 340): same shared calculator as the sidebar
    expect(screen.getByTestId('dashboard-level-progress').textContent).toMatch(/Level 4/);
    expect(screen.getByTestId('dashboard-level-progress').textContent).toMatch(/39 Wave XP to Level 5/);
  });
});
