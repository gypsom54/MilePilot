/**
 * MilePilot Business Engine — Notification Engine (LOCKED ARCHITECTURE)
 *
 * Single responsibility: decide WHAT the user should be told and queue it.
 *   Daily Briefing · Weekly Review Ready · Missing Receipt Reminder · Health Changes
 *
 * Reacts to: HEALTH_UPDATED, REPORT_UPDATED, RECEIPT_FAILED, RECEIPT_STATUS_CHANGED.
 * Emits: NOTIFICATION_QUEUED. It does NOT deliver OS notifications — the existing
 * native/web delivery layer drains this queue. This keeps decision logic separate
 * from delivery and avoids duplicating the locked notification plumbing.
 */
(function (global) {
  'use strict';

  var MAX_QUEUE = 50;

  function create(ctx) {
    var bus = ctx.bus;
    var store = ctx.store;
    var E = bus.events;
    var now = ctx.now || function () { return Date.now(); };

    function load() {
      return store.get('queue', []) || [];
    }
    // De-duplicate by a stable key within a 6h window so we never spam.
    function queue(note) {
      var list = load();
      var since = now() - 6 * 60 * 60 * 1000;
      var dup = list.some(function (n) { return n.key === note.key && n.at >= since; });
      if (dup) return null;
      var entry = {
        id: 'n_' + now() + '_' + Math.random().toString(36).slice(2, 6),
        key: note.key,
        type: note.type,
        title: note.title,
        body: note.body,
        at: now(),
        delivered: false,
      };
      list.unshift(entry);
      if (list.length > MAX_QUEUE) list.length = MAX_QUEUE;
      store.set('queue', list);
      bus.emit(E.NOTIFICATION_QUEUED, entry);
      return entry;
    }

    var unsubs = [
      bus.on(E.HEALTH_UPDATED, function (p) {
        if (p && p.changed && p.previousScore != null && p.health) {
          var up = p.health.score > p.previousScore;
          queue({
            key: 'health_change',
            type: 'health',
            title: 'Business Health ' + (up ? 'improved' : 'changed'),
            body: 'Your organisation score is now ' + p.health.score + '/100 — ' + p.health.label + '.',
          });
        }
      }),
      bus.on(E.REPORT_UPDATED, function (p) {
        if (p && p.available && p.available.weekly) {
          queue({
            key: 'weekly_review',
            type: 'report',
            title: 'Weekly review ready',
            body: 'Your business summary is ready to review.',
          });
        }
      }),
      bus.on(E.RECEIPT_FAILED, function () {
        queue({
          key: 'missing_receipt',
          type: 'receipt',
          title: 'Receipt needs attention',
          body: "A receipt didn't save. Tap to retry.",
        });
      }),
    ];

    /** Delivery layer calls this to build a once-a-day briefing on demand. */
    function buildDailyBriefing(summary) {
      return queue({
        key: 'daily_briefing',
        type: 'briefing',
        title: 'Your MilePilot briefing',
        body: summary || 'Here is your business at a glance.',
      });
    }

    function getQueue() {
      return load();
    }
    function markDelivered(id) {
      var list = load();
      var n = list.find(function (x) { return x.id === id; });
      if (n) { n.delivered = true; store.set('queue', list); }
    }
    function getPending() {
      return load().filter(function (n) { return !n.delivered; });
    }

    return {
      buildDailyBriefing: buildDailyBriefing,
      getQueue: getQueue,
      getPending: getPending,
      markDelivered: markDelivered,
      destroy: function () { unsubs.forEach(function (u) { u(); }); },
    };
  }

  var api = { create: create };
  global.MPNotificationEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
