import { describe, it, expect } from 'vitest';
import {
  isValidJLPTLevel,
  getLessonsByLevel,
  getLessonDetail,
} from '../lessonContentService.js';

describe('Lesson Content Service', () => {
  it('validates JLPT levels correctly', () => {
    expect(isValidJLPTLevel('N5')).toBe(true);
    expect(isValidJLPTLevel('n5')).toBe(true);
    expect(isValidJLPTLevel('N1')).toBe(true);
    expect(isValidJLPTLevel('N6')).toBe(false);
    expect(isValidJLPTLevel('invalid')).toBe(false);
  });

  it('returns all lessons for N5 level with summaries', () => {
    const lessons = getLessonsByLevel('N5');
    expect(lessons.length).toBe(50);
    expect(lessons[0]).toMatchObject({
      id: 'n5l001',
      level: 'N5',
      day: 1,
      order: 1,
      title: 'Greetings & Self-Introduction',
      titleJp: '挨拶と自己紹介',
    });
  });

  it('returns all lessons for N1-N4 levels', () => {
    ['N1', 'N2', 'N3', 'N4'].forEach((lvl) => {
      const lessons = getLessonsByLevel(lvl);
      expect(lessons.length).toBe(50);
      expect(lessons[0].level).toBe(lvl);
    });
  });

  it('returns empty array for invalid level', () => {
    expect(getLessonsByLevel('N9')).toEqual([]);
  });

  it('fetches full lesson details for N5 day 1', () => {
    const lesson = getLessonDetail('N5', 1);
    expect(lesson).not.toBeNull();
    expect(lesson!.id).toBe('n5l001');
    expect(lesson!.title).toBe('Greetings & Self-Introduction');
    expect(lesson!.vocabulary.length).toBeGreaterThan(0);
    expect(lesson!.grammar.length).toBeGreaterThan(0);
    expect(lesson!.dialogue).toBeDefined();
    expect(lesson!.exercises).toBeDefined();
    expect(lesson!.culturalNote).toBeDefined();
  });

  it('returns null for nonexistent lesson day', () => {
    expect(getLessonDetail('N5', 99)).toBeNull();
    expect(getLessonDetail('N9', 1)).toBeNull();
  });
});
