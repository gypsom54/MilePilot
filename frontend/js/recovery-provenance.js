/**
 * MP-HF-009 — Read-only recovery build provenance diagnostics.
 * No functional behaviour changes.
 */
(function (global) {
  'use strict';

  let identity = null;
  let refreshTimer = null;

  function q(id) {
    return document.getElementById(id);
  }

  function yn(val) {
    return val ? 'YES' : 'NO';
  }

  function shortHash(h) {
    if (!h || typeof h !== 'string') return '—';
    return h.length > 16 ? h.slice(0, 16) + '…' : h;
  }

  async function loadIdentity() {
    if (global.__MILEPILOT_RECOVERY_IDENTITY__) {
      return global.__MILEPILOT_RECOVERY_IDENTITY__;
    }
    try {
      const res = await fetch('./recovery-build-identity.json?v=' + (global.APP_VERSION || ''), {
        cache: 'no-store',
      });
      if (res.ok) return await res.json();
    } catch (e) {
      /* offline or not deployed yet */
    }
    return null;
  }

  async function probeNative() {
    const bridgeDetected = !!(global.MPExpoBridge && global.__MILEPILOT_EXPO__);
    let autopilotDetected = false;
    let nativeSnap = null;
    let bridgeError = null;

    if (bridgeDetected) {
      try {
        const res = await global.MPExpoBridge.request('expo:debug:query', {
          appVersion: global.APP_VERSION,
          buildNumber: global.__MILEPILOT_BUILD__,
          webAppUrl: location.href.split('?')[0],
        });
        nativeSnap = res && res.snapshot ? res.snapshot : null;
        if (nativeSnap && Object.prototype.hasOwnProperty.call(nativeSnap, 'autopilotArmedNative')) {
          autopilotDetected = true;
        }
        if (nativeSnap && nativeSnap.nativeEngine) {
          autopilotDetected = true;
        }
      } catch (e) {
        bridgeError = e.message || String(e);
      }
    }

    return {
      bridgeDetected,
      autopilotDetected,
      nativeSnap,
      bridgeError,
      buildNumber: global.__MILEPILOT_BUILD__ || '—',
    };
  }

  function renderLines(id, nativeProbe) {
    const lines = [
      '=== MP-HF-009 Recovery Validation ===',
      'Read-only provenance — no behaviour changes',
      '',
      '--- Build identity ---',
      'Spec: MP-HF-009',
      'Recovery candidate: ' + yn(id && id.recoveryCandidate),
      'Frozen commit: ' + (id ? id.frozenCommitShort || id.frozenCommit : '—'),
      'Git commit: ' + (id ? id.git?.commitShort || '—' : '—'),
      'Branch: ' + (id ? id.git?.branch || '—' : '—'),
      'APP_VERSION: ' + (global.APP_VERSION || id?.appVersion || '?'),
      'version.txt: ' + (id?.versionTxt || '?'),
      'iOS buildNumber: ' + (nativeProbe.buildNumber || id?.iosBuildNumber || '?'),
      'EAS profile: ' + (id?.easProfile || 'recovery-hf009'),
      '',
      '--- Hashes ---',
      'Bundle hash: ' + (id?.bundleHash || '—'),
      'Bundle hash (short): ' + shortHash(id?.bundleHash),
      'Native source hash: ' + (id?.nativeSourceHash || '—'),
      'Native source hash (short): ' + shortHash(id?.nativeSourceHash),
      '',
      '--- Runtime detection ---',
      'nativeAutoPilot detected: ' + yn(nativeProbe.autopilotDetected || (id && id.nativeAutopilotModulePresent)),
      'native bridge detected: ' + yn(nativeProbe.bridgeDetected),
      'Recovery candidate: ' + yn(id && id.recoveryCandidate),
      '',
      '--- Deployment ---',
      'Web URL: ' + location.href,
      'Pinned webAppUrl: ' + (id?.webAppUrl || '—'),
      'Runtime: ' + (global.__MILEPILOT_RUNTIME__ || 'web'),
      '',
      '--- Native snapshot ---',
      'AutoPilot armed (native): ' + (nativeProbe.nativeSnap?.autopilotArmedNative != null ? yn(nativeProbe.nativeSnap.autopilotArmedNative) : '—'),
      'Background task running: ' + (nativeProbe.nativeSnap?.backgroundTaskRunning != null ? yn(nativeProbe.nativeSnap.backgroundTaskRunning) : '—'),
      'Permission: ' + (nativeProbe.nativeSnap?.permissionStatus || '—'),
    ];

    if (id?.fileHashes) {
      lines.push('', '--- Critical file hashes (build-time) ---');
      Object.keys(id.fileHashes).forEach(function (k) {
        lines.push(k + ': ' + shortHash(id.fileHashes[k]));
      });
    }

    if (nativeProbe.bridgeError) {
      lines.push('', 'Bridge error: ' + nativeProbe.bridgeError);
    }

    if (id?.alternateCandidate) {
      lines.push('', 'Alternate candidate (if FAIL): ' + id.alternateCandidate);
    }

  if (id?.generatedAt) {
      lines.push('', 'Identity generated: ' + id.generatedAt);
    }

    return lines.join('\n');
  }

  async function refresh() {
    const el = q('recoveryProvenanceBody');
    const summary = q('recoveryProvenanceSummary');
    const card = q('recoveryProvenanceCard');
    if (!identity) identity = await loadIdentity();
    if (card) card.hidden = !(identity && identity.recoveryCandidate);
    const nativeProbe = await probeNative();
    const text = renderLines(identity, nativeProbe);
    if (el) el.textContent = text;
    if (summary) summary.textContent = text.split('\n').slice(0, 18).join('\n');
    if (!el && !summary) return;
  }

  function open() {
    if (typeof global.showScreen === 'function') global.showScreen('recoveryProvenance');
    refresh();
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(refresh, 4000);
  }

  function close() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
      refreshTimer = null;
    }
    if (typeof global.showSettings === 'function') global.showSettings();
  }

  async function init() {
    identity = await loadIdentity();
    const card = q('recoveryProvenanceCard');
    if (card) card.hidden = !(identity && identity.recoveryCandidate);
    if (identity && identity.recoveryCandidate) {
      refresh();
    }
    const debugParam = new URLSearchParams(location.search).get('debug');
    if (debugParam === 'recovery' && identity && identity.recoveryCandidate) {
      setTimeout(open, 500);
    }
  }

  global.MPRecoveryProvenance = {
    init: init,
    open: open,
    close: close,
    refresh: refresh,
    getIdentity: function () {
      return identity;
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : global);
