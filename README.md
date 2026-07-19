# MilePilot RC3 MASTER

Clean rebuild for the new computer. Use this as the single source of truth.

## AMOS Sprint 1 (Architecture Only)

AMOS foundation is implemented as an additive module in `amos/` with deterministic intent routing and a single wrapped journey summary tool.

- Architecture docs: `amos/README.md`
- AMOS tests: `npm run test:amos`
- AMOS harness: `npm run amos:harness`

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
