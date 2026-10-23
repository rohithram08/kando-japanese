import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  Send,
  Map,
  Square,
  Minimize2,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { useSenseiStore } from '../../store/senseiStore';
import { useNavigate, useLocation } from 'react-router-dom';
const SenseiCharacter = React.lazy(() => import('./SenseiCharacter'));
import { SenseiSpeechBubble } from './SenseiSpeechBubble';
import SenseiMarkdown from './SenseiMarkdown';
import { useSenseiPageContext } from '../../hooks/useSenseiPageContext';
import { SenseiGuidedTour } from './SenseiGuidedTour';

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
    animationState,
    stopSpeech,
    sendMessage,
    fetchHistory,
    executeAction,
    targetId,
    clearTarget,
    greet,
    triggerCelebration
  } = useSenseiStore();

  const [input, setInput] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded3D, setIsExpanded3D] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Proactive page context guidance
  useSenseiPageContext();

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

    const response = await sendMessage(userMsg);
    if (response?.action) {
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

  const handleCharacterClick = (e: React.MouseEvent) => {
    // Avoid triggering click when finishing a drag
    if (e.detail === 1) {
      toggleOpen();
    } else if (e.detail === 2) {
      // Double click triggers voice greeting & wave
      greet();
    }
  };

  const handleWandSparkle = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerCelebration("Great curiosity!");
  };

  // Hide floating companion when viewing dedicated full Sensei page
  if (location.pathname.startsWith('/sensei')) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6 pointer-events-none"
    >
      <div className="pointer-events-auto flex flex-col items-end relative select-none">
        {/* ─── TEACHING / GUIDANCE POPUP MODE ─── */}
        <SenseiSpeechBubble />
        
        {/* ─── GUIDED TOUR MODE ─── */}
        <SenseiGuidedTour />

        {/* ─── CHAT WINDOW MODE ─── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: reducedMotion ? 0.05 : 0.2 }}
              className="mb-4 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-120px)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              role="dialog"
              aria-label="AI Sensei Companion Dialog"
            >
              {/* Header */}
              <div className="p-3.5 border-b border-border bg-muted/60 flex justify-between items-center select-none">
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={handleWandSparkle}
                    className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 cursor-pointer flex items-center justify-center transition-transform hover:scale-110"
                    title="Click for sparkles! ✨"
                    aria-label="Trigger Sensei Sparkles"
                  >
                    🌸
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-none flex items-center gap-1.5">
                      Hana-sensei
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
                        AI Teacher
                      </span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {speechState === 'speaking' ? 'Speaking...' : isTyping ? 'Thinking...' : 'Here to guide you'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Open Full Studio Page */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate('/sensei');
                    }}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    aria-label="Open Full Studio"
                    title="Open Full Sensei Studio Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Toggle 3D View Height */}
                  <button
                    onClick={() => setIsExpanded3D(!isExpanded3D)}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    aria-label={isExpanded3D ? "Compact 3D View" : "Expand 3D View"}
                    title={isExpanded3D ? "Shrink 3D" : "Expand 3D"}
                  >
                    {isExpanded3D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  {/* Stop Speech */}
                  {speechState === 'speaking' && (
                    <button
                      onClick={stopSpeech}
                      className="p-1.5 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                      aria-label="Stop Speaking"
                      title="Stop Speaking"
                    >
                      <Square className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {/* Speech Toggle */}
                  <button
                    onClick={toggleSpeech}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                    aria-label={speechEnabled ? "Mute Speech" : "Enable Speech"}
                    title={speechEnabled ? "Mute" : "Unmute"}
                  >
                    {speechEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  {/* Close Dialog */}
                  <button
                    onClick={toggleOpen}
                    className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors ml-1"
                    aria-label="Minimize Sensei"
                    title="Close / Minimize"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3D Character Viewport Area */}
              <div
                className={`relative transition-all duration-300 bg-gradient-to-b from-primary/10 via-background to-background border-b border-border flex items-center justify-center overflow-hidden ${
                  isExpanded3D ? 'h-56' : 'h-36'
                }`}
              >
                <React.Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-1.5" />
                      <span className="text-[11px] text-muted-foreground font-medium">Summoning Hana-sensei...</span>
                    </div>
                  }
                >
                  <SenseiCharacter
                    state={animationState}
                    reducedMotion={reducedMotion}
                  />
                </React.Suspense>
              </div>

              {/* Chat Message History */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3.5"
                role="log"
                aria-live="polite"
                aria-label="Conversation with Sensei"
              >
                {messages.length === 0 && !isTyping && (
                  <div className="text-center text-muted-foreground text-sm my-6 space-y-2">
                    <div className="text-2xl">🌸</div>
                    <p className="font-medium text-foreground">Konnichiwa! I am your AI Sensei.</p>
                    <p className="text-xs max-w-[260px] mx-auto">
                      Ask me about Japanese grammar, vocabulary, kanji, or platform lessons!
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-sm leading-relaxed ${
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
                          Guided to: <span className="font-semibold">{msg.action.payload?.path || 'new activity'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start" aria-label="Sensei is thinking">
                    <div className="bg-muted/80 border border-border/40 max-w-[85%] rounded-2xl rounded-tl-xs p-3.5 text-sm flex gap-1.5 items-center">
                      <span className="text-xs text-muted-foreground mr-1">Sensei is thinking</span>
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

              {/* Chat Input Field */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-background">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Sensei in Japanese or English..."
                    disabled={isTyping}
                    aria-label="Message input for AI Sensei"
                    className="flex-1 bg-muted/60 border border-border rounded-full py-2.5 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className="absolute right-1.5 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-40 transition-opacity active:scale-95 shadow-sm"
                  >
                    <Send className="w-4 h-4 -ml-0.5" />
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
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 p-[2px] shadow-2xl relative cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30"
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
