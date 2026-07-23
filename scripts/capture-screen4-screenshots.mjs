#!/usr/bin/env node
/**
 * MP-UX-LOCK-004 — capture Screen 4 screenshots.
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

async function openPersonalIntro(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.72");
    localStorage.setItem("mp_onboard_step", "personalIntro");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof showScreen === "function", { timeout: 15000 });
  await page.evaluate(() => {
    if (typeof initPersonalIntro === "function") initPersonalIntro();
    showScreen("personalIntro");
  });
  await page.waitForSelector("#personalIntro.active", { timeout: 10000 });
}

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0", timeout: 60000 });
  await openPersonalIntro(page);
  await new Promise((r) => setTimeout(r, 350));
  await shot(page, `screen4-personal-empty-${vp.name}.png`);
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openPersonalIntro(page);
  await page.type("#mpUserFirstName", "Anne-Marie");
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "screen4-personal-valid-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openPersonalIntro(page);
  await page.evaluate(() => finishPersonalIntro());
  await page.waitForFunction(() => {
    const err = document.getElementById("mpPersonalNameError");
    return err && !err.hidden && err.textContent.includes("Please enter your first name.");
  });
  await new Promise((r) => setTimeout(r, 350));
  await shot(page, "screen4-personal-error-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openPersonalIntro(page);
  await page.focus("#mpUserFirstName");
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, "screen4-personal-keyboard-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(base, { waitUntil: "networkidle0" });
  await openPersonalIntro(page);
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "125%";
  });
  await new Promise((r) => setTimeout(r, 300));
  await shot(page, "screen4-personal-large-text-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await openPersonalIntro(page);
  await page.focus("#mpPersonalContinue");
  await new Promise((r) => setTimeout(r, 200));
  await shot(page, "screen4-personal-focus-390x844.png");
  await page.close();
}

{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.72");
    localStorage.setItem("mp_onboard_step", "welcome");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#welcome.active");
  await page.click(".welcome-get-started");
  await page.waitForSelector("#introduction.active");
  await page.click("#mpIntroContinue");
  await page.waitForSelector("#helpChoice.active");
  await page.click('[data-help-choice="mileage"]');
  await page.click("#mpHelpContinue");
  await page.waitForSelector("#personalIntro.active");
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, "screen4-flow-from-screen3-390x844.png");
  await page.close();
}

await browser.close();
server.close();
console.log("Screenshots complete -> " + outDir);
