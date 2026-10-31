// src/components/notifications/NotificationCenter.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Inspired Slime Notification Center
// Responsive panel for PC (dropdown popover) and Mobile (bottom/modal sheet)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCheck,
  X,
  BellRing,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../../store/notificationStore'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n } from '../../i18n'
import NotificationCard from './NotificationCard'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import SlimeNotificationMascot from './SlimeNotificationMascot'
import {
  getNotificationPermission,
  requestNotificationPermission,
} from '../../services/browserNotificationService'
import './NotificationCenter.css'

function timeAgo(isoString) {
  if (!isoString) return 'Just now'
  const diffMs = Date.now() - new Date(isoString).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(isoString).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'streaks', label: 'Streaks' },
  { id: 'milestones', label: 'Milestones' },
]

export default function NotificationCenter({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { t } = useI18n()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const panelRef = useRef(null)

  const notifications = useNotificationStore((s) => s.notifications)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const snooze = useNotificationStore((s) => s.snooze)
  const dismiss = useNotificationStore((s) => s.dismiss)
  const clearNotifications = useNotificationStore((s) => s.clearNotifications)

  const [activeCategory, setActiveCategory] = useState('all')
  const [browserPerm, setBrowserPerm] = useState(getNotificationPermission())

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  )

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications
    return notifications.filter((n) => {
      const cat = n.category || n.type || 'general'
      if (activeCategory === 'reminders') return cat.includes('reminder')
      if (activeCategory === 'reviews') return cat.includes('review') || cat.includes('srs')
      if (activeCategory === 'streaks') return cat.includes('streak')
      if (activeCategory === 'milestones')
        return (
          cat.includes('badge') ||
          cat.includes('achievement') ||
          cat.includes('level') ||
          cat.includes('goal') ||
          cat.includes('milestone')
        )
      return true
    })
  }, [notifications, activeCategory])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleNavigate = (path) => {
    onClose()
    if (path) navigate(path)
  }

  const handleSnooze = (id) => {
    snooze(id, 2)
    toast.success('Slime will remind you in 2 hours! ⏰', {
      icon: '🟢',
      style: {
        borderRadius: '16px',
        background: '#1a2419',
        color: '#bef264',
        border: '1px solid rgba(190, 242, 100, 0.2)',
      },
    })
  }

  const handleEnableBrowserNotifications = async () => {
    const res = await requestNotificationPermission()
    setBrowserPerm(res)
    if (res === 'granted') {
      toast.success('Desktop study alerts enabled! 🔔', {
        icon: '✨',
        style: {
          borderRadius: '16px',
          background: '#1a2419',
          color: '#bef264',
          border: '1px solid rgba(190, 242, 100, 0.2)',
        },
      })
    } else if (res === 'denied') {
      toast('Notifications blocked in browser settings', { icon: 'ℹ️' })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Kando Slime notifications"
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="kando-notification-panel"
      >
        {/* ── HEADER ── */}
        <header className="kando-notification-header">
          <div className="kando-notification-heading-icon" aria-hidden="true">
            <KandoSlimeLogo size={32} animated />
          </div>

          <div className="kando-notification-heading-copy">
            <h2>{t('nav.slime_mail', displayLanguage, 'Your Slime Mail')}</h2>
            <p>
              {unreadCount > 0
                ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}`
                : 'Your Japanese world, all caught up'}
            </p>
          </div>

          <div className="kando-notification-header-actions">
            {/* Desktop Notification Enable Prompt if not yet granted */}
            {browserPerm === 'default' && (
              <button
                type="button"
                className="kando-notification-icon-action"
                onClick={handleEnableBrowserNotifications}
                aria-label="Enable browser notifications"
                title="Enable desktop alerts"
              >
                <BellRing size={16} />
              </button>
            )}

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                type="button"
                className="kando-notification-icon-action"
                onClick={markAllRead}
                aria-label="Mark all notifications as read"
                title="Mark all as read"
              >
                <CheckCheck size={16} />
              </button>
            )}

            {/* Go to Settings */}
            <button
              type="button"
              className="kando-notification-icon-action"
              onClick={() => handleNavigate('/settings')}
              aria-label="Notification settings"
              title="Notification settings"
            >
              <Settings size={15} />
            </button>

            {/* Close */}
            <button
              type="button"
              className="kando-notification-icon-action"
              onClick={onClose}
              aria-label="Close notifications"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* ── CATEGORY PILL STRIP ── */}
        {notifications.length > 2 && (
          <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-1 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40 shadow-sm'
                    : 'bg-white/5 text-neutral-400 hover:text-neutral-200 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* ── SUMMARY COUNTER ── */}
        {notifications.length > 0 && (
          <div className="kando-notification-summary">
            <span className="kando-notification-live-dot" />
            <span>Learning Updates</span>
            <span className="kando-notification-summary-count">{filteredNotifications.length}</span>
          </div>
        )}

        {/* ── NOTIFICATION CARDS LIST ── */}
        <div className="kando-notification-list" aria-live="polite">
          {filteredNotifications.length === 0 ? (
            <div className="kando-notification-empty">
              <div className="kando-empty-slime" aria-hidden="true">
                <SlimeNotificationMascot mood="achievement" size={72} />
              </div>
              <h3>All squished up to date!</h3>
              <p>
                Your daily lessons, streak alerts, and SRS reviews will show up here when there's
                something new.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                timeAgoText={timeAgo(notif.time)}
                onNavigate={handleNavigate}
                onMarkRead={markRead}
                onDismiss={dismiss}
                onSnooze={handleSnooze}
              />
            ))
          )}
        </div>

        {/* ── FOOTER ── */}
        {notifications.length > 0 && (
          <footer className="kando-notification-footer">
            <span>
              Keep your Japanese flowing <span aria-hidden="true">💚</span>
            </span>
            <button
              type="button"
              onClick={() => {
                clearNotifications()
                toast.success('Notification inbox cleared')
              }}
            >
              Clear inbox
            </button>
          </footer>
        )}
      </motion.section>
    </AnimatePresence>
  )
}
