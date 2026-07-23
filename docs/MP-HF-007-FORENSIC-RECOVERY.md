# MP-HF-007 — Forensic Recovery of Last Fully Working AutoPilot Build

**Priority:** P0 — RECOVERY BEFORE REBUILD  
**Final verdict:** **WORKING-HISTORY CANDIDATE RECOVERED — FIELD TEST REQUIRED**  
**Recovery branch:** `cursor/mp-hf-007-recover-84363-19bd` @ commit `9b91907`  
**Label:** RECOVERED HISTORICAL CANDIDATE — FIELD TEST REQUIRED

No new architecture. No merge. No tracking code changes on recovery branch except this documentation.

---

## 1. All Candidate Builds Found

| # | Label | Commit / tag | APP_VERSION | version.txt | nativeAutopilot.js | Evidence |
|---|-------|--------------|-------------|-------------|-------------------|----------|
| A | **8.43.63 business (STRONGEST)** | `9b91907` | 8.43.63 | **8.43.57** ⚠ | **YES** | User clue + lockdown doc builds 12–14 lineage |
| B | 8.43.64 onboarding | `a84a0c4` | 8.43.64 | 8.43.64 ✓ | **YES** | Same native stack as A; onboarding lockdown |
| C | 8.43.64 build 16 PRD | `1e2b8c5` | 8.43.64 | 8.43.57 ⚠ | **YES** | PR #133; minor autopilot-motion diff |
| D | 8.43.67 “validated restore” | `f8e5d3f` / `686d370` | 8.43.67 | 8.43.57 ⚠ | **YES** | PR #138; **later field FAIL** — not primary recovery |
| E | v8.43.31 (repo field-validated) | `31918ed` / tag `v8.43.31` | 8.43.31 | 8.43.31 ✓ | **NO** | `TRACKING_BACKGROUND_VITAL_LOCK.md` — BG/locked mileage only; **no** closed-app native AutoPilot |
| F | 8.43.57 closed-app native | `fe54287` | 8.43.57 | — | **YES** | PR #114; introduced `nativeAutopilot.js` |
| G | 8.43.71 (mislabelled) | `549e06e` | **8.43.71** | **8.43.64** ⚠ | **YES** | Filename/internal mismatch confirmed |
| H | current main | `2a985b6` | 8.43.69 | 8.43.69 | **NO** | Field FAIL; nativeAutopilot absent |
| I | HF-002 “restore” | `7ce066d` | 8.43.68 | — | **NO** | Claimed golden restore; **deleted** nativeAutopilot vs `686d370` |
| J | HF-004 / HF-005 | `3158b33` / `afc5784` | 8.43.72 / .73 | — | **NO** | UI/boot fixes only; no nativeAutopilot |

**GitHub releases (no 8.43.63+):** newest tagged Cloudflare release is **v8.43.31** (2026-07-02). No GitHub release artifact for 8.43.63/64.

**Branches:** `cursor/restore-validated-flow-e91d` (686d370), `origin/golden-tracking-engine` (8.43.59), `origin/recovery/tech-fix-84371` (549e06e).

---

## 2. Actual Code Identity of Each Candidate

Grouped by **native tracking stack hash** (not marketing version):

### Group 1 — Full closed-app native AutoPilot stack (includes `src/nativeAutopilot.js`)

Commits: `8dd8d3a` → `fe54287` → … → `9b91907` → `a84a0c4` → `686d370` → `549e06e`

| File | SHA-256 @ `9b91907` |
|------|---------------------|
| `frontend/index.html` | `d665c6f5bce452e3dacd6fdf13d51cc7b4a6e2f89a3ae8b377da6e3cbe642724` |
| `src/nativeAutopilot.js` | `453bee1c43e0fbd51b3079d328e3a613076647fb81e650cc25754f6a467ae1ee` |
| `src/expoLocationBridge.js` | `6f0bbdbc355ccb4ce795544d050f9ab2eab621e55446346479e9c0a44c4d71b8` |
| `frontend/js/autopilot-motion.js` | `74315fec5c394de61c2f1df6a84db60dc4085a9682e9a2add53204b0fec2f3a1` |
| `frontend/js/trip-auto-end.js` | `43c0666e9d03546bd897255a5ffe2a145694b9a45a1156f1b423919e4d5290d3` |

`686d370` differs from `9b91907` in **`frontend/index.html` only (1 line)**. Native stack byte-identical.

### Group 2 — Main-line stack (no nativeAutopilot)

Commits: `bc38440` merge → `a07b197` → … → `b3cbc54` → `7ce066d` → `2a985b6`

Native files match **v8.43.31-era** `locationTask.js` / `nativeTrackingEngine.js` hashes; `expoLocationBridge.js` smaller (no native autopilot handlers).

### Group 3 — v8.43.31 field-validated (background/locked handoff)

Tag `v8.43.31` @ `31918ed` — documented in `TRACKING_CONTRACT.md` / `TRACKING_BACKGROUND_VITAL_LOCK.md`. **No** `ensureAutopilotArmed`, **no** `nativeAutopilot.js`, **no** `autopilot-motion.js` file.

---

## 3. Version Filename / Internal-Version Mismatches

| Artifact | Display / filename | Internal APP_VERSION | version.txt | Notes |
|----------|-------------------|----------------------|-------------|-------|
| Commit `9b91907` | v8.43.63 | 8.43.63 | **8.43.57** | iOS buildNumber **15** |
| Commit `1e2b8c5` | v8.43.64 build 16 | 8.43.64 | **8.43.57** | |
| Commit `549e06e` | **v8.43.71** | 8.43.71 | **8.43.64** | **User-reported mismatch confirmed** |
| Commit `f8e5d3f` | v8.43.67 restore | 8.43.67 | **8.43.57** | |
| Commit `686d370` | v8.43.67 golden | 8.43.67 | 8.43.67 | version.txt fixed at this commit |

**Rule:** Use git commit + file hashes + `nativeAutopilot.js` presence — not folder names.

---

## 4. Strongest Recovered Candidate

**Commit `9b91907` (APP_VERSION 8.43.63)** — recovered on branch `cursor/mp-hf-007-recover-84363-19bd`.

**Why this over v8.43.31:** User historical requirements include **closed-app AutoPilot, motion detection, first-run behaviour** — all require `src/nativeAutopilot.js` + full `expoLocationBridge.js` wiring, present here, **absent on main**.

**Why this over 686d370:** Same native code; `9b91907` is the documented **8.43.63 business-build** tip before version relabelling to 8.43.67. `686d370` later **failed** field tests.

**Why this over a84a0c4:** `a84a0c4` is valid alternate (consistent version.txt); tracking diff is trivial (3-line `autopilot-motion.js` notify text). `9b91907` is later on the same lineage.

---

## 5. Exact Commit / Branch / Artifact

| Item | Value |
|------|-------|
| Recovery commit | `9b91907fef6146d20aa905099782bac7deaed254` |
| Recovery branch | `cursor/mp-hf-007-recover-84363-19bd` |
| Parent chain (native AutoPilot) | `8dd8d3a` → `fe54287` → `16ebc87` → `9b91907` |
| Lock document | `fd86d4d` `docs/TRACKING_ENGINE_LOCKDOWN.md` (docs-only commit, same era) |
| Related PRs | #114 (closed-app v8.43.57), #129 (v8.43.63), #138 (v8.43.67 restore) |

---

## 6. Evidence Linking to Successful Field-Test Period

| Source | File / ref | Line / content | Date |
|--------|-----------|----------------|------|
| Lockdown doc | `docs/TRACKING_ENGINE_LOCKDOWN.md` @ `fd86d4d` | “Field-validated: TestFlight builds **12–14** (closed-app AutoPilot, background, lock-screen)” | 2026-07-05 |
| Same doc | | “`src/nativeAutopilot.js` (closed-app)” in protected table | |
| Same doc | | “`onAutopilotBackgroundLocation` + `hydrateNativeAutopilot`” | |
| Commit | `fe54287` | “Native closed-app AutoPilot detection + home UI lock **v8.43.57 build 12**” | 2026-07-03 |
| Commit | `16ebc87` | “closed-app AutoPilot (**v8.43.59 build 13**)” | |
| Commit | `06d6a92` | “v8.43.60 **build 14**” | |
| Commit | `9b91907` | v8.43.63 — tip of builds 12–15 lineage | 2026-07-07 |
| PR | #114 | Closed-app AutoPilot + home UI lock | CLOSED |
| User spec | MP-HF-007 | 8.43.63 business build — background, locked, calls, Spotify, AutoPilot, 90-min idle | 2026-07-23 |

**Note:** Repo also documents v8.43.31 for background/locked **mileage handoff** (`TRACKING_BACKGROUND_VITAL_LOCK.md`) — a **narrower** claim than full closed-app AutoPilot.

---

## 7. Tracking-File Comparison (recovered vs failed builds)

### Present in `9b91907`, **absent on main** (`2a985b6`):

| Component | Role |
|-----------|------|
| `src/nativeAutopilot.js` | Native closed-app motion + trip start without WebView |
| `expoLocationBridge.js` imports | `setNativeAutopilotArmed`, `loadNativeAutopilotState`, `hydrateNativeAutopilot` |
| `expo:autopilot:arm` handler | Persists native armed state via `setNativeAutopilotArmed(true)` |
| `finishOnboarding()` | Synchronous `ensureAutopilotArmed()` then `goHome()` |
| `renderCommandCentre()` | Calls `renderAutopilotStatusBar()` |
| `bootApp()` | `initTrackingEngine()` **before** `initAutoPilotMotion()`; `restoreNativeTripIfNeeded` |
| `handoffToNativeEngine()` | Full native handoff on lock |

### `7ce066d` (HF-002) vs `686d370` — destructive delta:

```
src/nativeAutopilot.js      | 229 lines DELETED
src/expoLocationBridge.js   | 189 lines removed (native autopilot paths)
```

HF-002 restored **index.html** AutoPilot UI from golden but **dropped** the native closed-app module.

---

## 8. First Destructive Regression Commit

### On main line (loss of `nativeAutopilot.js` never merged):

| Event | Commit | What happened |
|-------|--------|---------------|
| Branch divergence | `bc38440` | Merge MP-047 `autopilot-motion.js` onto main **without** `nativeAutopilot.js` branch (`fe54287` line) |
| Parallel native work | `8dd8d3a` / `fe54287` | Native closed-app on **separate** branch only |
| False “restore” | `7ce066d` (PR #166) | Restored index.html from `686d370` but **removed** `nativeAutopilot.js` relative to golden |
| S6 merge | `b3cbc54` (PR merge) | Business Workspace on main **without** nativeAutopilot |
| Onboarding regression | `2a985b6` | Partial native file restore (v8.43.31 hashes) + broken first-run paths |

### On 63→67 relabelling line (native stack preserved):

| Commit | Impact |
|--------|--------|
| `f8e5d3f` | Version bump to 8.43.67; **native stack unchanged** |
| `686d370` | Rules lock; **native stack unchanged** vs `9b91907` |

**First commit that removed working closed-app behaviour from what reached production users:** **`7ce066d`** (incomplete restore to main) combined with **never merging** `9b91907`'s `src/nativeAutopilot.js`.

---

## 9. Why Tracking Protection Failed

| Question | Answer |
|----------|--------|
| Lock document created? | **Yes** — `TRACKING_ENGINE_LOCKDOWN.md` (`fd86d4d`), `TRACKING_BACKGROUND_VITAL_LOCK.md`, `TRACKING_CONTRACT.md`, `CRITICAL_FILES.md` |
| `nativeAutopilot.js` in CRITICAL_FILES? | **No** — `CRITICAL_FILES.md` lists `locationTask.js`, bridge, index.html; **does not list** `src/nativeAutopilot.js` |
| CODEOWNERS? | Yes for tracking paths — but file never on main |
| Later direct edits to protected files? | **Yes** — `handlePos` on main (MP-S6-001A audit); `bootApp` / `finishOnboarding` regressions |
| Complete-file replacements? | **Yes** — HF-002 replaced bridge without nativeAutopilot |
| Deploy bundles overwrote source? | **Yes** — TestFlight loads live `app.milepilot.uk`; main-line web deploy lacked native module |
| Merge selected incompatible copy? | **Yes** — `bc38440` + S6 merged JS motion without native closed-app branch |
| Frontend/native drift? | **Yes** — native shell could load web bundle from different lineage |
| Tests detect regression? | **No** — `test:autopilot` / `test:tracking` pass without `nativeAutopilot.js`; no first-run closed-app test |

---

## 10. Recovered Build Instructions

```bash
# Isolated recovery — no merge
git fetch origin
git checkout cursor/mp-hf-007-recover-84363-19bd
# Exact commit: 9b91907

# Verify identity
grep APP_VERSION frontend/index.html    # 8.43.63
test -f src/nativeAutopilot.js && echo OK
sha256sum src/nativeAutopilot.js         # 453bee1c...

# Build web deploy (if script exists at this commit)
./build-upload.sh

# Native TestFlight: EAS build from this commit
# ios.buildNumber = 15 at 9b91907
```

**Label deploy:** `RECOVERED HISTORICAL CANDIDATE — FIELD TEST REQUIRED`

---

## 11. Rollback Instructions

If field test fails or wrong candidate:

```bash
# Return to current production main (known broken — do not call fixed)
git checkout main

# Do not delete recovery branch
# Compare alternate: git checkout a84a0c4  (8.43.64, same native stack)

# If recovery passes field test — STOP before merge; user must authorise next spec
```

---

## 12. Remaining Provenance Gaps

1. **No GitHub release artifact** for 8.43.63/64 — cannot prove Cloudflare deploy hash from releases alone.
2. **version.txt mismatch** at `9b91907` (8.43.57 vs APP 8.43.63) — deploy scripts may have served inconsistent labels.
3. **TestFlight build 15** native binary not in repo — EAS build logs not verified in this forensic pass.
4. **User Spotify/calls/Spotify claims** — not found verbatim in repo docs; inferred from lockdown doc “closed-app + lock-screen” scope.
5. **Cannot prove** 9b91907 was the exact binary user drove — only that it is the strongest **source** match to documented working era.
6. **v8.43.31** may still be the true reference for **background mileage math** even if 9b91907 is reference for **full AutoPilot**.

---

## Field test (section 10 of spec)

See `docs/MP-HF-007-FIELD-TEST-SHEET.md`. **User must complete** before any PASS label.

---

## Conversation-derived clue index

| Match | Location | Commit | PR |
|-------|----------|--------|-----|
| “Field-validated TestFlight builds 12–14” | `docs/TRACKING_ENGINE_LOCKDOWN.md` | `fd86d4d` | #124 |
| “`nativeAutopilot.js` (closed-app)” locked | same | `fd86d4d` | #124 |
| “Restore validated tracking flow” | commit message | `f8e5d3f` | #138 |
| “closed-app AutoPilot” | `fe54287`, `16ebc87` | native lineage | #114 |
| v8.43.31 field-validated BG/locked | `TRACKING_BACKGROUND_VITAL_LOCK.md` | `31918ed` | — |
| 8.43.71 → version.txt 8.43.64 | forensic | `549e06e` | recovery/tech-fix-84371 |
| HF-002 “golden v8.43.67” | `docs/MP-HF-002-AUTOPILOT-RESTORE.md` | `7ce066d` | #166 |
| Do not call 8.43.67 golden | `docs/MP-HF-005-AUTOPILOT-ROOT-CAUSE.md` | — | #175 |
