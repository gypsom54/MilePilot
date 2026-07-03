#!/usr/bin/env node
/**
 * Audit welcome screen background stack for OLED-visible colour mismatches.
 * Run: node scripts/verify-welcome-background.js
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const ROOT = path.join(__dirname, '..');
const PORT = 8767;

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

function rgbToHex(rgb) {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return rgb;
  return (
    '#' +
    [m[1], m[2], m[3]]
      .map((n) => Number(n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

async function auditStack(page, label, x, y) {
  return page.evaluate(
    ({ label, x, y }) => {
      const stack = [];
      let el = document.elementFromPoint(x, y);
      while (el && el !== document.documentElement.parentElement) {
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        const img = cs.backgroundImage;
        const opaque =
          bg &&
          bg !== 'rgba(0, 0, 0, 0)' &&
          bg !== 'transparent' &&
          !(bg.startsWith('rgba') && bg.endsWith(', 0)'));
        const hasGradient = img && img !== 'none';
        if (opaque || hasGradient) {
          stack.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            className: (el.className && String(el.className).slice(0, 80)) || null,
            backgroundColor: bg,
            backgroundImage: hasGradient ? img.slice(0, 120) : null,
          });
        }
        el = el.parentElement;
      }
      return { label, x, y, stack };
    },
    { label, x, y }
  );
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices['iPhone 14 Pro'], locale: 'en-GB' });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#welcome.active');
  await page.evaluate(() => document.documentElement.classList.add('mp-expo'));

  const size = page.viewportSize();
  const top = await auditStack(page, 'top', Math.floor(size.width / 2), 80);
  const mid = await auditStack(page, 'mid', Math.floor(size.width / 2), Math.floor(size.height / 2));
  const bottom = await auditStack(page, 'bottom', Math.floor(size.width / 2), size.height - 80);

  const reports = [top, mid, bottom];
  const issues = [];

  for (const r of reports) {
    console.log(`\n=== ${r.label.toUpperCase()} (${r.x}, ${r.y}) ===`);
    r.stack.forEach((layer, i) => {
      const hex = rgbToHex(layer.backgroundColor);
      console.log(`  ${i + 1}. <${layer.tag}${layer.id ? '#' + layer.id : ''}${layer.className ? '.' + layer.className.split(' ')[0] : ''}> bg=${layer.backgroundColor} (${hex})`);
      if (layer.backgroundImage) console.log(`     image: ${layer.backgroundImage}`);
    });
    const solids = r.stack.filter((l) => l.backgroundColor && l.backgroundColor !== 'rgba(0, 0, 0, 0)');
    if (solids.length > 1) {
      const colors = [...new Set(solids.map((l) => l.backgroundColor))];
      if (colors.length > 1) {
        issues.push(`${r.label}: multiple solid backgrounds in stack — ${colors.map((c) => rgbToHex(c)).join(' vs ')}`);
      }
    }
    if (r.stack.some((l) => l.backgroundImage)) {
      issues.push(`${r.label}: gradient/image layer still present in stack`);
    }
  }

  const topHex = top.stack[0] ? rgbToHex(top.stack[0].backgroundColor) : 'none';
  const bottomHex = bottom.stack[0] ? rgbToHex(bottom.stack[0].backgroundColor) : 'none';
  if (topHex !== bottomHex) {
    issues.push(`top surface (${topHex}) !== bottom surface (${bottomHex})`);
  }

  console.log('\n=== AUDIT SUMMARY ===');
  if (issues.length) {
    issues.forEach((i) => console.log('ISSUE:', i));
    process.exitCode = 1;
  } else {
    console.log('OK: uniform background stack top to bottom');
  }

  await browser.close();
  server.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
