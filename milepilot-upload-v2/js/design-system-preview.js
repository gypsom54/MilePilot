/**
 * MilePilot Design System — dev-only component gallery
 * Open: ?ds=preview or ?debug=designsystem
 * Does not affect production routing or engine logic.
 */
(function (global) {
  'use strict';

  var PREVIEW_HTML =
    '<div class="mp-ds-preview-header">' +
    '<p class="mp-ds-preview-dev-banner">Development only · Sprint 1</p>' +
    '<h1 class="mp-ds-text-page-title">MilePilot Design System</h1>' +
    '<p class="mp-ds-text-body-sm">Shared visual foundation · v8.43.67 base</p>' +
    '</div>' +
    '<div class="mp-ds-preview-body mp-ds-stack mp-ds-stack-lg">' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Typography</h2>' +
    '<div class="mp-ds-stack">' +
    '<p class="mp-ds-text-display">Display</p>' +
    '<p class="mp-ds-text-page-title">Page title</p>' +
    '<p class="mp-ds-text-question">What email should we send reports to?</p>' +
    '<p class="mp-ds-text-card-title">Card title</p>' +
    '<p class="mp-ds-text-body-lg">Body large — calm, readable supporting copy.</p>' +
    '<p class="mp-ds-text-body">Body — standard interface text for descriptions.</p>' +
    '<p class="mp-ds-text-body-sm">Body small — secondary detail without fading away.</p>' +
    '<p class="mp-ds-text-caption">Caption label</p>' +
    '<p class="mp-ds-text-metadata">METADATA · 8.43.67</p>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Colour roles</h2>' +
    '<div class="mp-ds-swatch-row">' +
    '<span class="mp-ds-swatch" style="background:#031126" title="background-primary"></span>' +
    '<span class="mp-ds-swatch" style="background:#0B2348" title="surface"></span>' +
    '<span class="mp-ds-swatch" style="background:#0D6BFF" title="brand-primary"></span>' +
    '<span class="mp-ds-swatch" style="background:#20D781" title="success"></span>' +
    '<span class="mp-ds-swatch" style="background:#F0C35A" title="warning"></span>' +
    '<span class="mp-ds-swatch" style="background:#EF4444" title="error"></span>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Buttons</h2>' +
    '<div class="mp-ds-btn-row">' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary">Primary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--secondary">Secondary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--tertiary">Tertiary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary" disabled>Disabled primary</button>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Selection</h2>' +
    '<div class="mp-ds-stack">' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<span class="mp-ds-select-compact">Weekly</span>' +
    '<span class="mp-ds-select-compact is-selected">AutoPilot</span>' +
    '</div>' +
    '<button type="button" class="mp-ds-select-card is-selected">' +
    '<span class="mp-ds-select-card__icon"></span>' +
    '<span><span class="mp-ds-select-card__title">Auto Track</span>' +
    '<span class="mp-ds-select-card__desc">Mileage records automatically while you work.</span></span>' +
    '</button>' +
    '<button type="button" class="mp-ds-select-card">' +
    '<span class="mp-ds-select-card__icon"></span>' +
    '<span><span class="mp-ds-select-card__title">Manual Track</span>' +
    '<span class="mp-ds-select-card__desc">Start and end shifts yourself.</span></span>' +
    '</button></div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Inputs</h2>' +
    '<div class="mp-ds-stack">' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Email</span>' +
    '<input class="mp-ds-input" type="email" placeholder="you@business.co.uk" value="reports@milepilot.uk" /></label>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Error state</span>' +
    '<input class="mp-ds-input is-error" type="text" value="invalid@" />' +
    '<span class="mp-ds-field-hint">Enter a valid email address</span></label>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Success state</span>' +
    '<input class="mp-ds-input is-success" type="email" value="gypsom54@gmail.com" readonly />' +
    '<span class="mp-ds-field-hint is-success">Looks good</span></label>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Disabled</span>' +
    '<input class="mp-ds-input" type="text" disabled placeholder="Unavailable" /></label>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Cards</h2>' +
    '<div class="mp-ds-stack">' +
    '<div class="mp-ds-card"><p class="mp-ds-text-card-title">Standard card</p>' +
    '<p class="mp-ds-text-body-sm">Elevated surface with restrained border and depth.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--elevated"><p class="mp-ds-text-card-title">Elevated card</p>' +
    '<p class="mp-ds-text-body-sm">Higher emphasis for grouped content.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--selected"><p class="mp-ds-text-card-title">Selected card</p>' +
    '<p class="mp-ds-text-body-sm">Active emphasis with controlled blue glow.</p></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">12.4</span><span class="mp-ds-metric__label">Miles</span></div>' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">£6.82</span><span class="mp-ds-metric__label">HMRC est.</span></div>' +
    '</div></div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Status</h2>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<span class="mp-ds-badge"><span class="mp-ds-badge__dot"></span>AutoPilot Active</span>' +
    '<span class="mp-ds-badge mp-ds-badge--success"><span class="mp-ds-badge__dot"></span>Everything working</span>' +
    '<span class="mp-ds-badge mp-ds-badge--warn"><span class="mp-ds-badge__dot"></span>Location needed</span>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Conversation</h2>' +
    '<div class="mp-ds-conversation">' +
    '<div class="mp-ds-assistant">I can help you understand your mileage and prepare HMRC-ready reports.</div>' +
    '<div class="mp-ds-user-bubble">How much did I claim last month?</div>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">States</h2>' +
    '<div class="mp-ds-stack">' +
    '<div class="mp-ds-loading"><span class="mp-ds-loading__spinner"></span>Preparing your summary…</div>' +
    '<div class="mp-ds-success"><span class="mp-ds-success__icon">✓</span>Report sent successfully</div>' +
    '<div class="mp-ds-empty"><p class="mp-ds-empty__title">No trips yet</p>' +
    '<p class="mp-ds-empty__body">Your first AutoPilot shift will appear here.</p></div>' +
    '</div></section>' +

    '<section class="mp-ds-section">' +
    '<h2 class="mp-ds-text-section-title">Sheet &amp; modal</h2>' +
    '<div class="mp-ds-modal-demo"><div class="mp-ds-modal-demo__backdrop"></div>' +
    '<p class="mp-ds-text-card-title">Modal container</p>' +
    '<p class="mp-ds-text-body-sm">For confirmations and focused tasks.</p></div>' +
    '<div class="mp-ds-sheet-demo"><div class="mp-ds-sheet-demo__handle"></div>' +
    '<p class="mp-ds-text-card-title">Bottom sheet</p>' +
    '<p class="mp-ds-text-body-sm">For contextual actions without leaving the screen.</p></div>' +
    '</section>' +

    '<button type="button" class="mp-ds-btn mp-ds-btn--secondary" id="mpDsPreviewClose">Close preview</button>' +
    '</div>';

  function isPreviewRequested() {
    try {
      var params = new URLSearchParams(global.location.search);
      var ds = params.get('ds');
      var debug = params.get('debug');
      return ds === 'preview' || debug === 'designsystem';
    } catch (e) {
      return false;
    }
  }

  function mount() {
    var section = global.document.getElementById('designSystemPreview');
    if (!section || section.dataset.mounted === '1') return section;
    section.className = 'screen mp-ds-root';
    section.innerHTML = PREVIEW_HTML;
    section.dataset.mounted = '1';
    section.removeAttribute('aria-hidden');
    var closeBtn = section.querySelector('#mpDsPreviewClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        MPDesignSystemPreview.close();
      });
    }
    return section;
  }

  function open() {
    mount();
    if (typeof global.showScreen === 'function') {
      global.showScreen('designSystemPreview');
    }
  }

  function close() {
    try {
      var params = new URLSearchParams(global.location.search);
      params.delete('ds');
      params.delete('debug');
      var qs = params.toString();
      var next = global.location.pathname + (qs ? '?' + qs : '') + global.location.hash;
      global.history.replaceState({}, '', next);
    } catch (e) {}
    if (typeof global.goHome === 'function' && global.localStorage.getItem('mp_onboard_complete') === 'true') {
      global.goHome();
      return;
    }
    if (typeof global.showScreen === 'function') {
      global.showScreen('welcome');
      if (typeof global.initFirstImpression === 'function') global.initFirstImpression();
    }
  }

  global.MPDesignSystemPreview = {
    open: open,
    close: close,
    isPreviewRequested: isPreviewRequested,
    mount: mount,
  };
})(typeof window !== 'undefined' ? window : globalThis);
