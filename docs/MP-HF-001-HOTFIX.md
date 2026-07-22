# MP-HF-001 — Production Boot Syntax Hotfix (handlePos)

**Priority:** EMERGENCY  
**Status:** Isolated hotfix (separate from PR #164)

## Problem

Missing semicolon in `handlePos` inline tracking block prevented the primary application script from parsing:

```javascript
// broken
}else feedAutopilotGps(pos)lastGpsAccuracy=p.acc;

// fixed
}else feedAutopilotGps(pos);lastGpsAccuracy=p.acc;
```

## Scope

- `frontend/index.html` — one-character fix
- `milepilot-upload-v2/index.html` — deployment mirror parity
- `tests/production-boot-syntax.test.js` — acorn parse regression
- `scripts/verify-production-boot.js` — boot smoke gate

Protected systems untouched: MPTaxEngine, Ask MilePilot, reports, PDF, email, onboarding, service worker, APP_VERSION.
