/**
 * Social graph: follow / unfollow, follower lists and the global learner directory.
 *
 * Privacy rule (shared with the leaderboards): a learner with `leagueOptOut = true` is invisible
 * to everyone else - not in the directory, not in follower lists, profile returns 404 - but can
 * still browse the platform and see their own data.
 */

import { and, asc, count, desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userFollows, users } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseAvatarConfig } from './avatarConfig.js';

export const MAX_PAGE_SIZE = 50;
export const DEFAULT_PAGE_SIZE = 20;

type UserRow = {
  id: string;
  username: string;
  currentLevel: string | null;
  xpPoints: number;
  streakDays: number;
  avatarConfig: string | null;
  avatarId: string | null;
  avatarUrl: string | null;
};

export interface PersonSummary {
  id: string;
  username: string;
  level: string;
  xp: number;
  streakDays: number;
  avatarConfig: ReturnType<typeof parseAvatarConfig>;
  avatarId: string | null;
  avatarUrl: string | null;
  isFollowing: boolean;
  followsYou: boolean;
}

export function clampPage(limit: unknown, offset: unknown) {
  const l = Number(limit);
  const o = Number(offset);
  return {
    limit: Number.isFinite(l) ? Math.min(Math.max(1, Math.floor(l)), MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE,
    offset: Number.isFinite(o) ? Math.max(0, Math.floor(o)) : 0,
  };
}

/** Escapes LIKE wildcards so a search for "_" or "%" is literal. */
export function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, (c) => `\\${c}`);
}

const personColumns = {
  id: users.id,
  username: users.username,
  currentLevel: users.currentLevel,
  xpPoints: users.xpPoints,
  streakDays: users.streakDays,
  avatarConfig: users.avatarConfig,
  avatarId: users.avatarId,
  avatarUrl: users.avatarUrl,
};

function toPerson(row: UserRow, isFollowing: boolean, followsYou: boolean): PersonSummary {
  return {
    id: row.id,
    username: row.username,
    level: row.currentLevel ?? 'N5',
    xp: row.xpPoints ?? 0,
    streakDays: row.streakDays ?? 0,
    avatarConfig: parseAvatarConfig(row.avatarConfig),
    avatarId: row.avatarId ?? null,
    avatarUrl: row.avatarUrl ?? null,
    isFollowing,
    followsYou,
  };
}

/** Which of `ids` the viewer follows, and which of them follow the viewer. */
async function relationsFor(viewerId: string, ids: string[]) {
  if (!ids.length) return { following: new Set<string>(), followers: new Set<string>() };
  const idList = sql.join(ids.map((i) => sql`${i}`), sql`, `);
  const [outgoing, incoming] = await Promise.all([
    db.select({ id: userFollows.followingId }).from(userFollows)
      .where(and(eq(userFollows.followerId, viewerId), sql`${userFollows.followingId} in (${idList})`)),
    db.select({ id: userFollows.followerId }).from(userFollows)
      .where(and(eq(userFollows.followingId, viewerId), sql`${userFollows.followerId} in (${idList})`)),
  ]);
  return { following: new Set(outgoing.map((r) => r.id)), followers: new Set(incoming.map((r) => r.id)) };
}

async function decorate(viewerId: string, rows: UserRow[]): Promise<PersonSummary[]> {
  const rel = await relationsFor(viewerId, rows.map((r) => r.id));
  return rows.map((r) => toPerson(r, rel.following.has(r.id), rel.followers.has(r.id)));
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function followUser(followerId: string, targetId: string): Promise<void> {
  if (followerId === targetId) throw new AppError(400, 'You cannot follow yourself', 'SELF_FOLLOW');
  const [target] = await db.select({ id: users.id, optOut: users.leagueOptOut }).from(users).where(eq(users.id, targetId)).limit(1);
  // Opted-out learners are indistinguishable from non-existent ones.
  if (!target || target.optOut) throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
  // Idempotent: following twice is a no-op, so double-clicks and retries are safe.
  await db.insert(userFollows).values({ followerId, followingId: targetId })
    .onDuplicateKeyUpdate({ set: { followerId } });
}

export async function unfollowUser(followerId: string, targetId: string): Promise<void> {
  await db.delete(userFollows).where(and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, targetId)));
}

// ─── Reads ───────────────────────────────────────────────────────────────────

export async function getFollowCounts(userId: string) {
  const [[followers], [following]] = await Promise.all([
    db.select({ n: count() }).from(userFollows)
      .innerJoin(users, eq(users.id, userFollows.followerId))
      .where(and(eq(userFollows.followingId, userId), eq(users.leagueOptOut, false))),
    db.select({ n: count() }).from(userFollows)
      .innerJoin(users, eq(users.id, userFollows.followingId))
      .where(and(eq(userFollows.followerId, userId), eq(users.leagueOptOut, false))),
  ]);
  return { followers: Number(followers?.n ?? 0), following: Number(following?.n ?? 0) };
}

export async function isFollowing(viewerId: string, targetId: string): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(userFollows)
    .where(and(eq(userFollows.followerId, viewerId), eq(userFollows.followingId, targetId)));
  return Number(row?.n ?? 0) > 0;
}

export async function listFollowing(userId: string, viewerId: string, limit: number, offset: number) {
  const rows = await db.select(personColumns).from(userFollows)
    .innerJoin(users, eq(users.id, userFollows.followingId))
    .where(and(eq(userFollows.followerId, userId), eq(users.leagueOptOut, false)))
    .orderBy(desc(userFollows.createdAt), asc(users.username))
    .limit(limit + 1).offset(offset);
  return page(await decorate(viewerId, rows.slice(0, limit)), rows.length > limit, offset, limit);
}

export async function listFollowers(userId: string, viewerId: string, limit: number, offset: number) {
  const rows = await db.select(personColumns).from(userFollows)
    .innerJoin(users, eq(users.id, userFollows.followerId))
    .where(and(eq(userFollows.followingId, userId), eq(users.leagueOptOut, false)))
    .orderBy(desc(userFollows.createdAt), asc(users.username))
    .limit(limit + 1).offset(offset);
  return page(await decorate(viewerId, rows.slice(0, limit)), rows.length > limit, offset, limit);
}

/** Global directory of learners, searchable by name prefix, ranked by total XP. */
export async function searchPeople(viewerId: string, query: string, limit: number, offset: number) {
  const q = query.trim().slice(0, 50);
  const where = q
    ? and(eq(users.leagueOptOut, false), sql`${users.id} <> ${viewerId}`, sql`${users.username} like ${escapeLike(q) + '%'}`)
    : and(eq(users.leagueOptOut, false), sql`${users.id} <> ${viewerId}`);
  const rows = await db.select(personColumns).from(users)
    .where(where)
    .orderBy(desc(users.xpPoints), asc(users.createdAt))
    .limit(limit + 1).offset(offset);
  return page(await decorate(viewerId, rows.slice(0, limit)), rows.length > limit, offset, limit);
}

function page(items: PersonSummary[], hasMore: boolean, offset: number, limit: number) {
  return { people: items, hasMore, nextOffset: hasMore ? offset + limit : null };
}
