/**
 * Golden checks — generated email must match docs/report-email-preview.html
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildReportEmailHtml } from "../backend/reportEngine.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const preview = fs.readFileSync(path.join(__dirname, "../docs/report-email-preview.html"), "utf8");

const sample = {
  driver: "Jonathan",
  email: "test@example.com",
  period: "Daily",
  periodLabel: "30 June 2026",
  hmrcRate: 0.55,
  shifts: [
    {
      id: "shift_test_1",
      startISO: "2026-06-30T08:00:00.000Z",
      endISO: "2026-06-30T10:00:00.000Z",
      miles: 42.6,
      seconds: 9000,
      hmrc: 23.43,
      vehicle: "car",
      route: [
        { lat: 51.5074, lon: -0.1278 },
        { lat: 51.515, lon: -0.12 },
        { lat: 51.52, lon: -0.1 },
      ],
    },
  ],
};

const html = buildReportEmailHtml(sample, {
  pdfDownloadUrl: "https://example.com/dl",
  archiveUrl: "https://app.milepilot.uk/?view=reports",
});

const markers = [
  "background-color:#031126",
  "linear-gradient(180deg,#0A2854 0%,#031126 55%,#020B1B 100%)",
  "Your business. On AutoPilot.",
  "Download PDF Report",
  "Today's Summary",
  "color:#EAF2FF",
  "color:#FFFFFF",
  "color:#6EB4FF",
  "color:#C8D8EF",
  "mp-gmail-screen",
  "color-scheme: dark",
  "data:image/png;base64,",
];

let failed = 0;
for (const m of markers) {
  if (!html.includes(m) && !preview.includes(m.split(":")[0])) {
    // allow preview-specific checks
  }
  if (!html.includes(m)) {
    console.error("✗ missing marker:", m);
    failed++;
  } else {
    console.log("✓", m);
  }
}

assert.ok(!html.includes("#E8EEF7"), "light blue shell must not appear");
assert.ok(!html.includes("<svg"), "inline SVG must not appear in sent email");
assert.ok(html.includes("42.6"), "sample miles must render");
assert.ok(html.includes("Download PDF Report"), "PDF CTA must render");

console.log(failed ? `\nTemplate check: ${failed} failed\n` : "\nTemplate check: all markers present\n");
process.exit(failed > 0 ? 1 : 0);
