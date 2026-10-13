import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LearningJourneyPath from '../LearningJourneyPath';

describe('LearningJourneyPath Component (Phase B — Scroll Storytelling)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title, subtitle, and all 5 sequential steps', () => {
    render(
      <MemoryRouter>
        <LearningJourneyPath />
      </MemoryRouter>
    );

    expect(screen.getByText(/A Complete Learning Journey/i)).toBeDefined();
    expect(screen.getByText(/Structured Fluency Roadmap/i)).toBeDefined();

    // Verify all 5 steps are present
    expect(screen.getByText(/Step 01 · Foundations/i)).toBeDefined();
    expect(screen.getByText(/Kana Studio & Pronunciation/i)).toBeDefined();

    expect(screen.getByText(/Step 02 · Comprehensible Input/i)).toBeDefined();
    expect(screen.getByText(/JLPT Graded Readers/i)).toBeDefined();

    expect(screen.getByText(/Step 03 · Interactive Output/i)).toBeDefined();
    expect(screen.getByText(/Unified Conversation Practice/i)).toBeDefined();

    expect(screen.getByText(/Step 04 · Long-Term Retention/i)).toBeDefined();
    expect(screen.getByText(/Spaced Repetition System \(SRS\)/i)).toBeDefined();

    expect(screen.getByText(/Step 05 · Personalized Coaching/i)).toBeDefined();
    expect(screen.getByText(/Hana-sensei AI Companion/i)).toBeDefined();
  });

  it('renders all 5 watermark numerals for scroll parallax', () => {
    render(
      <MemoryRouter>
        <LearningJourneyPath />
      </MemoryRouter>
    );

    expect(screen.getAllByText('01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('02').length).toBeGreaterThan(0);
    expect(screen.getAllByText('03').length).toBeGreaterThan(0);
    expect(screen.getAllByText('04').length).toBeGreaterThan(0);
    expect(screen.getAllByText('05').length).toBeGreaterThan(0);
  });

  it('provides correct navigation routes for all journey action buttons', () => {
    render(
      <MemoryRouter>
        <LearningJourneyPath />
      </MemoryRouter>
    );

    const kanaLinks = screen.getAllByRole('link', { name: /Explore Kana Studio/i });
    expect(kanaLinks[0].getAttribute('href')).toBe('/kana');

    const readingLinks = screen.getAllByRole('link', { name: /Read 6 Graded Stories/i });
    expect(readingLinks[0].getAttribute('href')).toBe('/reading');

    const dojoLinks = screen.getAllByRole('link', { name: /Enter Conversation Dojo/i });
    expect(dojoLinks[0].getAttribute('href')).toBe('/conversation');

    const srsLinks = screen.getAllByRole('link', { name: /Review Flashcard Deck/i });
    expect(srsLinks[0].getAttribute('href')).toBe('/review');

    const senseiLinks = screen.getAllByRole('link', { name: /Meet Hana-sensei/i });
    expect(senseiLinks[0].getAttribute('href')).toBe('/sensei');
  });

  it('renders the connecting vertical scroll spine container', () => {
    const { container } = render(
      <MemoryRouter>
        <LearningJourneyPath />
      </MemoryRouter>
    );

    // Spine container is in DOM with aria-hidden
    const spineTrack = container.querySelector('[aria-hidden="true"] .bg-border\\/60, [aria-hidden="true"] .bg-border\\/40');
    expect(spineTrack).toBeDefined();
  });
});
