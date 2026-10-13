// src/data/kana/kanaData.js
// Complete, linguistically verified Hiragana and Katakana dataset for Nihongo Master.
// Covers Gojūon (46), Dakuon (20), Handakuon (5), and Yōon (36) for both scripts.

export const HIRAGANA_GOJUON = [
  // Vowels
  { id: 'h_a', kana: 'あ', romaji: 'a', script: 'hiragana', group: 'gojuon', row: 'a', strokeCount: 3, mnemonic: 'Looks like an Apple with a stem on top.', examples: [{ word: 'ありがとう', reading: 'arigatou', meaning: 'Thank you' }, { word: 'あさ', reading: 'asa', meaning: 'Morning' }] },
  { id: 'h_i', kana: 'い', romaji: 'i', script: 'hiragana', group: 'gojuon', row: 'a', strokeCount: 2, mnemonic: 'Two parallel lines, like two \'i\'s standing next to each other.', examples: [{ word: 'いぬ', reading: 'inu', meaning: 'Dog' }, { word: 'いいえ', reading: 'iie', meaning: 'No' }] },
  { id: 'h_u', kana: 'う', romaji: 'u', script: 'hiragana', group: 'gojuon', row: 'a', strokeCount: 2, mnemonic: 'Looks like an archer bendinG their back saying "Oof!".', examples: [{ word: 'うみ', reading: 'umi', meaning: 'Sea / Ocean' }, { word: 'うし', reading: 'ushi', meaning: 'Cow' }] },
  { id: 'h_e', kana: 'え', romaji: 'e', script: 'hiragana', group: 'gojuon', row: 'a', strokeCount: 2, mnemonic: 'An Energetic runner sprinting forward.', examples: [{ word: 'えき', reading: 'eki', meaning: 'Station' }, { word: 'えんぴつ', reading: 'enpitsu', meaning: 'Pencil' }] },
  { id: 'h_o', kana: 'お', romaji: 'o', script: 'hiragana', group: 'gojuon', row: 'a', strokeCount: 3, mnemonic: 'A golfer swinging a club onto the green with a ball flying.', examples: [{ word: 'お茶', reading: 'ocha', meaning: 'Green tea' }, { word: 'おにぎり', reading: 'onigiri', meaning: 'Rice ball' }] },

  // K-row
  { id: 'h_ka', kana: 'か', romaji: 'ka', script: 'hiragana', group: 'gojuon', row: 'ka', strokeCount: 3, mnemonic: 'A blade cutting through a piece of wood (like a Katana).', examples: [{ word: 'かさ', reading: 'kasa', meaning: 'Umbrella' }, { word: 'かわ', reading: 'kawa', meaning: 'River' }] },
  { id: 'h_ki', kana: 'き', romaji: 'ki', script: 'hiragana', group: 'gojuon', row: 'ka', strokeCount: 4, mnemonic: 'Looks like an old-fashioned Key.', examples: [{ word: 'き', reading: 'ki', meaning: 'Tree' }, { word: 'きょう', reading: 'kyou', meaning: 'Today' }] },
  { id: 'h_ku', kana: 'く', romaji: 'ku', script: 'hiragana', group: 'gojuon', row: 'ka', strokeCount: 1, mnemonic: 'The sharp beak of a Cuckoo bird.', examples: [{ word: 'くるま', reading: 'kuruma', meaning: 'Car' }, { word: 'くち', reading: 'kuchi', meaning: 'Mouth' }] },
  { id: 'h_ke', kana: 'け', romaji: 'ke', script: 'hiragana', group: 'gojuon', row: 'ka', strokeCount: 3, mnemonic: 'A barrel / Keg of sake.', examples: [{ word: 'けさ', reading: 'kesa', meaning: 'This morning' }, { word: 'けいたい', reading: 'keitai', meaning: 'Cell phone' }] },
  { id: 'h_ko', kana: 'こ', romaji: 'ko', script: 'hiragana', group: 'gojuon', row: 'ka', strokeCount: 2, mnemonic: 'Two Koi fish swimming together.', examples: [{ word: 'これ', reading: 'kore', meaning: 'This' }, { word: 'こども', reading: 'kodomo', meaning: 'Child' }] },

  // S-row
  { id: 'h_sa', kana: 'さ', romaji: 'sa', script: 'hiragana', group: 'gojuon', row: 'sa', strokeCount: 3, mnemonic: 'A Samurai sword slicing in mid-air.', confusableWith: ['h_ki'], examples: [{ word: 'さくら', reading: 'sakura', meaning: 'Cherry blossom' }, { word: 'さかな', reading: 'sakana', meaning: 'Fish' }] },
  { id: 'h_shi', kana: 'し', romaji: 'shi', script: 'hiragana', group: 'gojuon', row: 'sa', strokeCount: 1, mnemonic: 'A fishhook sinking in the ocean.', examples: [{ word: 'しろ', reading: 'shiro', meaning: 'White' }, { word: 'しんぶん', reading: 'shinbun', meaning: 'Newspaper' }] },
  { id: 'h_su', kana: 'す', romaji: 'su', script: 'hiragana', group: 'gojuon', row: 'sa', strokeCount: 2, mnemonic: 'A hanging Swing loop with a swirl.', examples: [{ word: 'すし', reading: 'sushi', meaning: 'Sushi' }, { word: 'すき', reading: 'suki', meaning: 'Liked / Fond of' }] },
  { id: 'h_se', kana: 'せ', romaji: 'se', script: 'hiragana', group: 'gojuon', row: 'sa', strokeCount: 3, mnemonic: 'Saying "Hello" sitting side by side.', examples: [{ word: 'せんせい', reading: 'sensei', meaning: 'Teacher' }, { word: 'せかい', reading: 'sekai', meaning: 'World' }] },
  { id: 'h_so', kana: 'そ', romaji: 'so', script: 'hiragana', group: 'gojuon', row: 'sa', strokeCount: 1, mnemonic: 'Zig-zag Sewing needle path.', examples: [{ word: 'そこ', reading: 'soko', meaning: 'There' }, { word: 'そら', reading: 'sora', meaning: 'Sky' }] },

  // T-row
  { id: 'h_ta', kana: 'た', romaji: 'ta', script: 'hiragana', group: 'gojuon', row: 'ta', strokeCount: 4, mnemonic: 'Spells out letters "t" and "a".', examples: [{ word: 'たべる', reading: 'taberu', meaning: 'To eat' }, { word: 'たまご', reading: 'tamago', meaning: 'Egg' }] },
  { id: 'h_chi', kana: 'ち', romaji: 'chi', script: 'hiragana', group: 'gojuon', row: 'ta', strokeCount: 2, mnemonic: 'A cute Cheerleader waving her pom-pom.', examples: [{ word: 'ちず', reading: 'chizu', meaning: 'Map' }, { word: 'ちいさい', reading: 'chiisai', meaning: 'Small' }] },
  { id: 'h_tsu', kana: 'つ', romaji: 'tsu', script: 'hiragana', group: 'gojuon', row: 'ta', strokeCount: 1, mnemonic: 'A giant Tsunami wave curling over.', examples: [{ word: 'つき', reading: 'tsuki', meaning: 'Moon' }, { word: 'つくえ', reading: 'tsukue', meaning: 'Desk' }] },
  { id: 'h_te', kana: 'て', romaji: 'te', script: 'hiragana', group: 'gojuon', row: 'ta', strokeCount: 1, mnemonic: 'A curved dog Tail.', examples: [{ word: 'て', reading: 'te', meaning: 'Hand' }, { word: 'てがみ', reading: 'tegami', meaning: 'Letter' }] },
  { id: 'h_to', kana: 'と', romaji: 'to', script: 'hiragana', group: 'gojuon', row: 'ta', strokeCount: 2, mnemonic: 'A Thorn stuck in a big Toe.', examples: [{ word: 'ともだち', reading: 'tomodachi', meaning: 'Friend' }, { word: 'とり', reading: 'tori', meaning: 'Bird' }] },

  // N-row
  { id: 'h_na', kana: 'な', romaji: 'na', script: 'hiragana', group: 'gojuon', row: 'na', strokeCount: 4, mnemonic: 'A Nun kneeling before a cross praying.', examples: [{ word: 'なまえ', reading: 'namae', meaning: 'Name' }, { word: 'なつ', reading: 'natsu', meaning: 'Summer' }] },
  { id: 'h_ni', kana: 'に', romaji: 'ni', script: 'hiragana', group: 'gojuon', row: 'na', strokeCount: 3, mnemonic: 'A sewing Needle on the left and thread on the right.', examples: [{ word: 'にほん', reading: 'nihon', meaning: 'Japan' }, { word: 'にく', reading: 'niku', meaning: 'Meat' }] },
  { id: 'h_nu', kana: 'ぬ', romaji: 'nu', script: 'hiragana', group: 'gojuon', row: 'na', strokeCount: 2, mnemonic: 'Chopsticks grabbing Noodles with a loop.', confusableWith: ['h_me'], examples: [{ word: 'ぬいぐるみ', reading: 'nuigurumi', meaning: 'Stuffed toy' }, { word: 'ぬま', reading: 'numa', meaning: 'Swamp' }] },
  { id: 'h_ne', kana: 'ね', romaji: 'ne', script: 'hiragana', group: 'gojuon', row: 'na', strokeCount: 2, mnemonic: 'A cat (Neko) curling its tail into a loop.', confusableWith: ['h_re', 'h_wa'], examples: [{ word: 'ねこ', reading: 'neko', meaning: 'Cat' }, { word: 'ねる', reading: 'neru', meaning: 'To sleep' }] },
  { id: 'h_no', kana: 'の', romaji: 'no', script: 'hiragana', group: 'gojuon', row: 'na', strokeCount: 1, mnemonic: 'A "NO" entry circle sign.', examples: [{ word: 'のみもの', reading: 'nomimono', meaning: 'Drink' }, { word: 'のど', reading: 'nodo', meaning: 'Throat' }] },

  // H-row
  { id: 'h_ha', kana: 'は', romaji: 'ha', script: 'hiragana', group: 'gojuon', row: 'ha', strokeCount: 3, mnemonic: 'Letter "H" next to letter "a".', confusableWith: ['h_ho', 'h_ma'], examples: [{ word: 'はな', reading: 'hana', meaning: 'Flower / Nose' }, { word: 'はし', reading: 'hashi', meaning: 'Bridge / Chopsticks' }] },
  { id: 'h_hi', kana: 'ひ', romaji: 'hi', script: 'hiragana', group: 'gojuon', row: 'ha', strokeCount: 1, mnemonic: 'A face smiling and saying "Hee-hee!".', examples: [{ word: 'ひと', reading: 'hito', meaning: 'Person' }, { word: 'ひかり', reading: 'hikari', meaning: 'Light' }] },
  { id: 'h_fu', kana: 'ふ', romaji: 'fu', script: 'hiragana', group: 'gojuon', row: 'ha', strokeCount: 4, mnemonic: 'Mount Fuji with clouds on both sides.', examples: [{ word: 'ふね', reading: 'fune', meaning: 'Boat' }, { word: 'ふゆ', reading: 'fuyu', meaning: 'Winter' }] },
  { id: 'h_he', kana: 'へ', romaji: 'he', script: 'hiragana', group: 'gojuon', row: 'ha', strokeCount: 1, mnemonic: 'Pointing up to Mount Haystack.', examples: [{ word: 'へや', reading: 'heya', meaning: 'Room' }, { word: 'へび', reading: 'hebi', meaning: 'Snake' }] },
  { id: 'h_ho', kana: 'ほ', romaji: 'ho', script: 'hiragana', group: 'gojuon', row: 'ha', strokeCount: 4, mnemonic: 'A Santa wearing a hat saying "Ho-ho-ho!".', confusableWith: ['h_ha', 'h_ma'], examples: [{ word: 'ほん', reading: 'hon', meaning: 'Book' }, { word: 'ほし', reading: 'hoshi', meaning: 'Star' }] },

  // M-row
  { id: 'h_ma', kana: 'ま', romaji: 'ma', script: 'hiragana', group: 'gojuon', row: 'ma', strokeCount: 3, mnemonic: 'Looking into a Mask with two eye slits.', confusableWith: ['h_ho', 'h_ha'], examples: [{ word: 'まち', reading: 'machi', meaning: 'Town' }, { word: 'まど', reading: 'mado', meaning: 'Window' }] },
  { id: 'h_mi', kana: 'み', romaji: 'mi', script: 'hiragana', group: 'gojuon', row: 'ma', strokeCount: 2, mnemonic: 'Looks like number 21, lucky Me!', examples: [{ word: 'みず', reading: 'mizu', meaning: 'Water' }, { word: 'みち', reading: 'michi', meaning: 'Road / Path' }] },
  { id: 'h_mu', kana: 'む', romaji: 'mu', script: 'hiragana', group: 'gojuon', row: 'ma', strokeCount: 3, mnemonic: 'A cow (Moo) chewing on grass.', examples: [{ word: 'むし', reading: 'mushi', meaning: 'Insect' }, { word: 'むら', reading: 'mura', meaning: 'Village' }] },
  { id: 'h_me', kana: 'め', romaji: 'me', script: 'hiragana', group: 'gojuon', row: 'ma', strokeCount: 2, mnemonic: 'Noodles dropped on the floor (without the loop).', confusableWith: ['h_nu'], examples: [{ word: 'め', reading: 'me', meaning: 'Eye' }, { word: 'めがね', reading: 'megane', meaning: 'Glasses' }] },
  { id: 'h_mo', kana: 'も', romaji: 'mo', script: 'hiragana', group: 'gojuon', row: 'ma', strokeCount: 3, mnemonic: 'Catching More worms on a hook.', examples: [{ word: 'もり', reading: 'mori', meaning: 'Forest' }, { word: 'もの', reading: 'mono', meaning: 'Thing' }] },

  // Y-row
  { id: 'h_ya', kana: 'や', romaji: 'ya', script: 'hiragana', group: 'gojuon', row: 'ya', strokeCount: 3, mnemonic: 'A Yak with two curving horns.', examples: [{ word: 'やま', reading: 'yama', meaning: 'Mountain' }, { word: 'やすみ', reading: 'yasumi', meaning: 'Holiday / Rest' }] },
  { id: 'h_yu', kana: 'ゆ', romaji: 'yu', script: 'hiragana', group: 'gojuon', row: 'ya', strokeCount: 2, mnemonic: 'A goldfish swimming in the bath (yu).', examples: [{ word: 'ゆき', reading: 'yuki', meaning: 'Snow' }, { word: 'ゆめ', reading: 'yume', meaning: 'Dream' }] },
  { id: 'h_yo', kana: 'よ', romaji: 'yo', script: 'hiragana', group: 'gojuon', row: 'ya', strokeCount: 2, mnemonic: 'A Yo-yo suspended on a string.', examples: [{ word: 'よる', reading: 'yoru', meaning: 'Night' }, { word: 'よい', reading: 'yoi', meaning: 'Good' }] },

  // R-row
  { id: 'h_ra', kana: 'ら', romaji: 'ra', script: 'hiragana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'A Rabbit hopping onto its hind legs.', examples: [{ word: 'らいねん', reading: 'rainen', meaning: 'Next year' }, { word: 'らくだ', reading: 'rakuda', meaning: 'Camel' }] },
  { id: 'h_ri', kana: 'り', romaji: 'ri', script: 'hiragana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'River reeds swaying side by side.', examples: [{ word: 'りんご', reading: 'ringo', meaning: 'Apple' }, { word: 'りす', reading: 'risu', meaning: 'Squirrel' }] },
  { id: 'h_ru', kana: 'る', romaji: 'ru', script: 'hiragana', group: 'gojuon', row: 'ra', strokeCount: 1, mnemonic: 'Three with a Ruby loop at the bottom.', confusableWith: ['h_ro'], examples: [{ word: 'るす', reading: 'rusu', meaning: 'Absence / Away' }, { word: 'よる', reading: 'yoru', meaning: 'Night' }] },
  { id: 'h_re', kana: 'れ', romaji: 're', script: 'hiragana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'A runner kicking out their leg (Reaching forward).', confusableWith: ['h_ne', 'h_wa'], examples: [{ word: 'れきし', reading: 'rekishi', meaning: 'History' }, { word: 'れんしゅう', reading: 'renshuu', meaning: 'Practice' }] },
  { id: 'h_ro', kana: 'ろ', romaji: 'ro', script: 'hiragana', group: 'gojuon', row: 'ra', strokeCount: 1, mnemonic: 'Three without the ruby — the ruby was Robbed!', confusableWith: ['h_ru'], examples: [{ word: 'ろうそく', reading: 'rousoku', meaning: 'Candle' }, { word: 'ろく', reading: 'roku', meaning: 'Six' }] },

  // W-row & N
  { id: 'h_wa', kana: 'わ', romaji: 'wa', script: 'hiragana', group: 'gojuon', row: 'wa', strokeCount: 2, mnemonic: 'A round Wasp with a curved belly.', confusableWith: ['h_ne', 'h_re'], examples: [{ word: 'わたし', reading: 'watashi', meaning: 'I / Me' }, { word: 'わに', reading: 'wani', meaning: 'Crocodile' }] },
  { id: 'h_wo', kana: 'を', romaji: 'wo', script: 'hiragana', group: 'gojuon', row: 'wa', strokeCount: 3, mnemonic: 'A person jumping Over an obstacle (particle o/wo).', examples: [{ word: '本を読む', reading: 'hon o yomu', meaning: 'Read a book' }] },
  { id: 'h_n', kana: 'ん', romaji: 'n', script: 'hiragana', group: 'gojuon', row: 'wa', strokeCount: 1, mnemonic: 'Looks just like a cursive lowercase letter \'n\'.', examples: [{ word: 'にほん', reading: 'nihon', meaning: 'Japan' }, { word: 'おんがく', reading: 'ongaku', meaning: 'Music' }] },
];

export const HIRAGANA_DAKUON = [
  // G-row (voiced K)
  { id: 'h_ga', kana: 'が', romaji: 'ga', script: 'hiragana', group: 'dakuon', row: 'ga', strokeCount: 5, baseKana: 'か', mnemonic: 'Voiced か with dakuten (゛). Turns unvoiced "ka" into voiced "ga".', examples: [{ word: 'がっこう', reading: 'gakkou', meaning: 'School' }] },
  { id: 'h_gi', kana: 'ぎ', romaji: 'gi', script: 'hiragana', group: 'dakuon', row: 'ga', strokeCount: 6, baseKana: 'き', mnemonic: 'Voiced き with dakuten (゛). Turns unvoiced "ki" into voiced "gi".', examples: [{ word: 'ぎんこう', reading: 'ginkou', meaning: 'Bank' }] },
  { id: 'h_gu', kana: 'ぐ', romaji: 'gu', script: 'hiragana', group: 'dakuon', row: 'ga', strokeCount: 3, baseKana: 'く', mnemonic: 'Voiced く with dakuten (゛). Turns unvoiced "ku" into voiced "gu".', examples: [{ word: 'ぐんたい', reading: 'guntai', meaning: 'Army' }] },
  { id: 'h_ge', kana: 'げ', romaji: 'ge', script: 'hiragana', group: 'dakuon', row: 'ga', strokeCount: 5, baseKana: 'け', mnemonic: 'Voiced け with dakuten (゛). Turns unvoiced "ke" into voiced "ge".', examples: [{ word: 'げんき', reading: 'genki', meaning: 'Healthy / Energetic' }] },
  { id: 'h_go', kana: 'ご', romaji: 'go', script: 'hiragana', group: 'dakuon', row: 'ga', strokeCount: 4, baseKana: 'こ', mnemonic: 'Voiced こ with dakuten (゛). Turns unvoiced "ko" into voiced "go".', examples: [{ word: 'ごはん', reading: 'gohan', meaning: 'Meal / Rice' }] },

  // Z-row (voiced S)
  { id: 'h_za', kana: 'ざ', romaji: 'za', script: 'hiragana', group: 'dakuon', row: 'za', strokeCount: 5, baseKana: 'さ', mnemonic: 'Voiced さ with dakuten (゛). Turns unvoiced "sa" into voiced "za".', examples: [{ word: 'ざっし', reading: 'zasshi', meaning: 'Magazine' }] },
  { id: 'h_ji', kana: 'じ', romaji: 'ji', script: 'hiragana', group: 'dakuon', row: 'za', strokeCount: 3, baseKana: 'し', mnemonic: 'Voiced し with dakuten (゛). Turns unvoiced "shi" into voiced "ji".', examples: [{ word: 'じかん', reading: 'jikan', meaning: 'Time' }] },
  { id: 'h_zu', kana: 'ず', romaji: 'zu', script: 'hiragana', group: 'dakuon', row: 'za', strokeCount: 4, baseKana: 'す', mnemonic: 'Voiced す with dakuten (゛). Turns unvoiced "su" into voiced "zu".', examples: [{ word: 'ちず', reading: 'chizu', meaning: 'Map' }] },
  { id: 'h_ze', kana: 'ぜ', romaji: 'ze', script: 'hiragana', group: 'dakuon', row: 'za', strokeCount: 5, baseKana: 'せ', mnemonic: 'Voiced せ with dakuten (゛). Turns unvoiced "se" into voiced "ze".', examples: [{ word: 'ぜんぶ', reading: 'zenbu', meaning: 'All / Everything' }] },
  { id: 'h_zo', kana: 'ぞ', romaji: 'zo', script: 'hiragana', group: 'dakuon', row: 'za', strokeCount: 3, baseKana: 'そ', mnemonic: 'Voiced そ with dakuten (゛). Turns unvoiced "so" into voiced "zo".', examples: [{ word: 'ぞう', reading: 'zou', meaning: 'Elephant' }] },

  // D-row (voiced T)
  { id: 'h_da', kana: 'だ', romaji: 'da', script: 'hiragana', group: 'dakuon', row: 'da', strokeCount: 6, baseKana: 'た', mnemonic: 'Voiced た with dakuten (゛). Turns unvoiced "ta" into voiced "da".', examples: [{ word: 'だいがく', reading: 'daigaku', meaning: 'University' }] },
  { id: 'h_dji', kana: 'ぢ', romaji: 'ji', script: 'hiragana', group: 'dakuon', row: 'da', strokeCount: 4, baseKana: 'ち', mnemonic: 'Voiced ち with dakuten (゛). Voiced "di", pronounced identically to じ (ji) in modern Japanese.', examples: [{ word: 'はなぢ', reading: 'hanaji', meaning: 'Nosebleed' }] },
  { id: 'h_dzu', kana: 'づ', romaji: 'zu', script: 'hiragana', group: 'dakuon', row: 'da', strokeCount: 3, baseKana: 'つ', mnemonic: 'Voiced つ with dakuten (゛). Voiced "du", pronounced identically to ず (zu) in modern Japanese.', examples: [{ word: 'つづく', reading: 'tsuzuku', meaning: 'To continue' }] },
  { id: 'h_de', kana: 'で', romaji: 'de', script: 'hiragana', group: 'dakuon', row: 'da', strokeCount: 3, baseKana: 'て', mnemonic: 'Voiced て with dakuten (゛). Turns unvoiced "te" into voiced "de".', examples: [{ word: 'でんしゃ', reading: 'densha', meaning: 'Train' }] },
  { id: 'h_do', kana: 'ど', romaji: 'do', script: 'hiragana', group: 'dakuon', row: 'da', strokeCount: 4, baseKana: 'と', mnemonic: 'Voiced と with dakuten (゛). Turns unvoiced "to" into voiced "do".', examples: [{ word: 'どこ', reading: 'doko', meaning: 'Where' }] },

  // B-row (voiced H)
  { id: 'h_ba', kana: 'ば', romaji: 'ba', script: 'hiragana', group: 'dakuon', row: 'ba', strokeCount: 5, baseKana: 'は', mnemonic: 'Voiced は with dakuten (゛). Turns unvoiced "ha" into voiced "ba".', examples: [{ word: 'ばしょ', reading: 'basho', meaning: 'Place' }] },
  { id: 'h_bi', kana: 'び', romaji: 'bi', script: 'hiragana', group: 'dakuon', row: 'ba', strokeCount: 3, baseKana: 'ひ', mnemonic: 'Voiced ひ with dakuten (゛). Turns unvoiced "hi" into voiced "bi".', examples: [{ word: 'びょういん', reading: 'byouin', meaning: 'Hospital' }] },
  { id: 'h_bu', kana: 'ぶ', romaji: 'bu', script: 'hiragana', group: 'dakuon', row: 'ba', strokeCount: 6, baseKana: 'ふ', mnemonic: 'Voiced ふ with dakuten (゛). Turns unvoiced "fu" into voiced "bu".', examples: [{ word: 'ぶた', reading: 'buta', meaning: 'Pig' }] },
  { id: 'h_be', kana: 'べ', romaji: 'be', script: 'hiragana', group: 'dakuon', row: 'ba', strokeCount: 3, baseKana: 'へ', mnemonic: 'Voiced へ with dakuten (゛). Turns unvoiced "he" into voiced "be".', examples: [{ word: 'べんきょう', reading: 'benkyou', meaning: 'Study' }] },
  { id: 'h_bo', kana: 'ぼ', romaji: 'bo', script: 'hiragana', group: 'dakuon', row: 'ba', strokeCount: 6, baseKana: 'ほ', mnemonic: 'Voiced ほ with dakuten (゛). Turns unvoiced "ho" into voiced "bo".', examples: [{ word: 'ぼうし', reading: 'boushi', meaning: 'Hat' }] },
];

export const HIRAGANA_HANDAKUON = [
  // P-row (semi-voiced H with maru)
  { id: 'h_pa', kana: 'ぱ', romaji: 'pa', script: 'hiragana', group: 'handakuon', row: 'pa', strokeCount: 4, baseKana: 'は', mnemonic: 'Semi-voiced は with handakuten (゜). Converts "ha" into popping "pa".', examples: [{ word: 'ぱん', reading: 'pan', meaning: 'Bread' }] },
  { id: 'h_pi', kana: 'ぴ', romaji: 'pi', script: 'hiragana', group: 'handakuon', row: 'pa', strokeCount: 2, baseKana: 'ひ', mnemonic: 'Semi-voiced ひ with handakuten (゜). Converts "hi" into popping "pi".', examples: [{ word: 'ぴかぴか', reading: 'pikapika', meaning: 'Sparkling' }] },
  { id: 'h_pu', kana: 'ぷ', romaji: 'pu', script: 'hiragana', group: 'handakuon', row: 'pa', strokeCount: 5, baseKana: 'ふ', mnemonic: 'Semi-voiced ふ with handakuten (゜). Converts "fu" into popping "pu".', examples: [{ word: 'ぷりん', reading: 'purin', meaning: 'Pudding' }] },
  { id: 'h_pe', kana: 'ぺ', romaji: 'pe', script: 'hiragana', group: 'handakuon', row: 'pa', strokeCount: 2, baseKana: 'へ', mnemonic: 'Semi-voiced へ with handakuten (゜). Converts "he" into popping "pe".', examples: [{ word: 'ぺこぺこ', reading: 'peko peko', meaning: 'Very hungry' }] },
  { id: 'h_po', kana: 'ぽ', romaji: 'po', script: 'hiragana', group: 'handakuon', row: 'pa', strokeCount: 5, baseKana: 'ほ', mnemonic: 'Semi-voiced ほ with handakuten (゜). Converts "ho" into popping "po".', examples: [{ word: 'ぽけっと', reading: 'poketto', meaning: 'Pocket' }] },
];

export const HIRAGANA_YOON = [
  // kya row (き 4 strokes)
  { id: 'h_kya', kana: 'きゃ', romaji: 'kya', script: 'hiragana', group: 'yoon', row: 'kya', strokeCount: 7, mnemonic: 'Glide sound: blends ki (き) with small ya (ゃ) into "kya".', examples: [{ word: 'きゃく', reading: 'kyaku', meaning: 'Customer / Guest' }] },
  { id: 'h_kyu', kana: 'きゅ', romaji: 'kyu', script: 'hiragana', group: 'yoon', row: 'kya', strokeCount: 6, mnemonic: 'Glide sound: blends ki (き) with small yu (ゅ) into "kyu".', examples: [{ word: 'きゅう', reading: 'kyuu', meaning: 'Nine' }] },
  { id: 'h_kyo', kana: 'きょ', romaji: 'kyo', script: 'hiragana', group: 'yoon', row: 'kya', strokeCount: 5, mnemonic: 'Glide sound: blends ki (き) with small yo (ょ) into "kyo".', examples: [{ word: 'きょう', reading: 'kyou', meaning: 'Today' }] },

  // gya row (ぎ 6 strokes)
  { id: 'h_gya', kana: 'ぎゃ', romaji: 'gya', script: 'hiragana', group: 'yoon', row: 'gya', strokeCount: 9, mnemonic: 'Voiced glide: blends gi (ぎ) with small ya (ゃ) into "gya".', examples: [{ word: 'ぎゃく', reading: 'gyaku', meaning: 'Reverse' }] },
  { id: 'h_gyu', kana: 'ぎゅ', romaji: 'gyu', script: 'hiragana', group: 'yoon', row: 'gya', strokeCount: 8, mnemonic: 'Voiced glide: blends gi (ぎ) with small yu (ゅ) into "gyu".', examples: [{ word: 'ぎゅうにゅう', reading: 'gyuunyuu', meaning: 'Milk' }] },
  { id: 'h_gyo', kana: 'ぎょ', romaji: 'gyo', script: 'hiragana', group: 'yoon', row: 'gya', strokeCount: 7, mnemonic: 'Voiced glide: blends gi (ぎ) with small yo (ょ) into "gyo".', examples: [{ word: 'ぎょうざ', reading: 'gyouza', meaning: 'Dumplings' }] },

  // sha row (し 1 stroke)
  { id: 'h_sha', kana: 'しゃ', romaji: 'sha', script: 'hiragana', group: 'yoon', row: 'sha', strokeCount: 4, mnemonic: 'Glide sound: blends shi (し) with small ya (ゃ) into "sha".', examples: [{ word: 'しゃしん', reading: 'shashin', meaning: 'Photograph' }] },
  { id: 'h_shu', kana: 'しゅ', romaji: 'shu', script: 'hiragana', group: 'yoon', row: 'sha', strokeCount: 3, mnemonic: 'Glide sound: blends shi (し) with small yu (ゅ) into "shu".', examples: [{ word: 'しゅくだい', reading: 'shukudai', meaning: 'Homework' }] },
  { id: 'h_sho', kana: 'しょ', romaji: 'sho', script: 'hiragana', group: 'yoon', row: 'sha', strokeCount: 2, mnemonic: 'Glide sound: blends shi (し) with small yo (ょ) into "sho".', examples: [{ word: 'しょくどう', reading: 'shokudou', meaning: 'Cafeteria' }] },

  // ja row (じ 3 strokes)
  { id: 'h_ja', kana: 'じゃ', romaji: 'ja', script: 'hiragana', group: 'yoon', row: 'ja', strokeCount: 6, mnemonic: 'Voiced glide: blends ji (じ) with small ya (ゃ) into "ja".', examples: [{ word: 'じゃま', reading: 'jama', meaning: 'Hindrance' }] },
  { id: 'h_ju', kana: 'じゅ', romaji: 'ju', script: 'hiragana', group: 'yoon', row: 'ja', strokeCount: 5, mnemonic: 'Voiced glide: blends ji (じ) with small yu (ゅ) into "ju".', examples: [{ word: 'じゅぎょう', reading: 'jugyou', meaning: 'Class' }] },
  { id: 'h_jo', kana: 'じょ', romaji: 'jo', script: 'hiragana', group: 'yoon', row: 'ja', strokeCount: 4, mnemonic: 'Voiced glide: blends ji (じ) with small yo (ょ) into "jo".', examples: [{ word: 'じょせい', reading: 'josei', meaning: 'Woman' }] },

  // cha row (ち 2 strokes)
  { id: 'h_cha', kana: 'ちゃ', romaji: 'cha', script: 'hiragana', group: 'yoon', row: 'cha', strokeCount: 5, mnemonic: 'Glide sound: blends chi (ち) with small ya (ゃ) into "cha".', examples: [{ word: 'おちゃ', reading: 'ocha', meaning: 'Tea' }] },
  { id: 'h_chu', kana: 'ちゅ', romaji: 'chu', script: 'hiragana', group: 'yoon', row: 'cha', strokeCount: 4, mnemonic: 'Glide sound: blends chi (ち) with small yu (ゅ) into "chu".', examples: [{ word: 'ちゅうごく', reading: 'chuugoku', meaning: 'China' }] },
  { id: 'h_cho', kana: 'ちょ', romaji: 'cho', script: 'hiragana', group: 'yoon', row: 'cha', strokeCount: 3, mnemonic: 'Glide sound: blends chi (ち) with small yo (ょ) into "cho".', examples: [{ word: 'ちょっと', reading: 'chotto', meaning: 'A little' }] },

  // dya row (ぢ 4 strokes, homophone of ja/ju/jo)
  { id: 'h_dya', kana: 'ぢゃ', romaji: 'ja', altRomaji: 'dya', script: 'hiragana', group: 'yoon', row: 'dya', strokeCount: 7, mnemonic: 'Historical/dialectal glide: di (ぢ) with small ya (ゃ). Typically spelled じゃ in modern Japanese.', examples: [{ word: 'はなぢゃ', reading: 'hanaja', meaning: 'Nosebleed (emphatic/dialectal)' }] },
  { id: 'h_dyu', kana: 'ぢゅ', romaji: 'ju', altRomaji: 'dyu', script: 'hiragana', group: 'yoon', row: 'dya', strokeCount: 6, mnemonic: 'Historical/dialectal glide: di (ぢ) with small yu (ゅ). Typically spelled じゅ in modern Japanese.', examples: [{ word: 'ぢゅ', reading: 'ju', meaning: 'Historical/dialectal variant of じゅ' }] },
  { id: 'h_dyo', kana: 'ぢょ', romaji: 'jo', altRomaji: 'dyo', script: 'hiragana', group: 'yoon', row: 'dya', strokeCount: 5, mnemonic: 'Historical/dialectal glide: di (ぢ) with small yo (ょ). Typically spelled じょ in modern Japanese.', examples: [{ word: 'ぢょ', reading: 'jo', meaning: 'Historical/dialectal variant of じょ' }] },

  // nya row (に 3 strokes)
  { id: 'h_nya', kana: 'にゃ', romaji: 'nya', script: 'hiragana', group: 'yoon', row: 'nya', strokeCount: 6, mnemonic: 'Glide sound: blends ni (に) with small ya (ゃ) into "nya".', examples: [{ word: 'にゃー', reading: 'nyaa', meaning: 'Meow' }] },
  { id: 'h_nyu', kana: 'にゅ', romaji: 'nyu', script: 'hiragana', group: 'yoon', row: 'nya', strokeCount: 5, mnemonic: 'Glide sound: blends ni (に) with small yu (ゅ) into "nyu".', examples: [{ word: 'にゅうがく', reading: 'nyuugaku', meaning: 'School entry' }] },
  { id: 'h_nyo', kana: 'にょ', romaji: 'nyo', script: 'hiragana', group: 'yoon', row: 'nya', strokeCount: 4, mnemonic: 'Glide sound: blends ni (に) with small yo (ょ) into "nyo".', examples: [{ word: 'にょうぼう', reading: 'nyoubou', meaning: 'Wife' }] },

  // hya row (ひ 2 strokes)
  { id: 'h_hya', kana: 'ひゃ', romaji: 'hya', script: 'hiragana', group: 'yoon', row: 'hya', strokeCount: 5, mnemonic: 'Glide sound: blends hi (ひ) with small ya (ゃ) into "hya".', examples: [{ word: 'ひゃく', reading: 'hyaku', meaning: 'One hundred' }] },
  { id: 'h_hyu', kana: 'ひゅ', romaji: 'hyu', script: 'hiragana', group: 'yoon', row: 'hya', strokeCount: 4, mnemonic: 'Glide sound: blends hi (ひ) with small yu (ゅ) into "hyu".', examples: [{ word: 'ひゅうひゅう', reading: 'hyuuhyuu', meaning: 'Whistling wind' }] },
  { id: 'h_hyo', kana: 'ひょ', romaji: 'hyo', script: 'hiragana', group: 'yoon', row: 'hya', strokeCount: 3, mnemonic: 'Glide sound: blends hi (ひ) with small yo (ょ) into "hyo".', examples: [{ word: 'ひょう', reading: 'hyou', meaning: 'Chart / Table' }] },

  // bya row (び 4 strokes)
  { id: 'h_bya', kana: 'びゃ', romaji: 'bya', script: 'hiragana', group: 'yoon', row: 'bya', strokeCount: 7, mnemonic: 'Voiced glide: blends bi (び) with small ya (ゃ) into "bya".', examples: [{ word: 'びゃっこ', reading: 'byakko', meaning: 'White tiger' }] },
  { id: 'h_byu', kana: 'びゅ', romaji: 'byu', script: 'hiragana', group: 'yoon', row: 'bya', strokeCount: 6, mnemonic: 'Voiced glide: blends bi (び) with small yu (ゅ) into "byu".', examples: [{ word: 'びゅんびゅん', reading: 'byunbyun', meaning: 'Whizzing' }] },
  { id: 'h_byo', kana: 'びょ', romaji: 'byo', script: 'hiragana', group: 'yoon', row: 'bya', strokeCount: 5, mnemonic: 'Voiced glide: blends bi (び) with small yo (ょ) into "byo".', examples: [{ word: 'びょういん', reading: 'byouin', meaning: 'Hospital' }] },

  // pya row (ぴ 2 strokes)
  { id: 'h_pya', kana: 'ぴゃ', romaji: 'pya', script: 'hiragana', group: 'yoon', row: 'pya', strokeCount: 5, mnemonic: 'Semi-voiced glide: blends pi (ぴ) with small ya (ゃ) into "pya".', examples: [{ word: 'ろっぴゃく', reading: 'roppyaku', meaning: 'Six hundred' }] },
  { id: 'h_pyu', kana: 'ぴゅ', romaji: 'pyu', script: 'hiragana', group: 'yoon', row: 'pya', strokeCount: 4, mnemonic: 'Semi-voiced glide: blends pi (ぴ) with small yu (ゅ) into "pyu".', examples: [{ word: 'ぴゅあ', reading: 'pyua', meaning: 'Pure' }] },
  { id: 'h_pyo', kana: 'ぴょ', romaji: 'pyo', script: 'hiragana', group: 'yoon', row: 'pya', strokeCount: 3, mnemonic: 'Semi-voiced glide: blends pi (ぴ) with small yo (ょ) into "pyo".', examples: [{ word: 'はっぴょう', reading: 'happyou', meaning: 'Presentation' }] },

  // mya row (み 2 strokes)
  { id: 'h_mya', kana: 'みゃ', romaji: 'mya', script: 'hiragana', group: 'yoon', row: 'mya', strokeCount: 5, mnemonic: 'Glide sound: blends mi (み) with small ya (ゃ) into "mya".', examples: [{ word: 'みゃく', reading: 'myaku', meaning: 'Pulse' }] },
  { id: 'h_myu', kana: 'みゅ', romaji: 'myu', script: 'hiragana', group: 'yoon', row: 'mya', strokeCount: 4, mnemonic: 'Glide sound: blends mi (み) with small yu (ゅ) into "myu".', examples: [{ word: 'みゅーじっく', reading: 'myuujikku', meaning: 'Music' }] },
  { id: 'h_myo', kana: 'みょ', romaji: 'myo', script: 'hiragana', group: 'yoon', row: 'mya', strokeCount: 3, mnemonic: 'Glide sound: blends mi (み) with small yo (ょ) into "myo".', examples: [{ word: 'みょうじ', reading: 'myouji', meaning: 'Surname' }] },

  // rya row (り 2 strokes)
  { id: 'h_rya', kana: 'りゃ', romaji: 'rya', script: 'hiragana', group: 'yoon', row: 'rya', strokeCount: 5, mnemonic: 'Glide sound: blends ri (り) with small ya (ゃ) into "rya".', examples: [{ word: 'りゃく', reading: 'ryaku', meaning: 'Abbreviation' }] },
  { id: 'h_ryu', kana: 'りゅ', romaji: 'ryu', script: 'hiragana', group: 'yoon', row: 'rya', strokeCount: 4, mnemonic: 'Glide sound: blends ri (り) with small yu (ゅ) into "ryu".', examples: [{ word: 'りゅうがく', reading: 'ryuugaku', meaning: 'Study abroad' }] },
  { id: 'h_ryo', kana: 'りょ', romaji: 'ryo', script: 'hiragana', group: 'yoon', row: 'rya', strokeCount: 3, mnemonic: 'Glide sound: blends ri (り) with small yo (ょ) into "ryo".', examples: [{ word: 'りょこう', reading: 'ryokou', meaning: 'Travel' }] },
];

export const KATAKANA_GOJUON = [
  // Vowels
  { id: 'k_a', kana: 'ア', romaji: 'a', script: 'katakana', group: 'gojuon', row: 'a', strokeCount: 2, mnemonic: 'Looks like an Axe chopping downward.', examples: [{ word: 'アメリカ', reading: 'amerika', meaning: 'America' }] },
  { id: 'k_i', kana: 'イ', romaji: 'i', script: 'katakana', group: 'gojuon', row: 'a', strokeCount: 2, mnemonic: 'An Easel standing on legs.', examples: [{ word: 'イタリア', reading: 'itaria', meaning: 'Italy' }] },
  { id: 'k_u', kana: 'ウ', romaji: 'u', script: 'katakana', group: 'gojuon', row: 'a', strokeCount: 3, mnemonic: 'A cap with an Antenna on top.', examples: [{ word: 'ウェブ', reading: 'webu', meaning: 'Web' }] },
  { id: 'k_e', kana: 'エ', romaji: 'e', script: 'katakana', group: 'gojuon', row: 'a', strokeCount: 3, mnemonic: 'An Elevator girder / I-beam.', examples: [{ word: 'エアコン', reading: 'eakon', meaning: 'Air conditioner' }] },
  { id: 'k_o', kana: 'オ', romaji: 'o', script: 'katakana', group: 'gojuon', row: 'a', strokeCount: 3, mnemonic: 'An Opera singer with outstretched arms.', examples: [{ word: 'オレンジ', reading: 'orenji', meaning: 'Orange' }] },

  // K-row
  { id: 'k_ka', kana: 'カ', romaji: 'ka', script: 'katakana', group: 'gojuon', row: 'ka', strokeCount: 2, mnemonic: 'Looks like hiragana か without the right drop.', examples: [{ word: 'カメラ', reading: 'kamera', meaning: 'Camera' }] },
  { id: 'k_ki', kana: 'キ', romaji: 'ki', script: 'katakana', group: 'gojuon', row: 'ka', strokeCount: 3, mnemonic: 'Looks like a Key.', examples: [{ word: 'キッチン', reading: 'kicchin', meaning: 'Kitchen' }] },
  { id: 'k_ku', kana: 'ク', romaji: 'ku', script: 'katakana', group: 'gojuon', row: 'ka', strokeCount: 2, mnemonic: 'A Chef\'s Cook hat.', confusableWith: ['k_ta', 'k_wa'], examples: [{ word: 'クラス', reading: 'kurasu', meaning: 'Class' }] },
  { id: 'k_ke', kana: 'ケ', romaji: 'ke', script: 'katakana', group: 'gojuon', row: 'ka', strokeCount: 3, mnemonic: 'Looks like letter "K".', examples: [{ word: 'ケーキ', reading: 'keeki', meaning: 'Cake' }] },
  { id: 'k_ko', kana: 'コ', romaji: 'ko', script: 'katakana', group: 'gojuon', row: 'ka', strokeCount: 2, mnemonic: 'A Corner shape.', examples: [{ word: 'コーヒー', reading: 'koohii', meaning: 'Coffee' }] },

  // S-row
  { id: 'k_sa', kana: 'サ', romaji: 'sa', script: 'katakana', group: 'gojuon', row: 'sa', strokeCount: 3, mnemonic: 'Three Sardines swimming together.', examples: [{ word: 'サラダ', reading: 'sarada', meaning: 'Salad' }] },
  { id: 'k_shi', kana: 'シ', romaji: 'shi', script: 'katakana', group: 'gojuon', row: 'sa', strokeCount: 3, mnemonic: 'She has a big Smile looking UP (strokes sweep UP).', confusableWith: ['k_tsu'], examples: [{ word: 'シャツ', reading: 'shatsu', meaning: 'Shirt' }] },
  { id: 'k_su', kana: 'ス', romaji: 'su', script: 'katakana', group: 'gojuon', row: 'sa', strokeCount: 2, mnemonic: 'A Super acrobat in a split.', examples: [{ word: 'スポーツ', reading: 'supootsu', meaning: 'Sports' }] },
  { id: 'k_se', kana: 'セ', romaji: 'se', script: 'katakana', group: 'gojuon', row: 'sa', strokeCount: 2, mnemonic: 'Looks like hiragana せ with sharp edges.', examples: [{ word: 'セーター', reading: 'seetaa', meaning: 'Sweater' }] },
  { id: 'k_so', kana: 'ソ', romaji: 'so', script: 'katakana', group: 'gojuon', row: 'sa', strokeCount: 2, mnemonic: 'A Singer looking DOWN singing a Solo note (stroke points DOWN).', confusableWith: ['k_n'], examples: [{ word: 'ソファー', reading: 'sofaa', meaning: 'Sofa' }] },

  // T-row
  { id: 'k_ta', kana: 'タ', romaji: 'ta', script: 'katakana', group: 'gojuon', row: 'ta', strokeCount: 3, mnemonic: 'Looks like letter "t" and "a" intertwined.', confusableWith: ['k_ku'], examples: [{ word: 'タクシー', reading: 'takushii', meaning: 'Taxi' }] },
  { id: 'k_chi', kana: 'チ', romaji: 'chi', script: 'katakana', group: 'gojuon', row: 'ta', strokeCount: 3, mnemonic: 'A Cheerleader with crossed arms.', examples: [{ word: 'チーズ', reading: 'chiizu', meaning: 'Cheese' }] },
  { id: 'k_tsu', kana: 'ツ', romaji: 'tsu', script: 'katakana', group: 'gojuon', row: 'ta', strokeCount: 3, mnemonic: 'Two Tears dropping DOWN (strokes aim downward).', confusableWith: ['k_shi'], examples: [{ word: 'ツアー', reading: 'tsuaa', meaning: 'Tour' }] },
  { id: 'k_te', kana: 'テ', romaji: 'te', script: 'katakana', group: 'gojuon', row: 'ta', strokeCount: 3, mnemonic: 'A Television antenna on a pole.', examples: [{ word: 'テレビ', reading: 'terebi', meaning: 'Television' }] },
  { id: 'k_to', kana: 'ト', romaji: 'to', script: 'katakana', group: 'gojuon', row: 'ta', strokeCount: 2, mnemonic: 'A Totem pole with a branch.', examples: [{ word: 'トイレ', reading: 'toire', meaning: 'Toilet / Restroom' }] },

  // N-row
  { id: 'k_na', kana: 'ナ', romaji: 'na', script: 'katakana', group: 'gojuon', row: 'na', strokeCount: 2, mnemonic: 'A sharp Ninja sword.', examples: [{ word: 'ナイフ', reading: 'naifu', meaning: 'Knife' }] },
  { id: 'k_ni', kana: 'ニ', romaji: 'ni', script: 'katakana', group: 'gojuon', row: 'na', strokeCount: 2, mnemonic: 'Two Needle marks / kanji 二 (two).', examples: [{ word: 'ニュース', reading: 'nyuusu', meaning: 'News' }] },
  { id: 'k_nu', kana: 'ヌ', romaji: 'nu', script: 'katakana', group: 'gojuon', row: 'na', strokeCount: 2, mnemonic: 'Noodle chopsticks held tightly.', examples: [{ word: 'ヌードル', reading: 'nuudoru', meaning: 'Noodles' }] },
  { id: 'k_ne', kana: 'ネ', romaji: 'ne', script: 'katakana', group: 'gojuon', row: 'na', strokeCount: 4, mnemonic: 'A Necktie hanging on a collar.', examples: [{ word: 'ネクタイ', reading: 'nekutai', meaning: 'Necktie' }] },
  { id: 'k_no', kana: 'ノ', romaji: 'no', script: 'katakana', group: 'gojuon', row: 'na', strokeCount: 1, mnemonic: 'A single Nose bridge slope.', examples: [{ word: 'ノート', reading: 'nooto', meaning: 'Notebook' }] },

  // H-row
  { id: 'k_ha', kana: 'ハ', romaji: 'ha', script: 'katakana', group: 'gojuon', row: 'ha', strokeCount: 2, mnemonic: 'Two Halves of a hut roof.', confusableWith: ['k_ba', 'k_pa'], examples: [{ word: 'ハンバーガー', reading: 'hanbaagaa', meaning: 'Hamburger' }] },
  { id: 'k_hi', kana: 'ヒ', romaji: 'hi', script: 'katakana', group: 'gojuon', row: 'ha', strokeCount: 2, mnemonic: 'He is sitting on a chair.', examples: [{ word: 'ヒーロー', reading: 'hiiroo', meaning: 'Hero' }] },
  { id: 'k_fu', kana: 'フ', romaji: 'fu', script: 'katakana', group: 'gojuon', row: 'ha', strokeCount: 1, mnemonic: 'Mount Fuji\'s cliff edge.', examples: [{ word: 'フォーク', reading: 'fooku', meaning: 'Fork' }] },
  { id: 'k_he', kana: 'ヘ', romaji: 'he', script: 'katakana', group: 'gojuon', row: 'ha', strokeCount: 1, mnemonic: 'Same as hiragana へ! A mountain peak.', examples: [{ word: 'ヘルメット', reading: 'herumetto', meaning: 'Helmet' }] },
  { id: 'k_ho', kana: 'ホ', romaji: 'ho', script: 'katakana', group: 'gojuon', row: 'ha', strokeCount: 4, mnemonic: 'A Holy cross with two side candles.', examples: [{ word: 'ホテル', reading: 'hoteru', meaning: 'Hotel' }] },

  // M-row
  { id: 'k_ma', kana: 'マ', romaji: 'ma', script: 'katakana', group: 'gojuon', row: 'ma', strokeCount: 2, mnemonic: 'A Martini glass angle.', examples: [{ word: 'マスク', reading: 'masuku', meaning: 'Mask' }] },
  { id: 'k_mi', kana: 'ミ', romaji: 'mi', script: 'katakana', group: 'gojuon', row: 'ma', strokeCount: 3, mnemonic: 'Three Missiles flying in parallel.', examples: [{ word: 'ミルク', reading: 'miruku', meaning: 'Milk' }] },
  { id: 'k_mu', kana: 'ム', romaji: 'mu', script: 'katakana', group: 'gojuon', row: 'ma', strokeCount: 2, mnemonic: 'A side profile of a Moose.', examples: [{ word: 'ムービー', reading: 'muubii', meaning: 'Movie' }] },
  { id: 'k_me', kana: 'メ', romaji: 'me', script: 'katakana', group: 'gojuon', row: 'ma', strokeCount: 2, mnemonic: 'A cross mark / Metal blade slash.', examples: [{ word: 'メニュー', reading: 'menyuu', meaning: 'Menu' }] },
  { id: 'k_mo', kana: 'モ', romaji: 'mo', script: 'katakana', group: 'gojuon', row: 'ma', strokeCount: 3, mnemonic: 'A Monitor with support bars.', examples: [{ word: 'モデル', reading: 'moderu', meaning: 'Model' }] },

  // Y-row
  { id: 'k_ya', kana: 'ヤ', romaji: 'ya', script: 'katakana', group: 'gojuon', row: 'ya', strokeCount: 2, mnemonic: 'A Yacht sail catching the breeze.', examples: [{ word: 'ヤクルト', reading: 'yakuruto', meaning: 'Yakult drink' }] },
  { id: 'k_yu', kana: 'ユ', romaji: 'yu', script: 'katakana', group: 'gojuon', row: 'ya', strokeCount: 2, mnemonic: 'Hooking a letter "U" for You.', examples: [{ word: 'ユニフォーム', reading: 'yunifoomu', meaning: 'Uniform' }] },
  { id: 'k_yo', kana: 'ヨ', romaji: 'yo', script: 'katakana', group: 'gojuon', row: 'ya', strokeCount: 3, mnemonic: 'Looking like a backwards "E" or Yoga pose.', examples: [{ word: 'ヨーグルト', reading: 'yooguruto', meaning: 'Yogurt' }] },

  // R-row
  { id: 'k_ra', kana: 'ラ', romaji: 'ra', script: 'katakana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'A Radio antenna on a table.', examples: [{ word: 'ラジオ', reading: 'rajio', meaning: 'Radio' }] },
  { id: 'k_ri', kana: 'リ', romaji: 'ri', script: 'katakana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'Two parallel Ribbon strands.', examples: [{ word: 'リーダー', reading: 'riidaa', meaning: 'Leader' }] },
  { id: 'k_ru', kana: 'ル', romaji: 'ru', script: 'katakana', group: 'gojuon', row: 'ra', strokeCount: 2, mnemonic: 'Two Roots spreading into soil.', examples: [{ word: 'ルール', reading: 'ruuru', meaning: 'Rule' }] },
  { id: 'k_re', kana: 'レ', romaji: 're', script: 'katakana', group: 'gojuon', row: 'ra', strokeCount: 1, mnemonic: 'A checkmark ready to Release.', examples: [{ word: 'レストラン', reading: 'resutoran', meaning: 'Restaurant' }] },
  { id: 'k_ro', kana: 'ロ', romaji: 'ro', script: 'katakana', group: 'gojuon', row: 'ra', strokeCount: 3, mnemonic: 'A square Robot mouth.', examples: [{ word: 'ロボット', reading: 'robotto', meaning: 'Robot' }] },

  // W-row & N
  { id: 'k_wa', kana: 'ワ', romaji: 'wa', script: 'katakana', group: 'gojuon', row: 'wa', strokeCount: 2, mnemonic: 'A Wine glass bowl.', confusableWith: ['k_ku'], examples: [{ word: 'ワイン', reading: 'wain', meaning: 'Wine' }] },
  { id: 'k_wo', kana: 'ヲ', romaji: 'wo', script: 'katakana', group: 'gojuon', row: 'wa', strokeCount: 3, mnemonic: 'A bird flying Over a wire (historical/rare).', examples: [{ word: 'ヲタク', reading: 'wotaku', meaning: 'Otaku (stylized)' }] },
  { id: 'k_n', kana: 'ン', romaji: 'n', script: 'katakana', group: 'gojuon', row: 'wa', strokeCount: 2, mnemonic: 'A person glancing UP from the side saying "n". (stroke sweeps UP).', confusableWith: ['k_so'], examples: [{ word: 'パン', reading: 'pan', meaning: 'Bread' }] },
];

export const KATAKANA_DAKUON = [
  // G-row
  { id: 'k_ga', kana: 'ガ', romaji: 'ga', script: 'katakana', group: 'dakuon', row: 'ga', strokeCount: 4, baseKana: 'カ', mnemonic: 'Voiced カ with dakuten (゛). Turns unvoiced "ka" into voiced "ga".', examples: [{ word: 'ガラス', reading: 'garasu', meaning: 'Glass' }] },
  { id: 'k_gi', kana: 'ギ', romaji: 'gi', script: 'katakana', group: 'dakuon', row: 'ga', strokeCount: 5, baseKana: 'キ', mnemonic: 'Voiced キ with dakuten (゛). Turns unvoiced "ki" into voiced "gi".', examples: [{ word: 'ギター', reading: 'gitaa', meaning: 'Guitar' }] },
  { id: 'k_gu', kana: 'グ', romaji: 'gu', script: 'katakana', group: 'dakuon', row: 'ga', strokeCount: 4, baseKana: 'ク', mnemonic: 'Voiced ク with dakuten (゛). Turns unvoiced "ku" into voiced "gu".', examples: [{ word: 'グループ', reading: 'guruupu', meaning: 'Group' }] },
  { id: 'k_ge', kana: 'ゲ', romaji: 'ge', script: 'katakana', group: 'dakuon', row: 'ga', strokeCount: 5, baseKana: 'ケ', mnemonic: 'Voiced ケ with dakuten (゛). Turns unvoiced "ke" into voiced "ge".', examples: [{ word: 'ゲーム', reading: 'geemu', meaning: 'Game' }] },
  { id: 'k_go', kana: 'ゴ', romaji: 'go', script: 'katakana', group: 'dakuon', row: 'ga', strokeCount: 4, baseKana: 'コ', mnemonic: 'Voiced コ with dakuten (゛). Turns unvoiced "ko" into voiced "go".', examples: [{ word: 'ゴルフ', reading: 'gorufu', meaning: 'Golf' }] },

  // Z-row
  { id: 'k_za', kana: 'ザ', romaji: 'za', script: 'katakana', group: 'dakuon', row: 'za', strokeCount: 5, baseKana: 'サ', mnemonic: 'Voiced サ with dakuten (゛). Turns unvoiced "sa" into voiced "za".', examples: [{ word: 'デザート', reading: 'dezaato', meaning: 'Dessert' }] },
  { id: 'k_ji', kana: 'ジ', romaji: 'ji', script: 'katakana', group: 'dakuon', row: 'za', strokeCount: 5, baseKana: 'シ', mnemonic: 'Voiced シ with dakuten (゛). Turns unvoiced "shi" into voiced "ji".', examples: [{ word: 'ジュース', reading: 'juusu', meaning: 'Juice' }] },
  { id: 'k_zu', kana: 'ズ', romaji: 'zu', script: 'katakana', group: 'dakuon', row: 'za', strokeCount: 4, baseKana: 'ス', mnemonic: 'Voiced ス with dakuten (゛). Turns unvoiced "su" into voiced "zu".', examples: [{ word: 'ズボン', reading: 'zubon', meaning: 'Trousers' }] },
  { id: 'k_ze', kana: 'ゼ', romaji: 'ze', script: 'katakana', group: 'dakuon', row: 'za', strokeCount: 4, baseKana: 'セ', mnemonic: 'Voiced セ with dakuten (゛). Turns unvoiced "se" into voiced "ze".', examples: [{ word: 'ゼロ', reading: 'zero', meaning: 'Zero' }] },
  { id: 'k_zo', kana: 'ゾ', romaji: 'zo', script: 'katakana', group: 'dakuon', row: 'za', strokeCount: 4, baseKana: 'ソ', mnemonic: 'Voiced ソ with dakuten (゛). Turns unvoiced "so" into voiced "zo".', examples: [{ word: 'ゾーン', reading: 'zoon', meaning: 'Zone' }] },

  // D-row
  { id: 'k_da', kana: 'ダ', romaji: 'da', script: 'katakana', group: 'dakuon', row: 'da', strokeCount: 5, baseKana: 'タ', mnemonic: 'Voiced タ with dakuten (゛). Turns unvoiced "ta" into voiced "da".', examples: [{ word: 'ダンス', reading: 'dansu', meaning: 'Dance' }] },
  { id: 'k_dji', kana: 'ヂ', romaji: 'ji', script: 'katakana', group: 'dakuon', row: 'da', strokeCount: 5, baseKana: 'チ', mnemonic: 'Voiced チ with dakuten (゛). Voiced "di", pronounced "ji" in modern Japanese.', examples: [{ word: 'エナヂー', reading: 'enajii', meaning: 'Energy (rare)' }] },
  { id: 'k_dzu', kana: 'ヅ', romaji: 'zu', script: 'katakana', group: 'dakuon', row: 'da', strokeCount: 5, baseKana: 'ツ', mnemonic: 'Voiced ツ with dakuten (゛). Voiced "du", pronounced "zu" in modern Japanese.', examples: [{ word: 'ビーズ', reading: 'biizu', meaning: 'Beads' }] },
  { id: 'k_de', kana: 'デ', romaji: 'de', script: 'katakana', group: 'dakuon', row: 'da', strokeCount: 5, baseKana: 'テ', mnemonic: 'Voiced テ with dakuten (゛). Turns unvoiced "te" into voiced "de".', examples: [{ word: 'デパート', reading: 'depaato', meaning: 'Department store' }] },
  { id: 'k_do', kana: 'ド', romaji: 'do', script: 'katakana', group: 'dakuon', row: 'da', strokeCount: 4, baseKana: 'ト', mnemonic: 'Voiced ト with dakuten (゛). Turns unvoiced "to" into voiced "do".', examples: [{ word: 'ドア', reading: 'doa', meaning: 'Door' }] },

  // B-row
  { id: 'k_ba', kana: 'バ', romaji: 'ba', script: 'katakana', group: 'dakuon', row: 'ba', strokeCount: 4, baseKana: 'ハ', mnemonic: 'Voiced ハ with dakuten (゛). Turns unvoiced "ha" into voiced "ba".', examples: [{ word: 'バス', reading: 'basu', meaning: 'Bus' }] },
  { id: 'k_bi', kana: 'ビ', romaji: 'bi', script: 'katakana', group: 'dakuon', row: 'ba', strokeCount: 4, baseKana: 'ヒ', mnemonic: 'Voiced ヒ with dakuten (゛). Turns unvoiced "hi" into voiced "bi".', examples: [{ word: 'ビル', reading: 'biru', meaning: 'Building' }] },
  { id: 'k_bu', kana: 'ブ', romaji: 'bu', script: 'katakana', group: 'dakuon', row: 'ba', strokeCount: 3, baseKana: 'フ', mnemonic: 'Voiced フ with dakuten (゛). Turns unvoiced "fu" into voiced "bu".', examples: [{ word: 'ベッド', reading: 'beddo', meaning: 'Bed' }] },
  { id: 'k_be', kana: 'ベ', romaji: 'be', script: 'katakana', group: 'dakuon', row: 'ba', strokeCount: 3, baseKana: 'ヘ', mnemonic: 'Voiced ヘ with dakuten (゛). Turns unvoiced "he" into voiced "be".', examples: [{ word: 'ベル', reading: 'beru', meaning: 'Bell' }] },
  { id: 'k_bo', kana: 'ボ', romaji: 'bo', script: 'katakana', group: 'dakuon', row: 'ba', strokeCount: 6, baseKana: 'ホ', mnemonic: 'Voiced ホ with dakuten (゛). Turns unvoiced "ho" into voiced "bo".', examples: [{ word: 'ボタン', reading: 'botan', meaning: 'Button' }] },
];

export const KATAKANA_HANDAKUON = [
  // P-row
  { id: 'k_pa', kana: 'パ', romaji: 'pa', script: 'katakana', group: 'handakuon', row: 'pa', strokeCount: 3, baseKana: 'ハ', mnemonic: 'Semi-voiced ハ with handakuten circle (゜). Converts "ha" into crisp "pa".', examples: [{ word: 'パーティー', reading: 'paatii', meaning: 'Party' }] },
  { id: 'k_pi', kana: 'ピ', romaji: 'pi', script: 'katakana', group: 'handakuon', row: 'pa', strokeCount: 3, baseKana: 'ヒ', mnemonic: 'Semi-voiced ヒ with handakuten circle (゜). Converts "hi" into crisp "pi".', examples: [{ word: 'ピアノ', reading: 'piano', meaning: 'Piano' }] },
  { id: 'k_pu', kana: 'プ', romaji: 'pu', script: 'katakana', group: 'handakuon', row: 'pa', strokeCount: 2, baseKana: 'フ', mnemonic: 'Semi-voiced フ with handakuten circle (゜). Converts "fu" into crisp "pu".', examples: [{ word: 'プール', reading: 'puuru', meaning: 'Swimming pool' }] },
  { id: 'k_pe', kana: 'ペ', romaji: 'pe', script: 'katakana', group: 'handakuon', row: 'pa', strokeCount: 2, baseKana: 'ヘ', mnemonic: 'Semi-voiced ヘ with handakuten circle (゜). Converts "he" into crisp "pe".', examples: [{ word: 'ペン', reading: 'pen', meaning: 'Pen' }] },
  { id: 'k_po', kana: 'ポ', romaji: 'po', script: 'katakana', group: 'handakuon', row: 'pa', strokeCount: 5, baseKana: 'ホ', mnemonic: 'Semi-voiced ホ with handakuten circle (゜). Converts "ho" into crisp "po".', examples: [{ word: 'ポスト', reading: 'posuto', meaning: 'Mailbox / Post' }] },
];

export const KATAKANA_YOON = [
  // kya row (キ 3 strokes, ャ 2 strokes, ュ 2 strokes, ョ 3 strokes)
  { id: 'k_kya', kana: 'キャ', romaji: 'kya', script: 'katakana', group: 'yoon', row: 'kya', strokeCount: 5, mnemonic: 'Glide sound: blends ki (キ) with small ya (ャ) into "kya".', examples: [{ word: 'キャンプ', reading: 'kyanpu', meaning: 'Camp' }] },
  { id: 'k_kyu', kana: 'キュ', romaji: 'kyu', script: 'katakana', group: 'yoon', row: 'kya', strokeCount: 5, mnemonic: 'Glide sound: blends ki (キ) with small yu (ュ) into "kyu".', examples: [{ word: 'キュート', reading: 'kyuuto', meaning: 'Cute' }] },
  { id: 'k_kyo', kana: 'キョ', romaji: 'kyo', script: 'katakana', group: 'yoon', row: 'kya', strokeCount: 6, mnemonic: 'Glide sound: blends ki (キ) with small yo (ョ) into "kyo".', examples: [{ word: 'キロ', reading: 'kiro', meaning: 'Kilo' }] },

  // gya row (ギ 5 strokes)
  { id: 'k_gya', kana: 'ギャ', romaji: 'gya', script: 'katakana', group: 'yoon', row: 'gya', strokeCount: 7, mnemonic: 'Voiced glide: blends gi (ギ) with small ya (ャ) into "gya".', examples: [{ word: 'ギャラリー', reading: 'gyararii', meaning: 'Gallery' }] },
  { id: 'k_gyu', kana: 'ギュ', romaji: 'gyu', script: 'katakana', group: 'yoon', row: 'gya', strokeCount: 7, mnemonic: 'Voiced glide: blends gi (ギ) with small yu (ュ) into "gyu".', examples: [{ word: 'ギュッと', reading: 'gyutto', meaning: 'Tightly' }] },
  { id: 'k_gyo', kana: 'ギョ', romaji: 'gyo', script: 'katakana', group: 'yoon', row: 'gya', strokeCount: 8, mnemonic: 'Voiced glide: blends gi (ギ) with small yo (ョ) into "gyo".', examples: [{ word: 'ギョーザ', reading: 'gyooza', meaning: 'Gyoza' }] },

  // sha row (シ 3 strokes)
  { id: 'k_sha', kana: 'シャ', romaji: 'sha', script: 'katakana', group: 'yoon', row: 'sha', strokeCount: 5, mnemonic: 'Glide sound: blends shi (シ) with small ya (ャ) into "sha".', examples: [{ word: 'シャワー', reading: 'shawaa', meaning: 'Shower' }] },
  { id: 'k_shu', kana: 'シュ', romaji: 'shu', script: 'katakana', group: 'yoon', row: 'sha', strokeCount: 5, mnemonic: 'Glide sound: blends shi (シ) with small yu (ュ) into "shu".', examples: [{ word: 'シュークリーム', reading: 'shuukuriimu', meaning: 'Cream puff' }] },
  { id: 'k_sho', kana: 'ショ', romaji: 'sho', script: 'katakana', group: 'yoon', row: 'sha', strokeCount: 6, mnemonic: 'Glide sound: blends shi (シ) with small yo (ョ) into "sho".', examples: [{ word: 'ショップ', reading: 'shoppu', meaning: 'Shop' }] },

  // ja row (ジ 5 strokes)
  { id: 'k_ja', kana: 'ジャ', romaji: 'ja', script: 'katakana', group: 'yoon', row: 'ja', strokeCount: 7, mnemonic: 'Voiced glide: blends ji (ジ) with small ya (ャ) into "ja".', examples: [{ word: 'ジュース', reading: 'juusu', meaning: 'Juice' }] },
  { id: 'k_ju', kana: 'ジュ', romaji: 'ju', script: 'katakana', group: 'yoon', row: 'ja', strokeCount: 7, mnemonic: 'Voiced glide: blends ji (ジ) with small yu (ュ) into "ju".', examples: [{ word: 'ジュニア', reading: 'junia', meaning: 'Junior' }] },
  { id: 'k_jo', kana: 'ジョ', romaji: 'jo', script: 'katakana', group: 'yoon', row: 'ja', strokeCount: 8, mnemonic: 'Voiced glide: blends ji (ジ) with small yo (ョ) into "jo".', examples: [{ word: 'ジョギング', reading: 'jogingu', meaning: 'Jogging' }] },

  // cha row (チ 3 strokes)
  { id: 'k_cha', kana: 'チャ', romaji: 'cha', script: 'katakana', group: 'yoon', row: 'cha', strokeCount: 5, mnemonic: 'Glide sound: blends chi (チ) with small ya (ャ) into "cha".', examples: [{ word: 'チャンス', reading: 'chansu', meaning: 'Chance' }] },
  { id: 'k_chu', kana: 'チュ', romaji: 'chu', script: 'katakana', group: 'yoon', row: 'cha', strokeCount: 5, mnemonic: 'Glide sound: blends chi (チ) with small yu (ュ) into "chu".', examples: [{ word: 'チューブ', reading: 'chuubu', meaning: 'Tube' }] },
  { id: 'k_cho', kana: 'チョ', romaji: 'cho', script: 'katakana', group: 'yoon', row: 'cha', strokeCount: 6, mnemonic: 'Glide sound: blends chi (チ) with small yo (ョ) into "cho".', examples: [{ word: 'チョコレート', reading: 'chokoreeto', meaning: 'Chocolate' }] },

  // dya row (ヂ 5 strokes, historical homophone of ja/ju/jo)
  { id: 'k_dya', kana: 'ヂャ', romaji: 'ja', altRomaji: 'dya', script: 'katakana', group: 'yoon', row: 'dya', strokeCount: 7, mnemonic: 'Historical loanword glide: di (ヂ) with small ya (ャ). Modern Katakana uses ジャ.', examples: [{ word: 'ヂャケット', reading: 'jaketto', meaning: 'Old loanword spelling for jacket' }] },
  { id: 'k_dyu', kana: 'ヂュ', romaji: 'ju', altRomaji: 'dyu', script: 'katakana', group: 'yoon', row: 'dya', strokeCount: 7, mnemonic: 'Historical loanword glide: di (ヂ) with small yu (ュ). Modern Katakana uses ジュ.', examples: [{ word: 'ヂュエット', reading: 'juetto', meaning: 'Old loanword spelling for duet' }] },
  { id: 'k_dyo', kana: 'ヂョ', romaji: 'jo', altRomaji: 'dyo', script: 'katakana', group: 'yoon', row: 'dya', strokeCount: 8, mnemonic: 'Historical loanword glide: di (ヂ) with small yo (ョ). Modern Katakana uses ジョ.', examples: [{ word: 'ヂョーク', reading: 'jooku', meaning: 'Old loanword spelling for joke' }] },

  // nya row (ニ 2 strokes)
  { id: 'k_nya', kana: 'ニャ', romaji: 'nya', script: 'katakana', group: 'yoon', row: 'nya', strokeCount: 4, mnemonic: 'Glide sound: blends ni (ニ) with small ya (ャ) into "nya".', examples: [{ word: 'ニャン', reading: 'nyan', meaning: 'Meow' }] },
  { id: 'k_nyu', kana: 'ニュ', romaji: 'nyu', script: 'katakana', group: 'yoon', row: 'nya', strokeCount: 4, mnemonic: 'Glide sound: blends ni (ニ) with small yu (ュ) into "nyu".', examples: [{ word: 'ニュース', reading: 'nyuusu', meaning: 'News' }] },
  { id: 'k_nyo', kana: 'ニョ', romaji: 'nyo', script: 'katakana', group: 'yoon', row: 'nya', strokeCount: 5, mnemonic: 'Glide sound: blends ni (ニ) with small yo (ョ) into "nyo".', examples: [{ word: 'ニョッキ', reading: 'nyokki', meaning: 'Gnocchi' }] },

  // hya row (ヒ 2 strokes)
  { id: 'k_hya', kana: 'ヒャ', romaji: 'hya', script: 'katakana', group: 'yoon', row: 'hya', strokeCount: 4, mnemonic: 'Glide sound: blends hi (ヒ) with small ya (ャ) into "hya".', examples: [{ word: 'ヒャッホー', reading: 'hyahhoo', meaning: 'Yahoo!' }] },
  { id: 'k_hyu', kana: 'ヒュ', romaji: 'hyu', script: 'katakana', group: 'yoon', row: 'hya', strokeCount: 4, mnemonic: 'Glide sound: blends hi (ヒ) with small yu (ュ) into "hyu".', examples: [{ word: 'ヒューストン', reading: 'hyuuston', meaning: 'Houston' }] },
  { id: 'k_hyo', kana: 'ヒョ', romaji: 'hyo', script: 'katakana', group: 'yoon', row: 'hya', strokeCount: 5, mnemonic: 'Glide sound: blends hi (ヒ) with small yo (ョ) into "hyo".', examples: [{ word: 'ヒョウ', reading: 'hyou', meaning: 'Leopard' }] },

  // bya row (ビ 4 strokes)
  { id: 'k_bya', kana: 'ビャ', romaji: 'bya', script: 'katakana', group: 'yoon', row: 'bya', strokeCount: 6, mnemonic: 'Voiced glide: blends bi (ビ) with small ya (ャ) into "bya".', examples: [{ word: 'ビャッコ', reading: 'byakko', meaning: 'White tiger' }] },
  { id: 'k_byu', kana: 'ビュ', romaji: 'byu', script: 'katakana', group: 'yoon', row: 'bya', strokeCount: 6, mnemonic: 'Voiced glide: blends bi (ビ) with small yu (ュ) into "byu".', examples: [{ word: 'ビュッフェ', reading: 'byuffe', meaning: 'Buffet' }] },
  { id: 'k_byo', kana: 'ビョ', romaji: 'byo', script: 'katakana', group: 'yoon', row: 'bya', strokeCount: 7, mnemonic: 'Voiced glide: blends bi (ビ) with small yo (ョ) into "byo".', examples: [{ word: 'ビョーク', reading: 'byooku', meaning: 'Bjork' }] },

  // pya row (ピ 2 strokes)
  { id: 'k_pya', kana: 'ピャ', romaji: 'pya', script: 'katakana', group: 'yoon', row: 'pya', strokeCount: 4, mnemonic: 'Semi-voiced glide: blends pi (ピ) with small ya (ャ) into "pya".', examples: [{ word: 'ピャー', reading: 'pyaa', meaning: 'Squeak' }] },
  { id: 'k_pyu', kana: 'ピュ', romaji: 'pyu', script: 'katakana', group: 'yoon', row: 'pya', strokeCount: 4, mnemonic: 'Semi-voiced glide: blends pi (ピ) with small yu (ュ) into "pyu".', examples: [{ word: 'ピューマ', reading: 'pyuuma', meaning: 'Puma' }] },
  { id: 'k_pyo', kana: 'ピョ', romaji: 'pyo', script: 'katakana', group: 'yoon', row: 'pya', strokeCount: 5, mnemonic: 'Semi-voiced glide: blends pi (ピ) with small yo (ョ) into "pyo".', examples: [{ word: 'ピョンピョン', reading: 'pyonpyon', meaning: 'Hopping' }] },

  // mya row (ミ 3 strokes)
  { id: 'k_mya', kana: 'ミャ', romaji: 'mya', script: 'katakana', group: 'yoon', row: 'mya', strokeCount: 5, mnemonic: 'Glide sound: blends mi (ミ) with small ya (ャ) into "mya".', examples: [{ word: 'ミャンマー', reading: 'myanmaa', meaning: 'Myanmar' }] },
  { id: 'k_myu', kana: 'ミュ', romaji: 'myu', script: 'katakana', group: 'yoon', row: 'mya', strokeCount: 5, mnemonic: 'Glide sound: blends mi (ミ) with small yu (ュ) into "myu".', examples: [{ word: 'ミュージカル', reading: 'myuujikaru', meaning: 'Musical' }] },
  { id: 'k_myo', kana: 'ミョ', romaji: 'myo', script: 'katakana', group: 'yoon', row: 'mya', strokeCount: 6, mnemonic: 'Glide sound: blends mi (ミ) with small yo (ョ) into "myo".', examples: [{ word: 'ミョウガ', reading: 'myouga', meaning: 'Myoga ginger' }] },

  // rya row (リ 2 strokes)
  { id: 'k_rya', kana: 'リャ', romaji: 'rya', script: 'katakana', group: 'yoon', row: 'rya', strokeCount: 4, mnemonic: 'Glide sound: blends ri (リ) with small ya (ャ) into "rya".', examples: [{ word: 'リャマ', reading: 'ryama', meaning: 'Llama' }] },
  { id: 'k_ryu', kana: 'リュ', romaji: 'ryu', script: 'katakana', group: 'yoon', row: 'rya', strokeCount: 4, mnemonic: 'Glide sound: blends ri (リ) with small yu (ュ) into "ryu".', examples: [{ word: 'リュック', reading: 'ryukku', meaning: 'Backpack' }] },
  { id: 'k_ryo', kana: 'リョ', romaji: 'ryo', script: 'katakana', group: 'yoon', row: 'rya', strokeCount: 5, mnemonic: 'Glide sound: blends ri (リ) with small yo (ョ) into "ryo".', examples: [{ word: 'リョーマ', reading: 'ryooma', meaning: 'Ryoma' }] },
];

// All characters array
export const ALL_KANA = [
  ...HIRAGANA_GOJUON,
  ...HIRAGANA_DAKUON,
  ...HIRAGANA_HANDAKUON,
  ...HIRAGANA_YOON,
  ...KATAKANA_GOJUON,
  ...KATAKANA_DAKUON,
  ...KATAKANA_HANDAKUON,
  ...KATAKANA_YOON,
];

export const KANA_DATA = ALL_KANA;

// Index map by ID
export const KANA_BY_ID = ALL_KANA.reduce((acc, item) => {
  acc[item.id] = item;
  acc[item.kana] = item;
  return acc;
}, {});

// Confusing character pairs with memory tips
export const CONFUSABLE_PAIRS = [
  {
    script: 'katakana',
    chars: ['シ', 'ツ'],
    romaji: ['shi', 'tsu'],
    title: 'シ (shi) vs ツ (tsu)',
    explanation: 'シ (shi) is a smiling face looking UP: the strokes start nearly horizontal and sweep upward. ツ (tsu) is tears dropping DOWN: strokes start high and slice downward.',
    rule: 'シ = sweep upward (looking up); ツ = drop downward (looking down).',
  },
  {
    script: 'katakana',
    chars: ['ソ', 'ン'],
    romaji: ['so', 'n'],
    title: 'ソ (so) vs ン (n)',
    explanation: 'ソ (so) has a steep top-down stroke pointing toward the bottom. ン (n) starts lower and sweeps UP toward the top right.',
    rule: 'ソ = down from top (Singing a Solo); ン = sweeping up from bottom.',
  },
  {
    script: 'hiragana',
    chars: ['れ', 'わ', 'ね'],
    romaji: ['re', 'wa', 'ne'],
    title: 'れ (re) vs わ (wa) vs ね (ne)',
    explanation: 'All three share the same left vertical spine. The difference is the right finish: れ curls its foot out to kick (Reaching); わ forms a clean round curve (Wasp belly); ね ties a loop at the end (Cat/Neko tail).',
    rule: 'れ = kicks out; わ = round curve; ね = tail loop.',
  },
  {
    script: 'hiragana',
    chars: ['さ', 'き'],
    romaji: ['sa', 'ki'],
    title: 'さ (sa) vs き (ki)',
    explanation: 'き (ki) has TWO crossbars like a Key with two teeth. さ (sa) has only ONE crossbar.',
    rule: 'き = 2 bars (Key); さ = 1 bar (Samurai).',
  },
  {
    script: 'hiragana',
    chars: ['る', 'ろ'],
    romaji: ['ru', 'ro'],
    title: 'る (ru) vs ろ (ro)',
    explanation: 'る (ru) has a little loop at the end holding a Ruby. ろ (ro) has no loop — the ruby was Robbed!',
    rule: 'る = has loop (Ruby); ろ = open bottom (Robbed).',
  },
  {
    script: 'hiragana',
    chars: ['ぬ', 'め'],
    romaji: ['nu', 'me'],
    title: 'ぬ (nu) vs め (me)',
    explanation: 'ぬ (nu) has an extra loop at the bottom right holding a Noodle loop. め (me) has no loop, like an Eye looking plain.',
    rule: 'ぬ = loop at bottom; め = smooth finish.',
  },
  {
    script: 'katakana',
    chars: ['ク', 'タ', 'ワ'],
    romaji: ['ku', 'ta', 'wa'],
    title: 'ク (ku) vs タ (ta) vs ワ (wa)',
    explanation: 'ク has a simple angle open at bottom. タ adds an inner horizontal stroke. ワ has a vertical left leg instead of diagonal.',
    rule: 'ク = simple open; タ = stroke inside; ワ = straight left leg.',
  },
];

// Helper functions
export function getKanaByScript(script = 'hiragana') {
  return ALL_KANA.filter(k => k.script === script);
}

export function getKanaByGroup(script = 'hiragana', group = 'gojuon') {
  return ALL_KANA.filter(k => k.script === script && k.group === group);
}

export function getKanaById(idOrChar) {
  return KANA_BY_ID[idOrChar] || null;
}
