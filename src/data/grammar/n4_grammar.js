// data/grammar/n4_grammar.js
export const N4_GRAMMAR = [
  {
    id: "n4_g001",
    pattern: "〜てあげる／てくれる／てもらう",
    structure: "Verb て-form + あげる／くれる／もらう",
    meaning_en: "Giving/receiving actions (I do for you / you do for me / I receive the favor of)",
    meaning_ta: "தரும்/பெறும் செயல்கள்",
    meaning_hi: "देने/प्राप्त करने की क्रियाएँ",
    explanation_en: "あげる: I/someone gives action TO another. くれる: someone gives action TO me. もらう: I receive the action FROM someone.",
    examples: [
      { jp: "荷物を持ってあげました。", reading: "にもつをもってあげました。", en: "I carried the luggage (for them).", ta: "நான் சாமான்களை தூக்கி கொடுத்தேன்.", hi: "मैंने सामान उठाकर दिया।" },
      { jp: "先生が教えてくれました。", reading: "せんせいがおしえてくれました。", en: "The teacher taught me.", ta: "ஆசிரியர் எனக்கு கற்றுக்கொடுத்தார்.", hi: "शिक्षक ने मुझे पढ़ाया।" },
      { jp: "友達に手伝ってもらいました。", reading: "ともだちにてつだってもらいました。", en: "I had my friend help me.", ta: "நண்பரிடமிருந்து உதவி பெற்றேன்.", hi: "दोस्त से मदद ली।" }
    ],
    jlpt_level: "N4",
    lesson_order: 1
  },
  {
    id: "n4_g002",
    pattern: "〜ば〜のに",
    structure: "Verb conditional ば + のに",
    meaning_en: "If only ~ / I wish ~ (expressing regret)",
    meaning_ta: "~ ஆனால் நன்றாக இருந்திருக்கும் (வருத்தம்)",
    meaning_hi: "काश ~ / यदि ~ होता (पछतावा व्यक्त करना)",
    examples: [
      { jp: "もっと勉強すればよかったのに。", reading: "もっとべんきょうすればよかったのに。", en: "I wish I had studied more.", ta: "இன்னும் அதிகமாக படித்திருந்தால் நல்லது.", hi: "काश मैंने और पढ़ा होता।" }
    ],
    jlpt_level: "N4",
    lesson_order: 2
  },
  {
    id: "n4_g003",
    pattern: "〜そうです（様態）",
    structure: "Verb/Adj stem + そうです",
    meaning_en: "Looks like ~ / seems ~ (appearance-based conjecture)",
    meaning_ta: "~ போல் தெரிகிறது (தோற்றத்தை அடிப்படையாக கொண்ட அனுமானம்)",
    meaning_hi: "~ लगता है (दिखावट पर आधारित अनुमान)",
    explanation_en: "Used when you can visually observe that something seems a certain way. Different from the hearsay そうです.",
    examples: [
      { jp: "このケーキは美味しそうです。", reading: "このケーキはおいしそうです。", en: "This cake looks delicious.", ta: "இந்த கேக் சுவையாக தெரிகிறது.", hi: "यह केक स्वादिष्ट लग रहा है।" },
      { jp: "雨が降りそうです。", reading: "あめがふりそうです。", en: "It looks like it will rain.", ta: "மழை பெய்யும் போல் தெரிகிறது.", hi: "बारिश होने वाली लग रही है।" }
    ],
    jlpt_level: "N4",
    lesson_order: 3
  },
  {
    id: "n4_g004",
    pattern: "〜らしい",
    structure: "Verb/Noun/Adj plain form + らしい",
    meaning_en: "Apparently ~ / It seems ~ (hearsay/inference from evidence)",
    meaning_ta: "~ போல் தெரிகிறது (கேட்டதை அல்லது ஆதாரத்தை அடிப்படையாக கொண்டு)",
    meaning_hi: "शायद ~ / सुना है कि ~ (सुनी बात या साक्ष्य से अनुमान)",
    examples: [
      { jp: "田中さんは来ないらしいです。", reading: "たなかさんはこないらしいです。", en: "It seems Tanaka is not coming.", ta: "தனாகா வர மாட்டார் என்று தெரிகிறது.", hi: "लगता है तनाका नहीं आएंगे।" }
    ],
    jlpt_level: "N4",
    lesson_order: 4
  },
  {
    id: "n4_g005",
    pattern: "〜ようだ",
    structure: "Verb/Adj plain form + ようだ",
    meaning_en: "It appears that ~ (inference based on observation)",
    meaning_ta: "~ போல் தோன்றுகிறது (கவனிப்பை அடிப்படையாக கொண்ட அனுமானம்)",
    meaning_hi: "ऐसा लगता है कि ~ (अवलोकन पर आधारित अनुमान)",
    examples: [
      { jp: "彼は疲れているようです。", reading: "かれはつかれているようです。", en: "He appears to be tired.", ta: "அவர் சோர்வாக இருப்பதாக தெரிகிறது.", hi: "वह थका हुआ लग रहा है।" }
    ],
    jlpt_level: "N4",
    lesson_order: 5
  },
  {
    id: "n4_g006",
    pattern: "〜でしょう／だろう",
    structure: "Sentence + でしょう (polite) / だろう (plain)",
    meaning_en: "Probably ~ / I wonder if ~ (conjecture/uncertainty)",
    meaning_ta: "~ ஆகும் என்று நம்புகிறேன் (சந்தேகம்/ஊகம்)",
    meaning_hi: "शायद ~ / ~ होगा (अनुमान/अनिश्चितता)",
    examples: [
      { jp: "明日は雨でしょう。", reading: "あしたはあめでしょう。", en: "It will probably rain tomorrow.", ta: "நாளை மழை பெய்யும் என்று நம்புகிறேன்.", hi: "कल शायद बारिश होगी।" },
      { jp: "彼は来るだろう。", reading: "かれはくるだろう。", en: "He will probably come.", ta: "அவர் வருவார் என்று நினைக்கிறேன்.", hi: "वह आएगा शायद।" }
    ],
    jlpt_level: "N4",
    lesson_order: 6
  },
  {
    id: "n4_g007",
    pattern: "〜かもしれない",
    structure: "Plain form + かもしれない／かもしれません",
    meaning_en: "Maybe ~ / might ~ (possibility, less certain than でしょう)",
    meaning_ta: "~ ஆகலாம் (சாத்தியம், でしょう ஐ விட குறைந்த நிச்சயம்)",
    meaning_hi: "शायद ~ / हो सकता है ~ (संभावना, でしょう से कम निश्चित)",
    examples: [
            { jp: "明日は雪かもしれません。", reading: "あしたはゆきかもしれません。", en: "It might snow tomorrow.", ta: "நாளை பனி பெய்யலாம்.", hi: "कल बर्फ पड़ सकती है।" },
      { jp: "彼女は知らないかもしれない。", reading: "かのじょはしらないかもしれない。", en: "She might not know.", ta: "அவளுக்கு தெரியாமல் இருக்கலாம்.", hi: "उसे पता नहीं हो सकता।" }
    ],
    jlpt_level: "N4",
    lesson_order: 7
  },
  {
    id: "n4_g008",
    pattern: "〜なければならない",
    structure: "Verb negative stem + なければならない",
    meaning_en: "Must do ~ / have to do ~",
    meaning_ta: "~ செய்யவேண்டும் (கட்டாயம்)",
    meaning_hi: "~ करना ज़रूरी है / ~ करना पड़ेगा",
    explanation_en: "Expresses obligation or necessity. Casual forms: なきゃ、なくちゃ. Negative: なくてもいい (don't have to).",
    examples: [
      { jp: "毎日薬を飲まなければなりません。", reading: "まいにちくすりをのまなければなりません。", en: "I must take medicine every day.", ta: "ஒவ்வொரு நாளும் மருந்து சாப்பிட வேண்டும்.", hi: "हर दिन दवाई लेनी होगी।" },
      { jp: "早く起きなきゃ。", reading: "はやくおきなきゃ。", en: "I have to wake up early. (casual)", ta: "சீக்கிரம் எழுந்திரிக்கணும்.", hi: "जल्दी उठना होगा।" }
    ],
    jlpt_level: "N4",
    lesson_order: 8
  },
  {
    id: "n4_g009",
    pattern: "〜てもいい",
    structure: "Verb て-form + もいい／もいいです",
    meaning_en: "It's okay to ~ / May I ~ (permission)",
    meaning_ta: "~ செய்தாலும் பரவாயில்லை (அனுமதி)",
    meaning_hi: "~ करना ठीक है / ~ कर सकते हैं (अनुमति)",
    examples: [
      { jp: "ここに座ってもいいですか。", reading: "ここにすわってもいいですか。", en: "May I sit here?", ta: "இங்கே உட்காரலாமா?", hi: "क्या मैं यहाँ बैठ सकता हूँ?" },
      { jp: "写真を撮ってもいいです。", reading: "しゃしんをとってもいいです。", en: "You may take photos.", ta: "புகைப்படம் எடுக்கலாம்.", hi: "आप फोटो ले सकते हैं।" }
    ],
    jlpt_level: "N4",
    lesson_order: 9
  },
  {
    id: "n4_g010",
    pattern: "〜てはいけない",
    structure: "Verb て-form + はいけない／はいけません",
    meaning_en: "Must not ~ / Not allowed to ~",
    meaning_ta: "~ செய்யக்கூடாது (தடை)",
    meaning_hi: "~ नहीं करना चाहिए / ~ करना मना है",
    examples: [
      { jp: "ここでタバコを吸ってはいけません。", reading: "ここでタバコをすってはいけません。", en: "You must not smoke here.", ta: "இங்கே புகை பிடிக்கக்கூடாது.", hi: "यहाँ धूम्रपान करना मना है।" },
      { jp: "試験中に話してはいけない。", reading: "しけんちゅうにはなしてはいけない。", en: "Don't talk during the exam.", ta: "தேர்வின் போது பேசக்கூடாது.", hi: "परीक्षा के दौरान बात नहीं करनी चाहिए।" }
    ],
    jlpt_level: "N4",
    lesson_order: 10
  },
  {
    id: "n4_g011",
    pattern: "〜たことがある",
    structure: "Verb た-form + ことがある",
    meaning_en: "Have done ~ before (past experience)",
    meaning_ta: "முன்பு ~ செய்த அனுபவம் உண்டு",
    meaning_hi: "~ किया है (पिछला अनुभव)",
    examples: [
      { jp: "富士山に登ったことがあります。", reading: "ふじさんにのぼったことがあります。", en: "I have climbed Mt. Fuji before.", ta: "நான் முன்பு ஃபுஜி மலையில் ஏறியிருக்கிறேன்.", hi: "मैं माउंट फुजी पर चढ़ चुका हूँ।" },
      { jp: "寿司を食べたことがありますか。", reading: "すしをたべたことがありますか。", en: "Have you ever eaten sushi?", ta: "நீங்கள் சுஷி சாப்பிட்டதுண்டா?", hi: "क्या आपने कभी सुशी खाई है?" }
    ],
    jlpt_level: "N4",
    lesson_order: 11
  },
  {
    id: "n4_g012",
    pattern: "〜ながら",
    structure: "Verb stem + ながら",
    meaning_en: "While doing ~ (two simultaneous actions by same person)",
    meaning_ta: "~ செய்யும் போது (ஒரே நபர் இரண்டு செயல்கள்)",
    meaning_hi: "~ करते हुए (एक ही व्यक्ति द्वारा दो एक साथ काम)",
    examples: [
      { jp: "音楽を聞きながら勉強します。", reading: "おんがくをききながらべんきょうします。", en: "I study while listening to music.", ta: "இசை கேட்டுக்கொண்டே படிக்கிறேன்.", hi: "संगीत सुनते हुए पढ़ता हूँ।" },
      { jp: "歩きながらスマホを見るのは危ない。", reading: "あるきながらスマホをみるのはあぶない。", en: "Looking at your phone while walking is dangerous.", ta: "நடந்துகொண்டே மொபைல் பார்ப்பது ஆபத்தானது.", hi: "चलते हुए फोन देखना खतरनाक है।" }
    ],
    jlpt_level: "N4",
    lesson_order: 12
  },
  {
    id: "n4_g013",
    pattern: "〜と思う",
    structure: "Plain form + と思う／と思います",
    meaning_en: "I think that ~ (expressing opinion)",
    meaning_ta: "~ என்று நினைக்கிறேன் (கருத்து வெளிப்படுத்துதல்)",
    meaning_hi: "मुझे लगता है ~ / मैं सोचता हूँ ~ (राय व्यक्त करना)",
    examples: [
      { jp: "彼は正しいと思います。", reading: "かれはただしいとおもいます。", en: "I think he is right.", ta: "அவர் சரியாக சொல்கிறார் என்று நினைக்கிறேன்.", hi: "मुझे लगता है वह सही है।" },
      { jp: "明日は晴れると思う。", reading: "あしたははれるとおもう。", en: "I think it will be sunny tomorrow.", ta: "நாளை சூரிய ஒளி இருக்கும் என்று நினைக்கிறேன்.", hi: "मुझे लगता है कल धूप होगी।" }
    ],
    jlpt_level: "N4",
    lesson_order: 13
  },
  {
    id: "n4_g014",
    pattern: "〜ために",
    structure: "Verb dictionary form / Noun の + ために",
    meaning_en: "In order to ~ / for the purpose of ~",
    meaning_ta: "~ செய்வதற்காக (நோக்கம்)",
    meaning_hi: "~ करने के लिए / ~ के उद्देश्य से",
    examples: [
      { jp: "日本語を学ぶために日本に来ました。", reading: "にほんごをまなぶためににほんにきました。", en: "I came to Japan in order to learn Japanese.", ta: "ஜப்பானிய மொழி கற்க ஜப்பான் வந்தேன்.", hi: "जापानी सीखने के लिए जापान आया।" },
      { jp: "健康のために運動します。", reading: "けんこうのためにうんどうします。", en: "I exercise for my health.", ta: "ஆரோக்கியத்திற்காக உடற்பயிற்சி செய்கிறேன்.", hi: "स्वास्थ्य के लिए व्यायाम करता हूँ।" }
    ],
    jlpt_level: "N4",
    lesson_order: 14
  },
  {
    id: "n4_g015",
    pattern: "〜ように",
    structure: "Verb dictionary/negative + ように",
    meaning_en: "So that ~ / in order to ~ (goal/purpose for intransitive verbs)",
    meaning_ta: "~ ஆகும் வகையில் (இலக்கு/நோக்கம்)",
    meaning_hi: "ताकि ~ / ~ हो सके (लक्ष्य/उद्देश्य)",
    examples: [
      { jp: "日本語が上手になるように毎日練習します。", reading: "にほんごがじょうずになるようにまいにちれんしゅうします。", en: "I practice every day so that my Japanese improves.", ta: "ஜப்பானிய மொழி மேம்பட ஒவ்வொரு நாளும் பயிற்சி செய்கிறேன்.", hi: "जापानी बेहतर हो इसलिए रोज़ अभ्यास करता हूँ।" },
      { jp: "遅刻しないように早く出ました。", reading: "ちこくしないようにはやくでました。", en: "I left early so as not to be late.", ta: "தாமதமாகாமல் இருக்க சீக்கிரம் கிளம்பினேன்.", hi: "देर न हो इसलिए जल्दी निकला।" }
    ],
    jlpt_level: "N4",
    lesson_order: 15
  }
  // ... Full 120 N4 grammar points continue with:
  // n4_g016-030: Causative, passive, causative-passive forms
  // n4_g031-045: Conditional forms (たら、ば、なら、と)
  // n4_g046-060: Nominalizing forms (こと、の)
  // n4_g061-075: て-form extensions (てしまう、ておく、てみる、てある)
  // n4_g076-090: Degree expressions (ほど、くらい、だけ)
  // n4_g091-105: Complex particles (によって、として、に対して)
  // n4_g106-120: Advanced conjunctions and sentence patterns
];