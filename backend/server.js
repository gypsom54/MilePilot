import express from "express";
import cors from "cors";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  "https://app.milepilot.uk",
  "https://milepilot-app.pages.dev",
  "http://localhost:8000",
  "http://localhost:8787",
  "http://127.0.0.1:8000",
  "http://127.0.0.1:8787",
];

const BRAND = {
  navy: "#031126",
  panel: "#0B2348",
  blue: "#0D6BFF",
  muted: "#64748B",
  soft: "#B9C8DD",
  light: "#F8FBFF",
  border: "#DDE6F2",
  text: "#06112A",
};

const VEHICLE_LABELS = {
  car: "Car",
  van: "Van",
  bicycle: "Bicycle",
  motorcycle: "Motorcycle",
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  })
);
app.use(express.json({ limit: "2mb" }));

const resend = new Resend(process.env.RESEND_API_KEY);

function money(v) {
  return "£" + Number(v || 0).toFixed(2);
}

function vehicleLabel(v) {
  return VEHICLE_LABELS[v] || v || "—";
}

function fmtShiftTime(sec) {
  sec = Number(sec) || 0;
  if (sec < 60) return "0h";
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  return h ? `${h}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`;
}

function formatReportDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function periodTitle(period) {
  const map = { Daily: "Today", Weekly: "This Week", Monthly: "This Month" };
  return map[period] || period || "Report";
}

function buildPdfBuffer(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const chunks = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageW = doc.page.width;
    const margin = 48;
    const contentW = pageW - margin * 2;
    const periodLabel = report.period || "Daily";
    const shifts = report.shifts || [];
    const driver = (report.driver || "").trim();

    doc.rect(0, 0, pageW, 128).fill(BRAND.navy);
    doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(30).text("Mile ", margin, 40, { continued: true });
    doc.fillColor(BRAND.blue).text("Pilot");
    doc.fillColor(BRAND.soft).font("Helvetica").fontSize(11).text("Your driving business. On auto pilot.", margin, 78);
    doc.rect(margin, 104, 148, 2.5).fill(BRAND.blue);

    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(22).text(`${periodLabel} Business Report`, margin, 152);
    doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11).text(formatReportDate(), margin, 180);
    if (driver) {
      doc.text(`Prepared for ${driver}`, margin, 196);
    }

    const metrics = [
      { label: "Business Miles", value: Number(report.totals?.miles || 0).toFixed(1) },
      { label: "Driving Time", value: report.totals?.time || "0h 00m" },
      { label: "Journeys", value: String(shifts.length) },
      { label: "HMRC Estimate", value: money(report.totals?.hmrc) },
    ];

    let y = driver ? 228 : 212;
    const boxW = (contentW - 14) / 2;
    const boxH = 68;

    metrics.forEach((m, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = margin + col * (boxW + 14);
      const by = y + row * (boxH + 14);
      doc.roundedRect(x, by, boxW, boxH, 10).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(8).text(m.label.toUpperCase(), x + 16, by + 14, { width: boxW - 32, characterSpacing: 0.6 });
      doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(20).text(m.value, x + 16, by + 34, { width: boxW - 32 });
    });

    y += 2 * (boxH + 14) + 32;
    doc.fillColor(BRAND.text).font("Helvetica-Bold").fontSize(14).text("Shift Breakdown", margin, y);
    y += 22;

    if (!shifts.length) {
      doc.roundedRect(margin, y, contentW, 48, 10).fillAndStroke(BRAND.light, BRAND.border);
      doc.fillColor(BRAND.muted).font("Helvetica").fontSize(11).text("No saved shifts in this period.", margin + 16, y + 18);
      y += 64;
    } else {
      doc.rect(margin, y, contentW, 26).fill(BRAND.navy);
      const cols = [margin + 12, margin + 88, margin + 168, margin + 248, margin + 328, margin + 408];
      ["Date", "Vehicle", "Miles", "Time", "HMRC"].forEach((h, i) => {
        doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(8).text(h.toUpperCase(), cols[i], y + 9);
      });
      y += 26;

      shifts.forEach((s, idx) => {
        if (y > 740) {
          doc.addPage();
          y = margin;
        }
        const rowBg = idx % 2 === 0 ? "#FFFFFF" : BRAND.light;
        doc.rect(margin, y, contentW, 26).fill(rowBg);
        doc.fillColor(BRAND.text).font("Helvetica").fontSize(9);
        doc.text(s.date || "—", cols[0], y + 8);
        doc.text(vehicleLabel(s.vehicle), cols[1], y + 8);
        doc.text(Number(s.miles || 0).toFixed(1), cols[2], y + 8);
        doc.text(fmtShiftTime(s.seconds), cols[3], y + 8);
        doc.font("Helvetica-Bold").text(money(s.hmrc), cols[4], y + 8);
        doc.font("Helvetica");
        y += 26;
      });
      y += 12;
    }

    doc.moveTo(margin, y).lineTo(margin + contentW, y).strokeColor(BRAND.border).lineWidth(1).stroke();
    y += 18;
    doc.fillColor(BRAND.muted).font("Helvetica-Bold").fontSize(9).text("Every business mile matters.", margin, y, { width: contentW, align: "center" });
    doc.font("Helvetica").fontSize(8).text("Generated by MilePilot. HMRC figures are estimates for record keeping and should be checked against official guidance.", margin, y + 16, { width: contentW, align: "center" });

    doc.end();
  });
}

function buildReportEmailHtml(report) {
  const periodLabel = report.period || "Daily";
  const periodHeading = periodTitle(periodLabel);
  const driver = (report.driver || "").trim();
  const greeting = driver ? `Hi ${driver},` : "Hi there,";
  const miles = Number(report.totals?.miles || 0).toFixed(1);
  const time = report.totals?.time || "0h 00m";
  const hmrc = money(report.totals?.hmrc);
  const journeys = (report.shifts || []).length;

  const metric = (label, value) =>
    `<td width="50%" style="padding:6px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FBFF;border:1px solid #DDE6F2;border-radius:12px;">
        <tr><td style="padding:14px 16px;">
          <div style="font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#64748B;margin-bottom:6px;">${label}</div>
          <div style="font-size:22px;font-weight:700;color:#06112A;letter-spacing:-0.02em;">${value}</div>
        </td></tr>
      </table>
    </td>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#E8EEF6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#E8EEF6;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(3,17,38,0.12);">
<tr><td style="background:linear-gradient(180deg,#0A2854 0%,#031126 100%);padding:32px 28px 28px;">
  <div style="font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:-0.03em;line-height:1;">Mile <span style="color:#0D6BFF;">Pilot</span></div>
  <div style="height:2px;width:128px;background:linear-gradient(90deg,transparent,#6EB4FF,#0D6BFF,#6EB4FF,transparent);margin:14px 0 12px;border-radius:999px;"></div>
  <div style="font-size:13px;color:#B9C8DD;line-height:1.45;">Your driving business. On auto pilot.</div>
</td></tr>
<tr><td style="padding:28px 28px 8px;">
  <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#0D6BFF;margin-bottom:8px;">${periodLabel} report</div>
  <h1 style="margin:0 0 10px;font-size:22px;font-weight:700;color:#06112A;letter-spacing:-0.02em;line-height:1.25;">${periodHeading} — your business summary</h1>
  <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.55;">${greeting} your professional PDF report is attached. It&apos;s prepared from your saved shifts and ready for your records.</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>${metric("Business Miles", miles)}${metric("Driving Time", time)}</tr>
    <tr>${metric("Journeys", String(journeys))}${metric("HMRC Estimate", hmrc)}</tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
    <tr><td style="padding:16px 18px;background:#F0F6FF;border:1px solid #DDE6F2;border-radius:14px;">
      <div style="font-size:14px;font-weight:600;color:#06112A;margin-bottom:4px;">📎 PDF attached</div>
      <div style="font-size:13px;color:#64748B;line-height:1.45;">Open the attachment for your full shift breakdown — accountant-ready and easy to share.</div>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:8px 28px 28px;font-size:12px;color:#94A3B8;line-height:1.5;text-align:center;">
  MilePilot · Every business mile matters.<br>
  <span style="font-size:11px;">HMRC figures are estimates. Check official guidance before filing.</span>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildReportEmailText(report) {
  const periodLabel = report.period || "Daily";
  const driver = (report.driver || "").trim();
  const greeting = driver ? `Hi ${driver},` : "Hi there,";
  return `${greeting}

Your MilePilot ${periodLabel} report is attached as a professional PDF.

Summary (${periodTitle(periodLabel)}):
• Business Miles: ${Number(report.totals?.miles || 0).toFixed(1)}
• Driving Time: ${report.totals?.time || "0h 00m"}
• Journeys: ${(report.shifts || []).length}
• HMRC Estimate: ${money(report.totals?.hmrc)}

Every business mile matters.

— MilePilot
https://app.milepilot.uk`;
}

function buildReportSubject(report) {
  const periodLabel = report.period || "Daily";
  const hmrc = money(report.totals?.hmrc);
  return `Your MilePilot ${periodLabel} Report — ${hmrc} estimated claim`;
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "milepilot-api",
    resendConfigured: !!process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
    reportVersion: "premium-v1",
    timestamp: new Date().toISOString(),
  });
});

app.post("/reports/send", async (req, res) => {
  try {
    const report = req.body;

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        sent: false,
        message: "RESEND_API_KEY is missing in Railway variables",
      });
    }

    if (!report.email) {
      return res.status(400).json({
        sent: false,
        message: "Email is required",
      });
    }

    const pdf = await buildPdfBuffer(report);
    const periodLabel = report.period || "Daily";
    const dateSlug = new Date().toISOString().slice(0, 10);

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
      to: report.email,
      subject: buildReportSubject(report),
      text: buildReportEmailText(report),
      html: buildReportEmailHtml(report),
      attachments: [
        {
          filename: `MilePilot-${String(periodLabel).toLowerCase()}-report-${dateSlug}.pdf`,
          content: pdf,
        },
      ],
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return res.status(500).json({
        sent: false,
        message: result.error.message || "Resend failed",
      });
    }

    console.log("Email sent:", result.data?.id);

    return res.json({
      sent: true,
      messageId: result.data?.id || null,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({
      sent: false,
      message: err.message || "Email send failed",
    });
  }
});

app.post("/reports/subscribe", async (req, res) => {
  try {
    const { email, frequency, prefs, driver } = req.body || {};

    if (!email) {
      return res.status(400).json({
        subscribed: false,
        message: "Email is required",
      });
    }

    if (!["daily", "weekly", "monthly"].includes(frequency)) {
      return res.status(400).json({
        subscribed: false,
        message: "Frequency must be daily, weekly, or monthly",
      });
    }

    console.log("Report subscription saved:", {
      email,
      frequency,
      prefs: prefs || {},
      driver: driver || "",
    });

    return res.json({
      subscribed: true,
      email,
      frequency,
      message: "Report delivery preferences saved",
    });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return res.status(500).json({
      subscribed: false,
      message: err.message || "Subscribe failed",
    });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log("MilePilot backend running on port " + (process.env.PORT || 8787));
});
