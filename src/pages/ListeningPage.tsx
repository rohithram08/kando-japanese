// src/pages/ListeningPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// JLPT Choukai & Listening Mastery Dojo
// Unified YouTube-Style Cinema Player + Interactive Transcripts & Down Container
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from 'react';
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
  type ChoukaiQuestion,
} from '../api/listening';
import { ListeningCinemaPlayer } from '../components/listening/ListeningCinemaPlayer';
import { ListeningDownContainer } from '../components/listening/ListeningDownContainer';
import { ChoukaiExamModal } from '../components/listening/ChoukaiExamModal';
import { ListeningSessionEndModal } from '../components/listening/ListeningSessionEndModal';
import { playJlptChime, speakJapaneseLine, stopSpeaking } from '../utils/jlptAudio';
import { playSuccess, playError } from '../utils/soundEffects';
import { useStudyTracker } from '../hooks/useStudyTracker';
import { useStudyLevel } from '../hooks/useStudyLevel';
import { useProgressStore } from '../store/progressStore';
import SEO from '../components/common/SEO';
import { getStaticScenariosByLevel, STATIC_LISTENING_SCENARIOS } from '../data/listening/scenarios';

export default function ListeningPage() {
  const { studyLevel, unlocked } = useStudyLevel();
  const streak = useProgressStore((s) => s.streak || 0);
  const dailyXP = useProgressStore((s) => s.dailyXP || 0);

  // Available level tabs: strictly determined by user's unlocked levels
  // If user only unlocked N5: only show ['N5']
  // If user unlocked N5 + N4: show ['ALL', 'N5', 'N4']
  const availableTabs = useMemo(() => {
    return unlocked.length > 1 ? (['ALL', ...unlocked] as const) : unlocked;
  }, [unlocked]);

  const [selectedLevel, setSelectedLevel] = useState<string>(() => unlocked[0] || 'N5');

  // Clamp selectedLevel if user's study level changes
  useEffect(() => {
    if (selectedLevel !== 'ALL' && !unlocked.includes(selectedLevel as any)) {
      setSelectedLevel(unlocked[0] || 'N5');
    }
  }, [unlocked, selectedLevel]);

  const effectiveLevel =
    selectedLevel === 'ALL' && unlocked.length > 1
      ? 'ALL'
      : unlocked.includes(selectedLevel as any)
      ? selectedLevel
      : unlocked[0] || 'N5';

  const [scenarios, setScenarios] = useState<ListeningScenario[]>(() =>
    getStaticScenariosByLevel(effectiveLevel).filter((s) => unlocked.includes(s.level))
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

  // Duolingo Radio Checkpoint & Celebration State
  const [activeCheckpoint, setActiveCheckpoint] = useState<ChoukaiQuestion | null>(null);
  const [checkpointCompleted, setCheckpointCompleted] = useState(false);
  const [isSessionEndModalOpen, setIsSessionEndModalOpen] = useState(false);

  // Exam Modal State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [verifiedWordsCount, setVerifiedWordsCount] = useState(0);

  // Load scenarios on level change (instant static switch + async progress merge, strictly level-gated)
  useEffect(() => {
    let mounted = true;
    const initialList = getStaticScenariosByLevel(effectiveLevel).filter((s) =>
      unlocked.includes(s.level)
    );
    setScenarios(initialList);

    if (initialList.length > 0 && !initialList.some((s) => s.id === selectedScenarioId)) {
      setSelectedScenarioId(initialList[0].id);
    }

    getListeningScenarios(effectiveLevel)
      .then((data) => {
        if (!mounted || !data || data.length === 0) return;
        const levelFiltered = data.filter((s) => unlocked.includes(s.level));
        setScenarios(levelFiltered);
        if (!levelFiltered.some((s) => s.id === selectedScenarioId)) {
          setSelectedScenarioId(levelFiltered[0].id);
        }
      })
      .catch((err) => {
        console.warn('[ListeningPage] Using offline static scenarios:', err);
      });

    return () => {
      mounted = false;
    };
  }, [effectiveLevel, unlocked]);

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      if (!unlocked.includes(s.level)) return false;
      if (effectiveLevel === 'ALL') return true;
      return s.level === effectiveLevel;
    });
  }, [scenarios, unlocked, effectiveLevel]);

  const activeScenario =
    filteredScenarios.find((s) => s.id === selectedScenarioId) ||
    filteredScenarios[0] ||
    scenarios.find((s) => unlocked.includes(s.level)) ||
    scenarios[0] ||
    STATIC_LISTENING_SCENARIOS[0];

  // Compute accurate scenario duration dynamically from the dialogue lines
  const totalDuration = useMemo(() => {
    if (!activeScenario?.dialogue || activeScenario.dialogue.length === 0) {
      return activeScenario?.durationSeconds || 26;
    }
    const last = activeScenario.dialogue[activeScenario.dialogue.length - 1];
    return last.timeOffsetSec + (last.durationSec || 4);
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

  // Play line-by-line dialogue sequence with Duolingo checkpoint integration
  const playDialogueSequence = (startIdx = 0) => {
    if (!activeScenario || !activeScenario.dialogue[startIdx]) {
      setIsPlaying(false);
      setCurrentTimeSec(totalDuration);
      setHasEnded(true);
      setIsSessionEndModalOpen(true);
      return;
    }

    // Mid-dialogue comprehension checkpoint (Duolingo Radio mechanism)
    const checkpointLine = Math.floor(activeScenario.dialogue.length / 2);
    if (
      startIdx === checkpointLine &&
      !checkpointCompleted &&
      activeScenario.examQuestions &&
      activeScenario.examQuestions.length > 0
    ) {
      stopSpeaking();
      setIsPlaying(false);
      setActiveCheckpoint(activeScenario.examQuestions[0]);
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
          setIsSessionEndModalOpen(true);
          saveListeningProgress({
            scenarioId: activeScenario.id,
            durationSeconds: totalDuration,
            completed: true,
            wordsCheckedCount: verifiedWordsCount,
          }).catch(console.error);

          try {
            useProgressStore.getState().addXP(25, { reason: 'Listening Dialogue Completed' });
          } catch {}
        }
      },
      onError: () => {
        if (startIdx >= activeScenario.dialogue.length - 1) {
          setIsPlaying(false);
          setCurrentTimeSec(totalDuration);
          setHasEnded(true);
          setIsSessionEndModalOpen(true);
        } else {
          setIsPlaying(false);
        }
      },
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
        setCheckpointCompleted(false);
        setActiveCheckpoint(null);
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
    setCheckpointCompleted(false);
    setActiveCheckpoint(null);
    setIsSessionEndModalOpen(false);
    setCurrentTimeSec(0);
    setCurrentLineIndex(0);
    setActiveSceneIndex(0);
    playDialogueSequence(0);
  };

  const handlePlayChime = () => {
    playJlptChime();
  };

  const handleAnswerCheckpoint = (optionIndex: number) => {
    if (!activeCheckpoint) return;
    if (optionIndex === activeCheckpoint.correctIndex) {
      playSuccess();
      setCheckpointCompleted(true);
      setActiveCheckpoint(null);
      try {
        useProgressStore.getState().addXP(10, { reason: 'Checkpoint Question Correct' });
      } catch {}
      setTimeout(() => {
        playDialogueSequence(currentLineIndex + 1);
      }, 700);
    } else {
      playError();
    }
  };

  const handleSkipCheckpoint = () => {
    setCheckpointCompleted(true);
    setActiveCheckpoint(null);
    playDialogueSequence(currentLineIndex + 1);
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
    setCheckpointCompleted(false);
    setActiveCheckpoint(null);
    setIsSessionEndModalOpen(false);
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

      <div className="w-full max-w-full min-w-0 overflow-x-hidden space-y-4">
        {/* Compact Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/70 border border-border/70 rounded-2xl p-3 sm:px-4 shadow-2xs w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-foreground truncate">
                  JLPT Listening Dojo
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold shrink-0">
                  聴解
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate hidden sm:block">
                Authentic dialogues, synchronized visuals & Choukai exam simulators
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Strict Level Tabs: Only shows levels unlocked by user */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl">
              {availableTabs.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    effectiveLevel === lvl
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lvl === 'ALL' ? 'All Unlocked' : lvl}
                </button>
              ))}
            </div>

            {/* Verified Study Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold transition-all ${
                !isIdle
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-muted border-border/60 text-muted-foreground'
              }`}
              title="Active time verified with anti-idle detection for your teacher"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <div className="text-right leading-tight">
                <span className="text-[9px] block uppercase tracking-wider font-semibold opacity-80">
                  {!isIdle ? 'Verified' : 'Idle'}
                </span>
                <span className="text-xs font-black font-mono">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4 w-full min-w-0">
          {activeScenario ? (
            <>
              {/* ── 1. UNIFIED YOUTUBE-STYLE CINEMA VIDEO PLAYER (TOP PRIORITY) ── */}
              <section className="animate-in fade-in duration-300 w-full min-w-0 overflow-hidden">
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
                  activeCheckpoint={activeCheckpoint}
                  onAnswerCheckpoint={handleAnswerCheckpoint}
                  onSkipCheckpoint={handleSkipCheckpoint}
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
              <section className="bg-card/70 border border-border/80 rounded-2xl p-3.5 sm:p-4 shadow-xs w-full max-w-full min-w-0 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-foreground truncate">
                      Select Conversation Scenario
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold shrink-0">
                      {filteredScenarios.length} Available
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline shrink-0">
                    Click to switch scenario
                  </span>
                </div>

                <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1 scrollbar-thin w-full max-w-full min-w-0">
                  {filteredScenarios.map((sc) => {
                    const isSelected = sc.id === selectedScenarioId;
                    const isDone = sc.userProgress && sc.userProgress.listenedCount > 0;

                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => handleSelectScenario(sc.id)}
                        className={`text-left shrink-0 w-[220px] sm:w-[250px] p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
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
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs w-full min-w-0">
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
              <section className="w-full min-w-0">
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
                onClick={() => setSelectedLevel(unlocked[0] || 'N5')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-95"
              >
                Switch to {unlocked[0] || 'N5'} Scenarios
              </button>
            </div>
          )}
        </div>

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

        {/* Duolingo-Grade Session End XP Celebration Modal */}
        {activeScenario && (
          <ListeningSessionEndModal
            isOpen={isSessionEndModalOpen}
            scenario={activeScenario}
            baseXP={15}
            accuracyBonus={checkpointCompleted ? 10 : 5}
            currentStreak={streak || 1}
            dailyGoalCurrent={dailyXP || 25}
            dailyGoalTarget={50}
            onContinue={() => setIsSessionEndModalOpen(false)}
            onReplay={() => {
              setIsSessionEndModalOpen(false);
              handleRestartDialogue();
            }}
            onOpenExam={() => {
              setIsSessionEndModalOpen(false);
              setIsExamModalOpen(true);
            }}
          />
        )}
      </div>
    </>
  );
}
