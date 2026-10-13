// scripts/capture_phase_d_screenshots.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const FRONTEND_URL = 'http://localhost:3000';
const OUT_DIR = 'docs/quality/screenshots/phase_d';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capturePhaseDScreenshots() {
  console.log('Capturing Phase D screenshots (JLPT Level Picker, Stat Counters in Light & Dark modes)...');
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

      // Scroll to JLPT Level Picker (#curriculum)
      await page.evaluate(() => {
        const el = document.getElementById('curriculum');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(600);

      // Interact: click N3 level card
      const n3Card = await page.$('button[aria-label*="N3"]');
      if (n3Card) await n3Card.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_light_level_picker.png'), fullPage: false });

      // Scroll to StatCounters section
      await page.evaluate(() => {
        window.scrollBy(0, 1800);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_light_stat_counters.png'), fullPage: false });

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

      // Scroll to JLPT Level Picker (#curriculum)
      await page.evaluate(() => {
        const el = document.getElementById('curriculum');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(600);

      // Interact: click N2 level card
      const n2Card = await page.$('button[aria-label*="N2"]');
      if (n2Card) await n2Card.click();
      await page.waitForTimeout(400);

      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_dark_level_picker.png'), fullPage: false });

      // Scroll to StatCounters
      await page.evaluate(() => {
        window.scrollBy(0, 1800);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'desktop_dark_stat_counters.png'), fullPage: false });

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

      // Scroll to Level Picker
      await page.evaluate(() => {
        const el = document.getElementById('curriculum');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_level_picker.png'), fullPage: false });

      // Scroll to StatCounters
      await page.evaluate(() => {
        window.scrollBy(0, 2400);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_light_stat_counters.png'), fullPage: false });

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

      // Scroll to Level Picker
      await page.evaluate(() => {
        const el = document.getElementById('curriculum');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_level_picker.png'), fullPage: false });

      // Scroll to StatCounters
      await page.evaluate(() => {
        window.scrollBy(0, 2400);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_stat_counters.png'), fullPage: false });

      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_dark_full.png'), fullPage: true });
      await context.close();
      console.log('✓ Mobile dark screenshots captured');
    }

    console.log(`\n🎉 All Phase D screenshots successfully saved in ${OUT_DIR}`);
  } finally {
    await browser.close();
  }
}

capturePhaseDScreenshots().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
