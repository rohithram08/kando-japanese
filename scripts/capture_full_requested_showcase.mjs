// scripts/capture_full_requested_showcase.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = 'docs/linkedin_showcase';
const VIDEO_DIR = 'docs/linkedin_showcase/video';

if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

const BASE_URL = 'https://kandojapanese.vercel.app';

async function run() {
  console.log('🚀 Starting Full Feature Showcase Recording & Image Capture...');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1280, height: 720 },
    },
    colorScheme: 'dark',
  });

  const page = await context.newPage();

  // 1. Log in
  console.log('🔑 1. Logging in with demo user...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const emailInput = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');

  if (emailInput && passwordInput) {
    await emailInput.fill('rohith_demo_tester@kando.app');
    await passwordInput.fill('Password123!');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await page.waitForTimeout(3000);
  }

  console.log('📍 Current URL after login:', page.url());

  // ── FEATURE 1: HANA-SENSEI AI COMPANION ──
  console.log('🌸 2. Capturing Hana-Sensei AI Companion (/sensei)...');
  await page.goto(`${BASE_URL}/sensei`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await page.screenshot({
    path: path.join(IMAGES_DIR, '07_Hana_Sensei_AI_Companion.png'),
    fullPage: false,
  });

  // ── FEATURE 2: CONVERSATION PRACTICE ──
  console.log('💬 3. Capturing Conversation Practice Dojo (/conversation)...');
  await page.goto(`${BASE_URL}/conversation`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({
    path: path.join(IMAGES_DIR, '08_Conversation_Practice_Dojo.png'),
    fullPage: false,
  });

  // Interact with a conversation scenario if present
  const firstScenario = await page.$('button:has-text("Start"), button:has-text("Practice"), [role="button"]');
  if (firstScenario) {
    await firstScenario.click();
    await page.waitForTimeout(2000);
  }

  // ── FEATURE 3: GRAMMAR MASTERY ──
  console.log('📖 4. Capturing Grammar Learning (/grammar)...');
  await page.goto(`${BASE_URL}/grammar`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Click N3 or N4 tab if visible
  const n3Tab = await page.$('button:has-text("N3"), button:has-text("N4")');
  if (n3Tab) {
    await n3Tab.click();
    await page.waitForTimeout(1000);
  }

  await page.screenshot({
    path: path.join(IMAGES_DIR, '09_Grammar_Mastery_Library.png'),
    fullPage: false,
  });

  // ── FEATURE 4: KANJI STROKE ENGINE ──
  console.log('🖌️ 5. Capturing Kanji Learning Engine (/kanji)...');
  await page.goto(`${BASE_URL}/kanji`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Click first kanji tile
  const firstKanji = await page.$('button[aria-label*="Kanji"], .kanji-card, button:has-text("日"), button:has-text("水")');
  if (firstKanji) {
    await firstKanji.click();
    await page.waitForTimeout(1500);
  }

  await page.screenshot({
    path: path.join(IMAGES_DIR, '10_Kanji_Stroke_Engine_Study.png'),
    fullPage: false,
  });

  // ── FEATURE 5: VOCABULARY STUDY CENTER ──
  console.log('📚 6. Capturing Vocabulary Study (/vocabulary)...');
  await page.goto(`${BASE_URL}/vocabulary`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(IMAGES_DIR, '11_Vocabulary_Study_Center.png'),
    fullPage: false,
  });

  // ── FEATURE 6: LEAGUES & LEADERBOARD ──
  console.log('🏆 7. Capturing Leagues & Weekly Leaderboards (/league)...');
  await page.goto(`${BASE_URL}/league`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(IMAGES_DIR, '12_Leagues_Weekly_Leaderboard.png'),
    fullPage: false,
  });

  // Final review on dashboard
  console.log('📊 8. Capturing User Dashboard Overview (/dashboard)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(IMAGES_DIR, '13_Learner_Dashboard_Overview.png'),
    fullPage: false,
  });

  // Close context to flush video to disk
  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded video and rename it
  const videoFiles = fs.readdirSync(VIDEO_DIR)
    .filter(f => f.endsWith('.webm') && f !== 'kando_platform_walkthrough.webm');
  
  if (videoFiles.length > 0) {
    const rawVideo = path.join(VIDEO_DIR, videoFiles[videoFiles.length - 1]);
    const finalVideo = path.join(VIDEO_DIR, 'kando_full_interactive_demo.webm');
    fs.copyFileSync(rawVideo, finalVideo);
    console.log(`🎉 Master Video generated: ${finalVideo}`);
  }

  console.log('✨ All requested features (Hana-Sensei, Conversation, Grammar, Kanji, Vocab, Leagues) captured successfully!');
}

run().catch(console.error);
