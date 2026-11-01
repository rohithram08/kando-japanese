// Pulls study alerts sent by other learners into the notification bell.
// Server is the source of truth: new (unread) alerts are copied into the local bell, then
// marked read on the server so they are delivered exactly once.
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { getAlertInbox, markAlertsRead } from '../api/users'

const POLL_MS = 60 * 1000

export function useAlertInbox() {
  const userId = useAuthStore((s) => s.user?.id)
  const upsert = useNotificationStore((s) => s.upsert)

  useEffect(() => {
    if (!userId) return undefined
    let alive = true

    const pull = async () => {
      if (document.visibilityState === 'hidden') return
      try {
        const { alerts } = await getAlertInbox()
        const fresh = alerts.filter((a) => !a.read)
        if (!alive || fresh.length === 0) return
        fresh.forEach((a) => {
          upsert({
            id: `peer-alert-${a.id}`,
            type: 'peer_alert',
            category: 'friends',
            slimeMood: 'daily',
            icon: a.icon,
            time: a.createdAt,
            greeting: `${a.sender.name} sent you a note`,
            title: `${a.icon} ${a.sender.name}`,
            text: a.text,
            link: `/profile/${a.sender.id}`,
            primaryAction: { label: 'View profile', link: `/profile/${a.sender.id}` },
          })
        })
        await markAlertsRead(fresh.map((a) => a.id))
      } catch {
        // Optional feature: stay silent and retry on the next tick.
      }
    }

    pull()
    const interval = setInterval(pull, POLL_MS)
    document.addEventListener('visibilitychange', pull)
    window.addEventListener('focus', pull)
    return () => {
      alive = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', pull)
      window.removeEventListener('focus', pull)
    }
  }, [userId, upsert])
}
