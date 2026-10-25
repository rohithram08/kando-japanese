import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GrammarPage from '../GrammarPage'
import KanjiPage from '../KanjiPage'
import ReadingPage from '../ReadingPage'
import { useAuthStore } from '../../store/authStore'

const setStudyLevel = (studyLevel: string) =>
  useAuthStore.setState({ user: null, profile: { id: 'p', username: 't', currentLevel: 'N1', studyLevel } as never })

const renderPage = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>)

// A level is "visible" if any element's entire text is "N5".."N1" (tabs, level badges).
const tab = (level: string) => screen.queryAllByText(new RegExp(`^${level}$`)).length > 0

describe.each([
  ['GrammarPage', GrammarPage],
  ['KanjiPage', KanjiPage],
])('%s level gating', (_name, Page) => {
  beforeEach(() => setStudyLevel('N5'))

  it('N5 learner: no level tabs at all', () => {
    renderPage(<Page />)
    for (const l of ['N4', 'N3', 'N2', 'N1']) expect(tab(l), l).toBe(false)
  })

  it('N3 learner: N5, N4, N3 tabs only', () => {
    setStudyLevel('N3')
    renderPage(<Page />)
    for (const l of ['N5', 'N4', 'N3']) expect(tab(l), l).toBe(true)
    for (const l of ['N2', 'N1']) expect(tab(l), l).toBe(false)
  })
})

describe('ReadingPage level gating', () => {
  it('N5 learner: no level tabs and no totals for other levels', () => {
    setStudyLevel('N5')
    const { container } = renderPage(<ReadingPage />)
    for (const l of ['N4', 'N3', 'N2', 'N1']) expect(tab(l), l).toBe(false)
    expect(container.textContent).not.toMatch(/250/)
    expect(container.textContent).not.toMatch(/N5, N4, N3, N2, N1/)
  })

  it('N3 learner: tabs for unlocked levels only', () => {
    setStudyLevel('N3')
    renderPage(<ReadingPage />)
    for (const l of ['N5', 'N4', 'N3']) expect(tab(l), l).toBe(true)
    for (const l of ['N2', 'N1']) expect(tab(l), l).toBe(false)
  })
})
