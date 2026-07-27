/**
 * Capture Ask RankAura Phase B screenshots.
 */
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const BASE = process.env.WORKSPACE_URL || "http://127.0.0.1:3000/workspace";
const OUT_DIRS = [
  "/opt/cursor/artifacts/ask-rankaura",
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

async function preparePage(page, viewport) {
  await page.setViewport(viewport);
  await page.goto(BASE, { waitUntil: "networkidle0" });
  await page.evaluate(
    (key, session) => {
      localStorage.setItem(key, JSON.stringify(session));
    },
    SESSION_KEY,
    SESSION,
  );
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]');
}

async function askSuggestion(page, text) {
  // Reset if expanded
  const askAnother = await page.$("button::-p-text(Ask another question)");
  // Use evaluate for reliable reset/submit
  const hasReset = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const reset = buttons.find((b) => b.textContent?.trim() === "Ask another question");
    if (reset) {
      reset.click();
      return true;
    }
    return false;
  });
  if (hasReset) await page.waitForSelector("#ask-rankaura-input");

  await page.evaluate((question) => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const match = buttons.find((b) => b.textContent?.trim() === question);
    if (match) {
      match.click();
      return;
    }
    const input = document.getElementById("ask-rankaura-input");
    const form = input?.closest("form");
    if (input && form) {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, question);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      form.requestSubmit();
    }
  }, text);

  await page.waitForSelector("#ask-rankaura-answer-heading");
}

async function askCustom(page, text) {
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const reset = buttons.find((b) => b.textContent?.trim() === "Ask another question");
    if (reset) reset.click();
  });
  await page.waitForSelector("#ask-rankaura-input");
  await page.click("#ask-rankaura-input", { clickCount: 3 });
  await page.type("#ask-rankaura-input", text);
  await page.keyboard.press("Enter");
  await page.waitForSelector("#ask-rankaura-answer-heading");
}

async function main() {
  await ensureDirs();
  const browser = await puppeteer.launch({
    executablePath: "/usr/local/bin/google-chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();

  // 1. Desktop compact
  await preparePage(page, { width: 1280, height: 900, deviceScaleFactor: 1 });
  await shot(page, "01-workspace-desktop-compact.png", { fullPage: true });

  // 3. Suggested questions close-up
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "03-suggested-questions.png",
  );

  // 4. Biggest opportunity
  await askSuggestion(page, "What is my biggest opportunity today?");
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "04-answer-opportunity.png",
  );

  // 5. Completed work
  await askSuggestion(
    page,
    "What has RankAura completed since my last visit?",
  );
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "05-answer-completed-work.png",
  );

  // 6. No urgent
  await askCustom(page, "Is there anything urgent I need to know?");
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "06-answer-no-urgent.png",
  );

  // 7. Unavailable GSC
  await askCustom(page, "Have my rankings improved?");
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "07-answer-unavailable-gsc.png",
  );

  // 8. Community / Reddit
  await askCustom(page, "What questions are customers asking online?");
  await elementShot(
    page,
    '[data-testid="ask-rankaura-card"]',
    "08-answer-community.png",
  );

  // 9. Mobile expanded (reuse community answer)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForSelector('[data-testid="ask-rankaura-card"]');
  await askSuggestion(page, "What is my biggest opportunity today?");
  await shot(page, "09-mobile-expanded.png", { fullPage: true });

  // 2. Mobile compact
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const reset = buttons.find((b) => b.textContent?.trim() === "Ask another question");
    if (reset) reset.click();
  });
  await page.waitForSelector("#ask-rankaura-input");
  await shot(page, "02-workspace-mobile-compact.png", { fullPage: true });

  await browser.close();
  console.log("Ask RankAura screenshots complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
