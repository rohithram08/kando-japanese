import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Star, Menu, LogOut, Search, Keyboard, User, Trophy, Settings } from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import ThemeToggle from '../ui/ThemeToggle'
import LanguageSelector from '../common/LanguageSelector'
import { useSettingsStore } from '../../store/settingsStore'
import { useI18n } from '../../i18n'
import UserAvatar from '../common/UserAvatar'
import { normalizeProfile } from '../../utils/userIdentity'
import toast from 'react-hot-toast'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import JellyStreakBadge from '../streak/JellyStreakBadge'
import WaveXPBadge from '../common/WaveXPBadge'
import NotificationCenter from '../notifications/NotificationCenter'
import CommandPalette from '../common/CommandPalette'
import KeyboardShortcutsModal from '../common/KeyboardShortcutsModal'

const Navbar = ({ onMobileMenuToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const { streak = 0, totalXP = 0, userLevel = 1, isStreakFrozen = false } = useProgressStore()
  const { user, profile, logout } = useAuthStore()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false)

  // Global Keyboard Shortcuts (⌘K, Ctrl+K, /, ?)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const target = e.target
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        return
      }

      if (e.key === '?' && !isInput) {
        e.preventDefault()
        setShortcutsModalOpen((prev) => !prev)
        return
      }

      if (e.key === '/' && !isInput) {
        e.preventDefault()
        setCommandPaletteOpen(true)
        return
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  // One normalized identity (handles camelCase/snake_case) shared with every other screen
  const identity = normalizeProfile(profile, user)
  const displayName = identity.username

  // Close on route change
  useEffect(() => {
    setShowNotifications(false)
    setShowProfileMenu(false)
  }, [location.pathname])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-menu]')) {
        setShowNotifications(false)
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setShowProfileMenu(false)
    try {
      await logout()
      navigate('/login')
      toast.success('Signed out')
    } catch (err) {
      console.error('Logout failed:', err)
      toast.error('Failed to sign out')
    }
  }

  return (
    <nav className="w-full h-16 bg-surface/95 backdrop-blur-md border-b border-border/60 shadow-sm transition-colors duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* ── LEFT (Search / Command Palette & Mobile Menu) ── */}
        <div className="flex items-center gap-2.5">
          {onMobileMenuToggle && (
            <div className="flex items-center gap-2 shrink-0 md:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-border
                           bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground
                           transition-colors flex-shrink-0"
                aria-label="Toggle menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <KandoSlimeLogo size={28} animated />
            </div>
          )}

          {/* Desktop Search / Command Palette Pill */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80
                       bg-surface-muted/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground
                       text-xs font-medium transition-all shadow-2xs hover:border-primary/30 group cursor-pointer"
            title="Search sections, kanji, grammar, or vocabulary (Ctrl+K or ⌘K)"
            aria-label="Search or jump to"
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
            <span className="text-muted-foreground/80 group-hover:text-foreground">Search or jump to...</span>
            <kbd className="ml-1.5 font-mono text-[10px] bg-surface border border-border/80 px-1.5 py-0.5 rounded shadow-2xs text-muted-foreground">
              {typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="w-9 h-9 rounded-xl flex md:hidden items-center justify-center border border-border
                       bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground
                       transition-colors flex-shrink-0"
            title="Search or jump to (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* ── RIGHT (Essential controls: Streak, XP, Level, Translate, Theme, Notification, Profile) ── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 ml-auto">
          {/* Jelly Streak (2D Animated Slime) */}
          <JellyStreakBadge
            streak={streak}
            isFrozen={isStreakFrozen}
            size="sm"
            className="hidden sm:inline-flex"
          />

          {/* Wave XP (2D Animated Liquid Wave) */}
          <WaveXPBadge
            xp={totalXP}
            size="sm"
            className="hidden sm:inline-flex"
          />

          {/* Level */}
          <div
            title={`User Level: Lv.${userLevel}`}
            className="hidden md:flex items-center gap-1.5 bg-surface-muted border border-border rounded-full px-2.5 py-1 shadow-2xs cursor-default"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
            <span className="text-foreground font-semibold text-xs tabular-nums">Lv.{userLevel}</span>
          </div>

          {/* Language */}
          <div className="flex items-center">
            <LanguageSelector compact />
          </div>

          {/* Theme */}
          <div className="flex items-center">
            <ThemeToggle variant="cycle" />
          </div>

          {/* ── Notification Center ───────── */}
          <div className="relative" data-menu>
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfileMenu(false)
              }}
              className="kando-notification-trigger"
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
            >
              <Bell className="w-[17px] h-[17px]" />
              {unreadCount > 0 && (
                <motion.span
                  key={unreadCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  className="kando-notification-count tabular-nums"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </motion.span>
              )}
            </button>

            <NotificationCenter
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          {/* ── Profile Avatar with Dropdown ─────────── */}
          <div className="relative" data-menu>
            <button
              type="button"
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false) }}
              className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-border hover:border-foreground/30 transition-colors cursor-pointer"
              aria-label={t('nav.profile_menu', displayLanguage, 'Profile menu')}
            >
              <UserAvatar profile={identity} size="sm" className="!w-full !h-full" label={displayName} />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-card-lg overflow-hidden border border-border bg-surface z-50"
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <UserAvatar profile={identity} size="md" className="!w-11 !h-11" label={displayName} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate text-foreground" data-testid="profile-menu-username">{displayName}</p>
                        <p className="text-xs truncate text-muted-foreground tabular-nums" data-testid="profile-menu-level">
                          {identity.jlptLevel} · {t('common.level', displayLanguage, 'Level')} {userLevel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {[
                      { label: t('nav.my_profile', displayLanguage, 'My Profile'), Icon: User, path: '/profile' },
                      { label: t('nav.achievements', displayLanguage, 'Achievements'), Icon: Trophy, path: '/achievements' },
                      { label: t('nav.settings', displayLanguage, 'Settings'), Icon: Settings, path: '/settings' },
                    ].map(({ label, Icon, path }) => (
                      <button
                        key={path}
                        onClick={() => {
                          setShowProfileMenu(false)
                          navigate(path)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          location.pathname === path
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false)
                        setShortcutsModalOpen(true)
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Keyboard className="w-4 h-4 shrink-0" />
                        <span>Keyboard Shortcuts</span>
                      </div>
                      <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">?</kbd>
                    </button>
                  </div>

                  <div className="p-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout', displayLanguage, 'Log Out')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Senior-grade Command Palette & Shortcuts Modals ── */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />
    </nav>
  )
}

export default Navbar