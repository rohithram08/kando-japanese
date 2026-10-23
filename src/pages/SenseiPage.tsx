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
  HelpCircle
} from 'lucide-react';

import SenseiCharacter from '../components/sensei/SenseiCharacter';
import SenseiMarkdown from '../components/sensei/SenseiMarkdown';
import { audioService } from '../services/audioService';
import { useSenseiStore } from '../store/senseiStore';
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

  // Get the latest assistant message to display in the live in-stage bubble
  const latestAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const latestUserMessage = [...messages].reverse().find(m => m.role === 'user');

  return (
    <div className="h-[calc(100vh-5.5rem)] min-h-[580px] flex flex-col relative rounded-3xl overflow-hidden border border-border/70 shadow-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      
      {/* ─── TOP FLOATING GLASS TOOLBAR ─── */}
      <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Sensei Identity Badge */}
        <div className="pointer-events-auto flex items-center gap-3 bg-card/85 backdrop-blur-xl border border-border/80 px-4 py-2 rounded-2xl shadow-lg ring-1 ring-primary/20">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 p-[2px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center text-lg">
              🌸
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold flex items-center gap-2 text-foreground">
              Hana-sensei 3D
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-japanese">
                花先生
              </span>
            </h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              {isListening ? (
                <span className="text-pink-500 font-semibold flex items-center gap-1 animate-pulse">
                  <Mic className="w-3 h-3" /> Listening...
                </span>
              ) : speechState === 'speaking' ? (
                <span className="text-primary font-medium flex items-center gap-1">
                  <Volume2 className="w-3 h-3 animate-pulse" /> Speaking...
                </span>
              ) : isTyping ? (
                <span className="text-amber-500 font-medium">Thinking...</span>
              ) : (
                <span>Interactive Japanese Stage</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-card/85 backdrop-blur-xl border border-border/80 p-1.5 rounded-2xl shadow-lg">
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

          {/* Voice Toggle */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl transition-all ${
              speechEnabled
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-muted-foreground'
            }`}
            title={speechEnabled ? "Mute Voice" : "Enable Voice"}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl transition-all ${
              showHistory
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
            title="Toggle Dialogue History"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── FULL 3D CHARACTER STAGE CANVAS ─── */}
      <main className="flex-1 w-full h-full relative" aria-label="3D Hana-sensei Stage">
        <SenseiCharacter
          state={animationState}
          mode={cameraMode}
          targetDirection={targetDirection}
        />

        {/* ─── IN-STAGE DYNAMIC SPEECH BUBBLE (beside/above Hana-sensei) ─── */}
        <AnimatePresence mode="wait">
          {(latestAssistantMessage || isTyping) && (
            <motion.div
              key={latestAssistantMessage?.id || 'typing'}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-20 right-6 sm:right-10 max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] z-20 pointer-events-auto"
            >
              <div className="relative p-5 rounded-3xl bg-card/90 backdrop-blur-xl border border-primary/30 shadow-2xl ring-1 ring-primary/20 text-foreground">
                {/* Speech Bubble Tail Indicator */}
                <div className="absolute -left-3 top-8 w-4 h-4 bg-card/90 border-l border-b border-primary/30 rotate-45 pointer-events-none hidden sm:block" />

                {/* Header inside bubble */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5 font-japanese">
                    <span>花先生</span>
                    <span className="text-[10px] font-normal text-muted-foreground font-sans">
                      {speechState === 'speaking' ? 'Speaking...' : 'Sensei'}
                    </span>
                  </span>

                  {latestAssistantMessage && !isTyping && (
                    <button
                      onClick={() => handleReplayAudio(latestAssistantMessage.content)}
                      className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-primary transition-colors text-xs flex items-center gap-1"
                      title="Replay Voice"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Replay</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                {isTyping ? (
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-xs text-muted-foreground">Composing response</span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : latestAssistantMessage ? (
                  <div className="max-h-[220px] sm:max-h-[280px] overflow-y-auto pr-1 text-sm leading-relaxed scrollbar-thin">
                    <SenseiMarkdown content={latestAssistantMessage.content} />
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── IN-STAGE FLOATING INTERACTIVE INPUT & PROMPT BAR ─── */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-12 sm:right-12 lg:left-24 lg:right-24 z-20 pointer-events-auto flex flex-col items-center gap-2.5">
          
          {/* Quick Action Chips Bar */}
          {!isTyping && (
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-hide">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-3.5 py-1.5 bg-card/85 backdrop-blur-md border border-border/80 hover:border-primary/50 text-foreground text-xs font-medium rounded-full hover:bg-primary/10 transition-all flex-shrink-0 active:scale-95 shadow-md"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Main Rounded Input Bar with Mic */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl p-1.5 rounded-full bg-card/90 backdrop-blur-xl border border-primary/30 shadow-2xl ring-1 ring-primary/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening to your voice... 🎤" : t('sensei.ask_placeholder', 'Talk to Hana-sensei in English, Tamil, or Japanese...')}
              disabled={isTyping}
              className={`flex-1 bg-transparent px-5 py-3 text-sm focus:outline-none text-foreground placeholder:text-muted-foreground disabled:opacity-50 ${
                isListening ? 'text-pink-500 font-medium' : ''
              }`}
            />

            {/* Speech-to-Text Microphone Button */}
            {isSttSupported && (
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-full transition-all active:scale-95 ${
                  isListening
                    ? 'bg-pink-500 text-white shadow-lg animate-pulse'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                }`}
                title={isListening ? "Stop voice listening" : "Speak to Sensei"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-primary text-primary-foreground rounded-full hover:opacity-95 disabled:opacity-40 transition-opacity active:scale-95 shadow-md"
              title="Send message"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          </form>
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
