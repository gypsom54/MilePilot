/**
 * MP-044 — Unified HMRC Tax Engine (Single Source of Truth)
 * All mileage claim calculations must route through MPTaxEngine.
 * Money is calculated internally in integer pence.
 */
(function (global) {
  'use strict';

  var BUSINESS = 'business';
  var LONDON_TZ = 'Europe/London';

  var HMRC_RATE_TABLES = {
    '2025-26': {
      car: { firstTierPencePerMile: 45, secondTierPencePerMile: 25, thresholdMiles: 10000 },
      van: { firstTierPencePerMile: 45, secondTierPencePerMile: 25, thresholdMiles: 10000 },
      motorcycle: { flatPencePerMile: 24 },
      bicycle: { flatPencePerMile: 20 },
    },
    '2026-27': {
      car: { firstTierPencePerMile: 55, secondTierPencePerMile: 25, thresholdMiles: 10000 },
      van: { firstTierPencePerMile: 55, secondTierPencePerMile: 25, thresholdMiles: 10000 },
      motorcycle: { flatPencePerMile: 24 },
      bicycle: { flatPencePerMile: 20 },
    },
  };

  var SUPPORTED_VEHICLES = ['car', 'van', 'motorcycle', 'bicycle'];

  /* —— TaxYearResolver —— */
  function londonDateParts(dateInput) {
    var d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return null;
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: LONDON_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    var parts = fmt.formatToParts(d);
    var map = {};
    parts.forEach(function (p) {
      if (p.type !== 'literal') map[p.type] = p.value;
    });
    return {
      year: parseInt(map.year, 10),
      month: parseInt(map.month, 10),
      day: parseInt(map.day, 10),
    };
  }

  function getUkTaxYear(dateInput) {
    var parts = londonDateParts(dateInput || new Date());
    if (!parts) {
      return { id: null, start: null, end: null, valid: false, error: 'Invalid date' };
    }
    var y = parts.year;
    var m = parts.month;
    var day = parts.day;
    var startYear;
    if (m > 4 || (m === 4 && day >= 6)) startYear = y;
    else startYear = y - 1;
    var endYear = startYear + 1;
    var id = startYear + '-' + String(endYear).slice(2);
    return {
      id: id,
      start: startYear + '-04-06',
      end: endYear + '-04-05',
      valid: true,
    };
  }

  function taxYearStartDate(taxYearId) {
    if (!taxYearId || !HMRC_RATE_TABLES[taxYearId]) return null;
    var y = parseInt(taxYearId.split('-')[0], 10);
    return new Date(y, 3, 6);
  }

  function taxYearEndExclusive(taxYearId) {
    if (!taxYearId || !HMRC_RATE_TABLES[taxYearId]) return null;
    var y = parseInt(taxYearId.split('-')[0], 10) + 1;
    return new Date(y, 3, 6);
  }

  function journeyInTaxYear(journey, taxYearId) {
    var start = taxYearStartDate(taxYearId);
    var end = taxYearEndExclusive(taxYearId);
    if (!start || !end) return false;
    var d = new Date(journey.startISO || journey.endISO || 0);
    return d >= start && d < end;
  }

  /* —— Validation —— */
  function validateVehicle(vehicleType) {
    var v = (vehicleType || '').toLowerCase();
    if (SUPPORTED_VEHICLES.indexOf(v) >= 0) {
      return { valid: true, vehicleType: v };
    }
    return {
      valid: false,
      vehicleType: v || null,
      error: 'A valid vehicle type is required to calculate your mileage claim.',
      code: 'UNKNOWN_VEHICLE',
    };
  }

  function getRateConfig(taxYearId, vehicleType) {
    var table = HMRC_RATE_TABLES[taxYearId];
    if (!table) return { valid: false, error: 'No HMRC rate table for tax year ' + taxYearId };
    var v = validateVehicle(vehicleType);
    if (!v.valid) return v;
    var cfg = table[v.vehicleType];
    if (!cfg) return { valid: false, error: 'No rates for vehicle ' + v.vehicleType };
    return { valid: true, vehicleType: v.vehicleType, config: cfg, taxYearId: taxYearId };
  }

  /* —— MoneyFormatter —— */
  function milesToMilli(miles) {
    return Math.round((Number(miles) || 0) * 1000);
  }

  function milliToMiles(milli) {
    return milli / 1000;
  }

  function formatPence(pence) {
    return '£' + (Number(pence) / 100).toFixed(2);
  }

  function penceToPounds(pence) {
    return Number(pence) / 100;
  }

  /* —— JourneyCalculator —— */
  function calculateJourneyClaimPence(miles, cumulativeMilliBefore, rateConfig) {
    var milli = milesToMilli(miles);
    if (milli <= 0) return { claimPence: 0, firstTierMilli: 0, secondTierMilli: 0 };

    if (rateConfig.flatPencePerMile != null) {
      return {
        claimPence: Math.round((milli * rateConfig.flatPencePerMile) / 1000),
        firstTierMilli: milli,
        secondTierMilli: 0,
        flatRate: true,
      };
    }

    var thresholdMilli = milesToMilli(rateConfig.thresholdMiles);
    var firstRemaining = Math.max(0, thresholdMilli - cumulativeMilliBefore);
    var firstTierMilli = Math.min(milli, firstRemaining);
    var secondTierMilli = milli - firstTierMilli;
    var claimPence =
      Math.round((firstTierMilli * rateConfig.firstTierPencePerMile) / 1000) +
      Math.round((secondTierMilli * rateConfig.secondTierPencePerMile) / 1000);

    return {
      claimPence: claimPence,
      firstTierMilli: firstTierMilli,
      secondTierMilli: secondTierMilli,
      flatRate: false,
    };
  }

  function normaliseJourney(raw, defaultVehicle) {
    return {
      id: raw.id || null,
      status: raw.status || 'pending',
      miles: Number(raw.miles) || 0,
      vehicle: (raw.vehicle || defaultVehicle || '').toLowerCase(),
      startISO: raw.startISO || raw.endISO || new Date().toISOString(),
      endISO: raw.endISO || raw.startISO || new Date().toISOString(),
      storedHmrc: Number(raw.hmrc) || 0,
    };
  }

  function isEligibleBusiness(journey) {
    return journey && journey.status === BUSINESS && (Number(journey.miles) || 0) > 0;
  }

  function sortChronologically(journeys) {
    return journeys.slice().sort(function (a, b) {
      var ta = new Date(a.startISO).getTime();
      var tb = new Date(b.startISO).getTime();
      if (ta !== tb) return ta - tb;
      return String(a.id || '').localeCompare(String(b.id || ''));
    });
  }

  /* —— MileageCalculator / TaxYearSummary —— */
  function calculateTaxYearClaims(opts) {
    opts = opts || {};
    var journeys = (opts.journeys || []).map(function (j) {
      return normaliseJourney(j, opts.defaultVehicle);
    });
    var refDate = opts.asOfDate || new Date();
    var taxYear = opts.taxYearId ? { id: opts.taxYearId, valid: true } : getUkTaxYear(refDate);
    if (!taxYear.valid || !taxYear.id) {
      return { valid: false, error: taxYear.error || 'Could not resolve tax year' };
    }

    var vehicleType = opts.vehicleType || opts.defaultVehicle;
    var rateInfo = getRateConfig(taxYear.id, vehicleType);
    if (!rateInfo.valid) return rateInfo;

    var eligible = sortChronologically(journeys.filter(isEligibleBusiness)).filter(function (j) {
      return journeyInTaxYear(j, taxYear.id);
    });

    var cumulativeMilli = 0;
    var totalClaimPence = 0;
    var firstTierMilli = 0;
    var secondTierMilli = 0;
    var perJourney = [];

    eligible.forEach(function (j) {
      var split = calculateJourneyClaimPence(j.miles, cumulativeMilli, rateInfo.config);
      cumulativeMilli += milesToMilli(j.miles);
      totalClaimPence += split.claimPence;
      firstTierMilli += split.firstTierMilli || 0;
      secondTierMilli += split.secondTierMilli || 0;
      perJourney.push({
        id: j.id,
        miles: j.miles,
        claimPence: split.claimPence,
        storedHmrcPence: Math.round(j.storedHmrc * 100),
        firstTierMilli: split.firstTierMilli,
        secondTierMilli: split.secondTierMilli,
        startISO: j.startISO,
      });
    });

    return {
      valid: true,
      taxYear: taxYear.id,
      taxYearStart: taxYear.start,
      taxYearEnd: taxYear.end,
      vehicleType: rateInfo.vehicleType,
      eligibleMiles: milliToMiles(cumulativeMilli),
      eligibleMilli: cumulativeMilli,
      firstTierMiles: milliToMiles(firstTierMilli),
      secondTierMiles: milliToMiles(secondTierMilli),
      firstTierAmountPence: rateInfo.config.flatPencePerMile
        ? totalClaimPence
        : Math.round((firstTierMilli * rateInfo.config.firstTierPencePerMile) / 1000),
      secondTierAmountPence: rateInfo.config.flatPencePerMile
        ? 0
        : Math.round((secondTierMilli * rateInfo.config.secondTierPencePerMile) / 1000),
      totalClaimPence: totalClaimPence,
      totalClaim: penceToPounds(totalClaimPence),
      journeys: perJourney,
      journeyCount: eligible.length,
      hasThreshold: !rateInfo.config.flatPencePerMile,
      firstTierRatePence: rateInfo.config.firstTierPencePerMile || null,
      secondTierRatePence: rateInfo.config.secondTierPencePerMile || null,
      flatRatePence: rateInfo.config.flatPencePerMile || null,
    };
  }

  function calculatePeriodClaims(opts) {
    opts = opts || {};
    var start = opts.start instanceof Date ? opts.start : new Date(opts.start);
    var end = opts.end instanceof Date ? opts.end : new Date(opts.end);
    var journeys = (opts.journeys || []).map(function (j) {
      return normaliseJourney(j, opts.defaultVehicle);
    });

    var eligible = sortChronologically(journeys.filter(isEligibleBusiness)).filter(function (j) {
      var d = new Date(j.startISO);
      return d >= start && d < end;
    });

    if (!eligible.length) {
      return {
        valid: true,
        miles: 0,
        totalClaimPence: 0,
        totalClaim: 0,
        journeys: [],
        journeyCount: 0,
      };
    }

    var taxYearIds = {};
    eligible.forEach(function (j) {
      var ty = getUkTaxYear(j.startISO);
      if (ty.valid) taxYearIds[ty.id] = true;
    });

    var ids = Object.keys(taxYearIds);
    if (ids.length !== 1) {
      var totalPence = 0;
      var totalMiles = 0;
      var allPerJourney = [];
      ids.forEach(function (taxYearId) {
        var inYear = eligible.filter(function (j) {
          return journeyInTaxYear(j, taxYearId);
        });
        var prior = sortChronologically(
          (opts.priorBusinessJourneys || []).concat(
            journeys.filter(function (j) {
              return isEligibleBusiness(j) && journeyInTaxYear(j, taxYearId) && inYear.indexOf(j) < 0;
            })
          )
        );
        var cumulativeBefore = 0;
        prior.forEach(function (j) {
          if (new Date(j.startISO) < new Date(inYear[0].startISO)) {
            cumulativeBefore += milesToMilli(j.miles);
          }
        });
        var rateInfo = getRateConfig(taxYearId, opts.vehicleType || opts.defaultVehicle);
        if (!rateInfo.valid) return;
        var cum = cumulativeBefore;
        inYear.forEach(function (j) {
          var split = calculateJourneyClaimPence(j.miles, cum, rateInfo.config);
          cum += milesToMilli(j.miles);
          totalPence += split.claimPence;
          totalMiles += j.miles;
          allPerJourney.push({ id: j.id, miles: j.miles, claimPence: split.claimPence, startISO: j.startISO });
        });
      });
      return {
        valid: true,
        miles: totalMiles,
        totalClaimPence: totalPence,
        totalClaim: penceToPounds(totalPence),
        journeys: allPerJourney,
        journeyCount: allPerJourney.length,
        multiTaxYear: true,
      };
    }

    var taxYearId = ids[0];
    var priorAll = sortChronologically(
      (opts.priorBusinessJourneys || []).filter(function (j) {
        return isEligibleBusiness(j) && journeyInTaxYear(j, taxYearId);
      })
    );
    var cumulativeBefore = 0;
    priorAll.forEach(function (j) {
      var jd = new Date(j.startISO);
      if (jd < new Date(eligible[0].startISO)) cumulativeBefore += milesToMilli(j.miles);
    });

    var rateInfo = getRateConfig(taxYearId, opts.vehicleType || opts.defaultVehicle);
    if (!rateInfo.valid) return rateInfo;

    var totalPence = 0;
    var totalMiles = 0;
    var perJourney = [];
    var cum = cumulativeBefore;
    eligible.forEach(function (j) {
      var split = calculateJourneyClaimPence(j.miles, cum, rateInfo.config);
      cum += milesToMilli(j.miles);
      totalPence += split.claimPence;
      totalMiles += j.miles;
      perJourney.push({ id: j.id, miles: j.miles, claimPence: split.claimPence, startISO: j.startISO });
    });

    return {
      valid: true,
      taxYear: taxYearId,
      miles: totalMiles,
      totalClaimPence: totalPence,
      totalClaim: penceToPounds(totalPence),
      journeys: perJourney,
      journeyCount: perJourney.length,
    };
  }

  function claimMarginalPounds(miles, vehicleType, allJourneys, asOfDate) {
    var v = validateVehicle(vehicleType);
    if (!v.valid) return 0;
    var ref = asOfDate || new Date();
    var taxYear = getUkTaxYear(ref);
    if (!taxYear.valid) return 0;

    var prior = sortChronologically((allJourneys || []).filter(isEligibleBusiness)).filter(function (j) {
      return journeyInTaxYear(j, taxYear.id);
    });
    var cumulativeMilli = 0;
    prior.forEach(function (j) {
      cumulativeMilli += milesToMilli(j.miles);
    });

    var rateInfo = getRateConfig(taxYear.id, v.vehicleType);
    if (!rateInfo.valid) return 0;
    var split = calculateJourneyClaimPence(miles, cumulativeMilli, rateInfo.config);
    return penceToPounds(split.claimPence);
  }

  function hmrcForJourney(journey, cumulativeMilliBefore, vehicleType) {
    var j = normaliseJourney(journey, vehicleType);
    if (!isEligibleBusiness(j)) return 0;
    var taxYear = getUkTaxYear(j.startISO);
    if (!taxYear.valid) return 0;
    var rateInfo = getRateConfig(taxYear.id, j.vehicle || vehicleType);
    if (!rateInfo.valid) return 0;
    var split = calculateJourneyClaimPence(j.miles, cumulativeMilliBefore, rateInfo.config);
    return penceToPounds(split.claimPence);
  }

  function recalculateAllJourneys(journeys, defaultVehicle) {
    var normalised = sortChronologically(
      (journeys || []).map(function (j) {
        return normaliseJourney(j, defaultVehicle);
      })
    );
    var byTaxYear = {};
    var results = [];

    normalised.forEach(function (j) {
      if (!isEligibleBusiness(j)) {
        results.push({
          id: j.id,
          status: j.status,
          miles: j.miles,
          recalculatedPence: 0,
          storedHmrcPence: Math.round(j.storedHmrc * 100),
          diffPence: Math.round(-j.storedHmrc * 100),
        });
        return;
      }
      var ty = getUkTaxYear(j.startISO);
      if (!ty.valid) return;
      var key = ty.id + ':' + (j.vehicle || defaultVehicle || 'unknown');
      if (!byTaxYear[key]) byTaxYear[key] = { taxYearId: ty.id, vehicle: j.vehicle || defaultVehicle, cumulativeMilli: 0 };
      var bucket = byTaxYear[key];
      var rateInfo = getRateConfig(bucket.taxYearId, bucket.vehicle);
      if (!rateInfo.valid) {
        results.push({
          id: j.id,
          valid: false,
          error: rateInfo.error,
          miles: j.miles,
          storedHmrcPence: Math.round(j.storedHmrc * 100),
        });
        return;
      }
      var split = calculateJourneyClaimPence(j.miles, bucket.cumulativeMilli, rateInfo.config);
      bucket.cumulativeMilli += milesToMilli(j.miles);
      var storedPence = Math.round(j.storedHmrc * 100);
      results.push({
        id: j.id,
        miles: j.miles,
        vehicle: bucket.vehicle,
        taxYear: bucket.taxYearId,
        recalculatedPence: split.claimPence,
        storedHmrcPence: storedPence,
        diffPence: split.claimPence - storedPence,
        startISO: j.startISO,
      });
    });
    return results;
  }

  function compareWithStored(journeys, defaultVehicle) {
    var rows = recalculateAllJourneys(journeys, defaultVehicle);
    var totalStored = 0;
    var totalRecalc = 0;
    rows.forEach(function (r) {
      if (r.recalculatedPence != null) {
        totalStored += r.storedHmrcPence || 0;
        totalRecalc += r.recalculatedPence || 0;
      }
    });
    return {
      rows: rows,
      totalStoredPence: totalStored,
      totalRecalculatedPence: totalRecalc,
      totalDiffPence: totalRecalc - totalStored,
      totalStored: penceToPounds(totalStored),
      totalRecalculated: penceToPounds(totalRecalc),
      totalDiff: penceToPounds(totalRecalc - totalStored),
    };
  }

  function explainTaxYearSummary(summary) {
    if (!summary || !summary.valid) return '';
    if (!summary.hasThreshold) {
      return (
        'This tax year you have recorded ' +
        summary.eligibleMiles.toFixed(1) +
        ' eligible business miles by ' +
        summary.vehicleType +
        '. Your estimated mileage claim is ' +
        formatPence(summary.totalClaimPence) +
        '.'
      );
    }
    var firstRate = String(summary.firstTierRatePence);
    var secondRate = String(summary.secondTierRatePence);
    if (summary.secondTierMiles > 0) {
      return (
        'You have recorded ' +
        summary.eligibleMiles.toFixed(1) +
        ' eligible business miles this tax year. The first ' +
        summary.firstTierMiles.toFixed(1) +
        ' miles were calculated at ' +
        firstRate +
        'p and the remaining ' +
        summary.secondTierMiles.toFixed(1) +
        ' miles at ' +
        secondRate +
        'p, giving an estimated claim of ' +
        formatPence(summary.totalClaimPence) +
        '.'
      );
    }
    return (
      'This tax year you have recorded ' +
      summary.eligibleMiles.toFixed(1) +
      ' eligible business miles by ' +
      summary.vehicleType +
      '. Your estimated mileage claim is ' +
      formatPence(summary.totalClaimPence) +
      '.'
    );
  }

  function displayRateForVehicle(taxYearId, vehicleType) {
    var info = getRateConfig(taxYearId || getUkTaxYear(new Date()).id, vehicleType);
    if (!info.valid) return 0;
    if (info.config.flatPencePerMile) return info.config.flatPencePerMile / 100;
    return info.config.firstTierPencePerMile / 100;
  }

  function shiftToJourney(shift, defaultVehicle) {
    return normaliseJourney(
      {
        id: shift.id,
        status: BUSINESS,
        miles: shift.miles,
        vehicle: shift.vehicle || defaultVehicle,
        startISO: shift.startISO,
        endISO: shift.endISO,
        hmrc: shift.hmrc,
        seconds: shift.seconds,
      },
      defaultVehicle
    );
  }

  function collectBusinessJourneys(trips, shifts, defaultVehicle) {
    trips = trips || [];
    shifts = shifts || [];
    var business = trips.filter(function (t) {
      return t && t.status === BUSINESS;
    });
    var tripShiftIds = {};
    business.forEach(function (t) {
      if (t.shiftId) tripShiftIds[t.shiftId] = true;
    });
    var list = business.map(function (t) {
      return normaliseJourney(t, defaultVehicle);
    });
    shifts.forEach(function (s) {
      if (!s || tripShiftIds[s.id]) return;
      if ((Number(s.miles) || 0) < 0.01) return;
      list.push(shiftToJourney(s, defaultVehicle));
    });
    return sortChronologically(list);
  }

  function sumRecalculatedClaims(journeys, defaultVehicle) {
    var rows = recalculateAllJourneys(journeys, defaultVehicle);
    var totalPence = 0;
    var totalMiles = 0;
    var hmrcById = {};
    rows.forEach(function (r) {
      if (!r.miles) return;
      if (r.recalculatedPence != null) {
        totalPence += r.recalculatedPence || 0;
        totalMiles += r.miles || 0;
        if (r.id) hmrcById[r.id] = penceToPounds(r.recalculatedPence);
      }
    });
    return {
      hmrc: penceToPounds(totalPence),
      totalClaimPence: totalPence,
      mi: totalMiles,
      hmrcById: hmrcById,
      rows: rows,
    };
  }

  function periodClaimTotals(allJourneys, start, endExclusive, defaultVehicle) {
    var result = calculatePeriodClaims({
      journeys: allJourneys,
      start: start,
      end: endExclusive,
      defaultVehicle: defaultVehicle,
      vehicleType: defaultVehicle,
      priorBusinessJourneys: allJourneys,
    });
    if (!result.valid) {
      return { mi: 0, sec: 0, hmrc: 0, journeys: 0, list: [], totalClaimPence: 0 };
    }
    var inPeriod = sortChronologically(
      (allJourneys || []).filter(function (j) {
        if (!isEligibleBusiness(j)) return false;
        var d = new Date(j.startISO);
        return d >= start && d < endExclusive;
      })
    );
  var sec = inPeriod.reduce(function (a, j) {
      return a + (Number(j.seconds) || 0);
    }, 0);
    return {
      mi: result.miles,
      sec: sec,
      hmrc: result.totalClaim,
      totalClaimPence: result.totalClaimPence,
      journeys: result.journeyCount,
      list: inPeriod,
    };
  }

  function hmrcForTripClassification(trip, allTrips, defaultVehicle) {
    var j = normaliseJourney(trip, defaultVehicle);
    if (!isEligibleBusiness(j)) return 0;
    var taxYear = getUkTaxYear(j.startISO);
    if (!taxYear.valid) return 0;
    var prior = sortChronologically(
      (allTrips || []).filter(function (t) {
        var n = normaliseJourney(t, defaultVehicle);
        if (!isEligibleBusiness(n)) return false;
        if (n.id === j.id) return false;
        return journeyInTaxYear(n, taxYear.id) && new Date(n.startISO) < new Date(j.startISO);
      })
    );
    var cumulativeMilli = 0;
    prior.forEach(function (p) {
      cumulativeMilli += milesToMilli(p.miles);
    });
    var rateInfo = getRateConfig(taxYear.id, j.vehicle || defaultVehicle);
    if (!rateInfo.valid) return 0;
    var split = calculateJourneyClaimPence(j.miles, cumulativeMilli, rateInfo.config);
    return penceToPounds(split.claimPence);
  }

  function enrichJourneysWithRecalculatedHmrc(journeys, defaultVehicle) {
    var rows = recalculateAllJourneys(journeys, defaultVehicle);
    var map = {};
    rows.forEach(function (r) {
      if (r.id != null) map[r.id] = penceToPounds(r.recalculatedPence || 0);
    });
    return (journeys || []).map(function (j) {
      var n = normaliseJourney(j, defaultVehicle);
      if (!isEligibleBusiness(n)) return Object.assign({}, j, { hmrc: 0 });
      var hmrc = map[j.id] != null ? map[j.id] : j.hmrc;
      return Object.assign({}, j, { hmrc: hmrc });
    });
  }

  global.MPTaxEngine = {
    HMRC_RATE_TABLES: HMRC_RATE_TABLES,
    SUPPORTED_VEHICLES: SUPPORTED_VEHICLES,
    BUSINESS: BUSINESS,
    getUkTaxYear: getUkTaxYear,
    validateVehicle: validateVehicle,
    getRateConfig: getRateConfig,
    formatPence: formatPence,
    penceToPounds: penceToPounds,
    milesToMilli: milesToMilli,
    calculateJourneyClaimPence: calculateJourneyClaimPence,
    calculateTaxYearClaims: calculateTaxYearClaims,
    calculatePeriodClaims: calculatePeriodClaims,
    claimMarginalPounds: claimMarginalPounds,
    hmrcForJourney: hmrcForJourney,
    recalculateAllJourneys: recalculateAllJourneys,
    compareWithStored: compareWithStored,
    explainTaxYearSummary: explainTaxYearSummary,
    displayRateForVehicle: displayRateForVehicle,
    collectBusinessJourneys: collectBusinessJourneys,
    sumRecalculatedClaims: sumRecalculatedClaims,
    periodClaimTotals: periodClaimTotals,
    hmrcForTripClassification: hmrcForTripClassification,
    enrichJourneysWithRecalculatedHmrc: enrichJourneysWithRecalculatedHmrc,
    shiftToJourney: shiftToJourney,
    sortChronologically: sortChronologically,
    isEligibleBusiness: isEligibleBusiness,
    normaliseJourney: normaliseJourney,
    journeyInTaxYear: journeyInTaxYear,
    londonDateParts: londonDateParts,
  };
})(typeof window !== 'undefined' ? window : globalThis);
