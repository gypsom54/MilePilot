/**
 * MP-S5-001 — Ask MilePilot view renderer
 * Uses locked MP-S4 CSS classes only — no visual redesign.
 */
(function (global) {
  'use strict';

  var SEND = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHAT = '<svg viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 1 7 7c0 2.8-1.6 5.2-4 6.3V18l-3 2v-3.7A7 7 0 0 1 12 3z"/></svg>';
  var ATTACH = '<svg viewBox="0 0 24 24"><path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9M12 3v12M8 7l4-4 4 4"/></svg>';
  var VOICE = '<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z"/><path d="M19 11a7 7 0 0 1-14 0M12 18v3"/></svg>';

  function headerBlock() {
    return (
      '<header class="mp-ask-header">' +
      '<h1 class="mp-ask-header__title">Ask MilePilot</h1>' +
      '<p class="mp-ask-header__promise">Your business can finally answer your questions.</p>' +
      '</header>'
    );
  }

  function composer(inputValue) {
    var val = inputValue != null ? String(inputValue).replace(/"/g, '&quot;') : '';
    return (
      '<div class="mp-ask-composer" role="presentation">' +
      '<span class="mp-ask-composer__attach" aria-hidden="true" title="Attachment (reserved)">' +
      ATTACH +
      '</span>' +
      '<div class="mp-ask-composer__field">' +
      '<input class="mp-ask-composer__input" type="text" placeholder="Ask anything about your business…" aria-label="Ask MilePilot" value="' +
      val +
      '" />' +
      '<button type="button" class="mp-ask-composer__send" aria-label="Send">' +
      SEND +
      '</button>' +
      '</div>' +
      '<span class="mp-ask-composer__voice" aria-hidden="true" title="Voice (reserved)">' +
      VOICE +
      '</span>' +
      '</div>'
    );
  }

  function heroInput() {
    return (
      '<div class="mp-ask-hero-input">' +
      '<div class="mp-ask-input-wrap">' +
      '<textarea class="mp-ask-input" rows="2" placeholder="Ask anything about your business…" aria-label="Ask MilePilot"></textarea>' +
      '<button type="button" class="mp-ask-input__send" aria-label="Send">' +
      SEND +
      '</button>' +
      '</div></div>'
    );
  }

  function userBubble(text) {
    return '<div class="mp-ask-user">' + escapeHtml(text) + '</div>';
  }

  function processing(text) {
    return (
      '<div class="mp-ask-processing" aria-live="polite">' +
      '<span class="mp-ask-processing__dot" aria-hidden="true"></span>' +
      '<span>' +
      escapeHtml(text) +
      '</span></div>'
    );
  }

  function followups(items) {
    if (!items || !items.length) return '';
    return (
      '<div class="mp-ask-followups" aria-label="Suggested follow-ups">' +
      items
        .map(function (t) {
          return '<button type="button" class="mp-ask-followup" data-ask-followup="' + escapeAttr(t) + '">' + escapeHtml(t) + '</button>';
        })
        .join('') +
      '</div>'
    );
  }

  function suggestion(text) {
    return '<button type="button" class="mp-ask-suggestion" data-ask-suggestion="' + escapeAttr(text) + '">' + escapeHtml(text) + '</button>';
  }

  function recentItem(text) {
    return (
      '<button type="button" class="mp-ask-recent__item" data-ask-suggestion="' +
      escapeAttr(text) +
      '">' +
      '<span class="mp-ask-recent__icon" aria-hidden="true">' +
      CHAT +
      '</span>' +
      '<span>' +
      escapeHtml(text) +
      '</span></button>'
    );
  }

  function confirmRow(key, val) {
    return (
      '<div class="mp-ask-confirm-surface__row">' +
      '<span class="mp-ask-confirm-surface__key">' +
      escapeHtml(key) +
      '</span>' +
      '<span class="mp-ask-confirm-surface__val">' +
      escapeHtml(val) +
      '</span></div>'
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function renderEmpty() {
    return (
      '<div class="mp-ask-scene">' +
      '<div class="mp-ask-scene__body">' +
      headerBlock() +
      heroInput() +
      '<div class="mp-ask-suggestions" aria-label="Suggested questions">' +
      suggestion('How much can I claim this month?') +
      suggestion('Show today\'s journeys') +
      suggestion('Which trips still need reviewing?') +
      suggestion('Prepare my mileage report') +
      '</div>' +
      '<section class="mp-ask-recent" aria-label="Recent conversations">' +
      '<h2 class="mp-ds-text-section-title">Recent conversations</h2>' +
      '<div class="mp-ask-recent__list">' +
      recentItem('How much can I claim this month?') +
      recentItem('Show today\'s journeys') +
      '</div></section>' +
      '</div></div>'
    );
  }

  function renderConversation(question, response, options) {
    options = options || {};
    var body = userBubble(question);
    if (options.showProcessing) {
      body += processing(options.processingText || 'Checking your mileage…');
    } else if (response) {
      body += renderResponse(response);
    }
    var withComposer = response && response.view !== 'empty';
    var cls = withComposer ? ' mp-ask-scene--with-composer' : '';
    return (
      '<div class="mp-ask-scene' +
      cls +
      '">' +
      '<div class="mp-ask-scene__body">' +
      body +
      '</div>' +
      (withComposer ? composer('') : '') +
      '</div>'
    );
  }

  function renderResponse(response) {
    if (!response) return '';
    if (response.view === 'simple') {
      return (
        '<div class="mp-ask-answer-surface">' +
        '<p class="mp-ask-answer-surface__hero">' +
        escapeHtml(response.hero) +
        '</p>' +
        '<p class="mp-ask-answer-surface__detail">' +
        response.detail +
        '</p>' +
        '</div>' +
        followups(response.followups)
      );
    }
    if (response.view === 'detailed') {
      var m = response.metrics || {};
      var rows = (response.rows || [])
        .map(function (r) {
          return '<tr><td>' + escapeHtml(r.date) + '</td><td>' + escapeHtml(r.miles) + '</td><td>' + escapeHtml(r.claim) + '</td></tr>';
        })
        .join('');
      return (
        '<div class="mp-ask-detail-surface">' +
        '<p class="mp-ask-detail-surface__summary">' +
        escapeHtml(response.summary) +
        '</p>' +
        '<div class="mp-ask-figures">' +
        '<div class="mp-ds-metric"><span class="mp-ds-metric__value">' +
        escapeHtml(m.miles) +
        '</span><span class="mp-ds-metric__label">Business miles</span></div>' +
        '<div class="mp-ds-metric"><span class="mp-ds-metric__value">' +
        escapeHtml(m.trips) +
        '</span><span class="mp-ds-metric__label">Total trips</span></div>' +
        '<div class="mp-ds-metric mp-ds-metric--highlight"><span class="mp-ds-metric__value">' +
        escapeHtml(m.claim) +
        '</span><span class="mp-ds-metric__label">Claimable</span></div>' +
        '<div class="mp-ds-metric"><span class="mp-ds-metric__value">' +
        escapeHtml(m.pending) +
        '</span><span class="mp-ds-metric__label">Pending</span></div>' +
        '</div>' +
        '<table class="mp-ask-response-table"><thead><tr><th>Date</th><th>Miles</th><th>Claim</th></tr></thead><tbody>' +
        rows +
        '</tbody></table>' +
        (response.note ? '<p class="mp-ask-detail-surface__note">' + escapeHtml(response.note) + '</p>' : '') +
        '</div>' +
        followups(response.followups)
      );
    }
    if (response.view === 'confirm') {
      var sendLabel = response.action === 'email' ? 'Send report' : response.action === 'export' ? 'Export report' : 'Prepare report';
      var disabled = options && options.showProcessing ? ' disabled aria-disabled="true"' : '';
      return (
        '<div class="mp-ask-confirm-surface">' +
        '<p class="mp-ask-confirm-surface__title">Confirm before sending</p>' +
        confirmRow('Recipient', response.recipient) +
        confirmRow('Report', response.reportLabel) +
        confirmRow('Period', response.periodLabel) +
        confirmRow('Contents', response.contents) +
        '<div class="mp-ask-confirm-surface__actions">' +
        '<button type="button" class="mp-ds-btn mp-ds-btn--primary" data-ask-confirm="' +
        escapeAttr(response.action) +
        '"' +
        disabled +
        '>' +
        escapeHtml(sendLabel) +
        '</button>' +
        '<button type="button" class="mp-ds-btn mp-ds-btn--secondary" data-ask-cancel="1"' +
        disabled +
        '>Cancel</button>' +
        '</div></div>'
      );
    }
    if (response.view === 'text') {
      return (
        '<div class="mp-ask-answer-surface">' +
        '<p class="mp-ask-answer-surface__detail">' +
        escapeHtml(response.message) +
        '</p>' +
        '</div>' +
        followups(response.followups)
      );
    }
    return '';
  }

  global.MPAskMilePilotView = {
    renderEmpty: renderEmpty,
    renderConversation: renderConversation,
    renderResponse: renderResponse,
    composer: composer,
    headerBlock: headerBlock,
  };
})(typeof window !== 'undefined' ? window : globalThis);
