"use client";
import { useEffect, useRef } from "react";
import { scrambleText } from "@/public/utility/index";

// The preloader doubles as the page-transition panel:
// - First paint: it's part of the static HTML, so it already covers the page
//   before any JS runs, and slides up and away once the page has loaded.
// - Navigating: wipeThen(go) slides it up from the bottom to cover the
//   current page, calls go() (a hard navigation or a client-side route
//   change), and — for client-side changes, where this component stays
//   mounted — slides it away again once the new page is in. Hard navigations
//   land on a new document whose preloader is already covering, so the two
//   read as one continuous wipe.
// Modifier classes are toggled on the element directly (not via React state)
// so the "start below the screen, then slide in" step can force a reflow in
// between. Styles: .cyril-preloader in _components.scss.
const MIN_DISPLAY_MS = 900; // first load: keep the mark up at least this long
const FALLBACK_MS = 4000; // don't block the page forever if 'load' never fires
const WIPE_MS = 650; // must match the slide duration in the CSS
const CLIENT_HOLD_MS = 350; // after a client-side route change, before revealing

const WIPE_EVENT = 'cyril:preloader-wipe';
const HIDDEN_EVENT = 'cyril:preloader-hidden';

// Module-level (not React state) so onPreloaderHidden below can check the
// current status synchronously from outside the component.
const preloaderState = { hidden: false };

// Cover the page with the panel, then run `go` (e.g. change the URL).
export const wipeThen = (go) => {
  if (typeof window === 'undefined') return;
  if (!document.getElementById('cyril-preloader')) {
    go();
    return;
  }
  window.dispatchEvent(new CustomEvent(WIPE_EVENT, { detail: { go } }));
};

// Runs `callback` once the preloader has actually finished hiding —
// immediately if it already has, otherwise the next time it does. Lets a
// page's own entrance animations wait for the reveal instead of racing it,
// on a fresh load and after a client-side transition alike. Returns an
// unsubscribe function.
export const onPreloaderHidden = (callback) => {
  if (typeof window === 'undefined') return () => {};

  if (preloaderState.hidden) {
    callback();
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(HIDDEN_EVENT, handler, { once: true });
  return () => window.removeEventListener(HIDDEN_EVENT, handler);
};

const Preloader = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let timers = [];
    const later = (fn, ms) => timers.push(window.setTimeout(fn, ms));
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    // "Cyril" scrambles through random letters, like the subheaders, and
    // keeps re-scrambling for as long as the panel is showing (first load
    // and every wipe). Each pass settles back to "Cyril" before the next, so
    // stopping never leaves it garbled. Not under reduced motion.
    const mark = el.querySelector('.cyril-preloader-mark strong');
    const SCRAMBLE_MS = 700;
    const SCRAMBLE_EVERY_MS = 1000; // one pass + a beat on the real word
    let scrambleTimer = null;
    const stopMark = () => { clearInterval(scrambleTimer); scrambleTimer = null; };
    const scrambleMark = () => {
      if (!mark || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stopMark();
      scrambleText(mark, SCRAMBLE_MS);
      scrambleTimer = setInterval(() => scrambleText(mark, SCRAMBLE_MS), SCRAMBLE_EVERY_MS);
    };

    const hide = () => {
      clearTimers();
      stopMark();
      el.classList.add('cyril-preloader-hidden');
      preloaderState.hidden = true;
      window.dispatchEvent(new CustomEvent(HIDDEN_EVENT));
    };

    // First load.
    scrambleMark();
    const scheduleHide = () => later(hide, MIN_DISPLAY_MS);
    if (document.readyState === 'complete') scheduleHide();
    else window.addEventListener('load', scheduleHide, { once: true });
    later(hide, FALLBACK_MS);

    // Transitions out of this page.
    const onWipe = (e) => {
      clearTimers();
      preloaderState.hidden = false;
      // Jump below the screen with no transition, then slide up to cover.
      el.classList.remove('cyril-preloader-hidden');
      el.classList.add('cyril-preloader-below');
      void el.offsetHeight;
      el.classList.remove('cyril-preloader-below');
      scrambleMark();
      later(() => {
        e.detail.go();
        // Client-side route changes keep this component mounted; reveal the
        // new page once it's had a moment to render. (Hard navigations never
        // get here — the page is gone.)
        later(hide, CLIENT_HOLD_MS);
      }, WIPE_MS);
    };

    // Coming back via the browser's back/forward cache restores the page as
    // it was left — covered. Reveal it.
    const onPageShow = (e) => {
      if (e.persisted) hide();
    };

    window.addEventListener(WIPE_EVENT, onWipe);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      clearTimers();
      stopMark();
      window.removeEventListener('load', scheduleHide);
      window.removeEventListener(WIPE_EVENT, onWipe);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  return (
    <div ref={ref} id="cyril-preloader" className="cyril-preloader" aria-hidden="true">
      <div className="cyril-preloader-mark">
        <strong>C<span>yril</span></strong>
      </div>
      <div className="cyril-preloader-bar">
        <span />
      </div>
    </div>
  );
};

export default Preloader;
