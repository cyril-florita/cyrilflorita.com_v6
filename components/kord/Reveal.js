"use client";

import { useEffect } from "react";

// Text and blocks come in as they scroll into view (after Viteo's and Hearthside's reveals): headings
// made of <Words> rise word by word out of their masks; labels, ledes, cards, steps and the like fade
// up 18px, staggered among siblings. Only pieces that start below the first screen are hidden (so
// nothing on screen at load flashes), only once the script runs (no-JS shows everything), never under
// reduced motion or on the design-system page. Classes come off once a piece has settled, so its own
// hover transitions are back. The hero and the app pages' titles have their own entrance (kord.css).
const HEADS = ".cd-section .cd-h2:has(> .cd-w), .cd-band-title:has(> .cd-w)";
const BLOCKS = [
  ".cd-section-head > p", ".cd-card", ".cd-step", ".cd-find-row > div > p", ".cd-find-row > div > .cd-btn",
  ".cd-band-row > .cd-btn", ".cd-cmp-size", ".cd-cmp-cards", ".cd-cmp-draw", ".cd-diff", ".cd-guar-card", ".cd-guar-more", ".cd-fit-form", ".cd-fit-out", ".cd-footer-top", ".cd-credit", ".cd-footer-links", ".cd-legal",
].join(", ");

export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.querySelector(".cd-ds")) return;
    const vh = innerHeight;
    const pick = (sel) => [...document.querySelectorAll(sel)].filter((el) => el.getBoundingClientRect().top > vh && !el.closest(".cd-story, .cd-ds"));
    const heads = pick(HEADS), blocks = pick(BLOCKS);
    // stagger siblings: 80ms apart, at most 5 steps
    const seen = new Map();
    for (const el of blocks) {
      const n = seen.get(el.parentNode) ?? 0; seen.set(el.parentNode, n + 1);
      el.style.setProperty("--rv-d", `${Math.min(n, 5) * 80}ms`);
    }
    const all = [...heads, ...blocks];
    all.forEach((el) => el.classList.add("cd-rv"));
    const settle = (el) => setTimeout(() => { el.classList.remove("cd-rv", "is-in"); el.style.removeProperty("--rv-d"); }, 1600);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target); e.target.classList.add("is-in"); settle(e.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    all.forEach((el) => io.observe(el));
    return () => { io.disconnect(); all.forEach((el) => el.classList.remove("cd-rv", "is-in")); };
  }, []);
  return null;
}
