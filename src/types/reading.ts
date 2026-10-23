// src/types/reading.ts
// ─────────────────────────────────────────────────────────────────────────────
// Type definitions for Graded Japanese Reading Experience (Phase 4.1)
// ─────────────────────────────────────────────────────────────────────────────

import type { JLPTLevel } from './models';

export interface SentenceToken {
  text: string;
  surface: string;
  isWord?: boolean;
  vocabKey?: string;
}

export interface StorySentence {
  id: string;
  order: number;
  japanese: string;
  furigana: string; // Authored bracket furigana, e.g. "私[わたし]は 学[がく]生[せい]です。"
  translation: string;
  audioUrl?: string;
  grammarNotes?: string;
  tokens?: SentenceToken[];
  learningElementIds?: string[];
}

export interface VocabularyAnnotation {
  surface: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  jlptLevel: JLPTLevel;
  vocabRefId?: string;
  pitchPattern?: string; // E.g. 'heiban', 'atamadaka', 'nakadaka', 'odaka'
  pitchDropPosition?: number;
  pitchVerified?: boolean;
}

export type LearningElementType = 'vocabulary' | 'grammar' | 'particle' | 'kanji';

export interface LearningElement {
  id: string;
  type: LearningElementType;
  text: string;
  surface?: string;
  reading?: string;
  meaning: string;
  roleInStory: string;
  mechanicsExplanation: string;
  exampleSentence: {
    japanese: string;
    furigana: string;
    english: string;
  };
  jlptLevel?: JLPTLevel;
  pitchPattern?: string;
}

export interface ComprehensionQuestion {
  id: string;
  type?: 'vocabulary' | 'kanji' | 'grammar' | 'particle' | 'comprehension';
  question: string;
  questionFurigana?: string;
  options: string[];
  correctAnswer: number; // 0-indexed index of correct option
  explanation: string;
  wrongExplanations?: Record<number, string>;
  referencedSentenceIndex?: number;
}

export interface GradedStory {
  id: string;
  title: string;
  titleFurigana: string;
  englishTitle: string;
  level: JLPTLevel;
  description: string;
  estimatedMinutes: number;
  published: boolean;
  provenance: {
    author: string;
    license: string;
    curationNotes: string;
    verified: boolean;
  };
  sentences: StorySentence[];
  vocabulary: VocabularyAnnotation[];
  learningElements?: LearningElement[];
  questions: ComprehensionQuestion[];
}

export interface UserReadingProgress {
  id?: string;
  userId?: string;
  storyId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastSentenceIndex: number;
  quizScore?: number | null;
  completedAt?: string | null;
  updatedAt?: string;
}

export interface SaveReadingProgressPayload {
  storyId: string;
  lastSentenceIndex: number;
  status?: 'in_progress' | 'completed';
  quizScore?: number;
}

export interface StoryRewards {
  storyXp: number;
  quizXp: number;
  totalXp: number;
  firstCompletion: boolean;
  alreadyCompleted: boolean;
}

export interface SaveReadingProgressResponse {
  progress: UserReadingProgress;
  /** Total Wave XP paid by this request (0 on retakes / in-progress saves). */
  xpAwarded: number;
  rewards?: StoryRewards;
  streak?: { recorded: boolean; days: number; firstActivityToday: boolean };
  totalXP?: number;
  userLevel?: number;
  /** false for guests and when the server could not be reached. */
  synced?: boolean;
}
