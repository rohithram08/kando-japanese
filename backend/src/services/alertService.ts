/** Peer study alerts: canned messages persisted to a per-learner inbox (no free text, ever). */
import { v4 as uuidv4 } from 'uuid';
import { and, count, desc, eq, gte, inArray, isNull, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { userAlerts, users } from '../db/schema.js';
import { AppError } from '../middleware/errorHandler.js';
import { parseAvatarConfig } from './avatarConfig.js';

export const STUDY_ALERT_TYPES = {
  study: { type: 'study', label: "Let's start studying!", text: "Let's start studying! 📚", icon: '📚' },
  streak: { type: 'streak', label: 'Keep your streak alive!', text: 'Keep your streak alive today! 🔥', icon: '🔥' },
  cheer: { type: 'cheer', label: 'Ganbatte! You can do it!', text: 'Ganbatte! You can do it! 🌸', icon: '🌸' },
  league: { type: 'league', label: 'Great job in the league!', text: 'Great job in the league! Keep climbing! 🏆', icon: '🏆' },
} as const;
export type StudyAlertType = keyof typeof STUDY_ALERT_TYPES;

export const ALERT_COOLDOWN_MS = 60_000; // same sender -> same recipient -> same type
export const DAILY_SEND_CAP = 30; // per sender, anti-spam
export const INBOX_LIMIT = 30;

/** Persists an alert after enforcing the cooldown and daily cap (durable: survives restarts / multiple instances). */
export async function createAlert(senderId: string, recipientId: string, alertType: StudyAlertType) {
  const now = Date.now();
  const [recent] = await db.select({ n: count() }).from(userAlerts).where(and(
    eq(userAlerts.senderId, senderId), eq(userAlerts.recipientId, recipientId), eq(userAlerts.alertType, alertType),
    gte(userAlerts.createdAt, new Date(now - ALERT_COOLDOWN_MS)),
  ));
  if (Number(recent?.n ?? 0) > 0) {
    throw new AppError(429, `Please wait ${Math.ceil(ALERT_COOLDOWN_MS / 1000)}s before sending this alert again`, 'ALERT_COOLDOWN');
  }
  const [today] = await db.select({ n: count() }).from(userAlerts)
    .where(and(eq(userAlerts.senderId, senderId), gte(userAlerts.createdAt, new Date(now - 86_400_000))));
  if (Number(today?.n ?? 0) >= DAILY_SEND_CAP) {
    throw new AppError(429, 'Daily alert limit reached. Try again tomorrow.', 'ALERT_DAILY_LIMIT');
  }
  const id = uuidv4();
  await db.insert(userAlerts).values({ id, recipientId, senderId, alertType });
  return { id, sentAt: new Date(now).toISOString() };
}

export async function getInbox(userId: string, limit = INBOX_LIMIT) {
  const rows = await db.select({
    id: userAlerts.id, alertType: userAlerts.alertType, createdAt: userAlerts.createdAt, readAt: userAlerts.readAt,
    senderId: users.id, senderName: users.username, avatarConfig: users.avatarConfig, avatarId: users.avatarId, avatarUrl: users.avatarUrl,
  }).from(userAlerts)
    .innerJoin(users, eq(users.id, userAlerts.senderId))
    .where(eq(userAlerts.recipientId, userId))
    .orderBy(desc(userAlerts.createdAt))
    .limit(Math.min(Math.max(1, limit), 100));

  const alerts = rows.flatMap((r) => {
    const t = STUDY_ALERT_TYPES[r.alertType as StudyAlertType];
    if (!t) return [];
    return [{
      id: r.id, type: t.type, icon: t.icon, text: t.text, createdAt: r.createdAt, read: r.readAt != null,
      sender: { id: r.senderId, name: r.senderName, avatarConfig: parseAvatarConfig(r.avatarConfig), avatarId: r.avatarId, avatarUrl: r.avatarUrl },
    }];
  });
  const [unread] = await db.select({ n: count() }).from(userAlerts).where(and(eq(userAlerts.recipientId, userId), isNull(userAlerts.readAt)));
  return { alerts, unread: Number(unread?.n ?? 0) };
}

/** Marks the given alerts (or all, when ids is omitted) as read. Only the recipient's own rows are touched. */
export async function markRead(userId: string, ids?: string[]) {
  const where = ids?.length
    ? and(eq(userAlerts.recipientId, userId), isNull(userAlerts.readAt), inArray(userAlerts.id, ids))
    : and(eq(userAlerts.recipientId, userId), isNull(userAlerts.readAt));
  await db.update(userAlerts).set({ readAt: sql`now()` }).where(where);
}
