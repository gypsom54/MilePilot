/**
 * MilePilot Business Engine — OCR Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: turn a stored receipt image into structured text.
 *   Image Enhancement · OCR · Raw Text · Confidence
 *
 * The actual recogniser is injected (ctx.deps.recognise) so the native Vision /
 * cloud OCR provider plugs in later with zero changes here. The default provider
 * returns an empty, low-confidence result so the pipeline runs end-to-end today
 * without inventing fake data.
 *
 * Reacts to: RECEIPT_STORED. Emits: OCR_STARTED, OCR_COMPLETE, OCR_FAILED.
 */
(function (global) {
  'use strict';

  function defaultRecognise() {
    // No real OCR wired yet — honest empty result, not fabricated fields.
    return Promise.resolve({
      rawText: '',
      fields: { merchant: null, amount: null, date: null, vat: null },
      confidence: 0,
    });
  }

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var now = ctx.now || function () { return Date.now(); };
    var deps = ctx.deps || {};
    var enhance =
      typeof deps.enhance === 'function' ? deps.enhance : function (ref) { return ref; };
    var recognise = typeof deps.recognise === 'function' ? deps.recognise : defaultRecognise;

    function saveResult(receiptId, result) {
      var map = store.get('ocr', {}) || {};
      map[receiptId] = result;
      store.set('ocr', map);
    }

    function onReceiptStored(payload) {
      var receipt = payload && payload.receipt;
      if (!receipt) return;
      bus.emit(E.OCR_STARTED, { id: receipt.id });
      Promise.resolve()
        .then(function () { return enhance(receipt.storedRef || receipt.imageRef); })
        .then(function (image) { return recognise(image, receipt); })
        .then(function (result) {
          var out = {
            receiptId: receipt.id,
            rawText: (result && result.rawText) || '',
            fields: (result && result.fields) || {},
            confidence: Math.max(0, Math.min(1, Number(result && result.confidence) || 0)),
            at: now(),
          };
          saveResult(receipt.id, out);
          bus.emit(E.OCR_COMPLETE, out);
        })
        .catch(function (err) {
          bus.emit(E.OCR_FAILED, {
            receiptId: receipt.id,
            error: String((err && err.message) || err),
          });
        });
    }

    var unsub = bus.on(E.RECEIPT_STORED, onReceiptStored);

    function getResult(receiptId) {
      var map = store.get('ocr', {}) || {};
      return map[receiptId] || null;
    }

    return {
      getResult: getResult,
      destroy: function () { unsub(); },
    };
  }

  var api = { create: create };
  global.MPOcrEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
