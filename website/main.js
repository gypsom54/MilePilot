(function () {
  const APP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
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
    'Taxi drivers',
    'Couriers',
    'Electricians',
    'Builders',
    'Estate agents',
    'Uber drivers',
    'Mobile hairdressers',
    'Consultants',
  ];

  let roleIndex = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function playPulseSweep(el, onDone) {
    if (!el) return;
    el.classList.remove('is-sweep', 'is-alive', 'alive', 'sweep');
    void el.offsetWidth;
    el.classList.add('is-sweep', 'sweep');
    const handler = () => {
      el.classList.remove('is-sweep', 'sweep');
      el.classList.add('is-alive', 'alive');
      el.removeEventListener('animationend', handler);
      onDone?.();
    };
    el.addEventListener('animationend', handler);
  }

  function runHeroSequence() {
    const line1 = document.getElementById('heroLine1');
    const line2 = document.getElementById('heroLine2');
    const line3 = document.getElementById('heroLine3');
    const brandPulse = document.getElementById('heroBrandPulse');
    const autopilotPulse = document.getElementById('heroAutopilotPulse');
    const rest = document.querySelectorAll('.hero-rest');
    const phone = document.getElementById('heroPhone');

    if (reducedMotion) {
      [line1, line2, line3, ...rest, phone].forEach((el) => el?.classList.add('is-in'));
      brandPulse?.classList.add('is-alive', 'alive');
      autopilotPulse?.classList.add('is-alive', 'alive');
      phone?.classList.add('is-alive');
      animatePhone(phone);
      return;
    }

    playPulseSweep(brandPulse);

    const t1 = 150;
    const t2 = t1 + 550 + 300;
    const t3 = t2 + 380 + 200;
    const tRest = t3 + 500;
    const tPhone = tRest + 200;

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
      phone?.classList.add('is-in');
      setTimeout(() => {
        phone?.classList.add('is-alive');
        animatePhone(phone);
      }, 700);
    }, tPhone);
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
    if (toast) setTimeout(() => toast.classList.add('is-shown'), 1200);
    phone.querySelectorAll('.phone-seq').forEach((el, i) => {
      el.style.animationDelay = `${0.12 + i * 0.06}s`;
    });
  }

  function staggerChildren(container) {
    const items = container.querySelectorAll(
      '.cc-card, .reveal-stagger, .timeline-step, [data-stagger], .trust-list li'
    );
    items.forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * STAGGER_MS);
    });
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
  } else {
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
  demoBtn2?.addEventListener('click', openDemo);
  demoClose?.addEventListener('click', closeDemo);
  demoOverlay?.addEventListener('click', (e) => {
    if (e.target === demoOverlay) closeDemo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDemo();
  });

  runHeroSequence();
})();
