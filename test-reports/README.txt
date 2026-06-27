MilePilot PDF Test Pack — MP-012-pdf-v4
========================================

These PDFs were generated from the MP-012 v4 document engine (premium business report layout).

DOWNLOAD ZIP
------------
https://github.com/gypsom54/MilePilot/raw/cursor/mp-012-pdf-layout-fix-ae00/MilePilot-PDF-TEST-MP012-v4.zip

FILES INCLUDED
--------------
01-daily-zero-journeys.pdf     — 0 miles, no journeys (empty day intelligence)
02-daily-single-journey.pdf    — One journey, week context for insights
03-daily-multiple-journeys.pdf — Three journeys same day, journey log entries
04-weekly-full-report.pdf      — Weekly report with 5 shifts, weekly overview
05-large-values.pdf            — 1234.56 miles / large HMRC values (layout stress test)

WHAT TO CHECK
-------------
Page 1: Document title block, financial statement summary (not app cards)
Page 2: Accountant-style journey log + HMRC summary (no value overlap)
Page 3: Weekly overview + trend bar + business insights

BACKEND VERSION
---------------
Report engine: MP-012-pdf-v4
After merging PR #16, redeploy Railway and health should show:
  "reportVersion": "MP-012-pdf-v4"

LIVE TEST (after Railway deploy)
--------------------------------
Download from MilePilot app → Report Centre → Download PDF
Or POST to: https://milepilot-production.up.railway.app/reports/pdf
