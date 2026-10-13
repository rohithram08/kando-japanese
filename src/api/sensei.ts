import { get, post } from './client';

export interface SenseiChatResponse {
  message: string;
  emotion: string;
  action?: {
    type: string;
    payload: any;
  };
}

export const chat = (message: string) => 
  post<SenseiChatResponse>('/sensei/chat', { message });

export const getHistory = () => 
  get<any[]>('/sensei/history');

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

