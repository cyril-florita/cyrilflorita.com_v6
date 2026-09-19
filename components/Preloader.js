"use client";
import { useEffect, useState } from "react";

// Shown immediately (it's part of the static HTML, so it's visible before
// any JS runs) and hidden once the page has actually finished loading.
// MIN_DISPLAY_MS is there so our own fade-out transition starts only after
// body's separate 1s opacity fade-in (see _common.scss) has settled —
// starting it earlier would visually compound with that animation instead
// of transitioning cleanly.
const MIN_DISPLAY_MS = 1300;
const FALLBACK_MS = 4000;

// Project (Work) pages are reached via next/link (a client-side transition,
// not a full document reload — see PortfolioIsotope.js), so there's no
// window 'load' event to hang a second appearance off of. Callers dispatch
// this event (see showPreloader() below) right as the link is clicked, and
// the effect below re-shows/re-hides using the same timing as the initial
// load.
const SHOW_EVENT = 'cyril:preloader-show';
const HIDDEN_EVENT = 'cyril:preloader-hidden';

// Module-level (not React state) so onPreloaderHidden below can check the
// current status synchronously from outside the component.
const preloaderState = { hidden: false };

export const showPreloader = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHOW_EVENT));
  }
};

// Runs `callback` once the preloader has actually finished hiding —
// immediately if it already has, otherwise the next time it does. Lets a
// page's own reveal animation (e.g. its top banner fading in) wait for the
// preloader instead of running on its own fixed timer and racing it,
// covering both a fresh page load and a client-side transition into a
// project page. Returns an unsubscribe function.
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

const markHidden = () => {
  preloaderState.hidden = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(HIDDEN_EVENT));
  }
};

const Preloader = () => {
  const [hidden, setHidden] = useState(false);

  // Initial page load.
  useEffect(() => {
    let hideTimer;
    let fallbackTimer;

    const hide = () => {
      setHidden(true);
      markHidden();
      clearTimeout(fallbackTimer);
    };

    const scheduleHide = () => {
      hideTimer = window.setTimeout(hide, MIN_DISPLAY_MS);
    };

    if (document.readyState === 'complete') {
      scheduleHide();
    } else {
      window.addEventListener('load', scheduleHide, { once: true });
    }

    // In case 'load' never fires for some reason, don't block the page forever.
    fallbackTimer = window.setTimeout(hide, FALLBACK_MS);

    return () => {
      window.removeEventListener('load', scheduleHide);
      clearTimeout(hideTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Later, client-side transitions into a Work/project page.
  useEffect(() => {
    let hideTimer;

    const onShow = () => {
      clearTimeout(hideTimer);
      preloaderState.hidden = false;
      setHidden(false);
      hideTimer = window.setTimeout(() => {
        setHidden(true);
        markHidden();
      }, MIN_DISPLAY_MS);
    };

    window.addEventListener(SHOW_EVENT, onShow);
    return () => {
      window.removeEventListener(SHOW_EVENT, onShow);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      id="cyril-preloader"
      className={`cyril-preloader${hidden ? ' cyril-preloader-hidden' : ''}`}
      aria-hidden="true"
    >
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
