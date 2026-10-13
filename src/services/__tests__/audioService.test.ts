import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { audioService } from '../audioService';
import { useSettingsStore } from '../../store/settingsStore';

class MockSpeechSynthesisUtterance {
  text: string;
  lang: string = 'ja-JP';
  rate: number = 1.0;
  pitch: number = 1.0;
  volume: number = 1.0;
  voice: any = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: any) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe('audioService — Web Speech API wrapper', () => {
  let mockSynthesis: any;
  let originalSynthesis: any;
  let originalUtterance: any;

  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.getState().resetToDefaults();

    mockSynthesis = {
      getVoices: vi.fn().mockReturnValue([
        { name: 'Kyoko', lang: 'ja-JP', localService: true },
        { name: 'Alex', lang: 'en-US', localService: true },
      ]),
      speak: vi.fn(),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      onvoiceschanged: null,
    };

    originalSynthesis = (window as any).speechSynthesis;
    originalUtterance = (window as any).SpeechSynthesisUtterance;

    (window as any).speechSynthesis = mockSynthesis;
    (window as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

    audioService.synthesis = mockSynthesis;
    audioService.loadVoices();
    audioService.setupVoiceListener();
  });

  afterEach(() => {
    (window as any).speechSynthesis = originalSynthesis;
    (window as any).SpeechSynthesisUtterance = originalUtterance;
  });

  it('detects browser support correctly', () => {
    expect(audioService.isSupported()).toBe(true);
  });

  it('detects Japanese voice availability', () => {
    expect(audioService.hasJapaneseVoice()).toBe(true);
    expect(audioService.japaneseVoice?.name).toBe('Kyoko');
  });

  it('provides voice information diagnostic object', () => {
    const info = audioService.getVoiceInfo();
    expect(info.supported).toBe(true);
    expect(info.hasJapaneseVoice).toBe(true);
    expect(info.japaneseVoice ?? info.selectedVoice).toBe('Kyoko');
  });

  it('triggers onVoicesChanged callback when voices change', () => {
    const listener = vi.fn();
    const unsubscribe = audioService.onVoicesChanged(listener);

    mockSynthesis.onvoiceschanged?.();
    expect(listener).toHaveBeenCalled();

    unsubscribe();
    mockSynthesis.onvoiceschanged?.();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('speaks text with configured options and pulls user settings as defaults', async () => {
    let capturedUtterance: any = null;
    mockSynthesis.speak.mockImplementation((u: any) => {
      capturedUtterance = u;
      setTimeout(() => {
        u.onstart?.();
        u.onend?.();
      }, 0);
    });

    const onStart = vi.fn();
    const onEnd = vi.fn();

    await audioService.speak('こんにちは', {
      rate: 1.2,
      onStart,
      onEnd,
    });

    expect(mockSynthesis.cancel).toHaveBeenCalled();
    expect(mockSynthesis.speak).toHaveBeenCalled();
    expect(capturedUtterance.rate).toBe(1.2);
    expect(onStart).toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalled();
  });

  it('cancels previous utterance and isolates session so stale errors do not break state', async () => {
    let firstUtterance: any = null;
    let secondUtterance: any = null;

    mockSynthesis.speak
      .mockImplementationOnce((u: any) => {
        firstUtterance = u;
      })
      .mockImplementationOnce((u: any) => {
        secondUtterance = u;
      });

    const firstError = vi.fn();
    const secondStart = vi.fn();

    // Start first speech
    audioService.speak('First text', { onError: firstError });
    expect(audioService.currentUtterance).toBe(firstUtterance);

    // Rapid second speech cancels first
    audioService.speak('Second text', { onStart: secondStart });
    expect(audioService.currentUtterance).toBe(secondUtterance);

    // Stale interrupted error from first utterance fires
    firstUtterance.onerror?.({ error: 'interrupted' });

    // Stale error must NOT clear second utterance or invoke error callback
    expect(audioService.currentUtterance).toBe(secondUtterance);
    expect(firstError).not.toHaveBeenCalled();
  });

  it('stops current playback cleanly', () => {
    audioService.isPlaying = true;
    audioService.stop();

    expect(mockSynthesis.cancel).toHaveBeenCalled();
    expect(audioService.isPlaying).toBe(false);
    expect(audioService.currentUtterance).toBeNull();
  });
});
