import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GrammarPage from '../GrammarPage';
import KanjiPage from '../KanjiPage';

describe('GrammarPage & KanjiPage Rendering', () => {
  it('renders GrammarPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <GrammarPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });

  it('renders KanjiPage without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <KanjiPage />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
