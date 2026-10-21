/**
 * SM-2 Spaced Repetition Algorithm
 * Based on SuperMemo 2 algorithm
 *
 * Quality ratings:
 * 0 - Complete blackout, wrong response
 * 1 - Incorrect response, but upon seeing correct answer it felt familiar
 * 2 - Incorrect response, but correct one was easy to recall
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after a hesitation
 * 5 - Perfect response
 */

export function calculateNextReview(card, quality) {
  let {
    ease_factor = 2.5,
    interval_days = 1,
    repetitions = 0
  } = card

  // Validate quality (0-5)
  quality = Math.max(0, Math.min(5, quality))

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval_days = 1
    } else if (repetitions === 1) {
      interval_days = 6
    } else {
      interval_days = Math.round(interval_days * ease_factor)
    }
    repetitions += 1
  } else {
    // Incorrect response - reset
    repetitions = 0
    interval_days = 1
  }

  // Update ease factor
  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  // Cap interval at 365 days
  interval_days = Math.min(interval_days, 365)

  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval_days)

  return {
    ease_factor: parseFloat(ease_factor.toFixed(2)),
    interval_days,
    repetitions,
    next_review_date: nextReviewDate.toISOString().split('T')[0],
    last_review_date: new Date().toISOString().split('T')[0],
    is_mastered: repetitions >= 8 && ease_factor >= 2.0
  }
}

// Convert button press to quality rating
export function buttonToQuality(button) {
  const map = {
    'forgot': 0,
    'hard': 3,
    'good': 4,
    'easy': 5,
    0: 0,
    1: 3,
    2: 4,
    3: 5
  }
  return map[button] ?? 0
}

// Get next review text
export function getNextReviewText(intervalDays) {
  if (intervalDays === 0) return 'Again today'
  if (intervalDays === 1) return 'Tomorrow'
  if (intervalDays < 7) return `${intervalDays} days`
  if (intervalDays < 30) return `${Math.round(intervalDays / 7)} weeks`
  if (intervalDays < 365) return `${Math.round(intervalDays / 30)} months`
  return `${Math.round(intervalDays / 365)} years`
}

// Calculate retention rate
export function calculateRetention(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

// Get difficulty label
export function getDifficultyLabel(easeFactor) {
  if (easeFactor >= 2.5) return { label: 'Easy', color: 'green' }
  if (easeFactor >= 2.0) return { label: 'Medium', color: 'blue' }
  if (easeFactor >= 1.5) return { label: 'Hard', color: 'orange' }
  return { label: 'Very Hard', color: 'red' }
}

// Sort cards by priority (most overdue first)
export function sortCardsByPriority(cards) {
  const today = new Date().toISOString().split('T')[0]

  return [...cards].sort((a, b) => {
    const daysOverdueA = Math.floor(
      (new Date(today) - new Date(a.next_review_date)) / (1000 * 60 * 60 * 24)
    )
    const daysOverdueB = Math.floor(
      (new Date(today) - new Date(b.next_review_date)) / (1000 * 60 * 60 * 24)
    )

    // Prioritize new cards (repetitions === 0)
    if (a.repetitions === 0 && b.repetitions !== 0) return -1
    if (b.repetitions === 0 && a.repetitions !== 0) return 1

    // Then by overdue days
    return daysOverdueB - daysOverdueA
  })
}

// Generate SRS statistics
export function generateSRSStats(cards) {
  const today = new Date().toISOString().split('T')[0]

  const stats = {
    total: cards.length,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
    dueToday: 0,
    averageEaseFactor: 0,
    retentionRate: 0
  }

  let totalEaseFactor = 0
  let totalCorrect = 0
  let totalReviews = 0

  cards.forEach(card => {
    if (card.is_mastered) {
      stats.mastered++
    } else if (card.repetitions === 0) {
      stats.new++
    } else if (card.repetitions <= 2) {
      stats.learning++
    } else {
      stats.review++
    }

    if (card.next_review_date <= today && !card.is_mastered) {
      stats.dueToday++
    }

    totalEaseFactor += card.ease_factor || 2.5
    totalCorrect += card.times_correct || 0
    totalReviews += (card.times_correct || 0) + (card.times_wrong || 0)
  })

  stats.averageEaseFactor = cards.length > 0
    ? parseFloat((totalEaseFactor / cards.length).toFixed(2))
    : 2.5

  stats.retentionRate = totalReviews > 0
    ? Math.round((totalCorrect / totalReviews) * 100)
    : 0

  return stats
}