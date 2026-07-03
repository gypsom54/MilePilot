/**
 * Golden Report — permanent reference standard
 *
 * Jonathan O'Neill · 487.4 mi · 38 trips · 31h 48m · £219.33
 *
 * Every reporting engine change must regenerate this report and compare
 * against the approved golden artifacts. Unexpected differences in fonts,
 * spacing, page breaks, colours, or alignment fail the build.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyseReport, buildPdfBuffer, buildReportEmailHtml } from "../backend/reportEngine.js";
import { buildGoldenReport, GOLDEN_KPI, verifyGoldenTotals } from "../backend/reporting/verification/goldenReport.js";
import {
  fingerprintGoldenEmail,
  fingerprintGoldenPdf,
  extractGoldenPdfStructure,
  assertGoldenKpiInEmail,
  loadGoldenManifest,
  compareGoldenArtifacts,
  compareToReferencePdf,
} from "../backend/reporting/verification/goldenCompare.js";
import { TOTAL_PAGES } from "../backend/reporting/styles/reportTheme.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const goldenDir = path.join(__dirname, "reporting-baselines/golden");
const manifestPath = path.join(goldenDir, "manifest.json");

const emailOptions = {
  pdfDownloadUrl: "https://example.com/reports/download/golden-reference",
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

const goldenReport = buildGoldenReport();

await run("golden fixture totals are exact", async () => {
  const a = analyseReport(goldenReport);
  const errors = verifyGoldenTotals(a);
  assert.equal(errors.length, 0, errors.join("; "));
  assert.equal(a.driver, GOLDEN_KPI.driver);
});

await run("golden email contains approved KPI values", async () => {
  const html = buildReportEmailHtml(goldenReport, emailOptions);
  assertGoldenKpiInEmail(html);
  assert.ok(html.includes(GOLDEN_KPI.miles), "487.4 miles");
  assert.ok(html.includes(GOLDEN_KPI.tripsDisplay), "38 trips");
  assert.ok(html.includes(GOLDEN_KPI.drivingTime), "31h 48m");
  assert.ok(html.includes(GOLDEN_KPI.hmrc), "£219.33");
  assert.ok(!html.includes("{{"), "no unfilled placeholders");
});

await run("golden PDF generates 7 pages", async () => {
  const pdf = await buildPdfBuffer(goldenReport);
  assert.ok(Buffer.isBuffer(pdf));
  assert.equal(pdf.slice(0, 4).toString(), "%PDF");
  const text = pdf.toString("latin1");
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  assert.equal(pageCount, TOTAL_PAGES);
});

if (fs.existsSync(manifestPath)) {
  const manifest = loadGoldenManifest(manifestPath);

  await run("golden email matches approved layout fingerprint", async () => {
    const html = buildReportEmailHtml(goldenReport, emailOptions);
    const actual = fingerprintGoldenEmail(html);
    assert.equal(
      actual,
      manifest.emailFingerprint,
      "Golden email layout changed — investigate fonts, spacing, colours, or alignment before releasing"
    );
  });

  await run("golden PDF structure matches approved baseline", async () => {
    const pdf = await buildPdfBuffer(goldenReport);
    const actual = {
      emailFingerprint: fingerprintGoldenEmail(buildReportEmailHtml(goldenReport, emailOptions)),
      pdfStructure: extractGoldenPdfStructure(pdf),
    };
    const errors = compareGoldenArtifacts(actual, manifest);
    assert.equal(errors.length, 0, errors.join("\n"));
  });

  await run("golden PDF matches stored reference file", async () => {
    const refPdf = fs.readFileSync(path.join(goldenDir, "report.pdf"));
    const genPdf = await buildPdfBuffer(goldenReport);
    const errors = compareToReferencePdf(genPdf, refPdf);
    assert.equal(errors.length, 0, errors.join("\n"));
  });

  await run("golden email matches stored reference file", async () => {
    const refHtml = fs.readFileSync(path.join(goldenDir, "email.html"), "utf8");
    const genHtml = buildReportEmailHtml(goldenReport, emailOptions);
    assert.equal(fingerprintGoldenEmail(genHtml), fingerprintGoldenEmail(refHtml));
  });

  await run("golden reference artifacts exist on disk", async () => {
    assert.ok(fs.existsSync(path.join(goldenDir, "email.html")), "golden email.html");
    assert.ok(fs.existsSync(path.join(goldenDir, "report.pdf")), "golden report.pdf");
    const refPdf = fs.readFileSync(path.join(goldenDir, "report.pdf"));
    assert.equal(refPdf.slice(0, 4).toString(), "%PDF");
  });
} else {
  console.warn("⚠ No golden manifest — run: node scripts/capture-reporting-baselines.js --golden");
}

console.log(`\nGolden Report tests: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
