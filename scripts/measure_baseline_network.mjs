// scripts/measure_baseline_network.mjs
import { chromium } from 'file:///C:/Users/acer/.gemini/antigravity/brain/9a83546b-194d-4e9e-8f5c-8aa530791e5b/scratch/node_modules/playwright/index.mjs';
import fs from 'fs';

const FRONTEND_URL = 'http://localhost:3000';

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
      } catch (e) {
        // failed or aborted
      }
      requests.push({
        url: reqUrl,
        status: response.status(),
        size: bodyLength,
        type: reqUrl.includes('.css') ? 'css' : 'js',
      });
    }
  });

  console.log(`Navigating to ${url} (${label})...`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const jsRequests = requests.filter(r => r.type === 'js');
  const cssRequests = requests.filter(r => r.type === 'css');
  const totalJsSize = jsRequests.reduce((sum, r) => sum + r.size, 0);
  const totalCssSize = cssRequests.reduce((sum, r) => sum + r.size, 0);

  const threeJsRequested = jsRequests.some(r => r.url.toLowerCase().includes('three') || r.url.toLowerCase().includes('vrm'));

  console.log(`\nResults for ${label}:`);
  console.log(`- Total JS Requests: ${jsRequests.length}`);
  console.log(`- Total JS Transferred: ${(totalJsSize / 1024).toFixed(2)} kB`);
  console.log(`- Total CSS Transferred: ${(totalCssSize / 1024).toFixed(2)} kB`);
  console.log(`- Three.js / VRM chunk requested: ${threeJsRequested ? 'YES (LEAKED/LOADED)' : 'NO (DEFERRED)'}`);
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
    jsRequests,
  };
}

async function run() {
  console.log('=== MEASURING BASELINE NETWORK TRANSFER ===');
  const readingResult = await measureRoute(`${FRONTEND_URL}/reading`, '/reading (Catalog)');
  const storyResult = await measureRoute(`${FRONTEND_URL}/reading/story_n5_01`, '/reading/story_n5_01 (Reader)');
  const senseiResult = await measureRoute(`${FRONTEND_URL}/sensei`, '/sensei (3D Experience)');

  fs.writeFileSync('scripts/baseline_network_results.json', JSON.stringify({
    readingResult,
    storyResult,
    senseiResult
  }, null, 2));
}

run().catch(console.error);
