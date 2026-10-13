import { describe, it, expect } from 'vitest';
import {
  ALL_KANA,
  KANA_DATA,
  CONFUSABLE_PAIRS,
  getKanaByScript,
  getKanaByGroup,
  getKanaById,
} from '../kanaData';

describe('Kana Dataset Linguistic & Inventory Validation', () => {
  it('contains exactly 214 total kana items (107 Hiragana + 107 Katakana)', () => {
    expect(ALL_KANA).toHaveLength(214);
    expect(KANA_DATA).toHaveLength(214);
  });

  it('verifies Hiragana inventory: 46 Gojūon, 20 Dakuon, 5 Handakuon, 36 Yōon = 107 total', () => {
    const hiragana = getKanaByScript('hiragana');
    expect(hiragana).toHaveLength(107);

    const gojuon = hiragana.filter((k) => k.group === 'gojuon');
    const dakuon = hiragana.filter((k) => k.group === 'dakuon');
    const handakuon = hiragana.filter((k) => k.group === 'handakuon');
    const yoon = hiragana.filter((k) => k.group === 'yoon');

    expect(gojuon).toHaveLength(46);
    expect(dakuon).toHaveLength(20);
    expect(handakuon).toHaveLength(5);
    expect(yoon).toHaveLength(36);
  });

  it('verifies Katakana inventory: 46 Gojūon, 20 Dakuon, 5 Handakuon, 36 Yōon = 107 total', () => {
    const katakana = getKanaByScript('katakana');
    expect(katakana).toHaveLength(107);

    const gojuon = katakana.filter((k) => k.group === 'gojuon');
    const dakuon = katakana.filter((k) => k.group === 'dakuon');
    const handakuon = katakana.filter((k) => k.group === 'handakuon');
    const yoon = katakana.filter((k) => k.group === 'yoon');

    expect(gojuon).toHaveLength(46);
    expect(dakuon).toHaveLength(20);
    expect(handakuon).toHaveLength(5);
    expect(yoon).toHaveLength(36);
  });

  it('ensures all character IDs are unique with valid required metadata', () => {
    const ids = new Set<string>();
    for (const kana of ALL_KANA) {
      expect(ids.has(kana.id)).toBe(false);
      ids.add(kana.id);

      expect(kana.kana).toBeTruthy();
      expect(kana.romaji).toBeTruthy();
      expect(kana.strokeCount).toBeGreaterThan(0);
      expect(kana.mnemonic).toBeTruthy();
      expect(Array.isArray(kana.examples)).toBe(true);
      expect(kana.examples.length).toBeGreaterThan(0);
      expect(kana.examples[0].word).toBeTruthy();
      expect(kana.examples[0].meaning).toBeTruthy();
    }
  });

  it('validates Hepburn romaji accuracy for irregular phonemes', () => {
    expect(getKanaById('h_shi')?.romaji).toBe('shi');
    expect(getKanaById('h_chi')?.romaji).toBe('chi');
    expect(getKanaById('h_tsu')?.romaji).toBe('tsu');
    expect(getKanaById('h_fu')?.romaji).toBe('fu');
    expect(getKanaById('h_ji')?.romaji).toBe('ji');
    expect(getKanaById('h_zu')?.romaji).toBe('zu');

    expect(getKanaById('k_shi')?.romaji).toBe('shi');
    expect(getKanaById('k_chi')?.romaji).toBe('chi');
    expect(getKanaById('k_tsu')?.romaji).toBe('tsu');
    expect(getKanaById('k_fu')?.romaji).toBe('fu');
    expect(getKanaById('k_ji')?.romaji).toBe('ji');
  });

  it('verifies helper functions behave reliably by ID or character', () => {
    const byId = getKanaById('h_a');
    expect(byId).toBeDefined();
    expect(byId?.kana).toBe('あ');
    expect(byId?.romaji).toBe('a');

    const byChar = getKanaById('あ');
    expect(byChar).toBeDefined();
    expect(byChar?.id).toBe('h_a');

    const nonExistent = getKanaById('fake_id_123');
    expect(nonExistent).toBeNull();

    const hiraganaGojuon = getKanaByGroup('hiragana', 'gojuon');
    expect(hiraganaGojuon).toHaveLength(46);
    expect(hiraganaGojuon.every((k) => k.script === 'hiragana' && k.group === 'gojuon')).toBe(true);
  });

  it('contains confusable pairs with clear distinguishing advice and rules', () => {
    expect(CONFUSABLE_PAIRS.length).toBeGreaterThanOrEqual(5);
    const shiTsu = CONFUSABLE_PAIRS.find((p) => p.chars.includes('シ') && p.chars.includes('ツ'));
    expect(shiTsu).toBeDefined();
    expect(shiTsu?.explanation).toBeTruthy();
    expect(shiTsu?.rule).toBeTruthy();

    const soN = CONFUSABLE_PAIRS.find((p) => p.chars.includes('ソ') && p.chars.includes('ン'));
    expect(soN).toBeDefined();
    expect(soN?.explanation).toBeTruthy();
    expect(soN?.rule).toBeTruthy();
  });
});
