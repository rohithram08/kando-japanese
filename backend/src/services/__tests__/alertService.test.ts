import { describe, it, expect, vi, beforeEach } from 'vitest';

const selectQueue: any[] = [];
const insertValues = vi.fn().mockResolvedValue(undefined);
const updateWhere = vi.fn().mockResolvedValue(undefined);
vi.mock('../../db/index.js', () => ({
  db: {
    // every select chain resolves to the next queued result, whatever the chain shape
    select: vi.fn(() => {
      const chain: any = {};
      for (const m of ['from', 'where', 'innerJoin', 'orderBy', 'limit']) chain[m] = vi.fn(() => chain);
      chain.then = (res: any, rej: any) => Promise.resolve(selectQueue.shift()).then(res, rej);
      return chain;
    }),
    insert: vi.fn(() => ({ values: insertValues })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhere })) })),
  },
}));

import { createAlert, getInbox, markRead, DAILY_SEND_CAP } from '../alertService.js';

describe('alertService', () => {
  beforeEach(() => { selectQueue.length = 0; vi.clearAllMocks(); });

  it('stores an alert when under the cooldown and daily cap', async () => {
    selectQueue.push([{ n: 0 }], [{ n: 3 }]);
    const r = await createAlert('s', 'r', 'cheer');
    expect(r.id).toBeTruthy();
    expect(insertValues).toHaveBeenCalledWith(expect.objectContaining({ senderId: 's', recipientId: 'r', alertType: 'cheer' }));
  });

  it('rejects a repeat of the same alert inside the cooldown (durable, DB-backed)', async () => {
    selectQueue.push([{ n: 1 }]);
    await expect(createAlert('s', 'r', 'study')).rejects.toMatchObject({ statusCode: 429, code: 'ALERT_COOLDOWN' });
    expect(insertValues).not.toHaveBeenCalled();
  });

  it('rejects once the sender hits the daily cap', async () => {
    selectQueue.push([{ n: 0 }], [{ n: DAILY_SEND_CAP }]);
    await expect(createAlert('s', 'r', 'study')).rejects.toMatchObject({ statusCode: 429, code: 'ALERT_DAILY_LIMIT' });
  });

  it('builds the inbox from canned templates and ignores unknown types', async () => {
    selectQueue.push(
      [
        { id: 'a1', alertType: 'cheer', createdAt: new Date(), readAt: null, senderId: 's1', senderName: 'Sakura', avatarConfig: null, avatarId: null, avatarUrl: null },
        { id: 'a2', alertType: 'free_text_hack', createdAt: new Date(), readAt: null, senderId: 's2', senderName: 'X', avatarConfig: null, avatarId: null, avatarUrl: null },
      ],
      [{ n: 2 }],
    );
    const inbox = await getInbox('me');
    expect(inbox.alerts).toHaveLength(1);
    expect(inbox.alerts[0]).toMatchObject({ id: 'a1', text: 'Ganbatte! You can do it! 🌸', read: false, sender: { name: 'Sakura' } });
    expect(inbox.unread).toBe(2);
  });

  it('markRead only issues an update scoped to the recipient', async () => {
    await markRead('me', ['11111111-1111-4111-8111-111111111111']);
    expect(updateWhere).toHaveBeenCalledTimes(1);
  });
});
