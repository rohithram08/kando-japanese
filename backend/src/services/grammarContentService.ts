/**
 * Grammar Content Service
 *
 * Validates and exposes metadata for canonical Japanese grammar patterns
 * across JLPT levels N5 through N1.
 */

// Canonical grammar IDs defined in the curriculum data files (src/data/grammar/*.js)
const CANONICAL_GRAMMAR_IDS = [
  // N5 Grammar (60 items: n5_g001 to n5_g060)
  ...Array.from({ length: 60 }, (_, i) => `n5_g${String(i + 1).padStart(3, '0')}`),
  // N4 Grammar (15 items: n4_g001 to n4_g015)
  ...Array.from({ length: 15 }, (_, i) => `n4_g${String(i + 1).padStart(3, '0')}`),
  // N3 Grammar (15 items: n3_g001 to n3_g015)
  ...Array.from({ length: 15 }, (_, i) => `n3_g${String(i + 1).padStart(3, '0')}`),
  // N2 Grammar (20 items: n2g001 to n2g020)
  ...Array.from({ length: 20 }, (_, i) => `n2g${String(i + 1).padStart(3, '0')}`),
  // N1 Grammar (20 items: n1g001 to n1g020)
  ...Array.from({ length: 20 }, (_, i) => `n1g${String(i + 1).padStart(3, '0')}`),
];

// Pre-build a lookup set that tolerates both underscore and non-underscore variations (e.g. n5_g001 and n5g001)
const ALL_GRAMMAR_IDS = new Set<string>();

for (const id of CANONICAL_GRAMMAR_IDS) {
  const lower = id.toLowerCase();
  ALL_GRAMMAR_IDS.add(lower);
  // Also add underscore-less or underscore-added variant for resilience
  if (lower.includes('_')) {
    ALL_GRAMMAR_IDS.add(lower.replace('_', ''));
  } else {
    // e.g. n2g001 -> n2_g001
    ALL_GRAMMAR_IDS.add(lower.replace(/^([a-z0-9]+)g(\d+)$/, '$1_g$2'));
  }
}

/**
 * Validate whether a grammar pattern ID exists in the curriculum data.
 */
export function isValidGrammarId(grammarId?: string | null): boolean {
  if (!grammarId || typeof grammarId !== 'string') return false;
  return ALL_GRAMMAR_IDS.has(grammarId.trim().toLowerCase());
}

/**
 * Get the total count of canonical grammar patterns available.
 */
export function getCanonicalGrammarCount(): number {
  return CANONICAL_GRAMMAR_IDS.length;
}

/**
 * Return a copy of all canonical grammar IDs.
 */
export function getAllCanonicalGrammarIds(): string[] {
  return [...CANONICAL_GRAMMAR_IDS];
}
