// Builds long-form stories from content/stories/<level>/*.json and merges them into
// src/data/reading/<level>_stories.json (replacing a story with the same id).
//   node scripts/stories/build_expanded_stories.mjs n5
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const levelArg = (process.argv[2] || 'n5').toLowerCase()
const level = levelArg.toUpperCase()

const { buildStory, validateLongStory } = await import(pathToFileURL(path.join(root, 'src/utils/storyBuilder.js')).href)
const { VERIFIED_PITCH_DICTIONARY } = await import(pathToFileURL(path.join(root, 'src/data/pitch/pitchData.js')).href)

const srcDir = path.join(root, 'content/stories', levelArg)
const target = path.join(root, `src/data/reading/${levelArg}_stories.json`)
const stories = JSON.parse(fs.readFileSync(target, 'utf8'))

let failed = false
for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith('.json')).sort()) {
  const built = buildStory(JSON.parse(fs.readFileSync(path.join(srcDir, file), 'utf8')), { pitchDictionary: VERIFIED_PITCH_DICTIONARY, level })
  const { errors, warnings, stats } = validateLongStory(built)
  console.log(`${built.id}  ${built.englishTitle}`, JSON.stringify({ ...stats, advancedKanji: stats.advancedKanji.join('') }))
  warnings.forEach((w) => console.log('   warn:', w))
  errors.forEach((e) => console.log('   ERROR:', e))
  if (errors.length) { failed = true; continue }
  const i = stories.findIndex((s) => s.id === built.id)
  if (i === -1) stories.push(built)
  else stories[i] = built
}
if (failed) { console.error('\nNot written: fix the errors above.'); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(stories, null, 2))
console.log(`\nWrote ${target}`)
