import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Zap, Star, Flame, Menu, LogOut } from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import ThemeToggle from '../ui/ThemeToggle'
import { getSectionByPath, DEFAULT_PAGE_META, TINTS } from '../../config/sections'
import toast from 'react-hot-toast'

// ── Avatar data (same as ProfilePage) ───────────────────────
const AVATARS = [
  { id: 'avatar-1', emoji: '🥷', bg: 'from-gray-700 to-gray-900' },
  { id: 'avatar-2', emoji: '🎌', bg: 'from-red-400 to-red-600' },
  { id: 'avatar-3', emoji: '🌸', bg: 'from-pink-400 to-pink-600' },
  { id: 'avatar-4', emoji: '⛩️', bg: 'from-orange-400 to-red-500' },
  { id: 'avatar-5', emoji: '🐉', bg: 'from-green-500 to-emerald-700' },
  { id: 'avatar-6', emoji: '🗻', bg: 'from-blue-400 to-indigo-600' },
  { id: 'avatar-7', emoji: '🎎', bg: 'from-rose-400 to-rose-600' },
  { id: 'avatar-8', emoji: '🍣', bg: 'from-amber-400 to-orange-500' },
  { id: 'avatar-9', emoji: '🎋', bg: 'from-emerald-400 to-teal-600' },
  { id: 'avatar-10', emoji: '🏯', bg: 'from-yellow-500 to-amber-600' },
  { id: 'avatar-11', emoji: '🎐', bg: 'from-cyan-400 to-blue-500' },
  { id: 'avatar-12', emoji: '🐱', bg: 'from-violet-400 to-purple-600' },
  { id: 'avatar-13', emoji: '👺', bg: 'from-red-600 to-red-800' },
  { id: 'avatar-14', emoji: '🦊', bg: 'from-orange-400 to-amber-500' },
  { id: 'avatar-15', emoji: '🎴', bg: 'from-indigo-500 to-purple-700' },
]

function getLevelColor(lvl) {
  if (lvl < 5) return 'from-gray-400 to-gray-600'
  if (lvl < 10) return 'from-green-400 to-emerald-600'
  if (lvl < 20) return 'from-blue-400 to-blue-600'
  if (lvl < 30) return 'from-purple-400 to-purple-600'
  if (lvl < 50) return 'from-orange-400 to-red-500'
  return 'from-yellow-400 to-amber-500'
}

// ── Relative time formatter for real notification timestamps ───
function timeAgo(isoString) {
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

const Navbar = ({ onMobileMenuToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { streak = 0, totalXP = 0, userLevel = 1 } = useProgressStore()
  const { user, profile, logout } = useAuthStore()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const notifications = useNotificationStore((s) => s.notifications)
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)
  const unreadCount = notifications.filter((n) => n.unread).length

  // ── Get user avatar ─────────────────────────────────────
  const getNavAvatar = () => {
    if (profile?.avatar_url) {
      return { type: 'image', src: profile.avatar_url }
    }
    if (profile?.avatar_id) {
      const av = AVATARS.find((a) => a.id === profile.avatar_id)
      if (av) return { type: 'emoji', emoji: av.emoji, bg: av.bg }
    }
    const letter = (profile?.username?.[0] || user?.email?.[0] || 'U').toUpperCase()
    return { type: 'letter', letter }
  }

  const navAvatar = getNavAvatar()
  const displayName = profile?.username || user?.email?.split('@')[0] || 'User'

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

  const handleNotificationClick = (n) => {
    markRead(n.id)
    setShowNotifications(false)
    if (n.link) navigate(n.link)
  }

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

  // Page title/icon — single source of truth via SECTIONS, so every route
  // automatically gets a correct title without a second hardcoded list.
  const meta = getSectionByPath(location.pathname) || DEFAULT_PAGE_META
  const PageIcon = meta.icon
  const pageTint = TINTS[meta.tint] || TINTS.red

  return (
    <nav className="w-full h-16 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* ── LEFT ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 min-w-0">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-border
                         bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground
                         transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`hidden sm:flex icon-badge w-8 h-8 ${pageTint.iconBg} flex-shrink-0`}>
              <PageIcon className={`w-4 h-4 ${pageTint.iconText}`} />
            </div>
            <h1 className="text-lg font-bold truncate text-foreground">{meta.label}</h1>
          </div>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-default border transition-colors ${
              streak > 0 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-muted border-border'
            }`}
          >
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span className={`font-bold text-sm ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {streak}
            </span>
          </motion.div>

          {/* XP */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 cursor-default border transition-colors ${
              totalXP > 0 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-muted border-border'
            }`}
          >
            <Zap className={`w-4 h-4 ${totalXP > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
            <span className={`font-bold text-sm ${totalXP > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
              {totalXP.toLocaleString()}
            </span>
          </motion.div>

          {/* Level */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`hidden md:flex items-center gap-1.5 bg-gradient-to-r ${getLevelColor(userLevel)} rounded-full px-3 py-1.5 shadow-md cursor-default`}
          >
            <Star className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold text-xs">Lv.{userLevel}</span>
          </motion.div>

          {/* Theme */}
          <div className="hidden md:block">
            <ThemeToggle variant="cycle" />
          </div>

          {/* ── Notifications ────────────────────────── */}
          <div className="relative" data-menu>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false) }}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-border
                         bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl overflow-hidden border border-border bg-surface z-50"
                >
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="font-semibold text-sm text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-primary hover:opacity-80 text-xs font-medium transition-opacity"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-border max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <Bell className="w-7 h-7 mx-auto mb-2 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">No notifications yet</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          We'll let you know about reviews, streaks, and badges here
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full text-left px-4 py-3 transition-colors hover:bg-muted ${n.unread ? 'bg-blue-500/5' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              {n.title && (
                                <p className={`text-sm font-semibold ${n.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {n.title}
                                </p>
                              )}
                              <p className={`text-sm ${n.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {n.text}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(n.time)}</p>
                            </div>
                            {n.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-border">
                      <button
                        onClick={() => useNotificationStore.getState().clearNotifications()}
                        className="text-center w-full text-xs py-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Profile Avatar with Dropdown ─────────── */}
          <div className="relative" data-menu>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false) }}
              className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border-2 border-transparent hover:border-primary/40 transition-all"
              aria-label="Profile menu"
            >
              {navAvatar.type === 'image' ? (
                <img src={navAvatar.src} alt="Profile" className="w-full h-full object-cover rounded-xl" />
              ) : navAvatar.type === 'emoji' ? (
                <div className={`w-full h-full flex items-center justify-center text-lg bg-gradient-to-br ${navAvatar.bg} rounded-xl`}>
                  {navAvatar.emoji}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-red-500 to-pink-600 rounded-xl">
                  {navAvatar.letter}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden border border-border bg-surface z-50"
                >
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                        {navAvatar.type === 'image' ? (
                          <img src={navAvatar.src} alt="Profile" className="w-full h-full object-cover" />
                        ) : navAvatar.type === 'emoji' ? (
                          <div className={`w-full h-full flex items-center justify-center text-xl bg-gradient-to-br ${navAvatar.bg}`}>
                            {navAvatar.emoji}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base font-bold text-white bg-gradient-to-br from-red-500 to-pink-600">
                            {navAvatar.letter}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate text-foreground">{displayName}</p>
                        <p className="text-xs truncate text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {[
                      { label: 'My Profile', emoji: '👤', path: '/profile' },
                      { label: 'Progress', emoji: '📈', path: '/progress' },
                      { label: 'Achievements', emoji: '🏆', path: '/achievements' },
                      { label: 'Settings', emoji: '⚙️', path: '/settings' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => {
                          setShowProfileMenu(false)
                          navigate(item.path)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          location.pathname === item.path
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-base">{item.emoji}</span>
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar