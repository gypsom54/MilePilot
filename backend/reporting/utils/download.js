/**
 * VITAL — BUSINESS CRITICAL (MP-044)
 * PDF download token store for one-click email links. Do not modify without approval.
 * Contract: scripts/reports-contract.json · See docs/CRITICAL_FILES.md
 */
import { randomBytes } from "crypto";

const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const cache = new Map();

export function getApiPublicUrl() {
  return (process.env.API_PUBLIC_URL || "https://milepilot-production.up.railway.app").replace(/\/$/, "");
}

export function pdfFilenameForReport(report) {
  const periodLabel = report.period || "Daily";
  const dateSlug = new Date().toISOString().slice(0, 10);
  const names = {
    WeeklySummary: `MilePilot-weekly-insights-summary-${dateSlug}.pdf`,
    MonthlySummary: `MilePilot-monthly-insights-summary-${dateSlug}.pdf`,
  };
  return names[periodLabel] || `MilePilot-${String(periodLabel).toLowerCase()}-report-${dateSlug}.pdf`;
}

function pruneCache() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt < now) cache.delete(key);
  }
}

/** Store PDF for one-click email download links (30-day TTL). */
export function storeReportDownload(report, pdfBuffer) {
  const token = randomBytes(24).toString("hex");
  const expiresAt = Date.now() + TTL_MS;
  cache.set(token, {
    report,
    pdfBuffer,
    filename: pdfFilenameForReport(report),
    expiresAt,
  });
  pruneCache();
  return {
    token,
    downloadUrl: `${getApiPublicUrl()}/reports/download/${token}`,
  };
}

export function getStoredDownload(token) {
  if (!token || typeof token !== "string") return null;
  const entry = cache.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    if (entry) cache.delete(token);
    return null;
  }
  return entry;
}
