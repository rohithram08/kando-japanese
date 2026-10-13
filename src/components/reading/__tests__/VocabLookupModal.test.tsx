import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import VocabLookupModal from '../VocabLookupModal';
import { useSRSStore } from '../../../store/srsStore';
import type { VocabularyAnnotation } from '../../../types/reading';

vi.mock('../../../services/audioService', () => ({
  audioService: {
    speak: vi.fn(),
  },
}));

describe('VocabLookupModal Component', () => {
  const mockOnClose = vi.fn();

  const verifiedVocab: VocabularyAnnotation = {
    surface: '学生',
    reading: 'がくせい',
    meaning: 'student',
    partOfSpeech: 'noun',
    jlptLevel: 'N5',
    pitchPattern: 'heiban',
    pitchDropPosition: 0,
    pitchVerified: true,
  };

  const unverifiedVocab: VocabularyAnnotation = {
    surface: '留学生',
    reading: 'りゅうがくせい',
    meaning: 'international student',
    partOfSpeech: 'noun',
    jlptLevel: 'N5',
    pitchVerified: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useSRSStore.setState({
      cardRefIds: new Set<string>(),
      initialized: true,
      loading: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders surface form, reading, meaning, and JLPT level', () => {
    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('N5')).toBeDefined();
    expect(screen.getByText('noun')).toBeDefined();
    expect(screen.getByText('student')).toBeDefined();
    expect(screen.getAllByText('がくせい').length).toBeGreaterThan(0);
  });

  it('renders verified pitch contour visualizer for verified word', () => {
    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    // Should render pitch visualizer section without the unverified warning
    expect(screen.queryByText(/Pitch accent data awaiting verified/i)).toBeNull();
  });

  it('renders honest unverified banner when pitch data is absent', () => {
    render(
      <VocabLookupModal
        vocab={unverifiedVocab}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Pitch accent data awaiting verified dictionary entry/i)).toBeDefined();
  });

  it('closes modal when Escape key is pressed', () => {
    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal when Close (X) button is clicked', () => {
    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    const closeBtn = screen.getByLabelText('Close vocabulary details');
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays "In SRS Review Deck" when card is already in user deck', () => {
    useSRSStore.setState({
      cardRefIds: new Set(['学生', 'がくせい']),
    });

    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    const btn = screen.getByRole('button', { name: /In SRS Review Deck/i });
    expect(btn).toBeDefined();
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  it('adds card to SRS deck and updates button state on click', async () => {
    const addSpy = vi.fn().mockImplementation(async () => {
      useSRSStore.setState((s) => ({
        cardRefIds: new Set([...s.cardRefIds, '学生']),
      }));
      return true;
    });

    useSRSStore.setState({
      addCardToSRS: addSpy,
      cardRefIds: new Set(),
    });

    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add to SRS Deck/i });
    fireEvent.click(addBtn);

    expect(addSpy).toHaveBeenCalledWith('vocabulary', '学生', '学生');

    await waitFor(() => {
      expect(screen.getByText(/In SRS Review Deck/i)).toBeDefined();
    });
  });

  it('handles addCardToSRS error and displays error message with retry', async () => {
    const addSpy = vi.fn().mockResolvedValue(false);

    useSRSStore.setState({
      addCardToSRS: addSpy,
      cardRefIds: new Set(),
    });

    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    const addBtn = screen.getByRole('button', { name: /Add to SRS Deck/i });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText(/Failed to add card/i)).toBeDefined();
    });
  });

  it('traps Tab and Shift+Tab focus inside the modal dialog', () => {
    render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    const closeBtn = screen.getByLabelText('Close vocabulary details');
    const srsBtn = screen.getByRole('button', { name: /Add to SRS Deck/i });

    // Focus close button (first element)
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    // Shift+Tab from first element wraps to last element (SRS button)
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(srsBtn);

    // Tab from last element wraps to first element (Close button)
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(closeBtn);
  });

  it('restores focus to trigger element upon closing', () => {
    // Create an external trigger button
    const trigger = document.createElement('button');
    trigger.setAttribute('data-testid', 'word-trigger');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { unmount } = render(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );

    // While open, modal or its child has focus
    // Unmount modal to simulate dismiss
    unmount();

    expect(document.activeElement).toBe(trigger);
    document.body.removeChild(trigger);
  });

  it('safely handles transitioning between null and populated vocab without React hook order violations', () => {
    const { rerender } = render(
      <VocabLookupModal
        vocab={null}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByRole('dialog')).toBeNull();

    // Rerender with populated vocab
    rerender(
      <VocabLookupModal
        vocab={verifiedVocab}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('学生')).toBeDefined();

    // Rerender back to null
    rerender(
      <VocabLookupModal
        vocab={null}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
