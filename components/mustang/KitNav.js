"use client";

import { useEffect, useState } from "react";

// The campaign kit's index of deliverables. On wide screens (kit.css, ≥1360px) it's a sticky
// sidebar beside the sections, and the section being read is marked (aria-current, in the
// accent, with a bar that slides to it); narrower, it's a row of links under the head.
export default function KitNav({ items }) {
  const [on, setOn] = useState(items[0].id);
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    // The current section is the last one whose top has passed a line 35% down the screen.
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let cur = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) cur = el.id;
      // at the very bottom, the last section counts even if it's too short to reach the line
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = els.at(-1)?.id;
      setOn(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [items]);
  const i = Math.max(0, items.findIndex((it) => it.id === on));
  return (
    <nav className="kit-index" aria-label="Deliverables">
      <p className="kit-index-label" aria-hidden="true">Deliverables</p>
      <ol style={{ "--i": i }}>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={it.id === on ? "true" : undefined}>{it.label}</a>
          </li>
        ))}
      </ol>
      <a className="kit-index-ad" href="/pitch/mustang/">See the ad</a>
    </nav>
  );
}
