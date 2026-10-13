const n3Lessons = [
  {
    id: 'n3l001', title: 'Expressing Reason & Cause (〜ため / 〜せいで / 〜おかげで)', titleJp: '理由・原因の表現',
    level: 'N3', order: 1, duration: '35 min', xp: 80,
    description: 'Learn nuanced ways to express reasons and causes, including blame and gratitude.',
    vocabulary: ['原因', '理由', '結果', '影響', '責任'],
    grammar: ['〜ために', '〜せいで / せいか', '〜おかげで / おかげか', '〜からこそ'],
    dialogue: [
      { speaker: 'A', jp: '試験に合格できたのは、先生のおかげです。', en: 'It is thanks to the teacher that I passed the exam.' },
      { speaker: 'B', jp: '逆に、私は体調が悪かったせいで、試験に集中できませんでした。', en: 'On the contrary, because of my poor health, I couldn\'t concentrate on the exam.' },
      { speaker: 'A', jp: '来年のためにも、もっと準備をしましょう。', en: 'For next year too, let\'s prepare more.' },
    ],
    exercises: [
      { type: 'choose', question: 'Which expresses blame/negative cause?', options: ['おかげで', 'せいで', 'ために'], answer: 'せいで' },
      { type: 'translate', question: 'Thanks to your help, I finished.', answer: 'あなたの助けのおかげで、終わりました。' },
    ],
    culturalNote: 'おかげで implies positive outcome; せいで implies negative outcome. Using them incorrectly can seem sarcastic.',
  },
  {
    id: 'n3l002', title: 'Expressing Contrast (〜のに / 〜くせに / 〜一方)', titleJp: '逆接・対比表現',
    level: 'N3', order: 2, duration: '35 min', xp: 80,
    description: 'Express contrast and unexpected results using various conjunctions.',
    vocabulary: ['対比', '逆接', '一方', '反面', '矛盾'],
    grammar: ['〜のに (unexpected/complaint)', '〜くせに (despite, negative nuance)', '〜一方(で) (on the other hand)', '〜反面'],
    dialogue: [
      { speaker: 'A', jp: 'あんなに勉強したのに、試験に落ちてしまった。', en: 'Even though I studied so much, I ended up failing the exam.' },
      { speaker: 'B', jp: '彼は知っているくせに、知らないふりをしている。', en: 'Despite knowing, he is pretending not to know.' },
      { speaker: 'A', jp: '都市は便利な一方で、自然が少ない。', en: 'While cities are convenient, on the other hand they lack nature.' },
    ],
    exercises: [
      { type: 'choose', question: 'Which carries a nuance of complaint or dissatisfaction?', options: ['一方で', 'のに', 'ために'], answer: 'のに' },
    ],
    culturalNote: 'くせに is stronger and more critical than のに. It implies the speaker thinks the subject should know better.',
  },
  {
    id: 'n3l003', title: 'Potential, Desire & Necessity', titleJp: '可能・願望・必要性',
    level: 'N3', order: 3, duration: '40 min', xp: 85,
    description: 'Express ability, desires, and necessity using various grammatical forms.',
    vocabulary: ['能力', '可能性', '必要性', '希望', '願い'],
    grammar: ['〜ことができる', '〜たがる (third person desire)', '〜必要がある', '〜べきだ', '〜なければならない'],
    dialogue: [
      { speaker: 'A', jp: '彼はいつも新しいゲームを欲しがっています。', en: 'He is always wanting new games.' },
      { speaker: 'B', jp: '健康のためには、もっと野菜を食べるべきです。', en: 'For your health, you should eat more vegetables.' },
      { speaker: 'A', jp: 'そうですね。毎日運動する必要がありますね。', en: 'You\'re right. We need to exercise every day.' },
    ],
    exercises: [
      { type: 'choose', question: 'べきだ vs なければならない: which is stronger obligation?', options: ['べきだ', 'なければならない'], answer: 'なければならない' },
    ],
    culturalNote: 'べきだ expresses a moral obligation or advice; なければならない is a stronger, more external obligation.',
  },
  {
    id: 'n3l004', title: 'Quotation & Reported Speech', titleJp: '引用・伝達表現',
    level: 'N3', order: 4, duration: '35 min', xp: 80,
    description: 'Learn how to report what others said, thought, or heard.',
    vocabulary: ['引用', '伝達', '報告', '噂', '情報'],
    grammar: ['〜と言っていた', '〜と思っている', '〜によると〜そうだ', '〜とのことです', '〜と聞いた'],
    dialogue: [
      { speaker: 'A', jp: '田中さんによると、新しいカフェが駅の近くにできたそうです。', en: 'According to Tanaka, it seems a new cafe opened near the station.' },
      { speaker: 'B', jp: '山田さんは来週旅行に行くと言っていましたよ。', en: 'Yamada said they are going on a trip next week.' },
      { speaker: 'A', jp: '部長から、会議が延期されたとのことです。', en: 'I heard from the manager that the meeting has been postponed.' },
    ],
    exercises: [
      { type: 'translate', question: 'Tanaka said he is tired.', answer: '田中さんは疲れたと言っていました。' },
    ],
    culturalNote: 'Japanese reported speech does not always change tense like English does. Context and time expressions carry tense information.',
  },
  {
    id: 'n3l005', title: 'Expressing Change & Transformation', titleJp: '変化の表現',
    level: 'N3', order: 5, duration: '35 min', xp: 80,
    description: 'Learn how to express gradual or sudden changes in state.',
    vocabulary: ['変化', '成長', '発展', '増加', '減少'],
    grammar: ['〜ようになる', '〜なくなる', '〜てくる', '〜ていく', '〜に変わる'],
    dialogue: [
      { speaker: 'A', jp: '日本語を勉強してから、ニュースが聞き取れるようになりました。', en: 'After studying Japanese, I became able to understand the news.' },
      { speaker: 'B', jp: '最近、手紙を書く人が少なくなりましたね。', en: 'Recently, the number of people who write letters has decreased.' },
      { speaker: 'A', jp: '技術はこれからもっと発展していくでしょう。', en: 'Technology will continue to develop from here on.' },
    ],
    exercises: [
      { type: 'translate', question: 'I became able to swim.', answer: '泳げるようになりました。' },
      { type: 'translate', question: 'I stopped eating meat.', answer: '肉を食べなくなりました。' },
    ],
    culturalNote: 'てくる implies a change coming toward the present from the past; ていく implies a change going away into the future.',
  },
];

export default n3Lessons;