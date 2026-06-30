# Railway deploy — MilePilot backend

The backend handles **PDF reports**, **email delivery**, **beta feedback**, and **report subscriptions**.

**Live URL:** https://milepilot-production.up.railway.app  
**Health check:** https://milepilot-production.up.railway.app/health

---

## Quick deploy (GitHub connected)

If Railway is already linked to the MilePilot GitHub repo:

1. Open **https://railway.app** → your **MilePilot** project
2. Click the **backend** service (root folder should be `backend/`)
3. Go to **Settings** → confirm **Root Directory** = `backend`
4. Go to **Deployments** → **Deploy** (or merge your PR to the branch Railway watches, usually `main`)
5. Wait until status is **Active** / green
6. Open `/health` — confirm:
   - `"ok": true`
   - `"reportVersion": "MP-017-premium-reports"` (after latest polish deploy)

Railway redeploys automatically when you push to the connected branch.

---

## Required environment variables

In Railway → **Variables**:

| Variable | Value |
|----------|--------|
| `RESEND_API_KEY` | Your Resend key (`re_…`) |
| `EMAIL_FROM` | `MilePilot <reports@milepilot.uk>` |

Optional:

| Variable | Value |
|----------|--------|
| `FEEDBACK_TO` | Your email — receives beta feedback submissions |
| `PORT` | Railway sets this automatically |

After changing variables, click **Redeploy**.

---

## Manual deploy (no GitHub link)

1. On your machine, copy the `backend/` folder
2. Railway → **New Project** → **Empty project**
3. **New** → **GitHub Repo** or **Deploy from local** (Railway CLI: `railway up` from `backend/`)
4. Set root directory to `backend`
5. Add variables above
6. Deploy

---

## Verify after deploy

```text
GET https://milepilot-production.up.railway.app/health
```

Expected:

```json
{
  "ok": true,
  "service": "milepilot-api",
  "resendConfigured": true,
  "reportVersion": "MP-017-premium-reports"
}
```

Then in the app: send a test report email and confirm the new PDF/email design arrives.

---

## What Railway does NOT update

Railway only deploys the **API**. It does **not** update:

- The PWA at **app.milepilot.uk** → upload **Cloudflare** zip
- The **TestFlight** native app → new build in App Store Connect if the app bundles local files

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Email fails | Check `RESEND_API_KEY` in Variables, redeploy |
| Old PDF design | `/health` shows old `reportVersion` — redeploy backend from latest branch |
| `RESEND_API_KEY is missing` | Add key in Railway Variables |
