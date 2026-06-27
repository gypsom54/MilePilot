/**
 * MilePilot Report Engine — MP-012 Premium Document v8
 * Brand dashboard · navy cards · wallet journeys · QR verify
 */

import PDFDocument from "pdfkit";
import QRCode from "qrcode";
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
  greenDark: "#059669",
  amber: "#F59E0B",
  red: "#EF4444",
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

export const REPORT_VERSION = "MP-012-pdf-v8";
const APP_URL = "https://app.milepilot.uk";
const API_URL = "https://milepilot-production.up.railway.app";
const SITE_URL = "www.milepilot.uk";

export function buildVerifyUrl(reportId) {
  return `${API_URL}/reports/verify/${encodeURIComponent(reportId)}`;
}

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
  const n = Number(v || 0);
  return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMi(v) {
  return Number(v || 0).toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function trendColor(pct) {
  if (pct === null || pct === 0) return BRAND.blue;
  if (pct > 0) return BRAND.blue;
  return BRAND.red;
}

function trendLabel(pct) {
  if (pct === null) return null;
  return `${pct > 0 ? "+" : ""}${pct}%`;
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

function periodDocTitle(period) {
  const map = {
    Daily: "Daily Business Summary",
    Weekly: "Weekly Business Summary",
    Monthly: "Monthly Business Summary",
    Annual: "Annual Business Summary",
  };
  return map[period] || "Business Mileage Summary";
}

function periodEmailHeadline(period) {
  const map = {
    Daily: "Your Daily Business Mileage Report is Ready",
    Weekly: "Your Weekly Business Mileage Report is Ready",
    Monthly: "Your Monthly Business Mileage Report is Ready",
    Annual: "Your Annual Business Mileage Report is Ready",
  };
  return map[period] || "Your Business Mileage Report is Ready";
}

function periodEmailBody(period) {
  const map = {
    Daily: "We've finished preparing today's mileage report.",
    Weekly: "We've finished preparing this week's mileage report.",
    Monthly: "We've finished preparing this month's mileage report.",
    Annual: "We've finished preparing your annual mileage report.",
  };
  return map[period] || "We've finished preparing your mileage report.";
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

function adminHoursSaved(journeyCount) {
  return Math.round((journeyCount * 12) / 60 * 10) / 10;
}

function periodHeroLabel(period) {
  const map = { Daily: "Today's Business Miles", Weekly: "This Week's Business Miles", Monthly: "This Month's Business Miles", Annual: "Annual Business Miles" };
  return map[period] || "Business Miles";
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
    vehicle: primaryVehicle(shifts.length ? shifts : weekShifts),
  };

  analysis.reportId = generateReportId(report, analysis);
  return analysis;
}

function periodCoverTitle(period) {
  const map = {
    Daily: "Daily Driving Report",
    Weekly: "Weekly Driving Report",
    Monthly: "Monthly Driving Report",
    Annual: "Annual Driving Report",
  };
  return map[period] || "Business Driving Report";
}

function periodPraise(period, name) {
  const n = name ? `, ${name}` : "";
  const map = {
    Daily: `Great work today${n}.`,
    Weekly: `Great week${n}.`,
    Monthly: `Strong month${n}.`,
    Annual: `Excellent year${n}.`,
  };
  return map[period] || `Well done${n}.`;
}

function periodSummaryQuote(a) {
  const { totals, period, shifts } = a;
  const name = firstName(a.driver);
  if (!shifts.length) {
    return name
      ? `"No business journeys recorded yet today, ${name}. MilePilot is ready when you are."`
      : '"No business journeys recorded in this period. MilePilot is ready when you are."';
  }
  const when =
    period === "Daily" ? "today" : period === "Weekly" ? "this week" : `this ${period.toLowerCase()}`;
  return `"You completed ${totals.journeys} business ${totals.journeys === 1 ? "journey" : "journeys"} ${when} covering ${fmtMi(totals.mi)} miles."`;
}

function periodMileageLine(a) {
  const { totals, period, shifts } = a;
  if (!shifts.length) return "No business journeys recorded in this period.";
  const when =
    period === "Daily" ? "today" : period === "Weekly" ? "this week" : `this ${period.toLowerCase()}`;
  return `You completed ${totals.journeys} business ${totals.journeys === 1 ? "journey" : "journeys"} covering ${fmtMi(totals.mi)} miles ${when}.`;
}

function reportingPeriodLabel(a) {
  if (a.period === "Daily") return a.generatedAt.split(",").slice(0, 2).join(",");
  if (a.period === "Weekly") return `Week ending ${a.weekEnding}`;
  return a.generatedAt;
}

export function buildIntelligence(a) {
  const {
    totals, weekTotals, shifts, prevTotals, miDiff, period, weekComparePct, monthProgress, avgMilesShift, busiest,
  } = a;
  const name = firstName(a.driver);
  const coach = { headline: "", paragraphs: [], hmrcHighlight: null, closing: "Keep it up." };

  if (!shifts.length) {
    coach.headline = name ? `Ready when you are, ${name}.` : "Ready when you are.";
    coach.paragraphs = [
      period === "Daily" ? "No business journeys were recorded today." : `No business journeys were recorded this ${period.toLowerCase()}.`,
      `Your weekly mileage currently stands at ${fmtMi(weekTotals.mi)} miles.`,
      `Your estimated HMRC allowance this week is ${money(weekTotals.hmrc)}.`,
      "When you start your next shift, MilePilot will automatically continue tracking every business mile.",
    ];
    if (monthProgress?.projectedHmrc > 0) {
      coach.hmrcHighlight = `At this pace you're on track to claim approximately ${money(monthProgress.projectedHmrc)} this month.`;
    }
    coach.closing = "We'll have your next report ready when you hit the road.";
    return { coach, empty: true };
  }

  coach.headline = period === "Daily" ? "Excellent day." : period === "Weekly" ? "Excellent week." : "Strong period on the road.";
  coach.paragraphs.push(
    `You completed ${totals.journeys} business ${totals.journeys === 1 ? "journey" : "journeys"} covering ${fmtMi(totals.mi)} miles.`
  );

  if (avgMilesShift > 0 && shifts.length >= 1) {
    coach.paragraphs.push(`Your average journey was ${fmtMi(avgMilesShift)} miles.`);
  }

  if (totals.hmrc > 0) {
    coach.hmrcHighlight = `Your HMRC allowance is approximately ${money(totals.hmrc)}.`;
  }

  if (busiest && busiest.miles > 0) {
    coach.paragraphs.push(`${busiest.day} was your busiest day this week.`);
  }

  if (prevTotals.mi > 0 && Math.abs(miDiff) >= 0.1) {
    const pct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
    if (Math.abs(pct) >= 1) {
      const prevLabel = period === "Daily" ? "yesterday" : "the previous period";
      const dir = pct > 0 ? "increased" : "decreased";
      coach.paragraphs.push(`Compared with ${prevLabel}, your mileage ${dir} ${Math.abs(pct)}%.`);
    }
  }

  if (weekComparePct !== null && Math.abs(weekComparePct) >= 1 && period === "Daily") {
    const dir = weekComparePct > 0 ? "increased" : "decreased";
    coach.paragraphs.push(`Compared to last week, your weekly mileage ${dir} by ${Math.abs(weekComparePct)}%.`);
  }

  if (monthProgress?.projectedMi > 0 && a.prevTotals.mi > 0) {
    const monthPct = Math.round((monthProgress.projectedMi / Math.max(a.prevTotals.mi * 4, 1) - 1) * 100);
    if (Math.abs(monthPct) >= 5) {
      const dir = monthPct > 0 ? "exceed" : "fall short of";
      coach.paragraphs.push(`At your current pace you'll ${dir} last month's mileage by approximately ${Math.abs(monthPct)}%.`);
    }
  }

  if (monthProgress?.projectedHmrc > 0 && !coach.hmrcHighlight) {
    coach.hmrcHighlight = `At this pace you're on track to claim approximately ${money(monthProgress.projectedHmrc)} this month.`;
  }

  return { coach, empty: false };
}

export function buildAiSummary(a) {
  const name = firstName(a.driver) || "there";
  const wt = a.weekTotals;
  const productive = wt.journeys > 0 && wt.mi > 0;

  const summary = {
    greeting: `${name},`,
    opening: productive ? "You've had a productive week." : "Here's your weekly summary.",
    body: [],
    hmrcValue: money(wt.hmrc),
    closing: productive ? "You're building an excellent mileage record." : "Start a shift and MilePilot will build your record automatically.",
  };

  if (wt.journeys > 0) {
    summary.opening = productive ? "Excellent week." : summary.opening;
    summary.body.push(`You drove ${fmtMi(wt.mi)} miles across ${wt.journeys} ${wt.journeys === 1 ? "journey" : "journeys"}.`);
  } else {
    summary.body.push("No business journeys were recorded this week.");
  }

  if (a.busiest) summary.body.push(`${a.busiest.day} was your busiest day.`);
  if (a.weekAvgMilesDay > 0 && wt.journeys >= 2) {
    summary.body.push(`You're averaging ${fmtMi(wt.journeys ? wt.mi / wt.journeys : 0)} miles per journey.`);
  }
  if (a.weekComparePct !== null && Math.abs(a.weekComparePct) >= 1) {
    const dir = a.weekComparePct > 0 ? "increased" : "decreased";
    summary.body.push(`Compared to last week, your mileage ${dir} by ${Math.abs(a.weekComparePct)}%.`);
  }
  if (a.monthProgress?.projectedHmrc > 0) {
    summary.body.push(`At your current pace you'll claim approximately ${money(a.monthProgress.projectedHmrc)} this month.`);
  }

  return summary;
}

const PDF = {
  margin: 56,
  headerH: 52,
  footerH: 72,
  unit: 8,
  sectionGap: 28,
  pagePad: 28,
  cardFill: "#EEF4FF",
  cardStroke: "#C8DAF5",
};

async function generateQrBuffer(url) {
  return QRCode.toBuffer(url, {
    width: 140,
    margin: 1,
    color: { dark: "#031126", light: "#FFFFFF" },
  });
}

function pageContentW(pageW) {
  return pageW - PDF.margin * 2;
}

function footerTop(pageH) {
  return pageH - PDF.footerH;
}

function fitFontSize(doc, text, maxW, startSize, minSize, font = "Helvetica-Bold") {
  let size = startSize;
  doc.font(font);
  while (size > minSize && doc.widthOfString(text) > maxW) size -= 1;
  return size;
}

function drawDivider(doc, margin, y, contentW, accent = true, full = true) {
  const w = full ? contentW : contentW * 0.35;
  const x = full ? margin : margin + (contentW - w) / 2;
  doc.moveTo(x, y).lineTo(x + w, y).strokeColor(accent ? BRAND.blue : BRAND.border).lineWidth(accent ? 0.9 : 0.4).stroke();
  return y + PDF.unit * 3;
}

function drawRouteDots(doc, margin, y, contentW) {
  const n = 5;
  const gap = contentW / (n + 1);
  for (let i = 1; i <= n; i++) {
    const cx = margin + gap * i;
    doc.circle(cx, y, 2).fill(i === 3 ? BRAND.blue : "#DDE6F2");
    if (i < n) doc.moveTo(cx + 3, y).lineTo(margin + gap * (i + 1) - 3, y).strokeColor("#DDE6F2").lineWidth(0.5).stroke();
  }
  return y + PDF.unit * 2;
}

function drawPageWatermark(doc, pageW, pageH) {
  doc.save();
  doc.opacity(0.028);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(80).text("MilePilot", pageW / 2 - 130, pageH / 2 - 44, { lineBreak: false });
  doc.restore();
  doc.save().opacity(0.05);
  drawRouteDots(doc, PDF.margin, pageH - 100, pageW - PDF.margin * 2);
  doc.restore();
}

function drawOutlineIcon(doc, type, x, y, size, color) {
  doc.save().lineWidth(0.9).strokeColor(color);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2 - 1;
  if (type === "miles") {
    doc.circle(cx, cy, r).stroke();
    doc.circle(cx, cy, 2).fill(color);
  } else if (type === "time") {
    doc.circle(cx, cy, r).stroke();
    doc.moveTo(cx, cy).lineTo(cx, cy - r + 2).stroke();
    doc.moveTo(cx, cy).lineTo(cx + r * 0.45, cy).stroke();
  } else if (type === "journeys") {
    doc.moveTo(x + 2, cy + 2).lineTo(x + size - 2, cy + 2).lineTo(x + size - 4, cy - 2).lineTo(x + 4, cy - 2).closePath().stroke();
  } else if (type === "hmrc") {
    doc.font("Helvetica-Bold").fontSize(size - 2).fillColor(color).text("£", x + 1, y + 1, { lineBreak: false });
    doc.restore();
    return;
  } else if (type === "trend") {
    doc.moveTo(x + 2, cy + 3).lineTo(x + size / 2, y + 2).lineTo(x + size - 2, cy - 3).stroke();
  } else if (type === "verify") {
    doc.roundedRect(x, y, size, size, 2).stroke();
    doc.moveTo(x + 3, cy).lineTo(x + size / 2, y + size - 3).lineTo(x + size - 3, y + 3).stroke();
  }
  doc.restore();
}

function drawQrBlock(doc, qrBuffer, margin, contentW, y, label = "Scan to verify") {
  const qrSize = 64;
  const cx = margin + (contentW - qrSize) / 2;
  doc.image(qrBuffer, cx, y, { width: qrSize, height: qrSize });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7).text(label, margin, y + qrSize + 6, { width: contentW, align: "center" });
  return y + qrSize + PDF.unit * 3;
}

function drawThinRule(doc, margin, y, contentW, color = BRAND.border) {
  doc.moveTo(margin + PDF.unit * 2, y).lineTo(margin + contentW - PDF.unit * 2, y).strokeColor(color).lineWidth(0.5).stroke();
  return y + PDF.unit * 2;
}

function drawFooter(doc, a, margin, contentW) {
  const footY = footerTop(doc.page.height) - 4;
  drawThinRule(doc, margin, footY - 52, contentW, "#DDE6F2");
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7).text("Generated automatically by MilePilot", margin, footY - 42, { width: contentW, align: "center" });
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text(BRAND_TAGLINE, margin, footY - 30, { width: contentW, align: "center", characterSpacing: 0.8 });
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(7.5).text("app.milepilot.uk", margin, footY - 18, { width: contentW, align: "center", link: APP_URL });
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(6.5).text(`Report ID ${a.reportId}`, margin, footY - 6, { width: contentW, align: "center" });
}

function drawCompactHeader(doc, margin, contentW, pageW) {
  doc.rect(0, 0, pageW, PDF.headerH).fill(BRAND.navy);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(20).text("Mile ", margin, 14, { continued: true, lineBreak: false });
  doc.fillColor(BRAND.blue).text("Pilot", { lineBreak: false });
  drawBrandPulse(doc, margin, 38, 96);
  return PDF.headerH + PDF.unit * 2;
}

function drawNavySectionBar(doc, title, margin, y, contentW) {
  const h = 28;
  doc.roundedRect(margin, y, contentW, h, 3).fill(BRAND.navy);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(8).text(title.toUpperCase(), margin + PDF.unit * 2, y + 9, { characterSpacing: 1.2 });
  return y + h + PDF.unit * 2;
}

function drawBrandPulse(doc, x, y, width = 120) {
  const h = 1.5;
  doc.rect(x, y, width * 0.28, h).fill(BRAND.blueDark);
  doc.rect(x + width * 0.28, y, width * 0.44, h).fill("#7EC0FF");
  doc.rect(x + width * 0.72, y, width * 0.28, h).fill(BRAND.blueDark);
}

function ensureSpace(doc, y, needed, margin, contentW, pageW, a) {
  if (y + needed <= footerTop(doc.page.height) - PDF.unit * 2) return y;
  drawFooter(doc, a, margin, contentW);
  doc.addPage({ margin: 0 });
  drawPageWatermark(doc, pageW, doc.page.height);
  return drawCompactHeader(doc, margin, contentW, pageW) + PDF.pagePad;
}

function drawPageHeader(doc, a, margin, contentW, pageW) {
  return drawCompactHeader(doc, margin, contentW, pageW);
}

function drawSectionHeading(doc, title, margin, y, contentW) {
  return drawNavySectionBar(doc, title, margin, y, contentW);
}

function drawThisWeekKiller(doc, a, margin, contentW, y) {
  const boxH = 108;
  doc.roundedRect(margin, y, contentW, boxH, 6).fill(BRAND.navy);
  doc.fillColor("#6EB4FF").font("Helvetica-Bold").fontSize(7).text("THIS WEEK", margin + PDF.unit * 2, y + 12, { characterSpacing: 1.4 });

  const targetMi = Math.max(a.prevWeekTotals.mi, a.weekTotals.mi, 1);
  drawProgressBar(doc, margin + PDF.unit * 2, y + 26, contentW - PDF.unit * 4, 8, a.weekTotals.mi / targetMi, BRAND.blue);

  const miStr = `${fmtMi(a.weekTotals.mi)} Miles`;
  const miSize = fitFontSize(doc, miStr, contentW - 60, 24, 16);
  doc.fillColor(BRAND.white).font("Helvetica-Bold").fontSize(miSize).text(miStr, margin + PDF.unit * 2, y + 42);

  if (a.weekComparePct !== null && Math.abs(a.weekComparePct) >= 1) {
    const arrow = a.weekComparePct > 0 ? "↑" : "↓";
    const col = trendColor(a.weekComparePct);
    doc.fillColor(col).font("Helvetica-Bold").fontSize(13).text(`${arrow} ${Math.abs(a.weekComparePct)}%`, margin + PDF.unit * 2, y + 42 + miSize + 4);
    doc.fillColor("#93A8C4").font("Helvetica").fontSize(8).text("compared with last week", margin + PDF.unit * 2 + 52, y + 42 + miSize + 7);
  } else {
    doc.fillColor("#93A8C4").font("Helvetica").fontSize(8).text("Your weekly progress", margin + PDF.unit * 2, y + 42 + miSize + 6);
  }

  doc.fillColor(BRAND.green).font("Helvetica-Bold").fontSize(12).text(money(a.weekTotals.hmrc), margin + contentW - PDF.unit * 2 - 80, y + 46, { width: 80, align: "right" });
  doc.fillColor("#93A8C4").font("Helvetica").fontSize(7).text("HMRC est.", margin + contentW - PDF.unit * 2 - 80, y + 62, { width: 80, align: "right" });

  return y + boxH + PDF.sectionGap;
}

function drawDashboardPage(doc, a, margin, contentW, pageW, pageH) {
  drawPageWatermark(doc, pageW, pageH);
  let y = drawCompactHeader(doc, margin, contentW, pageW);

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text(a.generatedAt, margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 2;

  const miNum = fmtMi(a.totals.mi);
  const miSize = fitFontSize(doc, miNum, contentW - 20, 80, 44);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(miSize).text(miNum, margin, y, { width: contentW, align: "center" });
  y += miSize + PDF.unit;
  doc.fillColor(BRAND.navy).font("Helvetica-Bold").fontSize(9).text("BUSINESS MILES", margin, y, { width: contentW, align: "center", characterSpacing: 2.2 });
  y += PDF.unit * 1.5;
  const todayLabel = a.period === "Daily" ? "Today" : a.period === "Weekly" ? "This Week" : a.period;
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(todayLabel, margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 3;

  y = drawThinRule(doc, margin, y, contentW, BRAND.blue);

  const name = firstName(a.driver);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(periodPraise(a.period, name), margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 2.5;
  if (a.totals.journeys > 0) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(periodMileageLine(a), margin, y, { width: contentW, align: "center", lineGap: 1.2 });
    y += doc.heightOfString(periodMileageLine(a), { width: contentW }) + PDF.unit * 2;
  } else {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("No business journeys recorded yet.", margin, y, { width: contentW, align: "center" });
    y += PDF.unit * 3;
  }

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Estimated HMRC claim", margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 1.5;
  const hmrcStr = money(a.totals.hmrc);
  doc.fillColor(BRAND.greenDark).font("Helvetica-Bold").fontSize(22).text(hmrcStr, margin, y, { width: contentW, align: "center" });
  y += PDF.unit * 4;

  if (collectRoutePoints(a.shifts).length >= 2) {
    y = drawMiniRouteSparkline(doc, a.shifts, margin, contentW, y);
  }
  return drawThisWeekKiller(doc, a, margin, contentW, y);
}

function drawCoachIntelligence(doc, intel, margin, contentW, y) {
  y = drawSectionHeading(doc, "MilePilot Intelligence", margin, y, contentW);
  y += PDF.unit * 2;
  const coach = intel.coach;
  const textW = contentW - PDF.unit * 4;
  const pad = PDF.unit * 2;

  let contentH = pad;
  doc.font("Helvetica-Bold").fontSize(11);
  contentH += doc.heightOfString(coach.headline, { width: textW }) + PDF.unit * 2;
  doc.font("Helvetica").fontSize(9.5);
  coach.paragraphs.forEach((p) => {
    contentH += doc.heightOfString(p, { width: textW, lineGap: 1.3 }) + PDF.unit * 1.5;
  });
  if (coach.hmrcHighlight) {
    doc.font("Helvetica-Bold").fontSize(10);
    contentH += doc.heightOfString(coach.hmrcHighlight, { width: textW, lineGap: 1.2 }) + PDF.unit * 2;
  }
  doc.font("Helvetica-Bold").fontSize(10);
  contentH += doc.heightOfString(coach.closing, { width: textW }) + pad;
  const boxH = contentH;

  doc.roundedRect(margin, y, contentW, boxH, 4).fill(PDF.cardFill).strokeColor(PDF.cardStroke).lineWidth(0.6).stroke();

  let ly = y + pad;
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text(coach.headline, margin + pad, ly, { width: textW });
  ly += doc.heightOfString(coach.headline, { width: textW }) + PDF.unit * 2;

  coach.paragraphs.forEach((p) => {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9.5).text(p, margin + pad, ly, { width: textW, lineGap: 1.3 });
    ly += doc.heightOfString(p, { width: textW, lineGap: 1.3 }) + PDF.unit * 1.5;
  });

  if (coach.hmrcHighlight) {
    doc.fillColor(BRAND.greenDark).font("Helvetica-Bold").fontSize(10).text(coach.hmrcHighlight, margin + pad, ly, { width: textW, lineGap: 1.2 });
    ly += doc.heightOfString(coach.hmrcHighlight, { width: textW, lineGap: 1.2 }) + PDF.unit * 2;
  }

  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(10).text(coach.closing, margin + pad, ly, { width: textW });
  return y + boxH + PDF.sectionGap;
}

function drawJourneyWalletItem(doc, s, idx, margin, contentW, y) {
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(fmtClock(s.startISO), margin + PDF.unit * 2, y);
  y = drawThinRule(doc, margin, y + 16, contentW, "#DDE6F2");
  doc.fillColor(BRAND.navy).font("Helvetica-Bold").fontSize(9).text(`Journey ${idx + 1}`, margin + PDF.unit * 2, y + 2, { characterSpacing: 0.6 });
  drawOutlineIcon(doc, "miles", margin + PDF.unit * 2, y + 16, 12, BRAND.blue);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(14).text(`${fmtMi(s.miles)} miles`, margin + PDF.unit * 5, y + 14);
  drawOutlineIcon(doc, "time", margin + contentW * 0.55, y + 16, 12, BRAND.muted);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(fmtDurationShort(s.seconds), margin + contentW * 0.55 + 16, y + 16);
  y += 38;
  y = drawThinRule(doc, margin, y, contentW, "#EEF4FF");
  return y + PDF.unit;
}

function drawJourneyTimeline(doc, a, margin, contentW, y, pageW) {
  if (!a.shifts.length) {
    doc.roundedRect(margin, y, contentW, 56, 4).fill(PDF.cardFill).strokeColor(PDF.cardStroke).lineWidth(0.5).stroke();
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9.5).text("No journeys recorded in this period.", margin + PDF.unit * 2, y + 22, { width: contentW - 32, align: "center" });
    return y + 56 + PDF.sectionGap;
  }

  a.shifts.forEach((s, idx) => {
    if (y + 70 > footerTop(doc.page.height) - PDF.footerH) {
      drawFooter(doc, a, margin, contentW);
      doc.addPage({ margin: 0 });
      drawPageWatermark(doc, pageW, doc.page.height);
      y = drawCompactHeader(doc, margin, contentW, pageW) + PDF.pagePad;
      y = drawNavySectionBar(doc, "Journeys", margin, y, contentW);
    }
    y = drawJourneyWalletItem(doc, s, idx, margin, contentW, y);
  });
  return y + PDF.sectionGap;
}

function drawWeeklyBarChart(doc, a, margin, contentW, y) {
  const days = a.dailyActivity;
  const maxMi = Math.max(...days.map((d) => d.miles), 1);
  const chartH = 56;
  const barW = (contentW - PDF.unit * 4) / 7 - 4;
  const baseY = y + chartH;

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7).text("Miles over seven days", margin, y - 2);
  days.forEach((d, i) => {
    const bx = margin + PDF.unit * 2 + i * (barW + 4);
    const h = d.miles > 0 ? Math.max(4, (d.miles / maxMi) * chartH) : 2;
    doc.roundedRect(bx, baseY - h, barW, h, 2).fill(d.miles > 0 ? BRAND.blue : "#EEF2F8");
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(6).text(d.day.slice(0, 3), bx, baseY + 4, { width: barW, align: "center" });
  });
  return baseY + PDF.unit * 3;
}

function drawMiniRouteSparkline(doc, shifts, margin, contentW, y) {
  const points = collectRoutePoints(shifts);
  if (points.length < 2) return y;
  const w = contentW - PDF.unit * 4;
  const h = 36;
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latR = maxLat - minLat || 0.001;
  const lonR = maxLon - minLon || 0.001;

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(7).text("Route overview", margin, y);
  y += PDF.unit * 1.5;
  doc.roundedRect(margin, y, contentW, h + PDF.unit, 4).fill(PDF.cardFill).strokeColor(PDF.cardStroke).lineWidth(0.4).stroke();
  const ox = margin + PDF.unit * 2;
  const oy = y + PDF.unit;
  doc.moveTo(
    ox + ((points[0].lon - minLon) / lonR) * w,
    oy + h - ((points[0].lat - minLat) / latR) * h
  );
  points.slice(1).forEach((p) => {
    doc.lineTo(ox + ((p.lon - minLon) / lonR) * w, oy + h - ((p.lat - minLat) / latR) * h);
  });
  doc.strokeColor(BRAND.blue).lineWidth(1.2).stroke();
  doc.circle(ox + ((points[0].lon - minLon) / lonR) * w, oy + h - ((points[0].lat - minLat) / latR) * h, 2).fill(BRAND.green);
  const last = points[points.length - 1];
  doc.circle(ox + ((last.lon - minLon) / lonR) * w, oy + h - ((last.lat - minLat) / latR) * h, 2).fill(BRAND.blue);
  return y + h + PDF.unit * 4;
}

function drawProgressBar(doc, x, y, w, h, pct, color = BRAND.blue) {
  doc.roundedRect(x, y, w, h, 2).fill("#EEF2F8");
  const fillW = Math.max(4, w * Math.min(Math.max(pct, 0), 1));
  if (fillW > 0) doc.roundedRect(x, y, fillW, h, 2).fill(color);
}

function drawWeeklyDashboard(doc, a, margin, contentW, y) {
  y = drawSectionHeading(doc, "This Week", margin, y, contentW);
  y += PDF.unit * 2;

  const boxH = 148;
  doc.roundedRect(margin, y, contentW, boxH, 6).fill(PDF.cardFill).strokeColor(PDF.cardStroke).lineWidth(0.6).stroke();

  let by = y + PDF.unit * 2;
  const miStr = `${fmtMi(a.weekTotals.mi)} Miles`;
  const miSize = fitFontSize(doc, miStr, contentW - 40, 28, 18);
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(miSize).text(miStr, margin + PDF.unit * 2, by);
  by += miSize + PDF.unit * 2;

  const targetMi = Math.max(a.prevWeekTotals.mi, a.weekTotals.mi, 1);
  drawProgressBar(doc, margin + PDF.unit * 2, by, contentW - PDF.unit * 4, 10, a.weekTotals.mi / targetMi, BRAND.blue);
  by += PDF.unit * 3;

  const trendStr = a.weekComparePct !== null ? trendLabel(a.weekComparePct) : "—";
  doc.fillColor(trendColor(a.weekComparePct)).font("Helvetica-Bold").fontSize(14).text(trendStr, margin + PDF.unit * 2, by);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("vs last week", margin + PDF.unit * 2 + 48, by + 3);
  by += PDF.unit * 4;

  const colW = (contentW - PDF.unit * 4) / 2;
  doc.fillColor(BRAND.greenDark).font("Helvetica-Bold").fontSize(16).text(money(a.weekTotals.hmrc), margin + PDF.unit * 2, by);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("HMRC estimate", margin + PDF.unit * 2, by + 18);
  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text(String(a.weekTotals.journeys), margin + PDF.unit * 2 + colW, by);
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Journeys", margin + PDF.unit * 2 + colW, by + 18);

  return y + boxH + PDF.sectionGap;
}

function drawAiSummaryBox(doc, a, margin, contentW, y, pageW) {
  const summary = buildAiSummary(a);
  const textW = contentW - PDF.unit * 6;
  let bodyH = 0;
  summary.body.forEach((p) => {
    bodyH += doc.heightOfString(p, { width: textW, lineGap: 1.2 }) + PDF.unit;
  });
  const boxH = bodyH + PDF.unit * 18;
  y = ensureSpace(doc, y, boxH + 40, margin, contentW, pageW, a);

  y = drawDivider(doc, margin, y, contentW);
  y += PDF.unit;
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(8).text("MILEPILOT AI", margin, y, { width: contentW, align: "center", characterSpacing: 1.6 });
  y += PDF.unit * 3;

  doc.roundedRect(margin, y, contentW, boxH, 4).fill(PDF.cardFill).strokeColor(PDF.cardStroke).lineWidth(0.6).stroke();
  let ly = y + PDF.unit * 2;
  const cx = margin + PDF.unit * 3;

  doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(12).text(summary.greeting, cx, ly, { width: textW });
  ly += PDF.unit * 3;
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(summary.opening, cx, ly, { width: textW });
  ly += PDF.unit * 3;

  summary.body.forEach((line) => {
    doc.fillColor(BRAND.text).font("Helvetica").fontSize(9.5).text(line, cx, ly, { width: textW, lineGap: 1.2 });
    ly += doc.heightOfString(line, { width: textW, lineGap: 1.2 }) + PDF.unit;
  });

  ly += PDF.unit;
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Current HMRC value", cx, ly);
  ly += PDF.unit * 2;
  doc.fillColor(BRAND.greenDark).font("Helvetica-Bold").fontSize(16).text(summary.hmrcValue, cx, ly);
  ly += PDF.unit * 4;
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(10).text(summary.closing, cx, ly, { width: textW });

  const endY = y + boxH + PDF.unit * 2;
  drawDivider(doc, margin, endY, contentW);
  return endY + PDF.unit * 3;
}

function drawAccountantRow(doc, label, value, margin, y, contentW, bold = false) {
  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8.5).text(label, margin, y);
  doc.fillColor(bold ? BRAND.greenDark : BRAND.text).font(bold ? "Helvetica-Bold" : "Helvetica").fontSize(bold ? 11 : 9.5).text(value, margin + contentW * 0.42, y, { width: contentW * 0.58, align: "right" });
  doc.moveTo(margin, y + 14).lineTo(margin + contentW, y + 14).strokeColor("#F0F4FA").lineWidth(0.5).stroke();
  return y + 20;
}

function drawAccountantPage(doc, a, margin, contentW, y, qrBuffer) {
  y = drawSectionHeading(doc, "Accountant Copy", margin, y, contentW);
  y += PDF.unit * 2;

  doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Professional record suitable for bookkeeping and HMRC submissions.", margin, y, { width: contentW * 0.62 });
  const qrX = margin + contentW - 72;
  doc.image(qrBuffer, qrX, y - 4, { width: 64, height: 64 });
  doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(7).text("Verify Report", qrX - 4, y + 64, { width: 72, align: "center" });
  y += PDF.unit * 10;

  const rows = [
    ["Report ID", a.reportId],
    ["Driver", a.driver || "—"],
    ["Vehicle", vehicleLabel(a.vehicle)],
    ["Reporting Period", reportingPeriodLabel(a)],
    ["Generated", `${a.generatedAt} at ${a.generatedAtTime}`],
    ["HMRC Rate", `${Math.round(a.hmrcRate * 100)}p per mile`],
    ["Business Miles", `${fmtMi(a.totals.mi)} miles`],
    ["Mileage Value", money(a.totals.hmrc)],
    ["Journey Count", String(a.totals.journeys)],
    ["Driving Time", fmtShiftTime(a.totals.sec)],
    ["Weekly Miles", `${fmtMi(a.weekTotals.mi)} miles`],
    ["Weekly Mileage Value", money(a.weekTotals.hmrc)],
  ];

  doc.roundedRect(margin, y, contentW, rows.length * 20 + PDF.unit * 3, 4).strokeColor(BRAND.border).lineWidth(0.5).stroke();
  let ry = y + PDF.unit * 1.5;
  rows.forEach(([label, value], i) => {
    const bold = label === "Mileage Value" || label === "Weekly Mileage Value";
    ry = drawAccountantRow(doc, label, value, margin + PDF.unit * 2, ry, contentW - PDF.unit * 4, bold);
  });

  y = ry + PDF.unit * 2;
  y = drawSectionHeading(doc, "Journey Log", margin, y, contentW);
  y += PDF.unit;

  if (!a.shifts.length) {
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text("No journeys in this reporting period.", margin, y);
    return y + PDF.sectionGap;
  }

  a.shifts.forEach((s, i) => {
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(8.5).text(
      `${fmtClock(s.startISO)} → ${fmtClock(s.endISO)}`,
      margin,
      y
    );
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(
      `${fmtMi(s.miles)} mi · ${fmtDurationShort(s.seconds)} · BUSINESS`,
      margin + contentW * 0.45,
      y,
      { width: contentW * 0.55, align: "right" }
    );
    y += 16;
    if (i < a.shifts.length - 1) {
      doc.moveTo(margin, y - 4).lineTo(margin + contentW, y - 4).strokeColor("#F0F4FA").lineWidth(0.5).stroke();
    }
  });

  y += PDF.unit * 2;
  doc.fillColor(BRAND.greenDark).font("Helvetica-Bold").fontSize(9).text("✓ Verified · Authentic MilePilot report", margin, y);
  return y + PDF.sectionGap;
}

export async function buildPdfBuffer(report) {
  const a = analyseReport(report);
  const intel = buildIntelligence(a);
  const verifyUrl = buildVerifyUrl(a.reportId);
  const qrBuffer = await generateQrBuffer(verifyUrl);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4", autoFirstPage: true });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const pageH = doc.page.height;
    const margin = PDF.margin;
    const contentW = pageContentW(pageW);

    // Page 1 — Instagram-worthy dashboard
    let y = drawDashboardPage(doc, a, margin, contentW, pageW, pageH);
    y = ensureSpace(doc, y, 120, margin, contentW, pageW, a);
    y = drawCoachIntelligence(doc, intel, margin, contentW, y);
    drawFooter(doc, a, margin, contentW);

    // Page 2 — Apple Wallet journeys
    doc.addPage({ margin: 0 });
    drawPageWatermark(doc, pageW, pageH);
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    y = drawSectionHeading(doc, "Journeys", margin, y, contentW);
    y = drawJourneyTimeline(doc, a, margin, contentW, y, pageW);
    drawFooter(doc, a, margin, contentW);

    // Page 3 — Weekly visuals + AI coach
    doc.addPage({ margin: 0 });
    drawPageWatermark(doc, pageW, pageH);
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(`Week ending ${a.weekEnding}`, margin, y, { width: contentW });
    y += PDF.unit * 2;
    y = drawWeeklyDashboard(doc, a, margin, contentW, y);
    y = drawWeeklyBarChart(doc, a, margin, contentW, y);
    y = drawAiSummaryBox(doc, a, margin, contentW, y, pageW);
    drawFooter(doc, a, margin, contentW);

    // Page 4 — Accountant copy + QR verify
    doc.addPage({ margin: 0 });
    drawPageWatermark(doc, pageW, pageH);
    y = drawPageHeader(doc, a, margin, contentW, pageW);
    y = drawAccountantPage(doc, a, margin, contentW, y, qrBuffer);
    drawFooter(doc, a, margin, contentW);

    doc.end();
  });
}

export function parseReportId(reportId) {
  const match = String(reportId || "").match(/^MP-(\d{8})-(DY|WK|MO|YR|RP)-([A-F0-9]{8})$/i);
  if (!match) return null;
  const [, datePart, prefix, hash] = match;
  const periodMap = { DY: "Daily", WK: "Weekly", MO: "Monthly", YR: "Annual", RP: "Report" };
  const y = datePart.slice(0, 4);
  const m = datePart.slice(4, 6);
  const d = datePart.slice(6, 8);
  const created = new Date(`${y}-${m}-${d}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { reportId, period: periodMap[prefix] || "Report", created, hash, valid: true };
}

export function buildVerifyPageHtml(reportId) {
  const parsed = parseReportId(reportId);
  const valid = !!parsed;
  const created = parsed?.created || "—";
  const period = parsed?.period || "—";

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verify Report · MilePilot</title>
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:linear-gradient(180deg,#0A2854 0%,#031126 100%);min-height:100vh;color:#EAF2FF;display:flex;align-items:center;justify-content:center;padding:32px 20px}
  .card{max-width:420px;width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(110,180,255,.18);border-radius:20px;padding:32px 28px;box-shadow:0 24px 80px rgba(0,0,0,.35)}
  .brand{font-size:28px;font-weight:700;letter-spacing:-.04em;margin:0 0 6px}
  .brand span{color:#0D6BFF}
  .tag{font-size:11px;letter-spacing:.14em;color:#6EB4FF;margin:0 0 28px}
  h1{font-size:20px;font-weight:600;margin:0 0 20px;letter-spacing:-.02em}
  .row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08);font-size:14px}
  .row span:first-child{color:#93A8C4}
  .badge{display:inline-flex;align-items:center;gap:8px;margin-top:24px;padding:10px 14px;border-radius:999px;font-size:13px;font-weight:600;background:${valid ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.15)"};color:${valid ? "#34D399" : "#F87171"};border:1px solid ${valid ? "rgba(16,185,129,.35)" : "rgba(239,68,68,.35)"}}
  .foot{margin-top:28px;font-size:12px;color:#93A8C4;line-height:1.6;text-align:center}
</style></head>
<body>
<div class="card">
  <p class="brand">Mile <span>Pilot</span></p>
  <p class="tag">Drive • Track • Claim</p>
  <h1>Verify Report</h1>
  <div class="row"><span>Report ID</span><strong>${reportId}</strong></div>
  <div class="row"><span>Generated by</span><strong>MilePilot</strong></div>
  <div class="row"><span>Created</span><strong>${created}</strong></div>
  <div class="row"><span>Period</span><strong>${period}</strong></div>
  <div class="badge">${valid ? "✓ Authentic MilePilot report" : "✗ Invalid report ID format"}</div>
  <p class="foot">This report was automatically generated from GPS-tracked business mileage.<br>Suitable for bookkeeping records.</p>
</div>
</body></html>`;
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const headline = periodEmailHeadline(a.period);
  const bodyLine = periodEmailBody(a.period);

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
  <p style="margin:0 0 16px;font-size:18px;font-weight:600;color:#FFFFFF;line-height:1.4;letter-spacing:-0.02em;">${headline}</p>
  <p style="margin:0 0 8px;font-size:16px;color:#EAF2FF;line-height:1.5;">Hi ${name},</p>
  <p style="margin:0 0 8px;font-size:15px;color:#B9C8DD;line-height:1.55;">${bodyLine}</p>
  <p style="margin:0 0 28px;font-size:15px;color:#B9C8DD;line-height:1.55;">Everything has already been calculated and organised for your records.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    ${metric("Business Miles", fmtMi(a.totals.mi))}
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
  <p style="margin:0 0 36px;font-size:14px;color:#93A8C4;line-height:1.6;text-align:center;">Your PDF is attached.</p>
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
  return `${periodEmailHeadline(a.period)}

Hi ${name},

${periodEmailBody(a.period)}
Everything has already been calculated and organised for your records.

Business Miles: ${fmtMi(a.totals.mi)}
Driving Time: ${fmtShiftTime(a.totals.sec)}
Journeys: ${a.totals.journeys}
Estimated HMRC: ${money(a.totals.hmrc)}

Your PDF is attached.

View your report in MilePilot: ${buildReportDeepLink(report, true)}

Open MilePilot: ${APP_URL}/

Drive • Track • Claim
Thank you for choosing MilePilot.
Every mile matters.`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  return periodEmailHeadline(period);
}
