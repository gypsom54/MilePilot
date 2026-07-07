/**
 * MilePilot Business Engine — Store (LOCKED ARCHITECTURE)
 *
 * Namespaced, JSON-safe persistence used by every engine. Each engine owns its
 * own namespace so state is isolated and independently replaceable.
 *
 * Uses localStorage in the browser/WebView; falls back to an in-memory Map when
 * localStorage is unavailable (e.g. Node tests, private mode). No engine touches
 * localStorage directly — this is the single persistence boundary.
 */
(function (global) {
  'use strict';

  function hasLocalStorage() {
    try {
      return typeof global.localStorage !== 'undefined' && global.localStorage !== null;
    } catch (e) {
      return false;
    }
  }

  function createStore(namespace) {
    var ns = 'mp_biz_' + (namespace || 'default') + '_';
    var mem = null;
    var useLocal = hasLocalStorage();
    if (!useLocal) mem = Object.create(null);

    function fullKey(key) {
      return ns + key;
    }

    function get(key, fallback) {
      var raw;
      try {
        raw = useLocal ? global.localStorage.getItem(fullKey(key)) : mem[fullKey(key)];
      } catch (e) {
        raw = null;
      }
      if (raw == null) return fallback === undefined ? null : fallback;
      try {
        return JSON.parse(raw);
      } catch (e) {
        return fallback === undefined ? null : fallback;
      }
    }

    function set(key, value) {
      var raw = JSON.stringify(value);
      try {
        if (useLocal) global.localStorage.setItem(fullKey(key), raw);
        else mem[fullKey(key)] = raw;
      } catch (e) {
        // Quota or serialization failure — degrade to in-memory to stay reliable.
        if (useLocal) {
          useLocal = false;
          mem = mem || Object.create(null);
          mem[fullKey(key)] = raw;
        }
      }
      return value;
    }

    function remove(key) {
      try {
        if (useLocal) global.localStorage.removeItem(fullKey(key));
        else delete mem[fullKey(key)];
      } catch (e) {}
    }

    return { get: get, set: set, remove: remove, namespace: ns };
  }

  var api = { create: createStore };
  global.MPBusinessStore = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
