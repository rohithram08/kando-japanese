import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const updateProfileMock = vi.fn().mockResolvedValue({})
vi.mock('../../api/users', async () => {
  const actual = await vi.importActual<any>('../../api/users')
  return { ...actual, updateProfile: (...a: any[]) => updateProfileMock(...a) }
})

vi.mock('../../api/upload', () => ({
  uploadAvatar: vi.fn(),
  deleteAvatar: vi.fn(),
}))

vi.mock('../../api/progress', () => ({
  getProgress: vi.fn().mockResolvedValue({
    lessonsCompleted: 10,
    kanjiLearned: 50,
    vocabLearned: 150,
    cardsMastered: 40,
  }),
  getStreakHistory: vi.fn().mockResolvedValue([]),
}))

import ProfilePage from '../ProfilePage'
import { useAuthStore } from '../../store/authStore'
import { useProgressStore } from '../../store/progressStore'

const baseUser = {
  id: 'u1',
  email: 'learner@example.com',
  username: 'KenjiLearner',
  avatarId: 'avatar-1',
  avatarUrl: null,
  nativeLanguage: 'English',
  currentLevel: 'N5',
}

beforeEach(() => {
  updateProfileMock.mockClear()
  useAuthStore.setState({
    user: baseUser,
    profile: baseUser,
    refreshProfile: vi.fn().mockResolvedValue(undefined),
  } as any)
  useProgressStore.setState({
    totalXP: 500,
    streak: 5,
    jlptLevel: 'N5',
  } as any)
})

afterEach(() => {
  cleanup()
})

describe('ProfilePage — Direct In-Place Profile Customization', () => {
  it('opens the Edit Profile modal when clicking "Edit Profile" button', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProfilePage />
      </MemoryRouter>
    )

    expect(screen.queryByText(/Customize your public learner identity/i)).toBeNull()

    const editBtns = screen.getAllByRole('button', { name: /Edit Profile/i })
    fireEvent.click(editBtns[0])

    await waitFor(() => {
      expect(screen.getByText(/Customize your public learner identity/i)).toBeTruthy()
      expect(screen.getByPlaceholderText(/Your username/i)).toBeTruthy()
    })
  })

  it('automatically opens the modal when ?edit=true is present in the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/profile?edit=true']}>
        <ProfilePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Customize your public learner identity/i)).toBeTruthy()
    })
  })

  it('validates username format and blocks submission if invalid', async () => {
    render(
      <MemoryRouter initialEntries={['/profile?edit=true']}>
        <ProfilePage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Your username/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'bad username with spaces' } })

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(updateProfileMock).not.toHaveBeenCalled()
    })
  })

  it('saves valid username and target level changes directly from My Profile', async () => {
    render(
      <MemoryRouter initialEntries={['/profile?edit=true']}>
        <ProfilePage />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Your username/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'KenjiMaster' } })

    const n4Btn = screen.getByRole('button', { name: 'N4' })
    fireEvent.click(n4Btn)

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'KenjiMaster',
          currentLevel: 'N4',
        })
      )
    })
  })
})
