/**
 * MilePilot Expo app root — native shell only.
 * All product UI lives in the WebView (existing MilePilot frontend).
 */
import { useEffect } from 'react';
import MilePilotWebView from './src/MilePilotWebView';
import { initNativeTracking } from './src/expoLocationBridge';

export default function App() {
  useEffect(() => {
    initNativeTracking().catch((e) => console.warn('[MilePilot] initNativeTracking', e.message));
  }, []);

  return <MilePilotWebView />;
}
