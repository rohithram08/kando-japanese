import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { validate } from '../middleware/validate.js';
import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

export const aiRouter = Router();

// ─── Groq API Configuration (SERVER-SIDE ONLY) ──────────────────────────────
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AVAILABLE_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
];

export async function callGroq(messages: Array<{ role: string; content: string }>, maxTokens = 1024): Promise<string> {
  if (!env.GROQ_API_KEY) {
    throw new AppError(503, 'AI service not configured', 'AI_NOT_CONFIGURED');
  }

  let lastError: unknown = null;

  for (const model of AVAILABLE_MODELS) {
    try {
      const response = await axios.post(
        GROQ_URL,
        {
          model,
          messages,
          temperature: 0.7,
          max_tokens: maxTokens,
          top_p: 0.95,
        },
        {
          headers: {
            Authorization: `Bearer ${env.GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        },
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      }
    } catch (error: unknown) {
      lastError = error;
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new AppError(503, 'AI service authentication error', 'AI_AUTH_ERROR');
        }
        if (error.response?.status === 429) {
          console.warn(`[callGroq] Model ${model} rate-limited (429), trying next available model...`);
          continue;
        }
        console.warn(`[callGroq] Model ${model} failed with ${error.response?.status}:`, error.response?.data?.error?.message || error.message);
      }
    }
  }

  if (axios.isAxiosError(lastError)) {
    console.error('Groq API error:', lastError.response?.data || lastError.message);
    if (lastError.response?.status === 429) {
      throw new AppError(429, 'AI rate limit reached across all models. Please wait a moment.', 'AI_RATE_LIMITED');
    }
  }
  throw new AppError(503, 'AI service unavailable', 'AI_UNAVAILABLE');
}

// ─── Chat Start ──────────────────────────────────────────────────────────────

const chatStartSchema = z.object({
  body: z.object({
    systemPrompt: z.string().min(1).max(4000),
    scenario: z.string().min(1).max(500),
  }),
});

aiRouter.post('/chat/start', requireAuth, aiLimiter, validate(chatStartSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { systemPrompt, scenario } = req.body;

    const prompt = `Start the conversation naturally for the scenario: ${scenario}.
Greet the user in Japanese and set the scene.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "message": "Japanese greeting and scene setting",
  "romaji": "romaji reading",
  "translation": "English translation",
  "corrections": null
}`;

    const content = await callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ]);

    res.json({ data: content });
  } catch (err) {
    next(err);
  }
});

// ─── Chat Continue ───────────────────────────────────────────────────────────

const chatSchema = z.object({
  body: z.object({
    messages: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).max(20),
    userMessage: z.string().min(1).max(2000),
    systemPrompt: z.string().min(1).max(4000),
  }),
});

aiRouter.post('/chat', requireAuth, aiLimiter, validate(chatSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, userMessage, systemPrompt } = req.body;

    const historyText = messages
      .slice(-10)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Student' : 'Sensei'}: ${m.content}`)
      .join('\n');

    const prompt = `Conversation history:
${historyText}

The student just said: "${userMessage}"

Check if their Japanese has any grammar mistakes. If yes, include corrections.
Continue the conversation naturally.

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "message": "Your Japanese response here",
  "romaji": "romaji reading of your response",
  "translation": "English translation",
  "corrections": null
}

OR if there are corrections:
{
  "message": "Your Japanese response here",
  "romaji": "romaji reading",
  "translation": "English translation",
  "corrections": {
    "original": "student's incorrect phrase",
    "corrected": "corrected version",
    "explanation": "brief explanation"
  }
}`;

    const content = await callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ]);

    res.json({ data: content });
  } catch (err) {
    next(err);
  }
});

// ─── Writing Check ───────────────────────────────────────────────────────────

const checkWritingSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(5000),
    level: z.string().max(10).default('N5'),
  }),
});

aiRouter.post('/check-writing', requireAuth, aiLimiter, validate(checkWritingSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, level } = req.body;

    const prompt = `Check this Japanese text written by a JLPT ${level} student:

"${text}"

Provide detailed feedback. Return ONLY valid JSON (no markdown):
{
  "overall_score": 85,
  "grammar_score": 80,
  "vocabulary_score": 90,
  "naturalness_score": 85,
  "corrections": [],
  "positive_feedback": "What they did well",
  "improvement_tips": "Specific tips for improvement",
  "native_alternative": "How a native speaker might say this"
}`;

    const content = await callGroq([{ role: 'user', content: prompt }]);
    res.json({ data: content });
  } catch (err) {
    next(err);
  }
});

// ─── Mnemonic Generator ─────────────────────────────────────────────────────

const generateMnemonicSchema = z.object({
  body: z.object({
    kanji: z.string().min(1).max(10),
    meaning: z.string().min(1).max(200),
  }),
});

aiRouter.post('/generate-mnemonic', requireAuth, aiLimiter, validate(generateMnemonicSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { kanji, meaning } = req.body;

    const prompt = `Create a memorable mnemonic story for the kanji:
Kanji: ${kanji}
Meaning: ${meaning}

Make it vivid, funny, or memorable. Under 2 sentences.
Return ONLY valid JSON (no markdown):
{
  "mnemonic": "your mnemonic story here",
  "visual": "describe a visual scene"
}`;

    const content = await callGroq([{ role: 'user', content: prompt }], 512);
    res.json({ data: content });
  } catch (err) {
    next(err);
  }
});

// ─── Quiz Generator ──────────────────────────────────────────────────────────

const generateQuizSchema = z.object({
  body: z.object({
    content: z.unknown(),
    level: z.string().max(10).default('N5'),
    count: z.number().int().min(1).max(20).default(5),
  }),
});

aiRouter.post('/generate-quiz', requireAuth, aiLimiter, validate(generateQuizSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, level, count } = req.body;

    const prompt = `Generate ${count} multiple-choice quiz questions for JLPT ${level} Japanese learners.

Content to test: ${JSON.stringify(content)}

Return ONLY a valid JSON array (no markdown, no extra text):
[
  {
    "question": "Question text",
    "question_jp": "Japanese version if applicable",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this is correct",
    "explanation_jp": "Japanese explanation"
  }
]`;

    const response = await callGroq([{ role: 'user', content: prompt }]);
    res.json({ data: response });
  } catch (err) {
    next(err);
  }
});
