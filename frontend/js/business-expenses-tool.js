/**
 * MP-S6-002 — Expenses tool surface (uses locked workspace primitives only)
 */
(function (global) {
  'use strict';

  function formatPence(pence) {
    return '£' + (Number(pence || 0) / 100).toFixed(2);
  }

  function render(tool) {
    var V = global.MPBusinessWorkspaceView;
    var E = global.MPExpenseEngine;
    if (!V || !E) return '';
    var stats = E.getStatistics();
    var categories = Object.keys(stats.categoryTotalsPence || {});
    var html =
      '<div class="mp-bw-page">' +
      V.WorkspaceHeader({
        back: true,
        eyebrow: 'Business Workspace',
        title: tool.title,
        subtitle: tool.tagline,
      });
    html += V.WorkspaceSection(
      'Overview',
      V.WorkspaceStat('Expenses recorded', String(stats.expenseCount)) +
        V.WorkspaceStat('This month', formatPence(stats.monthlySpendPence)) +
        V.WorkspaceStat('This year', formatPence(stats.yearlySpendPence)) +
        V.WorkspaceStat('Pending receipts', String(stats.pendingReceipts))
    );
    if (stats.expenseCount === 0) {
      html += V.WorkspaceEmptyState({
        title: 'No expenses yet',
        body: 'Your business expenses will appear here. Add purchases manually when you are ready — no sample data is shown.',
        buttonLabel: 'Expense engine ready',
      });
    } else {
      var catBody = categories.length
        ? categories
            .map(function (cat) {
              return V.WorkspaceStat(cat, formatPence(stats.categoryTotalsPence[cat]));
            })
            .join('')
        : V.WorkspaceEmptyState({
            title: 'No category totals',
            body: 'Category breakdown appears once expenses are recorded.',
          });
      html += V.WorkspaceSection('By category', catBody);
    }
    html += '</div>';
    return html;
  }

  function paint(root, tool) {
    if (!root) return;
    root.innerHTML = render(tool);
  }

  global.MPBusinessExpensesTool = {
    render: render,
    paint: paint,
  };
})(typeof window !== 'undefined' ? window : globalThis);
