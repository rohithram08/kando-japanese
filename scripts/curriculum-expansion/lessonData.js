// scripts/curriculum-expansion/lessonData.js

export const N5_LESSON_EXPANSIONS = [
  {
    id: 'n5l006', title: 'Asking for Directions', titleJp: '道案内と場所',
    level: 'N5', order: 6, duration: '25 min', xp: 50,
    description: 'Learn how to navigate Japanese cities and ask for directions politely.',
    vocabulary: ['みぎ', 'ひだり', 'まっすぐ', 'となり', 'ちかく', 'こうばん'],
    grammar: ['〜はどこですか', '〜をまっすぐ行ってください', '〜のとなりにあります'],
    dialogue: [
      { speaker: 'A', jp: 'すみません、駅はどこですか。', en: 'Excuse me, where is the station?' },
      { speaker: 'B', jp: 'この道をまっすぐ行って、右に曲がってください。', en: 'Go straight along this street and turn right.' },
      { speaker: 'A', jp: 'ありがとうございます！', en: 'Thank you very much!' }
    ],
    exercises: [
      { type: 'translate', question: 'Where is the station?', answer: 'えきはどこですか' },
      { type: 'fill', question: 'この道をまっすぐ___ください。', answer: ['いって'] }
    ],
    culturalNote: 'Japanese police boxes (交番, kouban) are prominent throughout cities and will happily provide directions with maps.'
  },
  {
    id: 'n5l007', title: 'Shopping & Asking Prices', titleJp: '買い物と値段',
    level: 'N5', order: 7, duration: '20 min', xp: 50,
    description: 'Learn how to ask for prices, specify items, and purchase goods in stores.',
    vocabulary: ['いくら', 'これ', 'それ', 'あれ', '店員', 'レシート'],
    grammar: ['これはいくらですか', '〜をください', '〜円です'],
    dialogue: [
      { speaker: 'A', jp: 'すみません、この傘はいくらですか。', en: 'Excuse me, how much is this umbrella?' },
      { speaker: 'B', jp: '千円です。', en: 'It is 1,000 yen.' },
      { speaker: 'A', jp: 'じゃ、これをください。', en: 'Well then, I will take this please.' }
    ],
    exercises: [
      { type: 'translate', question: 'How much is this?', answer: 'これはいくらですか' },
      { type: 'multiple', question: 'How do you say "Please give me this"?', options: ['これをおねがい', 'これをください', 'これです', 'これがある'], answer: 'これをください' }
    ],
    culturalNote: 'When paying in Japan, you place your money into a small plastic or metallic tray (カルトン) on the counter rather than handing it directly.'
  },
  {
    id: 'n5l008', title: 'Ordering at Restaurants', titleJp: 'レストランでの注文',
    level: 'N5', order: 8, duration: '25 min', xp: 55,
    description: 'Master ordering delicious Japanese food, asking for water, and requesting the bill.',
    vocabulary: ['メニュー', 'みず', 'おすすめ', 'おかいけい', 'ごちそうさま'],
    grammar: ['〜をおねがいします', 'おすすめは何ですか', 'お会計をお願いします'],
    dialogue: [
      { speaker: 'A', jp: 'すみません、お水をいただけますか。', en: 'Excuse me, could I get some water?' },
      { speaker: 'B', jp: 'はい、かしこまりました。', en: 'Yes, certainly.' },
      { speaker: 'A', jp: 'あと、ラーメンをひとつお願いします。', en: 'Also, one bowl of ramen, please.' }
    ],
    exercises: [
      { type: 'translate', question: 'Check please', answer: 'おかいけいをおねがいします' },
      { type: 'fill', question: 'メニューを___ください。', answer: ['みせて'] }
    ],
    culturalNote: 'Saying ごちそうさまでした (Gochisousama deshita) when leaving a restaurant expresses heartfelt gratitude for the meal.'
  },
  {
    id: 'n5l009', title: 'Hobbies & Leisure', titleJp: '趣味と余暇',
    level: 'N5', order: 9, duration: '20 min', xp: 50,
    description: 'Talk about your favorite hobbies, sports, music, and weekend activities.',
    vocabulary: ['しゅみ', 'スポーツ', 'おんがく', 'どくしょ', 'りょこう'],
    grammar: ['私の趣味は〜ことです', '〜が好きです', '休みの日に〜をします'],
    dialogue: [
      { speaker: 'A', jp: '趣味は何ですか。', en: 'What is your hobby?' },
      { speaker: 'B', jp: '映画を見ることと、音楽を聴くことです。', en: 'Watching movies and listening to music.' },
      { speaker: 'A', jp: 'どんな映画が好きですか。', en: 'What kind of movies do you like?' }
    ],
    exercises: [
      { type: 'translate', question: 'I like music', answer: 'おんがくがすきです' },
      { type: 'multiple', question: 'How do you say "My hobby is reading"?', options: ['しゅみはほん', 'しゅみはどくしょです', 'しゅみはよみます', 'ほんがすき'], answer: 'しゅみはどくしょです' }
    ],
    culturalNote: 'In Japan, sharing hobbies (趣味) is one of the most common icebreakers when meeting new classmates or colleagues.'
  },
  {
    id: 'n5l010', title: 'Travel & Vacation Plans', titleJp: '旅行と休日の予定',
    level: 'N5', order: 10, duration: '30 min', xp: 60,
    description: 'Learn how to discuss upcoming trips, hotel stays, and vacation dates.',
    vocabulary: ['りょこう', 'ホテル', 'きっぷ', 'おみやげ', 'しゃしん'],
    grammar: ['〜へ行きたいです', '〜泊〜日', '〜でお土産を買いました'],
    dialogue: [
      { speaker: 'A', jp: '週末、どこかへ行きましたか。', en: 'Did you go anywhere over the weekend?' },
      { speaker: 'B', jp: '京都へ行って、たくさん写真を撮りました。', en: 'I went to Kyoto and took lots of photos.' },
      { speaker: 'A', jp: 'いいですね！お土産も買いましたか。', en: 'How nice! Did you also buy souvenirs?' }
    ],
    exercises: [
      { type: 'translate', question: 'I want to go to Kyoto', answer: 'きょうとへいきたいです' },
      { type: 'fill', question: '写真をたくさん___。', answer: ['とりました'] }
    ],
    culturalNote: 'Giving おみやげ (omiyage - souvenir gifts, usually regional snacks) to friends and coworkers after traveling is an essential social norm.'
  }
];

export const N4_LESSON_EXPANSIONS = [
  {
    id: 'n4l006', title: 'Giving and Receiving Favors', titleJp: '授受表現',
    level: 'N4', order: 6, duration: '30 min', xp: 70,
    description: 'Master the nuance of doing things for others and receiving favors using てあげる, てくれる, and てもらう.',
    vocabulary: ['お礼', '親切', '手伝う', '貸す', '借りる'],
    grammar: ['〜てあげる', '〜てくれる', '〜てもらう'],
    dialogue: [
      { speaker: 'A', jp: '重そうな荷物ですね。持ってあげましょうか。', en: 'That luggage looks heavy. Shall I carry it for you?' },
      { speaker: 'B', jp: 'ありがとうございます！助かります。', en: 'Thank you very much! That is a great help.' }
    ],
    exercises: [
      { type: 'translate', question: 'The teacher taught me', answer: 'せんせいがおしえてくれました' },
      { type: 'fill', question: '友達に宿題を___もらいました。', answer: ['てつだって'] }
    ],
    culturalNote: 'In Japanese culture, acknowledging who initiated a favor preserves harmonious social distance and gratitude.'
  },
  {
    id: 'n4l007', title: 'Expressing Completion & Regret', titleJp: '完了と後悔',
    level: 'N4', order: 7, duration: '25 min', xp: 65,
    description: 'Express total completion and unintentional mistakes using 〜てしまう.',
    vocabulary: ['忘れる', '落とす', '失くす', '故障', '遅刻'],
    grammar: ['〜てしまう', '〜ちゃう / 〜じゃう'],
    dialogue: [
      { speaker: 'A', jp: 'どうしたの？元気がなさそうだけど。', en: 'What happened? You don\'t look well.' },
      { speaker: 'B', jp: '電車の中に傘を忘れてしまったんです。', en: 'I accidentally left my umbrella on the train.' }
    ],
    exercises: [
      { type: 'translate', question: 'I dropped my wallet', answer: 'さいふをおとしてしまいました' },
      { type: 'fill', question: '全部食べて___。', answer: ['しまいました'] }
    ],
    culturalNote: '〜てしまう expresses an empathetic vulnerability, signaling to listeners that an error was not malicious.'
  },
  {
    id: 'n4l008', title: 'Conditionals in Daily Conversation', titleJp: '条件表現の使い分け',
    level: 'N4', order: 8, duration: '35 min', xp: 75,
    description: 'Learn the differences between 〜たら, 〜ば, 〜なら, and 〜と in real-world scenarios.',
    vocabulary: ['天気', '都合', '予定', '相談', '連絡'],
    grammar: ['〜たら', '〜ば', '〜なら', '〜と'],
    dialogue: [
      { speaker: 'A', jp: '明日、天気が良ければ海に行きませんか。', en: 'If the weather is good tomorrow, shall we go to the beach?' },
      { speaker: 'B', jp: 'いいですね！雨が降ったら、美術館にしましょう。', en: 'Sounds great! If it rains, let\'s make it an art museum instead.' }
    ],
    exercises: [
      { type: 'translate', question: 'If you arrive, please call me', answer: 'ついたら、でんわしてください' },
      { type: 'multiple', question: 'Which conditional cannot take requests?', options: ['たら', 'ば', 'と', 'なら'], answer: 'と' }
    ],
    culturalNote: '〜と is strictly for natural constants and machine consequences (press this button and change comes out).'
  },
  {
    id: 'n4l009', title: 'Potential and Abilities', titleJp: '可能表現',
    level: 'N4', order: 9, duration: '25 min', xp: 65,
    description: 'Learn how to describe what you can and cannot do using potential verb conjugations.',
    vocabulary: ['運転', '泳ぐ', '話す', '弾く', '料理'],
    grammar: ['可能動詞', '〜ことができる', '〜が見える / 〜が聞こえる'],
    dialogue: [
      { speaker: 'A', jp: '日本語の新聞が読めますか。', en: 'Can you read Japanese newspapers?' },
      { speaker: 'B', jp: '漢字がまだ少ししか読めません。', en: 'I can still only read a few kanji.' }
    ],
    exercises: [
      { type: 'translate', question: 'I can speak Japanese', answer: 'にほんごがはなせます' },
      { type: 'fill', question: '車を___ことができます。', answer: ['うんてんする'] }
    ],
    culturalNote: 'Potential verbs mark their object with が instead of を in standard Japanese (e.g. 寿司が食べられる).'
  },
  {
    id: 'n4l010', title: 'Workplace Requests & Keigo Basics', titleJp: '職場の敬語と依頼',
    level: 'N4', order: 10, duration: '35 min', xp: 80,
    description: 'Learn foundational honorific and humble expressions for office and retail environments.',
    vocabulary: ['部長', '書類', '確認', '承知', '失礼'],
    grammar: ['お〜ください', '〜ていただけますか', 'いらっしゃいませ'],
    dialogue: [
      { speaker: 'A', jp: '部長、この書類をご確認いただけますでしょうか。', en: 'Director, could you please check this document?' },
      { speaker: 'B', jp: '分かりました。後で見ておきます。', en: 'Understood. I will look at it later.' }
    ],
    exercises: [
      { type: 'translate', question: 'Please wait a moment (polite)', answer: 'しょうしょうおまちください' },
      { type: 'fill', question: '少々お___ください。', answer: ['まち'] }
    ],
    culturalNote: 'Keigo reflects humility towards clients and elders while maintaining professional boundaries.'
  }
];

export const N3_LESSON_EXPANSIONS = [
  {
    id: 'n3l006', title: 'Explaining Circumstances and Nuances', titleJp: '事情説明とニュアンス',
    level: 'N3', order: 6, duration: '35 min', xp: 85,
    description: 'Express complex reasoning and clarify misunderstandings using 〜わけだ and 〜わけではない.',
    vocabulary: ['事情', '誤解', '納得', '弁明', '理由'],
    grammar: ['〜わけだ', '〜わけではない', '〜わけがない'],
    dialogue: [
      { speaker: 'A', jp: '彼、急に国へ帰ったらしいよ。', en: 'Apparently he suddenly returned to his home country.' },
      { speaker: 'B', jp: 'お母さんが病気になったそうだ。それで急いで帰国したわけだね。', en: 'I heard his mother fell ill. So that is why he hurried back.' }
    ],
    exercises: [
      { type: 'translate', question: 'It is not that I dislike it', answer: 'きらいなわけではない' },
      { type: 'fill', question: 'そんなはずが___。', answer: ['ない'] }
    ],
    culturalNote: '〜わけだ shows that you have synthesized the facts and empathetically understand the situation.'
  },
  {
    id: 'n3l007', title: 'Contrasts and Surprising Outcomes', titleJp: '対比と予想外の結果',
    level: 'N3', order: 7, duration: '30 min', xp: 80,
    description: 'Compare expectations with reality using 〜わりに and 〜くせに.',
    vocabulary: ['評価', '外見', '価格', '結果', '努力'],
    grammar: ['〜わりに', '〜くせに', '〜にもかかわらず'],
    dialogue: [
      { speaker: 'A', jp: 'このパソコン、安かったのにすごく速いですね。', en: 'Even though this PC was cheap, it is really fast!' },
      { speaker: 'B', jp: '値段のわりには性能が良いと評判ですよ。', en: 'It has a reputation for great performance considering the price.' }
    ],
    exercises: [
      { type: 'translate', question: 'Considering the price, it is delicious', answer: 'ねだんのわりにおいしい' }
    ],
    culturalNote: 'Nuance matters: 〜くせに is strictly derogatory and should never be used toward customers or superiors.'
  },
  {
    id: 'n3l008', title: 'Business Meetings & Problem Solving', titleJp: '業務連絡と課題解決',
    level: 'N3', order: 8, duration: '40 min', xp: 95,
    description: 'Communicate project updates, report delays, and offer collaborative solutions.',
    vocabulary: ['進捗', '課題', '納期', '検討', '対応'],
    grammar: ['〜に関して', '〜について', '〜おそれがある'],
    dialogue: [
      { speaker: 'A', jp: 'プロジェクトの進捗に関してご報告があります。', en: 'I have a report regarding the project\'s progress.' },
      { speaker: 'B', jp: '納期に遅れるおそれがありますか。', en: 'Is there a risk that we might miss the delivery deadline?' }
    ],
    exercises: [
      { type: 'translate', question: 'Regarding this problem', answer: 'このもんだいにかんして' }
    ],
    culturalNote: 'The Japanese business reporting framework Horenso (報告・連絡・相談) is vital in team dynamics.'
  },
  {
    id: 'n3l009', title: 'Healthcare & Clinical Visits', titleJp: '健康と病院での症状説明',
    level: 'N3', order: 9, duration: '30 min', xp: 85,
    description: 'Describe medical symptoms, fever, allergy reactions, and medication schedules accurately.',
    vocabulary: ['症状', '処方箋', 'アレルギー', '安静', '診察'],
    grammar: ['〜気味', '〜がち', '〜てたまらない'],
    dialogue: [
      { speaker: 'A', jp: '昨日から少し風邪気味で、喉が痛くてたまりません。', en: 'I have felt a bit feverish since yesterday, and my throat hurts unbearably.' },
      { speaker: 'B', jp: '無理をせず、薬を飲んで安静にしてください。', en: 'Don\'t push yourself; take your medicine and get some rest.' }
    ],
    exercises: [
      { type: 'translate', question: 'A touch of cold', answer: 'かぜぎみ' }
    ],
    culturalNote: 'In Japan, pharmacies require an official doctor\'s prescription (処方箋, shohousen) for most clinical treatments.'
  },
  {
    id: 'n3l010', title: 'Weather Forecasts & Natural Disasters', titleJp: '気象情報と防災',
    level: 'N3', order: 10, duration: '35 min', xp: 90,
    description: 'Understand news reports on typhoons, earthquakes, evacuation warnings, and seasonal weather.',
    vocabulary: ['警報', '避難', '台風', '地震', '警戒'],
    grammar: ['〜にともなって', '〜を中心に', '〜恐れがある'],
    dialogue: [
      { speaker: 'A', jp: '大型の台風が接近しており、今夜から暴風雨になるおそれがあります。', en: 'A large typhoon is approaching, with risk of storm conditions starting tonight.' },
      { speaker: 'B', jp: '早めに避難場所を確認しておきましょう。', en: 'Let us confirm the evacuation shelters in advance.' }
    ],
    exercises: [
      { type: 'translate', question: 'There is a risk of rain', answer: 'あめのおそれがある' }
    ],
    culturalNote: 'Japan is world-renowned for disaster preparedness drills (防災訓練) held regularly across schools and workplaces.'
  }
];

export const N2_LESSON_EXPANSIONS = [
  {
    id: 'n2l006', title: 'Executive Presentations & Public Speaking', titleJp: 'プレゼンテーションと公式スピーチ',
    level: 'N2', order: 6, duration: '45 min', xp: 110,
    description: 'Structure formal business pitches, introduce project proposals, and address stakeholder questions.',
    vocabulary: ['提言', '概略', '質疑応答', '動向', '主旨'],
    grammar: ['〜をはじめとして', '〜に際して', '〜を踏まえて'],
    dialogue: [
      { speaker: 'A', jp: '本日の発表に際して、市場の最新動向を踏まえた提案をいたします。', en: 'On the occasion of today\'s presentation, I will make a proposal based on recent market trends.' },
      { speaker: 'B', jp: '興味深いですね。具体的な導入計画をお聞かせください。', en: 'Very interesting. Please share the specific implementation timeline.' }
    ],
    exercises: [
      { type: 'translate', question: 'Based on current data', answer: 'げんじょうのデータをふまえて' }
    ],
    culturalNote: 'Japanese business presentations follow the Ki-Shou-Ten-Ketsu or Premise-Analysis-Proposal flow.'
  },
  {
    id: 'n2l007', title: 'Contract Negotiations & Corporate Inquiries', titleJp: '商談と契約交渉',
    level: 'N2', order: 7, duration: '40 min', xp: 105,
    description: 'Master diplomatic business negotiations, formal concession requests, and contractual terms.',
    vocabulary: ['契約締結', '妥協点', '条件', '合意', '猶予'],
    grammar: ['〜を問わず', '〜かねる', '〜ざるを得ない'],
    dialogue: [
      { speaker: 'A', jp: '誠に恐れ入りますが、提示された納期には応じかねます。', en: 'We sincerely apologize, but we are unable to comply with the proposed delivery date.' },
      { speaker: 'B', jp: '左様でございますか。では再検討せざるを得ませんね。', en: 'Is that so? In that case, we have no choice but to reconsider.' }
    ],
    exercises: [
      { type: 'translate', question: 'Unable to accept', answer: 'おうじかねます' }
    ],
    culturalNote: 'Directly saying "No" (いいえ) in Japanese negotiations is avoided; phrases like 応じかねます or 検討いたします are standard.'
  },
  {
    id: 'n2l008', title: 'Editorial Reading & Media Discourse', titleJp: '論説文とメディア批評',
    level: 'N2', order: 8, duration: '45 min', xp: 115,
    description: 'Analyze newspaper editorials, op-eds, and economic columns with sophisticated grammatical connectors.',
    vocabulary: ['論点', '示唆', '客観的', '主観', '世論'],
    grammar: ['〜にほかならない', '〜反面', '〜つつある'],
    dialogue: [
      { speaker: 'A', jp: 'デジタル化が進む反面、プライバシーの保護が課題になりつつある。', en: 'While digitalization advances, privacy protection is gradually becoming an urgent challenge.' },
      { speaker: 'B', jp: '技術革新の恩恵を享受するためには、制度の整備にほかならない。', en: 'To enjoy the benefits of technological innovation, establishing sound regulations is nothing less than essential.' }
    ],
    exercises: [
      { type: 'translate', question: 'Nothing other than the truth', answer: 'しんじつにほかならない' }
    ],
    culturalNote: 'JLPT N2 reading comprehension relies heavily on recognizing logical shift markers like 一方で and 反面.'
  },
  {
    id: 'n2l009', title: 'Demographics & Societal Transformations', titleJp: '少子高齢化と社会構造の変化',
    level: 'N2', order: 9, duration: '40 min', xp: 110,
    description: 'Discuss sociological changes, birthrate dynamics, regional revitalization, and workforce diversification.',
    vocabulary: ['少子化', '高齢化', '過疎化', '雇用', '是正'],
    grammar: ['〜に伴って', '〜を契機に', '〜にわたって'],
    dialogue: [
      { speaker: 'A', jp: '高齢化の進展に伴って、社会保障費の増大が懸念されています。', en: 'Concurrently with the aging population, the expansion of social security costs is raising concern.' },
      { speaker: 'B', jp: '全国にわたって持続可能な地域社会の構築が急務ですね。', en: 'Building sustainable local communities across the entire nation is indeed urgent.' }
    ],
    exercises: [
      { type: 'translate', question: 'Spanning across the country', answer: 'ぜんこくにわたって' }
    ],
    culturalNote: 'Regional revitalization (地方創生, chihou sousei) is one of the highest priority socioeconomic initiatives in modern Japan.'
  },
  {
    id: 'n2l010', title: 'Customer Relations & Crisis Management', titleJp: '危機管理と顧客対応',
    level: 'N2', order: 10, duration: '45 min', xp: 115,
    description: 'Handle customer grievances, issue public apologies, and communicate corrective measures with maximum etiquette.',
    vocabulary: ['謝罪', '再発防止', '信頼回復', '不手際', '謹んで'],
    grammar: ['〜をはじめ', '〜のみならず', '〜に際し'],
    dialogue: [
      { speaker: 'A', jp: 'この度の不手際に関し、謹んでお詫び申し上げます。', en: 'Regarding our recent oversight, we offer our most humble apologies.' },
      { speaker: 'B', jp: '今後は二度とこのような事態が生じないよう、再発防止を徹底してください。', en: 'Going forward, please enforce thorough preventive measures so this never occurs again.' }
    ],
    exercises: [
      { type: 'translate', question: 'We deeply apologize', answer: 'つつしんでおわびもうしあげます' }
    ],
    culturalNote: 'Formal Japanese corporate apologies follow a codified protocol emphasizing restitution, humility, and root-cause remediation.'
  }
];

export const N1_LESSON_EXPANSIONS = [
  {
    id: 'n1l006', title: 'Classical Nuance in Formal Modern Prose', titleJp: '近代文語表現と格調高い文体',
    level: 'N1', order: 6, duration: '60 min', xp: 150,
    description: 'Decipher classical literary particles, archaic verbs, and historic grammatical patterns embedded in official declarations.',
    vocabulary: ['格調', '古風', '文語体', '修辞', '格言'],
    grammar: ['〜たるもの', '〜べからず', '〜んばかり'],
    dialogue: [
      { speaker: 'A', jp: '国民の信託を受けた議員たるものは、私利私欲を捨てて公のために尽くすべきだ。', en: 'Those who are legislators entrusted by the people must cast aside self-interest and serve the public good.' },
      { speaker: 'B', jp: 'まさにその通り。不正は許すべからざる行為である。', en: 'Indeed so. Corruption is an unpardonable act.' }
    ],
    exercises: [
      { type: 'translate', question: 'As an educator', answer: 'きょういくしゃたるもの' }
    ],
    culturalNote: 'Classical grammatical markers like 〜たるもの lend an elevated moral authority and gravity to Japanese statecraft.'
  },
  {
    id: 'n1l007', title: 'Academic Research & Peer Review Discourse', titleJp: '学術論文の批評と討論',
    level: 'N1', order: 7, duration: '55 min', xp: 145,
    description: 'Engage in academic methodology, critique scientific hypotheses, and defend experimental findings.',
    vocabulary: ['仮説', '検証', '査読', '反証', '蓋然性'],
    grammar: ['〜と相まって', '〜に堪えない', '〜であれ'],
    dialogue: [
      { speaker: 'A', jp: '緻密なデータ分析と論理的推論が相まって、本論文の説得力は極めて高い。', en: 'Meticulous data analysis coupled with logical inference lends this paper immense persuasive power.' },
      { speaker: 'B', jp: 'いかなる反論であれ、この実証結果を覆すことは困難でしょう。', en: 'No matter what counter-arguments may arise, overturning these empirical results will be difficult.' }
    ],
    exercises: [
      { type: 'translate', question: 'Coupled with data', answer: 'データとあいまって' }
    ],
    culturalNote: 'Japanese academic publications require rigorous modesty (謙譲) coupled with indisputable empirical substantiation.'
  },
  {
    id: 'n1l008', title: 'Corporate Governance & Strategic Mergers', titleJp: '企業統治と事業再編',
    level: 'N1', order: 8, duration: '60 min', xp: 155,
    description: 'Debate shareholder rights, antitrust compliance, corporate acquisition, and executive fiduciary duties.',
    vocabulary: ['買収', '取締役会', '株主総会', '企業価値', '再編'],
    grammar: ['〜を余儀なくされる', '〜極まりない', '〜まじき'],
    dialogue: [
      { speaker: 'A', jp: '市場競争の激化により、不採算部門の売却を余儀なくされた。', en: 'Due to intensifying market competition, we were forced into divesting unprofitable divisions.' },
      { speaker: 'B', jp: '取締役として株主の利益を損なうような行動は、あるまじきことだ。', en: 'As a board director, actions impairing shareholder value are unpardonable.' }
    ],
    exercises: [
      { type: 'translate', question: 'Forced to change plans', answer: 'けいかくのへんこうをよぎなくされた' }
    ],
    culturalNote: 'Japan\'s revised Corporate Governance Code places heavy emphasis on independent outside directors and capital efficiency.'
  },
  {
    id: 'n1l009', title: 'Jurisprudence & Constitutional Philosophy', titleJp: '法哲学と人権擁護の言説',
    level: 'N1', order: 9, duration: '60 min', xp: 150,
    description: 'Analyze legal precedents, judicial interpretations of constitutional rights, and legal equity.',
    vocabulary: ['判例', '違憲審査', '司法', '法治主義', '条文'],
    grammar: ['〜に即して', '〜を皮切りに', '〜ならでは'],
    dialogue: [
      { speaker: 'A', jp: '時代の変化に即して、憲法解釈の柔軟な適用が議論されている。', en: 'In accordance with changing times, flexible application of constitutional interpretation is being debated.' },
      { speaker: 'B', jp: '法治主義の原則を堅持しつつ、国民の基本的人権を守ることが肝要だ。', en: 'It is essential to uphold the rule of law while safeguarding the fundamental human rights of citizens.' }
    ],
    exercises: [
      { type: 'translate', question: 'Conforming to reality', answer: 'げんじつにそくして' }
    ],
    culturalNote: 'The Supreme Court of Japan (最高裁判所) serves as the ultimate arbiter of constitutional interpretation.'
  },
  {
    id: 'n1l010', title: 'Literary Critique & Aesthetic Philosophy', titleJp: '日本文学の美意識と哲学的思索',
    level: 'N1', order: 10, duration: '60 min', xp: 160,
    description: 'Explore the aesthetic concepts of 物の哀れ (mono no aware), 幽玄 (yuugen), and わび・さび (wabi-sabi) in classical and modern prose.',
    vocabulary: ['美意識', '幽玄', '情緒', '無常観', '文学的'],
    grammar: ['〜きらいがある', '〜だに', '〜ならでは'],
    dialogue: [
      { speaker: 'A', jp: '古典文学に漂う無常観は、日本ならではの美意識の結晶と言えるでしょう。', en: 'The sense of transience that permeates classical literature can truly be called the crystallization of an aesthetic sensibility unique to Japan.' },
      { speaker: 'B', jp: '桜の散り際を惜しむ心だに、その深遠な精神性を物語っています。', en: 'Even the simple sentiment of lamenting the falling cherry blossoms speaks to that profound spirituality.' }
    ],
    exercises: [
      { type: 'translate', question: 'Unique to Japan', answer: 'にほんならでは' }
    ],
    culturalNote: 'Mono no aware (物の哀れ) captures the gentle sadness of impermanence, famously epitomized in The Tale of Genji (源氏物語).'
  }
];
