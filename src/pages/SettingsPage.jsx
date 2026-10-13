// src/pages/SettingsPage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Bell, Shield, Palette, Volume2, BookOpen,
  Monitor, Moon, Sun, ChevronRight, RotateCcw, Search,
  Trash2, Download,
  User, Pencil, Camera, Upload, X, Save,
  RefreshCcw, CheckCircle2,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { updateProfile, deleteAccount } from '../api/users'
import { uploadAvatar } from '../api/upload'
import { resetAllProgress } from '../api/progress'
import toast from 'react-hot-toast'

// ── Avatar Collection ──────────────────────────────────────
const AVATARS = [
  { id: 'avatar-1',  emoji: '🥷',  label: 'Ninja',       bg: 'from-gray-700 to-gray-900' },
  { id: 'avatar-2',  emoji: '🎌',  label: 'Japan Flag',  bg: 'from-red-400 to-red-600' },
  { id: 'avatar-3',  emoji: '🌸',  label: 'Sakura',      bg: 'from-pink-400 to-pink-600' },
  { id: 'avatar-4',  emoji: '⛩️',  label: 'Torii Gate',  bg: 'from-orange-400 to-red-500' },
  { id: 'avatar-5',  emoji: '🐉',  label: 'Dragon',      bg: 'from-green-500 to-emerald-700' },
  { id: 'avatar-6',  emoji: '🗻',  label: 'Mt. Fuji',    bg: 'from-blue-400 to-indigo-600' },
  { id: 'avatar-7',  emoji: '🎎',  label: 'Dolls',       bg: 'from-rose-400 to-rose-600' },
  { id: 'avatar-8',  emoji: '🍣',  label: 'Sushi',       bg: 'from-amber-400 to-orange-500' },
  { id: 'avatar-9',  emoji: '🎋',  label: 'Tanabata',    bg: 'from-emerald-400 to-teal-600' },
  { id: 'avatar-10', emoji: '🏯',  label: 'Castle',      bg: 'from-yellow-500 to-amber-600' },
  { id: 'avatar-11', emoji: '🎐',  label: 'Wind Chime',  bg: 'from-cyan-400 to-blue-500' },
  { id: 'avatar-12', emoji: '🐱',  label: 'Cat',         bg: 'from-violet-400 to-purple-600' },
  { id: 'avatar-13', emoji: '👺',  label: 'Tengu',       bg: 'from-red-600 to-red-800' },
  { id: 'avatar-14', emoji: '🦊',  label: 'Fox',         bg: 'from-orange-400 to-amber-500' },
  { id: 'avatar-15', emoji: '🎴',  label: 'Hanafuda',    bg: 'from-indigo-500 to-purple-700' },
]

// id / label / icon / tint / search keywords — keywords power the settings search box
const SECTIONS = [
  { id: 'profile',       label: 'Profile',           icon: User,     emoji: '👤', tint: 'red',    keywords: 'name avatar photo username' },
  { id: 'general',       label: 'General',           icon: Globe,    emoji: '🌐', tint: 'blue',   keywords: 'jlpt target level' },
  { id: 'appearance',    label: 'Appearance',        icon: Palette,  emoji: '🎨', tint: 'violet', keywords: 'theme dark light font size furigana romaji compact animations' },
  { id: 'study',         label: 'Study Preferences', icon: BookOpen, emoji: '📖', tint: 'emerald',keywords: 'daily goal xp srs interval translation autoplay' },
  { id: 'notifications', label: 'Notifications',     icon: Bell,     emoji: '🔔', tint: 'orange', keywords: 'reminder streak achievement weekly report' },
  { id: 'audio',         label: 'Audio & Speech',    icon: Volume2,  emoji: '🔊', tint: 'cyan',   keywords: 'speech rate pitch slow autospeak voice' },
  { id: 'privacy',       label: 'Privacy & Data',    icon: Shield,   emoji: '🔒', tint: 'gray',   keywords: 'export delete reset analytics' },
]

const SECTION_TINT = {
  red:     { bg: 'bg-red-50 dark:bg-red-500/10',     text: 'text-red-600 dark:text-red-400' },
  blue:    { bg: 'bg-blue-50 dark:bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400' },
  violet:  { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  orange:  { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  cyan:    { bg: 'bg-cyan-50 dark:bg-cyan-500/10',   text: 'text-cyan-600 dark:text-cyan-400' },
  gray:    { bg: 'bg-gray-100 dark:bg-gray-500/10',  text: 'text-gray-600 dark:text-gray-400' },
}

// Only languages with real translated content in the lesson data
// (meaning_en / meaning_hi / meaning_ta) are listed here — offering more
// would silently fall back to English regardless of selection, which is
// exactly the kind of non-functional control this page should not have.
// Encoded as full words ('english', 'tamil', 'hindi') to match both the
// sign-up flow (RegisterPage.jsx) and the lesson card lookups that key
// off profile.native_language — keep these three in sync if you add a
// fourth language's translated content to the data set.
// English, Tamil and Hindi have curated, human-written translations in
// the lesson data. Everything else is translated live via a free
// translation service (see src/services/translationService.js) — marked
// "(live)" in the label so the distinction is honest, not hidden.
const LANGUAGES = [
  { code: 'english',    label: 'English' },
  { code: 'tamil',      label: 'தமிழ் (Tamil)' },
  { code: 'hindi',      label: 'हिंदी (Hindi)' },
  { code: 'portuguese', label: 'Português (live)' },
  { code: 'chinese',    label: '中文 (live)' },
  { code: 'korean',     label: '한국어 (live)' },
  { code: 'russian',    label: 'Русский (live)' },
  { code: 'spanish',    label: 'Español (live)' },
  { code: 'arabic',     label: 'العربية (live)' },
  { code: 'french',     label: 'Français (live)' },
]

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1']
const FONT_SIZES  = [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]
const DAILY_GOALS = [5, 10, 15, 20, 30, 50]
const SRS_INTERVALS = [
  { value: 'relaxed',  label: 'Relaxed',  desc: 'Longer intervals, fewer reviews' },
  { value: 'balanced', label: 'Balanced', desc: 'Default spacing algorithm' },
  { value: 'intense',  label: 'Intense',  desc: 'Shorter intervals, more reviews' },
]

const FURIGANA_MODES = [
  { value: 'adaptive', label: 'Adaptive',  desc: 'Fades automatically as SRS mastery increases (recommended)' },
  { value: 'always',   label: 'Always On', desc: 'Always display readings above all kanji' },
  { value: 'reveal',   label: 'On Demand', desc: 'Tap or hover kanji to reveal reading' },
  { value: 'off',      label: 'Off',       desc: 'Never show furigana readings' },
]

// ── Toggle ──────────────────────────────────────────────────
const Toggle = ({ enabled, onChange, disabled = false }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full
      transition-colors duration-200 ease-in-out focus:outline-none
      focus:ring-2 focus:ring-red-500 focus:ring-offset-2
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${enabled ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}
    `}
  >
    <span className={`
      inline-block h-4 w-4 transform rounded-full bg-white
      shadow-sm transition-transform duration-200 ease-in-out
      ${enabled ? 'translate-x-6' : 'translate-x-1'}
    `} />
  </button>
)

// ── SelectField ────────────────────────────────────────────
const SelectField = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      px-3 py-2 rounded-xl text-sm font-medium border
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
      transition-colors cursor-pointer
      bg-surface border-border text-foreground
    "
  >
    {options.map((opt) => (
      <option key={opt.value || opt.code || opt} value={opt.value || opt.code || opt}>
        {opt.flag ? `${opt.flag} ${opt.label}` : (opt.label || opt)}
      </option>
    ))}
  </select>
)

// ── SettingRow ──────────────────────────────────────────────
const SettingRow = ({ label, description, children, noBorder = false }) => (
  <div className={`flex items-center justify-between py-4 gap-4 ${noBorder ? '' : 'border-b border-border'}`}>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && <p className="text-xs mt-0.5 text-muted-foreground">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
)

// ── SectionCard wrapper ────────────────────────────────────
const SectionCard = ({ title, emoji, children }) => (
  <div className="rounded-2xl border p-5 bg-surface border-border">
    {title && (
      <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
        {emoji} {title}
      </h3>
    )}
    {children}
  </div>
)

// Small pill button used throughout for choice-style settings (level, goal, interval mode)
const ChoicePill = ({ active, onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
      active
        ? 'bg-red-500 text-white border-red-500'
        : 'bg-surface border-border text-muted-foreground hover:text-foreground hover:border-foreground/20'
    }`}
  >
    {children}
  </button>
)

// ══════════════════════════════════════════════════════════
// ── MAIN COMPONENT ────────────────────────────────────────
// ══════════════════════════════════════════════════════════
export default function SettingsPage() {
  const { user, profile, refreshProfile, logout, updateProfile: authUpdateProfile } = useAuthStore()
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const settings = useSettingsStore()
  const { updateSettings, resetToDefaults } = settings

  const [activeSection, setActiveSection]         = useState('profile')
  const [settingsQuery, setSettingsQuery]          = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm]  = useState(false)
  const [showResetConfirm, setShowResetConfirm]    = useState(false)
  const [showResetSettingsConfirm, setShowResetSettingsConfirm] = useState(false)

  // ── Profile state (saved via backend API / authStore) ──
  const [username, setUsername]             = useState(profile?.username || user?.username || 'Learner')
  const [nativeLanguage, setNativeLanguage]  = useState(profile?.nativeLanguage || profile?.native_language || settings.nativeLanguage || 'english')
  const [profileSaving, setProfileSaving]    = useState(false)

  // ── Avatar state ───────────────────────────────────────
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [selectedAvatar, setSelectedAvatar]     = useState(profile?.avatarId || profile?.avatar_id || null)
  const [avatarUrl, setAvatarUrl]               = useState(profile?.avatarUrl || profile?.avatar_url || null)
  const [previewUrl, setPreviewUrl]             = useState(null)
  const [uploadLoading, setUploadLoading]       = useState(false)
  const fileInputRef = useRef(null)

  // Sync profile on load
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setNativeLanguage(profile.nativeLanguage || profile.native_language || settings.nativeLanguage || 'english')
      setSelectedAvatar(profile.avatarId || profile.avatar_id || null)
      setAvatarUrl(profile.avatarUrl || profile.avatar_url || null)
    }
  }, [profile, settings.nativeLanguage])

  const getDisplayAvatar = () => {
    if (previewUrl) return { type: 'image', src: previewUrl }
    if (avatarUrl)  return { type: 'image', src: avatarUrl }
    if (selectedAvatar) {
      const av = AVATARS.find(a => a.id === selectedAvatar)
      if (av) return { type: 'emoji', ...av }
    }
    return { type: 'default' }
  }
  const displayAvatar = getDisplayAvatar()

  // ── File upload ────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 5 * 1024 * 1024)    { toast.error('Image must be less than 5MB'); return }

    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target.result)
    reader.readAsDataURL(file)

    setUploadLoading(true)
    try {
      const response = await uploadAvatar(file)
      const publicUrl = response.url

      if (user) {
        if (refreshProfile) await refreshProfile()
      } else {
        await authUpdateProfile({ avatarUrl: publicUrl, avatarId: null })
      }

      setAvatarUrl(publicUrl)
      setSelectedAvatar(null)
      setPreviewUrl(null)
      setShowAvatarPicker(false)
      toast.success('Profile photo updated! 📸')
    } catch (err) {
      console.error(err)
      toast.error('Failed to upload photo')
      setPreviewUrl(null)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleAvatarSelect = async (avatar) => {
    setUploadLoading(true)
    try {
      if (user) {
        await updateProfile({ avatarId: avatar.id, avatarUrl: null })
        if (refreshProfile) await refreshProfile()
      } else {
        await authUpdateProfile({ avatarId: avatar.id, avatarUrl: null })
      }
      setSelectedAvatar(avatar.id)
      setAvatarUrl(null)
      setPreviewUrl(null)
      setShowAvatarPicker(false)
      toast.success(`Avatar set to ${avatar.label}! ${avatar.emoji}`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to update avatar')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadLoading(true)
    try {
      if (user) {
        await updateProfile({ avatarId: null, avatarUrl: null })
        if (refreshProfile) await refreshProfile()
      } else {
        await authUpdateProfile({ avatarId: null, avatarUrl: null })
      }
      setSelectedAvatar(null)
      setAvatarUrl(null)
      setPreviewUrl(null)
      toast.success('Avatar removed')
    } catch (err) {
      console.error('Remove avatar failed:', err)
      toast.error('Failed to remove avatar')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!username.trim()) { toast.error('Display name cannot be empty'); return }
    setProfileSaving(true)
    try {
      if (user) {
        await updateProfile({ username: username.trim(), nativeLanguage: nativeLanguage })
        if (refreshProfile) await refreshProfile()
      } else {
        await authUpdateProfile({ username: username.trim(), nativeLanguage: nativeLanguage })
      }
      updateSettings({ nativeLanguage })
      toast.success('Profile updated! ✅')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      const exportData = { profile, settings: { ...settings, updateSettings: undefined, init: undefined, resetToDefaults: undefined }, exportedAt: new Date().toISOString() }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `nihongo-master-data-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully!')
    } catch (err) {
      console.error('Export failed:', err)
      toast.error('Failed to export data')
    }
  }

  const handleResetProgress = async () => {
    try {
      if (user?.id) {
        await resetAllProgress()
      }
      setShowResetConfirm(false)
      toast.success('Progress has been reset')
    } catch (err) {
      console.error('Reset progress failed:', err)
      toast.error('Failed to reset progress')
    }
  }

  // Deletes user account and associated data in backend, then signs out.
  const handleDeleteAccount = async () => {
    if (!user?.id) { setShowDeleteConfirm(false); return }
    try {
      await deleteAccount()

      setShowDeleteConfirm(false)
      toast.success('Your data has been deleted')
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Delete account failed:', err)
      toast.error('Failed to delete account data')
    }
  }

  const fieldBase = `
    w-full px-4 py-3 rounded-xl border text-sm
    focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400
    transition-all duration-200
    bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus:bg-surface
  `

  // Filter the section nav by the settings search box
  const filteredSections = useMemo(() => {
    const q = settingsQuery.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.filter((s) => s.label.toLowerCase().includes(q) || s.keywords.includes(q))
  }, [settingsQuery])

  // ── Section Renderer ───────────────────────────────────
  const renderSection = () => {
    switch (activeSection) {

      // ── PROFILE ───────────────────────────────────────
      case 'profile':
        return (
          <div className="space-y-6">
            <SectionCard title="Avatar" emoji="🖼️">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                    className={`
                      w-20 h-20 rounded-2xl border-2 shadow-lg overflow-hidden cursor-pointer
                      border-border
                      ${displayAvatar.type === 'emoji' ? `bg-gradient-to-br ${displayAvatar.bg}` : displayAvatar.type === 'image' ? '' : 'bg-muted'}
                    `}
                    onClick={() => setShowAvatarPicker(true)}
                  >
                    {displayAvatar.type === 'image' ? (
                      <img src={displayAvatar.src} alt="Profile" className="w-full h-full object-cover" />
                    ) : displayAvatar.type === 'emoji' ? (
                      <div className="w-full h-full flex items-center justify-center text-3xl">{displayAvatar.emoji}</div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center rounded-2xl">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setShowAvatarPicker(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border bg-surface border-border text-foreground/80 hover:bg-muted"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Change Avatar
                  </button>
                  {(selectedAvatar || avatarUrl) && (
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Display Name" emoji="✏️">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`${fieldBase} pl-11`}
                  placeholder="Your display name"
                  maxLength={30}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                  {username.length}/30
                </span>
              </div>
            </SectionCard>

            <SectionCard title="Native Language" emoji="🌐">
              <p className="text-xs text-muted-foreground mb-3 -mt-2">
                Used to show word and grammar meanings in your language throughout Lessons and Vocabulary.
                English, Tamil and Hindi are hand-written by us; languages marked <span className="font-semibold">(live)</span> are
                translated automatically and may occasionally be imperfect.
              </p>
              <SelectField value={nativeLanguage} onChange={setNativeLanguage} options={LANGUAGES} />
            </SectionCard>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-60"
              >
                {profileSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Profile
              </button>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )

      // ── GENERAL ──────────────────────────────────────
      case 'general':
        return (
          <SectionCard>
            <SettingRow
              label="JLPT Target Level"
              description="Lessons, Grammar, Vocabulary & Kanji will open to this level by default"
              noBorder
            >
              <div className="flex gap-1.5 flex-wrap justify-end">
                {JLPT_LEVELS.map((lvl) => (
                  <ChoicePill key={lvl} active={settings.jlptLevel === lvl} onClick={() => updateSettings({ jlptLevel: lvl })}>
                    {lvl}
                  </ChoicePill>
                ))}
              </div>
            </SettingRow>
          </SectionCard>
        )

      // ── APPEARANCE ────────────────────────────────────
      case 'appearance':
        return (
          <div className="space-y-4">
            <SectionCard title="Theme" emoji="🌗">
              <div className="flex gap-2">
                {[
                  { value: 'light',  Icon: Sun,     label: 'Light' },
                  { value: 'dark',   Icon: Moon,    label: 'Dark' },
                  { value: 'system', Icon: Monitor, label: 'System' },
                ].map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                      theme === value
                        ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/25'
                        : 'bg-surface border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Display" emoji="🖥️">
              <SettingRow label="Font Size" description="Size of text throughout the app">
                <SelectField value={settings.fontSize} onChange={(v) => updateSettings({ fontSize: v })} options={FONT_SIZES} />
              </SettingRow>
              <SettingRow label="Furigana Reading Mode" description="Adaptive cognitive fading, on demand tap-to-reveal, or permanent display">
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {FURIGANA_MODES.map(({ value, label, desc }) => (
                    <ChoicePill
                      key={value}
                      active={(settings.furiganaMode || 'adaptive') === value}
                      onClick={() => updateSettings({ furiganaMode: value, furigana: value !== 'off' })}
                      title={desc}
                    >
                      {label}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>
              <SettingRow label="Show Romaji" description="Display romanized pronunciation in Grammar & Vocabulary">
                <Toggle enabled={settings.romaji} onChange={(v) => updateSettings({ romaji: v })} />
              </SettingRow>
              <SettingRow label="Compact Mode" description="Reduce spacing to fit more content">
                <Toggle enabled={settings.compactMode} onChange={(v) => updateSettings({ compactMode: v })} />
              </SettingRow>
              <SettingRow label="Animations" description="Enable motion effects and transitions" noBorder>
                <Toggle enabled={settings.animations} onChange={(v) => updateSettings({ animations: v })} />
              </SettingRow>
            </SectionCard>
          </div>
        )

      // ── STUDY ─────────────────────────────────────────
      case 'study':
        return (
          <div className="space-y-4">
            <SectionCard title="Goals" emoji="🎯">
              <SettingRow label="Daily XP Goal" description="Tracked live on your Dashboard" noBorder>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {DAILY_GOALS.map((g) => (
                    <ChoicePill key={g} active={settings.dailyGoal === g} onClick={() => updateSettings({ dailyGoal: g })}>
                      {g}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>
            </SectionCard>

            <SectionCard title="SRS Settings" emoji="🔁">
              <SettingRow label="Review Interval Mode" description="How aggressively to space your reviews" noBorder>
                <div className="flex gap-1.5">
                  {SRS_INTERVALS.map(({ value, label, desc }) => (
                    <ChoicePill key={value} active={settings.srsInterval === value} onClick={() => updateSettings({ srsInterval: value })} title={desc}>
                      {label}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>
            </SectionCard>

            <SectionCard title="Lesson Preferences" emoji="📖">
              <SettingRow label="Show Translation" description="Display English translations during lessons (off shows a tap-to-reveal)">
                <Toggle enabled={settings.showTranslation} onChange={(v) => updateSettings({ showTranslation: v })} />
              </SettingRow>
              <SettingRow label="Auto-Play Audio" description="Automatically play audio for new words in Lessons" noBorder>
                <Toggle enabled={settings.autoPlay} onChange={(v) => updateSettings({ autoPlay: v })} />
              </SettingRow>
            </SectionCard>
          </div>
        )

      // ── NOTIFICATIONS ─────────────────────────────────
      case 'notifications':
        return (
          <SectionCard>
            <SettingRow label="Daily Study Reminder" description="A real browser notification while the app is open, at the time below">
              <Toggle enabled={settings.dailyReminder} onChange={(v) => updateSettings({ dailyReminder: v })} />
            </SettingRow>
            <SettingRow label="Reminder Time" description="When to send your daily reminder">
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                disabled={!settings.dailyReminder}
                className="px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-surface border-border text-foreground disabled:opacity-40"
              />
            </SettingRow>
            <SettingRow label="Streak Alerts" description="Notify you when you hit a streak milestone">
              <Toggle enabled={settings.streakAlert} onChange={(v) => updateSettings({ streakAlert: v })} />
            </SettingRow>
            <SettingRow label="Achievement Alerts" description="Notify you when you unlock a badge">
              <Toggle enabled={settings.achievementAlert} onChange={(v) => updateSettings({ achievementAlert: v })} />
            </SettingRow>
            <SettingRow label="Weekly Progress Report" description="An in-app summary of your week, every 7 days" noBorder>
              <Toggle enabled={settings.weeklyReport} onChange={(v) => updateSettings({ weeklyReport: v })} />
            </SettingRow>
          </SectionCard>
        )

      // ── AUDIO ─────────────────────────────────────────
      case 'audio':
        return (
          <SectionCard>
            <SettingRow label="Auto-Speak" description="Automatically read new words aloud in Vocabulary & Kanji">
              <Toggle enabled={settings.autoSpeak} onChange={(v) => updateSettings({ autoSpeak: v })} />
            </SettingRow>
            <SettingRow label="Slow Speech Mode" description="Caps playback speed for clearer pronunciation">
              <Toggle enabled={settings.slowMode} onChange={(v) => updateSettings({ slowMode: v })} />
            </SettingRow>
            <SettingRow label="Speech Rate" description={`Speed: ${settings.speechRate}x — applies to every audio button in the app`}>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-32 accent-red-500"
              />
            </SettingRow>
            <SettingRow label="Speech Pitch" description={`Pitch: ${settings.speechPitch}x`} noBorder>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={settings.speechPitch}
                onChange={(e) => updateSettings({ speechPitch: parseFloat(e.target.value) })}
                className="w-32 accent-red-500"
              />
            </SettingRow>
          </SectionCard>
        )

      // ── PRIVACY & DATA ────────────────────────────────
      case 'privacy':
        return (
          <div className="space-y-4">
            <SectionCard title="Analytics" emoji="📊">
              <p className="text-xs text-muted-foreground mb-3 -mt-2">
                This build doesn't send analytics or crash reports to any server — these
                preferences are saved for if/when that's added, and won't change current behavior.
              </p>
              <SettingRow label="Usage Analytics" description="Help improve the app with anonymous data">
                <Toggle enabled={settings.analytics} onChange={(v) => updateSettings({ analytics: v })} />
              </SettingRow>
              <SettingRow label="Crash Reports" description="Send crash logs to help fix bugs" noBorder>
                <Toggle enabled={settings.crashReports} onChange={(v) => updateSettings({ crashReports: v })} />
              </SettingRow>
            </SectionCard>

            <SectionCard title="Your Data" emoji="📦">
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-surface border-border text-foreground/80 hover:bg-muted"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="font-semibold">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download your profile & preferences as JSON</p>
                </div>
              </button>
            </SectionCard>

            <SectionCard title="Danger Zone" emoji="⚠️">
              <div className="space-y-3">
                <button
                  onClick={() => setShowResetSettingsConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-surface border-border text-foreground/80 hover:bg-muted"
                >
                  <RefreshCcw className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <p className="font-semibold">Reset Settings to Defaults</p>
                    <p className="text-xs text-muted-foreground">Restore every preference on this page</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-500/5 dark:border-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">Reset Progress</p>
                    <p className="text-xs text-orange-500/60 dark:text-orange-400/60">Clear all lesson, kanji & vocab progress</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">Delete Account</p>
                    <p className="text-xs text-red-500/60 dark:text-red-400/60">Permanently remove all your data</p>
                  </div>
                </button>
              </div>
            </SectionCard>
          </div>
        )

      default: return null
    }
  }

  // ── Avatar Picker Modal ────────────────────────────────
  const AvatarPickerModal = () => (
    <AnimatePresence>
      {showAvatarPicker && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAvatarPicker(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl bg-surface border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground">Choose Avatar</h3>
              <button onClick={() => setShowAvatarPicker(false)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border mb-4 transition-colors bg-muted border-border text-foreground/80 hover:bg-muted/70"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              Upload a Photo
            </button>

            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Or pick an emoji</p>
            <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
              {AVATARS.map((av) => (
                <motion.button
                  key={av.id}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleAvatarSelect(av)}
                  title={av.label}
                  className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br ${av.bg}
                    flex items-center justify-center text-xl
                    border-2 transition-all
                    ${selectedAvatar === av.id ? 'border-red-500 shadow-lg shadow-red-500/30' : 'border-transparent hover:border-white/20'}
                  `}
                >
                  {av.emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ── Confirm Modals ─────────────────────────────────────
  const ConfirmModal = ({ show, onClose, onConfirm, title, message, confirmLabel, confirmColor }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl p-6 border shadow-2xl bg-surface border-border"
          >
            <h3 className="text-lg font-bold mb-2 text-foreground">{title}</h3>
            <p className="text-sm mb-6 text-muted-foreground">{message}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors border-border text-muted-foreground hover:bg-muted">
                Cancel
              </button>
              <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white ${confirmColor} transition-opacity hover:opacity-90`}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ── Layout ─────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AvatarPickerModal />
      <ConfirmModal
        show={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetProgress}
        title="Reset All Progress?"
        message="This will permanently delete all your lesson, kanji, and vocabulary progress. This cannot be undone."
        confirmLabel="Yes, Reset"
        confirmColor="bg-orange-500"
      />
      <ConfirmModal
        show={showResetSettingsConfirm}
        onClose={() => setShowResetSettingsConfirm(false)}
        onConfirm={() => { resetToDefaults(); setShowResetSettingsConfirm(false); toast.success('Settings restored to defaults') }}
        title="Reset Settings?"
        message="This restores every preference on this page to its default value. Your progress and account are not affected."
        confirmLabel="Reset Settings"
        confirmColor="bg-blue-500"
      />
      <ConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This permanently deletes all your progress, settings, and profile data, then signs you out. This cannot be undone."
        confirmLabel="Delete My Data"
        confirmColor="bg-red-500"
      />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">⚙️ Settings</h1>
          <p className="text-sm mt-1 text-muted-foreground">Manage your account and app preferences</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Preferences save automatically
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar */}
        <div className="lg:w-60 flex-shrink-0 space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-surface border-border">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={settingsQuery}
              onChange={(e) => setSettingsQuery(e.target.value)}
              placeholder="Search settings…"
              className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground/70"
            />
          </div>

          <nav className="rounded-2xl border overflow-hidden bg-surface border-border">
            {filteredSections.map(({ id, label, icon: Icon, tint }, i) => {
              const t = SECTION_TINT[tint]
              const active = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-left transition-colors
                    ${i !== filteredSections.length - 1 ? 'border-b border-border' : ''}
                    ${active ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-red-500/15' : t.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-600 dark:text-red-400' : t.text}`} />
                  </div>
                  {label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              )
            })}
            {filteredSections.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">No settings match "{settingsQuery}"</p>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}