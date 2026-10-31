import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import n5 from '../n5_stories.json'
import { buildStory, validateLongStory } from '../../../utils/storyBuilder.js'
import { VERIFIED_PITCH_DICTIONARY } from '../../pitch/pitchData.js'

// Long-form (~10 minute) stories are generated from content/stories/<level>/*.json.
const SRC_DIR = path.resolve(__dirname, '../../../../content/stories/n5')
const sources = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.json')).sort()
const byId = new Map((n5 as any[]).map((s) => [s.id, s]))

describe('long-form N5 stories (≈10 minutes each)', () => {
  it('has at least five long-form stories', () => {
    expect(sources.length).toBeGreaterThanOrEqual(5)
  })

  for (const file of sources) {
    const source = JSON.parse(fs.readFileSync(path.join(SRC_DIR, file), 'utf8'))

    describe(source.id, () => {
      const built = buildStory(source, { pitchDictionary: VERIFIED_PITCH_DICTIONARY as any, level: 'N5' })

      it('is in sync with the shipped data (re-run scripts/stories/build_expanded_stories.mjs if this fails)', () => {
        expect(byId.get(source.id)).toEqual(JSON.parse(JSON.stringify(built)))
      })

      it('meets the long-form quality bar', () => {
        const { errors } = validateLongStory(built)
        expect(errors).toEqual([])
      })

      it('is honest about review status (AI-drafted, not verified)', () => {
        expect(built.provenance.verified).toBe(false)
        expect(built.provenance.reviewStatus).toBe('ai_draft_pending_review')
      })

      it('every wrong answer has an explanation and every question has a type', () => {
        for (const q of built.questions) {
          expect(q.type).toBeTruthy()
          q.options.forEach((_: string, i: number) => {
            if (i !== q.correctAnswer) expect(q.wrongExplanations[i]).toBeTruthy()
          })
        }
      })
    })
  }
})
