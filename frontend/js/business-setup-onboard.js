/**
 * MilePilot Conversational Onboarding — two-workspace strategy (Mileage + Business)
 * @see docs/PRODUCT_STRATEGY_LOCK.md
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_business_setup';
  const PROFILE_KEY = 'mp_business_profile';

  const GOALS = [
    { id: 'track_mileage', label: 'Track mileage' },
    { id: 'organise_receipts', label: 'Scan receipts' },
    { id: 'track_expenses', label: 'Track expenses' },
    { id: 'help_vat', label: 'Help with VAT' },
    { id: 'accountant', label: 'Prepare accountant records' },
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
    business_reports: 'reduce_paperwork',
    understand_business: 'reduce_paperwork',
    tax_records: 'accountant',
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
      g.includes('accountant') ||
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

  function mileageTrackingLabel(setup) {
    const pref = (setup || loadSetup()).trackingPreference;
    if (pref === 'manual') return 'Manual mileage tracking';
    if (pref === 'autopilot') return 'AutoPilot mileage tracking';
    return 'AutoPilot or Manual mileage tracking';
  }

  function recommendationSubline(setup) {
    const s = setup || loadSetup();
    if ((s.goals || []).includes('reduce_paperwork') || wantsBusinessWorkspace(s)) {
      return 'This setup is built around the admin you told me you want to reduce.';
    }
    return "Let's make sure you never miss another business mile.";
  }

  function wantsBusinessWorkspace(setup) {
    return wantsBusinessHub(setup);
  }

  function businessWorkspaceItems(setup) {
    const s = setup || loadSetup();
    const hasVat = selectedVatGoal(s) || s.vatRegistered === 'yes';
    const items = ['Business Workspace', 'AI Receipt Scanner', 'Expenses'];
    if (hasVat) items.push('VAT');
    items.push('AI Bookkeeper', 'Accountant Pack', 'Business Health', 'Business Inbox', 'Reports');
    return items;
  }

  function mileageWorkspaceItems(setup) {
    const s = setup || loadSetup();
    return [mileageTrackingLabel(s), 'HMRC mileage estimates', 'PDF & email reports'];
  }

  function computeRecommendation(setup) {
    const s = setup || loadSetup();
    const mileage = wantsMileageWorkspace(s);
    const business = wantsBusinessWorkspace(s);
    const subline = recommendationSubline(s);
    const intro = "Here's what I recommend.";

    if (mileage && business) {
      const items = ['Mileage tracking', 'Business Workspace', 'AI Receipt Scanner', 'Expense tracking'];
      if (selectedVatGoal(s) || s.vatRegistered === 'yes') items.push('VAT summaries');
      items.push('Accountant Pack');
      return { setup: 'mixed', dashboardMode: 'mixed', items, plan: 'business', intro, subline };
    }
    if (business && !mileage) {
      return {
        setup: 'business',
        dashboardMode: 'business',
        items: businessWorkspaceItems(s),
        plan: 'business',
        intro,
        subline,
      };
    }
    return {
      setup: 'mileage',
      dashboardMode: 'mileage',
      items: mileageWorkspaceItems(s),
      plan: 'core',
      intro,
      subline,
    };
  }

  function getWorkspaceType() {
    return getDashboardMode();
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

  function formatAckList(items) {
    if (!items.length) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + ' and ' + items[1];
    return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
  }

  function getAckForGoals(goals) {
    const g = goals || [];
    const hasMileage = g.includes('track_mileage');
    const hasReceipts = g.includes('organise_receipts');
    const hasVat = g.includes('help_vat');
    const hasAccountant = g.includes('accountant');
    const hasExpenses = g.includes('track_expenses');
    const hasBusiness =
      hasReceipts || hasExpenses || hasVat || hasAccountant || g.includes('reduce_paperwork');

    if (!g.length) {
      return ["Great — I'll build the right workspace around what you need."];
    }
    if (hasMileage && !hasBusiness) {
      return ["Perfect — I'll make mileage tracking the centre of your workspace."];
    }
    if (!hasMileage && hasBusiness) {
      if (hasReceipts && hasVat && hasAccountant) {
        return [
          "Great — I'll focus your setup on receipts, VAT summaries and accountant-ready records.",
        ];
      }
      return [
        "Great — I'll focus your Business Workspace on receipts, expenses and records.",
      ];
    }
    if (hasMileage && hasBusiness) {
      const focus = [];
      if (hasMileage) focus.push('mileage');
      if (hasReceipts) focus.push('receipts');
      if (hasVat) focus.push('VAT');
      if (hasAccountant) focus.push('accountant-ready records');
      if (hasExpenses) focus.push('expenses');
      return ["Perfect — I'll build your workspace around " + formatAckList(focus) + '.'];
    }
    if (g.includes('reduce_paperwork')) {
      return ["Great — I'll keep your workspace simple with less paperwork."];
    }
    return ["Great — I'll build the right workspace around what you need."];
  }

  function getAckForVat(vat) {
    if (vat === 'yes') {
      return ["Excellent — I'll prioritise VAT summaries and receipt automation."];
    }
    return ['No problem — you can still track expenses and accountant records.'];
  }

  function getValueAddsForGoals(goals) {
    const g = goals || [];
    const lines = [];
    if (g.includes('track_mileage')) lines.push('✓ Mileage tracking added');
    if (g.includes('organise_receipts')) lines.push('✓ Receipt Scanner added');
    if (g.includes('track_expenses')) lines.push('✓ Expense tracking added');
    if (g.includes('help_vat')) lines.push('✓ VAT summaries added');
    if (g.includes('accountant')) lines.push('✓ Accountant Pack added');
    return lines.slice(0, 4);
  }

  function revealValueAdds(lines, onDone) {
    const ul = q('bsAckValues');
    if (!ul || !lines.length) {
      if (onDone) onDone();
      return;
    }
    ul.hidden = false;
    ul.innerHTML = '';
    let i = 0;
    function addNext() {
      if (i >= lines.length) {
        if (onDone) onDone();
        return;
      }
      const li = document.createElement('li');
      li.className = 'bs-value-add';
      li.textContent = lines[i++];
      ul.appendChild(li);
      requestAnimationFrame(function () {
        li.classList.add('is-visible');
      });
      setTimeout(addNext, 260);
    }
    addNext();
  }

  function showAck(lines, nextStep, valueLines) {
    pendingAfterAck = nextStep;
    document.querySelectorAll('.bs-step').forEach(function (el) {
      el.hidden = el.dataset.step !== 'ack';
    });
    const valuesEl = q('bsAckValues');
    if (valuesEl) {
      valuesEl.hidden = true;
      valuesEl.innerHTML = '';
    }
    showFooterFor('ack');
    updateProgress('ack');
    syncContinueBtn('bsAckContinue', false);
    typeLines(
      q('bsAckTyping'),
      lines,
      function () {
        revealValueAdds(valueLines || [], function () {
          syncContinueBtn('bsAckContinue', true);
        });
      },
      24
    );
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
    const skipWrap = q('bsWelcomeSkipWrap');
    if (skipWrap) skipWrap.hidden = step !== 'welcome';
    const compareBtn = q('bsComparePlans');
    if (compareBtn) compareBtn.hidden = step !== 'choosePlan';
    if (step === 'building') {
      Object.keys(FOOTER_BTNS).forEach(function (key) {
        const btn = q(FOOTER_BTNS[key]);
        if (btn) btn.hidden = true;
      });
      if (compareBtn) compareBtn.hidden = true;
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
    typeLines(
      q('bsWelcomeTyping'),
      [
        greet,
        "Let's build your business assistant.",
        "I'll ask a few quick questions, then create the best MilePilot workspace for you.",
      ],
      null,
      22
    );
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
      ['Looking at what you need...', 'Choosing the best setup...', 'Almost ready...'],
      function () {
        setTimeout(function () {
          renderRecommendation();
          showStep('recommendation');
        }, 180);
      },
      18
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
    const sub = q('bsRecommendSub');
    if (intro) intro.textContent = rec.intro;
    if (sub) sub.textContent = rec.subline || '';
    if (list) {
      list.innerHTML = rec.items
        .map(function (item) {
          return '<li><span class="bs-check" aria-hidden="true">✓</span> ' + item + '</li>';
        })
        .join('');
    }
  }

  let comparePlansOpen = false;

  function toggleComparePlans() {
    comparePlansOpen = !comparePlansOpen;
    const grid = q('bsPlanGrid');
    if (grid) grid.classList.toggle('is-compare', comparePlansOpen);
    const btn = q('bsComparePlans');
    if (btn) btn.textContent = comparePlansOpen ? 'Show recommendation' : 'Compare plans';
  }

  function renderPlanCards() {
    const rec = computeRecommendation(loadSetup());
    const setup = loadSetup();
    const selected = setup.selectedPlan || rec.plan;
    const coreCard = q('bsPlanCore');
    const bizCard = q('bsPlanBusiness');
    const grid = q('bsPlanGrid');
    const sub = q('bsPlanSub');
    if (sub) {
      sub.textContent =
        rec.plan === 'core'
          ? 'Core unlocks your Mileage Workspace.'
          : 'Business unlocks your complete Business Workspace.';
    }
    if (grid) grid.classList.toggle('is-compare', comparePlansOpen);
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
      showAck(getAckForGoals(setup.goals || []), next, getValueAddsForGoals(setup.goals || []));
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
      if (wantsMileageWorkspace(setup) && setup.trackingPreference && setup.trackingPreference !== 'later') {
        const value =
          setup.trackingPreference === 'autopilot'
            ? '✓ AutoPilot mileage tracking added'
            : '✓ Manual mileage tracking added';
        showAck(["Nice — I'll make sure that's included."], next, [value]);
        return;
      }
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
      comparePlansOpen = false;
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
      setElText('ccHubTitle', 'Business Workspace');
      setElText(
        'ccHubSub',
        'Receipts, expenses, VAT and accountant records — explore when you need them.'
      );
      setElText('ccHubCta', 'Explore Business Workspace');
      setElText('ccHubTagline', 'Your Mileage Workspace is complete. This is optional.');
    } else if (mode === 'business') {
      setElText('ccHubTitle', 'Business Workspace');
      setElText(
        'ccHubSub',
        'Organise receipts, expenses, VAT and accountant-ready records in one place.'
      );
      setElText('ccHubCta', 'Open Business Workspace');
      setElText('ccHubTagline', 'Your flagship workspace for less admin.');
    } else {
      setElText('ccHubTitle', 'Business Workspace');
      setElText('ccHubSub', 'Receipts, expenses, VAT and reports alongside your mileage.');
      setElText('ccHubCta', 'Open Business Workspace');
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
      mode === 'mixed' ? "Today's Overview" : 'Business Workspace'
    );
    if (mileageBlock) mileageBlock.hidden = mode === 'business';
    if (businessPanel) businessPanel.hidden = mode === 'mileage';
    if (hub) hub.hidden = false;
    if (mileageLater) mileageLater.hidden = mode !== 'business';
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
    const rec = computeRecommendation(s);
    const items = [];
    if (selectedMileageGoal(s)) items.push('Mileage tracking ready');
    if (wantsBusinessWorkspace(s)) items.push('Business Workspace ready');
    if (s.goals.includes('organise_receipts')) items.push('Receipt Scanner ready');
    if (s.goals.includes('track_expenses')) items.push('Expense tracking ready');
    if (s.goals.includes('help_vat') || s.vatRegistered === 'yes') items.push('VAT summaries ready');
    if (s.goals.includes('accountant')) items.push('Accountant Pack ready');
    if (wantsBusinessWorkspace(s) && rec.plan === 'business') items.push('AI Bookkeeper ready');
    if (wantsBusinessWorkspace(s) && rec.plan === 'business') items.push('Business Health ready');
    if (selectedMileageGoal(s) || wantsBusinessHub(s)) items.push('Reports ready');
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
    const items = getReadyChecklist();
    list.innerHTML = items
      .map(function (item) {
        return '<li><span class="mark" aria-hidden="true">✓</span> ' + item + '</li>';
      })
      .join('');
  }

  function getReadyCopy() {
    const mode = getDashboardMode();
    let lead = "I'll help keep your business organised.";
    if (mode === 'mileage') {
      lead = "Your Mileage Workspace is ready — I'll help you capture every business mile.";
    } else if (mode === 'business') {
      lead = "Your Business Workspace is ready — I'll help keep your records organised.";
    } else if (mode === 'mixed') {
      lead = 'Your Mileage and Business Workspaces are ready — everything in one place.';
    }
    return {
      greeting: "You're all set.",
      lead: lead,
      feature: 'You get back to running it.',
      cta: 'Go to Dashboard',
    };
  }

  function skipSetup() {
    saveSetup({
      goals: ['reduce_paperwork'],
      dashboardMode: 'mileage',
      selectedPlan: 'core',
      recommendedSetup: 'mileage',
    });
    if (typeof global.MPSubscription !== 'undefined' && global.MPSubscription.setPlanTier) {
      global.MPSubscription.setPlanTier('core');
    }
    routeAfterSetupToKnowYou();
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
    wantsBusinessWorkspace: wantsBusinessWorkspace,
    getWorkspaceType: getWorkspaceType,
    businessWorkspaceItems: businessWorkspaceItems,
    mileageWorkspaceItems: mileageWorkspaceItems,
    computeRecommendation: computeRecommendation,
    getDashboardMode: getDashboardMode,
    applyDashboardLayout: applyDashboardLayout,
    getReadyCopy: getReadyCopy,
    routeAfterSetupToKnowYou: routeAfterSetupToKnowYou,
    buildFlow: buildFlow,
    getAckForGoals: getAckForGoals,
    getReadyChecklist: getReadyChecklist,
    renderReadyChecklist: renderReadyChecklist,
    toggleComparePlans: toggleComparePlans,
    skipSetup: skipSetup,
    reset: reset,
  };
})(typeof window !== 'undefined' ? window : global);
