// src/components/layout/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { useProgressStore } from '../../store/progressStore'
import { useAuthStore } from '../../store/authStore'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../i18n'
import { LEVEL_META } from '../../data/levels'
import { SECTIONS, TINTS, sectionsByGroup } from '../../config/sections'
import { getUserLevelProgress } from '../../utils/progressCalculator'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'
import JellyStreakBadge from '../streak/JellyStreakBadge'
import { AnimatedLiquidWaveIcon } from '../common/WaveXPBadge'
import UserAvatar from '../common/UserAvatar'

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
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const { totalXP, jlptLevel, streak, userLevel, isStreakFrozen } = useProgressStore()

  const levelMeta = LEVEL_META[jlptLevel] || LEVEL_META.N5
  const effectiveCollapsed = isMobileDrawer ? false : collapsed

  const levelProgress = getUserLevelProgress(totalXP)

  return (
    <aside
      className={`
        flex flex-col h-full shrink-0 overflow-hidden bg-surface
        ${isMobileDrawer ? 'w-[260px] shadow-2xl' : 'hidden md:flex w-full'}
      `}
    >
      {/* ── Logo / Brand (seamless top bar integration without jarring divider line) ── */}
      <div className="h-16 flex items-center justify-between gap-3 px-4 border-b border-border/40 shrink-0">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity"
        >
          <KandoSlimeLogo size={32} animated className="shrink-0" />
          <AnimatePresence>
            {!effectiveCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden min-w-0"
              >
                <p className="font-bold text-sm leading-tight text-foreground whitespace-nowrap">
                  Kando Japanese
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap truncate">
                  JLPT Mastery Platform
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>

        {isMobileDrawer ? (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </button>
        )}
      </div>

      {/* ── Sidebar Body Container ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Nav sections ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
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

        {/* ── Bottom User & Wave XP Card ── */}
        {!effectiveCollapsed ? (
          <div className="p-3 border-t border-border/50 bg-surface">
            <NavLink
              to="/profile"
              className="block p-2.5 rounded-xl border border-border bg-surface-muted/60 hover:bg-surface-muted hover:border-foreground/20 transition-all group"
              title="View your profile & achievements"
            >
              {/* Row 1: User Avatar + JLPT badge + Name + Streak Pill */}
              <div className="relative flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative shrink-0">
                    <UserAvatar
                      profile={profile}
                      size="sm"
                      rounded="rounded-lg"
                      className="w-8 h-8 ring-1 ring-border shadow-2xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-bold bg-gradient-to-br ${levelMeta.gradient} text-white shadow-2xs leading-tight`}
                    >
                      {jlptLevel}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                      {profile?.display_name || profile?.username || 'Student'}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5 tabular-nums">
                      Lv.{userLevel} Adventurer
                    </p>
                  </div>
                </div>

                {streak > 0 && (
                  <JellyStreakBadge
                    streak={streak}
                    isFrozen={isStreakFrozen}
                    size="sm"
                    className="shrink-0 py-0.5 px-2"
                  />
                )}
              </div>

              {/* Row 2: Wave Icon + XP + Progress Bar */}
              <div className="relative pt-2 border-t border-border/50">
                <div className="flex items-center justify-between gap-1 text-[11px] mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AnimatedLiquidWaveIcon size={15} className="ring-1 ring-border shrink-0" />
                    <span className="font-bold font-mono tabular-nums text-foreground tracking-tight text-[11px]">
                      {totalXP.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-semibold uppercase text-muted-foreground">
                      Wave XP
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground shrink-0 font-mono tabular-nums">
                    {levelProgress.percent}%
                  </span>
                </div>

                {/* Clean Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(5, levelProgress.percent)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </NavLink>
          </div>
        ) : (
          <div className="p-2 border-t border-border/50 flex justify-center">
            <NavLink
              to="/profile"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-border hover:border-foreground/30 transition-colors"
              title={`${profile?.display_name || profile?.username || 'Student'} · Lv.${userLevel} (${totalXP} Wave XP)`}
            >
              <UserAvatar profile={profile} size="sm" rounded="rounded-xl" className="w-9 h-9" />
              <span className={`absolute -bottom-1 -right-1 px-1 rounded text-[7px] font-bold bg-gradient-to-br ${levelMeta.gradient} text-white shadow-2xs leading-tight`}>
                {jlptLevel}
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}
