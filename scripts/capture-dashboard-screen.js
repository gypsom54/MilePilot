#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium, devices } = require('playwright');

const OUT = path.join('/opt/cursor/artifacts/screenshots');
const ROOT = path.join(__dirname, '..');
const PORT = 8772;

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
        const types = { '.html': 'text/html', '.js': 'application/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 14 Pro'], locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('mp_driver', 'Jonathan');
    localStorage.setItem('mp_vehicle', 'car');
    localStorage.setItem('mp_onboard_complete', 'true');
    localStorage.setItem('mp_trial_started_at', new Date().toISOString());
    localStorage.setItem('mp_tracking_mode', 'autopilot');
    if (typeof MPSubscription !== 'undefined') MPSubscription.startTrialIfNeeded();
    if (typeof renderCommandCentre === 'function') renderCommandCentre();
    if (typeof showScreen === 'function') showScreen('home');
    if (typeof setNav === 'function') setNav('Home');
  });
  await page.waitForSelector('#home.active', { timeout: 15000 });
  await page.waitForTimeout(500);
  const file = path.join(OUT, 'dashboard-phase1-polish.png');
  await page.screenshot({ path: file, fullPage: true });
  console.log('Saved:', file);
  await browser.close();
  server.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
