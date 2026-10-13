import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';

async function checkConv() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:3000/conversation', { waitUntil: 'networkidle' });
  console.log('Errors on /conversation:', errors);
  const count = await page.locator('[data-testid="hana-character-container"]').count();
  console.log('Count:', count);

  const html = await page.content();
  console.log('Contains data-testid="hana-character-container":', html.includes('data-testid="hana-character-container"'));
  console.log('Contains Conversation Practice:', html.includes('Conversation Practice'));

  await browser.close();
}

checkConv().catch(console.error);
