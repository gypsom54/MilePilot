/**
 * MilePilot Reporting Module — production boundary
 *
 * HTML email + PDF generation only. Do not mix with dashboard logic.
 * @see docs/REPORTING_SYSTEM_LOCK.md
 */
export { REPORTING_SYSTEM_VERSION, REPORTING_SYSTEM_STATUS } from "./VERSION.js";
export {
  DARK,
  LIGHT,
  PDF_LAYOUT,
  EMAIL_LAYOUT,
  TYPOGRAPHY,
  resolveTheme,
  TOTAL_PAGES,
  PDF_FOOTER_TAGLINE,
} from "./styles/reportTheme.js";
export { buildPremiumPdf, buildPremiumPdfFromReport } from "./pdf/premiumPdf.js";
export {
  loadEmailTemplate,
  clearEmailTemplateCache,
  renderEmailFromTemplate,
  emailPeriodTitle,
  buildEmailAiSummary,
} from "./email/template.js";
export {
  storeReportDownload,
  getStoredDownload,
  getApiPublicUrl,
  pdfFilenameForReport,
} from "./utils/download.js";
export { LOCKED_COMPONENTS, getComponentPath } from "./verification/componentRegistry.js";
export {
  fingerprintEmailHtml,
  fingerprintPdfBuffer,
  compareFingerprints,
} from "./verification/layoutFingerprint.js";
export { buildFixtureReport, PERIOD_FIXTURES } from "./verification/snapshotFixtures.js";
export {
  buildGoldenReport,
  buildGoldenShifts,
  GOLDEN_KPI,
  verifyGoldenTotals,
} from "./verification/goldenReport.js";
export {
  normalizeGoldenEmail,
  normalizeGoldenPdf,
  fingerprintGoldenEmail,
  fingerprintGoldenPdf,
  extractGoldenPdfStructure,
  assertGoldenKpiInEmail,
  compareGoldenArtifacts,
  compareToReferencePdf,
} from "./verification/goldenCompare.js";
