/**
 * VITAL — BUSINESS CRITICAL (MP-044)
 * Report API: /health, /reports/send, /reports/pdf, email delivery via Resend.
 * Do not modify report routes without explicit approval.
 * Contract: scripts/reports-contract.json · See docs/CRITICAL_FILES.md
 */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import {
  buildPdfBuffer,
  buildReportEmailHtml,
  buildReportEmailText,
  buildReportSubject,
  buildReportArchiveDeepLink,
  buildDemoTestReport,
  REPORT_VERSION,
} from "./reportEngine.js";
import { storeReportDownload, getStoredDownload } from "./reportDownload.js";
import { loadEmailTemplate } from "./emailTemplate.js";
import { runAmosQuery } from "./amosRuntime.js";

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

function isAllowedOrigin(origin) {
  if (!origin || ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith(".pages.dev") || origin.endsWith(".milepilot.uk")) return true;
  return false;
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
  })
);
app.use(express.json({ limit: "2mb" }));

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/health", (req, res) => {
  let emailTemplateOk = false;
  try {
    emailTemplateOk = loadEmailTemplate().length > 100;
  } catch {
    emailTemplateOk = false;
  }
  res.json({
    ok: true,
    service: "milepilot-api",
    resendConfigured: !!process.env.RESEND_API_KEY,
    emailTemplateOk,
    from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
    reportVersion: REPORT_VERSION,
    timestamp: new Date().toISOString(),
  });
});

app.post("/amos/query", async (req, res) => {
  try {
    const run = await runAmosQuery(req.body || {});
    if (!run.ok) {
      return res.status(run.statusCode || 400).json({
        ok: false,
        message: run.message || "Invalid AMOS query",
      });
    }

    return res.json({
      ok: true,
      workflowId: run.result?.workflowId || null,
      response: run.result?.response || null,
      toolResult: run.result?.toolResult || null,
    });
  } catch (err) {
    console.error("AMOS query failed:", err);
    return res.status(500).json({
      ok: false,
      message: "The journey engine is currently unavailable.",
    });
  }
});

async function deliverReportEmail(report, attachmentFilename) {
  const pdf = await buildPdfBuffer(report);
  const pdfBuffer = Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
  const { downloadUrl } = storeReportDownload(report, pdfBuffer);
  const emailOptions = {
    pdfDownloadUrl: downloadUrl,
    archiveUrl: buildReportArchiveDeepLink(),
  };
  const subject = buildReportSubject(report) || "Your MilePilot Business Mileage Report";

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
    to: report.email,
    subject,
    text: buildReportEmailText(report, emailOptions),
    html: buildReportEmailHtml(report, emailOptions),
    attachments: [
      {
        filename: attachmentFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  if (result.error) {
    throw new Error(result.error.message || "Resend failed");
  }

  return {
    messageId: result.data?.id || null,
    pdfFilename: attachmentFilename,
  };
}

app.post("/reports/send-test", async (req, res) => {
  try {
    const { email, driver } = req.body || {};

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        sent: false,
        message: "RESEND_API_KEY is missing in Railway variables",
      });
    }

    if (!email) {
      return res.status(400).json({
        sent: false,
        message: "Email is required",
      });
    }

    const report = buildDemoTestReport(email, driver);
    const dateSlug = new Date().toISOString().slice(0, 10);
    const delivery = await deliverReportEmail(report, `MilePilot-test-report-${dateSlug}.pdf`);

    console.log("Test email sent:", delivery.messageId, "to", email);

    return res.json({
      sent: true,
      test: true,
      messageId: delivery.messageId,
      reportVersion: REPORT_VERSION,
      pdfAttached: true,
      pdfFilename: delivery.pdfFilename,
      message: `Test report sent to ${email}`,
    });
  } catch (err) {
    console.error("Test email send failed:", err);
    return res.status(500).json({
      sent: false,
      message: err.message || "Test email send failed",
    });
  }
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

    const periodLabel = report.period || "Daily";
    const dateSlug = new Date().toISOString().slice(0, 10);
    const attachmentNames = {
      WeeklySummary: `MilePilot-weekly-insights-summary-${dateSlug}.pdf`,
      MonthlySummary: `MilePilot-monthly-insights-summary-${dateSlug}.pdf`,
    };
    const attachmentFilename =
      attachmentNames[periodLabel] || `MilePilot-${String(periodLabel).toLowerCase()}-report-${dateSlug}.pdf`;

    const delivery = await deliverReportEmail(report, attachmentFilename);

    console.log("Email sent:", delivery.messageId);

    return res.json({
      sent: true,
      messageId: delivery.messageId,
      reportVersion: REPORT_VERSION,
      pdfAttached: true,
      pdfFilename: delivery.pdfFilename,
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

app.post("/reports/preview", async (req, res) => {
  try {
    const report = req.body || {};
    const pdf = await buildPdfBuffer(report);
    const { downloadUrl } = storeReportDownload(report, pdf);
    const html = buildReportEmailHtml(report, {
      pdfDownloadUrl: downloadUrl,
      archiveUrl: buildReportArchiveDeepLink(),
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error("Preview failed:", err);
    return res.status(500).json({
      message: err.message || "Preview failed",
    });
  }
});

app.get("/reports/download/:token", async (req, res) => {
  try {
    const entry = getStoredDownload(req.params.token);
    if (!entry) {
      return res.status(404).send("This download link has expired. Open MilePilot to download your report again.");
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${entry.filename}"`);
    res.setHeader("Content-Length", String(entry.pdfBuffer.length));
    res.send(entry.pdfBuffer);
  } catch (err) {
    console.error("Download failed:", err);
    return res.status(500).send("Could not download report.");
  }
});

app.post("/feedback", async (req, res) => {
  try {
    const { email, driver, appVersion, answers, submittedAt } = req.body || {};

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ ok: false, message: "Feedback answers are required" });
    }

    const entry = {
      email: email || "",
      driver: driver || "",
      appVersion: appVersion || "",
      answers,
      submittedAt: submittedAt || new Date().toISOString(),
    };

    console.log("Beta feedback received:", JSON.stringify(entry, null, 2));

    if (process.env.RESEND_API_KEY && process.env.FEEDBACK_TO) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "MilePilot <reports@milepilot.uk>",
        to: process.env.FEEDBACK_TO,
        subject: `MilePilot Beta Feedback — ${driver || email || "Anonymous"}`,
        text: Object.entries(answers)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      });
    }

    return res.json({ ok: true, message: "Feedback received — thank you." });
  } catch (err) {
    console.error("Feedback failed:", err);
    return res.status(500).json({ ok: false, message: err.message || "Feedback failed" });
  }
});

app.listen(process.env.PORT || 8787, () => {
  console.log("MilePilot backend running on port " + (process.env.PORT || 8787));
  console.log("Report engine:", REPORT_VERSION);
});
