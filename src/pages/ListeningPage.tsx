// src/pages/ListeningPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// JLPT Choukai & Listening Mastery Dojo
// Unified YouTube-Style Cinema Player + Interactive Transcripts & Down Container
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Headphones,
  CheckCircle2,
  ShieldCheck,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import {
  getListeningScenarios,
  saveListeningProgress,
  type ListeningScenario,
} from '../api/listening';
import { ListeningCinemaPlayer } from '../components/listening/ListeningCinemaPlayer';
import { ListeningDownContainer } from '../components/listening/ListeningDownContainer';
import { ChoukaiExamModal } from '../components/listening/ChoukaiExamModal';
import { playJlptChime, speakJapaneseLine, stopSpeaking } from '../utils/jlptAudio';
import { useStudyTracker } from '../hooks/useStudyTracker';
import SEO from '../components/common/SEO';
import { getStaticScenariosByLevel, STATIC_LISTENING_SCENARIOS } from '../data/listening/scenarios';

const JLPT_LEVELS = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const;

export default function ListeningPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const [scenarios, setScenarios] = useState<ListeningScenario[]>(() =>
    getStaticScenariosByLevel('N5')
  );
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('n5_convenience_store');

  // Audio Playback & Scene State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(0.85);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showEnglishSubtitle, setShowEnglishSubtitle] = useState(true);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);

  // Exam Modal State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [verifiedWordsCount, setVerifiedWordsCount] = useState(0);

  // Load scenarios on level change (instant static switch + async progress merge)
  useEffect(() => {
    let mounted = true;
    const initialList = getStaticScenariosByLevel(selectedLevel);
    setScenarios(initialList);

    if (initialList.length > 0 && !initialList.some((s) => s.id === selectedScenarioId)) {
      setSelectedScenarioId(initialList[0].id);
    }

    getListeningScenarios(selectedLevel)
      .then((data) => {
        if (!mounted || !data || data.length === 0) return;
        setScenarios(data);
        if (!data.some((s) => s.id === selectedScenarioId)) {
          setSelectedScenarioId(data[0].id);
        }
      })
      .catch((err) => {
        console.warn('[ListeningPage] Using offline static scenarios:', err);
      });

    return () => {
      mounted = false;
    };
  }, [selectedLevel]);

  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ||
    scenarios[0] ||
    STATIC_LISTENING_SCENARIOS[0];

  // Compute accurate scenario duration dynamically from the dialogue lines
  const totalDuration = React.useMemo(() => {
    if (!activeScenario?.dialogue || activeScenario.dialogue.length === 0) {
      return activeScenario?.durationSeconds || 26;
    }
    const last = activeScenario.dialogue[activeScenario.dialogue.length - 1];
    return Math.max(last.timeOffsetSec + (last.durationSec || 4), activeScenario.durationSeconds || 0);
  }, [activeScenario]);

  // Live timer tick during playback for smooth continuous scrubber progression
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTimeSec((curr) => {
        if (curr >= totalDuration) {
          return totalDuration;
        }
        return Math.min(totalDuration, Number((curr + 0.25).toFixed(2)));
      });
    }, 250);
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration]);

  // Anti-Idle Study Tracker Hook
  const { activeSeconds, formattedTime, isIdle, flush } = useStudyTracker({
    activityType: 'listening',
    level: activeScenario?.level || 'N5',
    itemId: activeScenario?.id || 'listening-default',
    enabled: true,
  });

  // Play line-by-line dialogue sequence
  const playDialogueSequence = (startIdx = 0) => {
    if (!activeScenario || !activeScenario.dialogue[startIdx]) {
      setIsPlaying(false);
      setCurrentTimeSec(totalDuration);
      setHasEnded(true);
      return;
    }

    setHasEnded(false);
    const line = activeScenario.dialogue[startIdx];
    setCurrentLineIndex(startIdx);
    setActiveSceneIndex(line.sceneIndex);
    setCurrentTimeSec(line.timeOffsetSec);

    speakJapaneseLine({
      text: line.text,
      rate: playbackRate,
      gender: line.voiceGender,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        if (startIdx + 1 < activeScenario.dialogue.length) {
          setTimeout(() => {
            playDialogueSequence(startIdx + 1);
          }, 600);
        } else {
          // Reached end of entire dialogue
          setIsPlaying(false);
          setCurrentTimeSec(totalDuration);
          setHasEnded(true);
          saveListeningProgress({
            scenarioId: activeScenario.id,
            durationSeconds: totalDuration,
            completed: true,
            wordsCheckedCount: verifiedWordsCount,
          }).catch(console.error);
        }
      },
      onError: () => setIsPlaying(false),
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      if (hasEnded || currentLineIndex >= activeScenario.dialogue.length - 1) {
        // Reached the end, restart smoothly from beginning
        setHasEnded(false);
        setCurrentTimeSec(0);
        setCurrentLineIndex(0);
        setActiveSceneIndex(0);
        playDialogueSequence(0);
      } else {
        playDialogueSequence(currentLineIndex);
      }
    }
  };

  const handleRestartDialogue = () => {
    stopSpeaking();
    setIsPlaying(false);
    setHasEnded(false);
    setCurrentTimeSec(0);
    setCurrentLineIndex(0);
    setActiveSceneIndex(0);
    playDialogueSequence(0);
  };

  const handlePlayChime = () => {
    playJlptChime();
  };

  const handlePlaySingleLine = (idx: number) => {
    stopSpeaking();
    setHasEnded(false);
    setCurrentLineIndex(idx);
    const line = activeScenario.dialogue[idx];
    if (line) {
      setActiveSceneIndex(line.sceneIndex);
      setCurrentTimeSec(line.timeOffsetSec);
      speakJapaneseLine({
        text: line.text,
        rate: playbackRate,
        gender: line.voiceGender,
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          if (idx === activeScenario.dialogue.length - 1) {
            setHasEnded(true);
            setCurrentTimeSec(totalDuration);
          }
        },
      });
    }
  };

  const handleSeekToTime = (targetSec: number) => {
    stopSpeaking();
    setHasEnded(false);
    setCurrentTimeSec(targetSec);

    let targetIdx = 0;
    for (let i = 0; i < activeScenario.dialogue.length; i++) {
      const line = activeScenario.dialogue[i];
      const nextLine = activeScenario.dialogue[i + 1];
      if (targetSec >= line.timeOffsetSec && (!nextLine || targetSec < nextLine.timeOffsetSec)) {
        targetIdx = i;
        break;
      }
    }

    handlePlaySingleLine(targetIdx);
  };

  const handleSelectScenario = (id: string) => {
    stopSpeaking();
    setIsPlaying(false);
    setHasEnded(false);
    setCurrentTimeSec(0);
    setCurrentLineIndex(0);
    setActiveSceneIndex(0);
    setSelectedScenarioId(id);
  };

  const handleCompleteExam = (score: number) => {
    saveListeningProgress({
      scenarioId: activeScenario.id,
      durationSeconds: Math.max(30, activeSeconds),
      completed: true,
      score,
      wordsCheckedCount: verifiedWordsCount,
    }).catch(console.error);

    // Also flush study tracker
    flush(true, score);
  };

  return (
    <>
      <SEO
        title="JLPT Listening (聴解) Practice & Choukai Exam Dojo | Kando Japanese"
        description="Master JLPT Choukai with unified cinema audio-visual dialogues, on-screen subtitles, vocabulary hearing checks, and authentic Choukai exam simulators."
        path="/listening"
      />

      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Top Header Banner - Non-sticky to avoid scroll overlap & clipping */}
        <header className="border-b border-border/60 bg-card/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/15 text-primary grid place-items-center shadow-xs">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
                  JLPT Listening Dojo
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                    聴解
                  </span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  Authentic dialogues, cinema-style synchronized visuals & Choukai exam simulators
                </p>
              </div>
            </div>

            {/* Verified Active Study Timer Widget */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all ${
                  !isIdle
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted border-border/60 text-muted-foreground'
                }`}
                title="Active time verified with anti-idle detection for your teacher"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <div className="text-right">
                  <span className="text-[10px] block font-bold uppercase tracking-wider">
                    {!isIdle ? 'Verified Study Time' : 'Study Paused (Idle)'}
                  </span>
                  <span className="text-sm font-black font-mono leading-none">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Tabs Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {JLPT_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : `JLPT ${lvl}`}
              </button>
            ))}
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
          {activeScenario ? (
            <>
              {/* ── 1. UNIFIED YOUTUBE-STYLE CINEMA VIDEO PLAYER (TOP PRIORITY) ── */}
              <section className="animate-in fade-in duration-300">
                <ListeningCinemaPlayer
                  scenario={activeScenario}
                  isPlaying={isPlaying}
                  currentLineIndex={currentLineIndex}
                  activeSceneIndex={activeSceneIndex}
                  playbackRate={playbackRate}
                  showFurigana={showFurigana}
                  showEnglishSubtitle={showEnglishSubtitle}
                  currentTimeSec={currentTimeSec}
                  totalDuration={totalDuration}
                  hasEnded={hasEnded}
                  onTogglePlay={handleTogglePlay}
                  onRestart={handleRestartDialogue}
                  onPlayLine={handlePlaySingleLine}
                  onSelectScene={(i) => {
                    setActiveSceneIndex(i);
                    const lineIdx = activeScenario.dialogue.findIndex((d) => d.sceneIndex === i);
                    if (lineIdx !== -1) handlePlaySingleLine(lineIdx);
                  }}
                  onSetPlaybackRate={setPlaybackRate}
                  onToggleFurigana={() => setShowFurigana((v) => !v)}
                  onToggleEnglish={() => setShowEnglishSubtitle((v) => !v)}
                  onPlayChime={handlePlayChime}
                  onOpenExam={() => setIsExamModalOpen(true)}
                  onSeekToTime={handleSeekToTime}
                />
              </section>

              {/* ── 2. SCENARIO SELECTOR STRIP (COMPACT HORIZONTAL EPISODE PILLS) ── */}
              <section className="bg-card/70 border border-border/80 rounded-2xl p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
                      Select Conversation Scenario
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                      {scenarios.length} Available
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
                    Click to switch scenario
                  </span>
                </div>

                <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {scenarios.map((sc) => {
                    const isSelected = sc.id === selectedScenarioId;
                    const isDone = sc.userProgress && sc.userProgress.listenedCount > 0;

                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectScenario(sc.id)}
                        className={`text-left shrink-0 min-w-[210px] max-w-[260px] p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-sm ring-2 ring-primary/40'
                            : 'border-border/70 bg-background/60 hover:bg-muted/50 hover:border-border'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-primary/20 text-primary">
                              {sc.level} • {sc.category}
                            </span>
                            {isDone && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-xs sm:text-sm text-foreground line-clamp-1">
                            {sc.titleJa}
                          </h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {sc.titleEn}
                          </p>
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                          <span>⏱️ {sc.durationSeconds}s</span>
                          <span>🎬 {sc.storyboard.length}</span>
                          <span>📝 {sc.examQuestions.length}Q</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* ── 3. SCENARIO CONTEXT & JLPT EXAM TRIGGER BAR ── */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs">
                <div className="min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-primary text-primary-foreground font-black text-xs">
                      {activeScenario.level}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {activeScenario.category}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-foreground mt-1">
                    {activeScenario.titleJa}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {activeScenario.descriptionJa} • {activeScenario.descriptionEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-black text-xs hover:shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>Take JLPT Choukai Exam ({activeScenario.examQuestions.length} Questions)</span>
                </button>
              </div>

              {/* ── 4. DOWN CONTAINER FOR WORDS / HEARING CHECK ── */}
              <section>
                <ListeningDownContainer
                  vocabulary={activeScenario.vocabulary}
                  onWordVerified={() => setVerifiedWordsCount((c) => c + 1)}
                />
              </section>
            </>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card/60">
              <p className="text-base font-bold text-foreground">
                No audio scenarios found for {selectedLevel}.
              </p>
              <button
                type="button"
                onClick={() => setSelectedLevel('N5')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95"
              >
                Switch to JLPT N5 Scenarios
              </button>
            </div>
          )}
        </main>

        {/* JLPT Choukai Exam Simulator Modal */}
        {activeScenario && (
          <ChoukaiExamModal
            isOpen={isExamModalOpen}
            onClose={() => setIsExamModalOpen(false)}
            level={activeScenario.level}
            scenarioTitle={activeScenario.titleJa}
            questions={activeScenario.examQuestions}
            onCompleteExam={handleCompleteExam}
          />
        )}
      </div>
    </>
  );
}
