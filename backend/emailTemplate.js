/**
 * MilePilot Email Template Engine — LOCKED
 * Master template: templates/email.html
 * Only data is injected. Design changes require explicit sign-off.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BRAND_TAGLINE = "Your business. On AutoPilot.";
const FOOTER_TAGLINE = "Drive • Track • Claim";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "..", "templates", "email.html");

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

function summaryLine(text) {
  return `<div style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#334155;">
    <span style="color:#10B981;font-weight:700;margin-right:8px;">✓</span>${text}
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

function buildSummaryLines(stats, period, fmtMoney) {
  const isDaily = period === "Daily";
  const milesLine = isDaily
    ? `${stats.miles.toFixed(1)} business miles recorded`
    : `${stats.miles.toFixed(1)} business miles in this period`;

  return [
    stats.journeys > 0
      ? summaryLine(`${stats.journeys} business ${stats.journeys === 1 ? "journey" : "journeys"} completed`)
      : summaryLine("No business mileage recorded yet"),
    stats.journeys > 0 ? summaryLine(milesLine) : null,
    stats.hmrc > 0 ? summaryLine(`Estimated HMRC claim ${fmtMoney(stats.hmrc)}`) : null,
    summaryLine("Full route map and journey timeline in your attached PDF"),
    isDaily || period === "Weekly" || period === "Monthly"
      ? summaryLine("Included in this week's automatic summary")
      : null,
    isDaily || period === "Monthly" ? summaryLine("Included in this month's automatic summary") : null,
  ]
    .filter(Boolean)
    .join("");
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

/**
 * Fill the locked master email template with report data.
 * @param {object} data — pre-analysed fields from reportEngine
 */
export function renderEmailFromTemplate(data) {
  const template = loadEmailTemplate();
  const period = data.period || "Daily";

  return fill(template, {
    BRAND_TAGLINE,
    FOOTER_TAGLINE,
    GREETING: `${data.greeting}, ${data.name}`,
    PERIOD_TITLE: data.periodTitle || "Business Mileage Report",
    PENDING_NOTICE: pendingBlock(data.pendingNotice),
    MILES: data.miles,
    DRIVING_TIME: data.drivingTime,
    JOURNEYS: data.journeys,
    HMRC_ESTIMATE: data.hmrcEstimate,
    SUMMARY_TITLE: summaryTitle(period),
    SUMMARY_LINES: buildSummaryLines(
      { miles: data.milesNum, journeys: data.journeysNum, hmrc: data.hmrcNum },
      period,
      data.fmtMoney
    ),
    PDF_DOWNLOAD_URL: data.pdfDownloadUrl,
    ARCHIVE_URL: data.archiveUrl,
    AUTOMATION_NOTES: buildAutomationBlock(period),
  });
}
