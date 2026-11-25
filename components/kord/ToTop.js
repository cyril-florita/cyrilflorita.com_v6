"use client";

import { useEffect, useRef, useState } from "react";

// Back to top (2026-11-24, the user's call): a round button at the bottom right, shown once the page is
// a screen down; smooth scroll (instant under reduced motion) and focus to #main. On the builder it
// rides on top of the price summary (--cd-totop-lift), pinned or rising with the footer.
export default function ToTop() {
  const [on, setOn] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const sum = document.querySelector(".cd-build-sum");
    // The lift follows the summary's top, not its height: at the end of the page the summary stops
    // sticking and rises with the footer, and a fixed lift left the button over its price.
    // Returns false when riding on the summary would push the button up under the header.
    const lift = () => {
      if (!sum || !ref.current) return true;
      const rise = Math.max(0, window.innerHeight - sum.getBoundingClientRect().top) + 16;
      ref.current.style.setProperty("--cd-totop-lift", `${rise}px`);
      return rise < window.innerHeight - 150;
    };
    const check = () => { const fits = lift(); setOn(window.scrollY > window.innerHeight && fits); };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const ro = sum ? new ResizeObserver(check) : null;
    ro?.observe(sum);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); ro?.disconnect(); };
  }, []);
  const up = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    const main = document.getElementById("main");
    if (main) { if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  };
  return (
    <button ref={ref} type="button" className={`cd-totop${on ? " is-on" : ""}`} onClick={up} aria-label="Back to top"
      tabIndex={on ? undefined : -1} aria-hidden={on ? undefined : true}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
