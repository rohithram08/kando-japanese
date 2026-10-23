import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, Send, Mic, MicOff } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { SenseiGLBCharacter } from './SenseiGLBLoader';
import { SenseiBackground } from './SenseiBackground';
import { SakuraParticles } from './SakuraParticles';
import { SenseiAnimationState } from './controllers/SenseiAnimationController';
import HanaSenseiCharacter2D, { HanaAnimationState } from './HanaSenseiCharacter2D';
import SenseiMarkdown from './SenseiMarkdown';
import { KandoSlime3D } from './KandoSlime3D';
import { SlimeMood } from '../mascot/KandoSlime';

export interface SenseiCharacterProps {
  speechState?: SenseiAnimationState;
  state?: SenseiAnimationState;
  reducedMotion?: boolean;
  mode?: 'compact' | 'full' | 'portrait';
  targetDirection?: 'left' | 'right' | 'forward' | null;
  stageSide?: 'left' | 'center';
  slimePersona?: 'mr' | 'mrs';
  slimeMood?: SlimeMood;
  showSlime?: boolean;

  // In-Scene 3D Conversation Dialogue Props:
  latestAssistantMessage?: { id?: string; content: string; role: string } | null;
  latestUserMessage?: { id?: string; content: string; role: string } | null;
  isTyping?: boolean;
  onReplayAudio?: (content: string) => void;
  userName?: string;
  userLevel?: number;
  input?: string;
  onInputChange?: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onSend?: (text: string) => void;
  isListening?: boolean;
  isSttSupported?: boolean;
  onToggleMic?: () => void;
  quickPrompts?: string[];
  onPersonaChange?: (persona: 'mr' | 'mrs') => void;
}

// ─── WebGL Detection Utility ────────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// ─── Map 3D Animation State to 2D State ─────────────────────────────────────
function to2DAnimationState(state: SenseiAnimationState): HanaAnimationState {
  switch (state) {
    case 'greeting':
    case 'waving':
      return 'greeting';
    case 'talking':
    case 'listening':
      return 'listening';
    case 'thinking':
    case 'confused':
      return 'thinking';
    case 'happy':
      return 'happy';
    case 'encouraging':
    case 'teaching':
    case 'pointing':
      return 'encouraging';
    case 'celebrating':
      return 'celebrating';
    case 'idle':
    default:
      return 'idle';
  }
}

// ─── Loading Indicator ────────────────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="text-xs font-semibold text-primary/80 tracking-widest uppercase">Summoning</div>
      </div>
    </Html>
  );
}

// ─── Fallback 2D Avatar (Rule 38 Asset Blocker inside 3D Canvas) ─────────────
function AvatarFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-[280px] sm:w-[320px] p-6 bg-background/85 backdrop-blur-md rounded-3xl border border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative w-44 h-44 mb-3 rounded-full border-4 border-primary/30 overflow-hidden shadow-inner">
          <img 
            src="/images/sensei-avatar-fallback.jpg" 
            alt="Hana-sensei 2D Fallback"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="text-center z-10 relative">
          <h3 className="text-lg font-bold text-primary font-japanese tracking-wider mb-1">花先生</h3>
          <p className="text-xs text-muted-foreground/80 mb-2 px-2">
            Hana-sensei 2D Companion Active
          </p>
          <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20 inline-block">
            <span className="text-xs text-primary font-medium">Avatar Mode</span>
          </div>
        </div>
      </div>
    </Html>
  );
}

// ─── Pure DOM 2D Fallback (When WebGL is unavailable or Canvas fails) ────────
function Dom2DView({
  state,
  mode,
  onRetry3D,
}: {
  state: SenseiAnimationState;
  mode: 'compact' | 'full' | 'portrait';
  onRetry3D?: () => void;
}) {
  const isCompact = mode === 'compact';

  return (
    <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/10 via-background to-background relative select-none rounded-2xl overflow-hidden">
      <div className="relative z-10 flex flex-col items-center">
        <HanaSenseiCharacter2D
          state={to2DAnimationState(state)}
          size={isCompact ? 'md' : 'lg'}
          showStatusPill={!isCompact}
        />
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-muted-foreground font-medium">
            2D Sensei Mode
          </span>
          {onRetry3D && (
            <button
              onClick={onRetry3D}
              className="text-xs font-semibold text-primary hover:underline ml-1"
            >
              • Switch to 3D
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Sensei Character Export ───────────────────────────────────────────
export default function SenseiCharacter({
  speechState,
  state: propState,
  reducedMotion = false,
  mode = 'compact',
  targetDirection = null,
  stageSide = 'center',
  slimePersona = 'mr',
  slimeMood = 'idle',
  showSlime = true,

  // In-Scene 3D Conversation Dialogue Props:
  latestAssistantMessage,
  latestUserMessage,
  isTyping = false,
  onReplayAudio,
  userName = 'Rohith Ram',
  userLevel = 6,
  input = '',
  onInputChange,
  onSubmit,
  onSend,
  isListening = false,
  isSttSupported = false,
  onToggleMic,
  quickPrompts = [],
  onPersonaChange,
}: SenseiCharacterProps) {
  
  // Normalize active animation state (backward compatibility with speechState)
  const activeState: SenseiAnimationState = propState || speechState || 'idle';

  // Responsive mobile screen detection
  const [isMobileScreen, setIsMobileScreen] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  // WebGL support state
  const [webGLSupported, setWebGLSupported] = useState<boolean>(() => isWebGLAvailable());
  const [canvasError, setCanvasError] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobileScreen(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Character 3D stage position:
  // When stageSide === 'left' and screen is wide enough, position Hana on the LEFT of the classroom (-1.05m),
  // and position 3D Kando Slime on the RIGHT of the classroom (+1.05m)!
  const isLeft = stageSide === 'left' && !isMobileScreen;
  const characterPos: [number, number, number] = isLeft ? [-1.05, 0, 0] : [0, 0, 0];
  const slimePos: [number, number, number] = [1.05, 0, 0];
  const daisPos: [number, number, number] = isLeft ? [-1.05, -0.01, 0] : [0, -0.01, 0];
  const slimeDaisPos: [number, number, number] = [1.05, -0.01, 0];

  // Camera framing:
  // - Full stage: captures both Hana on left and 3D Slime on right with central clear space for speech
  // - Portrait: waist to cap focus for intimate dialogue
  // - Compact: upper body for minimized floating widget
  const isPortrait = mode === 'portrait';
  const isFull = mode === 'full';

  let targetPos: [number, number, number] = isLeft ? [0, 0.78, 0] : [0, 0.74, 0];
  let cameraPos: [number, number, number] = isLeft
    ? [0, 0.82, 2.55]
    : isMobileScreen
    ? [0, 0.76, 2.7]
    : [0, 0.76, 2.3];
  let cameraFov = isLeft ? 43 : isMobileScreen ? 46 : 41;

  if (isPortrait) {
    targetPos = isLeft ? [-0.5, 1.10, 0] : [0, 1.10, 0];
    cameraPos = isMobileScreen ? [0, 1.12, 1.5] : [0, 1.12, 1.35];
    cameraFov = 34;
  } else if (!isFull) {
    targetPos = [0, 1.15, 0];
    cameraPos = [0, 1.18, 1.55];
    cameraFov = 32;
  }

  // Gracefully render 2D view if WebGL is unavailable or encountered canvas error
  if (!webGLSupported || canvasError) {
    return (
      <Dom2DView
        state={activeState}
        mode={mode}
        onRetry3D={() => {
          setCanvasError(false);
          setWebGLSupported(isWebGLAvailable());
        }}
      />
    );
  }

  return (
    <div className="w-full h-full relative select-none bg-transparent rounded-2xl overflow-hidden">
      <ErrorBoundary
        fallbackRender={() => (
          <Dom2DView
            state={activeState}
            mode={mode}
            onRetry3D={() => setCanvasError(false)}
          />
        )}
        onError={(err) => {
          console.warn('[SenseiCharacter] Canvas 3D render error, falling back to 2D view:', err);
          setCanvasError(true);
        }}
      >
        <Canvas
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: cameraPos, fov: cameraFov }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setCanvasError(true);
            });
          }}
        >
          <PerspectiveCamera makeDefault position={cameraPos} fov={cameraFov} />
          
          {/* Environment & Lighting with dedicated Dais for Hana on left and Slime on right */}
          <SenseiBackground
            daisPosition={daisPos}
            showSlimeDais={isLeft && showSlime}
            slimeDaisPosition={slimeDaisPos}
          />
          {!reducedMotion && <SakuraParticles count={isFull ? 45 : 25} />}
          
          <ambientLight intensity={1.4} color="#f5f0fa" />
          {/* Key light */}
          <directionalLight position={[1.8, 2.8, 3.2]} intensity={2.2} color="#ffffff" castShadow />
          {/* Fill light (soft sakura pink) */}
          <directionalLight position={[-2.4, 1.4, 1.8]} intensity={1.4} color="#fdf2f4" />
          {/* Rim light (gold) */}
          <directionalLight position={[0, 2.2, -3.5]} intensity={2.6} color="#e5a93c" />
          {/* Dedicated Wand Specular & Emissive Light for Hana on Left */}
          <pointLight position={[-0.6, 0.78, 0.65]} intensity={2.8} distance={2.5} color="#ffe082" />
          {/* Dedicated Ambient Keylight for 3D Slime on Right */}
          {isLeft && showSlime && (
            <pointLight
              position={[1.05, 0.7, 0.7]}
              intensity={2.4}
              distance={2.5}
              color={slimePersona === 'mrs' ? '#f472b6' : '#38bdf8'}
            />
          )}

          {/* 3D Hana-Sensei Character (Standing on the LEFT Dais, looking towards Slime) */}
          <ErrorBoundary FallbackComponent={AvatarFallback}>
            <Suspense fallback={<Loader />}>
              <SenseiGLBCharacter
                state={activeState}
                targetDirection={targetDirection || (isLeft ? 'right' : null)}
                position={characterPos}
              />
            </Suspense>
          </ErrorBoundary>

          {/* 3D Kando Slime (Sitting on the RIGHT Dais, looking towards Hana) */}
          {isLeft && showSlime && (
            <Suspense fallback={null}>
              <KandoSlime3D
                position={slimePos}
                slimeType={slimePersona}
                mood={slimeMood}
                scale={1.08}
              />
            </Suspense>
          )}

          {/* ─── 3D-ANCHORED DIALOGUE BUBBLES IN-SCENE ─── */}
          {isLeft && (
            <>
              {/* 1. HANA-SENSEI 3D SPEECH BUBBLE (ANCHORED IN 3D SPACE NEXT TO HANA) */}
              <Html
                position={isMobileScreen ? [-0.1, 1.25, 0] : [-0.28, 1.15, 0]}
                center
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto' }}
              >
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-[330px] sm:w-[390px] md:w-[420px] max-w-[88vw] p-4 sm:p-5 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-pink-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.65)] text-slate-100 ring-1 ring-pink-500/25 relative select-text transition-all duration-300"
                >
                  {/* Bubble Tail pointing left towards Hana */}
                  <div className="absolute top-8 -left-2 w-4 h-4 bg-slate-900/90 border-l border-b border-pink-400/35 rotate-45 pointer-events-none" />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-xs">
                        🌸
                      </span>
                      <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5 font-japanese">
                        <span>花先生 (Hana-sensei)</span>
                        <span className="text-[10px] font-normal text-slate-400 font-sans">
                          {speechState === 'speaking' ? 'Speaking...' : isTyping ? 'Thinking...' : 'AI Sensei'}
                        </span>
                      </span>
                    </div>

                    {latestAssistantMessage && !isTyping && onReplayAudio && (
                      <button
                        type="button"
                        onClick={() => onReplayAudio(latestAssistantMessage.content)}
                        className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-pink-300 rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-700/50"
                        title="Replay Voice"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">Replay</span>
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  {isTyping ? (
                    <div className="flex items-center gap-2 py-3 text-slate-300">
                      <span className="text-xs text-slate-400">Hana-sensei is explaining</span>
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <div className="max-h-[190px] sm:max-h-[230px] overflow-y-auto pr-1 text-xs sm:text-sm leading-relaxed scrollbar-thin text-slate-100">
                      <SenseiMarkdown content={latestAssistantMessage?.content || "Konnichiwa! I am Hana-sensei. Ask me anything about Japanese grammar, vocabulary, or JLPT!"} />
                    </div>
                  )}
                </div>
              </Html>

              {/* 2. SLIME 3D CHAT & TYPING BUBBLE (ANCHORED IN 3D SPACE NEXT TO SLIME) */}
              <Html
                position={isMobileScreen ? [0.1, 0.48, 0] : [0.28, 0.55, 0]}
                center
                zIndexRange={[100, 0]}
                style={{ pointerEvents: 'auto' }}
              >
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className="w-[330px] sm:w-[390px] md:w-[420px] max-w-[88vw] p-3.5 sm:p-4 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-sky-400/35 shadow-[0_20px_50px_rgba(0,0,0,0.65)] text-slate-100 ring-1 ring-sky-500/25 relative select-text transition-all duration-300"
                >
                  {/* Bubble Tail pointing right towards Slime */}
                  <div className="absolute bottom-8 -right-2 w-4 h-4 bg-slate-900/90 border-r border-t border-sky-400/35 rotate-45 pointer-events-none" />

                  {/* Bubble Header */}
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/60 text-xs">
                    <div className="flex items-center gap-2 font-bold">
                      <span className={slimePersona === 'mrs' ? 'text-pink-400' : 'text-sky-400'}>
                        {slimePersona === 'mrs' ? '🌸 Mrs. Slime' : '🧢 Mr. Slime'}
                      </span>
                      <span className="text-slate-400 font-normal">({userName})</span>
                      <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full font-medium border border-slate-700/50">
                        Lv.{userLevel}
                      </span>
                    </div>

                    {/* Slime Persona Switcher */}
                    {onPersonaChange && (
                      <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-full border border-slate-700">
                        <button
                          type="button"
                          onClick={() => onPersonaChange('mr')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                            slimePersona === 'mr' ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🧢 Mr
                        </button>
                        <button
                          type="button"
                          onClick={() => onPersonaChange('mrs')}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                            slimePersona === 'mrs' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🌸 Mrs
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Recent message quote */}
                  {latestUserMessage && (
                    <div className="mb-2 p-2 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-slate-200 font-medium">
                      <p className="line-clamp-2 italic">“{latestUserMessage.content}”</p>
                    </div>
                  )}

                  {/* Quick Suggestion Chips */}
                  {!isTyping && quickPrompts.length > 0 && (
                    <div className="mb-2 flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-hide">
                      {quickPrompts.slice(0, 3).map((promptText) => (
                        <button
                          key={promptText}
                          type="button"
                          onClick={() => onSend?.(promptText)}
                          className="whitespace-nowrap px-2.5 py-1 bg-slate-800/70 hover:bg-sky-950/80 border border-slate-700 hover:border-sky-500/40 text-[11px] font-medium rounded-full text-slate-300 transition-all flex-shrink-0 active:scale-95"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Embedded Typing Form INSIDE the 3D Slime Bubble */}
                  <form
                    onSubmit={onSubmit}
                    className="w-full p-1 rounded-full bg-slate-950/70 border border-slate-700/80 focus-within:border-sky-400/70 focus-within:ring-2 focus-within:ring-sky-500/20 flex items-center gap-1 transition-all"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => onInputChange?.(e.target.value)}
                      placeholder={
                        isListening
                          ? "Listening to your voice... 🎤"
                          : `Type to Hana-sensei as ${slimePersona === 'mrs' ? 'Mrs. Slime' : 'Mr. Slime'}...`
                      }
                      disabled={isTyping}
                      className={`flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm focus:outline-none text-white placeholder:text-slate-500 disabled:opacity-50 ${
                        isListening ? 'text-pink-400 font-medium' : ''
                      }`}
                    />

                    {/* Mic button */}
                    {isSttSupported && onToggleMic && (
                      <button
                        type="button"
                        onClick={onToggleMic}
                        className={`p-1.5 rounded-full transition-all active:scale-95 ${
                          isListening
                            ? 'bg-pink-500 text-white shadow-md animate-pulse'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={isListening ? "Stop voice listening" : "Speak to Sensei"}
                      >
                        {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {/* Send button */}
                    <button
                      type="submit"
                      disabled={!input?.trim() || isTyping}
                      className="p-1.5 bg-sky-500 text-white rounded-full hover:bg-sky-400 disabled:opacity-40 transition-all active:scale-95 shadow-sm"
                      title="Send message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </Html>
            </>
          )}

          {/* OrbitControls: Locked to prevent scene distortion while keeping stable classroom view */}
          <OrbitControls
            target={targetPos}
            enableRotate={false}
            enablePan={false}
            enableZoom={false}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}


