/**
 * League service (database layer). Rules and constants live in leagueRules.ts.
 *
 * Flow
 *  - A learner is "entered" into the current week the first time they earn XP or open the
 *    league page (touchLeague): they get a rung (membership) and a seat in a cohort.
 *  - The board shows cohort members ranked by league XP computed from the XP ledger.
 *  - When a week ends it is settled exactly once (a database-level lock): ranks are frozen,
 *    top learners move up a rung, bottom learners move down, everyone else stays.
 *  - Settlement is lazy (runs when anyone reads the league) and also on a timer.
 */

import { randomUUID } from 'node:crypto';
import { and, asc, count, desc, eq, gt, inArray, isNull, lte, gte, lt, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { leagueCohorts, leagueEntries, leagueMembership, leagueWeeks, users, xpEvents } from '../db/schema.js';
import { parseAvatarConfig } from './avatarConfig.js';
import {
  COHORT_SIZE, DAILY_XP_CAP, DEMOTE_FRACTION, LEAGUES, MIN_BOARD, MIN_XP_TO_PROMOTE, PROMOTE_FRACTION,
  RUNG_COUNT, TOP_RUNG, botCountFor, botParticipants, computeWeeklyXp, demoteCount, getWeekWindow, outcomeFor,
  promoteCount, rankParticipants, rungInfo, weekWindowFromId, zoneFor, type Participant, type WeekWindow, type WeeklyXp,
} from './leagueRules.js';

type Reader = Pick<typeof db, 'select'>;

// ─── Entering a week ─────────────────────────────────────────────────────────

// Avoids a database round-trip on every XP award once a learner is already entered this week.
const enteredCache = new Set<string>();
function remember(key: string) {
  if (enteredCache.size > 5000) enteredCache.clear();
  enteredCache.add(key);
}
export function _clearLeagueCache() {
  enteredCache.clear();
}

async function ensureWeek(win: WeekWindow): Promise<void> {
  await db
    .insert(leagueWeeks)
    .values({ id: win.id, startsAt: win.start, endsAt: win.end })
    .onDuplicateKeyUpdate({ set: { id: win.id } });
}

async function ensureMembership(userId: string): Promise<number> {
  const existing = await db.select({ rung: leagueMembership.rung }).from(leagueMembership).where(eq(leagueMembership.userId, userId)).limit(1);
  if (existing.length) return existing[0].rung;
  await db.insert(leagueMembership).values({ userId, rung: 0 }).onDuplicateKeyUpdate({ set: { userId } });
  const row = await db.select({ rung: leagueMembership.rung }).from(leagueMembership).where(eq(leagueMembership.userId, userId)).limit(1);
  return row[0]?.rung ?? 0;
}

async function assignCohort(weekId: string, rung: number): Promise<string> {
  const rows = await db
    .select({ id: leagueCohorts.id, n: count(leagueEntries.id) })
    .from(leagueCohorts)
    .leftJoin(leagueEntries, eq(leagueEntries.cohortId, leagueCohorts.id))
    .where(and(eq(leagueCohorts.weekId, weekId), eq(leagueCohorts.rung, rung)))
    .groupBy(leagueCohorts.id)
    .orderBy(asc(leagueCohorts.createdAt), asc(leagueCohorts.id));
  const open = rows.find((r) => Number(r.n) < COHORT_SIZE);
  if (open) return open.id;
  const id = randomUUID();
  await db.insert(leagueCohorts).values({ id, weekId, rung });
  return id;
}

export interface LeagueEntry {
  entryId: string;
  cohortId: string;
  weekId: string;
  rung: number;
}

/** Enters the learner in the current week (idempotent). Returns null for learners who opted out. */
export async function touchLeague(userId: string, now: Date = new Date()): Promise<LeagueEntry | null> {
  const win = getWeekWindow(now);
  const cacheKey = `${userId}:${win.id}`;

  const [u] = await db.select({ optOut: users.leagueOptOut }).from(users).where(eq(users.id, userId)).limit(1);
  if (!u || u.optOut) return null;

  await ensureWeek(win);
  const existing = await db.select().from(leagueEntries).where(and(eq(leagueEntries.weekId, win.id), eq(leagueEntries.userId, userId))).limit(1);
  if (existing.length) {
    remember(cacheKey);
    return { entryId: existing[0].id, cohortId: existing[0].cohortId, weekId: win.id, rung: existing[0].rungStart };
  }

  const rung = await ensureMembership(userId);
  const cohortId = await assignCohort(win.id, rung);
  const entryId = randomUUID();
  try {
    await db.insert(leagueEntries).values({ id: entryId, cohortId, weekId: win.id, userId, rungStart: rung });
  } catch (err: any) {
    if (err?.code !== 'ER_DUP_ENTRY' && err?.errno !== 1062) throw err;
    const again = await db.select().from(leagueEntries).where(and(eq(leagueEntries.weekId, win.id), eq(leagueEntries.userId, userId))).limit(1);
    remember(cacheKey);
    return { entryId: again[0].id, cohortId: again[0].cohortId, weekId: win.id, rung: again[0].rungStart };
  }
  remember(cacheKey);
  return { entryId, cohortId, weekId: win.id, rung };
}

/** Cheap hook for the XP ledger: enters the learner the first time they earn XP in a week. Never throws. */
export async function touchLeagueQuietly(userId: string, now: Date = new Date()): Promise<void> {
  try {
    if (enteredCache.has(`${userId}:${getWeekWindow(now).id}`)) return;
    await touchLeague(userId, now);
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[league] failed to enter learner', { userId, err });
    }
  }
}

// ─── Weekly XP ───────────────────────────────────────────────────────────────

export async function weeklyXpFor(userIds: string[], win: WeekWindow, reader: Reader = db): Promise<Map<string, WeeklyXp>> {
  const out = new Map<string, WeeklyXp>();
  if (!userIds.length) return out;
  const rows = await reader
    .select({ userId: xpEvents.userId, amount: xpEvents.amount, createdAt: xpEvents.createdAt })
    .from(xpEvents)
    .where(and(inArray(xpEvents.userId, userIds), gte(xpEvents.createdAt, win.start), lt(xpEvents.createdAt, win.end)));
  const byUser = new Map<string, Array<{ amount: number; createdAt: Date }>>();
  for (const r of rows) {
    const list = byUser.get(r.userId) ?? [];
    list.push({ amount: r.amount, createdAt: new Date(r.createdAt) });
    byUser.set(r.userId, list);
  }
  for (const id of userIds) out.set(id, computeWeeklyXp(byUser.get(id) ?? []));
  return out;
}

// ─── Reading the board ───────────────────────────────────────────────────────

interface AvatarFields {
  avatarConfig: unknown;
  avatarId: string | null;
  avatarUrl: string | null;
}

function toAvatar(u: AvatarFields) {
  return { avatarConfig: parseAvatarConfig(u.avatarConfig), avatarId: u.avatarId ?? null, avatarUrl: u.avatarUrl ?? null };
}

export const LEAGUE_RULES = {
  cohortSize: COHORT_SIZE,
  minBoard: MIN_BOARD,
  promoteFraction: PROMOTE_FRACTION,
  demoteFraction: DEMOTE_FRACTION,
  minXpToPromote: MIN_XP_TO_PROMOTE,
  dailyXpCap: DAILY_XP_CAP,
};

export const LADDER = LEAGUES.map((l, i) => ({ ...l, order: i, rungs: [3, 2, 1].map((stage, s) => ({ stage, index: i * 3 + s })) }));

export async function getLeagueView(userId: string, now: Date = new Date()) {
  await settleDueWeeks(now);

  const [me] = await db.select({ optOut: users.leagueOptOut }).from(users).where(eq(users.id, userId)).limit(1);
  const win = getWeekWindow(now);
  const base = { ladder: LADDER, rules: LEAGUE_RULES };
  const weekInfo = { id: win.id, startsAt: win.start.toISOString(), endsAt: win.end.toISOString(), secondsLeft: Math.max(0, Math.floor((win.end.getTime() - now.getTime()) / 1000)) };
  if (!me) return { ...base, optedOut: false, week: weekInfo, rung: rungInfo(0), board: null };
  if (me.optOut) return { ...base, optedOut: true, week: weekInfo, rung: rungInfo((await ensureMembership(userId))), board: null };

  const entry = await touchLeague(userId, now);
  if (!entry) return { ...base, optedOut: true, week: weekInfo, rung: rungInfo(0), board: null };

  const members = await db
    .select({
      userId: users.id, username: users.username, avatarConfig: users.avatarConfig, avatarId: users.avatarId, avatarUrl: users.avatarUrl,
    })
    .from(leagueEntries)
    .innerJoin(users, eq(users.id, leagueEntries.userId))
    .where(eq(leagueEntries.cohortId, entry.cohortId));

  const xpMap = await weeklyXpFor(members.map((m) => m.userId), win);
  const real: Participant[] = members.map((m) => ({
    key: `user:${m.userId}`, userId: m.userId, isBot: false, name: m.username,
    xp: xpMap.get(m.userId)?.xp ?? 0, reachedAt: xpMap.get(m.userId)?.reachedAt ?? 0,
  }));
  const fraction = (now.getTime() - win.start.getTime()) / (win.end.getTime() - win.start.getTime());
  const bots = botParticipants(entry.cohortId, entry.rung, botCountFor(real.length), fraction);
  const ranked = rankParticipants([...real, ...bots]);
  const n = ranked.length;

  const avatarByUser = new Map(members.map((m) => [m.userId, toAvatar(m)]));
  const standings = ranked.map((p) => ({
    rank: p.rank,
    userId: p.userId,
    isBot: p.isBot,
    name: p.name,
    xp: p.xp,
    isYou: p.userId === userId,
    zone: zoneFor(p.rank, n, entry.rung),
    avatar: p.isBot ? { avatarConfig: p.avatar ?? null, avatarId: null, avatarUrl: null } : avatarByUser.get(p.userId!)!,
  }));

  const mine = standings.find((s) => s.isYou)!;
  const above = standings[mine.rank - 2];
  const cutoff = standings[promoteCount(n) - 1];
  const promotable = entry.rung < TOP_RUNG;
  return {
    ...base,
    optedOut: false,
    week: weekInfo,
    rung: rungInfo(entry.rung),
    board: {
      cohortId: entry.cohortId,
      size: n,
      realCount: real.length,
      promoteCount: promotable ? promoteCount(n) : 0,
      demoteCount: entry.rung > 0 ? demoteCount(n) : 0,
      standings,
      you: {
        rank: mine.rank,
        xp: mine.xp,
        zone: mine.zone,
        xpToNextRank: above ? Math.max(1, above.xp - mine.xp + 1) : null,
        xpToPromotion: promotable && mine.rank > promoteCount(n) ? Math.max(1, cutoff.xp - mine.xp + 1) : null,
        meetsMinXp: mine.xp >= MIN_XP_TO_PROMOTE,
      },
    },
  };
}

export async function getHistory(userId: string, limit = 10) {
  const rows = await db
    .select({ weekId: leagueEntries.weekId, rungStart: leagueEntries.rungStart, rank: leagueEntries.rank, xp: leagueEntries.xp, outcome: leagueEntries.outcome })
    .from(leagueEntries)
    .where(and(eq(leagueEntries.userId, userId), sql`${leagueEntries.outcome} is not null`))
    .orderBy(desc(leagueEntries.weekId))
    .limit(Math.min(Math.max(1, Math.floor(limit)), 52));
  return rows.map((r) => ({ ...r, rung: rungInfo(r.rungStart) }));
}

/** All-time leaderboard by total XP (learners who opted out are never shown). */
export async function getGlobalBoard(userId: string, limit = 25) {
  const top = await db
    .select({ userId: users.id, username: users.username, xp: users.xpPoints, avatarConfig: users.avatarConfig, avatarId: users.avatarId, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.leagueOptOut, false))
    .orderBy(desc(users.xpPoints), asc(users.createdAt))
    .limit(Math.min(Math.max(1, Math.floor(limit)), 100));
  const entries = top.map((u, i) => ({ rank: i + 1, userId: u.userId, name: u.username, xp: u.xp ?? 0, isYou: u.userId === userId, avatar: toAvatar(u) }));

  let you: { rank: number; xp: number } | null = null;
  const inTop = entries.find((e) => e.isYou);
  if (inTop) {
    you = { rank: inTop.rank, xp: inTop.xp };
  } else {
    const [row] = await db.select({ xp: users.xpPoints, optOut: users.leagueOptOut }).from(users).where(eq(users.id, userId)).limit(1);
    if (row && !row.optOut) {
      const [ahead] = await db.select({ n: count() }).from(users).where(and(eq(users.leagueOptOut, false), gt(users.xpPoints, row.xp ?? 0)));
      you = { rank: Number(ahead?.n ?? 0) + 1, xp: row.xp ?? 0 };
    }
  }
  return { entries, you };
}

// ─── Privacy ─────────────────────────────────────────────────────────────────

export async function setLeagueOptOut(userId: string, optOut: boolean, now: Date = new Date()): Promise<void> {
  await db.update(users).set({ leagueOptOut: optOut }).where(eq(users.id, userId));
  if (optOut) {
    // Leave this week's board immediately (past weeks stay as history).
    const win = getWeekWindow(now);
    await db.delete(leagueEntries).where(and(eq(leagueEntries.userId, userId), eq(leagueEntries.weekId, win.id), isNull(leagueEntries.outcome)));
    enteredCache.delete(`${userId}:${win.id}`);
  }
}

// ─── Settlement ──────────────────────────────────────────────────────────────

/** Settles every finished, unsettled week. Safe to call from anywhere, any number of times. */
export async function settleDueWeeks(now: Date = new Date()): Promise<string[]> {
  const due = await db
    .select({ id: leagueWeeks.id })
    .from(leagueWeeks)
    .where(and(lte(leagueWeeks.endsAt, now), isNull(leagueWeeks.settledAt)))
    .orderBy(asc(leagueWeeks.id))
    .limit(10);
  const settled: string[] = [];
  for (const w of due) {
    try {
      if (await settleWeek(w.id, now)) settled.push(w.id);
    } catch (err) {
      console.error('[league] failed to settle week', w.id, err);
    }
  }
  return settled;
}

/** Returns true if this call settled the week, false if it was already settled (or being settled). */
export async function settleWeek(weekId: string, now: Date = new Date()): Promise<boolean> {
  const win = weekWindowFromId(weekId);
  return db.transaction(async (tx) => {
    // The lock: only one caller can flip settled_at from NULL, and a rollback releases it.
    const [res] = (await tx.update(leagueWeeks).set({ settledAt: now }).where(and(eq(leagueWeeks.id, weekId), isNull(leagueWeeks.settledAt)))) as any;
    if (!res?.affectedRows) return false;

    const cohorts = await tx.select().from(leagueCohorts).where(eq(leagueCohorts.weekId, weekId));
    for (const cohort of cohorts) {
      const entries = await tx.select().from(leagueEntries).where(eq(leagueEntries.cohortId, cohort.id));
      if (!entries.length) continue;
      const names = await tx.select({ id: users.id, username: users.username }).from(users).where(inArray(users.id, entries.map((e) => e.userId)));
      const nameOf = new Map(names.map((u) => [u.id, u.username]));
      const xpMap = await weeklyXpFor(entries.map((e) => e.userId), win, tx as unknown as Reader);

      const real: Participant[] = entries.map((e) => ({
        key: `user:${e.userId}`, userId: e.userId, isBot: false, name: nameOf.get(e.userId) ?? 'Learner',
        xp: xpMap.get(e.userId)?.xp ?? 0, reachedAt: xpMap.get(e.userId)?.reachedAt ?? 0,
      }));
      const bots = botParticipants(cohort.id, cohort.rung, botCountFor(real.length), 1);
      const ranked = rankParticipants([...real, ...bots]);
      const n = ranked.length;

      for (const p of ranked) {
        if (p.isBot) continue;
        const { outcome, newRung } = outcomeFor(p.rank, p.xp, n, cohort.rung);
        await tx.update(leagueEntries).set({ xp: p.xp, rank: p.rank, outcome }).where(and(eq(leagueEntries.cohortId, cohort.id), eq(leagueEntries.userId, p.userId!)));
        await tx
          .update(leagueMembership)
          .set({ rung: Math.min(RUNG_COUNT - 1, Math.max(0, newRung)), updatedAt: now })
          .where(eq(leagueMembership.userId, p.userId!));
      }
    }
    return true;
  });
}
