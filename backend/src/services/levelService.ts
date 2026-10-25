/**
 * Level Service
 *
 * Single place for JLPT study-level rules:
 *  - which levels a user may open (cumulative: N3 => N5 + N4 + N3)
 *  - how much of a level the user has covered (drives the "ready to level up" prompt)
 *  - server-side enforcement so locked content cannot be progressed via the API
 *
 * `users.studyLevel` is the gate. It is deliberately separate from
 * `users.currentLevel`, which the progress routes overwrite from total XP.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  users,
  userVocabularyProgress,
  userKanjiProgress,
  userGrammarProgress,
  userReadingProgress,
} from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';

export const LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
export type StudyLevel = (typeof LEVEL_ORDER)[number];

/** Share of a level that must be covered before we suggest levelling up. Tunable. */
export const LEVEL_UP_THRESHOLD = 0.7;

/** Equal-ish weighting so vocabulary (hundreds of items) doesn't drown out grammar. */
export const CATEGORY_WEIGHTS = { vocabulary: 0.35, kanji: 0.25, grammar: 0.25, reading: 0.15 } as const;
export type Category = keyof typeof CATEGORY_WEIGHTS;

export function isStudyLevel(value: unknown): value is StudyLevel {
  return typeof value === 'string' && (LEVEL_ORDER as readonly string[]).includes(value);
}

export function unlockedLevels(level: StudyLevel): StudyLevel[] {
  return LEVEL_ORDER.slice(0, LEVEL_ORDER.indexOf(level) + 1) as StudyLevel[];
}

export function isLevelUnlocked(studyLevel: StudyLevel, target: StudyLevel): boolean {
  return LEVEL_ORDER.indexOf(target) <= LEVEL_ORDER.indexOf(studyLevel);
}

export function nextLevel(level: StudyLevel): StudyLevel | null {
  const i = LEVEL_ORDER.indexOf(level);
  return i >= 0 && i < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[i + 1] : null;
}

/**
 * Content IDs carry their level as a prefix: n5v001, n3k001, n5_g001, n3_001, story_n5_01.
 * Returns null when the level cannot be inferred (callers must then allow the request).
 */
export function levelFromContentId(id: string | null | undefined): StudyLevel | null {
  if (!id) return null;
  const m = /^(?:story_)?n([1-5])(?![0-9])/i.exec(id.trim());
  return m ? (`N${m[1]}` as StudyLevel) : null;
}

// ─── Enforcement ─────────────────────────────────────────────────────────────

export async function getStudyLevel(userId: string): Promise<StudyLevel | null> {
  const row = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { studyLevel: true },
  });
  return isStudyLevel(row?.studyLevel) ? row!.studyLevel : null;
}

/**
 * Throws 403 LEVEL_LOCKED if `contentId` belongs to a level above the user's study level.
 * Lenient by design: unknown id format or missing study level => allowed.
 */
export async function assertContentUnlocked(userId: string, contentId: string): Promise<void> {
  const contentLevel = levelFromContentId(contentId);
  if (!contentLevel) return;
  const studyLevel = await getStudyLevel(userId);
  if (!studyLevel) return;
  if (!isLevelUnlocked(studyLevel, contentLevel)) {
    throw new AppError(
      403,
      `${contentLevel} content is locked. Your study level is ${studyLevel}.`,
      'LEVEL_LOCKED',
    );
  }
}

// ─── Coverage ────────────────────────────────────────────────────────────────

type Totals = Record<StudyLevel, Record<Category, number>>;
let totalsCache: Totals | null = null;

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..', '..'); // backend/{src|dist}/services -> repo root

function countJson(file: string): number {
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (Array.isArray(raw)) return raw.length;
    const list = raw?.items ?? raw?.stories ?? raw?.entries;
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

/** Item counts per level and category, read once from the content files. */
export function getLevelTotals(): Totals {
  if (totalsCache) return totalsCache;
  const totals = {} as Totals;
  for (const level of LEVEL_ORDER) {
    const n = level.toLowerCase();
    totals[level] = {
      vocabulary: countJson(path.join(REPO_ROOT, 'content', 'vocabulary', `${n}.json`)),
      kanji: countJson(path.join(REPO_ROOT, 'content', 'kanji', `${n}.json`)),
      grammar: countJson(path.join(REPO_ROOT, 'content', 'grammar', `${n}.json`)),
      reading: countJson(path.join(REPO_ROOT, 'src', 'data', 'reading', `${n}_stories.json`)),
    };
  }
  totalsCache = totals;
  return totals;
}

/** Test hook. */
export function _resetLevelTotalsCache(): void {
  totalsCache = null;
}

export interface CategoryCoverage {
  done: number;
  total: number;
  percent: number;
}

export interface LevelStatus {
  studyLevel: StudyLevel;
  unlocked: StudyLevel[];
  nextLevel: StudyLevel | null;
  /** Coverage of the user's current study level (null when there are no content totals). */
  coverage: {
    percent: number;
    threshold: number;
    categories: Record<Category, CategoryCoverage>;
  } | null;
  readyToLevelUp: boolean;
}

/**
 * Weighted coverage across categories. Categories with no content (total = 0) are
 * dropped and the remaining weights are renormalised.
 */
export function weightedCoverage(categories: Record<Category, CategoryCoverage>): number {
  let weight = 0;
  let sum = 0;
  for (const key of Object.keys(CATEGORY_WEIGHTS) as Category[]) {
    const c = categories[key];
    if (c.total <= 0) continue;
    weight += CATEGORY_WEIGHTS[key];
    sum += CATEGORY_WEIGHTS[key] * Math.min(1, c.done / c.total);
  }
  return weight === 0 ? 0 : sum / weight;
}

export async function computeLevelStatus(userId: string, studyLevel: StudyLevel): Promise<LevelStatus> {
  const totals = getLevelTotals()[studyLevel];
  const inLevel = (id: string) => levelFromContentId(id) === studyLevel;

  const [vocab, kanji, grammar, reading] = await Promise.all([
    db.select({ id: userVocabularyProgress.vocabularyId, level: userVocabularyProgress.masteryLevel, mastered: userVocabularyProgress.mastered })
      .from(userVocabularyProgress).where(eq(userVocabularyProgress.userId, userId)),
    db.select({ id: userKanjiProgress.kanjiId, level: userKanjiProgress.recognitionLevel, mastered: userKanjiProgress.mastered })
      .from(userKanjiProgress).where(eq(userKanjiProgress.userId, userId)),
    db.select({ id: userGrammarProgress.grammarId, status: userGrammarProgress.status, mastered: userGrammarProgress.mastered })
      .from(userGrammarProgress).where(eq(userGrammarProgress.userId, userId)),
    db.select({ id: userReadingProgress.storyId })
      .from(userReadingProgress)
      .where(and(eq(userReadingProgress.userId, userId), eq(userReadingProgress.status, 'completed'))),
  ]);

  const cat = (done: number, total: number): CategoryCoverage => ({
    done: Math.min(done, total || done),
    total,
    percent: total > 0 ? Math.round((Math.min(done, total) / total) * 100) : 0,
  });

  const categories: Record<Category, CategoryCoverage> = {
    vocabulary: cat(vocab.filter((r) => inLevel(r.id) && (r.mastered || (r.level ?? 0) >= 1)).length, totals.vocabulary),
    kanji: cat(kanji.filter((r) => inLevel(r.id) && (r.mastered || (r.level ?? 0) >= 1)).length, totals.kanji),
    grammar: cat(grammar.filter((r) => inLevel(r.id) && (r.mastered || r.status === 'studied' || r.status === 'mastered')).length, totals.grammar),
    reading: cat(reading.filter((r) => inLevel(r.id)).length, totals.reading),
  };

  const hasContent = Object.values(totals).some((t) => t > 0);
  const fraction = weightedCoverage(categories);
  const next = nextLevel(studyLevel);

  return {
    studyLevel,
    unlocked: unlockedLevels(studyLevel),
    nextLevel: next,
    coverage: hasContent
      ? { percent: Math.round(fraction * 100), threshold: Math.round(LEVEL_UP_THRESHOLD * 100), categories }
      : null,
    readyToLevelUp: hasContent && next !== null && fraction >= LEVEL_UP_THRESHOLD,
  };
}
