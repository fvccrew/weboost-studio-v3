/* ============================================
   WEBOOST STUDIO — V3 GSAP ENGINE
   Crazy intro, advanced marquees, smooth scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

  // Only show preloader on FIRST visit during this session AND if preloader exists in DOM
  if (preloader && !alreadyVisited) {
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
          backgroundColor: '#4f46e5',
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
    // Preloader exists but already visited OR no preloader on this page
    if (preloader) {
      preloader.style.display = 'none';
    }
    document.body.style.overflow = "";
    heroReveal();
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

  // Smooth anchor
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const t = document.querySelector(link.getAttribute('href'));
      if (t) { e.preventDefault(); gsap.to(window, { scrollTo: { y: t, offsetY: 80 }, duration: 1.2, ease: 'power3.inOut' }); }
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

  // ========== DIVIDER TEXT — Infinite scroll like marquees ==========
  document.querySelectorAll('.section-divider').forEach(divider => {
    const text = divider.querySelector('.divider-text');
    if (!text) return;
    const dir = text.dataset.dir === 'right' ? -1 : 1;
    
    // Duplicate text for seamless loop
    const clone = text.cloneNode(true);
    clone.style.marginLeft = '60px';
    divider.appendChild(clone);
    
    // Wrap both in a flex container
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;white-space:nowrap;will-change:transform;';
    divider.innerHTML = '';
    wrapper.appendChild(text);
    wrapper.appendChild(clone);
    divider.appendChild(wrapper);
    
    const totalW = wrapper.scrollWidth / 2;
    
    if (dir < 0) gsap.set(wrapper, { x: -totalW, force3D: true });
    
    gsap.to(wrapper, {
      x: dir < 0 ? 0 : -totalW,
      duration: 18,
      ease: 'none',
      repeat: -1,
      force3D: true,
    });
  });

  // ========== SCROLL REVEALS — CSS class based (no gsap.from bugs) ==========
  const revealElements = document.querySelectorAll(
    '.reveal-up, .section-num, .section-title, .service-card, .process-step, .pricing-card, .portfolio-item, .about-img-wrap, .about-content, .about-tag, .field, .contact-item, .footer-grid > *, .why-card, .feature-card, .type-card, .france-card, .zone-card, .faq-item, .tech-item'
  );

  // Set initial hidden state — but ONLY for elements below the current viewport
  const viewportBottom = window.scrollY + window.innerHeight;
  
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const elTop = rect.top + window.scrollY;
    
    if (elTop < viewportBottom) {
      // Already visible or above viewport — show immediately, no animation
      el.style.opacity = '1';
      el.style.transform = 'none';
    } else {
      // Below viewport — set hidden for reveal animation
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
    }
  });

  // Use IntersectionObserver for elements still hidden
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  revealElements.forEach(el => {
    if (el.style.opacity === '0') observer.observe(el);
  });

  // ========== 3D TILT on service cards (hover only, no scroll animation) ==========
  document.querySelectorAll('.service-card').forEach(card => {
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

});