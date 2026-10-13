const n1Lessons = [
  {
    id: 'n1l001', title: 'Classical Japanese Elements in Modern Japanese', titleJp: '現代語に残る古典表現',
    level: 'N1', order: 1, duration: '60 min', xp: 150,
    description: 'Understand classical Japanese grammar patterns that survive in formal modern Japanese.',
    vocabulary: ['古典語', '文語', '現代語', '慣用句', '故事成語'],
    grammar: ['〜べし / べからず', '〜ず (classical negative)', '〜たる (classical で ある)', '〜ゆえに', '〜なり'],
    dialogue: [
      { speaker: 'Literary', jp: '為せば成る、為さねば成らぬ何事も。', en: 'If you try, you will succeed; if you do not try, nothing will be achieved.' },
      { speaker: 'Proverb', jp: '急がば回れ。', en: 'More haste, less speed. (lit. If in a hurry, take the roundabout way.)' },
      { speaker: 'Formal Notice', jp: '関係者以外立入るべからず。', en: 'No entry for unauthorized persons.' },
    ],
    exercises: [
      { type: 'translate', question: 'Translate the classical negative ず: 知らず', answer: 'not knowing / without knowing' },
      { type: 'modernize', question: '〜べからず → modern equivalent', answer: '〜てはいけない / 〜てはならない' },
    ],
    culturalNote: 'Classical Japanese (文語/古文) appears in proverbs, set phrases, legal texts, formal literature, and signage. N1 candidates must recognize these patterns.',
  },
  {
    id: 'n1l002', title: 'Nuanced Expressions of Emotion & Psychology', titleJp: '心理・感情の微妙な表現',
    level: 'N1', order: 2, duration: '55 min', xp: 140,
    description: 'Express subtle emotions and psychological states with precision.',
    vocabulary: ['葛藤', '逡巡', '忸怩', '自嘲', '諦念', '憤慨', '懐疑'],
    grammar: ['〜てやまない', '〜ずにはいられない', '〜を禁じ得ない', '〜のいたりだ', '〜に堪えない'],
    dialogue: [
      { speaker: 'Essay', jp: '彼の無謀な行動に、驚きを禁じ得なかった。', en: 'I could not help but be surprised at his reckless behavior.' },
      { speaker: 'Speech', jp: '皆様のご健康とご発展を願ってやみません。', en: 'I sincerely and endlessly hope for your health and development.' },
      { speaker: 'Monologue', jp: '知っていながら、言わずにはいられなかった。', en: 'Knowing it, I couldn\'t help but say it.' },
    ],
    exercises: [
      { type: 'translate', question: 'I cannot help but admire him.', answer: '彼のことを尊敬せずにはいられない。' },
      { type: 'usage', question: 'What nuance does 〜てやまない carry?', answer: 'Deep, sincere, unceasing emotional state — always used with emotional verbs' },
    ],
    culturalNote: 'These expressions appear frequently in formal speeches, literary works, essays, and business correspondence. They convey deep sincerity.',
  },
  {
    id: 'n1l003', title: 'Logical & Academic Discourse', titleJp: '論理的・学術的表現',
    level: 'N1', order: 3, duration: '60 min', xp: 150,
    description: 'Master the language of academic papers, debates, and logical argumentation.',
    vocabulary: ['論旨', '主張', '根拠', '反論', '帰結', '前提', '論証', '命題'],
    grammar: ['〜に即して', '〜をふまえて', '〜から導かれる', '〜とみなす', '〜に相当する'],
    dialogue: [
      { speaker: 'Academic', jp: 'この研究結果をふまえて、新たな仮説を提唱する。', en: 'Based on these research results, I propose a new hypothesis.' },
      { speaker: 'Debate', jp: '相手の主張は事実に即していない。', en: 'The opponent\'s argument is not based on the facts.' },
      { speaker: 'Paper', jp: 'この現象は経済的格差に起因すると見なすことができる。', en: 'This phenomenon can be considered to originate from economic disparities.' },
    ],
    exercises: [
      { type: 'translate', question: 'Based on the data, we can conclude that...', answer: 'データをふまえて、〜と結論づけられる。' },
    ],
    culturalNote: 'Japanese academic writing heavily uses noun-heavy structures, passive voice, and hedging expressions. Direct assertions are often softened.',
  },
  {
    id: 'n1l004', title: 'Four-Character Idioms (四字熟語)', titleJp: '四字熟語',
    level: 'N1', order: 4, duration: '50 min', xp: 130,
    description: 'Learn essential four-character compound words derived from Chinese classics.',
    vocabulary: [
      '一石二鳥 (one stone two birds)',
      '七転八起 (fall seven rise eight)',
      '以心伝心 (heart to heart communication)',
      '自業自得 (reap what you sow)',
      '臨機応変 (adapting to the situation)',
      '試行錯誤 (trial and error)',
      '先手必勝 (he who acts first wins)',
    ],
    grammar: ['四字熟語 as adverb: 〜に', '四字熟語 as noun modifier: 〜な / の', '四字熟語 as predicate: 〜だ'],
    dialogue: [
      { speaker: 'A', jp: '彼女の対応は本当に臨機応変で素晴らしい。', en: 'Her ability to adapt to situations is truly wonderful.' },
      { speaker: 'B', jp: '試行錯誤を繰り返した末に、ついに解決策が見つかった。', en: 'After repeating trial and error, a solution was finally found.' },
      { speaker: 'A', jp: 'まさに一石二鳥ですね！', en: 'That\'s exactly killing two birds with one stone!' },
    ],
    exercises: [
      { type: 'match', question: 'Match: 自業自得', answer: 'reap what you sow / you brought it on yourself' },
      { type: 'match', question: 'Match: 以心伝心', answer: 'telepathy / heart-to-heart understanding without words' },
    ],
    culturalNote: '四字熟語 are an important part of Japanese literary and formal culture. Many originate from Chinese classics (漢文) and Buddhist teachings.',
  },
  {
    id: 'n1l005', title: 'Political, Legal & Economic Vocabulary', titleJp: '政治・法律・経済用語',
    level: 'N1', order: 5, duration: '60 min', xp: 150,
    description: 'Build vocabulary for understanding Japanese news, law, and economic discourse.',
    vocabulary: ['立法', '司法', '行政', '憲法', '条約', '規制緩和', '財政', 'GDP', '景気', '金融政策'],
    grammar: ['〜に基づいて', '〜を前提として', '〜の観点から', '〜を背景に', '〜に照らして'],
    dialogue: [
      { speaker: 'News', jp: '憲法の規定に基づいて、新たな法律が制定された。', en: 'Based on the provisions of the constitution, a new law was enacted.' },
      { speaker: 'Analysis', jp: '少子化を背景に、移民政策の見直しが求められている。', en: 'Against the backdrop of a declining birthrate, a review of immigration policy is being called for.' },
      { speaker: 'Report', jp: '経済の観点から見ると、この政策は有効だと考えられる。', en: 'From an economic perspective, this policy is considered effective.' },
    ],
    exercises: [
      { type: 'translate', question: 'From a legal perspective', answer: '法律の観点から' },
      { type: 'translate', question: 'Based on the regulations', answer: '規則に基づいて' },
    ],
    culturalNote: 'The ability to understand NHK news broadcasts and read newspaper articles is a practical benchmark for N1 level Japanese.',
  },
];

export default n1Lessons;