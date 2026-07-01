/**
 * MilePilot voice — notifications, empty states, and status copy.
 * Every message should sound like MilePilot, not a generic tracking app.
 */
(function (global) {
  'use strict';

  global.MPCopy = {
    shiftStarted: "You're on the road — MilePilot is tracking your shift.",
    journeyStarted: "Journey started — MilePilot is recording your miles.",
    shiftSaved: "Today's journeys are ready for review.",
    reportSent: function (email) {
      return 'Your business summary is on its way to ' + email + '.';
    },
    reportDownloaded: 'Your report is ready — professional and shareable.',
    reportPreparing: 'Preparing your business report…',
    reportNoData: 'Your first report will appear after your first working day.',
    reportNoPeriod: {
      day: 'No business miles recorded today yet.',
      week: 'No business miles recorded this week yet.',
      month: 'No business miles recorded this month yet.',
    },
    reportEmailFailed: 'We could not send your report — try downloading the PDF instead.',
    reportDownloadFailed: 'Download did not complete — try emailing your report instead.',
    reportShareNoData: 'Complete a shift first — your report builds automatically.',
    emailRequired: 'Add your email to receive professional reports.',
    settingsSaved: 'Settings saved.',
    frequencySet: function (label) {
      return 'Automatic reports set to ' + label.toLowerCase() + '.';
    },
    stayUpdatedSaved: function (label) {
      return 'MilePilot will send your ' + label.toLowerCase() + ' business summaries automatically.';
    },
    customNoJourneys: 'No reviewed business journeys in that period.',
    customChooseDates: 'Choose a start and end date to preview your report.',
    weeklySummaryReady: 'Your weekly business summary is ready.',
    monthlySummaryReady: 'Your monthly business insights are ready.',
    autoReportSent: 'Your automatic business summary has been emailed.',
    historyEmptyTitle: 'Your journey history starts here',
    historyEmptySub: 'End your first shift and every business mile will be saved automatically.',
    reportEmptyTitle: 'Your reports are waiting for you',
    reportEmptySub: 'Your first professional report will appear here after your first working day.',
    activityEmpty: 'No journeys recorded',
    insightEmpty: 'Start your first shift to unlock personalised business insights.',
    betaThanks: 'Thank you — your feedback shapes MilePilot.',
    betaSubmitFailed: 'Could not send feedback — try again in a moment.',
    experienceUpdated: 'Experience updated.',
    profileUpdated: 'Business profile updated.',
    trackingModeSaved: 'Tracking mode updated.',
    testShiftAdded: 'Test shift added.',
    testShiftsCleared: 'Test shifts cleared.',
    shareCopied: 'Report summary copied.',
    autopilotRequirementsTitle: 'Tracking without opening the app',
    autopilotRequirementsIntro:
      'For automatic mileage while your phone is locked, please accept the permissions below.',
    autopilotRequirementsFooter:
      'Trips end after 90 minutes without movement. Force-quitting the app or denying background location may pause tracking until you open MilePilot again.',
  };

  global.MPCopy.getReportEmpty = function (period, hasAnyShifts) {
    if (!hasAnyShifts) {
      return {
        title: global.MPCopy.reportEmptyTitle,
        sub: global.MPCopy.reportEmptySub,
      };
    }
    const key = period === 'week' ? 'week' : period === 'month' ? 'month' : 'day';
    return {
      title: 'Nothing to report yet',
      sub: global.MPCopy.reportNoPeriod[key] || global.MPCopy.reportNoPeriod.day,
    };
  };

  global.MPCopy.emptyIllustrationSvg = function () {
    return (
      '<svg class="mp-empty-svg" viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect x="8" y="12" width="104" height="64" rx="14" fill="rgba(13,107,255,.08)" stroke="rgba(13,107,255,.22)" stroke-width="1.5"/>' +
      '<path d="M24 52 L42 36 L58 48 L76 28 L96 44" stroke="#0D6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>' +
      '<circle cx="24" cy="52" r="4" fill="#20D781"/>' +
      '<circle cx="96" cy="44" r="4" fill="#0D6BFF"/>' +
      '<path d="M36 68 h48" stroke="rgba(110,180,255,.35)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M44 68 v-6 M56 68 v-10 M68 68 v-4 M80 68 v-8" stroke="rgba(110,180,255,.5)" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
