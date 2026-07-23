/**
 * MP-S6-001 — Business Workspace controller
 * Shell, navigation, feature registry — no business feature implementation.
 */
(function (global) {
  'use strict';

  var HOME_ROOT_ID = 'mpBusinessWorkspaceRoot';
  var TOOL_ROOT_ID = 'mpBusinessToolRoot';

  var TOOLS = [
    {
      id: 'expenses',
      icon: 'expenses',
      title: 'Expenses',
      description: 'Track and organise every business purchase.',
      badge: null,
      tagline: 'Business spending in one secure place.',
      emptyBody:
        'Keep every business expense organised in one secure place. Future versions of MilePilot will automatically scan receipts, organise purchases and prepare accountant-ready summaries.',
      feature: 'expenses',
    },
    {
      id: 'vat',
      icon: 'vat',
      title: 'VAT',
      description: 'Understand your VAT position at a glance.',
      badge: 'Coming Soon',
      tagline: 'VAT tracking for self-employed professionals.',
      emptyBody:
        'See your VAT position clearly across each period. MilePilot will help you track input and output VAT and prepare figures for your return — without spreadsheets.',
      feature: 'vat',
    },
    {
      id: 'bookkeeper',
      icon: 'bookkeeper',
      title: 'AI Bookkeeper',
      description: 'Intelligent help for everyday bookkeeping.',
      badge: 'Coming Soon',
      tagline: 'Smart assistance for your books.',
      emptyBody:
        'An AI bookkeeper that learns your business patterns and helps categorise transactions. This will connect to your expenses and mileage — not replace your accountant.',
      feature: 'bookkeeper',
    },
    {
      id: 'health',
      icon: 'health',
      title: 'Business Health',
      description: 'See how your business is performing overall.',
      badge: 'Coming Soon',
      tagline: 'A clear picture of business wellbeing.',
      emptyBody:
        'Business Health brings together mileage, expenses, and cash flow signals into one simple score. Know where you stand before month-end surprises.',
      feature: 'businessHealth',
    },
    {
      id: 'accountant',
      icon: 'accountant',
      title: 'Accountant Pack',
      description: 'Export everything your accountant needs.',
      badge: 'Coming Soon',
      tagline: 'Professional packs for your accountant.',
      emptyBody:
        'Prepare a complete accountant pack with mileage reports, expenses, and summaries in one download. Built for UK self-employed professionals and their advisers.',
      feature: 'accountantPack',
    },
  ];

  var toolById = {};
  TOOLS.forEach(function (t) {
    toolById[t.id] = t;
  });

  var state = { screen: 'home', toolId: null, originToolId: null };

  function isExpensesEngineReady() {
    return !!(global.MPExpenseEngine && typeof global.MPExpenseEngine.isEngineReady === 'function' && global.MPExpenseEngine.isEngineReady());
  }

  function isConnected(feature) {
    if (feature === 'expenses') return isExpensesEngineReady();
    return false;
  }

  function getToolsForDisplay() {
    return TOOLS.map(function (t) {
      if (t.id === 'expenses' && isExpensesEngineReady()) {
        return Object.assign({}, t, { badge: null });
      }
      return t;
    });
  }

  function getTool(id) {
    return toolById[id] || null;
  }

  function getTools() {
    return TOOLS.slice();
  }

  function openAskWithQuestion(text) {
    text = (text || '').trim();
    if (!text) return;
    if (typeof global.showAsk === 'function') {
      global.showAsk();
      if (global.MPAskMilePilotApp && typeof global.MPAskMilePilotApp.submitQuestion === 'function') {
        global.MPAskMilePilotApp.submitQuestion(text);
      }
    }
  }

  function bindHomeEvents(root) {
    if (!root) return;
    var input = root.querySelector('.mp-bw-ask-input');
    var send = root.querySelector('.mp-bw-ask-send');
    function submit() {
      if (input) openAskWithQuestion(input.value);
    }
    if (send) send.addEventListener('click', submit);
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          submit();
        }
      });
    }
    root.querySelectorAll('[data-bw-ask-chip]').forEach(function (el) {
      el.addEventListener('click', function () {
        openAskWithQuestion(el.getAttribute('data-bw-ask-chip'));
      });
    });
    root.querySelectorAll('[data-bw-tool]').forEach(function (el) {
      el.addEventListener('click', function () {
        showTool(el.getAttribute('data-bw-tool'), { recordOrigin: true });
      });
    });
  }

  function bindToolEvents(root) {
    if (!root) return;
    var back = root.querySelector('[data-bw-back]');
    if (back) {
      back.addEventListener('click', function () {
        showHome();
      });
    }
  }

  function focusFirst(root, selector) {
    if (!root || typeof root.querySelector !== 'function') return false;
    var target = root.querySelector(selector);
    if (target && typeof target.focus === 'function') {
      try {
        target.focus({ preventScroll: true });
      } catch (e) {
        target.focus();
      }
      return true;
    }
    return false;
  }

  function paintHome() {
    var root = global.document.getElementById(HOME_ROOT_ID);
    var V = global.MPBusinessWorkspaceView;
    if (!root || !V) return;
    root.innerHTML = V.renderHome(getToolsForDisplay());
    bindHomeEvents(root);
  }

  function paintTool(id) {
    var root = global.document.getElementById(TOOL_ROOT_ID);
    var V = global.MPBusinessWorkspaceView;
    var tool = getTool(id);
    if (!root || !V || !tool) return;
    if (id === 'expenses' && isExpensesEngineReady() && global.MPBusinessExpensesTool) {
      global.MPBusinessExpensesTool.paint(root, tool);
    } else {
      root.innerHTML = V.renderToolEmpty(tool);
    }
    bindToolEvents(root);
  }

  function restoreHomeFocus(homeRoot) {
    var originId = state.originToolId;
    if (originId && getTool(originId)) {
      if (focusFirst(homeRoot, '[data-bw-tool="' + originId + '"]')) {
        state.originToolId = null;
        return;
      }
    }
    state.originToolId = null;
    focusFirst(homeRoot, '.mp-bw-ask-input');
  }

  function showHomeScreen(opts) {
    opts = opts || {};
    state.screen = 'home';
    state.toolId = null;
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = false;
    if (toolRoot) toolRoot.hidden = true;
    paintHome();
    if (opts.focusAskOnly) {
      state.originToolId = null;
      focusFirst(homeRoot, '.mp-bw-ask-input');
      return;
    }
    restoreHomeFocus(homeRoot);
  }

  function showTool(id, opts) {
    opts = opts || {};
    if (!getTool(id)) return;
    if (opts.recordOrigin) state.originToolId = id;
    state.screen = 'tool';
    state.toolId = id;
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = true;
    if (toolRoot) toolRoot.hidden = false;
    paintTool(id);
    var win = global.window || global;
    if (win && typeof win.scrollTo === 'function') win.scrollTo(0, 0);
    focusFirst(toolRoot, '[data-bw-tool-heading]');
  }

  function mount() {
    showHomeScreen({ focusAskOnly: true });
  }

  function leave() {
    state = { screen: 'home', toolId: null, originToolId: null };
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = false;
    if (toolRoot) toolRoot.hidden = true;
  }

  function isBusinessScreenActive() {
    var doc = global.document;
    return !!(doc && doc.querySelector && doc.querySelector('#business.active'));
  }

  function showHome() {
    if (isBusinessScreenActive()) {
      showHomeScreen();
      return;
    }
    if (typeof global.showBusiness === 'function') {
      global.showBusiness();
      return;
    }
    showHomeScreen();
  }

  global.MPBusinessWorkspace = {
    mount: mount,
    leave: leave,
    showTool: showTool,
    showHome: showHome,
    isConnected: isConnected,
    getTools: getTools,
    getTool: getTool,
    TOOLS: TOOLS,
    openAskWithQuestion: openAskWithQuestion,
  };
})(typeof window !== 'undefined' ? window : globalThis);
