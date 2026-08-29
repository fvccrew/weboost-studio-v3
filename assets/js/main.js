/* ============================================
   WEBOOST STUDIO — V3 GSAP ENGINE
   Crazy intro, advanced marquees, smooth scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // GSAP est prêt : on désactive le fallback CSS et on laisse GSAP animer
  document.documentElement.classList.add('js-ready');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // ========== CUSTOM CURSOR (desktop, motion-safe only) ==========
  if (!isTouch && !prefersReducedMotion) {
    const dot = document.querySelector('.cursor');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring) {
      document.documentElement.classList.add('has-cursor');
      const label = ring.querySelector('.cursor-label');
      let mx = -100, my = -100, rx = -100, ry = -100;
      window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      });
      gsap.ticker.add(() => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      });
      document.querySelectorAll('a, button, .faq-q').forEach(el => {
        el.addEventListener('mouseenter', () => {
          ring.classList.add('is-active');
          if (label) label.textContent = el.dataset.cursor || '';
        });
        el.addEventListener('mouseleave', () => {
          ring.classList.remove('is-active');
          if (label) label.textContent = '';
        });
      });
      document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
      document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }

    // ---- Magnetic buttons ----
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      });
    });
  }

  // Si on arrive sur une ancre (#services depuis une page ville), tout afficher
  // immédiatement pour éviter le saut de scroll et le chargement chaotique
  const hasHash = window.location.hash && window.location.hash.length > 1;

  gsap.registerPlugin(ScrollTrigger);

  // ========== SMOOTH SCROLL (pure GSAP, no Lenis) ==========
  gsap.ticker.lagSmoothing(0);

  // Fix back-navigation scroll position issues
  window.history.scrollRestoration = 'manual';

  // Refresh ScrollTrigger after everything is loaded
  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });

  // Also refresh when coming back to the tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) ScrollTrigger.refresh();
  });

  // Lock scroll during preloader
  const preloader = document.querySelector('.preloader');
  const alreadyVisited = sessionStorage.getItem('weboost_visited');

  // Only show preloader on FIRST visit during this session AND if preloader exists
  // AND if not arriving directly on an anchor (from a city page menu link)
  if (preloader && !alreadyVisited && !hasHash && !prefersReducedMotion) {
    document.body.style.overflow = "hidden";
    sessionStorage.setItem('weboost_visited', '1');

    const container = document.getElementById('preloaderLetters');
    const counter = preloader.querySelector('.preloader-counter');
    const line = preloader.querySelector('.preloader-line');
    const subLine = preloader.querySelector('.preloader-sub');

    // Generate individual letter spans
    const word1 = 'WEBOOST';
    const word2 = 'STUDIO';
    const allChars = [];

    word1.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'preloader-letter white';
      span.textContent = char;
      container.appendChild(span);
      allChars.push(span);
    });

    // Space between words
    const spacer = document.createElement('span');
    spacer.className = 'preloader-letter space';
    container.appendChild(spacer);

    word2.split('').forEach(char => {
      const span = document.createElement('span');
      span.className = 'preloader-letter accent';
      span.textContent = char;
      container.appendChild(span);
      allChars.push(span);
    });

    // Random explosion origins for each letter
    allChars.forEach(letter => {
      const randomX = (Math.random() - 0.5) * 1600;
      const randomY = (Math.random() - 0.5) * 1000;
      const randomZ = Math.random() * 1500 - 500;
      const randomRotX = (Math.random() - 0.5) * 720;
      const randomRotY = (Math.random() - 0.5) * 720;
      const randomRotZ = (Math.random() - 0.5) * 360;
      gsap.set(letter, {
        x: randomX,
        y: randomY,
        z: randomZ,
        rotateX: randomRotX,
        rotateY: randomRotY,
        rotateZ: randomRotZ,
        opacity: 0,
        scale: 0.3,
        transformPerspective: 1200,
      });
    });

    const masterTl = gsap.timeline({
      onComplete: () => {
        // Exit: letters explode outward + screen wipe
        const exitTl = gsap.timeline({
          onComplete: () => {
            preloader.style.display = 'none';
            document.body.style.overflow = "";
            heroReveal();
          }
        });

        // Letters explode outward
        exitTl.to(allChars, {
          x: () => (Math.random() - 0.5) * 2000,
          y: () => (Math.random() - 0.5) * 1400,
          z: () => Math.random() * 800,
          rotateX: () => (Math.random() - 0.5) * 540,
          rotateY: () => (Math.random() - 0.5) * 540,
          rotateZ: () => (Math.random() - 0.5) * 360,
          opacity: 0,
          scale: 0,
          duration: 0.7,
          stagger: 0.02,
          ease: 'power3.in',
        });

        exitTl.to(subLine, {
          opacity: 0, y: -20, duration: 0.3, ease: 'power2.in'
        }, 0);

        exitTl.to(counter, {
          opacity: 0, scale: 1.5, duration: 0.3, ease: 'power2.in'
        }, 0);

        // Screen flash + wipe
        exitTl.to(preloader, {
          backgroundColor: '#e3a836',
          duration: 0.08,
        }, 0.4);
        exitTl.to(preloader, {
          clipPath: 'inset(50% 0 50% 0)',
          duration: 0.7,
          ease: 'power4.inOut',
        }, 0.45);
      }
    });

    // ---- PHASE 1: Letters fly in from chaos → assemble into WEBOOST STUDIO ----
    masterTl.to(allChars, {
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: {
        each: 0.04,
        from: 'random',
      },
      ease: 'elastic.out(0.8, 0.6)',
    });

    // ---- PHASE 2: Bounce / pulse once assembled ----
    masterTl.to(allChars, {
      scale: 1.15,
      duration: 0.2,
      stagger: 0.015,
      ease: 'power2.out',
    }, '-=0.2');

    masterTl.to(allChars, {
      scale: 1,
      duration: 0.3,
      stagger: 0.015,
      ease: 'elastic.out(1, 0.4)',
    });

    // ---- PHASE 3: Sub-words appear ----
    masterTl.to(subLine, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3');

    masterTl.from('.preloader-sub-word', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
    }, '<');

    // ---- PHASE 4: Counter + progress line ----
    masterTl.to(counter, {
      innerText: 100,
      duration: 1.8,
      snap: { innerText: 1 },
      ease: 'power2.inOut',
      onUpdate: function () {
        counter.textContent = Math.round(parseFloat(counter.textContent));
      }
    }, 1);

    masterTl.to(line, {
      width: '100%',
      duration: 1.8,
      ease: 'power2.inOut',
    }, 1);

    // ---- PHASE 5: Letters do a subtle 3D wave before exploding ----
    masterTl.to(allChars, {
      rotateY: (i) => Math.sin(i * 0.5) * 25,
      rotateX: (i) => Math.cos(i * 0.5) * 15,
      z: (i) => Math.sin(i * 0.8) * 60,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power2.inOut',
    }, '-=0.3');

    masterTl.to(allChars, {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.out',
    });

    // Small pause before exit
    masterTl.to({}, { duration: 0.2 });

  } else {
    // Preloader exists but already visited OR no preloader OR arriving on anchor
    if (preloader) {
      preloader.style.display = 'none';
    }
    document.body.style.overflow = "";
    if (hasHash) {
      // Arrivée sur ancre : hero visible instantanément, pas d'animation
      document.querySelectorAll('.hero-title .line-inner').forEach(el => { el.style.transform = 'none'; });
      document.querySelectorAll('.hero-eyebrow, .hero-desc, .hero-btns, .hero-meta').forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
      document.querySelectorAll('.hero-bg-glow').forEach(el => { el.style.opacity = '0.25'; });
    } else {
      heroReveal();
    }
  }

  // ========== NAV ==========
  const nav = document.querySelector('.nav');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -60',
      onEnter: () => nav.classList.add('scrolled'),
      onLeaveBack: () => nav.classList.remove('scrolled'),
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      if (mobileNav.classList.contains('open')) {
        gsap.fromTo(mobileNav.querySelectorAll('a'),
          { opacity: 0, y: 40, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.5)', delay: 0.15 }
        );
      }
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth anchor (natif, sans plugin)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ========== HERO REVEAL ==========
  function heroReveal() {
    const tl = gsap.timeline();

    // Glows fade in
    tl.to('.hero-bg-glow', {
      opacity: 0.25,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
    });

    // Title lines slam in
    tl.to('.hero-title .line-inner', {
      y: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power4.out',
    }, 0.1);

    // Eyebrow
    tl.to('.hero-eyebrow', {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
    }, 0.6);

    // Desc
    tl.to('.hero-desc', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 0.8);

    // Buttons
    tl.to('.hero-btns', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 0.9);

    // Meta (coordinates / availability)
    tl.to('.hero-meta', {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    }, 1.0);

    // Parallax glows
    gsap.to('.hero-bg-glow.g1', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
      y: -200, x: 80, scale: 0.7,
    });
    gsap.to('.hero-bg-glow.g2', {
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
      y: -100, scale: 1.3,
    });
  }

  // ========== INFINITE MARQUEES ==========
  document.querySelectorAll('.marquee-row').forEach(row => {
    const isReverse = row.classList.contains('reverse');
    
    // Only clone if not already cloned
    if (!row.dataset.cloned) {
      row.innerHTML += row.innerHTML;
      row.dataset.cloned = 'true';
    }

    const totalW = row.scrollWidth / 2;

    if (isReverse) gsap.set(row, { x: -totalW, force3D: true });

    gsap.to(row, {
      x: isReverse ? 0 : -totalW,
      duration: isReverse ? 28 : 32,
      ease: 'none',
      repeat: -1,
      force3D: true,
    });
  });

  // ========== DIVIDER TEXT — Infinite scroll ==========
  document.querySelectorAll('.section-divider').forEach(divider => {
    const text = divider.querySelector('.divider-text');
    if (!text) return;
    const dir = text.dataset.dir === 'right' ? -1 : 1;
    
    const clone = text.cloneNode(true);
    clone.style.marginLeft = '60px';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;white-space:nowrap;will-change:transform;';
    
    divider.innerHTML = '';
    wrapper.appendChild(text);
    wrapper.appendChild(clone);
    divider.appendChild(wrapper);
    
    const totalW = wrapper.scrollWidth / 2;
    
    if (dir < 0) gsap.set(wrapper, { x: -totalW });
    
    gsap.to(wrapper, {
      x: dir < 0 ? 0 : -totalW,
      duration: 30,
      ease: 'none',
      repeat: -1,
      force3D: true,
    });
  });

  // ========== SCROLL REVEALS — Progressive enhancement ==========
  // Content is visible by default. Animations only added if JS loads fast enough.
  if (typeof IntersectionObserver !== 'undefined' && !hasHash) {
    const revealElements = document.querySelectorAll(
      '.reveal-up, .section-num, .section-title, .service-card, .process-step, .pricing-card, .portfolio-row, .about-img-wrap, .about-content, .about-tag, .about-principle, .field, .contact-item, .footer-grid > *, .why-card, .feature-card, .type-card, .france-card, .zone-card, .faq-item, .tech-item'
    );

    const viewportBottom = window.scrollY + window.innerHeight;
    
    revealElements.forEach(el => {
      // Never hide zone cards (they're links — must stay visible for back-navigation)
      if (el.closest('.zones-grid-index')) return;

      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      
      // Only animate elements below the viewport
      if (elTop >= viewportBottom) {
        el.classList.add('reveal-hidden');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-hidden');
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    revealElements.forEach(el => {
      if (el.classList.contains('reveal-hidden')) observer.observe(el);
    });
  } else if (hasHash) {
    // Arrivée sur une ancre : tout afficher immédiatement, puis scroller proprement
    document.querySelectorAll('.reveal-up, .reveal-hidden').forEach(el => {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    // Re-scroll vers l'ancre une fois la mise en page stabilisée
    const target = document.querySelector(window.location.hash);
    if (target) {
      requestAnimationFrame(() => {
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo(0, y);
      });
    }
  }

  // ========== 3D TILT on service cards (hover only, no scroll animation) ==========
  document.querySelectorAll('.service-card').forEach(card => {
    if (card.tagName === 'A') return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
      gsap.to(card, { rotateY: x, rotateX: y, transformPerspective: 600, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

});

// ========== FIX RETOUR NAVIGATEUR (bfcache) ==========
// Quand on revient avec le bouton précédent, force tout en visible
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    document.querySelectorAll('.reveal-hidden').forEach(function(el) {
      el.classList.remove('reveal-hidden');
      el.classList.add('reveal-visible');
    });
    // Force aussi tous les éléments potentiellement cachés
    document.querySelectorAll('.reveal-up, .service-card, .pricing-card, .portfolio-row, .faq-item').forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
});