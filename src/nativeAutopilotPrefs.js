/**
 * MP-048 — Native-readable AutoPilot prefs (synced from WebView localStorage).
 */
import * as FileSystem from 'expo-file-system';

const PREFS_PATH = `${FileSystem.documentDirectory}milepilot_autopilot_prefs.json`;

const DEFAULTS = Object.freeze({
  mp_tracking_mode: 'manual',
  mp_autopilot_motion_enabled: '1',
  mp_autopilot_auto_business: '0',
  mp_onboard_complete: '0',
  mp_location_choice: '',
  mp_subscription: '',
});

let cache = { ...DEFAULTS };
let loaded = false;

export async function loadNativeAutopilotPrefs() {
  try {
    const info = await FileSystem.getInfoAsync(PREFS_PATH);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(PREFS_PATH);
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        cache = { ...DEFAULTS, ...parsed };
      }
    }
  } catch (e) {
    console.warn('[MilePilot NativePrefs] load failed', e.message);
  }
  loaded = true;
  return { ...cache };
}

export async function syncNativeAutopilotPrefs(patch) {
  if (!patch || typeof patch !== 'object') return { ...cache };
  cache = { ...cache, ...patch };
  try {
    if (FileSystem.documentDirectory) {
      await FileSystem.writeAsStringAsync(
        PREFS_PATH,
        JSON.stringify({ ...cache, savedAt: Date.now() })
      );
    }
  } catch (e) {
    console.warn('[MilePilot NativePrefs] save failed', e.message);
  }
  return { ...cache };
}

export function getNativeAutopilotPrefs() {
  return { ...cache };
}

export function isAutopilotModeEnabled() {
  return cache.mp_tracking_mode === 'autopilot';
}

export function isMotionDetectionEnabled() {
  return cache.mp_autopilot_motion_enabled !== '0';
}

export function isAutoBusinessEnabled() {
  return cache.mp_autopilot_auto_business === '1';
}

export function isOnboardComplete() {
  return cache.mp_onboard_complete === 'true';
}

export function hasLocationGranted() {
  return cache.mp_location_choice === 'granted';
}

export function hasSubscriptionAccess() {
  if (!cache.mp_subscription) return true;
  try {
    const sub = JSON.parse(cache.mp_subscription);
    if (!sub || typeof sub !== 'object') return true;
    if (sub.paid === true || sub.active === true) return true;
    if (sub.trialStartedAt) {
      const started = new Date(sub.trialStartedAt).getTime();
      if (!Number.isNaN(started) && Date.now() - started < 14 * 24 * 60 * 60 * 1000) return true;
    }
  } catch (e) {}
  return false;
}

export function canNativeAutoStart() {
  return (
    loaded &&
    isOnboardComplete() &&
    isAutopilotModeEnabled() &&
    isMotionDetectionEnabled() &&
    hasLocationGranted() &&
    hasSubscriptionAccess()
  );
}

export function getTripStatusForNativeAutoStart() {
  return isAutoBusinessEnabled() ? 'business' : 'pending';
}
