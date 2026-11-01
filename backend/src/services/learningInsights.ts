/**
 * Adaptive learning insights.
 *
 * Design note - why this is NOT a "learning style" (VARK / visual-auditory-kinesthetic) quiz:
 * the "meshing hypothesis" (teach each person in their preferred style and they learn more) has
 * not held up under controlled testing (Pashler, McDaniel, Rohrer & Bjork, 2008). What the
 * evidence does support is: retrieval practice, spaced and interleaved practice, working at a
 * "desirable difficulty" (Dunlosky et al., 2013; Cepeda et al., 2006; Wilson et al., 2019) and
 * giving everyone multiple modalities. So instead of labelling a learner, we MEASURE what works
 * for them (accuracy per item type / modality / time of day), flag items that are not sticking,
 * and size the daily plan to keep them near the productive-difficulty zone. Every claim below
 * is gated on a minimum sample so we never present noise as a "style".
 *
 * Everything in this file is pure (no DB) so it is unit-testable; the route loads the rows.
 */

export type Modality = 'recall' | 'recognition' | 'listening' | 'writing' | 'reading';

export interface AttemptRow {
  itemType: string;
  itemId: string;
  correct: boolean;
  responseMs: number | null;
  modality: string;
  localHour: number | null;
  createdAt: Date;
}

export const THRESHOLDS = {
  windowDays: 30,
  leechWindowDays: 60,
  leechMinAttempts: 4,
  leechMaxAccuracy: 0.5,
  modalityMinAttempts: 15,
  modalityMinGap: 0.1,
  blockMinAttempts: 15,
  blockMinGap: 0.08,
  confidenceMedium: 30,
  confidenceHigh: 150,
  targetAccuracy: 0.85, // Wilson et al. 2019
  maxResponseMs: 120_000, // ignore idle-tab outliers
} as const;

export const TIME_BLOCKS = [
  { id: 'morning', from: 5, to: 11 },
  { id: 'afternoon', from: 12, to: 17 },
  { id: 'evening', from: 18, to: 22 },
  { id: 'night', from: 23, to: 4 },
] as const;

export function blockForHour(hour: number): (typeof TIME_BLOCKS)[number]['id'] {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  if (h >= 5 && h <= 11) return 'morning';
  if (h >= 12 && h <= 17) return 'afternoon';
  if (h >= 18 && h <= 22) return 'evening';
  return 'night';
}

const round = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;
const rate = (correct: number, total: number) => (total ? correct / total : 0);

export function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

interface Group { attempts: number; correct: number; times: number[] }

function groupBy<T extends string>(rows: AttemptRow[], key: (r: AttemptRow) => T | null) {
  const map = new Map<T, Group>();
  for (const r of rows) {
    const k = key(r);
    if (k === null) continue;
    const g = map.get(k) ?? { attempts: 0, correct: 0, times: [] };
    g.attempts += 1;
    if (r.correct) g.correct += 1;
    if (r.responseMs != null && r.responseMs > 0 && r.responseMs <= THRESHOLDS.maxResponseMs) g.times.push(r.responseMs);
    map.set(k, g);
  }
  return map;
}

export type SuggestionCode =
  | 'collect_more_data'
  | 'review_leeches'
  | 'slow_down_new_items'
  | 'add_new_items'
  | 'prefer_modality'
  | 'schedule_block'
  | 'build_consistency'
  | 'mix_item_types';

export interface Suggestion { code: SuggestionCode; params?: Record<string, string | number> }

export interface Insights {
  windowDays: number;
  sampleSize: number;
  confidence: 'low' | 'medium' | 'high';
  overall: { attempts: number; accuracy: number | null; recentAccuracy: number | null };
  byType: { itemType: string; attempts: number; accuracy: number; medianMs: number | null }[];
  byModality: { modality: string; attempts: number; accuracy: number; medianMs: number | null }[];
  modalitySignal: { best: string; worst: string; gap: number } | null;
  byTimeBlock: { block: string; attempts: number; accuracy: number }[];
  timeSignal: { best: string; gap: number } | null;
  leeches: { itemType: string; itemId: string; attempts: number; accuracy: number }[];
  consistency: { activeDaysLast14: number };
  plan: { newItemsCap: number; interleave: boolean; reviewFirst: boolean; targetAccuracy: number };
  suggestions: Suggestion[];
}

const DAY_MS = 86_400_000;

export function computeInsights(all: AttemptRow[], now: Date = new Date(), timezoneDay?: (d: Date) => string): Insights {
  const T = THRESHOLDS;
  const dayKey = timezoneDay ?? ((d: Date) => d.toISOString().slice(0, 10));
  const winStart = now.getTime() - T.windowDays * DAY_MS;
  const rows = all.filter((r) => r.createdAt.getTime() >= winStart);

  const total = rows.length;
  const correct = rows.filter((r) => r.correct).length;
  const weekStart = now.getTime() - 7 * DAY_MS;
  const week = rows.filter((r) => r.createdAt.getTime() >= weekStart);
  const recentAccuracy = week.length >= 10 ? round(rate(week.filter((r) => r.correct).length, week.length)) : null;

  const confidence: Insights['confidence'] =
    total >= T.confidenceHigh ? 'high' : total >= T.confidenceMedium ? 'medium' : 'low';

  const byType = [...groupBy(rows, (r) => r.itemType)].map(([itemType, g]) => ({
    itemType, attempts: g.attempts, accuracy: round(rate(g.correct, g.attempts)), medianMs: median(g.times),
  })).sort((a, b) => b.attempts - a.attempts);

  const byModality = [...groupBy(rows, (r) => r.modality)].map(([modality, g]) => ({
    modality, attempts: g.attempts, accuracy: round(rate(g.correct, g.attempts)), medianMs: median(g.times),
  })).sort((a, b) => b.attempts - a.attempts);

  // A modality "signal" needs two well-sampled modalities that differ meaningfully.
  const eligible = byModality.filter((m) => m.attempts >= T.modalityMinAttempts);
  let modalitySignal: Insights['modalitySignal'] = null;
  if (eligible.length >= 2) {
    const sorted = [...eligible].sort((a, b) => b.accuracy - a.accuracy);
    const gap = round(sorted[0].accuracy - sorted[sorted.length - 1].accuracy);
    if (gap >= T.modalityMinGap) modalitySignal = { best: sorted[0].modality, worst: sorted[sorted.length - 1].modality, gap };
  }

  const blocks = groupBy(rows, (r) => (r.localHour == null ? null : blockForHour(r.localHour)));
  const byTimeBlock = [...blocks].map(([block, g]) => ({ block, attempts: g.attempts, accuracy: round(rate(g.correct, g.attempts)) }));
  const eligibleBlocks = byTimeBlock.filter((b) => b.attempts >= T.blockMinAttempts).sort((a, b) => b.accuracy - a.accuracy);
  let timeSignal: Insights['timeSignal'] = null;
  if (eligibleBlocks.length >= 2) {
    const gap = round(eligibleBlocks[0].accuracy - eligibleBlocks[eligibleBlocks.length - 1].accuracy);
    if (gap >= T.blockMinGap) timeSignal = { best: eligibleBlocks[0].block, gap };
  }

  // Leeches: items that keep failing. Looked up over a longer window than the headline stats.
  const leechStart = now.getTime() - T.leechWindowDays * DAY_MS;
  const perItem = new Map<string, Group & { itemType: string; itemId: string }>();
  for (const r of all) {
    if (r.createdAt.getTime() < leechStart) continue;
    const k = `${r.itemType}:${r.itemId}`;
    const g = perItem.get(k) ?? { attempts: 0, correct: 0, times: [], itemType: r.itemType, itemId: r.itemId };
    g.attempts += 1;
    if (r.correct) g.correct += 1;
    perItem.set(k, g);
  }
  const leeches = [...perItem.values()]
    .filter((g) => g.attempts >= T.leechMinAttempts && rate(g.correct, g.attempts) < T.leechMaxAccuracy)
    .sort((a, b) => rate(a.correct, a.attempts) - rate(b.correct, b.attempts) || b.attempts - a.attempts)
    .slice(0, 10)
    .map((g) => ({ itemType: g.itemType, itemId: g.itemId, attempts: g.attempts, accuracy: round(rate(g.correct, g.attempts)) }));

  const days14 = new Set(
    all.filter((r) => r.createdAt.getTime() >= now.getTime() - 14 * DAY_MS).map((r) => dayKey(r.createdAt)),
  );

  // Daily plan: keep accuracy near ~85% (neither boring nor discouraging) by throttling NEW items.
  const basis = recentAccuracy ?? (total >= 20 ? round(rate(correct, total)) : null);
  let newItemsCap = 10;
  if (basis !== null) newItemsCap = basis < 0.7 ? 5 : basis < T.targetAccuracy ? 8 : basis < 0.93 ? 12 : 15;
  if (leeches.length >= 5) newItemsCap = Math.min(newItemsCap, 5);

  const suggestions: Suggestion[] = [];
  if (confidence === 'low') suggestions.push({ code: 'collect_more_data', params: { needed: Math.max(0, T.confidenceMedium - total) } });
  if (leeches.length) suggestions.push({ code: 'review_leeches', params: { count: leeches.length } });
  if (basis !== null && basis < 0.7) suggestions.push({ code: 'slow_down_new_items', params: { cap: newItemsCap } });
  if (basis !== null && basis >= 0.93) suggestions.push({ code: 'add_new_items', params: { cap: newItemsCap } });
  if (modalitySignal) suggestions.push({ code: 'prefer_modality', params: { best: modalitySignal.best, worst: modalitySignal.worst, gapPct: Math.round(modalitySignal.gap * 100) } });
  if (timeSignal) suggestions.push({ code: 'schedule_block', params: { block: timeSignal.best, gapPct: Math.round(timeSignal.gap * 100) } });
  if (confidence !== 'low' && days14.size < 5) suggestions.push({ code: 'build_consistency', params: { days: days14.size } });
  if (byType.length === 1 && total >= T.confidenceMedium) suggestions.push({ code: 'mix_item_types', params: { only: byType[0].itemType } });

  return {
    windowDays: T.windowDays,
    sampleSize: total,
    confidence,
    overall: { attempts: total, accuracy: total ? round(rate(correct, total)) : null, recentAccuracy },
    byType, byModality, modalitySignal, byTimeBlock, timeSignal, leeches,
    consistency: { activeDaysLast14: days14.size },
    plan: { newItemsCap, interleave: byType.length > 1, reviewFirst: true, targetAccuracy: T.targetAccuracy },
    suggestions,
  };
}

/** Sources behind the recommendations, shown in the UI so the reasoning is checkable. */
export const EVIDENCE = [
  { id: 'pashler2008', cite: 'Pashler, McDaniel, Rohrer & Bjork (2008). Learning Styles: Concepts and Evidence. Psychological Science in the Public Interest, 9(3).', url: 'https://digitalcommons.usf.edu/psy_facpub/1765/', supports: 'Matching teaching to a "learning style" is not supported; we measure what works for you instead.' },
  { id: 'dunlosky2013', cite: 'Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving Students\' Learning With Effective Learning Techniques. Psychological Science in the Public Interest, 14(1).', url: 'https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html', supports: 'Practice testing and distributed practice rate highest utility; reviews come before new material.' },
  { id: 'wilson2019', cite: 'Wilson, Shenhav, Straccia & Cohen (2019). The Eighty Five Percent Rule for optimal learning. Nature Communications, 10, 4646.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579', supports: 'Learning is fastest when accuracy sits near 85%, so we throttle new items to keep you there.' },
  { id: 'cepeda2006', cite: 'Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3).', url: 'https://doi.org/10.1037/0033-2909.132.3.354', supports: 'Spacing reviews over time beats cramming for long-term retention.' },
] as const;
