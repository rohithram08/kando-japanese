// src/components/landing/LearningJourneyPath.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, BookOpen, MessageCircle, RefreshCw, Languages,
  ArrowRight, CheckCircle2, Bot, Layers, Compass, Zap
} from 'lucide-react'

const JOURNEY_STEPS = [
  {
    stepNumber: '01',
    stage: 'Foundations',
    stageJp: '基礎固め',
    title: 'Kana Studio & Pronunciation',
    tagline: 'Master the building blocks of Japanese writing in days, not months.',
    desc: 'Interactive stroke order diagrams, authentic native audio, and mnemonic memory cards for all 46 Hiragana and 46 Katakana characters. Zero confusion, immediate confidence.',
    actionText: 'Explore Kana Studio',
    link: '/kana',
    badge: 'Beginner Ready',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    icon: Sparkles,
    gradient: 'from-rose-500 to-pink-600',
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
    previewSnippet: {
      type: 'story',
      title: '健太の初めての電車 (Kenta\'s First Train)',
      japanese: '健太は七歳で、今日初めて一人で電車に乗ります。',
      english: 'Kenta is seven years old and rides the train alone for the first time today.',
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
    desc: 'Powered by the scientific SM-2 spaced repetition algorithm. Cards automatically schedule reviews across increasing intervals (1d → 3d → 7d → 14d → 30d) for permanent recall.',
    actionText: 'Review Flashcard Deck',
    link: '/review',
    badge: 'Scientific SM-2',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: RefreshCw,
    gradient: 'from-orange-500 to-amber-600',
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
    previewSnippet: {
      type: 'coach',
      message: '「毎日の小さな積み重ねが、大きな力になります！」',
      translation: 'Small daily steps build tremendous strength!',
    },
  },
]

export default function LearningJourneyPath() {
  return (
    <section className="py-20 md:py-28 bg-surface/30 border-t border-border relative overflow-hidden">
      
      {/* Decorative background ambient glow */}
      <div
        className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-red-500/5 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            Not just isolated flashcards or drills. Nihongo Master connects comprehension, conversation,
            and memory into an unbroken learning continuum.
          </p>
        </div>

        {/* ── Sequential Journey Steps ───────────────────────────────── */}
        <div className="space-y-8 lg:space-y-12">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon
            const isEven = idx % 2 === 1

            return (
              <div
                key={step.stepNumber}
                className="card p-6 sm:p-8 lg:p-10 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 shadow-lg bg-surface/90 backdrop-blur-sm relative overflow-hidden group"
              >
                {/* Step indicator watermark */}
                <div
                  className="absolute top-4 right-6 text-6xl sm:text-7xl font-black text-muted/30 select-none pointer-events-none font-mono"
                  aria-hidden="true"
                >
                  {step.stepNumber}
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Text Column */}
                  <div className={`lg:col-span-7 flex flex-col items-start text-left ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    
                    {/* Stage Pill */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${step.badgeColor}`}>
                        Step {step.stepNumber} · {step.stage} ({step.stageJp})
                      </span>
                      <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                        {step.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-foreground mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-sm sm:text-base font-semibold text-primary/90 mb-3">
                      {step.tagline}
                    </p>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl">
                      {step.desc}
                    </p>

                    <Link
                      to={step.link}
                      className="btn-3d-primary py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 group-hover:scale-105 transition-transform"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Visual Preview Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border/80 shadow-inner">
                      
                      {/* Kana Preview */}
                      {step.previewSnippet.type === 'kana' && (
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                            <span>Vowel Row Practice</span>
                            <span className="text-primary font-mono text-[10px]">5 Sounds</span>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {step.previewSnippet.items.map((k) => (
                              <div
                                key={k.char}
                                className="p-3 rounded-xl bg-surface border border-border shadow-sm text-center transform transition-transform hover:-translate-y-1 hover:border-primary"
                              >
                                <div className="text-xl sm:text-2xl font-bold font-jp text-foreground">{k.char}</div>
                                <div className="text-[10px] text-muted-foreground font-mono uppercase">{k.romaji}</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
                            Stroke animations · Audio playback · Mnemonic cards
                          </div>
                        </div>
                      )}

                      {/* Story Preview */}
                      {step.previewSnippet.type === 'story' && (
                        <div className="space-y-3 text-left">
                          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{step.previewSnippet.title}</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-surface border border-border shadow-sm">
                            <p className="text-base font-bold text-foreground font-jp mb-1.5 leading-relaxed">
                              {step.previewSnippet.japanese}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              "{step.previewSnippet.english}"
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                            <span>✓ Native Audio</span>
                            <span>✓ Furigana Toggle</span>
                            <span>✓ 1-Tap SRS Add</span>
                          </div>
                        </div>
                      )}

                      {/* Dialogue Preview */}
                      {step.previewSnippet.type === 'dialogue' && (
                        <div className="space-y-2.5 text-left">
                          <div className="p-2.5 rounded-xl bg-surface border border-border shadow-sm flex items-start gap-2">
                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 shrink-0">店員:</span>
                            <span className="text-xs font-bold text-foreground font-jp">{step.previewSnippet.sensei}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-sm flex items-start gap-2">
                            <span className="text-xs font-bold text-primary shrink-0">あなた:</span>
                            <span className="text-xs font-bold text-foreground font-jp">{step.previewSnippet.user}</span>
                          </div>
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold text-center pt-1">
                            {step.previewSnippet.correction}
                          </div>
                        </div>
                      )}

                      {/* SRS Interval Preview */}
                      {step.previewSnippet.type === 'srs' && (
                        <div className="space-y-3">
                          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left">
                            Memory Scheduling Curve
                          </div>
                          <div className="flex items-center justify-between gap-1 text-center">
                            {step.previewSnippet.intervals.map((intv, i) => (
                              <div key={intv} className="flex-1">
                                <div className={`py-1.5 rounded-lg text-[10px] font-bold border ${
                                  i === 4
                                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 font-black'
                                    : 'bg-surface border-border text-foreground'
                                }`}>
                                  {intv}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
                            Automatic spacing guarantees 95%+ long-term recall
                          </div>
                        </div>
                      )}

                      {/* Coach Preview */}
                      {step.previewSnippet.type === 'coach' && (
                        <div className="space-y-3 text-left">
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                            <Bot className="w-3.5 h-3.5" />
                            <span>Hana-sensei's Daily Spark</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-surface border border-border shadow-sm">
                            <p className="text-sm font-bold text-foreground font-jp mb-1">
                              {step.previewSnippet.message}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                              "{step.previewSnippet.translation}"
                            </p>
                          </div>
                          <div className="text-[11px] text-muted-foreground text-center pt-1 font-medium">
                            Streak tracking · Keigo tuning · Cultural context
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
