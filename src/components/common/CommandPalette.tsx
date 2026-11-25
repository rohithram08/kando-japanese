// src/components/common/CommandPalette.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Global Command Palette (⌘K / Ctrl+K)
// Linear / Raycast-grade keyboard-first navigation and quick dictionary lookup.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BookOpen, Headphones, Sparkles, Languages, BookMarked,
  Layers, RefreshCw, MessageCircle, Bot, Trophy, Users, Award,
  User, Settings, Moon, Sun, Keyboard, ArrowRight, CornerDownLeft,
  X, Compass, BookA
} from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenShortcuts?: () => void
}

interface CommandItem {
  id: string
  title: string
  titleJp?: string
  description?: string
  category: 'curriculum' | 'practice' | 'community' | 'actions' | 'dictionary'
  icon: React.ComponentType<{ className?: string }>
  path?: string
  action?: () => void
  badge?: string
  keywords?: string[]
}

const STATIC_COMMANDS: CommandItem[] = [
  // ── Curriculum & Lessons ──
  {
    id: 'kana',
    title: 'Kana Studio',
    titleJp: '仮名スタジオ',
    description: 'Master Hiragana & Katakana stroke order, pronunciation & quizzes',
    category: 'curriculum',
    icon: Sparkles,
    path: '/kana',
    badge: 'N5 Zero',
    keywords: ['hiragana', 'katakana', 'alphabet', 'tracing', 'letters', 'characters'],
  },
  {
    id: 'reading',
    title: 'Graded Reader',
    titleJp: '多読・多聴',
    description: 'Bilingual stories with furigana, pitch accent, native audio & quiz',
    category: 'curriculum',
    icon: BookOpen,
    path: '/reading',
    badge: 'Stories',
    keywords: ['stories', 'tadoku', 'reading', 'audio', 'books', 'comprehension'],
  },
  {
    id: 'listening',
    title: 'Listening Dojo',
    titleJp: '聴解道場',
    description: 'JLPT audio dialogues, visual storyboards & Choukai exam simulators',
    category: 'curriculum',
    icon: Headphones,
    path: '/listening',
    badge: 'Choukai',
    keywords: ['audio', 'listening', 'choukai', 'dialogue', 'exam', 'practice'],
  },
  {
    id: 'kanji',
    title: 'Kanji Explorer',
    titleJp: '漢字マスター',
    description: 'Stroke orders, radical breakdowns, readings & memory mnemonics',
    category: 'curriculum',
    icon: Languages,
    path: '/kanji',
    badge: 'N5–N1',
    keywords: ['kanji', 'radicals', 'strokes', 'onyomi', 'kunyomi', 'hanzi'],
  },
  {
    id: 'grammar',
    title: 'Grammar Library',
    titleJp: '文法ガイド',
    description: 'Sentence structures, particles, conjugation tables & examples',
    category: 'curriculum',
    icon: BookMarked,
    path: '/grammar',
    badge: 'Rules',
    keywords: ['grammar', 'bunpou', 'particles', 'wa', 'ga', 'conjugations', 'verbs'],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary Bank',
    titleJp: '語彙バンク',
    description: 'JLPT core word lists with audio, example sentences & flashcards',
    category: 'curriculum',
    icon: Layers,
    path: '/vocabulary',
    badge: 'Flashcards',
    keywords: ['words', 'vocabulary', 'goi', 'flashcards', 'decks', 'terms'],
  },
  {
    id: 'dictionary',
    title: 'Japanese Dictionary',
    titleJp: '辞書検索',
    description: 'Lookup kanji, words, readings, and multilingual definitions',
    category: 'curriculum',
    icon: BookA,
    path: '/dictionary',
    badge: 'JMdict',
    keywords: ['dictionary', 'jisho', 'lookup', 'search', 'words', 'definitions', 'meanings'],
  },

  // ── Practice & Dialogue ──
  {
    id: 'review',
    title: 'Spaced Repetition Review',
    titleJp: 'SRS復習',
    description: 'Review due flashcards scheduled by the SM-2 memory algorithm',
    category: 'practice',
    icon: RefreshCw,
    path: '/review',
    badge: 'SRS',
    keywords: ['srs', 'review', 'flashcards', 'memory', 'spaced repetition', 'cards'],
  },
  {
    id: 'sensei',
    title: 'Hana-sensei 3D Studio',
    titleJp: '花先生 3D教室',
    description: 'Interactive Japanese teacher with live speech, expressions & guidance',
    category: 'practice',
    icon: Bot,
    path: '/sensei',
    badge: '3D Sensei',
    keywords: ['sensei', 'hana', 'teacher', '3d', 'companion', 'vrm', 'voice'],
  },
  {
    id: 'conversation',
    title: 'Conversation Dojo',
    titleJp: '会話道場',
    description: '49 real-world scenarios across dining, travel, keigo & open free talk',
    category: 'practice',
    icon: MessageCircle,
    path: '/conversation',
    badge: 'Roleplay',
    keywords: ['conversation', 'chat', 'roleplay', 'scenarios', 'speaking', 'kaiwa'],
  },

  // ── Community & Progress ──
  {
    id: 'leagues',
    title: 'Weekly Leagues',
    titleJp: 'リーグランキング',
    description: 'Weekly cohort leaderboards from Wakaba to Fuji League',
    category: 'community',
    icon: Trophy,
    path: '/leagues',
    badge: 'Leaderboard',
    keywords: ['league', 'rank', 'leaderboard', 'competition', 'weekly', 'cohort'],
  },
  {
    id: 'people',
    title: 'Learners Directory',
    titleJp: '学習者コミュニティ',
    description: 'Find fellow Japanese learners, view study streaks & follow classmates',
    category: 'community',
    icon: Users,
    path: '/people',
    badge: 'Social',
    keywords: ['people', 'learners', 'classmates', 'friends', 'community', 'follow'],
  },
  {
    id: 'achievements',
    title: 'Achievements & Badges',
    titleJp: '達成バッジ',
    description: 'Milestones, study streaks, slime stickers & personal records',
    category: 'community',
    icon: Award,
    path: '/achievements',
    badge: 'Awards',
    keywords: ['achievements', 'badges', 'stickers', 'records', 'milestones'],
  },
  {
    id: 'profile',
    title: 'My Profile',
    titleJp: 'マイプロフィール',
    description: 'View your JLPT level, study streak, avatar, and overall statistics',
    category: 'community',
    icon: User,
    path: '/profile',
    badge: 'Identity',
    keywords: ['profile', 'me', 'avatar', 'stats', 'progress', 'level', 'streak'],
  },

  // ── Actions & Preferences ──
  {
    id: 'settings',
    title: 'Platform Settings',
    titleJp: '設定',
    description: 'Customize theme, font size, language explanations & animations',
    category: 'actions',
    icon: Settings,
    path: '/settings',
    badge: 'Config',
    keywords: ['settings', 'preferences', 'theme', 'font', 'dark mode', 'audio'],
  },
]

export default function CommandPalette({ isOpen, onClose, onOpenShortcuts }: CommandPaletteProps) {
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useThemeStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Filter commands based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    const isDark = resolvedTheme === 'dark'

    const dynamicActions: CommandItem[] = [
      {
        id: 'toggle-theme',
        title: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
        titleJp: isDark ? 'ライトテーマへ切替' : 'ダークテーマへ切替',
        description: `Currently using ${isDark ? 'Dark' : 'Light'} theme`,
        category: 'actions',
        icon: isDark ? Sun : Moon,
        action: () => {
          toggleTheme()
          onClose()
        },
        badge: isDark ? 'Light Mode' : 'Dark Mode',
        keywords: ['theme', 'dark', 'light', 'mode', 'color'],
      },
      {
        id: 'keyboard-shortcuts',
        title: 'Keyboard Shortcuts',
        titleJp: 'キーボードショートカット',
        description: 'View all keyboard shortcuts for navigation, audio & quizzes',
        category: 'actions',
        icon: Keyboard,
        action: () => {
          onClose()
          onOpenShortcuts?.()
        },
        badge: 'Press ?',
        keywords: ['shortcuts', 'keys', 'hotkeys', 'keyboard', 'controls'],
      },
    ]

    const all = [...STATIC_COMMANDS, ...dynamicActions]

    if (!q) {
      return all
    }

    // If user typed a search term, create a dynamic dictionary lookup item at the top
    const dictionaryLookupItem: CommandItem = {
      id: 'dynamic-dict-lookup',
      title: `Look up "${query.trim()}" in Dictionary`,
      titleJp: `辞書で「${query.trim()}」を検索`,
      description: 'Search Japanese meanings, kanji readings, and contextual examples',
      category: 'dictionary',
      icon: BookA,
      path: `/dictionary?q=${encodeURIComponent(query.trim())}`,
      badge: 'Enter ↵',
      keywords: [query.toLowerCase()],
    }

    const matches = all.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchJp = item.titleJp?.toLowerCase().includes(q)
      const matchDesc = item.description?.toLowerCase().includes(q)
      const matchBadge = item.badge?.toLowerCase().includes(q)
      const matchKw = item.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchJp || matchDesc || matchBadge || matchKw
    })

    return [dictionaryLookupItem, ...matches]
  }, [query, resolvedTheme, toggleTheme, onClose, onOpenShortcuts])

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems.length])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Execute selected item
  const handleSelect = (item: CommandItem) => {
    if (item.action) {
      item.action()
    } else if (item.path) {
      navigate(item.path)
      onClose()
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = filteredItems[selectedIndex]
      if (selected) {
        handleSelect(selected)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md transition-all"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Search Input Row ─────────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border bg-surface-muted/30">
            <Search className="w-5 h-5 text-muted-foreground/70 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search sections, kanji, grammar, or type a Japanese word..."
              className="flex-1 bg-transparent border-0 text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0"
              aria-label="Search or jump to"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground/70 bg-muted rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* ── Results List ─────────────────────────────────────────── */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-border/30 focus:outline-none"
            role="listbox"
          >
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Compass className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40 stroke-1" />
                <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try searching for a JLPT level (N5, N4), section name, or English/Japanese term.
                </p>
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={item.id}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-foreground hover:bg-muted/60 border border-transparent'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground group-hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.title}</span>
                        {item.titleJp && (
                          <span className="font-japanese text-xs text-muted-foreground/80 opacity-90 hidden sm:inline">
                            {item.titleJp}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground/80 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 border ${
                          isSelected
                            ? 'bg-primary/20 text-primary border-primary/30'
                            : 'bg-muted/80 text-muted-foreground border-border/60'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    <div className="shrink-0 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isSelected ? (
                        <CornerDownLeft className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* ── Footer Keyboard Navigation Hint ──────────────────────── */}
          <div className="px-4 py-2 border-t border-border bg-surface-muted/40 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↑</kbd>
                <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">↵</kbd>
                <span className="ml-1">Select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">ESC</kbd>
                <span className="ml-1">Close</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/80 font-medium">
              <span>Kando Japanese</span>
              <span>•</span>
              <span className="font-japanese">感動日本語</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
