MilePilot — Ready to Upload
============================

This folder contains the NEW welcome screen design.
You do NOT need git. Just upload these files.

WHAT'S INSIDE
-------------
frontend/
  index.html      ← new premium welcome screen
  manifest.json
  icon.svg
  service-worker.js

OPTION 1 — Upload to Cloudflare (live site)
--------------------------------------------
1. Log in to Cloudflare Dashboard
2. Workers & Pages → your MilePilot project
3. Create deployment → Upload assets
4. Upload the contents of the "frontend" folder
   (all 4 files — NOT the folder itself, the files inside it)
5. Deploy
6. Open app.milepilot.uk and hard refresh (Ctrl+Shift+R)

OPTION 2 — Test on your computer first
---------------------------------------
1. Open PowerShell
2. Run:
   cd path\to\UPLOAD_TO_CLOUDFLARE\frontend
   python -m http.server 8000
3. Open http://localhost:8000 in Chrome

HOW TO CHECK IT WORKED
----------------------
You should see:
- "Mile Pilot" logo with blue underline beneath it
- "Your driving business. On auto pilot." heading below the underline
- "Let's get started" and "What's your first name?"
- NO car emoji, NO "DRIVE • TRACK • CLAIM"

If you still see the old design, you uploaded the wrong files.
