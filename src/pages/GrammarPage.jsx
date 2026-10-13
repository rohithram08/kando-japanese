// src/pages/GrammarPage.jsx
import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ChevronDown, ChevronUp, BookMarked, Tag, Volume2, Sparkles,
} from 'lucide-react'
import { GRAMMAR, LEVEL_META, DATA_COUNTS } from '../data/index'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { audioService } from '../services/audioService'
import LevelSelector from '../components/common/LevelSelector'

// ── Tag filter chip ───────────────────────────────────────────
function TagChip({ tag, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? 'bg-red-500 border-red-500 text-white'
          : 'bg-muted border-border text-muted-foreground hover:border-foreground/30'
      }`}
    >
      {tag}
    </button>
  )
}

// ── Single grammar card ───────────────────────────────────────
// LEVEL_META carries separate light/dark class strings (one literal pair
// per JLPT level) rather than the surface/foreground tokens, so this is
// one of the few spots that still resolves a theme flag — needed to pick
// the right precomputed pair, not to hand-roll new color logic.
const GrammarCard = React.forwardRef(function GrammarCard({ item, isOpen, onToggle }, ref) {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const showRomaji = useSettingsStore((s) => s.romaji)
  const meta = LEVEL_META[item.level]

  const speak = (text) => audioService.speak(text)

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`card transition-shadow ${isOpen ? 'shadow-card-md' : ''}`}
    >
      <button onClick={onToggle} className="w-full text-left p-4 flex items-start gap-3 group">
        <span className={`mt-0.5 shrink-0 text-xs font-bold px-2 py-1 rounded-lg border ${
          isDark ? `${meta.darkBg} ${meta.darkBorder} ${meta.darkText}` : `${meta.lightBg} ${meta.lightBorder} ${meta.lightText}`
        }`}>
          {item.level}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-foreground">{item.pattern}</span>
            {item.romaji && showRomaji && <span className="text-sm font-mono text-muted-foreground">{item.romaji}</span>}
          </div>
          <p className="text-sm mt-0.5 text-muted-foreground">{item.meaning}</p>
          {item.tags?.length > 0 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {item.tags.map((t) => (
                <span key={t} className="text-xs px-1.5 py-0.5 rounded-md font-medium bg-muted text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 p-1.5 rounded-lg text-muted-foreground/70 group-hover:text-foreground transition-colors">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-border">
              {item.formation && (
                <div className="mt-3 px-3 py-2 rounded-xl text-sm font-mono bg-muted text-foreground">
                  <span className="text-xs font-sans font-medium uppercase tracking-wide mr-2 text-muted-foreground">
                    Formation
                  </span>
                  {item.formation}
                </div>
              )}

              {item.explanation && (
                <p className="text-sm leading-relaxed text-muted-foreground">{item.explanation}</p>
              )}

              {item.examples?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Examples</p>
                  {item.examples.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/60">
                      <button
                        onClick={() => speak(ex.jp)}
                        className="mt-0.5 p-1 rounded-lg shrink-0 transition-colors text-muted-foreground/70 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <div>
                        <p className="text-sm font-medium text-foreground">{ex.jp}</p>
                        <p className="text-xs mt-0.5 text-muted-foreground">{ex.en}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {item.notes && (
                <div className="flex gap-2 p-3 rounded-xl text-sm bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-100 dark:border-yellow-500/10 text-yellow-800 dark:text-yellow-300/80">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                  <p>{item.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// ── Page ──────────────────────────────────────────────────────
export default function GrammarPage() {
  const targetLevel = useSettingsStore((s) => s.jlptLevel)
  const [level, setLevel] = useState(targetLevel || 'N5')
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [openId, setOpenId] = useState(null)

  const meta = LEVEL_META[level]

  const allTags = useMemo(() => {
    const tags = new Set()
    GRAMMAR[level].forEach((g) => g.tags?.forEach((t) => tags.add(t)))
    return [...tags].sort()
  }, [level])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return GRAMMAR[level].filter((g) => {
      const matchSearch =
        !q ||
        g.pattern.toLowerCase().includes(q) ||
        g.romaji.toLowerCase().includes(q) ||
        g.meaning.toLowerCase().includes(q) ||
        g.explanation.toLowerCase().includes(q)
      const matchTag = !activeTag || g.tags?.includes(activeTag)
      return matchSearch && matchTag
    })
  }, [level, search, activeTag])

  const handleLevelChange = useCallback((l) => {
    setLevel(l)
    setSearch('')
    setActiveTag(null)
    setOpenId(null)
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 opacity-90" />
            <span className="text-sm font-medium opacity-90">Grammar Patterns</span>
          </div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm opacity-80 mt-1">{meta.description}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="opacity-90"><strong>{DATA_COUNTS.grammar[level]}</strong> patterns</span>
            <span className="opacity-70">
              {filtered.length !== DATA_COUNTS.grammar[level] && `${filtered.length} shown`}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <LevelSelector selected={level} onChange={handleLevelChange} counts={DATA_COUNTS.grammar} />

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-surface border-border focus-within:border-foreground/30 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pattern, meaning, or explanation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap items-center">
            <Tag className="w-3.5 h-3.5 shrink-0 text-muted-foreground/60" />
            <TagChip tag="All" active={!activeTag} onClick={() => setActiveTag(null)} />
            {allTags.map((t) => (
              <TagChip key={t} tag={t} active={activeTag === t} onClick={() => setActiveTag(activeTag === t ? null : t)} />
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length === 0 ? 'No patterns found' : `${filtered.length} pattern${filtered.length !== 1 ? 's' : ''}`}
      </p>

      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <GrammarCard key={item.id} item={item} isOpen={openId === item.id} onToggle={() => setOpenId(openId === item.id ? null : item.id)} />
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 rounded-2xl border border-border text-muted-foreground">
            <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No patterns found</p>
            <p className="text-sm mt-1">Try adjusting your search or tag filter</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}