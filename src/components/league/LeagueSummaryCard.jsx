// src/components/league/LeagueSummaryCard.jsx
// Compact league status for the dashboard: where you stand this week, one tap to the full board.
import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLeague } from '../../hooks/useLeague'
import { useI18n } from '../../i18n'
import { formatCountdown, ordinal, leagueStatusMessage } from '../../utils/league'
import LeagueBadge from './LeagueBadge'

const TONE = {
  good: 'text-emerald-600 dark:text-emerald-400',
  warn: 'text-red-600 dark:text-red-400',
  neutral: 'text-muted-foreground',
}

export default function LeagueSummaryCard({ className = '' }) {
  const { t } = useI18n()
  const user = useAuthStore((s) => s.user)
  const { data } = useLeague({ enabled: !!user, poll: false })
  if (!user || !data) return null

  const { rung, board, week, rules, optedOut } = data
  const status = leagueStatusMessage(board, rules)

  return (
    <Link
      to="/league"
      className={`group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 ${className}`}
    >
      <LeagueBadge league={rung.league} stage={rung.stage} size={52} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('league.this_week', 'This week')}</p>
        <p className="truncate text-base font-extrabold text-foreground">
          {rung.label}
          {board && <span className="ml-2 text-sm font-semibold text-muted-foreground">{ordinal(board.you.rank)} {t('league.of', 'of')} {board.size}</span>}
        </p>
        {optedOut ? (
          <p className="text-xs text-muted-foreground">{t('league.hidden_short', "You're hidden from leagues")}</p>
        ) : (
          status && <p className={`truncate text-xs font-medium ${TONE[status.tone]}`}>{t(status.key, status.params, status.fallback)}</p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">{t('league.ends_in', 'Ends in')}</p>
        <p className="text-sm font-bold tabular-nums text-foreground">{formatCountdown(week.secondsLeft)}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  )
}
