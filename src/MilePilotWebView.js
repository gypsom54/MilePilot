/**
 * MilePilot Expo shell — loads the existing MilePilot web UI in a WebView
 * and bridges native GPS via expo-location + expo-task-manager.
 *
 * UI, onboarding, dashboard, reports, AutoPilot logic: unchanged (served from web).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { setBackgroundLocationForwarder } from './locationTask';
import { handleWebViewMessage, injectLocationIntoWebView } from './expoLocationBridge';

const WEB_APP_URL = Constants.expoConfig?.extra?.webAppUrl || 'https://app.milepilot.uk/?runtime=expo';

/**
 * Injected before MilePilot HTML loads — exposes bridge to tracking-provider.js
 */
const BRIDGE_BOOT_SCRIPT = `
(function(){
  window.__MILEPILOT_EXPO__ = true;
  window.__MILEPILOT_RUNTIME__ = 'expo';
  document.documentElement.classList.add('mp-expo');
  window.__expoBridgeCallbacks = {};
  window.__expoBridgeReceive = function(msg) {
    try {
      if (msg && msg.type === 'expo:location' && window.__onExpoNativeLocation) {
        window.__onExpoNativeLocation(msg);
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

  const sendToWebView = useCallback((payload) => {
    injectLocationIntoWebView(webViewRef, payload);
  }, []);

  useEffect(() => {
    setBackgroundLocationForwarder((payload) => {
      sendToWebView(payload);
    });
    return () => setBackgroundLocationForwarder(null);
  }, [sendToWebView]);

  const onMessage = useCallback(
    (event) => {
      handleWebViewMessage(event.nativeEvent.data, sendToWebView);
    },
    [sendToWebView]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#031126" />
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
        // iOS: allow geolocation prompt from WebView content
        {...(Platform.OS === 'ios' ? { allowsBackForwardNavigationGestures: false } : {})}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031126',
  },
  webview: {
    flex: 1,
    backgroundColor: '#031126',
  },
  hidden: {
    opacity: 0,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#031126',
    zIndex: 2,
  },
});
