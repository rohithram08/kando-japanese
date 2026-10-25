import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Volume2, ChevronDown, ChevronUp, Layers, BookmarkPlus, Check } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { useSRSStore } from '../store/srsStore'
import { audioService } from '../services/audioService'
import { VOCABULARY, LEVEL_META, DATA_COUNTS } from '../data/index'
import LevelSelector from '../components/common/LevelSelector'
import { useLevelState } from '../hooks/useStudyLevel'
import FuriganaText from '../components/common/FuriganaText'
import PitchContourVisualizer from '../components/pitch/PitchContourVisualizer'
import { getPitchAccent } from '../data/pitch/pitchData'
import { getCurriculumMeaning, getCurriculumTranslation, normalizeLocale, t } from '../i18n'

// ── Single vocab card ─────────────────────────────────────────
// (LEVEL_META carries precomputed light/dark class pairs, so this one
// still resolves isDark — see the note on GrammarCard for why.)
const VocabCard = React.forwardRef(function VocabCard({ item }, ref) {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const showRomaji = useSettingsStore((s) => s.romaji)
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)
  const displayMeaning = getCurriculumMeaning(item, activeLang)
  const translationEntry = getCurriculumTranslation(item.id, activeLang)
  const { isCardInSRS, addCardToSRS } = useSRSStore()
  const [expanded, setExpanded] = useState(false)
  const meta = LEVEL_META[item.level] || LEVEL_META['N5']
  const pitchInfo = getPitchAccent(item.word, item.reading)
  const hasExpandableContent = Boolean(item.example?.jp || pitchInfo)

  const inDeck = isCardInSRS(item.id || item.word)

  const speak = (text) => audioService.speak(text)

  const handleAddToSRS = (e) => {
    e.stopPropagation()
    addCardToSRS('vocabulary', item.id || item.word, item.word)
  }

  return (
    <motion.div ref={ref} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-4 hover:shadow-card-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <FuriganaText word={item.word} reading={item.reading} size="lg" />
            {showRomaji && item.romaji && <span className="text-xs font-mono text-muted-foreground/70">{item.romaji}</span>}
            {pitchInfo && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {pitchInfo.patternMeta?.label || pitchInfo.pattern} [{pitchInfo.dropPosition}]
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
              isDark ? `${meta.darkBg} ${meta.darkBorder} ${meta.darkText}` : `${meta.lightBg} ${meta.lightBorder} ${meta.lightText}`
            }`}>
              {item.level}
            </span>
            {item.partOfSpeech && <span className="text-xs italic text-muted-foreground">{item.partOfSpeech}</span>}
          </div>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{displayMeaning}</p>
          {activeLang !== 'en' && item.meaning && item.meaning !== displayMeaning && (
            <p className="text-xs text-muted-foreground/60">{item.meaning}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleAddToSRS}
            title={inDeck ? 'In your SRS review deck' : 'Add to SRS review deck'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              inDeck
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 border border-purple-200 dark:border-purple-500/20'
            }`}
          >
            {inDeck ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.in_srs', activeLang, 'In SRS')}</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>+ SRS</span>
              </>
            )}
          </button>
          <button onClick={() => speak(item.word)} className="p-2 rounded-xl transition-colors bg-muted hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 text-muted-foreground">
            <Volume2 className="w-4 h-4" />
          </button>
          {hasExpandableContent && (
            <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-xl transition-colors bg-muted hover:bg-muted/70 text-muted-foreground">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasExpandableContent && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 pt-3 border-t border-border space-y-3">
            {item.example?.jp && (
              <div className="flex items-start gap-2">
                <button onClick={() => speak(item.example.jp)} className="mt-0.5 p-1 rounded-lg flex-shrink-0 transition-colors text-muted-foreground/70 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.example.jp}</p>
                  <p className="text-xs mt-0.5 text-muted-foreground">{translationEntry?.example_trans || item.example.en}</p>
                </div>
              </div>
            )}

            {pitchInfo && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Tokyo Pitch Accent
                </p>
                <PitchContourVisualizer word={item.word} reading={item.reading} showParticle={true} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

// ── Page ──────────────────────────────────────────────────────
export default function VocabularyPage() {
  const displayLanguage = useSettingsStore((s) => s.displayLanguage || s.nativeLanguage)
  const activeLang = normalizeLocale(displayLanguage)
  const [selectedLevel, setSelectedLevel, { unlocked }] = useLevelState()
  const [search, setSearch] = useState('')

  const meta = LEVEL_META[selectedLevel]
  const vocab = useMemo(() => VOCABULARY[selectedLevel] || [], [selectedLevel])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return vocab
    return vocab.filter((v) => {
      const locMeaning = getCurriculumMeaning(v, activeLang).toLowerCase()
      return (
        v.word.includes(search) ||
        v.reading.includes(search) ||
        v.meaning.toLowerCase().includes(q) ||
        locMeaning.includes(q) ||
        (v.meaning_ta || '').includes(search) ||
        (v.meaning_hi || '').includes(search)
      )
    })
  }, [vocab, search, activeLang])

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 opacity-90" />
            <span className="text-sm font-medium opacity-90">{t('nav.vocabulary', 'Vocabulary')}</span>
          </div>
          <h1 className="text-2xl font-bold">{meta.label}</h1>
          <p className="text-sm opacity-80 mt-1">{meta.description}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span className="opacity-90"><strong>{DATA_COUNTS.vocabulary[selectedLevel]}</strong> {t('nav.vocabulary', 'words')}</span>
            {filtered.length !== DATA_COUNTS.vocabulary[selectedLevel] && <span className="opacity-70">{filtered.length} shown</span>}
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <LevelSelector selected={selectedLevel} onChange={(l) => { setSelectedLevel(l); setSearch('') }} counts={DATA_COUNTS.vocabulary} levels={unlocked} />

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-surface border-border focus-within:border-foreground/30 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('common.search', 'Search word, reading, or meaning…')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
          />
          {search && <button onClick={() => setSearch('')} className="text-xs text-muted-foreground hover:text-foreground">{t('common.clear', 'Clear')}</button>}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} {t('nav.vocabulary', 'words')}</p>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => <VocabCard key={item.id} item={item} />)}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 rounded-2xl border border-border text-muted-foreground">
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">{t('common.no_results', 'No words found')}</p>
            <p className="text-sm mt-1">{t('common.try_different_search', 'Try a different search term')}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}