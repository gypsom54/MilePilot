/**
 * MilePilot Phase 5 — Premium PDF Report (7 pages, A4)
 * Executive dashboard · Timeline · Breakdown · Map · HMRC · Insights · Certificate
 */
import PDFDocument from "pdfkit";
import { resolveTheme, PDF_LAYOUT } from "../styles/reportTheme.js";
import { periodLabel, fmtDateLong } from "./format.js";
import { buildPremiumInsights } from "./insightsEngine.js";
import { addPremiumPage, drawSectionTitle } from "./components/layout.js";
import { drawKpiGrid, executiveKpis } from "./components/kpi.js";
import { drawJourneyTimeline } from "./components/timeline.js";
import { drawJourneyTable } from "./components/table.js";
import { drawJourneyMapPage } from "./components/map.js";
import { drawHmrcSummary } from "./components/hmrc.js";
import { drawInsightsSection } from "./components/insights.js";
import { drawVerificationCertificate } from "./components/certificate.js";

function enrichAnalysis(a, report) {
  const routes = (a.shifts || []).filter((s) => (s.route || s.routePoints || []).length >= 2);
  const gpsPct = a.shifts.length ? Math.round((routes.length / a.shifts.length) * 100) : 0;
  return {
    ...a,
    trackingMode: report.trackingMode || report.tracking_mode || "AutoPilot",
    gpsConfidencePct: report.gpsConfidencePct ?? gpsPct,
    gpsConfidence: report.gpsConfidence || `${gpsPct}% GPS verified`,
    annualRunningTotal: report.annualRunningTotal ?? report.annualHmrc ?? a.totals.hmrc,
    periodRangeLabel: report.periodLabel || periodLabel(a.period),
    generatedAtTime: a.generatedAtTime || new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function buildPremiumPdf(a, options = {}) {
  const theme = resolveTheme(options.theme || reportThemeFromPeriod(a.period));
  const accountantMode = a.period === "Accountant" || options.accountantMode;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4", autoFirstPage: false });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const margin = PDF_LAYOUT.margin;
    const pageW = PDF_LAYOUT.pageWidth;
    const contentW = pageW - margin * 2;
    const insights = buildPremiumInsights(a);

    // Page 1 — Executive Dashboard
    addPremiumPage(doc, a, margin, contentW, 1, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Executive Summary", "Business Mileage Dashboard", analysis.periodRangeLabel, t);
      y = drawKpiGrid(d, m, y, w, executiveKpis(analysis, analysis.periodRangeLabel), t, 2);
      d.fillColor(t.textMuted).font("Helvetica").fontSize(9).text(`Generated ${fmtDateLong()} · ${analysis.reportId}`, m, y + 4);
      return y + 24;
    });

    // Page 2 — Journey Timeline
    addPremiumPage(doc, a, margin, contentW, 2, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Timeline", "Journey Timeline", "Each business journey at a glance", t);
      return drawJourneyTimeline(d, analysis, m, y, w, t);
    });

    // Page 3 — Journey Breakdown
    addPremiumPage(doc, a, margin, contentW, 3, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(
        d,
        m,
        y,
        "Breakdown",
        accountantMode ? "Accountant Journey Export" : "Journey Breakdown",
        "Professional record for HMRC and your accountant",
        t
      );
      return drawJourneyTable(d, analysis, m, y, w, t, accountantMode);
    });

    // Page 4 — Journey Map
    addPremiumPage(doc, a, margin, contentW, 4, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Routes", "Journey Map", "GPS-verified business routes", t);
      return drawJourneyMapPage(d, analysis, m, y, w, t);
    });

    // Page 5 — HMRC Summary
    addPremiumPage(doc, a, margin, contentW, 5, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Compliance", "HMRC Summary", "Estimated mileage allowance for your records", t);
      return drawHmrcSummary(d, analysis, m, y, w, t);
    });

    // Page 6 — AI Insights
    addPremiumPage(doc, a, margin, contentW, 6, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Intelligence", "AI Business Insights", "Patterns learned from your driving data", t);
      return drawInsightsSection(d, insights, m, y, w, t);
    });

    // Page 7 — Verification Certificate
    addPremiumPage(doc, a, margin, contentW, 7, theme, (d, analysis, m, w, y, t) => {
      y = drawSectionTitle(d, m, y, "Verification", "Report Certificate", "Authentic MilePilot business mileage document", t);
      return drawVerificationCertificate(d, analysis, m, y, w, t);
    });

    doc.end();
  });
}

function reportThemeFromPeriod(period) {
  return period === "Accountant" ? "light" : "dark";
}

export function buildPremiumPdfFromReport(report, analyseFn) {
  const a = enrichAnalysis(analyseFn(report), report);
  return buildPremiumPdf(a, { theme: report.theme, accountantMode: report.period === "Accountant" });
}
