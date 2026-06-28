/**
 * MP-039 — Runtime platform detection: browser | pwa | native
 */
(function (global) {
  'use strict';

  function isCapacitorNative() {
    try {
      return !!(global.Capacitor && global.Capacitor.isNativePlatform && global.Capacitor.isNativePlatform());
    } catch (e) {
      return false;
    }
  }

  function isStandalonePwa() {
    return (
      (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches) ||
      global.navigator.standalone === true ||
      (document.referrer && document.referrer.indexOf('android-app://') === 0)
    );
  }

  function getRuntimeMode() {
    if (isCapacitorNative()) return 'native';
    if (isStandalonePwa()) return 'pwa';
    return 'browser';
  }

  function isWebShell() {
    const mode = getRuntimeMode();
    return mode === 'browser' || mode === 'pwa';
  }

  function getRuntimeLabel() {
    const map = { native: 'Native app', pwa: 'Installed PWA', browser: 'Browser' };
    return map[getRuntimeMode()] || 'Unknown';
  }

  /** User-facing note — background GPS is native-test only */
  function getBackgroundTrackingNote() {
    if (getRuntimeMode() === 'native') {
      return 'Native background location is enabled for testing. Confirm mileage on a real drive before release.';
    }
    return 'Background tracking is tested in the native MilePilot app — not in the browser or PWA.';
  }

  global.MPPlatform = {
    isCapacitorNative: isCapacitorNative,
    isStandalonePwa: isStandalonePwa,
    isWebShell: isWebShell,
    getRuntimeMode: getRuntimeMode,
    getRuntimeLabel: getRuntimeLabel,
    getBackgroundTrackingNote: getBackgroundTrackingNote,
  };
})(typeof window !== 'undefined' ? window : global);
