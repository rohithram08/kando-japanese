// ─── XP / Level thresholds and rank data ─────────────────
export const LEVEL_DATA = {
  N5: { min: 0,     max: 2500,  color: 'from-green-400 to-emerald-500',  label: 'Beginner',     next: 'N4' },
  N4: { min: 2500,  max: 8000,  color: 'from-blue-400 to-blue-600',      label: 'Elementary',   next: 'N3' },
  N3: { min: 8000,  max: 20000, color: 'from-purple-400 to-purple-600',  label: 'Intermediate', next: 'N2' },
  N2: { min: 20000, max: 45000, color: 'from-orange-400 to-red-500',     label: 'Advanced',     next: 'N1' },
  N1: { min: 45000, max: 80000, color: 'from-yellow-400 to-amber-500',   label: 'Expert',       next: null },
}

export const LEVELS = Object.keys(LEVEL_DATA) // ['N5','N4','N3','N2','N1']

export const LEVEL_DETAILS = {
  N5: { kanji: 80,   vocab: 800,   grammar: 80,  label: 'Beginner',     color: 'green'  },
  N4: { kanji: 170,  vocab: 1500,  grammar: 165, label: 'Elementary',   color: 'blue'   },
  N3: { kanji: 370,  vocab: 3750,  grammar: 250, label: 'Intermediate', color: 'yellow' },
  N2: { kanji: 1000, vocab: 6000,  grammar: 350, label: 'Advanced',     color: 'orange' },
  N1: { kanji: 2000, vocab: 10000, grammar: 450, label: 'Fluent',       color: 'red'    },
}

export const JLPT_LEVELS = [
  { level: 'N5', label: 'N5 · Beginner',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30'   },
  { level: 'N4', label: 'N4 · Elementary',   color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'     },
  { level: 'N3', label: 'N3 · Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { level: 'N2', label: 'N2 · Advanced',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { level: 'N1', label: 'N1 · Fluent',       color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30'       },
]

export const RANKS = [
  { xp: 0,     title: 'Novice',   icon: 'Shield', color: 'text-gray-400'   },
  { xp: 500,   title: 'Learner',  icon: 'Star',   color: 'text-blue-400'   },
  { xp: 1000,  title: 'Student',  icon: 'Award',  color: 'text-green-400'  },
  { xp: 2500,  title: 'Scholar',  icon: 'Medal',  color: 'text-purple-400' },
  { xp: 5000,  title: 'Expert',   icon: 'Trophy', color: 'text-orange-400' },
  { xp: 10000, title: 'Master',   icon: 'Crown',  color: 'text-yellow-400' },
]

export const MILESTONES = [
  { xp: 100,   label: 'Novice',  icon: 'Shield', unlocked: (xp) => xp >= 100   },
  { xp: 500,   label: 'Learner', icon: 'Star',   unlocked: (xp) => xp >= 500   },
  { xp: 1000,  label: 'Student', icon: 'Award',  unlocked: (xp) => xp >= 1000  },
  { xp: 2500,  label: 'Scholar', icon: 'Medal',  unlocked: (xp) => xp >= 2500  },
  { xp: 5000,  label: 'Expert',  icon: 'Trophy', unlocked: (xp) => xp >= 5000  },
  { xp: 10000, label: 'Master',  icon: 'Crown',  unlocked: (xp) => xp >= 10000 },
]

// Skill progress computation multipliers — change here, affects all pages
export const SKILL_MULTIPLIERS = {
  reading:   { source: 'lessons', multiplier: 5,    cap: 100 },
  writing:   { source: 'kanji',   multiplier: 2,    cap: 100 },
  listening: { source: 'fixed',   fixed: 35,        cap: 100 },
  speaking:  { source: 'fixed',   fixed: 20,        cap: 100 },
  grammar:   { source: 'lessons', multiplier: 3,    cap: 100 },
  vocab:     { source: 'vocab',   multiplier: 0.125,cap: 100 }, // /8 → *0.125
}

// Derive skill percentages from stats (replaces 3 duplicated useMemos)
export function computeSkillData(stats = {}) {
  return Object.fromEntries(
    Object.entries(SKILL_MULTIPLIERS).map(([key, cfg]) => {
      const raw =
        cfg.source === 'fixed'
          ? cfg.fixed
          : (stats[cfg.source] || 0) * cfg.multiplier
      return [key, Math.min(raw, cfg.cap)]
    })
  )
}