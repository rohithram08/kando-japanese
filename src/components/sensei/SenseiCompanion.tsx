import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Send,
  Map,
  Square,
  Mic,
  MicOff,
  ExternalLink
} from 'lucide-react';
import { useSenseiStore } from '../../store/senseiStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { SenseiSpeechBubble } from './SenseiSpeechBubble';
import SenseiMarkdown from './SenseiMarkdown';
import { useSenseiPageContext } from '../../hooks/useSenseiPageContext';
import { SenseiGuidedTour } from './SenseiGuidedTour';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useSettingsStore } from '../../store/settingsStore';

const QUICK_ACTIONS = [
  { label: "Today's Lesson", message: "What is my lesson for today?" },
  { label: "Review SRS", message: "I want to review my SRS cards." },
  { label: "Practice Kanji", message: "Let's practice some Kanji." },
  { label: "Graded Reader", message: "I want to read stories and test comprehension in Graded Reader." },
  { label: "Listening", message: "I want to practice listening." },
];

export default function SenseiCompanion() {
  const {
    isOpen,
    toggleOpen,
    setOpen,
    messages,
    isTyping,
    speechEnabled,
    toggleSpeech,
    speechState,
    stopSpeech,
    sendMessage,
    fetchHistory,
    executeAction,
    targetId,
    clearTarget,
    triggerCelebration
  } = useSenseiStore();

  const [input, setInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const explanationLang = useSettingsStore(s => s.explanationLanguage || 'en');
  const speechLang = explanationLang === 'ta' ? 'ta-IN' : explanationLang === 'hi' ? 'hi-IN' : 'en-US';
  const { isListening, transcript, isSupported: isSttSupported, startListening, stopListening } = useSpeechToText(speechLang);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Proactive page context guidance
  useSenseiPageContext();

  // Sync Speech-to-Text transcript into input field
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (targetId) {
          clearTarget();
        } else if (isOpen) {
          setOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, targetId]);

  const handleSend = async (userMsg: string) => {
    if (!userMsg.trim() || isTyping) return;

    if (isListening) {
      stopListening();
    }

    // Companion is silent chat mode — never auto-speak aloud
    const response = await sendMessage(userMsg, { skipAutoSpeak: true });
    // Only execute navigation action if it is an explicit modal or specific tool
    if (response?.action && response.action.type === 'navigate' && !response.action.payload?.path?.includes('sensei')) {
      executeAction(response.action, navigate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
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

  const handleCharacterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleOpen();
  };

  const handleWandSparkle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerCelebration("Magic sparkle! 🌸✨");
  };

  // Hide floating widget if user is currently in the dedicated /sensei 3D Studio page
  if (location.pathname.startsWith('/sensei')) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed right-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[100] md:bottom-6 md:right-6 pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end relative select-none">
        {/* ─── TEACHING / GUIDANCE POPUP MODE ─── */}
        <SenseiSpeechBubble />
        
        {/* ─── GUIDED TOUR MODE ─── */}
        <SenseiGuidedTour />

        {/* ─── PURE CHAT MODE COMPANION (Fast, lightweight, no laggy 3D canvas) ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: reducedMotion ? 0.05 : 0.2 }}
              className="mb-3 w-[calc(100vw-32px)] sm:w-[410px] h-[520px] max-h-[calc(100dvh-11rem)] md:max-h-[calc(100vh-100px)] bg-card/95 backdrop-blur-xl border border-border/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-primary/20"
              role="dialog"
              aria-label="Hana-sensei AI Chat Companion"
            >
              {/* Header */}
              <div className="p-3.5 border-b border-border/60 bg-muted/40 flex justify-between items-center select-none backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={handleWandSparkle}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-amber-500/20 border border-primary/30 flex items-center justify-center text-base cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs"
                    title="Click for sparkles! ✨"
                    aria-label="Trigger Sensei Sparkles"
                  >
                    🌸
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none flex items-center gap-1.5 text-foreground">
                      Hana-sensei
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 font-japanese">
                        花先生
                      </span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-1 flex items-center gap-1.5">
                      {isListening ? (
                        <span className="text-pink-500 font-semibold flex items-center gap-1 animate-pulse">
                          <Mic className="w-3 h-3" /> Listening to you...
                        </span>
                      ) : isTyping ? (
                        <span className="text-amber-500 font-medium">Composing reply...</span>
                      ) : (
                        <span>AI Japanese Tutor • Chat Mode</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Open Full 3D Studio Page */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate('/sensei');
                    }}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
                    aria-label="Open Full 3D Studio"
                    title="Enter Full 3D Studio Stage"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Stop Speech */}
                  {speechState === 'speaking' && (
                    <button
                      onClick={stopSpeech}
                      className="p-1.5 hover:bg-destructive/20 text-destructive rounded-xl transition-colors"
                      aria-label="Stop Speaking"
                      title="Stop Voice"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {/* Speech Toggle */}
                  <button
                    onClick={toggleSpeech}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors"
                    aria-label={speechEnabled ? "Mute Speech" : "Enable Speech"}
                    title={speechEnabled ? "Mute Voice" : "Unmute Voice"}
                  >
                    {speechEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Close Dialog */}
                  <button
                    onClick={toggleOpen}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors ml-0.5"
                    aria-label="Minimize Sensei"
                    title="Close Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Message History */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3.5"
                role="log"
                aria-live="polite"
                aria-label="Conversation with Sensei"
              >
                {messages.length === 0 && !isTyping && (
                  <div className="text-center text-muted-foreground text-sm my-8 space-y-2.5">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shadow-xs">
                      🌸
                    </div>
                    <p className="font-semibold text-foreground">Konnichiwa! I am Hana-sensei.</p>
                    <p className="text-xs max-w-[280px] mx-auto text-muted-foreground leading-relaxed">
                      Ask me any Japanese grammar or vocabulary question, or use the mic to speak with me directly!
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-xs'
                          : 'bg-muted/80 text-foreground border border-border/40 rounded-tl-xs'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <SenseiMarkdown content={msg.content} />
                      )}
                      {msg.action && (
                        <div className="mt-2 text-xs opacity-80 flex items-center gap-1.5 border-t border-border/30 pt-1.5">
                          <Map className="w-3.5 h-3.5 text-primary" />
                          Activity: <span className="font-semibold">{msg.action.payload?.path || 'guided lesson'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start" aria-label="Sensei is thinking">
                    <div className="bg-muted/80 border border-border/40 max-w-[85%] rounded-2xl rounded-tl-xs p-3.5 text-sm flex gap-1.5 items-center">
                      <span className="text-xs text-muted-foreground mr-1">Sensei is composing</span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Chips */}
              {!isTyping && (
                <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-t border-border/40 bg-muted/20">
                  {QUICK_ACTIONS.map(action => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.message)}
                      className="whitespace-nowrap px-3 py-1.5 bg-background border border-border hover:border-primary/40 rounded-full text-xs font-medium hover:bg-muted text-foreground transition-all flex-shrink-0 active:scale-95"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Field with Speech-to-Text Mic */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-background">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening to your voice..." : "Ask in English, Tamil or Japanese..."}
                    disabled={isTyping}
                    aria-label="Message input for AI Sensei"
                    className={`flex-1 bg-muted/60 border rounded-full py-2.5 pl-4 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all disabled:opacity-50 text-foreground placeholder:text-muted-foreground ${
                      isListening ? 'border-pink-500 ring-2 ring-pink-500/20 animate-pulse' : 'border-border'
                    }`}
                  />

                  {/* Speech-to-Text Microphone Button */}
                  {isSttSupported && (
                    <button
                      type="button"
                      onClick={toggleMic}
                      className={`absolute right-10 w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-95 ${
                        isListening
                          ? 'bg-pink-500 text-white shadow-md animate-bounce'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                      title={isListening ? "Stop listening" : "Speak via microphone"}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-40 transition-opacity active:scale-95 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 -ml-0.5" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FLOATING MINIMIZED COMPANION MASCOT ─── */}
        <div className="relative flex items-center justify-center">
          {/* Tooltip on Hover */}
          <AnimatePresence>
            {isHovered && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-16 px-3 py-1.5 rounded-xl bg-card border border-border shadow-lg text-xs font-medium text-foreground whitespace-nowrap pointer-events-none flex items-center gap-1.5"
              >
                <span>Hana-sensei 🌸</span>
                <span className="text-[10px] text-muted-foreground">(Click to chat)</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Character Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleCharacterClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Hana-sensei AI Companion. Click to chat."
            aria-expanded={isOpen}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-[2px] shadow-2xl relative cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30"
          >
            <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center relative">
              {/* 2D Avatar in Minimized Floating Button */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <img
                  src="/images/sensei-avatar-fallback.jpg"
                  alt="Hana-sensei"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <span className="hidden w-full h-full items-center justify-center text-2xl select-none" aria-hidden="true">
                  🌸
                </span>
              </div>

              {/* Active Speech / Thinking Status Ring */}
              {speechState === 'speaking' && (
                <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping pointer-events-none" />
              )}
            </div>

            {/* Notification Badge / Sparkle */}
            <span
              onClick={handleWandSparkle}
              className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background shadow-sm hover:scale-125 transition-transform"
              title="Sensei Magic ✨"
              aria-label="Magical wand indicator"
            >
              ✨
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
