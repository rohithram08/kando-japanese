// scripts/measure_production_network.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';

const PROD_URL = 'http://localhost:4173';

async function measureRoute(url, label) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  page.on('response', async (response) => {
    const reqUrl = response.url();
    if (reqUrl.includes('.js') || reqUrl.includes('.css')) {
      let bodyLength = 0;
      try {
        const buffer = await response.body();
        bodyLength = buffer.length;
      } catch (e) {}
      requests.push({
        url: reqUrl,
        status: response.status(),
        size: bodyLength,
        type: reqUrl.includes('.css') ? 'css' : 'js',
      });
    }
  });

  console.log(`\nNavigating to ${url} (${label})...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const jsRequests = requests.filter(r => r.type === 'js');
  const cssRequests = requests.filter(r => r.type === 'css');
  const totalJsSize = jsRequests.reduce((sum, r) => sum + r.size, 0);
  const totalCssSize = cssRequests.reduce((sum, r) => sum + r.size, 0);

  const threeJsRequested = jsRequests.some(r => r.url.toLowerCase().includes('three') || r.url.toLowerCase().includes('vrm'));
  const chartsRequested = jsRequests.some(r => r.url.toLowerCase().includes('charts'));

  console.log(`Results for ${label}:`);
  console.log(`- Total JS Requests: ${jsRequests.length}`);
  console.log(`- Total JS Transferred: ${(totalJsSize / 1024).toFixed(2)} kB`);
  console.log(`- Total CSS Transferred: ${(totalCssSize / 1024).toFixed(2)} kB`);
  console.log(`- Three.js / VRM chunk requested: ${threeJsRequested ? 'YES (LEAKED/LOADED)' : 'NO (DEFERRED)'}`);
  console.log(`- Charts (recharts) chunk requested: ${chartsRequested ? 'YES (LEAKED/LOADED)' : 'NO (DEFERRED)'}`);
  console.log('Individual JS files:');
  jsRequests.forEach(r => {
    const filename = r.url.split('/').pop().split('?')[0];
    console.log(`  * ${filename}: ${(r.size / 1024).toFixed(2)} kB`);
  });

  await browser.close();

  return {
    label,
    url,
    totalJsSize,
    totalCssSize,
    threeJsRequested,
    chartsRequested,
    jsRequests,
  };
}

async function measureOnDemandSensei() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  page.on('response', async (response) => {
    const reqUrl = response.url();
    if (reqUrl.includes('.js')) {
      let bodyLength = 0;
      try {
        const buffer = await response.body();
        bodyLength = buffer.length;
      } catch (e) {}
      requests.push({
        url: reqUrl,
        size: bodyLength,
      });
    }
  });

  console.log(`\nTesting On-Demand 3D Loading via Floating Sensei Companion Button...`);
  await page.goto(`${PROD_URL}/reading`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const initialThreeLoaded = requests.some(r => r.url.toLowerCase().includes('three'));
  console.log(`- Before clicking Sensei button: Three.js loaded: ${initialThreeLoaded ? 'YES' : 'NO (DEFERRED)'}`);

  // Click the floating Sensei button to open the chat window
  const senseiButton = page.locator('button[aria-label*="AI Sensei Movable Companion"]');
  if (await senseiButton.isVisible()) {
    console.log(`- Clicking floating Sensei button to open 3D companion dialog...`);
    await senseiButton.click();
    await page.waitForTimeout(1000);
  }

  const afterClickThreeLoaded = requests.some(r => r.url.toLowerCase().includes('three') || r.url.toLowerCase().includes('senseicharacter'));
  console.log(`- After clicking Sensei button: 3D character & Three.js loaded: ${afterClickThreeLoaded ? 'YES (LOADED ON DEMAND!)' : 'NO'}`);

  await browser.close();
  return { initialThreeLoaded, afterClickThreeLoaded };
}

async function measureAuthenticatedSenseiPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Mock authenticated session
  await page.route('**/api/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'qa_user_3d',
        email: 'qa3d@nihongomaster.test',
        username: 'QA Sensei User',
        current_level: 'N5',
        xp_points: 500,
      }),
    });
  });

  const requests = [];
  page.on('response', async (response) => {
    const reqUrl = response.url();
    if (reqUrl.includes('.js')) {
      requests.push(reqUrl);
    }
  });

  console.log(`\nNavigating to ${PROD_URL}/sensei (Authenticated Dedicated 3D Route)...`);
  await page.goto(`${PROD_URL}/sensei`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const threeOnSenseiPage = requests.some(r => r.toLowerCase().includes('three') || r.toLowerCase().includes('senseicharacter'));
  console.log(`- Dedicated /sensei page loads 3D character: ${threeOnSenseiPage ? 'YES (VERIFIED ON SENSEI PAGE)' : 'NO'}`);

  await browser.close();
  return { threeOnSenseiPage };
}

async function run() {
  console.log('=== MEASURING PRODUCTION NETWORK TRANSFER (VITE PREVIEW) ===');
  const readingResult = await measureRoute(`${PROD_URL}/reading`, '/reading (Catalog)');
  const storyResult = await measureRoute(`${PROD_URL}/reading/story_n5_01`, '/reading/story_n5_01 (Reader)');
  const onDemandSensei = await measureOnDemandSensei();
  const authSenseiPage = await measureAuthenticatedSenseiPage();

  fs.writeFileSync('scripts/production_network_results.json', JSON.stringify({
    readingResult,
    storyResult,
    onDemandSensei,
    authSenseiPage,
  }, null, 2));

  console.log('\n✅ Performance Measurement Suite Finished Successfully!');
}

run().catch(console.error);
