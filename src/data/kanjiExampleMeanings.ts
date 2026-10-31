// src/data/kanjiExampleMeanings.ts
// Level-appropriate meanings and romaji for Japanese vocabulary examples in N5, N4, N3, N2, N1
export interface KanjiMeaningEntry {
  en: string;
  ta: string;
  hi: string;
  romaji: string;
}

export const KANJI_EXAMPLE_MEANINGS: Record<string, KanjiMeaningEntry> = {
  "順位": {
    "en": "order, rank, standing",
    "ta": "தரவரிசை",
    "hi": "रैंक, स्थान",
    "romaji": "juni"
  },
  "一位": {
    "en": "first place",
    "ta": "முதலிடம்",
    "hi": "प्रथम स्थान",
    "romaji": "ichii"
  },
  "路線": {
    "en": "route, railway line",
    "ta": "பயணப்பாதை",
    "hi": "मार्ग, रूट",
    "romaji": "rosen"
  },
  "年号": {
    "en": "era name",
    "ta": "ஆண்டுப் பெயர்",
    "hi": "युग का नाम",
    "romaji": "nengou"
  },
  "［－円］札": {
    "en": "[－ yen] note, bill",
    "ta": "[－ yen] note, bill",
    "hi": "[－ yen] note, bill",
    "romaji": "[-en] satsu"
  },
  "目指します": {
    "en": "aim for",
    "ta": "aim for",
    "hi": "aim for",
    "romaji": "mezashimasu"
  },
  "この間": {
    "en": "the other day",
    "ta": "the other day",
    "hi": "the other day",
    "romaji": "konoaida"
  },
  "反応": {
    "en": "reaction, response",
    "ta": "எதிர்வினை",
    "hi": "प्रतिक्रिया",
    "romaji": "hannou"
  },
  "反省": {
    "en": "reflection, regret",
    "ta": "சுயபரிசீலனை",
    "hi": "आत्मनिरीक्षण",
    "romaji": "hansei"
  },
  "因果": {
    "en": "cause and effect, karma",
    "ta": "காரண காரியம்",
    "hi": "कारण और प्रभाव",
    "romaji": "inga"
  },
  "果汁": {
    "en": "fruit juice",
    "ta": "பழச்சாறு",
    "hi": "फलों का रस",
    "romaji": "kajuu"
  },
  "成果": {
    "en": "fruits of labor, outcome",
    "ta": "வெற்றிப் பலன்",
    "hi": "उपलब्धि, परिणाम",
    "romaji": "seika"
  },
  "総菜": {
    "en": "side dishes, prepared food",
    "ta": "கூட்டு / பக்க உணவு",
    "hi": "बना-बनाया खाना",
    "romaji": "souzai"
  },
  "青菜": {
    "en": "greens, green vegetables",
    "ta": "பச்சைக் கீரை",
    "hi": "हरी सब्जियां",
    "romaji": "aona"
  },
  "菜の花": {
    "en": "canola blossom, rapeseed",
    "ta": "கடுகு மலர்",
    "hi": "सरसों का फूल",
    "romaji": "nanohana"
  },
  "白菜": {
    "en": "Chinese cabbage",
    "ta": "சீன முட்டைகோஸ்",
    "hi": "चीनी पत्तागोभी",
    "romaji": "hakusai"
  },
  "菜園": {
    "en": "vegetable garden",
    "ta": "காய்கறித் தோட்டம்",
    "hi": "सब्जी का बगीचा",
    "romaji": "saien"
  },
  "一人旅": {
    "en": "solo journey",
    "ta": "தனிப்பயணம்",
    "hi": "अकेले यात्रा",
    "romaji": "hitoritabi"
  },
  "旅費": {
    "en": "travel expenses",
    "ta": "பயணச் செலவு",
    "hi": "यात्रा व्यय",
    "romaji": "ryohi"
  },
  "客船": {
    "en": "passenger ship",
    "ta": "பயணிகள் கப்பல்",
    "hi": "यात्री जहाज",
    "romaji": "kyakusen"
  },
  "船長": {
    "en": "captain of a ship",
    "ta": "கப்பல் தலைவர்",
    "hi": "जहाज का कप्तान",
    "romaji": "senchou"
  },
  "鉄分": {
    "en": "iron content",
    "ta": "இரும்புச் சத்து",
    "hi": "लौह तत्व",
    "romaji": "tetsubun"
  },
  "私鉄": {
    "en": "private railway",
    "ta": "தனியார் ரயில்",
    "hi": "निजी रेलवे",
    "romaji": "shitetsu"
  },
  "曲線": {
    "en": "curved line",
    "ta": "வளைகோடு",
    "hi": "वक्र रेखा",
    "romaji": "kyokusen"
  },
  "直線": {
    "en": "straight line",
    "ta": "நேர்கோடு",
    "hi": "सीधी रेखा",
    "romaji": "chokusen"
  },
  "駐日": {
    "en": "stationed in Japan",
    "ta": "ஜப்பானில் வசிக்கும்",
    "hi": "जापान में तैनात",
    "romaji": "chuunichi"
  },
  "駐在": {
    "en": "stationed, resident",
    "ta": "தங்கியிருத்தல்",
    "hi": "तैनात",
    "romaji": "chuuzai"
  },
  "駐輪場": {
    "en": "bicycle parking",
    "ta": "மிதிவண்டி நிறுத்துமிடம்",
    "hi": "साइकिल पार्किंग",
    "romaji": "chuurinjou"
  },
  "銀メダル": {
    "en": "silver medal",
    "ta": "வெள்ளிப் பதக்கம்",
    "hi": "रजत पदक",
    "romaji": "ginmedaru"
  },
  "銀色": {
    "en": "silver color",
    "ta": "வெள்ளி நிறம்",
    "hi": "चांदी जैसा रंग",
    "romaji": "giniro"
  },
  "奉仕": {
    "en": "service, volunteer work",
    "ta": "சேவை",
    "hi": "सेवा",
    "romaji": "houshi"
  },
  "仕草": {
    "en": "gesture, mannerism",
    "ta": "அசைவு, சைகை",
    "hi": "भावभंगिमा",
    "romaji": "shigusa"
  },
  "人事課": {
    "en": "human resources department",
    "ta": "மனிதவள பிரிவு",
    "hi": "मानव संसाधन विभाग",
    "romaji": "jinjika"
  },
  "課税": {
    "en": "taxation",
    "ta": "வரி விதிப்பு",
    "hi": "कराधान",
    "romaji": "kazei"
  },
  "課題": {
    "en": "task, assignment, problem",
    "ta": "பணி, செயல்முறை",
    "hi": "कार्य, असाइनमेंट",
    "romaji": "kadai"
  },
  "日課": {
    "en": "daily routine",
    "ta": "தினசரி பழக்கம்",
    "hi": "दिनचर्या",
    "romaji": "nikka"
  },
  "背景": {
    "en": "background, scenery",
    "ta": "பின்னணி",
    "hi": "पृष्ठभूमि",
    "romaji": "haikei"
  },
  "細菌": {
    "en": "bacteria, germ",
    "ta": "பாக்டீரியா",
    "hi": "जीवाणु",
    "romaji": "saikin"
  },
  "細部": {
    "en": "details, particulars",
    "ta": "விவரங்கள்",
    "hi": "विवरण",
    "romaji": "saibu"
  },
  "平泳ぎ": {
    "en": "breaststroke",
    "ta": "மார்பு நீச்சல்",
    "hi": "छाती के बल तैरना",
    "romaji": "hiraoyogi"
  },
  "背泳ぎ": {
    "en": "backstroke",
    "ta": "மல்லாந்து நீந்துதல்",
    "hi": "उल्टा तैरना",
    "romaji": "seoyogi"
  },
  "変える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaeru"
  },
  "変えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaemasu"
  },
  "大変［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "taihen [na]"
  },
  "続く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuzuku"
  },
  "～続ける": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuzukeru"
  },
  "続ける": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuzukeru"
  },
  "連れる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsureru"
  },
  "連絡": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "renraku"
  },
  "連れて来ます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsurete kimasu"
  },
  "予約": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yoyaku"
  },
  "予約します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yoyakushimasu"
  },
  "約束": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yakusoku"
  },
  "予定表": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yoteihyō"
  },
  "予定": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yotei"
  },
  "定食": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "teishoku"
  },
  "決して": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kesshite"
  },
  "決まる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kimaru"
  },
  "決める": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kimeru"
  },
  "宅配便": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "takuhaibin"
  },
  "心配［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinpai [na]"
  },
  "集まる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "atsumaru"
  },
  "集める": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "atsumeru"
  },
  "集めます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "atsumemasu"
  },
  "具合": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "guai"
  },
  "都合": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsugō"
  },
  "体験": {
    "en": "personal experience, hands-on",
    "ta": "நேரடி அனுபவம்",
    "hi": "प्रत्यक्ष अनुभव",
    "romaji": "taiken"
  },
  "入学試験": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nyūgakushiken"
  },
  "試合": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shiai"
  },
  "練達": {
    "en": "expert skill",
    "ta": "முழு தேர்ச்சி",
    "hi": "विशेष कुशलता",
    "romaji": "rentatsu"
  },
  "手練": {
    "en": "clever tricks",
    "ta": "கைத்தேர்ச்சி",
    "hi": "कुशल चाल",
    "romaji": "teren"
  },
  "熟練": {
    "en": "skill, dexterity, mastery",
    "ta": "தேர்ச்சி",
    "hi": "दक्षता, प्रवीणता",
    "romaji": "jukuren"
  },
  "試練": {
    "en": "trial, ordeal, test",
    "ta": "சோதனை",
    "hi": "कड़ी परीक्षा",
    "romaji": "shiren"
  },
  "予習": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yoshuu"
  },
  "習います": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "naraimasu"
  },
  "習う": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "narau"
  },
  "目が覚めます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mega samemasu"
  },
  "覚えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oboemasu"
  },
  "覚える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oboeru"
  },
  "度忘れ": {
    "en": "temporary lapse of memory",
    "ta": "சடுதி மறதி",
    "hi": "अचानक भूल जाना",
    "romaji": "dowasure"
  },
  "物忘れ": {
    "en": "forgetfulness",
    "ta": "மறதி",
    "hi": "भूलने की आदत",
    "romaji": "monowasure"
  },
  "忘れます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "wasuremasu"
  },
  "困惑": {
    "en": "bewilderment, perplexity",
    "ta": "குழப்பம்",
    "hi": "असमंजस",
    "romaji": "konwaku"
  },
  "貧困": {
    "en": "poverty",
    "ta": "ஏழ்மை",
    "hi": "गरीबी",
    "romaji": "hinkon"
  },
  "困窮": {
    "en": "poverty, destitution",
    "ta": "வறுமை",
    "hi": "कंगाली",
    "romaji": "konkyuu"
  },
  "頼みます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tanomimasu"
  },
  "頼む": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tanomu"
  },
  "志願": {
    "en": "volunteering, application",
    "ta": "தன்னார்வ விருப்பம்",
    "hi": "स्वयंसेवा",
    "romaji": "shigan"
  },
  "祈願": {
    "en": "prayer, supplication",
    "ta": "பிரார்த்தனை",
    "hi": "प्रार्थना",
    "romaji": "kigan"
  },
  "願書": {
    "en": "written application",
    "ta": "விண்ணப்பப் படிவம்",
    "hi": "आवेदन पत्र",
    "romaji": "gansho"
  },
  "お願い": {
    "en": "request, please",
    "ta": "தயவுசெய்து / வேண்டுகோள்",
    "hi": "अनुरोध, कृपया",
    "romaji": "onegai"
  },
  "注意します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chūishimasu"
  },
  "注射": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chuusha"
  },
  "ビニール袋": {
    "en": "plastic bag",
    "ta": "நெகிழிப் பை",
    "hi": "प्लास्टिक की थैली",
    "romaji": "bini-rubukuro"
  },
  "紙袋": {
    "en": "paper bag",
    "ta": "காகித பை",
    "hi": "कागज का थैला",
    "romaji": "kamibukuro"
  },
  "のし袋": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "noshibukuro"
  },
  "長靴": {
    "en": "boots, wellingtons",
    "ta": "நீண்ட காலணிகள்",
    "hi": "लंबे जूते",
    "romaji": "nagagutsu"
  },
  "革靴": {
    "en": "leather shoes",
    "ta": "தோல் காலணிகள்",
    "hi": "चमड़े के जूते",
    "romaji": "kawagutsu"
  },
  "雨靴": {
    "en": "rain boots",
    "ta": "மழைக்கால காலணி",
    "hi": "बरसाती जूते",
    "romaji": "amagutsu"
  },
  "靴屋": {
    "en": "shoe shop",
    "ta": "செருப்புக் கடை",
    "hi": "जूते की दुकान",
    "romaji": "kutsuya"
  },
  "軍帽": {
    "en": "military cap",
    "ta": "ராணுவ தொப்பி",
    "hi": "सैनिक टोपी",
    "romaji": "gunbou"
  },
  "制帽": {
    "en": "uniform cap",
    "ta": "சீருடை தொப்பி",
    "hi": "वर्दी की टोपी",
    "romaji": "seibou"
  },
  "学帽": {
    "en": "student cap",
    "ta": "மாணவர் தொப்பி",
    "hi": "छात्र टोपी",
    "romaji": "gakubou"
  },
  "麦わら帽子": {
    "en": "straw hat",
    "ta": "வைக்கோல் தொப்பி",
    "hi": "घास की टोपी",
    "romaji": "mugiwaraboushi"
  },
  "脱帽": {
    "en": "taking off hat; taking hat off to (admiring)",
    "ta": "தொப்பியை அகற்றுதல்",
    "hi": "टोपी उतारना",
    "romaji": "datsubou"
  },
  "服装": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fukusou"
  },
  "洋服": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "youfuku"
  },
  "－位": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-i"
  },
  "－点": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-ten"
  },
  "点く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuku"
  },
  "交差点": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kousaten"
  },
  "計算します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "keisanshimasu"
  },
  "設計します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sekkeishimasu"
  },
  "雨量": {
    "en": "rainfall amount",
    "ta": "மழை அளவு",
    "hi": "बारिश की मात्रा",
    "romaji": "uryou"
  },
  "少量": {
    "en": "small quantity",
    "ta": "சிறிய அளவு",
    "hi": "अल्प मात्रा",
    "romaji": "shouryou"
  },
  "重量": {
    "en": "weight",
    "ta": "எடை",
    "hi": "वजन",
    "romaji": "juuryou"
  },
  "分量": {
    "en": "portion, amount",
    "ta": "பங்கு அளவு",
    "hi": "हिस्सा, मात्रा",
    "romaji": "bunryou"
  },
  "大量": {
    "en": "large quantity, massive",
    "ta": "பெருந்தொகை / பேரளவு",
    "hi": "बड़ी मात्रा",
    "romaji": "tairyou"
  },
  "数える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kazoeru"
  },
  "御数": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okazu"
  },
  "数えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kazoemasu"
  },
  "二次会": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nijikai"
  },
  "次に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsugini"
  },
  "次の": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsugino"
  },
  "各駅": {
    "en": "every station",
    "ta": "ஒவ்வொரு ரயில்நிலையம்",
    "hi": "हर स्टेशन",
    "romaji": "kakueki"
  },
  "各位": {
    "en": "everyone, to all concerned",
    "ta": "அனைவருக்கும்",
    "hi": "आप सभी",
    "romaji": "kakui"
  },
  "各国": {
    "en": "each country, all nations",
    "ta": "ஒவ்வொரு நாடு",
    "hi": "हर देश",
    "romaji": "kakkoku"
  },
  "両足": {
    "en": "both feet/legs",
    "ta": "இரு கால்கள்",
    "hi": "दोनों पैर",
    "romaji": "ryouashi"
  },
  "両立": {
    "en": "compatibility, coexistence",
    "ta": "இரண்டும் சாத்தியமாதல்",
    "hi": "सामंजस्य",
    "romaji": "ryouritsu"
  },
  "両手": {
    "en": "both hands",
    "ta": "இரு கைகள்",
    "hi": "दोनों हाथ",
    "romaji": "ryoute"
  },
  "全然": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "zenzen"
  },
  "同僚": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "douryou"
  },
  "同様": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "douyou"
  },
  "同じ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "onaji"
  },
  "特別［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tokubetsu [na]"
  },
  "特に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tokuni"
  },
  "別れる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "wakareru"
  },
  "別々に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "betsubetsuni"
  },
  "以上": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ijou"
  },
  "以内": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "inai"
  },
  "不自由": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fujiyuu"
  },
  "自由に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jiyūni"
  },
  "修理します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shūrishimasu"
  },
  "無理［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "muri [na]"
  },
  "答え": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kotae"
  },
  "答える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kotaeru"
  },
  "質問します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shitsumonshimasu"
  },
  "問題": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mondai"
  },
  "図形": {
    "en": "figure, graphical shape",
    "ta": "வடிவியல் படம்",
    "hi": "आकृति",
    "romaji": "zukei"
  },
  "四角形": {
    "en": "quadrilateral, rectangle",
    "ta": "நாற்கரம்",
    "hi": "चतुर्भुज",
    "romaji": "shikakukei"
  },
  "三角形": {
    "en": "triangle",
    "ta": "முக்கோணம்",
    "hi": "त्रिकोण",
    "romaji": "sankakkei"
  },
  "形式": {
    "en": "form, format, formality",
    "ta": "படிவம் / வடிவம்",
    "hi": "प्रारूप",
    "romaji": "keishiki"
  },
  "黄色い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kiiroi"
  },
  "黄色": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kiiro"
  },
  "注意": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chuui"
  },
  "～度": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "do"
  },
  "丁度": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "choudo"
  },
  "もう一度": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mouichido"
  },
  "体温計": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "taionkei"
  },
  "温泉": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "onsen"
  },
  "温い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nurui"
  },
  "流れ星": {
    "en": "shooting star, meteor",
    "ta": "விண்கல்",
    "hi": "टूटता तारा",
    "romaji": "nagareboshi"
  },
  "星座": {
    "en": "constellation",
    "ta": "நட்சத்திர மண்டலம்",
    "hi": "नक्षत्र",
    "romaji": "seiza"
  },
  "星出彰彦": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hoshideakihiko"
  },
  "大波": {
    "en": "big wave, billow",
    "ta": "பேரலை",
    "hi": "बड़ी लहर",
    "romaji": "oonami"
  },
  "高波": {
    "en": "high wave, swell",
    "ta": "உயர்ந்த அலை",
    "hi": "ऊंची लहर",
    "romaji": "takanami"
  },
  "波長": {
    "en": "wavelength",
    "ta": "அலைநீளம்",
    "hi": "तरंग दैर्ध्य",
    "romaji": "hachou"
  },
  "電波": {
    "en": "radio wave",
    "ta": "மின்காந்த அலை",
    "hi": "रेडियो तरंग",
    "romaji": "denpa"
  },
  "結氷": {
    "en": "freezing over",
    "ta": "பனியாக உறைதல்",
    "hi": "बर्फ जमना",
    "romaji": "keppyou"
  },
  "氷河": {
    "en": "glacier",
    "ta": "பனியாறு",
    "hi": "हिमनद, ग्लेशियर",
    "romaji": "hyouga"
  },
  "かき氷": {
    "en": "shaved ice (dessert)",
    "ta": "சீவிய பனி இனிப்பு",
    "hi": "कुल्फी/बर्फ का गोला",
    "romaji": "kakigoori"
  },
  "氷山": {
    "en": "iceberg",
    "ta": "பனிப்பாறை",
    "hi": "हिमशैल",
    "romaji": "hyouzan"
  },
  "氷水": {
    "en": "ice water",
    "ta": "பனி நீர்",
    "hi": "बर्फ का पानी",
    "romaji": "koorimizu"
  },
  "泥足": {
    "en": "muddy feet",
    "ta": "சேற்றுக் கால்கள்",
    "hi": "कीचड़ भरे पैर",
    "romaji": "doroashi"
  },
  "泥酔": {
    "en": "dead drunk",
    "ta": "கடும் போதை",
    "hi": "धुत नशे में",
    "romaji": "deisui"
  },
  "泥沼": {
    "en": "bog, morass, quagmire",
    "ta": "சேற்றுச் சதுப்பு",
    "hi": "दलदल",
    "romaji": "doronuma"
  },
  "泥水": {
    "en": "muddy water",
    "ta": "சேற்று நீர்",
    "hi": "मटमैला पानी",
    "romaji": "doromizu"
  },
  "一枚岩": {
    "en": "monolith, unified front",
    "ta": "ஒற்றைப் பாறை",
    "hi": "विशाल चट्टान",
    "romaji": "ichimaiiwa"
  },
  "岩山": {
    "en": "rocky mountain",
    "ta": "பாறை மலை",
    "hi": "पथरीला पहाड़",
    "romaji": "iwayama"
  },
  "岩場": {
    "en": "rocky area",
    "ta": "பாறைப் பகுதி",
    "hi": "पथरीली जगह",
    "romaji": "iwaba"
  },
  "溶岩": {
    "en": "lava",
    "ta": "எரிமலைக்குழம்பு",
    "hi": "लावा",
    "romaji": "yougan"
  },
  "岩石": {
    "en": "rocks and stones",
    "ta": "பாறாங்கற்கள்",
    "hi": "पत्थर व चट्टानें",
    "romaji": "ganseki"
  },
  "砂利": {
    "en": "gravel, pebbles",
    "ta": "சரளைக்கல்",
    "hi": "बजरी",
    "romaji": "jari"
  },
  "土砂": {
    "en": "earth and sand",
    "ta": "மண்ணும் மணலும்",
    "hi": "मिट्टी और रेत",
    "romaji": "dosha"
  },
  "砂浜": {
    "en": "sandy beach",
    "ta": "மணற்கரை",
    "hi": "रेतीला तट",
    "romaji": "sunahama"
  },
  "宝石": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "houseki"
  },
  "石鹸": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sekken"
  },
  "密林": {
    "en": "dense jungle",
    "ta": "அடர்ந்த காடு",
    "hi": "सघन जंगल",
    "romaji": "mitsurin"
  },
  "雑木林": {
    "en": "thicket, copse",
    "ta": "சிறு காடு",
    "hi": "झाड़ीदार जंगल",
    "romaji": "zoukibayashi"
  },
  "林業": {
    "en": "forestry",
    "ta": "வனவியல் தொழில்",
    "hi": "वानिकी",
    "romaji": "ringyou"
  },
  "松林": {
    "en": "pine grove",
    "ta": "பைன் தோப்பு",
    "hi": "चीड़ का वन",
    "romaji": "matsubayashi"
  },
  "深森": {
    "en": "deep forest",
    "ta": "அடர்ந்த காடு",
    "hi": "गहरा जंगल",
    "romaji": "shinshin"
  },
  "森閑": {
    "en": "silent, quiet (like woods)",
    "ta": "அமைதி",
    "hi": "शांत वातावरण",
    "romaji": "shinkan"
  },
  "森林浴": {
    "en": "forest bathing",
    "ta": "வன அமைதி அனுபவம்",
    "hi": "वन स्नान",
    "romaji": "shinrinyoku"
  },
  "青森": {
    "en": "Aomori prefecture",
    "ta": "அவோமோரி மாகாணம்",
    "hi": "आओमोरी",
    "romaji": "aomori"
  },
  "森林": {
    "en": "forest, woods",
    "ta": "காடுகள்",
    "hi": "वनस्पति व वन",
    "romaji": "shinrin"
  },
  "大皿": {
    "en": "large platter",
    "ta": "பெரிய தட்டு",
    "hi": "बड़ी थाली",
    "romaji": "oozara"
  },
  "小皿": {
    "en": "small plate, saucer",
    "ta": "சிறு தட்டு",
    "hi": "छोटी तश्तरी",
    "romaji": "kozara"
  },
  "［お］皿": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] sara"
  },
  "辛抱": {
    "en": "patience, endurance",
    "ta": "பொறுமை",
    "hi": "धैर्य",
    "romaji": "shinbou"
  },
  "塩辛い": {
    "en": "salty",
    "ta": "உப்பான",
    "hi": "नमकीन",
    "romaji": "shiokarai"
  },
  "激辛": {
    "en": "super spicy, fiery hot",
    "ta": "கடும் காரம்",
    "hi": "बेहद तीखा",
    "romaji": "gekikara"
  },
  "香辛料": {
    "en": "spices, seasoning",
    "ta": "மசாலாப் பொருட்கள்",
    "hi": "मसाले",
    "romaji": "koushinryou"
  },
  "辛口": {
    "en": "dry taste, harsh (criticism)",
    "ta": "காரச் சுவை",
    "hi": "तीखा स्वाद",
    "romaji": "karakuchi"
  },
  "甘み": {
    "en": "sweetness",
    "ta": "இனிப்புத் தன்மை",
    "hi": "मिठास",
    "romaji": "amami"
  },
  "甘酒": {
    "en": "sweet sake",
    "ta": "இனிப்பு சேக்",
    "hi": "मीठी साके",
    "romaji": "amazake"
  },
  "甘口": {
    "en": "mild, sweet taste",
    "ta": "இனிப்புச் சுவை",
    "hi": "मीठा स्वाद",
    "romaji": "amakuchi"
  },
  "甘味料": {
    "en": "sweetener",
    "ta": "இனிப்பூட்டி",
    "hi": "मीठा करने का पदार्थ",
    "romaji": "kanmiryou"
  },
  "甘やかす": {
    "en": "to pamper, to spoil",
    "ta": "செல்லம் கொடுத்தல்",
    "hi": "लाड़-प्यार से बिगाड़ना",
    "romaji": "amayakasu"
  },
  "趣味": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shumi"
  },
  "意味": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "imi"
  },
  "美味しい": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oishii"
  },
  "上野公園": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "uenokōen"
  },
  "野球": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yakyū"
  },
  "飲酒": {
    "en": "drinking alcohol",
    "ta": "மது அருந்துதல்",
    "hi": "शराब पीना",
    "romaji": "inshu"
  },
  "居酒屋": {
    "en": "Japanese pub",
    "ta": "மது சிற்றுண்டி விடுதி",
    "hi": "जापानी पब",
    "romaji": "izakaya"
  },
  "酒屋": {
    "en": "liquor store",
    "ta": "மதுக்கடை",
    "hi": "शराब की दुकान",
    "romaji": "sakaya"
  },
  "晩ごはん": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bangohan"
  },
  "晩御飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bangohan"
  },
  "晩ご飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bangohan"
  },
  "朝ごはん": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "asagohan"
  },
  "朝御飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "asagohan"
  },
  "朝ご飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "asagohan"
  },
  "夜行バス": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yakōbasu"
  },
  "今夜": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "konya"
  },
  "昨夜": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yuube"
  },
  "昼御飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hirugohan"
  },
  "昼ご飯": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hirugohan"
  },
  "通る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tooru"
  },
  "交通": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kōtsū"
  },
  "普通": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "futsū"
  },
  "負荷": {
    "en": "burden, load",
    "ta": "சுமை",
    "hi": "भार, लोड",
    "romaji": "fuka"
  },
  "入荷": {
    "en": "receipt of goods",
    "ta": "சரக்கு வருதல்",
    "hi": "माल की आवक",
    "romaji": "nyuuka"
  },
  "荷造り": {
    "en": "packing luggage",
    "ta": "பொதி கட்டுதல்",
    "hi": "पैकिंग",
    "romaji": "nizukuri"
  },
  "出荷": {
    "en": "shipping, shipment",
    "ta": "பொருள் அனுப்புதல்",
    "hi": "माल भेजना",
    "romaji": "shukka"
  },
  "手荷物": {
    "en": "hand luggage",
    "ta": "கைப்பை",
    "hi": "हाथ का सामान",
    "romaji": "tenimotsu"
  },
  "素泊まり": {
    "en": "staying without meals",
    "ta": "உணவின்றி தங்குதல்",
    "hi": "बिना भोजन का कमरा",
    "romaji": "sudomari"
  },
  "連泊": {
    "en": "consecutive nights stay",
    "ta": "தொடர் தங்குதல்",
    "hi": "लगातार ठहराव",
    "romaji": "renpaku"
  },
  "外泊": {
    "en": "spending night away from home",
    "ta": "வெளியில் தங்குதல்",
    "hi": "घर से बाहर रात बिताना",
    "romaji": "gaihaku"
  },
  "一泊": {
    "en": "one night stay",
    "ta": "ஒரு இரவு தங்குதல்",
    "hi": "एक रात का ठहराव",
    "romaji": "ippaku"
  },
  "旅行社": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ryokōsha"
  },
  "宇宙船": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "uchūsen"
  },
  "宇宙飛行士": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "uchūhikōshi"
  },
  "飛行場": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hikoujou"
  },
  "地下": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chika"
  },
  "地図": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chizu"
  },
  "－番線": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-bansen"
  },
  "～番": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ban"
  },
  "交番": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kouban"
  },
  "記号": {
    "en": "symbol, sign",
    "ta": "குறியீடு",
    "hi": "प्रतीक, चिह्न",
    "romaji": "kigou"
  },
  "代わり": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kawari"
  },
  "～代": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "dai"
  },
  "時代": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jidai"
  },
  "料理": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ryouri"
  },
  "建物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tatemono"
  },
  "食料品": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shokuryouhin"
  },
  "品物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinamono"
  },
  "用意": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "youi"
  },
  "利用": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "riyou"
  },
  "用事": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yōji"
  },
  "［お］仕事": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] shigoto"
  },
  "産業": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sangyou"
  },
  "残業します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "zangyōshimasu"
  },
  "授業": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jugyou"
  },
  "～学部": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gakubu"
  },
  "全部で": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "zenbude"
  },
  "会う": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "au"
  },
  "娘婿": {
    "en": "son-in-law",
    "ta": "மருமகன்",
    "hi": "दामाद",
    "romaji": "musumemuko"
  },
  "愛娘": {
    "en": "beloved daughter",
    "ta": "அன்பு மகள்",
    "hi": "दुलारी बेटी",
    "romaji": "manamusume"
  },
  "小娘": {
    "en": "young girl, greenhorn",
    "ta": "இளம்பெண்",
    "hi": "युवती",
    "romaji": "komusume"
  },
  "一人娘": {
    "en": "only daughter",
    "ta": "ஒரே மகள்",
    "hi": "एकलौती बेटी",
    "romaji": "hitorimusume"
  },
  "休息": {
    "en": "rest, relaxation",
    "ta": "ஓய்வு",
    "hi": "आराम",
    "romaji": "kyuusoku"
  },
  "息抜": {
    "en": "taking a breather, relaxation",
    "ta": "ஓய்வு",
    "hi": "विश्राम",
    "romaji": "ikinuki"
  },
  "ため息": {
    "en": "sigh",
    "ta": "பெருமூச்சு",
    "hi": "आह",
    "romaji": "tameiki"
  },
  "前妻": {
    "en": "former wife",
    "ta": "முன்னாள் மனைவி",
    "hi": "पूर्व पत्नी",
    "romaji": "zensai"
  },
  "妻子": {
    "en": "wife and children",
    "ta": "மனைவி மற்றும் குழந்தைகள்",
    "hi": "पत्नी और बच्चे",
    "romaji": "saishi"
  },
  "愛妻": {
    "en": "beloved wife",
    "ta": "அன்பு மனைவி",
    "hi": "प्यारी पत्नी",
    "romaji": "aisai"
  },
  "夫妻": {
    "en": "husband and wife, Mr and Mrs",
    "ta": "தம்பதியினர்",
    "hi": "पति-पत्नी",
    "romaji": "fusai"
  },
  "夫／主人": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "otto/shujin"
  },
  "大丈夫": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daijoubu"
  },
  "丈夫": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "joubu"
  },
  "開祖": {
    "en": "founder (of sect, martial art)",
    "ta": "நிறுவனர்",
    "hi": "संस्थापक",
    "romaji": "kaiso"
  },
  "祖国": {
    "en": "fatherland, native country",
    "ta": "தாய்நாடு",
    "hi": "मातृभूमि",
    "romaji": "sokoku"
  },
  "先祖": {
    "en": "ancestry, forebears",
    "ta": "முன்னோர் மரபு",
    "hi": "पुरखे",
    "romaji": "senzo"
  },
  "祖先": {
    "en": "ancestors",
    "ta": "முன்னோர்கள்",
    "hi": "पूर्वज",
    "romaji": "sosen"
  },
  "従姉妹": {
    "en": "female cousin",
    "ta": "உடன்பிறவா தங்கை",
    "hi": "चचेरी बहन",
    "romaji": "itoko"
  },
  "妹分": {
    "en": "like a younger sister",
    "ta": "தங்கை போன்றவர்",
    "hi": "बहन जैसी",
    "romaji": "imoutobun"
  },
  "義妹": {
    "en": "sister-in-law, younger stepsister",
    "ta": "மைத்துனி",
    "hi": "भाभी / ननद",
    "romaji": "gimai"
  },
  "姉上": {
    "en": "honored elder sister",
    "ta": "மதிப்பிற்குரிய அக்கா",
    "hi": "आदरणीय दीदी",
    "romaji": "aneue"
  },
  "従姉": {
    "en": "elder female cousin",
    "ta": "உடன்பிறவா அக்கா",
    "hi": "बड़ी ममेरी/चचेरी बहन",
    "romaji": "itoko"
  },
  "義姉": {
    "en": "sister-in-law (elder)",
    "ta": "அண்ணி",
    "hi": "भाभी",
    "romaji": "gishi"
  },
  "弟さん": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "otōtosan"
  },
  "ライト兄弟": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "raitokyōdai"
  },
  "お兄さん": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oniisan"
  },
  "社員": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shain"
  },
  "会社員": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaishain"
  },
  "神社": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jinja"
  },
  "法隆寺": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hōryūji"
  },
  "［お］寺": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] tera"
  },
  "甲子園": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kōshien"
  },
  "主人公": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shujinkō"
  },
  "奈良公園": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "narakōen"
  },
  "大阪城公園": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ōsakajōkōen"
  },
  "航海": {
    "en": "voyage, navigation",
    "ta": "கடல் பயணம்",
    "hi": "समुद्री यात्रा",
    "romaji": "koukai"
  },
  "日本海": {
    "en": "Sea of Japan",
    "ta": "ஜப்பான் கடல்",
    "hi": "जापान सागर",
    "romaji": "nihonkai"
  },
  "海水浴": {
    "en": "sea bathing",
    "ta": "கடல் குளியல்",
    "hi": "समुद्र में स्नान",
    "romaji": "kaisuiyoku"
  },
  "人工湖": {
    "en": "artificial lake",
    "ta": "செயற்கை ஏரி",
    "hi": "कृत्रिम झील",
    "romaji": "jinkouko"
  },
  "湖水": {
    "en": "lake water",
    "ta": "ஏரி நீர்",
    "hi": "झील का पानी",
    "romaji": "kosui"
  },
  "塩湖": {
    "en": "salt lake",
    "ta": "உப்பு ஏரி",
    "hi": "खारे पानी की झील",
    "romaji": "enko"
  },
  "湖畔": {
    "en": "lakeside, lake shore",
    "ta": "ஏரிக்கரை",
    "hi": "झील का किनारा",
    "romaji": "kohan"
  },
  "溜池": {
    "en": "reservoir, catchment basin",
    "ta": "நீர்த்தேக்கம்",
    "hi": "तालाब, कुण्ड",
    "romaji": "tameike"
  },
  "蓄電池": {
    "en": "storage battery",
    "ta": "சேமிப்பு மின்கலம்",
    "hi": "संचायक बैटरी",
    "romaji": "chikudenchi"
  },
  "古池": {
    "en": "old pond",
    "ta": "பழைய குளம்",
    "hi": "पुराना तालाब",
    "romaji": "furuike"
  },
  "水池": {
    "en": "water reservoir",
    "ta": "நீர் தேக்கம்",
    "hi": "जलाशय",
    "romaji": "mizuike"
  },
  "列島": {
    "en": "archipelago, chain of islands",
    "ta": "தீவுக்கூட்டம்",
    "hi": "द्वीपसमूह",
    "romaji": "rettou"
  },
  "島国": {
    "en": "island country",
    "ta": "தீவு நாடு",
    "hi": "द्वीपीय देश",
    "romaji": "shimaguni"
  },
  "半島": {
    "en": "peninsula",
    "ta": "தீபகற்பம்",
    "hi": "प्रायद्वीप",
    "romaji": "hantou"
  },
  "出港": {
    "en": "departure from port",
    "ta": "துறைமுகத்திலிருந்து புறப்படுதல்",
    "hi": "बंदरगाह से प्रस्थान",
    "romaji": "shukkou"
  },
  "港町": {
    "en": "port city",
    "ta": "துறைமுக நகரம்",
    "hi": "बंदरगाह नगर",
    "romaji": "minatomachi"
  },
  "吊り橋": {
    "en": "suspension bridge",
    "ta": "தொங்கு பாலம்",
    "hi": "झूला पुल",
    "romaji": "tsuribashi"
  },
  "桟橋": {
    "en": "pier, jetty",
    "ta": "துறைமுக பாலம்",
    "hi": "घाट",
    "romaji": "sanbashi"
  },
  "鉄橋": {
    "en": "railway bridge",
    "ta": "இரும்பு பாலம்",
    "hi": "रेलवे पुल",
    "romaji": "tekkyou"
  },
  "歩道橋": {
    "en": "pedestrian bridge",
    "ta": "பாதசாரி பாலம்",
    "hi": "पैदल पुल",
    "romaji": "hodoukyou"
  },
  "－号室": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-gōshitsu"
  },
  "～教室": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "~kyōshitsu"
  },
  "会議室": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaigishitsu"
  },
  "牧場": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bokujō"
  },
  "市役所": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shiyakusho"
  },
  "事務所": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jimusho"
  },
  "台所": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daidokoro"
  },
  "樹皮": {
    "en": "bark (of tree)",
    "ta": "மரப்பட்டை",
    "hi": "पेड़ की छाल",
    "romaji": "juhi"
  },
  "果皮": {
    "en": "fruit peel, rind",
    "ta": "பழத்தோல்",
    "hi": "फल का छिलका",
    "romaji": "kahi"
  },
  "皮肉": {
    "en": "cynicism, sarcasm",
    "ta": "கிண்டல், நையாண்டி",
    "hi": "व्यंग्य",
    "romaji": "hiniku"
  },
  "皮膚": {
    "en": "skin, epidermis",
    "ta": "தோல்",
    "hi": "चमड़ी",
    "romaji": "hifu"
  },
  "毛皮": {
    "en": "fur, pelt",
    "ta": "மயிர் தோல்",
    "hi": "फर",
    "romaji": "kegawa"
  },
  "骨格": {
    "en": "skeleton, skeletal framework",
    "ta": "எலும்புக்கூடு",
    "hi": "कंकाल",
    "romaji": "kokkaku"
  },
  "背骨": {
    "en": "spine, backbone",
    "ta": "முதுகெலும்பு",
    "hi": "रीढ़ की हड्डी",
    "romaji": "sebone"
  },
  "接骨": {
    "en": "bone-setting",
    "ta": "எலும்பு சிகிச்சை",
    "hi": "हड्डी जोड़ना",
    "romaji": "sekkotsu"
  },
  "軟骨": {
    "en": "cartilage",
    "ta": "மிருதுவான எலும்பு",
    "hi": "उपास्थि",
    "romaji": "nankotsu"
  },
  "輸血": {
    "en": "blood transfusion",
    "ta": "இரத்ததானம்",
    "hi": "रक्त आधान",
    "romaji": "yuketsu"
  },
  "冷血": {
    "en": "cold-blooded",
    "ta": "இரக்கமற்ற",
    "hi": "निर्दयी",
    "romaji": "reiketsu"
  },
  "流血": {
    "en": "bloodshed",
    "ta": "இரத்தப்போக்கு",
    "hi": "खून बहना",
    "romaji": "ryuuketsu"
  },
  "血圧": {
    "en": "blood pressure",
    "ta": "இரத்த அழுத்தம்",
    "hi": "रक्तचाप",
    "romaji": "ketsuatsu"
  },
  "鳴き声": {
    "en": "animal cry/chirp",
    "ta": "விலங்கு ஒலி",
    "hi": "पशु-पक्षी की बोली",
    "romaji": "nakigoe"
  },
  "声援": {
    "en": "cheering, support",
    "ta": "ஆரவாரம், ஊக்கம்",
    "hi": "उत्साहवर्धन",
    "romaji": "seien"
  },
  "名声": {
    "en": "fame, reputation",
    "ta": "புகழ்",
    "hi": "ख्याति",
    "romaji": "meisei"
  },
  "小声": {
    "en": "low voice, whisper",
    "ta": "மெல்லிய குரல்",
    "hi": "धीमी आवाज",
    "romaji": "kogoe"
  },
  "大声": {
    "en": "loud voice",
    "ta": "உரத்த குரல்",
    "hi": "ऊंची आवाज",
    "romaji": "oogoe"
  },
  "心配します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinpaishimasu"
  },
  "大体": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daitai"
  },
  "体にいい": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "karadani ii"
  },
  "首長": {
    "en": "chief, head",
    "ta": "தலைவர்",
    "hi": "प्रमुख",
    "romaji": "shuchou"
  },
  "足首": {
    "en": "ankle",
    "ta": "கணுக்கால்",
    "hi": "टखना",
    "romaji": "ashikubi"
  },
  "手首": {
    "en": "wrist",
    "ta": "மணிக்கட்டு",
    "hi": "कलाई",
    "romaji": "tekubi"
  },
  "顔写真": {
    "en": "facial portrait, ID photo",
    "ta": "முக புகைப்படம்",
    "hi": "पहचान फोटो",
    "romaji": "kaojashin"
  },
  "素顔": {
    "en": "bare face, natural face",
    "ta": "இயற்கை முகம்",
    "hi": "प्राकृतिक चेहरा",
    "romaji": "sugao"
  },
  "洗顔": {
    "en": "face washing",
    "ta": "முகம் கழுவுதல்",
    "hi": "मुंह धोना",
    "romaji": "sengan"
  },
  "顔色": {
    "en": "complexion, expression",
    "ta": "முகபாவனை",
    "hi": "चेहरे का रंग",
    "romaji": "kaoiro"
  },
  "口頭": {
    "en": "oral, verbal",
    "ta": "வாய்மொழி",
    "hi": "मौखिक",
    "romaji": "koutou"
  },
  "先頭": {
    "en": "head, lead, forefront",
    "ta": "முன்னணி",
    "hi": "सबसे आगे",
    "romaji": "sentou"
  },
  "腰痛": {
    "en": "lower back pain",
    "ta": "இடுப்பு வலி",
    "hi": "कमर दर्द",
    "romaji": "youtsuu"
  },
  "腹痛": {
    "en": "stomachache",
    "ta": "வயிற்றுவலி",
    "hi": "पेट दर्द",
    "romaji": "fukutsuu"
  },
  "痛い": {
    "en": "",
    "ta": "வலிக்கும்",
    "hi": "दर्दनाक",
    "romaji": "itai"
  },
  "頭痛薬": {
    "en": "headache medicine",
    "ta": "தலைவலி மருந்து",
    "hi": "सिरदर्द की दवा",
    "romaji": "zutsuuyaku"
  },
  "目薬": {
    "en": "eye drops",
    "ta": "கண் மருந்து",
    "hi": "आँख की दवा",
    "romaji": "megusuri"
  },
  "風邪薬": {
    "en": "cold medicine",
    "ta": "சளி மருந்து",
    "hi": "जुकाम की दवा",
    "romaji": "kazegusuri"
  },
  "薬局": {
    "en": "pharmacy, drugstore",
    "ta": "மருந்தகம்",
    "hi": "फार्मेसी",
    "romaji": "yakkyoku"
  },
  "薬屋": {
    "en": "pharmacy",
    "ta": "மருந்துக் கடை",
    "hi": "दवा की दुकान",
    "romaji": "kusuriya"
  },
  "医学部": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "igakubu"
  },
  "歯医者": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "haisha"
  },
  "医者": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "isha"
  },
  "大学院": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daigakuin"
  },
  "美容院": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "biyōin"
  },
  "病人": {
    "en": "sick person, patient",
    "ta": "நோயாளி",
    "hi": "मरीज",
    "romaji": "byounin"
  },
  "急病": {
    "en": "sudden illness",
    "ta": "திடீர் நோய்",
    "hi": "अचानक बीमारी",
    "romaji": "kyuubyou"
  },
  "神戸病院": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kōbebyōin"
  },
  "太ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "futorimasu"
  },
  "聖徳太子": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shōtokutaishi"
  },
  "暗号": {
    "en": "code, cipher",
    "ta": "மறைகுறியீடு",
    "hi": "कूटशब्द, सिफर",
    "romaji": "angou"
  },
  "暗黒": {
    "en": "darkness, gloom",
    "ta": "இருள்",
    "hi": "काला अंधेरा",
    "romaji": "ankoku"
  },
  "暗闇": {
    "en": "darkness",
    "ta": "கடும் இருள்",
    "hi": "घुप अंधेरा",
    "romaji": "kurayami"
  },
  "明るい": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "akarui"
  },
  "明い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "akarui"
  },
  "遠慮なく": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "enryonaku"
  },
  "遠い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tooi"
  },
  "最近": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "saikin"
  },
  "近く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chikaku"
  },
  "近い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chikai"
  },
  "遅刻します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chikokushimasu"
  },
  "遅れる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okureru"
  },
  "速達": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sokutatsu"
  },
  "速い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hayai"
  },
  "狭まる": {
    "en": "to narrow, to contract",
    "ta": "குறுகுதல்",
    "hi": "संकुचित होना",
    "romaji": "sebamaru"
  },
  "手狭": {
    "en": "cramped, small (room)",
    "ta": "இடநெருக்கடி",
    "hi": "तंग जगह",
    "romaji": "tezema"
  },
  "狭義": {
    "en": "narrow sense, strict sense",
    "ta": "குறுகிய பொருள்",
    "hi": "संकीर्ण अर्थ",
    "romaji": "kyougi"
  },
  "狭心症": {
    "en": "angina pectoris",
    "ta": "மார்பு வலி நோய்",
    "hi": "सीने का दर्द",
    "romaji": "kyoushinshou"
  },
  "狭小": {
    "en": "narrow and small",
    "ta": "சிறிய குறுகலான",
    "hi": "अत्यधिक छोटा व संकरा",
    "romaji": "kyoushou"
  },
  "広がる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hirogaru"
  },
  "広めます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hiromemasu"
  },
  "軽快": {
    "en": "lighthearted, nimble, brisk",
    "ta": "மகிழ்ச்சியான, வேகமான",
    "hi": "हल्का-फुल्का, आनंदमय",
    "romaji": "keikai"
  },
  "軽減": {
    "en": "reduction, abatement, mitigation",
    "ta": "குறைத்தல், மட்டுப்படுத்தல்",
    "hi": "कमी, राहत",
    "romaji": "keigen"
  },
  "身軽": {
    "en": "light, nimble, unburdened",
    "ta": "சுறுசுறுப்பான, எடையற்ற",
    "hi": "हल्का-फुल्का, फुर्तीला",
    "romaji": "migaru"
  },
  "軽食": {
    "en": "light meal, snack",
    "ta": "சிற்றுண்டி",
    "hi": "हल्का भोजन",
    "romaji": "keishoku"
  },
  "手軽": {
    "en": "easy, convenient, simple",
    "ta": "எளிதான, வசதியான",
    "hi": "आसान, सुविधाजनक",
    "romaji": "tegaru"
  },
  "重さ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omosa"
  },
  "重い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omoi"
  },
  "弱める": {
    "en": "to weaken, to tone down",
    "ta": "பலவீனப்படுத்துதல்",
    "hi": "धीमा करना",
    "romaji": "yowameru"
  },
  "弱気": {
    "en": "timid, faint-hearted",
    "ta": "தைரியமின்மை",
    "hi": "कमज़ोर दिल",
    "romaji": "yowaki"
  },
  "弱者": {
    "en": "the weak, vulnerable person",
    "ta": "எளியவர்",
    "hi": "कमज़ोर व्यक्ति",
    "romaji": "jakusha"
  },
  "弱点": {
    "en": "weak point, weakness",
    "ta": "பலவீனம்",
    "hi": "कमज़ोरी",
    "romaji": "jakuten"
  },
  "勉強": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "benkyousuru"
  },
  "強い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuyoi"
  },
  "勉強する": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "benkyousuru"
  },
  "冷涼": {
    "en": "cool and crisp",
    "ta": "குளிர்ந்த தென்றல்",
    "hi": "ठंडा और सुहावना",
    "romaji": "reiryou"
  },
  "納涼": {
    "en": "cooling off in summer",
    "ta": "கோடையில் குளிர்ச்சி அடைதல்",
    "hi": "गर्मी से राहत",
    "romaji": "nouryou"
  },
  "涼気": {
    "en": "cool air",
    "ta": "குளிர்ந்த காற்று",
    "hi": "ठंडी बयार",
    "romaji": "ryouki"
  },
  "清涼": {
    "en": "refreshing, cool",
    "ta": "புத்துணர்ச்சியூட்டும் குளிர்ச்சி",
    "hi": "ताज़गी भरी ठंडक",
    "romaji": "seiryou"
  },
  "夕涼み": {
    "en": "enjoying the evening cool",
    "ta": "மாலைத் தென்றல் சுவைத்தல்",
    "hi": "शाम की ठंडक",
    "romaji": "yuusuzumi"
  },
  "暖まる": {
    "en": "to warm up",
    "ta": "சூடாதல்",
    "hi": "गर्म होना",
    "romaji": "atatamaru"
  },
  "温暖化": {
    "en": "global warming",
    "ta": "புவி வெப்பமயமாதல்",
    "hi": "ग्लोबल वार्मिंग",
    "romaji": "ondanka"
  },
  "暖冬": {
    "en": "mild winter",
    "ta": "மிதமான குளிர்காலம்",
    "hi": "हल्की सर्दी",
    "romaji": "dantou"
  },
  "寒流": {
    "en": "cold ocean current",
    "ta": "குளிர்ந்த கடல் நீரோட்டம்",
    "hi": "ठंडी धारा",
    "romaji": "kanryuu"
  },
  "寒帯": {
    "en": "frigid zone, polar region",
    "ta": "துருவப் பகுதி",
    "hi": "शीत कटिबंध",
    "romaji": "kantai"
  },
  "防寒": {
    "en": "protection against cold",
    "ta": "குளிர் பாதுகாப்பு",
    "hi": "ठंड से बचाव",
    "romaji": "boukan"
  },
  "厳寒": {
    "en": "severe cold",
    "ta": "கடும் குளிர்",
    "hi": "कड़ाके की ठंड",
    "romaji": "genkan"
  },
  "寒気": {
    "en": "cold air, chill",
    "ta": "குளிர்ந்த காற்று",
    "hi": "ठंडी हवा",
    "romaji": "kanki"
  },
  "避暑": {
    "en": "summering, avoiding the heat",
    "ta": "கோடை விடுமுறை",
    "hi": "गर्मी से बचना",
    "romaji": "hisho"
  },
  "暑中": {
    "en": "height of summer",
    "ta": "கோடையின் உச்சக்கட்டம்",
    "hi": "गर्मी का चरम",
    "romaji": "shochuu"
  },
  "猛暑": {
    "en": "fierce heat, heat wave",
    "ta": "கடுமையான வெப்ப அலை",
    "hi": "भीषण गर्मी",
    "romaji": "mousho"
  },
  "残暑": {
    "en": "late summer heat",
    "ta": "பிற்கால கோடை வெயில்",
    "hi": "देर से पड़ने वाली गर्मी",
    "romaji": "zansho"
  },
  "押印": {
    "en": "affixing a seal",
    "ta": "முத்திரை குத்துதல்",
    "hi": "मुहर लगाना",
    "romaji": "ouin"
  },
  "押さえる": {
    "en": "to hold down, to suppress",
    "ta": "அடக்குதல்",
    "hi": "दबाकर रखना",
    "romaji": "osaeru"
  },
  "押入れ": {
    "en": "closet (Japanese style)",
    "ta": "சுவர் அலமாரி",
    "hi": "अलमारी",
    "romaji": "oshiire"
  },
  "引きます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hikimasu"
  },
  "引く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hiku"
  },
  "切る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kiru"
  },
  "切符": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kippu"
  },
  "洗濯します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sentakushimasu"
  },
  "洗います": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "araimasu"
  },
  "操作": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sōsa"
  },
  "作る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsukuru"
  },
  "取り替えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "torikaemasu"
  },
  "取り替える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "torikaeru"
  },
  "取ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "torimasu"
  },
  "売ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "urimasu"
  },
  "売り場": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "uriba"
  },
  "自動販売機": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jidōhanbaiki"
  },
  "貸借": {
    "en": "debit and credit, lending & borrowing",
    "ta": "வரவு செலவு",
    "hi": "लेन-देन",
    "romaji": "taishaku"
  },
  "借家": {
    "en": "rented house",
    "ta": "வாடகை வீடு",
    "hi": "किराए का मकान",
    "romaji": "shakuya"
  },
  "借用": {
    "en": "borrowing, loan",
    "ta": "இரவல் பெறுதல்",
    "hi": "उधार लेना",
    "romaji": "shakuyou"
  },
  "貸家": {
    "en": "house for rent",
    "ta": "வாடகை வீடு",
    "hi": "किराये का घर",
    "romaji": "kashiya"
  },
  "賃貸": {
    "en": "lease, rental",
    "ta": "வாடகை",
    "hi": "किराया",
    "romaji": "chintai"
  },
  "貸し出し": {
    "en": "lending, loaning (books)",
    "ta": "இரவல் வழங்குதல்",
    "hi": "उधार पर देना",
    "romaji": "kashidashi"
  },
  "受け持つ": {
    "en": "to take charge of",
    "ta": "பொறுப்பேற்பது",
    "hi": "प्रभार लेना",
    "romaji": "ukemotsu"
  },
  "受け入れる": {
    "en": "to accept, to take in",
    "ta": "ஏற்றுக்கொள்வது",
    "hi": "अपनाना",
    "romaji": "ukeireru"
  },
  "受験": {
    "en": "taking an examination",
    "ta": "தேர்வு எழுதுதல்",
    "hi": "परीक्षा देना",
    "romaji": "juken"
  },
  "放送します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hōsōshimasu"
  },
  "送ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okurimasu"
  },
  "着物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kimono"
  },
  "下着": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shitagi"
  },
  "着く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsuku"
  },
  "降伏": {
    "en": "surrender, capitulation",
    "ta": "சரணடைதல்",
    "hi": "आत्मसमर्पण",
    "romaji": "koufuku"
  },
  "降水": {
    "en": "precipitation, rainfall",
    "ta": "மழைப்பொழிவு",
    "hi": "वर्षा",
    "romaji": "kousui"
  },
  "降車": {
    "en": "getting off a train/vehicle",
    "ta": "வண்டியிலிருந்து இறங்குதல்",
    "hi": "गाड़ी से उतरना",
    "romaji": "kousha"
  },
  "乗り物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "norimono"
  },
  "乗り換えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "norikaemasu"
  },
  "乗り場": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "noriba"
  },
  "歩きます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "arukimasu"
  },
  "歩いて": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aruite"
  },
  "歩く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aruku"
  },
  "逃走": {
    "en": "flight, escape, getaway",
    "ta": "தப்பியோட்டம்",
    "hi": "भाग निकलना",
    "romaji": "tousou"
  },
  "脱走": {
    "en": "escape, desertion",
    "ta": "தப்பி ஓடுதல்",
    "hi": "फरार होना",
    "romaji": "dassou"
  },
  "走行": {
    "en": "running, traveling, driving",
    "ta": "பயணித்தல், ஓட்டுதல்",
    "hi": "गाड़ी चलाना, दौड़ना",
    "romaji": "soukou"
  },
  "競走": {
    "en": "race, running match",
    "ta": "பந்தயம்",
    "hi": "दौड़ प्रतियोगिता",
    "romaji": "kyousou"
  },
  "泳ぎます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oyogimasu"
  },
  "急ぎます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "isogimasu"
  },
  "特急": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tokkyū"
  },
  "急行": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kyūkō"
  },
  "働きすぎ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hatarakisugi"
  },
  "働きます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hatarakimasu"
  },
  "教えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oshiemasu"
  },
  "教える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oshieru"
  },
  "考える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kangaeru"
  },
  "考えます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kangaemasu"
  },
  "思い出す": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omoidasu"
  },
  "思います": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omoimasu"
  },
  "知っています": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shitte imasu"
  },
  "知ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shirimasu"
  },
  "知る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shiru"
  },
  "招待します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shōtaishimasu"
  },
  "待ちます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "machimasu"
  },
  "気持ち": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kimochi"
  },
  "持って来ます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "motte kimasu"
  },
  "持ちます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mochimasu"
  },
  "終える": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oeru"
  },
  "終わり": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "owari"
  },
  "終わります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "owarimasu"
  },
  "初め;始め": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hajime"
  },
  "初め/始め": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hajime"
  },
  "始まる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hajimaru"
  },
  "使います": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tsukaimasu"
  },
  "閉じます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tojimasu"
  },
  "閉めます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shimemasu"
  },
  "開発します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaihatsushimasu"
  },
  "開けます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "akemasu"
  },
  "盲導犬": {
    "en": "guide dog",
    "ta": "வழிகாட்டி நாய்",
    "hi": "मार्गदर्शक कुत्ता",
    "romaji": "moudouken"
  },
  "番犬": {
    "en": "watchdog",
    "ta": "காவல் நாய்",
    "hi": "चौकीदार कुत्ता",
    "romaji": "banken"
  },
  "子犬": {
    "en": "puppy",
    "ta": "நாய்க்குட்டி",
    "hi": "पिल्ला",
    "romaji": "koinu"
  },
  "犬": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "inu"
  },
  "子犬(こいぬ)": {
    "en": "puppy",
    "ta": "puppy",
    "hi": "puppy",
    "romaji": "koinu"
  },
  "犬(いぬ)": {
    "en": "dog",
    "ta": "dog",
    "hi": "dog",
    "romaji": "inu"
  },
  "牡牛座": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oushiza"
  },
  "牛どん": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gyuudon"
  },
  "牛乳": {
    "en": "Milk",
    "ta": "Milk",
    "hi": "Milk",
    "romaji": "gyuunyuu"
  },
  "牛": {
    "en": "cow / cattle",
    "ta": "cow / cattle",
    "hi": "cow / cattle",
    "romaji": "ushi"
  },
  "観光": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kankou"
  },
  "日光": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nikkō"
  },
  "光": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hikari"
  },
  "光る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hikaru"
  },
  "日光(にっこう)": {
    "en": "sunlight / Nikko",
    "ta": "sunlight / Nikko",
    "hi": "sunlight / Nikko",
    "romaji": "nikkou"
  },
  "光る(ひかる)": {
    "en": "to shine",
    "ta": "to shine",
    "hi": "to shine",
    "romaji": "hikaru"
  },
  "録音します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "rokuonshimasu"
  },
  "音楽家": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ongakuka"
  },
  "騒音": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sōon"
  },
  "発音": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hatsuon"
  },
  "音": {
    "en": "sound",
    "ta": "sound",
    "hi": "sound",
    "romaji": "oto"
  },
  "風呂": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "furo"
  },
  "風景": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fuukei"
  },
  "風邪": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaze"
  },
  "お風呂": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ofuro"
  },
  "台風": {
    "en": "typhoon",
    "ta": "typhoon",
    "hi": "typhoon",
    "romaji": "taifuu"
  },
  "風": {
    "en": "Wind",
    "ta": "Wind",
    "hi": "Wind",
    "romaji": "kaze"
  },
  "雪景色": {
    "en": "snowy landscape",
    "ta": "பனி நிலப்பரப்பு",
    "hi": "बर्फ़ीला दृश्य",
    "romaji": "yukigeshiki"
  },
  "雪だるま": {
    "en": "snowman",
    "ta": "பனி மனிதன்",
    "hi": "स्नोमैन",
    "romaji": "yukidaruma"
  },
  "大雪": {
    "en": "heavy snow",
    "ta": "கனமழை பனி",
    "hi": "भारी बर्फबारी",
    "romaji": "ooyuki"
  },
  "雪祭り": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yukimatsuri"
  },
  "雪国": {
    "en": "snow country",
    "ta": "snow country",
    "hi": "snow country",
    "romaji": "yukiguni"
  },
  "雪": {
    "en": "snow",
    "ta": "snow",
    "hi": "snow",
    "romaji": "yuki"
  },
  "有名［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yūmei [na]"
  },
  "有名": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yuumei"
  },
  "名刺": {
    "en": "business card",
    "ta": "business card",
    "hi": "business card",
    "romaji": "meishi"
  },
  "早退します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sōtaishimasu"
  },
  "速い、早い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hayai"
  },
  "早く、速く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hayaku"
  },
  "早起き": {
    "en": "early rising",
    "ta": "early rising",
    "hi": "early rising",
    "romaji": "hayaoki"
  },
  "早い": {
    "en": "early",
    "ta": "early",
    "hi": "early",
    "romaji": "hayai"
  },
  "毎年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mainenmaitoshi"
  },
  "北米": {
    "en": "North America",
    "ta": "வட அமெரிக்கா",
    "hi": "उत्तरी अमेरिका",
    "romaji": "hokubei"
  },
  "東北": {
    "en": "Tohoku region",
    "ta": "வடகிழக்கு பகுதி",
    "hi": "उत्तर-पूर्व",
    "romaji": "touhoku"
  },
  "北口": {
    "en": "north exit",
    "ta": "வடக்கு வாயில்",
    "hi": "उत्तर निकास",
    "romaji": "kitaguchi"
  },
  "葛飾北斎": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "katsushikahokusai"
  },
  "北": {
    "en": "North",
    "ta": "North",
    "hi": "North",
    "romaji": "kita"
  },
  "西南": {
    "en": "southwest",
    "ta": "தென்மேற்கு",
    "hi": "दक्षिण-पश्चिम",
    "romaji": "seinan"
  },
  "東南": {
    "en": "southeast",
    "ta": "தென்கிழக்கு",
    "hi": "दक्षिण-पूर्व",
    "romaji": "tounan"
  },
  "南口": {
    "en": "south exit",
    "ta": "தெற்கு வாயில்",
    "hi": "दक्षिण निकास",
    "romaji": "minamiguchi"
  },
  "南": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "minami"
  },
  "南口(みなみぐち)": {
    "en": "south exit",
    "ta": "south exit",
    "hi": "south exit",
    "romaji": "minamiguchi"
  },
  "南(みなみ)": {
    "en": "south",
    "ta": "south",
    "hi": "south",
    "romaji": "minami"
  },
  "東京大学": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tōkyōdaigaku"
  },
  "東照宮": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tōshōgū"
  },
  "東京": {
    "en": "Tokyo",
    "ta": "Tokyo",
    "hi": "Tokyo",
    "romaji": "toukyou"
  },
  "東": {
    "en": "east",
    "ta": "east",
    "hi": "east",
    "romaji": "higashi"
  },
  "西洋化します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "seiyōkashimasu"
  },
  "西洋": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "seiyou"
  },
  "関西": {
    "en": "関西",
    "ta": "関西",
    "hi": "関西",
    "romaji": "kansai"
  },
  "西": {
    "en": "west",
    "ta": "west",
    "hi": "west",
    "romaji": "nishi"
  },
  "正直": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shoujiki"
  },
  "修正": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shuusei"
  },
  "［お］正月": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] shōgatsu"
  },
  "正月": {
    "en": "New Year, New Year's Day",
    "ta": "New Year, New Year's Day",
    "hi": "New Year, New Year's Day",
    "romaji": "shougatsu"
  },
  "正しい": {
    "en": "correct",
    "ta": "correct",
    "hi": "correct",
    "romaji": "tadashii"
  },
  "端午": {
    "en": "traditional festival",
    "ta": "குழந்தைகள் திருவிழா",
    "hi": "पारंपरिक उत्सव",
    "romaji": "tango"
  },
  "午餐": {
    "en": "luncheon",
    "ta": "மதிய விருந்து",
    "hi": "दोपहर का भोजन",
    "romaji": "gosan"
  },
  "午睡": {
    "en": "siesta, nap",
    "ta": "மதிய தூக்கம்",
    "hi": "दोपहर की नींद",
    "romaji": "gosui"
  },
  "正午": {
    "en": "",
    "ta": "நண்பகல்",
    "hi": "दोपहर",
    "romaji": "shougo"
  },
  "今": {
    "en": "now / right now",
    "ta": "now / right now",
    "hi": "now / right now",
    "romaji": "ima"
  },
  "何分": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nanpun"
  },
  "何階": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nangai"
  },
  "何歳": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nansai (oikutsu)"
  },
  "何～": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nan"
  },
  "何": {
    "en": "what",
    "ta": "what",
    "hi": "what",
    "romaji": "naninan"
  },
  "友情": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yuujou"
  },
  "友": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tomo"
  },
  "親友": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinyuu"
  },
  "友達": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tomodachi"
  },
  "親友(しんゆう)": {
    "en": "best friend",
    "ta": "best friend",
    "hi": "best friend",
    "romaji": "shin'yuu"
  },
  "友達(ともだち)": {
    "en": "friend",
    "ta": "friend",
    "hi": "friend",
    "romaji": "tomodachi"
  },
  "家賃": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yachin"
  },
  "家庭": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "katei"
  },
  "家": {
    "en": "house",
    "ta": "house",
    "hi": "house",
    "romaji": "ie"
  },
  "元気茶": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "genkicha"
  },
  "茶碗": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chawan"
  },
  "茶色": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chairo"
  },
  "紅茶": {
    "en": "black tea",
    "ta": "black tea",
    "hi": "black tea",
    "romaji": "koucha"
  },
  "米国": {
    "en": "USA, America",
    "ta": "அமெரிக்கா",
    "hi": "अमेरिका",
    "romaji": "beikoku"
  },
  "新米": {
    "en": "new rice; novice",
    "ta": "புதிய அரிசி",
    "hi": "नया चावल",
    "romaji": "shinmai"
  },
  "白米(はくまい)": {
    "en": "white rice",
    "ta": "white rice",
    "hi": "white rice",
    "romaji": "hakumai"
  },
  "お米(おこめ)": {
    "en": "uncooked rice",
    "ta": "uncooked rice",
    "hi": "uncooked rice",
    "romaji": "okome"
  },
  "鳥肉": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toriniku"
  },
  "鶏肉": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toriniku"
  },
  "豚肉": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "butaniku"
  },
  "とり肉": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toriniku"
  },
  "牛肉": {
    "en": "Beef",
    "ta": "Beef",
    "hi": "Beef",
    "romaji": "gyuuniku"
  },
  "肉": {
    "en": "meat",
    "ta": "meat",
    "hi": "meat",
    "romaji": "niku"
  },
  "小魚": {
    "en": "small fish",
    "ta": "சிறு மீன்",
    "hi": "छोटी मछली",
    "romaji": "kozakana"
  },
  "金魚": {
    "en": "goldfish",
    "ta": "தங்க மீன்",
    "hi": "सुनहरी मछली",
    "romaji": "kingyo"
  },
  "魚屋": {
    "en": "fishmonger",
    "ta": "மீன் கடை",
    "hi": "मछली की दुकान",
    "romaji": "sakanaya"
  },
  "魚": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sakana"
  },
  "小魚(こざかな)": {
    "en": "small fish",
    "ta": "small fish",
    "hi": "small fish",
    "romaji": "kozakana"
  },
  "魚(さかな)": {
    "en": "fish",
    "ta": "fish",
    "hi": "fish",
    "romaji": "sakana"
  },
  "－円": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-en"
  },
  "丸い;円い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "marui"
  },
  "～円": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "en"
  },
  "丸い/円い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "marui"
  },
  "円": {
    "en": "yen",
    "ta": "yen",
    "hi": "yen",
    "romaji": "en"
  },
  "本当": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hontou"
  },
  "～本": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hon"
  },
  "本棚": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hondana"
  },
  "電子辞書": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "denshijisho"
  },
  "ワゴン車": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "wagonsha"
  },
  "自動車": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jidousha"
  },
  "自転車": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jitensha"
  },
  "電車": {
    "en": "train / electric train",
    "ta": "train / electric train",
    "hi": "train / electric train",
    "romaji": "densha"
  },
  "車": {
    "en": "car, vehicle",
    "ta": "car, vehicle",
    "hi": "car, vehicle",
    "romaji": "kuruma"
  },
  "青年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "seinen"
  },
  "青い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aoi"
  },
  "青": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ao"
  },
  "青空(あおぞら)": {
    "en": "blue sky",
    "ta": "blue sky",
    "hi": "blue sky",
    "romaji": "aozora"
  },
  "青い(あおい)": {
    "en": "blue",
    "ta": "blue",
    "hi": "blue",
    "romaji": "aoi"
  },
  "真っ赤": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "makka"
  },
  "赤ん坊": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "akanbou"
  },
  "赤": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aka"
  },
  "赤ちゃん": {
    "en": "baby, infant",
    "ta": "baby, infant",
    "hi": "baby, infant",
    "romaji": "akachan"
  },
  "赤い": {
    "en": "red",
    "ta": "red",
    "hi": "red",
    "romaji": "akai"
  },
  "黒字": {
    "en": "profit, surplus",
    "ta": "வரவு / லாபம்",
    "hi": "मुनाफ़ा",
    "romaji": "kuroji"
  },
  "真っ黒": {
    "en": "pitch black",
    "ta": "கரும் கருப்பு",
    "hi": "बिल्कुल काला",
    "romaji": "makkuro"
  },
  "大黒ずし": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daikokuzushi"
  },
  "黒": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kuro"
  },
  "黒板": {
    "en": "blackboard",
    "ta": "கரும்பலகை",
    "hi": "ब्लैकबोर्ड",
    "romaji": "kokuban"
  },
  "黒い": {
    "en": "black",
    "ta": "கருப்பு",
    "hi": "काला",
    "romaji": "kuroi"
  },
  "白馬": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hakuba"
  },
  "レジャー白書": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "rejāhakusho"
  },
  "白": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shiro"
  },
  "面白い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omoshiroi"
  },
  "白米": {
    "en": "白米",
    "ta": "வெள்ளை அரிசி",
    "hi": "सफेद चावल",
    "romaji": "hakumai"
  },
  "白い": {
    "en": "White",
    "ta": "White",
    "hi": "White",
    "romaji": "shiroi"
  },
  "気をつけます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kiwo tsukemasu"
  },
  "元気［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "genki [na]"
  },
  "電気": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "denki"
  },
  "元気": {
    "en": "health, vitality",
    "ta": "health, vitality",
    "hi": "health, vitality",
    "romaji": "genki"
  },
  "天気予報": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tenkiyohou"
  },
  "天神祭": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tenjinmatsuri"
  },
  "天才": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tensai"
  },
  "天気": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tenki"
  },
  "天国(てんごく)": {
    "en": "heaven",
    "ta": "heaven",
    "hi": "heaven",
    "romaji": "tengoku"
  },
  "天気(てんき)": {
    "en": "weather",
    "ta": "weather",
    "hi": "weather",
    "romaji": "tenki"
  },
  "好き［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "suki [na]"
  },
  "大好き": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daisuki"
  },
  "好き": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "suki"
  },
  "大好き(だいすき)": {
    "en": "love / very fond of",
    "ta": "love / very fond of",
    "hi": "love / very fond of",
    "romaji": "daisuki"
  },
  "好き(すき)": {
    "en": "like / fond of",
    "ta": "like / fond of",
    "hi": "like / fond of",
    "romaji": "suki"
  },
  "古代": {
    "en": "ancient times",
    "ta": "பழங்காலம்",
    "hi": "प्राचीन काल",
    "romaji": "kodai"
  },
  "古本": {
    "en": "secondhand book",
    "ta": "பழைய புத்தகம்",
    "hi": "पुरानी किताब",
    "romaji": "furuhon"
  },
  "中古": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chuuko"
  },
  "古い": {
    "en": "",
    "ta": "பழைய",
    "hi": "पुराना",
    "romaji": "furui"
  },
  "古本(ふるほん)": {
    "en": "second-hand book",
    "ta": "second-hand book",
    "hi": "second-hand book",
    "romaji": "furuhon"
  },
  "古い(ふるい)": {
    "en": "old (not people)",
    "ta": "old (not people)",
    "hi": "old (not people)",
    "romaji": "furui"
  },
  "新宿": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinjuku"
  },
  "新大阪": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shin'ōsaka"
  },
  "新しい": {
    "en": "new",
    "ta": "new",
    "hi": "new",
    "romaji": "atarashii"
  },
  "安心します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "anshinshimasu"
  },
  "安全［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "anzen [na]"
  },
  "安心": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "anshin"
  },
  "安い": {
    "en": "cheap / inexpensive",
    "ta": "cheap / inexpensive",
    "hi": "cheap / inexpensive",
    "romaji": "yasui"
  },
  "高さ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "takasa"
  },
  "志賀高原": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shigakōgen"
  },
  "背が高い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sega takai"
  },
  "高い": {
    "en": "expensive / tall / high",
    "ta": "expensive / tall / high",
    "hi": "expensive / tall / high",
    "romaji": "takai"
  },
  "社長": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shachō"
  },
  "部長": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "buchō"
  },
  "長い": {
    "en": "long",
    "ta": "long",
    "hi": "long",
    "romaji": "nagai"
  },
  "少年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shounen"
  },
  "少々": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shoushou"
  },
  "もう少し": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mō sukoshi"
  },
  "少し": {
    "en": "Few",
    "ta": "Few",
    "hi": "Few",
    "romaji": "sukoshi"
  },
  "少ない": {
    "en": "a few",
    "ta": "a few",
    "hi": "a few",
    "romaji": "sukunai"
  },
  "滅多に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mettani"
  },
  "多少": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tashou"
  },
  "多くの～": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ōkuno ~"
  },
  "博多": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hakata"
  },
  "多い": {
    "en": "many",
    "ta": "many",
    "hi": "many",
    "romaji": "ooi"
  },
  "小鳥": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kotori"
  },
  "小説": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shousetsu"
  },
  "小沢征爾": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ozawaseiji"
  },
  "小さな": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chiisana"
  },
  "小さい": {
    "en": "small / little",
    "ta": "small / little",
    "hi": "small / little",
    "romaji": "chiisai"
  },
  "大使館": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "taishikan"
  },
  "大勢": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "oozei"
  },
  "大きな": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ookina"
  },
  "大きい": {
    "en": "big / large",
    "ta": "big / large",
    "hi": "big / large",
    "romaji": "ookii"
  },
  "帰りに": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaerini"
  },
  "帰って来ます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaette kimasu"
  },
  "帰り": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaeri"
  },
  "帰ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaerimasu"
  },
  "帰国": {
    "en": "returning to one's home country",
    "ta": "returning to one's home country",
    "hi": "returning to one's home country",
    "romaji": "kikoku"
  },
  "帰る": {
    "en": "to return home",
    "ta": "to return home",
    "hi": "to return home",
    "romaji": "kaeru"
  },
  "起こる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okoru"
  },
  "縁起が悪い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "engiga warui"
  },
  "起こします": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okoshimasu"
  },
  "起きます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okimasu"
  },
  "起こす": {
    "en": "to wake (someone) up",
    "ta": "to wake (someone) up",
    "hi": "to wake (someone) up",
    "romaji": "okosu"
  },
  "起きる": {
    "en": "to wake up / get up",
    "ta": "to wake up / get up",
    "hi": "to wake up / get up",
    "romaji": "okiru"
  },
  "昼休み": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hiruyasumi"
  },
  "休みます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yasumimasu"
  },
  "休み": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yasumi"
  },
  "夏休み": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "natsuyasumi"
  },
  "休日": {
    "en": "day off / holiday",
    "ta": "day off / holiday",
    "hi": "day off / holiday",
    "romaji": "kyuujitsu"
  },
  "休む": {
    "en": "to rest",
    "ta": "to rest",
    "hi": "to rest",
    "romaji": "yasumu"
  },
  "立てる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tateru"
  },
  "役に立ちます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yakuni tachimasu"
  },
  "立ちます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tachimasu"
  },
  "立つ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tatsu"
  },
  "国立(こくりつ)": {
    "en": "national",
    "ta": "national",
    "hi": "national",
    "romaji": "kokuritsu"
  },
  "立つ(たつ)": {
    "en": "to stand",
    "ta": "to stand",
    "hi": "to stand",
    "romaji": "tatsu"
  },
  "出します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "dashimasu"
  },
  "思い出します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omoidashimasu"
  },
  "出かける": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "dekakeru"
  },
  "出す": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "dasu"
  },
  "出る": {
    "en": "to appear,to leave",
    "ta": "to appear,to leave",
    "hi": "to appear,to leave",
    "romaji": "deru"
  },
  "入学": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nyuugakusuru"
  },
  "入れます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "iremasu"
  },
  "入れる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ireru"
  },
  "入る": {
    "en": "to enter,to contain",
    "ta": "to enter,to contain",
    "hi": "to enter,to contain",
    "romaji": "hairu"
  },
  "買い物します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaimonoshimasu"
  },
  "買います": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaimasu"
  },
  "買い物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaimono"
  },
  "買う": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kau"
  },
  "買い物(かいもの)": {
    "en": "shopping",
    "ta": "shopping",
    "hi": "shopping",
    "romaji": "kaimono"
  },
  "買う(かう)": {
    "en": "to buy",
    "ta": "to buy",
    "hi": "to buy",
    "romaji": "kau"
  },
  "飲み水": {
    "en": "drinking water",
    "ta": "குடிநீர்",
    "hi": "पीने का पानी",
    "romaji": "nomimizu"
  },
  "飲食店": {
    "en": "restaurant",
    "ta": "உணவகம்",
    "hi": "रेस्तरां",
    "romaji": "inshokuten"
  },
  "飲み放題": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nomihōdai"
  },
  "飲みます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nomimasu"
  },
  "飲み物": {
    "en": "a drink",
    "ta": "பானம்",
    "hi": "पेय पदार्थ",
    "romaji": "nomimono"
  },
  "飲む": {
    "en": "to drink",
    "ta": "to drink",
    "hi": "to drink",
    "romaji": "nomu"
  },
  "食事します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shokujishimasu"
  },
  "食べます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tabemasu"
  },
  "食べ物": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tabemono"
  },
  "食堂": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shokudou"
  },
  "食事": {
    "en": "meal",
    "ta": "meal",
    "hi": "meal",
    "romaji": "shokujisuru"
  },
  "食べる": {
    "en": "to eat",
    "ta": "to eat",
    "hi": "to eat",
    "romaji": "taberu"
  },
  "見ます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mimasu"
  },
  "伏見": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fushimi"
  },
  "見せる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "miseru"
  },
  "見物": {
    "en": "sightseeing",
    "ta": "sightseeing",
    "hi": "sightseeing",
    "romaji": "kenbutsu"
  },
  "見る": {
    "en": "to see / watch / look",
    "ta": "to see / watch / look",
    "hi": "to see / watch / look",
    "romaji": "miru"
  },
  "アップル銀行": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "appuruginkō"
  },
  "飛行機": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hikouki"
  },
  "行く": {
    "en": "to go",
    "ta": "to go",
    "hi": "to go",
    "romaji": "iku"
  },
  "来ます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kimasu"
  },
  "来る": {
    "en": "to come",
    "ta": "to come",
    "hi": "to come",
    "romaji": "kuru"
  },
  "部門": {
    "en": "division, section",
    "ta": "பிரிவு",
    "hi": "विभाग",
    "romaji": "bumon"
  },
  "名門": {
    "en": "prestigious school/family",
    "ta": "புகழ்பெற்ற நிறுவனம்",
    "hi": "प्रतिष्ठित संस्थान",
    "romaji": "meimon"
  },
  "校門": {
    "en": "school gate",
    "ta": "பள்ளி வாயில்",
    "hi": "स्कूल का फाटक",
    "romaji": "koumon"
  },
  "正門": {
    "en": "main gate",
    "ta": "முக்கிய வாயில்",
    "hi": "मुख्य द्वार",
    "romaji": "seimon"
  },
  "専門": {
    "en": "specialty, field of study",
    "ta": "சிறப்புத் துறை",
    "hi": "विशेषज्ञता",
    "romaji": "senmon"
  },
  "門": {
    "en": "gate",
    "ta": "gate",
    "hi": "gate",
    "romaji": "mon"
  },
  "～町": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chou"
  },
  "みどり町": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "midori chō"
  },
  "町": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "machi"
  },
  "下町(したまち)": {
    "en": "downtown / older part of town",
    "ta": "downtown / older part of town",
    "hi": "downtown / older part of town",
    "romaji": "shitamachi"
  },
  "町(まち)": {
    "en": "town",
    "ta": "town",
    "hi": "town",
    "romaji": "machi"
  },
  "道具": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "dougu"
  },
  "柔道": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "juudou"
  },
  "北海道": {
    "en": "Hokkaido",
    "ta": "ஹொக்கைடோ",
    "hi": "होक्काइडो",
    "romaji": "hokkaidou"
  },
  "道": {
    "en": "street",
    "ta": "street",
    "hi": "street",
    "romaji": "michi"
  },
  "駅前": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ekimae"
  },
  "駅員": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ekiin"
  },
  "本田駅": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hondaeki"
  },
  "東京駅": {
    "en": "Tokyo Station",
    "ta": "Tokyo Station",
    "hi": "Tokyo Station",
    "romaji": "toukyoueki"
  },
  "駅": {
    "en": "train station",
    "ta": "train station",
    "hi": "train station",
    "romaji": "eki"
  },
  "支店": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shiten"
  },
  "店員": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tenin"
  },
  "店": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mise"
  },
  "喫茶店": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kissaten"
  },
  "本店": {
    "en": "本店",
    "ta": "本店",
    "hi": "本店",
    "romaji": "honten"
  },
  "お店": {
    "en": "shop / store",
    "ta": "shop / store",
    "hi": "shop / store",
    "romaji": "omise"
  },
  "［お］国": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] kuni"
  },
  "韓国": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kankoku"
  },
  "会話": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaiwa"
  },
  "電話します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "denwashimasu"
  },
  "話します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hanashimasu"
  },
  "話": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hanashi"
  },
  "電話": {
    "en": "telephone",
    "ta": "telephone",
    "hi": "telephone",
    "romaji": "denwa"
  },
  "話す": {
    "en": "to speak / to talk",
    "ta": "to speak / to talk",
    "hi": "to speak / to talk",
    "romaji": "hanasu"
  },
  "新聞社": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shinbunsha"
  },
  "聞こえる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kikoeru"
  },
  "聞きます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kikimasu"
  },
  "新聞": {
    "en": "newspaper",
    "ta": "newspaper",
    "hi": "newspaper",
    "romaji": "shinbun"
  },
  "聞く": {
    "en": "to listen / to ask / to hear",
    "ta": "to listen / to ask / to hear",
    "hi": "to listen / to ask / to hear",
    "romaji": "kiku"
  },
  "読み": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yomi"
  },
  "読み方": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yomikata"
  },
  "読みます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yomimasu"
  },
  "読書": {
    "en": "reading books",
    "ta": "reading books",
    "hi": "reading books",
    "romaji": "dokusho"
  },
  "読む": {
    "en": "to read",
    "ta": "to read",
    "hi": "to read",
    "romaji": "yomu"
  },
  "みどり図書館": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "midoritoshokan"
  },
  "葉書": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hagaki"
  },
  "図書館": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toshokan"
  },
  "辞書": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jisho"
  },
  "書く": {
    "en": "to write",
    "ta": "to write",
    "hi": "to write",
    "romaji": "kaku"
  },
  "習字": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shūji"
  },
  "ローマ字": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "rōmaji"
  },
  "字": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ji"
  },
  "字引": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jibiki"
  },
  "漢字": {
    "en": "Chinese character",
    "ta": "Chinese character",
    "hi": "Chinese character",
    "romaji": "kanji"
  },
  "文化": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bunka"
  },
  "文学": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bungaku"
  },
  "文法": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "bunpou"
  },
  "作文": {
    "en": "composition, writing",
    "ta": "composition, writing",
    "hi": "composition, writing",
    "romaji": "sakubun"
  },
  "文字": {
    "en": "character / letter",
    "ta": "character / letter",
    "hi": "character / letter",
    "romaji": "moji"
  },
  "語る": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kataru"
  },
  "何語": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nanigo"
  },
  "源氏物語": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "genjimonogatari"
  },
  "～語": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "go"
  },
  "英語": {
    "en": "English language",
    "ta": "English language",
    "hi": "English language",
    "romaji": "eigo"
  },
  "日本語": {
    "en": "the Japanese language",
    "ta": "the Japanese language",
    "hi": "the Japanese language",
    "romaji": "nihongo"
  },
  "誕生日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tanjoubi"
  },
  "生徒": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "seito"
  },
  "生まれる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "umareru"
  },
  "先に": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sakini"
  },
  "先輩": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "senpai"
  },
  "先": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "saki"
  },
  "先生": {
    "en": "teacher, doctor",
    "ta": "teacher, doctor",
    "hi": "teacher, doctor",
    "romaji": "sensei"
  },
  "高校生": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "koukousei"
  },
  "校長": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kouchou"
  },
  "小学校": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shougakkou"
  },
  "高校": {
    "en": "senior high school",
    "ta": "senior high school",
    "hi": "senior high school",
    "romaji": "kōkō"
  },
  "見学します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kengakushimasu"
  },
  "留学生": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ryuugakusei"
  },
  "学生": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gakusei"
  },
  "大学": {
    "en": "university",
    "ta": "university",
    "hi": "university",
    "romaji": "daigaku"
  },
  "学校": {
    "en": "school",
    "ta": "school",
    "hi": "school",
    "romaji": "gakkou"
  },
  "～後": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "~go"
  },
  "最後": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "saigo"
  },
  "明後日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "asatte"
  },
  "後ろ": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ushiro"
  },
  "午後": {
    "en": "afternoon",
    "ta": "பிற்பகல்",
    "hi": "अपराह्न",
    "romaji": "gogo"
  },
  "後": {
    "en": "afterwards",
    "ta": "afterwards",
    "hi": "afterwards",
    "romaji": "ato"
  },
  "図書館前": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toshokanmae"
  },
  "大学前": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "daigakumae"
  },
  "～前": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mae"
  },
  "午前": {
    "en": "",
    "ta": "முற்பகல்",
    "hi": "पूर्वाह्न",
    "romaji": "gozen"
  },
  "名前": {
    "en": "name",
    "ta": "name",
    "hi": "name",
    "romaji": "namae"
  },
  "前": {
    "en": "before",
    "ta": "before",
    "hi": "before",
    "romaji": "mae"
  },
  "左足": {
    "en": "left foot",
    "ta": "இடது கால்",
    "hi": "बायाँ पैर",
    "romaji": "hidariashi"
  },
  "左側": {
    "en": "left side",
    "ta": "இடது பக்கம்",
    "hi": "बाईं तरफ",
    "romaji": "hidarigawa"
  },
  "左手": {
    "en": "left hand",
    "ta": "இடது கை",
    "hi": "बायाँ हाथ",
    "romaji": "hidarite"
  },
  "左": {
    "en": "left hand side",
    "ta": "left hand side",
    "hi": "left hand side",
    "romaji": "hidari"
  },
  "右折": {
    "en": "right turn",
    "ta": "வலதுபுற திருப்பம்",
    "hi": "दाहिना मोड़",
    "romaji": "usetsu"
  },
  "右足": {
    "en": "right foot",
    "ta": "வலது கால்",
    "hi": "दाहिना पैर",
    "romaji": "migiashi"
  },
  "右側": {
    "en": "right side",
    "ta": "வலது பக்கம்",
    "hi": "दाहिनी तरफ",
    "romaji": "migigawa"
  },
  "左右": {
    "en": "",
    "ta": "இடமும் வலமும்",
    "hi": "बायाँ और दायाँ",
    "romaji": "sayuu"
  },
  "右手": {
    "en": "right hand",
    "ta": "வலது கை",
    "hi": "दाहिना हाथ",
    "romaji": "migite"
  },
  "右": {
    "en": "right side",
    "ta": "right side",
    "hi": "right side",
    "romaji": "migi"
  },
  "以外": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "igai"
  },
  "郊外": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kougai"
  },
  "外国人登録証": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gaikokujintōrokushō"
  },
  "外国": {
    "en": "foreign country",
    "ta": "foreign country",
    "hi": "foreign country",
    "romaji": "gaikoku"
  },
  "外": {
    "en": "Outside",
    "ta": "Outside",
    "hi": "Outside",
    "romaji": "soto"
  },
  "中々": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nakanaka"
  },
  "中学校": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chuugakkou"
  },
  "～中": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "juu"
  },
  "中国": {
    "en": "China",
    "ta": "China",
    "hi": "China",
    "romaji": "chūgoku"
  },
  "中": {
    "en": "middle",
    "ta": "middle",
    "hi": "middle",
    "romaji": "naka"
  },
  "廊下": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "rouka"
  },
  "下さい": {
    "en": "(with te-form verb) please do for me",
    "ta": "(with te-form verb) please do for me",
    "hi": "(with te-form verb) please do for me",
    "romaji": "kudasai"
  },
  "下": {
    "en": "Below",
    "ta": "Below",
    "hi": "Below",
    "romaji": "shita"
  },
  "屋上": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okujou"
  },
  "上手［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jōzu [na]"
  },
  "上げる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ageru"
  },
  "上": {
    "en": "on top of",
    "ta": "on top of",
    "hi": "on top of",
    "romaji": "ue"
  },
  "協力": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kyouryoku"
  },
  "協力します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kyōryokushimasu"
  },
  "入力します": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "nyūryokushimasu"
  },
  "力持ち": {
    "en": "strong person",
    "ta": "strong person",
    "hi": "strong person",
    "romaji": "chikaramochi"
  },
  "力": {
    "en": "strength, power",
    "ta": "strength, power",
    "hi": "strength, power",
    "romaji": "chikara"
  },
  "初耳": {
    "en": "hearing for the first time",
    "ta": "முதல்முறை கேட்பது",
    "hi": "पहली बार सुनना",
    "romaji": "hatsumimi"
  },
  "耳たぶ": {
    "en": "earlobe",
    "ta": "காது மடல்",
    "hi": "कान की लौ",
    "romaji": "mimitabu"
  },
  "耳鳴り": {
    "en": "ringing in ears, tinnitus",
    "ta": "காது இரைச்சல்",
    "hi": "कान बजना",
    "romaji": "miminari"
  },
  "耳": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mimi"
  },
  "初耳(はつみみ)": {
    "en": "hearing something for the first time",
    "ta": "hearing something for the first time",
    "hi": "hearing something for the first time",
    "romaji": "hatsumimi"
  },
  "耳(みみ)": {
    "en": "ear",
    "ta": "ear",
    "hi": "ear",
    "romaji": "mimi"
  },
  "不足": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fusoku"
  },
  "足す": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tasu"
  },
  "足ります": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tarimasu"
  },
  "足;脚": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ashi"
  },
  "足りる": {
    "en": "to be sufficient; to be enough",
    "ta": "to be sufficient; to be enough",
    "hi": "to be sufficient; to be enough",
    "romaji": "tariru"
  },
  "足": {
    "en": "foot / leg",
    "ta": "foot / leg",
    "hi": "foot / leg",
    "romaji": "ashi"
  },
  "下手": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "heta"
  },
  "切手": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kitte"
  },
  "お手洗い": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "otearai"
  },
  "手紙": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tegami"
  },
  "上手": {
    "en": "Skillful",
    "ta": "Skillful",
    "hi": "Skillful",
    "romaji": "jouzu"
  },
  "手": {
    "en": "hand",
    "ta": "hand",
    "hi": "hand",
    "romaji": "te"
  },
  "利口": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "rikou"
  },
  "非常口": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hijōguchi"
  },
  "人口": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jinkou"
  },
  "入口": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "iriguchi"
  },
  "出口": {
    "en": "exit",
    "ta": "exit",
    "hi": "exit",
    "romaji": "deguchi"
  },
  "口": {
    "en": "mouth",
    "ta": "mouth",
    "hi": "mouth",
    "romaji": "kuchi"
  },
  "～目": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "me"
  },
  "真面目": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "majime"
  },
  "－目": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-me"
  },
  "－段目": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "~danme"
  },
  "目": {
    "en": "eye",
    "ta": "eye",
    "hi": "eye",
    "romaji": "me"
  },
  "母親": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hahaoya"
  },
  "母の味": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hahano aji"
  },
  "母の日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hahano hi"
  },
  "お母さん": {
    "en": "(honorable) mother",
    "ta": "(honorable) mother",
    "hi": "(honorable) mother",
    "romaji": "okaasan"
  },
  "母": {
    "en": "(my) mother",
    "ta": "(my) mother",
    "hi": "(my) mother",
    "romaji": "haha"
  },
  "父親": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chichioya"
  },
  "伯父/叔父": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ojiisan"
  },
  "お父さん": {
    "en": "(honorable) father",
    "ta": "(honorable) father",
    "hi": "(honorable) father",
    "romaji": "otousan"
  },
  "父": {
    "en": "(my) father",
    "ta": "(my) father",
    "hi": "(my) father",
    "romaji": "chichi"
  },
  "男子": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "danshi"
  },
  "長男": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "chōnan"
  },
  "男の人": {
    "en": "man",
    "ta": "man",
    "hi": "man",
    "romaji": "otokono hito"
  },
  "男": {
    "en": "Man",
    "ta": "Man",
    "hi": "Man",
    "romaji": "otoko"
  },
  "少女": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shoujo"
  },
  "女性": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "josei"
  },
  "彼女": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kanojo"
  },
  "女の人": {
    "en": "woman",
    "ta": "woman",
    "hi": "woman",
    "romaji": "onnano hito"
  },
  "女": {
    "en": "Woman",
    "ta": "Woman",
    "hi": "Woman",
    "romaji": "onna"
  },
  "女の子": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "onnanoko"
  },
  "男の子": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "otokonoko"
  },
  "お菓子": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "okashi"
  },
  "女子": {
    "en": "girl / woman",
    "ta": "girl / woman",
    "hi": "girl / woman",
    "romaji": "joshi"
  },
  "一人": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hitori"
  },
  "外国人": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gaikokujin"
  },
  "大人": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "otona"
  },
  "日本人": {
    "en": "Japanese person",
    "ta": "Japanese person",
    "hi": "Japanese person",
    "romaji": "nihonjin"
  },
  "人": {
    "en": "person",
    "ta": "person",
    "hi": "person",
    "romaji": "hito"
  },
  "除草": {
    "en": "weeding",
    "ta": "களை எடுத்தல்",
    "hi": "निराई",
    "romaji": "josou"
  },
  "雑草": {
    "en": "weed",
    "ta": "களைப்புல்",
    "hi": "खरपतवार",
    "romaji": "zassou"
  },
  "草原": {
    "en": "grassland, meadow",
    "ta": "புல்வெளி",
    "hi": "घास का मैदान",
    "romaji": "sougen"
  },
  "草津": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kusatsu"
  },
  "草花": {
    "en": "flowering plants",
    "ta": "புல் பூக்கள்",
    "hi": "फूलदार पौधे",
    "romaji": "kusabana"
  },
  "草": {
    "en": "grass",
    "ta": "grass",
    "hi": "grass",
    "romaji": "kusa"
  },
  "花見": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hanami"
  },
  "生け花": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ikebana"
  },
  "［お］花見": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] hanami"
  },
  "花瓶": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kabin"
  },
  "花": {
    "en": "flower",
    "ta": "flower",
    "hi": "flower",
    "romaji": "hana"
  },
  "雨期": {
    "en": "rainy season",
    "ta": "மழைக்காலம்",
    "hi": "बरसात का मौसम",
    "romaji": "uki"
  },
  "雨水": {
    "en": "rainwater",
    "ta": "மழைநீர்",
    "hi": "बारिश का पानी",
    "romaji": "amamizu"
  },
  "小雨": {
    "en": "drizzle, light rain",
    "ta": "தூறல்",
    "hi": "बूंदाबांदी",
    "romaji": "kosame"
  },
  "梅雨": {
    "en": "",
    "ta": "ஜப்பானிய மழைக்காலம்",
    "hi": "जापान की बारिश का मौसम",
    "romaji": "tsuyu"
  },
  "大雨": {
    "en": "heavy rain",
    "ta": "கனமழை",
    "hi": "भारी बारिश",
    "romaji": "ooame"
  },
  "雨": {
    "en": "rain",
    "ta": "rain",
    "hi": "rain",
    "romaji": "ame"
  },
  "関西空港": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kansaikūkō"
  },
  "空く": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aku"
  },
  "空気": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kuuki"
  },
  "航空便": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kōkūbin (eamēru)"
  },
  "空": {
    "en": "Sky",
    "ta": "Sky",
    "hi": "Sky",
    "romaji": "sora"
  },
  "現金": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "genkin"
  },
  "細かいお金": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "komakai okane"
  },
  "金曜日": {
    "en": "Friday",
    "ta": "Friday",
    "hi": "Friday",
    "romaji": "kinyoubi"
  },
  "お金": {
    "en": "money",
    "ta": "money",
    "hi": "money",
    "romaji": "okane"
  },
  "土地": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tochi"
  },
  "土井隆雄": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "doitakao"
  },
  "お土産": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "omiyage"
  },
  "［お］土産": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "[o] miyage"
  },
  "土曜日": {
    "en": "Saturday",
    "ta": "Saturday",
    "hi": "Saturday",
    "romaji": "doyoubi"
  },
  "土": {
    "en": "Saturday",
    "ta": "Saturday",
    "hi": "Saturday",
    "romaji": "do"
  },
  "水準": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "suijun"
  },
  "月・水・金": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "gessuikin"
  },
  "水道": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "suidou"
  },
  "水曜日": {
    "en": "Wednesday",
    "ta": "Wednesday",
    "hi": "Wednesday",
    "romaji": "suiyoubi"
  },
  "水": {
    "en": "water",
    "ta": "water",
    "hi": "water",
    "romaji": "mizu"
  },
  "火災": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kasai"
  },
  "火にかけます": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hini kakemasu"
  },
  "花火": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hanabi"
  },
  "火事": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kaji"
  },
  "火曜日": {
    "en": "Tuesday",
    "ta": "Tuesday",
    "hi": "Tuesday",
    "romaji": "kayoubi"
  },
  "火": {
    "en": "fire",
    "ta": "fire",
    "hi": "fire",
    "romaji": "hi"
  },
  "大木": {
    "en": "large tree",
    "ta": "பெரிய மரம்",
    "hi": "बड़ा पेड़",
    "romaji": "taiboku"
  },
  "草木": {
    "en": "plants, vegetation",
    "ta": "தாவரங்கள்",
    "hi": "पेड़-पौधे",
    "romaji": "kusaki"
  },
  "木曜": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mokuyou"
  },
  "木綿": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "momen"
  },
  "木曜日": {
    "en": "Thursday",
    "ta": "வியாழக்கிழமை",
    "hi": "गुरुवार",
    "romaji": "mokuyoubi"
  },
  "木": {
    "en": "tree, wood",
    "ta": "tree, wood",
    "hi": "tree, wood",
    "romaji": "ki"
  },
  "川岸": {
    "en": "riverbank",
    "ta": "ஆற்றங்கரை",
    "hi": "नदी का किनारा",
    "romaji": "kawagishi"
  },
  "小川": {
    "en": "stream, brook",
    "ta": "சிற்றோடை",
    "hi": "छोटी नदी",
    "romaji": "ogawa"
  },
  "川;河": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kawa"
  },
  "川/河": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kawa"
  },
  "川口": {
    "en": "river mouth",
    "ta": "river mouth",
    "hi": "river mouth",
    "romaji": "kawaguchi"
  },
  "川": {
    "en": "river",
    "ta": "river",
    "hi": "river",
    "romaji": "kawa"
  },
  "山中伸弥": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yamanakashin'ya"
  },
  "山登り": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yamanobori"
  },
  "吉野山": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yoshinoyama"
  },
  "沢山": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "takusan"
  },
  "富士山": {
    "en": "Mt. Fuji, the highest mountain in Japan",
    "ta": "Mt. Fuji, the highest mountain in Japan",
    "hi": "Mt. Fuji, the highest mountain in Japan",
    "romaji": "fujisan"
  },
  "山": {
    "en": "mountain",
    "ta": "mountain",
    "hi": "mountain",
    "romaji": "yama"
  },
  "半年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hantoshi"
  },
  "一時半": {
    "en": "half past one (1:30)",
    "ta": "half past one (1:30)",
    "hi": "half past one (1:30)",
    "romaji": "ichijihan"
  },
  "－週間": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-shūkan"
  },
  "毎週": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "maishuu"
  },
  "先週": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "senshuu"
  },
  "来週": {
    "en": "next week",
    "ta": "next week",
    "hi": "next week",
    "romaji": "raishuu"
  },
  "今週": {
    "en": "this week",
    "ta": "this week",
    "hi": "this week",
    "romaji": "konshuu"
  },
  "～分": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "fun"
  },
  "多分": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tabun"
  },
  "分かる": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "wakaru"
  },
  "半分": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hanbun"
  },
  "自分": {
    "en": "Oneself",
    "ta": "Oneself",
    "hi": "Oneself",
    "romaji": "jibun"
  },
  "－時間": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "-jikan"
  },
  "間": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "aida"
  },
  "～週間": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shuukan"
  },
  "人間": {
    "en": "human being",
    "ta": "human being",
    "hi": "human being",
    "romaji": "ningen"
  },
  "～時間": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jikan"
  },
  "～時": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ji"
  },
  "時々": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tokidoki"
  },
  "時計": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tokei"
  },
  "時間": {
    "en": "Time",
    "ta": "Time",
    "hi": "Time",
    "romaji": "jikan"
  },
  "何時": {
    "en": "what time",
    "ta": "what time",
    "hi": "what time",
    "romaji": "nanji"
  },
  "毎日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mainichi"
  },
  "昨日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kinou"
  },
  "明日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ashita"
  },
  "日本": {
    "en": "Japan",
    "ta": "Japan",
    "hi": "Japan",
    "romaji": "nihon"
  },
  "今日": {
    "en": "today",
    "ta": "today",
    "hi": "today",
    "romaji": "kyou"
  },
  "来月": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "raigetsu"
  },
  "毎月": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "maigetsumaitsuki"
  },
  "一月": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hitotsuki"
  },
  "先月": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sengetsu"
  },
  "月曜日": {
    "en": "Monday",
    "ta": "Monday",
    "hi": "Monday",
    "romaji": "getsuyoubi"
  },
  "今月": {
    "en": "this month",
    "ta": "this month",
    "hi": "this month",
    "romaji": "kongetsu"
  },
  "年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "toshi"
  },
  "さ来年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sarainen"
  },
  "去年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kyonen"
  },
  "来年": {
    "en": "next year",
    "ta": "next year",
    "hi": "next year",
    "romaji": "rainen"
  },
  "今年": {
    "en": "this year",
    "ta": "this year",
    "hi": "this year",
    "romaji": "kotoshi"
  },
  "万一": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "manichi"
  },
  "万里の長城": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "banrino chōjō"
  },
  "万年筆": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "mannenhitsu"
  },
  "万": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "man"
  },
  "万年": {
    "en": "ten thousand years",
    "ta": "ten thousand years",
    "hi": "ten thousand years",
    "romaji": "mannen"
  },
  "一万": {
    "en": "10,000",
    "ta": "10,000",
    "hi": "10,000",
    "romaji": "ichiman"
  },
  "千葉": {
    "en": "Chiba prefecture",
    "ta": "சிபா மாகாணம்",
    "hi": "चीबा प्रान्त",
    "romaji": "chiba"
  },
  "八千": {
    "en": "eight thousand",
    "ta": "எட்டாயிரம்",
    "hi": "आठ हज़ार",
    "romaji": "hassen"
  },
  "三千": {
    "en": "three thousand",
    "ta": "மூன்றாயிரம்",
    "hi": "तीन हज़ार",
    "romaji": "sanzen"
  },
  "千": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sen"
  },
  "二千": {
    "en": "2,000",
    "ta": "2,000",
    "hi": "2,000",
    "romaji": "nisen"
  },
  "千円": {
    "en": "1,000 yen",
    "ta": "ஆயிரம் யென்",
    "hi": "एक हज़ार येन",
    "romaji": "senen"
  },
  "安藤百福": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "andōmomofuku"
  },
  "百": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hyaku"
  },
  "三百": {
    "en": "300",
    "ta": "300",
    "hi": "300",
    "romaji": "sanbyaku"
  },
  "百円": {
    "en": "100 yen",
    "ta": "100 yen",
    "hi": "100 yen",
    "romaji": "hyakuen"
  },
  "十分［な］": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "jūbun [na]"
  },
  "十分": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "juubun"
  },
  "十日": {
    "en": "ten days,the tenth day",
    "ta": "ten days,the tenth day",
    "hi": "ten days,the tenth day",
    "romaji": "tooka"
  },
  "十": {
    "en": "とお Ten",
    "ta": "とお Ten",
    "hi": "とお Ten",
    "romaji": "juu"
  },
  "九人": {
    "en": "nine people",
    "ta": "ஒன்பது பேர்",
    "hi": "नौ लोग",
    "romaji": "kyuunin"
  },
  "九十": {
    "en": "ninety",
    "ta": "தொண்ணூறு",
    "hi": "नब्बे",
    "romaji": "kyuujuu"
  },
  "九月": {
    "en": "September",
    "ta": "செப்டம்பர்",
    "hi": "सितंबर",
    "romaji": "kugatsu"
  },
  "九": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "kyuu"
  },
  "九日": {
    "en": "nine days, ninth day",
    "ta": "ஒன்பதாவது நாள்",
    "hi": "नौ दिन",
    "romaji": "kokonoka"
  },
  "九つ": {
    "en": "Nine",
    "ta": "Nine",
    "hi": "Nine",
    "romaji": "kokonotsu"
  },
  "八十": {
    "en": "eighty",
    "ta": "எண்பது",
    "hi": "अस्सी",
    "romaji": "hachijuu"
  },
  "八月": {
    "en": "August",
    "ta": "ஆகஸ்ட்",
    "hi": "अगस्त",
    "romaji": "hachigatsu"
  },
  "八百屋": {
    "en": "",
    "ta": "காய்கறி கடைக்காரர்",
    "hi": "सब्जी विक्रेता",
    "romaji": "yaoya"
  },
  "八": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hachi"
  },
  "八日": {
    "en": "eight days, eighth day of the month",
    "ta": "எட்டாவது நாள்",
    "hi": "आठ दिन",
    "romaji": "youka"
  },
  "八つ": {
    "en": "eight",
    "ta": "eight",
    "hi": "eight",
    "romaji": "yattsu"
  },
  "七夕祭り": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "tanabatamatsuri"
  },
  "「七人の侍」": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "(shichininno samurai)"
  },
  "七": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shichi"
  },
  "七日": {
    "en": "seven days,the seventh day",
    "ta": "seven days,the seventh day",
    "hi": "seven days,the seventh day",
    "romaji": "nanoka"
  },
  "七つ": {
    "en": "seven",
    "ta": "seven",
    "hi": "seven",
    "romaji": "nanatsu"
  },
  "六十": {
    "en": "sixty",
    "ta": "அறுபது",
    "hi": "साठ",
    "romaji": "rokujuu"
  },
  "六分": {
    "en": "six minutes",
    "ta": "ஆறு நிமிடங்கள்",
    "hi": "छह मिनट",
    "romaji": "roppun"
  },
  "六月": {
    "en": "June",
    "ta": "ஜூன்",
    "hi": "जून",
    "romaji": "rokugatsu"
  },
  "六": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "roku"
  },
  "六日": {
    "en": "six days, sixth day of the month",
    "ta": "ஆறாவது நாள்",
    "hi": "छह दिन",
    "romaji": "muika"
  },
  "六つ": {
    "en": "six",
    "ta": "six",
    "hi": "six",
    "romaji": "muttsu"
  },
  "五分": {
    "en": "five minutes",
    "ta": "ஐந்து நிமிடங்கள்",
    "hi": "पाँच मिनट",
    "romaji": "gofun"
  },
  "五月": {
    "en": "May",
    "ta": "மே",
    "hi": "मई",
    "romaji": "gogatsu"
  },
  "左甚五郎": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hidarijingorō"
  },
  "五": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "go"
  },
  "五日": {
    "en": "five days, fifth day",
    "ta": "ஐந்தாவது நாள்",
    "hi": "पाँच दिन",
    "romaji": "itsuka"
  },
  "五つ": {
    "en": "five",
    "ta": "five",
    "hi": "five",
    "romaji": "itsutsu"
  },
  "四季": {
    "en": "four seasons",
    "ta": "நான்கு பருவங்கள்",
    "hi": "चार मौसम",
    "romaji": "shiki"
  },
  "四月": {
    "en": "April",
    "ta": "ஏப்ரல்",
    "hi": "अप्रैल",
    "romaji": "shigatsu"
  },
  "四ツ谷": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "yotsuya"
  },
  "四": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "shi"
  },
  "四日": {
    "en": "four days, fouth day of the month",
    "ta": "நான்காவது நாள்",
    "hi": "चार दिन",
    "romaji": "yokka"
  },
  "四つ": {
    "en": "four",
    "ta": "four",
    "hi": "four",
    "romaji": "yottsu"
  },
  "三宮": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "sannomiya"
  },
  "三": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "san"
  },
  "三日": {
    "en": "three days, third day of the month",
    "ta": "three days, third day of the month",
    "hi": "three days, third day of the month",
    "romaji": "mikka"
  },
  "三つ": {
    "en": "three",
    "ta": "three",
    "hi": "three",
    "romaji": "mittsu"
  },
  "二人": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "futari"
  },
  "二十日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hatsuka"
  },
  "二十歳": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "hatachi"
  },
  "二": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ni"
  },
  "二日": {
    "en": "two days, second day of the month",
    "ta": "two days, second day of the month",
    "hi": "two days, second day of the month",
    "romaji": "futsuka"
  },
  "二つ": {
    "en": "two",
    "ta": "two",
    "hi": "two",
    "romaji": "futatsu"
  },
  "一昨年": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ototoshi"
  },
  "一昨日": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ototoi"
  },
  "一緒": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "issho"
  },
  "一": {
    "en": "",
    "ta": "",
    "hi": "",
    "romaji": "ichi"
  },
  "一日": {
    "en": "first of the month",
    "ta": "first of the month",
    "hi": "first of the month",
    "romaji": "ichinichi"
  },
  "一つ": {
    "en": "one (general counter)",
    "ta": "one (general counter)",
    "hi": "one (general counter)",
    "romaji": "hitotsu"
  },
  "開始": {
    "en": "start,commencement,beginning",
    "ta": "start,commencement,beginning",
    "hi": "start,commencement,beginning",
    "romaji": "kaishi"
  },
  "開く": {
    "en": "to open; to hold (an event)",
    "ta": "to open; to hold (an event)",
    "hi": "to open; to hold (an event)",
    "romaji": "hiraku"
  },
  "開ける": {
    "en": "to open",
    "ta": "to open",
    "hi": "to open",
    "romaji": "akeru"
  },
  "閉じる": {
    "en": "to close (e.g. book, eyes),to shut",
    "ta": "to close (e.g. book, eyes),to shut",
    "hi": "to close (e.g. book, eyes),to shut",
    "romaji": "tojiru"
  },
  "閉まる": {
    "en": "to close, to be closed",
    "ta": "to close, to be closed",
    "hi": "to close, to be closed",
    "romaji": "shimaru"
  },
  "閉める": {
    "en": "to close something",
    "ta": "to close something",
    "hi": "to close something",
    "romaji": "shimeru"
  },
  "使用": {
    "en": "use,application,employment,utilization",
    "ta": "use,application,employment,utilization",
    "hi": "use,application,employment,utilization",
    "romaji": "shiyou"
  },
  "大使": {
    "en": "ambassador",
    "ta": "ambassador",
    "hi": "ambassador",
    "romaji": "taishi"
  },
  "使う": {
    "en": "to use",
    "ta": "பயன்படுத்து",
    "hi": "उपयोग करना",
    "romaji": "tsukau"
  },
  "始まり": {
    "en": "origin,beginning",
    "ta": "origin,beginning",
    "hi": "origin,beginning",
    "romaji": "hajimari"
  },
  "始める": {
    "en": "to start, to begin",
    "ta": "to start, to begin",
    "hi": "to start, to begin",
    "romaji": "hajimeru"
  },
  "終": {
    "en": "the end",
    "ta": "the end",
    "hi": "the end",
    "romaji": "owari"
  },
  "最終": {
    "en": "last,final,closing",
    "ta": "last,final,closing",
    "hi": "last,final,closing",
    "romaji": "saishuu"
  },
  "終る": {
    "en": "to finish",
    "ta": "to finish",
    "hi": "to finish",
    "romaji": "owaru"
  },
  "維持": {
    "en": "maintenance / preservation / sustaining",
    "ta": "maintenance / preservation / sustaining",
    "hi": "maintenance / preservation / sustaining",
    "romaji": "iji"
  },
  "持つ": {
    "en": "to hold",
    "ta": "to hold",
    "hi": "to hold",
    "romaji": "motsu"
  },
  "金持ち": {
    "en": "rich man",
    "ta": "rich man",
    "hi": "rich man",
    "romaji": "kanemochi"
  },
  "期待": {
    "en": "expectation,anticipation,hope",
    "ta": "expectation,anticipation,hope",
    "hi": "expectation,anticipation,hope",
    "romaji": "kitai"
  },
  "招待": {
    "en": "invitation",
    "ta": "invitation",
    "hi": "invitation",
    "romaji": "shoutai"
  },
  "待つ": {
    "en": "to wait",
    "ta": "to wait",
    "hi": "to wait",
    "romaji": "matsu"
  },
  "承知": {
    "en": "consent,acceptance,assent,admitting",
    "ta": "consent,acceptance,assent,admitting",
    "hi": "consent,acceptance,assent,admitting",
    "romaji": "shouchi"
  },
  "知恵": {
    "en": "wisdom,wit,sagacity,sense,intelligence,advice",
    "ta": "wisdom,wit,sagacity,sense,intelligence,advice",
    "hi": "wisdom,wit,sagacity,sense,intelligence,advice",
    "romaji": "chie"
  },
  "知事": {
    "en": "prefectural governor",
    "ta": "prefectural governor",
    "hi": "prefectural governor",
    "romaji": "chiji"
  },
  "意思": {
    "en": "intention,purpose",
    "ta": "intention,purpose",
    "hi": "intention,purpose",
    "romaji": "ishi"
  },
  "思想": {
    "en": "thought,idea",
    "ta": "thought,idea",
    "hi": "thought,idea",
    "romaji": "shisou"
  },
  "思う": {
    "en": "to think, to feel",
    "ta": "to think, to feel",
    "hi": "to think, to feel",
    "romaji": "omou"
  },
  "考え": {
    "en": "thinking,thought,ideas,intention",
    "ta": "thinking,thought,ideas,intention",
    "hi": "thinking,thought,ideas,intention",
    "romaji": "kangae"
  },
  "考慮": {
    "en": "consideration,taking into account",
    "ta": "consideration,taking into account",
    "hi": "consideration,taking into account",
    "romaji": "kouryo"
  },
  "参考": {
    "en": "reference,consultation",
    "ta": "reference,consultation",
    "hi": "reference,consultation",
    "romaji": "sankou"
  },
  "教師": {
    "en": "teacher (classroom)",
    "ta": "teacher (classroom)",
    "hi": "teacher (classroom)",
    "romaji": "kyoushi"
  },
  "教授": {
    "en": "teaching,instruction,professor",
    "ta": "teaching,instruction,professor",
    "hi": "teaching,instruction,professor",
    "romaji": "kyouju"
  },
  "宗教": {
    "en": "religion",
    "ta": "religion",
    "hi": "religion",
    "romaji": "shuukyou"
  },
  "働き": {
    "en": "work,labor",
    "ta": "work,labor",
    "hi": "work,labor",
    "romaji": "hataraki"
  },
  "労働": {
    "en": "manual labor,toil,work",
    "ta": "manual labor,toil,work",
    "hi": "manual labor,toil,work",
    "romaji": "roudou"
  },
  "働く": {
    "en": "to work",
    "ta": "to work",
    "hi": "to work",
    "romaji": "hataraku"
  },
  "急": {
    "en": "urgent, sudden; steep",
    "ta": "urgent, sudden; steep",
    "hi": "urgent, sudden; steep",
    "romaji": "kyuu"
  },
  "急激": {
    "en": "sudden,precipitous,radical",
    "ta": "sudden,precipitous,radical",
    "hi": "sudden,precipitous,radical",
    "romaji": "kyuugeki"
  },
  "急速": {
    "en": "rapid (e.g. progress)",
    "ta": "rapid (e.g. progress)",
    "hi": "rapid (e.g. progress)",
    "romaji": "kyuusoku"
  },
  "泳ぎ": {
    "en": "swimming",
    "ta": "swimming",
    "hi": "swimming",
    "romaji": "oyogi"
  },
  "水泳": {
    "en": "swimming",
    "ta": "swimming",
    "hi": "swimming",
    "romaji": "suiei"
  },
  "泳ぐ": {
    "en": "to swim",
    "ta": "to swim",
    "hi": "to swim",
    "romaji": "oyogu"
  },
  "走る": {
    "en": "to run",
    "ta": "to run",
    "hi": "to run",
    "romaji": "hashiru"
  },
  "競走します": {
    "en": "race",
    "ta": "race",
    "hi": "race",
    "romaji": "kyōsōshimasu"
  },
  "散歩": {
    "en": "walk,stroll",
    "ta": "walk,stroll",
    "hi": "walk,stroll",
    "romaji": "sanpo"
  },
  "進歩": {
    "en": "progress,development",
    "ta": "progress,development",
    "hi": "progress,development",
    "romaji": "shinpo"
  },
  "歩道": {
    "en": "footpath,walkway,sidewalk",
    "ta": "footpath,walkway,sidewalk",
    "hi": "footpath,walkway,sidewalk",
    "romaji": "hodou"
  },
  "乗客": {
    "en": "passenger",
    "ta": "passenger",
    "hi": "passenger",
    "romaji": "joukyaku"
  },
  "乗る": {
    "en": "to get on,to ride",
    "ta": "to get on,to ride",
    "hi": "to get on,to ride",
    "romaji": "noru"
  },
  "乗せる": {
    "en": "to place on (something),to take on board,to give a ride",
    "ta": "to place on (something),to take on board,to give a ride",
    "hi": "to place on (something),to take on board,to give a ride",
    "romaji": "noseru"
  },
  "降る": {
    "en": "to fall, e.g. rain or snow",
    "ta": "to fall, e.g. rain or snow",
    "hi": "to fall, e.g. rain or snow",
    "romaji": "furu"
  },
  "降ろす": {
    "en": "to take down,to launch,to drop",
    "ta": "to take down,to launch,to drop",
    "hi": "to take down,to launch,to drop",
    "romaji": "orosu"
  },
  "降りる": {
    "en": "to get off, to descend",
    "ta": "to get off, to descend",
    "hi": "to get off, to descend",
    "romaji": "oriru"
  },
  "到着": {
    "en": "arrival",
    "ta": "arrival",
    "hi": "arrival",
    "romaji": "touchaku"
  },
  "上着": {
    "en": "jacket",
    "ta": "jacket",
    "hi": "jacket",
    "romaji": "uwagi"
  },
  "着る": {
    "en": "to put on from the shoulders down",
    "ta": "to put on from the shoulders down",
    "hi": "to put on from the shoulders down",
    "romaji": "kiru"
  },
  "放送": {
    "en": "broadcast,broadcasting",
    "ta": "broadcast,broadcasting",
    "hi": "broadcast,broadcasting",
    "romaji": "housou"
  },
  "送る": {
    "en": "to send, to dispatch",
    "ta": "to send, to dispatch",
    "hi": "to send, to dispatch",
    "romaji": "okuru"
  },
  "見送り": {
    "en": "seeing one off,farewell,escort",
    "ta": "seeing one off,farewell,escort",
    "hi": "seeing one off,farewell,escort",
    "romaji": "miokuri"
  },
  "受付": {
    "en": "reception desk",
    "ta": "reception desk",
    "hi": "reception desk",
    "romaji": "uketsuke"
  },
  "受ける": {
    "en": "to take (an examination, interview, etc.); to receive",
    "ta": "to take (an examination, interview, etc.); to receive",
    "hi": "to take (an examination, interview, etc.); to receive",
    "romaji": "ukeru"
  },
  "受け取る": {
    "en": "to receive,to get,to accept,to take",
    "ta": "to receive,to get,to accept,to take",
    "hi": "to receive,to get,to accept,to take",
    "romaji": "uketoru"
  },
  "貸し": {
    "en": "loan,lending",
    "ta": "loan,lending",
    "hi": "loan,lending",
    "romaji": "kashi"
  },
  "貸す": {
    "en": "to lend",
    "ta": "to lend",
    "hi": "to lend",
    "romaji": "kasu"
  },
  "貸します": {
    "en": "lend",
    "ta": "lend",
    "hi": "lend",
    "romaji": "kashimasu"
  },
  "借金": {
    "en": "debt,loan,liabilities",
    "ta": "debt,loan,liabilities",
    "hi": "debt,loan,liabilities",
    "romaji": "shakkin"
  },
  "借りる": {
    "en": "to borrow",
    "ta": "to borrow",
    "hi": "to borrow",
    "romaji": "kariru"
  },
  "借ります": {
    "en": "borrow",
    "ta": "borrow",
    "hi": "borrow",
    "romaji": "karimasu"
  },
  "商売": {
    "en": "trade,business,commerce,transaction,occupation",
    "ta": "trade,business,commerce,transaction,occupation",
    "hi": "trade,business,commerce,transaction,occupation",
    "romaji": "shoubai"
  },
  "販売": {
    "en": "sale,selling,marketing",
    "ta": "sale,selling,marketing",
    "hi": "sale,selling,marketing",
    "romaji": "hanbai"
  },
  "売る": {
    "en": "to sell",
    "ta": "to sell",
    "hi": "to sell",
    "romaji": "uru"
  },
  "取る": {
    "en": "to take something",
    "ta": "to take something",
    "hi": "to take something",
    "romaji": "toru"
  },
  "取れる": {
    "en": "to come off,to be taken off,to be removed",
    "ta": "to come off,to be taken off,to be removed",
    "hi": "to come off,to be taken off,to be removed",
    "romaji": "toreru"
  },
  "取り組む": {
    "en": "to tackle / work on / address",
    "ta": "to tackle / work on / address",
    "hi": "to tackle / work on / address",
    "romaji": "torikumu"
  },
  "作業": {
    "en": "work,operation,manufacturing,fatigue duty",
    "ta": "work,operation,manufacturing,fatigue duty",
    "hi": "work,operation,manufacturing,fatigue duty",
    "romaji": "sagyou"
  },
  "作品": {
    "en": "work,opus,performance,production",
    "ta": "work,opus,performance,production",
    "hi": "work,opus,performance,production",
    "romaji": "sakuhin"
  },
  "作物": {
    "en": "produce (e.g. agricultural),crops",
    "ta": "produce (e.g. agricultural),crops",
    "hi": "produce (e.g. agricultural),crops",
    "romaji": "sakumotsu"
  },
  "洗う": {
    "en": "to wash",
    "ta": "to wash",
    "hi": "to wash",
    "romaji": "arau"
  },
  "洗濯": {
    "en": "Washing",
    "ta": "Washing",
    "hi": "Washing",
    "romaji": "sentaku"
  },
  "洗濯機": {
    "en": "washing machine",
    "ta": "washing machine",
    "hi": "washing machine",
    "romaji": "sentakuki"
  },
  "切れ": {
    "en": "cloth,piece,cut,chop",
    "ta": "cloth,piece,cut,chop",
    "hi": "cloth,piece,cut,chop",
    "romaji": "kire"
  },
  "適切": {
    "en": "pertinent,appropriate,adequate,relevance",
    "ta": "pertinent,appropriate,adequate,relevance",
    "hi": "pertinent,appropriate,adequate,relevance",
    "romaji": "tekisetsu"
  },
  "親切": {
    "en": "kind / kindness",
    "ta": "kind / kindness",
    "hi": "kind / kindness",
    "romaji": "shinsetsu"
  },
  "引退": {
    "en": "retire",
    "ta": "retire",
    "hi": "retire",
    "romaji": "intai"
  },
  "引用": {
    "en": "quotation,citation",
    "ta": "quotation,citation",
    "hi": "quotation,citation",
    "romaji": "inyou"
  },
  "割引": {
    "en": "Discount",
    "ta": "Discount",
    "hi": "Discount",
    "romaji": "waribiki"
  },
  "押す": {
    "en": "to push, to stamp something",
    "ta": "to push, to stamp something",
    "hi": "to push, to stamp something",
    "romaji": "osu"
  },
  "押します": {
    "en": "push, press",
    "ta": "push, press",
    "hi": "push, press",
    "romaji": "oshimasu"
  },
  "押し入れ": {
    "en": "Japanese-style closet",
    "ta": "Japanese-style closet",
    "hi": "Japanese-style closet",
    "romaji": "oshiire"
  },
  "暑い": {
    "en": "hot (weather/temperature)",
    "ta": "வெப்பமான",
    "hi": "गर्म",
    "romaji": "atsui"
  },
  "暑い、熱い": {
    "en": "hot",
    "ta": "hot",
    "hi": "hot",
    "romaji": "atsui"
  },
  "寒い": {
    "en": "cold (weather)",
    "ta": "குளிரான",
    "hi": "ठंडा",
    "romaji": "samui"
  },
  "温暖": {
    "en": "warmth",
    "ta": "warmth",
    "hi": "warmth",
    "romaji": "ondan"
  },
  "暖房": {
    "en": "heating",
    "ta": "heating",
    "hi": "heating",
    "romaji": "danbou"
  },
  "暖かい": {
    "en": "warm,mild",
    "ta": "warm,mild",
    "hi": "warm,mild",
    "romaji": "atataka(i)"
  },
  "涼しい": {
    "en": "Refreshing",
    "ta": "Refreshing",
    "hi": "Refreshing",
    "romaji": "suzushii"
  },
  "強調": {
    "en": "emphasis,stress,stressed point",
    "ta": "emphasis,stress,stressed point",
    "hi": "emphasis,stress,stressed point",
    "romaji": "kyouchou"
  },
  "強力": {
    "en": "herculean strength,mountain carrier-guide",
    "ta": "herculean strength,mountain carrier-guide",
    "hi": "herculean strength,mountain carrier-guide",
    "romaji": "kyouryoku"
  },
  "強盗": {
    "en": "robbery,burglary",
    "ta": "robbery,burglary",
    "hi": "robbery,burglary",
    "romaji": "goutou"
  },
  "脆弱": {
    "en": "fragile / vulnerable / weak",
    "ta": "fragile / vulnerable / weak",
    "hi": "fragile / vulnerable / weak",
    "romaji": "zeijaku"
  },
  "弱い": {
    "en": "weak",
    "ta": "weak",
    "hi": "weak",
    "romaji": "yowai"
  },
  "貴重": {
    "en": "precious,valuable",
    "ta": "precious,valuable",
    "hi": "precious,valuable",
    "romaji": "kichou"
  },
  "重視": {
    "en": "importance,stress,serious consideration",
    "ta": "importance,stress,serious consideration",
    "hi": "importance,stress,serious consideration",
    "romaji": "juushi"
  },
  "重大": {
    "en": "serious,important,grave,weighty",
    "ta": "serious,important,grave,weighty",
    "hi": "serious,important,grave,weighty",
    "romaji": "juudai"
  },
  "軽い": {
    "en": "Light",
    "ta": "Light",
    "hi": "Light",
    "romaji": "karui"
  },
  "広告": {
    "en": "advertisement",
    "ta": "advertisement",
    "hi": "advertisement",
    "romaji": "koukoku"
  },
  "背広": {
    "en": "business suit",
    "ta": "business suit",
    "hi": "business suit",
    "romaji": "sebiro"
  },
  "広い": {
    "en": "spacious,wide",
    "ta": "spacious,wide",
    "hi": "spacious,wide",
    "romaji": "hiroi"
  },
  "狭い": {
    "en": "Narrow",
    "ta": "Narrow",
    "hi": "Narrow",
    "romaji": "semai"
  },
  "迅速": {
    "en": "quick / prompt / rapid",
    "ta": "quick / prompt / rapid",
    "hi": "quick / prompt / rapid",
    "romaji": "jinsoku"
  },
  "高速": {
    "en": "high speed,high gear",
    "ta": "high speed,high gear",
    "hi": "high speed,high gear",
    "romaji": "kousoku"
  },
  "遅刻": {
    "en": "lateness,late coming",
    "ta": "lateness,late coming",
    "hi": "lateness,late coming",
    "romaji": "chikoku"
  },
  "遅く": {
    "en": "late (time)",
    "ta": "late (time)",
    "hi": "late (time)",
    "romaji": "osoku"
  },
  "遅い": {
    "en": "late, slow",
    "ta": "late, slow",
    "hi": "late, slow",
    "romaji": "osoi"
  },
  "近代": {
    "en": "present day",
    "ta": "present day",
    "hi": "present day",
    "romaji": "kindai"
  },
  "近頃": {
    "en": "lately,recently,nowadays",
    "ta": "lately,recently,nowadays",
    "hi": "lately,recently,nowadays",
    "romaji": "chikagoro"
  },
  "近所": {
    "en": "neighborhood",
    "ta": "neighborhood",
    "hi": "neighborhood",
    "romaji": "kinjo"
  },
  "永遠": {
    "en": "eternity,perpetuity,immortality,permanence",
    "ta": "eternity,perpetuity,immortality,permanence",
    "hi": "eternity,perpetuity,immortality,permanence",
    "romaji": "eien"
  },
  "遠慮": {
    "en": "diffidence,restraint,reserve",
    "ta": "diffidence,restraint,reserve",
    "hi": "diffidence,restraint,reserve",
    "romaji": "enryo"
  },
  "遠く": {
    "en": "far away, distant",
    "ta": "far away, distant",
    "hi": "far away, distant",
    "romaji": "tooku"
  },
  "証明": {
    "en": "proof,verification",
    "ta": "proof,verification",
    "hi": "proof,verification",
    "romaji": "shoumei"
  },
  "発明": {
    "en": "invention",
    "ta": "invention",
    "hi": "invention",
    "romaji": "hatsumei"
  },
  "文明": {
    "en": "civilization,culture",
    "ta": "civilization,culture",
    "hi": "civilization,culture",
    "romaji": "bunmei"
  },
  "暗記": {
    "en": "memorization,learning by heart",
    "ta": "memorization,learning by heart",
    "hi": "memorization,learning by heart",
    "romaji": "anki"
  },
  "暗い": {
    "en": "Gloomy",
    "ta": "Gloomy",
    "hi": "Gloomy",
    "romaji": "kurai"
  },
  "暗証番号": {
    "en": "personal identification number, PIN",
    "ta": "personal identification number, PIN",
    "hi": "personal identification number, PIN",
    "romaji": "anshōbangō"
  },
  "太陽": {
    "en": "sun,solar",
    "ta": "sun,solar",
    "hi": "sun,solar",
    "romaji": "taiyou"
  },
  "太る": {
    "en": "to gain weight",
    "ta": "to gain weight",
    "hi": "to gain weight",
    "romaji": "futoru"
  },
  "太い": {
    "en": "fat",
    "ta": "fat",
    "hi": "fat",
    "romaji": "futoi"
  },
  "細い": {
    "en": "thin",
    "ta": "thin",
    "hi": "thin",
    "romaji": "hosoi"
  },
  "細かい": {
    "en": "small; fine, minute",
    "ta": "small; fine, minute",
    "hi": "small; fine, minute",
    "romaji": "komakai"
  },
  "iPS細胞": {
    "en": "induced pluripotent stem cell",
    "ta": "induced pluripotent stem cell",
    "hi": "induced pluripotent stem cell",
    "romaji": "iPSsaibō"
  },
  "病院": {
    "en": "hospital",
    "ta": "மருத்துவமனை",
    "hi": "अस्पताल",
    "romaji": "byouin"
  },
  "病気": {
    "en": "illness",
    "ta": "illness",
    "hi": "illness",
    "romaji": "byouki"
  },
  "重い病気": {
    "en": "serious illness",
    "ta": "serious illness",
    "hi": "serious illness",
    "romaji": "omoi byōki"
  },
  "入院": {
    "en": "hospitalization",
    "ta": "hospitalization",
    "hi": "hospitalization",
    "romaji": "nyuuin"
  },
  "退院": {
    "en": "leaving hospital",
    "ta": "leaving hospital",
    "hi": "leaving hospital",
    "romaji": "taiinsuru"
  },
  "医師": {
    "en": "doctor,physician",
    "ta": "doctor,physician",
    "hi": "doctor,physician",
    "romaji": "ishi"
  },
  "医療": {
    "en": "medical care,medical treatment",
    "ta": "medical care,medical treatment",
    "hi": "medical care,medical treatment",
    "romaji": "iryou"
  },
  "医学": {
    "en": "medical science",
    "ta": "medical science",
    "hi": "medical science",
    "romaji": "igaku"
  },
  "薬": {
    "en": "medicine",
    "ta": "மருந்து",
    "hi": "दवा",
    "romaji": "kusuri"
  },
  "痛み": {
    "en": "pain,ache,sore,grief,distress",
    "ta": "pain,ache,sore,grief,distress",
    "hi": "pain,ache,sore,grief,distress",
    "romaji": "itami"
  },
  "苦痛": {
    "en": "pain,agony",
    "ta": "pain,agony",
    "hi": "pain,agony",
    "romaji": "kutsuu"
  },
  "頭痛": {
    "en": "headache",
    "ta": "headache",
    "hi": "headache",
    "romaji": "zutsuu"
  },
  "頭": {
    "en": "head",
    "ta": "head",
    "hi": "head",
    "romaji": "atama"
  },
  "頭がいい": {
    "en": "clever, smart",
    "ta": "clever, smart",
    "hi": "clever, smart",
    "romaji": "atamaga ii"
  },
  "顔": {
    "en": "face (body part)",
    "ta": "face (body part)",
    "hi": "face (body part)",
    "romaji": "kao"
  },
  "笑顔": {
    "en": "smiling face",
    "ta": "smiling face",
    "hi": "smiling face",
    "romaji": "egao"
  },
  "首": {
    "en": "neck",
    "ta": "neck",
    "hi": "neck",
    "romaji": "kubi"
  },
  "首相": {
    "en": "Prime Minister",
    "ta": "Prime Minister",
    "hi": "Prime Minister",
    "romaji": "shushou"
  },
  "首都": {
    "en": "capital city",
    "ta": "capital city",
    "hi": "capital city",
    "romaji": "shuto"
  },
  "背": {
    "en": "height,stature",
    "ta": "height,stature",
    "hi": "height,stature",
    "romaji": "sei"
  },
  "背中": {
    "en": "back (of body)",
    "ta": "back (of body)",
    "hi": "back (of body)",
    "romaji": "senaka"
  },
  "体": {
    "en": "Body",
    "ta": "Body",
    "hi": "Body",
    "romaji": "karada"
  },
  "一体": {
    "en": "(1) one object,one body,(2) what on earth?,really?,(3)",
    "ta": "(1) one object,one body,(2) what on earth?,really?,(3)",
    "hi": "(1) one object,one body,(2) what on earth?,really?,(3)",
    "romaji": "ittai"
  },
  "具体": {
    "en": "concrete,tangible,material",
    "ta": "concrete,tangible,material",
    "hi": "concrete,tangible,material",
    "romaji": "gutai"
  },
  "心": {
    "en": "heart, mind",
    "ta": "heart, mind",
    "hi": "heart, mind",
    "romaji": "kokoro"
  },
  "感心": {
    "en": "admiration,Well done!",
    "ta": "admiration,Well done!",
    "hi": "admiration,Well done!",
    "romaji": "kanshin"
  },
  "関心": {
    "en": "concern,interest",
    "ta": "concern,interest",
    "hi": "concern,interest",
    "romaji": "kanshin"
  },
  "声": {
    "en": "Voice",
    "ta": "Voice",
    "hi": "Voice",
    "romaji": "koe"
  },
  "血": {
    "en": "blood",
    "ta": "blood",
    "hi": "blood",
    "romaji": "chi"
  },
  "骨": {
    "en": "bone",
    "ta": "bone",
    "hi": "bone",
    "romaji": "hone"
  },
  "骨折": {
    "en": "bone fracture",
    "ta": "bone fracture",
    "hi": "bone fracture",
    "romaji": "kossetsu"
  },
  "皮": {
    "en": "skin,hide,leather,fur,pelt,bark,shell",
    "ta": "skin,hide,leather,fur,pelt,bark,shell",
    "hi": "skin,hide,leather,fur,pelt,bark,shell",
    "romaji": "kawa"
  },
  "所": {
    "en": "place",
    "ta": "place",
    "hi": "place",
    "romaji": "tokoro"
  },
  "所為": {
    "en": "cause,reason,fault",
    "ta": "cause,reason,fault",
    "hi": "cause,reason,fault",
    "romaji": "sei"
  },
  "場所": {
    "en": "place, location",
    "ta": "place, location",
    "hi": "place, location",
    "romaji": "basho"
  },
  "場": {
    "en": "place,field (physics)",
    "ta": "place,field (physics)",
    "hi": "place,field (physics)",
    "romaji": "ba"
  },
  "場合": {
    "en": "case / situation / occasion",
    "ta": "case / situation / occasion",
    "hi": "case / situation / occasion",
    "romaji": "baai"
  },
  "市場": {
    "en": "(the) market (as a concept)",
    "ta": "(the) market (as a concept)",
    "hi": "(the) market (as a concept)",
    "romaji": "ichiba"
  },
  "教室": {
    "en": "Classroom",
    "ta": "Classroom",
    "hi": "Classroom",
    "romaji": "kyoushitsu"
  },
  "和室": {
    "en": "Japanese-style room",
    "ta": "Japanese-style room",
    "hi": "Japanese-style room",
    "romaji": "washitsu"
  },
  "研究室": {
    "en": "the professor's office; laboratory",
    "ta": "the professor's office; laboratory",
    "hi": "the professor's office; laboratory",
    "romaji": "kenkyuushitsu"
  },
  "旅館": {
    "en": "a Japanese inn",
    "ta": "a Japanese inn",
    "hi": "a Japanese inn",
    "romaji": "ryokan"
  },
  "博物館": {
    "en": "museum",
    "ta": "museum",
    "hi": "museum",
    "romaji": "hakubutsukan"
  },
  "体育館": {
    "en": "gymnasium",
    "ta": "gymnasium",
    "hi": "gymnasium",
    "romaji": "taiikukan"
  },
  "橋": {
    "en": "bridge",
    "ta": "bridge",
    "hi": "bridge",
    "romaji": "hashi"
  },
  "日本橋": {
    "en": "a shopping district in Osaka",
    "ta": "a shopping district in Osaka",
    "hi": "a shopping district in Osaka",
    "romaji": "nipponbashi"
  },
  "港": {
    "en": "harbor, port",
    "ta": "harbor, port",
    "hi": "harbor, port",
    "romaji": "minato"
  },
  "空港": {
    "en": "airport",
    "ta": "airport",
    "hi": "airport",
    "romaji": "kūkō"
  },
  "香港": {
    "en": "Hong Kong (香港)",
    "ta": "Hong Kong (香港)",
    "hi": "Hong Kong (香港)",
    "romaji": "honkon"
  },
  "島": {
    "en": "island",
    "ta": "island",
    "hi": "island",
    "romaji": "shima"
  },
  "浦島太郎": {
    "en": "name of the main character in an old folk tale",
    "ta": "name of the main character in an old folk tale",
    "hi": "name of the main character in an old folk tale",
    "romaji": "urashimatarō"
  },
  "バリ［島］": {
    "en": "Bali [island] (in Indonesia)",
    "ta": "Bali [island] (in Indonesia)",
    "hi": "Bali [island] (in Indonesia)",
    "romaji": "bari [tou]"
  },
  "池": {
    "en": "pond",
    "ta": "pond",
    "hi": "pond",
    "romaji": "ike"
  },
  "電池": {
    "en": "battery",
    "ta": "battery",
    "hi": "battery",
    "romaji": "denchi"
  },
  "湖": {
    "en": "lake",
    "ta": "lake",
    "hi": "lake",
    "romaji": "mizuumi"
  },
  "琵琶湖": {
    "en": "Lake Biwa, the biggest lake in Japan",
    "ta": "Lake Biwa, the biggest lake in Japan",
    "hi": "Lake Biwa, the biggest lake in Japan",
    "romaji": "biwako"
  },
  "海": {
    "en": "sea",
    "ta": "sea",
    "hi": "sea",
    "romaji": "umi"
  },
  "海外": {
    "en": "foreign,abroad,overseas",
    "ta": "foreign,abroad,overseas",
    "hi": "foreign,abroad,overseas",
    "romaji": "kaigai"
  },
  "海岸": {
    "en": "coast, seashore",
    "ta": "coast, seashore",
    "hi": "coast, seashore",
    "romaji": "kaigan"
  },
  "公平": {
    "en": "fairness,impartial,justice",
    "ta": "fairness,impartial,justice",
    "hi": "fairness,impartial,justice",
    "romaji": "kouhei"
  },
  "公園": {
    "en": "Park",
    "ta": "Park",
    "hi": "Park",
    "romaji": "kouen"
  },
  "公務員": {
    "en": "government worker, public servant",
    "ta": "government worker, public servant",
    "hi": "government worker, public servant",
    "romaji": "koumuin"
  },
  "動物園": {
    "en": "zoo",
    "ta": "zoo",
    "hi": "zoo",
    "romaji": "doubutsuen"
  },
  "幼稚園": {
    "en": "preschool, kindergarten",
    "ta": "preschool, kindergarten",
    "hi": "preschool, kindergarten",
    "romaji": "yōchien"
  },
  "寺": {
    "en": "Buddhist temple",
    "ta": "Buddhist temple",
    "hi": "Buddhist temple",
    "romaji": "tera"
  },
  "東大寺": {
    "en": "Todaiji Temple",
    "ta": "Todaiji Temple",
    "hi": "Todaiji Temple",
    "romaji": "tōdaiji"
  },
  "金閣寺": {
    "en": "Kinkakuji Temple (the Golden Pavilion)",
    "ta": "Kinkakuji Temple (the Golden Pavilion)",
    "hi": "Kinkakuji Temple (the Golden Pavilion)",
    "romaji": "kinkakuji"
  },
  "神": {
    "en": "god",
    "ta": "god",
    "hi": "god",
    "romaji": "kami"
  },
  "神経": {
    "en": "nerve,sensitivity",
    "ta": "nerve,sensitivity",
    "hi": "nerve,sensitivity",
    "romaji": "shinkei"
  },
  "精神": {
    "en": "mind,soul,heart,spirit,intention",
    "ta": "mind,soul,heart,spirit,intention",
    "hi": "mind,soul,heart,spirit,intention",
    "romaji": "seishin"
  },
  "社会": {
    "en": "society",
    "ta": "society",
    "hi": "society",
    "romaji": "shakai"
  },
  "本社": {
    "en": "head office",
    "ta": "head office",
    "hi": "head office",
    "romaji": "honsha"
  },
  "会社": {
    "en": "Company",
    "ta": "Company",
    "hi": "Company",
    "romaji": "kaisha"
  },
  "兄": {
    "en": "(humble) older brother",
    "ta": "(humble) older brother",
    "hi": "(humble) older brother",
    "romaji": "ani"
  },
  "兄弟": {
    "en": "(humble) siblings",
    "ta": "(humble) siblings",
    "hi": "(humble) siblings",
    "romaji": "kyoudai"
  },
  "従兄弟": {
    "en": "cousin (male)",
    "ta": "cousin (male)",
    "hi": "cousin (male)",
    "romaji": "itoko"
  },
  "弟": {
    "en": "younger brother",
    "ta": "younger brother",
    "hi": "younger brother",
    "romaji": "otouto"
  },
  "姉": {
    "en": "(humble) older sister",
    "ta": "(humble) older sister",
    "hi": "(humble) older sister",
    "romaji": "ane"
  },
  "姉妹": {
    "en": "sisters",
    "ta": "sisters",
    "hi": "sisters",
    "romaji": "shimai"
  },
  "お姉さん": {
    "en": "(honorable) older sister",
    "ta": "(honorable) older sister",
    "hi": "(honorable) older sister",
    "romaji": "oneesan"
  },
  "妹": {
    "en": "(humble) younger sister",
    "ta": "(humble) younger sister",
    "hi": "(humble) younger sister",
    "romaji": "imouto"
  },
  "妹さん": {
    "en": "(someone else's) younger sister",
    "ta": "(someone else's) younger sister",
    "hi": "(someone else's) younger sister",
    "romaji": "imōtosan"
  },
  "祖母": {
    "en": "grandmother",
    "ta": "grandmother",
    "hi": "grandmother",
    "romaji": "sobo"
  },
  "祖父": {
    "en": "grandfather",
    "ta": "grandfather",
    "hi": "grandfather",
    "romaji": "sofu"
  },
  "夫": {
    "en": "husband",
    "ta": "husband",
    "hi": "husband",
    "romaji": "otto"
  },
  "夫婦": {
    "en": "married couple,husband and wife",
    "ta": "married couple,husband and wife",
    "hi": "married couple,husband and wife",
    "romaji": "fuufu"
  },
  "夫人": {
    "en": "wife,Mrs,madam",
    "ta": "wife,Mrs,madam",
    "hi": "wife,Mrs,madam",
    "romaji": "fujin"
  },
  "妻": {
    "en": "wife (humble)",
    "ta": "wife (humble)",
    "hi": "wife (humble)",
    "romaji": "tsuma"
  },
  "妻／家内": {
    "en": "(my) wife",
    "ta": "(my) wife",
    "hi": "(my) wife",
    "romaji": "tsuma/kanai"
  },
  "息": {
    "en": "breath,tone",
    "ta": "breath,tone",
    "hi": "breath,tone",
    "romaji": "iki"
  },
  "息子": {
    "en": "(humble) son",
    "ta": "(humble) son",
    "hi": "(humble) son",
    "romaji": "musuko"
  },
  "息子さん": {
    "en": "(someone else's) son",
    "ta": "(someone else's) son",
    "hi": "(someone else's) son",
    "romaji": "musukosan"
  },
  "娘": {
    "en": "daughter (humble)",
    "ta": "daughter (humble)",
    "hi": "daughter (humble)",
    "romaji": "musume"
  },
  "娘さん": {
    "en": "(someone else's) daughter",
    "ta": "(someone else's) daughter",
    "hi": "(someone else's) daughter",
    "romaji": "musumesan"
  },
  "会": {
    "en": "meeting,assembly,party,association,club",
    "ta": "meeting,assembly,party,association,club",
    "hi": "meeting,assembly,party,association,club",
    "romaji": "kai"
  },
  "機会": {
    "en": "opportunity / chance",
    "ta": "opportunity / chance",
    "hi": "opportunity / chance",
    "romaji": "kikai"
  },
  "会員": {
    "en": "member,the membership",
    "ta": "member,the membership",
    "hi": "member,the membership",
    "romaji": "kaiin"
  },
  "委員": {
    "en": "committee member",
    "ta": "committee member",
    "hi": "committee member",
    "romaji": "iin"
  },
  "議員": {
    "en": "member of the Diet, congress or parliament",
    "ta": "member of the Diet, congress or parliament",
    "hi": "member of the Diet, congress or parliament",
    "romaji": "giin"
  },
  "議長": {
    "en": "chairman",
    "ta": "chairman",
    "hi": "chairman",
    "romaji": "gichou"
  },
  "身長": {
    "en": "height (of body),stature",
    "ta": "height (of body),stature",
    "hi": "height (of body),stature",
    "romaji": "shinchou"
  },
  "成長": {
    "en": "growth,grow to adulthood",
    "ta": "growth,grow to adulthood",
    "hi": "growth,grow to adulthood",
    "romaji": "seichou"
  },
  "部分": {
    "en": "portion,section,part",
    "ta": "portion,section,part",
    "hi": "portion,section,part",
    "romaji": "bubun"
  },
  "全部": {
    "en": "All",
    "ta": "All",
    "hi": "All",
    "romaji": "zenbu"
  },
  "部屋": {
    "en": "room",
    "ta": "room",
    "hi": "room",
    "romaji": "heya"
  },
  "課": {
    "en": "counter for chapters (of a book)",
    "ta": "counter for chapters (of a book)",
    "hi": "counter for chapters (of a book)",
    "romaji": "ka"
  },
  "課長": {
    "en": "section head",
    "ta": "section head",
    "hi": "section head",
    "romaji": "kachō"
  },
  "営業": {
    "en": "business,trade,management",
    "ta": "business,trade,management",
    "hi": "business,trade,management",
    "romaji": "eigyou"
  },
  "企業": {
    "en": "enterprise,undertaking",
    "ta": "enterprise,undertaking",
    "hi": "enterprise,undertaking",
    "romaji": "kigyou"
  },
  "仕方": {
    "en": "way (of doing something)",
    "ta": "way (of doing something)",
    "hi": "way (of doing something)",
    "romaji": "shikata"
  },
  "仕事": {
    "en": "Job",
    "ta": "Job",
    "hi": "Job",
    "romaji": "shigoto"
  },
  "仕事する": {
    "en": "to work",
    "ta": "வேலை செய்",
    "hi": "काम करना",
    "romaji": "shigotosuru"
  },
  "事": {
    "en": "thing,matter,fact,circumstances",
    "ta": "thing,matter,fact,circumstances",
    "hi": "thing,matter,fact,circumstances",
    "romaji": "koto"
  },
  "家事": {
    "en": "housework,domestic chores",
    "ta": "housework,domestic chores",
    "hi": "housework,domestic chores",
    "romaji": "kaji"
  },
  "記事": {
    "en": "article,news story,report,account",
    "ta": "article,news story,report,account",
    "hi": "article,news story,report,account",
    "romaji": "kiji"
  },
  "用": {
    "en": "errand, task, business (to take care of)",
    "ta": "errand, task, business (to take care of)",
    "hi": "errand, task, business (to take care of)",
    "romaji": "you"
  },
  "活用": {
    "en": "conjugation,practical use",
    "ta": "conjugation,practical use",
    "hi": "conjugation,practical use",
    "romaji": "katsuyou"
  },
  "品": {
    "en": "thing,article,goods,dignity,article (goods),counter for",
    "ta": "thing,article,goods,dignity,article (goods),counter for",
    "hi": "thing,article,goods,dignity,article (goods),counter for",
    "romaji": "shina"
  },
  "商品": {
    "en": "commodity,article of",
    "ta": "commodity,article of",
    "hi": "commodity,article of",
    "romaji": "shouhin"
  },
  "物": {
    "en": "thing",
    "ta": "thing",
    "hi": "thing",
    "romaji": "mono"
  },
  "穀物": {
    "en": "grain,cereal,corn",
    "ta": "grain,cereal,corn",
    "hi": "grain,cereal,corn",
    "romaji": "kokumotsu"
  },
  "金": {
    "en": "(1) gold,(2) gold general (shogi) (abbr)",
    "ta": "(1) gold,(2) gold general (shogi) (abbr)",
    "hi": "(1) gold,(2) gold general (shogi) (abbr)",
    "romaji": "kane"
  },
  "金額": {
    "en": "amount of money",
    "ta": "amount of money",
    "hi": "amount of money",
    "romaji": "kingaku"
  },
  "金庫": {
    "en": "safe,vault,treasury,provider of funds",
    "ta": "safe,vault,treasury,provider of funds",
    "hi": "safe,vault,treasury,provider of funds",
    "romaji": "kinko"
  },
  "銀": {
    "en": "(1) silver,silver coin,silver paint",
    "ta": "(1) silver,silver coin,silver paint",
    "hi": "(1) silver,silver coin,silver paint",
    "romaji": "gin"
  },
  "銀行": {
    "en": "Bank",
    "ta": "Bank",
    "hi": "Bank",
    "romaji": "ginkou"
  },
  "銀行員": {
    "en": "bank employee",
    "ta": "bank employee",
    "hi": "bank employee",
    "romaji": "ginkōin"
  },
  "給料": {
    "en": "salary,wages",
    "ta": "salary,wages",
    "hi": "salary,wages",
    "romaji": "kyuuryou"
  },
  "材料": {
    "en": "ingredients,material",
    "ta": "ingredients,material",
    "hi": "ingredients,material",
    "romaji": "zairyou"
  },
  "食料": {
    "en": "food",
    "ta": "food",
    "hi": "food",
    "romaji": "shokuryou"
  },
  "現代": {
    "en": "nowadays,modern times,present-day",
    "ta": "nowadays,modern times,present-day",
    "hi": "nowadays,modern times,present-day",
    "romaji": "gendai"
  },
  "代金": {
    "en": "price,payment,cost,charge",
    "ta": "price,payment,cost,charge",
    "hi": "price,payment,cost,charge",
    "romaji": "daikin"
  },
  "信号": {
    "en": "traffic lights,signal,semaphore",
    "ta": "traffic lights,signal,semaphore",
    "hi": "traffic lights,signal,semaphore",
    "romaji": "shingou"
  },
  "－号": {
    "en": "(train number, typhoon number, etc.)",
    "ta": "(train number, typhoon number, etc.)",
    "hi": "(train number, typhoon number, etc.)",
    "romaji": "-gō"
  },
  "番号": {
    "en": "number",
    "ta": "number",
    "hi": "number",
    "romaji": "bangou"
  },
  "一番": {
    "en": "best,first,number one",
    "ta": "best,first,number one",
    "hi": "best,first,number one",
    "romaji": "ichiban"
  },
  "順番": {
    "en": "turn (in line),order of things",
    "ta": "turn (in line),order of things",
    "hi": "turn (in line),order of things",
    "romaji": "junban"
  },
  "番組": {
    "en": "broadcast program",
    "ta": "broadcast program",
    "hi": "broadcast program",
    "romaji": "bangumi"
  },
  "駐車": {
    "en": "parking (e.g. car)",
    "ta": "parking (e.g. car)",
    "hi": "parking (e.g. car)",
    "romaji": "chuusha"
  },
  "駐車場": {
    "en": "car park, parking lot",
    "ta": "car park, parking lot",
    "hi": "car park, parking lot",
    "romaji": "chūshajō"
  },
  "駐車違反": {
    "en": "parking violation",
    "ta": "parking violation",
    "hi": "parking violation",
    "romaji": "chūshaihan"
  },
  "線": {
    "en": "line, wire",
    "ta": "line, wire",
    "hi": "line, wire",
    "romaji": "sen"
  },
  "地平線": {
    "en": "horizon",
    "ta": "horizon",
    "hi": "horizon",
    "romaji": "chiheisen"
  },
  "新幹線": {
    "en": "the Shinkansen, the bullet train",
    "ta": "the Shinkansen, the bullet train",
    "hi": "the Shinkansen, the bullet train",
    "romaji": "shinkansen"
  },
  "地": {
    "en": "earth",
    "ta": "earth",
    "hi": "earth",
    "romaji": "chi"
  },
  "生地": {
    "en": "birthplace",
    "ta": "birthplace",
    "hi": "birthplace",
    "romaji": "kiji"
  },
  "地位": {
    "en": "(social) position,status",
    "ta": "(social) position,status",
    "hi": "(social) position,status",
    "romaji": "chii"
  },
  "鉄": {
    "en": "iron",
    "ta": "iron",
    "hi": "iron",
    "romaji": "tetsu"
  },
  "鉄道": {
    "en": "railroad",
    "ta": "railroad",
    "hi": "railroad",
    "romaji": "tetsudou"
  },
  "地下鉄": {
    "en": "underground train",
    "ta": "underground train",
    "hi": "underground train",
    "romaji": "chikatetsu"
  },
  "飛行": {
    "en": "aviation",
    "ta": "aviation",
    "hi": "aviation",
    "romaji": "hikou"
  },
  "飛ぶ": {
    "en": "to fly,to hop",
    "ta": "to fly,to hop",
    "hi": "to fly,to hop",
    "romaji": "tobu"
  },
  "飛ばす": {
    "en": "to skip over,to omit",
    "ta": "to skip over,to omit",
    "hi": "to skip over,to omit",
    "romaji": "tobasu"
  },
  "船": {
    "en": "ship,boat,watercraft,shipping,vessel,steamship",
    "ta": "ship,boat,watercraft,shipping,vessel,steamship",
    "hi": "ship,boat,watercraft,shipping,vessel,steamship",
    "romaji": "fune"
  },
  "汽船": {
    "en": "steam boat",
    "ta": "steam boat",
    "hi": "steam boat",
    "romaji": "kisen"
  },
  "船便": {
    "en": "sea mail",
    "ta": "sea mail",
    "hi": "sea mail",
    "romaji": "funabin"
  },
  "旅": {
    "en": "travel,trip,journey",
    "ta": "travel,trip,journey",
    "hi": "travel,trip,journey",
    "romaji": "tabi"
  },
  "旅行": {
    "en": "travel",
    "ta": "travel",
    "hi": "travel",
    "romaji": "ryokou"
  },
  "宿泊": {
    "en": "lodging",
    "ta": "lodging",
    "hi": "lodging",
    "romaji": "shukuhaku"
  },
  "泊まる": {
    "en": "to stay (over night) (v.i.)",
    "ta": "to stay (over night) (v.i.)",
    "hi": "to stay (over night) (v.i.)",
    "romaji": "tomaru"
  },
  "荷物": {
    "en": "luggage",
    "ta": "luggage",
    "hi": "luggage",
    "romaji": "nimotsu"
  },
  "共通": {
    "en": "commonness,community",
    "ta": "commonness,community",
    "hi": "commonness,community",
    "romaji": "kyoutsuu"
  },
  "通過": {
    "en": "passage through,passing",
    "ta": "passage through,passing",
    "hi": "passage through,passing",
    "romaji": "tsuuka"
  },
  "通学": {
    "en": "commuting to school",
    "ta": "commuting to school",
    "hi": "commuting to school",
    "romaji": "tsuugaku"
  },
  "昼": {
    "en": "noon, daytime",
    "ta": "noon, daytime",
    "hi": "noon, daytime",
    "romaji": "hiru"
  },
  "お昼": {
    "en": "lunch,noon",
    "ta": "lunch,noon",
    "hi": "lunch,noon",
    "romaji": "ohiru"
  },
  "昼食": {
    "en": "lunch,midday meal",
    "ta": "lunch,midday meal",
    "hi": "lunch,midday meal",
    "romaji": "chuushoku"
  },
  "夜": {
    "en": "evening,night",
    "ta": "evening,night",
    "hi": "evening,night",
    "romaji": "yo"
  },
  "徹夜": {
    "en": "all night,all night vigil,sleepless night",
    "ta": "all night,all night vigil,sleepless night",
    "hi": "all night,all night vigil,sleepless night",
    "romaji": "tetsuya"
  },
  "夜中": {
    "en": "midnight,dead of night",
    "ta": "midnight,dead of night",
    "hi": "midnight,dead of night",
    "romaji": "yonaka"
  },
  "朝": {
    "en": "morning",
    "ta": "morning",
    "hi": "morning",
    "romaji": "asa"
  },
  "今朝": {
    "en": "this morning",
    "ta": "this morning",
    "hi": "this morning",
    "romaji": "kesa"
  },
  "毎朝": {
    "en": "every morning",
    "ta": "every morning",
    "hi": "every morning",
    "romaji": "maiasa"
  },
  "晩": {
    "en": "evening",
    "ta": "evening",
    "hi": "evening",
    "romaji": "ban"
  },
  "今晩": {
    "en": "this evening",
    "ta": "this evening",
    "hi": "this evening",
    "romaji": "konban"
  },
  "毎晩": {
    "en": "every night",
    "ta": "every night",
    "hi": "every night",
    "romaji": "maiban"
  },
  "酒": {
    "en": "alcohol,sake",
    "ta": "alcohol,sake",
    "hi": "alcohol,sake",
    "romaji": "sake"
  },
  "お酒": {
    "en": "alcohol, rice wine",
    "ta": "alcohol, rice wine",
    "hi": "alcohol, rice wine",
    "romaji": "osake"
  },
  "［お］酒": {
    "en": "alcohol, Japanese rice wine",
    "ta": "alcohol, Japanese rice wine",
    "hi": "alcohol, Japanese rice wine",
    "romaji": "[o] sake"
  },
  "野": {
    "en": "field",
    "ta": "field",
    "hi": "field",
    "romaji": "no"
  },
  "分野": {
    "en": "field,sphere,realm,division,branch",
    "ta": "field,sphere,realm,division,branch",
    "hi": "field,sphere,realm,division,branch",
    "romaji": "bunya"
  },
  "野菜": {
    "en": "vegetable",
    "ta": "vegetable",
    "hi": "vegetable",
    "romaji": "yasai"
  },
  "結果": {
    "en": "result / outcome / consequence",
    "ta": "result / outcome / consequence",
    "hi": "result / outcome / consequence",
    "romaji": "kekka"
  },
  "効果": {
    "en": "effect / efficacy",
    "ta": "effect / efficacy",
    "hi": "effect / efficacy",
    "romaji": "kouka"
  },
  "果物": {
    "en": "Fruit",
    "ta": "Fruit",
    "hi": "Fruit",
    "romaji": "kudamono"
  },
  "味": {
    "en": "flavor, taste",
    "ta": "flavor, taste",
    "hi": "flavor, taste",
    "romaji": "aji"
  },
  "気味": {
    "en": "-like,-looking,-looked",
    "ta": "-like,-looking,-looked",
    "hi": "-like,-looking,-looked",
    "romaji": "kimi"
  },
  "味方": {
    "en": "friend,ally,supporter",
    "ta": "friend,ally,supporter",
    "hi": "friend,ally,supporter",
    "romaji": "mikata"
  },
  "甘い": {
    "en": "sweet",
    "ta": "sweet",
    "hi": "sweet",
    "romaji": "amai"
  },
  "辛い": {
    "en": "painful,heart-breaking",
    "ta": "painful,heart-breaking",
    "hi": "painful,heart-breaking",
    "romaji": "tsurai"
  },
  "皿": {
    "en": "plate,dish",
    "ta": "plate,dish",
    "hi": "plate,dish",
    "romaji": "sara"
  },
  "お皿": {
    "en": "plate, dish",
    "ta": "plate, dish",
    "hi": "plate, dish",
    "romaji": "osara"
  },
  "灰皿": {
    "en": "ashtray",
    "ta": "ashtray",
    "hi": "ashtray",
    "romaji": "haizara"
  },
  "茶": {
    "en": "tea",
    "ta": "tea",
    "hi": "tea",
    "romaji": "cha"
  },
  "茶道": {
    "en": "tea ceremony",
    "ta": "tea ceremony",
    "hi": "tea ceremony",
    "romaji": "sadō"
  },
  "お茶": {
    "en": "tea (Japanese green tea)",
    "ta": "தேநீர்",
    "hi": "चाय",
    "romaji": "ocha"
  },
  "飯": {
    "en": "(sl) meals,food",
    "ta": "(sl) meals,food",
    "hi": "(sl) meals,food",
    "romaji": "meshi"
  },
  "ご飯": {
    "en": "cooked rice / meal",
    "ta": "சோறு/உணவு",
    "hi": "चावल/खाना",
    "romaji": "gohan"
  },
  "御飯": {
    "en": "cooked rice, meal",
    "ta": "cooked rice, meal",
    "hi": "cooked rice, meal",
    "romaji": "gohan"
  },
  "森": {
    "en": "forest",
    "ta": "forest",
    "hi": "forest",
    "romaji": "mori"
  },
  "林": {
    "en": "woods, forest",
    "ta": "woods, forest",
    "hi": "woods, forest",
    "romaji": "hayashi"
  },
  "石": {
    "en": "stone",
    "ta": "stone",
    "hi": "stone",
    "romaji": "ishi"
  },
  "石炭": {
    "en": "coal",
    "ta": "coal",
    "hi": "coal",
    "romaji": "sekitan"
  },
  "石油": {
    "en": "oil,petroleum,kerosene",
    "ta": "oil,petroleum,kerosene",
    "hi": "oil,petroleum,kerosene",
    "romaji": "sekiyu"
  },
  "砂": {
    "en": "sand",
    "ta": "sand",
    "hi": "sand",
    "romaji": "suna"
  },
  "砂漠": {
    "en": "desert",
    "ta": "desert",
    "hi": "desert",
    "romaji": "sabaku"
  },
  "砂糖": {
    "en": "Sugar",
    "ta": "Sugar",
    "hi": "Sugar",
    "romaji": "satou"
  },
  "岩": {
    "en": "rock,crag",
    "ta": "rock,crag",
    "hi": "rock,crag",
    "romaji": "iwa"
  },
  "泥": {
    "en": "mud",
    "ta": "mud",
    "hi": "mud",
    "romaji": "doro"
  },
  "泥棒": {
    "en": "thief; burglar",
    "ta": "thief; burglar",
    "hi": "thief; burglar",
    "romaji": "dorobou"
  },
  "氷": {
    "en": "ice,hail",
    "ta": "ice,hail",
    "hi": "ice,hail",
    "romaji": "koori"
  },
  "波": {
    "en": "wave",
    "ta": "wave",
    "hi": "wave",
    "romaji": "nami"
  },
  "津波": {
    "en": "tsunami, tidal wave",
    "ta": "tsunami, tidal wave",
    "hi": "tsunami, tidal wave",
    "romaji": "tsunami"
  },
  "星": {
    "en": "star",
    "ta": "star",
    "hi": "star",
    "romaji": "hoshi"
  },
  "衛星": {
    "en": "satellite",
    "ta": "satellite",
    "hi": "satellite",
    "romaji": "eisei"
  },
  "星占い": {
    "en": "horoscope",
    "ta": "horoscope",
    "hi": "horoscope",
    "romaji": "hoshiuranai"
  },
  "温度": {
    "en": "temperature",
    "ta": "temperature",
    "hi": "temperature",
    "romaji": "ondo"
  },
  "気温": {
    "en": "temperature",
    "ta": "temperature",
    "hi": "temperature",
    "romaji": "kion"
  },
  "度": {
    "en": "counter for occurrences",
    "ta": "counter for occurrences",
    "hi": "counter for occurrences",
    "romaji": "tabi"
  },
  "忖度": {
    "en": "reading the air / inferring/guessing another's intentions",
    "ta": "reading the air / inferring/guessing another's intentions",
    "hi": "reading the air / inferring/guessing another's intentions",
    "romaji": "sontaku"
  },
  "態度": {
    "en": "attitude / manner / behavior",
    "ta": "attitude / manner / behavior",
    "hi": "attitude / manner / behavior",
    "romaji": "taido"
  },
  "意見": {
    "en": "opinion / view",
    "ta": "opinion / view",
    "hi": "opinion / view",
    "romaji": "iken"
  },
  "意外": {
    "en": "unexpected,surprising",
    "ta": "unexpected,surprising",
    "hi": "unexpected,surprising",
    "romaji": "igai"
  },
  "色": {
    "en": "colour",
    "ta": "colour",
    "hi": "colour",
    "romaji": "iro"
  },
  "景色": {
    "en": "scenery / landscape",
    "ta": "scenery / landscape",
    "hi": "scenery / landscape",
    "romaji": "keshiki"
  },
  "金色": {
    "en": "golden colour",
    "ta": "golden colour",
    "hi": "golden colour",
    "romaji": "kin'iro"
  },
  "形": {
    "en": "shape",
    "ta": "shape",
    "hi": "shape",
    "romaji": "katachi"
  },
  "人形": {
    "en": "doll, figure",
    "ta": "doll, figure",
    "hi": "doll, figure",
    "romaji": "ningyou"
  },
  "諮問": {
    "en": "consultation / inquiry to committee",
    "ta": "consultation / inquiry to committee",
    "hi": "consultation / inquiry to committee",
    "romaji": "shimon"
  },
  "学問": {
    "en": "scholarship,study,learning",
    "ta": "scholarship,study,learning",
    "hi": "scholarship,study,learning",
    "romaji": "gakumon"
  },
  "疑問": {
    "en": "question,problem,doubt,guess",
    "ta": "question,problem,doubt,guess",
    "hi": "question,problem,doubt,guess",
    "romaji": "gimon"
  },
  "答": {
    "en": "answer, response",
    "ta": "answer, response",
    "hi": "answer, response",
    "romaji": "kotae"
  },
  "答案": {
    "en": "examination paper,examination script",
    "ta": "examination paper,examination script",
    "hi": "examination paper,examination script",
    "romaji": "touan"
  },
  "回答": {
    "en": "answer, reply (～します : answer, reply)",
    "ta": "answer, reply (～します : answer, reply)",
    "hi": "answer, reply (～します : answer, reply)",
    "romaji": "kaitō"
  },
  "管理": {
    "en": "control,management (e.g. of a business)",
    "ta": "control,management (e.g. of a business)",
    "hi": "control,management (e.g. of a business)",
    "romaji": "kanri"
  },
  "修理": {
    "en": "repairing,mending",
    "ta": "repairing,mending",
    "hi": "repairing,mending",
    "romaji": "shuuri"
  },
  "処理": {
    "en": "processing,dealing with,treatment,disposition,disposal",
    "ta": "processing,dealing with,treatment,disposition,disposal",
    "hi": "processing,dealing with,treatment,disposition,disposal",
    "romaji": "shori"
  },
  "経由": {
    "en": "go by the way,via",
    "ta": "go by the way,via",
    "hi": "go by the way,via",
    "romaji": "keiyu"
  },
  "理由": {
    "en": "reason",
    "ta": "reason",
    "hi": "reason",
    "romaji": "riyuu"
  },
  "自由": {
    "en": "freedom",
    "ta": "freedom",
    "hi": "freedom",
    "romaji": "jiyuu"
  },
  "以前": {
    "en": "ago,since,before,previous",
    "ta": "ago,since,before,previous",
    "hi": "ago,since,before,previous",
    "romaji": "izen"
  },
  "以来": {
    "en": "since,henceforth",
    "ta": "since,henceforth",
    "hi": "since,henceforth",
    "romaji": "irai"
  },
  "以下": {
    "en": "less than, below",
    "ta": "less than, below",
    "hi": "less than, below",
    "romaji": "ika"
  },
  "別": {
    "en": "distinction, different",
    "ta": "distinction, different",
    "hi": "distinction, different",
    "romaji": "betsu"
  },
  "区別": {
    "en": "distinction,differentiation,classification",
    "ta": "distinction,differentiation,classification",
    "hi": "distinction,differentiation,classification",
    "romaji": "kubetsu"
  },
  "差別": {
    "en": "discrimination,distinction,differentiation",
    "ta": "discrimination,distinction,differentiation",
    "hi": "discrimination,distinction,differentiation",
    "romaji": "sabetsu"
  },
  "特徴": {
    "en": "feature,characteristic",
    "ta": "feature,characteristic",
    "hi": "feature,characteristic",
    "romaji": "tokuchou"
  },
  "独特": {
    "en": "peculiarity,uniqueness,characteristic",
    "ta": "peculiarity,uniqueness,characteristic",
    "hi": "peculiarity,uniqueness,characteristic",
    "romaji": "dokutoku"
  },
  "特別": {
    "en": "special / particular",
    "ta": "special / particular",
    "hi": "special / particular",
    "romaji": "tokubetsu"
  },
  "共同": {
    "en": "cooperation,association,collaboration,joint",
    "ta": "cooperation,association,collaboration,joint",
    "hi": "cooperation,association,collaboration,joint",
    "romaji": "kyoudou"
  },
  "同一": {
    "en": "identity,sameness,similarity",
    "ta": "identity,sameness,similarity",
    "hi": "identity,sameness,similarity",
    "romaji": "douitsu"
  },
  "同時": {
    "en": "simultaneous(ly),concurrent,same time,synchronous",
    "ta": "simultaneous(ly),concurrent,same time,synchronous",
    "hi": "simultaneous(ly),concurrent,same time,synchronous",
    "romaji": "douji"
  },
  "違反": {
    "en": "violation (of law),transgression,infringement,breach",
    "ta": "violation (of law),transgression,infringement,breach",
    "hi": "violation (of law),transgression,infringement,breach",
    "romaji": "ihan"
  },
  "反抗": {
    "en": "opposition,resistance",
    "ta": "opposition,resistance",
    "hi": "opposition,resistance",
    "romaji": "hankou"
  },
  "反対": {
    "en": "oppose, opposition, resistance",
    "ta": "oppose, opposition, resistance",
    "hi": "oppose, opposition, resistance",
    "romaji": "hantai"
  },
  "全": {
    "en": "all,whole,entire,complete,overall,pan",
    "ta": "all,whole,entire,complete,overall,pan",
    "hi": "all,whole,entire,complete,overall,pan",
    "romaji": "zen"
  },
  "完全": {
    "en": "perfection,completeness",
    "ta": "perfection,completeness",
    "hi": "perfection,completeness",
    "romaji": "kanzen"
  },
  "全て": {
    "en": "all,the whole,entirely,in general,wholly",
    "ta": "all,the whole,entirely,in general,wholly",
    "hi": "all,the whole,entirely,in general,wholly",
    "romaji": "subete"
  },
  "半": {
    "en": "half",
    "ta": "half",
    "hi": "half",
    "romaji": "han"
  },
  "大半": {
    "en": "majority,mostly,generally",
    "ta": "majority,mostly,generally",
    "hi": "majority,mostly,generally",
    "romaji": "taihan"
  },
  "半ば": {
    "en": "middle,half,semi,halfway,partly",
    "ta": "middle,half,semi,halfway,partly",
    "hi": "middle,half,semi,halfway,partly",
    "romaji": "nakaba"
  },
  "両替": {
    "en": "change,money exchange",
    "ta": "change,money exchange",
    "hi": "change,money exchange",
    "romaji": "ryougae"
  },
  "両方": {
    "en": "both sides, both parties",
    "ta": "both sides, both parties",
    "hi": "both sides, both parties",
    "romaji": "ryouhou"
  },
  "両親": {
    "en": "both parents",
    "ta": "both parents",
    "hi": "both parents",
    "romaji": "ryoushin"
  },
  "各自": {
    "en": "each person / respective",
    "ta": "ஒவ்வொரு நபரும்",
    "hi": "प्रत्येक व्यक्ति",
    "romaji": "kakuji"
  },
  "各地": {
    "en": "every place / various locations",
    "ta": "பல்வேறு இடங்கள்",
    "hi": "विभिन्न स्थान",
    "romaji": "kakuchi"
  },
  "各々": {
    "en": "each / respectively",
    "ta": "ஒவ்வொன்றும்",
    "hi": "प्रत्येक",
    "romaji": "onoono"
  },
  "次": {
    "en": "next",
    "ta": "next",
    "hi": "next",
    "romaji": "tsugi"
  },
  "漸次": {
    "en": "gradually / step by step / progressively",
    "ta": "gradually / step by step / progressively",
    "hi": "gradually / step by step / progressively",
    "romaji": "zenji"
  },
  "次第": {
    "en": "(1) order,precedence,(2) circumstances,(3)",
    "ta": "(1) order,precedence,(2) circumstances,(3)",
    "hi": "(1) order,precedence,(2) circumstances,(3)",
    "romaji": "shidai"
  },
  "数": {
    "en": "number,figure",
    "ta": "number,figure",
    "hi": "number,figure",
    "romaji": "kazu"
  },
  "数字": {
    "en": "numeral,figure",
    "ta": "numeral,figure",
    "hi": "numeral,figure",
    "romaji": "suuji"
  },
  "数学": {
    "en": "mathematics",
    "ta": "mathematics",
    "hi": "mathematics",
    "romaji": "suugaku"
  },
  "量": {
    "en": "quantity,amount,volume,portion (of food)",
    "ta": "quantity,amount,volume,portion (of food)",
    "hi": "quantity,amount,volume,portion (of food)",
    "romaji": "ryou"
  },
  "計": {
    "en": "plan",
    "ta": "plan",
    "hi": "plan",
    "romaji": "kei"
  },
  "会計": {
    "en": "account,finance,accountant",
    "ta": "account,finance,accountant",
    "hi": "account,finance,accountant",
    "romaji": "kaikei"
  },
  "計画": {
    "en": "plan,project,schedule,scheme,program",
    "ta": "plan,project,schedule,scheme,program",
    "hi": "plan,project,schedule,scheme,program",
    "romaji": "keikaku"
  },
  "点": {
    "en": "mark, score, grade; point, dot",
    "ta": "mark, score, grade; point, dot",
    "hi": "mark, score, grade; point, dot",
    "romaji": "ten"
  },
  "欠点": {
    "en": "faults,defect,weakness",
    "ta": "faults,defect,weakness",
    "hi": "faults,defect,weakness",
    "romaji": "ketten"
  },
  "要点": {
    "en": "gist,main point",
    "ta": "gist,main point",
    "hi": "gist,main point",
    "romaji": "youten"
  },
  "位": {
    "en": "grade,rank,about",
    "ta": "grade,rank,about",
    "hi": "grade,rank,about",
    "romaji": "kurai"
  },
  "位置": {
    "en": "place,situation,position,location",
    "ta": "place,situation,position,location",
    "hi": "place,situation,position,location",
    "romaji": "ichi"
  },
  "単位": {
    "en": "unit,denomination,credit (in school)",
    "ta": "unit,denomination,credit (in school)",
    "hi": "unit,denomination,credit (in school)",
    "romaji": "tani"
  },
  "服": {
    "en": "clothes",
    "ta": "உடை / ஆடைகள்",
    "hi": "कपड़े",
    "romaji": "fuku"
  },
  "衣服": {
    "en": "clothes",
    "ta": "clothes",
    "hi": "clothes",
    "romaji": "ifuku"
  },
  "克服": {
    "en": "subjugation,conquest",
    "ta": "subjugation,conquest",
    "hi": "subjugation,conquest",
    "romaji": "kokufuku"
  },
  "帽子": {
    "en": "hat",
    "ta": "hat",
    "hi": "hat",
    "romaji": "boushi"
  },
  "靴": {
    "en": "shoes",
    "ta": "காலணி / காலணிகள்",
    "hi": "जूते",
    "romaji": "kutsu"
  },
  "靴下": {
    "en": "Socks",
    "ta": "Socks",
    "hi": "Socks",
    "romaji": "kutsushita"
  },
  "袋": {
    "en": "bag,sack",
    "ta": "bag,sack",
    "hi": "bag,sack",
    "romaji": "fukuro"
  },
  "手袋": {
    "en": "glove(s)",
    "ta": "glove(s)",
    "hi": "glove(s)",
    "romaji": "tebukuro"
  },
  "非常袋": {
    "en": "emergency kit",
    "ta": "emergency kit",
    "hi": "emergency kit",
    "romaji": "hijōbukuro"
  },
  "注": {
    "en": "annotation,explanatory note",
    "ta": "annotation,explanatory note",
    "hi": "annotation,explanatory note",
    "romaji": "chuu"
  },
  "注ぐ": {
    "en": "to pour (into),to irrigate,to pay,to fill,to feed (e.g. a fire)",
    "ta": "to pour (into),to irrigate,to pay,to fill,to feed (e.g. a fire)",
    "hi": "to pour (into),to irrigate,to pay,to fill,to feed (e.g. a fire)",
    "romaji": "sosogu"
  },
  "注目": {
    "en": "notice,attention,observation",
    "ta": "notice,attention,observation",
    "hi": "notice,attention,observation",
    "romaji": "chuumoku"
  },
  "願い": {
    "en": "desire,wish,request",
    "ta": "desire,wish,request",
    "hi": "desire,wish,request",
    "romaji": "negai"
  },
  "願う": {
    "en": "to desire,to wish,to request",
    "ta": "to desire,to wish,to request",
    "hi": "to desire,to wish,to request",
    "romaji": "negau"
  },
  "信頼": {
    "en": "trust / confidence",
    "ta": "trust / confidence",
    "hi": "trust / confidence",
    "romaji": "shinrai"
  },
  "依頼": {
    "en": "(1) request,commission,dispatch,(2) dependence,trust",
    "ta": "(1) request,commission,dispatch,(2) dependence,trust",
    "hi": "(1) request,commission,dispatch,(2) dependence,trust",
    "romaji": "irai"
  },
  "頼る": {
    "en": "to rely on,to have recourse to,to depend on",
    "ta": "to rely on,to have recourse to,to depend on",
    "hi": "to rely on,to have recourse to,to depend on",
    "romaji": "tayoru"
  },
  "困難": {
    "en": "difficulty,distress",
    "ta": "difficulty,distress",
    "hi": "difficulty,distress",
    "romaji": "konnan"
  },
  "困る": {
    "en": "to be troubled / in trouble",
    "ta": "to be troubled / in trouble",
    "hi": "to be troubled / in trouble",
    "romaji": "komaru"
  },
  "困ります": {
    "en": "be in trouble, have a problem",
    "ta": "be in trouble, have a problem",
    "hi": "be in trouble, have a problem",
    "romaji": "komarimasu"
  },
  "忘れ物": {
    "en": "lost article, something forgotten",
    "ta": "lost article, something forgotten",
    "hi": "lost article, something forgotten",
    "romaji": "wasuremono"
  },
  "忘年会": {
    "en": "year-end party",
    "ta": "year-end party",
    "hi": "year-end party",
    "romaji": "bōnenkai"
  },
  "忘れる": {
    "en": "to forget",
    "ta": "to forget",
    "hi": "to forget",
    "romaji": "wasureru"
  },
  "覚悟": {
    "en": "resolution,resignation,readiness,preparedness",
    "ta": "resolution,resignation,readiness,preparedness",
    "hi": "resolution,resignation,readiness,preparedness",
    "romaji": "kakugo"
  },
  "感覚": {
    "en": "sense,sensation",
    "ta": "sense,sensation",
    "hi": "sense,sensation",
    "romaji": "kankaku"
  },
  "覚ます": {
    "en": "to awaken",
    "ta": "to awaken",
    "hi": "to awaken",
    "romaji": "samasu"
  },
  "学習": {
    "en": "study,learning",
    "ta": "study,learning",
    "hi": "study,learning",
    "romaji": "gakushuu"
  },
  "練習": {
    "en": "practice",
    "ta": "practice",
    "hi": "practice",
    "romaji": "renshuu"
  },
  "習慣": {
    "en": "habit / custom",
    "ta": "habit / custom",
    "hi": "habit / custom",
    "romaji": "shuukan"
  },
  "訓練": {
    "en": "practice,training",
    "ta": "practice,training",
    "hi": "practice,training",
    "romaji": "kunren"
  },
  "試し": {
    "en": "trial,test",
    "ta": "trial,test",
    "hi": "trial,test",
    "romaji": "tameshi"
  },
  "試す": {
    "en": "to attempt,to test",
    "ta": "to attempt,to test",
    "hi": "to attempt,to test",
    "romaji": "tamesu"
  },
  "試験": {
    "en": "examination, test",
    "ta": "examination, test",
    "hi": "examination, test",
    "romaji": "shiken"
  },
  "経験": {
    "en": "experience",
    "ta": "experience",
    "hi": "experience",
    "romaji": "keiken"
  },
  "実験": {
    "en": "experiment",
    "ta": "experiment",
    "hi": "experiment",
    "romaji": "jikken"
  },
  "合図": {
    "en": "sign,signal",
    "ta": "sign,signal",
    "hi": "sign,signal",
    "romaji": "aizu"
  },
  "会合": {
    "en": "meeting,assembly",
    "ta": "meeting,assembly",
    "hi": "meeting,assembly",
    "romaji": "kaigou"
  },
  "集団": {
    "en": "group,mass",
    "ta": "group,mass",
    "hi": "group,mass",
    "romaji": "shuudan"
  },
  "集中": {
    "en": "concentration,focusing the mind",
    "ta": "concentration,focusing the mind",
    "hi": "concentration,focusing the mind",
    "romaji": "shuuchuu"
  },
  "集まり": {
    "en": "gathering,meeting,assembly,collection",
    "ta": "gathering,meeting,assembly,collection",
    "hi": "gathering,meeting,assembly,collection",
    "romaji": "atsumari"
  },
  "配慮": {
    "en": "consideration / thoughtfulness / care",
    "ta": "consideration / thoughtfulness / care",
    "hi": "consideration / thoughtfulness / care",
    "romaji": "hairyo"
  },
  "支配": {
    "en": "rule,control,direction",
    "ta": "rule,control,direction",
    "hi": "rule,control,direction",
    "romaji": "shihai"
  },
  "心配": {
    "en": "worry,concern,anxiety,care",
    "ta": "worry,concern,anxiety,care",
    "hi": "worry,concern,anxiety,care",
    "romaji": "shinpai"
  },
  "解決": {
    "en": "resolution / solution / settlement",
    "ta": "resolution / solution / settlement",
    "hi": "resolution / solution / settlement",
    "romaji": "kaiketsu"
  },
  "決心": {
    "en": "determination,resolution",
    "ta": "determination,resolution",
    "hi": "determination,resolution",
    "romaji": "kesshin"
  },
  "決定": {
    "en": "decision,determination",
    "ta": "decision,determination",
    "hi": "decision,determination",
    "romaji": "kettei"
  },
  "安定": {
    "en": "stability,equilibrium",
    "ta": "stability,equilibrium",
    "hi": "stability,equilibrium",
    "romaji": "antei"
  },
  "勘定": {
    "en": "calculation,counting,consideration",
    "ta": "calculation,counting,consideration",
    "hi": "calculation,counting,consideration",
    "romaji": "kanjou"
  },
  "約": {
    "en": "approximately,about,some",
    "ta": "approximately,about,some",
    "hi": "approximately,about,some",
    "romaji": "yaku"
  },
  "契約": {
    "en": "contract,compact,agreement",
    "ta": "contract,compact,agreement",
    "hi": "contract,compact,agreement",
    "romaji": "keiyaku"
  },
  "婚約": {
    "en": "engagement,betrothal",
    "ta": "engagement,betrothal",
    "hi": "engagement,betrothal",
    "romaji": "konyaku"
  },
  "関連": {
    "en": "relation,connection,relevance",
    "ta": "relation,connection,relevance",
    "hi": "relation,connection,relevance",
    "romaji": "kanren"
  },
  "連れ": {
    "en": "companion,company",
    "ta": "companion,company",
    "hi": "companion,company",
    "romaji": "tsure"
  },
  "連想": {
    "en": "association (of ideas),suggestion",
    "ta": "association (of ideas),suggestion",
    "hi": "association (of ideas),suggestion",
    "romaji": "rensou"
  },
  "相続": {
    "en": "succession,inheritance",
    "ta": "succession,inheritance",
    "hi": "succession,inheritance",
    "romaji": "souzoku"
  },
  "続き": {
    "en": "sequel,continuation",
    "ta": "sequel,continuation",
    "hi": "sequel,continuation",
    "romaji": "tsuzuki"
  },
  "連続": {
    "en": "serial,consecutive,continuity,continuing",
    "ta": "serial,consecutive,continuity,continuing",
    "hi": "serial,consecutive,continuity,continuing",
    "romaji": "renzoku"
  },
  "変": {
    "en": "strange, odd",
    "ta": "strange, odd",
    "hi": "strange, odd",
    "romaji": "hen"
  },
  "大変": {
    "en": "awful,dreadful,terrible,very",
    "ta": "awful,dreadful,terrible,very",
    "hi": "awful,dreadful,terrible,very",
    "romaji": "taihen"
  },
  "変化": {
    "en": "goblin,ghost,apparition,bugbear",
    "ta": "goblin,ghost,apparition,bugbear",
    "hi": "goblin,ghost,apparition,bugbear",
    "romaji": "henka"
  },
  "与える": {
    "en": "to give,to present,to award",
    "ta": "to give,to present,to award",
    "hi": "to give,to present,to award",
    "romaji": "ataeru"
  },
  "及ぼす": {
    "en": "to exert,to cause,to exercise",
    "ta": "to exert,to cause,to exercise",
    "hi": "to exert,to cause,to exercise",
    "romaji": "oyobosu"
  },
  "検討": {
    "en": "consideration,examination,investigation,study,scrutiny",
    "ta": "consideration,examination,investigation,study,scrutiny",
    "hi": "consideration,examination,investigation,study,scrutiny",
    "romaji": "kentou"
  },
  "議論": {
    "en": "argument,discussion,dispute",
    "ta": "argument,discussion,dispute",
    "hi": "argument,discussion,dispute",
    "romaji": "giron"
  },
  "結論": {
    "en": "conclusion",
    "ta": "conclusion",
    "hi": "conclusion",
    "romaji": "ketsuron"
  },
  "勿論": {
    "en": "of course,certainly,naturally",
    "ta": "of course,certainly,naturally",
    "hi": "of course,certainly,naturally",
    "romaji": "mochiron"
  },
  "述べる": {
    "en": "to state,to express,to mention",
    "ta": "to state,to express,to mention",
    "hi": "to state,to express,to mention",
    "romaji": "noberu"
  },
  "掲示": {
    "en": "notice,bulletin",
    "ta": "notice,bulletin",
    "hi": "notice,bulletin",
    "romaji": "keiji"
  },
  "示す": {
    "en": "to denote,to show,to point out,to indicate",
    "ta": "to denote,to show,to point out,to indicate",
    "hi": "to denote,to show,to point out,to indicate",
    "romaji": "shimesu"
  },
  "現状": {
    "en": "current situation / present state",
    "ta": "current situation / present state",
    "hi": "current situation / present state",
    "romaji": "genjou"
  },
  "現す": {
    "en": "to show,to indicate,to display",
    "ta": "to show,to indicate,to display",
    "hi": "to show,to indicate,to display",
    "romaji": "arawasu"
  },
  "現れ": {
    "en": "embodiment,materialization",
    "ta": "embodiment,materialization",
    "hi": "embodiment,materialization",
    "romaji": "araware"
  },
  "表": {
    "en": "table (e.g. Tab 1),chart,list",
    "ta": "table (e.g. Tab 1),chart,list",
    "hi": "table (e.g. Tab 1),chart,list",
    "romaji": "hyou"
  },
  "表す": {
    "en": "to express,to show,to reveal",
    "ta": "to express,to show,to reveal",
    "hi": "to express,to show,to reveal",
    "romaji": "arawasu"
  },
  "代表": {
    "en": "representative,representation,delegation,type,example,",
    "ta": "representative,representation,delegation,type,example,",
    "hi": "representative,representation,delegation,type,example,",
    "romaji": "daihyou"
  },
  "希望": {
    "en": "hope,wish,aspiration",
    "ta": "hope,wish,aspiration",
    "hi": "hope,wish,aspiration",
    "romaji": "kibou"
  },
  "失望": {
    "en": "disappointment,despair",
    "ta": "disappointment,despair",
    "hi": "disappointment,despair",
    "romaji": "shitsubou"
  },
  "望み": {
    "en": "wish,desire,(a) hope",
    "ta": "wish,desire,(a) hope",
    "hi": "wish,desire,(a) hope",
    "romaji": "nozomi"
  },
  "請求": {
    "en": "claim,demand,application,request",
    "ta": "claim,demand,application,request",
    "hi": "claim,demand,application,request",
    "romaji": "seikyuu"
  },
  "要求": {
    "en": "request,demand,requisition",
    "ta": "request,demand,requisition",
    "hi": "request,demand,requisition",
    "romaji": "youkyuu"
  },
  "求める": {
    "en": "to seek,to request,to demand,to want,to wish for,to",
    "ta": "to seek,to request,to demand,to want,to wish for,to",
    "hi": "to seek,to request,to demand,to want,to wish for,to",
    "romaji": "motomeru"
  },
  "得る": {
    "en": "to get,to gain,to win",
    "ta": "to get,to gain,to win",
    "hi": "to get,to gain,to win",
    "romaji": "eru"
  },
  "得意": {
    "en": "pride,triumph,prosperity",
    "ta": "pride,triumph,prosperity",
    "hi": "pride,triumph,prosperity",
    "romaji": "tokui"
  },
  "納得": {
    "en": "consent,assent,understanding",
    "ta": "consent,assent,understanding",
    "hi": "consent,assent,understanding",
    "romaji": "nattoku"
  },
  "損失": {
    "en": "loss / damage",
    "ta": "loss / damage",
    "hi": "loss / damage",
    "romaji": "sonshitsu"
  },
  "失敗": {
    "en": "failure / mistake",
    "ta": "failure / mistake",
    "hi": "failure / mistake",
    "romaji": "shippai"
  },
  "失う": {
    "en": "to lose,to part with",
    "ta": "to lose,to part with",
    "hi": "to lose,to part with",
    "romaji": "ushinau"
  },
  "負担": {
    "en": "burden / load / charge / expense",
    "ta": "burden / load / charge / expense",
    "hi": "burden / load / charge / expense",
    "romaji": "futan"
  },
  "負け": {
    "en": "defeat,loss,losing (a game)",
    "ta": "defeat,loss,losing (a game)",
    "hi": "defeat,loss,losing (a game)",
    "romaji": "make"
  },
  "負ける": {
    "en": "to lose (a game) (v.i.), to be defeated",
    "ta": "to lose (a game) (v.i.), to be defeated",
    "hi": "to lose (a game) (v.i.), to be defeated",
    "romaji": "makeru"
  },
  "勝ち": {
    "en": "win,victory",
    "ta": "win,victory",
    "hi": "win,victory",
    "romaji": "kachi"
  },
  "優勝": {
    "en": "overall victory,championship",
    "ta": "overall victory,championship",
    "hi": "overall victory,championship",
    "romaji": "yuushou"
  },
  "勝つ": {
    "en": "to win",
    "ta": "to win",
    "hi": "to win",
    "romaji": "katsu"
  },
  "論争": {
    "en": "controversy,dispute",
    "ta": "controversy,dispute",
    "hi": "controversy,dispute",
    "romaji": "ronsou"
  },
  "戦争": {
    "en": "war",
    "ta": "war",
    "hi": "war",
    "romaji": "sensou"
  },
  "競争": {
    "en": "competition, contest",
    "ta": "competition, contest",
    "hi": "competition, contest",
    "romaji": "kyousou"
  },
  "大戦": {
    "en": "great war,great battle",
    "ta": "great war,great battle",
    "hi": "great war,great battle",
    "romaji": "taisen"
  },
  "戦い": {
    "en": "battle,fight,struggle,conflict",
    "ta": "battle,fight,struggle,conflict",
    "hi": "battle,fight,struggle,conflict",
    "romaji": "tatakai"
  },
  "戦う": {
    "en": "to fight,to battle,to combat",
    "ta": "to fight,to battle,to combat",
    "hi": "to fight,to battle,to combat",
    "romaji": "tatakau"
  },
  "遵守": {
    "en": "compliance / adherence to rules",
    "ta": "compliance / adherence to rules",
    "hi": "compliance / adherence to rules",
    "romaji": "junshu"
  },
  "守る": {
    "en": "to protect,to obey,to guard,to abide (by the rules)",
    "ta": "to protect,to obey,to guard,to abide (by the rules)",
    "hi": "to protect,to obey,to guard,to abide (by the rules)",
    "romaji": "mamoru"
  },
  "留守": {
    "en": "absence; not at home",
    "ta": "absence; not at home",
    "hi": "absence; not at home",
    "romaji": "rusu"
  },
  "援助": {
    "en": "assistance,aid,support",
    "ta": "assistance,aid,support",
    "hi": "assistance,aid,support",
    "romaji": "enjo"
  },
  "救助": {
    "en": "relief,aid,rescue",
    "ta": "relief,aid,rescue",
    "hi": "relief,aid,rescue",
    "romaji": "kyuujo"
  },
  "助手": {
    "en": "helper,helpmeet,assistant,tutor",
    "ta": "helper,helpmeet,assistant,tutor",
    "hi": "helper,helpmeet,assistant,tutor",
    "romaji": "joshu"
  },
  "救う": {
    "en": "to rescue from,to help out of",
    "ta": "to rescue from,to help out of",
    "hi": "to rescue from,to help out of",
    "romaji": "sukuu"
  },
  "救急車": {
    "en": "ambulance",
    "ta": "ambulance",
    "hi": "ambulance",
    "romaji": "kyūkyūsha"
  },
  "支給": {
    "en": "payment,allowance",
    "ta": "payment,allowance",
    "hi": "payment,allowance",
    "romaji": "shikyuu"
  },
  "支出": {
    "en": "expenditure,expenses",
    "ta": "expenditure,expenses",
    "hi": "expenditure,expenses",
    "romaji": "shishutsu"
  },
  "支度": {
    "en": "preparation",
    "ta": "preparation",
    "hi": "preparation",
    "romaji": "shitaku"
  },
  "払拭": {
    "en": "sweep away / dispel / eradicate",
    "ta": "sweep away / dispel / eradicate",
    "hi": "sweep away / dispel / eradicate",
    "romaji": "fusshoku"
  },
  "支払": {
    "en": "payment",
    "ta": "payment",
    "hi": "payment",
    "romaji": "shiharai"
  },
  "払う": {
    "en": "to pay",
    "ta": "to pay",
    "hi": "to pay",
    "romaji": "harau"
  },
  "役割": {
    "en": "part,assigning (allotment of) parts,role,duties",
    "ta": "part,assigning (allotment of) parts,role,duties",
    "hi": "part,assigning (allotment of) parts,role,duties",
    "romaji": "yakuwari"
  },
  "割る": {
    "en": "to divide,to cut,to break,to halve",
    "ta": "to divide,to cut,to break,to halve",
    "hi": "to divide,to cut,to break,to halve",
    "romaji": "waru"
  },
  "割合": {
    "en": "rate, ratio, percentage",
    "ta": "rate, ratio, percentage",
    "hi": "rate, ratio, percentage",
    "romaji": "wariai"
  },
  "増加": {
    "en": "increase,addition",
    "ta": "increase,addition",
    "hi": "increase,addition",
    "romaji": "zouka"
  },
  "増す": {
    "en": "to increase,to grow",
    "ta": "to increase,to grow",
    "hi": "to increase,to grow",
    "romaji": "masu"
  },
  "増える": {
    "en": "to increase / grow",
    "ta": "to increase / grow",
    "hi": "to increase / grow",
    "romaji": "fueru"
  },
  "削減": {
    "en": "reduction / cutback / curtailment",
    "ta": "reduction / cutback / curtailment",
    "hi": "reduction / cutback / curtailment",
    "romaji": "sakugen"
  },
  "減る": {
    "en": "to decrease / diminish",
    "ta": "to decrease / diminish",
    "hi": "to decrease / diminish",
    "romaji": "heru"
  },
  "加減": {
    "en": "addition and subtraction,allowance for",
    "ta": "addition and subtraction,allowance for",
    "hi": "addition and subtraction,allowance for",
    "romaji": "kagen"
  },
  "促進": {
    "en": "promotion / acceleration / facilitation",
    "ta": "promotion / acceleration / facilitation",
    "hi": "promotion / acceleration / facilitation",
    "romaji": "sokushin"
  },
  "進学": {
    "en": "going on to university",
    "ta": "going on to university",
    "hi": "going on to university",
    "romaji": "shingaku"
  },
  "退屈": {
    "en": "tedium,boredom",
    "ta": "tedium,boredom",
    "hi": "tedium,boredom",
    "romaji": "taikutsu"
  },
  "移動": {
    "en": "removal,migration,movement",
    "ta": "removal,migration,movement",
    "hi": "removal,migration,movement",
    "romaji": "idou"
  },
  "移す": {
    "en": "to remove,to transfer,to infect",
    "ta": "to remove,to transfer,to infect",
    "hi": "to remove,to transfer,to infect",
    "romaji": "utsusu"
  },
  "移る": {
    "en": "to move (from a house); to transfer (from a department); to shift",
    "ta": "to move (from a house); to transfer (from a department); to shift",
    "hi": "to move (from a house); to transfer (from a department); to shift",
    "romaji": "utsuru"
  },
  "運転": {
    "en": "operation,motion,driving",
    "ta": "operation,motion,driving",
    "hi": "operation,motion,driving",
    "romaji": "unten"
  },
  "転ぶ": {
    "en": "to fall down,to fall over",
    "ta": "to fall down,to fall over",
    "hi": "to fall down,to fall over",
    "romaji": "korobu"
  },
  "転勤": {
    "en": "transfer (～します : be transferred to another office)",
    "ta": "transfer (～します : be transferred to another office)",
    "hi": "transfer (～します : be transferred to another office)",
    "romaji": "tenkin"
  },
  "回": {
    "en": "counter for occurrences",
    "ta": "counter for occurrences",
    "hi": "counter for occurrences",
    "romaji": "kai"
  },
  "回復": {
    "en": "recovery (from",
    "ta": "recovery (from",
    "hi": "recovery (from",
    "romaji": "kaifuku"
  },
  "今回": {
    "en": "now,this time,lately",
    "ta": "now,this time,lately",
    "hi": "now,this time,lately",
    "romaji": "konkai"
  },
  "傾向": {
    "en": "tendency / trend / inclination",
    "ta": "tendency / trend / inclination",
    "hi": "tendency / trend / inclination",
    "romaji": "keikou"
  },
  "方向": {
    "en": "direction,course,way",
    "ta": "direction,course,way",
    "hi": "direction,course,way",
    "romaji": "houkou"
  },
  "向く": {
    "en": "to face",
    "ta": "to face",
    "hi": "to face",
    "romaji": "muku"
  },
  "信仰": {
    "en": "(religious) faith,belief,creed",
    "ta": "(religious) faith,belief,creed",
    "hi": "(religious) faith,belief,creed",
    "romaji": "shinkou"
  },
  "疑う": {
    "en": "to doubt,to distrust,to be suspicious of,to suspect",
    "ta": "to doubt,to distrust,to be suspicious of,to suspect",
    "hi": "to doubt,to distrust,to be suspicious of,to suspect",
    "romaji": "utagau"
  },
  "確実": {
    "en": "certainty,reliability,soundness",
    "ta": "certainty,reliability,soundness",
    "hi": "certainty,reliability,soundness",
    "romaji": "kakujitsu"
  },
  "確認": {
    "en": "affirmation,confirmation",
    "ta": "affirmation,confirmation",
    "hi": "affirmation,confirmation",
    "romaji": "kakunin"
  },
  "正確": {
    "en": "accurate,punctuality,exactness,authenticity,veracity",
    "ta": "accurate,punctuality,exactness,authenticity,veracity",
    "hi": "accurate,punctuality,exactness,authenticity,veracity",
    "romaji": "seikaku"
  },
  "判断": {
    "en": "judgment / decision / assessment",
    "ta": "judgment / decision / assessment",
    "hi": "judgment / decision / assessment",
    "romaji": "handan"
  },
  "裁判": {
    "en": "trial,judgement",
    "ta": "trial,judgement",
    "hi": "trial,judgement",
    "romaji": "saiban"
  },
  "審判": {
    "en": "refereeing,trial,judgement,umpire,referee",
    "ta": "refereeing,trial,judgement,umpire,referee",
    "hi": "refereeing,trial,judgement,umpire,referee",
    "romaji": "shinpan"
  },
  "断る": {
    "en": "to refuse / decline / turn down",
    "ta": "to refuse / decline / turn down",
    "hi": "to refuse / decline / turn down",
    "romaji": "kotowaru"
  },
  "横断": {
    "en": "crossing",
    "ta": "crossing",
    "hi": "crossing",
    "romaji": "oudan"
  },
  "許可": {
    "en": "permission,approval",
    "ta": "permission,approval",
    "hi": "permission,approval",
    "romaji": "kyoka"
  },
  "免許": {
    "en": "license,permit,licence,certificate",
    "ta": "license,permit,licence,certificate",
    "hi": "license,permit,licence,certificate",
    "romaji": "menkyo"
  },
  "許す": {
    "en": "to permit,to allow,to approve",
    "ta": "to permit,to allow,to approve",
    "hi": "to permit,to allow,to approve",
    "romaji": "yurusu"
  },
  "禁煙": {
    "en": "No Smoking!",
    "ta": "No Smoking!",
    "hi": "No Smoking!",
    "romaji": "kinen"
  },
  "禁止": {
    "en": "prohibition,ban",
    "ta": "prohibition,ban",
    "hi": "prohibition,ban",
    "romaji": "kinshi"
  },
  "使用禁止": {
    "en": "Do Not Use",
    "ta": "Do Not Use",
    "hi": "Do Not Use",
    "romaji": "shiyōkinshi"
  },
  "法": {
    "en": "Act (law: the X Act)",
    "ta": "Act (law: the X Act)",
    "hi": "Act (law: the X Act)",
    "romaji": "hou"
  },
  "憲法": {
    "en": "constitution",
    "ta": "constitution",
    "hi": "constitution",
    "romaji": "kenpou"
  },
  "作法": {
    "en": "manners,etiquette,propriety",
    "ta": "manners,etiquette,propriety",
    "hi": "manners,etiquette,propriety",
    "romaji": "sahou"
  },
  "規則": {
    "en": "rule, regulation",
    "ta": "rule, regulation",
    "hi": "rule, regulation",
    "romaji": "kisoku"
  },
  "義務": {
    "en": "duty,obligation,responsibility",
    "ta": "duty,obligation,responsibility",
    "hi": "duty,obligation,responsibility",
    "romaji": "gimu"
  },
  "主義": {
    "en": "doctrine,rule,principle",
    "ta": "doctrine,rule,principle",
    "hi": "doctrine,rule,principle",
    "romaji": "shugi"
  },
  "講義": {
    "en": "a lecture",
    "ta": "a lecture",
    "hi": "a lecture",
    "romaji": "kougi"
  },
  "事務": {
    "en": "business,office work",
    "ta": "business,office work",
    "hi": "business,office work",
    "romaji": "jimu"
  },
  "務め": {
    "en": "(1) service,duty,(2) Buddhist religious services",
    "ta": "(1) service,duty,(2) Buddhist religious services",
    "hi": "(1) service,duty,(2) Buddhist religious services",
    "romaji": "tsutome"
  },
  "責任": {
    "en": "responsibility / duty",
    "ta": "responsibility / duty",
    "hi": "responsibility / duty",
    "romaji": "sekinin"
  },
  "責める": {
    "en": "to condemn,to blame,to criticize",
    "ta": "to condemn,to blame,to criticize",
    "hi": "to condemn,to blame,to criticize",
    "romaji": "semeru"
  },
  "任せる": {
    "en": "to entrust to another,to leave to",
    "ta": "to entrust to another,to leave to",
    "hi": "to entrust to another,to leave to",
    "romaji": "makaseru"
  },
  "権利": {
    "en": "right,privilege",
    "ta": "right,privilege",
    "hi": "right,privilege",
    "romaji": "kenri"
  },
  "自殺": {
    "en": "suicide",
    "ta": "suicide",
    "hi": "suicide",
    "romaji": "jisatsu"
  },
  "自身": {
    "en": "by oneself,personally",
    "ta": "by oneself,personally",
    "hi": "by oneself,personally",
    "romaji": "jishin"
  },
  "自然": {
    "en": "nature,spontaneous",
    "ta": "nature,spontaneous",
    "hi": "nature,spontaneous",
    "romaji": "shizen"
  },
  "他": {
    "en": "other (esp. places and things)",
    "ta": "other (esp. places and things)",
    "hi": "other (esp. places and things)",
    "romaji": "ta"
  },
  "他人": {
    "en": "another person,unrelated person,outsider,stranger",
    "ta": "another person,unrelated person,outsider,stranger",
    "hi": "another person,unrelated person,outsider,stranger",
    "romaji": "tanin"
  },
  "相手": {
    "en": "companion,partner,company",
    "ta": "companion,partner,company",
    "hi": "companion,partner,company",
    "romaji": "aite"
  },
  "互い": {
    "en": "mutual / each other / one another",
    "ta": "mutual / each other / one another",
    "hi": "mutual / each other / one another",
    "romaji": "tagai"
  },
  "お互い": {
    "en": "mutual,reciprocal,each other",
    "ta": "mutual,reciprocal,each other",
    "hi": "mutual,reciprocal,each other",
    "romaji": "otagai"
  },
  "共に": {
    "en": "sharing with,participate in",
    "ta": "sharing with,participate in",
    "hi": "sharing with,participate in",
    "romaji": "tomoni"
  },
  "政府": {
    "en": "government,administration",
    "ta": "government,administration",
    "hi": "government,administration",
    "romaji": "seifu"
  },
  "政治": {
    "en": "politics",
    "ta": "politics",
    "hi": "politics",
    "romaji": "seiji"
  },
  "治る": {
    "en": "to get better; to recover from illness (v.i.)",
    "ta": "to get better; to recover from illness (v.i.)",
    "hi": "to get better; to recover from illness (v.i.)",
    "romaji": "naoru"
  },
  "国民": {
    "en": "national,people,citizen",
    "ta": "national,people,citizen",
    "hi": "national,people,citizen",
    "romaji": "kokumin"
  },
  "住民": {
    "en": "citizens,inhabitants,residents,population",
    "ta": "citizens,inhabitants,residents,population",
    "hi": "citizens,inhabitants,residents,population",
    "romaji": "juumin"
  },
  "農民": {
    "en": "farmers,peasants",
    "ta": "farmers,peasants",
    "hi": "farmers,peasants",
    "romaji": "noumin"
  },
  "家族": {
    "en": "Family",
    "ta": "Family",
    "hi": "Family",
    "romaji": "kazoku"
  },
  "ご家族": {
    "en": "your family",
    "ta": "your family",
    "hi": "your family",
    "romaji": "gokazoku"
  },
  "歴史": {
    "en": "history",
    "ta": "history",
    "hi": "history",
    "romaji": "rekishi"
  },
  "経歴": {
    "en": "background",
    "ta": "background",
    "hi": "background",
    "romaji": "keireki"
  },
  "際": {
    "en": "on the occasion of,circumstances",
    "ta": "on the occasion of,circumstances",
    "hi": "on the occasion of,circumstances",
    "romaji": "sai"
  },
  "交際": {
    "en": "company,friendship,association,society,acquaintance",
    "ta": "company,friendship,association,society,acquaintance",
    "hi": "company,friendship,association,society,acquaintance",
    "romaji": "kousai"
  },
  "実際": {
    "en": "practical,actual condition,status quo",
    "ta": "practical,actual condition,status quo",
    "hi": "practical,actual condition,status quo",
    "romaji": "jissai"
  },
  "国": {
    "en": "Country",
    "ta": "Country",
    "hi": "Country",
    "romaji": "kuni"
  },
  "国語": {
    "en": "national language",
    "ta": "national language",
    "hi": "national language",
    "romaji": "kokugo"
  },
  "都": {
    "en": "capital",
    "ta": "capital",
    "hi": "capital",
    "romaji": "miyako"
  },
  "都会": {
    "en": "city",
    "ta": "city",
    "hi": "city",
    "romaji": "tokai"
  },
  "県": {
    "en": "prefecture",
    "ta": "prefecture",
    "hi": "prefecture",
    "romaji": "ken"
  },
  "地区": {
    "en": "district,section,sector",
    "ta": "district,section,sector",
    "hi": "district,section,sector",
    "romaji": "chiku"
  },
  "～区": {
    "en": "~ district, ~ ward, ~ borough",
    "ta": "~ district, ~ ward, ~ borough",
    "hi": "~ district, ~ ward, ~ borough",
    "romaji": "ku"
  },
  "市": {
    "en": "city",
    "ta": "city",
    "hi": "city",
    "romaji": "shi"
  },
  "都市": {
    "en": "town,city,municipal,urban",
    "ta": "town,city,municipal,urban",
    "hi": "town,city,municipal,urban",
    "romaji": "toshi"
  },
  "科目": {
    "en": "(school) subject,curriculum,course",
    "ta": "(school) subject,curriculum,course",
    "hi": "(school) subject,curriculum,course",
    "romaji": "kamoku"
  },
  "科学": {
    "en": "science",
    "ta": "science",
    "hi": "science",
    "romaji": "kagaku"
  },
  "教科書": {
    "en": "text book",
    "ta": "text book",
    "hi": "text book",
    "romaji": "kyoukasho"
  },
  "演技": {
    "en": "acting,performance",
    "ta": "acting,performance",
    "hi": "acting,performance",
    "romaji": "engi"
  },
  "技師": {
    "en": "engineer,technician",
    "ta": "engineer,technician",
    "hi": "engineer,technician",
    "romaji": "gishi"
  },
  "競技": {
    "en": "game,match,contest",
    "ta": "game,match,contest",
    "hi": "game,match,contest",
    "romaji": "kyougi"
  },
  "芸術": {
    "en": "(fine) art,the arts",
    "ta": "(fine) art,the arts",
    "hi": "(fine) art,the arts",
    "romaji": "geijutsu"
  },
  "手術": {
    "en": "surgical operation",
    "ta": "surgical operation",
    "hi": "surgical operation",
    "romaji": "shujutsu"
  },
  "技術": {
    "en": "technology / skill",
    "ta": "technology / skill",
    "hi": "technology / skill",
    "romaji": "gijutsu"
  },
  "機": {
    "en": "jet aeroplane",
    "ta": "jet aeroplane",
    "hi": "jet aeroplane",
    "romaji": "ジェトki"
  },
  "機械": {
    "en": "machine,mechanism",
    "ta": "machine,mechanism",
    "hi": "machine,mechanism",
    "romaji": "kikai"
  },
  "器用": {
    "en": "skillful,handy",
    "ta": "skillful,handy",
    "hi": "skillful,handy",
    "romaji": "kiyou"
  },
  "武器": {
    "en": "weapon,arms,ordinance",
    "ta": "weapon,arms,ordinance",
    "hi": "weapon,arms,ordinance",
    "romaji": "buki"
  },
  "炊飯器": {
    "en": "rice cooker",
    "ta": "rice cooker",
    "hi": "rice cooker",
    "romaji": "suihanki"
  },
  "財産": {
    "en": "property,fortune,assets",
    "ta": "property,fortune,assets",
    "hi": "property,fortune,assets",
    "romaji": "zaisan"
  },
  "生産": {
    "en": "production,manufacture",
    "ta": "production,manufacture",
    "hi": "production,manufacture",
    "romaji": "seisan"
  },
  "破産": {
    "en": "(personal) bankruptcy",
    "ta": "(personal) bankruptcy",
    "hi": "(personal) bankruptcy",
    "romaji": "hasan"
  },
  "製造": {
    "en": "manufacture,production",
    "ta": "manufacture,production",
    "hi": "manufacture,production",
    "romaji": "seizou"
  },
  "製品": {
    "en": "manufactured goods,finished goods",
    "ta": "manufactured goods,finished goods",
    "hi": "manufactured goods,finished goods",
    "romaji": "seihin"
  },
  "～製": {
    "en": "made in ~",
    "ta": "made in ~",
    "hi": "made in ~",
    "romaji": "sei"
  },
  "化学": {
    "en": "chemistry",
    "ta": "chemistry",
    "hi": "chemistry",
    "romaji": "kagaku"
  },
  "化粧": {
    "en": "make-up (cosmetic)",
    "ta": "make-up (cosmetic)",
    "hi": "make-up (cosmetic)",
    "romaji": "keshou"
  },
  "質": {
    "en": "quality,nature (of person)",
    "ta": "quality,nature (of person)",
    "hi": "quality,nature (of person)",
    "romaji": "shitsu"
  },
  "物質": {
    "en": "material,substance",
    "ta": "material,substance",
    "hi": "material,substance",
    "romaji": "busshitsu"
  },
  "質問": {
    "en": "Question",
    "ta": "Question",
    "hi": "Question",
    "romaji": "shitsumon"
  },
  "素": {
    "en": "prime",
    "ta": "prime",
    "hi": "prime",
    "romaji": "moto"
  },
  "素直": {
    "en": "honest / obedient / straightforward / docile",
    "ta": "honest / obedient / straightforward / docile",
    "hi": "honest / obedient / straightforward / docile",
    "romaji": "sunao"
  },
  "酸素": {
    "en": "oxygen",
    "ta": "oxygen",
    "hi": "oxygen",
    "romaji": "sanso"
  },
  "熱": {
    "en": "temperature, fever",
    "ta": "temperature, fever",
    "hi": "temperature, fever",
    "romaji": "netsu"
  },
  "熱心": {
    "en": "zeal,enthusiasm",
    "ta": "zeal,enthusiasm",
    "hi": "zeal,enthusiasm",
    "romaji": "nesshin"
  },
  "熱帯": {
    "en": "tropics",
    "ta": "tropics",
    "hi": "tropics",
    "romaji": "nettai"
  },
  "冷淡": {
    "en": "cold / indifferent / cool / apathetic",
    "ta": "cold / indifferent / cool / apathetic",
    "hi": "cold / indifferent / cool / apathetic",
    "romaji": "reitan"
  },
  "冷静": {
    "en": "calm,composure,coolness,serenity",
    "ta": "calm,composure,coolness,serenity",
    "hi": "calm,composure,coolness,serenity",
    "romaji": "reisei"
  },
  "冷房": {
    "en": "cooling, air conditioning",
    "ta": "cooling, air conditioning",
    "hi": "cooling, air conditioning",
    "romaji": "reibou"
  },
  "液体": {
    "en": "liquid / fluid",
    "ta": "திரவம்",
    "hi": "तरल",
    "romaji": "ekitai"
  },
  "血液": {
    "en": "blood",
    "ta": "இரத்தம்",
    "hi": "रक्त",
    "romaji": "ketsueki"
  },
  "油": {
    "en": "oil",
    "ta": "oil",
    "hi": "oil",
    "romaji": "abura"
  },
  "醤油": {
    "en": "soy sauce",
    "ta": "soy sauce",
    "hi": "soy sauce",
    "romaji": "shouyu"
  },
  "言う": {
    "en": "to say",
    "ta": "to say",
    "hi": "to say",
    "romaji": "yuu"
  },
  "言語": {
    "en": "language",
    "ta": "language",
    "hi": "language",
    "romaji": "gengo"
  },
  "一言": {
    "en": "single word",
    "ta": "single word",
    "hi": "single word",
    "romaji": "hitokoto"
  },
  "警告": {
    "en": "warning,advice",
    "ta": "warning,advice",
    "hi": "warning,advice",
    "romaji": "keikoku"
  },
  "報告": {
    "en": "report,information",
    "ta": "report,information",
    "hi": "report,information",
    "romaji": "houkoku"
  },
  "情報": {
    "en": "information,(military) intelligence",
    "ta": "information,(military) intelligence",
    "hi": "information,(military) intelligence",
    "romaji": "jouhou"
  },
  "予報": {
    "en": "forecast,prediction",
    "ta": "forecast,prediction",
    "hi": "forecast,prediction",
    "romaji": "yohou"
  },
  "伝統": {
    "en": "tradition,convention",
    "ta": "tradition,convention",
    "hi": "tradition,convention",
    "romaji": "dentou"
  },
  "手伝い": {
    "en": "help,helper,assistant",
    "ta": "help,helper,assistant",
    "hi": "help,helper,assistant",
    "romaji": "tetsudai"
  },
  "伝える": {
    "en": "to convey / communicate / tell",
    "ta": "to convey / communicate / tell",
    "hi": "to convey / communicate / tell",
    "romaji": "tsutaeru"
  },
  "上達": {
    "en": "improvement,advance,progress",
    "ta": "improvement,advance,progress",
    "hi": "improvement,advance,progress",
    "romaji": "joutatsu"
  },
  "配達": {
    "en": "delivery,distribution",
    "ta": "delivery,distribution",
    "hi": "delivery,distribution",
    "romaji": "haitatsu"
  },
  "発達": {
    "en": "development,growth",
    "ta": "development,growth",
    "hi": "development,growth",
    "romaji": "hattatsu"
  },
  "記憶": {
    "en": "memory / recollection",
    "ta": "memory / recollection",
    "hi": "memory / recollection",
    "romaji": "kioku"
  },
  "意識": {
    "en": "consciousness,senses",
    "ta": "consciousness,senses",
    "hi": "consciousness,senses",
    "romaji": "ishiki"
  },
  "常識": {
    "en": "common sense",
    "ta": "common sense",
    "hi": "common sense",
    "romaji": "joushiki"
  },
  "知識": {
    "en": "knowledge,information",
    "ta": "knowledge,information",
    "hi": "knowledge,information",
    "romaji": "chishiki"
  },
  "承認": {
    "en": "recognition,acknowledgement,approval,consent,agree",
    "ta": "recognition,acknowledgement,approval,consent,agree",
    "hi": "recognition,acknowledgement,approval,consent,agree",
    "romaji": "shounin"
  },
  "認める": {
    "en": "to recognize / acknowledge / admit",
    "ta": "to recognize / acknowledge / admit",
    "hi": "to recognize / acknowledge / admit",
    "romaji": "mitomeru"
  },
  "感情": {
    "en": "emotion / feeling / sentiment",
    "ta": "emotion / feeling / sentiment",
    "hi": "emotion / feeling / sentiment",
    "romaji": "kanjou"
  },
  "感謝": {
    "en": "gratitude / appreciation",
    "ta": "gratitude / appreciation",
    "hi": "gratitude / appreciation",
    "romaji": "kansha"
  },
  "愛情": {
    "en": "love,affection",
    "ta": "love,affection",
    "hi": "love,affection",
    "romaji": "aijou"
  },
  "事情": {
    "en": "circumstances,consideration,conditions,situation,reaso",
    "ta": "circumstances,consideration,conditions,situation,reaso",
    "hi": "circumstances,consideration,conditions,situation,reaso",
    "romaji": "jijou"
  },
  "愛": {
    "en": "love",
    "ta": "love",
    "hi": "love",
    "romaji": "ai"
  },
  "恋愛": {
    "en": "romantic love",
    "ta": "romantic love",
    "hi": "romantic love",
    "romaji": "ren'ai"
  },
  "怒る": {
    "en": "to get angry",
    "ta": "to get angry",
    "hi": "to get angry",
    "romaji": "okoru"
  },
  "悲劇": {
    "en": "tragedy",
    "ta": "tragedy",
    "hi": "tragedy",
    "romaji": "higeki"
  },
  "悲しむ": {
    "en": "to be sad,to mourn for,to regret",
    "ta": "to be sad,to mourn for,to regret",
    "hi": "to be sad,to mourn for,to regret",
    "romaji": "kanashimu"
  },
  "悲しい": {
    "en": "sad, sorrowful",
    "ta": "sad, sorrowful",
    "hi": "sad, sorrowful",
    "romaji": "kanashii"
  },
  "喜ぶ": {
    "en": "to be delighted / pleased",
    "ta": "to be delighted / pleased",
    "hi": "to be delighted / pleased",
    "romaji": "yorokobu"
  },
  "驚く": {
    "en": "to be surprised / astonished",
    "ta": "to be surprised / astonished",
    "hi": "to be surprised / astonished",
    "romaji": "odoroku"
  },
  "恐れ": {
    "en": "fear / concern / risk of",
    "ta": "fear / concern / risk of",
    "hi": "fear / concern / risk of",
    "romaji": "osore"
  },
  "恐怖": {
    "en": "be afraid,dread,dismay,terror",
    "ta": "be afraid,dread,dismay,terror",
    "hi": "be afraid,dread,dismay,terror",
    "romaji": "kyoufu"
  },
  "恐れる": {
    "en": "to fear,to be afraid of",
    "ta": "to fear,to be afraid of",
    "hi": "to fear,to be afraid of",
    "romaji": "osoreru"
  },
  "懸念": {
    "en": "concern / worry / fear / apprehension",
    "ta": "concern / worry / fear / apprehension",
    "hi": "concern / worry / fear / apprehension",
    "romaji": "kenen"
  },
  "概念": {
    "en": "concept / notion / idea",
    "ta": "concept / notion / idea",
    "hi": "concept / notion / idea",
    "romaji": "gainen"
  },
  "記念": {
    "en": "commemoration,memory",
    "ta": "commemoration,memory",
    "hi": "commemoration,memory",
    "romaji": "kinen"
  },
  "食欲": {
    "en": "appetite (for food)",
    "ta": "appetite (for food)",
    "hi": "appetite (for food)",
    "romaji": "shokuyoku"
  },
  "欲しい": {
    "en": "want",
    "ta": "want",
    "hi": "want",
    "romaji": "hoshii"
  },
  "苦労": {
    "en": "troubles,hardships",
    "ta": "troubles,hardships",
    "hi": "troubles,hardships",
    "romaji": "kurou"
  },
  "苦手": {
    "en": "poor (at),weak (in),dislike (of)",
    "ta": "poor (at),weak (in),dislike (of)",
    "hi": "poor (at),weak (in),dislike (of)",
    "romaji": "nigate"
  },
  "楽": {
    "en": "comfort,ease",
    "ta": "comfort,ease",
    "hi": "comfort,ease",
    "romaji": "raku"
  },
  "楽む": {
    "en": "to enjoy",
    "ta": "to enjoy",
    "hi": "to enjoy",
    "romaji": "tanoshimu"
  },
  "音楽": {
    "en": "Music",
    "ta": "Music",
    "hi": "Music",
    "romaji": "ongaku"
  },
  "幸せ": {
    "en": "happiness / happy / fortunate",
    "ta": "happiness / happy / fortunate",
    "hi": "happiness / happy / fortunate",
    "romaji": "shiawase"
  },
  "幸運": {
    "en": "good luck,fortune",
    "ta": "good luck,fortune",
    "hi": "good luck,fortune",
    "romaji": "kouun"
  },
  "幸福": {
    "en": "happiness,blessedness",
    "ta": "happiness,blessedness",
    "hi": "happiness,blessedness",
    "romaji": "koufuku"
  },
  "不": {
    "en": "un,non,negative prefix",
    "ta": "un,non,negative prefix",
    "hi": "un,non,negative prefix",
    "romaji": "fu"
  },
  "不安": {
    "en": "anxiety,uneasiness,insecurity,suspense",
    "ta": "anxiety,uneasiness,insecurity,suspense",
    "hi": "anxiety,uneasiness,insecurity,suspense",
    "romaji": "fuan"
  },
  "不可": {
    "en": "wrong,bad,improper,unjustifiable,inadvisable",
    "ta": "wrong,bad,improper,unjustifiable,inadvisable",
    "hi": "wrong,bad,improper,unjustifiable,inadvisable",
    "romaji": "fuka"
  },
  "収益": {
    "en": "profit / earnings / revenue",
    "ta": "profit / earnings / revenue",
    "hi": "profit / earnings / revenue",
    "romaji": "shuueki"
  },
  "吸収": {
    "en": "absorption,suction,attraction",
    "ta": "absorption,suction,attraction",
    "hi": "absorption,suction,attraction",
    "romaji": "kyuushuu"
  },
  "収穫": {
    "en": "harvest,crop,ingathering",
    "ta": "harvest,crop,ingathering",
    "hi": "harvest,crop,ingathering",
    "romaji": "shuukaku"
  },
  "消費": {
    "en": "consumption,expenditure",
    "ta": "consumption,expenditure",
    "hi": "consumption,expenditure",
    "romaji": "shouhi"
  },
  "費用": {
    "en": "cost,expense",
    "ta": "cost,expense",
    "hi": "cost,expense",
    "romaji": "hiyou"
  },
  "税金": {
    "en": "tax,duty",
    "ta": "tax,duty",
    "hi": "tax,duty",
    "romaji": "zeikin"
  },
  "評価": {
    "en": "evaluation / assessment / valuation / appreciation",
    "ta": "evaluation / assessment / valuation / appreciation",
    "hi": "evaluation / assessment / valuation / appreciation",
    "romaji": "hyouka"
  },
  "価格": {
    "en": "price,value,cost",
    "ta": "price,value,cost",
    "hi": "price,value,cost",
    "romaji": "kakaku"
  },
  "価値": {
    "en": "value,worth,merit",
    "ta": "value,worth,merit",
    "hi": "value,worth,merit",
    "romaji": "kachi"
  },
  "格好": {
    "en": "shape,form,posture,suitability",
    "ta": "shape,form,posture,suitability",
    "hi": "shape,form,posture,suitability",
    "romaji": "kakkou"
  },
  "合格": {
    "en": "success,passing (e.g. exam),eligibility",
    "ta": "success,passing (e.g. exam),eligibility",
    "hi": "success,passing (e.g. exam),eligibility",
    "romaji": "goukaku"
  },
  "額": {
    "en": "forehead,brow",
    "ta": "forehead,brow",
    "hi": "forehead,brow",
    "romaji": "gaku"
  },
  "不利": {
    "en": "disadvantage,handicap,unfavorable,drawback",
    "ta": "disadvantage,handicap,unfavorable,drawback",
    "hi": "disadvantage,handicap,unfavorable,drawback",
    "romaji": "furi"
  },
  "有利": {
    "en": "advantageous,better,profitable,lucrative",
    "ta": "advantageous,better,profitable,lucrative",
    "hi": "advantageous,better,profitable,lucrative",
    "romaji": "yuuri"
  },
  "利益": {
    "en": "profits,gains,(political, economic) interest",
    "ta": "profits,gains,(political, economic) interest",
    "hi": "profits,gains,(political, economic) interest",
    "romaji": "rieki"
  },
  "損": {
    "en": "loss,disadvantage",
    "ta": "loss,disadvantage",
    "hi": "loss,disadvantage",
    "romaji": "son"
  },
  "損害": {
    "en": "damage,injury,loss",
    "ta": "damage,injury,loss",
    "hi": "damage,injury,loss",
    "romaji": "songai"
  },
  "供給": {
    "en": "supply,provision",
    "ta": "supply,provision",
    "hi": "supply,provision",
    "romaji": "kyoukyuu"
  },
  "子供": {
    "en": "Child",
    "ta": "Child",
    "hi": "Child",
    "romaji": "kodomo"
  },
  "参加": {
    "en": "participation",
    "ta": "participation",
    "hi": "participation",
    "romaji": "sanka"
  },
  "参る": {
    "en": "humble expression for 行く and 来る",
    "ta": "humble expression for 行く and 来る",
    "hi": "humble expression for 行く and 来る",
    "romaji": "mairu"
  },
  "掃除": {
    "en": "cleaning,sweeping",
    "ta": "cleaning,sweeping",
    "hi": "cleaning,sweeping",
    "romaji": "souji"
  },
  "除く": {
    "en": "to remove,to exclude,to except",
    "ta": "to remove,to exclude,to except",
    "hi": "to remove,to exclude,to except",
    "romaji": "nozoku"
  },
  "掃除します": {
    "en": "clean (a room)",
    "ta": "clean (a room)",
    "hi": "clean (a room)",
    "romaji": "sōjishimasu"
  },
  "含む": {
    "en": "to hold in the mouth,to bear in mind",
    "ta": "to hold in the mouth,to bear in mind",
    "hi": "to hold in the mouth,to bear in mind",
    "romaji": "fukumu"
  },
  "選手": {
    "en": "(1) player (in game),(2) team",
    "ta": "(1) player (in game),(2) team",
    "hi": "(1) player (in game),(2) team",
    "romaji": "senshu"
  },
  "選択": {
    "en": "selection,choice",
    "ta": "selection,choice",
    "hi": "selection,choice",
    "romaji": "sentaku"
  },
  "選ぶ": {
    "en": "to choose; to select",
    "ta": "to choose; to select",
    "hi": "to choose; to select",
    "romaji": "erabu"
  },
  "比較": {
    "en": "comparison",
    "ta": "comparison",
    "hi": "comparison",
    "romaji": "hikaku"
  },
  "比べる": {
    "en": "to compare",
    "ta": "to compare",
    "hi": "to compare",
    "romaji": "kuraberu"
  },
  "関係": {
    "en": "relationship / connection / association",
    "ta": "relationship / connection / association",
    "hi": "relationship / connection / association",
    "romaji": "kankei"
  },
  "係": {
    "en": "official,duty,person in charge",
    "ta": "official,duty,person in charge",
    "hi": "official,duty,person in charge",
    "romaji": "kakari"
  },
  "係員": {
    "en": "person in charge, organiser",
    "ta": "person in charge, organiser",
    "hi": "person in charge, organiser",
    "romaji": "kakariin"
  },
  "金属": {
    "en": "metal",
    "ta": "metal",
    "hi": "metal",
    "romaji": "kinzoku"
  },
  "対": {
    "en": "pair,couple,set",
    "ta": "pair,couple,set",
    "hi": "pair,couple,set",
    "romaji": "tai"
  },
  "対策": {
    "en": "countermeasure / counter-plan",
    "ta": "countermeasure / counter-plan",
    "hi": "countermeasure / counter-plan",
    "romaji": "taisaku"
  },
  "絶対": {
    "en": "absolute,unconditional,absoluteness",
    "ta": "absolute,unconditional,absoluteness",
    "hi": "absolute,unconditional,absoluteness",
    "romaji": "zettai"
  },
  "本": {
    "en": "book",
    "ta": "book",
    "hi": "book",
    "romaji": "hon"
  },
  "基本": {
    "en": "foundation,basis,standard",
    "ta": "foundation,basis,standard",
    "hi": "foundation,basis,standard",
    "romaji": "kihon"
  },
  "資本": {
    "en": "funds,capital",
    "ta": "funds,capital",
    "hi": "funds,capital",
    "romaji": "shihon"
  },
  "末": {
    "en": "the end of,powder",
    "ta": "the end of,powder",
    "hi": "the end of,powder",
    "romaji": "sue"
  },
  "粗末": {
    "en": "crude,rough,plain,humble",
    "ta": "crude,rough,plain,humble",
    "hi": "crude,rough,plain,humble",
    "romaji": "somatsu"
  },
  "週末": {
    "en": "weekend",
    "ta": "weekend",
    "hi": "weekend",
    "romaji": "shūmatsu"
  },
  "最初": {
    "en": "beginning, first",
    "ta": "beginning, first",
    "hi": "beginning, first",
    "romaji": "saisho"
  },
  "初め": {
    "en": "the beginning",
    "ta": "the beginning",
    "hi": "the beginning",
    "romaji": "hajime"
  },
  "初めに": {
    "en": "first",
    "ta": "first",
    "hi": "first",
    "romaji": "hajimeni"
  },
  "最高": {
    "en": "highest,supreme,the most",
    "ta": "highest,supreme,the most",
    "hi": "highest,supreme,the most",
    "romaji": "saikou"
  },
  "最中": {
    "en": "in the middle of",
    "ta": "in the middle of",
    "hi": "in the middle of",
    "romaji": "saichuu"
  },
  "最低": {
    "en": "least,lowest,worst",
    "ta": "least,lowest,worst",
    "hi": "least,lowest,worst",
    "romaji": "saitei"
  },
  "低い": {
    "en": "short,low",
    "ta": "short,low",
    "hi": "short,low",
    "romaji": "hikui"
  },
  "平ら": {
    "en": "flatness,level,smooth,calm,plain",
    "ta": "flatness,level,smooth,calm,plain",
    "hi": "flatness,level,smooth,calm,plain",
    "romaji": "taira"
  },
  "平等": {
    "en": "equality (a),impartiality,evenness",
    "ta": "equality (a),impartiality,evenness",
    "hi": "equality (a),impartiality,evenness",
    "romaji": "byoudou"
  },
  "平均": {
    "en": "equilibrium,balance,average,mean",
    "ta": "equilibrium,balance,average,mean",
    "hi": "equilibrium,balance,average,mean",
    "romaji": "heikin"
  },
  "平均寿命": {
    "en": "average life span",
    "ta": "average life span",
    "hi": "average life span",
    "romaji": "heikinjumyō"
  },
  "差": {
    "en": "difference,variation",
    "ta": "difference,variation",
    "hi": "difference,variation",
    "romaji": "sa"
  },
  "差す": {
    "en": "to stretch out hands, to raise an",
    "ta": "to stretch out hands, to raise an",
    "hi": "to stretch out hands, to raise an",
    "romaji": "sasu"
  },
  "段": {
    "en": "step,stair,flight of steps,grade,rank,level",
    "ta": "step,stair,flight of steps,grade,rank,level",
    "hi": "step,stair,flight of steps,grade,rank,level",
    "romaji": "dan"
  },
  "手段": {
    "en": "means,way,measure",
    "ta": "means,way,measure",
    "hi": "means,way,measure",
    "romaji": "shudan"
  },
  "値段": {
    "en": "price,cost",
    "ta": "price,cost",
    "hi": "price,cost",
    "romaji": "nedan"
  },
  "階段": {
    "en": "Stairs",
    "ta": "Stairs",
    "hi": "Stairs",
    "romaji": "kaidan"
  },
  "～階": {
    "en": "counter for stories (floors) of a building",
    "ta": "counter for stories (floors) of a building",
    "hi": "counter for stories (floors) of a building",
    "romaji": "kai"
  },
  "－階": {
    "en": "-th floor",
    "ta": "-th floor",
    "hi": "-th floor",
    "romaji": "-kai (-gai)"
  },
  "章": {
    "en": "(1) chapter,section,(2) medal",
    "ta": "(1) chapter,section,(2) medal",
    "hi": "(1) chapter,section,(2) medal",
    "romaji": "shou"
  },
  "文章": {
    "en": "sentence,text",
    "ta": "sentence,text",
    "hi": "sentence,text",
    "romaji": "bunshou"
  },
  "節": {
    "en": "tune,tone,knot,knob,point",
    "ta": "tune,tone,knot,knob,point",
    "hi": "tune,tone,knot,knob,point",
    "romaji": "fushi"
  },
  "節約": {
    "en": "economising,saving",
    "ta": "economising,saving",
    "hi": "economising,saving",
    "romaji": "setsuyaku"
  },
  "季節": {
    "en": "season",
    "ta": "season",
    "hi": "season",
    "romaji": "kisetsu"
  },
  "種類": {
    "en": "variety,kind,type",
    "ta": "variety,kind,type",
    "hi": "variety,kind,type",
    "romaji": "shurui"
  },
  "書類": {
    "en": "documents,official papers",
    "ta": "documents,official papers",
    "hi": "documents,official papers",
    "romaji": "shorui"
  },
  "人類": {
    "en": "mankind,humanity",
    "ta": "mankind,humanity",
    "hi": "mankind,humanity",
    "romaji": "jinrui"
  },
  "種": {
    "en": "(1) seed,(2) material,(3) cause,source",
    "ta": "(1) seed,(2) material,(3) cause,source",
    "hi": "(1) seed,(2) material,(3) cause,source",
    "romaji": "tane"
  },
  "一種": {
    "en": "a species,a kind,a variety",
    "ta": "a species,a kind,a variety",
    "hi": "a species,a kind,a variety",
    "romaji": "isshu"
  },
  "様": {
    "en": "way,manner,kind",
    "ta": "way,manner,kind",
    "hi": "way,manner,kind",
    "romaji": "you"
  },
  "様子": {
    "en": "appearance / state / manner / look",
    "ta": "appearance / state / manner / look",
    "hi": "appearance / state / manner / look",
    "romaji": "yousu"
  },
  "王様": {
    "en": "king",
    "ta": "king",
    "hi": "king",
    "romaji": "ousama"
  },
  "式": {
    "en": "equation,formula,ceremony",
    "ta": "equation,formula,ceremony",
    "hi": "equation,formula,ceremony",
    "romaji": "shiki"
  },
  "正式": {
    "en": "due form,official,formality",
    "ta": "due form,official,formality",
    "hi": "due form,official,formality",
    "romaji": "seishiki"
  },
  "～式": {
    "en": "~ ceremony; ~ style",
    "ta": "~ ceremony; ~ style",
    "hi": "~ ceremony; ~ style",
    "romaji": "shiki"
  },
  "例": {
    "en": "instance,example,case",
    "ta": "instance,example,case",
    "hi": "instance,example,case",
    "romaji": "rei"
  },
  "例えば": {
    "en": "for example, e.g.",
    "ta": "for example, e.g.",
    "hi": "for example, e.g.",
    "romaji": "tatoeba"
  },
  "複雑": {
    "en": "complex / complicated",
    "ta": "complex / complicated",
    "hi": "complex / complicated",
    "romaji": "fukuzatsu"
  },
  "複雑［な］": {
    "en": "complicated, complex",
    "ta": "complicated, complex",
    "hi": "complicated, complex",
    "romaji": "fukuzatsu [na]"
  },
  "単語": {
    "en": "word,vocabulary,(usually) single-character word",
    "ta": "word,vocabulary,(usually) single-character word",
    "hi": "word,vocabulary,(usually) single-character word",
    "romaji": "tango"
  },
  "単純": {
    "en": "simplicity",
    "ta": "simplicity",
    "hi": "simplicity",
    "romaji": "tanjun"
  },
  "程": {
    "en": "degree,extent,bounds,limit",
    "ta": "degree,extent,bounds,limit",
    "hi": "degree,extent,bounds,limit",
    "romaji": "hodo"
  },
  "程度": {
    "en": "degree,amount,grade,standard,of the order of",
    "ta": "degree,amount,grade,standard,of the order of",
    "hi": "degree,amount,grade,standard,of the order of",
    "romaji": "teido"
  },
  "限る": {
    "en": "to restrict,to limit,to confine",
    "ta": "to restrict,to limit,to confine",
    "hi": "to restrict,to limit,to confine",
    "romaji": "kagiru"
  },
  "限界": {
    "en": "limit,bound",
    "ta": "limit,bound",
    "hi": "limit,bound",
    "romaji": "genkai"
  },
  "制限": {
    "en": "restriction,restraint,limitation",
    "ta": "restriction,restraint,limitation",
    "hi": "restriction,restraint,limitation",
    "romaji": "seigen"
  },
  "境": {
    "en": "border,boundary,mental state",
    "ta": "border,boundary,mental state",
    "hi": "border,boundary,mental state",
    "romaji": "sakai"
  },
  "環境": {
    "en": "environment / surroundings",
    "ta": "environment / surroundings",
    "hi": "environment / surroundings",
    "romaji": "kankyou"
  },
  "国境": {
    "en": "national or state border",
    "ta": "national or state border",
    "hi": "national or state border",
    "romaji": "kokkyou"
  },
  "状況": {
    "en": "situation / circumstances / state of affairs",
    "ta": "situation / circumstances / state of affairs",
    "hi": "situation / circumstances / state of affairs",
    "romaji": "joukyou"
  },
  "症状": {
    "en": "symptoms,condition",
    "ta": "symptoms,condition",
    "hi": "symptoms,condition",
    "romaji": "shoujou"
  },
  "事態": {
    "en": "situation,present state of affairs",
    "ta": "situation,present state of affairs",
    "hi": "situation,present state of affairs",
    "romaji": "jitai"
  },
  "状態": {
    "en": "condition,situation,circumstances,state",
    "ta": "condition,situation,circumstances,state",
    "hi": "condition,situation,circumstances,state",
    "romaji": "joutai"
  },
  "事件": {
    "en": "event,affair,incident",
    "ta": "event,affair,incident",
    "hi": "event,affair,incident",
    "romaji": "jiken"
  },
  "条件": {
    "en": "conditions,terms",
    "ta": "conditions,terms",
    "hi": "conditions,terms",
    "romaji": "jouken"
  },
  "案": {
    "en": "plan,suffix meaning draft",
    "ta": "plan,suffix meaning draft",
    "hi": "plan,suffix meaning draft",
    "romaji": "an"
  },
  "案内": {
    "en": "information,guidance,leading",
    "ta": "information,guidance,leading",
    "hi": "information,guidance,leading",
    "romaji": "annai"
  },
  "提案": {
    "en": "proposal,proposition,suggestion",
    "ta": "proposal,proposition,suggestion",
    "hi": "proposal,proposition,suggestion",
    "romaji": "teian"
  },
  "観察": {
    "en": "observation,survey",
    "ta": "observation,survey",
    "hi": "observation,survey",
    "romaji": "kansatsu"
  },
  "診察": {
    "en": "medical examination",
    "ta": "medical examination",
    "hi": "medical examination",
    "romaji": "shinsatsu"
  },
  "警察": {
    "en": "police; police station",
    "ta": "police; police station",
    "hi": "police; police station",
    "romaji": "keisatsu"
  },
  "検査": {
    "en": "inspection (e.g. customs, factory),examination",
    "ta": "inspection (e.g. customs, factory),examination",
    "hi": "inspection (e.g. customs, factory),examination",
    "romaji": "kensa"
  },
  "調査": {
    "en": "investigation,examination,inquiry,survey",
    "ta": "investigation,examination,inquiry,survey",
    "hi": "investigation,examination,inquiry,survey",
    "romaji": "chousa"
  },
  "市場調査": {
    "en": "market survey, market research",
    "ta": "market survey, market research",
    "hi": "market survey, market research",
    "romaji": "shijōchōsa"
  },
  "順調": {
    "en": "favourable,doing well,O.K.,all right",
    "ta": "favourable,doing well,O.K.,all right",
    "hi": "favourable,doing well,O.K.,all right",
    "romaji": "junchou"
  },
  "批評": {
    "en": "criticism,review,commentary",
    "ta": "criticism,review,commentary",
    "hi": "criticism,review,commentary",
    "romaji": "hihyou"
  },
  "評判": {
    "en": "fame,reputation,popularity,arrant",
    "ta": "fame,reputation,popularity,arrant",
    "hi": "fame,reputation,popularity,arrant",
    "romaji": "hyouban"
  },
  "批判": {
    "en": "criticism,judgement,comment",
    "ta": "criticism,judgement,comment",
    "hi": "criticism,judgement,comment",
    "romaji": "hihan"
  },
  "片仮名": {
    "en": "katakana",
    "ta": "katakana",
    "hi": "katakana",
    "romaji": "katakana"
  },
  "平仮名": {
    "en": "hiragana",
    "ta": "hiragana",
    "hi": "hiragana",
    "romaji": "hiragana"
  },
  "実": {
    "en": "fruit,nut,seed,content,good result",
    "ta": "fruit,nut,seed,content,good result",
    "hi": "fruit,nut,seed,content,good result",
    "romaji": "mi"
  },
  "現実": {
    "en": "reality",
    "ta": "reality",
    "hi": "reality",
    "romaji": "genjitsu"
  },
  "保証": {
    "en": "guarantee,security,assurance,pledge,warranty",
    "ta": "guarantee,security,assurance,pledge,warranty",
    "hi": "guarantee,security,assurance,pledge,warranty",
    "romaji": "hoshou"
  },
  "保証書": {
    "en": "guarantee",
    "ta": "guarantee",
    "hi": "guarantee",
    "romaji": "hoshōsho"
  },
  "演説": {
    "en": "speech,address",
    "ta": "speech,address",
    "hi": "speech,address",
    "romaji": "enzetsu"
  },
  "演奏": {
    "en": "musical performance",
    "ta": "musical performance",
    "hi": "musical performance",
    "romaji": "ensou"
  },
  "劇": {
    "en": "drama,play",
    "ta": "drama,play",
    "hi": "drama,play",
    "romaji": "geki"
  },
  "劇場": {
    "en": "theatre,playhouse",
    "ta": "theatre,playhouse",
    "hi": "theatre,playhouse",
    "romaji": "gekijou"
  },
  "映画": {
    "en": "movie",
    "ta": "movie",
    "hi": "movie",
    "romaji": "eiga"
  },
  "映画館": {
    "en": "cinema",
    "ta": "cinema",
    "hi": "cinema",
    "romaji": "eigakan"
  },
  "絵画": {
    "en": "picture",
    "ta": "picture",
    "hi": "picture",
    "romaji": "kaiga"
  },
  "画家": {
    "en": "painter,artist",
    "ta": "painter,artist",
    "hi": "painter,artist",
    "romaji": "gaka"
  },
  "写す": {
    "en": "to copy (v.t.); to photograph",
    "ta": "to copy (v.t.); to photograph",
    "hi": "to copy (v.t.); to photograph",
    "romaji": "utsusu"
  },
  "写真": {
    "en": "photograph",
    "ta": "photograph",
    "hi": "photograph",
    "romaji": "shashin"
  },
  "真剣": {
    "en": "seriousness,earnestness",
    "ta": "seriousness,earnestness",
    "hi": "seriousness,earnestness",
    "romaji": "shinken"
  },
  "真似": {
    "en": "mimicry,imitation,behavior,pretense",
    "ta": "mimicry,imitation,behavior,pretense",
    "hi": "mimicry,imitation,behavior,pretense",
    "romaji": "mane"
  },
  "真中": {
    "en": "middle, center",
    "ta": "middle, center",
    "hi": "middle, center",
    "romaji": "mannaka"
  },
  "原": {
    "en": "field,plain,prairie,tundra,moor,wilderness",
    "ta": "field,plain,prairie,tundra,moor,wilderness",
    "hi": "field,plain,prairie,tundra,moor,wilderness",
    "romaji": "hara"
  },
  "原因": {
    "en": "cause / origin / source",
    "ta": "cause / origin / source",
    "hi": "cause / origin / source",
    "romaji": "genin"
  },
  "原料": {
    "en": "raw material",
    "ta": "raw material",
    "hi": "raw material",
    "romaji": "genryō"
  },
  "効率": {
    "en": "efficiency / productivity",
    "ta": "efficiency / productivity",
    "hi": "efficiency / productivity",
    "romaji": "kouritsu"
  },
  "効く": {
    "en": "to be effective",
    "ta": "to be effective",
    "hi": "to be effective",
    "romaji": "kiku"
  },
  "能": {
    "en": "being skilled in,nicely,properly",
    "ta": "being skilled in,nicely,properly",
    "hi": "being skilled in,nicely,properly",
    "romaji": "nou"
  },
  "能力": {
    "en": "ability / capability / skill",
    "ta": "ability / capability / skill",
    "hi": "ability / capability / skill",
    "romaji": "nouryoku"
  },
  "可能": {
    "en": "possible,practicable,feasible",
    "ta": "possible,practicable,feasible",
    "hi": "possible,practicable,feasible",
    "romaji": "kanou"
  },
  "可": {
    "en": "passable",
    "ta": "passable",
    "hi": "passable",
    "romaji": "ka"
  },
  "否": {
    "en": "no,the noes",
    "ta": "no,the noes",
    "hi": "no,the noes",
    "romaji": "iya"
  },
  "否定": {
    "en": "negation,denial,repudiation",
    "ta": "negation,denial,repudiation",
    "hi": "negation,denial,repudiation",
    "romaji": "hitei"
  },
  "存在": {
    "en": "existence,being",
    "ta": "existence,being",
    "hi": "existence,being",
    "romaji": "sonzai"
  },
  "保存": {
    "en": "preservation,conservation,storage,maintenance",
    "ta": "preservation,conservation,storage,maintenance",
    "hi": "preservation,conservation,storage,maintenance",
    "romaji": "hozon"
  },
  "ご存じ": {
    "en": "knowing, acquaintance",
    "ta": "knowing, acquaintance",
    "hi": "knowing, acquaintance",
    "romaji": "gozonji"
  },
  "現在": {
    "en": "present,up to now,nowadays,modern times,current",
    "ta": "present,up to now,nowadays,modern times,current",
    "hi": "present,up to now,nowadays,modern times,current",
    "romaji": "genzai"
  },
  "滞在": {
    "en": "stay,sojourn",
    "ta": "stay,sojourn",
    "hi": "stay,sojourn",
    "romaji": "taizai"
  },
  "有る": {
    "en": "to be,to have",
    "ta": "to be,to have",
    "hi": "to be,to have",
    "romaji": "aru"
  },
  "有効": {
    "en": "validity,availability,effectiveness",
    "ta": "validity,availability,effectiveness",
    "hi": "validity,availability,effectiveness",
    "romaji": "yuukou"
  },
  "有能": {
    "en": "able,capable,efficient,skill",
    "ta": "able,capable,efficient,skill",
    "hi": "able,capable,efficient,skill",
    "romaji": "yuunou"
  },
  "無": {
    "en": "nothing,naught,nil,zero",
    "ta": "nothing,naught,nil,zero",
    "hi": "nothing,naught,nil,zero",
    "romaji": "bu"
  },
  "無し": {
    "en": "without",
    "ta": "without",
    "hi": "without",
    "romaji": "nashi"
  },
  "無事": {
    "en": "safety,peace,quietness",
    "ta": "safety,peace,quietness",
    "hi": "safety,peace,quietness",
    "romaji": "buji"
  },
  "完成": {
    "en": "(1) complete,completion,(2) perfection,accomplishment",
    "ta": "(1) complete,completion,(2) perfection,accomplishment",
    "hi": "(1) complete,completion,(2) perfection,accomplishment",
    "romaji": "kansei"
  },
  "完了": {
    "en": "completion,conclusion",
    "ta": "completion,conclusion",
    "hi": "completion,conclusion",
    "romaji": "kanryou"
  },
  "醸成": {
    "en": "foster / cultivate / brew (an atmosphere)",
    "ta": "foster / cultivate / brew (an atmosphere)",
    "hi": "foster / cultivate / brew (an atmosphere)",
    "romaji": "jousei"
  },
  "成功": {
    "en": "success",
    "ta": "success",
    "hi": "success",
    "romaji": "seikou"
  },
  "育つ": {
    "en": "to raise (child),to be brought up,to grow (up)",
    "ta": "to raise (child),to be brought up,to grow (up)",
    "hi": "to raise (child),to be brought up,to grow (up)",
    "romaji": "sodatsu"
  },
  "体育": {
    "en": "physical education,gymnastics,athletics",
    "ta": "physical education,gymnastics,athletics",
    "hi": "physical education,gymnastics,athletics",
    "romaji": "taiiku"
  },
  "教育": {
    "en": "education",
    "ta": "education",
    "hi": "education",
    "romaji": "kyouiku"
  },
  "老い": {
    "en": "old age,old person,the old,the aged",
    "ta": "old age,old person,the old,the aged",
    "hi": "old age,old person,the old,the aged",
    "romaji": "oi"
  },
  "老人": {
    "en": "the aged,old person",
    "ta": "the aged,old person",
    "hi": "the aged,old person",
    "romaji": "roujin"
  },
  "若い": {
    "en": "young",
    "ta": "young",
    "hi": "young",
    "romaji": "wakai"
  },
  "頑健": {
    "en": "robust / sturdy / hardy / vigorous",
    "ta": "robust / sturdy / hardy / vigorous",
    "hi": "robust / sturdy / hardy / vigorous",
    "romaji": "ganken"
  },
  "健康": {
    "en": "health,sound,wholesome",
    "ta": "health,sound,wholesome",
    "hi": "health,sound,wholesome",
    "romaji": "kenkou"
  },
  "大江健三郎": {
    "en": "Japanese novelist (1935- )",
    "ta": "Japanese novelist (1935- )",
    "hi": "Japanese novelist (1935- )",
    "romaji": "ōe kenzaburō"
  },
  "安全": {
    "en": "safe / safety",
    "ta": "safe / safety",
    "hi": "safe / safety",
    "romaji": "anzen"
  },
  "危険": {
    "en": "danger / dangerous",
    "ta": "danger / dangerous",
    "hi": "danger / dangerous",
    "romaji": "kiken"
  },
  "危篤": {
    "en": "in a critical condition",
    "ta": "in a critical condition",
    "hi": "in a critical condition",
    "romaji": "kitoku"
  },
  "危ない": {
    "en": "dangerous",
    "ta": "dangerous",
    "hi": "dangerous",
    "romaji": "abunai"
  },
  "難しい": {
    "en": "difficult / hard",
    "ta": "கடினமான",
    "hi": "मुश्किल",
    "romaji": "muzukashii"
  },
  "容易": {
    "en": "easy,simple,plain",
    "ta": "easy,simple,plain",
    "hi": "easy,simple,plain",
    "romaji": "youi"
  },
  "貿易": {
    "en": "trade",
    "ta": "trade",
    "hi": "trade",
    "romaji": "boueki"
  },
  "易しい": {
    "en": "easy / gentle",
    "ta": "எளிதான/கனிவான",
    "hi": "आसान/सौम्य",
    "romaji": "yasashii"
  },
  "静か": {
    "en": "Quiet",
    "ta": "Quiet",
    "hi": "Quiet",
    "romaji": "shizuka"
  },
  "静か［な］": {
    "en": "quiet",
    "ta": "quiet",
    "hi": "quiet",
    "romaji": "shizuka [na]"
  },
  "運動": {
    "en": "motion,exercise",
    "ta": "motion,exercise",
    "hi": "motion,exercise",
    "romaji": "undou"
  },
  "活動": {
    "en": "action,activity",
    "ta": "action,activity",
    "hi": "action,activity",
    "romaji": "katsudou"
  },
  "活気": {
    "en": "energy,liveliness",
    "ta": "energy,liveliness",
    "hi": "energy,liveliness",
    "romaji": "kakki"
  },
  "協議": {
    "en": "consultation / deliberation",
    "ta": "consultation / deliberation",
    "hi": "consultation / deliberation",
    "romaji": "kyougi"
  },
  "議会": {
    "en": "Diet,congress,parliament",
    "ta": "Diet,congress,parliament",
    "hi": "Diet,congress,parliament",
    "romaji": "gikai"
  },
  "内": {
    "en": "inside",
    "ta": "inside",
    "hi": "inside",
    "romaji": "uchi"
  },
  "内容": {
    "en": "subject,contents,matter,substance,detail,import",
    "ta": "subject,contents,matter,substance,detail,import",
    "hi": "subject,contents,matter,substance,detail,import",
    "romaji": "naiyou"
  },
  "米": {
    "en": "uncooked rice",
    "ta": "uncooked rice",
    "hi": "uncooked rice",
    "romaji": "kome"
  },
  "経済": {
    "en": "economy / economics",
    "ta": "economy / economics",
    "hi": "economy / economics",
    "romaji": "keizai"
  },
  "経営": {
    "en": "management,administration",
    "ta": "management,administration",
    "hi": "management,administration",
    "romaji": "keiei"
  },
  "見当": {
    "en": "be found,aim,estimate,guess,approx",
    "ta": "be found,aim,estimate,guess,approx",
    "hi": "be found,aim,estimate,guess,approx",
    "romaji": "kentou"
  },
  "相当": {
    "en": "suitable,fair,tolerable,proper",
    "ta": "suitable,fair,tolerable,proper",
    "hi": "suitable,fair,tolerable,proper",
    "romaji": "soutou"
  },
  "担当": {
    "en": "(in) charge",
    "ta": "(in) charge",
    "hi": "(in) charge",
    "romaji": "tantou"
  },
  "性": {
    "en": "sex,gender",
    "ta": "sex,gender",
    "hi": "sex,gender",
    "romaji": "sei"
  },
  "性格": {
    "en": "character,personality",
    "ta": "character,personality",
    "hi": "character,personality",
    "romaji": "seikaku"
  },
  "男性": {
    "en": "man; male",
    "ta": "man; male",
    "hi": "man; male",
    "romaji": "dansei"
  },
  "目的": {
    "en": "purpose / objective / goal",
    "ta": "purpose / objective / goal",
    "hi": "purpose / objective / goal",
    "romaji": "mokuteki"
  },
  "積極的": {
    "en": "positive,active,proactive",
    "ta": "positive,active,proactive",
    "hi": "positive,active,proactive",
    "romaji": "sekkyokuteki"
  },
  "世界的に": {
    "en": "world-wide",
    "ta": "world-wide",
    "hi": "world-wide",
    "romaji": "sekaitekini"
  },
  "重要": {
    "en": "important,momentous,essential,principal,major",
    "ta": "important,momentous,essential,principal,major",
    "hi": "important,momentous,essential,principal,major",
    "romaji": "juuyou"
  },
  "主要": {
    "en": "chief,main,principal,major",
    "ta": "chief,main,principal,major",
    "hi": "chief,main,principal,major",
    "romaji": "shuyou"
  },
  "需要": {
    "en": "demand,request",
    "ta": "demand,request",
    "hi": "demand,request",
    "romaji": "juyou"
  },
  "制度": {
    "en": "system,institution,organization",
    "ta": "system,institution,organization",
    "hi": "system,institution,organization",
    "romaji": "seido"
  },
  "延期": {
    "en": "postponement,adjournment",
    "ta": "postponement,adjournment",
    "hi": "postponement,adjournment",
    "romaji": "enki"
  },
  "学期": {
    "en": "term (school)",
    "ta": "term (school)",
    "hi": "term (school)",
    "romaji": "gakki"
  },
  "期間": {
    "en": "period,term",
    "ta": "period,term",
    "hi": "period,term",
    "romaji": "kikan"
  },
  "平和": {
    "en": "peace,harmony",
    "ta": "peace,harmony",
    "hi": "peace,harmony",
    "romaji": "heiwa"
  },
  "和食": {
    "en": "Japanese dish",
    "ta": "Japanese dish",
    "hi": "Japanese dish",
    "romaji": "washoku"
  },
  "指": {
    "en": "finger",
    "ta": "finger",
    "hi": "finger",
    "romaji": "yubi"
  },
  "指す": {
    "en": "to point,to put up umbrella,to play",
    "ta": "to point,to put up umbrella,to play",
    "hi": "to point,to put up umbrella,to play",
    "romaji": "sasu"
  },
  "指導": {
    "en": "leadership,guidance,coaching",
    "ta": "leadership,guidance,coaching",
    "hi": "leadership,guidance,coaching",
    "romaji": "shidou"
  },
  "済む": {
    "en": "to finish, to end",
    "ta": "to finish, to end",
    "hi": "to finish, to end",
    "romaji": "sumu"
  },
  "済ませる": {
    "en": "to be finished",
    "ta": "to be finished",
    "hi": "to be finished",
    "romaji": "sumaseru"
  },
  "解釈": {
    "en": "explanation,interpretation",
    "ta": "explanation,interpretation",
    "hi": "explanation,interpretation",
    "romaji": "kaishaku"
  },
  "見解": {
    "en": "opinion,point of view",
    "ta": "opinion,point of view",
    "hi": "opinion,point of view",
    "romaji": "kenkai"
  },
  "外交": {
    "en": "diplomacy",
    "ta": "diplomacy",
    "hi": "diplomacy",
    "romaji": "gaikou"
  },
  "交換": {
    "en": "exchange,interchange,reciprocity",
    "ta": "exchange,interchange,reciprocity",
    "hi": "exchange,interchange,reciprocity",
    "romaji": "koukan"
  },
  "資源": {
    "en": "resources",
    "ta": "resources",
    "hi": "resources",
    "romaji": "shigen"
  },
  "資料": {
    "en": "materials, data",
    "ta": "materials, data",
    "hi": "materials, data",
    "romaji": "shiryō"
  },
  "予期": {
    "en": "expectation,assume will happen,forecast",
    "ta": "expectation,assume will happen,forecast",
    "hi": "expectation,assume will happen,forecast",
    "romaji": "yoki"
  },
  "予算": {
    "en": "estimate,budget",
    "ta": "estimate,budget",
    "hi": "estimate,budget",
    "romaji": "yosan"
  },
  "予測": {
    "en": "prediction,estimation",
    "ta": "prediction,estimation",
    "hi": "prediction,estimation",
    "romaji": "yosoku"
  },
  "面": {
    "en": "face,mug,surface,facial features,mask,face guard,side",
    "ta": "face,mug,surface,facial features,mask,face guard,side",
    "hi": "face,mug,surface,facial features,mask,face guard,side",
    "romaji": "men"
  },
  "場面": {
    "en": "scene,setting (e.g. of novel)",
    "ta": "scene,setting (e.g. of novel)",
    "hi": "scene,setting (e.g. of novel)",
    "romaji": "bamen"
  },
  "表面": {
    "en": "surface,outside,face,appearance",
    "ta": "surface,outside,face,appearance",
    "hi": "surface,outside,face,appearance",
    "romaji": "hyoumen"
  },
  "投票": {
    "en": "voting,poll",
    "ta": "voting,poll",
    "hi": "voting,poll",
    "romaji": "touhyou"
  },
  "投げる": {
    "en": "to pitch, to cast away",
    "ta": "to pitch, to cast away",
    "hi": "to pitch, to cast away",
    "romaji": "nageru"
  },
  "投げます": {
    "en": "throw",
    "ta": "throw",
    "hi": "throw",
    "romaji": "nagemasu"
  },
  "打つ": {
    "en": "to hit,to strike",
    "ta": "to hit,to strike",
    "hi": "to hit,to strike",
    "romaji": "butsu"
  },
  "直": {
    "en": "earnestly,immediately,exactly",
    "ta": "earnestly,immediately,exactly",
    "hi": "earnestly,immediately,exactly",
    "romaji": "jiki"
  },
  "直に": {
    "en": "immediately,readily,directly",
    "ta": "immediately,readily,directly",
    "hi": "immediately,readily,directly",
    "romaji": "jikani"
  }
};
