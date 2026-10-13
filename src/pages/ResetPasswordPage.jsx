import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useThemeStore } from '../store/themeStore'
import { authApi } from '../api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [checking, setChecking] = useState(true)

  // Verify token presence
  useEffect(() => {
    // If token is missing, notify and redirect
    if (!token) {
      toast.error('Invalid or expired reset link')
      navigate('/login')
    } else {
      setChecking(false)
    }
  }, [token, navigate])

  const handleReset = async () => {
    const e = {}
    if (!newPassword) e.newPassword = 'Password is required'
    else if (newPassword.length < 8) e.newPassword = 'Minimum 8 characters'
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (newPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setLoading(true)
    try {
      await authApi.resetPassword({ token, newPassword })

      setSuccess(true)
      toast.success('Password updated successfully! 🎉')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErrors({ newPassword: err?.message || 'Failed to reset password' })
    } finally {
      setLoading(false)
    }
  }

  const fieldBase = `
    w-full px-4 py-3 rounded-xl border text-sm
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent
    transition-all duration-200
    bg-white border-gray-200 text-gray-900 placeholder-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500
  `

  // Loading state while checking session
  if (checking) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-background`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm text-muted-foreground`}>
            Verifying reset link...
          </p>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 bg-background`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className={`text-2xl font-bold mb-2 text-foreground`}>
            Password Updated!
          </h2>
          <p className={`text-sm text-muted-foreground`}>
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors bg-gradient-to-br from-red-50 via-white to-red-50 dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-950`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔒</div>
          <h1 className={`text-2xl font-bold text-foreground`}>
            Set New Password
          </h1>
          <p className={`text-sm mt-1 text-muted-foreground`}>
            Choose a strong password for your account
          </p>
        </div>

        <div className={`rounded-2xl shadow-xl p-8 bg-white dark:bg-gray-900 dark:border dark:border-gray-700/60`}>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, newPassword: undefined }))
                  }}
                  className={`${fieldBase} pl-10 pr-10 ${errors.newPassword ? 'border-red-400' : ''}`}
                  placeholder="Min. 6 characters"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 text-foreground/80`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }}
                  className={`${fieldBase} pl-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Repeat password"
                />
                {confirmPassword && newPassword === confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <motion.button
              onClick={handleReset}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}