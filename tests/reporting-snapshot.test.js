/**
 * Reporting System Lockdown — snapshot + visual regression tests
 *
 * Generates Daily, Weekly, Monthly, Annual reports and compares layout
 * fingerprints against approved baselines. Fails CI on unintended layout change.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPdfBuffer, buildReportEmailHtml } from "../backend/reportEngine.js";
import { PERIOD_FIXTURES } from "../backend/reporting/verification/snapshotFixtures.js";
import {
  fingerprintEmailHtml,
  fingerprintPdfBuffer,
  compareFingerprints,
  extractEmailLayoutMarkers,
  extractPdfLayoutMarkers,
} from "../backend/reporting/verification/layoutFingerprint.js";
import { LOCKED_COMPONENTS } from "../backend/reporting/verification/componentRegistry.js";
import { REPORTING_SYSTEM_VERSION, REPORTING_SYSTEM_STATUS } from "../backend/reporting/VERSION.js";
import { TOTAL_PAGES } from "../backend/reporting/styles/reportTheme.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baselinePath = path.join(__dirname, "reporting-baselines/fingerprints.json");

const emailOptions = {
  pdfDownloadUrl: "https://example.com/reports/download/locked-fixture",
  archiveUrl: "https://app.milepilot.uk/?view=reports",
};

let passed = 0;
let failed = 0;

async function run(name, fn) {
  try {
    await fn();
    console.log("✓ " + name);
    passed++;
  } catch (e) {
    console.error("✗ " + name);
    console.error("  " + e.message);
    failed++;
  }
}

await run("reporting system is locked v1.0", async () => {
  assert.equal(REPORTING_SYSTEM_VERSION, "1.0");
  assert.equal(REPORTING_SYSTEM_STATUS, "LOCKED");
});

await run("all locked components registered", async () => {
  const required = [
    "ReportHeader",
    "KPICard",
    "JourneyTable",
    "JourneyMap",
    "HMRCSummary",
    "AIInsights",
    "VerificationCertificate",
    "EmailTemplate",
  ];
  for (const name of required) {
    assert.ok(LOCKED_COMPONENTS[name], `missing component: ${name}`);
    assert.equal(LOCKED_COMPONENTS[name].locked, true);
  }
});

const periods = ["Daily", "Weekly", "Monthly", "Annual"];

for (const period of periods) {
  await run(`${period} report — PDF generates (${TOTAL_PAGES} pages)`, async () => {
    const pdf = await buildPdfBuffer(PERIOD_FIXTURES[period]);
    assert.ok(Buffer.isBuffer(pdf));
    assert.equal(pdf.slice(0, 4).toString(), "%PDF");
    const markers = extractPdfLayoutMarkers(pdf);
    assert.equal(markers.pageCount, TOTAL_PAGES, `${period} PDF page count`);
    assert.ok(markers.validPdf, `${period} PDF valid header`);
  });

  await run(`${period} report — email generates with locked layout`, async () => {
    const html = buildReportEmailHtml(PERIOD_FIXTURES[period], emailOptions);
    assert.ok(!html.includes("{{"), `${period} email has unfilled placeholders`);
    const layout = extractEmailLayoutMarkers(html);
    assert.ok(layout.darkTheme, `${period} email dark theme`);
    assert.ok(layout.kpiHeight, `${period} email KPI card height`);
    assert.ok(layout.cta, `${period} email CTA`);
  });
}

if (fs.existsSync(baselinePath)) {
  const baselines = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

  for (const period of periods) {
    await run(`${period} — email layout fingerprint matches baseline`, async () => {
      const html = buildReportEmailHtml(PERIOD_FIXTURES[period], emailOptions);
      const actual = fingerprintEmailHtml(html);
      const expected = baselines.periods[period].emailFingerprint;
      const result = compareFingerprints(actual, expected, `${period} email`);
      assert.ok(result.ok, result.message || "email fingerprint mismatch");
    });

    await run(`${period} — PDF layout fingerprint matches baseline`, async () => {
      const pdf = await buildPdfBuffer(PERIOD_FIXTURES[period]);
      const actual = fingerprintPdfBuffer(pdf);
      const expected = baselines.periods[period].pdfFingerprint;
      const result = compareFingerprints(actual, expected, `${period} PDF`);
      assert.ok(result.ok, result.message || "PDF fingerprint mismatch");
    });
  }

  await run("reference email.html artifacts exist", async () => {
    for (const period of periods) {
      const artifact = path.join(__dirname, "reporting-baselines", period.toLowerCase(), "email.html");
      assert.ok(fs.existsSync(artifact), `missing reference email: ${artifact}`);
    }
  });

  await run("reference PDF artifacts exist", async () => {
    for (const period of periods) {
      const artifact = path.join(__dirname, "reporting-baselines", period.toLowerCase(), "report.pdf");
      assert.ok(fs.existsSync(artifact), `missing reference PDF: ${artifact}`);
      const pdf = fs.readFileSync(artifact);
      assert.equal(pdf.slice(0, 4).toString(), "%PDF");
    }
  });
} else {
  console.warn("⚠ No baselines at tests/reporting-baselines/fingerprints.json — run: node scripts/capture-reporting-baselines.js --update");
}

console.log(`\nReporting snapshot tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
