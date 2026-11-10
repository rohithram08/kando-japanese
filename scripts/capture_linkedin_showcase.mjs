// scripts/capture_linkedin_showcase.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const OUT_DIR = 'docs/linkedin_showcase';
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const BASE_URL = 'https://kandojapanese.vercel.app';

async function run() {
  console.log('🚀 Launching Chromium to capture LinkedIn Showcase Assets...');
  const browser = await chromium.launch({ headless: true });
  
  // Use a modern laptop viewport with 2x device scale for crystal-clear retina display
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });

  const page = await context.newPage();

  // 1. Landing Page Hero
  console.log('📸 1. Capturing Landing Page Hero...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, '01_Kando_Hero_Landing.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  // 2. Curriculum & Features
  console.log('📸 2. Capturing Curriculum & Journey...');
  await page.evaluate(() => {
    window.scrollBy({ top: 780, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, '02_Kando_Curriculum_Features.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  // 3. Graded Reader / Stories
  console.log('📸 3. Capturing Graded Reader...');
  await page.goto(`${BASE_URL}/reading`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, '03_Kando_Graded_Reader.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  // 4. Kana Studio
  console.log('📸 4. Capturing Kana Studio...');
  await page.goto(`${BASE_URL}/kana`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, '04_Kando_Kana_Studio.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  // 5. Kanji Studio
  console.log('📸 5. Capturing Kanji Engine...');
  await page.goto(`${BASE_URL}/kanji`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, '05_Kando_Kanji_Engine.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  // 6. Research Paper & CERN Zenodo DOI
  console.log('📸 6. Capturing Academic Research Paper...');
  await page.goto(`${BASE_URL}/research`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(OUT_DIR, '06_Kando_Research_Paper_DOI.png'),
    clip: { x: 0, y: 0, width: 1440, height: 860 }
  });

  await browser.close();
  console.log('✨ All 6 showcase images captured successfully in docs/linkedin_showcase/!');
}

run().catch(console.error);
