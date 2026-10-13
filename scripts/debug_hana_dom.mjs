import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log('--- Landing Page ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  console.log('Hana containers on /:', await page.locator('[data-testid="hana-character-container"]').count());

  console.log('--- Kana Page ---');
  await page.goto('http://localhost:3000/kana', { waitUntil: 'networkidle' });
  console.log('Hana containers before tab click:', await page.locator('[data-testid="hana-character-container"]').count());
  const guideTab = page.locator('button:has-text("Guide")').first();
  console.log('Guide tab visible:', await guideTab.isVisible());
  if (await guideTab.isVisible()) {
    await guideTab.click();
    await page.waitForTimeout(500);
    console.log('Hana containers after Guide click:', await page.locator('[data-testid="hana-character-container"]').count());
  }

  const quizTab = page.locator('button:has-text("Recognition Quiz")').first();
  if (await quizTab.isVisible()) {
    await quizTab.click();
    await page.waitForTimeout(500);
    const startBtn = page.locator('button:has-text("Start Practice Session")');
    if (await startBtn.isVisible()) {
      await startBtn.click();
      await page.waitForTimeout(500);
      console.log('Hana containers in active quiz:', await page.locator('[data-testid="hana-character-container"]').count());
    }
  }

  console.log('--- Conversation Page ---');
  await page.goto('http://localhost:3000/conversation', { waitUntil: 'networkidle' });
  console.log('Hana containers on /conversation:', await page.locator('[data-testid="hana-character-container"]').count());

  await browser.close();
}

check().catch(console.error);
