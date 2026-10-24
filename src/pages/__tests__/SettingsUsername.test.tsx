import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const updateProfile = vi.fn().mockResolvedValue({})
vi.mock('../../api/users', async () => {
  const actual = await vi.importActual<any>('../../api/users')
  return { ...actual, updateProfile: (...a: any[]) => updateProfile(...a) }
})
vi.mock('../../api/upload', () => ({ uploadAvatar: vi.fn(), deleteAvatar: vi.fn() }))

import SettingsPage from '../SettingsPage'
import { useAuthStore } from '../../store/authStore'

const base = { id: 'u1', email: 'a@b.com', username: 'Rohith Ram', avatarId: 'avatar-1', avatarUrl: null, nativeLanguage: 'English', currentLevel: 'N5' }

const renderPage = () =>
  render(
    <MemoryRouter>
      <SettingsPage />
    </MemoryRouter>
  )

const nameInput = () => screen.getByPlaceholderText(/your username/i) as HTMLInputElement
const save = () => fireEvent.click(screen.getByRole('button', { name: /save profile/i }))

beforeEach(() => {
  updateProfile.mockClear()
  useAuthStore.setState({ user: base, profile: base, refreshProfile: vi.fn().mockResolvedValue(undefined) } as any)
})
afterEach(() => cleanup())

describe('Settings → Username', () => {
  it('is called "Username" (not "Display Name") and explains the rules', () => {
    renderPage()
    expect(screen.getAllByText(/username$/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/display name/i)).toBeNull()
    expect(screen.getByTestId('username-help').textContent).toMatch(/3–30/)
  })

  it('blocks an invalid new username (spaces) and shows why — nothing is sent to the server', async () => {
    renderPage()
    fireEvent.change(nameInput(), { target: { value: 'rohith ram' } })
    save()
    await waitFor(() => expect(screen.getByTestId('username-help').textContent).toMatch(/no spaces/i))
    expect(updateProfile).not.toHaveBeenCalled()
  })

  it('blocks too-short usernames', async () => {
    renderPage()
    fireEvent.change(nameInput(), { target: { value: 'ab' } })
    save()
    await waitFor(() => expect(screen.getByTestId('username-help').textContent).toMatch(/at least 3/i))
    expect(updateProfile).not.toHaveBeenCalled()
  })

  it('saves a valid username', async () => {
    renderPage()
    fireEvent.change(nameInput(), { target: { value: 'rohith_ram' } })
    save()
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ username: 'rohith_ram' })))
  })

  it('does not lock out an existing account whose older name has a space (only enforced when changed)', async () => {
    renderPage()
    save() // untouched "Rohith Ram"
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({ username: 'Rohith Ram' })))
  })

  it('renders the avatar from the camelCase profile (no broken image)', () => {
    renderPage()
    expect(screen.getAllByRole('img').some((el) => el.textContent === '🥷')).toBe(true)
    expect(screen.queryByAltText('Profile')).toBeNull()
  })
})
