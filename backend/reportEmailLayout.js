/**
 * MilePilot Report Email Layout — premium, spacious briefing design.
 * Uses light outer shell + dark card for reliable rendering in iOS/Gmail dark mode.
 */
import {
  buildRouteMapContext,
  generateRouteSvg,
  generateEmptyStateSvg,
} from "./routeMapService.js";

const EMAIL_CONTENT_W = 440;
const EMAIL_MAP_H = 272;

/** Wraps report body for consistent colour in Apple Mail / Gmail dark mode. */
export function buildEmailDocumentShell(innerHtml) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>MilePilot Report</title>
<style type="text/css">
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; }
  .mp-outer { background-color:#E8EEF7 !important; }
  .mp-card { background-color:#0A2854 !important; }
  .mp-body-text { color:#EAF2FF !important; }
  .mp-muted { color:#B9C8DD !important; }
  .mp-accent { color:#6EB4FF !important; }
  .mp-white { color:#FFFFFF !important; }
  @media (prefers-color-scheme: dark) {
    .mp-outer { background-color:#020B1B !important; }
    .mp-card { background-color:#0A2854 !important; }
    .mp-body-text { color:#EAF2FF !important; }
    .mp-muted { color:#B9C8DD !important; }
    .mp-accent { color:#6EB4FF !important; }
    .mp-white { color:#FFFFFF !important; }
  }
</style>
</head>
<body class="mp-outer" style="margin:0;padding:0;background-color:#E8EEF7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="mp-outer" bgcolor="#E8EEF7" style="background-color:#E8EEF7;padding:40px 16px 48px;">
<tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" class="mp-card" bgcolor="#0A2854" style="max-width:480px;width:100%;background-color:#0A2854;border-radius:24px;border:1px solid #1A4A8C;">
<tr><td style="padding:32px 24px 28px;">
${innerHtml}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function money(v) {
  return `£${Number(v || 0).toFixed(2)}`;
}

function fmtShiftTime(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h <= 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function renderEmailMapHero(ctx) {
  const title = ctx.title;
  let mapInner = "";
  let caption = "";

  if (!ctx.hasJourneys) {
    caption = "No business journeys were recorded during this period.";
    mapInner = generateEmptyStateSvg({ width: EMAIL_CONTENT_W, height: EMAIL_MAP_H, message: caption });
  } else if (!ctx.hasAnyRoute) {
    caption = "Complete a shift with location enabled to see your GPS route map.";
    mapInner = generateEmptyStateSvg({ width: EMAIL_CONTENT_W, height: EMAIL_MAP_H, message: caption });
  } else {
    const routeJourneys = ctx.journeys.filter((j) => j.hasRoute);
    mapInner =
      generateRouteSvg(routeJourneys, { width: EMAIL_CONTENT_W, height: EMAIL_MAP_H }) ||
      generateEmptyStateSvg({ width: EMAIL_CONTENT_W, height: EMAIL_MAP_H, message: "Route map unavailable." });
    if (routeJourneys.length > 1) {
      caption = `${routeJourneys.length} journeys mapped on your route.`;
    }
  }

  const captionHtml = caption
    ? `<p style="margin:0;padding:0 4px 4px;font-size:13px;line-height:1.5;color:#93A8C4;text-align:center;">${caption}</p>`
    : "";

  return `<div style="margin:0 0 36px;">
    <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#6EB4FF;">${title}</p>
    <div style="border-radius:20px;overflow:hidden;border:1px solid rgba(13,107,255,.32);background:linear-gradient(180deg,#0A2854 0%,#061A38 100%);box-shadow:0 16px 48px rgba(13,107,255,.18),inset 0 1px 0 rgba(255,255,255,.06);">
      ${mapInner}
    </div>
    ${captionHtml}
  </div>`;
}

function metricCell(label, value) {
  return `<td width="50%" style="padding:6px;vertical-align:top;">
    <div style="background:linear-gradient(180deg,rgba(13,107,255,.14) 0%,rgba(13,107,255,.05) 100%);border:1px solid rgba(13,107,255,.26);border-radius:18px;padding:26px 22px;box-shadow:0 10px 32px rgba(13,107,255,.12),inset 0 1px 0 rgba(255,255,255,.06);min-height:88px;box-sizing:border-box;">
      <div style="font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6EB4FF;margin-bottom:14px;">${label}</div>
      <div style="font-size:34px;font-weight:700;color:#FFFFFF;letter-spacing:-0.04em;line-height:1;">${value}</div>
    </div>
  </td>`;
}

export function renderEmailMetricGrid(stats, helpers = {}) {
  const fmt = helpers.fmtShiftTime || fmtShiftTime;
  const fmtMoney = helpers.money || money;
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 40px;border-collapse:separate;border-spacing:0;">
    <tr>${metricCell("Business Miles", stats.miles.toFixed(1))}${metricCell("Driving Time", fmt(stats.sec))}</tr>
    <tr>${metricCell("Business Journeys", String(stats.journeys))}${metricCell("HMRC Estimate", fmtMoney(stats.hmrc))}</tr>
  </table>`;
}

function summaryLine(text) {
  return `<div style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#C8D8EF;">
    <span style="color:#20D781;font-weight:700;margin-right:8px;">✓</span>${text}
  </div>`;
}

export function renderEmailDailySummary(ctx, analysis, helpers = {}) {
  const fmtMoney = helpers.money || money;
  const stats = ctx.stats;
  const period = analysis?.period || "Daily";
  const isDaily = period === "Daily";

  const title =
    period === "Daily"
      ? "Today's Summary"
      : period === "Weekly"
        ? "This Week's Summary"
        : period === "Monthly"
          ? "This Month's Summary"
          : "Period Summary";

  const milesLine = isDaily
    ? `${stats.miles.toFixed(1)} business miles recorded`
    : `${stats.miles.toFixed(1)} business miles in this period`;

  const lines = [
    stats.journeys > 0 ? summaryLine(`${stats.journeys} business ${stats.journeys === 1 ? "journey" : "journeys"} completed`) : null,
    stats.journeys > 0 ? summaryLine(milesLine) : summaryLine("No business mileage recorded yet"),
    stats.hmrc > 0 ? summaryLine(`Estimated HMRC claim ${fmtMoney(stats.hmrc)}`) : null,
    summaryLine("PDF securely archived in MilePilot"),
    isDaily || period === "Weekly" || period === "Monthly" ? summaryLine("Included in this week's automatic summary") : null,
    isDaily || period === "Monthly" ? summaryLine("Included in this month's automatic summary") : null,
  ].filter(Boolean);

  return `<div style="margin:0 0 36px;padding:28px 24px;border-radius:20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);box-shadow:0 8px 28px rgba(0,0,0,.12);">
    <div style="font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#6EB4FF;margin-bottom:18px;">${title}</div>
    ${lines.join("")}
  </div>`;
}

export function renderEmailAutomationNotes(period) {
  const notes = [];
  if (period === "Daily") {
    notes.push("Today's mileage has already been added to this week's total.");
    notes.push("Your weekly report will be delivered automatically every Sunday at 11:59 PM.");
    notes.push("Your monthly report will be delivered automatically on the final day of each month.");
  } else if (period === "Weekly" || period === "WeeklySummary") {
    notes.push("This week's totals are already included in your monthly summary.");
    notes.push("Your monthly report will be delivered automatically on the final day of each month.");
  } else if (period === "Monthly" || period === "MonthlySummary") {
    notes.push("Your monthly records are securely archived and ready for HMRC or your accountant.");
  } else {
    notes.push("MilePilot keeps your business mileage totals up to date automatically.");
  }

  return `<div style="margin:0 0 40px;padding:22px 24px;border-radius:16px;background:rgba(13,107,255,.08);border:1px solid rgba(13,107,255,.2);">
    ${notes.map((n) => `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#B9D4FF;">${n}</p>`).join("")}
  </div>`;
}

export function renderEmailCtaSection(pdfDownloadUrl, archiveUrl) {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;">
    <tr><td align="center" style="padding-bottom:14px;">
      <a href="${pdfDownloadUrl}" style="display:inline-block;width:100%;max-width:320px;background:linear-gradient(180deg,#1E88FF 0%,#0D6BFF 55%,#005FE8 100%);color:#FFFFFF;font-size:17px;font-weight:600;text-decoration:none;padding:18px 28px;border-radius:16px;letter-spacing:-0.01em;box-sizing:border-box;box-shadow:0 12px 32px rgba(13,107,255,.32),inset 0 1px 0 rgba(255,255,255,.12);">Download PDF Report</a>
    </td></tr>
    <tr><td align="center" style="padding-bottom:8px;">
      <a href="${archiveUrl}" style="display:inline-block;color:#93A8C4;font-size:15px;font-weight:600;text-decoration:none;padding:10px 18px;">Open MilePilot →</a>
    </td></tr>
  </table>
  <p style="margin:0 0 36px;font-size:13px;color:#93A8C4;line-height:1.6;text-align:center;">Your professional PDF is also attached to this email.</p>`;
}

export function buildEmailRouteSection(shifts, analysis, helpers = {}) {
  const ctx = buildRouteMapContext(shifts, analysis);
  return {
    ctx,
    mapHero: renderEmailMapHero(ctx),
    metricGrid: renderEmailMetricGrid(ctx.stats, helpers),
    dailySummary: renderEmailDailySummary(ctx, analysis, helpers),
    automationNotes: renderEmailAutomationNotes(analysis?.period || "Daily"),
  };
}
