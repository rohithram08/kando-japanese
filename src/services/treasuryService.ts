// src/services/treasuryService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Treasury Challenge & Weekly Treasury Box Opening Engine
// Handles weekly eligibility, waterfall drop rates, question bank, and streak freezing
// ─────────────────────────────────────────────────────────────────────────────

export interface TreasuryReward {
  freezes: number;
  tier: 'jackpot' | 'epic' | 'rare' | 'common' | 'basic' | 'miss';
  tierName: string;
  title: string;
  message: string;
  icon: string;
  rarityBadge: string;
}

export interface TreasuryQuestion {
  id: string;
  category: 'kanji' | 'vocab' | 'grammar' | 'expression';
  prompt: string;
  japanese: string;
  furigana?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const TREASURY_STORAGE_KEYS = {
  LAST_CLAIMED: 'nihongo_treasury_last_claimed',
  LAST_WEEK_KEY: 'nihongo_treasury_last_week_key',
  BROKEN_STREAK: 'nihongo_broken_streak',
};

/**
 * Calculates standard ISO-8601 week key (e.g. "2026-W44").
 * Week starts on Monday.
 */
export function getTreasuryWeekKey(d: Date = new Date()): string {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setUTCDate(target.getUTCDate() - dayNumber + 3); // Nearest Thursday
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  const year = new Date(firstThursday).getUTCFullYear();
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
}

/**
 * Checks if the Treasury Challenge is available to play this week.
 * Available only once per calendar week (resets every Monday 00:00).
 */
export function isTreasuryChallengeAvailable(
  lastClaimedIso?: string | null,
  now: Date = new Date()
): boolean {
  if (!lastClaimedIso) return true;
  try {
    const lastClaimedDate = new Date(lastClaimedIso);
    if (isNaN(lastClaimedDate.getTime())) return true;
    const currentWeekKey = getTreasuryWeekKey(now);
    const claimedWeekKey = getTreasuryWeekKey(lastClaimedDate);
    return currentWeekKey !== claimedWeekKey;
  } catch {
    return true;
  }
}

/**
 * Calculates time remaining until the next Monday 00:00 local time.
 */
export function getTimeUntilTreasuryReset(now: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  formatted: string;
} {
  const nextMonday = new Date(now);
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday
  const daysUntilMonday = currentDay === 0 ? 1 : 8 - currentDay;
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const diffMs = Math.max(0, nextMonday.getTime() - now.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const formatted =
    days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return { days, hours, minutes, formatted };
}

/**
 * Rolls for streak freezes upon opening the Treasury Box based on exact user specification:
 * - 5% chance to get 5 freeze max
 * - 15% chance to get 4
 * - 25% chance to get 3
 * - 50% chance to get 2
 * - and then 99% chance to get 1 and 1% chance to get better luck next time
 *
 * An optional rng function (default Math.random) allows deterministic testing.
 */
export function rollTreasuryFreezeReward(
  rng: () => number = Math.random
): TreasuryReward {
  // 1. 5% chance to get 5 freeze max (Jackpot!)
  if (rng() < 0.05) {
    return {
      freezes: 5,
      tier: 'jackpot',
      tierName: 'Jackpot',
      title: '🌟 JACKPOT! 5 Jelly Freezes!',
      message: 'Unbelievable fortune! You unlocked the maximum 5 Jelly Freezes!',
      icon: '🌟',
      rarityBadge: '5% MAX DROP',
    };
  }

  // 2. 15% chance to get 4
  if (rng() < 0.15) {
    return {
      freezes: 4,
      tier: 'epic',
      tierName: 'Epic',
      title: '💎 EPIC DROP! 4 Jelly Freezes!',
      message: 'Incredible pull! 4 Jelly Freezes are now ready to guard your streak!',
      icon: '💎',
      rarityBadge: '15% EPIC',
    };
  }

  // 3. 25% chance to get 3
  if (rng() < 0.25) {
    return {
      freezes: 3,
      tier: 'rare',
      tierName: 'Rare',
      title: '❄️ GREAT LOOT! 3 Jelly Freezes!',
      message: 'Great haul! 3 Jelly Freezes added directly to your inventory!',
      icon: '❄️',
      rarityBadge: '25% RARE',
    };
  }

  // 4. 50% chance to get 2
  if (rng() < 0.50) {
    return {
      freezes: 2,
      tier: 'common',
      tierName: 'Common',
      title: '❄️ NICE HAUL! 2 Jelly Freezes!',
      message: 'Superb! 2 Jelly Freezes are safely stored in your shield pack!',
      icon: '❄️',
      rarityBadge: '50% WIN',
    };
  }

  // 5. and then 99% chance to get 1, and 1% chance to get better luck next time
  if (rng() < 0.99) {
    return {
      freezes: 1,
      tier: 'basic',
      tierName: 'Standard',
      title: '❄️ LUCKY! 1 Jelly Freeze!',
      message: 'You won 1 Jelly Freeze! Your daily streak has an extra shield.',
      icon: '❄️',
      rarityBadge: '99% DROP',
    };
  }

  // 1% chance: Better luck next time
  return {
    freezes: 0,
    tier: 'miss',
    tierName: 'Try Again',
    title: '🍀 Better Luck Next Time!',
    message: 'The treasury box held no freezes this week! Keep up your daily studies and try again next week!',
    icon: '🍀',
    rarityBadge: '1% RARE MISS',
  };
}

/**
 * Curated pool of interactive JLPT mini-challenge questions for the Treasury Challenge.
 */
export const TREASURY_QUESTIONS: TreasuryQuestion[] = [
  {
    id: 'tq_1',
    category: 'kanji',
    prompt: 'What does this kanji mean in Japanese?',
    japanese: '氷',
    furigana: 'こおり (koori)',
    choices: ['Ice / Freeze', 'Fire', 'Water', 'Tree'],
    correctIndex: 0,
    explanation: '氷 (こおり) means ice or freeze — the power source of your Jelly Freeze!',
  },
  {
    id: 'tq_2',
    category: 'vocab',
    prompt: 'Choose the correct reading for this word:',
    japanese: '友達',
    furigana: 'Friend',
    choices: ['ともだち (tomodachi)', 'せんせい (sensei)', 'がくせい (gakusei)', 'かぞく (kazoku)'],
    correctIndex: 0,
    explanation: '友達 is read as ともだち (tomodachi) and means "friend".',
  },
  {
    id: 'tq_3',
    category: 'grammar',
    prompt: 'Fill in the blank with the correct particle:',
    japanese: '図書館[ ? ] 勉強します。',
    furigana: 'としょかんで べんきょうします',
    choices: ['で (de)', 'に (ni)', 'を (wo)', 'へ (he)'],
    correctIndex: 0,
    explanation: 'The particle で marks the location where an action (勉強します) takes place.',
  },
  {
    id: 'tq_4',
    category: 'expression',
    prompt: 'What does this common greeting mean?',
    japanese: '元気ですか。',
    furigana: 'げんきですか (genki desu ka)',
    choices: ['How are you? / Are you well?', 'Good morning', 'Thank you', 'Goodbye'],
    correctIndex: 0,
    explanation: '元気ですか (genki desu ka) is used to ask "How are you?" or "Are you well?".',
  },
  {
    id: 'tq_5',
    category: 'vocab',
    prompt: 'What is the Japanese word for "Every day"?',
    japanese: '毎日',
    furigana: 'Every day',
    choices: ['まいにち (mainichi)', 'まいあさ (maiasa)', 'まいばん (maiban)', 'きょう (kyou)'],
    correctIndex: 0,
    explanation: '毎日 is read as まいにち (mainichi) and means "every day".',
  },
  {
    id: 'tq_6',
    category: 'kanji',
    prompt: 'Which kanji represents "Book / Origin"?',
    japanese: 'ほん (Hon)',
    furigana: 'Reading: ほん',
    choices: ['本', '日', '木', '人'],
    correctIndex: 0,
    explanation: '本 means "book" or "origin" and is read as ほん (hon).',
  },
  {
    id: 'tq_7',
    category: 'grammar',
    prompt: 'Fill in the blank to indicate destination:',
    japanese: '学校[ ? ] 行きます。',
    furigana: 'がっこうへ いきます',
    choices: ['へ (he / e)', 'で (de)', 'から (kara)', 'と (to)'],
    correctIndex: 0,
    explanation: 'へ marks the destination or direction of motion (行きます).',
  },
  {
    id: 'tq_8',
    category: 'expression',
    prompt: 'What do you say before starting a meal in Japan?',
    japanese: 'いただきます。',
    furigana: 'Itadakimasu',
    choices: ['いただきます (I humbly receive)', 'ごちそうさま (Thank you for the meal)', 'いってきます (I am leaving)', 'ただいま (I am home)'],
    correctIndex: 0,
    explanation: 'いただきます (itadakimasu) is the polite expression said before eating a meal.',
  },
];

/**
 * Selects 3 random questions from the pool for a challenge attempt.
 */
export function getTreasuryChallengeQuestions(count = 3): TreasuryQuestion[] {
  const shuffled = [...TREASURY_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
