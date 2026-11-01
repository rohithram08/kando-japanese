import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy src/data/*.json to dist/data/
const srcData = path.join(rootDir, 'src', 'data');
const distData = path.join(rootDir, 'dist', 'data');
if (fs.existsSync(srcData)) {
  fs.mkdirSync(distData, { recursive: true });
  for (const file of fs.readdirSync(srcData)) {
    if (file.endsWith('.json')) {
      fs.copyFileSync(path.join(srcData, file), path.join(distData, file));
      console.log(`[copy-assets] Copied src/data/${file} -> dist/data/${file}`);
    }
  }
}

// 2. Copy src/db/migrations to dist/db/migrations
const srcMigrations = path.join(rootDir, 'src', 'db', 'migrations');
const distMigrations = path.join(rootDir, 'dist', 'db', 'migrations');
if (fs.existsSync(srcMigrations)) {
  copyDirRecursive(srcMigrations, distMigrations);
  console.log('[copy-assets] Copied migrations -> dist/db/migrations');
}

console.log('[copy-assets] Static assets copied successfully.');
