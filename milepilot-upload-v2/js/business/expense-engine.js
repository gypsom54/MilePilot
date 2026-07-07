/**
 * MilePilot Business Engine — Expense Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: business expenses derived from receipts (and manual
 * entry).  Merchant · Category · Totals · History
 *
 * Reacts to: OCR_COMPLETE (auto-creates an expense when a confident amount is
 * found). Emits: EXPENSE_UPDATED. Categorisation is injected (ctx.deps.classify)
 * so the AI Engine can take over classification later without changes here.
 */
(function (global) {
  'use strict';

  var CATEGORIES = ['fuel', 'parking', 'tolls', 'tools', 'vehicle', 'food', 'other'];

  // Deterministic fallback classifier — replaceable by AI Engine later.
  function defaultClassify(merchant) {
    var m = (merchant || '').toLowerCase();
    if (/shell|bp|esso|texaco|fuel|petrol|gas|garage/.test(m)) return 'fuel';
    if (/park|ncp|meter/.test(m)) return 'parking';
    if (/toll|dartford|congestion|clean air|caz/.test(m)) return 'tolls';
    if (/screwfix|toolstation|halfords|tool/.test(m)) return 'tools';
    if (/tyre|service|mot|garage|auto/.test(m)) return 'vehicle';
    if (/cafe|coffee|costa|greggs|mcdonald|food|restaurant/.test(m)) return 'food';
    return 'other';
  }

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var now = ctx.now || function () { return Date.now(); };
    var deps = ctx.deps || {};
    var classify = typeof deps.classify === 'function' ? deps.classify : defaultClassify;
    var MIN_CONFIDENCE = deps.minConfidence != null ? deps.minConfidence : 0.4;

    function load() {
      return store.get('expenses', []) || [];
    }
    function save(list) {
      store.set('expenses', list);
      return list;
    }
    function num(v) {
      return Number(v) || 0;
    }

    function emitUpdated(reason, expense) {
      bus.emit(E.EXPENSE_UPDATED, { reason: reason, expense: expense || null, state: getState() });
    }

    /** Public: add/confirm an expense (manual entry or confirmed OCR). */
    function addExpense(input) {
      input = input || {};
      var expense = {
        id: input.id || 'exp_' + now() + '_' + Math.random().toString(36).slice(2, 6),
        receiptId: input.receiptId || null,
        merchant: input.merchant || 'Unknown',
        amount: num(input.amount),
        vat: input.vat != null ? num(input.vat) : null,
        category: input.category || classify(input.merchant),
        date: input.date || now(),
        source: input.source || 'manual',
        createdAt: now(),
      };
      var list = load();
      var i = list.findIndex(function (e) {
        return e.id === expense.id || (expense.receiptId && e.receiptId === expense.receiptId);
      });
      if (i >= 0) list[i] = Object.assign(list[i], expense);
      else list.unshift(expense);
      save(list);
      emitUpdated('added', expense);
      return expense;
    }

    function onOcrComplete(payload) {
      if (!payload) return;
      var f = payload.fields || {};
      // Only auto-create when OCR is confident AND found a usable amount.
      if (payload.confidence < MIN_CONFIDENCE || !f.amount) return;
      addExpense({
        receiptId: payload.receiptId,
        merchant: f.merchant || 'Unknown',
        amount: f.amount,
        vat: f.vat,
        date: f.date || now(),
        source: 'ocr',
      });
    }

    var unsub = bus.on(E.OCR_COMPLETE, onOcrComplete);

    function inRange(ts, start, end) {
      return ts >= start && ts < end;
    }
    function monthStart(d) {
      var x = d || new Date();
      return new Date(x.getFullYear(), x.getMonth(), 1).getTime();
    }

    function getExpenses() {
      return load();
    }
    function totalsByCategory(list) {
      var totals = {};
      CATEGORIES.forEach(function (c) { totals[c] = 0; });
      (list || load()).forEach(function (e) {
        totals[e.category] = (totals[e.category] || 0) + num(e.amount);
      });
      return totals;
    }
    function getState() {
      var list = load();
      var mStart = monthStart();
      var monthList = list.filter(function (e) { return e.date >= mStart; });
      return {
        count: list.length,
        monthCount: monthList.length,
        monthTotal: monthList.reduce(function (a, e) { return a + num(e.amount); }, 0),
        total: list.reduce(function (a, e) { return a + num(e.amount); }, 0),
        byCategory: totalsByCategory(monthList),
      };
    }

    return {
      CATEGORIES: CATEGORIES,
      addExpense: addExpense,
      getExpenses: getExpenses,
      getState: getState,
      totalsByCategory: totalsByCategory,
      destroy: function () { unsub(); },
    };
  }

  var api = { create: create, CATEGORIES: CATEGORIES };
  global.MPExpenseEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
