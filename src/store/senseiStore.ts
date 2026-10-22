import { create } from 'zustand';
import { senseiApi } from '../api';
import { audioService } from '../services/audioService';
import { SenseiAnimationState } from '../components/sensei/controllers/SenseiAnimationController';

export type CompanionMode = 'minimized' | 'chat' | 'teaching' | 'tour' | 'celebration' | 'thinking';

export interface SenseiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  action?: any;
}

export type SenseiSpeechState = SenseiAnimationState;

const POSITION_STORAGE_KEY = 'nihongo-sensei-pos';

function getSavedPosition(): { x: number; y: number } {
  try {
    const raw = localStorage.getItem(POSITION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return { x: 0, y: 0 };
}

interface SenseiState {
  isOpen: boolean;
  isTouring: boolean;
  isTyping: boolean;
  companionMode: CompanionMode;
  speechState: SenseiSpeechState;
  animationState: SenseiAnimationState;
  messages: SenseiMessage[];
  tourProgress: any | null;
  speechEnabled: boolean;
  position: { x: number; y: number };
  targetId: string | null;
  targetMessage: string | null;
  emotion: string | null;
  tourCompleted: boolean;
  tourSkipped: boolean;
  dailyGuidance: any | null;
  targetDirection: 'left' | 'right' | 'forward' | null;
  qaMode: boolean;
  cameraMode: 'full' | 'portrait';

  // Actions
  toggleOpen: () => void;
  setOpen: (isOpen: boolean) => void;
  setCompanionMode: (mode: CompanionMode) => void;
  setSpeechState: (state: SenseiSpeechState) => void;
  setAnimationState: (state: SenseiAnimationState) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  toggleSpeech: () => void;
  stopSpeech: () => void;
  fetchHistory: () => Promise<void>;
  sendMessage: (message: string) => Promise<any>;
  startTour: (force?: boolean) => Promise<void>;
  completeTour: () => Promise<void>;
  skipTour: () => Promise<void>;
  closeTour: () => void;
  fetchGuidance: () => Promise<void>;
  executeAction: (action: any, navigate: any) => void;
  guideTo: (targetId: string, message?: string) => void;
  clearTarget: () => void;
  setTargetDirection: (dir: 'left' | 'right' | 'forward' | null) => void;
  setQaMode: (val: boolean) => void;
  toggleQaMode: () => void;
  setCameraMode: (mode: 'full' | 'portrait') => void;
  toggleCameraMode: () => void;
  greet: () => void;
  triggerCelebration: (reason?: string) => void;
}

const isQaModeInit = typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('dev') === 'true' ||
   new URLSearchParams(window.location.search).get('qa') === 'true');

export const useSenseiStore = create<SenseiState>((set, get) => ({
  isOpen: false,
  isTouring: false,
  isTyping: false,
  companionMode: 'minimized',
  speechState: 'idle',
  animationState: 'idle',
  messages: [],
  tourProgress: null,
  tourCompleted: typeof window !== 'undefined' && localStorage.getItem('nihongo-sensei-tour-completed') === '1',
  tourSkipped: typeof window !== 'undefined' && localStorage.getItem('nihongo-sensei-tour-skipped') === '1',
  dailyGuidance: null,
  speechEnabled: true,
  position: getSavedPosition(),
  targetId: null,
  targetMessage: null,
  targetDirection: null,
  qaMode: isQaModeInit,
  cameraMode: 'full',
  emotion: null,

  setTargetDirection: (dir) => set({ targetDirection: dir }),
  setQaMode: (val) => set({ qaMode: val }),
  toggleQaMode: () => set(state => ({ qaMode: !state.qaMode })),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleCameraMode: () => set(state => ({ cameraMode: state.cameraMode === 'full' ? 'portrait' : 'full' })),

  toggleOpen: () => {
    const nextOpen = !get().isOpen;
    set({
      isOpen: nextOpen,
      companionMode: nextOpen ? 'chat' : 'minimized',
      animationState: nextOpen ? 'waving' : 'idle',
      speechState: nextOpen ? 'waving' : 'idle'
    });

    if (nextOpen) {
      // Auto transition to idle after greeting wave
      setTimeout(() => {
        if (get().animationState === 'waving') {
          set({ animationState: 'idle', speechState: 'idle' });
        }
      }, 1500);
    }
  },

  setOpen: (isOpen) => set({
    isOpen,
    companionMode: isOpen ? 'chat' : 'minimized',
    animationState: isOpen ? 'waving' : 'idle',
    speechState: isOpen ? 'waving' : 'idle'
  }),

  setCompanionMode: (mode) => set({
    companionMode: mode,
    isOpen: mode === 'chat' || mode === 'tour' || mode === 'teaching'
  }),

  setSpeechState: (state) => set({ speechState: state, animationState: state }),
  setAnimationState: (state) => set({ animationState: state, speechState: state }),

  setPosition: (pos) => {
    set({ position: pos });
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(pos));
    } catch (e) {
      // ignore
    }
  },

  toggleSpeech: () => {
    const nextState = !get().speechEnabled;
    set({ speechEnabled: nextState });
    if (!nextState) {
      get().stopSpeech();
    }
  },

  stopSpeech: () => {
    audioService.stop();
    set({ speechState: 'idle', animationState: 'idle' });
  },

  fetchHistory: async () => {
    try {
      const history = await senseiApi.getHistory();
      set({ messages: history.reverse() || [] });
    } catch (err) {
      console.error('Failed to fetch sensei history:', err);
    }
  },

  sendMessage: async (message: string) => {
    if (!message.trim()) return null;

    const tempId = Date.now().toString();
    set(state => ({
      messages: [...state.messages, { id: tempId, role: 'user', content: message }],
      isTyping: true,
      speechState: 'thinking',
      animationState: 'thinking'
    }));

    try {
      const res = await senseiApi.chat(message);
      const { message: reply, emotion, animation, action } = res;

      const nextAnim: SenseiAnimationState =
        animation ||
        (emotion === 'happy' ? 'happy' :
        emotion === 'celebrating' ? 'celebrating' :
        emotion === 'error' ? 'error' :
        emotion === 'encouraging' ? 'encouraging' :
        emotion === 'thinking' ? 'thinking' : 'idle');

      set(state => ({
        messages: [...state.messages, {
          id: Date.now().toString(),
          role: 'assistant',
          content: reply,
          emotion,
          action
        }],
        isTyping: false,
        speechState: nextAnim,
        animationState: nextAnim,
        emotion: emotion || 'neutral'
      }));

      // Trigger targeted guidance if action provides a target element
      if (action?.targetId) {
        get().guideTo(action.targetId);
      }

      // Speak if enabled
      if (get().speechEnabled && reply) {
        get().stopSpeech();
        const isJapanese = /[一-龠ぁ-ゔァ-ヴー]/.test(reply);

        audioService.speak(reply, {
          lang: isJapanese ? 'ja-JP' : undefined,
          onStart: () => set({ speechState: 'speaking', animationState: 'speaking' }),
          onEnd: () => {
            const endAnim = action?.targetId ? 'pointing' : 'idle';
            set({ speechState: endAnim, animationState: endAnim });
          },
          onError: () => set({ speechState: 'idle', animationState: 'idle' })
        });
      } else {
        const postAnim = action?.targetId ? 'pointing' : 'idle';
        set({ speechState: postAnim, animationState: postAnim });
      }

      return res;
    } catch (err) {
      console.error('Failed to send sensei message:', err);
      set(state => ({
        messages: [...state.messages, {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, my connection is a bit fuzzy right now! 🌸',
          emotion: 'sad'
        }],
        isTyping: false,
        speechState: 'error',
        animationState: 'error'
      }));
      return null;
    }
  },

  executeAction: (action, navigate) => {
    if (!action) return;

    const allowedPrefixes = ['/dashboard', '/lessons', '/kanji', '/vocabulary', '/review', '/quiz', '/reading', '/settings', '/sensei'];

    if (action.type === 'navigate' && action.payload?.path) {
      const path = action.payload.path;
      if (allowedPrefixes.some(prefix => path.startsWith(prefix))) {
        navigate(path);
      } else {
        console.warn(`[AI Sensei] Navigation to ${path} blocked. Not in whitelist.`);
      }
    } else if (action.type === 'point_and_guide') {
      if (action.targetId) {
        get().guideTo(action.targetId, action.label ? `Check out the ${action.label}!` : undefined);
      }
      if (action.path && navigate) {
        navigate(action.path);
      }
    } else if (action.type === 'suggest_lesson' && action.payload?.lessonId) {
      navigate(`/quiz/${action.payload.lessonId}`);
    } else if (action.type === 'celebrate') {
      get().triggerCelebration(action.payload?.achievement || action.reason);
    } else if (action.type === 'tour') {
      get().startTour(true);
    }
  },

  guideTo: (targetId: string, message?: string) => {
    let dir: 'left' | 'right' | 'forward' | null = null;
    if (typeof document !== 'undefined' && targetId) {
      const el = document.querySelector(`[data-sensei-target="${targetId}"]`) || document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const screenCenterX = window.innerWidth / 2;
        if (centerX < screenCenterX - 100) {
          dir = 'left';
        } else if (centerX > screenCenterX + 100) {
          dir = 'right';
        } else {
          dir = 'forward';
        }
      }
    }

    set({
      targetId,
      targetMessage: message || null,
      targetDirection: dir,
      companionMode: 'teaching',
      animationState: 'pointing',
      speechState: 'pointing'
    });

    if (message && get().speechEnabled) {
      audioService.speak(message, {
        onStart: () => set({ speechState: 'speaking', animationState: 'speaking' }),
        onEnd: () => set({ speechState: 'pointing', animationState: 'pointing' }),
        onError: () => set({ speechState: 'pointing', animationState: 'pointing' })
      });
    }
  },

  clearTarget: () => {
    set({
      targetId: null,
      targetMessage: null,
      targetDirection: null,
      animationState: 'idle',
      speechState: 'idle'
    });
  },

  greet: () => {
    const greetings = [
      "Konnichiwa! Let's do our best today! 🌸",
      "Ready to study Japanese with me? Ganbatte! ✨",
      "Sensei is here! What would you like to practice today? 🎌"
    ];
    const phrase = greetings[Math.floor(Math.random() * greetings.length)];

    set({ animationState: 'waving', speechState: 'waving' });

    if (get().speechEnabled) {
      audioService.speak(phrase, {
        onStart: () => set({ speechState: 'speaking', animationState: 'speaking' }),
        onEnd: () => set({ speechState: 'idle', animationState: 'idle' }),
        onError: () => set({ speechState: 'idle', animationState: 'idle' })
      });
    } else {
      setTimeout(() => {
        set({ animationState: 'idle', speechState: 'idle' });
      }, 2000);
    }
  },

  triggerCelebration: (reason?: string) => {
    set({
      companionMode: 'celebration',
      animationState: 'celebrating',
      speechState: 'celebrating'
    });

    const praise = reason ? `Subarashii! ${reason} 🎉` : "Subarashii! Amazing work! 🎉";
    if (get().speechEnabled) {
      audioService.speak(praise, {
        onStart: () => set({ speechState: 'speaking', animationState: 'speaking' }),
        onEnd: () => set({ speechState: 'happy', animationState: 'happy' }),
        onError: () => set({ speechState: 'happy', animationState: 'happy' })
      });
    }

    setTimeout(() => {
      if (get().animationState === 'celebrating' || get().animationState === 'happy') {
        set({ animationState: 'idle', speechState: 'idle' });
      }
    }, 4000);
  },

  startTour: async (force = false) => {
    try {
      const progress = await senseiApi.getTourProgress();
      const isCompleted = progress?.completed || (typeof window !== 'undefined' && localStorage.getItem('nihongo-sensei-tour-completed') === '1');
      const isSkipped = progress?.skipped || (typeof window !== 'undefined' && localStorage.getItem('nihongo-sensei-tour-skipped') === '1');

      set({ tourProgress: progress, tourCompleted: !!isCompleted, tourSkipped: !!isSkipped });

      if (!force && (isCompleted || isSkipped)) {
        return; // Don't interrupt users who completed or skipped the tour
      }

      set({ isTouring: true, isOpen: true, companionMode: 'tour' });
    } catch (err) {
      console.warn('Failed to get tour progress from API, checking local storage', err);
      if (force) {
        set({ isTouring: true, isOpen: true, companionMode: 'tour' });
      }
    }
  },

  completeTour: async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nihongo-sensei-tour-completed', '1');
      }
      set({ tourCompleted: true, isTouring: false });
      await senseiApi.completeTour();
    } catch (err) {
      console.warn('Failed to persist tour completion to backend', err);
    }
  },

  skipTour: async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nihongo-sensei-tour-skipped', '1');
      }
      set({ tourSkipped: true, isTouring: false });
      await senseiApi.skipTour();
    } catch (err) {
      console.warn('Failed to persist tour skip to backend', err);
    }
  },

  closeTour: () => set({ isTouring: false }),

  fetchGuidance: async () => {
    try {
      const guidance = await senseiApi.getDailyGuidance();
      set({ dailyGuidance: guidance });
    } catch (err) {
      console.warn('Failed to fetch daily guidance', err);
    }
  }
}));

