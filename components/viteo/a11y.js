"use client";
import { useEffect, useRef } from "react";

// Small accessibility helpers shared across Viteo (re-exported from ui.js;
// InstallApp imports them from here, since ui.js imports InstallApp).

// Radio groups drawn as buttons (role="radio" inside role="radiogroup"), per
// the ARIA radio pattern: one tab stop, the checked option (or the first when
// none is), and arrow keys move to the previous / next option and select it
// (Home / End: first / last). Put `onKeyDown={onRadioKeyDown}` on the group and
// `tabIndex={radioTabIndex(on, i, anyOn)}` on each option. `select(el)` picks
// the option (default: el.click()); a group whose click also does more (the
// questions advance on a click) passes its own.
const STEP = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
export const onRadioKeyDown = (e, select = (el) => el.click()) => {
  const key = e.key;
  if (!(key in STEP) && key !== "Home" && key !== "End") return;
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const radios = [...e.currentTarget.querySelectorAll('[role="radio"]')].filter(
    (r) => !r.disabled && r.getAttribute("aria-disabled") !== "true",
  );
  if (!radios.length) return;
  let i = radios.indexOf(document.activeElement);
  if (i < 0) i = Math.max(0, radios.findIndex((r) => r.getAttribute("aria-checked") === "true"));
  const next =
    key === "Home" ? 0 : key === "End" ? radios.length - 1 : (i + STEP[key] + radios.length) % radios.length;
  e.preventDefault();
  const el = radios[next];
  el.focus();
  if (el.getAttribute("aria-checked") !== "true") select(el);
};
export const radioTabIndex = (on, i, anyOn) => (on || (!anyOn && i === 0) ? 0 : -1);

// Closing a <dialog> by clicking its backdrop: only when the press also
// started on the backdrop, so selecting text in a field and letting go
// outside the dialog doesn't close it. Spread the result onto the <dialog>.
export const useBackdropClose = (close) => {
  const down = useRef(false);
  return {
    onPointerDown: (e) => { down.current = e.target === e.currentTarget; },
    onClick: (e) => {
      const fromBackdrop = down.current;
      down.current = false;
      if (fromBackdrop && e.target === e.currentTarget) close();
    },
  };
};

// A ref that is true while the component is mounted: async flows (waits,
// timers) check it before navigating, writing or setting state.
export const useMounted = () => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  return mounted;
};

// An always-mounted, visually hidden live region: put it on the page once and
// change its text, so screen readers announce the change (a region inserted
// together with its text often isn't read).
export const SrStatus = ({ children }) => (
  <p className="dl-sr" role="status" aria-live="polite">{children}</p>
);

// After a menu closes from a link to this same page (a section's #hash, or
// the page itself), focus would be left on the now-hidden menu: move it to
// the section (or <main>), without scrolling — the link does the scrolling.
// Links to other pages are left to the navigation. `path` is the current
// path without its trailing slash.
export const focusAfterMenuLink = (href, path) => {
  const [to, hash] = href.split("#");
  if (to.replace(/\/$/, "") !== path) return;
  requestAnimationFrame(() => {
    const el = document.getElementById(hash || "main");
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true, focusVisible: false });
  });
};
