"use client";

import { useEffect } from "react";

// The header slides up out of view while the page scrolls down and comes back on any scroll up
// (2026-11-24, the user's call; as Hearthside's and the design systems' top bars): an 8px jitter
// threshold, always shown within 96px of the top and while keyboard focus is inside it (`:focus-visible`;
// plain focus kept it out after the phone menu closed, which hands focus back to the menu button). The class only
// (`.is-hidden` on `.cd-header`); kord.css does the movement, instant under reduced motion.
export default function HeaderScroll() {
  useEffect(() => {
    const bar = document.querySelector(".cd-header");
    if (!bar) return;
    const TOP = 96, STEP = 8;
    let last = Math.max(0, window.scrollY), raf = 0;
    const check = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      if (y < TOP || keyFocus()) { bar.classList.remove("is-hidden"); last = y; return; }
      const d = y - last;
      if (Math.abs(d) < STEP) return;
      bar.classList.toggle("is-hidden", d > 0);
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    const keyFocus = () => bar.querySelector(":focus-visible");
    const onFocus = () => { if (keyFocus()) bar.classList.remove("is-hidden"); };
    window.addEventListener("scroll", onScroll, { passive: true });
    bar.addEventListener("focusin", onFocus);
    return () => { window.removeEventListener("scroll", onScroll); bar.removeEventListener("focusin", onFocus); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
