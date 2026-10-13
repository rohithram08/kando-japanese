import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSRSStore } from '../srsStore';
import * as srsApi from '../../api/srs';

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('SRSStore (Zustand + SRS Intake)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useSRSStore.getState().reset();
  });

  it('initializes deck from API and populates cardRefIds', async () => {
    vi.spyOn(srsApi, 'getAllCards').mockResolvedValue({
      cards: [
        {
          id: 'srs-1',
          userId: 'u1',
          cardType: 'vocabulary',
          cardRefId: 'v_n5_1',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          nextReviewDate: '2026-10-11',
          createdAt: '2026-10-11',
          updatedAt: '2026-10-11',
        },
        {
          id: 'srs-2',
          userId: 'u1',
          cardType: 'kanji',
          cardRefId: '日',
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          nextReviewDate: '2026-10-11',
          createdAt: '2026-10-11',
          updatedAt: '2026-10-11',
        },
      ],
    });

    await useSRSStore.getState().initSRSDeck();

    expect(useSRSStore.getState().initialized).toBe(true);
    expect(useSRSStore.getState().isCardInSRS('v_n5_1')).toBe(true);
    expect(useSRSStore.getState().isCardInSRS('日')).toBe(true);
    expect(useSRSStore.getState().isCardInSRS('v_n5_999')).toBe(false);
  });

  it('adds a card to SRS and optimistically updates cardRefIds set', async () => {
    vi.spyOn(srsApi, 'addCard').mockResolvedValue({
      card: {
        id: 'srs-new',
        userId: 'u1',
        cardType: 'vocabulary',
        cardRefId: 'v_n5_50',
        easeFactor: 2.5,
        intervalDays: 1,
        repetitions: 0,
        nextReviewDate: '2026-10-11',
        createdAt: '2026-10-11',
        updatedAt: '2026-10-11',
      },
    });

    const success = await useSRSStore.getState().addCardToSRS('vocabulary', 'v_n5_50', '新語');
    expect(success).toBe(true);
    expect(useSRSStore.getState().isCardInSRS('v_n5_50')).toBe(true);
  });

  it('prevents duplicate addition if card is already in SRS deck', async () => {
    const addCardSpy = vi.spyOn(srsApi, 'addCard').mockResolvedValue({} as any);

    useSRSStore.setState({
      cardRefIds: new Set(['v_n5_existing']),
      initialized: true,
      loading: false,
    });

    const res = await useSRSStore.getState().addCardToSRS('vocabulary', 'v_n5_existing');
    expect(res).toBe(true);
    expect(addCardSpy).not.toHaveBeenCalled();
  });
});
