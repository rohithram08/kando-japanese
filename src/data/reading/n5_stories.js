// src/data/reading/n5_stories.js
// ─────────────────────────────────────────────────────────────────────────────
// Kando Japanese — Graded Japanese Reading Dataset (JLPT N5-N1 Aligned)
// 250 Total Stories (50 per level) loaded from pure canonical JSON architecture
// ─────────────────────────────────────────────────────────────────────────────

import n5StoriesJson from './n5_stories.json';
import n4StoriesJson from './n4_stories.json';
import n3StoriesJson from './n3_stories.json';
import n2StoriesJson from './n2_stories.json';
import n1StoriesJson from './n1_stories.json';

/** @type {import('../../types/reading').GradedStory[]} */
export const n5Stories = n5StoriesJson;
/** @type {import('../../types/reading').GradedStory[]} */
export const n4Stories = n4StoriesJson;
/** @type {import('../../types/reading').GradedStory[]} */
export const n3Stories = n3StoriesJson;
/** @type {import('../../types/reading').GradedStory[]} */
export const n2Stories = n2StoriesJson;
/** @type {import('../../types/reading').GradedStory[]} */
export const n1Stories = n1StoriesJson;

export const allStories = [
  ...n5Stories,
  ...n4Stories,
  ...n3Stories,
  ...n2Stories,
  ...n1Stories,
];

/**
 * Helper to fetch a story by ID across all graded reading levels (N5-N1).
 * @param {string} storyId
 * @returns {import('../../types/reading').GradedStory|null}
 */
export function getStoryById(storyId) {
  if (!storyId) return null;
  return allStories.find((s) => s.id === storyId) || null;
}

export default n5Stories;
