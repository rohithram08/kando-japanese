// ─── AI API ──────────────────────────────────────────────────────────────────
// All AI requests are proxied through the backend.
// Provider API keys (Groq, OpenAI) NEVER leave the server.

import { post } from './client';
import type {
  AIChatStartRequest,
  AIChatStartResponse,
  AIChatRequest,
  AIChatResponse as AIChatResponseType,
  AICheckWritingRequest,
  AICheckWritingResponse,
  AIGenerateMnemonicRequest,
  AIGenerateMnemonicResponse,
  AIGenerateQuizRequest,
  AIGenerateQuizResponse,
} from '../types/api';

/**
 * Start a new AI chat session.
 */
export function startChat(data: AIChatStartRequest): Promise<AIChatStartResponse> {
  return post<AIChatStartResponse>('/ai/chat/start', data);
}

/**
 * Continue an AI chat conversation.
 */
export function chat(data: AIChatRequest): Promise<AIChatResponseType> {
  return post<AIChatResponseType>('/ai/chat', data);
}

/**
 * Check Japanese writing for grammar, vocabulary, and naturalness.
 */
export function checkWriting(data: AICheckWritingRequest): Promise<AICheckWritingResponse> {
  return post<AICheckWritingResponse>('/ai/check-writing', data);
}

/**
 * Generate a mnemonic story for a kanji character.
 */
export function generateMnemonic(data: AIGenerateMnemonicRequest): Promise<AIGenerateMnemonicResponse> {
  return post<AIGenerateMnemonicResponse>('/ai/generate-mnemonic', data);
}

/**
 * AI-generate quiz questions for given content.
 */
export function generateQuiz(data: AIGenerateQuizRequest): Promise<AIGenerateQuizResponse> {
  return post<AIGenerateQuizResponse>('/ai/generate-quiz', data);
}
