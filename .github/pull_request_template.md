## Summary

<!-- What does this PR change and why? -->

## Tracking system check (required)

MilePilot's mileage tracking is **business critical**. If this PR touches any file below, you must confirm all boxes:

**Protected files:** `frontend/index.html` (tracking block), `native-platform.js`, `tracking-provider.js`, `src/locationTask.js`, `src/expoLocationBridge.js`, `src/MilePilotWebView.js`

- [ ] This PR does **not** modify mileage tracking / background GPS code
- [ ] OR I modified tracking intentionally, ran `npm run test:vital`, tested on a real device (foreground + background + locked screen), and read `docs/TRACKING_CONTRACT.md`

## Report pipeline check (required)

If this PR touches report scheduling, trip store, PDF, or email code:

**Protected files:** `summary-reports.js`, `trip-store.js`, `backend/reportEngine.js`, `backend/server.js`

- [ ] This PR does **not** modify report / trip persistence code
- [ ] OR I modified reports intentionally, ran `npm run test:vital`, sent a test report email, and read `docs/CRITICAL_FILES.md`
