import { describe, it, expect } from 'vitest';
import {
  isValidGrammarId,
  getCanonicalGrammarCount,
  getAllCanonicalGrammarIds,
} from '../grammarContentService.js';

describe('grammarContentService', () => {
  it('validates canonical grammar IDs across all levels', () => {
    // N5
    expect(isValidGrammarId('n5_g001')).toBe(true);
    expect(isValidGrammarId('n5_g060')).toBe(true);
    // N4
    expect(isValidGrammarId('n4_g001')).toBe(true);
    expect(isValidGrammarId('n4_g015')).toBe(true);
    // N3
    expect(isValidGrammarId('n3_g001')).toBe(true);
    expect(isValidGrammarId('n3_g015')).toBe(true);
    // N2
    expect(isValidGrammarId('n2g001')).toBe(true);
    expect(isValidGrammarId('n2g020')).toBe(true);
    // N1
    expect(isValidGrammarId('n1g001')).toBe(true);
    expect(isValidGrammarId('n1g020')).toBe(true);
  });

  it('tolerates normalized underscore variations and uppercase strings', () => {
    expect(isValidGrammarId('N5_G001')).toBe(true);
    expect(isValidGrammarId('n5g001')).toBe(true);
    expect(isValidGrammarId('n2_g001')).toBe(true);
  });

  it('rejects nonexistent, malformed, or empty grammar IDs', () => {
    expect(isValidGrammarId('')).toBe(false);
    expect(isValidGrammarId(null)).toBe(false);
    expect(isValidGrammarId(undefined)).toBe(false);
    expect(isValidGrammarId('n5_g999')).toBe(false);
    expect(isValidGrammarId('hack_drop_table')).toBe(false);
    expect(isValidGrammarId('12345')).toBe(false);
  });

  it('reports canonical grammar count and list', () => {
    const count = getCanonicalGrammarCount();
    expect(count).toBe(130);
    const list = getAllCanonicalGrammarIds();
    expect(list).toHaveLength(130);
    expect(list).toContain('n5_g001');
    expect(list).toContain('n1g001');
  });
});
