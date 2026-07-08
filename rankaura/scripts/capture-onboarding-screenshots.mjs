/**
 * Capture onboarding screenshots for Phase 1 documentation.
 * Run: node scripts/capture-onboarding-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const BASE = "http://localhost:3000";
const OUT = "/opt/cursor/artifacts/screenshots";

async function shot(page, name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(`Saved ${name}.png`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(`${BASE}/onboarding`);
  await shot(page, "01-welcome");

  await page.getByRole("button", { name: "Get Started" }).click();
  await shot(page, "02-website");

  await page.getByPlaceholder("www.portsmouthhypnotherapy.co.uk").fill("www.portsmouthhypnotherapy.co.uk");
  await shot(page, "02-website-filled");
  await page.getByRole("button", { name: "Continue" }).click();

  await shot(page, "03-business-name");
  await page.getByPlaceholder("Portsmouth Hypnotherapy").fill("Portsmouth Hypnotherapy");
  await shot(page, "03-business-name-filled");
  await page.getByRole("button", { name: "Continue" }).click();

  await shot(page, "04-business-description");
  await page
    .getByPlaceholder(/We help people overcome anxiety/)
    .fill("We help people overcome anxiety, confidence and smoking through professional hypnotherapy.");
  await shot(page, "04-business-description-filled");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForSelector("text=Aura goes to work");
  await shot(page, "05-analysis-start");

  await page.waitForTimeout(1200);
  await shot(page, "05-analysis-progress");

  await page.waitForTimeout(3500);
  await shot(page, "05-analysis-complete");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
