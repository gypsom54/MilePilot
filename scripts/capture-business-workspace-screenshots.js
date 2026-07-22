#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'mp-s6-001');
const ROOT = path.join(__dirname, '..');
const PORT = 8779;

const chromePaths = ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter((p) =>
  fs.existsSync(p)
);
const executablePath = chromePaths[0];
if (!executablePath) {
  console.warn('Chrome not found — skipping screenshots');
  process.exit(0);
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

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('PAGE', e.message));

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active #mpBusinessWorkspaceRoot .mp-bw-ask', { timeout: 20000 });
  await page.screenshot({ path: path.join(OUT, '01-business-home-mobile.png'), fullPage: true });

  await page.evaluate(() => window.MPBusinessWorkspace.showTool('expenses'));
  await page.waitForSelector('#mpBusinessToolRoot .mp-bw-empty', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '02-expenses-empty-mobile.png'), fullPage: true });

  await page.evaluate(() => window.showAsk());
  await page.waitForSelector('#ask.active #mpAskShellRoot .mp-ask-scene', { timeout: 15000 });
  await page.screenshot({ path: path.join(OUT, '03-ask-still-works-mobile.png'), fullPage: true });

  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active .mp-bw-tools', { timeout: 20000 });
  await page.screenshot({ path: path.join(OUT, '04-business-home-desktop.png'), fullPage: false });

  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active .mp-bw-ask', { timeout: 20000 });
  await page.screenshot({ path: path.join(OUT, '05-business-home-375x812.png'), fullPage: true });

  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active .mp-bw-tools', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '06-business-home-768x1024.png'), fullPage: true });

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active .mp-bw-tools', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '07-business-home-1440x900.png'), fullPage: false });

  await page.setViewport({ width: 320, height: 568, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await seed(page);
  await page.evaluate(() => window.showBusiness());
  await page.waitForSelector('#business.active', { timeout: 20000 });
  await page.waitForSelector('#nav.show', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '08-nav-density-320x568.png'), fullPage: false });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.evaluate(() => {
    window.MPBusinessWorkspace.showTool('expenses');
  });
  await page.waitForSelector('#mpBusinessToolRoot [data-bw-back]', { timeout: 10000 });
  await page.screenshot({ path: path.join(OUT, '09-expenses-focus-back-390x844.png'), fullPage: true });

  await browser.close();
  server.close();
  console.log('Screenshots saved to', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
