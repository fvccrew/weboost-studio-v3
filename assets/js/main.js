/* ============================================
   WEBOOST STUDIO — V4
   Minimaliste Architecte — interactions sobres
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
  }

  window.history.scrollRestoration = 'manual';

  const hasHash = window.location.hash && window.location.hash.length > 1;

  // ========== NAV ==========
  const nav = document.querySelector('.nav');
  if (nav) {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    const mobileLinks = mobileNav.querySelectorAll('a');
    toggle.addEventListener('click', () => {
      const opening = !mobileNav.classList.contains('open');
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = opening ? 'hidden' : '';
      if (opening) {
        if (hasGsap && !prefersReducedMotion) {
          gsap.fromTo(mobileLinks, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' });
        } else {
          mobileLinks.forEach(a => { a.style.opacity = '1'; a.style.transform = 'none'; });
        }
      }
    });
    mobileLinks.forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ========== HERO REVEAL ==========
  function heroReveal() {
    if (!hasGsap || prefersReducedMotion) {
      document.querySelectorAll('.hero-title .line-inner').forEach(el => { el.style.transform = 'none'; });
      document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-meta').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.to('.hero-eyebrow', { opacity: 1, duration: 0.5, ease: 'power3.out' }, 0);
    tl.to('.hero-title .line-inner', { y: 0, duration: 1, stagger: 0.07, ease: 'power4.out' }, 0.1);
    tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.45);
    tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55);
    tl.to('.hero-meta', { opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.6);
  }

  if (hasHash) {
    document.querySelectorAll('.hero-title .line-inner').forEach(el => { el.style.transform = 'none'; });
    document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-meta').forEach(el => { el.style.opacity = '1'; });
  } else {
    heroReveal();
  }

  // ========== TICKERS — infinite scroll ==========
  document.querySelectorAll('.ticker-row').forEach(row => {
    const isReverse = row.classList.contains('reverse');
    if (!row.dataset.cloned) {
      row.innerHTML += row.innerHTML;
      row.dataset.cloned = 'true';
    }
    if (prefersReducedMotion) return;
    const totalW = row.scrollWidth / 2;
    if (!hasGsap) {
      row.style.animation = `tickerScroll ${isReverse ? 34 : 40}s linear infinite ${isReverse ? 'reverse' : 'normal'}`;
      return;
    }
    if (isReverse) gsap.set(row, { x: -totalW });
    gsap.to(row, { x: isReverse ? 0 : -totalW, duration: isReverse ? 34 : 40, ease: 'none', repeat: -1 });
  });

  // ========== DIVIDER TEXT — infinite scroll ==========
  document.querySelectorAll('.section-divider').forEach(divider => {
    const text = divider.querySelector('.divider-text');
    if (!text) return;
    const dir = text.dataset.dir === 'right' ? -1 : 1;
    const clone = text.cloneNode(true);
    clone.style.marginLeft = '48px';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;white-space:nowrap;will-change:transform;';
    divider.innerHTML = '';
    wrapper.appendChild(text);
    wrapper.appendChild(clone);
    divider.appendChild(wrapper);
    if (prefersReducedMotion) return;
    const totalW = wrapper.scrollWidth / 2;
    if (!hasGsap) return;
    if (dir < 0) gsap.set(wrapper, { x: -totalW });
    gsap.to(wrapper, { x: dir < 0 ? 0 : -totalW, duration: 38, ease: 'none', repeat: -1 });
  });

  // ========== MAGNETIC CTA (primary buttons only, motion-safe desktop) ==========
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (hasGsap && !isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.btn-fill').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  // ========== SCROLL REVEALS ==========
  if (typeof IntersectionObserver !== 'undefined' && !hasHash && !prefersReducedMotion) {
    const revealElements = document.querySelectorAll(
      '.reveal-up, .service-row, .service-card, .process-step, .pricing-card, .portfolio-row, .about-img-wrap, .about-content, .about-tag, .about-principle, .field, .contact-item, .footer-grid > *, .faq-item'
    );
    const viewportBottom = window.scrollY + window.innerHeight;
    revealElements.forEach(el => {
      if (el.closest('.zones-grid-index')) return;
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      if (elTop >= viewportBottom) el.classList.add('reveal-hidden');
    });
    const reveal = (el) => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    revealElements.forEach(el => {
      if (el.classList.contains('reveal-hidden')) observer.observe(el);
    });

    // Fallback safety net: a fast/instant scroll (keyboard End, browser
    // restore, a big trackpad flick) can land past an element without the
    // browser ever reporting an intersection frame for it. Sweep any
    // still-hidden elements on scroll/resize so nothing stays invisible.
    let sweepQueued = false;
    const sweep = () => {
      sweepQueued = false;
      document.querySelectorAll('.reveal-hidden').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          reveal(el);
          observer.unobserve(el);
        }
      });
    };
    const queueSweep = () => {
      if (sweepQueued) return;
      sweepQueued = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
  } else {
    document.querySelectorAll('.reveal-up, .reveal-hidden').forEach(el => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    if (hasHash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        requestAnimationFrame(() => {
          const y = target.getBoundingClientRect().top + window.scrollY - 76;
          window.scrollTo(0, y);
        });
      }
    }
  }

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  if (hasGsap) {
    window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 100));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) ScrollTrigger.refresh(); });
  }
});

/* Fallback keyframes for ticker when GSAP is unavailable */
const styleTag = document.createElement('style');
styleTag.textContent = '@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
document.head.appendChild(styleTag);

/* Back/forward cache fix — force everything visible on bfcache restore */
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    document.querySelectorAll('.reveal-hidden').forEach(function (el) {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
    document.querySelectorAll('.reveal-up, .service-row, .service-card, .pricing-card, .portfolio-row, .faq-item').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});
