/**
 * Grammar Content Service
 *
 * Validates and exposes metadata for canonical Japanese grammar patterns
 * across JLPT levels N5 through N1.
 */

import { GRAMMAR_IDS } from '../data/contentIndex.js';

// Canonical grammar IDs come from the generated content index (see `npm run content:index`),
// which is built from content/grammar/*.json - the same files the frontend serves.
// (Previously a hardcoded 130-ID list rejected 334 of the 464 real patterns.)
const CANONICAL_GRAMMAR_IDS: string[] = [...GRAMMAR_IDS];

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
