/**
 * MilePilot Ask MilePilot — Shell only (MP-S4-001)
 * Loaded by frontend/ask-milepilot-preview.html — visual placeholders only.
 * No AI, APIs, networking, or business logic.
 */
(function (global) {
  'use strict';

  var ROOT_ID = 'mpAskShellRoot';

  var SEND_ICON = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHAT_ICON = '<svg viewBox="0 0 24 24"><path d="M12 3a7 7 0 0 1 7 7c0 2.8-1.6 5.2-4 6.3V18l-3 2v-3.7A7 7 0 0 1 12 3z"/></svg>';
  var ASK_ICON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01"/></svg>';

  var SHELL_HTML =
    '<div class="mp-ask-shell">' +
    '<p class="mp-ask-dev-banner">Development only · MP-S4-001 · Shell</p>' +

  /* Primary workspace */
    '<header class="mp-ask-header">' +
    '<h1 class="mp-ask-header__title">Ask MilePilot</h1>' +
    '<p class="mp-ask-header__subtitle">Your business, one question away.</p>' +
    '</header>' +

    '<div class="mp-ask-input-wrap">' +
    '<textarea class="mp-ask-input" rows="2" placeholder="Ask anything about your business…" readonly aria-label="Ask MilePilot"></textarea>' +
    '<span class="mp-ask-input__send" aria-hidden="true">' + SEND_ICON + '</span>' +
    '</div>' +

    '<div class="mp-ask-suggestions" aria-label="Suggested questions">' +
    suggestion('How much did I claim this month?') +
    suggestion('Show my VAT position') +
    suggestion('Prepare my accountant pack') +
    suggestion('Which trips need review?') +
    '</div>' +

    '<section class="mp-ask-recent" aria-label="Recent conversations">' +
    '<h2 class="mp-ds-text-section-title">Recent conversations</h2>' +
    '<div class="mp-ask-recent__list">' +
    recentItem('How much did I claim last month?') +
    recentItem('Show my VAT position') +
    recentItem('Prepare accountant pack') +
  '</div></section>' +

  /* Empty state */
    '<section class="mp-ask-demo" aria-label="Empty state example">' +
    '<p class="mp-ask-demo__label">Empty state</p>' +
    '<div class="mp-ask-empty">' +
    '<div class="mp-ask-empty__icon" aria-hidden="true">' + ASK_ICON + '</div>' +
    '<p class="mp-ask-empty__title">Ask your first question</p>' +
    '<p class="mp-ask-empty__body">Mileage, expenses, VAT, reports — just ask. No menus required.</p>' +
    '</div></section>' +

  /* Loading state */
    '<section class="mp-ask-demo" aria-label="Loading state example">' +
    '<p class="mp-ask-demo__label">Loading state</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">How much did I claim this month?</div>' +
    '<div class="mp-ask-loading">' +
    '<div class="mp-ds-typing" aria-label="MilePilot is thinking"><span></span><span></span><span></span></div>' +
    '<span class="mp-ask-loading__text">Thinking…</span>' +
    '</div></div></section>' +

  /* Long answer */
    '<section class="mp-ask-demo" aria-label="Long answer example">' +
    '<p class="mp-ask-demo__label">Long answer</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">Explain my mileage claim for this month</div>' +
    '<div class="mp-ds-assistant">This month you drove <strong>142.6 business miles</strong> across 12 trips. At the HMRC rate of 45p per mile, your claimable amount is <strong>£64.17</strong>.<br><br>Most activity was mid-week, with your longest trip on 14 July (28.4 miles). Three trips are still pending classification — once reviewed, your total may increase slightly.<br><br>Your daily summary report is scheduled for tonight at 11:59pm.</div>' +
    '</div></section>' +

  /* Table answer */
    '<section class="mp-ask-demo" aria-label="Table answer example">' +
    '<p class="mp-ask-demo__label">Table answer</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">Show my trips this week</div>' +
    '<div class="mp-ds-assistant">Here are your business trips this week:' +
    '<table class="mp-ask-response-table"><thead><tr><th>Date</th><th>Miles</th><th>Claim</th></tr></thead>' +
    '<tbody>' +
    '<tr><td>Mon 20</td><td>18.2</td><td>£8.19</td></tr>' +
    '<tr><td>Wed 22</td><td>24.6</td><td>£11.07</td></tr>' +
    '<tr><td>Fri 24</td><td>12.1</td><td>£5.45</td></tr>' +
    '</tbody></table></div>' +
    '</div></section>' +

  /* Business insight */
    '<section class="mp-ask-demo" aria-label="Business insight example">' +
    '<p class="mp-ask-demo__label">Business insight</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">How is my business doing?</div>' +
    '<div class="mp-ds-assistant">Based on your recent activity, here\'s what stands out:' +
    '<div class="mp-ask-insight">' +
    '<p class="mp-ask-insight__label">Claim trend</p>' +
    '<p class="mp-ask-insight__value">+18% vs last month</p>' +
    '<p class="mp-ask-insight__note">You\'re claiming more consistently with AutoPilot enabled.</p>' +
    '</div></div>' +
    '</div></section>' +

  /* Action confirmation */
    '<section class="mp-ask-demo" aria-label="Action confirmation example">' +
    '<p class="mp-ask-demo__label">Action confirmation</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">Send my weekly report to my accountant</div>' +
    '<div class="mp-ds-assistant">I\'ll email your weekly HMRC summary to <strong>accounts@smithco.co.uk</strong>. This includes 8 business trips totalling £64.17.' +
    '<div class="mp-ask-confirm">' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--primary">Send now</button>' +
    '<button type="button" class="mp-ds-btn mp-ds-btn--secondary">Cancel</button>' +
    '</div></div>' +
    '</div></section>' +

  /* Follow-up suggestion */
    '<section class="mp-ask-demo" aria-label="Follow-up suggestion example">' +
    '<p class="mp-ask-demo__label">Follow-up suggestion</p>' +
    '<div class="mp-ask-thread">' +
    '<div class="mp-ds-user-bubble">What\'s my VAT position?</div>' +
    '<div class="mp-ds-assistant">Your estimated VAT liability this quarter is <strong>£1,240</strong>. You have 12 receipts totalling £4,960 in qualifying expenses.</div>' +
    '<div class="mp-ask-followups" aria-label="Suggested follow-ups">' +
    '<span class="mp-ask-followup">Show expense breakdown</span>' +
    '<span class="mp-ask-followup">When is my VAT due?</span>' +
    '<span class="mp-ask-followup">Export for accountant</span>' +
    '</div></div></section>' +

    '</div>';

  function suggestion(text) {
    return '<span class="mp-ask-suggestion" role="presentation">' + text + '</span>';
  }

  function recentItem(text) {
    return '<div class="mp-ask-recent__item" role="presentation">' +
      '<span class="mp-ask-recent__icon" aria-hidden="true">' + CHAT_ICON + '</span>' +
      '<span>' + text + '</span></div>';
  }

  function mount() {
    var root = global.document.getElementById(ROOT_ID);
    if (!root || root.dataset.mounted === '1') return root;
    root.innerHTML = SHELL_HTML;
    root.dataset.mounted = '1';
    return root;
  }

  global.MPAskMilePilotShell = { mount: mount, ROOT_ID: ROOT_ID };
})(typeof window !== 'undefined' ? window : globalThis);
