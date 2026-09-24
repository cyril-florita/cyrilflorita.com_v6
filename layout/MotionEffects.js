"use client";
import { useEffect, useRef } from "react";
import { onPreloaderHidden } from "@/components/Preloader";
import { scrambleText, splitChars, hideSplitTitle, scrambleInTitle } from "@/public/utility/index";

// Site-wide pointer + text motion, mounted once per page by SiteLayout:
// - subheader text scramble and section-title letter type-in (all devices)
// - custom cursor, magnetic clickables, portfolio card tilt and hero
//   mouse parallax (desktop with a real mouse only)
// - scroll + mouse parallax on the dotted background circles (desktop)
// Everything is skipped under prefers-reduced-motion. Hover targets are found
// by delegation (closest()) so late-mounted content like the portfolio grid
// works without re-binding.

const CLICKABLE_SELECTOR = 'a, button, [role="button"], .cyril-dot, .cyril-prev, .cyril-next';
const MAGNETIC_STRENGTH = 0.3;
const MAGNETIC_MAX_PX = 12;
// Anything this tall or this big in area (portfolio cards, lightbox image
// links) isn't pulled — it's a block, not a control. Checked by height/area
// rather than width, so long one-line labels (e.g. the "Branding,
// Marketing, & Illustration" filter) still count as controls.
const MAGNETIC_MAX_H = 200;
const MAGNETIC_MAX_AREA = 320 * 200;
const MAGNETIC_EASE = 'translate 0.4s cubic-bezier(0, 0, 0.3642, 1)';

// Every clickable control gets pulled — except links inside running text
// (a link in a sentence shouldn't hop around), large blocks, and disabled
// items like the logo at the hero top.
const findMagnetic = (target) => {
  const el = target?.closest(CLICKABLE_SELECTOR);
  if (!el || el.closest('p') || el.classList.contains('cyril-disabled')) return null;
  // Still mid-entrance (see playHeroIntro) — its transitions aren't its own yet.
  if (el.classList.contains('cyril-hero-piece')) return null;
  // Filter links: move the whole <li>, since the active filter's tick mark
  // (a.cyril-current::after) is positioned against it — translating the
  // link alone would make the link its containing block and the tick jump.
  const host = el.closest('.cyril-filter li') || el;
  const rect = host.getBoundingClientRect();
  if (rect.height > MAGNETIC_MAX_H || rect.width * rect.height > MAGNETIC_MAX_AREA) return null;
  return host;
};

// One-time prep so `translate` both applies (it doesn't on plain inline
// boxes, e.g. icon links) and animates, keeping whatever transitions the
// element already has.
const prepMagnetic = (el) => {
  if (el.dataset.magnetic) return;
  el.dataset.magnetic = 'true';
  const cs = getComputedStyle(el);
  if (cs.display === 'inline') el.style.display = 'inline-block';
  const list = (value) => value.split(/,(?![^(]*\))/).map((v) => v.trim());
  const props = list(cs.transitionProperty);
  const durations = list(cs.transitionDuration);
  const easings = list(cs.transitionTimingFunction);
  const delays = list(cs.transitionDelay);
  const existing = props
    .map((p, i) => ({
      p,
      d: durations[i % durations.length],
      e: easings[i % easings.length],
      delay: delays[i % delays.length],
    }))
    .filter(({ d }) => parseFloat(d) > 0);
  const animated = existing.some(({ p }) => p === 'all' || p === 'translate');
  if (!animated) {
    el.style.transition = [
      ...existing.map(({ p, d, e, delay }) => `${p} ${d} ${e} ${delay}`),
      MAGNETIC_EASE,
    ].join(', ');
  }
};

const TILT_MAX_DEG = 8;

// Hero layers and how far (px) each drifts at the viewport edge. Opposite
// signs push the photo and the dotted box against each other for depth.
const PARALLAX_LAYERS = [
  ['.cyril-banner-image', -18],
  ['.cyril-banner-text', 10],
  ['.cyril-bg-title-boxed', 32],
];

// Section titles that type in letter by letter (the hero headline does the
// same, driven by playHeroIntro in app/page.js).
const TITLE_SELECTOR = '#portfolio-start h2.glitch, .cyril-onepage .cyril-section h2.glitch';

// Dotted background circles: how much further than their section they
// travel while it scrolls (fraction of the section's offset from the top of
// the viewport), plus how far they drift with the mouse. They're pushed
// *away* from the viewport while their section is off-screen, so they never
// poke into a neighbouring section and meet its circles. The large circles
// move less. At rest (section at the top) they're exactly where the markup
// puts them.
const BG_SCROLL_FACTOR = { large: 0.18, small: 0.4 };
const BG_MOUSE_PX = { large: 14, small: 28 };

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasFinePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 1200;

const MotionEffects = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Subheader scramble — once per element, as it scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        // Let the element's fade-in get going first.
        setTimeout(() => scrambleText(entry.target), 200);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    const unsubscribe = onPreloaderHidden(() => {
      document.querySelectorAll('.subheader').forEach((el) => observer.observe(el));
    });

    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, []);

  // Section titles. On desktop About Me the sections snap and their
  // contents re-fade every time one becomes active, so its title retypes
  // each time too (after its own stagger delay, in step with the fade).
  // Everywhere else (My Work, About Me on tablet/mobile) it types in once
  // as it scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;

    const titles = Array.from(document.querySelectorAll(TITLE_SELECTOR));
    titles.forEach((title) => {
      splitChars(title);
      hideSplitTitle(title);
    });

    const timers = new Set();
    const later = (fn, ms) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        later(() => scrambleInTitle(entry.target), 200);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    const sectionObservers = [];

    const unsubscribe = onPreloaderHidden(() => {
      titles.forEach((title) => {
        const section = title.closest('.cyril-onepage .cyril-section');
        if (!section || window.innerWidth <= 1200) {
          observer.observe(title);
          return;
        }

        let wasActive = false;
        let pending = null;
        const sync = () => {
          const active = section.classList.contains('cyril-active');
          if (active === wasActive) return;
          wasActive = active;
          clearTimeout(pending);
          if (active) {
            const delay = parseFloat(getComputedStyle(title).getPropertyValue('--stagger-delay')) || 0;
            pending = later(() => scrambleInTitle(title), delay);
          } else {
            hideSplitTitle(title);
          }
        };

        const sectionObserver = new MutationObserver(sync);
        sectionObserver.observe(section, { attributes: true, attributeFilter: ['class'] });
        sectionObservers.push(sectionObserver);
        // onepage.js sets the first active section (and the stagger delays)
        // in its own preloader-hidden callback; check after it has run.
        requestAnimationFrame(sync);
      });
    });

    return () => {
      unsubscribe();
      observer.disconnect();
      sectionObservers.forEach((o) => o.disconnect());
      timers.forEach(clearTimeout);
      titles.forEach((title) => title._cyrilScrambleCancel?.());
    };
  }, []);

  // Background circle parallax. Desktop only — the circles are hidden at
  // 1200px and below anyway. Uses `translate` so each circle's inline
  // rotate transform is left alone.
  useEffect(() => {
    if (prefersReducedMotion() || window.innerWidth <= 1200) return;

    const circles = Array.from(document.querySelectorAll('.cyril-bg-item')).map((el) => {
      const size = el.classList.contains('cyril-bg-item-large') ? 'large' : 'small';
      return {
        el,
        anchor: el.closest('.cyril-section') || el.parentElement,
        scroll: BG_SCROLL_FACTOR[size],
        mouse: BG_MOUSE_PX[size],
        x: 0,
        y: 0,
      };
    });
    if (!circles.length) return;

    const useMouse = hasFinePointer();
    let nx = 0;
    let ny = 0;
    let rafId = null;

    const tick = () => {
      let moving = false;
      circles.forEach((c) => {
        const top = c.anchor.getBoundingClientRect().top;
        const tx = nx * c.mouse;
        const ty = top * c.scroll + ny * c.mouse;
        c.x += (tx - c.x) * 0.12;
        c.y += (ty - c.y) * 0.12;
        if (Math.abs(tx - c.x) > 0.05 || Math.abs(ty - c.y) > 0.05) moving = true;
        c.el.style.translate = `${c.x.toFixed(2)}px ${c.y.toFixed(2)}px`;
      });
      rafId = moving ? requestAnimationFrame(tick) : null;
    };

    const start = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      nx = e.clientX / window.innerWidth - 0.5;
      ny = e.clientY / window.innerHeight - 0.5;
      start();
    };

    window.addEventListener('scroll', start, { passive: true });
    window.addEventListener('resize', start);
    if (useMouse) window.addEventListener('pointermove', onMove, { passive: true });
    start();

    return () => {
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', start);
      window.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
      circles.forEach((c) => { c.el.style.translate = ''; });
    };
  }, []);

  // Pointer effects.
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const root = document.documentElement;
    const dot = dotRef.current;
    const ring = ringRef.current;
    root.classList.add('cyril-has-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let magneticEl = null;
    let tiltEl = null;
    let rafId = null;

    const parallax = PARALLAX_LAYERS.map(([selector, depth]) => ({
      el: document.querySelector(`#intro ${selector}`),
      depth,
      x: 0,
      y: 0,
    })).filter((layer) => layer.el);

    const heroShown = () => {
      const hero = document.getElementById('intro');
      return !!hero && !hero.classList.contains('cyril-hero-exit');
    };

    // Ring trails the dot; parallax layers ease toward the pointer. The loop
    // stops itself once everything has settled and restarts on movement.
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      let moving = Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1;

      if (parallax.length) {
        const active = heroShown();
        const nx = active ? mouseX / window.innerWidth - 0.5 : 0;
        const ny = active ? mouseY / window.innerHeight - 0.5 : 0;
        parallax.forEach((layer) => {
          const tx = nx * layer.depth * 2;
          const ty = ny * layer.depth * 2;
          layer.x += (tx - layer.x) * 0.08;
          layer.y += (ty - layer.y) * 0.08;
          layer.el.style.translate = `${layer.x.toFixed(2)}px ${layer.y.toFixed(2)}px`;
          if (Math.abs(tx - layer.x) > 0.05 || Math.abs(ty - layer.y) > 0.05) moving = true;
        });
      }

      rafId = moving ? requestAnimationFrame(tick) : null;
    };

    const startLoop = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const releaseMagnetic = () => {
      if (magneticEl) magneticEl.style.translate = '';
      magneticEl = null;
    };

    const releaseTilt = () => {
      if (!tiltEl) return;
      tiltEl.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      tiltEl.style.transform = '';
      tiltEl = null;
    };

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      root.classList.add('cyril-cursor-visible');
      startLoop();

      const target = e.target instanceof Element ? e.target : null;

      // Cursor state
      const card = target?.closest('.cyril-portfolio-item');
      const link = target?.closest(CLICKABLE_SELECTOR);
      ring.classList.toggle('cyril-cursor-view', !!card);
      ring.classList.toggle('cyril-cursor-link', !card && !!link);

      // Magnetic pull
      const magnetic = findMagnetic(target);
      if (magnetic !== magneticEl) releaseMagnetic();
      if (magnetic) {
        prepMagnetic(magnetic);
        magneticEl = magnetic;
        const rect = magnetic.getBoundingClientRect();
        const clamp = (v) => Math.max(-MAGNETIC_MAX_PX, Math.min(MAGNETIC_MAX_PX, v));
        const dx = clamp((mouseX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH);
        const dy = clamp((mouseY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH);
        magnetic.style.translate = `${dx}px ${dy}px`;
      }

      // Portfolio card tilt (on the cover, not the item, which the scroll
      // reveal animates with its own transform)
      const cover = card?.querySelector('.cyril-cover') || null;
      if (cover !== tiltEl) releaseTilt();
      if (cover) {
        tiltEl = cover;
        const rect = cover.getBoundingClientRect();
        const px = (mouseX - rect.left) / rect.width - 0.5;
        const py = (mouseY - rect.top) / rect.height - 0.5;
        cover.style.transition = 'transform 0.15s ease-out';
        cover.style.transform = `perspective(900px) rotateX(${(-py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(px * TILT_MAX_DEG).toFixed(2)}deg)`;
      }
    };

    const onDown = () => ring.classList.add('cyril-cursor-down');
    const onUp = () => ring.classList.remove('cyril-cursor-down');
    const onLeave = (e) => {
      if (e.relatedTarget) return;
      root.classList.remove('cyril-cursor-visible');
      releaseMagnetic();
      releaseTilt();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerout', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerout', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
      releaseMagnetic();
      releaseTilt();
      parallax.forEach((layer) => { layer.el.style.translate = ''; });
      root.classList.remove('cyril-has-cursor', 'cyril-cursor-visible');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cyril-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cyril-cursor-ring" aria-hidden="true">
        <div className="cyril-cursor-ring-inner" />
        <span className="cyril-cursor-label">View</span>
      </div>
    </>
  );
};

export default MotionEffects;
