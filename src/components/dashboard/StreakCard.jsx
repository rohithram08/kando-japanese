// src/components/dashboard/StreakCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 100% Slime Concept Jelly Streak Card
// Features 2D Animated Jelly Slime Mascot, Daily Drops & Streak Freeze Shield
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Snowflake, Check } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProgressStore } from '../../store/progressStore';
import JellyStreakSlime from '../mascot/JellyStreakSlime';
import toast from 'react-hot-toast';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakCard({ streak = 0 }) {
  const { t } = useI18n();
  const { streakFreezes = 2, isStreakFrozen = false, equipStreakFreeze } = useProgressStore();
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const hasStudiedToday = streak > 0;

  const handleEquipFreeze = () => {
    equipStreakFreeze(1);
    toast.success('Equipped 1 Jelly Freeze! Your streak is shielded! ❄️', {
      icon: '🛡️',
    });
  };

  const getMotivation = (val) => {
    if (val === 0) {
      return {
        text: t('dashboard.start_streak', 'Start your Jelly Streak today!'),
        emoji: '💧',
        color: 'text-muted-foreground',
      };
    }
    if (val < 7) {
      return {
        text: t('dashboard.week_streak_target', { count: 7 - val }, `${7 - val} more days to weekly Jelly milestone!`),
        emoji: '✨',
        color: 'text-cyan-600 dark:text-cyan-400',
      };
    }
    if (val < 30) {
      return {
        text: t('dashboard.month_streak_target', { count: 30 - val }, `${30 - val} days to monthly King Jelly badge!`),
        emoji: '👑',
        color: 'text-blue-600 dark:text-blue-400',
      };
    }
    return {
      text: t('dashboard.legend_streak', "Incredible dedication! You're a Jelly Legend!"),
      emoji: '🏆',
      color: 'text-amber-500 dark:text-amber-400',
    };
  };

  const motivation = getMotivation(streak);
  const slimeMood = isStreakFrozen ? 'frozen' : streak >= 7 ? 'celebrating' : streak > 0 ? 'active' : 'sleepy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border border-cyan-500/20 dark:border-cyan-500/30 overflow-hidden"
    >
      <div className="card-header pb-3 border-b border-border/50">
        <div className="flex items-center gap-3 flex-1">
          {/* 2D Jelly Slime Mascot */}
          <JellyStreakSlime size="sm" mood={slimeMood} animated />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">
                {t('dashboard.streak_title', 'Jelly Streak')}
              </h3>
              {isStreakFrozen && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
                  <Snowflake className="w-2.5 h-2.5" /> Frozen Shield
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('dashboard.streak_desc', 'Stay consistent with daily story lessons')}
            </p>
          </div>
        </div>

        {/* Days Counter */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <motion.span
              key={`val-${streak}`}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black block leading-none text-cyan-600 dark:text-cyan-400 font-mono"
            >
              {streak}
            </motion.span>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {t('dashboard.streak_days', 'days')}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body pt-4 space-y-4">
        {/* ── 7-Day Jelly Drop Track ── */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEK_DAYS.map((day, i) => {
            const isToday = i === todayIndex;
            const isPast = i < todayIndex;
            const isStudied = isToday
              ? hasStudiedToday
              : isPast && i >= todayIndex - (streak - (hasStudiedToday ? 1 : 0));

            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 320 }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isStudied
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-xs shadow-cyan-500/25'
                      : isToday
                      ? 'border-2 border-dashed border-cyan-400 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 animate-pulse'
                      : 'border border-border/80 bg-muted/40 text-muted-foreground/60'
                  }`}
                  title={`${day}: ${isStudied ? 'Jelly Streak recorded!' : isToday ? 'Read a story today!' : 'Pending'}`}
                >
                  {isStudied ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="text-center"
                    >
                      <span className="text-base select-none">💧</span>
                    </motion.div>
                  ) : isToday ? (
                    <span className="text-xs font-bold font-mono">Today</span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-border" />
                  )}
                </motion.div>

                <span
                  className={`text-[11px] font-semibold ${
                    isToday ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Motivation Banner ── */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{motivation.emoji}</span>
            <span className={`font-semibold ${motivation.color}`}>{motivation.text}</span>
          </div>
          <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 font-mono">
            +{streak * 5 + 10} Wave XP
          </span>
        </div>

        {/* ── Streak Freeze Protection Module ── */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-sky-500" />
            <span>
              Jelly Freezes: <strong className="text-foreground">{streakFreezes}</strong> available
            </span>
          </div>

          <button
            onClick={handleEquipFreeze}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-300 dark:border-sky-800 transition-colors"
          >
            <Snowflake className="w-3 h-3 text-sky-500" />
            <span>+ Equip Freeze</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
