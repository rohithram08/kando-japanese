import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  audioService,
  detectTextLanguage,
  detectBaseLanguage,
  sanitizeForSpeech,
  findBestVoice,
  isFemaleVoice,
  isMaleVoice,
  segmentMultilingualText,
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

    it('ensures English sentences with numbers use en-US so digits are never spoken in Tamil', () => {
      const sentence = 'I am so proud that you have kept your 3-day streak alive in Lesson 38!';
      // Even if userPreferredLocale was 'ta', the text itself is in English!
      expect(detectBaseLanguage(sentence, 'ta')).toBe('en-US');

      const segments = segmentMultilingualText(sentence, detectBaseLanguage(sentence, 'ta'));
      expect(segments.length).toBe(1);
      expect(segments[0].lang).toBe('en-US');
      expect(segments[0].text).toContain('3-day streak');
      expect(segments[0].text).toContain('Lesson 38');
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

    it('strips grammatical labels in brackets like [noun], [topic], [particle], and [verb]', () => {
      const input = 'She [noun] is cute, and she [topic] is a student.';
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('noun');
      expect(clean).not.toContain('topic');
      expect(clean).toBe('She is cute, and she is a student.');
    });

    it('strips redundant Romaji in parentheses right after Japanese words so speech does not repeat readings', () => {
      const input = `Water = お水 (omizu)\n"Please give me water" = お水を**ください** (Omizu o **kudasai**)\n"Please show me [the way]" = 道を**教えてください** (Michi o **otsukusai kudasai**)`;
      const clean = sanitizeForSpeech(input);
      expect(clean).not.toContain('(omizu)');
      expect(clean).not.toContain('(Omizu o kudasai)');
      expect(clean).not.toContain('(Michi o otsukusai kudasai)');
      expect(clean).toContain('Water = お水.');
      expect(clean).toContain('"Please give me water" = お水をください.');
      expect(clean).toContain('"Please show me [the way]" = 道を教えてください.');
    });

    it('retains natural text inside bold and italics formatting while stripping Romaji reading tags', () => {
      const input = `The verb **食べる** (*taberu*) means to eat.`;
      const clean = sanitizeForSpeech(input);
      expect(clean).toBe('The verb 食べる means to eat.');
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

    it('sanitizes text before passing to SpeechSynthesisUtterance with youthful 16-18 female pitch and snappy rate', async () => {
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
      expect(captured.pitch).toBe(1.18); // 16-18 year old female pitch
      expect(captured.rate).toBe(1.05);  // Snappy, energetic rate
    });

    it('omits standalone Romaji lines following Japanese lines from speech synthesis', () => {
      const input = `私は猫が好きです。\nWatashi wa neko ga suki desu.\nThis means I like cats.`;
      const clean = sanitizeForSpeech(input);
      expect(clean).toContain('私は猫が好きです。');
      expect(clean).toContain('This means I like cats.');
      expect(clean).not.toContain('Watashi wa neko ga suki desu');
    });
  });

  describe('Multilingual Code-Switching (Never Skips Japanese or Preferred Language)', () => {
    it('segments mixed English and Japanese text into language-specific fragments', () => {
      const input = 'simple sentence using 水? For example: 水 を 飲む (みず を のむ) - To drink water.';
      const segments = segmentMultilingualText(input, 'en-US');

      expect(segments.length).toBeGreaterThanOrEqual(3);
      // Japanese kanji & reading must have ja-JP
      const jaSegments = segments.filter(s => s.lang === 'ja-JP');
      expect(jaSegments.length).toBeGreaterThan(0);
      expect(jaSegments.some(s => s.text.includes('水'))).toBe(true);
      expect(jaSegments.some(s => s.text.includes('飲む'))).toBe(true);
      expect(jaSegments.some(s => s.text.includes('みず'))).toBe(true);

      // English explanation parts must have en-US
      const enSegments = segments.filter(s => s.lang === 'en-US');
      expect(enSegments.some(s => s.text.includes('simple sentence'))).toBe(true);
      expect(enSegments.some(s => s.text.includes('To drink water'))).toBe(true);
    });

    it('segments mixed Tamil and Japanese text accurately', () => {
      const input = 'உதாரணமாக: 水 を 飲む (みず を のむ) - தண்ணீர் குடிப்பது.';
      const segments = segmentMultilingualText(input, 'ta-IN');

      const taSegments = segments.filter(s => s.lang === 'ta-IN');
      const jaSegments = segments.filter(s => s.lang === 'ja-JP');

      expect(taSegments.some(s => s.text.includes('உதாரணமாக'))).toBe(true);
      expect(taSegments.some(s => s.text.includes('தண்ணீர்'))).toBe(true);
      expect(jaSegments.some(s => s.text.includes('水 を 飲む'))).toBe(true);
    });

    it('expands inline Japanese particles inside English sentences so speech flows seamlessly without pause', () => {
      const sentence = 'You will see how we use は to talk about family as a topic.';
      const segments = segmentMultilingualText(sentence, 'en-US');

      // The entire sentence should remain as 1 continuous segment, with は naturally vocalized as wa!
      expect(segments.length).toBe(1);
      expect(segments[0].lang).toBe('en-US');
      expect(segments[0].text).toBe('You will see how we use wa to talk about family as a topic.');
    });

    it('expands particle が to phonetic "gah" in English sentences so it is never pronounced "g - a"', () => {
      const sentence = 'In Japanese, が marks the specific subject or object.';
      const segments = segmentMultilingualText(sentence, 'en-US');
      expect(segments.length).toBe(1);
      expect(segments[0].lang).toBe('en-US');
      expect(segments[0].text).toContain('gah');
      expect(segments[0].text).not.toContain('が');
    });

    it('speaks code-switched segments sequentially with Japanese voice for Japanese words without skipping', async () => {
      const testVoices = [
        { name: 'Google US English', lang: 'en-US', localService: false },
        { name: 'Google 日本語', lang: 'ja-JP', localService: false },
      ] as any;
      mockSynthesis.getVoices.mockReturnValue(testVoices);
      audioService.loadVoices();

      const spokenUtterances: any[] = [];
      mockSynthesis.speak.mockImplementation((u: any) => {
        spokenUtterances.push(u);
        setTimeout(() => u.onend?.(), 0);
      });

      await audioService.speak('For example: 水 を 飲む (みず を のむ) - To drink water.', { lang: 'en-US' });

      // Verifies all segments were queued and spoken
      expect(spokenUtterances.length).toBeGreaterThanOrEqual(2);

      // English segments spoken with English voice
      const enUtterance = spokenUtterances.find(u => u.lang === 'en-US');
      expect(enUtterance).toBeDefined();
      expect(enUtterance.voice?.name).toBe('Google US English');

      // Japanese segment spoken with authentic Japanese voice (NEVER skipped!)
      const jaUtterance = spokenUtterances.find(u => u.lang === 'ja-JP');
      expect(jaUtterance).toBeDefined();
      expect(jaUtterance.voice?.name).toBe('Google 日本語');
      expect(jaUtterance.text).toContain('水 を 飲む');
    });
  });

  describe('Female Voice Selection & Human-Like Quality', () => {
    const testVoices = [
      { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', localService: true },
      { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', localService: true },
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Microsoft Ichiro Desktop - Japanese (Japan)', lang: 'ja-JP', localService: true },
      { name: 'Microsoft Haruka Desktop - Japanese (Japan)', lang: 'ja-JP', localService: true },
      { name: 'Google 日本語', lang: 'ja-JP' },
    ] as any;

    it('correctly identifies female and male voices', () => {
      expect(isFemaleVoice({ name: 'Microsoft Zira Desktop' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Microsoft Haruka Desktop' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Google 日本語' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Google US English' } as any)).toBe(true);
      expect(isFemaleVoice({ name: 'Kyoko' } as any)).toBe(true);

      expect(isMaleVoice({ name: 'Microsoft David Desktop' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Microsoft Ichiro Desktop' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Alex' } as any)).toBe(true);
      expect(isMaleVoice({ name: 'Otoya' } as any)).toBe(true);
    });

    it('prioritizes natural female Google US English over legacy SAPI Zira/David for English', () => {
      const best = findBestVoice(testVoices, 'en-US');
      expect(best?.name).toBe('Google US English');
    });

    it('prioritizes natural female Google 日本語 over legacy Ichiro/Haruka for Japanese', () => {
      const best = findBestVoice(testVoices, 'ja-JP');
      expect(best?.name).toBe('Google 日本語');
    });

    it('picks top female voice during audioService.speak on multi-voice systems', async () => {
      mockSynthesis.getVoices.mockReturnValue(testVoices);
      audioService.loadVoices();

      let captured: any = null;
      mockSynthesis.speak.mockImplementation((u: any) => {
        captured = u;
        setTimeout(() => u.onend?.(), 0);
      });

      // English phrase
      await audioService.speak('Welcome to Kando Japanese!');
      expect(captured.voice?.name).toBe('Google US English');

      // Japanese phrase
      await audioService.speak('こんにちは、元気ですか？');
      expect(captured.voice?.name).toBe('Google 日本語');
    });
  });
});
