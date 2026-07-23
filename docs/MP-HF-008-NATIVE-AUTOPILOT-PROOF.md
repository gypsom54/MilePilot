# MP-HF-008 — Recovered Native AutoPilot Proof and Safe Restoration Plan

**Priority:** P0 — CORE TRACKING RECOVERY  
**Final verdict:** **RECOVERED ENGINE VERIFIED IN BUILD — FIELD TEST REQUIRED**  
**Recovery commit:** `9b91907` · **PR #176 — DO NOT MERGE**

Static build analysis confirms `src/nativeAutopilot.js` is **imported, registered, and invoked** in the recovered candidate. Field behaviour is **not** proven until Tests 1–7 pass on a real iPhone.

---

## 1. Proof: `nativeAutopilot.js` compiled into recovered build

| Check | Result | Evidence |
|-------|--------|----------|
| File exists at `9b91907` | **YES** | `src/nativeAutopilot.js` (229 lines) |
| Metro import chain | **YES** | `index.js` → `locationTask.js` → `nativeAutopilot.js`; `expoLocationBridge.js` → `nativeAutopilot.js`; `MilePilotWebView.js` → `nativeAutopilot.js` |
| iOS bundle inclusion | **YES (by import graph)** | Expo/Metro bundles all reachable `src/` modules; no dynamic `require` exclusion |
| Compiled binary proof | **NOT VERIFIED IN CI** | Requires EAS build artefact inspection or Xcode archive symbol table — **provenance gap** |

**Conclusion:** Present and reachable in source build graph. Not merely an orphan file.

---

## 2. Proof: registered and invoked at runtime

| Checkpoint | Active? | File | Function / call |
|------------|---------|------|-----------------|
| BG task registration | **YES** | `index.js:7` | `import './src/locationTask'` before `registerRootComponent` |
| TaskManager.defineTask | **YES** | `locationTask.js:56` | `MILEPILOT_BACKGROUND_LOCATION` |
| Hydrate on cold BG start | **YES** | `locationTask.js:65` | `await hydrateNativeAutopilot()` |
| Native motion on BG location | **YES** | `locationTask.js:85` | `onAutopilotBackgroundLocation(payload)` |
| App startup init | **YES** | `MilePilotWebView.js:88` | `initNativeTracking()` |
| Re-arm on cold launch | **YES** | `expoLocationBridge.js:215-225` | `loadNativeAutopilotState()` → `ensureAutopilotBackgroundLocation()` |
| WebView arm command | **YES** | `expoLocationBridge.js:393-419` | `expo:autopilot:arm` → `setNativeAutopilotArmed(true)` |
| Lock-screen BG ensure | **YES** | `MilePilotWebView.js:127-131` | `ensureAutopilotBackgroundLocation()` when armed |
| Foreground autopilot path | **YES** | `expoLocationBridge.js:111-116` | `pushLocationAndSync` → `onAutopilotBackgroundLocation` |

**If file were present but unused:** would fail `tests/native-autopilot-guard.test.js`.

---

## 3. Complete native startup trace

```
[User selects AutoPilot in onboarding]
  JS: localStorage mp_tracking_mode, mp_onboard_complete
  File: frontend/index.html :: finishOnboarding()
  → ensureAutopilotArmed() [async, not awaited]
  → goHome()

[JS arming]
  MPAutoPilotMotion.syncLifecycle() → armMonitoring() → armNative()
  File: frontend/js/autopilot-motion.js :: armMonitoring()
  Bridge: MPExpoBridge.request('expo:autopilot:arm', { background: true })

[Native arm — persists without WebView]
  File: expoLocationBridge.js :: case 'expo:autopilot:arm'
  → setNativeAutopilotArmed(true)
     File: nativeAutopilot.js :: persistState()
     Disk: milepilot_native_autopilot.json { armed: true, ... }
  → ensureAutopilotBackgroundLocation()
     → startBackgroundLocationUpdates()
     File: locationTask.js :: startLocationUpdatesAsync('MILEPILOT_BACKGROUND_LOCATION')
  → startForegroundWatch + startAutopilotPoll (8s fallback)

[Cold start / process relaunch — WebView optional]
  index.js imports locationTask (task registered)
  MilePilotWebView mount → initNativeTracking()
  → loadNativeAutopilotState() → if armed → ensureAutopilotBackgroundLocation()

[Background callback — WebView suspended OK]
  iOS → TaskManager MILEPILOT_BACKGROUND_LOCATION
  locationTask.js handler:
  → hydrateNativeAutopilot()  [reload armed from disk]
  → ingestNativeLocation (if trip already active)
     OR onAutopilotBackgroundLocation(payload) [if armed, no trip]

[Native trip start — no WebView required]
  nativeAutopilot.js :: onAutopilotBackgroundLocation
  → sustained speed ≥4.47 m/s for 10s, ≥2 samples
  → startNativeTrip({ shiftId, startedAt, ... })
  → syncNativeAutoEnd({ inactivityMs: 90min })
  → notifyTripStarted()
  Disk: milepilot_native_trip.json

[WebView reconciliation when available]
  queueSync(autoTrip) in locationTask
  MilePilotWebView pushNativeState on resume
  index.html :: applyNativeTripSync / restoreNativeTripFromSync

[Dashboard]
  renderAutopilotStatusBar(), renderCommandCentre()

[Auto-end]
  nativeAutoEnd.js (native) + MPTripAutoEnd (JS) — 90 min idle

[Reports]
  triggerAutopilotShiftReport → MPSummaryReports → email (unchanged pipeline)
```

---

## 4. Native persistence findings

| State | Native disk | WebView only |
|-------|-------------|--------------|
| AutoPilot armed | **YES** — `milepilot_native_autopilot.json` | `mp_onboard_complete`, `mp_tracking_mode` in localStorage |
| Motion candidate | **YES** — same file | — |
| Active native trip | **YES** — `milepilot_native_trip.json` | `mp_active_shift` after JS restore |
| Native auto-end deadline | **YES** — `nativeAutoEnd.js` state | MPTripAutoEnd mirrors on sync |
| Tracking mode preference | **NO** | localStorage only |
| Bridge-ready flag | **NO** | runtime only |

**Limitation:** Tracking mode is WebView-only; native uses `armed` boolean set only via `expo:autopilot:arm`. If onboarding exits before bridge round-trip, native may remain disarmed — **Test 1 validates this**.

---

## 5. Background callback findings

| Setting | Value | File |
|---------|-------|------|
| Task ID | `MILEPILOT_BACKGROUND_LOCATION` | `locationTask.js` |
| API | `Location.startLocationUpdatesAsync` | expo-location |
| accuracy | `BestForNavigation` | |
| distanceInterval | 5m | |
| timeInterval | 3000ms | |
| pausesUpdatesAutomatically | **false** | |
| activityType | `AutomotiveNavigation` | |
| showsBackgroundLocationIndicator | **true** | |
| UIBackgroundModes | `location`, `fetch`, `remote-notification` | `app.config.js` |
| Significant-change monitoring | **NOT PRESENT** | — |

**Can receive locations before WebView ready:** **YES** — if `armed` persisted and `startBackgroundLocationUpdates` succeeded.  
**After onboarding exit:** **CONDITIONAL** — requires `setNativeAutopilotArmed(true)` completed before process suspension.  
**While locked:** **YES** — standard iOS BG location with Always permission.

---

## 6. Native trip-start findings

| Capability | Recovered `9b91907` |
|------------|---------------------|
| Evaluates movement natively | **YES** — `onAutopilotBackgroundLocation` speed/GPS delta |
| Vehicular threshold | **YES** — 4.47 m/s (~10 mph), 10s sustained |
| Creates active native trip | **YES** — `startNativeTrip()` |
| Persists immediately | **YES** — `nativeTrackingEngine` persistState |
| Records journey start | **YES** — shiftId, startedAt, route |
| Queues JS reconciliation | **YES** — `queueSync(autoTrip)` |
| Duplicate prevention | **PARTIAL** — `isNativeTripActive()` guard; JS `shouldIgnoreStaleNativeRestore` on resume |

**Does NOT merely log and wait for reopen** — trip recording begins natively at auto-start.

---

## 7. JavaScript reconciliation findings

| Function | Role @ 9b91907 |
|----------|----------------|
| `hydrateNativeAutopilot()` | Native only (BG cold start) |
| `applyNativeTripSync()` | Merges native miles; calls `restoreNativeTripFromSync` if trip active + web idle |
| `restoreNativeTripIfNeeded()` | Boot + resume bridge request |
| `restoreNativeTripFromSync()` | Promotes native trip to `ccState='active'` |
| `bootApp()` | `initTrackingEngine` before `initAutoPilotMotion`; `restoreNativeTripIfNeeded` @ 800ms |
| `finishOnboarding()` | `ensureAutopilotArmed()` then `goHome()` |
| `ensureAutopilotArmed()` | Native enableTracking + motion syncLifecycle |
| `renderAutopilotStatusBar()` | Called from `renderCommandCentre()` |

---

## 8. Auto-end findings

- Native: `syncNativeAutoEnd({ inactivityMs: 90 * 60 * 1000 })` on native auto-start
- Web: `MPTripAutoEnd` — 90 min idle (`trip-auto-end.js`, unchanged hash vs v8.43.31)
- `nativeAutoEnd.js` triggers `expo:autoend:trigger` to WebView when bridge alive
- **MPTaxEngine / report design:** not modified in recovery candidate

---

## 9. Report and email compatibility

Recovered `9b91907` uses existing `MPSummaryReports`, `triggerAutopilotShiftReport`, backend `reportEngine.js` — no changes to PDF/email templates in native module scope. **Compatibility assumed by unchanged report files; field Test 6 required.**

---

## 10. Application-state support matrix

| State | Supported (recovered build) | Notes |
|-------|----------------------------|-------|
| **A** Foreground | **YES** | JS + native paths |
| **B** Backgrounded | **YES** | BG task + native armed |
| **C** Locked | **YES** | `ensureAutopilotBackgroundLocation` on lock |
| **D** WebView suspended, native alive | **YES** | Core design target |
| **E** Force-quit (swiped away) | **LIMITED** | iOS may not deliver BG until relaunch; armed state **may** persist on disk |
| **F** iOS termination | **LIMITED** | Same as E; `initNativeTracking` re-arms on next launch |
| **G** Device restart | **LIMITED** | Requires relaunch; then `loadNativeAutopilotState` |
| **H** Fresh install, exit after onboarding | **TARGET — FIELD TEST REQUIRED** | Depends on `expo:autopilot:arm` completing before exit |

---

## 11. Comparison vs failed main-line (`2a985b6`)

| Component | `9b91907` | `2a985b6` (main) |
|-----------|-----------|------------------|
| `nativeAutopilot.js` | **Present** | **Absent** |
| `expoLocationBridge.js` | 467 lines, full autopilot handlers | 311 lines |
| `hydrateNativeAutopilot` in BG task | **YES** | **NO** |
| `setNativeAutopilotArmed` | **YES** | **NO** |
| `initNativeTracking` re-arm | **YES** | load trip only |
| `tracking-contract.json` lists nativeAutopilot | **YES** | **NO** |
| `finishOnboarding` | sync `ensureAutopilotArmed` | deferred arming (HF-003) |
| `renderAutopilotStatusBar` in renderCommandCentre | **YES** | **NO** (until HF-004 unmerged) |

---

## 12. Destructive commits and PRs

| Commit / PR | What broke |
|-------------|------------|
| `bc38440` / MP-047 merge | Main line got JS motion without native closed-app branch |
| **`7ce066d` / PR #166 (HF-002)** | **Deleted `nativeAutopilot.js` (-229 lines) and bridge handlers (-189 lines)** while claiming golden restore |
| `b3cbc54` / S6 merge | Business Workspace on main without native module |
| `2a985b6` / HF-003 | Partial native file restore; still no nativeAutopilot |
| Live Cloudflare deploy | TestFlight shell + main web bundle = native/web drift |

**Native chain never correctly merged to main.**

---

## 13. Why lockdown failed

| Question | Answer |
|----------|--------|
| Files protected? | `index.html`, bridge, locationTask — **yes** |
| `nativeAutopilot.js` protected? | **NO** in `CRITICAL_FILES.md` or CODEOWNERS (until MP-HF-008) |
| CODEOWNERS covered it? | **NO** |
| Tests asserted module exists? | **NO** on main (recovery branch has contract entry + new guard test) |
| Tests asserted bridge registration? | **NO** |
| Tests asserted first-run BG activation? | **NO** |
| First lock violation | Parallel branch split at `bc38440`; native module never on main |
| False-confidence restore | **HF-002 (`7ce066d`)** |
| Live web drift | TestFlight loads `app.milepilot.uk` from main-line deploy |

---

## 14. Protection plan (implemented on MP-HF-008 branch)

- `docs/AUTOPILOT_NATIVE_ENGINE_LOCK.md` — protected commit, files, lifecycle
- `docs/CRITICAL_FILES.md` — added `nativeAutopilot.js`, native engine files
- `.github/CODEOWNERS` — added native files + `index.js`
- `tests/native-autopilot-guard.test.js` — static wiring guard
- `npm run test:native-autopilot-guard` — package script
- Existing `scripts/tracking-contract.json` @ recovery already lists `nativeAutopilot.js`

---

## 15. Surgical restoration plan (do not merge PR #176)

### A. Required native engine files (copy verbatim from `9b91907`)

- `src/nativeAutopilot.js`
- `src/locationTask.js` (hydrate + onAutopilotBackgroundLocation paths)
- `src/expoLocationBridge.js` (full autopilot handlers)
- `src/MilePilotWebView.js` (initNativeTracking, lock ensure)
- `src/nativeAutoEnd.js` (if diff from main)
- `index.js` (task import order)

### B. Required bridge / reconciliation (from `9b91907` index.html hunks only)

- `ensureAutopilotArmed`, `finishOnboarding` arming
- `applyNativeTripSync`, `restoreNativeTripFromSync`, `restoreNativeTripIfNeeded`
- `handoffToNativeEngine`, `bootApp` order
- `renderAutopilotStatusBar` in `renderCommandCentre`

### C. NOT required from 8.43.63

- Historical onboarding UI (Business Workspace stays)
- Old home cards / business-setup-onboard (unless conflict)
- Version label 8.43.63

### D. Must not return

- Pre-native JS-only closed-app assumptions from main
- HF-002 partial restore pattern

### Integration sequence

1. Field-test recovered candidate (PR #176 branch) — **gate**
2. Cherry-pick native files A onto modern main branch
3. Cherry-pick reconciliation hunks B; resolve conflicts with Business Workspace / UX lock screens
4. Run `test:native-autopilot-guard`, `verify:tracking`, full field Tests 1–7
5. **Second** field test after integration — mandatory

### Rollback

Revert native file set to pre-cherry-pick; redeploy previous Cloudflare bundle.

---

## 16. Recovered build identity

| Field | Value |
|-------|-------|
| Label | RECOVERED NATIVE AUTOPILOT CANDIDATE — FIELD TEST REQUIRED |
| Commit | `9b91907fef6146d20aa905099782bac7deaed254` |
| Branch | `cursor/mp-hf-007-recover-84363-19bd` |
| APP_VERSION | 8.43.63 |
| version.txt | 8.43.57 |
| iOS buildNumber | 15 |
| `frontend/index.html` SHA-256 | `d665c6f5bce452e3dacd6fdf13d51cc7b4a6e2f89a3ae8b377da6e3cbe642724` |
| `nativeAutopilot.js` SHA-256 | `453bee1c43e0fbd51b3079d328e3a613076647fb81e650cc25754f6a467ae1ee` |
| EAS / TestFlight | **User must build from recovery branch** — not pre-built in repo |

**Critical:** Deploy web bundle **from recovery commit**, not live main `app.milepilot.uk`, or native/web mismatch will invalidate test.

---

## 17. Field-test instructions

See `docs/MP-HF-008-FIELD-TEST-PROTOCOL.md` (Tests 1–7).

---

## 18. Rollback procedure

1. Do not merge PR #176 or surgical PR until field PASS
2. If candidate fails: test alternate `a84a0c4` (same native stack, 8.43.64)
3. If integration fails: `git revert` native cherry-picks; restore main deploy
4. Preserve forensic docs regardless of outcome

---

## 19. Remaining provenance gaps

1. No EAS artefact in repo proving build 15 included `nativeAutopilot` in IPA
2. `version.txt` / APP_VERSION mismatch at `9b91907`
3. Historical Cloudflare deploy hash for 8.43.63 unknown
4. Test 1 (state H) not run — arming race on onboarding exit unproven in field
5. User Spotify/calls claims not in repo text — Tests 3–4 required
6. Cannot confirm live TestFlight ever shipped `9b91907` web + native pair

---

## Final verdict

**RECOVERED ENGINE VERIFIED IN BUILD — FIELD TEST REQUIRED**

The native module is **present, imported, registered, and logically active** in the recovered source tree. Historical field success is **plausible and technically explained**. **User field test is mandatory** before surgical merge to main.

**Do not merge PR #176. Do not begin Sprint 2. Do not begin MP-HF-006 rewrite.**
