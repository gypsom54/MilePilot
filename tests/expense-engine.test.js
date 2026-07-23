/**
 * MP-S6-002 — Expense Engine repository tests
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

function createMockLocalStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    },
  };
}

function loadEngine(storage) {
  const sb = {
    window: {},
    globalThis: {},
    localStorage: storage,
    Date: Date,
    Math: Math,
    Number: Number,
    String: String,
    Array: Array,
    Object: Object,
    JSON: JSON,
    isFinite: isFinite,
  };
  sb.window = sb;
  sb.globalThis = sb;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/business-workspace-models.js'), 'utf8'), sb);
  vm.runInNewContext(fs.readFileSync(path.join(root, 'frontend/js/expense-engine.js'), 'utf8'), sb);
  return sb.MPExpenseEngine;
}

run('engine exposes schema and categories', () => {
  const E = loadEngine(createMockLocalStorage());
  assert.equal(E.SCHEMA_VERSION, 1);
  assert.ok(E.DEFAULT_CATEGORIES.includes('Fuel'));
  assert.ok(E.DEFAULT_CATEGORIES.includes('Other'));
  assert.equal(E.VAT_STATUS.UNKNOWN, 'unknown');
});

run('categories are configurable', () => {
  const storage = createMockLocalStorage();
  const E = loadEngine(storage);
  const res = E.addCategory('Custom Category');
  assert.equal(res.ok, true);
  assert.ok(E.getCategories().includes('Custom Category'));
  const bad = E.removeCategory('Fuel');
  assert.equal(bad.ok, true);
  assert.ok(!E.getCategories().includes('Fuel'));
});

run('create validates required fields', () => {
  const E = loadEngine(createMockLocalStorage());
  const bad = E.createExpense({ amountPence: -5 });
  assert.equal(bad.ok, false);
  assert.ok(bad.errors.length > 0);
});

run('CRUD create read update delete', () => {
  const E = loadEngine(createMockLocalStorage());
  const created = E.createExpense({
    amountPence: 1250,
    category: 'Fuel',
    supplier: 'Shell',
    description: 'Diesel fill-up',
    incurredISO: '2026-06-15T10:00:00.000Z',
    vatStatus: 'included',
    vatAmountPence: 208,
    businessPercentage: 100,
    tags: ['vehicle'],
  });
  assert.equal(created.ok, true);
  const id = created.expense.id;
  const loaded = E.getExpenseById(id);
  assert.equal(loaded.amountPence, 1250);
  assert.equal(loaded.supplier, 'Shell');
  assert.equal(loaded.vatStatus, 'included');
  assert.equal(loaded.tags[0], 'vehicle');
  const updated = E.updateExpense(id, { description: 'Updated', amountPence: 1300 });
  assert.equal(updated.ok, true);
  assert.equal(E.getExpenseById(id).amountPence, 1300);
  const archived = E.archiveExpense(id);
  assert.equal(archived.ok, true);
  assert.equal(E.loadExpenses().length, 0);
  assert.equal(E.loadExpenses({ includeArchived: true }).length, 1);
  const deleted = E.deleteExpense(id);
  assert.equal(deleted.ok, true);
  assert.equal(E.loadExpenses({ includeArchived: true }).length, 0);
  assert.equal(E.getExpenseById(id, { includeDeleted: true, includeArchived: true }).deleted, true);
});

run('soft delete and restore', () => {
  const E = loadEngine(createMockLocalStorage());
  const created = E.createExpense({ amountPence: 500, category: 'Parking', incurredISO: '2026-06-01T00:00:00.000Z' });
  const id = created.expense.id;
  E.deleteExpense(id);
  assert.equal(E.loadExpenses().length, 0);
  E.restoreExpense(id);
  assert.equal(E.loadExpenses().length, 1);
});

run('search by category supplier description tag date amount', () => {
  const E = loadEngine(createMockLocalStorage());
  E.createExpense({
    amountPence: 1000,
    category: 'Software',
    supplier: 'Adobe',
    description: 'Creative Cloud',
    tags: ['subscription'],
    incurredISO: '2026-06-10T12:00:00.000Z',
  });
  E.createExpense({
    amountPence: 2500,
    category: 'Fuel',
    supplier: 'BP',
    description: 'Motorway diesel',
    tags: ['travel'],
    incurredISO: '2026-06-20T12:00:00.000Z',
  });
  assert.equal(E.searchExpenses({ category: 'Fuel' }).length, 1);
  assert.equal(E.searchExpenses({ supplier: 'adobe' }).length, 1);
  assert.equal(E.searchExpenses({ description: 'motorway' }).length, 1);
  assert.equal(E.searchExpenses({ tag: 'subscription' }).length, 1);
  assert.equal(E.searchExpenses({ amountMinPence: 2000 }).length, 1);
  assert.equal(E.searchExpenses({ dateFrom: '2026-06-15', dateTo: '2026-06-30' }).length, 1);
});

run('sorting by amount and date', () => {
  const E = loadEngine(createMockLocalStorage());
  E.createExpense({ amountPence: 300, category: 'Other', incurredISO: '2026-06-01T00:00:00.000Z' });
  E.createExpense({ amountPence: 900, category: 'Other', incurredISO: '2026-06-03T00:00:00.000Z' });
  const byAmount = E.searchExpenses({ sortBy: 'amount', sortDir: 'desc' });
  assert.equal(byAmount[0].amountPence, 900);
  const byDate = E.searchExpenses({ sortBy: 'date', sortDir: 'asc' });
  assert.equal(byDate[0].amountPence, 300);
});

run('statistics with no fake seed data', () => {
  const E = loadEngine(createMockLocalStorage());
  const empty = E.getStatistics({ asOf: '2026-06-30T12:00:00.000Z' });
  assert.equal(empty.expenseCount, 0);
  assert.equal(empty.monthlySpendPence, 0);
  assert.equal(empty.yearlySpendPence, 0);
  assert.equal(empty.pendingReceipts, 0);
  E.createExpense({
    amountPence: 2000,
    category: 'Tools',
    incurredISO: '2026-06-28T09:00:00.000Z',
    businessPercentage: 50,
  });
  const stats = E.getStatistics({ asOf: '2026-06-30T12:00:00.000Z' });
  assert.equal(stats.expenseCount, 1);
  assert.equal(stats.monthlySpendPence, 1000);
  assert.equal(stats.yearlySpendPence, 1000);
  assert.equal(stats.categoryTotalsPence.Tools, 1000);
  assert.equal(stats.pendingReceipts, 1);
});

run('attachments metadata only', () => {
  const E = loadEngine(createMockLocalStorage());
  const created = E.createExpense({ amountPence: 999, category: 'Office', incurredISO: '2026-06-01T00:00:00.000Z' });
  const id = created.expense.id;
  const att = E.addAttachment(id, { fileName: 'receipt.jpg', mimeType: 'image/jpeg', sizeBytes: 12000 });
  assert.equal(att.ok, true);
  assert.equal(E.getAttachments(id).length, 1);
  E.removeAttachment(id, att.expense.attachments[0].id);
  assert.equal(E.getAttachments(id).length, 0);
});

run('vat status stored not calculated', () => {
  const E = loadEngine(createMockLocalStorage());
  const created = E.createExpense({
    amountPence: 1200,
    category: 'Meals',
    vatStatus: 'mixed',
    vatAmountPence: 200,
    incurredISO: '2026-06-01T00:00:00.000Z',
  });
  assert.equal(created.expense.vatStatus, 'mixed');
  assert.equal(created.expense.vatAmountPence, 200);
});

run('migration normalises legacy shape', () => {
  const storage = createMockLocalStorage();
  storage.setItem(
    'mp_expenses',
    JSON.stringify([
      {
        id: 'legacy_1',
        supplierId: 'sup_old',
        amountPence: 450,
        currency: 'GBP',
        category: 'Fuel',
        description: 'Legacy',
        incurredISO: '2026-05-01T00:00:00.000Z',
        receiptId: 'rcpt_1',
        status: 'confirmed',
        schemaVersion: 1,
      },
    ])
  );
  storage.removeItem('mp_expense_meta');
  const E = loadEngine(storage);
  const exp = E.getExpenseById('legacy_1');
  assert.ok(exp, 'legacy expense should load');
  assert.equal(exp.businessId, 'default');
  assert.equal(exp.receiptReference, 'rcpt_1');
  assert.equal(exp.supplierId, 'sup_old');
});

run('totalSpentPence query API for future Ask', () => {
  const E = loadEngine(createMockLocalStorage());
  E.createExpense({ amountPence: 1000, category: 'Fuel', incurredISO: '2026-06-05T00:00:00.000Z' });
  E.createExpense({ amountPence: 500, category: 'Parking', incurredISO: '2026-06-25T00:00:00.000Z' });
  const total = E.totalSpentPence('2026-06-01T00:00:00.000Z', '2026-06-30T23:59:59.999Z');
  assert.equal(total, 1500);
  const fuel = E.totalSpentPence('2026-06-01T00:00:00.000Z', '2026-06-30T23:59:59.999Z', { category: 'Fuel' });
  assert.equal(fuel, 1000);
});

run('persistence round-trip via localStorage key mp_expenses', () => {
  const storage = createMockLocalStorage();
  const E = loadEngine(storage);
  E.createExpense({ amountPence: 777, category: 'Internet', incurredISO: '2026-06-12T00:00:00.000Z' });
  assert.ok(storage.getItem('mp_expenses'));
  const E2 = loadEngine(storage);
  assert.equal(E2.loadExpenses().length, 1);
  assert.equal(E2.loadExpenses()[0].amountPence, 777);
});

run('deploy mirror expense-engine hash parity', () => {
  const a = path.join(root, 'frontend/js/expense-engine.js');
  const b = path.join(root, 'milepilot-upload-v2/js/expense-engine.js');
  if (!fs.existsSync(b)) {
    throw new Error('milepilot-upload-v2 mirror missing expense-engine.js — sync before release');
  }
  const ha = fs.readFileSync(a);
  const hb = fs.readFileSync(b);
  assert.equal(ha.length, hb.length);
});

console.log(`\nExpense engine: ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
