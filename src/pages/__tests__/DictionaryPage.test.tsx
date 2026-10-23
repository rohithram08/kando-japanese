import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DictionaryPage from '../DictionaryPage';
import { detectSearchQuery } from '../../utils/japaneseDetector';

// Mock API
vi.mock('../../api/dictionary', () => ({
  searchDictionary: vi.fn().mockResolvedValue({
    query: '食べる',
    detectedType: 'kanji',
    locale: 'en',
    total: 1,
    results: [
      {
        id: 'curriculum:n5v005',
        word: '食べる',
        reading: 'たべる',
        romaji: 'taberu',
        partOfSpeech: 'Ichidan Verb (一段動詞)',
        level: 'N5',
        isCommon: true,
        meaning: 'to eat',
        meaningEn: 'to eat',
        examples: [
          {
            jp: '寿司を食べます。',
            reading: 'すし を たべます。',
            translation: 'I eat sushi.',
          },
        ],
        source: 'curriculum',
        isCurated: true,
      },
    ],
  }),
}));

describe('DictionaryPage Component', () => {
  it('renders hero, search input, popular suggestions and filter chips', () => {
    render(
      <MemoryRouter>
        <DictionaryPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByPlaceholderText(/Search/i)).toBeDefined();
    expect(screen.getByText('Popular Words to Explore')).toBeDefined();
    expect(screen.getByText('食べる')).toBeDefined();
    expect(screen.getByText('Eat')).toBeDefined();
    expect(screen.getByText('All Results')).toBeDefined();
  });

  it('detects search queries correctly on client', () => {
    expect(detectSearchQuery('食べる', 'English').type).toBe('kanji');
    expect(detectSearchQuery('たべる', 'English').type).toBe('kana');
    expect(detectSearchQuery('taberu', 'English').type).toBe('romaji');
    expect(detectSearchQuery('eat', 'English').type).toBe('meaning');
    expect(detectSearchQuery('சாப்பிடு', 'Tamil').type).toBe('meaning');
  });

  it('performs search and displays rich word card with Furigana and meaning', async () => {
    render(
      <MemoryRouter>
        <DictionaryPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(input, { target: { value: '食べる' } });
    fireEvent.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText('to eat')).toBeDefined();
      expect(screen.getByText(/taberu/i)).toBeDefined();
      expect(screen.getByText('JLPT N5')).toBeDefined();
      expect(screen.getByText(/Sushiを食べます。|寿司を食べます。/)).toBeDefined();
    }, { timeout: 3000 });
  });
});
