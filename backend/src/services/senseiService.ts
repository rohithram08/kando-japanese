import { db } from '../db/index.js';
import { senseiConversations, senseiTourProgress } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { env } from '../config/env.js';

import { senseiGuardrails, SenseiIntent } from './sensei/senseiGuardrails.js';
import { senseiContext } from './sensei/senseiContext.js';
import { senseiKnowledge } from './sensei/senseiKnowledge.js';
import { buildSenseiSystemPrompt } from './sensei/senseiPrompts.js';

const AVAILABLE_MODELS = [
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b'
];

const GREETING_FALLBACKS: Record<string, string> = {
  ta: "こんにちは！(Konnichiwa!) வணக்கம்! 🌸 வகுப்பறைக்கு உங்களை அன்புடன் வரவேற்கிறேன்! இன்று நாம் ஜப்பானிய மொழியில் எதைப் பற்றி படிக்கலாம்? இலக்கணம், புதிய சொற்கள் அல்லது உரையாடல் பயிற்சி செய்யலாமா? ✨",
  hi: "こんにちは！(Konnichiwa!) नमस्ते! 🌸 जापानी कक्षा में आपका बहुत-बहुत स्वागत है! आज आप क्या सीखना चाहते हैं—व्याकरण, नए शब्द या वाक्य अभ्यास? ✨",
  es: "こんにちは！(Konnichiwa!) ¡Hola! 🌸 ¡Bienvenido a clase! ¿Qué te gustaría practicar hoy: gramática, vocabulario o kanji? ✨",
  fr: "こんにちは！(Konnichiwa!) Bonjour ! 🌸 Bienvenue en classe ! Que souhaites-tu pratiquer aujourd'hui : grammaire, vocabulaire ou kanji ? ✨",
  de: "こんにちは！(Konnichiwa!) Hallo! 🌸 Willkommen im Unterricht! Was möchtest du heute üben: Grammatik, Vokabeln oder Kanji? ✨",
  ko: "こんにちは！(Konnichiwa!) 안녕하세요! 🌸 교실에 오신 것을 환영해요! 오늘 어떤 것을 함께 공부해볼까요? ✨",
  zh: "こんにちは！(Konnichiwa!) 你好！🌸 欢迎来到日语教室！今天想一起练习什么呢？✨",
  en: "こんにちは！(Konnichiwa!) Hello! 🌸 Welcome to class! I am so happy to study with you today. What would you like to practice—grammar, vocabulary, kanji, or conversation? ✨"
};

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

    // 3. User Context Fetch & Multilingual Detection
    let uContext = null;
    try {
      uContext = await senseiContext.getUserContext(userId);
    } catch (ctxErr) {
      console.warn('[SenseiService] Could not fetch user context:', ctxErr);
    }

    // Auto-detect if user's message is in or requests a specific language:
    const containsTamil = /[\u0B80-\u0BFF]/.test(cleanInput) || /\b(tamil|thamizh|tamilil)\b/i.test(cleanInput);
    const containsHindi = /[\u0900-\u097F]/.test(cleanInput) || /\b(hindi|hindustani)\b/i.test(cleanInput);
    const containsTelugu = /[\u0C00-\u0C7F]/.test(cleanInput) || /\b(telugu)\b/i.test(cleanInput);
    const containsMalayalam = /[\u0D00-\u0D7F]/.test(cleanInput) || /\b(malayalam)\b/i.test(cleanInput);
    const containsMarathi = /\b(marathi)\b/i.test(cleanInput);
    const containsFrench = /\b(french|français|francais)\b/i.test(cleanInput);
    const containsGerman = /\b(german|deutsch)\b/i.test(cleanInput);

    let activeLang = requestContext?.explanationLanguage;
    if (containsTamil) activeLang = 'ta';
    else if (containsHindi) activeLang = 'hi';
    else if (containsTelugu) activeLang = 'te';
    else if (containsMalayalam) activeLang = 'ml';
    else if (containsMarathi) activeLang = 'mr';
    else if (containsFrench) activeLang = 'fr';
    else if (containsGerman) activeLang = 'de';

    const safeContext = {
      jlptLevel: uContext?.jlptLevel || 'N5',
      nativeLanguage: uContext?.nativeLanguage || 'English',
      explanationLanguage: activeLang || requestContext?.displayLanguage || uContext?.nativeLanguage || 'English',
      streak: uContext?.streak || 0,
      totalXP: uContext?.totalXP || 0,
      recentLessonIds: uContext?.recentLessonIds || [],
      recentVocabIds: uContext?.recentVocabIds || [],
    };

    // Check if input is a conversational greeting
    const isGreeting = /^(kon+i?chiwa|kon+banwa|ohayou?(\s*gozaimasu)?|hello|hi|hey|greetings|namaste|vanakkam|வணக்கம்|नमस्ते|வணக்கம் சென்சே|नमस्ते टीचर)(\s+(sensei|hana|there|everyone|teacher))?[.!?🌸✨\s]*$/i.test(cleanInput.trim());

    // 4. Platform Knowledge RAG (Skipped for pure greetings to avoid false lesson bias)
    const retrievedItems = isGreeting ? [] : senseiKnowledge.search(cleanInput, safeContext.jlptLevel, 5);

    // 5. System Prompt Construction
    const systemPrompt = buildSenseiSystemPrompt(safeContext, retrievedItems);

    const tools = [
      {
        type: "function",
        function: {
          name: "navigate_to",
          description: "Navigate the user to a specific page ONLY when they explicitly ask to go there (e.g. 'take me to kanji', 'open flashcards'). NEVER call this for greetings.",
          parameters: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The path to navigate to (e.g. /dashboard, /reading, /progress, /kanji, /vocabulary, /review, /dictionary)",
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
          description: "Suggest a specific lesson ONLY when the user explicitly asks for a recommendation or what to study next (e.g. 'what should I study next?', 'which lesson should I do?'). NEVER call this for greetings or general questions.",
          parameters: {
            type: "object",
            properties: {
              lessonId: {
                type: "string",
                description: "The ID of the lesson (e.g. n5l001)",
              },
              lessonTitle: {
                type: "string",
                description: "Human-readable topic title of the lesson (e.g. 'Lesson 1: Basic Greetings')",
              },
              reason: {
                type: "string",
                description: "Why you are suggesting this lesson in the student's designated explanation language.",
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
          description: "Point toward and recommend reviewing pending SRS flashcards ONLY when asked.",
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
          description: "Point toward and recommend practicing Kanji stroke order or radicals ONLY when asked.",
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

    // Contextual recent history (last 4 turns)
    let recentTurns: any[] = [];
    try {
      const historyRows = await db.query.senseiConversations.findMany({
        where: eq(senseiConversations.userId, userId),
        orderBy: [desc(senseiConversations.createdAt)],
        limit: 8,
      });

      const currentLangCode = (safeContext.explanationLanguage || 'en').toLowerCase().slice(0, 2);

      // Filter recent turns to prevent cross-language dialogue inertia:
      // If student is currently learning in Hindi, drop turns that contain Tamil script.
      // If student is currently learning in Tamil, drop turns that contain Devanagari script.
      const compatibleRows = historyRows.filter(r => {
        if (!r.content) return false;
        if (currentLangCode === 'hi' && /[\u0B80-\u0BFF]/.test(r.content)) return false;
        if (currentLangCode === 'ta' && /[\u0900-\u097F]/.test(r.content)) return false;
        return true;
      });

      recentTurns = compatibleRows
        .reverse()
        .filter(r => r.content && r.content !== cleanInput)
        .slice(-4)
        .map(r => ({
          role: r.role === 'assistant' ? 'assistant' : 'user',
          content: r.content
        }));
    } catch (e) {
      // ignore
    }

    const targetLangCode = (safeContext.explanationLanguage || 'en').toLowerCase().slice(0, 2);
    let targetLangName = 'English';
    if (targetLangCode === 'ta') targetLangName = 'Tamil (தமிழ்)';
    else if (targetLangCode === 'hi') targetLangName = 'Hindi (हिंदी)';
    else if (targetLangCode === 'te') targetLangName = 'Telugu (తెలుగు)';
    else if (targetLangCode === 'ml') targetLangName = 'Malayalam (മലയാളം)';
    else if (targetLangCode === 'mr') targetLangName = 'Marathi (मराठी)';
    else if (targetLangCode === 'fr') targetLangName = 'French (Français)';
    else if (targetLangCode === 'de') targetLangName = 'German (Deutsch)';
    else if (targetLangCode === 'es') targetLangName = 'Spanish (Español)';

    const apiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      ...recentTurns,
      {
        role: 'system',
        content: `[MANDATORY EXPLANATION LANGUAGE DIRECTIVE]
The student's designated explanation language for this response is: ${targetLangName}.
1. You MUST speak, explain, and interact with the student exclusively in ${targetLangName}!
2. Do NOT use Tamil, English, or any previous language from earlier turns for explanations!
3. When teaching in Hindi, use authentic Devanagari script (हिंदी लिपि). When teaching in Tamil, use authentic Tamil script (தமிழ்).
4. Japanese vocabulary, kanji, and example sentences should be in Japanese with Kana/Furigana and Romaji.`
      },
      { role: 'user', content: cleanInput }
    ];

    if (isGreeting) {
      apiMessages.push({
        role: 'system',
        content: `Note: The student just greeted you with "${cleanInput}". Reply warmly as Hana-sensei with a joyful, enthusiastic Japanese greeting ("こんにちは！" / "Konnichiwa!") and welcome them to class in ${targetLangName}. Ask what Japanese topic they would like to practice today. Keep it friendly, encouraging, and natural in ${targetLangName}.`
      });
    }

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
            'Authorization': `Bearer ${env.GROQ_API_KEY || process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            temperature: isGreeting ? 0.7 : 0.6,
            ...(isGreeting ? {} : { tools, tool_choice: "auto" })
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

    // Extract standalone emotion/animation tags like [encouraging], [happy], [waving]
    const standaloneTagRegex = /\[(happy|encouraging|thinking|surprised|celebrating|confused|sad|neutral|idle|greeting|waving|talking|teaching|pointing|listening|error)\]/gi;
    const standaloneMatch = parsedMessage.match(standaloneTagRegex);
    if (standaloneMatch && parsedEmotion === 'neutral') {
      parsedEmotion = standaloneMatch[0].replace(/[\[\]]/g, '').toLowerCase();
    }
    parsedMessage = parsedMessage.replace(standaloneTagRegex, '').trim();

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
            const lessonTitle = args?.lessonTitle || 'the next lesson in your curriculum';
            parsedMessage = `I recommend starting ${lessonTitle}! Let's do our best! ✨`;
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

    // Special handling for conversational greetings
    if (isGreeting) {
      const langKey = (safeContext.explanationLanguage || safeContext.nativeLanguage || 'en').toLowerCase().slice(0, 2);
      const greetingFallback = GREETING_FALLBACKS[langKey] || GREETING_FALLBACKS['en'];

      if (!parsedMessage) {
        parsedMessage = greetingFallback;
      }
      if (parsedEmotion === 'neutral') {
        parsedEmotion = 'happy';
      }
      if (parsedAnimation === 'talking') {
        parsedAnimation = 'waving';
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
   * Clear chat history for user
   */
  async clearHistory(userId: string) {
    await db.delete(senseiConversations).where(eq(senseiConversations.userId, userId));
    return { success: true };
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

