/**
 * MilePilot Plan UX (MP-020)
 * Tracker vs Pro visibility and work-type personalisation.
 * No payments — plan stored locally until billing is built.
 */
(function (global) {
  'use strict';

  const VERSION = 1;
  const STORAGE_PLAN = 'mp_user_plan';
  const STORAGE_WORK = 'mp_user_work_type';

  const PLANS = {
    tracker: {
      id: 'tracker',
      label: 'MilePilot Tracker',
      tagline: 'Business mileage on AutoPilot — no clutter.',
      summary: 'Layer 1 · Auto-detect · Reports · HMRC · History',
    },
    pro: {
      id: 'pro',
      label: 'MilePilot Pro',
      tagline: 'Run your business on AutoPilot.',
      summary: 'Layer 2 · Everything in Tracker · Insights · Goals · Expenses soon',
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

  function getUserPlan() {
    return localStorage.getItem(STORAGE_PLAN) || 'pro';
  }

  function setUserPlan(plan) {
    if (PLANS[plan]) localStorage.setItem(STORAGE_PLAN, plan);
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
    return PLANS[plan || getUserPlan()] || PLANS.pro;
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
    if (localStorage.getItem(STORAGE_PLAN)) return;
    const onboarded =
      localStorage.getItem('mp_onboard_complete') === 'true' ||
      localStorage.getItem('mp_email') ||
      localStorage.getItem('mp_report_frequency') ||
      localStorage.getItem('mp_shifts');
    if (onboarded) {
      setUserPlan('pro');
      if (!localStorage.getItem(STORAGE_WORK)) setUserWorkType('other');
    }
  }

  global.MPPlanUX = {
    VERSION,
    PLANS,
    WORK_TYPES,
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
