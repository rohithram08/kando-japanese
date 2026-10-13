import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw, ThumbsUp, ThumbsDown, Minus, Volume2,
  ChevronLeft, ChevronRight, Shuffle, Filter, Star,
  BookOpen, PenTool, Brain, Award
} from 'lucide-react';

// ====================== COMPLETE FLASHCARD DATA N5-N1 ======================

const FLASHCARD_DECKS = {
  N5: {
    vocabulary: [
      { id: 'n5v1', front: '水', reading: 'みず (mizu)', back: 'Water', example: '水を飲む - to drink water', tags: ['N5', 'noun'] },
      { id: 'n5v2', front: '食べる', reading: 'たべる (taberu)', back: 'To eat', example: 'ご飯を食べる - to eat a meal', tags: ['N5', 'verb'] },
      { id: 'n5v3', front: '飲む', reading: 'のむ (nomu)', back: 'To drink', example: 'お茶を飲む - to drink tea', tags: ['N5', 'verb'] },
      { id: 'n5v4', front: '見る', reading: 'みる (miru)', back: 'To see / watch', example: 'テレビを見る - to watch TV', tags: ['N5', 'verb'] },
      { id: 'n5v5', front: '聞く', reading: 'きく (kiku)', back: 'To listen / ask', example: '音楽を聞く - to listen to music', tags: ['N5', 'verb'] },
      { id: 'n5v6', front: '話す', reading: 'はなす (hanasu)', back: 'To speak / talk', example: '日本語を話す - to speak Japanese', tags: ['N5', 'verb'] },
      { id: 'n5v7', front: '書く', reading: 'かく (kaku)', back: 'To write', example: '手紙を書く - to write a letter', tags: ['N5', 'verb'] },
      { id: 'n5v8', front: '読む', reading: 'よむ (yomu)', back: 'To read', example: '本を読む - to read a book', tags: ['N5', 'verb'] },
      { id: 'n5v9', front: '買う', reading: 'かう (kau)', back: 'To buy', example: '本を買う - to buy a book', tags: ['N5', 'verb'] },
      { id: 'n5v10', front: '行く', reading: 'いく (iku)', back: 'To go', example: '学校に行く - to go to school', tags: ['N5', 'verb'] },
      { id: 'n5v11', front: '来る', reading: 'くる (kuru)', back: 'To come', example: '家に来る - to come home', tags: ['N5', 'verb'] },
      { id: 'n5v12', front: '帰る', reading: 'かえる (kaeru)', back: 'To return / go home', example: '家に帰る - to go back home', tags: ['N5', 'verb'] },
      { id: 'n5v13', front: '大きい', reading: 'おおきい (ookii)', back: 'Big / large', example: '大きい犬 - a big dog', tags: ['N5', 'adjective'] },
      { id: 'n5v14', front: '小さい', reading: 'ちいさい (chiisai)', back: 'Small / little', example: '小さい猫 - a small cat', tags: ['N5', 'adjective'] },
      { id: 'n5v15', front: '新しい', reading: 'あたらしい (atarashii)', back: 'New', example: '新しい車 - a new car', tags: ['N5', 'adjective'] },
      { id: 'n5v16', front: '古い', reading: 'ふるい (furui)', back: 'Old (things)', example: '古い本 - an old book', tags: ['N5', 'adjective'] },
      { id: 'n5v17', front: '高い', reading: 'たかい (takai)', back: 'Expensive / tall', example: '高いビル - a tall building', tags: ['N5', 'adjective'] },
      { id: 'n5v18', front: '安い', reading: 'やすい (yasui)', back: 'Cheap / inexpensive', example: '安いレストラン - a cheap restaurant', tags: ['N5', 'adjective'] },
      { id: 'n5v19', front: '学校', reading: 'がっこう (gakkou)', back: 'School', example: '学校に行く - go to school', tags: ['N5', 'noun'] },
      { id: 'n5v20', front: '先生', reading: 'せんせい (sensei)', back: 'Teacher', example: '先生に聞く - ask the teacher', tags: ['N5', 'noun'] },
    ],
    kanji: [
      { id: 'n5k1', front: '日', reading: 'にち/ひ (nichi/hi)', back: 'Day / Sun', example: '日曜日 (nichiyoubi) - Sunday', tags: ['N5', 'kanji'] },
      { id: 'n5k2', front: '月', reading: 'つき/げつ (tsuki/getsu)', back: 'Moon / Month', example: '月曜日 (getsuyoubi) - Monday', tags: ['N5', 'kanji'] },
      { id: 'n5k3', front: '火', reading: 'ひ/か (hi/ka)', back: 'Fire', example: '火曜日 (kayoubi) - Tuesday', tags: ['N5', 'kanji'] },
      { id: 'n5k4', front: '水', reading: 'みず/すい (mizu/sui)', back: 'Water', example: '水曜日 (suiyoubi) - Wednesday', tags: ['N5', 'kanji'] },
      { id: 'n5k5', front: '木', reading: 'き/もく (ki/moku)', back: 'Tree / Wood', example: '木曜日 (mokuyoubi) - Thursday', tags: ['N5', 'kanji'] },
      { id: 'n5k6', front: '金', reading: 'きん/かね (kin/kane)', back: 'Gold / Money', example: '金曜日 (kinyoubi) - Friday', tags: ['N5', 'kanji'] },
      { id: 'n5k7', front: '土', reading: 'つち/ど (tsuchi/do)', back: 'Earth / Soil', example: '土曜日 (doyoubi) - Saturday', tags: ['N5', 'kanji'] },
      { id: 'n5k8', front: '山', reading: 'やま/さん (yama/san)', back: 'Mountain', example: '富士山 (Fujisan) - Mt. Fuji', tags: ['N5', 'kanji'] },
      { id: 'n5k9', front: '川', reading: 'かわ/せん (kawa/sen)', back: 'River', example: '川を渡る - cross a river', tags: ['N5', 'kanji'] },
      { id: 'n5k10', front: '人', reading: 'ひと/じん (hito/jin)', back: 'Person / People', example: '日本人 (nihonjin) - Japanese person', tags: ['N5', 'kanji'] },
    ],
    grammar: [
      { id: 'n5g1', front: '〜は〜です', reading: '〜wa〜desu', back: 'Topic marker + "to be"', example: '私は学生です。 - I am a student.', tags: ['N5', 'grammar'] },
      { id: 'n5g2', front: '〜を〜する', reading: '〜o〜suru', back: 'Object marker + action', example: '日本語を勉強する - study Japanese', tags: ['N5', 'grammar'] },
      { id: 'n5g3', front: '〜に行く', reading: '〜ni iku', back: 'Go to (place)', example: '東京に行く - go to Tokyo', tags: ['N5', 'grammar'] },
      { id: 'n5g4', front: '〜ている', reading: '〜te iru', back: 'Ongoing action / state', example: '食べている - is eating', tags: ['N5', 'grammar'] },
      { id: 'n5g5', front: '〜たい', reading: '〜tai', back: 'Want to do ~', example: '食べたい - want to eat', tags: ['N5', 'grammar'] },
    ],
  },

  N4: {
    vocabulary: [
      { id: 'n4v1', front: '経験', reading: 'けいけん (keiken)', back: 'Experience', example: '経験がある - have experience', tags: ['N4', 'noun'] },
      { id: 'n4v2', front: '説明', reading: 'せつめい (setsumei)', back: 'Explanation', example: '説明する - to explain', tags: ['N4', 'noun'] },
      { id: 'n4v3', front: '注意', reading: 'ちゅうい (chuui)', back: 'Caution / attention', example: '注意してください - Please be careful', tags: ['N4', 'noun'] },
      { id: 'n4v4', front: '準備', reading: 'じゅんび (junbi)', back: 'Preparation', example: '準備ができた - ready / preparation done', tags: ['N4', 'noun'] },
      { id: 'n4v5', front: '連絡', reading: 'れんらく (renraku)', back: 'Contact / communication', example: '連絡する - to contact', tags: ['N4', 'noun'] },
      { id: 'n4v6', front: '遅れる', reading: 'おくれる (okureru)', back: 'To be late', example: '電車が遅れる - train is late', tags: ['N4', 'verb'] },
      { id: 'n4v7', front: '集める', reading: 'あつめる (atsumeru)', back: 'To collect / gather', example: '切手を集める - collect stamps', tags: ['N4', 'verb'] },
      { id: 'n4v8', front: '決める', reading: 'きめる (kimeru)', back: 'To decide', example: '計画を決める - decide a plan', tags: ['N4', 'verb'] },
      { id: 'n4v9', front: '変える', reading: 'かえる (kaeru)', back: 'To change', example: '計画を変える - change the plan', tags: ['N4', 'verb'] },
      { id: 'n4v10', front: '調べる', reading: 'しらべる (shiraberu)', back: 'To investigate / look up', example: '辞書で調べる - look up in dictionary', tags: ['N4', 'verb'] },
      { id: 'n4v11', front: '困る', reading: 'こまる (komaru)', back: 'To be troubled / in trouble', example: 'お金がなくて困る - troubled because no money', tags: ['N4', 'verb'] },
      { id: 'n4v12', front: '親切', reading: 'しんせつ (shinsetsu)', back: 'Kind / kindness', example: '親切な人 - a kind person', tags: ['N4', 'adjective'] },
      { id: 'n4v13', front: '丁寧', reading: 'ていねい (teinei)', back: 'Polite / careful', example: '丁寧な言葉 - polite language', tags: ['N4', 'adjective'] },
      { id: 'n4v14', front: '急ぐ', reading: 'いそぐ (isogu)', back: 'To hurry', example: '急いでください - Please hurry', tags: ['N4', 'verb'] },
      { id: 'n4v15', front: '続ける', reading: 'つづける (tsuzukeru)', back: 'To continue', example: '勉強を続ける - continue studying', tags: ['N4', 'verb'] },
    ],
    kanji: [
      { id: 'n4k1', front: '運', reading: 'うん/はこ (un/hako)', back: 'Luck / Transport', example: '運動 (undou) - exercise', tags: ['N4', 'kanji'] },
      { id: 'n4k2', front: '転', reading: 'てん/ころ (ten/koro)', back: 'Roll / Turn', example: '運転 (unten) - driving', tags: ['N4', 'kanji'] },
      { id: 'n4k3', front: '練', reading: 'れん (ren)', back: 'Practice / Train', example: '練習 (renshuu) - practice', tags: ['N4', 'kanji'] },
      { id: 'n4k4', front: '習', reading: 'しゅう/なら (shuu/nara)', back: 'Learn / Habit', example: '学習 (gakushuu) - learning', tags: ['N4', 'kanji'] },
      { id: 'n4k5', front: '特', reading: 'とく (toku)', back: 'Special', example: '特別 (tokubetsu) - special', tags: ['N4', 'kanji'] },
    ],
    grammar: [
      { id: 'n4g1', front: '〜てあげる', reading: '〜te ageru', back: 'Do something for someone (downward)', example: '荷物を持ってあげる - carry bags for someone', tags: ['N4', 'grammar'] },
      { id: 'n4g2', front: '〜てもらう', reading: '〜te morau', back: 'Have someone do for you', example: '先生に教えてもらう - have teacher teach me', tags: ['N4', 'grammar'] },
      { id: 'n4g3', front: '〜させる', reading: '〜saseru', back: 'Causative: make/let do', example: '子供を泣かせる - make child cry', tags: ['N4', 'grammar'] },
      { id: 'n4g4', front: '〜られる', reading: '〜rareru', back: 'Passive form', example: '先生に叱られる - be scolded by teacher', tags: ['N4', 'grammar'] },
      { id: 'n4g5', front: '〜ば〜ほど', reading: '〜ba〜hodo', back: 'The more ~ the more ~', example: '勉強すればするほど上手になる', tags: ['N4', 'grammar'] },
    ],
  },

  N3: {
    vocabulary: [
      { id: 'n3v1', front: '影響', reading: 'えいきょう (eikyou)', back: 'Influence / effect', example: '環境への影響 - influence on environment', tags: ['N3', 'noun'] },
      { id: 'n3v2', front: '判断', reading: 'はんだん (handan)', back: 'Judgment / decision', example: '状況を判断する - judge the situation', tags: ['N3', 'noun'] },
      { id: 'n3v3', front: '解決', reading: 'かいけつ (kaiketsu)', back: 'Resolution / solution', example: '問題を解決する - solve a problem', tags: ['N3', 'noun'] },
      { id: 'n3v4', front: '関係', reading: 'かんけい (kankei)', back: 'Relationship / connection', example: '関係がある - have a connection', tags: ['N3', 'noun'] },
      { id: 'n3v5', front: '状況', reading: 'じょうきょう (joukyou)', back: 'Situation / circumstances', example: '状況を説明する - explain the situation', tags: ['N3', 'noun'] },
      { id: 'n3v6', front: '可能', reading: 'かのう (kanou)', back: 'Possible / potential', example: '可能な限り - as much as possible', tags: ['N3', 'adjective'] },
      { id: 'n3v7', front: '必要', reading: 'ひつよう (hitsuyou)', back: 'Necessary / needed', example: '必要な情報 - necessary information', tags: ['N3', 'adjective'] },
      { id: 'n3v8', front: '増える', reading: 'ふえる (fueru)', back: 'To increase', example: '人口が増える - population increases', tags: ['N3', 'verb'] },
      { id: 'n3v9', front: '減る', reading: 'へる (heru)', back: 'To decrease', example: '収入が減る - income decreases', tags: ['N3', 'verb'] },
      { id: 'n3v10', front: '認める', reading: 'みとめる (mitomeru)', back: 'To recognize / admit', example: '才能を認める - recognize talent', tags: ['N3', 'verb'] },
      { id: 'n3v11', front: '比べる', reading: 'くらべる (kuraberu)', back: 'To compare', example: '価格を比べる - compare prices', tags: ['N3', 'verb'] },
      { id: 'n3v12', front: '断る', reading: 'ことわる (kotowaru)', back: 'To refuse / decline', example: '頼みを断る - refuse a request', tags: ['N3', 'verb'] },
      { id: 'n3v13', front: '驚く', reading: 'おどろく (odoroku)', back: 'To be surprised', example: 'ニュースに驚く - surprised by news', tags: ['N3', 'verb'] },
      { id: 'n3v14', front: '幸せ', reading: 'しあわせ (shiawase)', back: 'Happiness / happy', example: '幸せな生活 - happy life', tags: ['N3', 'adjective'] },
      { id: 'n3v15', front: '複雑', reading: 'ふくざつ (fukuzatsu)', back: 'Complex / complicated', example: '複雑な問題 - complicated problem', tags: ['N3', 'adjective'] },
    ],
    kanji: [
      { id: 'n3k1', front: '様', reading: 'よう/さま (you/sama)', back: 'Manner / Honorific', example: '様子 (yousu) - appearance/situation', tags: ['N3', 'kanji'] },
      { id: 'n3k2', front: '場', reading: 'じょう/ば (jou/ba)', back: 'Place / Scene', example: '場所 (basho) - place', tags: ['N3', 'kanji'] },
      { id: 'n3k3', front: '度', reading: 'ど/たび (do/tabi)', back: 'Degree / Time', example: '温度 (ondo) - temperature', tags: ['N3', 'kanji'] },
      { id: 'n3k4', front: '数', reading: 'すう/かず (suu/kazu)', back: 'Number / Count', example: '数学 (suugaku) - mathematics', tags: ['N3', 'kanji'] },
      { id: 'n3k5', front: '者', reading: 'もの/しゃ (mono/sha)', back: 'Person (suffix)', example: '医者 (isha) - doctor', tags: ['N3', 'kanji'] },
    ],
    grammar: [
      { id: 'n3g1', front: '〜によって', reading: '〜ni yotte', back: 'Depending on / by means of', example: '人によって意見が違う - opinions differ by person', tags: ['N3', 'grammar'] },
      { id: 'n3g2', front: '〜に対して', reading: '〜ni taishite', back: 'Toward / against / regarding', example: '彼に対して失礼だ - rude toward him', tags: ['N3', 'grammar'] },
      { id: 'n3g3', front: '〜わけだ', reading: '〜wake da', back: 'That is why / it means that', example: '練習したから上手なわけだ - that is why he is skilled', tags: ['N3', 'grammar'] },
      { id: 'n3g4', front: '〜はずだ', reading: '〜hazu da', back: 'Should be / expected to', example: '彼は来るはずだ - he should come', tags: ['N3', 'grammar'] },
      { id: 'n3g5', front: '〜らしい', reading: '〜rashii', back: 'Seems like / typical of', example: '雨が降るらしい - it seems it will rain', tags: ['N3', 'grammar'] },
      { id: 'n3g6', front: '〜ながら', reading: '〜nagara', back: 'While doing ~', example: '音楽を聴きながら勉強する', tags: ['N3', 'grammar'] },
    ],
  },

  N2: {
    vocabulary: [
      { id: 'n2v1', front: '把握', reading: 'はあく (haaku)', back: 'Grasp / understanding', example: '状況を把握する - grasp the situation', tags: ['N2', 'noun'] },
      { id: 'n2v2', front: '妥協', reading: 'だきょう (dakyou)', back: 'Compromise', example: '妥協点を探す - search for a compromise', tags: ['N2', 'noun'] },
      { id: 'n2v3', front: '曖昧', reading: 'あいまい (aimai)', back: 'Vague / ambiguous', example: '曖昧な返事 - vague reply', tags: ['N2', 'adjective'] },
      { id: 'n2v4', front: '素直', reading: 'すなお (sunao)', back: 'Honest / obedient / straightforward', example: '素直な子供 - obedient child', tags: ['N2', 'adjective'] },
      { id: 'n2v5', front: '煩わしい', reading: 'わずらわしい (wazurawashii)', back: 'Troublesome / annoying', example: '煩わしい手続き - troublesome procedure', tags: ['N2', 'adjective'] },
      { id: 'n2v6', front: '抱える', reading: 'かかえる (kakaeru)', back: 'To hold / carry / have a problem', example: '問題を抱える - have a problem', tags: ['N2', 'verb'] },
      { id: 'n2v7', front: '促す', reading: 'うながす (unagasu)', back: 'To urge / encourage', example: '行動を促す - urge action', tags: ['N2', 'verb'] },
      { id: 'n2v8', front: '妨げる', reading: 'さまたげる (samatageru)', back: 'To hinder / obstruct', example: '成長を妨げる - hinder growth', tags: ['N2', 'verb'] },
      { id: 'n2v9', front: '見直す', reading: 'みなおす (minaosu)', back: 'To review / reconsider', example: '計画を見直す - review the plan', tags: ['N2', 'verb'] },
      { id: 'n2v10', front: '取り組む', reading: 'とりくむ (torikumu)', back: 'To tackle / work on', example: '問題に取り組む - tackle a problem', tags: ['N2', 'verb'] },
      { id: 'n2v11', front: '恐れ', reading: 'おそれ (osore)', back: 'Fear / concern', example: '失敗の恐れがある - there is a risk of failure', tags: ['N2', 'noun'] },
      { id: 'n2v12', front: '配慮', reading: 'はいりょ (hairyo)', back: 'Consideration / thoughtfulness', example: '配慮が足りない - lacking consideration', tags: ['N2', 'noun'] },
      { id: 'n2v13', front: '一致', reading: 'いっち (icchi)', back: 'Agreement / coincidence', example: '意見が一致する - opinions agree', tags: ['N2', 'noun'] },
      { id: 'n2v14', front: '蓄積', reading: 'ちくせき (chikuseki)', back: 'Accumulation', example: '経験を蓄積する - accumulate experience', tags: ['N2', 'noun'] },
      { id: 'n2v15', front: '互い', reading: 'たがい (tagai)', back: 'Mutual / each other', example: 'お互いに助け合う - help each other', tags: ['N2', 'noun'] },
    ],
    kanji: [
      { id: 'n2k1', front: '複', reading: 'ふく (fuku)', back: 'Duplicate / complex', example: '複雑 (fukuzatsu) - complex', tags: ['N2', 'kanji'] },
      { id: 'n2k2', front: '築', reading: 'ちく/きず (chiku/kizu)', back: 'Build / construct', example: '建築 (kenchiku) - architecture', tags: ['N2', 'kanji'] },
      { id: 'n2k3', front: '察', reading: 'さつ (satsu)', back: 'Guess / sense', example: '観察 (kansatsu) - observation', tags: ['N2', 'kanji'] },
      { id: 'n2k4', front: '臨', reading: 'りん (rin)', back: 'Face / meet', example: '臨時 (rinji) - temporary', tags: ['N2', 'kanji'] },
      { id: 'n2k5', front: '敢', reading: 'かん (kan)', back: 'Dare / bold', example: '果敢 (kakan) - bold/daring', tags: ['N2', 'kanji'] },
    ],
    grammar: [
      { id: 'n2g1', front: '〜にもかかわらず', reading: '〜ni mo kakawarazu', back: 'Despite / in spite of', example: '雨にもかかわらず来た - came despite the rain', tags: ['N2', 'grammar'] },
      { id: 'n2g2', front: '〜をはじめ', reading: '〜o hajime', back: 'Starting with / including', example: '東京をはじめ多くの都市 - Tokyo and many other cities', tags: ['N2', 'grammar'] },
      { id: 'n2g3', front: '〜に加えて', reading: '〜ni kuwaete', back: 'In addition to', example: '英語に加えて日本語も話す', tags: ['N2', 'grammar'] },
      { id: 'n2g4', front: '〜かねない', reading: '〜kanenai', back: 'Might possibly (negative)', example: '事故になりかねない - might cause an accident', tags: ['N2', 'grammar'] },
      { id: 'n2g5', front: '〜をめぐって', reading: '〜o megutte', back: 'Surrounding / concerning', example: '予算をめぐって議論する - debate surrounding the budget', tags: ['N2', 'grammar'] },
      { id: 'n2g6', front: '〜に際して', reading: '〜ni saishite', back: 'At the time of / on the occasion of', example: '入学に際して - at the time of enrollment', tags: ['N2', 'grammar'] },
    ],
  },

  N1: {
    vocabulary: [
      { id: 'n1v1', front: '憂慮', reading: 'ゆうりょ (yuuryo)', back: 'Concern / apprehension', example: '事態を憂慮する - be concerned about the situation', tags: ['N1', 'noun'] },
      { id: 'n1v2', front: '逸脱', reading: 'いつだつ (itsudatsu)', back: 'Deviation / departure', example: '規範から逸脱する - deviate from norms', tags: ['N1', 'noun'] },
      { id: 'n1v3', front: '醸成', reading: 'じょうせい (jousei)', back: 'Foster / cultivate (atmosphere)', example: '信頼関係を醸成する - foster a relationship of trust', tags: ['N1', 'noun'] },
      { id: 'n1v4', front: '忖度', reading: 'そんたく (sontaku)', back: 'Reading the air / inferring intent', example: '上司の意向を忖度する - infer supervisor\'s intention', tags: ['N1', 'noun'] },
      { id: 'n1v5', front: '払拭', reading: 'ふっしょく (fusshoku)', back: 'Sweep away / dispel', example: '不安を払拭する - dispel anxiety', tags: ['N1', 'noun'] },
      { id: 'n1v6', front: '顕著', reading: 'けんちょ (kencho)', back: 'Remarkable / conspicuous', example: '顕著な差がある - there is a remarkable difference', tags: ['N1', 'adjective'] },
      { id: 'n1v7', front: '冷淡', reading: 'れいたん (reitan)', back: 'Cold / indifferent', example: '冷淡な態度 - cold attitude', tags: ['N1', 'adjective'] },
      { id: 'n1v8', front: '卓越', reading: 'たくえつ (takuetsu)', back: 'Eminence / excellence', example: '卓越した能力 - excellent ability', tags: ['N1', 'adjective'] },
      { id: 'n1v9', front: '看過', reading: 'かんか (kanka)', back: 'Overlook / ignore', example: '問題を看過できない - cannot overlook the problem', tags: ['N1', 'verb'] },
      { id: 'n1v10', front: '凌ぐ', reading: 'しのぐ (shinogu)', back: 'Surpass / endure', example: '困難を凌ぐ - endure hardship', tags: ['N1', 'verb'] },
      { id: 'n1v11', front: '齟齬', reading: 'そご (sogo)', back: 'Discord / discrepancy', example: '認識に齟齬がある - there is a discrepancy in understanding', tags: ['N1', 'noun'] },
      { id: 'n1v12', front: '俯瞰', reading: 'ふかん (fukan)', back: 'Bird\'s eye view / overview', example: '俯瞰的に見る - view from a bird\'s eye', tags: ['N1', 'noun'] },
      { id: 'n1v13', front: '矛盾', reading: 'むじゅん (mujun)', back: 'Contradiction', example: '矛盾した発言 - contradictory statement', tags: ['N1', 'noun'] },
      { id: 'n1v14', front: '精緻', reading: 'せいち (seichi)', back: 'Elaborate / precise', example: '精緻な計画 - elaborate plan', tags: ['N1', 'adjective'] },
      { id: 'n1v15', front: '乖離', reading: 'かいり (kairi)', back: 'Divergence / gap', example: '理想と現実の乖離 - gap between ideal and reality', tags: ['N1', 'noun'] },
    ],
    kanji: [
      { id: 'n1k1', front: '憂', reading: 'ゆう/うれ (yuu/ure)', back: 'Melancholy / grief', example: '憂慮 (yuuryo) - concern', tags: ['N1', 'kanji'] },
      { id: 'n1k2', front: '覇', reading: 'は (ha)', back: 'Supremacy / domination', example: '覇権 (haken) - hegemony', tags: ['N1', 'kanji'] },
      { id: 'n1k3', front: '謙', reading: 'けん (ken)', back: 'Humble / modest', example: '謙虚 (kenkyo) - humble', tags: ['N1', 'kanji'] },
      { id: 'n1k4', front: '瞭', reading: 'りょう (ryou)', back: 'Clear / obvious', example: '明瞭 (meiryou) - clear', tags: ['N1', 'kanji'] },
      { id: 'n1k5', front: '鑑', reading: 'かん/かがみ (kan/kagami)', back: 'Mirror / model', example: '鑑賞 (kanshō) - appreciation', tags: ['N1', 'kanji'] },
    ],
    grammar: [
      { id: 'n1g1', front: '〜いかんによらず', reading: '〜ikan ni yorazu', back: 'Regardless of ~', example: '結果のいかんによらず努力する - work hard regardless of results', tags: ['N1', 'grammar'] },
      { id: 'n1g2', front: '〜をもって', reading: '〜o motte', back: 'With / by means of / as of', example: '本日をもって終了します - will conclude as of today', tags: ['N1', 'grammar'] },
      { id: 'n1g3', front: '〜ならでは', reading: '〜naradewa', back: 'Unique to / only possible with', example: '日本ならではの文化 - culture unique to Japan', tags: ['N1', 'grammar'] },
      { id: 'n1g4', front: '〜に足る', reading: '〜ni taru', back: 'Worthy of / sufficient for', example: '信頼するに足る人物 - a person worthy of trust', tags: ['N1', 'grammar'] },
      { id: 'n1g5', front: '〜とあって', reading: '〜to atte', back: 'Because of the special reason that ~', example: '祝日とあって人が多い - crowded because it\'s a holiday', tags: ['N1', 'grammar'] },
      { id: 'n1g6', front: '〜を皮切りに', reading: '〜o kawakiri ni', back: 'Starting with ~ (as a trigger)', example: '東京を皮切りに全国ツアー - nationwide tour starting from Tokyo', tags: ['N1', 'grammar'] },
    ],
  },
};

// ====================== SRS ALGORITHM ======================
const SRS_RATINGS = {
  EASY: { label: 'Easy', color: 'bg-green-600', icon: ThumbsUp, multiplier: 2.5 },
  GOOD: { label: 'Good', color: 'bg-blue-600', icon: Minus, multiplier: 1.5 },
  HARD: { label: 'Hard', color: 'bg-yellow-600', icon: ThumbsDown, multiplier: 0.8 },
  AGAIN: { label: 'Again', color: 'bg-red-600', icon: RotateCcw, multiplier: 0 },
};

const initSRSData = () => {
  try {
    return JSON.parse(localStorage.getItem('srs_data')) || {};
  } catch {
    return {};
  }
};

const saveSRSData = (data) => {
  localStorage.setItem('srs_data', JSON.stringify(data));
};

// ====================== MAIN COMPONENT ======================

const FlashCard = () => {
  const [selectedLevel, setSelectedLevel] = useState('N5');
  const [selectedType, setSelectedType] = useState('vocabulary');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState([]);
  const [srsData, setSrsData] = useState(initSRSData);
  const [sessionStats, setSessionStats] = useState({ easy: 0, good: 0, hard: 0, again: 0 });
  const [showStats, setShowStats] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const types = ['vocabulary', 'kanji', 'grammar'];

  // Load cards for session
  useEffect(() => {
    const deck = FLASHCARD_DECKS[selectedLevel]?.[selectedType] || [];
    const cards = isShuffled ? [...deck].sort(() => Math.random() - 0.5) : deck;
    setSessionCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setSessionComplete(false);
    setSessionStats({ easy: 0, good: 0, hard: 0, again: 0 });
  }, [selectedLevel, selectedType, isShuffled]);

  const currentCard = sessionCards[currentIndex];
  const progress = sessionCards.length > 0 ? ((currentIndex) / sessionCards.length) * 100 : 0;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const handleRating = useCallback((rating) => {
    if (!currentCard) return;

    // Update SRS data
    const newSrsData = { ...srsData };
    const cardData = newSrsData[currentCard.id] || { interval: 1, ease: 2.5, reviews: 0 };
    const multiplier = SRS_RATINGS[rating].multiplier;

    if (multiplier === 0) {
      cardData.interval = 1;
    } else {
      cardData.interval = Math.round(cardData.interval * multiplier);
      cardData.ease = Math.max(1.3, cardData.ease + (rating === 'EASY' ? 0.15 : rating === 'HARD' ? -0.15 : 0));
    }
    cardData.reviews += 1;
    cardData.lastReview = new Date().toISOString();
    cardData.nextReview = new Date(Date.now() + cardData.interval * 86400000).toISOString();
    newSrsData[currentCard.id] = cardData;

    setSrsData(newSrsData);
    saveSRSData(newSrsData);

    // Update stats
    setSessionStats(prev => ({
      ...prev,
      [rating.toLowerCase()]: prev[rating.toLowerCase()] + 1,
    }));

    // Advance
    if (currentIndex + 1 >= sessionCards.length) {
      setSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  }, [currentCard, currentIndex, sessionCards.length, srsData]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    utt.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) utt.voice = jaVoice;
    window.speechSynthesis.speak(utt);
  };

  const getCardSRSInfo = (cardId) => {
    const data = srsData[cardId];
    if (!data) return null;
    return data;
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setSessionComplete(false);
    setSessionStats({ easy: 0, good: 0, hard: 0, again: 0 });
    if (isShuffled) {
      setSessionCards(prev => [...prev].sort(() => Math.random() - 0.5));
    }
  };

  const totalReviewed = Object.values(sessionStats).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-10">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">🃏 Flashcards</h1>
            <p className="text-gray-400 text-sm mt-1">Spaced Repetition System (N5 → N1)</p>
          </div>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors"
          >
            <Award className="w-4 h-4 text-yellow-400" />
            Session Stats
          </button>
        </div>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 bg-gray-900 rounded-2xl p-5 border border-gray-800"
            >
              <h3 className="font-semibold text-gray-200 mb-4">Session Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(SRS_RATINGS).map(([key, val]) => (
                  <div key={key} className={`${val.color}/20 border border-${val.color.split('-')[1]}-500/30 rounded-xl p-3 text-center`}>
                    <div className="text-2xl font-bold text-white">
                      {sessionStats[key.toLowerCase()]}
                    </div>
                    <div className="text-sm text-gray-400">{val.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-xl font-bold">{totalReviewed}</div>
                  <div className="text-gray-400">Reviewed</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-xl font-bold">{sessionCards.length - totalReviewed}</div>
                  <div className="text-gray-400">Remaining</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-3">
                  <div className="text-xl font-bold">
                    {totalReviewed > 0
                      ? Math.round(((sessionStats.easy + sessionStats.good) / totalReviewed) * 100)
                      : 0}%
                  </div>
                  <div className="text-gray-400">Accuracy</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Level Selector */}
          <div className="flex gap-2">
            {levels.map(lvl => (
              <motion.button
                key={lvl}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedLevel === lvl
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {lvl}
              </motion.button>
            ))}
          </div>

          {/* Type Selector */}
          <div className="flex gap-2">
            {types.map(type => {
              const icons = { vocabulary: BookOpen, kanji: PenTool, grammar: Brain };
              const Icon = icons[type];
              return (
                <motion.button
                  key={type}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type}
                </motion.button>
              );
            })}
          </div>

          {/* Shuffle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsShuffled(!isShuffled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors ${
              isShuffled ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{currentIndex} / {sessionCards.length} cards</span>
            <span>{selectedLevel} {selectedType}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Card Area */}
        {sessionComplete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-900 rounded-3xl border border-gray-800"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-gray-400 mb-6">
              You reviewed all {sessionCards.length} {selectedLevel} {selectedType} cards
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{sessionStats.easy}</div>
                <div className="text-sm text-gray-400">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{sessionStats.good}</div>
                <div className="text-sm text-gray-400">Good</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{sessionStats.hard}</div>
                <div className="text-sm text-gray-400">Hard</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{sessionStats.again}</div>
                <div className="text-sm text-gray-400">Again</div>
              </div>
            </div>
            <button
              onClick={resetSession}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
            >
              Study Again
            </button>
          </motion.div>
        ) : currentCard ? (
          <div className="space-y-4">
            {/* Flashcard */}
            <div
              className="relative w-full cursor-pointer"
              style={{ perspective: 1000 }}
              onClick={!showAnswer ? handleFlip : undefined}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full"
              >
                {/* Front */}
                <div
                  className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 p-10 min-h-64 flex flex-col items-center justify-center text-center shadow-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    {currentCard.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-700 text-xs text-gray-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    className="text-7xl font-bold text-white mb-4"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {currentCard.front}
                  </motion.div>

                  {currentCard.reading && (
                    <div className="text-lg text-blue-300 mb-2">{currentCard.reading}</div>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); speak(currentCard.front); }}
                    className="mt-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <Volume2 className="w-5 h-5 text-blue-400" />
                  </button>

                  {!showAnswer && (
                    <p className="absolute bottom-5 text-gray-500 text-sm">Click to reveal</p>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 w-full bg-gradient-to-br from-blue-950 to-gray-900 rounded-3xl border border-blue-700/50 p-8 min-h-64 flex flex-col items-center justify-center text-center shadow-2xl"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="text-4xl font-bold text-white mb-3">{currentCard.back}</div>
                  <div className="text-blue-300 text-lg mb-2">{currentCard.reading}</div>
                  {currentCard.example && (
                    <div className="mt-4 p-4 bg-gray-800/60 rounded-xl max-w-md">
                      <p className="text-sm text-gray-300">{currentCard.example}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation & Rating */}
            {showAnswer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {Object.entries(SRS_RATINGS).map(([key, val]) => {
                  const Icon = val.icon;
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => handleRating(key)}
                      className={`${val.color} hover:opacity-90 text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg`}
                    >
                      <Icon className="w-4 h-4" />
                      {val.label}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setIsFlipped(false); setShowAnswer(false); }}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFlip}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 rounded-xl font-medium text-white shadow-lg"
                >
                  Reveal Answer
                </motion.button>
                <button
                  onClick={() => { setCurrentIndex(Math.min(sessionCards.length - 1, currentIndex + 1)); setIsFlipped(false); setShowAnswer(false); }}
                  disabled={currentIndex === sessionCards.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm disabled:opacity-40"
                >
                  Skip <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* SRS Info */}
            {getCardSRSInfo(currentCard.id) && (
              <div className="text-center text-xs text-gray-600">
                Reviews: {getCardSRSInfo(currentCard.id).reviews} |
                Interval: {getCardSRSInfo(currentCard.id).interval} days |
                Next: {new Date(getCardSRSInfo(currentCard.id).nextReview).toLocaleDateString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">No cards available</div>
        )}

        {/* All Decks Overview */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">📚 All Decks Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {levels.map(lvl => (
              <div key={lvl} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <div className="font-bold text-red-400 text-lg mb-2">{lvl}</div>
                {types.map(t => (
                  <div key={t} className="flex justify-between text-xs text-gray-400 mb-1">
                    <span className="capitalize">{t}</span>
                    <span className="text-white">
                      {FLASHCARD_DECKS[lvl]?.[t]?.length || 0}
                    </span>
                  </div>
                ))}
                <div className="mt-2 border-t border-gray-800 pt-2 flex justify-between text-xs">
                  <span className="text-gray-500">Total</span>
                  <span className="text-yellow-400 font-medium">
                    {types.reduce((acc, t) => acc + (FLASHCARD_DECKS[lvl]?.[t]?.length || 0), 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;