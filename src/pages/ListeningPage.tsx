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
      setCurrentLineIndex(0);
      return;
    }

    const line = activeScenario.dialogue[startIdx];
    setCurrentLineIndex(startIdx);
    setActiveSceneIndex(line.sceneIndex);

    speakJapaneseLine({
      text: line.text,
      rate: playbackRate,
      gender: line.voiceGender,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        if (startIdx + 1 < activeScenario.dialogue.length) {
          setTimeout(() => {
            playDialogueSequence(startIdx + 1);
          }, 800);
        } else {
          setIsPlaying(false);
          // Auto record completion of audio
          saveListeningProgress({
            scenarioId: activeScenario.id,
            durationSeconds: activeScenario.durationSeconds,
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
      playDialogueSequence(currentLineIndex);
    }
  };

  const handleRestartDialogue = () => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentLineIndex(0);
    setActiveSceneIndex(0);
    playDialogueSequence(0);
  };

  const handlePlayChime = () => {
    playJlptChime();
  };

  const handlePlaySingleLine = (idx: number) => {
    stopSpeaking();
    setCurrentLineIndex(idx);
    const line = activeScenario.dialogue[idx];
    if (line) {
      setActiveSceneIndex(line.sceneIndex);
      speakJapaneseLine({
        text: line.text,
        rate: playbackRate,
        gender: line.voiceGender,
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  const handleSelectScenario = (id: string) => {
    stopSpeaking();
    setIsPlaying(false);
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
          {/* Episode / Scenario Horizontal Carousel Picker */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Select Conversation Scenario
              </h2>
              <span className="text-xs text-muted-foreground font-semibold">
                {scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'} available
              </span>
            </div>

            {scenarios.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/60">
                <p className="text-sm font-bold text-foreground">
                  No audio scenarios found for {selectedLevel}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedLevel('N5')}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Switch to JLPT N5 Scenarios
                </button>
              </div>
            ) : (
              <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {scenarios.map((sc) => {
                  const isSelected = sc.id === selectedScenarioId;
                  const isDone = sc.userProgress && sc.userProgress.listenedCount > 0;

                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleSelectScenario(sc.id)}
                      className={`min-w-[260px] sm:min-w-[300px] p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/40'
                          : 'border-border/70 bg-card hover:bg-muted/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black">
                            {sc.level} • {sc.category}
                          </span>
                          {isDone && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-sm text-foreground mt-2 line-clamp-1">
                          {sc.titleJa}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{sc.titleEn}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>⏱️ {sc.durationSeconds}s</span>
                        <span>🎬 {sc.storyboard.length} Scenes</span>
                        <span>📝 {sc.examQuestions.length} Qs</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {activeScenario && (
            <>
              {/* ── UNIFIED YOUTUBE-STYLE CINEMA VIDEO PLAYER ── */}
              <section>
                <ListeningCinemaPlayer
                  scenario={activeScenario}
                  isPlaying={isPlaying}
                  currentLineIndex={currentLineIndex}
                  activeSceneIndex={activeSceneIndex}
                  playbackRate={playbackRate}
                  showFurigana={showFurigana}
                  showEnglishSubtitle={showEnglishSubtitle}
                  onTogglePlay={handleTogglePlay}
                  onRestart={handleRestartDialogue}
                  onPlayLine={handlePlaySingleLine}
                  onSelectScene={(i) => {
                    setActiveSceneIndex(i);
                    const lineIdx = activeScenario.dialogue.findIndex((d) => d.sceneIndex === i);
                    if (lineIdx !== -1) setCurrentLineIndex(lineIdx);
                  }}
                  onSetPlaybackRate={setPlaybackRate}
                  onToggleFurigana={() => setShowFurigana((v) => !v)}
                  onToggleEnglish={() => setShowEnglishSubtitle((v) => !v)}
                  onPlayChime={handlePlayChime}
                  onOpenExam={() => setIsExamModalOpen(true)}
                />
              </section>

              {/* Scenario Context & JLPT Exam Trigger Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-black text-xs">
                      {activeScenario.level}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {activeScenario.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-foreground mt-1">
                    {activeScenario.titleJa}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {activeScenario.descriptionJa} • {activeScenario.descriptionEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-black text-xs hover:shadow-lg transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Take JLPT Choukai Exam ({activeScenario.examQuestions.length} Questions)</span>
                </button>
              </div>

              {/* Down Container for Words / Hearing Check */}
              <section>
                <ListeningDownContainer
                  vocabulary={activeScenario.vocabulary}
                  onWordVerified={() => setVerifiedWordsCount((c) => c + 1)}
                />
              </section>
            </>
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
