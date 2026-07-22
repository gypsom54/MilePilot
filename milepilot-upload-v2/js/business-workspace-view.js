/**
 * MP-S6-001 — Business Workspace view components (design system)
 */
(function (global) {
  'use strict';

  var SEND = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var ICONS = {
    expenses:
      '<svg viewBox="0 0 24 24"><path d="M4 10h16M4 14h10M6 6h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>',
    vat: '<svg viewBox="0 0 24 24"><path d="M4 19h16M7 16V8M12 16V5M17 16v-3"/></svg>',
    bookkeeper:
      '<svg viewBox="0 0 24 24"><path d="M12 3a7 7 0 00-7 7v2a5 5 0 005 5h4a5 5 0 005-5v-2a7 7 0 00-7-7z"/><path d="M9 18v2h6v-2"/></svg>',
    health: '<svg viewBox="0 0 24 24"><path d="M12 21s-6-4.35-8.5-8A5.5 5.5 0 0112 5.5 5.5 5.5 0 0120.5 13C18 17 12 21 12 21z"/></svg>',
    accountant:
      '<svg viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function WorkspaceHeader(opts) {
    opts = opts || {};
    if (opts.back) {
      return (
        '<header class="mp-bw-header mp-bw-header--with-back">' +
        '<button type="button" class="mp-bw-header__back" data-bw-back="1" aria-label="Back to Business Workspace">←</button>' +
        '<div><p class="mp-bw-header__eyebrow">' +
        escapeHtml(opts.eyebrow || 'Business Workspace') +
        '</p><h1 class="mp-bw-header__title">' +
        escapeHtml(opts.title || '') +
        '</h1>' +
        (opts.subtitle ? '<p class="mp-bw-header__subtitle">' + escapeHtml(opts.subtitle) + '</p>' : '') +
        '</div></header>'
      );
    }
    return (
      '<header class="mp-bw-header">' +
      '<p class="mp-bw-header__eyebrow">' +
      escapeHtml(opts.eyebrow || 'Business Workspace') +
      '</p>' +
      '<h1 class="mp-bw-header__title">' +
      escapeHtml(opts.title || 'Business Workspace') +
      '</h1>' +
      (opts.subtitle
        ? '<p class="mp-bw-header__subtitle">' + escapeHtml(opts.subtitle) + '</p>'
        : '<p class="mp-bw-header__subtitle">Your business companion — mileage, tools, and insights in one place.</p>') +
      '</header>'
    );
  }

  function WorkspaceBadge(text, variant) {
    return '<span class="mp-bw-badge' + (variant === 'muted' ? ' mp-bw-badge--muted' : '') + '">' + escapeHtml(text) + '</span>';
  }

  function WorkspaceCard(tool) {
    return (
      '<button type="button" class="mp-bw-card" data-bw-tool="' +
      escapeAttr(tool.id) +
      '" aria-label="' +
      escapeAttr(tool.title) +
      '">' +
      '<span class="mp-bw-card__icon" aria-hidden="true">' +
      (ICONS[tool.icon] || ICONS.expenses) +
      '</span>' +
      '<h3 class="mp-bw-card__title">' +
      escapeHtml(tool.title) +
      '</h3>' +
      '<p class="mp-bw-card__desc">' +
      escapeHtml(tool.description) +
      '</p>' +
      '<span class="mp-bw-card__footer">' +
      WorkspaceBadge(tool.badge || 'Coming Soon') +
      '</span></button>'
    );
  }

  function WorkspaceSection(title, bodyHtml) {
    return (
      '<section class="mp-bw-section" aria-labelledby="' +
      escapeAttr('bw-section-' + title.replace(/\s+/g, '-').toLowerCase()) +
      '">' +
      '<h2 class="mp-bw-section__title" id="' +
      escapeAttr('bw-section-' + title.replace(/\s+/g, '-').toLowerCase()) +
      '">' +
      escapeHtml(title) +
      '</h2>' +
      bodyHtml +
      '</section>'
    );
  }

  function WorkspaceDivider() {
    return '<hr class="mp-bw-divider" />';
  }

  function WorkspaceStat(label, value) {
    return (
      '<div class="mp-bw-stat">' +
      '<span class="mp-bw-stat__label">' +
      escapeHtml(label) +
      '</span>' +
      '<span class="mp-bw-stat__value">' +
      escapeHtml(value) +
      '</span></div>'
    );
  }

  function WorkspaceSkeleton(heightPx) {
    return '<div class="mp-bw-skeleton" style="height:' + (heightPx || 48) + 'px" aria-hidden="true"></div>';
  }

  function WorkspaceEmptyState(opts) {
    opts = opts || {};
    var centered = opts.centered !== false ? ' mp-bw-empty--centered' : '';
    return (
      '<div class="mp-bw-empty' +
      centered +
      '">' +
      '<h2 class="mp-bw-empty__title">' +
      escapeHtml(opts.title || '') +
      '</h2>' +
      '<p class="mp-bw-empty__body">' +
      escapeHtml(opts.body || '') +
      '</p>' +
      (opts.buttonLabel
        ? '<button type="button" class="mp-bw-empty__action" disabled aria-disabled="true">' +
          escapeHtml(opts.buttonLabel) +
          '</button>'
        : '') +
      '</div>'
    );
  }

  function renderAskEmbed() {
    var chips = [
      'How much can I claim this month?',
      "Show this week's journeys.",
      'Prepare my mileage report.',
      'Show trips needing review.',
    ];
    return (
      '<div class="mp-bw-ask" role="search">' +
      '<p class="mp-bw-ask__label">Ask MilePilot</p>' +
      '<h2 class="mp-bw-ask__title">What would you like help with today?</h2>' +
      '<div class="mp-ask-hero-input">' +
      '<div class="mp-ask-input-wrap">' +
      '<textarea class="mp-ask-input mp-bw-ask-input" rows="2" placeholder="What would you like help with today?" aria-label="Ask MilePilot"></textarea>' +
      '<button type="button" class="mp-ask-input__send mp-bw-ask-send" aria-label="Send">' +
      SEND +
      '</button></div></div>' +
      '<div class="mp-ask-suggestions" aria-label="Suggested questions">' +
      chips
        .map(function (t) {
          return (
            '<button type="button" class="mp-ask-suggestion" data-bw-ask-chip="' +
            escapeAttr(t) +
            '">' +
            escapeHtml(t) +
            '</button>'
          );
        })
        .join('') +
      '</div></div>'
    );
  }

  function renderHome(tools) {
    var cards = tools
      .map(function (t) {
        return WorkspaceCard(t);
      })
      .join('');
    return (
      '<div class="mp-bw-page">' +
      WorkspaceHeader({}) +
      renderAskEmbed() +
      WorkspaceSection('Business Tools', '<div class="mp-bw-tools">' + cards + '</div>') +
      WorkspaceSection(
        'Recent Activity',
        WorkspaceEmptyState({
          centered: false,
          title: 'No recent activity yet',
          body: 'When you start using business tools, your latest actions will appear here.',
        })
      ) +
      WorkspaceDivider() +
      WorkspaceSection(
        'Coming Next',
        '<ul class="mp-bw-coming-list">' +
          '<li>Receipt scanning and expense tracking</li>' +
          '<li>VAT position and return preparation</li>' +
          '<li>Business Health insights</li>' +
          '<li>Accountant-ready export packs</li>' +
          '</ul>'
      ) +
      '</div>'
    );
  }

  function renderToolEmpty(tool) {
    return (
      '<div class="mp-bw-page">' +
      WorkspaceHeader({
        back: true,
        eyebrow: 'Business Workspace',
        title: tool.title,
        subtitle: tool.tagline,
      }) +
      WorkspaceEmptyState({
        title: tool.title,
        body: tool.emptyBody,
        buttonLabel: 'Coming Soon',
      }) +
      '</div>'
    );
  }

  global.MPBusinessWorkspaceView = {
    WorkspaceHeader: WorkspaceHeader,
    WorkspaceCard: WorkspaceCard,
    WorkspaceSection: WorkspaceSection,
    WorkspaceEmptyState: WorkspaceEmptyState,
    WorkspaceBadge: WorkspaceBadge,
    WorkspaceStat: WorkspaceStat,
    WorkspaceDivider: WorkspaceDivider,
    WorkspaceSkeleton: WorkspaceSkeleton,
    renderHome: renderHome,
    renderToolEmpty: renderToolEmpty,
    renderAskEmbed: renderAskEmbed,
  };
})(typeof window !== 'undefined' ? window : globalThis);
