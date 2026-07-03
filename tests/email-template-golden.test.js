/**
 * Golden checks — Phase 5 premium dark email (backend/templates/email.html)
 */
import assert from "node:assert/strict";
import { buildReportEmailHtml } from "../backend/reportEngine.js";
import { loadEmailTemplate } from "../backend/emailTemplate.js";

const sample = {
  driver: "Jonathan",
  email: "test@example.com",
  period: "Daily",
  periodLabel: "3 Jul 2026",
  hmrcRate: 0.55,
  shifts: [
    {
      id: "shift_test_1",
      startISO: "2026-07-03T08:00:00.000Z",
      endISO: "2026-07-03T10:00:00.000Z",
      miles: 42.6,
      seconds: 9000,
      hmrc: 23.43,
      vehicle: "car",
      route: [{ lat: 51.5, lon: -0.12 }, { lat: 51.52, lon: -0.1 }],
    },
  ],
};

const html = buildReportEmailHtml(sample, {
  pdfDownloadUrl: "https://example.com/dl",
  archiveUrl: "https://app.milepilot.uk/?view=reports",
});

const master = loadEmailTemplate();

assert.ok(master.includes("{{MILES}}"), "master template must use placeholders");
assert.ok(!html.includes("{{"), "output must have all placeholders filled");
assert.ok(html.includes("background-color:#020B1B") || html.includes('bgcolor="#020B1B"'), "outer shell must be dark navy");
assert.ok(html.includes("Download Report"), "Download Report CTA required");
assert.ok(html.includes("premium 7-page PDF") || html.includes("attached"), "attachment note required");
assert.ok(html.includes("42.6"), "live miles injected");
assert.ok(html.includes("Good "), "greeting injected");
assert.ok(html.includes("Reporting period"), "reporting period line required");
assert.ok(html.includes("Drive • Track • Claim"), "locked footer tagline");

console.log("✓ Phase 5 premium email template golden checks passed\n");
