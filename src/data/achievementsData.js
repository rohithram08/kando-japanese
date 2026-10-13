// ─── Rarity tiers ─────────────────────────────────────────
export const RARITY = {
  common:    { label: 'Common',    color: 'gray',   darkBg: 'bg-gray-500/10',   darkBorder: 'border-gray-500/20',   darkText: 'text-gray-400',   lightBg: 'bg-gray-100',  lightBorder: 'border-gray-200',  lightText: 'text-gray-500'   },
  uncommon:  { label: 'Uncommon',  color: 'green',  darkBg: 'bg-green-500/10',  darkBorder: 'border-green-500/20',  darkText: 'text-green-400',  lightBg: 'bg-green-50',  lightBorder: 'border-green-200', lightText: 'text-green-600'  },
  rare:      { label: 'Rare',      color: 'blue',   darkBg: 'bg-blue-500/10',   darkBorder: 'border-blue-500/20',   darkText: 'text-blue-400',   lightBg: 'bg-blue-50',   lightBorder: 'border-blue-200',  lightText: 'text-blue-600'   },
  epic:      { label: 'Epic',      color: 'purple', darkBg: 'bg-purple-500/10', darkBorder: 'border-purple-500/20', darkText: 'text-purple-400', lightBg: 'bg-purple-50', lightBorder: 'border-purple-200',lightText: 'text-purple-600' },
  legendary: { label: 'Legendary', color: 'yellow', darkBg: 'bg-yellow-500/10', darkBorder: 'border-yellow-500/20', darkText: 'text-yellow-400', lightBg: 'bg-yellow-50', lightBorder: 'border-yellow-200',lightText: 'text-yellow-600' },
}

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'all',        label: 'All',          emoji: '🏆' },
  { id: 'lessons',    label: 'Lessons',      emoji: '📖' },
  { id: 'kanji',      label: 'Kanji',        emoji: '漢' },
  { id: 'vocabulary', label: 'Vocabulary',   emoji: '📝' },
  { id: 'xp',         label: 'XP & Level',   emoji: '⭐' },
  { id: 'streak',     label: 'Streak',       emoji: '🔥' },
  { id: 'review',     label: 'Review & SRS', emoji: '🔁' },
  { id: 'social',     label: 'Social',       emoji: '👥' },
  { id: 'milestone',  label: 'Milestones',   emoji: '🎯' },
  { id: 'secret',     label: 'Secret',       emoji: '🔮' },
]

const safeNum = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0)

// ─── Helper: generate threshold achievements in one line ──
const thresholdAchievement = (id, cat, rarity, emoji, title, desc, statKey, target) => ({
  id, category: cat, rarity, emoji, title, desc,
  condition: (s) => safeNum(s[statKey]) >= target,
  progress:  (s) => ({ current: safeNum(s[statKey]), target }),
})

export const ACHIEVEMENTS = [
  // ── LESSONS ──────────────────────────────────────────────
  thresholdAchievement('first_lesson',       'lessons', 'common',    '📖', 'First Steps',       'Complete your first lesson',  'lessonsCompleted', 1),
  thresholdAchievement('five_lessons',       'lessons', 'common',    '📚', 'Bookworm',           'Complete 5 lessons',          'lessonsCompleted', 5),
  thresholdAchievement('ten_lessons',        'lessons', 'uncommon',  '🎓', 'Scholar',            'Complete 10 lessons',         'lessonsCompleted', 10),
  thresholdAchievement('twentyfive_lessons', 'lessons', 'rare',      '📘', 'Diligent Student',   'Complete 25 lessons',         'lessonsCompleted', 25),
  thresholdAchievement('fifty_lessons',      'lessons', 'epic',      '🏫', 'Academy Graduate',   'Complete 50 lessons',         'lessonsCompleted', 50),
  thresholdAchievement('hundred_lessons',    'lessons', 'legendary', '🎒', 'Sensei Material',    'Complete 100 lessons',        'lessonsCompleted', 100),

  // ── KANJI ────────────────────────────────────────────────
  thresholdAchievement('first_kanji',       'kanji', 'common',    '漢', 'Kanji Beginner',  'Learn your first kanji',         'kanjiLearned', 1),
  thresholdAchievement('ten_kanji',         'kanji', 'common',    '✍️', 'Stroke by Stroke', 'Learn 10 kanji',                 'kanjiLearned', 10),
  thresholdAchievement('fifty_kanji',       'kanji', 'uncommon',  '🏯', 'Kanji Collector', 'Learn 50 kanji',                 'kanjiLearned', 50),
  thresholdAchievement('hundred_kanji',     'kanji', 'rare',      '⛩️', 'Kanji Apprentice','Learn 100 kanji',                'kanjiLearned', 100),
  thresholdAchievement('twohundred_kanji',  'kanji', 'epic',      '🎌', 'Kanji Warrior',   'Learn 200 kanji (N4 level)',     'kanjiLearned', 200),
  thresholdAchievement('fivehundred_kanji', 'kanji', 'epic',      '🗾', 'Kanji Master',    'Learn 500 kanji (N3 level)',     'kanjiLearned', 500),
  thresholdAchievement('thousand_kanji',    'kanji', 'legendary', '🐉', 'Kanji Dragon',    'Learn 1,000 kanji (N2 level)',  'kanjiLearned', 1000),
  thresholdAchievement('twothousand_kanji', 'kanji', 'legendary', '👑', 'Kanji Emperor',   'Learn 2,000+ kanji (N1 level)', 'kanjiLearned', 2000),

  // ── VOCABULARY ───────────────────────────────────────────
  thresholdAchievement('first_vocab',       'vocabulary', 'common',    '📝', 'Word Learner',      'Learn your first vocabulary word', 'vocabLearned', 1),
  thresholdAchievement('twentyfive_vocab',  'vocabulary', 'common',    '📒', 'Word Collector',    'Learn 25 vocabulary words',        'vocabLearned', 25),
  thresholdAchievement('fifty_vocab',       'vocabulary', 'uncommon',  '📓', 'Vocabulary Starter','Learn 50 vocabulary words',        'vocabLearned', 50),
  thresholdAchievement('hundred_vocab',     'vocabulary', 'uncommon',  '📕', 'Vocabulary Builder','Learn 100 vocabulary words',       'vocabLearned', 100),
  thresholdAchievement('twohundred_vocab',  'vocabulary', 'rare',      '📗', 'Word Enthusiast',   'Learn 200 vocabulary words',       'vocabLearned', 200),
  thresholdAchievement('fivehundred_vocab', 'vocabulary', 'epic',      '📙', 'Lexicon Expert',    'Learn 500 vocabulary words',       'vocabLearned', 500),
  thresholdAchievement('thousand_vocab',    'vocabulary', 'epic',      '📖', 'Walking Dictionary','Learn 1,000 vocabulary words',     'vocabLearned', 1000),
  thresholdAchievement('twothousand_vocab', 'vocabulary', 'legendary', '🧠', 'Vocabulary Sage',   'Learn 2,000 vocabulary words',     'vocabLearned', 2000),

  // ── XP ───────────────────────────────────────────────────
  thresholdAchievement('fifty_xp',       'xp', 'common',    '✨', 'Getting Started', 'Earn 50 XP',    'totalXP', 50),
  thresholdAchievement('hundred_xp',     'xp', 'common',    '⭐', 'XP Hunter',       'Earn 100 XP',   'totalXP', 100),
  thresholdAchievement('fivehundred_xp', 'xp', 'uncommon',  '🌟', 'XP Seeker',       'Earn 500 XP',   'totalXP', 500),
  thresholdAchievement('thousand_xp',    'xp', 'uncommon',  '💫', 'XP Master',       'Earn 1,000 XP', 'totalXP', 1000),
  thresholdAchievement('twothousand_xp', 'xp', 'rare',      '🔶', 'XP Warrior',      'Earn 2,000 XP', 'totalXP', 2000),
  thresholdAchievement('fivethousand_xp','xp', 'rare',      '💎', 'XP Legend',       'Earn 5,000 XP', 'totalXP', 5000),
  thresholdAchievement('tenthousand_xp', 'xp', 'epic',      '🏅', 'XP Champion',     'Earn 10,000 XP','totalXP', 10000),
  thresholdAchievement('twentyfivek_xp', 'xp', 'epic',      '👑', 'XP Royalty',      'Earn 25,000 XP','totalXP', 25000),
  thresholdAchievement('fiftyk_xp',      'xp', 'legendary', '🌈', 'XP Transcendent', 'Earn 50,000 XP','totalXP', 50000),

  // ── LEVEL ────────────────────────────────────────────────
  thresholdAchievement('level_three',   'xp', 'common',    '🔰', 'Warming Up',      'Reach Level 3',  'level', 3),
  thresholdAchievement('level_five',    'xp', 'uncommon',  '🎖️', 'Rising Star',     'Reach Level 5',  'level', 5),
  thresholdAchievement('level_ten',     'xp', 'rare',      '🏅', 'Veteran Learner', 'Reach Level 10', 'level', 10),
  thresholdAchievement('level_fifteen', 'xp', 'epic',      '⚔️', 'Elite Student',   'Reach Level 15', 'level', 15),
  thresholdAchievement('level_twenty',  'xp', 'legendary', '🏆', 'Grand Champion',  'Reach Level 20', 'level', 20),

  // ── STREAK ───────────────────────────────────────────────
  thresholdAchievement('first_day',       'streak', 'common',    '🌱', 'Day One',          'Study for the first time',            'streak', 1),
  thresholdAchievement('three_streak',    'streak', 'common',    '🔥', 'On Fire',           'Maintain a 3-day streak',             'streak', 3),
  thresholdAchievement('five_streak',     'streak', 'uncommon',  '🔥', 'Heat Wave',         'Maintain a 5-day streak',             'streak', 5),
  thresholdAchievement('seven_streak',    'streak', 'uncommon',  '📅', 'Week Warrior',      'Maintain a 7-day streak',             'streak', 7),
  thresholdAchievement('fourteen_streak', 'streak', 'rare',      '💪', 'Fortnight Fighter', 'Maintain a 14-day streak',            'streak', 14),
  thresholdAchievement('twentyone_streak','streak', 'rare',      '🧱', 'Habit Builder',     'Maintain a 21-day streak',            'streak', 21),
  thresholdAchievement('thirty_streak',   'streak', 'epic',      '🗓️', 'Monthly Master',    'Maintain a 30-day streak',            'streak', 30),
  thresholdAchievement('sixty_streak',    'streak', 'epic',      '⚡', 'Unstoppable',       'Maintain a 60-day streak',            'streak', 60),
  thresholdAchievement('ninety_streak',   'streak', 'legendary', '💎', 'Quarter Champion',  'Maintain a 90-day streak',            'streak', 90),
  thresholdAchievement('yearly_streak',   'streak', 'legendary', '🌸', 'Year of Sakura',    'Maintain a 365-day streak',           'streak', 365),

  // ── REVIEW / SRS ─────────────────────────────────────────
  thresholdAchievement('first_review',        'review', 'common',    '🔄', 'First Review',   'Complete your first review session', 'cardsReviewed', 1),
  thresholdAchievement('ten_reviews',         'review', 'common',    '🃏', 'Card Flipper',   'Master 10 review cards',             'cardsReviewed', 10),
  thresholdAchievement('fifty_reviews',       'review', 'uncommon',  '🎴', 'Review Regular', 'Master 50 review cards',             'cardsReviewed', 50),
  thresholdAchievement('hundred_reviews',     'review', 'rare',      '🗃️', 'SRS Apprentice', 'Master 100 review cards',            'cardsReviewed', 100),
  thresholdAchievement('fivehundred_reviews', 'review', 'epic',      '📦', 'SRS Master',     'Master 500 review cards',            'cardsReviewed', 500),
  thresholdAchievement('thousand_reviews',    'review', 'legendary', '🏛️', 'SRS Grandmaster','Master 1,000 review cards',          'cardsReviewed', 1000),

  // ── MILESTONES ───────────────────────────────────────────
  {
    id: 'n5_ready', category: 'milestone', rarity: 'uncommon', emoji: '🎯', title: 'N5 Ready',
    desc: 'Learn 100 kanji + 500 vocab (N5 requirement)',
    condition: (s) => safeNum(s.kanjiLearned) >= 100 && safeNum(s.vocabLearned) >= 500,
    progress:  (s) => ({ current: Math.min(safeNum(s.kanjiLearned), 100) + Math.min(safeNum(s.vocabLearned), 500), target: 600 }),
  },
  {
    id: 'n4_ready', category: 'milestone', rarity: 'rare', emoji: '🎯', title: 'N4 Ready',
    desc: 'Learn 300 kanji + 1,500 vocab (N4 requirement)',
    condition: (s) => safeNum(s.kanjiLearned) >= 300 && safeNum(s.vocabLearned) >= 1500,
    progress:  (s) => ({ current: Math.min(safeNum(s.kanjiLearned), 300) + Math.min(safeNum(s.vocabLearned), 1500), target: 1800 }),
  },
  {
    id: 'n3_ready', category: 'milestone', rarity: 'epic', emoji: '🎯', title: 'N3 Ready',
    desc: 'Learn 650 kanji + 3,500 vocab (N3 requirement)',
    condition: (s) => safeNum(s.kanjiLearned) >= 650 && safeNum(s.vocabLearned) >= 3500,
    progress:  (s) => ({ current: Math.min(safeNum(s.kanjiLearned), 650) + Math.min(safeNum(s.vocabLearned), 3500), target: 4150 }),
  },
  {
    id: 'well_rounded', category: 'milestone', rarity: 'rare', emoji: '🌏', title: 'Well-Rounded',
    desc: 'Complete 10+ lessons, 50+ kanji, 100+ vocab',
    condition: (s) => safeNum(s.lessonsCompleted) >= 10 && safeNum(s.kanjiLearned) >= 50 && safeNum(s.vocabLearned) >= 100,
    progress:  (s) => ({ current: Math.min(safeNum(s.lessonsCompleted),10) + Math.min(safeNum(s.kanjiLearned),50) + Math.min(safeNum(s.vocabLearned),100), target: 160 }),
  },
  {
    id: 'triple_threat', category: 'milestone', rarity: 'epic', emoji: '🔱', title: 'Triple Threat',
    desc: 'Reach Level 10, 7-day streak, and 1,000 XP',
    condition: (s) => safeNum(s.level) >= 10 && safeNum(s.streak) >= 7 && safeNum(s.totalXP) >= 1000,
    progress:  (s) => ({ current: (safeNum(s.level) >= 10 ? 1 : 0) + (safeNum(s.streak) >= 7 ? 1 : 0) + (safeNum(s.totalXP) >= 1000 ? 1 : 0), target: 3 }),
  },
  {
    id: 'perfectionist', category: 'milestone', rarity: 'legendary', emoji: '💯', title: 'Perfectionist',
    desc: 'Unlock 50 other achievements',
    condition: (_s, u) => safeNum(u) >= 50,
    progress:  (_s, u) => ({ current: safeNum(u), target: 50 }),
  },

  // ── SOCIAL ───────────────────────────────────────────────
  { id: 'night_owl',     category: 'social', rarity: 'uncommon', emoji: '🦉', title: 'Night Owl',      desc: 'Study after midnight',   condition: () => { const h = new Date().getHours(); return h >= 0 && h < 5  }, progress: () => ({ current: 0, target: 1 }) },
  { id: 'early_bird',    category: 'social', rarity: 'uncommon', emoji: '🐦', title: 'Early Bird',     desc: 'Study before 7 AM',      condition: () => { const h = new Date().getHours(); return h >= 5 && h < 7  }, progress: () => ({ current: 0, target: 1 }) },
  { id: 'weekend_warrior',category:'social', rarity: 'common',   emoji: '🎮', title: 'Weekend Warrior',desc: 'Study on a weekend',     condition: () => { const d = new Date().getDay(); return d === 0 || d === 6 }, progress: () => ({ current: 0, target: 1 }) },
  {
    id: 'explorer', category: 'social', rarity: 'uncommon', emoji: '🗺️', title: 'Explorer',
    desc: 'Visit every section of the app',
    condition: (s) => safeNum(s.lessonsCompleted) >= 1 && safeNum(s.kanjiLearned) >= 1 && safeNum(s.vocabLearned) >= 1 && safeNum(s.cardsReviewed) >= 1,
    progress:  (s) => ({ current: (safeNum(s.lessonsCompleted)>=1?1:0)+(safeNum(s.kanjiLearned)>=1?1:0)+(safeNum(s.vocabLearned)>=1?1:0)+(safeNum(s.cardsReviewed)>=1?1:0), target: 4 }),
  },

  // ── SECRET ───────────────────────────────────────────────
  { id: 'secret_100_daily',  category: 'secret', rarity: 'epic',      emoji: '🔮', title: 'Daily Grinder',     desc: 'Earn 100+ XP in a single day',         condition: (s) => safeNum(s.dailyXP) >= 100,                                          progress: (s) => ({ current: safeNum(s.dailyXP), target: 100 }) },
  { id: 'secret_first_hour', category: 'secret', rarity: 'rare',      emoji: '⏰', title: 'Power Hour',        desc: 'Complete 5 lessons in one session',    condition: (s) => safeNum(s.lessonsCompleted) >= 5,                                   progress: (s) => ({ current: Math.min(safeNum(s.lessonsCompleted), 5), target: 5 }) },
  { id: 'secret_comeback',   category: 'secret', rarity: 'uncommon',  emoji: '🔙', title: 'Welcome Back',      desc: 'Return after losing your streak',       condition: (s) => safeNum(s.lessonsCompleted) >= 2 && safeNum(s.streak) <= 1,       progress: () => ({ current: 0, target: 1 }) },
  { id: 'secret_collector',  category: 'secret', rarity: 'legendary', emoji: '🌟', title: 'Achievement Hunter',desc: 'Discover all secret achievements',      condition: () => false,                                                                progress: () => ({ current: 0, target: 4 }) },
]