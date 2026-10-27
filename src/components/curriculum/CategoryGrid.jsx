// src/components/curriculum/CategoryGrid.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Renders a grid of clickable thematic category tiles. Each tile shows:
//   emoji · category name · item count · small progress ring
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react'
import { motion } from 'framer-motion'
import { OTHER_CATEGORY } from '../../data/categories'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}
const tile = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1 },
}

export default function CategoryGrid({ categories, categorizedMap, onSelect }) {
  // Build ordered list: known categories first, then "other"
  const entries = []
  for (const cat of categories) {
    const items = categorizedMap.get(cat.id)
    if (items && items.length > 0) {
      entries.push({ ...cat, count: items.length })
    }
  }
  // Append "other" if it exists
  const otherItems = categorizedMap.get('other')
  if (otherItems && otherItems.length > 0) {
    entries.push({ ...OTHER_CATEGORY, count: otherItems.length })
  }

  if (entries.length === 0) return null

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
    >
      {entries.map((cat) => (
        <motion.button
          key={cat.id}
          variants={tile}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(cat.id)}
          className={`relative overflow-hidden rounded-2xl p-4 text-left transition-shadow
            hover:shadow-lg active:shadow-sm cursor-pointer group
            bg-gradient-to-br ${cat.gradient} text-white`}
        >
          {/* Decorative circles */}
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative">
            <span className="text-2xl sm:text-3xl block mb-2 drop-shadow-sm">
              {cat.emoji}
            </span>
            <h3 className="text-sm sm:text-base font-bold leading-tight mb-1 drop-shadow-sm">
              {cat.label}
            </h3>
            <span className="text-xs font-medium opacity-80">
              {cat.count} {cat.count === 1 ? 'item' : 'items'}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}
