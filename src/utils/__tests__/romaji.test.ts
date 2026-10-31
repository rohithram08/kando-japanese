import { describe, it, expect } from 'vitest';
import {
  toRomaji,
  parseKanjiExample,
  toSentenceRomaji,
  toGrammarPatternRomaji,
} from '../romaji';

describe('Hepburn Kana-to-Romaji Engine', () => {
  it('converts basic hiragana and katakana', () => {
    expect(toRomaji('こんにちは')).toBe('konnichiha');
    expect(toRomaji('さくら')).toBe('sakura');
    expect(toRomaji('すし')).toBe('sushi');
    expect(toRomaji('カメラ')).toBe('kamera');
    expect(toRomaji('テレビ')).toBe('terebi');
  });

  it('converts digraphs (yoon) accurately', () => {
    expect(toRomaji('きょう')).toBe('kyou');
    expect(toRomaji('しゃしん')).toBe('shashin');
    expect(toRomaji('びょういん')).toBe('byouin');
    expect(toRomaji('ちょっと')).toBe('chotto');
  });

  it('converts sokuon (small tsu / gemination) and choonpu (macron) correctly', () => {
    expect(toRomaji('がっこう')).toBe('gakkou');
    expect(toRomaji('まっち')).toBe('matchi');
    expect(toRomaji('コーヒー')).toBe('koohii');
    expect(toRomaji('ケーキ')).toBe('keeki');
  });

  it('parses legacy kanji examples like 一つ(ひとつ)', () => {
    const ex = parseKanjiExample('一つ(ひとつ)', 'one object');
    expect(ex.word).toBe('一つ');
    expect(ex.reading).toBe('ひとつ');
    expect(ex.romaji).toBe('hitotsu');
    expect(ex.meaning).toBe('one object');
  });

  it('parses object kanji examples with custom romaji', () => {
    const ex = parseKanjiExample({ word: '水', reading: 'みず', meaning: 'water' });
    expect(ex.word).toBe('水');
    expect(ex.reading).toBe('みず');
    expect(ex.romaji).toBe('mizu');
    expect(ex.meaning).toBe('water');
  });

  it('toGrammarPatternRomaji converts grammar patterns with correct particle pronunciations', () => {
    expect(toGrammarPatternRomaji('〜は〜です')).toBe('~wa~desu');
    expect(toGrammarPatternRomaji('〜は〜ではありません')).toBe('~wa~dewa arimasen');
    expect(toGrammarPatternRomaji('〜が〜です')).toBe('~ga~desu');
    expect(toGrammarPatternRomaji('〜を〜します')).toBe('~o~shimasu');
    expect(toGrammarPatternRomaji('〜てはいけません')).toBe('~te wa ikemasen');
    expect(toGrammarPatternRomaji('〜から〜まで')).toBe('~kara~made');
  });

  it('toSentenceRomaji formats example sentences with clean spacing and no raw kanji', () => {
    expect(toSentenceRomaji('私は学生です。', 'わたしはがくせいです。')).toBe('watashi wa gakusei desu.');
    expect(toSentenceRomaji('これは本です。', 'これはほんです。')).toBe('kore wa hon desu.');
    expect(toSentenceRomaji('田中さんは先生です。', 'たなかさんはせんせいです。')).toBe('tanaka san wa sensei desu.');
    expect(toSentenceRomaji('田中さんは学生ではありません。', 'たなかさんはがくせいではありません。')).toBe('tanaka san wa gakusei dewa arimasen.');
    expect(toSentenceRomaji('これはペンじゃないです。', 'これはペンじゃないです。')).toBe('kore wa pen ja nai desu.');
    expect(toSentenceRomaji('荷物を持ってあげました。', 'にもつをもってあげました。')).toBe('nimotsu o motteagemashita.');
    expect(toSentenceRomaji('先生が教えてくれました。', 'せんせいがおしえてくれました。')).toBe('sensei ga oshietekuremashita.');
    expect(toSentenceRomaji('旅行の準備をしています。', 'りょこうのじゅんびをしています。')).toBe('ryokou no junbi o shiteimasu.');
    // Unresolved Kanji should safely return empty string
    expect(toSentenceRomaji('荷物を持ってあげました。')).toBe('');
  });
});
