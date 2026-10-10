"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll reveal: fade + small rise. Pieces below the fold start transparent
// and 20px low, and settle into place the first time their top passes 85%
// down the screen; giant section words take longest, headings follow a beat later,
// siblings stagger. (A scroll check, not IntersectionObserver, which skips
// zero-opacity/clipped targets in some cases.) Nothing is hidden until this
// runs (so content stays visible without JS), anything already on screen is
// left alone, and reduced motion skips it entirely. Styles: "scroll reveal"
// in viteo.css.

const TARGETS = [
  [".dl-bigword-fit", "word"],
  [".dl-bigword-head > .dl-h2, .dl-bigword-head > .dl-display", "rise"],
  [
    ".dl-bento-row > *, .dl-steps > li, .dl-ingredients > li, .dl-reviews > li, .dl-faq-item",
    "up",
  ],
  [".dl-cta-inner", "up"],
];

export default function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [];
    TARGETS.forEach(([sel, kind]) => {
      document.querySelectorAll(`.dl ${sel}`).forEach((el) => {
        // Already revealed, or hidden by an earlier run of this effect (React
        // runs effects twice in dev): only fresh pieces below the fold are
        // hidden, but any still-hidden piece is picked up again.
        if (el.dataset.revealed) return;
        if (!el.dataset.reveal) {
          if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
          const siblings = el.parentElement
            ? [...el.parentElement.children]
            : [];
          el.style.setProperty(
            "--rd",
            `${Math.min(siblings.indexOf(el), 5) * 90}ms`,
          );
          el.dataset.reveal = kind;
        }
        els.push(el);
      });
    });
    // Once a piece has wiped in, drop the reveal styles so nothing lingers
    // (its own hover/transition styles apply again).
    const finish = (el) => {
      el.dataset.revealed = "1";
      delete el.dataset.reveal;
      el.classList.remove("is-in");
      el.style.removeProperty("--rd");
    };
    let pending = els;
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.85;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true;
        el.classList.add("is-in");
        setTimeout(() => finish(el), 1700);
        return false;
      });
      if (!pending.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll(); // anything already past the line (e.g. a restored scroll position)
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);
  return null;
}
