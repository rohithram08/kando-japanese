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

  it('accepts every grammar pattern that exists in the content files (regression: 334 were rejected)', () => {
    // These were rejected by the old hardcoded 130-ID list.
    expect(isValidGrammarId('n4_g016')).toBe(true);
    expect(isValidGrammarId('n4_g156')).toBe(true);
    expect(isValidGrammarId('n3_g198')).toBe(true);
    expect(isValidGrammarId('n2g025')).toBe(true);
    expect(isValidGrammarId('n1g025')).toBe(true);
    // ...but ids past the end of each level are still rejected
    expect(isValidGrammarId('n4_g157')).toBe(false);
    expect(isValidGrammarId('n5_g076')).toBe(false);
  });

  it('reports canonical grammar count and list', () => {
    const count = getCanonicalGrammarCount();
    expect(count).toBe(479);
    const list = getAllCanonicalGrammarIds();
    expect(list).toHaveLength(479);
    expect(new Set(list).size).toBe(479);
    expect(list).toContain('n5_g001');
    expect(list).toContain('n1g001');
  });
});
