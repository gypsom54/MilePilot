/**
 * Layout fingerprint utilities — detect unintended visual/layout regressions.
 * Compares structural markers (not pixel screenshots) for CI reliability.
 */
import crypto from "node:crypto";
import { PDF_LAYOUT, EMAIL_LAYOUT, TOTAL_PAGES } from "../styles/reportTheme.js";

const EMAIL_MARKERS = [
  "background-color:#020B1B",
  `height:${EMAIL_LAYOUT.kpiCardHeight}px`,
  `max-width:${EMAIL_LAYOUT.containerWidth}px`,
  "Download Full PDF Report",
  "Drive • Track • Claim",
  "Mile ",
  "Pilot",
  "border-radius:16px",
  "border-radius:14px",
];

/** Normalize volatile PDF bytes (dates, IDs) for stable hashing */
export function normalizePdfForFingerprint(buffer) {
  let text = buffer.toString("latin1");
  text = text.replace(/\/CreationDate\s*\([^)]*\)/g, "/CreationDate (LOCKED)");
  text = text.replace(/\/ModDate\s*\([^)]*\)/g, "/ModDate (LOCKED)");
  text = text.replace(/\/ID\s*\[[^\]]*\]/g, "/ID [LOCKED]");
  text = text.replace(/D:\d{14}[+-]\d{2}'\d{2}'/g, "D:LOCKED");
  return text;
}

export function fingerprintEmailHtml(html) {
  const markers = EMAIL_MARKERS.filter((m) => html.includes(m));
  const dimensions = [
    `kpiHeight=${EMAIL_LAYOUT.kpiCardHeight}`,
    `container=${EMAIL_LAYOUT.containerWidth}`,
    `gutter=${EMAIL_LAYOUT.kpiGutter}`,
  ];
  const payload = JSON.stringify({ markers, dimensions, length: html.length });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function extractEmailLayoutMarkers(html) {
  return {
    markers: EMAIL_MARKERS.map((m) => ({ marker: m, present: html.includes(m) })),
    kpiHeight: html.includes(`height:${EMAIL_LAYOUT.kpiCardHeight}px`),
    containerWidth: html.includes(`max-width:${EMAIL_LAYOUT.containerWidth}px`),
    darkTheme: html.includes("#020B1B"),
    cta: html.includes("Download Full PDF Report"),
  };
}

export function fingerprintPdfBuffer(buffer) {
  const text = normalizePdfForFingerprint(buffer);
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const payload = JSON.stringify({
    pageCount,
    margin: PDF_LAYOUT.margin,
    pageWidth: PDF_LAYOUT.pageWidth,
    totalPagesExpected: TOTAL_PAGES,
    byteLength: buffer.length,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function extractPdfLayoutMarkers(buffer) {
  const text = normalizePdfForFingerprint(buffer);
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  return {
    pageCount,
    expectedPages: TOTAL_PAGES,
    margin: PDF_LAYOUT.margin,
    size: PDF_LAYOUT.size,
    validPdf: buffer.slice(0, 4).toString() === "%PDF",
  };
}

export function compareFingerprints(actual, expected, label = "fingerprint") {
  if (actual === expected) return { ok: true };
  return {
    ok: false,
    label,
    message: `${label} mismatch — layout may have changed. Run: node scripts/capture-reporting-baselines.js --update`,
    actual,
    expected,
  };
}
