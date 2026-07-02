/**
 * MilePilot Intelligence Engine (MIE)
 * Core product intelligence — separate from GPS, mileage, reports, email, subscription.
 * Consumes journey data; never controls the mileage engine.
 *
 * Future: Receipt Intelligence · Expense Intelligence · Tax Intelligence
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_mie_model';
  const LEGACY_KEY = 'mp_ai_habit_model';
  const BUSINESS_AUTO_THRESHOLD = 0.88;
  const PERSONAL_AUTO_THRESHOLD = 0.82;
  const REVIEW_THRESHOLD = 0.55;
  const MAX_EVENTS = 500;
  const GRID = 200;

  const CAPABILITIES = {
    mileage: true,
    receipts: false,
    expenses: false,
    tax: false,
  };

  function emptyModel() {
    return {
      version: 1,
      clusters: {},
      routes: {},
      timeSlots: {},
      weekdayRoutes: {},
      confirmedRoutes: {},
      events: [],
    };
  }

  function loadModel() {
    try {
      const raw = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || 'null');
      if (raw && raw.version) {
        return Object.assign(emptyModel(), raw);
      }
      return migrateLegacyModel();
    } catch (e) {
      return emptyModel();
    }
  }

  function migrateLegacyModel() {
    try {
      const legacy = JSON.parse(global.localStorage.getItem(LEGACY_KEY) || 'null');
      if (!legacy) return emptyModel();
      const model = emptyModel();
      model.clusters = legacy.clusters || {};
      model.routes = legacy.routes || {};
      model.timeSlots = legacy.timeSlots || {};
      model.events = (legacy.corrections || []).map(function (c) {
        return {
          type: c.corrected ? 'corrected' : 'accepted',
          final: c.final,
          suggested: c.suggested,
          confidence: c.confidence,
          at: c.at,
        };
      });
      saveModel(model);
      return model;
    } catch (e) {
      return emptyModel();
    }
  }

  function saveModel(model) {
    try {
      model.events = (model.events || []).slice(-MAX_EVENTS);
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
    } catch (e) {}
  }

  function clusterKey(lat, lon) {
    if (lat == null || lon == null) return null;
    const rlat = Math.round(Number(lat) * GRID) / GRID;
    const rlon = Math.round(Number(lon) * GRID) / GRID;
    return rlat.toFixed(2) + '_' + rlon.toFixed(2);
  }

  function routeKey(startKey, endKey) {
    if (!startKey || !endKey) return null;
    return startKey + '|' + endKey;
  }

  function timeSlotKey(date) {
    const d = new Date(date);
    const day = d.getDay();
    const hour = d.getHours();
    const period =
      hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
    const week = day === 0 || day === 6 ? 'weekend' : 'weekday';
    return week + '_' + period;
  }

  function weekdayRouteKey(date, startKey, endKey) {
    const dow = new Date(date).getDay();
    const rk = routeKey(startKey, endKey);
    return rk ? 'd' + dow + '_' + rk : null;
  }

  function speedProfile(trip) {
    const sec = Number(trip.seconds) || 0;
    const mi = Number(trip.miles) || 0;
    if (!sec || !mi) return 'unknown';
    const mph = (mi / sec) * 3600;
    if (mph < 15) return 'slow';
    if (mph < 45) return 'urban';
    if (mph < 65) return 'mixed';
    return 'fast';
  }

  function areaLabel(clusterKey, cluster) {
    if (!clusterKey) return 'Unknown area';
    if (cluster && cluster.label) return cluster.label;
    const parts = clusterKey.split('_');
    if (parts.length === 2) return 'Map area · ' + parts[0] + ', ' + parts[1];
    return 'Map area';
  }

  function countsToConfidence(counts, status) {
    const biz = counts.business || 0;
    const per = counts.personal || 0;
    const total = biz + per + (counts.skipped || 0);
    if (!total) return 0;
    const target = status === 'business' ? biz : per;
    const ratio = target / total;
    return Math.min(0.98, ratio * (0.5 + Math.min(total, 12) * 0.04));
  }

  function dominantStatus(counts) {
    const biz = counts.business || 0;
    const per = counts.personal || 0;
    const total = biz + per;
    if (!total) return null;
    if (biz / total >= 0.8) return { status: 'business', ratio: biz / total, total: total };
    if (per / total >= 0.8) return { status: 'personal', ratio: per / total, total: total };
    return {
      status: biz >= per ? 'business' : 'personal',
      ratio: Math.max(biz, per) / total,
      total: total,
      mixed: true,
    };
  }

  function routeVisitsThisMonth(model, rKey) {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return (model.events || []).filter(function (e) {
      if (e.routeKey !== rKey || e.final !== 'business') return false;
      const d = new Date(e.at || 0);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
  }

  function buildReason(analysis, trip, model, rKey, slot) {
    const dow = new Date(trip.startISO).toLocaleDateString('en-GB', { weekday: 'long' });
    const visits = rKey ? routeVisitsThisMonth(model, rKey) : 0;
    const routeCounts = rKey && model.routes[rKey] ? model.routes[rKey] : null;

    if (analysis.likelyLabel === 'Needs Review') {
      return "New route — we haven't seen this journey before. Needs review.";
    }

    if (analysis.status === 'business' && visits >= 4) {
      return 'Visited the same customer ' + visits + ' times this month';
    }
    if (analysis.status === 'business' && analysis.source === 'weekday_route') {
      return 'Every ' + dow + ' — usually Business';
    }
    if (analysis.status === 'personal' && slot && slot.indexOf('weekend') === 0) {
      return 'Weekend journey matching previous Personal trips';
    }
    if (analysis.status === 'personal' && analysis.source === 'time') {
      return 'Often marked Personal at this time';
    }
    if (analysis.status === 'business' && routeCounts && (routeCounts.business || 0) >= 3) {
      return 'Similar to previous Business journeys';
    }
    if (analysis.status === 'personal' && routeCounts && (routeCounts.personal || 0) >= 3) {
      return 'Often marked Personal on this route';
    }
    if (analysis.mixed) return 'Mixed history — please confirm';
    return analysis.status === 'business'
      ? 'Matches your usual Business pattern'
      : 'Matches your usual Personal pattern';
  }

  function likelyLabel(bizConf, perConf) {
    if (bizConf < REVIEW_THRESHOLD && perConf < REVIEW_THRESHOLD) return 'Needs Review';
    if (bizConf >= perConf && bizConf >= REVIEW_THRESHOLD) return 'Likely Business';
    if (perConf > bizConf && perConf >= REVIEW_THRESHOLD) return 'Likely Personal';
    return 'Needs Review';
  }

  function extractTripGeo(trip) {
    const route = trip.route || trip.routePoints || [];
    const start = route[0] || {};
    const end = route.length ? route[route.length - 1] : {};
    return {
      startLat: trip.startLat != null ? trip.startLat : start.lat,
      startLon: trip.startLon != null ? trip.startLon : start.lon,
      endLat: trip.endLat != null ? trip.endLat : end.lat,
      endLon: trip.endLon != null ? trip.endLon : end.lon,
    };
  }

  function analyseTrip(trip, model) {
    model = model || loadModel();
    const geo = extractTripGeo(trip);
    const startKey = clusterKey(geo.startLat, geo.startLon);
    const endKey = clusterKey(geo.endLat, geo.endLon);
    const rKey = routeKey(startKey, endKey);
    const slot = timeSlotKey(trip.startISO);
    const wdKey = weekdayRouteKey(trip.startISO, startKey, endKey);

    let bizConf = 0.2;
    let perConf = 0.2;
    let source = 'default';
    let mixed = false;

    if (rKey && model.routes[rKey]) {
      const dom = dominantStatus(model.routes[rKey]);
      if (dom) {
        if (dom.status === 'business') bizConf = Math.max(bizConf, countsToConfidence(model.routes[rKey], 'business'));
        else perConf = Math.max(perConf, countsToConfidence(model.routes[rKey], 'personal'));
        source = 'route';
        mixed = !!dom.mixed;
      }
    }
    if (wdKey && model.weekdayRoutes[wdKey]) {
      const dom = dominantStatus(model.weekdayRoutes[wdKey]);
      if (dom && dom.total >= 2) {
        if (dom.status === 'business') {
          bizConf = Math.max(bizConf, countsToConfidence(model.weekdayRoutes[wdKey], 'business'));
          source = 'weekday_route';
        } else {
          perConf = Math.max(perConf, countsToConfidence(model.weekdayRoutes[wdKey], 'personal'));
        }
        mixed = mixed || !!dom.mixed;
      }
    }
    if (model.timeSlots[slot]) {
      if ((model.timeSlots[slot].business || 0) > (model.timeSlots[slot].personal || 0)) {
        bizConf = Math.max(bizConf, countsToConfidence(model.timeSlots[slot], 'business') * 0.85);
      } else {
        perConf = Math.max(perConf, countsToConfidence(model.timeSlots[slot], 'personal') * 0.85);
        if (perConf > bizConf) source = 'time';
      }
    }

    const label = likelyLabel(bizConf, perConf);
    const status = bizConf >= perConf ? 'business' : 'personal';
    const confidence = Math.max(bizConf, perConf);
    const routeConfirmed = !!(rKey && model.confirmedRoutes[rKey]);

    const autoSortBusiness =
      bizConf >= BUSINESS_AUTO_THRESHOLD && !mixed && (routeConfirmed || bizConf >= 0.94);
    const autoSortPersonal = perConf >= PERSONAL_AUTO_THRESHOLD && perConf > bizConf && !mixed;
    const autoSort = autoSortBusiness || autoSortPersonal;

    const analysis = {
      tripId: trip.id,
      status: status,
      businessConfidence: Number(bizConf.toFixed(2)),
      personalConfidence: Number(perConf.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
      confidencePercent: Math.round(confidence * 100),
      likelyLabel: label,
      confidenceLabel: label === 'Needs Review' ? 'Needs Review' : Math.round(confidence * 100) + '%',
      source: source,
      mixed: mixed,
      startArea: areaLabel(startKey, model.clusters[startKey]),
      endArea: areaLabel(endKey, model.clusters[endKey]),
      autoSort: autoSort,
      autoSortBusiness: autoSortBusiness,
      autoSortPersonal: autoSortPersonal,
      needsReview: !autoSort,
    };

    analysis.reason = buildReason(analysis, trip, model, rKey, slot);
    analysis.explanation = {
      title: label,
      reason: analysis.reason,
      confidencePercent: analysis.confidencePercent,
    };
    return analysis;
  }

  function bumpCounter(obj, status) {
    if (!obj[status]) obj[status] = 0;
    obj[status]++;
  }

  function recordEvent(model, event) {
    model.events = model.events || [];
    model.events.push(event);
  }

  function learnFromClassification(trip, finalStatus, analysis, behaviour) {
    const model = loadModel();
    const geo = extractTripGeo(trip);
    const startKey = clusterKey(geo.startLat, geo.startLon);
    const endKey = clusterKey(geo.endLat, geo.endLon);
    const rKey = routeKey(startKey, endKey);
    const slot = timeSlotKey(trip.startISO);
    const wdKey = weekdayRouteKey(trip.startISO, startKey, endKey);
    const behaviourType = behaviour || 'accepted';

    if (behaviourType !== 'skipped' && finalStatus) {
      if (startKey) {
        if (!model.clusters[startKey]) {
          model.clusters[startKey] = { business: 0, personal: 0, lat: geo.startLat, lon: geo.startLon };
        }
        bumpCounter(model.clusters[startKey], finalStatus);
      }
      if (endKey) {
        if (!model.clusters[endKey]) {
          model.clusters[endKey] = { business: 0, personal: 0, lat: geo.endLat, lon: geo.endLon };
        }
        bumpCounter(model.clusters[endKey], finalStatus);
      }
      if (rKey) {
        if (!model.routes[rKey]) model.routes[rKey] = { business: 0, personal: 0 };
        bumpCounter(model.routes[rKey], finalStatus);
        if (behaviourType === 'accepted' && !analysis?.userCorrected) {
          model.confirmedRoutes[rKey] = finalStatus;
        }
      }
      if (wdKey) {
        if (!model.weekdayRoutes[wdKey]) model.weekdayRoutes[wdKey] = { business: 0, personal: 0 };
        bumpCounter(model.weekdayRoutes[wdKey], finalStatus);
      }
      if (!model.timeSlots[slot]) model.timeSlots[slot] = { business: 0, personal: 0 };
      bumpCounter(model.timeSlots[slot], finalStatus);
    } else if (behaviourType === 'skipped' && rKey) {
      if (!model.routes[rKey]) model.routes[rKey] = { business: 0, personal: 0, skipped: 0 };
      bumpCounter(model.routes[rKey], 'skipped');
    }

    recordEvent(model, {
      type: behaviourType,
      tripId: trip.id,
      suggested: analysis ? analysis.status : null,
      final: finalStatus || null,
      businessConfidence: analysis ? analysis.businessConfidence : null,
      personalConfidence: analysis ? analysis.personalConfidence : null,
      corrected: behaviourType === 'corrected',
      routeKey: rKey,
      miles: trip.miles,
      seconds: trip.seconds,
      speedProfile: speedProfile(trip),
      dayOfWeek: new Date(trip.startISO).getDay(),
      hour: new Date(trip.startISO).getHours(),
      at: new Date().toISOString(),
    });

    saveModel(model);
    return model;
  }

  function onUserClassification(trip, finalStatus, analysis) {
    const corrected =
      analysis && analysis.status && analysis.status !== finalStatus;
    const behaviour = corrected ? 'corrected' : 'accepted';
    learnFromClassification(trip, finalStatus, analysis, behaviour);
    if (trip) {
      trip.aiSuggestion = {
        status: analysis ? analysis.status : null,
        likelyLabel: analysis ? analysis.likelyLabel : null,
        confidence: analysis ? analysis.confidence : null,
        confidencePercent: analysis ? analysis.confidencePercent : null,
        reason: analysis ? analysis.reason : null,
        userCorrected: corrected,
        classifiedAt: new Date().toISOString(),
      };
    }
  }

  function onUserSkipped(trip, analysis) {
    learnFromClassification(trip, null, analysis, 'skipped');
  }

  function prepareDailyReview(trips, date, classifyFn) {
    const model = loadModel();
    const key = new Date(date).toDateString();
    const dayTrips = (trips || [])
      .filter(function (t) {
        return new Date(t.startISO).toDateString() === key;
      })
      .sort(function (a, b) {
        return new Date(a.startISO) - new Date(b.startISO);
      });

    let autoSorted = 0;
    const suggestions = {};
    const uncertain = [];

    dayTrips.forEach(function (trip) {
      const analysis = analyseTrip(trip, model);
      suggestions[trip.id] = analysis;
      if (trip.status !== 'pending') return;

      if (analysis.autoSort && typeof classifyFn === 'function') {
        const sortStatus = analysis.autoSortPersonal ? 'personal' : 'business';
        classifyFn(trip.id, sortStatus, analysis, false);
        autoSorted++;
      } else {
        uncertain.push({ trip: trip, suggestion: analysis });
      }
    });

    const sortedCount = dayTrips.filter(function (t) {
      return t.status !== 'pending';
    }).length;
    const needsReview = uncertain.length;

    return {
      total: dayTrips.length,
      autoSorted: autoSorted,
      alreadyClassified: sortedCount,
      needsReview: needsReview,
      uncertain: uncertain,
      suggestions: suggestions,
      headline: 'We found ' + dayTrips.length + ' journey' + (dayTrips.length === 1 ? '' : 's') + ' today.',
      subheadline:
        sortedCount > 0
          ? 'AI confidently sorted ' +
            sortedCount +
            '.' +
            (needsReview ? ' Only ' + needsReview + ' need your review.' : '')
          : needsReview
            ? 'Only ' + needsReview + ' need your review.'
            : 'All journeys are ready.',
    };
  }

  // Future module hooks — stubs for architecture expansion
  function analyseReceipt() {
    return { capability: 'receipts', available: false };
  }
  function analyseExpense() {
    return { capability: 'expenses', available: false };
  }
  function buildTaxSummary() {
    return { capability: 'tax', available: false };
  }

  global.MPMIE = {
    ENGINE_ID: 'MIE-v1',
    STORAGE_KEY: STORAGE_KEY,
    CAPABILITIES: CAPABILITIES,
    BUSINESS_AUTO_THRESHOLD: BUSINESS_AUTO_THRESHOLD,
    AUTO_SORT_THRESHOLD: BUSINESS_AUTO_THRESHOLD,
    PERSONAL_AUTO_THRESHOLD: PERSONAL_AUTO_THRESHOLD,
    loadModel: loadModel,
    saveModel: saveModel,
    analyseTrip: analyseTrip,
    suggestTrip: analyseTrip,
    learnFromClassification: learnFromClassification,
    learnFromTrip: learnFromClassification,
    onUserClassification: onUserClassification,
    onUserSkipped: onUserSkipped,
    prepareDailyReview: prepareDailyReview,
    areaLabel: areaLabel,
    extractTripGeo: extractTripGeo,
    clusterKey: clusterKey,
    analyseReceipt: analyseReceipt,
    analyseExpense: analyseExpense,
    buildTaxSummary: buildTaxSummary,
  };
})(typeof window !== 'undefined' ? window : global);
