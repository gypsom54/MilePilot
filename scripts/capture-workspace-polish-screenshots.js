/**
 * Capture RankAura Workspace final-polish screenshots.
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.WORKSPACE_URL || "http://127.0.0.1:3000/workspace";
const OUT_DIRS = [
  "/opt/cursor/artifacts/workspace",
  path.join(__dirname, "..", "docs", "ui-reference", "workspace"),
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
  for (const dir of OUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function shot(page, filename, opts = {}) {
  for (const dir of OUT_DIRS) {
    const file = path.join(dir, filename);
    await page.screenshot({ path: file, ...opts });
    console.log("wrote", file);
  }
}

async function elementShot(page, selector, filename) {
  const el = await page.$(selector);
  if (!el) throw new Error(`Missing selector: ${selector}`);
  for (const dir of OUT_DIRS) {
    const file = path.join(dir, filename);
    await el.screenshot({ path: file });
    console.log("wrote", file);
  }
}

async function main() {
  await ensureDirs();
  // Remove obsolete business-feed filename if present
  for (const dir of OUT_DIRS) {
    const obsolete = path.join(dir, "04-business-feed-viewport.png");
    if (fs.existsSync(obsolete)) fs.unlinkSync(obsolete);
  }

  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();

  // Desktop full page
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(
    (key, session) => {
      localStorage.setItem(key, JSON.stringify(session));
    },
    SESSION_KEY,
    SESSION,
  );
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#biggest-opportunity-heading");
  await shot(page, "01-workspace-desktop.png", { fullPage: true });

  await elementShot(
    page,
    "section[aria-labelledby='biggest-opportunity-heading']",
    "03-biggest-opportunity-viewport.png",
  );
  await elementShot(
    page,
    "section[aria-labelledby='recent-wins-heading']",
    "04-recent-wins-viewport.png",
  );
  await elementShot(
    page,
    "section[aria-labelledby='since-last-visit-heading']",
    "05-since-last-visit-viewport.png",
  );
  await elementShot(
    page,
    "section[aria-labelledby='workspace-growth-areas-heading']",
    "06-growth-areas-viewport.png",
  );
  await elementShot(
    page,
    "section[aria-labelledby='recent-progress-heading']",
    "07-recent-progress-viewport.png",
  );

  // Mobile full page
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector("#biggest-opportunity-heading");
  await shot(page, "02-workspace-mobile.png", { fullPage: true });

  await browser.close();
  console.log("Workspace screenshots complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
