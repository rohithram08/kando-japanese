// src/services/browserNotificationService.js
// ─────────────────────────────────────────────────────────────────────────────
// Safe, Permission-Aware Browser & Desktop Notifications
// Adheres to web standards: never spams, requests permission on user action only
// ─────────────────────────────────────────────────────────────────────────────

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch (err) {
    console.warn('[NotificationService] Failed to request permission:', err)
    return 'default'
  }
}

export function sendBrowserNotification({
  title,
  body,
  icon = '/favicon.svg',
  tag,
  url,
  requireInteraction = false,
}) {
  if (!isNotificationSupported()) return null
  if (Notification.permission !== 'granted') return null

  try {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      tag: tag || 'kando-notification',
      requireInteraction,
    })

    notification.onclick = (e) => {
      e.preventDefault()
      try {
        window.focus()
        if (url) {
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            // Internal router navigation
            const basePath = window.location.pathname
            if (basePath !== url) {
              window.history.pushState(null, '', url)
              window.dispatchEvent(new PopStateEvent('popstate'))
            }
          }
        }
      } catch (err) {
        console.error('[NotificationService] Click navigation error:', err)
      }
      notification.close()
    }

    return notification
  } catch (err) {
    console.warn('[NotificationService] Failed to create desktop notification:', err)
    return null
  }
}
