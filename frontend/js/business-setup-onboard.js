/**
 * MilePilot Onboarding V4 — branching workspace builder
 * @see docs/PRODUCT_STRATEGY_LOCK.md
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_business_setup';
  const PROFILE_KEY = 'mp_business_profile';

  const GOALS = [
    { id: 'track_mileage', label: 'Track my business mileage' },
    { id: 'organise_receipts', label: 'Scan and organise receipts' },
    { id: 'track_expenses', label: 'Track business expenses' },
    { id: 'help_vat', label: 'Help with VAT' },
    { id: 'accountant', label: 'Prepare records for my accountant' },
    { id: 'reduce_paperwork', label: 'Reduce paperwork' },
  ];

  const BUSINESS_GOAL_IDS = [
    'organise_receipts',
    'track_expenses',
    'help_vat',
    'accountant',
    'reduce_paperwork',
  ];

  const VEHICLE_USE = [
    { id: 'daily', label: 'Yes, every day' },
    { id: 'sometimes', label: 'Sometimes' },
    { id: 'no', label: 'No / not really' },
  ];

  const VEHICLE_TYPE = [
    { id: 'car', label: 'Car' },
    { id: 'van', label: 'Van' },
    { id: 'motorcycle', label: 'Motorcycle' },
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

  const ACCOUNTANT_OPTIONS = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'sometimes', label: 'Sometimes' },
  ];

  const SCAN_OPTIONS = [
    { id: 'yes', label: 'Yes, scan now' },
    { id: 'later', label: 'Maybe later' },
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
    business_reports: 'reduce_paperwork',
    understand_business: 'reduce_paperwork',
    tax_records: 'accountant',
    less_paperwork: 'reduce_paperwork',
  };

  let typingTimer = null;
  let flowSteps = ['welcome', 'name', 'goals'];

  function q(id) {
    return document.getElementById(id);
  }

  function defaultSetup() {
    return {
      driverName: '',
      goals: [],
      onboardPath: null,
      vehicleUse: null,
      vehicleType: null,
      trackingPreference: null,
      vatRegistered: null,
      worksWithAccountant: null,
      reportEmail: '',
      scanReceiptNow: null,
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
      if (!raw.driverName && global.localStorage.getItem('mp_driver')) {
        raw.driverName = global.localStorage.getItem('mp_driver');
      }
      return { ...defaultSetup(), ...raw };
    } catch (e) {
      return defaultSetup();
    }
  }

  function saveSetup(updates) {
    const next = { ...loadSetup(), ...updates };
    if (next.driverName) {
      global.localStorage.setItem('mp_driver', next.driverName);
      if (typeof global.driver !== 'undefined') global.driver = next.driverName;
    }
    if (next.vehicleType) {
      global.localStorage.setItem('mp_vehicle', next.vehicleType);
      if (typeof global.vehicle !== 'undefined') global.vehicle = next.vehicleType;
      if (typeof global.selectedVehicle !== 'undefined') global.selectedVehicle = next.vehicleType;
    }
    if (next.reportEmail) {
      global.localStorage.setItem('mp_email', next.reportEmail);
    }
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    syncSetupToProfile(next);
    return next;
  }

  function syncSetupToProfile(setup) {
    if (typeof global.saveBusinessProfile !== 'function') return;
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    const mode = setup.dashboardMode || computeDashboardMode(setup);
    global.saveBusinessProfile({
      profession: 'other',
      experience: plan.experience,
      receiptsEnabled: mode === 'business' || mode === 'mixed',
      vatRegistered:
        setup.vatRegistered === 'yes' ? true : setup.vatRegistered === 'no' ? false : null,
      businessSetup: setup,
      dashboardMode: mode,
      mileageFocus: mode === 'mileage' || mode === 'mixed',
      businessHubFocus: mode === 'business' || mode === 'mixed',
      selectedPlan: setup.selectedPlan,
    });
  }

  function hasMileageGoal(setup) {
    return (setup || loadSetup()).goals.includes('track_mileage');
  }

  function hasBusinessGoals(setup) {
    const g = (setup || loadSetup()).goals || [];
    return BUSINESS_GOAL_IDS.some(function (id) {
      return g.includes(id);
    });
  }

  function getOnboardPath(setup) {
    const s = setup || loadSetup();
    if (s.onboardPath) return s.onboardPath;
    const mileage = hasMileageGoal(s);
    const business = hasBusinessGoals(s);
    if (mileage && !business) return 'mileage';
    if (!mileage && business) return 'business';
    if (mileage && business) return 'combined';
    return 'business';
  }

  function needsMileageOnboarding(setup) {
    return hasMileageGoal(setup || loadSetup());
  }

  function needsBusinessOnboarding(setup) {
    return hasBusinessGoals(setup || loadSetup());
  }

  function selectedVatGoal(setup) {
    return (setup || loadSetup()).goals.includes('help_vat');
  }

  function selectedAccountantGoal(setup) {
    return (setup || loadSetup()).goals.includes('accountant');
  }

  function selectedReceiptsGoal(setup) {
    return (setup || loadSetup()).goals.includes('organise_receipts');
  }

  function usesVehicle(setup) {
    const s = setup || loadSetup();
    return s.vehicleUse === 'daily' || s.vehicleUse === 'sometimes';
  }

  function wantsMileageWorkspace(setup) {
    const s = setup || loadSetup();
    return hasMileageGoal(s) && usesVehicle(s);
  }

  function wantsBusinessHub(setup) {
    return hasBusinessGoals(setup);
  }

  function wantsBusinessWorkspace(setup) {
    return wantsBusinessHub(setup);
  }

  function computeDashboardMode(setup) {
    const path = getOnboardPath(setup);
    if (path === 'mileage') return 'mileage';
    if (path === 'business') return 'business';
    return 'mixed';
  }

  function buildFlow(setup) {
    const s = setup || loadSetup();
    const path = getOnboardPath(s);
    const steps = ['welcome', 'name', 'goals'];

    if (needsMileageOnboarding(s)) {
      steps.push('vehicleUse');
      if (usesVehicle(s)) {
        steps.push('vehicleType', 'trackingPreference');
      }
    }

    if (needsBusinessOnboarding(s)) {
      if (selectedVatGoal(s)) steps.push('vat');
      if (selectedAccountantGoal(s)) steps.push('accountant');
    }

    steps.push('reportEmail');
    if (needsBusinessOnboarding(s) && selectedReceiptsGoal(s) && path !== 'mileage') {
      steps.push('scanReceipt');
    }

    steps.push('building', 'recommendation', 'choosePlan');
    flowSteps = steps;
    return steps;
  }

  function mileageTrackingLabel(setup) {
    const pref = (setup || loadSetup()).trackingPreference;
    if (pref === 'manual') return 'Manual tracking';
    if (pref === 'autopilot') return 'AutoPilot';
    return 'AutoPilot or Manual tracking';
  }

  function computeRecommendation(setup) {
    const s = setup || loadSetup();
    const path = getOnboardPath(s);
    const subline =
      path === 'business' || path === 'combined'
        ? 'This setup is built around the admin you told me you want to reduce.'
        : "Let's make sure you never miss another business mile.";

    if (path === 'combined') {
      return {
        setup: 'combined',
        dashboardMode: 'mixed',
        workspaceTitle: 'MilePilot Business',
        items: [
          'Mileage tracking',
          'Business Hub',
          'Receipts',
          'Expenses',
          'VAT',
          'Accountant Pack',
          'AI Bookkeeper',
        ],
        plan: 'business',
        intro: "Here's what I recommend.",
        subline,
      };
    }
    if (path === 'business') {
      return {
        setup: 'business',
        dashboardMode: 'business',
        workspaceTitle: 'Business Hub',
        items: [
          'AI Receipt Scanner',
          'Expense tracking',
          'VAT summaries',
          'Business reports',
          'Accountant Pack',
          'AI Bookkeeper',
        ],
        plan: 'business',
        intro: "Here's what I recommend.",
        subline,
      };
    }
    return {
      setup: 'mileage',
      dashboardMode: 'mileage',
      workspaceTitle: 'Mileage Workspace',
      items: [mileageTrackingLabel(s), 'HMRC mileage estimates', 'PDF & email reports'],
      plan: 'core',
      intro: "Here's what I recommend.",
      subline,
    };
  }

  function getDashboardMode() {
    const profile = getProfile();
    return profile.dashboardMode || loadSetup().dashboardMode || 'mileage';
  }

  function getWorkspaceType() {
    return getDashboardMode();
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
    const ms = speed || 22;
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
    buildFlow(loadSetup());
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
    name: 'bsNameContinue',
    goals: 'bsGoalsContinue',
    vehicleUse: 'bsVehicleUseContinue',
    vehicleType: 'bsVehicleTypeContinue',
    trackingPreference: 'bsTrackingContinue',
    vat: 'bsVatContinue',
    accountant: 'bsAccountantContinue',
    reportEmail: 'bsReportEmailContinue',
    scanReceipt: 'bsScanReceiptContinue',
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
    if (step === 'name') initNameStep();
    if (step === 'goals') initGoalsStep();
    if (step === 'vehicleUse') initVehicleUseStep();
    if (step === 'vehicleType') initVehicleTypeStep();
    if (step === 'trackingPreference') initTrackingPreferenceStep();
    if (step === 'vat') initVatStep();
    if (step === 'accountant') initAccountantStep();
    if (step === 'reportEmail') initReportEmailStep();
    if (step === 'scanReceipt') initScanReceiptStep();
    if (step === 'building') runBuildingSequence();
    if (step === 'recommendation') renderRecommendation();
    if (step === 'choosePlan') renderPlanCards();
  }

  function initWelcomeStep() {
    typeLines(
      q('bsWelcomeTyping'),
      [
        'MilePilot',
        "Let's build your business assistant.",
        "I'll ask a few quick questions and recommend the best workspace for you.",
      ],
      null,
      20
    );
  }

  function initNameStep() {
    const input = q('bsNameInput');
    const setup = loadSetup();
    if (input) {
      if (!input.dataset.bound) {
        input.addEventListener('input', function () {
          syncContinueBtn('bsNameContinue', isValidName(input.value));
        });
        input.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && isValidName(input.value)) nextFrom('name');
        });
        input.dataset.bound = '1';
      }
      input.value = setup.driverName || global.localStorage.getItem('mp_driver') || '';
    }
    syncContinueBtn('bsNameContinue', input ? isValidName(input.value) : false);
  }

  function initGoalsStep() {
    const setup = loadSetup();
    const name = setup.driverName || 'there';
    const greeting = q('bsGoalsGreeting');
    if (greeting) greeting.textContent = 'Nice to meet you, ' + name + ' 👋';
    const grid = q('bsGoalsGrid');
    const goals = setup.goals || [];
    renderOptionCards(grid, GOALS, goals, true);
    bindOptionCards(grid, function (id) {
      let next = goals.slice();
      const i = next.indexOf(id);
      if (i >= 0) next.splice(i, 1);
      else next.push(id);
      const path = getOnboardPath({ goals: next });
      saveSetup({ goals: next, onboardPath: path });
      initGoalsStep();
    });
    syncContinueBtn('bsGoalsContinue', goals.length > 0);
  }

  function initVehicleUseStep() {
    const setup = loadSetup();
    const bridge = q('bsVehicleBridge');
    if (bridge) bridge.hidden = true;
    function onSelect(id) {
      saveSetup({ vehicleUse: id });
      refreshSingleSelect(q('bsVehicleUseGrid'), VEHICLE_USE, id, onSelect);
      syncContinueBtn('bsVehicleUseContinue', true);
    }
    refreshSingleSelect(q('bsVehicleUseGrid'), VEHICLE_USE, setup.vehicleUse, onSelect);
    syncContinueBtn('bsVehicleUseContinue', !!setup.vehicleUse);
  }

  function initVehicleTypeStep() {
    const setup = loadSetup();
    function onSelect(id) {
      saveSetup({ vehicleType: id });
      refreshSingleSelect(q('bsVehicleTypeGrid'), VEHICLE_TYPE, id, onSelect);
      syncContinueBtn('bsVehicleTypeContinue', true);
    }
    refreshSingleSelect(q('bsVehicleTypeGrid'), VEHICLE_TYPE, setup.vehicleType, onSelect);
    syncContinueBtn('bsVehicleTypeContinue', !!setup.vehicleType);
  }

  function initTrackingPreferenceStep() {
    const setup = loadSetup();
    const bridge = q('bsTrackingBridge');
    if (bridge) bridge.hidden = true;
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
    if (bridge) bridge.hidden = true;
    function onSelect(id) {
      saveSetup({ vatRegistered: id });
      refreshSingleSelect(q('bsVatGrid'), VAT_OPTIONS, id, onSelect);
      syncContinueBtn('bsVatContinue', true);
    }
    refreshSingleSelect(q('bsVatGrid'), VAT_OPTIONS, setup.vatRegistered, onSelect);
    syncContinueBtn('bsVatContinue', !!setup.vatRegistered);
  }

  function initAccountantStep() {
    const setup = loadSetup();
    const bridge = q('bsAccountantBridge');
    if (bridge) bridge.hidden = true;
    function onSelect(id) {
      saveSetup({ worksWithAccountant: id });
      refreshSingleSelect(q('bsAccountantGrid'), ACCOUNTANT_OPTIONS, id, onSelect);
      syncContinueBtn('bsAccountantContinue', true);
    }
    refreshSingleSelect(q('bsAccountantGrid'), ACCOUNTANT_OPTIONS, setup.worksWithAccountant, onSelect);
    syncContinueBtn('bsAccountantContinue', !!setup.worksWithAccountant);
  }

  function getReportEmailCopy(setup) {
    const s = setup || loadSetup();
    const path = getOnboardPath(s);
    if (path === 'mileage') {
      return {
        title: 'Where should we send your mileage reports?',
        helper:
          'Mileage reports include journeys, miles, HMRC estimates and PDFs.',
      };
    }
    if (path === 'business') {
      return {
        title: 'Where should we send your business reports?',
        helper:
          'Business reports include receipts, expenses, VAT summaries and accountant-ready records.',
      };
    }
    return {
      title: 'Where should we send your reports?',
      helper: "We'll send mileage, expense, VAT and business reports here.",
    };
  }

  function isValidName(value) {
    return (value || '').trim().length >= 2;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initReportEmailStep() {
    const setup = loadSetup();
    const copy = getReportEmailCopy(setup);
    const title = q('bsReportEmailTitle');
    const helper = q('bsReportEmailHelper');
    const input = q('bsReportEmailInput');
    if (title) title.textContent = copy.title;
    if (helper) helper.textContent = copy.helper;
    if (input) {
      input.value = setup.reportEmail || global.localStorage.getItem('mp_email') || '';
      if (!input.dataset.bound) {
        input.addEventListener('input', function () {
          syncContinueBtn('bsReportEmailContinue', isValidEmail(input.value.trim()));
        });
        input.dataset.bound = '1';
      }
    }
    syncContinueBtn(
      'bsReportEmailContinue',
      input ? isValidEmail(input.value.trim()) : false
    );
  }

  function initScanReceiptStep() {
    const setup = loadSetup();
    function onSelect(id) {
      saveSetup({ scanReceiptNow: id });
      refreshSingleSelect(q('bsScanReceiptGrid'), SCAN_OPTIONS, id, onSelect);
      syncContinueBtn('bsScanReceiptContinue', true);
    }
    refreshSingleSelect(q('bsScanReceiptGrid'), SCAN_OPTIONS, setup.scanReceiptNow, onSelect);
    syncContinueBtn('bsScanReceiptContinue', !!setup.scanReceiptNow);
  }

  function runBuildingSequence() {
    typeLines(
      q('bsBuildingTyping'),
      ['Looking at what you need...', 'Choosing the best setup...', 'Almost ready...'],
      function () {
        setTimeout(function () {
          renderRecommendation();
          showStep('recommendation');
        }, 160);
      },
      16
    );
  }

  function renderRecommendation() {
    const setup = loadSetup();
    const rec = computeRecommendation(setup);
    saveSetup({
      recommendedSetup: rec.setup,
      dashboardMode: rec.dashboardMode,
      selectedPlan: rec.plan,
      onboardPath: getOnboardPath(setup),
    });
    const intro = q('bsRecommendIntro');
    const workspace = q('bsRecommendWorkspace');
    const list = q('bsRecommendList');
    const sub = q('bsRecommendSub');
    if (intro) intro.textContent = rec.intro;
    if (workspace) workspace.textContent = 'Recommended Workspace: ' + rec.workspaceTitle;
    if (sub) sub.textContent = rec.subline || '';
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
    const setup = loadSetup();
    const selected = setup.selectedPlan || rec.plan;
    const coreCard = q('bsPlanCore');
    const bizCard = q('bsPlanBusiness');
    const sub = q('bsPlanSub');
    if (sub) {
      sub.textContent =
        rec.plan === 'core'
          ? 'Core unlocks your Mileage Workspace.'
          : 'Business unlocks your complete Business Workspace.';
    }
    if (coreCard) {
      coreCard.classList.toggle('is-selected', selected === 'core');
      coreCard.classList.toggle('is-recommended', rec.plan === 'core');
      const badge = coreCard.querySelector('.bs-plan-badge');
      if (badge) badge.hidden = rec.plan !== 'core';
    }
    if (bizCard) {
      bizCard.classList.toggle('is-selected', selected === 'business');
      bizCard.classList.toggle('is-recommended', rec.plan === 'business');
      const badge = bizCard.querySelector('.bs-plan-badge');
      if (badge) badge.hidden = rec.plan !== 'business';
    }
    const continueBtn = q('bsPlanContinue');
    if (continueBtn) {
      continueBtn.textContent = selected === 'core' ? 'Start Core' : 'Start Business';
      continueBtn.classList.toggle('is-ready', !!selected);
      continueBtn.disabled = !selected;
    }
  }

  function selectPlan(planId) {
    saveSetup({ selectedPlan: planId });
    renderPlanCards();
    syncContinueBtn('bsPlanContinue', true);
  }

  function syncContinueBtn(id, enabled) {
    const btn = q(id);
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('is-ready', enabled);
  }

  function nextStepAfter(step) {
    const flow = buildFlow(loadSetup());
    const idx = flow.indexOf(step);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  }

  function nextFrom(step) {
    const setup = loadSetup();

    if (step === 'welcome') {
      showStep('name');
      return;
    }
    if (step === 'name') {
      const input = q('bsNameInput');
      const name = input ? input.value.trim() : '';
      if (!isValidName(name)) return;
      saveSetup({ driverName: name });
      showStep('goals');
      return;
    }
    if (step === 'goals') {
      const path = getOnboardPath(setup);
      saveSetup({ onboardPath: path });
      buildFlow(setup);
      showStep(nextStepAfter('goals'));
      return;
    }
    if (step === 'vehicleUse') {
      buildFlow(loadSetup());
      showStep(nextStepAfter('vehicleUse'));
      return;
    }
    if (step === 'vehicleType') {
      showStep(nextStepAfter('vehicleType'));
      return;
    }
    if (step === 'trackingPreference') {
      buildFlow(setup);
      showStep(nextStepAfter('trackingPreference'));
      return;
    }
    if (step === 'vat') {
      showStep(nextStepAfter('vat'));
      return;
    }
    if (step === 'accountant') {
      showStep(nextStepAfter('accountant'));
      return;
    }
    if (step === 'reportEmail') {
      const input = q('bsReportEmailInput');
      const email = input ? input.value.trim() : '';
      if (!isValidEmail(email)) return;
      saveSetup({ reportEmail: email });
      applyReportPrefs(setup);
      showStep(nextStepAfter('reportEmail'));
      return;
    }
    if (step === 'scanReceipt') {
      if (setup.scanReceiptNow === 'yes') {
        toastScanLater();
      }
      showStep('building');
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

  function applyReportPrefs(setup) {
    const s = setup || loadSetup();
    const path = getOnboardPath(s);
    if (typeof global.applyModeReportPrefs === 'function') {
      if (path === 'business') {
        if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('manual');
        if (typeof global.saveReportPrefs === 'function') {
          global.saveReportPrefs({ emailReports: true, pdfAttachment: true, businessInsights: true });
        }
      } else {
        global.applyModeReportPrefs();
      }
    }
  }

  function toastScanLater() {
    if (typeof global.toast === 'function') {
      global.toast('Receipt scanner opens from your Business Workspace.');
    }
  }

  function applySelectedPlan() {
    const setup = loadSetup();
    const plan = PLANS[setup.selectedPlan] || PLANS.core;
    saveSetup({ selectedPlan: plan.id, setupComplete: true });
    if (typeof global.MPSubscription !== 'undefined' && global.MPSubscription.setPlanTier) {
      global.MPSubscription.setPlanTier(plan.id);
    }
  }

  function finishAfterPlan() {
    const setup = loadSetup();
    const path = getOnboardPath(setup);
    global.localStorage.setItem('mp_onboard_step', 'ready');

    if (!needsMileageOnboarding(setup)) {
      if (typeof global.MPTrackingMode !== 'undefined') global.MPTrackingMode.setMode('manual');
      global.localStorage.setItem('mp_location_choice', 'skipped');
      global.localStorage.setItem('mp_notifications_choice', 'skipped');
      if (!global.localStorage.getItem('mp_vehicle')) {
        global.localStorage.setItem('mp_vehicle', 'car');
      }
      return routeToOnboardReady();
    }

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
    }

    return routeToOnboardReady();
  }

  function routeToOnboardReady() {
    global.localStorage.setItem('mp_onboard_step', 'ready');
    if (typeof global.initOnboardReady === 'function') global.initOnboardReady();
    if (typeof global.showScreen === 'function') global.showScreen('onboardReady');
  }

  function start() {
    flowSteps = ['welcome', 'name', 'goals'];
    if (typeof global.showScreen === 'function') global.showScreen('businessSetup');
    showStep('welcome');
  }

  function setElText(id, text) {
    const el = q(id);
    if (el) el.textContent = text;
  }

  function updateHubPresentation(mode) {
    const card = q('ccBusinessHubCard');
    if (card) {
      card.classList.toggle('cc-workspace-discover', mode === 'mileage');
      card.classList.toggle('cc-workspace-primary', mode === 'business' || mode === 'mixed');
    }
    if (mode === 'mileage') {
      setElText('ccHubTitle', 'Business Hub');
      setElText('ccHubSub', 'Receipts, expenses, VAT and accountant records — explore when you need them.');
      setElText('ccHubCta', 'Explore Business Hub');
      setElText('ccHubTagline', 'Your Mileage Workspace is complete. This is optional.');
    } else if (mode === 'business') {
      setElText('ccHubTitle', 'Business Hub');
      setElText('ccHubSub', 'Organise receipts, expenses, VAT and accountant-ready records in one place.');
      setElText('ccHubCta', 'Open Business Hub');
      setElText('ccHubTagline', 'Your flagship workspace for less admin.');
    } else {
      setElText('ccHubTitle', 'Business Hub');
      setElText('ccHubSub', 'Receipts, expenses, VAT and reports alongside your mileage.');
      setElText('ccHubCta', 'Open Business Hub');
      setElText('ccHubTagline', 'Mileage and business records together.');
    }
    const chips = q('ccHubChips');
    if (chips) chips.hidden = mode === 'mileage';
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
    setElText(
      'ccBusinessPanelTitle',
      mode === 'mixed' ? "Today's Overview" : 'Business Hub'
    );
    if (mileageBlock) mileageBlock.hidden = mode === 'business';
    if (businessPanel) businessPanel.hidden = mode === 'mileage';
    if (hub) hub.hidden = false;
    if (mileageLater) {
      mileageLater.hidden = mode !== 'business';
      if (mode === 'business') {
        const p = mileageLater.querySelector('p');
        if (p) p.textContent = 'Need mileage later?';
        const btn = mileageLater.querySelector('button');
        if (btn) btn.textContent = 'Enable AutoPilot anytime';
      }
    }
    updateHubPresentation(mode);
    const parent = mileageBlock && mileageBlock.parentNode;
    if (mode === 'business' && businessPanel && hub && parent) {
      parent.insertBefore(businessPanel, hub);
      parent.insertBefore(hub, mileageBlock);
    }
    if (mode === 'mixed' && parent && mileageBlock && businessPanel && hub) {
      parent.insertBefore(mileageBlock, businessPanel);
      parent.insertBefore(businessPanel, hub);
    }
    if (mode === 'mileage' && parent && mileageBlock && hub) {
      parent.insertBefore(mileageBlock, hub);
    }
  }

  function getReadyChecklist() {
    const s = loadSetup();
    const path = getOnboardPath(s);
    const items = [];
    if (path === 'mileage' || path === 'combined') items.push('Mileage tracking ready');
    if (path === 'business' || path === 'combined') items.push('Business Hub ready');
    if (s.goals.includes('organise_receipts')) items.push('Receipt Scanner ready');
    if (s.goals.includes('track_expenses')) items.push('Expense tracking ready');
    if (s.goals.includes('help_vat') || s.vatRegistered === 'yes') items.push('VAT summaries ready');
    if (s.goals.includes('accountant')) items.push('Accountant Pack ready');
    if (path !== 'mileage') items.push('AI Bookkeeper ready');
    items.push('Reports ready');
    const seen = new Set();
    return items.filter(function (item) {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
  }

  function renderReadyChecklist() {
    const list = q('onboardReadyChecklist');
    if (!list) return;
    list.innerHTML = getReadyChecklist()
      .map(function (item) {
        return '<li><span class="mark" aria-hidden="true">✓</span> ' + item + '</li>';
      })
      .join('');
  }

  function getReadyCopy() {
    const path = getOnboardPath(loadSetup());
    let lead = "I'll help keep your business organised.";
    if (path === 'mileage') {
      lead = "Your Mileage Workspace is ready — I'll help you capture every business mile.";
    } else if (path === 'business') {
      lead = "Your Business Hub is ready — I'll help keep your records organised.";
    } else {
      lead = 'Your combined workspace is ready — mileage and business records in one place.';
    }
    return {
      greeting: "You're all set.",
      lead: lead,
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
    usesVehicle: usesVehicle,
    wantsMileageWorkspace: wantsMileageWorkspace,
    wantsBusinessHub: wantsBusinessHub,
    wantsBusinessWorkspace: wantsBusinessWorkspace,
    needsMileageOnboarding: needsMileageOnboarding,
    needsBusinessOnboarding: needsBusinessOnboarding,
    hasBusinessGoals: hasBusinessGoals,
    getOnboardPath: getOnboardPath,
    getWorkspaceType: getWorkspaceType,
    computeRecommendation: computeRecommendation,
    getDashboardMode: getDashboardMode,
    applyDashboardLayout: applyDashboardLayout,
    getReadyCopy: getReadyCopy,
    getReportEmailCopy: getReportEmailCopy,
    buildFlow: buildFlow,
    isValidName: isValidName,
    getReadyChecklist: getReadyChecklist,
    renderReadyChecklist: renderReadyChecklist,
    routeToOnboardReady: routeToOnboardReady,
    reset: reset,
  };
})(typeof window !== 'undefined' ? window : global);
