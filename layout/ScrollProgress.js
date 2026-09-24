"use client";
import { useEffect, useRef } from "react";

// Accent bar across the top of project pages that fills as you read. Driven
// by scaleX in a rAF (not width + React state) so it tracks the scroll
// without re-rendering the page on every scroll event.
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let rafId = null;

    const update = () => {
      rafId = null;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={barRef} className="cyril-scroll-progress" aria-hidden="true" />;
};

export default ScrollProgress;
