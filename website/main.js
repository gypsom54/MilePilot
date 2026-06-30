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

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
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

  const carousel = document.getElementById('phoneCarousel');
  const dotsEl = document.getElementById('phoneDots');
  const captionEl = document.getElementById('phoneCaption');
  if (carousel && dotsEl) {
    const slides = Array.from(carousel.querySelectorAll('.phone-slide'));
    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'phone-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Show screen ' + (i + 1));
      dot.addEventListener('click', () => goTo(i, true));
      dotsEl.appendChild(dot);
    });

    const dots = Array.from(dotsEl.querySelectorAll('.phone-dot'));

    function goTo(index, manual) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      if (captionEl && slides[current].dataset.label) {
        captionEl.textContent = slides[current].dataset.label;
      }
      if (manual) resetTimer();
    }

    function next() {
      goTo(current + 1, false);
    }

    function resetTimer() {
      if (timer) clearInterval(timer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(next, 4200);
    }

    resetTimer();
  }
})();
