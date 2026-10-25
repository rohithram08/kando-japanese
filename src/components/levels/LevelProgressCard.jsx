// src/components/levels/LevelProgressCard.jsx
// ─────────────────────────────────────────────────────────────
// Replaces "here is everything that exists" with "here is where you are".
// Shows progress through the current level only, and at most one teaser for the
// next level (never totals for levels the user hasn't reached).
// ─────────────────────────────────────────────────────────────

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowRight, Sparkles } from 'lucide-react'
import { LEVEL_META } from '../../data/levels'
import { useStudyLevel } from '../../hooks/useStudyLevel'
import { useLevelStatus } from '../../hooks/useLevelStatus'
import { useQueryClient } from '@tanstack/react-query'
import { triggerRateLimitedConfetti } from '../../utils/confettiHelper'

const CATEGORY_LABELS = {
  vocabulary: 'Vocabulary',
  kanji: 'Kanji',
  grammar: 'Grammar',
  reading: 'Reading',
}

export default function LevelProgressCard({ className = '' }) {
  const { studyLevel, nextLevel, setStudyLevel } = useStudyLevel()
  const { data: status } = useLevelStatus()
  const queryClient = useQueryClient()
  const [busy, setBusy] = useState(false)

  const meta = LEVEL_META[studyLevel]
  const coverage = status?.coverage
  const percent = coverage?.percent ?? 0
  const ready = !!status?.readyToLevelUp && !!nextLevel

  const handleLevelUp = async () => {
    if (!nextLevel || busy) return
    setBusy(true)
    try {
      await setStudyLevel(nextLevel)
      await queryClient.invalidateQueries({ queryKey: ['level-status'] })
      triggerRateLimitedConfetti()
      toast.success(`${nextLevel} unlocked! ${studyLevel} stays available for review.`)
    } catch (err) {
      console.error(err)
      toast.error('Could not change level. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      aria-label={`${studyLevel} progress`}
      className={`rounded-2xl border border-border bg-surface p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your level</p>
          <h2 className="mt-0.5 text-xl font-extrabold">{meta?.label || studyLevel}</h2>
        </div>
        {coverage && <span className="text-2xl font-extrabold tabular-nums">{percent}%</span>}
      </div>

      {coverage ? (
        <>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${meta?.gradient || 'from-indigo-500 to-violet-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
            {Object.entries(coverage.categories).map(([key, c]) => (
              <div key={key}>
                <dt className="text-xs text-muted-foreground">{CATEGORY_LABELS[key]}</dt>
                <dd className="font-semibold tabular-nums">
                  {c.done}
                  <span className="text-muted-foreground"> / {c.total}</span>
                </dd>
              </div>
            ))}
          </dl>

          {nextLevel && !ready && (
            <p className="mt-4 text-sm text-muted-foreground">
              Reach {coverage.threshold}% to unlock <strong className="text-foreground">{nextLevel}</strong>.
            </p>
          )}
        </>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Study {studyLevel} lessons, kanji, grammar and stories to track your progress here.
        </p>
      )}

      {ready && (
        <button
          type="button"
          onClick={handleLevelUp}
          disabled={busy}
          className="btn-3d-primary mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          You&apos;re ready for {nextLevel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </section>
  )
}
