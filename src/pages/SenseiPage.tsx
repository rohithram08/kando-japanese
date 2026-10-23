import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  Square,
  Mic,
  MicOff,
  RotateCcw,
  Camera,
  Wrench,
  Smile,
  Compass,
  MessageCircle,
  HelpCircle,
  User as UserIcon
} from 'lucide-react';

import SenseiCharacter from '../components/sensei/SenseiCharacter';
import SenseiMarkdown from '../components/sensei/SenseiMarkdown';
import KandoSlime, { SlimeMood } from '../components/mascot/KandoSlime';
import { audioService } from '../services/audioService';
import { useSenseiStore } from '../store/senseiStore';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { SenseiAnimationState } from '../components/sensei/controllers/SenseiAnimationController';
import { SenseiEmotion } from '../components/sensei/controllers/SenseiExpressionController';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useSettingsStore } from '../store/settingsStore';
import { useI18n } from '../i18n';

const QUICK_PROMPTS = [
  "Teach me the difference between は and が",
  "How do I remember Kanji stroke orders?",
  "What is my study recommendation today?",
  "Can we practice polite Japanese greetings?",
  "How do I order food politely in Japanese?"
];

export default function SenseiPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    greet,
    triggerCelebration,
    fetchHistory,
    targetDirection,
    qaMode,
    toggleQaMode,
    cameraMode,
    toggleCameraMode
  } = useSenseiStore();

  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const explanationLang = useSettingsStore(s => s.explanationLanguage || 'en');
  const speechLang = explanationLang === 'ta' ? 'ta-IN' : explanationLang === 'hi' ? 'hi-IN' : 'en-US';
  const { isListening, transcript, isSupported: isSttSupported, startListening, stopListening } = useSpeechToText(speechLang);

  // Sync Speech-to-Text transcript into input field
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-enable QA mode if ?dev=true or ?qa=true is present
  useEffect(() => {
    (window as any).__senseiStore = useSenseiStore;
    if (searchParams.get('dev') === 'true' || searchParams.get('qa') === 'true') {
      useSenseiStore.getState().setQaMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (messages.length === 0) {
      fetchHistory();
    }
  }, [messages.length, fetchHistory]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    if (isListening) stopListening();

    const res = await sendMessage(text);
    if (res?.action && res.action.type === 'navigate' && !res.action.payload?.path?.includes('sensei')) {
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

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(speechLang, (finalText) => {
        if (finalText.trim()) {
          setInput(finalText);
        }
      });
    }
  };

  const handleReplayAudio = (content: string) => {
    if (!content) return;
    useSenseiStore.getState().stopSpeech();
    useSenseiStore.getState().setSpeechState('speaking');
    audioService.speak(content, {
      onStart: () => useSenseiStore.getState().setSpeechState('speaking'),
      onEnd: () => useSenseiStore.getState().setSpeechState('idle'),
      onError: () => useSenseiStore.getState().setSpeechState('idle')
    });
  };

  const user = useAuthStore(s => s.user || s.profile);
  const userName = user?.displayName || user?.name || user?.username || 'Rohith Ram';
  const userLevel = useProgressStore(s => s.userLevel || 6);

  // Auto-detect gender: 'female' -> Mrs. Slime (Pink), 'male'/other -> Mr. Slime (Blue)
  const savedGender = typeof window !== 'undefined' ? localStorage.getItem('kando_user_gender') : null;
  const userGender = (user as any)?.gender || (user as any)?.sex || savedGender || 'male';
  const [slimePersona, setSlimePersona] = useState<'mr' | 'mrs'>(
    userGender.toLowerCase() === 'female' ? 'mrs' : 'mr'
  );

  useEffect(() => {
    if ((user as any)?.gender) {
      setSlimePersona((user as any).gender.toLowerCase() === 'female' ? 'mrs' : 'mr');
    } else if (savedGender) {
      setSlimePersona(savedGender.toLowerCase() === 'female' ? 'mrs' : 'mr');
    }
  }, [(user as any)?.gender, savedGender]);

  const handlePersonaChange = (persona: 'mr' | 'mrs') => {
    setSlimePersona(persona);
    const genderStr = persona === 'mrs' ? 'female' : 'male';
    localStorage.setItem('kando_user_gender', genderStr);
    if (user) {
      try {
        useAuthStore.getState().updateProfile({ gender: genderStr } as any);
      } catch {
        // non-blocking
      }
    }
  };

  // Dynamic Slime expressions:
  // - User typing in chat bubble -> 'studying' (Hachimaki headband & Kanji book)
  // - Hana-sensei speaking -> 'listening' (Attentive face, eyes looking left towards Sensei, music notes)
  // - Hana-sensei thinking/answering -> 'curious' (Looking attentively)
  // - Celebration -> 'celebrating' (Star eyes & confetti)
  // - Idle -> 'waving'
  const isUserTyping = input.trim().length > 0;
  const activeSlimeMood: SlimeMood = isUserTyping
    ? 'studying'
    : speechState === 'speaking'
    ? 'listening'
    : isTyping
    ? 'curious'
    : emotion === 'celebrating' || animationState === 'celebrating'
    ? 'celebrating'
    : 'waving';

  // Get the latest assistant message to display in the live in-stage bubble
  const latestAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const latestUserMessage = [...messages].reverse().find(m => m.role === 'user');

  return (
    <div className="h-[calc(100vh-5.5rem)] min-h-[580px] flex flex-col relative rounded-3xl overflow-hidden border border-border/70 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      
      {/* ─── TOP RIGHT FLOATING GLASS TOOLBAR (Greet, Celebrate, Camera ONLY) ─── */}
      <header className="absolute top-4 right-4 z-20 flex items-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-card/85 backdrop-blur-xl border border-border/80 p-1.5 rounded-2xl shadow-lg ring-1 ring-primary/20">
          {/* Greet */}
          <button
            onClick={() => greet()}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all flex items-center gap-1.5 active:scale-95"
            title="Greet Hana-sensei"
          >
            <span>👋</span> Greet
          </button>

          {/* Celebrate */}
          <button
            onClick={() => triggerCelebration("Great job studying today!")}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all flex items-center gap-1.5 active:scale-95"
            title="Celebrate Progress"
          >
            <Sparkles className="w-3.5 h-3.5" /> Celebrate
          </button>

          {/* Camera Mode Toggle */}
          <button
            onClick={toggleCameraMode}
            className={`p-2 rounded-xl transition-all ${
              cameraMode === 'portrait'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title={cameraMode === 'portrait' ? "Full Stage Framing" : "Portrait Focus"}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── FULL 3D CHARACTER STAGE CANVAS & 2-WAY CLASSROOM ─── */}
      <main className="flex-1 w-full h-full relative overflow-hidden" aria-label="3D Hana-sensei Stage">
        {/* Full-bleed 3D Character Canvas (Hana-sensei standing on the LEFT side) */}
        <div className="absolute inset-0 z-0">
          <SenseiCharacter
            state={animationState}
            mode={cameraMode}
            targetDirection="right"
            stageSide="left"
          />
        </div>

        {/* ─── 2-WAY VISUAL CLASSROOM CONVERSATION OVERLAY ─── */}
        <div className="relative z-10 w-full h-full pointer-events-none p-4 sm:p-6 md:p-8">
          
          {/* ── 1. HANA-SENSEI SPEECH POP-UP (POSITIONED TO HER RIGHT SIDE) ── */}
          <div className="pointer-events-auto md:absolute md:left-[270px] lg:left-[320px] xl:left-[360px] top-4 md:top-8 w-full md:w-auto max-w-sm sm:max-w-md lg:max-w-lg z-20">
            <AnimatePresence mode="wait">
              {(latestAssistantMessage || isTyping) && (
                <motion.div
                  key={latestAssistantMessage?.id || 'typing'}
                  initial={{ opacity: 0, scale: 0.92, x: -16 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.92, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="relative p-4 sm:p-5 rounded-3xl bg-card/92 backdrop-blur-xl border border-primary/30 shadow-2xl ring-1 ring-primary/20 text-foreground"
                >
                  {/* Speech Bubble Tail pointing LEFT towards Hana-sensei */}
                  <div className="hidden md:block absolute top-8 -left-2 w-3.5 h-3.5 bg-card/92 border-l border-b border-primary/30 rotate-45 pointer-events-none" />

                  {/* Sensei Bubble Header */}
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs">
                        🌸
                      </span>
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 font-japanese">
                        <span>花先生 (Hana-sensei)</span>
                        <span className="text-[10px] font-normal text-muted-foreground font-sans">
                          {speechState === 'speaking' ? 'Speaking...' : isTyping ? 'Thinking...' : 'AI Sensei'}
                        </span>
                      </span>
                    </div>

                    {latestAssistantMessage && !isTyping && (
                      <button
                        onClick={() => handleReplayAudio(latestAssistantMessage.content)}
                        className="px-2 py-1 bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-colors text-xs flex items-center gap-1"
                        title="Replay Voice"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">Replay</span>
                      </button>
                    )}
                  </div>

                  {/* Sensei Bubble Content */}
                  {isTyping ? (
                    <div className="flex items-center gap-2 py-3">
                      <span className="text-xs text-muted-foreground">Hana-sensei is explaining</span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : latestAssistantMessage ? (
                    <div className="max-h-[200px] sm:max-h-[260px] lg:max-h-[300px] overflow-y-auto pr-1 text-xs sm:text-sm leading-relaxed scrollbar-thin">
                      <SenseiMarkdown content={latestAssistantMessage.content} />
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 2. SLIME IN BOTTOM RIGHT CORNER ── */}
          <div className="pointer-events-auto absolute bottom-3 right-3 sm:bottom-5 sm:right-5 z-20 flex flex-col items-center select-none">
            {/* Slime Persona Switcher Pill (Mr. Slime - Blue / Mrs. Slime - Pink) */}
            <div className="mb-1 flex items-center gap-1 p-1 rounded-full bg-card/90 backdrop-blur-md border border-border/70 shadow-sm text-xs">
              <button
                type="button"
                onClick={() => handlePersonaChange('mr')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-semibold text-[11px] ${
                  slimePersona === 'mr'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>🧢</span> Mr. Slime
              </button>
              <button
                type="button"
                onClick={() => handlePersonaChange('mrs')}
                className={`px-2.5 py-0.5 rounded-full transition-all flex items-center gap-1 font-semibold text-[11px] ${
                  slimePersona === 'mrs'
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>🌸</span> Mrs. Slime
              </button>
            </div>

            {/* Kando Slime Mascot with Dynamic Expressions */}
            <div className="relative flex flex-col items-center">
              <KandoSlime
                mood={activeSlimeMood}
                slimeType={slimePersona}
                size={145}
                showSpeech={false}
                showMoodButtons={false}
                interactive={true}
              />
              {/* Tatami Mat Cushion */}
              <div className="w-32 h-3 -mt-2 rounded-full bg-gradient-to-r from-amber-900/40 via-amber-700/50 to-amber-900/40 border border-amber-600/40 blur-[1px] shadow-lg pointer-events-none" />
            </div>
          </div>

          {/* ── 3. USER CHAT BUBBLE (ANCHORED TO THE LEFT OF SLIME WITH EMBEDDED TYPING) ── */}
          <div className="pointer-events-auto absolute bottom-3 right-[155px] sm:bottom-5 sm:right-[180px] md:right-[200px] w-[calc(100%-175px)] max-w-sm sm:max-w-md md:max-w-lg z-20 flex flex-col gap-2">
            
            <div className="relative p-3.5 sm:p-4 rounded-3xl bg-card/95 backdrop-blur-xl border border-primary/30 shadow-2xl ring-1 ring-primary/20 text-foreground">
              {/* Bubble Tail pointing RIGHT towards Slime */}
              <div className="hidden md:block absolute bottom-8 -right-2 w-3.5 h-3.5 bg-card/95 border-r border-t border-primary/30 rotate-45 pointer-events-none" />

              {/* Bubble Header */}
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={slimePersona === 'mrs' ? 'text-pink-500' : 'text-blue-500'}>
                    {slimePersona === 'mrs' ? '🌸 Mrs. Slime' : '🧢 Mr. Slime'}
                  </span>
                  <span className="text-muted-foreground font-normal">({userName})</span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium">
                  Lv.{userLevel} Adventurer
                </span>
              </div>

              {/* If user sent a message recently, show it inside the bubble */}
              {latestUserMessage && (
                <div className="mb-2 p-2 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground/90 font-medium">
                  <p className="line-clamp-2 italic">“{latestUserMessage.content}”</p>
                </div>
              )}

              {/* Quick Suggestion Chips */}
              {!isTyping && (
                <div className="mb-2 flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-hide">
                  {QUICK_PROMPTS.slice(0, 3).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSend(p)}
                      className="whitespace-nowrap px-2.5 py-1 bg-muted/60 hover:bg-primary/15 border border-border/60 hover:border-primary/40 text-[11px] font-medium rounded-full text-foreground/80 transition-all flex-shrink-0 active:scale-95"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Embedded Typing Form INSIDE the Slime Bubble */}
              <form
                onSubmit={handleSubmit}
                className="w-full p-1 rounded-full bg-background/80 border border-border/80 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 flex items-center gap-1 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening to your voice... 🎤"
                      : `Type to Hana-sensei as ${slimePersona === 'mrs' ? 'Mrs. Slime' : 'Mr. Slime'}...`
                  }
                  disabled={isTyping}
                  className={`flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/70 disabled:opacity-50 ${
                    isListening ? 'text-pink-500 font-medium' : ''
                  }`}
                />

                {/* Mic button */}
                {isSttSupported && (
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`p-1.5 rounded-full transition-all active:scale-95 ${
                      isListening
                        ? 'bg-pink-500 text-white shadow-md animate-pulse'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }`}
                    title={isListening ? "Stop voice listening" : "Speak to Sensei"}
                  >
                    {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-40 transition-opacity active:scale-95 shadow-sm"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* ─── OPTIONAL SLIDE-OUT DIALOGUE HISTORY DRAWER ─── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 340 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 340 }}
            transition={{ duration: 0.25 }}
            className="absolute top-0 right-0 bottom-0 w-80 sm:w-96 bg-card/95 backdrop-blur-2xl border-l border-border/80 z-30 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" /> Dialogue History
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={m.id || i}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-muted-foreground mb-1">
                    {m.role === 'user' ? 'You' : 'Hana-sensei'}
                  </span>
                  <div
                    className={`p-3 rounded-2xl text-xs max-w-[90%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-xs'
                        : 'bg-muted/80 text-foreground border border-border/40 rounded-tl-xs'
                    }`}
                  >
                    {m.role === 'user' ? m.content : <SenseiMarkdown content={m.content} />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
