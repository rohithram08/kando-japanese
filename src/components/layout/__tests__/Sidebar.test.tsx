import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import React from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'
import { useAuthStore } from '../../../store/authStore'
import { useProgressStore } from '../../../store/progressStore'

afterEach(() => cleanup())

describe('Sidebar navigation & My Profile', () => {
  beforeEach(() => {
    useAuthStore.setState({
      profile: {
        id: 'u1',
        username: 'sakura_learner',
        display_name: 'Sakura Learner',
        avatarId: 'avatar-3',
        avatarUrl: null,
      },
    } as any)
    useProgressStore.setState({
      totalXP: 1250,
      jlptLevel: 'N5',
      streak: 7,
      userLevel: 3,
      isStreakFrozen: false,
    } as any)
  })

  it('renders "My Profile" nav item pointing to /profile in the navigation items', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar collapsed={false} onToggleCollapse={() => {}} />
      </MemoryRouter>
    )

    // Check for "My Profile" in the navigation
    const profileLinks = screen.getAllByRole('link', { name: /my profile/i })
    expect(profileLinks.length).toBeGreaterThanOrEqual(1)
    expect(profileLinks[0].getAttribute('href')).toBe('/profile')
  })

  it('renders user details and avatar card linking to /profile at the bottom of the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar collapsed={false} onToggleCollapse={() => {}} />
      </MemoryRouter>
    )

    expect(screen.getByText('Sakura Learner')).toBeDefined()
    expect(screen.getByText(/Lv\.3 Adventurer/)).toBeDefined()
    expect(screen.getByText('1,250')).toBeDefined()

    const bottomCard = screen.getByTitle(/View your profile & achievements/i)
    expect(bottomCard.getAttribute('href')).toBe('/profile')
  })

  it('renders collapsed state with avatar and tooltip for My Profile', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar collapsed={true} onToggleCollapse={() => {}} />
      </MemoryRouter>
    )

    // Collapsed bottom profile button
    const collapsedBottom = screen.getByTitle(/Sakura Learner · Lv\.3/i)
    expect(collapsedBottom).toBeDefined()
    expect(collapsedBottom.getAttribute('href')).toBe('/profile')
  })

  it('renders mobile drawer with close button when isMobileDrawer is true', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Sidebar isMobileDrawer={true} onClose={onClose} />
      </MemoryRouter>
    )

    const closeBtn = screen.getByRole('button', { name: /close menu/i })
    expect(closeBtn).toBeDefined()
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
