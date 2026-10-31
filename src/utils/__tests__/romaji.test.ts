import { describe, it, expect } from 'vitest';
import { toRomaji, parseKanjiExample, toSentenceRomaji } from '../romaji';

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

  it('toSentenceRomaji formats example sentences with clean spacing and no raw kanji', () => {
    expect(toSentenceRomaji('荷物を持ってあげました。', 'にもつをもってあげました。')).toBe('nimotsu o motteagemashita.');
    expect(toSentenceRomaji('先生が教えてくれました。', 'せんせいがおしえてくれました。')).toBe('sensei ga oshietekuremashita.');
    expect(toSentenceRomaji('旅行の準備をしています。', 'りょこうのじゅんびをしています。')).toBe('ryokou no junbi o shiteimasu.');
    // Unresolved Kanji should safely return empty string
    expect(toSentenceRomaji('荷物を持ってあげました。')).toBe('');
  });
});
