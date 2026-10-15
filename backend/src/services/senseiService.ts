import { db } from '../db/index.js';
import { senseiConversations, senseiTourProgress } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

import { senseiGuardrails, SenseiIntent } from './sensei/senseiGuardrails.js';
import { senseiContext } from './sensei/senseiContext.js';
import { senseiKnowledge } from './sensei/senseiKnowledge.js';
import { buildSenseiSystemPrompt } from './sensei/senseiPrompts.js';

const AVAILABLE_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b'
];

export class SenseiService {
  /**
   * Send a message to Sensei and get a response.
   */
  async chat(userId: string, message: string, requestContext?: any) {
    if (!message || typeof message !== 'string' || !message.trim()) {
      return {
        message: "Please enter a question about Japanese learning! 🌸",
        emotion: 'thinking',
        action: null
      };
    }

    const cleanInput = message.trim();

    // 1. Save user message to database
    try {
      await db.insert(senseiConversations).values({
        id: crypto.randomUUID(),
        userId,
        role: 'user',
        content: cleanInput,
      });
    } catch (dbErr) {
      console.error('[SenseiService] Failed to persist user message:', dbErr);
    }

    // 2. Guardrails Classification
    const intent = senseiGuardrails.classify(cleanInput);
    if (intent === SenseiIntent.OUT_OF_DOMAIN || intent === SenseiIntent.PROMPT_INJECTION) {
      const rejectionMessage = senseiGuardrails.getRejectionMessage(intent);
      
      try {
        await db.insert(senseiConversations).values({
          id: crypto.randomUUID(),
          userId,
          role: 'assistant',
          content: rejectionMessage,
          intent: intent,
          emotion: 'error',
        });
      } catch (dbErr) {
        console.error('[SenseiService] Failed to persist guardrail message:', dbErr);
      }

      return {
        message: rejectionMessage,
        emotion: 'error',
        action: null
      };
    }

    // 3. User Context Fetch
    let uContext = null;
    try {
      uContext = await senseiContext.getUserContext(userId);
    } catch (ctxErr) {
      console.warn('[SenseiService] Could not fetch user context:', ctxErr);
    }

    const safeContext = {
      jlptLevel: uContext?.jlptLevel || 'N5',
      nativeLanguage: uContext?.nativeLanguage || 'English',
      explanationLanguage: requestContext?.explanationLanguage || requestContext?.displayLanguage || uContext?.nativeLanguage || 'English',
      streak: uContext?.streak || 0,
      totalXP: uContext?.totalXP || 0,
      recentLessonIds: uContext?.recentLessonIds || [],
      recentVocabIds: uContext?.recentVocabIds || [],
    };

    // 4. Platform Knowledge RAG
    const retrievedItems = senseiKnowledge.search(cleanInput, safeContext.jlptLevel, 5);

    // 5. System Prompt Construction
    const systemPrompt = buildSenseiSystemPrompt(safeContext, retrievedItems);

    const tools = [
      {
        type: "function",
        function: {
          name: "navigate_to",
          description: "Navigate the user to a specific page in the NihonGo Master app.",
          parameters: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The path to navigate to (e.g. /dashboard, /lessons, /quiz, /drama, /progress, /kanji, /vocabulary, /review)",
              }
            },
            required: ["path"],
          },
        }
      },
      {
        type: "function",
        function: {
          name: "suggest_lesson",
          description: "Suggest a specific lesson for the user to study.",
          parameters: {
            type: "object",
            properties: {
              lessonId: {
                type: "string",
                description: "The ID of the lesson (e.g. n5l001)",
              },
              reason: {
                type: "string",
                description: "Why you are suggesting this lesson.",
              }
            },
            required: ["lessonId", "reason"],
          },
        }
      },
      {
        type: "function",
        function: {
          name: "recommend_srs",
          description: "Point toward and recommend reviewing pending SRS flashcards.",
          parameters: {
            type: "object",
            properties: {
              dueCount: { type: "number", description: "Estimated number of due cards" },
              reason: { type: "string", description: "Pedagogical reason for SRS practice" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "recommend_kanji",
          description: "Point toward and recommend practicing Kanji stroke order or radicals.",
          parameters: {
            type: "object",
            properties: {
              kanji: { type: "string", description: "Target kanji character" },
              reason: { type: "string", description: "Reason for studying this kanji" }
            }
          }
        }
      },
      {
        type: "function",
        function: {
          name: "celebrate_milestone",
          description: "Celebrate a learning streak, quiz completion, or achievement.",
          parameters: {
            type: "object",
            properties: {
              achievement: { type: "string", description: "Milestone reached" }
            },
            required: ["achievement"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "start_tour",
          description: "Launch the 9-step academy tour with Hana-sensei.",
          parameters: {
            type: "object",
            properties: {}
          }
        }
      }
    ];

    // 6. Generate response from Groq API with robust model fallback & native fetch
    let rawContent = '';
    let toolCalls: any[] = [];
    let apiSuccess = false;

    for (const model of AVAILABLE_MODELS) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: cleanInput }
            ],
            temperature: 0.6,
            tools,
            tool_choice: "auto"
          }),
          signal: AbortSignal.timeout(30000)
        });

        if (response.ok) {
          const data = await response.json() as any;
          const responseMessage = data?.choices?.[0]?.message;
          rawContent = responseMessage?.content || '';
          toolCalls = responseMessage?.tool_calls || [];
          apiSuccess = true;
          break; // Succeeded
        } else {
          const errData = await response.text();
          console.warn(`[SenseiService] Model ${model} returned ${response.status}:`, errData);
        }
      } catch (err) {
        console.warn(`[SenseiService] Connection failed for model ${model}:`, err);
      }
    }

    // 7. Parse response and extract emotion tag or JSON
    let parsedMessage = rawContent.trim();
    let parsedEmotion = 'neutral';
    let parsedAnimation = 'talking';

    // Check if JSON format was returned
    if (parsedMessage.startsWith('{') && parsedMessage.endsWith('}')) {
      try {
        const json = JSON.parse(parsedMessage);
        if (json.message) parsedMessage = json.message;
        if (json.emotion) parsedEmotion = json.emotion;
        if (json.animation) parsedAnimation = json.animation;
      } catch {
        // keep as text
      }
    }

    // Extract [emotion: <name>] tag if present
    const emotionRegex = /\[emotion:\s*([a-zA-Z]+)\]/i;
    const emotionMatch = parsedMessage.match(emotionRegex);
    if (emotionMatch) {
      parsedEmotion = emotionMatch[1].toLowerCase();
      parsedMessage = parsedMessage.replace(emotionRegex, '').trim();
    }

    // Extract [animation: <name>] tag if present
    const animRegex = /\[animation:\s*([a-zA-Z]+)\]/i;
    const animMatch = parsedMessage.match(animRegex);
    if (animMatch) {
      parsedAnimation = animMatch[1].toLowerCase();
      parsedMessage = parsedMessage.replace(animRegex, '').trim();
    }

    // Fallback emotion & animation heuristic
    if (parsedEmotion === 'neutral') {
      if (parsedMessage.includes('🎉') || parsedMessage.includes('Subarashii') || parsedMessage.includes('Great job') || parsedMessage.includes('Congratulations')) {
        parsedEmotion = 'celebrating';
        parsedAnimation = 'celebrating';
      } else if (parsedMessage.includes('✨') || parsedMessage.includes('Ganbatte') || parsedMessage.includes('🌸') || parsedMessage.includes('応援')) {
        parsedEmotion = 'encouraging';
        parsedAnimation = 'encouraging';
      } else if (parsedMessage.includes('?') || parsedMessage.includes('Let me check') || parsedMessage.includes('Thinking')) {
        parsedEmotion = 'thinking';
        parsedAnimation = 'thinking';
      }
    }

    // Handle tool calling
    let action: any = null;
    if (toolCalls && toolCalls.length > 0) {
      try {
        const tc = toolCalls[0];
        const fnName = tc.function?.name;
        const args = tc.function?.arguments ? JSON.parse(tc.function.arguments) : {};

        if (fnName === 'navigate_to') {
          action = { type: 'navigate', payload: args };
          if (!parsedMessage) {
            parsedMessage = `Let's head over to ${action.payload?.path || 'that page'}! 🌸`;
          }
        } else if (fnName === 'suggest_lesson') {
          action = {
            type: 'suggest_lesson',
            targetId: 'nav-lessons',
            payload: args
          };
          parsedAnimation = 'teaching';
          parsedEmotion = 'encouraging';
          if (!parsedMessage) {
            parsedMessage = `I recommend starting lesson ${args?.lessonId || 'next'}! Let's do our best! ✨`;
          }
        } else if (fnName === 'recommend_srs') {
          action = {
            type: 'point_and_guide',
            targetId: 'nav-review',
            path: '/review',
            label: 'SRS Reviews'
          };
          parsedAnimation = 'pointing';
          parsedEmotion = 'encouraging';
          if (!parsedMessage) {
            parsedMessage = `You have spaced repetition cards ready for review! Let's finish them together. 🌸`;
          }
        } else if (fnName === 'recommend_kanji') {
          action = {
            type: 'point_and_guide',
            targetId: 'nav-kanji',
            path: '/kanji',
            label: 'Kanji Studio'
          };
          parsedAnimation = 'teaching';
          parsedEmotion = 'happy';
          if (!parsedMessage) {
            parsedMessage = `Let's practice Kanji stroke order and radicals in the Kanji Studio! ㊗️`;
          }
        } else if (fnName === 'celebrate_milestone') {
          action = {
            type: 'celebrate',
            payload: args
          };
          parsedAnimation = 'celebrating';
          parsedEmotion = 'celebrating';
          if (!parsedMessage) {
            parsedMessage = `Omedetou gozaimasu! Outstanding milestone achieved! 🎉✨`;
          }
        } else if (fnName === 'start_tour') {
          action = { type: 'tour' };
          parsedAnimation = 'waving';
          parsedEmotion = 'happy';
        }
      } catch (e) {
        console.error('[SenseiService] Failed to parse tool call arguments:', e);
      }
    }

    if (!parsedMessage && !action) {
      parsedMessage = "Konnichiwa! Let's continue practicing Japanese together! 🌸 Ask me anything about grammar, vocabulary, or kanji.";
      parsedEmotion = "encouraging";
      parsedAnimation = "talking";
    }

    // 8. Save AI response to database
    try {
      await db.insert(senseiConversations).values({
        id: crypto.randomUUID(),
        userId,
        role: 'assistant',
        content: parsedMessage,
        intent: action?.type || intent || 'general',
        emotion: parsedEmotion,
      });
    } catch (dbErr) {
      console.error('[SenseiService] Failed to persist assistant response:', dbErr);
    }

    return {
      message: parsedMessage,
      emotion: parsedEmotion,
      animation: parsedAnimation,
      action
    };
  }

  /**
   * Get chat history for user
   */
  async getHistory(userId: string, limit = 50) {
    return await db.query.senseiConversations.findMany({
      where: eq(senseiConversations.userId, userId),
      orderBy: [desc(senseiConversations.createdAt)],
      limit,
    });
  }

  /**
   * Get or initialize tour progress
   */
  async getTourProgress(userId: string) {
    let progress = await db.query.senseiTourProgress.findFirst({
      where: eq(senseiTourProgress.userId, userId),
    });

    if (!progress) {
      await db.insert(senseiTourProgress).values({
        userId,
        currentStep: 0,
      });
      progress = await db.query.senseiTourProgress.findFirst({
        where: eq(senseiTourProgress.userId, userId),
      });
    }

    return progress;
  }

  /**
   * Mark tour as completed
   */
  async completeTour(userId: string) {
    await db
      .insert(senseiTourProgress)
      .values({
        userId,
        currentStep: 8,
        completed: true,
        completedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          currentStep: 8,
          completed: true,
          completedAt: new Date(),
        },
      });

    return { success: true, completed: true };
  }

  /**
   * Mark tour as skipped
   */
  async skipTour(userId: string) {
    await db
      .insert(senseiTourProgress)
      .values({
        userId,
        skipped: true,
        completedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          skipped: true,
          completedAt: new Date(),
        },
      });

    return { success: true, skipped: true };
  }

  /**
   * Generate daily guidance and learning recommendations based on real user progress
   */
  async getDailyGuidance(userId: string) {
    const userCtx = await senseiContext.getUserContext(userId);

    const safeContext = userCtx || {
      jlptLevel: 'N5',
      nativeLanguage: 'English',
      streak: 0,
      totalXP: 0,
      recentLessonIds: [],
      recentVocabIds: [],
    };

    // Calculate due SRS reviews count
    let dueCount = 0;
    try {
      const now = new Date();
      const dueCards = await db.query.srsCards.findMany({
        where: (cards, { eq, and, lte }) =>
          and(
            eq(cards.userId, userId),
            eq(cards.isMastered, false),
            lte(cards.nextReviewDate, now)
          ),
      });
      dueCount = dueCards.length;
    } catch (e) {
      // ignore
    }

    // Recommendation logic
    let greeting = `Konnichiwa! Let's continue your ${safeContext.jlptLevel} journey today! 🌸`;
    let tip = `Consistent daily practice is the key to mastering Japanese.`;
    let recommendedAction = {
      type: 'navigate',
      path: '/lessons',
      label: 'Continue Lessons',
    };

    if (dueCount > 0) {
      tip = `You have ${dueCount} flashcard${dueCount > 1 ? 's' : ''} due for review in your SRS queue! Reviewing now strengthens your memory retention.`;
      recommendedAction = {
        type: 'navigate',
        path: '/review',
        label: `Review ${dueCount} Cards`,
      };
    } else if (safeContext.streak === 0) {
      tip = `Start a learning streak today! Complete just one lesson to light your flame 🔥`;
    } else if (safeContext.streak >= 3) {
      greeting = `Sugoi! You are on a ${safeContext.streak}-day streak! Keep up the momentum! ✨`;
    }

    return {
      greeting,
      tip,
      level: safeContext.jlptLevel,
      streak: safeContext.streak,
      totalXP: safeContext.totalXP,
      dueReviews: dueCount,
      recentLessons: safeContext.recentLessonIds,
      recommendedAction,
      emotion: safeContext.streak >= 3 ? 'celebrating' : dueCount > 0 ? 'encouraging' : 'happy',
    };
  }
}

export const senseiService = new SenseiService();

