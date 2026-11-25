import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import KeyboardShortcutsModal from '../KeyboardShortcutsModal'

afterEach(() => {
  cleanup()
})

describe('KeyboardShortcutsModal Component', () => {
  it('renders shortcut categories and key badges when open', () => {
    render(<KeyboardShortcutsModal isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('Keyboard Shortcuts')).toBeDefined()
    expect(screen.getByText('Global Navigation')).toBeDefined()
    expect(screen.getByText('Graded Readers (多読)')).toBeDefined()
    expect(screen.getByText('SRS Reviews & Quizzes')).toBeDefined()
    expect(screen.getByText('Kana & Kanji Studio')).toBeDefined()
  })

  it('calls onClose when clicking close button or Escape key', () => {
    const onClose = vi.fn()
    render(<KeyboardShortcutsModal isOpen={true} onClose={onClose} />)

    fireEvent.click(screen.getByLabelText(/Close shortcuts/i))
    expect(onClose).toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<KeyboardShortcutsModal isOpen={false} onClose={() => {}} />)
    expect(container.firstChild).toBeNull()
  })
})
