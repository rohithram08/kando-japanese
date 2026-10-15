// src/components/layout/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X, Flame } from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../i18n'
import { LEVEL_META } from '../../data/levels'
import { SECTIONS, TINTS, sectionsByGroup } from '../../config/sections'

const GROUPS = [
  { key: 'learn', label: 'Learn' },
  { key: 'practice', label: 'Practice' },
  { key: 'journey', label: 'Your Journey' },
]

function NavItem({ section, collapsed }) {
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const tint = TINTS[section.tint]
  const Icon = section.icon
  const label = t('nav.' + section.id, displayLanguage, section.label)
  return (
    <NavLink
      to={section.path}
      className={({ isActive }) => `nav-link relative group ${collapsed ? 'justify-center px-0' : ''} ${
        isActive ? 'nav-link-active' : ''
      }`}
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? tint.iconText : ''}`} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
          {!collapsed && isActive && (
            <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary/60" />
          )}
          {/* Tooltip when collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 rounded-lg text-xs font-medium
                             pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity
                             whitespace-nowrap z-50 shadow-lg bg-gray-900 text-white dark:bg-gray-700">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  )
}

/**
 * Props:
 *  - collapsed, onToggleCollapse  → desktop rail (240px ↔ 64px), state lives in Layout
 *  - isMobileDrawer, onClose      → when rendered inside the mobile slide-out drawer
 */
export default function Sidebar({ collapsed = false, onToggleCollapse, isMobileDrawer = false, onClose }) {
  const { profile } = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const isDark = resolvedTheme === 'dark'
  const { totalXP, jlptLevel, streak, userLevel } = useProgressStore()

  const levelMeta = LEVEL_META[jlptLevel] || LEVEL_META.N5
  const effectiveCollapsed = isMobileDrawer ? false : collapsed

  return (
    <aside
      className={`
        flex flex-col h-full shrink-0 overflow-hidden border-r border-border bg-surface
        ${isMobileDrawer ? 'w-[260px] shadow-2xl' : 'hidden md:flex w-full'}
      `}
    >
      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
          <span className="text-white text-sm font-bold">日</span>
        </div>
        <AnimatePresence>
          {!effectiveCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-sm leading-tight text-foreground">Nihongo Master</p>
              <p className="text-xs text-muted-foreground">JLPT Prep Platform</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isMobileDrawer ? (
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="ml-auto p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
        )}
      </div>

      {/* ── User mini-profile ── */}
      {!effectiveCollapsed && (
        <div className={`mx-3 my-3 p-3 rounded-xl border ${
          isDark ? `${levelMeta.darkBg} ${levelMeta.darkBorder}` : `${levelMeta.lightBg} ${levelMeta.lightBorder}`
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-gradient-to-br ${levelMeta.gradient} text-white`}>
              {jlptLevel}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${isDark ? levelMeta.darkText : levelMeta.lightText}`}>
                {profile?.display_name || profile?.username || 'Student'}
              </p>
              <p className="text-xs text-muted-foreground">
                Lv.{userLevel} · {totalXP.toLocaleString()} XP
              </p>
            </div>
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-bold text-orange-500 shrink-0">
                <Flame className="w-3 h-3 fill-orange-500" />{streak}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Nav sections ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        <div className="space-y-0.5">
          <NavItem section={SECTIONS[0]} collapsed={effectiveCollapsed} />
        </div>
        {GROUPS.map((group) => {
          const items = sectionsByGroup(group.key)
          if (!items.length) return null
          return (
            <div key={group.key}>
              <AnimatePresence>
                {!effectiveCollapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold uppercase tracking-wider px-3 mb-1 text-muted-foreground/70"
                  >
                    {t('nav.' + group.key, displayLanguage, group.label)}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {items.map((section) => (
                  <NavItem key={section.id} section={section} collapsed={effectiveCollapsed} />
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Bottom XP bar ── */}
      {!effectiveCollapsed && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              {t('common.level', displayLanguage, 'Level')} {userLevel}
            </span>
            <span className="text-xs font-medium text-foreground">
              {t('common.xp', displayLanguage, { count: totalXP.toLocaleString() }, `${totalXP.toLocaleString()} XP`)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${levelMeta.gradient}`}
              animate={{ width: `${Math.min((totalXP % 1000) / 10, 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}
    </aside>
  )
}
