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
      badge: 'Coming Soon',
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

  var state = { screen: 'home', toolId: null };

  function isConnected(feature) {
    return false;
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
        showTool(el.getAttribute('data-bw-tool'));
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

  function paintHome() {
    var root = global.document.getElementById(HOME_ROOT_ID);
    var V = global.MPBusinessWorkspaceView;
    if (!root || !V) return;
    root.innerHTML = V.renderHome(getTools());
    bindHomeEvents(root);
  }

  function paintTool(id) {
    var root = global.document.getElementById(TOOL_ROOT_ID);
    var V = global.MPBusinessWorkspaceView;
    var tool = getTool(id);
    if (!root || !V || !tool) return;
    root.innerHTML = V.renderToolEmpty(tool);
    bindToolEvents(root);
  }

  function showHomeScreen() {
    state.screen = 'home';
    state.toolId = null;
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = false;
    if (toolRoot) toolRoot.hidden = true;
    paintHome();
  }

  function showTool(id) {
    if (!getTool(id)) return;
    state.screen = 'tool';
    state.toolId = id;
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = true;
    if (toolRoot) toolRoot.hidden = false;
    paintTool(id);
    global.window.scrollTo(0, 0);
  }

  function mount() {
    showHomeScreen();
  }

  function leave() {
    state = { screen: 'home', toolId: null };
    var homeRoot = global.document.getElementById(HOME_ROOT_ID);
    var toolRoot = global.document.getElementById(TOOL_ROOT_ID);
    if (homeRoot) homeRoot.hidden = false;
    if (toolRoot) toolRoot.hidden = true;
  }

  function showHome() {
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
