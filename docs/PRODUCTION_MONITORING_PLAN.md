# MilePilot Production Monitoring Plan

**North star:** MilePilot must never silently break background mileage tracking or automatic report delivery.

This document defines what to monitor, how to alert, and the health dashboard plan. Implementation is phased — start with zero-cost signals, then add paid observability as traffic grows.

---

## 1. What must never fail silently

| Subsystem | User impact if broken | Detection signal |
|-----------|----------------------|-------------------|
| Background GPS | Miles not recorded → lost HMRC claims | Client error events, zero-mile shifts, stale GPS logs |
| Lock-screen tracking | Same as above on TestFlight / native | `nativeGps` gap metrics, background task errors |
| Stationary grace | False stop events, driver confusion | Stop count vs drive duration anomalies |
| Trip persistence | Trips vanish after app kill | `mp_trips` save failures, restore errors |
| Report scheduling | No automatic daily summary | Missed `checkScheduledReports` sends |
| PDF generation | Email arrives without attachment | `/reports/pdf` 5xx, PDF byte size = 0 |
| Email delivery | Driver never receives report | Resend API errors, `sent: false` responses |

---

## 2. Frontend crash reporting

### Recommendation: Sentry (or equivalent)

**Scope:** `frontend/index.html`, native shell (`App.js`, `MilePilotWebView.js`).

| Event | Tags | Alert threshold |
|-------|------|-----------------|
| Unhandled exception | `surface: pwa\|native` | > 5 events / hour |
| GPS watch error | `gps.error_code` | Any spike after deploy |
| `checkGpsStale` reconnect loop | `gps.stale` | > 10 / user / hour |
| Trip save failure | `trip.save_failed` | Any occurrence |
| Report schedule failure | `report.schedule_failed` | Any occurrence |

**Implementation sketch:**

```javascript
// After Sentry SDK load (PWA)
Sentry.init({ dsn: process.env.SENTRY_DSN, release: 'milepilot@8.28.1' });
window.addEventListener('error', (e) => Sentry.captureException(e.error));
// In onGpsWatchError:
Sentry.captureMessage('GPS watch error', { level: 'warning', extra: { code } });
```

**Native:** `@sentry/react-native` in Expo shell, same release string as PWA version.

**Privacy:** Strip email addresses and precise coordinates from breadcrumbs; keep trip IDs and error codes only.

---

## 3. Backend error logging

### Recommendation: structured JSON logs on Railway

**Scope:** `backend/server.js`, `backend/reportEngine.js`.

| Log field | Example |
|-----------|---------|
| `level` | `error` |
| `event` | `email_send_failed` |
| `reportPeriod` | `Daily` |
| `message` | Resend error text |
| `requestId` | UUID per request |

**Required log events:**

- `email_send_failed` — Resend returned error
- `pdf_generation_failed` — `buildPdfBuffer` threw
- `report_download_miss` — invalid/expired token
- `health_check` — periodic self-check (optional)

**Aggregation:** Railway log drains → Axiom, Datadog, or Better Stack (pick one).

**Alert:** `level:error` count > 3 in 15 minutes → Slack / email to ops.

---

## 4. API uptime monitoring

### Recommendation: Better Uptime or UptimeRobot (free tier)

| Check | URL | Interval | Alert |
|-------|-----|----------|-------|
| Health | `GET https://milepilot-production.up.railway.app/health` | 1 min | 2 consecutive failures |
| PDF endpoint | `POST /reports/pdf` with fixture body | 15 min | 1 failure |
| Download | `GET /reports/download/{test-token}` | 15 min | 404 on valid test token |

**Health response today:**

```json
{
  "ok": true,
  "service": "milepilot-api",
  "resendConfigured": true,
  "reportVersion": "MP-019-route-maps",
  "timestamp": "..."
}
```

Extend `/health` later with:

- `lastEmailSentAt` (from metrics store)
- `pdfEngineOk: true` (lightweight `buildPdfBuffer` smoke on startup — optional)

---

## 5. Failed email delivery alerts

| Source | Condition | Action |
|--------|-----------|--------|
| `POST /reports/send` | HTTP 500 or `sent: false` | Log `email_send_failed`, increment counter |
| Resend webhook | `email.bounced`, `email.complained` | Alert + mark address invalid |
| Frontend | `apiPost('/reports/send')` rejection | Sentry warning |

**Dashboard metric:** `failed_emails_24h`

**Alert rule:** `failed_emails_24h > 0` AND `successful_emails_24h > 0` → investigate (allows first-time setup failures to be ignored if volume is zero).

---

## 6. Failed PDF generation alerts

| Source | Condition | Action |
|--------|-----------|--------|
| `buildPdfBuffer` catch | Exception thrown | Log `pdf_generation_failed` |
| `POST /reports/pdf` | 500 response | Uptime check failure |
| Email path | PDF buffer length < 1000 | Log + reject send |

**Dashboard metric:** `failed_pdfs_24h`

**Regression guard:** `tests/reports-regression.test.js` in CI on every PR.

---

## 7. Failed report scheduling alerts

Frontend scheduling runs client-side (`MPSummaryReports.checkScheduledReports` every 60s). Failures are invisible to the server unless reported.

| Signal | Implementation |
|--------|----------------|
| Client beacon | On `sendAutomaticReport` failure → `POST /telemetry/report-failed` (new lightweight endpoint) |
| Sentry | Capture `report.schedule_failed` with `type: daily\|weekly\|monthly` |
| Anomaly | User with completed shift yesterday but no `mp_auto_report_sent_*` key |

**Dashboard metric:** `failed_report_schedules_24h`

---

## 8. Background tracking error alerts

| Signal | Source |
|--------|--------|
| `gps.watch_error` | `onGpsWatchError` in `index.html` |
| `gps.stale_reconnect` | `scheduleGpsReconnect` fired |
| `gps.background_poll_miss` | Poll timer not firing (client heartbeat) |
| `native.location_task_error` | `locationTask.js` catch block |

**Client heartbeat (recommended):**

Every 5 minutes while shift active, POST anonymised ping:

```json
{ "event": "tracking_heartbeat", "miles": 12.4, "gpsAgeMs": 8000, "native": true }
```

**Alert:** `gpsAgeMs > 120000` for active shift → page on-call.

---

## 9. Health dashboard plan

### Phase 1 — Ops table (Railway + spreadsheet or Retool)

| Metric | Source | Refresh |
|--------|--------|---------|
| Active users (24h) | Sentry unique users or heartbeat count | Hourly |
| Trips recorded today | Aggregate `tracking_heartbeat` or trip sync endpoint | Hourly |
| Failed trips | Shifts with `miles === 0` and `seconds > 600` | Daily |
| Failed reports | `failed_report_schedules_24h` | Hourly |
| Failed emails | `failed_emails_24h` | Hourly |
| Background tracking errors | `gps.*` Sentry issues | Real-time |

### Phase 2 — MilePilot Ops dashboard (recommended stack)

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  PWA + Native   │────▶│   Sentry     │────▶│  Alerts (Slack) │
│  (errors, GPS)  │     └──────────────┘     └─────────────────┘
└────────┬────────┘
         │ heartbeat / telemetry
         ▼
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Railway API    │────▶│  Axiom/DD    │────▶│  Retool / Grafana│
│  /health, logs  │     └──────────────┘     │  Health dashboard│
└─────────────────┘                          └─────────────────┘
```

**Dashboard panels:**

1. **Active users** — distinct `tracking_heartbeat` device IDs, 24h rolling
2. **Trips recorded today** — count of `endShiftCommandCentre` events (client) or completed trips in telemetry store
3. **Failed trips** — zero-mile shifts > 10 min duration
4. **Failed reports** — scheduling + send failures
5. **Failed emails** — Resend errors
6. **Background tracking errors** — GPS watch errors + stale reconnect rate

### Phase 3 — `/admin/metrics` (optional internal endpoint)

Protected by `ADMIN_API_KEY`. Returns JSON snapshot for Retool:

```json
{
  "activeUsers24h": 42,
  "tripsToday": 128,
  "failedTrips24h": 2,
  "failedReports24h": 1,
  "failedEmails24h": 0,
  "gpsErrors24h": 5,
  "apiOk": true,
  "reportVersion": "MP-019-route-maps"
}
```

Store counters in Redis or Postgres — not required for launch if Sentry + logs cover Phase 1.

---

## 10. CI regression guard (already in repo)

| Check | Workflow | When |
|-------|----------|------|
| Tracking contract | `production-guard.yml` | Every PR + main |
| Reports contract | `production-guard.yml` | Every PR + main |
| Tracking regression tests | `production-guard.yml` | Every PR + main |
| Reports regression tests | `production-guard.yml` | Every PR + main |
| Trip persistence tests | `production-guard.yml` | Every PR + main |

Run locally: `npm run test:vital`

---

## 11. Deploy verification checklist

After every production deploy:

1. [ ] `GET /health` returns `ok: true`
2. [ ] Start shift on real device → background 2 min → miles increase
3. [ ] Lock phone 2 min → miles still increase (TestFlight)
4. [ ] End shift → trip in history
5. [ ] Trigger test report email → PDF attached
6. [ ] Sentry release tagged with version string

---

## 12. Incident response

| Severity | Condition | Response |
|----------|-----------|----------|
| P0 | Background miles not recording | Roll back PWA + pause TestFlight; hotfix branch |
| P1 | Reports not sending | Check Resend status + Railway logs |
| P2 | PDF layout broken | Reports still deliver; fix forward |
| P3 | Dashboard gap | Monitor via logs until Phase 2 |

**Rollback order:** Cloudflare PWA version pin → Railway API → EAS build (slowest).
