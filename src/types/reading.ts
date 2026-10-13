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
  furigana: string; // Authored bracket furigana, e.g. "私[わたし]は　学[がく]生[せい]です。"
  translation: string;
  audioUrl?: string;
  grammarNotes?: string;
  tokens?: SentenceToken[];
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

export interface ComprehensionQuestion {
  id: string;
  question: string;
  questionFurigana?: string;
  options: string[];
  correctAnswer: number; // 0-indexed index of correct option
  explanation: string;
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
