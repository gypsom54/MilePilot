# MilePilot — Automatic Web Deploy (no more manual zips)

Deploys the web app to Cloudflare Pages automatically via GitHub Actions
(`.github/workflows/deploy-cloudflare.yml`). No zip downloads, no Cloudflare
uploads, no version mismatches — the build regenerates `version.txt` from
`APP_VERSION` every time.

## One-time setup (about 2 minutes)

You only do this once.

### 1. Create a Cloudflare API token
1. Cloudflare dashboard → top-right profile → **My Profile** → **API Tokens**.
2. **Create Token** → use the **"Edit Cloudflare Pages"** template
   (or Custom token → Permissions: **Account · Cloudflare Pages · Edit**).
3. Account Resources: your account. **Continue → Create Token → Copy** it.

### 2. Add it to GitHub
1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: paste the token.
3. Save.

That's it.

## From now on

- **Auto:** when a change lands on `main`, it deploys to `app.milepilot.uk` automatically.
- **On demand:** GitHub → **Actions** tab → **Deploy to Cloudflare Pages** → **Run workflow** → pick a branch → **Run**. Watch it go green.

Account ID (`e85ff511e5a4e0f1bd6a8ce7baf07fbf`) and project (`milepilot-app`)
are baked into the workflow, so the token is the only secret needed.

## If the first deploy lands as a "preview" instead of production
Cloudflare Pages → **milepilot-app** → **Settings** → **Builds & deployments** →
set **Production branch** to `main`. One-time. Then re-run the workflow.

## Verify
- https://app.milepilot.uk/version.txt matches the app's version.
- Force-quit MilePilot on the phone and reopen (service worker refreshes).
