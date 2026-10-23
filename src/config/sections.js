// src/config/sections.js
//
// Single source of truth for every section of the platform: its icon,
// its color identity, its route, and its copy. Sidebar, MobileNav, Navbar
// and the Dashboard all read from this file instead of each maintaining
// their own (and inevitably drifting-out-of-sync) lists.
//
// Adding a new section to the app = adding one entry here. Everything
// else (nav links, dashboard tiles, page titles) updates automatically.

import {
  LayoutDashboard, BookOpen, BookMarked, Languages, Layers,
  Swords, RefreshCw, MessageCircle, Bot, Mic,
  Trophy, BarChart2, Settings, Sparkles, BookA,
} from 'lucide-react'

// ── Tint palette ─────────────────────────────────────────────
// Every class string below is written out in full (never built with
// template interpolation) so Tailwind's content scanner can see it and
// keep it in the production CSS. Each tint carries everything a card,
// badge, or nav icon needs in both themes — no isDark ternaries required.
export const TINTS = {
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-500/10',
    iconText: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/15',
    hoverBorder: 'hover:border-blue-200 dark:hover:border-blue-900/70',
    gradient: 'from-blue-400 to-blue-600',
    solidText: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  indigo: {
    iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
    iconText: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-500/15',
    hoverBorder: 'hover:border-indigo-200 dark:hover:border-indigo-900/70',
    gradient: 'from-indigo-400 to-indigo-600',
    solidText: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  red: {
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    iconText: 'text-red-600 dark:text-red-400',
    ring: 'ring-red-500/15',
    hoverBorder: 'hover:border-red-200 dark:hover:border-red-900/70',
    gradient: 'from-red-400 to-red-600',
    solidText: 'text-red-600 dark:text-red-400',
    dot: 'bg-red-500',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/15',
    hoverBorder: 'hover:border-emerald-200 dark:hover:border-emerald-900/70',
    gradient: 'from-emerald-400 to-emerald-600',
    solidText: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  violet: {
    iconBg: 'bg-violet-50 dark:bg-violet-500/10',
    iconText: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-500/15',
    hoverBorder: 'hover:border-violet-200 dark:hover:border-violet-900/70',
    gradient: 'from-violet-400 to-violet-600',
    solidText: 'text-violet-600 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  orange: {
    iconBg: 'bg-orange-50 dark:bg-orange-500/10',
    iconText: 'text-orange-600 dark:text-orange-400',
    ring: 'ring-orange-500/15',
    hoverBorder: 'hover:border-orange-200 dark:hover:border-orange-900/70',
    gradient: 'from-orange-400 to-orange-600',
    solidText: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    ring: 'ring-cyan-500/15',
    hoverBorder: 'hover:border-cyan-200 dark:hover:border-cyan-900/70',
    gradient: 'from-cyan-400 to-cyan-600',
    solidText: 'text-cyan-600 dark:text-cyan-400',
    dot: 'bg-cyan-500',
  },
  teal: {
    iconBg: 'bg-teal-50 dark:bg-teal-500/10',
    iconText: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-500/15',
    hoverBorder: 'hover:border-teal-200 dark:hover:border-teal-900/70',
    gradient: 'from-teal-400 to-teal-600',
    solidText: 'text-teal-600 dark:text-teal-400',
    dot: 'bg-teal-500',
  },
  rose: {
    iconBg: 'bg-rose-50 dark:bg-rose-500/10',
    iconText: 'text-rose-600 dark:text-rose-400',
    ring: 'ring-rose-500/15',
    hoverBorder: 'hover:border-rose-200 dark:hover:border-rose-900/70',
    gradient: 'from-rose-400 to-rose-600',
    solidText: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-500/10',
    iconText: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/15',
    hoverBorder: 'hover:border-amber-200 dark:hover:border-amber-900/70',
    gradient: 'from-amber-400 to-amber-600',
    solidText: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  yellow: {
    iconBg: 'bg-yellow-50 dark:bg-yellow-500/10',
    iconText: 'text-yellow-600 dark:text-yellow-400',
    ring: 'ring-yellow-500/15',
    hoverBorder: 'hover:border-yellow-200 dark:hover:border-yellow-900/70',
    gradient: 'from-yellow-400 to-amber-500',
    solidText: 'text-yellow-600 dark:text-yellow-400',
    dot: 'bg-yellow-500',
  },
  purple: {
    iconBg: 'bg-purple-50 dark:bg-purple-500/10',
    iconText: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/15',
    hoverBorder: 'hover:border-purple-200 dark:hover:border-purple-900/70',
    gradient: 'from-purple-400 to-purple-600',
    solidText: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
  },
}

// ── Sections ─────────────────────────────────────────────────
// group: 'learn' | 'practice' | 'journey'  (drives Sidebar grouping)
// statKey: optional key into the live stats object passed to <SectionGrid>
export const SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    tint: 'red',
    group: null, // rendered separately, not part of the grids
    description: 'Your home base',
  },
  {
    id: 'kana',
    label: 'Kana Studio',
    shortLabel: 'Kana',
    path: '/kana',
    icon: Sparkles,
    tint: 'rose',
    group: 'learn',
    description: 'Master Hiragana & Katakana from zero',
    statKey: 'kanaLearned',
    statLabel: 'mastered',
  },
  {
    id: 'reading',
    label: 'Graded Reader',
    shortLabel: 'Graded Reader',
    path: '/reading',
    icon: BookOpen,
    tint: 'teal',
    group: 'learn',
    description: 'Learn Japanese naturally through graded stories with vocabulary, grammar, and quizzes',
    statKey: 'lessonsCompleted',
    statLabel: 'completed',
  },
  {
    id: 'grammar',
    label: 'Grammar',
    shortLabel: 'Grammar',
    path: '/grammar',
    icon: BookMarked,
    tint: 'indigo',
    group: 'learn',
    description: 'Patterns, particles & sentence structure',
  },
  {
    id: 'kanji',
    label: 'Kanji',
    shortLabel: 'Kanji',
    path: '/kanji',
    icon: Languages,
    tint: 'red',
    group: 'learn',
    description: 'Stroke order, readings & mnemonics',
    statKey: 'kanjiLearned',
    statLabel: 'learned',
  },
  {
    id: 'vocabulary',
    label: 'Vocabulary',
    shortLabel: 'Vocab',
    path: '/vocabulary',
    icon: Layers,
    tint: 'emerald',
    group: 'learn',
    description: 'Build your word bank with flashcards',
    statKey: 'vocabLearned',
    statLabel: 'learned',
  },
  {
    id: 'dictionary',
    label: 'Dictionary',
    shortLabel: 'Dictionary',
    path: '/dictionary',
    icon: BookA,
    tint: 'teal',
    group: 'learn',
    description: 'Smart bidirectional Japanese dictionary with multi-language meanings & examples',
  },
  {
    id: 'review',
    label: 'SRS Review',
    shortLabel: 'Review',
    path: '/review',
    icon: RefreshCw,
    tint: 'orange',
    group: 'practice',
    description: 'Spaced-repetition flashcard review',
    statKey: 'srsReviewsDue',
    statLabel: 'due now',
    urgent: true, // highlight when statKey > 0
  },
  {
    id: 'sensei',
    label: 'Hana-sensei',
    shortLabel: 'Sensei',
    path: '/sensei',
    icon: Sparkles,
    tint: 'purple',
    group: 'practice',
    description: '3D AI teacher studio with speech & guidance',
  },
  {
    id: 'conversation',
    label: 'Conversation Practice',
    shortLabel: 'Conversation',
    path: '/conversation',
    icon: MessageCircle,
    tint: 'cyan',
    group: 'practice',
    description: 'Scenario role-play & open AI conversation practice',
  },
  {
    id: 'speech',
    label: 'Speech Practice',
    shortLabel: 'Speech',
    path: '/speech',
    icon: Mic,
    tint: 'amber',
    group: 'practice',
    description: 'Pronunciation practice out loud',
  },
  {
    id: 'achievements',
    label: 'Achievements',
    shortLabel: 'Awards',
    path: '/achievements',
    icon: Trophy,
    tint: 'yellow',
    group: 'journey',
    description: 'Personal records & Slime Sticker awards',
  },
  {
    id: 'settings',
    label: 'Settings',
    shortLabel: 'Settings',
    path: '/settings',
    icon: Settings,
    tint: 'blue',
    group: 'journey',
    description: 'Account, preferences & notifications',
  },
]

export const getSection = (id) => {
  if (id === 'chat' || id === 'chat-dojo') return SECTIONS.find((s) => s.id === 'conversation')
  return SECTIONS.find((s) => s.id === id)
}
export const getSectionByPath = (path) =>
  SECTIONS.find((s) => s.path === path || path.startsWith(s.path + '/'))

export const sectionsByGroup = (group) => SECTIONS.filter((s) => s.group === group)

// Friendly fallback used by Navbar/page headers for routes with no exact match
// (e.g. nested routes like /lessons/N5/3 or /profile/:userId)
export const DEFAULT_PAGE_META = { label: 'Kando Japanese', icon: Sparkles, tint: 'red' }
