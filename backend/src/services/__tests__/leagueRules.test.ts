import { describe, it, expect } from 'vitest';
import {
  rungInfo, RUNG_COUNT, TOP_RUNG, getWeekWindow, istDayKey, computeWeeklyXp, DAILY_XP_CAP,
  botParticipants, botCountFor, MIN_BOARD, rankParticipants, zoneFor, outcomeFor, promoteCount, demoteCount,
  MIN_XP_TO_PROMOTE, LEAGUES, type Participant,
} from '../leagueRules.js';

describe('ladder', () => {
  it('has 5 leagues x 3 stages = 15 rungs, entering each league at stage III and topping out at stage I', () => {
    expect(LEAGUES).toHaveLength(5);
    expect(RUNG_COUNT).toBe(15);
    expect(rungInfo(0)).toMatchObject({ label: 'Wakaba III', stage: 3 });
    expect(rungInfo(1)).toMatchObject({ label: 'Wakaba II', stage: 2 });
    expect(rungInfo(2)).toMatchObject({ label: 'Wakaba I', stage: 1 });
    expect(rungInfo(3)).toMatchObject({ label: 'Take III', stage: 3 }); // promotion from Wakaba I lands here
    expect(rungInfo(11)).toMatchObject({ label: 'Sakura I' });
    expect(rungInfo(TOP_RUNG)).toMatchObject({ label: 'Fuji I', stage: 1 });
  });

  it('clamps out-of-range rungs', () => {
    expect(rungInfo(-4).index).toBe(0);
    expect(rungInfo(99).index).toBe(TOP_RUNG);
    expect(rungInfo(Number.NaN).index).toBe(0);
  });
});

describe('week window (Monday 00:00 IST)', () => {
  it('maps a Sunday-evening IST instant to the Monday before it', () => {
    const w = getWeekWindow(new Date('2026-10-25T12:00:00Z')); // Sun 17:30 IST
    expect(w.id).toBe('2026-10-19');
    expect(w.start.toISOString()).toBe('2026-10-18T18:30:00.000Z');
    expect(w.end.toISOString()).toBe('2026-10-25T18:30:00.000Z');
  });

  it('rolls over exactly at Monday 00:00 IST (= Sunday 18:30 UTC)', () => {
    expect(getWeekWindow(new Date('2026-10-25T18:29:59.999Z')).id).toBe('2026-10-19');
    expect(getWeekWindow(new Date('2026-10-25T18:30:00.000Z')).id).toBe('2026-10-26');
  });

  it('a Monday-morning IST instant that is still Sunday in UTC belongs to the new week', () => {
    expect(getWeekWindow(new Date('2026-10-25T20:00:00Z')).id).toBe('2026-10-26'); // Mon 01:30 IST
  });

  it('weeks are exactly 7 days and contiguous, including across year end', () => {
    const a = getWeekWindow(new Date('2026-12-30T10:00:00Z'));
    const b = getWeekWindow(a.end);
    expect(a.end.getTime() - a.start.getTime()).toBe(7 * 86400000);
    expect(b.start.getTime()).toBe(a.end.getTime());
    expect(b.id).toBe('2027-01-04');
  });

  it('istDayKey uses the IST calendar day', () => {
    expect(istDayKey(new Date('2026-10-25T18:29:59Z'))).toBe('2026-10-25');
    expect(istDayKey(new Date('2026-10-25T18:30:00Z'))).toBe('2026-10-26');
  });
});

describe('computeWeeklyXp (daily cap)', () => {
  const ev = (iso: string, amount: number) => ({ amount, createdAt: new Date(iso) });

  it('sums XP and reports when the last counted XP was earned', () => {
    const r = computeWeeklyXp([ev('2026-10-20T05:00:00Z', 30), ev('2026-10-21T05:00:00Z', 20)]);
    expect(r).toMatchObject({ xp: 50, rawXp: 50, reachedAt: new Date('2026-10-21T05:00:00Z').getTime() });
  });

  it('caps each IST day separately', () => {
    const r = computeWeeklyXp([
      ev('2026-10-20T05:00:00Z', 900), ev('2026-10-20T06:00:00Z', 900), // same IST day -> 1000 counted
      ev('2026-10-21T05:00:00Z', 400),                                  // next day, fresh cap
    ]);
    expect(r.xp).toBe(DAILY_XP_CAP + 400);
    expect(r.rawXp).toBe(2200);
  });

  it('splits an event that straddles the cap, and ignores XP after the cap', () => {
    const r = computeWeeklyXp([ev('2026-10-20T05:00:00Z', 950), ev('2026-10-20T06:00:00Z', 100), ev('2026-10-20T07:00:00Z', 100)], 1000);
    expect(r.xp).toBe(1000);
    expect(r.reachedAt).toBe(new Date('2026-10-20T06:00:00Z').getTime()); // the 07:00 event added nothing
  });

  it('the IST day boundary (18:30 UTC) starts a fresh cap', () => {
    const r = computeWeeklyXp([ev('2026-10-20T18:29:00Z', 1000), ev('2026-10-20T18:31:00Z', 1000)]);
    expect(r.xp).toBe(2000);
  });

  it('ignores zero/negative amounts and handles no events', () => {
    expect(computeWeeklyXp([ev('2026-10-20T05:00:00Z', 0), ev('2026-10-20T05:00:00Z', -5)]).xp).toBe(0);
    expect(computeWeeklyXp([])).toEqual({ xp: 0, rawXp: 0, reachedAt: 0 });
  });

  it('is independent of input order', () => {
    const a = [ev('2026-10-20T05:00:00Z', 600), ev('2026-10-20T06:00:00Z', 600)];
    expect(computeWeeklyXp([...a].reverse())).toEqual(computeWeeklyXp(a));
  });
});

describe('bots', () => {
  it('are deterministic for a cohort, labelled as bots, and uniquely named', () => {
    const a = botParticipants('cohort-1', 0, 15, 0.5);
    const b = botParticipants('cohort-1', 0, 15, 0.5);
    expect(a).toEqual(b);
    expect(a.every((p) => p.isBot && p.userId === null)).toBe(true);
    expect(new Set(a.map((p) => p.name)).size).toBe(15);
    expect(botParticipants('cohort-2', 0, 15, 0.5)).not.toEqual(a);
  });

  it('earn more as the week goes on and more in higher leagues', () => {
    const sum = (ps: Participant[]) => ps.reduce((n, p) => n + p.xp, 0);
    expect(sum(botParticipants('c', 0, 10, 0))).toBe(0);
    expect(sum(botParticipants('c', 0, 10, 1))).toBeGreaterThan(sum(botParticipants('c', 0, 10, 0.5)));
    expect(sum(botParticipants('c', 12, 10, 1))).toBeGreaterThan(sum(botParticipants('c', 0, 10, 1)) * 4);
  });

  it('pad a board up to MIN_BOARD but never beyond', () => {
    expect(botCountFor(1)).toBe(MIN_BOARD - 1);
    expect(botCountFor(MIN_BOARD)).toBe(0);
    expect(botCountFor(30)).toBe(0);
  });
});

describe('ranking, zones and outcomes', () => {
  const p = (key: string, xp: number, reachedAt = 1): Participant => ({ key, userId: key, isBot: false, name: key, xp, reachedAt });

  it('ranks by XP, then who got there first, real learners ahead of bots on a tie', () => {
    const bot = botParticipants('c', 0, 1, 1)[0];
    const ranked = rankParticipants([p('late', 100, 9), p('early', 100, 2), { ...bot, xp: 100 }, p('top', 500)]);
    expect(ranked.map((r) => r.key)).toEqual(['top', 'early', 'late', bot.key]);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
  });

  it('promotes the top 20% and demotes the bottom 20% of the board', () => {
    expect(promoteCount(20)).toBe(4);
    expect(demoteCount(20)).toBe(4);
    expect(promoteCount(30)).toBe(6);
    expect(promoteCount(3)).toBe(1); // never zero
    const zones = Array.from({ length: 20 }, (_, i) => zoneFor(i + 1, 20, 5));
    expect(zones.slice(0, 4)).toEqual(Array(4).fill('promotion'));
    expect(zones.slice(4, 16)).toEqual(Array(12).fill('safe'));
    expect(zones.slice(16)).toEqual(Array(4).fill('demotion'));
  });

  it('cannot demote from the bottom rung or promote from the top rung', () => {
    expect(zoneFor(20, 20, 0)).toBe('safe');
    expect(zoneFor(1, 20, TOP_RUNG)).toBe('safe');
    expect(outcomeFor(1, 9999, 20, TOP_RUNG)).toEqual({ outcome: 'stayed', newRung: TOP_RUNG });
    expect(outcomeFor(20, 0, 20, 0)).toEqual({ outcome: 'stayed', newRung: 0 });
  });

  it('requires a minimum XP to be promoted (no climbing by showing up)', () => {
    expect(outcomeFor(1, MIN_XP_TO_PROMOTE - 1, 20, 3)).toEqual({ outcome: 'stayed', newRung: 3 });
    expect(outcomeFor(1, MIN_XP_TO_PROMOTE, 20, 3)).toEqual({ outcome: 'promoted', newRung: 4 });
  });

  it('moves one rung at a time, crossing league boundaries', () => {
    expect(outcomeFor(2, 500, 20, 2).newRung).toBe(3); // Wakaba I -> Take III
    expect(rungInfo(outcomeFor(2, 500, 20, 2).newRung).label).toBe('Take III');
    expect(outcomeFor(19, 10, 20, 3)).toEqual({ outcome: 'demoted', newRung: 2 }); // Take III -> Wakaba I
  });
});
