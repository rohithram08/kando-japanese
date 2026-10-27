import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'
import { useAuthStore } from '../../../store/authStore'

const profile = {
  id: 'u1',
  email: 'learner@example.com',
  username: 'rohith_ram',
  avatarId: 'avatar-1',
  avatarUrl: null,
  currentLevel: 'N5',
}

const setAuth = (p: any) => useAuthStore.setState({ user: p, profile: p } as any)

beforeEach(() => setAuth(profile))
afterEach(() => cleanup())

const openMenu = () => {
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  )
  fireEvent.click(screen.getByRole('button', { name: /profile menu/i }))
}

describe('Navbar profile menu', () => {
  it('shows the username — and never the email address', () => {
    openMenu()
    expect(screen.getByTestId('profile-menu-username').textContent).toBe('rohith_ram')
    expect(document.body.textContent).not.toContain('learner@example.com')
  })

  it('shows the learner\'s chosen avatar (camelCase avatarId), not just the first letter', () => {
    openMenu()
    const avatars = screen.getAllByRole('img').filter((el) => el.textContent === '🥷')
    expect(avatars.length).toBeGreaterThanOrEqual(2) // navbar button + menu header
  })

  it('falls back to the username initial when there is no avatar', () => {
    setAuth({ ...profile, avatarId: null })
    openMenu()
    expect(screen.getAllByRole('img').some((el) => el.textContent === 'R')).toBe(true)
  })

  it('never builds a name from the email when the username is missing', () => {
    setAuth({ ...profile, username: '', avatarId: null })
    openMenu()
    expect(screen.getByTestId('profile-menu-username').textContent).toBe('Learner')
    expect(document.body.textContent).not.toContain('learner@')
  })
})
