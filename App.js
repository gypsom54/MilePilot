/**
 * MilePilot Expo app root — native shell only.
 * All product UI lives in the WebView (existing MilePilot frontend).
 */
import MilePilotWebView from './src/MilePilotWebView';

export default function App() {
  return <MilePilotWebView />;
}
