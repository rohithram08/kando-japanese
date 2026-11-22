// src/components/sensei/SenseiActionStrip.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Camera,
  Layers,
  Wand2,
  Smile,
  HelpCircle,
  Volume2,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { SenseiAnimationState } from './controllers/SenseiAnimationController';
import { SlimeAccessory } from './KandoSlime3D';
import { playPop, playSuccess } from '../../utils/soundEffects';

export interface ActionItem {
  id: SenseiAnimationState;
  icon: string;
  label: string;
  japanese: string;
  description: string;
}

export const HANA_ACTIONS: ActionItem[] = [
  {
    id: 'greeting',
    icon: '🙇‍♀️',
    label: 'Ojigi Bow',
    japanese: 'お辞儀',
    description: 'Respectful Japanese bow',
  },
  {
    id: 'teaching',
    icon: '🪄',
    label: 'Teach & Point',
    japanese: '教える',
    description: 'Magic wand teaching point',
  },
  {
    id: 'celebrating',
    icon: '🌸',
    label: 'Ganbatte Cheer',
    japanese: 'がんばって！',
    description: 'Joyful victory hop & celebration',
  },
  {
    id: 'thinking',
    icon: '🤔',
    label: 'Ponder',
    japanese: '考え中',
    description: 'Contemplative study pose',
  },
  {
    id: 'waving',
    icon: '👋',
    label: 'Genki Wave',
    japanese: '挨拶',
    description: 'Cheerful energetic wave',
  },
  {
    id: 'idle',
    icon: '✨',
    label: 'Poised Rest',
    japanese: '自然体',
    description: 'Calm natural stance with breathing',
  },
];

export const SLIME_ACCESSORIES: { id: SlimeAccessory; icon: string; label: string }[] = [
  { id: 'sensei_hat', icon: '🎓', label: 'Sensei Cap' },
  { id: 'baseball_cap', icon: '🧢', label: 'Cool Cap' },
  { id: 'ribbon', icon: '🎀', label: 'Sakura Bow' },
  { id: 'leaf', icon: '🍃', label: 'Tanuki Leaf' },
  { id: 'none', icon: '⚪', label: 'Bare Mochi' },
];

export interface SenseiActionStripProps {
  currentAction: SenseiAnimationState;
  onSelectAction: (action: SenseiAnimationState) => void;
  cameraMode: 'full' | 'teaching' | 'portrait';
  onSelectCamera: (mode: 'full' | 'teaching' | 'portrait') => void;
  slimeAccessory: SlimeAccessory;
  onSelectAccessory: (acc: SlimeAccessory) => void;
  dioramaRotation?: number;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
  onResetRotation?: () => void;
}

export function SenseiActionStrip({
  currentAction,
  onSelectAction,
  cameraMode,
  onSelectCamera,
  slimeAccessory,
  onSelectAccessory,
  dioramaRotation,
  onRotateLeft,
  onRotateRight,
  onResetRotation,
}: SenseiActionStripProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeToast, setActiveToast] = useState<{ label: string; jp: string } | null>(null);

  const handleActionClick = (action: ActionItem) => {
    playPop();
    onSelectAction(action.id);
    setActiveToast({ label: action.label, jp: action.japanese });
    setTimeout(() => {
      setActiveToast(null);
    }, 2400);
  };

  const handleCameraClick = (mode: 'full' | 'teaching' | 'portrait') => {
    playPop();
    onSelectCamera(mode);
  };

  const handleAccessoryClick = (acc: SlimeAccessory) => {
    playSuccess();
    onSelectAccessory(acc);
  };

  return (
    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col gap-2 pointer-events-none select-none">
      {/* ── Action Controls Capsule Reframed at Top-Left ── */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-700/70 shadow-2xl ring-1 ring-primary/20">
        {/* Toggle drawer button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border ${
            isExpanded
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-primary/15 hover:bg-primary/25 text-primary border-primary/25'
          }`}
          title={isExpanded ? 'Collapse 3D Action Studio' : 'Expand 3D Action Studio'}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-sans">Actions</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Quick 1-click action buttons strip */}
        <div className="flex items-center gap-1">
          {HANA_ACTIONS.slice(0, 4).map((act) => {
            const isActive = currentAction === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => handleActionClick(act)}
                className={`px-2 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200 border border-pink-400/50 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
                title={`${act.japanese} (${act.label}) - ${act.description}`}
              >
                <span>{act.icon}</span>
                <span className="hidden md:inline text-[11px] font-japanese">{act.japanese}</span>
              </button>
            );
          })}
        </div>

        {/* Unity Cinemachine Virtual Camera Switcher */}
        <div className="flex items-center gap-1 pl-1 ml-1 border-l border-slate-700/60">
          <button
            type="button"
            onClick={() => handleCameraClick('full')}
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1 active:scale-95 ${
              cameraMode === 'full'
                ? 'bg-gradient-to-r from-pink-500/35 to-rose-500/35 text-pink-200 border border-pink-400/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
            title="Full Stage: 360° Classroom director angle"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stage</span>
          </button>
          <button
            type="button"
            onClick={() => handleCameraClick('teaching')}
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1 active:scale-95 ${
              cameraMode === 'teaching'
                ? 'bg-gradient-to-r from-pink-500/35 to-rose-500/35 text-pink-200 border border-pink-400/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
            title="Teaching Focus: Medium shot focusing on gestures and wand"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teach</span>
          </button>
          <button
            type="button"
            onClick={() => handleCameraClick('portrait')}
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1 active:scale-95 ${
              cameraMode === 'portrait'
                ? 'bg-gradient-to-r from-pink-500/35 to-rose-500/35 text-pink-200 border border-pink-400/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
            title="Portrait Close-Up: Facial expressions and eye tracking"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portrait</span>
          </button>
        </div>

        {/* 360° Classroom Turntable Controls */}
        {onRotateLeft && onRotateRight && (
          <div className="hidden lg:flex items-center gap-1 pl-1 ml-1 border-l border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                playPop();
                onRotateLeft();
              }}
              className="p-1 hover:text-white hover:bg-slate-800 text-slate-400 rounded-lg transition-colors active:scale-95"
              title="Rotate Classroom Left 22.5°"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-400 font-medium px-0.5">360°</span>
            <button
              type="button"
              onClick={() => {
                playPop();
                onRotateRight();
              }}
              className="p-1 hover:text-white hover:bg-slate-800 text-slate-400 rounded-lg transition-colors active:scale-95"
              title="Rotate Classroom Right 22.5°"
            >
              <RotateCcw className="w-3.5 h-3.5 -scale-x-100" />
            </button>
            {dioramaRotation !== undefined && Math.abs(dioramaRotation) > 0.05 && onResetRotation && (
              <button
                type="button"
                onClick={() => {
                  playPop();
                  onResetRotation();
                }}
                className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-800 text-pink-300 hover:bg-slate-700 rounded-md border border-slate-700"
                title="Reset 360° View"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Action HUD Toast Banner ── */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="self-start px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-pink-400/40 text-pink-200 text-xs shadow-lg flex items-center gap-2 pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span className="font-bold font-japanese">{activeToast.jp}</span>
            <span className="text-slate-400 text-[11px]">•</span>
            <span className="text-slate-300 font-medium">{activeToast.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Expanded Drawer Drops Down from Top-Left without Covering Floor or Desk ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto p-3.5 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 shadow-2xl ring-1 ring-primary/20 flex flex-col gap-3 w-[290px] sm:w-[340px]"
          >
            {/* 1. All Hana Actions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Hana-Sensei Actions
                </span>
                <span className="text-[10px] text-pink-400 font-japanese">花先生アクション</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {HANA_ACTIONS.map((act) => {
                  const isActive = currentAction === act.id;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => handleActionClick(act)}
                      className={`p-2 rounded-xl text-left flex items-center gap-2 transition-all active:scale-95 ${
                        isActive
                          ? 'bg-pink-500/25 border border-pink-400/50 text-pink-200 shadow-sm'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      <span className="text-base">{act.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold font-japanese leading-tight">
                          {act.japanese}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">{act.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slime Wardrobe & Accessories */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Slime Companion Hat
                </span>
                <span className="text-[10px] text-sky-400 font-japanese">スライムアクセサリー</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {SLIME_ACCESSORIES.map((acc) => {
                  const isAccActive = slimeAccessory === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleAccessoryClick(acc.id)}
                      className={`py-1.5 px-1 rounded-xl text-center flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
                        isAccActive
                          ? 'bg-sky-500/25 border border-sky-400/50 text-sky-200 shadow-sm'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                      }`}
                      title={acc.label}
                    >
                      <span className="text-sm">{acc.icon}</span>
                      <span className="text-[9px] font-medium leading-none truncate w-full">
                        {acc.label.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Camera Director Presets for Mobile */}
            <div className="sm:hidden pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Camera Angle
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleCameraClick('full')}
                  className={`py-1 rounded-lg text-[10px] font-medium ${
                    cameraMode === 'full'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Stage
                </button>
                <button
                  type="button"
                  onClick={() => handleCameraClick('teaching')}
                  className={`py-1 rounded-lg text-[10px] font-medium ${
                    cameraMode === 'teaching'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Teach
                </button>
                <button
                  type="button"
                  onClick={() => handleCameraClick('portrait')}
                  className={`py-1 rounded-lg text-[10px] font-medium ${
                    cameraMode === 'portrait'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Portrait
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SenseiActionStrip;
