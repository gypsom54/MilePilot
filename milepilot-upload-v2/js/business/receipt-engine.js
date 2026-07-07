/**
 * MilePilot Business Engine — Receipt Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: the lifecycle of a captured receipt.
 *   Capture · Storage · Compression · Retry · Receipt Status
 *
 * It does NOT do OCR, categorisation, VAT or reporting — it only owns the raw
 * receipt record and its status, emitting events other engines react to.
 *
 * Status machine: captured → stored → (OCR handled elsewhere) ; on error → failed
 * (retryable). Compression is injected (ctx.deps.compress) so the native image
 * pipeline can plug in without changing this engine.
 */
(function (global) {
  'use strict';

  var STATUS = {
    CAPTURED: 'captured',
    STORING: 'storing',
    STORED: 'stored',
    FAILED: 'failed',
  };

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var now = ctx.now || function () { return Date.now(); };
    var deps = ctx.deps || {};
    // compress(imageRef) -> Promise<storedRef> ; default is a no-op passthrough.
    var compress =
      typeof deps.compress === 'function'
        ? deps.compress
        : function (ref) { return Promise.resolve(ref); };
    var MAX_ATTEMPTS = deps.maxAttempts || 3;

    function load() {
      return store.get('receipts', []) || [];
    }
    function save(list) {
      store.set('receipts', list);
      return list;
    }
    function upsert(receipt) {
      var list = load();
      var i = list.findIndex(function (r) { return r.id === receipt.id; });
      if (i >= 0) list[i] = receipt;
      else list.unshift(receipt);
      return save(list);
    }
    function setStatus(receipt, status, extra) {
      receipt.status = status;
      receipt.updatedAt = now();
      if (extra) Object.assign(receipt, extra);
      upsert(receipt);
      bus.emit(E.RECEIPT_STATUS_CHANGED, { id: receipt.id, status: status });
      return receipt;
    }

    function newId() {
      return 'rcpt_' + now() + '_' + Math.random().toString(36).slice(2, 7);
    }

    /** Public: capture a new receipt. Returns the receipt record immediately. */
    function capture(input) {
      input = input || {};
      var receipt = {
        id: input.id || newId(),
        imageRef: input.imageRef || null,
        capturedAt: input.capturedAt || now(),
        status: STATUS.CAPTURED,
        attempts: 0,
        storedRef: null,
        updatedAt: now(),
      };
      upsert(receipt);
      bus.emit(E.RECEIPT_CAPTURED, { id: receipt.id, receipt: receipt });
      store_(receipt);
      return receipt;
    }

    /** Internal: compress + persist the image, then mark stored (or failed). */
    function store_(receipt) {
      receipt.attempts += 1;
      setStatus(receipt, STATUS.STORING);
      Promise.resolve()
        .then(function () { return compress(receipt.imageRef); })
        .then(function (storedRef) {
          setStatus(receipt, STATUS.STORED, { storedRef: storedRef });
          bus.emit(E.RECEIPT_STORED, { id: receipt.id, receipt: receipt });
        })
        .catch(function (err) {
          setStatus(receipt, STATUS.FAILED, { error: String((err && err.message) || err) });
          bus.emit(E.RECEIPT_FAILED, { id: receipt.id, attempts: receipt.attempts });
        });
    }

    /** Public: retry every failed receipt that has attempts left. */
    function retryFailed() {
      var retried = 0;
      load().forEach(function (r) {
        if (r.status === STATUS.FAILED && r.attempts < MAX_ATTEMPTS) {
          store_(r);
          retried += 1;
        }
      });
      return retried;
    }

    function getReceipts() {
      return load();
    }
    function getReceipt(id) {
      return load().find(function (r) { return r.id === id; }) || null;
    }
    function getState() {
      var list = load();
      return {
        total: list.length,
        stored: list.filter(function (r) { return r.status === STATUS.STORED; }).length,
        failed: list.filter(function (r) { return r.status === STATUS.FAILED; }).length,
        pending: list.filter(function (r) {
          return r.status === STATUS.CAPTURED || r.status === STATUS.STORING;
        }).length,
      };
    }

    return {
      STATUS: STATUS,
      capture: capture,
      retryFailed: retryFailed,
      getReceipts: getReceipts,
      getReceipt: getReceipt,
      getState: getState,
      destroy: function () {},
    };
  }

  var api = { create: create, STATUS: STATUS };
  global.MPReceiptEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
