# MP-HF-005 — AutoPilot Root-Cause Closure (Builds 8.43.63–8.43.72)

**Priority:** P0 — PRODUCT BLOCKER  
**Diagnostic build:** v8.43.73 (`MP-HF-005`) — **CANDIDATE — NOT FIELD VERIFIED**  
**Final verdict:** **DIAGNOSTIC BUILD READY — FIELD TEST REQUIRED**

---

## 1. Version / Commit / Binary Matrix

Evidence table — only **verified** field or repo evidence. No PASS inferred from code or automated tests.

| Field | 8.43.63 | 8.43.64 | 8.43.67 | 8.43.69 | 8.43.70 | 8.43.71 | 8.43.72 |
|-------|---------|---------|---------|---------|---------|---------|---------|
| **Git commit** | `9b91907` | `a84a0c4` | `686d370` | `2a985b6` | `4ebf026` | `549e06e` | `3158b33` |
| **Native binary / build** | UNKNOWN | UNKNOWN | TestFlight ~build 16–17 (repo: ios.buildNumber `8`) | TestFlight 17 + live web | UNKNOWN | `origin/recovery/tech-fix-84371` | Branch `cursor/tracking-p0-restore-19bd` — **not merged** |
| **Frontend bundle** | `APP_VERSION=8.43.63` @ `9b91907` | `8.43.64` @ `a84a0c4` | `8.43.67` @ `686d370` | `8.43.69` @ `2a985b6` (**current main**) | `8.43.70` @ `4ebf026` | `8.43.71` @ `549e06e` | `8.43.72` @ `3158b33` |
| **Onboarding completed** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Foreground permission granted** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Always Allow obtained** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **Open Settings prompt present** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** (missing on main per Business Workspace regression) | UNKNOWN | UNKNOWN | **UNKNOWN** (restored in HF-004 code, not road-tested) |
| **AutoPilot armed** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** (first-run symptom reported) | **FAIL** | **FAIL** | UNKNOWN |
| **Dashboard status correct** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** (manual copy; no `ccAutopilotBar` on main) | UNKNOWN | UNKNOWN | UNKNOWN (HF-004 restores bar — not verified on device) |
| **App backgrounded** | NOT TESTED | NOT TESTED | UNKNOWN | FAIL scenario | FAIL scenario | FAIL scenario | NOT TESTED |
| **Force-closed vs suspended** | NOT TESTED | NOT TESTED | UNKNOWN | FAIL (background AutoPilot) | FAIL | FAIL | NOT TESTED |
| **Phone locked** | NOT TESTED | NOT TESTED | UNKNOWN | FAIL scenario | FAIL | FAIL | NOT TESTED |
| **Motion detected** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** (no auto trip without manual reopen) | **FAIL** | **FAIL** | NOT TESTED |
| **Native event emitted** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |
| **JavaScript runtime alive** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** at first-run exit (symptom) | **FAIL** | **FAIL** | UNKNOWN |
| **Trip began automatically** | NOT TESTED | NOT TESTED | UNKNOWN | **FAIL** | **FAIL** | **FAIL** | NOT TESTED |
| **Trip continued while locked** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NOT TESTED |
| **Manual app reopen required** | NOT TESTED | NOT TESTED | UNKNOWN | **PASS** (workaround observed) | **PASS** (workaround) | **PASS** (workaround) | UNKNOWN |
| **Trip auto-ended** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NOT TESTED |
| **Report generated** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NOT TESTED |
| **Email delivered** | NOT TESTED | NOT TESTED | UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN | NOT TESTED |
| **Field-test result** | NOT TESTED | NOT TESTED | **FAIL** (background AutoPilot) | **FAIL** | **FAIL** | **FAIL** | **NOT TESTED** — useful restoration, not road-verified |
| **Evidence source** | Repo only | Repo only | User P0 brief + repo | User P0 brief + repo + MP-HF-003 doc | User P0 brief | User P0 brief | User P0 brief + HF-004 doc + code audit |

**Label rule:** No version may be called **ROAD-TESTED AUTOPILOT PASS** until Tests A, B, E, F pass on a real iPhone.

---

## 2. Eliminated Versions and Documented Failures

| Version | Status | Documented failure |
|---------|--------|-------------------|
| **8.43.67** | **FAIL** (background AutoPilot) | Real-device: does not auto-start after onboarding without manual reopen. **Not** a golden/known-good build. |
| **8.43.69** | **FAIL** | Same first-run / background symptom; main lacks HF-004 dashboard wiring. |
| **8.43.70** | **FAIL** | Background AutoPilot failed in field. |
| **8.43.71** | **FAIL** | Background AutoPilot failed in field; Business Hub merge. |
| **8.43.72** | **CANDIDATE — NOT FIELD VERIFIED** | HF-004 restores UI/boot wiring; **no** passing road test yet. |
| **8.43.63 / 8.43.64** | **NOT TESTED** in this closure cycle | Pre-regression baseline; insufficient field matrix. |
| **8.43.73 (MP-HF-005)** | **DIAGNOSTIC BUILD READY** | Instrumentation only; field test required. |

---

## 3. App State Taxonomy (Precise)

| State | Code | iOS behaviour with current implementation |
|-------|------|-------------------------------------------|
| **A** | App open in foreground | **Supported.** WebView + bridge active. `ensureAutopilotArmed()` runs; JS motion FSM receives GPS via `MPTrackingProvider` / bridge. |
| **B** | App open then backgrounded (not force-quit) | **Partially supported.** Native `AppState` → `background`/`inactive`; `MILEPILOT_BACKGROUND_LOCATION` task can run **if** `startBackgroundLocationUpdates()` was called with Always permission. JS motion FSM **may suspend** when WebView is frozen. Native engine records miles **only after** `startNativeTrip()` — AutoPilot trip start is **JS-driven**. |
| **C** | Phone locked while app suspended | **Same as B** for native BG GPS on an **active native trip**. AutoPilot **auto-start** requires JS FSM → **likely fails** if WebView not executing. |
| **D** | App swiped away / user force-quit | **Not supported for AutoPilot arming or JS motion.** iOS does not relaunch app for motion alone. BG location task does not run until app is launched again. **Do not promise** force-quit relaunch without on-device proof. |
| **E** | App terminated by iOS (jetsam / memory) | **Same as D** for cold start. No native pending AutoPilot queue restored on relaunch. |
| **F** | Fresh device restart | **Same as D/G** until user opens MilePilot at least once post-reboot. |
| **G** | Fresh install, exit after onboarding without reopen | **FAIL observed** — primary P0 scenario. Onboarding writes **WebView localStorage only**; native BG location may never start until `ensureAutopilotArmed()` → `expo:autopilot:arm` runs inside a live WebView session. |

**Ambiguous term banned:** “closed” — always specify B, C, D, E, F, or G.

---

## 4. Native → JavaScript Startup Chain

```
Motion / significant-location event
  → [NOT IMPLEMENTED: no CoreMotion / significant-change native handler for AutoPilot]
  → iOS delivers CLLocation via expo-location BG task (only if updates already started)
  → locationTask.js :: TaskManager.defineTask(BACKGROUND_LOCATION_TASK)
       API: expo-task-manager + expo-location startLocationUpdatesAsync
       Permission: Always (UIBackgroundModes: location)
       App state: B/C with active BG updates; not D/E/F/G cold
       Persistent: none for “armed”; trip state in milepilot_native_trip.json
       On fail: console.error; no trip without active native trip
       Log: [MilePilot BG GPS]; lifecycle ledger (v8.43.73+)

  → App process / WebView wake
  → index.js → App.js → MilePilotWebView.js
       API: React Native AppState
       Log: lifecycle ledger foreground/background/suspension

  → initNativeTracking() [expoLocationBridge.js]
       → loadPersistedState() [nativeTrackingEngine.js]
       → lifecycle ledger app_process_launch

  → WebView loads app.milepilot.uk (remote PWA)
  → BRIDGE_BOOT_SCRIPT → MPExpoBridge [MilePilotWebView.js]
       Log: bridge_ready

  → bootApp() [frontend/index.html]
       → initAutoPilotMotion() [autopilot-motion.js — JS GPS FSM]
       → initTrackingEngine() [tracking-provider.js, bridge hooks]
       Log: js_app_boot, js_tracking_engine_ready

  → load AutoPilot preference
       Storage: localStorage mp_onboard_complete, mp_tracking_mode (WebView only)
       Native: NO persistent “autopilot armed” flag
       Log: autopilot_preference_read

  → finishOnboarding() / ensureAutopilotArmed()
       → MPTrackingProvider.enableTracking()
       → MPAutoPilotMotion.syncLifecycle() → armNative → expo:autopilot:arm
       → startTracking({ background: true }) [expoLocationBridge.js]
       → startBackgroundLocationUpdates() [locationTask.js]
       Log: onboarding_completed, autopilot_armed, background_location_started

  → Motion detection (JS only)
       autopilot-motion.js :: onGpsSample() from bridge locations
       Requires: WebView JS running, mp_onboard_complete, FSM ARMED
       Log: native_motion_detected (source: js_gps_fsm)

  → Trip creation
       JS: startShiftCommandCentre() → expo:trip:start → startNativeTrip()
       Native: ingestNativeLocation() → persistState()
       Log: trip_start_requested, trip_created, location_point_persisted

  → GPS / persistence
       nativeTrackingEngine.js :: ingestNativeLocation, persistState
       WebView sync: expo:trip:sync when bridge available
```

### Where the chain stops (failed field scenario — state G / first-run exit)

1. User completes onboarding → `mp_onboard_complete=true` in **localStorage**.
2. `ensureAutopilotArmed()` runs **once** during `finishOnboarding()` while WebView is foreground.
3. User leaves app (state G) **without** a subsequent foreground session.
4. **Failure boundary:** Native BG location updates may not remain registered across process death; **JS motion FSM is not running** when WebView is not alive.
5. Driving occurs → **no JS** to evaluate speed → **no** `startShiftCommandCentre()` → **no** `startNativeTrip()` → **no** background mileage for AutoPilot.
6. User manually opens app → WebView boots → `ensureAutopilotArmed()` runs → workaround **PASS**.

---

## 5. Native vs JavaScript Root-Cause Conclusion

| Question | Answer |
|----------|--------|
| Can native detect motion before WebView runs? | **No.** No native CoreMotion AutoPilot pipeline. `NSMotionUsageDescription` exists; not wired for trip start. |
| Can native relaunch/wake the app process? | **Only via iOS location rules** if BG updates were already started with Always — does **not** execute JS AutoPilot FSM on wake. |
| Can native persist pending trip-start until JS ready? | **No.** `locationTask.js` queues `pendingSyncPayloads` for trip sync, not AutoPilot arm events. |
| Are events lost when bridge unavailable? | **Yes** for JS-driven AutoPilot decisions. Native GPS ingested only when `trip.active` in native engine. |
| Is AutoPilot arming stored natively? | **No.** Arming is runtime: `expo:autopilot:arm` → `startTracking`. Preferences in WebView localStorage. |
| Does onboarding write all native preferences? | **No.** Onboarding does not set a native “autopilot enabled” UserDefaults/file flag. |
| Must dashboard render before tracking arms? | **No** for code path, but `finishOnboarding()` calls `goHome()` → `renderCommandCentre()`. Arming is async and not awaited in all paths. |
| Does manual open work because of WebView/bridge? | **Yes.** Manual open starts WebView, runs `bootApp` / `ensureAutopilotArmed`, starts native BG watch — not because permissions change. |

**Root cause (confirmed from architecture + field symptom):**  
AutoPilot **auto-start is JavaScript-only** (`autopilot-motion.js`). Background native GPS **continues an existing native trip** but does **not** replace the JS motion FSM for **starting** a trip after process/WebView suspension or first-run exit (state G). v8.43.72 HF-004 fixes **wiring/UI/boot order** but does **not** implement native cold-start AutoPilot arming or native motion trip-start.

**Classification:** Hybrid — **primary failure boundary is JS/WebView lifecycle**; native layer **cannot close the loop** without a live bridge or a new native AutoPilot arming + trip-start policy.

---

## 6. First-Run Activation Finding

On `finishOnboarding()` exit, the following were traced:

| Activation step | On first-run exit? | Notes |
|-----------------|-------------------|-------|
| Native AutoPilot preference enabled | **NO** | No native store |
| Motion service registered | **NO** | JS only |
| Significant-location monitoring | **NO** | Not implemented |
| Background location service started | **MAYBE** | Only if `ensureAutopilotArmed()` completes `expo:autopilot:arm` before process exit |
| BG task identifier registered | **YES** | `locationTask.js` registered at native module load |
| Native event listeners active | **PARTIAL** | BG task handler exists; forwarding to WebView needs live bridge |
| Initial location obtained | **MAYBE** | `seedAutopilotGps()` async; may not finish before exit |
| Bridge-ready state persisted | **NO** | |
| Pending-event queue initialised | **PARTIAL** | `pendingSyncPayloads` for sync only, not arm/start |

**Design gap:** Steps that **require a later application launch** — JS FSM arming, motion sampling, auto trip start, dashboard-independent AutoPilot policy.

---

## 7. v8.43.72 (HF-004) Fix Classification

| Fix | Classification |
|-----|----------------|
| `renderCommandCentre()` → `renderAutopilotStatusBar()` | Diagnostic/UI correction + **potentially related** (does not fix cold start) |
| `renderHomeTrackingModeUI()` | Diagnostic/UI only |
| `getIdleDashboardStatus()` AutoPilot copy | Diagnostic/UI only |
| `finishOnboarding()` synchronous arming | **Potentially related** to first-run — still WebView-bound |
| Open Settings / `#nativeAlwaysModal` | Diagnostic/UI correction only |
| `bootApp()` `initTrackingEngine` before `initAutoPilotMotion` | **Potentially related** — ordering fix, not native cold start |
| `goHome()` → `ensureAutopilotArmed()` | **Potentially related** |
| `ensureAutopilotArmed()` legacy paths | **Potentially related** |

**Do not remove** HF-004 corrections. **Do not** describe the P0 as solved by HF-004 without Tests A, B, E, F.

---

## 8. Diagnostic Instrumentation Added (v8.43.73)

| Component | Purpose |
|-----------|---------|
| `src/lifecycleLedger.js` | Native persistent ledger (`milepilot_lifecycle_ledger.json`) |
| `frontend/js/lifecycle-ledger.js` | JS ledger + merge export |
| Bridge: `expo:ledger:record`, `expo:ledger:export`, `expo:ledger:snapshot`, `expo:ledger:clear` | Cross-layer export |
| Hooks in `locationTask.js`, `nativeTrackingEngine.js`, `expoLocationBridge.js`, `MilePilotWebView.js` | Native boundary events |
| `MPTrackingDebug` | Provenance + **Export Lifecycle Ledger** / **Share Ledger** |
| `bootApp()` → `MPLifecycleLedger.init()` | JS boot hooks |

**Ledger events:** app_process_launch, foreground, background, suspension, native_location_received, background_task_invoked, autopilot_preference_read, autopilot_armed, bridge_ready, native_event_queued, native_event_delivered, js_tracking_engine_ready, trip_start_requested, trip_created, location_point_persisted, trip_end_requested, report_generated, native_motion_detected (JS FSM).

**Privacy:** No lat/lon in export; accuracy quantised.

---

## 9. Diagnostic Build Identity

| Field | Value |
|-------|-------|
| Marketing version | **8.43.73** |
| Diagnostic label | **MP-HF-005** |
| Git branch | `cursor/mp-hf-005-diagnostic-19bd` |
| Native project | Expo `com.zipcab.milepilot`, ios.buildNumber per `app.config.js` |
| Web bundle | `frontend/index.html` + `js/lifecycle-ledger.js` |
| TestFlight | Requires EAS build bump + Cloudflare deploy of web bundle |
| OTA note | TestFlight loads **live** `app.milepilot.uk` — deploy web **after** native pin |

**In-app proof:** Settings → Tracking Debug → footer shows v8.43.73, MP-HF-005, build number, exportable ledger.

---

## 10. Real-Device Test Protocol

Run on physical iPhone. Attach exported lifecycle ledger per test. Result columns: **PASS / FAIL / NOT TESTED**.

### TEST A — Backgrounded
1. Fresh install → onboarding → permissions → background app → lock → drive  
2. Expect: automatic trip without reopen  
3. **Status:** NOT RUN (cloud agent)

### TEST B — First-run exit (P0)
1. Fresh install → onboarding → Always Allow → **exit without reopen** → lock → drive  
2. Expect: automatic trip  
3. **Status:** NOT RUN — **historical FAIL on .67/.69/.70/.71**

### TEST C — Force-quit
1. Arm AutoPilot → swipe away → drive  
2. Record actual iOS behaviour (expect **no** JS AutoPilot)  
3. **Status:** NOT RUN

### TEST D — Device restart
1. Restart phone → do not open MilePilot → drive  
2. **Status:** NOT RUN

### TEST E — Stationary false-positive
1. Stationary indoors ≥90 min → no false journey  
2. **Status:** NOT RUN

### TEST F — Full lifecycle
1. Auto start → locked tracking → stop → 90 min idle → save → report → email  
2. **Status:** NOT RUN

**Release rule:** Label **ROAD-TESTED AUTOPILOT PASS** only if A, B, E, F pass.

---

## 11. Remaining Unknowns

1. Exact native BG registration state at first-run exit on physical device (ledger will show `background_location_started` or absence).
2. Whether iOS delivers BG locations to a **suspended WebView shell** without active native trip (expected: locations to native task only).
3. TestFlight build number ↔ web bundle hash mapping for historical .70/.71 deploys.
4. Whether HF-004 (.72) changes first-run FAIL to PASS — **unproven**.
5. Email/report path in background-only trip (Test F).

---

## 12. Rollback Plan

| Step | Action |
|------|--------|
| 1 | Keep **main** at 8.43.69 until field verification — do not merge HF-005 diagnostic to main without review |
| 2 | Field test **8.43.73** diagnostic from branch `cursor/mp-hf-005-diagnostic-19bd` |
| 3 | If diagnostic proves JS boundary: plan **native AutoPilot arming persistence** (separate spec; not Sprint 2) |
| 4 | If HF-004 (.72) passes Tests A+B: merge `cursor/tracking-p0-restore-19bd` after ledger proof |
| 5 | Rollback deploy: repoint Cloudflare to previous zip; EAS build to prior buildNumber |
| 6 | Do **not** market any build as fixed until **ROAD-TESTED AUTOPILOT PASS** |

---

## Appendix — Native file reference

| Step | File | Function |
|------|------|----------|
| BG task | `src/locationTask.js` | `TaskManager.defineTask`, `startBackgroundLocationUpdates` |
| Bridge | `src/expoLocationBridge.js` | `handleWebViewMessage`, `startTracking`, `initNativeTracking` |
| Native engine | `src/nativeTrackingEngine.js` | `ingestNativeLocation`, `startNativeTrip`, `persistState` |
| WebView shell | `src/MilePilotWebView.js` | `AppState`, `BRIDGE_BOOT_SCRIPT` |
| JS motion | `frontend/js/autopilot-motion.js` | `onGpsSample`, FSM states |
| JS arming | `frontend/index.html` | `ensureAutopilotArmed`, `finishOnboarding`, `bootApp` |
| Ledger | `src/lifecycleLedger.js`, `frontend/js/lifecycle-ledger.js` | MP-HF-005 diagnostics |
