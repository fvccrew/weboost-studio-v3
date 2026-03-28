/* ============================================
   WEBOOST STUDIO — V3 GSAP ENGINE
   Crazy intro, advanced marquees, smooth scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ========== SMOOTH SCROLL (pure GSAP, no Lenis) ==========
  // Smooth anchor scrolling handled via ScrollToPlugin
  gsap.ticker.lagSmoothing(0);

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
    const clone = row.innerHTML;
    row.innerHTML += clone; // duplicate for seamless

    const totalW = row.scrollWidth / 2;

    if (isReverse) gsap.set(row, { x: -totalW });

    const tween = gsap.to(row, {
      x: isReverse ? 0 : -totalW,
      duration: isReverse ? 28 : 32,
      ease: 'none',
      repeat: -1,
    });

    // Velocity-reactive speed
    ScrollTrigger.create({
      trigger: row.closest('.marquee-block'),
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => {
        const v = Math.abs(self.getVelocity());
        const speed = gsap.utils.clamp(1, 5, 1 + v / 2000);
        gsap.to(tween, { timeScale: speed, duration: 0.4, ease: 'power2.out', overwrite: true });
      },
      onLeave: () => gsap.to(tween, { timeScale: 1, duration: 0.8 }),
      onLeaveBack: () => gsap.to(tween, { timeScale: 1, duration: 0.8 }),
    });
  });

  // ========== DIVIDER TEXT PARALLAX ==========
  document.querySelectorAll('.divider-text').forEach(text => {
    const dir = text.dataset.dir === 'right' ? 1 : -1;
    gsap.fromTo(text,
      { x: dir * 300 },
      {
        x: dir * -300,
        ease: 'none',
        scrollTrigger: {
          trigger: text.closest('.section-divider'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        }
      }
    );
  });

  // ========== SCROLL REVEALS ==========
  // Generic reveal-up
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    });
  });

  // Section nums
  gsap.utils.toArray('.section-num').forEach(n => {
    gsap.from(n, {
      scrollTrigger: { trigger: n, start: 'top 90%', once: true },
      opacity: 0, x: -30, duration: 0.6, ease: 'power3.out',
    });
  });

  // Section titles — clip from bottom
  gsap.utils.toArray('.section-title').forEach(t => {
    gsap.from(t, {
      scrollTrigger: { trigger: t, start: 'top 88%', once: true },
      clipPath: 'inset(100% 0 0 0)', y: 40, duration: 1, ease: 'power4.out',
    });
  });

  // ========== SERVICE CARDS ==========
  const sCards = gsap.utils.toArray('.service-card');
  if (sCards.length) {
    gsap.from(sCards, {
      scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
      opacity: 0, y: 80, rotateX: 10, scale: 0.92,
      duration: 0.8, stagger: 0.08, ease: 'power3.out',
      transformPerspective: 800,
    });

    // 3D tilt
    sCards.forEach(card => {
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
  }

  // ========== PROCESS STEPS ==========
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.from(step, {
      scrollTrigger: { trigger: step, start: 'top 88%', once: true },
      opacity: 0, y: 60, scale: 0.95, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
    });
    // Number counter
    const num = step.querySelector('.process-step-num');
    if (num) {
      const val = parseInt(num.textContent);
      gsap.from(num, {
        scrollTrigger: { trigger: step, start: 'top 88%', once: true },
        innerText: 0, duration: 1.5, snap: { innerText: 1 }, ease: 'power2.out',
        delay: i * 0.1,
        onUpdate: function () { num.textContent = '0' + Math.round(parseFloat(num.textContent)); }
      });
    }
  });

  // ========== PRICING CARDS ==========
  const pCards = gsap.utils.toArray('.pricing-card');
  if (pCards.length) {
    gsap.from(pCards, {
      scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%', once: true },
      opacity: 0, y: 70, rotateX: 8, scale: 0.93,
      duration: 0.8, stagger: 0.12, ease: 'power3.out',
      transformPerspective: 800,
    });
  }

  // ========== PORTFOLIO ==========
  const folio = gsap.utils.toArray('.portfolio-item');
  if (folio.length) {
    gsap.from(folio, {
      scrollTrigger: { trigger: '.portfolio-grid', start: 'top 82%', once: true },
      opacity: 0, y: 70, scale: 0.9, duration: 0.8, stagger: 0.12, ease: 'power3.out',
    });
  }

  // ========== ABOUT ==========
  if (document.querySelector('.about-grid')) {
    gsap.from('.about-img-wrap', {
      scrollTrigger: { trigger: '.about-grid', start: 'top 82%', once: true },
      opacity: 0, x: -80, rotateY: 5, duration: 1, ease: 'power3.out', transformPerspective: 800,
    });
    gsap.from('.about-content', {
      scrollTrigger: { trigger: '.about-grid', start: 'top 82%', once: true },
      opacity: 0, x: 80, duration: 1, ease: 'power3.out',
    });

    // Tags stagger
    const tags = gsap.utils.toArray('.about-tag');
    if (tags.length) {
      gsap.from(tags, {
        scrollTrigger: { trigger: '.about-tags', start: 'top 90%', once: true },
        opacity: 0, scale: 0.7, y: 20, duration: 0.5, stagger: 0.05, ease: 'back.out(2)',
      });
    }
  }

  // ========== CONTACT ==========
  const fields = gsap.utils.toArray('.field');
  if (fields.length) {
    gsap.from(fields, {
      scrollTrigger: { trigger: '.contact-form', start: 'top 82%', once: true },
      opacity: 0, y: 30, duration: 0.6, stagger: 0.06, ease: 'power3.out',
    });
  }
  const cItems = gsap.utils.toArray('.contact-item');
  if (cItems.length) {
    gsap.from(cItems, {
      scrollTrigger: { trigger: '.contact-info', start: 'top 82%', once: true },
      opacity: 0, x: 50, duration: 0.6, stagger: 0.08, ease: 'power3.out',
    });
  }

  // ========== FOOTER ==========
  gsap.from('.footer-grid > *', {
    scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true },
    opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: 'power3.out',
  });

});