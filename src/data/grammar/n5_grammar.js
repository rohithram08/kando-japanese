// data/grammar/n5_grammar.js
export const N5_GRAMMAR = [
  {
    id: "n5_g001",
    pattern: "〜は〜です",
    structure: "Noun は Noun/Adjective です",
    meaning_en: "Topic marker + copula (is/am/are)",
    meaning_ta: "தலைப்பு குறிப்பான் + பொருள் (ஆகும்/இருக்கிறது)",
    meaning_hi: "विषय मार्कर + क्रिया (है/हूँ/हैं)",
    explanation_en: "Used to state facts about the topic. は (wa) marks the topic of the sentence. です (desu) is a polite sentence-ending that means 'is/am/are'.",
    explanation_ta: "தலைப்பைப் பற்றிய உண்மைகளை கூற பயன்படுகிறது. は தலைப்பை குறிக்கிறது. です மரியாதையான வாக்கிய முடிவு.",
    explanation_hi: "विषय के बारे में तथ्य बताने के लिए उपयोग किया जाता है। は विषय को चिह्नित करता है। です विनम्र वाक्य-अंत है।",
    examples: [
      { jp: "私は学生です。", reading: "わたしはがくせいです。", en: "I am a student.", ta: "நான் ஒரு மாணவர்.", hi: "मैं एक छात्र हूँ।" },
      { jp: "これは本です。", reading: "これはほんです。", en: "This is a book.", ta: "இது ஒரு புத்தகம்.", hi: "यह एक किताब है।" },
      { jp: "田中さんは先生です。", reading: "たなかさんはせんせいです。", en: "Mr. Tanaka is a teacher.", ta: "தனாகா ஆசிரியர்.", hi: "तनाका-सान शिक्षक हैं।" }
    ],
    notes: "Don't confuse は (topic marker, pronounced 'wa') with は (the hiragana character 'ha'). In topic position, always read it as 'wa'.",
    jlpt_level: "N5",
    lesson_order: 1,
    tags: ["copula", "topic-marker", "beginner", "N5"]
  },
  {
    id: "n5_g002",
    pattern: "〜は〜ではありません",
    structure: "Noun は Noun ではありません",
    meaning_en: "Negative form of です (is not)",
    meaning_ta: "です இன் எதிர்மறை வடிவம் (இல்லை)",
    meaning_hi: "です का नकारात्मक रूप (नहीं है)",
    explanation_en: "The negative of 〜です. In casual speech, じゃないです or じゃありません can also be used.",
    explanation_ta: "〜です இன் எதிர்மறை வடிவம். வழக்கு பேச்சில் じゃないです அல்லது じゃありません பயன்படுத்தலாம்.",
    explanation_hi: "〜です का नकारात्मक रूप। बोलचाल में じゃないです या じゃありません भी उपयोग होता है।",
    examples: [
      { jp: "私は先生ではありません。", reading: "わたしはせんせいではありません。", en: "I am not a teacher.", ta: "நான் ஆசிரியர் இல்லை.", hi: "मैं शिक्षक नहीं हूँ।" },
      { jp: "これはペンじゃないです。", reading: "これはペンじゃないです。", en: "This is not a pen.", ta: "இது பேனா இல்லை.", hi: "यह कलम नहीं है।" },
      { jp: "田中さんは学生ではありません。", reading: "たなかさんはがくせいではありません。", en: "Mr. Tanaka is not a student.", ta: "தனாகா மாணவர் இல்லை.", hi: "तनाका-सान छात्र नहीं हैं।" }
    ],
    notes: "じゃありません is slightly less formal than ではありません but both are acceptable in polite speech.",
    jlpt_level: "N5",
    lesson_order: 2,
    tags: ["negative", "copula", "beginner", "N5"]
  },
  {
    id: "n5_g003",
    pattern: "〜が〜です",
    structure: "Noun が Adjective/Verb",
    meaning_en: "Subject marker が — marks the subject performing the action",
    meaning_ta: "உரிமையாளர் குறிப்பான் が — செயலை செய்யும் பொருளை குறிக்கிறது",
    meaning_hi: "कर्ता मार्कर が — क्रिया करने वाले को चिह्नित करता है",
    explanation_en: "が marks the grammatical subject. Unlike は which marks the topic, が focuses on who/what performs the action or has the quality.",
    explanation_ta: "が இலக்கண கர்த்தாவை குறிக்கிறது. は தலைப்பை குறிக்க, が யார்/என்ன செயல் செய்கிறது என்பதை கவனிக்கிறது.",
    explanation_hi: "が व्याकरणिक कर्ता को चिह्नित करता है। は विषय को चिह्नित करता है जबकि が यह बताता है कि क्रिया कौन करता है।",
    examples: [
      { jp: "猫が好きです。", reading: "ねこがすきです。", en: "I like cats. (Cats are what I like.)", ta: "எனக்கு பூனை பிடிக்கும்.", hi: "मुझे बिल्लियाँ पसंद हैं।" },
      { jp: "雨が降っています。", reading: "あめがふっています。", en: "It is raining.", ta: "மழை பெய்கிறது.", hi: "बारिश हो रही है।" },
      { jp: "山田さんが来ました。", reading: "やまださんがきました。", en: "Mr. Yamada came.", ta: "யமாடா வந்தார்.", hi: "यामादा-सान आए।" }
    ],
    notes: "が is used when introducing new information or when emphasising who/what. は is used for known topics.",
    jlpt_level: "N5",
    lesson_order: 3,
    tags: ["subject-marker", "particle", "beginner", "N5"]
  },
  {
    id: "n5_g004",
    pattern: "〜を〜します",
    structure: "Noun を Verb",
    meaning_en: "Object marker を — marks the direct object of a transitive verb",
    meaning_ta: "நேரடி பொருள் குறிப்பான் を",
    meaning_hi: "कर्म मार्कर を — सकर्मक क्रिया का सीधा कर्म",
    explanation_en: "を (pronounced 'o') marks the direct object — the thing that receives the action of a transitive verb.",
    explanation_ta: "を ('o' என உச்சரிக்கப்படும்) நேரடி பொருளை குறிக்கிறது — செயலை பெறும் பொருள்.",
    explanation_hi: "を ('o' उच्चारित) प्रत्यक्ष कर्म को चिह्नित करता है — वह चीज़ जो क्रिया को प्राप्त करती है।",
    examples: [
      { jp: "ご飯を食べます。", reading: "ごはんをたべます。", en: "I eat rice/a meal.", ta: "நான் சோறு சாப்பிடுகிறேன்.", hi: "मैं खाना खाता हूँ।" },
      { jp: "本を読みます。", reading: "ほんをよみます。", en: "I read a book.", ta: "நான் புத்தகம் படிக்கிறேன்.", hi: "मैं किताब पढ़ता हूँ।" },
      { jp: "日本語を勉強します。", reading: "にほんごをべんきょうします。", en: "I study Japanese.", ta: "நான் ஜப்பானிய மொழி படிக்கிறேன்.", hi: "मैं जापानी पढ़ता हूँ।" }
    ],
    notes: "を only appears with transitive verbs (verbs that take a direct object). Intransitive verbs do not use を.",
    jlpt_level: "N5",
    lesson_order: 4,
    tags: ["object-marker", "particle", "beginner", "N5"]
  },
  {
    id: "n5_g005",
    pattern: "〜に〜があります／います",
    structure: "Place に Thing/Person が あります／います",
    meaning_en: "Existence: there is/are (あります for inanimate, います for animate)",
    meaning_ta: "இருப்பு: இருக்கிறது (あります உயிரற்றதற்கு, います உயிருள்ளதற்கு)",
    meaning_hi: "अस्तित्व: है/हैं (あります निर्जीव के लिए, います सजीव के लिए)",
    explanation_en: "Use あります for non-living things and います for living things (people, animals). The location is marked with に.",
    explanation_ta: "உயிரற்ற பொருட்களுக்கு あります, உயிருள்ள உயிரினங்களுக்கு います பயன்படுத்தவும். இடம் に ஆல் குறிக்கப்படுகிறது.",
    explanation_hi: "निर्जीव चीज़ों के लिए あります और सजीव चीज़ों (लोग, जानवर) के लिए います। स्थान に से चिह्नित होता है।",
    examples: [
      { jp: "机の上に本があります。", reading: "つくえのうえにほんがあります。", en: "There is a book on the desk.", ta: "மேசை மேல் புத்தகம் இருக்கிறது.", hi: "मेज पर किताब है।" },
      { jp: "公園に子供がいます。", reading: "こうえんにこどもがいます。", en: "There are children in the park.", ta: "பூங்காவில் குழந்தைகள் இருக்கிறார்கள்.", hi: "पार्क में बच्चे हैं।" },
      { jp: "冷蔵庫にジュースがあります。", reading: "れいぞうこにジュースがあります。", en: "There is juice in the refrigerator.", ta: "குளிர்சாதன பெட்டியில் ஜூஸ் இருக்கிறது.", hi: "फ्रिज में जूस है।" }
    ],
    notes: "Robots and dolls are tricky — some speakers use います for robots since they 'move'. When in doubt, use あります for objects.",
    jlpt_level: "N5",
    lesson_order: 5,
    tags: ["existence", "location", "particle", "N5"]
  },
  {
    id: "n5_g006",
    pattern: "〜で〜します",
    structure: "Place で Verb / Means で Verb",
    meaning_en: "で marks location of action OR means/method",
    meaning_ta: "で செயல் நடக்கும் இடத்தை அல்லது முறையை குறிக்கிறது",
    meaning_hi: "で क्रिया के स्थान या साधन को चिह्नित करता है",
    explanation_en: "で has two key uses: (1) marks where an action takes place, (2) marks the means or tool used to do something.",
    explanation_ta: "で இரண்டு முக்கிய பயன்பாடுகளை கொண்டுள்ளது: (1) செயல் நடக்கும் இடம், (2) செயல் செய்யப்படும் முறை அல்லது கருவி.",
    explanation_hi: "で के दो मुख्य उपयोग हैं: (1) जहाँ क्रिया होती है, (2) क्रिया करने का साधन या उपकरण।",
    examples: [
      { jp: "図書館で勉強します。", reading: "としょかんでべんきょうします。", en: "I study at the library.", ta: "நான் நூலகத்தில் படிக்கிறேன்.", hi: "मैं पुस्तकालय में पढ़ता हूँ।" },
      { jp: "バスで来ました。", reading: "バスできました。", en: "I came by bus.", ta: "நான் பஸ்ஸில் வந்தேன்.", hi: "मैं बस से आया।" },
      { jp: "日本語で話してください。", reading: "にほんごではなしてください。", en: "Please speak in Japanese.", ta: "ஜப்பானிய மொழியில் பேசுங்கள்.", hi: "कृपया जापानी में बोलिए।" }
    ],
    notes: "Don't confuse で (action location) with に (existence location). 図書館にいます = I am at the library. 図書館で勉強します = I study at the library.",
    jlpt_level: "N5",
    lesson_order: 6,
    tags: ["location", "means", "particle", "N5"]
  },
  {
    id: "n5_g007",
    pattern: "〜に行きます／来ます／帰ります",
    structure: "Place に Verb of movement",
    meaning_en: "Direction marker に with movement verbs (go/come/return to)",
    meaning_ta: "இலக்கு குறிப்பான் に இயக்க வினைகளுடன்",
    meaning_hi: "गंतव्य मार्कर に गति क्रियाओं के साथ",
    explanation_en: "に marks the destination with verbs of movement like 行く (go), 来る (come), 帰る (return). The particle へ can also be used interchangeably in most cases.",
    explanation_ta: "に இயக்க வினைகளுடன் இலக்கை குறிக்கிறது: 行く (போ), 来る (வா), 帰る (திரும்பு). へ துணைச்சொல்லை பெரும்பாலும் மாற்றாக பயன்படுத்தலாம்.",
    explanation_hi: "に गति क्रियाओं के साथ गंतव्य को चिह्नित करता है: 行く (जाना), 来る (आना), 帰る (लौटना)। अधिकतर मामलों में へ का भी उपयोग किया जा सकता है।",
    examples: [
      { jp: "学校に行きます。", reading: "がっこうにいきます。", en: "I go to school.", ta: "நான் பள்ளிக்கு போகிறேன்.", hi: "मैं स्कूल जाता हूँ।" },
      { jp: "家に帰ります。", reading: "いえにかえります。", en: "I return home.", ta: "நான் வீட்டுக்கு திரும்புகிறேன்.", hi: "मैं घर लौटता हूँ।" },
      { jp: "日本に来ました。", reading: "にほんにきました。", en: "I came to Japan.", ta: "நான் ஜப்பானுக்கு வந்தேன்.", hi: "मैं जापान आया।" }
    ],
    notes: "に indicates the destination (endpoint). を is used when passing through: 公園を歩きます (walk through the park).",
    jlpt_level: "N5",
    lesson_order: 7,
    tags: ["direction", "movement", "particle", "N5"]
  },
  {
    id: "n5_g008",
    pattern: "〜たいです",
    structure: "Verb stem + たいです",
    meaning_en: "Want to do ~ (expressing desire)",
    meaning_ta: "~ செய்ய விரும்புகிறேன் (ஆசையை வெளிப்படுத்துதல்)",
    meaning_hi: "~ करना चाहता/चाहती हूँ (इच्छा व्यक्त करना)",
    explanation_en: "Attach たい to the verb stem (remove ます from masu-form). The result is treated like an い-adjective. Negative: たくないです. Past: たかったです.",
    explanation_ta: "வினைச் சொல்லின் தண்டிலிருந்து ます நீக்கி たい சேர்க்கவும். இது い-பெயரடையாக நடத்தப்படுகிறது. எதிர்மறை: たくないです. கடந்த காலம்: たかったです.",
    explanation_hi: "क्रिया के स्टेम (ます हटाएँ) में たい जोड़ें। यह い-विशेषण की तरह काम करता है। नकारात्मक: たくないです। भूतकाल: たかったです।",
    examples: [
      { jp: "日本に行きたいです。", reading: "にほんにいきたいです。", en: "I want to go to Japan.", ta: "நான் ஜப்பானுக்கு போக விரும்புகிறேன்.", hi: "मैं जापान जाना चाहता हूँ।" },
      { jp: "寿司を食べたいです。", reading: "すしをたべたいです。", en: "I want to eat sushi.", ta: "நான் சுஷி சாப்பிட விரும்புகிறேன்.", hi: "मैं सुशी खाना चाहता हूँ।" },
      { jp: "日本語を話したいです。", reading: "にほんごをはなしたいです。", en: "I want to speak Japanese.", ta: "நான் ஜப்பானிய மொழி பேச விரும்புகிறேன்.", hi: "मैं जापानी बोलना चाहता हूँ।" }
    ],
    notes: "たい expresses the speaker's own desire. To ask about others' desires, use たいですか or 〜たがっています.",
    jlpt_level: "N5",
    lesson_order: 8,
    tags: ["desire", "want", "auxiliary", "N5"]
  },
  {
    id: "n5_g009",
    pattern: "〜ましょう",
    structure: "Verb stem + ましょう",
    meaning_en: "Let's do ~ (making a suggestion or invitation)",
    meaning_ta: "~ செய்வோம் (பரிந்துரை அல்லது அழைப்பு)",
    meaning_hi: "~ करते हैं (सुझाव या आमंत्रण)",
    explanation_en: "ましょう is the volitional/hortative form. It suggests doing something together. ましょうか is softer: 'Shall we?'",
    explanation_ta: "ましょう சேர்ந்து செய்வதற்கான பரிந்துரை. ましょうか மென்மையான வடிவம்: 'நாம் செய்யலாமா?'",
    explanation_hi: "ましょう साथ में कुछ करने का सुझाव देता है। ましょうか नरम रूप है: 'क्या हम करें?'",
    examples: [
      { jp: "一緒に食べましょう。", reading: "いっしょにたべましょう。", en: "Let's eat together.", ta: "நாம் சேர்ந்து சாப்பிடுவோம்.", hi: "साथ में खाते हैं।" },
      { jp: "映画を見ましょう。", reading: "えいがをみましょう。", en: "Let's watch a movie.", ta: "திரைப்படம் பார்ப்போம்.", hi: "फिल्म देखते हैं।" },
      { jp: "休みましょうか。", reading: "やすみましょうか。", en: "Shall we rest?", ta: "நாம் ஓய்வெடுக்கலாமா?", hi: "क्या हम आराम करें?" }
    ],
    notes: "ましょうか can also be used to offer help: 手伝いましょうか (Shall I help you?)",
    jlpt_level: "N5",
    lesson_order: 9,
    tags: ["volitional", "suggestion", "invitation", "N5"]
  },
  {
    id: "n5_g010",
    pattern: "〜てください",
    structure: "Verb て-form + ください",
    meaning_en: "Please do ~ (polite request)",
    meaning_ta: "~ செய்யுங்கள் (மரியாதையான கோரிக்கை)",
    meaning_hi: "~ कृपया करें (विनम्र अनुरोध)",
    explanation_en: "Form the て-form of the verb and add ください. This is a standard polite way to make requests.",
    explanation_ta: "வினையின் て வடிவத்தை உருவாக்கி ください சேர்க்கவும். இது கோரிக்கைகளை மரியாதையாக வெளிப்படுத்தும் நிலையான வழி.",
    explanation_hi: "क्रिया का て-रूप बनाकर ください जोड़ें। यह विनम्र अनुरोध का मानक तरीका है।",
    examples: [
      { jp: "ここに座ってください。", reading: "ここにすわってください。", en: "Please sit here.", ta: "இங்கே உட்காருங்கள்.", hi: "यहाँ बैठिए।" },
      { jp: "ゆっくり話してください。", reading: "ゆっくりはなしてください。", en: "Please speak slowly.", ta: "மெதுவாக பேசுங்கள்.", hi: "धीरे बोलिए।" },
      { jp: "名前を書いてください。", reading: "なまえをかいてください。", en: "Please write your name.", ta: "உங்கள் பெயரை எழுதுங்கள்.", hi: "अपना नाम लिखिए।" }
    ],
    notes: "For even more polite requests, use 〜ていただけますか. For casual requests, just use て-form alone: 書いて (Write it).",
    jlpt_level: "N5",
    lesson_order: 10,
    tags: ["request", "polite", "te-form", "N5"]
  },
  {
    id: "n5_g011",
    pattern: "〜ている",
    structure: "Verb て-form + いる／います",
    meaning_en: "Currently doing ~ OR state resulting from action",
    meaning_ta: "இப்போது ~ செய்கிறேன் அல்லது செயலின் நிலை",
    meaning_hi: "अभी ~ कर रहा/रही हूँ या क्रिया की स्थिति",
    explanation_en: "Two main uses: (1) ongoing action — I am doing something right now; (2) resultant state — a state that results from a completed action (married, know, wearing).",
    explanation_ta: "இரண்டு முக்கிய பயன்பாடுகள்: (1) நடந்துகொண்டிருக்கும் செயல்; (2) முடிந்த செயலின் நிலை (திருமணமானவர், அறிகிறார், அணிந்திருக்கிறார்).",
    explanation_hi: "दो मुख्य उपयोग: (1) चल रही क्रिया — अभी कर रहा हूँ; (2) परिणामी स्थिति — विवाहित, जानना, पहनना।",
    examples: [
      { jp: "今、本を読んでいます。", reading: "いま、ほんをよんでいます。", en: "I am reading a book now.", ta: "இப்போது புத்தகம் படிக்கிறேன்.", hi: "अभी किताब पढ़ रहा हूँ।" },
      { jp: "田中さんは結婚しています。", reading: "たなかさんはけっこんしています。", en: "Mr. Tanaka is married.", ta: "தனாகா திருமணமாகியிருக்கிறார்.", hi: "तनाका-सान विवाहित हैं।" },
      { jp: "赤いシャツを着ています。", reading: "あかいシャツをきています。", en: "He/She is wearing a red shirt.", ta: "அவர் சிவப்பு சட்டை அணிந்திருக்கிறார்.", hi: "वह लाल शर्ट पहने हुए हैं।" }
    ],
    notes: "知っています (I know) vs 知りません (I don't know). Never say 知っていません — use 知りません for the negative.",
    jlpt_level: "N5",
    lesson_order: 11,
    tags: ["progressive", "state", "te-form", "N5"]
  },
  {
    id: "n5_g012",
    pattern: "〜た形 (Past tense)",
    structure: "Verb た-form",
    meaning_en: "Past tense of verbs",
    meaning_ta: "வினைகளின் கடந்த கால வடிவம்",
    meaning_hi: "क्रियाओं का भूतकाल",
    explanation_en: "The た-form indicates completed actions. For polite speech, use ました. For plain/casual speech, use た directly.",
    explanation_ta: "た வடிவம் முடிந்த செயல்களை குறிக்கிறது. மரியாதையான பேச்சில் ました பயன்படுத்தவும். வழக்கு பேச்சில் た நேரடியாக பயன்படுத்தவும்.",
    explanation_hi: "た-रूप पूर्ण क्रियाओं को दर्शाता है। विनम्र भाषण में ました और सामान्य बोलचाल में た का प्रयोग होता है।",
    examples: [
      { jp: "昨日、映画を見ました。", reading: "きのう、えいがをみました。", en: "Yesterday, I watched a movie.", ta: "நேற்று திரைப்படம் பார்த்தேன்.", hi: "कल मैंने फिल्म देखी।" },
      { jp: "ご飯を食べた。", reading: "ごはんをたべた。", en: "I ate a meal. (casual)", ta: "சோறு சாப்பிட்டேன்.", hi: "खाना खाया।" },
      { jp: "昨日は雨が降りました。", reading: "きのうはあめがふりました。", en: "It rained yesterday.", ta: "நேற்று மழை பெய்தது.", hi: "कल बारिश हुई।" }
    ],
    notes: "The た-form conjugation follows the same sound changes as the て-form. Learning one helps the other.",
    jlpt_level: "N5",
    lesson_order: 12,
    tags: ["past-tense", "conjugation", "N5"]
  },
  {
    id: "n5_g013",
    pattern: "〜ないでください",
    structure: "Verb negative stem + ないでください",
    meaning_en: "Please don't do ~",
    meaning_ta: "~ செய்யாதீர்கள்",
    meaning_hi: "कृपया ~ मत करें",
    explanation_en: "Attach ないで to the nai-form (negative plain form) of a verb, then add ください. Used to politely ask someone not to do something.",
    explanation_ta: "வினையின் எதிர்மறை வடிவத்தில் (ない வடிவம்) ないで சேர்த்து ください சேர்க்கவும். யாரோ ஒருவரை ஏதாவது செய்யாமல் இருக்க மரியாதையாக கேட்க பயன்படுகிறது.",
    explanation_hi: "क्रिया के नकारात्मक (ない) रूप में ないで जोड़कर ください लगाएँ। किसी को विनम्रता से कुछ न करने के लिए कहने में उपयोग होता है।",
    examples: [
      { jp: "ここで写真を撮らないでください。", reading: "ここでしゃしんをとらないでください。", en: "Please don't take photos here.", ta: "இங்கே புகைப்படம் எடுக்காதீர்கள்.", hi: "यहाँ फोटो मत लीजिए।" },
      { jp: "遅刻しないでください。", reading: "ちこくしないでください。", en: "Please don't be late.", ta: "தாமதமாக வராதீர்கள்.", hi: "देर मत करिए।" },
      { jp: "心配しないでください。", reading: "しんぱいしないでください。", en: "Please don't worry.", ta: "கவலைப்படாதீர்கள்.", hi: "चिंता मत करिए।" }
    ],
    notes: "For stronger prohibitions (signs, rules), use 〜てはいけません or 〜べからず (classical).",
    jlpt_level: "N5",
    lesson_order: 13,
    tags: ["prohibition", "negative-request", "polite", "N5"]
  },
  {
    id: "n5_g014",
    pattern: "〜から〜まで",
    structure: "Start から End まで",
    meaning_en: "From ~ to ~ (time or place range)",
    meaning_ta: "~ இருந்து ~ வரை (நேரம் அல்லது இடம்)",
    meaning_hi: "~ से ~ तक (समय या स्थान की सीमा)",
    explanation_en: "から marks the starting point and まで marks the end point. Can be used with time (9 o'clock to 5) or place (Tokyo to Osaka).",
    explanation_ta: "から தொடக்க புள்ளியை குறிக்கிறது, まで இறுதி புள்ளியை குறிக்கிறது. நேரம் அல்லது இடத்துடன் பயன்படுத்தலாம்.",
    explanation_hi: "から शुरुआती बिंदु और まで अंत बिंदु को चिह्नित करता है। समय (9 से 5 बजे) या स्थान (टोक्यो से ओसाका) के साथ उपयोग होता है।",
    examples: [
      { jp: "9時から5時まで働きます。", reading: "くじからごじまではたらきます。", en: "I work from 9 to 5.", ta: "9 மணி முதல் 5 மணி வரை வேலை செய்கிறேன்.", hi: "9 से 5 बजे तक काम करता हूँ।" },
      { jp: "東京から大阪まで新幹線で行きます。", reading: "とうきょうからおおさかまでしんかんせんでいきます。", en: "I go from Tokyo to Osaka by Shinkansen.", ta: "டோக்கியோவிலிருந்து ஒசாகாவரை ஷின்கன்சனில் போகிறேன்.", hi: "टोक्यो से ओसाका तक शिंकानसेन से जाता हूँ।" },
      { jp: "月曜日から金曜日まで学校があります。", reading: "げつようびからきんようびまでがっこうがあります。", en: "School is from Monday to Friday.", ta: "திங்கள் முதல் வெள்ளி வரை பள்ளி இருக்கிறது.", hi: "सोमवार से शुक्रवार तक स्कूल है।" }
    ],
    notes: "から and まで can be used separately: 9時から働きます (I work from 9) / 5時まで働きます (I work until 5).",
    jlpt_level: "N5",
    lesson_order: 14,
    tags: ["range", "time", "place", "particle", "N5"]
  },
  {
    id: "n5_g015",
    pattern: "〜も",
    structure: "Noun も",
    meaning_en: "Also/too ~ (inclusive particle)",
    meaning_ta: "~ கூட/மட்டுமல்ல (சேர்ப்பு துணை வார்த்தை)",
    meaning_hi: "~ भी (समावेशी कण)",
    explanation_en: "も replaces は, が, or を to mean 'also' or 'too'. When used with negatives it means 'neither/either': 〜もありません.",
    explanation_ta: "も は, が, அல்லது を இடத்தில் 'கூட' அல்லது 'மட்டுமல்ல' என்று குறிக்க பயன்படுகிறது. எதிர்மறையில் 'இல்லை' என்று: 〜もありません.",
    explanation_hi: "も は, が, या を की जगह 'भी' के अर्थ में आता है। नकारात्मक के साथ 'न तो' का अर्थ: 〜もありません।",
    examples: [
      { jp: "私も学生です。", reading: "わたしもがくせいです。", en: "I am also a student.", ta: "நானும் மாணவர்.", hi: "मैं भी छात्र हूँ।" },
      { jp: "コーヒーも飲みます。", reading: "コーヒーものみます。", en: "I also drink coffee.", ta: "நான் காபியும் குடிக்கிறேன்.", hi: "मैं कॉफी भी पीता हूँ।" },
      { jp: "猫も犬も好きです。", reading: "ねこもいぬもすきです。", en: "I like both cats and dogs.", ta: "எனக்கு பூனையும் நாயும் பிடிக்கும்.", hi: "मुझे बिल्लियाँ और कुत्ते दोनों पसंद हैं।" }
    ],
    notes: "〜も〜も with two nouns means 'both ~ and ~'. With negatives: 〜も〜もありません means 'neither ~ nor ~'.",
    jlpt_level: "N5",
    lesson_order: 15,
    tags: ["inclusive", "also", "particle", "N5"]
  },
  {
    id: "n5_g016",
    pattern: "〜の",
    structure: "Noun の Noun",
    meaning_en: "Possessive/descriptive connector",
    meaning_ta: "உடைமை/விவரிப்பு இணைப்பான்",
    meaning_hi: "संबंध/विशेषण जोड़ने वाला",
    explanation_en: "の connects two nouns, showing possession (my book), origin (Japanese music), or description (coffee shop). The modifier always comes before の.",
    explanation_ta: "の இரண்டு பெயர்ச்சொற்களை இணைக்கிறது: உடைமை (என் புத்தகம்), தோற்றம் (ஜப்பான் இசை), விவரிப்பு (காபி கடை).",
    explanation_hi: "の दो संज्ञाओं को जोड़ता है: स्वामित्व (मेरी किताब), उत्पत्ति (जापानी संगीत), विवरण (कॉफी की दुकान)।",
    examples: [
      { jp: "私の本です。", reading: "わたしのほんです。", en: "It is my book.", ta: "இது என் புத்தகம்.", hi: "यह मेरी किताब है।" },
      { jp: "日本の音楽が好きです。", reading: "にほんのおんがくがすきです。", en: "I like Japanese music.", ta: "எனக்கு ஜப்பான் இசை பிடிக்கும்.", hi: "मुझे जापानी संगीत पसंद है।" },
      { jp: "これは田中さんの傘です。", reading: "これはたなかさんのかさです。", en: "This is Mr. Tanaka's umbrella.", ta: "இது தனாகாவின் குடை.", hi: "यह तनाका-सान की छाती है।" }
    ],
    notes: "の can also nominalise verbs and adjectives: 食べるのが好き (I like eating). This is a higher-level usage.",
    jlpt_level: "N5",
    lesson_order: 16,
    tags: ["possessive", "connector", "particle", "N5"]
  },
  {
    id: "n5_g017",
    pattern: "〜や〜など",
    structure: "Noun や Noun など",
    meaning_en: "And ~ and ~ etc. (non-exhaustive list)",
    meaning_ta: "~ மற்றும் ~ போன்றவை (முழு பட்டியல் இல்லாத)",
    meaning_hi: "~ और ~ आदि (अपूर्ण सूची)",
    explanation_en: "や lists examples from a larger group (implying 'and things like these'). など adds 'etc.' or 'and so on'. Contrast with と which lists everything exhaustively.",
    explanation_ta: "や ஒரு பெரிய குழுவிலிருந்து எடுத்துக்காட்டுகளை பட்டியலிடுகிறது. など 'போன்றவை' சேர்க்கிறது. と எல்லாவற்றையும் முழுமையாக பட்டியலிடுகிறது.",
    explanation_hi: "や एक बड़े समूह से उदाहरण देता है (इनकी तरह की चीज़ें भी)। など 'आदि' जोड़ता है। と के विपरीत जो सब कुछ पूरी तरह सूचीबद्ध करता है।",
    examples: [
      { jp: "果物や野菜などを買いました。", reading: "くだものやさいなどをかいました。", en: "I bought fruits, vegetables, and so on.", ta: "பழங்கள், காய்கறிகள் போன்றவை வாங்கினேன்.", hi: "मैंने फल, सब्जियाँ आदि खरीदे।" },
      { jp: "日本語や英語などを勉強しています。", reading: "にほんごやえいごなどをべんきょうしています。", en: "I am studying Japanese, English, and so on.", ta: "ஜப்பானிய மொழி, ஆங்கிலம் போன்றவை படிக்கிறேன்.", hi: "मैं जापानी, अंग्रेजी आदि पढ़ रहा हूँ।" },
      { jp: "東京や大阪などに行きたいです。", reading: "とうきょうやおおさかなどにいきたいです。", en: "I want to go to Tokyo, Osaka, and places like that.", ta: "டோக்கியோ, ஒசாகா போன்ற இடங்களுக்கு போக விரும்புகிறேன்.", hi: "मैं टोक्यो, ओसाका आदि जगहों पर जाना चाहता हूँ।" }
    ],
    notes: "など can be used alone without や: 本などを読みます (I read books and things like that).",
    jlpt_level: "N5",
    lesson_order: 17,
    tags: ["listing", "non-exhaustive", "particle", "N5"]
  },
  {
    id: "n5_g018",
    pattern: "〜と〜",
    structure: "Noun と Noun / Verb plain form + と",
    meaning_en: "And ~ (exhaustive listing) / With ~ / Quotation と",
    meaning_ta: "~ மற்றும் ~ (முழுமையான பட்டியல்) / ~ உடன் / மேற்கோள் と",
    meaning_hi: "~ और ~ (संपूर्ण सूची) / ~ के साथ / उद्धरण と",
    explanation_en: "と has three uses: (1) lists nouns exhaustively (A and B, nothing else), (2) marks a companion (with someone), (3) marks a quotation or thought before 言う/思う.",
    explanation_ta: "と மூன்று பயன்பாடுகளை கொண்டுள்ளது: (1) பெயர்ச்சொற்களை முழுமையாக பட்டியலிடுகிறது, (2) தோழமையை குறிக்கிறது, (3) மேற்கோள் அல்லது சிந்தனையை குறிக்கிறது.",
    explanation_hi: "と के तीन उपयोग: (1) संज्ञाओं को पूरी तरह सूचीबद्ध करना, (2) साथी को चिह्नित करना, (3) उद्धरण या विचार को चिह्नित करना।",
    examples: [
      { jp: "りんごとみかんを食べました。", reading: "りんごとみかんをたべました。", en: "I ate an apple and a mandarin orange.", ta: "ஆப்பிளும் ஆரஞ்சும் சாப்பிட்டேன்.", hi: "मैंने सेब और संतरा खाया।" },
      { jp: "友達と映画を見ました。", reading: "ともだちとえいがをみました。", en: "I watched a movie with my friend.", ta: "நண்பருடன் திரைப்படம் பார்த்தேன்.", hi: "दोस्त के साथ फिल्म देखी।" },
      { jp: "彼は「おはよう」と言いました。", reading: "かれは「おはよう」といいました。", en: "He said 'Good morning'.", ta: "அவர் 'குட் மார்னிங்' என்று சொன்னார்.", hi: "उसने 'सुप्रभात' कहा।" }
    ],
    notes: "Use と for complete lists (only A and B) and や for partial lists (A and B and others).",
    jlpt_level: "N5",
    lesson_order: 18,
    tags: ["listing", "companion", "quotation", "particle", "N5"]
  },
  {
    id: "n5_g019",
    pattern: "〜ね／〜よ",
    structure: "Sentence + ね / よ",
    meaning_en: "ね = seeking agreement / よ = asserting information",
    meaning_ta: "ね = ஒப்புதல் தேடுதல் / よ = உறுதிப்படுத்துதல்",
    meaning_hi: "ね = सहमति माँगना / よ = जानकारी देना",
    explanation_en: "ね is used when you expect the listener to agree or share the same feeling. よ asserts information the listener may not know. よね combines both.",
    explanation_ta: "ね கேட்பவர் ஒப்புக்கொள்வார் என்று எதிர்பார்க்கும்போது பயன்படுகிறது. よ கேட்பவருக்கு தெரியாத தகவலை உறுதிப்படுத்துகிறது.",
    explanation_hi: "ね तब उपयोग होता है जब आप चाहते हैं कि श्रोता सहमत हो। よ ऐसी जानकारी बताता है जो श्रोता को शायद पता न हो।",
    examples: [
      { jp: "今日は暑いですね。", reading: "きょうはあついですね。", en: "It's hot today, isn't it?", ta: "இன்று சூடாக இருக்கிறது, இல்லையா?", hi: "आज गर्मी है ना?" },
      { jp: "これは美味しいですよ。", reading: "これはおいしいですよ。", en: "This is delicious, I tell you!", ta: "இது சுவையாக இருக்கிறது, உண்மையிலேயே!", hi: "यह स्वादिष्ट है, सच में!" },
      { jp: "明日、テストがありますよね。", reading: "あした、テストがありますよね。", en: "There's a test tomorrow, right?", ta: "நாளை தேர்வு இருக்கிறது, இல்லையா?", hi: "कल परीक्षा है ना?" }
    ],
    notes: "よ with a rising intonation can sound pushy. Use it carefully with superiors. ね is generally softer and safer.",
    jlpt_level: "N5",
    lesson_order: 19,
    tags: ["sentence-ending", "nuance", "particles", "N5"]
  },
  {
    id: "n5_g020",
    pattern: "〜か",
    structure: "Sentence + か",
    meaning_en: "Question marker (turns statement into question)",
    meaning_ta: "கேள்வி குறிப்பான்",
    meaning_hi: "प्रश्न चिह्न (वाक्य को प्रश्न बनाता है)",
    explanation_en: "か at the end of a sentence makes it a question. In polite speech (〜ますか、〜ですか) the intonation stays flat. In casual speech, just raise the intonation.",
    explanation_ta: "வாக்கியத்தின் இறுதியில் か சேர்த்தால் கேள்வியாக மாறும். மரியாதையான பேச்சில் உச்சரிப்பு சம நிலையில் இருக்கும். வழக்கு பேச்சில் உச்சரிப்பை உயர்த்தவும்.",
    explanation_hi: "वाक्य के अंत में か जोड़ने से प्रश्न बनता है। विनम्र भाषण में स्वर समतल रहता है। बोलचाल में बस स्वर उठाएँ।",
    examples: [
      { jp: "これは何ですか。", reading: "これはなんですか。", en: "What is this?", ta: "இது என்ன?", hi: "यह क्या है?" },
      { jp: "日本人ですか。", reading: "にほんじんですか。", en: "Are you Japanese?", ta: "நீங்கள் ஜப்பானியரா?", hi: "क्या आप जापानी हैं?" },
      { jp: "明日、学校に来ますか。", reading: "あした、がっこうにきますか。", en: "Will you come to school tomorrow?", ta: "நாளை பள்ளிக்கு வருவீர்களா?", hi: "क्या आप कल स्कूल आएँगे?" }
    ],
    notes: "In casual speech, か alone can sound harsh (masculine/abrupt). Women often use の instead: 行くの？ (Are you going?)",
    jlpt_level: "N5",
    lesson_order: 20,
    tags: ["question", "particle", "N5"]
  },
  {
    id: "n5_g021",
    pattern: "〜てから",
    structure: "Verb て-form + から",
    meaning_en: "After doing ~ (sequential actions)",
    meaning_ta: "~ செய்த பிறகு (தொடர் செயல்கள்)",
    meaning_hi: "~ करने के बाद (क्रमिक क्रियाएँ)",
    explanation_en: "Indicates that one action is completed before the next begins. The て-form + から emphasises that the first action is fully done before the second starts.",
    explanation_ta: "ஒரு செயல் முடிந்த பிறகு அடுத்தது தொடங்குகிறது என்பதை குறிக்கிறது.",
    explanation_hi: "यह दर्शाता है कि एक क्रिया पूरी होने के बाद ही अगली शुरू होती है।",
    examples: [
      { jp: "手を洗ってから、ご飯を食べます。", reading: "てをあらってから、ごはんをたべます。", en: "After washing my hands, I eat.", ta: "கை கழுவிய பிறகு சாப்பிடுகிறேன்.", hi: "हाथ धोने के बाद खाना खाता हूँ।" },
      { jp: "宿題をしてから、遊びます。", reading: "しゅくだいをしてから、あそびます。", en: "After doing homework, I play.", ta: "வீட்டுப்பாடம் முடித்த பிறகு விளையாடுகிறேன்.", hi: "होमवर्क करने के बाद खेलता हूँ।" },
      { jp: "シャワーを浴びてから、寝ます。", reading: "シャワーをあびてから、ねます。", en: "After taking a shower, I sleep.", ta: "குளித்த பிறகு தூங்குகிறேன்.", hi: "नहाने के बाद सोता हूँ।" }
    ],
    notes: "Different from 〜た後で (after having done): てから emphasises sequence; た後で is more neutral about time elapsed.",
    jlpt_level: "N5",
    lesson_order: 21,
    tags: ["sequence", "te-form", "time", "N5"]
  },
  {
    id: "n5_g022",
    pattern: "〜たり〜たりします",
    structure: "Verb た-form + り … Verb た-form + りします",
    meaning_en: "Do things like ~ and ~ (non-exhaustive list of actions)",
    meaning_ta: "~ செய்தல், ~ செய்தல் போன்றவை (செயல்களின் முழுமையற்ற பட்டியல்)",
    meaning_hi: "~ करना और ~ करना आदि (क्रियाओं की अपूर्ण सूची)",
    explanation_en: "Lists representative activities without implying it's a complete list. Form: change verb to た-form, add り, repeat for other verbs, end with します.",
    explanation_ta: "பிரதிநிதித்துவ செயல்களை பட்டியலிடுகிறது. உருவாக்கம்: வினையை た வடிவமாக மாற்றி り சேர்க்கவும்.",
    explanation_hi: "प्रतिनिधि गतिविधियों की सूची। बनावट: क्रिया को た-रूप में बदलें, り जोड़ें, अन्य क्रियाओं के लिए दोहराएँ।",
    examples: [
      { jp: "週末は映画を見たり、音楽を聴いたりします。", reading: "しゅうまつはえいがをみたり、おんがくをきいたりします。", en: "On weekends I do things like watch movies and listen to music.", ta: "வார இறுதியில் திரைப்படம் பார்த்தல், இசை கேட்டல் போன்றவை செய்கிறேன்.", hi: "सप्ताहांत में फिल्म देखना, संगीत सुनना आदि करता हूँ।" },
      { jp: "日本語を読んだり、書いたりします。", reading: "にほんごをよんだり、かいたりします。", en: "I do things like read and write Japanese.", ta: "ஜப்பானிய மொழி படித்தல், எழுதுதல் போன்றவை செய்கிறேன்.", hi: "जापानी पढ़ना और लिखना आदि करता हूँ।" },
      { jp: "旅行では写真を撮ったり、食べ物を食べたりしました。", reading: "りょこうではしゃしんをとったり、たべものをたべたりしました。", en: "On the trip I did things like take photos and eat food.", ta: "பயணத்தில் புகைப்படம் எடுத்தல், உணவு சாப்பிடுதல் போன்றவை செய்தேன்.", hi: "यात्रा में फोटो लेना और खाना खाना आदि किया।" }
    ],
    notes: "Always end with します or しました. Using only one たり is possible but sounds incomplete; two or more is standard.",
    jlpt_level: "N5",
    lesson_order: 22,
    tags: ["listing-actions", "non-exhaustive", "N5"]
  },
  {
    id: "n5_g023",
    pattern: "〜ことができる",
    structure: "Verb dictionary form + ことができる",
    meaning_en: "Can do ~ / be able to do ~ (ability or possibility)",
    meaning_ta: "~ செய்ய முடியும் (திறன் அல்லது சாத்தியம்)",
    meaning_hi: "~ कर सकता/सकती हूँ (क्षमता या संभावना)",
    explanation_en: "Expresses ability or possibility. The simpler alternative is the potential verb form (食べられる). ことができる is slightly more formal.",
    explanation_ta: "திறன் அல்லது சாத்தியத்தை வெளிப்படுத்துகிறது. எளிய மாற்று திறன் வினை வடிவம் (食べられる). ことができる சற்று அதிக முறையான வடிவம்.",
    explanation_hi: "क्षमता या संभावना व्यक्त करता है। सरल विकल्प संभावित क्रिया रूप (食べられる) है। ことができる थोड़ा अधिक औपचारिक है।",
    examples: [
      { jp: "日本語を話すことができます。", reading: "にほんごをはなすことができます。", en: "I can speak Japanese.", ta: "என்னால் ஜப்பானிய மொழி பேச முடியும்.", hi: "मैं जापानी बोल सकता हूँ।" },
      { jp: "ここで泳ぐことができますか。", reading: "ここでおよぐことができますか。", en: "Can we swim here?", ta: "இங்கே நீச்சல் அடிக்க முடியுமா?", hi: "क्या हम यहाँ तैर सकते हैं?" },
      { jp: "漢字を読むことができません。", reading: "かんじをよむことができません。", en: "I cannot read kanji.", ta: "என்னால் கஞ்சி படிக்க முடியாது.", hi: "मैं कांजी नहीं पढ़ सकता।" }
    ],
    notes: "The potential form (食べられる、読める) is more common in spoken Japanese. ことができる is preferred in formal writing.",
    jlpt_level: "N5",
    lesson_order: 23,
    tags: ["ability", "potential", "N5"]
  },
  {
    id: "n5_g024",
    pattern: "〜前に",
    structure: "Verb dictionary form / Noun + の + 前に",
    meaning_en: "Before doing ~ (prior action)",
    meaning_ta: "~ செய்வதற்கு முன்பு",
    meaning_hi: "~ करने से पहले",
    explanation_en: "前に with a verb (dictionary form) means 'before doing'. With a noun, use の前に. The action in 前に clause is not yet completed.",
    explanation_ta: "前に வினையுடன் (அகராதி வடிவம்) 'செய்வதற்கு முன்பு' என்று குறிக்கிறது. பெயர்ச்சொல்லுடன் の前に பயன்படுத்தவும்.",
    explanation_hi: "前に के साथ क्रिया (शब्दकोश रूप) 'करने से पहले' का अर्थ देता है। संज्ञा के साथ の前に का उपयोग करें।",
    examples: [
      { jp: "寝る前に歯を磨きます。", reading: "ねるまえにはをみがきます。", en: "I brush my teeth before sleeping.", ta: "தூங்குவதற்கு முன்பு பல் தேய்க்கிறேன்.", hi: "सोने से पहले दाँत साफ करता हूँ।" },
      { jp: "食事の前に手を洗います。", reading: "しょくじのまえにてをあらいます。", en: "I wash my hands before meals.", ta: "உணவுக்கு முன்பு கை கழுவுகிறேன்.", hi: "खाने से पहले हाथ धोता हूँ।" },
      { jp: "日本に来る前に、日本語を勉強しました。", reading: "にほんにくるまえに、にほんごをべんきょうしました。", en: "Before coming to Japan, I studied Japanese.", ta: "ஜப்பானுக்கு வருவதற்கு முன்பு ஜப்பானிய மொழி படித்தேன்.", hi: "जापान आने से पहले जापानी पढ़ी।" }
    ],
    notes: "The verb before 前に is always in dictionary (plain non-past) form, even when talking about the past.",
    jlpt_level: "N5",
    lesson_order: 24,
    tags: ["time", "before", "sequence", "N5"]
  },
  {
    id: "n5_g025",
    pattern: "〜後で",
    structure: "Verb た-form / Noun + の + 後で",
    meaning_en: "After doing ~ (subsequent action)",
    meaning_ta: "~ செய்த பிறகு (அடுத்த செயல்)",
    meaning_hi: "~ करने के बाद (अगली क्रिया)",
    explanation_en: "後で indicates an action happens after another. With verbs, use the た-form. With nouns, use の後で.",
    explanation_ta: "後で ஒரு செயல் இன்னொன்றுக்கு பிறகு நடப்பதை குறிக்கிறது. வினைகளுடன் た வடிவம் பயன்படுத்தவும்.",
    explanation_hi: "後で दर्शाता है कि एक क्रिया दूसरी के बाद होती है। क्रियाओं के साथ た-रूप का उपयोग करें।",
    examples: [
      { jp: "授業が終わった後で、図書館に行きます。", reading: "じゅぎょうがおわったあとで、としょかんにいきます。", en: "After class ends, I will go to the library.", ta: "வகுப்பு முடிந்த பிறகு நூலகம் போகிறேன்.", hi: "कक्षा खत्म होने के बाद पुस्तकालय जाऊँगा।" },
      { jp: "仕事の後で、飲みに行きましょう。", reading: "しごとのあとで、のみにいきましょう。", en: "After work, let's go for a drink.", ta: "வேலைக்கு பிறகு பானம் குடிக்க போவோம்.", hi: "काम के बाद पीने चलते हैं।" },
      { jp: "昼ご飯を食べた後で、散歩しました。", reading: "ひるごはんをたべたあとで、さんぽしました。", en: "After eating lunch, I took a walk.", ta: "மதிய உணவு சாப்பிட்ட பிறகு நடை பயிற்சி செய்தேன்.", hi: "दोपहर का खाना खाने के बाद टहला।" }
    ],
    notes: "Compare with てから: 後で is more flexible about time gap; てから implies the second action follows directly.",
    jlpt_level: "N5",
    lesson_order: 25,
    tags: ["time", "after", "sequence", "N5"]
  },
  {
    id: "n5_g026",
    pattern: "い-adjective conjugation",
    structure: "い-adj (〜い) → 〜くない / 〜かった / 〜くなかった",
    meaning_en: "い-adjective: negative, past, and negative past forms",
    meaning_ta: "い-பெயரடை: எதிர்மறை, கடந்த காலம், எதிர்மறை கடந்த காலம்",
    meaning_hi: "い-विशेषण: नकारात्मक, भूतकाल, नकारात्मक भूतकाल",
    explanation_en: "い-adjectives conjugate by changing the final い: drop い and add くない (neg), かった (past), くなかった (neg past). Exception: いい → よい → よくない / よかった.",
    explanation_ta: "い-பெயரடைகள் இறுதி い ஐ மாற்றுவதன் மூலம் இணைக்கப்படுகின்றன. விதிவிலக்கு: いい → よい → よくない / よかった.",
    explanation_hi: "い-विशेषण अंतिम い बदलकर संयुग्मित होते हैं। अपवाद: いい → よい → よくない / よかった।",
    examples: [
      { jp: "この映画は面白くないです。", reading: "このえいがはおもしろくないです。", en: "This movie is not interesting.", ta: "இந்த திரைப்படம் சுவாரஸ்யமில்லை.", hi: "यह फिल्म दिलचस्प नहीं है।" },
      { jp: "昨日は寒かったです。", reading: "きのうはさむかったです。", en: "It was cold yesterday.", ta: "நேற்று குளிராக இருந்தது.", hi: "कल ठंड थी।" },
      { jp: "その料理は美味しくなかったです。", reading: "そのりょうりはおいしくなかったです。", en: "That dish was not delicious.", ta: "அந்த உணவு சுவையாக இல்லை.", hi: "वह व्यंजन स्वादिष्ट नहीं था।" }
    ],
    notes: "いい (good) is irregular. Always change to よ first: よくない (not good), よかった (was good), よくなかった (was not good).",
    jlpt_level: "N5",
    lesson_order: 26,
    tags: ["adjective", "conjugation", "い-adjective", "N5"]
  },
  {
    id: "n5_g027",
    pattern: "な-adjective conjugation",
    structure: "な-adj + です → じゃない / でした / じゃなかった",
    meaning_en: "な-adjective: negative, past, and negative past forms",
    meaning_ta: "な-பெயரடை: எதிர்மறை, கடந்த காலம், எதிர்மறை கடந்த காலம்",
    meaning_hi: "な-विशेषण: नकारात्मक, भूतकाल, नकारात्मक भूतकाल",
    explanation_en: "な-adjectives conjugate like nouns + です. Negative: じゃありません/ではありません. Past: でした. Neg past: じゃありませんでした.",
    explanation_ta: "な-பெயரடைகள் பெயர்ச்சொல் + です போல் இணைக்கப்படுகின்றன.",
    explanation_hi: "な-विशेषण संज्ञा + です की तरह संयुग्मित होते हैं।",
    examples: [
      { jp: "この部屋は静かじゃないです。", reading: "このへやはしずかじゃないです。", en: "This room is not quiet.", ta: "இந்த அறை அமைதியாக இல்லை.", hi: "यह कमरा शांत नहीं है।" },
      { jp: "彼女はとても元気でした。", reading: "かのじょはとてもげんきでした。", en: "She was very energetic.", ta: "அவள் மிகவும் சுறுசுறுப்பாக இருந்தாள்.", hi: "वह बहुत उत्साहित थी।" },
      { jp: "その公園はあまり有名じゃなかったです。", reading: "そのこうえんはあまりゆうめいじゃなかったです。", en: "That park was not very famous.", ta: "அந்த பூங்கா அதிகம் பிரபலமில்லை.", hi: "वह पार्क बहुत प्रसिद्ध नहीं था।" }
    ],
    notes: "When な-adjectives modify nouns, add な: 静かな部屋 (a quiet room). Don't add な before です.",
    jlpt_level: "N5",
    lesson_order: 27,
    tags: ["adjective", "conjugation", "な-adjective", "N5"]
  },
  {
    id: "n5_g028",
    pattern: "〜より〜のほうが",
    structure: "A より B のほうが Adjective",
    meaning_en: "B is more ~ than A (comparison)",
    meaning_ta: "A ஐவிட B ~ அதிகம் (ஒப்பீடு)",
    meaning_hi: "A से B अधिक ~ है (तुलना)",
    explanation_en: "より marks the standard of comparison (A). のほうが marks what is being compared favourably (B). The adjective follows.",
    explanation_ta: "より ஒப்பீட்டு தரத்தை குறிக்கிறது (A). のほうが சாதகமாக ஒப்பிடப்படுவதை குறிக்கிறது (B).",
    explanation_hi: "より तुलना का मानक (A) चिह्नित करता है। のほうが अनुकूल तुलना (B) चिह्नित करता है।",
    examples: [
      { jp: "犬より猫のほうが好きです。", reading: "いぬよりねこのほうがすきです。", en: "I like cats more than dogs.", ta: "நாயைவிட பூனை அதிகம் பிடிக்கும்.", hi: "कुत्तों से बिल्लियाँ ज़्यादा पसंद हैं।" },
      { jp: "電車よりバスのほうが安いです。", reading: "でんしゃよりバスのほうがやすいです。", en: "The bus is cheaper than the train.", ta: "ரயிலைவிட பஸ் மலிவானது.", hi: "ट्रेन से बस सस्ती है।" },
      { jp: "夏より冬のほうが好きです。", reading: "なつよりふゆのほうがすきです。", en: "I like winter more than summer.", ta: "கோடையைவிட குளிர்காலம் அதிகம் பிடிக்கும்.", hi: "गर्मी से सर्दी ज़्यादा पसंद है।" }
    ],
    notes: "To ask 'which is more ~?' use どちらのほうが: 犬と猫、どちらのほうが好きですか。",
    jlpt_level: "N5",
    lesson_order: 28,
    tags: ["comparison", "adjective", "N5"]
  },
  {
    id: "n5_g029",
    pattern: "〜が一番",
    structure: "Noun が 一番 Adjective",
    meaning_en: "~ is the most / ~ is number one (superlative)",
    meaning_ta: "~ மிகவும் (மிகத்துக்கான வடிவம்)",
    meaning_hi: "~ सबसे अधिक (सर्वोच्च रूप)",
    explanation_en: "一番 (いちばん) means 'number one' or 'most'. Place it before the adjective. To specify the group, use 〜の中で〜が一番.",
    explanation_ta: "一番 (いちばん) 'முதலிடம்' அல்லது 'மிகவும்' என்று குறிக்கிறது. குழுவை குறிக்க 〜の中で〜が一番 பயன்படுத்தவும்.",
    explanation_hi: "一番 (いちばん) 'पहले नंबर' या 'सबसे' का अर्थ है। समूह बताने के लिए 〜の中で〜が一番 का उपयोग करें।",
    examples: [
      { jp: "日本語が一番難しいです。", reading: "にほんごがいちばんむずかしいです。", en: "Japanese is the most difficult.", ta: "ஜப்பானிய மொழி மிகவும் கஷ்டமானது.", hi: "जापानी सबसे कठिन है।" },
      { jp: "クラスの中で山田さんが一番背が高いです。", reading: "クラスのなかでやまださんがいちばんせがたかいです。", en: "In the class, Mr. Yamada is the tallest.", ta: "வகுப்பில் யமாடா மிகவும் உயரமானவர்.", hi: "कक्षा में यामादा-सान सबसे लंबे हैं।" },
      { jp: "季節の中で、春が一番好きです。", reading: "きせつのなかで、はるがいちばんすきです。", en: "Among seasons, I like spring the most.", ta: "பருவங்களில் வசந்த காலம் மிகவும் பிடிக்கும்.", hi: "मौसमों में वसंत सबसे पसंद है।" }
    ],
    notes: "一番 can also mean 'first' in a sequence (一番目), so context matters.",
    jlpt_level: "N5",
    lesson_order: 29,
    tags: ["superlative", "comparison", "adjective", "N5"]
  },
  {
    id: "n5_g030",
    pattern: "〜から (reason)",
    structure: "Plain form / Polite form + から",
    meaning_en: "Because ~ / Since ~ (stating a reason)",
    meaning_ta: "ஏனென்றால் ~ / ~ என்பதால் (காரணம் கூறுதல்)",
    meaning_hi: "क्योंकि ~ / ~ के कारण (कारण बताना)",
    explanation_en: "から after a clause gives the reason for what follows. In polite speech, both clauses use polite forms. In casual speech, plain forms are used.",
    explanation_ta: "ஒரு பகுதிக்கு பிறகு から அடுத்து வருவதற்கான காரணத்தை கொடுக்கிறது.",
    explanation_hi: "एक उपवाक्य के बाद から अगले का कारण देता है।",
    examples: [
      { jp: "眠いから、早く寝ます。", reading: "ねむいから、はやくねます。", en: "Because I am sleepy, I will sleep early.", ta: "தூக்கம் வருவதால், சீக்கிரம் தூங்குகிறேன்.", hi: "नींद आ रही है इसलिए जल्दी सोऊँगा।" },
      { jp: "雨が降っているから、傘を持ってください。", reading: "あめがふっているから、かさをもってください。", en: "Because it is raining, please take an umbrella.", ta: "மழை பெய்வதால், குடை எடுங்கள்.", hi: "बारिश हो रही है इसलिए छाता लीजिए।" },
      { jp: "日本語が好きだから、毎日勉強します。", reading: "にほんごがすきだから、まいにちべんきょうします。", en: "Because I like Japanese, I study every day.", ta: "ஜப்பானிய மொழி பிடிக்கும் என்பதால், தினமும் படிக்கிறேன்.", hi: "जापानी पसंद है इसलिए हर रोज़ पढ़ता हूँ।" }
    ],
    notes: "ので is a softer, more indirect way to give a reason. から is more direct and can sound blunt in formal situations.",
    jlpt_level: "N5",
    lesson_order: 30,
    tags: ["reason", "cause", "conjunction", "N5"]
  },
  {
    id: "n5_g031",
    pattern: "〜ので",
    structure: "Plain form (な-adj/Noun + な) + ので",
    meaning_en: "Because ~ / Since ~ (softer, objective reason)",
    meaning_ta: "ஏனென்றால் ~ (மென்மையான, புறநிலை காரணம்)",
    meaning_hi: "क्योंकि ~ (नरम, वस्तुनिष्ठ कारण)",
    explanation_en: "ので gives a reason like から but sounds more objective and polite. Better for formal situations. な-adjectives and nouns use なので before ので.",
    explanation_ta: "ので も から ஐப் போல் காரணம் கொடுக்கிறது ஆனால் மிகவும் புறநிலை மற்றும் மரியாதையாக தெரிகிறது.",
    explanation_hi: "ので भी から की तरह कारण देता है लेकिन अधिक वस्तुनिष्ठ और विनम्र लगता है।",
    examples: [
      { jp: "疲れたので、休みます。", reading: "つかれたので、やすみます。", en: "Since I am tired, I will rest.", ta: "களைத்திருப்பதால், ஓய்வெடுக்கிறேன்.", hi: "थका हुआ हूँ इसलिए आराम करूँगा।" },
      { jp: "病気なので、学校を休みました。", reading: "びょうきなので、がっこうをやすみました。", en: "Since I was sick, I was absent from school.", ta: "நோய்வாய்ப்பட்டிருந்ததால் பள்ளிக்கு விடுமுறை எடுத்தேன்.", hi: "बीमार था इसलिए स्कूल से छुट्टी ली।" },
      { jp: "明日試験があるので、今日は早く寝ます。", reading: "あしたしけんがあるので、きょうははやくねます。", en: "Since there is an exam tomorrow, I will sleep early today.", ta: "நாளை தேர்வு இருப்பதால், இன்று சீக்கிரம் தூங்குகிறேன்.", hi: "कल परीक्षा है इसलिए आज जल्दी सोऊँगा।" }
    ],
    notes: "In polite speech, prefer ので over から. In casual speech, から is more natural.",
    jlpt_level: "N5",
    lesson_order: 31,
    tags: ["reason", "cause", "conjunction", "polite", "N5"]
  },
  {
    id: "n5_g032",
    pattern: "〜が、〜 (contrast)",
    structure: "Clause 1 + が、Clause 2",
    meaning_en: "~ but ~ (contrast between two clauses)",
    meaning_ta: "~ ஆனால் ~ (இரண்டு பகுதிகளுக்கிடையே முரண்பாடு)",
    meaning_hi: "~ लेकिन ~ (दो उपवाक्यों के बीच विरोधाभास)",
    explanation_en: "が as a conjunction connects two contrasting clauses like 'but' or 'however'. It can also soften a statement without strong contrast.",
    explanation_ta: "接続詞 (接続詞) としての が இரண்டு முரண்பட்ட பகுதிகளை இணைக்கிறது. மென்மையான வடிவமாகவும் பயன்படுகிறது.",
    explanation_hi: "接続詞 के रूप में が दो विपरीत उपवाक्यों को जोड़ता है। नरम कथन के लिए भी उपयोग होता है।",
    examples: [
      { jp: "日本語は面白いですが、難しいです。", reading: "にほんごはおもしろいですが、むずかしいです。", en: "Japanese is interesting but difficult.", ta: "ஜப்பானிய மொழி சுவாரஸ்யமானது ஆனால் கஷ்டமானது.", hi: "जापानी दिलचस्प है लेकिन मुश्किल है।" },
      { jp: "高いですが、美味しいです。", reading: "たかいですが、おいしいです。", en: "It's expensive but delicious.", ta: "விலை அதிகம் ஆனால் சுவையானது.", hi: "महँगा है लेकिन स्वादिष्ट है।" },
      { jp: "行きたいですが、時間がありません。", reading: "いきたいですが、じかんがありません。", en: "I want to go but I don't have time.", ta: "போக விரும்புகிறேன் ஆனால் நேரமில்லை.", hi: "जाना चाहता हूँ लेकिन समय नहीं है।" }
    ],
    notes: "が at the end of a sentence (〜ですが) softens the sentence, like trailing off politely: よろしいですが… (It would be fine, but…)",
    jlpt_level: "N5",
    lesson_order: 32,
    tags: ["contrast", "conjunction", "but", "N5"]
  },
  {
    id: "n5_g033",
    pattern: "どんな〜",
    structure: "どんな + Noun",
    meaning_en: "What kind of ~ (asking about characteristics)",
    meaning_ta: "எந்த வகையான ~ (பண்புகளைப் பற்றி கேட்டல்)",
    meaning_hi: "किस प्रकार का ~ (विशेषताओं के बारे में पूछना)",
    explanation_en: "どんな asks about the type or quality of something. Similar to 'what kind of' in English.",
    explanation_ta: "どんな ஒன்றின் வகை அல்லது தரத்தைப் பற்றி கேட்கிறது.",
    explanation_hi: "どんな किसी चीज़ के प्रकार या गुण के बारे में पूछता है।",
    examples: [
      { jp: "どんな音楽が好きですか。", reading: "どんなおんがくがすきですか。", en: "What kind of music do you like?", ta: "எந்த வகையான இசை பிடிக்கும்?", hi: "आपको किस तरह का संगीत पसंद है?" },
      { jp: "どんな人が好きですか。", reading: "どんなひとがすきですか。", en: "What kind of person do you like?", ta: "எந்த வகையான நபர் பிடிக்கும்?", hi: "आपको किस तरह के लोग पसंद हैं?" },
      { jp: "日本はどんな国ですか。", reading: "にほんはどんなくにですか。", en: "What kind of country is Japan?", ta: "ஜப்பான் எந்த வகையான நாடு?", hi: "जापान किस प्रकार का देश है?" }
    ],
    notes: "Compare with どの (which specific one from a group) and なに/なん (what thing).",
    jlpt_level: "N5",
    lesson_order: 33,
    tags: ["question-word", "descriptor", "N5"]
  },
  {
    id: "n5_g034",
    pattern: "〜くなる / 〜になる",
    structure: "い-adj stem + くなる / な-adj or Noun + になる",
    meaning_en: "To become ~ (change of state)",
    meaning_ta: "~ ஆகுதல் (நிலை மாற்றம்)",
    meaning_hi: "~ बनना / ~ हो जाना (अवस्था परिवर्तन)",
    explanation_en: "なる means 'to become'. い-adjectives change い to くなる. な-adjectives and nouns use になる.",
    explanation_ta: "なる 'ஆகுதல்' என்று குறிக்கிறது. い-பெயரடைகளில் い ஐ くなる ஆக மாற்றவும். な-பெயரடைகள் மற்றும் பெயர்ச்சொற்கள் になる பயன்படுத்துகின்றன.",
    explanation_hi: "なる 'बनना' का अर्थ है। い-विशेषणों में い को くなる में बदलें। な-विशेषण और संज्ञाएँ になる का उपयोग करती हैं।",
    examples: [
      { jp: "春になると、暖かくなります。", reading: "はるになると、あたたかくなります。", en: "When spring comes, it becomes warm.", ta: "வசந்த காலம் வரும்போது, சூடாகிறது.", hi: "वसंत आने पर गर्म हो जाता है।" },
      { jp: "日本語が上手になりたいです。", reading: "にほんごがじょうずになりたいです。", en: "I want to become good at Japanese.", ta: "ஜப்பானிய மொழியில் திறமையாக ஆக விரும்புகிறேன்.", hi: "जापानी में अच्छा बनना चाहता हूँ।" },
      { jp: "大人になったら、医者になりたい。", reading: "おとなになったら、いしゃになりたい。", en: "When I grow up, I want to become a doctor.", ta: "பெரியவர் ஆகும்போது, டாக்டர் ஆக விரும்புகிறேன்.", hi: "बड़ा होकर डॉक्टर बनना चाहता हूँ।" }
    ],
    notes: "〜くする (to make something ~) is the transitive counterpart: 部屋を綺麗にする (to make the room clean).",
    jlpt_level: "N5",
    lesson_order: 34,
    tags: ["change", "become", "state", "N5"]
  },
  {
    id: "n5_g035",
    pattern: "〜てもいいです",
    structure: "Verb て-form + もいいです",
    meaning_en: "It is okay to ~ / You may ~ (giving or asking permission)",
    meaning_ta: "~ செய்யலாம் (அனுமதி கொடுத்தல் அல்லது கேட்டல்)",
    meaning_hi: "~ करना ठीक है / आप ~ कर सकते हैं (अनुमति देना या माँगना)",
    explanation_en: "〜てもいいです gives permission. 〜てもいいですか asks for permission. To deny: 〜てはいけません or 〜てはだめです.",
    explanation_ta: "〜てもいいです அனுமதி கொடுக்கிறது. 〜てもいいですか அனுமதி கேட்கிறது. மறுக்க: 〜てはいけません.",
    explanation_hi: "〜てもいいです अनुमति देता है। 〜てもいいですか अनुमति माँगता है। इनकार: 〜てはいけません।",
    examples: [
      { jp: "ここで食べてもいいですか。", reading: "ここでたべてもいいですか。", en: "May I eat here?", ta: "இங்கே சாப்பிடலாமா?", hi: "क्या मैं यहाँ खा सकता हूँ?" },
      { jp: "窓を開けてもいいです。", reading: "まどをあけてもいいです。", en: "You may open the window.", ta: "ஜன்னலை திறக்கலாம்.", hi: "आप खिड़की खोल सकते हैं।" },
      { jp: "この本を借りてもいいですか。", reading: "このほんをかりてもいいですか。", en: "May I borrow this book?", ta: "இந்த புத்தகத்தை கடனாக வாங்கலாமா?", hi: "क्या मैं यह किताब उधार ले सकता हूँ?" }
    ],
    notes: "〜てもかまいません is a more formal/polite version. 〜てもいい (without です) is casual.",
    jlpt_level: "N5",
    lesson_order: 35,
    tags: ["permission", "te-form", "N5"]
  },
  {
    id: "n5_g036",
    pattern: "〜てはいけません",
    structure: "Verb て-form + はいけません",
    meaning_en: "Must not ~ / It is not allowed to ~ (prohibition)",
    meaning_ta: "~ செய்யக்கூடாது (தடை)",
    meaning_hi: "~ नहीं करना चाहिए / ~ करना मना है (प्रतिबंध)",
    explanation_en: "〜てはいけません prohibits an action. More forceful than 〜ないでください. Common in rules and regulations.",
    explanation_ta: "〜てはいけません ஒரு செயலை தடைசெய்கிறது. 〜ないでください ஐவிட அதிக வலிமையானது. விதிகள் மற்றும் ஒழுங்குமுறைகளில் பொதுவானது.",
    explanation_hi: "〜てはいけません किसी क्रिया को प्रतिबंधित करता है। 〜ないでください से अधिक कठोर। नियमों में सामान्य।",
    examples: [
      { jp: "ここでタバコを吸ってはいけません。", reading: "ここでタバコをすってはいけません。", en: "You must not smoke here.", ta: "இங்கே புகைபிடிக்கக்கூடாது.", hi: "यहाँ धूम्रपान करना मना है।" },
      { jp: "授業中に携帯を使ってはいけません。", reading: "じゅぎょうちゅうにけいたいをつかってはいけません。", en: "You must not use your phone during class.", ta: "வகுப்பில் மொபைல் பயன்படுத்தக்கூடாது.", hi: "कक्षा के दौरान मोबाइल इस्तेमाल नहीं करना चाहिए।" },
      { jp: "嘘をついてはいけません。", reading: "うそをついてはいけません。", en: "You must not lie.", ta: "பொய் சொல்லக்கூடாது.", hi: "झूठ नहीं बोलना चाहिए।" }
    ],
    notes: "Casual form: 〜てはだめ or 〜ちゃだめ (contraction of てはだめ).",
    jlpt_level: "N5",
    lesson_order: 36,
    tags: ["prohibition", "must-not", "rules", "N5"]
  },
  {
    id: "n5_g037",
    pattern: "〜なければなりません",
    structure: "Verb nai-stem + なければなりません",
    meaning_en: "Must ~ / Have to ~ (obligation)",
    meaning_ta: "~ செய்யவேண்டும் (கடமை)",
    meaning_hi: "~ करना चाहिए / ~ करना ज़रूरी है (दायित्व)",
    explanation_en: "Expresses obligation. Formed by changing ない to なければ and adding なりません. Casual: 〜なきゃ or 〜なければ.",
    explanation_ta: "கடமையை வெளிப்படுத்துகிறது. ない ஐ なければ ஆக மாற்றி なりません சேர்க்கவும். வழக்கு: 〜なきゃ.",
    explanation_hi: "दायित्व व्यक्त करता है। ない को なければ में बदलकर なりません जोड़ें। सामान्य बोलचाल: 〜なきゃ।",
    examples: [
      { jp: "明日、早く起きなければなりません。", reading: "あした、はやくおきなければなりません。", en: "I must wake up early tomorrow.", ta: "நாளை சீக்கிரம் எழுந்திருக்க வேண்டும்.", hi: "कल जल्दी उठना होगा।" },
      { jp: "宿題をしなければなりません。", reading: "しゅくだいをしなければなりません。", en: "I have to do my homework.", ta: "வீட்டுப்பாடம் செய்ய வேண்டும்.", hi: "होमवर्क करना होगा।" },
      { jp: "薬を飲まなければなりません。", reading: "くすりをのまなければなりません。", en: "I must take the medicine.", ta: "மருந்து குடிக்க வேண்டும்.", hi: "दवाई लेनी होगी।" }
    ],
    notes: "Common contractions: なければ → なきゃ (casual), なければならない → ないといけない (slightly softer).",
    jlpt_level: "N5",
    lesson_order: 37,
    tags: ["obligation", "must", "N5"]
  },
  {
    id: "n5_g038",
    pattern: "〜でしょう / 〜だろう",
    structure: "Plain form + でしょう / だろう",
    meaning_en: "Probably ~ / I think ~ (conjecture)",
    meaning_ta: "ஒருவேளை ~ / நினைக்கிறேன் ~ (யூகம்)",
    meaning_hi: "शायद ~ / मुझे लगता है ~ (अनुमान)",
    explanation_en: "Expresses probability or supposition. でしょう is polite; だろう is plain/casual. Often used with たぶん (probably).",
    explanation_ta: "நிகழ்தகவு அல்லது அனுமானத்தை வெளிப்படுத்துகிறது. でしょう மரியாதையானது; だろう வழக்கு வடிவம். தぶん (ஒருவேளை) உடன் பயன்படுத்தப்படுகிறது.",
    explanation_hi: "संभावना या अनुमान व्यक्त करता है। でしょう विनम्र है; だろう सामान्य/अनौपचारिक। अक्सर たぶん के साथ उपयोग होता है।",
    examples: [
      { jp: "明日は雨が降るでしょう。", reading: "あしたはあめがふるでしょう。", en: "It will probably rain tomorrow.", ta: "நாளை மழை பெய்யும் என்று நினைக்கிறேன்.", hi: "कल शायद बारिश होगी।" },
      { jp: "彼は来ないだろう。", reading: "かれはこないだろう。", en: "He probably won't come.", ta: "அவர் வர மாட்டார் என்று நினைக்கிறேன்.", hi: "वह शायद नहीं आएगा।" },
      { jp: "たぶん大丈夫でしょう。", reading: "たぶんだいじょうぶでしょう。", en: "It will probably be fine.", ta: "ஒருவேளை பரவாயில்லை என்று நினைக்கிறேன்.", hi: "शायद ठीक होगा।" }
    ],
    notes: "Rising intonation on でしょう turns it into a tag question: 寒いでしょう? (It's cold, right?)",
    jlpt_level: "N5",
    lesson_order: 38,
    tags: ["conjecture", "probability", "N5"]
  },
  {
    id: "n5_g039",
    pattern: "〜と思います",
    structure: "Plain form + と思います",
    meaning_en: "I think that ~ (expressing opinion or belief)",
    meaning_ta: "~ என்று நினைக்கிறேன் (கருத்து வெளிப்படுத்துதல்)",
    meaning_hi: "मुझे लगता है कि ~ (राय या विश्वास व्यक्त करना)",
    explanation_en: "Used to express the speaker's opinion or belief. The clause before と is always in plain form. と思っています implies ongoing thinking.",
    explanation_ta: "பேசுபவரின் கருத்து அல்லது நம்பிக்கையை வெளிப்படுத்துகிறது. と க்கு முன்னால் எப்போதும் எளிய வடிவம். と思っています தொடர்ந்து யோசிப்பதை குறிக்கிறது.",
    explanation_hi: "वक्ता की राय या विश्वास व्यक्त करता है। と से पहले हमेशा plain form। と思っています निरंतर सोच दर्शाता है।",
    examples: [
      { jp: "日本語は面白いと思います。", reading: "にほんごはおもしろいとおもいます。", en: "I think Japanese is interesting.", ta: "ஜப்பானிய மொழி சுவாரஸ்யமானது என்று நினைக்கிறேன்.", hi: "मुझे लगता है जापानी दिलचस्प है।" },
      { jp: "明日は晴れると思います。", reading: "あしたははれるとおもいます。", en: "I think it will be sunny tomorrow.", ta: "நாளை வெய்யிலாக இருக்கும் என்று நினைக்கிறேன்.", hi: "मुझे लगता है कल धूप होगी।" },
      { jp: "彼女は来ないと思います。", reading: "かのじょはこないとおもいます。", en: "I think she will not come.", ta: "அவள் வர மாட்டாள் என்று நினைக்கிறேன்.", hi: "मुझे लगता है वह नहीं आएगी।" }
    ],
    notes: "To express strong belief, use と思っています. For tentative opinion, just と思います.",
    jlpt_level: "N5",
    lesson_order: 39,
    tags: ["opinion", "belief", "N5"]
  },
  {
    id: "n5_g040",
    pattern: "〜そうです (hearsay)",
    structure: "Plain form + そうです",
    meaning_en: "I heard that ~ / They say that ~ (hearsay)",
    meaning_ta: "~ என்று கேள்விப்பட்டேன் (கேள்வி மூலம் தகவல்)",
    meaning_hi: "मैंने सुना है कि ~ / कहा जाता है कि ~ (सुनी-सुनाई बात)",
    explanation_en: "Reports information heard from others. Always in plain form before そうです. Different from そうです (appearance) which uses verb stem/adj stem.",
    explanation_ta: "மற்றவர்களிடமிருந்து கேட்ட தகவலை தெரிவிக்கிறது. そうです க்கு முன்பு எப்போதும் எளிய வடிவம். தோற்றத்தை குறிக்கும் そうです (வினை/பெயரடை தண்டு) வேறானது.",
    explanation_hi: "दूसरों से सुनी जानकारी बताता है। そうです से पहले plain form। दिखावट वाले そうです (क्रिया/विशेषण stem) से अलग।",
    examples: [
      { jp: "田中さんは来月結婚するそうです。", reading: "たなかさんはらいげつけっこんするそうです。", en: "I heard that Mr. Tanaka will get married next month.", ta: "தனாகா அடுத்த மாதம் திருமணம் செய்கிறார் என்று கேள்விப்பட்டேன்.", hi: "सुना है कि तनाका-सान अगले महीने शादी करेंगे।" },
      { jp: "明日は休みだそうです。", reading: "あしたはやすみだそうです。", en: "I heard that tomorrow is a holiday.", ta: "நாளை விடுமுறை என்று கேள்விப்பட்டேன்.", hi: "सुना है कि कल छुट्टी है।" },
      { jp: "あのレストランは美味しいそうです。", reading: "あのレストランはおいしいそうです。", en: "I heard that restaurant is delicious.", ta: "அந்த உணவகம் சுவையானது என்று கேள்விப்பட்டேன்.", hi: "सुना है कि वह रेस्तराँ स्वादिष्ट है।" }
    ],
    notes: "Don't confuse with 〜そうです (appearance): 美味しそうです (looks delicious) vs 美味しいそうです (I heard it's delicious).",
    jlpt_level: "N5",
    lesson_order: 40,
    tags: ["hearsay", "reported-speech", "N5"]
  },
  {
    id: "n5_g041",
    pattern: "〜時",
    structure: "Verb / Adjective plain form + 時 / Noun + の + 時",
    meaning_en: "When ~ / At the time of ~",
    meaning_ta: "~ நேரத்தில் / ~ போது",
    meaning_hi: "~ के समय / जब ~",
    explanation_en: "時 (とき) means 'time' or 'when'. Use verb dictionary form for future/habitual events, た-form for completed events.",
    explanation_ta: "時 (とき) 'நேரம்' அல்லது 'போது' என்று குறிக்கிறது. எதிர்காலம்/வழக்கமான நிகழ்வுகளுக்கு அகராதி வடிவம், முடிந்த நிகழ்வுகளுக்கு た வடிவம் பயன்படுத்தவும்.",
    explanation_hi: "時 (とき) 'समय' या 'जब' का अर्थ है। भविष्य/आदतन घटनाओं के लिए dictionary form, पूर्ण घटनाओं के लिए た-form।",
    examples: [
      { jp: "子供の時、よく公園で遊びました。", reading: "こどものとき、よくこうえんであそびました。", en: "When I was a child, I often played in the park.", ta: "குழந்தையாக இருந்தபோது, அடிக்கடி பூங்காவில் விளையாடினேன்.", hi: "बचपन में अक्सर पार्क में खेलता था।" },
      { jp: "日本に来た時、富士山を見ました。", reading: "にほんにきたとき、ふじさんをみました。", en: "When I came to Japan, I saw Mt. Fuji.", ta: "ஜப்பானுக்கு வந்தபோது, ஃபுஜி மலை பார்த்தேன்.", hi: "जापान आने पर माउंट फूजी देखा।" },
      { jp: "暇な時、映画を見ます。", reading: "ひまなとき、えいがをみます。", en: "When I have free time, I watch movies.", ta: "நேரம் இருக்கும்போது, திரைப்படம் பார்க்கிறேன்.", hi: "खाली समय में फिल्म देखता हूँ।" }
    ],
    notes: "Dictionary form + 時 = when (action not yet done). た form + 時 = when (after action is done).",
    jlpt_level: "N5",
    lesson_order: 41,
    tags: ["time", "when", "conjunction", "N5"]
  },
  {
    id: "n5_g042",
    pattern: "毎〜 (frequency words)",
    structure: "毎 + time noun",
    meaning_en: "Every ~ (daily, weekly, monthly etc.)",
    meaning_ta: "ஒவ்வொரு ~ (தினமும், வாரந்தோறும் போன்றவை)",
    meaning_hi: "हर ~ (रोज़, हफ्ते, महीने आदि)",
    explanation_en: "毎 (まい) means 'every'. Common forms: 毎日 (every day), 毎週 (every week), 毎月 (every month), 毎年 (every year), 毎朝 (every morning), 毎晩 (every evening).",
    explanation_ta: "毎 (まい) 'ஒவ்வொரு' என்று குறிக்கிறது. பொதுவான வடிவங்கள்: 毎日 (தினமும்), 毎週 (வாரந்தோறும்), 毎月 (மாதந்தோறும்), 毎年 (ஆண்டுதோறும்).",
    explanation_hi: "毎 (まい) 'हर' का अर्थ है। सामान्य रूप: 毎日 (हर रोज़), 毎週 (हर हफ्ते), 毎月 (हर महीने), 毎年 (हर साल)।",
    examples: [
      { jp: "毎日日本語を勉強します。", reading: "まいにちにほんごをべんきょうします。", en: "I study Japanese every day.", ta: "தினமும் ஜப்பானிய மொழி படிக்கிறேன்.", hi: "हर रोज़ जापानी पढ़ता हूँ।" },
      { jp: "毎週映画を見ます。", reading: "まいしゅうえいがをみます。", en: "I watch a movie every week.", ta: "வாரந்தோறும் திரைப்படம் பார்க்கிறேன்.", hi: "हर हफ्ते फिल्म देखता हूँ।" },
      { jp: "毎朝コーヒーを飲みます。", reading: "まいあさコーヒーをのみます。", en: "I drink coffee every morning.", ta: "ஒவ்வொரு காலையும் காபி குடிக்கிறேன்.", hi: "हर सुबह कॉफी पीता हूँ।" }
    ],
    notes: "毎年 can be read まいねん (formal) or まいとし (common).",
    jlpt_level: "N5",
    lesson_order: 42,
    tags: ["frequency", "time", "N5"]
  },
  {
    id: "n5_g043",
    pattern: "〜ごろ / 〜ぐらい",
    structure: "Time/Number + ごろ / ぐらい (くらい)",
    meaning_en: "Around ~ / About ~ (approximate time or quantity)",
    meaning_ta: "~ சுமார் / ~ வாக்கில் (தோராயமான நேரம் அல்லது அளவு)",
    meaning_hi: "लगभग ~ / करीब ~ (अनुमानित समय या मात्रा)",
    explanation_en: "ごろ is used for approximate points in time. ぐらい/くらい is used for approximate amounts or durations.",
    explanation_ta: "ごろ தோராயமான நேர புள்ளிகளுக்கு பயன்படுகிறது. ぐらい/くらい தோராயமான அளவு அல்லது காலத்திற்கு பயன்படுகிறது.",
    explanation_hi: "ごろ अनुमानित समय बिंदुओं के लिए। ぐらい/くらい अनुमानित मात्रा या अवधि के लिए।",
    examples: [
      { jp: "7時ごろ起きます。", reading: "しちじごろおきます。", en: "I wake up around 7 o'clock.", ta: "7 மணி வாக்கில் எழுந்திருக்கிறேன்.", hi: "लगभग 7 बजे उठता हूँ।" },
      { jp: "一時間ぐらい勉強しました。", reading: "いちじかんぐらいべんきょうしました。", en: "I studied for about one hour.", ta: "சுமார் ஒரு மணி நேரம் படித்தேன்.", hi: "लगभग एक घंटे पढ़ा।" },
      { jp: "来週ごろ、返事をします。", reading: "らいしゅうごろ、へんじをします。", en: "I will reply around next week.", ta: "அடுத்த வாரம் வாக்கில் பதில் சொல்கிறேன்.", hi: "अगले हफ्ते के करीब जवाब दूँगा।" }
    ],
    notes: "ごろ cannot be used with durations (wrong: 一時間ごろ). ぐらい can be used with both points and durations.",
    jlpt_level: "N5",
    lesson_order: 43,
    tags: ["approximation", "time", "quantity", "N5"]
  },
  {
    id: "n5_g044",
    pattern: "〜番目 (ordinal numbers)",
    structure: "Number + 番目",
    meaning_en: "~th / ~st / ~nd / ~rd (ordinal numbers)",
    meaning_ta: "முதலாவது, இரண்டாவது போன்ற வரிசை எண்கள்",
    meaning_hi: "पहला, दूसरा आदि क्रमसूचक संख्याएँ",
    explanation_en: "番目 makes ordinal numbers. 一番目 (first), 二番目 (second). In some contexts, 番目 is dropped: 一番 (number one/most).",
    explanation_ta: "番目 வரிசை எண்களை உருவாக்குகிறது. 一番目 (முதலாவது), 二番目 (இரண்டாவது).",
    explanation_hi: "番目 क्रमसूचक संख्याएँ बनाता है। 一番目 (पहला), 二番目 (दूसरा)।",
    examples: [
      { jp: "私は三番目に到着しました。", reading: "わたしはさんばんめにとうちゃくしました。", en: "I arrived third.", ta: "நான் மூன்றாவதாக வந்தேன்.", hi: "मैं तीसरे नंबर पर पहुँचा।" },
      { jp: "左から二番目の人が田中さんです。", reading: "ひだりからにばんめのひとがたなかさんです。", en: "The second person from the left is Mr. Tanaka.", ta: "இடமிருந்து இரண்டாவது நபர் தனாகா.", hi: "बाईं ओर से दूसरा व्यक्ति तनाका-सान है।" },
      { jp: "これが一番目の質問です。", reading: "これがいちばんめのしつもんです。", en: "This is the first question.", ta: "இது முதல் கேள்வி.", hi: "यह पहला सवाल है।" }
    ],
    notes: "For floors of a building, use 階 (かい): 三階 (third floor). For months, use 月 (がつ): 三月 (March, third month).",
    jlpt_level: "N5",
    lesson_order: 44,
    tags: ["numbers", "ordinal", "N5"]
  },
  {
    id: "n5_g045",
    pattern: "〜くらい / 〜ほど (degree)",
    structure: "Noun / Amount + くらい / ほど",
    meaning_en: "About ~ / To the extent of ~ (degree or comparison)",
    meaning_ta: "~ அளவு / ~ அளவிற்கு (அளவு அல்லது ஒப்பீடு)",
    meaning_hi: "~ जितना / ~ की हद तक (मात्रा या तुलना)",
    explanation_en: "Both express degree or extent. ほど is more formal and also used in comparisons: 〜ほど〜ない (not as ~ as).",
    explanation_ta: "இரண்டும் அளவு அல்லது நிலையை வெளிப்படுத்துகின்றன. ほど அதிக முறையான மற்றும் ஒப்பீடுகளில் பயன்படுகிறது.",
    explanation_hi: "दोनों मात्रा या सीमा व्यक्त करते हैं। ほど अधिक औपचारिक और तुलनाओं में उपयोग होता है।",
    examples: [
      { jp: "死ぬほど疲れました。", reading: "しぬほどつかれました。", en: "I was so tired I could die.", ta: "இறக்கும் அளவு களைத்துவிட்டேன்.", hi: "मैं इतना थक गया कि मरने जैसा लगा।" },
      { jp: "彼女ほど優しい人はいません。", reading: "かのじょほどやさしいひとはいません。", en: "There is no one as kind as her.", ta: "அவளைப் போல் அன்பான நபர் இல்லை.", hi: "उसके जितना親切 कोई नहीं है।" },
      { jp: "一時間くらい待ちました。", reading: "いちじかんくらいまちました。", en: "I waited for about an hour.", ta: "சுமார் ஒரு மணி நேரம் காத்திருந்தேன்.", hi: "लगभग एक घंटे इंतज़ार किया।" }
    ],
    notes: "〜ほど〜ない is a key N4/N3 pattern: 英語ほど難しくない (not as difficult as English).",
    jlpt_level: "N5",
    lesson_order: 45,
    tags: ["degree", "extent", "comparison", "N5"]
  },
  {
    id: "n5_g046",
    pattern: "あげる / もらう / くれる",
    structure: "Verb て-form + あげる / もらう / くれる",
    meaning_en: "Giving and receiving actions (directional verbs)",
    meaning_ta: "கொடுத்தல் மற்றும் பெறுதல் செயல்கள் (திசை வினைகள்)",
    meaning_hi: "देने और लेने की क्रियाएँ (दिशात्मक क्रियाएँ)",
    explanation_en: "あげる = give (to others), もらう = receive (from others), くれる = give (to me/my group). These determine the direction of giving.",
    explanation_ta: "あげる = கொடுக்கிறேன் (மற்றவர்களுக்கு), もらう = பெறுகிறேன் (மற்றவர்களிடமிருந்து), くれる = கொடுக்கிறார்கள் (என்னிடம்).",
    explanation_hi: "あげる = देना (दूसरों को), もらう = पाना (दूसरों से), くれる = देना (मुझे/मेरे समूह को)।",
    examples: [
      { jp: "友達にプレゼントをあげました。", reading: "ともだちにプレゼントをあげました。", en: "I gave a present to my friend.", ta: "நண்பருக்கு பரிசு கொடுத்தேன்.", hi: "दोस्त को उपहार दिया।" },
      { jp: "先生に本をもらいました。", reading: "せんせいにほんをもらいました。", en: "I received a book from my teacher.", ta: "ஆசிரியரிடமிருந்து புத்தகம் பெற்றேன்.", hi: "शिक्षक से किताब मिली।" },
      { jp: "母が手紙を書いてくれました。", reading: "ははがてがみをかいてくれました。", en: "My mother wrote a letter for me.", ta: "அம்மா எனக்காக கடிதம் எழுதினார்.", hi: "माँ ने मेरे लिए पत्र लिखा।" }
    ],
    notes: "The て-form versions (てあげる, てもらう, てくれる) describe doing an action as a favor. Direction is always key.",
    jlpt_level: "N5",
    lesson_order: 46,
    tags: ["giving", "receiving", "directional", "N5"]
  },
  {
    id: "n5_g047",
    pattern: "〜と言います",
    structure: "Quoted speech + と言います / と言いました",
    meaning_en: "Say that ~ / be called ~ (quoting or naming)",
    meaning_ta: "~ என்று சொல்கிறார்கள் / ~ என்று அழைக்கப்படுகிறது",
    meaning_hi: "~ कहते हैं / ~ कहा जाता है",
    explanation_en: "と言います quotes direct or indirect speech. Also used to say what something is called: 〜と言います means 'is called ~'.",
    explanation_ta: "と言います நேரடி அல்லது மறைமுக பேச்சை மேற்கோள் காட்டுகிறது. 〜と言います என்பது '~ என்று அழைக்கப்படுகிறது' என்றும் குறிக்கிறது.",
    explanation_hi: "と言います प्रत्यक्ष या अप्रत्यक्ष भाषण उद्धृत करता है। 〜と言います का अर्थ '~ कहलाता है' भी है।",
    examples: [
      { jp: "私の名前は田中と言います。", reading: "わたしのなまえはたなかといいます。", en: "My name is Tanaka (lit: I am called Tanaka).", ta: "என் பெயர் தனாகா என்று சொல்கிறோம்.", hi: "मेरा नाम तनाका है।" },
      { jp: "彼は「明日来ます」と言いました。", reading: "かれは「あしたきます」といいました。", en: "He said 'I will come tomorrow'.", ta: "அவர் 'நாளை வருகிறேன்' என்று சொன்னார்.", hi: "उसने कहा 'मैं कल आऊँगा'।" },
      { jp: "これは日本語で何と言いますか。", reading: "これはにほんごでなんといいますか。", en: "How do you say this in Japanese?", ta: "இதை ஜப்பானிய மொழியில் என்று சொல்கிறோம்?", hi: "इसे जापानी में क्या कहते हैं?" }
    ],
    notes: "と言っています (is saying/has said) vs と言いました (said): tense matters for the time of saying.",
    jlpt_level: "N5",
    lesson_order: 47,
    tags: ["quotation", "speech", "naming", "N5"]
  },
  {
    id: "n5_g048",
    pattern: "〜方 (〜かた)",
    structure: "Verb stem + 方",
    meaning_en: "The way of doing ~ / How to do ~",
    meaning_ta: "~ செய்யும் முறை / ~ செய்வது எப்படி",
    meaning_hi: "~ करने का तरीका / ~ कैसे करें",
    explanation_en: "方 (かた) attached to a verb stem means 'the way of doing' or 'how to do'. 食べ方 = the way of eating, 書き方 = how to write.",
    explanation_ta: "வினைத் தண்டில் 方 (かた) சேர்த்தால் 'செய்யும் முறை' அல்லது 'செய்வது எப்படி' என்று குறிக்கிறது.",
    explanation_hi: "क्रिया के stem पर 方 (かた) जोड़ने से 'करने का तरीका' का अर्थ मिलता है।",
    examples: [
      { jp: "この漢字の書き方を教えてください。", reading: "このかんじのかきかたをおしえてください。", en: "Please teach me how to write this kanji.", ta: "இந்த கஞ்சி எழுதும் முறையை கற்றுக்கொடுங்கள்.", hi: "यह कांजी कैसे लिखते हैं, बताइए।" },
      { jp: "納豆の食べ方が分かりません。", reading: "なっとうのたべかたがわかりません。", en: "I don't know how to eat natto.", ta: "நட்டோ எப்படி சாப்பிடுவது என்று தெரியவில்லை.", hi: "नट्टो कैसे खाते हैं, नहीं पता।" },
      { jp: "この電話の使い方を教えてもらえますか。", reading: "このでんわのつかいかたをおしえてもらえますか。", en: "Could you tell me how to use this phone?", ta: "இந்த தொலைபேசி பயன்படுத்தும் முறையை சொல்ல முடியுமா?", hi: "इस फ़ोन का उपयोग कैसे करें, बता सकते हैं?" }
    ],
    notes: "方 can also mean 'person' (honorific) or 'direction' depending on context and reading (かた vs ほう).",
    jlpt_level: "N5",
    lesson_order: 48,
    tags: ["method", "how-to", "N5"]
  },
  {
    id: "n5_g049",
    pattern: "〜すぎる",
    structure: "い-adj stem / な-adj stem / Verb stem + すぎる",
    meaning_en: "Too ~ / Excessively ~ (excess)",
    meaning_ta: "மிகவும் ~ / அதிகமாக ~ (அதிகம்)",
    meaning_hi: "बहुत ज़्यादा ~ / अत्यधिक ~ (अतिरेक)",
    explanation_en: "すぎる means 'too much' or 'excessively'. Attach to い-adj stem (remove い), な-adj stem, or verb stem (remove ます).",
    explanation_ta: "すぎる 'மிகவும்' அல்லது 'அதிகமாக' என்று குறிக்கிறது. い-பெயரடை தண்டு (い நீக்கவும்), な-பெயரடை தண்டு, அல்லது வினைத் தண்டில் சேர்க்கவும்.",
    explanation_hi: "すぎる 'बहुत ज़्यादा' या 'अत्यधिक' का अर्थ है। い-adj stem (い हटाएँ), な-adj stem, या verb stem (ます हटाएँ) पर जोड़ें।",
    examples: [
      { jp: "この料理は辛すぎます。", reading: "このりょうりはからすぎます。", en: "This dish is too spicy.", ta: "இந்த உணவு மிகவும் காரமாக இருக்கிறது.", hi: "यह व्यंजन बहुत तीखा है।" },
      { jp: "昨日、食べすぎました。", reading: "きのう、たべすぎました。", en: "I ate too much yesterday.", ta: "நேற்று மிகவும் அதிகமாக சாப்பிட்டேன்.", hi: "कल बहुत ज़्यादा खाया।" },
      { jp: "この服は私には大きすぎます。", reading: "このふくはわたしにはおおきすぎます。", en: "These clothes are too big for me.", ta: "இந்த உடை என்னுக்கு மிகவும் பெரியது.", hi: "यह कपड़े मेरे लिए बहुत बड़े हैं।" }
    ],
    notes: "すぎる conjugates like a regular る-verb: すぎます、すぎた、すぎて、etc.",
    jlpt_level: "N5",
    lesson_order: 49,
    tags: ["excess", "too-much", "N5"]
  },
  {
    id: "n5_g050",
    pattern: "〜やすい / 〜にくい",
    structure: "Verb stem + やすい / にくい",
    meaning_en: "Easy to do ~ / Hard to do ~ (ease or difficulty)",
    meaning_ta: "~ செய்வது எளிது / ~ செய்வது கஷ்டம்",
    meaning_hi: "~ करना आसान है / ~ करना मुश्किल है",
    explanation_en: "やすい means 'easy to do'. にくい means 'hard/difficult to do'. Both attach to the verb stem and conjugate like い-adjectives.",
    explanation_ta: "やすい 'செய்வது எளிது' என்று குறிக்கிறது. にくい 'செய்வது கஷ்டம்'. இரண்டும் வினைத் தண்டில் சேர்க்கப்படுகின்றன.",
    explanation_hi: "やすい 'करना आसान' का अर्थ है। にくい 'करना मुश्किल'। दोनों verb stem पर जोड़ते हैं।",
    examples: [
      { jp: "この本は読みやすいです。", reading: "このほんはよみやすいです。", en: "This book is easy to read.", ta: "இந்த புத்தகம் படிக்க எளிதானது.", hi: "यह किताब पढ़ने में आसान है।" },
      { jp: "漢字は書きにくいです。", reading: "かんじはかきにくいです。", en: "Kanji are hard to write.", ta: "கஞ்சி எழுதுவது கஷ்டமானது.", hi: "कांजी लिखना मुश्किल है।" },
      { jp: "この道は歩きやすいです。", reading: "このみちはあるきやすいです。", en: "This road is easy to walk on.", ta: "இந்த சாலை நடந்து போவதற்கு எளிதானது.", hi: "यह सड़क चलने में आसान है।" }
    ],
    notes: "Compare with 〜づらい (emotionally difficult/reluctant to do) which is slightly different from にくい (physically/practically hard).",
    jlpt_level: "N5",
    lesson_order: 50,
    tags: ["ease", "difficulty", "adjective", "N5"]
  },
  {
    id: "n5_g051",
    pattern: "〜ようです / 〜みたいです",
    structure: "Plain form + ようです / みたいです",
    meaning_en: "It seems that ~ / It looks like ~ (appearance/inference)",
    meaning_ta: "~ போல் தெரிகிறது / ~ மாதிரி இருக்கிறது (அனுமானம்)",
    meaning_hi: "लगता है कि ~ / ऐसा लगता है (अनुमान/दिखावट)",
    explanation_en: "Both express inference based on observation. ようです is more formal; みたいです is casual. Different from そうです (direct appearance).",
    explanation_ta: "இரண்டும் கவனிப்பின் அடிப்படையில் அனுமானத்தை வெளிப்படுத்துகின்றன. ようです மிகவும் முறையான வடிவம்; みたいです வழக்கு வடிவம்.",
    explanation_hi: "दोनों अवलोकन-आधारित अनुमान व्यक्त करते हैं। ようです औपचारिक; みたいです अनौपचारिक।",
    examples: [
      { jp: "彼女は疲れているようです。", reading: "かのじょはつかれているようです。", en: "She seems to be tired.", ta: "அவள் களைத்திருக்கிறாள் போல் தெரிகிறது.", hi: "वह थकी हुई लग रही है।" },
      { jp: "外は寒いみたいです。", reading: "そとはさむいみたいです。", en: "It looks like it's cold outside.", ta: "வெளியே குளிராக இருக்கிறது மாதிரி.", hi: "बाहर ठंड लग रही है।" },
      { jp: "電車が遅れているようです。", reading: "でんしゃがおくれているようです。", en: "It seems the train is delayed.", ta: "ரயில் தாமதமாகிறது போல் தெரிகிறது.", hi: "लगता है ट्रेन में देरी है।" }
    ],
    notes: "ようだ/みたいだ is inference from evidence you can see. そうだ (appearance) is from direct visual impression: 美味しそう (looks delicious).",
    jlpt_level: "N5",
    lesson_order: 51,
    tags: ["inference", "appearance", "N5"]
  },
  {
    id: "n5_g052",
    pattern: "〜かもしれません",
    structure: "Plain form + かもしれません / かもしれない",
    meaning_en: "Might ~ / Maybe ~ / Perhaps ~ (possibility)",
    meaning_ta: "~ ஆகலாம் / ஒருவேளை ~ (சாத்தியம்)",
    meaning_hi: "शायद ~ / हो सकता है ~ (संभावना)",
    explanation_en: "Expresses uncertainty and possibility — lower probability than でしょう. Plain form precedes it; な-adj and nouns drop だ before かもしれません.",
    explanation_ta: "நிச்சயமற்ற தன்மை மற்றும் சாத்தியத்தை வெளிப்படுத்துகிறது — でしょう ஐவிட குறைந்த நிகழ்தகவு.",
    explanation_hi: "अनिश्चितता और संभावना व्यक्त करता है — でしょう से कम संभावना।",
    examples: [
      { jp: "明日は雨が降るかもしれません。", reading: "あしたはあめがふるかもしれません。", en: "It might rain tomorrow.", ta: "நாளை மழை பெய்யலாம்.", hi: "कल बारिश हो सकती है।" },
      { jp: "彼女は知らないかもしれない。", reading: "かのじょはしらないかもしれない。", en: "She might not know.", ta: "அவளுக்கு தெரியாமல் இருக்கலாம்.", hi: "उसे पता नहीं हो सकता।" },
      { jp: "これは難しいかもしれませんが、頑張ります。", reading: "これはむずかしいかもしれませんが、がんばります。", en: "This might be difficult, but I'll do my best.", ta: "இது கஷ்டமாக இருக்கலாம், ஆனால் முயற்சிக்கிறேன்.", hi: "यह मुश्किल हो सकता है लेकिन कोशिश करूँगा।" }
    ],
    notes: "Uncertainty scale: かもしれない (maybe 50%) < でしょう (probably 70-80%) < はずです (should be, strong expectation).",
    jlpt_level: "N5",
    lesson_order: 52,
    tags: ["possibility", "uncertainty", "N5"]
  },
  {
    id: "n5_g053",
    pattern: "〜ながら",
    structure: "Verb stem + ながら",
    meaning_en: "While doing ~ (simultaneous actions)",
    meaning_ta: "~ செய்யும்போது (ஒரே நேரத்தில் இரண்டு செயல்கள்)",
    meaning_hi: "~ करते हुए (एक साथ दो क्रियाएँ)",
    explanation_en: "Indicates two actions happening at the same time by the same subject. The main action comes after ながら.",
    explanation_ta: "ஒரே நபரால் ஒரே நேரத்தில் நடக்கும் இரண்டு செயல்களை குறிக்கிறது. முக்கிய செயல் ながら க்கு பிறகு வருகிறது.",
    explanation_hi: "एक ही व्यक्ति द्वारा एक साथ दो क्रियाएँ होना दर्शाता है। मुख्य क्रिया ながら के बाद आती है।",
    examples: [
      { jp: "音楽を聴きながら勉強します。", reading: "おんがくをききながらべんきょうします。", en: "I study while listening to music.", ta: "இசை கேட்கும்போது படிக்கிறேன்.", hi: "संगीत सुनते हुए पढ़ता हूँ।" },
      { jp: "歩きながら話しましょう。", reading: "あるきながらはなしましょう。", en: "Let's talk while walking.", ta: "நடக்கும்போது பேசுவோம்.", hi: "चलते हुए बात करते हैं।" },
      { jp: "テレビを見ながらご飯を食べました。", reading: "テレビをみながらごはんをたべました。", en: "I ate while watching TV.", ta: "தொலைக்காட்சி பார்க்கும்போது சாப்பிட்டேன்.", hi: "टीवी देखते हुए खाया।" }
    ],
    notes: "ながら can also express concession: 知りながら言わなかった (knowing it, I didn't say anything). This is a higher-level usage.",
    jlpt_level: "N5",
    lesson_order: 53,
    tags: ["simultaneous", "while", "N5"]
  },
  {
    id: "n5_g054",
    pattern: "〜でも",
    structure: "Noun + でも / Question word + でも",
    meaning_en: "Even ~ / Any ~ (inclusive: even this, any at all)",
    meaning_ta: "~ கூட / எந்த ~ ஆவது (உள்ளடக்கம்)",
    meaning_hi: "~ भी / कोई भी ~ (समावेशी: यह भी, कोई भी)",
    explanation_en: "でも after a noun means 'even'. After question words (なん、どこ、だれ etc.) it means 'any': なんでも (anything), どこでも (anywhere), だれでも (anyone).",
    explanation_ta: "பெயர்ச்சொல்லுக்கு பிறகு でも 'கூட' என்று குறிக்கிறது. கேள்வி வார்த்தைகளுக்கு பிறகு 'எந்த ~ ஆவது': なんでも (எதுவும்), どこでも (எங்கும்).",
    explanation_hi: "संज्ञा के बाद でも 'भी' का अर्थ। प्रश्नवाचक शब्दों के बाद 'कोई भी': なんでも (कुछ भी), どこでも (कहीं भी)।",
    examples: [
      { jp: "子供でも分かる本です。", reading: "こどもでもわかるほんです。", en: "It is a book even a child can understand.", ta: "குழந்தைகளுக்கு கூட புரியும் புத்தகம்.", hi: "यह एक किताब है जो बच्चे भी समझ सकते हैं।" },
      { jp: "なんでも食べます。", reading: "なんでもたべます。", en: "I eat anything.", ta: "எதுவும் சாப்பிடுகிறேன்.", hi: "मैं कुछ भी खाता हूँ।" },
      { jp: "お茶でもどうですか。", reading: "おちゃでもどうですか。", en: "How about some tea (or something)?", ta: "தேயிலை (அல்லது ஏதாவது) எப்படி?", hi: "चाय वगैरह लेंगे?" }
    ],
    notes: "Noun + でも at the end of a sentence (お茶でもどうですか) softens the suggestion, like 'or something'.",
    jlpt_level: "N5",
    lesson_order: 54,
    tags: ["inclusive", "even", "any", "N5"]
  },
  {
    id: "n5_g055",
    pattern: "〜ために / 〜のために",
    structure: "Verb dictionary form + ために / Noun + のために",
    meaning_en: "In order to ~ / For the sake of ~ (purpose or benefit)",
    meaning_ta: "~ கோசம் / ~ நோக்கத்தில் (நோக்கம் அல்லது பயன்)",
    meaning_hi: "~ के लिए / ~ की खातिर (उद्देश्य या लाभ)",
    explanation_en: "ために expresses purpose (in order to do something) or benefit (for someone's sake). Verb form is always dictionary form.",
    explanation_ta: "ために நோக்கத்தை (ஏதாவது செய்வதற்காக) அல்லது பயனை (யாரோ ஒருவரின் நலனுக்காக) வெளிப்படுத்துகிறது.",
    explanation_hi: "ために उद्देश्य (कुछ करने के लिए) या लाभ (किसी की खातिर) व्यक्त करता है।",
    examples: [
      { jp: "日本語を勉強するために、毎日練習します。", reading: "にほんごをべんきょうするために、まいにちれんしゅうします。", en: "In order to study Japanese, I practice every day.", ta: "ஜப்பானிய மொழி படிப்பதற்கோசம், தினமும் பயிற்சி செய்கிறேன்.", hi: "जापानी पढ़ने के लिए हर रोज़ अभ्यास करता हूँ।" },
      { jp: "家族のために働いています。", reading: "かぞくのためにはたらいています。", en: "I am working for my family.", ta: "குடும்பத்திற்காக வேலை செய்கிறேன்.", hi: "परिवार के लिए काम कर रहा हूँ।" },
      { jp: "健康のために運動します。", reading: "けんこうのためにうんどうします。", en: "I exercise for my health.", ta: "உடல் ஆரோக்கியத்திற்காக உடற்பயிற்சி செய்கிறேன்.", hi: "सेहत के लिए व्यायाम करता हूँ।" }
    ],
    notes: "Compare with 〜のに (which expresses 'in spite of' or 'for the purpose of' in different contexts at higher levels).",
    jlpt_level: "N5",
    lesson_order: 55,
    tags: ["purpose", "benefit", "N5"]
  },
  {
    id: "n5_g056",
    pattern: "〜し〜し",
    structure: "Clause 1 + し、Clause 2 + し (〜し)",
    meaning_en: "And ~ and ~ (listing multiple reasons or qualities)",
    meaning_ta: "~ மட்டுமல்ல ~ (பல காரணங்கள் அல்லது குணங்களை பட்டியலிடுதல்)",
    meaning_hi: "~ भी ~ भी (कई कारण या गुण सूचीबद्ध करना)",
    explanation_en: "し lists multiple reasons or qualities, implying 'and also'. Softer than から for giving reasons. Often implies 'among other reasons'.",
    explanation_ta: "し பல காரணங்கள் அல்லது குணங்களை பட்டியலிடுகிறது. காரணம் கொடுப்பதில் から ஐவிட மென்மையானது.",
    explanation_hi: "し कई कारण या गुण सूचीबद्ध करता है। कारण देने में から से नरम।",
    examples: [
      { jp: "この街は安全だし、きれいだし、住みやすいです。", reading: "このまちはあんぜんだし、きれいだし、すみやすいです。", en: "This town is safe, it's clean, and it's easy to live in.", ta: "இந்த நகரம் பாதுகாப்பானது, சுத்தமானது, மற்றும் வாழ்வதற்கு எளிதானது.", hi: "यह शहर सुरक्षित है, साफ है, और रहने में आसान है।" },
      { jp: "彼は頭がいいし、優しいし、好きです。", reading: "かれはあたまがいいし、やさしいし、すきです。", en: "He's smart, he's kind — I like him.", ta: "அவர் புத்திசாலி, அன்பானவர் — பிடிக்கிறார்.", hi: "वह चालाक है, दयालु है — मुझे पसंद है।" },
      { jp: "お腹も空いたし、疲れたし、帰りましょう。", reading: "おなかもすいたし、つかれたし、かえりましょう。", en: "I'm hungry and tired, so let's go home.", ta: "பசிக்கிறது, களைக்கிறது, போவோம்.", hi: "भूख लगी है और थकान भी है, चलो घर चलते हैं।" }
    ],
    notes: "し implies there are other reasons not stated. When all reasons are explicitly listed, から or ので is more natural.",
    jlpt_level: "N5",
    lesson_order: 56,
    tags: ["reason", "listing", "conjunction", "N5"]
  },
  {
    id: "n5_g057",
    pattern: "〜たら",
    structure: "Verb / Adj た-form + ら",
    meaning_en: "If ~ / When ~ (conditional: once a condition is met)",
    meaning_ta: "~ ஆனால் / ~ ஆகும்போது (நிபந்தனை)",
    meaning_hi: "अगर ~ / जब ~ (शर्त: एक बार शर्त पूरी हो जाए)",
    explanation_en: "たら expresses a conditional: once A happens, B follows. More natural than と for hypothetical situations. Also used for 'when' in the past: 着いたら電話した (When I arrived, I called).",
    explanation_ta: "たら ஒரு நிபந்தனையை வெளிப்படுத்துகிறது: A நடந்தால், B தொடர்கிறது.",
    explanation_hi: "たら एक शर्त व्यक्त करता है: A होने पर B होगा।",
    examples: [
      { jp: "宿題が終わったら、遊びましょう。", reading: "しゅくだいがおわったら、あそびましょう。", en: "When you finish your homework, let's play.", ta: "வீட்டுப்பாடம் முடிந்தால், விளையாடுவோம்.", hi: "होमवर्क खत्म होने पर खेलते हैं।" },
      { jp: "春になったら、お花見をしましょう。", reading: "はるになったら、おはなみをしましょう。", en: "When spring comes, let's go flower-viewing.", ta: "வசந்த காலம் வந்தால், மலர்ப் பார்வை போவோம்.", hi: "वसंत आने पर फूल देखने चलते हैं।" },
      { jp: "困ったら、遠慮なく言ってください。", reading: "こまったら、えんりょなくいってください。", en: "If you're in trouble, please don't hesitate to say so.", ta: "சிரமப்பட்டால், தயங்காமல் சொல்லுங்கள்.", hi: "मुश्किल हो तो बेझिझक बताइए।" }
    ],
    notes: "Four main conditionals: と (automatic), ば (general condition), たら (once condition met), なら (based on information). たら is the most versatile.",
    jlpt_level: "N5",
    lesson_order: 57,
    tags: ["conditional", "if-when", "N5"]
  },
  {
    id: "n5_g058",
    pattern: "〜ば〜ほど",
    structure: "Verb ば-form / い-adj ければ + Verb/Adj + ほど",
    meaning_en: "The more ~ the more ~ (proportional increase)",
    meaning_ta: "~ எவ்வளவு ~ அவ்வளவு ~ (விகிதாசார அதிகரிப்பு)",
    meaning_hi: "जितना ~ उतना ~ (आनुपातिक वृद्धि)",
    explanation_en: "Expresses that as one thing increases, another increases proportionally. ば-form + same verb/adj + ほど + result.",
    explanation_ta: "ஒன்று அதிகரிக்க, மற்றொன்றும் விகிதாசாரமாக அதிகரிக்கும் என்று வெளிப்படுத்துகிறது.",
    explanation_hi: "व्यक्त करता है कि एक चीज़ बढ़ने पर दूसरी भी आनुपातिक रूप से बढ़ती है।",
    examples: [
      { jp: "練習すればするほど、上手になります。", reading: "れんしゅうすればするほど、じょうずになります。", en: "The more you practice, the better you become.", ta: "எவ்வளவு பயிற்சி செய்கிறீர்களோ, அவ்வளவு திறமையாவீர்கள்.", hi: "जितना अभ्यास करोगे उतना अच्छे बनोगे।" },
      { jp: "高ければ高いほど、品質がいいです。", reading: "たかければたかいほど、ひんしつがいいです。", en: "The more expensive it is, the better the quality.", ta: "எவ்வளவு விலை அதிகமோ, அவ்வளவு தரம் நல்லது.", hi: "जितना महँगा उतनी अच्छी गुणवत्ता।" },
      { jp: "知れば知るほど、日本語が面白くなります。", reading: "しればしるほど、にほんごがおもしろくなります。", en: "The more you know, the more interesting Japanese becomes.", ta: "எவ்வளவு அறிகிறீர்களோ, அவ்வளவு ஜப்பானிய மொழி சுவாரஸ்யமாகிறது.", hi: "जितना जानोगे उतनी जापानी दिलचस्प लगेगी।" }
    ],
    notes: "This pattern is technically N4 but appears in N5 textbooks. The ば-form (conditional) is key: 行く → 行けば, 食べる → 食べれば.",
    jlpt_level: "N5",
    lesson_order: 58,
    tags: ["proportional", "conditional", "comparison", "N5"]
  },
  {
    id: "n5_g059",
    pattern: "〜だけ",
    structure: "Noun / Verb plain form + だけ",
    meaning_en: "Only ~ / Just ~ (limit or restriction)",
    meaning_ta: "~ மட்டும் / ~ மட்டுமே (வரம்பு அல்லது கட்டுப்பாடு)",
    meaning_hi: "सिर्फ ~ / केवल ~ (सीमा या प्रतिबंध)",
    explanation_en: "だけ limits to only the stated amount or thing. Similar to しか + negative, but だけ has a neutral tone while しか is more emphatic/restrictive.",
    explanation_ta: "だけ குறிப்பிட்ட அளவு அல்லது பொருளுக்கு மட்டும் வரம்பிடுகிறது. しか + எதிர்மறை போன்றது ஆனால் だけ நடுநிலை.",
    explanation_hi: "だけ केवल बताई गई चीज़ तक सीमित करता है। しか + नकारात्मक जैसा लेकिन だけ तटस्थ।",
    examples: [
      { jp: "水だけ飲みます。", reading: "みずだけのみます。", en: "I only drink water.", ta: "தண்ணீர் மட்டும் குடிக்கிறேன்.", hi: "सिर्फ पानी पीता हूँ।" },
      { jp: "少しだけ待ってください。", reading: "すこしだけまってください。", en: "Please wait just a little.", ta: "கொஞ்சம் மட்டும் காத்திருங்கள்.", hi: "बस थोड़ा इंतज़ार करिए।" },
      { jp: "一回だけ見せてください。", reading: "いっかいだけみせてください。", en: "Please show me just once.", ta: "ஒரு முறை மட்டும் காட்டுங்கள்.", hi: "सिर्फ एक बार दिखाइए।" }
    ],
    notes: "しか requires a negative verb: 水しか飲みません (I drink nothing but water). だけ works with both positive and negative.",
    jlpt_level: "N5",
    lesson_order: 59,
    tags: ["limit", "only", "restriction", "N5"]
  },
  {
    id: "n5_g060",
    pattern: "〜しか〜ない",
    structure: "Noun / Amount + しか + Negative verb",
    meaning_en: "Nothing but ~ / Only ~ (with emphasis on insufficiency)",
    meaning_ta: "~ மட்டுமே ~ (குறைபாட்டை வலியுறுத்துதல்)",
    meaning_hi: "~ के सिवा कुछ नहीं / सिर्फ ~ (अपर्याप्तता पर जोर)",
    explanation_en: "しか must be followed by a negative verb. Implies the speaker feels the amount is insufficient or surprising. Stronger/more emotional than だけ.",
    explanation_ta: "しか க்கு பிறகு எதிர்மறை வினை தேவை. அளவு போதுமானதில்லை அல்லது ஆச்சரியமானது என்று குறிக்கிறது. だけ ஐவிட வலிமையானது.",
    explanation_hi: "しか के बाद नकारात्मक क्रिया ज़रूरी है। अर्थ: मात्रा अपर्याप्त या आश्चर्यजनक है। だけ से अधिक भावनात्मक।",
    examples: [
      { jp: "百円しかありません。", reading: "ひゃくえんしかありません。", en: "I only have 100 yen (and that's not enough).", ta: "100 யென் மட்டுமே இருக்கிறது.", hi: "सिर्फ 100 येन ही हैं (और वो भी काफी नहीं)।" },
      { jp: "日本語しか話せません。", reading: "にほんごしかはなせません。", en: "I can only speak Japanese (nothing else).", ta: "ஜப்பானிய மொழி மட்டுமே பேச முடியும்.", hi: "सिर्फ जापानी ही बोल सकता हूँ।" },
      { jp: "三人しか来ませんでした。", reading: "さんにんしかきませんでした。", en: "Only three people came (fewer than expected).", ta: "மூன்று பேர் மட்டுமே வந்தனர்.", hi: "सिर्फ तीन लोग आए (उम्मीद से कम)।" }
    ],
    notes: "Key difference: 水だけ飲む = I drink only water (neutral). 水しか飲まない = I drink nothing but water (implies dissatisfaction or surprise).",
    jlpt_level: "N5",
    lesson_order: 60,
    tags: ["limit", "only", "negative", "insufficiency", "N5"]
  }
];