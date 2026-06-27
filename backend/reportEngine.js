/**
 * MilePilot Report Engine — MP-012 Premium PDF
 * Email = 30-second preview · PDF = 2–3 page premium experience
 */

import PDFDocument from "pdfkit";
import { createHash } from "crypto";

export const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  blueDark: "#0A52D4",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  pageBg: "#E8EEF6",
  border: "#DDE6F2",
  text: "#06112A",
  green: "#10B981",
  white: "#FFFFFF",
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

export const REPORT_VERSION = "MP-012-pdf-v3";
const APP_URL = "https://app.milepilot.uk";
const SITE_URL = "www.milepilot.uk";

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

function periodReadyLine(period) {
  const map = {
    Daily: "Your driving summary for today is ready.",
    Weekly: "Your driving summary for this week is ready.",
    Monthly: "Your driving summary for this month is ready.",
    Annual: "Your annual driving summary is ready.",
  };
  return map[period] || "Your driving summary is ready.";
}

function periodReportTitle(period) {
  const map = {
    Daily: "Daily Business Mileage Report",
    Weekly: "Weekly Business Mileage Report",
    Monthly: "Monthly Business Mileage Summary",
    Annual: "Annual Business Mileage Summary",
  };
  return map[period] || `${period} Business Mileage Report`;
}

function periodSummaryLine(period, dateStr) {
  const map = {
    Daily: `Here's your driving summary for ${dateStr}.`,
    Weekly: `Here's your business mileage summary for the week ending ${dateStr}.`,
    Monthly: `Here's your business mileage summary for ${dateStr}.`,
    Annual: `Here's your annual business mileage summary.`,
  };
  return map[period] || `Here's your driving summary for ${dateStr}.`;
}

function fmtDateShort(d = new Date()) {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
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


function longestShiftInList(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function monthProgressFromWeek(weekTotals) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  if (dayOfMonth <= 0 || weekTotals.mi <= 0) return null;
  const dailyRate = weekTotals.mi / Math.min(dayOfMonth, 7);
  const projectedMi = dailyRate * daysInMonth;
  const projectedHmrc = (weekTotals.hmrc / Math.max(weekTotals.mi, 0.001)) * projectedMi;
  return { projectedMi, projectedHmrc, dayOfMonth, daysInMonth };
}

function adminHoursSaved(monthlyJourneys) {
  // ~12 min admin per journey manually logged
  return Math.round((monthlyJourneys * 12) / 60 * 10) / 10;
}

function collectRoutePoints(shifts) {
  const points = [];
  shifts.forEach((s) => {
    const route = s.route || s.routePoints || [];
    route.forEach((p) => {
      const lat = p.lat ?? p.latitude;
      const lon = p.lon ?? p.longitude ?? p.lng;
      if (lat != null && lon != null) points.push({ lat: Number(lat), lon: Number(lon) });
    });
  });
  return points;
}
function generateReportId(report, a) {
  const raw = `${a.period}|${a.driver}|${new Date().toISOString().slice(0, 10)}|${a.totals.mi}`;
  const hash = createHash("sha256").update(raw).digest("hex").slice(0, 8).toUpperCase();
  const prefix = { Daily: "DY", Weekly: "WK", Monthly: "MO", Annual: "YR" }[a.period] || "RP";
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

  const weekLongest = longestShiftInList(weekShifts);
  const monthProgress = monthProgressFromWeek(weekTotals);
  const prevAvgJourney = prevTotals.journeys > 0 ? prevTotals.mi / prevTotals.journeys : 0;
  const journeyLengthChange =
    prevAvgJourney > 0 && avgMilesShift > 0 ? avgMilesShift - prevAvgJourney : null;

  const analysis = {
    totals,
    weekTotals,
    prevTotals,
    prevWeekTotals,
    shifts,
    weekShifts,
    driver: (report.driver || "").trim(),
    period: report.period || "Daily",
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
    weekLongest,
    monthProgress,
    journeyLengthChange,
    prevAvgJourney,
    weekEnding: getWeekEndingDate(),
    generatedAt,
    generatedAtTime,
  };

  analysis.reportId = generateReportId(report, analysis);
  return analysis;
}

export function buildIntelligence(a) {
  const {
    totals,
    weekTotals,
    shifts,
    weekShifts,
    longestJ,
    longest,
    productiveHour,
    prevTotals,
    prevWeekTotals,
    miDiff,
    period,
    weekComparePct,
    busiest,
    avgMilesShift,
    avgShiftSec,
    weekAvgShiftSec,
    weekLongest,
    monthProgress,
    journeyLengthChange,
    hmrcRate,
  } = a;

  const items = [];

  if (!shifts.length && !weekShifts.length) {
    return {
      empty: true,
      intro: period === "Daily" ? "Today was a quiet day on the road." : `This ${period.toLowerCase()} was quiet on the road.`,
      sub: "No business journeys were recorded.",
      footer: "Start a shift and MilePilot will build this report automatically.",
      items: [],
    };
  }

  if (weekLongest && weekShifts.length) {
    items.push(`Longest shift this week: ${fmtShiftTime(weekLongest.seconds)}`);
  } else if (longest) {
    items.push(`Longest shift: ${fmtShiftTime(longest.seconds)}`);
  }

  if (weekComparePct !== null && Math.abs(weekComparePct) >= 1) {
    items.push(
      `You drove ${Math.abs(weekComparePct)}% ${weekComparePct > 0 ? "more" : "fewer"} business miles this week than last week.`
    );
  } else if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.1) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 1) {
      const prevLabel = period === "Daily" ? "yesterday" : "the previous period";
      items.push(`You drove ${Math.abs(pct)}% ${pct > 0 ? "more" : "less"} than ${prevLabel}.`);
    }
  }

  if (busiest) {
    items.push(`${busiest.day} was your busiest day with ${busiest.miles.toFixed(1)} business miles.`);
  }

  if (productiveHour) {
    items.push(`Busiest hour: ${productiveHour.label} (${productiveHour.miles.toFixed(1)} miles).`);
  }

  if (weekAvgShiftSec > 0 && weekShifts.length >= 2) {
    items.push(`Average shift this week: ${fmtShiftTime(weekAvgShiftSec)}.`);
  } else if (avgShiftSec > 0 && shifts.length >= 2) {
    items.push(`Average shift: ${fmtShiftTime(avgShiftSec)}.`);
  }

  if (journeyLengthChange !== null && Math.abs(journeyLengthChange) >= 0.2) {
    const prev = a.prevAvgJourney.toFixed(1);
    const curr = avgMilesShift.toFixed(1);
    items.push(`Average journey length ${journeyLengthChange > 0 ? "increased" : "decreased"} from ${prev} to ${curr} miles.`);
  } else if (avgMilesShift > 0) {
    items.push(`Average journey: ${avgMilesShift.toFixed(1)} miles · ${fmtDurationShort(avgShiftSec)}.`);
  }

  if (longestJ) {
    items.push(`Longest journey: ${Number(longestJ.miles).toFixed(1)} miles (${fmtClock(longestJ.startISO)} – ${fmtClock(longestJ.endISO)}).`);
  }

  if (monthProgress && monthProgress.projectedHmrc > 0) {
    items.push(`On track to claim approximately ${money(monthProgress.projectedHmrc)} this month.`);
  } else if (weekTotals.hmrc > 0) {
    items.push(`This week's estimated HMRC claim: ${money(weekTotals.hmrc)}.`);
  } else if (totals.hmrc > 0) {
    items.push(`Estimated HMRC claim: ${money(totals.hmrc)} (${totals.mi.toFixed(1)} mi at ${Math.round(hmrcRate * 100)}p/mile).`);
  }

  if (weekTotals.mi > 0 && prevWeekTotals.mi > 0 && weekTotals.hmrc > prevWeekTotals.hmrc && weekTotals.mi < prevWeekTotals.mi) {
    items.push(`You drove fewer miles but earned ${money(weekTotals.hmrc - prevWeekTotals.hmrc)} more in allowances this week.`);
  }

  const yearProjection = weekTotals.mi > 0 ? (weekTotals.mi / 7) * 365 : totals.mi * 30;
  if (yearProjection >= 5000) {
    items.push(`At this pace, you're on track for ${Math.round(yearProjection).toLocaleString("en-GB")} business miles this year.`);
  }

  return { empty: false, intro: null, sub: null, footer: null, items: items.slice(0, 6) };
}

const PDF = {
  margin: 52,
  headerH: 118,
  greetH: 38,
  footerH: 96,
  cardRadius: 12,
  sectionGap: 20,
  cardGap: 12,
  metricCardH: 62,
  hmrcBoxH: 128,
  routeMapH: 100,
  wowBoxH: 118,
};

function pageContentW(pageW) {
  return pageW - PDF.margin * 2;
}

function footerTop(pageH) {
  return pageH - PDF.footerH;
}

function headerBottom(a) {
  return PDF.headerH + (a.driver ? PDF.greetH : 0);
}

function drawPageContentBg(doc, pageW, pageH, a) {
  const top = headerBottom(a);
  doc.rect(0, top, pageW, footerTop(pageH) - top).fill(BRAND.pageBg);
}

function fitFontSize(doc, text, maxW, startSize, minSize, font = "Helvetica-Bold") {
  let size = startSize;
  doc.font(font);
  while (size > minSize && doc.widthOfString(text) > maxW) size -= 1;
  return size;
}

function ensureSpace(doc, y, needed, margin, contentW, pageW, a) {
  if (y + needed <= footerTop(doc.page.height) - 8) return y;
  drawFooter(doc, a, margin, contentW, pageW);
  doc.addPage({ margin: 0 });
  const y0 = drawPageHeader(doc, a, margin, contentW, pageW);
  drawPageContentBg(doc, pageW, doc.page.height, a);
  return y0 + PDF.sectionGap;
}

function drawFooter(doc, a, margin, contentW, pageW) {
  const footY = footerTop(doc.page.height);
  doc.rect(0, footY - 16, pageW, PDF.footerH + 16).fill(BRAND.navy);
  drawBrandPulse(doc, margin + contentW / 2 - 80, footY - 6, 160);
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(7.5).text("Generated automatically by MilePilot", margin, footY + 6, { width: contentW, align: "center" });
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(9).text(BRAND_TAGLINE, margin, footY + 18, { width: contentW, align: "center" });
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(7.5).text("Professional mileage reporting for drivers and couriers.", margin, footY + 32, { width: contentW, align: "center" });
  doc.fillColor("#6EB4FF").font("Helvetica-Bold").fontSize(8).text(SITE_URL, margin, footY + 44, { width: contentW, align: "center", link: `https://${SITE_URL}` });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(6.5).text(`${a.generatedAt} at ${a.generatedAtTime}  ·  Report ID ${a.reportId}`, margin, footY + 58, { width: contentW, align: "center" });
  doc.text("Estimates are for record keeping only and should be checked against official guidance or an accountant.", margin, footY + 70, { width: contentW, align: "center", lineGap: 0.8 });
  doc.fillColor("#4A6080").font("Helvetica").fontSize(6).text(REPORT_VERSION, margin, footY + 84, { width: contentW, align: "center" });
}

/** Solid brand pulse — matches app `.brand-pulse` */
function drawBrandPulse(doc, x, y, width = BRAND_PULSE_WIDTH) {
  const h = 2;
  doc.rect(x, y, width * 0.28, h).fill("#0A52D4");
  doc.rect(x + width * 0.28, y, width * 0.44, h).fill("#7EC0FF");
  doc.rect(x + width * 0.72, y, width * 0.28, h).fill("#0A52D4");
}

function drawPageHeader(doc, a, margin, contentW, pageW) {
  doc.rect(0, 0, pageW, PDF.headerH).fill(BRAND.navy);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(BRAND_WORDMARK_SIZE).text("Mile ", margin, 22, { continued: true, lineBreak: false });
  doc.fillColor(BRAND.blue).text("Pilot", { lineBreak: false });
  drawBrandPulse(doc, margin, 62, BRAND_PULSE_WIDTH);
  doc.fillColor("#6EB4FF").font("Helvetica-Bold").fontSize(10).text(BRAND_TAGLINE, margin, 74, { characterSpacing: 1.1 });
  const rightX = pageW - margin - 220;
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(9).text(periodReportTitle(a.period).toUpperCase(), rightX, 24, { width: 220, align: "right", characterSpacing: 0.5 });
  doc.fillColor(BRAND.soft).font("Helvetica").fontSize(8.5).text(a.generatedAt, rightX, 42, { width: 220, align: "right" });

  let y = PDF.headerH;
  if (a.driver) {
    doc.rect(0, y, pageW, PDF.greetH).fill(BRAND.panel);
    const name = firstName(a.driver) || a.driver;
    doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(11).text(`${timeGreeting()} ${name},`, margin, y + 9);
    doc.fillColor(BRAND.soft).font("Helvetica").fontSize(9).text(periodSummaryLine(a.period, fmtDateShort()), margin, y + 24, { width: contentW });
    y += PDF.greetH;
  }
  return y + 12;
}

/** Blue accent summary stat card */
function drawMetricCard(doc, x, y, w, h, label, value, accent = true) {
  const pad = 14;
  const labelH = 14;
  const valueAreaH = h - pad * 2 - labelH;

  if (accent) {
    doc.roundedRect(x, y, w, h, PDF.cardRadius).fillAndStroke(BRAND.blue, BRAND.blueDark);
    doc.fillColor("#B9D4FF").font("Helvetica-Bold").fontSize(7).text(label.toUpperCase(), x + pad, y + pad, {
      width: w - pad * 2,
      characterSpacing: 0.6,
      height: labelH,
    });
    const valStr = String(value);
    const valSize = fitFontSize(doc, valStr, w - pad * 2, 16, 11);
    doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(valSize).text(valStr, x + pad, y + pad + labelH + 4, {
      width: w - pad * 2,
      height: valueAreaH,
      lineBreak: false,
      ellipsis: true,
    });
  } else {
    doc.roundedRect(x, y, w, h, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(7).text(label.toUpperCase(), x + pad, y + pad, {
      width: w - pad * 2,
      characterSpacing: 0.6,
      height: labelH,
    });
    const valStr = String(value);
    const valSize = fitFontSize(doc, valStr, w - pad * 2, 16, 11);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(valSize).text(valStr, x + pad, y + pad + labelH + 4, {
      width: w - pad * 2,
      height: valueAreaH,
      lineBreak: false,
      ellipsis: true,
    });
  }
}

/** White hero card with centred business miles — ~18% smaller than v2 */
function drawHeroMiles(doc, a, margin, contentW, y) {
  const heroH = 108;
  const pad = 20;
  doc.roundedRect(margin, y, contentW, heroH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);

  const miStr = a.totals.mi.toFixed(1);
  const innerY = y + pad;

  doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8.5).text("BUSINESS MILES", margin + pad, innerY, {
    width: contentW - pad * 2,
    align: "center",
    characterSpacing: 1.3,
  });

  const miSize = fitFontSize(doc, miStr, contentW - 60, miStr.length > 7 ? 58 : miStr.length > 5 ? 72 : 78, 40);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(miSize).text(miStr, margin + pad, innerY + 22, {
    width: contentW - pad * 2,
    align: "center",
    lineBreak: false,
  });

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11).text("miles", margin + pad, innerY + 22 + miSize + 4, {
    width: contentW - pad * 2,
    align: "center",
  });

  return y + heroH;
}

/** Two-column HMRC Summary — value in dedicated right column box */
function drawHmrcSummaryBox(doc, a, margin, contentW, y) {
  const boxH = PDF.hmrcBoxH;
  const leftW = Math.floor(contentW * 0.52);
  const rightW = contentW - leftW - 16;
  const rightX = margin + leftW + 16;
  const pad = 18;
  const hmrcVal = money(a.totals.hmrc);

  doc.roundedRect(margin, y, contentW, boxH, 14).fillAndStroke("#EEF4FF", BRAND.blue);

  // Left column
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text("HMRC Summary", margin + pad, y + pad, {
    width: leftW - pad * 2,
    lineGap: 0,
  });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9);
  doc.text(`Current HMRC rate: ${Math.round(a.hmrcRate * 100)}p per mile`, margin + pad, y + pad + 22, { width: leftW - pad * 2 });
  doc.text(`Business miles: ${a.totals.mi.toFixed(1)}`, margin + pad, y + pad + 36, { width: leftW - pad * 2 });
  doc.fontSize(7.5).text(
    "Estimates for record keeping only. Verify against official HMRC guidance before filing.",
    margin + pad,
    y + boxH - pad - 22,
    { width: leftW - pad, lineGap: 1.2 }
  );

  // Right column — label + dedicated value box (value never overlaps left column)
  const labelH = 18;
  const valueBoxY = y + pad + labelH + 4;
  const valueBoxH = boxH - pad * 2 - labelH - 4;
  doc.roundedRect(rightX, y + pad, rightW, boxH - pad * 2, 10).fillAndStroke("#FFFFFF", BRAND.border);

  doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(7).text("ESTIMATED MILEAGE ALLOWANCE", rightX + 12, y + pad + 10, {
    width: rightW - 24,
    align: "center",
    characterSpacing: 0.4,
    lineGap: 0,
    height: labelH,
  });

  const valSize = fitFontSize(doc, hmrcVal, rightW - 28, hmrcVal.length > 9 ? 22 : hmrcVal.length > 7 ? 26 : 30, 14);
  const valueAreaTop = valueBoxY + 6;
  const valueAreaH = valueBoxH - 12;
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(valSize).text(hmrcVal, rightX + 12, valueAreaTop + (valueAreaH - valSize) / 2, {
    width: rightW - 24,
    align: "center",
    lineBreak: false,
    height: valueAreaH,
  });

  return y + boxH + PDF.sectionGap;
}

function drawWeekProgress(doc, a, margin, contentW, y) {
  const boxH = 72;
  const targetMi = Math.max(a.weekTotals.mi, a.prevWeekTotals.mi, 50);
  const pct = targetMi > 0 ? a.weekTotals.mi / targetMi : 0;

  doc.roundedRect(margin, y, contentW, boxH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text("This Week", margin + 16, y + 14);
  drawProgressBar(doc, margin + 16, y + 34, contentW - 32, 10, pct);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text(`${a.weekTotals.mi.toFixed(1)} miles`, margin + 16, y + 50);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(
    `${a.weekTotals.journeys} shift${a.weekTotals.journeys === 1 ? "" : "s"}  ·  ${fmtShiftTime(a.weekTotals.sec)}`,
    margin + 16 + doc.widthOfString(`${a.weekTotals.mi.toFixed(1)} miles`) + 12,
    y + 51
  );
  if (a.weekComparePct !== null) {
    doc.fillColor(a.weekComparePct >= 0 ? BRAND.green : BRAND.muted).font("Helvetica-Bold").fontSize(8).text(
      `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}% vs last week`,
      margin + contentW - 16,
      y + 16,
      { width: 100, align: "right" }
    );
  }
  return y + boxH;
}

function drawWowMoment(doc, a, margin, contentW, y) {
  const boxH = PDF.wowBoxH;
  const isWeekly = a.period === "Weekly" || a.period === "Monthly";
  const label = isWeekly ? (a.period === "Monthly" ? "This Month" : "This Week") : "This Week";
  const mi = isWeekly && a.period === "Monthly" ? a.totals.mi : a.weekTotals.mi;
  const hmrc = isWeekly && a.period === "Monthly" ? a.totals.hmrc : a.weekTotals.hmrc;
  const journeys = isWeekly && a.period === "Monthly" ? a.totals.journeys : a.weekTotals.journeys;
  const adminH = adminHoursSaved(journeys * 4);

  doc.roundedRect(margin, y, contentW, boxH, PDF.cardRadius).fillAndStroke(BRAND.navy, BRAND.blue);
  drawBrandPulse(doc, margin + 16, y + 14, contentW - 32);
  doc.fillColor(BRAND.soft).font("Helvetica-Bold").fontSize(9).text(label.toUpperCase(), margin + 20, y + 24, { characterSpacing: 1.2 });

  const colW = (contentW - 48) / 2;
  doc.fillColor("#8EB8FF").font("Helvetica").fontSize(8).text("Business miles", margin + 20, y + 46);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(22).text(mi.toFixed(1), margin + 20, y + 58);

  doc.fillColor("#8EB8FF").font("Helvetica").fontSize(8).text("Estimated HMRC claim", margin + 20 + colW, y + 46);
  const hmrcStr = money(hmrc);
  const hmrcSize = fitFontSize(doc, hmrcStr, colW - 10, 22, 14);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(hmrcSize).text(hmrcStr, margin + 20 + colW, y + 58, { width: colW - 10 });

  if (adminH >= 1) {
    doc.fillColor(BRAND.soft).font("Helvetica").fontSize(9).text(
      `You're saving approximately ${adminH} hour${adminH === 1 ? "" : "s"} of admin every month.`,
      margin + 20,
      y + 90,
      { width: contentW - 40, align: "center" }
    );
  }
  return y + boxH;
}

function drawPlaceholderRoute(doc, x, y, w, h) {
  const cy = y + h / 2 + 8;
  const x1 = x + 24;
  const x2 = x + w / 2;
  const x3 = x + w - 24;
  doc.moveTo(x1, cy).lineTo(x2, cy - 12).lineTo(x3, cy).strokeColor(BRAND.blue).lineWidth(2.5).stroke();
  [x1, x2, x3].forEach((px) => {
    doc.circle(px, px === x2 ? cy - 12 : cy, 4).fill(BRAND.blue);
    doc.circle(px, px === x2 ? cy - 12 : cy, 2).fill(BRAND.white);
  });
}

function drawRouteMap(doc, shifts, margin, contentW, y, title = "Today's Route") {
  const boxH = PDF.routeMapH;
  doc.roundedRect(margin, y, contentW, boxH, PDF.cardRadius).fillAndStroke(BRAND.panel, BRAND.blue);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(10).text(title, margin + 16, y + 12);

  const points = collectRoutePoints(shifts);
  const mapPad = 16;
  const mapX = margin + mapPad;
  const mapY = y + 30;
  const mapW = contentW - mapPad * 2;
  const mapH = boxH - 42;

  if (points.length < 2) {
    drawPlaceholderRoute(doc, mapX, mapY - 8, mapW, mapH + 16);
    doc.fillColor(BRAND.soft).font("Helvetica").fontSize(7.5).text("Route map appears when GPS tracking is active.", margin + 16, y + boxH - 14);
    return y + boxH;
  }

  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latRange = maxLat - minLat || 0.001;
  const lonRange = maxLon - minLon || 0.001;

  const toX = (lon) => mapX + ((lon - minLon) / lonRange) * mapW;
  const toY = (lat) => mapY + mapH - ((lat - minLat) / latRange) * mapH;

  doc.save();
  doc.roundedRect(mapX, mapY, mapW, mapH, 8).clip();
  doc.rect(mapX, mapY, mapW, mapH).fill("#061A35");

  doc.moveTo(toX(points[0].lon), toY(points[0].lat));
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(toX(points[i].lon), toY(points[i].lat));
  }
  doc.strokeColor(BRAND.blue).lineWidth(2.5).lineJoin("round").lineCap("round").stroke();

  doc.circle(toX(points[0].lon), toY(points[0].lat), 4).fill(BRAND.green);
  doc.circle(toX(points[points.length - 1].lon), toY(points[points.length - 1].lat), 4).fill(BRAND.blue);
  doc.restore();

  return y + boxH;
}

function drawInsightChecklist(doc, intel, margin, contentW, y) {
  if (intel.empty) {
    return drawIntelligenceEmpty(doc, intel, margin, contentW, y);
  }
  const rowH = 22;
  const boxH = intel.items.length * rowH + 28;
  doc.roundedRect(margin, y, contentW, boxH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
  let iy = y + 14;
  intel.items.forEach((text) => {
    doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(10).text("✓", margin + 16, iy + 1);
    doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(text, margin + 32, iy, { width: contentW - 48, lineGap: 0.8 });
    iy += rowH;
  });
  return y + boxH;
}

function drawJourneyEmptyState(doc, margin, contentW, y) {
  const boxH = 72;
  doc.roundedRect(margin, y, contentW, boxH, 12).fillAndStroke(BRAND.white, BRAND.border);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text("No journeys recorded in this period.", margin + 20, y + 18, {
    width: contentW - 40,
  });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9.5).text(
    "Start a shift and MilePilot will build this report automatically.",
    margin + 20,
    y + 38,
    { width: contentW - 40, lineGap: 1.2 }
  );
  return y + boxH;
}

function drawSectionTitle(doc, title, subtitle, margin, y, contentW) {
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text(title, margin, y, { width: contentW });
  if (subtitle) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(subtitle, margin, y + 20, { width: contentW });
    return y + 40;
  }
  return y + 24;
}

function drawIntelligenceEmpty(doc, intel, margin, contentW, y) {
  const boxH = 88;
  doc.roundedRect(margin, y, contentW, boxH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(intel.intro, margin + 20, y + 18, { width: contentW - 40 });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(intel.sub, margin + 20, y + 38, { width: contentW - 40 });
  doc.text(intel.footer, margin + 20, y + 58, { width: contentW - 40, lineGap: 2 });
  return y + boxH;
}

function drawWeeklyDashboard(doc, a, margin, contentW, y, pageW) {
  const stats = [
    ["Weekly mileage", a.weekTotals.mi > 0 ? `${a.weekTotals.mi.toFixed(1)} mi` : "—"],
    ["Estimated HMRC", money(a.weekTotals.hmrc)],
    ["Average journey", a.weekAvgShiftSec > 0 && a.weekTotals.journeys ? `${(a.weekTotals.mi / a.weekTotals.journeys).toFixed(1)} mi` : "—"],
    ["Longest shift", a.weekLongest ? fmtShiftTime(a.weekLongest.seconds) : "—"],
    ["Number of journeys", String(a.weekTotals.journeys)],
    ["Best day", a.busiest ? `${a.busiest.day} · ${a.busiest.miles.toFixed(1)} mi` : "—"],
    ["Busiest hour", a.productiveHour ? a.productiveHour.label : "—"],
    [
      "Trend vs last week",
      a.weekComparePct !== null ? `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}% business miles` : "—",
    ],
    ["Average miles / day", a.weekAvgMilesDay > 0 ? `${a.weekAvgMilesDay.toFixed(1)} mi` : "—"],
    ["Total driving time", a.weekTotals.sec > 0 ? fmtShiftTime(a.weekTotals.sec) : "—"],
  ];

  const statsBoxH = stats.length * 26 + 28;
  y = ensureSpace(doc, y, statsBoxH + PDF.routeMapH + 40, margin, contentW, pageW, a);
  doc.roundedRect(margin, y, contentW, statsBoxH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text("Weekly Dashboard", margin + 18, y + 14);
  let sy = y + 34;
  stats.forEach(([label, val]) => {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(label, margin + 18, sy);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, sy, { width: contentW / 2 - 24, align: "right" });
    sy += 26;
  });
  y += statsBoxH + PDF.sectionGap;

  y = ensureSpace(doc, y, PDF.routeMapH + 20, margin, contentW, pageW, a);
  y = drawRouteMap(doc, a.weekShifts.length ? a.weekShifts : a.shifts, margin, contentW, y, "Weekly Route");
  return y + PDF.sectionGap;
}

function drawJourneyTable(doc, a, margin, contentW, y, pageW) {
  const rowH = 26;
  const cols = {
    date: { x: margin + 10, w: 52 },
    start: { x: margin + 68, w: 44 },
    finish: { x: margin + 118, w: 44 },
    miles: { x: margin + 168, w: 48 },
    duration: { x: margin + 222, w: contentW - 234 },
  };

  const drawTableHeader = (startY) => {
    doc.roundedRect(margin, startY, contentW, 26, 6).fill(BRAND.navy);
    const headers = [
      { label: "Date", col: cols.date },
      { label: "Start", col: cols.start },
      { label: "Finish", col: cols.finish },
      { label: "Miles", col: cols.miles },
      { label: "Duration", col: cols.duration },
    ];
    headers.forEach(({ label, col }) => {
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(7.5).text(label.toUpperCase(), col.x, startY + 9, {
        width: col.w,
        characterSpacing: 0.5,
      });
    });
    return startY + 26;
  };

  if (!a.shifts.length) {
    return drawJourneyEmptyState(doc, margin, contentW, y);
  }

  y = drawTableHeader(y);
  a.shifts.forEach((s, idx) => {
    if (y + rowH > footerTop(doc.page.height) - PDF.footerH) {
      drawFooter(doc, a, margin, contentW, pageW);
      doc.addPage({ margin: 0 });
      y = drawPageHeader(doc, a, margin, contentW, pageW);
      drawPageContentBg(doc, pageW, doc.page.height, a);
      y += PDF.sectionGap;
      y = drawSectionTitle(doc, "Journey Breakdown", "Professional record for your accountant", margin, y, contentW);
      y = drawTableHeader(y);
    }
    doc.rect(margin, y, contentW, rowH).fill(idx % 2 === 0 ? BRAND.white : BRAND.light);
    const d = new Date(s.startISO);
    doc.fillColor(BRAND.text).font("Helvetica").fontSize(8.5);
    doc.text(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), cols.date.x, y + 9, { width: cols.date.w });
    doc.text(fmtClock(s.startISO), cols.start.x, y + 9, { width: cols.start.w });
    doc.text(fmtClock(s.endISO), cols.finish.x, y + 9, { width: cols.finish.w });
    doc.font("Helvetica-Bold").text(Number(s.miles || 0).toFixed(1), cols.miles.x, y + 9, { width: cols.miles.w });
    doc.font("Helvetica").text(fmtDurationShort(s.seconds), cols.duration.x, y + 9, { width: cols.duration.w, align: "right" });
    y += rowH;
  });
  return y + PDF.sectionGap;
}

function drawProgressBar(doc, x, y, w, h, pct) {
  doc.roundedRect(x, y, w, h, h / 2).fill("#EEF2F8");
  const fillW = Math.max(h, w * Math.min(Math.max(pct, 0), 1));
  if (fillW > h) doc.roundedRect(x, y, fillW, h, h / 2).fill(BRAND.blue);
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
    const pageH = doc.page.height;
    const margin = PDF.margin;
    const contentW = pageContentW(pageW);

    // ── PAGE 1: Branded hero dashboard ──
    let y = drawPageHeader(doc, a, margin, contentW, pageW);
    drawPageContentBg(doc, pageW, pageH, a);

    y = drawHeroMiles(doc, a, margin, contentW, y);
    y += PDF.cardGap;

    const cardW = (contentW - PDF.cardGap) / 2;
    const cardH = PDF.metricCardH;
    const summaryCards = [
      { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
      { label: "Business Journeys", value: String(a.totals.journeys) },
      { label: "Estimated HMRC Claim", value: money(a.totals.hmrc) },
      { label: "Average Miles / Journey", value: a.avgMilesShift > 0 ? `${a.avgMilesShift.toFixed(1)} mi` : "—" },
    ];
    summaryCards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      drawMetricCard(doc, margin + col * (cardW + PDF.cardGap), y + row * (cardH + PDF.cardGap), cardW, cardH, c.label, c.value, true);
    });
    y += 2 * (cardH + PDF.cardGap) + PDF.sectionGap;

    y = ensureSpace(doc, y, 80, margin, contentW, pageW, a);
    y = drawWeekProgress(doc, a, margin, contentW, y);
    y += PDF.sectionGap;

    y = ensureSpace(doc, y, 80, margin, contentW, pageW, a);
    y = drawSectionTitle(doc, "MilePilot Insights", "What your driving data tells us", margin, y, contentW);
    y = drawInsightChecklist(doc, intel, margin, contentW, y);
    y += PDF.sectionGap;

    y = ensureSpace(doc, y, PDF.wowBoxH, margin, contentW, pageW, a);
    y = drawWowMoment(doc, a, margin, contentW, y);

    drawFooter(doc, a, margin, contentW, pageW);

    // ── PAGE 2: Route map + journey table + HMRC ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    drawPageContentBg(doc, pageW, pageH, a);

    const routeTitle = a.period === "Daily" ? "Today's Route" : a.period === "Weekly" ? "This Week's Routes" : "Period Routes";
    y = drawRouteMap(doc, a.shifts, margin, contentW, y, routeTitle);
    y += PDF.sectionGap;

    y = drawSectionTitle(doc, "Journey Breakdown", "Professional record for your accountant", margin, y, contentW);
    y = drawJourneyTable(doc, a, margin, contentW, y, pageW);

    y = ensureSpace(doc, y, PDF.hmrcBoxH + PDF.sectionGap, margin, contentW, pageW, a);
    y = drawHmrcSummaryBox(doc, a, margin, contentW, y);

    drawFooter(doc, a, margin, contentW, pageW);

    // ── PAGE 3: Weekly dashboard ──
    doc.addPage({ margin: 0 });
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    drawPageContentBg(doc, pageW, pageH, a);
    y = drawSectionTitle(doc, "Weekly Performance", `Week ending ${a.weekEnding}`, margin, y, contentW);

    const maxDayMi = Math.max(...a.dailyActivity.map((d) => d.miles), 1);
    doc.roundedRect(margin, y, contentW, 7 * 22 + 20, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
    let dy = y + 12;
    a.dailyActivity.slice(0, 7).forEach((d) => {
      doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(d.day.slice(0, 3), margin + 14, dy + 3, { width: 36 });
      drawProgressBar(doc, margin + 56, dy + 4, contentW - 110, 8, d.miles / maxDayMi);
      doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text(d.miles > 0 ? `${d.miles.toFixed(1)} mi` : "—", margin + contentW - 50, dy + 2, { width: 40, align: "right" });
      dy += 22;
    });
    y = dy + 16;

    if (a.period === "Weekly") {
      y = drawWeeklyDashboard(doc, a, margin, contentW, y, pageW);
    } else {
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
      const statsBoxH = stats.length * 28 + 24;
      y = ensureSpace(doc, y, statsBoxH, margin, contentW, pageW, a);
      doc.roundedRect(margin, y, contentW, statsBoxH, PDF.cardRadius).fillAndStroke(BRAND.white, BRAND.border);
      let sy = y + 16;
      stats.forEach(([label, val]) => {
        doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(label, margin + 18, sy);
        doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(val, margin + contentW / 2, sy, { width: contentW / 2 - 24, align: "right" });
        sy += 28;
      });
      y += statsBoxH + PDF.sectionGap;
      y = drawRouteMap(doc, a.weekShifts.length ? a.weekShifts : a.shifts, margin, contentW, y, "Weekly Route");
    }

    drawFooter(doc, a, margin, contentW, pageW);
    doc.end();
  });
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const greeting = timeGreeting();
  const ready = periodReadyLine(a.period);

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
    ${metric("Driving Time", fmtShiftTime(a.totals.sec))}
    ${metric("Journeys", String(a.totals.journeys))}
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

${periodReadyLine(a.period)}

Business Miles: ${a.totals.mi.toFixed(1)}
Driving Time: ${fmtShiftTime(a.totals.sec)}
Journeys: ${a.totals.journeys}
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
  const emoji = period === "Weekly" ? "📊 " : period === "Daily" ? "🚗 " : "";
  return `${emoji}Your MilePilot ${periodReportTitle(period)}`;
}
