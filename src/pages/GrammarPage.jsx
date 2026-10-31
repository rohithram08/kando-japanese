// src/pages/GrammarPage.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BookMarked, Sparkles, Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { GRAMMAR, LEVEL_META, DATA_COUNTS } from '../data/index'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { useAuthStore } from '../store/authStore'
import { useProgressStore } from '../store/progressStore'
import LevelSelector from '../components/common/LevelSelector'
import { useLevelState } from '../hooks/useStudyLevel'
import ParticleStudio from '../components/grammar/ParticleStudio'
import {
  getCurriculumMeaning,
  normalizeLocale,
  useI18n,
} from '../i18n'
import { GRAMMAR_CATEGORIES, categorizeItems } from '../data/categories'
import CategoryGrid from '../components/curriculum/CategoryGrid'
import CategoryView from '../components/curriculum/CategoryView'
import GrammarDetailModal from '../components/curriculum/GrammarDetailModal'

// ── Single grammar card ───────────────────────────────────────
// LEVEL_META carries separate light/dark class strings (one literal pair
// per JLPT level) rather than the surface/foreground tokens, so this is
// one of the few spots that still resolves a theme flag — needed to pick
// the right precomputed pair, not to hand-roll new color logic.
const GrammarCard = React.forwardRef(function GrammarCard(
  { item, onOpenModal, progress, _onToggleStudied, _isSaving, _isGuest },
  ref
) {
  const { t } = useI18n()
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const showRomaji = useSettingsStore((s) => s.romaji)
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)
  const displayMeaning = getCurriculumMeaning(item, activeLang)
  const meta = LEVEL_META[item.level]

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => onOpenModal?.(item)}
      className="card transition-all hover:shadow-card-md hover:border-purple-300 dark:hover:border-purple-500/40 cursor-pointer group"
    >
      <div className="w-full text-left p-4 flex items-start gap-3">
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
          <p className="text-sm mt-0.5 text-muted-foreground">{displayMeaning}</p>
          {activeLang !== 'en' && item.meaning && item.meaning !== displayMeaning && (
            <p className="text-xs text-muted-foreground/60">{item.meaning}</p>
          )}
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

        <div className="shrink-0 flex items-center gap-2">
          {progress?.status === 'mastered' ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t('common.mastered', 'Mastered')}
            </span>
          ) : progress?.status === 'studied' ? (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              {t('common.studied', 'Studied')}
            </span>
          ) : null}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpenModal?.(item)
            }}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors border border-purple-500/20"
          >
            {t('common.details', 'View')}
          </button>
        </div>
      </div>
    </motion.div>
  )
})

// ── Page ──────────────────────────────────────────────────────
export default function GrammarPage() {
  const { t } = useI18n()
  const [level, setLevel, { unlocked }] = useLevelState()
  const [search, setSearch] = useState('')
  const [modalGrammar, setModalGrammar] = useState(null)
  const [showParticleStudio, setShowParticleStudio] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const user = useAuthStore((s) => s.user)
  const isGuest = !user?.id
  const { grammarProgress, loadGrammarProgress, recordGrammarProgress } = useProgressStore()
  const [savingMap, setSavingMap] = useState({})

  useEffect(() => {
    loadGrammarProgress(user?.id)
  }, [user?.id, loadGrammarProgress])

  const handleToggleStudied = useCallback(async (grammarId, targetStatus = 'studied') => {
    if (savingMap[grammarId]) return
    setSavingMap((prev) => ({ ...prev, [grammarId]: true }))
    try {
      const res = await recordGrammarProgress(user?.id, grammarId, targetStatus)
      if (res?.isGuest) {
        toast.success(
          targetStatus === 'mastered'
            ? 'Grammar marked as Mastered (Local only - sign in to sync)'
            : targetStatus === 'not_started'
              ? 'Grammar progress reset (Local only)'
              : 'Grammar marked as Studied (Local only - sign in to sync)'
        )
      } else if (res?.xpGained > 0) {
        toast.success(`Grammar studied! +${res.xpGained} XP 🎉`)
      } else {
        toast.success(
          targetStatus === 'mastered'
            ? 'Grammar marked as Mastered! ⭐'
            : targetStatus === 'not_started'
              ? 'Grammar progress reset'
              : 'Grammar pattern updated 👍'
        )
      }
    } catch (err) {
      console.error('Failed to update grammar progress:', err)
      toast.error('Failed to save grammar progress. Please try again.')
    } finally {
      setSavingMap((prev) => ({ ...prev, [grammarId]: false }))
    }
  }, [user?.id, savingMap, recordGrammarProgress])

  const meta = LEVEL_META[level]
  const levelGrammar = useMemo(() => GRAMMAR[level] || [], [level])

  const studiedCount = useMemo(() => {
    return levelGrammar.filter(
      (g) => grammarProgress[g.id]?.status === 'studied' || grammarProgress[g.id]?.status === 'mastered'
    ).length
  }, [levelGrammar, grammarProgress])

  const masteredCount = useMemo(() => {
    return levelGrammar.filter((g) => grammarProgress[g.id]?.status === 'mastered').length
  }, [levelGrammar, grammarProgress])

  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return levelGrammar.filter((g) => {
      const localizedMeaning = getCurriculumMeaning(g, activeLang).toLowerCase()
      const matchSearch =
        !q ||
        g.pattern.toLowerCase().includes(q) ||
        g.romaji.toLowerCase().includes(q) ||
        g.meaning.toLowerCase().includes(q) ||
        localizedMeaning.includes(q) ||
        g.explanation.toLowerCase().includes(q) ||
        g.tags?.some((t) => t.toLowerCase().includes(q))
      return matchSearch
    })
  }, [levelGrammar, search, activeLang])

  // ── Categorize grammar items ──
  const getMeaning = useCallback(
    (item) => getCurriculumMeaning(item, activeLang),
    [activeLang]
  )

  const categorizedMap = useMemo(
    () => categorizeItems(filtered, GRAMMAR_CATEGORIES, getMeaning, 'grammar'),
    [filtered, getMeaning]
  )

  const categorySearchFn = useCallback(
    (item, q) => {
      const localizedMeaning = getCurriculumMeaning(item, activeLang).toLowerCase()
      return (
        item.pattern.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        localizedMeaning.includes(q)
      )
    },
    [activeLang]
  )

  const currentCategoryDef = selectedCategory
    ? GRAMMAR_CATEGORIES.find((c) => c.id === selectedCategory) || null
    : null

  const handleLevelChange = useCallback((l) => {
    setLevel(l)
    setSearch('')
    setSelectedCategory(null)
  }, [setLevel])

  const renderGrammarCard = useCallback(
    (item) => (
      <GrammarCard
        key={item.id}
        item={item}
        onOpenModal={setModalGrammar}
        progress={grammarProgress[item.id]}
        onToggleStudied={handleToggleStudied}
        isSaving={Boolean(savingMap[item.id])}
        isGuest={isGuest}
      />
    ),
    [grammarProgress, handleToggleStudied, savingMap, isGuest]
  )

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
            <span className="text-sm font-medium opacity-90">{t('nav.grammar', 'Grammar Patterns')}</span>
          </div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm opacity-80 mt-1">{meta.description}</p>
          <div className="flex gap-4 mt-3 text-sm flex-wrap">
            <span className="opacity-90"><strong>{DATA_COUNTS.grammar[level]}</strong> {t('common.pattern', 'patterns')}</span>
            <span className="opacity-90"><strong>{studiedCount}</strong> {t('common.studied', 'studied')}</span>
            {masteredCount > 0 && <span className="opacity-90"><strong>{masteredCount}</strong> {t('common.mastered', 'mastered')} ⭐</span>}
            <span className="opacity-70">
              {filtered.length !== DATA_COUNTS.grammar[level] && `${filtered.length} ${t('common.complete', 'shown')}`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Particle Parallelism Studio Spotlight Banner */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                助詞パラレル道場 (Particle Parallelism Studio)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase">
                New
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Master Japanese particles through native Tamil (வேற்றுமை) and Hindi (कारक) SOV alignment!
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowParticleStudio((v) => !v)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            showParticleStudio
              ? 'bg-muted hover:bg-muted/80 text-foreground border border-border'
              : 'bg-primary text-white hover:opacity-90 shadow-sm shadow-primary/25'
          }`}
        >
          {showParticleStudio ? 'Close Studio' : 'Launch Particle Studio 助詞'}
        </button>
      </div>

      <AnimatePresence>
        {showParticleStudio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ParticleStudio />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <LevelSelector selected={level} onChange={handleLevelChange} counts={DATA_COUNTS.grammar} levels={unlocked} />

        {/* Global search — only when NOT drilled into a category */}
        {!selectedCategory && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-surface border-border focus-within:border-foreground/30 transition-colors">
            <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('common.search', 'Search pattern, meaning, or explanation…')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-xs text-muted-foreground hover:text-foreground">
                {t('kana.clear', 'Clear')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Category Grid or Category Detail View ── */}
      {selectedCategory ? (
        <CategoryView
          category={currentCategoryDef}
          items={categorizedMap.get(selectedCategory) || []}
          onBack={() => setSelectedCategory(null)}
          renderCard={renderGrammarCard}
          searchFn={categorySearchFn}
          searchPlaceholder={t('common.search', 'Search in this category…')}
        />
      ) : search ? (
        /* When searching globally, show flat results */
        <>
          <p className="text-sm text-muted-foreground">
            {filtered.length === 0 ? t('common.error', 'No patterns found') : `${filtered.length} ${t('common.pattern', 'patterns')}`}
          </p>

          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => renderGrammarCard(item))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 rounded-2xl border border-border text-muted-foreground">
                <BookMarked className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">{t('common.error', 'No patterns found')}</p>
                <p className="text-sm mt-1">{t('common.retry', 'Try adjusting your search query')}</p>
              </motion.div>
            )}
          </motion.div>
        </>
      ) : (
        /* Default: show category grid */
        <CategoryGrid
          categories={GRAMMAR_CATEGORIES}
          categorizedMap={categorizedMap}
          onSelect={setSelectedCategory}
        />
      )}

      {/* Pop-up Grammar Detail Learning Modal */}
      <GrammarDetailModal
        grammar={modalGrammar}
        isOpen={Boolean(modalGrammar)}
        onClose={() => setModalGrammar(null)}
        isStudied={
          modalGrammar &&
          (grammarProgress[modalGrammar.id]?.status === 'studied' ||
            grammarProgress[modalGrammar.id]?.status === 'mastered')
        }
        onToggleStudied={() => modalGrammar && handleToggleStudied(modalGrammar.id, 'studied')}
      />
    </div>
  )
}
