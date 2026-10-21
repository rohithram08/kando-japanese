// scripts/migrateToContentArchitecture.js
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content');

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function migrate() {
  console.log('🚀 Starting Automated Content Architecture Migration...');

  // 1. Create directory structure
  const dirs = [
    'content/vocabulary',
    'content/grammar',
    'content/kanji',
    'content/lessons',
    'content/translations/en',
    'content/translations/ta',
    'content/translations/hi',
    'content/schema'
  ];
  dirs.forEach(d => ensureDir(path.join(rootDir, d)));
  console.log('✅ Created content directories');

  // 2. Load existing single source of truth and locales
  const { VOCABULARY, KANJI, GRAMMAR, LESSONS } = await import('../src/data/index.js');
  const enLocale = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/locales/en/curriculum.json'), 'utf8'));
  const taLocale = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/locales/ta/curriculum.json'), 'utf8'));
  const hiLocale = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/locales/hi/curriculum.json'), 'utf8'));

  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  // Translations containers
  const translations = {
    en: { vocabulary: {}, grammar: {}, kanji: {}, lessons: {} },
    ta: { vocabulary: {}, grammar: {}, kanji: {}, lessons: {} },
    hi: { vocabulary: {}, grammar: {}, kanji: {}, lessons: {} }
  };

  // 3. Process Vocabulary
  let totalVocab = 0;
  for (const lvl of levels) {
    const list = VOCABULARY[lvl] || [];
    totalVocab += list.length;
    const cleanVocab = [];

    for (const v of list) {
      const id = v.id;
      cleanVocab.push({
        id,
        word: v.word,
        reading: v.reading,
        romaji: v.romaji || '',
        pos: v.partOfSpeech || v.pos || 'noun',
        level: v.level || lvl,
        tags: v.tags || [v.partOfSpeech || 'noun', lvl],
        example: {
          jp: v.example?.jp || ''
        }
      });

      // English translation
      const enT = enLocale[id] || {};
      translations.en.vocabulary[id] = {
        meaning: enT.meaning || v.meaning || '',
        example: enT.example || v.example?.en || ''
      };

      // Tamil translation
      const taT = taLocale[id];
      if (taT || v.meaning_ta) {
        translations.ta.vocabulary[id] = {
          meaning: taT?.meaning || v.meaning_ta || '',
          example: taT?.example || v.example?.ta || ''
        };
      }

      // Hindi translation
      const hiT = hiLocale[id];
      if (hiT || v.meaning_hi) {
        translations.hi.vocabulary[id] = {
          meaning: hiT?.meaning || v.meaning_hi || '',
          example: hiT?.example || v.example?.hi || ''
        };
      }
    }

    fs.writeFileSync(
      path.join(contentDir, `vocabulary/${lvl.toLowerCase()}.json`),
      JSON.stringify(cleanVocab, null, 2),
      'utf8'
    );
  }
  console.log(`✅ Migrated ${totalVocab} Vocabulary items across N5-N1`);

  // 4. Process Kanji
  let totalKanji = 0;
  for (const lvl of levels) {
    const list = KANJI[lvl] || [];
    totalKanji += list.length;
    const cleanKanji = [];

    for (const k of list) {
      const id = k.id;
      cleanKanji.push({
        id,
        kanji: k.kanji,
        readings: {
          on: k.readings?.on || [],
          kun: k.readings?.kun || []
        },
        strokeCount: k.strokeCount || 0,
        level: k.level || lvl,
        radical: k.radical || '',
        examples: (k.examples || []).map(ex => ({
          word: typeof ex === 'string' ? ex : ex.word,
          reading: ex.reading || '',
          meaning: ex.meaning || ''
        }))
      });

      // English translation
      const enT = enLocale[id] || {};
      translations.en.kanji[id] = {
        meaning: enT.meaning || k.meaning || ''
      };

      // Tamil translation
      const taT = taLocale[id];
      if (taT || k.meaning_ta) {
        translations.ta.kanji[id] = {
          meaning: taT?.meaning || k.meaning_ta || ''
        };
      }

      // Hindi translation
      const hiT = hiLocale[id];
      if (hiT || k.meaning_hi) {
        translations.hi.kanji[id] = {
          meaning: hiT?.meaning || k.meaning_hi || ''
        };
      }
    }

    fs.writeFileSync(
      path.join(contentDir, `kanji/${lvl.toLowerCase()}.json`),
      JSON.stringify(cleanKanji, null, 2),
      'utf8'
    );
  }
  console.log(`✅ Migrated ${totalKanji} Kanji characters across N5-N1`);

  // 5. Process Grammar
  let totalGrammar = 0;
  for (const lvl of levels) {
    const list = GRAMMAR[lvl] || [];
    totalGrammar += list.length;
    const cleanGrammar = [];

    for (const g of list) {
      const id = g.id;
      cleanGrammar.push({
        id,
        pattern: g.pattern,
        romaji: g.romaji || '',
        formation: g.formation || g.structure || '',
        level: g.level || lvl,
        tags: g.tags || [],
        examples: (g.examples || []).map(e => ({
          jp: e.jp,
          reading: e.reading || ''
        }))
      });

      // English translation
      const enT = enLocale[id] || {};
      translations.en.grammar[id] = {
        meaning: enT.meaning || g.meaning || '',
        explanation: enT.explanation || g.explanation || '',
        example: enT.example || g.examples?.[0]?.en || ''
      };

      // Tamil translation
      const taT = taLocale[id];
      if (taT || g.meaning_ta) {
        translations.ta.grammar[id] = {
          meaning: taT?.meaning || g.meaning_ta || '',
          explanation: taT?.explanation || g.explanation_ta || '',
          example: taT?.example || g.examples?.[0]?.ta || ''
        };
      }

      // Hindi translation
      const hiT = hiLocale[id];
      if (hiT || g.meaning_hi) {
        translations.hi.grammar[id] = {
          meaning: hiT?.meaning || g.meaning_hi || '',
          explanation: hiT?.explanation || g.explanation_hi || '',
          example: hiT?.example || g.examples?.[0]?.hi || ''
        };
      }
    }

    fs.writeFileSync(
      path.join(contentDir, `grammar/${lvl.toLowerCase()}.json`),
      JSON.stringify(cleanGrammar, null, 2),
      'utf8'
    );
  }
  console.log(`✅ Migrated ${totalGrammar} Grammar rules across N5-N1`);

  // 6. Process Lessons
  let totalLessons = 0;
  for (const lvl of levels) {
    const list = LESSONS[lvl] || [];
    totalLessons += list.length;
    const cleanLessons = [];

    for (const l of list) {
      const id = l.id;
      cleanLessons.push({
        id,
        titleJp: l.titleJp || l.title,
        level: l.level || lvl,
        order: l.order || 1,
        duration: l.duration || '20 min',
        xp: l.xp || 50,
        vocabulary: l.vocabulary || [],
        grammar: l.grammar || [],
        dialogue: (l.dialogue || []).map(d => ({
          speaker: d.speaker,
          jp: d.jp
        })),
        exercises: l.exercises || []
      });

      // English translation
      const enT = enLocale[id] || {};
      translations.en.lessons[id] = {
        title: enT.title || l.title || '',
        description: enT.description || l.description || '',
        culturalNote: enT.culturalNote || l.culturalNote || '',
        dialogue: enT.dialogue || (l.dialogue || []).map(d => d.en || '')
      };

      // Tamil translation
      const taT = taLocale[id];
      if (taT) {
        translations.ta.lessons[id] = {
          title: taT.title || l.title || '',
          description: taT.description || l.description || '',
          culturalNote: taT.culturalNote || l.culturalNote || '',
          dialogue: taT.dialogue || []
        };
      }

      // Hindi translation
      const hiT = hiLocale[id];
      if (hiT) {
        translations.hi.lessons[id] = {
          title: hiT.title || l.title || '',
          description: hiT.description || l.description || '',
          culturalNote: hiT.culturalNote || l.culturalNote || '',
          dialogue: hiT.dialogue || []
        };
      }
    }

    fs.writeFileSync(
      path.join(contentDir, `lessons/${lvl.toLowerCase()}.json`),
      JSON.stringify(cleanLessons, null, 2),
      'utf8'
    );
  }
  console.log(`✅ Migrated ${totalLessons} Lessons across N5-N1`);

  // 7. Write per-language translation files
  for (const lang of ['en', 'ta', 'hi']) {
    const langDir = path.join(contentDir, `translations/${lang}`);
    ensureDir(langDir);

    fs.writeFileSync(
      path.join(langDir, 'vocabulary.json'),
      JSON.stringify(translations[lang].vocabulary, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.join(langDir, 'grammar.json'),
      JSON.stringify(translations[lang].grammar, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.join(langDir, 'kanji.json'),
      JSON.stringify(translations[lang].kanji, null, 2),
      'utf8'
    );
    fs.writeFileSync(
      path.join(langDir, 'lessons.json'),
      JSON.stringify(translations[lang].lessons, null, 2),
      'utf8'
    );
    console.log(`✅ Saved translations for locale: [${lang}]`);
  }

  // 8. Write manifest.json
  const manifest = {
    version: '2.0.0',
    schemaVersion: '1.0.0',
    updatedAt: new Date().toISOString(),
    supportedLanguages: ['en', 'ta', 'hi'],
    defaultLanguage: 'en',
    levels: ['N5', 'N4', 'N3', 'N2', 'N1'],
    stats: {
      vocabulary: totalVocab,
      kanji: totalKanji,
      grammar: totalGrammar,
      lessons: totalLessons,
      totalEntries: totalVocab + totalKanji + totalGrammar + totalLessons
    },
    translationsCount: {
      en: Object.keys(translations.en.vocabulary).length + Object.keys(translations.en.kanji).length + Object.keys(translations.en.grammar).length + Object.keys(translations.en.lessons).length,
      ta: Object.keys(translations.ta.vocabulary).length + Object.keys(translations.ta.kanji).length + Object.keys(translations.ta.grammar).length + Object.keys(translations.ta.lessons).length,
      hi: Object.keys(translations.hi.vocabulary).length + Object.keys(translations.hi.kanji).length + Object.keys(translations.hi.grammar).length + Object.keys(translations.hi.lessons).length
    }
  };

  fs.writeFileSync(
    path.join(contentDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
  console.log('✅ Generated content/manifest.json');
  console.log('\n🎉 Content Migration Summary:');
  console.log(JSON.stringify(manifest.stats, null, 2));
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
