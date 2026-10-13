// Auto-generated from authoritative curriculum data files
export interface DialogueLine {
  speaker: string;
  jp: string;
  en: string;
}

export interface LessonExercise {
  type: string;
  question?: string;
  sentence?: string;
  items?: string[];
  options?: string[];
  answer: string | string[];
  [key: string]: any;
}

export interface RawLesson {
  id: string;
  title: string;
  titleJp?: string;
  level: string;
  order: number;
  duration?: string;
  xp?: number;
  description?: string;
  vocabulary: (string | any)[];
  grammar: (string | any)[];
  dialogue?: DialogueLine[];
  exercises?: LessonExercise[];
  culturalNote?: string;
  kanji?: (string | any)[];
}

export const LESSONS_DATA: Record<string, RawLesson[]> = {
  "N1": [
    {
      "id": "n1l001",
      "title": "Classical Japanese Elements in Modern Japanese",
      "titleJp": "現代語に残る古典表現",
      "level": "N1",
      "order": 1,
      "duration": "60 min",
      "xp": 150,
      "description": "Understand classical Japanese grammar patterns that survive in formal modern Japanese.",
      "vocabulary": [
        "古典語",
        "文語",
        "現代語",
        "慣用句",
        "故事成語"
      ],
      "grammar": [
        "〜べし / べからず",
        "〜ず (classical negative)",
        "〜たる (classical で ある)",
        "〜ゆえに",
        "〜なり"
      ],
      "dialogue": [
        {
          "speaker": "Literary",
          "jp": "為せば成る、為さねば成らぬ何事も。",
          "en": "If you try, you will succeed; if you do not try, nothing will be achieved."
        },
        {
          "speaker": "Proverb",
          "jp": "急がば回れ。",
          "en": "More haste, less speed. (lit. If in a hurry, take the roundabout way.)"
        },
        {
          "speaker": "Formal Notice",
          "jp": "関係者以外立入るべからず。",
          "en": "No entry for unauthorized persons."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Translate the classical negative ず: 知らず",
          "answer": "not knowing / without knowing"
        },
        {
          "type": "modernize",
          "question": "〜べからず → modern equivalent",
          "answer": "〜てはいけない / 〜てはならない"
        }
      ],
      "culturalNote": "Classical Japanese (文語/古文) appears in proverbs, set phrases, legal texts, formal literature, and signage. N1 candidates must recognize these patterns."
    },
    {
      "id": "n1l002",
      "title": "Nuanced Expressions of Emotion & Psychology",
      "titleJp": "心理・感情の微妙な表現",
      "level": "N1",
      "order": 2,
      "duration": "55 min",
      "xp": 140,
      "description": "Express subtle emotions and psychological states with precision.",
      "vocabulary": [
        "葛藤",
        "逡巡",
        "忸怩",
        "自嘲",
        "諦念",
        "憤慨",
        "懐疑"
      ],
      "grammar": [
        "〜てやまない",
        "〜ずにはいられない",
        "〜を禁じ得ない",
        "〜のいたりだ",
        "〜に堪えない"
      ],
      "dialogue": [
        {
          "speaker": "Essay",
          "jp": "彼の無謀な行動に、驚きを禁じ得なかった。",
          "en": "I could not help but be surprised at his reckless behavior."
        },
        {
          "speaker": "Speech",
          "jp": "皆様のご健康とご発展を願ってやみません。",
          "en": "I sincerely and endlessly hope for your health and development."
        },
        {
          "speaker": "Monologue",
          "jp": "知っていながら、言わずにはいられなかった。",
          "en": "Knowing it, I couldn't help but say it."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I cannot help but admire him.",
          "answer": "彼のことを尊敬せずにはいられない。"
        },
        {
          "type": "usage",
          "question": "What nuance does 〜てやまない carry?",
          "answer": "Deep, sincere, unceasing emotional state — always used with emotional verbs"
        }
      ],
      "culturalNote": "These expressions appear frequently in formal speeches, literary works, essays, and business correspondence. They convey deep sincerity."
    },
    {
      "id": "n1l003",
      "title": "Logical & Academic Discourse",
      "titleJp": "論理的・学術的表現",
      "level": "N1",
      "order": 3,
      "duration": "60 min",
      "xp": 150,
      "description": "Master the language of academic papers, debates, and logical argumentation.",
      "vocabulary": [
        "論旨",
        "主張",
        "根拠",
        "反論",
        "帰結",
        "前提",
        "論証",
        "命題"
      ],
      "grammar": [
        "〜に即して",
        "〜をふまえて",
        "〜から導かれる",
        "〜とみなす",
        "〜に相当する"
      ],
      "dialogue": [
        {
          "speaker": "Academic",
          "jp": "この研究結果をふまえて、新たな仮説を提唱する。",
          "en": "Based on these research results, I propose a new hypothesis."
        },
        {
          "speaker": "Debate",
          "jp": "相手の主張は事実に即していない。",
          "en": "The opponent's argument is not based on the facts."
        },
        {
          "speaker": "Paper",
          "jp": "この現象は経済的格差に起因すると見なすことができる。",
          "en": "This phenomenon can be considered to originate from economic disparities."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Based on the data, we can conclude that...",
          "answer": "データをふまえて、〜と結論づけられる。"
        }
      ],
      "culturalNote": "Japanese academic writing heavily uses noun-heavy structures, passive voice, and hedging expressions. Direct assertions are often softened."
    },
    {
      "id": "n1l004",
      "title": "Four-Character Idioms (四字熟語)",
      "titleJp": "四字熟語",
      "level": "N1",
      "order": 4,
      "duration": "50 min",
      "xp": 130,
      "description": "Learn essential four-character compound words derived from Chinese classics.",
      "vocabulary": [
        "一石二鳥 (one stone two birds)",
        "七転八起 (fall seven rise eight)",
        "以心伝心 (heart to heart communication)",
        "自業自得 (reap what you sow)",
        "臨機応変 (adapting to the situation)",
        "試行錯誤 (trial and error)",
        "先手必勝 (he who acts first wins)"
      ],
      "grammar": [
        "四字熟語 as adverb: 〜に",
        "四字熟語 as noun modifier: 〜な / の",
        "四字熟語 as predicate: 〜だ"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "彼女の対応は本当に臨機応変で素晴らしい。",
          "en": "Her ability to adapt to situations is truly wonderful."
        },
        {
          "speaker": "B",
          "jp": "試行錯誤を繰り返した末に、ついに解決策が見つかった。",
          "en": "After repeating trial and error, a solution was finally found."
        },
        {
          "speaker": "A",
          "jp": "まさに一石二鳥ですね！",
          "en": "That's exactly killing two birds with one stone!"
        }
      ],
      "exercises": [
        {
          "type": "match",
          "question": "Match: 自業自得",
          "answer": "reap what you sow / you brought it on yourself"
        },
        {
          "type": "match",
          "question": "Match: 以心伝心",
          "answer": "telepathy / heart-to-heart understanding without words"
        }
      ],
      "culturalNote": "四字熟語 are an important part of Japanese literary and formal culture. Many originate from Chinese classics (漢文) and Buddhist teachings."
    },
    {
      "id": "n1l005",
      "title": "Political, Legal & Economic Vocabulary",
      "titleJp": "政治・法律・経済用語",
      "level": "N1",
      "order": 5,
      "duration": "60 min",
      "xp": 150,
      "description": "Build vocabulary for understanding Japanese news, law, and economic discourse.",
      "vocabulary": [
        "立法",
        "司法",
        "行政",
        "憲法",
        "条約",
        "規制緩和",
        "財政",
        "GDP",
        "景気",
        "金融政策"
      ],
      "grammar": [
        "〜に基づいて",
        "〜を前提として",
        "〜の観点から",
        "〜を背景に",
        "〜に照らして"
      ],
      "dialogue": [
        {
          "speaker": "News",
          "jp": "憲法の規定に基づいて、新たな法律が制定された。",
          "en": "Based on the provisions of the constitution, a new law was enacted."
        },
        {
          "speaker": "Analysis",
          "jp": "少子化を背景に、移民政策の見直しが求められている。",
          "en": "Against the backdrop of a declining birthrate, a review of immigration policy is being called for."
        },
        {
          "speaker": "Report",
          "jp": "経済の観点から見ると、この政策は有効だと考えられる。",
          "en": "From an economic perspective, this policy is considered effective."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "From a legal perspective",
          "answer": "法律の観点から"
        },
        {
          "type": "translate",
          "question": "Based on the regulations",
          "answer": "規則に基づいて"
        }
      ],
      "culturalNote": "The ability to understand NHK news broadcasts and read newspaper articles is a practical benchmark for N1 level Japanese."
    }
  ],
  "N2": [
    {
      "id": "n2l001",
      "title": "Formal Written Japanese",
      "titleJp": "書き言葉・フォーマル表現",
      "level": "N2",
      "order": 1,
      "duration": "45 min",
      "xp": 100,
      "description": "Learn the key differences between spoken and written Japanese and formal expression patterns.",
      "vocabulary": [
        "書き言葉",
        "話し言葉",
        "フォーマル",
        "ビジネス文書",
        "公式"
      ],
      "grammar": [
        "〜において",
        "〜に関して",
        "〜をめぐって",
        "〜に際して",
        "〜にもかかわらず"
      ],
      "dialogue": [
        {
          "speaker": "Formal Letter",
          "jp": "拝啓、時下ますますご清栄のこととお慶び申し上げます。",
          "en": "Dear Sir/Madam, I hope this letter finds you in good health and spirits."
        },
        {
          "speaker": "Memo",
          "jp": "本件に関して、ご確認いただきますようお願い申し上げます。",
          "en": "Regarding this matter, we kindly request your confirmation."
        }
      ],
      "exercises": [
        {
          "type": "rewrite",
          "question": "Rewrite formally: 今日、会議があります。",
          "answer": "本日、会議が開催される予定でございます。"
        },
        {
          "type": "multiple",
          "question": "Which is most formal?",
          "options": [
            "〜で",
            "〜において",
            "〜のところ"
          ],
          "answer": "〜において"
        }
      ],
      "culturalNote": "Business Japanese (ビジネス日本語) has its own set of expressions and formulas. Keigo (敬語) — honorific language — is essential in professional settings."
    },
    {
      "id": "n2l002",
      "title": "Keigo — Honorific Language Deep Dive",
      "titleJp": "敬語の深掘り",
      "level": "N2",
      "order": 2,
      "duration": "50 min",
      "xp": 110,
      "description": "Master sonkeigo (respectful), kenjougo (humble), and teineigo (polite) forms.",
      "vocabulary": [
        "尊敬語",
        "謙譲語",
        "丁寧語",
        "お〜になる",
        "ご〜する"
      ],
      "grammar": [
        "お/ご〜になる (sonkeigo)",
        "お/ご〜する (kenjougo)",
        "〜ていらっしゃる",
        "〜ていただく",
        "〜でございます"
      ],
      "dialogue": [
        {
          "speaker": "Staff",
          "jp": "部長はただいま外出されていらっしゃいます。",
          "en": "The manager is currently out."
        },
        {
          "speaker": "Customer",
          "jp": "田中様はいらっしゃいますか？",
          "en": "Is Tanaka-sama available?"
        },
        {
          "speaker": "Staff",
          "jp": "少々お待ちいただけますでしょうか。",
          "en": "Could you please wait a moment?"
        }
      ],
      "exercises": [
        {
          "type": "convert",
          "question": "食べます → respectful (sonkeigo)",
          "answer": "召し上がります"
        },
        {
          "type": "convert",
          "question": "言います → humble (kenjougo)",
          "answer": "申します"
        },
        {
          "type": "convert",
          "question": "もらいます → humble",
          "answer": "いただきます"
        }
      ],
      "culturalNote": "Keigo is fundamental to Japanese professional life. Mistakes in keigo can cause significant social friction in formal settings."
    },
    {
      "id": "n2l003",
      "title": "Complex Sentence Structures",
      "titleJp": "複雑な文構造",
      "level": "N2",
      "order": 3,
      "duration": "45 min",
      "xp": 100,
      "description": "Build complex, multi-clause sentences using advanced connectives.",
      "vocabulary": [
        "複合文",
        "接続詞",
        "修飾節",
        "関係節",
        "従属節"
      ],
      "grammar": [
        "〜ものの",
        "〜とはいえ",
        "〜上で",
        "〜からには",
        "〜以上は"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "やると決めた以上は、最後まで頑張らなければなりません。",
          "en": "Now that you have decided to do it, you must persevere until the end."
        },
        {
          "speaker": "B",
          "jp": "留学したいとはいえ、お金の問題もあります。",
          "en": "Although I want to study abroad, there is also the matter of money."
        },
        {
          "speaker": "A",
          "jp": "申し込んだものの、まだ詳細が確認できていません。",
          "en": "Although I applied, I have not yet been able to confirm the details."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Now that I promised, I have to do it.",
          "answer": "約束した以上は、やらなければなりません。"
        }
      ],
      "culturalNote": "〜以上は and 〜からには both mean \"now that / since\" but 以上は is slightly more formal."
    },
    {
      "id": "n2l004",
      "title": "Reading News & Media Japanese",
      "titleJp": "ニュース・メディアの日本語",
      "level": "N2",
      "order": 4,
      "duration": "50 min",
      "xp": 110,
      "description": "Learn vocabulary and structures commonly used in Japanese news and media.",
      "vocabulary": [
        "報道",
        "事件",
        "発表",
        "政策",
        "影響",
        "懸念",
        "措置",
        "対策"
      ],
      "grammar": [
        "〜に伴い",
        "〜を受けて",
        "〜によれば",
        "〜との見方",
        "〜と見られる"
      ],
      "dialogue": [
        {
          "speaker": "News",
          "jp": "政府の発表によれば、新たな経済対策が来月から実施される見通しだ。",
          "en": "According to the government's announcement, new economic measures are expected to be implemented from next month."
        },
        {
          "speaker": "News",
          "jp": "物価上昇に伴い、家計への影響が懸念されている。",
          "en": "Along with the rise in prices, concerns are growing about the impact on household budgets."
        }
      ],
      "exercises": [
        {
          "type": "identify",
          "question": "Find the source-citing expression",
          "sentence": "関係者によれば、会議は中止になったとのことだ。",
          "answer": "によれば"
        }
      ],
      "culturalNote": "News Japanese often uses passive voice and nominalizations. The style is dense and omits particles more frequently than conversational Japanese."
    },
    {
      "id": "n2l005",
      "title": "Expressing Degree & Extent",
      "titleJp": "程度・範囲の表現",
      "level": "N2",
      "order": 5,
      "duration": "40 min",
      "xp": 100,
      "description": "Express degree, extent, and limits using advanced grammatical patterns.",
      "vocabulary": [
        "程度",
        "範囲",
        "限度",
        "最低限",
        "最大限"
      ],
      "grammar": [
        "〜に限って",
        "〜限り",
        "〜さえ〜ば",
        "〜だけあって",
        "〜ほど〜ない"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "彼女は努力家だけあって、成績がとても良い。",
          "en": "As expected of someone who works hard, her grades are very good."
        },
        {
          "speaker": "B",
          "jp": "健康でさえあれば、他のことは何でもできる。",
          "en": "As long as you are healthy, you can do anything else."
        },
        {
          "speaker": "A",
          "jp": "彼ほど努力している人はいない。",
          "en": "There is nobody who works as hard as him."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "As expected of a native speaker, his pronunciation is perfect.",
          "answer": "ネイティブだけあって、発音が完璧だ。"
        }
      ],
      "culturalNote": "〜だけあって acknowledges that a result is natural given a person's background or effort. It always has a positive or expected nuance."
    }
  ],
  "N3": [
    {
      "id": "n3l001",
      "title": "Expressing Reason & Cause (〜ため / 〜せいで / 〜おかげで)",
      "titleJp": "理由・原因の表現",
      "level": "N3",
      "order": 1,
      "duration": "35 min",
      "xp": 80,
      "description": "Learn nuanced ways to express reasons and causes, including blame and gratitude.",
      "vocabulary": [
        "原因",
        "理由",
        "結果",
        "影響",
        "責任"
      ],
      "grammar": [
        "〜ために",
        "〜せいで / せいか",
        "〜おかげで / おかげか",
        "〜からこそ"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "試験に合格できたのは、先生のおかげです。",
          "en": "It is thanks to the teacher that I passed the exam."
        },
        {
          "speaker": "B",
          "jp": "逆に、私は体調が悪かったせいで、試験に集中できませんでした。",
          "en": "On the contrary, because of my poor health, I couldn't concentrate on the exam."
        },
        {
          "speaker": "A",
          "jp": "来年のためにも、もっと準備をしましょう。",
          "en": "For next year too, let's prepare more."
        }
      ],
      "exercises": [
        {
          "type": "choose",
          "question": "Which expresses blame/negative cause?",
          "options": [
            "おかげで",
            "せいで",
            "ために"
          ],
          "answer": "せいで"
        },
        {
          "type": "translate",
          "question": "Thanks to your help, I finished.",
          "answer": "あなたの助けのおかげで、終わりました。"
        }
      ],
      "culturalNote": "おかげで implies positive outcome; せいで implies negative outcome. Using them incorrectly can seem sarcastic."
    },
    {
      "id": "n3l002",
      "title": "Expressing Contrast (〜のに / 〜くせに / 〜一方)",
      "titleJp": "逆接・対比表現",
      "level": "N3",
      "order": 2,
      "duration": "35 min",
      "xp": 80,
      "description": "Express contrast and unexpected results using various conjunctions.",
      "vocabulary": [
        "対比",
        "逆接",
        "一方",
        "反面",
        "矛盾"
      ],
      "grammar": [
        "〜のに (unexpected/complaint)",
        "〜くせに (despite, negative nuance)",
        "〜一方(で) (on the other hand)",
        "〜反面"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "あんなに勉強したのに、試験に落ちてしまった。",
          "en": "Even though I studied so much, I ended up failing the exam."
        },
        {
          "speaker": "B",
          "jp": "彼は知っているくせに、知らないふりをしている。",
          "en": "Despite knowing, he is pretending not to know."
        },
        {
          "speaker": "A",
          "jp": "都市は便利な一方で、自然が少ない。",
          "en": "While cities are convenient, on the other hand they lack nature."
        }
      ],
      "exercises": [
        {
          "type": "choose",
          "question": "Which carries a nuance of complaint or dissatisfaction?",
          "options": [
            "一方で",
            "のに",
            "ために"
          ],
          "answer": "のに"
        }
      ],
      "culturalNote": "くせに is stronger and more critical than のに. It implies the speaker thinks the subject should know better."
    },
    {
      "id": "n3l003",
      "title": "Potential, Desire & Necessity",
      "titleJp": "可能・願望・必要性",
      "level": "N3",
      "order": 3,
      "duration": "40 min",
      "xp": 85,
      "description": "Express ability, desires, and necessity using various grammatical forms.",
      "vocabulary": [
        "能力",
        "可能性",
        "必要性",
        "希望",
        "願い"
      ],
      "grammar": [
        "〜ことができる",
        "〜たがる (third person desire)",
        "〜必要がある",
        "〜べきだ",
        "〜なければならない"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "彼はいつも新しいゲームを欲しがっています。",
          "en": "He is always wanting new games."
        },
        {
          "speaker": "B",
          "jp": "健康のためには、もっと野菜を食べるべきです。",
          "en": "For your health, you should eat more vegetables."
        },
        {
          "speaker": "A",
          "jp": "そうですね。毎日運動する必要がありますね。",
          "en": "You're right. We need to exercise every day."
        }
      ],
      "exercises": [
        {
          "type": "choose",
          "question": "べきだ vs なければならない: which is stronger obligation?",
          "options": [
            "べきだ",
            "なければならない"
          ],
          "answer": "なければならない"
        }
      ],
      "culturalNote": "べきだ expresses a moral obligation or advice; なければならない is a stronger, more external obligation."
    },
    {
      "id": "n3l004",
      "title": "Quotation & Reported Speech",
      "titleJp": "引用・伝達表現",
      "level": "N3",
      "order": 4,
      "duration": "35 min",
      "xp": 80,
      "description": "Learn how to report what others said, thought, or heard.",
      "vocabulary": [
        "引用",
        "伝達",
        "報告",
        "噂",
        "情報"
      ],
      "grammar": [
        "〜と言っていた",
        "〜と思っている",
        "〜によると〜そうだ",
        "〜とのことです",
        "〜と聞いた"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "田中さんによると、新しいカフェが駅の近くにできたそうです。",
          "en": "According to Tanaka, it seems a new cafe opened near the station."
        },
        {
          "speaker": "B",
          "jp": "山田さんは来週旅行に行くと言っていましたよ。",
          "en": "Yamada said they are going on a trip next week."
        },
        {
          "speaker": "A",
          "jp": "部長から、会議が延期されたとのことです。",
          "en": "I heard from the manager that the meeting has been postponed."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Tanaka said he is tired.",
          "answer": "田中さんは疲れたと言っていました。"
        }
      ],
      "culturalNote": "Japanese reported speech does not always change tense like English does. Context and time expressions carry tense information."
    },
    {
      "id": "n3l005",
      "title": "Expressing Change & Transformation",
      "titleJp": "変化の表現",
      "level": "N3",
      "order": 5,
      "duration": "35 min",
      "xp": 80,
      "description": "Learn how to express gradual or sudden changes in state.",
      "vocabulary": [
        "変化",
        "成長",
        "発展",
        "増加",
        "減少"
      ],
      "grammar": [
        "〜ようになる",
        "〜なくなる",
        "〜てくる",
        "〜ていく",
        "〜に変わる"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本語を勉強してから、ニュースが聞き取れるようになりました。",
          "en": "After studying Japanese, I became able to understand the news."
        },
        {
          "speaker": "B",
          "jp": "最近、手紙を書く人が少なくなりましたね。",
          "en": "Recently, the number of people who write letters has decreased."
        },
        {
          "speaker": "A",
          "jp": "技術はこれからもっと発展していくでしょう。",
          "en": "Technology will continue to develop from here on."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I became able to swim.",
          "answer": "泳げるようになりました。"
        },
        {
          "type": "translate",
          "question": "I stopped eating meat.",
          "answer": "肉を食べなくなりました。"
        }
      ],
      "culturalNote": "てくる implies a change coming toward the present from the past; ていく implies a change going away into the future."
    }
  ],
  "N4": [
    {
      "id": "n4l001",
      "title": "Giving & Receiving (てあげる / てもらう / てくれる)",
      "titleJp": "授受表現",
      "level": "N4",
      "order": 1,
      "duration": "35 min",
      "xp": 70,
      "description": "Master the complex system of giving and receiving in Japanese.",
      "vocabulary": [
        "あげる",
        "もらう",
        "くれる",
        "さしあげる",
        "いただく",
        "くださる"
      ],
      "grammar": [
        "〜てあげる",
        "〜てもらう",
        "〜てくれる",
        "〜ていただく",
        "〜てくださる"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "田中さんが荷物を持ってくれました。",
          "en": "Tanaka carried my bags for me."
        },
        {
          "speaker": "B",
          "jp": "それは親切ですね。先生に教えていただきましたか？",
          "en": "That's kind. Did you have the teacher teach you?"
        },
        {
          "speaker": "A",
          "jp": "はい、先生に教えていただきました。とても助かりました。",
          "en": "Yes, I had the teacher teach me. It was very helpful."
        }
      ],
      "exercises": [
        {
          "type": "choose",
          "question": "Friend did something for me (casual)",
          "options": [
            "あげた",
            "くれた",
            "もらった"
          ],
          "answer": "くれた"
        },
        {
          "type": "translate",
          "question": "I had the teacher explain it.",
          "answer": "先生に説明していただきました。"
        }
      ],
      "culturalNote": "The direction of giving/receiving is crucial in Japanese. Using the wrong form can sound unnatural or even rude."
    },
    {
      "id": "n4l002",
      "title": "Causative & Passive Forms",
      "titleJp": "使役形と受身形",
      "level": "N4",
      "order": 2,
      "duration": "40 min",
      "xp": 80,
      "description": "Learn how to make someone do something, and how to express being acted upon.",
      "vocabulary": [
        "させる",
        "される",
        "させられる",
        "許可",
        "強制",
        "被害"
      ],
      "grammar": [
        "〜させる (causative)",
        "〜られる (passive)",
        "〜させられる (causative-passive)"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "部長に残業させられました。",
          "en": "I was made to work overtime by the manager."
        },
        {
          "speaker": "B",
          "jp": "それは大変でしたね。私は子供に野菜を食べさせました。",
          "en": "That must have been tough. I made my child eat vegetables."
        }
      ],
      "exercises": [
        {
          "type": "conjugate",
          "question": "食べる → causative",
          "answer": "食べさせる"
        },
        {
          "type": "conjugate",
          "question": "書く → passive",
          "answer": "書かれる"
        }
      ],
      "culturalNote": "The causative-passive form (させられる) often carries a nuance of being forced to do something against one's will."
    },
    {
      "id": "n4l003",
      "title": "Expressing Conditions (〜ば / 〜たら / 〜と / 〜なら)",
      "titleJp": "条件表現",
      "level": "N4",
      "order": 3,
      "duration": "40 min",
      "xp": 80,
      "description": "Master the four conditional forms in Japanese and when to use each one.",
      "vocabulary": [
        "もし",
        "場合",
        "条件",
        "かりに",
        "もしも"
      ],
      "grammar": [
        "〜ば",
        "〜たら",
        "〜と",
        "〜なら"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "もし時間があれば、映画を見に行きませんか？",
          "en": "If you have time, shall we go see a movie?"
        },
        {
          "speaker": "B",
          "jp": "仕事が終わったら、連絡します。",
          "en": "When work finishes, I'll contact you."
        },
        {
          "speaker": "A",
          "jp": "東京に行くなら、スカイツリーに行ったほうがいいですよ。",
          "en": "If you're going to Tokyo, you should go to Sky Tree."
        }
      ],
      "exercises": [
        {
          "type": "fill",
          "question": "春になる___、花見をしましょう。(natural consequence)",
          "answer": "と"
        },
        {
          "type": "fill",
          "question": "もし宝くじが当たっ___、何を買いますか？(hypothetical)",
          "answer": "たら"
        }
      ],
      "culturalNote": "と is for natural/automatic consequences. たら is most versatile. ば is often for hypotheticals. なら is for advice based on new information."
    },
    {
      "id": "n4l004",
      "title": "Expressing Hearsay & Appearance (〜そう / 〜らしい / 〜ようだ)",
      "titleJp": "様態・伝聞表現",
      "level": "N4",
      "order": 4,
      "duration": "35 min",
      "xp": 70,
      "description": "Learn how to express what things seem like and what you've heard.",
      "vocabulary": [
        "様子",
        "伝聞",
        "推測",
        "見た目",
        "聞いた話"
      ],
      "grammar": [
        "〜そうだ (hearsay/appearance)",
        "〜らしい (seems/hearsay)",
        "〜ようだ (seems/appears)",
        "〜みたいだ (casual ようだ)"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ニュースによると、明日は雪が降るそうです。",
          "en": "According to the news, it seems it will snow tomorrow."
        },
        {
          "speaker": "B",
          "jp": "本当ですか？空を見ると、確かに曇っているようですね。",
          "en": "Really? Looking at the sky, it certainly does seem cloudy."
        },
        {
          "speaker": "A",
          "jp": "田中さんは風邪を引いたらしいですよ。",
          "en": "It seems like Tanaka caught a cold."
        }
      ],
      "exercises": [
        {
          "type": "distinguish",
          "question": "Which そうだ means \"looks like it will rain\" (from appearance)?",
          "options": [
            "雨が降るそうだ",
            "雨が降りそうだ"
          ],
          "answer": "雨が降りそうだ"
        }
      ],
      "culturalNote": "〜そうだ has two completely different meanings depending on conjugation: verb-stem + そうだ = looks like; plain form + そうだ = hearsay."
    },
    {
      "id": "n4l005",
      "title": "Making Requests & Giving Permission",
      "titleJp": "依頼と許可",
      "level": "N4",
      "order": 5,
      "duration": "30 min",
      "xp": 70,
      "description": "Learn polite ways to make requests and ask for or give permission.",
      "vocabulary": [
        "お願い",
        "許可",
        "断る",
        "承諾",
        "丁寧"
      ],
      "grammar": [
        "〜てもらえますか",
        "〜ていただけますか",
        "〜てもいいですか",
        "〜てはいけません",
        "〜なくてもいいです"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "すみません、窓を開けてもいいですか？",
          "en": "Excuse me, is it alright if I open the window?"
        },
        {
          "speaker": "B",
          "jp": "はい、どうぞ。でも、エアコンが入っているので、少しだけにしてください。",
          "en": "Yes, please go ahead. But since the air conditioning is on, please just a little."
        },
        {
          "speaker": "A",
          "jp": "わかりました。少し手伝っていただけますか？",
          "en": "Understood. Could you help me a bit?"
        }
      ],
      "exercises": [
        {
          "type": "rank",
          "question": "Rank from most polite to least polite",
          "items": [
            "〜てくれる？",
            "〜てもらえますか？",
            "〜ていただけますか？"
          ],
          "answer": [
            "〜ていただけますか？",
            "〜てもらえますか？",
            "〜てくれる？"
          ]
        }
      ],
      "culturalNote": "Politeness levels matter greatly in Japanese. Using too casual a form with a superior can be seen as disrespectful."
    }
  ],
  "N5": [
    {
      "id": "n5l001",
      "title": "Greetings & Self-Introduction",
      "titleJp": "挨拶と自己紹介",
      "level": "N5",
      "order": 1,
      "duration": "20 min",
      "xp": 50,
      "description": "Learn essential Japanese greetings and how to introduce yourself.",
      "vocabulary": [
        "こんにちは",
        "おはよう",
        "こんばんは",
        "はじめまして",
        "よろしく"
      ],
      "grammar": [
        "〜です",
        "〜は〜です",
        "わたしは〜です"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "こんにちは！はじめまして。田中です。",
          "en": "Hello! Nice to meet you. I am Tanaka."
        },
        {
          "speaker": "B",
          "jp": "はじめまして。山田です。よろしくお願いします。",
          "en": "Nice to meet you. I am Yamada. Please treat me well."
        },
        {
          "speaker": "A",
          "jp": "こちらこそ、よろしくお願いします。",
          "en": "Likewise, please treat me well."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Good morning",
          "answer": "おはようございます"
        },
        {
          "type": "fill",
          "question": "___はじめまして。田中___。",
          "answer": [
            "はじめまして",
            "です"
          ]
        }
      ],
      "culturalNote": "In Japan, bowing while greeting is customary. The depth of the bow reflects the level of respect."
    },
    {
      "id": "n5l002",
      "title": "Numbers & Counting",
      "titleJp": "数字と数え方",
      "level": "N5",
      "order": 2,
      "duration": "25 min",
      "xp": 50,
      "description": "Learn Japanese numbers from 1 to 10,000 and basic counters.",
      "vocabulary": [
        "いち",
        "に",
        "さん",
        "し/よん",
        "ご",
        "ろく",
        "なな/しち",
        "はち",
        "く/きゅう",
        "じゅう"
      ],
      "grammar": [
        "〜つ (general counter)",
        "〜本 (long objects)",
        "〜枚 (flat objects)",
        "〜個 (small objects)"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "りんごをいくつ買いますか？",
          "en": "How many apples will you buy?"
        },
        {
          "speaker": "B",
          "jp": "みっつ買います。",
          "en": "I will buy three."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Seven",
          "answer": "なな / しち"
        },
        {
          "type": "multiple",
          "question": "How do you say 100?",
          "options": [
            "じゅう",
            "ひゃく",
            "せん",
            "まん"
          ],
          "answer": "ひゃく"
        }
      ],
      "culturalNote": "Japanese has multiple counter systems depending on what is being counted."
    },
    {
      "id": "n5l003",
      "title": "Family Members",
      "titleJp": "家族",
      "level": "N5",
      "order": 3,
      "duration": "20 min",
      "xp": 50,
      "description": "Learn vocabulary for family members in Japanese, including humble and honorific forms.",
      "vocabulary": [
        "ちち/おとうさん",
        "はは/おかあさん",
        "あに/おにいさん",
        "あね/おねえさん",
        "おとうと",
        "いもうと",
        "そふ/おじいさん",
        "そぼ/おばあさん"
      ],
      "grammar": [
        "〜の家族",
        "〜がいます",
        "家族は〜人です"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ご家族は何人ですか？",
          "en": "How many people are in your family?"
        },
        {
          "speaker": "B",
          "jp": "四人家族です。父と母と妹がいます。",
          "en": "There are four of us. I have a father, mother, and younger sister."
        },
        {
          "speaker": "A",
          "jp": "いいですね。私は一人っ子です。",
          "en": "That's nice. I am an only child."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Older sister (someone else's)",
          "answer": "おねえさん"
        },
        {
          "type": "translate",
          "question": "My father (humble)",
          "answer": "ちち"
        },
        {
          "type": "multiple",
          "question": "How do you say younger brother?",
          "options": [
            "あに",
            "おとうと",
            "いもうと",
            "あね"
          ],
          "answer": "おとうと"
        }
      ],
      "culturalNote": "Japanese uses different words for your own family (humble) vs. someone else's family (honorific). ちち = my father; おとうさん = your/someone's father."
    },
    {
      "id": "n5l004",
      "title": "Daily Routine & Time",
      "titleJp": "日課と時間",
      "level": "N5",
      "order": 4,
      "duration": "30 min",
      "xp": 60,
      "description": "Learn to talk about daily activities and express time in Japanese.",
      "vocabulary": [
        "おきる",
        "ねる",
        "たべる",
        "いく",
        "かえる",
        "べんきょうする",
        "はたらく",
        "あさ",
        "ひる",
        "よる"
      ],
      "grammar": [
        "〜時に",
        "〜から〜まで",
        "まず〜、それから〜",
        "〜ます / 〜ません"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "毎朝何時に起きますか？",
          "en": "What time do you wake up every morning?"
        },
        {
          "speaker": "B",
          "jp": "六時に起きます。それから、シャワーを浴びて、朝ごはんを食べます。",
          "en": "I wake up at six. Then I take a shower and eat breakfast."
        },
        {
          "speaker": "A",
          "jp": "学校は何時から何時までですか？",
          "en": "What time is school from and until?"
        },
        {
          "speaker": "B",
          "jp": "八時半から三時までです。",
          "en": "It is from 8:30 until 3:00."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I sleep at 11 o'clock.",
          "answer": "十一時にねます。"
        },
        {
          "type": "fill",
          "question": "学校は八時___三時___です。",
          "answer": [
            "から",
            "まで"
          ]
        }
      ],
      "culturalNote": "Japan uses both the 12-hour and 24-hour clock. Train schedules and official times often use the 24-hour format."
    },
    {
      "id": "n5l005",
      "title": "Food & Ordering at a Restaurant",
      "titleJp": "食べ物とレストランで注文する",
      "level": "N5",
      "order": 5,
      "duration": "30 min",
      "xp": 60,
      "description": "Learn food vocabulary and how to order food at a Japanese restaurant.",
      "vocabulary": [
        "ごはん",
        "パン",
        "さかな",
        "にく",
        "やさい",
        "くだもの",
        "みず",
        "おちゃ",
        "コーヒー",
        "おいしい"
      ],
      "grammar": [
        "〜をください",
        "〜をひとつ / ふたつ",
        "〜はありますか",
        "いただきます / ごちそうさま"
      ],
      "dialogue": [
        {
          "speaker": "Store",
          "jp": "いらっしゃいませ。何になさいますか？",
          "en": "Welcome. What will you have?"
        },
        {
          "speaker": "A",
          "jp": "ラーメンをひとつと、餃子をふたつください。",
          "en": "One ramen and two gyoza please."
        },
        {
          "speaker": "Store",
          "jp": "お飲み物はいかがですか？",
          "en": "What would you like to drink?"
        },
        {
          "speaker": "A",
          "jp": "お茶をください。",
          "en": "Green tea please."
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Water please.",
          "answer": "みずをください。"
        },
        {
          "type": "multiple",
          "question": "What do you say before eating?",
          "options": [
            "ごちそうさま",
            "いただきます",
            "おねがいします",
            "ありがとう"
          ],
          "answer": "いただきます"
        }
      ],
      "culturalNote": "いただきます is said before eating, expressing gratitude. ごちそうさまでした is said after eating, thanking the cook or host."
    }
  ]
};
