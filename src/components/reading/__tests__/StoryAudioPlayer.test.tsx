import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import StoryAudioPlayer from '../StoryAudioPlayer';

describe('StoryAudioPlayer Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders in idle state with Listen button', () => {
    const handlePlay = vi.fn();
    render(
      <StoryAudioPlayer
        isPlaying={false}
        playbackSpeed={1.0}
        autoPlayNext={false}
        onPlay={handlePlay}
      />
    );

    const playBtn = screen.getByRole('button', { name: /Play sentence audio/i });
    expect(playBtn).toBeDefined();
    expect(screen.getByText('Listen')).toBeDefined();

    fireEvent.click(playBtn);
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it('renders in playing state with Pause button', () => {
    const handlePause = vi.fn();
    render(
      <StoryAudioPlayer
        isPlaying={true}
        playbackSpeed={1.0}
        autoPlayNext={false}
        onPause={handlePause}
      />
    );

    const pauseBtn = screen.getByRole('button', { name: /Pause sentence audio/i });
    expect(pauseBtn).toBeDefined();
    expect(screen.getByText('Pause')).toBeDefined();

    fireEvent.click(pauseBtn);
    expect(handlePause).toHaveBeenCalledTimes(1);
  });

  it('triggers replay callback when clicking repeat button', () => {
    const handleReplay = vi.fn();
    render(
      <StoryAudioPlayer
        isPlaying={false}
        onReplay={handleReplay}
      />
    );

    const replayBtn = screen.getByRole('button', { name: /Repeat current sentence/i });
    fireEvent.click(replayBtn);
    expect(handleReplay).toHaveBeenCalledTimes(1);
  });

  it('allows selecting different playback speeds (0.8x, 1.0x, 1.2x)', () => {
    const handleSpeedChange = vi.fn();
    render(
      <StoryAudioPlayer
        playbackSpeed={1.0}
        onSpeedChange={handleSpeedChange}
      />
    );

    const speed08Btn = screen.getByRole('button', { name: /0.8/i });
    const speed12Btn = screen.getByRole('button', { name: /1.2/i });

    fireEvent.click(speed08Btn);
    expect(handleSpeedChange).toHaveBeenCalledWith(0.8);

    fireEvent.click(speed12Btn);
    expect(handleSpeedChange).toHaveBeenCalledWith(1.2);
  });

  it('toggles autoplay next when clicking Autoplay button', () => {
    const handleToggleAutoplay = vi.fn();
    render(
      <StoryAudioPlayer
        autoPlayNext={false}
        onToggleAutoPlayNext={handleToggleAutoplay}
      />
    );

    const autoBtn = screen.getByTitle('Autoplay next sentence disabled');
    fireEvent.click(autoBtn);
    expect(handleToggleAutoplay).toHaveBeenCalledTimes(1);
  });

  it('displays recorded audio strategy badge when activeAudioStrategy is recorded', () => {
    render(
      <StoryAudioPlayer
        activeAudioStrategy="recorded"
      />
    );

    expect(screen.getByText('Recorded Audio')).toBeDefined();
  });

  it('displays ja-JP TTS badge when activeAudioStrategy is synthesis', () => {
    render(
      <StoryAudioPlayer
        activeAudioStrategy="synthesis"
      />
    );

    expect(screen.getByText('ja-JP TTS')).toBeDefined();
  });

  it('displays warning badge when Japanese voice is missing in OS/browser', () => {
    render(
      <StoryAudioPlayer
        isSupported={true}
        hasJapaneseVoice={false}
        activeAudioStrategy="synthesis"
      />
    );

    const warningBadge = screen.getByRole('status');
    expect(warningBadge).toBeDefined();
    expect(warningBadge.getAttribute('title')).toContain('Japanese speech synthesis voice not installed');
  });

  it('displays warning banner when audio is unsupported', () => {
    render(
      <StoryAudioPlayer
        isSupported={false}
      />
    );

    expect(screen.getByText(/Audio synthesis is not supported in this browser/i)).toBeDefined();
  });
});
