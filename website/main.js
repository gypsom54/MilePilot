(function () {
  const STAGGER_MS = 100;

  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  const reveals = document.querySelectorAll('.reveal');
  const faqItems = document.querySelectorAll('.faq-item');
  const demoOverlay = document.getElementById('demoOverlay');
  const demoBtn = document.getElementById('demoBtn');
  const demoBtn2 = document.getElementById('demoBtn2');
  const demoClose = document.getElementById('demoClose');
  const roleRotator = document.getElementById('roleRotator');

  const roles = [
    'HMRC mileage claims',
    'Client visits',
    'Site visits',
    'Deliveries',
    'Taxi & private hire',
    'Trades & mobile businesses',
    'Sales appointments',
    'Estate agency visits',
    'Self-employed mileage records',
  ];

  let roleIndex = 0;
  let heroFallbackTimer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function playPulseSweep(el) {
    if (!el) return;
    el.classList.remove('is-sweep', 'is-alive', 'alive', 'sweep');
    void el.offsetWidth;
    el.classList.add('is-sweep', 'sweep');
    const handler = () => {
      el.classList.remove('is-sweep', 'sweep');
      el.classList.add('is-alive', 'alive');
      el.removeEventListener('animationend', handler);
    };
    el.addEventListener('animationend', handler);
  }

  function completeHero() {
    if (heroFallbackTimer) {
      clearTimeout(heroFallbackTimer);
      heroFallbackTimer = null;
    }
    document.body.classList.remove('hero-animating');
    document.body.classList.add('hero-ready');

    document.querySelectorAll('.hero-line, .hero-rest').forEach((el) => {
      el.classList.add('is-in');
    });

    const phone = document.getElementById('heroPhone');
    if (phone) {
      phone.classList.add('is-in', 'is-alive');
      animatePhone(phone);
    }

    const brandPulse = document.getElementById('heroBrandPulse');
    const autopilotPulse = document.getElementById('heroAutopilotPulse');
    brandPulse?.classList.add('is-alive', 'alive');
    autopilotPulse?.classList.add('is-alive', 'alive');
  }

  function runHeroSequence() {
    const line1 = document.getElementById('heroLine1');
    const line2 = document.getElementById('heroLine2');
    const line3 = document.getElementById('heroLine3');
    const brandPulse = document.getElementById('heroBrandPulse');
    const autopilotPulse = document.getElementById('heroAutopilotPulse');
    const rest = document.querySelectorAll('.hero-rest');
    const phone = document.getElementById('heroPhone');

    heroFallbackTimer = setTimeout(completeHero, 4000);

    if (reducedMotion) {
      completeHero();
      return;
    }

    playPulseSweep(brandPulse);

    const t1 = 200;
    const t2 = t1 + 550 + 300;
    const t3 = t2 + 380 + 200;
    const tRest = t3 + 350;
    const tPhone = 350;
    const tDone = tRest + rest.length * STAGGER_MS + 300;

    setTimeout(() => line1?.classList.add('is-in'), t1);
    setTimeout(() => line2?.classList.add('is-in'), t2);
    setTimeout(() => {
      line3?.classList.add('is-in');
      playPulseSweep(autopilotPulse);
    }, t3);

    rest.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-in'), tRest + i * STAGGER_MS);
    });

    setTimeout(() => {
      phone?.classList.add('is-in', 'is-alive');
      animatePhone(phone);
    }, tPhone);

    setTimeout(completeHero, tDone);
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function drawRouteOnce(container) {
    if (!container) return;
    container.querySelectorAll('.route-animated').forEach((path) => {
      path.classList.remove('is-drawing');
      path.style.strokeDashoffset = '100';
      void path.offsetWidth;
      path.classList.add('is-drawing');
    });
  }

  function animatePhone(phone) {
    if (!phone) return;
    drawRouteOnce(phone);
    phone.querySelectorAll('[data-live="once"]').forEach(animateCount);
    const toast = phone.querySelector('.phone-toast-once');
    if (toast) setTimeout(() => toast.classList.add('is-shown'), 900);
    phone.querySelectorAll('.phone-seq').forEach((el, i) => {
      el.style.animationDelay = `${0.08 + i * 0.05}s`;
    });
  }

  function staggerChildren(container) {
    const items = container.querySelectorAll(
      '.cc-card, .reveal-stagger, .timeline-step, [data-stagger]'
    );
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * STAGGER_MS);
    });
  }

  function animateWorkflowCard(card) {
    if (!card || reducedMotion) {
      card?.querySelectorAll('.workflow-step').forEach((s) => s.classList.add('is-active'));
      return;
    }
    const steps = card.querySelectorAll('.workflow-step');
    let i = 0;
    function next() {
      if (i >= steps.length) return;
      steps[i].classList.add('is-active');
      i += 1;
      setTimeout(next, 600);
    }
    next();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          staggerChildren(entry.target);
          entry.target.querySelectorAll('[data-count]').forEach(animateCount);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.dataset.section;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.nav === id);
          });
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' }
    );
    document.querySelectorAll('[data-section]').forEach((el) => sectionObserver.observe(el));

    document.querySelectorAll('.app-demo-phone, .report-wallet').forEach((block) => {
      const phoneObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            drawRouteOnce(entry.target);
            entry.target.querySelectorAll('[data-count]').forEach(animateCount);
            phoneObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.35 }
      );
      phoneObserver.observe(block);
    });

    const workflowCard = document.getElementById('workflowCard');
    if (workflowCard) {
      const wfObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateWorkflowCard(entry.target);
            wfObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.4 }
      );
      wfObserver.observe(workflowCard);
    }
  } else {
    completeHero();
    reveals.forEach((el) => {
      el.classList.add('is-visible');
      staggerChildren(el);
    });
    document.querySelectorAll('[data-count]').forEach(animateCount);
  }

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((i) => {
        i.classList.remove('is-open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function rotateRole() {
    if (!roleRotator || reducedMotion) return;
    roleRotator.classList.add('is-fading');
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleRotator.textContent = roles[roleIndex];
      roleRotator.classList.remove('is-fading');
    }, 500);
  }

  if (roleRotator) setInterval(rotateRole, 2800);

  function openDemo() {
    if (!demoOverlay) return;
    demoOverlay.hidden = false;
    requestAnimationFrame(() => demoOverlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }

  function closeDemo() {
    if (!demoOverlay) return;
    demoOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      demoOverlay.hidden = true;
    }, 400);
  }

  demoBtn?.addEventListener('click', () => {
    const timeline = document.getElementById('timeline');
    if (timeline) timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else openDemo();
  });
  demoBtn2?.addEventListener('click', () => {
    const why = document.getElementById('why-different');
    if (why) why.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else openDemo();
  });
  demoClose?.addEventListener('click', closeDemo);
  demoOverlay?.addEventListener('click', (e) => {
    if (e.target === demoOverlay) closeDemo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDemo();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runHeroSequence);
  } else {
    runHeroSequence();
  }
})();
