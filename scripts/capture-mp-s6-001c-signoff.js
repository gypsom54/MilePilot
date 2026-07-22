#!/usr/bin/env node
/**
 * MP-S6-001C — Business Workspace visual sign-off captures
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'mp-s6-001c');
const ROOT = path.join(__dirname, '..');
const PORT = 8783;

const chromePaths = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter((p) =>
  fs.existsSync(p)
);
const executablePath = chromePaths[0];
if (!executablePath) {
  console.error('Chrome not found');
  process.exit(1);
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(ROOT, 'frontend', req.url === '/' ? 'index.html' : req.url.replace(/^\//, ''));
      if (!filePath.startsWith(path.join(ROOT, 'frontend'))) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end();
          return;
        }
        const ext = path.extname(filePath);
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function seed(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('mp_driver', 'Jonathan');
    localStorage.setItem('mp_vehicle', 'car');
    localStorage.setItem('mp_onboard_complete', 'true');
    localStorage.setItem('mp_trial_started_at', new Date().toISOString());
    localStorage.setItem('mp_location_choice', 'granted');
  });
  await page.reload({ waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForFunction(() => typeof window.showBusiness === 'function', { timeout: 30000 });
}

async function captureHome(page, file, viewport) {
  await page.setViewport(viewport);
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active .mp-bw-tools', { timeout: 20000 });
  await page.screenshot({ path: path.join(OUT, file), fullPage: viewport.height >= 800 });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  const homes = [
    ['01-home-320x568.png', { width: 320, height: 568, deviceScaleFactor: 2 }],
    ['02-home-375x812.png', { width: 375, height: 812, deviceScaleFactor: 2 }],
    ['03-home-390x844.png', { width: 390, height: 844, deviceScaleFactor: 2 }],
    ['04-home-768x1024.png', { width: 768, height: 1024, deviceScaleFactor: 2 }],
    ['05-home-1280x800.png', { width: 1280, height: 800, deviceScaleFactor: 1 }],
    ['06-home-1440x900.png', { width: 1440, height: 900, deviceScaleFactor: 1 }],
  ];

  for (const [file, vp] of homes) {
    await captureHome(page, file, vp);
  }

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.evaluate(() => window.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true }));
  await page.waitForSelector('[data-bw-tool-heading]', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '07-expenses-empty-mobile.png'), fullPage: true });

  await page.evaluate(() => window.showBusiness());
  await page.evaluate(() => window.MPBusinessWorkspace.showTool('vat', { recordOrigin: true }));
  await page.waitForSelector('[data-bw-tool-heading]', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '08-vat-empty-mobile.png'), fullPage: true });

  await page.evaluate(() => window.showBusiness());
  await page.evaluate(() => {
    window.MPBusinessWorkspace.openAskWithQuestion('How much can I claim this month?');
  });
  await page.waitForSelector('#ask.active .mp-ask-scene', { timeout: 15000 });
  await page.screenshot({ path: path.join(OUT, '09-ask-handoff-mobile.png'), fullPage: true });

  await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#nav.show', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '10-nav-six-tab-320.png'), fullPage: false });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => window.showBusiness());
  await page.evaluate(() => window.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true }));
  await page.waitForSelector('[data-bw-tool-heading]', { timeout: 10000 });
  await page.evaluate(() => {
    const h = document.querySelector('[data-bw-tool-heading]');
    if (h) h.focus();
  });
  await page.screenshot({ path: path.join(OUT, '11-tool-heading-focus-visible.png'), fullPage: true });

  await page.evaluate(() => window.MPBusinessWorkspace.showHome());
  await page.waitForSelector('[data-bw-tool="expenses"]', { timeout: 10000 });
  await page.evaluate(() => {
    const card = document.querySelector('[data-bw-tool="expenses"]');
    if (card) card.focus();
  });
  await page.screenshot({ path: path.join(OUT, '12-card-focus-restored.png'), fullPage: true });

  await browser.close();
  server.close();
  console.log('MP-S6-001C screenshots saved to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
