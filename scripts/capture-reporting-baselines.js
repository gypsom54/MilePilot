#!/usr/bin/env node
/**
 * Capture approved reporting layout baselines (fingerprints + reference artifacts).
 * Usage:
 *   node scripts/capture-reporting-baselines.js          # verify only
 *   node scripts/capture-reporting-baselines.js --update   # write baselines
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPdfBuffer, buildReportEmailHtml } from "../backend/reportEngine.js";
import { PERIOD_FIXTURES } from "../backend/reporting/verification/snapshotFixtures.js";
import {
  fingerprintEmailHtml,
  fingerprintPdfBuffer,
  extractEmailLayoutMarkers,
  extractPdfLayoutMarkers,
} from "../backend/reporting/verification/layoutFingerprint.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const baselineDir = path.join(root, "tests/reporting-baselines");
const update = process.argv.includes("--update");

const periods = ["Daily", "Weekly", "Monthly", "Annual"];
const emailOptions = {
  pdfDownloadUrl: "https://example.com/reports/download/locked-fixture",
  archiveUrl: "https://app.milepilot.uk/?view=reports",
};

async function capture() {
  const baselines = {
    version: "1.0",
    status: "LOCKED",
    capturedAt: new Date().toISOString(),
    periods: {},
  };

  for (const period of periods) {
    const report = PERIOD_FIXTURES[period];
    const pdf = await buildPdfBuffer(report);
    const html = buildReportEmailHtml(report, emailOptions);

    baselines.periods[period] = {
      emailFingerprint: fingerprintEmailHtml(html),
      pdfFingerprint: fingerprintPdfBuffer(pdf),
      emailMarkers: extractEmailLayoutMarkers(html),
      pdfMarkers: extractPdfLayoutMarkers(pdf),
      pdfBytes: pdf.length,
    };

    if (update) {
      const periodDir = path.join(baselineDir, period.toLowerCase());
      fs.mkdirSync(periodDir, { recursive: true });
      fs.writeFileSync(path.join(periodDir, "email.html"), html);
      fs.writeFileSync(path.join(periodDir, "report.pdf"), pdf);
    }
  }

  if (update) {
    fs.mkdirSync(baselineDir, { recursive: true });
    fs.writeFileSync(path.join(baselineDir, "fingerprints.json"), JSON.stringify(baselines, null, 2));
    console.log("✓ Baseline baselines updated at tests/reporting-baselines/");
  } else {
    console.log(JSON.stringify(baselines, null, 2));
  }
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
