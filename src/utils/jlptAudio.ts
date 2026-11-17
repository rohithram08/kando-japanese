// src/utils/jlptAudio.ts
// ─────────────────────────────────────────────────────────────────────────────
// Authentic JLPT Audio Engine: Procedural Chime & Japanese Dialogue TTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Procedural Web Audio API synthesis of the iconic JLPT Exam Chime
 * (Authentic Japanese 4-bell announcement chime: G4 -> B4 -> D5 -> G5)
 */
export function playJlptChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 4 bell chime frequencies (Hz) & start offsets (sec)
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.9 }, // C5
        { freq: 659.25, time: 0.35, dur: 0.9 }, // E5
        { freq: 783.99, time: 0.7, dur: 1.0 }, // G5
        { freq: 1046.5, time: 1.1, dur: 1.4 }, // C6
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
      masterGain.connect(ctx.destination);

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        // Add harmonic overtone
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime + time);

        // Percussive bell envelope: instant attack, exponential decay
        const startTime = ctx.currentTime + time;
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.7, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        overtoneGain.gain.setValueAtTime(0, startTime);
        overtoneGain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, startTime + dur * 0.7);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        overtone.connect(overtoneGain);
        overtoneGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + dur);
        overtone.start(startTime);
        overtone.stop(startTime + dur);
      });

      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
        resolve();
      }, 2600);
    } catch (e) {
      console.warn('[jlptAudio] AudioContext unavailable:', e);
      resolve();
    }
  });
}

/**
 * Web Speech API Japanese Text-to-Speech Engine
 */
let cachedVoices: SpeechSynthesisVoice[] = [];
let activeUtterance: SpeechSynthesisUtterance | null = null;
let speechFallbackTimer: ReturnType<typeof setTimeout> | null = null;
let speechKeepAliveInterval: ReturnType<typeof setInterval> | null = null;

export function getJapaneseVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  if (cachedVoices.length > 0) return cachedVoices;

  const allVoices = window.speechSynthesis.getVoices();
  cachedVoices = allVoices.filter(
    (v) => v.lang.startsWith('ja') || v.lang.includes('JP') || v.lang.includes('Japanese')
  );

  return cachedVoices;
}

export function speakJapaneseLine({
  text,
  rate = 0.85,
  gender = 'female',
  onStart,
  onEnd,
  onError,
}: {
  text: string;
  rate?: number;
  gender?: 'male' | 'female';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return null;
  }

  // Clear previous timers & cancel any ongoing speech
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  // Pin to window to prevent V8 GC bug
  if (typeof window !== 'undefined') {
    (window as unknown as { __kandoSpeechUtterance: SpeechSynthesisUtterance }).__kandoSpeechUtterance = utterance;
  }

  utterance.lang = 'ja-JP';
  utterance.rate = Math.max(0.6, Math.min(rate, 1.4));
  utterance.pitch = gender === 'female' ? 1.15 : 0.9;

  const voices = getJapaneseVoices();
  if (voices.length > 0) {
    // Prefer matching gender if voice names hint at it
    const preferredVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      return gender === 'female'
        ? name.includes('female') || name.includes('kyoko') || name.includes('haruka') || name.includes('sayaka')
        : name.includes('male') || name.includes('oto') || name.includes('kenji');
    });
    utterance.voice = preferredVoice || voices[0];
  }

  let ended = false;
  const cleanup = () => {
    if (speechFallbackTimer) {
      clearTimeout(speechFallbackTimer);
      speechFallbackTimer = null;
    }
    if (speechKeepAliveInterval) {
      clearInterval(speechKeepAliveInterval);
      speechKeepAliveInterval = null;
    }
    activeUtterance = null;
  };

  const handleEnd = () => {
    if (ended) return;
    ended = true;
    cleanup();
    if (onEnd) onEnd();
  };

  const handleError = (e: unknown) => {
    if (ended) return;
    ended = true;
    cleanup();
    if (onError) onError(e);
    else if (onEnd) onEnd();
  };

  utterance.onstart = () => {
    if (onStart) onStart();

    // Chromium anti-pause keepalive: Chromium pauses synthesis after 15s without resume
    if (speechKeepAliveInterval) clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  };

  utterance.onend = handleEnd;
  utterance.onerror = handleError;

  // Fallback safety timeout based on text length: ensures dialogue sequence never hangs indefinitely
  const estimatedMs = Math.max(2500, (text.length * 480) / utterance.rate) + 1800;
  speechFallbackTimer = setTimeout(() => {
    if (!ended) {
      handleEnd();
    }
  }, estimatedMs);

  // Resume context if paused before speaking
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (speechFallbackTimer) {
    clearTimeout(speechFallbackTimer);
    speechFallbackTimer = null;
  }
  if (speechKeepAliveInterval) {
    clearInterval(speechKeepAliveInterval);
    speechKeepAliveInterval = null;
  }
  activeUtterance = null;

  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
