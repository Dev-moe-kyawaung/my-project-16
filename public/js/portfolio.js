/* =========================================================
   Aarav Kapoor · Portfolio 2026 · ULTIMATE PRO MAX
   Lenis-style smooth scroll · scroll-spy · scroll-linked
   animations · reveal-on-scroll · counters · ⌘K palette
   Custom cursor · 3D tilt · Konami easter egg · theme cycle
   FAQ accordion · live clock · calendar widget
   ========================================================= */

(() => {
  'use strict';

  /* ─────────────────────────────────────────────────────
     0 · Helpers
     ───────────────────────────────────────────────────── */
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;

  /* ─────────────────────────────────────────────────────
     1 · vh / vw  · mobile-safe viewport units
     ───────────────────────────────────────────────────── */
  const setViewportUnits = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
  };
  setViewportUnits();
  window.addEventListener('resize', setViewportUnits);

  /* ─────────────────────────────────────────────────────
     2 · Lenis-style smooth scroll (lightweight, vanilla)
     ───────────────────────────────────────────────────── */
  class SmoothScroller {
    constructor(options = {}) {
      this.duration = options.duration ?? 1.15;
      this.easing   = options.easing   ?? (t => 1 - Math.pow(1 - t, 4));
      this.targetY  = window.scrollY;
      this.currentY = this.targetY;
      this.raf      = null;
      this.dir      = 1;
      this.lastY    = this.targetY;
      this.init();
    }
    init() {
      document.documentElement.classList.add('lenis', 'lenis-smooth');
      window.scrollTo(0, 0);
      $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href');
          if (!href || href === '#') return;
          const el = document.querySelector(href);
          if (!el) return;
          e.preventDefault();
          this.scrollTo(el);
        });
      });
      window.addEventListener('wheel',     this.onWheel.bind(this),     { passive: false });
      window.addEventListener('touchstart', this.onTouchStart.bind(this),{ passive: true });
      window.addEventListener('touchmove',  this.onTouchMove.bind(this), { passive: false });
      window.addEventListener('keydown',    this.onKey.bind(this));
      this.animate();
    }
    onWheel(e) {
      e.preventDefault();
      const delta = e.deltaY;
      this.targetY = clamp(this.targetY + delta, 0, this.maxScroll());
      this.dir = Math.sign(delta);
    }
    onTouchStart(e) { this.touchStartY = e.touches[0].clientY; }
    onTouchMove(e) {
      const dy = this.touchStartY - e.touches[0].clientY;
      this.touchStartY = e.touches[0].clientY;
      this.targetY = clamp(this.targetY + dy * 1.4, 0, this.maxScroll());
      e.preventDefault();
    }
    onKey(e) {
      const step = window.innerHeight * 0.85;
      if      (e.key === 'ArrowDown') { this.targetY = clamp(this.targetY +  60, 0, this.maxScroll()); }
      else if (e.key === 'ArrowUp')   { this.targetY = clamp(this.targetY -  60, 0, this.maxScroll()); }
      else if (e.key === 'PageDown')  { this.targetY = clamp(this.targetY + step, 0, this.maxScroll()); }
      else if (e.key === 'PageUp')    { this.targetY = clamp(this.targetY - step, 0, this.maxScroll()); }
      else if (e.key === 'Home')      { this.targetY = 0; }
      else if (e.key === 'End')       { this.targetY = this.maxScroll(); }
      else return;
      e.preventDefault();
    }
    scrollTo(target) {
      const el = typeof target === 'string' ? $(target) : target;
      if (!el) return;
      const nav = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = el.getBoundingClientRect().top + this.targetY - nav - 16;
      this.targetY = clamp(top, 0, this.maxScroll());
    }
    maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    animate() {
      this.currentY = lerp(this.currentY, this.targetY, 0.085);
      if (Math.abs(this.targetY - this.currentY) < 0.4) this.currentY = this.targetY;
      window.scrollTo(0, Math.round(this.currentY));
      const newDir = this.currentY > this.lastY ? 1 : -1;
      if (newDir !== this.dir) this.dir = newDir;
      this.lastY = this.currentY;
      const max = this.maxScroll();
      const progress = max > 0 ? this.currentY / max : 0;
      document.documentElement.style.setProperty('--scroll-y',         `${this.currentY}px`);
      document.documentElement.style.setProperty('--scroll-progress',  `${progress}`);
      document.documentElement.style.setProperty('--scroll-direction', `${this.dir}`);
      this.raf = requestAnimationFrame(this.animate.bind(this));
    }
  }
  const scroller = reduceMotion ? null : new SmoothScroller();

  /* ─────────────────────────────────────────────────────
     3 · Loader · lifts on first paint
     ───────────────────────────────────────────────────── */
  const loader = $('#loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-done'), 600);
      setTimeout(() => { loader.style.display = 'none'; }, 2000);
    });
    // Fallback: lift after 4s even if window load is delayed
    setTimeout(() => loader.classList.add('is-done'), 4000);
  }

  /* ─────────────────────────────────────────────────────
     4 · Custom cursor
     ───────────────────────────────────────────────────── */
  const cursor = $('#cursor');
  if (cursor && !isTouch && !reduceMotion) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      document.documentElement.style.setProperty('--mouse-x', `${mx}px`);
      document.documentElement.style.setProperty('--mouse-y', `${my}px`);
      document.documentElement.style.setProperty('--mx', `${mx}px`);
      document.documentElement.style.setProperty('--my', `${my}px`);
    });
    const loop = () => {
      cx = lerp(cx, mx, 0.20);
      cy = lerp(cy, my, 0.20);
      cursor.style.transform = `translate3d(${cx - 6}px, ${cy - 6}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();

    // Hover state on interactive elements
    const hoverSel = 'a, button, .glass-card, .project, .skill-card, .arch-card, .cert-card, .oss-card, .testimonial, .timeline__item, .blog-item, .now-item, .setup-item, .radar-ring, .fact, .skill-card, .price-card, .faq-item, [data-tilt]';
    $$('body').forEach(() => {});
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
    });
    document.addEventListener('mouseenter', (e) => {
      if (e.target.matches('input, textarea, [contenteditable]')) cursor.classList.add('is-text');
    }, true);
    document.addEventListener('mouseleave', (e) => {
      if (e.target.matches('input, textarea, [contenteditable]')) cursor.classList.remove('is-text');
    }, true);
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ─────────────────────────────────────────────────────
     5 · Navbar · scroll-spy + stuck-state + mobile menu
     ───────────────────────────────────────────────────── */
  const nav       = $('#nav');
  const navList   = $('#navList');
  const navToggle = $('#navToggle');

  const navClock  = $('#navClock');
  const navTZ     = $('#navTZ');

  let clockTimer = null;
  const startClock = () => {
    const tick = () => {
      if (!navClock) return;
      const now = new Date();
      const time = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      navClock.textContent = `${time} CET`;
      if (navTZ) navTZ.textContent = 'Berlin';
    };
    tick();
    clockTimer = setInterval(tick, 30 * 1000);
  };
  startClock();

  const onScrollNav = () => {
    const y = window.scrollY;
    nav?.classList.toggle('is-stuck', y > 32);
    // FAB
    const fab = $('#fab');
    fab?.classList.toggle('is-visible', y > window.innerHeight * 0.5);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  navToggle?.addEventListener('click', () => {
    const open = navList.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  $$('[data-nav-link]').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  // Scroll-spy
  const sections = $$('[data-section]');
  const setActiveLink = (id) => {
    $$('[data-nav-link]').forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
    });
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          setActiveLink(entry.target.id);
          const rect = entry.target.getBoundingClientRect();
          const total = entry.target.offsetHeight;
          const seen  = clamp((window.innerHeight * 0.5 - rect.top) / (total + window.innerHeight * 0.5), 0, 1);
          entry.target.style.setProperty('--section-progress', seen);
        }
      });
    }, { threshold: [0.4, 0.6], rootMargin: '-72px 0px 0px 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ─────────────────────────────────────────────────────
     6 · Reveal on scroll (data-reveal)
     ───────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal], [data-reveal-stagger]').forEach(el => reveal.observe(el));
  } else {
    $$('[data-reveal], [data-reveal-stagger]').forEach(el => el.classList.add('is-visible'));
  }

  /* ─────────────────────────────────────────────────────
     7 · Number counters
     ───────────────────────────────────────────────────── */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const dur    = 1600;
    const start  = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$('.counter', entry.target).forEach(animateCount);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    $$('.counter').forEach(c => counterObs.observe(c.parentElement || c));
  } else {
    $$('.counter').forEach(animateCount);
  }

  /* ─────────────────────────────────────────────────────
     8 · Skill radar bar fills
     ───────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const barObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    $$('.skill-radar__bar').forEach(el => barObs.observe(el));
  }

  /* ─────────────────────────────────────────────────────
     9 · Typewriter (hero roles)
     ───────────────────────────────────────────────────── */
  const tw = $('#typewriter');
  if (tw) {
    const roles = JSON.parse(tw.dataset.roles);
    let i = 0, j = 0, deleting = false;
    const tick = () => {
      const cur = roles[i];
      if (!deleting) {
        tw.textContent = cur.slice(0, ++j);
        if (j === cur.length) { deleting = true; return setTimeout(tick, 1800); }
      } else {
        tw.textContent = cur.slice(0, --j);
        if (j === 0) { deleting = false; i = (i + 1) % roles.length; }
      }
      setTimeout(tick, deleting ? 30 : 55);
    };
    tick();
  }

  /* ─────────────────────────────────────────────────────
     10 · Magnetic buttons
     ───────────────────────────────────────────────────── */
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 16;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────────────
     11 · 3D tilt
     ───────────────────────────────────────────────────── */
  $$('[data-tilt]').forEach(card => {
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top)  / r.height;
        const rx = (0.5 - py) * 8;
        const ry = (px - 0.5) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        raf = null;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────────────
     12 · Theme switcher · Material You accent cycles
     ───────────────────────────────────────────────────── */
  const themeSwitcher = $('#themeSwitcher');
  const swatches = $$('.theme-switcher__swatch');
  const accents = ['purple', 'cyan', 'emerald', 'sunset', 'sakura'];

  const setAccent = (accent) => {
    document.documentElement.dataset.accent = accent;
    swatches.forEach(s => s.classList.toggle('is-active', s.dataset.accent === accent));
    try { localStorage.setItem('accent', accent); } catch (_) {}
  };
  swatches.forEach(s => s.addEventListener('click', () => setAccent(s.dataset.accent)));

  // Restore saved accent
  try {
    const saved = localStorage.getItem('accent');
    if (saved && accents.includes(saved)) setAccent(saved);
  } catch (_) {}

  // Show switcher after a delay
  if (themeSwitcher) {
    setTimeout(() => themeSwitcher.classList.add('is-visible'), 1500);
  }

  /* ─────────────────────────────────────────────────────
     13 · ⌘K Command palette (with keyboard nav)
     ───────────────────────────────────────────────────── */
  const palette       = $('#palette');
  const paletteInput  = $('#paletteInput');
  const paletteRes    = $('#paletteResults');
  const paletteItems = [
    { label: 'About',        href: '#about' },
    { label: 'Skills',       href: '#skills' },
    { label: 'Skill radar',  href: '#radarChartTitle' },
    { label: 'Experience',   href: '#experience' },
    { label: 'Projects',     href: '#projects' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Open source',  href: '#opensource' },
    { label: 'Certifications', href: '#certsTitle' },
    { label: 'Testimonials', href: '#testimonialsTitle' },
    { label: 'Tech radar',   href: '#radarTitle' },
    { label: 'Speaking',     href: '#speakingTitle' },
    { label: 'Writing',      href: '#writing' },
    { label: 'Now',          href: '#nowTitle' },
    { label: 'Services',     href: '#services' },
    { label: 'Calendar',     href: '#bookingTitle' },
    { label: 'FAQ',          href: '#faqTitle' },
    { label: 'Mentorship',   href: '#mentorTitle' },
    { label: 'Dev setup',    href: '#setupTitle' },
    { label: 'Books',        href: '#booksTitle' },
    { label: 'Side projects',href: '#sideTitle' },
    { label: 'Community',    href: '#communityTitle' },
    { label: 'Awards',       href: '#awardsTitle' },
    { label: 'Newsletter',   href: '#newsletterTitle' },
    { label: 'Contact',      href: '#contact' },
  ];
  let focusedIdx = 0;

  const renderPalette = (q = '') => {
    const list = q
      ? paletteItems.filter(i => i.label.toLowerCase().includes(q.toLowerCase()))
      : paletteItems;
    paletteRes.innerHTML = list.length
      ? list.map((i, idx) =>
          `<a href="${i.href}" class="palette__item ${idx === 0 ? 'is-focused' : ''}" data-idx="${idx}">
             <span>${i.label}</span>
             <span class="palette__item-meta">jump →</span>
           </a>`).join('')
      : '<div class="palette__empty">No matches</div>';
    focusedIdx = 0;
  };
  const openPalette  = () => {
    palette.hidden = false;
    renderPalette('');
    paletteInput.value = '';
    paletteInput.focus();
  };
  const closePalette = () => { palette.hidden = true; };

  const focusItem = (idx) => {
    const items = $$('.palette__item', paletteRes);
    if (!items.length) return;
    focusedIdx = clamp(idx, 0, items.length - 1);
    items.forEach((it, i) => it.classList.toggle('is-focused', i === focusedIdx));
    items[focusedIdx].scrollIntoView({ block: 'nearest' });
  };

  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const accel = isMac ? e.metaKey : e.ctrlKey;
    if (accel && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
    }
    if (!palette.hidden) {
      if (e.key === 'Escape') { closePalette(); e.preventDefault(); }
      else if (e.key === 'ArrowDown') { focusItem(focusedIdx + 1); e.preventDefault(); }
      else if (e.key === 'ArrowUp')   { focusItem(focusedIdx - 1); e.preventDefault(); }
      else if (e.key === 'Enter') {
        const items = $$('.palette__item', paletteRes);
        const target = items[focusedIdx];
        if (target) {
          e.preventDefault();
          target.click();
        }
      }
    }
  });
  palette?.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });
  paletteInput?.addEventListener('input', (e) => renderPalette(e.target.value));
  paletteRes?.addEventListener('click', () => closePalette());
  paletteRes?.addEventListener('mousemove', (e) => {
    const item = e.target.closest('.palette__item');
    if (item) {
      const items = $$('.palette__item', paletteRes);
      const idx = items.indexOf(item);
      if (idx >= 0) focusItem(idx);
    }
  });

  /* ─────────────────────────────────────────────────────
     14 · FAQ accordion
     ───────────────────────────────────────────────────── */
  $$('[data-faq]').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('is-open');
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('is-open');
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  /* ─────────────────────────────────────────────────────
     15 · Calendar widget (simple month grid)
     ───────────────────────────────────────────────────── */
  const calGrid   = $('#calGrid');
  const calMonth  = $('#calMonth');
  const calPrev   = $('#calPrev');
  const calNext   = $('#calNext');
  const calSlots  = $('#calSlots');

  if (calGrid) {
    const today = new Date();
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    const renderCal = () => {
      const year  = view.getFullYear();
      const month = view.getMonth();
      calMonth.textContent = view.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const labels = ['S','M','T','W','T','F','S'];
      let html = labels.map(l => `<div class="calendar__day calendar__day--label">${l}</div>`).join('');
      for (let i = 0; i < firstDay; i++) html += '<div></div>';
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isToday  = date.toDateString() === today.toDateString();
        const isPast   = date < today && !isToday;
        const weekday  = date.getDay();
        const isWeekend = weekday === 0 || weekday === 6;
        html += `<div class="calendar__day ${isToday ? 'calendar__day--today' : ''} ${isPast || isWeekend ? 'calendar__day--disabled' : ''}" data-day="${d}">${d}</div>`;
      }
      calGrid.innerHTML = html;
      $$('.calendar__day:not(.calendar__day--disabled):not(.calendar__day--label)', calGrid).forEach(el => {
        el.addEventListener('click', () => {
          $$('.calendar__day', calGrid).forEach(d => d.classList.remove('calendar__day--selected'));
          el.classList.add('calendar__day--selected');
        });
      });
    };
    renderCal();
    calPrev?.addEventListener('click', () => { view.setMonth(view.getMonth() - 1); renderCal(); });
    calNext?.addEventListener('click', () => { view.setMonth(view.getMonth() + 1); renderCal(); });
    $$('.calendar__slot', calSlots).forEach(s => {
      s.addEventListener('click', () => {
        $$('.calendar__slot', calSlots).forEach(x => x.classList.remove('calendar__slot--active'));
        s.classList.add('calendar__slot--active');
      });
    });
  }

  /* ─────────────────────────────────────────────────────
     16 · Toast · welcome message
     ───────────────────────────────────────────────────── */
  const toast = $('#toast');
  const toastText = $('#toastText');
  if (toast && !sessionStorage.getItem('welcomed')) {
    setTimeout(() => {
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      sessionStorage.setItem('welcomed', '1');
      setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.hidden = true, 400);
      }, 6000);
    }, 3500);
  }

  /* ─────────────────────────────────────────────────────
     17 · Konami code easter egg
     ───────────────────────────────────────────────────── */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiIdx = 0;
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        konamiIdx = 0;
        activateEasterEgg();
      }
    } else {
      konamiIdx = 0;
    }
  });

  const activateEasterEgg = () => {
    // Rotate through all accents quickly, then end on sakura + show a toast
    let n = 0;
    const cycle = setInterval(() => {
      setAccent(accents[n % accents.length]);
      n++;
      if (n > 8) {
        clearInterval(cycle);
        setAccent('sakura');
        if (toast && toastText) {
          toast.hidden = false;
          toastText.innerHTML = '🎉 Dev mode unlocked — you found the easter egg!';
          toast.classList.add('is-visible');
          setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.hidden = true, 400);
          }, 4000);
        }
      }
    }, 200);
  };

  /* ─────────────────────────────────────────────────────
     18 · Dynamic year & date
     ───────────────────────────────────────────────────── */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  $$('[data-date]').forEach(el => {
    el.textContent = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  });

  /* ─────────────────────────────────────────────────────
     19 · Console easter egg
     ───────────────────────────────────────────────────── */
  console.info(
    '%c Aarav Kapoor · Portfolio 2026',
    'color:#7f52ff;font:700 18px Space Grotesk, sans-serif;padding:8px 0;'
  );
  console.info('%c↑↑↓↓←→←→BA — try the Konami code 😉', 'color:#06b6d4;font:11px JetBrains Mono, monospace;');
  console.info('Want to chat? hello@aarav.dev');

})();
