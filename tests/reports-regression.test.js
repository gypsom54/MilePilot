/**
 * VITAL — Report pipeline regression tests
 */
import assert from "node:assert/strict";
import { analyseReport, buildPdfBuffer, buildReportEmailHtml, buildReportSubject } from "../backend/reportEngine.js";

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

const sampleShift = {
  id: "shift_test_1",
  startISO: "2026-06-30T08:00:00.000Z",
  endISO: "2026-06-30T10:00:00.000Z",
  miles: 24.5,
  seconds: 7200,
  hmrc: 13.48,
  vehicle: "car",
  route: [
    { lat: 51.5074, lon: -0.1278 },
    { lat: 51.515, lon: -0.12 },
    { lat: 51.52, lon: -0.1 },
  ],
};

const sampleReport = {
  driver: "Jonathan",
  email: "test@example.com",
  period: "Daily",
  periodLabel: "30 June 2026",
  shifts: [sampleShift],
  hmrcRate: 0.55,
};

await run("analyseReport totals completed trip", async () => {
  const a = analyseReport(sampleReport);
  assert.equal(a.totals.journeys, 1);
  assert.ok(a.totals.mi > 20);
  assert.ok(a.totals.hmrc > 0);
});

await run("buildPdfBuffer generates PDF from completed trip", async () => {
  const pdf = await buildPdfBuffer(sampleReport);
  assert.ok(Buffer.isBuffer(pdf));
  assert.ok(pdf.length > 1000);
  assert.equal(pdf.slice(0, 4).toString(), "%PDF");
});

await run("buildReportEmailHtml includes metrics from trip", async () => {
  const html = buildReportEmailHtml(sampleReport, {
    pdfDownloadUrl: "https://example.com/dl",
    archiveUrl: "https://app.milepilot.uk",
  });
  assert.ok(html.includes("24.5") || html.includes("24.50"));
  assert.ok(html.includes("Download PDF") || html.includes("Download PDF Report"));
  assert.ok(html.includes("color-scheme"));
  assert.ok(html.includes("bgcolor=\"#031126\""));
  assert.ok(!html.includes("#E8EEF7"), "light blue shell must not appear");
  assert.ok(html.includes("data:image/png;base64,"), "route map must be PNG img for Gmail");
});

await run("buildReportSubject formats daily report", async () => {
  const subject = buildReportSubject(sampleReport);
  assert.ok(subject.includes("MilePilot"));
});

console.log(`\nReports regression: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
