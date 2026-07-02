/**
 * Backward-compatible alias — delegates to MilePilot Intelligence Engine (MIE).
 */
(function (global) {
  'use strict';
  if (global.MPMIE) {
    global.MPAiReview = global.MPMIE;
  }
})(typeof window !== 'undefined' ? window : global);
