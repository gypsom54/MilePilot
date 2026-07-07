/**
 * MilePilot Business Engine — Event Bus (LOCKED ARCHITECTURE)
 *
 * The single communication channel between every Business engine. Engines never
 * call each other directly; they emit and subscribe to events. This guarantees:
 *   - no circular dependencies (engines depend only on the bus + their store)
 *   - independent testability (create a fresh bus per test)
 *   - replaceability (swap any engine as long as it honours the event contract)
 *
 * Synchronous, error-isolated dispatch: a throwing handler never blocks other
 * subscribers or the emitter.
 */
(function (global) {
  'use strict';

  var MPBusinessEvents = {
    // Receipt lifecycle
    RECEIPT_CAPTURED: 'receipt:captured',
    RECEIPT_STORED: 'receipt:stored',
    RECEIPT_FAILED: 'receipt:failed',
    RECEIPT_STATUS_CHANGED: 'receipt:status',
    // OCR lifecycle
    OCR_STARTED: 'ocr:started',
    OCR_COMPLETE: 'ocr:complete',
    OCR_FAILED: 'ocr:failed',
    // Derived data
    EXPENSE_UPDATED: 'expense:updated',
    VAT_UPDATED: 'vat:updated',
    TIMELINE_UPDATED: 'timeline:updated',
    HEALTH_UPDATED: 'health:updated',
    REPORT_UPDATED: 'report:updated',
    // Cross-cutting
    NOTIFICATION_QUEUED: 'notification:queued',
    AI_LEARNED: 'ai:learned',
    MILEAGE_UPDATED: 'mileage:updated',
    // Aggregate signal the UI subscribes to
    STATE_CHANGED: 'state:changed',
  };

  function createBus(options) {
    var opts = options || {};
    var handlers = Object.create(null);
    var onError =
      typeof opts.onError === 'function'
        ? opts.onError
        : function (err, event) {
            try {
              console.error('[MPBusinessBus] handler error for', event, err);
            } catch (e) {}
          };

    function on(event, handler) {
      if (typeof handler !== 'function') return function () {};
      (handlers[event] || (handlers[event] = [])).push(handler);
      return function off() {
        var list = handlers[event];
        if (!list) return;
        var i = list.indexOf(handler);
        if (i >= 0) list.splice(i, 1);
      };
    }

    function off(event, handler) {
      var list = handlers[event];
      if (!list) return;
      var i = list.indexOf(handler);
      if (i >= 0) list.splice(i, 1);
    }

    function emit(event, payload) {
      var list = handlers[event];
      if (!list || !list.length) return;
      // Copy so handlers that subscribe/unsubscribe during dispatch are safe.
      var snapshot = list.slice();
      for (var i = 0; i < snapshot.length; i++) {
        try {
          snapshot[i](payload, event);
        } catch (err) {
          onError(err, event);
        }
      }
    }

    function clear() {
      handlers = Object.create(null);
    }

    return { on: on, off: off, emit: emit, clear: clear, events: MPBusinessEvents };
  }

  var api = { create: createBus, events: MPBusinessEvents };
  global.MPBusinessBus = api;
  global.MPBusinessEvents = MPBusinessEvents;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
