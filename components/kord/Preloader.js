"use client";

import { useEffect, useRef } from "react";
import InlineScript from "@/components/InlineScript";
import { WORDMARK } from "@/components/kord/wordmark";

// The landing's opening (after Mustang's): Kord's mark, large and centered, its chartreuse arc turning
// like a pedal stroke, the stretched KORD rising out of a mask, and a thin bar filling while the 3D bike
// loads. When the story's `data-state` leaves `loading` (ready or fallback) and the fonts are in, the
// bar fills, the lockup lifts, the cover fades, `kd:pre-done` fires (BikeStory turns the bike in) and
// the hero's entrance, held while the cover is up (kord.css), plays. The 3D gets GRACE ms; past that the
// cover lifts as soon as the fonts and the bike's still (.cd-poster) are in, and the 3D crossfades in
// over the still when it's ready (2026-11-25: on a throttled phone the cover held the page for the 3D,
// and Lighthouse's speed index read 5.8s). At least 1.2s so it reads, at most 8s; a CSS timer lifts it
// after 9s without JS. Skipped (before first paint, by the inline script) on
// links into a section (a hash, e.g. a shared Find your bike result) and under reduced motion.
const MIN = 1200, GRACE = 2200, MAX = 8000;
const SKIP = `if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("cd-pre-skip")`;

export default function Preloader() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const done = (fast) => {
      el.classList.add("is-done"); window.__kdPreDone = true;
      window.dispatchEvent(new Event("kd:pre-done"));
      return setTimeout(() => el.classList.add("is-gone"), fast ? 0 : 800);
    };
    if (document.documentElement.classList.contains("cd-pre-skip")) { const t = done(true); return () => clearTimeout(t); }

    const story = document.querySelector(".cd-story");
    const start = performance.now();
    let finished = false, raf = 0, t1 = 0, t2 = 0, t3 = 0, cap = 0, mo = null, p = 0, floor = 0;
    const poster = story?.querySelector(".cd-poster");
    const posterIn = !poster || poster.complete ? Promise.resolve()
      : new Promise((r) => { poster.addEventListener("load", r, { once: true }); poster.addEventListener("error", r, { once: true }); });
    // the page holds still under the cover but keeps its scrollbar (as on Mustang, Viteo and Hearthside)
    const y0 = window.scrollY;
    const KEYS = new Set([" ", "PageDown", "PageUp", "End", "Home", "ArrowDown", "ArrowUp"]);
    const stop = (e) => { if (e.type !== "keydown" || KEYS.has(e.key)) e.preventDefault(); };
    const hold = () => { if (window.scrollY !== y0) window.scrollTo({ top: y0, behavior: "instant" }); };
    const opts = { passive: false };
    window.addEventListener("wheel", stop, opts); window.addEventListener("touchmove", stop, opts);
    window.addEventListener("keydown", stop); window.addEventListener("scroll", hold);
    const release = () => {
      window.removeEventListener("wheel", stop, opts); window.removeEventListener("touchmove", stop, opts);
      window.removeEventListener("keydown", stop); window.removeEventListener("scroll", hold);
    };
    // the bar: creeps toward 90% while loading (fonts in: at least 30%), fills on ready
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      p = Math.max(floor, 0.9 * (1 - Math.exp(-t / 1.6)));
      el.style.setProperty("--p", p.toFixed(3));
      if (!finished) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.fonts?.ready.then(() => { floor = Math.max(floor, 0.3); });
    const finish = () => {
      if (finished) return; finished = true;
      mo?.disconnect(); clearTimeout(cap); cancelAnimationFrame(raf);
      el.style.setProperty("--p", "1");
      t1 = setTimeout(() => { release(); t2 = done(false); }, Math.max(350, MIN - (performance.now() - start)));
    };
    const isReady = () => story && story.dataset.state && story.dataset.state !== "loading";
    const check = () => { if (isReady()) (document.fonts?.ready ?? Promise.resolve()).then(finish); };
    if (story) { mo = new MutationObserver(check); mo.observe(story, { attributes: true, attributeFilter: ["data-state"] }); }
    check();
    t3 = setTimeout(() => Promise.all([document.fonts?.ready, posterIn]).then(finish), GRACE);   // the 3D is slow: go with the still
    cap = setTimeout(finish, MAX);
    return () => { release(); mo?.disconnect(); cancelAnimationFrame(raf); [t1, t2, t3, cap].forEach(clearTimeout); };
  }, []);

  return (
    <>
      <InlineScript html={SKIP} />
      <div className="cd-pre" ref={ref} aria-hidden="true">
        <div className="cd-pre-lockup">
          <svg className="cd-pre-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.28" />
            <path className="cd-pre-arc" d="M16 3.5 A12.5 12.5 0 1 1 3.5 16" fill="none" stroke="var(--cd-accent)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="16" cy="16" r="3.2" fill="currentColor" />
          </svg>
          <span className="cd-pre-row">
            <svg className="cd-pre-word" viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true" focusable="false"><path d={WORDMARK.d} fill="currentColor" /></svg>
            <span className="cd-reg">®</span>
          </span>
          <i className="cd-pre-bar"><b /></i>
        </div>
      </div>
    </>
  );
}
