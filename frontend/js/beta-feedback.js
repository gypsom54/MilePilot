/**
 * MilePilot Beta Feedback — specific questions that become the roadmap.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mp_beta_feedback_v1';
  const PROMPT_AFTER_SHIFTS = 3;

  const QUESTIONS = [
    { id: 'missedJourneys', text: 'Did MilePilot miss any journeys?', type: 'yesno' },
    { id: 'trustedMileage', text: 'Did you trust the mileage?', type: 'yesno' },
    { id: 'easyReview', text: 'Was reviewing your day easy?', type: 'yesno' },
    { id: 'wouldPay', text: 'Would you pay £5.99/month?', type: 'yesno' },
    { id: 'annoyed', text: 'What annoyed you most?', type: 'text', placeholder: 'Be honest — this is how we improve.' },
    {
      id: 'stopRecommend',
      text: 'What would stop you recommending MilePilot?',
      type: 'text',
      placeholder: 'Tell us what would need to change.',
    },
  ];

  let deps = null;
  let answers = {};

  function hasSubmitted() {
    try {
      return global.localStorage.getItem(STORAGE_KEY) === 'submitted';
    } catch (e) {
      return false;
    }
  }

  function shouldPrompt(shiftCount) {
    if (hasSubmitted()) return false;
    return Number(shiftCount) >= PROMPT_AFTER_SHIFTS;
  }

  function renderQuestions() {
    const wrap = global.document.getElementById('betaQuestions');
    if (!wrap) return;
    wrap.innerHTML = QUESTIONS.map(function (q) {
      if (q.type === 'yesno') {
        return (
          '<div class="beta-q" data-id="' +
          q.id +
          '"><p class="beta-q-text">' +
          q.text +
          '</p><div class="beta-yesno"><button type="button" class="beta-yn" data-val="yes" onclick="MPBetaFeedback.pick(\'' +
          q.id +
          '\',\'yes\')">Yes</button><button type="button" class="beta-yn" data-val="no" onclick="MPBetaFeedback.pick(\'' +
          q.id +
          '\',\'no\')">No</button></div></div>'
        );
      }
      return (
        '<div class="beta-q" data-id="' +
        q.id +
        '"><label class="beta-q-text" for="beta-' +
        q.id +
        '">' +
        q.text +
        '</label><textarea id="beta-' +
        q.id +
        '" class="beta-text" rows="3" placeholder="' +
        (q.placeholder || '') +
        '" oninput="MPBetaFeedback.setText(\'' +
        q.id +
        '\',this.value)"></textarea></div>'
      );
    }).join('');
  }

  function openModal() {
    answers = {};
    renderQuestions();
    const overlay = global.document.getElementById('betaFeedback');
    if (overlay) overlay.hidden = false;
    syncSubmit();
  }

  function closeModal() {
    const overlay = global.document.getElementById('betaFeedback');
    if (overlay) overlay.hidden = true;
  }

  function pick(id, val) {
    answers[id] = val;
    const block = global.document.querySelector('.beta-q[data-id="' + id + '"]');
    if (block) {
      block.querySelectorAll('.beta-yn').forEach(function (btn) {
        btn.classList.toggle('is-selected', btn.dataset.val === val);
      });
    }
    syncSubmit();
  }

  function setText(id, val) {
    answers[id] = (val || '').trim();
    syncSubmit();
  }

  /** Only the yes/no questions are required — free-text is optional. */
  function isComplete() {
    return QUESTIONS.every(function (q) {
      if (q.type !== 'yesno') return true;
      const v = answers[q.id];
      return v === 'yes' || v === 'no';
    });
  }

  function unansweredYesNoCount() {
    return QUESTIONS.filter(function (q) {
      return q.type === 'yesno' && answers[q.id] !== 'yes' && answers[q.id] !== 'no';
    }).length;
  }

  function syncSubmit() {
    const btn = global.document.getElementById('betaSubmit');
    if (btn) btn.disabled = !isComplete();
    const hint = global.document.getElementById('betaActionsHint');
    if (hint) {
      const left = unansweredYesNoCount();
      if (left > 0) {
        hint.hidden = false;
        hint.textContent =
          'Answer ' + left + ' more question' + (left === 1 ? '' : 's') + ' to send. Comments are optional.';
      } else {
        hint.hidden = true;
      }
    }
  }

  function returnToDashboard() {
    if (typeof global.goHome === 'function') {
      try {
        global.goHome();
      } catch (e) {}
    }
  }

  async function submit() {
    if (!isComplete() || !deps) return;
    const btn = global.document.getElementById('betaSubmit');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }
    const payload = {
      email: deps.getEmail ? deps.getEmail() : '',
      driver: deps.getDriver ? deps.getDriver() : '',
      appVersion: deps.getVersion ? deps.getVersion() : '',
      answers: answers,
      submittedAt: new Date().toISOString(),
    };
    // Persist locally first so feedback is never lost and the user is never
    // trapped in the modal if the backend is unreachable.
    try {
      global.localStorage.setItem(STORAGE_KEY, 'submitted');
      global.localStorage.setItem('mp_beta_feedback_payload', JSON.stringify(payload));
    } catch (e) {}
    // Best-effort backend send — does not block returning to the dashboard.
    Promise.resolve()
      .then(function () {
        return deps.apiPost('/feedback', payload);
      })
      .catch(function () {});
    // Always close the modal, thank the user, and bounce back to the dashboard.
    closeModal();
    if (btn) {
      btn.textContent = 'Send feedback';
    }
    if (typeof deps.toast === 'function') {
      deps.toast(global.MPCopy ? global.MPCopy.betaThanks : 'Thank you — your feedback helps shape MilePilot.');
    }
    returnToDashboard();
  }

  function maybePromptAfterShift(shiftCount) {
    if (!shouldPrompt(shiftCount)) return;
    setTimeout(openModal, 1200);
  }

  function init(dependencies) {
    deps = dependencies;
    renderQuestions();
  }

  global.MPBetaFeedback = {
    init: init,
    open: openModal,
    close: closeModal,
    pick: pick,
    setText: setText,
    submit: submit,
    maybePromptAfterShift: maybePromptAfterShift,
    hasSubmitted: hasSubmitted,
  };
})(typeof window !== 'undefined' ? window : globalThis);
