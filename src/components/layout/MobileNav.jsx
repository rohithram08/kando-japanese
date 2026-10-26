// src/components/layout/MobileNav.jsx
// Bottom tab bar for mobile. A curated set of the most-used destinations,
// plus "More" which opens the full Sidebar drawer (Layout) — so every
// section is always reachable on mobile, not just the ones pinned here.

import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Menu } from 'lucide-react'
import { getSection } from '../../config/sections'
import { useSettingsStore } from '../../store/settingsStore'
import { useProgressStore } from '../../store/progressStore'
import { t } from '../../i18n'

const PINNED_IDS = ['reading', 'review', 'kanji', 'conversation']

export default function MobileNav({ onMoreClick }) {
  const displayLanguage = useSettingsStore((s) => s.displayLanguage)
  const srsReviewsDue = useProgressStore((s) => s.srsReviewsDue || 0)

  const tabs = [
    { id: 'dashboard', to: '/dashboard', label: t('nav.dashboard', displayLanguage, 'Home'), Icon: LayoutDashboard },
    ...PINNED_IDS.map((id) => {
      const s = getSection(id)
      return {
        id: s.id,
        to: s.path,
        label: t('nav.' + s.id + '_short', displayLanguage, t('nav.' + s.id, displayLanguage, s.shortLabel || s.label)),
        Icon: s.icon,
        badge: s.id === 'review' && srsReviewsDue > 0 ? srsReviewsDue : null,
      }
    }),
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface flex items-stretch safe-area-bottom">
      {tabs.map(({ to, label, Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `flex-1 min-w-0 flex flex-col items-center justify-center py-2 px-0.5 gap-0.5 text-[10px] font-medium transition-colors relative ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-1 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm animate-pulse">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="max-w-full truncate whitespace-nowrap leading-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={onMoreClick}
        className="flex-1 min-w-0 flex flex-col items-center justify-center py-2 px-0.5 gap-0.5 text-[10px] font-medium text-muted-foreground"
        aria-label={t('nav.more', displayLanguage, 'More')}
      >
        <Menu className="w-5 h-5" />
        <span className="max-w-full truncate whitespace-nowrap leading-tight">{t('nav.more', displayLanguage, 'More')}</span>
      </button>
    </nav>
  )
}
