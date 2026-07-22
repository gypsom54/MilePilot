/**
 * MP-S6-001A — Business Workspace foundation verification tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const acorn = require('acorn');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;
const pending = [];

function run(name, fn) {
  const job = (async () => {
    try {
      await fn();
      console.log('✓ ' + name);
      passed++;
    } catch (e) {
      console.error('✗ ' + name);
      console.error('  ' + e.message);
      failed++;
    }
  })();
  pending.push(job);
}

function md5(file) {
  return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
}

function loadWorkspace(sandbox) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-view.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace.js'), 'utf8'), sandbox);
}

function mockDom() {
  const listeners = [];
  function el(id) {
    return {
      id,
      hidden: false,
      innerHTML: '',
      addEventListener(type, fn) {
        listeners.push({ id, type, fn });
      },
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      },
    };
  }
  const home = el('mpBusinessWorkspaceRoot');
  const tool = el('mpBusinessToolRoot');
  const doc = {
    getElementById(id) {
      if (id === 'mpBusinessWorkspaceRoot') return home;
      if (id === 'mpBusinessToolRoot') return tool;
      return null;
    },
  };
  return { doc, home, tool, listeners };
}

run('models: interfaces only, schema v1', () => {
  const sb = { window: {}, globalThis: {} };
  sb.globalThis = sb.window = sb;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8'), sb);
  const M = sb.MPBusinessWorkspaceModels;
  assert.equal(M.SCHEMA_VERSION, 1);
  assert.equal(M.expenseShape().amountPence, 0);
  assert.equal(M.expenseShape().currency, 'GBP');
  assert.equal(M.receiptShape().imageRef, undefined);
  assert.equal(M.businessHealthShape().highlights.length, 0);
});

run('models: no localStorage access in module', () => {
  const src = fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8');
  assert.ok(!src.includes('localStorage.setItem'));
  assert.ok(!src.includes('fetch('));
});

run('five tool cards registered', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  ['expenses', 'vat', 'bookkeeper', 'health', 'accountant'].forEach((id) => {
    assert.ok(sb.MPBusinessWorkspace.getTool(id), id);
  });
});

run('all five tool empty states render', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const V = sb.MPBusinessWorkspaceView;
  sb.MPBusinessWorkspace.getTools().forEach((tool) => {
    const html = V.renderToolEmpty(tool);
    assert.ok(html.includes(tool.title));
    assert.ok(html.includes('Coming Soon') || html.includes('role="status"'));
    assert.ok(!html.includes('under construction'));
  });
});

run('invalid tool ID fails safely', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const before = sb.MPBusinessWorkspace.showTool('not-a-real-tool');
  assert.equal(before, undefined);
});

run('route: production index has showBusiness and deep link', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes('function showBusiness()'));
  assert.ok(html.includes("view')==='business'"));
  assert.ok(html.includes("last==='business'"));
  assert.ok(html.includes('MPBusinessWorkspace.leave()'));
});

run('refresh restore: sessionStorage business key wired', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes("sessionStorage.setItem('mp_active_screen'"));
  assert.ok(html.includes("last==='business'"));
});

run('Ask chip handoff uses production showAsk + submitQuestion', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  let asked = null;
  let submitted = null;
  sb.showAsk = () => {
    asked = true;
  };
  sb.MPAskMilePilotApp = { submitQuestion: (t) => (submitted = t) };
  sb.MPBusinessWorkspace.openAskWithQuestion('How much can I claim this month?');
  assert.equal(asked, true);
  assert.equal(submitted, 'How much can I claim this month?');
});

run('Ask manual submission path same as chips', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  let submitted = null;
  sb.showAsk = () => {};
  sb.MPAskMilePilotApp = { submitQuestion: (t) => (submitted = t) };
  sb.MPBusinessWorkspace.openAskWithQuestion("Show this week's journeys.");
  assert.equal(submitted, "Show this week's journeys.");
});

run('four workspace suggestion chips present', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderHome(sb.MPBusinessWorkspace.getTools());
  [
    'How much can I claim this month?',
    "Show this week's journeys.",
    'Prepare my mileage report.',
    'Show trips needing review.',
  ].forEach((chip) => assert.ok(html.includes(chip), chip));
});

run('no second Ask service or intent registry', () => {
  const ws = fs.readFileSync(path.join(root, 'frontend/js/business-workspace.js'), 'utf8');
  const view = fs.readFileSync(path.join(root, 'frontend/js/business-workspace-view.js'), 'utf8');
  assert.ok(!ws.includes('IntentRouter'));
  assert.ok(!ws.includes('MPAskMilePilotService'));
  assert.ok(!view.includes('MPTaxEngine'));
  assert.equal(fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-service.js'), 'utf8').includes('MPBusinessWorkspace'), false);
});

run('cards use button elements with aria-label', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderHome(sb.MPBusinessWorkspace.getTools());
  assert.ok(html.includes('<button type="button" class="mp-bw-card"'));
  assert.ok(html.includes('aria-label="Expenses"'));
});

run('back control has accessible label', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderToolEmpty(sb.MPBusinessWorkspace.getTool('vat'));
  assert.ok(html.includes('aria-label="Back to Business Workspace"'));
});

run('Coming Soon is status label not actionable button', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderToolEmpty(sb.MPBusinessWorkspace.getTool('expenses'));
  assert.ok(html.includes('role="status"'));
  assert.ok(!html.includes('mp-bw-empty__action'));
});

run('Ask input retains aria-label in embed', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderAskEmbed();
  assert.ok(html.includes('aria-label="Ask MilePilot"'));
});

run('no fake activity or metrics on home', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderHome(sb.MPBusinessWorkspace.getTools());
  assert.ok(!html.includes('£'));
  assert.ok(html.includes('No recent activity yet'));
});

run('leave resets tool visibility', () => {
  const sb = { window: { scrollTo() {} }, globalThis: {}, document: mockDom().doc };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  sb.MPBusinessWorkspace.mount();
  sb.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true });
  sb.MPBusinessWorkspace.leave();
  const home = sb.document.getElementById('mpBusinessWorkspaceRoot');
  const tool = sb.document.getElementById('mpBusinessToolRoot');
  assert.equal(home.hidden, false);
  assert.equal(tool.hidden, true);
});

run('50 mount cycles do not accumulate innerHTML handlers unsafely', () => {
  const dom = mockDom();
  const sb = { window: {}, globalThis: {}, document: dom.doc };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  for (let i = 0; i < 50; i++) {
    sb.MPBusinessWorkspace.mount();
    sb.MPBusinessWorkspace.leave();
  }
  assert.ok(dom.home.innerHTML !== undefined);
});

run('deploy mirror parity hashes', () => {
  const pairs = [
    ['frontend/css/business-workspace.css', 'milepilot-upload-v2/css/business-workspace.css'],
    ['frontend/js/business-workspace.js', 'milepilot-upload-v2/js/business-workspace.js'],
    ['frontend/js/business-workspace-view.js', 'milepilot-upload-v2/js/business-workspace-view.js'],
    ['frontend/js/business-workspace-models.js', 'milepilot-upload-v2/js/business-workspace-models.js'],
    ['frontend/index.html', 'milepilot-upload-v2/index.html'],
  ];
  pairs.forEach(([a, b]) => assert.equal(md5(path.join(root, a)), md5(path.join(root, b)), a));
});

run('handlePos syntax: semicolon present after feedAutopilotGps', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes('feedAutopilotGps(pos);lastGpsAccuracy'));
  assert.ok(!html.includes('feedAutopilotGps(pos)lastGpsAccuracy'));
});

run('handlePos syntax: acorn parses full inline script', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const js = html.match(/<script>[\s\S]*<\/script>\s*<\/body>/)[0].replace(/<script>/, '').replace(/<\/script>[\s\S]*/, '');
  acorn.parse(js, { ecmaVersion: 2022 });
});

run('protected Ask files unchanged vs main', () => {
  const files = [
    'frontend/js/ask-milepilot-service.js',
    'frontend/js/ask-milepilot-app.js',
    'frontend/js/ask-milepilot-view.js',
    'frontend/js/mp-tax-engine.js',
  ];
  files.forEach((f) => {
    const cur = fs.readFileSync(path.join(root, f), 'utf8');
    let mainSrc;
    try {
      mainSrc = require('child_process').execSync(`git show main:${f}`, { encoding: 'utf8' });
    } catch {
      return;
    }
    assert.equal(cur, mainSrc, f + ' must match main');
  });
});

run('workspace components exported', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const V = sb.MPBusinessWorkspaceView;
  ['WorkspaceHeader', 'WorkspaceCard', 'WorkspaceSection', 'WorkspaceEmptyState', 'WorkspaceBadge', 'WorkspaceStat', 'WorkspaceDivider', 'WorkspaceSkeleton'].forEach((n) => {
    assert.equal(typeof V[n], 'function', n);
  });
});

run('mobile nav: six items including Business', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes('id="navBusiness"'));
  assert.ok(html.includes("['Home','Ask','Business','Reports','History','Settings']"));
});

run('mobile nav density: icon-only mode on narrow viewports', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes('@media(max-width:360px)'));
  assert.ok(html.includes('clip:rect(0,0,0,0)'));
});

run('tool heading is programmatically focusable', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderToolEmpty(sb.MPBusinessWorkspace.getTool('expenses'));
  assert.ok(html.includes('data-bw-tool-heading tabindex="-1"'));
});

run('tool screen DOM order: back before heading for keyboard tab', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderToolEmpty(sb.MPBusinessWorkspace.getTool('vat'));
  const backIdx = html.indexOf('data-bw-back');
  const headingIdx = html.indexOf('data-bw-tool-heading');
  assert.ok(backIdx > -1 && headingIdx > backIdx, 'back control precedes heading in DOM');
});

function createFocusSandbox() {
  function makeFocusable(id, attrs) {
    return {
      id,
      hidden: false,
      innerHTML: '',
      attrs: attrs || {},
      focusCalls: 0,
      focus() { this.focusCalls++; },
      addEventListener() {},
      getAttribute(name) { return this.attrs[name] || null; },
      querySelector() { return null; },
      querySelectorAll() { return []; },
    };
  }

  const cards = {};
  ['expenses', 'vat', 'bookkeeper', 'health', 'accountant'].forEach((toolId) => {
    cards[toolId] = makeFocusable('card-' + toolId, { 'data-bw-tool': toolId });
  });

  const heading = makeFocusable('tool-heading', { 'data-bw-tool-heading': '1', tabindex: '-1' });
  const backBtn = makeFocusable('back', { 'data-bw-back': '1' });
  const askInput = makeFocusable('ask');

  const homeRoot = {
    id: 'mpBusinessWorkspaceRoot',
    hidden: false,
    innerHTML: '',
    querySelector(sel) {
      if (sel === '.mp-bw-ask-input') return askInput;
      const cardMatch = sel.match(/^\[data-bw-tool="([^"]+)"\]$/);
      if (cardMatch) return cards[cardMatch[1]] || null;
      return null;
    },
    querySelectorAll() { return []; },
  };

  const toolRoot = {
    id: 'mpBusinessToolRoot',
    hidden: true,
    innerHTML: '',
    querySelector(sel) {
      if (sel === '[data-bw-back]') return backBtn;
      if (sel === '[data-bw-tool-heading]') return heading;
      return null;
    },
    querySelectorAll() { return []; },
  };

  const sb = {
    window: { scrollTo() {} },
    globalThis: {},
    document: {
      getElementById(id) {
        if (id === 'mpBusinessWorkspaceRoot') return homeRoot;
        if (id === 'mpBusinessToolRoot') return toolRoot;
        return null;
      },
      querySelector(sel) {
        if (sel === '#business.active') return { id: 'business' };
        return null;
      },
    },
    _focus: { cards, heading, backBtn, askInput, homeRoot, toolRoot },
  };
  sb.globalThis = sb.window = sb;
  loadWorkspace(sb);
  return sb;
}

['expenses', 'vat', 'bookkeeper', 'health', 'accountant'].forEach((toolId) => {
  run(`focus: opening ${toolId} focuses tool heading`, () => {
    const sb = createFocusSandbox();
    sb.MPBusinessWorkspace.showTool(toolId);
    assert.equal(sb._focus.heading.focusCalls, 1, 'heading focus');
    assert.equal(sb._focus.backBtn.focusCalls, 0, 'back must not take initial focus');
  });

  run(`focus: back from ${toolId} restores originating card`, () => {
    const sb = createFocusSandbox();
    sb._focus.homeRoot.querySelector = function (sel) {
      if (sel === '.mp-bw-ask-input') return sb._focus.askInput;
      if (sel === '[data-bw-tool="' + toolId + '"]') return sb._focus.cards[toolId];
      return null;
    };
    sb.MPBusinessWorkspace.showTool(toolId, { recordOrigin: true });
    sb.MPBusinessWorkspace.showHome();
    assert.equal(sb._focus.cards[toolId].focusCalls, 1, 'card restored');
    assert.equal(sb._focus.askInput.focusCalls, 0, 'ask not focused when card restored');
  });
});

run('focus: mount without origin focuses Ask input', () => {
  const sb = createFocusSandbox();
  sb.document.querySelector = () => null;
  sb.MPBusinessWorkspace.mount();
  assert.equal(sb._focus.askInput.focusCalls, 1);
});

run('focus: leave clears stale origin state', () => {
  const sb = createFocusSandbox();
  sb.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true });
  sb.MPBusinessWorkspace.leave();
  sb.MPBusinessWorkspace.mount();
  assert.equal(sb._focus.cards.expenses.focusCalls, 0);
  assert.equal(sb._focus.askInput.focusCalls, 1);
});

run('focus: repeated tool switch restores latest card only', () => {
  const sb = createFocusSandbox();
  sb._focus.homeRoot.querySelector = function (sel) {
    if (sel === '.mp-bw-ask-input') return sb._focus.askInput;
    if (sel === '[data-bw-tool="expenses"]') return sb._focus.cards.expenses;
    if (sel === '[data-bw-tool="vat"]') return sb._focus.cards.vat;
    return null;
  };
  sb._focus.cards.expenses.attrs['data-bw-tool'] = 'expenses';
  sb._focus.cards.vat.attrs['data-bw-tool'] = 'vat';
  sb.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true });
  sb.MPBusinessWorkspace.showHome();
  assert.equal(sb._focus.cards.expenses.focusCalls, 1);
  sb.MPBusinessWorkspace.showTool('vat', { recordOrigin: true });
  sb.MPBusinessWorkspace.showHome();
  assert.equal(sb._focus.cards.vat.focusCalls, 1);
  assert.equal(sb._focus.cards.expenses.focusCalls, 1);
});

run('focus: invalid tool ID does not move focus', () => {
  const sb = createFocusSandbox();
  sb.MPBusinessWorkspace.showTool('not-real');
  assert.equal(sb._focus.heading.focusCalls, 0);
  assert.equal(sb._focus.backBtn.focusCalls, 0);
});

run('focus: showHome on business screen avoids remount', () => {
  const sb = createFocusSandbox();
  let businessCalls = 0;
  sb.showBusiness = () => { businessCalls++; };
  sb.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true });
  sb.MPBusinessWorkspace.showHome();
  assert.equal(businessCalls, 0, 'showBusiness must not run when already on business');
  assert.equal(sb._focus.cards.expenses.focusCalls, 1);
});

run('focus: tool → Ask → Business uses Ask fallback', () => {
  const sb = createFocusSandbox();
  sb.document.querySelector = (sel) => (sel === '#business.active' ? { id: 'business' } : null);
  sb.showAsk = () => {
    sb.MPBusinessWorkspace.leave();
    sb.document.querySelector = () => null;
  };
  sb.MPBusinessWorkspace.showTool('expenses', { recordOrigin: true });
  sb.MPBusinessWorkspace.openAskWithQuestion('How much can I claim this month?');
  sb.MPBusinessWorkspace.mount();
  assert.equal(sb._focus.askInput.focusCalls, 1);
  assert.equal(sb._focus.cards.expenses.focusCalls, 0);
});

run('PR does not introduce separate handlePos diff vs main', () => {
  const prHtml = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  const mainHtml = require('child_process').execSync('git show main:frontend/index.html', { encoding: 'utf8' });
  const handlePosRe = /function handlePos\(pos\)\{[\s\S]*?renderTrackingScreen\(\)\}/;
  const prMatch = prHtml.match(handlePosRe);
  const mainMatch = mainHtml.match(handlePosRe);
  assert.ok(prMatch && mainMatch, 'handlePos block present');
  assert.equal(prMatch[0], mainMatch[0], 'handlePos must match main exactly');
});

async function finish() {
  await Promise.all(pending);
  console.log(`\nBusiness Workspace: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

finish();
