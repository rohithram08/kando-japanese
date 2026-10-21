import { describe, it, expect } from 'vitest';
import { n5Stories, n4Stories, allStories, getStoryById } from '../n5_stories';
import { parseFuriganaSegments } from '../../../utils/furiganaUtils';
import { VERIFIED_PITCH_DICTIONARY } from '../../pitch/pitchData';

describe('Graded Reading — Content Expansion & Dataset Validation', () => {
  it('contains fifty stories per level (250 total) across N5, N4, N3, N2, N1 with unique IDs', () => {
    expect(n5Stories.length).toBe(50);
    expect(n4Stories.length).toBe(50);
    expect(allStories.length).toBe(250);

    const ids = new Set<string>();
    allStories.forEach((story) => {
      expect(ids.has(story.id)).toBe(false);
      ids.add(story.id);
    });
  });

  allStories.forEach((story) => {
    describe(`Story: ${story.id} (${story.title}) [${story.level}]`, () => {
      it('has complete metadata and educational provenance', () => {
        expect(story.id).toMatch(/^story_(n5|n4|n3|n2|n1)_\d+$/);
        expect(story.title).toBeTruthy();
        expect(story.titleFurigana).toBeTruthy();
        expect(story.englishTitle).toBeTruthy();
        expect(['N5', 'N4', 'N3', 'N2', 'N1']).toContain(story.level);
        expect(story.estimatedMinutes).toBeGreaterThan(0);
        expect(story.published).toBe(true);
        expect(story.provenance.verified).toBe(true);
        expect(story.provenance.author).toBeTruthy();
      });

      it('has valid, sequential sentences with parseable authored furigana', () => {
        expect(story.sentences.length).toBeGreaterThanOrEqual(8);

        story.sentences.forEach((sentence, idx) => {
          expect(sentence.order).toBe(idx + 1);
          expect(sentence.japanese).toBeTruthy();
          expect(sentence.furigana).toBeTruthy();
          expect(sentence.translation).toBeTruthy();

          // Validate that authored bracket syntax parses cleanly with furiganaUtils
          const segments = parseFuriganaSegments(sentence.furigana);
          expect(segments.length).toBeGreaterThan(0);

          // If the furigana string has kanji, segments must reflect isKanji
          const hasBrackets = sentence.furigana.includes('[') && sentence.furigana.includes(']');
          if (hasBrackets) {
            const kanjiSegments = segments.filter((s) => s.isKanji && s.reading);
            expect(kanjiSegments.length).toBeGreaterThan(0);
          }

          // Validate token integrity: clickable word tokens must not contain punctuation marks
          if (sentence.tokens) {
            sentence.tokens.forEach((tok) => {
              if (tok.isWord) {
                expect(tok.text).not.toMatch(/[、。「」！？]/);
                expect(tok.surface).not.toMatch(/[、。「」！？]/);
                if (tok.vocabKey) {
                  const match = story.vocabulary.find(
                    (v) => v.surface === tok.vocabKey || v.vocabRefId === tok.vocabKey
                  );
                  expect(match).toBeDefined();
                }
              }
            });
          }
        });
      });

      it('has vocabulary annotations with grounded pitch accent records', () => {
        expect(story.vocabulary.length).toBeGreaterThanOrEqual(5);

        story.vocabulary.forEach((vocab) => {
          expect(vocab.surface).toBeTruthy();
          expect(vocab.reading).toBeTruthy();
          expect(vocab.meaning).toBeTruthy();
          expect(vocab.jlptLevel).toBe(story.level);

          if (vocab.pitchVerified) {
            expect(vocab.pitchPattern).toBeDefined();
            expect(typeof vocab.pitchDropPosition).toBe('number');

            // Ground truth verification: verified words MUST exist in VERIFIED_PITCH_DICTIONARY
            const verifiedEntry = VERIFIED_PITCH_DICTIONARY.find(
              (p) => p.word === vocab.surface && p.reading === vocab.reading
            );
            expect(verifiedEntry).toBeDefined();
            expect(verifiedEntry?.dropPosition).toBe(vocab.pitchDropPosition);
          } else {
            // When unverified, no fabricated pitch pattern is claimed
            expect(vocab.pitchPattern).toBeUndefined();
          }
        });
      });

      it('has valid comprehension questions with valid answer indices and explanations', () => {
        expect(story.questions.length).toBeGreaterThanOrEqual(3);

        story.questions.forEach((q) => {
          expect(q.id).toBeTruthy();
          expect(q.question).toBeTruthy();
          expect(q.options.length).toBeGreaterThanOrEqual(3);
          expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswer).toBeLessThan(q.options.length);
          expect(q.explanation).toBeTruthy();
          if (q.referencedSentenceIndex !== undefined) {
            expect(q.referencedSentenceIndex).toBeGreaterThanOrEqual(0);
            expect(q.referencedSentenceIndex).toBeLessThan(story.sentences.length);
          }
        });
      });
    });
  });

  describe('getStoryById helper', () => {
    it('retrieves N5 stories by valid ID', () => {
      const story = getStoryById('story_n5_01');
      expect(story).toBeDefined();
      expect(story?.title).toBe('学生の一日');

      const story3 = getStoryById('story_n5_03');
      expect(story3).toBeDefined();
      expect(story3?.title).toBe('スーパーで買い物');
    });

    it('retrieves N4 stories by valid ID', () => {
      const storyN4 = getStoryById('story_n4_01');
      expect(storyN4).toBeDefined();
      expect(storyN4?.title).toBe('初めての一人旅');
      expect(storyN4?.level).toBe('N4');

      const storyN4_2 = getStoryById('story_n4_02');
      expect(storyN4_2).toBeDefined();
      expect(storyN4_2?.title).toBe('友達へのプレゼント');
    });

    it('returns null for unknown ID', () => {
      expect(getStoryById('unknown_story')).toBeNull();
      expect(getStoryById('')).toBeNull();
    });
  });
});
