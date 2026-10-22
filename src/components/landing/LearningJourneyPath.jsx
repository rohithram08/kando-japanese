// src/components/landing/LearningJourneyPath.jsx
import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  Sparkles, BookOpen, MessageCircle, RefreshCw,
  ArrowRight, Bot, Compass
} from 'lucide-react'
import { playPop } from '../../utils/soundEffects'
import KanaMiniDemo from './demos/KanaMiniDemo'
import ReaderMiniDemo from './demos/ReaderMiniDemo'
import DojoMiniDemo from './demos/DojoMiniDemo'
import SRSMiniDemo from './demos/SRSMiniDemo'
import SparkMiniDemo from './demos/SparkMiniDemo'

const JOURNEY_STEPS = [
  {
    stepNumber: '01',
    stage: 'Foundations',
    stageJp: '基礎固め',
    title: 'Kana Studio & Pronunciation',
    tagline: 'Build your Japanese writing foundations step by step.',
    desc: 'Interactive stroke order diagrams, authentic native audio, and mnemonic memory cards for all 46 Hiragana and 46 Katakana characters. Clear explanations and guided practice to build confidence.',
    actionText: 'Explore Kana Studio',
    link: '/kana',
    badge: 'Beginner Ready',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    icon: Sparkles,
    gradient: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e',
    previewSnippet: {
      type: 'kana',
      items: [
        { char: 'あ', romaji: 'a' },
        { char: 'い', romaji: 'i' },
        { char: 'う', romaji: 'u' },
        { char: 'え', romaji: 'e' },
        { char: 'お', romaji: 'o' },
      ],
    },
  },
  {
    stepNumber: '02',
    stage: 'Comprehensible Input',
    stageJp: '多読・多聴',
    title: 'JLPT Graded Readers',
    tagline: 'Read authentic stories that match your exact proficiency level.',
    desc: 'Six curated N5 & N4 stories with toggleable furigana, pitch accent contours, sentence-by-sentence native speech, and one-tap vocabulary lookups. Add new words directly into your SRS review deck.',
    actionText: 'Read 6 Graded Stories',
    link: '/reading',
    badge: 'Public Guest Access',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: BookOpen,
    gradient: 'from-teal-500 to-emerald-600',
    accentColor: '#10b981',
    previewSnippet: {
      type: 'story',
      title: "学生の一日 (A Student's Day)",
      japanese: '八時半に電車で学校へ行きます。',
      english: 'At 8:30, I go to school by train.',
    },
  },
  {
    stepNumber: '03',
    stage: 'Interactive Output',
    stageJp: '会話実践',
    title: 'Unified Conversation Practice',
    tagline: 'Bridge textbooks to real conversations in Japan.',
    desc: 'Engage in 49 structured roleplay scenarios—ordering ramen, booking hotels, navigating train delays, and professional keigo. Switch anytime to Free Talk with real-time AI grammar feedback.',
    actionText: 'Enter Conversation Dojo',
    link: '/conversation',
    badge: '49 Scenarios + Free Talk',
    badgeColor: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    icon: MessageCircle,
    gradient: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    previewSnippet: {
      type: 'dialogue',
      sensei: '「いらっしゃいませ！何名様ですか？」',
      user: '「一人です。カウンター席は空いていますか？」',
      correction: '✓ Natural polite phrasing (N5~N4)',
    },
  },
  {
    stepNumber: '04',
    stage: 'Long-Term Retention',
    stageJp: '記憶定着',
    title: 'Spaced Repetition System (SRS)',
    tagline: 'Lock vocabulary and kanji into memory right before you forget.',
    desc: 'Powered by the scientific SM-2 spaced repetition algorithm. Schedule reviews at increasing intervals to support long-term retention.',
    actionText: 'Review Flashcard Deck',
    link: '/review',
    badge: 'Scientific SM-2',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: RefreshCw,
    gradient: 'from-orange-500 to-amber-600',
    accentColor: '#f59e0b',
    previewSnippet: {
      type: 'srs',
      intervals: ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Mastered ✨'],
    },
  },
  {
    stepNumber: '05',
    stage: 'Personalized Coaching',
    stageJp: '個別指導',
    title: 'Hana-sensei AI Companion',
    tagline: 'An encouraging bilingual mentor who guides you every day.',
    desc: 'Hana-sensei adapts to your JLPT target, tracks your study streaks, explains complex grammar nuances in plain English, and celebrates every learning milestone.',
    actionText: 'Meet Hana-sensei',
    link: '/sensei',
    badge: 'Adaptive Tutoring',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: Bot,
    gradient: 'from-purple-500 to-indigo-600',
    accentColor: '#8b5cf6',
    previewSnippet: {
      type: 'coach',
      message: '「毎日の小さな積み重ねが、大きな力になります！」',
      translation: 'Small daily steps build tremendous strength!',
    },
  },
]

function JourneyStepCard({ step, idx, prefersReducedMotion }) {
  const cardRef = useRef(null)
  const isEven = idx % 2 === 1

  const { scrollYProgress: cardProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })

  // Subtle scroll parallax for the background watermark number
  const watermarkY = useTransform(
    cardProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-25, 25]
  )

  const hasObserver =
    typeof window !== 'undefined' && 'IntersectionObserver' in window

  return (
    <motion.div
      ref={cardRef}
      initial={
        prefersReducedMotion || !hasObserver
          ? { opacity: 1, x: 0, y: 0, scale: 1 }
          : { opacity: 0, x: isEven ? 36 : -36, y: 24, scale: 0.98 }
      }
      whileInView={
        prefersReducedMotion || !hasObserver
          ? undefined
          : { opacity: 1, x: 0, y: 0, scale: 1 }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={
        prefersReducedMotion
          ? { duration: 0.25 }
          : { type: 'spring', stiffness: 280, damping: 26, delay: 0.05 }
      }
      className="card p-6 sm:p-8 lg:p-10 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 shadow-lg bg-surface/90 backdrop-blur-sm relative overflow-hidden group"
    >
      {/* Parallax numeral watermark */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute top-2 right-5 sm:right-8 text-7xl sm:text-8xl font-black text-muted/20 dark:text-muted/15 select-none pointer-events-none font-mono"
        aria-hidden="true"
      >
        {step.stepNumber}
      </motion.div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
          isEven ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Text Column */}
        <div
          className={`lg:col-span-7 flex flex-col items-start text-left ${
            isEven ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {/* Stage Pill */}
          <div className="flex items-center gap-2 mb-3 z-10">
            <span
              className={`text-[11px] font-bold px-3 py-1 rounded-full border ${step.badgeColor}`}
            >
              Step {step.stepNumber} · {step.stage} ({step.stageJp})
            </span>
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
              {step.badge}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2 group-hover:text-primary transition-colors z-10">
            {step.title}
          </h3>

          <p className="text-sm sm:text-base font-semibold text-primary/90 mb-3 z-10">
            {step.tagline}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl z-10">
            {step.desc}
          </p>

          <Link
            to={step.link}
            onClick={() => playPop()}
            className="btn-3d-primary py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 z-10"
          >
            <span>{step.actionText}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Visual Preview Column */}
        <div
          className={`lg:col-span-5 z-10 ${
            isEven ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border/80 shadow-inner">
            {step.stepNumber === '01' && <KanaMiniDemo />}
            {step.stepNumber === '02' && <ReaderMiniDemo />}
            {step.stepNumber === '03' && <DojoMiniDemo />}
            {step.stepNumber === '04' && <SRSMiniDemo />}
            {step.stepNumber === '05' && <SparkMiniDemo />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LearningJourneyPath() {
  const containerRef = useRef(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const checkMotion = () => {
      setPrefersReducedMotion(
        mediaQuery.matches ||
          document.documentElement.classList.contains('reduce-motion')
      )
    }
    checkMotion()
    mediaQuery.addEventListener?.('change', checkMotion)
    return () => mediaQuery.removeEventListener?.('change', checkMotion)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  })

  const spineScaleY = useTransform(smoothProgress, [0, 1], [0, 1])

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-28 bg-surface/30 border-t border-border relative overflow-hidden"
    >
      {/* Decorative background ambient glow */}
      <div
        className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-red-500/5 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Fluency Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            A Complete Learning Journey,{' '}
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Step by Step
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Not just isolated flashcards or drills. Kando Japanese connects
            comprehension, conversation, and memory into an unbroken learning
            continuum.
          </p>
        </div>

        {/* ── Connecting Scroll Spine (Desktop & Mobile) ───────────── */}
        <div
          className="absolute left-6 lg:left-1/2 top-48 bottom-12 -translate-x-1/2 w-3 pointer-events-none z-0 hidden sm:block"
          aria-hidden="true"
        >
          {/* Subtle background track */}
          <div className="w-0.5 h-full mx-auto bg-border/60 dark:bg-border/40" />

          {/* Animated active progress indicator */}
          {!prefersReducedMotion && (
            <motion.div
              style={{
                scaleY: spineScaleY,
                transformOrigin: 'top center',
              }}
              className="absolute inset-x-0 top-0 w-1 mx-auto h-full bg-gradient-to-b from-rose-500 via-teal-500 via-cyan-500 via-amber-500 to-purple-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            />
          )}
        </div>

        {/* ── Sequential Journey Steps with Alternating Reveals ──────── */}
        <div className="space-y-8 lg:space-y-12 relative z-10">
          {JOURNEY_STEPS.map((step, idx) => (
            <JourneyStepCard
              key={step.stepNumber}
              step={step}
              idx={idx}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
