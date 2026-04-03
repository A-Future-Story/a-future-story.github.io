import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);

const totalHeight = await page.evaluate(() => document.body.scrollHeight);
console.log('Total scroll height:', totalHeight);

const shots = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100];
for (const pct of shots) {
  const y = Math.floor((totalHeight - 900) * pct / 100);
  await page.evaluate(s => window.scrollTo(0, s), y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/r2-${String(pct).padStart(3,'0')}.png` });
}

// Mobile
await page.setViewportSize({ width: 375, height: 812 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/r2-mobile.png' });

console.log('JS Errors:', errors.length ? errors : 'None');
await browser.close();
