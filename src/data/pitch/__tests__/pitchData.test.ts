import { describe, it, expect } from 'vitest';
import {
  segmentMorae,
  computePitchHeights,
  getPitchAccent,
  PITCH_PATTERN_META,
} from '../pitchData';

describe('Tokyo Pitch Accent ($F_0$) Linguistic Engine', () => {
  describe('Mora Segmentation (拍分割)', () => {
    it('segments simple kana words into 1-character morae', () => {
      expect(segmentMorae('わたし')).toEqual(['わ', 'た', 'し']);
      expect(segmentMorae('さくら')).toEqual(['さ', 'く', 'ら']);
    });

    it('correctly groups contracted sounds (Yōon / 拗音) as a single mora', () => {
      // きょ is 1 mora; と(1) + う(1) + きょ(1) + う(1) = 4
      expect(segmentMorae('とうきょう')).toEqual(['と', 'う', 'きょ', 'う']);
      // お(1) + ちゃ(1) = 2
      expect(segmentMorae('おちゃ')).toEqual(['お', 'ちゃ']);
      // しゃ(1) + し(1) + ん(1) = 3
      expect(segmentMorae('しゃしん')).toEqual(['しゃ', 'し', 'ん']);
    });

    it('counts double consonants (Sokuon / 促音 っ) as an independent mora', () => {
      // が(1) + っ(1) + こ(1) + う(1) = 4
      expect(segmentMorae('がっこう')).toEqual(['が', 'っ', 'こ', 'う']);
      // き(1) + っ(1) + て(1) = 3
      expect(segmentMorae('きって')).toEqual(['き', 'っ', 'て']);
    });

    it('counts syllabic nasal (Hatsuon / 撥音 ん) as an independent mora', () => {
      expect(segmentMorae('にほん')).toEqual(['に', 'ほ', 'ん']);
      expect(segmentMorae('せんせい')).toEqual(['せ', 'ん', 'せ', 'い']);
    });

    it('handles Katakana long vowel marks and modern loanword digraphs', () => {
      // コ(1) + ー(1) + ヒ(1) + ー(1) = 4
      expect(segmentMorae('コーヒー')).toEqual(['コ', 'ー', 'ヒ', 'ー']);
      // パ(1) + ー(1) + ティ(1) + ー(1) = 4
      expect(segmentMorae('パーティー')).toEqual(['パ', 'ー', 'ティ', 'ー']);
    });

    it('returns empty array safely for invalid input', () => {
      expect(segmentMorae('')).toEqual([]);
      expect(segmentMorae(null)).toEqual([]);
    });
  });

  describe('Pitch Height Calculation & Pattern Classification', () => {
    it('computes ⓪ 平板 (Heiban) correctly: L-H-H..., particle is H', () => {
      const result = computePitchHeights(3, 0);
      expect(result.pattern).toBe('heiban');
      expect(result.pitchHeights).toEqual(['L', 'H', 'H']);
      expect(result.particlePitch).toBe('H');
    });

    it('computes ① 頭高 (Atamadaka) correctly: H-L-L..., particle is L', () => {
      const result = computePitchHeights(3, 1);
      expect(result.pattern).toBe('atamadaka');
      expect(result.pitchHeights).toEqual(['H', 'L', 'L']);
      expect(result.particlePitch).toBe('L');
    });

    it('computes 中高 (Nakadaka) correctly: L-H... drops before end, particle is L', () => {
      const result = computePitchHeights(4, 2);
      expect(result.pattern).toBe('nakadaka');
      expect(result.pitchHeights).toEqual(['L', 'H', 'L', 'L']);
      expect(result.particlePitch).toBe('L');

      const result3 = computePitchHeights(5, 3);
      expect(result3.pattern).toBe('nakadaka');
      expect(result3.pitchHeights).toEqual(['L', 'H', 'H', 'L', 'L']);
      expect(result3.particlePitch).toBe('L');
    });

    it('computes 尾高 (Odaka) correctly: L-H-H... drops onto following particle', () => {
      const result = computePitchHeights(3, 3);
      expect(result.pattern).toBe('odaka');
      expect(result.pitchHeights).toEqual(['L', 'H', 'H']);
      expect(result.particlePitch).toBe('L'); // Drop occurs on particle!
    });

    it('handles 1-mora words correctly', () => {
      const heiban1 = computePitchHeights(1, 0);
      expect(heiban1.pattern).toBe('heiban');
      expect(heiban1.pitchHeights).toEqual(['L']);
      expect(heiban1.particlePitch).toBe('H');

      const atamadaka1 = computePitchHeights(1, 1);
      expect(atamadaka1.pattern).toBe('atamadaka');
      expect(atamadaka1.pitchHeights).toEqual(['H']);
      expect(atamadaka1.particlePitch).toBe('L');
    });
  });

  describe('Verified Minimal Pairs & Dictionary Lookups', () => {
    it('accurately distinguishes the 3-way minimal pair はし (chopsticks, bridge, edge)', () => {
      const hashiChopsticks = getPitchAccent('箸', 'はし');
      const hashiBridge = getPitchAccent('橋', 'はし');
      const hashiEdge = getPitchAccent('端', 'はし');

      expect(hashiChopsticks).toBeDefined();
      expect(hashiChopsticks?.pattern).toBe('atamadaka');
      expect(hashiChopsticks?.dropPosition).toBe(1);
      expect(hashiChopsticks?.pitchHeights).toEqual(['H', 'L']);

      expect(hashiBridge).toBeDefined();
      expect(hashiBridge?.pattern).toBe('odaka');
      expect(hashiBridge?.dropPosition).toBe(2);
      expect(hashiBridge?.pitchHeights).toEqual(['L', 'H']);
      expect(hashiBridge?.particlePitch).toBe('L');

      expect(hashiEdge).toBeDefined();
      expect(hashiEdge?.pattern).toBe('heiban');
      expect(hashiEdge?.dropPosition).toBe(0);
      expect(hashiEdge?.pitchHeights).toEqual(['L', 'H']);
      expect(hashiEdge?.particlePitch).toBe('H');
    });

    it('accurately distinguishes あめ (rain vs candy) and はな (flower vs nose)', () => {
      const ameRain = getPitchAccent('雨', 'あめ');
      const ameCandy = getPitchAccent('飴', 'あめ');

      expect(ameRain?.pattern).toBe('atamadaka');
      expect(ameCandy?.pattern).toBe('heiban');

      const hanaFlower = getPitchAccent('花', 'はな');
      const hanaNose = getPitchAccent('鼻', 'はな');

      expect(hanaFlower?.pattern).toBe('odaka');
      expect(hanaNose?.pattern).toBe('heiban');
    });

    it('accurately distinguishes the 3-way minimal triplet かき (oyster, fence, persimmon)', () => {
      const kakiOyster = getPitchAccent('牡蠣', 'かき');
      const kakiFence = getPitchAccent('垣', 'かき');
      const kakiPersimmon = getPitchAccent('柿', 'かき');

      expect(kakiOyster?.pattern).toBe('atamadaka');
      expect(kakiOyster?.dropPosition).toBe(1);
      expect(kakiOyster?.pitchHeights).toEqual(['H', 'L']);

      expect(kakiFence?.pattern).toBe('odaka');
      expect(kakiFence?.dropPosition).toBe(2);
      expect(kakiFence?.pitchHeights).toEqual(['L', 'H']);
      expect(kakiFence?.particlePitch).toBe('L');

      expect(kakiPersimmon?.pattern).toBe('heiban');
      expect(kakiPersimmon?.dropPosition).toBe(0);
      expect(kakiPersimmon?.pitchHeights).toEqual(['L', 'H']);
      expect(kakiPersimmon?.particlePitch).toBe('H');
    });

    it('verifies core verbs have correct pitch drop positions', () => {
      const taberu = getPitchAccent('食べる', 'たべる');
      expect(taberu?.pattern).toBe('nakadaka');
      expect(taberu?.dropPosition).toBe(2);

      const nomu = getPitchAccent('飲む', 'のむ');
      expect(nomu?.pattern).toBe('atamadaka');
      expect(nomu?.dropPosition).toBe(1);

      const iku = getPitchAccent('行く', 'いく');
      expect(iku?.pattern).toBe('heiban');
      expect(iku?.dropPosition).toBe(0);
    });

    it('does not assign word-level pitch accents to isolated kanji graphemes with no word entry', () => {
      expect(getPitchAccent('語')).toBeNull();
      expect(getPitchAccent('字')).toBeNull();
      expect(getPitchAccent('漢')).toBeNull();
    });

    it('returns null for unverified words without fabricating data', () => {
      expect(getPitchAccent('xyz_non_existent')).toBeNull();
      expect(getPitchAccent('some_random_word', 'some_reading')).toBeNull();
    });

    it('provides clear metadata descriptions for all 4 pitch categories', () => {
      expect(PITCH_PATTERN_META.heiban.description).toBeTruthy();
      expect(PITCH_PATTERN_META.atamadaka.description).toBeTruthy();
      expect(PITCH_PATTERN_META.nakadaka.description).toBeTruthy();
      expect(PITCH_PATTERN_META.odaka.description).toBeTruthy();
    });
  });
});
