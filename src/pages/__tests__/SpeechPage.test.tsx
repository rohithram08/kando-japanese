import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpeechPage from '../SpeechPage'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import {
  getAllLevelWordCounts,
  getDailyRandomWords,
  getLevelWordPool,
} from '../../data/speech/speechCorpus'

const setStudyLevel = (studyLevel: string) =>
  useAuthStore.setState({ user: null, profile: { id: 'p', username: 't', currentLevel: 'N5', studyLevel } as never })

describe('speechCorpus & SpeechPage', () => {
  beforeEach(() => {
    localStorage.clear()
    setStudyLevel('N5')
    useSettingsStore.setState({ jlptLevel: 'N5' } as never)
  })

  it('exposes 1,000+ curriculum words for every JLPT level (N5 through N1)', () => {
    const counts = getAllLevelWordCounts()
    expect(counts.N5).toBeGreaterThanOrEqual(1000)
    expect(counts.N4).toBeGreaterThanOrEqual(1000)
    expect(counts.N3).toBeGreaterThanOrEqual(1000)
    expect(counts.N2).toBeGreaterThanOrEqual(1000)
    expect(counts.N1).toBeGreaterThanOrEqual(1000)
  })

  it('draws 10 deterministic daily random words per level/date and allows reshuffling', () => {
    const dayOneA = getDailyRandomWords('N5', '2026-11-26', 'en', 0, 10)
    const dayOneB = getDailyRandomWords('N5', '2026-11-26', 'en', 0, 10)
    const dayTwo = getDailyRandomWords('N5', '2026-11-27', 'en', 0, 10)
    const reshuffled = getDailyRandomWords('N5', '2026-11-26', 'en', 1, 10)
    const n3Set = getDailyRandomWords('N3', '2026-11-26', 'en', 0, 10)

    expect(dayOneA).toHaveLength(10)
    expect(dayOneA.map((w) => w.id)).toEqual(dayOneB.map((w) => w.id))
    expect(dayOneA.map((w) => w.id)).not.toEqual(dayTwo.map((w) => w.id))
    expect(dayOneA.map((w) => w.id)).not.toEqual(reshuffled.map((w) => w.id))
    expect(n3Set).toHaveLength(10)
    expect(n3Set.every((w) => w.level === 'N3')).toBe(true)
    expect(getLevelWordPool('N4', 'en').length).toBeGreaterThanOrEqual(1000)
  })

  it('N5 account only sees N5 content and never exposes N4-N1 buttons', () => {
    render(
      <MemoryRouter>
        <SpeechPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/Today's N5 Random 10/i)).toBeDefined()
    for (const lockedLvl of ['N4', 'N3', 'N2', 'N1']) {
      expect(screen.queryByRole('button', { name: new RegExp(`^${lockedLvl}\\b`, 'i') })).toBeNull()
    }
  })

  it('N4 account defaults to N4, shows only N5 and N4 levels, supports Daily 10 and 1,000+ Explorer', () => {
    setStudyLevel('N4')
    render(
      <MemoryRouter>
        <SpeechPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: /Speech Lab/i })).toBeDefined()
    expect(screen.getByText(/0 \/ 10 Done/i)).toBeDefined()
    expect(screen.getByText(/Today's N4 Random 10/i)).toBeDefined()

    // Only N5 and N4 are unlocked
    expect(screen.getByRole('button', { name: /^N5\b/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /^N4\b/i })).toBeDefined()
    for (const lockedLvl of ['N3', 'N2', 'N1']) {
      expect(screen.queryByRole('button', { name: new RegExp(`^${lockedLvl}\\b`, 'i') })).toBeNull()
    }

    // Mark first word practiced
    fireEvent.click(screen.getByRole('button', { name: /Mark Practiced/i }))
    expect(screen.getByText(/1 \/ 10 Done/i)).toBeDefined()

    // Shuffle generates another batch
    fireEvent.click(screen.getByRole('button', { name: /Shuffle 10 New/i }))
    expect(screen.getByText(/0 \/ 10 Done/i)).toBeDefined()

    // Switch back to unlocked N5 and open 1,000+ Word Explorer
    fireEvent.click(screen.getByRole('button', { name: /^N5\b/i }))
    expect(screen.getByText(/Today's N5 Random 10/i)).toBeDefined()

    fireEvent.click(screen.getByRole('tab', { name: /1,000\+ Word Explorer/i }))
    expect(screen.getByPlaceholderText(/Filter 1,570 N5 words/i)).toBeDefined()
  })
})
