/**
 * MilePilot Report Engine — MP-011 Premium Reports
 * PDF generation, email templates, MilePilot Intelligence
 */

import PDFDocument from "pdfkit";

export const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  border: "#DDE6F2",
  text: "#06112A",
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

export const REPORT_VERSION = "MP-011-premium-v2";

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

function fmtHoursCompact(sec) {
  sec = Number(sec) || 0;
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  return h ? `${h}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`;
}

function firstName(full) {
  const n = (full || "").trim();
  if (!n) return "";
  return n.split(/\s+/)[0];
}

function getWeekEndingDate(shifts) {
  const now = new Date();
  const d = new Date(now);
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
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
  return order.filter((k) => map[k]).map((k) => ({ day: k, ...map[k] }));
}

function longestShift(shifts) {
  if (!shifts.length) return null;
  return shifts.reduce((a, b) => (Number(b.seconds || 0) > Number(a.seconds || 0) ? b : a));
}

function busiestDay(shifts) {
  const days = groupByDay(shifts);
  if (!days.length) return null;
  return days.reduce((a, b) => (b.miles > a.miles ? b : a));
}

export function analyseReport(report) {
  const shifts = report.shifts || [];
  const prev = report.previousPeriod || {};
  const totals = sumShifts(shifts);
  const prevTotals = {
    mi: Number(prev.miles ?? prev.mi ?? 0),
    sec: Number(prev.seconds ?? prev.sec ?? 0),
    hmrc: Number(prev.hmrc ?? 0),
    journeys: Number(prev.journeys ?? 0),
  };

  const longest = longestShift(shifts);
  const busiest = busiestDay(shifts);
  const workingDays = new Set(shifts.map((s) => new Date(s.startISO).toDateString())).size;
  const avgShiftSec = shifts.length ? totals.sec / shifts.length : 0;
  const avgMilesDay = workingDays ? totals.mi / workingDays : 0;
  const avgMilesShift = shifts.length ? totals.mi / shifts.length : 0;
  const hmrcRate = Number(report.hmrcRate) || hmrcRateForShifts(shifts);

  let weekComparePct = null;
  if (prevTotals.mi > 0 && totals.mi > 0) {
    weekComparePct = Math.round((totals.mi / prevTotals.mi - 1) * 100);
  }

  const miDiff = totals.mi - prevTotals.mi;
  const avgShiftPrev = prevTotals.journeys ? prevTotals.sec / prevTotals.journeys : 0;
  const avgShiftDeltaMin = avgShiftPrev > 0 ? Math.round((avgShiftSec - avgShiftPrev) / 60) : 0;

  return {
    totals,
    prevTotals,
    shifts,
    driver: (report.driver || "").trim(),
    period: report.period || "Daily",
    dailyActivity: groupByDay(shifts),
    longest,
    busiest,
    workingDays,
    avgShiftSec,
    avgMilesDay,
    avgMilesShift,
    hmrcRate,
    weekComparePct,
    miDiff,
    avgShiftDeltaMin,
    weekEnding: getWeekEndingDate(shifts),
    generatedAt: new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export function buildIntelligence(a) {
  const lines = [];
  const { totals, shifts, busiest, longest, weekComparePct, miDiff, avgShiftDeltaMin, avgMilesDay, workingDays } = a;

  if (busiest && totals.mi > 0) {
    const pct = Math.round((busiest.miles / totals.mi) * 100);
    lines.push(`${busiest.day} was your busiest day, accounting for ${pct}% of your business mileage.`);
  }

  if (weekComparePct !== null && Math.abs(weekComparePct) >= 5) {
    lines.push(
      weekComparePct > 0
        ? `You drove ${Math.abs(miDiff).toFixed(1)} more business miles than the previous period (+${weekComparePct}%).`
        : `You drove ${Math.abs(miDiff).toFixed(1)} fewer business miles than the previous period (${weekComparePct}%).`
    );
  } else if (miDiff > 0.5 && a.prevTotals.mi > 0) {
    lines.push(`You drove ${miDiff.toFixed(1)} more business miles than the previous period.`);
  }

  if (avgShiftDeltaMin !== 0 && shifts.length >= 2 && a.prevTotals.journeys > 0) {
    lines.push(
      avgShiftDeltaMin > 0
        ? `Your average shift length increased by ${avgShiftDeltaMin} minutes.`
        : `Your average shift length decreased by ${Math.abs(avgShiftDeltaMin)} minutes.`
    );
  }

  if (longest && totals.hmrc > 0) {
    const topDay = new Date(longest.startISO).toLocaleDateString("en-GB", { weekday: "long" });
    lines.push(`${topDay} produced your highest estimated mileage claim at ${money(longest.hmrc)}.`);
  }

  if (workingDays > 0 && avgMilesDay > 0) {
    lines.push(`You averaged ${avgMilesDay.toFixed(1)} business miles per working day across ${workingDays} day${workingDays === 1 ? "" : "s"}.`);
  }

  if (longest && longest.seconds > 0) {
    lines.push(`Your longest continuous shift was ${fmtShiftTime(longest.seconds)}.`);
  }

  return lines.slice(0, 5);
}

function periodReportTitle(period) {
  const map = {
    Daily: "Daily Driving Report",
    Weekly: "Weekly Driving Report",
    Monthly: "Monthly Driving Report",
    Annual: "Annual Driving Report",
  };
  return map[period] || `${period} Driving Report`;
}

function drawRouteMap(doc, shifts, x, y, w, h) {
  const points = [];
  shifts.forEach((s) => {
    (s.route || s.routePoints || []).forEach((p) => {
      const lat = p.lat ?? p.latitude;
      const lon = p.lon ?? p.longitude ?? p.lng;
      if (lat != null && lon != null) points.push({ lat, lon });
    });
  });
  if (points.length < 2) return false;

  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const latSpan = maxLat - minLat || 0.001;
  const lonSpan = maxLon - minLon || 0.001;

  doc.roundedRect(x, y, w, h, 12).fillAndStroke("#EEF4FF", BRAND.border);
  doc.save();
  doc.rect(x + 8, y + 8, w - 16, h - 16).clip();

  let started = false;
  points.forEach((p) => {
    const px = x + 12 + ((p.lon - minLon) / lonSpan) * (w - 24);
    const py = y + h - 12 - ((p.lat - minLat) / latSpan) * (h - 24);
    if (!started) {
      doc.moveTo(px, py);
      started = true;
    } else doc.lineTo(px, py);
  });
  doc.strokeColor(BRAND.blue).lineWidth(2.2).stroke();
  doc.restore();
  return true;
}

function ensureSpace(doc, y, need, margin) {
  if (y + need > doc.page.height - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

export function buildPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    const a = analyseReport(report);
    const intelligence = buildIntelligence(a);
    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const margin = 44;
    const contentW = pageW - margin * 2;
    let y = 0;

    doc.rect(0, 0, pageW, 136).fill(BRAND.navy);
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(32).text("Mile ", margin, 36, { continued: true });
    doc.fillColor(BRAND.blue).text("Pilot");
    doc.rect(margin, 78, 132, 2.5).fill(BRAND.blue);
    doc.fillColor(BRAND.soft).font("Helvetica").fontSize(11).text("Drive • Track • Claim", margin, 90);

    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(13).text(periodReportTitle(a.period), pageW - margin - 220, 40, { width: 220, align: "right" });
    if (a.period === "Weekly") {
      doc.fillColor(BRAND.soft).font("Helvetica").fontSize(10).text(`Week ending ${a.weekEnding}`, pageW - margin - 220, 62, { width: 220, align: "right" });
    }
    if (a.driver) {
      doc.text(`Prepared for ${a.driver}`, pageW - margin - 220, a.period === "Weekly" ? 78 : 62, { width: 220, align: "right" });
    }

    y = 158;
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(10).text("BUSINESS MILES", margin, y, { characterSpacing: 1 });
    y += 18;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(56).text(a.totals.mi.toFixed(1), margin, y);
    y += 64;

    const secondary = [
      { label: "Driving Time", value: fmtShiftTime(a.totals.sec) },
      { label: "Business Journeys", value: String(a.totals.journeys) },
      { label: "Estimated HMRC Claim", value: money(a.totals.hmrc) },
    ];
    const secW = (contentW - 20) / 3;
    secondary.forEach((m, i) => {
      const x = margin + i * (secW + 10);
      doc.roundedRect(x, y, secW, 58, 10).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(m.label.toUpperCase(), x + 12, y + 12, { width: secW - 24 });
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(16).text(m.value, x + 12, y + 28, { width: secW - 24 });
    });
    y += 78;

    if (a.dailyActivity.length && (a.period === "Weekly" || a.period === "Monthly")) {
      y = ensureSpace(doc, y, 120, margin);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Driving Activity", margin, y);
      y += 20;
      doc.rect(margin, y, contentW, 24).fill(BRAND.navy);
      const cols = [margin + 10, margin + 120, margin + 220, margin + 320];
      ["Date", "Miles", "Hours", "Trips"].forEach((h, i) => {
        doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(8).text(h.toUpperCase(), cols[i], y + 8);
      });
      y += 24;
      a.dailyActivity.forEach((row, idx) => {
        y = ensureSpace(doc, y, 24, margin);
        doc.rect(margin, y, contentW, 22).fill(idx % 2 === 0 ? "#FFF" : BRAND.light);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(9);
        doc.text(row.day, cols[0], y + 6);
        doc.text(row.miles.toFixed(1), cols[1], y + 6);
        doc.text(fmtHoursCompact(row.seconds), cols[2], y + 6);
        doc.text(String(row.trips), cols[3], y + 6);
        y += 22;
      });
      y += 16;
    }

    y = ensureSpace(doc, y, 180, margin);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Weekly Journey Map", margin, y);
    y += 18;
    const hasMap = drawRouteMap(doc, a.shifts, margin, y, contentW, 120);
    if (hasMap) y += 132;
    else {
      doc.roundedRect(margin, y, contentW, 56, 10).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text("Route map will appear when GPS route data is saved with your shifts.", margin + 14, y + 22, { width: contentW - 28 });
      y += 68;
    }

    y = ensureSpace(doc, y, 100, margin);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Business Insights", margin, y);
    y += 18;
    const insights = [
      longestShift(a.shifts) ? { icon: "Longest shift", value: fmtShiftTime(longestShift(a.shifts).seconds) } : null,
      a.avgShiftSec ? { icon: "Average shift", value: fmtShiftTime(a.avgShiftSec) } : null,
      a.avgMilesDay ? { icon: "Average miles/day", value: a.avgMilesDay.toFixed(1) } : null,
      a.weekComparePct !== null ? { icon: "Compared to last period", value: `${a.weekComparePct > 0 ? "+" : ""}${a.weekComparePct}%` } : null,
      a.busiest ? { icon: "Longest day", value: `${a.busiest.day} · ${a.busiest.miles.toFixed(1)} mi` } : null,
    ].filter(Boolean);

    insights.slice(0, 4).forEach((ins) => {
      y = ensureSpace(doc, y, 28, margin);
      doc.roundedRect(margin, y, contentW, 26, 8).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(8).text(ins.icon.toUpperCase(), margin + 12, y + 8);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(11).text(ins.value, margin + 140, y + 7);
      y += 32;
    });
    y += 8;

    y = ensureSpace(doc, y, 80, margin);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Business Summary", margin, y);
    y += 18;
    const summaryLines = [
      ["Business miles", a.totals.mi.toFixed(1)],
      ["Working days", String(a.workingDays)],
      ["Total shifts", String(a.totals.journeys)],
      ["Average shift length", fmtShiftTime(a.avgShiftSec)],
      ["Average miles per shift", a.avgMilesShift.toFixed(1)],
    ];
    summaryLines.forEach(([label, val]) => {
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(label, margin, y, { continued: true });
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(10).text(`  ${val}`, { align: "left" });
      y += 16;
    });
    y += 8;

    y = ensureSpace(doc, y, 90, margin);
    doc.roundedRect(margin, y, contentW, 78, 12).fillAndStroke("#EEF4FF", BRAND.blue);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(13).text("HMRC Mileage Estimate", margin + 16, y + 14);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(10).text(`Current HMRC rate: ${Math.round(a.hmrcRate * 100)}p per mile`, margin + 16, y + 34);
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(22).text(money(a.totals.hmrc), margin + 16, y + 50);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text("Estimates for record keeping. Verify against official HMRC guidance.", margin + 16, y + 62, { width: contentW - 32 });
    y += 94;

    if (intelligence.length) {
      y = ensureSpace(doc, y, 60 + intelligence.length * 20, margin);
      doc.fillColor(BRAND.blue).font("Helvetica-Bold").fontSize(13).text("MilePilot Intelligence", margin, y);
      y += 16;
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(9).text("Personalised insights from your driving data", margin, y);
      y += 14;
      intelligence.forEach((line) => {
        y = ensureSpace(doc, y, 22, margin);
        doc.roundedRect(margin, y, contentW, 22, 6).fill("#F8FBFF");
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(9).text(`• ${line}`, margin + 10, y + 7, { width: contentW - 20 });
        y += 28;
      });
    }

    if (a.shifts.length) {
      y = ensureSpace(doc, y, 60, margin);
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Shift Breakdown", margin, y);
      y += 18;
      doc.rect(margin, y, contentW, 22).fill(BRAND.navy);
      const cols = [margin + 8, margin + 72, margin + 130, margin + 200, margin + 260];
      ["Date", "Vehicle", "Miles", "Time", "HMRC"].forEach((h, i) => {
        doc.fillColor("#FFF").font("Helvetica-Bold").fontSize(7).text(h.toUpperCase(), cols[i], y + 7);
      });
      y += 22;
      a.shifts.forEach((s, idx) => {
        y = ensureSpace(doc, y, 22, margin);
        doc.rect(margin, y, contentW, 20).fill(idx % 2 === 0 ? "#FFF" : BRAND.light);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(8);
        doc.text(s.date || "—", cols[0], y + 6);
        doc.text(vehicleLabel(s.vehicle), cols[1], y + 6);
        doc.text(Number(s.miles || 0).toFixed(1), cols[2], y + 6);
        doc.text(fmtShiftTime(s.seconds), cols[3], y + 6);
        doc.font("Helvetica-Bold").text(money(s.hmrc), cols[4], y + 6);
        doc.font("Helvetica");
        y += 20;
      });
    }

    const footY = doc.page.height - 52;
    doc.moveTo(margin, footY - 10).lineTo(margin + contentW, footY - 10).strokeColor(BRAND.border).stroke();
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(9).text("Generated automatically by MilePilot", margin, footY, { width: contentW, align: "center" });
    doc.font("Helvetica").fontSize(8).text(`Drive • Track • Claim  ·  ${a.generatedAt}  ·  ${REPORT_VERSION}`, margin, footY + 12, { width: contentW, align: "center" });

    doc.end();
  });
}

export function buildReportEmailHtml(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  const periodLabel = a.period;
  const miles = a.totals.mi.toFixed(1);
  const time = fmtShiftTime(a.totals.sec);
  const journeys = String(a.totals.journeys);
  const hmrc = money(a.totals.hmrc);

  const metric = (label, value) =>
    `<td width="50%" style="padding:5px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(110,180,255,0.18);border-radius:14px;">
        <tr><td style="padding:16px 18px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#93A8C4;margin-bottom:8px;">${label}</div>
          <div style="font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;">${value}</div>
        </td></tr>
      </table>
    </td>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#031126;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:36px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="padding:8px 8px 28px;text-align:center;">
  <div style="font-size:30px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
  <div style="height:2px;width:140px;margin:14px auto;background:linear-gradient(90deg,transparent,#6EB4FF,#0D6BFF,#6EB4FF,transparent);border-radius:999px;"></div>
</td></tr>
<tr><td style="padding:0 12px 8px;">
  <p style="margin:0 0 8px;font-size:16px;color:#EAF2FF;line-height:1.5;">Hi ${name},</p>
  <p style="margin:0 0 6px;font-size:17px;font-weight:600;color:#FFFFFF;line-height:1.45;">Here&apos;s your driving summary for ${periodLabel === "Daily" ? "today" : periodLabel === "Weekly" ? "this week" : periodLabel === "Monthly" ? "this month" : "this year"}.</p>
  <p style="margin:0 0 28px;font-size:15px;color:#B9C8DD;line-height:1.55;">We tracked every business mile so you don&apos;t have to.</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>${metric("Business Miles", miles + " miles")}${metric("Driving Time", time)}</tr>
    <tr>${metric("Business Journeys", journeys)}${metric("Estimated HMRC Claim", hmrc)}</tr>
  </table>
  <p style="margin:28px 0 8px;font-size:15px;color:#B9C8DD;line-height:1.55;">Attached is your full professional PDF report.</p>
  <p style="margin:0 0 32px;font-size:15px;color:#EAF2FF;line-height:1.55;">Have a fantastic week,<br><strong style="color:#FFFFFF;">The MilePilot Team</strong></p>
  <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.12em;color:#0D6BFF;text-align:center;">Drive • Track • Claim</p>
</td></tr>
<tr><td style="padding:24px 12px 8px;font-size:11px;color:#64748B;line-height:1.5;text-align:center;">MilePilot · Every business mile matters.<br>HMRC figures are estimates. Check official guidance before filing.</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

export function buildReportEmailText(report) {
  const a = analyseReport(report);
  const name = firstName(a.driver) || "there";
  return `Hi ${name},

Here's your driving summary for this ${(a.period || "Daily").toLowerCase()} period.

We tracked every business mile so you don't have to.

Business Miles: ${a.totals.mi.toFixed(1)} miles
Driving Time: ${fmtShiftTime(a.totals.sec)}
Business Journeys: ${a.totals.journeys}
Estimated HMRC Claim: ${money(a.totals.hmrc)}

Attached is your full professional PDF report.

Have a fantastic week,
The MilePilot Team

Drive • Track • Claim
— MilePilot`;
}

export function buildReportSubject(report) {
  const period = report.period || "Daily";
  const emoji = period === "Weekly" ? "📊 " : "";
  const labels = {
    Daily: "Daily Driving Report is Ready",
    Weekly: "Weekly Driving Report is Ready",
    Monthly: "Monthly Driving Report is Ready",
    Annual: "Annual Driving Report is Ready",
  };
  return `${emoji}Your MilePilot ${labels[period] || "Report is Ready"}`;
}
