/**
 * Central workspace-routing resolver for dashboard and visibility decisions.
 */
(function (global) {
  'use strict';

  const EXPERIENCE_TRACKER = 'tracker';
  const EXPERIENCE_BUSINESS = 'business';
  const MODE_AUTOPILOT = 'autopilot';
  const MODE_MANUAL = 'manual';

  function normalizeExperience(experience) {
    return experience === EXPERIENCE_BUSINESS ? EXPERIENCE_BUSINESS : EXPERIENCE_TRACKER;
  }

  function normalizeTrackingMode(mode) {
    if (mode === MODE_MANUAL) return MODE_MANUAL;
    if (mode === MODE_AUTOPILOT) return MODE_AUTOPILOT;
    return MODE_AUTOPILOT;
  }

  function canAccessFeatureByExperience(featureRegistry, experience, featureId) {
    const registry = featureRegistry || {};
    const feature = registry[featureId];
    if (!feature || !feature.built) return false;
    if (feature.experience === EXPERIENCE_TRACKER) return true;
    return experience === EXPERIENCE_BUSINESS;
  }

  function resolve(input) {
    const options = input || {};
    const profile = options.profile || {};
    const commandMode = options.commandMode || 'afternoon';
    const isActive = !!options.isActive;

    const rawExperience = profile.experience;
    const rawTrackingMode = options.trackingMode;
    const experience = normalizeExperience(rawExperience);
    const trackingMode = experience === EXPERIENCE_BUSINESS ? null : normalizeTrackingMode(rawTrackingMode);

    const featureFlags = {
      intelligenceLayer: canAccessFeatureByExperience(options.featureRegistry, experience, 'intelligence_layer'),
      businessDashboard: canAccessFeatureByExperience(options.featureRegistry, experience, 'business_dashboard'),
    };

    const hideModeChrome = isActive || commandMode === 'day_off';
    const showAutoPilot = trackingMode === MODE_AUTOPILOT;
    const showManual = trackingMode === MODE_MANUAL;
    const visibility = {
      showAutoPilotBadge: showAutoPilot && !hideModeChrome,
      showManualBanner: false,
      showAutoPilotControls: showAutoPilot,
      showAutoPilotSettings: showAutoPilot,
      showManualControls: showManual,
      primaryButtonVariant: showAutoPilot && !isActive ? 'manual_override' : 'standard',
      showIntelligenceLayer: !isActive && featureFlags.intelligenceLayer,
    };

    return {
      experience: experience,
      profession: profile.profession || 'other',
      trackingMode: trackingMode,
      dashboardTarget: isActive ? 'tracking' : 'home',
      dashboardVariant: experience === EXPERIENCE_BUSINESS ? 'business' : 'tracker',
      startup: {
        allowTrackingInitialization: experience !== EXPERIENCE_BUSINESS,
      },
      featureFlags: featureFlags,
      visibility: visibility,
      legacy: {
        fallbackExperience: rawExperience !== EXPERIENCE_TRACKER && rawExperience !== EXPERIENCE_BUSINESS,
        fallbackTrackingMode:
          experience !== EXPERIENCE_BUSINESS &&
          rawTrackingMode !== MODE_AUTOPILOT &&
          rawTrackingMode !== MODE_MANUAL,
      },
    };
  }

  global.MPWorkspaceRouting = {
    resolve: resolve,
    normalizeExperience: normalizeExperience,
    normalizeTrackingMode: normalizeTrackingMode,
  };
})(typeof window !== 'undefined' ? window : globalThis);