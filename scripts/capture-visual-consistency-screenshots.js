/**
 * Capture visual consistency screenshots for RankAura design-system pass.
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.WORKSPACE_URL || "http://127.0.0.1:3000";
const OUT_DIRS = [
  "/opt/cursor/artifacts/visual-consistency",
  path.join(__dirname, "..", "docs", "ui-reference", "visual-consistency"),
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

async function prepareWorkspace(page, viewport) {
  await page.setViewport(viewport);
  await page.goto(`${BASE}/workspace`, { waitUntil: "networkidle0" });
  await page.evaluate(
    (key, session) => localStorage.setItem(key, JSON.stringify(session)),
    SESSION_KEY,
    SESSION,
  );
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]');
}

async function main() {
  await ensureDirs();
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // 1. Desktop empty / disabled Ask
  await prepareWorkspace(page, { width: 1280, height: 900, deviceScaleFactor: 1 });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "01-ask-desktop-empty-disabled.png",
  );

  // 2. Desktop enabled with typed question
  await page.click("#ask-rankaura-input", { clickCount: 3 });
  await page.type("#ask-rankaura-input", "What is my biggest opportunity today?");
  await page.waitForFunction(() => {
    const btn = document.querySelector(
      '[data-testid="ask-rankaura-card"] button[type="submit"]',
    );
    return btn && !btn.disabled;
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "02-ask-desktop-enabled.png",
  );

  // 4. Suggested questions desktop
  await page.evaluate(() => {
    const input = document.getElementById("ask-rankaura-input");
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "04-suggested-questions-desktop.png",
  );

  // 9. Growth areas
  await elShot(
    page,
    "section[aria-labelledby='workspace-growth-areas-heading']",
    "09-growth-area-cards.png",
  );

  // 10. Full desktop
  await shotAll(page, "10-workspace-desktop.png", { fullPage: true });

  // 3 + 5 + 11 mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]');
  await page.click("#ask-rankaura-input", { clickCount: 3 });
  await page.type("#ask-rankaura-input", "What is my biggest opportunity today?");
  await page.waitForFunction(() => {
    const btn = document.querySelector(
      '[data-testid="ask-rankaura-card"] button[type="submit"]',
    );
    return btn && !btn.disabled;
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "03-ask-mobile-enabled.png",
  );

  await page.evaluate(() => {
    const input = document.getElementById("ask-rankaura-input");
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  await elShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "05-suggested-questions-mobile.png",
  );
  await shotAll(page, "11-workspace-mobile.png", { fullPage: true });

  // Design system showcase
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/design-system`, { waitUntil: "networkidle0" });
  await elShot(page, '[data-testid="ds-badges"]', "06-badge-variants.png");
  await elShot(page, '[data-testid="ds-actions"]', "07-action-variants.png");
  await elShot(page, '[data-testid="ds-inputs"]', "08-input-states.png");

  await browser.close();
  console.log("Visual consistency screenshots complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
