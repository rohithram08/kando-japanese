import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KanjiDetailModal from '../KanjiDetailModal';

const mockKanji = {
  id: 'kanji_n5_1',
  kanji: '一',
  meaning: 'One',
  level: 'N5',
  strokeCount: 1,
  radical: '一',
  readings: {
    on: ['イチ', 'イツ'],
    kun: ['ひと', 'ひとつ'],
  },
  examples: [
    { word: '一つ', reading: 'ひとつ', romaji: 'hitotsu', meaning: 'one (general counter)' },
    { word: '一日', reading: 'いちにち', romaji: 'ichinichi', meaning: 'first of the month' },
    { word: '一人', reading: 'ひとり', romaji: 'hitori', meaning: 'one person' },
    { word: '一時', reading: 'いちじ', romaji: 'ichiji', meaning: 'one o\'clock' },
    { word: '一番', reading: 'いちばん', romaji: 'ichiban', meaning: 'number one' },
    { word: '一月', reading: 'いちがつ', romaji: 'ichigatsu', meaning: 'January' },
  ],
};

describe('KanjiDetailModal', () => {
  it('renders modal with two-column layout and all kanji information', () => {
    const handleClose = vi.fn();
    const handleNext = vi.fn();
    const handlePrev = vi.fn();

    render(
      <KanjiDetailModal
        kanji={mockKanji}
        isOpen={true}
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={true}
        hasPrev={true}
      />
    );

    // Kanji character and level badge
    expect(screen.getAllByText('一').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/N5 Kanji/i)).toBeDefined();
    expect(screen.getByText(/1 Strokes/i)).toBeDefined();

    // On'yomi and Kun'yomi readings with Romaji
    expect(screen.getByText(/イチ、イツ/)).toBeDefined();
    expect(screen.getByText(/ichi, itsu/)).toBeDefined();
    expect(screen.getByText(/ひと、ひとつ/)).toBeDefined();
    expect(screen.getByText(/hito, hitotsu/)).toBeDefined();

    // Examples list (all 6 examples)
    expect(screen.getByText('一つ')).toBeDefined();
    expect(screen.getByText('一日')).toBeDefined();
    expect(screen.getByText('一人')).toBeDefined();
    expect(screen.getByText('一時')).toBeDefined();
    expect(screen.getByText('一番')).toBeDefined();
    expect(screen.getByText('一月')).toBeDefined();

    // Stroke Order section
    expect(screen.getAllByText(/Stroke Order/i).length).toBeGreaterThanOrEqual(1);

    // Bottom action bar
    expect(screen.getByText(/Add to SRS/i)).toBeDefined();
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    const doneBtn = screen.getByRole('button', { name: /Done/i });

    expect(prevBtn).toBeDefined();
    expect(nextBtn).toBeDefined();
    expect(doneBtn).toBeDefined();

    // Navigation and Close actions
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);

    fireEvent.click(prevBtn);
    expect(handlePrev).toHaveBeenCalledTimes(1);

    fireEvent.click(doneBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <KanjiDetailModal
        kanji={mockKanji}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container.innerHTML).toBe('');
  });
});
