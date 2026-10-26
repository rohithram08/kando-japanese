// src/pages/LeaguePage.jsx
// ─────────────────────────────────────────────────────────────
// Weekly leagues + leaderboard.
//   • "My league": your cohort this week, ranked by XP, with promotion / demotion zones
//   • "All-time":  top learners by total XP
// Learners can hide themselves from both (privacy), and read exactly how it works.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, ArrowDown, Minus, EyeOff, Eye, Info, Trophy, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useI18n } from '../i18n'
import { useLeague, useLeagueHistory, useGlobalBoard, useLeagueOptOut } from '../hooks/useLeague'
import { formatCountdown, ordinal, leagueStatusMessage } from '../utils/league'
import LeagueBadge from '../components/league/LeagueBadge'
import StandingsList from '../components/league/StandingsList'
import UserAvatar from '../components/common/UserAvatar'

const TONE = {
  good: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  warn: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  neutral: 'bg-muted text-muted-foreground',
}

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function SignedOut() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" aria-hidden />
      <h1 className="text-2xl font-extrabold text-foreground">{t('league.signed_out_title', 'Compete with other learners')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('league.signed_out_desc', 'Join weekly leagues, climb from Wakaba to Fuji and see how you rank. Create a free account to start.')}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/register" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">{t('nav.register', 'Sign up')}</Link>
        <Link to="/login" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">{t('nav.login', 'Log in')}</Link>
      </div>
    </div>
  )
}

function Outcome({ outcome }) {
  const { t } = useI18n()
  if (outcome === 'promoted') return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><ArrowUp className="h-3.5 w-3.5" aria-hidden />{t('league.promoted', 'Promoted')}</span>
  if (outcome === 'demoted') return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400"><ArrowDown className="h-3.5 w-3.5" aria-hidden />{t('league.demoted', 'Demoted')}</span>
  return <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground"><Minus className="h-3.5 w-3.5" aria-hidden />{t('league.stayed', 'Stayed')}</span>
}

export default function LeaguePage() {
  const { t } = useI18n()
  const user = useAuthStore((s) => s.user)
  const [tab, setTab] = useState('league')
  const now = useNow()

  const league = useLeague({ enabled: !!user })
  const history = useLeagueHistory({ enabled: !!user && tab === 'league' })
  const globalBoard = useGlobalBoard({ enabled: !!user && tab === 'alltime' })
  const optOut = useLeagueOptOut()

  const data = league.data
  const secondsLeft = data ? Math.floor((new Date(data.week.endsAt).getTime() - now) / 1000) : 0

  // The moment a week ends, fetch again so the new week (and any promotion) shows up.
  const [refetchedFor, setRefetchedFor] = useState(null)
  useEffect(() => {
    if (data && secondsLeft <= 0 && refetchedFor !== data.week.id) {
      setRefetchedFor(data.week.id)
      league.refetch()
    }
  }, [data, secondsLeft, refetchedFor, league])

  if (!user) return <SignedOut />

  if (league.isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><div className="h-40 animate-pulse rounded-2xl bg-muted" aria-busy="true" /></div>
  }
  if (league.isError || !data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{t('league.load_error', "We couldn't load your league right now.")}</p>
        <button type="button" onClick={() => league.refetch()} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">
          <RefreshCw className="h-4 w-4" aria-hidden /> {t('common.retry', 'Try again')}
        </button>
      </div>
    )
  }

  const { rung, board, rules, ladder, optedOut } = data
  const status = leagueStatusMessage(board, rules)
  const promotePct = Math.round(rules.promoteFraction * 100)
  const demotePct = Math.round(rules.demoteFraction * 100)

  const toggleOptOut = async (value) => {
    try {
      await optOut.mutateAsync(value)
      toast.success(value ? t('league.opted_out', "You're now hidden from leagues.") : t('league.opted_in', 'Welcome back to the leagues!'))
    } catch {
      toast.error(t('league.opt_error', 'Could not update your privacy setting.'))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
      {/* Header */}
      <section className="rounded-3xl border border-border bg-surface p-5">
        <div className="flex items-center gap-4">
          <LeagueBadge league={rung.league} stage={rung.stage} size={84} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('league.your_league', 'Your league')}</p>
            <h1 className="truncate text-2xl font-extrabold text-foreground">{rung.label}</h1>
            <p className="text-sm text-muted-foreground">{rung.league.jp}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t('league.ends_in', 'Ends in')}</p>
            <p className="text-lg font-extrabold tabular-nums text-foreground" aria-live="off">{formatCountdown(secondsLeft)}</p>
          </div>
        </div>

        {board && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
              {ordinal(board.you.rank)} {t('league.of', 'of')} {board.size}
            </span>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-bold tabular-nums text-foreground">{board.you.xp.toLocaleString()} XP</span>
            {status && <span className={`rounded-full px-3 py-1 text-xs font-semibold ${TONE[status.tone]}`}>{t(status.key, status.params, status.fallback)}</span>}
          </div>
        )}

        {/* The ladder: five leagues, current one highlighted. Names only, no totals. */}
        <ol className="mt-5 flex items-end justify-between gap-1" aria-label={t('league.ladder', 'League ladder')}>
          {ladder.map((l) => (
            <li key={l.id} className="flex flex-1 flex-col items-center gap-1">
              <LeagueBadge league={l} stage={l.order === rung.leagueIndex ? rung.stage : 1} size={l.order === rung.leagueIndex ? 44 : 34} dim={l.order > rung.leagueIndex} />
              <span className={`text-[11px] font-semibold ${l.order === rung.leagueIndex ? 'text-foreground' : 'text-muted-foreground'}`}>{l.name}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Tabs */}
      <div role="tablist" className="flex gap-1 rounded-xl bg-muted p-1">
        {[['league', t('league.tab_league', 'My league')], ['alltime', t('league.tab_alltime', 'All-time')]].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors ${tab === id ? 'bg-surface text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'league' && (
        <>
          {optedOut || !board ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <EyeOff className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden />
              <p className="font-bold text-foreground">{t('league.hidden_title', "You're hidden from leagues")}</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{t('league.hidden_desc', "Other learners can't see you and you aren't ranked. Your progress and XP are unaffected.")}</p>
              <button type="button" onClick={() => toggleOptOut(false)} disabled={optOut.isPending} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                {t('league.rejoin', 'Rejoin leagues')}
              </button>
            </div>
          ) : (
            <StandingsList standings={board.standings} promoteCount={board.promoteCount} demoteCount={board.demoteCount} />
          )}

          {history.data?.weeks?.length > 0 && (
            <section aria-label={t('league.history', 'Past weeks')}>
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('league.history', 'Past weeks')}</h2>
              <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
                {history.data.weeks.map((w) => (
                  <li key={w.weekId} className="flex items-center gap-3 px-4 py-2.5">
                    <LeagueBadge league={w.rung.league} stage={w.rung.stage} size={28} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{w.rung.label}</p>
                      <p className="text-xs text-muted-foreground">{w.rank ? `${ordinal(w.rank)} · ` : ''}{(w.xp ?? 0).toLocaleString()} XP</p>
                    </div>
                    <Outcome outcome={w.outcome} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {tab === 'alltime' && (
        <section aria-label={t('league.tab_alltime', 'All-time')}>
          {globalBoard.isLoading && <div className="h-40 animate-pulse rounded-2xl bg-muted" aria-busy="true" />}
          {globalBoard.data && (
            <>
              <ol className="space-y-1.5">
                {globalBoard.data.entries.map((e) => (
                  <li key={e.userId} aria-current={e.isYou ? 'true' : undefined} className={`flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 ${e.isYou ? 'ring-2 ring-primary' : ''}`}>
                    <span className="w-7 shrink-0 text-center text-xs font-extrabold tabular-nums text-muted-foreground">{e.rank}</span>
                    <UserAvatar avatarConfig={e.avatar.avatarConfig} avatarId={e.avatar.avatarId} avatarUrl={e.avatar.avatarUrl} username={e.name} size="md" rounded="rounded-full" />
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{e.name}{e.isYou && <span className="ml-1.5 text-xs font-bold text-primary">({t('league.you', 'you')})</span>}</p>
                    <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">{e.xp.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">XP</span></span>
                  </li>
                ))}
              </ol>
              {globalBoard.data.you && !globalBoard.data.entries.some((e) => e.isYou) && (
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  {t('league.your_global_rank', { rank: globalBoard.data.you.rank }, `You're ranked #${globalBoard.data.you.rank} all-time.`)}
                </p>
              )}
            </>
          )}
        </section>
      )}

      {/* How it works */}
      <details className="group rounded-2xl border border-border bg-surface p-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-foreground">
          <Info className="h-4 w-4 text-primary" aria-hidden /> {t('league.how_title', 'How leagues work')}
        </summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>{t('league.how_1', 'Every week (Monday 12:00 AM IST to the next Monday) you compete with up to 30 learners in your league.')}</li>
          <li>{t('league.how_2', { promote: promotePct, demote: demotePct }, `The top ${promotePct}% move up a stage; the bottom ${demotePct}% move down. Everyone else stays.`)}</li>
          <li>{t('league.how_3', { min: rules.minXpToPromote }, `You need at least ${rules.minXpToPromote} XP in a week to be promoted.`)}</li>
          <li>{t('league.how_4', { cap: rules.dailyXpCap.toLocaleString() }, `To keep things fair, up to ${rules.dailyXpCap.toLocaleString()} XP per day counts toward your league.`)}</li>
          <li>{t('league.how_5', 'There are 5 leagues (Wakaba, Take, Ume, Sakura, Fuji) with 3 stages each. Stage III is the entry; Stage I is the top of a league.')}</li>
          <li>{t('league.how_6', 'Small leagues are topped up with clearly labelled Dojo bots so there is always someone to chase. Bots are never promoted and never shown as real people.')}</li>
        </ul>
      </details>

      {/* Privacy */}
      {!optedOut && (
        <section className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-bold text-foreground"><Eye className="h-4 w-4" aria-hidden />{t('league.privacy_title', 'Show me on leaderboards')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('league.privacy_desc', 'Others see only your username, avatar and XP. Turn this off to leave leagues and all leaderboards.')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={true}
            aria-label={t('league.privacy_title', 'Show me on leaderboards')}
            onClick={() => toggleOptOut(true)}
            disabled={optOut.isPending}
            className="relative h-6 w-11 shrink-0 rounded-full bg-primary transition-colors disabled:opacity-60"
          >
            <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </button>
        </section>
      )}
    </div>
  )
}
