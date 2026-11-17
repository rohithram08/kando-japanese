// src/api/listening.ts
// ─────────────────────────────────────────────────────────────────────────────
// Frontend API Client for JLPT Listening & Verified Study Hours
// ─────────────────────────────────────────────────────────────────────────────

import { get, post } from './client';
import { getStaticScenariosByLevel, STATIC_LISTENING_SCENARIOS } from '../data/listening/scenarios';

export interface StoryboardScene {
  id: string;
  order: number;
  title: string;
  description: string;
  sceneTheme: string;
  captionJa: string;
  captionEn: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: 'clerk' | 'customer' | 'teacher' | 'student' | 'doctor' | 'patient' | 'interviewer' | 'applicant' | 'announcer';
  voiceGender: 'male' | 'female';
  text: string;
  hiragana: string;
  romaji: string;
  en: string;
  sceneIndex: number;
  timeOffsetSec: number;
  durationSec: number;
}

export interface ListeningWord {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  partOfSpeech: string;
  pitchAccent: string;
  exampleSentenceJa: string;
  exampleSentenceEn: string;
}

export interface ChoukaiQuestion {
  id: string;
  mondaiType: 1 | 2 | 3 | 4;
  mondaiLabel: string;
  instructionJa: string;
  instructionEn: string;
  questionJa: string;
  questionEn: string;
  options: Array<{
    id: number;
    textJa: string;
    textEn: string;
  }>;
  correctIndex: number;
  explanation: string;
}

export interface ListeningScenario {
  id: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  durationSeconds: number;
  audioSpeechRate: number;
  storyboard: StoryboardScene[];
  dialogue: DialogueLine[];
  vocabulary: ListeningWord[];
  examQuestions: ChoukaiQuestion[];
  userProgress?: {
    listenedCount: number;
    bestScore: number | null;
    totalSeconds: number;
    lastListenedAt: string;
  } | null;
}

export interface StudySummaryResponse {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  listeningHours: number;
  readingHours: number;
  todayMinutes: number;
  weekMinutes: number;
  totalSessions: number;
  byActivity: Record<
    string,
    {
      activityType: string;
      totalSeconds: number;
      totalMinutes: number;
      hours: number;
      sessionCount: number;
    }
  >;
  weeklyTrend: Array<{
    date: string;
    dayLabel: string;
    totalMinutes: number;
    listeningMinutes: number;
    readingMinutes: number;
    otherMinutes: number;
  }>;
  recentSessions: Array<{
    id: string;
    activityType: string;
    level: string;
    itemId: string;
    durationSeconds: number;
    completed: boolean;
    score: number | null;
    createdAt: string;
  }>;
}

export async function getListeningScenarios(level?: string): Promise<ListeningScenario[]> {
  try {
    const query = level && level !== 'ALL' ? `?level=${level}` : '';
    const response = await get<{ scenarios: ListeningScenario[] }>(`/listening/scenarios${query}`);
    if (response?.scenarios && response.scenarios.length > 0) {
      return response.scenarios;
    }
    return getStaticScenariosByLevel(level);
  } catch (err) {
    console.warn('[getListeningScenarios] API unreachable, falling back to static curriculum:', err);
    return getStaticScenariosByLevel(level);
  }
}

export async function getListeningScenario(id: string): Promise<{
  scenario: ListeningScenario;
  userProgress: ListeningScenario['userProgress'];
}> {
  try {
    return await get<{
      scenario: ListeningScenario;
      userProgress: ListeningScenario['userProgress'];
    }>(`/listening/scenarios/${id}`);
  } catch (err) {
    const fallback = STATIC_LISTENING_SCENARIOS.find((s) => s.id === id) || STATIC_LISTENING_SCENARIOS[0];
    return {
      scenario: fallback,
      userProgress: null,
    };
  }
}

export async function saveListeningProgress(payload: {
  scenarioId: string;
  durationSeconds: number;
  completed?: boolean;
  score?: number | null;
  wordsCheckedCount?: number;
}): Promise<{ success: boolean; awardedXp: number; message: string }> {
  return post<{ success: boolean; awardedXp: number; message: string }>('/listening/progress', payload);
}

export async function logStudySession(payload: {
  activityType: 'listening' | 'reading' | 'grammar' | 'kanji' | 'conversation';
  level?: string;
  itemId: string;
  durationSeconds: number;
  completed?: boolean;
  score?: number | null;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; sessionId: string; awardedXp: number }> {
  return post<{ success: boolean; sessionId: string; awardedXp: number }>(
    '/progress/study-session',
    payload
  );
}

export async function getStudyTimeSummary(): Promise<StudySummaryResponse> {
  return get<StudySummaryResponse>('/progress/study-time');
}
