// scripts/capture_phase_c_screenshots.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const FRONTEND_URL = 'http://localhost:3000';
const OUT_DIR = 'docs/quality/screenshots/phase_c';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capturePhaseCScreenshots() {
  console.log('Capturing Phase C screenshots (5 Tappable Mini-Demos in Light & Dark modes)...');
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop Light (1280x800)
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: 'light',
      });
      const page = await context.newPage();
      await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      });
      await page.waitForTimeout(500);

      // Scroll to Step 01 & 02 (Kana & Reader demos)
      await page.evaluate(() => {
        const el = document.querySelector('h2');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(800);

      // Interact with Kana tile (tap い)
      const kanaTile = await page.$('button[aria-label="Practice Kana い (i)"]');
      if (kanaTile) await kanaTile.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_light_kana_reader.png'), fullPage: false });

      // Scroll to Step 03 & 04 (Dojo & SRS demos)
      await page.evaluate(() => {
        window.scrollBy(0, 900);
      });
      await page.waitForTimeout(800);

      // Interact with SRS card flip
      const flipBtn = await page.$('button:has-text("Tap to Flip")');
      if (flipBtn) await flipBtn.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_light_dojo_srs.png'), fullPage: false });
      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_light_full.png'), fullPage: true });
      await context.close();
      console.log('✓ Desktop light screenshots captured');
    }

    // 2. Desktop Dark (1280x800)
    {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: 'dark',
      });
      const page = await context.newPage();
      await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      });
      await page.waitForTimeout(500);

      // Scroll to Step 01 & 02
      await page.evaluate(() => {
        const el = document.querySelector('h2');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(800);

      const kanaTile = await page.$('button[aria-label="Practice Kana い (i)"]');
      if (kanaTile) await kanaTile.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_dark_kana_reader.png'), fullPage: false });

      // Scroll to Step 03 & 04 & 05
      await page.evaluate(() => {
        window.scrollBy(0, 900);
      });
      await page.waitForTimeout(800);

      const flipBtn = await page.$('button:has-text("Tap to Flip")');
      if (flipBtn) await flipBtn.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_dark_dojo_srs.png'), fullPage: false });
      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_dark_full.png'), fullPage: true });
      await context.close();
      console.log('✓ Desktop dark screenshots captured');
    }

    // 3. Mobile Light (375x812)
    {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        colorScheme: 'light',
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      });
      await page.waitForTimeout(500);

      // Scroll to Kana mini-demo
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_step1_kana.png'), fullPage: false });

      // Scroll to Reader mini-demo
      await page.evaluate(() => {
        window.scrollBy(0, 750);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_step2_reader.png'), fullPage: false });

      // Scroll to Dojo & SRS
      await page.evaluate(() => {
        window.scrollBy(0, 750);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_step3_dojo.png'), fullPage: false });

      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_full.png'), fullPage: true });
      await context.close();
      console.log('✓ Mobile light screenshots captured');
    }

    // 4. Mobile Dark (375x812)
    {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        colorScheme: 'dark',
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      });
      await page.waitForTimeout(500);

      // Scroll to Step 01
      await page.evaluate(() => {
        window.scrollBy(0, 800);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_step1_kana.png'), fullPage: false });

      // Scroll to Step 02
      await page.evaluate(() => {
        window.scrollBy(0, 750);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_step2_reader.png'), fullPage: false });

      // Scroll to Step 03 & 04
      await page.evaluate(() => {
        window.scrollBy(0, 750);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_step3_dojo.png'), fullPage: false });

      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_full.png'), fullPage: true });
      await context.close();
      console.log('✓ Mobile dark screenshots captured');
    }

    console.log(`\n🎉 All Phase C screenshots successfully saved in ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

capturePhaseCScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
