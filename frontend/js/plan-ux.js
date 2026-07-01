/**
 * MilePilot Plan UX (MP-020 / MP-047)
 * Tracking style (AutoPilot vs Manual) — not pricing tiers.
 */
(function (global) {
  'use strict';

  const VERSION = 2;
  const STORAGE_PLAN = 'mp_user_plan';
  const STORAGE_WORK = 'mp_user_work_type';
  const STORAGE_TRACKING_MODE = 'mp_tracking_mode';

  const TRACKING_MODES = {
    autopilot: {
      id: 'autopilot',
      label: 'AutoPilot',
      badge: 'Recommended',
      desc: 'Drive normally. MilePilot detects journeys automatically in the background.',
      tagline: 'Automatic background tracking',
    },
    manual: {
      id: 'manual',
      label: 'Manual',
      badge: '',
      desc: 'Start and stop journeys yourself. Perfect if you prefer full control.',
      tagline: 'Start and stop yourself',
    },
  };

  /** Legacy plan ids — kept for dashboard class hooks; not shown in onboarding. */
  const PLANS = {
    tracker: {
      id: 'tracker',
      label: 'AutoPilot',
      tagline: 'Automatic background tracking',
      summary: 'Auto-detect · Reports · HMRC · History',
    },
    pro: {
      id: 'pro',
      label: 'Manual',
      tagline: 'Start and stop yourself',
      summary: 'Full control · Reports · HMRC · History',
    },
  };

  const WORK_TYPES = {
    professional_driver: {
      id: 'professional_driver',
      label: 'Professional Driver',
      examples: 'Taxi · Private Hire · Courier · Delivery',
      status: 'Ready for today\'s business travel?',
      vehicle: 'car',
    },
    tradesperson: {
      id: 'tradesperson',
      label: 'Tradesperson',
      examples: 'Plumber · Electrician · Builder · Joiner',
      status: 'Ready for today\'s work journeys?',
      vehicle: 'van',
    },
    mobile_business: {
      id: 'mobile_business',
      label: 'Mobile Business',
      examples: 'Cleaner · Gardener · Mechanic · Photographer',
      status: 'Ready to record today\'s business travel?',
      vehicle: 'car',
    },
    self_employed_professional: {
      id: 'self_employed_professional',
      label: 'Self-employed Professional',
      examples: 'Consultant · Estate Agent · Surveyor · Sales',
      status: 'Ready for today\'s client visits?',
      vehicle: 'car',
    },
    other: {
      id: 'other',
      label: 'Other Business Use',
      examples: 'Any business mileage',
      status: 'Business travel. On AutoPilot.',
      vehicle: 'car',
    },
  };

  function getTrackingMode() {
    const stored = localStorage.getItem(STORAGE_TRACKING_MODE);
    if (stored === 'autopilot' || stored === 'manual') return stored;
    if (localStorage.getItem(STORAGE_PLAN) === 'tracker') return 'autopilot';
    if (localStorage.getItem(STORAGE_PLAN) === 'pro') return 'manual';
    return 'autopilot';
  }

  function setTrackingMode(mode) {
    if (!TRACKING_MODES[mode]) return;
    localStorage.setItem(STORAGE_TRACKING_MODE, mode);
    localStorage.setItem(STORAGE_PLAN, 'pro');
    if (mode === 'autopilot') {
      localStorage.setItem('mp_autopilot_enabled', 'true');
      localStorage.setItem('mp_motion_choice', 'enabled');
    } else {
      localStorage.setItem('mp_autopilot_enabled', 'manual');
      localStorage.removeItem('mp_motion_choice');
    }
  }

  function getTrackingModeMeta(mode) {
    return TRACKING_MODES[mode || getTrackingMode()] || TRACKING_MODES.autopilot;
  }

  function isAutoPilotMode() {
    return getTrackingMode() === 'autopilot';
  }

  function isManualMode() {
    return getTrackingMode() === 'manual';
  }

  function getUserPlan() {
    return localStorage.getItem(STORAGE_PLAN) || (isAutoPilotMode() ? 'tracker' : 'pro');
  }

  function setUserPlan(plan) {
    if (plan === 'tracker') setTrackingMode('autopilot');
    else if (plan === 'pro') setTrackingMode('manual');
    else if (PLANS[plan]) localStorage.setItem(STORAGE_PLAN, plan);
  }

  function getUserWorkType() {
    return localStorage.getItem(STORAGE_WORK) || 'other';
  }

  function setUserWorkType(type) {
    if (WORK_TYPES[type]) localStorage.setItem(STORAGE_WORK, type);
  }

  function isPro() {
    return getUserPlan() === 'pro';
  }

  function isTracker() {
    return getUserPlan() === 'tracker';
  }

  function getPlanMeta(plan) {
    const mode = plan === 'tracker' ? 'autopilot' : plan === 'pro' ? 'manual' : getTrackingMode();
    return getTrackingModeMeta(mode);
  }

  function getWorkTypeMeta(type) {
    return WORK_TYPES[type || getUserWorkType()] || WORK_TYPES.other;
  }

  function getWorkTypeStatus() {
    return getWorkTypeMeta().status;
  }

  function defaultVehicleForWorkType(type) {
    return getWorkTypeMeta(type).vehicle || 'car';
  }

  function migrateLegacyUser() {
    if (localStorage.getItem('mp_onboarding_reset') === 'true') return;
    if (localStorage.getItem(STORAGE_TRACKING_MODE)) return;
    const plan = localStorage.getItem(STORAGE_PLAN);
    if (plan === 'tracker') setTrackingMode('autopilot');
    else if (plan === 'pro') setTrackingMode('manual');
    else if (
      localStorage.getItem('mp_onboard_complete') === 'true' ||
      localStorage.getItem('mp_email') ||
      localStorage.getItem('mp_report_frequency') ||
      localStorage.getItem('mp_shifts')
    ) {
      setTrackingMode('autopilot');
      if (!localStorage.getItem(STORAGE_WORK)) setUserWorkType('other');
    }
  }

  global.MPPlanUX = {
    VERSION,
    PLANS,
    TRACKING_MODES,
    WORK_TYPES,
    getTrackingMode,
    setTrackingMode,
    getTrackingModeMeta,
    isAutoPilotMode,
    isManualMode,
    getUserPlan,
    setUserPlan,
    getUserWorkType,
    setUserWorkType,
    isPro,
    isTracker,
    getPlanMeta,
    getWorkTypeMeta,
    getWorkTypeStatus,
    defaultVehicleForWorkType,
    migrateLegacyUser,
  };
})(typeof window !== 'undefined' ? window : global);
