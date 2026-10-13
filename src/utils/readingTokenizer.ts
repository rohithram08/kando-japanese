// src/utils/readingTokenizer.ts
// ─────────────────────────────────────────────────────────────────────────────
// Sentence Tokenization & Vocabulary Mapping Utility for Graded Readers
// ─────────────────────────────────────────────────────────────────────────────

import type { StorySentence, VocabularyAnnotation, SentenceToken } from '../types/reading';

/**
 * Strips ruby bracket annotations from Japanese text.
 * Example: "学[がく]生[せい]の 一[いち]日[にち]" -> "学生の一日"
 */
export function stripRubyBrackets(text: string): string {
  if (!text) return '';
  return text.replace(/\[[^\]]+\]/g, '');
}

/**
 * Returns clean, segmented tokens for a story sentence.
 * If explicit `sentence.tokens` are authored, uses them directly.
 * Otherwise, applies a safe tokenization fallback preserving all punctuation and furigana.
 *
 * @param {StorySentence} sentence
 * @param {VocabularyAnnotation[]} vocabularyList
 * @returns {SentenceToken[]}
 */
export function getSentenceTokens(
  sentence: StorySentence,
  vocabularyList: VocabularyAnnotation[] = []
): SentenceToken[] {
  if (sentence.tokens && sentence.tokens.length > 0) {
    return sentence.tokens;
  }

  const furigana = sentence.furigana || sentence.japanese || '';
  if (!furigana) return [];

  if (!vocabularyList || vocabularyList.length === 0) {
    return [{ text: furigana, surface: stripRubyBrackets(furigana), isWord: false }];
  }

  const sortedVocab = [...vocabularyList].sort((a, b) => b.surface.length - a.surface.length);
  // Split along whitespace and Japanese punctuation delimiters while preserving them
  const chunks = furigana.split(/(\s+|[、。「」！？])/);
  const tokens: SentenceToken[] = [];

  for (const chunk of chunks) {
    if (!chunk) continue;
    const cleanChunk = stripRubyBrackets(chunk);

    // If chunk is just punctuation or whitespace, preserve as non-word
    if (/^[\s、。「」！？]+$/.test(cleanChunk)) {
      tokens.push({
        text: chunk,
        surface: cleanChunk,
        isWord: false,
      });
      continue;
    }

    // Attempt to match against known vocabulary
    let matchedVocab: VocabularyAnnotation | undefined;
    for (const v of sortedVocab) {
      if (cleanChunk === v.surface || cleanChunk.startsWith(v.surface) || v.surface.startsWith(cleanChunk)) {
        matchedVocab = v;
        break;
      }
    }

    if (matchedVocab) {
      tokens.push({
        text: chunk,
        surface: matchedVocab.surface,
        isWord: true,
        vocabKey: matchedVocab.surface,
      });
    } else {
      tokens.push({
        text: chunk,
        surface: cleanChunk,
        isWord: false,
      });
    }
  }

  return tokens;
}
