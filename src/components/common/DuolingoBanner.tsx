import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Zap, Target, ArrowRight, X, ShieldAlert, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';
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
  const { user } = useAuthStore();

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

  // Render Streak Danger / Celebration Banner
  if (activeType === 'streak') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`relative overflow-hidden rounded-2xl border-2 border-orange-500/40 bg-linear-to-r from-orange-500/15 via-amber-500/10 to-red-500/10 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
              <Flame className="w-5 h-5 fill-white animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {streak}-Day Streak At Risk!
                </span>
                {isStreakFrozen && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/30">
                    ❄️ Freeze Protected ({streakFreezes})
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground/90 truncate">
                {t('banner.streak_warn', 'Complete a lesson or Listening Dojo dialogue today to keep your streak flame alive!')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                if (onAction) onAction();
                else navigate('/listening');
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-orange-500/30 transition-all cursor-pointer"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render Daily Quest / Goal Banner
  if (activeType === 'quest') {
    const goalTarget = 50;
    const progressPercent = Math.min(100, Math.round((dailyXP / goalTarget) * 100));

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-linear-to-r from-emerald-500/15 via-teal-500/10 to-green-500/10 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Daily Goal Progress: {dailyXP} / {goalTarget} XP
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  ({progressPercent}%)
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground/90 truncate">
                {dailyXP >= goalTarget
                  ? '🎉 Daily goal accomplished! Keep learning to climb the weekly League.'
                  : `Earn ${goalTarget - dailyXP} more XP today in Graded Reader or Listening Dojo!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => {
                if (onAction) onAction();
                else navigate('/reading');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <span>Explore Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render League Promotion / Standings Banner
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`relative overflow-hidden rounded-2xl border-2 border-indigo-500/40 bg-linear-to-r from-indigo-500/15 via-purple-500/10 to-blue-500/10 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Weekly League Leaderboard Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30">
                Top 10 Advance
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground/90 truncate">
              {t('banner.league_callout', 'Compete with global Japanese learners. Finish listening and reading sessions to rank up!')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => {
              if (onAction) onAction();
              else navigate('/league');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-500/30 transition-all cursor-pointer"
          >
            <span>View Standings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
