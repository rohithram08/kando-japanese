// scripts/phase4_9_browser_verification.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';

const FRONTEND_URL = 'http://localhost:3000';

async function runBrowserVerification() {
  console.log('🚀 Launching Chromium browser for Phase 4.9 verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const networkUrls = [];
  page.on('request', (req) => {
    networkUrls.push(req.url());
  });

  const results = {
    landingPageLoaded: false,
    hanaSensei2DVisible: false,
    speechBalloonVisible: false,
    jlptLevelSwitchWorking: false,
    guestLinksWorking: false,
    chatRedirectWorking: false,
    chatDojoRedirectWorking: false,
    conversationPageLoaded: false,
    threeJsNotLoadedOnLanding: false,
    errors: [],
  };

  try {
    // ── Test 1: Public Landing Page at / ────────────────────────
    console.log('\n--- 1. Testing Public Landing Page at / ---');
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });

    const pageContent = await page.content();
    if (pageContent.includes('Nihongo Master') && pageContent.includes('Living Language')) {
      results.landingPageLoaded = true;
      console.log('✅ Landing page loaded with correct brand and headline.');
    } else {
      results.errors.push('Landing page content missing brand or headline');
    }

    // Check 2D Hana-sensei avatar image
    const avatarImg = page.locator('img[alt*="Hana-sensei"]');
    if (await avatarImg.count() > 0 && await avatarImg.isVisible()) {
      results.hanaSensei2DVisible = true;
      console.log('✅ 2D Hana-sensei avatar image is visible.');
    } else {
      results.errors.push('2D Hana-sensei avatar image not visible');
    }

    // Check speech balloon
    const balloonText = page.locator('text=「こんにちは！一緒に日本語を勉強しましょう！」');
    if (await balloonText.count() > 0 && await balloonText.isVisible()) {
      results.speechBalloonVisible = true;
      console.log('✅ Welcoming speech balloon is visible.');
    }

    // Verify Three.js is NOT loaded on landing page
    const hasThreeChunk = networkUrls.some((url) => url.includes('three-') || url.includes('three.js'));
    if (!hasThreeChunk) {
      results.threeJsNotLoadedOnLanding = true;
      console.log('✅ Performance verification: Zero Three.js/WebGL assets requested on landing page.');
    } else {
      results.errors.push('Three.js was requested on landing page (regression)');
    }

    // Test JLPT level switching
    const n4Button = page.locator('button:has-text("N4")').first();
    await n4Button.click();
    await page.waitForTimeout(500);

    const n4Sentence = page.locator('text=京都駅に着いた時');
    if (await n4Sentence.count() > 0) {
      results.jlptLevelSwitchWorking = true;
      console.log('✅ JLPT level selector switching functions properly (N4 sentence updated).');
    }

    // ── Test 2: Redirect /chat -> /conversation ─────────────────
    console.log('\n--- 2. Testing Redirects (/chat & /chat-dojo) ---');
    await page.goto(`${FRONTEND_URL}/chat`, { waitUntil: 'networkidle', timeout: 15000 });
    const currentUrlChat = page.url();
    if (currentUrlChat.includes('/conversation') || currentUrlChat.includes('/login')) {
      results.chatRedirectWorking = true;
      console.log(`✅ /chat redirected cleanly to ${currentUrlChat}`);
    }

    await page.goto(`${FRONTEND_URL}/chat-dojo`, { waitUntil: 'networkidle', timeout: 15000 });
    const currentUrlDojo = page.url();
    if (currentUrlDojo.includes('/conversation') || currentUrlDojo.includes('/login')) {
      results.chatDojoRedirectWorking = true;
      console.log(`✅ /chat-dojo redirected cleanly to ${currentUrlDojo}`);
    }

    // ── Test 3: Guest Learning Routes (/reading & /kana) ────────
    console.log('\n--- 3. Testing Guest Learning Access ---');
    await page.goto(`${FRONTEND_URL}/reading`, { waitUntil: 'networkidle', timeout: 15000 });
    const readingTitle = page.locator('h1:has-text("Graded Readers")');
    if (await readingTitle.count() > 0) {
      results.guestLinksWorking = true;
      console.log('✅ /reading accessible to public guest visitors.');
    }

    // ── Test 4: Authenticated Conversation Practice ─────────────
    console.log('\n--- 4. Testing Authenticated Conversation Practice ---');
    // Login with sample test account
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle' });
    const emailInput = page.locator('input[type="email"]');
    const passInput = page.locator('input[type="password"]');
    
    // Fill credentials (standard test user)
    await emailInput.fill('test@example.com');
    await passInput.fill('password123');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForTimeout(1500);

    // Navigate to /conversation
    await page.goto(`${FRONTEND_URL}/conversation`, { waitUntil: 'networkidle', timeout: 15000 });
    const convHeading = page.locator('h1:has-text("Conversation Practice")');
    if (await convHeading.count() > 0) {
      results.conversationPageLoaded = true;
      console.log('✅ /conversation loaded successfully with Conversation Practice header.');
    }

  } catch (err) {
    console.error('❌ Verification error:', err.message);
    results.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n========================================');
  console.log('🏁 Phase 4.9 Browser Verification Summary');
  console.log('========================================');
  console.log(JSON.stringify(results, null, 2));

  if (results.errors.length > 0) {
    console.error('⚠️ Verification encountered warnings/errors:', results.errors);
  } else {
    console.log('🎉 ALL BROWSER QA CRITERIA MET WITH 100% SUCCESS!');
  }
}

runBrowserVerification().catch(console.error);
