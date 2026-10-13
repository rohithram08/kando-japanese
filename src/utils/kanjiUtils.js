// Kanji utility functions

// Check if character is kanji
export function isKanji(char) {
  const code = char.charCodeAt(0)
  return (code >= 0x4E00 && code <= 0x9FFF) ||  // CJK Unified Ideographs
         (code >= 0x3400 && code <= 0x4DBF) ||  // CJK Extension A
         (code >= 0x20000 && code <= 0x2A6DF)   // CJK Extension B
}

// Check if character is hiragana
export function isHiragana(char) {
  const code = char.charCodeAt(0)
  return code >= 0x3041 && code <= 0x3096
}

// Check if character is katakana
export function isKatakana(char) {
  const code = char.charCodeAt(0)
  return code >= 0x30A0 && code <= 0x30FF
}

// Check if string contains kanji
export function containsKanji(str) {
  return str.split('').some(isKanji)
}

// Extract all kanji from a string
export function extractKanji(str) {
  return str.split('').filter(isKanji)
}

// Convert hiragana to romaji
export function hiraganaToRomaji(hiragana) {
  const map = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
    'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo',
    'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho',
    'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
    'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo',
    'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo',
    'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo',
    'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
    'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo',
    'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo',
    'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo',
    'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
    'っ': '', 'ー': '-', '。': '. ', '、': ', ',
    '「': '"', '」': '"', '・': '·'
  }

  let result = ''
  let i = 0
  while (i < hiragana.length) {
    // Check for 2-char combinations first
    if (i + 1 < hiragana.length) {
      const twoChar = hiragana[i] + hiragana[i + 1]
      if (map[twoChar]) {
        result += map[twoChar]
        i += 2
        continue
      }
    }
    result += map[hiragana[i]] || hiragana[i]
    i++
  }
  return result
}

// Get kanji level color
export function getKanjiLevelColor(level) {
  const colors = {
    N5: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', hex: '#16a34a' },
    N4: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', hex: '#2563eb' },
    N3: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', hex: '#d97706' },
    N2: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', hex: '#7c3aed' },
    N1: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', hex: '#dc2626' },
  }
  return colors[level] || colors.N5
}

// Get mastery level info
export function getMasteryInfo(level) {
  const levels = [
    { level: 0, label: 'New', color: 'gray', emoji: '○', description: 'Not studied yet' },
    { level: 1, label: 'Beginner', color: 'red', emoji: '🌱', description: 'Just learned' },
    { level: 2, label: 'Learning', color: 'orange', emoji: '🌿', description: 'Still learning' },
    { level: 3, label: 'Familiar', color: 'yellow', emoji: '🌳', description: 'Getting familiar' },
    { level: 4, label: 'Proficient', color: 'blue', emoji: '⭐', description: 'Almost mastered' },
    { level: 5, label: 'Mastered', color: 'green', emoji: '🏆', description: 'Fully mastered' },
  ]
  return levels[Math.min(level, 5)] || levels[0]
}

// Format reading with furigana HTML
export function formatFurigana(kanji, reading) {
  if (!reading) return kanji
  return `<ruby>${kanji}<rt>${reading}</rt></ruby>`
}

// Group kanji by radical
export function groupByRadical(kanjiList) {
  const groups = {}
  kanjiList.forEach(k => {
    const radical = k.radical || 'Other'
    if (!groups[radical]) groups[radical] = []
    groups[radical].push(k)
  })
  return groups
}

// Get stroke count difficulty
export function getStrokeDifficulty(strokes) {
  if (strokes <= 4) return { label: 'Very Easy', color: 'green' }
  if (strokes <= 8) return { label: 'Easy', color: 'blue' }
  if (strokes <= 12) return { label: 'Medium', color: 'orange' }
  if (strokes <= 16) return { label: 'Hard', color: 'red' }
  return { label: 'Very Hard', color: 'purple' }
}

// Search kanji by multiple criteria
export function searchKanji(kanjiList, query) {
  if (!query) return kanjiList
  const q = query.toLowerCase()

  return kanjiList.filter(k =>
    k.character?.includes(query) ||
    k.meaning_en?.toLowerCase().includes(q) ||
    k.meaning_ta?.toLowerCase().includes(q) ||
    k.meaning_hi?.toLowerCase().includes(q) ||
    k.onyomi?.toLowerCase().includes(q) ||
    k.kunyomi?.toLowerCase().includes(q) ||
    k.example_words?.some(ex =>
      ex.word?.includes(query) || ex.meaning?.toLowerCase().includes(q)
    )
  )
}