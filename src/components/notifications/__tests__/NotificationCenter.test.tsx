// src/components/notifications/__tests__/NotificationCenter.test.tsx
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import NotificationCard from '../NotificationCard'
import NotificationCenter from '../NotificationCenter'
import SlimeNotificationMascot from '../SlimeNotificationMascot'
import { useNotificationStore } from '../../../store/notificationStore'
import {
  isNotificationSupported,
  getNotificationPermission,
  sendBrowserNotification,
} from '../../../services/browserNotificationService'

describe('SlimeNotificationMascot Component', () => {
  it('renders vector slime mascot with daily mood', () => {
    const { container } = render(<SlimeNotificationMascot mood="daily" size={64} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(container.querySelector('[aria-label="Kando Slime Mascot: daily"]')).toBeTruthy()
  })

  it('renders vector slime mascot with srs mood', () => {
    const { container } = render(<SlimeNotificationMascot mood="srs" size={64} />)
    expect(container.querySelector('[aria-label="Kando Slime Mascot: srs"]')).toBeTruthy()
  })

  it('renders vector slime mascot with streak flame aura', () => {
    const { container } = render(<SlimeNotificationMascot mood="streak" size={64} />)
    expect(container.querySelector('.slime-fire-aura')).toBeTruthy()
  })
})

describe('NotificationCard Component', () => {
  const sampleNotification = {
    id: 'test-daily-reminder',
    type: 'daily_reminder',
    category: 'reminders',
    slimeMood: 'daily',
    greeting: "Hi Rohith! It's Slime.",
    title: 'Daily Japanese Practice',
    text: 'Take 3 minutes to read a story today.',
    unread: true,
    link: '/reading',
    primaryAction: { label: 'Start Lesson', link: '/reading' },
    secondaryAction: { label: 'Remind me later', action: 'snooze' },
  }

  it('renders Duolingo-style notification card with header, greeting, and message', () => {
    render(
      <NotificationCard
        notification={sampleNotification}
        timeAgoText="5m ago"
      />
    )

    expect(screen.getByText('Kando Japanese')).toBeTruthy()
    expect(screen.getByText('5m ago')).toBeTruthy()
    expect(screen.getByText("Hi Rohith! It's Slime.")).toBeTruthy()
    expect(screen.getByText('Take 3 minutes to read a story today.')).toBeTruthy()
    expect(screen.getByText('Start Lesson')).toBeTruthy()
    expect(screen.getByText('Remind me later')).toBeTruthy()
  })

  it('triggers primary action navigation and markRead on click', () => {
    const onNavigate = vi.fn()
    const onMarkRead = vi.fn()

    render(
      <NotificationCard
        notification={sampleNotification}
        onNavigate={onNavigate}
        onMarkRead={onMarkRead}
      />
    )

    const primaryBtn = screen.getByText('Start Lesson')
    fireEvent.click(primaryBtn)

    expect(onMarkRead).toHaveBeenCalledWith('test-daily-reminder')
    expect(onNavigate).toHaveBeenCalledWith('/reading')
  })

  it('triggers snooze on clicking secondary action', () => {
    const onSnooze = vi.fn()

    render(
      <NotificationCard
        notification={sampleNotification}
        onSnooze={onSnooze}
      />
    )

    const secondaryBtn = screen.getByText('Remind me later')
    fireEvent.click(secondaryBtn)

    expect(onSnooze).toHaveBeenCalledWith('test-daily-reminder')
  })

  it('toggles accordion between expanded and collapsed', () => {
    render(<NotificationCard notification={sampleNotification} />)

    const collapseBtn = screen.getByTitle('Collapse')
    fireEvent.click(collapseBtn)

    // After collapsing, the button becomes Expand
    expect(screen.getByTitle('Expand')).toBeTruthy()
  })
})

describe('NotificationCenter Component', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [
        {
          id: 'notif-1',
          type: 'daily_reminder',
          category: 'reminders',
          slimeMood: 'daily',
          greeting: 'Hi Rohith! Daily Study Time',
          text: 'Practice 3 minutes now.',
          unread: true,
          link: '/reading',
          time: new Date().toISOString(),
        },
        {
          id: 'notif-2',
          type: 'srs_due',
          category: 'reviews',
          slimeMood: 'srs',
          greeting: 'Hi Rohith! Reviews Due',
          text: '5 cards waiting.',
          unread: false,
          link: '/review',
          time: new Date().toISOString(),
        },
      ],
    })
  })

  it('renders notification list with unread counter', () => {
    render(
      <BrowserRouter>
        <NotificationCenter isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    )

    expect(screen.getByText('Your Slime Mail')).toBeTruthy()
    expect(screen.getByText(/1 unread update/i)).toBeTruthy()
    expect(screen.getByText('Hi Rohith! Daily Study Time')).toBeTruthy()
    expect(screen.getByText('Hi Rohith! Reviews Due')).toBeTruthy()
  })

  it('marks all as read when clicking mark all read button', () => {
    render(
      <BrowserRouter>
        <NotificationCenter isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    )

    const markAllBtn = screen.getByTitle('Mark all as read')
    fireEvent.click(markAllBtn)

    const notifications = useNotificationStore.getState().notifications
    expect(notifications.every((n) => !n.unread)).toBe(true)
  })

  it('clears inbox when clicking Clear inbox button', () => {
    render(
      <BrowserRouter>
        <NotificationCenter isOpen={true} onClose={vi.fn()} />
      </BrowserRouter>
    )

    const clearBtn = screen.getByText('Clear inbox')
    fireEvent.click(clearBtn)

    const notifications = useNotificationStore.getState().notifications
    expect(notifications.length).toBe(0)
  })
})

describe('BrowserNotificationService', () => {
  it('detects notification support safely in test environment', () => {
    const supported = isNotificationSupported()
    expect(typeof supported).toBe('boolean')
  })

  it('returns valid permission status without throwing', () => {
    const perm = getNotificationPermission()
    expect(['granted', 'denied', 'default', 'unsupported']).toContain(perm)
  })
})
