/**
 * MilePilot Ask MilePilot — Shell (MP-S4-001 / MP-S4-002 / MP-S4-003 — APPROVED AND LOCKED)
 * Standalone scenario previews only. No AI, APIs, or business logic.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mpAskShellRoot';

  var SEND = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHAT = '<svg viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 1 7 7c0 2.8-1.6 5.2-4 6.3V18l-3 2v-3.7A7 7 0 0 1 12 3z"/></svg>';
  var ATTACH = '<svg viewBox="0 0 24 24"><path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9M12 3v12M8 7l4-4 4 4"/></svg>';
  var VOICE = '<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/></svg>';

  var SCENARIOS = {
    empty: { label: 'Empty workspace', render: renderEmpty },
    simple: { label: 'Simple answer', render: renderSimple },
    detailed: { label: 'Detailed answer', render: renderDetailed },
    insight: { label: 'Business insight', render: renderInsight },
    confirm: { label: 'Action confirmation', render: renderConfirm }
  };

  function mount() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root) return null;
    var scenario = getScenario();
    root.innerHTML = SCENARIOS[scenario].render(scenario) + scenarioNav(scenario);
    root.dataset.mounted = '1';
    root.dataset.scenario = scenario;
    return root;
  }

  function getScenario() {
    var params = new URLSearchParams(global.location.search);
    var s = params.get('s');
    if (!s && global.location.hash) {
      s = global.location.hash.replace(/^#/, '');
    }
    s = s || 'empty';
    return SCENARIOS[s] ? s : 'empty';
  }

  function headerBlock() {
    return '<header class="mp-ask-header">' +
      '<h1 class="mp-ask-header__title">Ask MilePilot</h1>' +
      '<p class="mp-ask-header__promise">Your business can finally answer your questions.</p>' +
      '</header>';
  }

  function heroInput() {
    return '<div class="mp-ask-hero-input">' +
      '<div class="mp-ask-input-wrap">' +
      '<textarea class="mp-ask-input" rows="2" placeholder="Ask anything about your business…" readonly aria-label="Ask MilePilot"></textarea>' +
      '<span class="mp-ask-input__send" aria-hidden="true">' + SEND + '</span>' +
      '</div></div>';
  }

  function composer() {
    return '<div class="mp-ask-composer" role="presentation">' +
      '<span class="mp-ask-composer__attach" aria-hidden="true" title="Attachment (reserved)">' + ATTACH + '</span>' +
      '<div class="mp-ask-composer__field">' +
      '<input class="mp-ask-composer__input" type="text" placeholder="Ask anything about your business…" readonly aria-label="Ask MilePilot" />' +
      '<span class="mp-ask-composer__send" aria-hidden="true">' + SEND + '</span>' +
      '</div>' +
      '<span class="mp-ask-composer__voice" aria-hidden="true" title="Voice (reserved)">' + VOICE + '</span>' +
      '</div>';
  }

  function userBubble(text) {
    return '<div class="mp-ask-user">' + text + '</div>';
  }

  function processing(text) {
    return '<div class="mp-ask-processing" aria-live="polite">' +
      '<span class="mp-ask-processing__dot" aria-hidden="true"></span>' +
      '<span>' + text + '</span></div>';
  }

  function followups(items) {
    return '<div class="mp-ask-followups" aria-label="Suggested follow-ups">' +
      items.map(function (t) { return '<span class="mp-ask-followup">' + t + '</span>'; }).join('') +
      '</div>';
  }

  function recentSection() {
    return '<section class="mp-ask-recent" aria-label="Recent conversations">' +
      '<h2 class="mp-ds-text-section-title">Recent conversations</h2>' +
      '<div class="mp-ask-recent__list">' +
      recentItem('How much did I claim last month?') +
      recentItem('Show my VAT position') +
      '</div></section>';
  }

  function recentItem(text) {
    return '<div class="mp-ask-recent__item" role="presentation">' +
      '<span class="mp-ask-recent__icon" aria-hidden="true">' + CHAT + '</span>' +
      '<span>' + text + '</span></div>';
  }

  function suggestion(text) {
    return '<span class="mp-ask-suggestion" role="presentation">' + text + '</span>';
  }

  function scenarioNav(active) {
    if (new URLSearchParams(global.location.search).get('nav') === '0') return '';
    var links = Object.keys(SCENARIOS).map(function (key) {
      var cls = key === active ? ' class="is-active"' : '';
      return '<a href="?s=' + key + '"' + cls + '>' + SCENARIOS[key].label + '</a>';
    });
    return '<nav class="mp-ask-scenario-nav" aria-label="Scenario preview">' + links.join('') + '</nav>';
  }

  /* —— Scenario 1: Empty workspace —— */
  function renderEmpty(scenario) {
    return '<div class="mp-ask-scene">' +
      '<div class="mp-ask-scene__body">' +
      headerBlock() +
      heroInput() +
      '<div class="mp-ask-suggestions" aria-label="Suggested questions">' +
      suggestion('How much did I claim this month?') +
      suggestion('How much did I spend on fuel?') +
      suggestion('What is my VAT position?') +
      suggestion('Prepare my accountant pack') +
      '</div>' +
      recentSection() +
      '</div></div>';
  }

  /* —— Scenario 2: Simple answer —— */
  function renderSimple(scenario) {
    return '<div class="mp-ask-scene mp-ask-scene--with-composer">' +
      '<div class="mp-ask-scene__body">' +
      userBubble('How much did I claim this month?') +
      processing('Checking your mileage…') +
      '<div class="mp-ask-answer-surface">' +
      '<p class="mp-ask-answer-surface__hero">£64.17</p>' +
      '<p class="mp-ask-answer-surface__detail">You claimed <strong>£64.17</strong> from <strong>142.6 business miles</strong> across <strong>12 trips</strong> this month.</p>' +
      '</div>' +
      followups(['Show the trip breakdown', 'Compare with last month', 'Prepare my mileage report']) +
      '</div>' +
      composer() +
      '</div>';
  }

  /* —— Scenario 3: Detailed business answer —— */
  function renderDetailed(scenario) {
    return '<div class="mp-ask-scene mp-ask-scene--with-composer">' +
      '<div class="mp-ask-scene__body">' +
      userBubble('Explain my mileage claim for this month.') +
      '<div class="mp-ask-detail-surface">' +
      '<p class="mp-ask-detail-surface__summary">Your July mileage claim at a glance.</p>' +
      '<div class="mp-ask-figures">' +
      '<div class="mp-ds-metric"><span class="mp-ds-metric__value">142.6</span><span class="mp-ds-metric__label">Business miles</span></div>' +
      '<div class="mp-ds-metric"><span class="mp-ds-metric__value">12</span><span class="mp-ds-metric__label">Total trips</span></div>' +
      '<div class="mp-ds-metric mp-ds-metric--highlight"><span class="mp-ds-metric__value">£64.17</span><span class="mp-ds-metric__label">Claimable</span></div>' +
      '<div class="mp-ds-metric"><span class="mp-ds-metric__value">3</span><span class="mp-ds-metric__label">Pending</span></div>' +
      '</div>' +
      '<table class="mp-ask-response-table"><thead><tr><th>Date</th><th>Miles</th><th>Claim</th></tr></thead>' +
      '<tbody>' +
      '<tr><td>Mon 7</td><td>18.2</td><td>£8.19</td></tr>' +
      '<tr><td>Wed 14</td><td>28.4</td><td>£12.78</td></tr>' +
      '<tr><td>Fri 21</td><td>24.6</td><td>£11.07</td></tr>' +
      '</tbody></table>' +
      '<p class="mp-ask-detail-surface__note">Three trips are pending classification. Review them to finalise your claim.</p>' +
      '</div>' +
      followups(['Review pending trips', 'Export this report', 'Email this to my accountant']) +
      '</div>' +
      composer() +
      '</div>';
  }

  /* —— Scenario 4: Business insight —— */
  function renderInsight(scenario) {
    return '<div class="mp-ask-scene mp-ask-scene--with-composer">' +
      '<div class="mp-ask-scene__body">' +
      userBubble('How is my business doing?') +
      '<div class="mp-ask-insight-surface">' +
      '<div class="mp-ask-insight-surface__block">' +
      '<p class="mp-ask-insight-surface__label">Trend</p>' +
      '<p class="mp-ask-insight-surface__text mp-ask-insight-surface__text--emphasis">Claims are 18% higher than last month.</p>' +
      '</div>' +
      '<div class="mp-ask-insight-surface__block">' +
      '<p class="mp-ask-insight-surface__label">Observation</p>' +
      '<p class="mp-ask-insight-surface__text">You have been recording mileage more consistently since enabling AutoPilot.</p>' +
      '</div>' +
      '<div class="mp-ask-insight-surface__block">' +
      '<p class="mp-ask-insight-surface__label">Suggested next step</p>' +
      '<button type="button" class="mp-ds-btn mp-ds-btn--secondary mp-ask-insight-action">Review 3 journeys</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      composer() +
      '</div>';
  }

  /* —— Scenario 5: Safe action confirmation —— */
  function renderConfirm(scenario) {
    return '<div class="mp-ask-scene mp-ask-scene--with-composer">' +
      '<div class="mp-ask-scene__body">' +
      userBubble('Send my weekly mileage report to my accountant.') +
      '<div class="mp-ask-confirm-surface">' +
      '<p class="mp-ask-confirm-surface__title">Confirm before sending</p>' +
      confirmRow('Recipient', 'accounts@smithco.co.uk') +
      confirmRow('Report', 'Weekly mileage report') +
      confirmRow('Period', '14 – 20 July 2026') +
      confirmRow('Contents', '8 trips · £64.17 claimable') +
      '<div class="mp-ask-confirm-surface__actions">' +
      '<button type="button" class="mp-ds-btn mp-ds-btn--primary">Send report</button>' +
      '<button type="button" class="mp-ds-btn mp-ds-btn--secondary">Cancel</button>' +
      '</div></div>' +
      '</div>' +
      composer() +
      '</div>';
  }

  function confirmRow(key, val) {
    return '<div class="mp-ask-confirm-surface__row">' +
      '<span class="mp-ask-confirm-surface__key">' + key + '</span>' +
      '<span class="mp-ask-confirm-surface__val">' + val + '</span></div>';
  }

  global.MPAskMilePilotShell = { mount: mount, ROOT_ID: ROOT_ID, SCENARIOS: SCENARIOS };
})(typeof window !== 'undefined' ? window : globalThis);
