import { describe, it, expect, afterEach } from 'vitest'
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MobileNav from '../MobileNav'

afterEach(() => cleanup())

describe('MobileNav labels', () => {
  const renderNav = () => render(<MemoryRouter><MobileNav onMoreClick={() => {}} /></MemoryRouter>)

  it('uses the short "Reader" label so the tab fits on one line (it wrapped as "Graded / Reader")', () => {
    renderNav()
    expect(screen.getByText('Reader')).toBeDefined()
    expect(screen.queryByText('Graded Reader')).toBeNull()
  })

  it('every tab label is single-line and truncates instead of wrapping', () => {
    renderNav()
    const nav = document.querySelector('nav') as HTMLElement
    const labels = [...nav.querySelectorAll('span')].filter((s) => /truncate/.test(s.className))
    expect(labels.length).toBeGreaterThanOrEqual(6) // 5 pinned tabs + More
    for (const l of labels) expect(l.className).toMatch(/whitespace-nowrap/)
  })
})
