/**
 * CRITICAL MILEAGE ENGINE FILE — MP-043
 * Expo WebView shell. Native engine owns background mileage; WebView displays synced state.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { setBackgroundLocationForwarder, takePendingBackgroundLocations } from './locationTask';
import {
  handleWebViewMessage,
  injectLocationIntoWebView,
  initNativeTracking,
  ensureBackgroundLocationForTrip,
} from './expoLocationBridge';
import { setNativeAutoEndInjector, flushPendingNativeAutoEnd } from './nativeAutoEnd';
import {
  getTripSyncPayload,
  setNativeDebugMeta,
  setNativeAppBackground,
  loadPersistedState,
} from './nativeTrackingEngine';

const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://app.milepilot.uk/?runtime=expo';
const BUILD_NUMBER = Constants.expoConfig?.ios?.buildNumber || '?';

const BRIDGE_BOOT_SCRIPT = `
(function(){
  window.__MILEPILOT_EXPO__ = true;
  window.__MILEPILOT_RUNTIME__ = 'expo';
  window.__MILEPILOT_BUILD__ = '${BUILD_NUMBER}';
  document.documentElement.classList.add('mp-expo');
  window.__expoBridgeCallbacks = {};
  window.__expoBridgeReceive = function(msg) {
    try {
      if (msg && msg.type === 'expo:trip:sync' && typeof window.__onNativeTripSync === 'function') {
        window.__onNativeTripSync(msg);
      }
      if (msg && msg.type === 'expo:autopilot:location' && typeof window.__onAutopilotLocation === 'function') {
        window.__onAutopilotLocation(msg);
      } else if (msg && (msg.type === 'expo:location' || msg.type === 'expo:autopilot:location') && window.__onExpoNativeLocation) {
        window.__onExpoNativeLocation(msg);
      }
      if (msg && msg.type === 'expo:autoend:trigger' && typeof window.__onExpoAutoEnd === 'function') {
        window.__onExpoAutoEnd(msg);
      }
      if (msg && msg.id && window.__expoBridgeCallbacks[msg.id]) {
        window.__expoBridgeCallbacks[msg.id](msg);
        delete window.__expoBridgeCallbacks[msg.id];
      }
    } catch (e) { console.error('[MPExpoBridge]', e); }
  };
  window.MPExpoBridge = {
    post: function(raw) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(typeof raw === 'string' ? raw : JSON.stringify(raw));
      }
    },
    request: function(type, payload) {
      return new Promise(function(resolve) {
        var id = 'e' + Date.now() + Math.random().toString(36).slice(2, 8);
        window.__expoBridgeCallbacks[id] = resolve;
        window.MPExpoBridge.post({ type: type, id: id, payload: payload || {} });
      });
    }
  };
})();
true;
`;

export default function MilePilotWebView() {
  const webViewRef = useRef(null);
  const [ready, setReady] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  const sendToWebView = useCallback((payload) => {
    if (!payload) return;
    injectLocationIntoWebView(webViewRef, payload);
  }, []);

  useEffect(() => {
    initNativeTracking().catch((e) => console.warn('[MilePilot] initNativeTracking', e.message));
  }, []);

  useEffect(() => {
    setBackgroundLocationForwarder((sync) => {
      setNativeDebugMeta({ appState: appStateRef.current });
      sendToWebView(sync);
    });
    setNativeAutoEndInjector(() => {
      injectLocationIntoWebView(webViewRef, { type: 'expo:autoend:trigger', timestamp: Date.now() });
    });
    return () => {
      setBackgroundLocationForwarder(null);
      setNativeAutoEndInjector(null);
    };
  }, [sendToWebView]);

  useEffect(() => {
    const pushNativeState = () => {
      const buffered = takePendingBackgroundLocations();
      buffered.forEach((sync) => sendToWebView(sync));
      const current = getTripSyncPayload();
      if (current?.active) {
        console.log('[MilePilot] pushing native trip sync on resume', current.miles, 'mi');
        sendToWebView(current);
      }
    };
    const sub = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
      setNativeDebugMeta({ appState: nextState });
      setNativeAppBackground(nextState !== 'active');
      if (nextState === 'background' || nextState === 'inactive') {
        sendToWebView({ type: 'expo:appstate', state: nextState });
        loadPersistedState()
          .catch((e) => console.warn('[MilePilot] loadPersistedState on lock', e.message))
          .then(() => {
            const tripNow = getTripSyncPayload();
            if (!tripNow?.active) return null;
            return ensureBackgroundLocationForTrip();
          })
          .then((res) => {
            if (res?.backgroundActive) {
              console.log('[MilePilot] background GPS ensured on lock');
            } else if (res) {
              console.warn('[MilePilot] bg ensure on lock failed', res.reason || res.error || 'unknown');
            }
          })
          .catch((e) => console.warn('[MilePilot] bg ensure on lock', e.message));
      }
      if (nextState === 'active') {
        sendToWebView({ type: 'expo:appstate', state: 'active' });
        pushNativeState();
        flushPendingNativeAutoEnd();
      }
    });
    return () => sub.remove();
  }, [sendToWebView]);

  const onMessage = useCallback(
    (event) => {
      handleWebViewMessage(event.nativeEvent.data, sendToWebView);
    },
    [sendToWebView]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020B1B" />
      {!ready && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0D6BFF" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={[styles.webview, !ready && styles.hidden]}
        onLoadEnd={() => setReady(true)}
        onMessage={onMessage}
        injectedJavaScriptBeforeContentLoaded={BRIDGE_BOOT_SCRIPT}
        geolocationEnabled
        allowsInlineMediaPlayback
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        originWhitelist={['*']}
        setSupportMultipleWindows={false}
        {...(Platform.OS === 'ios' ? { allowsBackForwardNavigationGestures: false } : {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020B1B',
  },
  webview: {
    flex: 1,
    backgroundColor: '#020B1B',
  },
  hidden: {
    opacity: 0,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#020B1B',
    zIndex: 2,
  },
});
