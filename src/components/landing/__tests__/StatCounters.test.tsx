// src/components/landing/__tests__/StatCounters.test.tsx
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCounters from '../StatCounters'

describe('StatCounters Component (Phase D — Micro-Interactions & Real Stats)', () => {
  it('renders section title, subtitle, and all 4 authentic curriculum benchmarks', () => {
    render(<StatCounters />)

    expect(screen.getByText(/Authentic Curriculum Benchmarks/i)).toBeDefined()
    expect(screen.getByText(/Built on Real Japanese Content/i)).toBeDefined()

    // Benchmark titles
    expect(screen.getByText('Foundation Kana')).toBeDefined()
    expect(screen.getByText('Graded Readers')).toBeDefined()
    expect(screen.getByText('AI Scenarios')).toBeDefined()
    expect(screen.getByText('Joyo Kanji Benchmarks')).toBeDefined()

    // Japanese category badges
    expect(screen.getByText('基礎仮名')).toBeDefined()
    expect(screen.getByText('多読・多聴')).toBeDefined()
    expect(screen.getByText('実践会話道場')).toBeDefined()
    expect(screen.getByText('常用漢字基準')).toBeDefined()
  })
})
