import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor, cleanup, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../api/progress', async () => {
  const actual = await vi.importActual<any>('../../api/progress')
  return {
    ...actual,
    getProgress: vi.fn().mockResolvedValue({ lessonsCompleted: 0, kanjiLearned: 7, vocabLearned: 12, cardsMastered: 0 }),
    getStreakHistory: vi.fn().mockResolvedValue({ streaks: [] }),
  }
})
vi.mock('../../api/upload', () => ({ uploadAvatar: vi.fn() }))
vi.mock('../../api/users', () => ({ updateProfile: vi.fn() }))

import ProfilePage from '../ProfilePage'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'
import { useReadingStore } from '../../store/readingStore'
import { allStories } from '../../data/reading/n5_stories'

const profile = { id: 'u1', email: 'learner@example.com', username: 'rohith_ram', avatarId: 'avatar-1', avatarUrl: null, currentLevel: 'N5', createdAt: '2026-08-01T00:00:00Z' }

const progressMap = Object.fromEntries(
  allStories.slice(0, 5).map((s: any) => [s.id, { storyId: s.id, status: 'completed', quizScore: 80, completedAt: '2026-10-20T10:00:00Z', lastSentenceIndex: 7 }])
)

beforeEach(() => {
  useAuthStore.setState({ user: profile, profile, refreshProfile: vi.fn() } as any)
  useProgressStore.setState({ totalXP: 732, streak: 2, jlptLevel: 'N5' } as any)
  useReadingStore.setState({ progressMap, loadAllProgress: vi.fn() } as any)
})
afterEach(() => cleanup())

const renderPage = () => render(<MemoryRouter><ProfilePage /></MemoryRouter>)

describe('Profile page — real data, correct avatar, animated banner', () => {
  it('"Stories Read" matches the persisted story completions (it used to read 0 while the dashboard said 5)', async () => {
    renderPage()
    const tile = screen.getByText('Stories Read').parentElement as HTMLElement
    await waitFor(() => expect(within(tile).getByText('5')).toBeDefined(), { timeout: 3000 })
  })

  it('shows Wave XP and streak from the live progress store', async () => {
    renderPage()
    expect(screen.getByText('Total Wave XP')).toBeDefined()
    await waitFor(() => expect(screen.getAllByText(/732/).length).toBeGreaterThan(0), { timeout: 3000 })
  })

  it('shows the username (never the email) and the chosen avatar instead of the empty placeholder', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('rohith_ram')
    expect(document.body.textContent).not.toContain('learner@')
    expect(screen.getAllByRole('img').some((el) => el.textContent === '🥷')).toBe(true)
  })

  it('renders the animated 2D banner scene', () => {
    renderPage()
    const scene = screen.getByTestId('profile-banner-scene')
    expect(scene.querySelectorAll('.pbs-petal').length).toBeGreaterThan(5)
    expect(scene.querySelector('.pbs-slime')).not.toBeNull()
    expect(scene.getAttribute('aria-hidden')).toBe('true')
    expect(scene.textContent).toMatch(/prefers-reduced-motion/) // motion is disabled for people who ask for it
  })
})
