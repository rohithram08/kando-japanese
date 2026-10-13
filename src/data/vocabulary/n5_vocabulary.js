// src/data/vocabulary/n5_vocabulary.js
export const N5_VOCABULARY = [
  // PRONOUNS
  {
    word: '私', reading: 'わたし', level: 'N5', pos: 'pronoun',
    en: 'I / me', ta: 'நான்', hi: 'मैं', pt: 'eu', zh: '我', ko: '나', ru: 'я',
    example_jp: '私は学生です。', example_en: 'I am a student.',
    example_ta: 'நான் ஒரு மாணவர்.', example_hi: 'मैं एक छात्र हूँ।'
  },
  {
    word: 'あなた', reading: 'あなた', level: 'N5', pos: 'pronoun',
    en: 'you', ta: 'நீங்கள்', hi: 'आप/तुम', pt: 'você', zh: '你', ko: '당신', ru: 'вы/ты',
    example_jp: 'あなたの名前は何ですか。', example_en: 'What is your name?',
    example_ta: 'உங்கள் பெயர் என்ன?', example_hi: 'आपका नाम क्या है?'
  },
  {
    word: '彼', reading: 'かれ', level: 'N5', pos: 'pronoun',
    en: 'he / him / boyfriend', ta: 'அவன்/காதலன்', hi: 'वह (पुरुष)',
    pt: 'ele', zh: '他', ko: '그', ru: 'он',
    example_jp: '彼は医者です。', example_en: 'He is a doctor.',
    example_ta: 'அவன் ஒரு மருத்துவர்.', example_hi: 'वह डॉक्टर है।'
  },
  {
    word: '彼女', reading: 'かのじょ', level: 'N5', pos: 'pronoun',
    en: 'she / girlfriend', ta: 'அவள்/காதலி', hi: 'वह (स्त्री)/प्रेमिका',
    pt: 'ela', zh: '她', ko: '그녀', ru: 'она',
    example_jp: '彼女は先生です。', example_en: 'She is a teacher.',
    example_ta: 'அவள் ஆசிரியர்.', example_hi: 'वह शिक्षिका है।'
  },

  // COMMON VERBS
  {
    word: '食べる', reading: 'たべる', level: 'N5', pos: 'verb (ichidan)',
    en: 'to eat', ta: 'சாப்பிடு', hi: 'खाना', pt: 'comer', zh: '吃', ko: '먹다', ru: 'есть',
    example_jp: '寿司を食べます。', example_en: 'I eat sushi.',
    example_ta: 'சுஷி சாப்பிடுகிறேன்.', example_hi: 'मैं सुशी खाता हूँ।'
  },
  {
    word: '飲む', reading: 'のむ', level: 'N5', pos: 'verb (godan)',
    en: 'to drink', ta: 'குடி', hi: 'पीना', pt: 'beber', zh: '喝', ko: '마시다', ru: 'пить',
    example_jp: 'お茶を飲みます。', example_en: 'I drink tea.',
    example_ta: 'தேநீர் குடிக்கிறேன்.', example_hi: 'मैं चाय पीता हूँ।'
  },
  {
    word: '行く', reading: 'いく', level: 'N5', pos: 'verb (godan)',
    en: 'to go', ta: 'போ', hi: 'जाना', pt: 'ir', zh: '去', ko: '가다', ru: 'идти',
    example_jp: '学校に行きます。', example_en: 'I go to school.',
    example_ta: 'பள்ளிக்கு போகிறேன்.', example_hi: 'मैं स्कूल जाता हूँ।'
  },
  {
    word: '来る', reading: 'くる', level: 'N5', pos: 'verb (irregular)',
    en: 'to come', ta: 'வா', hi: 'आना', pt: 'vir', zh: '来', ko: '오다', ru: 'приходить',
    example_jp: '友達が来ます。', example_en: 'My friend is coming.',
    example_ta: 'நண்பர் வருகிறார்.', example_hi: 'मेरा दोस्त आ रहा है।'
  },
  {
    word: '見る', reading: 'みる', level: 'N5', pos: 'verb (ichidan)',
    en: 'to see / watch / look', ta: 'பார்', hi: 'देखना', pt: 'ver', zh: '看', ko: '보다', ru: 'смотреть',
    example_jp: '映画を見ます。', example_en: 'I watch movies.',
    example_ta: 'திரைப்படம் பார்க்கிறேன்.', example_hi: 'मैं फिल्म देखता हूँ।'
  },
  {
    word: '聞く', reading: 'きく', level: 'N5', pos: 'verb (godan)',
    en: 'to listen / to ask / to hear', ta: 'கேள்', hi: 'सुनना/पूछना',
    pt: 'ouvir/perguntar', zh: '听/问', ko: '듣다/묻다', ru: 'слушать/спрашивать',
    example_jp: '音楽を聞きます。', example_en: 'I listen to music.',
    example_ta: 'இசை கேட்கிறேன்.', example_hi: 'मैं संगीत सुनता हूँ।'
  },
  {
    word: '話す', reading: 'はなす', level: 'N5', pos: 'verb (godan)',
    en: 'to speak / to talk', ta: 'பேசு', hi: 'बोलना', pt: 'falar', zh: '说', ko: '말하다', ru: 'говорить',
    example_jp: '日本語を話します。', example_en: 'I speak Japanese.',
    example_ta: 'ஜப்பானிய மொழி பேசுகிறேன்.', example_hi: 'मैं जापानी बोलता हूँ।'
  },
  {
    word: '読む', reading: 'よむ', level: 'N5', pos: 'verb (godan)',
    en: 'to read', ta: 'படி', hi: 'पढ़ना', pt: 'ler', zh: '读', ko: '읽다', ru: 'читать',
    example_jp: '本を読みます。', example_en: 'I read books.',
    example_ta: 'புத்தகம் படிக்கிறேன்.', example_hi: 'मैं किताब पढ़ता हूँ।'
  },
  {
    word: '書く', reading: 'かく', level: 'N5', pos: 'verb (godan)',
    en: 'to write', ta: 'எழுது', hi: 'लिखना', pt: 'escrever', zh: '写', ko: '쓰다', ru: 'писать',
    example_jp: '手紙を書きます。', example_en: 'I write letters.',
    example_ta: 'கடிதம் எழுதுகிறேன்.', example_hi: 'मैं पत्र लिखता हूँ।'
  },
  {
    word: '買う', reading: 'かう', level: 'N5', pos: 'verb (godan)',
    en: 'to buy', ta: 'வாங்கு', hi: 'खरीदना', pt: 'comprar', zh: '买', ko: '사다', ru: 'покупать',
    example_jp: 'りんごを買います。', example_en: 'I buy apples.',
    example_ta: 'ஆப்பிள் வாங்குகிறேன்.', example_hi: 'मैं सेब खरीदता हूँ।'
  },
  {
    word: '使う', reading: 'つかう', level: 'N5', pos: 'verb (godan)',
    en: 'to use', ta: 'பயன்படுத்து', hi: 'उपयोग करना', pt: 'usar', zh: '用', ko: '사용하다', ru: 'использовать',
    example_jp: 'パソコンを使います。', example_en: 'I use a computer.',
    example_ta: 'கணினி பயன்படுத்துகிறேன்.', example_hi: 'मैं कंप्यूटर उपयोग करता हूँ।'
  },
  {
    word: '勉強する', reading: 'べんきょうする', level: 'N5', pos: 'verb (suru)',
    en: 'to study', ta: 'படி', hi: 'पढ़ाई करना', pt: 'estudar', zh: '学习', ko: '공부하다', ru: 'учиться',
    example_jp: '毎日日本語を勉強します。', example_en: 'I study Japanese every day.',
    example_ta: 'ஒவ்வொரு நாளும் ஜப்பானிய மொழி படிக்கிறேன்.', example_hi: 'मैं रोज़ जापानी पढ़ता हूँ।'
  },
  {
    word: '仕事する', reading: 'しごとする', level: 'N5', pos: 'verb (suru)',
    en: 'to work', ta: 'வேலை செய்', hi: 'काम करना', pt: 'trabalhar', zh: '工作', ko: '일하다', ru: 'работать',
    example_jp: '会社で仕事します。', example_en: 'I work at a company.',
    example_ta: 'நிறுவனத்தில் வேலை செய்கிறேன்.', example_hi: 'मैं कंपनी में काम करता हूँ।'
  },
  {
    word: '起きる', reading: 'おきる', level: 'N5', pos: 'verb (ichidan)',
    en: 'to wake up / get up', ta: 'எழுந்திரி', hi: 'उठना', pt: 'acordar', zh: '起床', ko: '일어나다', ru: 'просыпаться',
    example_jp: '６時に起きます。', example_en: 'I wake up at 6 o\'clock.',
    example_ta: '6 மணிக்கு எழுந்திரிக்கிறேன்.', example_hi: '6 बजे उठता हूँ।'
  },
  {
    word: '寝る', reading: 'ねる', level: 'N5', pos: 'verb (ichidan)',
    en: 'to sleep / go to bed', ta: 'தூங்கு', hi: 'सोना', pt: 'dormir', zh: '睡觉', ko: '자다', ru: 'спать',
    example_jp: '11時に寝ます。', example_en: 'I go to sleep at 11 o\'clock.',
    example_ta: '11 மணிக்கு தூங்குகிறேன்.', example_hi: '11 बजे सोता हूँ।'
  },
  {
    word: '帰る', reading: 'かえる', level: 'N5', pos: 'verb (godan)',
    en: 'to return home', ta: 'வீடு திரும்பு', hi: 'घर लौटना', pt: 'voltar para casa', zh: '回家', ko: '돌아가다', ru: 'возвращаться домой',
    example_jp: '家に帰ります。', example_en: 'I return home.',
    example_ta: 'வீட்டுக்கு திரும்புகிறேன்.', example_hi: 'मैं घर लौटता हूँ।'
  },

  // ADJECTIVES
  {
    word: '大きい', reading: 'おおきい', level: 'N5', pos: 'i-adjective',
    en: 'big / large', ta: 'பெரிய', hi: 'बड़ा', pt: 'grande', zh: '大', ko: '크다', ru: 'большой',
    example_jp: '大きい犬がいます。', example_en: 'There is a big dog.',
    example_ta: 'ஒரு பெரிய நாய் இருக்கிறது.', example_hi: 'एक बड़ा कुत्ता है।'
  },
  {
    word: '小さい', reading: 'ちいさい', level: 'N5', pos: 'i-adjective',
    en: 'small / little', ta: 'சிறிய', hi: 'छोटा', pt: 'pequeno', zh: '小', ko: '작다', ru: 'маленький',
    example_jp: '小さい猫がいます。', example_en: 'There is a small cat.',
    example_ta: 'ஒரு சிறிய பூனை இருக்கிறது.', example_hi: 'एक छोटी बिल्ली है।'
  },
  {
    word: '暑い', reading: 'あつい', level: 'N5', pos: 'i-adjective',
    en: 'hot (weather/temperature)', ta: 'வெப்பமான', hi: 'गर्म', pt: 'quente', zh: '热', ko: '덥다', ru: 'жаркий',
    example_jp: '今日は暑いです。', example_en: 'Today is hot.',
    example_ta: 'இன்று வெப்பமாக இருக்கிறது.', example_hi: 'आज गर्मी है।'
  },
  {
    word: '寒い', reading: 'さむい', level: 'N5', pos: 'i-adjective',
    en: 'cold (weather)', ta: 'குளிரான', hi: 'ठंडा', pt: 'frio', zh: '冷', ko: '춥다', ru: 'холодный',
    example_jp: '冬は寒いです。', example_en: 'Winter is cold.',
    example_ta: 'குளிர்காலம் குளிராக இருக்கிறது.', example_hi: 'सर्दियों में ठंड होती है।'
  },
  {
    word: '美味しい', reading: 'おいしい', level: 'N5', pos: 'i-adjective',
    en: 'delicious / tasty', ta: 'சுவையான', hi: 'स्वादिष्ट', pt: 'delicioso', zh: '好吃', ko: '맛있다', ru: 'вкусный',
    example_jp: 'この料理は美味しいです。', example_en: 'This food is delicious.',
    example_ta: 'இந்த உணவு சுவையாக இருக்கிறது.', example_hi: 'यह खाना स्वादिष्ट है।'
  },
  {
    word: '面白い', reading: 'おもしろい', level: 'N5', pos: 'i-adjective',
    en: 'interesting / funny', ta: 'சுவாரஸ்யமான/வேடிக்கையான', hi: 'दिलचस्प/मजेदार',
    pt: 'interessante', zh: '有趣', ko: '재미있다', ru: 'интересный',
    example_jp: 'この本は面白いです。', example_en: 'This book is interesting.',
    example_ta: 'இந்த புத்தகம் சுவாரஸ்யமாக இருக்கிறது.', example_hi: 'यह किताब दिलचस्प है।'
  },
  {
    word: 'かわいい', reading: 'かわいい', level: 'N5', pos: 'i-adjective',
    en: 'cute / adorable', ta: 'அழகான/குட்டியான', hi: 'प्यारा/क्यूट',
    pt: 'fofo', zh: '可爱', ko: '귀엽다', ru: 'милый',
    example_jp: 'かわいい猫ですね。', example_en: 'What a cute cat!',
    example_ta: 'அழகான பூனை!', example_hi: 'कितनी प्यारी बिल्ली!'
  },
  {
    word: '高い', reading: 'たかい', level: 'N5', pos: 'i-adjective',
    en: 'expensive / tall / high', ta: 'விலை உயர்ந்த/உயரமான',
    hi: 'महँगा/ऊँचा', pt: 'caro/alto', zh: '贵/高', ko: '비싸다/높다', ru: 'дорогой/высокий',
    example_jp: 'このバッグは高いです。', example_en: 'This bag is expensive.',
    example_ta: 'இந்த பை விலை உயர்ந்தது.', example_hi: 'यह बैग महँगा है।'
  },
  {
    word: '安い', reading: 'やすい', level: 'N5', pos: 'i-adjective',
    en: 'cheap / inexpensive', ta: 'மலிவான', hi: 'सस्ता', pt: 'barato', zh: '便宜', ko: '싸다', ru: 'дешёвый',
    example_jp: 'このお店は安いです。', example_en: 'This shop is cheap.',
    example_ta: 'இந்த கடை மலிவானது.', example_hi: 'यह दुकान सस्ती है।'
  },
  {
    word: '難しい', reading: 'むずかしい', level: 'N5', pos: 'i-adjective',
    en: 'difficult / hard', ta: 'கடினமான', hi: 'मुश्किल', pt: 'difícil', zh: '难', ko: '어렵다', ru: 'трудный',
    example_jp: '日本語は難しいです。', example_en: 'Japanese is difficult.',
    example_ta: 'ஜப்பானிய மொழி கடினமானது.', example_hi: 'जापानी मुश्किल है।'
  },
  {
    word: '易しい', reading: 'やさしい', level: 'N5', pos: 'i-adjective',
    en: 'easy / gentle', ta: 'எளிதான/கனிவான', hi: 'आसान/सौम्य', pt: 'fácil', zh: '容易', ko: '쉽다', ru: 'лёгкий',
    example_jp: 'この問題は易しいです。', example_en: 'This question is easy.',
    example_ta: 'இந்த கேள்வி எளிதானது.', example_hi: 'यह सवाल आसान है।'
  },

  // NOUNS - FOOD
  {
    word: 'ご飯', reading: 'ごはん', level: 'N5', pos: 'noun',
    en: 'cooked rice / meal', ta: 'சோறு/உணவு', hi: 'चावल/खाना',
    pt: 'arroz/refeição', zh: '米饭/饭', ko: '밥', ru: 'рис/еда',
    example_jp: 'ご飯を食べましょう。', example_en: 'Let\'s eat!',
    example_ta: 'சாப்பிடுவோம்!', example_hi: 'खाना खाते हैं!'
  },
  {
    word: 'パン', reading: 'パン', level: 'N5', pos: 'noun',
    en: 'bread', ta: 'ரொட்டி', hi: 'रोटी/ब्रेड', pt: 'pão', zh: '面包', ko: '빵', ru: 'хлеб',
    example_jp: '朝パンを食べます。', example_en: 'I eat bread in the morning.',
    example_ta: 'காலையில் ரொட்டி சாப்பிடுகிறேன்.', example_hi: 'सुबह रोटी खाता हूँ।'
  },
  {
    word: '水', reading: 'みず', level: 'N5', pos: 'noun',
    en: 'water', ta: 'தண்ணீர்', hi: 'पानी', pt: 'água', zh: '水', ko: '물', ru: 'вода',
    example_jp: '水を飲みます。', example_en: 'I drink water.',
    example_ta: 'தண்ணீர் குடிக்கிறேன்.', example_hi: 'मैं पानी पीता हूँ।'
  },
  {
    word: 'お茶', reading: 'おちゃ', level: 'N5', pos: 'noun',
    en: 'tea (Japanese green tea)', ta: 'தேநீர்', hi: 'चाय', pt: 'chá', zh: '茶', ko: '차', ru: 'чай',
    example_jp: 'お茶を飲みますか。', example_en: 'Would you like tea?',
    example_ta: 'தேநீர் வேண்டுமா?', example_hi: 'क्या चाय चाहिए?'
  },
  {
    word: 'コーヒー', reading: 'コーヒー', level: 'N5', pos: 'noun',
    en: 'coffee', ta: 'காபி', hi: 'कॉफी', pt: 'café', zh: '咖啡', ko: '커피', ru: 'кофе',
    example_jp: 'コーヒーが好きです。', example_en: 'I like coffee.',
    example_ta: 'என்னிக்கு காபி பிடிக்கும்.', example_hi: 'मुझे कॉफी पसंद है।'
  },

  // NOUNS - PLACES
  {
    word: '学校', reading: 'がっこう', level: 'N5', pos: 'noun',
    en: 'school', ta: 'பள்ளி', hi: 'स्कूल', pt: 'escola', zh: '学校', ko: '학교', ru: 'школа',
    example_jp: '学校に行きます。', example_en: 'I go to school.',
    example_ta: 'பள்ளிக்கு போகிறேன்.', example_hi: 'मैं स्कूल जाता हूँ।'
  },
  {
    word: '病院', reading: 'びょういん', level: 'N5', pos: 'noun',
    en: 'hospital', ta: 'மருத்துவமனை', hi: 'अस्पताल', pt: 'hospital', zh: '医院', ko: '병원', ru: 'больница',
    example_jp: '病院に行きます。', example_en: 'I go to the hospital.',
    example_ta: 'மருத்துவமனைக்கு போகிறேன்.', example_hi: 'मैं अस्पताल जाता हूँ।'
  },
  {
    word: 'スーパー', reading: 'スーパー', level: 'N5', pos: 'noun',
    en: 'supermarket', ta: 'சூப்பர்மார்க்கெட்', hi: 'सुपरमार्केट',
    pt: 'supermercado', zh: '超市', ko: '슈퍼마켓', ru: 'супермаркет',
    example_jp: 'スーパーで買い物します。', example_en: 'I shop at the supermarket.',
    example_ta: 'சூப்பர்மார்க்கெட்டில் கொள்முதல் செய்கிறேன்.', example_hi: 'मैं सुपरमार्केट में खरीदारी करता हूँ।'
  },
  {
    word: 'レストラン', reading: 'レストラン', level: 'N5', pos: 'noun',
    en: 'restaurant', ta: 'உணவகம்', hi: 'रेस्तराँ', pt: 'restaurante', zh: '餐厅', ko: '레스토랑', ru: 'ресторан',
    example_jp: 'レストランで食べます。', example_en: 'I eat at a restaurant.',
    example_ta: 'உணவகத்தில் சாப்பிடுகிறேன்.', example_hi: 'मैं रेस्तराँ में खाता हूँ।'
  },

  // TIME EXPRESSIONS
  {
    word: '今日', reading: 'きょう', level: 'N5', pos: 'noun',
    en: 'today', ta: 'இன்று', hi: 'आज', pt: 'hoje', zh: '今天', ko: '오늘', ru: 'сегодня',
    example_jp: '今日は月曜日です。', example_en: 'Today is Monday.',
    example_ta: 'இன்று திங்கட்கிழமை.', example_hi: 'आज सोमवार है।'
  },
  {
    word: '明日', reading: 'あした', level: 'N5', pos: 'noun',
    en: 'tomorrow', ta: 'நாளை', hi: 'कल (आने वाला)', pt: 'amanhã', zh: '明天', ko: '내일', ru: 'завтра',
    example_jp: '明日会いましょう。', example_en: 'Let\'s meet tomorrow.',
    example_ta: 'நாளை சந்திப்போம்.', example_hi: 'कल मिलते हैं।'
  },
  {
    word: '昨日', reading: 'きのう', level: 'N5', pos: 'noun',
    en: 'yesterday', ta: 'நேற்று', hi: 'कल (बीता हुआ)', pt: 'ontem', zh: '昨天', ko: '어제', ru: 'вчера',
    example_jp: '昨日何をしましたか。', example_en: 'What did you do yesterday?',
    example_ta: 'நேற்று என்ன செய்தீர்கள்?', example_hi: 'कल क्या किया?'
  },
  {
    word: '今', reading: 'いま', level: 'N5', pos: 'noun',
    en: 'now / right now', ta: 'இப்போது', hi: 'अभी', pt: 'agora', zh: '现在', ko: '지금', ru: 'сейчас',
    example_jp: '今何時ですか。', example_en: 'What time is it now?',
    example_ta: 'இப்போது என்ன மணி?', example_hi: 'अभी क्या समय है?'
  },
  {
    word: '毎日', reading: 'まいにち', level: 'N5', pos: 'noun/adverb',
    en: 'every day', ta: 'ஒவ்வொரு நாளும்', hi: 'हर दिन/रोज़', pt: 'todo dia', zh: '每天', ko: '매일', ru: 'каждый день',
    example_jp: '毎日運動します。', example_en: 'I exercise every day.',
    example_ta: 'ஒவ்வொரு நாளும் உடற்பயிற்சி செய்கிறேன்.', example_hi: 'मैं रोज़ व्यायाम करता हूँ।'
  },

  // NUMBERS & COUNTERS
  {
    word: '一つ', reading: 'ひとつ', level: 'N5', pos: 'noun',
    en: 'one (general counter)', ta: 'ஒன்று', hi: 'एक (सामान्य)', pt: 'um', zh: '一个', ko: '하나', ru: 'один',
    example_jp: 'りんごを一つください。', example_en: 'One apple please.',
    example_ta: 'ஒரு ஆப்பிள் தாருங்கள்.', example_hi: 'एक सेब दीजिए।'
  },
  {
    word: '何', reading: 'なに/なん', level: 'N5', pos: 'pronoun',
    en: 'what', ta: 'என்ன', hi: 'क्या', pt: 'o que', zh: '什么', ko: '무엇', ru: 'что',
    example_jp: 'これは何ですか。', example_en: 'What is this?',
    example_ta: 'இது என்ன?', example_hi: 'यह क्या है?'
  },
  {
    word: 'どこ', reading: 'どこ', level: 'N5', pos: 'pronoun',
    en: 'where', ta: 'எங்கே', hi: 'कहाँ', pt: 'onde', zh: '哪里', ko: '어디', ru: 'где',
    example_jp: 'トイレはどこですか。', example_en: 'Where is the bathroom?',
    example_ta: 'கழிவறை எங்கே?', example_hi: 'शौचालय कहाँ है?'
  },
  {
    word: 'いつ', reading: 'いつ', level: 'N5', pos: 'pronoun',
    en: 'when', ta: 'எப்போது', hi: 'कब', pt: 'quando', zh: '什么时候', ko: '언제', ru: 'когда',
    example_jp: '試験はいつですか。', example_en: 'When is the exam?',
    example_ta: 'தேர்வு எப்போது?', example_hi: 'परीक्षा कब है?'
  },
  {
    word: 'だれ', reading: 'だれ', level: 'N5', pos: 'pronoun',
    en: 'who', ta: 'யார்', hi: 'कौन', pt: 'quem', zh: '谁', ko: '누구', ru: 'кто',
    example_jp: 'あの人はだれですか。', example_en: 'Who is that person?',
    example_ta: 'அந்த நபர் யார்?', example_hi: 'वह व्यक्ति कौन है?'
  },
  {
    word: 'どうして', reading: 'どうして', level: 'N5', pos: 'adverb',
    en: 'why', ta: 'ஏன்', hi: 'क्यों', pt: 'por que', zh: '为什么', ko: '왜', ru: 'почему',
    example_jp: 'どうして遅れましたか。', example_en: 'Why were you late?',
    example_ta: 'ஏன் தாமதமானீர்கள்?', example_hi: 'देर क्यों हुई?'
  },

  // USEFUL EXPRESSIONS
  {
    word: 'はい', reading: 'はい', level: 'N5', pos: 'expression',
    en: 'yes', ta: 'ஆமாம்', hi: 'हाँ', pt: 'sim', zh: '是', ko: '네', ru: 'да',
    example_jp: 'はい、わかりました。', example_en: 'Yes, I understand.',
    example_ta: 'ஆமாம், புரிகிறது.', example_hi: 'हाँ, समझ गया।'
  },
  {
    word: 'いいえ', reading: 'いいえ', level: 'N5', pos: 'expression',
    en: 'no', ta: 'இல்லை', hi: 'नहीं', pt: 'não', zh: '不是', ko: '아니요', ru: 'нет',
    example_jp: 'いいえ、違います。', example_en: 'No, that\'s wrong.',
    example_ta: 'இல்லை, தவறு.', example_hi: 'नहीं, यह गलत है।'
  },
  {
    word: 'わかりました', reading: 'わかりました', level: 'N5', pos: 'expression',
    en: 'I understand / Got it', ta: 'புரிந்தது', hi: 'समझ गया', pt: 'entendi', zh: '明白了', ko: '알겠습니다', ru: 'понял(а)',
    example_jp: 'わかりました、ありがとう。', example_en: 'Understood, thank you.',
    example_ta: 'புரிந்தது, நன்றி.', example_hi: 'समझ गया, धन्यवाद।'
  },
  {
    word: 'すみません', reading: 'すみません', level: 'N5', pos: 'expression',
    en: 'excuse me / sorry / thank you (for trouble)', ta: 'மன்னிக்கவும்', hi: 'माफ़ कीजिए/क्षमा करें',
    pt: 'com licença/desculpe', zh: '对不起/打扰了', ko: '실례합니다/죄송합니다', ru: 'извините',
    example_jp: 'すみません、ちょっと待ってください。', example_en: 'Excuse me, please wait a moment.',
    example_ta: 'மன்னிக்கவும், கொஞ்சம் காத்திருங்கள்.', example_hi: 'माफ़ कीजिए, थोड़ा रुकिए।'
  },
  {
    word: 'ありがとうございます', reading: 'ありがとうございます', level: 'N5', pos: 'expression',
    en: 'thank you very much (formal)', ta: 'மிக்க நன்றி', hi: 'बहुत धन्यवाद',
    pt: 'muito obrigado', zh: '非常感谢', ko: '감사합니다', ru: 'большое спасибо',
    example_jp: 'ありがとうございます、助かりました。', example_en: 'Thank you very much, that helped.',
    example_ta: 'மிக்க நன்றி, உதவியது.', example_hi: 'बहुत धन्यवाद, मदद हुई।'
  },
  {
    word: 'どういたしまして', reading: 'どういたしまして', level: 'N5', pos: 'expression',
    en: 'you\'re welcome', ta: 'பரவாயில்லை', hi: 'कोई बात नहीं',
    pt: 'de nada', zh: '不客气', ko: '천만에요', ru: 'пожалуйста',
    example_jp: 'ありがとう。どういたしまして。', example_en: 'Thank you. You\'re welcome.',
    example_ta: 'நன்றி. பரவாயில்லை.', example_hi: 'धन्यवाद। कोई बात नहीं।'
  },
  {
    word: 'おねがいします', reading: 'おねがいします', level: 'N5', pos: 'expression',
    en: 'please (request) / I beg you', ta: 'தயவுசெய்து/வேண்டுகிறேன்', hi: 'कृपया/मेहरबानी करके',
    pt: 'por favor', zh: '请', ko: '부탁합니다', ru: 'пожалуйста',
    example_jp: 'コーヒーをおねがいします。', example_en: 'Coffee, please.',
    example_ta: 'காபி தாருங்கள் தயவுசெய்து.', example_hi: 'कॉफी, कृपया।'
  },

  // TRANSPORT
  {
    word: '電車', reading: 'でんしゃ', level: 'N5', pos: 'noun',
    en: 'train / electric train', ta: 'ரயில்', hi: 'ट्रेन/रेलगाड़ी',
    pt: 'trem elétrico', zh: '电车', ko: '전철', ru: 'электричка',
    example_jp: '電車で学校に行きます。', example_en: 'I go to school by train.',
    example_ta: 'ரயிலில் பள்ளிக்கு போகிறேன்.', example_hi: 'मैं ट्रेन से स्कूल जाता हूँ।'
  },
  {
    word: 'バス', reading: 'バス', level: 'N5', pos: 'noun',
    en: 'bus', ta: 'பேருந்து', hi: 'बस', pt: 'ônibus', zh: '公共汽车', ko: '버스', ru: 'автобус',
    example_jp: 'バスで来ました。', example_en: 'I came by bus.',
    example_ta: 'பஸ்ஸில் வந்தேன்.', example_hi: 'मैं बस से आया।'
  },
  {
    word: 'タクシー', reading: 'タクシー', level: 'N5', pos: 'noun',
    en: 'taxi', ta: 'டாக்சி', hi: 'टैक्सी', pt: 'táxi', zh: '出租车', ko: '택시', ru: 'такси',
    example_jp: 'タクシーを呼びます。', example_en: 'I will call a taxi.',
    example_ta: 'டாக்சி அழைக்கிறேன்.', example_hi: 'मैं टैक्सी बुलाता हूँ।'
  },
]

// Export count for reference
export const N5_VOCAB_COUNT = N5_VOCABULARY.length
// Full N5 vocabulary = 800 words following same pattern