"use client";

import { useEffect, useRef, useState } from "react";

// The campaign kit's index of deliverables. On wide screens (kit.css, ≥1360px) it's a sticky
// sidebar beside the sections, and the section being read is marked (aria-current, in the
// accent, with a bar that slides to it); narrower, it's a row of links under the head, plus a
// progress bar stuck to the top of the screen while the sections scroll: seven segments, one
// per section, each filling as that section is read, with the current one's name beside it.
// Tapping it opens a sheet of the sections (a native <dialog>).
export default function KitNav({ items }) {
  const [on, setOn] = useState(items[0].id);
  const [open, setOpen] = useState(false);
  const segs = useRef(null);
  const sheet = useRef(null);
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
      const end = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (end) cur = els.at(-1)?.id;
      setOn(cur);
      // each segment fills as its section passes the line (written straight to the DOM, so
      // scrolling doesn't re-render)
      const spans = segs.current?.children;
      if (spans) els.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        const f = end ? 1 : Math.min(1, Math.max(0, (line - r.top) / r.height));
        spans[k]?.style.setProperty("--f", f.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [items]);
  // the sheet: open as a modal; Esc, a link or a press that starts and ends on the backdrop closes it
  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const downOnBackdrop = useRef(false);
  const i = Math.max(0, items.findIndex((it) => it.id === on));
  const cur = items[i];
  return (
    <>
    <div className="kit-bar">
      <button type="button" className="kit-bar-btn" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span className="kit-bar-segs" ref={segs} aria-hidden="true">
          {items.map((it) => <span key={it.id} />)}
        </span>
        <span className="kit-bar-now">
          <span className="kit-bar-n">{String(i + 1).padStart(2, "0")}</span> {cur.label}
          <span className="visually-hidden">, section {i + 1} of {items.length}. Show all deliverables</span>
        </span>
        <svg className="kit-bar-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
    </div>
    <dialog className="kit-sheet" ref={sheet} aria-label="Deliverables" onClose={() => setOpen(false)}
      onPointerDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (e.target === e.currentTarget && downOnBackdrop.current) setOpen(false); }}>
      <div className="kit-sheet-in">
        <div className="kit-sheet-head">
          <p className="kit-index-label kit-sheet-label">Deliverables</p>
          <button type="button" className="kit-sheet-close" aria-label="Close" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <ol>
          {items.map((it, k) => (
            <li key={it.id}>
              <a href={`#${it.id}`} aria-current={it.id === on ? "true" : undefined} onClick={() => setOpen(false)}>
                <span className="kit-bar-n">{String(k + 1).padStart(2, "0")}</span> {it.label}
              </a>
            </li>
          ))}
        </ol>
        <a className="kit-sheet-ad" href="/pitch/mustang/">See the ad ↗</a>
      </div>
    </dialog>
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
    </>
  );
}
