// src/data/placementTests.ts
// ─────────────────────────────────────────────────────────────────────────────
// JLPT Level Qualification Tests (N4, N3, N2, N1)
// Rigorous placement questions testing Vocabulary, Kanji, and Grammar to verify
// whether a learner qualifies to start at or skip ahead to higher JLPT levels.
// ─────────────────────────────────────────────────────────────────────────────

export interface PlacementQuestion {
  id: string;
  category: 'kanji' | 'vocabulary' | 'grammar';
  question: string;
  questionRomaji: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface LevelPlacementTest {
  level: 'N4' | 'N3' | 'N2' | 'N1';
  title: string;
  description: string;
  passingScore: number; // e.g. 4 out of 5 (80%)
  questions: PlacementQuestion[];
}

export const PLACEMENT_TESTS: Record<string, LevelPlacementTest> = {
  N4: {
    level: 'N4',
    title: 'JLPT N4 Qualification Test',
    description: 'Demonstrate mastery of basic daily Japanese, elementary kanji, and polite conjugations.',
    passingScore: 4,
    questions: [
      {
        id: 'n4-q1',
        category: 'grammar',
        question: '雨が＿＿＿、出かけません。',
        questionRomaji: 'Ame ga ___, dekakemasen.',
        options: ['降れば (fureba)', '降ったら (futtara)', '降ると (furu to)', '降るなら (furu nara)'],
        correctAnswer: 1,
        explanation: '「降ったら (futtara)」is the standard conditional form used when an action depends on an occurrence.',
      },
      {
        id: 'n4-q2',
        category: 'kanji',
        question: '「新聞」の正しい読み方はどれですか。',
        questionRomaji: '"新聞" no tadashii yomikata wa dore desu ka.',
        options: ['しんぶん (shinbun)', 'あたらぶん (atarabun)', 'あたらきく (atarakiku)', 'しんきく (shinkiku)'],
        correctAnswer: 0,
        explanation: '「新聞」is read as「しんぶん (shinbun)」, meaning newspaper.',
      },
      {
        id: 'n4-q3',
        category: 'vocabulary',
        question: '会議の時間を＿＿＿ください。',
        questionRomaji: 'Kaigi no jikan o ___ kudasai.',
        options: ['教えて (oshiete)', '習って (naratte)', '忘れて (wasurete)', '返して (kaeshite)'],
        correctAnswer: 0,
        explanation: '「教えてください (oshiete kudasai)」means "please tell / let me know".',
      },
      {
        id: 'n4-q4',
        category: 'grammar',
        question: 'この本はもう＿＿＿しまいました。',
        questionRomaji: 'Kono hon wa mou ___ shimaimashita.',
        options: ['読んで (yonde)', '読み (yomi)', '読んだ (yonda)', '読む (yomu)'],
        correctAnswer: 0,
        explanation: '〜てしまう expresses completion of an action. The て-form of 読む is 読んで.',
      },
      {
        id: 'n4-q5',
        category: 'vocabulary',
        question: '「遠慮する」の意味に一番近いものはどれですか。',
        questionRomaji: '"Enryo suru" no imi ni ichiban chikai mono wa dore desu ka.',
        options: ['ひかえる・断る (refrain / decline politely)', '怒る (get angry)', '大声で話す (speak loudly)', '急いで走る (run in a hurry)'],
        correctAnswer: 0,
        explanation: '「遠慮する (enryo suru)」means to hold back, refrain, or hesitate out of politeness.',
      },
    ],
  },
  N3: {
    level: 'N3',
    title: 'JLPT N3 Qualification Test',
    description: 'Bridge the gap from elementary to intermediate Japanese with everyday conversational nuances.',
    passingScore: 4,
    questions: [
      {
        id: 'n3-q1',
        category: 'grammar',
        question: '明日は試験がある＿＿＿、早く寝ます。',
        questionRomaji: 'Ashita wa shiken ga aru ___, hayaku nemasu.',
        options: ['ので (node)', 'のに (noni)', 'からには (karanihawa)', 'につれて (nitsurete)'],
        correctAnswer: 0,
        explanation: '「ので (node)」expresses an objective cause or reason.',
      },
      {
        id: 'n3-q2',
        category: 'kanji',
        question: '「複雑」の読み方はどれですか。',
        questionRomaji: '"複雑" no yomikata wa dore desu ka.',
        options: ['ふくざつ (fukuzatsu)', 'ふくさい (fukusai)', 'ふくさつ (fukusatsu)', 'ふくそう (fukusou)'],
        correctAnswer: 0,
        explanation: '「複雑」is read as「ふくざつ (fukuzatsu)」, meaning complex or complicated.',
      },
      {
        id: 'n3-q3',
        category: 'grammar',
        question: '日本に来たばかりの時は、日本語が＿＿＿話せませんでした。',
        questionRomaji: 'Nihon ni kita bakari no toki wa, nihongo ga ___ hanasemasen deshita.',
        options: ['全然 (zenzen)', 'とても (totemo)', '大変 (taihen)', '必ず (kanarazu)'],
        correctAnswer: 0,
        explanation: '「全然 (zenzen)」paired with negative verbs means "not at all".',
      },
      {
        id: 'n3-q4',
        category: 'vocabulary',
        question: '約束の時間を＿＿＿してしまった。',
        questionRomaji: 'Yakusoku no jikan o ___ shite shimatta.',
        options: ['勘違い (kanchigai - misunderstood)', '注意 (chuui - caution)', '遠慮 (enryo - restraint)', '用意 (youi - preparation)'],
        correctAnswer: 0,
        explanation: '「勘違いする (kanchigai suru)」means to misunderstand or mistakenly assume.',
      },
      {
        id: 'n3-q5',
        category: 'grammar',
        question: '練習すればする＿＿＿、上手になります。',
        questionRomaji: 'Renshuu sureba suru ___, jouzu ni narimasu.',
        options: ['ほど (hodo)', 'ばかり (bakari)', 'とおり (toori)', 'わけ (wake)'],
        correctAnswer: 0,
        explanation: '「〜ば〜ほど (~ba ~hodo)」expresses "the more... the more...".',
      },
    ],
  },
  N2: {
    level: 'N2',
    title: 'JLPT N2 Qualification Test',
    description: 'Verify upper-intermediate ability in natural media, business Japanese, and complex sentence structures.',
    passingScore: 4,
    questions: [
      {
        id: 'n2-q1',
        category: 'grammar',
        question: '事態を解決する＿＿＿、全力を尽くします。',
        questionRomaji: 'Jitai o kaiketsu suru ___, zenryoku o tsukushimasu.',
        options: ['べく (beku)', 'にしては (nishite wa)', '反面 (hanmen)', 'ものなら (mononara)'],
        correctAnswer: 0,
        explanation: '「〜べく (~beku)」means "in order to / with the intention of" doing something in formal Japanese.',
      },
      {
        id: 'n2-q2',
        category: 'kanji',
        question: '「謙虚」の読み方はどれですか。',
        questionRomaji: '"謙虚" no yomikata wa dore desu ka.',
        options: ['けんきょ (kenkyo)', 'けんきゅう (kenkyuu)', 'けんちょ (kencho)', 'けんしょ (kensho)'],
        correctAnswer: 0,
        explanation: '「謙虚 (けんきょ)」means humble or modest.',
      },
      {
        id: 'n2-q3',
        category: 'grammar',
        question: '彼の実力から＿＿＿、合格するのは当然だ。',
        questionRomaji: 'Kare no jitsuryoku kara ___, goukaku suru no wa touzen da.',
        options: ['言えば (ieba)', 'して (shite)', 'したら (shitara)', '見れば (mireba)'],
        correctAnswer: 1,
        explanation: '「〜からして (~karashite)」means "judging from / based on".',
      },
      {
        id: 'n2-q4',
        category: 'vocabulary',
        question: '計画の進行が＿＿＿している。',
        questionRomaji: 'Keikaku no shinkou ga ___ shite iru.',
        options: ['難航 (nankou - running into difficulties)', '航海 (koukai - voyaging)', '通過 (tsuuka - passing through)', '脱出 (dasshutsu - escaping)'],
        correctAnswer: 0,
        explanation: '「難航する (nankou suru)」means to encounter tough difficulties or obstacles.',
      },
      {
        id: 'n2-q5',
        category: 'grammar',
        question: 'いくら後悔した＿＿＿、過去は変えられない。',
        questionRomaji: 'Ikura koukai shita ___, kako wa kaerarenai.',
        options: ['ところで (tokoro de)', 'ものの (mono no)', 'わりに (wari ni)', 'だけに (dake ni)'],
        correctAnswer: 0,
        explanation: '「〜たところで (~ta tokoro de)」means "even if / no matter how much you do... it will be in vain".',
      },
    ],
  },
  N1: {
    level: 'N1',
    title: 'JLPT N1 Qualification Test',
    description: 'Verify advanced fluency in abstract texts, high-register editorial expressions, and proverbs.',
    passingScore: 4,
    questions: [
      {
        id: 'n1-q1',
        category: 'grammar',
        question: 'その発言は、国民の期待を＿＿＿ものだ。',
        questionRomaji: 'Sono hatsugen wa, kokumin no kitai o ___ mono da.',
        options: ['裏切る (uragiru)', '損なう (sokonau)', '踏みにじる (fuminijiru)', '覆す (kutsugaesu)'],
        correctAnswer: 2,
        explanation: '「踏みにじる (fuminijiru)」idiomatically expresses trampling on expectations or trust.',
      },
      {
        id: 'n1-q2',
        category: 'kanji',
        question: '「脆弱」の読み方はどれですか。',
        questionRomaji: '"脆弱" no yomikata wa dore desu ka.',
        options: ['ぜいじゃく (zeijaku)', 'きじゃく (kijaku)', 'そうじゃく (soujaku)', 'せいきゃく (seikyaku)'],
        correctAnswer: 0,
        explanation: '「脆弱 (ぜいじゃく)」means vulnerable or fragile.',
      },
      {
        id: 'n1-q3',
        category: 'grammar',
        question: '彼女の尽力＿＿＿、このプロジェクトの成功はなかった。',
        questionRomaji: 'Kanojo no jinryoku ___, kono purojekuto no seikou wa nakatta.',
        options: ['なくして (nakushite)', 'ならでは (naredeha)', 'を皮切りに (o kawakiri ni)', 'を機に (o ki ni)'],
        correctAnswer: 0,
        explanation: '「〜なくして (~nakushite)」means "without ~, ... would never have happened".',
      },
      {
        id: 'n1-q4',
        category: 'vocabulary',
        question: '新制度の導入には慎重を＿＿＿必要がある。',
        questionRomaji: 'Shin seido no dounyuu ni wa shinchou o ___ hitsuyou ga aru.',
        options: ['期する (kisuru)', '重んじる (omonjiru)', '制する (seisuru)', '託す (takusu)'],
        correctAnswer: 0,
        explanation: '「慎重を期する (shinchou o kisuru)」is the idiomatic expression for ensuring utmost caution.',
      },
      {
        id: 'n1-q5',
        category: 'grammar',
        question: 'プロの選手＿＿＿、日々の訓練を欠かさない。',
        questionRomaji: 'Puro no senshu ___, hibi no kunren o kakasanai.',
        options: ['たるもの (taru mono)', 'ごとき (gotoki)', 'ならではの (naredeha no)', 'まじき (majiki)'],
        correctAnswer: 0,
        explanation: '「〜たるもの (~taru mono)」means "in the capacity of / as befits someone who is a ~".',
      },
    ],
  },
};
