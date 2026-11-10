import { create } from 'zustand';
import { senseiApi } from '../api';
import { audioService } from '../services/audioService';
import { SenseiAnimationState } from '../components/sensei/controllers/SenseiAnimationController';
import { useSettingsStore } from './settingsStore';

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
  historyArchive: SenseiMessage[];
  learnerMemory: any | null;
  sessionStartedAt: number;
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
  startFreshSession: (options?: { forceGreeting?: boolean; speak?: boolean }) => Promise<void>;
  sendMessage: (message: string, options?: { skipAutoSpeak?: boolean }) => Promise<any>;
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
  clearHistory: () => Promise<void>;
}

const isQaModeInit = typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).get('dev') === 'true' ||
   new URLSearchParams(window.location.search).get('qa') === 'true');

const MULTILINGUAL_GREETINGS: Record<string, string[]> = {
  ta: [
    "こんにちは！(Konnichiwa!) இன்று நாம் மகிழ்ச்சியாக ஜப்பானிய மொழியை படிப்போம்! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) ஜப்பானிய இலக்கணம் மற்றும் சொற்களை கற்க நீங்கள் தயாரா? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) இன்று நாம் புதிய பாடங்களை கற்று அசத்துவோம்! 🎌 がんばって！"
  ],
  hi: [
    "こんにちは！(Konnichiwa!) आज हम पूरी लगन से जापानी सीखेंगे! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) क्या आप मेरे साथ जापानी व्याकरण का अभ्यास करने के लिए तैयार हैं? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) चलिए आज कुछ नया और रोमांचक सीखते हैं! 🎌 がんばって！"
  ],
  es: [
    "こんにちは！(Konnichiwa!) ¡Vamos a dar lo mejor aprendiendo japonés hoy! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) ¿Listo para practicar gramática y vocabulario japonés? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) ¡Hana-sensei está aquí para ayudarte a aprender! 🎌 がんばって！"
  ],
  fr: [
    "こんにちは！(Konnichiwa!) Donnons le meilleur de nous-mêmes aujourd'hui ! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) Prêt à étudier le japonais avec moi ? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) Faisons de grands progrès en japonais aujourd'hui ! 🎌 がんばって！"
  ],
  de: [
    "こんにちは！(Konnichiwa!) Geben wir heute unser Bestes beim Japanischlernen! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) Bereit, Grammatik und Vokabeln zu üben? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) Lass uns heute tolle Fortschritte machen! 🎌 がんばって！"
  ],
  ko: [
    "こんにちは！(Konnichiwa!) 오늘도 함께 즐겁게 일본어를 공부해봐요! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) 오늘 일본어 문법과 단어 연습 준비되셨나요? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) 한 걸음씩 꾸준히 마스터해봐요! 🎌 がんばって！"
  ],
  zh: [
    "こんにちは！(Konnichiwa!) 今天也一起加油学日语吧！🌸 がんばって！",
    "こんにちは！(Konnichiwa!) 准备好和我一起练习日语语法和词汇了吗？✨ がんばって！",
    "こんにちは！(Konnichiwa!) 一步一个脚印，今天也会有很大进步！🎌 がんばって！"
  ],
  en: [
    "こんにちは！(Konnichiwa!) Let's do our best studying Japanese today! 🌸 がんばって！",
    "こんにちは！(Konnichiwa!) Ready to practice grammar and vocabulary with me? ✨ がんばって！",
    "こんにちは！(Konnichiwa!) Sensei is here! What would you like to master today? 🎌 がんばって！"
  ]
};

const MULTILINGUAL_CELEBRATIONS: Record<string, string> = {
  ta: "素晴らしい！(Subarashii!) மிக அருமையான முன்னேற்றம்! தொடர்ந்து முன்னேறுங்கள்! 🎉✨",
  hi: "素晴らしい！(Subarashii!) बहुत ही शानदार काम! ऐसे ही आगे बढ़ते रहिए! 🎉✨",
  es: "素晴らしい！(Subarashii!) ¡Excelente trabajo! ¡Sigue con ese increíble ritmo! 🎉✨",
  fr: "素晴らしい！(Subarashii!) Travail remarquable ! Continue comme ça ! 🎉✨",
  de: "素晴らしい！(Subarashii!) Fantastische Arbeit! Mach weiter so! 🎉✨",
  ko: "素晴らしい！(Subarashii!) 대단해요! 정말 훌륭하게 해냈어요! 계속 전진해요! 🎉✨",
  zh: "素晴らしい！(Subarashii!) 太棒了！请继续保持这样出色的表现！🎉✨",
  en: "素晴らしい！(Subarashii!) Incredible work! Keep up the amazing momentum! 🎉✨"
};

export const useSenseiStore = create<SenseiState>((set, get) => ({
  isOpen: false,
  isTouring: false,
  isTyping: false,
  companionMode: 'minimized',
  speechState: 'idle',
  animationState: 'idle',
  messages: [],
  historyArchive: [],
  learnerMemory: null,
  sessionStartedAt: Date.now(),
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
      const reversed = history.reverse() || [];
      set({ historyArchive: reversed });

      // If active session is empty, start a clean fresh session rather than displaying 50 old messages!
      if (get().messages.length === 0) {
        await get().startFreshSession({ speak: false });
      }
    } catch (err) {
      console.error('Failed to fetch sensei history:', err);
      if (get().messages.length === 0) {
        await get().startFreshSession({ speak: false });
      }
    }
  },

  startFreshSession: async (options?: { forceGreeting?: boolean; speak?: boolean }) => {
    try {
      const explanationLanguage = useSettingsStore.getState().explanationLanguage || useSettingsStore.getState().displayLanguage || 'en';
      const memoryRes = await senseiApi.getLearnerMemory(explanationLanguage);

      const greetingContent = memoryRes?.freshGreeting || "こんにちは！(Konnichiwa!) Welcome back to class! 🌸 Ready for today's Japanese practice? What would you like to master today? ✨";

      const freshMsg: SenseiMessage = {
        id: `fresh-session-${Date.now()}`,
        role: 'assistant',
        content: greetingContent,
        emotion: 'happy'
      };

      set({
        messages: [freshMsg],
        learnerMemory: memoryRes?.memory || null,
        sessionStartedAt: Date.now(),
        speechState: 'waving',
        animationState: 'waving'
      });

      // Briefly wave, then transition to idle
      setTimeout(() => {
        if (get().animationState === 'waving') {
          set({ animationState: 'idle', speechState: 'idle' });
        }
      }, 1500);

      // Auto-speak greeting if speech is enabled and requested
      if (get().speechEnabled && options?.speak) {
        get().stopSpeech();
        set({ speechState: 'speaking', animationState: 'speaking' });
        audioService.speak(greetingContent, {
          onStart: () => set({ speechState: 'speaking', animationState: 'speaking' }),
          onEnd: () => set({ speechState: 'idle', animationState: 'idle' }),
          onError: () => set({ speechState: 'idle', animationState: 'idle' })
        });
      }
    } catch (err) {
      console.error('Failed to start fresh session:', err);
      const fallbackMsg: SenseiMessage = {
        id: `fresh-session-${Date.now()}`,
        role: 'assistant',
        content: "こんにちは！(Konnichiwa!) Welcome back to class! 🌸 What Japanese topic shall we explore today?",
        emotion: 'happy'
      };
      set({
        messages: [fallbackMsg],
        sessionStartedAt: Date.now(),
        speechState: 'idle',
        animationState: 'idle'
      });
    }
  },

  clearHistory: async () => {
    try {
      await senseiApi.clearHistory();
    } catch (err) {
      console.error('Failed to clear sensei history:', err);
    }
    set({ messages: [], historyArchive: [], speechState: 'idle', animationState: 'idle' });
    await get().startFreshSession({ speak: false });
  },

  sendMessage: async (message: string, options?: { skipAutoSpeak?: boolean }) => {
    if (!message.trim()) return null;

    const tempId = Date.now().toString();
    const userMsg: SenseiMessage = { id: tempId, role: 'user', content: message };

    set(state => ({
      messages: [...state.messages, userMsg],
      historyArchive: [...state.historyArchive, userMsg],
      isTyping: true,
      speechState: 'thinking',
      animationState: 'thinking'
    }));

    try {
      const explanationLanguage = useSettingsStore.getState().explanationLanguage || useSettingsStore.getState().displayLanguage || 'en';
      const isSessionStart = get().messages.length <= 2;
      const res = await senseiApi.chat(message, explanationLanguage);
      const { message: reply, emotion, animation, action } = res;

      const nextAnim: SenseiAnimationState =
        animation ||
        (emotion === 'happy' ? 'happy' :
        emotion === 'celebrating' ? 'celebrating' :
        emotion === 'error' ? 'error' :
        emotion === 'encouraging' ? 'encouraging' :
        emotion === 'thinking' ? 'thinking' : 'idle');

      const assistantMsg: SenseiMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: reply,
        emotion,
        action
      };

      set(state => ({
        messages: [...state.messages, assistantMsg],
        historyArchive: [...state.historyArchive, assistantMsg],
        isTyping: false,
        speechState: nextAnim,
        animationState: nextAnim,
        emotion: emotion || 'neutral'
      }));

      // Trigger targeted guidance if action provides a target element
      if (action?.targetId) {
        get().guideTo(action.targetId);
      }

      // Speak if enabled and not explicitly skipped (e.g. silent floating companion chat)
      if (get().speechEnabled && reply && !options?.skipAutoSpeak) {
        get().stopSpeech();

        // Immediately switch state so 3D character and speaking pill animate without waiting for speech pipeline delay
        set({ speechState: 'speaking', animationState: 'speaking' });

        audioService.speak(reply, {
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
      const errorMsg: SenseiMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, my connection is a bit fuzzy right now! 🌸',
        emotion: 'sad'
      };
      set(state => ({
        messages: [...state.messages, errorMsg],
        historyArchive: [...state.historyArchive, errorMsg],
        isTyping: false,
        speechState: 'error',
        animationState: 'error'
      }));
      return null;
    }
  },

  executeAction: (action, navigate) => {
    if (!action) return;

    const allowedPrefixes = ['/dashboard', '/lessons', '/kanji', '/vocabulary', '/review', '/reading', '/settings', '/sensei', '/dictionary'];

    if (action.type === 'navigate' && action.payload?.path) {
      let path = action.payload.path;
      if (path.startsWith('/quiz') || path.startsWith('/lessons')) {
        path = '/reading';
      }
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
        const targetPath = action.path.startsWith('/quiz') ? '/reading' : action.path;
        navigate(targetPath);
      }
    } else if (action.type === 'suggest_lesson' && action.payload?.lessonId) {
      navigate('/reading');
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
    const rawLang = useSettingsStore.getState().explanationLanguage || useSettingsStore.getState().displayLanguage || 'en';
    const langKey = String(rawLang).slice(0, 2).toLowerCase();
    const greetings = MULTILINGUAL_GREETINGS[langKey] || MULTILINGUAL_GREETINGS['en'];
    const phrase = greetings[Math.floor(Math.random() * greetings.length)];

    const greetMessage: SenseiMessage = {
      id: `greet-${Date.now()}`,
      role: 'assistant',
      content: phrase,
      emotion: 'happy'
    };

    set(state => ({
      messages: [...state.messages, greetMessage],
      historyArchive: [...state.historyArchive, greetMessage],
      animationState: 'waving',
      speechState: 'waving'
    }));

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
    const rawLang = useSettingsStore.getState().explanationLanguage || useSettingsStore.getState().displayLanguage || 'en';
    const langKey = String(rawLang).slice(0, 2).toLowerCase();
    let praise = MULTILINGUAL_CELEBRATIONS[langKey] || MULTILINGUAL_CELEBRATIONS['en'];
    if (reason) {
      praise = `素晴らしい！(Subarashii!) ${reason} 🎉✨`;
    }

    const celebMessage: SenseiMessage = {
      id: `celebrate-${Date.now()}`,
      role: 'assistant',
      content: praise,
      emotion: 'celebrating'
    };

    set(state => ({
      messages: [...state.messages, celebMessage],
      historyArchive: [...state.historyArchive, celebMessage],
      companionMode: 'celebration',
      animationState: 'celebrating',
      speechState: 'celebrating'
    }));

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

