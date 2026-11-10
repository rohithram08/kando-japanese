import { get, post } from './client';

export interface SenseiChatResponse {
  message: string;
  emotion: string;
  action?: {
    type: string;
    payload: any;
  };
}

export const chat = (message: string, explanationLanguage?: string) => 
  post<SenseiChatResponse>('/sensei/chat', { message, explanationLanguage });

export const getHistory = () => 
  get<any[]>('/sensei/history');

export const clearHistory = () =>
  post<{ success: boolean }>('/sensei/clear');

export const getTourProgress = () => 
  get<any>('/sensei/tour');

export const completeTour = () =>
  post<{ success: boolean; completed: boolean }>('/sensei/tour/complete');

export const skipTour = () =>
  post<{ success: boolean; skipped: boolean }>('/sensei/tour/skip');

export interface SenseiDailyGuidance {
  greeting: string;
  tip: string;
  level: string;
  streak: number;
  totalXP: number;
  dueReviews: number;
  recentLessons: string[];
  recommendedAction: {
    type: string;
    path: string;
    label: string;
  };
  emotion: string;
}

export const getDailyGuidance = () =>
  get<SenseiDailyGuidance>('/sensei/guidance');

export interface SenseiMemoryResponse {
  memory: {
    userName: string;
    jlptLevel: string;
    studyLevel: string;
    nativeLanguage: string;
    streak: number;
    totalXP: number;
    recentLessons: Array<{ id: string; title: string; type: string }>;
    recentGrammar: Array<{ id: string; title: string; type: string }>;
    recentVocab: string[];
    weakSpots: Array<{ id: string; title: string; type: string; reason?: string }>;
    dueReviewsCount: number;
    pastConversationSummary: string;
    hoursSinceLastChat: number | null;
    isReturningStudent: boolean;
  };
  freshGreeting: string;
}

export const getLearnerMemory = (lang?: string) =>
  get<SenseiMemoryResponse>(lang ? `/sensei/memory?lang=${encodeURIComponent(lang)}` : '/sensei/memory');


