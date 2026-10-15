import { VOCABULARY, KANJI, GRAMMAR, LESSONS } from '../src/data/index.js'

console.log('=== DATA SUMMARY ===')
console.log('Vocab counts:', Object.fromEntries(Object.entries(VOCABULARY).map(([k, v]) => [k, v.length])))
console.log('Kanji counts:', Object.fromEntries(Object.entries(KANJI).map(([k, v]) => [k, v.length])))
console.log('Grammar counts:', Object.fromEntries(Object.entries(GRAMMAR).map(([k, v]) => [k, v.length])))
console.log('Lessons counts:', Object.fromEntries(Object.entries(LESSONS).map(([k, v]) => [k, v.length])))

// Sample checks
console.log('\nSample Vocab N5[0]:', VOCABULARY.N5[0])
console.log('Sample Kanji N5[0]:', KANJI.N5[0])
console.log('Sample Grammar N5[0]:', GRAMMAR.N5[0])
console.log('Sample Lesson N5[0]:', { id: LESSONS.N5[0].id, title: LESSONS.N5[0].title, titleJp: LESSONS.N5[0].titleJp })
