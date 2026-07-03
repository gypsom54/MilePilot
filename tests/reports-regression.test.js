/**
 * VITAL — Report pipeline regression tests
 */
import assert from "node:assert/strict";
import { analyseReport, buildPdfBuffer, buildReportEmailHtml, buildReportSubject, buildDemoTestReport } from "../backend/reportEngine.js";

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

await run("buildPdfBuffer daily report has 7 pages (Phase 5 premium template)", async () => {
  const pdf = await buildPdfBuffer(sampleReport);
  const text = pdf.toString("latin1");
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  assert.equal(pageCount, 7, `expected 7 pages, got ${pageCount}`);
  assert.ok(pdf.length > 3000, "PDF should have substantive content");
});

await run("buildReportEmailHtml includes metrics from trip", async () => {
  const html = buildReportEmailHtml(sampleReport, {
    pdfDownloadUrl: "https://example.com/dl",
    archiveUrl: "https://app.milepilot.uk",
  });
  assert.ok(html.includes("24.5") || html.includes("24.50"));
  assert.ok(html.includes("Download Report") || html.includes("Download PDF"));
  assert.ok(html.includes("background-color:#020B1B") || html.includes('bgcolor="#031126"'), "email must use dark premium theme");
  assert.ok(html.includes("#EAF2FF") || html.includes("HMRC Estimate"), "email KPI tiles required");
});

await run("buildReportSubject formats daily report", async () => {
  const subject = buildReportSubject(sampleReport);
  assert.ok(subject.includes("MilePilot"));
});

await run("buildDemoTestReport produces sendable daily report", async () => {
  const report = buildDemoTestReport("test@example.com", "Jonathan");
  assert.equal(report.isTest, true);
  assert.equal(report.period, "Daily");
  const a = analyseReport(report);
  assert.equal(a.totals.journeys, 1);
  const subject = buildReportSubject(report);
  assert.ok(subject.includes("test report"));
  const pdf = await buildPdfBuffer(report);
  assert.equal(pdf.slice(0, 4).toString(), "%PDF");
});

console.log(`\nReports regression: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
