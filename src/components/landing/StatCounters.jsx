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
    color: 'from-rose-500 to-pink-500',
    border: 'border-rose-500/20',
  },
  {
    target: 6,
    suffix: '',
    title: 'Graded Readers',
    titleJp: '多読・多聴',
    description: 'Full native audio, ruby furigana & one-tap SRS intake',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    border: 'border-emerald-500/20',
  },
  {
    target: 49,
    suffix: '',
    title: 'AI Scenarios',
    titleJp: '実践会話道場',
    description: 'Real-world dialogues & adaptive grammar corrections',
    icon: MessageCircle,
    color: 'from-cyan-500 to-blue-500',
    border: 'border-cyan-500/20',
  },
  {
    target: TOTAL_BUNDLED_KANJI,
    suffix: '',
    note: '2,136 Jōyō standard',
    title: 'Joyo Kanji Benchmarks',
    titleJp: '常用漢字基準',
    description: 'Curated kanji bundled across N5–N1 with radicals, stroke orders, and mnemonics',
    icon: Languages,
    color: 'from-purple-500 to-indigo-500',
    border: 'border-purple-500/20',
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
    <motion.div
      ref={ref}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      className={`p-5 sm:p-6 rounded-3xl bg-surface border ${item.border} shadow-sm flex flex-col justify-between text-left transition-all hover:shadow-md relative overflow-hidden group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-jp bg-muted/70 px-2 py-0.5 rounded-full border border-border/50">
          {item.titleJp}
        </span>
      </div>

      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-mono">
            {formattedCount}
            {item.suffix}
          </span>
          {item.note && (
            <span className="text-xs font-semibold text-muted-foreground font-sans">
              ({item.note})
            </span>
          )}
        </div>
        <div className="font-extrabold text-sm sm:text-base text-foreground mb-1">
          {item.title}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function StatCounters() {
  return (
    <section className="py-12 bg-background border-t border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2.5 border border-primary/20">
              <span>Authentic Curriculum Benchmarks</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
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
