import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import HanaSenseiCharacter2D, { HanaAnimationState } from '../HanaSenseiCharacter2D';

describe('HanaSenseiCharacter2D Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    cleanup();
  });

  it('renders in default idle state with proper image and status pill', () => {
    render(<HanaSenseiCharacter2D />);

    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBe('/images/hana-sensei-welcome.png');
    expect(screen.getByText('Ready to assist')).toBeDefined();
    expect(screen.getByText('準備完了')).toBeDefined();
  });

  it('renders all 7 canonical animation states with appropriate metadata', () => {
    const states: HanaAnimationState[] = [
      'idle',
      'greeting',
      'listening',
      'thinking',
      'happy',
      'encouraging',
      'celebrating',
    ];

    states.forEach((state) => {
      const { unmount } = render(<HanaSenseiCharacter2D state={state} />);
      const container = screen.getByRole('region');
      expect(container.innerHTML).toContain(`hana-state-${state}`);
      unmount();
    });
  });

  it('renders speech bubble when speech string is provided', () => {
    render(
      <HanaSenseiCharacter2D
        state="greeting"
        speech={{
          japanese: 'こんにちは！',
          romaji: 'Konnichiwa!',
          english: 'Hello!',
        }}
      />
    );

    expect(screen.getAllByText('こんにちは！').length).toBeGreaterThan(0);
    expect(screen.getByText('Konnichiwa!')).toBeDefined();
    expect(screen.getByText('"Hello!"')).toBeDefined();
  });

  it('invokes onCharacterClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<HanaSenseiCharacter2D onCharacterClick={handleClick} />);

    const img = screen.getByRole('img');
    fireEvent.click(img);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('transitions from celebrating to happy after celebrationDuration', () => {
    render(<HanaSenseiCharacter2D state="celebrating" celebrationDuration={1000} />);

    expect(screen.getByText('Milestone Mastered!')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1050);
    });

    expect(screen.getByText('Great job!')).toBeDefined();
  });

  it('hides status pill when showStatusPill is false', () => {
    render(<HanaSenseiCharacter2D showStatusPill={false} />);
    expect(screen.queryByTestId('hana-status-pill')).toBeNull();
  });

  it('renders thinking state with animated indicator', () => {
    render(<HanaSenseiCharacter2D state="thinking" />);
    expect(screen.getByLabelText('Thinking')).toBeDefined();
    expect(screen.getByText('Composing reply')).toBeDefined();
  });
});
