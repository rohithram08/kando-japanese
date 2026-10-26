// src/components/sensei/SenseiMobileDock.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Phone layout for the 3D Sensei stage.
//
// On desktop the dialogue lives *inside* the 3D scene (Html billboards anchored
// to Hana and the slime). Those billboards are not rendered on screens < 640px
// (the characters would be off-camera), which left phones with a silent 3D
// model: no speech bubble, no way to type, no slime. This dock is the phone
// equivalent — a normal HTML panel BELOW the stage, so nothing overlaps the
// bottom nav and the 3D view simply gets the remaining height.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { Send, Mic, MicOff, Keyboard, Square, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import SenseiMarkdown from './SenseiMarkdown';
import VirtualLanguageKeyboard from './VirtualLanguageKeyboard';
import KandoSlime, { SlimeMood } from '../mascot/KandoSlime';

export interface SenseiMobileDockProps {
  latestAssistantMessage?: { id?: string; content: string; role: string } | null;
  latestUserMessage?: { id?: string; content: string; role: string } | null;
  isTyping?: boolean;
  isSpeaking?: boolean;
  onReplayAudio?: (content: string) => void;
  onStopAudio?: () => void;
  userName?: string;
  userLevel?: number;
  slimePersona?: 'mr' | 'mrs';
  slimeMood?: SlimeMood;
  input?: string;
  onInputChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onSend?: (text: string) => void;
  isListening?: boolean;
  isSttSupported?: boolean;
  onToggleMic?: () => void;
  quickPrompts?: string[];
  keyboardLanguage?: string;
}

const WELCOME = 'Konnichiwa! I am Hana-sensei. Ask me anything about Japanese grammar, vocabulary, or JLPT!';

export default function SenseiMobileDock({
  latestAssistantMessage,
  latestUserMessage,
  isTyping = false,
  isSpeaking = false,
  onReplayAudio,
  onStopAudio,
  userName = 'Learner',
  userLevel = 1,
  slimePersona = 'mr',
  slimeMood = 'idle',
  input = '',
  onInputChange,
  onSubmit,
  onSend,
  isListening = false,
  isSttSupported = false,
  onToggleMic,
  quickPrompts = [],
  keyboardLanguage = 'ta',
}: SenseiMobileDockProps) {
  const [expanded, setExpanded] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);

  return (
    <section
      aria-label="Chat with Hana-sensei"
      data-testid="sensei-mobile-dock"
      className="shrink-0 border-t border-pink-400/30 bg-slate-950/95 text-slate-100 backdrop-blur-xl pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      {/* Header: who is talking + collapse */}
      <div className="flex items-center gap-2.5 px-3 pt-2">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-sky-400/40 bg-slate-900" aria-hidden="true">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[46%]">
            <KandoSlime mood={slimeMood} size={46} slimeType={slimePersona} interactive={false} showSpeech={false} showMoodButtons={false} />
          </div>
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-xs font-bold text-pink-300">
            花先生 <span className="font-normal text-slate-400">· {isSpeaking ? 'Speaking…' : isTyping ? 'Thinking…' : 'Hana-sensei'}</span>
          </p>
          <p className="truncate text-[10px] text-slate-400">
            {slimePersona === 'mrs' ? '🌸 Mrs. Slime' : '🧢 Mr. Slime'} ({userName}) · Lv.{userLevel}
          </p>
        </div>

        {isSpeaking ? (
          <button
            type="button"
            onClick={() => onStopAudio?.()}
            aria-label="Stop Hana-sensei speaking"
            className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/25 px-2.5 py-1.5 text-[11px] font-semibold text-rose-200"
          >
            <Square className="h-3 w-3 fill-current" /> Stop
          </button>
        ) : latestAssistantMessage && !isTyping && onReplayAudio ? (
          <button
            type="button"
            onClick={() => onReplayAudio(latestAssistantMessage.content)}
            aria-label="Replay voice"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-300"
          >
            <RotateCcw className="h-3 w-3" /> Replay
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse chat' : 'Expand chat'}
          aria-expanded={expanded}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-3 pt-2">
          {/* Hana's latest reply */}
          <div
            data-testid="sensei-dock-message"
            className="max-h-[22vh] min-h-[2.5rem] overflow-y-auto rounded-2xl border border-pink-400/25 bg-slate-900/80 px-3 py-2 text-[13px] leading-relaxed"
          >
            {isTyping ? (
              <div className="flex items-center gap-2 py-1 text-slate-300">
                <span className="text-xs text-slate-400">Hana-sensei is explaining</span>
                {[0, 150, 300].map((d) => (
                  <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-pink-400" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            ) : (
              <SenseiMarkdown content={latestAssistantMessage?.content || WELCOME} />
            )}
          </div>

          {latestUserMessage && !isTyping && (
            <p className="mt-1.5 line-clamp-1 px-1 text-[11px] italic text-sky-200/80">“{latestUserMessage.content}”</p>
          )}

          {/* Quick prompts: one scrolling line */}
          {!isTyping && !showKeyboard && quickPrompts.length > 0 && (
            <div className="-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onSend?.(p)}
                  className="shrink-0 whitespace-nowrap rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-[11px] font-medium text-slate-300 active:scale-95"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={onSubmit}
        className="mx-3 mt-2 flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900 p-1 focus-within:border-sky-400/70"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange?.(e.target.value)}
          placeholder={isListening ? 'Listening… 🎤' : 'Type to Sensei…'}
          disabled={isTyping}
          autoComplete="off"
          enterKeyHint="send"
          data-testid="sensei-dock-input"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[16px] text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={() => setShowKeyboard((v) => !v)}
          aria-label={showKeyboard ? 'Hide language keyboard' : 'Open language keyboard'}
          aria-pressed={showKeyboard}
          className={`rounded-full p-2 ${showKeyboard ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
        >
          <Keyboard className="h-4 w-4" />
        </button>
        {isSttSupported && onToggleMic && (
          <button
            type="button"
            onClick={onToggleMic}
            aria-label={isListening ? 'Stop listening' : 'Speak to Sensei'}
            className={`rounded-full p-2 ${isListening ? 'animate-pulse bg-pink-500 text-white' : 'text-slate-400'}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          aria-label="Send message"
          className="rounded-full bg-sky-500 p-2 text-white disabled:opacity-40 active:scale-95"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

      {showKeyboard && (
        <div className="mx-3 mt-1 max-h-[40vh] overflow-y-auto">
          <VirtualLanguageKeyboard
            initialLanguage={keyboardLanguage}
            onInsertChar={(c) => onInputChange?.((input || '') + c)}
            onBackspace={() => onInputChange?.((input || '').slice(0, -1))}
            onClear={() => onInputChange?.('')}
            onClose={() => setShowKeyboard(false)}
          />
        </div>
      )}
    </section>
  );
}
