/**
 * MilePilot Design System — Sprint 2 Premium Gallery
 * Loaded by frontend/design-system-preview.html only.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mpDsPreviewRoot';

  var LOADING_PHRASES = [
    'Preparing…',
    'Analysing…',
    'Checking…',
    'Calculating…',
    'Building report…',
    'Finding trips…'
  ];

  var PREVIEW_HTML =
    '<div class="mp-ds-preview-header">' +
    '<p class="mp-ds-preview-dev-banner">Development only · Sprint 2</p>' +
    '<h1 class="mp-ds-text-page-title">MilePilot Design System</h1>' +
    '<p class="mp-ds-text-body-sm">Premium visual language · v8.43.67 base</p>' +
    '<p class="mp-ds-preview-version">Sprint 2 — Calm · Premium · Alive</p>' +
    '</div>' +
    '<div class="mp-ds-preview-body mp-ds-stack mp-ds-stack-lg">' +

    /* Typography & colour */
    '<section class="mp-ds-section" id="ds-typography">' +
    '<h2 class="mp-ds-text-section-title">Typography &amp; colour</h2>' +
    '<div class="mp-ds-stack" style="gap:20px">' +
    '<p class="mp-ds-text-display">Display</p>' +
    '<p class="mp-ds-text-page-title">Page title</p>' +
    '<p class="mp-ds-text-question">What email should we send reports to?</p>' +
    '<p class="mp-ds-text-card-title">Card title</p>' +
    '<p class="mp-ds-text-body-lg">Body large — calm, readable supporting copy with generous breathing room.</p>' +
    '<p class="mp-ds-text-body">Body — standard interface text for descriptions and guidance.</p>' +
    '<p class="mp-ds-text-body-sm">Body small — secondary detail without fading away.</p>' +
    '<p class="mp-ds-text-caption">Caption label</p>' +
    '<p class="mp-ds-text-metadata">Metadata · 8.43.67 · Sprint 2</p>' +
    '</div>' +
    '<div class="mp-ds-swatch-row" style="margin-top:24px">' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#031126"></span><span class="mp-ds-swatch__label">Deep</span></div>' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#0B2348"></span><span class="mp-ds-swatch__label">Surface</span></div>' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#0D6BFF"></span><span class="mp-ds-swatch__label">Brand</span></div>' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#20D781"></span><span class="mp-ds-swatch__label">Success</span></div>' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#F0C35A"></span><span class="mp-ds-swatch__label">Warning</span></div>' +
    '<div class="mp-ds-swatch-wrap"><span class="mp-ds-swatch" style="background:#EF4444"></span><span class="mp-ds-swatch__label">Error</span></div>' +
    '</div></section>' +

    /* Buttons */
    '<section class="mp-ds-section" id="ds-buttons">' +
    '<h2 class="mp-ds-text-section-title">Buttons</h2>' +
    '<div class="mp-ds-btn-row">' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary">Primary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary is-pressed-demo">Pressed</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary is-selected">Selected</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary is-loading">Loading</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary is-success">✓ Saved</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--secondary">Secondary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--tertiary">Tertiary action</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary" disabled>Disabled</button>' +
    '</div></section>' +

    /* Microinteractions */
    '<section class="mp-ds-section" id="ds-micro">' +
    '<h2 class="mp-ds-text-section-title">Microinteractions</h2>' +
    '<div class="mp-ds-stack">' +
    '<div style="display:flex;align-items:center;gap:16px">' +
    '<span class="mp-ds-text-body-sm">Toggle</span>' +
    '<span class="mp-ds-toggle is-on" role="presentation"></span>' +
    '<span class="mp-ds-toggle" role="presentation"></span>' +
    '</div>' +
    '<div class="mp-ds-check is-checked"><span class="mp-ds-check__box"><svg class="mp-ds-check__tick" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Auto-classify business trips</div>' +
    '<div class="mp-ds-check"><span class="mp-ds-check__box"><svg class="mp-ds-check__tick" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Email weekly summaries</div>' +
    '<div class="mp-ds-radio is-selected"><span class="mp-ds-radio__ring"><span class="mp-ds-radio__dot"></span></span>AutoPilot tracking</div>' +
    '<div class="mp-ds-radio"><span class="mp-ds-radio__ring"><span class="mp-ds-radio__dot"></span></span>Manual tracking</div>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' +
    '<span class="mp-ds-select-compact">Weekly</span>' +
    '<span class="mp-ds-select-compact is-selected">AutoPilot</span>' +
    '<span class="mp-ds-select-compact">Monthly</span>' +
    '</div></div></section>' +

    /* Inputs */
    '<section class="mp-ds-section" id="ds-inputs">' +
    '<h2 class="mp-ds-text-section-title">Inputs</h2>' +
    '<div class="mp-ds-stack">' +
    '<div class="mp-ds-field mp-ds-field--float">' +
    '<input class="mp-ds-input" type="email" placeholder=" " id="dsFloatDefault" />' +
    '<label class="mp-ds-field__label" for="dsFloatDefault">Email address</label></div>' +
    '<div class="mp-ds-field mp-ds-field--float is-filled">' +
    '<input class="mp-ds-input is-focus-demo" type="email" value="reports@milepilot.uk" placeholder=" " id="dsFloatFocus" />' +
    '<label class="mp-ds-field__label" for="dsFloatFocus">Email address</label></div>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Error</span>' +
    '<input class="mp-ds-input is-error" type="text" value="invalid@" />' +
    '<span class="mp-ds-field-hint">Enter a valid email address</span></label>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Success</span>' +
    '<input class="mp-ds-input is-success" type="email" value="gypsom54@gmail.com" readonly />' +
    '<span class="mp-ds-field-hint is-success">Looks good</span></label>' +
    '<label class="mp-ds-field"><span class="mp-ds-text-label">Disabled</span>' +
    '<input class="mp-ds-input" type="text" disabled placeholder="Unavailable" /></label>' +
    '</div></section>' +

    /* Cards */
    '<section class="mp-ds-section" id="ds-cards">' +
    '<h2 class="mp-ds-text-section-title">Cards</h2>' +
    '<div class="mp-ds-stack">' +
    '<div class="mp-ds-card"><p class="mp-ds-text-card-title">Standard</p>' +
    '<p class="mp-ds-text-body-sm">Suspended surface with ambient shadow and internal highlight.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--elevated"><p class="mp-ds-text-card-title">Elevated</p>' +
    '<p class="mp-ds-text-body-sm">Higher emphasis for grouped content blocks.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--selected"><p class="mp-ds-text-card-title">Selected</p>' +
    '<p class="mp-ds-text-body-sm">Active emphasis with restrained blue edge lighting.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--summary"><p class="mp-ds-card__eyebrow">This week</p>' +
    '<p class="mp-ds-text-card-title">£142.60 claimed</p>' +
    '<p class="mp-ds-text-body-sm">Across 8 business trips · HMRC ready</p></div>' +
    '<div class="mp-ds-card mp-ds-card--info"><p class="mp-ds-text-card-title">Information</p>' +
    '<p class="mp-ds-text-body-sm">AutoPilot runs quietly in the background while you drive.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--action"><p class="mp-ds-text-card-title">Action</p>' +
    '<p class="mp-ds-text-body-sm">Tap to review and classify pending journeys.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--success"><p class="mp-ds-text-card-title">Success</p>' +
    '<p class="mp-ds-text-body-sm">Your daily summary was emailed at 11:59pm.</p></div>' +
    '<div class="mp-ds-card mp-ds-card--warning"><p class="mp-ds-text-card-title">Warning</p>' +
    '<p class="mp-ds-text-body-sm">3 trips need classification before your report sends.</p></div>' +
    '<div class="mp-ds-grid-2">' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">12.4</span><span class="mp-ds-metric__label">Miles</span></div>' +
    '<div class="mp-ds-metric mp-ds-metric--highlight"><span class="mp-ds-metric__value">£6.82</span><span class="mp-ds-metric__label">HMRC est.</span></div>' +
    '</div></div></section>' +

    /* Conversation */
    '<section class="mp-ds-section" id="ds-conversation">' +
    '<h2 class="mp-ds-text-section-title">Conversation</h2>' +
    '<div class="mp-ds-conversation">' +
    '<div class="mp-ds-assistant">I can help you understand your mileage and prepare HMRC-ready reports.</div>' +
    '<div class="mp-ds-typing" aria-label="Assistant typing"><span></span><span></span><span></span></div>' +
    '<div class="mp-ds-assistant mp-ds-assistant--streaming" id="dsStreamDemo">Your last month total is £142</div>' +
    '<div class="mp-ds-user-bubble is-confirmed">How much did I claim last month?</div>' +
    '</div></section>' +

    /* Loading */
    '<section class="mp-ds-section" id="ds-loading">' +
    '<h2 class="mp-ds-text-section-title">Intelligent loading</h2>' +
    '<div class="mp-ds-stack" id="dsLoadingList">' +
    '<div class="mp-ds-loading"><span class="mp-ds-loading__pulse"></span><span class="mp-ds-loading__text">Preparing…</span></div>' +
  '</div></section>' +

    /* Empty & success */
    '<section class="mp-ds-section" id="ds-states">' +
    '<h2 class="mp-ds-text-section-title">Empty &amp; success</h2>' +
    '<div class="mp-ds-stack">' +
    '<div class="mp-ds-empty">' +
    '<div class="mp-ds-empty__illus">🛣</div>' +
    '<p class="mp-ds-empty__title">No trips yet</p>' +
    '<p class="mp-ds-empty__body">Your first AutoPilot shift will appear here. Start driving and we\'ll handle the rest.</p>' +
    '<span class="mp-ds-empty__action">Learn how AutoPilot works →</span></div>' +
    '<div class="mp-ds-success"><span class="mp-ds-success__icon">✓</span>Report sent successfully</div>' +
    '<span class="mp-ds-badge"><span class="mp-ds-badge__dot"></span>AutoPilot Active</span>' +
    '</div></section>' +

    /* Sheet & modal */
    '<section class="mp-ds-section" id="ds-sheet-modal">' +
    '<h2 class="mp-ds-text-section-title">Sheet &amp; modal</h2>' +
    '<div class="mp-ds-modal-demo"><div class="mp-ds-modal-demo__backdrop"></div>' +
    '<p class="mp-ds-text-card-title">Confirm end shift?</p>' +
    '<p class="mp-ds-text-body-sm">Your mileage will be saved and a summary prepared.</p>' +
    '<div class="mp-ds-btn-row" style="margin-top:20px">' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary">End shift</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--tertiary">Keep driving</button>' +
    '</div></div>' +
    '<div class="mp-ds-sheet-demo"><div class="mp-ds-sheet-demo__handle"></div>' +
    '<p class="mp-ds-text-card-title">Classify trip</p>' +
    '<p class="mp-ds-text-body-sm">Was this journey for business or personal?</p>' +
    '<div style="display:flex;gap:10px;margin-top:16px">' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary" style="flex:1">Business</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--secondary" style="flex:1">Personal</button>' +
    '</div></div></section>' +

    /* Motion notes */
    '<section class="mp-ds-section" id="ds-motion">' +
    '<h2 class="mp-ds-text-section-title">Motion &amp; animation</h2>' +
    '<div class="mp-ds-motion-note">' +
    '<p class="mp-ds-text-body-sm">Every component fades, slides, or scales into view. Interactions use physical press compression and hover lift. All presets honour <code>prefers-reduced-motion: reduce</code>.</p>' +
    '<ul>' +
    '<li>Buttons — hover lift, press compression, glow on focus</li>' +
    '<li>Inputs — floating label, focus glow, error shake, success pulse</li>' +
    '<li>Cards — suspended depth, edge lighting, hover elevation</li>' +
    '<li>Conversation — fade-rise assistant, slide-up user, typing dots</li>' +
    '<li>Loading — intelligent phrase rotation, pulse indicator</li>' +
    '<li>Success — tick pop, gentle glow, colour shift</li>' +
    '</ul></div></section>' +

    /* Composition */
    '<section class="mp-ds-section" id="ds-composition">' +
    '<h2 class="mp-ds-text-section-title">Example composition</h2>' +
    '<div class="mp-ds-card mp-ds-card--elevated mp-ds-composition">' +
    '<p class="mp-ds-card__eyebrow">AutoPilot setup</p>' +
    '<p class="mp-ds-text-question" style="margin-bottom:20px">Where should we send your reports?</p>' +
    '<div class="mp-ds-field mp-ds-field--float is-filled">' +
    '<input class="mp-ds-input is-focus-demo" type="email" value="you@business.co.uk" placeholder=" " />' +
    '<label class="mp-ds-field__label">Email address</label></div>' +
    '<div class="mp-ds-conversation" style="margin:20px 0">' +
    '<div class="mp-ds-assistant">I\'ll email HMRC-ready summaries automatically after each shift.</div>' +
    '</div>' +
    '<div class="mp-ds-grid-2" style="margin-bottom:20px">' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">7</span><span class="mp-ds-metric__label">Day trial</span></div>' +
    '<div class="mp-ds-metric"><span class="mp-ds-metric__value">45p</span><span class="mp-ds-metric__label">Per mile</span></div>' +
    '</div>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary">Continue</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--tertiary">Skip for now</button>' +
    '</div></section>' +

    '</div>';

  function mount() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root || root.dataset.mounted === '1') return root;
    root.innerHTML = PREVIEW_HTML;
    root.dataset.mounted = '1';
    initDemos(root);
    return root;
  }

  function initDemos(root) {
    initLoadingCycle(root);
    initStreamingDemo(root);
    initMicroToggles(root);
  }

  function initLoadingCycle(root) {
    var list = root.querySelector('#dsLoadingList');
    if (!list) return;
    var idx = 0;
    var items = LOADING_PHRASES.map(function (phrase) {
      return '<div class="mp-ds-loading" style="display:none"><span class="mp-ds-loading__pulse"></span><span class="mp-ds-loading__text">' + phrase + '</span></div>';
    });
    list.innerHTML = items.join('');
    var els = list.querySelectorAll('.mp-ds-loading');
    if (!els.length) return;
    els[0].style.display = 'flex';
    setInterval(function () {
      els[idx].style.display = 'none';
      idx = (idx + 1) % els.length;
      els[idx].style.display = 'flex';
    }, 2400);
  }

  function initStreamingDemo(root) {
    var el = root.querySelector('#dsStreamDemo');
    if (!el) return;
    var full = 'Your last month total is £142.60 across 8 business trips.';
    var shown = 'Your last month total is £142';
    var i = shown.length;
    var timer = setInterval(function () {
      if (i >= full.length) {
        clearInterval(timer);
        el.classList.remove('mp-ds-assistant--streaming');
        return;
      }
      el.textContent = full.slice(0, ++i);
    }, 55);
  }

  function initMicroToggles(root) {
    root.querySelectorAll('.mp-ds-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('is-on');
      });
    });
    root.querySelectorAll('.mp-ds-check').forEach(function (check) {
      check.addEventListener('click', function () {
        check.classList.toggle('is-checked');
      });
    });
    root.querySelectorAll('.mp-ds-radio').forEach(function (radio) {
      radio.addEventListener('click', function () {
        root.querySelectorAll('.mp-ds-radio').forEach(function (r) { r.classList.remove('is-selected'); });
        radio.classList.add('is-selected');
      });
    });
    root.querySelectorAll('.mp-ds-select-compact').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var parent = chip.parentElement;
        if (!parent) return;
        parent.querySelectorAll('.mp-ds-select-compact').forEach(function (c) { c.classList.remove('is-selected'); });
        chip.classList.add('is-selected');
      });
    });
  }

  global.MPDesignSystemPreview = { mount: mount, ROOT_ID: ROOT_ID };
})(typeof window !== 'undefined' ? window : globalThis);
