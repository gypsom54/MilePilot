/**
 * MilePilot Conversational Onboarding — branching workspace builder
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_business_setup';
  const PROFILE_KEY = 'mp_business_profile';

  const GOALS = [
    { id: 'track_mileage', label: 'Track my mileage' },
    { id: 'organise_receipts', label: 'Organise my receipts' },
    { id: 'track_expenses', label: 'Track my expenses' },
    { id: 'help_vat', label: 'Help with VAT' },
    { id: 'tax_records', label: 'Prepare tax records' },
    { id: 'accountant', label: 'Get everything ready for my accountant' },
    { id: 'understand_business', label: 'Understand my business better' },
    { id: 'reduce_paperwork', label: 'Reduce paperwork' },
  ];

  const VEHICLE_USE = [
    { id: 'daily', label: 'Yes, every day' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'no', label: 'No / not really' },
  ];

  const TRACKING_PREF = [
    { id: 'autopilot', label: 'Yes, use AutoPilot' },
    { id: 'manual', label: 'I prefer Manual tracking' },
    { id: 'later', label: "I'll decide later" },
  ];

  const VAT_OPTIONS = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'unsure', label: 'Not sure' },
  ];

  const PLANS = {
    core: {
      id: 'core',
      label: 'MilePilot Core',
      priceLabel: '£4.99/month',
      experience: 'tracker',
    },
    business: {
      id: 'business',
      label: 'MilePilot Business',
      priceLabel: '£9.99/month',
      experience: 'business',
    },
  };

  const LEGACY_GOAL_MAP = {
    tracking_mileage: 'track_mileage',
    saving_receipts: 'organise_receipts',
    adding_vat: 'help_vat',
    tracking_expenses: 'track_expenses',
    business_reports: 'understand_business',
    less_paperwork: 'reduce_paperwork',
  };

  let typingTimer = null;
  let pendingAfterAck = null;
  let flowSteps = ['welcome', 'goals'];

  function q(id) {
    return document.getElementById(id);
  }

  function defaultSetup() {
    return {
      goals: [],
      vehicleUse: null,
      trackingPreference: null,
      vatRegistered: null,
      recommendedSetup: null,
      selectedPlan: null,
      setupComplete: false,
      dashboardMode: 'mileage',
    };
  }

  function loadSetup() {
    try {
      const raw = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
      if (raw.goals) {
        raw.goals = raw.goals.map(function (g) {
          return LEGACY_GOAL_MAP[g] || g;
        });
      }
      if (raw.adminPainPoints && !raw.goals) {
        raw.goals = raw.adminPainPoints.map(function (p) {
          return LEGACY_GOAL_MAP[p] || p;
        });
      }
      if (raw.trackingModeChoice && !raw.trackingPreference) {
        raw.trackingPreference = raw.trackingModeChoice;
      }
      return { ...defaultSetup(), ...raw };
    } catch (e) {
      return defaultSetup();
    }
  }

  function saveSetup(updates) {
    const next = { ...loadSetup(), ...updates };
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    syncSetupToProfile(next);
    return next;
  }

  function syncSetupToProfile(setup) {
    if (typeof global.saveBusinessProfile !== 'function') return;
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    const mileageFocus = setup.dashboardMode === 'mileage' || setup.dashboardMode === 'mixed';
    const businessHubFocus = setup.dashboardMode === 'business' || setup.dashboardMode === 'mixed';
    global.saveBusinessProfile({
      profession: 'other',
      experience: plan.experience,
      receiptsEnabled: businessHubFocus,
      vatRegistered:
        setup.vatRegistered === 'yes' ? true : setup.vatRegistered === 'no' ? false : null,
      businessSetup: setup,
      dashboardMode: setup.dashboardMode,
      mileageFocus: mileageFocus,
      businessHubFocus: businessHubFocus,
      selectedPlan: setup.selectedPlan,
    });
  }

  function selectedMileageGoal(setup) {
    return (setup || loadSetup()).goals.includes('track_mileage');
  }

  function selectedVatGoal(setup) {
    return (setup || loadSetup()).goals.includes('help_vat');
  }

  function usesVehicle(setup) {
    const s = setup || loadSetup();
    return s.vehicleUse === 'daily' || s.vehicleUse === 'sometimes';
  }

  function wantsBusinessHub(setup) {
    const s = setup || loadSetup();
    const g = s.goals || [];
    return (
      g.includes('organise_receipts') ||
      g.includes('track_expenses') ||
      g.includes('help_vat') ||
      g.includes('tax_records') ||
      g.includes('accountant') ||
      g.includes('understand_business') ||
      g.includes('reduce_paperwork') ||
      s.vatRegistered === 'yes'
    );
  }

  function wantsMileageWorkspace(setup) {
    const s = setup || loadSetup();
    return selectedMileageGoal(s) && usesVehicle(s);
  }

  function buildFlow(setup) {
    const steps = ['welcome', 'goals'];
    if (selectedMileageGoal(setup)) steps.push('vehicleUse');
    if (selectedMileageGoal(setup) && usesVehicle(setup)) steps.push('trackingPreference');
    if (selectedVatGoal(setup)) steps.push('vat');
    steps.push('building', 'recommendation', 'choosePlan');
    flowSteps = steps;
    return steps;
  }

  function computeRecommendation(setup) {
    const s = setup || loadSetup();
    const mileage = wantsMileageWorkspace(s);
    const business = wantsBusinessHub(s);

    if (mileage && business) {
      return {
        setup: 'mixed',
        dashboardMode: 'mixed',
        items: [
          'AutoPilot mileage tracking',
          'Business Hub',
          'AI Receipt Scanner',
          'VAT summaries',
          'Accountant Pack',
        ],
        plan: 'business',
        intro: "Here's what I recommend.",
      };
    }
    if (business && !mileage) {
      return {
        setup: 'business',
        dashboardMode: 'business',
        items: [
          'Business Hub',
          'AI Receipt Scanner',
          'Expense tracking',
          'VAT summaries',
          'Accountant Pack',
        ],
        plan: 'business',
        intro: "Here's what I recommend.",
      };
    }
    return {
      setup: 'mileage',
      dashboardMode: 'mileage',
      items: [
        'AutoPilot mileage tracking',
        'HMRC mileage estimates',
        'PDF/email reports',
      ],
      plan: 'core',
      intro: "Here's what I recommend.",
    };
  }

  function getDashboardMode() {
    const profile = getProfile();
    return profile.dashboardMode || loadSetup().dashboardMode || 'mileage';
  }

  function getProfile() {
    if (typeof global.getBusinessProfile === 'function') return global.getBusinessProfile();
    try {
      return JSON.parse(global.localStorage.getItem(PROFILE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function clearTyping() {
    if (typingTimer) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }

  function typeLines(el, lines, onDone, speed) {
    clearTyping();
    if (!el) {
      if (onDone) onDone();
      return;
    }
    let lineIdx = 0;
    let charIdx = 0;
    el.innerHTML = '';
    const ms = speed || 28;
    function tick() {
      if (lineIdx >= lines.length) {
        clearTyping();
        if (onDone) onDone();
        return;
      }
      const line = lines[lineIdx];
      if (charIdx === 0 && lineIdx > 0) el.innerHTML += '<br>';
      if (charIdx < line.length) {
        const current = el.innerHTML.split('<br>');
        current[lineIdx] = (current[lineIdx] || '') + line.charAt(charIdx);
        el.innerHTML = current.join('<br>');
        charIdx++;
      } else {
        lineIdx++;
        charIdx = 0;
      }
    }
    typingTimer = setInterval(tick, ms);
    tick();
  }

  function getAckForGoals(goals) {
    const lines = [];
    if (goals.includes('track_mileage')) {
      lines.push('Perfect.', "I'll make sure mileage tracking is part of your workspace.");
    }
    if (goals.includes('organise_receipts') || goals.includes('track_expenses')) {
      lines.push('Great.', "I'll prioritise Business Hub and receipt organisation.");
    }
    if (goals.includes('help_vat')) {
      lines.push('Excellent.', "I'll include VAT summaries and receipt automation.");
    }
    if (goals.includes('accountant')) {
      lines.push('No problem.', "I'll make sure accountant-ready reports are included.");
    }
    if (goals.includes('reduce_paperwork')) {
      lines.push("That's exactly what MilePilot is built for.", "I'll keep things simple.");
    }
    if (!lines.length) {
      lines.push('Great.', "Let's build the right workspace for you.");
    }
    return lines.slice(0, 6);
  }

  function getAckForVat(vat) {
    if (vat === 'yes') {
      return ['Great.', "I'll prioritise VAT summaries, receipts and accountant reports."];
    }
    return ['Noted.', "We'll keep things simple for now."];
  }

  function showAck(lines, nextStep) {
    pendingAfterAck = nextStep;
    document.querySelectorAll('.bs-step').forEach(function (el) {
      el.hidden = el.dataset.step !== 'ack';
    });
    showFooterFor('ack');
    updateProgress('ack');
    syncContinueBtn('bsAckContinue', false);
    typeLines(q('bsAckTyping'), lines, function () {
      syncContinueBtn('bsAckContinue', true);
    });
  }

  function renderOptionCards(container, options, selected, multi) {
    if (!container) return;
    container.innerHTML = options
      .map(function (opt) {
        const sel = multi ? (selected || []).includes(opt.id) : selected === opt.id;
        return (
          '<button type="button" class="bs-option' +
          (sel ? ' is-selected' : '') +
          '" data-id="' +
          opt.id +
          '"><span class="bs-option-label">' +
          opt.label +
          '</span></button>'
        );
      })
      .join('');
  }

  function bindOptionCards(container, onSelect) {
    if (!container) return;
    container.querySelectorAll('.bs-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        onSelect(btn.dataset.id);
      });
    });
  }

  function refreshSingleSelect(grid, options, selected, onSelect) {
    renderOptionCards(grid, options, selected, false);
    bindOptionCards(grid, onSelect);
  }

  function updateProgress(step) {
    const setup = loadSetup();
    buildFlow(setup);
    const idx = flowSteps.indexOf(step);
    const pct = idx < 0 ? 0 : Math.round((idx / Math.max(1, flowSteps.length - 1)) * 100);
    const fill = q('bsProgressFill');
    const label = q('bsProgressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label && idx >= 0) {
      label.textContent = 'Step ' + (idx + 1) + ' of ' + flowSteps.length;
    }
  }

  const FOOTER_BTNS = {
    welcome: 'bsWelcomeContinue',
    ack: 'bsAckContinue',
    goals: 'bsGoalsContinue',
    vehicleUse: 'bsVehicleUseContinue',
    trackingPreference: 'bsTrackingContinue',
    vat: 'bsVatContinue',
    recommendation: 'bsRecommendContinue',
    choosePlan: 'bsPlanContinue',
  };

  function showFooterFor(step) {
    Object.keys(FOOTER_BTNS).forEach(function (key) {
      const btn = q(FOOTER_BTNS[key]);
      if (!btn) return;
      btn.hidden = key !== step;
    });
    if (step === 'building') {
      Object.keys(FOOTER_BTNS).forEach(function (key) {
        const btn = q(FOOTER_BTNS[key]);
        if (btn) btn.hidden = true;
      });
    }
  }

  function showStep(step) {
    document.querySelectorAll('.bs-step').forEach(function (el) {
      el.hidden = el.dataset.step !== step;
    });
    showFooterFor(step);
    updateProgress(step);
    if (step === 'welcome') initWelcomeStep();
    if (step === 'goals') initGoalsStep();
    if (step === 'vehicleUse') initVehicleUseStep();
    if (step === 'trackingPreference') initTrackingPreferenceStep();
    if (step === 'vat') initVatStep();
    if (step === 'building') runBuildingSequence();
    if (step === 'recommendation') renderRecommendation();
    if (step === 'choosePlan') renderPlanCards();
  }

  function initWelcomeStep() {
    const name =
      global.localStorage.getItem('mp_driver') ||
      (typeof global.driver !== 'undefined' ? global.driver : '') ||
      'there';
    const greet = name && name !== 'there' ? 'Hi ' + name + ' 👋' : 'Hi there 👋';
    typeLines(q('bsWelcomeTyping'), [
      greet,
      "Let's build your business assistant.",
      "I'll ask a couple of quick questions, then create the best workspace for you.",
    ]);
  }

  function initGoalsStep() {
    const setup = loadSetup();
    const grid = q('bsGoalsGrid');
    const goals = setup.goals || [];
    renderOptionCards(grid, GOALS, goals, true);
    bindOptionCards(grid, function (id) {
      let next = goals.slice();
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else next.push(id);
      saveSetup({ goals: next });
      initGoalsStep();
    });
    syncContinueBtn('bsGoalsContinue', goals.length > 0);
  }

  function initVehicleUseStep() {
    const setup = loadSetup();
    const bridge = q('bsVehicleBridge');
    if (bridge) {
      typeLines(bridge, ["Because you'd like help with mileage..."], function () {});
    }
    function onSelect(id) {
      saveSetup({ vehicleUse: id });
      refreshSingleSelect(q('bsVehicleUseGrid'), VEHICLE_USE, id, onSelect);
      syncContinueBtn('bsVehicleUseContinue', true);
    }
    refreshSingleSelect(q('bsVehicleUseGrid'), VEHICLE_USE, setup.vehicleUse, onSelect);
    syncContinueBtn('bsVehicleUseContinue', !!setup.vehicleUse);
  }

  function initTrackingPreferenceStep() {
    const setup = loadSetup();
    const bridge = q('bsTrackingBridge');
    if (bridge) {
      typeLines(bridge, ['To build the right workspace...'], function () {});
    }
    function onSelect(id) {
      saveSetup({ trackingPreference: id });
      if (id !== 'later' && typeof global.MPTrackingMode !== 'undefined') {
        global.MPTrackingMode.setMode(id === 'autopilot' ? 'autopilot' : 'manual');
      }
      if (typeof global.selectedTrackingMode !== 'undefined' && id !== 'later') {
        global.selectedTrackingMode = id === 'autopilot' ? 'autopilot' : 'manual';
      }
      refreshSingleSelect(q('bsTrackingGrid'), TRACKING_PREF, id, onSelect);
      syncContinueBtn('bsTrackingContinue', true);
    }
    refreshSingleSelect(q('bsTrackingGrid'), TRACKING_PREF, setup.trackingPreference, onSelect);
    syncContinueBtn('bsTrackingContinue', !!setup.trackingPreference);
  }

  function initVatStep() {
    const setup = loadSetup();
    const bridge = q('bsVatBridge');
    if (bridge) {
      typeLines(bridge, ['Since VAT matters to you...'], function () {});
    }
    function onSelect(id) {
      saveSetup({ vatRegistered: id });
      refreshSingleSelect(q('bsVatGrid'), VAT_OPTIONS, id, onSelect);
      syncContinueBtn('bsVatContinue', true);
    }
    refreshSingleSelect(q('bsVatGrid'), VAT_OPTIONS, setup.vatRegistered, onSelect);
    syncContinueBtn('bsVatContinue', !!setup.vatRegistered);
  }

  function runBuildingSequence() {
    typeLines(
      q('bsBuildingTyping'),
      [
        'Looking at what you need...',
        'Choosing the best MilePilot setup...',
        'Almost ready...',
      ],
      function () {
        setTimeout(function () {
          renderRecommendation();
          showStep('recommendation');
        }, 450);
      },
      32
    );
  }

  function renderRecommendation() {
    const setup = loadSetup();
    const rec = computeRecommendation(setup);
    saveSetup({
      recommendedSetup: rec.setup,
      dashboardMode: rec.dashboardMode,
      selectedPlan: rec.plan,
    });
    const intro = q('bsRecommendIntro');
    const list = q('bsRecommendList');
    if (intro) intro.textContent = rec.intro;
    if (list) {
      list.innerHTML = rec.items
        .map(function (item) {
          return '<li><span class="bs-check" aria-hidden="true">✓</span> ' + item + '</li>';
        })
        .join('');
    }
  }

  function renderPlanCards() {
    const rec = computeRecommendation(loadSetup());
    const selected = loadSetup().selectedPlan || rec.plan;
    const coreCard = q('bsPlanCore');
    const bizCard = q('bsPlanBusiness');
    if (coreCard) {
      coreCard.classList.toggle('is-selected', selected === 'core');
      coreCard.classList.toggle('is-recommended', rec.plan === 'core');
    }
    if (bizCard) {
      bizCard.classList.toggle('is-selected', selected === 'business');
      bizCard.classList.toggle('is-recommended', rec.plan === 'business');
    }
  }

  function selectPlan(planId) {
    saveSetup({ selectedPlan: planId });
    renderPlanCards();
    syncContinueBtn('bsPlanContinue', true);
  }

  function selectTrackingPreference(id) {
    saveSetup({ trackingPreference: id });
    initTrackingPreferenceStep();
  }

  function syncContinueBtn(id, enabled) {
    const btn = q(id);
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('is-ready', enabled);
  }

  function nextStepAfter(step) {
    const setup = loadSetup();
    const flow = buildFlow(setup);
    const idx = flow.indexOf(step);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  function nextFrom(step) {
    const setup = loadSetup();

    if (step === 'welcome') {
      showStep('goals');
      return;
    }
    if (step === 'ack') {
      if (pendingAfterAck) {
        const next = pendingAfterAck;
        pendingAfterAck = null;
        showStep(next);
      }
      return;
    }
    if (step === 'goals') {
      buildFlow(setup);
      const next = nextStepAfter('goals');
      showAck(getAckForGoals(setup.goals || []), next);
      return;
    }
    if (step === 'vehicleUse') {
      const refreshed = loadSetup();
      buildFlow(refreshed);
      const next = nextStepAfter('vehicleUse');
      showStep(next);
      return;
    }
    if (step === 'trackingPreference') {
      buildFlow(setup);
      const next = nextStepAfter('trackingPreference');
      if (next === 'vat') {
        showStep('vat');
      } else {
        showStep('building');
      }
      return;
    }
    if (step === 'vat') {
      showAck(getAckForVat(setup.vatRegistered), 'building');
      return;
    }
    if (step === 'recommendation') {
      showStep('choosePlan');
      renderPlanCards();
      syncContinueBtn('bsPlanContinue', !!setup.selectedPlan);
      return;
    }
    if (step === 'choosePlan') {
      applySelectedPlan();
      return finishAfterPlan();
    }
  }

  function applySelectedPlan() {
    const setup = loadSetup();
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    saveSetup({ selectedPlan: plan.id });
    if (typeof global.MPSubscription !== 'undefined' && global.MPSubscription.setPlanTier) {
      global.MPSubscription.setPlanTier(plan.id);
    }
  }

  function finishAfterPlan() {
    const setup = loadSetup();
    const pref = setup.trackingPreference;
    if (wantsMileageWorkspace(setup) && pref === 'autopilot') {
      if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('autopilot');
      if (typeof global.selectedTrackingMode !== 'undefined') global.selectedTrackingMode = 'autopilot';
      global.localStorage.setItem('mp_onboard_step', 'enableSetup');
      if (typeof global.initEnableSetup === 'function') global.initEnableSetup();
      if (typeof global.showScreen === 'function') global.showScreen('permissions');
      return;
    }
    if (pref === 'manual' && wantsMileageWorkspace(setup)) {
      if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('manual');
      if (typeof global.selectedTrackingMode !== 'undefined') global.selectedTrackingMode = 'manual';
    }
    if (!wantsMileageWorkspace(setup) || pref === 'later') {
      if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('manual');
      global.localStorage.setItem('mp_location_choice', 'skipped');
      global.localStorage.setItem('mp_notifications_choice', 'skipped');
    }
    return routeAfterSetupToKnowYou();
  }

  function routeAfterSetupToKnowYou() {
    global.localStorage.setItem('mp_onboard_step', 'name');
    if (typeof global.initOnboardName === 'function') global.initOnboardName();
    if (typeof global.showScreen === 'function') global.showScreen('knowYou');
  }

  function start() {
    flowSteps = ['welcome', 'goals'];
    if (typeof global.showScreen === 'function') global.showScreen('businessSetup');
    showStep('welcome');
  }

  function applyDashboardLayout() {
    const mode = getDashboardMode();
    const body = q('ccBody');
    const mileageBlock = q('ccMileageBlock');
    const hub = q('ccBusinessHubBlock');
    const businessPanel = q('ccBusinessPanel');
    const mileageLater = q('ccMileageLaterCard');
    const todayKicker = q('ccTodayKicker');
    if (body) {
      body.classList.toggle('cc-layout-mileage', mode === 'mileage');
      body.classList.toggle('cc-layout-business', mode === 'business');
      body.classList.toggle('cc-layout-mixed', mode === 'mixed');
    }
    if (todayKicker) {
      todayKicker.textContent =
        mode === 'mixed' ? "Today's Overview" : mode === 'business' ? "Today's Business" : 'Today';
    }
    if (mileageBlock) mileageBlock.hidden = mode === 'business';
    if (hub) {
      hub.hidden = mode === 'mileage';
      if (mode === 'mileage') hub.classList.add('cc-hub-upgrade');
      else hub.classList.remove('cc-hub-upgrade');
    }
    if (businessPanel) businessPanel.hidden = mode === 'mileage';
    if (mileageLater) mileageLater.hidden = mode !== 'business';
    if (mode === 'business' && businessPanel && hub && businessPanel.parentNode) {
      businessPanel.parentNode.insertBefore(businessPanel, hub);
    }
    if (mode === 'business' && hub && mileageBlock && hub.parentNode) {
      hub.parentNode.insertBefore(hub, mileageBlock);
    }
  }

  function getReadyCopy() {
    return {
      lead: "I'll help keep your business organised.",
      feature: 'You get back to running it.',
      cta: 'Go to Dashboard',
    };
  }

  function reset() {
    global.localStorage.removeItem(STORAGE_KEY);
  }

  global.MPBusinessSetup = {
    STORAGE_KEY: STORAGE_KEY,
    GOALS: GOALS,
    PLANS: PLANS,
    loadSetup: loadSetup,
    saveSetup: saveSetup,
    start: start,
    showStep: showStep,
    nextFrom: nextFrom,
    selectPlan: selectPlan,
    selectTrackingPreference: selectTrackingPreference,
    usesVehicle: usesVehicle,
    wantsMileageWorkspace: wantsMileageWorkspace,
    wantsBusinessHub: wantsBusinessHub,
    computeRecommendation: computeRecommendation,
    getDashboardMode: getDashboardMode,
    applyDashboardLayout: applyDashboardLayout,
    getReadyCopy: getReadyCopy,
    routeAfterSetupToKnowYou: routeAfterSetupToKnowYou,
    buildFlow: buildFlow,
    reset: reset,
  };
})(typeof window !== 'undefined' ? window : global);
