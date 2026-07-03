/**
 * MilePilot Email Template Engine — Phase 5 visual polish
 * Master template: backend/templates/email.html
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fmtDrivingTimeCompact } from "./reports/format.js";

const BRAND_TAGLINE = "Your business. On AutoPilot.";
const FOOTER_TAGLINE = "Drive • Track • Claim";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "templates", "email.html");

let cachedTemplate = null;

export function loadEmailTemplate() {
  if (!cachedTemplate) {
    cachedTemplate = fs.readFileSync(TEMPLATE_PATH, "utf8");
  }
  return cachedTemplate;
}

export function clearEmailTemplateCache() {
  cachedTemplate = null;
}

function fill(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value ?? "");
  }
  return out;
}

function summaryLine(icon, text) {
  return `<div style="margin:0 0 12px;font-size:14px;line-height:1.5;color:#9FB4D0;">
    <span style="display:inline-block;width:24px;font-size:15px;line-height:1;opacity:0.82;vertical-align:-1px;">${icon}</span>${text}
  </div>`;
}

function summaryTitle(period) {
  if (period === "Daily") return "Today's Summary";
  if (period === "Weekly") return "This Week's Summary";
  if (period === "Monthly") return "This Month's Summary";
  if (period === "WeeklySummary") return "Weekly Insights";
  if (period === "MonthlySummary") return "Monthly Insights";
  return "Period Summary";
}

function buildSummaryLines(stats, period, fmtMoney, gpsConfidence) {
  const isDaily = period === "Daily";
  const milesLine = isDaily
    ? `${stats.miles.toFixed(1)} business miles recorded`
    : `${stats.miles.toFixed(1)} business miles in this period`;

  const lines = [];
  if (stats.journeys > 0) {
    lines.push(
      summaryLine(
        "🛣",
        `${stats.journeys} business ${stats.journeys === 1 ? "journey" : "journeys"} completed`
      )
    );
    lines.push(summaryLine("🚗", milesLine));
  } else {
    lines.push(summaryLine("🛣", "No business journeys recorded yet"));
  }
  if (stats.hmrc > 0) {
    lines.push(summaryLine("💷", `Estimated HMRC claim ${fmtMoney(stats.hmrc)}`));
  }
  if (gpsConfidence) {
    lines.push(summaryLine("📍", `GPS confidence ${gpsConfidence}`));
  }
  return lines.join("");
}

function buildAutomationBlock(period) {
  let note = "";
  if (period === "Daily") {
    note = "Today's mileage is included in your weekly and monthly summaries automatically.";
  } else if (period === "Weekly" || period === "WeeklySummary") {
    note = "This week's totals are included in your monthly summary automatically.";
  } else if (period === "Monthly" || period === "MonthlySummary") {
    note = "Your monthly records are securely archived and ready for HMRC or your accountant.";
  }
  if (!note) return "";
  return `<p style="margin:0 0 8px;font-size:13px;color:#64748B;line-height:1.6;text-align:center;">${note}</p>`;
}

function pendingBlock(notice) {
  if (!notice) return "";
  return `<p style="margin:0 0 20px;font-size:13px;color:#7A5B12;line-height:1.55;padding:14px 16px;border-radius:10px;background:#FFF8E8;border:1px solid #F0C35A;">${notice}</p>`;
}

function periodDateValue(data) {
  if (data.periodDate) return data.periodDate;
  if (data.reportingPeriod && !String(data.reportingPeriod).includes("Report")) return data.reportingPeriod;
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Fill the master email template with report data.
 */
export function renderEmailFromTemplate(data) {
  const template = loadEmailTemplate();
  const period = data.period || "Daily";
  const drivingCompact = fmtDrivingTimeCompact(data.drivingSeconds ?? 0);

  return fill(template, {
    BRAND_TAGLINE,
    FOOTER_TAGLINE,
    GREETING_HEAD: data.greeting || "Hello",
    GREETING_NAME: data.name ? `${data.name} 👋` : "there 👋",
    PERIOD_TITLE: data.periodTitle || "Business Mileage Report",
    PERIOD_LABEL: "Report period",
    PERIOD_VALUE: periodDateValue(data),
    PENDING_NOTICE: pendingBlock(data.pendingNotice),
    MILES: data.miles,
    DRIVING_TIME: data.drivingTimeCompact || drivingCompact,
    JOURNEYS: data.journeys,
    HMRC_ESTIMATE: data.hmrcEstimate,
    SUMMARY_TITLE: summaryTitle(period),
    SUMMARY_LINES: buildSummaryLines(
      { miles: data.milesNum, journeys: data.journeysNum, hmrc: data.hmrcNum },
      period,
      data.fmtMoney,
      data.gpsConfidence
    ),
    PDF_DOWNLOAD_URL: data.pdfDownloadUrl,
    ARCHIVE_URL: data.archiveUrl,
    AUTOMATION_NOTES: buildAutomationBlock(period),
  });
}
