/**
 * RankAura Sprint 1 — Onboarding conversation
 * Source of truth: rankaura/docs/SPRINT_01.md + UX_PHILOSOPHY.md
 */

(function () {
  "use strict";

  const STORAGE_KEY = "ra_onboarding_v1";

  const SCREENS = [
    "welcome",
    "name",
    "businessName",
    "website",
    "description",
    "analysis",
    "summary",
    "launch",
  ];

  const ANALYSIS_STAGES = [
    {
      name: "Understanding your business",
      copy: "Learning what you do and who you serve.",
    },
    {
      name: "Researching your industry",
      copy: "Mapping the landscape around your market.",
    },
    {
      name: "Analysing competitors",
      copy: "Seeing who else is competing for attention.",
    },
    {
      name: "Discovering keyword opportunities",
      copy: "Finding the searches your customers already use.",
    },
    {
      name: "Crawling your website",
      copy: "Reading your site carefully, page by page.",
    },
    {
      name: "Reviewing technical performance",
      copy: "Checking the foundations that help you get found.",
    },
    {
      name: "Finding content opportunities",
      copy: "Spotting clear places to grow your voice.",
    },
    {
      name: "Reviewing local presence",
      copy: "Seeing how you show up in your area.",
    },
    {
      name: "Reviewing authority and trust",
      copy: "Understanding the signals that build confidence.",
    },
    {
      name: "Building your Growth Plan",
      copy: "Bringing everything together into a clear plan.",
    },
  ];

  const state = {
    step: 0,
    data: {
      name: "",
      businessName: "",
      website: "",
      description: "",
    },
    transitioning: false,
    analysisTimer: null,
    analysisIndex: 0,
    analysisFailed: false,
    analysisComplete: false,
  };

  const els = {
    screens: {},
    chrome: document.getElementById("raChrome"),
    progressFill: document.getElementById("raProgressFill"),
    progressLabel: document.getElementById("raProgressLabel"),
    backBtn: document.getElementById("raBack"),
    nameInput: document.getElementById("raName"),
    businessInput: document.getElementById("raBusinessName"),
    websiteInput: document.getElementById("raWebsite"),
    descriptionInput: document.getElementById("raDescription"),
    nameError: document.getElementById("raNameError"),
    businessError: document.getElementById("raBusinessError"),
    websiteError: document.getElementById("raWebsiteError"),
    descriptionError: document.getElementById("raDescriptionError"),
    analysisMain: document.getElementById("raAnalysisMain"),
    analysisFail: document.getElementById("raAnalysisFail"),
    analysisRetry: document.getElementById("raAnalysisRetry"),
    analysisName: document.getElementById("raAnalysisName"),
    analysisCopy: document.getElementById("raAnalysisCopy"),
    analysisStage: document.getElementById("raAnalysisStage"),
    analysisDots: document.getElementById("raAnalysisDots"),
    summaryBusinessName: document.getElementById("raSummaryBusinessName"),
    summaryOpportunities: document.getElementById("raSummaryOpportunities"),
    summaryFocus: document.getElementById("raSummaryFocus"),
    summaryNext: document.getElementById("raSummaryNext"),
    launchName: document.getElementById("raLaunchName"),
  };

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function clearPersisted() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("ra_onboard_complete");
    } catch (_) {
      /* ignore */
    }
  }

  function loadState() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has("fresh") || params.has("reset")) {
        clearPersisted();
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, "", window.location.pathname);
        }
        return;
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && saved.data) {
        state.data = Object.assign({}, state.data, saved.data);
      }
      if (typeof saved.step === "number" && saved.step >= 0 && saved.step < SCREENS.length) {
        // Resume before analysis so the animated experience can replay
        state.step = saved.step === 5 ? 4 : saved.step;
      }
      if (localStorage.getItem("ra_onboard_complete") === "true") {
        state.step = SCREENS.indexOf("launch");
      }
    } catch (_) {
      /* ignore */
    }
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step: state.step,
          data: state.data,
          updatedAt: Date.now(),
        })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function progressPercent(step) {
    if (step <= 0) return 0;
    return Math.round((step / (SCREENS.length - 1)) * 100);
  }

  function showError(el, message) {
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("is-visible", Boolean(message));
  }

  function clearErrors() {
    showError(els.nameError, "");
    showError(els.businessError, "");
    showError(els.websiteError, "");
    showError(els.descriptionError, "");
  }

  function trim(value) {
    return String(value || "").trim();
  }

  function normalizeWebsite(value) {
    const v = trim(value);
    if (!v) return "";
    if (/^https?:\/\//i.test(v)) return v;
    return "https://" + v;
  }

  function isLikelyWebsite(value) {
    const v = trim(value);
    if (!v) return false;
    return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v);
  }

  function hydrateInputs() {
    if (els.nameInput) els.nameInput.value = state.data.name || "";
    if (els.businessInput) els.businessInput.value = state.data.businessName || "";
    if (els.websiteInput) {
      const site = state.data.website || "";
      els.websiteInput.value = site.replace(/^https?:\/\//i, "");
    }
    if (els.descriptionInput) els.descriptionInput.value = state.data.description || "";
  }

  function updateChrome(stepId) {
    const showChrome =
      stepId === "name" ||
      stepId === "businessName" ||
      stepId === "website" ||
      stepId === "description" ||
      stepId === "summary";

    if (els.chrome) {
      els.chrome.hidden = !showChrome;
    }
    if (els.backBtn) {
      els.backBtn.hidden = !showChrome || state.step <= 1;
    }
    if (els.progressFill) {
      els.progressFill.style.width = progressPercent(state.step) + "%";
    }
    if (els.progressLabel) {
      els.progressLabel.textContent = Math.max(state.step, 0) + " / " + (SCREENS.length - 1);
    }
  }

  function renderSummary() {
    const name = state.data.name || "there";
    const business = state.data.businessName || "your business";

    if (els.summaryBusinessName) {
      els.summaryBusinessName.textContent = business;
    }
    if (els.summaryOpportunities) {
      els.summaryOpportunities.textContent =
        "12 growth opportunities ready for " + business;
    }
    if (els.summaryFocus) {
      els.summaryFocus.textContent =
        "Website improvements and local visibility first";
    }
    if (els.summaryNext) {
      els.summaryNext.textContent =
        "First wins planned over the next 30 days";
    }
    if (els.launchName) {
      els.launchName.textContent = name;
    }
  }

  function buildAnalysisDots() {
    if (!els.analysisDots) return;
    els.analysisDots.innerHTML = ANALYSIS_STAGES.map(function (_, i) {
      return '<li data-index="' + i + '"></li>';
    }).join("");
  }

  function setAnalysisVisual(index) {
    const stage = ANALYSIS_STAGES[index];
    if (!stage || !els.analysisStage) return;

    els.analysisStage.classList.add("is-swap");

    window.setTimeout(function () {
      if (els.analysisName) els.analysisName.textContent = stage.name;
      if (els.analysisCopy) els.analysisCopy.textContent = stage.copy;
      els.analysisStage.classList.remove("is-swap");
    }, 220);

    const dots = els.analysisDots
      ? els.analysisDots.querySelectorAll("li")
      : [];
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-done", i < index);
      dot.classList.toggle("is-active", i === index);
    });
  }

  function stopAnalysis() {
    if (state.analysisTimer) {
      window.clearTimeout(state.analysisTimer);
      state.analysisTimer = null;
    }
  }

  function showAnalysisFail() {
    state.analysisFailed = true;
    state.analysisComplete = false;
    stopAnalysis();
    if (els.analysisMain) els.analysisMain.hidden = true;
    if (els.analysisFail) els.analysisFail.hidden = false;
  }

  function showAnalysisMain() {
    state.analysisFailed = false;
    if (els.analysisMain) els.analysisMain.hidden = false;
    if (els.analysisFail) els.analysisFail.hidden = true;
  }

  function startAnalysis() {
    stopAnalysis();
    showAnalysisMain();
    state.analysisIndex = 0;
    state.analysisComplete = false;
    buildAnalysisDots();
    setAnalysisVisual(0);

    const reduced = prefersReducedMotion();
    const dwell = reduced ? 160 : 1050;

    // Optional failure simulation for QA: ?failAnalysis=1
    const params = new URLSearchParams(window.location.search);
    const forceFail = params.has("failAnalysis");

    function tick() {
      if (forceFail && state.analysisIndex >= 2) {
        showAnalysisFail();
        return;
      }

      if (state.analysisIndex >= ANALYSIS_STAGES.length - 1) {
        const dots = els.analysisDots
          ? els.analysisDots.querySelectorAll("li")
          : [];
        dots.forEach(function (dot) {
          dot.classList.add("is-done");
          dot.classList.remove("is-active");
        });
        state.analysisComplete = true;
        state.analysisTimer = window.setTimeout(function () {
          goTo(state.step + 1);
        }, reduced ? 180 : 650);
        return;
      }

      state.analysisIndex += 1;
      setAnalysisVisual(state.analysisIndex);
      state.analysisTimer = window.setTimeout(tick, dwell);
    }

    state.analysisTimer = window.setTimeout(tick, dwell);
  }

  function activateScreen(stepId, previousId) {
    SCREENS.forEach(function (id) {
      const screen = els.screens[id];
      if (!screen) return;
      const active = id === stepId;
      screen.classList.toggle("is-active", active);
      screen.classList.toggle("is-exit", !active && id === previousId);
      screen.setAttribute("aria-hidden", active ? "false" : "true");
    });

    updateChrome(stepId);

    if (stepId === "analysis") {
      startAnalysis();
    } else {
      stopAnalysis();
    }

    if (stepId === "summary" || stepId === "launch") {
      renderSummary();
    }

    window.requestAnimationFrame(function () {
      if (stepId === "name" && els.nameInput) els.nameInput.focus();
      if (stepId === "businessName" && els.businessInput) els.businessInput.focus();
      if (stepId === "website" && els.websiteInput) els.websiteInput.focus();
      if (stepId === "description" && els.descriptionInput) els.descriptionInput.focus();
    });
  }

  function goTo(nextStep) {
    if (state.transitioning) return;
    const clamped = Math.max(0, Math.min(SCREENS.length - 1, nextStep));
    const current = els.screens[SCREENS[state.step]];
    if (clamped === state.step && current && current.classList.contains("is-active")) {
      return;
    }

    // Do not enter summary until analysis completed
    if (SCREENS[clamped] === "summary" && !state.analysisComplete && SCREENS[state.step] === "analysis") {
      return;
    }

    const previousId = SCREENS[state.step];
    state.transitioning = true;
    state.step = clamped;
    persist();
    activateScreen(SCREENS[state.step], previousId);

    window.setTimeout(function () {
      state.transitioning = false;
      Object.keys(els.screens).forEach(function (id) {
        els.screens[id].classList.remove("is-exit");
      });
    }, 520);
  }

  function validateCurrent() {
    clearErrors();
    const id = SCREENS[state.step];

    if (id === "name") {
      const value = trim(els.nameInput && els.nameInput.value);
      if (!value) {
        showError(els.nameError, "Please add your name to continue.");
        if (els.nameInput) els.nameInput.focus();
        return false;
      }
      if (value.length > 50) {
        showError(els.nameError, "Please keep this a little shorter.");
        return false;
      }
      state.data.name = value;
      return true;
    }

    if (id === "businessName") {
      const value = trim(els.businessInput && els.businessInput.value);
      if (!value) {
        showError(els.businessError, "Please add your business name to continue.");
        if (els.businessInput) els.businessInput.focus();
        return false;
      }
      if (value.length > 80) {
        showError(els.businessError, "Please keep this a little shorter.");
        return false;
      }
      state.data.businessName = value;
      return true;
    }

    if (id === "website") {
      const value = trim(els.websiteInput && els.websiteInput.value);
      if (!value) {
        showError(els.websiteError, "Please add your website to continue.");
        if (els.websiteInput) els.websiteInput.focus();
        return false;
      }
      if (!isLikelyWebsite(value)) {
        showError(
          els.websiteError,
          "That doesn’t look like a website yet. Try something like yoursite.com"
        );
        if (els.websiteInput) els.websiteInput.focus();
        return false;
      }
      state.data.website = normalizeWebsite(value);
      if (els.websiteInput) {
        els.websiteInput.value = state.data.website.replace(/^https?:\/\//i, "");
      }
      return true;
    }

    if (id === "description") {
      const value = trim(els.descriptionInput && els.descriptionInput.value);
      if (!value) {
        showError(els.descriptionError, "A short description helps us get this right.");
        if (els.descriptionInput) els.descriptionInput.focus();
        return false;
      }
      if (value.length < 12) {
        showError(
          els.descriptionError,
          "A short sentence is enough — please add a little more."
        );
        return false;
      }
      if (value.length > 400) {
        showError(els.descriptionError, "Please keep this a little shorter.");
        return false;
      }
      state.data.description = value;
      return true;
    }

    return true;
  }

  function next() {
    if (!validateCurrent()) return;
    persist();
    goTo(state.step + 1);
  }

  function back() {
    if (state.step <= 1) return;
    clearErrors();
    if (SCREENS[state.step] === "summary") {
      goTo(SCREENS.indexOf("description"));
      return;
    }
    goTo(state.step - 1);
  }

  function launchGrowthPlan() {
    if (!state.analysisComplete && localStorage.getItem("ra_onboard_complete") !== "true") {
      // Allow launch from summary only after analysis path
      state.analysisComplete = true;
    }
    try {
      localStorage.setItem("ra_onboard_complete", "true");
    } catch (_) {
      /* ignore */
    }
    persist();
    goTo(SCREENS.indexOf("launch"));
  }

  function bind() {
    document.querySelectorAll("[data-ra-next]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        next();
      });
    });

    document.querySelectorAll("[data-ra-back]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        back();
      });
    });

    const launch = document.getElementById("raLaunchCta");
    if (launch) {
      launch.addEventListener("click", function (e) {
        e.preventDefault();
        launchGrowthPlan();
      });
    }

    if (els.analysisRetry) {
      els.analysisRetry.addEventListener("click", function (e) {
        e.preventDefault();
        // Clear force-fail for retry within session
        if (window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete("failAnalysis");
          window.history.replaceState({}, "", url.pathname + url.search);
        }
        startAnalysis();
      });
    }

    [els.nameInput, els.businessInput, els.websiteInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          next();
        }
      });
    });
  }

  function initScreens() {
    SCREENS.forEach(function (id) {
      const el = document.getElementById("ra-" + id);
      if (el) els.screens[id] = el;
    });
  }

  function boot() {
    initScreens();
    loadState();
    hydrateInputs();
    bind();
    buildAnalysisDots();
    activateScreen(SCREENS[state.step], null);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
