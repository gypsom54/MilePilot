/**
 * Locked reporting components — map logical names to implementation files.
 * Components are stable; extend via new modules, never rewrite in place.
 */
export const LOCKED_COMPONENTS = Object.freeze({
  ReportHeader: {
    file: "pdf/components/layout.js",
    exports: ["drawPageHeader", "drawPageBackground"],
    locked: true,
  },
  GreetingCard: {
    file: "email/template.js",
    exports: ["renderEmailFromTemplate"],
    locked: true,
    note: "Greeting injected via email.html placeholders",
  },
  KPICard: {
    file: "pdf/components/kpi.js",
    exports: ["drawKpiGrid", "executiveKpis"],
    locked: true,
  },
  SummaryCard: {
    file: "email/template.js",
    exports: ["buildEmailAiSummary"],
    locked: true,
    note: "Summary section in email.html",
  },
  JourneyTable: {
    file: "pdf/components/table.js",
    exports: ["drawJourneyTable"],
    locked: true,
  },
  JourneyTimeline: {
    file: "pdf/components/timeline.js",
    exports: ["drawJourneyTimeline"],
    locked: true,
  },
  JourneyMap: {
    file: "pdf/components/map.js",
    exports: ["drawJourneyMapPage"],
    locked: true,
  },
  HMRCSummary: {
    file: "pdf/components/hmrc.js",
    exports: ["drawHmrcSummary"],
    locked: true,
  },
  AIInsights: {
    file: "pdf/components/insights.js",
    exports: ["drawInsightsSection"],
    locked: true,
  },
  VerificationCertificate: {
    file: "pdf/components/certificate.js",
    exports: ["drawVerificationCertificate"],
    locked: true,
  },
  ReportFooter: {
    file: "pdf/components/layout.js",
    exports: ["drawPageFooter"],
    locked: true,
  },
  EmailTemplate: {
    file: "email/templates/email.html",
    exports: [],
    locked: true,
  },
});

export function getComponentPath(name) {
  const entry = LOCKED_COMPONENTS[name];
  if (!entry) return null;
  return `backend/reporting/${entry.file}`;
}
