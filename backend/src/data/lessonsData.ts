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
          "en": ""
        },
        {
          "speaker": "Proverb",
          "jp": "急がば回れ。",
          "en": ""
        },
        {
          "speaker": "Formal Notice",
          "jp": "関係者以外立入るべからず。",
          "en": ""
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
      "culturalNote": "Classical Japanese (文語/古文) appears in proverbs, set phrases, legal texts, formal literature, and signage. N1 candidates must recognize these patterns.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "Speech",
          "jp": "皆様のご健康とご発展を願ってやみません。",
          "en": ""
        },
        {
          "speaker": "Monologue",
          "jp": "知っていながら、言わずにはいられなかった。",
          "en": ""
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
      "culturalNote": "These expressions appear frequently in formal speeches, literary works, essays, and business correspondence. They convey deep sincerity.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "Debate",
          "jp": "相手の主張は事実に即していない。",
          "en": ""
        },
        {
          "speaker": "Paper",
          "jp": "この現象は経済的格差に起因すると見なすことができる。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Based on the data, we can conclude that...",
          "answer": "データをふまえて、〜と結論づけられる。"
        }
      ],
      "culturalNote": "Japanese academic writing heavily uses noun-heavy structures, passive voice, and hedging expressions. Direct assertions are often softened.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "試行錯誤を繰り返した末に、ついに解決策が見つかった。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "まさに一石二鳥ですね！",
          "en": ""
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
      "culturalNote": "四字熟語 are an important part of Japanese literary and formal culture. Many originate from Chinese classics (漢文) and Buddhist teachings.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "Analysis",
          "jp": "少子化を背景に、移民政策の見直しが求められている。",
          "en": ""
        },
        {
          "speaker": "Report",
          "jp": "経済の観点から見ると、この政策は有効だと考えられる。",
          "en": ""
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
      "culturalNote": "The ability to understand NHK news broadcasts and read newspaper articles is a practical benchmark for N1 level Japanese.",
      "kanji": []
    },
    {
      "id": "n1l006",
      "title": "Classical Nuance in Formal Modern Prose",
      "titleJp": "近代文語表現と格調高い文体",
      "level": "N1",
      "order": 6,
      "duration": "60 min",
      "xp": 150,
      "description": "Decipher classical literary particles, archaic verbs, and historic grammatical patterns embedded in official declarations.",
      "vocabulary": [
        "格調",
        "古風",
        "文語体",
        "修辞",
        "格言"
      ],
      "grammar": [
        "〜たるもの",
        "〜べからず",
        "〜んばかり"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "国民の信託を受けた議員たるものは、私利私欲を捨てて公のために尽くすべきだ。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "まさにその通り。不正は許すべからざる行為である。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "As an educator",
          "answer": "きょういくしゃたるもの"
        }
      ],
      "culturalNote": "Classical grammatical markers like 〜たるもの lend an elevated moral authority and gravity to Japanese statecraft.",
      "kanji": []
    },
    {
      "id": "n1l007",
      "title": "Academic Research & Peer Review Discourse",
      "titleJp": "学術論文の批評と討論",
      "level": "N1",
      "order": 7,
      "duration": "55 min",
      "xp": 145,
      "description": "Engage in academic methodology, critique scientific hypotheses, and defend experimental findings.",
      "vocabulary": [
        "仮説",
        "検証",
        "査読",
        "反証",
        "蓋然性"
      ],
      "grammar": [
        "〜と相まって",
        "〜に堪えない",
        "〜であれ"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "緻密なデータ分析と論理的推論が相まって、本論文の説得力は極めて高い。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "いかなる反論であれ、この実証結果を覆すことは困難でしょう。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Coupled with data",
          "answer": "データとあいまって"
        }
      ],
      "culturalNote": "Japanese academic publications require rigorous modesty (謙譲) coupled with indisputable empirical substantiation.",
      "kanji": []
    },
    {
      "id": "n1l008",
      "title": "Corporate Governance & Strategic Mergers",
      "titleJp": "企業統治と事業再編",
      "level": "N1",
      "order": 8,
      "duration": "60 min",
      "xp": 155,
      "description": "Debate shareholder rights, antitrust compliance, corporate acquisition, and executive fiduciary duties.",
      "vocabulary": [
        "買収",
        "取締役会",
        "株主総会",
        "企業価値",
        "再編"
      ],
      "grammar": [
        "〜を余儀なくされる",
        "〜極まりない",
        "〜まじき"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "市場競争の激化により、不採算部門の売却を余儀なくされた。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "取締役として株主の利益を損なうような行動は、あるまじきことだ。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Forced to change plans",
          "answer": "けいかくのへんこうをよぎなくされた"
        }
      ],
      "culturalNote": "Japan's revised Corporate Governance Code places heavy emphasis on independent outside directors and capital efficiency.",
      "kanji": []
    },
    {
      "id": "n1l009",
      "title": "Jurisprudence & Constitutional Philosophy",
      "titleJp": "法哲学と人権擁護の言説",
      "level": "N1",
      "order": 9,
      "duration": "60 min",
      "xp": 150,
      "description": "Analyze legal precedents, judicial interpretations of constitutional rights, and legal equity.",
      "vocabulary": [
        "判例",
        "違憲審査",
        "司法",
        "法治主義",
        "条文"
      ],
      "grammar": [
        "〜に即して",
        "〜を皮切りに",
        "〜ならでは"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "時代の変化に即して、憲法解釈の柔軟な適用が議論されている。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "法治主義の原則を堅持しつつ、国民の基本的人権を守ることが肝要だ。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Conforming to reality",
          "answer": "げんじつにそくして"
        }
      ],
      "culturalNote": "The Supreme Court of Japan (最高裁判所) serves as the ultimate arbiter of constitutional interpretation.",
      "kanji": []
    },
    {
      "id": "n1l010",
      "title": "Literary Critique & Aesthetic Philosophy",
      "titleJp": "日本文学の美意識と哲学的思索",
      "level": "N1",
      "order": 10,
      "duration": "60 min",
      "xp": 160,
      "description": "Explore the aesthetic concepts of 物の哀れ (mono no aware), 幽玄 (yuugen), and わび・さび (wabi-sabi) in classical and modern prose.",
      "vocabulary": [
        "美意識",
        "幽玄",
        "情緒",
        "無常観",
        "文学的"
      ],
      "grammar": [
        "〜きらいがある",
        "〜だに",
        "〜ならでは"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "古典文学に漂う無常観は、日本ならではの美意識の結晶と言えるでしょう。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "桜の散り際を惜しむ心だに、その深遠な精神性を物語っています。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Unique to Japan",
          "answer": "にほんならでは"
        }
      ],
      "culturalNote": "Mono no aware (物の哀れ) captures the gentle sadness of impermanence, famously epitomized in The Tale of Genji (源氏物語).",
      "kanji": []
    },
    {
      "id": "n1l011",
      "title": "Regardless of Fate - ~Nari to mo",
      "titleJp": "〜なりとも - 少しなりとも力になりたい",
      "level": "N1",
      "order": 11,
      "duration": "21 min",
      "xp": 55,
      "description": "Yearning to offer even the slightest sliver of support.",
      "vocabulary": [
        "〜なりとも - 少しなりとも力になりたい"
      ],
      "grammar": [
        "n1_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜なりとも - 少しなりとも力になりたいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Regardless of Fate - ~Nari to mo",
          "answer": "〜なりとも - 少しなりとも力になりたい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Regardless of Fate - ~Nari to mo?",
          "options": [
            "〜なりとも - 少しなりとも力になりたい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜なりとも - 少しなりとも力になりたい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Regardless of Fate - ~Nari to mo）",
          "answer": [
            "〜なりとも - 少しなりとも力になりたい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Regardless of Fate - ~Nari to mo reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l012",
      "title": "Irrespective of Criteria - ~Ikan ni Yorazu",
      "titleJp": "〜いかんによらず - 理由のいかんによらず",
      "level": "N1",
      "order": 12,
      "duration": "22 min",
      "xp": 60,
      "description": "Absolute formal non-negotiability.",
      "vocabulary": [
        "〜いかんによらず - 理由のいかんによらず"
      ],
      "grammar": [
        "n1_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜いかんによらず - 理由のいかんによらずについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Irrespective of Criteria - ~Ikan ni Yorazu",
          "answer": "〜いかんによらず - 理由のいかんによらず"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Irrespective of Criteria - ~Ikan ni Yorazu?",
          "options": [
            "〜いかんによらず - 理由のいかんによらず",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜いかんによらず - 理由のいかんによらず"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Irrespective of Criteria - ~Ikan ni Yorazu）",
          "answer": [
            "〜いかんによらず - 理由のいかんによらず"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Irrespective of Criteria - ~Ikan ni Yorazu reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l013",
      "title": "Governed by - ~Ikan da",
      "titleJp": "〜いかんだ - 合否は君の努力いかんだ",
      "level": "N1",
      "order": 13,
      "duration": "23 min",
      "xp": 65,
      "description": "Total existential dependence on an underlying criterion.",
      "vocabulary": [
        "〜いかんだ - 合否は君の努力いかんだ"
      ],
      "grammar": [
        "n1_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜いかんだ - 合否は君の努力いかんだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Governed by - ~Ikan da",
          "answer": "〜いかんだ - 合否は君の努力いかんだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Governed by - ~Ikan da?",
          "options": [
            "〜いかんだ - 合否は君の努力いかんだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜いかんだ - 合否は君の努力いかんだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Governed by - ~Ikan da）",
          "answer": [
            "〜いかんだ - 合否は君の努力いかんだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Governed by - ~Ikan da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l014",
      "title": "No Wonder at All - ~Koto nashi ni",
      "titleJp": "〜ことなしに - 犠牲を払うことなしに成功はない",
      "level": "N1",
      "order": 14,
      "duration": "24 min",
      "xp": 70,
      "description": "Precluding triumphs without rigorous sacrifice.",
      "vocabulary": [
        "〜ことなしに - 犠牲を払うことなしに成功はない"
      ],
      "grammar": [
        "n1_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ことなしに - 犠牲を払うことなしに成功はないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of No Wonder at All - ~Koto nashi ni",
          "answer": "〜ことなしに - 犠牲を払うことなしに成功はない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about No Wonder at All - ~Koto nashi ni?",
          "options": [
            "〜ことなしに - 犠牲を払うことなしに成功はない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ことなしに - 犠牲を払うことなしに成功はない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（No Wonder at All - ~Koto nashi ni）",
          "answer": [
            "〜ことなしに - 犠牲を払うことなしに成功はない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding No Wonder at All - ~Koto nashi ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l015",
      "title": "Never Ever - ~Koto naku",
      "titleJp": "〜ことなく - 立ち止まることなく前進し続けた",
      "level": "N1",
      "order": 15,
      "duration": "25 min",
      "xp": 50,
      "description": "Uninterrupted lifelong resolve without faltering.",
      "vocabulary": [
        "〜ことなく - 立ち止まることなく前進し続けた"
      ],
      "grammar": [
        "n1_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ことなく - 立ち止まることなく前進し続けたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Never Ever - ~Koto naku",
          "answer": "〜ことなく - 立ち止まることなく前進し続けた"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Never Ever - ~Koto naku?",
          "options": [
            "〜ことなく - 立ち止まることなく前進し続けた",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ことなく - 立ち止まることなく前進し続けた"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Never Ever - ~Koto naku）",
          "answer": [
            "〜ことなく - 立ち止まることなく前進し続けた"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Never Ever - ~Koto naku reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l016",
      "title": "As Long As Breath Holds - ~Kagiri da",
      "titleJp": "〜限りだ - 嬉しい限りでございます",
      "level": "N1",
      "order": 16,
      "duration": "26 min",
      "xp": 55,
      "description": "Utmost emotional limit of personal joy or grief.",
      "vocabulary": [
        "〜限りだ - 嬉しい限りでございます"
      ],
      "grammar": [
        "n1_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜限りだ - 嬉しい限りでございますについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of As Long As Breath Holds - ~Kagiri da",
          "answer": "〜限りだ - 嬉しい限りでございます"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about As Long As Breath Holds - ~Kagiri da?",
          "options": [
            "〜限りだ - 嬉しい限りでございます",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜限りだ - 嬉しい限りでございます"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（As Long As Breath Holds - ~Kagiri da）",
          "answer": [
            "〜限りだ - 嬉しい限りでございます"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding As Long As Breath Holds - ~Kagiri da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l017",
      "title": "Surpassing Human Limits - ~O Koete",
      "titleJp": "〜を超えて - 世代を超えて愛される古典",
      "level": "N1",
      "order": 17,
      "duration": "27 min",
      "xp": 60,
      "description": "Timeless trans-generational appeal.",
      "vocabulary": [
        "〜を超えて - 世代を超えて愛される古典"
      ],
      "grammar": [
        "n1_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜を超えて - 世代を超えて愛される古典について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Surpassing Human Limits - ~O Koete",
          "answer": "〜を超えて - 世代を超えて愛される古典"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Surpassing Human Limits - ~O Koete?",
          "options": [
            "〜を超えて - 世代を超えて愛される古典",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜を超えて - 世代を超えて愛される古典"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Surpassing Human Limits - ~O Koete）",
          "answer": [
            "〜を超えて - 世代を超えて愛される古典"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Surpassing Human Limits - ~O Koete reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l018",
      "title": "In the Guise of - ~O Yosotte",
      "titleJp": "〜を装って - 親切を装って近づく詐欺手口",
      "level": "N1",
      "order": 18,
      "duration": "28 min",
      "xp": 65,
      "description": "Deceptive malice cloaked in benevolent pretenses.",
      "vocabulary": [
        "〜を装って - 親切を装って近づく詐欺手口"
      ],
      "grammar": [
        "n1_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜を装って - 親切を装って近づく詐欺手口について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of In the Guise of - ~O Yosotte",
          "answer": "〜を装って - 親切を装って近づく詐欺手口"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about In the Guise of - ~O Yosotte?",
          "options": [
            "〜を装って - 親切を装って近づく詐欺手口",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜を装って - 親切を装って近づく詐欺手口"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（In the Guise of - ~O Yosotte）",
          "answer": [
            "〜を装って - 親切を装って近づく詐欺手口"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding In the Guise of - ~O Yosotte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l019",
      "title": "Beyond Bounds of Propriety - ~O Kaerimizu",
      "titleJp": "〜を顧みず - 己の保身を顧みず正義を貫く",
      "level": "N1",
      "order": 19,
      "duration": "29 min",
      "xp": 70,
      "description": "Discarding personal self-preservation for righteousness.",
      "vocabulary": [
        "〜を顧みず - 己の保身を顧みず正義を貫く"
      ],
      "grammar": [
        "n1_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜を顧みず - 己の保身を顧みず正義を貫くについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Beyond Bounds of Propriety - ~O Kaerimizu",
          "answer": "〜を顧みず - 己の保身を顧みず正義を貫く"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Beyond Bounds of Propriety - ~O Kaerimizu?",
          "options": [
            "〜を顧みず - 己の保身を顧みず正義を貫く",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜を顧みず - 己の保身を顧みず正義を貫く"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Beyond Bounds of Propriety - ~O Kaerimizu）",
          "answer": [
            "〜を顧みず - 己の保身を顧みず正義を貫く"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Beyond Bounds of Propriety - ~O Kaerimizu reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l020",
      "title": "In Direct Contradiction - ~Ni Hanshite",
      "titleJp": "〜に反して - 予想に反して株価が急落した",
      "level": "N1",
      "order": 20,
      "duration": "20 min",
      "xp": 50,
      "description": "Statistical defiance of established predictive models.",
      "vocabulary": [
        "〜に反して - 予想に反して株価が急落した"
      ],
      "grammar": [
        "n1_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に反して - 予想に反して株価が急落したについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of In Direct Contradiction - ~Ni Hanshite",
          "answer": "〜に反して - 予想に反して株価が急落した"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about In Direct Contradiction - ~Ni Hanshite?",
          "options": [
            "〜に反して - 予想に反して株価が急落した",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に反して - 予想に反して株価が急落した"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（In Direct Contradiction - ~Ni Hanshite）",
          "answer": [
            "〜に反して - 予想に反して株価が急落した"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding In Direct Contradiction - ~Ni Hanshite reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l021",
      "title": "Executive Boardroom Deliberations",
      "titleJp": "取締役会におけるM&A戦略の審議",
      "level": "N1",
      "order": 21,
      "duration": "21 min",
      "xp": 55,
      "description": "High-stakes mergers, acquisitions, and fiduciary governance.",
      "vocabulary": [
        "取締役会におけるM&A戦略の審議"
      ],
      "grammar": [
        "n1_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "取締役会におけるM&A戦略の審議について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Executive Boardroom Deliberations",
          "answer": "取締役会におけるM&A戦略の審議"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Executive Boardroom Deliberations?",
          "options": [
            "取締役会におけるM&A戦略の審議",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "取締役会におけるM&A戦略の審議"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Executive Boardroom Deliberations）",
          "answer": [
            "取締役会におけるM&A戦略の審議"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Executive Boardroom Deliberations reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l022",
      "title": "Constitutional Jurisprudence & Case Law",
      "titleJp": "日本国憲法と最高裁判所判例の精読",
      "level": "N1",
      "order": 22,
      "duration": "22 min",
      "xp": 60,
      "description": "Judicial review, precedents, and civil liberties.",
      "vocabulary": [
        "日本国憲法と最高裁判所判例の精読"
      ],
      "grammar": [
        "n1_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本国憲法と最高裁判所判例の精読について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Constitutional Jurisprudence & Case Law",
          "answer": "日本国憲法と最高裁判所判例の精読"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Constitutional Jurisprudence & Case Law?",
          "options": [
            "日本国憲法と最高裁判所判例の精読",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本国憲法と最高裁判所判例の精読"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Constitutional Jurisprudence & Case Law）",
          "answer": [
            "日本国憲法と最高裁判所判例の精読"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Constitutional Jurisprudence & Case Law reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l023",
      "title": "Diplomatic Protocols & Treaties",
      "titleJp": "国際条約の締結と多国間交渉の外交辞令",
      "level": "N1",
      "order": 23,
      "duration": "23 min",
      "xp": 65,
      "description": "Bilateral treaties, conventions, and diplomatic nuances.",
      "vocabulary": [
        "国際条約の締結と多国間交渉の外交辞令"
      ],
      "grammar": [
        "n1_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "国際条約の締結と多国間交渉の外交辞令について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Diplomatic Protocols & Treaties",
          "answer": "国際条約の締結と多国間交渉の外交辞令"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Diplomatic Protocols & Treaties?",
          "options": [
            "国際条約の締結と多国間交渉の外交辞令",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "国際条約の締結と多国間交渉の外交辞令"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Diplomatic Protocols & Treaties）",
          "answer": [
            "国際条約の締結と多国間交渉の外交辞令"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Diplomatic Protocols & Treaties reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l024",
      "title": "Macroeconomic Monetary Policy",
      "titleJp": "日本銀行の金融政策と長短金利操作（YCC）",
      "level": "N1",
      "order": 24,
      "duration": "24 min",
      "xp": 70,
      "description": "Monetary easing, inflation targets, and yield curves.",
      "vocabulary": [
        "日本銀行の金融政策と長短金利操作（YCC）"
      ],
      "grammar": [
        "n1_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本銀行の金融政策と長短金利操作（YCC）について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Macroeconomic Monetary Policy",
          "answer": "日本銀行の金融政策と長短金利操作（YCC）"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Macroeconomic Monetary Policy?",
          "options": [
            "日本銀行の金融政策と長短金利操作（YCC）",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本銀行の金融政策と長短金利操作（YCC）"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Macroeconomic Monetary Policy）",
          "answer": [
            "日本銀行の金融政策と長短金利操作（YCC）"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Macroeconomic Monetary Policy reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l025",
      "title": "Bioethics in Modern Gene Editing",
      "titleJp": "ゲノム編集と生命倫理を巡る哲学的考察",
      "level": "N1",
      "order": 25,
      "duration": "25 min",
      "xp": 50,
      "description": "CRISPR ethics, germline therapies, and philosophical bounds.",
      "vocabulary": [
        "ゲノム編集と生命倫理を巡る哲学的考察"
      ],
      "grammar": [
        "n1_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ゲノム編集と生命倫理を巡る哲学的考察について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Bioethics in Modern Gene Editing",
          "answer": "ゲノム編集と生命倫理を巡る哲学的考察"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Bioethics in Modern Gene Editing?",
          "options": [
            "ゲノム編集と生命倫理を巡る哲学的考察",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ゲノム編集と生命倫理を巡る哲学的考察"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Bioethics in Modern Gene Editing）",
          "answer": [
            "ゲノム編集と生命倫理を巡る哲学的考察"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Bioethics in Modern Gene Editing reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l026",
      "title": "Civil Code & Property Rights",
      "titleJp": "民法における所有権と不法行為責任の法理",
      "level": "N1",
      "order": 26,
      "duration": "26 min",
      "xp": 55,
      "description": "Tort liability, contractual restitution, and jurisprudence.",
      "vocabulary": [
        "民法における所有権と不法行為責任の法理"
      ],
      "grammar": [
        "n1_g002"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "民法における所有権と不法行為責任の法理について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Civil Code & Property Rights",
          "answer": "民法における所有権と不法行為責任の法理"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Civil Code & Property Rights?",
          "options": [
            "民法における所有権と不法行為責任の法理",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "民法における所有権と不法行為責任の法理"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Civil Code & Property Rights）",
          "answer": [
            "民法における所有権と不法行為責任の法理"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Civil Code & Property Rights reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l027",
      "title": "Corporate Governance & Shareholder Activism",
      "titleJp": "スチュワードシップ・コードと株主総会決議",
      "level": "N1",
      "order": 27,
      "duration": "27 min",
      "xp": 60,
      "description": "Institutional investors, proxy voting, and ESG audits.",
      "vocabulary": [
        "スチュワードシップ・コードと株主総会決議"
      ],
      "grammar": [
        "n1_g003"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "スチュワードシップ・コードと株主総会決議について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Corporate Governance & Shareholder Activism",
          "answer": "スチュワードシップ・コードと株主総会決議"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Corporate Governance & Shareholder Activism?",
          "options": [
            "スチュワードシップ・コードと株主総会決議",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "スチュワードシップ・コードと株主総会決議"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Corporate Governance & Shareholder Activism）",
          "answer": [
            "スチュワードシップ・コードと株主総会決議"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Corporate Governance & Shareholder Activism reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l028",
      "title": "Classical Literary Nuances: Soseki & Akutagawa",
      "titleJp": "夏目漱石『こころ』に見る明治期の近代知識人の苦悩",
      "level": "N1",
      "order": 28,
      "duration": "28 min",
      "xp": 65,
      "description": "Psychological alienation in Meiji intellectual prose.",
      "vocabulary": [
        "夏目漱石『こころ』に見る明治期の近代知識人の苦悩"
      ],
      "grammar": [
        "n1_g004"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "夏目漱石『こころ』に見る明治期の近代知識人の苦悩について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Classical Literary Nuances: Soseki & Akutagawa",
          "answer": "夏目漱石『こころ』に見る明治期の近代知識人の苦悩"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Classical Literary Nuances: Soseki & Akutagawa?",
          "options": [
            "夏目漱石『こころ』に見る明治期の近代知識人の苦悩",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "夏目漱石『こころ』に見る明治期の近代知識人の苦悩"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Classical Literary Nuances: Soseki & Akutagawa）",
          "answer": [
            "夏目漱石『こころ』に見る明治期の近代知識人の苦悩"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Classical Literary Nuances: Soseki & Akutagawa reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l029",
      "title": "Modern Haiku & Waka Poetic Aesthetics",
      "titleJp": "現代俳句における季語の本意と切れ字の美学",
      "level": "N1",
      "order": 29,
      "duration": "29 min",
      "xp": 70,
      "description": "Spatial suspension, seasonal resonance, and kireji.",
      "vocabulary": [
        "現代俳句における季語の本意と切れ字の美学"
      ],
      "grammar": [
        "n1_g005"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "現代俳句における季語の本意と切れ字の美学について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Modern Haiku & Waka Poetic Aesthetics",
          "answer": "現代俳句における季語の本意と切れ字の美学"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Modern Haiku & Waka Poetic Aesthetics?",
          "options": [
            "現代俳句における季語の本意と切れ字の美学",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "現代俳句における季語の本意と切れ字の美学"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Modern Haiku & Waka Poetic Aesthetics）",
          "answer": [
            "現代俳句における季語の本意と切れ字の美学"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Modern Haiku & Waka Poetic Aesthetics reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l030",
      "title": "Philosophical Argumentation: Nishida Kitaro",
      "titleJp": "西田幾多郎『善の研究』における純粋経験の構造",
      "level": "N1",
      "order": 30,
      "duration": "20 min",
      "xp": 50,
      "description": "Pure experience, basho ontology, and Kyoto school.",
      "vocabulary": [
        "西田幾多郎『善の研究』における純粋経験の構造"
      ],
      "grammar": [
        "n1_g006"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "西田幾多郎『善の研究』における純粋経験の構造について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Philosophical Argumentation: Nishida Kitaro",
          "answer": "西田幾多郎『善の研究』における純粋経験の構造"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Philosophical Argumentation: Nishida Kitaro?",
          "options": [
            "西田幾多郎『善の研究』における純粋経験の構造",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "西田幾多郎『善の研究』における純粋経験の構造"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Philosophical Argumentation: Nishida Kitaro）",
          "answer": [
            "西田幾多郎『善の研究』における純粋経験の構造"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Philosophical Argumentation: Nishida Kitaro reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l031",
      "title": "Geopolitical Security & Supply Chains",
      "titleJp": "経済安全保障と半導体サプライチェーンの再構築",
      "level": "N1",
      "order": 31,
      "duration": "21 min",
      "xp": 55,
      "description": "Critical materials resilience and global alliances.",
      "vocabulary": [
        "経済安全保障と半導体サプライチェーンの再構築"
      ],
      "grammar": [
        "n1_g007"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "経済安全保障と半導体サプライチェーンの再構築について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Geopolitical Security & Supply Chains",
          "answer": "経済安全保障と半導体サプライチェーンの再構築"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Geopolitical Security & Supply Chains?",
          "options": [
            "経済安全保障と半導体サプライチェーンの再構築",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "経済安全保障と半導体サプライチェーンの再構築"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Geopolitical Security & Supply Chains）",
          "answer": [
            "経済安全保障と半導体サプライチェーンの再構築"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Geopolitical Security & Supply Chains reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l032",
      "title": "Nuclear Energy & National Energy Mix",
      "titleJp": "原子力発電の再稼働とエネルギー安全保障のジレンマ",
      "level": "N1",
      "order": 32,
      "duration": "22 min",
      "xp": 60,
      "description": "Energy self-sufficiency vs seismic vulnerability.",
      "vocabulary": [
        "原子力発電の再稼働とエネルギー安全保障のジレンマ"
      ],
      "grammar": [
        "n1_g008"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "原子力発電の再稼働とエネルギー安全保障のジレンマについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Nuclear Energy & National Energy Mix",
          "answer": "原子力発電の再稼働とエネルギー安全保障のジレンマ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Nuclear Energy & National Energy Mix?",
          "options": [
            "原子力発電の再稼働とエネルギー安全保障のジレンマ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "原子力発電の再稼働とエネルギー安全保障のジレンマ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Nuclear Energy & National Energy Mix）",
          "answer": [
            "原子力発電の再稼働とエネルギー安全保障のジレンマ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Nuclear Energy & National Energy Mix reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l033",
      "title": "Corporate Succession in Family Dynasties",
      "titleJp": "老舗企業の事業承継と暖簾の継承",
      "level": "N1",
      "order": 33,
      "duration": "23 min",
      "xp": 65,
      "description": "Centuries-old shinise longevity and lineage continuity.",
      "vocabulary": [
        "老舗企業の事業承継と暖簾の継承"
      ],
      "grammar": [
        "n1_g009"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "老舗企業の事業承継と暖簾の継承について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Corporate Succession in Family Dynasties",
          "answer": "老舗企業の事業承継と暖簾の継承"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Corporate Succession in Family Dynasties?",
          "options": [
            "老舗企業の事業承継と暖簾の継承",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "老舗企業の事業承継と暖簾の継承"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Corporate Succession in Family Dynasties）",
          "answer": [
            "老舗企業の事業承継と暖簾の継承"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Corporate Succession in Family Dynasties reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l034",
      "title": "Quantum Computing & Cryptographic Frontiers",
      "titleJp": "量子コンピューティングと耐量子暗号の最前線",
      "level": "N1",
      "order": 34,
      "duration": "24 min",
      "xp": 70,
      "description": "Post-quantum algorithms and computational supremacy.",
      "vocabulary": [
        "量子コンピューティングと耐量子暗号の最前線"
      ],
      "grammar": [
        "n1_g010"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "量子コンピューティングと耐量子暗号の最前線について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Quantum Computing & Cryptographic Frontiers",
          "answer": "量子コンピューティングと耐量子暗号の最前線"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Quantum Computing & Cryptographic Frontiers?",
          "options": [
            "量子コンピューティングと耐量子暗号の最前線",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "量子コンピューティングと耐量子暗号の最前線"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Quantum Computing & Cryptographic Frontiers）",
          "answer": [
            "量子コンピューティングと耐量子暗号の最前線"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Quantum Computing & Cryptographic Frontiers reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l035",
      "title": "Space Exploration Treaties & Commercial Mining",
      "titleJp": "宇宙基本法と月面資源開発の国際秩序",
      "level": "N1",
      "order": 35,
      "duration": "25 min",
      "xp": 50,
      "description": "Lunar accords, space debris, and orbital commerce.",
      "vocabulary": [
        "宇宙基本法と月面資源開発の国際秩序"
      ],
      "grammar": [
        "n1_g011"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "宇宙基本法と月面資源開発の国際秩序について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Space Exploration Treaties & Commercial Mining",
          "answer": "宇宙基本法と月面資源開発の国際秩序"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Space Exploration Treaties & Commercial Mining?",
          "options": [
            "宇宙基本法と月面資源開発の国際秩序",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "宇宙基本法と月面資源開発の国際秩序"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Space Exploration Treaties & Commercial Mining）",
          "answer": [
            "宇宙基本法と月面資源開発の国際秩序"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Space Exploration Treaties & Commercial Mining reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l036",
      "title": "Artificial Intelligence Consciousness & Agency",
      "titleJp": "汎用人工知能（AGI）の意識と法的人格の是非",
      "level": "N1",
      "order": 36,
      "duration": "26 min",
      "xp": 55,
      "description": "Sentience thresholds and legal personhood in autonomous agents.",
      "vocabulary": [
        "汎用人工知能（AGI）の意識と法的人格の是非"
      ],
      "grammar": [
        "n1_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "汎用人工知能（AGI）の意識と法的人格の是非について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Artificial Intelligence Consciousness & Agency",
          "answer": "汎用人工知能（AGI）の意識と法的人格の是非"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Artificial Intelligence Consciousness & Agency?",
          "options": [
            "汎用人工知能（AGI）の意識と法的人格の是非",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "汎用人工知能（AGI）の意識と法的人格の是非"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Artificial Intelligence Consciousness & Agency）",
          "answer": [
            "汎用人工知能（AGI）の意識と法的人格の是非"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Artificial Intelligence Consciousness & Agency reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l037",
      "title": "Urban Regeneration in Megacities",
      "titleJp": "巨大都市東京の再開発と防災都市計画の調和",
      "level": "N1",
      "order": 37,
      "duration": "27 min",
      "xp": 60,
      "description": "Vertical cities, earthquake resilience, and green belts.",
      "vocabulary": [
        "巨大都市東京の再開発と防災都市計画の調和"
      ],
      "grammar": [
        "n1_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "巨大都市東京の再開発と防災都市計画の調和について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Urban Regeneration in Megacities",
          "answer": "巨大都市東京の再開発と防災都市計画の調和"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Urban Regeneration in Megacities?",
          "options": [
            "巨大都市東京の再開発と防災都市計画の調和",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "巨大都市東京の再開発と防災都市計画の調和"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Urban Regeneration in Megacities）",
          "answer": [
            "巨大都市東京の再開発と防災都市計画の調和"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Urban Regeneration in Megacities reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l038",
      "title": "Preserving Intangible Cultural Heritage",
      "titleJp": "ユネスコ無形文化遺産と伝統工芸の継承危機",
      "level": "N1",
      "order": 38,
      "duration": "28 min",
      "xp": 65,
      "description": "Master lacquerware, kabuki lineages, and state subsidies.",
      "vocabulary": [
        "ユネスコ無形文化遺産と伝統工芸の継承危機"
      ],
      "grammar": [
        "n1_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ユネスコ無形文化遺産と伝統工芸の継承危機について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Preserving Intangible Cultural Heritage",
          "answer": "ユネスコ無形文化遺産と伝統工芸の継承危機"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Preserving Intangible Cultural Heritage?",
          "options": [
            "ユネスコ無形文化遺産と伝統工芸の継承危機",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ユネスコ無形文化遺産と伝統工芸の継承危機"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Preserving Intangible Cultural Heritage）",
          "answer": [
            "ユネスコ無形文化遺産と伝統工芸の継承危機"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Preserving Intangible Cultural Heritage reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l039",
      "title": "Neuroscience of Language Acquisition",
      "titleJp": "第二言語習得における脳機能局在と臨界期仮説",
      "level": "N1",
      "order": 39,
      "duration": "29 min",
      "xp": 70,
      "description": "Synaptic plasticity and neural substrates of multilingualism.",
      "vocabulary": [
        "第二言語習得における脳機能局在と臨界期仮説"
      ],
      "grammar": [
        "n1_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "第二言語習得における脳機能局在と臨界期仮説について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Neuroscience of Language Acquisition",
          "answer": "第二言語習得における脳機能局在と臨界期仮説"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Neuroscience of Language Acquisition?",
          "options": [
            "第二言語習得における脳機能局在と臨界期仮説",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "第二言語習得における脳機能局在と臨界期仮説"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Neuroscience of Language Acquisition）",
          "answer": [
            "第二言語習得における脳機能局在と臨界期仮説"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Neuroscience of Language Acquisition reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l040",
      "title": "Environmental Law & Carbon Taxation",
      "titleJp": "炭素税導入と国際炭素国境調整措置（CBAM）",
      "level": "N1",
      "order": 40,
      "duration": "20 min",
      "xp": 50,
      "description": "Emissions trading mechanisms and trade competitiveness.",
      "vocabulary": [
        "炭素税導入と国際炭素国境調整措置（CBAM）"
      ],
      "grammar": [
        "n1_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "炭素税導入と国際炭素国境調整措置（CBAM）について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Environmental Law & Carbon Taxation",
          "answer": "炭素税導入と国際炭素国境調整措置（CBAM）"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Environmental Law & Carbon Taxation?",
          "options": [
            "炭素税導入と国際炭素国境調整措置（CBAM）",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "炭素税導入と国際炭素国境調整措置（CBAM）"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Environmental Law & Carbon Taxation）",
          "answer": [
            "炭素税導入と国際炭素国境調整措置（CBAM）"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Environmental Law & Carbon Taxation reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l041",
      "title": "Labor Market Polarization & Precariat",
      "titleJp": "非正規雇用の拡大と格差社会の構造分析",
      "level": "N1",
      "order": 41,
      "duration": "21 min",
      "xp": 55,
      "description": "Dual labor markets and social safety net restructuring.",
      "vocabulary": [
        "非正規雇用の拡大と格差社会の構造分析"
      ],
      "grammar": [
        "n1_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "非正規雇用の拡大と格差社会の構造分析について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Labor Market Polarization & Precariat",
          "answer": "非正規雇用の拡大と格差社会の構造分析"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Labor Market Polarization & Precariat?",
          "options": [
            "非正規雇用の拡大と格差社会の構造分析",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "非正規雇用の拡大と格差社会の構造分析"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Labor Market Polarization & Precariat）",
          "answer": [
            "非正規雇用の拡大と格差社会の構造分析"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Labor Market Polarization & Precariat reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l042",
      "title": "Postmodern Japanese Architecture",
      "titleJp": "メタボリズム運動と黒川紀章のカプセル建築",
      "level": "N1",
      "order": 42,
      "duration": "22 min",
      "xp": 60,
      "description": "Metabolism, capsule towers, and organic modularity.",
      "vocabulary": [
        "メタボリズム運動と黒川紀章のカプセル建築"
      ],
      "grammar": [
        "n1_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "メタボリズム運動と黒川紀章のカプセル建築について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Postmodern Japanese Architecture",
          "answer": "メタボリズム運動と黒川紀章のカプセル建築"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Postmodern Japanese Architecture?",
          "options": [
            "メタボリズム運動と黒川紀章のカプセル建築",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "メタボリズム運動と黒川紀章のカプセル建築"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Postmodern Japanese Architecture）",
          "answer": [
            "メタボリズム運動と黒川紀章のカプセル建築"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Postmodern Japanese Architecture reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l043",
      "title": "Zen Epistemology in Modern Work",
      "titleJp": "禅宗における直指人心とビジネスにおける直観力",
      "level": "N1",
      "order": 43,
      "duration": "23 min",
      "xp": 65,
      "description": "Mu-shin, koan meditation, and executive clarity.",
      "vocabulary": [
        "禅宗における直指人心とビジネスにおける直観力"
      ],
      "grammar": [
        "n1_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "禅宗における直指人心とビジネスにおける直観力について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Zen Epistemology in Modern Work",
          "answer": "禅宗における直指人心とビジネスにおける直観力"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Zen Epistemology in Modern Work?",
          "options": [
            "禅宗における直指人心とビジネスにおける直観力",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "禅宗における直指人心とビジネスにおける直観力"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Zen Epistemology in Modern Work）",
          "answer": [
            "禅宗における直指人心とビジネスにおける直観力"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Zen Epistemology in Modern Work reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l044",
      "title": "Sino-Japanese Literary Lexicon (Kango)",
      "titleJp": "漢語の受容と明治期における翻訳造語の誕生",
      "level": "N1",
      "order": 44,
      "duration": "24 min",
      "xp": 70,
      "description": "How Meiji scholars coined terms for philosophy and science.",
      "vocabulary": [
        "漢語の受容と明治期における翻訳造語の誕生"
      ],
      "grammar": [
        "n1_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "漢語の受容と明治期における翻訳造語の誕生について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Sino-Japanese Literary Lexicon (Kango)",
          "answer": "漢語の受容と明治期における翻訳造語の誕生"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Sino-Japanese Literary Lexicon (Kango)?",
          "options": [
            "漢語の受容と明治期における翻訳造語の誕生",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "漢語の受容と明治期における翻訳造語の誕生"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Sino-Japanese Literary Lexicon (Kango)）",
          "answer": [
            "漢語の受容と明治期における翻訳造語の誕生"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Sino-Japanese Literary Lexicon (Kango) reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l045",
      "title": "Medical Ethics in End-of-Life Decisions",
      "titleJp": "終末期医療における自己決定権と尊厳死の法制化",
      "level": "N1",
      "order": 45,
      "duration": "25 min",
      "xp": 50,
      "description": "Living wills, palliative care, and bioethics boards.",
      "vocabulary": [
        "終末期医療における自己決定権と尊厳死の法制化"
      ],
      "grammar": [
        "n1_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "終末期医療における自己決定権と尊厳死の法制化について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Medical Ethics in End-of-Life Decisions",
          "answer": "終末期医療における自己決定権と尊厳死の法制化"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Medical Ethics in End-of-Life Decisions?",
          "options": [
            "終末期医療における自己決定権と尊厳死の法制化",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "終末期医療における自己決定権と尊厳死の法制化"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Medical Ethics in End-of-Life Decisions）",
          "answer": [
            "終末期医療における自己決定権と尊厳死の法制化"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Medical Ethics in End-of-Life Decisions reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l046",
      "title": "Cyber Warfare & Critical Infrastructure Defense",
      "titleJp": "サイバー安全保障とインフラ防護の法制度",
      "level": "N1",
      "order": 46,
      "duration": "26 min",
      "xp": 55,
      "description": "Zero-trust paradigms and state-sponsored intrusions.",
      "vocabulary": [
        "サイバー安全保障とインフラ防護の法制度"
      ],
      "grammar": [
        "n1_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "サイバー安全保障とインフラ防護の法制度について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Cyber Warfare & Critical Infrastructure Defense",
          "answer": "サイバー安全保障とインフラ防護の法制度"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Cyber Warfare & Critical Infrastructure Defense?",
          "options": [
            "サイバー安全保障とインフラ防護の法制度",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "サイバー安全保障とインフラ防護の法制度"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Cyber Warfare & Critical Infrastructure Defense）",
          "answer": [
            "サイバー安全保障とインフラ防護の法制度"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Cyber Warfare & Critical Infrastructure Defense reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l047",
      "title": "Micro-Financing & Global Humanitarian Aid",
      "titleJp": "途上国開発援助におけるインパクト投資と持続可能性",
      "level": "N1",
      "order": 47,
      "duration": "27 min",
      "xp": 60,
      "description": "SDG metrics, micro-credit, and grant efficacy.",
      "vocabulary": [
        "途上国開発援助におけるインパクト投資と持続可能性"
      ],
      "grammar": [
        "n1_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "途上国開発援助におけるインパクト投資と持続可能性について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Micro-Financing & Global Humanitarian Aid",
          "answer": "途上国開発援助におけるインパクト投資と持続可能性"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Micro-Financing & Global Humanitarian Aid?",
          "options": [
            "途上国開発援助におけるインパクト投資と持続可能性",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "途上国開発援助におけるインパクト投資と持続可能性"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Micro-Financing & Global Humanitarian Aid）",
          "answer": [
            "途上国開発援助におけるインパクト投資と持続可能性"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Micro-Financing & Global Humanitarian Aid reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l048",
      "title": "Historical Dialectology & Regional Accents",
      "titleJp": "日本語方言の歴史的変遷と東西アクセント境界",
      "level": "N1",
      "order": 48,
      "duration": "28 min",
      "xp": 65,
      "description": "Kansai vs Kanto pitch, Tohoku shifts, and linguistic roots.",
      "vocabulary": [
        "日本語方言の歴史的変遷と東西アクセント境界"
      ],
      "grammar": [
        "n1_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本語方言の歴史的変遷と東西アクセント境界について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Historical Dialectology & Regional Accents",
          "answer": "日本語方言の歴史的変遷と東西アクセント境界"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Historical Dialectology & Regional Accents?",
          "options": [
            "日本語方言の歴史的変遷と東西アクセント境界",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本語方言の歴史的変遷と東西アクセント境界"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Historical Dialectology & Regional Accents）",
          "answer": [
            "日本語方言の歴史的変遷と東西アクセント境界"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Historical Dialectology & Regional Accents reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l049",
      "title": "Hermeneutics of Traditional Performing Arts",
      "titleJp": "能楽の世阿弥『風姿花伝』における秘すれば花",
      "level": "N1",
      "order": 49,
      "duration": "29 min",
      "xp": 70,
      "description": "Subtle beauty (Yugen), flower metaphors, and artistic immortality.",
      "vocabulary": [
        "能楽の世阿弥『風姿花伝』における秘すれば花"
      ],
      "grammar": [
        "n1_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "能楽の世阿弥『風姿花伝』における秘すれば花について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Hermeneutics of Traditional Performing Arts",
          "answer": "能楽の世阿弥『風姿花伝』における秘すれば花"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Hermeneutics of Traditional Performing Arts?",
          "options": [
            "能楽の世阿弥『風姿花伝』における秘すれば花",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "能楽の世阿弥『風姿花伝』における秘すれば花"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Hermeneutics of Traditional Performing Arts）",
          "answer": [
            "能楽の世阿弥『風姿花伝』における秘すれば花"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Hermeneutics of Traditional Performing Arts reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n1l050",
      "title": "N1 Pinnacle: Native-Level Artistry & Intellectual Fluency",
      "titleJp": "N1最高峰の達成と日本語の究極的深化",
      "level": "N1",
      "order": 50,
      "duration": "20 min",
      "xp": 50,
      "description": "Synthesizing deep linguistic artistry into effortless mastery.",
      "vocabulary": [
        "N1最高峰の達成と日本語の究極的深化"
      ],
      "grammar": [
        "n1_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "N1最高峰の達成と日本語の究極的深化について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of N1 Pinnacle: Native-Level Artistry & Intellectual Fluency",
          "answer": "N1最高峰の達成と日本語の究極的深化"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about N1 Pinnacle: Native-Level Artistry & Intellectual Fluency?",
          "options": [
            "N1最高峰の達成と日本語の究極的深化",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "N1最高峰の達成と日本語の究極的深化"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（N1 Pinnacle: Native-Level Artistry & Intellectual Fluency）",
          "answer": [
            "N1最高峰の達成と日本語の究極的深化"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding N1 Pinnacle: Native-Level Artistry & Intellectual Fluency reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "Memo",
          "jp": "本件に関して、ご確認いただきますようお願い申し上げます。",
          "en": ""
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
      "culturalNote": "Business Japanese (ビジネス日本語) has its own set of expressions and formulas. Keigo (敬語) — honorific language — is essential in professional settings.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "Customer",
          "jp": "田中様はいらっしゃいますか？",
          "en": ""
        },
        {
          "speaker": "Staff",
          "jp": "少々お待ちいただけますでしょうか。",
          "en": ""
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
      "culturalNote": "Keigo is fundamental to Japanese professional life. Mistakes in keigo can cause significant social friction in formal settings.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "留学したいとはいえ、お金の問題もあります。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "申し込んだものの、まだ詳細が確認できていません。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Now that I promised, I have to do it.",
          "answer": "約束した以上は、やらなければなりません。"
        }
      ],
      "culturalNote": "〜以上は and 〜からには both mean \"now that / since\" but 以上は is slightly more formal.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "News",
          "jp": "物価上昇に伴い、家計への影響が懸念されている。",
          "en": ""
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
      "culturalNote": "News Japanese often uses passive voice and nominalizations. The style is dense and omits particles more frequently than conversational Japanese.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "健康でさえあれば、他のことは何でもできる。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "彼ほど努力している人はいない。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "As expected of a native speaker, his pronunciation is perfect.",
          "answer": "ネイティブだけあって、発音が完璧だ。"
        }
      ],
      "culturalNote": "〜だけあって acknowledges that a result is natural given a person's background or effort. It always has a positive or expected nuance.",
      "kanji": []
    },
    {
      "id": "n2l006",
      "title": "Executive Presentations & Public Speaking",
      "titleJp": "プレゼンテーションと公式スピーチ",
      "level": "N2",
      "order": 6,
      "duration": "45 min",
      "xp": 110,
      "description": "Structure formal business pitches, introduce project proposals, and address stakeholder questions.",
      "vocabulary": [
        "提言",
        "概略",
        "質疑応答",
        "動向",
        "主旨"
      ],
      "grammar": [
        "〜をはじめとして",
        "〜に際して",
        "〜を踏まえて"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "本日の発表に際して、市場の最新動向を踏まえた提案をいたします。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "興味深いですね。具体的な導入計画をお聞かせください。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Based on current data",
          "answer": "げんじょうのデータをふまえて"
        }
      ],
      "culturalNote": "Japanese business presentations follow the Ki-Shou-Ten-Ketsu or Premise-Analysis-Proposal flow.",
      "kanji": []
    },
    {
      "id": "n2l007",
      "title": "Contract Negotiations & Corporate Inquiries",
      "titleJp": "商談と契約交渉",
      "level": "N2",
      "order": 7,
      "duration": "40 min",
      "xp": 105,
      "description": "Master diplomatic business negotiations, formal concession requests, and contractual terms.",
      "vocabulary": [
        "契約締結",
        "妥協点",
        "条件",
        "合意",
        "猶予"
      ],
      "grammar": [
        "〜を問わず",
        "〜かねる",
        "〜ざるを得ない"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "誠に恐れ入りますが、提示された納期には応じかねます。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "左様でございますか。では再検討せざるを得ませんね。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Unable to accept",
          "answer": "おうじかねます"
        }
      ],
      "culturalNote": "Directly saying \"No\" (いいえ) in Japanese negotiations is avoided; phrases like 応じかねます or 検討いたします are standard.",
      "kanji": []
    },
    {
      "id": "n2l008",
      "title": "Editorial Reading & Media Discourse",
      "titleJp": "論説文とメディア批評",
      "level": "N2",
      "order": 8,
      "duration": "45 min",
      "xp": 115,
      "description": "Analyze newspaper editorials, op-eds, and economic columns with sophisticated grammatical connectors.",
      "vocabulary": [
        "論点",
        "示唆",
        "客観的",
        "主観",
        "世論"
      ],
      "grammar": [
        "〜にほかならない",
        "〜反面",
        "〜つつある"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "デジタル化が進む反面、プライバシーの保護が課題になりつつある。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "技術革新の恩恵を享受するためには、制度の整備にほかならない。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Nothing other than the truth",
          "answer": "しんじつにほかならない"
        }
      ],
      "culturalNote": "JLPT N2 reading comprehension relies heavily on recognizing logical shift markers like 一方で and 反面.",
      "kanji": []
    },
    {
      "id": "n2l009",
      "title": "Demographics & Societal Transformations",
      "titleJp": "少子高齢化と社会構造の変化",
      "level": "N2",
      "order": 9,
      "duration": "40 min",
      "xp": 110,
      "description": "Discuss sociological changes, birthrate dynamics, regional revitalization, and workforce diversification.",
      "vocabulary": [
        "少子化",
        "高齢化",
        "過疎化",
        "雇用",
        "是正"
      ],
      "grammar": [
        "〜に伴って",
        "〜を契機に",
        "〜にわたって"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "高齢化の進展に伴って、社会保障費の増大が懸念されています。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "全国にわたって持続可能な地域社会の構築が急務ですね。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Spanning across the country",
          "answer": "ぜんこくにわたって"
        }
      ],
      "culturalNote": "Regional revitalization (地方創生, chihou sousei) is one of the highest priority socioeconomic initiatives in modern Japan.",
      "kanji": []
    },
    {
      "id": "n2l010",
      "title": "Customer Relations & Crisis Management",
      "titleJp": "危機管理と顧客対応",
      "level": "N2",
      "order": 10,
      "duration": "45 min",
      "xp": 115,
      "description": "Handle customer grievances, issue public apologies, and communicate corrective measures with maximum etiquette.",
      "vocabulary": [
        "謝罪",
        "再発防止",
        "信頼回復",
        "不手際",
        "謹んで"
      ],
      "grammar": [
        "〜をはじめ",
        "〜のみならず",
        "〜に際し"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "この度の不手際に関し、謹んでお詫び申し上げます。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "今後は二度とこのような事態が生じないよう、再発防止を徹底してください。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "We deeply apologize",
          "answer": "つつしんでおわびもうしあげます"
        }
      ],
      "culturalNote": "Formal Japanese corporate apologies follow a codified protocol emphasizing restitution, humility, and root-cause remediation.",
      "kanji": []
    },
    {
      "id": "n2l011",
      "title": "Far from It - ~Dokoroka",
      "titleJp": "〜どころか - 感謝されるどころか怒られた",
      "level": "N2",
      "order": 11,
      "duration": "21 min",
      "xp": 55,
      "description": "Directly defying anticipated outcomes.",
      "vocabulary": [
        "〜どころか - 感謝されるどころか怒られた"
      ],
      "grammar": [
        "n2_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜どころか - 感謝されるどころか怒られたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Far from It - ~Dokoroka",
          "answer": "〜どころか - 感謝されるどころか怒られた"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Far from It - ~Dokoroka?",
          "options": [
            "〜どころか - 感謝されるどころか怒られた",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜どころか - 感謝されるどころか怒られた"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Far from It - ~Dokoroka）",
          "answer": [
            "〜どころか - 感謝されるどころか怒られた"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Far from It - ~Dokoroka reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l012",
      "title": "At Most - ~Tatte",
      "titleJp": "〜たって - 今さら後悔したって遅い",
      "level": "N2",
      "order": 12,
      "duration": "22 min",
      "xp": 60,
      "description": "Expressing futility regardless of current actions.",
      "vocabulary": [
        "〜たって - 今さら後悔したって遅い"
      ],
      "grammar": [
        "n2_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜たって - 今さら後悔したって遅いについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of At Most - ~Tatte",
          "answer": "〜たって - 今さら後悔したって遅い"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about At Most - ~Tatte?",
          "options": [
            "〜たって - 今さら後悔したって遅い",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜たって - 今さら後悔したって遅い"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（At Most - ~Tatte）",
          "answer": [
            "〜たって - 今さら後悔したって遅い"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding At Most - ~Tatte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l013",
      "title": "As If - ~Bakari ni",
      "titleJp": "〜ばかりに - 一言余計なことを言ったばかりに",
      "level": "N2",
      "order": 13,
      "duration": "23 min",
      "xp": 65,
      "description": "Blaming a single catastrophic trigger for failure.",
      "vocabulary": [
        "〜ばかりに - 一言余計なことを言ったばかりに"
      ],
      "grammar": [
        "n2_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ばかりに - 一言余計なことを言ったばかりにについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of As If - ~Bakari ni",
          "answer": "〜ばかりに - 一言余計なことを言ったばかりに"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about As If - ~Bakari ni?",
          "options": [
            "〜ばかりに - 一言余計なことを言ったばかりに",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ばかりに - 一言余計なことを言ったばかりに"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（As If - ~Bakari ni）",
          "answer": [
            "〜ばかりに - 一言余計なことを言ったばかりに"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding As If - ~Bakari ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l014",
      "title": "Every Single Time - ~Tabi ni",
      "titleJp": "〜たびに - 写真を見るたびに思い出す",
      "level": "N2",
      "order": 14,
      "duration": "24 min",
      "xp": 70,
      "description": "Evoking recurrent nostalgic reactions.",
      "vocabulary": [
        "〜たびに - 写真を見るたびに思い出す"
      ],
      "grammar": [
        "n2_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜たびに - 写真を見るたびに思い出すについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Every Single Time - ~Tabi ni",
          "answer": "〜たびに - 写真を見るたびに思い出す"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Every Single Time - ~Tabi ni?",
          "options": [
            "〜たびに - 写真を見るたびに思い出す",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜たびに - 写真を見るたびに思い出す"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Every Single Time - ~Tabi ni）",
          "answer": [
            "〜たびに - 写真を見るたびに思い出す"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Every Single Time - ~Tabi ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l015",
      "title": "Not Only But Also - ~Bakari ka",
      "titleJp": "〜ばかりか - 英語ばかりかフランス語も堪能だ",
      "level": "N2",
      "order": 15,
      "duration": "25 min",
      "xp": 50,
      "description": "Compounding accomplishments across spheres.",
      "vocabulary": [
        "〜ばかりか - 英語ばかりかフランス語も堪能だ"
      ],
      "grammar": [
        "n2_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ばかりか - 英語ばかりかフランス語も堪能だについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Not Only But Also - ~Bakari ka",
          "answer": "〜ばかりか - 英語ばかりかフランス語も堪能だ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Not Only But Also - ~Bakari ka?",
          "options": [
            "〜ばかりか - 英語ばかりかフランス語も堪能だ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ばかりか - 英語ばかりかフランス語も堪能だ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Not Only But Also - ~Bakari ka）",
          "answer": [
            "〜ばかりか - 英語ばかりかフランス語も堪能だ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Not Only But Also - ~Bakari ka reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l016",
      "title": "Nothing Short of - ~Ni Hokanaranai",
      "titleJp": "〜にほかならない - 努力の成果にほかならない",
      "level": "N2",
      "order": 16,
      "duration": "26 min",
      "xp": 55,
      "description": "Asserting the definitive sole root cause.",
      "vocabulary": [
        "〜にほかならない - 努力の成果にほかならない"
      ],
      "grammar": [
        "n2_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜にほかならない - 努力の成果にほかならないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Nothing Short of - ~Ni Hokanaranai",
          "answer": "〜にほかならない - 努力の成果にほかならない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Nothing Short of - ~Ni Hokanaranai?",
          "options": [
            "〜にほかならない - 努力の成果にほかならない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜にほかならない - 努力の成果にほかならない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Nothing Short of - ~Ni Hokanaranai）",
          "answer": [
            "〜にほかならない - 努力の成果にほかならない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Nothing Short of - ~Ni Hokanaranai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l017",
      "title": "Natural Consequence - ~Mono da",
      "titleJp": "〜ものだ - 人は誰でも失敗するものだ",
      "level": "N2",
      "order": 17,
      "duration": "27 min",
      "xp": 60,
      "description": "Reflecting upon human nature and natural truths.",
      "vocabulary": [
        "〜ものだ - 人は誰でも失敗するものだ"
      ],
      "grammar": [
        "n2_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ものだ - 人は誰でも失敗するものだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Natural Consequence - ~Mono da",
          "answer": "〜ものだ - 人は誰でも失敗するものだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Natural Consequence - ~Mono da?",
          "options": [
            "〜ものだ - 人は誰でも失敗するものだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ものだ - 人は誰でも失敗するものだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Natural Consequence - ~Mono da）",
          "answer": [
            "〜ものだ - 人は誰でも失敗するものだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Natural Consequence - ~Mono da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l018",
      "title": "Reflecting Nostalgia - ~Mono da",
      "titleJp": "〜ものだ - 子どもの頃はよく川で泳いだものだ",
      "level": "N2",
      "order": 18,
      "duration": "28 min",
      "xp": 65,
      "description": "Nostalgically recollecting past youth.",
      "vocabulary": [
        "〜ものだ - 子どもの頃はよく川で泳いだものだ"
      ],
      "grammar": [
        "n2_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ものだ - 子どもの頃はよく川で泳いだものだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Reflecting Nostalgia - ~Mono da",
          "answer": "〜ものだ - 子どもの頃はよく川で泳いだものだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Reflecting Nostalgia - ~Mono da?",
          "options": [
            "〜ものだ - 子どもの頃はよく川で泳いだものだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ものだ - 子どもの頃はよく川で泳いだものだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Reflecting Nostalgia - ~Mono da）",
          "answer": [
            "〜ものだ - 子どもの頃はよく川で泳いだものだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Reflecting Nostalgia - ~Mono da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l019",
      "title": "Deep Emotion - ~Mono da",
      "titleJp": "〜ものだ - 時間が経つのは本当に早いものだ",
      "level": "N2",
      "order": 19,
      "duration": "29 min",
      "xp": 70,
      "description": "Expressing deep philosophical awe.",
      "vocabulary": [
        "〜ものだ - 時間が経つのは本当に早いものだ"
      ],
      "grammar": [
        "n2_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ものだ - 時間が経つのは本当に早いものだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Deep Emotion - ~Mono da",
          "answer": "〜ものだ - 時間が経つのは本当に早いものだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Deep Emotion - ~Mono da?",
          "options": [
            "〜ものだ - 時間が経つのは本当に早いものだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ものだ - 時間が経つのは本当に早いものだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Deep Emotion - ~Mono da）",
          "answer": [
            "〜ものだ - 時間が経つのは本当に早いものだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Deep Emotion - ~Mono da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l020",
      "title": "Self-Discipline - ~Beki dewa Nai",
      "titleJp": "〜べきではない - 他人の悪口を言うべきではない",
      "level": "N2",
      "order": 20,
      "duration": "20 min",
      "xp": 50,
      "description": "Articulating moral imperatives and ethics.",
      "vocabulary": [
        "〜べきではない - 他人の悪口を言うべきではない"
      ],
      "grammar": [
        "n2_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜べきではない - 他人の悪口を言うべきではないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Self-Discipline - ~Beki dewa Nai",
          "answer": "〜べきではない - 他人の悪口を言うべきではない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Self-Discipline - ~Beki dewa Nai?",
          "options": [
            "〜べきではない - 他人の悪口を言うべきではない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜べきではない - 他人の悪口を言うべきではない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Self-Discipline - ~Beki dewa Nai）",
          "answer": [
            "〜べきではない - 他人の悪口を言うべきではない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Self-Discipline - ~Beki dewa Nai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l021",
      "title": "Regret Over Duty - ~Beki Datta",
      "titleJp": "〜べきだった - もっと早く準備すべきだった",
      "level": "N2",
      "order": 21,
      "duration": "21 min",
      "xp": 55,
      "description": "Expressing remorse over unfulfilled duty.",
      "vocabulary": [
        "〜べきだった - もっと早く準備すべきだった"
      ],
      "grammar": [
        "n2_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜べきだった - もっと早く準備すべきだったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Regret Over Duty - ~Beki Datta",
          "answer": "〜べきだった - もっと早く準備すべきだった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Regret Over Duty - ~Beki Datta?",
          "options": [
            "〜べきだった - もっと早く準備すべきだった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜べきだった - もっと早く準備すべきだった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Regret Over Duty - ~Beki Datta）",
          "answer": [
            "〜べきだった - もっと早く準備すべきだった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Regret Over Duty - ~Beki Datta reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l022",
      "title": "I Wonder If It Can Be - ~Mono ka",
      "titleJp": "〜ものか - 二度とあんな店に行くものか",
      "level": "N2",
      "order": 22,
      "duration": "22 min",
      "xp": 60,
      "description": "Vigorously repudiating an assertion.",
      "vocabulary": [
        "〜ものか - 二度とあんな店に行くものか"
      ],
      "grammar": [
        "n2_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ものか - 二度とあんな店に行くものかについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of I Wonder If It Can Be - ~Mono ka",
          "answer": "〜ものか - 二度とあんな店に行くものか"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about I Wonder If It Can Be - ~Mono ka?",
          "options": [
            "〜ものか - 二度とあんな店に行くものか",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ものか - 二度とあんな店に行くものか"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（I Wonder If It Can Be - ~Mono ka）",
          "answer": [
            "〜ものか - 二度とあんな店に行くものか"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding I Wonder If It Can Be - ~Mono ka reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l023",
      "title": "Due to Sensitivity - ~Amari",
      "titleJp": "〜あまり - 緊張のあまり声が出なかった",
      "level": "N2",
      "order": 23,
      "duration": "23 min",
      "xp": 65,
      "description": "Psychological overwhelm impeding normal function.",
      "vocabulary": [
        "〜あまり - 緊張のあまり声が出なかった"
      ],
      "grammar": [
        "n2_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜あまり - 緊張のあまり声が出なかったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Due to Sensitivity - ~Amari",
          "answer": "〜あまり - 緊張のあまり声が出なかった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Due to Sensitivity - ~Amari?",
          "options": [
            "〜あまり - 緊張のあまり声が出なかった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜あまり - 緊張のあまり声が出なかった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Due to Sensitivity - ~Amari）",
          "answer": [
            "〜あまり - 緊張のあまり声が出なかった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Due to Sensitivity - ~Amari reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l024",
      "title": "No Choice Given Rules - ~Zaru o Enai",
      "titleJp": "〜ざるを得ない - 辞任せざるを得ない",
      "level": "N2",
      "order": 24,
      "duration": "24 min",
      "xp": 70,
      "description": "Official institutional concession under pressure.",
      "vocabulary": [
        "〜ざるを得ない - 辞任せざるを得ない"
      ],
      "grammar": [
        "n2_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ざるを得ない - 辞任せざるを得ないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of No Choice Given Rules - ~Zaru o Enai",
          "answer": "〜ざるを得ない - 辞任せざるを得ない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about No Choice Given Rules - ~Zaru o Enai?",
          "options": [
            "〜ざるを得ない - 辞任せざるを得ない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ざるを得ない - 辞任せざるを得ない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（No Choice Given Rules - ~Zaru o Enai）",
          "answer": [
            "〜ざるを得ない - 辞任せざるを得ない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding No Choice Given Rules - ~Zaru o Enai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l025",
      "title": "Hard to Do Emotionally - ~Gatai",
      "titleJp": "〜がたい - 信じがたい奇跡",
      "level": "N2",
      "order": 25,
      "duration": "25 min",
      "xp": 50,
      "description": "Psychological barrier preventing belief or forgiveness.",
      "vocabulary": [
        "〜がたい - 信じがたい奇跡"
      ],
      "grammar": [
        "n2_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜がたい - 信じがたい奇跡について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Hard to Do Emotionally - ~Gatai",
          "answer": "〜がたい - 信じがたい奇跡"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Hard to Do Emotionally - ~Gatai?",
          "options": [
            "〜がたい - 信じがたい奇跡",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜がたい - 信じがたい奇跡"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Hard to Do Emotionally - ~Gatai）",
          "answer": [
            "〜がたい - 信じがたい奇跡"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Hard to Do Emotionally - ~Gatai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l026",
      "title": "Cannot Complete - ~Kirenai",
      "titleJp": "〜きれない - 数えきれないほどの星",
      "level": "N2",
      "order": 26,
      "duration": "26 min",
      "xp": 55,
      "description": "Inexhaustible quantity surpassing completion.",
      "vocabulary": [
        "〜きれない - 数えきれないほどの星"
      ],
      "grammar": [
        "n2_g002"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜きれない - 数えきれないほどの星について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Cannot Complete - ~Kirenai",
          "answer": "〜きれない - 数えきれないほどの星"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Cannot Complete - ~Kirenai?",
          "options": [
            "〜きれない - 数えきれないほどの星",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜きれない - 数えきれないほどの星"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Cannot Complete - ~Kirenai）",
          "answer": [
            "〜きれない - 数えきれないほどの星"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Cannot Complete - ~Kirenai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l027",
      "title": "Completely Consumed - ~Kiru",
      "titleJp": "〜きる - 力を出しきる",
      "level": "N2",
      "order": 27,
      "duration": "27 min",
      "xp": 60,
      "description": "Exhausting energy or resources to the last drop.",
      "vocabulary": [
        "〜きる - 力を出しきる"
      ],
      "grammar": [
        "n2_g003"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜きる - 力を出しきるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Completely Consumed - ~Kiru",
          "answer": "〜きる - 力を出しきる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Completely Consumed - ~Kiru?",
          "options": [
            "〜きる - 力を出しきる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜きる - 力を出しきる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Completely Consumed - ~Kiru）",
          "answer": [
            "〜きる - 力を出しきる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Completely Consumed - ~Kiru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l028",
      "title": "Can/Cannot Bear - ~Eru / ~Enai",
      "titleJp": "〜得る・〜得ない - 起こり得るリスク",
      "level": "N2",
      "order": 28,
      "duration": "28 min",
      "xp": 65,
      "description": "Formal evaluation of theoretical possibilities.",
      "vocabulary": [
        "〜得る・〜得ない - 起こり得るリスク"
      ],
      "grammar": [
        "n2_g004"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜得る・〜得ない - 起こり得るリスクについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Can/Cannot Bear - ~Eru / ~Enai",
          "answer": "〜得る・〜得ない - 起こり得るリスク"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Can/Cannot Bear - ~Eru / ~Enai?",
          "options": [
            "〜得る・〜得ない - 起こり得るリスク",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜得る・〜得ない - 起こり得るリスク"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Can/Cannot Bear - ~Eru / ~Enai）",
          "answer": [
            "〜得る・〜得ない - 起こり得るリスク"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Can/Cannot Bear - ~Eru / ~Enai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l029",
      "title": "On the Pretense of - ~Ni Kakotsukete",
      "titleJp": "〜にかこつけて - 出張にかこつけて観光する",
      "level": "N2",
      "order": 29,
      "duration": "29 min",
      "xp": 70,
      "description": "Using a pretext to mask personal intentions.",
      "vocabulary": [
        "〜にかこつけて - 出張にかこつけて観光する"
      ],
      "grammar": [
        "n2_g005"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜にかこつけて - 出張にかこつけて観光するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of On the Pretense of - ~Ni Kakotsukete",
          "answer": "〜にかこつけて - 出張にかこつけて観光する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about On the Pretense of - ~Ni Kakotsukete?",
          "options": [
            "〜にかこつけて - 出張にかこつけて観光する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜にかこつけて - 出張にかこつけて観光する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（On the Pretense of - ~Ni Kakotsukete）",
          "answer": [
            "〜にかこつけて - 出張にかこつけて観光する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding On the Pretense of - ~Ni Kakotsukete reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l030",
      "title": "Regardless of Outcome - ~Dou Are",
      "titleJp": "〜どうあれ - 結果がどうあれ全力を尽くす",
      "level": "N2",
      "order": 30,
      "duration": "20 min",
      "xp": 50,
      "description": "Steadfast resolve indifferent to consequences.",
      "vocabulary": [
        "〜どうあれ - 結果がどうあれ全力を尽くす"
      ],
      "grammar": [
        "n2_g006"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜どうあれ - 結果がどうあれ全力を尽くすについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Regardless of Outcome - ~Dou Are",
          "answer": "〜どうあれ - 結果がどうあれ全力を尽くす"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Regardless of Outcome - ~Dou Are?",
          "options": [
            "〜どうあれ - 結果がどうあれ全力を尽くす",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜どうあれ - 結果がどうあれ全力を尽くす"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Regardless of Outcome - ~Dou Are）",
          "answer": [
            "〜どうあれ - 結果がどうあれ全力を尽くす"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Regardless of Outcome - ~Dou Are reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l031",
      "title": "Formal Corporate Proposals",
      "titleJp": "新規事業提案書の構成と論理展開",
      "level": "N2",
      "order": 31,
      "duration": "21 min",
      "xp": 55,
      "description": "Drafting structured enterprise proposals.",
      "vocabulary": [
        "新規事業提案書の構成と論理展開"
      ],
      "grammar": [
        "n2_g007"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "新規事業提案書の構成と論理展開について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Formal Corporate Proposals",
          "answer": "新規事業提案書の構成と論理展開"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Formal Corporate Proposals?",
          "options": [
            "新規事業提案書の構成と論理展開",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "新規事業提案書の構成と論理展開"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Formal Corporate Proposals）",
          "answer": [
            "新規事業提案書の構成と論理展開"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Formal Corporate Proposals reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l032",
      "title": "Client Contract Negotiations",
      "titleJp": "取引先との契約条件のすり合わせ",
      "level": "N2",
      "order": 32,
      "duration": "22 min",
      "xp": 60,
      "description": "Terms, liability limits, and NDA stipulations.",
      "vocabulary": [
        "取引先との契約条件のすり合わせ"
      ],
      "grammar": [
        "n2_g008"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "取引先との契約条件のすり合わせについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Client Contract Negotiations",
          "answer": "取引先との契約条件のすり合わせ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Client Contract Negotiations?",
          "options": [
            "取引先との契約条件のすり合わせ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "取引先との契約条件のすり合わせ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Client Contract Negotiations）",
          "answer": [
            "取引先との契約条件のすり合わせ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Client Contract Negotiations reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l033",
      "title": "Corporate Apologies & Crisis Management",
      "titleJp": "不祥事・システム障害における記者会見と謝罪",
      "level": "N2",
      "order": 33,
      "duration": "23 min",
      "xp": 65,
      "description": "Corporate crisis containment phrasing.",
      "vocabulary": [
        "不祥事・システム障害における記者会見と謝罪"
      ],
      "grammar": [
        "n2_g009"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "不祥事・システム障害における記者会見と謝罪について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Corporate Apologies & Crisis Management",
          "answer": "不祥事・システム障害における記者会見と謝罪"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Corporate Apologies & Crisis Management?",
          "options": [
            "不祥事・システム障害における記者会見と謝罪",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "不祥事・システム障害における記者会見と謝罪"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Corporate Apologies & Crisis Management）",
          "answer": [
            "不祥事・システム障害における記者会見と謝罪"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Corporate Apologies & Crisis Management reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l034",
      "title": "Financial Statement Analysis",
      "titleJp": "決算短信と財務諸表の読解",
      "level": "N2",
      "order": 34,
      "duration": "24 min",
      "xp": 70,
      "description": "Operating income, balance sheets, and dividends.",
      "vocabulary": [
        "決算短信と財務諸表の読解"
      ],
      "grammar": [
        "n2_g010"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "決算短信と財務諸表の読解について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Financial Statement Analysis",
          "answer": "決算短信と財務諸表の読解"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Financial Statement Analysis?",
          "options": [
            "決算短信と財務諸表の読解",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "決算短信と財務諸表の読解"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Financial Statement Analysis）",
          "answer": [
            "決算短信と財務諸表の読解"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Financial Statement Analysis reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l035",
      "title": "Cross-Cultural Team Leadership",
      "titleJp": "多国籍チームにおけるリーダーシップと合意形成",
      "level": "N2",
      "order": 35,
      "duration": "25 min",
      "xp": 50,
      "description": "Facilitating multinational consensus in Tokyo offices.",
      "vocabulary": [
        "多国籍チームにおけるリーダーシップと合意形成"
      ],
      "grammar": [
        "n2_g011"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "多国籍チームにおけるリーダーシップと合意形成について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Cross-Cultural Team Leadership",
          "answer": "多国籍チームにおけるリーダーシップと合意形成"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Cross-Cultural Team Leadership?",
          "options": [
            "多国籍チームにおけるリーダーシップと合意形成",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "多国籍チームにおけるリーダーシップと合意形成"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Cross-Cultural Team Leadership）",
          "answer": [
            "多国籍チームにおけるリーダーシップと合意形成"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Cross-Cultural Team Leadership reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l036",
      "title": "Intellectual Property & Patents",
      "titleJp": "特許出願と著作権保護の基礎",
      "level": "N2",
      "order": 36,
      "duration": "26 min",
      "xp": 55,
      "description": "Trademarks, trade secrets, and compliance.",
      "vocabulary": [
        "特許出願と著作権保護の基礎"
      ],
      "grammar": [
        "n2_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "特許出願と著作権保護の基礎について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Intellectual Property & Patents",
          "answer": "特許出願と著作権保護の基礎"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Intellectual Property & Patents?",
          "options": [
            "特許出願と著作権保護の基礎",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "特許出願と著作権保護の基礎"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Intellectual Property & Patents）",
          "answer": [
            "特許出願と著作権保護の基礎"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Intellectual Property & Patents reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l037",
      "title": "Labor Law & Workplace Rights",
      "titleJp": "日本の労働法・有給休暇・労基署の役割",
      "level": "N2",
      "order": 37,
      "duration": "27 min",
      "xp": 60,
      "description": "Overtime regulations, labor boards, and severance.",
      "vocabulary": [
        "日本の労働法・有給休暇・労基署の役割"
      ],
      "grammar": [
        "n2_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本の労働法・有給休暇・労基署の役割について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Labor Law & Workplace Rights",
          "answer": "日本の労働法・有給休暇・労基署の役割"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Labor Law & Workplace Rights?",
          "options": [
            "日本の労働法・有給休暇・労基署の役割",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本の労働法・有給休暇・労基署の役割"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Labor Law & Workplace Rights）",
          "answer": [
            "日本の労働法・有給休暇・労基署の役割"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Labor Law & Workplace Rights reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l038",
      "title": "Editorial Column Interpretation",
      "titleJp": "朝日新聞『天声人語』の論理とレトリック",
      "level": "N2",
      "order": 38,
      "duration": "28 min",
      "xp": 65,
      "description": "Analyzing high-level op-ed literary structure.",
      "vocabulary": [
        "朝日新聞『天声人語』の論理とレトリック"
      ],
      "grammar": [
        "n2_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "朝日新聞『天声人語』の論理とレトリックについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Editorial Column Interpretation",
          "answer": "朝日新聞『天声人語』の論理とレトリック"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Editorial Column Interpretation?",
          "options": [
            "朝日新聞『天声人語』の論理とレトリック",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "朝日新聞『天声人語』の論理とレトリック"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Editorial Column Interpretation）",
          "answer": [
            "朝日新聞『天声人語』の論理とレトリック"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Editorial Column Interpretation reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l039",
      "title": "Analyzing Modern Societal Issues",
      "titleJp": "少子高齢化と社会保障の持続可能性",
      "level": "N2",
      "order": 39,
      "duration": "29 min",
      "xp": 70,
      "description": "Demographic crisis and social pension debates.",
      "vocabulary": [
        "少子高齢化と社会保障の持続可能性"
      ],
      "grammar": [
        "n2_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "少子高齢化と社会保障の持続可能性について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Analyzing Modern Societal Issues",
          "answer": "少子高齢化と社会保障の持続可能性"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Analyzing Modern Societal Issues?",
          "options": [
            "少子高齢化と社会保障の持続可能性",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "少子高齢化と社会保障の持続可能性"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Analyzing Modern Societal Issues）",
          "answer": [
            "少子高齢化と社会保障の持続可能性"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Analyzing Modern Societal Issues reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l040",
      "title": "Artificial Intelligence & Labor Dynamics",
      "titleJp": "AI導入が雇用構造に与える影響の議論",
      "level": "N2",
      "order": 40,
      "duration": "20 min",
      "xp": 50,
      "description": "Technological shifts in Japanese conglomerates.",
      "vocabulary": [
        "AI導入が雇用構造に与える影響の議論"
      ],
      "grammar": [
        "n2_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "AI導入が雇用構造に与える影響の議論について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Artificial Intelligence & Labor Dynamics",
          "answer": "AI導入が雇用構造に与える影響の議論"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Artificial Intelligence & Labor Dynamics?",
          "options": [
            "AI導入が雇用構造に与える影響の議論",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "AI導入が雇用構造に与える影響の議論"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Artificial Intelligence & Labor Dynamics）",
          "answer": [
            "AI導入が雇用構造に与える影響の議論"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Artificial Intelligence & Labor Dynamics reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l041",
      "title": "Environmental Policies & Green Transition",
      "titleJp": "脱炭素社会と再生可能エネルギー戦略",
      "level": "N2",
      "order": 41,
      "duration": "21 min",
      "xp": 55,
      "description": "Carbon neutrality pledges and industrial transitions.",
      "vocabulary": [
        "脱炭素社会と再生可能エネルギー戦略"
      ],
      "grammar": [
        "n2_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "脱炭素社会と再生可能エネルギー戦略について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Environmental Policies & Green Transition",
          "answer": "脱炭素社会と再生可能エネルギー戦略"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Environmental Policies & Green Transition?",
          "options": [
            "脱炭素社会と再生可能エネルギー戦略",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "脱炭素社会と再生可能エネルギー戦略"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Environmental Policies & Green Transition）",
          "answer": [
            "脱炭素社会と再生可能エネルギー戦略"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Environmental Policies & Green Transition reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l042",
      "title": "Japanese Consumer Psychology",
      "titleJp": "日本市場における消費者行動とブランド戦略",
      "level": "N2",
      "order": 42,
      "duration": "22 min",
      "xp": 60,
      "description": "Omotenashi, consumer trust, and packaging finesse.",
      "vocabulary": [
        "日本市場における消費者行動とブランド戦略"
      ],
      "grammar": [
        "n2_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本市場における消費者行動とブランド戦略について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Japanese Consumer Psychology",
          "answer": "日本市場における消費者行動とブランド戦略"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Japanese Consumer Psychology?",
          "options": [
            "日本市場における消費者行動とブランド戦略",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本市場における消費者行動とブランド戦略"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Japanese Consumer Psychology）",
          "answer": [
            "日本市場における消費者行動とブランド戦略"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Japanese Consumer Psychology reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l043",
      "title": "Navigating Japanese Legal Documents",
      "titleJp": "利用規約とプライバシーポリシーの読解",
      "level": "N2",
      "order": 43,
      "duration": "23 min",
      "xp": 65,
      "description": "Deciphering dense contractual legalese.",
      "vocabulary": [
        "利用規約とプライバシーポリシーの読解"
      ],
      "grammar": [
        "n2_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "利用規約とプライバシーポリシーの読解について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Navigating Japanese Legal Documents",
          "answer": "利用規約とプライバシーポリシーの読解"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Navigating Japanese Legal Documents?",
          "options": [
            "利用規約とプライバシーポリシーの読解",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "利用規約とプライバシーポリシーの読解"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Navigating Japanese Legal Documents）",
          "answer": [
            "利用規約とプライバシーポリシーの読解"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Navigating Japanese Legal Documents reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l044",
      "title": "Academic Research Abstract Writing",
      "titleJp": "学会発表要旨と論文アブストラクトの書き方",
      "level": "N2",
      "order": 44,
      "duration": "24 min",
      "xp": 70,
      "description": "Academic precision in peer-reviewed formats.",
      "vocabulary": [
        "学会発表要旨と論文アブストラクトの書き方"
      ],
      "grammar": [
        "n2_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "学会発表要旨と論文アブストラクトの書き方について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Academic Research Abstract Writing",
          "answer": "学会発表要旨と論文アブストラクトの書き方"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Academic Research Abstract Writing?",
          "options": [
            "学会発表要旨と論文アブストラクトの書き方",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "学会発表要旨と論文アブストラクトの書き方"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Academic Research Abstract Writing）",
          "answer": [
            "学会発表要旨と論文アブストラクトの書き方"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Academic Research Abstract Writing reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l045",
      "title": "Debate: Remote Work vs Office Attendance",
      "titleJp": "在宅勤務と対面出社を巡るディベート",
      "level": "N2",
      "order": 45,
      "duration": "25 min",
      "xp": 50,
      "description": "Work-from-home vs face-to-face synergy debates.",
      "vocabulary": [
        "在宅勤務と対面出社を巡るディベート"
      ],
      "grammar": [
        "n2_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "在宅勤務と対面出社を巡るディベートについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Debate: Remote Work vs Office Attendance",
          "answer": "在宅勤務と対面出社を巡るディベート"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Debate: Remote Work vs Office Attendance?",
          "options": [
            "在宅勤務と対面出社を巡るディベート",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "在宅勤務と対面出社を巡るディベート"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Debate: Remote Work vs Office Attendance）",
          "answer": [
            "在宅勤務と対面出社を巡るディベート"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Debate: Remote Work vs Office Attendance reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l046",
      "title": "Japanese Architectural Philosophy",
      "titleJp": "数寄屋造りと現代建築の融合",
      "level": "N2",
      "order": 46,
      "duration": "26 min",
      "xp": 55,
      "description": "Kenzo Tange, Kengo Kuma, and spatial aesthetics.",
      "vocabulary": [
        "数寄屋造りと現代建築の融合"
      ],
      "grammar": [
        "n2_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "数寄屋造りと現代建築の融合について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Japanese Architectural Philosophy",
          "answer": "数寄屋造りと現代建築の融合"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Japanese Architectural Philosophy?",
          "options": [
            "数寄屋造りと現代建築の融合",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "数寄屋造りと現代建築の融合"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Japanese Architectural Philosophy）",
          "answer": [
            "数寄屋造りと現代建築の融合"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Japanese Architectural Philosophy reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l047",
      "title": "Wabi-Sabi & The Philosophy of Imperfection",
      "titleJp": "侘び寂びと日本的美意識の本質",
      "level": "N2",
      "order": 47,
      "duration": "27 min",
      "xp": 60,
      "description": "Tea ceremony, kintsugi, and mindfulness in crafts.",
      "vocabulary": [
        "侘び寂びと日本的美意識の本質"
      ],
      "grammar": [
        "n2_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "侘び寂びと日本的美意識の本質について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Wabi-Sabi & The Philosophy of Imperfection",
          "answer": "侘び寂びと日本的美意識の本質"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Wabi-Sabi & The Philosophy of Imperfection?",
          "options": [
            "侘び寂びと日本的美意識の本質",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "侘び寂びと日本的美意識の本質"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Wabi-Sabi & The Philosophy of Imperfection）",
          "answer": [
            "侘び寂びと日本的美意識の本質"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Wabi-Sabi & The Philosophy of Imperfection reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l048",
      "title": "History of the Showa Economic Miracle",
      "titleJp": "戦後復興と高度経済成長期の教訓",
      "level": "N2",
      "order": 48,
      "duration": "28 min",
      "xp": 65,
      "description": "Keiretsu, MITI, and industrial resurrection.",
      "vocabulary": [
        "戦後復興と高度経済成長期の教訓"
      ],
      "grammar": [
        "n2_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "戦後復興と高度経済成長期の教訓について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of History of the Showa Economic Miracle",
          "answer": "戦後復興と高度経済成長期の教訓"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about History of the Showa Economic Miracle?",
          "options": [
            "戦後復興と高度経済成長期の教訓",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "戦後復興と高度経済成長期の教訓"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（History of the Showa Economic Miracle）",
          "answer": [
            "戦後復興と高度経済成長期の教訓"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding History of the Showa Economic Miracle reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l049",
      "title": "Sustainable Tourism in Historical Districts",
      "titleJp": "観光公害（オーバーツーリズム）と地域共生",
      "level": "N2",
      "order": 49,
      "duration": "29 min",
      "xp": 70,
      "description": "Balancing inbound tourism with residential serenity.",
      "vocabulary": [
        "観光公害（オーバーツーリズム）と地域共生"
      ],
      "grammar": [
        "n2_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "観光公害（オーバーツーリズム）と地域共生について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Sustainable Tourism in Historical Districts",
          "answer": "観光公害（オーバーツーリズム）と地域共生"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Sustainable Tourism in Historical Districts?",
          "options": [
            "観光公害（オーバーツーリズム）と地域共生",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "観光公害（オーバーツーリズム）と地域共生"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Sustainable Tourism in Historical Districts）",
          "answer": [
            "観光公害（オーバーツーリズム）と地域共生"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Sustainable Tourism in Historical Districts reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n2l050",
      "title": "N2 Milestone: Advanced Fluency and Professional Autonomy",
      "titleJp": "N2修了と実務完全自立への道",
      "level": "N2",
      "order": 50,
      "duration": "20 min",
      "xp": 50,
      "description": "Mastering sophisticated nuance in professional life.",
      "vocabulary": [
        "N2修了と実務完全自立への道"
      ],
      "grammar": [
        "n2_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "N2修了と実務完全自立への道について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of N2 Milestone: Advanced Fluency and Professional Autonomy",
          "answer": "N2修了と実務完全自立への道"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about N2 Milestone: Advanced Fluency and Professional Autonomy?",
          "options": [
            "N2修了と実務完全自立への道",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "N2修了と実務完全自立への道"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（N2 Milestone: Advanced Fluency and Professional Autonomy）",
          "answer": [
            "N2修了と実務完全自立への道"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding N2 Milestone: Advanced Fluency and Professional Autonomy reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "逆に、私は体調が悪かったせいで、試験に集中できませんでした。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "来年のためにも、もっと準備をしましょう。",
          "en": ""
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
      "culturalNote": "おかげで implies positive outcome; せいで implies negative outcome. Using them incorrectly can seem sarcastic.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "彼は知っているくせに、知らないふりをしている。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "都市は便利な一方で、自然が少ない。",
          "en": ""
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
      "culturalNote": "くせに is stronger and more critical than のに. It implies the speaker thinks the subject should know better.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "健康のためには、もっと野菜を食べるべきです。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "そうですね。毎日運動する必要がありますね。",
          "en": ""
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
      "culturalNote": "べきだ expresses a moral obligation or advice; なければならない is a stronger, more external obligation.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "山田さんは来週旅行に行くと言っていましたよ。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "部長から、会議が延期されたとのことです。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Tanaka said he is tired.",
          "answer": "田中さんは疲れたと言っていました。"
        }
      ],
      "culturalNote": "Japanese reported speech does not always change tense like English does. Context and time expressions carry tense information.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "最近、手紙を書く人が少なくなりましたね。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "技術はこれからもっと発展していくでしょう。",
          "en": ""
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
      "culturalNote": "てくる implies a change coming toward the present from the past; ていく implies a change going away into the future.",
      "kanji": []
    },
    {
      "id": "n3l006",
      "title": "Explaining Circumstances and Nuances",
      "titleJp": "事情説明とニュアンス",
      "level": "N3",
      "order": 6,
      "duration": "35 min",
      "xp": 85,
      "description": "Express complex reasoning and clarify misunderstandings using 〜わけだ and 〜わけではない.",
      "vocabulary": [
        "事情",
        "誤解",
        "納得",
        "弁明",
        "理由"
      ],
      "grammar": [
        "〜わけだ",
        "〜わけではない",
        "〜わけがない"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "彼、急に国へ帰ったらしいよ。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "お母さんが病気になったそうだ。それで急いで帰国したわけだね。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "It is not that I dislike it",
          "answer": "きらいなわけではない"
        },
        {
          "type": "fill",
          "question": "そんなはずが___。",
          "answer": [
            "ない"
          ]
        }
      ],
      "culturalNote": "〜わけだ shows that you have synthesized the facts and empathetically understand the situation.",
      "kanji": []
    },
    {
      "id": "n3l007",
      "title": "Contrasts and Surprising Outcomes",
      "titleJp": "対比と予想外の結果",
      "level": "N3",
      "order": 7,
      "duration": "30 min",
      "xp": 80,
      "description": "Compare expectations with reality using 〜わりに and 〜くせに.",
      "vocabulary": [
        "評価",
        "外見",
        "価格",
        "結果",
        "努力"
      ],
      "grammar": [
        "〜わりに",
        "〜くせに",
        "〜にもかかわらず"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "このパソコン、安かったのにすごく速いですね。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "値段のわりには性能が良いと評判ですよ。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Considering the price, it is delicious",
          "answer": "ねだんのわりにおいしい"
        }
      ],
      "culturalNote": "Nuance matters: 〜くせに is strictly derogatory and should never be used toward customers or superiors.",
      "kanji": []
    },
    {
      "id": "n3l008",
      "title": "Business Meetings & Problem Solving",
      "titleJp": "業務連絡と課題解決",
      "level": "N3",
      "order": 8,
      "duration": "40 min",
      "xp": 95,
      "description": "Communicate project updates, report delays, and offer collaborative solutions.",
      "vocabulary": [
        "進捗",
        "課題",
        "納期",
        "検討",
        "対応"
      ],
      "grammar": [
        "〜に関して",
        "〜について",
        "〜おそれがある"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "プロジェクトの進捗に関してご報告があります。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "納期に遅れるおそれがありますか。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Regarding this problem",
          "answer": "このもんだいにかんして"
        }
      ],
      "culturalNote": "The Japanese business reporting framework Horenso (報告・連絡・相談) is vital in team dynamics.",
      "kanji": []
    },
    {
      "id": "n3l009",
      "title": "Healthcare & Clinical Visits",
      "titleJp": "健康と病院での症状説明",
      "level": "N3",
      "order": 9,
      "duration": "30 min",
      "xp": 85,
      "description": "Describe medical symptoms, fever, allergy reactions, and medication schedules accurately.",
      "vocabulary": [
        "症状",
        "処方箋",
        "アレルギー",
        "安静",
        "診察"
      ],
      "grammar": [
        "〜気味",
        "〜がち",
        "〜てたまらない"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "昨日から少し風邪気味で、喉が痛くてたまりません。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "無理をせず、薬を飲んで安静にしてください。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "A touch of cold",
          "answer": "かぜぎみ"
        }
      ],
      "culturalNote": "In Japan, pharmacies require an official doctor's prescription (処方箋, shohousen) for most clinical treatments.",
      "kanji": []
    },
    {
      "id": "n3l010",
      "title": "Weather Forecasts & Natural Disasters",
      "titleJp": "気象情報と防災",
      "level": "N3",
      "order": 10,
      "duration": "35 min",
      "xp": 90,
      "description": "Understand news reports on typhoons, earthquakes, evacuation warnings, and seasonal weather.",
      "vocabulary": [
        "警報",
        "避難",
        "台風",
        "地震",
        "警戒"
      ],
      "grammar": [
        "〜にともなって",
        "〜を中心に",
        "〜恐れがある"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "大型の台風が接近しており、今夜から暴風雨になるおそれがあります。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "早めに避難場所を確認しておきましょう。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "There is a risk of rain",
          "answer": "あめのおそれがある"
        }
      ],
      "culturalNote": "Japan is world-renowned for disaster preparedness drills (防災訓練) held regularly across schools and workplaces.",
      "kanji": []
    },
    {
      "id": "n3l011",
      "title": "High Certainty - ~Ni Chigai Nai",
      "titleJp": "〜に違いない - 彼が犯人に違いない",
      "level": "N3",
      "order": 11,
      "duration": "21 min",
      "xp": 55,
      "description": "Deducing conclusions with strong conviction.",
      "vocabulary": [
        "〜に違いない - 彼が犯人に違いない"
      ],
      "grammar": [
        "n3_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に違いない - 彼が犯人に違いないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of High Certainty - ~Ni Chigai Nai",
          "answer": "〜に違いない - 彼が犯人に違いない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about High Certainty - ~Ni Chigai Nai?",
          "options": [
            "〜に違いない - 彼が犯人に違いない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に違いない - 彼が犯人に違いない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（High Certainty - ~Ni Chigai Nai）",
          "answer": [
            "〜に違いない - 彼が犯人に違いない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding High Certainty - ~Ni Chigai Nai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l012",
      "title": "Apprehension & Risk - ~Osore ga Aru",
      "titleJp": "〜おそれがある - 大雨で川が氾濫するおそれがある",
      "level": "N3",
      "order": 12,
      "duration": "22 min",
      "xp": 60,
      "description": "Warning against potential danger or disasters.",
      "vocabulary": [
        "〜おそれがある - 大雨で川が氾濫するおそれがある"
      ],
      "grammar": [
        "n3_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜おそれがある - 大雨で川が氾濫するおそれがあるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Apprehension & Risk - ~Osore ga Aru",
          "answer": "〜おそれがある - 大雨で川が氾濫するおそれがある"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Apprehension & Risk - ~Osore ga Aru?",
          "options": [
            "〜おそれがある - 大雨で川が氾濫するおそれがある",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜おそれがある - 大雨で川が氾濫するおそれがある"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Apprehension & Risk - ~Osore ga Aru）",
          "answer": [
            "〜おそれがある - 大雨で川が氾濫するおそれがある"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Apprehension & Risk - ~Osore ga Aru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l013",
      "title": "Severe Limit - ~Shika ~Nai",
      "titleJp": "〜しかない - 自分でやるしかない",
      "level": "N3",
      "order": 13,
      "duration": "23 min",
      "xp": 65,
      "description": "Having zero other alternatives remaining.",
      "vocabulary": [
        "〜しかない - 自分でやるしかない"
      ],
      "grammar": [
        "n3_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜しかない - 自分でやるしかないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Severe Limit - ~Shika ~Nai",
          "answer": "〜しかない - 自分でやるしかない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Severe Limit - ~Shika ~Nai?",
          "options": [
            "〜しかない - 自分でやるしかない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜しかない - 自分でやるしかない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Severe Limit - ~Shika ~Nai）",
          "answer": [
            "〜しかない - 自分でやるしかない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Severe Limit - ~Shika ~Nai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l014",
      "title": "Extreme Extent - ~Bakari da",
      "titleJp": "〜ばかりだ - 状況は悪化するばかりだ",
      "level": "N3",
      "order": 14,
      "duration": "24 min",
      "xp": 70,
      "description": "Describing tendencies that continually intensify.",
      "vocabulary": [
        "〜ばかりだ - 状況は悪化するばかりだ"
      ],
      "grammar": [
        "n3_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ばかりだ - 状況は悪化するばかりだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Extreme Extent - ~Bakari da",
          "answer": "〜ばかりだ - 状況は悪化するばかりだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Extreme Extent - ~Bakari da?",
          "options": [
            "〜ばかりだ - 状況は悪化するばかりだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ばかりだ - 状況は悪化するばかりだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Extreme Extent - ~Bakari da）",
          "answer": [
            "〜ばかりだ - 状況は悪化するばかりだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Extreme Extent - ~Bakari da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l015",
      "title": "Approximation & Limits - ~Hodo / ~Kurai",
      "titleJp": "〜ほど・〜くらい - 泣きたいほど嬉しい",
      "level": "N3",
      "order": 15,
      "duration": "25 min",
      "xp": 50,
      "description": "Illustrating depth of feeling through comparisons.",
      "vocabulary": [
        "〜ほど・〜くらい - 泣きたいほど嬉しい"
      ],
      "grammar": [
        "n3_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ほど・〜くらい - 泣きたいほど嬉しいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Approximation & Limits - ~Hodo / ~Kurai",
          "answer": "〜ほど・〜くらい - 泣きたいほど嬉しい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Approximation & Limits - ~Hodo / ~Kurai?",
          "options": [
            "〜ほど・〜くらい - 泣きたいほど嬉しい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ほど・〜くらい - 泣きたいほど嬉しい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Approximation & Limits - ~Hodo / ~Kurai）",
          "answer": [
            "〜ほど・〜くらい - 泣きたいほど嬉しい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Approximation & Limits - ~Hodo / ~Kurai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l016",
      "title": "Natural Limits - ~Kagiri",
      "titleJp": "〜限り - 生きている限り挑戦し続ける",
      "level": "N3",
      "order": 16,
      "duration": "26 min",
      "xp": 55,
      "description": "As long as a state holds true.",
      "vocabulary": [
        "〜限り - 生きている限り挑戦し続ける"
      ],
      "grammar": [
        "n3_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜限り - 生きている限り挑戦し続けるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Natural Limits - ~Kagiri",
          "answer": "〜限り - 生きている限り挑戦し続ける"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Natural Limits - ~Kagiri?",
          "options": [
            "〜限り - 生きている限り挑戦し続ける",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜限り - 生きている限り挑戦し続ける"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Natural Limits - ~Kagiri）",
          "answer": [
            "〜限り - 生きている限り挑戦し続ける"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Natural Limits - ~Kagiri reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l017",
      "title": "Special Treatment - ~Ni Kagitte",
      "titleJp": "〜に限って - 傘を持たない日に限って雨が降る",
      "level": "N3",
      "order": 17,
      "duration": "27 min",
      "xp": 60,
      "description": "Irony of unfortunate coincidences.",
      "vocabulary": [
        "〜に限って - 傘を持たない日に限って雨が降る"
      ],
      "grammar": [
        "n3_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に限って - 傘を持たない日に限って雨が降るについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Special Treatment - ~Ni Kagitte",
          "answer": "〜に限って - 傘を持たない日に限って雨が降る"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Special Treatment - ~Ni Kagitte?",
          "options": [
            "〜に限って - 傘を持たない日に限って雨が降る",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に限って - 傘を持たない日に限って雨が降る"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Special Treatment - ~Ni Kagitte）",
          "answer": [
            "〜に限って - 傘を持たない日に限って雨が降る"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Special Treatment - ~Ni Kagitte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l018",
      "title": "Based on Evidence - ~Ni Motozuite",
      "titleJp": "〜に基づいて - データに基づいて判断する",
      "level": "N3",
      "order": 18,
      "duration": "28 min",
      "xp": 65,
      "description": "Grounding conclusions on factual materials.",
      "vocabulary": [
        "〜に基づいて - データに基づいて判断する"
      ],
      "grammar": [
        "n3_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に基づいて - データに基づいて判断するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Based on Evidence - ~Ni Motozuite",
          "answer": "〜に基づいて - データに基づいて判断する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Based on Evidence - ~Ni Motozuite?",
          "options": [
            "〜に基づいて - データに基づいて判断する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に基づいて - データに基づいて判断する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Based on Evidence - ~Ni Motozuite）",
          "answer": [
            "〜に基づいて - データに基づいて判断する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Based on Evidence - ~Ni Motozuite reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l019",
      "title": "Along the Lines of - ~Ni Sotte",
      "titleJp": "〜に沿って - マニュアルに沿って作業を進める",
      "level": "N3",
      "order": 19,
      "duration": "29 min",
      "xp": 70,
      "description": "Adhering to guidelines, policies, or paths.",
      "vocabulary": [
        "〜に沿って - マニュアルに沿って作業を進める"
      ],
      "grammar": [
        "n3_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に沿って - マニュアルに沿って作業を進めるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Along the Lines of - ~Ni Sotte",
          "answer": "〜に沿って - マニュアルに沿って作業を進める"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Along the Lines of - ~Ni Sotte?",
          "options": [
            "〜に沿って - マニュアルに沿って作業を進める",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に沿って - マニュアルに沿って作業を進める"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Along the Lines of - ~Ni Sotte）",
          "answer": [
            "〜に沿って - マニュアルに沿って作業を進める"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Along the Lines of - ~Ni Sotte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l020",
      "title": "In Response to - ~Ni Kotaete",
      "titleJp": "〜に応えて - ファンの期待に応える",
      "level": "N3",
      "order": 20,
      "duration": "20 min",
      "xp": 50,
      "description": "Meeting expectations, demands, or wishes.",
      "vocabulary": [
        "〜に応えて - ファンの期待に応える"
      ],
      "grammar": [
        "n3_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に応えて - ファンの期待に応えるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of In Response to - ~Ni Kotaete",
          "answer": "〜に応えて - ファンの期待に応える"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about In Response to - ~Ni Kotaete?",
          "options": [
            "〜に応えて - ファンの期待に応える",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に応えて - ファンの期待に応える"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（In Response to - ~Ni Kotaete）",
          "answer": [
            "〜に応えて - ファンの期待に応える"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding In Response to - ~Ni Kotaete reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l021",
      "title": "Depending on Context - ~Shidai da",
      "titleJp": "〜次第だ - 努力次第で結果が変わる",
      "level": "N3",
      "order": 21,
      "duration": "21 min",
      "xp": 55,
      "description": "Showing that results depend entirely upon a factor.",
      "vocabulary": [
        "〜次第だ - 努力次第で結果が変わる"
      ],
      "grammar": [
        "n3_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜次第だ - 努力次第で結果が変わるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Depending on Context - ~Shidai da",
          "answer": "〜次第だ - 努力次第で結果が変わる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Depending on Context - ~Shidai da?",
          "options": [
            "〜次第だ - 努力次第で結果が変わる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜次第だ - 努力次第で結果が変わる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Depending on Context - ~Shidai da）",
          "answer": [
            "〜次第だ - 努力次第で結果が変わる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Depending on Context - ~Shidai da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l022",
      "title": "Immediate Sequence - ~Shidai",
      "titleJp": "〜次第 - 準備ができ次第、出発します",
      "level": "N3",
      "order": 22,
      "duration": "22 min",
      "xp": 60,
      "description": "Taking action immediately after a condition clears.",
      "vocabulary": [
        "〜次第 - 準備ができ次第、出発します"
      ],
      "grammar": [
        "n3_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜次第 - 準備ができ次第、出発しますについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Immediate Sequence - ~Shidai",
          "answer": "〜次第 - 準備ができ次第、出発します"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Immediate Sequence - ~Shidai?",
          "options": [
            "〜次第 - 準備ができ次第、出発します",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜次第 - 準備ができ次第、出発します"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Immediate Sequence - ~Shidai）",
          "answer": [
            "〜次第 - 準備ができ次第、出発します"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Immediate Sequence - ~Shidai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l023",
      "title": "Focus on Subject - ~O Megutte",
      "titleJp": "〜をめぐって - 遺産をめぐって争う",
      "level": "N3",
      "order": 23,
      "duration": "23 min",
      "xp": 65,
      "description": "Controversies and discussions centered around an issue.",
      "vocabulary": [
        "〜をめぐって - 遺産をめぐって争う"
      ],
      "grammar": [
        "n3_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜をめぐって - 遺産をめぐって争うについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Focus on Subject - ~O Megutte",
          "answer": "〜をめぐって - 遺産をめぐって争う"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Focus on Subject - ~O Megutte?",
          "options": [
            "〜をめぐって - 遺産をめぐって争う",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜をめぐって - 遺産をめぐって争う"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Focus on Subject - ~O Megutte）",
          "answer": [
            "〜をめぐって - 遺産をめぐって争う"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Focus on Subject - ~O Megutte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l024",
      "title": "Starting Point - ~O Kawa kiri ni",
      "titleJp": "〜を皮切りに - 東京公演を皮切りに全国ツアー",
      "level": "N3",
      "order": 24,
      "duration": "24 min",
      "xp": 70,
      "description": "Marking the beginning of a sequential rollout.",
      "vocabulary": [
        "〜を皮切りに - 東京公演を皮切りに全国ツアー"
      ],
      "grammar": [
        "n3_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜を皮切りに - 東京公演を皮切りに全国ツアーについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Starting Point - ~O Kawa kiri ni",
          "answer": "〜を皮切りに - 東京公演を皮切りに全国ツアー"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Starting Point - ~O Kawa kiri ni?",
          "options": [
            "〜を皮切りに - 東京公演を皮切りに全国ツアー",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜を皮切りに - 東京公演を皮切りに全国ツアー"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Starting Point - ~O Kawa kiri ni）",
          "answer": [
            "〜を皮切りに - 東京公演を皮切りに全国ツアー"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Starting Point - ~O Kawa kiri ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l025",
      "title": "Triggered by - ~O Kikkake ni",
      "titleJp": "〜をきっかけに - アニメをきっかけに日本語を始めた",
      "level": "N3",
      "order": 25,
      "duration": "25 min",
      "xp": 50,
      "description": "Pinpointing catalytic life moments.",
      "vocabulary": [
        "〜をきっかけに - アニメをきっかけに日本語を始めた"
      ],
      "grammar": [
        "n3_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜をきっかけに - アニメをきっかけに日本語を始めたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Triggered by - ~O Kikkake ni",
          "answer": "〜をきっかけに - アニメをきっかけに日本語を始めた"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Triggered by - ~O Kikkake ni?",
          "options": [
            "〜をきっかけに - アニメをきっかけに日本語を始めた",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜をきっかけに - アニメをきっかけに日本語を始めた"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Triggered by - ~O Kikkake ni）",
          "answer": [
            "〜をきっかけに - アニメをきっかけに日本語を始めた"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Triggered by - ~O Kikkake ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l026",
      "title": "Target Audience - ~Muke / ~Muki",
      "titleJp": "〜向け・〜向き - 子ども向けの本",
      "level": "N3",
      "order": 26,
      "duration": "26 min",
      "xp": 55,
      "description": "Differentiating intentional target from natural fit.",
      "vocabulary": [
        "〜向け・〜向き - 子ども向けの本"
      ],
      "grammar": [
        "n3_g002"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜向け・〜向き - 子ども向けの本について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Target Audience - ~Muke / ~Muki",
          "answer": "〜向け・〜向き - 子ども向けの本"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Target Audience - ~Muke / ~Muki?",
          "options": [
            "〜向け・〜向き - 子ども向けの本",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜向け・〜向き - 子ども向けの本"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Target Audience - ~Muke / ~Muki）",
          "answer": [
            "〜向け・〜向き - 子ども向けの本"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Target Audience - ~Muke / ~Muki reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l027",
      "title": "Unusual Frequency - ~Gachi da",
      "titleJp": "〜がちだ - 冬は風邪を引きがちだ",
      "level": "N3",
      "order": 27,
      "duration": "27 min",
      "xp": 60,
      "description": "Expressing unwelcome tendencies that recur often.",
      "vocabulary": [
        "〜がちだ - 冬は風邪を引きがちだ"
      ],
      "grammar": [
        "n3_g003"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜がちだ - 冬は風邪を引きがちだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Unusual Frequency - ~Gachi da",
          "answer": "〜がちだ - 冬は風邪を引きがちだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Unusual Frequency - ~Gachi da?",
          "options": [
            "〜がちだ - 冬は風邪を引きがちだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜がちだ - 冬は風邪を引きがちだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Unusual Frequency - ~Gachi da）",
          "answer": [
            "〜がちだ - 冬は風邪を引きがちだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Unusual Frequency - ~Gachi da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l028",
      "title": "Physical Sensation - ~Gimi da",
      "titleJp": "〜気味だ - 風邪気味なので早く寝る",
      "level": "N3",
      "order": 28,
      "duration": "28 min",
      "xp": 65,
      "description": "Having slight symptoms or indications of a state.",
      "vocabulary": [
        "〜気味だ - 風邪気味なので早く寝る"
      ],
      "grammar": [
        "n3_g004"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜気味だ - 風邪気味なので早く寝るについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Physical Sensation - ~Gimi da",
          "answer": "〜気味だ - 風邪気味なので早く寝る"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Physical Sensation - ~Gimi da?",
          "options": [
            "〜気味だ - 風邪気味なので早く寝る",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜気味だ - 風邪気味なので早く寝る"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Physical Sensation - ~Gimi da）",
          "answer": [
            "〜気味だ - 風邪気味なので早く寝る"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Physical Sensation - ~Gimi da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l029",
      "title": "Doubtful Validity - ~Koto ka",
      "titleJp": "〜ことか - 何度注意したことか",
      "level": "N3",
      "order": 29,
      "duration": "29 min",
      "xp": 70,
      "description": "Exclaiming how many times or how deeply.",
      "vocabulary": [
        "〜ことか - 何度注意したことか"
      ],
      "grammar": [
        "n3_g005"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ことか - 何度注意したことかについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Doubtful Validity - ~Koto ka",
          "answer": "〜ことか - 何度注意したことか"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Doubtful Validity - ~Koto ka?",
          "options": [
            "〜ことか - 何度注意したことか",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ことか - 何度注意したことか"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Doubtful Validity - ~Koto ka）",
          "answer": [
            "〜ことか - 何度注意したことか"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Doubtful Validity - ~Koto ka reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l030",
      "title": "No Wonder - ~Hazu da",
      "titleJp": "〜はずだ - 電車が止まっているから遅れるはずだ",
      "level": "N3",
      "order": 30,
      "duration": "20 min",
      "xp": 50,
      "description": "Deducing expected outcomes logically.",
      "vocabulary": [
        "〜はずだ - 電車が止まっているから遅れるはずだ"
      ],
      "grammar": [
        "n3_g006"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜はずだ - 電車が止まっているから遅れるはずだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of No Wonder - ~Hazu da",
          "answer": "〜はずだ - 電車が止まっているから遅れるはずだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about No Wonder - ~Hazu da?",
          "options": [
            "〜はずだ - 電車が止まっているから遅れるはずだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜はずだ - 電車が止まっているから遅れるはずだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（No Wonder - ~Hazu da）",
          "answer": [
            "〜はずだ - 電車が止まっているから遅れるはずだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding No Wonder - ~Hazu da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l031",
      "title": "Contrary to Expectation - ~Hazu ga Nai",
      "titleJp": "〜はずがない - 彼が嘘をつくはずがない",
      "level": "N3",
      "order": 31,
      "duration": "21 min",
      "xp": 55,
      "description": "Categorically rejecting a possibility.",
      "vocabulary": [
        "〜はずがない - 彼が嘘をつくはずがない"
      ],
      "grammar": [
        "n3_g007"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜はずがない - 彼が嘘をつくはずがないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Contrary to Expectation - ~Hazu ga Nai",
          "answer": "〜はずがない - 彼が嘘をつくはずがない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Contrary to Expectation - ~Hazu ga Nai?",
          "options": [
            "〜はずがない - 彼が嘘をつくはずがない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜はずがない - 彼が嘘をつくはずがない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Contrary to Expectation - ~Hazu ga Nai）",
          "answer": [
            "〜はずがない - 彼が嘘をつくはずがない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Contrary to Expectation - ~Hazu ga Nai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l032",
      "title": "Needless to Say - ~Made mo Nai",
      "titleJp": "〜までもない - 言うまでもなく健康が一番だ",
      "level": "N3",
      "order": 32,
      "duration": "22 min",
      "xp": 60,
      "description": "Affirming that a conclusion is obvious.",
      "vocabulary": [
        "〜までもない - 言うまでもなく健康が一番だ"
      ],
      "grammar": [
        "n3_g008"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜までもない - 言うまでもなく健康が一番だについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Needless to Say - ~Made mo Nai",
          "answer": "〜までもない - 言うまでもなく健康が一番だ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Needless to Say - ~Made mo Nai?",
          "options": [
            "〜までもない - 言うまでもなく健康が一番だ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜までもない - 言うまでもなく健康が一番だ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Needless to Say - ~Made mo Nai）",
          "answer": [
            "〜までもない - 言うまでもなく健康が一番だ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Needless to Say - ~Made mo Nai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l033",
      "title": "Only Just Barely - ~Yatto",
      "titleJp": "〜やっと - やっと試験が終わった",
      "level": "N3",
      "order": 33,
      "duration": "23 min",
      "xp": 65,
      "description": "Emphasizing prolonged relief upon arrival.",
      "vocabulary": [
        "〜やっと - やっと試験が終わった"
      ],
      "grammar": [
        "n3_g009"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜やっと - やっと試験が終わったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Only Just Barely - ~Yatto",
          "answer": "〜やっと - やっと試験が終わった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Only Just Barely - ~Yatto?",
          "options": [
            "〜やっと - やっと試験が終わった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜やっと - やっと試験が終わった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Only Just Barely - ~Yatto）",
          "answer": [
            "〜やっと - やっと試験が終わった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Only Just Barely - ~Yatto reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l034",
      "title": "Full of Imperfections - ~Darake",
      "titleJp": "〜だらけ - 間違いだらけの答案",
      "level": "N3",
      "order": 34,
      "duration": "24 min",
      "xp": 70,
      "description": "Unpleasant abundance of dust, errors, or debt.",
      "vocabulary": [
        "〜だらけ - 間違いだらけの答案"
      ],
      "grammar": [
        "n3_g010"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜だらけ - 間違いだらけの答案について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Full of Imperfections - ~Darake",
          "answer": "〜だらけ - 間違いだらけの答案"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Full of Imperfections - ~Darake?",
          "options": [
            "〜だらけ - 間違いだらけの答案",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜だらけ - 間違いだらけの答案"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Full of Imperfections - ~Darake）",
          "answer": [
            "〜だらけ - 間違いだらけの答案"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Full of Imperfections - ~Darake reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l035",
      "title": "Covered with Residue - ~Mamire",
      "titleJp": "〜まみれ - 泥まみれになって遊ぶ",
      "level": "N3",
      "order": 35,
      "duration": "25 min",
      "xp": 50,
      "description": "Surface coated with mud, blood, or sweat.",
      "vocabulary": [
        "〜まみれ - 泥まみれになって遊ぶ"
      ],
      "grammar": [
        "n3_g011"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜まみれ - 泥まみれになって遊ぶについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Covered with Residue - ~Mamire",
          "answer": "〜まみれ - 泥まみれになって遊ぶ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Covered with Residue - ~Mamire?",
          "options": [
            "〜まみれ - 泥まみれになって遊ぶ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜まみれ - 泥まみれになって遊ぶ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Covered with Residue - ~Mamire）",
          "answer": [
            "〜まみれ - 泥まみれになって遊ぶ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Covered with Residue - ~Mamire reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l036",
      "title": "At the Occasion of - ~Sai shite",
      "titleJp": "〜に際して - 新規事業の立ち上げに際して",
      "level": "N3",
      "order": 36,
      "duration": "26 min",
      "xp": 55,
      "description": "Ceremonial or formal preparatory steps.",
      "vocabulary": [
        "〜に際して - 新規事業の立ち上げに際して"
      ],
      "grammar": [
        "n3_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に際して - 新規事業の立ち上げに際してについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of At the Occasion of - ~Sai shite",
          "answer": "〜に際して - 新規事業の立ち上げに際して"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about At the Occasion of - ~Sai shite?",
          "options": [
            "〜に際して - 新規事業の立ち上げに際して",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に際して - 新規事業の立ち上げに際して"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（At the Occasion of - ~Sai shite）",
          "answer": [
            "〜に際して - 新規事業の立ち上げに際して"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding At the Occasion of - ~Sai shite reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l037",
      "title": "Speaking of - ~To Ieba",
      "titleJp": "〜といえば - 日本といえば富士山だ",
      "level": "N3",
      "order": 37,
      "duration": "27 min",
      "xp": 60,
      "description": "Triggering associations from a keyword.",
      "vocabulary": [
        "〜といえば - 日本といえば富士山だ"
      ],
      "grammar": [
        "n3_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜といえば - 日本といえば富士山だについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Speaking of - ~To Ieba",
          "answer": "〜といえば - 日本といえば富士山だ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Speaking of - ~To Ieba?",
          "options": [
            "〜といえば - 日本といえば富士山だ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜といえば - 日本といえば富士山だ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Speaking of - ~To Ieba）",
          "answer": [
            "〜といえば - 日本といえば富士山だ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Speaking of - ~To Ieba reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l038",
      "title": "Even If - ~Tatoe ~Temo",
      "titleJp": "〜たとえ〜ても - たとえ反対されても諦めない",
      "level": "N3",
      "order": 38,
      "duration": "28 min",
      "xp": 65,
      "description": "Hypothetical resilience despite adverse conditions.",
      "vocabulary": [
        "〜たとえ〜ても - たとえ反対されても諦めない"
      ],
      "grammar": [
        "n3_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜たとえ〜ても - たとえ反対されても諦めないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Even If - ~Tatoe ~Temo",
          "answer": "〜たとえ〜ても - たとえ反対されても諦めない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Even If - ~Tatoe ~Temo?",
          "options": [
            "〜たとえ〜ても - たとえ反対されても諦めない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜たとえ〜ても - たとえ反対されても諦めない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Even If - ~Tatoe ~Temo）",
          "answer": [
            "〜たとえ〜ても - たとえ反対されても諦めない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Even If - ~Tatoe ~Temo reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l039",
      "title": "Extreme Hypothetical - ~Toshitara",
      "titleJp": "〜としたら - もし宝くじが当たったとしたら",
      "level": "N3",
      "order": 39,
      "duration": "29 min",
      "xp": 70,
      "description": "Exploring hypothetical scenarios.",
      "vocabulary": [
        "〜としたら - もし宝くじが当たったとしたら"
      ],
      "grammar": [
        "n3_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜としたら - もし宝くじが当たったとしたらについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Extreme Hypothetical - ~Toshitara",
          "answer": "〜としたら - もし宝くじが当たったとしたら"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Extreme Hypothetical - ~Toshitara?",
          "options": [
            "〜としたら - もし宝くじが当たったとしたら",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜としたら - もし宝くじが当たったとしたら"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Extreme Hypothetical - ~Toshitara）",
          "answer": [
            "〜としたら - もし宝くじが当たったとしたら"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Extreme Hypothetical - ~Toshitara reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l040",
      "title": "In Terms of - ~Ue de",
      "titleJp": "〜上で - 書類を確認した上で署名する",
      "level": "N3",
      "order": 40,
      "duration": "20 min",
      "xp": 50,
      "description": "Procedural sequences requiring prior clearance.",
      "vocabulary": [
        "〜上で - 書類を確認した上で署名する"
      ],
      "grammar": [
        "n3_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜上で - 書類を確認した上で署名するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of In Terms of - ~Ue de",
          "answer": "〜上で - 書類を確認した上で署名する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about In Terms of - ~Ue de?",
          "options": [
            "〜上で - 書類を確認した上で署名する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜上で - 書類を確認した上で署名する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（In Terms of - ~Ue de）",
          "answer": [
            "〜上で - 書類を確認した上で署名する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding In Terms of - ~Ue de reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l041",
      "title": "Judging from - ~Kara Miru to",
      "titleJp": "〜から見ると - 外国人から見ると不思議な習慣",
      "level": "N3",
      "order": 41,
      "duration": "21 min",
      "xp": 55,
      "description": "Evaluating matters from a particular perspective.",
      "vocabulary": [
        "〜から見ると - 外国人から見ると不思議な習慣"
      ],
      "grammar": [
        "n3_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜から見ると - 外国人から見ると不思議な習慣について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Judging from - ~Kara Miru to",
          "answer": "〜から見ると - 外国人から見ると不思議な習慣"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Judging from - ~Kara Miru to?",
          "options": [
            "〜から見ると - 外国人から見ると不思議な習慣",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜から見ると - 外国人から見ると不思議な習慣"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Judging from - ~Kara Miru to）",
          "answer": [
            "〜から見ると - 外国人から見ると不思議な習慣"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Judging from - ~Kara Miru to reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l042",
      "title": "Professional Office Mannerisms",
      "titleJp": "ビジネス敬語の実践マナー",
      "level": "N3",
      "order": 42,
      "duration": "22 min",
      "xp": 60,
      "description": "Polished sonkeigo and kenjougo in daily office meetings.",
      "vocabulary": [
        "ビジネス敬語の実践マナー"
      ],
      "grammar": [
        "n3_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ビジネス敬語の実践マナーについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Professional Office Mannerisms",
          "answer": "ビジネス敬語の実践マナー"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Professional Office Mannerisms?",
          "options": [
            "ビジネス敬語の実践マナー",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ビジネス敬語の実践マナー"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Professional Office Mannerisms）",
          "answer": [
            "ビジネス敬語の実践マナー"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Professional Office Mannerisms reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l043",
      "title": "Negotiating Deadlines with Clients",
      "titleJp": "納期交渉とスケジュール調整",
      "level": "N3",
      "order": 43,
      "duration": "23 min",
      "xp": 65,
      "description": "Handling delivery pushbacks cordially.",
      "vocabulary": [
        "納期交渉とスケジュール調整"
      ],
      "grammar": [
        "n3_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "納期交渉とスケジュール調整について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Negotiating Deadlines with Clients",
          "answer": "納期交渉とスケジュール調整"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Negotiating Deadlines with Clients?",
          "options": [
            "納期交渉とスケジュール調整",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "納期交渉とスケジュール調整"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Negotiating Deadlines with Clients）",
          "answer": [
            "納期交渉とスケジュール調整"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Negotiating Deadlines with Clients reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l044",
      "title": "Japanese Medical Consultations",
      "titleJp": "病院での詳細な問診と診断の聞き取り",
      "level": "N3",
      "order": 44,
      "duration": "24 min",
      "xp": 70,
      "description": "Explaining nuanced aches and chronic ailments.",
      "vocabulary": [
        "病院での詳細な問診と診断の聞き取り"
      ],
      "grammar": [
        "n3_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "病院での詳細な問診と診断の聞き取りについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Japanese Medical Consultations",
          "answer": "病院での詳細な問診と診断の聞き取り"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Japanese Medical Consultations?",
          "options": [
            "病院での詳細な問診と診断の聞き取り",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "病院での詳細な問診と診断の聞き取り"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Japanese Medical Consultations）",
          "answer": [
            "病院での詳細な問診と診断の聞き取り"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Japanese Medical Consultations reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l045",
      "title": "Banking, Taxes & Pensions in Japan",
      "titleJp": "税金・年金・確定申告の手続き",
      "level": "N3",
      "order": 45,
      "duration": "25 min",
      "xp": 50,
      "description": "Navigating nenkin, furasato nouzei, and kakutei shinkoku.",
      "vocabulary": [
        "税金・年金・確定申告の手続き"
      ],
      "grammar": [
        "n3_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "税金・年金・確定申告の手続きについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Banking, Taxes & Pensions in Japan",
          "answer": "税金・年金・確定申告の手続き"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Banking, Taxes & Pensions in Japan?",
          "options": [
            "税金・年金・確定申告の手続き",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "税金・年金・確定申告の手続き"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Banking, Taxes & Pensions in Japan）",
          "answer": [
            "税金・年金・確定申告の手続き"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Banking, Taxes & Pensions in Japan reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l046",
      "title": "Participating in Neighborhood Chonaikai",
      "titleJp": "町内会と地域コミュニティへの参加",
      "level": "N3",
      "order": 46,
      "duration": "26 min",
      "xp": 55,
      "description": "Civic duties, emergency drills, and local festivals.",
      "vocabulary": [
        "町内会と地域コミュニティへの参加"
      ],
      "grammar": [
        "n3_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "町内会と地域コミュニティへの参加について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Participating in Neighborhood Chonaikai",
          "answer": "町内会と地域コミュニティへの参加"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Participating in Neighborhood Chonaikai?",
          "options": [
            "町内会と地域コミュニティへの参加",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "町内会と地域コミュニティへの参加"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Participating in Neighborhood Chonaikai）",
          "answer": [
            "町内会と地域コミュニティへの参加"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Participating in Neighborhood Chonaikai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l047",
      "title": "Job Hunting (Shukatsu) Overview",
      "titleJp": "就職活動のエントリーシート対策",
      "level": "N3",
      "order": 47,
      "duration": "27 min",
      "xp": 60,
      "description": "Writing motivating reason (shibou-douki) essays.",
      "vocabulary": [
        "就職活動のエントリーシート対策"
      ],
      "grammar": [
        "n3_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "就職活動のエントリーシート対策について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Job Hunting (Shukatsu) Overview",
          "answer": "就職活動のエントリーシート対策"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Job Hunting (Shukatsu) Overview?",
          "options": [
            "就職活動のエントリーシート対策",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "就職活動のエントリーシート対策"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Job Hunting (Shukatsu) Overview）",
          "answer": [
            "就職活動のエントリーシート対策"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Job Hunting (Shukatsu) Overview reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l048",
      "title": "Interpreting Japanese News Broadcasts",
      "titleJp": "NHKニュースの聞き取りと時事表現",
      "level": "N3",
      "order": 48,
      "duration": "28 min",
      "xp": 65,
      "description": "Dissecting formal broadcaster jargon.",
      "vocabulary": [
        "NHKニュースの聞き取りと時事表現"
      ],
      "grammar": [
        "n3_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "NHKニュースの聞き取りと時事表現について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Interpreting Japanese News Broadcasts",
          "answer": "NHKニュースの聞き取りと時事表現"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Interpreting Japanese News Broadcasts?",
          "options": [
            "NHKニュースの聞き取りと時事表現",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "NHKニュースの聞き取りと時事表現"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Interpreting Japanese News Broadcasts）",
          "answer": [
            "NHKニュースの聞き取りと時事表現"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Interpreting Japanese News Broadcasts reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l049",
      "title": "Expressing Nuanced Opinions in Debates",
      "titleJp": "会議での反対意見の角の立たない伝え方",
      "level": "N3",
      "order": 49,
      "duration": "29 min",
      "xp": 70,
      "description": "Cushion words (Kushon-kotoba) in tense debates.",
      "vocabulary": [
        "会議での反対意見の角の立たない伝え方"
      ],
      "grammar": [
        "n3_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "会議での反対意見の角の立たない伝え方について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Expressing Nuanced Opinions in Debates",
          "answer": "会議での反対意見の角の立たない伝え方"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Expressing Nuanced Opinions in Debates?",
          "options": [
            "会議での反対意見の角の立たない伝え方",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "会議での反対意見の角の立たない伝え方"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Expressing Nuanced Opinions in Debates）",
          "answer": [
            "会議での反対意見の角の立たない伝え方"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Expressing Nuanced Opinions in Debates reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n3l050",
      "title": "N3 Milestone: Conquering the Intermediate Plateau",
      "titleJp": "N3修了と上級への跳躍",
      "level": "N3",
      "order": 50,
      "duration": "20 min",
      "xp": 50,
      "description": "Crossing from conversational learner to independent reader.",
      "vocabulary": [
        "N3修了と上級への跳躍"
      ],
      "grammar": [
        "n3_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "N3修了と上級への跳躍について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of N3 Milestone: Conquering the Intermediate Plateau",
          "answer": "N3修了と上級への跳躍"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about N3 Milestone: Conquering the Intermediate Plateau?",
          "options": [
            "N3修了と上級への跳躍",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "N3修了と上級への跳躍"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（N3 Milestone: Conquering the Intermediate Plateau）",
          "answer": [
            "N3修了と上級への跳躍"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding N3 Milestone: Conquering the Intermediate Plateau reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "それは親切ですね。先生に教えていただきましたか？",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "はい、先生に教えていただきました。とても助かりました。",
          "en": ""
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
      "culturalNote": "The direction of giving/receiving is crucial in Japanese. Using the wrong form can sound unnatural or even rude.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "それは大変でしたね。私は子供に野菜を食べさせました。",
          "en": ""
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
      "culturalNote": "The causative-passive form (させられる) often carries a nuance of being forced to do something against one's will.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "仕事が終わったら、連絡します。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "東京に行くなら、スカイツリーに行ったほうがいいですよ。",
          "en": ""
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
      "culturalNote": "と is for natural/automatic consequences. たら is most versatile. ば is often for hypotheticals. なら is for advice based on new information.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "本当ですか？空を見ると、確かに曇っているようですね。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "田中さんは風邪を引いたらしいですよ。",
          "en": ""
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
      "culturalNote": "〜そうだ has two completely different meanings depending on conjugation: verb-stem + そうだ = looks like; plain form + そうだ = hearsay.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、どうぞ。でも、エアコンが入っているので、少しだけにしてください。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "わかりました。少し手伝っていただけますか？",
          "en": ""
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
      "culturalNote": "Politeness levels matter greatly in Japanese. Using too casual a form with a superior can be seen as disrespectful.",
      "kanji": []
    },
    {
      "id": "n4l006",
      "title": "Giving and Receiving Favors",
      "titleJp": "授受表現",
      "level": "N4",
      "order": 6,
      "duration": "30 min",
      "xp": 70,
      "description": "Master the nuance of doing things for others and receiving favors using てあげる, てくれる, and てもらう.",
      "vocabulary": [
        "お礼",
        "親切",
        "手伝う",
        "貸す",
        "借りる"
      ],
      "grammar": [
        "〜てあげる",
        "〜てくれる",
        "〜てもらう"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "重そうな荷物ですね。持ってあげましょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "ありがとうございます！助かります。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "The teacher taught me",
          "answer": "せんせいがおしえてくれました"
        },
        {
          "type": "fill",
          "question": "友達に宿題を___もらいました。",
          "answer": [
            "てつだって"
          ]
        }
      ],
      "culturalNote": "In Japanese culture, acknowledging who initiated a favor preserves harmonious social distance and gratitude.",
      "kanji": []
    },
    {
      "id": "n4l007",
      "title": "Expressing Completion & Regret",
      "titleJp": "完了と後悔",
      "level": "N4",
      "order": 7,
      "duration": "25 min",
      "xp": 65,
      "description": "Express total completion and unintentional mistakes using 〜てしまう.",
      "vocabulary": [
        "忘れる",
        "落とす",
        "失くす",
        "故障",
        "遅刻"
      ],
      "grammar": [
        "〜てしまう",
        "〜ちゃう / 〜じゃう"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "どうしたの？元気がなさそうだけど。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "電車の中に傘を忘れてしまったんです。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I dropped my wallet",
          "answer": "さいふをおとしてしまいました"
        },
        {
          "type": "fill",
          "question": "全部食べて___。",
          "answer": [
            "しまいました"
          ]
        }
      ],
      "culturalNote": "〜てしまう expresses an empathetic vulnerability, signaling to listeners that an error was not malicious.",
      "kanji": []
    },
    {
      "id": "n4l008",
      "title": "Conditionals in Daily Conversation",
      "titleJp": "条件表現の使い分け",
      "level": "N4",
      "order": 8,
      "duration": "35 min",
      "xp": 75,
      "description": "Learn the differences between 〜たら, 〜ば, 〜なら, and 〜と in real-world scenarios.",
      "vocabulary": [
        "天気",
        "都合",
        "予定",
        "相談",
        "連絡"
      ],
      "grammar": [
        "〜たら",
        "〜ば",
        "〜なら",
        "〜と"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "明日、天気が良ければ海に行きませんか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "いいですね！雨が降ったら、美術館にしましょう。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "If you arrive, please call me",
          "answer": "ついたら、でんわしてください"
        },
        {
          "type": "multiple",
          "question": "Which conditional cannot take requests?",
          "options": [
            "たら",
            "ば",
            "と",
            "なら"
          ],
          "answer": "と"
        }
      ],
      "culturalNote": "〜と is strictly for natural constants and machine consequences (press this button and change comes out).",
      "kanji": []
    },
    {
      "id": "n4l009",
      "title": "Potential and Abilities",
      "titleJp": "可能表現",
      "level": "N4",
      "order": 9,
      "duration": "25 min",
      "xp": 65,
      "description": "Learn how to describe what you can and cannot do using potential verb conjugations.",
      "vocabulary": [
        "運転",
        "泳ぐ",
        "話す",
        "弾く",
        "料理"
      ],
      "grammar": [
        "可能動詞",
        "〜ことができる",
        "〜が見える / 〜が聞こえる"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本語の新聞が読めますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "漢字がまだ少ししか読めません。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I can speak Japanese",
          "answer": "にほんごがはなせます"
        },
        {
          "type": "fill",
          "question": "車を___ことができます。",
          "answer": [
            "うんてんする"
          ]
        }
      ],
      "culturalNote": "Potential verbs mark their object with が instead of を in standard Japanese (e.g. 寿司が食べられる).",
      "kanji": []
    },
    {
      "id": "n4l010",
      "title": "Workplace Requests & Keigo Basics",
      "titleJp": "職場の敬語と依頼",
      "level": "N4",
      "order": 10,
      "duration": "35 min",
      "xp": 80,
      "description": "Learn foundational honorific and humble expressions for office and retail environments.",
      "vocabulary": [
        "部長",
        "書類",
        "確認",
        "承知",
        "失礼"
      ],
      "grammar": [
        "お〜ください",
        "〜ていただけますか",
        "いらっしゃいませ"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "部長、この書類をご確認いただけますでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "分かりました。後で見ておきます。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Please wait a moment (polite)",
          "answer": "しょうしょうおまちください"
        },
        {
          "type": "fill",
          "question": "少々お___ください。",
          "answer": [
            "まち"
          ]
        }
      ],
      "culturalNote": "Keigo reflects humility towards clients and elders while maintaining professional boundaries.",
      "kanji": []
    },
    {
      "id": "n4l011",
      "title": "Suffering Passive - Meiwaku no Ukemi",
      "titleJp": "迷惑の受身 - 雨に降られる",
      "level": "N4",
      "order": 11,
      "duration": "21 min",
      "xp": 55,
      "description": "Expressing hardship caused by external occurrences.",
      "vocabulary": [
        "迷惑の受身 - 雨に降られる"
      ],
      "grammar": [
        "n4_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "迷惑の受身 - 雨に降られるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Suffering Passive - Meiwaku no Ukemi",
          "answer": "迷惑の受身 - 雨に降られる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Suffering Passive - Meiwaku no Ukemi?",
          "options": [
            "迷惑の受身 - 雨に降られる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "迷惑の受身 - 雨に降られる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Suffering Passive - Meiwaku no Ukemi）",
          "answer": [
            "迷惑の受身 - 雨に降られる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Suffering Passive - Meiwaku no Ukemi reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l012",
      "title": "Causative Form - ~Saseru",
      "titleJp": "使役形 - 子どもに本を読ませる",
      "level": "N4",
      "order": 12,
      "duration": "22 min",
      "xp": 60,
      "description": "Making or letting someone perform an action.",
      "vocabulary": [
        "使役形 - 子どもに本を読ませる"
      ],
      "grammar": [
        "n4_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "使役形 - 子どもに本を読ませるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Causative Form - ~Saseru",
          "answer": "使役形 - 子どもに本を読ませる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Causative Form - ~Saseru?",
          "options": [
            "使役形 - 子どもに本を読ませる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "使役形 - 子どもに本を読ませる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Causative Form - ~Saseru）",
          "answer": [
            "使役形 - 子どもに本を読ませる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Causative Form - ~Saseru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l013",
      "title": "Causative-Passive Form",
      "titleJp": "使役受身 - 無理に歌わされる",
      "level": "N4",
      "order": 13,
      "duration": "23 min",
      "xp": 65,
      "description": "Being forced or made to do something reluctantly.",
      "vocabulary": [
        "使役受身 - 無理に歌わされる"
      ],
      "grammar": [
        "n4_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "使役受身 - 無理に歌わされるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Causative-Passive Form",
          "answer": "使役受身 - 無理に歌わされる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Causative-Passive Form?",
          "options": [
            "使役受身 - 無理に歌わされる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "使役受身 - 無理に歌わされる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Causative-Passive Form）",
          "answer": [
            "使役受身 - 無理に歌わされる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Causative-Passive Form reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l014",
      "title": "Advance Preparations - ~Te Oku",
      "titleJp": "〜ておく - 旅行の前に切符を買っておく",
      "level": "N4",
      "order": 14,
      "duration": "24 min",
      "xp": 70,
      "description": "Taking preparatory action in anticipation of future events.",
      "vocabulary": [
        "〜ておく - 旅行の前に切符を買っておく"
      ],
      "grammar": [
        "n4_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ておく - 旅行の前に切符を買っておくについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Advance Preparations - ~Te Oku",
          "answer": "〜ておく - 旅行の前に切符を買っておく"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Advance Preparations - ~Te Oku?",
          "options": [
            "〜ておく - 旅行の前に切符を買っておく",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ておく - 旅行の前に切符を買っておく"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Advance Preparations - ~Te Oku）",
          "answer": [
            "〜ておく - 旅行の前に切符を買っておく"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Advance Preparations - ~Te Oku reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l015",
      "title": "Regret & Completion - ~Te Shimau",
      "titleJp": "〜てしまう - 財布を忘れてしまった",
      "level": "N4",
      "order": 15,
      "duration": "25 min",
      "xp": 50,
      "description": "Finishing completely, or feeling regret over a mishap.",
      "vocabulary": [
        "〜てしまう - 財布を忘れてしまった"
      ],
      "grammar": [
        "n4_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜てしまう - 財布を忘れてしまったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Regret & Completion - ~Te Shimau",
          "answer": "〜てしまう - 財布を忘れてしまった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Regret & Completion - ~Te Shimau?",
          "options": [
            "〜てしまう - 財布を忘れてしまった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜てしまう - 財布を忘れてしまった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Regret & Completion - ~Te Shimau）",
          "answer": [
            "〜てしまう - 財布を忘れてしまった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Regret & Completion - ~Te Shimau reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l016",
      "title": "Trying Things Out - ~Te Miru",
      "titleJp": "〜てみる - 初めて寿司を食べてみる",
      "level": "N4",
      "order": 16,
      "duration": "26 min",
      "xp": 55,
      "description": "Attempting something to discover what it is like.",
      "vocabulary": [
        "〜てみる - 初めて寿司を食べてみる"
      ],
      "grammar": [
        "n4_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜てみる - 初めて寿司を食べてみるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Trying Things Out - ~Te Miru",
          "answer": "〜てみる - 初めて寿司を食べてみる"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Trying Things Out - ~Te Miru?",
          "options": [
            "〜てみる - 初めて寿司を食べてみる",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜てみる - 初めて寿司を食べてみる"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Trying Things Out - ~Te Miru）",
          "answer": [
            "〜てみる - 初めて寿司を食べてみる"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Trying Things Out - ~Te Miru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l017",
      "title": "Resulting State - ~Te Aru",
      "titleJp": "〜てある - カレンダーに予定が書いてある",
      "level": "N4",
      "order": 17,
      "duration": "27 min",
      "xp": 60,
      "description": "Describing states deliberately arranged by someone.",
      "vocabulary": [
        "〜てある - カレンダーに予定が書いてある"
      ],
      "grammar": [
        "n4_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜てある - カレンダーに予定が書いてあるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Resulting State - ~Te Aru",
          "answer": "〜てある - カレンダーに予定が書いてある"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Resulting State - ~Te Aru?",
          "options": [
            "〜てある - カレンダーに予定が書いてある",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜てある - カレンダーに予定が書いてある"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Resulting State - ~Te Aru）",
          "answer": [
            "〜てある - カレンダーに予定が書いてある"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Resulting State - ~Te Aru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l018",
      "title": "Progressive Change - ~Te Iku / ~Te Kuru",
      "titleJp": "〜ていく・〜てくる - だんだん寒くなってきた",
      "level": "N4",
      "order": 18,
      "duration": "28 min",
      "xp": 65,
      "description": "Temporal progression of changes towards or away.",
      "vocabulary": [
        "〜ていく・〜てくる - だんだん寒くなってきた"
      ],
      "grammar": [
        "n4_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ていく・〜てくる - だんだん寒くなってきたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Progressive Change - ~Te Iku / ~Te Kuru",
          "answer": "〜ていく・〜てくる - だんだん寒くなってきた"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Progressive Change - ~Te Iku / ~Te Kuru?",
          "options": [
            "〜ていく・〜てくる - だんだん寒くなってきた",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ていく・〜てくる - だんだん寒くなってきた"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Progressive Change - ~Te Iku / ~Te Kuru）",
          "answer": [
            "〜ていく・〜てくる - だんだん寒くなってきた"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Progressive Change - ~Te Iku / ~Te Kuru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l019",
      "title": "Conjecture by Appearance - ~Sou Da",
      "titleJp": "〜そうだ - 雨が降りそうだ・美味しそう",
      "level": "N4",
      "order": 19,
      "duration": "29 min",
      "xp": 70,
      "description": "Judging status from visual appearance.",
      "vocabulary": [
        "〜そうだ - 雨が降りそうだ・美味しそう"
      ],
      "grammar": [
        "n4_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜そうだ - 雨が降りそうだ・美味しそうについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Conjecture by Appearance - ~Sou Da",
          "answer": "〜そうだ - 雨が降りそうだ・美味しそう"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Conjecture by Appearance - ~Sou Da?",
          "options": [
            "〜そうだ - 雨が降りそうだ・美味しそう",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜そうだ - 雨が降りそうだ・美味しそう"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Conjecture by Appearance - ~Sou Da）",
          "answer": [
            "〜そうだ - 雨が降りそうだ・美味しそう"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Conjecture by Appearance - ~Sou Da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l020",
      "title": "Reporting Hearsay - ~Sou Da",
      "titleJp": "〜そうだ - 明日は晴れるそうだ",
      "level": "N4",
      "order": 20,
      "duration": "20 min",
      "xp": 50,
      "description": "Transmitting rumors or news heard from reports.",
      "vocabulary": [
        "〜そうだ - 明日は晴れるそうだ"
      ],
      "grammar": [
        "n4_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜そうだ - 明日は晴れるそうだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Reporting Hearsay - ~Sou Da",
          "answer": "〜そうだ - 明日は晴れるそうだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Reporting Hearsay - ~Sou Da?",
          "options": [
            "〜そうだ - 明日は晴れるそうだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜そうだ - 明日は晴れるそうだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Reporting Hearsay - ~Sou Da）",
          "answer": [
            "〜そうだ - 明日は晴れるそうだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Reporting Hearsay - ~Sou Da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l021",
      "title": "Resemblance - ~You Da / ~Mitai Da",
      "titleJp": "〜ようだ・〜みたいだ - まるで夢のようだ",
      "level": "N4",
      "order": 21,
      "duration": "21 min",
      "xp": 55,
      "description": "Similes and figurative resemblances.",
      "vocabulary": [
        "〜ようだ・〜みたいだ - まるで夢のようだ"
      ],
      "grammar": [
        "n4_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ようだ・〜みたいだ - まるで夢のようだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Resemblance - ~You Da / ~Mitai Da",
          "answer": "〜ようだ・〜みたいだ - まるで夢のようだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Resemblance - ~You Da / ~Mitai Da?",
          "options": [
            "〜ようだ・〜みたいだ - まるで夢のようだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ようだ・〜みたいだ - まるで夢のようだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Resemblance - ~You Da / ~Mitai Da）",
          "answer": [
            "〜ようだ・〜みたいだ - まるで夢のようだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Resemblance - ~You Da / ~Mitai Da reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l022",
      "title": "Typical Characteristics - ~Rashii",
      "titleJp": "〜らしい - 今日は春らしい天気だ",
      "level": "N4",
      "order": 22,
      "duration": "22 min",
      "xp": 60,
      "description": "Showing true quintessential properties of a category.",
      "vocabulary": [
        "〜らしい - 今日は春らしい天気だ"
      ],
      "grammar": [
        "n4_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜らしい - 今日は春らしい天気だについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Typical Characteristics - ~Rashii",
          "answer": "〜らしい - 今日は春らしい天気だ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Typical Characteristics - ~Rashii?",
          "options": [
            "〜らしい - 今日は春らしい天気だ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜らしい - 今日は春らしい天気だ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Typical Characteristics - ~Rashii）",
          "answer": [
            "〜らしい - 今日は春らしい天気だ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Typical Characteristics - ~Rashii reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l023",
      "title": "Excessive Action - ~Sugiru",
      "titleJp": "〜すぎる - 食べすぎてお腹が痛い",
      "level": "N4",
      "order": 23,
      "duration": "23 min",
      "xp": 65,
      "description": "Exceeding proper limits or doing to excess.",
      "vocabulary": [
        "〜すぎる - 食べすぎてお腹が痛い"
      ],
      "grammar": [
        "n4_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜すぎる - 食べすぎてお腹が痛いについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Excessive Action - ~Sugiru",
          "answer": "〜すぎる - 食べすぎてお腹が痛い"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Excessive Action - ~Sugiru?",
          "options": [
            "〜すぎる - 食べすぎてお腹が痛い",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜すぎる - 食べすぎてお腹が痛い"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Excessive Action - ~Sugiru）",
          "answer": [
            "〜すぎる - 食べすぎてお腹が痛い"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Excessive Action - ~Sugiru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l024",
      "title": "Ease & Difficulty - ~Yasui / ~Nikui",
      "titleJp": "〜やすい・〜にくい - このペンは書きやすい",
      "level": "N4",
      "order": 24,
      "duration": "24 min",
      "xp": 70,
      "description": "Expressing whether tasks are easy or tough to execute.",
      "vocabulary": [
        "〜やすい・〜にくい - このペンは書きやすい"
      ],
      "grammar": [
        "n4_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜やすい・〜にくい - このペンは書きやすいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Ease & Difficulty - ~Yasui / ~Nikui",
          "answer": "〜やすい・〜にくい - このペンは書きやすい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Ease & Difficulty - ~Yasui / ~Nikui?",
          "options": [
            "〜やすい・〜にくい - このペンは書きやすい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜やすい・〜にくい - このペンは書きやすい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Ease & Difficulty - ~Yasui / ~Nikui）",
          "answer": [
            "〜やすい・〜にくい - このペンは書きやすい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Ease & Difficulty - ~Yasui / ~Nikui reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l025",
      "title": "Quoting Speech - ~To Iu / ~To Omou",
      "titleJp": "〜と言う・〜と思う - 田中さんは来ると言った",
      "level": "N4",
      "order": 25,
      "duration": "25 min",
      "xp": 50,
      "description": "Reporting direct and indirect speech or thoughts.",
      "vocabulary": [
        "〜と言う・〜と思う - 田中さんは来ると言った"
      ],
      "grammar": [
        "n4_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜と言う・〜と思う - 田中さんは来ると言ったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Quoting Speech - ~To Iu / ~To Omou",
          "answer": "〜と言う・〜と思う - 田中さんは来ると言った"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Quoting Speech - ~To Iu / ~To Omou?",
          "options": [
            "〜と言う・〜と思う - 田中さんは来ると言った",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜と言う・〜と思う - 田中さんは来ると言った"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Quoting Speech - ~To Iu / ~To Omou）",
          "answer": [
            "〜と言う・〜と思う - 田中さんは来ると言った"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Quoting Speech - ~To Iu / ~To Omou reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l026",
      "title": "Personal Decision - ~Koto ni Suru",
      "titleJp": "〜ことにする - 毎日ジョギングすることにした",
      "level": "N4",
      "order": 26,
      "duration": "26 min",
      "xp": 55,
      "description": "Consciously deciding upon a personal resolution.",
      "vocabulary": [
        "〜ことにする - 毎日ジョギングすることにした"
      ],
      "grammar": [
        "n4_g002"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ことにする - 毎日ジョギングすることにしたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Personal Decision - ~Koto ni Suru",
          "answer": "〜ことにする - 毎日ジョギングすることにした"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Personal Decision - ~Koto ni Suru?",
          "options": [
            "〜ことにする - 毎日ジョギングすることにした",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ことにする - 毎日ジョギングすることにした"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Personal Decision - ~Koto ni Suru）",
          "answer": [
            "〜ことにする - 毎日ジョギングすることにした"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Personal Decision - ~Koto ni Suru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l027",
      "title": "External Decision - ~Koto ni Naru",
      "titleJp": "〜ことになる - 大阪へ転勤することになった",
      "level": "N4",
      "order": 27,
      "duration": "27 min",
      "xp": 60,
      "description": "Explaining decisions arranged by circumstances or rules.",
      "vocabulary": [
        "〜ことになる - 大阪へ転勤することになった"
      ],
      "grammar": [
        "n4_g003"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ことになる - 大阪へ転勤することになったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of External Decision - ~Koto ni Naru",
          "answer": "〜ことになる - 大阪へ転勤することになった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about External Decision - ~Koto ni Naru?",
          "options": [
            "〜ことになる - 大阪へ転勤することになった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ことになる - 大阪へ転勤することになった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（External Decision - ~Koto ni Naru）",
          "answer": [
            "〜ことになる - 大阪へ転勤することになった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding External Decision - ~Koto ni Naru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l028",
      "title": "Acquiring Habits - ~You ni Naru",
      "titleJp": "〜ようになる - 漢字が読めるようになった",
      "level": "N4",
      "order": 28,
      "duration": "28 min",
      "xp": 65,
      "description": "Reaching a new state of capability over time.",
      "vocabulary": [
        "〜ようになる - 漢字が読めるようになった"
      ],
      "grammar": [
        "n4_g004"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ようになる - 漢字が読めるようになったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Acquiring Habits - ~You ni Naru",
          "answer": "〜ようになる - 漢字が読めるようになった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Acquiring Habits - ~You ni Naru?",
          "options": [
            "〜ようになる - 漢字が読めるようになった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ようになる - 漢字が読めるようになった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Acquiring Habits - ~You ni Naru）",
          "answer": [
            "〜ようになる - 漢字が読めるようになった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Acquiring Habits - ~You ni Naru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l029",
      "title": "Conscious Effort - ~You ni Suru",
      "titleJp": "〜ようにする - 野菜を食べるようにしている",
      "level": "N4",
      "order": 29,
      "duration": "29 min",
      "xp": 70,
      "description": "Striving continuously to maintain a good practice.",
      "vocabulary": [
        "〜ようにする - 野菜を食べるようにしている"
      ],
      "grammar": [
        "n4_g005"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ようにする - 野菜を食べるようにしているについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Conscious Effort - ~You ni Suru",
          "answer": "〜ようにする - 野菜を食べるようにしている"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Conscious Effort - ~You ni Suru?",
          "options": [
            "〜ようにする - 野菜を食べるようにしている",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ようにする - 野菜を食べるようにしている"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Conscious Effort - ~You ni Suru）",
          "answer": [
            "〜ようにする - 野菜を食べるようにしている"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Conscious Effort - ~You ni Suru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l030",
      "title": "Without Doing - ~Naide / ~Zuni",
      "titleJp": "〜ないで・〜ずに - 辞書を見ないで読んだ",
      "level": "N4",
      "order": 30,
      "duration": "20 min",
      "xp": 50,
      "description": "Carrying out actions without doing another.",
      "vocabulary": [
        "〜ないで・〜ずに - 辞書を見ないで読んだ"
      ],
      "grammar": [
        "n4_g006"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ないで・〜ずに - 辞書を見ないで読んだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Without Doing - ~Naide / ~Zuni",
          "answer": "〜ないで・〜ずに - 辞書を見ないで読んだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Without Doing - ~Naide / ~Zuni?",
          "options": [
            "〜ないで・〜ずに - 辞書を見ないで読んだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ないで・〜ずに - 辞書を見ないで読んだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Without Doing - ~Naide / ~Zuni）",
          "answer": [
            "〜ないで・〜ずに - 辞書を見ないで読んだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Without Doing - ~Naide / ~Zuni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l031",
      "title": "Unexpected Contrast - ~Noni",
      "titleJp": "〜のに - 一生懸命勉強したのに不合格だった",
      "level": "N4",
      "order": 31,
      "duration": "21 min",
      "xp": 55,
      "description": "Expressing frustration at unexpected results.",
      "vocabulary": [
        "〜のに - 一生懸命勉強したのに不合格だった"
      ],
      "grammar": [
        "n4_g007"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜のに - 一生懸命勉強したのに不合格だったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Unexpected Contrast - ~Noni",
          "answer": "〜のに - 一生懸命勉強したのに不合格だった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Unexpected Contrast - ~Noni?",
          "options": [
            "〜のに - 一生懸命勉強したのに不合格だった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜のに - 一生懸命勉強したのに不合格だった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Unexpected Contrast - ~Noni）",
          "answer": [
            "〜のに - 一生懸命勉強したのに不合格だった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Unexpected Contrast - ~Noni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l032",
      "title": "Purposes - ~Tame ni vs ~You ni",
      "titleJp": "〜ために・〜ように - 家を買うために貯金する",
      "level": "N4",
      "order": 32,
      "duration": "22 min",
      "xp": 60,
      "description": "Distinguishing direct goals from potential conditions.",
      "vocabulary": [
        "〜ために・〜ように - 家を買うために貯金する"
      ],
      "grammar": [
        "n4_g008"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ために・〜ように - 家を買うために貯金するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Purposes - ~Tame ni vs ~You ni",
          "answer": "〜ために・〜ように - 家を買うために貯金する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Purposes - ~Tame ni vs ~You ni?",
          "options": [
            "〜ために・〜ように - 家を買うために貯金する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ために・〜ように - 家を買うために貯金する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Purposes - ~Tame ni vs ~You ni）",
          "answer": [
            "〜ために・〜ように - 家を買うために貯金する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Purposes - ~Tame ni vs ~You ni reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l033",
      "title": "Role & Capacity - ~Toshite",
      "titleJp": "〜として - 留学生として日本に来ました",
      "level": "N4",
      "order": 33,
      "duration": "23 min",
      "xp": 65,
      "description": "Stating someone's capacity, role, or qualification.",
      "vocabulary": [
        "〜として - 留学生として日本に来ました"
      ],
      "grammar": [
        "n4_g009"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜として - 留学生として日本に来ましたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Role & Capacity - ~Toshite",
          "answer": "〜として - 留学生として日本に来ました"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Role & Capacity - ~Toshite?",
          "options": [
            "〜として - 留学生として日本に来ました",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜として - 留学生として日本に来ました"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Role & Capacity - ~Toshite）",
          "answer": [
            "〜として - 留学生として日本に来ました"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Role & Capacity - ~Toshite reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l034",
      "title": "Causes & Agents - ~Ni Yotte",
      "titleJp": "〜によって - 台風によって電車が止まった",
      "level": "N4",
      "order": 34,
      "duration": "24 min",
      "xp": 70,
      "description": "Indicating agents of inventions or causes of events.",
      "vocabulary": [
        "〜によって - 台風によって電車が止まった"
      ],
      "grammar": [
        "n4_g010"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜によって - 台風によって電車が止まったについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Causes & Agents - ~Ni Yotte",
          "answer": "〜によって - 台風によって電車が止まった"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Causes & Agents - ~Ni Yotte?",
          "options": [
            "〜によって - 台風によって電車が止まった",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜によって - 台風によって電車が止まった"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Causes & Agents - ~Ni Yotte）",
          "answer": [
            "〜によって - 台風によって電車が止まった"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Causes & Agents - ~Ni Yotte reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l035",
      "title": "Regarding / Contrast - ~Ni Taishite",
      "titleJp": "〜に対して - お客様に対して礼儀正しくする",
      "level": "N4",
      "order": 35,
      "duration": "25 min",
      "xp": 50,
      "description": "Target of actions, or contrasting two elements.",
      "vocabulary": [
        "〜に対して - お客様に対して礼儀正しくする"
      ],
      "grammar": [
        "n4_g011"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜に対して - お客様に対して礼儀正しくするについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Regarding / Contrast - ~Ni Taishite",
          "answer": "〜に対して - お客様に対して礼儀正しくする"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Regarding / Contrast - ~Ni Taishite?",
          "options": [
            "〜に対して - お客様に対して礼儀正しくする",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜に対して - お客様に対して礼儀正しくする"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Regarding / Contrast - ~Ni Taishite）",
          "answer": [
            "〜に対して - お客様に対して礼儀正しくする"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Regarding / Contrast - ~Ni Taishite reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l036",
      "title": "Action Boundaries - ~Hajimeru / ~Owaru",
      "titleJp": "〜始める・〜終わる - 雨が降り始めた",
      "level": "N4",
      "order": 36,
      "duration": "26 min",
      "xp": 55,
      "description": "Pinpointing onset and conclusion of verb actions.",
      "vocabulary": [
        "〜始める・〜終わる - 雨が降り始めた"
      ],
      "grammar": [
        "n4_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜始める・〜終わる - 雨が降り始めたについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Action Boundaries - ~Hajimeru / ~Owaru",
          "answer": "〜始める・〜終わる - 雨が降り始めた"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Action Boundaries - ~Hajimeru / ~Owaru?",
          "options": [
            "〜始める・〜終わる - 雨が降り始めた",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜始める・〜終わる - 雨が降り始めた"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Action Boundaries - ~Hajimeru / ~Owaru）",
          "answer": [
            "〜始める・〜終わる - 雨が降り始めた"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Action Boundaries - ~Hajimeru / ~Owaru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l037",
      "title": "Persistence - ~Tsuzukeru",
      "titleJp": "〜続ける - 諦めずに走り続ける",
      "level": "N4",
      "order": 37,
      "duration": "27 min",
      "xp": 60,
      "description": "Enduring continuously through actions.",
      "vocabulary": [
        "〜続ける - 諦めずに走り続ける"
      ],
      "grammar": [
        "n4_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜続ける - 諦めずに走り続けるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Persistence - ~Tsuzukeru",
          "answer": "〜続ける - 諦めずに走り続ける"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Persistence - ~Tsuzukeru?",
          "options": [
            "〜続ける - 諦めずに走り続ける",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜続ける - 諦めずに走り続ける"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Persistence - ~Tsuzukeru）",
          "answer": [
            "〜続ける - 諦めずに走り続ける"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Persistence - ~Tsuzukeru reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l038",
      "title": "Just Completed - ~Ta Bakari / ~Ta Tokoro",
      "titleJp": "〜たばかり・〜たところ - 今起きたばかりだ",
      "level": "N4",
      "order": 38,
      "duration": "28 min",
      "xp": 65,
      "description": "Expressing actions that finished just moments ago.",
      "vocabulary": [
        "〜たばかり・〜たところ - 今起きたばかりだ"
      ],
      "grammar": [
        "n4_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜たばかり・〜たところ - 今起きたばかりだについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Just Completed - ~Ta Bakari / ~Ta Tokoro",
          "answer": "〜たばかり・〜たところ - 今起きたばかりだ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Just Completed - ~Ta Bakari / ~Ta Tokoro?",
          "options": [
            "〜たばかり・〜たところ - 今起きたばかりだ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜たばかり・〜たところ - 今起きたばかりだ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Just Completed - ~Ta Bakari / ~Ta Tokoro）",
          "answer": [
            "〜たばかり・〜たところ - 今起きたばかりだ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Just Completed - ~Ta Bakari / ~Ta Tokoro reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l039",
      "title": "Transitive and Intransitive Mastery",
      "titleJp": "他動詞と自動詞の使い分け",
      "level": "N4",
      "order": 39,
      "duration": "29 min",
      "xp": 70,
      "description": "Mastering key verb pairs in context.",
      "vocabulary": [
        "他動詞と自動詞の使い分け"
      ],
      "grammar": [
        "n4_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "他動詞と自動詞の使い分けについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Transitive and Intransitive Mastery",
          "answer": "他動詞と自動詞の使い分け"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Transitive and Intransitive Mastery?",
          "options": [
            "他動詞と自動詞の使い分け",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "他動詞と自動詞の使い分け"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Transitive and Intransitive Mastery）",
          "answer": [
            "他動詞と自動詞の使い分け"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Transitive and Intransitive Mastery reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l040",
      "title": "Gentle Commands - ~Nasai",
      "titleJp": "〜なさい - 早く寝なさい",
      "level": "N4",
      "order": 40,
      "duration": "20 min",
      "xp": 50,
      "description": "Parental or teacher commands with soft authority.",
      "vocabulary": [
        "〜なさい - 早く寝なさい"
      ],
      "grammar": [
        "n4_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜なさい - 早く寝なさいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Gentle Commands - ~Nasai",
          "answer": "〜なさい - 早く寝なさい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Gentle Commands - ~Nasai?",
          "options": [
            "〜なさい - 早く寝なさい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜なさい - 早く寝なさい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Gentle Commands - ~Nasai）",
          "answer": [
            "〜なさい - 早く寝なさい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Gentle Commands - ~Nasai reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l041",
      "title": "Obligations & Prohibitions in Daily Life",
      "titleJp": "日常生活での義務と禁止",
      "level": "N4",
      "order": 41,
      "duration": "21 min",
      "xp": 55,
      "description": "Rules on public trains, apartments, and sidewalks.",
      "vocabulary": [
        "日常生活での義務と禁止"
      ],
      "grammar": [
        "n4_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日常生活での義務と禁止について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Obligations & Prohibitions in Daily Life",
          "answer": "日常生活での義務と禁止"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Obligations & Prohibitions in Daily Life?",
          "options": [
            "日常生活での義務と禁止",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日常生活での義務と禁止"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Obligations & Prohibitions in Daily Life）",
          "answer": [
            "日常生活での義務と禁止"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Obligations & Prohibitions in Daily Life reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l042",
      "title": "Workplace Phone Basics",
      "titleJp": "ビジネス電話の受け答え",
      "level": "N4",
      "order": 42,
      "duration": "22 min",
      "xp": 60,
      "description": "Taking polite office calls and transferring inquiries.",
      "vocabulary": [
        "ビジネス電話の受け答え"
      ],
      "grammar": [
        "n4_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ビジネス電話の受け答えについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Workplace Phone Basics",
          "answer": "ビジネス電話の受け答え"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Workplace Phone Basics?",
          "options": [
            "ビジネス電話の受け答え",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ビジネス電話の受け答え"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Workplace Phone Basics）",
          "answer": [
            "ビジネス電話の受け答え"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Workplace Phone Basics reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l043",
      "title": "Writing Professional Inquiries",
      "titleJp": "丁寧な問い合わせメールの作成",
      "level": "N4",
      "order": 43,
      "duration": "23 min",
      "xp": 65,
      "description": "Drafting structured inquiry emails in business style.",
      "vocabulary": [
        "丁寧な問い合わせメールの作成"
      ],
      "grammar": [
        "n4_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "丁寧な問い合わせメールの作成について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Writing Professional Inquiries",
          "answer": "丁寧な問い合わせメールの作成"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Writing Professional Inquiries?",
          "options": [
            "丁寧な問い合わせメールの作成",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "丁寧な問い合わせメールの作成"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Writing Professional Inquiries）",
          "answer": [
            "丁寧な問い合わせメールの作成"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Writing Professional Inquiries reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l044",
      "title": "Handling Transport Delays",
      "titleJp": "電車の遅延と振替輸送への対応",
      "level": "N4",
      "order": 44,
      "duration": "24 min",
      "xp": 70,
      "description": "Communicating with station staff about delays.",
      "vocabulary": [
        "電車の遅延と振替輸送への対応"
      ],
      "grammar": [
        "n4_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "電車の遅延と振替輸送への対応について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Handling Transport Delays",
          "answer": "電車の遅延と振替輸送への対応"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Handling Transport Delays?",
          "options": [
            "電車の遅延と振替輸送への対応",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "電車の遅延と振替輸送への対応"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Handling Transport Delays）",
          "answer": [
            "電車の遅延と振替輸送への対応"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Handling Transport Delays reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l045",
      "title": "Renting an Apartment in Japan",
      "titleJp": "日本の不動産屋での部屋探し",
      "level": "N4",
      "order": 45,
      "duration": "25 min",
      "xp": 50,
      "description": "Key money (shikikin/reikin), contracts, and layouts.",
      "vocabulary": [
        "日本の不動産屋での部屋探し"
      ],
      "grammar": [
        "n4_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本の不動産屋での部屋探しについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Renting an Apartment in Japan",
          "answer": "日本の不動産屋での部屋探し"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Renting an Apartment in Japan?",
          "options": [
            "日本の不動産屋での部屋探し",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本の不動産屋での部屋探し"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Renting an Apartment in Japan）",
          "answer": [
            "日本の不動産屋での部屋探し"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Renting an Apartment in Japan reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l046",
      "title": "City Office Registration",
      "titleJp": "区役所・市役所での各種手続き",
      "level": "N4",
      "order": 46,
      "duration": "26 min",
      "xp": 55,
      "description": "Health insurance, my number, and address changes.",
      "vocabulary": [
        "区役所・市役所での各種手続き"
      ],
      "grammar": [
        "n4_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "区役所・市役所での各種手続きについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of City Office Registration",
          "answer": "区役所・市役所での各種手続き"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about City Office Registration?",
          "options": [
            "区役所・市役所での各種手続き",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "区役所・市役所での各種手続き"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（City Office Registration）",
          "answer": [
            "区役所・市役所での各種手続き"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding City Office Registration reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l047",
      "title": "Waste Separation Etiquette",
      "titleJp": "ゴミ分別とリサイクルの決まり",
      "level": "N4",
      "order": 47,
      "duration": "27 min",
      "xp": 60,
      "description": "Burnable, non-burnable, plastics, and bottle bins.",
      "vocabulary": [
        "ゴミ分別とリサイクルの決まり"
      ],
      "grammar": [
        "n4_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ゴミ分別とリサイクルの決まりについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Waste Separation Etiquette",
          "answer": "ゴミ分別とリサイクルの決まり"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Waste Separation Etiquette?",
          "options": [
            "ゴミ分別とリサイクルの決まり",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ゴミ分別とリサイクルの決まり"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Waste Separation Etiquette）",
          "answer": [
            "ゴミ分別とリサイクルの決まり"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Waste Separation Etiquette reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l048",
      "title": "Part-Time Job Interviewing",
      "titleJp": "アルバイト面接での質問と受け答え",
      "level": "N4",
      "order": 48,
      "duration": "28 min",
      "xp": 65,
      "description": "Jiko-PR, schedule availability, and motivations.",
      "vocabulary": [
        "アルバイト面接での質問と受け答え"
      ],
      "grammar": [
        "n4_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "アルバイト面接での質問と受け答えについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Part-Time Job Interviewing",
          "answer": "アルバイト面接での質問と受け答え"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Part-Time Job Interviewing?",
          "options": [
            "アルバイト面接での質問と受け答え",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "アルバイト面接での質問と受け答え"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Part-Time Job Interviewing）",
          "answer": [
            "アルバイト面接での質問と受け答え"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Part-Time Job Interviewing reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l049",
      "title": "Natural Disaster Preparedness",
      "titleJp": "地震・台風時の緊急対応と避難",
      "level": "N4",
      "order": 49,
      "duration": "29 min",
      "xp": 70,
      "description": "Disaster alerts, emergency kits, and evacuation spots.",
      "vocabulary": [
        "地震・台風時の緊急対応と避難"
      ],
      "grammar": [
        "n4_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "地震・台風時の緊急対応と避難について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Natural Disaster Preparedness",
          "answer": "地震・台風時の緊急対応と避難"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Natural Disaster Preparedness?",
          "options": [
            "地震・台風時の緊急対応と避難",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "地震・台風時の緊急対応と避難"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Natural Disaster Preparedness）",
          "answer": [
            "地震・台風時の緊急対応と避難"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Natural Disaster Preparedness reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n4l050",
      "title": "N4 Milestone: Practical Independence",
      "titleJp": "N4修了と中級への橋渡し",
      "level": "N4",
      "order": 50,
      "duration": "20 min",
      "xp": 50,
      "description": "Consolidating elementary grammar into natural flow.",
      "vocabulary": [
        "N4修了と中級への橋渡し"
      ],
      "grammar": [
        "n4_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "N4修了と中級への橋渡しについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of N4 Milestone: Practical Independence",
          "answer": "N4修了と中級への橋渡し"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about N4 Milestone: Practical Independence?",
          "options": [
            "N4修了と中級への橋渡し",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "N4修了と中級への橋渡し"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（N4 Milestone: Practical Independence）",
          "answer": [
            "N4修了と中級への橋渡し"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding N4 Milestone: Practical Independence reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はじめまして。山田です。よろしくお願いします。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "こちらこそ、よろしくお願いします。",
          "en": ""
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
      "culturalNote": "In Japan, bowing while greeting is customary. The depth of the bow reflects the level of respect.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "みっつ買います。",
          "en": ""
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
      "culturalNote": "Japanese has multiple counter systems depending on what is being counted.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "四人家族です。父と母と妹がいます。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "いいですね。私は一人っ子です。",
          "en": ""
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
      "culturalNote": "Japanese uses different words for your own family (humble) vs. someone else's family (honorific). ちち = my father; おとうさん = your/someone's father.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "六時に起きます。それから、シャワーを浴びて、朝ごはんを食べます。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "学校は何時から何時までですか？",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "八時半から三時までです。",
          "en": ""
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
      "culturalNote": "Japan uses both the 12-hour and 24-hour clock. Train schedules and official times often use the 24-hour format.",
      "kanji": []
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
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "ラーメンをひとつと、餃子をふたつください。",
          "en": ""
        },
        {
          "speaker": "Store",
          "jp": "お飲み物はいかがですか？",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "お茶をください。",
          "en": ""
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
      "culturalNote": "いただきます is said before eating, expressing gratitude. ごちそうさまでした is said after eating, thanking the cook or host.",
      "kanji": []
    },
    {
      "id": "n5l006",
      "title": "Asking for Directions",
      "titleJp": "道案内と場所",
      "level": "N5",
      "order": 6,
      "duration": "25 min",
      "xp": 50,
      "description": "Learn how to navigate Japanese cities and ask for directions politely.",
      "vocabulary": [
        "みぎ",
        "ひだり",
        "まっすぐ",
        "となり",
        "ちかく",
        "こうばん"
      ],
      "grammar": [
        "〜はどこですか",
        "〜をまっすぐ行ってください",
        "〜のとなりにあります"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "すみません、駅はどこですか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "この道をまっすぐ行って、右に曲がってください。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "ありがとうございます！",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Where is the station?",
          "answer": "えきはどこですか"
        },
        {
          "type": "fill",
          "question": "この道をまっすぐ___ください。",
          "answer": [
            "いって"
          ]
        }
      ],
      "culturalNote": "Japanese police boxes (交番, kouban) are prominent throughout cities and will happily provide directions with maps.",
      "kanji": []
    },
    {
      "id": "n5l007",
      "title": "Shopping & Asking Prices",
      "titleJp": "買い物と値段",
      "level": "N5",
      "order": 7,
      "duration": "20 min",
      "xp": 50,
      "description": "Learn how to ask for prices, specify items, and purchase goods in stores.",
      "vocabulary": [
        "いくら",
        "これ",
        "それ",
        "あれ",
        "店員",
        "レシート"
      ],
      "grammar": [
        "これはいくらですか",
        "〜をください",
        "〜円です"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "すみません、この傘はいくらですか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "千円です。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "じゃ、これをください。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "How much is this?",
          "answer": "これはいくらですか"
        },
        {
          "type": "multiple",
          "question": "How do you say \"Please give me this\"?",
          "options": [
            "これをおねがい",
            "これをください",
            "これです",
            "これがある"
          ],
          "answer": "これをください"
        }
      ],
      "culturalNote": "When paying in Japan, you place your money into a small plastic or metallic tray (カルトン) on the counter rather than handing it directly.",
      "kanji": []
    },
    {
      "id": "n5l008",
      "title": "Ordering at Restaurants",
      "titleJp": "レストランでの注文",
      "level": "N5",
      "order": 8,
      "duration": "25 min",
      "xp": 55,
      "description": "Master ordering delicious Japanese food, asking for water, and requesting the bill.",
      "vocabulary": [
        "メニュー",
        "みず",
        "おすすめ",
        "おかいけい",
        "ごちそうさま"
      ],
      "grammar": [
        "〜をおねがいします",
        "おすすめは何ですか",
        "お会計をお願いします"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "すみません、お水をいただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、かしこまりました。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "あと、ラーメンをひとつお願いします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Check please",
          "answer": "おかいけいをおねがいします"
        },
        {
          "type": "fill",
          "question": "メニューを___ください。",
          "answer": [
            "みせて"
          ]
        }
      ],
      "culturalNote": "Saying ごちそうさまでした (Gochisousama deshita) when leaving a restaurant expresses heartfelt gratitude for the meal.",
      "kanji": []
    },
    {
      "id": "n5l009",
      "title": "Hobbies & Leisure",
      "titleJp": "趣味と余暇",
      "level": "N5",
      "order": 9,
      "duration": "20 min",
      "xp": 50,
      "description": "Talk about your favorite hobbies, sports, music, and weekend activities.",
      "vocabulary": [
        "しゅみ",
        "スポーツ",
        "おんがく",
        "どくしょ",
        "りょこう"
      ],
      "grammar": [
        "私の趣味は〜ことです",
        "〜が好きです",
        "休みの日に〜をします"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "趣味は何ですか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "映画を見ることと、音楽を聴くことです。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "どんな映画が好きですか。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I like music",
          "answer": "おんがくがすきです"
        },
        {
          "type": "multiple",
          "question": "How do you say \"My hobby is reading\"?",
          "options": [
            "しゅみはほん",
            "しゅみはどくしょです",
            "しゅみはよみます",
            "ほんがすき"
          ],
          "answer": "しゅみはどくしょです"
        }
      ],
      "culturalNote": "In Japan, sharing hobbies (趣味) is one of the most common icebreakers when meeting new classmates or colleagues.",
      "kanji": []
    },
    {
      "id": "n5l010",
      "title": "Travel & Vacation Plans",
      "titleJp": "旅行と休日の予定",
      "level": "N5",
      "order": 10,
      "duration": "30 min",
      "xp": 60,
      "description": "Learn how to discuss upcoming trips, hotel stays, and vacation dates.",
      "vocabulary": [
        "りょこう",
        "ホテル",
        "きっぷ",
        "おみやげ",
        "しゃしん"
      ],
      "grammar": [
        "〜へ行きたいです",
        "〜泊〜日",
        "〜でお土産を買いました"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "週末、どこかへ行きましたか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "京都へ行って、たくさん写真を撮りました。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "いいですね！お土産も買いましたか。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "I want to go to Kyoto",
          "answer": "きょうとへいきたいです"
        },
        {
          "type": "fill",
          "question": "写真をたくさん___。",
          "answer": [
            "とりました"
          ]
        }
      ],
      "culturalNote": "Giving おみやげ (omiyage - souvenir gifts, usually regional snacks) to friends and coworkers after traveling is an essential social norm.",
      "kanji": []
    },
    {
      "id": "n5l011",
      "title": "Days of the Week & Calendar",
      "titleJp": "曜日とカレンダー",
      "level": "N5",
      "order": 11,
      "duration": "21 min",
      "xp": 55,
      "description": "Dates, days, months, and planning appointments.",
      "vocabulary": [
        "曜日とカレンダー"
      ],
      "grammar": [
        "n5_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "曜日とカレンダーについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Days of the Week & Calendar",
          "answer": "曜日とカレンダー"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Days of the Week & Calendar?",
          "options": [
            "曜日とカレンダー",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "曜日とカレンダー"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Days of the Week & Calendar）",
          "answer": [
            "曜日とカレンダー"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Days of the Week & Calendar reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l012",
      "title": "At the Convenience Store",
      "titleJp": "コンビニでの買い物",
      "level": "N5",
      "order": 12,
      "duration": "22 min",
      "xp": 60,
      "description": "Interacting with clerks at a Japanese konbini.",
      "vocabulary": [
        "コンビニでの買い物"
      ],
      "grammar": [
        "n5_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "コンビニでの買い物について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of At the Convenience Store",
          "answer": "コンビニでの買い物"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about At the Convenience Store?",
          "options": [
            "コンビニでの買い物",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "コンビニでの買い物"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（At the Convenience Store）",
          "answer": [
            "コンビニでの買い物"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding At the Convenience Store reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l013",
      "title": "Commuting by Train & Bus",
      "titleJp": "電車とバスでの移動",
      "level": "N5",
      "order": 13,
      "duration": "23 min",
      "xp": 65,
      "description": "Buying tickets and riding public transport in Tokyo.",
      "vocabulary": [
        "電車とバスでの移動"
      ],
      "grammar": [
        "n5_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "電車とバスでの移動について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Commuting by Train & Bus",
          "answer": "電車とバスでの移動"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Commuting by Train & Bus?",
          "options": [
            "電車とバスでの移動",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "電車とバスでの移動"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Commuting by Train & Bus）",
          "answer": [
            "電車とバスでの移動"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Commuting by Train & Bus reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l014",
      "title": "Weekend Plans & Invitations",
      "titleJp": "週末の予定と誘い",
      "level": "N5",
      "order": 14,
      "duration": "24 min",
      "xp": 70,
      "description": "Inviting friends to go out using ~masen ka.",
      "vocabulary": [
        "週末の予定と誘い"
      ],
      "grammar": [
        "n5_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "週末の予定と誘いについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Weekend Plans & Invitations",
          "answer": "週末の予定と誘い"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Weekend Plans & Invitations?",
          "options": [
            "週末の予定と誘い",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "週末の予定と誘い"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Weekend Plans & Invitations）",
          "answer": [
            "週末の予定と誘い"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Weekend Plans & Invitations reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l015",
      "title": "Home & Living Spaces",
      "titleJp": "家と部屋の様子",
      "level": "N5",
      "order": 15,
      "duration": "25 min",
      "xp": 50,
      "description": "Describing rooms, furniture, and where items are located.",
      "vocabulary": [
        "家と部屋の様子"
      ],
      "grammar": [
        "n5_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "家と部屋の様子について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Home & Living Spaces",
          "answer": "家と部屋の様子"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Home & Living Spaces?",
          "options": [
            "家と部屋の様子",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "家と部屋の様子"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Home & Living Spaces）",
          "answer": [
            "家と部屋の様子"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Home & Living Spaces reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l016",
      "title": "Describing People & Appearance",
      "titleJp": "人の外見と性格",
      "level": "N5",
      "order": 16,
      "duration": "26 min",
      "xp": 55,
      "description": "Adjectives for height, hair, clothing, and traits.",
      "vocabulary": [
        "人の外見と性格"
      ],
      "grammar": [
        "n5_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "人の外見と性格について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Describing People & Appearance",
          "answer": "人の外見と性格"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Describing People & Appearance?",
          "options": [
            "人の外見と性格",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "人の外見と性格"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Describing People & Appearance）",
          "answer": [
            "人の外見と性格"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Describing People & Appearance reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l017",
      "title": "Colors & Clothes",
      "titleJp": "色と服装",
      "level": "N5",
      "order": 17,
      "duration": "27 min",
      "xp": 60,
      "description": "Naming colors, shoes, shirts, coats, and hats.",
      "vocabulary": [
        "色と服装"
      ],
      "grammar": [
        "n5_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "色と服装について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Colors & Clothes",
          "answer": "色と服装"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Colors & Clothes?",
          "options": [
            "色と服装",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "色と服装"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Colors & Clothes）",
          "answer": [
            "色と服装"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Colors & Clothes reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l018",
      "title": "Health & At the Clinic",
      "titleJp": "体調と病院で",
      "level": "N5",
      "order": 18,
      "duration": "28 min",
      "xp": 65,
      "description": "Explaining symptoms like head aches and colds to a doctor.",
      "vocabulary": [
        "体調と病院で"
      ],
      "grammar": [
        "n5_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "体調と病院でについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Health & At the Clinic",
          "answer": "体調と病院で"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Health & At the Clinic?",
          "options": [
            "体調と病院で",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "体調と病院で"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Health & At the Clinic）",
          "answer": [
            "体調と病院で"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Health & At the Clinic reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l019",
      "title": "Likes, Dislikes & Preferences",
      "titleJp": "好きなものと嫌いなもの",
      "level": "N5",
      "order": 19,
      "duration": "29 min",
      "xp": 70,
      "description": "Using suki, kirai, and jouzu to express tastes.",
      "vocabulary": [
        "好きなものと嫌いなもの"
      ],
      "grammar": [
        "n5_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "好きなものと嫌いなものについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Likes, Dislikes & Preferences",
          "answer": "好きなものと嫌いなもの"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Likes, Dislikes & Preferences?",
          "options": [
            "好きなものと嫌いなもの",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "好きなものと嫌いなもの"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Likes, Dislikes & Preferences）",
          "answer": [
            "好きなものと嫌いなもの"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Likes, Dislikes & Preferences reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l020",
      "title": "Seasons & Annual Japanese Holidays",
      "titleJp": "日本の四季と祝日",
      "level": "N5",
      "order": 20,
      "duration": "20 min",
      "xp": 50,
      "description": "New Year's, Hanami, Obon, and Golden Week.",
      "vocabulary": [
        "日本の四季と祝日"
      ],
      "grammar": [
        "n5_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本の四季と祝日について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Seasons & Annual Japanese Holidays",
          "answer": "日本の四季と祝日"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Seasons & Annual Japanese Holidays?",
          "options": [
            "日本の四季と祝日",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本の四季と祝日"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Seasons & Annual Japanese Holidays）",
          "answer": [
            "日本の四季と祝日"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Seasons & Annual Japanese Holidays reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l021",
      "title": "Giving & Receiving Gifts",
      "titleJp": "プレゼントのやり取り - あげる/もらう",
      "level": "N5",
      "order": 21,
      "duration": "21 min",
      "xp": 55,
      "description": "Social exchange etiquette with ageru and morau.",
      "vocabulary": [
        "プレゼントのやり取り - あげる/もらう"
      ],
      "grammar": [
        "n5_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "プレゼントのやり取り - あげる/もらうについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Giving & Receiving Gifts",
          "answer": "プレゼントのやり取り - あげる/もらう"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Giving & Receiving Gifts?",
          "options": [
            "プレゼントのやり取り - あげる/もらう",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "プレゼントのやり取り - あげる/もらう"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Giving & Receiving Gifts）",
          "answer": [
            "プレゼントのやり取り - あげる/もらう"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Giving & Receiving Gifts reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l022",
      "title": "Asking Permission",
      "titleJp": "許可を求める - 〜てもいいですか",
      "level": "N5",
      "order": 22,
      "duration": "22 min",
      "xp": 60,
      "description": "Politely asking if you may take photos or sit down.",
      "vocabulary": [
        "許可を求める - 〜てもいいですか"
      ],
      "grammar": [
        "n5_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "許可を求める - 〜てもいいですかについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Asking Permission",
          "answer": "許可を求める - 〜てもいいですか"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Asking Permission?",
          "options": [
            "許可を求める - 〜てもいいですか",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "許可を求める - 〜てもいいですか"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Asking Permission）",
          "answer": [
            "許可を求める - 〜てもいいですか"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Asking Permission reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l023",
      "title": "Prohibitions & Rules",
      "titleJp": "禁止とルール - 〜てはいけません",
      "level": "N5",
      "order": 23,
      "duration": "23 min",
      "xp": 65,
      "description": "Understanding signs and rules in museums and stations.",
      "vocabulary": [
        "禁止とルール - 〜てはいけません"
      ],
      "grammar": [
        "n5_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "禁止とルール - 〜てはいけませんについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Prohibitions & Rules",
          "answer": "禁止とルール - 〜てはいけません"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Prohibitions & Rules?",
          "options": [
            "禁止とルール - 〜てはいけません",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "禁止とルール - 〜てはいけません"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Prohibitions & Rules）",
          "answer": [
            "禁止とルール - 〜てはいけません"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Prohibitions & Rules reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l024",
      "title": "Explaining Reasons",
      "titleJp": "理由を説明する - 〜から",
      "level": "N5",
      "order": 24,
      "duration": "24 min",
      "xp": 70,
      "description": "Giving straightforward explanations with kara.",
      "vocabulary": [
        "理由を説明する - 〜から"
      ],
      "grammar": [
        "n5_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "理由を説明する - 〜からについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Explaining Reasons",
          "answer": "理由を説明する - 〜から"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Explaining Reasons?",
          "options": [
            "理由を説明する - 〜から",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "理由を説明する - 〜から"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Explaining Reasons）",
          "answer": [
            "理由を説明する - 〜から"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Explaining Reasons reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l025",
      "title": "Comparing Two Items",
      "titleJp": "比較する - AよりBのほうが",
      "level": "N5",
      "order": 25,
      "duration": "25 min",
      "xp": 50,
      "description": "Comparing speed, price, and quality between two choices.",
      "vocabulary": [
        "比較する - AよりBのほうが"
      ],
      "grammar": [
        "n5_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "比較する - AよりBのほうがについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Comparing Two Items",
          "answer": "比較する - AよりBのほうが"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Comparing Two Items?",
          "options": [
            "比較する - AよりBのほうが",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "比較する - AよりBのほうが"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Comparing Two Items）",
          "answer": [
            "比較する - AよりBのほうが"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Comparing Two Items reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l026",
      "title": "Superlatives in a Group",
      "titleJp": "一番〜なもの - グループでの比較",
      "level": "N5",
      "order": 26,
      "duration": "26 min",
      "xp": 55,
      "description": "Saying which is the best, tallest, or tastiest.",
      "vocabulary": [
        "一番〜なもの - グループでの比較"
      ],
      "grammar": [
        "n5_g002"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "一番〜なもの - グループでの比較について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Superlatives in a Group",
          "answer": "一番〜なもの - グループでの比較"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Superlatives in a Group?",
          "options": [
            "一番〜なもの - グループでの比較",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "一番〜なもの - グループでの比較"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Superlatives in a Group）",
          "answer": [
            "一番〜なもの - グループでの比較"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Superlatives in a Group reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l027",
      "title": "Past Experiences",
      "titleJp": "経験を話す - 〜たことがある",
      "level": "N5",
      "order": 27,
      "duration": "27 min",
      "xp": 60,
      "description": "Sharing travel and activity experiences with ~ta koto ga aru.",
      "vocabulary": [
        "経験を話す - 〜たことがある"
      ],
      "grammar": [
        "n5_g003"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "経験を話す - 〜たことがあるについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Past Experiences",
          "answer": "経験を話す - 〜たことがある"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Past Experiences?",
          "options": [
            "経験を話す - 〜たことがある",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "経験を話す - 〜たことがある"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Past Experiences）",
          "answer": [
            "経験を話す - 〜たことがある"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Past Experiences reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l028",
      "title": "Sequential Actions",
      "titleJp": "順番に行動する - 〜てから",
      "level": "N5",
      "order": 28,
      "duration": "28 min",
      "xp": 65,
      "description": "Describing doing task A before moving to task B.",
      "vocabulary": [
        "順番に行動する - 〜てから"
      ],
      "grammar": [
        "n5_g004"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "順番に行動する - 〜てからについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Sequential Actions",
          "answer": "順番に行動する - 〜てから"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Sequential Actions?",
          "options": [
            "順番に行動する - 〜てから",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "順番に行動する - 〜てから"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Sequential Actions）",
          "answer": [
            "順番に行動する - 〜てから"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Sequential Actions reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l029",
      "title": "Expressing Desires",
      "titleJp": "希望を述べる - 〜たい / 〜たくない",
      "level": "N5",
      "order": 29,
      "duration": "29 min",
      "xp": 70,
      "description": "Stating what you want to do or don't want to do.",
      "vocabulary": [
        "希望を述べる - 〜たい / 〜たくない"
      ],
      "grammar": [
        "n5_g005"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "希望を述べる - 〜たい / 〜たくないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Expressing Desires",
          "answer": "希望を述べる - 〜たい / 〜たくない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Expressing Desires?",
          "options": [
            "希望を述べる - 〜たい / 〜たくない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "希望を述べる - 〜たい / 〜たくない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Expressing Desires）",
          "answer": [
            "希望を述べる - 〜たい / 〜たくない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Expressing Desires reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l030",
      "title": "Simultaneous Actions",
      "titleJp": "〜ながら - 音楽を聴きながら勉強する",
      "level": "N5",
      "order": 30,
      "duration": "20 min",
      "xp": 50,
      "description": "Doing two tasks at once with nagara.",
      "vocabulary": [
        "〜ながら - 音楽を聴きながら勉強する"
      ],
      "grammar": [
        "n5_g006"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "〜ながら - 音楽を聴きながら勉強するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Simultaneous Actions",
          "answer": "〜ながら - 音楽を聴きながら勉強する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Simultaneous Actions?",
          "options": [
            "〜ながら - 音楽を聴きながら勉強する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "〜ながら - 音楽を聴きながら勉強する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Simultaneous Actions）",
          "answer": [
            "〜ながら - 音楽を聴きながら勉強する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Simultaneous Actions reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l031",
      "title": "Talking on the Phone",
      "titleJp": "電話での会話",
      "level": "N5",
      "order": 31,
      "duration": "21 min",
      "xp": 55,
      "description": "Moshi moshi, answering, and taking simple messages.",
      "vocabulary": [
        "電話での会話"
      ],
      "grammar": [
        "n5_g007"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "電話での会話について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Talking on the Phone",
          "answer": "電話での会話"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Talking on the Phone?",
          "options": [
            "電話での会話",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "電話での会話"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Talking on the Phone）",
          "answer": [
            "電話での会話"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Talking on the Phone reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l032",
      "title": "Visiting a Friend's Home",
      "titleJp": "友達の家を訪問する",
      "level": "N5",
      "order": 32,
      "duration": "22 min",
      "xp": 60,
      "description": "Ojama shimasu etiquette, gifts, and taking off shoes.",
      "vocabulary": [
        "友達の家を訪問する"
      ],
      "grammar": [
        "n5_g008"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "友達の家を訪問するについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Visiting a Friend's Home",
          "answer": "友達の家を訪問する"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Visiting a Friend's Home?",
          "options": [
            "友達の家を訪問する",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "友達の家を訪問する"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Visiting a Friend's Home）",
          "answer": [
            "友達の家を訪問する"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Visiting a Friend's Home reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l033",
      "title": "Expressing Change of State",
      "titleJp": "変化を表す - 〜になる / 〜にする",
      "level": "N5",
      "order": 33,
      "duration": "23 min",
      "xp": 65,
      "description": "Becoming cold, turning 20, or choosing an option.",
      "vocabulary": [
        "変化を表す - 〜になる / 〜にする"
      ],
      "grammar": [
        "n5_g009"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "変化を表す - 〜になる / 〜にするについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Expressing Change of State",
          "answer": "変化を表す - 〜になる / 〜にする"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Expressing Change of State?",
          "options": [
            "変化を表す - 〜になる / 〜にする",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "変化を表す - 〜になる / 〜にする"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Expressing Change of State）",
          "answer": [
            "変化を表す - 〜になる / 〜にする"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Expressing Change of State reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l034",
      "title": "Giving Casual Advice",
      "titleJp": "アドバイスをする - 〜ほうがいい",
      "level": "N5",
      "order": 34,
      "duration": "24 min",
      "xp": 70,
      "description": "Recommending healthy habits with ~hou ga ii.",
      "vocabulary": [
        "アドバイスをする - 〜ほうがいい"
      ],
      "grammar": [
        "n5_g010"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "アドバイスをする - 〜ほうがいいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Giving Casual Advice",
          "answer": "アドバイスをする - 〜ほうがいい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Giving Casual Advice?",
          "options": [
            "アドバイスをする - 〜ほうがいい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "アドバイスをする - 〜ほうがいい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Giving Casual Advice）",
          "answer": [
            "アドバイスをする - 〜ほうがいい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Giving Casual Advice reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l035",
      "title": "Obligation & Necessity",
      "titleJp": "義務と必要 - 〜なければならない",
      "level": "N5",
      "order": 35,
      "duration": "25 min",
      "xp": 50,
      "description": "Expressing must-do tasks for school and work.",
      "vocabulary": [
        "義務と必要 - 〜なければならない"
      ],
      "grammar": [
        "n5_g011"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "義務と必要 - 〜なければならないについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Obligation & Necessity",
          "answer": "義務と必要 - 〜なければならない"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Obligation & Necessity?",
          "options": [
            "義務と必要 - 〜なければならない",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "義務と必要 - 〜なければならない"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Obligation & Necessity）",
          "answer": [
            "義務と必要 - 〜なければならない"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Obligation & Necessity reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l036",
      "title": "No Need / Optionality",
      "titleJp": "不要の表現 - 〜なくてもいい",
      "level": "N5",
      "order": 36,
      "duration": "26 min",
      "xp": 55,
      "description": "Reassuring someone that an action is unnecessary.",
      "vocabulary": [
        "不要の表現 - 〜なくてもいい"
      ],
      "grammar": [
        "n5_g012"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "不要の表現 - 〜なくてもいいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of No Need / Optionality",
          "answer": "不要の表現 - 〜なくてもいい"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about No Need / Optionality?",
          "options": [
            "不要の表現 - 〜なくてもいい",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "不要の表現 - 〜なくてもいい"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（No Need / Optionality）",
          "answer": [
            "不要の表現 - 〜なくてもいい"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding No Need / Optionality reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l037",
      "title": "Casual Speech with Friends",
      "titleJp": "友達とのタメ口 - 常体",
      "level": "N5",
      "order": 37,
      "duration": "27 min",
      "xp": 60,
      "description": "Short forms, da, and friendly particle drops.",
      "vocabulary": [
        "友達とのタメ口 - 常体"
      ],
      "grammar": [
        "n5_g013"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "友達とのタメ口 - 常体について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Casual Speech with Friends",
          "answer": "友達とのタメ口 - 常体"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Casual Speech with Friends?",
          "options": [
            "友達とのタメ口 - 常体",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "友達とのタメ口 - 常体"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Casual Speech with Friends）",
          "answer": [
            "友達とのタメ口 - 常体"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Casual Speech with Friends reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l038",
      "title": "Asking for Polite Favors",
      "titleJp": "丁寧にお願いする - 〜てください",
      "level": "N5",
      "order": 38,
      "duration": "28 min",
      "xp": 65,
      "description": "Requesting actions with ~te kudasai.",
      "vocabulary": [
        "丁寧にお願いする - 〜てください"
      ],
      "grammar": [
        "n5_g014"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "丁寧にお願いする - 〜てくださいについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Asking for Polite Favors",
          "answer": "丁寧にお願いする - 〜てください"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Asking for Polite Favors?",
          "options": [
            "丁寧にお願いする - 〜てください",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "丁寧にお願いする - 〜てください"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Asking for Polite Favors）",
          "answer": [
            "丁寧にお願いする - 〜てください"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Asking for Polite Favors reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l039",
      "title": "Lost and Found",
      "titleJp": "落とし物を探す - 交番で",
      "level": "N5",
      "order": 39,
      "duration": "29 min",
      "xp": 70,
      "description": "Reporting lost wallets and umbrellas at the kouban.",
      "vocabulary": [
        "落とし物を探す - 交番で"
      ],
      "grammar": [
        "n5_g015"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "落とし物を探す - 交番でについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Lost and Found",
          "answer": "落とし物を探す - 交番で"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Lost and Found?",
          "options": [
            "落とし物を探す - 交番で",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "落とし物を探す - 交番で"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Lost and Found）",
          "answer": [
            "落とし物を探す - 交番で"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Lost and Found reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l040",
      "title": "At the Post Office & Bank",
      "titleJp": "郵便局と銀行での手続き",
      "level": "N5",
      "order": 40,
      "duration": "20 min",
      "xp": 50,
      "description": "Mailing letters, exchanging currency, and ATMs.",
      "vocabulary": [
        "郵便局と銀行での手続き"
      ],
      "grammar": [
        "n5_g016"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "郵便局と銀行での手続きについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of At the Post Office & Bank",
          "answer": "郵便局と銀行での手続き"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about At the Post Office & Bank?",
          "options": [
            "郵便局と銀行での手続き",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "郵便局と銀行での手続き"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（At the Post Office & Bank）",
          "answer": [
            "郵便局と銀行での手続き"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding At the Post Office & Bank reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l041",
      "title": "Cooking & Simple Recipes",
      "titleJp": "料理と簡単レシピ",
      "level": "N5",
      "order": 41,
      "duration": "21 min",
      "xp": 55,
      "description": "Kitchen verbs like cut, boil, fry, and mix.",
      "vocabulary": [
        "料理と簡単レシピ"
      ],
      "grammar": [
        "n5_g017"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "料理と簡単レシピについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Cooking & Simple Recipes",
          "answer": "料理と簡単レシピ"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Cooking & Simple Recipes?",
          "options": [
            "料理と簡単レシピ",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "料理と簡単レシピ"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Cooking & Simple Recipes）",
          "answer": [
            "料理と簡単レシピ"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Cooking & Simple Recipes reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l042",
      "title": "Pets & Animal Vocabulary",
      "titleJp": "ペットと動物の言葉",
      "level": "N5",
      "order": 42,
      "duration": "22 min",
      "xp": 60,
      "description": "Dogs, cats, birds, and describing animal habits.",
      "vocabulary": [
        "ペットと動物の言葉"
      ],
      "grammar": [
        "n5_g018"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "ペットと動物の言葉について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Pets & Animal Vocabulary",
          "answer": "ペットと動物の言葉"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Pets & Animal Vocabulary?",
          "options": [
            "ペットと動物の言葉",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "ペットと動物の言葉"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Pets & Animal Vocabulary）",
          "answer": [
            "ペットと動物の言葉"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Pets & Animal Vocabulary reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l043",
      "title": "Sports & Fitness Activities",
      "titleJp": "スポーツと運動習慣",
      "level": "N5",
      "order": 43,
      "duration": "23 min",
      "xp": 65,
      "description": "Talking about gym visits, jogging, and soccer.",
      "vocabulary": [
        "スポーツと運動習慣"
      ],
      "grammar": [
        "n5_g019"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "スポーツと運動習慣について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Sports & Fitness Activities",
          "answer": "スポーツと運動習慣"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Sports & Fitness Activities?",
          "options": [
            "スポーツと運動習慣",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "スポーツと運動習慣"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Sports & Fitness Activities）",
          "answer": [
            "スポーツと運動習慣"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Sports & Fitness Activities reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l044",
      "title": "Anime, Manga & Pop Culture",
      "titleJp": "アニメ・漫画・ポップカルチャー",
      "level": "N5",
      "order": 44,
      "duration": "24 min",
      "xp": 70,
      "description": "Discussing favorite series, genres, and conventions.",
      "vocabulary": [
        "アニメ・漫画・ポップカルチャー"
      ],
      "grammar": [
        "n5_g020"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "アニメ・漫画・ポップカルチャーについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Anime, Manga & Pop Culture",
          "answer": "アニメ・漫画・ポップカルチャー"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Anime, Manga & Pop Culture?",
          "options": [
            "アニメ・漫画・ポップカルチャー",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "アニメ・漫画・ポップカルチャー"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Anime, Manga & Pop Culture）",
          "answer": [
            "アニメ・漫画・ポップカルチャー"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Anime, Manga & Pop Culture reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l045",
      "title": "Sightseeing in Kyoto & Tokyo",
      "titleJp": "京都と東京の名所案内",
      "level": "N5",
      "order": 45,
      "duration": "25 min",
      "xp": 50,
      "description": "Visiting Asakusa, Shibuya, Kinkaku-ji, and Gion.",
      "vocabulary": [
        "京都と東京の名所案内"
      ],
      "grammar": [
        "n5_g021"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "京都と東京の名所案内について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Sightseeing in Kyoto & Tokyo",
          "answer": "京都と東京の名所案内"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Sightseeing in Kyoto & Tokyo?",
          "options": [
            "京都と東京の名所案内",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "京都と東京の名所案内"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Sightseeing in Kyoto & Tokyo）",
          "answer": [
            "京都と東京の名所案内"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Sightseeing in Kyoto & Tokyo reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l046",
      "title": "Japanese Table Manners",
      "titleJp": "日本の食事作法と箸の使い方",
      "level": "N5",
      "order": 46,
      "duration": "26 min",
      "xp": 55,
      "description": "Itadakimasu, gochisousama, and chopstick taboos.",
      "vocabulary": [
        "日本の食事作法と箸の使い方"
      ],
      "grammar": [
        "n5_g022"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日本の食事作法と箸の使い方について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Japanese Table Manners",
          "answer": "日本の食事作法と箸の使い方"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Japanese Table Manners?",
          "options": [
            "日本の食事作法と箸の使い方",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日本の食事作法と箸の使い方"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Japanese Table Manners）",
          "answer": [
            "日本の食事作法と箸の使い方"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Japanese Table Manners reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l047",
      "title": "Visiting Shrines & Temples",
      "titleJp": "神社とお寺の参拝作法",
      "level": "N5",
      "order": 47,
      "duration": "27 min",
      "xp": 60,
      "description": "Purification fountains, bowing, clapping, and omikuji.",
      "vocabulary": [
        "神社とお寺の参拝作法"
      ],
      "grammar": [
        "n5_g023"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "神社とお寺の参拝作法について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Visiting Shrines & Temples",
          "answer": "神社とお寺の参拝作法"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Visiting Shrines & Temples?",
          "options": [
            "神社とお寺の参拝作法",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "神社とお寺の参拝作法"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Visiting Shrines & Temples）",
          "answer": [
            "神社とお寺の参拝作法"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Visiting Shrines & Temples reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l048",
      "title": "Onsen & Public Bath Etiquette",
      "titleJp": "温泉の入り方とルール",
      "level": "N5",
      "order": 48,
      "duration": "28 min",
      "xp": 65,
      "description": "Washing before entering the hot spring waters.",
      "vocabulary": [
        "温泉の入り方とルール"
      ],
      "grammar": [
        "n5_g024"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "温泉の入り方とルールについて相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Onsen & Public Bath Etiquette",
          "answer": "温泉の入り方とルール"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Onsen & Public Bath Etiquette?",
          "options": [
            "温泉の入り方とルール",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "温泉の入り方とルール"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Onsen & Public Bath Etiquette）",
          "answer": [
            "温泉の入り方とルール"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Onsen & Public Bath Etiquette reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l049",
      "title": "Planning a Day Trip",
      "titleJp": "日帰り旅行の計画",
      "level": "N5",
      "order": 49,
      "duration": "29 min",
      "xp": 70,
      "description": "Packing, buying tickets, and checking departure times.",
      "vocabulary": [
        "日帰り旅行の計画"
      ],
      "grammar": [
        "n5_g025"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "日帰り旅行の計画について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of Planning a Day Trip",
          "answer": "日帰り旅行の計画"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about Planning a Day Trip?",
          "options": [
            "日帰り旅行の計画",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "日帰り旅行の計画"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（Planning a Day Trip）",
          "answer": [
            "日帰り旅行の計画"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding Planning a Day Trip reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    },
    {
      "id": "n5l050",
      "title": "N5 Milestone: Review & Goals",
      "titleJp": "N5修了とこれからの目標",
      "level": "N5",
      "order": 50,
      "duration": "20 min",
      "xp": 50,
      "description": "Reflecting on beginner foundations and stepping to N4.",
      "vocabulary": [
        "N5修了とこれからの目標"
      ],
      "grammar": [
        "n5_g001"
      ],
      "dialogue": [
        {
          "speaker": "A",
          "jp": "N5修了とこれからの目標について相談があるのですが、よろしいでしょうか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "はい、喜んで。どのようなことでしょうか。",
          "en": ""
        },
        {
          "speaker": "A",
          "jp": "この点について詳しく教えていただけますか。",
          "en": ""
        },
        {
          "speaker": "B",
          "jp": "かしこまりました。順を追ってご説明いたします。",
          "en": ""
        }
      ],
      "exercises": [
        {
          "type": "translate",
          "question": "Key concept of N5 Milestone: Review & Goals",
          "answer": "N5修了とこれからの目標"
        },
        {
          "type": "multiple",
          "question": "Which phrase best fits in a conversation about N5 Milestone: Review & Goals?",
          "options": [
            "N5修了とこれからの目標",
            "わかりません",
            "いいえ",
            "失礼します"
          ],
          "answer": "N5修了とこれからの目標"
        },
        {
          "type": "fill",
          "question": "___について勉強しています。（N5 Milestone: Review & Goals）",
          "answer": [
            "N5修了とこれからの目標"
          ]
        }
      ],
      "culturalNote": "In Japan, understanding N5 Milestone: Review & Goals reflects both linguistic proficiency and cultural etiquette.",
      "kanji": []
    }
  ]
};
