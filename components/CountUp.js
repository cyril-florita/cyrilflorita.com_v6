"use client";
import { useEffect, useRef } from "react";

// Counts a number up from zero the first time it scrolls into view, keeping
// any prefix/suffix and the number of decimals ("+38%", "~25%", "1.4 Years").
// The final value is what's rendered in the HTML (no-JS / SEO / reduced
// motion all just see it); values without a number are shown as-is. Used by
// the case-study stats band and the About Me Experience duration.
const NUMBER = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/;

const CountUp = ({ value, duration = 1400, delay = 150, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const text = String(value);
    const match = text.match(NUMBER);
    if (!el || !match || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (el) el.textContent = text;
      return;
    }

    const [, prefix, digits, suffix] = match;
    const target = parseFloat(digits);
    const decimals = (digits.split(".")[1] || "").length;
    const format = (n) => `${prefix}${n.toFixed(decimals)}${suffix}`;
    el.textContent = format(0);

    let rafId;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      // Start just after the surrounding fade-in gets going.
      timer = setTimeout(() => {
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          el.textContent = format(target * (1 - Math.pow(1 - t, 3))); // ease-out
          if (t < 1) rafId = requestAnimationFrame(tick);
          else el.textContent = text;
        };
        rafId = requestAnimationFrame(tick);
      }, delay);
    }, { rootMargin: "0px 0px -10% 0px" });
    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
};

export default CountUp;
