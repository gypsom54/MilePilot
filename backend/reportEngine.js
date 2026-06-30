/**
 * MilePilot Report Engine — MP-013 Magazine Reports
 * Email = 30-second preview · PDF = 2–3 page premium experience
 */

import PDFDocument from "pdfkit";
import { createHash } from "crypto";

export const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  border: "#DDE6F2",
  text: "#06112A",
  green: "#10B981",
};

export const VEHICLE_RATES = {
  car: 0.55,
  van: 0.55,
  bicycle: 0.2,
  motorcycle: 0.24,
};

export const VEHICLE_LABELS = {
  car: "Car",
  van: "Van",
  bicycle: "Bicycle",
  motorcycle: "Motorcycle",
};

export const REPORT_VERSION = "MP-015-document-v2";
const APP_URL = "https://app.milepilot.uk";

/** Locked brand lockup — must match app `.brand-bar` exactly */
export const BRAND_TAGLINE = "Drive • Track • Claim";
export const BRAND_WORDMARK_SIZE = 34;
export const BRAND_PULSE_WIDTH = 200;

export function buildReportDeepLink(report, download = false) {
  const map = { Daily: "day", Weekly: "week", Monthly: "month", Annual: "year" };
  const p = map[report.period || "Daily"] || "day";
  return `${APP_URL}/?reports=${p}${download ? "&download=1" : ""}`;
}

export function buildBrandEmailHeader() {
  return `<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:0 8px 28px;text-align:center;">
  <div style="font-size:34px;font-weight:700;color:#FFFFFF;letter-spacing:-0.04em;line-height:1;-webkit-font-smoothing:antialiased;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
  <div style="height:2px;width:200px;max-width:100%;margin:12px auto 0;border-radius:999px;background:linear-gradient(90deg,rgba(13,107,255,.5) 0%,rgba(110,180,255,.92) 50%,rgba(13,107,255,.5) 100%);box-shadow:0 0 22px rgba(13,107,255,.28),0 0 10px rgba(13,107,255,.16);"></div>
  <p style="margin:10px 0 0;font-size:11px;font-weight:600;letter-spacing:0.12em;color:rgba(110,180,255,.82);">${BRAND_TAGLINE}</p>
</td></tr></table>`;
}

const ALLOWANCE_LABELS = [
  "Estimated Tax Allowance",
  "Mileage Allowance",
  "Business Mileage Value",
  "Estimated Mileage Relief",
];

function money(v) {
  return "£" + Number(v || 0).toFixed(2);
}

function vehicleLabel(v) {
  return VEHICLE_LABELS[v] || v || "—";
}

function fmtShiftTime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return "0h 00m";
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

function fmtDurationShort(sec) {
  sec = Number(sec) || 0;
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h}h ${String(m % 60).padStart(2, "0")}m`;
}

function fmtClock(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDateLong(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function firstName(full) {
  const n = (full || "").trim();
  if (!n) return "";
  return n.split(/\s+/)[0];
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function periodReadyLine(period, periodLabel) {
  if (periodLabel) {
    return `Your business mileage summary for ${periodLabel.replace(/^Custom Period · /, "")} is ready.`;
  }
  const map = {
    Daily: "Your business mileage summary for today is ready.",
    Weekly: "Your business mileage summary for this week is ready.",
    Monthly: "Your business mileage summary for this month is ready.",
    Annual: "Your annual business mileage summary is ready.",
    Custom: "Your custom-period business mileage summary is ready.",
  };
  return map[period] || "Your business mileage summary is ready.";
}

function periodReportTitle(period, periodLabel) {
  if (periodLabel) return periodLabel;
  const map = {
    Daily: "Daily Business Mileage Report",
    Weekly: "Weekly Business Mileage Report",
    Monthly: "Monthly Business Mileage Report",
    Annual: "Annual Business Mileage Report",
    Custom: "Custom Period Business Mileage Report",
  };
  return map[period] || `${period} Business Mileage Report`;
}

function pickAllowanceLabel(report) {
  const seed = createHash("md5").update(`${report.period}|${report.driver}|${new Date().toISOString().slice(0, 10)}`).digest("hex");
  return ALLOWANCE_LABELS[parseInt(seed.slice(0, 2), 16) % ALLOWANCE_LABELS.length];
}

function getWeekEndingDate() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function weekStartDate() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function primaryVehicle(shifts) {
  if (!shifts.length) return "car";
  const counts = {};
  shifts.forEach((s) => {
    const v = s.vehicle || "car";
    counts[v] = (counts[v] || 0) + 1;
  });
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
}

function hmrcRateForShifts(shifts) {
  return VEHICLE_RATES[primaryVehicle(shifts)] || 0.55;
}

function sumShifts(list) {
  return {
    mi: list.reduce((a, b) => a + Number(b.miles || 0), 0),
    sec: list.reduce((a, b) => a + Number(b.seconds || 0), 0),
    hmrc: list.reduce((a, b) => a + Number(b.hmrc || 0), 0),
    journeys: list.length,
  };
}

function groupByDay(shifts) {
  const map = {};
  shifts.forEach((s) => {
    const d = new Date(s.startISO || Date.now());
    const key = d.toLocaleDateString("en-GB", { weekday: "long" });
    if (!map[key]) map[key] = { miles: 0, seconds: 0, trips: 0 };
    map[key].miles += Number(s.miles || 0);
    map[key].seconds += Number(s.seconds || 0);
    map[key].trips += 1;
  });
  const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return order.map((k) => ({ day: k, miles: map[k]?.miles || 0, seconds: map[k]?.seconds || 0, trips: map[k]?.trips || 0 }));
}

function longestShift(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function longestJourney(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.miles || 0) > Number(a.miles || 0) ? b : a));
}

function busiestDay(shifts) {
  const days = groupByDay(shifts).filter((d) => d.miles > 0);
  if (!days.length) return null;
  return days.reduce((a, b) => (b.miles > a.miles ? b : a));
}

function mostProductiveHour(shifts) {
  const buckets = {};
  shifts.forEach((s) => {
    const h = new Date(s.startISO).getHours();
    buckets[h] = (buckets[h] || 0) + Number(s.miles || 0);
  });
  let best = null;
  let bestMi = 0;
  Object.keys(buckets).forEach((h) => {
    if (buckets[h] > bestMi) {
      bestMi = buckets[h];
      best = Number(h);
    }
  });
  if (best === null) return null;
  const end = (best + 1) % 24;
  return {
    label: `${String(best).padStart(2, "0")}:00–${String(end).padStart(2, "0")}:00`,
    miles: bestMi,
  };
}

function generateReportId(report, a) {
  const raw = `${a.period}|${a.driver}|${new Date().toISOString().slice(0, 10)}|${a.totals.mi}`;
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  const prefix = { Daily: "DY", Weekly: "WK", Monthly: "MO", Annual: "YR", Custom: "CP" }[a.period] || "RP";
  return `MP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${prefix}-${hash}`;
}

export function analyseReport(report) {
  const shifts = (report.shifts || []).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const weekShifts = (report.weekShifts || shifts).slice().sort((a, b) => new Date(a.startISO) - new Date(b.startISO));
  const prev = report.previousPeriod || {};
  const prevWeek = report.previousWeek || {};
  const totals = sumShifts(shifts);
  const weekTotals = sumShifts(weekShifts);
  const prevTotals = {
    mi: Number(prev.miles ?? prev.mi ?? 0),
    sec: Number(prev.seconds ?? prev.sec ?? 0),
    hmrc: Number(prev.hmrc ?? 0),
    journeys: Number(prev.journeys ?? 0),
  };
  const prevWeekTotals = {
    mi: Number(prevWeek.miles ?? prevWeek.mi ?? 0),
    sec: Number(prevWeek.seconds ?? prevWeek.sec ?? 0),
    hmrc: Number(prevWeek.hmrc ?? 0),
    journeys: Number(prevWeek.journeys ?? 0),
  };

  const longest = longestShift(shifts);
  const longestJ = longestJourney(shifts);
  const busiest = busiestDay(weekShifts.length ? weekShifts : shifts);
  const productiveHour = mostProductiveHour(shifts);
  const workingDays = new Set(shifts.map((s) => new Date(s.startISO).toDateString())).size;
  const weekWorkingDays = new Set(weekShifts.map((s) => new Date(s.startISO).toDateString())).size;
  const avgShiftSec = shifts.length ? totals.sec / shifts.length : 0;
  const weekAvgShiftSec = weekShifts.length ? weekTotals.sec / weekShifts.length : 0;
  const avgMilesShift = shifts.length ? totals.mi / shifts.length : 0;
  const weekAvgMilesDay = weekWorkingDays ? weekTotals.mi / weekWorkingDays : 0;
  const hmrcRate = Number(report.hmrcRate) || hmrcRateForShifts(shifts.length ? shifts : weekShifts);
  const allowanceLabel = pickAllowanceLabel(report);

  let weekComparePct = null;
  if (prevWeekTotals.mi > 0 && weekTotals.mi > 0) {
    weekComparePct = Math.round((weekTotals.mi / prevWeekTotals.mi - 1) * 100);
  } else if (prevTotals.mi > 0 && totals.mi > 0) {
    weekComparePct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
  }

  const miDiff = totals.mi - prevTotals.mi;
  const hmrcDiff = totals.hmrc - prevTotals.hmrc;
  const avgSpeedMph = totals.sec > 0 ? totals.mi / (totals.sec / 3600) : 0;

  const now = new Date();
  const generatedAt = fmtDateLong(now);
  const generatedAtTime = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const analysis = {
    totals,
    weekTotals,
    prevTotals,
    prevWeekTotals,
    shifts,
    weekShifts,
    driver: (report.driver || "").trim(),
    period: report.period || "Daily",
    periodLabel: (report.periodLabel || "").trim() || null,
    dailyActivity: groupByDay(weekShifts),
    longest,
    longestJ,
    busiest,
    productiveHour,
    workingDays,
    weekWorkingDays,
    avgShiftSec,
    weekAvgShiftSec,
    avgMilesShift,
    weekAvgMilesDay,
    hmrcRate,
    allowanceLabel,
    weekComparePct,
    miDiff,
    hmrcDiff,
    avgSpeedMph,
    weekEnding: getWeekEndingDate(),
    generatedAt,
    generatedAtTime,
  };

  analysis.reportId = generateReportId(report, analysis);
  analysis.waitingSec =
    Number(report.waitingSeconds) ||
    shifts.reduce((acc, s) => acc + Number(s.waitingSeconds || 0), 0);
  analysis.dailyBreakdown =
    Array.isArray(report.dailyBreakdown) && report.dailyBreakdown.length
      ? report.dailyBreakdown
      : buildCalendarDailyBreakdown(shifts);
  analysis.pendingNotice = report.pendingNotice || null;
  analysis.excludedPending = Number(report.excludedPending) || 0;
  if (report.periodLabel) {
    analysis.periodSubtitle = report.periodLabel.replace(/^Custom Date Range · /, "");
  }
  return analysis;
}

function buildCalendarDailyBreakdown(shifts) {
  const map = {};
  shifts.forEach((s) => {
    const d = new Date(s.startISO);
    const key = d.toISOString().slice(0, 10);
    if (!map[key]) {
      map[key] = {
        date: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
        iso: key,
        miles: 0,
        seconds: 0,
        waitingSeconds: 0,
        journeys: 0,
      };
    }
    map[key].miles += Number(s.miles || 0);
    map[key].seconds += Number(s.seconds || 0);
    map[key].waitingSeconds += Number(s.waitingSeconds || 0);
    map[key].journeys += 1;
  });
  return Object.keys(map)
    .sort()
    .map((k) => map[k]);
}

export function buildIntelligence(a) {
  const { totals, shifts, longestJ, productiveHour, prevTotals, miDiff, period } = a;

  if (!shifts.length) {
    const quiet = period === "Daily" ? "Today was a quiet day." : `This ${period.toLowerCase()} was quiet on the road.`;
    return {
      empty: true,
      intro: quiet,
      sub: "No business journeys were recorded.",
      footer: "When you're back on the road, MilePilot will automatically keep tracking every business mile.",
      cards: [],
    };
  }

  const cards = [];

  if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.1) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 1) {
      cards.push({
        accent: "trend",
        label: "Compared to yesterday",
        value: `You drove ${Math.abs(pct)}% ${pct > 0 ? "more" : "less"}`,
        detail: `${Math.abs(miDiff).toFixed(1)} miles ${pct > 0 ? "further" : "less"} than the previous ${period === "Daily" ? "day" : "period"}.`,
      });
    }
  }

  if (longestJ) {
    cards.push({
      accent: "journey",
      label: "Longest journey",
      value: `${Number(longestJ.miles).toFixed(1)} miles`,
      detail: `${fmtClock(longestJ.startISO)} – ${fmtClock(longestJ.endISO)}`,
    });
  }

  if (productiveHour) {
    cards.push({
      accent: "time",
      label: "Most productive hour",
      value: productiveHour.label,
      detail: `${productiveHour.miles.toFixed(1)} business miles recorded.`,
    });
  }

  if (totals.hmrc > 0) {
    cards.push({
      accent: "allowance",
      label: period === "Daily" ? "Today's mileage allowance" : "Period mileage allowance",
      value: money(totals.hmrc),
      detail: `${totals.mi.toFixed(1)} business miles at ${Math.round(a.hmrcRate * 100)}p per mile.`,
    });
  }

  if (a.avgMilesShift > 0 && shifts.length >= 2) {
    cards.push({
      accent: "average",
      label: "Average journey",
      value: `${a.avgMilesShift.toFixed(1)} miles`,
      detail: `Typical duration ${fmtDurationShort(a.avgShiftSec)}.`,
    });
  }

  return { empty: false, intro: null, sub: null, footer: null, cards: cards.slice(0, 4) };
}

function drawFooter(doc, a, margin, contentW) {
  const footY = doc.page.height - 64;
  doc.moveTo(margin, footY - 14).lineTo(margin + contentW, footY - 14).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(9).text(BRAND_TAGLINE, margin, footY, { width: contentW, align: "center" });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text("Generated by MilePilot", margin, footY + 14, { width: contentW, align: "center" });
  doc.text(`${a.generatedAt} at ${a.generatedAtTime}  ·  Report ID ${a.reportId}  ·  ${REPORT_VERSION}`, margin, footY + 26, { width: contentW, align: "center" });
}

/** Solid brand pulse — matches app `.brand-pulse` (opaque blue gradient) */
function drawBrandPulse(doc, x, y, width = BRAND_PULSE_WIDTH) {
  const h = 2;
  doc.rect(x, y, width * 0.28, h).fill("#0A52D4");
  doc.rect(x + width * 0.28, y, width * 0.44, h).fill("#7EC0FF");
  doc.rect(x + width * 0.72, y, width * 0.28, h).fill("#0A52D4");
}

function drawPageHeader(doc, a, margin, contentW, pageW) {
  const headerH = 128;
  doc.rect(0, 0, pageW, headerH).fill(BRAND.navy);
  doc.rect(0, headerH - 3, pageW, 3).fill(BRAND.blue);
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(BRAND_WORDMARK_SIZE).text("Mile ", margin, 28, { continued: true, lineBreak: false });
  doc.fillColor(BRAND.blue).text("Pilot", { lineBreak: false });
  drawBrandPulse(doc, margin, 70, BRAND_PULSE_WIDTH);
  doc.fillColor("#6EB4FF").font("Helvetica-Bold").fontSize(10.5).text(BRAND_TAGLINE, margin, 82, { characterSpacing: 1.4 });
  const rightX = pageW - margin - 210;
  doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9.5).text(periodReportTitle(a.period, a.periodLabel).toUpperCase(), rightX, 32, { width: 210, align: "right", characterSpacing: 0.8 });
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(9).text(a.generatedAt, rightX, 50, { width: 210, align: "right" });
  if (a.driver) {
    doc.text(`Prepared for ${a.driver}`, rightX, 66, { width: 210, align: "right" });
  }
  return 148;
}

function drawSectionTitle(doc, margin, y, overline, title, subtitle = null) {
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(7.5).text(overline.toUpperCase(), margin, y, { characterSpacing: 1.6 });
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(15).text(title, margin, y + 14);
  if (subtitle) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(subtitle, margin, y + 34);
    return y + 54;
  }
  return y + 40;
}

const INTEL_ACCENT = {
  trend: BRAND.blue,
  journey: "#1E88FF",
  time: "#3B82F6",
  allowance: BRAND.green,
  average: "#2563EB",
};

function drawMetricCard(doc, x, y, w, h, label, value) {
  doc.roundedRect(x, y, w, h, 12).fillAndStroke("#FFFFFF", BRAND.border);
  doc.roundedRect(x + 1, y + 1, w - 2, 4, 2).fill(BRAND.blue);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(label.toUpperCase(), x + 16, y + 18, { width: w - 32, characterSpacing: 0.7, lineGap: 0 });
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text(String(value), x + 16, y + 34, { width: w - 32, lineBreak: false });
}

function drawIntelligenceCard(doc, margin, y, contentW, card) {
  const cardH = 56;
  const accent = INTEL_ACCENT[card.accent] || BRAND.blue;
  doc.roundedRect(margin, y, contentW, cardH, 12).fillAndStroke("#FFFFFF", BRAND.border);
  doc.roundedRect(margin + 1, y + 12, 4, cardH - 24, 2).fill(accent);
  doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(7.5).text(card.label.toUpperCase(), margin + 18, y + 14, { width: contentW - 36, characterSpacing: 0.6 });
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13.5).text(card.value, margin + 18, y + 30, { width: contentW / 2 - 24, lineBreak: false });
  if (card.detail) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8.5).text(card.detail, margin + contentW / 2, y + 22, { width: contentW / 2 - 22, align: "right", lineGap: 1.2 });
  }
  return y + cardH + 10;
}

/** Accountant-ready HMRC block — label and value stacked (no overlap) */
function drawHmrcSummaryBox(doc, a, margin, contentW, y) {
  const boxH = 98;
  const rightX = margin + Math.round(contentW * 0.54);
  const rightW = contentW - Math.round(contentW * 0.54) - 18;

  doc.roundedRect(margin, y, contentW, boxH, 14).fillAndStroke("#EEF4FF", BRAND.blue);

  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text("HMRC Summary", margin + 18, y + 16);

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9);
  doc.text(`Current HMRC rate: ${Math.round(a.hmrcRate * 100)}p per mile`, margin + 18, y + 38, { width: contentW * 0.48 });
  doc.text(`Business miles: ${a.totals.mi.toFixed(1)}`, margin + 18, y + 52, { width: contentW * 0.48 });

  doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(7.5).text("ESTIMATED MILEAGE ALLOWANCE", rightX, y + 20, { width: rightW, align: "right", characterSpacing: 0.5 });
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(28).text(money(a.totals.hmrc), rightX, y + 36, { width: rightW, align: "right", lineBreak: false });

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7.5).text(
    "Estimates for record keeping only. Verify against official HMRC guidance before filing.",
    margin + 18,
    y + boxH - 20,
    { width: contentW - 36, lineGap: 1 }
  );

  return y + boxH + 18;
}

function drawProgressBar(doc, x, y, w, h, pct) {
  doc.roundedRect(x, y, w, h, h / 2).fill("#EEF2F8");
  const fillW = Math.max(h, w * Math.min(Math.max(pct, 0), 1));
  if (fillW > h) doc.roundedRect(x, y, fillW, h, h / 2).fill(BRAND.blue);
}

function drawMiniRoute(doc, x, y, w, h, route) {
  const pts = (route || []).filter((p) => p && p.lat != null && p.lon != null);
  if (pts.length < 2) return;
  const lats = pts.map((p) => p.lat);
  const lons = pts.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const pad = 5;
  const scaleX = (w - pad * 2) / Math.max(maxLon - minLon, 1e-6);
  const scaleY = (h - pad * 2) / Math.max(maxLat - minLat, 1e-6);
  const scale = Math.min(scaleX, scaleY);
  doc.roundedRect(x, y, w, h, 4).fillAndStroke(BRAND.light, BRAND.border);
  const mapped = pts.map((p) => [
    x + pad + (p.lon - minLon) * scale,
    y + h - pad - (p.lat - minLat) * scale,
  ]);
  doc.moveTo(mapped[0][0], mapped[0][1]);
  for (let i = 1; i < mapped.length; i++) doc.lineTo(mapped[i][0], mapped[i][1]);
  doc.strokeColor(BRAND.blue).lineWidth(1.1).stroke();
}

export function buildPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    const a = analyseReport(report);
    const intel = buildIntelligence(a);
    const doc = new PDFDocument({ margin: 0, size: "A4", autoFirstPage: true });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const margin = 52;
    const contentW = pageW - margin * 2;

    // ── PAGE 1: Hero + Intelligence ──
    let y = drawPageHeader(doc, a, margin, contentW, pageW);

    const heroOverline = a.period === "Custom" ? "PERIOD TOTAL" : "TODAY'S TOTAL";
    doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text(heroOverline, margin, y, { characterSpacing: 1.8 });
    y += 18;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(96).text(a.totals.mi.toFixed(1), margin, y, { lineBreak: false });
    y += 102;
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(11).text("Business Miles", margin, y, { characterSpacing: 0.3 });
    if (a.period === "Custom" && a.periodSubtitle) {
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(a.periodSubtitle, margin, y + 16, { width: contentW });
      y += 14;
    }
    doc.moveTo(margin, y + 18).lineTo(margin + 120, y + 18).strokeColor(BRAND.border).lineWidth(1).stroke();
    y += 34;

    if (a.period === "Custom" && a.pendingNotice) {
      doc.roundedRect(margin, y, contentW, 44, 10).fillAndStroke("#FFF8E8", "#F0C35A");
      doc.fillColor("#7A5B12").font("Helvetica").fontSize(9).text(a.pendingNotice, margin + 14, y + 14, { width: contentW - 28 });
      y += 56;
    }

    const cardW = (contentW - 14) / 2;
    const cardH = 62;
    const cards =
      a.period === "Custom"
        ? [
            { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
            { label: "Waiting Time", value: a.waitingSec > 0 ? fmtShiftTime(a.waitingSec) : "—" },
            { label: "Business Journeys", value: String(a.totals.journeys) },
            { label: a.allowanceLabel, value: money(a.totals.hmrc) },
          ]
        : [
            { label: "Travel Time", value: fmtShiftTime(a.totals.sec) },
            { label: "Business Journeys", value: String(a.totals.journeys) },
            { label: a.allowanceLabel, value: money(a.totals.hmrc) },
            { label: "Average Journey", value: a.avgMilesShift > 0 ? `${a.avgMilesShift.toFixed(1)} mi` : "—" },
          ];
    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      drawMetricCard(doc, margin + col * (cardW + 14), y + row * (cardH + 14), cardW, cardH, c.label, c.value);
    });
    y += 2 * (cardH + 14) + 28;

    y = drawSectionTitle(doc, margin, y, "Insights", "MilePilot Intelligence");

    if (intel.empty) {
      doc.roundedRect(margin, y, contentW, 92, 14).fillAndStroke(BRAND.light, BRAND.border);
      doc.roundedRect(margin + 1, y + 1, contentW - 2, 4, 2).fill(BRAND.blue);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(intel.intro, margin + 22, y + 22, { width: contentW - 44 });
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(intel.sub, margin + 22, y + 42, { width: contentW - 44 });
      doc.text(intel.footer, margin + 22, y + 60, { width: contentW - 44, lineGap: 2 });
      y += 108;
    } else {
      intel.cards.forEach((card) => {
        y = drawIntelligenceCard(doc, margin, y, contentW, card);
      });
    }

    drawFooter(doc, a, margin, contentW);

    // ── PAGE 2: Journey table ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    y = drawSectionTitle(doc, margin, y, "Journeys", "Trip Timeline", a.period === "Custom" ? "Business journeys in date order" : "Professional record for your accountant");

    const isCustom = a.period === "Custom";
    const tCols = isCustom
      ? [margin + 8, margin + 48, margin + 92, margin + 142, margin + 192, margin + 248]
      : [margin + 8, margin + 52, margin + 102, margin + 162, margin + 222, margin + 292];
    doc.roundedRect(margin, y, contentW, 24, 4).fill(BRAND.navy);
    (isCustom ? ["Date", "Start", "Finish", "Miles", "Drive", "Route"] : ["Time", "Start", "Finish", "Miles", "Duration"]).forEach((h, i) => {
      doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(7.5).text(h.toUpperCase(), tCols[i], y + 8);
    });
    y += 24;

    if (!a.shifts.length) {
      doc.roundedRect(margin, y, contentW, 40, 8).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("No journeys recorded in this period.", margin + 16, y + 14);
    } else {
      a.shifts.forEach((s, idx) => {
        const rowH = isCustom && (s.route?.length >= 2 || s.routePoints?.length >= 2) ? 36 : 24;
        if (y + rowH > doc.page.height - 180) {
          drawFooter(doc, a, margin, contentW);
          doc.addPage({ margin: 0 });
          y = drawPageHeader(doc, a, margin, contentW, pageW) + 20;
        }
        doc.rect(margin, y, contentW, rowH).fill(idx % 2 === 0 ? "#FFFFFF" : BRAND.light);
        const d = new Date(s.startISO);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(8.5);
        doc.text(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), tCols[0], y + (rowH > 24 ? 12 : 8));
        doc.text(fmtClock(s.startISO), tCols[1], y + (rowH > 24 ? 12 : 8));
        doc.text(fmtClock(s.endISO), tCols[2], y + (rowH > 24 ? 12 : 8));
        doc.font("Helvetica-Bold").text(Number(s.miles || 0).toFixed(1), tCols[3], y + (rowH > 24 ? 12 : 8));
        doc.font("Helvetica").text(fmtDurationShort(s.seconds), tCols[4], y + (rowH > 24 ? 12 : 8));
        if (isCustom) {
          const route = s.route || s.routePoints || [];
          if (route.length >= 2) drawMiniRoute(doc, tCols[5], y + 4, contentW - (tCols[5] - margin) - 8, rowH - 8, route);
          else doc.fillColor(BRAND.muted).fontSize(7.5).text("—", tCols[5], y + 12);
        }
        y += rowH;
      });
    }

    if (y + 120 > doc.page.height - 80) {
      drawFooter(doc, a, margin, contentW);
      doc.addPage({ margin: 0 });
      y = drawPageHeader(doc, a, margin, contentW, pageW) + 20;
    }
    y = drawHmrcSummaryBox(doc, a, margin, contentW, y);

    drawFooter(doc, a, margin, contentW);

    // ── PAGE 3: Performance / daily breakdown ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);

    if (a.period === "Custom") {
      y = drawSectionTitle(doc, margin, y, "Daily", "Daily Breakdown", "Business miles by day in this period");
      const days = a.dailyBreakdown || [];
      const maxDayMi = Math.max(...days.map((d) => d.miles), 1);
      if (!days.length) {
        doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("No daily activity in this period.", margin, y + 8);
      } else {
        days.forEach((d) => {
          doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(d.date, margin, y + 3, { width: 88 });
          drawProgressBar(doc, margin + 92, y + 4, contentW - 200, 8, d.miles / maxDayMi);
          doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text(
            d.miles > 0 ? `${d.miles.toFixed(1)} mi · ${d.journeys} j` : "—",
            margin + contentW - 96,
            y + 2,
            { width: 96, align: "right" }
          );
          y += 22;
        });
      }
      y += 16;
      const stats = [
        ["Total business miles", `${a.totals.mi.toFixed(1)} mi`],
        ["Total driving time", fmtShiftTime(a.totals.sec)],
        ["Total waiting time", a.waitingSec > 0 ? fmtShiftTime(a.waitingSec) : "—"],
        ["Business journeys", String(a.totals.journeys)],
        ["HMRC mileage estimate", money(a.totals.hmrc)],
        ["Generated", `${a.generatedAt} at ${a.generatedAtTime}`],
      ];
      doc.roundedRect(margin, y, contentW, stats.length * 28 + 24, 14).fillAndStroke("#FFFFFF", BRAND.border);
      doc.roundedRect(margin + 1, y + 1, contentW - 2, 4, 2).fill(BRAND.blue);
      let sy = y + 16;
      stats.forEach(([label, val]) => {
        doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(label, margin + 18, sy);
        doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, sy, {
          width: contentW / 2 - 24,
          align: "right",
        });
        sy += 28;
      });
      drawFooter(doc, a, margin, contentW);
    } else {
    y = drawSectionTitle(doc, margin, y, "Performance", "Weekly Performance", `Week ending ${a.weekEnding}`);

    const maxDayMi = Math.max(...a.dailyActivity.map((d) => d.miles), 1);
    a.dailyActivity.slice(0, 7).forEach((d) => {
      doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(d.day, margin, y + 3, { width: 72 });
      drawProgressBar(doc, margin + 78, y + 4, contentW - 130, 8, d.miles / maxDayMi);
      doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text(d.miles > 0 ? `${d.miles.toFixed(1)} mi` : "—", margin + contentW - 44, y + 2, { width: 44, align: "right" });
      y += 22;
    });
    y += 20;

    const stats = [
      ["Average miles / day", a.weekAvgMilesDay > 0 ? `${a.weekAvgMilesDay.toFixed(1)} mi` : "—"],
      ["Average shift length", a.weekAvgShiftSec > 0 ? fmtShiftTime(a.weekAvgShiftSec) : "—"],
      ["Longest day", a.busiest ? `${a.busiest.day} · ${a.busiest.miles.toFixed(1)} mi` : "—"],
      ["Total mileage allowance", money(a.weekTotals.hmrc)],
      [
        "Trend vs last week",
        a.weekComparePct !== null ? `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}% business miles` : "—",
      ],
    ];

    doc.roundedRect(margin, y, contentW, stats.length * 28 + 24, 14).fillAndStroke("#FFFFFF", BRAND.border);
    doc.roundedRect(margin + 1, y + 1, contentW - 2, 4, 2).fill(BRAND.blue);
    let sy = y + 16;
    stats.forEach(([label, val]) => {
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(label, margin + 18, sy);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, sy, { width: contentW / 2 - 24, align: "right" });
      sy += 28;
    });

    drawFooter(doc, a, margin, contentW);
    }
    doc.end();
  });
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const greeting = timeGreeting();
  const ready = periodReadyLine(a.period, a.periodLabel);

  const metric = (label, value) =>
    `<tr><td style="padding:0 0 12px;">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#93A8C4;margin-bottom:6px;">${label}</div>
      <div style="font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;line-height:1.1;">${value}</div>
    </td></tr>`;

  const downloadUrl = buildReportDeepLink(report, true);
  const appUrl = `${APP_URL}/`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#031126;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:44px 20px 52px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
<tr><td style="padding:0 20px;">
  ${buildBrandEmailHeader()}
  <p style="margin:0 0 12px;font-size:17px;color:#EAF2FF;line-height:1.5;">${greeting} ${name} 👋</p>
  <p style="margin:0 0 32px;font-size:16px;color:#B9C8DD;line-height:1.55;">${ready}</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    ${metric("Business Miles", a.totals.mi.toFixed(1))}
    ${metric("Travel Time", fmtShiftTime(a.totals.sec))}
    ${metric("Business Journeys", String(a.totals.journeys))}
    ${metric("Estimated HMRC", money(a.totals.hmrc))}
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
    <tr><td align="center" style="padding-bottom:10px;">
      <a href="${downloadUrl}" style="display:inline-block;width:100%;max-width:320px;background:linear-gradient(180deg,#1E88FF,#0D6BFF);color:#FFFFFF;font-size:16px;font-weight:600;text-decoration:none;padding:16px 24px;border-radius:14px;letter-spacing:-0.01em;box-sizing:border-box;">📄 Download PDF Report</a>
    </td></tr>
    <tr><td align="center">
      <a href="${appUrl}" style="display:inline-block;color:#93A8C4;font-size:14px;font-weight:600;text-decoration:none;padding:8px 16px;">Open MilePilot</a>
    </td></tr>
  </table>
  <p style="margin:0 0 36px;font-size:14px;color:#93A8C4;line-height:1.6;text-align:center;">Your professional PDF report is attached to this email.</p>
  <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.14em;color:#0D6BFF;text-align:center;">${BRAND_TAGLINE}</p>
  <p style="margin:0;font-size:13px;color:#B9C8DD;line-height:1.6;text-align:center;">Thank you for choosing MilePilot.<br><span style="color:#93A8C4;">Every mile matters.</span></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function buildReportEmailText(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  return `${timeGreeting()} ${name} 👋

${periodReadyLine(a.period, a.periodLabel)}

Business Miles: ${a.totals.mi.toFixed(1)}
Travel Time: ${fmtShiftTime(a.totals.sec)}
Business Journeys: ${a.totals.journeys}
Estimated HMRC: ${money(a.totals.hmrc)}

View your report in MilePilot: ${buildReportDeepLink(report, true)}

Your professional PDF report is attached to this email.

Open MilePilot: ${APP_URL}/

Drive • Track • Claim
Thank you for choosing MilePilot.
Every mile matters.`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  const emoji = period === "Weekly" ? "📊 " : period === "Daily" ? "🚗 " : period === "Custom" ? "📋 " : "";
  return `${emoji}Your MilePilot ${periodReportTitle(period, report.periodLabel)}`;
}
