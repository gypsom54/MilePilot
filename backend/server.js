import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  buildPdfBuffer,
  buildReportEmailHtml,
  buildReportEmailText,
  buildReportSubject,
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
