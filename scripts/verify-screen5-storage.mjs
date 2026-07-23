#!/usr/bin/env node
/**
 * MP-UX-LOCK-005 — runtime storage checks for Screen 5.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

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

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle0" });

async function openYourWork() {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.69");
    localStorage.setItem("mp_onboard_step", "yourWork");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof initWorkCategory === "function");
  await page.evaluate(() => {
    initWorkCategory();
    showScreen("yourWork");
  });
  await page.waitForSelector("#yourWork.active");
}

async function readState() {
  return page.evaluate(() => ({
    stored: localStorage.getItem("mp_business_category"),
    step: localStorage.getItem("mp_onboard_step"),
    complete: localStorage.getItem("mp_onboard_complete"),
    firstName: localStorage.getItem("mp_user_first_name"),
    help: localStorage.getItem("mp_help_choice"),
    screen: document.querySelector(".screen.active")?.id || "",
    continueDisabled: document.getElementById("mpWorkContinue")?.disabled,
  }));
}

const cases = ["driver", "trades", "freelance", "services", "other"];
let failed = 0;

for (const key of cases) {
  await openYourWork();
  await page.click(`[data-work-category="${key}"]`);
  await page.click("#mpWorkContinue");
  await new Promise((r) => setTimeout(r, 50));
  const state = await readState();
  const pass = state.stored === key && state.screen === "onboardAwaiting" && state.step === "awaiting" && state.complete == null;
  if (pass) console.log("✓ stores " + key);
  else {
    failed++;
    console.error("✗ stores " + key, state);
  }
}

await openYourWork();
const before = await readState();
const passDisabled = before.continueDisabled === true && before.stored == null;
if (passDisabled) console.log("✓ continue disabled before selection");
else {
  failed++;
  console.error("✗ continue disabled before selection", before);
}

await openYourWork();
await page.click('[data-work-category="driver"]');
await page.click('[data-work-category="trades"]');
await page.click("#mpWorkContinue");
await new Promise((r) => setTimeout(r, 50));
const replaced = await readState();
if (replaced.stored === "trades") console.log("✓ latest selection replaces previous");
else {
  failed++;
  console.error("✗ latest selection replaces previous", replaced);
}

await openYourWork();
await page.evaluate(() => localStorage.setItem("mp_business_category", "freelance"));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  localStorage.setItem("mp_onboard_step", "yourWork");
  initWorkCategory();
  showScreen("yourWork");
});
await page.waitForSelector("#yourWork.active");
const restored = await page.evaluate(() => ({
  selected: document.querySelector('[data-work-category="freelance"]')?.classList.contains("selected"),
  disabled: document.getElementById("mpWorkContinue")?.disabled,
}));
if (restored.selected && !restored.disabled) console.log("✓ restores valid saved selection");
else {
  failed++;
  console.error("✗ restores valid saved selection", restored);
}

await openYourWork();
await page.evaluate(() => localStorage.setItem("mp_business_category", "invalid-category"));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  localStorage.setItem("mp_onboard_step", "yourWork");
  initWorkCategory();
  showScreen("yourWork");
});
await page.waitForSelector("#yourWork.active");
const invalid = await readState();
if (invalid.stored == null && invalid.continueDisabled === true) console.log("✓ invalid stored value cleared safely");
else {
  failed++;
  console.error("✗ invalid stored value cleared safely", invalid);
}

await browser.close();
server.close();
console.log("\nScreen 5 storage checks: " + (7 - failed) + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
