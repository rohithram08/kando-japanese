/**
 * End-to-end smoke test: level gating + XP ledger against a REAL running API and database.
 *
 *   # terminal 1: start the API against a migrated database
 *   PORT=3999 npx tsx src/index.ts
 *   # terminal 2
 *   API=http://localhost:3999 npx tsx scripts/e2e-smoke.ts
 *
 * Not part of `npm test` (needs a live database). Exits non-zero on the first failed check.
 */

const API = process.env.API ?? 'http://localhost:3999';
let cookie = '';
let failures = 0;

async function call(method: string, path: string, body?: unknown) {
  const res = await fetch(`${API}/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* not json */ }
  return { status: res.status, json };
}

function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  -> ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

async function main() {
  const stamp = Date.now();
  const reg = await call('POST', '/auth/register', {
    email: `smoke${stamp}@example.com`, password: 'Passw0rd!x', username: `smoke${stamp}`, currentLevel: 'N5',
  });
  check('register N5 user', reg.status === 201, reg);

  const lv = await call('GET', '/users/level-status');
  check('level-status: N5 unlocks only N5', lv.status === 200 && lv.json.studyLevel === 'N5' && lv.json.unlocked.length === 1, lv);
  check('level-status: coverage totals come from content index', (lv.json?.coverage?.categories?.grammar?.total ?? 0) === 60, lv.json?.coverage);

  const locked = await call('POST', '/progress/grammar', { grammarId: 'n3_g198', status: 'studied' });
  check('N5 user cannot save N3 grammar (403 LEVEL_LOCKED)', locked.status === 403 && locked.json?.error?.code === 'LEVEL_LOCKED', locked);

  const g1 = await call('POST', '/progress/grammar', { grammarId: 'n5_g001', status: 'studied' });
  check('N5 grammar saves and awards XP', g1.status === 200 && (g1.json?.xpResult?.xpGained ?? 0) > 0, g1.json?.xpResult);

  const g1b = await call('POST', '/progress/grammar', { grammarId: 'n5_g001', status: 'studied' });
  check('re-studying same pattern awards 0 XP (no farming)', g1b.status === 200 && g1b.json?.xpResult?.xpGained === 0, g1b.json?.xpResult);

  const up = await call('PUT', '/users/profile', { studyLevel: 'N3' });
  check('user can raise study level to N3', up.status === 200, up);

  const g3 = await call('POST', '/progress/grammar', { grammarId: 'n3_g198', status: 'studied' });
  check('N3 grammar beyond old 130-id list now saves (was 400)', g3.status === 200, g3);
  const g4 = await call('POST', '/progress/grammar', { grammarId: 'n4_g156', status: 'studied' });
  check('N4 grammar #156 saves (was 400)', g4.status === 200, g4);

  const k = await call('POST', '/progress/kanji', { kanjiId: 'n5k001', recognitionLevel: 1 });
  check('kanji progress saves + awards XP', k.status === 200, k);
  const v = await call('POST', '/progress/vocabulary', { vocabularyId: 'n5v001', masteryLevel: 1 });
  check('vocabulary progress saves + awards XP', v.status === 200, v);

  const hist = await call('GET', '/progress/xp-history?limit=50');
  const events: any[] = hist.json?.events ?? [];
  const sources = new Set(events.map((e) => e.source));
  check('xp-history lists grammar/kanji/vocabulary events', ['grammar', 'kanji', 'vocabulary'].every((s) => sources.has(s)), [...sources]);

  const profile = await call('GET', '/users/profile');
  const ledgerTotal = events.reduce((n, e) => n + e.amount, 0);
  check('ledger total equals users.xpPoints (no drift)', ledgerTotal === profile.json?.xpPoints && ledgerTotal > 0, { ledgerTotal, xpPoints: profile.json?.xpPoints });

  const lv2 = await call('GET', '/users/level-status');
  check('level-status reflects progress at N3', lv2.json?.studyLevel === 'N3' && lv2.json?.unlocked?.length === 3, lv2.json);

  // ── Avatar config ──────────────────────────────────────────────────────────
  const cfg = { style: 'avataaars', seed: 'smoke-1', options: { top: 'hat', hairColor: '2c1b18', topProbability: 100 } };
  const a1 = await call('PUT', '/users/profile', { avatarConfig: cfg });
  check('save avatarConfig', a1.status === 200 && JSON.stringify(a1.json?.avatarConfig) === JSON.stringify(cfg), a1.json?.avatarConfig);
  const a2 = await call('GET', '/users/profile');
  check('profile returns avatarConfig as an object, avatarUrl/avatarId cleared', typeof a2.json?.avatarConfig === 'object' && a2.json?.avatarId === null && a2.json?.avatarUrl === null, a2.json?.avatarConfig);
  const pub = await call('GET', `/users/${a2.json?.id}`);
  check('public profile exposes avatarConfig (needed for leaderboards)', pub.json?.avatarConfig?.style === 'avataaars', pub.json?.avatarConfig);
  const bad1 = await call('PUT', '/users/profile', { avatarConfig: { style: 'avataaars', seed: '<script>alert(1)</script>', options: {} } });
  check('malicious seed is rejected (400)', bad1.status === 400, bad1);
  const bad2 = await call('PUT', '/users/profile', { avatarConfig: { style: 'avataaars', seed: 'x', options: { top: '"><img src=x onerror=1>' } } });
  check('malicious option value is rejected (400)', bad2.status === 400, bad2);
  const bad3 = await call('PUT', '/users/profile', { avatarConfig: cfg, avatarId: 'avatar-3' });
  check('config + preset together is rejected (400)', bad3.status === 400, bad3);
  const a3 = await call('PUT', '/users/profile', { avatarId: 'avatar-3' });
  check('choosing a preset clears the cartoon avatar', a3.status === 200 && a3.json?.avatarConfig === null && a3.json?.avatarId === 'avatar-3', a3.json);
  await call('PUT', '/users/profile', { avatarConfig: cfg });
  const a4 = await call('PUT', '/users/profile', { avatarConfig: null });
  check('avatarConfig: null clears it', a4.status === 200 && a4.json?.avatarConfig === null, a4.json?.avatarConfig);

  const reset = await call('DELETE', '/progress/reset');
  check('reset succeeds', reset.status === 200, reset);
  const hist2 = await call('GET', '/progress/xp-history');
  const profile2 = await call('GET', '/users/profile');
  check('reset wipes the ledger so league XP cannot survive it', (hist2.json?.events ?? []).length === 0 && profile2.json?.xpPoints === 0, { events: hist2.json?.events?.length, xp: profile2.json?.xpPoints });

  // Fresh account that picks N3 at sign-up
  cookie = '';
  const reg2 = await call('POST', '/auth/register', {
    email: `smoke3${stamp}@example.com`, password: 'Passw0rd!x', username: `smoke3${stamp}`, currentLevel: 'N3',
  });
  const lv3 = await call('GET', '/users/level-status');
  check('sign-up level N3 is persisted (was silently dropped)', reg2.status === 201 && lv3.json?.studyLevel === 'N3', lv3.json);

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
