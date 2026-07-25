# RankAura brand assets

Place your **premium design brand sheet** here, then extract logo assets:

```
rankaura-brand-sheet.png   ← your approved design file (required)
```

```bash
cd rankaura
npm run brand:extract
```

This writes exact crops (no SVG recreation):

- `rankaura-mark.png` — RA monogram
- `rankaura-lockup.png` — mark + RANKAURA + tagline

Tune crop regions in `extract-regions.json` if needed.
