# MilePilot RC3 MASTER

Clean rebuild for the new computer. Use this as the single source of truth.

Before changing anything, read [MILEPILOT_MANIFESTO.md](./MILEPILOT_MANIFESTO.md).

## Frontend local

```powershell
cd "$HOME\Downloads\MilePilot_RC3_MASTER\frontend"
python -m http.server 8000
```

## Backend local

```powershell
cd "$HOME\Downloads\MilePilot_RC3_MASTER\backend"
npm install
npm start
```

## HTTPS phone/GPS test

```powershell
cloudflared tunnel --url http://localhost:8000
```

Open the generated HTTPS URL on iPhone and allow Location.

## Production targets

- app.milepilot.uk = frontend
- api.milepilot.uk = backend
- reports@milepilot.uk = email sender
