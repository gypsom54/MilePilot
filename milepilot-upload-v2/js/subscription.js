/**
 * MilePilot Subscription — trial and paywall (separate from tracking engine).
 * 7-day full trial, then £4.99/month for active tracking and report generation.
 * History and dashboard archive remain visible without subscription.
 */
(function (global) {
  'use strict';

  const STORAGE = {
    TRIAL_STARTED: 'mp_trial_started_at',
    SUBSCRIPTION: 'mp_subscription',
  };

  const TRIAL_DAYS = 7;
  const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const PLANS = {
    core: { id: 'core', label: 'MilePilot Core', priceLabel: '£4.99/month' },
    business: { id: 'business', label: 'MilePilot Business', priceLabel: '£9.99/month' },
    monthly: { id: 'core', label: 'MilePilot Core', priceLabel: '£4.99/month' },
  };
  const PRICE_LABEL = '£4.99/month';

  function getPlanTier() {
    const sub = loadSubscription();
    if (sub.plan === 'business' || sub.plan === 'core') return sub.plan;
    try {
      const setup = JSON.parse(global.localStorage.getItem('mp_business_setup') || '{}');
      if (setup.selectedPlan) return setup.selectedPlan;
    } catch (e) {}
    return 'core';
  }

  function getPriceLabelForPlan(plan) {
    const p = PLANS[plan] || PLANS.core;
    return p.priceLabel;
  }

  function setPlanTier(planId) {
    const sub = loadSubscription();
    saveSubscription({
      ...sub,
      plan: planId === 'business' ? 'business' : 'core',
      price: getPriceLabelForPlan(planId),
    });
    global.localStorage.setItem('mp_selected_plan', planId);
  }
  const VALUE_PROP =
    'Try the full app free for 7 days. Then ' + PRICE_LABEL + ' to keep MilePilot running.';

  function loadSubscription() {
    try {
      return JSON.parse(global.localStorage.getItem(STORAGE.SUBSCRIPTION) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveSubscription(data) {
    global.localStorage.setItem(STORAGE.SUBSCRIPTION, JSON.stringify(data));
  }

  function getTrialStartedAt() {
    const raw = global.localStorage.getItem(STORAGE.TRIAL_STARTED);
    return raw ? new Date(raw) : null;
  }

  function startTrialIfNeeded() {
    if (!global.localStorage.getItem(STORAGE.TRIAL_STARTED)) {
      global.localStorage.setItem(STORAGE.TRIAL_STARTED, new Date().toISOString());
    }
  }

  function isPaidActive() {
    return loadSubscription().status === 'active';
  }

  function isTrialActive() {
    const started = getTrialStartedAt();
    if (!started) return false;
    return Date.now() - started.getTime() < TRIAL_MS;
  }

  function hasFullAccess() {
    return isPaidActive() || isTrialActive();
  }

  function canTrack() {
    return hasFullAccess();
  }

  function canGenerateReports() {
    return hasFullAccess();
  }

  function canViewHistory() {
    return true;
  }

  function getTrialDaysRemaining() {
    const started = getTrialStartedAt();
    if (!started) return 0;
    const remaining = TRIAL_MS - (Date.now() - started.getTime());
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
  }

  function getTrialEndsAt() {
    const started = getTrialStartedAt();
    if (!started) return null;
    return new Date(started.getTime() + TRIAL_MS);
  }

  function activateSubscription(planId) {
    const plan = planId || getPlanTier();
    saveSubscription({
      status: 'active',
      plan: plan === 'business' ? 'business' : 'core',
      price: getPriceLabelForPlan(plan),
      activatedAt: new Date().toISOString(),
    });
  }

  function getStatusBanner() {
    if (isPaidActive()) return null;
    const price = getPriceLabelForPlan(getPlanTier());
    if (isTrialActive()) {
      const days = getTrialDaysRemaining();
      return {
        type: 'trial',
        message:
          days +
          ' day' +
          (days === 1 ? '' : 's') +
          ' left in your free trial · then ' +
          price,
      };
    }
    return {
      type: 'expired',
      message: 'Subscribe to continue tracking and generating reports',
    };
  }

  function getPaywallCopy() {
    const price = getPriceLabelForPlan(getPlanTier());
    return {
      title: 'Keep MilePilot running',
      body: 'Try the full app free for 7 days. Then ' + price + ' to keep MilePilot running.',
      price: price,
      note: 'Your previous trips and reports stay in your dashboard.',
    };
  }

  global.MPSubscription = {
    STORAGE: STORAGE,
    TRIAL_DAYS: TRIAL_DAYS,
    PRICE_LABEL: PRICE_LABEL,
    VALUE_PROP: VALUE_PROP,
    startTrialIfNeeded: startTrialIfNeeded,
    isPaidActive: isPaidActive,
    isTrialActive: isTrialActive,
    hasFullAccess: hasFullAccess,
    canTrack: canTrack,
    canGenerateReports: canGenerateReports,
    canViewHistory: canViewHistory,
    getTrialDaysRemaining: getTrialDaysRemaining,
    getTrialEndsAt: getTrialEndsAt,
    activateSubscription: activateSubscription,
    getPlanTier: getPlanTier,
    setPlanTier: setPlanTier,
    getPriceLabelForPlan: getPriceLabelForPlan,
    PLANS: PLANS,
    getStatusBanner: getStatusBanner,
    getPaywallCopy: getPaywallCopy,
  };
})(typeof window !== 'undefined' ? window : global);
