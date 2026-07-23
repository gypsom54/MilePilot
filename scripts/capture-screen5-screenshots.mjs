#!/usr/bin/env node
/**
 * MP-UX-LOCK-005 — capture Screen 5 screenshots.
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

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("saved " + file);
}

async function openYourWork(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.69");
    localStorage.setItem("mp_onboard_step", "yourWork");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof showScreen === "function", { timeout: 15000 });
  await page.evaluate(() => {
    if (typeof initWorkCategory === "function") initWorkCategory();
    showScreen("yourWork");
  });
  await page.waitForSelector("#yourWork.active", { timeout: 10000 });
}

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0", timeout: 60000 });
  await openYourWork(page);
  await new Promise((r) => setTimeout(r, 350));
  await shot(page, `screen5-work-empty-${vp.name}.png`);
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openYourWork(page);
  await page.click('[data-work-category="freelance"]');
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "screen5-work-selected-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openYourWork(page);
  await page.focus('[data-work-category="driver"]');
  await new Promise((r) => setTimeout(r, 350));
  await shot(page, "screen5-work-focus-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(base, { waitUntil: "networkidle0" });
  await openYourWork(page);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "125%";
  });
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "screen5-work-large-text-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.69");
    localStorage.setItem("mp_onboard_step", "personalIntro");
    localStorage.setItem("mp_user_first_name", "Alex");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof finishPersonalIntro === "function");
  await page.evaluate(() => {
    initPersonalIntro();
    showScreen("personalIntro");
  });
  await page.waitForSelector("#personalIntro.active");
  await page.evaluate(() => finishPersonalIntro());
  await page.waitForSelector("#yourWork.active");
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, "screen5-flow-from-screen4-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openYourWork(page);
  await page.evaluate(() => {
    const cards = document.querySelector(".mp-work-cards");
    if (cards) cards.scrollTop = cards.scrollHeight;
  });
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "screen5-work-continue-visible-390x844.png");
  await page.close();
}

await browser.close();
server.close();
console.log("Screenshots complete -> " + outDir);
