import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Globe, Sparkles, BookOpen } from 'lucide-react';
import { SUPPORTED_LOCALES, normalizeLocale, hasUiTranslations, useI18n } from '../../i18n';
import { useSettingsStore } from '../../store/settingsStore';
import { useStudyLevel } from '../../hooks/useStudyLevel';
import toast from 'react-hot-toast';

interface DuolingoLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DuolingoLanguageModal({ isOpen, onClose }: DuolingoLanguageModalProps) {
  const { t } = useI18n();
  const { studyLevel } = useStudyLevel();
  const displayLanguage = useSettingsStore(
    (s: any) => s.displayLanguage || s.nativeLanguage || 'en'
  );
  const updateSettings = useSettingsStore((s: any) => s.updateSettings);
  const [search, setSearch] = useState('');

  const activeCode = normalizeLocale(displayLanguage);

  // Filter locales based on search input
  const filteredLocales = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SUPPORTED_LOCALES;
    return SUPPORTED_LOCALES.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.nativeLabel.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelectLanguage = (code: string, nativeLabel: string) => {
    if (updateSettings) {
      updateSettings({
        displayLanguage: code,
        explanationLanguage: code,
        nativeLanguage: code,
      });
    }
    toast.success(`Language set to ${nativeLabel} (${code.toUpperCase()})`, {
      icon: '🌐',
      style: {
        borderRadius: '16px',
        background: '#18181b',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl max-h-[85vh] bg-surface border-2 border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                🌐
              </div>
              <div>
                <h3 className="text-base font-black text-foreground tracking-tight">
                  {t('settings.language_courses', 'Language & Course Selector')}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {t('settings.duo_lang_subtitle', 'Choose your native language for explanations and menus')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Target Course Banner (Duolingo Header) */}
          <div className="px-5 py-3.5 bg-linear-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇯🇵</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground">
                    Target Course: Japanese (日本語)
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500 text-white shadow-xs">
                    {studyLevel}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  JLPT N5~N1 Curriculum with authentic dialogues and stories
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-border/60 bg-surface">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by language name (e.g. Spanish, தமிழ், Français, हिंदी)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 border border-border text-xs font-semibold text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Languages Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              Select Your Native Language (I speak...)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {filteredLocales.map((loc) => {
                const isSelected = activeCode === loc.code;
                const hasTranslation = hasUiTranslations(loc.code);

                return (
                  <button
                    key={loc.code}
                    onClick={() => handleSelectLanguage(loc.code, loc.nativeLabel)}
                    className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary shadow-xs ring-1 ring-primary/30'
                        : 'bg-muted/30 border-border hover:bg-muted/70 hover:border-border text-foreground hover:scale-[1.01]'
                    }`}
                  >
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {loc.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold truncate leading-snug">
                          {loc.nativeLabel}
                        </p>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate font-medium">
                        {loc.label} ({loc.code.toUpperCase()})
                      </p>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground/60 px-2 py-0.5 rounded-md bg-muted shrink-0">
                        Select
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredLocales.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground font-medium">
                No matching languages found for &quot;{search}&quot;.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              Dynamic SOV alignment across all languages
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
