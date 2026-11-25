// src/pages/LandingPage.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, BookOpen, MessageCircle, RefreshCw, Languages,
  Award, ArrowRight, CheckCircle2, Volume2, VolumeX,
  ChevronRight, GraduationCap
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import ThemeToggle from '../components/ui/ThemeToggle'
import SakuraPetals2D from '../components/landing/SakuraPetals2D'
import AnimatedCharacterHero from '../components/landing/AnimatedCharacterHero'
import KandoSlimeLogo from '../components/mascot/KandoSlimeLogo'
import LearningJourneyPath from '../components/landing/LearningJourneyPath'
import JLPTLevelPicker from '../components/landing/JLPTLevelPicker'
import StatCounters from '../components/landing/StatCounters'
import {
  HEADLINE_CONTAINER,
  HEADLINE_ITEM,
  FADE_UP_SPRING,
} from '../constants/animations'
import { isSoundEnabled, toggleSound, playPop } from '../utils/soundEffects'
import SEO from '../components/common/SEO'
import '../components/landing/landingAnimations.css'


const FEATURES = [
  {
    icon: BookOpen,
    title: 'JLPT Graded Readers',
    titleJp: '多読・多聴',
    iconClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    desc: 'Six meticulously curated N5 and N4 stories with toggleable furigana, pitch accent contours, sentence-by-sentence native audio, and one-tap dictionary lookup with Add to SRS.',
    link: '/reading',
    badge: 'Public Guest Access',
  },
  {
    icon: MessageCircle,
    title: 'Conversation Practice',
    titleJp: '会話練習・道場',
    iconClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    desc: '49 real-world scenarios across dining, travel, shopping, and business keigo, plus an open Free Talk mode with real-time grammar feedback and natural voice pronunciation.',
    link: '/conversation',
    badge: '49 Scenarios + Free Talk',
  },
  {
    icon: Sparkles,
    title: 'Kana Studio',
    titleJp: '仮名スタジオ',
    iconClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    desc: 'Master Hiragana and Katakana from scratch with stroke order animations, audio pronunciation, mnemonic cards, and interactive rapid-fire quizzes.',
    link: '/kana',
    badge: 'Beginner Ready',
  },
  {
    icon: RefreshCw,
    title: 'Spaced Repetition System',
    titleJp: 'SRS復習システム',
    iconClass: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    desc: 'Scientifically scheduled review intervals for vocabulary and kanji. Reviews are calculated to lock words into long-term memory right before you forget them.',
    link: '/review',
    badge: 'SM-2 Algorithm',
  },
  {
    icon: Languages,
    title: 'Kanji & Grammar Guides',
    titleJp: '漢字・文法マスター',
    iconClass: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    desc: 'Deep dive into stroke order, radical breakdowns, onyomi/kunyomi readings, and grammatical sentence patterns organized systematically from N5 to N1.',
    link: '/kanji',
    badge: 'N5 to N1 Comprehensive',
  },
  {
    icon: GraduationCap,
    title: 'Hana-sensei 3D Studio',
    titleJp: '花先生 3D教室',
    iconClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    desc: 'An encouraging bilingual Japanese teacher who adapts explanations to your current JLPT level, celebrates study streaks, and guides you through complex grammar nuances.',
    link: '/sensei',
    badge: 'Adaptive Coaching',
  },
]

export default function LandingPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Instant redirect if user is already logged in (never flash landing hero)
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const [selectedLevel, setSelectedLevel] = useState('N5')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [_heroCtaVisible, setHeroCtaVisible] = useState(true)
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const heroCtaRef = useRef(null)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroCtaVisible(entry.isIntersecting)
      },
      { rootMargin: '-64px 0px 0px 0px', threshold: 0.1 }
    )
    if (heroCtaRef.current) {
      observer.observe(heroCtaRef.current)
    }
    return () => observer.disconnect()
  }, [])

  const handleToggleSound = () => {
    const next = toggleSound()
    setSoundOn(next)
    if (next) playPop()
  }

  const speakJapanese = (text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ja-JP'
    utterance.rate = 0.85
    setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-red-500/20 selection:text-red-500 relative">
      <SEO
        title="Kando Japanese (感動) - Learn Japanese & JLPT Mastery"
        description="Comprehensive Japanese language learning platform from JLPT N5 to N1. Master Japanese with Hana-sensei, 250+ interactive lessons, spaced repetition SRS, kanji engine, and graded readers."
        path="/"
      />
      
      {/* ── Public Top Navigation Bar ────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border transition-colors">
        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl shrink-0">
            <KandoSlimeLogo size={32} animated showBlossom className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-foreground whitespace-nowrap">
                Kando Japanese
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 font-medium font-jp tracking-wider whitespace-nowrap">
                感動 — 日本語学習
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#curriculum" className="hover:text-foreground transition-colors">JLPT Levels</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <Link to="/reading" className="hover:text-foreground transition-colors">Graded Reader</Link>
            <Link to="/kana" className="hover:text-foreground transition-colors">Kana Studio</Link>
            <Link to="/conversation" className="hover:text-foreground transition-colors">Conversation</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* UI Sound FX Toggle (Muted by default) */}
            <button
              type="button"
              onClick={handleToggleSound}
              className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title={soundOn ? 'UI sound effects: ON (click to mute)' : 'UI sound effects: OFF (click to enable)'}
              aria-label={soundOn ? 'Mute UI sound effects' : 'Enable UI sound effects'}
            >
              {soundOn ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-50" />
              )}
            </button>

            <ThemeToggle variant="cycle" />

            {user ? (
              <button
                type="button"
                onClick={() => { playPop(); navigate('/dashboard') }}
                className="btn-3d-primary py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { playPop(); navigate('/login') }}
                  className="hidden sm:inline-flex px-3.5 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  Sign In
                </button>

                {/* Mobile Always-Visible Compact CTA */}
                <button
                  type="button"
                  onClick={() => { playPop(); navigate('/register') }}
                  className="sm:hidden btn-3d-primary py-1.5 px-3 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                {/* Desktop/Tablet Primary CTA */}
                <button
                  type="button"
                  onClick={() => { playPop(); navigate('/register') }}
                  className="hidden sm:inline-flex btn-3d-primary py-2 px-4 text-xs sm:text-sm font-semibold rounded-xl items-center gap-1.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ────────────────────────────────────── */}
      <main className="flex-1">
        
        {/* ── Hero Section ─────── */}
        <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-24">
          
          {/* 2D Sakura Petals Drifting Across the Hero */}
          <SakuraPetals2D />

          <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column: High-contrast Typography & Clear CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={HEADLINE_CONTAINER}
                  className="w-full"
                >
                  {/* Structured Eyebrow Tag */}
                  <motion.div
                    variants={HEADLINE_ITEM}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-muted border border-border text-muted-foreground text-xs font-semibold mb-5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    <span>Comprehensive JLPT N5–N1 Learning Platform</span>
                  </motion.div>

                  {/* Primary Headline */}
                  <h1 className="mb-6">
                    <motion.span
                      variants={HEADLINE_ITEM}
                      className="block text-base sm:text-lg font-semibold text-muted-foreground tracking-wide mb-2"
                    >
                      Master Japanese as a Living Language
                    </motion.span>
                    <motion.span
                      variants={HEADLINE_ITEM}
                      className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
                    >
                      Learn Japanese.{' '}
                      <span className="text-primary">
                        Live the Language.
                      </span>
                    </motion.span>
                  </h1>

                  {/* Concise Pedagogical Overview */}
                  <motion.p
                    variants={FADE_UP_SPRING}
                    className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl"
                  >
                    Immerse yourself in curated graded readers, interactive conversational roleplay,
                    spaced repetition vocabulary, and structured guidance from Hana-sensei.
                    From your very first Hiragana stroke to N1 fluency.
                  </motion.p>
                </motion.div>

                {/* Primary CTA Buttons */}
                <div ref={heroCtaRef} className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-8">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => { playPop(); navigate('/dashboard') }}
                      className="btn-3d-primary py-3 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                      <span>Continue to Your Dashboard</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { playPop(); navigate('/register') }}
                        aria-label="Start Learning Free - Get Started Free"
                        className="btn-3d-primary py-3 px-7 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { playPop(); navigate('/login') }}
                        className="btn-3d-secondary py-3 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <span>Sign In</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Public guest explore links */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground pt-3 border-t border-border/70 w-full">
                  <span className="font-semibold text-foreground">Explore Without Account:</span>
                  <Link
                    to="/reading"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Graded Reader (6 Stories)</span>
                  </Link>
                  <span className="text-muted-foreground/40" aria-hidden="true">•</span>
                  <Link
                    to="/kana"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kana Studio</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Prominent 2D Animated Hana-sensei Character Stage */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <AnimatedCharacterHero
                  onSpeak={speakJapanese}
                  isSpeaking={isPlayingAudio}
                />
              </div>

            </div>
          </div>
        </section>

        {/* ── JLPT Curriculum & Interactive Showcase ──────────────── */}
        <JLPTLevelPicker
          selectedLevel={selectedLevel}
          onSelectLevel={setSelectedLevel}
          speakJapanese={speakJapanese}
          isPlayingAudio={isPlayingAudio}
        />

        {/* ── Complete Connected Learning Journey Roadmap ─────────── */}
        <LearningJourneyPath />

        {/* ── Authentic Curriculum Benchmarks ─────────────────────── */}
        <StatCounters />

        {/* ── Feature Highlights Grid ──────────────────────────────── */}
        <section id="features" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-2.5">
                <span>Modern Japanese Learning Stack</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Tools to Help You Build Japanese Fluency
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
                Built from the ground up combining linguistic science, spaced repetition, and modern web performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <div
                    key={idx}
                    className="card p-6 rounded-2xl border border-border hover:border-foreground/20 hover:shadow-card-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl border ${feat.iconClass} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-surface-muted text-muted-foreground border border-border">
                          {feat.badge}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-2">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {feat.title}
                        </h3>
                        <span className="text-xs text-muted-foreground font-jp">
                          {feat.titleJp}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {feat.desc}
                      </p>
                    </div>

                    <Link
                      to={feat.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Explore feature</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Ready to Start Learning CTA Banner ───────────────────── */}
        <section className="py-16 bg-surface-muted/40 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card p-8 sm:p-12 rounded-2xl border border-border shadow-card-md relative overflow-hidden bg-surface">
              <div className="relative z-10 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <Award className="w-6 h-6" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                  Start Your Japanese Journey Today
                </h2>
                
                <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                  Create your free account to track study streaks, save vocabulary to your SRS review deck,
                  and practice conversation with live contextual guidance.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => { playPop(); navigate('/dashboard') }}
                      className="btn-3d-primary py-3 px-7 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2"
                    >
                      <span>Go to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { playPop(); navigate('/register') }}
                        className="btn-3d-primary py-3 px-7 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2"
                      >
                        <span>Get Started Free</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { playPop(); navigate('/login') }}
                        className="btn-3d-secondary py-3 px-6 rounded-xl font-semibold text-sm sm:text-base"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Free to start</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Guest reading available</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>No credit card required</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Public Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface/80 py-12 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">Learning</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/reading" className="hover:text-foreground transition-colors">Graded Reader</Link></li>
                <li><Link to="/kana" className="hover:text-foreground transition-colors">Kana Studio</Link></li>
                <li><Link to="/conversation" className="hover:text-foreground transition-colors">Conversation Practice</Link></li>
                <li><Link to="/kanji" className="hover:text-foreground transition-colors">Kanji Library</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">Practice</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/review" className="hover:text-foreground transition-colors">SRS Flashcards</Link></li>
                <li><Link to="/quiz" className="hover:text-foreground transition-colors">Timed Quizzes</Link></li>
                <li><Link to="/grammar" className="hover:text-foreground transition-colors">Grammar Guide</Link></li>
                <li><Link to="/sensei" className="hover:text-foreground transition-colors">Hana-sensei 3D</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">JLPT Levels</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-muted-foreground">N5 · Beginner Foundations</span></li>
                <li><span className="text-muted-foreground">N4 · Elementary</span></li>
                <li><span className="text-muted-foreground">N3 · Intermediate</span></li>
                <li><span className="text-muted-foreground">N2 · Advanced Fluency</span></li>
                <li><span className="text-muted-foreground">N1 · Full Mastery</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider">Account</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/register" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Log In</Link></li>
                <li><Link to="/reset-password" className="hover:text-foreground transition-colors">Reset Password</Link></li>
                <li><Link to="/settings" className="hover:text-foreground transition-colors">Preferences</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Kando Japanese</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className="text-muted-foreground">
              Empowering learners to achieve authentic Japanese fluency.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
