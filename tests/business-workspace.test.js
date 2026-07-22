/**
 * MP-S6-001 — Business Workspace foundation tests
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function run(name, fn) {
  try {
    fn();
    console.log('✓ ' + name);
    passed++;
  } catch (e) {
    console.error('✗ ' + name);
    console.error('  ' + e.message);
    failed++;
  }
}

function loadWorkspace(sandbox) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-view.js'), 'utf8'), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace.js'), 'utf8'), sandbox);
}

run('models define schema version 1', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8'), sb);
  assert.equal(sb.MPBusinessWorkspaceModels.SCHEMA_VERSION, 1);
  assert.equal(sb.MPBusinessWorkspaceModels.expenseShape().schemaVersion, 1);
  assert.equal(sb.MPBusinessWorkspaceModels.vatRecordShape().status, 'draft');
});

run('five business tools registered', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  assert.equal(sb.MPBusinessWorkspace.getTools().length, 5);
  assert.ok(sb.MPBusinessWorkspace.getTool('expenses'));
  assert.ok(sb.MPBusinessWorkspace.getTool('vat'));
  assert.ok(sb.MPBusinessWorkspace.getTool('bookkeeper'));
  assert.ok(sb.MPBusinessWorkspace.getTool('health'));
  assert.ok(sb.MPBusinessWorkspace.getTool('accountant'));
});

run('features not connected in sprint 1', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  assert.equal(sb.MPBusinessWorkspace.isConnected('expenses'), false);
  assert.equal(sb.MPBusinessWorkspace.isConnected('vat'), false);
});

run('home view includes Ask embed and business tools', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderHome(sb.MPBusinessWorkspace.getTools());
  assert.ok(html.includes('Ask MilePilot'));
  assert.ok(html.includes('What would you like help with today?'));
  assert.ok(html.includes('How much can I claim this month?'));
  assert.ok(html.includes('Business Tools'));
  assert.ok(html.includes('Recent Activity'));
  assert.ok(html.includes('Coming Next'));
  assert.ok(html.includes('data-bw-tool="expenses"'));
  assert.ok(!html.includes('lorem ipsum'));
});

run('tool cards have no fake metrics', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  const html = sb.MPBusinessWorkspaceView.renderHome(sb.MPBusinessWorkspace.getTools());
  assert.ok(!html.includes('£'));
  assert.ok(!html.includes('mp-bw-stat__value'));
});

run('expenses empty state premium copy', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  const tool = sb.MPBusinessWorkspace.getTool('expenses');
  const html = sb.MPBusinessWorkspaceView.renderToolEmpty(tool);
  assert.ok(html.includes('Expenses'));
  assert.ok(html.includes('scan receipts'));
  assert.ok(html.includes('Coming Soon'));
  assert.ok(!html.includes('under construction'));
});

run('workspace components exported', () => {
  const sb = { window: {}, globalThis: {}, document: {} };
  sb.globalThis = sb;
  sb.window = sb;
  loadWorkspace(sb);
  const V = sb.MPBusinessWorkspaceView;
  assert.ok(typeof V.WorkspaceHeader === 'function');
  assert.ok(typeof V.WorkspaceCard === 'function');
  assert.ok(typeof V.WorkspaceSection === 'function');
  assert.ok(typeof V.WorkspaceEmptyState === 'function');
  assert.ok(typeof V.WorkspaceBadge === 'function');
  assert.ok(typeof V.WorkspaceStat === 'function');
  assert.ok(typeof V.WorkspaceDivider === 'function');
  assert.ok(typeof V.WorkspaceSkeleton === 'function');
});

run('production index wires business workspace', () => {
  const html = fs.readFileSync(path.join(root, 'frontend/index.html'), 'utf8');
  assert.ok(html.includes('id="business"'));
  assert.ok(html.includes('showBusiness()'));
  assert.ok(html.includes('business-workspace.js'));
  assert.ok(html.includes('navBusiness'));
  assert.ok(html.includes('business-workspace.css'));
});

run('ask service files unchanged in sprint branch', () => {
  const service = fs.readFileSync(path.join(root, 'frontend/js/ask-milepilot-service.js'), 'utf8');
  assert.ok(service.includes('NotConnected'));
  assert.ok(!service.includes('MPBusinessWorkspace'));
});

console.log(`\nBusiness Workspace: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
