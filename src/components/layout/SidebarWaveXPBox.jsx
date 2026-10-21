// src/components/layout/SidebarWaveXPBox.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Animated 2D Liquid Wave XP Box for the Sidebar
// Features oscillating wave paths, liquid gradient, level progress & bubbling glow
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedLiquidWaveIcon } from '../common/WaveXPBadge';
import { getUserLevelProgress } from '../../utils/progressCalculator';
import { Sparkles } from 'lucide-react';

export default function SidebarWaveXPBox({
  totalXP = 0,
  userLevel = 1,
  className = '',
  onClick,
}) {
  const levelProgress = getUserLevelProgress(totalXP);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-cyan-500/25 dark:border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-600/10 p-2.5 transition-all hover:border-cyan-400/50 hover:shadow-xs group ${className}`}
    >
      {/* Background Animated Liquid Wave Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-40">
        <motion.div
          animate={{ x: [-100, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="absolute -bottom-2 -left-10 w-[200%] h-8 bg-gradient-to-t from-cyan-500/30 to-transparent blur-xs"
        />
      </div>

      {/* Top Row: Wave Icon + XP Count + Shimmer Pill */}
      <div className="relative flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <AnimatedLiquidWaveIcon size={24} className="ring-1 ring-cyan-400/40" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black font-mono text-cyan-600 dark:text-cyan-300 tracking-tight">
                {totalXP.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700/80 dark:text-cyan-400/80">
                Wave XP
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">
              Lv.{userLevel} Adventurer
            </p>
          </div>
        </div>

        <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-400/30">
          <Sparkles className="w-2.5 h-2.5 text-cyan-500 animate-spin" style={{ animationDuration: '6s' }} />
          {levelProgress.percent}%
        </span>
      </div>

      {/* Bottom Row: Animated Liquid Wave Level Bar */}
      <div className="relative">
        <div className="h-1.5 w-full rounded-full bg-cyan-950/20 dark:bg-cyan-900/40 overflow-hidden border border-cyan-500/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, levelProgress.percent)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Liquid shine glint */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-8"
            />
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-1">
          <span>{totalXP} XP</span>
          <span>Next Lv.{userLevel + 1}: {levelProgress.nextLevelXP} XP</span>
        </div>
      </div>
    </div>
  );
}
