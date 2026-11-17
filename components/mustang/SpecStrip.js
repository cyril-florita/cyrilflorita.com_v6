"use client";

import { useEffect, useRef } from "react";

// The spec strip. On phones it scrolls sideways (mustang.css), and three cues
// say so: a fade at the right edge while more lies that way (data-more), a thin
// progress bar under it (--p, --vis), and a one-time nudge — the strip slides
// 56px and back the first time it's on screen (not under reduced motion).
export default function SpecStrip({ specs }) {
  const wrap = useRef(null), list = useRef(null);
  useEffect(() => {
    const el = list.current, box = wrap.current;
    if (!el || !box) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      box.dataset.scrolls = max > 2 ? "true" : "false";
      box.dataset.more = el.scrollLeft < max - 2 ? "true" : "false";
      box.style.setProperty("--vis", String(el.clientWidth / el.scrollWidth));
      box.style.setProperty("--p", String(max > 0 ? el.scrollLeft / max : 0));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update); ro.observe(el);
    let io = null;
    const born = performance.now();                               // the page's entrance finishes ~2s in
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting || el.scrollWidth <= el.clientWidth + 2) return;
        io.disconnect(); io = null;
        setTimeout(() => {
          if (el.scrollLeft > 2) return;                           // already being scrolled
          el.style.scrollSnapType = "none";                         // snapping would pull the nudge straight back
          el.scrollTo({ left: 56, behavior: "smooth" });
          setTimeout(() => el.scrollTo({ left: 0, behavior: "smooth" }), 600);
          setTimeout(() => { el.style.scrollSnapType = ""; }, 1300);
        }, Math.max(500, 2200 - (performance.now() - born)));
      }, { threshold: 0.8 });
      io.observe(el);
    }
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); io?.disconnect(); };
  }, []);
  return (
    <section className="ms-specs" aria-label="At a glance" ref={wrap}>
      <dl ref={list} tabIndex={0} aria-label="Specs">
        {specs.map((s) => (
          <div key={s.label}>
            <dt><span className="ms-spec-long">{s.label}</span><span className="ms-spec-short" aria-hidden="true">{s.short}</span></dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
      <span className="ms-specs-progress" aria-hidden="true" />
    </section>
  );
}
