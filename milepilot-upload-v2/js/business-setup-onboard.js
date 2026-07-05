/**
 * MilePilot Interactive Business Setup Onboarding
 * Warm conversational flow → personalised plan + dashboard layout.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_business_setup';
  const PROFILE_KEY = 'mp_business_profile';

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

  const FUEL_PAYER = [
    { id: 'self', label: 'I pay myself' },
    { id: 'business', label: 'My business pays' },
    { id: 'employer', label: 'My employer / client pays' },
    { id: 'company', label: 'Company vehicle' },
    { id: 'na', label: 'Not applicable' },
  ];

  const VAT_OPTIONS = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'unsure', label: 'Not sure' },
  ];

  const ADMIN_PAINS = [
    { id: 'mileage', label: 'Remembering mileage' },
    { id: 'receipts', label: 'Losing receipts' },
    { id: 'vat', label: 'Adding up VAT' },
    { id: 'expenses', label: 'Tracking expenses' },
    { id: 'accountant', label: 'Sending records to accountant' },
    { id: 'tax', label: 'Preparing tax records' },
    { id: 'costs', label: 'Understanding business costs' },
    { id: 'organised', label: 'Staying organised' },
  ];

  const PLANS = {
    core: {
      id: 'core',
      label: 'MilePilot Core',
      price: 4.99,
      priceLabel: '£4.99/month',
      tagline: 'Never miss another business mile.',
      features: [
        'AutoPilot',
        'Manual tracking',
        'Background mileage tracking',
        'HMRC mileage estimates',
        'PDF reports',
        'Email reports',
      ],
      experience: 'tracker',
    },
    business: {
      id: 'business',
      label: 'MilePilot Business',
      price: 9.99,
      priceLabel: '£9.99/month',
      tagline: 'Run your business with less admin.',
      features: [
        'Business Hub',
        'AI receipt scanner',
        'Expense tracking',
        'VAT summaries',
        'AI Bookkeeper',
        'Business Health Score',
        'Accountant Pack',
      ],
      experience: 'business',
      includesCore: true,
    },
  };

  const STEPS = [
    'welcome',
    'businessType',
    'vehicleUse',
    'fuelCosts',
    'vat',
    'adminPain',
    'recommendation',
    'choosePlan',
    'trackingMode',
    'permissions',
    'ready',
  ];

  let typingTimer = null;
  let currentStep = 'welcome';

  function q(id) {
    return document.getElementById(id);
  }

  function defaultSetup() {
    return {
      businessType: null,
      vehicleUse: null,
      fuelPayer: null,
      vatRegistered: null,
      adminPainPoints: [],
      recommendedSetup: null,
      selectedPlan: null,
      trackingModeChoice: null,
      setupComplete: false,
      dashboardMode: 'mileage',
    };
  }

  function loadSetup() {
    try {
      return { ...defaultSetup(), ...JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}') };
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
    const type = BUSINESS_TYPES.find((t) => t.id === setup.businessType);
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    const mileageFocus =
      setup.dashboardMode === 'mileage' || setup.dashboardMode === 'mixed';
    const businessHubFocus =
      setup.dashboardMode === 'business' || setup.dashboardMode === 'mixed';

    global.saveBusinessProfile({
      profession: type ? type.profession : 'other',
      experience: plan.experience,
      receiptsEnabled: businessHubFocus,
      vatRegistered:
        setup.vatRegistered === 'yes'
          ? true
          : setup.vatRegistered === 'no'
            ? false
            : null,
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

  function computeRecommendation(setup) {
    const s = setup || loadSetup();
    const pains = s.adminPainPoints || [];
    const mileageSignals =
      usesVehicle(s) ||
      pains.includes('mileage') ||
      ['taxi', 'delivery', 'sales', 'mobile_service', 'tradesperson'].includes(
        s.businessType
      );
    const businessSignals =
      s.vatRegistered === 'yes' ||
      pains.includes('receipts') ||
      pains.includes('vat') ||
      pains.includes('expenses') ||
      pains.includes('accountant') ||
      pains.includes('tax') ||
      pains.includes('costs') ||
      pains.includes('organised');

    if (mileageSignals && businessSignals) {
      return {
        setup: 'mixed',
        dashboardMode: 'mixed',
        items: [
          'AutoPilot Mileage Tracking',
          'AI Receipt Scanner',
          'Expense tracking',
          'VAT summaries',
          'Accountant Pack',
        ],
        plan: 'business',
        planLabel: 'MilePilot Business — £9.99/month',
      };
    }
    if (businessSignals && !mileageSignals) {
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
        planLabel: 'MilePilot Business — £9.99/month',
      };
    }
    return {
      setup: 'mileage',
      dashboardMode: 'mileage',
      items: [
        'AutoPilot Mileage Tracking',
        'Daily / weekly reports',
        'HMRC mileage estimates',
      ],
      plan: 'core',
      planLabel: 'MilePilot Core — £4.99/month',
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

  function typeLines(el, lines, onDone) {
    clearTyping();
    if (!el) {
      if (onDone) onDone();
      return;
    }
    let lineIdx = 0;
    let charIdx = 0;
    el.innerHTML = '';
    function tick() {
      if (lineIdx >= lines.length) {
        clearTyping();
        if (onDone) onDone();
        return;
      }
      const line = lines[lineIdx];
      if (charIdx === 0 && lineIdx > 0) {
        el.innerHTML += '<br>';
      }
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
    typingTimer = setInterval(tick, 28);
    tick();
  }

  function renderOptionCards(container, options, selected, multi) {
    if (!container) return;
    container.innerHTML = options
      .map(function (opt) {
        const sel = multi
          ? (selected || []).includes(opt.id)
          : selected === opt.id;
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

  function bindOptionCards(container, onSelect, multi) {
    if (!container) return;
    container.querySelectorAll('.bs-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        onSelect(btn.dataset.id);
      });
    });
  }

  function refreshSingleSelect(grid, options, selected, onSelect) {
    renderOptionCards(grid, options, selected, false);
    bindOptionCards(grid, onSelect, false);
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
    businessType: 'bsBusinessTypeContinue',
    vehicleUse: 'bsVehicleUseContinue',
    fuelCosts: 'bsFuelCostsContinue',
    vat: 'bsVatContinue',
    adminPain: 'bsAdminPainContinue',
    recommendation: 'bsRecommendContinue',
    choosePlan: 'bsPlanContinue',
    trackingMode: 'bsTrackingContinue',
    ready: 'bsReadyCta',
  };

  function showFooterFor(step) {
    Object.keys(FOOTER_BTNS).forEach(function (key) {
      const btn = q(FOOTER_BTNS[key]);
      if (!btn) return;
      const active = key === step;
      btn.hidden = !active;
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
    if (step === 'businessType') initBusinessTypeStep();
    if (step === 'vehicleUse') initVehicleUseStep();
    if (step === 'fuelCosts') initFuelCostsStep();
    if (step === 'vat') initVatStep();
    if (step === 'adminPain') initAdminPainStep();
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
    typeLines(typing, [greet, "I'll ask a few quick questions.", "Then I'll recommend the best setup for you."]);
  }

  function initBusinessTypeStep() {
    const setup = loadSetup();
    const grid = q('bsBusinessTypeGrid');
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

  function initFuelCostsStep() {
    const setup = loadSetup();
    const grid = q('bsFuelCostsGrid');
    function onSelect(id) {
      saveSetup({ fuelPayer: id });
      refreshSingleSelect(grid, FUEL_PAYER, id, onSelect);
      syncContinueBtn('bsFuelCostsContinue', true);
    }
    refreshSingleSelect(grid, FUEL_PAYER, setup.fuelPayer, onSelect);
    syncContinueBtn('bsFuelCostsContinue', !!setup.fuelPayer);
  }

  function initVatStep() {
    const setup = loadSetup();
    const grid = q('bsVatGrid');
    const note = q('bsVatNote');
    function onSelect(id) {
      saveSetup({ vatRegistered: id });
      refreshSingleSelect(grid, VAT_OPTIONS, id, onSelect);
      if (note) note.hidden = id !== 'yes';
      syncContinueBtn('bsVatContinue', true);
    }
    refreshSingleSelect(grid, VAT_OPTIONS, setup.vatRegistered, onSelect);
    if (note) note.hidden = setup.vatRegistered !== 'yes';
    syncContinueBtn('bsVatContinue', !!setup.vatRegistered);
  }

  function initAdminPainStep() {
    const setup = loadSetup();
    const grid = q('bsAdminPainGrid');
    const pains = setup.adminPainPoints || [];
    renderOptionCards(grid, ADMIN_PAINS, pains, true);
    bindOptionCards(grid, function (id) {
      let next = pains.slice();
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else next.push(id);
      saveSetup({ adminPainPoints: next });
      initAdminPainStep();
    }, true);
    syncContinueBtn('bsAdminPainContinue', pains.length > 0);
  }

  function renderRecommendation() {
    const setup = loadSetup();
    const rec = computeRecommendation(setup);
    saveSetup({
      recommendedSetup: rec.setup,
      dashboardMode: rec.dashboardMode,
      selectedPlan: rec.plan,
    });
    const list = q('bsRecommendList');
    const plan = q('bsRecommendPlan');
    if (list) {
      list.innerHTML = rec.items
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('');
    }
    if (plan) plan.textContent = rec.planLabel;
  }

  function renderPlanCards() {
    const setup = loadSetup();
    const rec = computeRecommendation(setup);
    const selected = setup.selectedPlan || rec.plan;
    const coreCard = q('bsPlanCore');
    const bizCard = q('bsPlanBusiness');
    if (coreCard) coreCard.classList.toggle('is-selected', selected === 'core');
    if (bizCard) bizCard.classList.toggle('is-selected', selected === 'business');
    const badge = q('bsPlanBusinessBadge');
    if (badge) {
      badge.hidden = !(
        setup.vatRegistered === 'yes' ||
        (setup.adminPainPoints || []).some(function (p) {
          return ['receipts', 'vat', 'expenses', 'accountant'].includes(p);
        })
      );
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
    if (typeof global.MPTrackingMode !== 'undefined') {
      global.MPTrackingMode.setMode(mode);
    }
    if (typeof global.selectedTrackingMode !== 'undefined') {
      global.selectedTrackingMode = mode;
    }
    initTrackingModeStep();
  }

  function renderReadyStep() {
    const setup = loadSetup();
    const lead = q('bsReadyLead');
    const cta = q('bsReadyCta');
    if (!lead) return;
    if (setup.dashboardMode === 'business') {
      lead.textContent =
        'Business Hub is ready to organise your receipts, expenses and VAT records.';
    } else if (setup.dashboardMode === 'mixed') {
      lead.textContent =
        'MilePilot is ready to track your mileage and organise your business records.';
    } else {
      lead.textContent = 'AutoPilot is ready to record your business journeys.';
    }
    if (cta) cta.textContent = 'Go to Dashboard';
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
      showStep('businessType');
      initBusinessTypeStep();
      return;
    }
    if (step === 'businessType') {
      showStep('vehicleUse');
      initVehicleUseStep();
      return;
    }
    if (step === 'vehicleUse') {
      showStep('fuelCosts');
      initFuelCostsStep();
      return;
    }
    if (step === 'fuelCosts') {
      showStep('vat');
      initVatStep();
      return;
    }
    if (step === 'vat') {
      showStep('adminPain');
      initAdminPainStep();
      return;
    }
    if (step === 'adminPain') {
      showStep('recommendation');
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
      if (usesVehicle(setup)) {
        showStep('trackingMode');
        initTrackingModeStep();
        return;
      }
      saveSetup({ trackingModeChoice: null });
      return finishSetupPermissions();
    }
    if (step === 'trackingMode') {
      return finishSetupPermissions();
    }
    if (step === 'permissions') {
      return completeBusinessSetup();
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
    if (!usesVehicle(setup)) {
      if (typeof global.MPTrackingMode !== 'undefined') {
        global.MPTrackingMode.setMode('manual');
      }
      global.localStorage.setItem('mp_location_choice', 'skipped');
      global.localStorage.setItem('mp_notifications_choice', 'skipped');
      return routeAfterSetupToKnowYou();
    }
    const mode = setup.trackingModeChoice || 'autopilot';
    if (typeof global.selectedTrackingMode !== 'undefined') {
      global.selectedTrackingMode = mode;
    }
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

  function completeBusinessSetup() {
    saveSetup({ setupComplete: true });
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
    if (body) {
      body.classList.toggle('cc-layout-mileage', mode === 'mileage');
      body.classList.toggle('cc-layout-business', mode === 'business');
      body.classList.toggle('cc-layout-mixed', mode === 'mixed');
    }
    if (mileageBlock) mileageBlock.hidden = mode === 'business';
    if (hub) hub.hidden = mode === 'mileage';
    if (businessPanel) businessPanel.hidden = mode === 'mileage';
    if (mode === 'business' && hub && mileageBlock && hub.parentNode) {
      hub.parentNode.insertBefore(hub, mileageBlock);
    }
  }

  function getReadyCopy() {
    const setup = loadSetup();
    if (setup.dashboardMode === 'business') {
      return {
        lead: 'Business Hub is ready to organise your receipts, expenses and VAT records.',
        feature: 'Scan receipts, track expenses and stay VAT-ready — all in one place.',
        cta: 'Go to Dashboard',
      };
    }
    if (setup.dashboardMode === 'mixed') {
      return {
        lead: 'MilePilot is ready to track your mileage and organise your business records.',
        feature: 'Mileage tracking and Business Hub work together from day one.',
        cta: 'Go to Dashboard',
      };
    }
    return {
      lead: 'AutoPilot is ready to record your business journeys.',
      feature: 'Drive as normal — MilePilot prepares your mileage reports automatically.',
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
    loadSetup: loadSetup,
    saveSetup: saveSetup,
    start: start,
    showStep: showStep,
    nextFrom: nextFrom,
    selectPlan: selectPlan,
    selectTrackingMode: selectTrackingMode,
    usesVehicle: usesVehicle,
    computeRecommendation: computeRecommendation,
    getDashboardMode: getDashboardMode,
    applyDashboardLayout: applyDashboardLayout,
    getReadyCopy: getReadyCopy,
    completeBusinessSetup: completeBusinessSetup,
    routeAfterSetupToKnowYou: routeAfterSetupToKnowYou,
    reset: reset,
    initBusinessTypeStep: initBusinessTypeStep,
    initVehicleUseStep: initVehicleUseStep,
    initFuelCostsStep: initFuelCostsStep,
    initVatStep: initVatStep,
    initAdminPainStep: initAdminPainStep,
    renderRecommendation: renderRecommendation,
    renderPlanCards: renderPlanCards,
    initTrackingModeStep: initTrackingModeStep,
    renderReadyStep: renderReadyStep,
  };
})(typeof window !== 'undefined' ? window : global);
