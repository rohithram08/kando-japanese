// src/utils/storyProgress.js
// ─────────────────────────────────────────────────────────────────────────────
// Pure helper: turns persisted reading progress (progressMap from readingStore)
// into the numbers the Dashboard shows. No hard-coded values — everything is
// derived from the learner's saved progress and the story catalogue.
// ─────────────────────────────────────────────────────────────────────────────

const byRecent = (key) => (a, b) => new Date(b?.[key] || 0).getTime() - new Date(a?.[key] || 0).getTime()

export function summarizeReadingProgress(progressMap = {}, stories = []) {
  const storyById = new Map(stories.map((s) => [s.id, s]))
  const records = Object.values(progressMap || {}).filter((r) => r && storyById.has(r.storyId))

  const completed = records.filter((r) => r.status === 'completed')
  const scores = completed.map((r) => r.quizScore).filter((n) => typeof n === 'number')

  // Most recently touched unfinished story the learner has actually started
  const startedUnfinished = records
    .filter((r) => r.status === 'in_progress' && (r.lastSentenceIndex || 0) > 0)
    .sort(byRecent('updatedAt'))[0]

  const current = startedUnfinished
    ? (() => {
        const story = storyById.get(startedUnfinished.storyId)
        const total = story.sentences?.length || 0
        return {
          story,
          record: startedUnfinished,
          sentenceNumber: Math.min((startedUnfinished.lastSentenceIndex || 0) + 1, Math.max(total, 1)),
          totalSentences: total,
        }
      })()
    : null

  const recent = [...completed]
    .sort(byRecent('completedAt'))
    .slice(0, 3)
    .map((r) => ({ story: storyById.get(r.storyId), record: r, score: r.quizScore ?? null }))

  return {
    totalStories: stories.length,
    completedCount: completed.length,
    quizzesCompleted: completed.length,
    avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    bestScore: scores.length ? Math.max(...scores) : null,
    current,
    recent,
  }
}
