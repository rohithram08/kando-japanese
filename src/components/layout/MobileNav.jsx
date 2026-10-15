// src/components/layout/MobileNav.jsx
// Bottom tab bar for mobile. A curated set of the most-used destinations,
// plus "More" which opens the full Sidebar drawer (Layout) — so every
// section is always reachable on mobile, not just the ones pinned here.

import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Menu } from 'lucide-react'
import { getSection } from '../../config/sections'
import { useSettingsStore } from '../../store/settingsStore'
import { t } from '../../i18n'

const PINNED_IDS = ['lessons', 'review', 'kanji', 'conversation']

export default function MobileNav({ onMoreClick }) {
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)

  const tabs = [
    { to: '/dashboard', label: t('nav.dashboard', displayLanguage, 'Home'), Icon: LayoutDashboard },
    ...PINNED_IDS.map((id) => {
      const s = getSection(id)
      return {
        to: s.path,
        label: t('nav.' + s.id, displayLanguage, s.shortLabel || s.label),
        Icon: s.icon,
      }
    }),
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface flex items-stretch safe-area-bottom">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {({ isActive }) => (
            <>
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onMoreClick}
        className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium text-muted-foreground"
        aria-label={t('nav.more', displayLanguage, 'More')}
      >
        <Menu className="w-5 h-5" />
        <span>{t('nav.more', displayLanguage, 'More')}</span>
      </button>
    </nav>
  )
}
