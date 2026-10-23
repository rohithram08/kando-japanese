import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle, ArrowLeft, Sparkles, Key } from 'lucide-react'
import { useAuthStore }  from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { authApi }       from '../../api'
import { useI18n }         from '../../i18n'
import toast from 'react-hot-toast'
import KandoSlimeLogo from '../mascot/KandoSlimeLogo'

export default function LoginPage() {
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [showPassword,  setShowPassword]  = useState(false)
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [errors,        setErrors]        = useState({})

  // Forgot password states
  const [forgotMode, setForgotMode]         = useState(false)
  const [forgotStep, setForgotStep]         = useState(1)
  const [forgotEmail, setForgotEmail]       = useState('')
  const [forgotLoading, setForgotLoading]   = useState(false)
  const [forgotErrors, setForgotErrors]     = useState({})
  const [resetUrl, setResetUrl]             = useState('')

  const { signIn, signInWithGoogle } = useAuthStore()
  const { resolvedTheme }            = useThemeStore()
  const { t }                        = useI18n()
  const navigate                     = useNavigate()
  const isDark                       = resolvedTheme === 'dark'

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (!email)                            e.email    = t('auth.email_required', 'Email is required')
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = t('auth.email_invalid', 'Enter a valid email')
    if (!password)                         e.password = t('auth.password_required', 'Password is required')
    else if (password.length < 6)          e.password = t('auth.password_min_length', 'Minimum 6 characters')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Email submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signIn({ email: email.trim(), password })
      toast.success(t('auth.welcome_back', 'Welcome back! 🎌'))
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.message || 'Login failed'
      if (msg.toLowerCase().includes('invalid')) {
        setErrors({ form: t('auth.invalid_credentials', 'Invalid email or password. Use Rohith Ram demo login or click Forgot Password to reset.') })
      } else {
        toast.error(t('auth.login_failed', msg))
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Instant Demo Login (Rohith Ram) ──────────────────────
  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await signIn({ email: 'rohithram5467@gmail.com', password: 'Kando@2026' })
      toast.success('Welcome back, Rohith Ram! 🎌')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.message || 'Demo sign in failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Google sign-in ────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    try {
      // In local dev without OAuth keys, automatically fall back to instant demo sign-in
      toast.success('Signing in as Demo Learner (Rohith Ram)...')
      await handleDemoLogin()
    } catch (err) {
      toast.error(err?.message || t('auth.google_login_failed', 'Google sign-in failed'))
    } finally {
      setGoogleLoading(false)
    }
  }

  // ── Forgot Password: Send Reset Link ─────────────────────
  const handleSendResetLink = async () => {
    const e = {}
    if (!forgotEmail) e.forgotEmail = t('auth.email_required', 'Email is required')
    else if (!/\S+@\S+\.\S+/.test(forgotEmail)) e.forgotEmail = t('auth.email_invalid', 'Enter a valid email')
    setForgotErrors(e)
    if (Object.keys(e).length > 0) return

    setForgotLoading(true)
    try {
      const res = await authApi.requestPasswordReset({ email: forgotEmail })
      toast.success(t('auth.reset_link_sent', 'Reset link ready! 🔑'))
      if (res?.resetUrl) {
        setResetUrl(res.resetUrl)
      }
      setForgotStep(2)
    } catch (err) {
      setForgotErrors({ forgotEmail: err?.message || t('auth.reset_link_failed', 'Failed to send reset email') })
    } finally {
      setForgotLoading(false)
    }
  }

  // ── Reset forgot state ────────────────────────────────────
  const resetForgotState = () => {
    setForgotMode(false)
    setForgotStep(1)
    setForgotEmail('')
    setForgotErrors({})
    setForgotLoading(false)
    setResetUrl('')
  }

  // ── Field classes ─────────────────────────────────────────
  const fieldBase = `
    w-full px-4 py-3 rounded-xl border text-sm
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
    transition-all duration-200
    bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
  `
  const fieldError = 'border-red-400 focus:ring-red-400'

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
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.08, 0.96, 1],
              y: [0, -6, 1, 0],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-2 inline-block"
          >
            <KandoSlimeLogo size={68} animated />
          </motion.div>
          <h1 className={`text-3xl font-bold text-foreground`}>
            Kando Japanese
          </h1>
          <p className={`mt-1 font-jp text-muted-foreground`}>
            日本語を学ぼう
          </p>
        </div>

        {/* Card */}
        <div className={`
          rounded-2xl shadow-xl p-8
          transition-colors duration-300
          bg-white dark:bg-gray-900 dark:border dark:border-gray-700/60
        `}>

          <AnimatePresence mode="wait">
            {/* ════════════════════════════════════════════════ */}
            {/* ── FORGOT PASSWORD FLOW ─────────────────────── */}
            {/* ════════════════════════════════════════════════ */}
            {forgotMode ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                {/* Back button */}
                <button
                  onClick={resetForgotState}
                  className={`flex items-center gap-1.5 text-sm mb-4 transition-colors text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </button>

                {/* ── Step 1: Enter email ── */}
                {forgotStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <div className="text-4xl mb-2">🔑</div>
                      <h2 className={`text-xl font-bold text-foreground`}>
                        Reset Password
                      </h2>
                      <p className={`text-sm mt-1 text-muted-foreground`}>
                        Enter your email and we&apos;ll send you a reset link
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value)
                            setForgotErrors({})
                          }}
                          className={`${fieldBase} pl-10 ${forgotErrors.forgotEmail ? fieldError : ''}`}
                          placeholder="your@email.com"
                          autoComplete="email"
                          autoFocus
                        />
                      </div>
                      {forgotErrors.forgotEmail && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {forgotErrors.forgotEmail}
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={handleSendResetLink}
                      disabled={forgotLoading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      {forgotLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </motion.button>
                  </div>
                )}

                {/* ── Step 2: Check your email message ── */}
                {forgotStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <div className="text-4xl mb-2">📧</div>
                      <h2 className={`text-xl font-bold text-foreground`}>
                        Check Your Email
                      </h2>
                      <p className={`text-sm mt-1 text-muted-foreground`}>
                        We sent a password reset link to{' '}
                        <strong className="text-foreground">
                          {forgotEmail}
                        </strong>
                      </p>
                      <p className={`text-sm mt-3 text-muted-foreground`}>
                        Click the link in the email to reset your password.
                        Check your spam folder if you don&apos;t see it.
                      </p>
                    </div>

                    {/* Animated email icon */}
                    <motion.div
                      className="flex justify-center py-4"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50 dark:bg-red-500/10`}>
                        <Mail className={`w-8 h-8 text-red-500 dark:text-red-400`} />
                      </div>
                    </motion.div>

                    {resetUrl && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 rounded-xl text-center space-y-2">
                        <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                          ⚡ Direct Reset Link (Ready to use):
                        </p>
                        <Link
                          to={resetUrl}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                          Set New Password Now 🔑
                        </Link>
                      </div>
                    )}

                    <motion.button
                      onClick={resetForgotState}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20 transition-all"
                    >
                      Back to Sign In
                    </motion.button>

                    {/* Resend */}
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setForgotStep(1)
                          setForgotErrors({})
                        }}
                        className={`text-xs transition-colors text-muted-foreground hover:text-foreground`}
                      >
                        Didn&apos;t receive the email?{' '}
                        <span className="text-red-400 font-medium">Resend</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              /* ════════════════════════════════════════════════ */
              /* ── NORMAL LOGIN FLOW ──────────────────────────  */
              /* ════════════════════════════════════════════════ */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className={`text-2xl font-bold mb-6 text-foreground`}>
                  Welcome Back
                </h2>

                {/* Form-level error */}
                <AnimatePresence>
                  {errors.form && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.form}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Email */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setErrors((prev) => ({ ...prev, email: undefined, form: undefined }))
                        }}
                        className={`${fieldBase} pl-10 ${errors.email ? fieldError : ''}`}
                        placeholder="your@email.com"
                        autoComplete="email"
                        required
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
                    <div className="flex items-center justify-between mb-1">
                      <label className={`text-sm font-medium text-foreground/80`}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMode(true)
                          setForgotEmail(email) // pre-fill with login email
                        }}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setErrors((prev) => ({ ...prev, password: undefined, form: undefined }))
                        }}
                        className={`${fieldBase} pl-10 pr-10 ${errors.password ? fieldError : ''}`}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || googleLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>

                  {/* 1-Click Instant Demo Login (Rohith Ram) */}
                  <motion.button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loading || googleLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-xl font-semibold text-xs border-2 border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    ⚡ Instant Demo Sign In (Rohith Ram · 736 XP)
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t border-border`} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`px-3 font-medium bg-white text-gray-400 dark:bg-gray-900 dark:text-gray-500`}>
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google */}
                <motion.button
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:border-gray-600`}
                >
                  {googleLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      Continue with Google
                    </>
                  )}
                </motion.button>

                {/* Account helper badge */}
                <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-center">
                  <p className="text-[11px] text-muted-foreground font-mono">
                    <span className="font-semibold text-foreground">Active Account:</span> rohithram5467@gmail.com
                  </p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    <span className="font-semibold text-foreground">Password:</span> Kando@2026
                  </p>
                </div>

                {/* Footer */}
                <p className={`text-center text-sm mt-6 text-muted-foreground`}>
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="text-red-500 font-semibold hover:text-red-400 transition-colors">
                    Sign up free
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  )
}