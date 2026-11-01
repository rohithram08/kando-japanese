import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { learningAttempts } from '../db/schema.js';

export interface AttemptInput {
  itemType: string;
  itemId: string;
  correct: boolean;
  quality?: number;
  responseMs?: number;
  modality?: string;
}

/** Hour (0-23) in an IANA timezone; falls back to UTC for an invalid zone. */
export function localHourIn(timezone: string, now: Date = new Date()): number {
  try {
    const h = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(now);
    return Number(h) % 24;
  } catch {
    return now.getUTCHours();
  }
}

/** Best-effort analytics write: never lets logging break the learner's actual action. */
export async function recordAttempts(userId: string, attempts: AttemptInput[], timezone: string): Promise<void> {
  if (!attempts.length) return;
  const hour = localHourIn(timezone);
  await db.insert(learningAttempts).values(attempts.map((a) => ({
    id: uuidv4(), userId, itemType: a.itemType, itemId: a.itemId, correct: a.correct,
    quality: a.quality ?? null, responseMs: a.responseMs ?? null, modality: a.modality ?? 'recall', localHour: hour,
  })));
}
