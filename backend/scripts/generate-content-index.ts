import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContentIndex, renderContentIndexModule } from '../src/services/contentIndexBuilder.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..');
const out = path.resolve(here, '..', 'src', 'data', 'contentIndex.ts');
const index = buildContentIndex(repoRoot);
fs.writeFileSync(out, renderContentIndexModule(index));
console.log(`Wrote ${path.relative(repoRoot, out)}: ${index.grammarIds.length} grammar ids`);
