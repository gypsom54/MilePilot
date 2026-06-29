/**
 * MilePilot Trip Map — route evidence (on-demand generation only)
 * Store GPS polylines + coordinates on trips — never persist rendered map images.
 * generateTripMapImage() is called when viewing trips, building PDFs, or sending reports.
 * Replace later with Google Static Maps, Mapbox, or OSM renderer.
 */
(function (global) {
  'use strict';

  function routePoints(trip) {
    const pts = trip && (trip.route || trip.routePoints);
    if (!Array.isArray(pts)) return [];
    return pts.filter(function (p) {
      return p && p.lat != null && p.lon != null && isFinite(p.lat) && isFinite(p.lon);
    });
  }

  function formatTripLocation(trip, which) {
    if (!trip) return '—';
    const lat = which === 'start' ? trip.startLat : trip.endLat;
    const lon = which === 'start' ? trip.startLon : trip.endLon;
    if (lat == null || lon == null) {
      const pts = routePoints(trip);
      if (!pts.length) return '—';
      const p = which === 'start' ? pts[0] : pts[pts.length - 1];
      return Number(p.lat).toFixed(4) + ', ' + Number(p.lon).toFixed(4);
    }
    return Number(lat).toFixed(4) + ', ' + Number(lon).toFixed(4);
  }

  /**
   * Returns SVG data URL for a trip route thumbnail.
   * @returns {{ format: string, dataUrl: string|null, width: number, height: number, placeholder: boolean }}
   */
  function generateTripMapImage(trip, options) {
    options = options || {};
    const width = options.width || 280;
    const height = options.height || 120;
    const pts = routePoints(trip);
    if (pts.length < 2) {
      return { format: 'svg', dataUrl: null, width: width, height: height, placeholder: true };
    }

    const lats = pts.map(function (p) {
      return p.lat;
    });
    const lons = pts.map(function (p) {
      return p.lon;
    });
    const minLat = Math.min.apply(null, lats);
    const maxLat = Math.max.apply(null, lats);
    const minLon = Math.min.apply(null, lons);
    const maxLon = Math.max.apply(null, lons);
    const latR = maxLat - minLat || 0.001;
    const lonR = maxLon - minLon || 0.001;
    const pad = 12;
    const innerW = width - pad * 2;
    const innerH = height - pad * 2;

    function xy(p) {
      const x = pad + ((p.lon - minLon) / lonR) * innerW;
      const y = pad + innerH - ((p.lat - minLat) / latR) * innerH;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }

    const line = pts.map(xy).join(' ');
    const start = xy(pts[0]);
    const end = xy(pts[pts.length - 1]);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      width +
      '" height="' +
      height +
      '" viewBox="0 0 ' +
      width +
      ' ' +
      height +
      '">' +
      '<rect width="100%" height="100%" rx="12" fill="#0B2348"/>' +
      '<polyline fill="none" stroke="#0D6BFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="' +
      line +
      '"/>' +
      '<circle cx="' +
      start.split(',')[0] +
      '" cy="' +
      start.split(',')[1] +
      '" r="5" fill="#20D781" stroke="#fff" stroke-width="1.5"/>' +
      '<circle cx="' +
      end.split(',')[0] +
      '" cy="' +
      end.split(',')[1] +
      '" r="5" fill="#0D6BFF" stroke="#fff" stroke-width="1.5"/>' +
      '</svg>';

    return {
      format: 'svg',
      dataUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
      width: width,
      height: height,
      placeholder: false,
    };
  }

  function renderTripMapThumbHtml(trip, className) {
    const map = generateTripMapImage(trip, { width: 120, height: 72 });
    if (!map.dataUrl) {
      return (
        '<div class="' +
        (className || 'pending-trip-map-thumb') +
        ' is-empty"><span>No route</span></div>'
      );
    }
    return (
      '<img class="' +
      (className || 'pending-trip-map-thumb') +
      '" src="' +
      map.dataUrl +
      '" alt="Route preview" width="120" height="72" loading="lazy"/>'
    );
  }

  global.MPTripMap = {
    routePoints: routePoints,
    formatTripLocation: formatTripLocation,
    generateTripMapImage: generateTripMapImage,
    renderTripMapThumbHtml: renderTripMapThumbHtml,
  };
})(typeof window !== 'undefined' ? window : global);
