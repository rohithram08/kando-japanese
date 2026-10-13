import { describe, it, expect } from 'vitest';
import { stripRubyBrackets, getSentenceTokens } from '../readingTokenizer';
import type { StorySentence, VocabularyAnnotation } from '../../types/reading';

describe('readingTokenizer utility', () => {
  it('strips ruby bracket annotations cleanly', () => {
    expect(stripRubyBrackets('学[がく]生[せい]の一[いち]日[にち]')).toBe('学生の一日');
    expect(stripRubyBrackets('私[わたし]は')).toBe('私は');
    expect(stripRubyBrackets('ひらがな')).toBe('ひらがな');
    expect(stripRubyBrackets('')).toBe('');
  });

  it('uses explicitly authored sentence tokens when provided', () => {
    const sentence: StorySentence = {
      id: 's1',
      order: 1,
      japanese: '私の名前はケンです。',
      furigana: '私[わたし]の 名前[なまえ]は ケンです。',
      translation: 'My name is Ken.',
      tokens: [
        { text: '私[わたし]', surface: '私', isWord: true, vocabKey: '私' },
        { text: 'の ' },
        { text: '名前[なまえ]', surface: '名前', isWord: true, vocabKey: '名前' },
        { text: 'は ' },
        { text: 'ケン', surface: 'ケン' },
        { text: 'です。' },
      ],
    };

    const tokens = getSentenceTokens(sentence, []);
    expect(tokens.length).toBe(6);
    expect(tokens[0].isWord).toBe(true);
    expect(tokens[0].vocabKey).toBe('私');
    expect(tokens[2].isWord).toBe(true);
    expect(tokens[2].vocabKey).toBe('名前');
  });

  it('falls back safely to matching known vocabulary and preserves punctuation', () => {
    const sentenceWithoutTokens: StorySentence = {
      id: 's2',
      order: 2,
      japanese: '東京へ行きます。',
      furigana: '東京[とうきょう]へ 行[い]きます。',
      translation: 'I will go to Tokyo.',
    };

    const vocabList: VocabularyAnnotation[] = [
      {
        surface: '東京',
        reading: 'とうきょう',
        meaning: 'Tokyo',
        partOfSpeech: 'proper noun',
        jlptLevel: 'N5',
        pitchVerified: true,
      },
      {
        surface: '行く',
        reading: 'いく',
        meaning: 'to go',
        partOfSpeech: 'verb',
        jlptLevel: 'N5',
        pitchVerified: true,
      },
    ];

    const tokens = getSentenceTokens(sentenceWithoutTokens, vocabList);
    expect(tokens.length).toBeGreaterThan(0);

    // Verify Tokyo is captured as an annotated word token
    const tokyoToken = tokens.find((t) => t.isWord && t.vocabKey === '東京');
    expect(tokyoToken).toBeDefined();
    expect(tokyoToken?.text).toContain('東京');

    // Verify punctuation is preserved
    const punctToken = tokens.find((t) => t.text.includes('。'));
    expect(punctToken).toBeDefined();
  });
});
