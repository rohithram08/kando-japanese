import { aiService } from '../services/aiService'

// Generate quiz from lesson content
export async function generateQuizFromLesson(lesson, vocabulary, kanji, grammar, options = {}) {
  const {
    questionCount = 10,
    includeVocab = true,
    includeKanji = true,
    includeGrammar = true,
    difficulty = 'normal', lang = 'english'
  } = options

  const questions = []

  // Vocabulary questions
  if (includeVocab && vocabulary.length > 0) {
    const vocabQ = generateVocabQuestions(vocabulary, Math.min(4, questionCount))
    questions.push(...vocabQ)
  }

  // Kanji questions
  if (includeKanji && kanji.length > 0) {
    const kanjiQ = generateKanjiQuestions(kanji, Math.min(3, questionCount))
    questions.push(...kanjiQ)
  }

  // Grammar questions
  if (includeGrammar && grammar.length > 0) {
    const grammarQ = generateGrammarQuestions(grammar, Math.min(3, questionCount))
    questions.push(...grammarQ)
  }

  // Shuffle questions
  const shuffled = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, questionCount)

  return shuffled
}

// Generate vocabulary questions
function generateVocabQuestions(vocabList, count) {
  const questions = []
  const selected = vocabList
    .sort(() => Math.random() - 0.5)
    .slice(0, count)

  selected.forEach(vocab => {
    // Question type 1: Meaning (Japanese → English)
    const wrongAnswers = vocabList
      .filter(v => v.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.meaning_en)

    const options = [vocab.meaning_en, ...wrongAnswers].sort(() => Math.random() - 0.5)

    questions.push({
      id: `vocab_meaning_${vocab.id}`,
      type: 'multiple_choice',
      category: 'vocabulary',
      question: `What does「${vocab.word}」mean?`,
      question_jp: vocab.word,
      question_reading: vocab.reading,
      options,
      correct: options.indexOf(vocab.meaning_en),
      explanation: `「${vocab.word}」(${vocab.reading}) means "${vocab.meaning_en}"`,
      example: vocab.example_sentence_jp
        ? `Example: ${vocab.example_sentence_jp}`
        : null,
      audio: vocab.word,
      xp: 5
    })

    // Question type 2: Reading (Kanji → Reading)
    if (vocab.reading && vocab.word !== vocab.reading) {
      const wrongReadings = vocabList
        .filter(v => v.id !== vocab.id && v.reading)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(v => v.reading)

      const readingOptions = [vocab.reading, ...wrongReadings]
        .sort(() => Math.random() - 0.5)

      questions.push({
        id: `vocab_reading_${vocab.id}`,
        type: 'multiple_choice',
        category: 'reading',
        question: `How do you read「${vocab.word}」?`,
        question_jp: vocab.word,
        options: readingOptions,
        correct: readingOptions.indexOf(vocab.reading),
        explanation: `「${vocab.word}」is read as「${vocab.reading}」`,
        audio: vocab.reading,
        xp: 5
      })
    }
  })

  return questions
}

// Generate kanji questions
function generateKanjiQuestions(kanjiList, count) {
  const questions = []
  const selected = kanjiList
    .sort(() => Math.random() - 0.5)
    .slice(0, count)

  selected.forEach(kanji => {
    // Question type: Meaning
    const wrongMeanings = kanjiList
      .filter(k => k.id !== kanji.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(k => k.meaning_en)

    const options = [kanji.meaning_en, ...wrongMeanings]
      .sort(() => Math.random() - 0.5)

    questions.push({
      id: `kanji_meaning_${kanji.id}`,
      type: 'multiple_choice',
      category: 'kanji',
      question: `What is the meaning of this kanji?`,
      question_jp: kanji.character,
      options,
      correct: options.indexOf(kanji.meaning_en),
      explanation: `「${kanji.character}」means "${kanji.meaning_en}"\n音読み: ${kanji.onyomi || '-'} | 訓読み: ${kanji.kunyomi || '-'}`,
      audio: kanji.character,
      xp: 8
    })

    // Question type: On'yomi reading
    if (kanji.onyomi) {
      const wrongOnyomi = kanjiList
        .filter(k => k.id !== kanji.id && k.onyomi)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(k => k.onyomi.split('/')[0])

      const readingOptions = [kanji.onyomi.split('/')[0], ...wrongOnyomi]
        .sort(() => Math.random() - 0.5)

      questions.push({
        id: `kanji_onyomi_${kanji.id}`,
        type: 'multiple_choice',
        category: 'kanji',
        question: `What is the on'yomi (音読み) reading of「${kanji.character}」?`,
        question_jp: kanji.character,
        options: readingOptions,
        correct: readingOptions.indexOf(kanji.onyomi.split('/')[0]),
        explanation: `The on'yomi of「${kanji.character}」is ${kanji.onyomi}`,
        audio: kanji.onyomi.split('/')[0],
        xp: 8
      })
    }
  })

  return questions
}

// Generate grammar questions
function generateGrammarQuestions(grammarList, count) {
  const questions = []
  const selected = grammarList
    .sort(() => Math.random() - 0.5)
    .slice(0, count)

  selected.forEach(grammar => {
    const examples = typeof grammar.examples === 'string'
      ? JSON.parse(grammar.examples)
      : (grammar.examples || [])

    if (examples.length === 0) return

    const example = examples[0]

    // Question type: Fill in the blank
    const sentence = example.jp || ''
    const pattern = grammar.pattern

    // Find the grammar pattern in the sentence
    const patternCore = pattern.replace(/[〜～]/g, '').split('〜')[0]

    if (sentence.includes(patternCore)) {
      const blank = sentence.replace(patternCore, '___')

      const wrongPatterns = grammarList
        .filter(g => g.id !== grammar.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(g => g.pattern.replace(/[〜～]/g, '').split('〜')[0])

      const options = [patternCore, ...wrongPatterns]
        .sort(() => Math.random() - 0.5)

      questions.push({
        id: `grammar_fill_${grammar.id}`,
        type: 'multiple_choice',
        category: 'grammar',
        question: `Fill in the blank: ${blank}`,
        question_jp: sentence,
        sentence_en: example.en,
        options,
        correct: options.indexOf(patternCore),
        explanation: `Pattern: ${grammar.pattern}\nMeaning: ${grammar.meaning_en}\n${grammar.explanation_en || ''}`,
        audio: sentence,
        xp: 10
      })
    }

    // Question type: Pattern meaning
    const wrongMeanings = grammarList
      .filter(g => g.id !== grammar.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(g => g.meaning_en)

    const meaningOptions = [grammar.meaning_en, ...wrongMeanings]
      .sort(() => Math.random() - 0.5)

    questions.push({
      id: `grammar_meaning_${grammar.id}`,
      type: 'multiple_choice',
      category: 'grammar',
      question: `What does the grammar pattern「${grammar.pattern}」mean?`,
      question_jp: grammar.pattern,
      options: meaningOptions,
      correct: meaningOptions.indexOf(grammar.meaning_en),
      explanation: grammar.explanation_en || grammar.meaning_en,
      example_jp: example.jp,
      example_en: example.en,
      xp: 10
    })
  })

  return questions
}

// Calculate quiz score
export function calculateScore(questions, answers) {
  let correct = 0
  let totalXP = 0

  const results = questions.map((q, index) => {
    const answer = answers[index]
    const isCorrect = answer?.selected === q.correct

    if (isCorrect) {
      correct++
      totalXP += q.xp || 5
    }

    return {
      question: q,
      answer,
      isCorrect,
      xpEarned: isCorrect ? (q.xp || 5) : 0
    }
  })

  const percentage = Math.round((correct / questions.length) * 100)
  const passed = percentage >= 70

  return {
    correct,
    total: questions.length,
    percentage,
    passed,
    totalXP: passed ? totalXP : Math.round(totalXP * 0.5),
    results
  }
}

// Get quiz feedback message
export function getQuizFeedback(percentage) {
  if (percentage === 100) return { message: '🏆 Perfect Score!', color: 'gold' }
  if (percentage >= 90) return { message: '⭐ Excellent!', color: 'green' }
  if (percentage >= 80) return { message: '🎉 Great Job!', color: 'blue' }
  if (percentage >= 70) return { message: '✅ Good Work!', color: 'teal' }
  if (percentage >= 60) return { message: '💪 Keep Trying!', color: 'orange' }
  return { message: '📚 Review & Retry', color: 'red' }
}