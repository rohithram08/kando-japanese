import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import LandingPage from '../LandingPage';

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Root Landing Route Instant Redirect', () => {
  it('immediately redirects authenticated users to /dashboard without rendering landing hero', () => {
    // Mock user as logged in
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 'u1', username: 'Rohith', email: 'rohith@test.com' },
      loading: false,
      initialized: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<div>Dashboard Screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Should immediately show Dashboard Screen
    expect(screen.getByText('Dashboard Screen')).toBeTruthy();
    // Landing page text should NOT be rendered
    expect(screen.queryByText(/Continue to Your Dashboard/i)).toBeNull();
    expect(screen.queryByText(/Learn Japanese\. Live the Language\./i)).toBeNull();
  });
});
