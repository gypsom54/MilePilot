/**
 * VITAL — BUSINESS CRITICAL (MP-043)
 * Expo native location bridge — routes GPS to WebView handlePos.
 * Do not modify without reading docs/TRACKING_CONTRACT.md
 */
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import {
  startBackgroundLocationUpdates,
  stopBackgroundLocationUpdates,
} from './locationTask';
import { syncNativeAutoEnd, setNativeAutoEndInjector } from './nativeAutoEnd';

export { setNativeAutoEndInjector, syncNativeAutoEnd };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let foregroundSubscription = null;

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

export async function queryLocationPermission() {
  const fg = await Location.getForegroundPermissionsAsync();
  if (fg.status !== 'granted') return fg.status;
  const bg = await Location.getBackgroundPermissionsAsync();
  return bg.status === 'granted' ? 'granted' : fg.status;
}

export async function requestLocationPermission(includeBackground) {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== 'granted') return fg.status;
  if (!includeBackground) return 'granted';
  const bg = await Location.requestBackgroundPermissionsAsync();
  return bg.status === 'granted' ? 'granted' : fg.status;
}

/**
 * FOREGROUND GPS — expo-location watch while app is open.
 */
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
}

/**
 * Start tracking — foreground watch + optional background task.
 * BACKGROUND GPS TEST POINT: background:true starts expo-task-manager updates.
 */
export async function startTracking(onLocation, { background = false } = {}) {
  await startForegroundWatch(onLocation);

  if (background) {
    const bgPerm = await Location.getBackgroundPermissionsAsync();
    if (bgPerm.status === 'granted') {
      await startBackgroundLocationUpdates();
    } else {
      console.warn('[MilePilot] background permission not granted — foreground only');
    }
  }

  return { ok: true };
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
      reply({ type: 'expo:permission:result', status });
      break;
    }
    case 'expo:permission:request': {
      const status = await requestLocationPermission(!!msg.payload?.background);
      reply({ type: 'expo:permission:result', status });
      break;
    }
    case 'expo:tracking:start': {
      const onLocation = (payload) => sendToWebView(payload);
      await startTracking(onLocation, { background: !!msg.payload?.background });
      reply({ type: 'expo:tracking:result', ok: true });
      break;
    }
    case 'expo:tracking:stop': {
      await stopAllTracking();
      reply({ type: 'expo:tracking:result', ok: true });
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
    default:
      break;
  }
}

export function injectLocationIntoWebView(webViewRef, payload) {
  if (!webViewRef?.current || !payload) return;
  const js = `(function(){if(window.__expoBridgeReceive){window.__expoBridgeReceive(${JSON.stringify(payload)});}})();true;`;
  webViewRef.current.injectJavaScript(js);
}
