import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  audioService,
  detectTextLanguage,
  sanitizeForSpeech,
  findBestVoice,
  isFemaleVoice,
  isMaleVoice,
} from '../audioService';
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

  it('provides localized error messages for audio failure modes', () => {
    // Normal supported state error message
    expect(audioService.getErrorMessage('audio-error')).toBe('Audio playback failed');

    // Unsupported browser state error message
    const origSupported = audioService.isSupported;
    audioService.isSupported = () => false;
    expect(audioService.getErrorMessage()).toBe('Speech synthesis is not supported in this browser');
    audioService.isSupported = origSupported;

    // No Japanese voice state error message
    const origVoice = audioService.japaneseVoice;
    const origVoices = audioService.voices;
    audioService.japaneseVoice = null;
    audioService.voices = [{ name: 'Alex', lang: 'en-US' }] as any;
    expect(audioService.getErrorMessage()).toBe('No Japanese voice available on this device');
    expect(audioService.getVoiceInfo().selectedVoice).toBe('Default Voice');

    // Restore
    audioService.japaneseVoice = origVoice;
    audioService.voices = origVoices;
  });

  describe('Multilingual TTS & Script Auto-Detection', () => {
    it('detects Japanese text and uses Japanese voice', async () => {
      let captured: any = null;
      mockSynthesis.speak.mockImplementation((u: any) => {
        captured = u;
        setTimeout(() => u.onend?.(), 0);
      });

      await audioService.speak('こんにちは！日本語を勉強しましょう。');
      expect(captured.lang).toBe('ja-JP');
      expect(captured.voice?.name).toBe('Kyoko');
    });

    it('detects English grammar explanations and uses English voice, avoiding Japanese accent', async () => {
      let captured: any = null;
      mockSynthesis.speak.mockImplementation((u: any) => {
        captured = u;
        setTimeout(() => u.onend?.(), 0);
      });

      await audioService.speak('The particle は (wa) marks the topic of the sentence while が (ga) marks the subject.');
      expect(captured.lang).toBe('en-US');
      expect(captured.voice?.name).toBe('Alex');
    });

    it('detects Tamil and Hindi scripts accurately', () => {
      expect(detectTextLanguage('வணக்கம், ஜப்பானிய மொழி கற்போம்')).toBe('ta-IN');
      expect(detectTextLanguage('नमस्ते, जापानी भाषा सीखें')).toBe('hi-IN');
      expect(detectTextLanguage('한국어로 말해요')).toBe('ko-KR');
    });
  });

  describe('Speech Sanitization (Emojis, Markdown & Stage Directions)', () => {
    it('strips emojis and pictographs completely', () => {
      const input = 'Konnichiwa! 🌸 Let us learn Japanese! ✨⛩️ Ganbatte! 🎉';
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('🌸');
      expect(clean).not.toContain('✨');
      expect(clean).not.toContain('⛩️');
      expect(clean).not.toContain('🎉');
      expect(clean).toBe('Konnichiwa! Let us learn Japanese! Ganbatte!');
    });

    it('strips markdown headers and bullet points without vocalizing symbols', () => {
      const input = `### 1. は vs が
- **は**: Topic marker
- **が**: Subject marker`;
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('#');
      expect(clean).not.toContain('*');
      expect(clean).not.toContain('-');
      expect(clean).toContain('1. は vs が');
      expect(clean).toContain('は: Topic marker');
      expect(clean).toContain('が: Subject marker');
    });

    it('strips stage actions and bracketed emotions like *smiles warmly* and [encouraging]', () => {
      const input = `[encouraging] *smiles warmly and adjusts glasses* Konnichiwa! *laughs softly* [emotion: happy]`;
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('smiles warmly');
      expect(clean).not.toContain('adjusts glasses');
      expect(clean).not.toContain('laughs softly');
      expect(clean).not.toContain('encouraging');
      expect(clean).not.toContain('emotion');
      expect(clean).toBe('Konnichiwa!');
    });

    it('retains natural text inside bold and italics formatting', () => {
      const input = `The verb **食べる** (*taberu*) means to eat.`;
      const clean = sanitizeForSpeech(input);
      expect(clean).toBe('The verb 食べる (taberu) means to eat.');
    });

    it('handles markdown links, code blocks, and table pipes cleanly', () => {
      const input = `See [Grammar Guide](/grammar) and \`taberu\`.\n| Particle | Meaning |\n| は | Topic |`;
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('|');
      expect(clean).not.toContain('`');
      expect(clean).not.toContain('/grammar');
      expect(clean).toContain('See Grammar Guide and taberu.');
      expect(clean).toContain('Particle Meaning');
    });

    it('sanitizes text before passing to SpeechSynthesisUtterance', async () => {
      let captured: any = null;
      mockSynthesis.speak.mockImplementation((u: any) => {
        captured = u;
        setTimeout(() => u.onend?.(), 0);
      });

      await audioService.speak('### Lesson 1 🌸\n*smiles* **Konnichiwa**!');
      expect(captured.text).toBe('Lesson 1. Konnichiwa!');
      expect(captured.text).not.toContain('#');
      expect(captured.text).not.toContain('🌸');
      expect(captured.text).not.toContain('*');
      expect(captured.pitch).toBe(1.15); // Feminine default pitch
    });
  });

  describe('Female Voice Selection & Gender Balancing', () => {
    const testVoices = [
      { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', localService: true },
      { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', localService: true },
      { name: 'Microsoft Mark Desktop - English (United States)', lang: 'en-US', localService: true },
      { name: 'Microsoft Ichiro Desktop - Japanese (Japan)', lang: 'ja-JP', localService: true },
      { name: 'Microsoft Haruka Desktop - Japanese (Japan)', lang: 'ja-JP', localService: true },
    ] as any;

    it('correctly identifies female and male voices', () => {
      expect(isFemaleVoice({ name: 'Microsoft Zira Desktop' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Microsoft Haruka Desktop' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Google 日本語 Female' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Kyoko' } as any)).toBe(true);

      expect(isMaleVoice({ name: 'Microsoft David Desktop' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Microsoft Ichiro Desktop' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Alex' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Otoya' } as any)).toBe(true);
    });

    it('prioritizes female voice (Zira) over male voice (David) on Windows for English', () => {
      const best = findBestVoice(testVoices, 'en-US');
      expect(best?.name).toBe('Microsoft Zira Desktop - English (United States)');
    });

    it('prioritizes female voice (Haruka) over male voice (Ichiro) on Windows for Japanese', () => {
      const best = findBestVoice(testVoices, 'ja-JP');
      expect(best?.name).toBe('Microsoft Haruka Desktop - Japanese (Japan)');
    });

    it('picks female voice during audioService.speak on multi-voice systems', async () => {
      mockSynthesis.getVoices.mockReturnValue(testVoices);
      audioService.loadVoices();

      let captured: any = null;
      mockSynthesis.speak.mockImplementation((u: any) => {
        captured = u;
        setTimeout(() => u.onend?.(), 0);
      });

      // English explanation
      await audioService.speak('The particle は marks topic.');
      expect(captured.voice?.name).toBe('Microsoft Zira Desktop - English (United States)');

      // Japanese phrase
      await audioService.speak('こんにちは、元気ですか？');
      expect(captured.voice?.name).toBe('Microsoft Haruka Desktop - Japanese (Japan)');
    });
  });
});
