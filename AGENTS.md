# MilePilot RC3

MilePilot is a mileage-tracking app. It has two parts:

- `frontend/` — a static PWA (`index.html` + `manifest.json` + `service-worker.js`). Served as static files; no build step.
- `backend/` — a Node.js (ESM) Express server (`server.js`) that builds PDF mileage reports and emails them via Resend.

Standard run commands live in `README.md` and `backend/package.json`.

## Cursor Cloud specific instructions

### Services
- Frontend: static files served with `python3 -m http.server 8000` from `frontend/` (README uses port 8000). Open `http://localhost:8000/index.html`.
- Backend: `npm start` (= `node server.js`) from `backend/`. Listens on `PORT` or `8787` by default. The frontend talks to `http://localhost:8787` unless `localStorage.mp_api_base` is overridden.

### Gotchas
- The backend WILL NOT BOOT without `RESEND_API_KEY` set. The `resend` client throws `Missing API key` in its constructor at startup (`server.js` line ~14). For dev where you don't need real email, start with a placeholder, e.g. `RESEND_API_KEY=re_placeholder_dev_key npm start`. A real Resend key is only required to actually send report emails (`POST /reports/send`); everything else (onboarding, GPS tracking, shift history, report totals, local print/PDF) works without it.
- There is no lint config and no automated test suite in this repo (no `lint`/`test` scripts). The only npm script is `start`.
- App state (driver name, vehicle, saved shifts, email) is stored in browser `localStorage`, not in the backend. The backend is stateless and only generates/emails PDFs.
- GPS live tracking requires HTTPS (or `localhost`); the README documents a `cloudflared` tunnel for phone testing.
