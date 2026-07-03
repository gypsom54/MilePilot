/**
 * Golden Report comparison — detect subtle layout regressions (fonts, spacing, colours).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import { normalizePdfForFingerprint } from "./layoutFingerprint.js";
import { GOLDEN_KPI } from "./goldenReport.js";

/** Strip volatile content from email HTML before hashing */
export function normalizeGoldenEmail(html) {
  return html
    .replace(/Good (morning|afternoon|evening),/g, "GOOD_GREETING,")
    .replace(/MP-\d{8}-[A-Z]{2}-[A-F0-9]{8}/g, "MP-GOLDEN-ID")
    .replace(/\d{1,2}:\d{2}(?!\d)/g, "12:00")
    .replace(/https:\/\/[^\s"']+/g, "https://GOLDEN-URL")
    .replace(/\s+/g, " ")
    .trim();
}

/** Deep-normalize PDF bytes — dates, IDs, metadata, timestamps */
export function normalizeGoldenPdf(buffer) {
  let text = normalizePdfForFingerprint(buffer);
  text = text.replace(/MP-\d{8}-[A-Z]{2}-[A-F0-9]{8}/g, "MP-GOLDEN-ID");
  text = text.replace(/Jonathan O'Neill/g, "GOLDEN-DRIVER");
  text = text.replace(/\/Producer\s*\([^)]*\)/g, "/Producer (GOLDEN)");
  text = text.replace(/\/Creator\s*\([^)]*\)/g, "/Creator (GOLDEN)");
  text = text.replace(/\/Title\s*\([^)]*\)/g, "/Title (GOLDEN)");
  return text;
}

export function fingerprintGoldenEmail(html) {
  return crypto.createHash("sha256").update(normalizeGoldenEmail(html)).digest("hex");
}

export function fingerprintGoldenPdf(buffer) {
  return crypto.createHash("sha256").update(normalizeGoldenPdf(buffer)).digest("hex");
}

/** Extract structural PDF metrics that change when layout/fonts/spacing shift */
export function extractGoldenPdfStructure(buffer) {
  const text = normalizeGoldenPdf(buffer);
  const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length;
  const helveticaRefs = (text.match(/\/Helvetica/g) || []).length;
  const fontSizeRefs = (text.match(/\/FontSize\s+\d+/g) || []).length;
  const colorRefs = (text.match(/#[0-9A-Fa-f]{6}/g) || []).length;
  const streamCount = (text.match(/\/Length\s+\d+/g) || []).length;

  return {
    pageCount,
    helveticaRefs,
    fontSizeRefs,
    colorRefs,
    streamCount,
    byteLength: buffer.length,
  };
}

/** Assert golden KPI values appear in generated email */
export function assertGoldenKpiInEmail(html) {
  const required = [
    GOLDEN_KPI.miles,
    GOLDEN_KPI.tripsDisplay,
    GOLDEN_KPI.drivingTime,
    GOLDEN_KPI.hmrc,
    "Jonathan",
  ];
  const missing = required.filter((v) => !html.includes(v));
  if (missing.length) {
    throw new Error(`Golden email missing KPI values: ${missing.join(", ")}`);
  }
}

export function loadGoldenManifest(manifestPath) {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

export function compareGoldenArtifacts(actual, manifest) {
  const errors = [];

  if (actual.emailFingerprint !== manifest.emailFingerprint) {
    errors.push("Golden email layout fingerprint changed (fonts, spacing, colours, or structure)");
  }

  const struct = actual.pdfStructure;
  const expected = manifest.pdfStructure;
  for (const key of ["pageCount", "helveticaRefs", "streamCount"]) {
    if (struct[key] !== expected[key]) {
      errors.push(`Golden PDF structure.${key}: ${struct[key]} !== ${expected[key]}`);
    }
  }

  const byteDelta = Math.abs(struct.byteLength - expected.byteLength);
  const tolerance = manifest.byteLengthTolerance ?? 0;
  if (byteDelta > tolerance) {
    errors.push(`Golden PDF size shifted by ${byteDelta} bytes (tolerance ${tolerance})`);
  }

  return errors;
}

/** Compare freshly generated PDF to the stored reference file on disk */
export function compareToReferencePdf(generated, reference) {
  const gen = extractGoldenPdfStructure(generated);
  const ref = extractGoldenPdfStructure(reference);
  const errors = [];
  for (const key of ["pageCount", "helveticaRefs", "streamCount"]) {
    if (gen[key] !== ref[key]) {
      errors.push(`PDF vs reference structure.${key}: ${gen[key]} !== ${ref[key]}`);
    }
  }
  const byteDelta = Math.abs(gen.byteLength - ref.byteLength);
  if (byteDelta > 512) {
    errors.push(`PDF vs reference size delta ${byteDelta} bytes`);
  }
  return errors;
}
