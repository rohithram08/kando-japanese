const fs = require('fs');

console.log('Enriching N4 stories...');

const N4_ENRICHMENTS = {
  story_n4_01: {
    learningElements: [
      {
        id: 'el_n4_01_01',
        type: 'vocabulary',
        text: '新幹線',
        surface: '新幹線',
        reading: 'しんかんせん',
        meaning: 'bullet train / high-speed rail',
        roleInStory: 'The high-speed bullet train Maya takes on her solo journey from Tokyo to Kyoto.',
        mechanicsExplanation: 'Compound noun of 新 (new) + 幹 (trunk/main line) + 線 (railway track). Japan\'s premier high-speed rail network.',
        exampleSentence: {
          japanese: '東京から京都まで新幹線で二時間半かかります。',
          furigana: '東京[とうきょう]から 京都[きょうと]まで 新幹線[しんかんせん]で 二時間半[にじかんはん] かかります。',
          english: 'It takes two and a half hours from Tokyo to Kyoto by bullet train.'
        },
        jlptLevel: 'N4',
        pitchPattern: 'heiban'
      },
      {
        id: 'el_n4_01_02',
        type: 'grammar',
        text: '〜た時',
        surface: '着いた時',
        reading: 'tsuita toki',
        meaning: 'when / at the time when [action completed]',
        roleInStory: 'Pins the exact moment Maya stepped into Kyoto Station and felt overwhelmed by the crowd.',
        mechanicsExplanation: 'Past plain verb (た-form) + 時 (toki). Specifies a completed event that sets the timeframe or condition for the main clause.',
        exampleSentence: {
          japanese: '日本に着いた時、桜が満開でした。',
          furigana: '日本[にほん]に 着[つ]いた 時[とき]、桜[さくら]が 満開[まんかい]でした。',
          english: 'When I arrived in Japan, the cherry blossoms were in full bloom.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_01_03',
        type: 'particle',
        text: 'に',
        surface: 'に',
        reading: 'ni',
        meaning: 'target of contact & boarding / destination',
        roleInStory: 'Marks boarding the bullet train (新幹線に乗って) and destination of arrival (京都駅に着いた).',
        mechanicsExplanation: 'With transport verbs like 乗る (to board), the vehicle is always marked with に (not を).',
        exampleSentence: {
          japanese: '毎朝八時のバスに乗ります。',
          furigana: '毎朝[まいあさ] 八時[はちじ]の バスに 乗[の]ります。',
          english: 'I board the 8 o\'clock bus every morning.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_01_04',
        type: 'grammar',
        text: '〜ていただけませんか',
        surface: '教えていただけませんか',
        reading: 'oshiete itadakemasen ka',
        meaning: 'could you please be so kind as to teach/tell me?',
        roleInStory: 'Polite request Maya addresses to the station attendant to ask for directions to Kiyomizu-dera.',
        mechanicsExplanation: 'Verb て-form + いただけませんか (potential negative question of humble いただく). One of the standard polite forms for asking favors from staff or superiors.',
        exampleSentence: {
          japanese: '駅への行き方を教えていただけませんか。',
          furigana: '駅[えき]への 行[い]き方[かた]を 教[おし]えていただけませんか。',
          english: 'Could you please be kind enough to tell me how to get to the station?'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_01_05',
        type: 'grammar',
        text: '〜てくれました',
        surface: '案内してくれました',
        reading: 'annai shite kuremashita',
        meaning: 'did [a favor] for me / kindly showed me',
        roleInStory: 'Highlights the station attendant\'s kindness in guiding Maya to her bus stop.',
        mechanicsExplanation: 'Verb て-form + くれる indicates an action done voluntarily by someone else for the benefit of the speaker.',
        exampleSentence: {
          japanese: '親切な人が道案内をしてくれました。',
          furigana: '親切[しんせつ]な 人[ひと]が 道案内[みちあんない]を してくれました。',
          english: 'A kind stranger kindly guided me along the way.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_01_06',
        type: 'kanji',
        text: '旅',
        surface: '旅',
        reading: 'リョ / たび',
        meaning: 'trip / journey / travel',
        roleInStory: 'The central theme of the story, seen in 一人旅 (solo trip) and 旅行 (travel).',
        mechanicsExplanation: 'Kanji composed of the 方 (direction) radical and elements depicting travelers walking beneath a banner.',
        exampleSentence: {
          japanese: '春休みに一人で旅に出ました。',
          furigana: '春休み[はるやすみ]に 一人[ひとり]で 旅[たび]に 出[で]ました。',
          english: 'During spring vacation, I set out on a solo journey.'
        },
        jlptLevel: 'N4'
      }
    ],
    questions: [
      {
        id: 'story_n4_01_q01',
        type: 'vocabulary',
        question: 'What does the word 「新幹線」 (shinkansen) mean in this story?',
        questionFurigana: 'この 物語[ものがたり]で「新幹線[しんかんせん]」は どういう 意味[いみ]ですか？',
        options: [
          'High-speed bullet train',
          'Local subway line',
          'Overnight long-distance bus',
          'Scenic ferry boat'
        ],
        correctAnswer: 0,
        explanation: '新幹線 refers to Japan\'s famous high-speed bullet train system connecting major cities like Tokyo and Kyoto.',
        wrongExplanations: {
          0: 'Correct! 新幹線 refers to Japan\'s high-speed bullet train network.',
          1: 'A local subway is 地下鉄 (chikatetsu).',
          2: 'An overnight bus is 夜行バス (yakou basu).',
          3: 'A ferry boat is フェリー (ferii).'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n4_01_q02',
        type: 'kanji',
        question: 'How is the compound 「一人旅」 in the story title pronounced?',
        questionFurigana: '題名[だいめい]の「一人旅[ひとりたび]」の 読[よ]み方[かた]は どれですか？',
        options: [
          'ひとりたび',
          'いちにんりょ',
          'いちにんたび',
          'ひとりりょ'
        ],
        correctAnswer: 0,
        explanation: '一人 has the irregular kun-yomi reading ひとり, and 旅 is read たび (solo journey).',
        wrongExplanations: {
          0: 'Correct! 一人 (ひとり) + 旅 (たび) is read ひとりたび.',
          1: 'いちにん is not used for a person traveling alone.',
          2: 'いちにん is incorrect reading here.',
          3: 'りょ is the on-yomi of 旅 (as in 旅行 ryokou), but here it takes kun-yomi たび.'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n4_01_q03',
        type: 'grammar',
        question: 'Why did Maya say 「教えていただけませんか」 to the station attendant?',
        questionFurigana: 'マヤさんは なぜ 駅員[えきいん]に「教[おし]えていただけませんか」と 言[い]いましたか？',
        options: [
          'To make a very polite request to staff for directions',
          'To give an order demanding immediate service',
          'Because she was speaking to an intimate childhood friend',
          'To decline the attendant\'s offer of assistance'
        ],
        correctAnswer: 0,
        explanation: '〜ていただけませんか is a humble, highly polite request form appropriate when asking staff or strangers for a favor.',
        wrongExplanations: {
          0: 'Correct! 〜ていただけませんか is a standard polite request asking someone to kindly do an action.',
          1: 'It is not a command; an order would be 教えてください or 教言え.',
          2: 'Speaking to a close friend would use casual form 教えてくれる？, not いただけませんか.',
          3: 'It is asking for help, not declining it.'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n4_01_q04',
        type: 'particle',
        question: 'Which particle correctly marks the vehicle being boarded in 「新幹線_____乗って京都へ行きました」?',
        questionFurigana: '「新幹線[しんかんせん]_____ 乗[の]って 京都[きょうと]へ 行[い]きました」の 空欄[くうらん]に 入[はい]る 助詞[じょし]は？',
        options: ['に', 'を', 'で', 'から'],
        correctAnswer: 0,
        explanation: 'Vehicles that you board or ride in Japanese take the particle に before the verb 乗る (e.g. 新幹線に乗る).',
        wrongExplanations: {
          0: 'Correct! Transport vehicles take particle 「に」 with the verb 乗る (noru).',
          1: '「を」 is used for getting off (電車を降りる) or traveling through a space (道を歩く), not boarding.',
          2: '「で」 indicates means of movement (新幹線で行く), but with the specific verb 乗る, particle 「に」 is required.',
          3: '「から」 means "from", indicating starting point.'
        },
        referencedSentenceIndex: 0,
      },
      {
        id: 'story_n4_01_q05',
        type: 'comprehension',
        question: 'Why was Maya able to catch the right bus to Kiyomizu-dera without getting lost?',
        questionFurigana: 'マヤさんは どうして 迷[まよ]わずに 正[ただ]しい バスに 乗[の]ることが できましたか？',
        options: [
          'A kind station attendant handed her a map and politely explained the bus stop',
          'She hired a personal tour guide at the ticket gate',
          'She gave up on Kiyomizu-dera and stayed near the station hotel',
          'She used an expensive taxi instead of taking public transit'
        ],
        correctAnswer: 0,
        explanation: 'Sentence 7 states: 「親切な説明のおかげで、迷わずに正しいバスに乗ることができました。」 (Thanks to the kind explanation, I was able to board the correct bus without getting lost).',
        wrongExplanations: {
          0: 'Correct! The station attendant handed her a map and politely guided her to the boarding platform.',
          1: 'She did not hire any tour guide.',
          2: 'She did not give up; she successfully went to Kiyomizu-dera.',
          3: 'She took the bus, not a taxi.'
        },
        referencedSentenceIndex: 6,
      },
    ]
  },
  story_n4_02: {
    learningElements: [
      {
        id: 'el_n4_02_01',
        type: 'vocabulary',
        text: 'お菓子',
        surface: 'お菓子',
        reading: 'おかし',
        meaning: 'sweets / confections / snacks',
        roleInStory: 'Li\'s favorite Japanese food type, which inspires Sora to bake handmade cookies as a birthday surprise.',
        mechanicsExplanation: 'Polite honorific prefix お + 菓子 (sweets/pastries). Encompasses traditional wagashi as well as western confectioneries.',
        exampleSentence: {
          japanese: 'お茶を飲みながらおいしいお菓子を食べました。',
          furigana: 'お茶[ちゃ]を 飲[の]みながら おいしい お菓子[かし]を 食[た]べました。',
          english: 'I ate delicious sweets while drinking green tea.'
        },
        jlptLevel: 'N4',
        pitchPattern: 'nakadaka'
      },
      {
        id: 'el_n4_02_02',
        type: 'grammar',
        text: '〜てみる',
        surface: '作ってみる',
        reading: 'tsukutte miru',
        meaning: 'to try doing [to see the result]',
        roleInStory: 'Sora decides to try baking cookies herself for the very first time.',
        mechanicsExplanation: 'Verb て-form + みる (to see). Idiomatically expresses experimenting or testing an action to see what experience or outcome it yields.',
        exampleSentence: {
          japanese: 'この新しいアプリを使ってみました。',
          furigana: 'この 新[あたら]しい アプリを 使[つか]ってみました。',
          english: 'I tried using this new app to see how it works.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_02_03',
        type: 'grammar',
        text: '〜すぎる',
        surface: '焼きすぎる',
        reading: 'yakisugiru',
        meaning: 'to do excessively / overdo [overbake]',
        roleInStory: 'The cooking friend\'s key tip: overbaking causes cookies to turn rock-hard.',
        mechanicsExplanation: 'Verb masu-stem + すぎる. Indicates performing an action past the desirable threshold, usually resulting in negative consequences.',
        exampleSentence: {
          japanese: '昨夜テレビを見すぎて目が痛いです。',
          furigana: '昨夜[ゆうべ] テレビを 見[み]すぎて 目[め]が 痛[いた]いです。',
          english: 'I watched too much television last night, and my eyes hurt.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_02_04',
        type: 'particle',
        text: 'が',
        surface: 'が',
        reading: 'ga',
        meaning: 'object marker for likes/dislikes & abilities',
        roleInStory: 'Marks Li\'s affection for Japanese sweets (お菓子が好き) and the friend\'s cooking talent (料理が得意).',
        mechanicsExplanation: 'In Japanese, predicates expressing preference (好き/嫌い), skill (上手/得意), or desire (〜たい) mark the target object with が rather than を.',
        exampleSentence: {
          japanese: '私は和食が好きです。',
          furigana: '私[わたし]は 和食[わしょく]が 好[す]きです。',
          english: 'I like traditional Japanese food.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_02_05',
        type: 'grammar',
        text: '〜てあげる',
        surface: 'あげたい',
        reading: 'agetai',
        meaning: 'want to do / give [a favor] to another person',
        roleInStory: 'Expresses Sora\'s warm desire to give something meaningful to her roommate Li.',
        mechanicsExplanation: 'Verb て-form + あげる expresses giving or performing an action for someone else. Combined with 〜たい to express desire.',
        exampleSentence: {
          japanese: '友達に手作りのケーキを作ってあげたいです。',
          furigana: '友達[ともだち]に 手作[てづく]りの ケーキを 作[つく]ってあげたいです。',
          english: 'I want to bake a homemade cake for my friend.'
        },
        jlptLevel: 'N4'
      },
      {
        id: 'el_n4_02_06',
        type: 'kanji',
        text: '特',
        surface: '特',
        reading: 'トク',
        meaning: 'special / exceptional',
        roleInStory: 'Appears in 特別 (とくべつ - special), describing the thoughtful handmade gift.',
        mechanicsExplanation: 'Radical 牛 (cow) + 寺 (temple/measure). Originally denoted a choice sacrificial animal, developing the meaning of "special" or "particular".',
        exampleSentence: {
          japanese: '今日は特別な記念日です。',
          furigana: '今日[きょう]は 特別[とくべつ]な 記念日[きねんび]です。',
          english: 'Today is a special anniversary.'
        },
        jlptLevel: 'N4'
      }
    ],
    questions: [
      {
        id: 'story_n4_02_q01',
        type: 'vocabulary',
        question: 'What is the meaning of 「お菓子」 (okashi) in the story?',
        questionFurigana: 'この 物語[ものがたり]で「お菓子[かし]」の 意味[いみ]は 何[なん]ですか？',
        options: [
          'Sweets / Confections / Pastries',
          'A cup of green tea',
          'Savory dinner meal',
          'Handmade stationery box'
        ],
        correctAnswer: 0,
        explanation: 'お菓子 means sweets, confections, or baked desserts.',
        wrongExplanations: {
          0: 'Correct! お菓子 means sweets, snacks, or confectioneries.',
          1: 'Green tea is お茶 (ocha).',
          2: 'A savory dinner meal is 晩ご飯 (bangohan).',
          3: 'A stationery box is 文房具箱 or 箱 (hako).'
        },
        referencedSentenceIndex: 2,
      },
      {
        id: 'story_n4_02_q02',
        type: 'kanji',
        question: 'What is the correct reading of the kanji compound 「特別」 in 「特別なプレゼント」?',
        questionFurigana: '「特別[とくべつ]な プレゼント」の「特別」の 読[よ]み方[かた]は？',
        options: [
          'とくべつ',
          'とくべい',
          'とくしゅ',
          'べつとく'
        ],
        correctAnswer: 0,
        explanation: '特 (とく) + 別 (べつ) forms とくべつ, meaning special.',
        wrongExplanations: {
          0: 'Correct! 特 (toku) + 別 (betsu) = とくべつ.',
          1: 'とくべい is an incorrect reading.',
          2: 'とくしゅ is 特殊 (unique/specialized), a different word.',
          3: 'The kanji order cannot be inverted.'
        },
        referencedSentenceIndex: 1,
      },
      {
        id: 'story_n4_02_q03',
        type: 'grammar',
        question: 'In 「焼きすぎると固くなる」, what nuance does the auxiliary verb 「〜すぎる」 convey?',
        questionFurigana: '「焼[や]きすぎると 固[かた]くなる」の「〜すぎる」は どんな 意味[いみ]ですか？',
        options: [
          'Doing an action excessively beyond the ideal amount (overbaking)',
          'Doing an action gently and lightly',
          'Planning to do an action tomorrow',
          'Inviting someone else to do the action together'
        ],
        correctAnswer: 0,
        explanation: '〜すぎる attached to a verb stem indicates doing something excessively or to an extreme degree.',
        wrongExplanations: {
          0: 'Correct! 焼きすぎる means to bake excessively / overbake, which makes the cookies turn hard.',
          1: 'Doing gently would be 少しだけ焼く.',
          2: 'Future planning would be 焼くつもり.',
          3: 'An invitation would be 焼きましょう.'
        },
        referencedSentenceIndex: 4,
      },
      {
        id: 'story_n4_02_q04',
        type: 'particle',
        question: 'Which particle correctly marks the object of preference in 「李さんは日本のお菓子_____好きです」?',
        questionFurigana: '「李[り]さんは 日本[にほん]の お菓子[かし]_____ 好[す]きです」の 空欄[くうらん]に 入[はい]る 助詞[じょし]は？',
        options: ['が', 'を', 'に', 'で'],
        correctAnswer: 0,
        explanation: 'In Japanese, the target of adjectives expressing preference like 好き (suki) is marked by が.',
        wrongExplanations: {
          0: 'Correct! Adjectives of liking (好き/嫌い) require the particle 「が」 to mark the target of affection.',
          1: '「を」 is used with transitive action verbs, not with na-adjectives like 好き.',
          2: '「に」 indicates direction, time, or target of motion.',
          3: '「で」 indicates location or means of action.'
        },
        referencedSentenceIndex: 2,
      },
      {
        id: 'story_n4_02_q05',
        type: 'comprehension',
        question: 'How did Li react when Sora gave her the finished cookies and note?',
        questionFurigana: 'プレゼントを もらった 李[り]さんは どう 反応[はんのう]しましたか？',
        options: [
          'She smiled happily and rejoiced, saying "These are so delicious!"',
          'She asked Sora why she didn\'t buy chocolate cake instead',
          'She put the box away without opening it',
          'She left the apartment without saying anything'
        ],
        correctAnswer: 0,
        explanation: 'Sentence 8 states: 「李さんは『とてもおいしい！』と笑顔で喜んでくれました。」 (Li happily rejoiced with a smile, saying "These are so delicious!").',
        wrongExplanations: {
          0: 'Correct! Li rejoiced with a smile and praised how delicious the cookies were.',
          1: 'She was delighted with the matcha cookies and did not ask for chocolate cake.',
          2: 'She ate the cookies immediately and loved them.',
          3: 'She stayed and expressed her gratitude with a big smile.'
        },
        referencedSentenceIndex: 7,
      },
    ]
  }
};

let n4File = fs.readFileSync('src/data/reading/n4_stories.js', 'utf8');

// Update estimatedMinutes to 10
n4File = n4File.replace(/estimatedMinutes:\s*\d+/g, 'estimatedMinutes: 10');

for (const [storyId, data] of Object.entries(N4_ENRICHMENTS)) {
  const storyRegex = new RegExp(`id:\\s*'${storyId}'[\\s\\S]*?(?=id:\\s*'story_n4_|export\\s|$)`);
  const match = n4File.match(storyRegex);
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

  n4File = n4File.replace(match[0], block);
  console.log('Enriched', storyId);
}

fs.writeFileSync('src/data/reading/n4_stories.js', n4File, 'utf8');
console.log('Successfully enriched n4_stories.js');
