// src/components/curriculum/CategoryView.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shows items within a selected category, with back button, search within
// category, and paginated display (PAGE_SIZE items at a time).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Search, ChevronDown } from 'lucide-react'
import { OTHER_CATEGORY } from '../../data/categories'

const PAGE_SIZE = 30

export default function CategoryView({
  category,        // category definition (or null → use OTHER)
  items,           // items in this category
  onBack,          // () => void — navigate back to grid
  renderCard,      // (item, index) => ReactNode — renders one card
  searchFn,        // (item, query) => bool — custom search filter
  searchPlaceholder = 'Search in this category…',
}) {
  const cat = category || OTHER_CATEGORY
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => searchFn(item, q))
  }, [items, search, searchFn])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])
  const hasMore = visibleCount < filtered.length

  const handleShowMore = useCallback(() => {
    setVisibleCount((c) => c + PAGE_SIZE)
  }, [])

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`rounded-2xl p-5 text-white relative overflow-hidden bg-gradient-to-r ${cat.gradient}`}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
        <div className="relative flex items-start gap-3">
          <button
            onClick={onBack}
            className="mt-0.5 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{cat.emoji}</span>
              <h2 className="text-xl font-bold">{cat.label}</h2>
            </div>
            <p className="text-sm opacity-80">
              {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
              {filtered.length !== items.length && ` (${items.length} total)`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search within category */}
      {items.length > 10 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-surface border-border focus-within:border-foreground/30 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground/70"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          )}
        </div>
      )}

      {/* Items list — paginated */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <React.Fragment key={item.id}>
              {renderCard(item, i)}
            </React.Fragment>
          ))}
        </AnimatePresence>

        {/* Show More button */}
        {hasMore && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleShowMore}
            className="w-full py-3 rounded-xl border border-border bg-surface
              text-sm font-medium text-muted-foreground hover:text-foreground
              hover:border-foreground/30 transition-all flex items-center justify-center gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            Show more ({filtered.length - visibleCount} remaining)
          </motion.button>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-2xl border border-border text-muted-foreground"
          >
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No items found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
