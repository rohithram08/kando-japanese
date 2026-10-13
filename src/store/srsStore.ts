// src/store/srsStore.ts
// Centralized store for managing user's SRS cards, deck membership, and intake operations.

import { create } from 'zustand';
import { getAllCards, addCard, getDueCardCount } from '../api/srs';
import { useProgressStore } from './progressStore';
import { useAuthStore } from './authStore';
import toast from 'react-hot-toast';

const GUEST_SRS_KEY = 'nihongo_guest_srs_deck';

function getGuestDeck(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_SRS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveGuestCard(refId: string) {
  if (typeof window === 'undefined') return;
  try {
    const deck = getGuestDeck();
    if (!deck.includes(refId)) {
      deck.push(refId);
      localStorage.setItem(GUEST_SRS_KEY, JSON.stringify(deck));
    }
  } catch {
    // Ignore localStorage quota failures
  }
}

export interface SRSState {
  cardRefIds: Set<string>;
  initialized: boolean;
  loading: boolean;

  initSRSDeck: () => Promise<void>;
  isCardInSRS: (cardRefId: string) => boolean;
  addCardToSRS: (cardType: 'vocabulary' | 'kanji' | 'kana', cardRefId: string, label?: string) => Promise<boolean>;
  reset: () => void;
}

export const useSRSStore = create<SRSState>((set, get) => ({
  cardRefIds: new Set<string>(),
  initialized: false,
  loading: false,

  initSRSDeck: async () => {
    try {
      set({ loading: true });
      const res = await getAllCards();
      const ids = new Set<string>();
      (res?.cards || []).forEach((c) => {
        if (c.cardRefId) {
          ids.add(c.cardRefId);
          ids.add(c.cardRefId.toLowerCase());
        }
      });
      // Merge local guest cards if any
      const guestIds = getGuestDeck();
      guestIds.forEach((id) => {
        ids.add(id);
        ids.add(id.toLowerCase());
      });
      set({ cardRefIds: ids, initialized: true, loading: false });
    } catch {
      // Unauthenticated or network error — fallback to local
      const guestIds = getGuestDeck();
      const ids = new Set<string>();
      guestIds.forEach((id) => {
        ids.add(id);
        ids.add(id.toLowerCase());
      });
      set({ cardRefIds: ids, loading: false, initialized: true });
    }
  },

  isCardInSRS: (cardRefId: string) => {
    if (!cardRefId) return false;
    const ids = get().cardRefIds;
    return ids.has(cardRefId) || ids.has(cardRefId.toLowerCase());
  },

  addCardToSRS: async (cardType: 'vocabulary' | 'kanji' | 'kana', cardRefId: string, label?: string) => {
    if (!cardRefId) return false;

    // Check if already in deck
    if (get().isCardInSRS(cardRefId)) {
      toast('Card already in SRS deck', { icon: 'ℹ️' });
      return true;
    }

    const user = typeof useAuthStore?.getState === 'function' ? useAuthStore.getState()?.user : null;

    // Attempt backend persistence first (for logged in users or test mocks)
    try {
      await addCard({ cardType, cardRefId });

      // Optimistically update membership
      const nextIds = new Set(get().cardRefIds);
      nextIds.add(cardRefId);
      nextIds.add(cardRefId.toLowerCase());
      set({ cardRefIds: nextIds });

      // Refresh due cards count badge in progress store if available
      try {
        useProgressStore?.getState?.()?.loadSRSDue?.();
      } catch {
        // Ignore store access errors in testing environments
      }

      const display = label || cardRefId;
      toast.success(`Added "${display}" to SRS review deck! 🗂️`);
      return true;
    } catch (err: any) {
      // If unauthenticated, gracefully save to local guest deck
      if (!user || err?.status === 401 || err?.code === 'AUTH_REQUIRED') {
        saveGuestCard(cardRefId);
        const nextIds = new Set(get().cardRefIds);
        nextIds.add(cardRefId);
        nextIds.add(cardRefId.toLowerCase());
        set({ cardRefIds: nextIds });
        const display = label || cardRefId;
        toast.success(`Added "${display}" to local review deck! (Sign in to sync across devices)`, { icon: '🗂️' });
        return true;
      }

      console.error('Failed to add card to SRS:', err);
      toast.error(err?.message || 'Failed to add card to SRS');
      return false;
    }
  },

  reset: () => {
    set({ cardRefIds: new Set<string>(), initialized: false, loading: false });
  },
}));
