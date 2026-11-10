import { db } from '../../db/index.js';
import { senseiKnowledge } from './senseiKnowledge.js';
import { senseiConversations, srsCards, userGrammarProgress, userLessonProgress, userVocabularyProgress, users } from '../../db/schema.js';
import { eq, and, desc, lt, lte } from 'drizzle-orm';

export interface SenseiTopicItem {
  id: string;
  title: string;
  type: 'lesson' | 'grammar' | 'vocab' | 'kanji';
  reason?: string;
}

export interface SenseiUserContext {
  userName: string;
  jlptLevel: string;
  studyLevel: string;
  nativeLanguage: string;
  streak: number;
  totalXP: number;
  recentLessonIds: string[];
  recentVocabIds: string[];
  recentLessons: SenseiTopicItem[];
  recentGrammar: SenseiTopicItem[];
  recentVocab: string[];
  weakSpots: SenseiTopicItem[];
  dueReviewsCount: number;
  pastConversationSummary: string;
  lastChatAt: Date | null;
  hoursSinceLastChat: number | null;
  isReturningStudent: boolean;
}

export class SenseiContextService {
  public async getUserContext(userId: string): Promise<SenseiUserContext | null> {
    try {
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!user) return null;

      // 1. Get 4 most recently accessed lessons
      let recentLessons: SenseiTopicItem[] = [];
      let recentLessonIds: string[] = [];
      try {
        const lessonRows = await db.query.userLessonProgress.findMany({
          where: (p, { eq }) => eq(p.userId, userId),
          orderBy: (p, { desc }) => [desc(p.lastAccessedAt)],
          limit: 4,
        });
        recentLessonIds = lessonRows.map(lp => lp.lessonId);
        recentLessons = lessonRows.map(lp => {
          const item = senseiKnowledge.getItemById(lp.lessonId);
          return {
            id: lp.lessonId,
            title: item?.title || `Lesson ${lp.lessonId.toUpperCase()}`,
            type: 'lesson'
          };
        });
      } catch (err) {
        console.warn('[SenseiContext] Failed to load lesson progress:', err);
      }

      // 2. Get 4 most recently studied grammar points
      let recentGrammar: SenseiTopicItem[] = [];
      try {
        const grammarRows = await db.query.userGrammarProgress.findMany({
          where: (p, { eq }) => eq(p.userId, userId),
          orderBy: (p, { desc }) => [desc(p.lastStudiedAt)],
          limit: 4,
        });
        recentGrammar = grammarRows.map(g => {
          const item = senseiKnowledge.getItemById(g.grammarId);
          return {
            id: g.grammarId,
            title: item?.title || `Grammar: ${g.grammarId}`,
            type: 'grammar'
          };
        });
      } catch (err) {
        console.warn('[SenseiContext] Failed to load grammar progress:', err);
      }

      // 3. Get 5 recently mastered vocab
      let recentVocab: string[] = [];
      let recentVocabIds: string[] = [];
      try {
        const vocabRows = await db.query.userVocabularyProgress.findMany({
          where: (p, { eq, and }) => and(eq(p.userId, userId), eq(p.mastered, true)),
          orderBy: (p, { desc }) => [desc(p.lastReviewedAt)],
          limit: 5,
        });
        recentVocabIds = vocabRows.map(v => v.vocabularyId);
        recentVocab = vocabRows.map(v => {
          const item = senseiKnowledge.getItemById(v.vocabularyId);
          return item?.title || v.vocabularyId;
        });
      } catch (err) {
        console.warn('[SenseiContext] Failed to load vocab progress:', err);
      }

      // 4. Calculate SRS due cards and find weak spots (leeches / low ease factor)
      let dueReviewsCount = 0;
      let weakSpots: SenseiTopicItem[] = [];
      try {
        const now = new Date();
        const allUserCards = await db.query.srsCards.findMany({
          where: (cards, { eq }) => eq(cards.userId, userId),
        });

        dueReviewsCount = allUserCards.filter(c => c.nextReviewDate && new Date(c.nextReviewDate) <= now).length;

        // Struggling cards: easeFactor < 2.2
        const lowEase = allUserCards
          .filter(c => c.easeFactor < 2.2)
          .sort((a, b) => a.easeFactor - b.easeFactor)
          .slice(0, 4);

        weakSpots = lowEase.map(c => {
          const item = senseiKnowledge.getItemById(c.cardRefId);
          return {
            id: c.cardRefId,
            title: item?.title || `${c.cardType}: ${c.cardRefId}`,
            type: c.cardType === 'kanji' ? 'kanji' : 'vocab',
            reason: `Struggled with retention (ease factor: ${c.easeFactor.toFixed(1)})`
          };
        });
      } catch (err) {
        console.warn('[SenseiContext] Failed to load SRS status:', err);
      }

      // 5. Past Conversation Memory Digest
      let pastConversationSummary = 'First introductory session with Sensei.';
      let lastChatAt: Date | null = null;
      let hoursSinceLastChat: number | null = null;
      let isReturningStudent = false;

      try {
        const chatRows = await db.query.senseiConversations.findMany({
          where: eq(senseiConversations.userId, userId),
          orderBy: [desc(senseiConversations.createdAt)],
          limit: 12,
        });

        if (chatRows.length > 0) {
          isReturningStudent = true;
          lastChatAt = chatRows[0].createdAt ? new Date(chatRows[0].createdAt) : null;
          if (lastChatAt) {
            hoursSinceLastChat = Math.max(0, Math.round((Date.now() - lastChatAt.getTime()) / (1000 * 60 * 60)));
          }

          // Extract key topics discussed by looking at recent user queries and intents
          const userTopics = chatRows
            .filter(r => r.role === 'user' && r.content && r.content.trim().length > 3)
            .slice(0, 5)
            .map(r => r.content.trim().replace(/\n+/g, ' '));

          if (userTopics.length > 0) {
            pastConversationSummary = `Topics previously discussed or asked by student: ${userTopics.map(t => `"${t}"`).join(', ')}.`;
          }
        }
      } catch (err) {
        console.warn('[SenseiContext] Failed to load conversation history digest:', err);
      }

      return {
        userName: user.username || 'Student',
        jlptLevel: user.currentLevel || 'N5',
        studyLevel: user.studyLevel || user.currentLevel || 'N5',
        nativeLanguage: user.nativeLanguage || 'English',
        streak: user.streakDays || 0,
        totalXP: user.xpPoints || 0,
        recentLessonIds,
        recentVocabIds,
        recentLessons,
        recentGrammar,
        recentVocab,
        weakSpots,
        dueReviewsCount,
        pastConversationSummary,
        lastChatAt,
        hoursSinceLastChat,
        isReturningStudent,
      };
    } catch (globalErr) {
      console.error('[SenseiContext] Error building user context:', globalErr);
      return null;
    }
  }

  /**
   * Generates a warm, highly personalized fresh session greeting for Hana-Sensei
   * addressing the learner by name and seamlessly aware of their streak, level, and review queue.
   */
  public generateFreshGreeting(ctx: SenseiUserContext | null, explanationLanguage = 'en'): string {
    const rawLang = String(explanationLanguage || ctx?.nativeLanguage || 'en').toLowerCase().slice(0, 2);
    const name = ctx?.userName ? `${ctx.userName}-san` : 'Student';
    const streak = ctx?.streak || 0;
    const level = ctx?.jlptLevel || 'N5';
    const dueCount = ctx?.dueReviewsCount || 0;
    const recentTopic = ctx?.recentLessons?.[0]?.title || ctx?.recentGrammar?.[0]?.title;

    if (rawLang === 'ta') {
      if (streak >= 3) {
        return `こんにちは！(Konnichiwa!) மீண்டும் நல்வரவு, ${name}! 🌸 உங்கள் ${streak} நாள் தொடர் சாதனை (Streak) வியக்க வைக்கிறது! 🔥 இன்றைய ${level} பயிற்சியை தொடங்குவோமா? ✨`;
      }
      if (dueCount > 0) {
        return `こんにちは！(Konnichiwa!) வணக்கம், ${name}! 🌸 உங்களிடம் ${dueCount} SRS கார்டுகள் திருப்புதலுக்கு தயாராக உள்ளன. முதலில் அவற்றை முடிக்கலாமா, அல்லது புதிய பாடம் படிக்கலாமா? ✨`;
      }
      if (recentTopic) {
        return `こんにちは！(Konnichiwa!) மீண்டும் நல்வரவு, ${name}! 🌸 கடந்த முறை நாம் "${recentTopic}" பற்றி பார்த்தோம். இன்று எதை பயிற்சி செய்யலாம்? ✨`;
      }
      return `こんにちは！(Konnichiwa!) மீண்டும் நல்வரவு, ${name}! 🌸 உங்கள் ${level} ஜப்பானிய மொழி வகுப்பை தொடங்க நான் தயார்! இன்று இலக்கணம், புதிய சொற்கள் அல்லது உரையாடல் பயிற்சி செய்யலாமா? ✨`;
    }

    if (rawLang === 'hi') {
      if (streak >= 3) {
        return `こんにちは！(Konnichiwa!) फिर से स्वागत है, ${name}! 🌸 आपका ${streak} दिनों का अध्ययन स्ट्रीक बहुत शानदार है! 🔥 क्या आप आज के ${level} अभ्यास के लिए तैयार हैं? ✨`;
      }
      if (dueCount > 0) {
        return `こんにちは！(Konnichiwa!) नमस्ते, ${name}! 🌸 आपके पास अभ्यास के लिए ${dueCount} SRS फ्लैशकार्ड तैयार हैं। आज हम फ्लैशकार्ड्स दोहराएँ या कोई नया विषय सीखें? ✨`;
      }
      if (recentTopic) {
        return `こんにちは！(Konnichiwa!) जापानी कक्षा में स्वागत है, ${name}! 🌸 पिछली बार हमने "${recentTopic}" का अभ्यास किया था। आज आप क्या सीखना चाहेंगे? ✨`;
      }
      return `こんにちは！(Konnichiwa!) जापानी कक्षा में आपका स्वागत है, ${name}! 🌸 आपकी ${level} जापानी यात्रा के लिए मैं पूरी तरह तैयार हूँ। आज हम क्या अभ्यास करेंगे? ✨`;
    }

    // Default English & multilingual
    if (streak >= 3) {
      return `こんにちは！(Konnichiwa!) Welcome back, ${name}! 🌸 You're on an incredible ${streak}-day study streak! 🔥 Ready to keep the momentum going for ${level}? What shall we focus on today? ✨`;
    }
    if (dueCount > 0) {
      return `こんにちは！(Konnichiwa!) Welcome back, ${name}! 🌸 You have ${dueCount} flashcard${dueCount > 1 ? 's' : ''} ready for review in your SRS queue. Would you like to review them first or explore a new topic? ✨`;
    }
    if (recentTopic) {
      return `こんにちは！(Konnichiwa!) Welcome back, ${name}! 🌸 Last session we worked on "${recentTopic}". Ready for today's practice? What would you like to master today? ✨`;
    }
    return `こんにちは！(Konnichiwa!) Welcome back, ${name}! 🌸 I am so happy to see you. Ready to make great progress in your ${level} Japanese journey today? What would you like to practice? ✨`;
  }
}

export const senseiContext = new SenseiContextService();
