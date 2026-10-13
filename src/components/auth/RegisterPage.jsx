import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuthStore }  from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import toast from 'react-hot-toast'

// ── Data ─────────────────────────────────────────────────────
// English, Tamil and Hindi have curated, human-written translations baked
// into the lesson data. Every other language is translated live via a
// free translation service (see src/services/translationService.js) —
// `curated: false` so the UI can mark these honestly rather than imply
// they're the same quality as the curated three.
const LANGUAGES = [
  { code: 'english',    label: 'English',   flag: '🇬🇧', curated: true },
  { code: 'tamil',      label: 'தமிழ்',     flag: '🇮🇳', curated: true },
  { code: 'hindi',      label: 'हिंदी',     flag: '🇮🇳', curated: true },
  { code: 'portuguese', label: 'Português',  flag: '🇧🇷', curated: false },
  { code: 'chinese',    label: '中文',       flag: '🇨🇳', curated: false },
  { code: 'korean',     label: '한국어',     flag: '🇰🇷', curated: false },
  { code: 'russian',    label: 'Русский',    flag: '🇷🇺', curated: false },
  { code: 'spanish',    label: 'Español',    flag: '🇪🇸', curated: false },
  { code: 'arabic',     label: 'العربية',   flag: '🇸🇦', curated: false },
  { code: 'french',     label: 'Français',   flag: '🇫🇷', curated: false },
]

const LEVELS = [
  { code: 'N5', label: 'N5 — Absolute Beginner', sub: 'Hiragana, basic greetings', emoji: '🌱', color: 'from-green-400 to-emerald-500'  },
  { code: 'N4', label: 'N4 — Elementary',         sub: 'Basic conversations',        emoji: '🌿', color: 'from-teal-400 to-cyan-500'      },
  { code: 'N3', label: 'N3 — Intermediate',        sub: '~650 kanji, daily topics',   emoji: '🌳', color: 'from-blue-400 to-indigo-500'    },
  { code: 'N2', label: 'N2 — Upper Intermediate',  sub: '~1000 kanji, complex texts', emoji: '🎋', color: 'from-purple-400 to-violet-500'  },
  { code: 'N1', label: 'N1 — Advanced',            sub: 'Near-native fluency',        emoji: '🎍', color: 'from-orange-400 to-red-500'     },
]

const STEP_LABELS = ['Account', 'Language', 'Level']

// ── Password strength ─────────────────────────────────────────
function getPasswordStrength(pw) {
  let score = 0
  if (pw.length >= 6)                        score++
  if (pw.length >= 10)                       score++
  if (/[A-Z]/.test(pw))                      score++
  if (/[0-9]/.test(pw))                      score++
  if (/[^A-Za-z0-9]/.test(pw))              score++
  if (score <= 1) return { label: 'Weak',   color: 'bg-red-500',    width: '20%'  }
  if (score <= 2) return { label: 'Fair',   color: 'bg-orange-400', width: '45%'  }
  if (score <= 3) return { label: 'Good',   color: 'bg-yellow-400', width: '65%'  }
  if (score <= 4) return { label: 'Strong', color: 'bg-green-400',  width: '85%'  }
  return                  { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' }
}

// ─────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [step,    setStep]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    username:       '',
    email:          '',
    password:       '',
    nativeLanguage: 'english',
    currentLevel:   'N5',
  })

  const { signUp }        = useAuthStore()
  const { resolvedTheme } = useThemeStore()
  const navigate          = useNavigate()
  const isDark            = resolvedTheme === 'dark'

  const update = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  // ── Step 1 validation ────────────────────────────────────
  const validateStep1 = () => {
    const e = {}
    if (!formData.username.trim())          e.username = 'Username is required'
    else if (formData.username.length < 3)  e.username = 'Minimum 3 characters'
    if (!formData.email)                    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email'
    if (!formData.password)                 e.password = 'Password is required'
    else if (formData.password.length < 8)  e.password = 'Minimum 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (step === 1 && !validateStep1()) return
    setStep((s) => s + 1)
  }

  // ── Final submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)
    try {
      await signUp(formData)
      toast.success('Welcome to NihonGo Master! 🎌')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Shared classes ────────────────────────────────────────
  const fieldBase = `
    w-full px-4 py-3 rounded-xl border text-sm
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
    transition-all duration-200
    bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
  `

  const pwStrength = formData.password ? getPasswordStrength(formData.password) : null

  // ─────────────────────────────────────────────────────────
  return (
    <div className={`
      min-h-screen flex items-center justify-center p-4
      transition-colors duration-300
      bg-gradient-to-br from-red-50 via-white to-red-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
    `}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="text-5xl mb-2">🎌</div>
          <h1 className={`text-3xl font-bold text-foreground`}>
            NihonGo Master
          </h1>
          <p className={`text-sm mt-1 font-jp text-muted-foreground`}>
            日本語を学ぼう
          </p>
        </div>

        {/* Card */}
        <div className={`
          rounded-2xl shadow-xl p-7
          transition-colors duration-300
          bg-white dark:bg-gray-900 dark:border dark:border-gray-700/60
        `}>

          {/* ── Step indicator ── */}
          <div className="flex items-center justify-center gap-2 mb-7">
            {STEP_LABELS.map((label, i) => {
              const s       = i + 1
              const done    = step > s
              const active  = step === s
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{ scale: active ? 1.1 : 1 }}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        text-xs font-bold transition-colors
                        ${done ? 'bg-green-500 text-white' : active ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}
                      `}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </motion.div>
                    <span className={`text-[10px] font-medium ${
                      active
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={`
                      flex-1 h-px mb-4 transition-colors
                      ${step > s
                        ? 'bg-green-500'
                        : 'bg-muted'
                      }
                    `} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* ── STEP 1: Account ── */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{    opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h2 className={`text-xl font-bold text-foreground`}>
                  Create your account
                </h2>

                {/* Username */}
                <div>
                  <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => update('username', e.target.value)}
                      className={`${fieldBase} pl-10 ${errors.username ? 'border-red-400' : ''}`}
                      placeholder="nihongo_master"
                      autoComplete="username"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={`${fieldBase} pl-10 ${errors.email ? 'border-red-400' : ''}`}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => update('password', e.target.value)}
                      className={`${fieldBase} pl-10 pr-10 ${errors.password ? 'border-red-400' : ''}`}
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {pwStrength && (
                    <div className="mt-2">
                      <div className={`h-1.5 rounded-full overflow-hidden bg-muted`}>
                        <motion.div
                          className={`h-full rounded-full ${pwStrength.color}`}
                          animate={{ width: pwStrength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        pwStrength.label === 'Weak'   ? 'text-red-400'    :
                        pwStrength.label === 'Fair'   ? 'text-orange-400' :
                        pwStrength.label === 'Good'   ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {pwStrength.label}
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.password}
                    </p>
                  )}
                </div>

                <motion.button
                  onClick={goNext}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
                >
                  Continue →
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 2: Language ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{    opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className={`text-xl font-bold mb-1 text-foreground`}>
                  What&apos;s your native language?
                </h2>
                <p className={`text-sm mb-4 text-muted-foreground`}>
                  We&apos;ll show explanations in your language
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                  {LANGUAGES.map((lang) => {
                    const isSelected = formData.nativeLanguage === lang.code
                    return (
                      <motion.button
                        key={lang.code}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => update('nativeLanguage', lang.code)}
                        className={`
                          p-3 rounded-xl border-2 text-left transition-all duration-150
                          flex items-center gap-2
                          ${isSelected
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-200 hover:border-gray-300 bg-white dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800/50'
                          }
                        `}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className={`text-sm font-medium truncate ${
                          isSelected
                            ? 'text-red-500'
                            : 'text-foreground'
                        }`}>
                          {lang.label}
                        </span>
                        {!lang.curated && (
                          <span
                            title="Translated live via machine translation, not hand-written"
                            className="text-[9px] font-bold px-1 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex-shrink-0"
                          >
                            live
                          </span>
                        )}
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground -mt-3 mb-5">
                  <span className="font-semibold">English, தமிழ், हिंदी</span> are hand-written by us.
                  Languages marked <span className="px-1 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-bold text-[9px]">live</span> are
                  translated automatically and may occasionally be imperfect.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className={`
                      flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-colors
                      border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
                    `}
                  >
                    ← Back
                  </button>
                  <motion.button
                    onClick={goNext}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Level ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0  }}
                exit={{    opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className={`text-xl font-bold mb-1 text-foreground`}>
                  What&apos;s your Japanese level?
                </h2>
                <p className={`text-sm mb-4 text-muted-foreground`}>
                  Don&apos;t worry — you can change this anytime
                </p>

                <div className="space-y-2 mb-5">
                  {LEVELS.map((lvl) => {
                    const isSelected = formData.currentLevel === lvl.code
                    return (
                      <motion.button
                        key={lvl.code}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => update('currentLevel', lvl.code)}
                        className={`
                          w-full p-3.5 rounded-xl border-2 text-left
                          flex items-center gap-3 transition-all duration-150
                          ${isSelected
                            ? 'border-red-500 bg-red-500/10'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 dark:bg-gray-800/50'
                          }
                        `}
                      >
                        {/* Gradient level badge */}
                        <div className={`
                          w-10 h-10 rounded-xl bg-gradient-to-br ${lvl.color}
                          flex items-center justify-center text-white font-bold text-xs
                          flex-shrink-0 shadow-sm
                        `}>
                          {lvl.code}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`font-semibold text-sm ${
                            isSelected
                              ? 'text-red-500'
                              : 'text-foreground'
                          }`}>
                            {lvl.label}
                          </p>
                          <p className={`text-xs mt-0.5 text-muted-foreground`}>
                            {lvl.sub}
                          </p>
                        </div>

                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className={`
                      flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-colors
                      border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
                    `}
                  >
                    ← Back
                  </button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      flex-1 py-3 rounded-xl font-semibold text-sm text-white
                      bg-gradient-to-r from-red-500 to-red-600
                      hover:from-red-600 hover:to-red-700
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all flex items-center justify-center gap-2
                    "
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      '🎌 Start Learning!'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <p className={`text-center text-sm mt-5 text-muted-foreground`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-500 font-semibold hover:text-red-400 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}