import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../api/upload', () => ({ uploadAvatar: vi.fn(), deleteAvatar: vi.fn() }))

import SettingsPage from '../SettingsPage'
import { useAuthStore } from '../../store/authStore'

const base = {
  id: 'u1',
  email: 'learner@example.com',
  username: 'RohithRam',
  avatarId: 'avatar-1',
  avatarUrl: null,
  nativeLanguage: 'English',
  currentLevel: 'N5',
}

const renderPage = () =>
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )

beforeEach(() => {
  useAuthStore.setState({ user: base, profile: base, refreshProfile: vi.fn().mockResolvedValue(undefined) } as any)
})
afterEach(() => cleanup())

describe('Settings → Account & Security', () => {
  it('displays the Account & Security tab and never clutters Settings with profile edit forms', () => {
    renderPage()
    expect(screen.getAllByText(/Account & Security/i).length).toBeGreaterThan(0)
    // No redundant username edit input or raw save profile button in Settings
    expect(screen.queryByPlaceholderText(/your username/i)).toBeNull()
    expect(screen.queryByRole('button', { name: /save profile/i })).toBeNull()
  })

  it('renders the Learner Profile overview with direct link to My Profile', () => {
    renderPage()
    expect(screen.getByText(/Learner Profile/i)).toBeTruthy()
    expect(screen.getByText('RohithRam')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Edit on My Profile/i })).toBeTruthy()
  })

  it('displays the registered email safely with Verified status badge', () => {
    renderPage()
    expect(screen.getByText('learner@example.com')).toBeTruthy()
    expect(screen.getByText('Verified')).toBeTruthy()
  })

  it('renders the avatar dynamically from profile with no hardcoded fallback or broken image', () => {
    renderPage()
    expect(screen.getAllByRole('img').some((el) => el.textContent === '🥷')).toBe(true)
    expect(screen.queryByAltText('Profile')).toBeNull()
  })
})
