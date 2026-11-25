import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Target, ArrowRight, X, Snowflake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useI18n } from '../../i18n';

export interface DuolingoBannerProps {
  variant?: 'auto' | 'streak' | 'league' | 'quest' | 'boost';
  onAction?: () => void;
  className?: string;
}

export default function DuolingoBanner({ variant = 'auto', onAction, className = '' }: DuolingoBannerProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const streak = useProgressStore((s) => s.streak || 0);
  const isActiveToday = useProgressStore((s) => s.isActiveToday);
  const isStreakFrozen = useProgressStore((s) => s.isStreakFrozen);
  const streakFreezes = useProgressStore((s) => s.streakFreezes || 0);
  const dailyXP = useProgressStore((s) => s.dailyXP || 0);

  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  // Auto-determine highest priority message
  let activeType = variant;
  if (activeType === 'auto') {
    if (streak > 0 && !isActiveToday) {
      activeType = 'streak';
    } else if (dailyXP < 30) {
      activeType = 'quest';
    } else {
      activeType = 'league';
    }
  }

  // Render Streak Danger / Celebration Status Bar
  if (activeType === 'streak') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`relative overflow-hidden rounded-xl border border-orange-500/25 bg-surface px-4 py-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
                  {streak}-Day Streak Pending Today
                </span>
                {isStreakFrozen && (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium border border-sky-500/20 tabular-nums">
                    <Snowflake className="w-2.5 h-2.5" /> Freeze Protected ({streakFreezes})
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {t('banner.streak_warn', 'Complete a story lesson or Listening Dojo dialogue today to keep your streak active.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                if (onAction) onAction();
                else navigate('/listening');
              }}
              className="btn-3d-secondary px-3 py-1.5 rounded-lg text-xs gap-1.5"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render Daily Quest / Goal Status Bar
  if (activeType === 'quest') {
    const goalTarget = 50;
    const progressPercent = Math.min(100, Math.round((dailyXP / goalTarget) * 100));

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className={`relative overflow-hidden rounded-xl border border-border bg-surface px-4 py-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground tabular-nums">
                  Daily Goal Progress: {dailyXP} / {goalTarget} XP
                </span>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5 tabular-nums">
                {dailyXP >= goalTarget
                  ? 'Daily goal accomplished! Keep studying to climb the weekly League.'
                  : `Earn ${goalTarget - dailyXP} more XP today in Graded Reader or Listening Dojo.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                if (onAction) onAction();
                else navigate('/reading');
              }}
              className="btn-3d-secondary px-3 py-1.5 rounded-lg text-xs gap-1.5"
            >
              <span>Explore Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render League Standings Status Bar
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className={`relative overflow-hidden rounded-xl border border-border bg-surface px-4 py-3 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">
                Weekly League Leaderboard Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-muted text-muted-foreground font-medium border border-border">
                Top Cohort Ranks Advance
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {t('banner.league_callout', 'Study alongside classmates and earn XP through listening and reading sessions.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => {
              if (onAction) onAction();
              else navigate('/league');
            }}
            className="btn-3d-secondary px-3 py-1.5 rounded-lg text-xs gap-1.5"
          >
            <span>View Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
