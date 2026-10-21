const fs = require('fs');

console.log('Building full enrichment data generator...');

// Let's create an enrichment definitions dictionary
const ENRICHMENTS = {
  story_n5_01: {
    learningElements: [
      {
        id: 'el_n5_01_01',
        type: 'vocabulary',
        text: '学生',
        surface: '学生',
        reading: 'がくせい',
        meaning: 'student',
        roleInStory: 'Identifies Ken as an international student enrolled at a university in Tokyo.',
        mechanicsExplanation: 'Composed of the kanji 学 (to study/learn) and 生 (person/life). Used as a noun referring to students in formal schooling.',
        exampleSentence: {
          japanese: '田中さんは大学の学生です。',
          furigana: '田中[たなか]さんは 大学[だいがく]の 学生[がくせい]です。',
          english: 'Tanaka-san is a university student.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n5_01_02',
        type: 'particle',
        text: 'は',
        surface: 'は',
        reading: 'wa',
        meaning: 'topic marker',
        roleInStory: 'Establishes Ken\'s name and his afternoon schedule as the overarching sentence topics.',
        mechanicsExplanation: 'Pronounced "wa" when serving as a particle. Introduces the thematic topic about which a statement is made.',
        exampleSentence: {
          japanese: '私は日本人ではありません。',
          furigana: '私[わたし]は 日本人[にほんじん]ではありません。',
          english: 'I am not Japanese.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_03',
        type: 'grammar',
        text: '食べて',
        surface: '食べて',
        reading: 'たべて',
        meaning: '〜て form sequential conjunction',
        roleInStory: 'Chains Ken\'s morning routine: eating bread and then drinking coffee in natural sequence.',
        mechanicsExplanation: 'Ichidan verb 食べる changes to 食べて. Used to link consecutive actions in chronological order.',
        exampleSentence: {
          japanese: '顔を洗って、朝ご飯を食べます。',
          furigana: '顔[かお]を 洗[あら]って、朝[あさ]ご飯[はん]を 食[た]べます。',
          english: 'I wash my face and eat breakfast.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_04',
        type: 'particle',
        text: 'で',
        surface: 'で',
        reading: 'de',
        meaning: 'means/transit & location of action',
        roleInStory: 'Marks traveling BY train (電車で) and eating lunch AT the cafeteria (学食で).',
        mechanicsExplanation: 'Specifies the tool/vehicle utilized for an action or the location where an activity takes place.',
        exampleSentence: {
          japanese: '箸で寿司を食べます。',
          furigana: '箸[はし]で 寿司[すし]を 食[た]べます。',
          english: 'I eat sushi with chopsticks.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_05',
        type: 'grammar',
        text: 'から〜まで',
        surface: 'から〜まで',
        reading: 'kara... made',
        meaning: 'from [start] until [end]',
        roleInStory: 'Defines the daily Japanese class duration from 9:00 until 12:00.',
        mechanicsExplanation: 'から indicates the initial temporal or spatial boundary; まで marks the concluding boundary.',
        exampleSentence: {
          japanese: '月曜日から金曜日まで働きます。',
          furigana: '月曜日[げつようび]から 金曜日[きんようび]まで 働[はたら]きます。',
          english: 'I work from Monday through Friday.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_06',
        type: 'kanji',
        text: '校',
        surface: '校',
        reading: 'コウ',
        meaning: 'school / academy',
        roleInStory: 'Appears in 学校 (がっこう - school), Ken\'s daily destination.',
        mechanicsExplanation: 'Composed of radical 木 (wood/tree) and 交 (mingle/intersect), depicting a building where scholars interact.',
        exampleSentence: {
          japanese: '高校へ行きます。',
          furigana: '高校[こうこう]へ 行[い]きます。',
          english: 'I go to high school.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_07',
        type: 'particle',
        text: 'に',
        surface: 'に',
        reading: 'ni',
        meaning: 'specific point in time',
        roleInStory: 'Pinpoints exact schedule times: waking at 7:00 (七時に) and leaving at 8:30 (八時半に).',
        mechanicsExplanation: 'Appended to numerical times and calendar dates to mark the exact moment an action occurs.',
        exampleSentence: {
          japanese: '夜十時に寝ます。',
          furigana: '夜[よる] 十時[じゅうじ]に 寝[ね]ます。',
          english: 'I go to bed at 10:00 PM.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_01_08',
        type: 'vocabulary',
        text: '友達',
        surface: '友達',
        reading: 'ともだち',
        meaning: 'friend',
        roleInStory: 'Ken\'s companion during cafeteria lunch break.',
        mechanicsExplanation: '友 (friend) + 達 (pluralizing collective suffix). Accompanied by companion particle と (友達と = with a friend).',
        exampleSentence: {
          japanese: '友達と映画を見ました。',
          furigana: '友達[ともだち]と 映画[えいが]を 見[み]ました。',
          english: 'I watched a movie with my friend.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      }
    ],
    questions: [
      {
        id: 'story_n5_01_q01',
        type: 'vocabulary',
        question: 'In Sentence 5, what does 「電車」 (でんしゃ) mean?',
        questionFurigana: '第5文[だいごぶん]の「電車[でんしゃ]」の 意味[いみ]は 何[なん]ですか？',
        options: ['Airplane', 'Bicycle', 'Train', 'Bus'],
        correctAnswer: 2,
        explanation: 'Sentence 5 states: 「八時半に電車で学校へ行きます。」 電車 (でんしゃ) means electric train, formed by 電 (electricity) and 車 (vehicle).',
        wrongExplanations: {
          0: 'Airplane in Japanese is 「飛行機」(ひこうき). Ken rides the train.',
          1: 'Bicycle in Japanese is 「自転車」(じてんしゃ). While both contain 車, 電車 means train.',
          2: 'Correct! 電車 (でんしゃ) means electric train, formed from 電 (electricity) and 車 (vehicle).',
          3: 'Bus in Japanese is 「バス」. Ken rides the train to school.'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n5_01_q02',
        type: 'kanji',
        question: 'What is the correct reading and meaning of the kanji in 「学校」?',
        questionFurigana: '「学校[がっこう]」の 正[ただ]しい 読[よ]み方[かた]と 意味[いみ]は どれですか？',
        options: ['がっこう (School)', 'びょういん (Hospital)', 'だいがく (University)', 'としょかん (Library)'],
        correctAnswer: 0,
        explanation: '学校 is pronounced がっこう with a sokuon gemination, meaning school.',
        wrongExplanations: {
          0: 'Correct! 学校 is pronounced がっこう, meaning school.',
          1: 'びょういん is 病院 (hospital), a place for medical care.',
          2: 'だいがく is 大学 (university). Although Ken attends university, 学校 refers to school.',
          3: 'としょかん is 図書館 (library), where Ken reads books later in the afternoon.'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n5_01_q03',
        type: 'grammar',
        question: 'Which grammar pattern correctly connects the sequential actions \'eat bread\' and \'drink coffee\' in Sentence 4?',
        questionFurigana: '第4文[だいよんぶん]で「パンを食[た]べる」と「コーヒーを飲[の]む」を つなぐ 正[ただ]しい 文法[ぶんぽう]は？',
        options: [
          'パンを食べるので、コーヒーを飲みます',
          'パンを食べて、コーヒーを飲みます',
          'パンを食べるから、コーヒーを飲みます',
          'パンを食べるけど、コーヒーを飲みます'
        ],
        correctAnswer: 1,
        explanation: 'The 〜て form (食べて) joins sequential actions naturally in chronological order.',
        wrongExplanations: {
          0: '〜ので expresses logical causality ("Because I eat bread..."), not chronological sequence.',
          1: 'Correct! The 〜て form (食べて) connects sequential actions naturally in chronological order.',
          2: '〜から denotes subjective reason or cause ("Since I eat bread...").',
          3: '〜けど denotes contrast ("Although I eat bread...").'
        },
        referencedSentenceIndex: 3,
      },
      {
        id: 'story_n5_01_q04',
        type: 'particle',
        question: 'Which particle correctly denotes traveling BY train in 「八時半に電車_____学校へ行きます」?',
        questionFurigana: '「八時半[はちじはん]に 電車[でんしゃ]_____ 学校[がっこう]へ 行[い]きます」に 入[はい]る 助詞[じょし]は？',
        options: ['を', 'に', 'で', 'へ'],
        correctAnswer: 2,
        explanation: 'The particle で specifies the instrument, vehicle, or means of transport (電車で = by train).',
        wrongExplanations: {
          0: '「を」 marks direct objects. A train is the vehicle used, not an object being acted upon.',
          1: '「に」 with transport would denote boarding into (電車に乗る), but means of travel requires 「で」.',
          2: 'Correct! 「で」 marks the instrument, vehicle, or means of transport (電車で = by train).',
          3: '「へ」 indicates the direction of motion toward a destination (学校へ).'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n5_01_q05',
        type: 'comprehension',
        question: 'What does Ken do during the afternoon in the story?',
        questionFurigana: 'ケンさんは 午後[ごご]、何[なに]を しますか？',
        options: [
          'Takes a nap in his dorm room',
          'Studies and reads books at the library',
          'Works a part-time job at a café',
          'Plays tennis with his friends'
        ],
        correctAnswer: 1,
        explanation: 'Sentence 8 states: 「午後は図書館で本を読みます。」 (In the afternoon, I read books in the library).',
        wrongExplanations: {
          0: 'Ken returns to his dormitory in the evening at 6:00, not during the afternoon.',
          1: 'Correct! Sentence 8 explicitly states: 「午後は図書館で本を読みます。」 (In the afternoon, I read books in the library).',
          2: 'Ken does not work at a café in this story.',
          3: 'Ken eats lunch with a friend, but does not play tennis.'
        },
        referencedSentenceIndex: 7,
      },
    ]
  },

  story_n5_02: {
    learningElements: [
      {
        id: 'el_n5_02_01',
        type: 'vocabulary',
        text: '喫茶店',
        surface: '喫茶店',
        reading: 'きっさてん',
        meaning: 'coffee shop / café',
        roleInStory: 'The central peaceful setting where Yui spends her rainy Sunday afternoon.',
        mechanicsExplanation: '喫 (consume/drink) + 茶 (tea) + 店 (shop). Traditional Japanese-style coffee houses.',
        exampleSentence: {
          japanese: '静かな喫茶店で勉強します。',
          furigana: '静[しず]かな 喫茶店[きっさてん]で 勉強[べんきょう]します。',
          english: 'I study at a quiet coffee shop.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n5_02_02',
        type: 'grammar',
        text: '降っています',
        surface: '降っています',
        reading: 'ふっています',
        meaning: '〜ています progressive weather state',
        roleInStory: 'Describes the continuous rainfall on Sunday afternoon: 雨が降っています.',
        mechanicsExplanation: 'Godan verb 降る (to fall) becomes 降って + います, describing ongoing meteorological phenomena.',
        exampleSentence: {
          japanese: '今、外で雪が降っています。',
          furigana: '今[いま]、外[そと]で 雪[ゆき]が 降[ふ]っています。',
          english: 'Right now, snow is falling outside.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_03',
        type: 'grammar',
        text: '静かで',
        surface: '静かで',
        reading: 'しずかで',
        meaning: 'na-adjective 〜で conjunction (quiet and...)',
        roleInStory: 'Links two qualities: inside the shop was quiet AND jazz music was playing softly.',
        mechanicsExplanation: 'Na-adjective 静か drops な and adds で to connect coordinate descriptive clauses.',
        exampleSentence: {
          japanese: 'この町は静かで、きれいです。',
          furigana: 'この 町[まち]は 静[しず]かで、きれいです。',
          english: 'This town is quiet and beautiful.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_04',
        type: 'particle',
        text: 'に',
        surface: 'に',
        reading: 'ni',
        meaning: 'target destination of motion / contact surface',
        roleInStory: 'Marks the chair Yui sits upon: 窓の近くの席に座りました.',
        mechanicsExplanation: 'Contact and settlement verbs like 座る (to sit) take に to mark the arrival target surface.',
        exampleSentence: {
          japanese: '椅子に座ってください。',
          furigana: '椅子[いす]に 座[すわ]ってください。',
          english: 'Please sit in the chair.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_05',
        type: 'grammar',
        text: 'お願いします',
        surface: 'お願いします',
        reading: 'おねがいします',
        meaning: 'polite request phrase (please)',
        roleInStory: 'Politely ordering iced coffee and matcha cake from the café server.',
        mechanicsExplanation: 'Noun + を + お願いします is the idiomatic, polite Japanese phrasing for ordering in restaurants.',
        exampleSentence: {
          japanese: 'お水を二つお願いします。',
          furigana: 'お水[みず]を 二[ふた]つ お願[ねが]いします。',
          english: 'Two glasses of water, please.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_06',
        type: 'kanji',
        text: '店',
        surface: '店',
        reading: 'テン / みせ',
        meaning: 'shop / store',
        roleInStory: 'Appears in 喫茶店 (kissaten) and 店員 (clerk/server).',
        mechanicsExplanation: 'Radical 广 (shelter/building) housing 占 (divine/occupy), evoking an established mercantile counter.',
        exampleSentence: {
          japanese: 'あの店はとても人気があります。',
          furigana: 'あの 店[みせ]は とても 人気[にんき]が あります。',
          english: 'That shop is very popular.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_07',
        type: 'particle',
        text: 'と',
        surface: 'と',
        reading: 'to',
        meaning: 'exhaustive listing particle (and)',
        roleInStory: 'Combines two menu items ordered together: アイスコーヒーと抹茶ケーキ.',
        mechanicsExplanation: 'Lists concrete nouns exhaustively within a phrase without implying unstated items.',
        exampleSentence: {
          japanese: 'りんごとみかんを買いました。',
          furigana: 'りんごと みかんを 買[か]いました。',
          english: 'I bought apples and mandarin oranges.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_02_08',
        type: 'vocabulary',
        text: '小説',
        surface: '小説',
        reading: 'しょうせつ',
        meaning: 'novel / fiction book',
        roleInStory: 'The absorbing book Yui reads while sipping her coffee.',
        mechanicsExplanation: '小 (small) + 説 (tale/theory), meaning prose fiction novel.',
        exampleSentence: {
          japanese: '日本の小説が好きです。',
          furigana: '日本[にほん]の 小説[しょうせつ]が 好[す]きです。',
          english: 'I like Japanese novels.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      }
    ],
    questions: [
      {
        id: 'story_n5_02_q01',
        type: 'vocabulary',
        question: 'What does the word 「店員」 (てんいん) mean in Sentence 5?',
        questionFurigana: '第5文[だいごぶん]の「店員[てんいん]」の 意味[いみ]は 何[なん]ですか？',
        options: ['Store manager', 'Shop attendant / Waiter', 'Fellow customer', 'Delivery courier'],
        correctAnswer: 1,
        explanation: '店員 (てんいん) means shop employee, clerk, or café waiter.',
        wrongExplanations: {
          0: 'Store manager is 店長 (てんちょう). 店員 is a general floor clerk or server.',
          1: 'Correct! 店員 (てんいん) means shop clerk, store employee, or restaurant server.',
          2: 'Customer in Japanese is お客さん (おきゃくさん).',
          3: 'Delivery courier is 配達員 (はいたついん).'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n5_02_q02',
        type: 'kanji',
        question: 'What is the reading and meaning of 「雨」 in Sentence 1?',
        questionFurigana: '第1文[だいいちぶん]の「雨[あめ]」の 読[よ]み方[かた]と 意味[いみ]は？',
        options: ['あめ (Rain)', 'ゆき (Snow)', 'かぜ (Wind)', 'くも (Cloud)'],
        correctAnswer: 0,
        explanation: '雨 is pronounced あめ, meaning rain.',
        wrongExplanations: {
          0: 'Correct! 雨 is read あめ, meaning rain.',
          1: 'ゆき is 雪 (snow).',
          2: 'かぜ is 風 (wind).',
          3: 'くも is 雲 (cloud).'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n5_02_q03',
        type: 'grammar',
        question: 'Which expression is the most natural, polite way to order something at a café?',
        questionFurigana: '喫茶店[きっさてん]で 注文[ちゅうもん]する時[とき]の 最[もっと]も 丁[てい]寧[ねい]な 言[い]い方[かた]は？',
        options: [
          'ケーキをくれ',
          'ケーキをお願いします',
          'ケーキを食べろ',
          'ケーキを注文するぞ'
        ],
        correctAnswer: 1,
        explanation: '「〜をお願いします」 (o-negai shimasu) is the polite standard formulation for ordering food or beverages.',
        wrongExplanations: {
          0: '「〜をくれ」 is a blunt, demanding command unsuitable for polite customer interaction.',
          1: 'Correct! 「〜をお願いします」 (o-negai shimasu) is the polite standard phrase for ordering food or beverages.',
          2: '「〜を食べろ」 is a harsh imperative order ("Eat the cake!").',
          3: '「〜を注文するぞ」 is theatrical masculine self-talk, not suitable for ordering from staff.'
        },
        referencedSentenceIndex: 5,
      },
      {
        id: 'story_n5_02_q04',
        type: 'particle',
        question: 'Which particle is required after the seating surface in 「窓の近くの席_____座りました」?',
        questionFurigana: '「窓[まど]の 近[ちか]くの 席[せき]_____ 座[すわ]りました」に 入[はい]る 助詞[じょし]は？',
        options: ['を', 'で', 'に', 'から'],
        correctAnswer: 2,
        explanation: 'Contact surface or destination endpoint verbs like 座る (to sit) take 「に」 (席に座る = sit in a seat).',
        wrongExplanations: {
          0: '「を」 marks direct objects. A seat is the surface rested upon, not an object being manipulated.',
          1: '「で」 indicates where an ongoing event occurs. With 座る (to sit down), the contact surface requires 「に」.',
          2: 'Correct! Contact or destination point verbs like 座る (to sit) take 「に」 (席に座る = to sit in a seat).',
          3: '「から」 means "from", which would imply rising up and departing from the seat.'
        },
        referencedSentenceIndex: 3,
      },
      {
        id: 'story_n5_02_q05',
        type: 'comprehension',
        question: 'Why was Yui\'s afternoon at the café so enjoyable and calming?',
        questionFurigana: 'ユイさんの 喫茶店[きっさてん]での 時間[じかん]が 穏[おだ]やかだった 理由[りゆう]は 何[なん]ですか？',
        options: [
          'Her friends arrived and chatted loudly',
          'The shop was quiet with jazz music, and she enjoyed matcha cake with her novel',
          'She watched an action movie on her laptop',
          'The store gave her free coffee because it was her birthday'
        ],
        correctAnswer: 1,
        explanation: 'The story depicts a calm atmosphere, soft jazz, tasty matcha cake, and an engrossing novel.',
        wrongExplanations: {
          0: 'The café was quiet and peaceful, not noisy with chatting friends.',
          1: 'Correct! The story highlights the serene atmosphere, soft jazz background music, matcha cake, and engrossing novel.',
          2: 'Yui read a book, she did not stream a movie.',
          3: 'No free coffee promotion or birthday was mentioned in the story.'
        },
        referencedSentenceIndex: 8,
      },
    ]
  },

  story_n5_03: {
    learningElements: [
      {
        id: 'el_n5_03_01',
        type: 'vocabulary',
        text: '買い物',
        surface: '買い物',
        reading: 'かいもの',
        meaning: 'shopping / purchases',
        roleInStory: 'The core purpose of Sora\'s evening trip to the neighborhood supermarket.',
        mechanicsExplanation: 'Verb stem 買い (buying) + 物 (goods/things), nominalized as "shopping".',
        exampleSentence: {
          japanese: '週末にスーパーで買い物をします。',
          furigana: '週末[しゅうまつ]に スーパーで 買[か]い物[もの]を します。',
          english: 'I do grocery shopping at the supermarket on weekends.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n5_03_02',
        type: 'grammar',
        text: '作りたい',
        surface: '作りたい',
        reading: 'つくりたい',
        meaning: '〜たい expressing desire (want to make)',
        roleInStory: 'Expresses Sora\'s culinary plan: 今晩カレーを作りたいです (I want to make curry tonight).',
        mechanicsExplanation: 'Godan verb 作る (tsukuru) becomes 作ります → 作りたい. Conjugates like an い-adjective.',
        exampleSentence: {
          japanese: '日本料理を作りたいです。',
          furigana: '日本[にほん]料理[りょうり]を 作[つく]りたいです。',
          english: 'I want to cook Japanese cuisine.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_03_03',
        type: 'particle',
        text: 'や',
        surface: 'や',
        reading: 'ya',
        meaning: 'non-exhaustive listing particle (and, among others)',
        roleInStory: 'Lists ingredients without naming every single item: 肉や野菜 (meat, vegetables, and so forth).',
        mechanicsExplanation: 'Unlike と (exhaustive), や indicates that other items in the category exist unmentioned.',
        exampleSentence: {
          japanese: '机の上に本やノートがあります。',
          furigana: '机[つくえ]の 上[うえ]に 本[ほん]や ノートが あります。',
          english: 'There are books, notebooks, and other items on the desk.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_03_04',
        type: 'vocabulary',
        text: '安い',
        surface: '安い',
        reading: 'やすい',
        meaning: 'cheap / inexpensive',
        roleInStory: 'Describes the good prices at the market: 肉も野菜もとても安かったです.',
        mechanicsExplanation: 'い-adjective for low price. Past tense form is 安かった (was inexpensive).',
        exampleSentence: {
          japanese: 'このリンゴはとても安いです。',
          furigana: 'この リンゴは とても 安[やす]いです。',
          english: 'This apple is very cheap.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n5_03_05',
        type: 'kanji',
        text: '買',
        surface: '買',
        reading: 'バイ / か-う',
        meaning: 'to buy / purchase',
        roleInStory: 'Root kanji in 買い物 (shopping) and 買いました (bought).',
        mechanicsExplanation: 'Upper net 罒 + lower cowrie shell 貝 (ancient currency unit), representing trading money for goods.',
        exampleSentence: {
          japanese: '新しい靴を買いました。',
          furigana: '新[あたら]しい 靴[くつ]を 買[か]いました。',
          english: 'I bought new shoes.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_03_06',
        type: 'grammar',
        text: '見せてください',
        surface: '見せてください',
        reading: 'みせてください',
        meaning: '〜てください polite request (please show)',
        roleInStory: 'The cashier politely asks for Sora\'s store membership card: ポイントカードを見せてください.',
        mechanicsExplanation: 'Ichidan verb 見せる becomes 見せて + ください, formulating a respectful instruction or request.',
        exampleSentence: {
          japanese: '切符を見せてください。',
          furigana: '切符[きっぷ]を 見[み]せてください。',
          english: 'Please show your ticket.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_03_07',
        type: 'particle',
        text: 'を',
        surface: 'を',
        reading: 'o',
        meaning: 'direct object marker',
        roleInStory: 'Marks the items added to the basket and bought: カレーのルーを買いました.',
        mechanicsExplanation: 'Pronounced "o". Connects transitive action verbs to their immediate direct recipients.',
        exampleSentence: {
          japanese: 'おいしいリンゴを食べました。',
          furigana: 'おいしい リンゴを 食[た]べました。',
          english: 'I ate a delicious apple.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_03_08',
        type: 'vocabulary',
        text: '晩ご飯',
        surface: '晩ご飯',
        reading: 'ばんごはん',
        meaning: 'dinner / evening meal',
        roleInStory: 'The hot homemade curry Sora anticipates cooking and eating tonight.',
        mechanicsExplanation: '晩 (evening/night) + ご飯 (cooked rice/meal).',
        exampleSentence: {
          japanese: '今夜の晩ご飯は何ですか。',
          furigana: '今夜[こんや]の 晩[ばん]ご飯[はん]は 何[なん]ですか。',
          english: 'What is for dinner tonight?'
        },
        jlptLevel: 'N5',
        pitchPattern: 'nakadaka'
      }
    ],
    questions: [
      {
        id: 'story_n5_03_q01',
        type: 'vocabulary',
        question: 'What does the compound 「買い物」 (かいもの) mean?',
        questionFurigana: '「買[か]い物[もの]」の 意味[いみ]は 何[なん]ですか？',
        options: ['Cooking dinner', 'Shopping / Buying goods', 'Going for a walk', 'Cleaning the kitchen'],
        correctAnswer: 1,
        explanation: '買い物 (かいもの) means shopping, formed by 買う (to buy) + 物 (things).',
        wrongExplanations: {
          0: 'Cooking dinner is 晩ご飯を作る or 料理. 買い物 is shopping.',
          1: 'Correct! 買い物 (かいもの) means shopping, formed from 買う (to buy) + 物 (things).',
          2: 'Going for a walk is 散歩 (さんぽ).',
          3: 'Cleaning the kitchen is 台所の掃除 (そうじ).'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n5_03_q02',
        type: 'kanji',
        question: 'Which kanji character means \'to buy\' (かう)?',
        questionFurigana: '「か・う」と 読[よ]む 漢字[かんじ]は どれですか？',
        options: ['売', '買', '食', '行'],
        correctAnswer: 1,
        explanation: '買 (かう) means to buy. Note the lower cowrie currency radical 貝.',
        wrongExplanations: {
          0: '売 (うる) means to sell, the direct opposite of buying.',
          1: 'Correct! 買 (かう) means to buy, featuring the currency radical 貝 at the base.',
          2: '食 (たべる) means to eat.',
          3: '行 (いく) means to go.'
        },
        referencedSentenceIndex: 6,
      },
      {
        id: 'story_n5_03_q03',
        type: 'grammar',
        question: 'What is the grammatical difference between listing particles 「と」 and 「や」?',
        questionFurigana: '名詞[めいし]を つなぐ 助詞[じょし]「と」と「や」の 違[ちが]いは 何[なん]ですか？',
        options: [
          '「と」 lists items exhaustively, while 「や」 implies an open-ended list with more items',
          '「と」 is only for people, while 「や」 is only for food',
          '「や」 is past tense, while 「と」 is future tense',
          'There is no grammatical difference between them'
        ],
        correctAnswer: 0,
        explanation: '「と」 lists all items complete and exhaustive. 「や」 indicates "A, B, and others like them" (non-exhaustive).',
        wrongExplanations: {
          0: 'Correct! 「と」 lists all items exhaustively. 「や」 indicates an open-ended list ("A, B, and others like them").',
          1: 'Both particles apply to all concrete nouns regardless of category.',
          2: 'Particles do not have tense conjugations.',
          3: 'They serve distinctly different listing functions in Japanese grammar.'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n5_03_q04',
        type: 'particle',
        question: 'Which particle completes the sentence: 「今晩カレー_____作りたいです」?',
        questionFurigana: '「今晩[こんばん] カレー_____ 作[つく]りたいです」に 入[はい]る 助詞[じょし]は？',
        options: ['に', 'で', 'を', 'から'],
        correctAnswer: 2,
        explanation: '「を」 marks the direct object of the verb 作る (カレーを作る = make curry).',
        wrongExplanations: {
          0: '「に」 denotes destination or time, not the dish being created.',
          1: '「で」 indicates location or utensil used, not the food object.',
          2: 'Correct! 「を」 marks the direct object of the verb 作る (カレーを作る = make curry).',
          3: '「から」 means "from / because".'
        },
        referencedSentenceIndex: 1,
      },
      {
        id: 'story_n5_03_q05',
        type: 'comprehension',
        question: 'Why did Sora go to the supermarket in the story?',
        questionFurigana: 'ソラさんは なぜ スーパーへ 行[い]きましたか？',
        options: [
          'To buy medicine for a cold',
          'To buy ingredients because she wanted to make curry',
          'To meet her teacher after class',
          'To return an umbrella she borrowed'
        ],
        correctAnswer: 1,
        explanation: 'Sentence 2 states: 「今晩カレーを作りたいですから、スーパーへ行きました。」 (Because I want to make curry tonight, I went to the supermarket).',
        wrongExplanations: {
          0: 'Sora was in good health and shopping for groceries, not medicine.',
          1: 'Correct! Sentence 2 states: 「今晩カレーを作りたいですから、スーパーへ行きました。」 (Because I want to make curry tonight, I went to the supermarket).',
          2: 'Sora went alone to shop for dinner ingredients.',
          3: 'No umbrella or borrowed items were mentioned in this story.'
        },
        referencedSentenceIndex: 1,
      },
    ]
  },

  story_n5_04: {
    learningElements: [
      {
        id: 'el_n5_04_01',
        type: 'vocabulary',
        text: '散歩',
        surface: '散歩',
        reading: 'さんぽ',
        meaning: 'walk / stroll',
        roleInStory: 'The peaceful outdoor activity Daiki enjoys on a clear Saturday morning.',
        mechanicsExplanation: '散 (scatter/disperse) + 歩 (walk/step), meaning a relaxing, leisurely stroll.',
        exampleSentence: {
          japanese: '毎朝、公園を散歩します。',
          furigana: '毎朝[まいあさ]、公園[こうえん]を 散歩[さんぽ]します。',
          english: 'I take a walk in the park every morning.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n5_04_02',
        type: 'grammar',
        text: '散歩に行く',
        surface: '散歩に行く',
        reading: 'さんぽにいく',
        meaning: '〜に行く purpose of motion (go for a walk)',
        roleInStory: 'Describes traveling to the park FOR the specific purpose of walking: 公園へ散歩に行きました.',
        mechanicsExplanation: 'Noun or verb stem + に + 行く/来る indicates the objective or goal of displacement.',
        exampleSentence: {
          japanese: '図書館へ本を借りに行きます。',
          furigana: '図書館[としょかん]へ 本[ほん]を 借[か]りに 行[い]きます。',
          english: 'I go to the library to borrow books.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_04_03',
        type: 'vocabulary',
        text: '天気',
        surface: '天気',
        reading: 'てんき',
        meaning: 'weather',
        roleInStory: 'Describes the bright, clear morning atmosphere: とてもいい天気でした.',
        mechanicsExplanation: '天 (heaven/sky) + 気 (atmosphere/spirit).',
        exampleSentence: {
          japanese: '明日の天気はどうですか。',
          furigana: '明日[あした]の 天気[てんき]は どうですか。',
          english: 'How is tomorrow\'s weather?'
        },
        jlptLevel: 'N5',
        pitchPattern: 'atamadaka'
      },
      {
        id: 'el_n5_04_04',
        type: 'particle',
        text: 'が',
        surface: 'が',
        reading: 'ga',
        meaning: 'subject marker / spontaneous observation',
        roleInStory: 'Marks the cherry blossoms observed in bloom: きれいな桜の花が咲いていました.',
        mechanicsExplanation: 'が marks the grammatical subject, specifically with intransitive verbs (咲く) and direct sensory observations.',
        exampleSentence: {
          japanese: '庭にきれいな花が咲いています。',
          furigana: '庭[にわ]に きれいな 花[はな]が 咲[さ]いています。',
          english: 'Beautiful flowers are blooming in the garden.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_04_05',
        type: 'kanji',
        text: '花',
        surface: '花',
        reading: 'カ / はな',
        meaning: 'flower / blossom',
        roleInStory: 'Appears in 花 (blossom) and 花見 (flower viewing).',
        mechanicsExplanation: 'Radical 艹 (grass/plant) atop 化 (transform), depicting the blooming transformation of plants.',
        exampleSentence: {
          japanese: '公園で花を見ました。',
          furigana: '公園[こうえん]で 花[はな]を 見[み]ました。',
          english: 'I saw flowers in the park.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_04_06',
        type: 'grammar',
        text: '見ながら',
        surface: '見ながら',
        reading: 'みながら',
        meaning: '〜ながら simultaneous action (while doing)',
        roleInStory: 'Sipping chilled green tea WHILE admiring the scenery: 景色を見ながら、冷たいお茶を飲みました.',
        mechanicsExplanation: 'Verb masu-stem + ながら indicates two actions performed concurrently by the same agent.',
        exampleSentence: {
          japanese: '音楽を聞きながら宿題をします。',
          furigana: '音楽[おんがく]を 聞[き]きながら 宿題[しゅくだい]を します。',
          english: 'I do homework while listening to music.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_04_07',
        type: 'particle',
        text: 'も',
        surface: 'も',
        reading: 'mo',
        meaning: 'inclusive addition particle (also / too)',
        roleInStory: 'Adds that birds were also singing merrily in the trees: 鳥も歌っていました.',
        mechanicsExplanation: 'Replaces は, が, or を to indicate that the same predicate applies to this additional noun as well.',
        exampleSentence: {
          japanese: '私も学生です。',
          furigana: '私[わたし]も 学生[がくせい]です。',
          english: 'I am also a student.'
        },
        jlptLevel: 'N5'
      },
      {
        id: 'el_n5_04_08',
        type: 'vocabulary',
        text: '写真',
        surface: '写真',
        reading: 'しゃしん',
        meaning: 'photograph / photo',
        roleInStory: 'The keepsakes Daiki captured with his smartphone: スマホで写真をたくさん撮りました.',
        mechanicsExplanation: '写 (copy/reflect) + 真 (truth/reality), capturing reality on film.',
        exampleSentence: {
          japanese: '友達と写真を撮りました。',
          furigana: '友達[ともだち]と 写真[しゃしん]を 撮[と]りました。',
          english: 'I took photos with my friend.'
        },
        jlptLevel: 'N5',
        pitchPattern: 'heiban'
      }
    ],
    questions: [
      {
        id: 'story_n5_04_q01',
        type: 'vocabulary',
        question: 'What does the compound 「散歩」 (さんぽ) mean?',
        questionFurigana: '「散歩[さんぽ]」の 意味[いみ]は 何[なん]ですか？',
        options: ['Jogging a marathon', 'A leisurely walk / stroll', 'Riding a bicycle', 'Taking the subway'],
        correctAnswer: 1,
        explanation: '散歩 (さんぽ) means a leisurely walk or stroll for enjoyment.',
        wrongExplanations: {
          0: 'Marathon running is マラソン. 散歩 is a relaxed, gentle stroll.',
          1: 'Correct! 散歩 (さんぽ) means a leisurely walk or stroll for enjoyment.',
          2: 'Riding a bicycle is 自転車に乗る.',
          3: 'Subway is 地下鉄 (ちかてつ).'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n5_04_q02',
        type: 'kanji',
        question: 'What is the reading of 「写真」 in 「スマホで写真を撮りました」?',
        questionFurigana: '「写真[しゃしん]」の 正[ただ]しい 読[よ]み方[かた]は どれですか？',
        options: ['しゃしん', 'えいが', 'てがみ', 'きんじょ'],
        correctAnswer: 0,
        explanation: '写真 is read しゃしん, meaning photograph.',
        wrongExplanations: {
          0: 'Correct! 写真 is read しゃしん, meaning photograph.',
          1: 'えいが is 映画 (movie).',
          2: 'てがみ is 手紙 (letter).',
          3: 'きんじょ is 近所 (neighborhood).'
        },
        referencedSentenceIndex: 7,
      },
      {
        id: 'story_n5_04_q03',
        type: 'grammar',
        question: 'In the phrase 「景色を見ながら、お茶を飲みました」, what does 「〜ながら」 mean?',
        questionFurigana: '「景色[けしき]を 見[み]ながら、お茶[ちゃ]を 飲[の]みました」の「〜ながら」の 意味[いみ]は？',
        options: [
          'Before doing the action',
          'After finishing the action',
          'While doing another action simultaneously',
          'Because the action was fun'
        ],
        correctAnswer: 2,
        explanation: '〜ながら indicates two actions happening simultaneously by the same subject ("while viewing the scenery, drank tea").',
        wrongExplanations: {
          0: '"Before" is 〜前に (mae ni).',
          1: '"After" is 〜た後で (ato de).',
          2: 'Correct! 〜ながら indicates two actions happening simultaneously by the same subject ("while viewing the scenery, drank tea").',
          3: '"Because" is 〜から or 〜ので.'
        },
        referencedSentenceIndex: 6,
      },
      {
        id: 'story_n5_04_q04',
        type: 'particle',
        question: 'Which particle correctly marks the purpose of movement in 「公園へ散歩_____行きました」?',
        questionFurigana: '「公園[こうえん]へ 散歩[さんぽ]_____ 行[い]きました」に 入[はい]る 助詞[じょし]は？',
        options: ['を', 'に', 'で', 'と'],
        correctAnswer: 1,
        explanation: '[Activity / Verb stem] + に + 行く expresses purpose of movement (散歩に行きました = went for a walk).',
        wrongExplanations: {
          0: '「を」 marks direct objects, but purpose of motion requires 「に」.',
          1: 'Correct! [Activity / Verb stem] + に + 行く expresses purpose of movement (散歩に行きました = went for a walk).',
          2: '「で」 marks location or instrument.',
          3: '「と」 marks companion ("with someone").'
        },
        referencedSentenceIndex: 1,
      },
      {
        id: 'story_n5_04_q05',
        type: 'comprehension',
        question: 'What was the weather like during Daiki\'s walk in the park?',
        questionFurigana: 'ダイキさんの 散歩[さんぽ]の時[とき]、天気[てんき]は どうでしたか？',
        options: [
          'Typhoon with heavy wind',
          'Pleasant and clear sunny weather',
          'Freezing snowstorm',
          'Heavy pouring rain'
        ],
        correctAnswer: 1,
        explanation: 'Sentence 1 states: 「とてもいい天気でした。」 (It was very pleasant weather).',
        wrongExplanations: {
          0: 'There was no typhoon or harsh wind.',
          1: 'Correct! Sentence 1 states: 「とてもいい天気でした。」 (It was very pleasant weather).',
          2: 'It was a sunny spring day, not a snowstorm.',
          3: 'It did not rain at all in this story.'
        },
        referencedSentenceIndex: 0,
      },
    ]
  }
};

// Now let's inject into n5_stories.js
let n5File = fs.readFileSync('src/data/reading/n5_stories.js', 'utf8');

// Update estimatedMinutes to 10
n5File = n5File.replace(/estimatedMinutes:\s*\d+/g, 'estimatedMinutes: 10');

// Inject for story 1, 2, 3, 4
for (const [storyId, data] of Object.entries(ENRICHMENTS)) {
  const storyRegex = new RegExp(`id:\\s*'${storyId}'[\\s\\S]*?(?=id:\\s*'story_n5_|export\\s|$)`);
  const match = n5File.match(storyRegex);
  if (!match) {
    console.warn('Could not find story block for', storyId);
    continue;
  }
  let block = match[0];
  
  // Replace or insert learningElements
  const elementsCode = '    learningElements: ' + JSON.stringify(data.learningElements, null, 6) + ',\n';
  if (block.includes('learningElements:')) {
    block = block.replace(/learningElements:\s*\[[\s\S]*?\],\n/, elementsCode);
  } else {
    block = block.replace(/vocabulary:\s*\[/, elementsCode + '    vocabulary: [');
  }

  // Replace questions
  const questionsCode = '    questions: ' + JSON.stringify(data.questions, null, 6) + ',\n  }';
  block = block.replace(/questions:\s*\[[\s\S]*?\],\s*\}\s*,?/, questionsCode);

  n5File = n5File.replace(match[0], block);
  console.log('Enriched', storyId);
}

fs.writeFileSync('src/data/reading/n5_stories.js', n5File, 'utf8');
console.log('Successfully enriched n5_stories.js');
