// A single scenario in the hub grid. One clear idea per card: emoji tile, title,
// a calm meta row, and exactly one status badge (done / locked / in progress).
import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Lock, Clock, PlayCircle } from 'lucide-react'
import { useI18n } from '../../i18n'
import { DIFF_CONFIG } from '../chatbot/ScenarioSelector'

const TILE = {
  beginner: 'from-emerald-500/25 to-teal-500/10 ring-emerald-500/30',
  intermediate: 'from-amber-500/25 to-orange-500/10 ring-amber-500/30',
  advanced: 'from-rose-500/25 to-fuchsia-500/10 ring-rose-500/30',
}

export default function ScenarioCard({ scenario, completed, locked, unlockRemaining = 0, inProgress, onSelect, compact = false }) {
  const { t } = useI18n()
  const diff = DIFF_CONFIG[scenario.difficulty] || DIFF_CONFIG.beginner

  return (
    <motion.button
      type="button"
      whileHover={locked ? undefined : { y: -3 }}
      whileTap={locked ? undefined : { scale: 0.98 }}
      onClick={() => !locked && onSelect(scenario)}
      disabled={locked}
      data-testid="scenario-card"
      data-scenario-id={scenario.id}
      aria-label={scenario.title}
      className={`group relative text-left w-full rounded-2xl border bg-surface p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${locked ? 'opacity-60 cursor-not-allowed border-border' : 'border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5'}`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ring-1 flex items-center justify-center text-2xl ${TILE[scenario.difficulty] || TILE.beginner}`}>
          {locked ? <Lock className="w-5 h-5 text-muted-foreground" /> : scenario.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground leading-snug truncate">{scenario.title}</h3>
            {completed && !locked && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500" title={t('conversation.done', 'Done')}>
                <CheckCircle2 className="w-4 h-4" /><span className="sr-only">{t('conversation.done', 'Done')}</span>
              </span>
            )}
            {!completed && inProgress && !locked && (
              <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-500">
                <PlayCircle className="w-3 h-3" />{t('conversation.in_progress', 'In progress')}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{scenario.titleJP}</p>

          {!compact && (
            <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
              {locked
                ? t('conversation.unlock_hint', { count: unlockRemaining }, `Complete ${unlockRemaining} more scenarios to unlock`)
                : scenario.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />{diff.label}
            </span>
            <span className="font-semibold">{scenario.jlptLevel}</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{scenario.estimatedTime}</span>
          </div>
        </div>
      </div>
    </motion.button>
  )
}
