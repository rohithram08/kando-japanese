import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ParticleStudio from '../ParticleStudio'

vi.mock('../../services/audioService', () => ({
  audioService: {
    speak: vi.fn().mockResolvedValue(true),
  },
}))

vi.mock('../../utils/soundEffects', () => ({
  playClick: vi.fn(),
  soundEffects: {
    playSuccess: vi.fn(),
    playClick: vi.fn(),
  },
}))

describe('ParticleStudio component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Particle Parallelism Studio header and tabs', () => {
    render(<ParticleStudio />)
    expect(screen.getByText(/Particle Parallelism Studio/i)).toBeDefined()
    expect(screen.getByText('Particle Matrix')).toBeDefined()
    expect(screen.getByText('SOV Parallelism')).toBeDefined()
    expect(screen.getByText('Practice Quiz')).toBeDefined()
  })

  it('displays Tamil and Hindi case marker parallels for particles', () => {
    render(<ParticleStudio />)
    // Default selected particle is は
    expect(screen.getByText(/Tamil Equivalent/i)).toBeDefined()
    expect(screen.getByText(/Hindi Equivalent/i)).toBeDefined()
    expect(screen.getByText(/Topic Marker/i)).toBeDefined()
  })

  it('switches to SOV Parallelism tab and shows 4-language word order comparison', () => {
    render(<ParticleStudio />)
    const sovTab = screen.getByText('SOV Parallelism')
    fireEvent.click(sovTab)

    expect(screen.getByText(/Japanese \(SOV \+ Postpositions\)/i)).toBeDefined()
    expect(screen.getByText(/Tamil \(SOV \+ Postpositional வேற்றுமை உருபுகள்\)/i)).toBeDefined()
    expect(screen.getByText(/Hindi \(SOV \+ Postpositional कारक \/ परसर्ग\)/i)).toBeDefined()
    expect(screen.getByText(/English \(SVO \+ Prepositions\) — Inverted Order/i)).toBeDefined()
  })

  it('allows practicing in the Practice Quiz tab', () => {
    render(<ParticleStudio />)
    const quizTab = screen.getByText('Practice Quiz')
    fireEvent.click(quizTab)

    expect(screen.getByText(/Question 1 of/i)).toBeDefined()
    expect(screen.getByText(/Complete the Japanese sentence/i)).toBeDefined()
  })
})
