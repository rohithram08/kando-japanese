// scripts/curriculum-expansion/grammarData.js

export const N4_GRAMMAR_EXPANSIONS = [
  {
    id: "n4_g016",
    pattern: "〜受身（〜られる／〜れる）",
    romaji: "~rareru / ~reru",
    structure: "Group 1: u -> areru | Group 2: ru -> rareru | Group 3: sareru / korareru",
    meaning_en: "Passive voice (be done by someone / suffer from action)",
    meaning_ta: "செயப்பாட்டு வினை (பிறரால் செய்யப்படுதல்)",
    meaning_hi: "कर्मवाच्य (किसी के द्वारा किया जाना)",
    explanation_en: "Used when the subject receives an action from another person. In Japanese, 'suffering passive' (迷惑の受身) is often used when an action negatively affects the speaker.",
    explanation_ta: "ஒரு செயல் பிறரால் செய்யப்படும் போது அல்லது அதனால் பாதிப்பு ஏற்படும் போது பயன்படுகிறது.",
    explanation_hi: "जब कर्ता किसी अन्य व्यक्ति द्वारा की गई क्रिया का प्रभाव प्राप्त करता है।",
    examples: [
      { jp: "雨に降られました。", reading: "あめにふられました。", en: "I got rained on.", ta: "மழையில் நனைந்துவிட்டேன்.", hi: "मुझ पर बारिश गिर गई (भीग गया)।" },
      { jp: "先生に褒められました。", reading: "せんせいにほめられました。", en: "I was praised by the teacher.", ta: "ஆசிரியரால் பாராட்டப்பட்டேன்.", hi: "शिक्षक द्वारा मेरी प्रशंसा की गई।" }
    ],
    notes: "Particle に marks the agent/doer in passive sentences.",
    jlpt_level: "N4",
    lesson_order: 16,
    tags: ["passive", "verb-conjugation", "N4"]
  },
  {
    id: "n4_g017",
    pattern: "〜使役（〜させる／〜せる）",
    romaji: "~saseru / ~seru",
    structure: "Group 1: u -> aseru | Group 2: ru -> saseru | Group 3: saseru / kosaseru",
    meaning_en: "Causative voice (make / let someone do)",
    meaning_ta: "பிறவினை (ஒருவரை செய்ய வைத்தல் / அனுமதித்தல்)",
    meaning_hi: "प्रेरणार्थक क्रिया (किसी से करवाना / अनुमति देना)",
    explanation_en: "Expresses making someone do something (force) or letting someone do something (permission).",
    explanation_ta: "ஒருவரை ஒரு காரியத்தை செய்ய வைப்பது அல்லது செய்ய அனுமதிப்பதை குறிக்கிறது.",
    explanation_hi: "किसी से कोई काम करवाना या करने की अनुमति देना दर्शाता है।",
    examples: [
      { jp: "母は弟に野菜を食べさせました。", reading: "ははおとうとにやさいをたべさせました。", en: "Mother made my little brother eat vegetables.", ta: "அம்மா தம்பியை காய்கறி சாப்பிட வைத்தார்.", hi: "माँ ने छोटे भाई को सब्ज़ियाँ खिलाईं।" },
      { jp: "子供に好きな本を読ませます。", reading: "こどもにすきなほんをよませます。", en: "I let the child read their favorite book.", ta: "குழந்தையை பிடித்த புத்தகத்தை படிக்க அனுமதிக்கிறேன்.", hi: "बच्चे को मनपसंद किताब पढ़ने देता हूँ।" }
    ],
    notes: "Use with ていただく to politely ask permission: 休ませていただけますか (May I take a day off?)",
    jlpt_level: "N4",
    lesson_order: 17,
    tags: ["causative", "verb-conjugation", "N4"]
  },
  {
    id: "n4_g018",
    pattern: "〜使役受身（〜させられる）",
    romaji: "~saserareru / ~sareru",
    structure: "Causative stem + られる (or Group 1 shortened: ~される)",
    meaning_en: "Causative-Passive (be forced / made to do against one's will)",
    meaning_ta: "கட்டாயப்படுத்தப்பட்டு செய்தல் (விருப்பமின்றி செய்தல்)",
    meaning_hi: "मजबूर होकर करना (अनिच्छा से काम करना)",
    explanation_en: "Combines causative and passive to express being coerced or forced into doing something you did not want to do.",
    explanation_ta: "விருப்பமில்லாத ஒரு செயலை பிறரால் வற்புறுத்தப்பட்டு செய்யும் போது பயன்படுகிறது.",
    explanation_hi: "जब किसी काम को बिना इच्छा के दबाव में आकर करना पड़े।",
    examples: [
      { jp: "お酒を飲まされました。", reading: "おさけをのまされました。", en: "I was forced to drink alcohol.", ta: "மது அருந்த கட்டாயப்படுத்தப்பட்டேன்.", hi: "मुझे शराब पीने पर मजबूर किया गया।" },
      { jp: "宿題をたくさんさせられました。", reading: "しゅくだいをたくさんさせられました。", en: "I was made to do a lot of homework.", ta: "நிறைய வீட்டுப்பாடம் செய்ய வைக்கப்பட்டேன்.", hi: "मुझसे बहुत सारा गृहकार्य करवाया गया।" }
    ],
    notes: "Group 1 verbs usually use shortened form: 待たされる (forced to wait) instead of 待たせられる.",
    jlpt_level: "N4",
    lesson_order: 18,
    tags: ["causative-passive", "verb-conjugation", "N4"]
  },
  {
    id: "n4_g019",
    pattern: "〜てしまう",
    romaji: "~te shimau",
    structure: "Verb て-form + しまう (casual: 〜ちゃう / 〜じゃう)",
    meaning_en: "To finish completely / to do regretfully or accidentally",
    meaning_ta: "முழுமையாக முடித்துவிடுதல் / தவறுதலாக செய்துவிடுதல் (வருத்தம்)",
    meaning_hi: "पूरी तरह समाप्त करना / गलती या पछतावे से हो जाना",
    explanation_en: "Has two distinct nuances: 1) Complete completion of an action, and 2) Regret or dismay over an unintended result.",
    explanation_ta: "1) ஒரு செயலை முழுமையாக முடித்தல், 2) எதிர்பாராமல் அல்லது தவறுதலாக நடந்துவிட்ட வருத்தம்.",
    explanation_hi: "1) किसी काम का पूरी तरह खत्म होना, 2) किसी अनचाही घटना का पछतावा।",
    examples: [
      { jp: "宿題を全部やってしまいました。", reading: "しゅくだいをぜんぶやってしまいました。", en: "I finished all of my homework completely.", ta: "வீட்டுப்பாடம் முழுவதையும் முடித்துவிட்டேன்.", hi: "मैंने पूरा गृहकार्य समाप्त कर लिया।" },
      { jp: "財布を落としてしまいました。", reading: "さいふをおとしてしまいました。", en: "I unfortunately dropped my wallet.", ta: "பணப்பையை தவறவிட்டுவிட்டேன்.", hi: "मेरा बटुआ गिर गया (पछतावा)।" }
    ],
    notes: "In casual spoken Japanese: 食べてしまう -> 食べちゃう, 飲んでしまう -> 飲んじゃう.",
    jlpt_level: "N4",
    lesson_order: 19,
    tags: ["aspect", "te-form", "regret", "N4"]
  },
  {
    id: "n4_g020",
    pattern: "〜ておく",
    romaji: "~te oku",
    structure: "Verb て-form + おく (casual: 〜とく)",
    meaning_en: "Do something in advance / prepare ahead / leave as is",
    meaning_ta: "முன்கூட்டியே தயார் செய்து வைத்தல் / அப்படியே விட்டுவைத்தல்",
    meaning_hi: "पहले से तैयारी करके रखना / वैसा ही छोड़ देना",
    explanation_en: "Indicates doing an action beforehand in preparation for the future, or leaving a current state undisturbed.",
    explanation_ta: "எதிர்கால தேவைக்காக ஒரு காரியத்தை முன்கூட்டியே செய்து வைப்பதை குறிக்கிறது.",
    explanation_hi: "भविष्य की सुविधा के लिए पहले से ही कुछ करके रखना।",
    examples: [
      { jp: "旅行の前にホテルを予約しておきます。", reading: "りょこうのまえにホテルをよやくしておきます。", en: "I will book the hotel in advance before the trip.", ta: "பயணத்திற்கு முன் ஹோட்டலை முன்பதிவு செய்து வைக்கிறேன்.", hi: "यात्रा से पहले होटल बुक करके रखूँगा।" },
      { jp: "窓を開けておいてください。", reading: "まどをあけておいてください。", en: "Please leave the window open.", ta: "ஜன்னலை திறந்து வையுங்கள்.", hi: "कृपया खिड़की खुली रहने दें।" }
    ],
    notes: "Casual contraction: 買っておく -> 買っとく.",
    jlpt_level: "N4",
    lesson_order: 20,
    tags: ["preparation", "te-form", "N4"]
  },
  {
    id: "n4_g021",
    pattern: "〜てみる",
    romaji: "~te miru",
    structure: "Verb て-form + みる",
    meaning_en: "Try doing something to see what it's like",
    meaning_ta: "செய்து பார்த்தல் (எப்படி இருக்கிறது என்று தெரிந்துகொள்ள)",
    meaning_hi: "करके देखना (अनुभव के लिए प्रयास करना)",
    explanation_en: "Used when attempting an action to test or experience the result.",
    explanation_ta: "ஒரு அனுபவத்தை அல்லது முடிவை அறிந்துகொள்ள முயற்சி செய்து பார்ப்பது.",
    explanation_hi: "किसी कार्य का अनुभव लेने के लिए उसे आज़माना।",
    examples: [
      { jp: "日本の納豆を食べてみたいです。", reading: "にほんのなっとうをたべてみたいです。", en: "I want to try eating Japanese natto.", ta: "ஜப்பானிய நாட்டோவை சாப்பிட்டு பார்க்க விரும்புகிறேன்.", hi: "मैं जापानी नट्टो खाकर देखना चाहता हूँ।" },
      { jp: "この服を着てみてもいいですか。", reading: "このふくをきてみてもいいですか。", en: "May I try on these clothes?", ta: "இந்த உடையை அணிந்து பார்க்கலாமா?", hi: "क्या मैं यह कपड़ा पहनकर देख सकता हूँ?" }
    ],
    notes: "Literally means 'do and see'.",
    jlpt_level: "N4",
    lesson_order: 21,
    tags: ["trial", "te-form", "N4"]
  },
  {
    id: "n4_g022",
    pattern: "〜てある",
    romaji: "~te aru",
    structure: "Transitive Verb て-form + ある (Subject marked with が)",
    meaning_en: "Has been done intentionally (and the state remains)",
    meaning_ta: "செய்து வைக்கப்பட்டுள்ளது (திட்டமிட்டு செய்யப்பட்ட நிலை)",
    meaning_hi: "करके रखा हुआ है (उद्देश्यपूर्ण अवस्था बनी हुई है)",
    explanation_en: "Used with transitive verbs to show that someone intentionally performed an action and its result currently persists.",
    explanation_ta: "யாரோ ஒருவர் திட்டமிட்டு செய்து முடித்த நிலை நீடிப்பதைக் காட்டுகிறது.",
    explanation_hi: "किसी उद्देश्य से किया गया कार्य जिसकी स्थिति अभी भी मौजूद है।",
    examples: [
      { jp: "黒板に名前が書いてあります。", reading: "こくばんになまえがかいてあります。", en: "Names are written on the blackboard.", ta: "கரும்பலகையில் பெயர் எழுதப்பட்டுள்ளது.", hi: "ब्लैकबोर्ड पर नाम लिखा हुआ है।" },
      { jp: "カレンダーに予定が書いてあります。", reading: "カレンダーによていがかいてあります。", en: "The schedule is written on the calendar.", ta: "நாட்காட்டியில் திட்டம் குறிக்கப்பட்டுள்ளது.", hi: "कैलेंडर पर कार्यक्रम लिखा हुआ है।" }
    ],
    notes: "Compare with ている (intransitive natural state): ドアが開いている vs ドアが開けてある.",
    jlpt_level: "N4",
    lesson_order: 22,
    tags: ["state", "te-form", "transitive", "N4"]
  },
  {
    id: "n4_g023",
    pattern: "〜やすい／〜にくい",
    romaji: "~yasui / ~nikui",
    structure: "Verb stem + やすい (easy) / にくい (hard)",
    meaning_en: "Easy to do / hard to do",
    meaning_ta: "செய்வதற்கு எளிது / செய்வதற்கு கடினம்",
    meaning_hi: "करने में आसान / करने में कठिन",
    explanation_en: "Attached to the verb stem (masu-stem). Turns the verb into an i-adjective describing ease or difficulty.",
    explanation_ta: "வினைச்சொல் அடிவேருடன் இணைந்து ஒரு செயலை செய்வது எளிதா அல்லது கடினமா என்பதை விவரிக்கிறது.",
    explanation_hi: "क्रिया के तने से जुड़कर कार्य की सुगमता या कठिनाई बताता है।",
    examples: [
      { jp: "このペンはとても書きやすいです。", reading: "このペンはとてもかきやすいです。", en: "This pen is very easy to write with.", ta: "இந்த பேனாவில் எழுதுவது மிகவும் எளிது.", hi: "इस पेन से लिखना बहुत आसान है।" },
      { jp: "この漢字は覚えにくいです。", reading: "このかんじはおぼえにくいです。", en: "This kanji is difficult to remember.", ta: "இந்த கான்ஜியை நினைவில் கொள்வது கடினம்.", hi: "यह कांजी याद रखना मुश्किल है।" }
    ],
    notes: "Conjugates like an i-adjective: 書きやすかった (was easy to write).",
    jlpt_level: "N4",
    lesson_order: 23,
    tags: ["adjective", "verb-stem", "N4"]
  },
  {
    id: "n4_g024",
    pattern: "〜すぎる",
    romaji: "~sugiru",
    structure: "Verb stem / Adj stem + すぎる",
    meaning_en: "Too much / excessively",
    meaning_ta: "அளவுக்கு அதிகமாக / மிதமிஞ்சிய",
    meaning_hi: "बहुत अधिक / ज़रूरत से ज़्यादा",
    explanation_en: "Indicates doing an action or having a quality beyond a desirable or normal limit.",
    explanation_ta: "இயல்பான வரம்பை தாண்டி அதிகமாக இருப்பதை அல்லது செய்வதை குறிக்கிறது.",
    explanation_hi: "किसी सीमा या आवश्यकता से अधिक होना दर्शाता है।",
    examples: [
      { jp: "昨日、食べすぎました。", reading: "きのう、たべすぎました。", en: "I ate too much yesterday.", ta: "நேற்று அளவுக்கு அதிகமாக சாப்பிட்டுவிட்டேன்.", hi: "कल मैंने बहुत ज़्यादा खा लिया।" },
      { jp: "この問題は難しすぎます。", reading: "このもんだいはむずかしすぎます。", en: "This problem is too difficult.", ta: "இந்த கேள்வி மிகவும் கடினமாக உள்ளது.", hi: "यह सवाल बहुत ज़्यादा मुश्किल है।" }
    ],
    notes: "Conjugates as a Group 2 verb: 食べすぎない, 食べすぎた.",
    jlpt_level: "N4",
    lesson_order: 24,
    tags: ["excess", "verb-stem", "N4"]
  },
  {
    id: "n4_g025",
    pattern: "〜かもしれない",
    romaji: "~kamoshirenai",
    structure: "Plain form (な-adj/Noun without だ) + かもしれない",
    meaning_en: "Might / may / possibly (50% or less certainty)",
    meaning_ta: "இருக்கலாம் / கூடும் (சாத்தியக்கூறு)",
    meaning_hi: "हो सकता है / शायद",
    explanation_en: "Expresses conjecture with lower probability than でしょう/だろう. In casual speech, contracted to かも.",
    explanation_ta: "உறுதியற்ற சாத்தியக்கூறை வெளிப்படுத்த பயன்படுகிறது. வழக்கு பேச்சில் 'காமோ' என்று சுருங்கும்.",
    explanation_hi: "संभावना व्यक्त करता है जहाँ निश्चितता कम होती है।",
    examples: [
      { jp: "明日は雨が降るかもしれません。", reading: "あしたはあめがふるかもしれません。", en: "It might rain tomorrow.", ta: "நாளை மழை பெய்யக்கூடும்.", hi: "कल शायद बारिश हो सकती है।" },
      { jp: "彼は病気かもしれません。", reading: "かれはびょうきかもしれません。", en: "He might be sick.", ta: "அவருக்கு உடம்பு சரியில்லாமல் இருக்கலாம்.", hi: "वह शायद बीमार हो सकता है।" }
    ],
    notes: "Casual form: 明日行くかも (I might go tomorrow).",
    jlpt_level: "N4",
    lesson_order: 25,
    tags: ["conjecture", "probability", "N4"]
  },
  {
    id: "n4_g026",
    pattern: "〜はずだ",
    romaji: "~hazu da",
    structure: "Plain form (な-adj + な, Noun + の) + はずだ",
    meaning_en: "Should be / supposed to be (strong expectation based on facts)",
    meaning_ta: "இருக்க வேண்டும் / நிச்சயிக்கப்பட்டது (காரணத்துடன் கூடிய எதிர்பார்ப்பு)",
    meaning_hi: "होना चाहिए / ऐसा होना तय है",
    explanation_en: "Expresses a high degree of confidence that something should happen based on logical reasoning or reliable facts.",
    explanation_ta: "தகவல்கள் அல்லது தர்க்கத்தின் அடிப்படையில் நிச்சயம் நடக்கும் என்ற எதிர்பார்ப்பை குறிக்கிறது.",
    explanation_hi: "तथ्यों और तर्क के आधार पर पक्का विश्वास कि ऐसा होना चाहिए।",
    examples: [
      { jp: "田中さんはもう着いたはずです。", reading: "たなかさんはもうついたはずです。", en: "Mr. Tanaka should have arrived already.", ta: "தனாகா இந்நேரம் வந்து சேர்ந்திருக்க வேண்டும்.", hi: "तनाका-सान अब तक पहुँच चुके होने चाहिए।" },
      { jp: "鍵はカバンの中にあるはずだ。", reading: "かぎはカバンのなかにあるはずだ。", en: "The key should be inside the bag.", ta: "சாவி பையினுள் இருக்க வேண்டும்.", hi: "चाबी बैग के अंदर होनी चाहिए।" }
    ],
    notes: "Negative: 〜はずがない (There's no way that ~).",
    jlpt_level: "N4",
    lesson_order: 26,
    tags: ["expectation", "logic", "N4"]
  },
  {
    id: "n4_g027",
    pattern: "〜つもりだ",
    romaji: "~tsumori da",
    structure: "Verb dictionary form / Verb ない-form + つもりだ",
    meaning_en: "Plan to / intend to (personal intention)",
    meaning_ta: "திட்டம் / எண்ணம் கொண்டுள்ளேன்",
    meaning_hi: "इरादा है / योजना है",
    explanation_en: "Used to declare one's own intention or decision. Not usually used to ask superiors about their plans.",
    explanation_ta: "தனது சொந்த முடிவை அல்லது திட்டத்தை அறிவிக்க பயன்படுகிறது.",
    explanation_hi: "अपने स्वयं के इरादे या योजना को व्यक्त करने के लिए।",
    examples: [
      { jp: "来年、日本へ行くつもりです。", reading: "らいねん、にほんへいくつもりです。", en: "I plan to go to Japan next year.", ta: "அடுத்த ஆண்டு ஜப்பான் செல்ல திட்டமிட்டுள்ளேன்.", hi: "अगले साल जापान जाने का इरादा है।" },
      { jp: "タバコをやめるつもりです。", reading: "タバコをやめるつもりです。", en: "I intend to quit smoking.", ta: "புகைப்பிடிப்பதை கைவிட எண்ணியுள்ளேன்.", hi: "धूम्रपान छोड़ने का इरादा है।" }
    ],
    notes: "Negative intention: 行かないつもり (plan not to go) or 行くつもりはない (have no plan to go).",
    jlpt_level: "N4",
    lesson_order: 27,
    tags: ["intention", "plan", "N4"]
  },
  {
    id: "n4_g028",
    pattern: "〜そうだ（伝聞）",
    romaji: "~sou da (denbun)",
    structure: "Plain form (Noun/な-adj + だ) + そうだ",
    meaning_en: "I heard that ~ / they say that ~ (hearsay)",
    meaning_ta: "கேள்விப்பட்டேன் / என்று சொல்கிறார்கள்",
    meaning_hi: "सुना है कि ~ / कहते हैं कि ~",
    explanation_en: "Conveys information heard from another source without personal conjecture.",
    explanation_ta: "பிறரிடமிருந்து கேட்ட செய்தியை அப்படியே மற்றவர்களுக்கு தெரிவிக்க பயன்படுகிறது.",
    explanation_hi: "किसी अन्य स्रोत से सुनी हुई जानकारी को दूसरों तक पहुँचाने के लिए।",
    examples: [
      { jp: "明日は雪が降るそうです。", reading: "あしたはゆきがふるそうです。", en: "I heard it will snow tomorrow.", ta: "நாளை பனிப்பொழிவு இருக்கும் என்று கேள்விப்பட்டேன்.", hi: "सुना है कल बर्फबारी होगी।" },
      { jp: "あの店のラーメンは美味しいそうです。", reading: "あのみせのラーメンはおいしいそうです。", en: "They say the ramen at that shop is delicious.", ta: "அந்த கடையின் ராமன் சுவையாக இருக்கும் என்று சொல்கிறார்கள்.", hi: "कहते हैं उस दुकान का रेमन स्वादिष्ट है।" }
    ],
    notes: "Different from stem+そうだ (looks like): 美味しそうだ (looks tasty) vs 美味しいそうだ (I heard it's tasty).",
    jlpt_level: "N4",
    lesson_order: 28,
    tags: ["hearsay", "reporting", "N4"]
  },
  {
    id: "n4_g029",
    pattern: "〜し〜し",
    romaji: "~shi ~shi",
    structure: "Plain form + し",
    meaning_en: "Not only... but also... / and what's more (listing reasons)",
    meaning_ta: "மட்டுமின்றி... மேலும்... (காரணங்களை வரிசைப்படுத்துதல்)",
    meaning_hi: "न केवल... बल्कि... और तो और (कारण गिनाना)",
    explanation_en: "Lists two or more reasons or states that lead to a conclusion.",
    explanation_ta: "இரண்டு அல்லது அதற்கு மேற்பட்ட காரணங்களை ஒன்றன் பின் ஒன்றாக அடுக்க பயன்படுகிறது.",
    explanation_hi: "एक से अधिक कारणों को प्रस्तुत करने के लिए।",
    examples: [
      { jp: "この店は安いし、美味しいし、いつも混んでいます。", reading: "このみせやすいし、おいしいし、いつもこんでいます。", en: "This restaurant is cheap, delicious, and always crowded.", ta: "இந்த கடை விலை குறைவு, சுவையானது, அதனால் எப்போதும் கூட்டம்.", hi: "यह दुकान सस्ती भी है, स्वादिष्ट भी, इसलिए हमेशा भीड़ रहती है।" },
      { jp: "頭も痛いし、熱もあるし、今日は休みます。", reading: "あたまもいたいし、ねつもあるし、きょうはやすみます。", en: "I have a headache and a fever, so I will rest today.", ta: "தலைவலியும் உள்ளது, காய்ச்சலும் உள்ளது, அதனால் இன்று ஓய்வெடுக்கிறேன்.", hi: "सिरदर्द भी है और बुखार भी, इसलिए आज छुट्टी लूँगा।" }
    ],
    notes: "Often combined with particle も instead of が/を.",
    jlpt_level: "N4",
    lesson_order: 29,
    tags: ["listing", "reasons", "conjunction", "N4"]
  },
  {
    id: "n4_g030",
    pattern: "〜たら",
    romaji: "~tara",
    structure: "Verb/Adj past plain form + ら",
    meaning_en: "If / when (conditional with sequential emphasis)",
    meaning_ta: "செய்தால் / செய்யும் போது",
    meaning_hi: "अगर / जब (शर्त या क्रम)",
    explanation_en: "The most flexible conditional in Japanese. Expresses 'if X happens' or 'when X is finished, then Y'.",
    explanation_ta: "ஜப்பானிய மொழியின் பொதுவான நிபந்தனை வடிவம். 'செய்தால்' அல்லது 'செய்து முடித்த பிறகு' என்பதை குறிக்கும்.",
    explanation_hi: "जापानी भाषा का सबसे बहुमुखी शर्त रूप। 'अगर' या 'के बाद' दर्शाता है।",
    examples: [
      { jp: "駅に着いたら、電話してください。", reading: "えきについたら、でんわしてください。", en: "When you arrive at the station, please call me.", ta: "நிலையம் வந்து சேர்ந்ததும் எனக்கு போன் செய்யுங்கள்.", hi: "स्टेशन पहुँचने पर कृपया मुझे कॉल करें।" },
      { jp: "安かったら、買います。", reading: "やすかったら、かいます。", en: "If it is cheap, I will buy it.", ta: "விலை குறைவாக இருந்தால் வாங்குவேன்.", hi: "अगर सस्ता होगा तो खरीदूँगा।" }
    ],
    notes: "Can be followed by requests, suggestions, and commands (unlike 〜と).",
    jlpt_level: "N4",
    lesson_order: 30,
    tags: ["conditional", "temporal", "N4"]
  }
];

export const N3_GRAMMAR_EXPANSIONS = [
  {
    id: "n3_g016",
    pattern: "〜わけがない",
    romaji: "~wake ga nai",
    structure: "Plain form (な-adj + な, Noun + の) + わけがない",
    meaning_en: "There is no way that ~ / It is impossible that ~",
    meaning_ta: "வாய்ப்பே இல்லை / நடப்பது சாத்தியமில்லை",
    meaning_hi: "ऐसा होने का कोई सवाल ही नहीं / असंभव है",
    explanation_en: "Expresses a strong conviction that something is completely impossible based on reason or evidence.",
    explanation_ta: "காரணம் அல்லது ஆதாரத்தின் அடிப்படையில் ஒன்று நடக்க வாய்ப்பே இல்லை என்று உறுதியாக கூறுவது.",
    explanation_hi: "तर्क के आधार पर पूरी तरह असंभव होने का पक्का दावा।",
    examples: [
      { jp: "彼が嘘をつくわけがありません。", reading: "かれがうそをつくわけがありません。", en: "There is no way he would tell a lie.", ta: "அவர் பொய் சொல்ல வாய்ப்பே இல்லை.", hi: "वह झूठ बोले, इसका कोई सवाल ही नहीं।" },
      { jp: "こんな難しい試験に合格できるわけがない。", reading: "こんなむずかしいしけんにごうかくできるわけがない。", en: "There is no way I could pass such a difficult exam.", ta: "இவ்வளவு கடினமான தேர்வில் தேர்ச்சி பெற வாய்ப்பே இல்லை.", hi: "इतनी कठिन परीक्षा पास करने का सवाल ही नहीं उठता।" }
    ],
    notes: "Synonymous with 〜はずがない.",
    jlpt_level: "N3",
    lesson_order: 16,
    tags: ["conviction", "impossibility", "N3"]
  },
  {
    id: "n3_g017",
    pattern: "〜わけにはいかない",
    romaji: "~wake ni wa ikanai",
    structure: "Verb dictionary form / Verb ない-form + わけにはいかない",
    meaning_en: "Cannot afford to / must not / cannot bring oneself to do",
    meaning_ta: "அப்படி செய்ய முடியாது (சமூக/ஒழுக்க நெறிமுறைகளால்)",
    meaning_hi: "ऐसा नहीं कर सकते (नैतिक या सामाजिक कारणों से)",
    explanation_en: "Expresses that one cannot do an action due to moral, social, or psychological reasons, even if one wants to.",
    explanation_ta: "விருப்பம் இருந்தாலும் சமூக ஒழுக்கம் அல்லது பொறுப்பு காரணமாக செய்ய முடியாது என்பதை குறிக்கிறது.",
    explanation_hi: "इच्छा होने पर भी कर्तव्य या नियमों के कारण वैसा न कर पाना।",
    examples: [
      { jp: "明日は大事な会議があるので、休むわけにはいきません。", reading: "あしたはだいじなかいぎがあるので、やすむわけにはいきません。", en: "Since there is an important meeting tomorrow, I cannot afford to take a day off.", ta: "நாளை முக்கிய கூட்டம் உள்ளதால் விடுப்பு எடுக்க முடியாது.", hi: "कल ज़रूरी बैठक है, इसलिए छुट्टी नहीं ले सकता।" },
      { jp: "約束したから、行かないわけにはいかない。", reading: "やくそくしたから、いかないわけにはいかない。", en: "Since I promised, I simply must go (cannot not go).", ta: "வாக்குறுதி அளித்ததால் போகாமல் இருக்க முடியாது.", hi: "वादा किया है, तो जाना ही पड़ेगा।" }
    ],
    notes: "〜ないわけにはいかない means 'have no choice but to do'.",
    jlpt_level: "N3",
    lesson_order: 17,
    tags: ["obligation", "modality", "N3"]
  },
  {
    id: "n3_g018",
    pattern: "〜に違いない",
    romaji: "~ni chigainai",
    structure: "Plain form (な-adj / Noun without だ) + に違いない",
    meaning_en: "Must be / bound to be / definitely is",
    meaning_ta: "நிச்சயமாக இருக்க வேண்டும் / சந்தேகமில்லை",
    meaning_hi: "पक्का यही होना चाहिए / इसमें कोई संदेह नहीं",
    explanation_en: "Expresses strong, intuitive certainty without doubt.",
    explanation_ta: "சந்தேகத்திற்கு இடமின்றி உறுதியாக நம்புவதை வெளிப்படுத்துகிறது.",
    explanation_hi: "बिना किसी संशय के दृढ़ विश्वास व्यक्त करता है।",
    examples: [
      { jp: "犯人は彼に違いない。", reading: "はんにんはかれにちがいない。", en: "The culprit must definitely be him.", ta: "குற்றவாளி நிச்சயமாக அவனாகத்தான் இருக்க வேண்டும்.", hi: "अपराधी पक्का वही होना चाहिए।" },
      { jp: "あれだけの努力をしたのだから、合格するに違いない。", reading: "あれだけのどりょくをしたのだから、ごうかくするにちがいない。", en: "Having made that much effort, she will certainly pass.", ta: "அவ்வளவு உழைத்திருப்பதால் நிச்சயம் தேர்ச்சி பெறுவாள்.", hi: "इतनी मेहनत की है तो पक्का पास होगी।" }
    ],
    notes: "More subjective and personal than 〜はずだ.",
    jlpt_level: "N3",
    lesson_order: 18,
    tags: ["certainty", "conjecture", "N3"]
  },
  {
    id: "n3_g019",
    pattern: "〜わりに（は）",
    romaji: "~wari ni (wa)",
    structure: "Plain form (な-adj + な, Noun + の) + わりに（は）",
    meaning_en: "Considering that ~ / for a ~ (unexpected proportion)",
    meaning_ta: "~ உடன் ஒப்பிடும்போது எதிர்பார்த்ததை விட வேறுபட்டது",
    meaning_hi: "~ के हिसाब से / अपेक्षा से भिन्न",
    explanation_en: "Expresses that the outcome is surprising given the premise or standard.",
    explanation_ta: "ஒரு குறிப்பிட்ட நிலைக்கு வழக்கமாக எதிர்பார்க்கப்படும் முடிவுக்கு மாறாக இருப்பதை குறிக்கிறது.",
    explanation_hi: "किसी मानक की तुलना में अप्रत्याशित परिणाम को दर्शाता है।",
    examples: [
      { jp: "この料理は値段のわりに美味しい。", reading: "このりょうりはねだんのわりにおいしい。", en: "Considering its price, this dish is very delicious.", ta: "இதன் விலையுடன் ஒப்பிடும்போது இந்த உணவு மிகவும் சுவையானது.", hi: "कीमत के हिसाब से यह खाना बहुत स्वादिष्ट है।" },
      { jp: "彼は勉強しなかったわりには良い点を取った。", reading: "かれはべんきょうしなかったわりにはいいてんをとった。", en: "Considering he didn't study, he got good marks.", ta: "அவன் படிக்காததை ஒப்பிடும் போது நல்ல மதிப்பெண் பெற்றுள்ளான்.", hi: "बिना पढ़ाई किए भी उसने अच्छे अंक पाए।" }
    ],
    notes: "Focuses on the ratio or balance between expectation and reality.",
    jlpt_level: "N3",
    lesson_order: 19,
    tags: ["contrast", "comparison", "N3"]
  },
  {
    id: "n3_g020",
    pattern: "〜くせに",
    romaji: "~kuse ni",
    structure: "Plain form (な-adj + な, Noun + の) + くせに",
    meaning_en: "Even though / despite the fact that (expressing blame/criticism)",
    meaning_ta: "~ இருந்தும் கூட (குறை கூறுதல் / ஏளனம்)",
    meaning_hi: "~ होने के बावजूद (शिकायत या ताना मारना)",
    explanation_en: "Used like のに, but carries a strong tone of criticism, irritation, or contempt. Subject of both clauses must be the same.",
    explanation_ta: "எதிர்பார்ப்புக்கு மாறாக நடக்கும் போது ஏளனமாக அல்லது கோபமாக குறை கூற பயன்படுகிறது.",
    explanation_hi: "शिकायत या आलोचना का भाव लिए हुए 'बावजूद'।",
    examples: [
      { jp: "自分で何も言わないくせに、文句ばかり言う。", reading: "じぶんでなにもいわないくせに、もんくばかりいう。", en: "Even though he doesn't say anything himself, he does nothing but complain.", ta: "தான் எதுவும் செய்யாத போதும் எப்போதும் குறை மட்டுமே கூறுகிறான்.", hi: "खुद कुछ नहीं करता, फिर भी सिर्फ शिकायतें करता है।" },
      { jp: "お金がないくせに、高い車を買った。", reading: "おかねがないくせに、たかいくるまをかった。", en: "Even though he has no money, he bought an expensive car.", ta: "பணம் இல்லாத போதிலும் விலையுயர்ந்த கார் வாங்கினான்.", hi: "पैसे नहीं हैं, फिर भी महँगी कार खरीद ली।" }
    ],
    notes: "Cannot be used to refer to oneself or to praise someone.",
    jlpt_level: "N3",
    lesson_order: 20,
    tags: ["criticism", "contrast", "N3"]
  },
  {
    id: "n3_g021",
    pattern: "〜たびに",
    romaji: "~tabi ni",
    structure: "Verb dictionary form / Noun + の + たびに",
    meaning_en: "Each time ~ / whenever ~",
    meaning_ta: "ஒவ்வொரு முறையும் ~ செய்யும் போது",
    meaning_hi: "हर बार जब ~ / जब भी ~",
    explanation_en: "Expresses that whenever event A occurs, event B always follows.",
    explanation_ta: "ஒரு செயல் நடக்கும் போதெல்லாம் மற்றொன்று தொடர்வதை குறிக்கிறது.",
    explanation_hi: "जब भी पहली क्रिया होती है, दूसरी क्रिया हमेशा दोहराई जाती है।",
    examples: [
      { jp: "この曲を聴くたびに、学生時代を思い出す。", reading: "このきょくをきくたびに、がくせいじだいをおもいだす。", en: "Every time I hear this song, I remember my student days.", ta: "இந்த பாடலை கேட்கும் போதெல்லாம் எனது பள்ளி நாட்கள் நினைவுக்கு வருகிறது.", hi: "यह गाना जब भी सुनता हूँ, छात्र जीवन याद आ जाता है।" },
      { jp: "旅行のたびに、お土産を買います。", reading: "りょこうのたびに、おみやげをかいます。", en: "Whenever I travel, I buy souvenirs.", ta: "பயணம் செய்யும் போதெல்லாம் நினைவுப் பரிசு வாங்குவேன்.", hi: "जब भी यात्रा पर जाता हूँ, स्मृति-चिह्न खरीदता हूँ।" }
    ],
    notes: "Cannot be used for everyday natural cycles like 'every morning I wake up'.",
    jlpt_level: "N3",
    lesson_order: 21,
    tags: ["frequency", "temporal", "N3"]
  },
  {
    id: "n3_g022",
    pattern: "〜ついでに",
    romaji: "~tsuide ni",
    structure: "Verb dictionary/past / Noun + の + ついでに",
    meaning_en: "While doing A, take the opportunity to also do B",
    meaning_ta: "~ செய்யும் வழியிலேயே / அந்த வாய்ப்பைப் பயன்படுத்தி",
    meaning_hi: "~ करते समय लगे हाथ / मौके का फायदा उठाकर",
    explanation_en: "Indicates doing a secondary action B while in the middle of performing primary action A.",
    explanation_ta: "முக்கிய காரியத்தை செய்யும் போதே கூடவே மற்றொரு சிறிய வேலையையும் சேர்த்து செய்வது.",
    explanation_hi: "मुख्य कार्य करते हुए लगे हाथ दूसरा काम भी निपटा लेना।",
    examples: [
      { jp: "散歩のついでに、手紙を出してきた。", reading: "さんぽのついでに、てがみをだしてきた。", en: "While out for a walk, I mailed the letter.", ta: "நடைப்பயிற்சி சென்ற வழியிலேயே கடிதத்தையும் தபாலில் போட்டேன்.", hi: "टहलने के साथ-साथ लगे हाथ खत भी डाक में डाल आया।" },
      { jp: "コンビニに行くついでに、牛乳を買ってきて。", reading: "コンビニにいくついでに、ぎゅうにゅうをかってきて。", en: "While you're going to the convenience store, please buy some milk.", ta: "கடக்கு செல்லும் வழியிலேயே பாலும் வாங்கி வா.", hi: "दुकान जा ही रहे हो तो लगे हाथ दूध भी लेते आना।" }
    ],
    notes: "A is the main planned action; B is a convenient bonus action.",
    jlpt_level: "N3",
    lesson_order: 22,
    tags: ["opportunity", "action", "N3"]
  },
  {
    id: "n3_g023",
    pattern: "〜最中に（〜さいちゅうに）",
    romaji: "~saichuu ni",
    structure: "Verb ている / Noun + の + 最中に",
    meaning_en: "Right in the middle of (an action unexpectedly interrupted)",
    meaning_ta: "நடுவில் இருக்கும் போது (திடீர் இடையூறு)",
    meaning_hi: "ऐन बीच में (अचानक बाधा आना)",
    explanation_en: "Emphasizes that something unexpected happened exactly while an ongoing action was taking place.",
    explanation_ta: "ஒரு செயல் நடந்துகொண்டிருக்கும் போதே எதிர்பாராத ஒன்று குறுக்கிடுவதை குறிக்கும்.",
    explanation_hi: "किसी कार्य के ऐन बीच में अप्रत्याशित घटना का घट जाना।",
    examples: [
      { jp: "食事の最中に、電話がかかってきた。", reading: "しょくじのさいちゅうに、でんわがかかってきた。", en: "Right in the middle of a meal, the phone rang.", ta: "சாப்பிட்டுக்கொண்டிருக்கும் நடுவிலேயே போன் வந்தது.", hi: "खाना खाने के ऐन बीच में फोन बज उठा।" },
      { jp: "会議の最中に、停電が起きた。", reading: "かいぎのさいちゅうに、ていでんがおきた。", en: "Right in the middle of the meeting, a power outage occurred.", ta: "கூட்டம் நடந்துகொண்டிருந்த போதே மின்சாரம் துண்டிக்கப்பட்டது.", hi: "बैठक के बीच में ही बिजली चली गई।" }
    ],
    notes: "Often paired with sudden events: 地震, 電話, 停電.",
    jlpt_level: "N3",
    lesson_order: 23,
    tags: ["timing", "interruption", "N3"]
  },
  {
    id: "n3_g024",
    pattern: "〜たとたん（に）",
    romaji: "~ta totan (ni)",
    structure: "Verb た-form + とたん（に）",
    meaning_en: "Just as soon as ~ / the moment that ~ (instant surprise)",
    meaning_ta: "செய்த அடுத்த கணமே / உடனே",
    meaning_hi: "जैसे ही ~ वैसे ही (तुरंत बाद आश्चर्य)",
    explanation_en: "Expresses that immediately after action A occurred, an unexpected situation B took place.",
    explanation_ta: "ஒரு செயல் முடிந்த அடுத்த நொடியே எதிர்பாராத மற்றொரு நிகழ்வு ஏற்படுவது.",
    explanation_hi: "एक क्रिया के समाप्त होते ही तुरंत अगली अप्रत्याशित घटना का होना।",
    examples: [
      { jp: "窓を開けたとたん、強い風が入ってきた。", reading: "まどをあけたとたん、つよいかぜがはいってきた。", en: "The moment I opened the window, a strong wind rushed in.", ta: "ஜன்னலை திறந்த அடுத்த நொடியே பலத்த காற்று வீசியது.", hi: "खिड़की खोलते ही तेज़ हवा अंदर आ गई।" },
      { jp: "立ち上がったとたんに、めまいがした。", reading: "たちあがったとたんに、めまいがした。", en: "The instant I stood up, I felt dizzy.", ta: "எழுந்து நின்ற உடனேயே தலை சுற்றியது.", hi: "खड़े होते ही चक्कर आ गया।" }
    ],
    notes: "The following clause cannot be speaker's intention, request, or command.",
    jlpt_level: "N3",
    lesson_order: 24,
    tags: ["timing", "immediate", "N3"]
  },
  {
    id: "n3_g025",
    pattern: "〜おかげで",
    romaji: "~okage de",
    structure: "Plain form (な-adj + な, Noun + の) + おかげで",
    meaning_en: "Thanks to ~ / owing to ~ (positive outcome)",
    meaning_ta: "~ தயவால் / உதவியால் (நல்ல முடிவு)",
    meaning_hi: "~ की कृपा से / की बदौलत (सकारात्मक परिणाम)",
    explanation_en: "Expresses gratitude for a positive result brought about by someone or something.",
    explanation_ta: "ஒரு நன்மையான முடிவு யாரால் அல்லது எதனால் கிடைத்தது என்பதற்கு நன்றி தெரிவிக்கும் பாணியில் கூறுவது.",
    explanation_hi: "सकारात्मक परिणाम के लिए किसी व्यक्ति या परिस्थिति के प्रति आभार।",
    examples: [
      { jp: "先生のおかげで、試験に合格できました。", reading: "せんせいのおかげで、しけんにごうかくできました。", en: "Thanks to the teacher, I was able to pass the exam.", ta: "ஆசிரியரின் தயவால் தேர்வில் வெற்றி பெற்றேன்.", hi: "शिक्षक की बदौलत मैं परीक्षा पास कर सका।" },
      { jp: "薬を飲んだおかげで、すっかり良くなりました。", reading: "くすりをのんだおかげで、すっかりよくなりました。", en: "Thanks to taking the medicine, I recovered completely.", ta: "மருந்து சாப்பிட்டதால் முற்றிலும் குணமாகிவிட்டேன்.", hi: "दवा लेने से पूरी तरह ठीक हो गया।" }
    ],
    notes: "Opposite of せいで (blame for negative outcome). Can occasionally be used sarcastically.",
    jlpt_level: "N3",
    lesson_order: 25,
    tags: ["cause", "gratitude", "N3"]
  }
];

export const N2_GRAMMAR_EXPANSIONS = [
  {
    id: "n2g021",
    pattern: "〜に際して",
    romaji: "~ni saishite",
    structure: "Noun / Verb dictionary form + に際して",
    meaning_en: "On the occasion of / prior to / when doing (formal)",
    meaning_ta: "~ செய்யும் தருணத்தில் / தொடங்கும் முன்பாக",
    meaning_hi: "~ के अवसर पर / ~ करने से पहले (औपचारिक)",
    explanation_en: "Formal expression used when beginning an important, official, or special event.",
    explanation_ta: "முக்கியமான அல்லது அதிகாரப்பூர்வ நிகழ்வை தொடங்கும் போது பயன்படுத்தப்படும் முறைசார்ந்த சொல்.",
    explanation_hi: "किसी महत्वपूर्ण या औपचारिक आयोजन की शुरुआत में प्रयुक्त।",
    examples: [
      { jp: "新しい事業を始めるに際して、綿密な計画を立てた。", reading: "あたらしいじぎょうをはじめるにさいして、めんみつなけいかくをたてた。", en: "On the occasion of launching the new enterprise, we made meticulous plans.", ta: "புதிய தொழிலைத் தொடங்கும் தருணத்தில் விரிவான திட்டம் வகுத்தோம்.", hi: "नया व्यवसाय शुरू करने के अवसर पर विस्तृत योजना बनाई।" }
    ],
    notes: "Very formal; frequently seen in business announcements and speeches.",
    jlpt_level: "N2",
    lesson_order: 21,
    tags: ["formal", "occasion", "N2"]
  },
  {
    id: "n2g022",
    pattern: "〜を契機に（して）",
    romaji: "~o keiki ni (shite)",
    structure: "Noun + を契機に（して）",
    meaning_en: "Taking the opportunity of / as a turning point / prompted by",
    meaning_ta: "~ ஐ ஒரு திருப்புமுனையாகக் கொண்டு / தூண்டுதலாகக் கொண்டு",
    meaning_hi: "~ को एक मोड़ मानकर / से प्रेरित होकर",
    explanation_en: "Indicates that an event served as the catalyst or turning point for a significant positive or historical change.",
    explanation_ta: "ஒரு குறிப்பிட்ட நிகழ்வு ஒரு பெரிய மாற்றத்திற்கான தொடக்கப்புள்ளியாக அமைந்தது என்பதை விவரிக்கிறது.",
    explanation_hi: "किसी घटना को बड़े बदलाव के अवसर या मोड़ के रूप में उपयोग करना।",
    examples: [
      { jp: "オリンピックを契機に、街の再開発が進んだ。", reading: "オリンピックをけいきに、まちのさいかいはつがすすんだ。", en: "With the Olympics as a catalyst, redevelopment of the city progressed.", ta: "ஒலிம்பிக்கை ஒரு திருப்புமுனையாகக் கொண்டு நகரின் மறுசீரமைப்பு முன்னேறியது.", hi: "ओलंपिक को अवसर बनाकर शहर का पुनर्निर्माण तेज़ी से हुआ।" }
    ],
    notes: "Often interchangeable with をきっかけに, but を契機に is more formal and historical.",
    jlpt_level: "N2",
    lesson_order: 22,
    tags: ["turning-point", "catalyst", "N2"]
  },
  {
    id: "n2g023",
    pattern: "〜を問わず",
    romaji: "~o towazu",
    structure: "Noun + を問わず",
    meaning_en: "Regardless of / irrespective of / without distinction of",
    meaning_ta: "~ பாகுபாடின்றி / பொருட்படுத்தாமல்",
    meaning_hi: "~ की परवाह किए बिना / का भेद किए बिना",
    explanation_en: "Indicates that a condition applies universally, irrespective of differences such as age, gender, or nationality.",
    explanation_ta: "வயது, பாலினம், தேசியம் போன்ற வேறுபாடுகளை பொருட்படுத்தாமல் அனைவருக்கும் பொருந்தும் நிலையை குறிக்கிறது.",
    explanation_hi: "आयु, लिंग या राष्ट्रीयता जैसे अंतरों के बिना सभी पर लागू होना।",
    examples: [
      { jp: "経験の有無を問わず、どなたでも応募できます。", reading: "けいけんのうむをとわず、どなたでもおうぼできます。", en: "Anyone can apply, regardless of whether they have experience.", ta: "அனுபவம் உள்ளதா இல்லையா என்பதைப் பொருட்படுத்தாமல் யார் வேண்டுமானாலும் விண்ணப்பிக்கலாம்.", hi: "अनुभव हो या न हो, कोई भी आवेदन कर सकता है।" }
    ],
    notes: "Pairs frequently with contrasting pairs: 昼夜を問わず, 男女を問わず, 国籍を問わず.",
    jlpt_level: "N2",
    lesson_order: 23,
    tags: ["universal", "formal", "N2"]
  },
  {
    id: "n2g024",
    pattern: "〜ざるを得ない",
    romaji: "~zaru o enai",
    structure: "Verb ない-stem + ざるを得ない (する -> せざるを得ない)",
    meaning_en: "Cannot help but do / have no choice but to do",
    meaning_ta: "செய்யாமல் இருக்க முடியாது / செய்ய நிர்பந்திக்கப்படுதல்",
    meaning_hi: "किए बिना कोई चारा नहीं / करने पर मजबूर होना",
    explanation_en: "Expresses having no alternative other than doing something, despite not wanting to.",
    explanation_ta: "வேறு வழியின்றி செய்ய வேண்டிய கட்டாயத்தை வெளிப்படுத்துகிறது.",
    explanation_hi: "इच्छा न होने पर भी कोई अन्य विकल्प न होने पर कार्य करना।",
    examples: [
      { jp: "これだけの証拠があれば、事実を認めざるを得ない。", reading: "これだけのしょうこがあれば、じじつをみとめざるをえない。", en: "With this much evidence, one cannot help but admit the facts.", ta: "இவ்வளவு ஆதாரங்கள் இருக்கும் போது உண்மையை ஒப்புக்கொள்ளாமல் இருக்க முடியாது.", hi: "इतने सबूतों के बाद सच्चाई स्वीकार किए बिना कोई चारा नहीं।" }
    ],
    notes: "Note irregular verb する: せざるを得ない.",
    jlpt_level: "N2",
    lesson_order: 24,
    tags: ["obligation", "unavoidable", "N2"]
  },
  {
    id: "n2g025",
    pattern: "〜かねる",
    romaji: "~kaneru",
    structure: "Verb stem + かねる",
    meaning_en: "Cannot do / difficult to do (polite professional refusal)",
    meaning_ta: "செய்வது கடினம் / இயலாது (மரியாதையான மறுப்பு)",
    meaning_hi: "करने में असमर्थ / करना संभव नहीं (विनम्र इनकार)",
    explanation_en: "Used in business and professional contexts to politely decline requests or state inability to comply.",
    explanation_ta: "வணிக சூழலில் ஒரு கோரிக்கையை பணிவுடன் மறுப்பதற்கு பயன்படுகிறது.",
    explanation_hi: "व्यावसायिक संदर्भ में विनम्रतापूर्वक मना करने के लिए।",
    examples: [
      { jp: "お客様のご要望には応じかねます。", reading: "おきゃくさまのごようぼうにはおうじかねます。", en: "We are unfortunately unable to comply with your request.", ta: "வாடிக்கையாளரின் கோரிக்கையை எங்களால் ஏற்க இயலாது.", hi: "हम आपके अनुरोध को स्वीकार करने में असमर्थ हैं।" }
    ],
    notes: "Do not confuse with かねない (might happen / dangerous risk).",
    jlpt_level: "N2",
    lesson_order: 25,
    tags: ["business", "polite-refusal", "N2"]
  }
];

export const N1_GRAMMAR_EXPANSIONS = [
  {
    id: "n1g021",
    pattern: "〜であれ / 〜であろうと",
    romaji: "~de are / ~de arou to",
    structure: "Noun + であれ / であろうと",
    meaning_en: "Even if / no matter who/what it may be",
    meaning_ta: "யாராக இருந்தாலும் / எதுவாக இருந்தாலும்",
    meaning_hi: "चाहे कोई भी हो / परिस्थिति कैसी भी हो",
    explanation_en: "Expresses that under no circumstances or conditions does the following statement change.",
    explanation_ta: "எந்த ஒரு நிலையிலும் பின்வரும் முடிவு மாறாது என்பதை அழுத்தமாக கூறுகிறது.",
    explanation_hi: "किसी भी परिस्थिति या व्यक्ति के लिए नियम न बदलना।",
    examples: [
      { jp: "いかなる理由であれ、暴力は決して許されない。", reading: "いかなるりゆうであれ、ぼうりょくはけっしてゆるされない。", en: "No matter what the reason may be, violence is never permitted.", ta: "எந்தக் காரணமாக இருந்தாலும் வன்முறை ஒருபோதும் மன்னிக்கப்படாது.", hi: "कारण चाहे जो भी हो, हिंसा कभी स्वीकार्य नहीं है।" }
    ],
    notes: "Formal literary style often paired with たとえ or いかなる.",
    jlpt_level: "N1",
    lesson_order: 21,
    tags: ["uncompromising", "formal", "N1"]
  },
  {
    id: "n1g022",
    pattern: "〜たるもの",
    romaji: "~taru mono",
    structure: "Noun + たるもの",
    meaning_en: "As someone who is / in the position of (ideal duty)",
    meaning_ta: "ஒரு தகுதியுடையவராக இருக்கும் போது / ஒரு பதவியில் இருப்பவர்",
    meaning_hi: "उस पद या प्रतिष्ठा पर होने के नाते (आदर्श कर्तव्य)",
    explanation_en: "Describes the moral duty, dignity, or behavior expected of someone in a high, professional, or responsible role.",
    explanation_ta: "ஒரு உயர்ந்த பொறுப்பில் உள்ளவருக்குரிய கடமை மற்றும் கண்ணியத்தை வலியுறுத்துகிறது.",
    explanation_hi: "किसी ज़िम्मेदार पद पर आसीन व्यक्ति से अपेक्षित आदर्श आचरण।",
    examples: [
      { jp: "指導者たるものは、常に大局を見据えなければならない。", reading: "しどうしゃたるものは、つねにたいきょくをみすえなければならない。", en: "A true leader must always keep the bigger picture in perspective.", ta: "ஒரு தலைவராக இருப்பவர் எப்போதும் பரந்த பார்வையை கொண்டிருக்க வேண்டும்.", hi: "नेता होने के नाते हमेशा व्यापक दृष्टिकोण रखना चाहिए।" }
    ],
    notes: "Originates from classical Japanese 'で ある もの'.",
    jlpt_level: "N1",
    lesson_order: 22,
    tags: ["duty", "classical", "N1"]
  },
  {
    id: "n1g023",
    pattern: "〜を余儀なくされる",
    romaji: "~o yogi naku sareru",
    structure: "Noun + を余儀なくされる",
    meaning_en: "Be forced to / have no choice but to (due to unavoidable external circumstances)",
    meaning_ta: "நிர்பந்தத்திற்கு உள்ளாகுதல் / தவிர்க்க முடியாத சூழல் ஏற்படுதல்",
    meaning_hi: "मजबूर होना / विवश होना (अनिवार्य परिस्थितियों के कारण)",
    explanation_en: "Expresses that an undesirable change or cessation of action was compelled by circumstances completely beyond one's control.",
    explanation_ta: "கட்டுப்படுத்த முடியாத சூழலால் ஒரு திட்டத்தை மாற்ற அல்லது கைவிட வேண்டிய கட்டாயத்திற்கு ஆளாவது.",
    explanation_hi: "बाहरी परिस्थितियों के दबाव में निर्णय बदलने पर विवश होना।",
    examples: [
      { jp: "台風の影響により、イベントの中止を余儀なくされた。", reading: "たいふうのえいきょうにより、イベントのちゅうしをよぎなくされた。", en: "Due to the typhoon, we were forced to cancel the event.", ta: "புயலின் காரணமாக நிகழ்ச்சியை ரத்து செய்ய நிர்பந்திக்கப்பட்டோம்.", hi: "तूफान के प्रभाव से कार्यक्रम रद्द करने पर मजबूर होना पड़ा।" }
    ],
    notes: "Active counterpart: 〜を余儀なくさせる (force someone to do).",
    jlpt_level: "N1",
    lesson_order: 23,
    tags: ["unavoidable", "external-force", "N1"]
  },
  {
    id: "n1g024",
    pattern: "〜と相まって",
    romaji: "~to aimatte",
    structure: "Noun + と相まって",
    meaning_en: "Coupled with / combined with / together with",
    meaning_ta: "~ உடன் இணைந்து / கூட்டு விளைவாக",
    meaning_hi: "~ के साथ मिलकर / दोनों के संयुक्त प्रभाव से",
    explanation_en: "Expresses that two factors mutually interact or combine to produce a heightened effect.",
    explanation_ta: "இரண்டு அம்சங்கள் ஒன்று சேர்ந்து ஒரு கூடுதல் தாக்கத்தை உருவாக்குவதை குறிக்கிறது.",
    explanation_hi: "दो कारकों के तालमेल से प्रभाव का दोगुना हो जाना।",
    examples: [
      { jp: "才能と不断の努力が相まって、彼は世界一の座を射止めた。", reading: "さいのうとふだんのどりょくがあいまって、かれはせかいいちのざをいとめた。", en: "Talent coupled with relentless effort won him the world championship.", ta: "திறமையும் தொடர் உழைப்பும் இணைந்து அவரை உலக சாம்பியனாக்கியது.", hi: "प्रतिभा और निरंतर परिश्रम ने मिलकर उसे विश्व विजेता बना दिया।" }
    ],
    notes: "Literally means 'matching with each other'.",
    jlpt_level: "N1",
    lesson_order: 24,
    tags: ["combination", "synergy", "N1"]
  },
  {
    id: "n1g025",
    pattern: "〜極まりない / 〜極まる",
    romaji: "~kiwamarinai / ~kiwamaru",
    structure: "な-adj stem + 極まりない / 極まる (or Noun + 極まりない)",
    meaning_en: "Extremely / knows no bounds / peak of",
    meaning_ta: "எல்லைக்குட்படாத / உச்சக்கட்ட",
    meaning_hi: "अत्यधिक / पराकाष्ठा पर होना",
    explanation_en: "Conveys an extreme degree of emotion or state, often regarding dangerous, rude, or regrettable matters.",
    explanation_ta: "ஒரு குணம் அல்லது நிலை உச்சக்கட்டத்தை எட்டியுள்ளதை குறிக்கும் மிக உயர்ந்த சொல்லாட்சி.",
    explanation_hi: "किसी स्थिति या व्यवहार की चरम सीमा को दर्शाने वाला औपचारिक रूप।",
    examples: [
      { jp: "そのような無責任な態度は、遺憾極まりない。", reading: "そのようなむせきにんなたいどは、いかんきわまりない。", en: "Such an irresponsible attitude is regrettable in the extreme.", ta: "அத்தகைய பொறுப்பற்ற அணுகுமுறை மிகுந்த வருத்தத்திற்குரியது.", hi: "ऐसा गैर-जिम्मेदाराना रवैया अत्यंत खेदजनक है।" }
    ],
    notes: "Written, high-register Japanese.",
    jlpt_level: "N1",
    lesson_order: 25,
    tags: ["extreme", "formal", "N1"]
  }
];
