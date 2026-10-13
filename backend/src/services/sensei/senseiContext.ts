import { db } from '../../db/index.js';
import { eq, and, desc } from 'drizzle-orm';

export class SenseiContextService {
  
  public async getUserContext(userId: string) {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    if (!user) return null;

    // Get 3 most recently learned lessons
    const recentLessonsProgress = await db.query.userLessonProgress.findMany({
      where: (p, { eq }) => eq(p.userId, userId),
      orderBy: (p, { desc }) => [desc(p.lastAccessedAt)],
      limit: 3,
    });
    
    // Get 5 recently mastered vocab
    const recentVocab = await db.query.userVocabularyProgress.findMany({
      where: (p, { eq, and }) => and(eq(p.userId, userId), eq(p.mastered, true)),
      orderBy: (p, { desc }) => [desc(p.lastReviewedAt)],
      limit: 5,
    });

    return {
      jlptLevel: user.currentLevel || 'N5',
      nativeLanguage: user.nativeLanguage || 'English',
      streak: user.streakDays || 0,
      totalXP: user.xpPoints || 0,
      recentLessonIds: recentLessonsProgress.map(lp => lp.lessonId),
      recentVocabIds: recentVocab.map(v => v.vocabularyId),
    };
  }
}

export const senseiContext = new SenseiContextService();
