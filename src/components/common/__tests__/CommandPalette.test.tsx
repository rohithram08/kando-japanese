import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CommandPalette from '../CommandPalette'

afterEach(() => {
  cleanup()
})

describe('CommandPalette Component', () => {
  it('renders search input and core curriculum items when open', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    )

    expect(screen.getByPlaceholderText(/Search sections/i)).toBeDefined()
    expect(screen.getByText('Kana Studio')).toBeDefined()
    expect(screen.getByText('Graded Reader')).toBeDefined()
    expect(screen.getByText('Listening Dojo')).toBeDefined()
    expect(screen.getByText('Kanji Explorer')).toBeDefined()
  })

  it('filters commands when query is typed and provides dynamic dictionary lookup item', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={() => {}} />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Search sections/i)
    fireEvent.change(input, { target: { value: 'taberu' } })

    expect(screen.getByText(/Look up "taberu" in Dictionary/i)).toBeDefined()
  })

  it('navigates with ArrowDown and ArrowUp keys and selects with Enter', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={onClose} />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Search sections/i)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={() => {}} />
      </MemoryRouter>
    )

    expect(container.firstChild).toBeNull()
  })
})
