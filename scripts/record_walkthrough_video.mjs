// scripts/record_walkthrough_video.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const VIDEO_DIR = 'docs/linkedin_showcase/video';
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

const BASE_URL = 'https://kandojapanese.vercel.app';

async function record() {
  console.log('🎥 Launching Chromium with video recording enabled...');
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 }
    },
    colorScheme: 'dark'
  });

  const page = await context.newPage();

  console.log('🎬 1. Recording Landing Page & Sakura Petals...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('🎬 2. Scrolling through Curriculum & Features...');
  await page.evaluate(() => {
    window.scrollBy({ top: 600, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);

  await page.evaluate(() => {
    window.scrollBy({ top: 700, behavior: 'smooth' });
  });
  await page.waitForTimeout(2500);

  console.log('🎬 3. Navigating to Graded Readers...');
  await page.goto(`${BASE_URL}/reading`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('🎬 4. Navigating to Kana Studio...');
  await page.goto(`${BASE_URL}/kana`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  console.log('🎬 5. Navigating to Kanji Engine...');
  await page.goto(`${BASE_URL}/kanji`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  console.log('🎬 6. Navigating to Academic Research Paper...');
  await page.goto(`${BASE_URL}/research`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // Close context to finalize video writing
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video file and rename to walkthrough.webm
  const files = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawVideo = path.join(VIDEO_DIR, files[0]);
    const finalVideo = path.join(VIDEO_DIR, 'kando_platform_walkthrough.webm');
    fs.copyFileSync(rawVideo, finalVideo);
    console.log(`✅ Video recorded successfully: ${finalVideo}`);
  }
}

record().catch(console.error);
