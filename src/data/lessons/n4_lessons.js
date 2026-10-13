const n4Lessons = [
  {
    id: 'n4l001', title: 'Giving & Receiving (てあげる / てもらう / てくれる)', titleJp: '授受表現',
    level: 'N4', order: 1, duration: '35 min', xp: 70,
    description: 'Master the complex system of giving and receiving in Japanese.',
    vocabulary: ['あげる', 'もらう', 'くれる', 'さしあげる', 'いただく', 'くださる'],
    grammar: ['〜てあげる', '〜てもらう', '〜てくれる', '〜ていただく', '〜てくださる'],
    dialogue: [
      { speaker: 'A', jp: '田中さんが荷物を持ってくれました。', en: 'Tanaka carried my bags for me.' },
      { speaker: 'B', jp: 'それは親切ですね。先生に教えていただきましたか？', en: 'That\'s kind. Did you have the teacher teach you?' },
      { speaker: 'A', jp: 'はい、先生に教えていただきました。とても助かりました。', en: 'Yes, I had the teacher teach me. It was very helpful.' },
    ],
    exercises: [
      { type: 'choose', question: 'Friend did something for me (casual)', options: ['あげた', 'くれた', 'もらった'], answer: 'くれた' },
      { type: 'translate', question: 'I had the teacher explain it.', answer: '先生に説明していただきました。' },
    ],
    culturalNote: 'The direction of giving/receiving is crucial in Japanese. Using the wrong form can sound unnatural or even rude.',
  },
  {
    id: 'n4l002', title: 'Causative & Passive Forms', titleJp: '使役形と受身形',
    level: 'N4', order: 2, duration: '40 min', xp: 80,
    description: 'Learn how to make someone do something, and how to express being acted upon.',
    vocabulary: ['させる', 'される', 'させられる', '許可', '強制', '被害'],
    grammar: ['〜させる (causative)', '〜られる (passive)', '〜させられる (causative-passive)'],
    dialogue: [
      { speaker: 'A', jp: '部長に残業させられました。', en: 'I was made to work overtime by the manager.' },
      { speaker: 'B', jp: 'それは大変でしたね。私は子供に野菜を食べさせました。', en: 'That must have been tough. I made my child eat vegetables.' },
    ],
    exercises: [
      { type: 'conjugate', question: '食べる → causative', answer: '食べさせる' },
      { type: 'conjugate', question: '書く → passive', answer: '書かれる' },
    ],
    culturalNote: 'The causative-passive form (させられる) often carries a nuance of being forced to do something against one\'s will.',
  },
  {
    id: 'n4l003', title: 'Expressing Conditions (〜ば / 〜たら / 〜と / 〜なら)', titleJp: '条件表現',
    level: 'N4', order: 3, duration: '40 min', xp: 80,
    description: 'Master the four conditional forms in Japanese and when to use each one.',
    vocabulary: ['もし', '場合', '条件', 'かりに', 'もしも'],
    grammar: ['〜ば', '〜たら', '〜と', '〜なら'],
    dialogue: [
      { speaker: 'A', jp: 'もし時間があれば、映画を見に行きませんか？', en: 'If you have time, shall we go see a movie?' },
      { speaker: 'B', jp: '仕事が終わったら、連絡します。', en: 'When work finishes, I\'ll contact you.' },
      { speaker: 'A', jp: '東京に行くなら、スカイツリーに行ったほうがいいですよ。', en: 'If you\'re going to Tokyo, you should go to Sky Tree.' },
    ],
    exercises: [
      { type: 'fill', question: '春になる___、花見をしましょう。(natural consequence)', answer: 'と' },
      { type: 'fill', question: 'もし宝くじが当たっ___、何を買いますか？(hypothetical)', answer: 'たら' },
    ],
    culturalNote: 'と is for natural/automatic consequences. たら is most versatile. ば is often for hypotheticals. なら is for advice based on new information.',
  },
  {
    id: 'n4l004', title: 'Expressing Hearsay & Appearance (〜そう / 〜らしい / 〜ようだ)', titleJp: '様態・伝聞表現',
    level: 'N4', order: 4, duration: '35 min', xp: 70,
    description: 'Learn how to express what things seem like and what you\'ve heard.',
    vocabulary: ['様子', '伝聞', '推測', '見た目', '聞いた話'],
    grammar: ['〜そうだ (hearsay/appearance)', '〜らしい (seems/hearsay)', '〜ようだ (seems/appears)', '〜みたいだ (casual ようだ)'],
    dialogue: [
      { speaker: 'A', jp: 'ニュースによると、明日は雪が降るそうです。', en: 'According to the news, it seems it will snow tomorrow.' },
      { speaker: 'B', jp: '本当ですか？空を見ると、確かに曇っているようですね。', en: 'Really? Looking at the sky, it certainly does seem cloudy.' },
      { speaker: 'A', jp: '田中さんは風邪を引いたらしいですよ。', en: 'It seems like Tanaka caught a cold.' },
    ],
    exercises: [
      { type: 'distinguish', question: 'Which そうだ means "looks like it will rain" (from appearance)?', options: ['雨が降るそうだ', '雨が降りそうだ'], answer: '雨が降りそうだ' },
    ],
    culturalNote: '〜そうだ has two completely different meanings depending on conjugation: verb-stem + そうだ = looks like; plain form + そうだ = hearsay.',
  },
  {
    id: 'n4l005', title: 'Making Requests & Giving Permission', titleJp: '依頼と許可',
    level: 'N4', order: 5, duration: '30 min', xp: 70,
    description: 'Learn polite ways to make requests and ask for or give permission.',
    vocabulary: ['お願い', '許可', '断る', '承諾', '丁寧'],
    grammar: ['〜てもらえますか', '〜ていただけますか', '〜てもいいですか', '〜てはいけません', '〜なくてもいいです'],
    dialogue: [
      { speaker: 'A', jp: 'すみません、窓を開けてもいいですか？', en: 'Excuse me, is it alright if I open the window?' },
      { speaker: 'B', jp: 'はい、どうぞ。でも、エアコンが入っているので、少しだけにしてください。', en: 'Yes, please go ahead. But since the air conditioning is on, please just a little.' },
      { speaker: 'A', jp: 'わかりました。少し手伝っていただけますか？', en: 'Understood. Could you help me a bit?' },
    ],
    exercises: [
      { type: 'rank', question: 'Rank from most polite to least polite', items: ['〜てくれる？', '〜てもらえますか？', '〜ていただけますか？'], answer: ['〜ていただけますか？', '〜てもらえますか？', '〜てくれる？'] },
    ],
    culturalNote: 'Politeness levels matter greatly in Japanese. Using too casual a form with a superior can be seen as disrespectful.',
  },
];

export default n4Lessons;