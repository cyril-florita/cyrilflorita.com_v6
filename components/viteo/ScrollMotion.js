"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Page-wide scroll motion for Viteo (mounted once in the layout, re-run per
// route). Three things, all off under reduced motion:
//
// 1. Giant section words (.dl-bigword) drift slower than the page, a gentle
//    parallax (desktop).
// 2. Charts draw themselves in: .dl-chart-line paths (pathLength="1") are
//    hidden only once this runs (.dl.has-draw), then drawn when their chart
//    scrolls into view (.is-drawn).
// 3. Weighted mouse-wheel scrolling (desktop, mouse wheels only — trackpads,
//    which send many small fractional deltas, keep native scrolling): each
//    notch eases to its target. It steps aside for anything that handles the
//    wheel itself (defaultPrevented), open dialogs/menus, and pinch-zoom.

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
        e.target.classList.add("is-drawn");
        io.unobserve(e.target);
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

    // ---- 3. weighted wheel ----
    let target = window.scrollY, cur = window.scrollY, sFrame = 0, gliding = false;
    const max = () => document.documentElement.scrollHeight - window.innerHeight;
    const step = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.5) cur = target;
      window.scrollTo({ top: cur, behavior: "instant" });
      if (cur !== target) sFrame = requestAnimationFrame(step);
      else { sFrame = 0; gliding = false; }
    };
    const onWheel = (e) => {
      if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const mouse = e.deltaMode === 1 || (Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY));
      if (!mouse) return;
      if (document.querySelector("dialog[open], .dl-menu.is-open")) return;
      if (document.documentElement.style.overflow === "hidden") return;
      e.preventDefault();
      if (!gliding) { cur = window.scrollY; target = cur; }
      target = Math.max(0, Math.min(max(), target + e.deltaY * (e.deltaMode === 1 ? 40 : 1)));
      gliding = true;
      if (!sFrame) sFrame = requestAnimationFrame(step);
    };
    // Any other scroll (keys, scrollbar, anchors) resets the glide.
    const onScroll = () => { if (!gliding) { cur = target = window.scrollY; } };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(sFrame);
    });

    return () => cleanups.forEach((f) => f());
  }, [pathname]);

  return null;
}
