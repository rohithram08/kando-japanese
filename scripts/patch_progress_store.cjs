const fs = require('fs');
let code = fs.readFileSync('src/store/progressStore.ts', 'utf8');

// 1. Add interface methods
const targetInterface = 'isQuizXPClaimed: (storyId: string) => boolean;';
const newInterface = targetInterface + '\n  streakFreezes: number;\n  isStreakFrozen: boolean;\n  equipStreakFreeze: (count?: number) => void;\n  useStreakFreeze: () => boolean;\n  checkAndMaintainStreak: () => { streak: number; preservedWithFreeze: boolean };';
code = code.replace(targetInterface, newInterface);

// 2. Add helper getDayDiff
const helperTarget = 'function getLocalDayString(): string {';
const helperCode = `function getDayDiff(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1 + 'T00:00:00');
    const d2 = new Date(dateStr2 + 'T00:00:00');
    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

` + helperTarget;
code = code.replace(helperTarget, helperCode);

// 3. Add initial state
const stateTarget = 'streak: 0,';
const stateCode = `streak: 0,
  streakFreezes: (() => {
    try {
      const stored = localStorage.getItem('nihongo_streak_freezes');
      return stored !== null ? Math.max(0, parseInt(stored, 10)) : 2;
    } catch {
      return 2;
    }
  })(),
  isStreakFrozen: (() => {
    try {
      return localStorage.getItem('nihongo_streak_frozen_today') === 'true';
    } catch {
      return false;
    }
  })(),`;
code = code.replace(stateTarget, stateCode);

// 4. Add methods
const methodsTarget = 'updateStreak: async (userId) => {';
const methodsCode = `equipStreakFreeze: (count = 1) => {
    const updated = Math.max(0, get().streakFreezes + count);
    try {
      localStorage.setItem('nihongo_streak_freezes', String(updated));
    } catch {}
    set({ streakFreezes: updated });
  },

  useStreakFreeze: () => {
    const current = get().streakFreezes;
    if (current <= 0) return false;
    const updated = current - 1;
    try {
      localStorage.setItem('nihongo_streak_freezes', String(updated));
      localStorage.setItem('nihongo_streak_frozen_today', 'true');
    } catch {}
    set({ streakFreezes: updated, isStreakFrozen: true });
    return true;
  },

  checkAndMaintainStreak: () => {
    const today = getLocalDayString();
    let lastDate: string | null = null;
    try {
      lastDate = localStorage.getItem('nihongo_last_streak_date');
    } catch {}

    if (!lastDate) {
      return { streak: get().streak, preservedWithFreeze: false };
    }

    const diffDays = getDayDiff(today, lastDate);
    if (diffDays <= 1) {
      return { streak: get().streak, preservedWithFreeze: false };
    }

    if (diffDays === 2) {
      if (get().streakFreezes > 0) {
        const remaining = get().streakFreezes - 1;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        try {
          localStorage.setItem('nihongo_streak_freezes', String(remaining));
          localStorage.setItem('nihongo_last_streak_date', yesterday);
          localStorage.setItem('nihongo_streak_frozen_today', 'true');
        } catch {}
        set({ streakFreezes: remaining, isStreakFrozen: true });
        return { streak: get().streak, preservedWithFreeze: true };
      }
    }

    try {
      localStorage.removeItem('nihongo_last_streak_date');
      localStorage.setItem('nihongo_streak_frozen_today', 'false');
    } catch {}
    set({ streak: 0, isStreakFrozen: false });
    return { streak: 0, preservedWithFreeze: false };
  },

  ` + methodsTarget;
code = code.replace(methodsTarget, methodsCode);

fs.writeFileSync('src/store/progressStore.ts', code, 'utf8');
console.log('Successfully updated progressStore.ts with streak freeze & maintenance logic!');
