/**
 * RankAura Sprint 1 — Onboarding conversation
 * One question per screen. No feature creep.
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
    { name: "Business", copy: "Learning what you do and who you serve." },
    { name: "Industry", copy: "Mapping the landscape around your market." },
    { name: "Competitors", copy: "Understanding who else is competing for attention." },
    { name: "Keywords", copy: "Finding the searches your customers already use." },
    { name: "Website", copy: "Reading your site the way search engines do." },
    { name: "Technical SEO", copy: "Checking the foundations that help you get found." },
    { name: "Local Presence", copy: "Seeing how you show up in your area." },
    { name: "Content Opportunities", copy: "Spotting clear places to grow your voice." },
    { name: "Authority", copy: "Measuring the trust signals that lift rankings." },
    { name: "Growth Plan", copy: "Bringing everything together into your first plan." },
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
    analysisName: document.getElementById("raAnalysisName"),
    analysisCopy: document.getElementById("raAnalysisCopy"),
    analysisStage: document.getElementById("raAnalysisStage"),
    analysisDots: document.getElementById("raAnalysisDots"),
    summaryBusiness: document.getElementById("raSummaryBusiness"),
    summaryFocus: document.getElementById("raSummaryFocus"),
    summaryNext: document.getElementById("raSummaryNext"),
    launchName: document.getElementById("raLaunchName"),
  };

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
    const business = state.data.businessName || "Your business";
    const website = state.data.website ? normalizeWebsite(state.data.website) : "";

    if (els.summaryBusiness) {
      els.summaryBusiness.innerHTML =
        business +
        (website
          ? ' <span>· ' + website.replace(/^https?:\/\//i, "") + "</span>"
          : "");
    }
    if (els.summaryFocus) {
      els.summaryFocus.textContent =
        "A clear path to get found for the searches that matter to " + business + ".";
    }
    if (els.summaryNext) {
      els.summaryNext.textContent =
        "We’ll start with the highest-impact opportunities for " + name + ".";
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

  function startAnalysis() {
    stopAnalysis();
    state.analysisIndex = 0;
    buildAnalysisDots();
    setAnalysisVisual(0);

    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dwell = reduced ? 160 : 1050;

    function tick() {
      if (state.analysisIndex >= ANALYSIS_STAGES.length - 1) {
        const dots = els.analysisDots
          ? els.analysisDots.querySelectorAll("li")
          : [];
        dots.forEach(function (dot) {
          dot.classList.add("is-done");
          dot.classList.remove("is-active");
        });
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
        showError(els.nameError, "Please enter your name.");
        if (els.nameInput) els.nameInput.focus();
        return false;
      }
      if (value.length > 50) {
        showError(els.nameError, "Please keep this under 50 characters.");
        return false;
      }
      state.data.name = value;
      return true;
    }

    if (id === "businessName") {
      const value = trim(els.businessInput && els.businessInput.value);
      if (!value) {
        showError(els.businessError, "Please enter your business name.");
        if (els.businessInput) els.businessInput.focus();
        return false;
      }
      if (value.length > 80) {
        showError(els.businessError, "Please keep this under 80 characters.");
        return false;
      }
      state.data.businessName = value;
      return true;
    }

    if (id === "website") {
      const value = trim(els.websiteInput && els.websiteInput.value);
      if (!value) {
        showError(els.websiteError, "Please enter your website.");
        if (els.websiteInput) els.websiteInput.focus();
        return false;
      }
      if (!isLikelyWebsite(value)) {
        showError(els.websiteError, "Enter a valid website, like yoursite.com");
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
        showError(els.descriptionError, "Tell us a little about your business.");
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
        showError(els.descriptionError, "Please keep this under 400 characters.");
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
    // Skip replaying the AI analysis when leaving the summary
    if (SCREENS[state.step] === "summary") {
      goTo(SCREENS.indexOf("description"));
      return;
    }
    goTo(state.step - 1);
  }

  function launchGrowthPlan() {
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
