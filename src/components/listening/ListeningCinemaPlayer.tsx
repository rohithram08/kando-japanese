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
  ChevronDown,
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
  currentTimeSec?: number;
  totalDuration?: number;
  hasEnded?: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  onPlayLine: (lineIdx: number) => void;
  onSelectScene: (sceneIdx: number) => void;
  onSetPlaybackRate: (rate: number) => void;
  onToggleFurigana: () => void;
  onToggleEnglish: () => void;
  onPlayChime: () => void;
  onOpenExam: () => void;
  onSeekToTime?: (timeSec: number) => void;
}

export const ListeningCinemaPlayer: React.FC<ListeningCinemaPlayerProps> = ({
  scenario,
  isPlaying,
  currentLineIndex,
  activeSceneIndex,
  playbackRate,
  showFurigana,
  showEnglishSubtitle,
  currentTimeSec,
  totalDuration: propTotalDuration,
  hasEnded = false,
  onTogglePlay,
  onRestart,
  onPlayLine,
  onSelectScene,
  onSetPlaybackRate,
  onToggleFurigana,
  onToggleEnglish,
  onPlayChime,
  onOpenExam,
  onSeekToTime,
}) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'transcript' | 'scenes'>('transcript');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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

  // Calculate dynamic scenario duration from dialogue timestamps
  const totalDuration = React.useMemo(() => {
    if (propTotalDuration && propTotalDuration > 0) return propTotalDuration;
    if (!scenario.dialogue || scenario.dialogue.length === 0) return scenario.durationSeconds || 26;
    const last = scenario.dialogue[scenario.dialogue.length - 1];
    return Math.max(last.timeOffsetSec + (last.durationSec || 4), scenario.durationSeconds || 0);
  }, [scenario, propTotalDuration]);

  // Elapsed seconds: continuous live timer or active line time, clamped to 100% on hasEnded
  const elapsedSec = hasEnded
    ? totalDuration
    : typeof currentTimeSec === 'number'
    ? currentTimeSec
    : activeLine
    ? activeLine.timeOffsetSec
    : 0;

  const progressPct = Math.min(100, Math.max(0, (elapsedSec / totalDuration) * 100));

  const formatSec = (sec: number) => {
    const rounded = Math.round(sec);
    const m = Math.floor(rounded / 60);
    const s = Math.floor(rounded % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Interactive scrubber seeking
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = Math.round(ratio * totalDuration);

    if (onSeekToTime) {
      onSeekToTime(targetSec);
    } else {
      // Find matching line
      let foundIdx = 0;
      for (let i = 0; i < scenario.dialogue.length; i++) {
        const line = scenario.dialogue[i];
        const nextLine = scenario.dialogue[i + 1];
        if (targetSec >= line.timeOffsetSec && (!nextLine || targetSec < nextLine.timeOffsetSec)) {
          foundIdx = i;
          break;
        }
      }
      onPlayLine(foundIdx);
    }
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
      case 'hospital':
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

      case 'restaurant':
      case 'kitchen':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgRestCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgRestCinema)" />
            {/* Wooden Wall Panels */}
            <rect x="50" y="30" width="700" height="180" rx="12" fill="#78350f" stroke="#92400e" strokeWidth="4" />
            {/* Red Lanterns (提灯) */}
            <circle cx="150" cy="70" r="32" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
            <rect x="135" y="45" width="30" height="6" fill="#18181b" rx="2" />
            <rect x="135" y="89" width="30" height="6" fill="#18181b" rx="2" />
            <text x="132" y="76" fill="#ffffff" fontSize="15" fontWeight="bold">居酒屋</text>
            <circle cx="650" cy="70" r="32" fill="#ef4444" stroke="#991b1b" strokeWidth="3" />
            <rect x="635" y="45" width="30" height="6" fill="#18181b" rx="2" />
            <rect x="635" y="89" width="30" height="6" fill="#18181b" rx="2" />
            <text x="636" y="76" fill="#ffffff" fontSize="15" fontWeight="bold">定食</text>
            {/* Wooden Menu Tags hanging on wall */}
            <rect x="230" y="55" width="45" height="110" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <text x="252" y="85" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">ラーメン</text>
            <text x="252" y="145" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">¥850</text>
            <rect x="300" y="55" width="45" height="110" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <text x="322" y="85" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">餃子定食</text>
            <text x="322" y="145" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">¥780</text>
            <rect x="370" y="55" width="45" height="110" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <text x="392" y="85" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">生ビール</text>
            <text x="392" y="145" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">¥500</text>
            <rect x="440" y="55" width="45" height="110" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <text x="462" y="85" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">緑茶・水</text>
            <text x="462" y="145" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">無料</text>
            <rect x="510" y="55" width="45" height="110" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <text x="532" y="85" fill="#78350f" fontSize="12" fontWeight="black" textAnchor="middle">日替わり</text>
            <text x="532" y="145" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">¥900</text>
            {/* Dining Table Counter */}
            <rect x="40" y="240" width="720" height="180" rx="16" fill="#b45309" stroke="#78350f" strokeWidth="6" />
            {/* Ramen Bowl */}
            <ellipse cx="260" cy="330" rx="65" ry="35" fill="#dc2626" stroke="#991b1b" strokeWidth="4" />
            <ellipse cx="260" cy="325" rx="55" ry="25" fill="#fef08a" />
            {/* Chopsticks and rest */}
            <line x1="200" y1="380" x2="330" y2="380" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
            <rect x="250" y="375" width="20" height="10" rx="3" fill="#cbd5e1" />
            {/* Water glass */}
            <rect x="400" y="280" width="45" height="65" rx="6" fill="#67e8f9" opacity="0.8" stroke="#0891b2" strokeWidth="2" />
            {/* Order Call Bell Button */}
            <circle cx="560" cy="330" r="28" fill="#e2e8f0" stroke="#64748b" strokeWidth="4" />
            <circle cx="560" cy="326" r="14" fill="#ef4444" />
            <text x="500" y="380" fill="#ffffff" fontSize="12" fontWeight="bold">ご注文ボタン 🔔</text>
          </svg>
        );

      case 'office':
      case 'boardroom':
      case 'meeting_room':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgOfficeCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgOfficeCinema)" />
            {/* Skyline Window */}
            <rect x="80" y="30" width="280" height="180" rx="8" fill="#0284c7" opacity="0.25" stroke="#334155" strokeWidth="3" />
            {/* Tokyo Tower silhouette */}
            <polygon points="220,170 215,90 225,90" fill="#f43f5e" opacity="0.8" />
            {/* Whiteboard with Project Gantt Chart */}
            <rect x="400" y="30" width="330" height="180" rx="10" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" />
            <text x="420" y="60" fill="#0f172a" fontSize="15" fontWeight="black">プロジェクト進捗状況 (Weekly Review)</text>
            <rect x="420" y="75" width="200" height="14" rx="4" fill="#3b82f6" />
            <rect x="420" y="100" width="270" height="14" rx="4" fill="#10b981" />
            <rect x="420" y="125" width="140" height="14" rx="4" fill="#f59e0b" />
            <text x="420" y="165" fill="#64748b" fontSize="11" fontWeight="bold">次回ミーティング: 来週火曜 14:00〜</text>
            {/* Conference Table */}
            <rect x="50" y="240" width="700" height="180" rx="20" fill="#334155" stroke="#475569" strokeWidth="4" />
            {/* Laptop */}
            <rect x="320" y="270" width="160" height="95" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
            <rect x="330" y="280" width="140" height="75" rx="4" fill="#1e293b" />
            <circle cx="400" cy="315" r="14" fill="#38bdf8" opacity="0.6" />
            {/* Notepad and Pen */}
            <rect x="150" y="280" width="80" height="100" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="165" y1="300" x2="215" y2="300" stroke="#94a3b8" strokeWidth="2" />
            <line x1="165" y1="315" x2="215" y2="315" stroke="#94a3b8" strokeWidth="2" />
            {/* Coffee Cup */}
            <circle cx="580" cy="320" r="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="580" cy="320" r="18" fill="#78350f" />
          </svg>
        );

      case 'hotel':
      case 'agency':
      case 'counter':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgHotelCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c1917" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgHotelCinema)" />
            {/* Warm Japanese Wooden Screen Lattice */}
            <rect x="60" y="30" width="680" height="190" rx="12" fill="#44403c" stroke="#78716c" strokeWidth="4" />
            <text x="400" y="80" fill="#fef08a" fontSize="24" fontWeight="black" letterSpacing="4" textAnchor="middle">フロント (FRONT)</text>
            <text x="400" y="115" fill="#e7e5e4" fontSize="13" textAnchor="middle">チェックイン / チェックアウト</text>
            {/* Traditional Japanese Bonsai Tree */}
            <rect x="120" y="145" width="60" height="25" rx="4" fill="#78350f" />
            <ellipse cx="150" cy="130" rx="35" ry="25" fill="#15803d" />
            {/* Hotel Front Counter */}
            <rect x="50" y="235" width="700" height="190" rx="16" fill="#78350f" stroke="#b45309" strokeWidth="6" />
            {/* Brass Bell */}
            <ellipse cx="400" cy="320" rx="30" ry="20" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
            <circle cx="400" cy="300" r="6" fill="#78350f" />
            <text x="400" y="360" fill="#fef3c7" fontSize="11" fontWeight="bold" textAnchor="middle">ご用の方はこちら 🛎️</text>
            {/* Room Key with Wooden Tag */}
            <rect x="540" y="300" width="80" height="35" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <text x="580" y="323" fill="#451a03" fontSize="13" fontWeight="black" textAnchor="middle">Room 502</text>
          </svg>
        );

      case 'supermarket':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgSuperCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="100%" stopColor="#dcfce7" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgSuperCinema)" />
            {/* Supermarket Banners */}
            <rect x="80" y="30" width="640" height="60" rx="10" fill="#16a34a" />
            <text x="400" y="68" fill="#ffffff" fontSize="22" fontWeight="black" letterSpacing="2" textAnchor="middle">フレッシュスーパー 🍎</text>
            {/* Vegetable & Fruit Shelves */}
            <rect x="60" y="110" width="310" height="140" rx="10" fill="#ffffff" stroke="#86efac" strokeWidth="3" />
            <text x="80" y="140" fill="#15803d" fontSize="16" fontWeight="bold">新鮮野菜・果物 コーナー</text>
            <circle cx="110" cy="180" r="18" fill="#ef4444" />
            <circle cx="150" cy="180" r="18" fill="#ef4444" />
            <rect x="190" y="165" width="40" height="30" rx="6" fill="#22c55e" />
            <circle cx="310" cy="150" r="24" fill="#dc2626" />
            <text x="310" y="155" fill="#ffffff" fontSize="11" fontWeight="black" textAnchor="middle">30%引</text>
            {/* Bento & Meat Shelf */}
            <rect x="420" y="110" width="310" height="140" rx="10" fill="#ffffff" stroke="#fca5a5" strokeWidth="3" />
            <text x="440" y="140" fill="#b91c1c" fontSize="16" fontWeight="bold">お惣菜・タイムセール 🍱</text>
            <rect x="445" y="165" width="70" height="35" rx="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            {/* Checkout Counter */}
            <rect x="50" y="270" width="700" height="160" rx="16" fill="#ffffff" stroke="#94a3b8" strokeWidth="4" />
            <rect x="100" y="300" width="160" height="90" rx="8" fill="#0284c7" />
            <text x="180" y="340" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">バーコード決済</text>
            <text x="180" y="365" fill="#ffffff" fontSize="12" textAnchor="middle">PayPay / 交通系IC</text>
          </svg>
        );

      case 'post_office':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <rect width="800" height="450" fill="#fef2f2" />
            <rect x="80" y="30" width="640" height="70" rx="12" fill="#dc2626" />
            <text x="400" y="75" fill="#ffffff" fontSize="26" fontWeight="black" textAnchor="middle">〒 郵便局 (POST)</text>
            <rect x="70" y="120" width="660" height="130" rx="12" fill="#ffffff" stroke="#f87171" strokeWidth="3" />
            <text x="100" y="160" fill="#991b1b" fontSize="18" fontWeight="bold">郵便窓口・ゆうパック (Yu-Pack Delivery)</text>
            <text x="100" y="195" fill="#475569" fontSize="13">切手・はがき販売 / 国内・国際小包受付</text>
            <rect x="60" y="270" width="680" height="160" rx="16" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="4" />
            <rect x="120" y="310" width="120" height="60" rx="8" fill="#334155" />
            <rect x="135" y="325" width="90" height="30" rx="4" fill="#22c55e" />
            <text x="180" y="346" fill="#0f172a" fontSize="14" fontWeight="black" textAnchor="middle">480 g</text>
            <rect x="300" y="300" width="130" height="90" rx="8" fill="#d97706" stroke="#b45309" strokeWidth="3" />
            <text x="365" y="350" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">〒 ゆうパック</text>
          </svg>
        );

      case 'street':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgStreetCinema" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#e0f2fe" />
                <stop offset="60%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgStreetCinema)" />
            <rect x="60" y="100" width="120" height="170" fill="#94a3b8" />
            <rect x="200" y="60" width="140" height="210" fill="#64748b" />
            <rect x="520" y="90" width="130" height="180" fill="#94a3b8" />
            <rect x="180" y="330" width="70" height="90" fill="#ffffff" />
            <rect x="290" y="330" width="70" height="90" fill="#ffffff" />
            <rect x="400" y="330" width="70" height="90" fill="#ffffff" />
            <rect x="510" y="330" width="70" height="90" fill="#ffffff" />
            <rect x="350" y="70" width="160" height="90" rx="8" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" />
            <text x="430" y="105" fill="#ffffff" fontSize="16" fontWeight="black" textAnchor="middle">← 駅前通り</text>
            <text x="430" y="135" fill="#fef08a" fontSize="13" fontWeight="bold" textAnchor="middle">市役所 →</text>
          </svg>
        );

      case 'phone':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgPhoneCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgPhoneCinema)" />
            <rect x="260" y="30" width="280" height="390" rx="36" fill="#020617" stroke="#475569" strokeWidth="6" />
            <circle cx="400" cy="140" r="42" fill="#3b82f6" opacity="0.3" />
            <circle cx="400" cy="140" r="32" fill="#60a5fa" />
            <text x="400" y="152" fill="#ffffff" fontSize="30" textAnchor="middle">📞</text>
            <text x="400" y="215" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">電話での問い合わせ</text>
            <text x="400" y="240" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">通話中 (In Call)</text>
            <circle cx="400" cy="365" r="24" fill="#ef4444" />
            <text x="400" y="373" fill="#ffffff" fontSize="18" textAnchor="middle">📵</text>
          </svg>
        );

      case 'interview':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgInterCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgInterCinema)" />
            <rect x="80" y="30" width="640" height="150" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="4" />
            <circle cx="400" cy="80" r="28" fill="#38bdf8" opacity="0.3" stroke="#38bdf8" strokeWidth="2" />
            <text x="400" y="130" fill="#ffffff" fontSize="18" fontWeight="black" letterSpacing="3" textAnchor="middle">採用面接室 (Interview)</text>
            <text x="400" y="155" fill="#94a3b8" fontSize="12" textAnchor="middle">履歴書・志望動機のご確認</text>
            <rect x="60" y="220" width="680" height="190" rx="16" fill="#334155" stroke="#475569" strokeWidth="4" />
            <rect x="180" y="260" width="110" height="130" rx="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            <text x="235" y="295" fill="#0f172a" fontSize="14" fontWeight="bold" textAnchor="middle">履歴書</text>
            <rect x="470" y="280" width="170" height="70" rx="10" fill="#0284c7" />
            <text x="555" y="310" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">自己PR / 経験質問</text>
            <text x="555" y="335" fill="#ffffff" fontSize="11" textAnchor="middle">丁寧な敬語表現 (Keigo)</text>
          </svg>
        );

      case 'symposium':
      case 'lecture_hall':
      case 'conference':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover select-none" aria-hidden="true">
            <defs>
              <linearGradient id="bgSympCinema" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill="url(#bgSympCinema)" />
            <rect x="160" y="25" width="480" height="230" rx="12" fill="#ffffff" stroke="#38bdf8" strokeWidth="4" />
            <rect x="180" y="45" width="440" height="40" rx="6" fill="#0284c7" />
            <text x="400" y="72" fill="#ffffff" fontSize="18" fontWeight="black" textAnchor="middle">国際シンポジウム 基調講演</text>
            <text x="200" y="125" fill="#0f172a" fontSize="16" fontWeight="black">持続可能な社会基盤への移行</text>
            <text x="200" y="155" fill="#334155" fontSize="13">• 産業構造改革とイノベーションの促進</text>
            <text x="200" y="180" fill="#334155" fontSize="13">• 資源循環型経済 (Circular Economy) の確立</text>
            <rect x="80" y="280" width="140" height="150" rx="10" fill="#475569" stroke="#334155" strokeWidth="4" />
            <path d="M150,280 Q160,240 180,230" fill="none" stroke="#94a3b8" strokeWidth="5" />
            <circle cx="180" cy="230" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        {/* LEFT 2 COLUMNS ON XL: CINEMA VIDEO SCREEN & INTEGRATED CONTROLS */}
        <div className="xl:col-span-2 space-y-3 min-w-0">
          <div className="relative rounded-3xl overflow-hidden bg-black border border-border/80 shadow-2xl group">
            {/* Aspect Video Display (16:9 Cinema Ratio with Max-Height Viewport Fit) */}
            <div
              onClick={onTogglePlay}
              className="relative aspect-video w-full max-h-[280px] sm:max-h-[320px] xl:max-h-[360px] cursor-pointer overflow-hidden bg-slate-950 flex items-center justify-center"
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

              {/* Finished / Completion Screen Overlay */}
              {hasEnded ? (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                  <div className="text-center p-6 rounded-3xl bg-slate-900/95 border border-primary/40 shadow-2xl max-w-sm sm:max-w-md mx-auto space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary mx-auto grid place-items-center">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">会話が完了しました！</h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Dialogue completed! Test your understanding with the official JLPT Choukai Exam.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestart();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Replay Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenExam();
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <Award className="w-4 h-4" />
                        <span>Take Choukai Exam</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : !isPlaying ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 transform transition-transform group-hover:scale-110">
                    <Play className="w-9 h-9 ml-1 fill-current" />
                  </div>
                </div>
              ) : null}

              {/* Live Character Subtitle Cinema Display (Inside the Video Frame) */}
              {activeLine && (
                <div className="absolute bottom-2 inset-x-2 sm:inset-x-3 z-20 pointer-events-none">
                  <div className="max-w-xl mx-auto px-3 py-2 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-center shadow-2xl">
                    {/* Speaker badge & active audio soundwave */}
                    <div className="flex items-center justify-center gap-1.5 mb-0.5">
                      <span className="px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-black bg-white/20 text-white">
                        {activeLine.speaker}
                      </span>
                      {activeLine.voiceGender === 'female' ? (
                        <span className="text-[10px] text-pink-300 font-bold">♀</span>
                      ) : (
                        <span className="text-[10px] text-blue-300 font-bold">♂</span>
                      )}
                      {isPlaying && (
                        <div className="flex items-center gap-0.5 ml-1">
                          <span className="w-1 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="w-1 h-3 rounded-full bg-primary animate-pulse delay-75" />
                          <span className="w-1 h-2 rounded-full bg-primary animate-pulse delay-150" />
                        </div>
                      )}
                    </div>

                    {/* Japanese Subtitle */}
                    <p className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide drop-shadow-md leading-tight">
                      {activeLine.text}
                    </p>

                    {/* Furigana Subtitle */}
                    {showFurigana && (
                      <p className="text-[10px] sm:text-[11px] font-semibold text-primary/95 mt-0.5 leading-tight">
                        {activeLine.hiragana}
                      </p>
                    )}

                    {/* English Translation Subtitle */}
                    {showEnglishSubtitle && (
                      <p className="text-[9.5px] sm:text-[10.5px] font-medium text-white/80 mt-0.5 leading-tight">
                        {activeLine.en}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── INTEGRATED YOUTUBE PLAYER CONTROLS BAR ── */}
            <div className="bg-slate-900 border-t border-white/10 p-2.5 sm:p-3 space-y-2 select-none">
              {/* Timeline Scrubber Bar with Scene Break Indicators */}
              <div
                onClick={handleScrubberClick}
                className="relative w-full group/scrubber cursor-pointer py-1"
                title="Click anywhere to jump to that moment"
              >
                {/* Background Track */}
                <div className="h-1.5 group-hover/scrubber:h-2 w-full rounded-full bg-white/20 transition-all overflow-hidden relative">
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
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-white">
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  {/* Play / Pause / Replay Toggle */}
                  <button
                    type="button"
                    onClick={onTogglePlay}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
                    title={hasEnded ? 'Replay conversation' : isPlaying ? 'Pause' : 'Play video'}
                  >
                    {hasEnded ? (
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5 fill-current" />
                    )}
                  </button>

                  {/* Restart from beginning */}
                  <button
                    type="button"
                    onClick={onRestart}
                    className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all shrink-0"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Time Stamp (e.g. 00:15 / 00:26) */}
                  <div className="text-[11px] sm:text-xs font-mono font-bold text-white/80 shrink-0">
                    <span className="text-white">{formatSec(elapsedSec)}</span>
                    <span className="mx-1 text-white/40">/</span>
                    <span>{formatSec(totalDuration)}</span>
                  </div>

                  {/* Iconic JLPT Chime */}
                  <button
                    type="button"
                    onClick={onPlayChime}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white/90 transition-all shrink-0"
                    title="Play iconic JLPT section start chime"
                  >
                    <BellRing className="w-3.5 h-3.5 text-primary" />
                    <span>JLPT Chime</span>
                  </button>
                </div>

                {/* Right Side Options: Speed, Subtitle toggles, Exam CTA */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* Playback Speed selector */}
                  <div className="flex bg-white/10 rounded-lg p-0.5 text-xs font-bold shrink-0">
                    {[0.75, 0.85, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => onSetPlaybackRate(spd)}
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs transition-all ${
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
                    className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all border shrink-0 ${
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
                    className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all border shrink-0 ${
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
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-black shadow-md hover:opacity-95 transition-all shrink-0"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Exam</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile / Tablet Transcript / Scenes Accordion Bar */}
          <div className="xl:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-card border border-border/80 shadow-xs hover:bg-muted/40 transition-all text-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-black">
                  {activeSideTab === 'transcript' ? '📜 Dialogue Transcript' : '🖼️ Storyboard Scenes'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                  {activeSideTab === 'transcript'
                    ? `Line ${currentLineIndex + 1}/${scenario.dialogue.length}`
                    : `Scene ${activeSceneIndex + 1}/${scenario.storyboard.length}`}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                <span>{isMobileDrawerOpen ? 'Collapse' : 'Expand Transcript'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileDrawerOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* RIGHT 1 COLUMN ON XL: YOUTUBE-STYLE INTERACTIVE TRANSCRIPT & CHAPTERS DRAWER */}
        <div
          className={`${
            isMobileDrawerOpen ? 'flex' : 'hidden'
          } xl:flex rounded-3xl border border-border bg-card/95 backdrop-blur-md shadow-xl overflow-hidden flex-col h-[340px] xl:h-[415px] animate-in fade-in duration-200 min-w-0`}
        >
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
