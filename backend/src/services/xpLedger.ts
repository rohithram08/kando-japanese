/**
 * XP Ledger
 *
 * Append-only log of every XP award (`xp_events`). `users.xp_points` remains the
 * fast running total shown in the UI; the ledger is the auditable record that
 * weekly leagues, rival battles and anti-cheat checks are built on.
 *
 * Writes are best-effort: the XP has already been granted when we get here, so a
 * failed ledger insert is logged and swallowed rather than failing the user's request.
 */

import { randomUUID } from 'node:crypto';
import { and, desc, eq, gte, lt, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { xpEvents } from '../db/schema.js';
import { touchLeagueQuietly } from './leagueService.js';

export type XpSource =
  | 'lesson'
  | 'streak_bonus'
  | 'kanji'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'reading_quiz'
  | 'srs_review'
  | 'event';

export interface XpEventOptions {
  /** Content / lesson / story id the XP was earned on. */
  refId?: string | null;
  /** Active study minutes attributable to this event. */
  minutes?: number;
}

/** Validates and normalises an award. Returns null when nothing should be recorded. */
export function normalizeXpEvent(
  amount: number,
  source: XpSource,
  options: XpEventOptions = {},
): { amount: number; source: XpSource; refId: string | null; minutes: number } | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const minutes = Number.isFinite(options.minutes) ? Math.max(0, Math.round(options.minutes!)) : 0;
  return {
    amount: Math.round(amount),
    source,
    refId: options.refId ? String(options.refId).slice(0, 100) : null,
    minutes,
  };
}

export async function recordXpEvent(
  userId: string,
  amount: number,
  source: XpSource,
  options: XpEventOptions = {},
): Promise<void> {
  const event = normalizeXpEvent(amount, source, options);
  if (!event) return;
  try {
    // Explicit client-side timestamp (not the DB's now()) so ledger rows and league week windows
    // are always interpreted in the same timezone, whatever the database server is set to.
    const createdAt = new Date();
    await db.insert(xpEvents).values({ id: randomUUID(), userId, ...event, createdAt });
    // First XP of the week enters the learner into their league (cached, never throws).
    await touchLeagueQuietly(userId, createdAt);
  } catch (err) {
    console.error('[xpLedger] failed to record xp event', { userId, source, amount: event.amount, err });
  }
}

export interface XpWindowTotals {
  xp: number;
  minutes: number;
  events: number;
}

/** Total XP / minutes earned by a user in [from, to). */
export async function sumXp(userId: string, from: Date, to: Date): Promise<XpWindowTotals> {
  const [row] = await db
    .select({
      xp: sql<number>`coalesce(sum(${xpEvents.amount}), 0)`,
      minutes: sql<number>`coalesce(sum(${xpEvents.minutes}), 0)`,
      events: sql<number>`count(*)`,
    })
    .from(xpEvents)
    .where(and(eq(xpEvents.userId, userId), gte(xpEvents.createdAt, from), lt(xpEvents.createdAt, to)));
  return { xp: Number(row?.xp ?? 0), minutes: Number(row?.minutes ?? 0), events: Number(row?.events ?? 0) };
}

/** Most recent ledger entries for a user (newest first). */
export async function getRecentXpEvents(userId: string, limit = 50) {
  return db
    .select({
      id: xpEvents.id,
      amount: xpEvents.amount,
      source: xpEvents.source,
      refId: xpEvents.refId,
      minutes: xpEvents.minutes,
      createdAt: xpEvents.createdAt,
    })
    .from(xpEvents)
    .where(eq(xpEvents.userId, userId))
    .orderBy(desc(xpEvents.createdAt))
    .limit(Math.min(Math.max(1, Math.floor(limit)), 200));
}
