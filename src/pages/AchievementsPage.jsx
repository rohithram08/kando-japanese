import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore } from '../store/progressStore'
import { useThemeStore } from '../store/themeStore'
import { Search } from 'lucide-react'

// ─── Rarity config ──────────────────────────────────────────────────────────
// All Tailwind classes are written in full so the compiler never purges them.
const RARITY = {
  common:    { label: 'Common',    ring: 'ring-gray-400/30',   badge: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',   bar: 'bg-gray-400',   glow: '' },
  uncommon:  { label: 'Uncommon',  ring: 'ring-emerald-400/30',badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', bar: 'bg-emerald-400', glow: '' },
  rare:      { label: 'Rare',      ring: 'ring-blue-400/40',   badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',   bar: 'bg-blue-400',   glow: '' },
  epic:      { label: 'Epic',      ring: 'ring-violet-400/40', badge: 'bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400', bar: 'bg-violet-400', glow: 'shadow-violet-500/20' },
  legendary: { label: 'Legendary', ring: 'ring-amber-400/50',  badge: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',  bar: 'bg-gradient-to-r from-amber-400 to-orange-400', glow: 'shadow-amber-500/30' },
}

// ─── Categories ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',        label: 'All',          emoji: '🏆' },
  { id: 'lessons',    label: 'Lessons',      emoji: '📖' },
  { id: 'kanji',      label: 'Kanji',        emoji: '漢' },
  { id: 'vocabulary', label: 'Vocabulary',   emoji: '📝' },
  { id: 'xp',         label: 'XP & Level',   emoji: '⭐' },
  { id: 'streak',     label: 'Streak',       emoji: '🔥' },
  { id: 'review',     label: 'Review & SRS', emoji: '🔁' },
  { id: 'social',     label: 'Social',       emoji: '👥' },
  { id: 'milestone',  label: 'Milestones',   emoji: '🎯' },
  { id: 'secret',     label: 'Secret',       emoji: '🔮' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const safeNum = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0)

// ─── Achievement definitions ──────────────────────────────────────────────────
const ACHIEVEMENTS = [
  // LESSONS
  { id: 'first_lesson',       category: 'lessons',    rarity: 'common',    emoji: '📖', title: 'First Steps',          desc: 'Complete your first lesson',                              condition: (s)    => safeNum(s.lessonsCompleted) >= 1,    progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 1 })    },
  { id: 'five_lessons',       category: 'lessons',    rarity: 'common',    emoji: '📚', title: 'Bookworm',             desc: 'Complete 5 lessons',                                      condition: (s)    => safeNum(s.lessonsCompleted) >= 5,    progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 5 })    },
  { id: 'ten_lessons',        category: 'lessons',    rarity: 'uncommon',  emoji: '🎓', title: 'Scholar',              desc: 'Complete 10 lessons',                                     condition: (s)    => safeNum(s.lessonsCompleted) >= 10,   progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 10 })   },
  { id: 'twentyfive_lessons', category: 'lessons',    rarity: 'rare',      emoji: '📘', title: 'Diligent Student',     desc: 'Complete 25 lessons',                                     condition: (s)    => safeNum(s.lessonsCompleted) >= 25,   progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 25 })   },
  { id: 'fifty_lessons',      category: 'lessons',    rarity: 'epic',      emoji: '🏫', title: 'Academy Graduate',     desc: 'Complete 50 lessons',                                     condition: (s)    => safeNum(s.lessonsCompleted) >= 50,   progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 50 })   },
  { id: 'hundred_lessons',    category: 'lessons',    rarity: 'legendary', emoji: '🎒', title: 'Sensei Material',      desc: 'Complete 100 lessons',                                    condition: (s)    => safeNum(s.lessonsCompleted) >= 100,  progress: (s)    => ({ current: safeNum(s.lessonsCompleted), target: 100 })  },
  // KANJI
  { id: 'first_kanji',        category: 'kanji',      rarity: 'common',    emoji: '漢', title: 'Kanji Beginner',       desc: 'Learn your first kanji',                                  condition: (s)    => safeNum(s.kanjiLearned) >= 1,       progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 1 })       },
  { id: 'ten_kanji',          category: 'kanji',      rarity: 'common',    emoji: '✍️', title: 'Stroke by Stroke',     desc: 'Learn 10 kanji',                                          condition: (s)    => safeNum(s.kanjiLearned) >= 10,      progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 10 })      },
  { id: 'fifty_kanji',        category: 'kanji',      rarity: 'uncommon',  emoji: '🏯', title: 'Kanji Collector',      desc: 'Learn 50 kanji',                                          condition: (s)    => safeNum(s.kanjiLearned) >= 50,      progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 50 })      },
  { id: 'hundred_kanji',      category: 'kanji',      rarity: 'rare',      emoji: '⛩️', title: 'Kanji Apprentice',     desc: 'Learn 100 kanji',                                         condition: (s)    => safeNum(s.kanjiLearned) >= 100,     progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 100 })     },
  { id: 'twohundred_kanji',   category: 'kanji',      rarity: 'epic',      emoji: '🎌', title: 'Kanji Warrior',        desc: 'Learn 200 kanji (N4 level)',                              condition: (s)    => safeNum(s.kanjiLearned) >= 200,     progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 200 })     },
  { id: 'fivehundred_kanji',  category: 'kanji',      rarity: 'epic',      emoji: '🗾', title: 'Kanji Master',         desc: 'Learn 500 kanji (N3 level)',                              condition: (s)    => safeNum(s.kanjiLearned) >= 500,     progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 500 })     },
  { id: 'thousand_kanji',     category: 'kanji',      rarity: 'legendary', emoji: '🐉', title: 'Kanji Dragon',         desc: 'Learn 1,000 kanji (N2 level)',                            condition: (s)    => safeNum(s.kanjiLearned) >= 1000,    progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 1000 })    },
  { id: 'twothousand_kanji',  category: 'kanji',      rarity: 'legendary', emoji: '👑', title: 'Kanji Emperor',        desc: 'Learn 2,000+ kanji (N1 level)',                           condition: (s)    => safeNum(s.kanjiLearned) >= 2000,    progress: (s)    => ({ current: safeNum(s.kanjiLearned), target: 2000 })    },
  // VOCABULARY
  { id: 'first_vocab',        category: 'vocabulary', rarity: 'common',    emoji: '📝', title: 'Word Learner',         desc: 'Learn your first vocabulary word',                        condition: (s)    => safeNum(s.vocabLearned) >= 1,       progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 1 })       },
  { id: 'twentyfive_vocab',   category: 'vocabulary', rarity: 'common',    emoji: '📒', title: 'Word Collector',       desc: 'Learn 25 vocabulary words',                               condition: (s)    => safeNum(s.vocabLearned) >= 25,      progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 25 })      },
  { id: 'fifty_vocab',        category: 'vocabulary', rarity: 'uncommon',  emoji: '📓', title: 'Vocabulary Starter',   desc: 'Learn 50 vocabulary words',                               condition: (s)    => safeNum(s.vocabLearned) >= 50,      progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 50 })      },
  { id: 'hundred_vocab',      category: 'vocabulary', rarity: 'uncommon',  emoji: '📕', title: 'Vocabulary Builder',   desc: 'Learn 100 vocabulary words',                              condition: (s)    => safeNum(s.vocabLearned) >= 100,     progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 100 })     },
  { id: 'twohundred_vocab',   category: 'vocabulary', rarity: 'rare',      emoji: '📗', title: 'Word Enthusiast',      desc: 'Learn 200 vocabulary words',                              condition: (s)    => safeNum(s.vocabLearned) >= 200,     progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 200 })     },
  { id: 'fivehundred_vocab',  category: 'vocabulary', rarity: 'epic',      emoji: '📙', title: 'Lexicon Expert',       desc: 'Learn 500 vocabulary words',                              condition: (s)    => safeNum(s.vocabLearned) >= 500,     progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 500 })     },
  { id: 'thousand_vocab',     category: 'vocabulary', rarity: 'epic',      emoji: '📖', title: 'Walking Dictionary',   desc: 'Learn 1,000 vocabulary words',                           condition: (s)    => safeNum(s.vocabLearned) >= 1000,    progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 1000 })    },
  { id: 'twothousand_vocab',  category: 'vocabulary', rarity: 'legendary', emoji: '🧠', title: 'Vocabulary Sage',      desc: 'Learn 2,000 vocabulary words',                           condition: (s)    => safeNum(s.vocabLearned) >= 2000,    progress: (s)    => ({ current: safeNum(s.vocabLearned), target: 2000 })    },
  // XP & LEVEL
  { id: 'fifty_xp',           category: 'xp',         rarity: 'common',    emoji: '✨', title: 'Getting Started',      desc: 'Earn 50 XP',                                              condition: (s)    => safeNum(s.totalXP) >= 50,           progress: (s)    => ({ current: safeNum(s.totalXP), target: 50 })           },
  { id: 'hundred_xp',         category: 'xp',         rarity: 'common',    emoji: '⭐', title: 'XP Hunter',            desc: 'Earn 100 XP',                                             condition: (s)    => safeNum(s.totalXP) >= 100,          progress: (s)    => ({ current: safeNum(s.totalXP), target: 100 })          },
  { id: 'fivehundred_xp',     category: 'xp',         rarity: 'uncommon',  emoji: '🌟', title: 'XP Seeker',            desc: 'Earn 500 XP',                                             condition: (s)    => safeNum(s.totalXP) >= 500,          progress: (s)    => ({ current: safeNum(s.totalXP), target: 500 })          },
  { id: 'thousand_xp',        category: 'xp',         rarity: 'uncommon',  emoji: '💫', title: 'XP Master',            desc: 'Earn 1,000 XP',                                           condition: (s)    => safeNum(s.totalXP) >= 1000,         progress: (s)    => ({ current: safeNum(s.totalXP), target: 1000 })         },
  { id: 'twothousand_xp',     category: 'xp',         rarity: 'rare',      emoji: '🔶', title: 'XP Warrior',           desc: 'Earn 2,000 XP',                                           condition: (s)    => safeNum(s.totalXP) >= 2000,         progress: (s)    => ({ current: safeNum(s.totalXP), target: 2000 })         },
  { id: 'fivethousand_xp',    category: 'xp',         rarity: 'rare',      emoji: '💎', title: 'XP Legend',            desc: 'Earn 5,000 XP',                                           condition: (s)    => safeNum(s.totalXP) >= 5000,         progress: (s)    => ({ current: safeNum(s.totalXP), target: 5000 })         },
  { id: 'tenthousand_xp',     category: 'xp',         rarity: 'epic',      emoji: '🏅', title: 'XP Champion',          desc: 'Earn 10,000 XP',                                          condition: (s)    => safeNum(s.totalXP) >= 10000,        progress: (s)    => ({ current: safeNum(s.totalXP), target: 10000 })        },
  { id: 'twentyfivek_xp',     category: 'xp',         rarity: 'epic',      emoji: '👑', title: 'XP Royalty',           desc: 'Earn 25,000 XP',                                          condition: (s)    => safeNum(s.totalXP) >= 25000,        progress: (s)    => ({ current: safeNum(s.totalXP), target: 25000 })        },
  { id: 'fiftyk_xp',          category: 'xp',         rarity: 'legendary', emoji: '🌈', title: 'XP Transcendent',      desc: 'Earn 50,000 XP',                                          condition: (s)    => safeNum(s.totalXP) >= 50000,        progress: (s)    => ({ current: safeNum(s.totalXP), target: 50000 })        },
  { id: 'level_three',        category: 'xp',         rarity: 'common',    emoji: '🔰', title: 'Warming Up',           desc: 'Reach Level 3',                                           condition: (s)    => safeNum(s.level) >= 3,              progress: (s)    => ({ current: safeNum(s.level), target: 3 })              },
  { id: 'level_five',         category: 'xp',         rarity: 'uncommon',  emoji: '🎖️', title: 'Rising Star',          desc: 'Reach Level 5',                                           condition: (s)    => safeNum(s.level) >= 5,              progress: (s)    => ({ current: safeNum(s.level), target: 5 })              },
  { id: 'level_ten',          category: 'xp',         rarity: 'rare',      emoji: '🏅', title: 'Veteran Learner',      desc: 'Reach Level 10',                                          condition: (s)    => safeNum(s.level) >= 10,             progress: (s)    => ({ current: safeNum(s.level), target: 10 })             },
  { id: 'level_fifteen',      category: 'xp',         rarity: 'epic',      emoji: '⚔️', title: 'Elite Student',        desc: 'Reach Level 15',                                          condition: (s)    => safeNum(s.level) >= 15,             progress: (s)    => ({ current: safeNum(s.level), target: 15 })             },
  { id: 'level_twenty',       category: 'xp',         rarity: 'legendary', emoji: '🏆', title: 'Grand Champion',       desc: 'Reach Level 20',                                          condition: (s)    => safeNum(s.level) >= 20,             progress: (s)    => ({ current: safeNum(s.level), target: 20 })             },
  // STREAK
  { id: 'first_day',          category: 'streak',     rarity: 'common',    emoji: '🌱', title: 'Day One',              desc: 'Study for the first time',                                condition: (s)    => safeNum(s.streak) >= 1,             progress: (s)    => ({ current: safeNum(s.streak), target: 1 })             },
  { id: 'three_streak',       category: 'streak',     rarity: 'common',    emoji: '🔥', title: 'On Fire',              desc: 'Maintain a 3-day streak',                                 condition: (s)    => safeNum(s.streak) >= 3,             progress: (s)    => ({ current: safeNum(s.streak), target: 3 })             },
  { id: 'five_streak',        category: 'streak',     rarity: 'uncommon',  emoji: '🔥', title: 'Heat Wave',            desc: 'Maintain a 5-day streak',                                 condition: (s)    => safeNum(s.streak) >= 5,             progress: (s)    => ({ current: safeNum(s.streak), target: 5 })             },
  { id: 'seven_streak',       category: 'streak',     rarity: 'uncommon',  emoji: '📅', title: 'Week Warrior',         desc: 'Maintain a 7-day streak',                                 condition: (s)    => safeNum(s.streak) >= 7,             progress: (s)    => ({ current: safeNum(s.streak), target: 7 })             },
  { id: 'fourteen_streak',    category: 'streak',     rarity: 'rare',      emoji: '💪', title: 'Fortnight Fighter',    desc: 'Maintain a 14-day streak',                                condition: (s)    => safeNum(s.streak) >= 14,            progress: (s)    => ({ current: safeNum(s.streak), target: 14 })            },
  { id: 'twentyone_streak',   category: 'streak',     rarity: 'rare',      emoji: '🧱', title: 'Habit Builder',        desc: 'Maintain a 21-day streak (habit formed!)',                condition: (s)    => safeNum(s.streak) >= 21,            progress: (s)    => ({ current: safeNum(s.streak), target: 21 })            },
  { id: 'thirty_streak',      category: 'streak',     rarity: 'epic',      emoji: '🗓️', title: 'Monthly Master',       desc: 'Maintain a 30-day streak',                                condition: (s)    => safeNum(s.streak) >= 30,            progress: (s)    => ({ current: safeNum(s.streak), target: 30 })            },
  { id: 'sixty_streak',       category: 'streak',     rarity: 'epic',      emoji: '⚡', title: 'Unstoppable',          desc: 'Maintain a 60-day streak',                                condition: (s)    => safeNum(s.streak) >= 60,            progress: (s)    => ({ current: safeNum(s.streak), target: 60 })            },
  { id: 'ninety_streak',      category: 'streak',     rarity: 'legendary', emoji: '💎', title: 'Quarter Champion',     desc: 'Maintain a 90-day streak',                                condition: (s)    => safeNum(s.streak) >= 90,            progress: (s)    => ({ current: safeNum(s.streak), target: 90 })            },
  { id: 'yearly_streak',      category: 'streak',     rarity: 'legendary', emoji: '🌸', title: 'Year of Sakura',       desc: 'Maintain a 365-day streak',                               condition: (s)    => safeNum(s.streak) >= 365,           progress: (s)    => ({ current: safeNum(s.streak), target: 365 })           },
  // REVIEW & SRS
  { id: 'first_review',       category: 'review',     rarity: 'common',    emoji: '🔄', title: 'First Review',         desc: 'Complete your first review session',                      condition: (s)    => safeNum(s.cardsReviewed) >= 1,     progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 1 })     },
  { id: 'ten_reviews',        category: 'review',     rarity: 'common',    emoji: '🃏', title: 'Card Flipper',         desc: 'Review 10 cards',                                         condition: (s)    => safeNum(s.cardsReviewed) >= 10,    progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 10 })    },
  { id: 'fifty_reviews',      category: 'review',     rarity: 'uncommon',  emoji: '🎴', title: 'Review Regular',       desc: 'Review 50 cards',                                         condition: (s)    => safeNum(s.cardsReviewed) >= 50,    progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 50 })    },
  { id: 'hundred_reviews',    category: 'review',     rarity: 'rare',      emoji: '🗃️', title: 'SRS Apprentice',       desc: 'Review 100 cards',                                        condition: (s)    => safeNum(s.cardsReviewed) >= 100,   progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 100 })   },
  { id: 'fivehundred_reviews',category: 'review',     rarity: 'epic',      emoji: '📦', title: 'SRS Master',           desc: 'Review 500 cards',                                        condition: (s)    => safeNum(s.cardsReviewed) >= 500,   progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 500 })   },
  { id: 'thousand_reviews',   category: 'review',     rarity: 'legendary', emoji: '🏛️', title: 'SRS Grandmaster',      desc: 'Review 1,000 cards',                                      condition: (s)    => safeNum(s.cardsReviewed) >= 1000,  progress: (s)    => ({ current: safeNum(s.cardsReviewed), target: 1000 })  },
  // MILESTONES
  { id: 'n5_ready',           category: 'milestone',  rarity: 'uncommon',  emoji: '🎯', title: 'N5 Ready',             desc: 'Learn 100 kanji + 500 vocab',                             condition: (s)    => safeNum(s.kanjiLearned) >= 100 && safeNum(s.vocabLearned) >= 500,                                                            progress: (s)    => ({ current: Math.min(safeNum(s.kanjiLearned), 100) + Math.min(safeNum(s.vocabLearned), 500), target: 600 })              },
  { id: 'n4_ready',           category: 'milestone',  rarity: 'rare',      emoji: '🎯', title: 'N4 Ready',             desc: 'Learn 300 kanji + 1,500 vocab',                           condition: (s)    => safeNum(s.kanjiLearned) >= 300 && safeNum(s.vocabLearned) >= 1500,                                                           progress: (s)    => ({ current: Math.min(safeNum(s.kanjiLearned), 300) + Math.min(safeNum(s.vocabLearned), 1500), target: 1800 })            },
  { id: 'n3_ready',           category: 'milestone',  rarity: 'epic',      emoji: '🎯', title: 'N3 Ready',             desc: 'Learn 650 kanji + 3,500 vocab',                           condition: (s)    => safeNum(s.kanjiLearned) >= 650 && safeNum(s.vocabLearned) >= 3500,                                                           progress: (s)    => ({ current: Math.min(safeNum(s.kanjiLearned), 650) + Math.min(safeNum(s.vocabLearned), 3500), target: 4150 })            },
  { id: 'well_rounded',       category: 'milestone',  rarity: 'rare',      emoji: '🌏', title: 'Well-Rounded',         desc: 'Complete 10+ lessons, 50+ kanji, 100+ vocab',             condition: (s)    => safeNum(s.lessonsCompleted) >= 10 && safeNum(s.kanjiLearned) >= 50 && safeNum(s.vocabLearned) >= 100,                        progress: (s)    => ({ current: Math.min(safeNum(s.lessonsCompleted), 10) + Math.min(safeNum(s.kanjiLearned), 50) + Math.min(safeNum(s.vocabLearned), 100), target: 160 }) },
  { id: 'triple_threat',      category: 'milestone',  rarity: 'epic',      emoji: '🔱', title: 'Triple Threat',        desc: 'Reach Level 10, 7-day streak, and 1,000 XP',             condition: (s)    => safeNum(s.level) >= 10 && safeNum(s.streak) >= 7 && safeNum(s.totalXP) >= 1000,                                             progress: (s)    => ({ current: (safeNum(s.level) >= 10 ? 1 : 0) + (safeNum(s.streak) >= 7 ? 1 : 0) + (safeNum(s.totalXP) >= 1000 ? 1 : 0), target: 3 }) },
  // Note: 'perfectionist' is computed after the first pass — handled in the hook below
  { id: 'perfectionist',      category: 'milestone',  rarity: 'legendary', emoji: '💯', title: 'Perfectionist',        desc: 'Unlock 50 other achievements',                            condition: (_s, u) => u >= 50,                           progress: (_s, u) => ({ current: u, target: 50 })                          },
  // SOCIAL  — time-based: evaluated at render; meaningful only if the store persists a "last studied" timestamp.
  // Tip for future: store `lastStudiedHour` and `lastStudiedDay` in progressStore so these survive page refresh.
  { id: 'night_owl',          category: 'social',     rarity: 'uncommon',  emoji: '🦉', title: 'Night Owl',            desc: 'Study between midnight and 5 AM',                         condition: (s)    => { const h = new Date().getHours(); return (s.studiedAtHour !== undefined ? s.studiedAtHour : h) < 5 },  progress: () => ({ current: 0, target: 1 }) },
  { id: 'early_bird',         category: 'social',     rarity: 'uncommon',  emoji: '🐦', title: 'Early Bird',           desc: 'Study before 7 AM',                                       condition: (s)    => { const h = new Date().getHours(); return (s.studiedAtHour !== undefined ? s.studiedAtHour : h) >= 5 && (s.studiedAtHour !== undefined ? s.studiedAtHour : h) < 7 }, progress: () => ({ current: 0, target: 1 }) },
  { id: 'weekend_warrior',    category: 'social',     rarity: 'common',    emoji: '🎮', title: 'Weekend Warrior',      desc: 'Study on a weekend',                                      condition: (s)    => { const d = new Date().getDay(); return (s.studiedOnDay !== undefined ? s.studiedOnDay : d) === 0 || (s.studiedOnDay !== undefined ? s.studiedOnDay : d) === 6 }, progress: () => ({ current: 0, target: 1 }) },
  { id: 'explorer',           category: 'social',     rarity: 'uncommon',  emoji: '🗺️', title: 'Explorer',             desc: 'Visit every section of the app',                          condition: (s)    => safeNum(s.lessonsCompleted) >= 1 && safeNum(s.kanjiLearned) >= 1 && safeNum(s.vocabLearned) >= 1 && safeNum(s.cardsReviewed) >= 1, progress: (s) => ({ current: (safeNum(s.lessonsCompleted) >= 1 ? 1 : 0) + (safeNum(s.kanjiLearned) >= 1 ? 1 : 0) + (safeNum(s.vocabLearned) >= 1 ? 1 : 0) + (safeNum(s.cardsReviewed) >= 1 ? 1 : 0), target: 4 }) },
  // SECRET
  { id: 'secret_100_daily',   category: 'secret',     rarity: 'epic',      emoji: '🔮', title: 'Daily Grinder',        desc: 'Earn 100+ XP in a single day',                           condition: (s)    => safeNum(s.dailyXP) >= 100,          progress: (s)    => ({ current: Math.min(safeNum(s.dailyXP), 100), target: 100 }) },
  { id: 'secret_first_hour',  category: 'secret',     rarity: 'rare',      emoji: '⏰', title: 'Power Hour',           desc: 'Complete 5 lessons in one session',                      condition: (s)    => safeNum(s.lessonsCompleted) >= 5,   progress: (s)    => ({ current: Math.min(safeNum(s.lessonsCompleted), 5), target: 5 }) },
  { id: 'secret_comeback',    category: 'secret',     rarity: 'uncommon',  emoji: '🔙', title: 'Welcome Back',         desc: 'Return after losing your streak',                        condition: (s)    => safeNum(s.lessonsCompleted) >= 2 && safeNum(s.streak) <= 1, progress: () => ({ current: 0, target: 1 }) },
  { id: 'secret_collector',   category: 'secret',     rarity: 'legendary', emoji: '🌟', title: 'Achievement Hunter',   desc: 'Discover all secret achievements',                       condition: (_s, u, unlockedSecrets) => unlockedSecrets >= 3, progress: (_s, _u, unlockedSecrets) => ({ current: unlockedSecrets ?? 0, target: 3 }) },
]

// ─── Compute unlocked IDs ─────────────────────────────────────────────────────
// Two-pass to handle 'perfectionist' which depends on total unlock count.
// FIX: 'does NOT call store inside a non-hook function' — progress is passed as argument.
function computeUnlockedIds(progress) {
  // Pass 1 — all achievements except those dependent on unlockedCount
  const pass1 = new Set()
  ACHIEVEMENTS.forEach((a) => {
    if (a.id !== 'perfectionist' && a.id !== 'secret_collector') {
      if (a.condition(progress, 0, 0)) pass1.add(a.id)
    }
  })

  const secretIds  = new Set(['secret_100_daily', 'secret_first_hour', 'secret_comeback', 'secret_collector'])
  const unlockedSecrets = [...pass1].filter((id) => secretIds.has(id)).length

  // Pass 2 — add count-dependent ones
  const final = new Set(pass1)
  const perfectionist = ACHIEVEMENTS.find((a) => a.id === 'perfectionist')
  if (perfectionist?.condition(progress, pass1.size, unlockedSecrets)) final.add('perfectionist')
  const collector = ACHIEVEMENTS.find((a) => a.id === 'secret_collector')
  if (collector?.condition(progress, pass1.size, unlockedSecrets)) final.add('secret_collector')

  return final
}

// ─── AchievementCard ─────────────────────────────────────────────────────────
// FIX: receives `progress` and `unlockedCount` as props — no store access here.
function AchievementCard({ achievement, isUnlocked, isDark, progress, unlockedCount, unlockedSecrets }) {
  const rarity     = RARITY[achievement.rarity]
  const isSecret   = achievement.category === 'secret' && !isUnlocked

  const rawProg    = achievement.progress
    ? achievement.progress(progress, unlockedCount, unlockedSecrets)
    : { current: 0, target: 1 }

  const current    = safeNum(rawProg?.current)
  const target     = Math.max(safeNum(rawProg?.target), 1)
  const percent    = Math.min((current / target) * 100, 100)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.18 }}
      className={[
        'relative rounded-2xl border p-4 transition-shadow duration-200',
        // FIX: no dynamic color interpolation — explicit classes only
        isUnlocked
          ? isDark
            ? `bg-gray-900 ring-1 ${rarity.ring} ${rarity.glow ? `shadow-lg ${rarity.glow}` : ''}`
            : `bg-white ring-1 ${rarity.ring} ${rarity.glow ? `shadow-lg ${rarity.glow}` : ''}`
          : 'bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-800',
      ].join(' ')}
    >
      {/* Legendary shimmer strip */}
      {isUnlocked && achievement.rarity === 'legendary' && (
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400" />
      )}

      <div className={`flex items-start gap-3 ${!isUnlocked ? 'opacity-50' : ''}`}>
        {/* Emoji badge */}
        <div className={[
          'w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 select-none',
          isUnlocked
            ? 'bg-muted'
            : 'bg-gray-200/60 dark:bg-gray-800/60',
          !isUnlocked ? 'grayscale' : '',
        ].join(' ')}>
          {isSecret ? '❓' : achievement.emoji}
        </div>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className={`font-semibold text-sm leading-tight ${
              isUnlocked
                ? 'text-foreground'
                : 'text-muted-foreground'
            }`}>
              {isSecret ? '???' : achievement.title}
            </p>

            {/* Rarity badge — FIX: explicit class, not interpolated */}
            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${rarity.badge}`}>
              {rarity.label}
            </span>
          </div>

          {/* Description */}
          <p className={`text-xs leading-snug text-muted-foreground`}>
            {isSecret ? 'Complete a hidden challenge to unlock' : achievement.desc}
          </p>

          {/* Progress bar (locked, non-secret) */}
          {!isUnlocked && !isSecret && (
            <div className="mt-2.5 space-y-1">
              <div className={`h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className={`h-full rounded-full ${rarity.bar}`}
                />
              </div>
              <p className={`text-[10px] tabular-nums text-muted-foreground`}>
                {current.toLocaleString()} / {target.toLocaleString()}
              </p>
            </div>
          )}

          {/* Unlocked badge */}
          {isUnlocked && (
            <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400`}>
              <span>✓</span> Unlocked
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AchievementsPage() {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  // FIX: call the store hook at the top level of the component (correct usage)
  const progress = useProgressStore()

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery,    setSearchQuery]     = useState('')
  const [showFilter,     setShowFilter]      = useState('all') // 'all' | 'unlocked' | 'locked'

  // FIX: compute unlocked set once, outside of AchievementCard
  const unlockedIds = useMemo(() => computeUnlockedIds(progress), [progress])

  const unlockedCount   = unlockedIds.size
  const totalCount      = ACHIEVEMENTS.length
  const completionPct   = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

  const secretIds       = new Set(['secret_100_daily', 'secret_first_hour', 'secret_comeback', 'secret_collector'])
  const unlockedSecrets = [...unlockedIds].filter((id) => secretIds.has(id)).length

  // Rarity breakdown
  const rarityStats = useMemo(() => {
    const stats = {}
    Object.keys(RARITY).forEach((r) => {
      stats[r] = {
        total:    ACHIEVEMENTS.filter((a) => a.rarity === r).length,
        unlocked: ACHIEVEMENTS.filter((a) => a.rarity === r && unlockedIds.has(a.id)).length,
      }
    })
    return stats
  }, [unlockedIds])

  // Filtered list
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return ACHIEVEMENTS.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false
      const isUnlocked = unlockedIds.has(a.id)
      if (showFilter === 'unlocked' && !isUnlocked) return false
      if (showFilter === 'locked'   && isUnlocked)  return false
      if (q) {
        return (
          a.title.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          RARITY[a.rarity].label.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeCategory, showFilter, searchQuery, unlockedIds])

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white shadow-xl shadow-amber-500/25"
      >
        {/* Decorative background glyphs */}
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-10">
          <span className="absolute right-4 top-2 text-8xl">🏆</span>
          <span className="absolute bottom-1 right-32 text-5xl">⭐</span>
          <span className="absolute top-6 right-52 text-4xl">🎖️</span>
        </div>

        <div className="relative space-y-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
            <p className="text-sm text-amber-100 mt-0.5">
              {unlockedCount} of {totalCount} unlocked · {Math.round(completionPct)}% complete
            </p>
          </div>

          {/* Overall progress bar */}
          <div className="max-w-sm">
            <div className="h-2.5 rounded-full bg-white/25">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-2.5 rounded-full bg-white"
              />
            </div>
          </div>

          {/* Per-rarity pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(RARITY).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm"
              >
                {/* FIX: colour dot via inline style instead of dynamic Tailwind class */}
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: dotColor(key) }}
                />
                <span className="text-[11px] font-medium text-white/90">
                  {val.label}: {rarityStats[key]?.unlocked ?? 0}/{rarityStats[key]?.total ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Category tabs ── */}
      <div className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar">
        {CATEGORIES.map(({ id, label, emoji }) => {
          const catUnlocked = id === 'all'
            ? unlockedCount
            : ACHIEVEMENTS.filter((a) => a.category === id && unlockedIds.has(a.id)).length
          const catTotal    = id === 'all'
            ? totalCount
            : ACHIEVEMENTS.filter((a) => a.category === id).length

          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={[
                'flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                activeCategory === id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-muted',
              ].join(' ')}
            >
              <span>{emoji}</span>
              <span>{label}</span>
              <span className={`text-[10px] ${activeCategory === id ? 'text-amber-200' : 'opacity-40'}`}>
                {catUnlocked}/{catTotal}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Search + filter row ── */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements…"
            className={[
              'w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-amber-500',
              'border-gray-200 bg-white text-gray-900 placeholder-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500',
            ].join(' ')}
          />
        </div>

        <div className="flex gap-1.5">
          {[
            { value: 'all',      label: 'All',                       count: null },
            { value: 'unlocked', label: '✅ Unlocked',               count: unlockedCount },
            { value: 'locked',   label: '🔒 Locked',                 count: totalCount - unlockedCount },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setShowFilter(value)}
              className={[
                'rounded-xl border px-3 py-2 text-xs font-medium transition-all',
                  showFilter === value
                    ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white',
              ].join(' ')}
            >
              {label}{count !== null ? ` (${count})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className={`text-xs text-muted-foreground`}>
        {filtered.length} achievement{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'all' && ` · ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
        {searchQuery.trim() && ` · matching "${searchQuery.trim()}"`}
      </p>

      {/* ── Achievement grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((a) => (
              <AchievementCard
                key={a.id}
                achievement={a}
                isUnlocked={unlockedIds.has(a.id)}
                isDark={isDark}
                progress={progress}          // FIX: pass progress as prop, not read inside card
                unlockedCount={unlockedCount}
                unlockedSecrets={unlockedSecrets}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground`}
            >
              <p className="text-5xl mb-3">🔍</p>
              <p className="font-semibold text-sm">No achievements found</p>
              <p className="text-xs mt-1 opacity-70">Try adjusting your filter or search term</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a concrete hex/hsl color for the rarity dot.
 * FIX: avoids dynamic Tailwind class interpolation which gets purged at build time.
 */
function dotColor(rarity) {
  return {
    common:    '#9ca3af', // gray-400
    uncommon:  '#34d399', // emerald-400
    rare:      '#60a5fa', // blue-400
    epic:      '#a78bfa', // violet-400
    legendary: '#fbbf24', // amber-400
  }[rarity] ?? '#9ca3af'
}