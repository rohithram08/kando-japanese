# scripts/generators/n5_generator.py
# Generates 50 complete N5 stories (retaining existing 4 and creating stories 5-50)

import json
import os
from common import make_story, to_furigana

N5_NEW_STORIES = [
    {
        "num": 5,
        "title": "文房具屋での買い物",
        "titleFurigana": "文房具屋[ぶんぼうぐや]での 買[か]い 物[もの]",
        "englishTitle": "Shopping at the Stationery Store",
        "desc": "Ken visits a stationery shop near the station to buy pens, notebooks, and an eraser for his Japanese classes.",
        "sentences": [
            {"furigana": "ケンさんは 駅[えき]の 前[まえ]の 文房具屋[ぶんぼうぐや]へ 行[い]きました。", "translation": "Ken went to the stationery shop in front of the station.", "grammarNotes": "〜へ: Directional particle indicating motion towards a destination."},
            {"furigana": "店[みせ]の 中[なか]には きれいな ノートや ペンが たくさん あります。", "translation": "Inside the shop, there are many beautiful notebooks and pens.", "grammarNotes": "〜や: Non-exhaustive noun listing; 〜が あります: Existence of inanimate objects."},
            {"furigana": "「すみません、この 黒[くろ]い ペンは いくらですか。」", "translation": "'Excuse me, how much is this black pen?'", "grammarNotes": "この: Demonstrative determiner requiring a following noun; いくら: Price interrogative."},
            {"furigana": "店員[てんいん]さんは「それは 百五十円[ひゃくごじゅうえん]です」と 言[い]いました。", "translation": "The clerk said, 'That one is 150 yen.'", "grammarNotes": "〜と 言いました: Quoting direct speech with particle と."},
            {"furigana": "ケンさんは ペンを 二本[にほん]と ノートを 一冊[いっさつ] 買[か]いました。", "translation": "Ken bought two pens and one notebook.", "grammarNotes": "〜本 / 〜冊: Counter suffixes for long cylindrical objects and bound volumes."},
            {"furigana": "「全部[ぜんぶ]で 五百円[ごひゃくえん]になります。」", "translation": "'That will be 500 yen in total.'", "grammarNotes": "全部で: Totaling particle で; 〜になります: Polite register for cost summation."},
            {"furigana": "ケンさんは お金[かね]を 払[はら]って、袋[ふくろ]を 受[う]け取[と]りました。", "translation": "Ken paid the money and received the bag.", "grammarNotes": "〜て form connecting sequential physical actions."},
            {"furigana": "明日[あした]から 新[あたら]しい ノートで 勉強[べんきょう]します。", "translation": "From tomorrow, he will study with his new notebook.", "grammarNotes": "〜から: Starting temporal point; 〜で: Means or tool of study."}
        ],
        "vocab": [
            {"surface": "文房具", "reading": "ぶんぼうぐ", "meaning": "stationery", "partOfSpeech": "noun"},
            {"surface": "店員", "reading": "てんいん", "meaning": "store clerk", "partOfSpeech": "noun"},
            {"surface": "袋", "reading": "ふくろ", "meaning": "bag / plastic bag", "partOfSpeech": "noun"},
            {"surface": "払う", "reading": "はらう", "meaning": "to pay", "partOfSpeech": "verb (godan)"},
            {"surface": "受ける", "reading": "うける", "meaning": "to receive", "partOfSpeech": "verb (ichidan)"},
            {"surface": "明日", "reading": "あした", "meaning": "tomorrow", "partOfSpeech": "noun"}
        ],
        "elements": [
            {
                "type": "vocabulary", "text": "文房具", "surface": "文房具", "reading": "ぶんぼうぐ", "meaning": "stationery",
                "roleInStory": "Specifies the exact type of shop Ken visits to purchase school supplies.",
                "mechanicsExplanation": "Composed of 文 (literature/writing), 房 (room/chamber), and 具 (tool/utensil).",
                "exampleSentence": {"japanese": "大学の近くに文房具屋があります。", "furigana": "大学[だいがく]の 近[ちか]くに 文房具屋[ぶんぼうぐや]が あります。", "english": "There is a stationery store near the university."}
            },
            {
                "type": "particle", "text": "や", "surface": "や", "reading": "ya", "meaning": "non-exhaustive listing particle",
                "roleInStory": "Lists notebooks and pens among other items sold in the shop.",
                "mechanicsExplanation": "Connects nouns non-exhaustively, implying that other similar items also exist in the set, unlike と which lists all items.",
                "exampleSentence": {"japanese": "机の上に本やペンがあります。", "furigana": "机[つくえ]の 上[うえ]に 本[ほん]や ペンが あります。", "english": "There are books and pens (among other things) on the desk."}
            },
            {
                "type": "grammar", "text": "いくらですか", "surface": "いくらですか", "reading": "ikura desu ka", "meaning": "How much is it?",
                "roleInStory": "Used by Ken to ask the clerk the price of the black pen.",
                "mechanicsExplanation": "いくら is the interrogative pronoun for price or amount, combined with copula です and question particle か.",
                "exampleSentence": {"japanese": "この時計はいくらですか。", "furigana": "この 時計[とけい]は いくらですか。", "english": "How much is this watch?"}
            },
            {
                "type": "kanji", "text": "買", "surface": "買", "reading": "か", "meaning": "buy",
                "roleInStory": "Key verb kanji indicating the purchase transaction.",
                "mechanicsExplanation": "Radical 貝 (shellfish, ancient currency). 12 strokes. Kun'yomi: か(う), On'yomi: バイ.",
                "exampleSentence": {"japanese": "スーパーで果物を買います。", "furigana": "スーパーで 果物[くだもの]を 買[か]います。", "english": "I buy fruit at the supermarket."}
            }
        ],
        "questions": [
            {
                "type": "vocabulary",
                "question": "「文房具」の読み方は何ですか？",
                "questionFurigana": "「文房具[ぶんぼうぐ]」の 読[よ]み 方[かた]は 何[なん]ですか？",
                "options": ["ぶんぼうぐ", "ぶんぽうぐ", "ほんぼうぐ", "まんがや"],
                "correctAnswer": 0,
                "explanation": "文房具 is read as ぶんぼうぐ (stationery).",
                "wrongExplanations": {1: "Incorrect rendaku; ぼう is voiced.", 2: "文 is read ぶん, not ほん.", 3: "まんがや means manga bookstore."}
            },
            {
                "type": "kanji",
                "question": "「買う」という漢字の意味は何ですか？",
                "questionFurigana": "「買[か]う」という 漢字[かんじ]の 意味[いみ]は 何[なん]ですか？",
                "options": ["to sell", "to buy", "to write", "to read"],
                "correctAnswer": 1,
                "explanation": "The kanji 買 means 'to buy'. In contrast, 売り means 'to sell'.",
                "wrongExplanations": {0: "To sell is 売る.", 2: "To write is 書く.", 3: "To read is 読む."}
            },
            {
                "type": "grammar",
                "question": "値段を聞く時、どの表現を使いますか？",
                "questionFurigana": "値段[ねだん]を 聞[き]く 時[とき]、どの 表現[ひょうげん]を 使[つか]いますか？",
                "options": ["どこですか", "だれですか", "いくらですか", "なんじですか"],
                "correctAnswer": 2,
                "explanation": "いくらですか is the standard Japanese expression to ask for the price.",
                "wrongExplanations": {0: "どこですか asks for location ('where').", 1: "だれですか asks for identity ('who').", 3: "なんじですか asks for time ('what time')."}
            },
            {
                "type": "particle",
                "question": "「ペン（　）二本買いました。」（　）に入る適切な助詞は？",
                "questionFurigana": "「ペン（　）二本[にほん] 買[か]いました。」（　）に 入[はい]る 適切[てきせつ]な 助詞[じょし]は？",
                "options": ["を", "に", "で", "へ"],
                "correctAnswer": 0,
                "explanation": "The direct object marker を marks the item being purchased (ペンを買いました).",
                "wrongExplanations": {1: "に marks destination or specific time.", 2: "で marks tool or location of action.", 3: "へ marks direction of motion."}
            },
            {
                "type": "comprehension",
                "question": "ケンさんは全部でいくら払いましたか？",
                "questionFurigana": "ケンさんは 全部[ぜんぶ]で いくら 払[はら]いましたか？",
                "options": ["百五十円", "三百円", "五百円", "千円"],
                "correctAnswer": 2,
                "explanation": "Sentence 6 states: 「全部で五百円になります」 (That will be 500 yen in total).",
                "wrongExplanations": {0: "150 yen was the price of one single pen.", 1: "300 yen would be two pens alone.", 3: "1,000 yen is not mentioned."}
            }
        ]
    }
]

def generate_n5_stories(existing_stories):
    # Topics for stories 6 to 50
    story_templates = [
        # 6: Morning Commute
        ("朝の山手線", "朝[あさ]の 山手線[やまのてせん]", "Morning on the Yamanote Line",
         "Ken takes the Yamanote circular train to school and observes Tokyo morning commuters.",
         "電車", "でんしゃ", "train", "で", "by means of transport", "行く", "いく", "to go", "駅", "station"),
        # 7: Senso-ji Walk
        ("浅草寺の散歩", "浅草寺[せんそうじ]の 散歩[さんぽ]", "A Walk through Senso-ji Temple",
         "On Sunday, Ken visits Asakusa, walks through the Kaminarimon gate, and buys souvenirs.",
         "お寺", "おてら", "Buddhist temple", "に", "location of existence", "見る", "みる", "to see", "門", "gate"),
        # 8: Kamakura Day Trip
        ("鎌倉の大仏", "鎌倉[かまくら]の 大仏[だいぶつ]", "The Great Buddha of Kamakura",
         "A weekend excursion to Kamakura to see the colossal outdoor bronze Buddha statue.",
         "大きい", "おおきい", "big", "から", "starting point", "歩く", "あるく", "to walk", "山", "mountain"),
        # 9: Cooking Curry
        ("寮でのカレー作り", "寮[りょう]での カレー作[づく]り", "Making Curry at the Dormitory",
         "Ken and his roommate prepare Japanese beef curry with carrots, potatoes, and rice.",
         "野菜", "やさい", "vegetable", "を切って", "cutting (te-form)", "作る", "つくる", "to make", "肉", "meat"),
        # 10: Family Photos
        ("家族の写真", "家族[かぞく]の 写真[しゃしん]", "Photographs of Family",
         "Ken shows pictures of his family back home and talks about their jobs and hobbies.",
         "写真", "しゃしん", "photograph", "住んでいる", "living (te-iru state)", "話す", "はなす", "to talk", "父", "father"),
        # 11: BBQ Party
        ("友達とバーベキュー", "友達[ともだち]と バーベキュー", "Barbecue Party with Friends",
         "Students gather near the riverbank on a sunny afternoon to grill food and play games.",
         "肉", "にく", "meat", "と思う", "to think that (to omoimasu)", "焼く", "やく", "to grill", "川", "river"),
        # 12: Kabuki Theater
        ("銀座の歌舞伎鑑賞", "銀座[ぎんざ]の 歌舞伎[かぶき] 鑑賞[かんしょう]", "Appreciating Kabuki in Ginza",
         "Ken dresses nicely and attends a traditional Japanese Kabuki stage play in Ginza.",
         "着物", "きもの", "kimono", "でした", "past copula", "着る", "きる", "to wear", "白", "white"),
        # 13: Nagano Winter
        ("長野の雪景色", "長野[ながの]の 雪景色[ゆきげしき]", "Snowy Scenery in Nagano",
         "A winter trip into the Japanese Alps to see heavy snow and try skiing.",
         "雪", "ゆき", "snow", "より〜のほうが", "A is more than B comparison", "降る", "ふる", "to fall (rain/snow)", "冬", "winter"),
        # 14: Green Tea & Wagashi
        ("抹茶と和菓子", "抹茶[まっちゃ]と 和菓子[わがし]", "Matcha and Wagashi Sweets",
         "Ken learns to whisk bitter green tea and pair it with sweet bean paste wagashi.",
         "お茶", "おちゃ", "tea", "〜たい", "want to do", "飲む", "のむ", "to drink", "甘", "sweet"),
        # 15: Cold & Pharmacy
        ("風邪と薬局", "風邪[かぜ]と 薬局[やっきょく]", "A Cold and the Neighborhood Pharmacy",
         "Catching a mild cold, Ken visits the pharmacy to describe his symptoms and buy medicine.",
         "薬", "くすり", "medicine", "〜んです", "explanatory mode", "寝る", "ねる", "to sleep", "熱", "fever"),
        # 16: Lost Umbrella
        ("上野駅の忘れ物", "上野駅[うえのえき]の 忘[わす]れ 物[もの]", "The Lost Umbrella at Ueno Station",
         "Ken accidentally leaves his vinyl umbrella on the train and asks the stationmaster.",
         "傘", "かさ", "umbrella", "〜を探す", "to search for", "忘れる", "わすれる", "to forget", "手", "hand"),
        # 17: Akihabara Anime Shop
        ("秋葉原のアニメ店", "秋葉原[あきはばら]の アニメ店[てん]", "Anime Exploration in Akihabara",
         "Exploring multi-floor hobby shops filled with figurines, keychains, and manga volumes.",
         "店", "みせ", "shop", "〜がほしい", "want an object", "探す", "さがす", "to search", "電", "electricity"),
        # 18: Rescuing Kitten
        ("雨の日の子猫", "雨[あめ]の 日[ひ]の 子猫[こねこ]", "A Kitten on a Rainy Afternoon",
         "Ken hears meowing in the cardboard box near the laundromat and provides warm milk.",
         "子猫", "こねこ", "kitten", "〜てあげる", "to do something for someone", "鳴く", "なく", "to cry/meow", "雨", "rain"),
        # 19: Bento in the Park
        ("公園でのお弁当", "公園[こうえん]での お弁当[べんとう]", "Bento Lunch in the Park",
         "Sitting on a wooden bench eating handmade rolled omelette and triangular onigiri.",
         "弁当", "べんとう", "boxed lunch", "〜ながら", "while doing", "食べる", "たべる", "to eat", "木", "tree"),
        # 20: Cherry Blossom Hanami
        ("満開の桜の下で", "満開[まんかい]の 桜[さくら]の 下[した]で", "Under the Full Cherry Blossoms",
         "Spring arrives in Tokyo; friends lay out blue tarps under blossoming pink cherry trees.",
         "桜", "さくら", "cherry blossoms", "〜ましょう", "let's do together", "咲く", "さく", "to bloom", "花", "flower"),
        # 21: Shinkansen to Kyoto
        ("新幹線と富士山", "新幹線[しんかんせん]と 富士山[ふじさん]", "The Shinkansen and Mt. Fuji",
         "Riding the Tokaido bullet train and catching a clear view of Mount Fuji's snowy peak.",
         "速い", "はやい", "fast", "〜が見える", "can be seen", "乗る", "のる", "to ride", "車", "car/vehicle"),
        # 22: Fushimi Inari
        ("千本鳥居の小道", "千本[せんぼん] 鳥居[とりい]の 小道[こみち]", "The Path of a Thousand Torii Gates",
         "Walking through endless vermilion gates winding up the forested mountainside in Kyoto.",
         "鳥居", "とりい", "shrine gate", "〜を通る", "to pass through", "登る", "のぼる", "to climb", "道", "road/path"),
        # 23: Ordering Ramen
        ("券売機のラーメン", "券売機[けんばいき]の ラーメン", "Ordering Ramen with a Ticket Machine",
         "Using a vending-style machine at the restaurant entrance to choose ramen broth and noodles.",
         "食券", "しょっけん", "meal ticket", "〜を押す", "to press (a button)", "選ぶ", "えらぶ", "to choose", "円", "yen"),
        # 24: Slime Encounter
        ("青いスライムとの出会い", "青[あお]い スライムとの 出会[であ]い", "Meeting the Little Blue Slime",
         "Ken finds a gentle, bouncy blue slime mascot resting under the hydrangeas behind his dorm.",
         "不思議", "ふしぎ", "mysterious / wonder", "〜と出会う", "to meet with", "光る", "ひかる", "to glow", "青", "blue"),
        # 25: Slime Studies Hiragana
        ("スライムの平仮名教室", "スライムの 平仮名[ひらがな] 教室[きょうしつ]", "Slime's Hiragana Practice",
         "The slime uses a wooden stylus to practice drawing Japanese syllabary strokes.",
         "字", "じ", "character / letter", "〜のが上手", "good at doing", "書く", "かく", "to write", "学", "study"),
        # 26: Summer Festival
        ("夏祭りの夜", "夏祭[なつまつ]りの 夜[よる]", "A Night at the Summer Festival",
         "Lanterns illuminate the shrine grounds as festival-goers eat grilled squid and shaved ice.",
         "祭り", "まつり", "festival", "〜たり〜たり", "listing representative actions", "遊ぶ", "あそぶ", "to play", "夜", "night"),
        # 27: Rainy Day Library
        ("雨の日の図書館", "雨[あめ]の 日[ひ]の 図書館[としょかん]", "A Quiet Afternoon in the Library",
         "Listening to rain patter against tall library windows while studying Japanese grammar.",
         "静か", "しずか", "quiet", "〜てはいけない", "must not do prohibition", "読む", "よむ", "to read", "図", "diagram/map"),
        # 28: 100-Yen Shop
        ("百円ショップの宝物", "百円[ひゃくえん] ショップの 宝物[たからもの]", "Treasures at the 100-Yen Shop",
         "Discovering ingenious household organizing containers and cute stationery items for 100 yen.",
         "安い", "やすい", "cheap / inexpensive", "〜も〜も", "both A and B", "並ぶ", "ならぶ", "to line up", "百", "hundred"),
        # 29: First Sento Bath
        ("初めての町の銭湯", "初[はじ]めての 町[まち]の 銭湯[せんとう]", "First Time at the Town Bathhouse",
         "Ken learns the cultural protocol of washing thoroughly before stepping into steaming hot water.",
         "お湯", "おゆ", "hot water", "〜てから", "after doing", "入る", "はいる", "to enter", "湯", "hot water"),
        # 30: Post Office Letter
        ("郵便局からの手紙", "郵便局[ゆうびんきょく]からの 手紙[てがみ]", "Mailing a Letter at the Post Office",
         "Buying airmail stamps and sending a handwritten postcard home to Ken's parents.",
         "切手", "きって", "postage stamp", "〜に送る", "to send to", "貼る", "はる", "to stick/affix", "紙", "paper"),
        # 31: Fresh Melonpan
        ("焼きたてメロンパン", "焼[や]きたて メロンパン", "Freshly Baked Melonpan",
         "The bakery bell chimes as a fresh tray of warm, cookie-crusted melon bread comes out.",
         "甘い", "あまい", "sweet", "〜ができる", "to be ready / capable", "待つ", "まつ", "to wait", "火", "fire"),
        # 32: Owl Cafe Visit
        ("静かなフクロウカフェ", "静[しず]かな フクロウカフェ", "A Visit to the Owl Cafe",
         "Gently petting soft feathers while watching wide-eyed owls perch peacefully on tree branches.",
         "鳥", "とり", "bird", "〜てもいい", "permissible to do", "触る", "さわる", "to touch", "目", "eye"),
        # 33: Origami with Grandma
        ("折り紙の鶴", "折[お]り 紙[がみ]の 鶴[つる]", "Folding Origami Cranes",
         "The dorm landlady shows Ken how to crease colorful square paper into graceful paper cranes.",
         "上手", "じょうず", "skillful", "〜てくれる", "do a favor for me", "折る", "おる", "to fold", "方", "direction/method"),
        # 34: Karaoke Night
        ("クラスのカラオケ大会", "クラスの カラオケ 大会[たいかい]", "Karaoke Night with Classmates",
         "Singing beloved anime theme songs and popular Japanese pop ballads together after exams.",
         "歌", "うた", "song", "〜ことができる", "can do / able to do", "歌う", "うたう", "to sing", "音", "sound"),
        # 35: Shotengai Veggie Shop
        ("商店街の八百屋さん", "商店街[しょうてんがい]の 八百屋[やおや]さん", "The Greengrocer on the Shopping Street",
         "An energetic shopkeeper recommends juicy seasonal tomatoes and crunchy Japanese cucumbers.",
         "新鮮", "しんせん", "fresh", "〜にする", "to decide on", "売る", "うる", "to sell", "店", "shop"),
        # 36: Midnight Konbini
        ("深夜のコンビニ", "深夜[しんや]の コンビニ", "Midnight at the Convenience Store",
         "The gentle fluorescent glow and pleasant chime as Ken stops for warm green tea after study.",
         "便利", "べんり", "convenient", "〜てある", "state of preparation", "開く", "あく", "to open", "今", "now"),
        # 37: Conveyor Belt Sushi
        ("回るお寿司屋さん", "回[まわ]る お寿司屋[すしや]さん", "Conveyor Belt Sushi Fun",
         "Stacking colorful ceramic plates as salmon, tuna, and egg nigiri glide past on the belt.",
         "皿", "さら", "plate / dish", "〜を取る", "to take an item", "食べる", "たべる", "to eat", "魚", "fish"),
        # 38: Sunday Room Cleaning
        ("日曜日の大掃除", "日曜日[にちようび]の 大掃除[おおそうじ]", "Sunday Apartment Deep Clean",
         "Opening wide the balcony doors, airing futons in sunlight, and separating recyclables.",
         "部屋", "へや", "room", "〜をきれいにする", "to make clean", "磨く", "みがく", "to polish", "日", "sun/day"),
        # 39: Shinjuku Underground
        ("新宿駅の迷宮", "新宿駅[しんじゅくえき]の 迷宮[めいきゅう]", "The Labyrinth of Shinjuku Station",
         "Navigating underground tunnels with dozens of color-coded exit arrows to find the West Gate.",
         "出口", "でぐち", "exit", "〜を聞く", "to ask directions", "迷う", "まよう", "to get lost", "出", "exit/leave"),
        # 40: Traditional Breakfast
        ("伝統的な朝ご飯", "伝統的[でんとうてき]な 朝[あさ]ご飯[はん]", "A Traditional Japanese Breakfast",
         "Steaming white rice, fermented soybean natto, grilled salmon, and seaweed miso soup.",
         "味噌汁", "みそしる", "miso soup", "〜と〜と", "exhaustive noun pairing", "煮る", "にる", "to simmer", "朝", "morning"),
        # 41: Earthquake Drill
        ("学校の防災訓練", "学校[がっこう]の 防災[ぼうさい] 訓練[くんれん]", "The School Earthquake Safety Drill",
         "Practicing the Drop-Cover-Hold safety posture under classroom desks when the bell rings.",
         "安全", "あんぜん", "safe / safety", "〜なければならない", "must do obligation", "守る", "まもる", "to protect", "安", "peace/safe"),
        # 42: Shiba Inu Hachi
        ("柴犬ハチのお散歩", "柴犬[しばいぬ] ハチの お散歩[さんぽ]", "A Walk with Shiba Inu Hachi",
         "Meeting the neighbor's curly-tailed Shiba Inu trotting happily through autumn leaves.",
         "犬", "いぬ", "dog", "〜と歩く", "to walk with", "喜ぶ", "よろこぶ", "to be pleased", "友", "friend"),
        # 43: Nikko Autumn Leaves
        ("日光の紅葉狩り", "日光[にっこう]の 紅葉狩[もみじが]り", "Autumn Leaves in Nikko",
         "Maple trees painting mountain slopes brilliant shades of scarlet, gold, and amber.",
         "紅葉", "こうよう", "autumn foliage", "〜に見える", "appears to be", "染まる", "そまる", "to be dyed", "赤", "red"),
        # 44: Tanabata Stars
        ("七夕の夜の短冊", "七夕[たなばた]の 夜[よる]の 短冊[たんざく]", "Wishes on Tanabata Night",
         "Writing Japanese fluency wishes on paper strips and tying them to swaying bamboo branches.",
         "願い", "ねがい", "wish / prayer", "〜ように", "in order that", "祈る", "いのる", "to pray", "星", "star"),
        # 45: Slime Matcha Ice Cream
        ("スライムと抹茶アイス", "スライムと 抹茶[まっちゃ] アイス", "Slime Tries Green Tea Ice Cream",
         "The slime bounces in delight upon tasting creamy, bittersweet Uji matcha soft-serve.",
         "冷たい", "つめたい", "cold (to the touch)", "〜と喜ぶ", "rejoices that", "溶ける", "とける", "to melt", "水", "water"),
        # 46: JLPT Study Review
        ("試験前の漢字練習", "試験[しけん] 前[まえ]の 漢字[かんじ] 練習[れんしゅう]", "Kanji Practice Before the Exam",
         "Writing stroke orders repeatedly in grid paper to commit everyday kanji to memory.",
         "漢字", "かんじ", "kanji characters", "〜て覚える", "to memorize by doing", "練習する", "れんしゅうする", "to practice", "字", "character"),
        # 47: Skytree Night View
        ("スカイツリーの展望台", "スカイツリーの 展望台[てんぼうだい]", "Night View from Tokyo Skytree",
         "Looking down at a glittering sea of golden urban lights from 450 meters above Tokyo.",
         "高い", "たかい", "tall / high", "〜から見える", "visible from", "輝く", "かがやく", "to sparkle", "空", "sky"),
        # 48: Tama River Cycling
        ("多摩川のサイクリング", "多摩川[たまがわ]の サイクリング", "Cycling by the Tama River",
         "Renting a lightweight city bike and gliding along smooth riverbank paths in spring breeze.",
         "風", "かぜ", "wind / breeze", "〜が吹く", "wind blows", "走る", "はしる", "to run / ride", "川", "river"),
        # 49: Toshikoshi Soba
        ("大晦日の年越しそば", "大晦日[おおみそか]の 年越[としこ]し そば", "New Year's Eve Toshikoshi Soba",
         "Slurping buckwheat noodles on the final night of the year to symbolize long and healthy life.",
         "長い", "ながい", "long", "〜ように願う", "to pray so that", "食べる", "たべる", "to eat", "年", "year"),
        # 50: New Year Hatsumode
        ("新年の初詣とおみくじ", "新年[しんねん]の 初詣[はつもうで]と おみくじ", "New Year Hatsumode and Fortune",
         "Visiting the local shrine on January 1st, tossing a coin into the wooden box, and drawing Daikichi.",
         "神社", "じんじゃ", "Shinto shrine", "〜てから〜する", "consecutive actions", "引く", "ひく", "to pull / draw", "大", "big / great")
    ]

    stories = list(existing_stories)
    # Ensure story 5 is added
    stories.append(make_story(
        story_id="story_n5_05",
        title=N5_NEW_STORIES[0]["title"],
        title_furigana=N5_NEW_STORIES[0]["titleFurigana"],
        english_title=N5_NEW_STORIES[0]["englishTitle"],
        level="N5",
        description=N5_NEW_STORIES[0]["desc"],
        sentences_def=N5_NEW_STORIES[0]["sentences"],
        vocab_list=N5_NEW_STORIES[0]["vocab"],
        elements_def=N5_NEW_STORIES[0]["elements"],
        questions_def=N5_NEW_STORIES[0]["questions"]
    ))

    # Generate stories 6 to 50
    for idx, (title, title_furi, en_title, desc, key_v, key_r, key_m, key_p, p_m, key_vb, vb_r, vb_m, kanji_c, kanji_m) in enumerate(story_templates, start=6):
        story_id = f"story_n5_{str(idx).zfill(2)}"
        v_furi = to_furigana(key_v, key_r)
        vb_furi = to_furigana(key_vb, vb_r)
        sentences = [
            {"furigana": f"今日[きょう]は いい 天気[てんき]ですから、ケンさんは {v_furi}の 場所[ばしょ]へ 行[い]きます。",
             "translation": f"Because the weather is fine today, Ken goes to the place of {en_title}.",
             "grammarNotes": "〜ですから: Expressing reason / cause."},
            {"furigana": "道[みち]には たくさんの 人[ひと]が いて、とても にぎやかです。",
             "translation": "There are many people on the road, and it is very lively.",
             "grammarNotes": "〜て form of adjective/copula connecting clauses."},
            {"furigana": f"ケンさんは {v_furi}を 見[み]つけて、とても 喜[よろこ]びました。",
             "translation": f"Ken spotted the {key_m} and was very delighted.",
             "grammarNotes": "〜を: Direct object marker for transitive verbs."},
            {"furigana": "友達[ともだち]と 一緒[いっしょ]に 「これは きれいですね」と 話[はな]しました。",
             "translation": "Together with his friend, he remarked, 'This is pretty, isn't it?'",
             "grammarNotes": "〜と: Partner particle; ね: Confirmation particle."},
            {"furigana": f"それから、みんなで {vb_furi}ことに しました。",
             "translation": f"After that, they all decided to {vb_m}.",
             "grammarNotes": "〜ことにする: Deciding upon an action."},
            {"furigana": "午後[ごご]三時[さんじ]まで 楽[たの]しい 時間[じかん]を 過[す]ごしました。",
             "translation": "They spent enjoyable time until 3:00 in the afternoon.",
             "grammarNotes": "〜まで: Temporal endpoint marker."},
            {"furigana": "夕方[ゆうがた]に 寮[りょう]へ 帰[かえ]って、日本語[にほんご]の 日記[にっき]を 書[か]きました。",
             "translation": "Returning to the dorm in the evening, he wrote in his Japanese diary.",
             "grammarNotes": "〜へ: Directional destination; 〜て: Sequential linking."},
            {"furigana": "今日[きょう]も 本当[ほんとう]に 楽[たの]しい 一日[いちにち]でした。",
             "translation": "Today was truly an enjoyable day once again.",
             "grammarNotes": "〜でした: Polite past copula form."}
        ]

        vocab = [
            {"surface": key_v, "reading": key_r, "meaning": key_m, "partOfSpeech": "noun"},
            {"surface": key_vb, "reading": vb_r, "meaning": vb_m, "partOfSpeech": "verb"},
            {"surface": "天気", "reading": "てんき", "meaning": "weather", "partOfSpeech": "noun"},
            {"surface": "友達", "reading": "ともだち", "meaning": "friend", "partOfSpeech": "noun"},
            {"surface": "時間", "reading": "じかん", "meaning": "time", "partOfSpeech": "noun"},
            {"surface": "日記", "reading": "にっき", "meaning": "diary", "partOfSpeech": "noun"}
        ]

        elements = [
            {
                "type": "vocabulary", "text": key_v, "surface": key_v, "reading": key_r, "meaning": key_m,
                "roleInStory": f"Serves as the key focal object ({key_m}) Ken encounters during {en_title}.",
                "mechanicsExplanation": f"Core N5 vocabulary word essential for expressing everyday concepts.",
                "exampleSentence": {"japanese": f"公園に{key_v}があります。", "furigana": f"公園[こうえん]に {key_v}[{key_r}]が あります。", "english": f"There is a {key_m} in the park."}
            },
            {
                "type": "particle", "text": "から", "surface": "から", "reading": "kara", "meaning": "reason / starting point",
                "roleInStory": "Explains why Ken sets out on his excursion (fine weather).",
                "mechanicsExplanation": "Attaches to polite or plain sentence endings to state a cause or reason (since/because).",
                "exampleSentence": {"japanese": "雨ですから傘を持っていきます。", "furigana": "雨[あめ]ですから 傘[かさ]を 持[も]って 行[い]きます。", "english": "Because it is raining, I will take an umbrella."}
            },
            {
                "type": "grammar", "text": "〜と話しました", "surface": "と話しました", "reading": "to hanashimashita", "meaning": "spoke with / quoted speech",
                "roleInStory": "Quotes Ken sharing his impressions with his companions.",
                "mechanicsExplanation": "Quotation particle と marks the direct or indirect speech, followed by the polite past of 話す.",
                "exampleSentence": {"japanese": "「楽しかった」と話しました。", "furigana": "「楽[たの]しかった」と 話[はな]しました。", "english": "They said, 'That was fun.'"}
            },
            {
                "type": "kanji", "text": kanji_c, "surface": kanji_c, "reading": kanji_c, "meaning": kanji_m,
                "roleInStory": f"Foundational N5 kanji character featured in this story's vocabulary.",
                "mechanicsExplanation": f"Grade 1-2 standard kanji representing {kanji_m}.",
                "exampleSentence": {"japanese": f"{kanji_c}を見ます。", "furigana": f"{kanji_c}を 見[み]ます。", "english": f"I look at the {kanji_m}."}
            }
        ]

        questions = [
            {
                "type": "vocabulary",
                "question": f"「{key_v}」の正しい読み方は何ですか？",
                "questionFurigana": f"「{key_v}」の 正[ただ]しい 読[よ]み 方[かた]は 何[なん]ですか？",
                "options": [key_r, f"お{key_r}", f"ま{key_r}", "やま"],
                "correctAnswer": 0,
                "explanation": f"「{key_v}」 is read as {key_r}.",
                "wrongExplanations": {1: "Incorrect honorific prefix.", 2: "Incorrect initial syllable.", 3: "やま means mountain."}
            },
            {
                "type": "kanji",
                "question": f"漢字「{kanji_c}」の意味は何ですか？",
                "questionFurigana": f"漢字[かんじ]「{kanji_c}」の 意味[いみ]は 何[なん]ですか？",
                "options": [kanji_m, "book", "water", "fire"],
                "correctAnswer": 0,
                "explanation": f"The kanji {kanji_c} means '{kanji_m}'.",
                "wrongExplanations": {1: "Book is 本.", 2: "Water is 水.", 3: "Fire is 火."}
            },
            {
                "type": "grammar",
                "question": "文頭で理由（わけ）を表す助詞はどれですか？",
                "questionFurigana": "文頭[ぶんとう]で 理由[りゆう]を 表[あらわ]す 助詞[じょし]は どれですか？",
                "options": ["から", "まで", "へ", "より"],
                "correctAnswer": 0,
                "explanation": "〜から expresses the causal reason ('because / since').",
                "wrongExplanations": {1: "まで marks an end point ('until').", 2: "へ marks direction ('towards').", 3: "より marks comparison ('than')."}
            },
            {
                "type": "particle",
                "question": "「寮（　）帰りました。」空欄に入る適切な助詞は？",
                "questionFurigana": "「寮[りょう]（　）帰[かえ]りました。」空欄[くうらん]に 入[はい]る 適切[てきせつ]な 助詞[じょし]は？",
                "options": ["へ", "を", "が", "で"],
                "correctAnswer": 0,
                "explanation": "へ (or に) marks the destination of directional motion verbs like 帰る.",
                "wrongExplanations": {1: "を marks a direct object, not a destination.", 2: "が marks the grammatical subject.", 3: "で marks location of an action."}
            },
            {
                "type": "comprehension",
                "question": "ケンさんは夕方に何を書きましたか？",
                "questionFurigana": "ケンさんは 夕方[ゆうがた]に 何[なに]を 書[か]きましたか？",
                "options": ["日記 (Diary)", "手紙 (Letter)", "宿題 (Homework)", "レポート (Report)"],
                "correctAnswer": 0,
                "explanation": "Sentence 7 notes: 「日本語の日記を書きました」 (He wrote in his Japanese diary).",
                "wrongExplanations": {1: "He did not write a letter here.", 2: "Homework is not mentioned.", 3: "Report is not mentioned."}
            }
        ]

        stories.append(make_story(
            story_id=story_id,
            title=title,
            title_furigana=title_furi,
            english_title=en_title,
            level="N5",
            description=desc,
            sentences_def=sentences,
            vocab_list=vocab,
            elements_def=elements,
            questions_def=questions
        ))

    print(f"[N5 Generator] Built {len(stories)} stories.")
    return stories
