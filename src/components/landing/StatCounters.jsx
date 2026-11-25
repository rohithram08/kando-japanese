// src/components/landing/StatCounters.jsx
import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, BookOpen, MessageCircle, Languages } from 'lucide-react'

import { KANJI } from '../../data'

const TOTAL_BUNDLED_KANJI = Object.values(KANJI).reduce(
  (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
  0
)

const STAT_ITEMS = [
  {
    target: 46,
    suffix: '',
    title: 'Foundation Kana',
    titleJp: '基礎仮名',
    description: 'Hiragana & Katakana stroke order with native audio',
    icon: Sparkles,
    iconClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  },
  {
    target: 6,
    suffix: '',
    title: 'Graded Readers',
    titleJp: '多読・多聴',
    description: 'Full native audio, ruby furigana & one-tap SRS intake',
    icon: BookOpen,
    iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    target: 49,
    suffix: '',
    title: 'AI Scenarios',
    titleJp: '実践会話道場',
    description: 'Real-world dialogues & adaptive grammar corrections',
    icon: MessageCircle,
    iconClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  },
  {
    target: TOTAL_BUNDLED_KANJI,
    suffix: '',
    note: '2,136 Jōyō standard',
    title: 'Joyo Kanji Benchmarks',
    titleJp: '常用漢字基準',
    description: 'Curated kanji bundled across N5–N1 with radicals, stroke orders, and mnemonics',
    icon: Languages,
    iconClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
]

function StatItem({ item }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCount(item.target)
      return
    }

    let startTime = null
    const duration = 1200 // ms

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * item.target))

      if (progress < 1) {
        requestAnimationFrame(animateCount)
      } else {
        setCount(item.target)
      }
    }

    const frameId = requestAnimationFrame(animateCount)
    return () => cancelAnimationFrame(frameId)
  }, [isInView, item.target])

  const formattedCount = item.formatComma ? count.toLocaleString() : count
  const Icon = item.icon

  return (
    <div
      ref={ref}
      className="p-5 sm:p-6 rounded-2xl bg-surface border border-border shadow-card flex flex-col justify-between text-left transition-all hover:border-foreground/20 hover:shadow-card-md relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl border ${item.iconClass} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider font-jp bg-surface-muted px-2 py-0.5 rounded-full border border-border">
          {item.titleJp}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight font-mono tabular-nums">
            {formattedCount}
            {item.suffix}
          </span>
          {item.note && (
            <span className="text-xs font-medium text-muted-foreground font-sans">
              ({item.note})
            </span>
          )}
        </div>
        <div className="font-bold text-sm sm:text-base text-foreground mb-1">
          {item.title}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default function StatCounters() {
  return (
    <section className="py-14 bg-background border-t border-border">
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 text-left">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              Authentic Curriculum Benchmarks
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built on Real Japanese Content
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mt-2 sm:mt-0">
            Metrics reflect structured learning materials, interactive scenarios, and official curriculum benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STAT_ITEMS.map((item, idx) => (
            <StatItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
