import { describe, it, expect, vi } from 'vitest';
import {
  detectQueryType,
  kanaToRomaji,
  searchHybridDictionary,
} from '../../services/dictionaryService.js';
import { dictionaryRouter } from '../dictionary.js';

describe('Dictionary Service & Routes', () => {
  describe('Script & Query Type Detection', () => {
    it('detects Kanji correctly', () => {
      expect(detectQueryType('食べる')).toBe('kanji');
      expect(detectQueryType('水')).toBe('kanji');
      expect(detectQueryType('学校')).toBe('kanji');
    });

    it('detects Kana correctly', () => {
      expect(detectQueryType('たべる')).toBe('kana');
      expect(detectQueryType('ラーメン')).toBe('kana');
      expect(detectQueryType('ありがとう')).toBe('kana');
    });

    it('detects Romaji correctly', () => {
      expect(detectQueryType('taberu')).toBe('romaji');
      expect(detectQueryType('mizu')).toBe('romaji');
      expect(detectQueryType('arigatou')).toBe('romaji');
    });

    it('detects Meanings in native languages correctly', () => {
      expect(detectQueryType('eat')).toBe('meaning');
      expect(detectQueryType('சாப்பிடு')).toBe('meaning');
      expect(detectQueryType('खाना')).toBe('meaning');
      expect(detectQueryType('water')).toBe('meaning');
    });
  });

  describe('Hepburn Kana to Romaji Conversion', () => {
    it('converts basic hiragana to romaji', () => {
      expect(kanaToRomaji('たべる')).toBe('taberu');
      expect(kanaToRomaji('みず')).toBe('mizu');
      expect(kanaToRomaji('ねこ')).toBe('neko');
    });

    it('handles sokuon (small tsu っ)', () => {
      expect(kanaToRomaji('がっこう')).toBe('gakkou');
      expect(kanaToRomaji('きって')).toBe('kitte');
    });

    it('handles yōon combos', () => {
      expect(kanaToRomaji('きょう')).toBe('kyou');
      expect(kanaToRomaji('おちゃ')).toBe('ocha');
      expect(kanaToRomaji('とうきょう')).toBe('toukyou');
    });
  });

  describe('Curriculum & Hybrid Search', () => {
    it('searches curriculum by Japanese word', async () => {
      const res = await searchHybridDictionary('私', 'en');
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results[0].word).toBe('私');
      expect(res.results[0].reading).toBe('わたし');
      expect(res.results[0].romaji).toBe('watashi');
      expect(res.results[0].source).toBe('curriculum');
    });

    it('returns Tamil meaning when locale is ta', async () => {
      const res = await searchHybridDictionary('私', 'ta');
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results[0].word).toBe('私');
      expect(res.results[0].meaning).toBe('நான்');
    });

    it('returns Hindi meaning when locale is hi', async () => {
      const res = await searchHybridDictionary('私', 'hi');
      expect(res.results.length).toBeGreaterThan(0);
      expect(res.results[0].word).toBe('私');
      expect(res.results[0].meaning).toBe('मैं');
    });

    it('searches curriculum by meaning in Tamil', async () => {
      const res = await searchHybridDictionary('நான்', 'ta');
      expect(res.results.length).toBeGreaterThan(0);
      const match = res.results.find((r) => r.word === '私');
      expect(match).toBeDefined();
    });

    it('searches curriculum by meaning in Hindi', async () => {
      const res = await searchHybridDictionary('मैं', 'hi');
      expect(res.results.length).toBeGreaterThan(0);
      const match = res.results.find((r) => r.word === '私');
      expect(match).toBeDefined();
    });

    it('filters results by JLPT level when specified', async () => {
      const res = await searchHybridDictionary('私', 'en', { jlpt: 'N5' });
      expect(res.results.length).toBeGreaterThan(0);
      res.results.forEach((r) => {
        expect(r.level).toBe('N5');
      });
    });
  });

  describe('Route Handlers', () => {
    const getRouteHandler = (path: string, method: string) => {
      const layer = (dictionaryRouter as any).stack.find(
        (s: any) => s.route && s.route.path === path && s.route.methods[method]
      );
      if (!layer) throw new Error(`Route not found for ${method.toUpperCase()} ${path}`);
      return layer.route.stack[layer.route.stack.length - 1].handle;
    };

    it('GET /search with valid query returns dictionary results', async () => {
      const handler = getRouteHandler('/search', 'get');
      const req: any = { query: { q: '食べる', locale: 'en' } };
      let jsonResult: any = null;
      const res: any = {
        json: (data: any) => {
          jsonResult = data;
        },
      };
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(jsonResult).toBeDefined();
      expect(jsonResult.success).toBe(true);
      expect(jsonResult.data.results).toBeInstanceOf(Array);
      expect(jsonResult.data.results.length).toBeGreaterThan(0);
      expect(jsonResult.data.results[0].word).toBe('食べる');
    });
  });
});
