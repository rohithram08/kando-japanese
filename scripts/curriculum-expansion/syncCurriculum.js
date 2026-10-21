// scripts/curriculum-expansion/syncCurriculum.js
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// 1. Fix src/data/index.js
const indexPath = path.join(rootDir, 'src/data/index.js');
let indexCode = fs.readFileSync(indexPath, 'utf8');

// Ensure .js extensions on imports
indexCode = indexCode.replace(/from '\.\/grammar\/(.*?)'/g, (m, p) => p.endsWith('.js') ? m : `from './grammar/${p}.js'`);
indexCode = indexCode.replace(/from '\.\/kanji\/(.*?)'/g, (m, p) => p.endsWith('.js') ? m : `from './kanji/${p}.js'`);
indexCode = indexCode.replace(/from '\.\/vocabulary\/(.*?)'/g, (m, p) => p.endsWith('.js') ? m : `from './vocabulary/${p}.js'`);
indexCode = indexCode.replace(/from '\.\/lessons\/(.*?)'/g, (m, p) => p.endsWith('.js') ? m : `from './lessons/${p}.js'`);
indexCode = indexCode.replace(/from '\.\/levels'/g, "from './levels.js'");
indexCode = indexCode.replace(/from '\.\/kana\/kanaData'/g, "from './kana/kanaData.js'");

// Ensure normaliseVocab passes ta and hi in example
if (!indexCode.includes('ta: v.example_ta')) {
  indexCode = indexCode.replace(
    /en: v\.example_en \|\| '',/g,
    "en: v.example_en || '',\n        ta: v.example_ta || '',\n        hi: v.example_hi || '',"
  );
}
fs.writeFileSync(indexPath, indexCode, 'utf8');
console.log('[OK] Updated src/data/index.js with .js imports and example ta/hi.');

// Import modules dynamically now that index.js has clean relative ESM imports
async function sync() {
  const { VOCABULARY, KANJI, GRAMMAR, LESSONS } = await import('../../src/data/index.js');

  const enLocalePath = path.join(rootDir, 'src/locales/en/curriculum.json');
  const taLocalePath = path.join(rootDir, 'src/locales/ta/curriculum.json');
  const hiLocalePath = path.join(rootDir, 'src/locales/hi/curriculum.json');
  const canonicalPath = path.join(rootDir, 'src/data/canonical/canonicalCurriculum.json');

  const enLocale = JSON.parse(fs.readFileSync(enLocalePath, 'utf8'));
  const taLocale = JSON.parse(fs.readFileSync(taLocalePath, 'utf8'));
  const hiLocale = JSON.parse(fs.readFileSync(hiLocalePath, 'utf8'));
  const canonicalData = {
    vocabulary: [],
    kanji: [],
    grammar: [],
    lessons: []
  };

  // Rebuild canonicalData.vocabulary to exactly match all items in VOCABULARY
  Object.values(VOCABULARY).forEach(list => {
    list.forEach(v => {
      canonicalData.vocabulary.push({
        id: v.id,
        word: v.word,
        reading: v.reading,
        romaji: v.romaji || '',
        partOfSpeech: v.partOfSpeech || 'noun',
        level: v.level,
        example: {
          jp: v.example?.jp || ''
        }
      });
      enLocale[v.id] = { meaning: v.meaning, example: v.example?.en || '' };
      if (v.meaning_ta) {
        taLocale[v.id] = { meaning: v.meaning_ta, example: v.example?.ta || '' };
      }
      if (v.meaning_hi) {
        hiLocale[v.id] = { meaning: v.meaning_hi, example: v.example?.hi || '' };
      }
    });
  });

  // Rebuild canonicalData.kanji to exactly match all items in KANJI
  Object.values(KANJI).forEach(list => {
    list.forEach(k => {
      canonicalData.kanji.push({
        id: k.id,
        kanji: k.kanji,
        readings: k.readings,
        strokeCount: k.strokeCount,
        level: k.level,
        radical: k.radical || '',
        examples: k.examples || []
      });
      enLocale[k.id] = { meaning: k.meaning };
      if (k.meaning_ta) taLocale[k.id] = { meaning: k.meaning_ta };
      if (k.meaning_hi) hiLocale[k.id] = { meaning: k.meaning_hi };
    });
  });

  // Rebuild canonicalData.grammar to exactly match all items in GRAMMAR
  Object.values(GRAMMAR).forEach(list => {
    list.forEach(g => {
      canonicalData.grammar.push({
        id: g.id,
        pattern: g.pattern,
        romaji: g.romaji || '',
        formation: g.formation || '',
        level: g.level,
        examples: (g.examples || []).map(e => ({ jp: e.jp, reading: e.reading || '' })),
        tags: g.tags || []
      });
      enLocale[g.id] = { meaning: g.meaning, explanation: g.explanation || '', example: g.examples?.[0]?.en || '' };
      if (g.meaning_ta) taLocale[g.id] = { meaning: g.meaning_ta, explanation: g.explanation_ta || '', example: g.examples?.[0]?.ta || '' };
      if (g.meaning_hi) hiLocale[g.id] = { meaning: g.meaning_hi, explanation: g.explanation_hi || '', example: g.examples?.[0]?.hi || '' };
    });
  });

  // Rebuild canonicalData.lessons to exactly match all items in LESSONS
  Object.values(LESSONS).forEach(list => {
    list.forEach(l => {
      canonicalData.lessons.push({
        id: l.id,
        titleJp: l.titleJp || l.title,
        level: l.level,
        order: l.order,
        duration: l.duration,
        xp: l.xp,
        vocabulary: l.vocabulary,
        grammar: l.grammar,
        dialogue: (l.dialogue || []).map(d => ({ speaker: d.speaker, jp: d.jp }))
      });
      enLocale[l.id] = {
        title: l.title,
        description: l.description,
        dialogue: (l.dialogue || []).map(d => d.en),
        culturalNote: l.culturalNote || ''
      };
    });
  });

  // Clean any stale keys from locale files
  const allCanonicalIds = new Set([
    ...canonicalData.vocabulary.map(x => x.id),
    ...canonicalData.kanji.map(x => x.id),
    ...canonicalData.grammar.map(x => x.id),
    ...canonicalData.lessons.map(x => x.id),
  ]);

  for (const k of Object.keys(enLocale)) {
    if (!allCanonicalIds.has(k)) delete enLocale[k];
  }
  for (const k of Object.keys(taLocale)) {
    if (!allCanonicalIds.has(k)) delete taLocale[k];
  }
  for (const k of Object.keys(hiLocale)) {
    if (!allCanonicalIds.has(k)) delete hiLocale[k];
  }

  // Sort canonical entries
  canonicalData.vocabulary.sort((a, b) => a.id.localeCompare(b.id));
  canonicalData.kanji.sort((a, b) => a.id.localeCompare(b.id));
  canonicalData.grammar.sort((a, b) => a.id.localeCompare(b.id));
  canonicalData.lessons.sort((a, b) => a.id.localeCompare(b.id));

  fs.writeFileSync(enLocalePath, JSON.stringify(enLocale, null, 2), 'utf8');
  fs.writeFileSync(taLocalePath, JSON.stringify(taLocale, null, 2), 'utf8');
  fs.writeFileSync(hiLocalePath, JSON.stringify(hiLocale, null, 2), 'utf8');
  fs.writeFileSync(canonicalPath, JSON.stringify(canonicalData, null, 2), 'utf8');

  console.log('[OK] Successfully updated all curriculum locales and canonicalCurriculum.json');

  // Verify counts & matches
  let vocabCount = 0;
  let vocabTamilMatches = 0;
  let vocabHindiMatches = 0;
  Object.values(VOCABULARY).forEach(list => {
    list.forEach(v => {
      vocabCount++;
      const id = v.id || `vocab_${v.word}`;
      if (!enLocale[id]) console.warn('Missing en vocab:', id, v.word);
      if (v.meaning_ta && taLocale[id]) vocabTamilMatches++;
      if (v.meaning_hi && hiLocale[id]) vocabHindiMatches++;
    });
  });

  let kanjiCount = 0;
  let kanjiTamilMatches = 0;
  let kanjiHindiMatches = 0;
  Object.values(KANJI).forEach(list => {
    list.forEach(k => {
      kanjiCount++;
      const id = k.id || `kanji_${k.kanji}`;
      if (!enLocale[id]) console.warn('Missing en kanji:', id, k.kanji);
      if (k.meaning_ta && taLocale[id]) kanjiTamilMatches++;
      if (k.meaning_hi && hiLocale[id]) kanjiHindiMatches++;
    });
  });

  let grammarCount = 0;
  let grammarTamilMatches = 0;
  let grammarHindiMatches = 0;
  Object.values(GRAMMAR).forEach(list => {
    list.forEach(g => {
      grammarCount++;
      const id = g.id || `grammar_${g.pattern}`;
      if (!enLocale[id]) console.warn('Missing en grammar:', id, g.pattern);
      if (g.meaning_ta && taLocale[id]) grammarTamilMatches++;
      if (g.meaning_hi && hiLocale[id]) grammarHindiMatches++;
    });
  });

  let lessonCount = 0;
  Object.values(LESSONS).forEach(list => {
    list.forEach(l => {
      lessonCount++;
      if (!enLocale[l.id]) console.warn('Missing en lesson:', l.id, l.title);
    });
  });

  const totalCanonical = canonicalData.vocabulary.length + canonicalData.kanji.length + canonicalData.grammar.length + canonicalData.lessons.length;

  console.log('\n=== FINAL VERIFIED AUDIT NUMBERS ===');
  console.log(`Vocabulary: ${vocabCount} items (Tamil matches: ${vocabTamilMatches}, Hindi matches: ${vocabHindiMatches})`);
  console.log(`Kanji: ${kanjiCount} characters (Tamil matches: ${kanjiTamilMatches}, Hindi matches: ${kanjiHindiMatches})`);
  console.log(`Grammar: ${grammarCount} patterns (Tamil matches: ${grammarTamilMatches}, Hindi matches: ${grammarHindiMatches})`);
  console.log(`Lessons: ${lessonCount} complete interactive lessons`);
  console.log(`Canonical Total: ${totalCanonical} items across all levels (Vocab: ${canonicalData.vocabulary.length}, Kanji: ${canonicalData.kanji.length}, Grammar: ${canonicalData.grammar.length}, Lessons: ${canonicalData.lessons.length})`);
}

sync().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
