// src/components/notifications/NotificationCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Duolingo-Inspired Tactile Slime Notification Card
// Features: Rounded dark surface, 2D Slime mascot, lime greeting, quick actions
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, ArrowRight, Clock, Check, X } from 'lucide-react'
import SlimeNotificationMascot from './SlimeNotificationMascot'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'

export default function NotificationCard({
  notification,
  onNavigate,
  onMarkRead,
  onDismiss,
  onSnooze,
  timeAgoText = 'Just now',
}) {
  const [isExpanded, setIsExpanded] = useState(notification.isExpanded !== false)

  const {
    id,
    type,
    greeting,
    title,
    text,
    unread,
    link,
    primaryAction,
    secondaryAction,
    slimeMood = 'daily',
  } = notification

  const handleCardClick = (e) => {
    // If clicking an action button, let that button handle it
    if (e.target.closest('button, a')) return
    if (onMarkRead && unread) onMarkRead(id)
    if (link && onNavigate) onNavigate(link)
  }

  const handlePrimaryAction = (e) => {
    e.stopPropagation()
    if (onMarkRead && unread) onMarkRead(id)
    const targetLink = primaryAction?.link || link
    if (targetLink && onNavigate) onNavigate(targetLink)
  }

  const handleSecondaryAction = (e) => {
    e.stopPropagation()
    if (secondaryAction?.action === 'snooze' && onSnooze) {
      onSnooze(id)
    } else if (onDismiss) {
      onDismiss(id)
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`kando-duo-notification-card ${unread ? 'is-unread' : 'is-read'} type-${type || 'general'}`}
      role="article"
      aria-label={title || greeting || 'Notification'}
    >
      {/* ── CARD HEADER: App Badge, Time, and Accordion Toggle ── */}
      <header className="kando-duo-header">
        <div className="kando-duo-app-badge">
          <div className="kando-duo-app-icon" aria-hidden="true">
            <KandoSlimeLogo size={18} />
          </div>
          <span className="kando-duo-app-name">Kando Japanese</span>
          <span className="kando-duo-dot">•</span>
          <span className="kando-duo-time">{timeAgoText}</span>
        </div>

        <div className="kando-duo-header-controls">
          {unread && (
            <span
              className="kando-duo-unread-badge"
              title="Unread"
              aria-label="Unread notification"
            />
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="kando-duo-expand-btn"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse notification' : 'Expand notification'}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </header>

      {/* ── CARD BODY: Mascot + Rich Greeting & Message ── */}
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="kando-duo-expanded-body"
          >
            <div className="kando-duo-content-grid">
              {/* Left Column: Expressive Slime Mascot */}
              <div className="kando-duo-mascot-col" aria-hidden="true">
                <SlimeNotificationMascot mood={slimeMood} size={62} />
              </div>

              {/* Right Column: Greeting + Body */}
              <div className="kando-duo-text-col">
                {greeting && (
                  <h3 className="kando-duo-greeting">
                    {greeting}
                  </h3>
                )}
                {title && title !== greeting && (
                  <h4 className="kando-duo-subhead">{title}</h4>
                )}
                <p className="kando-duo-message">{text}</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="kando-duo-actions">
              {secondaryAction && (
                <button
                  type="button"
                  onClick={handleSecondaryAction}
                  className="kando-duo-action-secondary"
                >
                  <Clock size={13} className="inline mr-1 opacity-70" />
                  {secondaryAction.label || 'Remind me later'}
                </button>
              )}

              {primaryAction ? (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="kando-duo-action-primary"
                >
                  <span>{primaryAction.label}</span>
                  <ArrowRight size={13} className="ml-1" />
                </button>
              ) : link ? (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="kando-duo-action-primary"
                >
                  <span>Open</span>
                  <ArrowRight size={13} className="ml-1" />
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : (
          /* Collapsed Preview */
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="kando-duo-collapsed-body"
          >
            <p className="kando-duo-collapsed-text">
              <span className="kando-duo-collapsed-greeting">{greeting || title}: </span>
              {text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
