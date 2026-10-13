// src/components/ui/ThemeToggle.jsx
import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { motion } from 'framer-motion'

/**
 * Theme switcher. Defaults to light ("white") on first visit; the chosen
 * setting is persisted by themeStore. Two presentations:
 *  - variant="cycle"  → single icon button, click cycles light → dark → system
 *  - variant="segment" (default) → three-way segmented control
 */
const ThemeToggle = ({ showLabel = false, variant = 'segment' }) => {
  const { theme, setTheme } = useThemeStore()

  if (variant === 'cycle') {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(next)}
        className="flex items-center gap-2 p-2 rounded-xl text-muted-foreground
                   hover:bg-muted hover:text-foreground transition-colors"
        title={`Theme: ${theme} — click to switch`}
        aria-label={`Switch theme (currently ${theme})`}
      >
        <Icon className="w-4 h-4" />
        {showLabel && <span className="text-xs font-medium capitalize">{theme}</span>}
      </motion.button>
    )
  }

  const OPTIONS = [
    { value: 'light', Icon: Sun, label: 'Light' },
    { value: 'dark', Icon: Moon, label: 'Dark' },
    { value: 'system', Icon: Monitor, label: 'System' },
  ]

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-1 p-1 rounded-xl border border-border bg-muted"
    >
      {OPTIONS.map(({ value, Icon, label }) => {
        const active = theme === value
        return (
          <motion.button
            type="button"
            key={value}
            role="radio"
            aria-checked={active}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(value)}
            title={label}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
              ${active
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {showLabel && label}
          </motion.button>
        )
      })}
    </div>
  )
}

export default ThemeToggle
