// ============================================================
// store/lessonStore.ts — UNIFIED LESSON & CURRICULUM STORE
// ============================================================

import { create } from 'zustand';
import { getLessons, getLesson } from '../api/lessons';
import { getLessonProgress } from '../api/progress';
import type {
  JLPTLevel,
  Lesson,
  LessonSummary,
  LessonProgress,
} from '../types/models';

export interface LessonSection {
  type: 'intro' | 'vocabulary' | 'kanji' | 'grammar' | 'dialogue' | 'reading' | 'cultural' | 'exercises' | 'complete';
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  items?: any[];
  content?: any;
  stats?: {
    vocab: number;
    kanji: number;
    grammar: number;
  };
  xpReward?: number;
}

export interface LessonState {
  // State
  lessons: Record<string, LessonSummary[]>;
  currentLesson: Lesson | null;
  currentSection: number;
  sections: LessonSection[];
  loading: boolean;
  error: string | null;

  // Components for current lesson
  vocabulary: any[];
  kanji: any[];
  grammar: any[];
  dialogue?: any[];
  exercises?: any[];
  culturalNote?: string;

  // User progress map: { [lessonId]: LessonProgress }
  userProgress: Record<string, LessonProgress>;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadLessons: (level: JLPTLevel) => Promise<void>;
  loadLesson: (level: JLPTLevel, dayNumber: number) => Promise<{
    lesson: Lesson;
    vocabulary: any[];
    kanji: any[];
    grammar: any[];
  } | null>;
  buildSections: (
    lesson: any,
    vocabulary: any[],
    kanji: any[],
    grammar: any[]
  ) => LessonSection[];
  nextSection: () => boolean;
  prevSection: () => boolean;
  goToSection: (index: number) => void;
  loadUserProgress: (userId?: string, level?: JLPTLevel) => Promise<void>;
  getLessonStatus: (
    lessonId: string,
    lessonIndex: number,
    levelLessons: LessonSummary[]
  ) => 'completed' | 'in_progress' | 'available' | 'locked';
  getLevelProgress: (level: JLPTLevel) => number;
  clearLesson: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  // ── Initial State ───────────────────────────────────────
  lessons: {},
  currentLesson: null,
  currentSection: 0,
  sections: [],
  loading: false,
  error: null,
  vocabulary: [],
  kanji: [],
  grammar: [],
  userProgress: {},

  // ── Actions ─────────────────────────────────────────────
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Load lessons list for a JLPT level via Backend API
  loadLessons: async (level: JLPTLevel) => {
    if (get().lessons[level]?.length) return; // already cached

    set({ loading: true, error: null });
    try {
      const res = await getLessons(level);
      const list = res.lessons || [];

      set((state) => ({
        lessons: { ...state.lessons, [level]: list },
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load lessons', loading: false });
    }
  },

  // Load single lesson with full content
  loadLesson: async (level: JLPTLevel, dayNumber: number) => {
    set({ loading: true, error: null });
    try {
      const res: any = await getLesson(level, dayNumber);
      const data = res.lesson || res;

      if (!data) throw new Error('Lesson not found');

      const vocabulary = Array.isArray(data.vocabulary) ? data.vocabulary : [];
      const kanji = Array.isArray(data.kanji) ? data.kanji : [];
      const grammar = Array.isArray(data.grammar) ? data.grammar : [];

      const sections = get().buildSections(data, vocabulary, kanji, grammar);

      set({
        currentLesson: data,
        vocabulary,
        kanji,
        grammar,
        dialogue: data.dialogue || [],
        exercises: data.exercises || [],
        culturalNote: data.culturalNote || '',
        sections,
        currentSection: 0,
        loading: false,
      });

      return { lesson: data, vocabulary, kanji, grammar };
    } catch (err: any) {
      set({ error: err?.message || 'Failed to load lesson', loading: false });
      return null;
    }
  },

  // Build lesson sections array
  buildSections: (lesson: any, vocabulary: any[], kanji: any[], grammar: any[]) => {
    const sections: LessonSection[] = [];

    // 1. Intro section
    sections.push({
      type: 'intro',
      title: lesson.title || lesson.title_en || `Day ${lesson.order || lesson.day || 1}`,
      subtitle: lesson.titleJp || lesson.title_ja || '',
      description: lesson.description || '',
      stats: {
        vocab: vocabulary.length,
        kanji: kanji.length,
        grammar: grammar.length,
      },
    });

    // 2. Vocabulary sections (in chunks of 5)
    if (vocabulary.length > 0) {
      const vocabGroups: any[][] = [];
      for (let i = 0; i < vocabulary.length; i += 5) {
        vocabGroups.push(vocabulary.slice(i, i + 5));
      }
      vocabGroups.forEach((group, index) => {
        sections.push({
          type: 'vocabulary',
          title: `Vocabulary ${vocabGroups.length > 1 ? `(${index + 1}/${vocabGroups.length})` : ''}`,
          icon: '📝',
          items: group,
        });
      });
    }

    // 3. Kanji section
    if (kanji.length > 0) {
      sections.push({
        type: 'kanji',
        title: 'Kanji',
        icon: '漢',
        items: kanji,
      });
    }

    // 4. Grammar section
    if (grammar.length > 0) {
      sections.push({
        type: 'grammar',
        title: 'Grammar Points',
        icon: '📖',
        items: grammar,
      });
    }

    // 5. Dialogue section
    if (lesson.dialogue && lesson.dialogue.length > 0) {
      sections.push({
        type: 'dialogue',
        title: 'Dialogue Practice',
        icon: '💬',
        items: lesson.dialogue,
      });
    }

    // 6. Cultural note section
    if (lesson.culturalNote) {
      sections.push({
        type: 'cultural',
        title: 'Cultural Note',
        icon: '🎌',
        content: lesson.culturalNote,
      });
    }

    // 7. Exercises section
    if (lesson.exercises && lesson.exercises.length > 0) {
      sections.push({
        type: 'exercises',
        title: 'Practice Exercises',
        icon: '✏️',
        items: lesson.exercises,
      });
    }

    // 8. Reading practice (if provided)
    if (lesson.content?.reading) {
      sections.push({
        type: 'reading',
        title: 'Reading Practice',
        icon: '📚',
        content: lesson.content.reading,
      });
    }

    // 9. Complete section
    sections.push({
      type: 'complete',
      title: 'Lesson Complete!',
      xpReward: lesson.xp || lesson.xp_reward || 50,
    });

    return sections;
  },

  // Navigation
  nextSection: () => {
    const { currentSection, sections } = get();
    if (currentSection < sections.length - 1) {
      set({ currentSection: currentSection + 1 });
      return true;
    }
    return false;
  },

  prevSection: () => {
    const { currentSection } = get();
    if (currentSection > 0) {
      set({ currentSection: currentSection - 1 });
      return true;
    }
    return false;
  },

  goToSection: (index: number) => {
    const { sections } = get();
    if (index >= 0 && index < sections.length) {
      set({ currentSection: index });
    }
  },

  // Load user progress for lessons via Backend API
  loadUserProgress: async (userId?: string) => {
    if (!userId) return;
    try {
      const res = await getLessonProgress();
      const progressMap: Record<string, LessonProgress> = {};
      (res.progress || []).forEach((p) => {
        progressMap[p.lessonId] = p;
      });
      set({ userProgress: progressMap });
    } catch (err) {
      console.error('Error loading lesson progress via API:', err);
    }
  },

  // Calculate lesson status (locked/available/in_progress/completed)
  getLessonStatus: (lessonId: string, lessonIndex: number, levelLessons: LessonSummary[]) => {
    const { userProgress } = get();
    const prog = userProgress[lessonId];

    if (prog?.status === 'completed') return 'completed';
    if (prog?.status === 'in_progress') return 'in_progress';
    if (lessonIndex === 0) return 'available';

    const prevLesson = levelLessons[lessonIndex - 1];
    if (prevLesson && userProgress[prevLesson.id]?.status === 'completed') {
      return 'available';
    }
    return 'locked';
  },

  // Get level progress percentage
  getLevelProgress: (level: JLPTLevel) => {
    const { lessons, userProgress } = get();
    const levelLessons = lessons[level] || [];
    if (levelLessons.length === 0) return 0;

    const completed = levelLessons.filter(
      (l) => userProgress[l.id]?.status === 'completed'
    ).length;

    return Math.round((completed / levelLessons.length) * 100);
  },

  // Clear current lesson
  clearLesson: () =>
    set({
      currentLesson: null,
      currentSection: 0,
      sections: [],
      vocabulary: [],
      kanji: [],
      grammar: [],
      dialogue: [],
      exercises: [],
      culturalNote: '',
    }),

  // Full reset
  reset: () =>
    set({
      lessons: {},
      currentLesson: null,
      currentSection: 0,
      sections: [],
      loading: false,
      error: null,
      vocabulary: [],
      kanji: [],
      grammar: [],
      dialogue: [],
      exercises: [],
      culturalNote: '',
      userProgress: {},
    }),
}));
