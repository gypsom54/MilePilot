#!/usr/bin/env node
/**
 * MP-UX-LOCK-004A — runtime storage and validation checks for Screen 4.
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
    res.end();
    return;
  }
  const ext = path.extname(filePath);
  const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
  res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const base = `http://127.0.0.1:${port}/index.html`;

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto(base, { waitUntil: "networkidle0" });

async function openPersonalIntro() {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("mp_app_version", "8.43.69");
    localStorage.setItem("mp_onboard_step", "personalIntro");
  });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForFunction(() => typeof showScreen === "function");
  await page.evaluate(() => {
    initPersonalIntro();
    showScreen("personalIntro");
  });
  await page.waitForSelector("#personalIntro.active");
}

async function readState() {
  return page.evaluate(() => ({
    stored: localStorage.getItem("mp_user_first_name"),
    step: localStorage.getItem("mp_onboard_step"),
    complete: localStorage.getItem("mp_onboard_complete"),
    help: localStorage.getItem("mp_help_choice"),
    location: localStorage.getItem("mp_location_choice"),
    tracking: localStorage.getItem("mp_tracking_mode"),
    driver: localStorage.getItem("mp_driver"),
    errorHidden: document.getElementById("mpPersonalNameError")?.hidden !== false,
    errorText: document.getElementById("mpPersonalNameError")?.textContent || "",
    ariaInvalid: document.getElementById("mpUserFirstName")?.getAttribute("aria-invalid"),
    activeId: document.activeElement?.id || "",
    screen: document.querySelector(".screen.active")?.id || "",
  }));
}

async function submitName(value) {
  await page.evaluate((v) => {
    const input = document.getElementById("mpUserFirstName");
    if (input) input.value = v;
    finishPersonalIntro();
  }, value);
  await new Promise((r) => setTimeout(r, 50));
}

const cases = [
  { label: "Jonathan", input: "Jonathan", expectStored: "Jonathan", expectAdvance: true },
  { label: "Anne-Marie", input: "Anne-Marie", expectStored: "Anne-Marie", expectAdvance: true },
  { label: "O’Neil", input: "O\u2019Neil", expectStored: "O\u2019Neil", expectAdvance: true },
  { label: "José", input: "Jos\u00e9", expectStored: "Jos\u00e9", expectAdvance: true },
  { label: "Mary Jane", input: "Mary Jane", expectStored: "Mary Jane", expectAdvance: true },
  { label: "empty input", input: "", expectStored: null, expectAdvance: false, expectError: true },
  { label: "whitespace-only input", input: "   ", expectStored: null, expectAdvance: false, expectError: true },
];

const results = [];

for (const c of cases) {
  await openPersonalIntro();
  await submitName(c.input);
  const state = await readState();
  const pass =
    (c.expectAdvance ? state.screen === "onboardAwaiting" && state.step === "awaiting" : state.screen === "personalIntro") &&
    state.stored === c.expectStored &&
    state.complete == null &&
    state.location == null &&
    state.tracking == null &&
    state.driver == null &&
    (c.expectError ? !state.errorHidden && state.errorText === "Please enter your first name." && state.ariaInvalid === "true" && state.activeId === "mpUserFirstName" : state.errorHidden);
  results.push({ ...c, pass, state });
}

await openPersonalIntro();
await page.evaluate(() => {
  localStorage.setItem("mp_user_first_name", "Jonathan");
});
await page.reload({ waitUntil: "networkidle0" });
await page.waitForFunction(() => typeof initPersonalIntro === "function");
await page.evaluate(() => {
  localStorage.setItem("mp_onboard_step", "personalIntro");
  initPersonalIntro();
  showScreen("personalIntro");
});
await page.waitForSelector("#personalIntro.active");
const restored = await page.evaluate(() => document.getElementById("mpUserFirstName")?.value || "");
results.push({ label: "restore saved value", input: "Jonathan", pass: restored === "Jonathan", restored });

await browser.close();
server.close();

let failed = 0;
for (const r of results) {
  if (r.pass) console.log("✓ " + r.label);
  else {
    failed++;
    console.error("✗ " + r.label, JSON.stringify(r.state || r.restored));
  }
}
console.log("\nScreen 4 storage checks: " + (results.length - failed) + " passed, " + failed + " failed\n");
if (failed) process.exit(1);
