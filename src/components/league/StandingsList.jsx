// src/components/league/StandingsList.jsx
import React, { useEffect, useRef, useState } from 'react'
import { Bot, ChevronUp, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import UserAvatar from '../common/UserAvatar'
import { useI18n } from '../../i18n'
import { sendUserAlert } from '../../api/users'

const ZONE_ROW = {
  promotion: 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200/70 dark:border-emerald-500/20',
  demotion: 'bg-red-50/80 dark:bg-red-500/10 border-red-200/70 dark:border-red-500/20',
  safe: 'bg-surface border-border',
}
const MEDAL = {
  1: 'bg-amber-400 text-amber-950',
  2: 'bg-slate-300 text-slate-800',
  3: 'bg-orange-400 text-orange-950',
}

function Divider({ tone, children }) {
  const color = tone === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
  const Icon = tone === 'up' ? ChevronUp : ChevronDown
  return (
    <li role="separator" className={`flex items-center gap-2 px-1 py-1 text-[11px] font-bold uppercase tracking-wider ${color}`}>
      <span className="h-px flex-1 bg-current opacity-30" />
      <Icon className="h-3 w-3" aria-hidden />
      {children}
      <span className="h-px flex-1 bg-current opacity-30" />
    </li>
  )
}

export default function StandingsList({ standings = [], promoteCount = 0, demoteCount = 0 }) {
  const { t } = useI18n()
  const youRef = useRef(null)
  const [cheeringId, setCheeringId] = useState(null)
  const [cheeredIds, setCheeredIds] = useState({})

  useEffect(() => { youRef.current?.scrollIntoView?.({ block: 'nearest' }) }, [])

  const handleCheer = async (e, userId, name) => {
    e.stopPropagation()
    if (!userId || cheeringId) return
    setCheeringId(userId)
    try {
      const res = await sendUserAlert(userId, 'cheer')
      toast.success(res?.alert?.text || `Cheered on ${name}! 🌸`)
      setCheeredIds((prev) => ({ ...prev, [userId]: true }))
    } catch (err) {
      toast.error(err?.message || 'Could not send alert')
    } finally {
      setCheeringId(null)
    }
  }

  const lastPromotionRank = promoteCount
  const firstDemotionRank = standings.length - demoteCount + 1

  return (
    <ol className="space-y-1.5" aria-label={t('league.standings', 'Standings')}>
      {standings.map((s) => (
        <React.Fragment key={`${s.rank}-${s.userId ?? s.name}`}>
          {demoteCount > 0 && s.rank === firstDemotionRank && lastPromotionRank < firstDemotionRank && (
            <Divider tone="down">{t('league.divider_demote', { n: demoteCount }, `Bottom ${demoteCount} move down`)}</Divider>
          )}
          <li
            ref={s.isYou ? youRef : undefined}
            aria-current={s.isYou ? 'true' : undefined}
            data-zone={s.zone}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${ZONE_ROW[s.zone] || ZONE_ROW.safe} ${s.isYou ? 'ring-2 ring-primary' : ''}`}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold tabular-nums ${MEDAL[s.rank] || 'text-muted-foreground'}`}>
              {s.rank}
            </span>
            <UserAvatar
              avatarConfig={s.avatar?.avatarConfig ?? null}
              avatarId={s.avatar?.avatarId ?? null}
              avatarUrl={s.avatar?.avatarUrl ?? null}
              username={s.name}
              size="md"
              rounded="rounded-full"
            />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm ${s.isYou ? 'font-extrabold' : 'font-semibold'} text-foreground`}>
                {s.name}
                {s.isYou && <span className="ml-1.5 text-xs font-bold text-primary">({t('league.you', 'you')})</span>}
              </p>
              {s.isBot && (
                <p className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Bot className="h-3 w-3" aria-hidden /> {t('league.bot_label', 'Dojo bot')}
                </p>
              )}
            </div>

            {/* Quick Peer Cheer Button (Harassment-Free & Predefined) */}
            {!s.isYou && !s.isBot && s.userId && (
              <button
                type="button"
                title={cheeredIds[s.userId] ? 'Cheered!' : `Send study cheer to ${s.name}`}
                aria-label={`Send cheer to ${s.name}`}
                disabled={cheeringId === s.userId}
                onClick={(e) => handleCheer(e, s.userId, s.name)}
                className="px-2 py-1 rounded-lg text-xs font-semibold bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 dark:bg-pink-500/20 dark:text-pink-300 transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <span>{cheeredIds[s.userId] ? '✨' : '🌸'}</span>
                <span className="hidden sm:inline text-[11px]">{cheeredIds[s.userId] ? 'Cheered' : 'Cheer'}</span>
              </button>
            )}

            <span className="shrink-0 text-sm font-bold tabular-nums text-foreground">
              {s.xp.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">XP</span>
            </span>
          </li>
          {promoteCount > 0 && s.rank === lastPromotionRank && lastPromotionRank < standings.length && (
            <Divider tone="up">{t('league.divider_promote', { n: promoteCount }, `Top ${promoteCount} move up`)}</Divider>
          )}
        </React.Fragment>
      ))}
    </ol>
  )
}
