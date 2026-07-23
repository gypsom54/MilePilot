/**
 * MP-S6-002 — Expense Engine Foundation
 * Permanent expense subsystem: store, repository, validation, search, statistics.
 * No OCR, AI, or VAT calculation — storage and query only.
 */
(function (global) {
  'use strict';

  var SCHEMA_VERSION = 1;

  var STORAGE = {
    expenses: 'mp_expenses',
    categories: 'mp_expense_categories',
    meta: 'mp_expense_meta',
  };

  var VAT_STATUS = {
    UNKNOWN: 'unknown',
    INCLUDED: 'included',
    EXCLUDED: 'excluded',
    MIXED: 'mixed',
  };

  var EXPENSE_STATUS = {
    DRAFT: 'draft',
    CONFIRMED: 'confirmed',
    PENDING_RECEIPT: 'pending_receipt',
  };

  var DEFAULT_CATEGORIES = [
    'Fuel',
    'Parking',
    'Vehicle',
    'Tools',
    'Equipment',
    'Office',
    'Travel',
    'Meals',
    'Accommodation',
    'Subscriptions',
    'Software',
    'Telephone',
    'Internet',
    'Marketing',
    'Professional Fees',
    'Training',
    'Insurance',
    'Other',
  ];

  var SORT_FIELDS = ['date', 'amount', 'category', 'supplier', 'created', 'updated'];

  function storage() {
    return global.localStorage;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function newId(prefix) {
    return (prefix || 'exp') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  }

  function getDefaultBusinessId() {
    try {
      return storage().getItem('mp_business_id') || 'default';
    } catch (e) {
      return 'default';
    }
  }

  function normaliseTagList(tags) {
    if (!tags) return [];
    if (!Array.isArray(tags)) return [];
    return tags
      .map(function (t) {
        return String(t || '')
          .trim()
          .toLowerCase();
      })
      .filter(Boolean);
  }

  function normaliseExpense(raw) {
    raw = raw || {};
    var amount = Math.round(Number(raw.amountPence != null ? raw.amountPence : raw.amount) || 0);
    var vatAmount = Math.round(Number(raw.vatAmountPence != null ? raw.vatAmountPence : raw.vatAmount) || 0);
    var businessPct = Number(raw.businessPercentage);
    if (!isFinite(businessPct)) businessPct = 100;
    businessPct = Math.max(0, Math.min(100, Math.round(businessPct)));
    var vatStatus = String(raw.vatStatus || VAT_STATUS.UNKNOWN).toLowerCase();
    var allowedVat = [VAT_STATUS.UNKNOWN, VAT_STATUS.INCLUDED, VAT_STATUS.EXCLUDED, VAT_STATUS.MIXED];
    if (allowedVat.indexOf(vatStatus) < 0) vatStatus = VAT_STATUS.UNKNOWN;
    var status = String(raw.status || EXPENSE_STATUS.DRAFT).toLowerCase();
    if ([EXPENSE_STATUS.DRAFT, EXPENSE_STATUS.CONFIRMED, EXPENSE_STATUS.PENDING_RECEIPT].indexOf(status) < 0) {
      status = EXPENSE_STATUS.DRAFT;
    }
    var incurredISO = raw.incurredISO || raw.dateISO || raw.createdISO || nowISO();
    var createdISO = raw.createdISO || incurredISO;
    var updatedISO = raw.updatedISO || createdISO;
    var supplier = String(raw.supplier || raw.supplierName || '').trim();
    var supplierId = String(raw.supplierId || '').trim();
    var attachments = Array.isArray(raw.attachments)
      ? raw.attachments.map(normaliseAttachment).filter(Boolean)
      : [];
    return {
      id: raw.id || newId('exp'),
      businessId: String(raw.businessId || getDefaultBusinessId()),
      createdISO: createdISO,
      updatedISO: updatedISO,
      incurredISO: incurredISO,
      amountPence: amount,
      currency: String(raw.currency || 'GBP').toUpperCase(),
      category: String(raw.category || 'Other').trim() || 'Other',
      supplier: supplier,
      supplierId: supplierId,
      description: String(raw.description || '').trim(),
      receiptReference: String(raw.receiptReference || raw.receiptId || '').trim(),
      vatStatus: vatStatus,
      vatAmountPence: vatAmount,
      businessPercentage: businessPct,
      notes: String(raw.notes || '').trim(),
      tags: normaliseTagList(raw.tags),
      status: status,
      attachments: attachments,
      archived: !!raw.archived,
      deleted: !!raw.deleted,
      schemaVersion: Number(raw.schemaVersion) || SCHEMA_VERSION,
    };
  }

  function normaliseAttachment(raw) {
    if (!raw) return null;
    return {
      id: raw.id || newId('att'),
      fileName: String(raw.fileName || '').trim(),
      mimeType: String(raw.mimeType || '').trim(),
      sizeBytes: Math.max(0, Math.round(Number(raw.sizeBytes) || 0)),
      addedISO: raw.addedISO || nowISO(),
      imageRef: raw.imageRef ? String(raw.imageRef) : undefined,
      schemaVersion: SCHEMA_VERSION,
    };
  }

  function validateExpense(expense, opts) {
    opts = opts || {};
    var errors = [];
    if (!expense || typeof expense !== 'object') {
      return { ok: false, errors: ['Expense must be an object'] };
    }
    if (!expense.id) errors.push('id is required');
    if (!expense.businessId) errors.push('businessId is required');
    if (!Number.isFinite(expense.amountPence) || expense.amountPence < 0) {
      errors.push('amountPence must be a non-negative integer');
    }
    if (!expense.currency || expense.currency.length !== 3) {
      errors.push('currency must be a 3-letter code');
    }
    if (!expense.category) errors.push('category is required');
    if (!expense.incurredISO && !expense.createdISO) errors.push('incurred date is required');
    var cats = getCategories();
    if (expense.category && cats.indexOf(expense.category) < 0 && !opts.allowUnknownCategory) {
      errors.push('category is not in the configured list');
    }
    var vatStatuses = [VAT_STATUS.UNKNOWN, VAT_STATUS.INCLUDED, VAT_STATUS.EXCLUDED, VAT_STATUS.MIXED];
    if (vatStatuses.indexOf(expense.vatStatus) < 0) errors.push('invalid vatStatus');
    if (!Number.isFinite(expense.businessPercentage) || expense.businessPercentage < 0 || expense.businessPercentage > 100) {
      errors.push('businessPercentage must be between 0 and 100');
    }
    if (!Number.isFinite(expense.vatAmountPence) || expense.vatAmountPence < 0) {
      errors.push('vatAmountPence must be a non-negative integer');
    }
    return { ok: errors.length === 0, errors: errors };
  }

  function loadMeta() {
    try {
      var raw = storage().getItem(STORAGE.meta);
      if (!raw) return { schemaVersion: SCHEMA_VERSION, migratedAt: null };
      var meta = JSON.parse(raw);
      return {
        schemaVersion: Number(meta.schemaVersion) || SCHEMA_VERSION,
        migratedAt: meta.migratedAt || null,
      };
    } catch (e) {
      return { schemaVersion: SCHEMA_VERSION, migratedAt: null };
    }
  }

  function saveMeta(meta) {
    try {
      storage().setItem(STORAGE.meta, JSON.stringify(meta));
      return true;
    } catch (e) {
      return false;
    }
  }

  function migrateLegacyExpense(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.schemaVersion >= SCHEMA_VERSION && raw.businessId) return normaliseExpense(raw);
    return normaliseExpense({
      id: raw.id,
      businessId: raw.businessId || getDefaultBusinessId(),
      createdISO: raw.createdISO,
      updatedISO: raw.updatedISO,
      amountPence: raw.amountPence,
      currency: raw.currency,
      category: raw.category,
      supplier: raw.supplier,
      supplierId: raw.supplierId,
      description: raw.description,
      receiptReference: raw.receiptReference || raw.receiptId,
      vatStatus: raw.vatStatus,
      vatAmountPence: raw.vatAmountPence,
      businessPercentage: raw.businessPercentage,
      notes: raw.notes,
      tags: raw.tags,
      status: raw.status,
      attachments: raw.attachments,
      archived: raw.archived,
      deleted: raw.deleted,
      incurredISO: raw.incurredISO,
      schemaVersion: SCHEMA_VERSION,
    });
  }

  function migrateStorage() {
    var meta = loadMeta();
    if (meta.migratedAt && meta.schemaVersion >= SCHEMA_VERSION) return { migrated: false, count: 0 };
    var list = loadExpensesRaw();
    var migrated = list.map(migrateLegacyExpense).filter(Boolean);
    saveExpensesRaw(migrated);
    meta.schemaVersion = SCHEMA_VERSION;
    meta.migratedAt = nowISO();
    saveMeta(meta);
    return { migrated: true, count: migrated.length };
  }

  function loadExpensesRaw() {
    try {
      return JSON.parse(storage().getItem(STORAGE.expenses) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveExpensesRaw(list) {
    try {
      storage().setItem(STORAGE.expenses, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function loadExpenses(opts) {
    opts = opts || {};
    migrateStorage();
    var includeDeleted = !!opts.includeDeleted;
    var includeArchived = !!opts.includeArchived;
    return loadExpensesRaw()
      .map(function (raw) {
        return normaliseExpense(raw);
      })
      .filter(function (exp) {
        if (!includeDeleted && exp.deleted) return false;
        if (!includeArchived && exp.archived) return false;
        if (opts.businessId && exp.businessId !== opts.businessId) return false;
        return true;
      });
  }

  function saveExpenses(expenses) {
    var list = (expenses || []).map(function (e) {
      return normaliseExpense(e);
    });
    return saveExpensesRaw(list);
  }

  function getExpenseById(id, opts) {
    if (!id) return null;
    opts = opts || {};
    var list = loadExpensesRaw().map(normaliseExpense);
    for (var i = 0; i < list.length; i++) {
      var exp = list[i];
      if (exp.id !== id) continue;
      if (!opts.includeDeleted && exp.deleted) return null;
      if (!opts.includeArchived && exp.archived) return null;
      if (opts.businessId && exp.businessId !== opts.businessId) return null;
      return exp;
    }
    return null;
  }

  function replaceExpenseInStore(expense) {
    var all = loadExpensesRaw().map(normaliseExpense);
    var found = false;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === expense.id) {
        all[i] = expense;
        found = true;
        break;
      }
    }
    if (!found) all.push(expense);
    saveExpensesRaw(all);
    return expense;
  }

  function createExpense(input) {
    var expense = normaliseExpense(input || {});
    expense.id = expense.id || newId('exp');
    expense.createdISO = nowISO();
    expense.updatedISO = expense.createdISO;
    if (!expense.incurredISO) expense.incurredISO = expense.createdISO;
    var validation = validateExpense(expense);
    if (!validation.ok) {
      return { ok: false, errors: validation.errors, expense: null };
    }
    replaceExpenseInStore(expense);
    return { ok: true, errors: [], expense: expense };
  }

  function updateExpense(id, patch) {
    var existing = getExpenseById(id, { includeDeleted: true, includeArchived: true });
    if (!existing) return { ok: false, errors: ['Expense not found'], expense: null };
    var merged = normaliseExpense(Object.assign({}, existing, patch || {}, { id: id, updatedISO: nowISO() }));
    var validation = validateExpense(merged);
    if (!validation.ok) return { ok: false, errors: validation.errors, expense: null };
    replaceExpenseInStore(merged);
    return { ok: true, errors: [], expense: merged };
  }

  function archiveExpense(id) {
    return updateExpense(id, { archived: true });
  }

  function unarchiveExpense(id) {
    return updateExpense(id, { archived: false });
  }

  function deleteExpense(id, opts) {
    opts = opts || {};
    if (opts.hard) {
      var all = loadExpensesRaw()
        .map(normaliseExpense)
        .filter(function (e) {
          return e.id !== id;
        });
      saveExpensesRaw(all);
      return { ok: true, errors: [], expense: null };
    }
    return updateExpense(id, { deleted: true });
  }

  function restoreExpense(id) {
    return updateExpense(id, { deleted: false });
  }

  function loadCategoryConfig() {
    try {
      var raw = storage().getItem(STORAGE.categories);
      if (!raw) return DEFAULT_CATEGORIES.slice();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return DEFAULT_CATEGORIES.slice();
      return parsed
        .map(function (c) {
          return String(c || '').trim();
        })
        .filter(Boolean);
    } catch (e) {
      return DEFAULT_CATEGORIES.slice();
    }
  }

  function saveCategoryConfig(categories) {
    try {
      storage().setItem(STORAGE.categories, JSON.stringify(categories));
      return true;
    } catch (e) {
      return false;
    }
  }

  function getCategories() {
    return loadCategoryConfig();
  }

  function setCategories(categories) {
    var list = (categories || [])
      .map(function (c) {
        return String(c || '').trim();
      })
      .filter(Boolean);
    if (!list.length) return { ok: false, errors: ['At least one category is required'] };
    saveCategoryConfig(list);
    return { ok: true, errors: [], categories: list };
  }

  function addCategory(name) {
    name = String(name || '').trim();
    if (!name) return { ok: false, errors: ['Category name is required'] };
    var cats = getCategories();
    if (cats.indexOf(name) >= 0) return { ok: true, errors: [], categories: cats };
    cats.push(name);
    return setCategories(cats);
  }

  function removeCategory(name) {
    name = String(name || '').trim();
    var cats = getCategories().filter(function (c) {
      return c !== name;
    });
    if (!cats.length) return { ok: false, errors: ['Cannot remove the last category'] };
    return setCategories(cats);
  }

  function parseDateStart(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function parseDateEnd(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    d.setHours(23, 59, 59, 999);
    return d;
  }

  function matchesQuery(expense, query) {
    query = query || {};
    if (query.businessId && expense.businessId !== query.businessId) return false;
    if (query.category && expense.category !== query.category) return false;
    if (query.categories && query.categories.length && query.categories.indexOf(expense.category) < 0) return false;
    if (query.supplier) {
      var sup = query.supplier.toLowerCase();
      if (expense.supplier.toLowerCase().indexOf(sup) < 0 && expense.supplierId.toLowerCase().indexOf(sup) < 0) {
        return false;
      }
    }
    if (query.description) {
      var desc = query.description.toLowerCase();
      if (expense.description.toLowerCase().indexOf(desc) < 0 && expense.notes.toLowerCase().indexOf(desc) < 0) {
        return false;
      }
    }
    if (query.tag) {
      var tag = String(query.tag).toLowerCase();
      if (expense.tags.indexOf(tag) < 0) return false;
    }
    if (query.status && expense.status !== query.status) return false;
    if (query.vatStatus && expense.vatStatus !== query.vatStatus) return false;
    if (query.archived != null && !!expense.archived !== !!query.archived) return false;
    if (query.dateFrom) {
      var from = parseDateStart(query.dateFrom);
      var incurred = new Date(expense.incurredISO || expense.createdISO);
      if (from && incurred < from) return false;
    }
    if (query.dateTo) {
      var to = parseDateEnd(query.dateTo);
      var incurredTo = new Date(expense.incurredISO || expense.createdISO);
      if (to && incurredTo > to) return false;
    }
    if (query.amountMinPence != null && expense.amountPence < query.amountMinPence) return false;
    if (query.amountMaxPence != null && expense.amountPence > query.amountMaxPence) return false;
    if (query.text) {
      var t = String(query.text).toLowerCase();
      var hay =
        expense.description +
        ' ' +
        expense.supplier +
        ' ' +
        expense.category +
        ' ' +
        expense.notes +
        ' ' +
        expense.receiptReference +
        ' ' +
        expense.tags.join(' ');
      if (hay.toLowerCase().indexOf(t) < 0) return false;
    }
    return true;
  }

  function searchExpenses(query, opts) {
    opts = opts || {};
    var list = loadExpenses(opts);
    var filtered = list.filter(function (exp) {
      return matchesQuery(exp, query);
    });
    return sortExpenses(filtered, query.sortBy, query.sortDir);
  }

  function sortExpenses(expenses, sortBy, sortDir) {
    var field = SORT_FIELDS.indexOf(sortBy) >= 0 ? sortBy : 'date';
    var dir = sortDir === 'asc' ? 1 : -1;
    return (expenses || []).slice().sort(function (a, b) {
      var av;
      var bv;
      if (field === 'amount') {
        av = a.amountPence;
        bv = b.amountPence;
      } else if (field === 'category') {
        av = a.category;
        bv = b.category;
      } else if (field === 'supplier') {
        av = a.supplier;
        bv = b.supplier;
      } else if (field === 'created') {
        av = new Date(a.createdISO).getTime();
        bv = new Date(b.createdISO).getTime();
      } else if (field === 'updated') {
        av = new Date(a.updatedISO).getTime();
        bv = new Date(b.updatedISO).getTime();
      } else {
        av = new Date(a.incurredISO || a.createdISO).getTime();
        bv = new Date(b.incurredISO || b.createdISO).getTime();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }

  function businessAmountPence(expense) {
    return Math.round((expense.amountPence * expense.businessPercentage) / 100);
  }

  function monthKey(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  function yearKey(date) {
    return String(date.getFullYear());
  }

  function getStatistics(opts) {
    opts = opts || {};
    var now = opts.asOf ? new Date(opts.asOf) : new Date();
    var monthK = monthKey(now);
    var yearK = yearKey(now);
    var list = loadExpenses(opts);
    var stats = {
      expenseCount: list.length,
      monthlySpendPence: 0,
      yearlySpendPence: 0,
      categoryTotalsPence: {},
      pendingReceipts: 0,
      asOfISO: now.toISOString(),
    };
    list.forEach(function (exp) {
      var amt = businessAmountPence(exp);
      var incurred = new Date(exp.incurredISO || exp.createdISO);
      if (monthKey(incurred) === monthK) stats.monthlySpendPence += amt;
      if (yearKey(incurred) === yearK) stats.yearlySpendPence += amt;
      if (!stats.categoryTotalsPence[exp.category]) stats.categoryTotalsPence[exp.category] = 0;
      stats.categoryTotalsPence[exp.category] += amt;
      if (!exp.receiptReference && exp.attachments.length === 0) stats.pendingReceipts++;
    });
    return stats;
  }

  function addAttachment(expenseId, attachment) {
    var exp = getExpenseById(expenseId, { includeDeleted: true, includeArchived: true });
    if (!exp) return { ok: false, errors: ['Expense not found'], expense: null };
    var att = normaliseAttachment(attachment);
    var attachments = exp.attachments.slice();
    attachments.push(att);
    return updateExpense(expenseId, { attachments: attachments });
  }

  function removeAttachment(expenseId, attachmentId) {
    var exp = getExpenseById(expenseId, { includeDeleted: true, includeArchived: true });
    if (!exp) return { ok: false, errors: ['Expense not found'], expense: null };
    var attachments = exp.attachments.filter(function (a) {
      return a.id !== attachmentId;
    });
    return updateExpense(expenseId, { attachments: attachments });
  }

  function getAttachments(expenseId) {
    var exp = getExpenseById(expenseId);
    return exp ? exp.attachments.slice() : [];
  }

  function isEngineReady() {
    return true;
  }

  function totalSpentPence(startISO, endISO, opts) {
    var query = { dateFrom: startISO, dateTo: endISO };
    if (opts && opts.businessId) query.businessId = opts.businessId;
    if (opts && opts.category) query.category = opts.category;
    var list = searchExpenses(query, opts);
    return list.reduce(function (sum, exp) {
      return sum + businessAmountPence(exp);
    }, 0);
  }

  function init() {
    migrateStorage();
    if (!storage().getItem(STORAGE.categories)) {
      saveCategoryConfig(DEFAULT_CATEGORIES.slice());
    }
  }

  init();

  global.MPExpenseEngine = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    STORAGE: STORAGE,
    VAT_STATUS: VAT_STATUS,
    EXPENSE_STATUS: EXPENSE_STATUS,
    DEFAULT_CATEGORIES: DEFAULT_CATEGORIES.slice(),
    SORT_FIELDS: SORT_FIELDS.slice(),
    normaliseExpense: normaliseExpense,
    normaliseAttachment: normaliseAttachment,
    validateExpense: validateExpense,
    migrateStorage: migrateStorage,
    loadExpenses: loadExpenses,
    saveExpenses: saveExpenses,
    getExpenseById: getExpenseById,
    createExpense: createExpense,
    updateExpense: updateExpense,
    archiveExpense: archiveExpense,
    unarchiveExpense: unarchiveExpense,
    deleteExpense: deleteExpense,
    restoreExpense: restoreExpense,
    getCategories: getCategories,
    setCategories: setCategories,
    addCategory: addCategory,
    removeCategory: removeCategory,
    searchExpenses: searchExpenses,
    sortExpenses: sortExpenses,
    matchesQuery: matchesQuery,
    getStatistics: getStatistics,
    businessAmountPence: businessAmountPence,
    addAttachment: addAttachment,
    removeAttachment: removeAttachment,
    getAttachments: getAttachments,
    isEngineReady: isEngineReady,
    totalSpentPence: totalSpentPence,
  };
})(typeof window !== 'undefined' ? window : globalThis);
