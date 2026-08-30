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

  // ========== HERO REVEAL — cinematic curtain opening + kinetic title ==========
  function initScrollCueFade() {
    const cue = document.querySelector('.hero-scrollcue');
    if (!cue) return;
    window.addEventListener('scroll', () => {
      cue.style.opacity = window.scrollY > 60 ? '0' : '';
    }, { passive: true });
  }

  function heroReveal() {
    if (!hasGsap || prefersReducedMotion) {
      document.querySelectorAll('.hero-title .word-inner').forEach(el => { el.style.transform = 'none'; el.style.filter = 'none'; });
      document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-panel').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      document.querySelectorAll('.hero-curtain, .hero-sheen').forEach(el => { el.style.display = 'none'; });
      return;
    }
    gsap.set('.hero-title .word-inner', { y: '110%', rotate: 6, filter: 'blur(10px)' });
    gsap.set('.hero-ghost-num', { opacity: 0, scale: 1.12 });
    gsap.set('.hero-sheen', { xPercent: -170 });
    const tl = gsap.timeline({ delay: 0.1 });
    // Act 0 — the curtains open on the photo, a light sweep glides across it.
    tl.to('.hero-curtain-l', { xPercent: -100, duration: 1.05, ease: 'power4.inOut' }, 0);
    tl.to('.hero-curtain-r', { xPercent: 100, duration: 1.05, ease: 'power4.inOut' }, 0);
    tl.to('.hero-sheen', { xPercent: 170, duration: 1.3, ease: 'power2.inOut' }, 0.05);
    tl.to('.hero-ghost-num', { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, 0.35);
    // Act 1 — eyebrow, kinetic title, copy and panel land in sequence.
    tl.to('.hero-eyebrow', { opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.5);
    tl.to('.hero-title .word-inner', { y: '0%', rotate: 0, filter: 'blur(0px)', duration: 1, stagger: 0.05, ease: 'power4.out' }, 0.55);
    tl.to('.hero-desc', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.95);
    tl.to('.hero-btns', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.05);
    tl.to('.hero-panel', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9);
    tl.to('.hero-scrollcue', { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.3);
    tl.eventCallback('onComplete', initScrollCueFade);
  }

  if (hasHash) {
    document.querySelectorAll('.hero-title .word-inner').forEach(el => { el.style.transform = 'none'; el.style.filter = 'none'; });
    document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-panel').forEach(el => { el.style.opacity = '1'; });
    document.querySelectorAll('.hero-curtain, .hero-sheen').forEach(el => { el.style.display = 'none'; });
    const ghostNum = document.querySelector('.hero-ghost-num');
    if (ghostNum) ghostNum.style.opacity = '1';
    const scrollCue = document.querySelector('.hero-scrollcue');
    if (scrollCue) scrollCue.style.opacity = '1';
    initScrollCueFade();
  } else {
    heroReveal();
  }

  // ========== HERO — mouse-driven depth parallax (desktop hover only) ==========
  if (hasGsap && !isTouch && !prefersReducedMotion) {
    const heroEl = document.querySelector('.hero');
    const heroPhoto = document.querySelector('.hero-photo');
    const ghostNum = document.querySelector('.hero-ghost-num');
    if (heroEl && heroPhoto) {
      const xToPhoto = gsap.quickTo(heroPhoto, 'x', { duration: 1.1, ease: 'power3.out' });
      const yToPhoto = gsap.quickTo(heroPhoto, 'y', { duration: 1.1, ease: 'power3.out' });
      const xToGhost = ghostNum ? gsap.quickTo(ghostNum, 'x', { duration: 1.3, ease: 'power3.out' }) : null;
      heroEl.addEventListener('mousemove', e => {
        const r = heroEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xToPhoto(px * -14);
        yToPhoto(py * -10);
        if (xToGhost) xToGhost(px * 20);
      });
      heroEl.addEventListener('mouseleave', () => {
        xToPhoto(0); yToPhoto(0);
        if (xToGhost) xToGhost(0);
      });
    }
  }

  // ========== HERO — film grain flicker (canvas noise) ==========
  const grainCanvas = document.querySelector('.hero-grain');
  if (grainCanvas && !prefersReducedMotion) {
    const gctx = grainCanvas.getContext('2d');
    const GRAIN_SIZE = 160;
    grainCanvas.width = GRAIN_SIZE;
    grainCanvas.height = GRAIN_SIZE;
    const drawGrain = () => {
      const imgData = gctx.createImageData(GRAIN_SIZE, GRAIN_SIZE);
      const buf = imgData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255;
        buf[i] = buf[i + 1] = buf[i + 2] = v;
        buf[i + 3] = 255;
      }
      gctx.putImageData(imgData, 0, 0);
    };
    drawGrain();
    let grainInterval = setInterval(drawGrain, 90);
    document.addEventListener('visibilitychange', () => {
      clearInterval(grainInterval);
      if (!document.hidden) grainInterval = setInterval(drawGrain, 90);
    });
  }

  // ========== HERO — photo comes alive on scroll ==========
  const heroPhotoImg = document.querySelector('.hero-photo-img');
  if (heroPhotoImg && hasGsap && !prefersReducedMotion) {
    if (window.innerWidth > 900) {
      // Desktop: hero stays pinned for a genuine two-act scroll story —
      // the photo zooms into color first, the intro copy exits, then a
      // second punchline crossfades in centre-stage before unpinning.
      const heroTl = gsap.timeline({
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=160%', scrub: 0.6, pin: true },
      });
      heroTl.to(heroPhotoImg, { scale: 1.04, filter: 'grayscale(0.05) brightness(0.8) saturate(1.05) contrast(1.02)', ease: 'none' }, 0);
      heroTl.to('.hero-content', { y: -60, opacity: 0, ease: 'power1.in' }, 0.26);
      heroTl.to('.hero-ghost-num', { opacity: 0.12, y: -80, scale: 1.08, ease: 'none' }, 0);
      heroTl.to('.hero-stage2', { opacity: 1, ease: 'power2.out' }, 0.46);
      heroTl.fromTo('.hero-stage2-line', { y: 36, filter: 'blur(8px)' }, { y: 0, filter: 'blur(0px)', ease: 'power2.out' }, 0.5);
      heroTl.to('.hero-stage2', { opacity: 0, ease: 'power1.in' }, 0.86);
    } else {
      // Mobile/tablet: no pinning (address-bar resize makes pinned sections
      // jump on phones) — a real depth parallax instead, tied to the hero's
      // normal scroll-past, image kept oversized so it never shows an edge.
      gsap.to(heroPhotoImg, {
        yPercent: 7,
        filter: 'grayscale(0.12) brightness(0.85) saturate(1.05) contrast(1.02)',
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
      });
      gsap.to('.hero-ghost-num', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 },
      });
    }
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

  // ========== WORD ROTATORS — mot qui s'enchaîne ==========
  document.querySelectorAll('.word-rotator').forEach(el => {
    const items = Array.from(el.querySelectorAll('.word-rotator-item'));
    if (!items.length) return;
    let idx = 0;
    items[0].classList.add('is-active');
    const sizeToActive = () => { el.style.width = items[idx].getBoundingClientRect().width + 'px'; };
    sizeToActive();
    // Widths measured before the display font swaps in are wrong (FOUT) — re-measure once it's ready
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeToActive);
    if (items.length < 2 || prefersReducedMotion) return;
    const advance = () => {
      const next = (idx + 1) % items.length;
      items[idx].classList.remove('is-active');
      items[idx].classList.add('is-prev');
      items[next].classList.add('is-active');
      const leaving = items[idx];
      idx = next;
      sizeToActive();
      setTimeout(() => leaving.classList.remove('is-prev'), 550);
    };
    setTimeout(() => { advance(); setInterval(advance, 2400); }, 2400 + Math.random() * 900);
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

  // ========== PORTFOLIO — cursor-following preview (hover-capable only) ==========
  const portfolioPreview = document.getElementById('portfolioPreview');
  if (portfolioPreview && !isTouch && !prefersReducedMotion) {
    const previewImg = document.getElementById('portfolioPreviewImg');
    const previewTag = document.getElementById('portfolioPreviewTag');
    const cursorBlob = document.querySelector('.cursor-blob');
    let mx = -200, my = -200, px = -200, py = -200, scale = 0.82, targetScale = 0.82, lastMx = -200, rot = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      px += (mx - px) * 0.16;
      py += (my - py) * 0.16;
      scale += (targetScale - scale) * 0.16;
      const vx = mx - lastMx; lastMx = mx;
      rot += ((Math.max(-14, Math.min(14, vx * 1.4))) - rot) * 0.16;
      portfolioPreview.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%) scale(${scale}) rotate(${rot}deg)`;
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('.portfolio-row').forEach(row => {
      const src = row.dataset.previewImg;
      const tag = row.dataset.previewTag || '';
      row.addEventListener('mouseenter', () => {
        if (src) previewImg.src = src;
        if (previewTag) previewTag.textContent = tag;
        portfolioPreview.classList.add('is-active');
        targetScale = 1;
        if (cursorBlob) cursorBlob.style.opacity = '0';
      });
      row.addEventListener('mouseleave', () => {
        portfolioPreview.classList.remove('is-active');
        targetScale = 0.82;
        if (cursorBlob) cursorBlob.style.opacity = '';
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
