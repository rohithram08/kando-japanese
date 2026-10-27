import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GrammarPage from '../GrammarPage';
import KanjiPage from '../KanjiPage';
import VocabularyPage from '../VocabularyPage';

describe('Curriculum Study Pages Rendering', () => {
  it('renders VocabularyPage with thematic categories without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <VocabularyPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
    expect(container.textContent).toContain('Vocabulary');
  });

  it('renders GrammarPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <GrammarPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
    expect(container.textContent).toContain('Grammar');
  });

  it('renders KanjiPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <KanjiPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
    expect(container.textContent).toContain('Kanji Study');
  });
});
