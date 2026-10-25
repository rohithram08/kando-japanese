import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContentIndex, renderContentIndexModule } from '../contentIndexBuilder.js';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const generated = path.resolve(repoRoot, 'backend', 'src', 'data', 'contentIndex.ts');
const hasContent = fs.existsSync(path.join(repoRoot, 'content', 'grammar', 'n5.json'));

// Fails when content/*.json changed but `npm run content:index` was not re-run.
describe.skipIf(!hasContent)('generated content index', () => {
  it('is up to date with content/*.json (run `npm run content:index` in backend/ to fix)', () => {
    const fresh = renderContentIndexModule(buildContentIndex(repoRoot));
    expect(fs.readFileSync(generated, 'utf-8')).toBe(fresh);
  });
});
