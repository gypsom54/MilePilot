#!/usr/bin/env node
/**
 * MP-UX-LOCK-005A — runtime storage checks for Screen 5A.
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

async function gotoBase() {
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: "networkidle0" });
}

async function openTravelMethod(helpChoice = "mileage", firstName = "Jonathan") {
  await gotoBase();
  await page.evaluate((choice, name) => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.69");
    localStorage.setItem("mp_help_choice", choice);
    localStorage.setItem("mp_user_first_name", name);
    localStorage.setItem("mp_onboard_step", "travelMethod");
  }, helpChoice, firstName);
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof initTravelMethod === "function");
  await page.evaluate(() => {
    initTravelMethod();
    showScreen("travelMethod");
  });
  await page.waitForSelector("#travelMethod.active");
}

async function readState() {
  return page.evaluate(() => ({
    stored: localStorage.getItem("mp_travel_method"),
    step: localStorage.getItem("mp_onboard_step"),
    complete: localStorage.getItem("mp_onboard_complete"),
    firstName: localStorage.getItem("mp_user_first_name"),
    help: localStorage.getItem("mp_help_choice"),
    screen: document.querySelector(".screen.active")?.id || "",
    continueDisabled: document.getElementById("mpTravelContinue")?.disabled,
    heading: document.getElementById("mpTravelHeading")?.textContent || "",
  }));
}

let failed = 0;
const cases = ["car_van", "motorcycle", "bicycle", "public_transport", "none"];

for (const key of cases) {
  await openTravelMethod();
  await page.click(`[data-travel-method="${key}"]`);
  await page.click("#mpTravelContinue");
  await new Promise((r) => setTimeout(r, 50));
  const state = await readState();
  const pass = state.stored === key && state.screen === "onboardAwaiting" && state.step === "awaiting" && state.help === "mileage";
  if (pass) console.log("✓ stores " + key);
  else {
    failed++;
    console.error("✗ stores " + key, state);
  }
}

await openTravelMethod();
const before = await readState();
if (before.continueDisabled === true && before.stored == null) console.log("✓ continue disabled before selection");
else {
  failed++;
  console.error("✗ continue disabled before selection", before);
}

await openTravelMethod();
await page.click('[data-travel-method="car_van"]');
await page.click('[data-travel-method="public_transport"]');
await page.click("#mpTravelContinue");
await new Promise((r) => setTimeout(r, 50));
const replaced = await readState();
if (replaced.stored === "public_transport") console.log("✓ latest selection replaces previous");
else {
  failed++;
  console.error("✗ latest selection replaces previous", replaced);
}

await openTravelMethod("mileage", "Jonathan");
const named = await readState();
if (named.heading === "Jonathan, what do you usually use for your work journeys?") console.log("✓ personalised heading with saved name");
else {
  failed++;
  console.error("✗ personalised heading with saved name", named);
}

await openTravelMethod("mileage", "");
await page.evaluate(() => localStorage.removeItem("mp_user_first_name"));
await page.evaluate(() => initTravelMethod());
const fallback = await readState();
if (fallback.heading === "What do you usually use for your work journeys?") console.log("✓ fallback heading without name");
else {
  failed++;
  console.error("✗ fallback heading without name", fallback);
}

await openTravelMethod();
await page.evaluate(() => localStorage.setItem("mp_travel_method", "freelance"));
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  localStorage.setItem("mp_onboard_step", "travelMethod");
  initTravelMethod();
  showScreen("travelMethod");
});
await page.waitForSelector("#travelMethod.active");
const invalid = await readState();
if (invalid.stored == null && invalid.continueDisabled === true) console.log("✓ invalid stored value cleared safely");
else {
  failed++;
  console.error("✗ invalid stored value cleared safely", invalid);
}

await gotoBase();
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem("mp_app_version", "8.43.69");
  localStorage.setItem("mp_user_first_name", "Alex");
  localStorage.setItem("mp_onboard_step", "personalIntro");
});
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  initPersonalIntro();
  showScreen("personalIntro");
});
await page.waitForSelector("#personalIntro.active");
await page.evaluate(() => finishPersonalIntro());
await page.waitForSelector("#helpChoice.active");
const backToHelp = await readState();
if (backToHelp.screen === "helpChoice") console.log("✓ missing help choice returns to Screen 3");
else {
  failed++;
  console.error("✗ missing help choice returns to Screen 3", backToHelp);
}

await gotoBase();
await page.evaluate(() => {
  localStorage.clear();
  localStorage.setItem("mp_app_version", "8.43.69");
  localStorage.setItem("mp_help_choice", "business");
  localStorage.setItem("mp_user_first_name", "Alex");
  localStorage.setItem("mp_onboard_step", "personalIntro");
});
await page.reload({ waitUntil: "networkidle0" });
await page.evaluate(() => {
  initPersonalIntro();
  showScreen("personalIntro");
});
await page.waitForSelector("#personalIntro.active");
await page.evaluate(() => finishPersonalIntro());
await page.waitForSelector("#onboardBusinessAwaiting.active");
const business = await readState();
if (business.screen === "onboardBusinessAwaiting") console.log("✓ business choice skips Screen 5A");
else {
  failed++;
  console.error("✗ business choice skips Screen 5A", business);
}

await page.setViewport({ width: 320, height: 568 });
await openTravelMethod();
const overlap = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll("[data-travel-method]"));
  const rects = cards.map((c) => c.getBoundingClientRect());
  for (let i = 0; i < rects.length; i++) {
    for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i];
      const b = rects[j];
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapY > 1) return { overlap: true, i, j, overlapY };
    }
  }
  return { overlap: false };
});
if (!overlap.overlap) console.log("✓ no card overlap at 320x568");
else {
  failed++;
  console.error("✗ no card overlap at 320x568", overlap);
}

await browser.close();
server.close();
const total = 10;
console.log("\nScreen 5A storage checks: " + (total - failed) + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
