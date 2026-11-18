export interface StoryboardScene {
  id: string;
  order: number;
  title: string;
  description: string;
  sceneTheme: string;
  captionJa: string;
  captionEn: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole?: string;
  voiceGender?: 'male' | 'female';
  text: string;
  hiragana: string;
  romaji: string;
  en: string;
  sceneIndex: number;
  timeOffsetSec: number;
  durationSec: number;
}

export interface ListeningWord {
  id: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  partOfSpeech: string;
  pitchAccent: string;
  exampleSentenceJa?: string;
  exampleSentenceEn?: string;
}

export interface ExamQuestion {
  id: string;
  mondaiType: 1 | 2;
  mondaiLabel: string;
  instructionJa: string;
  instructionEn: string;
  questionJa: string;
  questionEn: string;
  options: { id: number; textJa: string; textEn: string }[];
  correctIndex: number;
  explanation: string;
}

export interface ListeningScenario {
  id: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  category: string;
  titleJa: string;
  titleEn: string;
  descriptionJa: string;
  descriptionEn: string;
  audioUrl?: string;
  durationSeconds: number;
  audioSpeechRate?: number;
  storyboard: StoryboardScene[];
  dialogue: DialogueLine[];
  vocabulary: ListeningWord[];
  examQuestions: ExamQuestion[];
}

export const LISTENING_SCENARIOS: ListeningScenario[] = [
  {
    "id": "n5_convenience_store",
    "level": "N5",
    "category": "Daily Life",
    "titleJa": "コンビニでのお買い物",
    "titleEn": "Shopping at a Convenience Store",
    "descriptionJa": "レジでの定番のやりとり：お弁当の温めとレジ袋の確認を聞き取ろう！",
    "descriptionEn": "Essential cashier conversation: heating up bentos and deciding on plastic bags!",
    "durationSeconds": 26,
    "audioSpeechRate": 0.82,
    "storyboard": [
      {
        "id": "scene_conbini_1",
        "order": 1,
        "title": "Bento Shelf",
        "description": "Customer chooses a bento and bottle of chilled green tea from the shelf.",
        "sceneTheme": "convenience_store",
        "captionJa": "お弁当とお茶を選びます。",
        "captionEn": "Choosing lunch bento and green tea from the shelf."
      },
      {
        "id": "scene_conbini_2",
        "order": 2,
        "title": "At the Cash Register",
        "description": "Placing items on the counter. The clerk scans the barcodes.",
        "sceneTheme": "convenience_store",
        "captionJa": "レジにお弁当を置きます。",
        "captionEn": "Placing the bento on the checkout counter."
      },
      {
        "id": "scene_conbini_3",
        "order": 3,
        "title": "Microwave & Bagging",
        "description": "Clerk warms up the bento and places it carefully in a plastic bag.",
        "sceneTheme": "convenience_store",
        "captionJa": "店員さんがお弁当を温めて袋に入れます。",
        "captionEn": "The clerk heats the bento and places items in the bag."
      }
    ],
    "dialogue": [
      {
        "id": "d1",
        "speaker": "店員 (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "いらっしゃいませ！お弁当をお預かりします。",
        "hiragana": "いらっしゃいませ！おべんとうをおあずかりします。",
        "romaji": "Irasshaimase! O-bentou o o-azukari shimasu.",
        "en": "Welcome! Let me take your bento.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d2",
        "speaker": "店員 (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "お弁当、温めますか？",
        "hiragana": "おべんとう、あたためますか？",
        "romaji": "O-bentou, atatamemasu ka?",
        "en": "Would you like your bento warmed up?",
        "sceneIndex": 1,
        "timeOffsetSec": 5,
        "durationSec": 3
      },
      {
        "id": "d3",
        "speaker": "田中 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "はい、お願いします。",
        "hiragana": "はい、おねがいします。",
        "romaji": "Hai, onegaishimasu.",
        "en": "Yes, please.",
        "sceneIndex": 1,
        "timeOffsetSec": 9,
        "durationSec": 2
      },
      {
        "id": "d4",
        "speaker": "店員 (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "レジ袋はご利用になりますか？",
        "hiragana": "れじぶくろはごりようになりますか？",
        "romaji": "Rejibukuro wa go-riyou ni narimasu ka?",
        "en": "Would you like a plastic shopping bag?",
        "sceneIndex": 2,
        "timeOffsetSec": 12,
        "durationSec": 3
      },
      {
        "id": "d5",
        "speaker": "田中 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "いいえ、大丈夫です。エコバッグを持っています。",
        "hiragana": "いいえ、だいじょうぶです。えこばっぐをもっています。",
        "romaji": "Iie, daijoubu desu. Eko baggu o motte imasu.",
        "en": "No thank you, I have my own eco bag.",
        "sceneIndex": 2,
        "timeOffsetSec": 16,
        "durationSec": 4
      },
      {
        "id": "d6",
        "speaker": "店員 (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "かしこまりました。合計で680円になります。",
        "hiragana": "かしこまりました。ごうけいでろっぴゃくはちじゅうえんになります。",
        "romaji": "Kashikomarimashita. Goukei de roppyaku hachijuu-en ni narimasu.",
        "en": "Understood. The total comes to 680 yen.",
        "sceneIndex": 2,
        "timeOffsetSec": 21,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_bento",
        "word": "お弁当",
        "reading": "おべんとう",
        "romaji": "o-bentou",
        "meaning": "Japanese boxed lunch / bento",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "昼ごはんにお弁当を買いました。",
        "exampleSentenceEn": "I bought a bento for lunch."
      },
      {
        "id": "w_atatameru",
        "word": "温める",
        "reading": "あたためる",
        "romaji": "atatamemasu",
        "meaning": "to heat up / warm up",
        "partOfSpeech": "verb (Ichidan)",
        "pitchAccent": "④ 中高 (Nakadaka)",
        "exampleSentenceJa": "電子レンジでお弁当を温めます。",
        "exampleSentenceEn": "I heat the bento in the microwave."
      },
      {
        "id": "w_rejibukuro",
        "word": "レジ袋",
        "reading": "れじぶくろ",
        "romaji": "rejibukuro",
        "meaning": "plastic shopping bag",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "レジ袋は有料です。",
        "exampleSentenceEn": "Plastic shopping bags cost extra."
      },
      {
        "id": "w_goukei",
        "word": "合計",
        "reading": "ごうけい",
        "romaji": "goukei",
        "meaning": "total sum / in all",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "合計はいくらですか？",
        "exampleSentenceEn": "How much is the total?"
      },
      {
        "id": "w_kashikomari",
        "word": "かしこまりました",
        "reading": "かしこまりました",
        "romaji": "kashikomarimashita",
        "meaning": "Certainly / Understood (polite service phrase)",
        "partOfSpeech": "expression",
        "pitchAccent": "⑤ 尾高 (Odaka)",
        "exampleSentenceJa": "はい、かしこまりました！",
        "exampleSentenceEn": "Yes, certainly understood!"
      }
    ],
    "examQuestions": [
      {
        "id": "q_n5_conbini_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Understanding)",
        "instructionJa": "女の人はこのあとどうしますか。",
        "instructionEn": "What will the woman do next?",
        "questionJa": "店員に言われたあと、女の人は何をしますか。",
        "questionEn": "After speaking with the clerk, what will the woman do?",
        "options": [
          {
            "id": 1,
            "textJa": "エコバッグを出して品物を入れます。",
            "textEn": "Take out her eco-bag and pack her items."
          },
          {
            "id": 2,
            "textJa": "3円払ってレジ袋を買います。",
            "textEn": "Pay 3 yen and buy a plastic bag."
          },
          {
            "id": 3,
            "textJa": "お弁当を自分でレンジに入れます。",
            "textEn": "Put the bento into the microwave herself."
          },
          {
            "id": 4,
            "textJa": "温めないで持ち帰ります。",
            "textEn": "Take it home without heating it up."
          }
        ],
        "correctIndex": 0,
        "explanation": "女の人は「エコバッグを持っています」と言ったので、自分のエコバッグに入れて持ち帰ります。"
      },
      {
        "id": "q_n5_conbini_2",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "お弁当の代金とお茶の合計はいくらですか。",
        "instructionEn": "How much is the total amount for the purchase?",
        "questionJa": "買い物の合計金額はいくらですか。",
        "questionEn": "What is the total price announced by the clerk?",
        "options": [
          {
            "id": 1,
            "textJa": "580円",
            "textEn": "580 yen"
          },
          {
            "id": 2,
            "textJa": "680円",
            "textEn": "680 yen"
          },
          {
            "id": 3,
            "textJa": "780円",
            "textEn": "780 yen"
          },
          {
            "id": 4,
            "textJa": "860円",
            "textEn": "860 yen"
          }
        ],
        "correctIndex": 1,
        "explanation": "店員が「合計で680円になります」と明確に伝えています。"
      }
    ]
  },
  {
    "id": "n5_train_station",
    "level": "N5",
    "category": "Travel & Transport",
    "titleJa": "駅で切符を買う",
    "titleEn": "Buying a Train Ticket at the Station",
    "descriptionJa": "新宿駅から渋谷駅までの行き方と切符の買い方を駅員さんに質問！",
    "descriptionEn": "Asking the station attendant for directions and ticket fares from Shinjuku to Shibuya!",
    "durationSeconds": 20,
    "audioSpeechRate": 0.85,
    "storyboard": [
      {
        "id": "scene_station_1",
        "order": 1,
        "title": "Ticket Vending Machine",
        "description": "Passenger checking the colourful route map above the automated machines.",
        "sceneTheme": "train_station",
        "captionJa": "駅の路線図で運賃を確認します。",
        "captionEn": "Checking the route map for ticket fares."
      },
      {
        "id": "scene_station_2",
        "order": 2,
        "title": "Station Attendant Window",
        "description": "Passenger approaches the friendly station staff for guidance.",
        "sceneTheme": "train_station",
        "captionJa": "駅員さんに乗り場を聞きます。",
        "captionEn": "Asking the station staff for the platform number."
      },
      {
        "id": "scene_station_3",
        "order": 3,
        "title": "Train Platform Gate",
        "description": "Walking through the ticket barrier toward Platform 14.",
        "sceneTheme": "train_station",
        "captionJa": "山手線のホームへ向かいます。",
        "captionEn": "Heading toward the Yamanote Line platform."
      }
    ],
    "dialogue": [
      {
        "id": "ts1",
        "speaker": "旅行者 (Passenger)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "すみません、渋谷駅まで行きたいのですが、いくらですか？",
        "hiragana": "すみません、しぶやえきまでいきたいのですが、いくらですか？",
        "romaji": "Sumimasen, Shibuya-eki made ikitai no desu ga, ikura desu ka?",
        "en": "Excuse me, I want to go to Shibuya Station, how much is it?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "ts2",
        "speaker": "駅員 (Attendant)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "渋谷駅までは160円です。券売機で買えますよ。",
        "hiragana": "しぶやえきまではひゃくろくじゅうえんです。けんばいきでかえますよ。",
        "romaji": "Shibuya-eki made wa hyaku rokujuu-en desu. Kenbaiki de kaemasu yo.",
        "en": "It is 160 yen to Shibuya Station. You can buy it at the machine.",
        "sceneIndex": 1,
        "timeOffsetSec": 6,
        "durationSec": 4
      },
      {
        "id": "ts3",
        "speaker": "旅行者 (Passenger)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "何番線に乗ればいいですか？",
        "hiragana": "なんばんせんにのればいいですか？",
        "romaji": "Nan-ban-sen ni noreba ii desu ka?",
        "en": "Which platform line should I take?",
        "sceneIndex": 1,
        "timeOffsetSec": 11,
        "durationSec": 3
      },
      {
        "id": "ts4",
        "speaker": "駅員 (Attendant)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "14番線の山手線内回りです。3駅目ですよ。",
        "hiragana": "じゅうよんばんせんのやまのてせんうちまわりです。さんえきめですよ。",
        "romaji": "Juu-yon-ban-sen no Yamanote-sen uchimawari desu. San-eki-me desu yo.",
        "en": "Platform 14, Yamanote Line Inner Loop. It is the 3rd stop.",
        "sceneIndex": 2,
        "timeOffsetSec": 15,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_kippu",
        "word": "切符",
        "reading": "きっぷ",
        "romaji": "kippu",
        "meaning": "ticket (train, transit)",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "切符を改札機に入れます。",
        "exampleSentenceEn": "Insert the ticket into the ticket gate."
      },
      {
        "id": "w_kenbaiki",
        "word": "券売機",
        "reading": "けんばいき",
        "romaji": "kenbaiki",
        "meaning": "ticket vending machine",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "券売機でお金を払います。",
        "exampleSentenceEn": "Pay money at the ticket vending machine."
      },
      {
        "id": "w_yamanote",
        "word": "山手線",
        "reading": "やまのてせん",
        "romaji": "Yamanote-sen",
        "meaning": "Yamanote Loop Line (Tokyo)",
        "partOfSpeech": "proper noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "山手線は緑色の電車です。",
        "exampleSentenceEn": "The Yamanote Line is the green train."
      },
      {
        "id": "w_nanbansen",
        "word": "何番線",
        "reading": "なんばんせん",
        "romaji": "nan-ban-sen",
        "meaning": "which platform / track number",
        "partOfSpeech": "interrogative noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "新幹線は何番線ですか？",
        "exampleSentenceEn": "Which platform is the Shinkansen on?"
      }
    ],
    "examQuestions": [
      {
        "id": "q_n5_station_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Understanding)",
        "instructionJa": "男の人は何番線の電車に乗りますか。",
        "instructionEn": "Which platform track will the man take?",
        "questionJa": "男の人はどのホームに行きますか。",
        "questionEn": "Which platform will the man proceed to?",
        "options": [
          {
            "id": 1,
            "textJa": "4番線",
            "textEn": "Platform 4"
          },
          {
            "id": 2,
            "textJa": "13番線",
            "textEn": "Platform 13"
          },
          {
            "id": 3,
            "textJa": "14番線",
            "textEn": "Platform 14"
          },
          {
            "id": 4,
            "textJa": "16番線",
            "textEn": "Platform 16"
          }
        ],
        "correctIndex": 2,
        "explanation": "駅員さんが「14番線の山手線内回りです」と教えています。正解は14番線です。"
      }
    ]
  },
  {
    "id": "n5_classroom_homework",
    "level": "N5",
    "category": "Classroom & Study",
    "titleJa": "日本語学校での宿題連絡",
    "titleEn": "Homework Notice in Japanese Class",
    "descriptionJa": "先生が週末の宿題と漢字テストの日程を発表します。よく聞きましょう！",
    "descriptionEn": "The teacher announces weekend homework and the date for the kanji quiz. Listen carefully!",
    "durationSeconds": 22,
    "audioSpeechRate": 0.8,
    "storyboard": [
      {
        "id": "scene_class_1",
        "order": 1,
        "title": "Chalkboard Homework Notes",
        "description": "Teacher writing exercises on the board: Chapter 5 Kanji and Workbook.",
        "sceneTheme": "classroom",
        "captionJa": "黒板に宿題を書きます。",
        "captionEn": "Writing the homework assignments on the blackboard."
      },
      {
        "id": "scene_class_2",
        "order": 2,
        "title": "Student Taking Notes",
        "description": "Students writing carefully in their notebooks and checking dates.",
        "sceneTheme": "classroom",
        "captionJa": "学生がノートにメモを取ります。",
        "captionEn": "Students taking notes in their workbooks."
      }
    ],
    "dialogue": [
      {
        "id": "cl1",
        "speaker": "先生 (Teacher)",
        "speakerRole": "teacher",
        "voiceGender": "female",
        "text": "みなさん、今日の授業はここまでです。宿題がありますよ。",
        "hiragana": "みなさん、きょうのじゅぎょうはここまでです。しゅくだいがありますよ。",
        "romaji": "Mina-san, kyou no jugyou wa koko made desu. Shukudai ga arimasu yo.",
        "en": "Everyone, that is all for today’s lesson. There is homework!",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "cl2",
        "speaker": "先生 (Teacher)",
        "speakerRole": "teacher",
        "voiceGender": "female",
        "text": "教科書の45ページと46ページの練習問題を解いてください。",
        "hiragana": "きょうかしょのよんじゅうごぺーじとよんじゅうろくぺーじのれんしゅうもんだいをといてください。",
        "romaji": "Kyoukasho no yonjuu-go peeji to yonjuu-roku peeji no renshuu mondai o toite kudasai.",
        "en": "Please solve the practice exercises on pages 45 and 46 of the textbook.",
        "sceneIndex": 0,
        "timeOffsetSec": 6,
        "durationSec": 6
      },
      {
        "id": "cl3",
        "speaker": "学生 (Student)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "先生、提出は金曜日ですか？",
        "hiragana": "せんせい、ていしゅつはきんようびですか？",
        "romaji": "Sensei, teishutsu wa kin’youbi desu ka?",
        "en": "Teacher, is the submission due on Friday?",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 3
      },
      {
        "id": "cl4",
        "speaker": "先生 (Teacher)",
        "speakerRole": "teacher",
        "voiceGender": "female",
        "text": "いいえ、来週の月曜日の朝に集めます。忘れないでくださいね。",
        "hiragana": "いいえ、らいしゅうのげつようびのあさにあつめます。わすれないでくださいね。",
        "romaji": "Iie, raishuu no getsuyoubi no asa ni atsumemasu. Wasurenaide kudasai ne.",
        "en": "No, I will collect them next Monday morning. Don’t forget!",
        "sceneIndex": 1,
        "timeOffsetSec": 17,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_shukudai",
        "word": "宿題",
        "reading": "しゅくだい",
        "romaji": "shukudai",
        "meaning": "homework",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "宿題を忘れました。",
        "exampleSentenceEn": "I forgot my homework."
      },
      {
        "id": "w_teishutsu",
        "word": "提出",
        "reading": "ていしゅつ",
        "romaji": "teishutsu",
        "meaning": "submission / turning in",
        "partOfSpeech": "noun (suru-verb)",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "レポートを提出します。",
        "exampleSentenceEn": "I will submit my report."
      },
      {
        "id": "w_kyoukasho",
        "word": "教科書",
        "reading": "きょうかしょ",
        "romaji": "kyoukasho",
        "meaning": "textbook",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "教科書を開いてください。",
        "exampleSentenceEn": "Please open your textbook."
      }
    ],
    "examQuestions": [
      {
        "id": "q_n5_class_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Understanding)",
        "instructionJa": "学生はいつ宿題を提出しなければなりませんか。",
        "instructionEn": "When must the students submit their homework?",
        "questionJa": "宿題の締め切りはいつですか。",
        "questionEn": "When is the homework deadline?",
        "options": [
          {
            "id": 1,
            "textJa": "今日の放課後",
            "textEn": "After school today"
          },
          {
            "id": 2,
            "textJa": "今週の金曜日",
            "textEn": "This Friday"
          },
          {
            "id": 3,
            "textJa": "来週の月曜日の朝",
            "textEn": "Next Monday morning"
          },
          {
            "id": 4,
            "textJa": "来週の金曜日",
            "textEn": "Next Friday"
          }
        ],
        "correctIndex": 2,
        "explanation": "学生が「金曜日ですか？」と質問しましたが、先生は「いいえ、来週の月曜日の朝」と訂正しました。"
      }
    ]
  },
  {
    "id": "n4_doctor_clinic",
    "level": "N4",
    "category": "Health & Medical",
    "titleJa": "クリニックで問診",
    "titleEn": "Consultation at the Clinic",
    "descriptionJa": "風邪を引いた患者さんと医師の会話。薬の飲み方の指示を正確に理解しましょう！",
    "descriptionEn": "Doctor consultation for cold symptoms. Listen carefully to prescription medication instructions!",
    "durationSeconds": 18,
    "audioSpeechRate": 0.9,
    "storyboard": [
      {
        "id": "scene_clinic_1",
        "order": 1,
        "title": "Examination Room",
        "description": "Doctor taking patient’s temperature and checking throat with a light.",
        "sceneTheme": "clinic",
        "captionJa": "お医者さんが喉を診察します。",
        "captionEn": "The doctor checks the patient’s throat and temperature."
      },
      {
        "id": "scene_clinic_2",
        "order": 2,
        "title": "Prescription & Pharmacy",
        "description": "Doctor explains dosage: three times daily, strictly after meals.",
        "sceneTheme": "clinic",
        "captionJa": "食後に薬を飲むように説明します。",
        "captionEn": "Doctor instructs taking medicine after each meal."
      }
    ],
    "dialogue": [
      {
        "id": "md1",
        "speaker": "医者 (Doctor)",
        "speakerRole": "doctor",
        "voiceGender": "male",
        "text": "どうされましたか？いつから症状がありますか？",
        "hiragana": "どうされましたか？いつからしょうじょうがありますか？",
        "romaji": "Dou saremashita ka? Itsu kara shoujou ga arimasu ka?",
        "en": "What seems to be the problem? Since when have you had symptoms?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "md2",
        "speaker": "患者 (Patient)",
        "speakerRole": "patient",
        "voiceGender": "female",
        "text": "一昨日から熱があって、喉もすごく痛いんです。",
        "hiragana": "おとといからねつがあって、のどもすごくいたいんです。",
        "romaji": "Ototoi kara netsu ga atte, nodo mo sugoku itai n desu.",
        "en": "I’ve had a fever since the day before yesterday, and my throat hurts a lot.",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 5
      },
      {
        "id": "md3",
        "speaker": "医者 (Doctor)",
        "speakerRole": "doctor",
        "voiceGender": "male",
        "text": "風邪ですね。熱を下げる薬と抗生物質を出しておきます。毎食後に1錠ずつ飲んでください。",
        "hiragana": "かぜですね。ねつをさげるくすりとこうせいぶっしつをだしておきます。まいしょくごにいちじょうずつのんでください。",
        "romaji": "Kaze desu ne. Netsu o sageru kusuri to kousei busshitsu o dashite okimasu. Mai-shokugo ni ichi-jou zutsu nonde kudasai.",
        "en": "It’s a common cold. I will prescribe fever medicine and antibiotics. Take one pill after each meal.",
        "sceneIndex": 1,
        "timeOffsetSec": 11,
        "durationSec": 7
      }
    ],
    "vocabulary": [
      {
        "id": "w_shoujou",
        "word": "症状",
        "reading": "しょうじょう",
        "romaji": "shoujou",
        "meaning": "symptoms",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "風邪の症状があります。",
        "exampleSentenceEn": "I have cold symptoms."
      },
      {
        "id": "w_shokugo",
        "word": "食後",
        "reading": "しょくご",
        "romaji": "shokugo",
        "meaning": "after a meal",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "食後に薬を飲んでください。",
        "exampleSentenceEn": "Please take the medicine after meals."
      }
    ],
    "examQuestions": [
      {
        "id": "q_n4_med_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Understanding)",
        "instructionJa": "患者は薬をいつ、どのように飲みますか。",
        "instructionEn": "When and how should the patient take the medicine?",
        "questionJa": "薬の正しい飲み方はどれですか。",
        "questionEn": "Which is the correct method to take the medicine?",
        "options": [
          {
            "id": 1,
            "textJa": "毎食前に2錠",
            "textEn": "2 pills before every meal"
          },
          {
            "id": 2,
            "textJa": "毎食後に1錠",
            "textEn": "1 pill after every meal"
          },
          {
            "id": 3,
            "textJa": "寝る前に3錠",
            "textEn": "3 pills before bedtime"
          },
          {
            "id": 4,
            "textJa": "痛い時だけ飲む",
            "textEn": "Only when in pain"
          }
        ],
        "correctIndex": 1,
        "explanation": "医師の指示は「毎食後に1錠ずつ」です。"
      }
    ]
  },
  {
    "id": "n3_office_meeting",
    "level": "N3",
    "category": "Business & Office",
    "titleJa": "プロジェクトの進捗確認",
    "titleEn": "Project Progress Status Meeting",
    "descriptionJa": "締切が迫る新規プロジェクトの担当分けと納期調整のビジネス会話。",
    "descriptionEn": "Business meeting discussing task allocations and approaching project delivery deadlines.",
    "durationSeconds": 12,
    "audioSpeechRate": 0.95,
    "storyboard": [
      {
        "id": "scene_off_1",
        "order": 1,
        "title": "Meeting Room Whiteboard",
        "description": "Colleagues analyzing timeline schedule charts and slide deck milestones.",
        "sceneTheme": "office",
        "captionJa": "スケジュール表を見ながら議論します。",
        "captionEn": "Discussing while analyzing the project schedule board."
      }
    ],
    "dialogue": [
      {
        "id": "of1",
        "speaker": "部長 (Manager)",
        "speakerRole": "teacher",
        "voiceGender": "male",
        "text": "来週のプレゼン資料、進捗はどうなっていますか？",
        "hiragana": "らいしゅうのぷれぜんしりょう、しんちょくはどうなっていますか？",
        "romaji": "Raishuu no purezen shiryou, shinchoku wa dou natte imasu ka?",
        "en": "How is the progress on next week’s presentation materials?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "of2",
        "speaker": "佐藤 (Staff)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "構成案は完成しましたが、デザインの最終確認にあと2日ほど必要です。",
        "hiragana": "こうせいあんはかんせいしましたが、でざいんのさいしゅうかくにんにあとふつかほどひつようです。",
        "romaji": "Kousei-an wa kansei shimashita ga, dezain no saishuu kakunin ni ato futsuka hodo hitsuyou desu.",
        "en": "The outline draft is complete, but we need about 2 more days for final design review.",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 6
      }
    ],
    "vocabulary": [
      {
        "id": "w_shinchoku",
        "word": "進捗",
        "reading": "しんちょく",
        "romaji": "shinchoku",
        "meaning": "progress / ongoing status",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "進捗状況を報告してください。",
        "exampleSentenceEn": "Please report the progress status."
      }
    ],
    "examQuestions": [
      {
        "id": "q_n3_off_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "プレゼン資料の何がまだ終わっていませんか。",
        "instructionEn": "What part of the presentation materials is not yet finished?",
        "questionJa": "佐藤さんはあと何をする必要がありますか。",
        "questionEn": "What does Sato still need to complete?",
        "options": [
          {
            "id": 1,
            "textJa": "構成案の作成",
            "textEn": "Creating the outline draft"
          },
          {
            "id": 2,
            "textJa": "デザインの最終確認",
            "textEn": "Final design confirmation"
          },
          {
            "id": 3,
            "textJa": "印刷と配布",
            "textEn": "Printing and distribution"
          },
          {
            "id": 4,
            "textJa": "クライアントへの送付",
            "textEn": "Sending to the client"
          }
        ],
        "correctIndex": 1,
        "explanation": "佐藤さんは「デザインの最終確認にあと2日ほど必要」と述べています。"
      }
    ]
  },
  {
    "id": "n2_job_interview",
    "level": "N2",
    "category": "Career & Keigo",
    "titleJa": "採用面接での自己アピール",
    "titleEn": "Self-PR in a Formal Job Interview",
    "descriptionJa": "敬語・謙譲語を駆使した採用面接。志望動機と強みの論理的説明をキャッチしよう！",
    "descriptionEn": "Formal job interview featuring polite Keigo and Kenjougo. Catch the nuances of motivation and strengths!",
    "durationSeconds": 15,
    "audioSpeechRate": 1,
    "storyboard": [
      {
        "id": "scene_int_1",
        "order": 1,
        "title": "Interview Panel",
        "description": "Candidate seated politely before interview executives answering career questions.",
        "sceneTheme": "interview",
        "captionJa": "面接官の質問に丁寧に答えます。",
        "captionEn": "Candidate answers interview questions with polite humility."
      }
    ],
    "dialogue": [
      {
        "id": "in1",
        "speaker": "面接官 (Interviewer)",
        "speakerRole": "interviewer",
        "voiceGender": "male",
        "text": "前職での経験を、弊社でどのように活かせるとお考えですか。",
        "hiragana": "ぜんしょくでのけいけんを、へいしゃでどのようにいかせるとおかんがえですか。",
        "romaji": "Zenshoku de no keiken o, heisha de dono you ni ikaseru to o-kangae desu ka.",
        "en": "How do you believe you can leverage your previous experience at our company?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "in2",
        "speaker": "応募者 (Applicant)",
        "speakerRole": "applicant",
        "voiceGender": "female",
        "text": "前職ではデータ分析と顧客折衝を担当しておりました。御社のグローバル展開において、迅速な意思決定に貢献できると確信しております。",
        "hiragana": "ぜんしょくではでーたぶんせきとこきゃくせっしょうをたんとうしておりました。おんしゃのぐろーばるてんかいにおいて、じんそくないしけっていにていけんできるとかくしんしております。",
        "romaji": "Zenshoku de wa deeta bunseki to kokyaku sesshou o tantou shite orimashita. Onsha no guroobaru tenkai ni oite, jinsoku na ishi kettei ni kouken dekiru to kakushin shite orimasu.",
        "en": "In my previous position, I was responsible for data analytics and client negotiations. I am confident I can contribute to swift decision-making in your company’s global expansion.",
        "sceneIndex": 0,
        "timeOffsetSec": 6,
        "durationSec": 8
      }
    ],
    "vocabulary": [
      {
        "id": "w_kokyaku_sesshou",
        "word": "顧客折衝",
        "reading": "こきゃくせっしょう",
        "romaji": "kokyaku sesshou",
        "meaning": "client negotiations / liaison",
        "partOfSpeech": "noun",
        "pitchAccent": "④ 中高 (Nakadaka)",
        "exampleSentenceJa": "顧客折衝のスキルを磨きました。",
        "exampleSentenceEn": "I refined my client negotiation skills."
      }
    ],
    "examQuestions": [
      {
        "id": "q_n2_int_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "応募者はどのような強みを活かせると述べていますか。",
        "instructionEn": "What strength does the applicant state they can contribute?",
        "questionJa": "応募者の主張する貢献ポイントはどれですか。",
        "questionEn": "Which contribution does the applicant highlight?",
        "options": [
          {
            "id": 1,
            "textJa": "語学指導の経験",
            "textEn": "Experience teaching foreign languages"
          },
          {
            "id": 2,
            "textJa": "データ分析と迅速な意思決定",
            "textEn": "Data analytics and swift decision-making"
          },
          {
            "id": 3,
            "textJa": "新規工場の設立",
            "textEn": "Establishing new production factories"
          },
          {
            "id": 4,
            "textJa": "コスト削減の計算",
            "textEn": "Cost-reduction calculations"
          }
        ],
        "correctIndex": 1,
        "explanation": "応募者は「データ分析と顧客折衝」「迅速な意思決定に貢献」と述べています。"
      }
    ]
  },
  {
    "id": "n1_lecture_symposium",
    "level": "N1",
    "category": "Academic & Keynote",
    "titleJa": "持続可能性に関する基調講演",
    "titleEn": "Keynote Lecture on Global Sustainability",
    "descriptionJa": "学術シンポジウムでの基調講演。高度な論理展開と抽象語彙の把握を試す最高峰リスニング！",
    "descriptionEn": "Academic keynote presentation. Advanced discourse flow and abstract vocabulary comprehension!",
    "durationSeconds": 10,
    "audioSpeechRate": 1.05,
    "storyboard": [
      {
        "id": "scene_sym_1",
        "order": 1,
        "title": "Academic Auditorium",
        "description": "Keynote speaker standing before a hall addressing climate adaptation data.",
        "sceneTheme": "symposium",
        "captionJa": "演台から最新の研究データを提示します。",
        "captionEn": "Presenting recent peer-reviewed scientific findings from the podium."
      }
    ],
    "dialogue": [
      {
        "id": "sy1",
        "speaker": "登壇者 (Speaker)",
        "speakerRole": "announcer",
        "voiceGender": "male",
        "text": "資源循環型社会への移行は、単なる環境保全の域に留まらず、次代の産業構造改革そのものを示唆しております。",
        "hiragana": "しげんじゅんかんがたしゃかいへのいこうは、たんなるかんきょうほぜんのいきにとどまらず、じだいのさんぎょうこうぞうかいかくそのものをしさしております。",
        "romaji": "Shigen junkan-gata shakai e no ikou wa, tannaru kankyou hozen no iki ni todomarazu, jidai no sangyou kouzou kaikaku sonomono o shisa shite orimasu.",
        "en": "The transition toward a circular resource-oriented society is not merely confined to environmental preservation, but signifies structural reform of industry for the next era.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 8
      }
    ],
    "vocabulary": [
      {
        "id": "w_shisa",
        "word": "示唆",
        "reading": "しさ",
        "romaji": "shisa",
        "meaning": "implication / suggestion / hint",
        "partOfSpeech": "noun (suru-verb)",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "この研究結果は多くの示唆に富んでいます。",
        "exampleSentenceEn": "The results of this study are rich in implications."
      }
    ],
    "examQuestions": [
      {
        "id": "q_n1_sym_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "登壇者は資源循環型社会への移行について何と主張していますか。",
        "instructionEn": "What does the speaker argue regarding the transition to a circular society?",
        "questionJa": "登壇者の論点はどれですか。",
        "questionEn": "Which is the core thesis presented by the speaker?",
        "options": [
          {
            "id": 1,
            "textJa": "環境保護のみを目的とするべきである。",
            "textEn": "It should aim only for environmental protection."
          },
          {
            "id": 2,
            "textJa": "産業構造改革そのものを意味している。",
            "textEn": "It represents fundamental industrial structural reform."
          },
          {
            "id": 3,
            "textJa": "直ちに停止するべきである。",
            "textEn": "It should be halted immediately."
          },
          {
            "id": 4,
            "textJa": "コスト高のため導入は非現実的である。",
            "textEn": "Adoption is unrealistic due to high costs."
          }
        ],
        "correctIndex": 1,
        "explanation": "登壇者は「単なる環境保全に留まらず、産業構造改革そのものを示唆」と明言しています。"
      }
    ]
  },
  {
    "id": "n5_restaurant_order",
    "level": "N5",
    "category": "Daily Life",
    "titleJa": "レストランで注文する",
    "titleEn": "Ordering at a Restaurant",
    "descriptionJa": "定食屋での定番のやりとり：席の案内からラーメンと餃子の注文、お会計まで！",
    "descriptionEn": "Essential dining conversation: table seating, ordering ramen and gyoza!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.82,
    "storyboard": [
      {
        "id": "scene_rest_1",
        "order": 1,
        "title": "Table Seating & Water",
        "description": "Customer enters the restaurant and takes a seat at the counter.",
        "sceneTheme": "restaurant",
        "captionJa": "カウンター席に座り、お水をもらいます。",
        "captionEn": "Taking a seat at the counter and receiving water."
      },
      {
        "id": "scene_rest_2",
        "order": 2,
        "title": "Ordering from Menu",
        "description": "Customer orders shoyu ramen and gyoza from the waiter.",
        "sceneTheme": "restaurant",
        "captionJa": "メニューを見て注文します。",
        "captionEn": "Looking at the menu and placing the order."
      },
      {
        "id": "scene_rest_3",
        "order": 3,
        "title": "Serving & Bill",
        "description": "Customer asks for the check after finishing.",
        "sceneTheme": "restaurant",
        "captionJa": "料理を食べ終えてお会計をします。",
        "captionEn": "Finishing the meal and paying at the register."
      }
    ],
    "dialogue": [
      {
        "id": "d_r1",
        "speaker": "店員 (Waiter)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "いらっしゃいませ！何名様ですか？",
        "hiragana": "いらっしゃいませ！なんめいさまですか？",
        "romaji": "Irasshaimase! Nan-mei-sama desu ka?",
        "en": "Welcome! How many guests in your party?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 3
      },
      {
        "id": "d_r2",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "一人です。カウンター席でいいですか？",
        "hiragana": "ひとりです。かうんたーせきでいいですか？",
        "romaji": "Hitori desu. Kauntaa-seki de ii desu ka?",
        "en": "Just one person. Is the counter seat alright?",
        "sceneIndex": 0,
        "timeOffsetSec": 4,
        "durationSec": 3
      },
      {
        "id": "d_r3",
        "speaker": "店員 (Waiter)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "はい、どうぞ！お水です。決まったら呼んでください。",
        "hiragana": "はい、どうぞ！おみずです。きまったらよんでください。",
        "romaji": "Hai, douzo! O-mizu desu. Kimattara yonde kudasai.",
        "en": "Yes, right this way! Here is water. Call me when ready.",
        "sceneIndex": 0,
        "timeOffsetSec": 8,
        "durationSec": 4
      },
      {
        "id": "d_r4",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "すみません！醤油ラーメンと餃子を一つずつお願いします。",
        "hiragana": "すみません！しょうゆらーめんとぎょうざをひとつずつおねがいします。",
        "romaji": "Sumimasen! Shouyu raamen to gyouza o hitotsu-zutsu onegaishimasu.",
        "en": "Excuse me! One shoyu ramen and one gyoza please.",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 4
      },
      {
        "id": "d_r5",
        "speaker": "店員 (Waiter)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "かしこまりました。少々お待ちくださいね。",
        "hiragana": "かしこまりました。しょうしょうおまちくださいね。",
        "romaji": "Kashikomarimashita. Shoushou omachi kudasai ne.",
        "en": "Certainly. Please wait just a moment.",
        "sceneIndex": 1,
        "timeOffsetSec": 18,
        "durationSec": 3
      },
      {
        "id": "d_r6",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "ごちそうさまでした。美味しかったです！お会計をお願いします。",
        "hiragana": "ごちそうさまでした。おいしかったです！おかいけいをおねがいします。",
        "romaji": "Gochisousama deshita. Oishikatta desu! O-kaikei o onegaishimasu.",
        "en": "Thank you for the meal. It was delicious! The check please.",
        "sceneIndex": 2,
        "timeOffsetSec": 22,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_chuumon",
        "word": "注文",
        "reading": "ちゅうもん",
        "romaji": "chuumon",
        "meaning": "order (at restaurant or store)",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "ラーメンを注文しました。",
        "exampleSentenceEn": "I ordered ramen."
      },
      {
        "id": "w_gyouza",
        "word": "餃子",
        "reading": "ぎょうざ",
        "romaji": "gyouza",
        "meaning": "pan-fried dumplings (gyoza)",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "熱い餃子を食べます。",
        "exampleSentenceEn": "I eat hot gyoza."
      },
      {
        "id": "w_kaikei",
        "word": "お会計",
        "reading": "おかいけい",
        "romaji": "o-kaikei",
        "meaning": "the bill / payment at register",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "お会計をお願いします。",
        "exampleSentenceEn": "The check, please."
      }
    ],
    "examQuestions": [
      {
        "id": "q_rest_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "女の人は何を注文しましたか。",
        "instructionEn": "What did the woman order?",
        "questionJa": "女の人が注文したものはどれですか。",
        "questionEn": "Which items did the woman order?",
        "options": [
          {
            "id": 1,
            "textJa": "醤油ラーメンと餃子",
            "textEn": "Shoyu ramen and gyoza"
          },
          {
            "id": 2,
            "textJa": "味噌ラーメンとビール",
            "textEn": "Miso ramen and beer"
          },
          {
            "id": 3,
            "textJa": "お水と白ご飯",
            "textEn": "Water and white rice"
          },
          {
            "id": 4,
            "textJa": "餃子のみ",
            "textEn": "Only gyoza"
          }
        ],
        "correctIndex": 0,
        "explanation": "女の人は「醤油ラーメンと餃子を一つずつお願いします」と注文しました。"
      }
    ]
  },
  {
    "id": "n5_self_introduction",
    "level": "N5",
    "category": "Social & School",
    "titleJa": "初対面の自己紹介",
    "titleEn": "Self-Introduction",
    "descriptionJa": "日本語クラスでの初めての挨拶：出身、勉強期間、好きな趣味を伝えよう！",
    "descriptionEn": "First meeting introductions: sharing country of origin, study duration, and hobbies!",
    "durationSeconds": 22,
    "audioSpeechRate": 0.82,
    "storyboard": [
      {
        "id": "scene_intro_1",
        "order": 1,
        "title": "Meeting in Classroom",
        "description": "Ken and Yuka introduce themselves before class starts.",
        "sceneTheme": "classroom",
        "captionJa": "教室で初めて挨拶をします。",
        "captionEn": "Exchanging polite greetings in the classroom."
      },
      {
        "id": "scene_intro_2",
        "order": 2,
        "title": "Country & Hobbies",
        "description": "Talking about home country, anime, and how long they studied Japanese.",
        "sceneTheme": "classroom",
        "captionJa": "出身国や好きなアニメについて話します。",
        "captionEn": "Sharing home country and favorite anime series."
      }
    ],
    "dialogue": [
      {
        "id": "d_in1",
        "speaker": "ケン (Ken)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "はじめまして、私はケンです。アメリカから来ました。",
        "hiragana": "はじめまして、わたしはけんです。あめりかからきました。",
        "romaji": "Hajimemashite, watashi wa Ken desu. Amerika kara kimashita.",
        "en": "Nice to meet you, I am Ken. I came from America.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_in2",
        "speaker": "ユカ (Yuka)",
        "speakerRole": "student",
        "voiceGender": "female",
        "text": "はじめまして！ユカです。日本語の勉強はいつからですか？",
        "hiragana": "はじめまして！ゆかです。にほんごのべんきょうはいつからですか？",
        "romaji": "Hajimemashite! Yuka desu. Nihongo no benkyou wa itsu kara desu ka?",
        "en": "Nice to meet you! I am Yuka. Since when have you been studying Japanese?",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 4
      },
      {
        "id": "d_in3",
        "speaker": "ケン (Ken)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "去年の四月から勉強しています。日本のアニメが大好きです。",
        "hiragana": "きょねんのしがつからべんきょうしています。にほんのあにめがだいすきです。",
        "romaji": "Kyonen no shigatsu kara benkyou shite imasu. Nihon no anime ga daisuki desu.",
        "en": "I have been studying since April last year. I love Japanese anime.",
        "sceneIndex": 1,
        "timeOffsetSec": 10,
        "durationSec": 4
      },
      {
        "id": "d_in4",
        "speaker": "ユカ (Yuka)",
        "speakerRole": "student",
        "voiceGender": "female",
        "text": "そうなんですね！NARUTOや鬼滅の刃も知っていますか？",
        "hiragana": "そうなんですね！なるとやきめつのやいばもしっていますか？",
        "romaji": "Sou nan desu ne! Naruto ya Kimetsu no Yaiba mo shitte imasu ka?",
        "en": "Is that so! Do you know Naruto and Demon Slayer too?",
        "sceneIndex": 1,
        "timeOffsetSec": 15,
        "durationSec": 4
      },
      {
        "id": "d_in5",
        "speaker": "ケン (Ken)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "はい、どちらも大好きです！よろしくお願いします。",
        "hiragana": "はい、どちらもだいすきです！よろしくおねがいします。",
        "romaji": "Hai, dochira mo daisuki desu! Yoroshiku onegaishimasu.",
        "en": "Yes, I love both! It is a pleasure to meet you.",
        "sceneIndex": 1,
        "timeOffsetSec": 20,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_hajime",
        "word": "はじめまして",
        "reading": "はじめまして",
        "romaji": "hajimemashite",
        "meaning": "Nice to meet you",
        "partOfSpeech": "expression",
        "pitchAccent": "④ 中高 (Nakadaka)",
        "exampleSentenceJa": "はじめまして、ケンです。",
        "exampleSentenceEn": "Nice to meet you, I am Ken."
      },
      {
        "id": "w_kyonen",
        "word": "去年",
        "reading": "きょねん",
        "romaji": "kyonen",
        "meaning": "last year",
        "partOfSpeech": "noun",
        "pitchAccent": "① 頭高 (Atamadaka)",
        "exampleSentenceJa": "去年から勉強しています。",
        "exampleSentenceEn": "I have been studying since last year."
      }
    ],
    "examQuestions": [
      {
        "id": "q_in_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "ケンさんはいつから日本語を勉強していますか。",
        "instructionEn": "Since when has Ken been studying Japanese?",
        "questionJa": "勉強を始めた時期はどれですか。",
        "questionEn": "When did he start studying?",
        "options": [
          {
            "id": 1,
            "textJa": "去年の四月",
            "textEn": "April of last year"
          },
          {
            "id": 2,
            "textJa": "今年の四月",
            "textEn": "April of this year"
          },
          {
            "id": 3,
            "textJa": "三年前",
            "textEn": "Three years ago"
          },
          {
            "id": 4,
            "textJa": "先月",
            "textEn": "Last month"
          }
        ],
        "correctIndex": 0,
        "explanation": "ケンさんは「去年の四月から勉強しています」と話しました。"
      }
    ]
  },
  {
    "id": "n5_supermarket_groceries",
    "level": "N5",
    "category": "Shopping",
    "titleJa": "スーパーでお買い物",
    "titleEn": "Grocery Shopping at Supermarket",
    "descriptionJa": "野菜とフルーツ、割引セールのお弁当の聞き取り！",
    "descriptionEn": "Buying fresh fruit, understanding discount price tags, and paying with IC card!",
    "durationSeconds": 22,
    "audioSpeechRate": 0.82,
    "storyboard": [
      {
        "id": "scene_sm_1",
        "order": 1,
        "title": "Fruit & Produce Aisle",
        "description": "Customer asks about apple prices.",
        "sceneTheme": "supermarket",
        "captionJa": "果物コーナーでりんごの値段を聞きます。",
        "captionEn": "Asking about apple prices in the fruit section."
      },
      {
        "id": "scene_sm_2",
        "order": 2,
        "title": "Time Sale Discount",
        "description": "Customer learns about the 30% off evening bento discount.",
        "sceneTheme": "supermarket",
        "captionJa": "30%引きのシールが貼られたお弁当を選びます。",
        "captionEn": "Finding the 30% discount evening special bento."
      }
    ],
    "dialogue": [
      {
        "id": "d_sm1",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "すみません、このりんごは一ついくらですか？",
        "hiragana": "すみません、このりんごはひとついくらですか？",
        "romaji": "Sumimasen, kono ringo wa hitotsu ikura desu ka?",
        "en": "Excuse me, how much is one of these apples?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_sm2",
        "speaker": "店員 (Staff)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "一つ120円で、三つまとめると300円ですよ！",
        "hiragana": "ひとつひゃくにじゅうえんで、みっつまとめるとさんびゃくえんですよ！",
        "romaji": "Hitotsu hyaku-nijuu-en de, mittsu matameru to sanbyaku-en desu yo!",
        "en": "One is 120 yen, and three together are 300 yen!",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 4
      },
      {
        "id": "d_sm3",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "じゃあ三つ買います。このお弁当は30パーセント引きですか？",
        "hiragana": "じゃあみっつかいます。このおべんとうはさんじゅっぱーせんとびきですか？",
        "romaji": "Jaa mittsu kaimasu. Kono o-bentou wa san-juppasento biki desu ka?",
        "en": "Then I will buy three. Is this bento 30 percent off?",
        "sceneIndex": 1,
        "timeOffsetSec": 10,
        "durationSec": 4
      },
      {
        "id": "d_sm4",
        "speaker": "店員 (Staff)",
        "speakerRole": "clerk",
        "voiceGender": "male",
        "text": "はい！タイムセール中なので、レジで割引されます。",
        "hiragana": "はい！たいむせーるちゅうなので、れじでわりびきされます。",
        "romaji": "Hai! Taimu seeru chuu na node, reji de waribiki saremasu.",
        "en": "Yes! It is during time sale, so the discount is applied at checkout.",
        "sceneIndex": 1,
        "timeOffsetSec": 15,
        "durationSec": 4
      },
      {
        "id": "d_sm5",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "わかりました。支払いはSuicaでお願いします！",
        "hiragana": "わかりました。しはらいはすいかでおねがいします！",
        "romaji": "Wakarimashita. Shiharai wa Suika de onegaishimasu!",
        "en": "Understood. I would like to pay with Suica please!",
        "sceneIndex": 1,
        "timeOffsetSec": 20,
        "durationSec": 3
      }
    ],
    "vocabulary": [
      {
        "id": "w_ringo",
        "word": "りんご",
        "reading": "りんご",
        "romaji": "ringo",
        "meaning": "apple",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "赤いりんごを食べました。",
        "exampleSentenceEn": "I ate a red apple."
      },
      {
        "id": "w_waribiki",
        "word": "割引",
        "reading": "わりびき",
        "romaji": "waribiki",
        "meaning": "discount",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "夕方は割引があります。",
        "exampleSentenceEn": "There are discounts in the evening."
      }
    ],
    "examQuestions": [
      {
        "id": "q_sm_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "りんごを三つ買うといくらになりますか。",
        "instructionEn": "How much are the three apples in total?",
        "questionJa": "りんご三つの合計金額はどれですか。",
        "questionEn": "Which is the total price for three apples?",
        "options": [
          {
            "id": 1,
            "textJa": "300円",
            "textEn": "300 yen"
          },
          {
            "id": 2,
            "textJa": "360円",
            "textEn": "360 yen"
          },
          {
            "id": 3,
            "textJa": "120円",
            "textEn": "120 yen"
          },
          {
            "id": 4,
            "textJa": "240円",
            "textEn": "240 yen"
          }
        ],
        "correctIndex": 0,
        "explanation": "店員は「一つ120円で、三つまとめると300円」と案内しました。"
      }
    ]
  },
  {
    "id": "n5_asking_directions",
    "level": "N5",
    "category": "Travel & Transport",
    "titleJa": "駅前で道を聞く",
    "titleEn": "Asking for Directions",
    "descriptionJa": "道案内でよく使う表現：まっすぐ、信号を右に曲がる、銀行の隣！",
    "descriptionEn": "Essential navigation expressions: go straight, turn right at the traffic light, next to the bank!",
    "durationSeconds": 20,
    "audioSpeechRate": 0.82,
    "storyboard": [
      {
        "id": "scene_dir_1",
        "order": 1,
        "title": "Street Crossing",
        "description": "Asking a passerby for directions to the post office.",
        "sceneTheme": "street",
        "captionJa": "駅前の交差点で郵便局の場所を尋ねます。",
        "captionEn": "Asking for directions to the post office at the station crosswalk."
      },
      {
        "id": "scene_dir_2",
        "order": 2,
        "title": "Route Explanation",
        "description": "Explaining to go straight and turn at the second signal.",
        "sceneTheme": "post_office",
        "captionJa": "信号を右に曲がって銀行の隣にあります。",
        "captionEn": "Turn right at the light; it is right next to the bank."
      }
    ],
    "dialogue": [
      {
        "id": "d_dir1",
        "speaker": "旅行者 (Tourist)",
        "speakerRole": "tourist",
        "voiceGender": "male",
        "text": "すみません、この近くに郵便局はありますか？",
        "hiragana": "すみません、このちかくにゆうびんきょくはありますか？",
        "romaji": "Sumimasen, kono chikaku ni yuubinkyoku wa arimasu ka?",
        "en": "Excuse me, is there a post office near here?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_dir2",
        "speaker": "地元の人 (Local)",
        "speakerRole": "local",
        "voiceGender": "female",
        "text": "郵便局ですね。この道をまっすぐ行って、二つ目の信号を右に曲がってください。",
        "hiragana": "ゆうびんきょくですね。このみちをまっすぐいって、ふたつめのしんごうをみぎにまがってください。",
        "romaji": "Yuubinkyoku desu ne. Kono michi o massugu itte, futatsu-me no shingou o migi ni magatte kudasai.",
        "en": "The post office. Go straight along this street, and turn right at the second traffic light.",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 5
      },
      {
        "id": "d_dir3",
        "speaker": "旅行者 (Tourist)",
        "speakerRole": "tourist",
        "voiceGender": "male",
        "text": "二つ目の信号を右ですね。歩いて何分くらいですか？",
        "hiragana": "ふたつめのしんごうをみぎですね。あるいてなんぷんくらいですか？",
        "romaji": "Futatsu-me no shingou o migi desu ne. Aruite nan-pun kurai desu ka?",
        "en": "Right at the second light. About how many minutes on foot?",
        "sceneIndex": 1,
        "timeOffsetSec": 11,
        "durationSec": 4
      },
      {
        "id": "d_dir4",
        "speaker": "地元の人 (Local)",
        "speakerRole": "local",
        "voiceGender": "female",
        "text": "五分くらいですよ。大きな銀行のすぐ隣にあります。",
        "hiragana": "ごふんくらいですよ。おおきなぎんこうのすぐとなりにあります。",
        "romaji": "Go-fun kurai desu yo. Ooki na ginkou no sugu tonari ni arimasu.",
        "en": "About 5 minutes. It is right next to a large bank.",
        "sceneIndex": 1,
        "timeOffsetSec": 16,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_massugu",
        "word": "まっすぐ",
        "reading": "まっすぐ",
        "romaji": "massugu",
        "meaning": "straight ahead",
        "partOfSpeech": "adverb",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "まっすぐ歩いてください。",
        "exampleSentenceEn": "Please walk straight ahead."
      },
      {
        "id": "w_tonari",
        "word": "隣",
        "reading": "となり",
        "romaji": "tonari",
        "meaning": "next to / neighboring",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "銀行の隣にあります。",
        "exampleSentenceEn": "It is next to the bank."
      }
    ],
    "examQuestions": [
      {
        "id": "q_dir_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "郵便局はどこにありますか。",
        "instructionEn": "Where is the post office located?",
        "questionJa": "郵便局の場所はどれですか。",
        "questionEn": "Which describes the location?",
        "options": [
          {
            "id": 1,
            "textJa": "二つ目の信号を右に曲がり、銀行の隣",
            "textEn": "Turn right at 2nd signal, next to bank"
          },
          {
            "id": 2,
            "textJa": "一つ目の信号を左に曲がったところ",
            "textEn": "Turn left at 1st signal"
          },
          {
            "id": 3,
            "textJa": "駅の構内",
            "textEn": "Inside the train station"
          },
          {
            "id": 4,
            "textJa": "大きな公園の正面",
            "textEn": "In front of large park"
          }
        ],
        "correctIndex": 0,
        "explanation": "二つ目の信号を右に曲がって歩いて五分、銀行の隣と説明されています。"
      }
    ]
  },
  {
    "id": "n4_hotel_checkin",
    "level": "N4",
    "category": "Travel & Hospitality",
    "titleJa": "ホテルのチェックイン",
    "titleEn": "Hotel Check-In",
    "descriptionJa": "フロントでの手続き：予約の確認、朝食時間、温泉と大浴場の利用案内！",
    "descriptionEn": "Front desk reception: booking confirmation, breakfast hours, and onsen guidance!",
    "durationSeconds": 25,
    "audioSpeechRate": 0.85,
    "storyboard": [
      {
        "id": "scene_hotel_1",
        "order": 1,
        "title": "Front Desk Greeting",
        "description": "Customer checks in under reservation name.",
        "sceneTheme": "hotel",
        "captionJa": "フロントで名前を伝えてチェックインします。",
        "captionEn": "Giving reservation name at hotel reception."
      },
      {
        "id": "scene_hotel_2",
        "order": 2,
        "title": "Room Key & Amenities",
        "description": "Receptionist explains breakfast times and hot spring facilities.",
        "sceneTheme": "hotel",
        "captionJa": "朝食時間と大浴場の案内を受け取ります。",
        "captionEn": "Receiving breakfast hours (7:00-9:30) and bath info."
      }
    ],
    "dialogue": [
      {
        "id": "d_h1",
        "speaker": "フロント (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "いらっしゃいませ。ご宿泊のお客様でしょうか？",
        "hiragana": "いらっしゃいませ。ごしゅくはくのおきゃくさまでしょうか？",
        "romaji": "Irasshaimase. Go-shukuhaku no o-kyaku-sama deshou ka?",
        "en": "Welcome. Are you checking in for a stay tonight?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_h2",
        "speaker": "田中 (Guest)",
        "speakerRole": "guest",
        "voiceGender": "male",
        "text": "はい、ネットで予約した田中と申します。",
        "hiragana": "はい、ねっとでよやくしたたなかともうします。",
        "romaji": "Hai, netto de yoyaku shita Tanaka to moushimasu.",
        "en": "Yes, my name is Tanaka. I made a reservation online.",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 4
      },
      {
        "id": "d_h3",
        "speaker": "フロント (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "田中様ですね。シングルルームで一泊のご予約を承っております。",
        "hiragana": "たなかさまですね。しんぐるるーむでいっぱくのごよやくをうけたまわっております。",
        "romaji": "Tanaka-sama desu ne. Shinguru ruumu de ippaku no go-yoyaku o uketamawatte orimasu.",
        "en": "Mr. Tanaka. We have confirmed your one-night stay in a single room.",
        "sceneIndex": 1,
        "timeOffsetSec": 10,
        "durationSec": 5
      },
      {
        "id": "d_h4",
        "speaker": "フロント (Clerk)",
        "speakerRole": "clerk",
        "voiceGender": "female",
        "text": "ご朝食は2階レストランにて朝7時から9時半までご利用いただけます。",
        "hiragana": "ごちょうしょくはにかいれすとらんにてあさしちじからくじはんまでごりよういただけます。",
        "romaji": "Go-choushoku wa ni-kai resutoran ni te asa shichi-ji kara kuji-han made go-riyou itadakemasu.",
        "en": "Breakfast is available on the 2nd floor from 7:00 to 9:30 AM.",
        "sceneIndex": 1,
        "timeOffsetSec": 16,
        "durationSec": 5
      },
      {
        "id": "d_h5",
        "speaker": "田中 (Guest)",
        "speakerRole": "guest",
        "voiceGender": "male",
        "text": "わかりました。温泉の大浴場は何時まで入れますか？",
        "hiragana": "わかりました。おんせんのだいよくじょうはなんじまではいれますか？",
        "romaji": "Wakarimashita. Onsen no daiyokujou wa nan-ji made hairemasu ka?",
        "en": "Understood. Until what time is the hot spring bath open?",
        "sceneIndex": 1,
        "timeOffsetSec": 22,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_shukuhaku",
        "word": "宿泊",
        "reading": "しゅくはく",
        "romaji": "shukuhaku",
        "meaning": "lodging / staying overnight",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "京都のホテルに宿泊します。",
        "exampleSentenceEn": "I will stay overnight at a Kyoto hotel."
      },
      {
        "id": "w_choushoku",
        "word": "朝食",
        "reading": "ちょうしょく",
        "romaji": "choushoku",
        "meaning": "breakfast (formal term)",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "朝食はバイキング形式です。",
        "exampleSentenceEn": "Breakfast is buffet style."
      }
    ],
    "examQuestions": [
      {
        "id": "q_hotel_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "朝食は何時から何時まで食べられますか。",
        "instructionEn": "What are the breakfast hours?",
        "questionJa": "朝食の時間はどれですか。",
        "questionEn": "Which is the correct breakfast timeframe?",
        "options": [
          {
            "id": 1,
            "textJa": "朝7時から9時半まで",
            "textEn": "7:00 AM to 9:30 AM"
          },
          {
            "id": 2,
            "textJa": "朝6時から8時まで",
            "textEn": "6:00 AM to 8:00 AM"
          },
          {
            "id": 3,
            "textJa": "朝8時から10時まで",
            "textEn": "8:00 AM to 10:00 AM"
          },
          {
            "id": 4,
            "textJa": "24時間いつでも",
            "textEn": "Anytime 24 hours"
          }
        ],
        "correctIndex": 0,
        "explanation": "フロント係は「朝7時から9時半までご利用いただけます」と説明しました。"
      }
    ]
  },
  {
    "id": "n4_part_time_job",
    "level": "N4",
    "category": "Work & Career",
    "titleJa": "アルバイトの面接",
    "titleEn": "Part-Time Job Interview",
    "descriptionJa": "カフェでの面接：シフトの希望、週に何回入れるか、通勤方法の確認！",
    "descriptionEn": "Cafe job interview: weekly shift availability, commuting by bicycle, and start date!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.85,
    "storyboard": [
      {
        "id": "scene_pt_1",
        "order": 1,
        "title": "Interview Beginning",
        "description": "Store manager reviews applicant resume.",
        "sceneTheme": "interview",
        "captionJa": "店長が履歴書を見ながら質問します。",
        "captionEn": "The store manager reviews the application resume."
      },
      {
        "id": "scene_pt_2",
        "order": 2,
        "title": "Shifts & Commuting",
        "description": "Discussing shifts per week and commuting by bicycle.",
        "sceneTheme": "interview",
        "captionJa": "週3日、自転車での通勤を希望します。",
        "captionEn": "Requesting 3 days per week and bicycle commute."
      }
    ],
    "dialogue": [
      {
        "id": "d_pt1",
        "speaker": "店長 (Manager)",
        "speakerRole": "manager",
        "voiceGender": "male",
        "text": "履歴書を拝見しました。現在大学2年生ですね。",
        "hiragana": "りれきしょをはいけんしました。げんざいだいがくにねんせいですね。",
        "romaji": "Rirekisho o haiken shimashita. Genzai daigaku ni-nensei desu ne.",
        "en": "I reviewed your resume. You are currently a second-year university student.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_pt2",
        "speaker": "応募者 (Applicant)",
        "speakerRole": "applicant",
        "voiceGender": "female",
        "text": "はい！経済学部で学んでいます。接客の仕事に挑戦したいです。",
        "hiragana": "はい！けいざいがくぶでまなんでいます。せっきゃくのしごとにちょうせんしたいです。",
        "romaji": "Hai! Keizai-gakubu de manande imasu. Sekkyaku no shigoto ni chousen shitai desu.",
        "en": "Yes! I study in the Economics Faculty. I want to challenge customer service.",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 5
      },
      {
        "id": "d_pt3",
        "speaker": "店長 (Manager)",
        "speakerRole": "manager",
        "voiceGender": "male",
        "text": "週に何日くらいシフトに入れますか？土日はどうですか？",
        "hiragana": "しゅうになんにちくらいしふとにはいれますか？どにちはどうですか？",
        "romaji": "Shuu ni nan-nichi kurai shifuto ni hairemasu ka? Donichi wa dou desu ka?",
        "en": "About how many days per week can you take shifts? How about weekends?",
        "sceneIndex": 1,
        "timeOffsetSec": 11,
        "durationSec": 4
      },
      {
        "id": "d_pt4",
        "speaker": "応募者 (Applicant)",
        "speakerRole": "applicant",
        "voiceGender": "female",
        "text": "週に3日、平日の夕方と土曜日の午前中に入ることができます。",
        "hiragana": "しゅうにみっか、へいじつのゆうがたとどようびのごぜんちゅうにはいることができます。",
        "romaji": "Shuu ni mikka, heijitsu no yuugata to doyoubi no gozenchuu ni hairu koto ga dekimasu.",
        "en": "Three days a week: weekday evenings and Saturday mornings.",
        "sceneIndex": 1,
        "timeOffsetSec": 16,
        "durationSec": 4
      },
      {
        "id": "d_pt5",
        "speaker": "店長 (Manager)",
        "speakerRole": "manager",
        "voiceGender": "male",
        "text": "助かります！通勤は自転車ですか？駐輪場がありますよ。",
        "hiragana": "たすかります！つうきんはじてんしゃですか？ちゅうりんじょうがありますよ。",
        "romaji": "Tasukarimasu! Tsuukin wa jitensha desu ka? Chuurinjou ga arimasu yo.",
        "en": "That helps a lot! Do you commute by bike? We have bicycle parking.",
        "sceneIndex": 1,
        "timeOffsetSec": 21,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_rirekisho",
        "word": "履歴書",
        "reading": "りれきしょ",
        "romaji": "rirekisho",
        "meaning": "curriculum vitae / resume",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "履歴書に写真を貼ります。",
        "exampleSentenceEn": "I attach a photo to the resume."
      },
      {
        "id": "w_sekkyaku",
        "word": "接客",
        "reading": "せっきゃく",
        "romaji": "sekkyaku",
        "meaning": "customer service",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "笑顔で接客します。",
        "exampleSentenceEn": "I serve customers with a smile."
      }
    ],
    "examQuestions": [
      {
        "id": "q_pt_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "応募者は週に何日シフトに入れますか。",
        "instructionEn": "How many days per week can the applicant work?",
        "questionJa": "可能なシフト日数はどれですか。",
        "questionEn": "Which is the available shift count?",
        "options": [
          {
            "id": 1,
            "textJa": "週に3日",
            "textEn": "3 days per week"
          },
          {
            "id": 2,
            "textJa": "週に5日",
            "textEn": "5 days per week"
          },
          {
            "id": 3,
            "textJa": "土日のみの2日",
            "textEn": "Only weekend 2 days"
          },
          {
            "id": 4,
            "textJa": "毎日いつでも",
            "textEn": "Every day anytime"
          }
        ],
        "correctIndex": 0,
        "explanation": "応募者は「週に3日、平日の夕方と土曜日の午前中に入ることができます」と答えました。"
      }
    ]
  },
  {
    "id": "n4_library_inquiry",
    "level": "N4",
    "category": "Study & Library",
    "titleJa": "図書館で本を探す",
    "titleEn": "Borrowing Books at the Library",
    "descriptionJa": "図書館での利用者カード発行と、貸出冊数・返却期限の案内！",
    "descriptionEn": "Issuing a library card, borrowing limits (up to 5 books for 2 weeks), and return procedures!",
    "durationSeconds": 22,
    "audioSpeechRate": 0.85,
    "storyboard": [
      {
        "id": "scene_lib_1",
        "order": 1,
        "title": "Library Reception",
        "description": "Student asks to make a library card.",
        "sceneTheme": "classroom",
        "captionJa": "カウンターで図書カードの作成を申し込みます。",
        "captionEn": "Applying for a library card at the counter."
      },
      {
        "id": "scene_lib_2",
        "order": 2,
        "title": "Borrowing Rules",
        "description": "Librarian explains lending periods and return drop box.",
        "sceneTheme": "classroom",
        "captionJa": "1人5冊まで、2週間借りることができます。",
        "captionEn": "Borrowing up to 5 books for up to 2 weeks."
      }
    ],
    "dialogue": [
      {
        "id": "d_lib1",
        "speaker": "学生 (Student)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "すみません、初めて本を借りたいのですが、カードが必要ですか？",
        "hiragana": "すみません、はじめてほんをかりたいのですが、かーどがひつようですか？",
        "romaji": "Sumimasen, hajimete hon o karitai no desu ga, kaado ga hitsuyou desu ka?",
        "en": "Excuse me, I want to borrow books for the first time. Do I need a card?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "d_lib2",
        "speaker": "司書 (Librarian)",
        "speakerRole": "librarian",
        "voiceGender": "female",
        "text": "はい、学生証か保険証をご提示いただければ、すぐに発行できますよ。",
        "hiragana": "はい、がくせいしょうかほけんしょうをごていじいただければ、すぐにはっこうできますよ。",
        "romaji": "Hai, gakuseishou ka hokenshou o go-teiji itadakereba, sugu ni hakkou dekimasu yo.",
        "en": "Yes, if you present student ID or insurance card, we can issue it immediately.",
        "sceneIndex": 0,
        "timeOffsetSec": 6,
        "durationSec": 5
      },
      {
        "id": "d_lib3",
        "speaker": "司書 (Librarian)",
        "speakerRole": "librarian",
        "voiceGender": "female",
        "text": "本は一度に5冊まで、2週間借りられます。返却ポストもございます。",
        "hiragana": "ほんはいちどにごさつまで、にしゅうかんかりられます。へんきゃくぽすともございます。",
        "romaji": "Hon wa ichido ni go-satsu made, ni-shuukan kariraremasu. Henkyaku posuto mo gozaimasu.",
        "en": "You can borrow up to 5 books at a time for 2 weeks. We also have a return drop box.",
        "sceneIndex": 1,
        "timeOffsetSec": 12,
        "durationSec": 5
      },
      {
        "id": "d_lib4",
        "speaker": "学生 (Student)",
        "speakerRole": "student",
        "voiceGender": "male",
        "text": "わかりました！こちらの歴史の本を3冊借ります。",
        "hiragana": "わかりました！こちらのれきしのほんをさんさつかります。",
        "romaji": "Wakarimashita! Kochira no rekishi no hon o san-satsu karimasu.",
        "en": "Understood! I will borrow these 3 history books.",
        "sceneIndex": 1,
        "timeOffsetSec": 18,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_gakuseishou",
        "word": "学生証",
        "reading": "がくせいしょう",
        "romaji": "gakuseishou",
        "meaning": "student identification card",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "学生証を見せてください。",
        "exampleSentenceEn": "Please show your student ID."
      },
      {
        "id": "w_henkyaku",
        "word": "返却",
        "reading": "へんきゃく",
        "romaji": "henkyaku",
        "meaning": "return of borrowed item",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "本を返却ポストに入れます。",
        "exampleSentenceEn": "I put the books in the return post."
      }
    ],
    "examQuestions": [
      {
        "id": "q_lib_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "本は何冊まで、何週間借りることができますか。",
        "instructionEn": "How many books and for how many weeks can you borrow?",
        "questionJa": "貸出のルールはどれですか。",
        "questionEn": "Which is the correct lending rule?",
        "options": [
          {
            "id": 1,
            "textJa": "5冊まで、2週間",
            "textEn": "Up to 5 books, for 2 weeks"
          },
          {
            "id": 2,
            "textJa": "3冊まで、1週間",
            "textEn": "Up to 3 books, for 1 week"
          },
          {
            "id": 3,
            "textJa": "10冊まで、1ヶ月",
            "textEn": "Up to 10 books, for 1 month"
          },
          {
            "id": 4,
            "textJa": "無制限",
            "textEn": "Unlimited"
          }
        ],
        "correctIndex": 0,
        "explanation": "司書は「本は一度に5冊まで、2週間借りられます」と説明しました。"
      }
    ]
  },
  {
    "id": "n4_phone_reservation",
    "level": "N4",
    "category": "Daily Services",
    "titleJa": "美容院の電話予約",
    "titleEn": "Reserving Hair Salon by Phone",
    "descriptionJa": "電話での日程調整：土曜日のカット予約と担当美容師の指名！",
    "descriptionEn": "Phone scheduling: booking Saturday haircut and requesting stylist by name!",
    "durationSeconds": 22,
    "audioSpeechRate": 0.85,
    "storyboard": [
      {
        "id": "scene_res_1",
        "order": 1,
        "title": "Making Call",
        "description": "Customer calls to reserve a haircut slot.",
        "sceneTheme": "phone",
        "captionJa": "土曜日の午後2時にカットの予約をお願いします。",
        "captionEn": "Requesting a Saturday 2:00 PM appointment."
      },
      {
        "id": "scene_res_2",
        "order": 2,
        "title": "Stylist & Confirmation",
        "description": "Confirming name, phone number, and stylist.",
        "sceneTheme": "phone",
        "captionJa": "担当美容師と電話番号を確認して予約完了です。",
        "captionEn": "Confirming stylist and phone number to complete booking."
      }
    ],
    "dialogue": [
      {
        "id": "d_pr1",
        "speaker": "美容院 (Salon)",
        "speakerRole": "reception",
        "voiceGender": "female",
        "text": "お電話ありがとうございます。ヘアサロン東京です。",
        "hiragana": "おでんわありがとうございます。へあさろんとうきょうです。",
        "romaji": "O-denwa arigatou gozaimasu. Hea Saron Toukyou desu.",
        "en": "Thank you for calling. Hair Salon Tokyo.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 4
      },
      {
        "id": "d_pr2",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "今週の土曜日の午後2時に、カットの予約をしたいのですが空いていますか？",
        "hiragana": "こんしゅうのどようびのごごにじに、かっとのよやくをしたいのですがあいていますか？",
        "romaji": "Konshuu no doyoubi no gogo ni-ji ni, katto no yoyaku o shitai no desu ga aite imasu ka?",
        "en": "I would like to book a cut this Saturday at 2:00 PM, is that available?",
        "sceneIndex": 0,
        "timeOffsetSec": 5,
        "durationSec": 5
      },
      {
        "id": "d_pr3",
        "speaker": "美容院 (Salon)",
        "speakerRole": "reception",
        "voiceGender": "female",
        "text": "はい、2時でしたらご案内可能です。担当者のご指名はございますか？",
        "hiragana": "はい、にじでしたらごあんないかのうです。たんとうしゃのごしめいはございますか？",
        "romaji": "Hai, ni-ji deshitara go-annai kanou desu. Tantousha no go-shimei wa gozaimasu ka?",
        "en": "Yes, 2 o clock is open. Do you have a preferred stylist?",
        "sceneIndex": 1,
        "timeOffsetSec": 11,
        "durationSec": 5
      },
      {
        "id": "d_pr4",
        "speaker": "客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "特に指名はありません。よろしくお願いします。",
        "hiragana": "とくにしめいはありません。よろしくおねがいします。",
        "romaji": "Toku ni shimei wa arimasen. Yoroshiku onegaishimasu.",
        "en": "No specific preference. Thank you very much.",
        "sceneIndex": 1,
        "timeOffsetSec": 17,
        "durationSec": 4
      }
    ],
    "vocabulary": [
      {
        "id": "w_shimei",
        "word": "指名",
        "reading": "しめい",
        "romaji": "shimei",
        "meaning": "nomination / designating a preferred person",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "美容師を指名します。",
        "exampleSentenceEn": "I designate my stylist."
      },
      {
        "id": "w_annai",
        "word": "案内可能",
        "reading": "あんないかのう",
        "romaji": "annai kanou",
        "meaning": "available to accommodate / seat",
        "partOfSpeech": "noun / na-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "2時からご案内可能です。",
        "exampleSentenceEn": "We can accommodate from 2 o clock."
      }
    ],
    "examQuestions": [
      {
        "id": "q_pr_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "客は何曜日の何時に予約を取りましたか。",
        "instructionEn": "For what day and time did the customer make a reservation?",
        "questionJa": "予約日時はどれですか。",
        "questionEn": "Which is the booking day and time?",
        "options": [
          {
            "id": 1,
            "textJa": "土曜日の午後2時",
            "textEn": "Saturday at 2:00 PM"
          },
          {
            "id": 2,
            "textJa": "日曜日の午前10時",
            "textEn": "Sunday at 10:00 AM"
          },
          {
            "id": 3,
            "textJa": "金曜日の夕方4時",
            "textEn": "Friday at 4:00 PM"
          },
          {
            "id": 4,
            "textJa": "土曜日の朝9時",
            "textEn": "Saturday at 9:00 AM"
          }
        ],
        "correctIndex": 0,
        "explanation": "客は「今週の土曜日の午後2時に、カットの予約をしたい」と依頼し、案内可能と確認されました。"
      }
    ]
  },
  {
    "id": "n3_travel_agency",
    "level": "N3",
    "category": "Travel & Planning",
    "titleJa": "旅行代理店でのツアー相談",
    "titleEn": "Travel Agency Tour Consultation",
    "descriptionJa": "京都旅行の相談：新幹線指定席、夕食付き旅館、キャンセル規定の確認！",
    "descriptionEn": "Kyoto travel package: shinkansen reserved seats, dinner-included ryokan, and cancellation rules!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.88,
    "storyboard": [
      {
        "id": "scene_ta_1",
        "order": 1,
        "title": "Counter Consultation",
        "description": "Customer asks about 2-night Kyoto autumn foliage package.",
        "sceneTheme": "hotel",
        "captionJa": "紅葉シーズンの京都2泊3日プランを相談します。",
        "captionEn": "Consulting on a 3-day Kyoto autumn foliage tour."
      },
      {
        "id": "scene_ta_2",
        "order": 2,
        "title": "Itinerary & Cancellation",
        "description": "Travel agent explains reservation deadlines and cancellation fees.",
        "sceneTheme": "hotel",
        "captionJa": "新幹線の指定席とキャンセル料の規定を確認します。",
        "captionEn": "Reviewing shinkansen seat options and cancellation policies."
      }
    ],
    "dialogue": [
      {
        "id": "d_ta1",
        "speaker": "社員 (Agent)",
        "speakerRole": "agent",
        "voiceGender": "female",
        "text": "京都2泊3日の紅葉ツアーですね。11月の中旬は大変人気がございます。",
        "hiragana": "きょうとにはくみっかのこうようつあーですね。じゅういちがつのちゅうじゅんはたいへんにんきがございます。",
        "romaji": "Kyouto ni-haku mikka no kouyou tsuaa desu ne. Juu-ichi-gatsu no chuujun wa taihen ninki ga gozaimasu.",
        "en": "A 3-day 2-night Kyoto autumn foliage tour. Mid-November is extremely popular.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "d_ta2",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "新幹線はのぞみの指定席で、夕食は京懐石が付いているプランを希望しています。",
        "hiragana": "しんかんせんはのぞみのしていせきで、ゆうしょくはきょうかいせきがついているぷらんをきぼうしています。",
        "romaji": "Shinkansen wa Nozomi no shiteiseki de, yuushoku wa Kyou-kaiseki ga tsuite iru puran o kibou shite imasu.",
        "en": "We want reserved seats on Nozomi shinkansen and dinner included with Kyoto Kaiseki.",
        "sceneIndex": 0,
        "timeOffsetSec": 6,
        "durationSec": 6
      },
      {
        "id": "d_ta3",
        "speaker": "社員 (Agent)",
        "speakerRole": "agent",
        "voiceGender": "female",
        "text": "嵐山近くの老舗旅館に空きがございます。お一人様4万8千円となります。",
        "hiragana": "あらしやまのちかくのしにせりょかんにあきがございます。おひとりさまよんまんはっせんえんとなります。",
        "romaji": "Arashiyama no chikaku no shinise ryokan ni aki ga gozaimasu. O-hitori-sama yon-man hassen-en to narimasu.",
        "en": "We have availability at an established ryokan near Arashiyama for 48,000 yen per person.",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 5
      },
      {
        "id": "d_ta4",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "出発の2週間前まででしたら、キャンセル料はかかりませんか？",
        "hiragana": "しゅっぱつのにしゅうかんまえまででしたら、きゃんせるりょうはかかりませんか？",
        "romaji": "Shuppatsu no ni-shuukan-mae made deshitara, kyanseru-ryou wa kakarimasen ka?",
        "en": "If cancelled up to 2 weeks prior to departure, is there no cancellation fee?",
        "sceneIndex": 1,
        "timeOffsetSec": 19,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_kouyou",
        "word": "紅葉",
        "reading": "こうよう",
        "romaji": "kouyou",
        "meaning": "autumn foliage / colorful leaves",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "秋に京都の紅葉を見に行きます。",
        "exampleSentenceEn": "I go to see autumn foliage in Kyoto in fall."
      },
      {
        "id": "w_shiteiseki",
        "word": "指定席",
        "reading": "していせき",
        "romaji": "shiteiseki",
        "meaning": "reserved seat",
        "partOfSpeech": "noun",
        "pitchAccent": "② 頭高 (Atamadaka)",
        "exampleSentenceJa": "新幹線の指定席を予約しました。",
        "exampleSentenceEn": "I booked a reserved seat on the shinkansen."
      }
    ],
    "examQuestions": [
      {
        "id": "q_ta_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "顧客が希望した旅館の夕食はどれですか。",
        "instructionEn": "What style of dinner did the customer request?",
        "questionJa": "希望する夕食の内容はどれですか。",
        "questionEn": "Which dinner option did he specify?",
        "options": [
          {
            "id": 1,
            "textJa": "京懐石 (伝統料理)",
            "textEn": "Kyoto Kaiseki traditional multi-course"
          },
          {
            "id": 2,
            "textJa": "バイキング形式",
            "textEn": "Buffet format"
          },
          {
            "id": 3,
            "textJa": "夕食なし (素泊まり)",
            "textEn": "No dinner"
          },
          {
            "id": 4,
            "textJa": "西洋風フレンチ",
            "textEn": "Western French cuisine"
          }
        ],
        "correctIndex": 0,
        "explanation": "顧客は「夕食は京懐石が付いているプランを希望しています」と明言しました。"
      }
    ]
  },
  {
    "id": "n3_customer_complaint",
    "level": "N3",
    "category": "Business & Support",
    "titleJa": "お客様相談室への問い合わせ",
    "titleEn": "Customer Support Product Inquiry",
    "descriptionJa": "家電製品の初期不良：保証書の確認、無償交換手続き、集荷の手配！",
    "descriptionEn": "Appliance defect support: warranty check, free replacement, and parcel pickup!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.88,
    "storyboard": [
      {
        "id": "scene_cs_1",
        "order": 1,
        "title": "Explaining Issue",
        "description": "Customer describes electric kettle not heating water.",
        "sceneTheme": "phone",
        "captionJa": "購入した電気ケトルの電源が入らない症状を伝えます。",
        "captionEn": "Describing electric kettle power and heating malfunction."
      },
      {
        "id": "scene_cs_2",
        "order": 2,
        "title": "Replacement & Pickup",
        "description": "Support rep arranges courier pickup and replacement item.",
        "sceneTheme": "phone",
        "captionJa": "保証期間内のため、翌日に新品とお取替えします。",
        "captionEn": "Under warranty, arranging next-day delivery of replacement."
      }
    ],
    "dialogue": [
      {
        "id": "d_cs1",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "先週購入した電気ケトルなんですが、お湯が沸かなくなってしまいました。",
        "hiragana": "せんしゅうこうにゅうしたでんきけとるなんですが、おゆがわかなくなってしまいました。",
        "romaji": "Senshuu kounyuu shita denki ketoru nan desu ga, o-yu ga wakanaku natte shimaimashita.",
        "en": "Regarding the electric kettle I bought last week, it no longer boils water.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 5
      },
      {
        "id": "d_cs2",
        "speaker": "担当者 (Support)",
        "speakerRole": "support",
        "voiceGender": "female",
        "text": "大変ご不便をおかけしております。お手元にレシートや保証書はお持ちでしょうか？",
        "hiragana": "たいへんごふべんをおかけしております。おてもとにれしーとやほしょうしょはおもちでしょうか？",
        "romaji": "Taihen go-fuben o o-kake shite orimasu. O-temoto ni reshiito ya hoshousho wa o-mochi deshou ka?",
        "en": "We sincerely apologize for the inconvenience. Do you have the receipt and warranty with you?",
        "sceneIndex": 0,
        "timeOffsetSec": 6,
        "durationSec": 6
      },
      {
        "id": "d_cs3",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "male",
        "text": "はい、メーカー保証1年の保証書とレシートの両方が手元にあります。",
        "hiragana": "はい、めーかーほしょういちねんのほしょうしょとれしーとのりょうほうがおてもとにあります。",
        "romaji": "Hai, meekaa hoshou ichi-nen no hoshousho to reshiito no ryouhou ga temoto ni arimasu.",
        "en": "Yes, I have both the 1-year manufacturer warranty and the receipt.",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 5
      },
      {
        "id": "d_cs4",
        "speaker": "担当者 (Support)",
        "speakerRole": "support",
        "voiceGender": "female",
        "text": "かしこまりました。明日宅配業者が新品をお届けし、同時に不具合品を回収いたします。",
        "hiragana": "かしこまりました。あすたくはいぎょうしゃがしんぴんをおとどけし、どうじにふぐあいひんをかいしゅういたします。",
        "romaji": "Kashikomarimashita. Asu takuhai gyousha ga shinpin o o-todoke shi, douji ni fuguai-hin o kaishuu itashimasu.",
        "en": "Understood. Tomorrow a courier will deliver a brand new unit and collect the defective one.",
        "sceneIndex": 1,
        "timeOffsetSec": 19,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_fuben",
        "word": "ご不便",
        "reading": "ごふべん",
        "romaji": "go-fuben",
        "meaning": "inconvenience (polite)",
        "partOfSpeech": "noun / na-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "ご不便をおかけして申し訳ありません。",
        "exampleSentenceEn": "I apologize for causing inconvenience."
      },
      {
        "id": "w_kaishuu",
        "word": "回収",
        "reading": "かいしゅう",
        "romaji": "kaishuu",
        "meaning": "collection / retrieval",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "不具合品を回収します。",
        "exampleSentenceEn": "We will collect the defective product."
      }
    ],
    "examQuestions": [
      {
        "id": "q_cs_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "サポート担当者は明日どのように対応しますか。",
        "instructionEn": "How will the support representative resolve the issue tomorrow?",
        "questionJa": "明日の対応内容はどれですか。",
        "questionEn": "Which is the promised support response?",
        "options": [
          {
            "id": 1,
            "textJa": "新品をお届けし、不具合品を回収する",
            "textEn": "Deliver a new unit and collect defective item"
          },
          {
            "id": 2,
            "textJa": "店舗まで持って来てもらう",
            "textEn": "Have customer bring it to store"
          },
          {
            "id": 3,
            "textJa": "全額返金のみを行う",
            "textEn": "Only provide full refund"
          },
          {
            "id": 4,
            "textJa": "修理代金を請求する",
            "textEn": "Charge repair fee"
          }
        ],
        "correctIndex": 0,
        "explanation": "担当者は「明日宅配業者が新品をお届けし、同時に不具合品を回収いたします」と案内しました。"
      }
    ]
  },
  {
    "id": "n2_business_negotiation",
    "level": "N2",
    "category": "Business & Negotiation",
    "titleJa": "取引先との価格交渉",
    "titleEn": "B2B Price & Volume Negotiation",
    "descriptionJa": "発注数量増に伴う単価引き下げと、初回納品前倒しの折衝！",
    "descriptionEn": "Volume discount negotiation, bulk order commitment, and payment terms!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.92,
    "storyboard": [
      {
        "id": "scene_bn_1",
        "order": 1,
        "title": "Opening Proposal",
        "description": "Buyer proposes an 8% unit discount in exchange for annual commit.",
        "sceneTheme": "office",
        "captionJa": "年間発注数を増やし、単価8%引き下げを打診します。",
        "captionEn": "Proposing an 8% discount in return for larger annual orders."
      },
      {
        "id": "scene_bn_2",
        "order": 2,
        "title": "Counter Compromise",
        "description": "Supplier agrees to 5% with payment terms adjustment.",
        "sceneTheme": "office",
        "captionJa": "原材料費高騰を踏まえ、5%引き下げで合意を目指します。",
        "captionEn": "Counter-offering 5% discount due to raw material costs."
      }
    ],
    "dialogue": [
      {
        "id": "d_bn1",
        "speaker": "購買部長 (Buyer)",
        "speakerRole": "buyer",
        "voiceGender": "male",
        "text": "年間発注数を現行の3割増にする条件で、単価を8%引き下げていただくことは可能でしょうか。",
        "hiragana": "ねんかんはっちゅうすうをげんこうのさんわりましにするじょうけんで、たんかをはちぱーせんとひきさげていただくことはかのうでしょうか。",
        "romaji": "Nenkan hacchuu-suu o genkou no san-wari-mashi ni suru jouken de, tanka o hachi-paasento hikisagete itadaku koto wa kanou deshou ka.",
        "en": "Would it be possible to reduce the unit price by 8% on the condition of a 30% increase in annual order volume?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 6
      },
      {
        "id": "d_bn2",
        "speaker": "営業課長 (Supplier)",
        "speakerRole": "supplier",
        "voiceGender": "female",
        "text": "魅力的なご提案ですが、昨今の原材料費高騰を鑑みますと、8%は極めて厳しい数字です。",
        "hiragana": "みりょくてきなごていあんですが、さっこんのげんざいりょうひこうとうをかんがみますと、はちぱーせんとはきわめてきびしいすうじです。",
        "romaji": "Miryokuteki na go-teian desu ga, sakkon no genzairyou-hi koutou o kangamimasu to, hachi-paasento wa kiwamete kibishii suuji desu.",
        "en": "That is an attractive proposal, but considering recent surges in raw material costs, 8% is extremely stringent.",
        "sceneIndex": 0,
        "timeOffsetSec": 7,
        "durationSec": 6
      },
      {
        "id": "d_bn3",
        "speaker": "営業課長 (Supplier)",
        "speakerRole": "supplier",
        "voiceGender": "female",
        "text": "そこで折衷案として、単価5%の値下げに加え、初回納品を前倒しする形ではいかがでしょうか。",
        "hiragana": "そこでせっちゅうあんとして、たんかごぱーせんとのねさげにくわえ、しょかいのうひんをまえだおしするかたちではいかがでしょうか。",
        "romaji": "Sokode secchuu-an to shite, tanka go-paasento no nesage ni kuwae, shokai nouhin o maedaoshi suru katachi de wa ikaga deshou ka.",
        "en": "As a compromise, how about a 5% unit discount combined with expediting the initial delivery date?",
        "sceneIndex": 1,
        "timeOffsetSec": 14,
        "durationSec": 6
      },
      {
        "id": "d_bn4",
        "speaker": "購買部長 (Buyer)",
        "speakerRole": "buyer",
        "voiceGender": "male",
        "text": "なるほど。納期前倒しであれば社内決裁を通しやすいです。持ち帰って前向きに検討します。",
        "hiragana": "なるほど。のうきまえだおしであればしゃないけっさいをとおしやすいです。もちかえってまえむきにけんとうします。",
        "romaji": "Naruhodo. Nouki maedaoshi de areba shanai kessai o tooshi yasui desu. Mochikaette maemuki ni kentou shimasu.",
        "en": "I see. With expedited delivery, internal executive approval will be easier. I will take it back for favorable review.",
        "sceneIndex": 1,
        "timeOffsetSec": 21,
        "durationSec": 6
      }
    ],
    "vocabulary": [
      {
        "id": "w_secchuuan",
        "word": "折衷案",
        "reading": "せっちゅうあん",
        "romaji": "secchuu-an",
        "meaning": "compromise / middle ground proposal",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "双方の折衷案を提示します。",
        "exampleSentenceEn": "We present a compromise proposal for both sides."
      },
      {
        "id": "w_maedaoshi",
        "word": "前倒し",
        "reading": "まえだおし",
        "romaji": "maedaoshi",
        "meaning": "moving schedule forward",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "納品スケジュールを前倒しします。",
        "exampleSentenceEn": "We will move the delivery schedule forward."
      }
    ],
    "examQuestions": [
      {
        "id": "q_bn_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "営業課長が提示した折衷案の内容は何ですか。",
        "instructionEn": "What was the compromise proposal offered by the sales manager?",
        "questionJa": "折衷案の内容はどれですか。",
        "questionEn": "Which is the core compromise content?",
        "options": [
          {
            "id": 1,
            "textJa": "単価5%値下げと初回納品の前倒し",
            "textEn": "5% price discount and expedited initial delivery"
          },
          {
            "id": 2,
            "textJa": "単価8%値下げの即時承認",
            "textEn": "Immediate approval of 8% discount"
          },
          {
            "id": 3,
            "textJa": "価格据え置きでの発注キャンセル",
            "textEn": "Keeping price unchanged"
          },
          {
            "id": 4,
            "textJa": "全額前払いへの変更",
            "textEn": "Switching to full upfront payment"
          }
        ],
        "correctIndex": 0,
        "explanation": "営業課長は「単価5%の値下げに加え、初回納品を前倒しする形」を折衷案として提示しました。"
      }
    ]
  },
  {
    "id": "n1_policy_debate",
    "level": "N1",
    "category": "Public Policy & Economics",
    "titleJa": "社会保障制度改革の政策討論",
    "titleEn": "Policy Debate on Demographic Shift",
    "descriptionJa": "少子高齢化における年金財政の持続可能性と、世代間格差の是正論争！",
    "descriptionEn": "Debate on pension fiscal sustainability, retirement age adjustments, and intergenerational equity!",
    "durationSeconds": 26,
    "audioSpeechRate": 0.95,
    "storyboard": [
      {
        "id": "scene_pd_1",
        "order": 1,
        "title": "Keynote Thesis",
        "description": "Economist argues for demographic indexing of pension payouts.",
        "sceneTheme": "symposium",
        "captionJa": "マクロ経済スライドによる給付水準の自動調整を主張します。",
        "captionEn": "Arguing for automatic adjustment of pension payout indexing."
      },
      {
        "id": "scene_pd_2",
        "order": 2,
        "title": "Intergenerational Equity",
        "description": "Discussing intergenerational fairness and active senior employment.",
        "sceneTheme": "symposium",
        "captionJa": "現役世代の負担軽減と高齢者の就労支援について討論します。",
        "captionEn": "Debating worker burden reduction alongside active senior labor."
      }
    ],
    "dialogue": [
      {
        "id": "d_pd1",
        "speaker": "経済学者 (Economist)",
        "speakerRole": "expert",
        "voiceGender": "male",
        "text": "人口動態の不可逆的な構造変化を踏まえますと、年金給付水準の抑制はもはや不可避の局面に達しております。",
        "hiragana": "じんこうどうたいのふかぎゃくてきなこうぞうへんかをふまえますと、ねんきんきゅうふすいじゅんのよくせいはもはやふかひのきょくめんにたっしております。",
        "romaji": "Jinkou doutai no fukagyakuteki na kouzou henka o fumaemasu to, nenkin kyuufu suijun no yokusei wa mohaya fukahi no kyokumen ni tasshite orimasu.",
        "en": "Given irreversible structural shifts in demographics, capping pension payout levels has reached an unavoidable juncture.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 8
      },
      {
        "id": "d_pd2",
        "speaker": "政策委員 (Policy Member)",
        "speakerRole": "official",
        "voiceGender": "female",
        "text": "しかしながら、単なる給付削減は高齢世帯の貧困リスクを助長しかねず、包括的なセーフティネットの拡充と連動すべきです。",
        "hiragana": "しかしながら、たんなるきゅうふさくげんはこうれいせたいのひんこんりすくをじょちょうしかねず、ほうかつてきなせーふてぃねっとのかくじゅうとれんどうすべきです。",
        "romaji": "Shikashinagara, tannaru kyuufu sakugen wa kourei setai no hinkon risuku o jochou shi kanezu, houkatsuteki na seefutii netto no kakujuu to rendou subeki desu.",
        "en": "However, mere payout reduction risks exacerbating poverty among elderly households and must be linked to broader safety nets.",
        "sceneIndex": 1,
        "timeOffsetSec": 9,
        "durationSec": 8
      },
      {
        "id": "d_pd3",
        "speaker": "経済学者 (Economist)",
        "speakerRole": "expert",
        "voiceGender": "male",
        "text": "仰る通りです。従って定年延長とリスキリング支援を同時並行で推進し、支え手を増やす労働市場改革が肝要となります。",
        "hiragana": "おっしゃるとおりです。したがってていねんえんちょうとりすきりんぐしえんをどうじへいこうですいしんし、ささえてをふやすろうどうしじょうかいかくがかんようとなります。",
        "romaji": "Ossharu toori desu. Shitagatte teinen enchou to risukiringu shien o douji heikou de suishin shi, sasaete o fuyasu roudou shijou kaikaku ga kanyou to narimasu.",
        "en": "Precisely. Therefore, promoting retirement age extensions and reskilling concurrently to expand contributors is crucial.",
        "sceneIndex": 1,
        "timeOffsetSec": 18,
        "durationSec": 8
      }
    ],
    "vocabulary": [
      {
        "id": "w_fukagyaku",
        "word": "不可逆的",
        "reading": "ふかぎゃくてき",
        "romaji": "fukagyakuteki",
        "meaning": "irreversible / unable to be undone",
        "partOfSpeech": "na-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "少子高齢化は不可逆的な社会変化です。",
        "exampleSentenceEn": "Aging demographics is an irreversible social shift."
      },
      {
        "id": "w_kanyou",
        "word": "肝要",
        "reading": "かんよう",
        "romaji": "kanyou",
        "meaning": "essential / of vital importance",
        "partOfSpeech": "na-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "多角的な視野を持つことが肝要です。",
        "exampleSentenceEn": "Having a multi-faceted perspective is essential."
      }
    ],
    "examQuestions": [
      {
        "id": "q_pd_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "経済学者が最終的に提案している解決策の柱はどれですか。",
        "instructionEn": "What is the core pillar of the solution ultimately proposed by the economist?",
        "questionJa": "経済学者の提案する改革方針はどれですか。",
        "questionEn": "Which is the proposed reform strategy?",
        "options": [
          {
            "id": 1,
            "textJa": "定年延長とリスキリングによる労働市場改革",
            "textEn": "Labor market reform via retirement extensions and reskilling"
          },
          {
            "id": 2,
            "textJa": "年金支給額の即時一律50%カット",
            "textEn": "Immediate flat 50% cut in pension payouts"
          },
          {
            "id": 3,
            "textJa": "現役世代への増税のみに依存する方策",
            "textEn": "Sole reliance on tax hikes"
          },
          {
            "id": 4,
            "textJa": "公的年金制度の完全な民営化廃止",
            "textEn": "Complete privatization of pension"
          }
        ],
        "correctIndex": 0,
        "explanation": "登壇者は「定年延長とリスキリング支援を同時並行で推進し、支え手を増やす労働市場改革が肝要」と結んでいます。"
      }
    ]
  },
  {
    "id": "n3_news_weather_report",
    "level": "N3",
    "category": "Media & Society",
    "titleJa": "ニュースの気象情報と台風接近",
    "titleEn": "Weather Broadcast & Typhoon Alert",
    "descriptionJa": "大型台風14号の接近：暴風警報、新幹線や在来線の計画運休情報の聞き取り！",
    "descriptionEn": "Typhoon approaching Kanto: storm warnings, planned shinkansen and train suspensions!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.9,
    "storyboard": [
      {
        "id": "scene_nw_1",
        "order": 1,
        "title": "Weather Studio",
        "description": "Newscaster warns of typhoon landfall and heavy rain.",
        "sceneTheme": "symposium",
        "captionJa": "台風14号の予想進路と警戒情報を伝えます。",
        "captionEn": "Broadcasting projected path of Typhoon 14."
      },
      {
        "id": "scene_nw_2",
        "order": 2,
        "title": "Transit Suspension",
        "description": "Explaining planned train stoppages from 6 PM.",
        "sceneTheme": "train_station",
        "captionJa": "夕方6時以降の計画運休と帰宅の呼びかけ。",
        "captionEn": "Planned train service suspensions starting at 6:00 PM."
      }
    ],
    "dialogue": [
      {
        "id": "d_nw1",
        "speaker": "アナウンサー (Anchor)",
        "speakerRole": "reporter",
        "voiceGender": "female",
        "text": "大型で非常に強い台風14号は、今夜遅くに関東地方へ最接近する見込みです。",
        "hiragana": "おおがたでひじょうにつよいたいふうじゅうよんごうは、こんやおそくにかんとうちほうへさいせっきんするみこみです。",
        "romaji": "Oogata de hijou ni tsuyoi taifuu juu-yon-gou wa, konya osoku ni Kantou chihou e sai-sekkin suru mikomi desu.",
        "en": "A large and very strong Typhoon No. 14 is expected to make closest approach to Kanto late tonight.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 6
      },
      {
        "id": "d_nw2",
        "speaker": "気象予報士 (Meteorologist)",
        "speakerRole": "expert",
        "voiceGender": "male",
        "text": "沿岸部では猛烈な突風と土砂災害に厳重な警戒が必要です。不要不急の外出はお控えください。",
        "hiragana": "えんがんぶではもうれつなとっぷうとどしゃさいがいにげんじゅうなけいかいがひつようです。ふようふきゅうのがいしゅつはおひかえください。",
        "romaji": "Enganbu de wa mouretsu na toppuu to dosha saigai ni genjuu na keikai ga hitsuyou desu. Fuyou-fukyuu no gaishutsu wa o-hikae kudasai.",
        "en": "Strict vigilance against fierce wind gusts and landslides is required along coastal areas. Refrain from non-essential outings.",
        "sceneIndex": 0,
        "timeOffsetSec": 7,
        "durationSec": 6
      },
      {
        "id": "d_nw3",
        "speaker": "アナウンサー (Anchor)",
        "speakerRole": "reporter",
        "voiceGender": "female",
        "text": "JR各線は本日午後6時より、首都圏の全路線で計画運休を実施すると発表しました。",
        "hiragana": "じぇいあーるかくせんはほんじつごごろくじより、しゅとけんのぜんろせんでけいかくうんきゅうをじっしするとはっぴょうしました。",
        "romaji": "Jei-aaru kaku-sen wa honjitsu gogo roku-ji yori, shutoken no zen-rosen de keikaku unkyuu o jisshi suru to happyou shimashita.",
        "en": "JR announced that all lines in the Tokyo metropolitan area will implement planned service suspensions starting at 6:00 PM today.",
        "sceneIndex": 1,
        "timeOffsetSec": 14,
        "durationSec": 6
      },
      {
        "id": "d_nw4",
        "speaker": "アナウンサー (Anchor)",
        "speakerRole": "reporter",
        "voiceGender": "female",
        "text": "お勤め先や学校からの早めの帰宅を強く呼びかけています。最新情報にご注意ください。",
        "hiragana": "おつとめさきやがっこうからのはやめのきたくをつよくよびかけています。さいしんじょうほうにごちゅういください。",
        "romaji": "O-tsutomesaki ya gakkou kara no hayame no kitaku o tsuyoku yobikakete imasu. Saishin jouhou ni go-chuui kudasai.",
        "en": "Citizens are strongly urged to return home early from work and schools. Please stay tuned for updates.",
        "sceneIndex": 1,
        "timeOffsetSec": 21,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_keikaku_unkyuu",
        "word": "計画運休",
        "reading": "けいかくうんきゅう",
        "romaji": "keikaku unkyuu",
        "meaning": "planned suspension of transit operations",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "台風のため計画運休が行われます。",
        "exampleSentenceEn": "Planned train suspension will take place due to typhoon."
      },
      {
        "id": "w_fuyou_fukyuu",
        "word": "不要不急",
        "reading": "ふようふきゅう",
        "romaji": "fuyou fukyuu",
        "meaning": "non-urgent and unnecessary",
        "partOfSpeech": "noun / no-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "不要不急の外出を控えてください。",
        "exampleSentenceEn": "Please refrain from non-essential outings."
      }
    ],
    "examQuestions": [
      {
        "id": "q_nw_1",
        "mondaiType": 1,
        "mondaiLabel": "第1部分: 課題理解 (Task Comprehension)",
        "instructionJa": "首都圏の電車は何時から計画運休を始めますか。",
        "instructionEn": "At what time do the planned train suspensions begin?",
        "questionJa": "運休開始時間はどれですか。",
        "questionEn": "Which is the suspension start time?",
        "options": [
          {
            "id": 1,
            "textJa": "本日午後6時より",
            "textEn": "From 6:00 PM today"
          },
          {
            "id": 2,
            "textJa": "明日朝の始発より",
            "textEn": "From tomorrow first train"
          },
          {
            "id": 3,
            "textJa": "正午12時より",
            "textEn": "From 12:00 noon"
          },
          {
            "id": 4,
            "textJa": "運休の予定はない",
            "textEn": "No suspension planned"
          }
        ],
        "correctIndex": 0,
        "explanation": "アナウンサーは「本日午後6時より、首都圏の全路線で計画運休を実施する」と報じました。"
      }
    ]
  },
  {
    "id": "n3_apartment_hunting",
    "level": "N3",
    "category": "Housing & Daily Life",
    "titleJa": "不動産屋で部屋探し",
    "titleEn": "Apartment Hunting",
    "descriptionJa": "賃貸マンションの条件：家賃8万円以内、駅徒歩10分以内、2階以上！",
    "descriptionEn": "Apartment rental search: budget under 80,000 yen, 10 minutes to station, 2nd floor or higher!",
    "durationSeconds": 23,
    "audioSpeechRate": 0.88,
    "storyboard": [
      {
        "id": "scene_ap_1",
        "order": 1,
        "title": "Listing Conditions",
        "description": "Customer shares apartment rental budget and parameters.",
        "sceneTheme": "office",
        "captionJa": "駅徒歩10分、家賃8万円以内の1Kを探します。",
        "captionEn": "Searching for a 1K apartment under 80,000 yen near station."
      },
      {
        "id": "scene_ap_2",
        "order": 2,
        "title": "Property Tour",
        "description": "Agent introduces apartment with auto-lock and south-facing balcony.",
        "sceneTheme": "office",
        "captionJa": "オートロック付きの南向き物件をご案内します。",
        "captionEn": "Recommending south-facing flat with auto-lock security."
      }
    ],
    "dialogue": [
      {
        "id": "d_ap1",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "駅から歩いて10分以内で、管理費込みで家賃8万円以内の部屋はありますか？",
        "hiragana": "えきからあるいてじゅっぷんいないで、かんりひこみでやちんはちまんえんいないのへやはありますか？",
        "romaji": "Eki kara aruite juppun inai de, kanrihi komi de yachin hachi-man-en inai no heya wa arimasu ka?",
        "en": "Do you have an apartment within a 10-minute walk from the station, under 80,000 yen including fees?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 6
      },
      {
        "id": "d_ap2",
        "speaker": "担当者 (Agent)",
        "speakerRole": "agent",
        "voiceGender": "male",
        "text": "はい、こちらの物件は徒歩7分で、オートロック付きの2階角部屋です。",
        "hiragana": "はい、こちらのぶっけんはとほななふんで、おーとろっくつきのにかいかどべやです。",
        "romaji": "Hai, kochira no bukken wa toho nana-fun de, ooto-rokku tsuki no ni-kai kado-beya desu.",
        "en": "Yes, this property is a 7-minute walk, a 2nd-floor corner room with auto-lock security.",
        "sceneIndex": 0,
        "timeOffsetSec": 7,
        "durationSec": 5
      },
      {
        "id": "d_ap3",
        "speaker": "顧客 (Customer)",
        "speakerRole": "customer",
        "voiceGender": "female",
        "text": "いいですね！日当たりはどうですか？洗濯機を室内に置けますか？",
        "hiragana": "いいですね！ひあたりはどうですか？せんたくきをしつ内におけますか？",
        "romaji": "Ii desu ne! Hiatari wa dou desu ka? Sentakuki o shitsunai ni okemasu ka?",
        "en": "Sounds good! How is natural sunlight? Can the washing machine be placed indoors?",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 5
      },
      {
        "id": "d_ap4",
        "speaker": "担当者 (Agent)",
        "speakerRole": "agent",
        "voiceGender": "male",
        "text": "南向きバルコニーで日当たり抜群です。室内洗濯機置き場も完備されていますよ。",
        "hiragana": "みなみむきばるこにーでひあたりばつぐんです。しつないせんたくきおきばもかんびされていますよ。",
        "romaji": "Minami-muki barukonii de hiatari batsugun desu. Shitsunai sentakuki okiba mo kanbi sarete imasu yo.",
        "en": "South-facing balcony with excellent sunlight. It also features indoor laundry plumbing.",
        "sceneIndex": 1,
        "timeOffsetSec": 19,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_kanrihi",
        "word": "管理費",
        "reading": "かんりひ",
        "romaji": "kanrihi",
        "meaning": "maintenance / building management fee",
        "partOfSpeech": "noun",
        "pitchAccent": "③ 中高 (Nakadaka)",
        "exampleSentenceJa": "管理費込みの家賃です。",
        "exampleSentenceEn": "The rent includes maintenance fees."
      },
      {
        "id": "w_hiatari",
        "word": "日当たり",
        "reading": "ひあたり",
        "romaji": "hiatari",
        "meaning": "exposure to sunlight",
        "partOfSpeech": "noun",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "南向きで日当たりが良いです。",
        "exampleSentenceEn": "It faces south with good sunlight."
      }
    ],
    "examQuestions": [
      {
        "id": "q_ap_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "担当者が紹介した物件の特徴として正しいものはどれですか。",
        "instructionEn": "Which feature correctly describes the introduced apartment?",
        "questionJa": "物件の特徴はどれですか。",
        "questionEn": "Which feature matches the description?",
        "options": [
          {
            "id": 1,
            "textJa": "徒歩7分、オートロック付き南向き角部屋",
            "textEn": "7 min walk, auto-lock, south-facing corner"
          },
          {
            "id": 2,
            "textJa": "徒歩15分、1階北向き",
            "textEn": "15 min walk, 1st floor north-facing"
          },
          {
            "id": 3,
            "textJa": "洗濯機が外置き",
            "textEn": "Washing machine placed outside"
          },
          {
            "id": 4,
            "textJa": "家賃12万円以上",
            "textEn": "Rent over 120,000 yen"
          }
        ],
        "correctIndex": 0,
        "explanation": "物件は「徒歩7分、オートロック付きの2階角部屋、南向きバルコニー」と説明されました。"
      }
    ]
  },
  {
    "id": "n2_hospital_specialist",
    "level": "N2",
    "category": "Health & Medical",
    "titleJa": "専門医による検査結果説明",
    "titleEn": "Specialist Medical Consultation",
    "descriptionJa": "胃カメラ検診結果：軽度の胃炎、ピロリ菌陰性、食生活とストレス管理の助言！",
    "descriptionEn": "Endoscopy findings: mild gastritis, H. pylori negative, dietary and stress management advice!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.92,
    "storyboard": [
      {
        "id": "scene_med_1",
        "order": 1,
        "title": "Endoscopy Findings",
        "description": "Doctor reviews stomach endoscopy imaging with patient.",
        "sceneTheme": "clinic",
        "captionJa": "胃内視鏡画像の所見を詳しく説明します。",
        "captionEn": "Reviewing gastrointestinal endoscopy images."
      },
      {
        "id": "scene_med_2",
        "order": 2,
        "title": "Lifestyle Advice",
        "description": "Doctor prescribes mild gastric mucosal protective medication.",
        "sceneTheme": "clinic",
        "captionJa": "刺激物を控え、生活習慣の改善を指導します。",
        "captionEn": "Advising reduction of spicy foods and alcohol."
      }
    ],
    "dialogue": [
      {
        "id": "d_med1",
        "speaker": "医師 (Doctor)",
        "speakerRole": "doctor",
        "voiceGender": "male",
        "text": "先日受けていただいた胃内視鏡検査の結果ですが、悪性の病変は認められませんでした。",
        "hiragana": "せんじつうけていただいたいないしきょうけんさのけっかですが、あくせいのびょうへんはみとめられませんでした。",
        "romaji": "Senjitsu ukete itadaita i-naishikyou kensa no kekka desu ga, akusei no byouhen wa mitomeraremasen deshita.",
        "en": "Regarding the gastric endoscopy you had the other day, no malignant lesions were observed.",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 6
      },
      {
        "id": "d_med2",
        "speaker": "患者 (Patient)",
        "speakerRole": "patient",
        "voiceGender": "female",
        "text": "良かったです！ただ、時々胃のあたりがキリキリ痛むことがあるのですが。",
        "hiragana": "よかったです！ただ、ときどきいのあたりがきりきりいたむことがあるのですが。",
        "romaji": "Yokatta desu! Tada, tokidoki i no atari ga kirikiri itamu koto ga aru no desu ga.",
        "en": "What a relief! However, I still feel a sharp stinging pain in my stomach occasionally.",
        "sceneIndex": 0,
        "timeOffsetSec": 7,
        "durationSec": 5
      },
      {
        "id": "d_med3",
        "speaker": "医師 (Doctor)",
        "speakerRole": "doctor",
        "voiceGender": "male",
        "text": "胃粘膜の一部に軽度の表層性胃炎が見られます。過度なストレスや刺激物が要因と考えられます。",
        "hiragana": "いねんまくのいちぶにけいどのひょうそうせいいえんがみられます。かどなすとれすやしきぶつがよういんとかんがえられます。",
        "romaji": "I-nenmaku no ichibu ni keido no hyousousei ien ga miraremasu. Kado na sutoresu ya shikibutsu ga youin to kangaeraremasu.",
        "en": "Mild superficial gastritis is present in part of the mucosa, likely induced by stress or irritants.",
        "sceneIndex": 1,
        "timeOffsetSec": 13,
        "durationSec": 6
      },
      {
        "id": "d_med4",
        "speaker": "医師 (Doctor)",
        "speakerRole": "doctor",
        "voiceGender": "male",
        "text": "胃酸を抑えるお薬を2週間分処方しますので、香辛料やアルコールは控えて様子を見てください。",
        "hiragana": "いさんをおさえるおくすりをにしゅうかんぶんしょほうしますので、こうしんりょうやあるこーるはひかえてようすをみてください。",
        "romaji": "Isan o osaeru o-kusuri o ni-shuukan-bun shohou shimasu node, koushinryou ya arukooru wa hikaete yousu o mite kudasai.",
        "en": "I will prescribe 2 weeks of acid-suppressive medication, so please refrain from spices and alcohol and observe.",
        "sceneIndex": 1,
        "timeOffsetSec": 20,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_akusei",
        "word": "悪性",
        "reading": "あくせい",
        "romaji": "akusei",
        "meaning": "malignant (tumor / disease)",
        "partOfSpeech": "noun / no-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "悪性の腫瘍は見つかりませんでした。",
        "exampleSentenceEn": "No malignant tumors were found."
      },
      {
        "id": "w_shohou",
        "word": "処方する",
        "reading": "しょほうする",
        "romaji": "shohou suru",
        "meaning": "to prescribe medicine",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "胃腸薬を処方します。",
        "exampleSentenceEn": "I will prescribe gastrointestinal medicine."
      }
    ],
    "examQuestions": [
      {
        "id": "q_med_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "医師が患者に伝えた今後の生活上の注意点は何ですか。",
        "instructionEn": "What lifestyle caution did the doctor advise the patient?",
        "questionJa": "生活上の注意点はどれですか。",
        "questionEn": "Which is the advised precaution?",
        "options": [
          {
            "id": 1,
            "textJa": "香辛料やアルコールを控える",
            "textEn": "Refrain from spices and alcohol"
          },
          {
            "id": 2,
            "textJa": "即時の外科手術を受ける",
            "textEn": "Undergo immediate surgery"
          },
          {
            "id": 3,
            "textJa": "毎日激しい運動を行う",
            "textEn": "Do vigorous exercise daily"
          },
          {
            "id": 4,
            "textJa": "薬の服用を一切やめる",
            "textEn": "Stop all medications entirely"
          }
        ],
        "correctIndex": 0,
        "explanation": "医師は「香辛料やアルコールは控えて様子を見てください」と指導しました。"
      }
    ]
  },
  {
    "id": "n2_seminar_qa",
    "level": "N2",
    "category": "Technology & Enterprise",
    "titleJa": "AI技術セミナーでの質疑応答",
    "titleEn": "Enterprise AI Seminar Q&A",
    "descriptionJa": "生成AIの社内導入：情報漏洩対策、プロンプトガイドライン、ROIの測定指標！",
    "descriptionEn": "Generative AI enterprise adoption: confidential data leakage prevention and ROI metrics!",
    "durationSeconds": 24,
    "audioSpeechRate": 0.92,
    "storyboard": [
      {
        "id": "scene_ai_1",
        "order": 1,
        "title": "Audience Question",
        "description": "Audience member asks about enterprise data security in LLMs.",
        "sceneTheme": "symposium",
        "captionJa": "社内機密データの漏洩リスクと対策について質問します。",
        "captionEn": "Inquiring about data security and IP protection in LLMs."
      },
      {
        "id": "scene_ai_2",
        "order": 2,
        "title": "Expert Answer",
        "description": "Speaker explains opt-out data usage and private enterprise tenants.",
        "sceneTheme": "symposium",
        "captionJa": "学習遮断設定と企業専用APIの活用を提言します。",
        "captionEn": "Recommending private tenancy and data non-training policies."
      }
    ],
    "dialogue": [
      {
        "id": "d_ai1",
        "speaker": "参加者 (Attendee)",
        "speakerRole": "attendee",
        "voiceGender": "male",
        "text": "企業において生成AIを本格導入する際、最も障壁となるセキュリティ上の留意点は何でしょうか。",
        "hiragana": "きぎょうにおいてせいせいえーあいをほんかくとうにゅうするさい、もっともしょうへきとなるせきゅりてぃじょうのりゅういてんはなんでしょうか。",
        "romaji": "Kigyou ni oite seisei ee-ai o honkaku dounyuu suru sai, mottomo shouheki to naru sekyuriti-jou no ryuuiten wa nan deshou ka.",
        "en": "When rolling out generative AI company-wide, what is the most significant security barrier to consider?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 6
      },
      {
        "id": "d_ai2",
        "speaker": "講師 (Lecturer)",
        "speakerRole": "speaker",
        "voiceGender": "female",
        "text": "最大の懸念は、機密情報や顧客データがモデルの再学習に流用されるリスクです。",
        "hiragana": "さいだいのけねんは、きみつじょうほうやこきゃくでーたがもでるのさいがくしゅうにりゅうようされるりすくです。",
        "romaji": "Saidai no kenen wa, kimitsu jouhou ya kokyaku deeta ga moderu no sai-gakushuu ni ryuuyou sareru risuku desu.",
        "en": "The biggest concern is the risk of proprietary data or customer info being repurposed for model re-training.",
        "sceneIndex": 0,
        "timeOffsetSec": 7,
        "durationSec": 6
      },
      {
        "id": "d_ai3",
        "speaker": "講師 (Lecturer)",
        "speakerRole": "speaker",
        "voiceGender": "female",
        "text": "対策として、入力データが学習に保持されない法人向け専用テナントを契約することが不可欠です。",
        "hiragana": "たいさくとして、にゅうりょくでーたががくしゅうにほじされないほうじんむけせんようてなんとをけいやくすることがふかけつです。",
        "romaji": "Taisaku to shite, nyuuryoku deeta ga gakushuu ni hoji sarenai houjin-muke senyou tenanto o keiyaku suru koto ga fukaketsu desu.",
        "en": "As a safeguard, subscribing to enterprise-dedicated tenants ensuring zero data retention for training is essential.",
        "sceneIndex": 1,
        "timeOffsetSec": 14,
        "durationSec": 6
      },
      {
        "id": "d_ai4",
        "speaker": "参加者 (Attendee)",
        "speakerRole": "attendee",
        "voiceGender": "male",
        "text": "明確な指針をありがとうございます。社内ガイドラインの策定に反映させていただきます。",
        "hiragana": "めいかくなししんをありがとうございます。しゃないがいどらいんのさくていにはんえいさせていただきます。",
        "romaji": "Meikaku na shishin o arigatou gozaimasu. Shanai gaidorain no sakutei ni han-ei sasete itadakimasu.",
        "en": "Thank you for the clear guideline. We will incorporate this into formulating our internal policies.",
        "sceneIndex": 1,
        "timeOffsetSec": 21,
        "durationSec": 5
      }
    ],
    "vocabulary": [
      {
        "id": "w_kimitsu",
        "word": "機密情報",
        "reading": "きみつじょうほう",
        "romaji": "kimitsu jouhou",
        "meaning": "confidential / classified information",
        "partOfSpeech": "noun",
        "pitchAccent": "④ 中高 (Nakadaka)",
        "exampleSentenceJa": "機密情報の漏洩を防ぎます。",
        "exampleSentenceEn": "We prevent leakage of confidential information."
      },
      {
        "id": "w_fukaketsu",
        "word": "不可欠",
        "reading": "ふかけつ",
        "romaji": "fukaketsu",
        "meaning": "indispensable / essential",
        "partOfSpeech": "na-adjective",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "セキュリティ対策は不可欠です。",
        "exampleSentenceEn": "Security measures are indispensable."
      }
    ],
    "examQuestions": [
      {
        "id": "q_ai_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "講師が挙げたセキュリティ対策の最も重要なポイントは何ですか。",
        "instructionEn": "What is the most crucial security safeguard highlighted by the lecturer?",
        "questionJa": "不可欠な対策はどれですか。",
        "questionEn": "Which is the indispensable countermeasure?",
        "options": [
          {
            "id": 1,
            "textJa": "入力データを学習に利用しない法人契約の締結",
            "textEn": "Enterprise contracts ensuring data is not used for training"
          },
          {
            "id": 2,
            "textJa": "社内でのAI利用を全面禁止すること",
            "textEn": "Banning all internal AI usage"
          },
          {
            "id": 3,
            "textJa": "無料の個人アカウントのみを利用すること",
            "textEn": "Using only free personal accounts"
          },
          {
            "id": 4,
            "textJa": "すべての出力を無検証で公開すること",
            "textEn": "Publishing outputs without verification"
          }
        ],
        "correctIndex": 0,
        "explanation": "講師は「入力データが学習に保持されない法人向け専用テナントを契約することが不可欠」と述べました。"
      }
    ]
  },
  {
    "id": "n1_legal_hearing",
    "level": "N1",
    "category": "Legal & Judicial",
    "titleJa": "裁判所での証人尋問",
    "titleEn": "Courtroom Witness Examination",
    "descriptionJa": "特許権侵害訴訟における証人喚問：先行技術の新規性と守秘義務契約の効力！",
    "descriptionEn": "Patent infringement trial: prior art novelty, chronological inventorship, and NDA enforceability!",
    "durationSeconds": 26,
    "audioSpeechRate": 0.95,
    "storyboard": [
      {
        "id": "scene_court_1",
        "order": 1,
        "title": "Attorney Examination",
        "description": "Plaintiff attorney cross-examines chief technical engineer on design timeline.",
        "sceneTheme": "interview",
        "captionJa": "原告代理人が技術開発の時系列と着想日を尋問します。",
        "captionEn": "Cross-examining the timeline and conception date of technical invention."
      },
      {
        "id": "scene_court_2",
        "order": 2,
        "title": "Presiding Judge Clarification",
        "description": "Presiding judge inquires regarding disclosure parameters under NDA.",
        "sceneTheme": "interview",
        "captionJa": "裁判長が秘密保持契約に基づく開示範囲を確認します。",
        "captionEn": "Presiding judge verifying scope of disclosures under confidentiality contract."
      }
    ],
    "dialogue": [
      {
        "id": "d_ct1",
        "speaker": "原告代理人 (Attorney)",
        "speakerRole": "lawyer",
        "voiceGender": "male",
        "text": "証人は、被告企業への転職前に本件特許に関わる設計図面を閲覧・複製した事実を認めますか。",
        "hiragana": "しょうにんは、ひこくきぎょうへのてんしょくまえにほんけん purchases にかかわるせっけいずめんをえつらん・ふくせいしたじじつをみとめますか。",
        "romaji": "Shounin wa, hikoku kigyou e no tenshoku mae ni honken tokkyo ni kakawaru sekkei zumen o etsuran, fukusei shita jijitsu o mitomemasu ka.",
        "en": "Does the witness acknowledge having accessed and duplicated design blueprints regarding this patent prior to transferring to the defendant firm?",
        "sceneIndex": 0,
        "timeOffsetSec": 0,
        "durationSec": 8
      },
      {
        "id": "d_ct2",
        "speaker": "証人 (Witness)",
        "speakerRole": "witness",
        "voiceGender": "female",
        "text": "業務上の必要性に基づき閲覧はいたしましたが、私的持ち出しや複製の意図は断じてございませんでした。",
        "hiragana": "ぎょうむじょうのひつようせいにもとづきえつらんはいたしましたが、してきもちだしやふくせいのいとはだんじてございませんでした。",
        "romaji": "Gyoumu-jou no hitsuyousei ni motozuki etsuran wa itashimashita ga, shiteki mochidashi ya fukusei no ito wa danjite gozaimasen deshita.",
        "en": "I did view them based on routine duties, but there was categorically zero intent of private removal or duplication.",
        "sceneIndex": 0,
        "timeOffsetSec": 9,
        "durationSec": 8
      },
      {
        "id": "d_ct3",
        "speaker": "裁判長 (Judge)",
        "speakerRole": "judge",
        "voiceGender": "male",
        "text": "双方の主張を踏まえ、当時のアクセスログ解析結果および電子署名付き退職合意書の証拠調べを行います。",
        "hiragana": "そうほうのしゅちょうをふまえ、とうじのあくせすろぐかいせきけっかおよびでんししょめいつきたいしょくごういしょのしょうこしらべをおこないます。",
        "romaji": "Souhou no shuchou o fumaemasu, touji no akusesu rogu kaiseki kekka oyobi denshi shomei-tsuki taishoku gouisho no shouko shirabe o okonaimasu.",
        "en": "In light of arguments from both sides, the court will proceed to evaluate access log analytics and the digitally signed separation agreement as evidence.",
        "sceneIndex": 1,
        "timeOffsetSec": 18,
        "durationSec": 8
      }
    ],
    "vocabulary": [
      {
        "id": "w_etsuran",
        "word": "閲覧",
        "reading": "えつらん",
        "romaji": "etsuran",
        "meaning": "inspection / viewing of records",
        "partOfSpeech": "noun / suru-verb",
        "pitchAccent": "◎ 平板 (Heiban)",
        "exampleSentenceJa": "設計図面を閲覧しました。",
        "exampleSentenceEn": "I inspected the design blueprints."
      },
      {
        "id": "w_danjite",
        "word": "断じて",
        "reading": "だんじて",
        "romaji": "danjite",
        "meaning": "categorically / under no circumstances (with negative)",
        "partOfSpeech": "adverb",
        "pitchAccent": "① 頭高 (Atamadaka)",
        "exampleSentenceJa": "断じて不正はございません。",
        "exampleSentenceEn": "There was categorically no wrongdoing."
      }
    ],
    "examQuestions": [
      {
        "id": "q_ct_1",
        "mondaiType": 2,
        "mondaiLabel": "第2部分: ポイント理解 (Point Comprehension)",
        "instructionJa": "証人は原告代理人の質問に対してどのように証言しましたか。",
        "instructionEn": "How did the witness testify in response to the plaintiff attorney?",
        "questionJa": "証人の主張はどれですか。",
        "questionEn": "Which matches the witness testimony?",
        "options": [
          {
            "id": 1,
            "textJa": "業務上の閲覧は認めたが、不正な持ち出しや複製は断固否定した",
            "textEn": "Admitted routine viewing but categorically denied unauthorized duplication"
          },
          {
            "id": 2,
            "textJa": "設計図面を自宅に持ち帰ったと全面的に自白した",
            "textEn": "Fully confessed to taking blueprints home"
          },
          {
            "id": 3,
            "textJa": "被告企業からの指示であったと他人の責任にした",
            "textEn": "Shifted blame claiming direct order from defendant"
          },
          {
            "id": 4,
            "textJa": "記憶にないとして一切の証言を拒絶した",
            "textEn": "Refused to testify claiming lack of memory"
          }
        ],
        "correctIndex": 0,
        "explanation": "証人は「閲覧はいたしましたが、私的持ち出しや複製の意図は断じてございませんでした」と証言しました。"
      }
    ]
  }
];

export const CUMULATIVE_LEVELS_MAP: Record<string, string[]> = {
  N5: ['N5'],
  N4: ['N5', 'N4'],
  N3: ['N5', 'N4', 'N3'],
  N2: ['N5', 'N4', 'N3', 'N2'],
  N1: ['N5', 'N4', 'N3', 'N2', 'N1'],
};

export function getScenariosByLevel(level?: string): ListeningScenario[] {
  if (!level || level.toUpperCase() === 'ALL') {
    return LISTENING_SCENARIOS;
  }
  const cleanLevel = level.toUpperCase();
  const allowed = CUMULATIVE_LEVELS_MAP[cleanLevel] || [cleanLevel];
  return LISTENING_SCENARIOS.filter((s) => allowed.includes(s.level));
}

export function getScenarioById(id: string): ListeningScenario | undefined {
  return LISTENING_SCENARIOS.find((s) => s.id === id);
}
