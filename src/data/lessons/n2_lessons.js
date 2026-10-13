const n2Lessons = [
  {
    id: 'n2l001', title: 'Formal Written Japanese', titleJp: '書き言葉・フォーマル表現',
    level: 'N2', order: 1, duration: '45 min', xp: 100,
    description: 'Learn the key differences between spoken and written Japanese and formal expression patterns.',
    vocabulary: ['書き言葉', '話し言葉', 'フォーマル', 'ビジネス文書', '公式'],
    grammar: ['〜において', '〜に関して', '〜をめぐって', '〜に際して', '〜にもかかわらず'],
    dialogue: [
      { speaker: 'Formal Letter', jp: '拝啓、時下ますますご清栄のこととお慶び申し上げます。', en: 'Dear Sir/Madam, I hope this letter finds you in good health and spirits.' },
      { speaker: 'Memo', jp: '本件に関して、ご確認いただきますようお願い申し上げます。', en: 'Regarding this matter, we kindly request your confirmation.' },
    ],
    exercises: [
      { type: 'rewrite', question: 'Rewrite formally: 今日、会議があります。', answer: '本日、会議が開催される予定でございます。' },
      { type: 'multiple', question: 'Which is most formal?', options: ['〜で', '〜において', '〜のところ'], answer: '〜において' },
    ],
    culturalNote: 'Business Japanese (ビジネス日本語) has its own set of expressions and formulas. Keigo (敬語) — honorific language — is essential in professional settings.',
  },
  {
    id: 'n2l002', title: 'Keigo — Honorific Language Deep Dive', titleJp: '敬語の深掘り',
    level: 'N2', order: 2, duration: '50 min', xp: 110,
    description: 'Master sonkeigo (respectful), kenjougo (humble), and teineigo (polite) forms.',
    vocabulary: ['尊敬語', '謙譲語', '丁寧語', 'お〜になる', 'ご〜する'],
    grammar: ['お/ご〜になる (sonkeigo)', 'お/ご〜する (kenjougo)', '〜ていらっしゃる', '〜ていただく', '〜でございます'],
    dialogue: [
      { speaker: 'Staff', jp: '部長はただいま外出されていらっしゃいます。', en: 'The manager is currently out.' },
      { speaker: 'Customer', jp: '田中様はいらっしゃいますか？', en: 'Is Tanaka-sama available?' },
      { speaker: 'Staff', jp: '少々お待ちいただけますでしょうか。', en: 'Could you please wait a moment?' },
    ],
    exercises: [
      { type: 'convert', question: '食べます → respectful (sonkeigo)', answer: '召し上がります' },
      { type: 'convert', question: '言います → humble (kenjougo)', answer: '申します' },
      { type: 'convert', question: 'もらいます → humble', answer: 'いただきます' },
    ],
    culturalNote: 'Keigo is fundamental to Japanese professional life. Mistakes in keigo can cause significant social friction in formal settings.',
  },
  {
    id: 'n2l003', title: 'Complex Sentence Structures', titleJp: '複雑な文構造',
    level: 'N2', order: 3, duration: '45 min', xp: 100,
    description: 'Build complex, multi-clause sentences using advanced connectives.',
    vocabulary: ['複合文', '接続詞', '修飾節', '関係節', '従属節'],
    grammar: ['〜ものの', '〜とはいえ', '〜上で', '〜からには', '〜以上は'],
    dialogue: [
      { speaker: 'A', jp: 'やると決めた以上は、最後まで頑張らなければなりません。', en: 'Now that you have decided to do it, you must persevere until the end.' },
      { speaker: 'B', jp: '留学したいとはいえ、お金の問題もあります。', en: 'Although I want to study abroad, there is also the matter of money.' },
      { speaker: 'A', jp: '申し込んだものの、まだ詳細が確認できていません。', en: 'Although I applied, I have not yet been able to confirm the details.' },
    ],
    exercises: [
      { type: 'translate', question: 'Now that I promised, I have to do it.', answer: '約束した以上は、やらなければなりません。' },
    ],
    culturalNote: '〜以上は and 〜からには both mean "now that / since" but 以上は is slightly more formal.',
  },
  {
    id: 'n2l004', title: 'Reading News & Media Japanese', titleJp: 'ニュース・メディアの日本語',
    level: 'N2', order: 4, duration: '50 min', xp: 110,
    description: 'Learn vocabulary and structures commonly used in Japanese news and media.',
    vocabulary: ['報道', '事件', '発表', '政策', '影響', '懸念', '措置', '対策'],
    grammar: ['〜に伴い', '〜を受けて', '〜によれば', '〜との見方', '〜と見られる'],
    dialogue: [
      { speaker: 'News', jp: '政府の発表によれば、新たな経済対策が来月から実施される見通しだ。', en: 'According to the government\'s announcement, new economic measures are expected to be implemented from next month.' },
      { speaker: 'News', jp: '物価上昇に伴い、家計への影響が懸念されている。', en: 'Along with the rise in prices, concerns are growing about the impact on household budgets.' },
    ],
    exercises: [
      { type: 'identify', question: 'Find the source-citing expression', sentence: '関係者によれば、会議は中止になったとのことだ。', answer: 'によれば' },
    ],
    culturalNote: 'News Japanese often uses passive voice and nominalizations. The style is dense and omits particles more frequently than conversational Japanese.',
  },
  {
    id: 'n2l005', title: 'Expressing Degree & Extent', titleJp: '程度・範囲の表現',
    level: 'N2', order: 5, duration: '40 min', xp: 100,
    description: 'Express degree, extent, and limits using advanced grammatical patterns.',
    vocabulary: ['程度', '範囲', '限度', '最低限', '最大限'],
    grammar: ['〜に限って', '〜限り', '〜さえ〜ば', '〜だけあって', '〜ほど〜ない'],
    dialogue: [
      { speaker: 'A', jp: '彼女は努力家だけあって、成績がとても良い。', en: 'As expected of someone who works hard, her grades are very good.' },
      { speaker: 'B', jp: '健康でさえあれば、他のことは何でもできる。', en: 'As long as you are healthy, you can do anything else.' },
      { speaker: 'A', jp: '彼ほど努力している人はいない。', en: 'There is nobody who works as hard as him.' },
    ],
    exercises: [
      { type: 'translate', question: 'As expected of a native speaker, his pronunciation is perfect.', answer: 'ネイティブだけあって、発音が完璧だ。' },
    ],
    culturalNote: '〜だけあって acknowledges that a result is natural given a person\'s background or effort. It always has a positive or expected nuance.',
  },
];

export default n2Lessons;