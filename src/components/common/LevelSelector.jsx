// src/components/common/LevelSelector.jsx
// Reusable JLPT level tab bar used on Grammar, Kanji, Vocab, Lessons pages.
// Resolves its own theme — callers don't need to compute/pass isDark.

import React from 'react'
import { motion } from 'framer-motion'
import { LEVEL_META, LEVELS } from '../../data/levels'
import { useThemeStore } from '../../store/themeStore'

export default function LevelSelector({ selected, onChange, counts = {} }) {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="flex gap-2 flex-wrap">
      {LEVELS.map((level) => {
        const meta = LEVEL_META[level]
        const active = selected === level
        const count = counts[level]

        return (
          <motion.button
            key={level}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(level)}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              active
                ? isDark
                  ? `${meta.darkBg} ${meta.darkBorder} ${meta.darkText} shadow-lg shadow-black/20`
                  : `${meta.lightBg} ${meta.lightBorder} ${meta.lightText} shadow-md`
                : 'bg-surface border-border text-muted-foreground hover:border-foreground/20 hover:bg-muted'
            }`}
          >
            {level}
            {count !== undefined && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                active ? (isDark ? 'bg-white/10' : 'bg-black/10') : 'bg-muted text-muted-foreground'
              }`}>
                {count}
              </span>
            )}
            {active && (
              <motion.div
                layoutId="levelUnderline"
                className={`absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r ${meta.gradient}`}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
