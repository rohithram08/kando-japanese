/**
 * League rules - pure functions and tunable constants (no database access).
 *
 * Ladder: 5 leagues x 3 stages = 15 rungs. In each league Stage III is the entry
 * and Stage I the top; promotion from Stage I enters the next league at Stage III.
 *
 *   rung  0  Wakaba III ... rung  2  Wakaba I
 *   rung  3  Take   III ... rung 14  Fuji   I   (top)
 */

// ─── Tunables (calibrate against real data) ──────────────────────────────────

/** Max real learners per cohort (a "dojo"). */
export const COHORT_SIZE = 30;
/** Boards are padded with clearly-labelled bots up to this size so small leagues still feel alive. */
export const MIN_BOARD = 20;
/** Share of the board that promotes / demotes each week. */
export const PROMOTE_FRACTION = 0.2;
export const DEMOTE_FRACTION = 0.2;
/** A learner must earn at least this much league XP in the week to be promoted. */
export const MIN_XP_TO_PROMOTE = 50;
/** League XP counted per learner per IST day (anti-grind). */
export const DAILY_XP_CAP = 1000;

export const LEAGUES = [
  { id: 'wakaba', name: 'Wakaba', jp: '若葉', color: '#84cc16' },
  { id: 'take', name: 'Take', jp: '竹', color: '#10b981' },
  { id: 'ume', name: 'Ume', jp: '梅', color: '#a855f7' },
  { id: 'sakura', name: 'Sakura', jp: '桜', color: '#f472b6' },
  { id: 'fuji', name: 'Fuji', jp: '富士', color: '#f59e0b' },
] as const;

export const STAGES_PER_LEAGUE = 3;
export const RUNG_COUNT = LEAGUES.length * STAGES_PER_LEAGUE; // 15
export const TOP_RUNG = RUNG_COUNT - 1;

const ROMAN: Record<number, string> = { 3: 'III', 2: 'II', 1: 'I' };

export interface RungInfo {
  index: number;
  leagueIndex: number;
  league: (typeof LEAGUES)[number];
  /** 3 (entry) -> 1 (top of the league) */
  stage: 1 | 2 | 3;
  label: string;
}

export function rungInfo(index: number): RungInfo {
  const i = Math.min(Math.max(0, Math.floor(index) || 0), TOP_RUNG);
  const leagueIndex = Math.floor(i / STAGES_PER_LEAGUE);
  const stage = (STAGES_PER_LEAGUE - (i % STAGES_PER_LEAGUE)) as 1 | 2 | 3;
  const league = LEAGUES[leagueIndex];
  return { index: i, leagueIndex, league, stage, label: `${league.name} ${ROMAN[stage]}` };
}

// ─── Weeks (Monday 00:00 IST -> next Monday 00:00 IST) ───────────────────────

const IST_OFFSET_MS = 330 * 60 * 1000; // UTC+05:30, no DST
const DAY_MS = 24 * 60 * 60 * 1000;

export interface WeekWindow {
  /** IST date of the Monday that starts the week, e.g. "2026-10-19". Used as the week id. */
  id: string;
  start: Date;
  end: Date;
}

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (ms: number) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

export function getWeekWindow(now: Date): WeekWindow {
  const ist = now.getTime() + IST_OFFSET_MS; // UTC fields of this value are IST wall-clock fields
  const d = new Date(ist);
  const sinceMonday = (d.getUTCDay() + 6) % 7; // Mon = 0
  const mondayIst = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - sinceMonday);
  const start = new Date(mondayIst - IST_OFFSET_MS);
  return { id: isoDate(mondayIst), start, end: new Date(start.getTime() + 7 * DAY_MS) };
}

/** Rebuilds a week window from its id ("2026-10-19"), independent of any stored timestamps. */
export function weekWindowFromId(id: string): WeekWindow {
  const [y, m, d] = id.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d) - IST_OFFSET_MS);
  return { id, start, end: new Date(start.getTime() + 7 * DAY_MS) };
}

/** IST calendar day of an instant, e.g. "2026-10-25". */
export function istDayKey(instant: Date): string {
  return isoDate(instant.getTime() + IST_OFFSET_MS);
}

// ─── Weekly XP with the daily cap ────────────────────────────────────────────

export interface XpEventLite {
  amount: number;
  createdAt: Date;
}

export interface WeeklyXp {
  /** League XP: raw XP with each IST day capped at DAILY_XP_CAP. */
  xp: number;
  rawXp: number;
  /** When the learner earned their last counted XP (tie-break: earlier wins). */
  reachedAt: number;
}

export function computeWeeklyXp(events: XpEventLite[], cap: number = DAILY_XP_CAP): WeeklyXp {
  const sorted = [...events].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const perDay = new Map<string, number>();
  let xp = 0;
  let rawXp = 0;
  let reachedAt = 0;
  for (const e of sorted) {
    if (!(e.amount > 0)) continue;
    rawXp += e.amount;
    const day = istDayKey(e.createdAt);
    const used = perDay.get(day) ?? 0;
    const counted = Math.max(0, Math.min(e.amount, cap - used));
    if (counted > 0) {
      perDay.set(day, used + counted);
      xp += counted;
      reachedAt = e.createdAt.getTime();
    }
  }
  return { xp, rawXp, reachedAt };
}

// ─── Bots (clearly labelled pacers; deterministic, nothing stored) ───────────

const BOT_NAMES = [
  'Dojo Sparrow', 'Bamboo Fox', 'Paper Crane', 'Moss Tanuki', 'Lantern Koi', 'Tea Kettle',
  'Ink Panda', 'Sakura Wind', 'Misty Ronin', 'Origami Owl', 'Temple Bell', 'Moon Rabbit',
  'River Kappa', 'Maple Monk', 'Snow Daruma', 'Kite Runner', 'Tofu Samurai', 'Matcha Mochi',
  'Cloud Neko', 'Fuji Falcon',
];
const BOT_STYLES = ['avataaars', 'lorelei', 'openPeeps', 'notionists'] as const;

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Participant {
  key: string;
  userId: string | null;
  isBot: boolean;
  name: string;
  xp: number;
  reachedAt: number;
  avatar?: { style: string; seed: string; options: Record<string, never> };
}

/** Weekly XP a bot targets at a given rung (stronger bots in higher leagues). */
export function botWeeklyTarget(cohortId: string, index: number, rungIndex: number): number {
  const u = mulberry32(hashString(`${cohortId}:${index}:xp`))();
  const factor = 0.25 + 1.75 * u * u; // most bots are modest, a few are strong
  return Math.round(140 * Math.pow(1.25, rungIndex) * factor);
}

/** `fraction` (0..1) is how much of the week has elapsed, so bot XP grows over the week. */
export function botParticipants(cohortId: string, rungIndex: number, count: number, fraction: number): Participant[] {
  const f = Math.min(1, Math.max(0, fraction));
  const out: Participant[] = [];
  const offset = hashString(cohortId) % BOT_NAMES.length;
  for (let i = 0; i < count; i++) {
    const seed = hashString(`${cohortId}:${i}:id`);
    out.push({
      key: `bot:${cohortId}:${i}`,
      userId: null,
      isBot: true,
      name: BOT_NAMES[(offset + i) % BOT_NAMES.length],
      xp: Math.floor(botWeeklyTarget(cohortId, i, rungIndex) * f),
      reachedAt: Number.MAX_SAFE_INTEGER, // real learners win ties against bots
      avatar: { style: BOT_STYLES[seed % BOT_STYLES.length], seed: `bot${seed.toString(36)}`, options: {} },
    });
  }
  return out;
}

/** Bots needed to bring a board with `realCount` learners up to MIN_BOARD. */
export function botCountFor(realCount: number): number {
  return Math.max(0, MIN_BOARD - realCount);
}

// ─── Ranking, zones and outcomes ─────────────────────────────────────────────

export function rankParticipants<T extends Participant>(participants: T[]): Array<T & { rank: number }> {
  return [...participants]
    .sort((a, b) => b.xp - a.xp || a.reachedAt - b.reachedAt || a.key.localeCompare(b.key))
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export const promoteCount = (boardSize: number) => Math.max(1, Math.floor(boardSize * PROMOTE_FRACTION));
export const demoteCount = (boardSize: number) => Math.max(1, Math.floor(boardSize * DEMOTE_FRACTION));

export type Zone = 'promotion' | 'demotion' | 'safe';

export function zoneFor(rank: number, boardSize: number, rungIndex: number): Zone {
  if (rungIndex < TOP_RUNG && rank <= promoteCount(boardSize)) return 'promotion';
  if (rungIndex > 0 && rank > boardSize - demoteCount(boardSize)) return 'demotion';
  return 'safe';
}

export type Outcome = 'promoted' | 'demoted' | 'stayed';

export function outcomeFor(rank: number, xp: number, boardSize: number, rungIndex: number): { outcome: Outcome; newRung: number } {
  const zone = zoneFor(rank, boardSize, rungIndex);
  if (zone === 'promotion' && xp >= MIN_XP_TO_PROMOTE) return { outcome: 'promoted', newRung: rungIndex + 1 };
  if (zone === 'demotion') return { outcome: 'demoted', newRung: rungIndex - 1 };
  return { outcome: 'stayed', newRung: rungIndex };
}
