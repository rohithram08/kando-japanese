import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

const getInbox = vi.fn()
const markRead = vi.fn()
vi.mock('../../api/users', () => ({ getAlertInbox: () => getInbox(), markAlertsRead: (ids: string[]) => markRead(ids) }))

import { useAlertInbox } from '../useAlertInbox'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'

function Probe() { useAlertInbox(); return null }

describe('useAlertInbox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNotificationStore.setState({ notifications: [] })
  })

  it('does nothing when signed out', async () => {
    useAuthStore.setState({ user: null } as never)
    render(<Probe />)
    await new Promise((r) => setTimeout(r, 20))
    expect(getInbox).not.toHaveBeenCalled()
  })

  it('copies unread alerts into the bell and marks them read on the server', async () => {
    useAuthStore.setState({ user: { id: 'me' } } as never)
    getInbox.mockResolvedValue({ unread: 1, alerts: [
      { id: 'a1', type: 'cheer', icon: '🌸', text: 'Ganbatte! You can do it! 🌸', createdAt: new Date().toISOString(), read: false, sender: { id: 's1', name: 'Sakura' } },
      { id: 'a0', type: 'study', icon: '📚', text: 'old', createdAt: new Date().toISOString(), read: true, sender: { id: 's2', name: 'Old' } },
    ] })
    markRead.mockResolvedValue({ success: true })
    render(<Probe />)
    await waitFor(() => expect(markRead).toHaveBeenCalledWith(['a1']))
    const n = useNotificationStore.getState().notifications
    expect(n).toHaveLength(1)
    expect(n[0]).toMatchObject({ id: 'peer-alert-a1', text: 'Ganbatte! You can do it! 🌸', link: '/profile/s1' })
  })
})
