import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLessonStore } from '../lessonStore';
import * as lessonsApi from '../../api/lessons';
import * as progressApi from '../../api/progress';

describe('LessonStore (Zustand + Lessons & Progress API)', () => {
  const mockLessonSummary = [
    {
      id: 'n5l001',
      level: 'N5' as const,
      day: 1,
      order: 1,
      title: 'Greetings & Self-Introduction',
      titleJp: '挨拶と自己紹介',
      description: 'Learn basic greetings.',
    },
    {
      id: 'n5l002',
      level: 'N5' as const,
      day: 2,
      order: 2,
      title: 'Numbers & Counting',
      titleJp: '数字と数え方',
      description: 'Learn numbers.',
    },
  ];

  const mockLessonDetail = {
    id: 'n5l001',
    level: 'N5' as const,
    day: 1,
    order: 1,
    title: 'Greetings & Self-Introduction',
    titleJp: '挨拶と自己紹介',
    description: 'Learn basic greetings.',
    vocabulary: [
      { id: 'v1', word: 'こんにちは', reading: 'konnichiwa', meaning: 'Hello' },
      { id: 'v2', word: 'おはよう', reading: 'ohayou', meaning: 'Good morning' },
    ],
    kanji: [
      { id: 'k1', character: '日', meaning: 'sun/day', onyomi: 'ニチ', kunyomi: 'ひ', strokeCount: 4, examples: [] },
    ],
    grammar: [
      { id: 'g1', pattern: '〜です', meaning: 'to be', explanation: 'polite copula', examples: [] },
    ],
    dialogue: [
      { speaker: 'A', jp: 'こんにちは', en: 'Hello' },
    ],
    exercises: [
      { type: 'translate', question: 'Hello', answer: 'こんにちは' },
    ],
    culturalNote: 'Bowing is customary in Japan.',
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    useLessonStore.getState().reset();
  });

  it('loads lessons list and caches by JLPT level', async () => {
    vi.spyOn(lessonsApi, 'getLessons').mockResolvedValueOnce({
      lessons: mockLessonSummary,
    });

    await useLessonStore.getState().loadLessons('N5');

    const state = useLessonStore.getState();
    expect(state.lessons['N5']).toEqual(mockLessonSummary);
    expect(state.loading).toBe(false);
  });

  it('loads lesson detail and builds structured curriculum sections', async () => {
    vi.spyOn(lessonsApi, 'getLesson').mockResolvedValueOnce({
      lesson: mockLessonDetail as any,
    });

    const result = await useLessonStore.getState().loadLesson('N5', 1);

    expect(result).not.toBeNull();
    const state = useLessonStore.getState();
    expect(state.currentLesson).toEqual(mockLessonDetail);
    expect(state.sections.length).toBeGreaterThanOrEqual(4);
    expect(state.sections[0].type).toBe('intro');
    expect(state.sections[state.sections.length - 1].type).toBe('complete');
  });

  it('navigates forward and backward through sections', async () => {
    vi.spyOn(lessonsApi, 'getLesson').mockResolvedValueOnce(mockLessonDetail as any);
    await useLessonStore.getState().loadLesson('N5', 1);

    expect(useLessonStore.getState().currentSection).toBe(0);

    const moved = useLessonStore.getState().nextSection();
    expect(moved).toBe(true);
    expect(useLessonStore.getState().currentSection).toBe(1);

    const movedBack = useLessonStore.getState().prevSection();
    expect(movedBack).toBe(true);
    expect(useLessonStore.getState().currentSection).toBe(0);

    // Cannot move before first section
    expect(useLessonStore.getState().prevSection()).toBe(false);
  });

  it('loads user progress map from progress API', async () => {
    vi.spyOn(progressApi, 'getLessonProgress').mockResolvedValueOnce({
      progress: [
        {
          lessonId: 'n5l001',
          status: 'completed',
          score: 100,
          timeSpentSeconds: 120,
          completedAt: '2026-08-23T00:00:00Z',
        },
      ],
    });

    await useLessonStore.getState().loadUserProgress('user-123');

    const state = useLessonStore.getState();
    expect(state.userProgress['n5l001']).toBeDefined();
    expect(state.userProgress['n5l001'].status).toBe('completed');
  });

  it('evaluates lesson unlocked / available / locked status properly', () => {
    useLessonStore.setState({
      userProgress: {
        n5l001: {
          lessonId: 'n5l001',
          status: 'completed',
          score: 100,
          timeSpentSeconds: 100,
          completedAt: '2026-08-23T00:00:00Z',
        },
      },
    });

    // Lesson 1 is completed
    expect(useLessonStore.getState().getLessonStatus('n5l001', 0, mockLessonSummary)).toBe('completed');

    // Lesson 2 is available (because lesson 1 is completed)
    expect(useLessonStore.getState().getLessonStatus('n5l002', 1, mockLessonSummary)).toBe('available');

    // With no progress, lesson 1 is available (index 0), lesson 2 is locked
    useLessonStore.setState({ userProgress: {} });
    expect(useLessonStore.getState().getLessonStatus('n5l001', 0, mockLessonSummary)).toBe('available');
    expect(useLessonStore.getState().getLessonStatus('n5l002', 1, mockLessonSummary)).toBe('locked');
  });

  it('calculates level completion percentage accurately', () => {
    useLessonStore.setState({
      lessons: { N5: mockLessonSummary },
      userProgress: {
        n5l001: {
          lessonId: 'n5l001',
          status: 'completed',
          score: 100,
          timeSpentSeconds: 100,
          completedAt: '2026-08-23T00:00:00Z',
        },
      },
    });

    // 1 of 2 lessons completed = 50%
    expect(useLessonStore.getState().getLevelProgress('N5')).toBe(50);
  });
});
