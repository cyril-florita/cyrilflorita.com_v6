"use client";
import { useEffect } from "react";

// Landing hero: as the pointer moves over the hero panel, the product shot
// (box + pills) moves in depth around the box (the scale-up on CTA hover is
// pure CSS, in viteo.css). Writes --px/--py (-1…1) on .dl-product, driven by
// a spring toward the pointer, so it overshoots a touch and settles; viteo.css
// (and ProductStory.js, in 3D) turn them into movement: big (near) pills
// travel with the pointer, small (far) ones against it, and the box, the
// pivot, turns well toward it. Desktop with a mouse only, never under reduced
// motion. Renders nothing.
//
// The desk-lamp light (--lx/--ly on the hero) also reaches over the hero's
// tab, which sits outside the hero's box: the tab gets the same light centre
// in its own pixels (--tlx/--tly), kept in step everywhere (also at rest and
// on touch, where the light just sits at its resting spot).
const LAMP = { x: 0.7, y: 0.38 }; // resting spot, as in viteo.css
const lightTab = (hero, fx, fy) => {
  const tab = hero.querySelector(".dl-bento-tab");
  if (!tab || !tab.offsetWidth) return;
  const h = hero.getBoundingClientRect(), t = tab.getBoundingClientRect();
  tab.style.setProperty("--tlx", `${(h.left + fx * h.width - t.left).toFixed(1)}px`);
  tab.style.setProperty("--tly", `${(h.top + fy * h.height - t.top).toFixed(1)}px`);
};

export default function HeroParallax() {
  // Resting light on the tab, re-placed when the hero resizes.
  useEffect(() => {
    const hero = document.querySelector(".dl-bento-hero");
    if (!hero) return;
    const place = () => { if (!hero.style.getPropertyValue("--lx")) lightTab(hero, LAMP.x, LAMP.y); };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)");
    if (!ok.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.querySelector(".dl-bento-hero");
    const product = hero?.querySelector(".dl-product");
    if (!hero || !product) return;

    // Spring: stiffness K and per-frame velocity damping D (60fps frames),
    // a little under critical damping, so it overshoots ~15% and settles.
    const K = 0.035, D = 0.8;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, frame = 0, prev = 0;
    const tick = (now) => {
      const f = prev ? Math.min((now - prev) / 16.67, 3) : 1;
      prev = now;
      vx = (vx + (tx - x) * K * f) * D ** f;
      vy = (vy + (ty - y) * K * f) * D ** f;
      x += vx * f;
      y += vy * f;
      product.style.setProperty("--px", x.toFixed(4));
      product.style.setProperty("--py", y.toFixed(4));
      // The "desk lamp": the hero's light follows the pointer (viteo.css).
      hero.style.setProperty("--lx", `${(50 + x * 50).toFixed(1)}%`);
      hero.style.setProperty("--ly", `${(50 + y * 50).toFixed(1)}%`);
      lightTab(hero, 0.5 + x * 0.5, 0.5 + y * 0.5);
      const moving = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 || Math.abs(vx) > 0.0005 || Math.abs(vy) > 0.0005;
      frame = moving ? requestAnimationFrame(tick) : 0;
      if (!frame) prev = 0;
    };
    const run = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      run();
    };
    const onLeave = () => { tx = 0; ty = 0; run(); };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return null;
}
