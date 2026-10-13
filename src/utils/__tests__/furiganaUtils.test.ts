import { describe, it, expect } from 'vitest';
import {
  containsKanji,
  parseFuriganaSegments,
  getAdaptiveFuriganaMode,
} from '../furiganaUtils';

describe('Adaptive Furigana & Orthographic Segmentation Engine', () => {
  describe('Kanji Detection', () => {
    it('accurately identifies strings containing kanji', () => {
      expect(containsKanji('食べる')).toBe(true);
      expect(containsKanji('私')).toBe(true);
      expect(containsKanji('日本語')).toBe(true);
      expect(containsKanji('ありがとう')).toBe(false);
      expect(containsKanji('コーヒー')).toBe(false);
      expect(containsKanji('Hello 123')).toBe(false);
    });
  });

  describe('parseFuriganaSegments (Okurigana / Ruby Decomposition)', () => {
    it('isolates okurigana suffix so only kanji stem receives furigana', () => {
      const segments = parseFuriganaSegments('食べる', 'たべる');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({ text: '食', reading: 'た', isKanji: true });
      expect(segments[1]).toEqual({ text: 'べる', reading: null, isKanji: false });
    });

    it('isolates honorific prefix so prefix kana does not receive ruby text', () => {
      const segments = parseFuriganaSegments('お茶', 'おちゃ');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({ text: 'お', reading: null, isKanji: false });
      expect(segments[1]).toEqual({ text: '茶', reading: 'ちゃ', isKanji: true });
    });

    it('handles mixed prefix and suffix around a kanji stem', () => {
      const segments = parseFuriganaSegments('お話し', 'おはなし');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'お', reading: null, isKanji: false });
      expect(segments[1]).toEqual({ text: '話', reading: 'はな', isKanji: true });
      expect(segments[2]).toEqual({ text: 'し', reading: null, isKanji: false });
    });

    it('handles compound kanji with no surrounding kana', () => {
      const segments = parseFuriganaSegments('学校', 'がっこう');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({ text: '学校', reading: 'がっこう', isKanji: true });
    });

    it('handles single kanji nouns', () => {
      const segments = parseFuriganaSegments('私', 'わたし');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({ text: '私', reading: 'わたし', isKanji: true });
    });

    it('handles mixed compounds with interstitial kana (e.g. 食べ物)', () => {
      const segments = parseFuriganaSegments('食べ物', 'たべもの');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: '食', reading: 'た', isKanji: true });
      expect(segments[1]).toEqual({ text: 'べ', reading: null, isKanji: false });
      expect(segments[2]).toEqual({ text: '物', reading: 'もの', isKanji: true });
    });

    it('parses explicitly authored bracket syntax (e.g. 食[た]べる and 今日[きょう] and 食[た]べ物[もの])', () => {
      const bracketVerb = parseFuriganaSegments('食[た]べる');
      expect(bracketVerb).toEqual([
        { text: '食', reading: 'た', isKanji: true },
        { text: 'べる', reading: null, isKanji: false },
      ]);

      const bracketJukuji = parseFuriganaSegments('今日[きょう]');
      expect(bracketJukuji).toEqual([
        { text: '今日', reading: 'きょう', isKanji: true },
      ]);

      const bracketMulti = parseFuriganaSegments('食[た]べ物[もの]');
      expect(bracketMulti).toEqual([
        { text: '食', reading: 'た', isKanji: true },
        { text: 'べ', reading: null, isKanji: false },
        { text: '物', reading: 'もの', isKanji: true },
      ]);
    });

    it('handles multi-kanji verb compounds with interstitial kana (e.g. 思い出す)', () => {
      const segments = parseFuriganaSegments('思い出す', 'おもいだす');
      expect(segments).toEqual([
        { text: '思', reading: 'おも', isKanji: true },
        { text: 'い', reading: null, isKanji: false },
        { text: '出', reading: 'だ', isKanji: true },
        { text: 'す', reading: null, isKanji: false },
      ]);
    });

    it('safely handles jukujikun compounds as a single block without scrambling syllables', () => {
      const segments = parseFuriganaSegments('今日', 'きょう');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({ text: '今日', reading: 'きょう', isKanji: true });
    });

    it('safely handles sentences with punctuation around kanji compounds', () => {
      const segments = parseFuriganaSegments('こんにちは、世界！', 'こんにちは、せかい！');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'こんにちは、', reading: null, isKanji: false });
      expect(segments[1]).toEqual({ text: '世界', reading: 'せかい', isKanji: true });
      expect(segments[2]).toEqual({ text: '！', reading: null, isKanji: false });
    });

    it('safely passes through pure kana words without redundant ruby annotations', () => {
      const segments = parseFuriganaSegments('ありがとう', 'ありがとう');
      expect(segments).toHaveLength(1);
      expect(segments[0]).toEqual({ text: 'ありがとう', reading: null, isKanji: false });
    });
  });

  describe('getAdaptiveFuriganaMode (SRS Mastery-Driven Fading)', () => {
    it('provides full Always-On scaffolding for beginner / unreviewed words', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'adaptive',
        repetitions: 0,
        isMastered: false,
      });
      expect(state.visibility).toBe('visible');
      expect(state.canReveal).toBe(false);
      expect(state.stage).toBe('learning');
    });

    it('transitions to Reveal-on-Demand when an item is familiar (3+ reviews)', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'adaptive',
        repetitions: 3,
        isMastered: false,
      });
      expect(state.visibility).toBe('hidden');
      expect(state.canReveal).toBe(true);
      expect(state.stage).toBe('familiar');
      expect(state.reason).toContain('Familiar word');
    });

    it('fades assistance to Off-by-Default when an item is mastered (5+ reviews)', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'adaptive',
        repetitions: 5,
        isMastered: false,
      });
      expect(state.visibility).toBe('hidden');
      expect(state.canReveal).toBe(true);
      expect(state.stage).toBe('mastered');
      expect(state.reason).toContain('Mastered word');
    });

    it('hides furigana during active recall testing on card fronts to prevent spoiling answers', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'always',
        repetitions: 0,
        isTesting: true,
      });
      expect(state.visibility).toBe('hidden');
      expect(state.canReveal).toBe(true);
      expect(state.stage).toBe('testing');
    });

    it('respects manual user overrides for Always On', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'always',
        repetitions: 10,
        isMastered: true,
        isTesting: false,
      });
      expect(state.visibility).toBe('visible');
      expect(state.stage).toBe('always');
    });

    it('respects manual user overrides for Off', () => {
      const state = getAdaptiveFuriganaMode({
        mode: 'off',
        repetitions: 0,
        isMastered: false,
        isTesting: false,
      });
      expect(state.visibility).toBe('hidden');
      expect(state.canReveal).toBe(true);
      expect(state.stage).toBe('off');
    });

    it('immediately restores reading assistance if an item relapses to 0 repetitions after a mistake', () => {
      // Learner made a mistake in SRS review, resetting repetitions from 5 -> 0
      const relapsedState = getAdaptiveFuriganaMode({
        mode: 'adaptive',
        repetitions: 0,
        isMastered: false,
        isTesting: false,
      });
      expect(relapsedState.visibility).toBe('visible');
      expect(relapsedState.stage).toBe('learning');
      expect(relapsedState.canReveal).toBe(false);
    });
  });
});
