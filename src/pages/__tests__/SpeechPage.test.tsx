import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SpeechPage from '../SpeechPage'
import {
  getAllLevelWordCounts,
  getDailyRandomWords,
  getLevelWordPool,
} from '../../data/speech/speechCorpus'

describe('speechCorpus & SpeechPage', () => {
  beforeEach(() => {
    localStorage.clear()
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

  it('renders Daily 10 words, supports shuffling, marking practiced, switching JLPT level, and 1,000+ Explorer', () => {
    render(
      <MemoryRouter>
        <SpeechPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: /Speech Lab/i })).toBeDefined()
    expect(screen.getByText(/0 \/ 10 Done/i)).toBeDefined()
    expect(screen.getByText(/Today's N5 Random 10/i)).toBeDefined()

    // Mark first word practiced
    fireEvent.click(screen.getByRole('button', { name: /Mark Practiced/i }))
    expect(screen.getByText(/1 \/ 10 Done/i)).toBeDefined()

    // Shuffle generates another batch
    fireEvent.click(screen.getByRole('button', { name: /Shuffle 10 New/i }))
    expect(screen.getByText(/0 \/ 10 Done/i)).toBeDefined()

    // Switch level to N3 (1,682 words)
    fireEvent.click(screen.getByRole('button', { name: /^N3\b/i }))
    expect(screen.getByText(/Today's N3 Random 10/i)).toBeDefined()

    // Switch to 1,000+ Word Explorer tab
    fireEvent.click(screen.getByRole('tab', { name: /1,000\+ Word Explorer/i }))
    expect(screen.getByPlaceholderText(/Filter 1,682 N3 words/i)).toBeDefined()
  })
})
