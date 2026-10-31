// src/pages/SettingsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Bell, Shield, Palette, Volume2, BookOpen,
  Monitor, Moon, Sun, ChevronRight, RotateCcw, Search,
  Trash2, Download,
  Pencil, Lock,
  RefreshCcw, CheckCircle2,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useSettingsStore } from '../store/settingsStore'
import { deleteAccount } from '../api/users'
import UserAvatar from '../components/common/UserAvatar'
import { normalizeProfile } from '../utils/userIdentity'
import { resetAllProgress } from '../api/progress'
import { normalizeLocale, useI18n, SUPPORTED_LOCALES } from '../i18n'
import LanguageSelector from '../components/common/LanguageSelector'
import { useStudyLevel } from '../hooks/useStudyLevel'
import { APP_VERSION, APP_NAME, APP_CODENAME, APP_RELEASE_DATE } from '../config/version'
import toast from 'react-hot-toast'


// id / label / icon / tint / search keywords — keywords power the settings search box
const SECTIONS = [
  { id: 'account',       label: 'Account & Security', icon: Shield,   emoji: '🔒', tint: 'red',    keywords: 'account email password profile security login credentials' },
  { id: 'general',       label: 'General',            icon: Globe,    emoji: '🌐', tint: 'blue',   keywords: 'display language jlpt study target level' },
  { id: 'appearance',    label: 'Appearance',         icon: Palette,  emoji: '🎨', tint: 'violet', keywords: 'theme dark light font size furigana romaji compact animations' },
  { id: 'study',         label: 'Study Preferences', icon: BookOpen, emoji: '📖', tint: 'emerald',keywords: 'daily goal xp srs interval translation autoplay' },
  { id: 'notifications', label: 'Notifications',     icon: Bell,     emoji: '🔔', tint: 'orange', keywords: 'reminder streak achievement weekly report' },
  { id: 'audio',         label: 'Audio & Speech',    icon: Volume2,  emoji: '🔊', tint: 'cyan',   keywords: 'speech rate pitch slow autospeak voice' },
  { id: 'privacy',       label: 'Privacy & Data',    icon: Lock,     emoji: '🛡️', tint: 'gray',   keywords: 'export delete reset analytics' },
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
  const { user, profile, logout } = useAuthStore()
  const navigate = useNavigate()
  const { theme, setTheme } = useThemeStore()
  const settings = useSettingsStore()
  const { updateSettings, resetToDefaults } = settings
  const { studyLevel, setStudyLevel } = useStudyLevel()
  const { t, setLocale: setDisplayLanguage } = useI18n()

  const [activeSection, setActiveSection]         = useState('account')
  const [settingsQuery, setSettingsQuery]          = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm]  = useState(false)
  const [showResetConfirm, setShowResetConfirm]    = useState(false)
  const [showResetSettingsConfirm, setShowResetSettingsConfirm] = useState(false)

  const identity = normalizeProfile(profile, user)
  const [nativeLanguage, setNativeLanguage] = useState(
    normalizeLocale(identity.nativeLanguage || settings.nativeLanguage || 'en')
  )

  useEffect(() => {
    if (profile) {
      setNativeLanguage(normalizeLocale(identity.nativeLanguage || settings.nativeLanguage || 'en'))
    }
  }, [profile, identity.nativeLanguage, settings.nativeLanguage])

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
      toast.success(t('toast.data_exported', 'Data exported successfully!'))
    } catch (err) {
      console.error('Export failed:', err)
      toast.error(t('toast.data_export_failed', 'Failed to export data'))
    }
  }

  const handleResetProgress = async () => {
    try {
      if (user?.id) {
        await resetAllProgress()
      }
      setShowResetConfirm(false)
      toast.success(t('toast.progress_reset', 'Progress has been reset'))
    } catch (err) {
      console.error('Reset progress failed:', err)
      toast.error(t('toast.progress_reset_failed', 'Failed to reset progress'))
    }
  }

  // Deletes user account and associated data in backend, then signs out.
  const handleDeleteAccount = async () => {
    if (!user?.id) { setShowDeleteConfirm(false); return }
    try {
      await deleteAccount()

      setShowDeleteConfirm(false)
      toast.success(t('toast.account_deleted', 'Your data has been deleted'))
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Delete account failed:', err)
      toast.error(t('toast.account_delete_failed', 'Failed to delete account data'))
    }
  }

  // Module-level option arrays hold English fallbacks only; labels are resolved
  // through t() on every render so they follow the active display language.
  const localizedSections = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        label: s.id === 'account' ? t('settings.account_security', s.label) : t(`settings.nav_${s.id}`, s.label),
      })),
    [t]
  )
  const localizedFontSizes = FONT_SIZES.map((o) => ({ ...o, label: t(`settings.font_${o.value}`, o.label) }))
  const localizedFuriganaModes = FURIGANA_MODES.map((o) => ({
    ...o,
    label: t(`settings.furigana_${o.value}`, o.label),
    desc: t(`settings.furigana_${o.value}_desc`, o.desc),
  }))
  const localizedSrsIntervals = SRS_INTERVALS.map((o) => ({
    ...o,
    label: t(`settings.srs_${o.value}`, o.label),
    desc: t(`settings.srs_${o.value}_desc`, o.desc),
  }))

  // Filter the section nav by the settings search box
  const filteredSections = useMemo(() => {
    const q = settingsQuery.trim().toLowerCase()
    if (!q) return localizedSections
    return localizedSections.filter((s) => s.label.toLowerCase().includes(q) || s.keywords.includes(q))
  }, [settingsQuery, localizedSections])

  // ── Section Renderer ───────────────────────────────────
  const renderSection = () => {
    switch (activeSection) {

      // ── ACCOUNT & SECURITY (LEARNER IDENTITY MANAGED ON PROFILE PAGE) ──
      case 'account':
      case 'profile':
        return (
          <div className="space-y-6">
            {/* 1. Public Learner Profile Direct Link */}
            <SectionCard title={t('settings.profile_card_title', 'Learner Profile')} emoji="👤">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-3.5">
                  <UserAvatar
                    profile={identity}
                    size="xl"
                    rounded="rounded-2xl"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-foreground">{identity.username}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {identity.jlptLevel || 'N5'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your avatar, mascot, username, and learning identity are managed directly on your Profile.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/profile?edit=true')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit on My Profile →</span>
                </button>
              </div>
            </SectionCard>

            {/* 2. Account Email & Credentials */}
            <SectionCard title={t('settings.account_security', 'Account & Security')} emoji="🔒">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <p className="text-xs font-bold text-foreground">Registered Email</p>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{user?.email || 'OAuth Account'}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <p className="text-xs font-bold text-foreground">Password & Access</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Change your password or request a secure reset link</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-border bg-surface hover:bg-muted text-foreground transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        )

      // ── GENERAL ──────────────────────────────────────
      case 'general':
        return (
          <div className="space-y-6">
            <SectionCard title={t('settings.display_lang_title', 'Display & Interface Language')} emoji="🌐">
              <p className="text-xs text-muted-foreground mb-3 -mt-2">
                {t('settings.display_lang_desc', 'Language used for platform interface labels and menus.')}
              </p>
              <LanguageSelector onLanguageChange={(code) => setDisplayLanguage(code)} />
            </SectionCard>

            <SectionCard>
              <SettingRow
                label={t('settings.study_level', 'Study Level')}
                description={t(
                  'settings.study_level_desc',
                  'Lessons, Grammar, Vocabulary, Kanji and Graded Reader show content up to this level. Higher levels unlock when you move up; lower levels always stay available.',
                )}
              >
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {JLPT_LEVELS.map((lvl) => (
                    <ChoicePill
                      key={lvl}
                      active={studyLevel === lvl}
                      onClick={async () => {
                        if (lvl === studyLevel) return
                        try {
                          await setStudyLevel(lvl)
                          toast.success(`Study level set to ${lvl}`)
                        } catch (err) {
                          console.error(err)
                          toast.error('Could not change study level')
                        }
                      }}
                    >
                      {lvl}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>

              <SettingRow
                label={t('settings.explanation_lang_title', 'Learning Support & Explanation Language')}
                description={t('settings.explanation_lang_desc', 'Language Hana-sensei and lesson cards use to explain Japanese.')}
              >
                <SelectField
                  value={settings.explanationLanguage || 'en'}
                  onChange={(v) => updateSettings({ explanationLanguage: v })}
                  options={SUPPORTED_LOCALES.map((l) => ({ value: l.code, label: `${l.label} (${l.nativeLabel})`, flag: l.flag }))}
                />
              </SettingRow>

              <SettingRow
                label={t('settings.native_lang_title', 'Native Language (Mother Tongue)')}
                description={t('settings.native_lang_desc', 'Your mother tongue for demographic and profile records')}
                noBorder
              >
                <SelectField
                  value={nativeLanguage}
                  onChange={(v) => {
                    setNativeLanguage(v)
                    updateSettings({ nativeLanguage: v })
                  }}
                  options={SUPPORTED_LOCALES.map((l) => ({ value: l.code, label: `${l.label} (${l.nativeLabel})`, flag: l.flag }))}
                />
              </SettingRow>
            </SectionCard>

            <SectionCard title={t('settings.platform_version_title', 'Platform Version & System')} emoji="🚀">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{APP_NAME}</p>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      v{APP_VERSION}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Release {APP_CODENAME} · Built {APP_RELEASE_DATE}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Up to Date
                </span>
              </div>
            </SectionCard>
          </div>
        )

      // ── APPEARANCE ────────────────────────────────────
      case 'appearance':
        return (
          <div className="space-y-4">
            <SectionCard title={t('settings.theme_title', 'Theme')} emoji="🌗">
              <div className="flex gap-2">
                {[
                  { value: 'light',  Icon: Sun,     label: t('settings.theme_light', 'Light') },
                  { value: 'dark',   Icon: Moon,    label: t('settings.theme_dark', 'Dark') },
                  { value: 'system', Icon: Monitor, label: t('settings.theme_system', 'System') },
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

            <SectionCard title={t('settings.display_title', 'Display')} emoji="🖥️">
              <SettingRow label={t('settings.font_size', 'Font Size')} description={t('settings.font_size_desc', 'Size of text throughout the app')}>
                <SelectField value={settings.fontSize} onChange={(v) => updateSettings({ fontSize: v })} options={localizedFontSizes} />
              </SettingRow>
              <SettingRow label={t('settings.furigana_title', 'Furigana Reading Mode')} description={t('settings.furigana_desc', 'Adaptive cognitive fading, on demand tap-to-reveal, or permanent display')}>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {localizedFuriganaModes.map(({ value, label, desc }) => (
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
              <SettingRow label={t('settings.romaji', 'Show Romaji')} description={t('settings.romaji_desc', 'Display romanized pronunciation in Grammar & Vocabulary')}>
                <Toggle enabled={settings.romaji} onChange={(v) => updateSettings({ romaji: v })} />
              </SettingRow>
              <SettingRow label={t('settings.compact', 'Compact Mode')} description={t('settings.compact_desc', 'Reduce spacing to fit more content')}>
                <Toggle enabled={settings.compactMode} onChange={(v) => updateSettings({ compactMode: v })} />
              </SettingRow>
              <SettingRow label={t('settings.animations', 'Animations')} description={t('settings.animations_desc', 'Enable motion effects and transitions')} noBorder>
                <Toggle enabled={settings.animations} onChange={(v) => updateSettings({ animations: v })} />
              </SettingRow>
            </SectionCard>
          </div>
        )

      // ── STUDY ─────────────────────────────────────────
      case 'study':
        return (
          <div className="space-y-4">
            <SectionCard title={t('settings.goals_title', 'Goals')} emoji="🎯">
              <SettingRow label={t('settings.daily_goal', 'Daily XP Goal')} description={t('settings.daily_goal_desc', 'Tracked live on your Dashboard')} noBorder>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {DAILY_GOALS.map((g) => (
                    <ChoicePill key={g} active={settings.dailyGoal === g} onClick={() => updateSettings({ dailyGoal: g })}>
                      {g}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>
            </SectionCard>

            <SectionCard title={t('settings.srs_title', 'SRS Settings')} emoji="🔁">
              <SettingRow label={t('settings.srs_interval', 'Review Interval Mode')} description={t('settings.srs_interval_desc', 'How aggressively to space your reviews')} noBorder>
                <div className="flex gap-1.5">
                  {localizedSrsIntervals.map(({ value, label, desc }) => (
                    <ChoicePill key={value} active={settings.srsInterval === value} onClick={() => updateSettings({ srsInterval: value })} title={desc}>
                      {label}
                    </ChoicePill>
                  ))}
                </div>
              </SettingRow>
            </SectionCard>

            <SectionCard title={t('settings.lesson_prefs_title', 'Lesson Preferences')} emoji="📖">
              <SettingRow label={t('settings.show_translation', 'Show Translation')} description={t('settings.show_translation_desc', 'Display English translations during lessons (off shows a tap-to-reveal)')}>
                <Toggle enabled={settings.showTranslation} onChange={(v) => updateSettings({ showTranslation: v })} />
              </SettingRow>
              <SettingRow label={t('settings.auto_play', 'Auto-Play Audio')} description={t('settings.auto_play_desc', 'Automatically play audio for new words in Lessons')} noBorder>
                <Toggle enabled={settings.autoPlay} onChange={(v) => updateSettings({ autoPlay: v })} />
              </SettingRow>
            </SectionCard>
          </div>
        )

      // ── NOTIFICATIONS ─────────────────────────────────
      case 'notifications':
        return (
          <SectionCard>
            <SettingRow label={t('settings.reminder', 'Daily Study Reminder')} description={t('settings.reminder_desc', 'A real browser notification while the app is open, at the time below')}>
              <Toggle enabled={settings.dailyReminder} onChange={(v) => updateSettings({ dailyReminder: v })} />
            </SettingRow>
            <SettingRow label={t('settings.reminder_time', 'Reminder Time')} description={t('settings.reminder_time_desc', 'When to send your daily reminder')}>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                disabled={!settings.dailyReminder}
                className="px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-surface border-border text-foreground disabled:opacity-40"
              />
            </SettingRow>
            <SettingRow label={t('settings.streak_alerts', 'Streak Alerts')} description={t('settings.streak_alerts_desc', 'Notify you when you hit a streak milestone')}>
              <Toggle enabled={settings.streakAlert} onChange={(v) => updateSettings({ streakAlert: v })} />
            </SettingRow>
            <SettingRow label={t('settings.achievement_alerts', 'Achievement Alerts')} description={t('settings.achievement_alerts_desc', 'Notify you when you unlock a badge')}>
              <Toggle enabled={settings.achievementAlert} onChange={(v) => updateSettings({ achievementAlert: v })} />
            </SettingRow>
            <SettingRow label={t('settings.weekly_report', 'Weekly Progress Report')} description={t('settings.weekly_report_desc', 'An in-app summary of your week, every 7 days')} noBorder>
              <Toggle enabled={settings.weeklyReport} onChange={(v) => updateSettings({ weeklyReport: v })} />
            </SettingRow>
          </SectionCard>
        )

      // ── AUDIO ─────────────────────────────────────────
      case 'audio':
        return (
          <SectionCard>
            <SettingRow label={t('settings.auto_speak', 'Auto-Speak')} description={t('settings.auto_speak_desc', 'Automatically read new words aloud in Vocabulary & Kanji')}>
              <Toggle enabled={settings.autoSpeak} onChange={(v) => updateSettings({ autoSpeak: v })} />
            </SettingRow>
            <SettingRow label={t('settings.slow_speech', 'Slow Speech Mode')} description={t('settings.slow_speech_desc', 'Caps playback speed for clearer pronunciation')}>
              <Toggle enabled={settings.slowMode} onChange={(v) => updateSettings({ slowMode: v })} />
            </SettingRow>
            <SettingRow label={t('settings.speech_rate', 'Speech Rate')} description={t('settings.speech_rate_desc', { rate: settings.speechRate }, `Speed: ${settings.speechRate}x — applies to every audio button in the app`)}>
              <input
                type="range" min="0.5" max="2" step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-32 accent-red-500"
              />
            </SettingRow>
            <SettingRow label={t('settings.speech_pitch', 'Speech Pitch')} description={t('settings.speech_pitch_desc', { pitch: settings.speechPitch }, `Pitch: ${settings.speechPitch}x`)} noBorder>
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
            <SectionCard title={t('settings.analytics_title', 'Analytics')} emoji="📊">
              <p className="text-xs text-muted-foreground mb-3 -mt-2">
                {t('settings.analytics_note', "This build doesn't send analytics or crash reports to any server — these preferences are saved for if/when that's added, and won't change current behavior.")}
              </p>
              <SettingRow label={t('settings.usage_analytics', 'Usage Analytics')} description={t('settings.usage_analytics_desc', 'Help improve the app with anonymous data')}>
                <Toggle enabled={settings.analytics} onChange={(v) => updateSettings({ analytics: v })} />
              </SettingRow>
              <SettingRow label={t('settings.crash_reports', 'Crash Reports')} description={t('settings.crash_reports_desc', 'Send crash logs to help fix bugs')} noBorder>
                <Toggle enabled={settings.crashReports} onChange={(v) => updateSettings({ crashReports: v })} />
              </SettingRow>
            </SectionCard>

            <SectionCard title={t('settings.your_data_title', 'Your Data')} emoji="📦">
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-surface border-border text-foreground/80 hover:bg-muted"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <div className="text-left">
                  <p className="font-semibold">{t('settings.export_data', 'Export Data')}</p>
                  <p className="text-xs text-muted-foreground">{t('settings.export_data_desc', 'Download your profile & preferences as JSON')}</p>
                </div>
              </button>
            </SectionCard>

            <SectionCard title={t('settings.danger_title', 'Danger Zone')} emoji="⚠️">
              <div className="space-y-3">
                <button
                  onClick={() => setShowResetSettingsConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-surface border-border text-foreground/80 hover:bg-muted"
                >
                  <RefreshCcw className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <p className="font-semibold">{t('settings.reset_settings', 'Reset Settings to Defaults')}</p>
                    <p className="text-xs text-muted-foreground">{t('settings.reset_settings_desc', 'Restore every preference on this page')}</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100 dark:bg-orange-500/5 dark:border-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">{t('settings.reset_progress_btn', 'Reset Progress')}</p>
                    <p className="text-xs text-orange-500/60 dark:text-orange-400/60">{t('settings.reset_progress_desc', 'Clear all lesson, kanji & vocab progress')}</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border transition-colors bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-500/5 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-semibold">{t('settings.delete_account', 'Delete Account')}</p>
                    <p className="text-xs text-red-500/60 dark:text-red-400/60">{t('settings.delete_account_desc', 'Permanently remove all your data')}</p>
                  </div>
                </button>
              </div>
            </SectionCard>
          </div>
        )

      default: return null
    }
  }

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
      <ConfirmModal
        show={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetProgress}
        title={t('settings.confirm_reset_title', 'Reset All Progress?')}
        message={t('settings.confirm_reset_msg', 'This will permanently delete all your lesson, kanji, and vocabulary progress. This cannot be undone.')}
        confirmLabel={t('settings.confirm_reset_yes', 'Yes, Reset')}
        confirmColor="bg-orange-500"
      />
      <ConfirmModal
        show={showResetSettingsConfirm}
        onClose={() => setShowResetSettingsConfirm(false)}
        onConfirm={() => { resetToDefaults(); setShowResetSettingsConfirm(false); toast.success(t('toast.settings_reset', 'Settings restored to defaults')) }}
        title={t('settings.confirm_settings_title', 'Reset Settings?')}
        message={t('settings.confirm_settings_msg', 'This restores every preference on this page to its default value. Your progress and account are not affected.')}
        confirmLabel={t('settings.confirm_settings_yes', 'Reset Settings')}
        confirmColor="bg-blue-500"
      />
      <ConfirmModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title={t('settings.confirm_delete_title', 'Delete Account?')}
        message={t('settings.confirm_delete_msg', 'This permanently deletes all your progress, settings, and profile data, then signs you out. This cannot be undone.')}
        confirmLabel={t('settings.confirm_delete_yes', 'Delete My Data')}
        confirmColor="bg-red-500"
      />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">⚙️ {t('settings.page_title', 'Settings')}</h1>
          <p className="text-sm mt-1 text-muted-foreground">{t('settings.page_subtitle', 'Manage your account and app preferences')}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t('settings.autosave_badge', 'Preferences save automatically')}
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
              placeholder={t('settings.search_placeholder', 'Search settings…')}
              className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground/70"
            />
          </div>

          <nav className="rounded-2xl border overflow-hidden bg-surface border-border">
            {filteredSections.map(({ id, label, icon: Icon, tint }, i) => {
              const tintCls = SECTION_TINT[tint]
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
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-red-500/15' : tintCls.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-600 dark:text-red-400' : tintCls.text}`} />
                  </div>
                  {label}
                  {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                </button>
              )
            })}
            {filteredSections.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-muted-foreground">{t('settings.no_match', { query: settingsQuery }, `No settings match "${settingsQuery}"`)}</p>
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