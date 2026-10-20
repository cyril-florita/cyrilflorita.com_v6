"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { afterPreloader } from "./afterPreloader";

// Page-wide scroll motion for Viteo (mounted once in the layout, re-run per
// route). Two things, all off under reduced motion (scrolling itself stays
// native: a JS-driven "weighted wheel" was tried and made scrolling laggy,
// since it moves scrolling onto the main thread):
//
// 1. Giant section words (.dl-bigword) drift slower than the page, a gentle
//    parallax (desktop).
// 2. Charts draw themselves in: .dl-chart-line paths (pathLength="1") are
//    hidden only once this runs (.dl.has-draw), then drawn when their chart
//    scrolls into view (.is-drawn).

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (reduced()) return;
    const root = document.querySelector(".dl");
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;
    const cleanups = [];

    // ---- 2. charts draw in ----
    root?.classList.add("has-draw");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        // Only once the preloader has completely faded, so the draw-in plays in view.
        cleanups.push(afterPreloader(() => e.target.classList.add("is-drawn")));
      }),
      { threshold: 0.35 },
    );
    document.querySelectorAll(".dl .dl-chart").forEach((c) => io.observe(c));
    cleanups.push(() => io.disconnect());

    if (!desktop) return () => cleanups.forEach((f) => f());

    // ---- 1. giant words drift ----
    const words = [...document.querySelectorAll(".dl .dl-bigword")];
    let wFrame = 0;
    const drift = () => {
      wFrame = 0;
      const vh = window.innerHeight;
      words.forEach((w) => {
        const r = w.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const off = (r.top + r.height / 2 - vh / 2) * 0.14; // lags the page a little
        w.style.translate = `0 ${off.toFixed(1)}px`;
      });
    };
    const onScrollWords = () => { if (!wFrame) wFrame = requestAnimationFrame(drift); };
    if (words.length) {
      drift();
      window.addEventListener("scroll", onScrollWords, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScrollWords);
        cancelAnimationFrame(wFrame);
        words.forEach((w) => (w.style.translate = ""));
      });
    }

    return () => cleanups.forEach((f) => f());
  }, [pathname]);

  return null;
}
