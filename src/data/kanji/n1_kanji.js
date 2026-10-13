const n1Kanji = [
  {
    id: 'n1k001', kanji: '憂', readings: { on: ['ユウ'], kun: ['うれ', 'うい'] },
    meaning: 'melancholy / grief / sorrow / gloom',
    examples: [
      { word: '憂慮', reading: 'ゆうりょ', meaning: 'concern / apprehension' },
      { word: '憂鬱', reading: 'ゆううつ', meaning: 'depression / melancholy' },
      { word: '憂い', reading: 'うれい', meaning: 'sorrow / grief / anxiety' },
    ],
    strokeCount: 15, level: 'N1', radical: '心',
  },
  {
    id: 'n1k002', kanji: '覇', readings: { on: ['ハ'], kun: [] },
    meaning: 'supremacy / domination / hegemony',
    examples: [
      { word: '覇権', reading: 'はけん', meaning: 'hegemony / supremacy' },
      { word: '制覇', reading: 'せいは', meaning: 'conquest / domination' },
      { word: '覇者', reading: 'はしゃ', meaning: 'champion / conqueror' },
    ],
    strokeCount: 19, level: 'N1', radical: '西',
  },
  {
    id: 'n1k003', kanji: '謙', readings: { on: ['ケン'], kun: [] },
    meaning: 'humble / modest / condescend',
    examples: [
      { word: '謙虚', reading: 'けんきょ', meaning: 'humble / modest' },
      { word: '謙遜', reading: 'けんそん', meaning: 'humility / modesty' },
      { word: '謙称', reading: 'けんしょう', meaning: 'humble form of address' },
    ],
    strokeCount: 17, level: 'N1', radical: '言',
  },
  {
    id: 'n1k004', kanji: '瞭', readings: { on: ['リョウ'], kun: [] },
    meaning: 'clear / obvious / plain',
    examples: [
      { word: '明瞭', reading: 'めいりょう', meaning: 'clear / distinct' },
      { word: '了解', reading: 'りょうかい', meaning: 'understood / roger' },
      { word: '瞭然', reading: 'りょうぜん', meaning: 'clear / obvious' },
    ],
    strokeCount: 17, level: 'N1', radical: '目',
  },
  {
    id: 'n1k005', kanji: '鑑', readings: { on: ['カン'], kun: ['かがみ', 'かんが'] },
    meaning: 'mirror / model / pattern / reflect',
    examples: [
      { word: '鑑賞', reading: 'かんしょう', meaning: 'appreciation / viewing' },
      { word: '鑑定', reading: 'かんてい', meaning: 'expert opinion / appraisal' },
      { word: '年鑑', reading: 'ねんかん', meaning: 'yearbook / annual' },
    ],
    strokeCount: 23, level: 'N1', radical: '金',
  },
  {
    id: 'n1k006', kanji: '騰', readings: { on: ['トウ'], kun: [] },
    meaning: 'soar / jump / leap / rising (prices)',
    examples: [
      { word: '高騰', reading: 'こうとう', meaning: 'sharp rise / soaring prices' },
      { word: '騰貴', reading: 'とうき', meaning: 'rise in prices' },
      { word: '沸騰', reading: 'ふっとう', meaning: 'boiling / excitement' },
    ],
    strokeCount: 20, level: 'N1', radical: '馬',
  },
  {
    id: 'n1k007', kanji: '懸', readings: { on: ['ケン', 'ケ'], kun: ['か', 'かか'] },
    meaning: 'hang / suspend / depend on / risk',
    examples: [
      { word: '懸念', reading: 'けねん', meaning: 'concern / worry / fear' },
      { word: '懸命', reading: 'けんめい', meaning: 'with all one\'s might' },
      { word: '懸賞', reading: 'けんしょう', meaning: 'prize / reward' },
    ],
    strokeCount: 20, level: 'N1', radical: '心',
  },
  {
    id: 'n1k008', kanji: '顕', readings: { on: ['ケン'], kun: ['あらわ'] },
    meaning: 'appear / become visible / remarkable',
    examples: [
      { word: '顕著', reading: 'けんちょ', meaning: 'remarkable / striking' },
      { word: '顕在', reading: 'けんざい', meaning: 'actual / manifest' },
      { word: '顕微鏡', reading: 'けんびきょう', meaning: 'microscope' },
    ],
    strokeCount: 18, level: 'N1', radical: '頁',
  },
  {
    id: 'n1k009', kanji: '緻', readings: { on: ['チ'], kun: [] },
    meaning: 'fine / delicate / dense / meticulous',
    examples: [
      { word: '精緻', reading: 'せいち', meaning: 'elaborate / minute / precise' },
      { word: '緻密', reading: 'ちみつ', meaning: 'minute / fine / careful' },
    ],
    strokeCount: 16, level: 'N1', radical: '糸',
  },
  {
    id: 'n1k010', kanji: '傲', readings: { on: ['ゴウ'], kun: ['おご'] },
    meaning: 'proud / haughty / arrogant',
    examples: [
      { word: '傲慢', reading: 'ごうまん', meaning: 'arrogance / haughtiness' },
      { word: '傲岸', reading: 'ごうがん', meaning: 'arrogant / insolent' },
    ],
    strokeCount: 13, level: 'N1', radical: '人',
  },
  {
    id: 'n1k011', kanji: '漠', readings: { on: ['バク'], kun: [] },
    meaning: 'vague / obscure / desert / wide',
    examples: [
      { word: '漠然', reading: 'ばくぜん', meaning: 'vague / obscure / hazy' },
      { word: '砂漠', reading: 'さばく', meaning: 'desert' },
      { word: '漠大', reading: 'ばくだい', meaning: 'vast / boundless' },
    ],
    strokeCount: 13, level: 'N1', radical: '水',
  },
  {
    id: 'n1k012', kanji: '朽', readings: { on: ['キュウ'], kun: ['く'] },
    meaning: 'decay / rot / die / decompose',
    examples: [
      { word: '不朽', reading: 'ふきゅう', meaning: 'immortality / everlasting' },
      { word: '老朽', reading: 'ろうきゅう', meaning: 'aged / worn out' },
      { word: '朽ちる', reading: 'くちる', meaning: 'to decay / rot' },
    ],
    strokeCount: 6, level: 'N1', radical: '木',
  },
  {
    id: 'n1k013', kanji: '矯', readings: { on: ['キョウ'], kun: ['た'] },
    meaning: 'rectify / correct / straighten',
    examples: [
      { word: '矯正', reading: 'きょうせい', meaning: 'correction / reform / orthodontics' },
      { word: '矯める', reading: 'ためる', meaning: 'to correct / straighten' },
    ],
    strokeCount: 17, level: 'N1', radical: '矢',
  },
  {
    id: 'n1k014', kanji: '蔑', readings: { on: ['ベツ'], kun: ['さげす', 'ないがし'] },
    meaning: 'despise / look down upon / scorn',
    examples: [
      { word: '蔑視', reading: 'べっし', meaning: 'contempt / scorn' },
      { word: '軽蔑', reading: 'けいべつ', meaning: 'contempt / disdain' },
      { word: '蔑む', reading: 'さげすむ', meaning: 'to despise / look down on' },
    ],
    strokeCount: 14, level: 'N1', radical: '艸',
  },
  {
    id: 'n1k015', kanji: '欺', readings: { on: ['ギ'], kun: ['あざむ'] },
    meaning: 'deceive / cheat / delude',
    examples: [
      { word: '詐欺', reading: 'さぎ', meaning: 'fraud / swindle / deception' },
      { word: '欺く', reading: 'あざむく', meaning: 'to deceive / trick' },
      { word: '欺瞞', reading: 'ぎまん', meaning: 'deception / fraud' },
    ],
    strokeCount: 12, level: 'N1', radical: '欠',
  },
  {
    id: 'n1k016', kanji: '慄', readings: { on: ['リツ'], kun: ['おのの', 'ふる'] },
    meaning: 'shudder / tremble with fear',
    examples: [
      { word: '戦慄', reading: 'せんりつ', meaning: 'shudder / thrill / horror' },
      { word: '慄く', reading: 'おののく', meaning: 'to shudder / tremble' },
    ],
    strokeCount: 13, level: 'N1', radical: '心',
  },
  {
    id: 'n1k017', kanji: '葛', readings: { on: ['カツ', 'カッ'], kun: ['くず'] },
    meaning: 'arrowroot / kudzu vine / conflict',
    examples: [
      { word: '葛藤', reading: 'かっとう', meaning: 'conflict / complication / troubles' },
      { word: '葛', reading: 'くず', meaning: 'kudzu / arrowroot' },
    ],
    strokeCount: 12, level: 'N1', radical: '艸',
  },
  {
    id: 'n1k018', kanji: '贖', readings: { on: ['ショク'], kun: ['あがな'] },
    meaning: 'atone / redeem / buy back',
    examples: [
      { word: '贖罪', reading: 'しょくざい', meaning: 'atonement / expiation / redemption' },
      { word: '贖う', reading: 'あがなう', meaning: 'to atone / redeem' },
    ],
    strokeCount: 22, level: 'N1', radical: '貝',
  },
  {
    id: 'n1k019', kanji: '憤', readings: { on: ['フン'], kun: ['いきどお'] },
    meaning: 'indignation / anger / resentment',
    examples: [
      { word: '憤慨', reading: 'ふんがい', meaning: 'indignation / resentment' },
      { word: '義憤', reading: 'ぎふん', meaning: 'righteous indignation' },
      { word: '憤る', reading: 'いきどおる', meaning: 'to be indignant / resent' },
    ],
    strokeCount: 15, level: 'N1', radical: '心',
  },
  {
    id: 'n1k020', kanji: '粛', readings: { on: ['シュク'], kun: [] },
    meaning: 'solemn / quietly / stern / purge',
    examples: [
      { word: '厳粛', reading: 'げんしゅく', meaning: 'solemn / grave / austere' },
      { word: '粛清', reading: 'しゅくせい', meaning: 'purge / liquidation' },
      { word: '自粛', reading: 'じしゅく', meaning: 'self-restraint / voluntary restraint' },
    ],
    strokeCount: 11, level: 'N1', radical: '聿',
  },
];

export default n1Kanji;