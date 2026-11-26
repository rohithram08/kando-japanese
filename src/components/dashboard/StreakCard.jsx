// src/components/dashboard/StreakCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// 100% Slime Concept Jelly Streak Card
// Features 2D Animated Jelly Slime Mascot, Daily Drops & Streak Freeze Shield
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Snowflake, Gift, AlertTriangle, Droplets, Flame, Sparkles, Crown, Trophy } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useProgressStore } from '../../store/progressStore';
import JellyStreakSlime from '../mascot/JellyStreakSlime';
import TreasuryChallengeModal from '../streak/TreasuryChallengeModal';
import StreakOdometer from '../common/StreakOdometer';
import {
  isTreasuryChallengeAvailable,
  getTimeUntilTreasuryReset,
  TREASURY_STORAGE_KEYS,
} from '../../services/treasuryService';
import { playFanfare } from '../../utils/soundEffects';
import toast from 'react-hot-toast';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreakCard({ streak = 0 }) {
  const { t } = useI18n();
  const {
    streakFreezes = 2,
    isStreakFrozen = false,
    frozenDates = [],
    brokenStreakInfo = null,
    freezeMissedDay,
    repairStreakWithFreeze,
    dailyXP = 0,
    isActiveToday = false,
  } = useProgressStore();
  const [isTreasuryOpen, setIsTreasuryOpen] = useState(false);
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
  const hasStudiedToday = Boolean(isActiveToday || dailyXP > 0);

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastDate = typeof window !== 'undefined' ? localStorage.getItem('nihongo_last_streak_date') : null;
  const isYesterdayActive = lastDate === yesterday;
  const isYesterdayFrozen = Boolean(isStreakFrozen || (frozenDates && frozenDates.includes(yesterday)));
  const isYesterdayMissed = Boolean(
    brokenStreakInfo ||
    (!isYesterdayActive && !isYesterdayFrozen && lastDate && lastDate < yesterday && streak > 0)
  );

  const lastClaimed = typeof window !== 'undefined'
    ? localStorage.getItem(TREASURY_STORAGE_KEYS.LAST_CLAIMED)
    : null;
  const isAvailableThisWeek = isTreasuryChallengeAvailable(lastClaimed);
  const resetTimer = getTimeUntilTreasuryReset();

  const handleFreezeYesterday = async () => {
    const fn = freezeMissedDay || repairStreakWithFreeze;
    const res = await fn();
    if (res.success) {
      playFanfare();
      toast.success(res.message, { icon: '❄️' });
    } else {
      toast.error(res.message);
    }
  };

  const getMotivation = (val) => {
    if (!hasStudiedToday && val > 0) {
      return {
        text: t('dashboard.study_today_to_keep_streak', { count: val }, `Study a story or quiz today to keep your ${val}-day streak alive!`),
        Icon: Flame,
        color: 'text-amber-600 dark:text-amber-400',
      };
    }
    if (val === 0) {
      return {
        text: t('dashboard.start_streak', 'Start your Jelly Streak today!'),
        Icon: Droplets,
        color: 'text-muted-foreground',
      };
    }
    if (val < 7) {
      return {
        text: t('dashboard.week_streak_target', { count: 7 - val }, `${7 - val} more days to weekly Jelly milestone!`),
        Icon: Sparkles,
        color: 'text-cyan-600 dark:text-cyan-400',
      };
    }
    if (val < 30) {
      return {
        text: t('dashboard.month_streak_target', { count: 30 - val }, `${30 - val} days to monthly King Jelly badge!`),
        Icon: Crown,
        color: 'text-blue-600 dark:text-blue-400',
      };
    }
    return {
      text: t('dashboard.legend_streak', "Incredible dedication! You're a Jelly Legend!"),
      Icon: Trophy,
      color: 'text-amber-500 dark:text-amber-400',
    };
  };

  const motivation = getMotivation(streak);
  const MotivationIcon = motivation.Icon;
  const slimeMood = isStreakFrozen ? 'frozen' : streak >= 7 ? 'celebrating' : streak > 0 ? 'active' : 'sleepy';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="card-header pb-3 border-b border-border/60">
        <div className="flex items-center gap-3 flex-1">
          {/* 2D Jelly Slime Mascot */}
          <JellyStreakSlime size="sm" mood={slimeMood} animated />

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-foreground">
                {t('dashboard.streak_title', 'Jelly Streak')}
              </h3>
              {isStreakFrozen && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <Snowflake className="w-2.5 h-2.5" /> Frozen Shield
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t('dashboard.streak_desc', 'Stay consistent with daily story lessons')}
            </p>
          </div>
        </div>

        {/* Days Counter with Odometer */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <StreakOdometer
              value={streak}
              className="text-2xl font-bold block leading-none text-foreground font-mono tabular-nums"
            />
            <span className="text-[10px] font-medium text-muted-foreground">
              {t('dashboard.streak_days', 'days')}
            </span>
          </div>
        </div>
      </div>

      <div className="card-body pt-4 space-y-4">
        {/* ── 7-Day Track ── */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEK_DAYS.map((day, i) => {
            const isToday = i === todayIndex;
            const isPast = i < todayIndex;
            const dayOffset = todayIndex - i;
            const dayDate = new Date(Date.now() - dayOffset * 86400000).toISOString().split('T')[0];
            const isDayFrozen = Boolean(
              (frozenDates && frozenDates.includes(dayDate)) ||
              (isPast && dayOffset === 1 && isStreakFrozen)
            );

            const isStudied = isToday
              ? hasStudiedToday
              : isPast && !isDayFrozen && i >= todayIndex - (streak - (hasStudiedToday ? 1 : 0));

            return (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 320 }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isDayFrozen
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 shadow-xs'
                      : isStudied
                      ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-xs shadow-cyan-500/20'
                      : isToday
                      ? 'border border-dashed border-primary/60 bg-primary/5 text-primary animate-pulse'
                      : 'border border-border bg-surface-muted/60 text-muted-foreground/50'
                  }`}
                  title={`${day}: ${isDayFrozen ? 'Frozen with Jelly Freeze' : isStudied ? 'Streak recorded' : isToday ? 'Complete a lesson or quiz today' : 'Pending'}`}
                >
                  {isDayFrozen ? (
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 2.8 }}
                      className="flex items-center justify-center"
                    >
                      <Snowflake className="w-4 h-4" />
                    </motion.div>
                  ) : isStudied ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2.4 }}
                      className="flex items-center justify-center"
                    >
                      <Droplets className="w-4 h-4 fill-current" />
                    </motion.div>
                  ) : isToday ? (
                    <span className="text-[10px] font-semibold font-mono">Today</span>
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  )}
                </motion.div>

                <span
                  className={`text-[11px] font-medium ${
                    isToday ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Motivation Banner ── */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-muted/60 border border-border text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <MotivationIcon className={`w-4 h-4 shrink-0 ${motivation.color}`} />
            <span className={`font-medium truncate ${motivation.color}`}>{motivation.text}</span>
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground font-mono tabular-nums shrink-0">
            +{streak * 5 + 10} Wave XP
          </span>
        </div>

        {/* ── Missed Day / Broken Streak Recovery Banner ── */}
        {(isYesterdayMissed || brokenStreakInfo) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-700 dark:text-amber-300">
                  {brokenStreakInfo
                    ? `Streak Ended (${brokenStreakInfo.count} Days)!`
                    : `Forgot to study yesterday? Freeze Yesterday!`}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {streakFreezes > 0
                    ? `Use 1 Jelly Freeze to protect yesterday (${yesterday}) and keep your streak safe. Then complete a quiz today to continue!`
                    : 'Complete the Weekly Treasury Challenge to earn freezes and protect your streak!'}
                </p>
              </div>
            </div>
            {streakFreezes > 0 ? (
              <button
                onClick={handleFreezeYesterday}
                className="px-3 py-1.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shrink-0 shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>Freeze Yesterday</span>
              </button>
            ) : (
              <button
                onClick={() => setIsTreasuryOpen(true)}
                className="px-3 py-1.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white shrink-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Play Challenge</span>
              </button>
            )}
          </motion.div>
        )}

        {/* ── Streak Freeze Protection & Treasury Module ── */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-sky-500" />
            <span>
              Jelly Freezes: <strong className="text-foreground">{streakFreezes}</strong> available
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsTreasuryOpen(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isAvailableThisWeek
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                  : 'text-muted-foreground bg-muted hover:bg-muted/80 border border-border'
              }`}
              title={
                isAvailableThisWeek
                  ? 'Play Treasury Challenge to open the weekly Treasury Box!'
                  : `Opened this week (Resets in ${resetTimer.formatted})`
              }
            >
              <Gift className="w-3.5 h-3.5 shrink-0" />
              <span>{isAvailableThisWeek ? 'Treasury Box (1x/week)' : 'Treasury (Claimed)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Treasury Challenge Modal ── */}
      <TreasuryChallengeModal
        isOpen={isTreasuryOpen}
        onClose={() => setIsTreasuryOpen(false)}
      />
    </motion.div>
  );
}
