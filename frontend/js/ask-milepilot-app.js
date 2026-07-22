/**
 * MP-S5-001 — Ask MilePilot functional app controller
 * UI talks only to MPAskMilePilotService — never to business systems directly.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mpAskShellRoot';
  var state = { question: '', response: null, busy: false };

  function getRoot() {
    return global.document.getElementById(ROOT_ID);
  }

  function isStaticPreview() {
    var params = new URLSearchParams(global.location.search);
    return params.has('s');
  }

  function buildDefaultDeps() {
    function claim(mi, v) {
      if (!global.MPTaxEngine) {
        throw new Error('MPTaxEngine unavailable. Application initialisation error.');
      }
      var vehicle = getVehicle();
      var trips = global.MPTrips.loadTrips(vehicle, claim);
      var shifts = [];
      try {
        shifts = JSON.parse(global.localStorage.getItem('mp_shifts') || '[]');
      } catch (e) {}
      var all = global.MPTaxEngine.collectBusinessJourneys(trips, shifts, vehicle);
      return global.MPTaxEngine.claimMarginalPounds(mi, v || vehicle, all, new Date());
    }
    function getVehicle() {
      try {
        return global.localStorage.getItem('mp_vehicle') || 'car';
      } catch (e) {
        return 'car';
      }
    }
    var deps = {
      getTrips: function () {
        return global.MPTrips.loadTrips(getVehicle(), claim);
      },
      getShifts: function () {
        try {
          return JSON.parse(global.localStorage.getItem('mp_shifts') || '[]');
        } catch (e) {
          return [];
        }
      },
      getVehicle: getVehicle,
      claimFn: claim,
      getEmail: function () {
        try {
          return global.localStorage.getItem('mp_email') || '';
        } catch (e) {
          return '';
        }
      },
      getDriver: function () {
        try {
          return global.localStorage.getItem('mp_driver') || '';
        } catch (e) {
          return '';
        }
      },
      getHmrcRate: function () {
        if (!global.MPTaxEngine) {
          throw new Error('MPTaxEngine unavailable. Application initialisation error.');
        }
        var ty = global.MPTaxEngine.getUkTaxYear(new Date());
        return global.MPTaxEngine.displayRateForVehicle(ty.id, getVehicle());
      },
      fmt: function (sec) {
        var s = Math.max(0, Math.round(Number(sec) || 0));
        var h = Math.floor(s / 3600);
        var m = Math.floor((s % 3600) / 60);
        if (h) return h + 'h ' + m + 'm';
        return m + 'm';
      },
      apiPost: typeof global.fetch === 'function'
        ? async function (path, body) {
            var res = await global.fetch(path, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Request failed');
            if (path.indexOf('/reports/pdf') >= 0) {
              return { blob: await res.blob() };
            }
            return await res.json();
          }
        : null,
    };
    if (global.MPSummaryReports && global.MPSummaryReports.init) {
      global.MPSummaryReports.init(deps);
    }
    return deps;
  }

  function paint() {
    var root = getRoot();
    if (!root || !global.MPAskMilePilotView) return;
    if (!state.question) {
      root.innerHTML = global.MPAskMilePilotView.renderEmpty();
    } else {
      root.innerHTML = global.MPAskMilePilotView.renderConversation(state.question, state.response, {
        showProcessing: state.busy,
      });
    }
    bindEvents(root);
  }

  function bindEvents(root) {
    if (!root) return;

    root.querySelectorAll('[data-ask-suggestion], [data-ask-followup]').forEach(function (el) {
      el.addEventListener('click', function () {
        var text = el.getAttribute('data-ask-suggestion') || el.getAttribute('data-ask-followup');
        if (text) submitQuestion(text);
      });
    });

    var heroInput = root.querySelector('.mp-ask-input');
    var heroSend = root.querySelector('.mp-ask-input__send');
    if (heroInput && heroSend) {
      heroSend.addEventListener('click', function () {
        submitQuestion(heroInput.value);
      });
      heroInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submitQuestion(heroInput.value);
        }
      });
    }

    var composerInput = root.querySelector('.mp-ask-composer__input');
    var composerSend = root.querySelector('.mp-ask-composer__send');
    if (composerInput && composerSend) {
      composerSend.addEventListener('click', function () {
        submitQuestion(composerInput.value);
      });
      composerInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitQuestion(composerInput.value);
        }
      });
    }

    root.querySelectorAll('[data-ask-confirm]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var action = btn.getAttribute('data-ask-confirm');
        confirmAction(action);
      });
    });

    var cancelBtn = root.querySelector('[data-ask-cancel]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        global.MPAskMilePilotService.cancelAction();
        state.response = {
          view: 'text',
          message: 'Action cancelled.',
          followups: ['How much can I claim this month?', 'Show today\'s journeys'],
        };
        paint();
      });
    }
  }

  function submitQuestion(text) {
    text = (text || '').trim();
    if (!text || state.busy) return;
    state.question = text;
    state.busy = true;
    state.response = null;
    paint();
    global.MPAskMilePilotService.handleQuestion(text).then(function (response) {
      state.busy = false;
      state.response = response;
      paint();
    });
  }

  function confirmAction(actionType) {
    if (state.busy || (global.MPAskMilePilotService.ActionExecutor && global.MPAskMilePilotService.ActionExecutor.isExecuting())) return;
    state.busy = true;
    paint();
    global.MPAskMilePilotService.confirmAction(actionType).then(function (response) {
      state.busy = false;
      state.response = response;
      paint();
    });
  }

  function leave() {
    if (global.MPAskMilePilotService) global.MPAskMilePilotService.cancelAction();
    state = { question: '', response: null, busy: false };
  }

  function mount(skipInit) {
    if (isStaticPreview()) {
      if (global.MPAskMilePilotShell) return global.MPAskMilePilotShell.mount();
      return null;
    }
    if (!global.MPAskMilePilotService) return null;
    if (!skipInit) {
      global.MPAskMilePilotService.init(buildDefaultDeps());
    }
    state = { question: '', response: null, busy: false };
    paint();
    return getRoot();
  }

  global.MPAskMilePilotApp = { mount: mount, leave: leave, submitQuestion: submitQuestion };
})(typeof window !== 'undefined' ? window : globalThis);
