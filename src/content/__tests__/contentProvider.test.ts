// src/content/__tests__/contentProvider.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { contentProvider } from '../provider';
import type { JLPTLevel } from '../types';

describe('ContentProvider Architecture Suite', () => {
  beforeEach(() => {
    contentProvider.setLanguage('en');
  });

  describe('1. Manifest & Inventory Verification', () => {
    it('accurately reports counts for all curriculum entities', () => {
      const counts = contentProvider.getCounts();
      expect(counts.vocabulary).toBe(2382);
      expect(counts.kanji).toBe(960);
      expect(counts.grammar).toBe(464);
      expect(counts.lessons).toBe(250);
      expect(counts.totalEntries).toBe(4056);
    });

    it('manifest includes metadata and supported languages', () => {
      const manifest = contentProvider.getManifest();
      expect(manifest.version).toBe('2.5.0');
      expect(manifest.supportedLanguages).toEqual(['en', 'ta', 'hi']);
      expect(manifest.levels).toEqual(['N5', 'N4', 'N3', 'N2', 'N1']);
    });
  });

  describe('2. Vocabulary Operations', () => {
    it('retrieves pure Japanese vocabulary data merged with English translations', () => {
      const n5Vocab = contentProvider.getVocabulary('N5', 'en');
      expect(n5Vocab.length).toBeGreaterThan(0);
      
      const watashi = n5Vocab.find(v => v.id === 'n5v001');
      expect(watashi).toBeDefined();
      expect(watashi?.word).toBe('私');
      expect(watashi?.reading).toBe('わたし');
      expect(watashi?.meaning).toBe('I / me');
      expect(watashi?.example.jp).toBe('私は学生です。');
      expect(watashi?.example.translated).toBe('I am a student.');
    });

    it('merges Tamil translations correctly', () => {
      const n5VocabTa = contentProvider.getVocabulary('N5', 'ta');
      const watashi = n5VocabTa.find(v => v.id === 'n5v001');
      expect(watashi?.meaning).toBe('நான்');
      expect(watashi?.example.translated).toBe('நான் ஒரு மாணவர்.');
    });

    it('merges Hindi translations correctly', () => {
      const n5VocabHi = contentProvider.getVocabulary('N5', 'hi');
      const watashi = n5VocabHi.find(v => v.id === 'n5v001');
      expect(watashi?.meaning).toBe('मैं');
      expect(watashi?.example.translated).toBe('मैं एक छात्र हूँ।');
    });

    it('finds vocabulary by ID', () => {
      const item = contentProvider.getVocabularyById('n5v005', 'en');
      expect(item).not.toBeNull();
      expect(item?.word).toBe('食べる');
      expect(item?.meaning).toBe('to eat');
    });
  });

  describe('3. Kanji Operations', () => {
    it('retrieves Kanji characters with On/Kun readings across levels', () => {
      const n5Kanji = contentProvider.getKanji('N5', 'en');
      expect(n5Kanji.length).toBe(124);

      const firstKanji = n5Kanji[0];
      expect(firstKanji.kanji).toBeDefined();
      expect(firstKanji.readings.on).toBeInstanceOf(Array);
      expect(firstKanji.meaning).toBeTruthy();
    });

    it('retrieves N1 Joyo Kanji characters with high fidelity', () => {
      const n1Kanji = contentProvider.getKanji('N1', 'en');
      expect(n1Kanji.length).toBe(40);
      
      const yuu = n1Kanji.find(k => k.kanji === '憂');
      expect(yuu).toBeDefined();
      expect(yuu?.meaning).toBe('melancholy / grief / sorrow / gloom');
      expect(yuu?.strokeCount).toBe(15);
    });

    it('finds kanji by character or ID', () => {
      const item = contentProvider.getKanjiById('n5k001', 'en');
      expect(item).not.toBeNull();
      expect(item?.kanji).toBe('一');
    });
  });

  describe('4. Grammar Operations', () => {
    it('retrieves grammar points with structure and formation', () => {
      const n5Grammar = contentProvider.getGrammar('N5', 'en');
      expect(n5Grammar.length).toBe(60);

      const firstG = n5Grammar[0];
      expect(firstG.pattern).toBe('〜は〜です');
      expect(firstG.meaning).toBeTruthy();
      expect(firstG.formation).toBeTruthy();
      expect(firstG.examples.length).toBeGreaterThan(0);
    });

    it('retrieves advanced N1/N2 grammar points with multiline formations', () => {
      const n1Grammar = contentProvider.getGrammar('N1', 'en');
      expect(n1Grammar.length).toBe(25);
      
      const item = n1Grammar.find(g => g.id === 'n1g001');
      expect(item).toBeDefined();
      expect(item?.pattern).toBe('〜いかんによらず / いかんにかかわらず');
    });

    it('finds grammar by ID', () => {
      const item = contentProvider.getGrammarById('n4_g001', 'en');
      expect(item).not.toBeNull();
      expect(item?.pattern).toBe('〜てあげる／てくれる／てもらう');
    });
  });

  describe('5. Lesson Operations', () => {
    it('retrieves lessons with dialogues, cultural notes, and vocab/grammar references', () => {
      const n5Lessons = contentProvider.getLessons('N5', 'en');
      expect(n5Lessons.length).toBe(50);

      const lesson1 = n5Lessons[0];
      expect(lesson1.id).toBe('n5l001');
      expect(lesson1.title).toBe('Greetings & Self-Introduction');
      expect(lesson1.dialogue.length).toBeGreaterThan(0);
      expect(lesson1.vocabulary.length).toBeGreaterThan(0);
    });

    it('retrieves lesson by ID', () => {
      const lesson = contentProvider.getLessonById('n5l006', 'en');
      expect(lesson).not.toBeNull();
      expect(lesson?.title).toBe('Asking for Directions');
      expect(lesson?.order).toBe(6);
    });
  });

  describe('6. Fallback Behavior', () => {
    it('falls back to English when a translation in Tamil/Hindi is missing', () => {
      // Testing with a level that has partial Tamil translations (e.g. N2 kanji without Tamil)
      const n2KanjiTa = contentProvider.getKanji('N2', 'ta');
      expect(n2KanjiTa.length).toBe(367);
      
      // If meaning_ta is missing, it should fall back to English meaning
      n2KanjiTa.forEach((k) => {
        expect(k.meaning).toBeTruthy();
      });
    });
  });

  describe('7. Universal Search', () => {
    it('searches across Japanese words', () => {
      const results = contentProvider.search('食べる', 'en');
      expect(results.length).toBeGreaterThan(0);
      const match = results.find(r => r.title === '食べる');
      expect(match).toBeDefined();
      expect(match?.type).toBe('vocabulary');
    });

    it('searches across English meanings', () => {
      const results = contentProvider.search('umbrella', 'en');
      expect(results.length).toBeGreaterThan(0);
      const match = results.find(r => r.title === '傘');
      expect(match).toBeDefined();
      expect(match?.type).toBe('vocabulary');
    });

    it('searches across Kanji characters', () => {
      const results = contentProvider.search('憂', 'en');
      expect(results.length).toBeGreaterThan(0);
      const match = results.find(r => r.title === '憂');
      expect(match).toBeDefined();
      expect(match?.type).toBe('kanji');
    });

    it('searches across Grammar patterns', () => {
      const results = contentProvider.search('いかんによらず', 'en');
      expect(results.length).toBeGreaterThan(0);
      const match = results.find(r => r.title.includes('いかんによらず'));
      expect(match).toBeDefined();
      expect(match?.type).toBe('grammar');
    });
  });
});
