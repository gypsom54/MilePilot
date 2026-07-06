/**
 * MilePilot Conversational Business Setup Onboarding (LOCKED DIRECTION)
 * Pain points first → personalised acks → building moment → recommendation → plan
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_business_setup';
  const PROFILE_KEY = 'mp_business_profile';

  const GOALS = [
    { id: 'tracking_mileage', label: 'Tracking mileage' },
    { id: 'saving_receipts', label: 'Saving receipts' },
    { id: 'adding_vat', label: 'Adding up VAT' },
    { id: 'tracking_expenses', label: 'Tracking expenses' },
    { id: 'accountant', label: 'Sending records to accountant' },
    { id: 'tax_records', label: 'Preparing tax records' },
    { id: 'business_reports', label: 'Business reports' },
    { id: 'less_paperwork', label: 'Less paperwork' },
  ];

  const BUSINESS_TYPES = [
    { id: 'tradesperson', label: 'Tradesperson', profession: 'tradesperson' },
    { id: 'mobile_service', label: 'Mobile service business', profession: 'mobile' },
    { id: 'consultant', label: 'Consultant', profession: 'professional' },
    { id: 'sales', label: 'Sales representative', profession: 'professional' },
    { id: 'taxi', label: 'Taxi / private hire', profession: 'driver' },
    { id: 'delivery', label: 'Delivery / courier', profession: 'driver' },
    { id: 'freelancer', label: 'Freelancer', profession: 'other' },
    { id: 'property', label: 'Property / landlord', profession: 'professional' },
    { id: 'healthcare', label: 'Healthcare professional', profession: 'professional' },
    { id: 'other', label: 'Other', profession: 'other' },
  ];

  const VEHICLE_USE = [
    { id: 'daily', label: 'Yes, every day' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'no', label: 'No / not really' },
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
      tagline: 'Never miss another business mile.',
      experience: 'tracker',
    },
    business: {
      id: 'business',
      label: 'MilePilot Business',
      priceLabel: '£9.99/month',
      tagline: 'Run your business with less admin.',
      experience: 'business',
    },
  };

  const STEPS = [
    'welcome',
    'ack',
    'goals',
    'businessType',
    'vehicleUse',
    'vat',
    'building',
    'recommendation',
    'choosePlan',
    'trackingMode',
    'ready',
  ];

  let typingTimer = null;
  let currentStep = 'welcome';
  let pendingAfterAck = null;

  function q(id) {
    return document.getElementById(id);
  }

  function defaultSetup() {
    return {
      goals: [],
      businessType: null,
      vehicleUse: null,
      vatRegistered: null,
      recommendedSetup: null,
      selectedPlan: null,
      trackingModeChoice: null,
      setupComplete: false,
      dashboardMode: 'mileage',
    };
  }

  function loadSetup() {
    try {
      const raw = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
      if (raw.adminPainPoints && !raw.goals) raw.goals = migrateLegacyPains(raw.adminPainPoints);
      return { ...defaultSetup(), ...raw };
    } catch (e) {
      return defaultSetup();
    }
  }

  function migrateLegacyPains(pains) {
    const map = {
      mileage: 'tracking_mileage',
      receipts: 'saving_receipts',
      vat: 'adding_vat',
      expenses: 'tracking_expenses',
      accountant: 'accountant',
      tax: 'tax_records',
      costs: 'less_paperwork',
      organised: 'less_paperwork',
    };
    return pains.map(function (p) {
      return map[p] || p;
    });
  }

  function saveSetup(updates) {
    const next = { ...loadSetup(), ...updates };
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    syncSetupToProfile(next);
    return next;
  }

  function syncSetupToProfile(setup) {
    if (typeof global.saveBusinessProfile !== 'function') return;
    const type = BUSINESS_TYPES.find(function (t) {
      return t.id === setup.businessType;
    });
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    const mileageFocus = setup.dashboardMode === 'mileage' || setup.dashboardMode === 'mixed';
    const businessHubFocus = setup.dashboardMode === 'business' || setup.dashboardMode === 'mixed';
    global.saveBusinessProfile({
      profession: type ? type.profession : 'other',
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

  function usesVehicle(setup) {
    const s = setup || loadSetup();
    return s.vehicleUse === 'daily' || s.vehicleUse === 'sometimes';
  }

  function wantsMileage(setup) {
    const s = setup || loadSetup();
    const goals = s.goals || [];
    return (
      goals.includes('tracking_mileage') &&
      usesVehicle(s)
    );
  }

  function wantsBusinessHub(setup) {
    const s = setup || loadSetup();
    const goals = s.goals || [];
    return (
      goals.includes('saving_receipts') ||
      goals.includes('adding_vat') ||
      goals.includes('tracking_expenses') ||
      goals.includes('accountant') ||
      goals.includes('tax_records') ||
      goals.includes('business_reports') ||
      goals.includes('less_paperwork') ||
      s.vatRegistered === 'yes' ||
      !usesVehicle(s)
    );
  }

  function computeRecommendation(setup) {
    const s = setup || loadSetup();
    const mileage = wantsMileage(s);
    const business = wantsBusinessHub(s);

    if (mileage && business) {
      return {
        setup: 'mixed',
        dashboardMode: 'mixed',
        items: [
          'AutoPilot',
          'Business Hub',
          'AI Receipt Scanner',
          'VAT summaries',
          'Accountant Pack',
        ],
        plan: 'business',
        intro: 'Based on what you told me, I recommend:',
      };
    }
    if (business && !mileage) {
      return {
        setup: 'business',
        dashboardMode: 'business',
        items: [
          'Business Hub',
          'AI Receipt Scanner',
          'VAT summaries',
          'Expense tracking',
          'Accountant Pack',
        ],
        plan: 'business',
        intro: 'Based on what you told me, I recommend:',
      };
    }
    return {
      setup: 'mileage',
      dashboardMode: 'mileage',
      items: [
        'AutoPilot mileage tracking',
        'HMRC mileage reports',
        'Daily / weekly PDF reports',
      ],
      plan: 'core',
      intro: 'Based on what you told me, I recommend:',
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
    if (goals.includes('tracking_mileage'))
      return ['Perfect.', "I'll make sure mileage tracking is part of your setup."];
    if (goals.includes('saving_receipts'))
      return ['Great.', 'Receipt capture can save a lot of admin time.'];
    if (goals.includes('adding_vat'))
      return ['Excellent.', "I'll prioritise VAT summaries and receipt automation."];
    if (goals.includes('accountant'))
      return ['No problem.', "I'll make sure accountant-ready reports are included."];
    if (goals.includes('tracking_expenses'))
      return ['Got it.', "I'll include expense tracking in your workspace."];
    if (goals.includes('tax_records'))
      return ['Understood.', "I'll help you stay organised for tax time."];
    if (goals.includes('business_reports'))
      return ['Lovely.', "I'll make sure professional reports are ready when you need them."];
    return ['Great.', "Let's find the best setup for your business."];
  }

  function getAckForVehicle(vehicleUse) {
    if (vehicleUse === 'no')
      return ["That's fine.", "We'll focus on Business Hub instead."];
    return ['Good to know.', "I'll include mileage options in your setup."];
  }

  function getAckForVat(vat) {
    if (vat === 'yes')
      return [
        'Excellent.',
        "I'll prioritise VAT summaries, receipt scanning and accountant-ready reports.",
      ];
    return ['Noted.', "We'll keep things simple for now."];
  }

  function showAck(lines, nextStep) {
    pendingAfterAck = nextStep;
    currentStep = 'ack';
    document.querySelectorAll('.bs-step').forEach(function (el) {
      el.hidden = el.dataset.step !== 'ack';
    });
    showFooterFor('ack');
    updateProgress('ack');
    const el = q('bsAckTyping');
    syncContinueBtn('bsAckContinue', false);
    typeLines(el, lines, function () {
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
    const idx = STEPS.indexOf(step);
    const pct = Math.round((idx / (STEPS.length - 1)) * 100);
    const fill = q('bsProgressFill');
    const label = q('bsProgressLabel');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = 'Step ' + Math.max(1, idx + 1) + ' of ' + STEPS.length;
  }

  const FOOTER_BTNS = {
    welcome: 'bsWelcomeContinue',
    ack: 'bsAckContinue',
    goals: 'bsGoalsContinue',
    businessType: 'bsBusinessTypeContinue',
    vehicleUse: 'bsVehicleUseContinue',
    vat: 'bsVatContinue',
    building: 'bsBuildingContinue',
    recommendation: 'bsRecommendContinue',
    choosePlan: 'bsPlanContinue',
    trackingMode: 'bsTrackingContinue',
    ready: 'bsReadyCta',
  };

  function showFooterFor(step) {
    Object.keys(FOOTER_BTNS).forEach(function (key) {
      const btn = q(FOOTER_BTNS[key]);
      if (!btn) return;
      btn.hidden = key !== step;
    });
  }

  function showStep(step) {
    currentStep = step;
    document.querySelectorAll('.bs-step').forEach(function (el) {
      el.hidden = el.dataset.step !== step;
    });
    showFooterFor(step);
    updateProgress(step);
    if (step === 'welcome') initWelcomeStep();
    if (step === 'goals') initGoalsStep();
    if (step === 'businessType') initBusinessTypeStep();
    if (step === 'vehicleUse') initVehicleUseStep();
    if (step === 'vat') initVatStep();
    if (step === 'building') runBuildingSequence();
    if (step === 'recommendation') renderRecommendation();
    if (step === 'choosePlan') renderPlanCards();
    if (step === 'trackingMode') initTrackingModeStep();
    if (step === 'ready') renderReadyStep();
  }

  function initWelcomeStep() {
    const typing = q('bsWelcomeTyping');
    const name =
      global.localStorage.getItem('mp_driver') ||
      (typeof global.driver !== 'undefined' ? global.driver : '') ||
      'there';
    const greet = name && name !== 'there' ? 'Hi ' + name + ' 👋' : 'Hi there 👋';
    typeLines(typing, [
      greet,
      "I'll ask a few quick questions.",
      "Then I'll build the best setup for your business.",
    ]);
  }

  function initGoalsStep() {
    const setup = loadSetup();
    const grid = q('bsGoalsGrid');
    const intro = q('bsGoalsIntro');
    const pains = setup.goals || [];
    if (intro) {
      typeLines(intro, ['Tell me what you want help with first.'], function () {});
    }
    renderOptionCards(grid, GOALS, pains, true);
    bindOptionCards(grid, function (id) {
      let next = pains.slice();
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else next.push(id);
      saveSetup({ goals: next });
      initGoalsStep();
    });
    syncContinueBtn('bsGoalsContinue', pains.length > 0);
  }

  function initBusinessTypeStep() {
    const setup = loadSetup();
    const grid = q('bsBusinessTypeGrid');
    const intro = q('bsBusinessTypeIntro');
    if (intro) {
      typeLines(intro, ['Great.', "Let's understand the kind of work you do."], function () {});
    }
    function onSelect(id) {
      saveSetup({ businessType: id });
      refreshSingleSelect(grid, BUSINESS_TYPES, id, onSelect);
      syncContinueBtn('bsBusinessTypeContinue', true);
    }
    refreshSingleSelect(grid, BUSINESS_TYPES, setup.businessType, onSelect);
    syncContinueBtn('bsBusinessTypeContinue', !!setup.businessType);
  }

  function initVehicleUseStep() {
    const setup = loadSetup();
    const grid = q('bsVehicleUseGrid');
    function onSelect(id) {
      saveSetup({ vehicleUse: id });
      refreshSingleSelect(grid, VEHICLE_USE, id, onSelect);
      syncContinueBtn('bsVehicleUseContinue', true);
    }
    refreshSingleSelect(grid, VEHICLE_USE, setup.vehicleUse, onSelect);
    syncContinueBtn('bsVehicleUseContinue', !!setup.vehicleUse);
  }

  function initVatStep() {
    const setup = loadSetup();
    const grid = q('bsVatGrid');
    function onSelect(id) {
      saveSetup({ vatRegistered: id });
      refreshSingleSelect(grid, VAT_OPTIONS, id, onSelect);
      syncContinueBtn('bsVatContinue', true);
    }
    refreshSingleSelect(grid, VAT_OPTIONS, setup.vatRegistered, onSelect);
    syncContinueBtn('bsVatContinue', !!setup.vatRegistered);
  }

  function runBuildingSequence() {
    const el = q('bsBuildingTyping');
    showFooterFor('building');
    syncContinueBtn('bsBuildingContinue', false);
    if (q('bsBuildingContinue')) q('bsBuildingContinue').hidden = true;
    typeLines(
      el,
      [
        'Analysing your answers...',
        'Finding the best MilePilot workspace...',
        'Almost ready...',
      ],
      function () {
        setTimeout(function () {
          renderRecommendation();
          showStep('recommendation');
        }, 500);
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
    const setup = loadSetup();
    const rec = computeRecommendation(setup);
    const selected = setup.selectedPlan || rec.plan;
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

  function initTrackingModeStep() {
    const setup = loadSetup();
    const auto = q('bsTrackAuto');
    const manual = q('bsTrackManual');
    const choice = setup.trackingModeChoice;
    if (auto) auto.classList.toggle('is-selected', choice === 'autopilot');
    if (manual) manual.classList.toggle('is-selected', choice === 'manual');
    syncContinueBtn('bsTrackingContinue', !!choice);
  }

  function selectTrackingMode(mode) {
    saveSetup({ trackingModeChoice: mode });
    if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode(mode);
    if (typeof global.selectedTrackingMode !== 'undefined') global.selectedTrackingMode = mode;
    initTrackingModeStep();
  }

  function renderReadyStep() {
    const lead = q('bsReadyLead');
    const sub = q('bsReadySub');
    if (lead) lead.textContent = "I'll help keep your business organised.";
    if (sub) sub.textContent = 'You get back to running it.';
  }

  function syncContinueBtn(id, enabled) {
    const btn = q(id);
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('is-ready', enabled);
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
      showAck(getAckForGoals(setup.goals || []), 'businessType');
      return;
    }
    if (step === 'businessType') {
      showStep('vehicleUse');
      return;
    }
    if (step === 'vehicleUse') {
      showAck(getAckForVehicle(setup.vehicleUse), 'vat');
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
      if (usesVehicle(setup) && wantsMileage(setup)) {
        showStep('trackingMode');
        return;
      }
      saveSetup({ trackingModeChoice: null });
      showStep('ready');
      return;
    }
    if (step === 'trackingMode') {
      return finishSetupPermissions();
    }
    if (step === 'ready') {
      return routeAfterSetupToKnowYou();
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

  function finishSetupPermissions() {
    const setup = loadSetup();
    if (!usesVehicle(setup) || !wantsMileage(setup)) {
      if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('manual');
      global.localStorage.setItem('mp_location_choice', 'skipped');
      global.localStorage.setItem('mp_notifications_choice', 'skipped');
      return routeAfterSetupToKnowYou();
    }
    const mode = setup.trackingModeChoice || 'autopilot';
    if (typeof global.selectedTrackingMode !== 'undefined') global.selectedTrackingMode = mode;
    if (mode === 'autopilot') {
      global.localStorage.setItem('mp_onboard_step', 'enableSetup');
      if (typeof global.initEnableSetup === 'function') global.initEnableSetup();
      if (typeof global.showScreen === 'function') global.showScreen('permissions');
      return;
    }
    global.localStorage.setItem('mp_location_choice', 'skipped');
    return routeAfterSetupToKnowYou();
  }

  function routeAfterSetupToKnowYou() {
    global.localStorage.setItem('mp_onboard_step', 'name');
    if (typeof global.initOnboardName === 'function') global.initOnboardName();
    if (typeof global.showScreen === 'function') global.showScreen('knowYou');
  }

  function start() {
    currentStep = 'welcome';
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
    if (body) {
      body.classList.toggle('cc-layout-mileage', mode === 'mileage');
      body.classList.toggle('cc-layout-business', mode === 'business');
      body.classList.toggle('cc-layout-mixed', mode === 'mixed');
    }
    if (mileageBlock) mileageBlock.hidden = mode === 'business';
    if (hub) hub.hidden = mode === 'mileage';
    if (businessPanel) businessPanel.hidden = mode === 'mileage';
    if (mileageLater) mileageLater.hidden = mode !== 'business';
    if (mode === 'business' && hub && mileageBlock && hub.parentNode) {
      hub.parentNode.insertBefore(hub, mileageBlock);
    }
    if (mode === 'business' && businessPanel && hub && businessPanel.parentNode) {
      businessPanel.parentNode.insertBefore(businessPanel, hub);
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
    STEPS: STEPS,
    PLANS: PLANS,
    GOALS: GOALS,
    loadSetup: loadSetup,
    saveSetup: saveSetup,
    start: start,
    showStep: showStep,
    nextFrom: nextFrom,
    selectPlan: selectPlan,
    selectTrackingMode: selectTrackingMode,
    usesVehicle: usesVehicle,
    wantsMileage: wantsMileage,
    wantsBusinessHub: wantsBusinessHub,
    computeRecommendation: computeRecommendation,
    getDashboardMode: getDashboardMode,
    applyDashboardLayout: applyDashboardLayout,
    getReadyCopy: getReadyCopy,
    routeAfterSetupToKnowYou: routeAfterSetupToKnowYou,
    reset: reset,
  };
})(typeof window !== 'undefined' ? window : global);
