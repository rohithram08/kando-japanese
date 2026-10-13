import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  MessageCircle,
  Volume2,
  VolumeX,
  Send,
  Square,
  BookOpen,
  RefreshCw,
  Award,
  Flame,
  Zap,
  Play,
  Compass,
  ArrowRight,
  Maximize2,
  Wrench,
  Camera,
  RotateCcw,
  Volume1,
  HelpCircle,
  Smile
} from 'lucide-react';

import SenseiCharacter from '../components/sensei/SenseiCharacter';
import { audioService } from '../services/audioService';
import { useSenseiStore } from '../store/senseiStore';
import { useSenseiDailyGuidance } from '../hooks/useSenseiDailyGuidance';
import { SenseiAnimationState } from '../components/sensei/controllers/SenseiAnimationController';
import { SenseiEmotion } from '../components/sensei/controllers/SenseiExpressionController';

const ANIMATION_CLIPS: { key: SenseiAnimationState; label: string; icon: string }[] = [
  { key: 'idle', label: 'Idle', icon: '🌸' },
  { key: 'greeting', label: 'Greeting (Bow)', icon: '🙇‍♀️' },
  { key: 'waving', label: 'Waving', icon: '👋' },
  { key: 'talking', label: 'Talking', icon: '💬' },
  { key: 'thinking', label: 'Thinking', icon: '🤔' },
  { key: 'happy', label: 'Happy', icon: '😊' },
  { key: 'encouraging', label: 'Encouraging', icon: '✊' },
  { key: 'celebrating', label: 'Celebrating', icon: '🎉' },
  { key: 'teaching', label: 'Teaching', icon: '📖' },
  { key: 'pointing', label: 'Pointing', icon: '👉' },
  { key: 'listening', label: 'Listening', icon: '👂' },
  { key: 'confused', label: 'Confused', icon: '❓' },
  { key: 'error', label: 'Error', icon: '⚠️' },
  { key: 'sleeping', label: 'Sleeping', icon: '💤' },
];

const EMOTION_PRESETS: { key: SenseiEmotion; label: string; icon: string }[] = [
  { key: 'neutral', label: 'Neutral', icon: '🌸' },
  { key: 'happy', label: 'Happy', icon: '😊' },
  { key: 'encouraging', label: 'Encouraging', icon: '✨' },
  { key: 'celebrating', label: 'Celebrating', icon: '🎉' },
  { key: 'thinking', label: 'Thinking', icon: '🤔' },
  { key: 'listening', label: 'Listening', icon: '👂' },
  { key: 'surprised', label: 'Surprised', icon: '😲' },
  { key: 'confused', label: 'Confused', icon: '❓' },
  { key: 'sad', label: 'Sad', icon: '🥺' },
  { key: 'error', label: 'Error/Stern', icon: '😠' },
  { key: 'sleepy', label: 'Sleepy', icon: '😴' },
];

const QUICK_PROMPTS = [
  "Teach me the difference between は and が",
  "How do I remember Kanji stroke orders?",
  "What is my study recommendation today?",
  "Can we practice polite Japanese greetings?",
  "Explain Spaced Repetition for vocab"
];

export default function SenseiPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { guidance } = useSenseiDailyGuidance();

  const {
    messages,
    isTyping,
    speechEnabled,
    toggleSpeech,
    speechState,
    stopSpeech,
    sendMessage,
    executeAction,
    animationState,
    setAnimationState,
    emotion,
    startTour,
    greet,
    triggerCelebration,
    fetchHistory,
    targetDirection,
    qaMode,
    toggleQaMode,
    setQaMode,
    cameraMode,
    toggleCameraMode
  } = useSenseiStore();

  const [input, setInput] = useState('');
  const [qaTab, setQaTab] = useState<'clips' | 'emotions'>('clips');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-enable QA mode if ?dev=true or ?qa=true is present
  useEffect(() => {
    (window as any).__senseiStore = useSenseiStore;
    if (searchParams.get('dev') === 'true' || searchParams.get('qa') === 'true') {
      setQaMode(true);
    }
  }, [searchParams, setQaMode]);

  useEffect(() => {
    if (messages.length === 0) {
      fetchHistory();
    }
  }, [messages.length, fetchHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const res = await sendMessage(text);
    if (res?.action) {
      executeAction(res.action, navigate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input.trim();
    setInput('');
    handleSend(msg);
  };

  const handleReplayAudio = (content: string) => {
    if (!content) return;
    const isJapanese = /[一-龠ぁ-ゔァ-ヴー]/.test(content);
    useSenseiStore.getState().stopSpeech();
    audioService.speak(content, {
      lang: isJapanese ? 'ja-JP' : undefined,
      onStart: () => useSenseiStore.getState().setSpeechState('speaking'),
      onEnd: () => useSenseiStore.getState().setSpeechState('idle'),
      onError: () => useSenseiStore.getState().setSpeechState('idle')
    });
  };

  return (
    <div className="h-[calc(100vh-6rem)] min-h-[600px] flex flex-col gap-3">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-card/70 backdrop-blur-md rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[2px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center text-lg">
              🌸
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              Hana-sensei Studio
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-japanese">
                花先生の教室
              </span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Your 3D Anime AI Japanese Teacher • Speech Synthesis, Visual Pointing & Interactive Guidance
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Camera Framing Toggle */}
          <button
            onClick={toggleCameraMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 active:scale-95 ${
              cameraMode === 'portrait'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-muted/70 hover:bg-muted text-foreground border-border'
            }`}
            title="Toggle between Full Body and Close-up Portrait view"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{cameraMode === 'portrait' ? 'Portrait' : 'Full Stage'}</span>
          </button>

          {/* Greet Sensei */}
          <button
            onClick={() => greet()}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span>👋</span> Greet
          </button>

          {/* Celebrate */}
          <button
            onClick={() => triggerCelebration("Wonderful effort today!")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" /> Celebrate
          </button>

          {/* Tour */}
          <button
            onClick={() => startTour(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Compass className="w-3.5 h-3.5 text-primary" /> Tour
          </button>

          {/* Voice Toggle */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl border transition-colors ${
              speechEnabled
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-muted text-muted-foreground'
            }`}
            title={speechEnabled ? 'Mute Speech' : 'Enable Speech'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* QA / Developer Mode Toggle */}
          <button
            onClick={toggleQaMode}
            className={`p-2 rounded-xl border transition-all ${
              qaMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground'
            }`}
            title={qaMode ? 'Exit QA Studio Mode' : 'Open Developer / QA Studio'}
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Experience Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        
        {/* ─── LEFT COLUMN: Learning Progress & Recommendations (3 cols) ─── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-3.5 overflow-y-auto pr-1">
          {/* Daily Guidance Card */}
          <div
            data-sensei-target="daily-guidance-card"
            className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-2.5 transition-all"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Today's Guidance</span>
            </div>
            
            <p className="text-xs text-foreground leading-relaxed">
              {guidance?.tip || "Consistency is the key to fluency! Practice a few SRS review cards daily to cement your vocabulary."}
            </p>

            {guidance?.recommendedAction && (
              <button
                onClick={() => navigate(guidance.recommendedAction.path)}
                className="mt-1 w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-between hover:opacity-95 active:scale-95 transition-all shadow-xs"
              >
                <span>{guidance.recommendedAction.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Stats Summary Card */}
          <div
            data-sensei-target="streak-xp-card"
            className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-3"
          >
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Progress</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex flex-col">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" /> Streak
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {guidance?.streak ?? 0} days
                </span>
              </div>
              
              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex flex-col">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Total XP
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {guidance?.totalXP ?? 0}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex flex-col">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Award className="w-3 h-3 text-blue-500" /> Target
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {guidance?.level || 'N5'}
                </span>
              </div>

              <div
                data-sensei-target="srs-queue-card"
                className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex flex-col"
              >
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-emerald-500" /> Due Reviews
                </span>
                <span className="text-base font-bold text-foreground mt-0.5">
                  {guidance?.dueReviews ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Curriculum Shortcuts */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col gap-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Quick Study</h3>
            <button
              data-sensei-target="nav-lessons"
              onClick={() => navigate('/lessons')}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-left text-xs font-medium flex items-center justify-between transition-colors text-foreground"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" /> JLPT Lessons
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              data-sensei-target="nav-review"
              onClick={() => navigate('/review')}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-left text-xs font-medium flex items-center justify-between transition-colors text-foreground"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-500" /> SRS Review Queue
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button
              data-sensei-target="nav-kanji"
              onClick={() => navigate('/kanji')}
              className="p-2.5 rounded-xl bg-muted/40 hover:bg-muted text-left text-xs font-medium flex items-center justify-between transition-colors text-foreground"
            >
              <span className="flex items-center gap-2">
                <span>㊗️</span> Kanji Studio
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ─── CENTER COLUMN: Hana Sanctuary 3D Stage (5 cols) ─── */}
        <div className="col-span-1 lg:col-span-5 xl:col-span-5 flex flex-col rounded-3xl bg-gradient-to-b from-primary/10 via-background to-background border border-border shadow-lg overflow-hidden relative min-h-[380px] lg:min-h-0">
          
          {/* 3D Character Canvas */}
          <div className="flex-1 w-full h-full relative">
            <SenseiCharacter
              state={animationState}
              mode={cameraMode}
              targetDirection={targetDirection}
            />

            {/* Speaking Status Pill */}
            {speechState === 'speaking' && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-primary/40 shadow-md flex items-center gap-2 text-xs font-semibold text-primary z-10 animate-fade-in">
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-1 bg-primary rounded-full animate-bounce" style={{ height: '10px', animationDuration: '400ms' }} />
                  <span className="w-1 bg-primary rounded-full animate-bounce" style={{ height: '14px', animationDuration: '600ms' }} />
                  <span className="w-1 bg-primary rounded-full animate-bounce" style={{ height: '8px', animationDuration: '500ms' }} />
                </span>
                <span>Speaking...</span>
                <button
                  onClick={stopSpeech}
                  className="ml-1 text-muted-foreground hover:text-destructive p-0.5 rounded"
                  title="Stop voice"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              </div>
            )}

            {/* 3D Orbit Interaction Hint */}
            <div className="absolute bottom-3 left-3 text-[10px] text-muted-foreground/75 bg-background/60 backdrop-blur-xs px-2.5 py-1 rounded-lg pointer-events-none z-10">
              ✨ Drag to orbit • Scroll to zoom
            </div>

            {/* NORMAL MODE: Floating Interaction Bar */}
            {!qaMode && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                <button
                  onClick={() => greet()}
                  className="px-2.5 py-1 rounded-full bg-background/80 hover:bg-background backdrop-blur-md border border-border/80 text-[11px] font-medium text-foreground transition-all shadow-xs active:scale-95"
                >
                  👋 Greet
                </button>
                <button
                  onClick={() => handleSend("What should I focus on studying today?")}
                  className="px-2.5 py-1 rounded-full bg-background/80 hover:bg-background backdrop-blur-md border border-border/80 text-[11px] font-medium text-foreground transition-all shadow-xs active:scale-95"
                >
                  ✨ Advice
                </button>
                <button
                  onClick={() => handleSend("Can you explain the particle は vs が?")}
                  className="px-2.5 py-1 rounded-full bg-background/80 hover:bg-background backdrop-blur-md border border-border/80 text-[11px] font-medium text-foreground transition-all shadow-xs active:scale-95"
                >
                  📖 Grammar
                </button>
              </div>
            )}

            {/* QA MODE: Diagnostics Top Badge */}
            {qaMode && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-background/90 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono text-foreground flex items-center gap-2 z-10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>QA MODE:</span>
                <span className="font-bold text-primary">{animationState}</span>
                <span className="text-muted-foreground">({emotion || 'neutral'})</span>
                <button
                  onClick={() => setQaMode(false)}
                  className="ml-1 text-muted-foreground hover:text-foreground text-[10px] underline"
                >
                  Exit
                </button>
              </div>
            )}
          </div>

          {/* QA MODE: Bottom Test Harness Panel */}
          {qaMode && (
            <div className="p-3 border-t border-amber-500/30 bg-card/95 backdrop-blur-md flex flex-col gap-2 z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> QA Studio Test Suite
                  </span>
                  <div className="flex rounded-lg bg-muted p-0.5 text-[11px]">
                    <button
                      onClick={() => setQaTab('clips')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                        qaTab === 'clips' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      Clips (14)
                    </button>
                    <button
                      onClick={() => setQaTab('emotions')}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                        qaTab === 'emotions' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
                      }`}
                    >
                      Emotions (11)
                    </button>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Click to inspect morphs & clips
                </span>
              </div>

              {qaTab === 'clips' ? (
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {ANIMATION_CLIPS.map(clip => (
                    <button
                      key={clip.key}
                      onClick={() => setAnimationState(clip.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                        animationState === clip.key
                          ? 'bg-primary text-primary-foreground shadow-xs scale-105'
                          : 'bg-muted/70 hover:bg-muted text-foreground'
                      }`}
                    >
                      <span>{clip.icon}</span>
                      <span>{clip.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {EMOTION_PRESETS.map(emo => (
                    <button
                      key={emo.key}
                      onClick={() => {
                        useSenseiStore.setState({ emotion: emo.key });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                        emotion === emo.key
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'bg-muted/70 hover:bg-muted text-foreground'
                      }`}
                    >
                      <span>{emo.icon}</span>
                      <span>{emo.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN: Interactive Conversation Panel (4 cols) ─── */}
        <div className="col-span-1 lg:col-span-4 xl:col-span-4 flex flex-col rounded-3xl bg-card border border-border shadow-lg overflow-hidden min-h-[420px] lg:min-h-0">
          
          {/* Chat Header */}
          <div className="p-3.5 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm shadow-xs">
                🌸
              </div>
              <div>
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  Sensei Dialogue
                  <span className="text-[10px] font-normal text-muted-foreground font-japanese">
                    花先生
                  </span>
                </span>
                <p className="text-[11px] text-muted-foreground leading-none">
                  {isTyping
                    ? 'Thinking...'
                    : speechState === 'speaking'
                    ? 'Speaking aloud...'
                    : animationState === 'listening'
                    ? 'Listening attentively...'
                    : 'Ready to teach'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.length === 0 && !isTyping && (
              <div className="text-center text-muted-foreground text-sm my-8 space-y-2">
                <div className="text-3xl">🌸</div>
                <p className="font-semibold text-foreground">Konnichiwa! I am Hana-sensei.</p>
                <p className="text-xs max-w-[260px] mx-auto text-muted-foreground">
                  Ask me any Japanese grammar or vocabulary question, or choose a prompt below!
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-xs'
                      : 'bg-muted/70 text-foreground border border-border/40 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Contextual Action Card if Sensei recommended an activity */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-col gap-1.5">
                      <div className="text-xs font-semibold flex items-center gap-1 text-primary">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recommended Next Step:</span>
                      </div>
                      <button
                        onClick={() => executeAction(msg.action, navigate)}
                        className="py-1.5 px-3 rounded-xl bg-background border border-primary/30 hover:border-primary/60 text-xs font-medium text-foreground flex items-center justify-between transition-all active:scale-95 shadow-xs"
                      >
                        <span>{msg.action.label || msg.action.payload?.path || 'Start Practice'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </button>
                    </div>
                  )}

                  {/* Audio Replay Button for Hana messages */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2 flex items-center justify-between text-[11px] opacity-70 border-t border-border/30 pt-1.5">
                      <button
                        onClick={() => handleReplayAudio(msg.content)}
                        className="hover:opacity-100 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="Replay Voice"
                      >
                        <Volume1 className="w-3.5 h-3.5 text-primary" />
                        <span>Replay</span>
                      </button>
                      {msg.emotion && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          [{msg.emotion}]
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted/80 border border-border/40 max-w-[85%] rounded-2xl rounded-tl-xs p-3 text-sm flex gap-1.5 items-center">
                  <span className="text-xs text-muted-foreground mr-1">Sensei is composing</span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {!isTyping && (
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-border/40 bg-muted/20">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-2.5 py-1 bg-background border border-border hover:border-primary/40 rounded-full text-xs text-foreground transition-all flex-shrink-0 active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-background">
            <div className="flex items-center gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => {
                  if (animationState === 'idle') setAnimationState('listening');
                }}
                onBlur={() => {
                  if (animationState === 'listening') setAnimationState('idle');
                }}
                placeholder="Ask Hana-sensei anything about Japanese..."
                disabled={isTyping}
                className="flex-1 bg-muted/60 border border-border rounded-full py-2.5 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-40 transition-opacity active:scale-95 shadow-xs"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
