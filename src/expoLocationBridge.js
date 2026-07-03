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
  if (typeof sendToWebView === 'function') {
    if (sync) sendToWebView(sync);
    // Foreground GPS also feeds WebView handlePos for live map/miles while app is open.
    if (source === 'foreground') {
      sendToWebView({ type: 'expo:location', ...payload });
    }
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
  await stopBackgroundLocationUpdates();
  lastBackgroundActive = false;
}

export async function startTracking(onLocation, { background = false } = {}) {
  await startForegroundWatch(onLocation);

  let backgroundActive = false;
  if (background) {
    const bgPerm = await Location.getBackgroundPermissionsAsync();
    if (bgPerm.status === 'granted') {
      await startBackgroundLocationUpdates();
      backgroundActive = true;
    } else {
      console.warn('[MilePilot] background permission not granted — foreground only');
    }
  }

  lastBackgroundActive = backgroundActive;
  setNativeDebugMeta({ backgroundActive, permissionStatus: await queryLocationPermission() });
  return { ok: true, backgroundActive };
}

export async function initNativeTracking() {
  await loadPersistedState();
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
      const result = await startTracking(onLocation, { background: !!msg.payload?.background });
      const sync = startNativeTrip(msg.payload || {});
      if (msg.payload?.autoEnd) syncNativeAutoEnd(msg.payload.autoEnd);
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
      setNativeAppBackground(!!msg.payload?.active);
      reply({ type: 'expo:native:background:ok', ok: true });
      break;
    }
    case 'expo:autopilot:arm': {
      const onLocation = (payload) => {
        if (typeof sendToWebView === 'function') {
          // Keep type last — locationToPayload includes type: 'expo:location'.
          sendToWebView({ ...payload, type: 'expo:autopilot:location' });
        }
        if (!isNativeTripActive()) {
          onNativeBackgroundLocation(payload);
        }
      };
      const result = await startTracking(onLocation, { background: !!msg.payload?.background });
      reply({ type: 'expo:autopilot:result', ok: result.ok, backgroundActive: !!result.backgroundActive });
      break;
    }
    case 'expo:autopilot:disarm': {
      if (!isNativeTripActive()) {
        await stopAllTracking();
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
