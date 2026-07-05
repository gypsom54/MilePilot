/**
 * CRITICAL MILEAGE ENGINE FILE — MP-043
 * Native GPS bridge. Mileage is calculated in nativeTrackingEngine, not WebView.
 */
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  startBackgroundLocationUpdates,
  stopBackgroundLocationUpdates,
} from './locationTask';
import { syncNativeAutoEnd, setNativeAutoEndInjector, onNativeBackgroundLocation } from './nativeAutoEnd';
import {
  setNativeAutopilotArmed,
  isNativeAutopilotArmed,
  ensureAutopilotBackgroundLocation,
  loadNativeAutopilotState,
  onAutopilotBackgroundLocation,
} from './nativeAutopilot';
import {
  ingestNativeLocation,
  startNativeTrip,
  stopNativeTrip,
  restoreNativeTrip,
  getTripSyncPayload,
  getNativeDebugSnapshot,
  setNativeDebugMeta,
  setNativeAppBackground,
  loadPersistedState,
  isNativeTripActive,
} from './nativeTrackingEngine';

export { setNativeAutoEndInjector, syncNativeAutoEnd };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let foregroundSubscription = null;
let lastBackgroundActive = false;
let autopilotPollTimer = null;
let autopilotPollHandler = null;

function stopAutopilotPoll() {
  if (autopilotPollTimer) {
    clearInterval(autopilotPollTimer);
    autopilotPollTimer = null;
  }
  autopilotPollHandler = null;
}

function startAutopilotPoll(onLocation) {
  stopAutopilotPoll();
  if (typeof onLocation !== 'function') return;
  autopilotPollHandler = onLocation;
  autopilotPollTimer = setInterval(async () => {
    if (!autopilotPollHandler || isNativeTripActive()) return;
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      autopilotPollHandler(locationToPayload(loc));
    } catch (e) {
      console.warn('[MilePilot] autopilot poll fix failed', e.message);
    }
  }, 8000);
}

async function sendAutopilotSeed(onLocation) {
  if (typeof onLocation !== 'function') return;
  try {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    onLocation(locationToPayload(loc));
  } catch (e) {
    console.warn('[MilePilot] autopilot seed fix failed', e.message);
  }
}

function locationToPayload(loc) {
  return {
    type: 'expo:location',
    coords: {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      altitude: loc.coords.altitude,
      altitudeAccuracy: loc.coords.altitudeAccuracy,
      heading: loc.coords.heading,
      speed: loc.coords.speed,
    },
    timestamp: loc.timestamp || Date.now(),
  };
}

function pushLocationAndSync(payload, source, sendToWebView) {
  const sync = ingestNativeLocation(payload, { source });
  if (typeof sendToWebView !== 'function') return sync;
  if (isNativeTripActive()) {
    if (sync) sendToWebView(sync);
    if (source === 'foreground') {
      sendToWebView({ type: 'expo:location', ...payload });
    }
    return sync;
  }
  if (isNativeAutopilotArmed()) {
    const autoTrip = onAutopilotBackgroundLocation(payload);
    if (autoTrip) {
      sendToWebView(autoTrip);
      return autoTrip;
    }
  }
  if (sync) sendToWebView(sync);
  if (source === 'foreground') {
    sendToWebView({ type: 'expo:location', ...payload });
  }
  return sync;
}

export async function queryLocationPermission() {
  const fg = await Location.getForegroundPermissionsAsync();
  if (fg.status !== 'granted') return fg.status;
  const bg = await Location.getBackgroundPermissionsAsync();
  if (bg.status === 'granted') return 'granted';
  return 'foreground-only';
}

export async function requestLocationPermission(includeBackground) {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return fg.status;
  if (!includeBackground) return 'foreground-only';
  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.status === 'granted' ? 'granted' : 'foreground-only';
}

export async function startForegroundWatch(onLocation) {
  if (foregroundSubscription) {
    foregroundSubscription.remove();
    foregroundSubscription = null;
  }

  foregroundSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 5,
      timeInterval: 3000,
    },
    (loc) => {
      if (typeof onLocation === 'function') {
        onLocation(locationToPayload(loc));
      }
    }
  );

  return true;
}

export async function stopAllTracking() {
  if (foregroundSubscription) {
    foregroundSubscription.remove();
    foregroundSubscription = null;
  }
  stopAutopilotPoll();
  await stopBackgroundLocationUpdates();
  lastBackgroundActive = false;
}

export async function ensureBackgroundLocationForTrip() {
  if (!isNativeTripActive()) {
    return { ok: false, reason: 'no_trip', backgroundActive: false };
  }
  const bgPerm = await Location.getBackgroundPermissionsAsync();
  if (bgPerm.status !== 'granted') {
    console.warn('[MilePilot] background permission not granted — locked-phone miles need Always');
    return { ok: false, reason: 'no_bg_permission', backgroundActive: false };
  }
  try {
    await startBackgroundLocationUpdates();
    lastBackgroundActive = true;
    setNativeDebugMeta({ backgroundActive: true });
    return { ok: true, backgroundActive: true };
  } catch (e) {
    console.warn('[MilePilot] ensureBackgroundLocationForTrip failed', e.message);
    return { ok: false, error: e.message, backgroundActive: false };
  }
}

export async function startTracking(onLocation, { background = false } = {}) {
  await startForegroundWatch(onLocation);

  let backgroundActive = false;
  if (background) {
    let ensured = { backgroundActive: false };
    if (isNativeTripActive()) {
      ensured = await ensureBackgroundLocationForTrip();
    } else if (isNativeAutopilotArmed()) {
      ensured = await ensureAutopilotBackgroundLocation();
    }
    backgroundActive = !!ensured.backgroundActive;
    if (!backgroundActive) {
      console.warn('[MilePilot] background location not active — foreground only');
    }
  }

  lastBackgroundActive = backgroundActive;
  setNativeDebugMeta({ backgroundActive, permissionStatus: await queryLocationPermission() });
  return { ok: true, backgroundActive };
}

export async function initNativeTracking() {
  await loadPersistedState();
  const autopilotArmed = await loadNativeAutopilotState();
  if (autopilotArmed) {
    const bg = await ensureAutopilotBackgroundLocation();
    if (bg.backgroundActive) {
      console.log('[MilePilot] native AutoPilot re-armed background GPS on launch');
    } else {
      console.warn('[MilePilot] native AutoPilot armed but background GPS inactive', bg.reason || bg.error);
    }
  }
}

export function getLastBackgroundActive() {
  return lastBackgroundActive;
}

export async function handleWebViewMessage(raw, sendToWebView) {
  let msg;
  try {
    msg = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    return;
  }

  const reply = (payload) => {
    if (typeof sendToWebView === 'function') {
      sendToWebView({ ...payload, id: msg.id });
    }
  };

  switch (msg.type) {
    case 'expo:permission:query': {
      const status = await queryLocationPermission();
      setNativeDebugMeta({ permissionStatus: status });
      reply({ type: 'expo:permission:result', status });
      break;
    }
    case 'expo:permission:request': {
      const status = await requestLocationPermission(!!msg.payload?.background);
      setNativeDebugMeta({ permissionStatus: status });
      reply({ type: 'expo:permission:result', status });
      break;
    }
    case 'expo:tracking:start': {
      const onLocation = (payload) => pushLocationAndSync(payload, 'foreground', sendToWebView);
      const result = await startTracking(onLocation, { background: !!msg.payload?.background });
      reply({ type: 'expo:tracking:result', ok: result.ok, backgroundActive: !!result.backgroundActive });
      break;
    }
    case 'expo:tracking:stop': {
      await stopAllTracking();
      reply({ type: 'expo:tracking:result', ok: true });
      break;
    }
    case 'expo:trip:start': {
      const onLocation = (payload) => pushLocationAndSync(payload, 'foreground', sendToWebView);
      const sync = startNativeTrip(msg.payload || {});
      if (msg.payload?.autoEnd) syncNativeAutoEnd(msg.payload.autoEnd);
      const result = await startTracking(onLocation, { background: !!msg.payload?.background });
      reply({
        type: 'expo:trip:result',
        ok: true,
        sync,
        backgroundActive: !!result.backgroundActive,
      });
      if (sync) sendToWebView(sync);
      break;
    }
    case 'expo:trip:stop': {
      await stopAllTracking();
      const sync = stopNativeTrip();
      syncNativeAutoEnd({ active: false });
      reply({ type: 'expo:trip:result', ok: true, sync });
      break;
    }
    case 'expo:trip:restore': {
      const sync = restoreNativeTrip(msg.payload || {});
      if (sync) {
        const onLocation = (payload) => pushLocationAndSync(payload, 'foreground', sendToWebView);
        await startTracking(onLocation, { background: !!msg.payload?.background });
        sendToWebView(sync);
      }
      reply({ type: 'expo:trip:result', ok: !!sync, sync });
      break;
    }
    case 'expo:trip:sync:request': {
      const sync = getTripSyncPayload();
      reply({ type: 'expo:trip:sync:result', ok: true, sync });
      if (sync?.active) sendToWebView(sync);
      break;
    }
    case 'expo:debug:query': {
      const perm = await queryLocationPermission();
      const bgStarted = await Location.hasStartedLocationUpdatesAsync(
        'MILEPILOT_BACKGROUND_LOCATION'
      ).catch(() => false);
      const snap = getNativeDebugSnapshot({
        permissionStatus: perm,
        backgroundActive: lastBackgroundActive || bgStarted,
        backgroundTaskRunning: bgStarted,
        tripActiveNative: isNativeTripActive(),
        autopilotArmedNative: isNativeAutopilotArmed(),
        buildNumber: msg.payload?.buildNumber,
        appVersion: msg.payload?.appVersion,
        webAppUrl: msg.payload?.webAppUrl,
      });
      reply({ type: 'expo:debug:result', snapshot: snap });
      break;
    }
    case 'expo:notification:request': {
      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;
      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        status = requested.status;
      }
      reply({ type: 'expo:notification:result', status });
      break;
    }
    case 'expo:autoend:sync': {
      syncNativeAutoEnd(msg.payload || {});
      reply({ type: 'expo:autoend:sync:ok', ok: true });
      break;
    }
    case 'expo:native:background': {
      const goingBackground = !!msg.payload?.active;
      setNativeAppBackground(goingBackground);
      let bgEnsure = { ok: false, backgroundActive: lastBackgroundActive };
      if (goingBackground) {
        await loadPersistedState();
        if (isNativeTripActive()) {
          bgEnsure = await ensureBackgroundLocationForTrip();
        }
      }
      reply({
        type: 'expo:native:background:ok',
        ok: true,
        backgroundActive: !!bgEnsure.backgroundActive,
      });
      break;
    }
    case 'expo:trip:bg:ensure': {
      const bgEnsure = await ensureBackgroundLocationForTrip();
      reply({
        type: 'expo:trip:bg:result',
        ok: bgEnsure.ok !== false,
        backgroundActive: !!bgEnsure.backgroundActive,
        reason: bgEnsure.reason || null,
      });
      break;
    }
    case 'expo:location:current': {
      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const payload = locationToPayload(loc);
        if (typeof sendToWebView === 'function') {
          sendToWebView({ ...payload, type: 'expo:autopilot:location' });
        }
        reply({
          type: 'expo:location:current:result',
          ok: true,
          coords: payload.coords,
          timestamp: payload.timestamp,
        });
      } catch (e) {
        reply({ type: 'expo:location:current:result', ok: false, error: e.message });
      }
      break;
    }
    case 'expo:autopilot:arm': {
      await setNativeAutopilotArmed(true);
      const onLocation = (payload) => {
        if (typeof sendToWebView === 'function') {
          sendToWebView({ ...payload, type: 'expo:autopilot:location' });
        }
        if (!isNativeTripActive()) {
          const autoTrip = onAutopilotBackgroundLocation(payload);
          if (autoTrip) {
            sendToWebView(autoTrip);
          }
        }
      };
      await startForegroundWatch(onLocation);
      const bgEnsure = await ensureAutopilotBackgroundLocation();
      await sendAutopilotSeed(onLocation);
      startAutopilotPoll(onLocation);
      lastBackgroundActive = !!bgEnsure.backgroundActive;
      setNativeDebugMeta({
        backgroundActive: lastBackgroundActive,
        permissionStatus: await queryLocationPermission(),
      });
      reply({
        type: 'expo:autopilot:result',
        ok: true,
        backgroundActive: !!bgEnsure.backgroundActive,
      });
      break;
    }
    case 'expo:autopilot:disarm': {
      await setNativeAutopilotArmed(false);
      stopAutopilotPoll();
      if (msg.payload?.stopTracking && !isNativeTripActive()) {
        await stopAllTracking();
      } else if (!isNativeTripActive()) {
        await stopBackgroundLocationUpdates();
        lastBackgroundActive = false;
      }
      reply({ type: 'expo:autopilot:result', ok: true });
      break;
    }
    case 'expo:notification:local': {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: msg.payload?.title || 'MilePilot AutoPilot',
            body: msg.payload?.body || '',
          },
          trigger: null,
        });
        reply({ type: 'expo:notification:local:ok', ok: true });
      } catch (e) {
        reply({ type: 'expo:notification:local:ok', ok: false, error: e.message });
      }
      break;
    }
    case 'expo:settings:open': {
      // Reply before opening — iOS may background the app before injectJavaScript runs.
      reply({ type: 'expo:settings:result', ok: true });
      Linking.openSettings().catch((e) => {
        console.warn('[MilePilot] openSettings failed', e.message);
      });
      break;
    }
    default:
      break;
  }
}

export function injectLocationIntoWebView(webViewRef, payload) {
  if (!webViewRef?.current || !payload) return;
  const js = `(function(){if(window.__expoBridgeReceive){window.__expoBridgeReceive(${JSON.stringify(payload)});}})();true;`;
  webViewRef.current.injectJavaScript(js);
}
