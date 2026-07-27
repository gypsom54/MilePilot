/**
 * Capture onboarding website + Ask RankAura (onboarding format) screenshots.
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const OUT_DIRS = [
  "/opt/cursor/artifacts/ask-onboarding-format",
  path.join(__dirname, "..", "docs", "ui-reference", "ask-rankaura"),
];

const SESSION_KEY = "rankaura.onboarding.session.v1";
const SESSION = {
  customerFirstName: "Jonathan",
  website: "https://example.com",
  businessName: "Your business",
  businessDescription: "A local service business helping nearby customers.",
  completed: true,
  updatedAt: new Date().toISOString(),
};

async function ensureDirs() {
  for (const dir of OUT_DIRS) fs.mkdirSync(dir, { recursive: true });
}

async function shotAll(page, filename, opts = {}) {
  for (const dir of OUT_DIRS) {
    const file = path.join(dir, filename);
    await page.screenshot({ path: file, ...opts });
    console.log("wrote", file);
  }
}

async function elShot(page, selector, filename) {
  const el = await page.$(selector);
  if (!el) throw new Error(`Missing ${selector}`);
  for (const dir of OUT_DIRS) {
    const file = path.join(dir, filename);
    await el.screenshot({ path: file });
    console.log("wrote", file);
  }
}

async function main() {
  await ensureDirs();
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  await page.goto(`${BASE}/onboarding`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForSelector("button", { timeout: 60000 });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const start = buttons.find((b) => b.textContent?.trim() === "Get Started");
    start?.click();
  });
  await page.waitForSelector("#customer-name", { timeout: 60000 });
  await page.type("#customer-name", "Jonathan");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const cont = buttons.find((b) => b.textContent?.trim() === "Continue");
    cont?.click();
  });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll("h1")).some((h) =>
        h.textContent?.includes("Nice to meet you"),
      ),
    { timeout: 60000 },
  );
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const cont = buttons.find((b) => b.textContent?.trim() === "Continue");
    cont?.click();
  });
  await page.waitForSelector("#website", { timeout: 60000 });
  await shotAll(page, "01-onboarding-website.png", { fullPage: true });

  // 2–3. Ask RankAura desktop
  await page.goto(`${BASE}/workspace`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.evaluate(
    (key, session) => localStorage.setItem(key, JSON.stringify(session)),
    SESSION_KEY,
    SESSION,
  );
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]', {
    timeout: 60000,
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "02-ask-rankaura-desktop.png",
  );
  await shotAll(page, "03-ask-workspace-desktop.png", { fullPage: true });

  for (const dir of OUT_DIRS) {
    fs.writeFileSync(
      path.join(dir, "00-compare-note.txt"),
      "Compare 01-onboarding-website.png with 02-ask-rankaura-desktop.png\n",
    );
  }

  // 4. Ask RankAura mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]', {
    timeout: 60000,
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "04-ask-rankaura-mobile.png",
  );

  await browser.close();
  console.log("Ask onboarding-format screenshots complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
