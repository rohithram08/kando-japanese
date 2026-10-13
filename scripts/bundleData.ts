import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { GRAMMAR, KANJI, VOCABULARY, LESSONS } from '../src/data/index.js';
import { DRAMA_RESOURCES } from '../src/data/dramaResources.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bundleData() {
  const output = [];

  // Transform GRAMMAR
  for (const level of Object.keys(GRAMMAR)) {
    for (const item of GRAMMAR[level]) {
      output.push({
        contentType: 'grammar',
        id: item.id,
        jlptLevel: item.level,
        title: item.pattern,
        content: `Romaji: ${item.romaji}\nMeaning: ${item.meaning}\nFormation: ${item.formation}\nExplanation: ${item.explanation}\nExamples: ${item.examples.map(e => `${e.jp} - ${e.en}`).join(' | ')}`,
        source: 'NihonGo Master Grammar Data',
        tags: item.tags || []
      });
    }
  }

  // Transform KANJI
  for (const level of Object.keys(KANJI)) {
    for (const item of KANJI[level]) {
      output.push({
        contentType: 'kanji',
        id: item.id,
        jlptLevel: item.level,
        title: item.kanji,
        content: `Readings: ON (${item.readings.on.join(', ')}) KUN (${item.readings.kun.join(', ')})\nMeaning: ${item.meaning}\nStrokes: ${item.strokeCount}\nExamples: ${item.examples.map(e => `${e.word} (${e.reading}) - ${e.meaning}`).join(' | ')}`,
        source: 'NihonGo Master Kanji Data',
        tags: []
      });
    }
  }

  // Transform VOCABULARY
  for (const level of Object.keys(VOCABULARY)) {
    for (const item of VOCABULARY[level]) {
      output.push({
        contentType: 'vocabulary',
        id: item.id,
        jlptLevel: item.level,
        title: item.word,
        content: `Reading: ${item.reading}\nRomaji: ${item.romaji || ''}\nMeaning: ${item.meaning}\nPart of Speech: ${item.partOfSpeech}\nExample: ${item.example.jp} - ${item.example.en}`,
        source: 'NihonGo Master Vocabulary Data',
        tags: []
      });
    }
  }

  // Transform LESSONS
  for (const level of Object.keys(LESSONS)) {
    for (const item of LESSONS[level]) {
      output.push({
        contentType: 'lesson',
        id: item.id,
        jlptLevel: level,
        title: item.title,
        content: `Description: ${item.description}\nObjectives: ${(item.objectives || []).join(', ')}\nKey Grammar: ${item.grammarTarget}\nCultural Note: ${item.culturalNote || ''}\nDialogue: ${(item.dialogue || []).map(d => `${d.speaker}: ${d.jp} - ${d.en}`).join(' | ')}`,
        source: 'NihonGo Master Lessons Data',
        tags: []
      });
    }
  }

  // Transform DRAMA
  for (const item of DRAMA_RESOURCES) {
    output.push({
      contentType: 'drama',
      id: item.id,
      jlptLevel: item.level,
      title: item.title,
      content: `Channel: ${item.hostOrChannel}\nCategory: ${item.category}\nDescription: ${item.description}\nPurpose: ${item.learningPurpose}\nPlatform: ${item.platform}`,
      source: 'NihonGo Master Drama/Listening Resources',
      tags: item.tags || []
    });
  }

  const outPath = path.resolve(__dirname, '../backend/src/data/platformKnowledge.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Successfully bundled ${output.length} items to ${outPath}`);
}

bundleData();
