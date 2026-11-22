import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export interface BannerTheme {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  gradient: string;
  emoji: string;
  accentColor: string;
}

export const BANNER_THEMES: BannerTheme[] = [
  {
    id: 'twilight',
    name: 'Twilight Wave',
    nameJa: '黄昏の波',
    description: 'Iconic violet nightfall, glowing moon, Torii silhouette & rolling sea waves.',
    gradient: 'linear-gradient(120deg, #6d28d9 0%, #7c3aed 25%, #6366f1 55%, #4338ca 80%, #6d28d9 100%)',
    emoji: '🌌',
    accentColor: '#a855f7',
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    nameJa: '桜の花びら',
    description: 'Spring blossom petal showers, soft rose gradients & Mount Fuji silhouette.',
    gradient: 'linear-gradient(120deg, #f472b6 0%, #ec4899 25%, #db2777 55%, #be185d 80%, #f472b6 100%)',
    emoji: '🌸',
    accentColor: '#ec4899',
  },
  {
    id: 'fuji_sunrise',
    name: 'Fuji Sunrise',
    nameJa: '富士の日の出',
    description: 'Golden morning glow over Mount Fuji with rising red sun & morning clouds.',
    gradient: 'linear-gradient(120deg, #f97316 0%, #ea580c 25%, #dc2626 55%, #b91c1c 80%, #f97316 100%)',
    emoji: '🌅',
    accentColor: '#f97316',
  },
  {
    id: 'cyber_tokyo',
    name: 'Cyberpunk Tokyo',
    nameJa: '電脳東京',
    description: 'Futuristic Shinjuku nightscape with electric cyan, neon magenta & glowing grids.',
    gradient: 'linear-gradient(120deg, #06b6d4 0%, #3b82f6 25%, #6366f1 55%, #a855f7 80%, #ec4899 100%)',
    emoji: '⚡',
    accentColor: '#06b6d4',
  },
  {
    id: 'zen_bamboo',
    name: 'Zen Kyoto Grove',
    nameJa: '京都の竹林',
    description: 'Tranquil emerald bamboo grove with gentle morning mist & calm flowing stream.',
    gradient: 'linear-gradient(120deg, #059669 0%, #10b981 25%, #14b8a6 55%, #0d9488 80%, #059669 100%)',
    emoji: '🎋',
    accentColor: '#10b981',
  },
];

interface BannerThemeModalProps {
  isOpen: boolean;
  activeThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onClose: () => void;
}

export default function BannerThemeModal({
  isOpen,
  activeThemeId,
  onSelectTheme,
  onClose,
}: BannerThemeModalProps) {
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-surface border-2 border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground tracking-tight">
                  Choose Profile Banner Theme
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  Customize the animated Japanese atmosphere on your learner profile
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

          {/* Theme Cards List */}
          <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
            {BANNER_THEMES.map((theme) => {
              const isSelected = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    toast.success(`Banner changed to ${theme.name}!`, {
                      icon: theme.emoji,
                      style: {
                        borderRadius: '16px',
                        background: '#18181b',
                        color: '#fff',
                        fontWeight: 'bold',
                      },
                    });
                    onClose();
                  }}
                  className={`w-full group relative flex items-center gap-4 p-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40'
                      : 'border-border bg-muted/30 hover:bg-muted/70 hover:border-border text-foreground hover:scale-[1.01]'
                  }`}
                >
                  {/* Theme Gradient Preview */}
                  <div
                    className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl shadow-md border border-white/20 group-hover:scale-105 transition-transform"
                    style={{ background: theme.gradient }}
                  >
                    {theme.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground truncate">
                        {theme.name}
                      </p>
                      <span className="text-[10px] font-bold text-muted-foreground font-japanese">
                        {theme.nameJa}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2 font-medium">
                      {theme.description}
                    </p>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted-foreground/60 px-2 py-0.5 rounded-md bg-muted shrink-0">
                      Apply
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Themes animate automatically on your profile
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
