# Resend setup

Domain is milepilot.uk.

Use sender:
reports@milepilot.uk

## Railway variables (required)

The backend uses the **Resend API**, not SMTP.

| Variable | Value |
|----------|--------|
| `RESEND_API_KEY` | Your key from resend.com (starts with `re_`) |
| `EMAIL_FROM` | `MilePilot <reports@milepilot.uk>` |

Do **not** rely on `SMTP_USER` / `SMTP_PASS` — the app does not read those.

## Test the backend

Open in browser:

```
https://milepilot-production.up.railway.app/health
```

Should show `"resendConfigured": true`.

## Custom domain (optional)

When ready, point **api.milepilot.uk** at Railway in Networking → Custom Domain.

Until then, the app uses **milepilot-production.up.railway.app** automatically.

## If email fails with "API key is invalid"

1. Resend dashboard → **API Keys** → create a new key
2. Railway → MilePilot → **Variables** → set `RESEND_API_KEY` to the new key
3. Redeploy and try again
