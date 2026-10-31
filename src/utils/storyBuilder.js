// src/utils/storyBuilder.js
// ─────────────────────────────────────────────────────────────────────────────
// Authoring pipeline for LONG-FORM graded-reader stories (~10 minutes each).
//
// Authors write a compact source file (content/stories/<level>/<id>.json):
//   sentences : [furigana, english, grammarNote?]        furigana: 学[がく]生[せい]は ...
//   vocab     : [surface, reading, meaning, pos, forms?]  forms = inflected stems used in text
//   elements  : highlighted learning elements (vocab / grammar / particle / kanji)
//   questions : story quiz with an explanation for EVERY wrong option
// …and this module derives everything mechanical (plain Japanese, clickable
// tokens, ids, element↔sentence links, pitch data from the verified dictionary,
// reading-time estimate) so that content stays consistent and validatable.
// ─────────────────────────────────────────────────────────────────────────────

const KANJI = '[\\u4e00-\\u9fff\\u3005]'
const UNIT_RE = new RegExp(`(${KANJI}+)\\[([^\\]]+)\\]|([^\\[\\]\\s])`, 'g')

export const stripFurigana = (s = '') => s.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, '')

/** "起[お]きます。" → [{surface:'起', text:'起[お]'}, {surface:'き', text:'き'}, …] */
export function parseUnits(chunk) {
  const units = []
  for (const m of chunk.matchAll(UNIT_RE)) {
    units.push(m[1] ? { surface: m[1], text: `${m[1]}[${m[2]}]` } : { surface: m[3], text: m[3] })
  }
  return units
}

/** Split a chunk after `len` surface characters (only on a unit boundary). */
function splitAt(units, len) {
  let acc = 0
  for (let i = 0; i < units.length; i++) {
    acc += units[i].surface.length
    if (acc === len) return [units.slice(0, i + 1), units.slice(i + 1)]
    if (acc > len) return null
  }
  return null
}

const join = (units) => ({ text: units.map((u) => u.text).join(''), surface: units.map((u) => u.surface).join('') })

/**
 * Turn the authored furigana string into reader tokens. A chunk that starts with a
 * known vocabulary form becomes a clickable word token (isWord + vocabKey) followed by
 * its remainder (particles / endings) as a plain token.
 */
export function tokenizeFurigana(furigana, vocab) {
  const forms = []
  for (const v of vocab) for (const f of v.forms?.length ? v.forms : [v.surface]) forms.push({ form: f, key: v.surface })
  forms.sort((a, b) => b.form.length - a.form.length)

  const tokens = []
  for (const chunk of furigana.split(/\s+/).filter(Boolean)) {
    const units = parseUnits(chunk)
    // A vocabulary word may start the chunk or follow punctuation / a quote mark
    // (never the middle of a word — 日本語 must not yield 本).
    let pending = []
    let i = 0
    while (i < units.length) {
      const atStart = pending.length === 0 || /[、。「」！？]/.test(units[i - 1]?.surface || '')
      let hit = null
      if (atStart) {
        const rest = units.slice(i)
        const restSurface = rest.map((u) => u.surface).join('')
        hit = forms.find((f) => restSurface.startsWith(f.form) && splitAt(rest, f.form.length))
        if (hit) {
          const [head] = splitAt(rest, hit.form.length)
          if (pending.length) { tokens.push(join(pending)); pending = [] }
          tokens.push({ ...join(head), isWord: true, vocabKey: hit.key })
          i += head.length
          continue
        }
      }
      pending.push(units[i])
      i += 1
    }
    if (pending.length) tokens.push(join(pending))
  }
  return tokens
}

const SMALL = new Set('ゃゅょゎャュョヮぁぃぅぇぉァィゥェォ')
export const countMora = (reading = '') => Array.from(reading).filter((c) => !SMALL.has(c)).length

function pitchPatternFor(drop, reading) {
  if (drop === 0) return 'heiban'
  if (drop === 1) return 'atamadaka'
  return drop === countMora(reading) ? 'odaka' : 'nakadaka'
}

/**
 * Reading-time model for an N5 learner: ~80 characters/minute (incl. furigana look-ups),
 * a few seconds per sentence to glance at translations, and ~20 s per highlighted
 * learning element to open and read its explanation.
 */
export function estimateStoryMinutes(story) {
  const chars = story.sentences.reduce((n, s) => n + s.japanese.length, 0)
  const seconds = chars * 0.75 + story.sentences.length * 4 + (story.learningElements?.length || 0) * 20
  return Math.max(1, Math.round(seconds / 60))
}

const pad = (n) => String(n).padStart(2, '0')

export function buildStory(src, { pitchDictionary = [], level = 'N5' } = {}) {
  const id = src.id
  const vocab = src.vocab.map(([surface, reading, meaning, partOfSpeech, forms]) => ({ surface, reading, meaning, partOfSpeech, forms }))

  const vocabulary = vocab.map(({ surface, reading, meaning, partOfSpeech }) => {
    const entry = { surface, reading, meaning, partOfSpeech, jlptLevel: level }
    const p = pitchDictionary.find((x) => x.word === surface && x.reading === reading)
    if (p) {
      entry.pitchPattern = pitchPatternFor(p.dropPosition, reading)
      entry.pitchDropPosition = p.dropPosition
      entry.pitchVerified = true
    } else {
      entry.pitchVerified = false
    }
    return entry
  })

  const sentences = src.sentences.map(([furigana, translation, grammarNotes], i) => ({
    id: `${id}_s${pad(i + 1)}`,
    order: i + 1,
    japanese: stripFurigana(furigana),
    furigana,
    translation,
    ...(grammarNotes ? { grammarNotes } : {}),
    tokens: tokenizeFurigana(furigana, vocab),
    learningElementIds: [],
  }))

  const learningElements = src.elements.map((e, i) => {
    const eid = `${id}_le${pad(i + 1)}`
    const where = e.in?.length
      ? e.in
      : sentences.filter((s) => e.text.length >= 2 && s.japanese.includes(e.text)).map((s) => s.order)
    where.forEach((n) => sentences[n - 1]?.learningElementIds.push(eid))
    return {
      id: eid,
      type: e.type,
      text: e.text,
      ...(e.reading ? { reading: e.reading } : {}),
      meaning: e.meaning,
      roleInStory: e.role,
      mechanicsExplanation: e.mech,
      exampleSentence: { japanese: stripFurigana(e.ex[0]), furigana: e.ex[0], english: e.ex[1] },
      sentenceOrders: where,
      jlptLevel: level,
    }
  })

  const questions = src.questions.map((q, i) => ({
    id: `${id}_q${pad(i + 1)}`,
    type: q.type,
    question: stripFurigana(q.q),
    questionFurigana: q.q,
    options: q.opts,
    correctAnswer: q.ans,
    explanation: q.expl,
    wrongExplanations: q.wrong,
    referencedSentenceIndex: q.ref,
  }))

  const story = {
    id,
    title: stripFurigana(src.titleFurigana),
    titleFurigana: src.titleFurigana,
    englishTitle: src.englishTitle,
    level,
    description: src.description,
    estimatedMinutes: 0,
    published: true,
    provenance: {
      author: 'Claude (AI-drafted) for Kando Japanese',
      license: 'Proprietary / CC BY-NC-SA 4.0 Educational',
      curationNotes:
        'Long-form (~10 min) graded reader generated from content/stories sources. AI-drafted: pending native-speaker review before it is marked verified.',
      verified: false,
      reviewStatus: 'ai_draft_pending_review',
    },
    sentences,
    vocabulary,
    learningElements,
    questions,
  }
  story.estimatedMinutes = estimateStoryMinutes(story)
  return story
}

// JLPT N5 kanji (103) — anything else in the text is "advanced" and reported.
export const N5_KANJI = new Set(
  '日一国人年大十二本中長出三時行見月分後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨'.split('')
)

const PUNCT = /[、。「」！？]/
const QUESTION_TYPES = ['vocabulary', 'kanji', 'grammar', 'particle', 'comprehension']
const ELEMENT_TYPES = ['vocabulary', 'grammar', 'particle', 'kanji']

/** Returns { errors: string[], warnings: string[], stats } for a built long-form story. */
export function validateLongStory(story, { minSentences = 24, minutes = [8, 12] } = {}) {
  const errors = []
  const warnings = []
  const err = (m) => errors.push(`${story.id}: ${m}`)

  if (story.sentences.length < minSentences) err(`only ${story.sentences.length} sentences (need ≥ ${minSentences})`)
  if (story.estimatedMinutes < minutes[0] || story.estimatedMinutes > minutes[1]) err(`estimated ${story.estimatedMinutes} min (need ${minutes[0]}–${minutes[1]})`)
  if (story.vocabulary.length < 14) err(`only ${story.vocabulary.length} vocabulary entries (need ≥ 14)`)

  const allText = story.sentences.map((s) => s.japanese).join('')

  // sentences & tokens
  story.sentences.forEach((s) => {
    if (s.tokens.map((t) => t.surface).join('') !== s.japanese) err(`sentence ${s.order}: tokens do not rebuild the sentence`)
    s.tokens.forEach((t) => {
      if (t.isWord && PUNCT.test(t.text)) err(`sentence ${s.order}: word token contains punctuation (${t.text})`)
      if (t.vocabKey && !story.vocabulary.some((v) => v.surface === t.vocabKey)) err(`sentence ${s.order}: vocabKey ${t.vocabKey} missing in vocabulary`)
    })
    const open = (s.furigana.match(/\[/g) || []).length
    const close = (s.furigana.match(/\]/g) || []).length
    if (open !== close) err(`sentence ${s.order}: unbalanced furigana brackets`)
  })

  // every vocabulary item must really be used (as a clickable token)
  story.vocabulary.forEach((v) => {
    const used = story.sentences.some((s) => s.tokens.some((t) => t.vocabKey === v.surface))
    if (!used) err(`vocabulary "${v.surface}" never appears as a clickable token`)
  })

  // learning elements
  const counts = {}
  story.learningElements.forEach((e) => {
    counts[e.type] = (counts[e.type] || 0) + 1
    if (!e.sentenceOrders.length) err(`element ${e.id} (${e.text}) is not linked to any sentence`)
    e.sentenceOrders.forEach((n) => {
      if (!story.sentences[n - 1]) err(`element ${e.id} points to missing sentence ${n}`)
      else if (!story.sentences[n - 1].japanese.includes(e.text)) err(`element ${e.id}: "${e.text}" is not in sentence ${n}`)
    })
    if (!e.exampleSentence.japanese.includes(e.text) && e.type !== 'particle' && e.type !== 'grammar') warnings.push(`${e.id}: example does not contain "${e.text}"`)
    if (!e.mechanicsExplanation || e.mechanicsExplanation.length < 40) err(`element ${e.id}: explanation too thin`)
  })
  ELEMENT_TYPES.forEach((t) => { if (!counts[t]) err(`no ${t} learning element`) })
  if (story.learningElements.length < 8) err(`only ${story.learningElements.length} learning elements (need ≥ 8)`)

  // questions
  const qTypes = new Set(story.questions.map((q) => q.type))
  QUESTION_TYPES.forEach((t) => { if (!qTypes.has(t)) err(`no ${t} question`) })
  if (story.questions.length < 8) err(`only ${story.questions.length} questions (need ≥ 8)`)
  story.questions.forEach((q) => {
    if (new Set(q.options).size !== q.options.length) err(`${q.id}: duplicate options`)
    if (!(q.correctAnswer >= 0 && q.correctAnswer < q.options.length)) err(`${q.id}: bad correctAnswer`)
    q.options.forEach((_, i) => {
      if (i !== q.correctAnswer && !q.wrongExplanations?.[i]) err(`${q.id}: no explanation for wrong option ${i}`)
    })
    if (q.referencedSentenceIndex == null || q.referencedSentenceIndex < 0 || q.referencedSentenceIndex >= story.sentences.length) err(`${q.id}: bad referencedSentenceIndex`)
  })

  // Kanji policy: EVERY kanji must carry a furigana reading (learners can always read it);
  // kanji beyond the 103-kanji N5 list are reported for the reviewer, not rejected.
  story.sentences.forEach((s) => {
    const residue = s.furigana.replace(new RegExp(`${KANJI}+\\[[^\\]]+\\]`, 'g'), '')
    if (new RegExp(KANJI).test(residue)) err(`sentence ${s.order}: kanji without furigana (${residue.match(new RegExp(KANJI))[0]})`)
  })
  const advanced = [...new Set(Array.from(allText).filter((c) => /[\u4e00-\u9fff]/.test(c) && !N5_KANJI.has(c)))]

  return { errors, warnings, stats: { sentences: story.sentences.length, chars: allText.length, minutes: story.estimatedMinutes, vocab: story.vocabulary.length, elements: story.learningElements.length, questions: story.questions.length, advancedKanji: advanced } }
}
