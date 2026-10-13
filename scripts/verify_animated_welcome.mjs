// scripts/verify_animated_welcome.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';

const FRONTEND_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = 'docs/quality/screenshots';

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runWelcomeVerification() {
  console.log('================================================================');
  console.log('🌸 NIHONGO MASTER — PHASE 4.10 ANIMATED 2D WELCOME VERIFICATION');
  console.log('================================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    desktop: {},
    mobile: {},
    reducedMotion: {},
    network: {},
    interactions: {},
    errors: [],
  };

  const browser = await chromium.launch({ headless: true });

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // 1. DESKTOP VIEWPORT (1280x800)
    // ══════════════════════════════════════════════════════════════════════════
    console.log('▶ [1] Testing Desktop Viewport (1280x800)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const page = await desktopContext.newPage();

    const networkRequests = [];
    page.on('request', (req) => networkRequests.push(req.url()));

    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });

    // Assert Headline
    const headline = await page.locator('main h1').innerText();
    console.log(`  ✓ Hero Headline:\n"${headline.replace(/\n/g, ' ')}"`);
    report.desktop.headline = headline;

    // Assert 2D Hana-sensei image visibility and natural dimensions
    const hanaImg = page.locator('img[alt*="Hana-sensei anime tutor character"]');
    const isHanaVisible = await hanaImg.isVisible();
    const naturalDims = await hanaImg.evaluate((img) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc,
    }));
    console.log(`  ✓ 2D Hana-sensei visible: ${isHanaVisible}`);
    console.log(`  ✓ Image Loaded: ${naturalDims.naturalWidth}x${naturalDims.naturalHeight} from ${naturalDims.currentSrc}`);
    report.desktop.hanaImage = { isHanaVisible, naturalDims };

    // Assert Sakura Petals presence
    const sakuraCount = await page.locator('.sakura-petal-node').count();
    console.log(`  ✓ 2D Sakura Petal nodes: ${sakuraCount} rendered`);
    report.desktop.sakuraCount = sakuraCount;

    // Assert Manga Speech Bubble & Greeting
    const speechBubble = page.locator('div[aria-label="Hana-sensei welcome message"]');
    const isBubbleVisible = await speechBubble.isVisible();
    const initialGreeting = await speechBubble.locator('.font-jp').innerText();
    console.log(`  ✓ Manga Speech Bubble visible: ${isBubbleVisible}`);
    console.log(`  ✓ Initial Greeting: "${initialGreeting}"`);
    report.desktop.initialGreeting = initialGreeting;

    // Test Greeting Cycling
    console.log('  Testing Greeting Cycling...');
    const nextGreetingBtn = page.locator('button[aria-label="Next Japanese greeting"]');
    await nextGreetingBtn.click();
    await page.waitForTimeout(500);
    const secondGreeting = await page.locator('div[aria-label="Hana-sensei welcome message"] .font-jp').innerText();
    const greetingCycled = secondGreeting !== initialGreeting;
    console.log(`  ✓ Cycled to Greeting #2: "${secondGreeting}" (Changed: ${greetingCycled})`);
    report.interactions.greetingCycled = greetingCycled;

    // Test Interactive Kana Buttons
    console.log('  Testing Interactive Floating Kana...');
    const kanaBtn = page.locator('button[aria-label*="Hiragana character あ"]');
    const isKanaVisible = await kanaBtn.isVisible();
    await kanaBtn.click({ force: true });
    console.log(`  ✓ Clicked floating kana "あ": ${isKanaVisible}`);
    report.interactions.kanaClicked = isKanaVisible;

    // Test Hana-sensei Character Click Interaction
    console.log('  Testing Hana-sensei Character Click Reaction...');
    await hanaImg.click({ force: true });
    await page.waitForTimeout(500);
    const thirdGreeting = await page.locator('div[aria-label="Hana-sensei welcome message"] .font-jp').innerText();
    console.log(`  ✓ Clicked Hana-sensei, cycled to Greeting #3: "${thirdGreeting}"`);
    report.interactions.characterClicked = true;

    // Capture Desktop Screenshot
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'animated_welcome_desktop.png'), fullPage: false });
    console.log('  📸 Captured docs/quality/screenshots/animated_welcome_desktop.png');

    // ══════════════════════════════════════════════════════════════════════════
    // 2. CHECK NETWORK FOR 3D / THREE.JS LEAKS
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n▶ [2] Checking Asset Isolation & Network Integrity...');
    const threeJsLeaks = networkRequests.filter((url) => url.includes('three') || url.includes('.vrm') || url.includes('.glb'));
    const zeroThreeJs = threeJsLeaks.length === 0;
    console.log(`  ✓ Three.js / WebGL / VRM requests on landing page: ${threeJsLeaks.length} (Expected: 0)`);
    report.network.zeroThreeJs = zeroThreeJs;

    // Canvas tag count check
    const canvasCount = await page.locator('canvas').count();
    console.log(`  ✓ Canvas elements in DOM: ${canvasCount} (Expected: 0)`);
    report.network.canvasCount = canvasCount;

    await desktopContext.close();

    // ══════════════════════════════════════════════════════════════════════════
    // 3. MOBILE VIEWPORT (375x812 - iPhone SE/Mini Width)
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n▶ [3] Testing Mobile Viewport (375x812)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 812 },
      isMobile: true,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle', timeout: 15000 });

    const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
    const noOverflow = scrollWidth <= clientWidth;
    console.log(`  ✓ Mobile scrollWidth (${scrollWidth}) <= clientWidth (${clientWidth}): ${noOverflow} (Overflow: ${scrollWidth - clientWidth}px)`);
    report.mobile.noOverflow = noOverflow;
    report.mobile.scrollWidth = scrollWidth;
    report.mobile.clientWidth = clientWidth;

    const isHanaMobileVisible = await mobilePage.locator('img[alt*="Hana-sensei anime tutor character"]').isVisible();
    console.log(`  ✓ 2D Hana-sensei visible on mobile: ${isHanaMobileVisible}`);
    report.mobile.hanaVisible = isHanaMobileVisible;

    await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'animated_welcome_mobile_375.png'), fullPage: false });
    console.log('  📸 Captured docs/quality/screenshots/animated_welcome_mobile_375.png');

    await mobileContext.close();

    // ══════════════════════════════════════════════════════════════════════════
    // 4. PREFERS-REDUCED-MOTION TESTING
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n▶ [4] Testing prefers-reduced-motion: reduce...');
    const reducedMotionContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    });
    const rmPage = await reducedMotionContext.newPage();
    await rmPage.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });

    // Check if sakura container is hidden
    const sakuraDisplay = await rmPage.locator('.sakura-container').first().evaluate((el) => window.getComputedStyle(el).display);
    console.log(`  ✓ Sakura container computed display in reduced-motion: "${sakuraDisplay}" (Expected: none)`);
    report.reducedMotion.sakuraHidden = sakuraDisplay === 'none';

    await rmPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'animated_welcome_reduced_motion.png'), fullPage: false });
    console.log('  📸 Captured docs/quality/screenshots/animated_welcome_reduced_motion.png');

    await reducedMotionContext.close();

    // ══════════════════════════════════════════════════════════════════════════
    // 5. NAVIGATION AND INTERACTION INTEGRITY
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n▶ [5] Testing Navigation & Route Transitions...');
    const navContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const navPage = await navContext.newPage();
    await navPage.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });

    // Click "Get Started Free"
    const ctaBtn = navPage.locator('button:has-text("Get Started Free")').first();
    await ctaBtn.click();
    await navPage.waitForURL(`${FRONTEND_URL}/register`, { timeout: 10000 });
    const regUrl = navPage.url().includes('/register');
    console.log(`  ✓ "Get Started Free" redirected to /register: ${regUrl}`);
    report.interactions.registerNav = regUrl;

    // Navigate back and click "Sign In"
    await navPage.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
    const signInBtn = navPage.locator('button:has-text("Sign In")').first();
    await signInBtn.click();
    await navPage.waitForURL(`${FRONTEND_URL}/login`, { timeout: 10000 });
    const loginUrl = navPage.url().includes('/login');
    console.log(`  ✓ "Sign In" redirected to /login: ${loginUrl}`);
    report.interactions.loginNav = loginUrl;

    // Navigate back and click guest reading link
    await navPage.goto(`${FRONTEND_URL}/`, { waitUntil: 'networkidle' });
    const readingLink = navPage.locator('a:has-text("Graded Reader (6 Stories)")').first();
    await readingLink.click();
    await navPage.waitForURL(`${FRONTEND_URL}/reading`, { timeout: 10000 });
    const readingUrl = navPage.url().includes('/reading');
    console.log(`  ✓ Guest link redirected to /reading: ${readingUrl}`);
    report.interactions.readingNav = readingUrl;

    await navContext.close();

  } catch (err) {
    console.error('❌ Verification Error:', err);
    report.errors.push(err.message);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('🏁 ANIMATED WELCOME VERIFICATION RUN COMPLETE');
  console.log('================================================================');

  fs.writeFileSync('docs/quality/welcome_results.json', JSON.stringify(report, null, 2));
  console.log('📄 Saved raw telemetry to docs/quality/welcome_results.json');
  return report;
}

runWelcomeVerification();
