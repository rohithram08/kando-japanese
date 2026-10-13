const n5Lessons = [
  {
    id: 'n5l001', title: 'Greetings & Self-Introduction', titleJp: '挨拶と自己紹介',
    level: 'N5', order: 1, duration: '20 min', xp: 50,
    description: 'Learn essential Japanese greetings and how to introduce yourself.',
    vocabulary: ['こんにちは', 'おはよう', 'こんばんは', 'はじめまして', 'よろしく'],
    grammar: ['〜です', '〜は〜です', 'わたしは〜です'],
    dialogue: [
      { speaker: 'A', jp: 'こんにちは！はじめまして。田中です。', en: 'Hello! Nice to meet you. I am Tanaka.' },
      { speaker: 'B', jp: 'はじめまして。山田です。よろしくお願いします。', en: 'Nice to meet you. I am Yamada. Please treat me well.' },
      { speaker: 'A', jp: 'こちらこそ、よろしくお願いします。', en: 'Likewise, please treat me well.' },
    ],
    exercises: [
      { type: 'translate', question: 'Good morning', answer: 'おはようございます' },
      { type: 'fill', question: '___はじめまして。田中___。', answer: ['はじめまして', 'です'] },
    ],
    culturalNote: 'In Japan, bowing while greeting is customary. The depth of the bow reflects the level of respect.',
  },
  {
    id: 'n5l002', title: 'Numbers & Counting', titleJp: '数字と数え方',
    level: 'N5', order: 2, duration: '25 min', xp: 50,
    description: 'Learn Japanese numbers from 1 to 10,000 and basic counters.',
    vocabulary: ['いち', 'に', 'さん', 'し/よん', 'ご', 'ろく', 'なな/しち', 'はち', 'く/きゅう', 'じゅう'],
    grammar: ['〜つ (general counter)', '〜本 (long objects)', '〜枚 (flat objects)', '〜個 (small objects)'],
    dialogue: [
      { speaker: 'A', jp: 'りんごをいくつ買いますか？', en: 'How many apples will you buy?' },
      { speaker: 'B', jp: 'みっつ買います。', en: 'I will buy three.' },
    ],
    exercises: [
      { type: 'translate', question: 'Seven', answer: 'なな / しち' },
      { type: 'multiple', question: 'How do you say 100?', options: ['じゅう', 'ひゃく', 'せん', 'まん'], answer: 'ひゃく' },
    ],
    culturalNote: 'Japanese has multiple counter systems depending on what is being counted.',
  },
  {
    id: 'n5l003', title: 'Family Members', titleJp: '家族',
    level: 'N5', order: 3, duration: '20 min', xp: 50,
    description: 'Learn vocabulary for family members in Japanese, including humble and honorific forms.',
        vocabulary: ['ちち/おとうさん', 'はは/おかあさん', 'あに/おにいさん', 'あね/おねえさん', 'おとうと', 'いもうと', 'そふ/おじいさん', 'そぼ/おばあさん'],
    grammar: ['〜の家族', '〜がいます', '家族は〜人です'],
    dialogue: [
      { speaker: 'A', jp: 'ご家族は何人ですか？', en: 'How many people are in your family?' },
      { speaker: 'B', jp: '四人家族です。父と母と妹がいます。', en: 'There are four of us. I have a father, mother, and younger sister.' },
      { speaker: 'A', jp: 'いいですね。私は一人っ子です。', en: 'That\'s nice. I am an only child.' },
    ],
    exercises: [
      { type: 'translate', question: 'Older sister (someone else\'s)', answer: 'おねえさん' },
      { type: 'translate', question: 'My father (humble)', answer: 'ちち' },
      { type: 'multiple', question: 'How do you say younger brother?', options: ['あに', 'おとうと', 'いもうと', 'あね'], answer: 'おとうと' },
    ],
    culturalNote: 'Japanese uses different words for your own family (humble) vs. someone else\'s family (honorific). ちち = my father; おとうさん = your/someone\'s father.',
  },
  {
    id: 'n5l004', title: 'Daily Routine & Time', titleJp: '日課と時間',
    level: 'N5', order: 4, duration: '30 min', xp: 60,
    description: 'Learn to talk about daily activities and express time in Japanese.',
    vocabulary: ['おきる', 'ねる', 'たべる', 'いく', 'かえる', 'べんきょうする', 'はたらく', 'あさ', 'ひる', 'よる'],
    grammar: ['〜時に', '〜から〜まで', 'まず〜、それから〜', '〜ます / 〜ません'],
    dialogue: [
      { speaker: 'A', jp: '毎朝何時に起きますか？', en: 'What time do you wake up every morning?' },
      { speaker: 'B', jp: '六時に起きます。それから、シャワーを浴びて、朝ごはんを食べます。', en: 'I wake up at six. Then I take a shower and eat breakfast.' },
      { speaker: 'A', jp: '学校は何時から何時までですか？', en: 'What time is school from and until?' },
      { speaker: 'B', jp: '八時半から三時までです。', en: 'It is from 8:30 until 3:00.' },
    ],
    exercises: [
      { type: 'translate', question: 'I sleep at 11 o\'clock.', answer: '十一時にねます。' },
      { type: 'fill', question: '学校は八時___三時___です。', answer: ['から', 'まで'] },
    ],
    culturalNote: 'Japan uses both the 12-hour and 24-hour clock. Train schedules and official times often use the 24-hour format.',
  },
  {
    id: 'n5l005', title: 'Food & Ordering at a Restaurant', titleJp: '食べ物とレストランで注文する',
    level: 'N5', order: 5, duration: '30 min', xp: 60,
    description: 'Learn food vocabulary and how to order food at a Japanese restaurant.',
    vocabulary: ['ごはん', 'パン', 'さかな', 'にく', 'やさい', 'くだもの', 'みず', 'おちゃ', 'コーヒー', 'おいしい'],
    grammar: ['〜をください', '〜をひとつ / ふたつ', '〜はありますか', 'いただきます / ごちそうさま'],
    dialogue: [
      { speaker: 'Store', jp: 'いらっしゃいませ。何になさいますか？', en: 'Welcome. What will you have?' },
      { speaker: 'A', jp: 'ラーメンをひとつと、餃子をふたつください。', en: 'One ramen and two gyoza please.' },
      { speaker: 'Store', jp: 'お飲み物はいかがですか？', en: 'What would you like to drink?' },
      { speaker: 'A', jp: 'お茶をください。', en: 'Green tea please.' },
    ],
    exercises: [
      { type: 'translate', question: 'Water please.', answer: 'みずをください。' },
      { type: 'multiple', question: 'What do you say before eating?', options: ['ごちそうさま', 'いただきます', 'おねがいします', 'ありがとう'], answer: 'いただきます' },
    ],
    culturalNote: 'いただきます is said before eating, expressing gratitude. ごちそうさまでした is said after eating, thanking the cook or host.',
  },
];

export default n5Lessons;