"use client";
import { useEffect } from "react";

// Landing hero: as the pointer moves over the hero panel, the product shot
// (box + pills) follows it in depth (the scale-up on CTA hover is pure CSS,
// in viteo.css). Writes --px/--py
// (-1…1, eased toward the pointer each frame) on .dl-product; viteo.css turns
// them into movement: bigger pills sit nearer and travel further, the box
// travels less and turns toward the pointer. Desktop with a mouse only, never
// under reduced motion. Renders nothing.
export default function HeroParallax() {
  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)");
    if (!ok.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.querySelector(".dl-bento-hero");
    const product = hero?.querySelector(".dl-product");
    if (!hero || !product) return;

    let tx = 0, ty = 0, x = 0, y = 0, frame = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      product.style.setProperty("--px", x.toFixed(4));
      product.style.setProperty("--py", y.toFixed(4));
      frame = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
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
