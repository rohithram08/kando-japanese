// scripts/curriculum-expansion/applyExpansion.js
import fs from 'fs';
import path from 'path';

import {
  N4_GRAMMAR_EXPANSIONS,
  N3_GRAMMAR_EXPANSIONS,
  N2_GRAMMAR_EXPANSIONS,
  N1_GRAMMAR_EXPANSIONS
} from './grammarData.js';

import {
  N5_VOCAB_EXPANSIONS,
  N4_VOCAB_EXPANSIONS,
  N3_VOCAB_EXPANSIONS,
  N2_VOCAB_EXPANSIONS,
  N1_VOCAB_EXPANSIONS
} from './vocabData.js';

import { N1_KANJI_EXPANSIONS } from './kanjiData.js';

import {
  N5_LESSON_EXPANSIONS,
  N4_LESSON_EXPANSIONS,
  N3_LESSON_EXPANSIONS,
  N2_LESSON_EXPANSIONS,
  N1_LESSON_EXPANSIONS
} from './lessonData.js';

const rootDir = process.cwd();

// Helper to append items to a JS file exporting an array
function appendToArrayFile(filePath, newItems, exportVarName, isDefault = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip trailing export statement or closing bracket
  // Handle `export default varName;` or `export const varName = [ ... ];`
  if (isDefault) {
    // Find the array closing bracket before `export default`
    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
      const itemsCode = newItems.map(item => '  ' + JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')).join(',\n');
      const prefix = content.slice(0, lastBracketIndex).trimEnd();
      const needsComma = !prefix.endsWith(',');
      const updated = prefix + (needsComma ? ',\n' : '\n') + itemsCode + '\n];\n\nexport default ' + exportVarName + ';\n';
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[OK] Appended ${newItems.length} items to ${filePath}`);
      return;
    }
  } else {
    // Named export: export const VAR_NAME = [ ... ];
    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
      const itemsCode = newItems.map(item => '  ' + JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')).join(',\n');
      const prefix = content.slice(0, lastBracketIndex).trimEnd();
      const needsComma = !prefix.endsWith(',');
      const updated = prefix + (needsComma ? ',\n' : '\n') + itemsCode + '\n];\n';
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`[OK] Appended ${newItems.length} items to ${filePath}`);
      return;
    }
  }

  console.warn(`[WARN] Could not find closing bracket in ${filePath}`);
}

async function run() {
  console.log('--- Starting Nihongo Master Curriculum Expansion ---');

  // 1. Expand Grammar files
  appendToArrayFile(path.join(rootDir, 'src/data/grammar/n4_grammar.js'), N4_GRAMMAR_EXPANSIONS, 'N4_GRAMMAR', false);
  appendToArrayFile(path.join(rootDir, 'src/data/grammar/n3_grammar.js'), N3_GRAMMAR_EXPANSIONS, 'N3_GRAMMAR', false);
  appendToArrayFile(path.join(rootDir, 'src/data/grammar/n2_grammar.js'), N2_GRAMMAR_EXPANSIONS, 'n2Grammar', true);
  appendToArrayFile(path.join(rootDir, 'src/data/grammar/n1_grammar.js'), N1_GRAMMAR_EXPANSIONS, 'n1Grammar', true);

  // 2. Expand Kanji files
  appendToArrayFile(path.join(rootDir, 'src/data/kanji/n1_kanji.js'), N1_KANJI_EXPANSIONS, 'n1Kanji', true);

  // 3. Expand Vocabulary files
  appendToArrayFile(path.join(rootDir, 'src/data/vocabulary/n5_vocabulary.js'), N5_VOCAB_EXPANSIONS, 'N5_VOCABULARY', false);
  appendToArrayFile(path.join(rootDir, 'src/data/vocabulary/n4_vocabulary.js'), N4_VOCAB_EXPANSIONS, 'n4Vocabulary', true);
  appendToArrayFile(path.join(rootDir, 'src/data/vocabulary/n3_vocabulary.js'), N3_VOCAB_EXPANSIONS, 'n3Vocabulary', true);
  appendToArrayFile(path.join(rootDir, 'src/data/vocabulary/n2_vocabulary.js'), N2_VOCAB_EXPANSIONS, 'n2Vocabulary', true);
  appendToArrayFile(path.join(rootDir, 'src/data/vocabulary/n1_vocabulary.js'), N1_VOCAB_EXPANSIONS, 'n1Vocabulary', true);

  // 4. Expand Lessons files
  appendToArrayFile(path.join(rootDir, 'src/data/lessons/n5_lessons.js'), N5_LESSON_EXPANSIONS, 'n5Lessons', true);
  appendToArrayFile(path.join(rootDir, 'src/data/lessons/n4_lessons.js'), N4_LESSON_EXPANSIONS, 'n4Lessons', true);
  appendToArrayFile(path.join(rootDir, 'src/data/lessons/n3_lessons.js'), N3_LESSON_EXPANSIONS, 'n3Lessons', true);
  appendToArrayFile(path.join(rootDir, 'src/data/lessons/n2_lessons.js'), N2_LESSON_EXPANSIONS, 'n2Lessons', true);
  appendToArrayFile(path.join(rootDir, 'src/data/lessons/n1_lessons.js'), N1_LESSON_EXPANSIONS, 'n1Lessons', true);

  // 5. Update Translation Locales (en, ta, hi)
  const enLocalePath = path.join(rootDir, 'src/locales/en/curriculum.json');
  const taLocalePath = path.join(rootDir, 'src/locales/ta/curriculum.json');
  const hiLocalePath = path.join(rootDir, 'src/locales/hi/curriculum.json');

  const enLocale = JSON.parse(fs.readFileSync(enLocalePath, 'utf8'));
  const taLocale = JSON.parse(fs.readFileSync(taLocalePath, 'utf8'));
  const hiLocale = JSON.parse(fs.readFileSync(hiLocalePath, 'utf8'));

  const allGrammarExpansions = [
    ...N4_GRAMMAR_EXPANSIONS,
    ...N3_GRAMMAR_EXPANSIONS,
    ...N2_GRAMMAR_EXPANSIONS,
    ...N1_GRAMMAR_EXPANSIONS
  ];

  allGrammarExpansions.forEach(g => {
    enLocale[g.id] = {
      meaning: g.meaning_en || g.meaning,
      explanation: g.explanation_en || g.explanation || '',
      example: g.examples?.[0]?.en || ''
    };
    taLocale[g.id] = {
      meaning: g.meaning_ta || g.meaning_en || g.meaning,
      explanation: g.explanation_ta || g.explanation_en || '',
      example: g.examples?.[0]?.ta || g.examples?.[0]?.en || ''
    };
    hiLocale[g.id] = {
      meaning: g.meaning_hi || g.meaning_en || g.meaning,
      explanation: g.explanation_hi || g.explanation_en || '',
      example: g.examples?.[0]?.hi || g.examples?.[0]?.en || ''
    };
  });

  const allVocabExpansions = [
    ...N4_VOCAB_EXPANSIONS,
    ...N3_VOCAB_EXPANSIONS,
    ...N2_VOCAB_EXPANSIONS,
    ...N1_VOCAB_EXPANSIONS
  ];

  allVocabExpansions.forEach(v => {
    enLocale[v.id] = {
      meaning: v.meaning,
      example: v.example?.en || ''
    };
    taLocale[v.id] = {
      meaning: v.meaning_ta || v.meaning,
      example: v.example?.ta || v.example?.en || ''
    };
    hiLocale[v.id] = {
      meaning: v.meaning_hi || v.meaning,
      example: v.example?.hi || v.example?.en || ''
    };
  });

  N1_KANJI_EXPANSIONS.forEach(k => {
    enLocale[k.id] = { meaning: k.meaning };
    taLocale[k.id] = { meaning: k.meaning_ta || k.meaning };
    hiLocale[k.id] = { meaning: k.meaning_hi || k.meaning };
  });

  fs.writeFileSync(enLocalePath, JSON.stringify(enLocale, null, 2), 'utf8');
  fs.writeFileSync(taLocalePath, JSON.stringify(taLocale, null, 2), 'utf8');
  fs.writeFileSync(hiLocalePath, JSON.stringify(hiLocale, null, 2), 'utf8');
  console.log('[OK] Updated locale files (en, ta, hi).');

  // 6. Update Canonical Curriculum
  const canonicalPath = path.join(rootDir, 'src/data/canonical/canonicalCurriculum.json');
  const canonicalData = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));

  allVocabExpansions.forEach(v => {
    if (!canonicalData.vocabulary.find(item => item.id === v.id)) {
      canonicalData.vocabulary.push({
        id: v.id,
        word: v.word,
        reading: v.reading,
        romaji: v.romaji,
        partOfSpeech: v.partOfSpeech,
        level: v.level,
        example: { jp: v.example?.jp || '' }
      });
    }
  });

  N1_KANJI_EXPANSIONS.forEach(k => {
    if (!canonicalData.kanji.find(item => item.id === k.id)) {
      canonicalData.kanji.push({
        id: k.id,
        kanji: k.kanji,
        readings: k.readings,
        strokeCount: k.strokeCount,
        level: k.level,
        radical: k.radical,
        examples: k.examples
      });
    }
  });

  allGrammarExpansions.forEach(g => {
    if (!canonicalData.grammar.find(item => item.id === g.id)) {
      canonicalData.grammar.push({
        id: g.id,
        pattern: g.pattern,
        romaji: g.romaji || '',
        formation: g.structure || g.formation || '',
        level: g.jlpt_level || g.level,
        examples: (g.examples || []).map(e => ({ jp: e.jp, reading: e.reading })),
        tags: g.tags || []
      });
    }
  });

  const allLessonExpansions = [
    ...N5_LESSON_EXPANSIONS,
    ...N4_LESSON_EXPANSIONS,
    ...N3_LESSON_EXPANSIONS,
    ...N2_LESSON_EXPANSIONS,
    ...N1_LESSON_EXPANSIONS
  ];

  allLessonExpansions.forEach(l => {
    if (!canonicalData.lessons.find(item => item.id === l.id)) {
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
    }
  });

  fs.writeFileSync(canonicalPath, JSON.stringify(canonicalData, null, 2), 'utf8');
  console.log(`[OK] Updated canonicalCurriculum.json:
    - Vocab: ${canonicalData.vocabulary.length}
    - Kanji: ${canonicalData.kanji.length}
    - Grammar: ${canonicalData.grammar.length}
    - Lessons: ${canonicalData.lessons.length}`);

  // 7. Update Backend lessonsData.ts
  const backendLessonsPath = path.join(rootDir, 'backend/src/data/lessonsData.ts');
  let backendLessonsContent = fs.readFileSync(backendLessonsPath, 'utf8');
  
  // Re-read all updated frontend lessons and re-serialize to backend lessonsData.ts
  const allLevelsLessons = {
    N1: (await import('../../src/data/lessons/n1_lessons.js')).default,
    N2: (await import('../../src/data/lessons/n2_lessons.js')).default,
    N3: (await import('../../src/data/lessons/n3_lessons.js')).default,
    N4: (await import('../../src/data/lessons/n4_lessons.js')).default,
    N5: (await import('../../src/data/lessons/n5_lessons.js')).default,
  };

  const newLessonsDataTs = `// Auto-generated from authoritative curriculum data files
export interface DialogueLine {
  speaker: string;
  jp: string;
  en: string;
}

export interface LessonExercise {
  type: string;
  question?: string;
  sentence?: string;
  items?: string[];
  options?: string[];
  answer: string | string[];
  [key: string]: any;
}

export interface RawLesson {
  id: string;
  title: string;
  titleJp?: string;
  level: string;
  order: number;
  duration?: string;
  xp?: number;
  description?: string;
  vocabulary: (string | any)[];
  grammar: (string | any)[];
  dialogue?: DialogueLine[];
  exercises?: LessonExercise[];
  culturalNote?: string;
  kanji?: (string | any)[];
}

export const LESSONS_DATA: Record<string, RawLesson[]> = ${JSON.stringify(allLevelsLessons, null, 2)};
`;

  fs.writeFileSync(backendLessonsPath, newLessonsDataTs, 'utf8');
  console.log('[OK] Updated backend/src/data/lessonsData.ts');

  // 8. Update Backend platformKnowledge.json
  const platformKnowledgePath = path.join(rootDir, 'backend/src/data/platformKnowledge.json');
  const platformKnowledge = JSON.parse(fs.readFileSync(platformKnowledgePath, 'utf8'));

  allGrammarExpansions.forEach(g => {
    platformKnowledge.push({
      contentType: 'grammar',
      id: g.id,
      jlptLevel: g.jlpt_level || g.level,
      title: g.pattern,
      content: `Romaji: ${g.romaji || ''}\nMeaning: ${g.meaning_en || g.meaning}\nFormation: ${g.structure || g.formation || ''}\nExplanation: ${g.explanation_en || g.explanation || ''}\nExamples: ${(g.examples || []).map(e => e.jp + ' - ' + e.en).join(' | ')}`,
      source: 'NihonGo Master Grammar Data',
      tags: g.tags || []
    });
  });

  allVocabExpansions.forEach(v => {
    platformKnowledge.push({
      contentType: 'vocabulary',
      id: v.id,
      jlptLevel: v.level,
      title: v.word,
      content: `Reading: ${v.reading}\nRomaji: ${v.romaji}\nMeaning: ${v.meaning}\nPartOfSpeech: ${v.partOfSpeech}\nExample: ${v.example?.jp || ''} - ${v.example?.en || ''}`,
      source: 'NihonGo Master Vocabulary Data',
      tags: [v.partOfSpeech, v.level]
    });
  });

  N1_KANJI_EXPANSIONS.forEach(k => {
    platformKnowledge.push({
      contentType: 'kanji',
      id: k.id,
      jlptLevel: k.level,
      title: k.kanji,
      content: `On'yomi: ${k.readings.on.join(', ')}\nKun'yomi: ${k.readings.kun.join(', ')}\nMeaning: ${k.meaning}\nStrokeCount: ${k.strokeCount}\nRadical: ${k.radical}\nCompounds: ${k.examples.map(e => e.word + ' (' + e.reading + ': ' + e.meaning + ')').join(', ')}`,
      source: 'NihonGo Master Kanji Data',
      tags: ['kanji', k.level]
    });
  });

  allLessonExpansions.forEach(l => {
    platformKnowledge.push({
      contentType: 'lesson',
      id: l.id,
      jlptLevel: l.level,
      title: l.title,
      content: `Description: ${l.description}\nVocabulary: ${l.vocabulary.join(', ')}\nGrammar: ${l.grammar.join(', ')}\nDialogue: ${(l.dialogue || []).map(d => d.speaker + ': ' + d.jp + ' (' + d.en + ')').join(' | ')}\nCulturalNote: ${l.culturalNote || ''}`,
      source: 'NihonGo Master Lesson Data',
      tags: ['lesson', l.level]
    });
  });

  fs.writeFileSync(platformKnowledgePath, JSON.stringify(platformKnowledge, null, 2), 'utf8');
  console.log(`[OK] Updated platformKnowledge.json: total ${platformKnowledge.length} knowledge entries`);

  console.log('--- Curriculum Expansion Successfully Applied! ---');
}

run().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
