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
import { audioService, localeToTtsLang } from '../services/audioService';
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
  const speechLang = localeToTtsLang(explanationLang);
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

  // Auto-detect gender purely from login/registration preference:
  // 'female' -> Mrs. Slime (Pink), 'male'/other -> Mr. Slime (Blue)
  const savedGender = typeof window !== 'undefined' ? localStorage.getItem('kando_user_gender') : null;
  const userGender = (user as any)?.gender || (user as any)?.sex || savedGender || 'male';
  const slimePersona: 'mr' | 'mrs' = userGender.toLowerCase() === 'female' ? 'mrs' : 'mr';

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
      
      {/* ─── TOP RIGHT FLOATING GLASS TOOLBAR (Greet, Celebrate, Sound/Stop, Camera) ─── */}
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

          {/* Live Speech Stop / Mute Action Button */}
          {speechState === 'speaking' ? (
            <button
              onClick={() => stopSpeech()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-500/25 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-1.5 active:scale-95 animate-pulse"
              title="Stop Hana-sensei speaking"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop
            </button>
          ) : (
            <button
              onClick={() => toggleSpeech()}
              className={`p-2 rounded-xl transition-all ${
                speechEnabled
                  ? 'text-primary hover:bg-muted'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              title={speechEnabled ? "Mute Voice Speech" : "Unmute Voice Speech"}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

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
        {/* Full-bleed 3D Character Canvas (Hana-sensei on the LEFT, 3D Kando Slime on the RIGHT, Dialogue INSIDE 3D) */}
        <div className="absolute inset-0 z-0">
          <SenseiCharacter
            state={animationState}
            mode={cameraMode}
            targetDirection="right"
            stageSide="left"
            slimePersona={slimePersona}
            slimeMood={activeSlimeMood}
            showSlime={true}
            latestAssistantMessage={latestAssistantMessage}
            latestUserMessage={latestUserMessage}
            isTyping={isTyping}
            onReplayAudio={handleReplayAudio}
            onStopAudio={stopSpeech}
            userName={userName}
            userLevel={userLevel}
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onSend={handleSend}
            isListening={isListening}
            isSttSupported={isSttSupported}
            onToggleMic={toggleMic}
            quickPrompts={QUICK_PROMPTS}
          />
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
