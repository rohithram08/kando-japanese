import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Globe } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'
import { SUPPORTED_LOCALES, normalizeLocale, hasUiTranslations } from '../../i18n'

// Only offer languages whose interface is actually translated. Listing the rest
// made the picker look like it worked while the UI silently stayed in English.
const LANGUAGES = SUPPORTED_LOCALES.filter((l) => hasUiTranslations(l.code))

const LanguageSelector = ({ compact = false, onLanguageChange }) => {
  const displayLanguage = useSettingsStore(
    (s) => s.displayLanguage || s.nativeLanguage || 'en'
  )
  const setDisplayLanguage = useSettingsStore((s) => s.setDisplayLanguage || s.setNativeLanguage)
  const setExplanationLanguage = useSettingsStore((s) => s.setExplanationLanguage)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  const activeCode = normalizeLocale(displayLanguage)
  const selected = LANGUAGES.find((l) => l.code === activeCode) || LANGUAGES[0]

  const filtered =
    search.trim() === ''
      ? LANGUAGES
      : LANGUAGES.filter(
          (l) =>
            l.label.toLowerCase().includes(search.toLowerCase()) ||
            l.nativeLabel.toLowerCase().includes(search.toLowerCase()) ||
            l.code.toLowerCase().includes(search.toLowerCase())
        )

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSelect = (lang) => {
    if (updateSettings) {
      updateSettings({
        displayLanguage: lang.code,
        explanationLanguage: lang.code,
        nativeLanguage: lang.code,
      })
    } else {
      setDisplayLanguage?.(lang.code)
      setExplanationLanguage?.(lang.code)
    }
    onLanguageChange?.(lang.code)
    setIsOpen(false)
    setSearch('')
  }

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select Display & Translation Language"
          title={`Display & Translation Language: ${selected.label}`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-muted hover:bg-muted/70 text-foreground transition-all duration-200"
        >
          <span className="text-sm leading-none">{selected.flag}</span>
          <span className="text-xs font-semibold uppercase hidden sm:inline-block">
            {selected.code}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl overflow-hidden z-50 p-1"
            >
              <div className="px-3 py-1.5 border-b border-border/60 flex items-center justify-between">
                <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-primary" />
                  Language
                </p>
                <span className="text-[10px] text-muted-foreground/70">Scroll for all</span>
              </div>

              <div className="max-h-56 overflow-y-auto py-1 space-y-0.5">
                {filtered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg transition-colors ${
                      selected.code === lang.code
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    <span className="text-sm leading-none shrink-0">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-tight">{lang.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate leading-none">{lang.nativeLabel}</p>
                    </div>
                    {selected.code === lang.code && (
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Display & Translation Language"
        className="w-full flex items-center gap-3 bg-muted/40 hover:bg-muted/70 border border-border rounded-2xl px-4 py-3 transition-all text-foreground"
      >
        <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-xl leading-none">{selected.flag}</span>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">{selected.label}</p>
          <p className="text-xs text-muted-foreground">{selected.nativeLabel}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
          >
            <div className="px-3 py-2 border-b border-border/60">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-muted border border-border rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <div className="max-h-60 overflow-y-auto py-1">
              {filtered.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-xl transition-colors ${
                    selected.code === lang.code
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <span className="text-xl leading-none w-7 text-center">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{lang.label}</p>
                    <p className="text-xs text-muted-foreground">{lang.nativeLabel}</p>
                  </div>
                  {selected.code === lang.code && (
                    <Check className="w-4 h-4 text-primary shrink-0 ml-1" />
                  )}
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No languages found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSelector