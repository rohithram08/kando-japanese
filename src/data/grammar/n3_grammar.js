// ============================================
// N3 GRAMMAR (180 Points - Key Selection)
// ============================================

export const N3_GRAMMAR = [
  {
    id: "n3_g001",
    pattern: "〜わけではない",
    structure: "Plain form + わけではない／わけじゃない",
    meaning_en: "It doesn't mean that ~ / It's not that ~",
    meaning_ta: "~ என்று அர்த்தமில்லை / அப்படி இல்லை",
    meaning_hi: "ऐसा नहीं है कि ~ / इसका मतलब यह नहीं है कि ~",
    explanation_en: "Used to deny or partially deny an implication. Clarifies a misunderstanding or nuances a statement.",
    examples: [
      { jp: "嫌いなわけではないが、あまり食べない。", reading: "きらいなわけではないが、あまりたべない。", en: "It's not that I dislike it, I just don't eat much of it.", ta: "வெறுக்கிறேன் என்று அர்த்தமில்லை, ஆனால் அதிகமாக சாப்பிடுவதில்லை.", hi: "ऐसा नहीं है कि मुझे पसंद नहीं, बस ज़्यादा नहीं खाता।" },
      { jp: "難しいわけじゃないけど、時間がかかる。", reading: "むずかしいわけじゃないけど、じかんがかかる。", en: "It's not that it's difficult, it just takes time.", ta: "கடினம் என்று இல்லை, ஆனால் நேரம் ஆகுது.", hi: "मुश्किल नहीं है, बस समय लगता है।" }
    ],
    jlpt_level: "N3",
    lesson_order: 1
  },
  {
    id: "n3_g002",
    pattern: "〜にもかかわらず",
    structure: "Noun / Verb plain form + にもかかわらず",
    meaning_en: "Despite ~ / In spite of ~ / Nevertheless",
    meaning_ta: "~ இருந்தாலும் / இருப்பினும்",
    meaning_hi: "~ के बावजूद / ~ होते हुए भी",
    examples: [
      { jp: "雨にもかかわらず、試合は続けられた。", reading: "あめにもかかわらず、しあいはつづけられた。", en: "Despite the rain, the match continued.", ta: "மழை இருந்தாலும் போட்டி தொடர்ந்தது.", hi: "बारिश के बावजूद मैच जारी रहा।" }
    ],
    jlpt_level: "N3",
    lesson_order: 2
  },
  {
    id: "n3_g003",
    pattern: "〜に対して",
    structure: "Noun + に対して",
    meaning_en: "Towards ~ / Against ~ / In contrast to ~",
    meaning_ta: "~ க்கு நேராக / ~ க்கு எதிராக / ~ க்கு மாறாக",
    meaning_hi: "~ के प्रति / ~ के विरुद्ध / ~ के विपरीत",
    examples: [
      { jp: "先生の質問に対して答えました。", reading: "せんせいのしつもんにたいしてこたえました。", en: "I answered the teacher's question.", ta: "ஆசிரியரின் கேள்விக்கு பதில் அளித்தேன்.", hi: "शिक्षक के सवाल का जवाब दिया।" },
      { jp: "彼が賛成なのに対して、私は反対だ。", reading: "かれがさんせいなのにたいして、わたしははんたいだ。", en: "In contrast to him being in favor, I am opposed.", ta: "அவர் ஆதரிக்கிறார், ஆனால் நான் எதிர்க்கிறேன்.", hi: "उसके समर्थन के विपरीत, मैं विरोध में हूँ।" }
    ],
    jlpt_level: "N3",
    lesson_order: 3
  },
  {
    id: "n3_g004",
    pattern: "〜によって",
    structure: "Noun + によって",
    meaning_en: "By means of ~ / Depending on ~ / Due to ~",
    meaning_ta: "~ மூலம் / ~ பொறுத்து / ~ காரணமாக",
    meaning_hi: "~ के द्वारा / ~ के अनुसार / ~ के कारण",
    examples: [
      { jp: "この絵はピカソによって描かれました。", reading: "このえはピカソによってえがかれました。", en: "This painting was drawn by Picasso.", ta: "இந்த ஓவியம் பிக்காசோவால் வரையப்பட்டது.", hi: "यह चित्र पिकासो द्वारा बनाया गया था।" },
      { jp: "結果は努力によって変わる。", reading: "けっかはどりょくによってかわる。", en: "Results change depending on effort.", ta: "முயற்சியைப் பொறுத்து முடிவுகள் மாறும்.", hi: "परिणाम प्रयास के अनुसार बदलते हैं।" }
    ],
    jlpt_level: "N3",
    lesson_order: 4
  },
  {
    id: "n3_g005",
    pattern: "〜として",
    structure: "Noun + として",
    meaning_en: "As ~ / In the role/capacity of ~",
    meaning_ta: "~ ஆக / ~ ன் பங்கில்",
    meaning_hi: "~ के रूप में / ~ की भूमिका में",
    examples: [
      { jp: "医者として働いています。", reading: "いしゃとしてはたらいています。", en: "I work as a doctor.", ta: "மருத்துவராக வேலை செய்கிறேன்.", hi: "डॉक्टर के रूप में काम करता हूँ।" },
      { jp: "友達として彼女を助けたい。", reading: "ともだちとしてかのじょをたすけたい。", en: "I want to help her as a friend.", ta: "நண்பனாக அவளுக்கு உதவ விரும்புகிறேன்.", hi: "दोस्त के रूप में उसकी मदद करना चाहता हूँ।" }
    ],
    jlpt_level: "N3",
    lesson_order: 5
  },
  {
    id: "n3_g006",
    pattern: "〜ばかり",
    structure: "Verb た-form / Noun + ばかり",
    meaning_en: "Just did ~ (recently) / Only ~ / Nothing but ~",
    meaning_ta: "இப்போதுதான் ~ செய்தேன் / ~ மட்டுமே",
    meaning_hi: "अभी-अभी ~ किया / केवल ~ / ~ के अलावा कुछ नहीं",
    examples: [
      { jp: "今来たばかりです。", reading: "いまきたばかりです。", en: "I just arrived.", ta: "இப்போதுதான் வந்தேன்.", hi: "अभी-अभी आया हूँ।" },
      { jp: "彼はゲームばかりしている。", reading: "かれはゲームばかりしている。", en: "He does nothing but play games.", ta: "அவன் கேம் மட்டுமே விளையாடுகிறான்.", hi: "वह बस गेम ही खेलता रहता है।" }
    ],
    jlpt_level: "N3",
    lesson_order: 6
  },
  {
    id: "n3_g007",
    pattern: "〜さえ〜ば",
    structure: "Noun + さえ / Verb stem + さえすれば",
    meaning_en: "If only ~ / As long as ~ (minimum condition)",
    meaning_ta: "~ மட்டும் இருந்தால் போதும்",
    meaning_hi: "अगर बस ~ हो जाए / ~ ही काफी है",
    examples: [
      { jp: "お金さえあれば何でも買える。", reading: "おかねさえあればなんでもかえる。", en: "If only I had money, I could buy anything.", ta: "பணம் மட்டும் இருந்தால் எதுவும் வாங்கலாம்.", hi: "पैसे होते तो कुछ भी खरीद सकता था।" },
      { jp: "健康でさえあれば幸せだ。", reading: "けんこうでさえあればしあわせだ。", en: "As long as I'm healthy, I'm happy.", ta: "ஆரோக்கியமாக இருந்தால் மட்டும் போதும், மகிழ்ச்சியாக இருப்பேன்.", hi: "बस स्वस्थ रहूँ तो खुश हूँ।" }
    ],
    jlpt_level: "N3",
    lesson_order: 7
  },
  {
    id: "n3_g008",
    pattern: "〜ものの",
    structure: "Plain form + ものの",
    meaning_en: "Although ~ / Even though ~ (but the result is unexpected)",
    meaning_ta: "~ என்றாலும் / ~ இருந்தாலும் (எதிர்பாராத முடிவு)",
    meaning_hi: "हालाँकि ~ / भले ही ~ (पर परिणाम अप्रत्याशित)",
    examples: [
      { jp: "日本語を勉強したものの、まだ話せない。", reading: "にほんごをべんきょうしたものの、まだはなせない。", en: "Although I studied Japanese, I still can't speak it.", ta: "ஜப்பானிய மொழி படித்தாலும், இன்னும் பேச முடியவில்லை.", hi: "जापानी पढ़ी तो, पर अभी भी बोल नहीं पाता।" }
    ],
    jlpt_level: "N3",
    lesson_order: 8
  },
  {
    id: "n3_g009",
    pattern: "〜だけでなく〜も",
    structure: "Noun / Plain form + だけでなく ~ も",
    meaning_en: "Not only ~ but also ~",
    meaning_ta: "~ மட்டுமல்ல, ~ கூட",
    meaning_hi: "~ ही नहीं, बल्कि ~ भी",
    examples: [
      { jp: "彼女は英語だけでなく、日本語も話せます。", reading: "かのじょはえいごだけでなく、にほんごもはなせます。", en: "She can speak not only English but also Japanese.", ta: "அவள் ஆங்கிலம் மட்டுமல்ல, ஜப்பானிய மொழியும் பேசலாம்.", hi: "वह सिर्फ अंग्रेज़ी ही नहीं, बल्कि जापानी भी बोल सकती है।" }
    ],
    jlpt_level: "N3",
    lesson_order: 9
  },
  {
    id: "n3_g010",
    pattern: "〜てしまう",
    structure: "Verb て-form + しまう／ちゃう (casual)",
    meaning_en: "Completely finish / Accidentally do / Regrettably do",
    meaning_ta: "முழுவதும் முடித்துவிடு / தற்செயலாக செய்துவிடு / வருத்தத்துடன் செய்",
    meaning_hi: "पूरी तरह कर लेना / गलती से करना / अफ़सोस के साथ करना",
    examples: [
      { jp: "宿題をやってしまいました。", reading: "しゅくだいをやってしまいました。", en: "I finished my homework (completely).", ta: "வீட்டுப்பாடம் முழுவதும் முடித்துவிட்டேன்.", hi: "मैंने होमवर्क पूरा कर लिया।" },
      { jp: "財布を忘れちゃった。", reading: "さいふをわすれちゃった。", en: "I accidentally forgot my wallet!", ta: "பர்ஸை மறந்துவிட்டேன்!", hi: "मैं पर्स भूल गया!" }
    ],
    jlpt_level: "N3",
    lesson_order: 10
  },
  {
    id: "n3_g011",
    pattern: "〜ことになっている",
    structure: "Verb plain form + ことになっている",
    meaning_en: "It has been decided that ~ / It is expected that ~ (rule/schedule)",
    meaning_ta: "~ என்று முடிவாகியுள்ளது / ~ என்று எதிர்பார்க்கப்படுகிறது",
    meaning_hi: "~ तय हो गया है / ~ की उम्मीद है (नियम/कार्यक्रम)",
    examples: [
      { jp: "明日会議があることになっています。", reading: "あしたかいぎがあることになっています。", en: "There is supposed to be a meeting tomorrow.", ta: "நாளை கூட்டம் இருப்பதாக முடிவாகியுள்ளது.", hi: "कल बैठक होने की उम्मीद है।" },
      { jp: "ここでは靴を脱ぐことになっている。", reading: "ここではくつをぬぐことになっている。", en: "The rule here is that you take off your shoes.", ta: "இங்கே காலணி கழற்றவேண்டும் என்று விதி இருக்கிறது.", hi: "यहाँ जूते उतारने का नियम है।" }
    ],
    jlpt_level: "N3",
    lesson_order: 11
  },
  {
    id: "n3_g012",
    pattern: "〜わけがない",
    structure: "Plain form + わけがない／わけはない",
    meaning_en: "There is no way that ~ / Cannot possibly ~",
    meaning_ta: "~ ஆக முடியாது / ~ ஆவது சாத்தியமில்லை",
    meaning_hi: "~ हो ही नहीं सकता / ~ की कोई संभावना नहीं",
    examples: [
      { jp: "彼がそんなことを言うわけがない。", reading: "かれがそんなことをいうわけがない。", en: "There is no way he would say such a thing.", ta: "அவர் அப்படி சொல்வார் என்று நம்பவே முடியாது.", hi: "वह ऐसा कह ही नहीं सकता।" }
    ],
    jlpt_level: "N3",
    lesson_order: 12
  },
  {
    id: "n3_g013",
    pattern: "〜ところ",
    structure: "Verb various forms + ところ",
    meaning_en: "Just about to ~ / In the middle of ~ / Just finished ~",
    meaning_ta: "இப்போது ~ செய்யப்போகிறேன் / ~ செய்துகொண்டிருக்கிறேன் / ~ இப்போதுதான் முடித்தேன்",
    meaning_hi: "~ करने वाला हूँ / ~ कर रहा हूँ / अभी-अभी ~ किया",
    explanation_en: "Dictionary form + ところ = about to do. ている + ところ = in the middle of doing. た + ところ = just finished doing.",
    examples: [
      { jp: "今から出かけるところです。", reading: "いまからでかけるところです。", en: "I am about to go out now.", ta: "இப்போது கிளம்பப் போகிறேன்.", hi: "अभी निकलने वाला हूँ।" },
      { jp: "ご飯を食べているところです。", reading: "ごはんをたべているところです。", en: "I am in the middle of eating.", ta: "இப்போது சாப்பிட்டுக்கொண்டிருக்கிறேன்.", hi: "अभी खाना खा रहा हूँ।" },
      { jp: "今来たところです。", reading: "いまきたところです。", en: "I just arrived.", ta: "இப்போதுதான் வந்தேன்.", hi: "अभी-अभी आया हूँ।" }
    ],
    jlpt_level: "N3",
    lesson_order: 13
  },
  {
    id: "n3_g014",
    pattern: "〜とともに",
    structure: "Noun / Verb dictionary form + とともに",
    meaning_en: "Together with ~ / As ~ / Along with ~",
    meaning_ta: "~ உடன் / ~ ஆகும்போது / ~ ஆவதுடன்",
    meaning_hi: "~ के साथ-साथ / ~ के साथ",
    examples: [
      { jp: "時代の変化とともに、技術も進歩した。", reading: "じだいのへんかとともに、ぎじゅつもしんぽした。", en: "Along with the changes of the era, technology also advanced.", ta: "காலத்தின் மாற்றத்துடன், தொழில்நுட்பமும் முன்னேறியது.", hi: "समय के बदलाव के साथ-साथ तकनीक भी आगे बढ़ी।" }
    ],
    jlpt_level: "N3",
    lesson_order: 14
  },
  {
    id: "n3_g015",
    pattern: "〜に加えて",
    structure: "Noun + に加えて",
    meaning_en: "In addition to ~ / On top of ~",
    meaning_ta: "~ கூடுதலாக / ~ மேலும்",
    meaning_hi: "~ के अलावा / ~ के ऊपर से",
    examples: [
      { jp: "雨に加えて、風も強かった。", reading: "あめにくわえて、かぜもつよかった。", en: "In addition to rain, the wind was also strong.", ta: "மழை கூடுதலாக காற்றும் வலுவாக இருந்தது.", hi: "बारिश के अलावा, हवा भी तेज़ थी।" }
    ],
    jlpt_level: "N3",
    lesson_order: 15
  }
];