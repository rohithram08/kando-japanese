// src/utils/confettiHelper.ts
import confetti from 'canvas-confetti';

let lastConfettiTime = 0;
const RATE_LIMIT_MS = 2500;

/**
 * Triggers celebratory confetti with strict rate-limiting (max once per 2.5s)
 * and automatic reduced-motion suppression.
 */
export function triggerRateLimitedConfetti(options: confetti.Options = {}) {
  const now = Date.now();
  if (now - lastConfettiTime < RATE_LIMIT_MS) {
    return;
  }
  lastConfettiTime = now;

  try {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      disableForReducedMotion: true,
      colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#ef4444'],
      ...options,
    });
  } catch {
    // Graceful fallback for SSR or test environments
  }
}
