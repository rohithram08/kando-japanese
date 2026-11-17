// src/pages/ListeningPage.tsx
// ─────────────────────────────────────────────────────────────────────────────
// JLPT Choukai & Listening Mastery Dojo
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  BellRing,
  Award,
  Sparkles,
  Headphones,
  CheckCircle2,
  Languages,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  getListeningScenarios,
  saveListeningProgress,
  type ListeningScenario,
  type DialogueLine,
} from '../api/listening';
import { StoryboardSceneCard } from '../components/listening/StoryboardSceneCard';
import { ListeningDownContainer } from '../components/listening/ListeningDownContainer';
import { ChoukaiExamModal } from '../components/listening/ChoukaiExamModal';
import { playJlptChime, speakJapaneseLine, stopSpeaking } from '../utils/jlptAudio';
import { useStudyTracker } from '../hooks/useStudyTracker';
import SEO from '../components/common/SEO';

const JLPT_LEVELS = ['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const;

export default function ListeningPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const [scenarios, setScenarios] = useState<ListeningScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('n5_convenience_store');
  const [loading, setLoading] = useState(true);

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

  // Load scenarios on level change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getListeningScenarios(selectedLevel)
      .then((data) => {
        if (!mounted) return;
        setScenarios(data);
        if (data.length > 0) {
          const match = data.find((s) => s.id === selectedScenarioId);
          if (!match) {
            setSelectedScenarioId(data[0].id);
          }
        }
      })
      .catch((err) => console.error('Failed to load listening scenarios:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedLevel]);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

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
        description="Master JLPT Choukai with authentic Japanese dialogue audios, storyboard illustrations, hearing verification word bank, and Choukai exam simulators."
        path="/listening"
      />

      <div className="min-h-screen bg-background text-foreground pb-20">
        {/* Top Header Banner */}
        <header className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-30">
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
                  Authentic dialogues, visual scenario storyboards & official Choukai simulators
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          {/* Scenario Selection Grid / Strip */}
          <section className="mb-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Select Conversation Scenario
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenarios.map((sc) => {
                const isSelected = sc.id === selectedScenarioId;
                const isDone = sc.userProgress && sc.userProgress.listenedCount > 0;

                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      stopSpeaking();
                      setIsPlaying(false);
                      setCurrentLineIndex(0);
                      setActiveSceneIndex(0);
                      setSelectedScenarioId(sc.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/40'
                        : 'border-border/70 bg-card hover:bg-muted/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black">
                        {sc.level} • {sc.category}
                      </span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-sm text-foreground mt-2">{sc.titleJa}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{sc.titleEn}</p>

                    <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>⏱️ {sc.durationSeconds}s</span>
                      <span>🖼️ {sc.storyboard.length} Scenes</span>
                      <span>📝 {sc.examQuestions.length} Questions</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {activeScenario && (
            <>
              {/* Active Scenario Title & Choukai Exam Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-md mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-primary text-primary-foreground font-black text-xs">
                      {activeScenario.level}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {activeScenario.category}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground mt-1">
                    {activeScenario.titleJa}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {activeScenario.descriptionJa} • {activeScenario.descriptionEn}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExamModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground font-black text-xs hover:shadow-lg transition-all"
                  >
                    <Award className="w-4 h-4" />
                    <span>Take JLPT Choukai Exam</span>
                  </button>
                </div>
              </div>

              {/* Visual Storyboard Carousel */}
              <section className="mb-6">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  Visual Scenario Storyboard (Dialogue Scene Progression)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeScenario.storyboard.map((scene, idx) => (
                    <StoryboardSceneCard
                      key={scene.id}
                      scene={scene}
                      isActive={activeSceneIndex === idx}
                      totalScenes={activeScenario.storyboard.length}
                      currentSceneIndex={activeSceneIndex}
                      onSelectScene={(i) => {
                        setActiveSceneIndex(i);
                        // Jump dialogue to this scene
                        const lineIdx = activeScenario.dialogue.findIndex(
                          (d) => d.sceneIndex === i
                        );
                        if (lineIdx !== -1) setCurrentLineIndex(lineIdx);
                      }}
                    />
                  ))}
                </div>
              </section>

              {/* Interactive Audio Player & Controls Bar */}
              <div className="p-4 rounded-2xl bg-card/95 border border-border shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Play / Pause Primary Button */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground grid place-items-center shadow-md hover:scale-105 active:scale-95 transition-all"
                    title={isPlaying ? 'Pause conversation' : 'Play full conversation'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>

                  {/* Restart Button */}
                  <button
                    type="button"
                    onClick={handleRestartDialogue}
                    className="p-2.5 rounded-xl border border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Iconic Chime Button */}
                  <button
                    type="button"
                    onClick={handlePlayChime}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-all"
                    title="Play iconic JLPT chime"
                  >
                    <BellRing className="w-4 h-4" />
                    <span className="hidden sm:inline">JLPT Chime</span>
                  </button>
                </div>

                {/* Subtitle & Speed Controls */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center bg-muted/60 p-1 rounded-xl text-xs font-bold">
                    {[0.75, 0.85, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackRate(spd)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          playbackRate === spd
                            ? 'bg-background text-foreground shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFurigana((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      showFurigana
                        ? 'bg-primary/15 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    ふりがな
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEnglishSubtitle((v) => !v)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      showEnglishSubtitle
                        ? 'bg-primary/15 border-primary/30 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Dialogue Transcript Stream */}
              <section className="mb-6 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
                <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground">
                    Live Dialogue Script & Subtitles
                  </h3>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Line {currentLineIndex + 1} of {activeScenario.dialogue.length}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {activeScenario.dialogue.map((line, idx) => {
                    const isCurrent = idx === currentLineIndex;

                    return (
                      <div
                        key={line.id}
                        onClick={() => handlePlaySingleLine(idx)}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 ${
                          isCurrent
                            ? 'bg-primary/10 border-primary shadow-xs ring-2 ring-primary/30'
                            : 'bg-background/60 hover:bg-muted/40 border-border/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-black text-foreground">
                              {line.speaker}
                            </span>
                            {line.voiceGender === 'female' ? (
                              <span className="text-[10px] text-pink-500 font-bold">♀ Female</span>
                            ) : (
                              <span className="text-[10px] text-blue-500 font-bold">♂ Male</span>
                            )}
                          </div>

                          {/* Japanese text with optional furigana reading */}
                          <p className="text-base font-extrabold text-foreground tracking-wide">
                            {line.text}
                          </p>
                          {showFurigana && (
                            <p className="text-xs font-semibold text-primary/80">
                              {line.hiragana}
                            </p>
                          )}
                          {showEnglishSubtitle && (
                            <p className="text-xs text-muted-foreground pt-0.5">
                              {line.en}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySingleLine(idx);
                          }}
                          className="p-2 rounded-xl bg-muted/70 hover:bg-primary/20 hover:text-primary transition-all shrink-0"
                          title="Listen to this line"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Down Container for Words / Hearing Check */}
              <ListeningDownContainer
                vocabulary={activeScenario.vocabulary}
                onWordVerified={() => setVerifiedWordsCount((c) => c + 1)}
              />
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
