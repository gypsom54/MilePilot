/**
 * MilePilot AI Daily Mileage Review
 * Private per-user habit model — separate from GPS/mileage engine.
 * Learns location clusters, routes, time patterns; auto-sorts confident journeys.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_ai_habit_model';
  const AUTO_SORT_THRESHOLD = 0.82;
  const REVIEW_THRESHOLD = 0.55;
  const MAX_CORRECTIONS = 300;
  const GRID = 200; // ~500 m location clusters

  function loadModel() {
    try {
      const raw = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
      return {
        clusters: raw.clusters || {},
        routes: raw.routes || {},
        timeSlots: raw.timeSlots || {},
        corrections: raw.corrections || [],
      };
    } catch (e) {
      return { clusters: {}, routes: {}, timeSlots: {}, corrections: [] };
    }
  }

  function saveModel(model) {
    try {
      global.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          clusters: model.clusters,
          routes: model.routes,
          timeSlots: model.timeSlots,
          corrections: (model.corrections || []).slice(-MAX_CORRECTIONS),
        })
      );
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

  function dominantStatus(counts) {
    const biz = counts.business || 0;
    const per = counts.personal || 0;
    const total = biz + per;
    if (!total) return null;
    if (biz / total >= 0.8) return { status: 'business', ratio: biz / total, total: total };
    if (per / total >= 0.8) return { status: 'personal', ratio: per / total, total: total };
    return { status: biz >= per ? 'business' : 'personal', ratio: Math.max(biz, per) / total, total: total, mixed: true };
  }

  function bumpCounter(obj, status) {
    if (!obj[status]) obj[status] = 0;
    obj[status]++;
  }

  function areaLabel(clusterKey, cluster) {
    if (!clusterKey) return 'Unknown area';
    if (cluster && cluster.label) return cluster.label;
    const parts = clusterKey.split('_');
    if (parts.length === 2) {
      return 'Map area · ' + parts[0] + ', ' + parts[1];
    }
    return 'Map area';
  }

  function reasonForSuggestion(suggestion, trip, model) {
    if (!suggestion || suggestion.confidence < REVIEW_THRESHOLD) {
      return 'New route — please confirm';
    }
    if (suggestion.source === 'route' && suggestion.status === 'business') {
      return 'Similar to previous Business journey';
    }
    if (suggestion.source === 'route' && suggestion.status === 'personal') {
      return 'Often marked Personal';
    }
    if (suggestion.source === 'cluster_start' && suggestion.status === 'business') {
      return 'You usually leave here for work';
    }
    if (suggestion.source === 'cluster_end' && suggestion.status === 'business') {
      return 'Regular business destination';
    }
    if (suggestion.source === 'time' && suggestion.status === 'personal') {
      return 'Often marked Personal at this time';
    }
    if (suggestion.mixed) return 'Mixed history — please confirm';
    if (suggestion.confidence >= AUTO_SORT_THRESHOLD) {
      return suggestion.status === 'business'
        ? 'Matches your usual Business pattern'
        : 'Matches your usual Personal pattern';
    }
    return 'Please confirm this journey';
  }

  function confidenceLabel(confidence) {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    if (confidence >= 0.45) return 'Low';
    return 'Uncertain';
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

  function suggestTrip(trip, model) {
    model = model || loadModel();
    const geo = extractTripGeo(trip);
    const startKey = clusterKey(geo.startLat, geo.startLon);
    const endKey = clusterKey(geo.endLat, geo.endLon);
    const rKey = routeKey(startKey, endKey);
    const slot = timeSlotKey(trip.startISO);

    let best = { status: 'business', confidence: 0.35, source: 'default', mixed: false };

    if (rKey && model.routes[rKey]) {
      const dom = dominantStatus(model.routes[rKey]);
      if (dom && dom.total >= 2) {
        const conf = Math.min(0.96, dom.ratio * (0.7 + Math.min(dom.total, 10) * 0.03));
        if (conf > best.confidence) {
          best = {
            status: dom.status,
            confidence: conf,
            source: 'route',
            mixed: !!dom.mixed,
          };
        }
      }
    }

    if (startKey && model.clusters[startKey]) {
      const dom = dominantStatus(model.clusters[startKey]);
      if (dom && dom.total >= 3) {
        const conf = Math.min(0.88, dom.ratio * (0.55 + Math.min(dom.total, 8) * 0.04));
        if (conf > best.confidence) {
          best = {
            status: dom.status,
            confidence: conf,
            source: 'cluster_start',
            mixed: !!dom.mixed,
          };
        }
      }
    }

    if (endKey && model.clusters[endKey]) {
      const dom = dominantStatus(model.clusters[endKey]);
      if (dom && dom.total >= 3) {
        const conf = Math.min(0.86, dom.ratio * (0.5 + Math.min(dom.total, 8) * 0.04));
        if (conf > best.confidence) {
          best = {
            status: dom.status,
            confidence: conf,
            source: 'cluster_end',
            mixed: !!dom.mixed,
          };
        }
      }
    }

    if (model.timeSlots[slot]) {
      const dom = dominantStatus(model.timeSlots[slot]);
      if (dom && dom.total >= 5) {
        const conf = Math.min(0.75, dom.ratio * (0.45 + Math.min(dom.total, 12) * 0.02));
        if (conf > best.confidence && best.confidence < 0.7) {
          best = {
            status: dom.status,
            confidence: conf,
            source: 'time',
            mixed: !!dom.mixed,
          };
        }
      }
    }

    if (!rKey && !startKey && !endKey) {
      best = { status: 'business', confidence: 0.3, source: 'default', mixed: false };
    }

    const reason = reasonForSuggestion(best, trip, model);
    return {
      tripId: trip.id,
      status: best.status,
      confidence: Number(best.confidence.toFixed(2)),
      confidenceLabel: confidenceLabel(best.confidence),
      reason: reason,
      source: best.source,
      startArea: areaLabel(startKey, model.clusters[startKey]),
      endArea: areaLabel(endKey, model.clusters[endKey]),
      autoSort: best.confidence >= AUTO_SORT_THRESHOLD && !best.mixed,
      needsReview: best.confidence < AUTO_SORT_THRESHOLD || best.mixed,
    };
  }

  function learnFromTrip(trip, finalStatus, suggestion, userCorrected) {
    const model = loadModel();
    const geo = extractTripGeo(trip);
    const startKey = clusterKey(geo.startLat, geo.startLon);
    const endKey = clusterKey(geo.endLat, geo.endLon);
    const rKey = routeKey(startKey, endKey);
    const slot = timeSlotKey(trip.startISO);

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
    }
    if (!model.timeSlots[slot]) model.timeSlots[slot] = { business: 0, personal: 0 };
    bumpCounter(model.timeSlots[slot], finalStatus);

    model.corrections.push({
      tripId: trip.id,
      suggested: suggestion ? suggestion.status : null,
      final: finalStatus,
      confidence: suggestion ? suggestion.confidence : null,
      corrected: !!userCorrected,
      miles: trip.miles,
      seconds: trip.seconds,
      dayOfWeek: new Date(trip.startISO).getDay(),
      hour: new Date(trip.startISO).getHours(),
      at: new Date().toISOString(),
    });

    saveModel(model);
    return model;
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
      const suggestion = suggestTrip(trip, model);
      suggestions[trip.id] = suggestion;
      if (trip.status !== 'pending') return;

      if (suggestion.autoSort && typeof classifyFn === 'function') {
        classifyFn(trip.id, suggestion.status, suggestion, false);
        autoSorted++;
      } else if (suggestion.needsReview) {
        uncertain.push({ trip: trip, suggestion: suggestion });
      }
    });

    const sortedCount = dayTrips.filter(function (t) {
      return t.status !== 'pending';
    }).length;

    return {
      total: dayTrips.length,
      autoSorted: autoSorted,
      alreadyClassified: sortedCount,
      needsReview: uncertain.length,
      uncertain: uncertain,
      suggestions: suggestions,
      headline:
        dayTrips.length > 0
          ? 'We found ' +
            dayTrips.length +
            ' journey' +
            (dayTrips.length === 1 ? '' : 's') +
            ' today. We have already sorted ' +
            sortedCount +
            ' for you.'
          : 'No journeys recorded today yet.',
    };
  }

  function onUserClassification(trip, finalStatus, suggestion) {
    const userCorrected =
      suggestion && suggestion.status && suggestion.status !== finalStatus;
    learnFromTrip(trip, finalStatus, suggestion, userCorrected);
    if (trip) {
      trip.aiSuggestion = {
        status: suggestion ? suggestion.status : null,
        confidence: suggestion ? suggestion.confidence : null,
        reason: suggestion ? suggestion.reason : null,
        userCorrected: userCorrected,
        classifiedAt: new Date().toISOString(),
      };
    }
  }

  global.MPAiReview = {
    STORAGE_KEY: STORAGE_KEY,
    AUTO_SORT_THRESHOLD: AUTO_SORT_THRESHOLD,
    loadModel: loadModel,
    saveModel: saveModel,
    suggestTrip: suggestTrip,
    learnFromTrip: learnFromTrip,
    prepareDailyReview: prepareDailyReview,
    onUserClassification: onUserClassification,
    areaLabel: areaLabel,
    confidenceLabel: confidenceLabel,
    reasonForSuggestion: reasonForSuggestion,
    extractTripGeo: extractTripGeo,
    clusterKey: clusterKey,
  };
})(typeof window !== 'undefined' ? window : global);
