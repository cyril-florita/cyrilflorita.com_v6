"use client";

import { useEffect } from "react";

// Smooth scrolling for the ad. Anchor jumps ("See the offer") glide via CSS
// scroll-behavior (mustang.css). Mouse wheels glide too: each notch eases to
// its target with a little weight instead of jumping. Trackpads keep their
// native momentum, and nothing changes under reduced motion or on touch.
// After the portfolio's wheel glide (layout/MotionEffects.js).
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let target = window.scrollY, current = window.scrollY, raf = 0;
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const step = () => {
      if (Math.abs(window.scrollY - Math.round(current)) > 2) { raf = 0; return; }   // someone else moved the page
      current += (target - current) * 0.09;
      if (Math.abs(target - current) < 0.5) { current = target; raf = 0; } else raf = requestAnimationFrame(step);
      window.scrollTo({ top: current, behavior: "instant" });
    };
    const onWheel = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.deltaX) return;
      const byLine = e.deltaMode === 1;
      if (!byLine && Math.abs(e.deltaY) < 50) return;                                // a trackpad: leave it native
      e.preventDefault();
      if (!raf) { current = window.scrollY; target = current; }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = Math.max(0, Math.min(max, target + (byLine ? e.deltaY * 40 : e.deltaY) * 1.1));
      if (!raf) raf = requestAnimationFrame(step);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", stop);
    return () => { stop(); window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", stop); };
  }, []);
  return null;
}
