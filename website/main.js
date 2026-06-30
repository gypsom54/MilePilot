(function () {
  const nav = document.getElementById('nav');
  const reveals = document.querySelectorAll('.reveal');
  const faqItems = document.querySelectorAll('.faq-item');
  const demoOverlay = document.getElementById('demoOverlay');
  const demoBtn = document.getElementById('demoBtn');
  const demoBtn2 = document.getElementById('demoBtn2');
  const demoClose = document.getElementById('demoClose');

  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (Number.isNaN(target)) return;
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count]').forEach(animateCount);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('[data-count]').forEach((el) => {
      if (!el.closest('.reveal')) countObserver.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
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
    }, 350);
  }

  demoBtn?.addEventListener('click', openDemo);
  demoBtn2?.addEventListener('click', openDemo);
  demoClose?.addEventListener('click', closeDemo);
  demoOverlay?.addEventListener('click', (e) => {
    if (e.target === demoOverlay) closeDemo();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDemo();
  });
})();
