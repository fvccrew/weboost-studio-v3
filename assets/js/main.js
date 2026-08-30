/* ============================================
   WEBOOST STUDIO — V5
   Deep Riviera — curseur magnétique, texte kinétique, scroll pinné
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGsap = typeof gsap !== 'undefined';

  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);
  }

  window.history.scrollRestoration = 'manual';
  const hasHash = window.location.hash && window.location.hash.length > 1;

  // ========== MAGNETIC CURSOR BLOB ==========
  if (!isTouch && !prefersReducedMotion) {
    const blob = document.querySelector('.cursor-blob');
    if (blob) {
      document.documentElement.classList.add('has-cursor');
      let mx = -100, my = -100, bx = -100, by = -100;
      window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        blob.classList.add('is-visible');
      });
      const tick = () => {
        bx += (mx - bx) * 0.16;
        by += (my - by) * 0.16;
        blob.style.transform = `translate(${bx}px, ${by}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
      };
      tick();
      document.querySelectorAll('a, button, .faq-q').forEach(el => {
        el.addEventListener('mouseenter', () => blob.classList.add('is-active'));
        el.addEventListener('mouseleave', () => blob.classList.remove('is-active'));
      });
      document.addEventListener('mouseleave', () => blob.classList.remove('is-visible'));
    }

    // Magnetic primary buttons
    if (hasGsap) {
      document.querySelectorAll('.btn-fill, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', e => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.3;
          gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
        });
      });
    }
  }

  // ========== NAV ==========
  const nav = document.querySelector('.nav');
  if (nav) {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
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
          gsap.fromTo(mobileLinks, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'back.out(1.4)' });
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

  // ========== HERO REVEAL (kinetic word-by-word) ==========
  function heroReveal() {
    if (!hasGsap || prefersReducedMotion) {
      document.querySelectorAll('.hero-title .word-inner').forEach(el => { el.style.transform = 'none'; el.style.filter = 'none'; });
      document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-panel').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }
    gsap.set('.hero-title .word-inner', { y: '110%', rotate: 6, filter: 'blur(10px)' });
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('.hero-eyebrow', { opacity: 1, duration: 0.5, ease: 'power3.out' }, 0);
    tl.to('.hero-title .word-inner', { y: '0%', rotate: 0, filter: 'blur(0px)', duration: 1, stagger: 0.05, ease: 'power4.out' }, 0.15);
    tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55);
    tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.65);
    tl.to('.hero-panel', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5);

    gsap.to('.hero-glow.g1', { y: 40, x: -20, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.hero-glow.g2', { y: -30, x: 20, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
    gsap.to('.hero-ghost-num', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
      y: -120, opacity: 0.4,
    });
  }

  if (hasHash) {
    document.querySelectorAll('.hero-title .word-inner').forEach(el => { el.style.transform = 'none'; el.style.filter = 'none'; });
    document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-panel').forEach(el => { el.style.opacity = '1'; });
  } else {
    heroReveal();
  }

  // ========== KINETIC SECTION TITLES (scroll-triggered) ==========
  if (hasGsap && !prefersReducedMotion && !hasHash) {
    document.querySelectorAll('.section-title').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 34, filter: 'blur(6px)' }, {
        opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    gsap.utils.toArray('.section-ghost').forEach(el => {
      gsap.to(el, {
        y: -30,
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
  }

  // ========== TICKERS ==========
  document.querySelectorAll('.ticker-row').forEach(row => {
    const isReverse = row.classList.contains('reverse');
    if (!row.dataset.cloned) { row.innerHTML += row.innerHTML; row.dataset.cloned = 'true'; }
    if (prefersReducedMotion) return;
    const totalW = row.scrollWidth / 2;
    if (!hasGsap) { row.style.animation = `tickerScroll ${isReverse ? 34 : 40}s linear infinite ${isReverse ? 'reverse' : 'normal'}`; return; }
    if (isReverse) gsap.set(row, { x: -totalW });
    gsap.to(row, { x: isReverse ? 0 : -totalW, duration: isReverse ? 34 : 40, ease: 'none', repeat: -1 });
  });

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
    if (prefersReducedMotion || !hasGsap) return;
    const totalW = wrapper.scrollWidth / 2;
    if (dir < 0) gsap.set(wrapper, { x: -totalW });
    gsap.to(wrapper, { x: dir < 0 ? 0 : -totalW, duration: 38, ease: 'none', repeat: -1 });
  });

  // ========== PROCESS — PINNED SCROLL STORY (desktop only) ==========
  const processPin = document.querySelector('.process-pin');
  if (processPin && hasGsap && !prefersReducedMotion && window.innerWidth > 1024) {
    const items = Array.from(processPin.querySelectorAll('.process-rail-item'));
    const nums = Array.from(processPin.querySelectorAll('.process-visual-num'));
    const progress = processPin.querySelector('.process-rail-progress');
    if (items.length && nums.length) {
      gsap.set(nums[0], { opacity: 1 });
      let currentIdx = 0;
      ScrollTrigger.create({
        trigger: processPin,
        start: 'top top+=' + (80),
        end: '+=' + (items.length * 420),
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.min(items.length - 1, Math.floor(self.progress * items.length));
          if (idx !== currentIdx) {
            items[currentIdx]?.classList.remove('active');
            gsap.to(nums[currentIdx], { opacity: 0, duration: 0.25 });
            currentIdx = idx;
          }
          items[idx].classList.add('active');
          gsap.to(nums[idx], { opacity: 1, duration: 0.25 });
          if (progress) progress.style.height = (self.progress * 100) + '%';
        },
      });
    }
  } else if (processPin) {
    processPin.querySelectorAll('.process-rail-item').forEach(el => el.classList.add('active'));
  }

  // ========== SCROLL REVEALS (with fallback sweep so nothing stays hidden) ==========
  if (typeof IntersectionObserver !== 'undefined' && !hasHash && !prefersReducedMotion) {
    const revealElements = document.querySelectorAll(
      '.reveal-up, .service-card, .pricing-card, .portfolio-row, .about-img-wrap, .about-content, .about-tag, .about-principle, .field, .contact-item, .footer-grid > *, .faq-item'
    );
    const viewportBottom = window.scrollY + window.innerHeight;
    revealElements.forEach(el => {
      if (el.closest('.zones-grid-index')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top + window.scrollY >= viewportBottom) el.classList.add('reveal-hidden');
    });
    const reveal = (el) => { el.classList.remove('reveal-hidden'); el.classList.add('reveal-visible'); };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
    revealElements.forEach(el => { if (el.classList.contains('reveal-hidden')) observer.observe(el); });

    let sweepQueued = false;
    const sweep = () => {
      sweepQueued = false;
      document.querySelectorAll('.reveal-hidden').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) { reveal(el); observer.unobserve(el); }
      });
    };
    const queueSweep = () => { if (sweepQueued) return; sweepQueued = true; requestAnimationFrame(sweep); };
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

  // ========== TILT on glass cards (hover only) ==========
  if (hasGsap && !isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
        gsap.to(card, { rotateY: x, rotateX: y, transformPerspective: 700, duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
      });
    });
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

const styleTag = document.createElement('style');
styleTag.textContent = '@keyframes tickerScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}';
document.head.appendChild(styleTag);

window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    document.querySelectorAll('.reveal-hidden').forEach(function (el) {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
    document.querySelectorAll('.reveal-up, .service-card, .pricing-card, .portfolio-row, .faq-item').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});
