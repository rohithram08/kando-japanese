// The Conversation landing: pick HOW to practise (role-play or free talk), see
// where you left off, get a few picks for your level, then browse the rest.
// Nothing here talks to the AI — the chat only starts once you choose.
import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Play, Theater, MessageCircle, X, Trophy } from 'lucide-react'
import { useI18n } from '../../i18n'
import { CATEGORIES, DIFF_CONFIG, CATEGORY_ICONS } from '../chatbot/ScenarioSelector'
import ScenarioCard from './ScenarioCard'
import FreeTalkPanel from './FreeTalkPanel'
import {
  SCENARIO_UNLOCK_AFTER, isScenarioLocked, getRecommendedScenarios, filterScenarios, countByCategory,
} from '../../utils/conversationHelpers'

function ProgressRing({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="relative w-[72px] h-[72px] shrink-0" role="img" aria-label={`${done} / ${total}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-foreground/10" />
        <motion.circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round"
          className="stroke-cyan-400"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-base font-bold text-foreground">{done}</span>
        <span className="text-[10px] text-muted-foreground mt-0.5">/ {total}</span>
      </div>
    </div>
  )
}

export default function ConversationHub({
  username, scenarios, completedIds, savedConversations, level,
  tab, onTabChange, freeLevel, onFreeLevelChange, levels, topics,
  onStartScenario, onStartFree,
}) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  const completedCount = completedIds.length
  const counts = useMemo(() => countByCategory(scenarios), [scenarios])
  const recommended = useMemo(() => getRecommendedScenarios(scenarios, { level, completedIds, limit: 3 }), [scenarios, level, completedIds])
  const filtered = useMemo(() => filterScenarios(scenarios, { query, category, difficulty }), [scenarios, query, category, difficulty])
  const savedIds = useMemo(() => new Set(savedConversations.filter((s) => s.kind === 'scenario').map((s) => s.scenario.id)), [savedConversations])
  const filtersActive = Boolean(query.trim()) || category !== 'All' || difficulty !== 'All'
  const resume = savedConversations[0]
  const quickStart = recommended[0]
  const unlockRemaining = Math.max(0, SCENARIO_UNLOCK_AFTER - completedCount)

  const resumeNow = () => {
    if (!resume) return
    if (resume.kind === 'scenario') onStartScenario(resume.scenario)
    else onStartFree(resume.level, null)
  }

  const tabs = [
    { id: 'scenario', icon: Theater, title: t('conversation.tab_roleplay', 'Role-play'), sub: t('conversation.tab_roleplay_sub', { count: scenarios.length }, `${scenarios.length} real-life situations`) },
    { id: 'free', icon: MessageCircle, title: t('conversation.tab_free', 'Free talk'), sub: t('conversation.tab_free_sub', 'Chat openly with Hana-sensei') },
  ]

  return (
    <div className="min-w-0 space-y-6 pb-8" data-testid="conversation-hub">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cyan-500/15 via-primary/10 to-violet-500/15 p-5 sm:p-7">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-[11px] font-bold text-cyan-500">会話練習</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {t('conversation.title', 'Conversation Practice')}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
              {t('conversation.hero_sub', { name: username }, `Hi ${username}! Pick a situation and talk it out with Hana-sensei. She'll correct you gently as you go.`)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {resume ? (
                <button
                  type="button"
                  onClick={resumeNow}
                  data-testid="resume-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition"
                >
                  <Play className="w-4 h-4" />
                  {t('conversation.continue', 'Continue')}: {resume.kind === 'scenario' ? resume.scenario.title : t('conversation.tab_free', 'Free talk')}
                </button>
              ) : quickStart ? (
                <button
                  type="button"
                  onClick={() => onStartScenario(quickStart)}
                  data-testid="quick-start-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 active:scale-95 transition"
                >
                  <Play className="w-4 h-4" />
                  {t('conversation.quick_start', 'Quick start')}: {quickStart.title}
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2 sm:px-2">
            <ProgressRing done={completedCount} total={scenarios.length} />
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 sm:text-center">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {t('conversation.completed_label', 'Scenarios completed')}
            </p>
          </div>

          <img
            src="/images/hana-sensei-welcome.png"
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="pointer-events-none hidden lg:block h-48 w-auto -my-6 -mr-2 object-contain select-none drop-shadow-xl"
          />
        </div>
      </section>

      {/* ── Mode tabs ────────────────────────────────────────── */}
      <div role="tablist" aria-label={t('conversation.mode', 'Practice mode')} className="grid grid-cols-2 gap-3">
        {tabs.map(({ id, icon: Icon, title, sub }) => {
          const active = tab === id
          return (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onTabChange(id)}
              className={`min-w-0 text-left rounded-2xl border p-3.5 sm:p-4 transition-all ${
                active ? 'border-primary/50 bg-primary/10 shadow-sm' : 'border-border bg-surface hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground">{title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{sub}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {tab === 'free' ? (
        <FreeTalkPanel levels={levels} topics={topics} level={freeLevel} onLevelChange={onFreeLevelChange} onStart={onStartFree} />
      ) : (
        <div className="space-y-7">
          {/* ── Picked for you ─────────────────────────────── */}
          {!filtersActive && recommended.length > 0 && (
            <section aria-labelledby="picked">
              <h2 id="picked" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                ✨ {t('conversation.picked_for_you', { level }, `Picked for you · ${level}`)}
              </h2>
              <div className="grid gap-3 md:grid-cols-3">
                {recommended.map((sc) => (
                  <ScenarioCard key={sc.id} scenario={sc} compact completed={completedIds.includes(sc.id)} inProgress={savedIds.has(sc.id)} onSelect={onStartScenario} />
                ))}
              </div>
            </section>
          )}

          {/* ── Browse ─────────────────────────────────────── */}
          <section aria-labelledby="browse" className="space-y-3">
            <h2 id="browse" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('conversation.browse_all', 'Browse all scenarios')}
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <label className="relative flex-1">
                <span className="sr-only">{t('conversation.search', 'Search scenarios')}</span>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('conversation.search_placeholder', 'Search scenarios…')}
                  className="w-full rounded-xl bg-surface border border-border pl-10 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} aria-label={t('common.clear', 'Clear')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </label>

              <div role="group" aria-label={t('conversation.difficulty', 'Difficulty')} className="flex rounded-xl border border-border bg-surface p-1 gap-1 overflow-x-auto">
                {['All', ...Object.keys(DIFF_CONFIG)].map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={difficulty === d}
                    onClick={() => setDifficulty(d)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      difficulty === d ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d === 'All' ? t('conversation.all_levels', 'All levels') : DIFF_CONFIG[d].label}
                  </button>
                ))}
              </div>
            </div>

            <div role="group" aria-label={t('conversation.categories', 'Categories')} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.filter((c) => c === 'All' || counts[c]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === c ? 'border-primary/50 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span aria-hidden="true">{CATEGORY_ICONS[c]}</span>
                  {c === 'All' ? t('conversation.all', 'All') : c}
                  <span className="text-[10px] opacity-60">{counts[c]}</span>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground" aria-live="polite">
              {t('conversation.results_count', { count: filtered.length }, `${filtered.length} scenarios`)}
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm font-semibold text-foreground">{t('conversation.no_results', 'No scenarios match')}</p>
                <button type="button" onClick={() => { setQuery(''); setCategory('All'); setDifficulty('All') }} className="mt-3 text-xs font-semibold text-primary hover:underline">
                  {t('conversation.clear_filters', 'Clear filters')}
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((sc) => (
                  <ScenarioCard
                    key={sc.id}
                    scenario={sc}
                    completed={completedIds.includes(sc.id)}
                    locked={isScenarioLocked(sc, completedCount)}
                    unlockRemaining={unlockRemaining}
                    inProgress={savedIds.has(sc.id)}
                    onSelect={onStartScenario}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
