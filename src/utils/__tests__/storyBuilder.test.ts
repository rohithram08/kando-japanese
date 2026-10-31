import { describe, it, expect } from 'vitest'
import { stripFurigana, tokenizeFurigana, estimateStoryMinutes, countMora, buildStory, validateLongStory } from '../storyBuilder.js'

describe('storyBuilder', () => {
  it('derives plain Japanese from furigana notation', () => {
    expect(stripFurigana('私[わたし]の 名前[なまえ]は ケンです。')).toBe('私の名前はケンです。')
  })

  it('makes clickable word tokens and keeps endings as plain tokens', () => {
    const t = tokenizeFurigana('起[お]きます。', [{ surface: '起きる', forms: ['起き'] }])
    expect(t).toEqual([
      { text: '起[お]き', surface: '起き', isWord: true, vocabKey: '起きる' },
      { text: 'ます。', surface: 'ます。' },
    ])
  })

  it('finds words after quotation marks / punctuation but never inside another word', () => {
    const vocab = [{ surface: '元気' }, { surface: '本' }, { surface: '日本語' }]
    const t = tokenizeFurigana('「ケン、元気[げんき]ですか」と 日本語[にほんご]の 本[ほん]を', vocab)
    expect(t.filter((x) => x.isWord).map((x) => x.vocabKey)).toEqual(['元気', '日本語', '本'])
    expect(t.map((x) => x.surface).join('')).toBe('「ケン、元気ですか」と日本語の本を')
  })

  it('counts morae (small ゃゅょ do not count)', () => {
    expect(countMora('きょう')).toBe(2)
    expect(countMora('がっこう')).toBe(4)
  })

  it('estimates reading time from characters, sentences and highlighted elements', () => {
    const story: any = {
      sentences: Array.from({ length: 28 }, () => ({ japanese: 'あ'.repeat(16) })),
      learningElements: new Array(10).fill({}),
    }
    // 448 chars*0.75 + 28*4 + 10*20 = 648 s ≈ 11 min
    expect(estimateStoryMinutes(story)).toBe(11)
    expect(estimateStoryMinutes({ sentences: [{ japanese: 'あ'.repeat(70) }], learningElements: [] })).toBe(1) // short stories are honest about it
  })

  it('validator rejects thin or inconsistent stories', () => {
    const src: any = {
      id: 'story_x', titleFurigana: 'テスト', englishTitle: 'Test', description: 'd',
      sentences: [['私[わたし]は 学生[がくせい]です。', 'I am a student.']],
      vocab: [['学生', 'がくせい', 'student', 'noun']],
      elements: [{ type: 'vocabulary', text: '学生', meaning: 'student', role: 'r', mech: 'short', ex: ['学生[がくせい]です。', 'x'] }],
      questions: [],
    }
    const { errors } = validateLongStory(buildStory(src))
    expect(errors.join('\n')).toMatch(/only 1 sentences/)
    expect(errors.join('\n')).toMatch(/explanation too thin/)
    expect(errors.join('\n')).toMatch(/no particle question/)
  })
})
