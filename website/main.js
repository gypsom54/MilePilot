(function () {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
  const reveals = document.querySelectorAll('.reveal');
  const staggers = document.querySelectorAll('.reveal-stagger:not(.reveal .reveal-stagger)');
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
  let liveCountTimer = null;

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function animateCount(el, loop) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = loop ? 2200 : 1600;
    const start = performance.now();
    const base = loop ? target - 0.3 : 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = base + (target - base) * eased;
      el.textContent = value.toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function startLiveCounts() {
    document.querySelectorAll('[data-live="true"]').forEach((el) => {
      animateCount(el, true);
    });
    if (liveCountTimer) clearInterval(liveCountTimer);
    liveCountTimer = setInterval(() => {
      document.querySelectorAll('[data-live="true"]').forEach((el) => animateCount(el, true));
    }, 8000);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count]:not([data-live])').forEach((el) => animateCount(el, false));
            entry.target.querySelectorAll('.reveal-stagger').forEach((el) => el.classList.add('is-visible'));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));

    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.timeline .reveal-stagger').forEach((el) => staggerObserver.observe(el));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.section;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.dataset.nav === id);
            });
          }
        });
      },
      { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' }
    );
    document.querySelectorAll('[data-section]').forEach((el) => sectionObserver.observe(el));

    const phoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startLiveCounts();
            phoneObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    const heroPhone = document.querySelector('.hero .phone-wrap');
    if (heroPhone) phoneObserver.observe(heroPhone);
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
    document.querySelectorAll('[data-count]').forEach((el) => animateCount(el, false));
    startLiveCounts();
  }

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

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
    if (!roleRotator) return;
    roleRotator.classList.add('is-fading');
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleRotator.textContent = roles[roleIndex];
      roleRotator.classList.remove('is-fading');
    }, 500);
  }

  if (roleRotator) {
    setInterval(rotateRole, 2800);
  }

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
    if (timeline) {
      timeline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      openDemo();
    }
  });
  demoBtn2?.addEventListener('click', openDemo);
  demoClose?.addEventListener('click', closeDemo);
  demoOverlay?.addEventListener('click', (e) => {
    if (e.target === demoOverlay) closeDemo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDemo();
  });
})();
