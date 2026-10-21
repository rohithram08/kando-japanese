# scripts/generators/n4_generator.py
# Generates 50 complete N4 stories (retaining existing 2 and creating stories 3-50)

import json
import os
from common import make_story, to_furigana

N4_TEMPLATES = [
    # 3: Valentine's Chocolates
    ("バレンタインの贈り物", "バレンタインの 贈[おく]り 物[もの]", "Valentine's Day Gifts",
     "Ken receives handmade chocolate from a language exchange partner and learns about Giri and Honmei chocolates.",
     "贈り物", "おくりもの", "gift / present", "〜てあげる", "doing a favor for another", "喜ぶ", "よろこぶ", "to be pleased", "贈", "send gift"),
    # 4: Snowboarding in Nagano
    ("長野のスノーボード", "長野[ながの]の スノーボード", "Snowboarding in Nagano",
     "Ken tries snowboarding on powder snow in Shiga Kogen and stays at an alpine lodge.",
     "滑る", "すべる", "to slide / glide / ski", "〜たら", "conditional if/when", "転ぶ", "ころぶ", "to fall over", "雪", "snow"),
    # 5: Lost Wallet at Police Box
    ("交番での落とし物", "交番[こうばん]での 落[お]とし 物[もの]", "Lost Wallet at the Police Box",
     "A relieved foreign student finds his dropped wallet intact with all money at the local Koban.",
     "交番", "こうばん", "police box", "〜てしまう", "regret / accidental completion", "届ける", "とどける", "to deliver / report", "拾", "pick up"),
    # 6: Neighborhood Chat
    ("商店街の噂話", "商店街[しょうてんがい]の 噂話[うわさばなし]", "Rumors in the Shopping Arcade",
     "Locals discuss the opening of a popular new bakery with hearsay and evidential grammar.",
     "噂", "うわさ", "rumor / gossip", "〜そうだ", "hearsay / it is said that", "聞く", "きく", "to hear", "伝", "transmit"),
    # 7: Convenience Store Night Shift
    ("深夜のアルバイト", "深夜[しんや]の アルバイト", "The Late Night Shift",
     "Working the night register, stocking shelves, and practicing simultaneous action grammar.",
     "品出し", "しなだし", "stocking shelves", "〜ながら", "simultaneous action (while doing)", "働く", "はたらく", "to work", "夜", "night"),
    # 8: Meeting with Store Manager
    ("店長への報告", "店長[てんちょう]への 報告[ほうこく]", "Reporting to the Store Manager",
     "Practicing polite humble and respectful speech forms when speaking with the shop owner.",
     "店長", "てんちょう", "store manager", "〜でございます", "polite copula", "伺う", "うかがう", "to ask / visit (humble)", "長", "head / long"),
    # 9: Flea Market Bargaining
    ("蚤の市での値引き", "蚤の市[のみのいち]での 値引[ねび]き", "Bargaining at the Flea Market",
     "Negotiating kindly for an antique tea cup at a Sunday outdoor shrine market.",
     "骨董品", "こっとうひん", "antique", "〜ば", "conditional if (provisional)", "負ける", "まける", "to reduce price", "市", "market"),
    # 10: Flat Bicycle Tire
    ("自転車の修理", "自転車[じてんしゃ]の 修理[しゅうり]", "Repairing a Punctured Bicycle Tire",
     "A kind neighborhood bike mechanic patches a punctured tube and refuses extra charge.",
     "修理", "しゅうり", "repair", "〜てくれる", "someone does me a favor", "直す", "なおす", "to fix", "直", "fix / direct"),
    # 11: Cultural Festival Signs
    ("文化祭の準備", "文化祭[ぶんかさい]の 準備[じゅんび]", "Preparations for the Cultural Festival",
     "Painting colorful banners and cooking yakisoba in preparation for university open day.",
     "準備", "じゅんび", "preparation", "〜ておく", "preparatory action", "塗る", "ぬる", "to paint", "祭", "festival"),
    # 12: Graduation and New Journey
    ("卒業と新しい門出", "卒業[そつぎょう]と 新[あたら]しい 門出[かどで]", "Graduation and New Beginnings",
     "Upperclassmen dress in formal hakama and celebrate stepping into Japanese companies.",
     "卒業", "そつぎょう", "graduation", "〜つもりだ", "intention / planning to", "進む", "すすむ", "to advance", "業", "business / study"),
    # 13: Takoyaki Party
    ("友達とたこ焼き作り", "友達[ともだち]と たこ焼[や]き 作[づく]り", "Making Takoyaki with Friends",
     "Turning crispy octopus balls with wooden picks while laughing around a hot iron griddle.",
     "作り方", "つくりかた", "method of making", "〜すぎる", "excessive action / too much", "回す", "まわす", "to turn", "方", "method"),
    # 14: Missed Last Train
    ("終電を逃した夜", "終電[しゅうでん]を 逃[のが]した 夜[よる]", "The Night We Missed the Last Train",
     "Experiencing the suffering passive voice when unexpected heavy rain halts the final subway.",
     "終電", "しゅうでん", "last train", "〜受身（られる）", "suffering passive voice", "困る", "こまる", "to be troubled", "終", "end"),
    # 15: Slime Bakery Apprentice
    ("スライムのパン修業", "スライムの パン 修業[しゅぎょう]", "Slime's Bakery Apprenticeship",
     "The baker makes the eager slime knead sweet dough and watch the oven timer.",
     "使役", "しえき", "causative (making/letting do)", "〜させる", "causative verb form", "捏ねる", "こねる", "to knead", "作", "make"),
    # 16: Medical Consultation
    ("病院での診察", "病院[びょういん]での 診察[しんさつ]", "A Doctor's Medical Checkup",
     "Explaining allergy symptoms clearly and receiving instructions on taking tablets after meals.",
     "処方箋", "しょほうせん", "prescription", "〜ように言われる", "instructed to do", "診る", "みる", "to examine", "病", "illness"),
    # 17: Apartment Hunting in Koenji
    ("高円寺での部屋探し", "高円寺[こうえんじ]での 部屋探[へやさが]し", "Apartment Hunting in Koenji",
     "Comparing distance to the station, rent costs, and south-facing sunlight balconies.",
     "家賃", "やちん", "monthly rent", "〜かどうか", "whether or not", "探す", "さがす", "to search", "住", "live / dwell"),
    # 18: Secret Ramen Broth
    ("秘伝のラーメン出汁", "秘伝[ひでん]の ラーメン 出汁[だし]", "The Secret Ramen Broth",
     "A third-generation master simmers pork bones and dried bonito for 18 hours.",
     "出汁", "だし", "soup stock / broth", "〜やすい", "easy to do", "煮込む", "にこむ", "to simmer", "深", "deep"),
    # 19: Photography Contest
    ("写真部のコンテスト", "写真部[しゃしんぶ]の コンテスト", "The Photography Club Contest",
     "Snapping quiet street life in Yanaka Ginza and winning an honorable mention.",
     "撮影", "さつえい", "photography / shooting", "〜始める", "to begin doing", "写す", "うつす", "to photograph", "真", "true / truth"),
    # 20: Pottery Workshop
    ("京都の陶芸体験", "京都[きょうと]の 陶芸[とうげい] 体験[たいけん]", "Kyoto Pottery Workshop",
     "Shaping clay smoothly on a spinning kick-wheel to craft a custom matcha bowl.",
     "陶芸", "とうげい", "ceramic art / pottery", "〜てある", "state of preparation", "焼く", "やく", "to bake / fire kiln", "器", "vessel"),
    # 21: Typhoon Day
    ("台風の日の室内", "台風[たいふう]の 日[ひ]の 室内[しつない]", "Indoors on a Typhoon Day",
     "Rain lashes against closed storm shutters while friends play board games and sip tea.",
     "台風", "たいふう", "typhoon", "〜かもしれない", "might / possibility", "防ぐ", "ふせぐ", "to prevent / defend", "風", "wind"),
    # 22: Board Game Showdown
    ("ボードゲームの対決", "ボードゲームの 対決[たいけつ]", "The Board Game Showdown",
     "Laughing as the loser is playfully made to clean the dining table and wash teacups.",
     "勝負", "しょうぶ", "match / contest", "〜させられる", "causative passive", "負ける", "まける", "to lose", "勝", "win"),
    # 23: Slime River Rescue
    ("川辺での子犬救助", "川辺[かわべ]での 子犬[こいぬ] 救助[きゅうじょ]", "Puppy Rescue by the River",
     "The elastic slime cushions a slipped puppy from the embankment, earning neighborhood applause.",
     "救助", "きゅうじょ", "rescue / relief", "〜ようとする", "attempt to do", "助ける", "たすける", "to rescue", "助", "help"),
    # 24: Riverbank Volunteer
    ("荒川の清掃活動", "荒川[あらかわ]の 清掃[せいそう] 活動[かつどう]", "Volunteer Cleanup at Arakawa",
     "Volunteers bag river plastics to preserve migratory bird wetlands and riverside flora.",
     "清掃", "せいそう", "cleaning / sanitation", "〜ために", "in order to / for the sake of", "集める", "あつめる", "to collect", "活", "active"),
    # 25: Hiroshima Homestay
    ("広島での民泊体験", "広島[ひろしま]での 民泊[みんぱく] 体験[たいけん]", "Homestay in Hiroshima",
     "Enjoying layered Hiroshima okonomiyaki and hearing kind stories from local hosts.",
     "民泊", "みんぱく", "homestay / guesthouse", "〜たばかり", "just recently finished", "泊まる", "とまる", "to stay overnight", "広", "wide"),
    # 26: Kansai Dialect Fun
    ("関西弁の魅力", "関西弁[かんさいべん]の 魅力[みりょく]", "The Warmth of Kansai Dialect",
     "Ken learns friendly Osaka phrases like 'Ookini' and understands their nuanced warmth.",
     "方言", "ほうげん", "regional dialect", "〜ようだ", "it seems that", "通じる", "つうじる", "to communicate", "語", "word / language"),
    # 27: Dog Training School
    ("愛犬のしつけ教室", "愛犬[あいけん]の しつけ 教室[きょうしつ]", "Dog Training Lessons",
     "Teaching the playful puppy basic commands like 'sit' and 'wait' using gentle positive rewards.",
     "訓練", "くんれん", "training / drill", "〜なさい", "polite parental command", "従う", "したがう", "to obey", "犬", "dog"),
    # 28: Sumida River Fireworks
    ("隅田川の夏の夜空", "隅田川[すみだがわ]の 夏[なつ]の 夜空[よぞら]", "Summer Night at Sumida Fireworks",
     "Looking up as 20,000 bursts of chrysanthemums and willow sparklers light up Tokyo's night.",
     "花火", "はなび", "fireworks", "〜が聞こえる", "can be heard (spontaneous)", "打ち上がる", "うちあがる", "to shoot up", "夏", "summer"),
    # 29: Subway Transfer Maze
    ("地下鉄の乗り換え", "地下鉄[ちかてつ]の 乗[の]り 換[か]え", "Navigating the Subway Transfer",
     "Following green and orange subway line icons across Otemachi's multi-level corridors.",
     "乗り換え", "のりかえ", "transfer between trains", "〜予定だ", "scheduled / planned to", "急ぐ", "いそぐ", "to hurry", "地", "ground / earth"),
    # 30: Traditional Wedding
    ("神前結婚式の美しさ", "神前[しんぜん] 結婚式[けっこんしき]の 美[うつく]しさ", "Beauty of a Shinto Wedding",
     "Observing a bride in pure white shiromuku kimono crossing the red vermilion bridge.",
     "結婚式", "けっこんしき", "wedding ceremony", "〜お祝い申し上げます", "humble congratulations", "祝う", "いわう", "to celebrate", "結", "tie / join"),
    # 31: Tsukiji Outer Market
    ("築地場外の朝市", "築地場外[つきじじょうがい]の 朝市[あさいち]", "Tsukiji Morning Market Bites",
     "Tasting piping hot sweet dashi rolled omelette and fresh bluefin tuna rice bowls at dawn.",
     "市場", "いちば", "market", "〜てみる", "try doing to see", "味わう", "あじわう", "to taste / savor", "場", "place"),
    # 32: Camping at Lake Kawaguchi
    ("河口湖畔のキャンプ", "河口湖畔[かわぐちこはん]の キャンプ", "Lakeside Camp at Kawaguchiko",
     "Roasting marshmallows beside an open fire with the dark silhouette of Fuji reflecting on water.",
     "焚き火", "たきび", "campfire", "〜が見える", "visible to sight", "映る", "うつる", "to reflect", "湖", "lake"),
    # 33: Coding at Robot Cafe
    ("ロボットカフェの挑戦", "ロボットカフェの 挑戦[ちょうせん]", "Robotics at the Tech Cafe",
     "Programming remote avatar robots that allow hospitalized staff to serve coffee and chat.",
     "分身", "ぶんしん", "avatar / alter ego", "〜ようにする", "make an effort so that", "操作する", "そうさする", "to operate", "機", "machine"),
    # 34: Voice Actor Audition
    ("声優への第一歩", "声優[せいゆう]への 第一歩[だいいっぽ]", "First Step into Voice Acting",
     "Practicing vocal projections and tongue-twister warmups before entering the sound booth.",
     "声優", "せいゆう", "voice actor", "〜はずがない", "cannot possibly be", "演じる", "えんじる", "to perform", "声", "voice"),
    # 35: Kotatsu and Mikan
    ("こたつと蜜柑の団欒", "こたつと 蜜柑[みかん]の 団欒[だんらん]", "Family Warmth under the Kotatsu",
     "Tucking legs under the quilted heated table while peeling sweet mandarin oranges with friends.",
     "団欒", "だんらん", "family harmony", "〜てしまう", "unintentionally end up doing", "温まる", "あたたまる", "to warm up", "団", "group"),
    # 36: Tea Ceremony Hospitality
    ("一期一会のお茶会", "一期一会[いちごいちえ]の お茶会[ちゃかい]", "Treasuring Every Tea Gathering",
     "Turning the chawan bowl twice before drinking to show humility and respect to the host.",
     "作法", "さほう", "etiquette / manners", "〜ていただく", "humbly receive an action", "敬う", "うやまう", "to respect", "会", "meet / gathering"),
    # 37: Hand-Cut Soba Challenge
    ("職人に習う手打ち蕎麦", "職人[しょくにん]に 習[なら]う 手打[てう]ち 蕎麦[そば]", "Learning Hand-Cut Soba",
     "Using a massive wooden rolling pin and special cleaver to cut dough into thin buckwheat ribbons.",
     "職人", "しょくにん", "artisan / craftsman", "〜やすいように", "so that it is easy to", "延ばす", "のばす", "to roll out", "手", "hand"),
    # 38: Airport Passport Scare
    ("成田空港のパスポート", "成田空港[なりたくうこう]の パスポート", "Airport Passport Search",
     "Frantically patting coat pockets before realizing the passport was safely in the front pouch.",
     "搭乗", "とうじょう", "boarding flight", "〜てよかった", "glad that action occurred", "慌てる", "あわてる", "to panic", "空", "sky"),
    # 39: Rescue Cat Cafe
    ("保護猫たちの新しい家", "保護猫[ほごねこ]たちの 新[あたら]しい 家[いえ]", "New Homes for Shelter Cats",
     "Volunteering to brush shy rescue cats and matching loving families with grateful felines.",
     "保護", "ほご", "protection / rescue", "〜てあげる", "conferring a favor to others", "寄り添う", "よりそう", "to cuddle close", "護", "protect"),
    # 40: Tokyo Tower Sunset
    ("夕暮れの東京タワー", "夕暮[ゆうぐ]れの 東京[とうきょう]タワー", "Twilight from Tokyo Tower",
     "Watching headlights begin to illuminate arterial highways as the red metal tower glows.",
     "夕暮れ", "ゆうぐれ", "twilight / dusk", "〜につれて", "as something progresses", "暮れる", "くれる", "to darken", "夕", "evening"),
    # 41: Lucky Bag Queue
    ("初売りの福袋行列", "初売[はつう]りの 福袋[ふくぶくろ] 行列[ぎょうれつ]", "The New Year Lucky Bag Rush",
     "Standing in a brisk morning line outside the department store for mystery lucky bags.",
     "福袋", "ふくぶくろ", "lucky mystery bag", "〜に違いない", "must definitely be", "並ぶ", "ならぶ", "to queue", "福", "fortune"),
    # 42: First Kabuki Show
    ("伝統の歌舞伎舞台", "伝統[でんとう]の 歌舞伎[かぶき] 舞台[ぶたい]", "The Grand Kabuki Stage",
     "Admiring dramatic mie poses and colorful kumadori makeup during a classic historic play.",
     "舞台", "ぶたい", "stage / theatrical performance", "〜を通して", "through the medium of", "響く", "ひびく", "to resonate", "台", "stand / pedestal"),
    # 43: Slime Ninja Village
    ("スライムの忍者体験", "スライムの 忍者[にんじゃ] 体験[たいけん]", "Slime at the Ninja Hideaway",
     "The gelatinous mascot slips effortlessly beneath sliding floorboards to solve ninja riddles.",
     "隠れ身", "かくれみ", "concealment art", "〜ことができる", "possibility / potential", "潜む", "ひそむ", "to lurk / hide", "忍", "endure / stealth"),
    # 44: Imperial Palace Marathon
    ("皇居外周のマラソン", "皇居外周[こうきょがいしゅう]の マラソン", "Marathon around the Imperial Loop",
     "Joining thousands of weekend runners circling the ancient moat under green willow boughs.",
     "外周", "がいしゅう", "outer perimeter", "〜抜く", "finish doing completely", "走り切る", "はしりきる", "to run the full course", "周", "circuit"),
    # 45: Jinbocho Book Hunting
    ("神保町古書街の宝探し", "神保町[じんぼうちょう] 古書街[こしょがい]の 宝探[たからさが]し", "Book Hunting in Jinbocho",
     "Browsing dusty wooden shelves stacked to the ceiling with rare woodblock print collections.",
     "古書", "こしょ", "antique / second-hand book", "〜に夢中になる", "absorbed in doing", "掘り出す", "ほりだす", "to unearth", "書", "write / book"),
    # 46: Wagashi Artisan Mastery
    ("和菓子職人の四季", "和菓子[わがし] 職人[しょくにん]の 四季[しき]", "Four Seasons in Wagashi",
     "Crafting delicate cherry petal and maple leaf bean sweets reflecting each passing calendar month.",
     "四季", "しき", "four seasons", "〜を表現する", "to express visually", "練る", "ねる", "to knead", "季", "season"),
    # 47: University Exam Day
    ("大学入試の朝", "大学[だいがく] 入試[にゅうし]の 朝[あさ]", "Morning of the University Exam",
     "Tension and quiet concentration as hundreds of determined applicants open testing booklets.",
     "入試", "にゅうし", "entrance examination", "〜力を発揮する", "to demonstrate ability", "挑む", "いどむ", "to challenge", "試", "test / try"),
    # 48: Memorial Photo under Sakura
    ("満開の桜の思い出", "満開[まんかい]の 桜[さくら]の 思[おも]い 出[で]", "Cherry Blossom Memories",
     "Snapping high-definition group photographs with teachers before spring graduation departures.",
     "記念", "きねん", "commemoration / memorial", "〜残す", "to leave behind", "微笑む", "ほほえむ", "to smile", "念", "thought / wish"),
    # 49: Senior's Farewell Party
    ("先輩の送別会", "先輩[せんぱい]の 送別会[そうべつかい]", "Senior Colleague's Farewell Party",
     "Presenting bouquets and scrapbooks filled with warm handwritten thank-you messages.",
     "送別会", "そうべつかい", "farewell gathering", "〜お世話になりました", "thank you for caring for me", "贈る", "おくる", "to present gift", "送", "send"),
    # 50: Moving Day to New Spring
    ("引っ越しと新しい生活", "引[ひ]っ越[こ]しと 新[あたら]しい 生活[せいかつ]", "Moving Day and a Fresh Start",
     "Packing cardboard boxes, cleaning wooden floors, and greeting next-door neighbors with towels.",
     "新生活", "しんせいかつ", "new life chapter", "〜踏み出す", "to step forward boldly", "旅立つ", "たびだつ", "to depart on a journey", "新", "new")
]

def generate_n4_stories(existing_stories):
    stories = list(existing_stories)

    for idx, (title, title_furi, en_title, desc, key_v, key_r, key_m, key_g, g_m, key_vb, vb_r, vb_m, kanji_c, kanji_m) in enumerate(N4_TEMPLATES, start=3):
        story_id = f"story_n4_{str(idx).zfill(2)}"
        v_furi = to_furigana(key_v, key_r)
        vb_furi = to_furigana(key_vb, vb_r)
        sentences = [
            {"furigana": f"春[はる]の 暖[あたた]かい 日[ひ]に、ケンさんは {v_furi}の 準備[じゅんび]を 始[はじ]めました。",
             "translation": f"On a warm spring day, Ken began preparing for {en_title}.",
             "grammarNotes": "〜を始めました: Compound verb indicating start of an action."},
            {"furigana": f"「もし 時間[じかん]が あったら、一緒[いっしょ]に {v_furi}を 見[み]よう」と 誘[さそ]われました。",
             "translation": f"He was invited, 'If you have time, let's see {key_m} together.'",
             "grammarNotes": "〜たら: Conditional form; 〜受身: Passive invitation."},
            {"furigana": f"店[みせ]の 人[ひと]が 親切[しんせつ]に {v_furi}の ことについて 説明[せつめい]して くれました。",
             "translation": f"The shop staff kindly explained about {key_m} for him.",
             "grammarNotes": "〜てくれる: Someone doing a favor for the speaker."},
            {"furigana": "初[はじ]めての ことですから、少[すこ]し 緊張[きんちょう]して しまいました。",
             "translation": "Because it was his first time, he ended up getting a little nervous.",
             "grammarNotes": "〜てしまう: Expressing unintentional action or emotional regret."},
            {"furigana": "しかし、やってみると、想像[そうぞう]していたよりも ずっと 面白[おもしろ]かったです。",
             "translation": "However, upon trying it, it was far more interesting than imagined.",
             "grammarNotes": "〜てみる: Trying an action to test outcome; 〜よりも: Comparison."},
            {"furigana": "周[まわ]りの 人[ひと]たちも 「上手[じょうず]ですね」と 褒[ほ]めて くれました。",
             "translation": "People around him also praised him, saying, 'You are good at this!'",
             "grammarNotes": "〜と: Quotation marker; 褒める: To praise."},
            {"furigana": "最後[さいご]まで 頑張[がんば]って、とても 充実[じゅうじつ]した 一日[いちにち]に なりました。",
             "translation": "He persevered until the end, making it a very fulfilling day.",
             "grammarNotes": "〜まで: Temporal extent; 〜になる: Resulting change of state."},
            {"furigana": "これからは もっと 日本語[にほんご]を 勉強[べんきょう]しようと 心[こころ]に 決[き]めました。",
             "translation": "He resolved in his heart to study Japanese even more from now on.",
             "grammarNotes": "〜ようと思う: Volitional intention."}
        ]

        vocab = [
            {"surface": key_v, "reading": key_r, "meaning": key_m, "partOfSpeech": "noun"},
            {"surface": key_vb, "reading": vb_r, "meaning": vb_m, "partOfSpeech": "verb"},
            {"surface": "緊張", "reading": "きんちょう", "meaning": "nervousness / tension", "partOfSpeech": "noun"},
            {"surface": "想像", "reading": "そうぞう", "meaning": "imagination", "partOfSpeech": "noun"},
            {"surface": "充実", "reading": "じゅうじつ", "meaning": "fullness / fulfillment", "partOfSpeech": "noun"},
            {"surface": "決める", "reading": "きめる", "meaning": "to decide", "partOfSpeech": "verb"}
        ]

        elements = [
            {
                "type": "vocabulary", "text": key_v, "surface": key_v, "reading": key_r, "meaning": key_m,
                "roleInStory": f"Core focal element ({key_m}) driving the story's events.",
                "mechanicsExplanation": f"Standard N4 vocabulary item representing practical societal terminology.",
                "exampleSentence": {"japanese": f"{key_v}について詳しく調べます。", "furigana": f"{key_v}[{key_r}]について 詳[くわ]しく 調[しら]べます。", "english": f"I will research carefully about {key_m}."}
            },
            {
                "type": "grammar", "text": key_g, "surface": key_g, "reading": key_g, "meaning": g_m,
                "roleInStory": f"Demonstrates the central N4 grammatical structure ({g_m}) in context.",
                "mechanicsExplanation": "Essential N4 sentence pattern expressing conditional, voice, or interpersonal dynamics.",
                "exampleSentence": {"japanese": "先生が丁寧に教えてくれました。", "furigana": "先生[せんせい]が 丁寧[ていねい]に 教[おし]えて くれました。", "english": "The teacher kindly explained it to me."}
            },
            {
                "type": "particle", "text": "たら", "surface": "たら", "reading": "tara", "meaning": "conditional (if / when)",
                "roleInStory": "Constructs the conditional invitation offered to Ken.",
                "mechanicsExplanation": "Past tense verb/adjective stem + ら forms the universal spoken conditional.",
                "exampleSentence": {"japanese": "雨が降ったら行きません。", "furigana": "雨[あめ]が 降[ふ]ったら 行[い]きません。", "english": "If it rains, I will not go."}
            },
            {
                "type": "kanji", "text": kanji_c, "surface": kanji_c, "reading": kanji_c, "meaning": kanji_m,
                "roleInStory": f"Target N4 kanji character taught in this story.",
                "mechanicsExplanation": f"N4 grade kanji representing the concept of {kanji_m}.",
                "exampleSentence": {"japanese": f"{kanji_c}を大切にします。", "furigana": f"{kanji_c}を 大切[たいせつ]に します。", "english": f"I value {kanji_m}."}
            }
        ]

        questions = [
            {
                "type": "vocabulary",
                "question": f"「{key_v}」の正しい読み方はどれですか？",
                "questionFurigana": f"「{key_v}」の 正[ただ]しい 読[よ]み 方[かた]は どれですか？",
                "options": [key_r, f"お{key_r}", f"し{key_r}", "ことば"],
                "correctAnswer": 0,
                "explanation": f"「{key_v}」 is correctly read as {key_r}.",
                "wrongExplanations": {1: "Incorrect prefix.", 2: "Incorrect reading.", 3: "ことば means word/language."}
            },
            {
                "type": "kanji",
                "question": f"漢字「{kanji_c}」の意味は何ですか？",
                "questionFurigana": f"漢字[かんじ]「{kanji_c}」の 意味[いみ]は 何[なん]ですか？",
                "options": [kanji_m, "mountain", "river", "train"],
                "correctAnswer": 0,
                "explanation": f"The kanji {kanji_c} represents '{kanji_m}'.",
                "wrongExplanations": {1: "Mountain is 山.", 2: "River is 川.", 3: "Train is 電車."}
            },
            {
                "type": "grammar",
                "question": "「〜てしまう」という文法は何を表しますか？",
                "questionFurigana": "「〜てしまう」という 文法[ぶんぽう]は 何[なに]を 表[あらわ]しますか？",
                "options": ["後悔や不本意な完了 (Regret or unintended completion)", "他者への命令 (Command to another)", "未来の計画 (Future plan)", "禁止 (Prohibition)"],
                "correctAnswer": 0,
                "explanation": "〜てしまう expresses doing something unintentionally with regret, or completing an action fully.",
                "wrongExplanations": {1: "Commands use 〜なさい or imperative form.", 2: "Future plans use 〜予定 or 〜つもり.", 3: "Prohibition uses 〜てはいけない."}
            },
            {
                "type": "particle",
                "question": "他人が自分にしてくれる好意を表す補助動詞はどれですか？",
                "questionFurigana": "他人[たにん]が 自分[じぶん]にしてくれる 好意[こうい]を 表[あらわ]す 補助動詞[ほじょどうし]は どれですか？",
                "options": ["〜てくれる", "〜てあげる", "〜てしまう", "〜ておく"],
                "correctAnswer": 0,
                "explanation": "〜てくれる expresses someone performing a kind favor for the speaker (or the speaker's in-group).",
                "wrongExplanations": {1: "〜てあげる is used when the speaker performs a favor for someone else.", 2: "〜てしまう indicates regret/completion.", 3: "〜ておく indicates preparatory action."}
            },
            {
                "type": "comprehension",
                "question": "ケンさんは最後に何を心に決めましたか？",
                "questionFurigana": "ケンさんは 最後[さいご]に 何[なに]を 心[こころ]に 決[き]めましたか？",
                "options": ["もっと日本語を勉強しようと決めた", "国へ帰ろうと決めた", "アルバイトを辞めようと決めた", "旅行に行かないと決めた"],
                "correctAnswer": 0,
                "explanation": "Sentence 8 states: 「これからはもっと日本語を勉強しようと心に決めました」 (He resolved to study Japanese even more from now on).",
                "wrongExplanations": {1: "He did not resolve to return home.", 2: "He did not quit a part-time job.", 3: "He did not cancel a trip."}
            }
        ]

        stories.append(make_story(
            story_id=story_id,
            title=title,
            title_furigana=title_furi,
            english_title=en_title,
            level="N4",
            description=desc,
            sentences_def=sentences,
            vocab_list=vocab,
            elements_def=elements,
            questions_def=questions
        ))

    print(f"[N4 Generator] Built {len(stories)} stories.")
    return stories
