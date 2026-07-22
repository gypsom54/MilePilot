/**
 * MilePilot Business Hub — Shell only (MP-S3-001)
 * Loaded by frontend/business-hub-preview.html — visual placeholders only.
 * No functionality, navigation, APIs, or storage.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mpBhShellRoot';

  var ICONS = {
    expenses: '<svg viewBox="0 0 24 24"><path d="M4 10h16M4 14h10"/><rect x="3" y="5" width="18" height="14" rx="3"/></svg>',
    receipt: '<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z"/><path d="M9 8h6M9 12h6"/></svg>',
    ask: '<svg viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 1 7 7c0 2.8-1.6 5.2-4 6.3V18l-3 2v-3.7A7 7 0 0 1 12 3z"/><circle cx="12" cy="10" r="1" fill="currentColor" stroke="none"/></svg>',
    vat: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/><circle cx="18" cy="17" r="3"/></svg>',
    health: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>',
    accountant: '<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M9 13h6M9 17h4"/></svg>'
  };

  var SHELL_HTML =
    '<div class="mp-bh-shell">' +
    '<p class="mp-bh-dev-banner">Development only · MP-S3-001 · Shell</p>' +

    '<header class="mp-bh-greeting">' +
    '<p class="mp-bh-greeting__primary">Good morning, Jonathan.</p>' +
    '<p class="mp-bh-greeting__secondary">Everything is ready.</p>' +
    '<div class="mp-bh-meta">' +
    '<span>Tuesday, 22 July</span>' +
    '<span class="mp-bh-meta__dot" aria-hidden="true"></span>' +
    '<span class="mp-bh-meta__weather" aria-hidden="true">' +
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>' +
    '12° · Partly cloudy</span>' +
    '</div></header>' +

    '<section class="mp-bh-section" aria-label="Today summary">' +
    '<h2 class="mp-ds-text-section-title">Today</h2>' +
    '<div class="mp-bh-summary">' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">24.6</span><span class="mp-ds-metric__label">Business miles</span></div>' +
    '<div class="mp-ds-metric mp-ds-metric--highlight"><span class="mp-ds-metric__value">£13.53</span><span class="mp-ds-metric__label">Claimable</span></div>' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">3</span><span class="mp-ds-metric__label">Tasks waiting</span></div>' +
    '</div></section>' +

    '<section class="mp-bh-section" aria-label="Business features">' +
    '<h2 class="mp-ds-text-section-title">Your business</h2>' +
    '<div class="mp-bh-feature-grid">' +
    featureCard('Expenses', 'Track and organise business spending.', ICONS.expenses) +
    featureCard('AI Receipt Scanner', 'Snap receipts — we handle the rest.', ICONS.receipt) +
    featureCard('Ask MilePilot', 'Get answers about your business.', ICONS.ask) +
    featureCard('VAT', 'Stay on top of your VAT position.', ICONS.vat) +
    featureCard('Business Health', 'See how your business is performing.', ICONS.health) +
    featureCard('Accountant Pack', 'Everything your accountant needs.', ICONS.accountant) +
    '</div></section>' +

    '<section class="mp-bh-section" aria-label="Recent activity">' +
    '<h2 class="mp-ds-text-section-title">Recent activity</h2>' +
    '<div class="mp-bh-timeline">' +
    timelineItem('Receipt scanned', '2h ago') +
    timelineItem('Mileage report prepared', 'Yesterday') +
    timelineItem('Trip reviewed', 'Yesterday') +
    timelineItem('VAT updated', 'Mon') +
    '</div></section>' +

    '<footer class="mp-bh-footer">' +
    '<p class="mp-bh-footer__line">Everything is up to date.</p>' +
    '<p class="mp-bh-footer__encourage">Enjoy your day.</p>' +
    '</footer>' +

    '</div>';

  function featureCard(title, desc, icon) {
    return '<div class="mp-bh-feature" role="presentation">' +
      '<span class="mp-bh-feature__icon" aria-hidden="true">' + icon + '</span>' +
      '<p class="mp-bh-feature__title">' + title + '</p>' +
      '<p class="mp-bh-feature__desc">' + desc + '</p>' +
      '</div>';
  }

  function timelineItem(text, time) {
    return '<div class="mp-bh-timeline__item">' +
      '<span class="mp-bh-timeline__dot" aria-hidden="true"></span>' +
      '<p class="mp-bh-timeline__text">' + text + '</p>' +
      '<span class="mp-bh-timeline__time">' + time + '</span>' +
      '</div>';
  }

  function mount() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root || root.dataset.mounted === '1') return root;
    root.innerHTML = SHELL_HTML;
    root.dataset.mounted = '1';
    return root;
  }

  global.MPBusinessHubShell = { mount: mount, ROOT_ID: ROOT_ID };
})(typeof window !== 'undefined' ? window : globalThis);
