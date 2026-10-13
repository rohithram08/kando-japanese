const n2Kanji = [
  // ── Original 20 (unchanged) ──────────────────────────────────────────
  {
    id: 'n2k001', kanji: '複', readings: { on: ['フク'], kun: [] },
    meaning: 'duplicate / double / compound / multiple',
    examples: [
      { word: '複雑', reading: 'ふくざつ', meaning: 'complex / complicated' },
      { word: '複数', reading: 'ふくすう', meaning: 'plural / multiple' },
      { word: '重複', reading: 'ちょうふく', meaning: 'duplication / overlap' },
    ],
    strokeCount: 14, level: 'N2', radical: '衣',
  },
  {
    id: 'n2k002', kanji: '築', readings: { on: ['チク'], kun: ['きず'] },
    meaning: 'build / construct / erect',
    examples: [
      { word: '建築', reading: 'けんちく', meaning: 'architecture / construction' },
      { word: '築く', reading: 'きずく', meaning: 'to build / construct' },
      { word: '新築', reading: 'しんちく', meaning: 'newly built' },
    ],
    strokeCount: 16, level: 'N2', radical: '竹',
  },
  {
    id: 'n2k003', kanji: '察', readings: { on: ['サツ'], kun: [] },
    meaning: 'guess / perceive / judge / understand',
    examples: [
      { word: '観察', reading: 'かんさつ', meaning: 'observation' },
      { word: '警察', reading: 'けいさつ', meaning: 'police' },
      { word: '察する', reading: 'さっする', meaning: 'to guess / sense' },
    ],
    strokeCount: 14, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k004', kanji: '承', readings: { on: ['ショウ'], kun: ['うけたまわ'] },
    meaning: 'consent / receive / hear / accept',
    examples: [
      { word: '承認', reading: 'しょうにん', meaning: 'approval / recognition' },
      { word: '了承', reading: 'りょうしょう', meaning: 'acknowledgment / consent' },
      { word: '承る', reading: 'うけたまわる', meaning: 'to humbly receive / hear' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k005', kanji: '慣', readings: { on: ['カン'], kun: ['な'] },
    meaning: 'accustomed to / get used to / become familiar',
    examples: [
      { word: '習慣', reading: 'しゅうかん', meaning: 'habit / custom' },
      { word: '慣れる', reading: 'なれる', meaning: 'to get used to' },
      { word: '慣用', reading: 'かんよう', meaning: 'common use / idiom' },
    ],
    strokeCount: 14, level: 'N2', radical: '心',
  },
  {
    id: 'n2k006', kanji: '採', readings: { on: ['サイ'], kun: ['と'] },
    meaning: 'pick / choose / adopt / gather',
    examples: [
      { word: '採用', reading: 'さいよう', meaning: 'employment / adoption' },
      { word: '採点', reading: 'さいてん', meaning: 'grading / marking' },
      { word: '採取', reading: 'さいしゅ', meaning: 'collection / sampling' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k007', kanji: '誤', readings: { on: ['ゴ'], kun: ['あやま'] },
    meaning: 'mistake / error / blunder',
    examples: [
      { word: '誤解', reading: 'ごかい', meaning: 'misunderstanding' },
      { word: '誤り', reading: 'あやまり', meaning: 'error / mistake' },
      { word: '錯誤', reading: 'さくご', meaning: 'blunder / trial and error' },
    ],
    strokeCount: 14, level: 'N2', radical: '言',
  },
  {
    id: 'n2k008', kanji: '遺', readings: { on: ['イ', 'ユイ'], kun: [] },
    meaning: 'bequeath / leave behind / lose',
    examples: [
      { word: '遺産', reading: 'いさん', meaning: 'inheritance / legacy' },
      { word: '遺言', reading: 'ゆいごん', meaning: 'will / testament' },
      { word: '遺体', reading: 'いたい', meaning: 'remains / corpse' },
    ],
    strokeCount: 15, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k009', kanji: '臨', readings: { on: ['リン'], kun: ['のぞ'] },
    meaning: 'face / confront / attend / overlook',
    examples: [
      { word: '臨時', reading: 'りんじ', meaning: 'temporary / special / extraordinary' },
      { word: '臨む', reading: 'のぞむ', meaning: 'to face / confront / attend' },
      { word: '臨場感', reading: 'りんじょうかん', meaning: 'sense of presence / realism' },
    ],
    strokeCount: 17, level: 'N2', radical: '臣',
  },
  {
    id: 'n2k010', kanji: '批', readings: { on: ['ヒ'], kun: [] },
    meaning: 'criticism / comment',
    examples: [
      { word: '批判', reading: 'ひはん', meaning: 'criticism / critique' },
      { word: '批評', reading: 'ひひょう', meaning: 'criticism / review' },
      { word: '批准', reading: 'ひじゅん', meaning: 'ratification' },
    ],
    strokeCount: 7, level: 'N2', radical: '手',
  },
  {
    id: 'n2k011', kanji: '拡', readings: { on: ['カク'], kun: ['ひろ'] },
    meaning: 'broaden / expand / extend',
    examples: [
      { word: '拡大', reading: 'かくだい', meaning: 'expansion / magnification' },
      { word: '拡張', reading: 'かくちょう', meaning: 'expansion / extension' },
      { word: '拡散', reading: 'かくさん', meaning: 'diffusion / spread' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k012', kanji: '縮', readings: { on: ['シュク'], kun: ['ちぢ'] },
    meaning: 'shrink / contract / reduce',
    examples: [
      { word: '縮小', reading: 'しゅくしょう', meaning: 'reduction / scaling down' },
      { word: '圧縮', reading: 'あっしゅく', meaning: 'compression' },
      { word: '縮む', reading: 'ちぢむ', meaning: 'to shrink / contract' },
    ],
    strokeCount: 17, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k013', kanji: '模', readings: { on: ['モ', 'ボ'], kun: [] },
    meaning: 'imitate / copy / pattern / model',
    examples: [
      { word: '模倣', reading: 'もほう', meaning: 'imitation / mimicry' },
      { word: '規模', reading: 'きぼ', meaning: 'scale / scope' },
      { word: '模型', reading: 'もけい', meaning: 'model / miniature' },
    ],
    strokeCount: 14, level: 'N2', radical: '木',
  },
  {
    id: 'n2k014', kanji: '担', readings: { on: ['タン'], kun: ['にな', 'かつ'] },
    meaning: 'shouldering / bearing / carrying',
    examples: [
      { word: '担当', reading: 'たんとう', meaning: 'in charge of / responsible' },
      { word: '負担', reading: 'ふたん', meaning: 'burden / charge' },
      { word: '担う', reading: 'になう', meaning: 'to bear / shoulder' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k015', kanji: '換', readings: { on: ['カン'], kun: ['か'] },
    meaning: 'exchange / change / convert',
    examples: [
      { word: '交換', reading: 'こうかん', meaning: 'exchange / swap' },
      { word: '換算', reading: 'かんさん', meaning: 'conversion / reckoning' },
      { word: '換える', reading: 'かえる', meaning: 'to exchange / replace' },
    ],
    strokeCount: 12, level: 'N2', radical: '手',
  },
  {
    id: 'n2k016', kanji: '序', readings: { on: ['ジョ'], kun: [] },
    meaning: 'preface / beginning / order / sequence',
    examples: [
      { word: '秩序', reading: 'ちつじょ', meaning: 'order / discipline' },
      { word: '序列', reading: 'じょれつ', meaning: 'order / ranking' },
      { word: '序文', reading: 'じょぶん', meaning: 'preface / foreword' },
    ],
    strokeCount: 7, level: 'N2', radical: '广',
  },
  {
    id: 'n2k017', kanji: '幹', readings: { on: ['カン'], kun: ['みき'] },
    meaning: 'trunk / main part / core / key',
    examples: [
      { word: '幹部', reading: 'かんぶ', meaning: 'executive / leading members' },
      { word: '基幹', reading: 'きかん', meaning: 'mainstay / nucleus' },
      { word: '幹線', reading: 'かんせん', meaning: 'main line / trunk line' },
    ],
    strokeCount: 13, level: 'N2', radical: '干',
  },
  {
    id: 'n2k018', kanji: '迷', readings: { on: ['メイ'], kun: ['まよ'] },
    meaning: 'astray / lose way / perplexed / bewildered',
    examples: [
      { word: '迷惑', reading: 'めいわく', meaning: 'trouble / annoyance / nuisance' },
      { word: '迷路', reading: 'めいろ', meaning: 'maze / labyrinth' },
      { word: '迷う', reading: 'まよう', meaning: 'to be lost / hesitate' },
    ],
    strokeCount: 9, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k019', kanji: '沿', readings: { on: ['エン'], kun: ['そ'] },
    meaning: 'run alongside / follow / along',
    examples: [
      { word: '沿岸', reading: 'えんがん', meaning: 'coast / shore' },
      { word: '沿線', reading: 'えんせん', meaning: 'along the railway line' },
      { word: '沿う', reading: 'そう', meaning: 'to run along / follow' },
    ],
    strokeCount: 8, level: 'N2', radical: '水',
  },
  {
    id: 'n2k020', kanji: '欲', readings: { on: ['ヨク'], kun: ['ほ'] },
    meaning: 'desire / want / greed / craving',
    examples: [
      { word: '欲求', reading: 'よっきゅう', meaning: 'desire / want / craving' },
      { word: '食欲', reading: 'しょくよく', meaning: 'appetite' },
      { word: '欲しい', reading: 'ほしい', meaning: 'wanted / desired' },
    ],
    strokeCount: 11, level: 'N2', radical: '欠',
  },

  // ── Additions: n2k021 → n2k160 ──────────────────────────────────────
  {
    id: 'n2k021', kanji: '圧', readings: { on: ['アツ'], kun: ['お'] },
    meaning: 'pressure / push / press down',
    examples: [
      { word: '圧力', reading: 'あつりょく', meaning: 'pressure / stress' },
      { word: '気圧', reading: 'きあつ', meaning: 'atmospheric pressure' },
      { word: '圧縮', reading: 'あっしゅく', meaning: 'compression / compaction' },
    ],
    strokeCount: 5, level: 'N2', radical: '土',
  },
  {
    id: 'n2k022', kanji: '移', readings: { on: ['イ'], kun: ['うつ'] },
    meaning: 'shift / move / transfer / migrate',
    examples: [
      { word: '移動', reading: 'いどう', meaning: 'movement / transfer' },
      { word: '移住', reading: 'いじゅう', meaning: 'immigration / migration' },
      { word: '移る', reading: 'うつる', meaning: 'to move / shift / migrate' },
    ],
    strokeCount: 11, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k023', kanji: '印', readings: { on: ['イン'], kun: ['しるし'] },
    meaning: 'stamp / seal / mark / sign',
    examples: [
      { word: '印刷', reading: 'いんさつ', meaning: 'printing' },
      { word: '印象', reading: 'いんしょう', meaning: 'impression' },
      { word: '目印', reading: 'めじるし', meaning: 'landmark / mark / sign' },
    ],
    strokeCount: 6, level: 'N2', radical: '卩',
  },
  {
    id: 'n2k024', kanji: '営', readings: { on: ['エイ'], kun: ['いとな'] },
    meaning: 'manage / run / operate / conduct business',
    examples: [
      { word: '営業', reading: 'えいぎょう', meaning: 'business / sales operations' },
      { word: '経営', reading: 'けいえい', meaning: 'management / administration' },
      { word: '営む', reading: 'いとなむ', meaning: 'to manage / run / engage in' },
    ],
    strokeCount: 12, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k025', kanji: '益', readings: { on: ['エキ', 'ヤク'], kun: [] },
    meaning: 'benefit / profit / gain / advantage',
    examples: [
      { word: '利益', reading: 'りえき', meaning: 'profit / benefit / gain' },
      { word: '有益', reading: 'ゆうえき', meaning: 'beneficial / profitable' },
      { word: '益々', reading: 'ますます', meaning: 'increasingly / more and more' },
    ],
    strokeCount: 10, level: 'N2', radical: '皿',
  },
  {
    id: 'n2k026', kanji: '演', readings: { on: ['エン'], kun: [] },
    meaning: 'perform / act / play / render',
    examples: [
      { word: '演技', reading: 'えんぎ', meaning: 'performance / acting' },
      { word: '演説', reading: 'えんぜつ', meaning: 'speech / address' },
      { word: '演奏', reading: 'えんそう', meaning: 'musical performance' },
    ],
    strokeCount: 14, level: 'N2', radical: '水',
  },
  {
    id: 'n2k027', kanji: '応', readings: { on: ['オウ'], kun: ['こた'] },
    meaning: 'respond / answer / comply / apply',
    examples: [
      { word: '応用', reading: 'おうよう', meaning: 'application / practical use' },
      { word: '反応', reading: 'はんのう', meaning: 'reaction / response' },
      { word: '応じる', reading: 'おうじる', meaning: 'to respond / comply' },
    ],
    strokeCount: 7, level: 'N2', radical: '心',
  },
  {
    id: 'n2k028', kanji: '往', readings: { on: ['オウ'], kun: [] },
    meaning: 'go / travel to / proceeding',
    examples: [
      { word: '往復', reading: 'おうふく', meaning: 'round trip / back and forth' },
      { word: '往来', reading: 'おうらい', meaning: 'coming and going / traffic' },
      { word: '往年', reading: 'おうねん', meaning: 'past years / bygone days' },
    ],
    strokeCount: 8, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k029', kanji: '恩', readings: { on: ['オン'], kun: [] },
    meaning: 'grace / favour / kindness / debt of gratitude',
    examples: [
      { word: '恩人', reading: 'おんじん', meaning: 'benefactor / patron' },
      { word: '恩恵', reading: 'おんけい', meaning: 'benefit / grace / favour' },
      { word: '恩返し', reading: 'おんがえし', meaning: 'returning a favour' },
    ],
    strokeCount: 10, level: 'N2', radical: '心',
  },
  {
    id: 'n2k030', kanji: '仮', readings: { on: ['カ', 'ケ'], kun: ['かり'] },
    meaning: 'temporary / false / provisional / hypothesis',
    examples: [
      { word: '仮定', reading: 'かてい', meaning: 'assumption / hypothesis' },
      { word: '仮名', reading: 'かな', meaning: 'kana (Japanese phonetic letters)' },
      { word: '仮に', reading: 'かりに', meaning: 'temporarily / supposing that' },
    ],
    strokeCount: 6, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k031', kanji: '価', readings: { on: ['カ'], kun: ['ね'] },
    meaning: 'value / price / worth / evaluate',
    examples: [
      { word: '価値', reading: 'かち', meaning: 'value / worth / merit' },
      { word: '物価', reading: 'ぶっか', meaning: 'prices of commodities' },
      { word: '評価', reading: 'ひょうか', meaning: 'evaluation / assessment' },
    ],
    strokeCount: 8, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k032', kanji: '快', readings: { on: ['カイ'], kun: ['こころよ'] },
    meaning: 'pleasant / cheerful / agreeable / comfortable',
    examples: [
      { word: '快適', reading: 'かいてき', meaning: 'comfortable / pleasant' },
      { word: '快復', reading: 'かいふく', meaning: 'recovery / restoration to health' },
      { word: '爽快', reading: 'そうかい', meaning: 'refreshing / exhilarating' },
    ],
    strokeCount: 7, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k033', kanji: '確', readings: { on: ['カク'], kun: ['たし'] },
    meaning: 'certain / definite / sure / confirm',
    examples: [
      { word: '確認', reading: 'かくにん', meaning: 'confirmation / verification' },
      { word: '正確', reading: 'せいかく', meaning: 'accurate / exact / precise' },
      { word: '確かめる', reading: 'たしかめる', meaning: 'to confirm / verify' },
    ],
    strokeCount: 15, level: 'N2', radical: '石',
  },
  {
    id: 'n2k034', kanji: '革', readings: { on: ['カク'], kun: ['かわ'] },
    meaning: 'leather / reform / change / revolution',
    examples: [
      { word: '革命', reading: 'かくめい', meaning: 'revolution' },
      { word: '改革', reading: 'かいかく', meaning: 'reform / innovation' },
      { word: '皮革', reading: 'ひかく', meaning: 'leather / hide' },
    ],
    strokeCount: 9, level: 'N2', radical: '革',
  },
  {
    id: 'n2k035', kanji: '割', readings: { on: ['カツ'], kun: ['わ', 'さ'] },
    meaning: 'divide / cut / split / proportion',
    examples: [
      { word: '割合', reading: 'わりあい', meaning: 'ratio / proportion / rate' },
      { word: '分割', reading: 'ぶんかつ', meaning: 'division / splitting / partition' },
      { word: '割引', reading: 'わりびき', meaning: 'discount / reduction' },
    ],
    strokeCount: 12, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k036', kanji: '完', readings: { on: ['カン'], kun: [] },
    meaning: 'perfect / complete / finish / whole',
    examples: [
      { word: '完全', reading: 'かんぜん', meaning: 'perfect / complete / flawless' },
      { word: '完成', reading: 'かんせい', meaning: 'completion / accomplishment' },
      { word: '未完', reading: 'みかん', meaning: 'unfinished / incomplete' },
    ],
    strokeCount: 7, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k037', kanji: '感', readings: { on: ['カン'], kun: ['かん'] },
    meaning: 'feeling / sense / emotion / impression',
    examples: [
      { word: '感情', reading: 'かんじょう', meaning: 'emotion / feeling / sentiment' },
      { word: '感謝', reading: 'かんしゃ', meaning: 'gratitude / thanks' },
      { word: '感じる', reading: 'かんじる', meaning: 'to feel / to sense' },
    ],
    strokeCount: 13, level: 'N2', radical: '心',
  },
  {
    id: 'n2k038', kanji: '官', readings: { on: ['カン'], kun: [] },
    meaning: 'government / official / organ / bureaucrat',
    examples: [
      { word: '官僚', reading: 'かんりょう', meaning: 'bureaucrat / government official' },
      { word: '官庁', reading: 'かんちょう', meaning: 'government office / authorities' },
      { word: '器官', reading: 'きかん', meaning: 'organ / apparatus' },
    ],
    strokeCount: 8, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k039', kanji: '管', readings: { on: ['カン'], kun: ['くだ'] },
    meaning: 'pipe / tube / control / manage',
    examples: [
      { word: '管理', reading: 'かんり', meaning: 'management / administration' },
      { word: '管轄', reading: 'かんかつ', meaning: 'jurisdiction / control' },
      { word: '管楽器', reading: 'かんがっき', meaning: 'wind instrument' },
    ],
    strokeCount: 14, level: 'N2', radical: '竹',
  },
  {
    id: 'n2k040', kanji: '格', readings: { on: ['カク', 'コウ'], kun: [] },
    meaning: 'status / standard / rank / character',
    examples: [
      { word: '性格', reading: 'せいかく', meaning: 'personality / character' },
      { word: '資格', reading: 'しかく', meaning: 'qualification / credential' },
      { word: '格差', reading: 'かくさ', meaning: 'disparity / gap / difference' },
    ],
    strokeCount: 10, level: 'N2', radical: '木',
  },
  {
    id: 'n2k041', kanji: '観', readings: { on: ['カン'], kun: [] },
    meaning: 'view / outlook / observe / perspective',
    examples: [
      { word: '観光', reading: 'かんこう', meaning: 'sightseeing / tourism' },
      { word: '観点', reading: 'かんてん', meaning: 'viewpoint / standpoint' },
      { word: '主観', reading: 'しゅかん', meaning: 'subjectivity / personal view' },
    ],
    strokeCount: 18, level: 'N2', radical: '見',
  },
  {
    id: 'n2k042', kanji: '議', readings: { on: ['ギ'], kun: [] },
    meaning: 'deliberation / debate / discuss / consult',
    examples: [
      { word: '議論', reading: 'ぎろん', meaning: 'debate / argument / discussion' },
      { word: '会議', reading: 'かいぎ', meaning: 'meeting / conference / assembly' },
      { word: '議員', reading: 'ぎいん', meaning: 'assembly member / member of parliament' },
    ],
    strokeCount: 20, level: 'N2', radical: '言',
  },
  {
    id: 'n2k043', kanji: '義', readings: { on: ['ギ'], kun: [] },
    meaning: 'righteousness / justice / meaning / significance',
    examples: [
      { word: '意義', reading: 'いぎ', meaning: 'meaning / significance / importance' },
      { word: '定義', reading: 'ていぎ', meaning: 'definition' },
      { word: '義務', reading: 'ぎむ', meaning: 'duty / obligation / responsibility' },
    ],
    strokeCount: 13, level: 'N2', radical: '羊',
  },
  {
    id: 'n2k044', kanji: '逆', readings: { on: ['ギャク'], kun: ['さか', 'さかさ'] },
    meaning: 'reverse / contrary / opposite / disobey',
    examples: [
      { word: '逆転', reading: 'ぎゃくてん', meaning: 'reversal / turnaround' },
      { word: '逆効果', reading: 'ぎゃくこうか', meaning: 'counterproductive / reverse effect' },
      { word: '逆さ', reading: 'さかさ', meaning: 'upside down / inverted' },
    ],
    strokeCount: 9, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k045', kanji: '境', readings: { on: ['キョウ', 'ケイ'], kun: ['さかい'] },
    meaning: 'boundary / border / region / situation',
    examples: [
      { word: '環境', reading: 'かんきょう', meaning: 'environment / surroundings' },
      { word: '境界', reading: 'きょうかい', meaning: 'boundary / border / dividing line' },
      { word: '国境', reading: 'こっきょう', meaning: 'national border / frontier' },
    ],
    strokeCount: 14, level: 'N2', radical: '土',
  },
  {
    id: 'n2k046', kanji: '許', readings: { on: ['キョ'], kun: ['ゆる'] },
    meaning: 'permit / allow / forgive / license',
    examples: [
      { word: '許可', reading: 'きょか', meaning: 'permission / approval' },
      { word: '免許', reading: 'めんきょ', meaning: 'license / permit' },
      { word: '許す', reading: 'ゆるす', meaning: 'to forgive / permit / allow' },
    ],
    strokeCount: 11, level: 'N2', radical: '言',
  },
  {
    id: 'n2k047', kanji: '居', readings: { on: ['キョ'], kun: ['い'] },
    meaning: 'residence / stay / sit / be located',
    examples: [
      { word: '居住', reading: 'きょじゅう', meaning: 'residence / dwelling' },
      { word: '同居', reading: 'どうきょ', meaning: 'living together / cohabitation' },
      { word: '居心地', reading: 'いごこち', meaning: 'comfort / feeling at ease' },
    ],
    strokeCount: 8, level: 'N2', radical: '尸',
  },
  {
    id: 'n2k048', kanji: '型', readings: { on: ['ケイ'], kun: ['かた'] },
    meaning: 'mold / model / type / pattern',
    examples: [
      { word: '典型', reading: 'てんけい', meaning: 'typical example / model' },
      { word: '大型', reading: 'おおがた', meaning: 'large-sized / large-scale' },
      { word: '血液型', reading: 'けつえきがた', meaning: 'blood type' },
    ],
    strokeCount: 9, level: 'N2', radical: '土',
  },
  {
    id: 'n2k049', kanji: '経', readings: { on: ['ケイ', 'キョウ'], kun: ['へ'] },
    meaning: 'pass / experience / longitude / manage',
    examples: [
      { word: '経済', reading: 'けいざい', meaning: 'economy / economics' },
      { word: '経験', reading: 'けいけん', meaning: 'experience' },
      { word: '経る', reading: 'へる', meaning: 'to pass / elapse / go through' },
    ],
    strokeCount: 11, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k050', kanji: '劇', readings: { on: ['ゲキ'], kun: [] },
    meaning: 'drama / play / theatre / intense',
    examples: [
      { word: '劇場', reading: 'げきじょう', meaning: 'theatre / playhouse' },
      { word: '演劇', reading: 'えんげき', meaning: 'play / drama / theatrical performance' },
      { word: '劇的', reading: 'げきてき', meaning: 'dramatic / drastic' },
    ],
    strokeCount: 15, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k051', kanji: '現', readings: { on: ['ゲン'], kun: ['あらわ'] },
    meaning: 'present / current / appear / manifest',
    examples: [
      { word: '現在', reading: 'げんざい', meaning: 'present / now / currently' },
      { word: '表現', reading: 'ひょうげん', meaning: 'expression / representation' },
      { word: '現れる', reading: 'あらわれる', meaning: 'to appear / emerge / manifest' },
    ],
    strokeCount: 11, level: 'N2', radical: '王',
  },
  {
    id: 'n2k052', kanji: '限', readings: { on: ['ゲン'], kun: ['かぎ'] },
    meaning: 'limit / bound / restrict / maximum',
    examples: [
      { word: '限界', reading: 'げんかい', meaning: 'limit / boundary / threshold' },
      { word: '制限', reading: 'せいげん', meaning: 'restriction / limitation' },
      { word: '限る', reading: 'かぎる', meaning: 'to limit / restrict / be limited to' },
    ],
    strokeCount: 9, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k053', kanji: '減', readings: { on: ['ゲン'], kun: ['へ'] },
    meaning: 'decrease / reduce / diminish / subtract',
    examples: [
      { word: '減少', reading: 'げんしょう', meaning: 'decrease / decline / reduction' },
      { word: '削減', reading: 'さくげん', meaning: 'reduction / cutback' },
      { word: '減る', reading: 'へる', meaning: 'to decrease / diminish' },
    ],
    strokeCount: 12, level: 'N2', radical: '水',
  },
  {
    id: 'n2k054', kanji: '個', readings: { on: ['コ'], kun: [] },
    meaning: 'individual / counter for small objects',
    examples: [
      { word: '個人', reading: 'こじん', meaning: 'individual / personal' },
      { word: '個性', reading: 'こせい', meaning: 'individuality / personality' },
      { word: '個別', reading: 'こべつ', meaning: 'individual / case-by-case' },
    ],
    strokeCount: 10, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k055', kanji: '効', readings: { on: ['コウ'], kun: ['き'] },
    meaning: 'effect / efficient / result / benefit',
    examples: [
      { word: '効果', reading: 'こうか', meaning: 'effect / result / effectiveness' },
      { word: '有効', reading: 'ゆうこう', meaning: 'effective / valid / in force' },
      { word: '効率', reading: 'こうりつ', meaning: 'efficiency / effectiveness' },
    ],
    strokeCount: 8, level: 'N2', radical: '力',
  },
  {
    id: 'n2k056', kanji: '構', readings: { on: ['コウ'], kun: ['かま'] },
    meaning: 'structure / build / form / posture',
    examples: [
      { word: '構造', reading: 'こうぞう', meaning: 'structure / construction / framework' },
      { word: '機構', reading: 'きこう', meaning: 'mechanism / organisation / setup' },
      { word: '構える', reading: 'かまえる', meaning: 'to set up / take a stance' },
    ],
    strokeCount: 14, level: 'N2', radical: '木',
  },
  {
    id: 'n2k057', kanji: '興', readings: { on: ['コウ', 'キョウ'], kun: ['おこ'] },
    meaning: 'interest / excitement / arise / prosper',
    examples: [
      { word: '興味', reading: 'きょうみ', meaning: 'interest / curiosity' },
      { word: '興奮', reading: 'こうふん', meaning: 'excitement / agitation' },
      { word: '振興', reading: 'しんこう', meaning: 'promotion / fostering / development' },
    ],
    strokeCount: 16, level: 'N2', radical: '舁',
  },
  {
    id: 'n2k058', kanji: '康', readings: { on: ['コウ'], kun: [] },
    meaning: 'health / ease / peace / well-being',
    examples: [
      { word: '健康', reading: 'けんこう', meaning: 'health / good condition' },
      { word: '小康', reading: 'しょうこう', meaning: 'temporary relief / lull' },
      { word: '康平', reading: 'こうへい', meaning: 'peace / good health' },
    ],
    strokeCount: 11, level: 'N2', radical: '广',
  },
  {
    id: 'n2k059', kanji: '混', readings: { on: ['コン'], kun: ['ま'] },
    meaning: 'mix / mingle / confused / blend',
    examples: [
      { word: '混雑', reading: 'こんざつ', meaning: 'congestion / crowded / busy' },
      { word: '混乱', reading: 'こんらん', meaning: 'confusion / chaos / disorder' },
      { word: '混じる', reading: 'まじる', meaning: 'to mix / mingle / blend' },
    ],
    strokeCount: 11, level: 'N2', radical: '水',
  },
  {
    id: 'n2k060', kanji: '査', readings: { on: ['サ'], kun: [] },
    meaning: 'investigate / inspect / examine / check',
    examples: [
      { word: '検査', reading: 'けんさ', meaning: 'inspection / examination / check' },
      { word: '調査', reading: 'ちょうさ', meaning: 'investigation / survey / research' },
      { word: '審査', reading: 'しんさ', meaning: 'screening / examination / review' },
    ],
    strokeCount: 9, level: 'N2', radical: '木',
  },
  {
    id: 'n2k061', kanji: '済', readings: { on: ['サイ'], kun: ['す'] },
    meaning: 'settle / finish / economy / aid',
    examples: [
      { word: '経済', reading: 'けいざい', meaning: 'economy / economics' },
      { word: '返済', reading: 'へんさい', meaning: 'repayment / reimbursement' },
      { word: '済む', reading: 'すむ', meaning: 'to be completed / finished / resolved' },
    ],
    strokeCount: 11, level: 'N2', radical: '水',
  },
  {
    id: 'n2k062', kanji: '際', readings: { on: ['サイ'], kun: ['きわ'] },
    meaning: 'occasion / time / edge / verge',
    examples: [
      { word: '実際', reading: 'じっさい', meaning: 'actually / in practice / in reality' },
      { word: '国際', reading: 'こくさい', meaning: 'international' },
      { word: '際立つ', reading: 'きわだつ', meaning: 'to stand out / be conspicuous' },
    ],
    strokeCount: 14, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k063', kanji: '参', readings: { on: ['サン'], kun: ['まい'] },
    meaning: 'participate / visit / come / go (humble)',
    examples: [
      { word: '参加', reading: 'さんか', meaning: 'participation / joining' },
      { word: '参考', reading: 'さんこう', meaning: 'reference / consultation' },
      { word: '参る', reading: 'まいる', meaning: 'to go / come (humble form)' },
    ],
    strokeCount: 8, level: 'N2', radical: '厶',
  },
  {
    id: 'n2k064', kanji: '散', readings: { on: ['サン'], kun: ['ち'] },
    meaning: 'scatter / disperse / separate / spread',
    examples: [
      { word: '散歩', reading: 'さんぽ', meaning: 'walk / stroll' },
      { word: '分散', reading: 'ぶんさん', meaning: 'dispersion / scattering / distribution' },
      { word: '散る', reading: 'ちる', meaning: 'to scatter / fall / be scattered' },
    ],
    strokeCount: 12, level: 'N2', radical: '攴',
  },
  {
    id: 'n2k065', kanji: '産', readings: { on: ['サン'], kun: ['う', 'うぶ'] },
    meaning: 'production / birth / property / assets',
    examples: [
      { word: '生産', reading: 'せいさん', meaning: 'production / manufacture' },
      { word: '産業', reading: 'さんぎょう', meaning: 'industry' },
      { word: '産む', reading: 'うむ', meaning: 'to give birth / produce' },
    ],
    strokeCount: 11, level: 'N2', radical: '生',
  },
  {
    id: 'n2k066', kanji: '賛', readings: { on: ['サン'], kun: [] },
    meaning: 'praise / agree / support / sponsor',
    examples: [
      { word: '賛成', reading: 'さんせい', meaning: 'approval / agreement / support' },
      { word: '賛同', reading: 'さんどう', meaning: 'approval / support / endorsement' },
      { word: '協賛', reading: 'きょうさん', meaning: 'cooperation / sponsorship' },
    ],
    strokeCount: 15, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k067', kanji: '残', readings: { on: ['ザン'], kun: ['のこ'] },
    meaning: 'remain / leftover / cruel / brutal',
    examples: [
      { word: '残念', reading: 'ざんねん', meaning: 'regrettable / unfortunate / too bad' },
      { word: '残業', reading: 'ざんぎょう', meaning: 'overtime work / extra hours' },
      { word: '残る', reading: 'のこる', meaning: 'to remain / be left over' },
    ],
    strokeCount: 10, level: 'N2', radical: '歹',
  },
  {
    id: 'n2k068', kanji: '試', readings: { on: ['シ'], kun: ['こころ', 'ため'] },
    meaning: 'test / try / attempt / experiment',
    examples: [
      { word: '試験', reading: 'しけん', meaning: 'examination / test / trial' },
      { word: '試合', reading: 'しあい', meaning: 'match / game / contest' },
      { word: '試みる', reading: 'こころみる', meaning: 'to try / attempt / venture' },
    ],
    strokeCount: 13, level: 'N2', radical: '言',
  },
  {
    id: 'n2k069', kanji: '示', readings: { on: ['シ', 'ジ'], kun: ['しめ'] },
    meaning: 'show / indicate / demonstrate / reveal',
    examples: [
      { word: '展示', reading: 'てんじ', meaning: 'exhibition / display' },
      { word: '指示', reading: 'しじ', meaning: 'instructions / directions / orders' },
      { word: '示す', reading: 'しめす', meaning: 'to show / indicate / point out' },
    ],
    strokeCount: 5, level: 'N2', radical: '示',
  },
  {
    id: 'n2k070', kanji: '識', readings: { on: ['シキ'], kun: [] },
    meaning: 'discriminate / know / distinguish / consciousness',
    examples: [
      { word: '知識', reading: 'ちしき', meaning: 'knowledge / information' },
      { word: '意識', reading: 'いしき', meaning: 'consciousness / awareness' },
      { word: '常識', reading: 'じょうしき', meaning: 'common sense / general knowledge' },
    ],
    strokeCount: 19, level: 'N2', radical: '言',
  },
  {
    id: 'n2k071', kanji: '若', readings: { on: ['ジャク', 'ニャク'], kun: ['わか', 'も'] },
    meaning: 'young / if / or / as if',
    examples: [
      { word: '若者', reading: 'わかもの', meaning: 'young person / youth' },
      { word: '若干', reading: 'じゃっかん', meaning: 'a few / some / somewhat' },
      { word: '若い', reading: 'わかい', meaning: 'young / youthful' },
    ],
    strokeCount: 8, level: 'N2', radical: '艸',
  },
  {
    id: 'n2k072', kanji: '収', readings: { on: ['シュウ'], kun: ['おさ'] },
    meaning: 'income / collect / obtain / put away',
    examples: [
      { word: '収入', reading: 'しゅうにゅう', meaning: 'income / revenue / earnings' },
      { word: '収集', reading: 'しゅうしゅう', meaning: 'collection / gathering' },
      { word: '収める', reading: 'おさめる', meaning: 'to obtain / achieve / put away' },
    ],
    strokeCount: 4, level: 'N2', radical: '又',
  },
  {
    id: 'n2k073', kanji: '需', readings: { on: ['ジュ'], kun: [] },
    meaning: 'demand / need / require / necessitate',
    examples: [
      { word: '需要', reading: 'じゅよう', meaning: 'demand / needs' },
      { word: '需給', reading: 'じゅきゅう', meaning: 'supply and demand' },
      { word: '必需品', reading: 'ひつじゅひん', meaning: 'necessities / daily essentials' },
    ],
    strokeCount: 14, level: 'N2', radical: '雨',
  },
  {
    id: 'n2k074', kanji: '術', readings: { on: ['ジュツ'], kun: [] },
    meaning: 'art / technique / skill / means',
    examples: [
      { word: '技術', reading: 'ぎじゅつ', meaning: 'technology / technique / skill' },
      { word: '手術', reading: 'しゅじゅつ', meaning: 'surgery / operation' },
      { word: '芸術', reading: 'げいじゅつ', meaning: 'art / the arts' },
    ],
    strokeCount: 11, level: 'N2', radical: '行',
  },
  {
    id: 'n2k075', kanji: '勝', readings: { on: ['ショウ'], kun: ['か', 'まさ'] },
    meaning: 'win / victory / excel / surpass',
    examples: [
      { word: '勝利', reading: 'しょうり', meaning: 'victory / triumph / win' },
      { word: '優勝', reading: 'ゆうしょう', meaning: 'championship / overall victory' },
      { word: '勝つ', reading: 'かつ', meaning: 'to win / beat / triumph' },
    ],
    strokeCount: 12, level: 'N2', radical: '力',
  },
  {
    id: 'n2k076', kanji: '証', readings: { on: ['ショウ'], kun: ['あかし'] },
    meaning: 'evidence / proof / certificate / certify',
    examples: [
      { word: '証明', reading: 'しょうめい', meaning: 'proof / evidence / certification' },
      { word: '保証', reading: 'ほしょう', meaning: 'guarantee / warranty / assurance' },
      { word: '証拠', reading: 'しょうこ', meaning: 'evidence / proof / clue' },
    ],
    strokeCount: 12, level: 'N2', radical: '言',
  },
  {
    id: 'n2k077', kanji: '象', readings: { on: ['ショウ', 'ゾウ'], kun: [] },
    meaning: 'elephant / image / phenomenon / symbol',
    examples: [
      { word: '現象', reading: 'げんしょう', meaning: 'phenomenon / occurrence' },
      { word: '印象', reading: 'いんしょう', meaning: 'impression / image' },
      { word: '象徴', reading: 'しょうちょう', meaning: 'symbol / emblem' },
    ],
    strokeCount: 12, level: 'N2', radical: '豕',
  },
  {
    id: 'n2k078', kanji: '情', readings: { on: ['ジョウ', 'セイ'], kun: ['なさ'] },
    meaning: 'feeling / emotion / information / situation',
    examples: [
      { word: '感情', reading: 'かんじょう', meaning: 'emotion / feeling / sentiment' },
      { word: '情報', reading: 'じょうほう', meaning: 'information / news / data' },
      { word: '情景', reading: 'じょうけい', meaning: 'scene / spectacle / sight' },
    ],
    strokeCount: 11, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k079', kanji: '状', readings: { on: ['ジョウ'], kun: [] },
    meaning: 'condition / form / letter / appearance',
    examples: [
      { word: '状況', reading: 'じょうきょう', meaning: 'situation / circumstances / conditions' },
      { word: '状態', reading: 'じょうたい', meaning: 'state / condition / circumstances' },
      { word: '現状', reading: 'げんじょう', meaning: 'current state / status quo' },
    ],
    strokeCount: 7, level: 'N2', radical: '犬',
  },
  {
    id: 'n2k080', kanji: '常', readings: { on: ['ジョウ'], kun: ['つね', 'とこ'] },
    meaning: 'normal / usual / constant / always',
    examples: [
      { word: '非常', reading: 'ひじょう', meaning: 'extraordinary / emergency / extreme' },
      { word: '日常', reading: 'にちじょう', meaning: 'everyday / daily / ordinary' },
      { word: '常識', reading: 'じょうしき', meaning: 'common sense / general knowledge' },
    ],
    strokeCount: 11, level: 'N2', radical: '巾',
  },
  {
    id: 'n2k081', kanji: '職', readings: { on: ['ショク'], kun: [] },
    meaning: 'occupation / job / employment / position',
    examples: [
      { word: '職業', reading: 'しょくぎょう', meaning: 'occupation / profession / vocation' },
      { word: '職場', reading: 'しょくば', meaning: 'workplace / office / work site' },
      { word: '求職', reading: 'きゅうしょく', meaning: 'job-seeking / looking for work' },
    ],
    strokeCount: 18, level: 'N2', radical: '耳',
  },
  {
    id: 'n2k082', kanji: '信', readings: { on: ['シン'], kun: [] },
    meaning: 'trust / believe / faith / confidence',
    examples: [
      { word: '信頼', reading: 'しんらい', meaning: 'trust / confidence / reliance' },
      { word: '確信', reading: 'かくしん', meaning: 'conviction / certainty / confidence' },
      { word: '信じる', reading: 'しんじる', meaning: 'to believe / trust / have faith' },
    ],
    strokeCount: 9, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k083', kanji: '申', readings: { on: ['シン'], kun: ['もう'] },
    meaning: 'state humbly / report / say (humble) / the Monkey',
    examples: [
      { word: '申請', reading: 'しんせい', meaning: 'application / petition / request' },
      { word: '申告', reading: 'しんこく', meaning: 'declaration / report / filing' },
      { word: '申し込む', reading: 'もうしこむ', meaning: 'to apply / request / sign up' },
    ],
    strokeCount: 5, level: 'N2', radical: '田',
  },
  {
    id: 'n2k084', kanji: '制', readings: { on: ['セイ'], kun: [] },
    meaning: 'system / control / regulate / restrict',
    examples: [
      { word: '制度', reading: 'せいど', meaning: 'system / institution / setup' },
      { word: '規制', reading: 'きせい', meaning: 'regulation / restriction / control' },
      { word: '制限', reading: 'せいげん', meaning: 'restriction / limitation / constraint' },
    ],
    strokeCount: 8, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k085', kanji: '性', readings: { on: ['セイ', 'ショウ'], kun: [] },
    meaning: 'nature / sex / characteristic / property',
    examples: [
      { word: '性格', reading: 'せいかく', meaning: 'personality / character / nature' },
      { word: '可能性', reading: 'かのうせい', meaning: 'possibility / potential' },
      { word: '性質', reading: 'せいしつ', meaning: 'nature / property / disposition' },
    ],
    strokeCount: 8, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k086', kanji: '政', readings: { on: ['セイ', 'ショウ'], kun: [] },
    meaning: 'politics / government / rule / administration',
    examples: [
      { word: '政治', reading: 'せいじ', meaning: 'politics / government / administration' },
      { word: '行政', reading: 'ぎょうせい', meaning: 'administration / government' },
      { word: '政策', reading: 'せいさく', meaning: 'policy / measure / plan' },
    ],
    strokeCount: 9, level: 'N2', radical: '攴',
  },
  {
    id: 'n2k087', kanji: '製', readings: { on: ['セイ'], kun: [] },
    meaning: 'manufacture / made by / produce / make',
    examples: [
      { word: '製品', reading: 'せいひん', meaning: 'product / manufactured goods' },
      { word: '製造', reading: 'せいぞう', meaning: 'manufacturing / production' },
      { word: '日本製', reading: 'にほんせい', meaning: 'made in Japan' },
    ],
    strokeCount: 14, level: 'N2', radical: '衣',
  },
  {
    id: 'n2k088', kanji: '精', readings: { on: ['セイ', 'ショウ'], kun: [] },
    meaning: 'refined / pure / spirit / precise / energy',
    examples: [
      { word: '精神', reading: 'せいしん', meaning: 'spirit / mind / mentality' },
      { word: '精密', reading: 'せいみつ', meaning: 'precise / detailed / accurate' },
      { word: '精力', reading: 'せいりょく', meaning: 'energy / vigour / vitality' },
    ],
    strokeCount: 14, level: 'N2', radical: '米',
  },
  {
    id: 'n2k089', kanji: '責', readings: { on: ['セキ'], kun: ['せ'] },
    meaning: 'blame / responsibility / duty / reproach',
    examples: [
      { word: '責任', reading: 'せきにん', meaning: 'responsibility / duty / liability' },
      { word: '自責', reading: 'じせき', meaning: 'self-reproach / blame oneself' },
      { word: '責める', reading: 'せめる', meaning: 'to blame / reproach / criticise' },
    ],
    strokeCount: 11, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k090', kanji: '接', readings: { on: ['セツ'], kun: ['つ'] },
    meaning: 'touch / contact / connect / receive',
    examples: [
      { word: '接続', reading: 'せつぞく', meaning: 'connection / linking' },
      { word: '接触', reading: 'せっしょく', meaning: 'contact / touch / exposure' },
      { word: '面接', reading: 'めんせつ', meaning: 'interview / face-to-face meeting' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k091', kanji: '設', readings: { on: ['セツ'], kun: ['もう'] },
    meaning: 'establish / set up / install / found',
    examples: [
      { word: '設備', reading: 'せつび', meaning: 'equipment / facilities / installation' },
      { word: '設立', reading: 'せつりつ', meaning: 'establishment / founding / set up' },
      { word: '設ける', reading: 'もうける', meaning: 'to establish / set up / prepare' },
    ],
    strokeCount: 11, level: 'N2', radical: '言',
  },
  {
    id: 'n2k092', kanji: '節', readings: { on: ['セツ', 'セチ'], kun: ['ふし'] },
    meaning: 'season / occasion / joint / period / moderation',
    examples: [
      { word: '季節', reading: 'きせつ', meaning: 'season / time of year' },
      { word: '節約', reading: 'せつやく', meaning: 'economizing / saving / thrift' },
      { word: '関節', reading: 'かんせつ', meaning: 'joint / articulation' },
    ],
    strokeCount: 13, level: 'N2', radical: '竹',
  },
  {
    id: 'n2k093', kanji: '絶', readings: { on: ['ゼツ'], kun: ['た'] },
    meaning: 'discontinue / cease / absolute / exceedingly',
    examples: [
      { word: '絶対', reading: 'ぜったい', meaning: 'absolute / definitely / unconditional' },
      { word: '拒絶', reading: 'きょぜつ', meaning: 'rejection / refusal / denial' },
      { word: '絶える', reading: 'たえる', meaning: 'to cease / come to an end / die out' },
    ],
    strokeCount: 12, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k094', kanji: '専', readings: { on: ['セン'], kun: ['もっぱ'] },
    meaning: 'specialty / exclusive / solely / devoted',
    examples: [
      { word: '専門', reading: 'せんもん', meaning: 'specialty / area of expertise' },
      { word: '専業', reading: 'せんぎょう', meaning: 'full-time occupation / exclusive work' },
      { word: '専ら', reading: 'もっぱら', meaning: 'exclusively / solely / entirely' },
    ],
    strokeCount: 9, level: 'N2', radical: '寸',
  },
  {
    id: 'n2k095', kanji: '損', readings: { on: ['ソン'], kun: ['そこ'] },
    meaning: 'damage / loss / injury / harm',
    examples: [
      { word: '損害', reading: 'そんがい', meaning: 'damage / loss / injury' },
      { word: '損失', reading: 'そんしつ', meaning: 'loss / damage / disadvantage' },
      { word: '損なう', reading: 'そこなう', meaning: 'to damage / harm / impair' },
    ],
    strokeCount: 13, level: 'N2', radical: '手',
  },
  {
    id: 'n2k096', kanji: '態', readings: { on: ['タイ'], kun: [] },
    meaning: 'attitude / appearance / condition / aspect',
    examples: [
      { word: '態度', reading: 'たいど', meaning: 'attitude / manner / approach' },
      { word: '実態', reading: 'じったい', meaning: 'actual state / reality / truth' },
      { word: '状態', reading: 'じょうたい', meaning: 'condition / state / situation' },
    ],
    strokeCount: 14, level: 'N2', radical: '心',
  },
  {
    id: 'n2k097', kanji: '退', readings: { on: ['タイ'], kun: ['しりぞ', 'の'] },
    meaning: 'retreat / withdraw / resign / retire',
    examples: [
      { word: '退職', reading: 'たいしょく', meaning: 'retirement / resignation' },
      { word: '引退', reading: 'いんたい', meaning: 'retirement / stepping down' },
      { word: '退く', reading: 'しりぞく', meaning: 'to retreat / step back / withdraw' },
    ],
    strokeCount: 9, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k098', kanji: '択', readings: { on: ['タク'], kun: [] },
    meaning: 'choose / select / pick / option',
    examples: [
      { word: '選択', reading: 'せんたく', meaning: 'selection / choice / option' },
      { word: '択一', reading: 'たくいつ', meaning: 'multiple choice / selecting one' },
      { word: '二択', reading: 'にたく', meaning: 'two options / binary choice' },
    ],
    strokeCount: 7, level: 'N2', radical: '手',
  },
  {
    id: 'n2k099', kanji: '断', readings: { on: ['ダン'], kun: ['た', 'ことわ'] },
    meaning: 'cut / sever / refuse / judge / decide',
    examples: [
      { word: '判断', reading: 'はんだん', meaning: 'judgment / decision / discernment' },
      { word: '断言', reading: 'だんげん', meaning: 'assertion / declaration / affirmation' },
      { word: '断る', reading: 'ことわる', meaning: 'to refuse / decline / reject' },
    ],
    strokeCount: 11, level: 'N2', radical: '斤',
  },
  {
    id: 'n2k100', kanji: '値', readings: { on: ['チ'], kun: ['ね', 'あたい'] },
    meaning: 'price / value / cost / be worth',
    examples: [
      { word: '価値', reading: 'かち', meaning: 'value / worth / merit' },
      { word: '値段', reading: 'ねだん', meaning: 'price / cost / charge' },
      { word: '数値', reading: 'すうち', meaning: 'numerical value / figure / data' },
    ],
    strokeCount: 10, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k101', kanji: '著', readings: { on: ['チョ'], kun: ['いちじる', 'あらわ'] },
    meaning: 'author / write / remarkable / notable',
    examples: [
      { word: '著者', reading: 'ちょしゃ', meaning: 'author / writer / composer' },
      { word: '著作', reading: 'ちょさく', meaning: 'literary work / writing / publication' },
      { word: '著しい', reading: 'いちじるしい', meaning: 'remarkable / notable / striking' },
    ],
    strokeCount: 11, level: 'N2', radical: '艸',
  },
  {
    id: 'n2k102', kanji: '張', readings: { on: ['チョウ'], kun: ['は'] },
    meaning: 'stretch / spread / put up / assert',
    examples: [
      { word: '主張', reading: 'しゅちょう', meaning: 'assertion / claim / argument' },
      { word: '拡張', reading: 'かくちょう', meaning: 'expansion / extension / enlargement' },
      { word: '張る', reading: 'はる', meaning: 'to stretch / spread / stick out' },
    ],
    strokeCount: 11, level: 'N2', radical: '弓',
  },
  {
    id: 'n2k103', kanji: '調', readings: { on: ['チョウ'], kun: ['しら', 'ととの'] },
    meaning: 'tune / investigate / regulate / tone / condition',
    examples: [
      { word: '調査', reading: 'ちょうさ', meaning: 'investigation / survey / research' },
      { word: '調整', reading: 'ちょうせい', meaning: 'adjustment / coordination / regulation' },
      { word: '調べる', reading: 'しらべる', meaning: 'to investigate / examine / look up' },
    ],
    strokeCount: 15, level: 'N2', radical: '言',
  },
  {
    id: 'n2k104', kanji: '頂', readings: { on: ['チョウ'], kun: ['いただ'] },
    meaning: 'peak / top / summit / receive humbly',
    examples: [
      { word: '山頂', reading: 'さんちょう', meaning: 'mountain peak / summit / top' },
      { word: '頂上', reading: 'ちょうじょう', meaning: 'top / summit / peak' },
      { word: '頂く', reading: 'いただく', meaning: 'to receive (humble) / eat / drink' },
    ],
    strokeCount: 11, level: 'N2', radical: '頁',
  },
  {
    id: 'n2k105', kanji: '低', readings: { on: ['テイ'], kun: ['ひく'] },
    meaning: 'low / humble / base / inferior',
    examples: [
      { word: '低下', reading: 'ていか', meaning: 'decline / fall / drop / deterioration' },
      { word: '最低', reading: 'さいてい', meaning: 'minimum / worst / at least' },
      { word: '低い', reading: 'ひくい', meaning: 'low / short / humble / soft (voice)' },
    ],
    strokeCount: 7, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k106', kanji: '的', readings: { on: ['テキ'], kun: ['まと'] },
    meaning: 'target / aim / -ical / -al (suffix) / obvious',
    examples: [
      { word: '目的', reading: 'もくてき', meaning: 'purpose / objective / goal' },
      { word: '的確', reading: 'てきかく', meaning: 'accurate / precise / on target' },
      { word: '的外れ', reading: 'まとはずれ', meaning: 'off target / beside the point' },
    ],
    strokeCount: 8, level: 'N2', radical: '白',
  },
  {
    id: 'n2k107', kanji: '徒', readings: { on: ['ト'], kun: ['いたずら'] },
    meaning: 'on foot / follower / vain / in vain',
    examples: [
      { word: '生徒', reading: 'せいと', meaning: 'student / pupil / schoolchild' },
      { word: '徒歩', reading: 'とほ', meaning: 'on foot / walking' },
      { word: '信徒', reading: 'しんと', meaning: 'believer / follower / adherent' },
    ],
    strokeCount: 10, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k108', kanji: '登', readings: { on: ['トウ', 'ト'], kun: ['のぼ'] },
    meaning: 'climb / ascend / register / appear',
    examples: [
      { word: '登山', reading: 'とざん', meaning: 'mountain climbing / mountaineering' },
      { word: '登場', reading: 'とうじょう', meaning: 'appearance / entry / debut' },
      { word: '登る', reading: 'のぼる', meaning: 'to climb / ascend / go up' },
    ],
    strokeCount: 12, level: 'N2', radical: '癶',
  },
  {
    id: 'n2k109', kanji: '独', readings: { on: ['ドク'], kun: ['ひと'] },
    meaning: 'alone / single / independent / Germany',
    examples: [
      { word: '独立', reading: 'どくりつ', meaning: 'independence / self-sufficiency' },
      { word: '独自', reading: 'どくじ', meaning: 'unique / original / distinctive' },
      { word: '単独', reading: 'たんどく', meaning: 'alone / solo / single-handed' },
    ],
    strokeCount: 9, level: 'N2', radical: '犬',
  },
  {
    id: 'n2k110', kanji: '難', readings: { on: ['ナン'], kun: ['かた', 'むずか'] },
    meaning: 'difficult / hard / crisis / fault / disaster',
    examples: [
      { word: '困難', reading: 'こんなん', meaning: 'difficulty / hardship / trouble' },
      { word: '難民', reading: 'なんみん', meaning: 'refugee / displaced person' },
      { word: '難しい', reading: 'むずかしい', meaning: 'difficult / hard / complicated' },
    ],
    strokeCount: 18, level: 'N2', radical: '隹',
  },
  {
    id: 'n2k111', kanji: '燃', readings: { on: ['ネン'], kun: ['も'] },
    meaning: 'burn / ignite / kindle / fuel',
    examples: [
      { word: '燃料', reading: 'ねんりょう', meaning: 'fuel / combustible material' },
      { word: '燃焼', reading: 'ねんしょう', meaning: 'combustion / burning' },
      { word: '燃える', reading: 'もえる', meaning: 'to burn / blaze / be on fire' },
    ],
    strokeCount: 16, level: 'N2', radical: '火',
  },
  {
    id: 'n2k112', kanji: '能', readings: { on: ['ノウ'], kun: [] },
    meaning: 'ability / talent / function / Noh theatre',
    examples: [
      { word: '可能', reading: 'かのう', meaning: 'possible / practicable / feasible' },
      { word: '能力', reading: 'のうりょく', meaning: 'ability / capability / capacity' },
      { word: '機能', reading: 'きのう', meaning: 'function / feature / performance' },
    ],
    strokeCount: 10, level: 'N2', radical: '月',
  },
  {
    id: 'n2k113', kanji: '配', readings: { on: ['ハイ'], kun: ['くば'] },
    meaning: 'distribute / spouse / worry / pair / ratio',
    examples: [
      { word: '配達', reading: 'はいたつ', meaning: 'delivery / distribution' },
      { word: '心配', reading: 'しんぱい', meaning: 'worry / concern / anxiety' },
      { word: '配る', reading: 'くばる', meaning: 'to distribute / hand out / pay attention' },
    ],
    strokeCount: 10, level: 'N2', radical: '酉',
  },
  {
    id: 'n2k114', kanji: '派', readings: { on: ['ハ'], kun: [] },
    meaning: 'faction / school / dispatch / style / splendid',
    examples: [
      { word: '派遣', reading: 'はけん', meaning: 'dispatch / sending / deployment' },
      { word: '立派', reading: 'りっぱ', meaning: 'splendid / fine / respectable' },
      { word: '派閥', reading: 'はばつ', meaning: 'faction / clique / political group' },
    ],
    strokeCount: 9, level: 'N2', radical: '水',
  },
  {
    id: 'n2k115', kanji: '費', readings: { on: ['ヒ'], kun: ['つい'] },
    meaning: 'expense / cost / spend / use up',
    examples: [
      { word: '費用', reading: 'ひよう', meaning: 'cost / expense / expenditure' },
      { word: '消費', reading: 'しょうひ', meaning: 'consumption / expenditure' },
      { word: '費やす', reading: 'ついやす', meaning: 'to spend / use up / devote' },
    ],
    strokeCount: 12, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k116', kanji: '評', readings: { on: ['ヒョウ'], kun: [] },
    meaning: 'evaluate / criticism / comment / reputation',
    examples: [
      { word: '評価', reading: 'ひょうか', meaning: 'evaluation / assessment / appraisal' },
      { word: '批評', reading: 'ひひょう', meaning: 'criticism / critique / review' },
      { word: '評判', reading: 'ひょうばん', meaning: 'reputation / fame / popularity' },
    ],
    strokeCount: 12, level: 'N2', radical: '言',
  },
  {
    id: 'n2k117', kanji: '貧', readings: { on: ['ヒン', 'ビン'], kun: ['まず'] },
    meaning: 'poor / poverty / destitute / needy',
    examples: [
      { word: '貧困', reading: 'ひんこん', meaning: 'poverty / destitution / hardship' },
      { word: '貧乏', reading: 'びんぼう', meaning: 'poor / poverty-stricken' },
      { word: '貧しい', reading: 'まずしい', meaning: 'poor / needy / destitute' },
    ],
    strokeCount: 11, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k118', kanji: '布', readings: { on: ['フ'], kun: ['ぬの'] },
    meaning: 'cloth / spread / distribute / declare',
    examples: [
      { word: '配布', reading: 'はいふ', meaning: 'distribution / handing out' },
      { word: '布団', reading: 'ふとん', meaning: 'futon / bedding / mattress' },
      { word: '公布', reading: 'こうふ', meaning: 'promulgation / official announcement' },
    ],
    strokeCount: 5, level: 'N2', radical: '巾',
  },
  {
    id: 'n2k119', kanji: '仏', readings: { on: ['ブツ', 'フツ'], kun: ['ほとけ'] },
    meaning: 'Buddha / Buddhism / France / the departed',
    examples: [
      { word: '仏教', reading: 'ぶっきょう', meaning: 'Buddhism' },
      { word: '仏像', reading: 'ぶつぞう', meaning: 'Buddhist statue / image of Buddha' },
      { word: '仏壇', reading: 'ぶつだん', meaning: 'Buddhist altar / household shrine' },
    ],
    strokeCount: 4, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k120', kanji: '望', readings: { on: ['ボウ', 'モウ'], kun: ['のぞ'] },
    meaning: 'hope / wish / desire / look toward',
    examples: [
      { word: '希望', reading: 'きぼう', meaning: 'hope / wish / aspiration' },
      { word: '失望', reading: 'しつぼう', meaning: 'disappointment / despair / disillusionment' },
      { word: '望む', reading: 'のぞむ', meaning: 'to desire / hope / wish for' },
    ],
    strokeCount: 11, level: 'N2', radical: '月',
  },
  {
    id: 'n2k121', kanji: '防', readings: { on: ['ボウ'], kun: ['ふせ'] },
    meaning: 'defend / prevent / protect / guard',
    examples: [
      { word: '予防', reading: 'よぼう', meaning: 'prevention / protection / precaution' },
      { word: '防止', reading: 'ぼうし', meaning: 'prevention / deterrence' },
      { word: '防ぐ', reading: 'ふせぐ', meaning: 'to prevent / protect / defend against' },
    ],
    strokeCount: 7, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k122', kanji: '忘', readings: { on: ['ボウ'], kun: ['わす'] },
    meaning: 'forget / overlook / neglect',
    examples: [
      { word: '忘年会', reading: 'ぼうねんかい', meaning: 'year-end party / forget-the-year party' },
      { word: '物忘れ', reading: 'ものわすれ', meaning: 'forgetfulness / absent-mindedness' },
      { word: '忘れる', reading: 'わすれる', meaning: 'to forget / leave behind / overlook' },
    ],
    strokeCount: 7, level: 'N2', radical: '心',
  },
  {
    id: 'n2k123', kanji: '枚', readings: { on: ['マイ'], kun: [] },
    meaning: 'counter for flat objects / sheet / piece',
    examples: [
      { word: '一枚', reading: 'いちまい', meaning: 'one sheet / one piece / one slice' },
      { word: '枚数', reading: 'まいすう', meaning: 'number of sheets / number of pieces' },
      { word: '何枚', reading: 'なんまい', meaning: 'how many sheets / how many pieces' },
    ],
    strokeCount: 8, level: 'N2', radical: '木',
  },
  {
    id: 'n2k124', kanji: '務', readings: { on: ['ム'], kun: ['つと'] },
    meaning: 'task / duty / serve / work / business',
    examples: [
      { word: '義務', reading: 'ぎむ', meaning: 'duty / obligation / responsibility' },
      { word: '業務', reading: 'ぎょうむ', meaning: 'business / work / operations' },
      { word: '務める', reading: 'つとめる', meaning: 'to serve / work / fill a role' },
    ],
    strokeCount: 11, level: 'N2', radical: '力',
  },
  {
    id: 'n2k125', kanji: '免', readings: { on: ['メン'], kun: ['まぬか'] },
    meaning: 'exempt / license / escape / avoid / dismiss',
    examples: [
      { word: '免許', reading: 'めんきょ', meaning: 'license / permit / certificate' },
      { word: '免税', reading: 'めんぜい', meaning: 'tax exemption / duty-free' },
      { word: '免れる', reading: 'まぬかれる', meaning: 'to escape / be exempt / avoid' },
    ],
    strokeCount: 8, level: 'N2', radical: '儿',
  },
  {
    id: 'n2k126', kanji: '面', readings: { on: ['メン'], kun: ['おも', 'おもて', 'つら'] },
    meaning: 'face / surface / mask / aspect / scene',
    examples: [
      { word: '場面', reading: 'ばめん', meaning: 'scene / setting / situation' },
      { word: '面接', reading: 'めんせつ', meaning: 'interview / face-to-face meeting' },
      { word: '表面', reading: 'ひょうめん', meaning: 'surface / face / outside' },
    ],
    strokeCount: 9, level: 'N2', radical: '面',
  },
  {
    id: 'n2k127', kanji: '訳', readings: { on: ['ヤク'], kun: ['わけ'] },
    meaning: 'translate / reason / meaning / circumstances',
    examples: [
      { word: '翻訳', reading: 'ほんやく', meaning: 'translation / interpretation' },
      { word: '言い訳', reading: 'いいわけ', meaning: 'excuse / justification / explanation' },
      { word: '訳す', reading: 'やくす', meaning: 'to translate / interpret / render' },
    ],
    strokeCount: 11, level: 'N2', radical: '言',
  },
  {
    id: 'n2k128', kanji: '役', readings: { on: ['ヤク', 'エキ'], kun: [] },
    meaning: 'role / service / use / duty / battle',
    examples: [
      { word: '役割', reading: 'やくわり', meaning: 'role / function / part' },
      { word: '役に立つ', reading: 'やくにたつ', meaning: 'to be useful / serve a purpose' },
      { word: '主役', reading: 'しゅやく', meaning: 'leading role / protagonist / star' },
    ],
    strokeCount: 7, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k129', kanji: '優', readings: { on: ['ユウ'], kun: ['やさ', 'すぐ'] },
    meaning: 'gentle / superior / actor / excellent / kind',
    examples: [
      { word: '優秀', reading: 'ゆうしゅう', meaning: 'excellent / outstanding / brilliant' },
      { word: '優しい', reading: 'やさしい', meaning: 'gentle / kind / tender / easy' },
      { word: '俳優', reading: 'はいゆう', meaning: 'actor / actress / performer' },
    ],
    strokeCount: 17, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k130', kanji: '利', readings: { on: ['リ'], kun: ['き'] },
    meaning: 'profit / benefit / advantage / useful / sharp',
    examples: [
      { word: '利益', reading: 'りえき', meaning: 'profit / benefit / gain / advantage' },
      { word: '便利', reading: 'べんり', meaning: 'convenient / handy / useful' },
      { word: '利用', reading: 'りよう', meaning: 'use / utilisation / taking advantage of' },
    ],
    strokeCount: 7, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k131', kanji: '率', readings: { on: ['リツ', 'ソツ'], kun: ['ひき'] },
    meaning: 'rate / ratio / percentage / lead / follow',
    examples: [
      { word: '効率', reading: 'こうりつ', meaning: 'efficiency / effectiveness' },
      { word: '確率', reading: 'かくりつ', meaning: 'probability / likelihood' },
      { word: '率いる', reading: 'ひきいる', meaning: 'to lead / command / head' },
    ],
    strokeCount: 11, level: 'N2', radical: '玄',
  },
  {
    id: 'n2k132', kanji: '律', readings: { on: ['リツ', 'リチ'], kun: [] },
    meaning: 'law / regulation / rhythm / discipline',
    examples: [
      { word: '法律', reading: 'ほうりつ', meaning: 'law / legislation / statute' },
      { word: '規律', reading: 'きりつ', meaning: 'discipline / order / rules' },
      { word: '一律', reading: 'いちりつ', meaning: 'uniform / flat / across-the-board' },
    ],
    strokeCount: 9, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k133', kanji: '了', readings: { on: ['リョウ'], kun: [] },
    meaning: 'complete / finish / end / understand',
    examples: [
      { word: '了解', reading: 'りょうかい', meaning: 'understood / roger / comprehension' },
      { word: '完了', reading: 'かんりょう', meaning: 'completion / accomplishment / finished' },
      { word: '終了', reading: 'しゅうりょう', meaning: 'end / termination / conclusion' },
    ],
    strokeCount: 2, level: 'N2', radical: '了',
  },
  {
    id: 'n2k134', kanji: '論', readings: { on: ['ロン'], kun: [] },
    meaning: 'theory / discuss / argue / reason / opinion',
    examples: [
      { word: '議論', reading: 'ぎろん', meaning: 'debate / argument / discussion' },
      { word: '理論', reading: 'りろん', meaning: 'theory / theoretical basis' },
      { word: '結論', reading: 'けつろん', meaning: 'conclusion / verdict / finding' },
    ],
    strokeCount: 15, level: 'N2', radical: '言',
  },
  {
    id: 'n2k135', kanji: '冒', readings: { on: ['ボウ'], kun: ['おか'] },
    meaning: 'risk / venture / brave / offend / head',
    examples: [
      { word: '冒険', reading: 'ぼうけん', meaning: 'adventure / risk / venture' },
      { word: '冒頭', reading: 'ぼうとう', meaning: 'beginning / opening / preamble' },
      { word: '冒す', reading: 'おかす', meaning: 'to risk / brave / violate / offend' },
    ],
    strokeCount: 9, level: 'N2', radical: '日',
  },
  {
    id: 'n2k136', kanji: '貿', readings: { on: ['ボウ'], kun: [] },
    meaning: 'trade / exchange goods / barter',
    examples: [
      { word: '貿易', reading: 'ぼうえき', meaning: 'trade / commerce / import and export' },
      { word: '貿易赤字', reading: 'ぼうえきあかじ', meaning: 'trade deficit' },
      { word: '自由貿易', reading: 'じゆうぼうえき', meaning: 'free trade' },
    ],
    strokeCount: 12, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k137', kanji: '暴', readings: { on: ['ボウ', 'バク'], kun: ['あば'] },
    meaning: 'violent / rough / expose / sudden',
    examples: [
      { word: '暴力', reading: 'ぼうりょく', meaning: 'violence / force / brutality' },
      { word: '暴落', reading: 'ぼうらく', meaning: 'crash / sharp decline / plunge' },
      { word: '暴れる', reading: 'あばれる', meaning: 'to rampage / act violently / rage' },
    ],
    strokeCount: 15, level: 'N2', radical: '日',
  },
  {
    id: 'n2k138', kanji: '宝', readings: { on: ['ホウ'], kun: ['たから'] },
    meaning: 'treasure / precious / valuable',
    examples: [
      { word: '宝物', reading: 'たからもの', meaning: 'treasure / prized possession' },
      { word: '国宝', reading: 'こくほう', meaning: 'national treasure' },
      { word: '宝くじ', reading: 'たからくじ', meaning: 'lottery ticket' },
    ],
    strokeCount: 8, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k139', kanji: '豊', readings: { on: ['ホウ'], kun: ['ゆた'] },
    meaning: 'abundant / rich / fertile / plentiful',
    examples: [
      { word: '豊か', reading: 'ゆたか', meaning: 'rich / abundant / plentiful / fertile' },
      { word: '豊富', reading: 'ほうふ', meaning: 'abundant / plentiful / rich in' },
      { word: '豊作', reading: 'ほうさく', meaning: 'abundant harvest / bumper crop' },
    ],
    strokeCount: 13, level: 'N2', radical: '豆',
  },
  {
    id: 'n2k140', kanji: '訪', readings: { on: ['ホウ'], kun: ['おとず', 'たず'] },
    meaning: 'visit / call on / pay a visit',
    examples: [
      { word: '訪問', reading: 'ほうもん', meaning: 'visit / call on' },
      { word: '来訪', reading: 'らいほう', meaning: 'visit / call / coming to see' },
      { word: '訪れる', reading: 'おとずれる', meaning: 'to visit / come / arrive' },
    ],
    strokeCount: 11, level: 'N2', radical: '言',
  },
  {
    id: 'n2k141', kanji: '純', readings: { on: ['ジュン'], kun: [] },
    meaning: 'pure / simple / genuine / innocent',
    examples: [
      { word: '純粋', reading: 'じゅんすい', meaning: 'pure / genuine / unadulterated' },
      { word: '単純', reading: 'たんじゅん', meaning: 'simple / uncomplicated / naive' },
      { word: '純正', reading: 'じゅんせい', meaning: 'genuine / authentic / legitimate' },
    ],
    strokeCount: 10, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k142', kanji: '準', readings: { on: ['ジュン'], kun: [] },
    meaning: 'standard / level / semi- / conform / imitate',
    examples: [
      { word: '基準', reading: 'きじゅん', meaning: 'standard / criterion / reference' },
      { word: '準備', reading: 'じゅんび', meaning: 'preparation / arrangement / readiness' },
      { word: '水準', reading: 'すいじゅん', meaning: 'level / standard / grade' },
    ],
    strokeCount: 13, level: 'N2', radical: '水',
  },
  {
    id: 'n2k143', kanji: '詳', readings: { on: ['ショウ'], kun: ['くわ'] },
    meaning: 'detailed / full / minute / know well',
    examples: [
      { word: '詳細', reading: 'しょうさい', meaning: 'details / particulars / specifics' },
      { word: '詳しい', reading: 'くわしい', meaning: 'detailed / familiar with / well-informed' },
      { word: '詳述', reading: 'しょうじゅつ', meaning: 'detailed description / full account' },
    ],
    strokeCount: 13, level: 'N2', radical: '言',
  },
  {
    id: 'n2k144', kanji: '傷', readings: { on: ['ショウ'], kun: ['きず', 'いた'] },
    meaning: 'wound / injury / damage / scar',
    examples: [
      { word: '傷つける', reading: 'きずつける', meaning: 'to hurt / injure / wound / damage' },
      { word: '負傷', reading: 'ふしょう', meaning: 'injury / wound' },
      { word: '傷口', reading: 'きずぐち', meaning: 'wound / cut / opening of a wound' },
    ],
    strokeCount: 13, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k145', kanji: '障', readings: { on: ['ショウ'], kun: ['さわ'] },
    meaning: 'obstacle / hinder / harm / block / impede',
    examples: [
      { word: '障害', reading: 'しょうがい', meaning: 'obstacle / disability / impediment' },
      { word: '支障', reading: 'ししょう', meaning: 'hindrance / obstacle / difficulty' },
      { word: '故障', reading: 'こしょう', meaning: 'breakdown / failure / malfunction' },
    ],
    strokeCount: 14, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k146', kanji: '称', readings: { on: ['ショウ'], kun: ['とな', 'たた'] },
    meaning: 'call / name / title / praise / claim',
    examples: [
      { word: '名称', reading: 'めいしょう', meaning: 'name / designation / title' },
      { word: '総称', reading: 'そうしょう', meaning: 'general term / generic name' },
      { word: '称える', reading: 'たたえる', meaning: 'to praise / extol / admire' },
    ],
    strokeCount: 10, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k147', kanji: '蒸', readings: { on: ['ジョウ'], kun: ['む'] },
    meaning: 'steam / heat / sultry / cook by steaming',
    examples: [
      { word: '蒸気', reading: 'じょうき', meaning: 'steam / vapour' },
      { word: '蒸発', reading: 'じょうはつ', meaning: 'evaporation / vaporisation' },
      { word: '蒸す', reading: 'むす', meaning: 'to steam / be humid / be sultry' },
    ],
    strokeCount: 13, level: 'N2', radical: '艸',
  },
  {
    id: 'n2k148', kanji: '紹', readings: { on: ['ショウ'], kun: [] },
    meaning: 'introduce / inherit / help',
    examples: [
      { word: '紹介', reading: 'しょうかい', meaning: 'introduction / presentation' },
      { word: '自己紹介', reading: 'じこしょうかい', meaning: 'self-introduction' },
      { word: '紹介状', reading: 'しょうかいじょう', meaning: 'letter of introduction' },
    ],
    strokeCount: 11, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k149', kanji: '将', readings: { on: ['ショウ'], kun: ['まさ'] },
    meaning: 'general / leader / soon / about to / commander',
    examples: [
      { word: '将来', reading: 'しょうらい', meaning: 'future / prospects' },
      { word: '将棋', reading: 'しょうぎ', meaning: 'shogi / Japanese chess' },
      { word: '将軍', reading: 'しょうぐん', meaning: 'shogun / military commander' },
    ],
    strokeCount: 10, level: 'N2', radical: '寸',
  },
  {
    id: 'n2k150', kanji: '賞', readings: { on: ['ショウ'], kun: [] },
    meaning: 'prize / reward / praise / appreciate / enjoy',
    examples: [
      { word: '賞金', reading: 'しょうきん', meaning: 'prize money / reward' },
      { word: '受賞', reading: 'じゅしょう', meaning: 'winning a prize / receiving an award' },
      { word: '鑑賞', reading: 'かんしょう', meaning: 'appreciation / enjoyment (of art)' },
    ],
    strokeCount: 15, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k151', kanji: '商', readings: { on: ['ショウ'], kun: ['あきな'] },
    meaning: 'trade / commerce / merchant / discuss',
    examples: [
      { word: '商業', reading: 'しょうぎょう', meaning: 'commerce / trade / business' },
      { word: '商品', reading: 'しょうひん', meaning: 'goods / merchandise / product' },
      { word: '商う', reading: 'あきなう', meaning: 'to trade / deal in / sell' },
    ],
    strokeCount: 11, level: 'N2', radical: '口',
  },
  {
    id: 'n2k152', kanji: '授', readings: { on: ['ジュ'], kun: ['さず'] },
    meaning: 'grant / bestow / teach / award / instruct',
    examples: [
      { word: '教授', reading: 'きょうじゅ', meaning: 'professor / teaching' },
      { word: '授業', reading: 'じゅぎょう', meaning: 'class / lesson / lecture' },
      { word: '授ける', reading: 'さずける', meaning: 'to grant / bestow / award' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k153', kanji: '述', readings: { on: ['ジュツ'], kun: ['の'] },
    meaning: 'mention / state / speak / relate / describe',
    examples: [
      { word: '述べる', reading: 'のべる', meaning: 'to state / mention / express / describe' },
      { word: '記述', reading: 'きじゅつ', meaning: 'description / notation / writing down' },
      { word: '陳述', reading: 'ちんじゅつ', meaning: 'statement / declaration / testimony' },
    ],
    strokeCount: 8, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k154', kanji: '慎', readings: { on: ['シン'], kun: ['つつし'] },
    meaning: 'careful / discreet / cautious / prudent',
    examples: [
      { word: '慎重', reading: 'しんちょう', meaning: 'careful / cautious / discreet' },
      { word: '謹慎', reading: 'きんしん', meaning: 'house arrest / restraint / confinement' },
      { word: '慎む', reading: 'つつしむ', meaning: 'to be careful / restrain / refrain' },
    ],
    strokeCount: 13, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k155', kanji: '審', readings: { on: ['シン'], kun: [] },
    meaning: 'judge / examine carefully / deliberate',
    examples: [
      { word: '審査', reading: 'しんさ', meaning: 'examination / screening / judging' },
      { word: '審判', reading: 'しんぱん', meaning: 'referee / judge / umpire / judgment' },
      { word: '陪審', reading: 'ばいしん', meaning: 'jury / panel of judges' },
    ],
    strokeCount: 15, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k156', kanji: '触', readings: { on: ['ショク'], kun: ['ふ', 'さわ'] },
    meaning: 'touch / feel / contact / offend / sense',
    examples: [
      { word: '接触', reading: 'せっしょく', meaning: 'contact / touch / connection' },
      { word: '感触', reading: 'かんしょく', meaning: 'touch / feel / texture' },
      { word: '触れる', reading: 'ふれる', meaning: 'to touch / come into contact / mention' },
    ],
    strokeCount: 13, level: 'N2', radical: '角',
  },
  {
    id: 'n2k157', kanji: '績', readings: { on: ['セキ'], kun: [] },
    meaning: 'achievement / results / spin / performance',
    examples: [
      { word: '成績', reading: 'せいせき', meaning: 'results / grades / performance' },
      { word: '業績', reading: 'ぎょうせき', meaning: 'achievement / performance / results' },
      { word: '実績', reading: 'じっせき', meaning: 'track record / actual results' },
    ],
    strokeCount: 17, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k158', kanji: '飾', readings: { on: ['ショク'], kun: ['かざ'] },
    meaning: 'decorate / ornament / adorn / dress up',
    examples: [
      { word: '装飾', reading: 'そうしょく', meaning: 'decoration / ornament / embellishment' },
      { word: '飾る', reading: 'かざる', meaning: 'to decorate / adorn / display' },
      { word: '修飾', reading: 'しゅうしょく', meaning: 'modification / qualification / decoration' },
    ],
    strokeCount: 13, level: 'N2', radical: '食',
  },
  {
    id: 'n2k159', kanji: '判', readings: { on: ['ハン', 'バン'], kun: ['わか'] },
    meaning: 'judge / decide / stamp / distinguish / size',
    examples: [
      { word: '判断', reading: 'はんだん', meaning: 'judgment / decision / conclusion' },
      { word: '裁判', reading: 'さいばん', meaning: 'trial / judgment / court case' },
      { word: '判明', reading: 'はんめい', meaning: 'to become clear / be confirmed' },
    ],
    strokeCount: 7, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k160', kanji: '版', readings: { on: ['ハン', 'バン'], kun: [] },
    meaning: 'printing block / edition / version / publish',
    examples: [
      { word: '出版', reading: 'しゅっぱん', meaning: 'publishing / publication' },
      { word: '版権', reading: 'はんけん', meaning: 'copyright / publishing rights' },
      { word: '初版', reading: 'しょはん', meaning: 'first edition / first printing' },
    ],
    strokeCount: 8, level: 'N2', radical: '片',
  },

  {
    id: 'n2k161', kanji: '握', readings: { on: ['アク'], kun: ['にぎ'] },
    meaning: 'grip / grasp / hold / seize',
    examples: [
      { word: '握手', reading: 'あくしゅ', meaning: 'handshake' },
      { word: '把握', reading: 'はあく', meaning: 'grasp / comprehension / understanding' },
      { word: '握る', reading: 'にぎる', meaning: 'to grip / grasp / hold' },
    ],
    strokeCount: 12, level: 'N2', radical: '手',
  },
  {
    id: 'n2k162', kanji: '暖', readings: { on: ['ダン'], kun: ['あたた'] },
    meaning: 'warm / mild / genial',
    examples: [
      { word: '暖房', reading: 'だんぼう', meaning: 'heating / central heating' },
      { word: '温暖', reading: 'おんだん', meaning: 'warm / mild / temperate' },
      { word: '暖かい', reading: 'あたたかい', meaning: 'warm / mild / genial' },
    ],
    strokeCount: 13, level: 'N2', radical: '日',
  },
  {
    id: 'n2k163', kanji: '痛', readings: { on: ['ツウ'], kun: ['いた'] },
    meaning: 'pain / ache / sore / suffer',
    examples: [
      { word: '頭痛', reading: 'ずつう', meaning: 'headache' },
      { word: '苦痛', reading: 'くつう', meaning: 'pain / agony / suffering' },
      { word: '痛い', reading: 'いたい', meaning: 'painful / sore / aching' },
    ],
    strokeCount: 12, level: 'N2', radical: '疒',
  },
  {
    id: 'n2k164', kanji: '典', readings: { on: ['テン'], kun: [] },
    meaning: 'ceremony / law / reference / canon',
    examples: [
      { word: '古典', reading: 'こてん', meaning: 'classic / classical literature' },
      { word: '典型', reading: 'てんけい', meaning: 'typical example / model case' },
      { word: '辞典', reading: 'じてん', meaning: 'dictionary / lexicon' },
    ],
    strokeCount: 8, level: 'N2', radical: '八',
  },
  {
    id: 'n2k165', kanji: '展', readings: { on: ['テン'], kun: ['の'] },
    meaning: 'display / unfold / develop / expand',
    examples: [
      { word: '展示', reading: 'てんじ', meaning: 'exhibition / display' },
      { word: '発展', reading: 'はってん', meaning: 'development / growth / expansion' },
      { word: '展開', reading: 'てんかい', meaning: 'development / unfolding / expansion' },
    ],
    strokeCount: 10, level: 'N2', radical: '尸',
  },
  {
    id: 'n2k166', kanji: '努', readings: { on: ['ド'], kun: ['つと'] },
    meaning: 'effort / exertion / endeavour / strive',
    examples: [
      { word: '努力', reading: 'どりょく', meaning: 'effort / endeavour / hard work' },
      { word: '努める', reading: 'つとめる', meaning: 'to strive / endeavour / make an effort' },
      { word: '努力家', reading: 'どりょくか', meaning: 'hard worker / diligent person' },
    ],
    strokeCount: 7, level: 'N2', radical: '力',
  },
  {
    id: 'n2k167', kanji: '怒', readings: { on: ['ド'], kun: ['おこ', 'いか'] },
    meaning: 'anger / rage / fury / be enraged',
    examples: [
      { word: '怒鳴る', reading: 'どなる', meaning: 'to shout / yell / bellow' },
      { word: '激怒', reading: 'げきど', meaning: 'fury / rage / violent anger' },
      { word: '怒る', reading: 'おこる', meaning: 'to get angry / be enraged' },
    ],
    strokeCount: 9, level: 'N2', radical: '心',
  },
  {
    id: 'n2k168', kanji: '任', readings: { on: ['ニン'], kun: ['まか'] },
    meaning: 'responsibility / duty / entrust / appoint',
    examples: [
      { word: '責任', reading: 'せきにん', meaning: 'responsibility / duty / liability' },
      { word: '任務', reading: 'にんむ', meaning: 'mission / assignment / duty' },
      { word: '任せる', reading: 'まかせる', meaning: 'to entrust / leave to / rely on' },
    ],
    strokeCount: 6, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k169', kanji: '認', readings: { on: ['ニン'], kun: ['みと'] },
    meaning: 'recognize / acknowledge / approve / perceive',
    examples: [
      { word: '認識', reading: 'にんしき', meaning: 'recognition / awareness / understanding' },
      { word: '確認', reading: 'かくにん', meaning: 'confirmation / verification' },
      { word: '認める', reading: 'みとめる', meaning: 'to recognize / acknowledge / admit' },
    ],
    strokeCount: 14, level: 'N2', radical: '言',
  },
  {
    id: 'n2k170', kanji: '念', readings: { on: ['ネン'], kun: [] },
    meaning: 'thought / wish / concern / attention',
    examples: [
      { word: '残念', reading: 'ざんねん', meaning: 'regrettable / unfortunate / too bad' },
      { word: '念頭', reading: 'ねんとう', meaning: 'mind / attention / thought' },
      { word: '記念', reading: 'きねん', meaning: 'commemoration / memory / souvenir' },
    ],
    strokeCount: 8, level: 'N2', radical: '心',
  },
  {
    id: 'n2k171', kanji: '拝', readings: { on: ['ハイ'], kun: ['おが'] },
    meaning: 'worship / bow / humbly receive / venerate',
    examples: [
      { word: '拝見', reading: 'はいけん', meaning: 'seeing / viewing (humble)' },
      { word: '崇拝', reading: 'すうはい', meaning: 'worship / adoration / reverence' },
      { word: '拝む', reading: 'おがむ', meaning: 'to worship / pray / beg humbly' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k172', kanji: '廃', readings: { on: ['ハイ'], kun: ['すた'] },
    meaning: 'abolish / obsolete / scrap / discard',
    examples: [
      { word: '廃止', reading: 'はいし', meaning: 'abolition / discontinuation' },
      { word: '廃棄', reading: 'はいき', meaning: 'disposal / abandonment / scrapping' },
      { word: '廃れる', reading: 'すたれる', meaning: 'to go out of use / become obsolete' },
    ],
    strokeCount: 12, level: 'N2', radical: '广',
  },
  {
    id: 'n2k173', kanji: '敗', readings: { on: ['ハイ'], kun: ['やぶ'] },
    meaning: 'defeat / failure / ruin / lose',
    examples: [
      { word: '失敗', reading: 'しっぱい', meaning: 'failure / mistake / blunder' },
      { word: '敗北', reading: 'はいぼく', meaning: 'defeat / loss / setback' },
      { word: '敗れる', reading: 'やぶれる', meaning: 'to be defeated / lose / fail' },
    ],
    strokeCount: 11, level: 'N2', radical: '攴',
  },
  {
    id: 'n2k174', kanji: '般', readings: { on: ['ハン'], kun: [] },
    meaning: 'general / carry / sort / class',
    examples: [
      { word: '一般', reading: 'いっぱん', meaning: 'general / common / average' },
      { word: '全般', reading: 'ぜんぱん', meaning: 'general / overall / across the board' },
      { word: '般的', reading: 'はんてき', meaning: 'general / typical / common (used in 一般的)' },
    ],
    strokeCount: 10, level: 'N2', radical: '舟',
  },
  {
    id: 'n2k175', kanji: '犯', readings: { on: ['ハン'], kun: ['おか'] },
    meaning: 'crime / offend / violate / sin',
    examples: [
      { word: '犯罪', reading: 'はんざい', meaning: 'crime / offence / criminal act' },
      { word: '犯人', reading: 'はんにん', meaning: 'criminal / culprit / offender' },
      { word: '犯す', reading: 'おかす', meaning: 'to commit / violate / offend' },
    ],
    strokeCount: 5, level: 'N2', radical: '犬',
  },
  {
    id: 'n2k176', kanji: '被', readings: { on: ['ヒ'], kun: ['こうむ', 'かぶ'] },
    meaning: 'suffer / cover / receive / passive marker',
    examples: [
      { word: '被害', reading: 'ひがい', meaning: 'damage / harm / injury / loss' },
      { word: '被告', reading: 'ひこく', meaning: 'defendant / the accused' },
      { word: '被る', reading: 'かぶる', meaning: 'to put on (head) / suffer / receive' },
    ],
    strokeCount: 10, level: 'N2', radical: '衣',
  },
  {
    id: 'n2k177', kanji: '秘', readings: { on: ['ヒ'], kun: ['ひそ'] },
    meaning: 'secret / mystery / conceal / hide',
    examples: [
      { word: '秘密', reading: 'ひみつ', meaning: 'secret / mystery / private matter' },
      { word: '神秘', reading: 'しんぴ', meaning: 'mystery / mystique / miracle' },
      { word: '秘かに', reading: 'ひそかに', meaning: 'secretly / stealthily / in private' },
    ],
    strokeCount: 10, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k178', kanji: '微', readings: { on: ['ビ'], kun: [] },
    meaning: 'minute / slight / subtle / delicate',
    examples: [
      { word: '微妙', reading: 'びみょう', meaning: 'subtle / delicate / tricky' },
      { word: '微笑む', reading: 'ほほえむ', meaning: 'to smile / grin' },
      { word: '微量', reading: 'びりょう', meaning: 'trace / minute quantity' },
    ],
    strokeCount: 13, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k179', kanji: '標', readings: { on: ['ヒョウ'], kun: [] },
    meaning: 'mark / sign / target / aim / symbol',
    examples: [
      { word: '目標', reading: 'もくひょう', meaning: 'goal / target / objective' },
      { word: '標準', reading: 'ひょうじゅん', meaning: 'standard / norm / average level' },
      { word: '標識', reading: 'ひょうしき', meaning: 'sign / mark / signal' },
    ],
    strokeCount: 15, level: 'N2', radical: '木',
  },
  {
    id: 'n2k180', kanji: '票', readings: { on: ['ヒョウ'], kun: [] },
    meaning: 'ballot / vote / label / ticket / slip',
    examples: [
      { word: '投票', reading: 'とうひょう', meaning: 'voting / casting a ballot' },
      { word: '得票', reading: 'とくひょう', meaning: 'votes received / vote-getting' },
      { word: '伝票', reading: 'でんぴょう', meaning: 'voucher / slip / receipt' },
    ],
    strokeCount: 11, level: 'N2', radical: '示',
  },
  {
    id: 'n2k181', kanji: '描', readings: { on: ['ビョウ'], kun: ['えが', 'か'] },
    meaning: 'draw / sketch / depict / portray',
    examples: [
      { word: '描写', reading: 'びょうしゃ', meaning: 'depiction / description / portrayal' },
      { word: '素描', reading: 'そびょう', meaning: 'sketch / rough drawing' },
      { word: '描く', reading: 'えがく', meaning: 'to draw / depict / paint / describe' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k182', kanji: '浮', readings: { on: ['フ'], kun: ['う', 'うか', 'うき'] },
    meaning: 'float / rise / be unsteady / emerge',
    examples: [
      { word: '浮上', reading: 'ふじょう', meaning: 'rising / emerging / surfacing' },
      { word: '浮力', reading: 'ふりょく', meaning: 'buoyancy / floating force' },
      { word: '浮かぶ', reading: 'うかぶ', meaning: 'to float / rise / come to mind' },
    ],
    strokeCount: 10, level: 'N2', radical: '水',
  },
  {
    id: 'n2k183', kanji: '普', readings: { on: ['フ'], kun: ['あまね'] },
    meaning: 'general / ordinary / universal / widespread',
    examples: [
      { word: '普通', reading: 'ふつう', meaning: 'ordinary / usual / normal / common' },
      { word: '普及', reading: 'ふきゅう', meaning: 'spread / diffusion / popularisation' },
      { word: '普段', reading: 'ふだん', meaning: 'usual / normal / everyday / habitual' },
    ],
    strokeCount: 12, level: 'N2', radical: '日',
  },
  {
    id: 'n2k184', kanji: '府', readings: { on: ['フ'], kun: [] },
    meaning: 'prefecture / government / urban / storehouse',
    examples: [
      { word: '政府', reading: 'せいふ', meaning: 'government / administration' },
      { word: '大阪府', reading: 'おおさかふ', meaning: 'Osaka Prefecture' },
      { word: '府立', reading: 'ふりつ', meaning: 'prefectural / established by prefecture' },
    ],
    strokeCount: 8, level: 'N2', radical: '广',
  },
  {
    id: 'n2k185', kanji: '怖', readings: { on: ['フ'], kun: ['こわ'] },
    meaning: 'fear / dread / frightening / scary',
    examples: [
      { word: '恐怖', reading: 'きょうふ', meaning: 'fear / terror / dread / horror' },
      { word: '怖い', reading: 'こわい', meaning: 'scary / frightening / horrible' },
      { word: '怖がる', reading: 'こわがる', meaning: 'to be afraid / fear / dread' },
    ],
    strokeCount: 8, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k186', kanji: '舞', readings: { on: ['ブ'], kun: ['ま'] },
    meaning: 'dance / flutter / whirl / perform',
    examples: [
      { word: '舞台', reading: 'ぶたい', meaning: 'stage / scene / setting' },
      { word: '歌舞伎', reading: 'かぶき', meaning: 'Kabuki (traditional Japanese theatre)' },
      { word: '舞う', reading: 'まう', meaning: 'to dance / flutter / soar' },
    ],
    strokeCount: 15, level: 'N2', radical: '舛',
  },
  {
    id: 'n2k187', kanji: '武', readings: { on: ['ブ', 'ム'], kun: ['たけ'] },
    meaning: 'military / warrior / brave / martial',
    examples: [
      { word: '武器', reading: 'ぶき', meaning: 'weapon / arms / tool' },
      { word: '武士', reading: 'ぶし', meaning: 'warrior / samurai' },
      { word: '武道', reading: 'ぶどう', meaning: 'martial arts / budo' },
    ],
    strokeCount: 8, level: 'N2', radical: '止',
  },
  {
    id: 'n2k188', kanji: '奮', readings: { on: ['フン'], kun: ['ふる'] },
    meaning: 'be excited / arouse / stir up / be spirited',
    examples: [
      { word: '興奮', reading: 'こうふん', meaning: 'excitement / agitation / enthusiasm' },
      { word: '奮闘', reading: 'ふんとう', meaning: 'hard fighting / strenuous effort' },
      { word: '奮う', reading: 'ふるう', meaning: 'to be roused / be stirred / exert oneself' },
    ],
    strokeCount: 16, level: 'N2', radical: '大',
  },
  {
    id: 'n2k189', kanji: '粉', readings: { on: ['フン'], kun: ['こな', 'こ'] },
    meaning: 'powder / flour / dust / crush into powder',
    examples: [
      { word: '粉末', reading: 'ふんまつ', meaning: 'fine powder / powdered form' },
      { word: '花粉', reading: 'かふん', meaning: 'pollen / flower dust' },
      { word: '小麦粉', reading: 'こむぎこ', meaning: 'wheat flour' },
    ],
    strokeCount: 10, level: 'N2', radical: '米',
  },
  {
    id: 'n2k190', kanji: '偏', readings: { on: ['ヘン'], kun: ['かたよ'] },
    meaning: 'partial / lean / one-sided / side radical',
    examples: [
      { word: '偏見', reading: 'へんけん', meaning: 'prejudice / bias / preconception' },
      { word: '偏差', reading: 'へんさ', meaning: 'deviation / variance' },
      { word: '偏る', reading: 'かたよる', meaning: 'to be biased / be skewed / lean' },
    ],
    strokeCount: 11, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k191', kanji: '壁', readings: { on: ['ヘキ'], kun: ['かべ'] },
    meaning: 'wall / barrier / obstacle / cliff',
    examples: [
      { word: '障壁', reading: 'しょうへき', meaning: 'barrier / obstacle / wall' },
      { word: '岩壁', reading: 'がんぺき', meaning: 'rock face / cliff / crag' },
      { word: '壁紙', reading: 'かべかみ', meaning: 'wallpaper / wall covering' },
    ],
    strokeCount: 16, level: 'N2', radical: '土',
  },
  {
    id: 'n2k192', kanji: '膨', readings: { on: ['ボウ'], kun: ['ふく'] },
    meaning: 'swell / expand / bulge / inflate',
    examples: [
      { word: '膨大', reading: 'ぼうだい', meaning: 'enormous / vast / massive' },
      { word: '膨張', reading: 'ぼうちょう', meaning: 'expansion / inflation / swelling' },
      { word: '膨らむ', reading: 'ふくらむ', meaning: 'to swell / expand / bulge out' },
    ],
    strokeCount: 16, level: 'N2', radical: '月',
  },
  {
    id: 'n2k193', kanji: '棒', readings: { on: ['ボウ'], kun: [] },
    meaning: 'rod / stick / pole / bar / club',
    examples: [
      { word: '棒読み', reading: 'ぼうよみ', meaning: 'monotone reading / flat delivery' },
      { word: '鉄棒', reading: 'てつぼう', meaning: 'horizontal bar / iron rod' },
      { word: '指揮棒', reading: 'しきぼう', meaning: 'conductor\'s baton' },
    ],
    strokeCount: 12, level: 'N2', radical: '木',
  },
  {
    id: 'n2k194', kanji: '忙', readings: { on: ['ボウ'], kun: ['いそが'] },
    meaning: 'busy / occupied / hurried / hectic',
    examples: [
      { word: '多忙', reading: 'たぼう', meaning: 'very busy / pressed for time' },
      { word: '繁忙期', reading: 'はんぼうき', meaning: 'busy season / peak period' },
      { word: '忙しい', reading: 'いそがしい', meaning: 'busy / occupied / hectic' },
    ],
    strokeCount: 6, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k195', kanji: '没', readings: { on: ['ボツ'], kun: [] },
    meaning: 'sink / die / submerge / be absorbed in',
    examples: [
      { word: '没収', reading: 'ぼっしゅう', meaning: 'confiscation / seizure / forfeiture' },
      { word: '日没', reading: 'にちぼつ', meaning: 'sunset / sundown' },
      { word: '没頭', reading: 'ぼっとう', meaning: 'absorption / immersion / devotion' },
    ],
    strokeCount: 7, level: 'N2', radical: '水',
  },
  {
    id: 'n2k196', kanji: '翻', readings: { on: ['ホン'], kun: ['ひるがえ'] },
    meaning: 'translate / flip over / change / flutter',
    examples: [
      { word: '翻訳', reading: 'ほんやく', meaning: 'translation / interpretation' },
      { word: '翻弄', reading: 'ほんろう', meaning: 'trifling with / making sport of' },
      { word: '翻る', reading: 'ひるがえる', meaning: 'to flip / flutter / wave / reverse' },
    ],
    strokeCount: 18, level: 'N2', radical: '羽',
  },
  {
    id: 'n2k197', kanji: '暮', readings: { on: ['ボ'], kun: ['く'] },
    meaning: 'dusk / evening / live / end of year',
    examples: [
      { word: '夕暮れ', reading: 'ゆうぐれ', meaning: 'dusk / twilight / evening' },
      { word: '歳暮', reading: 'せいぼ', meaning: 'year-end gift / year\'s end' },
      { word: '暮らす', reading: 'くらす', meaning: 'to live / make a living / get along' },
    ],
    strokeCount: 14, level: 'N2', radical: '日',
  },
  {
    id: 'n2k198', kanji: '募', readings: { on: ['ボ'], kun: ['つの'] },
    meaning: 'recruit / invite / raise / collect',
    examples: [
      { word: '募集', reading: 'ぼしゅう', meaning: 'recruitment / solicitation / collection' },
      { word: '応募', reading: 'おうぼ', meaning: 'application / candidacy / subscription' },
      { word: '募る', reading: 'つのる', meaning: 'to recruit / grow / become stronger' },
    ],
    strokeCount: 12, level: 'N2', radical: '力',
  },
  {
    id: 'n2k199', kanji: '妨', readings: { on: ['ボウ'], kun: ['さまた'] },
    meaning: 'obstruct / hinder / interfere / impede',
    examples: [
      { word: '妨害', reading: 'ぼうがい', meaning: 'obstruction / interference / hindrance' },
      { word: '妨げる', reading: 'さまたげる', meaning: 'to obstruct / hinder / impede' },
      { word: '妨げ', reading: 'さまたげ', meaning: 'obstacle / impediment / hindrance' },
    ],
    strokeCount: 7, level: 'N2', radical: '女',
  },
  {
    id: 'n2k200', kanji: '磨', readings: { on: ['マ'], kun: ['みが'] },
    meaning: 'polish / grind / improve / brush',
    examples: [
      { word: '研磨', reading: 'けんま', meaning: 'polishing / grinding / refining' },
      { word: '切磋琢磨', reading: 'せっさたくま', meaning: 'working hard together to improve' },
      { word: '磨く', reading: 'みがく', meaning: 'to polish / brush / refine / improve' },
    ],
    strokeCount: 16, level: 'N2', radical: '石',
  },
  {
    id: 'n2k201', kanji: '幕', readings: { on: ['マク', 'バク'], kun: [] },
    meaning: 'curtain / act / shogunate / scene',
    examples: [
      { word: '幕府', reading: 'ばくふ', meaning: 'shogunate / military government' },
      { word: '幕末', reading: 'ばくまつ', meaning: 'end of the Edo period' },
      { word: '開幕', reading: 'かいまく', meaning: 'opening / raising of the curtain' },
    ],
    strokeCount: 13, level: 'N2', radical: '巾',
  },
  {
    id: 'n2k202', kanji: '慢', readings: { on: ['マン'], kun: [] },
    meaning: 'pride / boast / arrogance / neglect',
    examples: [
      { word: '自慢', reading: 'じまん', meaning: 'pride / boast / bragging' },
      { word: '高慢', reading: 'こうまん', meaning: 'haughty / arrogant / conceited' },
      { word: '怠慢', reading: 'たいまん', meaning: 'negligence / laziness / carelessness' },
    ],
    strokeCount: 14, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k203', kanji: '漫', readings: { on: ['マン'], kun: [] },
    meaning: 'loose / random / comics / manga / aimless',
    examples: [
      { word: '漫画', reading: 'まんが', meaning: 'manga / comic / cartoon' },
      { word: '漫然', reading: 'まんぜん', meaning: 'aimless / vague / random' },
      { word: '漫談', reading: 'まんだん', meaning: 'comic chat / stand-up comedy' },
    ],
    strokeCount: 14, level: 'N2', radical: '水',
  },
  {
    id: 'n2k204', kanji: '滅', readings: { on: ['メツ'], kun: ['ほろ'] },
    meaning: 'destroy / extinction / disappear / die out',
    examples: [
      { word: '滅亡', reading: 'めつぼう', meaning: 'downfall / ruin / extinction' },
      { word: '消滅', reading: 'しょうめつ', meaning: 'disappearance / extinction / vanishing' },
      { word: '滅ぼす', reading: 'ほろぼす', meaning: 'to destroy / ruin / devastate' },
    ],
    strokeCount: 13, level: 'N2', radical: '水',
  },
  {
    id: 'n2k205', kanji: '煙', readings: { on: ['エン'], kun: ['けむ', 'けむり'] },
    meaning: 'smoke / fumes / mist / haze',
    examples: [
      { word: '喫煙', reading: 'きつえん', meaning: 'smoking / smoking cigarettes' },
      { word: '禁煙', reading: 'きんえん', meaning: 'no smoking / quitting smoking' },
      { word: '煙突', reading: 'えんとつ', meaning: 'chimney / smokestack / funnel' },
    ],
    strokeCount: 13, level: 'N2', radical: '火',
  },
  {
    id: 'n2k206', kanji: '援', readings: { on: ['エン'], kun: [] },
    meaning: 'support / aid / assist / rescue',
    examples: [
      { word: '支援', reading: 'しえん', meaning: 'support / backing / assistance' },
      { word: '援助', reading: 'えんじょ', meaning: 'aid / assistance / support' },
      { word: '応援', reading: 'おうえん', meaning: 'cheering / support / rooting for' },
    ],
    strokeCount: 12, level: 'N2', radical: '手',
  },
  {
    id: 'n2k207', kanji: '縁', readings: { on: ['エン'], kun: ['ふち'] },
    meaning: 'fate / connection / edge / verge / affinity',
    examples: [
      { word: '縁談', reading: 'えんだん', meaning: 'marriage proposal / matchmaking talk' },
      { word: '因縁', reading: 'いんねん', meaning: 'fate / destiny / connection / karma' },
      { word: '縁側', reading: 'えんがわ', meaning: 'veranda / porch / engawa' },
    ],
    strokeCount: 15, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k208', kanji: '汚', readings: { on: ['オ'], kun: ['よご', 'きたな', 'けが'] },
    meaning: 'dirty / pollute / stain / impure',
    examples: [
      { word: '汚染', reading: 'おせん', meaning: 'pollution / contamination' },
      { word: '汚職', reading: 'おしょく', meaning: 'corruption / bribery' },
      { word: '汚れる', reading: 'よごれる', meaning: 'to get dirty / become soiled' },
    ],
    strokeCount: 6, level: 'N2', radical: '水',
  },
  {
    id: 'n2k209', kanji: '嫌', readings: { on: ['ケン'], kun: ['いや', 'きら'] },
    meaning: 'hate / dislike / unpleasant / suspicious',
    examples: [
      { word: '嫌悪', reading: 'けんお', meaning: 'disgust / hatred / abhorrence' },
      { word: '機嫌', reading: 'きげん', meaning: 'humour / mood / temper' },
      { word: '嫌いな', reading: 'きらいな', meaning: 'disliked / hated / disagreeable' },
    ],
    strokeCount: 13, level: 'N2', radical: '女',
  },
  {
    id: 'n2k210', kanji: '肩', readings: { on: ['ケン'], kun: ['かた'] },
    meaning: 'shoulder / bear responsibility',
    examples: [
      { word: '肩書き', reading: 'かたがき', meaning: 'title / position / status' },
      { word: '肩こり', reading: 'かたこり', meaning: 'stiff shoulders / shoulder aches' },
      { word: '双肩', reading: 'そうけん', meaning: 'both shoulders / on one\'s shoulders' },
    ],
    strokeCount: 8, level: 'N2', radical: '肉',
  },
  {
    id: 'n2k211', kanji: '険', readings: { on: ['ケン'], kun: ['けわ'] },
    meaning: 'steep / dangerous / risky /险',
    examples: [
      { word: '危険', reading: 'きけん', meaning: 'danger / hazard / risk' },
      { word: '険しい', reading: 'けわしい', meaning: 'steep / severe / harsh / rugged' },
      { word: '保険', reading: 'ほけん', meaning: 'insurance / guarantee' },
    ],
    strokeCount: 11, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k212', kanji: '検', readings: { on: ['ケン'], kun: [] },
    meaning: 'examine / inspect / investigate / check',
    examples: [
      { word: '検討', reading: 'けんとう', meaning: 'examination / consideration / review' },
      { word: '検査', reading: 'けんさ', meaning: 'inspection / examination / test' },
      { word: '点検', reading: 'てんけん', meaning: 'inspection / check / examination' },
    ],
    strokeCount: 12, level: 'N2', radical: '木',
  },
  {
    id: 'n2k213', kanji: '激', readings: { on: ['ゲキ'], kun: ['はげ'] },
    meaning: 'intense / violent / passion / fierce',
    examples: [
      { word: '激しい', reading: 'はげしい', meaning: 'violent / intense / severe / fierce' },
      { word: '感激', reading: 'かんげき', meaning: 'deep emotion / excitement / being moved' },
      { word: '激増', reading: 'げきぞう', meaning: 'sudden increase / rapid rise' },
    ],
    strokeCount: 16, level: 'N2', radical: '水',
  },
  {
    id: 'n2k214', kanji: '厳', readings: { on: ['ゲン', 'ゴン'], kun: ['きび', 'おごそ'] },
    meaning: 'strict / severe / solemn / stern',
    examples: [
      { word: '厳しい', reading: 'きびしい', meaning: 'strict / severe / harsh / rigorous' },
      { word: '厳格', reading: 'げんかく', meaning: 'strict / stern / rigorous' },
      { word: '荘厳', reading: 'そうごん', meaning: 'solemn / sublime / majestic' },
    ],
    strokeCount: 17, level: 'N2', radical: '山',
  },
  {
    id: 'n2k215', kanji: '災', readings: { on: ['サイ'], kun: ['わざわ'] },
    meaning: 'disaster / calamity / misfortune / catastrophe',
    examples: [
      { word: '災害', reading: 'さいがい', meaning: 'disaster / calamity / catastrophe' },
      { word: '火災', reading: 'かさい', meaning: 'fire / conflagration' },
      { word: '天災', reading: 'てんさい', meaning: 'natural disaster / act of God' },
    ],
    strokeCount: 7, level: 'N2', radical: '火',
  },
  {
    id: 'n2k216', kanji: '財', readings: { on: ['ザイ', 'サイ'], kun: [] },
    meaning: 'property / wealth / assets / treasure',
    examples: [
      { word: '財産', reading: 'ざいさん', meaning: 'property / assets / fortune' },
      { word: '財政', reading: 'ざいせい', meaning: 'finances / financial affairs' },
      { word: '文化財', reading: 'ぶんかざい', meaning: 'cultural assets / heritage' },
    ],
    strokeCount: 10, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k217', kanji: '罪', readings: { on: ['ザイ'], kun: ['つみ'] },
    meaning: 'crime / sin / guilt / offense',
    examples: [
      { word: '犯罪', reading: 'はんざい', meaning: 'crime / offence / criminal act' },
      { word: '謝罪', reading: 'しゃざい', meaning: 'apology / asking for forgiveness' },
      { word: '無罪', reading: 'むざい', meaning: 'not guilty / innocent' },
    ],
    strokeCount: 13, level: 'N2', radical: '网',
  },
  {
    id: 'n2k218', kanji: '刷', readings: { on: ['サツ'], kun: ['す'] },
    meaning: 'print / brush / scrub / sweep',
    examples: [
      { word: '印刷', reading: 'いんさつ', meaning: 'printing / print' },
      { word: '刷新', reading: 'さっしん', meaning: 'reform / renovation / renewal' },
      { word: '刷る', reading: 'する', meaning: 'to print / run off / brush' },
    ],
    strokeCount: 8, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k219', kanji: '酸', readings: { on: ['サン'], kun: ['す'] },
    meaning: 'acid / sour / sharp taste / oxygen',
    examples: [
      { word: '酸素', reading: 'さんそ', meaning: 'oxygen' },
      { word: '酸性', reading: 'さんせい', meaning: 'acidity / acidic nature' },
      { word: '酸っぱい', reading: 'すっぱい', meaning: 'sour / tart / acidic' },
    ],
    strokeCount: 14, level: 'N2', radical: '酉',
  },
  {
    id: 'n2k220', kanji: '暫', readings: { on: ['ザン'], kun: ['しばら'] },
    meaning: 'temporarily / for a while / a moment',
    examples: [
      { word: '暫定', reading: 'ざんてい', meaning: 'provisional / temporary / tentative' },
      { word: '暫時', reading: 'ざんじ', meaning: 'for a time / momentarily / brief period' },
      { word: '暫く', reading: 'しばらく', meaning: 'for a while / for a moment / for some time' },
    ],
    strokeCount: 15, level: 'N2', radical: '日',
  },
  {
    id: 'n2k221', kanji: '占', readings: { on: ['セン'], kun: ['し', 'しめ', 'うらな'] },
    meaning: 'occupy / monopolize / fortune-tell / seize',
    examples: [
      { word: '占領', reading: 'せんりょう', meaning: 'occupation / seizure / capture' },
      { word: '独占', reading: 'どくせん', meaning: 'monopoly / exclusivity' },
      { word: '占う', reading: 'うらなう', meaning: 'to tell fortunes / divine / predict' },
    ],
    strokeCount: 5, level: 'N2', radical: '卜',
  },
  {
    id: 'n2k222', kanji: '操', readings: { on: ['ソウ'], kun: ['あやつ', 'みさお'] },
    meaning: 'operate / manipulate / chastity / morality',
    examples: [
      { word: '操作', reading: 'そうさ', meaning: 'operation / handling / manipulation' },
      { word: '操縦', reading: 'そうじゅう', meaning: 'piloting / maneuvering / operating' },
      { word: '体操', reading: 'たいそう', meaning: 'gymnastics / physical exercise' },
    ],
    strokeCount: 16, level: 'N2', radical: '手',
  },
  {
    id: 'n2k223', kanji: '騒', readings: { on: ['ソウ'], kun: ['さわ'] },
    meaning: 'noisy / uproar / disturbance / commotion',
    examples: [
      { word: '騒音', reading: 'そうおん', meaning: 'noise / clamour / din' },
      { word: '騒動', reading: 'そうどう', meaning: 'disturbance / uproar / commotion' },
      { word: '騒ぐ', reading: 'さわぐ', meaning: 'to make noise / be noisy / clamour' },
    ],
    strokeCount: 18, level: 'N2', radical: '馬',
  },
  {
    id: 'n2k224', kanji: '贈', readings: { on: ['ゾウ'], kun: ['おく'] },
    meaning: 'gift / present / donate / give',
    examples: [
      { word: '贈り物', reading: 'おくりもの', meaning: 'gift / present / offering' },
      { word: '贈呈', reading: 'ぞうてい', meaning: 'presentation / donation / gifting' },
      { word: '贈る', reading: 'おくる', meaning: 'to give / present / offer as a gift' },
    ],
    strokeCount: 18, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k225', kanji: '促', readings: { on: ['ソク'], kun: ['うなが'] },
    meaning: 'urge / prompt / spur / hasten',
    examples: [
      { word: '促進', reading: 'そくしん', meaning: 'promotion / acceleration / facilitation' },
      { word: '督促', reading: 'とくそく', meaning: 'urging / demand / reminder' },
      { word: '促す', reading: 'うながす', meaning: 'to urge / prompt / hasten / encourage' },
    ],
    strokeCount: 9, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k226', kanji: '訴', readings: { on: ['ソ'], kun: ['うった'] },
    meaning: 'sue / appeal / complain / accuse',
    examples: [
      { word: '訴訟', reading: 'そしょう', meaning: 'lawsuit / legal action / litigation' },
      { word: '上訴', reading: 'じょうそ', meaning: 'appeal / taking to higher court' },
      { word: '訴える', reading: 'うったえる', meaning: 'to sue / appeal / complain / plead' },
    ],
    strokeCount: 12, level: 'N2', radical: '言',
  },
  {
    id: 'n2k227', kanji: '滞', readings: { on: ['タイ'], kun: ['とどこお'] },
    meaning: 'stagnate / delay / be overdue / linger',
    examples: [
      { word: '滞在', reading: 'たいざい', meaning: 'stay / sojourn / residence abroad' },
      { word: '停滞', reading: 'ていたい', meaning: 'stagnation / standstill / delay' },
      { word: '滞る', reading: 'とどこおる', meaning: 'to be delayed / stagnate / be overdue' },
    ],
    strokeCount: 13, level: 'N2', radical: '水',
  },
  {
    id: 'n2k228', kanji: '耐', readings: { on: ['タイ'], kun: ['た'] },
    meaning: 'endure / withstand / resist / bear',
    examples: [
      { word: '耐久', reading: 'たいきゅう', meaning: 'durability / persistence / endurance' },
      { word: '耐震', reading: 'たいしん', meaning: 'earthquake-resistant / seismic resistance' },
      { word: '耐える', reading: 'たえる', meaning: 'to endure / bear / withstand / tolerate' },
    ],
    strokeCount: 9, level: 'N2', radical: '耒',
  },
  {
    id: 'n2k229', kanji: '脱', readings: { on: ['ダツ'], kun: ['ぬ'] },
    meaning: 'escape / remove / undress / omit / shed',
    examples: [
      { word: '脱出', reading: 'だっしゅつ', meaning: 'escape / breakout / getting away' },
      { word: '離脱', reading: 'りだつ', meaning: 'withdrawal / breakaway / leaving' },
      { word: '脱ぐ', reading: 'ぬぐ', meaning: 'to take off (clothes) / undress' },
    ],
    strokeCount: 11, level: 'N2', radical: '月',
  },
  {
    id: 'n2k230', kanji: '嘆', readings: { on: ['タン'], kun: ['なげ'] },
    meaning: 'sigh / lament / admire / grieve',
    examples: [
      { word: '感嘆', reading: 'かんたん', meaning: 'admiration / wonder / exclamation' },
      { word: '嘆息', reading: 'たんそく', meaning: 'sigh / lamentation' },
      { word: '嘆く', reading: 'なげく', meaning: 'to lament / sigh / grieve over' },
    ],
    strokeCount: 13, level: 'N2', radical: '口',
  },
  {
    id: 'n2k231', kanji: '端', readings: { on: ['タン'], kun: ['はし', 'は', 'はた'] },
    meaning: 'edge / tip / extreme / end / start',
    examples: [
      { word: '端末', reading: 'たんまつ', meaning: 'terminal / device / endpoint' },
      { word: '先端', reading: 'せんたん', meaning: 'tip / point / cutting edge' },
      { word: '両端', reading: 'りょうはし', meaning: 'both ends / both extremes' },
    ],
    strokeCount: 14, level: 'N2', radical: '立',
  },
  {
    id: 'n2k232', kanji: '軟', readings: { on: ['ナン'], kun: ['やわ'] },
    meaning: 'soft / flexible / mild / gentle',
    examples: [
      { word: '軟化', reading: 'なんか', meaning: 'softening / easing / moderation' },
      { word: '軟弱', reading: 'なんじゃく', meaning: 'weak / feeble / soft / spineless' },
      { word: '軟らかい', reading: 'やわらかい', meaning: 'soft / flexible / gentle / mild' },
    ],
    strokeCount: 11, level: 'N2', radical: '車',
  },
  {
    id: 'n2k233', kanji: '暦', readings: { on: ['レキ'], kun: ['こよみ'] },
    meaning: 'calendar / almanac / chronicle',
    examples: [
      { word: '西暦', reading: 'せいれき', meaning: 'Christian era / Western calendar / AD' },
      { word: '旧暦', reading: 'きゅうれき', meaning: 'old calendar / lunar calendar' },
      { word: '暦年', reading: 'れきねん', meaning: 'calendar year' },
    ],
    strokeCount: 16, level: 'N2', radical: '日',
  },
  {
    id: 'n2k234', kanji: '劣', readings: { on: ['レツ'], kun: ['おと'] },
    meaning: 'inferior / poor quality / worse / substandard',
    examples: [
      { word: '劣化', reading: 'れっか', meaning: 'deterioration / degradation / decline' },
      { word: '優劣', reading: 'ゆうれつ', meaning: 'superiority or inferiority / relative quality' },
      { word: '劣る', reading: 'おとる', meaning: 'to be inferior / be worse / be substandard' },
    ],
    strokeCount: 6, level: 'N2', radical: '力',
  },
  {
    id: 'n2k235', kanji: '領', readings: { on: ['リョウ'], kun: [] },
    meaning: 'territory / possess / receive / understand / collar',
    examples: [
      { word: '領域', reading: 'りょういき', meaning: 'domain / territory / field / area' },
      { word: '大統領', reading: 'だいとうりょう', meaning: 'president (of a country)' },
      { word: '占領', reading: 'せんりょう', meaning: 'occupation / seizure / capture' },
    ],
    strokeCount: 14, level: 'N2', radical: '頁',
  },
  {
    id: 'n2k236', kanji: '療', readings: { on: ['リョウ'], kun: [] },
    meaning: 'treatment / medical care / cure / heal',
    examples: [
      { word: '治療', reading: 'ちりょう', meaning: 'medical treatment / cure / therapy' },
      { word: '療養', reading: 'りょうよう', meaning: 'recuperation / medical care / convalescence' },
      { word: '診療', reading: 'しんりょう', meaning: 'medical examination / diagnosis and treatment' },
    ],
    strokeCount: 17, level: 'N2', radical: '疒',
  },
  {
    id: 'n2k237', kanji: '雷', readings: { on: ['ライ'], kun: ['かみなり'] },
    meaning: 'thunder / lightning / thunderbolt',
    examples: [
      { word: '雷雨', reading: 'らいう', meaning: 'thunderstorm / thundershower' },
      { word: '避雷針', reading: 'ひらいしん', meaning: 'lightning rod / lightning conductor' },
      { word: '落雷', reading: 'らくらい', meaning: 'lightning strike / thunderbolt' },
    ],
    strokeCount: 13, level: 'N2', radical: '雨',
  },
  {
    id: 'n2k238', kanji: '露', readings: { on: ['ロ', 'ロウ'], kun: ['つゆ'] },
    meaning: 'dew / expose / reveal / Russia',
    examples: [
      { word: '露出', reading: 'ろしゅつ', meaning: 'exposure / revelation / uncovering' },
      { word: '暴露', reading: 'ばくろ', meaning: 'exposure / disclosure / revelation' },
      { word: '露骨', reading: 'ろこつ', meaning: 'open / frank / blatant / explicit' },
    ],
    strokeCount: 21, level: 'N2', radical: '雨',
  },
  {
    id: 'n2k239', kanji: '漏', readings: { on: ['ロウ'], kun: ['も', 'も'] },
    meaning: 'leak / reveal / escape / omit',
    examples: [
      { word: '漏洩', reading: 'ろうえい', meaning: 'leak / leakage / disclosure' },
      { word: '雨漏り', reading: 'あまもり', meaning: 'roof leak / rain leaking through' },
      { word: '漏れる', reading: 'もれる', meaning: 'to leak / escape / be omitted' },
    ],
    strokeCount: 14, level: 'N2', radical: '水',
  },
  {
    id: 'n2k240', kanji: '灯', readings: { on: ['トウ'], kun: ['ひ', 'とも'] },
    meaning: 'lamp / light / lantern / flame',
    examples: [
      { word: '灯台', reading: 'とうだい', meaning: 'lighthouse / beacon' },
      { word: '街灯', reading: 'がいとう', meaning: 'street light / street lamp' },
      { word: '灯火', reading: 'とうか', meaning: 'light / lamp / flame' },
    ],
    strokeCount: 6, level: 'N2', radical: '火',
  },
  {
    id: 'n2k241', kanji: '陰', readings: { on: ['イン'], kun: ['かげ', 'かげ'] },
    meaning: 'shadow / yin / negative / hidden / shade',
    examples: [
      { word: '陰謀', reading: 'いんぼう', meaning: 'plot / conspiracy / scheme' },
      { word: '物陰', reading: 'ものかげ', meaning: 'behind something / in the shadow' },
      { word: '陰性', reading: 'いんせい', meaning: 'negative (test) / yin nature' },
    ],
    strokeCount: 11, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k242', kanji: '隠', readings: { on: ['イン'], kun: ['かく'] },
    meaning: 'hide / conceal / retire / cover up',
    examples: [
      { word: '隠蔽', reading: 'いんぺい', meaning: 'concealment / cover-up / suppression' },
      { word: '引退', reading: 'いんたい', meaning: 'retirement / stepping down' },
      { word: '隠す', reading: 'かくす', meaning: 'to hide / conceal / cover up' },
    ],
    strokeCount: 14, level: 'N2', radical: '阜',
  },
  {
    id: 'n2k243', kanji: '煩', readings: { on: ['ハン', 'ボン'], kun: ['わずら'] },
    meaning: 'trouble / bother / worry / annoy / complicate',
    examples: [
      { word: '煩雑', reading: 'はんざつ', meaning: 'troublesome / complicated / annoying' },
      { word: '煩悩', reading: 'ぼんのう', meaning: 'worldly desires / passions / klesha' },
      { word: '煩わしい', reading: 'わずらわしい', meaning: 'troublesome / annoying / cumbersome' },
    ],
    strokeCount: 13, level: 'N2', radical: '火',
  },
  {
    id: 'n2k244', kanji: '泡', readings: { on: ['ホウ'], kun: ['あわ'] },
    meaning: 'bubble / foam / froth / suds',
    examples: [
      { word: '泡立つ', reading: 'あわだつ', meaning: 'to foam / bubble / froth' },
      { word: '水泡', reading: 'すいほう', meaning: 'bubble / water bubble / futile effort' },
      { word: '泡沫', reading: 'ほうまつ', meaning: 'bubble / foam / ephemeral / fleeting' },
    ],
    strokeCount: 8, level: 'N2', radical: '水',
  },
  {
    id: 'n2k245', kanji: '抱', readings: { on: ['ホウ'], kun: ['いだ', 'だ', 'かか'] },
    meaning: 'embrace / hold / cherish / carry in arms',
    examples: [
      { word: '抱負', reading: 'ほうふ', meaning: 'aspiration / ambition / hopes and plans' },
      { word: '介抱', reading: 'かいほう', meaning: 'nursing / tending / looking after' },
      { word: '抱く', reading: 'だく', meaning: 'to hold / embrace / hug / harbour (feelings)' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k246', kanji: '崩', readings: { on: ['ホウ'], kun: ['くず'] },
    meaning: 'crumble / collapse / cave in / fall apart',
    examples: [
      { word: '崩壊', reading: 'ほうかい', meaning: 'collapse / crumbling / breakdown / ruin' },
      { word: '崩落', reading: 'ほうらく', meaning: 'collapse / cave-in / landslide' },
      { word: '崩れる', reading: 'くずれる', meaning: 'to crumble / collapse / break down' },
    ],
    strokeCount: 11, level: 'N2', radical: '山',
  },
  {
    id: 'n2k247', kanji: '報', readings: { on: ['ホウ'], kun: ['むく'] },
    meaning: 'report / news / reward / inform / repay',
    examples: [
      { word: '情報', reading: 'じょうほう', meaning: 'information / news / intelligence' },
      { word: '報告', reading: 'ほうこく', meaning: 'report / account / statement' },
      { word: '報いる', reading: 'むくいる', meaning: 'to repay / reward / recompense' },
    ],
    strokeCount: 12, level: 'N2', radical: '土',
  },
  {
    id: 'n2k248', kanji: '乏', readings: { on: ['ボウ'], kun: ['とぼ'] },
    meaning: 'scarce / meager / lacking / deficient',
    examples: [
      { word: '貧乏', reading: 'びんぼう', meaning: 'poverty / being poor / financial hardship' },
      { word: '欠乏', reading: 'けつぼう', meaning: 'deficiency / shortage / lack' },
      { word: '乏しい', reading: 'とぼしい', meaning: 'scarce / meager / lacking / poor in' },
    ],
    strokeCount: 4, level: 'N2', radical: '乙',
  },
  {
    id: 'n2k249', kanji: '宣', readings: { on: ['セン'], kun: [] },
    meaning: 'proclaim / declare / announce / spread',
    examples: [
      { word: '宣言', reading: 'せんげん', meaning: 'declaration / proclamation / announcement' },
      { word: '宣伝', reading: 'せんでん', meaning: 'advertisement / publicity / propaganda' },
      { word: '宣告', reading: 'せんこく', meaning: 'sentence / pronouncement / verdict' },
    ],
    strokeCount: 9, level: 'N2', radical: '宀',
  },
  {
    id: 'n2k250', kanji: '鮮', readings: { on: ['セン'], kun: ['あざ'] },
    meaning: 'fresh / vivid / Korea / clear / bright',
    examples: [
      { word: '鮮明', reading: 'せんめい', meaning: 'clear / vivid / distinct / sharp' },
      { word: '新鮮', reading: 'しんせん', meaning: 'fresh / new / novel' },
      { word: '鮮やか', reading: 'あざやか', meaning: 'vivid / bright / dazzling / skillful' },
    ],
    strokeCount: 17, level: 'N2', radical: '魚',
  },
  {
    id: 'n2k251', kanji: '泉', readings: { on: ['セン'], kun: ['いずみ'] },
    meaning: 'spring / fountain / source / wellspring',
    examples: [
      { word: '温泉', reading: 'おんせん', meaning: 'hot spring / spa / onsen' },
      { word: '源泉', reading: 'げんせん', meaning: 'source / origin / fountainhead' },
      { word: '泉水', reading: 'せんすい', meaning: 'springwater / fountain water' },
    ],
    strokeCount: 9, level: 'N2', radical: '水',
  },
  {
    id: 'n2k252', kanji: '双', readings: { on: ['ソウ'], kun: ['ふた'] },
    meaning: 'pair / both / twin / couple',
    examples: [
      { word: '双方', reading: 'そうほう', meaning: 'both parties / both sides' },
      { word: '双子', reading: 'ふたご', meaning: 'twins / twin' },
      { word: '双眼鏡', reading: 'そうがんきょう', meaning: 'binoculars / field glasses' },
    ],
    strokeCount: 4, level: 'N2', radical: '又',
  },
  {
    id: 'n2k253', kanji: '葬', readings: { on: ['ソウ'], kun: ['ほうむ'] },
    meaning: 'funeral / bury / inter / lay to rest',
    examples: [
      { word: '葬儀', reading: 'そうぎ', meaning: 'funeral / funeral ceremony' },
      { word: '火葬', reading: 'かそう', meaning: 'cremation' },
      { word: '葬る', reading: 'ほうむる', meaning: 'to bury / inter / consign to oblivion' },
    ],
    strokeCount: 12, level: 'N2', radical: '死',
  },
  {
    id: 'n2k254', kanji: '鍛', readings: { on: ['タン'], kun: ['きた'] },
    meaning: 'forge / train / discipline / temper',
    examples: [
      { word: '鍛錬', reading: 'たんれん', meaning: 'training / discipline / tempering' },
      { word: '鍛冶', reading: 'かじ', meaning: 'blacksmith / metalwork / forging' },
      { word: '鍛える', reading: 'きたえる', meaning: 'to forge / train / discipline / toughen' },
    ],
    strokeCount: 17, level: 'N2', radical: '金',
  },
  {
    id: 'n2k255', kanji: '濁', readings: { on: ['ダク'], kun: ['にご'] },
    meaning: 'muddy / turbid / voiced consonant / cloudy',
    examples: [
      { word: '濁点', reading: 'だくてん', meaning: 'voiced consonant mark / dakuten (゛)' },
      { word: '混濁', reading: 'こんだく', meaning: 'turbidity / muddiness / confusion' },
      { word: '濁る', reading: 'にごる', meaning: 'to become muddy / be clouded / become turbid' },
    ],
    strokeCount: 16, level: 'N2', radical: '水',
  },
  {
    id: 'n2k256', kanji: '脂', readings: { on: ['シ'], kun: ['あぶら'] },
    meaning: 'fat / grease / lipid / resin / tallow',
    examples: [
      { word: '脂肪', reading: 'しぼう', meaning: 'fat / grease / lipid / adipose' },
      { word: '脂質', reading: 'ししつ', meaning: 'lipid / fat quality' },
      { word: '皮脂', reading: 'ひし', meaning: 'sebum / skin oil' },
    ],
    strokeCount: 10, level: 'N2', radical: '月',
  },
  {
    id: 'n2k257', kanji: '辞', readings: { on: ['ジ'], kun: ['や'] },
    meaning: 'resign / word / expression / quit / refuse',
    examples: [
      { word: '辞職', reading: 'じしょく', meaning: 'resignation (from a job/post)' },
      { word: '辞書', reading: 'じしょ', meaning: 'dictionary / lexicon' },
      { word: '辞める', reading: 'やめる', meaning: 'to quit / resign / leave / step down' },
    ],
    strokeCount: 13, level: 'N2', radical: '言',
  },
  {
    id: 'n2k258', kanji: '飼', readings: { on: ['シ'], kun: ['か'] },
    meaning: 'raise / keep / feed / domesticate (animals)',
    examples: [
      { word: '飼育', reading: 'しいく', meaning: 'breeding / raising / keeping (animals)' },
      { word: '飼い主', reading: 'かいぬし', meaning: 'pet owner / keeper / master' },
      { word: '飼う', reading: 'かう', meaning: 'to keep / raise / own (an animal/pet)' },
    ],
    strokeCount: 13, level: 'N2', radical: '食',
  },
  {
    id: 'n2k259', kanji: '慈', readings: { on: ['ジ'], kun: ['いつく'] },
    meaning: 'mercy / charity / benevolence / compassion',
    examples: [
      { word: '慈善', reading: 'じぜん', meaning: 'charity / benevolence / philanthropy' },
      { word: '慈悲', reading: 'じひ', meaning: 'mercy / compassion / benevolence' },
      { word: '慈しむ', reading: 'いつくしむ', meaning: 'to love / cherish / be compassionate' },
    ],
    strokeCount: 13, level: 'N2', radical: '心',
  },
  {
    id: 'n2k260', kanji: '磁', readings: { on: ['ジ'], kun: [] },
    meaning: 'magnet / porcelain / magnetism / ceramic',
    examples: [
      { word: '磁石', reading: 'じしゃく', meaning: 'magnet / lodestone' },
      { word: '磁場', reading: 'じば', meaning: 'magnetic field' },
      { word: '陶磁器', reading: 'とうじき', meaning: 'ceramics / pottery and porcelain' },
    ],
    strokeCount: 14, level: 'N2', radical: '石',
  },
  {
    id: 'n2k261', kanji: '侵', readings: { on: ['シン'], kun: ['おか'] },
    meaning: 'invade / encroach / violate / aggress',
    examples: [
      { word: '侵略', reading: 'しんりゃく', meaning: 'invasion / aggression / encroachment' },
      { word: '侵害', reading: 'しんがい', meaning: 'infringement / violation / encroachment' },
      { word: '侵す', reading: 'おかす', meaning: 'to invade / encroach / violate' },
    ],
    strokeCount: 9, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k262', kanji: '浸', readings: { on: ['シン'], kun: ['ひた'] },
    meaning: 'soak / immerse / permeate / steep / be submerged',
    examples: [
      { word: '浸水', reading: 'しんすい', meaning: 'flooding / inundation / submersion' },
      { word: '浸透', reading: 'しんとう', meaning: 'penetration / permeation / infiltration' },
      { word: '浸す', reading: 'ひたす', meaning: 'to soak / immerse / steep / dip' },
    ],
    strokeCount: 10, level: 'N2', radical: '水',
  },
  {
    id: 'n2k263', kanji: '震', readings: { on: ['シン'], kun: ['ふる'] },
    meaning: 'earthquake / tremble / shiver / quake',
    examples: [
      { word: '地震', reading: 'じしん', meaning: 'earthquake / seismic activity' },
      { word: '震源', reading: 'しんげん', meaning: 'epicentre / focus of earthquake' },
      { word: '震える', reading: 'ふるえる', meaning: 'to tremble / shiver / shake / quiver' },
    ],
    strokeCount: 15, level: 'N2', radical: '雨',
  },
  {
    id: 'n2k264', kanji: '衰', readings: { on: ['スイ'], kun: ['おとろ'] },
    meaning: 'decline / weaken / fade / wane / deteriorate',
    examples: [
      { word: '衰退', reading: 'すいたい', meaning: 'decline / decay / deterioration / fading' },
      { word: '老衰', reading: 'ろうすい', meaning: 'senility / death from old age' },
      { word: '衰える', reading: 'おとろえる', meaning: 'to decline / weaken / deteriorate' },
    ],
    strokeCount: 10, level: 'N2', radical: '衣',
  },
  {
    id: 'n2k265', kanji: '垂', readings: { on: ['スイ'], kun: ['た'] },
    meaning: 'hang / droop / bequeath / dangle / descend',
    examples: [
      { word: '垂直', reading: 'すいちょく', meaning: 'vertical / perpendicular' },
      { word: '垂れ幕', reading: 'たれまく', meaning: 'hanging banner / drop curtain' },
      { word: '垂れる', reading: 'たれる', meaning: 'to hang / droop / drip / dangle' },
    ],
    strokeCount: 8, level: 'N2', radical: '土',
  },
  {
    id: 'n2k266', kanji: '推', readings: { on: ['スイ'], kun: ['お'] },
    meaning: 'push / infer / recommend / deduce',
    examples: [
      { word: '推測', reading: 'すいそく', meaning: 'guess / conjecture / speculation' },
      { word: '推進', reading: 'すいしん', meaning: 'propulsion / driving forward / promotion' },
      { word: '推薦', reading: 'すいせん', meaning: 'recommendation / reference' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k267', kanji: '誠', readings: { on: ['セイ'], kun: ['まこと'] },
    meaning: 'sincerity / fidelity / truth / genuine',
    examples: [
      { word: '誠実', reading: 'せいじつ', meaning: 'sincere / honest / faithful / genuine' },
      { word: '誠意', reading: 'せいい', meaning: 'sincerity / good faith / genuine intention' },
      { word: '誠に', reading: 'まことに', meaning: 'truly / sincerely / indeed / really' },
    ],
    strokeCount: 13, level: 'N2', radical: '言',
  },
  {
    id: 'n2k268', kanji: '誓', readings: { on: ['セイ'], kun: ['ちか'] },
    meaning: 'vow / swear / pledge / oath',
    examples: [
      { word: '誓約', reading: 'せいやく', meaning: 'vow / pledge / oath / covenant' },
      { word: '宣誓', reading: 'せんせい', meaning: 'oath / swearing / vow' },
      { word: '誓う', reading: 'ちかう', meaning: 'to vow / swear / pledge / take an oath' },
    ],
    strokeCount: 14, level: 'N2', radical: '言',
  },
  {
    id: 'n2k269', kanji: '潜', readings: { on: ['セン'], kun: ['もぐ', 'ひそ'] },
    meaning: 'submerge / lurk / hide / go underwater',
    examples: [
      { word: '潜水', reading: 'せんすい', meaning: 'diving / submerging / submersion' },
      { word: '潜在', reading: 'せんざい', meaning: 'latent / potential / hidden' },
      { word: '潜む', reading: 'ひそむ', meaning: 'to lurk / hide / be latent' },
    ],
    strokeCount: 15, level: 'N2', radical: '水',
  },
  {
    id: 'n2k270', kanji: '装', readings: { on: ['ソウ', 'ショウ'], kun: ['よそお'] },
    meaning: 'dress / pretend / load / equip / disguise',
    examples: [
      { word: '装置', reading: 'そうち', meaning: 'device / apparatus / equipment' },
      { word: '服装', reading: 'ふくそう', meaning: 'clothing / outfit / dress / attire' },
      { word: '装う', reading: 'よそおう', meaning: 'to dress / adorn / pretend / feign' },
    ],
    strokeCount: 12, level: 'N2', radical: '衣',
  },
  {
    id: 'n2k271', kanji: '総', readings: { on: ['ソウ'], kun: ['す'] },
    meaning: 'total / overall / general / all / gross',
    examples: [
      { word: '総合', reading: 'そうごう', meaning: 'synthesis / integration / comprehensive' },
      { word: '総理', reading: 'そうり', meaning: 'prime minister / premier' },
      { word: '総額', reading: 'そうがく', meaning: 'total amount / grand total' },
    ],
    strokeCount: 14, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k272', kanji: '即', readings: { on: ['ソク'], kun: ['すなわ'] },
    meaning: 'immediately / namely / i.e. / at once',
    examples: [
      { word: '即座', reading: 'そくざ', meaning: 'immediate / prompt / instant / on the spot' },
      { word: '即興', reading: 'そっきょう', meaning: 'improvisation / extemporaneous' },
      { word: '即ち', reading: 'すなわち', meaning: 'namely / that is / in other words' },
    ],
    strokeCount: 7, level: 'N2', radical: '卩',
  },
  {
    id: 'n2k273', kanji: '粗', readings: { on: ['ソ'], kun: ['あら'] },
    meaning: 'rough / crude / coarse / careless / inferior',
    examples: [
      { word: '粗末', reading: 'そまつ', meaning: 'crude / rough / plain / wasteful' },
      { word: '粗雑', reading: 'そざつ', meaning: 'careless / rough / crude / sloppy' },
      { word: '粗い', reading: 'あらい', meaning: 'rough / coarse / crude / rude' },
    ],
    strokeCount: 11, level: 'N2', radical: '米',
  },
  {
    id: 'n2k274', kanji: '蔵', readings: { on: ['ゾウ'], kun: ['くら'] },
    meaning: 'storehouse / warehouse / own / possess / treasury',
    examples: [
      { word: '貯蔵', reading: 'ちょぞう', meaning: 'storage / preservation / stocking' },
      { word: '収蔵', reading: 'しゅうぞう', meaning: 'collection / storage / acquisition' },
      { word: '蔵書', reading: 'ぞうしょ', meaning: 'book collection / library collection' },
    ],
    strokeCount: 15, level: 'N2', radical: '艸',
  },
  {
    id: 'n2k275', kanji: '憎', readings: { on: ['ゾウ'], kun: ['にく'] },
    meaning: 'hate / detest / loathe / abhor',
    examples: [
      { word: '憎悪', reading: 'ぞうお', meaning: 'hatred / abhorrence / loathing' },
      { word: '愛憎', reading: 'あいぞう', meaning: 'love and hate / complex feelings' },
      { word: '憎む', reading: 'にくむ', meaning: 'to hate / detest / loathe / abhor' },
    ],
    strokeCount: 14, level: 'N2', radical: '忄',
  },
  {
    id: 'n2k276', kanji: '喪', readings: { on: ['ソウ'], kun: ['も'] },
    meaning: 'mourning / lose / be bereaved / period of mourning',
    examples: [
      { word: '喪失', reading: 'そうしつ', meaning: 'loss / forfeit / deprivation' },
      { word: '服喪', reading: 'ふくも', meaning: 'mourning / period of mourning' },
      { word: '喪中', reading: 'もちゅう', meaning: 'during a period of mourning' },
    ],
    strokeCount: 12, level: 'N2', radical: '口',
  },
  {
    id: 'n2k277', kanji: '賃', readings: { on: ['チン'], kun: [] },
    meaning: 'wage / rent / fee / fare / hire',
    examples: [
      { word: '賃金', reading: 'ちんぎん', meaning: 'wage / salary / pay / remuneration' },
      { word: '家賃', reading: 'やちん', meaning: 'rent / house rent' },
      { word: '運賃', reading: 'うんちん', meaning: 'freight / shipping cost / fare' },
    ],
    strokeCount: 13, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k278', kanji: '駐', readings: { on: ['チュウ'], kun: [] },
    meaning: 'stop / park / be stationed / reside',
    examples: [
      { word: '駐車', reading: 'ちゅうしゃ', meaning: 'parking / parking a car' },
      { word: '駐在', reading: 'ちゅうざい', meaning: 'stationed / residing / on-site presence' },
      { word: '駐留', reading: 'ちゅうりゅう', meaning: 'stationing troops / garrison' },
    ],
    strokeCount: 15, level: 'N2', radical: '馬',
  },
  {
    id: 'n2k279', kanji: '庁', readings: { on: ['チョウ'], kun: [] },
    meaning: 'government office / agency / authority',
    examples: [
      { word: '県庁', reading: 'けんちょう', meaning: 'prefectural government office' },
      { word: '警視庁', reading: 'けいしちょう', meaning: 'Metropolitan Police Department' },
      { word: '庁舎', reading: 'ちょうしゃ', meaning: 'government building / official building' },
    ],
    strokeCount: 5, level: 'N2', radical: '广',
  },
  {
    id: 'n2k280', kanji: '超', readings: { on: ['チョウ'], kun: ['こ'] },
    meaning: 'exceed / surpass / ultra- / transcend / super-',
    examples: [
      { word: '超過', reading: 'ちょうか', meaning: 'excess / surplus / exceeding a limit' },
      { word: '超高齢', reading: 'ちょうこうれい', meaning: 'super-aged / extremely elderly' },
      { word: '超える', reading: 'こえる', meaning: 'to exceed / surpass / go beyond' },
    ],
    strokeCount: 12, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k281', kanji: '徴', readings: { on: ['チョウ'], kun: [] },
    meaning: 'collect / recruit / symptom / sign / characteristic',
    examples: [
      { word: '徴収', reading: 'ちょうしゅう', meaning: 'collection / levy / imposition' },
      { word: '徴候', reading: 'ちょうこう', meaning: 'symptom / sign / indication / omen' },
      { word: '特徴', reading: 'とくちょう', meaning: 'feature / characteristic / trait' },
    ],
    strokeCount: 14, level: 'N2', radical: '彳',
  },
  {
    id: 'n2k282', kanji: '忠', readings: { on: ['チュウ'], kun: [] },
    meaning: 'loyalty / fidelity / faithfulness / devotion',
    examples: [
      { word: '忠実', reading: 'ちゅうじつ', meaning: 'faithful / loyal / devoted / accurate' },
      { word: '忠告', reading: 'ちゅうこく', meaning: 'advice / warning / admonition' },
      { word: '忠誠', reading: 'ちゅうせい', meaning: 'loyalty / allegiance / fidelity' },
    ],
    strokeCount: 8, level: 'N2', radical: '心',
  },
  {
    id: 'n2k283', kanji: '貯', readings: { on: ['チョ'], kun: ['た'] },
    meaning: 'savings / store / stock / reserve / accumulate',
    examples: [
      { word: '貯金', reading: 'ちょきん', meaning: 'savings / money saved / bank deposit' },
      { word: '貯蓄', reading: 'ちょちく', meaning: 'savings / accumulation / storing up' },
      { word: '貯める', reading: 'ためる', meaning: 'to save / accumulate / store up' },
    ],
    strokeCount: 12, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k284', kanji: '兆', readings: { on: ['チョウ'], kun: ['きざ'] },
    meaning: 'trillion / omen / sign / portent',
    examples: [
      { word: '兆候', reading: 'ちょうこう', meaning: 'symptom / sign / indication / omen' },
      { word: '前兆', reading: 'ぜんちょう', meaning: 'omen / forewarning / premonition' },
      { word: '兆す', reading: 'きざす', meaning: 'to show signs / have a premonition' },
    ],
    strokeCount: 6, level: 'N2', radical: '儿',
  },
  {
    id: 'n2k285', kanji: '貴', readings: { on: ['キ'], kun: ['たっと', 'とうと'] },
    meaning: 'precious / noble / valuable / exalted / dear',
    examples: [
      { word: '貴重', reading: 'きちょう', meaning: 'precious / valuable / rare / important' },
      { word: '貴族', reading: 'きぞく', meaning: 'aristocrat / nobility / peer' },
      { word: '貴社', reading: 'きしゃ', meaning: 'your company / your firm (respectful)' },
    ],
    strokeCount: 12, level: 'N2', radical: '貝',
  },
  {
    id: 'n2k286', kanji: '偽', readings: { on: ['ギ'], kun: ['にせ', 'いつわ'] },
    meaning: 'fake / false / counterfeit / deceive / pretend',
    examples: [
      { word: '偽物', reading: 'にせもの', meaning: 'fake / counterfeit / imitation / phony' },
      { word: '虚偽', reading: 'きょぎ', meaning: 'falsehood / lie / dishonesty' },
      { word: '偽る', reading: 'いつわる', meaning: 'to lie / deceive / pretend / falsify' },
    ],
    strokeCount: 11, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k287', kanji: '輝', readings: { on: ['キ'], kun: ['かがや'] },
    meaning: 'shine / radiance / glitter / brilliant / sparkle',
    examples: [
      { word: '光輝', reading: 'こうき', meaning: 'radiance / brilliance / glory' },
      { word: '輝かしい', reading: 'かがやかしい', meaning: 'brilliant / glorious / radiant' },
      { word: '輝く', reading: 'かがやく', meaning: 'to shine / sparkle / glitter / radiate' },
    ],
    strokeCount: 15, level: 'N2', radical: '火',
  },
  {
    id: 'n2k288', kanji: '疑', readings: { on: ['ギ'], kun: ['うたが'] },
    meaning: 'doubt / suspect / question / be uncertain',
    examples: [
      { word: '疑問', reading: 'ぎもん', meaning: 'question / doubt / query / uncertainty' },
      { word: '容疑', reading: 'ようぎ', meaning: 'suspicion / being suspected' },
      { word: '疑う', reading: 'うたがう', meaning: 'to doubt / suspect / question' },
    ],
    strokeCount: 14, level: 'N2', radical: '疋',
  },
  {
    id: 'n2k289', kanji: '虚', readings: { on: ['キョ', 'コ'], kun: ['むな'] },
    meaning: 'empty / void / false / hollow / unreal',
    examples: [
      { word: '虚偽', reading: 'きょぎ', meaning: 'falsehood / lie / dishonesty' },
      { word: '虚弱', reading: 'きょじゃく', meaning: 'frail / weak / delicate / infirm' },
      { word: '空虚', reading: 'くうきょ', meaning: 'empty / hollow / vain / void' },
    ],
    strokeCount: 11, level: 'N2', radical: '虍',
  },
  {
    id: 'n2k290', kanji: '脅', readings: { on: ['キョウ'], kun: ['おびや', 'おど'] },
    meaning: 'threaten / coerce / intimidate / menace',
    examples: [
      { word: '脅迫', reading: 'きょうはく', meaning: 'threat / menace / intimidation' },
      { word: '脅威', reading: 'きょうい', meaning: 'threat / menace / danger' },
      { word: '脅かす', reading: 'おびやかす', meaning: 'to threaten / menace / endanger' },
    ],
    strokeCount: 10, level: 'N2', radical: '月',
  },
  {
    id: 'n2k291', kanji: '菌', readings: { on: ['キン'], kun: [] },
    meaning: 'germ / bacteria / fungus / mold / microbe',
    examples: [
      { word: '細菌', reading: 'さいきん', meaning: 'bacteria / germ / microbe' },
      { word: '殺菌', reading: 'さっきん', meaning: 'sterilization / disinfection / killing germs' },
      { word: '抗菌', reading: 'こうきん', meaning: 'antibacterial / antimicrobial' },
    ],
    strokeCount: 11, level: 'N2', radical: '艸',
  },
  {
    id: 'n2k292', kanji: '緊', readings: { on: ['キン'], kun: [] },
    meaning: 'tense / tight / urgent / critical',
    examples: [
      { word: '緊張', reading: 'きんちょう', meaning: 'tension / nervousness / stress' },
      { word: '緊急', reading: 'きんきゅう', meaning: 'urgent / emergency / pressing' },
      { word: '緊迫', reading: 'きんぱく', meaning: 'tension / strain / urgency' },
    ],
    strokeCount: 15, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k293', kanji: '均', readings: { on: ['キン'], kun: ['なら'] },
    meaning: 'level / equal / uniform / average / even',
    examples: [
      { word: '均等', reading: 'きんとう', meaning: 'equality / uniformity / even distribution' },
      { word: '平均', reading: 'へいきん', meaning: 'average / mean / balance' },
      { word: '均衡', reading: 'きんこう', meaning: 'balance / equilibrium / parity' },
    ],
    strokeCount: 7, level: 'N2', radical: '土',
  },
  {
    id: 'n2k294', kanji: '穀', readings: { on: ['コク'], kun: [] },
    meaning: 'grain / cereals / crops / harvest',
    examples: [
      { word: '穀物', reading: 'こくもつ', meaning: 'grain / cereal / crops' },
      { word: '雑穀', reading: 'ざっこく', meaning: 'various grains / mixed cereals' },
      { word: '穀倉', reading: 'こくそう', meaning: 'granary / grain storehouse' },
    ],
    strokeCount: 14, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k295', kanji: '刻', readings: { on: ['コク'], kun: ['きざ'] },
    meaning: 'engrave / moment / time / carve / cut',
    examples: [
      { word: '時刻', reading: 'じこく', meaning: 'time / hour / the time of day' },
      { word: '刻む', reading: 'きざむ', meaning: 'to engrave / carve / chop / mince' },
      { word: '深刻', reading: 'しんこく', meaning: 'serious / acute / grave / severe' },
    ],
    strokeCount: 8, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k296', kanji: '郊', readings: { on: ['コウ'], kun: [] },
    meaning: 'suburbs / outskirts / countryside / rural area',
    examples: [
      { word: '郊外', reading: 'こうがい', meaning: 'suburbs / outskirts / the country' },
      { word: '近郊', reading: 'きんこう', meaning: 'suburbs / nearby area / vicinity' },
      { word: '遠郊', reading: 'えんこう', meaning: 'distant suburbs / outer suburbs' },
    ],
    strokeCount: 9, level: 'N2', radical: '邑',
  },
  {
    id: 'n2k297', kanji: '腰', readings: { on: ['ヨウ'], kun: ['こし'] },
    meaning: 'waist / lower back / hips / small of back',
    examples: [
      { word: '腰痛', reading: 'ようつう', meaning: 'lower back pain / lumbago / backache' },
      { word: '腰掛け', reading: 'こしかけ', meaning: 'seat / chair / stool / temporary post' },
      { word: '腰を抜かす', reading: 'こしをぬかす', meaning: 'to be paralyzed with fear / be shocked' },
    ],
    strokeCount: 13, level: 'N2', radical: '月',
  },
  {
    id: 'n2k298', kanji: '雇', readings: { on: ['コ'], kun: ['やと'] },
    meaning: 'employ / hire / engage / take on staff',
    examples: [
      { word: '雇用', reading: 'こよう', meaning: 'employment / hiring / engagement' },
      { word: '雇い主', reading: 'やといぬし', meaning: 'employer / master / boss' },
      { word: '雇う', reading: 'やとう', meaning: 'to hire / employ / take on / engage' },
    ],
    strokeCount: 12, level: 'N2', radical: '隹',
  },
  {
    id: 'n2k299', kanji: '誇', readings: { on: ['コ'], kun: ['ほこ'] },
    meaning: 'boast / pride / be proud / brag / vaunt',
    examples: [
      { word: '誇大', reading: 'こだい', meaning: 'exaggeration / overstatement / boastfulness' },
      { word: '誇示', reading: 'こじ', meaning: 'ostentation / showing off / display' },
      { word: '誇る', reading: 'ほこる', meaning: 'to boast / be proud of / take pride in' },
    ],
    strokeCount: 13, level: 'N2', radical: '言',
  },
  {
    id: 'n2k300', kanji: '告', readings: { on: ['コク'], kun: ['つ'] },
    meaning: 'announce / inform / tell / notify / accuse',
    examples: [
      { word: '広告', reading: 'こうこく', meaning: 'advertisement / advertising / publicity' },
      { word: '報告', reading: 'ほうこく', meaning: 'report / account / statement' },
      { word: '告げる', reading: 'つげる', meaning: 'to tell / inform / announce / notify' },
    ],
    strokeCount: 7, level: 'N2', radical: '口',
  },
  {
    id: 'n2k301', kanji: '克', readings: { on: ['コク'], kun: [] },
    meaning: 'overcome / subdue / win / excel',
    examples: [
      { word: '克服', reading: 'こくふく', meaning: 'overcome / conquer / surmount' },
      { word: '克明', reading: 'こくめい', meaning: 'detailed / thorough / meticulous' },
      { word: '相克', reading: 'そうこく', meaning: 'conflict / struggle / opposition' },
    ],
    strokeCount: 7, level: 'N2', radical: '儿',
  },
  {
    id: 'n2k302', kanji: '孤', readings: { on: ['コ'], kun: [] },
    meaning: 'isolated / alone / orphan / lonely',
    examples: [
      { word: '孤独', reading: 'こどく', meaning: 'solitude / loneliness / isolation' },
      { word: '孤立', reading: 'こりつ', meaning: 'isolation / being alone / standing alone' },
      { word: '孤児', reading: 'こじ', meaning: 'orphan / parentless child' },
    ],
    strokeCount: 8, level: 'N2', radical: '子',
  },
  {
    id: 'n2k303', kanji: '傲', readings: { on: ['ゴウ'], kun: [] },
    meaning: 'arrogant / proud / haughty / insolent',
    examples: [
      { word: '傲慢', reading: 'ごうまん', meaning: 'arrogant / haughty / insolent' },
      { word: '傲然', reading: 'ごうぜん', meaning: 'arrogantly / haughtily / with pride' },
      { word: '傲岸', reading: 'ごうがん', meaning: 'arrogance / haughtiness / pride' },
    ],
    strokeCount: 13, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k304', kanji: '綱', readings: { on: ['コウ'], kun: ['つな'] },
    meaning: 'rope / cord / outline / guiding principle',
    examples: [
      { word: '綱領', reading: 'こうりょう', meaning: 'platform / program / guidelines' },
      { word: '綱紀', reading: 'こうき', meaning: 'discipline / order / social norms' },
      { word: '綱引き', reading: 'つなひき', meaning: 'tug of war' },
    ],
    strokeCount: 14, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k305', kanji: '稿', readings: { on: ['コウ'], kun: ['わら'] },
    meaning: 'draft / manuscript / straw / rough copy',
    examples: [
      { word: '原稿', reading: 'げんこう', meaning: 'manuscript / draft / copy / script' },
      { word: '投稿', reading: 'とうこう', meaning: 'submission / contribution / posting' },
      { word: '草稿', reading: 'そうこう', meaning: 'rough draft / first draft' },
    ],
    strokeCount: 15, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k306', kanji: '恵', readings: { on: ['ケイ', 'エ'], kun: ['めぐ'] },
    meaning: 'blessing / grace / favour / kindness / benefit',
    examples: [
      { word: '恩恵', reading: 'おんけい', meaning: 'grace / favour / benefit / blessing' },
      { word: '恵み', reading: 'めぐみ', meaning: 'blessing / grace / benefit / favour' },
      { word: '知恵', reading: 'ちえ', meaning: 'wisdom / wit / intelligence / brains' },
    ],
    strokeCount: 10, level: 'N2', radical: '心',
  },
  {
    id: 'n2k307', kanji: '掲', readings: { on: ['ケイ'], kun: ['かか'] },
    meaning: 'put up / display / hoist / publish / post',
    examples: [
      { word: '掲示', reading: 'けいじ', meaning: 'notice / bulletin / posting / display' },
      { word: '掲載', reading: 'けいさい', meaning: 'publication / posting / print in' },
      { word: '掲げる', reading: 'かかげる', meaning: 'to hoist / display / put up / publish' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k308', kanji: '欠', readings: { on: ['ケツ'], kun: ['か', 'かけ'] },
    meaning: 'lack / absence / deficiency / miss / be wanting',
    examples: [
      { word: '欠陥', reading: 'けっかん', meaning: 'defect / flaw / shortcoming' },
      { word: '欠席', reading: 'けっせき', meaning: 'absence / non-attendance' },
      { word: '欠ける', reading: 'かける', meaning: 'to be lacking / be missing / be deficient' },
    ],
    strokeCount: 4, level: 'N2', radical: '欠',
  },
  {
    id: 'n2k309', kanji: '遷', readings: { on: ['セン'], kun: ['うつ'] },
    meaning: 'transition / move / change / transfer / exile',
    examples: [
      { word: '変遷', reading: 'へんせん', meaning: 'change / transition / vicissitude' },
      { word: '遷都', reading: 'せんと', meaning: 'transfer of the capital / relocation' },
      { word: '左遷', reading: 'させん', meaning: 'demotion / downgrade / posting to an inferior position' },
    ],
    strokeCount: 15, level: 'N2', radical: '辶',
  },
  {
    id: 'n2k310', kanji: '漸', readings: { on: ['ゼン'], kun: ['ようや'] },
    meaning: 'gradually / steadily / step by step',
    examples: [
      { word: '漸次', reading: 'ぜんじ', meaning: 'gradually / step by step / little by little' },
      { word: '漸進', reading: 'ぜんしん', meaning: 'gradual progress / step-by-step advance' },
      { word: '漸く', reading: 'ようやく', meaning: 'gradually / barely / at last / finally' },
    ],
    strokeCount: 14, level: 'N2', radical: '水',
  },
  {
    id: 'n2k311', kanji: '糾', readings: { on: ['キュウ'], kun: [] },
    meaning: 'twist / investigate / correct / condemn',
    examples: [
      { word: '糾弾', reading: 'きゅうだん', meaning: 'denunciation / censure / accusation' },
      { word: '糾明', reading: 'きゅうめい', meaning: 'investigation / thorough inquiry' },
      { word: '紛糾', reading: 'ふんきゅう', meaning: 'complication / entanglement / confusion' },
    ],
    strokeCount: 8, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k312', kanji: '虐', readings: { on: ['ギャク'], kun: ['しいた'] },
    meaning: 'cruel / atrocities / tyranny / oppress',
    examples: [
      { word: '虐待', reading: 'ぎゃくたい', meaning: 'abuse / maltreatment / ill-treatment' },
      { word: '虐殺', reading: 'ぎゃくさつ', meaning: 'massacre / slaughter / mass killing' },
      { word: '虐げる', reading: 'しいたげる', meaning: 'to oppress / persecute / tyrannize' },
    ],
    strokeCount: 9, level: 'N2', radical: '虍',
  },
  {
    id: 'n2k313', kanji: '拒', readings: { on: ['キョ'], kun: ['こば'] },
    meaning: 'refuse / resist / reject / deny / repel',
    examples: [
      { word: '拒否', reading: 'きょひ', meaning: 'refusal / denial / rejection / veto' },
      { word: '拒絶', reading: 'きょぜつ', meaning: 'rejection / repulsion / refusal' },
      { word: '拒む', reading: 'こばむ', meaning: 'to refuse / reject / deny / decline' },
    ],
    strokeCount: 7, level: 'N2', radical: '手',
  },
  {
    id: 'n2k314', kanji: '掘', readings: { on: ['クツ'], kun: ['ほ'] },
    meaning: 'dig / excavate / unearth / hollow out',
    examples: [
      { word: '発掘', reading: 'はっくつ', meaning: 'excavation / unearthing / discovery' },
      { word: '採掘', reading: 'さいくつ', meaning: 'mining / excavation / extraction' },
      { word: '掘る', reading: 'ほる', meaning: 'to dig / excavate / hollow out' },
    ],
    strokeCount: 11, level: 'N2', radical: '手',
  },
  {
    id: 'n2k315', kanji: '繰', readings: { on: ['ソウ'], kun: ['く'] },
    meaning: 'reel / spin / wind / turn / advance',
    examples: [
      { word: '繰り返す', reading: 'くりかえす', meaning: 'to repeat / do over and over' },
      { word: '繰り上げ', reading: 'くりあげ', meaning: 'advancement / moving up / rescheduling' },
      { word: '繰り越す', reading: 'くりこす', meaning: 'to carry over / bring forward' },
    ],
    strokeCount: 19, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k316', kanji: '銃', readings: { on: ['ジュウ'], kun: [] },
    meaning: 'gun / pistol / rifle / firearm',
    examples: [
      { word: '銃器', reading: 'じゅうき', meaning: 'firearm / gun / weapon' },
      { word: '銃撃', reading: 'じゅうげき', meaning: 'shooting / gunfire / fusillade' },
      { word: '拳銃', reading: 'けんじゅう', meaning: 'pistol / handgun / revolver' },
    ],
    strokeCount: 14, level: 'N2', radical: '金',
  },
  {
    id: 'n2k317', kanji: '摘', readings: { on: ['テキ'], kun: ['つ'] },
    meaning: 'pick / pluck / point out / gather / expose',
    examples: [
      { word: '指摘', reading: 'してき', meaning: 'pointing out / indicating / noting' },
      { word: '摘発', reading: 'てきはつ', meaning: 'exposure / uncovering / detection' },
      { word: '摘む', reading: 'つむ', meaning: 'to pick / pluck / gather / nip off' },
    ],
    strokeCount: 14, level: 'N2', radical: '手',
  },
  {
    id: 'n2k318', kanji: '跡', readings: { on: ['セキ'], kun: ['あと'] },
    meaning: 'trace / mark / scar / footprint / remains',
    examples: [
      { word: '足跡', reading: 'あしあと', meaning: 'footprint / footstep / trace / track' },
      { word: '遺跡', reading: 'いせき', meaning: 'ruins / remains / historical site' },
      { word: '痕跡', reading: 'こんせき', meaning: 'trace / vestige / mark / evidence' },
    ],
    strokeCount: 13, level: 'N2', radical: '足',
  },
  {
    id: 'n2k319', kanji: '凝', readings: { on: ['ギョウ'], kun: ['こ'] },
    meaning: 'congeal / freeze / coagulate / be absorbed in',
    examples: [
      { word: '凝縮', reading: 'ぎょうしゅく', meaning: 'condensation / compression / concentration' },
      { word: '凝固', reading: 'ぎょうこ', meaning: 'solidification / congealing / coagulation' },
      { word: '凝る', reading: 'こる', meaning: 'to be stiff / be absorbed in / be particular about' },
    ],
    strokeCount: 16, level: 'N2', radical: '冫',
  },
  {
    id: 'n2k320', kanji: '猛', readings: { on: ['モウ'], kun: ['たけ'] },
    meaning: 'fierce / ferocious / brave / violent / raging',
    examples: [
      { word: '猛烈', reading: 'もうれつ', meaning: 'fierce / violent / intense / vehement' },
      { word: '猛獣', reading: 'もうじゅう', meaning: 'fierce beast / ferocious animal' },
      { word: '猛暑', reading: 'もうしょ', meaning: 'intense heat / heat wave / scorching summer' },
    ],
    strokeCount: 11, level: 'N2', radical: '犬',
  },
  {
    id: 'n2k321', kanji: '拘', readings: { on: ['コウ'], kun: ['かか'] },
    meaning: 'arrest / be particular about / be concerned with',
    examples: [
      { word: '拘束', reading: 'こうそく', meaning: 'restraint / restriction / custody' },
      { word: '拘留', reading: 'こうりゅう', meaning: 'detention / confinement / custody' },
      { word: '拘る', reading: 'こだわる', meaning: 'to be particular about / be fussy / fixate on' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k322', kanji: '摩', readings: { on: ['マ'], kun: [] },
    meaning: 'rub / scrape / chafe / grind / friction',
    examples: [
      { word: '摩擦', reading: 'まさつ', meaning: 'friction / rubbing / conflict / discord' },
      { word: '按摩', reading: 'あんま', meaning: 'massage / masseur / massaging' },
      { word: '摩耗', reading: 'まもう', meaning: 'wear / abrasion / attrition' },
    ],
    strokeCount: 15, level: 'N2', radical: '手',
  },
  {
    id: 'n2k323', kanji: '奪', readings: { on: ['ダツ'], kun: ['うば'] },
    meaning: 'snatch / plunder / seize / rob / take away',
    examples: [
      { word: '奪取', reading: 'だっしゅ', meaning: 'seizure / capture / wresting from' },
      { word: '略奪', reading: 'りゃくだつ', meaning: 'plunder / pillage / looting' },
      { word: '奪う', reading: 'うばう', meaning: 'to snatch / take away / steal / deprive' },
    ],
    strokeCount: 14, level: 'N2', radical: '大',
  },
  {
    id: 'n2k324', kanji: '枯', readings: { on: ['コ'], kun: ['か'] },
    meaning: 'wither / dry up / parch / die (plants)',
    examples: [
      { word: '枯渇', reading: 'こかつ', meaning: 'drying up / exhaustion / depletion' },
      { word: '枯葉', reading: 'かれは', meaning: 'dead leaf / fallen leaf / withered leaf' },
      { word: '枯れる', reading: 'かれる', meaning: 'to wither / die / dry up / fade' },
    ],
    strokeCount: 9, level: 'N2', radical: '木',
  },
  {
    id: 'n2k325', kanji: '湿', readings: { on: ['シツ'], kun: ['しめ', 'じめ'] },
    meaning: 'damp / moist / humid / wet / moisture',
    examples: [
      { word: '湿度', reading: 'しつど', meaning: 'humidity / moisture level' },
      { word: '湿気', reading: 'しっき', meaning: 'humidity / moisture / dampness' },
      { word: '湿る', reading: 'しめる', meaning: 'to be damp / be moist / become wet' },
    ],
    strokeCount: 12, level: 'N2', radical: '水',
  },
  {
    id: 'n2k326', kanji: '腐', readings: { on: ['フ'], kun: ['くさ'] },
    meaning: 'rot / decay / spoil / corrode / putrefy',
    examples: [
      { word: '腐敗', reading: 'ふはい', meaning: 'corruption / decay / rot / decomposition' },
      { word: '防腐', reading: 'ぼうふ', meaning: 'antiseptic / preventing decay' },
      { word: '腐る', reading: 'くさる', meaning: 'to rot / spoil / go bad / decay' },
    ],
    strokeCount: 14, level: 'N2', radical: '肉',
  },
  {
    id: 'n2k327', kanji: '沈', readings: { on: ['チン'], kun: ['しず'] },
    meaning: 'sink / submerge / calm down / be depressed',
    examples: [
      { word: '沈没', reading: 'ちんぼつ', meaning: 'sinking / going under / submersion' },
      { word: '沈黙', reading: 'ちんもく', meaning: 'silence / stillness / quietness' },
      { word: '沈む', reading: 'しずむ', meaning: 'to sink / set (sun) / feel depressed' },
    ],
    strokeCount: 7, level: 'N2', radical: '水',
  },
  {
    id: 'n2k328', kanji: '彫', readings: { on: ['チョウ'], kun: ['ほ'] },
    meaning: 'carve / engrave / chisel / sculpt',
    examples: [
      { word: '彫刻', reading: 'ちょうこく', meaning: 'engraving / sculpture / carving' },
      { word: '彫像', reading: 'ちょうぞう', meaning: 'statue / carved figure / sculpture' },
      { word: '彫る', reading: 'ほる', meaning: 'to carve / engrave / chisel / sculpt' },
    ],
    strokeCount: 11, level: 'N2', radical: '彡',
  },
  {
    id: 'n2k329', kanji: '赴', readings: { on: ['フ'], kun: ['おもむ'] },
    meaning: 'go to / proceed to / move toward / be bound for',
    examples: [
      { word: '赴任', reading: 'ふにん', meaning: 'going to a new post / taking up a new position' },
      { word: '赴く', reading: 'おもむく', meaning: 'to go to / proceed to / head for / tend toward' },
      { word: '赴任先', reading: 'ふにんさき', meaning: 'new posting / new assignment location' },
    ],
    strokeCount: 9, level: 'N2', radical: '走',
  },
  {
    id: 'n2k330', kanji: '慰', readings: { on: ['イ'], kun: ['なぐさ'] },
    meaning: 'consolation / comfort / relieve / soothe',
    examples: [
      { word: '慰安', reading: 'いあん', meaning: 'consolation / comfort / entertainment' },
      { word: '慰労', reading: 'いろう', meaning: 'recognition of services / consolation' },
      { word: '慰める', reading: 'なぐさめる', meaning: 'to console / comfort / soothe / cheer' },
    ],
    strokeCount: 15, level: 'N2', radical: '心',
  },
  {
    id: 'n2k331', kanji: '献', readings: { on: ['ケン', 'コン'], kun: ['たてまつ'] },
    meaning: 'offering / dedicate / present / contribute',
    examples: [
      { word: '貢献', reading: 'こうけん', meaning: 'contribution / service / dedication' },
      { word: '献身', reading: 'けんしん', meaning: 'dedication / devotion / self-sacrifice' },
      { word: '文献', reading: 'ぶんけん', meaning: 'document / literature / reference' },
    ],
    strokeCount: 13, level: 'N2', radical: '犬',
  },
  {
    id: 'n2k332', kanji: '鑑', readings: { on: ['カン'], kun: ['かがみ'] },
    meaning: 'mirror / model / appreciate / consider',
    examples: [
      { word: '鑑定', reading: 'かんてい', meaning: 'expert opinion / judgement / appraisal' },
      { word: '鑑賞', reading: 'かんしょう', meaning: 'appreciation / enjoyment / viewing' },
      { word: '年鑑', reading: 'ねんかん', meaning: 'yearbook / almanac / annual report' },
    ],
    strokeCount: 23, level: 'N2', radical: '金',
  },
  {
    id: 'n2k333', kanji: '滑', readings: { on: ['カツ'], kun: ['すべ', 'なめ'] },
    meaning: 'slide / slip / glide / smooth / slippery',
    examples: [
      { word: '円滑', reading: 'えんかつ', meaning: 'smooth / harmonious / without friction' },
      { word: '潤滑', reading: 'じゅんかつ', meaning: 'lubrication / smooth functioning' },
      { word: '滑る', reading: 'すべる', meaning: 'to slide / slip / glide / skid' },
    ],
    strokeCount: 13, level: 'N2', radical: '水',
  },
  {
    id: 'n2k334', kanji: '暁', readings: { on: ['ギョウ'], kun: ['あかつき'] },
    meaning: 'dawn / daybreak / time of / if and when',
    examples: [
      { word: '早暁', reading: 'そうぎょう', meaning: 'early dawn / before daybreak' },
      { word: '暁には', reading: 'あかつきには', meaning: 'when ~ happens / in the event of' },
      { word: '払暁', reading: 'ふつぎょう', meaning: 'daybreak / dawn / break of day' },
    ],
    strokeCount: 12, level: 'N2', radical: '日',
  },
  {
    id: 'n2k335', kanji: '撤', readings: { on: ['テツ'], kun: [] },
    meaning: 'remove / withdraw / evacuate / pull out',
    examples: [
      { word: '撤退', reading: 'てったい', meaning: 'withdrawal / retreat / pullout' },
      { word: '撤収', reading: 'てっしゅう', meaning: 'withdrawal / removal / retreat' },
      { word: '撤廃', reading: 'てっぱい', meaning: 'abolition / elimination / doing away with' },
    ],
    strokeCount: 15, level: 'N2', radical: '手',
  },
  {
    id: 'n2k336', kanji: '拡', readings: { on: ['カク'], kun: ['ひろ'] },
    meaning: 'broaden / expand / extend / widen',
    examples: [
      { word: '拡充', reading: 'かくじゅう', meaning: 'expansion / enrichment / enhancement' },
      { word: '拡声器', reading: 'かくせいき', meaning: 'loudspeaker / amplifier' },
      { word: '拡がる', reading: 'ひろがる', meaning: 'to spread / expand / extend / widen' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k337', kanji: '棄', readings: { on: ['キ'], kun: ['す'] },
    meaning: 'abandon / throw away / discard / give up',
    examples: [
      { word: '廃棄', reading: 'はいき', meaning: 'disposal / abandonment / scrapping' },
      { word: '放棄', reading: 'ほうき', meaning: 'abandonment / giving up / relinquishment' },
      { word: '棄権', reading: 'きけん', meaning: 'abstention / forfeit / waiver of rights' },
    ],
    strokeCount: 13, level: 'N2', radical: '木',
  },
  {
    id: 'n2k338', kanji: '乾', readings: { on: ['カン'], kun: ['かわ', 'いぬい'] },
    meaning: 'dry / parch / become dry / northwest',
    examples: [
      { word: '乾燥', reading: 'かんそう', meaning: 'dryness / aridness / dehydration' },
      { word: '乾杯', reading: 'かんぱい', meaning: 'toast / cheers / drinking a toast' },
      { word: '乾く', reading: 'かわく', meaning: 'to get dry / become dry / dry up' },
    ],
    strokeCount: 11, level: 'N2', radical: '乙',
  },
  {
    id: 'n2k339', kanji: '岩', readings: { on: ['ガン'], kun: ['いわ'] },
    meaning: 'rock / boulder / crag / cliff',
    examples: [
      { word: '岩石', reading: 'がんせき', meaning: 'rock / stone' },
      { word: '溶岩', reading: 'ようがん', meaning: 'lava / molten rock' },
      { word: '岩場', reading: 'いわば', meaning: 'rocky area / rock face / rocky place' },
    ],
    strokeCount: 8, level: 'N2', radical: '山',
  },
  {
    id: 'n2k340', kanji: '稲', readings: { on: ['トウ'], kun: ['いね', 'いな'] },
    meaning: 'rice plant / paddy / rice (uncooked)',
    examples: [
      { word: '稲作', reading: 'いなさく', meaning: 'rice farming / rice cultivation' },
      { word: '稲穂', reading: 'いなほ', meaning: 'ear of rice / rice head' },
      { word: '水稲', reading: 'すいとう', meaning: 'wet rice / paddy rice' },
    ],
    strokeCount: 14, level: 'N2', radical: '禾',
  },
  {
    id: 'n2k341', kanji: '封', readings: { on: ['フウ', 'ホウ'], kun: [] },
    meaning: 'seal / envelope / close / block / confer',
    examples: [
      { word: '封筒', reading: 'ふうとう', meaning: 'envelope / letter cover' },
      { word: '封鎖', reading: 'ふうさ', meaning: 'blockade / sealing off / closure' },
      { word: '開封', reading: 'かいふう', meaning: 'opening / unsealing / breaking the seal' },
    ],
    strokeCount: 9, level: 'N2', radical: '寸',
  },
  {
    id: 'n2k342', kanji: '舶', readings: { on: ['ハク'], kun: [] },
    meaning: 'ocean-going ship / large vessel / steamship',
    examples: [
      { word: '船舶', reading: 'せんぱく', meaning: 'ships / vessels / maritime craft' },
      { word: '舶来', reading: 'はくらい', meaning: 'imported / foreign / from abroad' },
      { word: '外航船舶', reading: 'がいこうせんぱく', meaning: 'ocean-going vessel / overseas ship' },
    ],
    strokeCount: 11, level: 'N2', radical: '舟',
  },
  {
    id: 'n2k343', kanji: '繁', readings: { on: ['ハン'], kun: ['しげ'] },
    meaning: 'flourish / busy / prosperous / many / frequent',
    examples: [
      { word: '繁栄', reading: 'はんえい', meaning: 'prosperity / thriving / flourishing' },
      { word: '繁盛', reading: 'はんじょう', meaning: 'thriving / prosperity / doing good business' },
      { word: '繁忙', reading: 'はんぼう', meaning: 'very busy / hectic / rush period' },
    ],
    strokeCount: 16, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k344', kanji: '抵', readings: { on: ['テイ'], kun: [] },
    meaning: 'resist / touch / reach / collateral / be worth',
    examples: [
      { word: '抵抗', reading: 'ていこう', meaning: 'resistance / opposition / reluctance' },
      { word: '抵触', reading: 'ていしょく', meaning: 'conflict / contradiction / violation' },
      { word: '大抵', reading: 'たいてい', meaning: 'generally / mostly / usually / ordinarily' },
    ],
    strokeCount: 8, level: 'N2', radical: '手',
  },
  {
    id: 'n2k345', kanji: '倣', readings: { on: ['ホウ'], kun: ['なら'] },
    meaning: 'imitate / follow / emulate / model after',
    examples: [
      { word: '倣う', reading: 'ならう', meaning: 'to imitate / follow / model after' },
      { word: '模倣', reading: 'もほう', meaning: 'imitation / mimicry / copying' },
      { word: '見倣う', reading: 'みならう', meaning: 'to follow an example / learn from / emulate' },
    ],
    strokeCount: 10, level: 'N2', radical: '亻',
  },
  {
    id: 'n2k346', kanji: '掌', readings: { on: ['ショウ'], kun: ['てのひら'] },
    meaning: 'palm / control / manage / be in charge of',
    examples: [
      { word: '掌握', reading: 'しょうあく', meaning: 'grasp / control / command / taking hold of' },
      { word: '掌中', reading: 'しょうちゅう', meaning: 'in the palm of one\'s hand / under control' },
      { word: '手掌', reading: 'てのひら', meaning: 'palm of the hand' },
    ],
    strokeCount: 12, level: 'N2', radical: '手',
  },
  {
    id: 'n2k347', kanji: '脆', readings: { on: ['ゼイ'], kun: ['もろ'] },
    meaning: 'fragile / brittle / weak / frail / vulnerable',
    examples: [
      { word: '脆弱', reading: 'ぜいじゃく', meaning: 'fragile / weak / vulnerability / frailty' },
      { word: '脆さ', reading: 'もろさ', meaning: 'fragility / brittleness / weakness' },
      { word: '脆い', reading: 'もろい', meaning: 'fragile / brittle / weak / crumbly' },
    ],
    strokeCount: 10, level: 'N2', radical: '月',
  },
  {
    id: 'n2k348', kanji: '渡', readings: { on: ['ト'], kun: ['わた'] },
    meaning: 'cross / go over / hand over / pass through',
    examples: [
      { word: '渡航', reading: 'とこう', meaning: 'voyage / crossing / going abroad' },
      { word: '引き渡し', reading: 'ひきわたし', meaning: 'handover / delivery / extradition' },
      { word: '渡る', reading: 'わたる', meaning: 'to cross / go over / span / range' },
    ],
    strokeCount: 12, level: 'N2', radical: '水',
  },
  {
    id: 'n2k349', kanji: '縛', readings: { on: ['バク'], kun: ['しば'] },
    meaning: 'bind / tie / fasten / restrict / confine',
    examples: [
      { word: '束縛', reading: 'そくばく', meaning: 'restraint / restriction / shackles / binding' },
      { word: '呪縛', reading: 'じゅばく', meaning: 'a spell / curse / being in the grip of' },
      { word: '縛る', reading: 'しばる', meaning: 'to bind / tie / fasten / restrict' },
    ],
    strokeCount: 16, level: 'N2', radical: '糸',
  },
  {
    id: 'n2k350', kanji: '廊', readings: { on: ['ロウ'], kun: [] },
    meaning: 'corridor / hall / gallery / passageway',
    examples: [
      { word: '廊下', reading: 'ろうか', meaning: 'corridor / hallway / passageway' },
      { word: '画廊', reading: 'がろう', meaning: 'gallery / art gallery' },
      { word: '回廊', reading: 'かいろう', meaning: 'corridor / gallery / cloister' },
    ],
    strokeCount: 12, level: 'N2', radical: '广',
  },
  {
    id: 'n2k351', kanji: '凡', readings: { on: ['ボン', 'ハン'], kun: ['おおよ'] },
    meaning: 'ordinary / common / mediocre / generally',
    examples: [
      { word: '平凡', reading: 'へいぼん', meaning: 'ordinary / mediocre / commonplace' },
      { word: '非凡', reading: 'ひぼん', meaning: 'uncommon / extraordinary / exceptional' },
      { word: '凡そ', reading: 'およそ', meaning: 'generally / approximately / about / in general' },
    ],
    strokeCount: 3, level: 'N2', radical: '几',
  },
  {
    id: 'n2k352', kanji: '妥', readings: { on: ['ダ'], kun: [] },
    meaning: 'gentle / yielding / appropriate / suitable',
    examples: [
      { word: '妥協', reading: 'だきょう', meaning: 'compromise / concession / accommodation' },
      { word: '妥当', reading: 'だとう', meaning: 'appropriate / reasonable / proper / valid' },
      { word: '妥結', reading: 'だけつ', meaning: 'settlement / agreement / compromise' },
    ],
    strokeCount: 7, level: 'N2', radical: '女',
  },
  {
    id: 'n2k353', kanji: '淡', readings: { on: ['タン'], kun: ['あわ'] },
    meaning: 'light / faint / thin / dilute / pale',
    examples: [
      { word: '淡白', reading: 'たんぱく', meaning: 'light / simple / bland / plain' },
      { word: '冷淡', reading: 'れいたん', meaning: 'cold / indifferent / cool / unsympathetic' },
      { word: '淡い', reading: 'あわい', meaning: 'light / faint / pale / fleeting' },
    ],
    strokeCount: 11, level: 'N2', radical: '水',
  },
  {
    id: 'n2k354', kanji: '誘', readings: { on: ['ユウ'], kun: ['さそ'] },
    meaning: 'invite / tempt / entice / lure / induce',
    examples: [
      { word: '誘惑', reading: 'ゆうわく', meaning: 'temptation / allure / enticement' },
      { word: '誘導', reading: 'ゆうどう', meaning: 'guidance / induction / leading' },
      { word: '誘う', reading: 'さそう', meaning: 'to invite / ask / tempt / lure' },
    ],
    strokeCount: 14, level: 'N2', radical: '言',
  },
  {
    id: 'n2k355', kanji: '覧', readings: { on: ['ラン'], kun: [] },
    meaning: 'see / peruse / observe / look at / view',
    examples: [
      { word: '一覧', reading: 'いちらん', meaning: 'list / table / directory / overview' },
      { word: '博覧会', reading: 'はくらんかい', meaning: 'exposition / exhibition / world fair' },
      { word: '縦覧', reading: 'じゅうらん', meaning: 'public inspection / public viewing' },
    ],
    strokeCount: 17, level: 'N2', radical: '見',
  },
  {
    id: 'n2k356', kanji: '肝', readings: { on: ['カン'], kun: ['きも'] },
    meaning: 'liver / heart / vital / guts / courage',
    examples: [
      { word: '肝心', reading: 'かんじん', meaning: 'essential / important / crucial / vital' },
      { word: '肝臓', reading: 'かんぞう', meaning: 'liver (organ)' },
      { word: '肝試し', reading: 'きもだめし', meaning: 'test of courage / dare / ghost hunt' },
    ],
    strokeCount: 7, level: 'N2', radical: '月',
  },
  {
    id: 'n2k357', kanji: '吟', readings: { on: ['ギン'], kun: [] },
    meaning: 'chant / recite / compose verse / groan',
    examples: [
      { word: '吟味', reading: 'ぎんみ', meaning: 'careful consideration / scrutiny / selection' },
      { word: '詩吟', reading: 'しぎん', meaning: 'recitation of Chinese poetry' },
      { word: '吟醸', reading: 'ぎんじょう', meaning: 'high-quality sake / special brew' },
    ],
    strokeCount: 7, level: 'N2', radical: '口',
  },
  {
    id: 'n2k358', kanji: '廉', readings: { on: ['レン'], kun: [] },
    meaning: 'cheap / inexpensive / honest / upright',
    examples: [
      { word: '廉価', reading: 'れんか', meaning: 'low price / bargain price / cheap' },
      { word: '清廉', reading: 'せいれん', meaning: 'upright / honest / pure / incorruptible' },
      { word: '廉潔', reading: 'れんけつ', meaning: 'integrity / uprightness / honesty' },
    ],
    strokeCount: 13, level: 'N2', radical: '广',
  },
  {
    id: 'n2k359', kanji: '翌', readings: { on: ['ヨク'], kun: [] },
    meaning: 'the next (day) / following / the morrow',
    examples: [
      { word: '翌日', reading: 'よくじつ', meaning: 'the next day / the following day' },
      { word: '翌朝', reading: 'よくあさ', meaning: 'the next morning / the following morning' },
      { word: '翌年', reading: 'よくねん', meaning: 'the following year / next year' },
    ],
    strokeCount: 11, level: 'N2', radical: '羽',
  },
  {
    id: 'n2k360', kanji: '剰', readings: { on: ['ジョウ'], kun: ['あまつさ'] },
    meaning: 'surplus / remainder / excess / moreover',
    examples: [
      { word: '余剰', reading: 'よじょう', meaning: 'surplus / excess / redundancy' },
      { word: '過剰', reading: 'かじょう', meaning: 'excess / surplus / overabundance' },
      { word: '剰余', reading: 'じょうよ', meaning: 'remainder / surplus / residue' },
    ],
    strokeCount: 11, level: 'N2', radical: '刀',
  },
  {
    id: 'n2k361', kanji: '奇', readings: { on: ['キ'], kun: ['く'] },
    meaning: 'strange / odd / curious / wonderful / rare',
    examples: [
      { word: '奇妙', reading: 'きみょう', meaning: 'strange / odd / peculiar / mysterious' },
      { word: '奇跡', reading: 'きせき', meaning: 'miracle / wonder / marvel' },
      { word: '好奇心', reading: 'こうきしん', meaning: 'curiosity / inquiring mind' },
    ],
    strokeCount: 8, level: 'N2', radical: '大',
  },
  {
    id: 'n2k362', kanji: '沢', readings: { on: ['タク'], kun: ['さわ', 'つや'] },
    meaning: 'swamp / marsh / glossy / many / grace',
    examples: [
      { word: '光沢', reading: 'こうたく', meaning: 'gloss / lustre / sheen / brightness' },
      { word: '恩沢', reading: 'おんたく', meaning: 'grace / blessing / favour' },
      { word: '沢山', reading: 'たくさん', meaning: 'many / a lot / plenty / much' },
    ],
    strokeCount: 7, level: 'N2', radical: '水',
  },
  {
    id: 'n2k363', kanji: '霊', readings: { on: ['レイ', 'リョウ'], kun: ['たま'] },
    meaning: 'soul / spirit / ghost / divine power',
    examples: [
      { word: '霊魂', reading: 'れいこん', meaning: 'soul / spirit' },
      { word: '幽霊', reading: 'ゆうれい', meaning: 'ghost / phantom / apparition' },
      { word: '心霊', reading: 'しんれい', meaning: 'spirit / spiritual / psychic' },
    ],
    strokeCount: 15, level: 'N2', radical: '雨',
  },
  {
    id: 'n2k364', kanji: '弧', readings: { on: ['コ'], kun: [] },
    meaning: 'arc / bow (shape) / curved line',
    examples: [
      { word: '弧線', reading: 'こせん', meaning: 'arc / curve / curved line' },
      { word: '円弧', reading: 'えんこ', meaning: 'arc of a circle' },
      { word: '括弧', reading: 'かっこ', meaning: 'parentheses / brackets' },
    ],
    strokeCount: 9, level: 'N2', radical: '弓',
  },
  {
    id: 'n2k365', kanji: '吐', readings: { on: ['ト'], kun: ['は', 'つ'] },
    meaning: 'vomit / spew / breathe out / say / emit',
    examples: [
      { word: '吐き気', reading: 'はきけ', meaning: 'nausea / feeling sick / queasiness' },
      { word: '嘔吐', reading: 'おうと', meaning: 'vomiting / nausea / emesis' },
      { word: '吐く', reading: 'はく', meaning: 'to vomit / spit / exhale / say / emit' },
    ],
    strokeCount: 6, level: 'N2', radical: '口',
  },
  {
    id: 'n2k366', kanji: '奔', readings: { on: ['ホン'], kun: ['はし'] },
    meaning: 'run / dash / rush / hurry / flee',
    examples: [
      { word: '奔走', reading: 'ほんそう', meaning: 'running about / being very busy / working hard' },
      { word: '奔放', reading: 'ほんぽう', meaning: 'free / unrestrained / wild / uninhibited' },
      { word: '出奔', reading: 'しゅっぽん', meaning: 'running away / fleeing / absconding' },
    ],
    strokeCount: 8, level: 'N2', radical: '大',
  },
  {
    id: 'n2k367', kanji: '寮', readings: { on: ['リョウ'], kun: [] },
    meaning: 'dormitory / hostel / villa / government office',
    examples: [
      { word: '寮生', reading: 'りょうせい', meaning: 'dormitory student / boarder / resident student' },
      { word: '社員寮', reading: 'しゃいんりょう', meaning: 'company dormitory / staff housing' },
      { word: '学生寮', reading: 'がくせいりょう', meaning: 'student dormitory / student hostel' },
    ],
    strokeCount: 15, level: 'N2', radical: '宀',
  },
];

export default n2Kanji;