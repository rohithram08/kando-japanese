import { LESSONS_DATA, RawLesson } from '../data/lessonsData.js';

export interface LessonSummary {
  id: string;
  level: string;
  day: number;
  order: number;
  title: string;
  titleJp: string;
  description: string;
  duration?: string;
  xp?: number;
}

export interface LessonDetail extends RawLesson {
  day: number;
}

const VALID_LEVELS = new Set(['N1', 'N2', 'N3', 'N4', 'N5']);

export function isValidJLPTLevel(level: string): boolean {
  return VALID_LEVELS.has(level.toUpperCase());
}

export function getLessonsByLevel(level: string): LessonSummary[] {
  const normalizedLevel = level.toUpperCase();
  if (!isValidJLPTLevel(normalizedLevel)) {
    return [];
  }

  const lessons = LESSONS_DATA[normalizedLevel] || [];
  return lessons.map((l) => ({
    id: l.id,
    level: l.level,
    day: l.order,
    order: l.order,
    title: l.title,
    titleJp: l.titleJp || '',
    description: l.description || '',
    duration: l.duration,
    xp: l.xp,
  }));
}

export function getLessonDetail(level: string, day: number): LessonDetail | null {
  const normalizedLevel = level.toUpperCase();
  if (!isValidJLPTLevel(normalizedLevel)) {
    return null;
  }

  const lessons = LESSONS_DATA[normalizedLevel] || [];
  const expectedId = `${normalizedLevel.toLowerCase()}l${String(day).padStart(3, '0')}`;
  const found = lessons.find((l) => l.order === day || l.id.toLowerCase() === expectedId);

  if (!found) return null;

  return {
    ...found,
    day: found.order,
    kanji: found.kanji || [],
  };
}
