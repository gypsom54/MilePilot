/**
 * Golden checks — email must use locked light template (templates/email.html)
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildReportEmailHtml } from "../backend/reportEngine.js";
import { loadEmailTemplate } from "../backend/emailTemplate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

// Structural: output must follow master template shell
assert.ok(master.includes("{{MILES}}"), "master template must use placeholders");
assert.ok(!html.includes("{{"), "output must have all placeholders filled");
assert.ok(html.includes("bgcolor=\"#FFFFFF\""), "email body must be white");
assert.ok(html.includes("background-color:#F4F7FB"), "outer shell must be light grey");
assert.ok(html.includes("Download PDF Report"), "PDF CTA required");
assert.ok(html.includes("attached to this email"), "attachment note required");
assert.ok(html.includes("42.6"), "live miles injected");
assert.ok(html.includes("Good "), "greeting injected");

// Must NOT be dark-theme email
assert.ok(!html.includes("#020B1B"), "dark app background must not appear in email");
assert.ok(!html.includes("mp-gmail-screen"), "dark Gmail hacks must not appear");
assert.ok(!html.includes("<svg"), "no inline SVG in light email");
assert.ok(!html.includes("data:image/png;base64"), "route map belongs in PDF only");

// Navy band is allowed (brand header only)
assert.ok(html.includes("bgcolor=\"#031126\""), "navy brand band at top");

console.log("✓ Light email template golden checks passed\n");
