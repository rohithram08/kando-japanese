// src/pages/AchievementsPage.jsx
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Flame, Zap, Target, BookOpen, Star,
  Shield, CheckCircle2, Sparkles, Award, ArrowUpRight,
  ChevronRight, Lock, Eye
} from 'lucide-react'
import { useProgressStore } from '../store/progressStore'
import { useAuthStore } from '../store/authStore'
import { useReadingStore } from '../store/readingStore'
import { useThemeStore } from '../store/themeStore'
import { useI18n } from '../i18n'
import { useLeague, useLeagueHistory } from '../hooks/useLeague'
import { LEAGUES, getRungDetails } from '../utils/league'
import LeagueBadge from '../components/league/LeagueBadge'
import SlimeSticker from '../components/mascot/SlimeSticker'

// ─── Authentic Competitive League Ladder (Wakaba, Take, Ume, Sakura, Fuji) ───
export const LEAGUE_TIERS = LEAGUES.map((l, idx) => ({
  id: l.id,
  label: `${l.name} League`,
  name: l.name,
  jp: l.jp,
  color: l.color,
  badge: l.badge,
  minRung: idx * 3,
  minXP: [0, 250, 750, 1500, 3000][idx] || 0,
  icon: ['🌱', '🎍', '🌸', '👑', '🗻'][idx] || '🏆',
}))

export const RARITY = {
  common:    { label: 'Common',    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',      border: 'border-gray-200 dark:border-gray-800' },
  uncommon:  { label: 'Uncommon',  badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-800' },
  rare:      { label: 'Rare',      badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',       border: 'border-blue-300 dark:border-blue-800' },
  epic:      { label: 'Epic',      badge: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400',  border: 'border-violet-300 dark:border-violet-800' },
  legendary: { label: 'Legendary', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',   border: 'border-amber-300 dark:border-amber-700' },
}

const safeNum = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0)

// ─── Master Award Definitions (with custom Slime Stickers) ─────────────────
export const SLIME_AWARDS = [
  // LESSONS & BASICS
  {
    id: 'first_steps',
    title: 'First Steps',
    japaneseTitle: '第一歩 (Daiippo)',
    sticker: 'sparkle',
    desc: 'Completed your first Japanese study lesson.',
    rarity: 'common',
    condition: (s) => safeNum(s.lessonsCompleted) >= 1,
    progress: (s) => ({ current: safeNum(s.lessonsCompleted), target: 1 }),
  },
  {
    id: 'scholar_apprentice',
    title: 'Scholar Apprentice',
    japaneseTitle: '勉強家 (Benkyouka)',
    sticker: 'scholar',
    desc: 'Completed 5 lessons in your academy curriculum.',
    rarity: 'uncommon',
    condition: (s) => safeNum(s.lessonsCompleted) >= 5,
    progress: (s) => ({ current: safeNum(s.lessonsCompleted), target: 5 }),
  },
  {
    id: 'sensei_material',
    title: 'Sensei Material',
    japaneseTitle: '先生の器 (Sensei no Utsuwa)',
    sticker: 'scholar',
    desc: 'Completed 15 lessons with thorough understanding.',
    rarity: 'rare',
    condition: (s) => safeNum(s.lessonsCompleted) >= 15,
    progress: (s) => ({ current: safeNum(s.lessonsCompleted), target: 15 }),
  },

  // STREAKS
  {
    id: 'day_one_ignite',
    title: 'Flame Ignited',
    japaneseTitle: '初日の炎 (Hatsubi no Honoo)',
    sticker: 'flame',
    desc: 'Maintained your first study streak.',
    rarity: 'common',
    condition: (s) => safeNum(s.streak) >= 1,
    progress: (s) => ({ current: safeNum(s.streak), target: 1 }),
  },
  {
    id: 'heat_wave_3d',
    title: 'On Fire!',
    japaneseTitle: '熱血 (Nekketsu)',
    sticker: 'flame',
    desc: 'Held a steady 3-day consecutive study streak.',
    rarity: 'common',
    condition: (s) => safeNum(s.streak) >= 3,
    progress: (s) => ({ current: safeNum(s.streak), target: 3 }),
  },
  {
    id: 'week_warrior_7d',
    title: 'Week Warrior',
    japaneseTitle: '一週間の達人 (Isshuukan no Tatsujin)',
    sticker: 'flame',
    desc: 'Maintained a persistent 7-day study habit.',
    rarity: 'uncommon',
    condition: (s) => safeNum(s.streak) >= 7,
    progress: (s) => ({ current: safeNum(s.streak), target: 7 }),
  },
  {
    id: 'monthly_master_30d',
    title: 'Monthly Legend',
    japaneseTitle: '継続の達人 (Keizoku no Tatsujin)',
    sticker: 'flame',
    desc: 'Accomplished a full 30-day continuous study habit.',
    rarity: 'epic',
    condition: (s) => safeNum(s.streak) >= 30,
    progress: (s) => ({ current: safeNum(s.streak), target: 30 }),
  },

  // KANJI & VOCAB
  {
    id: 'kanji_warrior',
    title: 'Kanji Warrior',
    japaneseTitle: '漢字の戦士 (Kanji no Senshi)',
    sticker: 'samurai',
    desc: 'Studied and learned 10 or more Kanji characters.',
    rarity: 'uncommon',
    condition: (s) => safeNum(s.kanjiLearned) >= 10,
    progress: (s) => ({ current: safeNum(s.kanjiLearned), target: 10 }),
  },
  {
    id: 'kanji_master_50',
    title: 'Kanji Samue',
    japaneseTitle: '漢字マスター (Kanji Masutaa)',
    sticker: 'samurai',
    desc: 'Mastered 50 Kanji with stroke orders and radicals.',
    rarity: 'rare',
    condition: (s) => safeNum(s.kanjiLearned) >= 50,
    progress: (s) => ({ current: safeNum(s.kanjiLearned), target: 50 }),
  },
  {
    id: 'word_collector',
    title: 'Walking Dictionary',
    japaneseTitle: '歩く辞書 (Aruku Jisho)',
    sticker: 'bookworm',
    desc: 'Learned 25 essential vocabulary words.',
    rarity: 'common',
    condition: (s) => safeNum(s.vocabLearned) >= 25,
    progress: (s) => ({ current: safeNum(s.vocabLearned), target: 25 }),
  },
  {
    id: 'vocab_centurion',
    title: 'Vocab Centurion',
    japaneseTitle: '百語突破 (Hyakugo Toppa)',
    sticker: 'bookworm',
    desc: 'Expanded vocabulary to 100+ Japanese words.',
    rarity: 'uncommon',
    condition: (s) => safeNum(s.vocabLearned) >= 100,
    progress: (s) => ({ current: safeNum(s.vocabLearned), target: 100 }),
  },

  // ACCURACY & PERFECT QUIZZES
  {
    id: 'bullseye_perfect',
    title: 'Bullseye Accuracy',
    japaneseTitle: '満点 (Manten)',
    sticker: 'target',
    desc: 'Completed a quiz or lesson exercise with 100% accuracy.',
    rarity: 'rare',
    condition: (s, pMap) => {
      const perfectQuizzes = Object.values(pMap || {}).filter(
        (p) => p.quizScore === 100 || p.score === 100
      ).length
      return perfectQuizzes >= 1
    },
    progress: (s, pMap) => {
      const current = Object.values(pMap || {}).filter(
        (p) => p.quizScore === 100 || p.score === 100
      ).length
      return { current, target: 1 }
    },
  },
  {
    id: 'grand_champion_trophy',
    title: 'Trophy Hunter',
    japaneseTitle: '栄光の覇者 (Eikou no Hasha)',
    sticker: 'trophy',
    desc: 'Finished 3 separate quizzes with 100% perfect marks.',
    rarity: 'epic',
    condition: (s, pMap) => {
      const perfectQuizzes = Object.values(pMap || {}).filter(
        (p) => p.quizScore === 100 || p.score === 100
      ).length
      return perfectQuizzes >= 3
    },
    progress: (s, pMap) => {
      const current = Object.values(pMap || {}).filter(
        (p) => p.quizScore === 100 || p.score === 100
      ).length
      return { current, target: 3 }
    },
  },

  // WAVE XP & COMPETITIVE LEAGUES
  {
    id: 'xp_seeker_100',
    title: 'Wave Awakened',
    japaneseTitle: '目覚め (Mezame)',
    sticker: 'sparkle',
    desc: 'Reached your first 100 Wave XP milestone.',
    rarity: 'common',
    condition: (s) => safeNum(s.totalXP) >= 100,
    progress: (s) => ({ current: safeNum(s.totalXP), target: 100 }),
  },
  {
    id: 'wakaba_challenger',
    title: 'Wakaba Challenger',
    japaneseTitle: '若葉の挑戦者 (Wakaba no Chousensha)',
    sticker: 'sparkle',
    desc: 'Entered the competitive weekly leagues in Wakaba League.',
    rarity: 'common',
    condition: (s, pMap, l) => Boolean(l?.isEnrolled || (l?.highestRung ?? 0) >= 0 || safeNum(s?.totalXP) >= 50),
    progress: (s, pMap, l) => ({ current: (l?.isEnrolled || (l?.highestRung ?? 0) >= 0 || safeNum(s?.totalXP) >= 50) ? 1 : 0, target: 1 }),
  },
  {
    id: 'take_ascendant',
    title: 'Take Ascendant',
    japaneseTitle: '竹の昇格者 (Take no Shoukakusha)',
    sticker: 'scholar',
    desc: 'Climbed the ladder and earned promotion to Take (Bamboo) League.',
    rarity: 'uncommon',
    condition: (s, pMap, l) => (l?.highestRung ?? 0) >= 3 || safeNum(s?.totalXP) >= 250,
    progress: (s, pMap, l) => ({ current: Math.min(l?.highestRung ?? Math.floor(safeNum(s?.totalXP) / 80), 3), target: 3 }),
  },
  {
    id: 'ume_blossom',
    title: 'Ume Blossom',
    japaneseTitle: '梅の開花 (Ume no Kaika)',
    sticker: 'zen',
    desc: 'Ascended to the esteemed Ume (Plum Blossom) League.',
    rarity: 'rare',
    condition: (s, pMap, l) => (l?.highestRung ?? 0) >= 6 || safeNum(s?.totalXP) >= 750,
    progress: (s, pMap, l) => ({ current: Math.min(l?.highestRung ?? Math.floor(safeNum(s?.totalXP) / 125), 6), target: 6 }),
  },
  {
    id: 'sakura_sovereign',
    title: 'Sakura Sovereign',
    japaneseTitle: '桜の覇者 (Sakura no Hasha)',
    sticker: 'sakura',
    desc: 'Reached the prestigious Sakura (Cherry Blossom) League.',
    rarity: 'epic',
    condition: (s, pMap, l) => (l?.highestRung ?? 0) >= 9 || safeNum(s?.totalXP) >= 1500,
    progress: (s, pMap, l) => ({ current: Math.min(l?.highestRung ?? Math.floor(safeNum(s?.totalXP) / 160), 9), target: 9 }),
  },
  {
    id: 'fuji_summit',
    title: 'Fuji Summit Master',
    japaneseTitle: '富士頂上 (Fuji Choujou)',
    sticker: 'crown',
    desc: 'Conquered the summit and reached the legendary Fuji League.',
    rarity: 'legendary',
    condition: (s, pMap, l) => (l?.highestRung ?? 0) >= 12 || safeNum(s?.totalXP) >= 3000,
    progress: (s, pMap, l) => ({ current: Math.min(l?.highestRung ?? Math.floor(safeNum(s?.totalXP) / 250), 12), target: 12 }),
  },
  {
    id: 'league_podium',
    title: 'League Podium',
    japaneseTitle: '表彰台 (Hyoushoudai)',
    sticker: 'trophy',
    desc: 'Finished in the Top 3 of your weekly league cohort.',
    rarity: 'epic',
    condition: (s, pMap, l) => Boolean((l?.podiumCount ?? 0) >= 1 || (l?.currentRank && l.currentRank <= 3 && l.meetsMinXp) || safeNum(s?.totalXP) >= 1000),
    progress: (s, pMap, l) => ({ current: (l?.podiumCount ?? 0) >= 1 ? 1 : 0, target: 1 }),
  },

  // REVIEWS & ZEN
  {
    id: 'zen_reviewer',
    title: 'Zen Reviewer',
    japaneseTitle: '瞑想復習 (Meisou Fukushuu)',
    sticker: 'zen',
    desc: 'Completed your first spaced repetition (SRS) card reviews.',
    rarity: 'common',
    condition: (s) => safeNum(s.cardsReviewed) >= 1,
    progress: (s) => ({ current: safeNum(s.cardsReviewed), target: 1 }),
  },
  {
    id: 'srs_centurion',
    title: 'SRS Grandmaster',
    japaneseTitle: '記憶の達人 (Kioku no Tatsujin)',
    sticker: 'zen',
    desc: 'Successfully reviewed 50 SRS flashcards.',
    rarity: 'uncommon',
    condition: (s) => safeNum(s.cardsReviewed) >= 50,
    progress: (s) => ({ current: safeNum(s.cardsReviewed), target: 50 }),
  },

  // SAKURA DEDICATION
  {
    id: 'sakura_blossom',
    title: 'Sakura Scholar',
    japaneseTitle: '桜の学徒 (Sakura no Gakuto)',
    sticker: 'sakura',
    desc: 'Reached JLPT Level N5 and unlocked Graded Reader stories.',
    rarity: 'rare',
    condition: (s) => safeNum(s.totalXP) >= 300,
    progress: (s) => ({ current: safeNum(s.totalXP), target: 300 }),
  },

  // DEDICATION & SECRET
  {
    id: 'ninja_dedication',
    title: 'Shadow Ninja Dedication',
    japaneseTitle: '忍の道 (Shinobi no Michi)',
    sticker: 'ninja',
    desc: 'Completed lessons across multiple days showing unwavering focus.',
    rarity: 'epic',
    condition: (s) => safeNum(s.streak) >= 4 || safeNum(s.lessonsCompleted) >= 4,
    progress: (s) => ({ current: Math.max(safeNum(s.streak), safeNum(s.lessonsCompleted)), target: 4 }),
  },
  {
    id: 'dragon_master',
    title: 'Mythic Dragon Sensei',
    japaneseTitle: '昇龍 (Shouryuu)',
    sticker: 'dragon',
    desc: 'Achieved mastery across lessons, kanji, and reviews.',
    rarity: 'legendary',
    condition: (s) => safeNum(s.totalXP) >= 5000,
    progress: (s) => ({ current: safeNum(s.totalXP), target: 5000 }),
  },
]

const STICKER_EMOJI_MAP = {
  samurai: '⚔️',
  scholar: '📚',
  flame: '🔥',
  crown: '👑',
  ninja: '🥷',
  sakura: '🌸',
  bookworm: '📖',
  zen: '🧘',
  sparkle: '⭐',
  trophy: '🏆',
  target: '🎯',
  dragon: '🐉',
}

export const ACHIEVEMENTS = SLIME_AWARDS.map((award) => ({
  ...award,
  emoji: award.emoji || STICKER_EMOJI_MAP[award.sticker] || '🏆',
  category: award.category || 'general',
}))

export function computeUnlockedIds(progress, readingProgressMap = {}, leagueInfo = null) {
  const s = progress || {}
  const pMap = readingProgressMap || {}
  const l = leagueInfo || {}
  const unlocked = new Set()
  ACHIEVEMENTS.forEach((a) => {
    try {
      if (typeof a.condition === 'function' && a.condition(s, pMap, l)) {
        unlocked.add(a.id)
      }
    } catch {
      // ignore
    }
  })
  return unlocked
}

export default function AchievementsPage() {
  const { t } = useI18n()
  const progress = useProgressStore()
  const { profile } = useAuthStore()
  const progressMap = useReadingStore((s) => s.progressMap) || {}
  const [selectedAward, setSelectedAward] = useState(null)

  // ── 1. Calculate Personal Records ──
  const currentStreak = safeNum(progress.streak)
  const longestStreak = Math.max(currentStreak, safeNum(profile?.longestStreak), safeNum(profile?.streakDays))
  const currentXP = safeNum(progress.totalXP) || safeNum(profile?.xpPoints)
  const lessonsCompleted = safeNum(progress.lessonsCompleted)
  const kanjiLearned = safeNum(progress.kanjiLearned)
  const vocabLearned = safeNum(progress.vocabLearned)
  const cardsReviewed = safeNum(progress.cardsReviewed)

  // Perfect lessons / quizzes (100% accuracy)
  const perfectQuizzesCount = useMemo(() => {
    return Object.values(progressMap).filter(
      (p) => p.quizScore === 100 || p.score === 100
    ).length
  }, [progressMap])

  // Current & Highest League (Dynamically connected to real weekly league ladder)
  const user = useAuthStore((s) => s.user)
  const { data: leagueData } = useLeague({ enabled: !!user, poll: false })
  const { data: leagueHistory } = useLeagueHistory({ enabled: !!user })

  const currentRung = leagueData?.rung
  const highestRungIndex = useMemo(() => {
    const historyRungs = (leagueHistory?.weeks || []).map((w) => w.rung?.index ?? w.rungStart ?? 0)
    // If not loaded from server yet, fall back gracefully to XP estimate
    const currentIdx = currentRung?.index ?? (currentXP >= 1500 ? 9 : currentXP >= 750 ? 6 : currentXP >= 250 ? 3 : 0)
    return Math.max(currentIdx, ...historyRungs, 0)
  }, [currentRung, leagueHistory, currentXP])

  const highestLeague = useMemo(() => {
    return getRungDetails(highestRungIndex)
  }, [highestRungIndex])

  const nextRung = useMemo(() => {
    return highestRungIndex < 14 ? getRungDetails(highestRungIndex + 1) : null
  }, [highestRungIndex])

  const leagueContext = useMemo(() => ({
    highestRung: highestRungIndex,
    currentRung: currentRung?.index ?? 0,
    podiumCount: (leagueHistory?.weeks || []).filter((w) => typeof w.rank === 'number' && w.rank >= 1 && w.rank <= 3).length,
    currentRank: leagueData?.board?.you?.rank,
    meetsMinXp: leagueData?.board?.you?.meetsMinXp,
    isEnrolled: Boolean(leagueData?.rung),
    rung: currentRung,
  }), [highestRungIndex, currentRung, leagueHistory, leagueData])

  // ── 2. Evaluate Obtained Awards (ONLY OBTAINED AWARDS ARE SHOWN) ──
  const { obtainedAwards, upcomingAwards } = useMemo(() => {
    const obtained = []
    const unobtained = []

    SLIME_AWARDS.forEach((award) => {
      const isEarned = award.condition(progress, progressMap, leagueContext)
      if (isEarned) {
        obtained.push({ ...award, obtained: true })
      } else {
        const prog = award.progress(progress, progressMap, leagueContext)
        unobtained.push({ ...award, obtained: false, prog })
      }
    })

    // Sort unobtained by highest progress percent
    unobtained.sort((a, b) => {
      const pctA = a.prog.target > 0 ? a.prog.current / a.prog.target : 0
      const pctB = b.prog.target > 0 ? b.prog.current / b.prog.target : 0
      return pctB - pctA
    })

    return { obtainedAwards: obtained, upcomingAwards: unobtained }
  }, [progress, progressMap, leagueContext])

  // Highest rarity among obtained
  const topRarity = obtainedAwards.reduce((top, a) => {
    const ranks = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 }
    return ranks[a.rarity] > ranks[top] ? a.rarity : top
  }, 'common')

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 md:px-6">

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 md:p-8 text-white shadow-xl shadow-amber-500/20"
      >
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-10">
          <span className="absolute right-6 top-3 text-9xl">🏆</span>
          <span className="absolute bottom-2 right-44 text-6xl">⭐</span>
          <span className="absolute top-4 right-72 text-5xl">🎖️</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              栄誉と個人記録 · Personal Hall of Fame
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Personal Records & Slime Awards
            </h1>
            <p className="text-sm md:text-base text-amber-100 max-w-xl">
              Celebrate your milestone records, competitive league, and collected Slime Sticker Awards.
            </p>
          </div>

          {/* Quick Trophy Badge */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 self-start md:self-auto">
            <SlimeSticker type="trophy" size={68} obtained={true} animated={true} />
            <div>
              <div className="text-3xl font-black">{obtainedAwards.length}</div>
              <div className="text-xs font-medium text-amber-100">Slime Awards Obtained</div>
              <div className="text-[11px] text-yellow-200 font-semibold mt-0.5">
                Top Honor: {RARITY[topRarity]?.label || 'Common'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: PERSONAL RECORDS (個人記録) ───────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Personal Records
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your highest achievements and all-time personal bests
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            All-Time Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

          {/* 1. Longest Streak */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="card p-4.5 rounded-2xl border border-border bg-surface flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold text-lg">
                🔥
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                Personal Best
              </span>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-foreground">
                {longestStreak} <span className="text-sm font-semibold text-muted-foreground">Days</span>
              </div>
              <div className="text-xs font-bold text-foreground mt-0.5">Longest Streak</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Current active: <span className="font-semibold text-orange-500">{currentStreak} days</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Highest League */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="card p-4.5 rounded-2xl border border-border bg-surface flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <LeagueBadge league={highestLeague?.league} stage={highestLeague?.stage} size={28} />
              </div>
              <Link
                to="/league"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                View League →
              </Link>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-black text-foreground truncate flex items-center gap-2">
                <span>{highestLeague?.label || 'Wakaba'}</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {highestLeague?.league?.jp}
                </span>
              </div>
              <div className="text-xs font-bold text-foreground mt-0.5">Highest League</div>
              <div className="text-[11px] text-muted-foreground mt-1 truncate">
                {nextRung ? `Next: ${nextRung.label}` : 'Top of Fuji Summit! 🗻'}
              </div>
            </div>
          </motion.div>

          {/* 3. Most Wave XP */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="card p-4.5 rounded-2xl border border-border bg-surface flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/15 text-yellow-500 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                All-Time Total
              </span>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-foreground">
                {currentXP.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">XP</span>
              </div>
              <div className="text-xs font-bold text-foreground mt-0.5">Most Wave XP</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Level {Math.floor(currentXP / 100) + 1} Adventurer
              </div>
            </div>
          </motion.div>

          {/* 4. Perfect Lessons */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="card p-4.5 rounded-2xl border border-border bg-surface flex flex-col justify-between relative overflow-hidden group shadow-xs"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold text-lg">
                🎯
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                100% Score
              </span>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-black text-foreground">
                {perfectQuizzesCount} <span className="text-sm font-semibold text-muted-foreground">Passed</span>
              </div>
              <div className="text-xs font-bold text-foreground mt-0.5">Perfect Lessons</div>
              <div className="text-[11px] text-muted-foreground mt-1">
                Flawless quiz completions
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: AWARDS (OBTAINED SLIME STICKERS ONLY) ──────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              <span>🎖️</span> Obtained Slime Awards
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unique Slime Stickers earned through your Japanese dedication
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
            {obtainedAwards.length} Collected
          </span>
        </div>

        {/* If user has obtained awards: Display the Obtained Slime Stickers Gallery */}
        {obtainedAwards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {obtainedAwards.map((award, i) => {
              const rarity = RARITY[award.rarity] || RARITY.common
              return (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.18 } }}
                  onClick={() => setSelectedAward(award)}
                  className={`card p-5 rounded-2xl border ${rarity.border} bg-surface cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-4">
                    {/* Themed Slime Sticker Award */}
                    <div className="shrink-0 p-1 bg-muted/40 rounded-2xl border border-border/60 group-hover:scale-105 transition-transform">
                      <SlimeSticker
                        type={award.sticker}
                        size={84}
                        obtained={true}
                        animated={true}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${rarity.badge}`}>
                          {rarity.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Earned
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-foreground leading-tight truncate">
                        {award.title}
                      </h3>
                      <p className="text-[11px] font-medium text-primary mb-1">
                        {award.japaneseTitle}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {award.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* Empty state if no awards obtained yet */
          <div className="card p-10 text-center rounded-3xl border border-border bg-surface space-y-4">
            <div className="flex justify-center">
              <SlimeSticker type="sparkle" size={110} obtained={true} animated={true} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-foreground">No Slime Awards Unlocked Yet</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complete your first Japanese lesson, maintain a daily streak, or score 100% on a quiz to claim your very first Slime Sticker Award!
              </p>
            </div>
          </div>
        )}

        {/* ── Compact Next Milestone Target (Focused motivation without wall of locked clutter) ── */}
        {upcomingAwards.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" /> Next Slime Award to Unlock
              </span>
              <span className="text-xs text-muted-foreground">
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcomingAwards.slice(0, 2).map((nextAward) => {
                const percent = Math.min(
                  Math.round((nextAward.prog.current / nextAward.prog.target) * 100),
                  100
                )
                return (
                  <div
                    key={nextAward.id}
                    className="p-4 rounded-2xl bg-muted/40 border border-border/70 flex items-center gap-4"
                  >
                    <div className="shrink-0 opacity-75">
                      <SlimeSticker type={nextAward.sticker} size={54} obtained={false} animated={false} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-foreground truncate">
                          {nextAward.title}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                          {nextAward.prog.current} / {nextAward.prog.target}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{nextAward.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Modal for Inspecting an Obtained Slime Sticker ── */}
      <AnimatePresence>
        {selectedAward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative space-y-4"
            >
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              >
                ✕
              </button>

              <div className="pt-2 flex justify-center">
                <SlimeSticker type={selectedAward.sticker} size={140} obtained={true} animated={true} />
              </div>

              <div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${RARITY[selectedAward.rarity]?.badge}`}>
                  {RARITY[selectedAward.rarity]?.label} Award
                </span>
                <h3 className="text-xl font-black text-foreground mt-2">
                  {selectedAward.title}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {selectedAward.japaneseTitle}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {selectedAward.desc}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-muted/50 border border-border text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Award Obtained & Verified
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
