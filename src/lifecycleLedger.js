/**
 * MP-HF-005 — Persistent lifecycle ledger for field diagnostics.
 * Survives process termination; no personal coordinates in export.
 */
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

const LEDGER_PATH = `${FileSystem.documentDirectory}milepilot_lifecycle_ledger.json`;
const MAX_ENTRIES = 600;

const REDACT_KEYS = new Set([
  'latitude',
  'longitude',
  'lat',
  'lon',
  'coords',
  'route',
  'routePoints',
  'lastPoint',
  'lastGpsLat',
  'lastGpsLon',
]);

let ledger = {
  schema: 'mp-lifecycle-ledger-v1',
  provenance: {},
  entries: [],
};

let persistChain = Promise.resolve();
let loaded = false;

function isoNow() {
  return new Date().toISOString();
}

function sanitizeDetail(detail) {
  if (!detail || typeof detail !== 'object') return detail || null;
  const out = {};
  Object.keys(detail).forEach((key) => {
    if (REDACT_KEYS.has(key)) return;
    const val = detail[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      out[key] = sanitizeDetail(val);
    } else if (Array.isArray(val)) {
      out[key] = `[array:${val.length}]`;
    } else if (typeof val === 'number' && /acc/i.test(key)) {
      out[key] = Math.round(val);
    } else {
      out[key] = val;
    }
  });
  return out;
}

async function loadLedger() {
  if (loaded) return ledger;
  try {
    const info = await FileSystem.getInfoAsync(LEDGER_PATH);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(LEDGER_PATH);
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.entries)) {
        ledger = {
          schema: parsed.schema || 'mp-lifecycle-ledger-v1',
          provenance: parsed.provenance || {},
          entries: parsed.entries,
        };
      }
    }
  } catch (e) {
    console.warn('[MilePilot Ledger] load failed', e.message);
  }
  loaded = true;
  return ledger;
}

function queuePersist() {
  persistChain = persistChain
    .then(async () => {
      await FileSystem.writeAsStringAsync(LEDGER_PATH, JSON.stringify(ledger));
    })
    .catch((e) => {
      console.warn('[MilePilot Ledger] persist failed', e.message);
    });
}

export async function initLifecycleLedger(extra = {}) {
  await loadLedger();
  const expoConfig = Constants.expoConfig || {};
  ledger.provenance = {
    ...ledger.provenance,
    marketingVersion: extra.marketingVersion || ledger.provenance.marketingVersion || null,
    nativeBuildNumber: expoConfig.ios?.buildNumber || extra.buildNumber || null,
    bundleIdentifier: expoConfig.ios?.bundleIdentifier || 'com.zipcab.milepilot',
    nativeProjectSlug: expoConfig.slug || 'milepilot',
    gitCommit: extra.gitCommit || ledger.provenance.gitCommit || process.env.GIT_COMMIT || null,
    diagnosticBuild: extra.diagnosticBuild || 'MP-HF-005',
    webAppUrl: extra.webAppUrl || expoConfig.extra?.webAppUrl || null,
    updatedAt: isoNow(),
  };
  recordLifecycleEvent('app_process_launch', {
    coldStart: true,
    platform: 'ios',
  });
  await persistChain;
}

export function recordLifecycleEvent(type, detail = {}) {
  if (!type) return;
  loadLedger().catch(() => {});
  const entry = {
    t: isoNow(),
    layer: 'native',
    type,
    detail: sanitizeDetail(detail),
  };
  ledger.entries.push(entry);
  if (ledger.entries.length > MAX_ENTRIES) {
    ledger.entries.splice(0, ledger.entries.length - MAX_ENTRIES);
  }
  queuePersist();
  return entry;
}

export async function mergeJsLedgerEntries(jsEntries, jsProvenance) {
  await loadLedger();
  if (jsProvenance && typeof jsProvenance === 'object') {
    ledger.provenance = { ...ledger.provenance, ...jsProvenance, updatedAt: isoNow() };
  }
  if (!Array.isArray(jsEntries) || !jsEntries.length) {
    await persistChain;
    return getLifecycleExport();
  }
  const existing = new Set(
    ledger.entries.map((e) => `${e.t}|${e.type}|${e.layer || 'native'}`)
  );
  jsEntries.forEach((e) => {
    if (!e || !e.type) return;
    const key = `${e.t}|${e.type}|${e.layer || 'js'}`;
    if (existing.has(key)) return;
    existing.add(key);
    ledger.entries.push({
      t: e.t || isoNow(),
      layer: e.layer || 'js',
      type: e.type,
      detail: sanitizeDetail(e.detail),
    });
  });
  ledger.entries.sort((a, b) => String(a.t).localeCompare(String(b.t)));
  if (ledger.entries.length > MAX_ENTRIES) {
    ledger.entries = ledger.entries.slice(-MAX_ENTRIES);
  }
  await persistChain;
  return getLifecycleExport();
}

export async function getLifecycleExport(extra = {}) {
  await loadLedger();
  await persistChain;
  return {
    exportedAt: isoNow(),
    schema: ledger.schema,
    provenance: {
      ...ledger.provenance,
      ...sanitizeDetail(extra),
    },
    entryCount: ledger.entries.length,
    entries: ledger.entries.slice(),
  };
}

export async function clearLifecycleLedger() {
  ledger = {
    schema: 'mp-lifecycle-ledger-v1',
    provenance: ledger.provenance || {},
    entries: [],
  };
  await persistChain;
  recordLifecycleEvent('ledger_cleared', {});
  return true;
}
