import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  buildPdfBuffer,
  buildReportEmailHtml,
  buildReportEmailText,
  buildReportSubject,
  buildVerifyPageHtml,
  REPORT_VERSION,
} from "./reportEngine.js";

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

const pioneerStore = {
  feedback: [],
  errors: [],
  telemetry: [],
};

function pioneerAdminOk(req) {
  const key = process.env.PIONEER_ADMIN_KEY;
  if (!key) return process.env.NODE_ENV !== "production";
  return req.query.key === key || req.headers["x-pioneer-key"] === key;
}

app.get("/pioneer/metrics", (req, res) => {
  if (!pioneerAdminOk(req)) {
    return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  const totals = pioneerStore.telemetry.reduce(
    (acc, t) => {
      const m = t.metrics || {};
      acc.completedShifts += m.completedShifts || 0;
      acc.reportsGenerated += m.reportsGenerated || 0;
      acc.reportsEmailed += m.reportsEmailed || 0;
      acc.totalShiftSeconds += m.totalShiftSeconds || 0;
      if (m.setupCompleted) acc.setupCompleted += 1;
      if (m.gpsGranted === true) acc.gpsGranted += 1;
      if (m.gpsGranted === false) acc.gpsDenied += 1;
      acc.sessions += 1;
      return acc;
    },
    {
      completedShifts: 0,
      reportsGenerated: 0,
      reportsEmailed: 0,
      totalShiftSeconds: 0,
      setupCompleted: 0,
      gpsGranted: 0,
      gpsDenied: 0,
      sessions: 0,
    }
  );
  return res.json({
    ok: true,
    totals,
    averageShiftSeconds: totals.completedShifts
      ? Math.round(totals.totalShiftSeconds / totals.completedShifts)
      : 0,
    setupCompletionRate: totals.sessions
      ? Math.round((totals.setupCompleted / totals.sessions) * 100)
      : 0,
    gpsSuccessRate:
      totals.gpsGranted + totals.gpsDenied
        ? Math.round((totals.gpsGranted / (totals.gpsGranted + totals.gpsDenied)) * 100)
        : null,
    feedbackCount: pioneerStore.feedback.length,
    errorCount: pioneerStore.errors.length,
    recentFeedback: pioneerStore.feedback.slice(0, 10),
    recentErrors: pioneerStore.errors.slice(0, 10),
    reportVersion: REPORT_VERSION,
    timestamp: new Date().toISOString(),
  });
});

app.post("/pioneer/feedback", (req, res) => {
  try {
    const entry = {
      ...req.body,
      receivedAt: new Date().toISOString(),
    };
    pioneerStore.feedback.unshift(entry);
    if (pioneerStore.feedback.length > 200) pioneerStore.feedback.pop();
    console.log("Pioneer feedback:", entry.ease, entry.confused?.slice(0, 40));
    return res.json({ ok: true, saved: true });
  } catch (err) {
    console.error("Pioneer feedback failed:", err);
    return res.status(500).json({ ok: false, message: "Could not save feedback" });
  }
});

app.post("/pioneer/errors", (req, res) => {
  try {
    const entry = { ...req.body, receivedAt: new Date().toISOString() };
    pioneerStore.errors.unshift(entry);
    if (pioneerStore.errors.length > 500) pioneerStore.errors.pop();
    console.error("Pioneer client error:", entry.message);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
});

app.post("/pioneer/telemetry", (req, res) => {
  try {
    const entry = { ...req.body, receivedAt: new Date().toISOString() };
    pioneerStore.telemetry.unshift(entry);
    if (pioneerStore.telemetry.length > 500) pioneerStore.telemetry.pop();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "milepilot-api",
    resendConfigured: !!process.env.RESEND_API_KEY,
    from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
    reportVersion: REPORT_VERSION,
    timestamp: new Date().toISOString(),
  });
});

app.get("/reports/verify/:reportId", (req, res) => {
  const reportId = req.params.reportId || "";
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(buildVerifyPageHtml(reportId));
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
      reportVersion: REPORT_VERSION,
    });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({
      sent: false,
      message: err.message || "Email send failed",
    });
  }
});

app.post("/reports/pdf", async (req, res) => {
  try {
    const pdf = await buildPdfBuffer(req.body);
    const periodLabel = req.body.period || "Daily";
    const dateSlug = new Date().toISOString().slice(0, 10);
    const filename = `MilePilot-${String(periodLabel).toLowerCase()}-report-${dateSlug}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    console.error("PDF generation failed:", err);
    return res.status(500).json({
      message: err.message || "PDF generation failed",
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
  console.log("Report engine:", REPORT_VERSION);
});
