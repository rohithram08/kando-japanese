import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UserProfilePage from '../UserProfilePage'
import * as usersApi from '../../api/users'
import { useAuthStore } from '../../store/authStore'

vi.mock('../../api/users', async (importOriginal) => {
  const actual = await importOriginal<typeof usersApi>()
  return {
    ...actual,
    getUserProfile: vi.fn(),
    sendUserAlert: vi.fn(),
  }
})

describe('UserProfilePage & Study Motivation Alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: { id: 'current-user-1', email: 'current@example.com' } as any,
    })
  })

  it('renders learner profile and harassment-free study alert buttons', async () => {
    vi.mocked(usersApi.getUserProfile).mockResolvedValue({
      id: 'peer-user-2',
      username: 'Sakura_Chan',
      currentLevel: 'N4',
      xpPoints: 2400,
      streakDays: 12,
      createdAt: '2025-03-01T00:00:00Z',
      lessonsCount: 24,
      kanjiCount: 45,
      vocabCount: 90,
    } as any)

    render(
      <MemoryRouter initialEntries={['/profile/peer-user-2']}>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText('Sakura_Chan')).toBeDefined()
    })

    // Public stats
    expect(screen.getAllByText(/2,400/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/12/).length).toBeGreaterThan(0)

    // Predefined Study Motivation Alert buttons
    expect(screen.getByText('Send a Study Motivation Alert')).toBeDefined()
    expect(screen.getByText("Let's start studying!")).toBeDefined()
    expect(screen.getByText('Keep your streak alive!')).toBeDefined()
    expect(screen.getByText('Ganbatte! You can do it!')).toBeDefined()
    expect(screen.getByText('Great job in the league!')).toBeDefined()

    // Safety and confidentiality guarantee banner
    expect(screen.getByText(/Privacy Protection/i)).toBeDefined()
  })

  it('sends canned alert when clicking study alert button', async () => {
    vi.mocked(usersApi.getUserProfile).mockResolvedValue({
      id: 'peer-user-2',
      username: 'Sakura_Chan',
      currentLevel: 'N4',
      xpPoints: 2400,
      streakDays: 12,
      createdAt: '2025-03-01T00:00:00Z',
      lessonsCount: 24,
      kanjiCount: 45,
      vocabCount: 90,
    } as any)

    vi.mocked(usersApi.sendUserAlert).mockResolvedValue({
      success: true,
      message: 'Study alert sent successfully',
      alert: {
        type: 'study',
        label: "Let's start studying!",
        text: "Let's start studying! 📚",
        icon: '📚',
        senderName: 'Rohith',
        recipientId: 'peer-user-2',
        sentAt: new Date().toISOString(),
      },
    })

    render(
      <MemoryRouter initialEntries={['/profile/peer-user-2']}>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("Let's start studying!")).toBeDefined()
    })

    const studyBtn = screen.getByText("Let's start studying!").closest('button')!
    fireEvent.click(studyBtn)

    await waitFor(() => {
      expect(usersApi.sendUserAlert).toHaveBeenCalledWith('peer-user-2', 'study')
      expect(screen.getByText('Sent')).toBeDefined()
    })
  })

  it('hides alert buttons when viewing own profile', async () => {
    useAuthStore.setState({
      user: { id: 'peer-user-2', email: 'sakura@example.com' } as any,
    })

    vi.mocked(usersApi.getUserProfile).mockResolvedValue({
      id: 'peer-user-2',
      username: 'Sakura_Chan',
      currentLevel: 'N4',
      xpPoints: 2400,
      streakDays: 12,
      createdAt: '2025-03-01T00:00:00Z',
      lessonsCount: 24,
      kanjiCount: 45,
      vocabCount: 90,
    } as any)

    render(
      <MemoryRouter initialEntries={['/profile/peer-user-2']}>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Sakura_Chan')).toBeDefined()
    })

    // Should NOT show the send motivation alert panel to oneself
    expect(screen.queryByText('Send a Study Motivation Alert')).toBeNull()
  })
})
