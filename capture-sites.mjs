import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });

// Capture drac.ai
try {
  const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p1.goto('https://drac.ai', { waitUntil: 'networkidle', timeout: 15000 });
  await p1.waitForTimeout(2000);
  await p1.screenshot({ path: 'public/previews/drac-ai.png' });
  console.log('drac.ai captured');
  await p1.close();
} catch(e) { console.log('drac.ai failed:', e.message); }

// Capture helpexa.com
try {
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto('https://helpexa.com', { waitUntil: 'networkidle', timeout: 15000 });
  await p2.waitForTimeout(2000);
  await p2.screenshot({ path: 'public/previews/helpexa.png' });
  console.log('helpexa.com captured');
  await p2.close();
} catch(e) { console.log('helpexa.com failed:', e.message); }

await browser.close();
