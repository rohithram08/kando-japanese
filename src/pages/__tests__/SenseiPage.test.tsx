import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SenseiPage from '../SenseiPage';

describe('SenseiPage Component', () => {
  it('renders SenseiPage without throwing', () => {
    expect(() => {
      render(
        <MemoryRouter>
          <SenseiPage />
        </MemoryRouter>
      );
    }).not.toThrow();
  });
});
