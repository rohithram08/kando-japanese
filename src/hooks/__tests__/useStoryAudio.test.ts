import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStoryAudio } from '../useStoryAudio';
import { audioService } from '../../services/audioService';
import { useSettingsStore } from '../../store/settingsStore';
import type { StorySentence } from '../../types/reading';

let voiceCallback: (() => void) | null = null;

vi.mock('../../services/audioService', () => ({
  audioService: {
    speak: vi.fn(),
    stop: vi.fn(),
    isSupported: vi.fn().mockReturnValue(true),
    hasJapaneseVoice: vi.fn().mockReturnValue(true),
    onVoicesChanged: vi.fn().mockImplementation((cb) => {
      voiceCallback = cb;
      return () => {
        voiceCallback = null;
      };
    }),
  },
}));

describe('useStoryAudio Hook', () => {
  const sampleSentences: StorySentence[] = [
    {
      id: 's1',
      order: 1,
      japanese: '私の名前は健です。',
      furigana: '私[わたし]の名[な]前[まえ]は健[けん]です。',
      translation: 'My name is Ken.',
    },
    {
      id: 's2',
      order: 2,
      japanese: '日本語を勉強しています。',
      furigana: '日[に]本[ほん]語[ご]を勉[べん]強[きょう]しています。',
      translation: 'I am studying Japanese.',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    voiceCallback = null;
    useSettingsStore.getState().resetToDefaults();
    vi.mocked(audioService.isSupported).mockReturnValue(true);
    vi.mocked(audioService.hasJapaneseVoice).mockReturnValue(true);
  });

  afterEach(() => {
    useSettingsStore.getState().resetToDefaults();
  });

  it('initializes with default options and detected capabilities', () => {
    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.playbackSpeed).toBe(1.0);
    expect(result.current.autoPlayNext).toBe(false);
    expect(result.current.isSupported).toBe(true);
    expect(result.current.hasJapaneseVoice).toBe(true);
    expect(result.current.activeAudioStrategy).toBe('synthesis');
  });

  it('initializes from persisted settings and updates store on change', () => {
    // Pre-populate settings store
    useSettingsStore.getState().setReaderSpeed(0.8);
    useSettingsStore.getState().setReaderAutoPlayNext(true);

    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    expect(result.current.playbackSpeed).toBe(0.8);
    expect(result.current.autoPlayNext).toBe(true);

    // Change speed via hook
    act(() => {
      result.current.setSpeed(1.2);
    });
    expect(result.current.playbackSpeed).toBe(1.2);
    expect(useSettingsStore.getState().readerSpeed).toBe(1.2);

    // Toggle autoplay via hook
    act(() => {
      result.current.toggleAutoPlayNext();
    });
    expect(result.current.autoPlayNext).toBe(false);
    expect(useSettingsStore.getState().readerAutoPlayNext).toBe(false);
  });

  it('calls audioService.speak when play is invoked', () => {
    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    act(() => {
      result.current.play();
    });

    expect(audioService.speak).toHaveBeenCalledWith(
      '私の名前は健です。',
      expect.objectContaining({
        lang: 'ja-JP',
        rate: 1.0,
      })
    );
  });

  it('stops speech synthesis when pause or stop is called', () => {
    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    act(() => {
      result.current.play();
    });

    act(() => {
      result.current.pause();
    });

    expect(audioService.stop).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('replay starts the current sentence from the beginning', () => {
    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 1,
        onSentenceChange: handleSentenceChange,
      })
    );

    act(() => {
      result.current.replay();
    });

    expect(audioService.stop).toHaveBeenCalled();
    expect(audioService.speak).toHaveBeenCalledWith(
      '日本語を勉強しています。',
      expect.objectContaining({
        lang: 'ja-JP',
        rate: 1.0,
      })
    );
  });

  it('handles rapid repeated playback actions without racing or desyncing state', () => {
    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    // Trigger rapid clicks
    act(() => {
      result.current.play(0);
      result.current.play(1);
      result.current.play(0);
    });

    // Each play stops previous audio before speaking
    expect(audioService.stop).toHaveBeenCalledTimes(3);
    expect(audioService.speak).toHaveBeenLastCalledWith(
      '私の名前は健です。',
      expect.anything()
    );
  });

  it('automatically advances exactly once when autoPlayNext is enabled', () => {
    let capturedOptions: any = null;
    vi.mocked(audioService.speak).mockImplementation((_text: string, options: any) => {
      capturedOptions = options;
      return Promise.resolve();
    });

    const handleSentenceChange = vi.fn();
    const onStoryComplete = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
        onStoryComplete,
      })
    );

    act(() => {
      result.current.toggleAutoPlayNext();
    });

    act(() => {
      result.current.play(0);
    });

    expect(audioService.speak).toHaveBeenCalledWith('私の名前は健です。', expect.anything());

    // Trigger onEnd callback to simulate audio finish for sentence 0
    act(() => {
      capturedOptions?.onEnd?.();
    });

    // Should advance to sentence 1 and invoke speak for sentence 1
    expect(handleSentenceChange).toHaveBeenCalledWith(1);
    expect(audioService.speak).toHaveBeenCalledWith('日本語を勉強しています。', expect.anything());

    // Now trigger onEnd for sentence 1 (the final sentence)
    act(() => {
      capturedOptions?.onEnd?.();
    });

    // Story complete callback fires and playback stops
    expect(onStoryComplete).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(false);
  });

  it('ignores stale onEnd callback from cancelled previous utterance', () => {
    let firstOptions: any = null;
    let secondOptions: any = null;

    vi.mocked(audioService.speak)
      .mockImplementationOnce((_text: string, options: any) => {
        firstOptions = options;
        return Promise.resolve();
      })
      .mockImplementationOnce((_text: string, options: any) => {
        secondOptions = options;
        return Promise.resolve();
      });

    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    act(() => {
      result.current.toggleAutoPlayNext();
    });

    act(() => {
      result.current.play(0);
    });

    // User switches to sentence 1 manually before sentence 0 finishes
    act(() => {
      result.current.play(1);
    });

    // An obsolete async onEnd from sentence 0 fires
    act(() => {
      firstOptions?.onEnd?.();
    });

    // handleSentenceChange should NOT have been called with sentence 1 + 1 = 2
    expect(handleSentenceChange).not.toHaveBeenCalledWith(2);
  });

  it('stops audio and resets isPlaying when sentences change (story switch)', () => {
    const handleSentenceChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ s }) =>
        useStoryAudio({
          sentences: s,
          activeSentenceIndex: 0,
          onSentenceChange: handleSentenceChange,
        }),
      { initialProps: { s: sampleSentences } }
    );

    act(() => {
      result.current.play();
    });

    // Switch story
    const newStorySentences: StorySentence[] = [
      {
        id: 'ns1',
        order: 1,
        japanese: '新しい物語です。',
        translation: 'A new story.',
      },
    ];

    rerender({ s: newStorySentences });

    expect(audioService.stop).toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('stops audio on unmount and prevents state updates', () => {
    const handleSentenceChange = vi.fn();
    const { unmount } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    unmount();
    expect(audioService.stop).toHaveBeenCalled();
  });

  it('handles unsupported audio synthesis gracefully', () => {
    vi.mocked(audioService.isSupported).mockReturnValue(false);

    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    expect(result.current.isSupported).toBe(false);
    expect(result.current.activeAudioStrategy).toBe('none');

    act(() => {
      result.current.play();
    });

    expect(audioService.speak).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('reacts dynamically to voice changes via onVoicesChanged', () => {
    vi.mocked(audioService.hasJapaneseVoice).mockReturnValue(false);

    const handleSentenceChange = vi.fn();
    const { result } = renderHook(() =>
      useStoryAudio({
        sentences: sampleSentences,
        activeSentenceIndex: 0,
        onSentenceChange: handleSentenceChange,
      })
    );

    expect(result.current.hasJapaneseVoice).toBe(false);

    // Simulate voices finishing loading in browser
    vi.mocked(audioService.hasJapaneseVoice).mockReturnValue(true);
    act(() => {
      voiceCallback?.();
    });

    expect(result.current.hasJapaneseVoice).toBe(true);
  });

  it('pauses and resumes recorded audio in-place, and resets on replay', () => {
    const recordedSentences: StorySentence[] = [
      {
        id: 'rs1',
        order: 1,
        japanese: 'こんにちは。',
        translation: 'Hello.',
        audioUrl: '/audio/stories/hello.mp3',
      },
    ];

    const mockAudioInstances: any[] = [];
    const originalAudio = window.Audio;
    (window as any).Audio = class MockAudio {
      src: string;
      playbackRate = 1.0;
      currentTime = 0;
      ended = false;
      onended: any = null;
      onerror: any = null;
      play = vi.fn().mockResolvedValue(undefined);
      pause = vi.fn();
      constructor(src: string) {
        this.src = src;
        mockAudioInstances.push(this);
      }
    };

    try {
      const handleSentenceChange = vi.fn();
      const { result } = renderHook(() =>
        useStoryAudio({
          sentences: recordedSentences,
          activeSentenceIndex: 0,
          onSentenceChange: handleSentenceChange,
        })
      );

      expect(result.current.activeAudioStrategy).toBe('recorded');

      // First play starts fresh audio instance
      act(() => {
        result.current.play();
      });
      expect(mockAudioInstances.length).toBe(1);
      expect(mockAudioInstances[0].play).toHaveBeenCalledTimes(1);

      // Simulate playing for 2.5 seconds
      mockAudioInstances[0].currentTime = 2.5;

      // Pause audio
      act(() => {
        result.current.pause();
      });
      expect(mockAudioInstances[0].pause).toHaveBeenCalled();
      expect(result.current.isPlaying).toBe(false);

      // Resume audio — should reuse existing instance without wiping currentTime
      act(() => {
        result.current.play();
      });
      expect(mockAudioInstances.length).toBe(1);
      expect(mockAudioInstances[0].play).toHaveBeenCalledTimes(2);
      expect(mockAudioInstances[0].currentTime).toBe(2.5);

      // Replay audio — should stop and create fresh instance starting from 0
      act(() => {
        result.current.replay();
      });
      expect(mockAudioInstances.length).toBe(2);
      expect(mockAudioInstances[1].currentTime).toBe(0);
    } finally {
      window.Audio = originalAudio;
    }
  });
});
