// src/components/listening/ListeningCinemaPlayer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// YouTube-Style Unified Cinema Video Player for Japanese Listening Practice
// Combines Animated Scene Illustration, Audio Engine, On-Screen Captions & Controls
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BellRing,
  Award,
  Sparkles,
  Maximize2,
  Minimize2,
  Subtitles,
  ListOrdered,
  BookOpen,
  Headphones,
  Sliders,
} from 'lucide-react';
import type { ListeningScenario, DialogueLine, StoryboardScene } from '../../api/listening';

interface ListeningCinemaPlayerProps {
  scenario: ListeningScenario;
  isPlaying: boolean;
  currentLineIndex: number;
  activeSceneIndex: number;
  playbackRate: number;
  showFurigana: boolean;
  showEnglishSubtitle: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onPlayLine: (lineIdx: number) => void;
  onSelectScene: (sceneIdx: number) => void;
  onSetPlaybackRate: (rate: number) => void;
  onToggleFurigana: () => void;
  onToggleEnglish: () => void;
  onPlayChime: () => void;
  onOpenExam: () => void;
}

export const ListeningCinemaPlayer: React.FC<ListeningCinemaPlayerProps> = ({
  scenario,
  isPlaying,
  currentLineIndex,
  activeSceneIndex,
  playbackRate,
  showFurigana,
  showEnglishSubtitle,
  onTogglePlay,
  onRestart,
  onPlayLine,
  onSelectScene,
  onSetPlaybackRate,
  onToggleFurigana,
  onToggleEnglish,
  onPlayChime,
  onOpenExam,
}) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'transcript' | 'scenes'>('transcript');
  const transcriptListRef = useRef<HTMLDivElement>(null);

  const activeLine: DialogueLine | undefined = scenario.dialogue[currentLineIndex];
  const activeScene: StoryboardScene =
    scenario.storyboard[activeSceneIndex] || scenario.storyboard[0];

  // Auto-scroll transcript to active line
  useEffect(() => {
    if (transcriptListRef.current) {
      const activeElement = transcriptListRef.current.querySelector(
        `[data-line-idx="${currentLineIndex}"]`
      ) as HTMLElement | null;
      if (activeElement && typeof activeElement.scrollIntoView === 'function') {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLineIndex]);

  // Calculate approximate elapsed seconds
  const totalDuration = scenario.durationSeconds || 45;
  const elapsedSec = activeLine ? activeLine.timeOffsetSec : 0;
  const progressPct = Math.min(100, Math.max(0, (elapsedSec / totalDuration) * 100));

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Render high-res thematic vector illustration for video screen
  const renderCinemaVisual = (theme: string) => {
    switch (theme) {
      case 'convenience_store':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgConbiniCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="50%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
              <linearGradient id="counterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgConbiniCinema)" />
            {/* Ceiling fluorescent lighting */}
            <rect x="80" y="25" width="640" height="10" rx="5" fill="#ffffff" opacity="0.95" />
            <rect x="120" y="50" width="560" height="6" rx="3" fill="#ffffff" opacity="0.75" />
            {/* Store Wall Posters */}
            <rect x="60" y="90" width="120" height="100" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
            <rect x="70" y="100" width="100" height="35" rx="4" fill="#16a34a" />
            <text x="82" y="122" fill="#ffffff" fontSize="13" fontWeight="bold">7-ELEVEN 🏪</text>
            <text x="85" y="155" fill="#334155" fontSize="12" fontWeight="bold">新発売 お弁当</text>
            <text x="88" y="175" fill="#16a34a" fontSize="14" fontWeight="black">¥680</text>
            {/* Japanese Noren / Banner */}
            <rect x="290" y="60" width="220" height="50" rx="10" fill="#15803d" />
            <text x="325" y="92" fill="#ffffff" fontSize="18" fontWeight="bold" letterSpacing="3">
              コンビニ・レジ
            </text>
            {/* Main Checkout Counter Shelf */}
            <rect x="60" y="210" width="680" height="190" rx="16" fill="url(#counterGrad)" stroke="#94a3b8" strokeWidth="4" />
            <line x1="60" y1="280" x2="740" y2="280" stroke="#cbd5e1" strokeWidth="3" />
            {/* Bento boxes on shelf */}
            <rect x="110" y="230" width="110" height="40" rx="8" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
            <rect x="120" y="238" width="40" height="24" rx="4" fill="#ef4444" />
            <rect x="165" y="238" width="45" height="24" rx="4" fill="#fef08a" />
            <rect x="235" y="230" width="110" height="40" rx="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            {/* Onigiri triangles */}
            <polygon points="380,270 410,225 440,270" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
            <rect x="400" y="250" width="20" height="20" fill="#0f172a" rx="2" />
            <polygon points="455,270 485,225 515,270" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
            <rect x="475" y="250" width="20" height="20" fill="#0f172a" rx="2" />
            {/* Green tea bottles */}
            <rect x="110" y="300" width="30" height="48" rx="6" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
            <rect x="150" y="300" width="30" height="48" rx="6" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
            <rect x="190" y="300" width="30" height="48" rx="6" fill="#15803d" stroke="#166534" strokeWidth="2" />
            {/* Modern Touch POS Register Terminal */}
            <rect x="530" y="225" width="160" height="110" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <rect x="545" y="240" width="130" height="60" rx="6" fill="#0284c7" />
            <text x="565" y="265" fill="#ffffff" fontSize="12" fontWeight="bold">合計 (Total)</text>
            <text x="565" y="290" fill="#ffffff" fontSize="22" fontWeight="black">¥680</text>
            {/* Microwave Oven */}
            <rect x="550" y="340" width="130" height="50" rx="8" fill="#334155" />
            <rect x="560" y="348" width="80" height="34" rx="4" fill="#fbbf24" opacity="0.8" />
            <text x="575" y="370" fill="#78350f" fontSize="11" fontWeight="bold">温め中 🔥</text>
          </svg>
        );

      case 'train_station':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgStationCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eff6ff" />
                <stop offset="50%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#bfdbfe" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgStationCinema)" />
            {/* Iconic Japanese Station Board (Shinjuku -> Shibuya) */}
            <rect x="220" y="35" width="360" height="85" rx="10" fill="#ffffff" stroke="#22c55e" strokeWidth="6" />
            <rect x="220" y="92" width="360" height="28" fill="#22c55e" rx="4" />
            <text x="350" y="72" fill="#0f172a" fontSize="28" fontWeight="bold">新宿</text>
            <text x="355" y="87" fill="#64748b" fontSize="13">Shinjuku</text>
            <text x="470" y="111" fill="#ffffff" fontSize="13" fontWeight="bold">渋谷 方面 →</text>
            <text x="240" y="111" fill="#ffffff" fontSize="13" fontWeight="bold">← 新大久保</text>
            {/* Yamanote Train Platform Line Car */}
            <rect x="80" y="160" width="640" height="150" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="4" />
            {/* Windows */}
            <rect x="110" y="180" width="120" height="75" rx="8" fill="#38bdf8" opacity="0.65" />
            <rect x="260" y="180" width="120" height="75" rx="8" fill="#38bdf8" opacity="0.65" />
            <rect x="410" y="180" width="120" height="75" rx="8" fill="#38bdf8" opacity="0.65" />
            <rect x="560" y="180" width="120" height="75" rx="8" fill="#38bdf8" opacity="0.65" />
            {/* Iconic Yamanote Line Lime Green Stripe */}
            <rect x="80" y="270" width="640" height="24" fill="#22c55e" />
            {/* Platform Floor with Tactile Braille warning tiles */}
            <rect x="0" y="330" width="800" height="120" fill="#64748b" />
            <rect x="0" y="330" width="800" height="14" fill="#eab308" />
            {/* Platform 14 Round Badge */}
            <circle cx="400" cy="215" r="28" fill="#ef4444" stroke="#ffffff" strokeWidth="4" />
            <text x="388" y="225" fill="#ffffff" fontSize="24" fontWeight="black">14</text>
          </svg>
        );

      case 'classroom':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgClassCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgClassCinema)" />
            {/* Big Green Blackboard */}
            <rect x="70" y="35" width="660" height="210" rx="14" fill="#14532d" stroke="#78350f" strokeWidth="10" />
            <text x="110" y="90" fill="#fef08a" fontSize="26" fontWeight="bold">宿題: 教科書 P.45〜46</text>
            <text x="110" y="140" fill="#ffffff" fontSize="22">締め切り: 来週の月曜日の朝に提出！</text>
            <text x="110" y="190" fill="#86efac" fontSize="20" fontWeight="semibold">漢字テストの復習も忘れないでください 📝</text>
            {/* Teacher's Podium and Student Desks */}
            <rect x="90" y="290" width="220" height="110" rx="10" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            <rect x="490" y="290" width="220" height="110" rx="10" fill="#d97706" stroke="#b45309" strokeWidth="4" />
            {/* Textbooks & Notebook on desk */}
            <rect x="130" y="305" width="70" height="45" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <line x1="145" y1="318" x2="185" y2="318" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="145" y1="330" x2="185" y2="330" stroke="#cbd5e1" strokeWidth="2" />
          </svg>
        );

      case 'clinic':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <rect width="800" height="450" fill="#f0fdfa" />
            <rect x="80" y="50" width="320" height="260" rx="16" fill="#ffffff" stroke="#0d9488" strokeWidth="4" />
            <rect x="210" y="75" width="60" height="20" fill="#ef4444" rx="4" />
            <rect x="230" y="55" width="20" height="60" fill="#ef4444" rx="4" />
            <text x="125" y="170" fill="#0f172a" fontSize="22" fontWeight="bold">処方箋 (Doctor's Note)</text>
            <text x="125" y="210" fill="#0d9488" fontSize="20" fontWeight="bold">毎食後 1錠ずつ服用</text>
            {/* Stethoscope */}
            <path d="M520,110 C520,220 660,220 660,110" fill="none" stroke="#334155" strokeWidth="10" />
            <circle cx="590" cy="280" r="35" fill="#94a3b8" stroke="#475569" strokeWidth="6" />
            <line x1="590" y1="215" x2="590" y2="245" stroke="#334155" strokeWidth="8" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <rect width="800" height="450" fill="#0f172a" />
            <circle cx="400" cy="200" r="80" fill="#6366f1" opacity="0.25" />
            <rect x="180" y="120" width="440" height="160" rx="16" fill="#1e293b" stroke="#334155" strokeWidth="3" />
            <text x="260" y="210" fill="#818cf8" fontSize="32" fontWeight="bold">日本語 会話シーン 🎧</text>
          </svg>
        );
    }
  };

  return (
    <div className={`space-y-4 ${isTheaterMode ? 'max-w-7xl mx-auto' : ''}`}>
      {/* ── UNIFIED YOUTUBE / THEATER VIDEO PLAYER CONTAINER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT 2 COLUMNS: CINEMA VIDEO SCREEN & INTEGRATED CONTROLS */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-black border border-border/80 shadow-2xl group">
            {/* Aspect Video Display (16:9 Cinema Ratio) */}
            <div
              onClick={onTogglePlay}
              className="relative aspect-video w-full cursor-pointer overflow-hidden bg-slate-950 flex items-center justify-center"
            >
              {/* Dynamic Theme Illustration Canvas */}
              {renderCinemaVisual(activeScene.sceneTheme)}

              {/* Dim vignette gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

              {/* Top Video Header Overlay */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between text-white drop-shadow-md pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-primary">
                    {scenario.level} • {scenario.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white/90">
                    🎬 Scene {activeSceneIndex + 1}/{scenario.storyboard.length}: {activeScene.title}
                  </span>
                </div>

                <div className="pointer-events-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTheaterMode((t) => !t);
                    }}
                    className="p-2 rounded-xl bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-all backdrop-blur-md"
                    title={isTheaterMode ? 'Exit theater mode' : 'Theater mode'}
                  >
                    {isTheaterMode ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Big Center Glass Play Button when Paused */}
              {!isPlaying && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 transform transition-transform group-hover:scale-110">
                    <Play className="w-9 h-9 ml-1 fill-current" />
                  </div>
                </div>
              )}

              {/* Live Character Subtitle Cinema Display (Inside the Video Frame) */}
              {activeLine && (
                <div className="absolute bottom-3 inset-x-4 z-20 pointer-events-none">
                  <div className="max-w-2xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-center shadow-2xl">
                    {/* Speaker badge & active audio soundwave */}
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/15 text-white text-[11px] font-black">
                        {activeLine.speaker}
                      </span>
                      {activeLine.voiceGender === 'female' ? (
                        <span className="text-[11px] text-pink-300 font-bold">♀</span>
                      ) : (
                        <span className="text-[11px] text-blue-300 font-bold">♂</span>
                      )}
                      {isPlaying && (
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="w-1 h-3 rounded-full bg-primary animate-pulse" />
                          <span className="w-1 h-4 rounded-full bg-primary animate-pulse delay-75" />
                          <span className="w-1 h-2 rounded-full bg-primary animate-pulse delay-150" />
                        </div>
                      )}
                    </div>

                    {/* Japanese Subtitle */}
                    <p className="text-lg sm:text-2xl font-black text-white tracking-wide drop-shadow-md">
                      {activeLine.text}
                    </p>

                    {/* Furigana Subtitle */}
                    {showFurigana && (
                      <p className="text-xs sm:text-sm font-semibold text-primary/95 mt-0.5">
                        {activeLine.hiragana}
                      </p>
                    )}

                    {/* English Translation Subtitle */}
                    {showEnglishSubtitle && (
                      <p className="text-xs sm:text-sm font-medium text-white/80 mt-1">
                        {activeLine.en}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── INTEGRATED YOUTUBE PLAYER CONTROLS BAR ── */}
            <div className="bg-slate-900 border-t border-white/10 p-3 sm:p-4 space-y-2.5 select-none">
              {/* Timeline Scrubber Bar with Scene Break Indicators */}
              <div className="relative w-full group/scrubber cursor-pointer">
                {/* Background Track */}
                <div className="h-1.5 group-hover/scrubber:h-2.5 w-full rounded-full bg-white/20 transition-all overflow-hidden relative">
                  {/* Progress Fill */}
                  <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Scene Chapter Markers on Scrubber */}
                <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-1">
                  {scenario.storyboard.map((sc, i) => (
                    <div
                      key={sc.id}
                      className={`w-2 h-2 rounded-full border border-black ${
                        i <= activeSceneIndex ? 'bg-primary' : 'bg-white/40'
                      }`}
                      title={`Scene ${i + 1}: ${sc.title}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Control Buttons Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="w-10 h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:scale-105 active:scale-95 transition-all shadow-md"
                    title={isPlaying ? 'Pause' : 'Play video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    )}
                  </button>

                  {/* Restart from beginning */}
                  <button
                    type="button"
                    onClick={onRestart}
                    className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Time Stamp (00:15 / 00:48) */}
                  <div className="text-xs font-mono font-bold text-white/80">
                    <span className="text-white">{formatSec(elapsedSec)}</span>
                    <span className="mx-1 text-white/40">/</span>
                    <span>{formatSec(totalDuration)}</span>
                  </div>

                  {/* Iconic JLPT Chime */}
                  <button
                    type="button"
                    onClick={onPlayChime}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white/90 transition-all"
                    title="Play iconic JLPT section start chime"
                  >
                    <BellRing className="w-3.5 h-3.5 text-primary" />
                    <span>JLPT Chime</span>
                  </button>
                </div>

                {/* Right Side Options: Speed, Subtitle toggles, Exam CTA */}
                <div className="flex items-center gap-2">
                  {/* Playback Speed selector */}
                  <div className="flex bg-white/10 rounded-lg p-0.5 text-xs font-bold">
                    {[0.75, 0.85, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onSetPlaybackRate(spd)}
                        className={`px-2 py-1 rounded-md transition-all ${
                          playbackRate === spd
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Furigana CC toggle */}
                  <button
                    type="button"
                    onClick={onToggleFurigana}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      showFurigana
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'border-white/20 text-white/60 hover:text-white'
                    }`}
                    title="Toggle Japanese furigana subtitles"
                  >
                    ふりがな
                  </button>

                  {/* English CC toggle */}
                  <button
                    type="button"
                    onClick={onToggleEnglish}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      showEnglishSubtitle
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'border-white/20 text-white/60 hover:text-white'
                    }`}
                    title="Toggle English subtitles"
                  >
                    EN
                  </button>

                  {/* Exam Quick Button */}
                  <button
                    type="button"
                    onClick={onOpenExam}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-black shadow-md hover:opacity-95 transition-all"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exam</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: YOUTUBE-STYLE INTERACTIVE TRANSCRIPT & CHAPTERS DRAWER */}
        <div className="rounded-3xl border border-border bg-card/95 backdrop-blur-md shadow-xl overflow-hidden flex flex-col h-[380px] sm:h-[440px] lg:h-[480px]">
          {/* Side Drawer Tabs */}
          <div className="p-3 bg-muted/40 border-b border-border/70 flex items-center justify-between">
            <div className="flex bg-muted/80 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveSideTab('transcript')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeSideTab === 'transcript'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                📜 Transcript
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab('scenes')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeSideTab === 'scenes'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🖼️ Scenes ({scenario.storyboard.length})
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground font-semibold">
              {activeSideTab === 'transcript'
                ? `Line ${currentLineIndex + 1}/${scenario.dialogue.length}`
                : `Scene ${activeSceneIndex + 1}/${scenario.storyboard.length}`}
            </span>
          </div>

          {/* Tab 1: Live Interactive Dialogue Transcript */}
          {activeSideTab === 'transcript' && (
            <div
              ref={transcriptListRef}
              className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin"
            >
              {scenario.dialogue.map((line, idx) => {
                const isCurrent = idx === currentLineIndex;

                return (
                  <div
                    key={line.id}
                    data-line-idx={idx}
                    onClick={() => onPlayLine(idx)}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-2.5 ${
                      isCurrent
                        ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-xs'
                        : 'bg-background/60 hover:bg-muted/40 border-border/60'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-muted text-foreground">
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {formatSec(line.timeOffsetSec)}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-extrabold text-foreground leading-snug">
                        {line.text}
                      </p>
                      {showFurigana && (
                        <p className="text-[11px] font-semibold text-primary/85">
                          {line.hiragana}
                        </p>
                      )}
                      {showEnglishSubtitle && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {line.en}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayLine(idx);
                      }}
                      className="p-1.5 rounded-lg bg-muted/60 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all shrink-0"
                      title="Listen to this line"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Scene Chapter Thumbnails */}
          {activeSideTab === 'scenes' && (
            <div className="p-3 overflow-y-auto space-y-3 flex-1">
              {scenario.storyboard.map((sc, i) => {
                const isCurrent = i === activeSceneIndex;

                return (
                  <div
                    key={sc.id}
                    onClick={() => onSelectScene(i)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-primary/10 border-primary shadow-xs ring-2 ring-primary/30'
                        : 'bg-background/60 hover:bg-muted/40 border-border/60'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-xl bg-slate-900 border border-border/80 overflow-hidden shrink-0 flex items-center justify-center text-primary font-black text-xs">
                      Scene {sc.order}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">{sc.title}</h4>
                      <p className="text-[11px] text-primary font-medium line-clamp-1">{sc.captionJa}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{sc.captionEn}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
