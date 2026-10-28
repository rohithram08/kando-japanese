import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AchievementsPage from '../AchievementsPage'

// Mock progress store
const mockProgressState = {
  streak: 4,
  totalXP: 740,
  dailyXP: 60,
  jlptLevel: 'N5',
  userLevel: 6,
  lessonsCompleted: 8,
  kanjiLearned: 22,
  vocabLearned: 65,
  cardsReviewed: 30,
}

vi.mock('../../store/progressStore', () => ({
  useProgressStore: () => mockProgressState,
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: (selector?: any) => {
    const state = {
      user: { id: 'test-user', email: 'rohith@example.com' },
      profile: {
        username: 'Rohith Ram',
        displayName: 'Rohith Ram',
        currentLevel: 'N5',
        streakDays: 4,
        longestStreak: 7,
        xpPoints: 740,
      },
    }
    return typeof selector === 'function' ? selector(state) : state
  },
}))

vi.mock('../../store/readingStore', () => ({
  useReadingStore: (selector?: any) => {
    const state = {
      progressMap: {
        story_1: { quizScore: 100, score: 100 },
        story_2: { quizScore: 85, score: 85 },
      },
    }
    return typeof selector === 'function' ? selector(state) : state
  },
}))

vi.mock('../../hooks/useLeague', () => ({
  useLeague: () => ({
    data: {
      rung: { index: 3, id: 'take_iii', name: 'Take III', league: 'take' },
      board: { you: { rank: 2, meetsMinXp: true } },
    },
  }),
  useLeagueHistory: () => ({
    data: {
      weeks: [
        { weekId: '2026-W16', rank: 2, rungStart: 2, outcome: 'promoted', rung: { index: 3 } },
      ],
    },
  }),
}))

describe('AchievementsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Personal Records section with Longest Streak, Highest League, Most XP, and Perfect Lessons', () => {
    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    )

    // Heading & Personal records section
    expect(screen.getAllByText(/Personal Records/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/All-Time Records/i)).toBeDefined()

    // 1. Longest streak
    expect(screen.getByText(/Longest Streak/i)).toBeDefined()
    expect(screen.getByText('Days')).toBeDefined()

    // 2. Highest league (connected dynamically to ladder: Take III / 竹)
    expect(screen.getByText(/Highest League/i)).toBeDefined()
    expect(screen.getAllByText(/Take III/i).length).toBeGreaterThan(0)
    expect(screen.getByText('View League →')).toBeDefined()

    // 3. Most Wave XP
    expect(screen.getByText(/Most Wave XP/i)).toBeDefined()
    expect(screen.getAllByText(/740/i).length).toBeGreaterThan(0)

    // 4. Perfect Lessons
    expect(screen.getByText(/Perfect Lessons/i)).toBeDefined()

    // Extraneous progress cards should NOT be in Personal Records
    expect(screen.queryByText(/SRS Reviews Done/i)).toBeNull()
    expect(screen.queryByText(/Vocabulary Mastered/i)).toBeNull()
  })

  it('shows ONLY obtained Slime Awards and Slime Stickers', () => {
    render(
      <MemoryRouter>
        <AchievementsPage />
      </MemoryRouter>
    )

    // Should display Obtained Slime Awards header
    expect(screen.getByText(/Obtained Slime Awards/i)).toBeDefined()
    expect(screen.getAllByText(/Collected/i).length).toBeGreaterThan(0)

    // First Steps (lessonsCompleted >= 1) is earned
    expect(screen.getByText(/First Steps/i)).toBeDefined()

    // Flame Ignited / On Fire is earned (streak >= 3)
    expect(screen.getByText(/On Fire!/i)).toBeDefined()

    // Walking Dictionary is earned (vocabLearned >= 25)
    expect(screen.getByText(/Walking Dictionary/i)).toBeDefined()

    // Authentic League award: Wakaba Challenger & Take Ascendant are earned
    expect(screen.getByText(/Wakaba Challenger/i)).toBeDefined()
    expect(screen.getByText(/Take Ascendant/i)).toBeDefined()
  })
})
