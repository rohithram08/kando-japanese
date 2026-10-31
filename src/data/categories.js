// src/data/categories.js — Thematic category definitions for Vocabulary, Grammar, and Kanji
// ─────────────────────────────────────────────────────────────────────────────
// Each category has: id, emoji, label (en), gradient, keywords (for auto-matching)
// Items are matched by checking their English meaning against keyword patterns.
// ─────────────────────────────────────────────────────────────────────────────

// ── VOCABULARY CATEGORIES ────────────────────────────────────────────────────
export const VOCAB_CATEGORIES = [
  {
    id: 'people',
    emoji: '👥',
    label: 'People & Family',
    gradient: 'from-pink-500 to-rose-600',
    keywords: [
      'person', 'people', 'family', 'father', 'mother', 'parent', 'child', 'children',
      'brother', 'sister', 'husband', 'wife', 'friend', 'teacher', 'student', 'doctor',
      'man', 'woman', 'girl', 'boy', 'baby', 'elderly', 'grandfa', 'grandmo', 'uncle',
      'aunt', 'cousin', 'neighbor', 'everyone', 'someone', 'nobody', 'he ', 'she ',
      'I ', 'me', 'you', 'we', 'they', ' him', ' her', 'boyfriend', 'girlfriend',
      'couple', 'adult', 'employee', 'worker', 'officer', 'manager', 'president',
      'member', 'guest', 'customer', 'foreigner', 'japanese person',
    ],
    posMatch: ['pronoun'],
  },
  {
    id: 'greetings',
    emoji: '🙌',
    label: 'Greetings & Expressions',
    gradient: 'from-amber-500 to-orange-600',
    keywords: [
      'hello', 'goodbye', 'good morning', 'good evening', 'good night', 'thank',
      'sorry', 'excuse', 'please', 'welcome', 'congratul', 'nice to meet',
      'see you', 'how are', 'take care', 'no problem', 'pardon', 'really',
      'of course', 'i see', 'yes', 'no,', 'well then', 'by the way',
    ],
    posMatch: ['expression'],
  },
  {
    id: 'food',
    emoji: '🍱',
    label: 'Food & Drink',
    gradient: 'from-orange-500 to-red-500',
    keywords: [
      'food', 'eat', 'drink', 'rice', 'bread', 'meat', 'fish', 'vegetable', 'fruit',
      'egg', 'milk', 'water', 'tea', 'coffee', 'juice', 'beer', 'wine', 'sugar',
      'salt', 'soy sauce', 'meal', 'breakfast', 'lunch', 'dinner', 'snack', 'cake',
      'sweet', 'cook', 'kitchen', 'dish', 'plate', 'cup', 'bowl', 'chopstick',
      'spoon', 'fork', 'knife', 'bottle', 'restaurant', 'menu', 'delicious',
      'taste', 'hungry', 'thirsty', 'apple', 'banana', 'orange', 'tomato',
      'potato', 'onion', 'butter', 'cheese', 'noodle', 'sushi', 'ramen',
      'bento', 'chicken', 'pork', 'beef', 'tofu', 'soup',
    ],
  },
  {
    id: 'nature',
    emoji: '🌿',
    label: 'Nature & Weather',
    gradient: 'from-emerald-500 to-green-600',
    keywords: [
      'weather', 'rain', 'snow', 'wind', 'cloud', 'sky', 'sun', 'moon', 'star',
      'tree', 'flower', 'mountain', 'river', 'sea', 'ocean', 'lake', 'forest',
      'garden', 'park', 'island', 'season', 'spring', 'summer', 'autumn', 'winter',
      'hot', 'cold', 'warm', 'cool', 'temperature', 'typhoon', 'earthquake',
      'animal', 'dog', 'cat', 'bird', 'fish', 'insect', 'horse', 'cow',
      'earth', 'ground', 'stone', 'rock', 'sand', 'air', 'fire',
      'plant', 'leaf', 'grass', 'field', 'farm',
    ],
  },
  {
    id: 'places',
    emoji: '🏢',
    label: 'Places & Locations',
    gradient: 'from-blue-500 to-indigo-600',
    keywords: [
      'place', 'room', 'house', 'home', 'building', 'school', 'university', 'hospital',
      'station', 'airport', 'hotel', 'bank', 'post office', 'library', 'store', 'shop',
      'market', 'supermarket', 'department', 'office', 'company', 'factory', 'church',
      'temple', 'shrine', 'museum', 'theater', 'cinema', 'pool', 'gym',
      'city', 'town', 'village', 'country', 'area', 'region', 'abroad',
      'entrance', 'exit', 'floor', 'stairs', 'elevator', 'parking',
      'bathroom', 'toilet', 'bedroom', 'living room', 'classroom',
    ],
  },
  {
    id: 'time',
    emoji: '⏰',
    label: 'Time & Calendar',
    gradient: 'from-violet-500 to-purple-600',
    keywords: [
      'time', 'hour', 'minute', 'second', 'o\'clock', 'morning', 'afternoon', 'evening',
      'night', 'today', 'tomorrow', 'yesterday', 'day', 'week', 'month', 'year',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'january', 'february', 'march', 'april', 'may,', 'june', 'july', 'august',
      'september', 'october', 'november', 'december', 'now', 'later', 'soon',
      'already', 'still', 'ago', 'next', 'last', 'every day', 'every week',
      'every month', 'every year', 'holiday', 'vacation', 'weekend', 'birthday',
      'schedule', 'date', 'calendar', 'dawn', 'noon', 'midnight',
    ],
  },
  {
    id: 'numbers',
    emoji: '🔢',
    label: 'Numbers & Counters',
    gradient: 'from-cyan-500 to-teal-600',
    keywords: [
      'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'hundred', 'thousand', 'ten thousand', 'million', 'counter', 'number', 'first',
      'second ', 'third', 'how many', 'how much', 'how old', 'age', 'amount',
      'piece', 'sheet', 'floor (counter)', 'long thin', 'flat thin',
      'general counter', 'times (counter)', 'degree', 'percent',
    ],
  },
  {
    id: 'body',
    emoji: '🏃',
    label: 'Body & Health',
    gradient: 'from-rose-500 to-pink-600',
    keywords: [
      'body', 'head', 'face', 'eye', 'ear', 'nose', 'mouth', 'tooth', 'teeth',
      'hand', 'finger', 'foot', 'leg', 'arm', 'shoulder', 'neck', 'back', 'stomach',
      'heart', 'hair', 'skin', 'bone', 'blood', 'health', 'sick', 'ill', 'disease',
      'medicine', 'pain', 'hurt', 'ache', 'fever', 'cold (illness)', 'cough',
      'allergy', 'surgery', 'diet', 'exercise', 'sleep', 'tired', 'rest',
    ],
  },
  {
    id: 'transport',
    emoji: '🚃',
    label: 'Transportation & Travel',
    gradient: 'from-sky-500 to-blue-600',
    keywords: [
      'train', 'bus', 'car', 'taxi', 'bicycle', 'bike', 'airplane', 'plane', 'ship',
      'boat', 'subway', 'metro', 'ticket', 'seat', 'platform', 'track', 'express',
      'local', 'transfer', 'ride', 'drive', 'walk', 'run', 'travel', 'trip',
      'passport', 'luggage', 'bag', 'suitcase', 'map', 'road', 'street',
      'bridge', 'intersection', 'traffic', 'highway', 'gate', 'door',
      'left', 'right', 'straight', 'north', 'south', 'east', 'west',
      'near', 'far', 'direction', 'corner', 'side',
    ],
  },
  {
    id: 'school',
    emoji: '📚',
    label: 'School & Education',
    gradient: 'from-indigo-500 to-blue-600',
    keywords: [
      'study', 'learn', 'teach', 'exam', 'test', 'homework', 'class', 'lesson',
      'textbook', 'notebook', 'pen', 'pencil', 'eraser', 'ruler', 'desk', 'chair',
      'blackboard', 'chalk', 'question', 'answer', 'grade', 'score', 'subject',
      'math', 'science', 'history', 'english', 'japanese', 'language', 'dictionary',
      'essay', 'report', 'research', 'practice', 'knowledge', 'education',
    ],
  },
  {
    id: 'work',
    emoji: '💼',
    label: 'Work & Business',
    gradient: 'from-slate-500 to-gray-600',
    keywords: [
      'work', 'job', 'business', 'company', 'office', 'meeting', 'salary', 'money',
      'yen', 'price', 'cost', 'pay', 'buy', 'sell', 'trade', 'economy', 'industry',
      'project', 'plan', 'schedule', 'deadline', 'phone', 'call', 'email',
      'computer', 'document', 'contract', 'customer', 'product', 'service',
      'cheap', 'expensive', 'free (no cost)',
    ],
  },
  {
    id: 'home',
    emoji: '🏠',
    label: 'Home & Daily Life',
    gradient: 'from-amber-500 to-yellow-600',
    keywords: [
      'house', 'apartment', 'room', 'door', 'window', 'wall', 'roof', 'floor',
      'table', 'desk', 'chair', 'bed', 'sofa', 'shelf', 'closet', 'drawer',
      'key', 'lock', 'clock', 'calendar', 'mirror', 'lamp', 'light',
      'electricity', 'gas', 'washing', 'laundry', 'clean', 'dirty', 'garbage',
      'trash', 'bath', 'shower', 'towel', 'soap', 'brush', 'comb',
      'umbrella', 'shoes', 'clothes', 'shirt', 'pants', 'hat', 'coat',
      'glasses', 'watch (timep)', 'bag', 'wallet', 'envelope', 'stamp',
      'box', 'newspaper', 'magazine', 'photo', 'picture', 'camera',
      'television', 'tv', 'radio', 'refrigerator', 'microwave',
      'morning routine', 'wake up', 'get up', 'return home',
    ],
  },
  {
    id: 'actions',
    emoji: '⚡',
    label: 'Actions & Verbs',
    gradient: 'from-red-500 to-rose-600',
    keywords: [
      'to go', 'to come', 'to do', 'to make', 'to take', 'to give', 'to receive',
      'to put', 'to open', 'to close', 'to turn', 'to begin', 'to end', 'to stop',
      'to wait', 'to send', 'to meet', 'to talk', 'to say', 'to think',
      'to know', 'to understand', 'to remember', 'to forget', 'to decide',
      'to change', 'to try', 'to cut', 'to hold', 'to carry', 'to move',
      'to play', 'to sing', 'to dance', 'to draw', 'to use', 'to wear',
      'to stand', 'to sit', 'to enter', 'to leave', 'to cross', 'to climb',
      'to push', 'to pull', 'to throw', 'to catch', 'to break', 'to fix',
      'to see', 'to look', 'to watch', 'to listen', 'to read', 'to write',
      'to speak', 'to eat', 'to drink', 'to buy', 'to sell',
      'to wash', 'to swim', 'to die', 'to fly', 'to blow', 'to stick',
      'to lend', 'to borrow', 'to need', 'to differ', 'to arrive', 'to finish',
      'to bloom', 'to stroll', 'to smoke', 'to ask', 'to be born', 'to worry',
      'to get off', 'to descend', 'be able to', 'be,to have', 'turn on', 'turn off',
      'go out', 'hurry', 'pass', 'help', 'copy', 'put in', 'insert', 'push, press',
      'get off', 'throw away', 'exchange', 'pull', 'introduce', 'explain',
      'say', 'forget', 'confirm', 'prepare', 'register', 'pray', 'marry',
      'see, look', 'read', 'do, play', 'cut, slice', 'send', 'give', 'receive',
      'lend', 'borrow', 'go', 'swim', 'smoke', 'have', 'like', 'dislike',
      'poor at', 'understand', 'want', 'rapid', 'be useful', 'need, require',
      'put on', 'rent', 'change', 'arrive', 'moving out',
    ],
    posMatch: ['verb (ichidan)', 'verb (godan)', 'verb (irregular)', 'verb (suru)', 'verb (ru)', 'verb (u)', 'noun/verb'],
  },
  {
    id: 'adjectives',
    emoji: '🎨',
    label: 'Describing Words',
    gradient: 'from-fuchsia-500 to-purple-600',
    keywords: [
      'big', 'small', 'long', 'short', 'tall', 'wide', 'narrow', 'thick', 'thin',
      'heavy', 'light', 'fast', 'slow', 'new', 'old', 'young', 'beautiful',
      'pretty', 'handsome', 'ugly', 'clean', 'dirty', 'quiet', 'noisy', 'loud',
      'bright', 'dark', 'strong', 'weak', 'hard', 'soft', 'easy', 'difficult',
      'good', 'bad', 'happy', 'sad', 'angry', 'scared', 'lonely', 'fun',
      'boring', 'interesting', 'important', 'famous', 'popular', 'strange',
      'same', 'different', 'special', 'various', 'many', 'few', 'enough',
      'busy', 'free (not busy)', 'convenient', 'inconvenient', 'safe', 'dangerous',
      'kind', 'gentle', 'strict', 'cute', 'cool', 'smart', 'stupid',
      'unpleasant', 'gloomy', 'refreshing', 'likeable', 'splendid', 'fine',
      'wonderful', 'spicy', 'wasteful', 'excessive', 'impossible', 'useful',
      'enjoyable', 'real', 'true', 'not at all',
    ],
    posMatch: ['i-adjective', 'na-adj', 'na-adj/adv', 'na-adj/noun'],
  },
  {
    id: 'communication',
    emoji: '💬',
    label: 'Communication & Tech',
    gradient: 'from-teal-500 to-cyan-600',
    keywords: [
      'telephone', 'phone', 'letter', 'mail', 'email', 'message', 'internet',
      'computer', 'television', 'radio', 'newspaper', 'magazine', 'book',
      'word', 'sentence', 'meaning', 'name', 'address', 'number', 'information',
      'news', 'story', 'song', 'music', 'movie', 'video', 'game', 'program',
      'language', 'voice', 'sound', 'noise', 'conversation', 'opinion',
      'idea', 'problem', 'question', 'answer', 'reason', 'method',
    ],
  },
  {
    id: 'colors',
    emoji: '🌈',
    label: 'Colors & Shapes',
    gradient: 'from-rainbow-500 to-pink-500',
    keywords: [
      'red', 'blue', 'green', 'yellow', 'white', 'black', 'brown', 'gray', 'grey',
      'pink', 'orange', 'purple', 'color', 'colour', 'round', 'square', 'triangle',
      'circle', 'line', 'shape', 'pattern', 'stripe',
    ],
  },
  {
    id: 'culture',
    emoji: '🎌',
    label: 'Culture & Society',
    gradient: 'from-red-600 to-rose-700',
    keywords: [
      'japan', 'tradition', 'culture', 'festival', 'ceremony', 'wedding', 'funeral',
      'religion', 'god', 'temple', 'shrine', 'new year', 'cherry blossom',
      'kimono', 'karate', 'judo', 'sumo', 'manga', 'anime', 'samurai',
      'government', 'law', 'police', 'army', 'war', 'peace', 'history',
      'society', 'politics', 'election', 'newspaper', 'international',
    ],
  },
  {
    id: 'sports',
    emoji: '⚽',
    label: 'Sports & Hobbies',
    gradient: 'from-lime-500 to-green-600',
    keywords: [
      'sport', 'soccer', 'baseball', 'tennis', 'basketball', 'swimming', 'ski',
      'run', 'jog', 'walk', 'exercise', 'game', 'match', 'team', 'win', 'lose',
      'hobby', 'travel', 'camera', 'photo', 'music', 'piano', 'guitar', 'sing',
      'dance', 'paint', 'draw', 'cook', 'garden', 'fishing', 'camping',
      'hiking', 'movie', 'concert', 'party', 'collect',
    ],
  },
  {
    id: 'position',
    emoji: '📍',
    label: 'Position & Direction',
    gradient: 'from-indigo-500 to-violet-600',
    keywords: [
      'above', 'below', 'top', 'bottom', 'up', 'down', 'left', 'right',
      'front', 'back', 'behind', 'beside', 'between', 'inside', 'outside',
      'near', 'far', 'here', 'there', 'over there', 'where', 'which',
      'this', 'that', 'these', 'those', 'north', 'south', 'east', 'west',
      'middle', 'center', 'edge', 'corner', 'next to', 'opposite',
      'what', 'who', 'when', 'how', 'why',
    ],
  },
  {
    id: 'adverbs',
    emoji: '💫',
    label: 'Adverbs & Frequency',
    gradient: 'from-yellow-500 to-amber-600',
    keywords: [
      'always', 'usually', 'often', 'sometimes', 'rarely', 'never',
      'very', 'quite', 'a little', 'too', 'more', 'most', 'less', 'least',
      'also', 'together', 'alone', 'already', 'still', 'yet', 'again',
      'about', 'approximately', 'exactly', 'probably', 'maybe', 'perhaps',
      'certainly', 'surely', 'truly', 'really', 'especially', 'particularly',
      'slowly', 'quickly', 'soon', 'immediately', 'suddenly', 'gradually',
      'first', 'next', 'then', 'finally', 'well', 'hard',
      'not so', 'not easily', 'once', 'in total', 'both', 'only', 'just',
      'so', 'but', 'and ', 'during', 'while', 'if', 'such', 'all',
      'et cetera', 'cetera', 'plural suffix', 'approximate',
    ],
    posMatch: ['adverb', 'noun/adverb'],
  },
  {
    id: 'world',
    emoji: '🌍',
    label: 'World & Countries',
    gradient: 'from-teal-500 to-emerald-600',
    keywords: [
      'u.s.a', 'u.k.', 'india', 'thailand', 'china', 'brazil', 'france',
      'australia', 'russia', 'switzerland', 'jakarta', 'bangkok', 'berlin',
      'beijing', 'los angeles', 'london', 'paris', 'hong kong', 'vietnam',
      'hue', 'asia', 'europe', 'world', 'prefecture', 'einstein',
      'king, jr', 'franklin', 'disneyland', 'fictitious',
    ],
  },
  {
    id: 'objects',
    emoji: '🎒',
    label: 'Objects & Things',
    gradient: 'from-stone-500 to-gray-600',
    keywords: [
      'scissors', 'punch', 'stapler', 'tape', 'battery', 'switch', 'machine',
      'atm', 'cash', 'present', 'gift', 'souvenir', 'fax', 'cd', 'compact disc',
      'chocolate', 'ice cream', 'candy', 'robot', 'panda', 'kangaroo', 'elephant',
      'pet', 'vase', 'basket', 'paper', 'glass', 'button', 'pocket', 'recorder',
      'film', 'cassette', 'lobby', 'escalator', 'vending', 'dormitory', 'corridor',
      'entry hall', 'socks', 'jacket', 'jumper', 'slippers', 'trousers', 'suit',
      'ashtray', 'tobacco', 'cigarette', 'record', 'diary', 'lemon',
      'curry', 'kilogram', 'kilo', 'gram', 'zero', 'size', 'knob',
      'humor', 'genius', 'dream', 'lie', 'truth', 'chance',
      'condition', 'convenience', 'materials', 'data', 'preparation',
      'no smoking', 'honorable', 'honorific', 'mr.', 'ms.',
      'hiragana', 'katakana', 'script', 'chinese character',
      'golf', 'karaoke', 'jazz', 'composition', 'writing',
      'fine arts', 'dentist', 'barber', 'electrician', 'engineer',
      'visa', 'nam pla', 'no ', 'full',
    ],
  },
]

// ── GRAMMAR CATEGORIES ───────────────────────────────────────────────────────
export const GRAMMAR_CATEGORIES = [
  {
    id: 'particles',
    emoji: '🔗',
    label: 'Particles',
    gradient: 'from-blue-500 to-indigo-600',
    tagMatch: ['particle', 'particles', 'topic-marker', 'subject-marker', 'object-marker',
      'possessive', 'connector', 'companion', 'inclusive', 'also', 'direction', 'location', 'means'],
  },
  {
    id: 'verb-forms',
    emoji: '📝',
    label: 'Verb Forms',
    gradient: 'from-emerald-500 to-green-600',
    tagMatch: ['te-form', 'conjugation', 'past-tense', 'negative', 'potential', 'ability',
      'volitional', 'progressive', 'state', 'aspect'],
  },
  {
    id: 'adjectives',
    emoji: '🎨',
    label: 'Adjective Patterns',
    gradient: 'from-fuchsia-500 to-purple-600',
    tagMatch: ['adjective', 'い-adjective', 'な-adjective', 'comparison', 'superlative',
      'degree', 'extent', 'ease', 'difficulty'],
  },
  {
    id: 'requests',
    emoji: '🙏',
    label: 'Requests & Permissions',
    gradient: 'from-amber-500 to-orange-600',
    tagMatch: ['request', 'polite', 'permission', 'prohibition', 'must-not', 'rules',
      'obligation', 'must', 'suggestion', 'invitation', 'negative-request', 'advice'],
  },
  {
    id: 'time-sequence',
    emoji: '⏳',
    label: 'Time & Sequence',
    gradient: 'from-violet-500 to-purple-600',
    tagMatch: ['time', 'before', 'after', 'sequence', 'simultaneous', 'while', 'when',
      'frequency', 'deadline'],
  },
  {
    id: 'reasoning',
    emoji: '💡',
    label: 'Reasons & Conditions',
    gradient: 'from-cyan-500 to-teal-600',
    tagMatch: ['reason', 'cause', 'conditional', 'if-when', 'proportional', 'natural result'],
  },
  {
    id: 'expression',
    emoji: '💬',
    label: 'Expressing Ideas',
    gradient: 'from-rose-500 to-pink-600',
    tagMatch: ['desire', 'want', 'opinion', 'belief', 'conjecture', 'probability',
      'hearsay', 'reported-speech', 'quotation', 'inference', 'appearance',
      'possibility', 'uncertainty', 'feeling', 'relief', 'emphasis', 'intention', 'plan',
      'attempt', 'experience', 'speech', 'naming', 'method', 'how-to'],
  },
  {
    id: 'connecting',
    emoji: '🔀',
    label: 'Connecting Sentences',
    gradient: 'from-sky-500 to-blue-600',
    tagMatch: ['conjunction', 'contrast', 'but', 'listing', 'non-exhaustive',
      'listing-actions', 'sentence-ending', 'nuance'],
  },
  {
    id: 'amounts',
    emoji: '📊',
    label: 'Amounts & Limits',
    gradient: 'from-teal-500 to-emerald-600',
    tagMatch: ['range', 'limit', 'only', 'restriction', 'insufficiency', 'excess',
      'too-much', 'approximation', 'quantity', 'numbers', 'ordinal', 'even', 'any'],
  },
  {
    id: 'giving',
    emoji: '🎁',
    label: 'Giving & Receiving',
    gradient: 'from-pink-500 to-rose-600',
    tagMatch: ['giving', 'receiving', 'directional', 'purpose', 'benefit',
      'change', 'become', 'manner'],
  },
  {
    id: 'basics',
    emoji: '🌟',
    label: 'Basic Patterns',
    gradient: 'from-yellow-500 to-amber-600',
    tagMatch: ['copula', 'beginner', 'existence', 'question', 'question-word', 'descriptor',
      'casual', 'spoken', 'choice', 'alternative'],
  },
]

// ── KANJI CATEGORIES ─────────────────────────────────────────────────────────
// Since kanji don't have radicals populated, we'll categorize by meaning
export const KANJI_CATEGORIES = [
  {
    id: 'numbers',
    emoji: '🔢',
    label: 'Numbers',
    gradient: 'from-blue-500 to-indigo-600',
    keywords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'hundred', 'thousand', 'ten thousand', 'number', 'half', 'circle/yen'],
  },
  {
    id: 'time-calendar',
    emoji: '📅',
    label: 'Time & Calendar',
    gradient: 'from-violet-500 to-purple-600',
    keywords: ['day', 'month', 'year', 'week', 'time', 'hour', 'minute', 'morning',
      'noon', 'evening', 'night', 'now', 'before', 'after', 'ahead/future', 'behind/past',
      'interval', 'every'],
  },
  {
    id: 'nature',
    emoji: '🌿',
    label: 'Nature',
    gradient: 'from-emerald-500 to-green-600',
    keywords: ['mountain', 'river', 'fire', 'water', 'tree', 'forest', 'flower', 'rain',
      'sky', 'heaven', 'weather', 'wind', 'earth', 'ground', 'stone', 'gold/metal',
      'sea', 'lake', 'spring', 'summer', 'autumn', 'winter', 'sun', 'moon'],
  },
  {
    id: 'people',
    emoji: '👤',
    label: 'People',
    gradient: 'from-pink-500 to-rose-600',
    keywords: ['person', 'man', 'woman', 'child', 'father', 'mother', 'friend', 'master',
      'king', 'name', 'born', 'life', 'death', 'self', 'body', 'eye', 'ear', 'hand',
      'foot', 'mouth', 'heart/mind', 'spirit'],
  },
  {
    id: 'actions',
    emoji: '⚡',
    label: 'Actions',
    gradient: 'from-red-500 to-rose-600',
    keywords: ['go', 'come', 'see', 'hear', 'say/speak', 'read', 'write', 'eat', 'drink',
      'buy', 'sell', 'stand', 'sit', 'enter', 'exit/leave', 'open', 'close', 'use',
      'hold', 'meet', 'know', 'think', 'study/learn', 'teach', 'make/build', 'run',
      'walk', 'ride', 'wait', 'rest', 'play', 'turn'],
  },
  {
    id: 'school',
    emoji: '🏫',
    label: 'School & Study',
    gradient: 'from-indigo-500 to-blue-600',
    keywords: ['school', 'study', 'learn', 'student', 'test', 'language', 'character/letter',
      'book', 'write', 'sentence', 'literature', 'read', 'education', 'teach',
      'class', 'lesson'],
  },
  {
    id: 'places',
    emoji: '🏢',
    label: 'Places',
    gradient: 'from-sky-500 to-blue-600',
    keywords: ['country', 'outside', 'inside', 'shop/store', 'station', 'company', 'society',
      'town', 'village', 'road/way', 'gate', 'temple', 'electricity', 'car/vehicle',
      'house/home', 'room'],
  },
  {
    id: 'size-amount',
    emoji: '📏',
    label: 'Size & Amount',
    gradient: 'from-teal-500 to-cyan-600',
    keywords: ['big', 'small', 'long', 'short', 'tall/high', 'low', 'wide', 'narrow',
      'many/much', 'few/little', 'heavy', 'new', 'old', 'early', 'late', 'cheap',
      'expensive', 'strong', 'weak'],
  },
  {
    id: 'direction',
    emoji: '🧭',
    label: 'Direction & Position',
    gradient: 'from-orange-500 to-amber-600',
    keywords: ['up/above', 'down/below', 'left', 'right', 'middle/center', 'north', 'south',
      'east', 'west', 'front', 'behind', 'inside', 'outside'],
  },
  {
    id: 'colors-qualities',
    emoji: '🎨',
    label: 'Colors & Qualities',
    gradient: 'from-fuchsia-500 to-purple-600',
    keywords: ['white', 'black', 'red', 'blue', 'color', 'bright', 'dark', 'correct/right',
      'good', 'bad', 'beautiful', 'new', 'old (not new)', 'different'],
  },
]

// ── KEYWORD MATCHER ──────────────────────────────────────────────────────────
function matchKeyword(meaning, keyword) {
  if (!meaning || !keyword) return false
  const parts = keyword.split('/').map(p => p.trim().toLowerCase()).filter(Boolean)
  return parts.some(part => {
    // If the keyword contains multiple words (e.g. "ten thousand"), test with word boundaries on the phrase
    const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp('(^|[^a-zA-Z0-9])' + escaped + '([^a-zA-Z0-9]|$)', 'i')
    return regex.test(meaning)
  })
}

// ── CATEGORIZATION ENGINE ────────────────────────────────────────────────────

/**
 * Assigns items to categories based on keyword matching on their meaning.
 * Returns a Map<categoryId, item[]>. Items can appear in multiple categories.
 * Uncategorized items go into a special "other" bucket.
 *
 * @param {Array} items - Array of items with at least { id, meaning }
 * @param {Array} categories - Category definitions with keywords/tagMatch/posMatch
 * @param {Object} curriculumData - Locale curriculum data for meaning lookup
 * @param {'vocabulary'|'grammar'|'kanji'} type - Content type
 * @returns {Map<string, Array>}
 */
export function categorizeItems(items, categories, getMeaning, type = 'vocabulary') {
  const result = new Map()
  const assigned = new Set()

  for (const cat of categories) {
    result.set(cat.id, [])
  }
  result.set('other', [])

  for (const item of items) {
    const meaning = (getMeaning(item) || item.meaning || '').toLowerCase()
    let wasAssigned = false

    for (const cat of categories) {
      let matched = false

      // Check keyword matches (vocab & kanji) with whole-word boundary matching
      if (cat.keywords) {
        matched = cat.keywords.some(kw => matchKeyword(meaning, kw))
      }

      // Check POS matches (vocab)
      if (!matched && cat.posMatch && type === 'vocabulary') {
        const pos = item.partOfSpeech || item.pos || ''
        matched = cat.posMatch.some(p => pos.toLowerCase().includes(p.toLowerCase()))
      }

      // Check tag matches (grammar)
      if (!matched && cat.tagMatch && type === 'grammar') {
        const tags = item.tags || []
        matched = cat.tagMatch.some(t => tags.includes(t))
      }

      if (matched) {
        result.get(cat.id).push(item)
        wasAssigned = true
      }
    }

    if (wasAssigned) {
      assigned.add(item.id)
    }
  }

  // Put unassigned items into "other"
  for (const item of items) {
    if (!assigned.has(item.id)) {
      result.get('other').push(item)
    }
  }

  // Remove empty categories
  for (const [key, val] of result) {
    if (val.length === 0) result.delete(key)
  }

  return result
}

/**
 * Get category definitions for a content type
 */
export function getCategoryDefs(type) {
  switch (type) {
    case 'vocabulary': return VOCAB_CATEGORIES
    case 'grammar':    return GRAMMAR_CATEGORIES
    case 'kanji':      return KANJI_CATEGORIES
    default:           return VOCAB_CATEGORIES
  }
}

/**
 * OTHER category definition (used as fallback)
 */
export const OTHER_CATEGORY = {
  id: 'other',
  emoji: '📋',
  label: 'Other',
  gradient: 'from-gray-500 to-slate-600',
}
