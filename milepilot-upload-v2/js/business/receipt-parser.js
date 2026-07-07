/**
 * MilePilot Business Engine — Receipt Parser (LOCKED ARCHITECTURE)
 *
 * Single responsibility: turn raw OCR text into structured receipt fields.
 *   merchant · amount · date · vat · confidence
 *
 * Pure and deterministic (no I/O, no events) so it is trivially testable and
 * replaceable. The OCR Engine uses this to build the `fields` it emits. A future
 * ML extractor can replace this module without touching any engine.
 */
(function (global) {
  'use strict';

  var AMOUNT_RE = /(?:£|gbp|\btotal\b|\bamount\b|\bbalance\b|\bto pay\b)?\s*£?\s*(\d{1,4}(?:[.,]\d{2}))/gi;
  var TOTAL_LINE_RE = /(total|amount due|balance|to pay|grand total)/i;
  var VAT_LINE_RE = /\bvat\b|\bv\.a\.t\b/i;
  var DATE_RES = [
    /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/, // dd/mm/yyyy
    /(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/, // yyyy-mm-dd
  ];
  var NOISE_RE = /(receipt|invoice|vat|tel|www|http|thank|customer|copy|card|visa|mastercard|change|cash|total|subtotal|balance|amount)/i;

  function toNumber(s) {
    if (s == null) return null;
    var n = Number(String(s).replace(',', '.'));
    return isNaN(n) ? null : n;
  }

  function parseAmount(text, lines) {
    // Prefer a value on a line that mentions total/amount/balance.
    var best = null;
    lines.forEach(function (line) {
      if (TOTAL_LINE_RE.test(line)) {
        var m = line.match(/(\d{1,4}(?:[.,]\d{2}))/g);
        if (m && m.length) {
          var v = toNumber(m[m.length - 1]);
          if (v != null && (best == null || v > best)) best = v;
        }
      }
    });
    if (best != null) return { value: best, fromTotalLine: true };
    // Fallback: the largest money-looking value anywhere.
    var all = [];
    var mm;
    AMOUNT_RE.lastIndex = 0;
    while ((mm = AMOUNT_RE.exec(text))) {
      var v2 = toNumber(mm[1]);
      if (v2 != null) all.push(v2);
    }
    if (!all.length) return { value: null, fromTotalLine: false };
    return { value: Math.max.apply(null, all), fromTotalLine: false };
  }

  function parseDate(text) {
    for (var i = 0; i < DATE_RES.length; i++) {
      var m = text.match(DATE_RES[i]);
      if (m) {
        var a = Number(m[1]), b = Number(m[2]), c = Number(m[3]);
        var d;
        if (m[1].length === 4) d = new Date(a, b - 1, c); // yyyy-mm-dd
        else {
          var year = c < 100 ? 2000 + c : c;
          d = new Date(year, b - 1, a); // dd/mm/yyyy
        }
        if (!isNaN(d.getTime())) return d.getTime();
      }
    }
    return null;
  }

  function parseMerchant(lines) {
    // The merchant name is usually the first meaningful, non-noise line.
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.length < 2) continue;
      if (/^\d/.test(line)) continue; // starts with a number → likely not a name
      if (NOISE_RE.test(line)) continue;
      var letters = (line.match(/[a-z]/gi) || []).length;
      if (letters >= 2) return line.replace(/\s{2,}/g, ' ').slice(0, 40);
    }
    return null;
  }

  function parseVat(text, amount) {
    var m = text.match(/vat[^\d]{0,8}£?\s*(\d{1,4}(?:[.,]\d{2}))/i);
    if (m) {
      var v = toNumber(m[1]);
      if (v != null) return v;
    }
    // Derive standard-rate VAT element from a gross total when not printed.
    if (amount != null && /vat/i.test(text)) {
      return +(amount - amount / 1.2).toFixed(2);
    }
    return null;
  }

  /** Parse raw OCR text into structured fields + a confidence score (0..1). */
  function parse(rawText) {
    var text = String(rawText || '');
    var lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);

    var amountInfo = parseAmount(text, lines);
    var amount = amountInfo.value;
    var date = parseDate(text);
    var merchant = parseMerchant(lines);
    var vat = parseVat(text, amount);

    // Confidence: driven by how much we recovered + quality signals.
    var score = 0;
    if (amount != null) score += amountInfo.fromTotalLine ? 0.55 : 0.4;
    if (merchant) score += 0.25;
    if (date != null) score += 0.15;
    if (vat != null) score += 0.05;
    if (lines.length >= 4) score += 0.05;
    score = Math.max(0, Math.min(1, score));

    return {
      merchant: merchant,
      amount: amount,
      date: date,
      vat: vat,
      confidence: +score.toFixed(2),
    };
  }

  var api = { parse: parse };
  global.MPReceiptParser = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
