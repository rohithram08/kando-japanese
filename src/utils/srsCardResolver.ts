import { VOCABULARY, KANJI } from '../data/index';
import { getKanaById } from '../data/kana/kanaData';
import { getPitchAccent } from '../data/pitch/pitchData';
import type { SRSCard } from '../types/models';

export interface ResolvedCardData {
  id: string;
  cardRefId: string;
  cardType: 'vocabulary' | 'kanji' | 'kana';
  repetitions?: number;
  isMastered?: boolean;
  easeFactor?: number;
  intervalDays?: number;
  front: string;
  reading?: string;
  romaji?: string;
  meaning: string;
  meaning_ta?: string;
  meaning_hi?: string;
  level: string;
  partOfSpeech?: string;
  exampleJp?: string;
  exampleEn?: string;
  onReadings?: string[];
  kunReadings?: string[];
  strokeCount?: number;
  radical?: string;
  mnemonic?: string;
  pitchAccent?: any;
}

/**
 * Searches static datasets to resolve full card details from cardRefId and cardType.
 */
export function resolveCardContent(card: SRSCard): ResolvedCardData {
  const { cardRefId, cardType, id, repetitions = 0, isMastered = false, easeFactor, intervalDays } = card;

  if (cardType === 'kana') {
    const found = getKanaById(cardRefId);
    if (found) {
      const scriptLabel = found.script === 'hiragana' ? 'Hiragana' : 'Katakana';
      return {
        id,
        cardRefId,
        cardType: 'kana',
        repetitions,
        isMastered,
        easeFactor,
        intervalDays,
        front: found.kana,
        reading: found.romaji,
        romaji: found.romaji,
        meaning: `${scriptLabel} character: ${found.romaji}`,
        level: 'Kana',
        strokeCount: found.strokeCount,
        mnemonic: found.mnemonic,
        exampleJp: found.examples?.[0]?.word,
        exampleEn: found.examples?.[0]?.meaning,
      };
    }

    return {
      id,
      cardRefId,
      cardType: 'kana',
      repetitions,
      isMastered,
      easeFactor,
      intervalDays,
      front: cardRefId,
      meaning: 'Kana character',
      level: 'Kana',
    };
  }

  if (cardType === 'kanji') {
    // Search KANJI across all levels
    for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
      const list = (KANJI as Record<string, any[]>)[level] || [];
      const found = list.find(
        (k) =>
          k.id === cardRefId ||
          k.kanji === cardRefId ||
          k.character === cardRefId ||
          k.id?.toLowerCase() === cardRefId.toLowerCase()
      );
      if (found) {
        const onR = found.readings?.on?.filter(Boolean) || [];
        const kunR = found.readings?.kun?.filter((r: string) => r && r !== '-') || [];
        const primaryReading = [...onR, ...kunR].join(', ') || found.reading || '';

        return {
          id,
          cardRefId,
          cardType: 'kanji',
          repetitions,
          isMastered,
          easeFactor,
          intervalDays,
          front: found.kanji || found.character || cardRefId,
          reading: primaryReading,
          meaning: found.meaning || 'Kanji character',
          meaning_ta: found.meaning_ta,
          meaning_hi: found.meaning_hi,
          level: found.level || level,
          onReadings: onR,
          kunReadings: kunR,
          strokeCount: found.strokeCount || found.strokes,
          radical: found.radical,
          mnemonic: found.mnemonic || found.memoryTip,
          exampleJp: found.examples?.[0]?.word || found.examples?.[0]?.kanji,
          exampleEn: found.examples?.[0]?.meaning,
        };
      }
    }

    // Fallback if not found in dataset
    return {
      id,
      cardRefId,
      cardType: 'kanji',
      repetitions,
      isMastered,
      easeFactor,
      intervalDays,
      front: cardRefId,
      meaning: 'Kanji',
      level: 'N5',
    };
  }

  // Otherwise, vocabulary
  for (const level of ['N5', 'N4', 'N3', 'N2', 'N1']) {
    const list = (VOCABULARY as Record<string, any[]>)[level] || [];
    const found = list.find(
      (v) =>
        v.id === cardRefId ||
        v.word === cardRefId ||
        v.id?.toLowerCase() === cardRefId.toLowerCase()
    );
    if (found) {
      return {
        id,
        cardRefId,
        cardType: 'vocabulary',
        repetitions,
        isMastered,
        easeFactor,
        intervalDays,
        front: found.word || cardRefId,
        reading: found.reading || found.kana,
        romaji: found.romaji,
        meaning: found.meaning || found.meaning_en || 'Vocabulary word',
        meaning_ta: found.meaning_ta,
        meaning_hi: found.meaning_hi,
        level: found.level || level,
        partOfSpeech: found.partOfSpeech || found.pos,
        exampleJp: found.example?.jp || found.examples?.[0]?.jp,
        exampleEn: found.example?.en || found.examples?.[0]?.en,
        pitchAccent: getPitchAccent(found.word || cardRefId, found.reading || found.kana) || undefined,
      };
    }
  }

  // Fallback if not found in dataset
  return {
    id,
    cardRefId,
    cardType: 'vocabulary',
    repetitions,
    isMastered,
    easeFactor,
    intervalDays,
    front: cardRefId,
    meaning: 'Vocabulary word',
    level: 'N5',
    pitchAccent: getPitchAccent(cardRefId) || undefined,
  };
}
