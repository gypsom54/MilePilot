#!/usr/bin/env node
/**
 * MP-UX-LOCK-002 — capture Screen 1/2 screenshots at required viewports.
 * Usage: node scripts/capture-screen2-screenshots.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = process.env.SCREENSHOT_OUT || "/opt/cursor/artifacts/screenshots";
const viewports = [
  { w: 320, h: 568, name: "320x568" },
  { w: 375, h: 812, name: "375x812" },
  { w: 390, h: 844, name: "390x844" },
  { w: 430, h: 932, name: "430x932" },
  { w: 768, h: 1024, name: "768x1024" },
];

fs.mkdirSync(outDir, { recursive: true });

const server = createServer((req, res) => {
  let filePath = path.join(root, "frontend", req.url === "/" ? "index.html" : req.url.replace(/^\//, ""));
  if (!filePath.startsWith(path.join(root, "frontend"))) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath);
  const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json" };
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/index.html`;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved " + file);
}

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0", timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#welcome.active", { timeout: 15000 });
  await shot(page, `screen1-splash-${vp.name}.png`);
  await page.click(".welcome-get-started");
  await page.waitForSelector("#introduction.active", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 900));
  await shot(page, `screen2-intro-${vp.name}.png`);
  await page.close();
}

// Transition frame
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#welcome.active", { timeout: 15000 });
  await page.click(".welcome-get-started");
  await new Promise((r) => setTimeout(r, 200));
  await shot(page, "splash-to-intro-transition-390x844.png");
  await page.close();
}

// Focus visible on CTA
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#welcome.active");
  await page.click(".welcome-get-started");
  await page.waitForSelector("#introduction.active");
  await page.focus("#mpIntroContinue");
  await shot(page, "screen2-focus-390x844.png");
  await page.close();
}

// Large text / a11y scaling
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = "125%";
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#welcome.active");
  await page.click(".welcome-get-started");
  await page.waitForSelector("#introduction.active");
  await shot(page, "screen2-large-text-390x844.png");
  await page.close();
}

await browser.close();
server.close();
console.log("Screenshots complete -> " + outDir);
