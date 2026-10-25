/**
 * League integration test against a REAL database (and optionally a running API).
 *
 *   # DB env vars set (see e2e-smoke.ts), migrations applied, API running on :3999
 *   API=http://localhost:3999 npx tsx scripts/e2e-league.ts
 *
 * Part 1 drives settlement directly (it needs to "travel" to a finished week).
 * Part 2 exercises the HTTP endpoints. Exits non-zero if any check fails.
 */
import { randomUUID } from 'node:crypto';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../src/db/index.js';
import { users, xpEvents, leagueEntries, leagueMembership, leagueWeeks, leagueCohorts } from '../src/db/schema.js';
import { touchLeague, settleDueWeeks, settleWeek, getLeagueView, _clearLeagueCache } from '../src/services/leagueService.js';
import { getWeekWindow } from '../src/services/leagueRules.js';

const API = process.env.API ?? 'http://localhost:3999';
let failures = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  -> ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}
const DAY = 86400000;

async function makeUser(tag: string) {
  const id = randomUUID();
  await db.insert(users).values({ id, email: `${tag}-${id.slice(0, 8)}@example.com`, username: `${tag}${id.slice(0, 4)}`, passwordHash: 'x' });
  return id;
}

async function part1() {
  console.log('--- Part 1: weekly settlement (direct) ---');
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * DAY);
  const pastWin = getWeekWindow(lastWeek);
  const RUNG = 5; // Take... middle of the ladder so both promotion and demotion are possible

  // 35 learners all on rung 5 -> must split into a cohort of 30 and a cohort of 5
  const ids: string[] = [];
  for (let i = 1; i <= 35; i++) {
    const id = await makeUser(`s${i}`);
    await db.insert(leagueMembership).values({ userId: id, rung: RUNG });
    ids.push(id);
  }
  _clearLeagueCache();
  for (const id of ids) await touchLeague(id, lastWeek);

  const entries = await db.select().from(leagueEntries).where(inArray(leagueEntries.userId, ids));
  const byCohort = new Map<string, number>();
  for (const e of entries) byCohort.set(e.cohortId, (byCohort.get(e.cohortId) ?? 0) + 1);
  const sizes = [...byCohort.values()].sort((a, b) => b - a);
  check('35 learners on one rung split into cohorts of 30 and 5', sizes.length === 2 && sizes[0] === 30 && sizes[1] === 5, sizes);
  const again = await touchLeague(ids[0], lastWeek);
  check('entering the same week twice is idempotent (same cohort, no duplicate)', again?.cohortId === entries.find((e) => e.userId === ids[0])!.cohortId && (await db.select().from(leagueEntries).where(eq(leagueEntries.userId, ids[0]))).length === 1);

  // XP: learner i earns i*30 in one event, inside last week. 34 and 35 both exceed the daily cap (1000) -> tie, 34 got there first.
  for (let i = 1; i <= 35; i++) {
    const at = new Date(pastWin.start.getTime() + 2 * DAY + (i === 35 ? 2 : 1) * 3600000);
    await db.insert(xpEvents).values({ id: randomUUID(), userId: ids[i - 1], amount: i * 30, source: 'lesson', minutes: 0, createdAt: at });
  }

  const settled = await settleDueWeeks(now);
  check('settleDueWeeks settles last week', settled.includes(pastWin.id), settled);
  const rungOf = async (i: number) => (await db.select().from(leagueMembership).where(eq(leagueMembership.userId, ids[i - 1])))[0].rung;
  const entryOf = async (i: number) => (await db.select().from(leagueEntries).where(eq(leagueEntries.userId, ids[i - 1])))[0];

  // Cohort A = learners 1..30 (touched first). 30 real learners, no bots: promote top 6, demote bottom 6.
  const topA = await Promise.all([25, 26, 27, 28, 29, 30].map(rungOf));
  const botA = await Promise.all([1, 2, 3, 4, 5, 6].map(rungOf));
  const midA = await Promise.all([7, 15, 24].map(rungOf));
  check('cohort of 30: top 6 promoted one rung', topA.every((r) => r === RUNG + 1), topA);
  check('cohort of 30: bottom 6 demoted one rung', botA.every((r) => r === RUNG - 1), botA);
  check('cohort of 30: everyone else stays', midA.every((r) => r === RUNG), midA);
  const e30 = await entryOf(30);
  check('final rank, capped XP and outcome are recorded', e30.rank === 1 && e30.xp === 900 && e30.outcome === 'promoted', e30);

  // Cohort B = learners 31..35 with 15 bots. Real learners out-earn every bot, so ranks 1-5; top 4 of 20 promote.
  const e35 = await entryOf(35), e34 = await entryOf(34);
  check('daily cap applied: 1050 XP counts as 1000', e35.xp === 1000 && e34.xp === 1000, [e34.xp, e35.xp]);
  check('tie on capped XP is broken by who reached it first (34 before 35)', (e34.rank ?? 99) < (e35.rank ?? 99), [e34.rank, e35.rank]);
  const rB = await Promise.all([32, 33, 34, 35].map(rungOf));
  check('cohort of 5 + 15 bots: top 4 of the 20-person board promoted', rB.every((r) => r === RUNG + 1), rB);
  check('5th place real learner stays (outside the top-4 promotion zone)', (await rungOf(31)) === RUNG, await rungOf(31));
  check('bots never appear as rows (nothing stored for them)', (await db.select().from(leagueEntries).where(eq(leagueEntries.cohortId, e35.cohortId))).length === 5);

  const week = (await db.select().from(leagueWeeks).where(eq(leagueWeeks.id, pastWin.id)))[0];
  check('week is marked settled', !!week.settledAt);
  const before = await Promise.all(ids.map((_, i) => rungOf(i + 1)));
  check('settling again does nothing (idempotent)', (await settleDueWeeks(now)).length === 0 && JSON.stringify(await Promise.all(ids.map((_, i) => rungOf(i + 1)))) === JSON.stringify(before));
  const current = getWeekWindow(now);
  check('the current (unfinished) week is never settled', !(await db.select().from(leagueWeeks).where(eq(leagueWeeks.id, current.id)))[0]?.settledAt);

  // Race: two settlements of the same finished week at once -> exactly one wins
  const raceWeek = getWeekWindow(new Date(now.getTime() - 14 * DAY));
  const racer = await makeUser('race');
  await touchLeague(racer, new Date(now.getTime() - 14 * DAY));
  const [r1, r2] = await Promise.all([settleWeek(raceWeek.id, now), settleWeek(raceWeek.id, now)]);
  check('two concurrent settlements: exactly one applies it', [r1, r2].filter(Boolean).length === 1, [r1, r2]);

  // A learner with no XP at the bottom is demoted; one at the bottom rung is not (cannot go below 0)
  const lowRung = await makeUser('low');
  await db.insert(leagueMembership).values({ userId: lowRung, rung: 0 });
  const lowWeek = new Date(now.getTime() - 21 * DAY);
  await touchLeague(lowRung, lowWeek);
  await settleDueWeeks(now);
  check('bottom-rung learner with 0 XP stays at rung 0 (cannot demote further)', (await db.select().from(leagueMembership).where(eq(leagueMembership.userId, lowRung)))[0].rung === 0);

  // Opted-out learners are not entered
  const hidden = await makeUser('hidden');
  await db.update(users).set({ leagueOptOut: true }).where(eq(users.id, hidden));
  check('opted-out learner is never entered into a league', (await touchLeague(hidden, now)) === null);
  const view = await getLeagueView(hidden, now);
  check('opted-out view carries no board', view.optedOut === true && view.board === null);
}

let cookie = '';
async function call(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API}/api${path}`, { method, headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  let json: any = null;
  try { json = JSON.parse(await res.text()); } catch { /* */ }
  return { status: res.status, json };
}

async function part2() {
  console.log('--- Part 2: HTTP endpoints ---');
  const stamp = Date.now();
  const reg = await call('POST', '/auth/register', { email: `lg${stamp}@example.com`, password: 'Passw0rd!x', username: `lg${stamp}`, currentLevel: 'N5' });
  check('register', reg.status === 201, reg);

  const first = await call('GET', '/league/me');
  const b = first.json?.board;
  check('GET /league/me returns Wakaba III for a new learner', first.status === 200 && first.json.rung.label === 'Wakaba III' && first.json.rung.index === 0, first.json?.rung);
  check('board is padded with 19 labelled bots (1 real learner -> 20 on the board)', b?.size === 20 && b.realCount === 1 && b.standings.filter((s: any) => s.isBot).length === 19, [b?.size, b?.realCount]);
  check('standings are ranked 1..n in descending XP', b.standings.every((s: any, i: number) => s.rank === i + 1 && (i === 0 || b.standings[i - 1].xp >= s.xp)));
  check('exactly one row is "you"; zones: top 4 promotion, bottom 4 demotion (rung 0 cannot demote)', b.standings.filter((s: any) => s.isYou).length === 1 && b.standings.slice(0, 4).every((s: any) => s.zone === 'promotion') && b.standings.every((s: any) => s.zone !== 'demotion'), b.standings.map((s: any) => s.zone).join());
  check('response exposes ladder (15 rungs), rules and week countdown', first.json.ladder.flatMap((l: any) => l.rungs).length === 15 && first.json.rules.minXpToPromote === 50 && first.json.week.secondsLeft > 0 && first.json.week.secondsLeft <= 7 * 86400);
  check('bot rows carry no user id', b.standings.filter((s: any) => s.isBot).every((s: any) => s.userId === null));

  const g = await call('POST', '/progress/grammar', { grammarId: 'n5_g001', status: 'studied' });
  const gained = g.json?.xpResult?.xpGained ?? 0;
  const second = await call('GET', '/league/me');
  const mine = second.json?.board?.standings.find((s: any) => s.isYou);
  check('XP earned through the app shows up on the board (ledger -> league)', gained > 0 && mine?.xp === gained, { gained, shown: mine?.xp });

  const hist = await call('GET', '/league/history');
  check('GET /league/history works (empty before any week is settled)', hist.status === 200 && Array.isArray(hist.json?.weeks));
  const glob = await call('GET', '/league/global');
  check('GET /league/global lists learners by total XP, with "you"', glob.status === 200 && glob.json.entries.length >= 1 && glob.json.you?.rank >= 1, glob.json?.you);

  const bad = await call('PUT', '/league/settings', { optOut: 'yes' });
  check('invalid settings body is a 400', bad.status === 400, bad);
  const off = await call('PUT', '/league/settings', { optOut: true });
  const hidden = await call('GET', '/league/me');
  check('opt-out hides the learner: no board returned', off.status === 200 && hidden.json?.optedOut === true && hidden.json?.board === null, hidden.json?.optedOut);
  const glob2 = await call('GET', '/league/global');
  check('opted-out learner is absent from the global board', !glob2.json.entries.some((e: any) => e.isYou) && glob2.json.you === null);
  await call('PUT', '/league/settings', { optOut: false });
  const back = await call('GET', '/league/me');
  check('opting back in restores the board', back.json?.optedOut === false && back.json?.board?.standings.some((s: any) => s.isYou));

  cookie = '';
  const unauth = await call('GET', '/league/me');
  check('league endpoints require login (401)', unauth.status === 401, unauth.status);
}

async function main() {
  await part1();
  await part2();
  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
