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
// The pull is based on where the pointer is *relative to the element's size*
// (centre = 0, edge = full pull), not on raw pixel distance — otherwise small
// targets like the "All" filter or icons could barely move, since the pointer
// can never get far from their centre.
const MAGNETIC_MAX_PX = 12;

// The custom cursor steps aside over:
// - square outlined icon buttons (they fill orange on hover — feedback enough)
// - the home hero photo, but only over its visible pixels: the transparent
//   areas of the PNG still show the cursor.
const ICON_BUTTON_SELECTOR = '.cyril-slider-nav .cyril-prev, .cyril-slider-nav .cyril-next, .cyril-back-to-top, .cyril-zoom-btn';
const MAIN_IMAGE_SELECTOR = '.cyril-banner-image';
const ALPHA_SAMPLE_WIDTH = 400; // px — resolution of the hit-test copy
const ALPHA_THRESHOLD = 24; // 0–255
// Hide a little *before* the pointer reaches the photo: any visible pixel
// within this many screen px of the pointer counts.
const HIDE_MARGIN_PX = 24;
// Probe offsets: the pointer itself plus two rings (full and half margin).
const PROBES = [[0, 0]];
for (let k = 0; k < 12; k++) {
  const a = (k / 12) * Math.PI * 2;
  PROBES.push([Math.cos(a), Math.sin(a)], [Math.cos(a) / 2, Math.sin(a) / 2]);
}

// Per image: a small copy of its alpha channel, read once (same-origin, so
// the canvas isn't tainted). Rebuilt if the displayed source changes.
const alphaMaps = new WeakMap();

const alphaMapFor = (img) => {
  let map = alphaMaps.get(img);
  if (map && map.src === img.currentSrc) return map;
  const scale = Math.min(1, ALPHA_SAMPLE_WIDTH / img.naturalWidth);
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  map = { src: img.currentSrc, w, h, data: null };
  try {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, w, h);
    map.data = ctx.getImageData(0, 0, w, h).data;
  } catch (e) {
    // Unreadable (shouldn't happen for same-origin) — treat as fully solid.
  }
  alphaMaps.set(img, map);
  return map;
};

// Is the pointer over — or within HIDE_MARGIN_PX of — a visible
// (non-transparent) pixel of this image? Honours object-fit/object-position
// and any transform (via the rect).
const isOverVisiblePixel = (img, x, y) => {
  if (!img.complete || !img.naturalWidth) return false;
  const map = alphaMapFor(img);
  if (!map.data) return true;
  const r = img.getBoundingClientRect();
  const cs = getComputedStyle(img);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  let cw = r.width;
  let ch = r.height;
  let ox = 0;
  let oy = 0;
  if (cs.objectFit === 'cover' || cs.objectFit === 'contain') {
    const s = cs.objectFit === 'cover' ? Math.max(r.width / nw, r.height / nh) : Math.min(r.width / nw, r.height / nh);
    cw = nw * s;
    ch = nh * s;
    const [px, py] = cs.objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    ox = (r.width - cw) * (Number.isNaN(px) ? 0.5 : px);
    oy = (r.height - ch) * (Number.isNaN(py) ? 0.5 : py);
  }
  return PROBES.some(([dx, dy]) => {
    const u = (x + dx * HIDE_MARGIN_PX - r.left - ox) / cw;
    const v = (y + dy * HIDE_MARGIN_PX - r.top - oy) / ch;
    if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
    const i = (Math.floor(v * map.h) * map.w + Math.floor(u * map.w)) * 4 + 3;
    return map.data[i] > ALPHA_THRESHOLD;
  });
};
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
const TITLE_SELECTOR = '#portfolio-start h2.glitch, .cyril-onepage .cyril-section h2.glitch, .cyril-case-title, .cyril-contact-title, .cyril-not-found-title';

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

  // Smooth mouse-wheel scrolling: each wheel notch glides to its target
  // instead of jumping. Mouse wheels only (trackpads already have native
  // momentum), desktop only, never with reduced motion. Stays out of the way
  // of everything that owns the wheel: the hero↔My Work hand-off in
  // app/page.js and the viewer (both preventDefault first — this listener is
  // registered after them, so it sees that), and About Me's snapping.
  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let rafId = null;

    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const step = () => {
      // Someone else moved the page (keys, scrollbar, "to top", a jump) —
      // let them have it.
      if (Math.abs(window.scrollY - Math.round(current)) > 2) {
        stop();
        return;
      }
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        rafId = null;
      } else {
        rafId = requestAnimationFrame(step);
      }
      // 'instant' — app/page.js sets scroll-behavior: smooth on <html>,
      // which would otherwise animate every frame of this glide.
      window.scrollTo({ top: current, behavior: 'instant' });
    };

    const onWheel = (e) => {
      if (e.defaultPrevented) {
        stop();
        return;
      }
      if (e.ctrlKey || e.deltaX || document.body.classList.contains('cyril-custom-scroll') ||
          document.querySelector('.cyril-zoom')) return;
      const byLine = e.deltaMode === 1;
      if (!byLine && Math.abs(e.deltaY) < 50) return; // trackpad — leave it native
      e.preventDefault();
      if (!rafId) {
        current = window.scrollY;
        target = current;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, target + (byLine ? e.deltaY * 40 : e.deltaY)));
      if (!rafId) rafId = requestAnimationFrame(step);
    };

    // Registered on the next tick so it runs after the page's own wheel
    // handlers (same target/phase → registration order).
    const timer = setTimeout(() => window.addEventListener('wheel', onWheel, { passive: false }), 0);
    window.addEventListener('keydown', stop);
    window.addEventListener('pointerdown', stop);
    return () => {
      clearTimeout(timer);
      stop();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('pointerdown', stop);
    };
  }, []);

  // Pause the background noise animation while the tab is hidden.
  useEffect(() => {
    const sync = () => document.documentElement.classList.toggle('cyril-tab-hidden', document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

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
      // Hide over icon buttons and the visible pixels of the hero photo.
      const mainImage = target?.closest(MAIN_IMAGE_SELECTOR);
      root.classList.toggle('cyril-cursor-hide',
        !!target?.closest(ICON_BUTTON_SELECTOR) || (!!mainImage && isOverVisiblePixel(mainImage, mouseX, mouseY)));

      // Magnetic pull
      const magnetic = findMagnetic(target);
      if (magnetic !== magneticEl) releaseMagnetic();
      if (magnetic) {
        prepMagnetic(magnetic);
        magneticEl = magnetic;
        // Measure against the link actually under the pointer (for filter
        // links the moving host is the taller <li>), at its resting position:
        // subtract the pull currently applied, or the element chasing the
        // pointer would keep shrinking its own pull and jitter.
        const hit = (link || magnetic).getBoundingClientRect();
        const [offX = 0, offY = 0] = (getComputedStyle(magnetic).translate || '')
          .split(' ').map((v) => parseFloat(v) || 0);
        const cx = hit.left - offX + hit.width / 2;
        const cy = hit.top - offY + hit.height / 2;
        const unit = (v) => Math.max(-1, Math.min(1, v));
        const dx = unit((mouseX - cx) / (hit.width / 2)) * MAGNETIC_MAX_PX;
        const dy = unit((mouseY - cy) / (hit.height / 2)) * MAGNETIC_MAX_PX;
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
      root.classList.remove('cyril-has-cursor', 'cyril-cursor-visible', 'cyril-cursor-hide');
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
