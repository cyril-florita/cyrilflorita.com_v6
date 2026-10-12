"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { SAMPLE_REVIEWS } from "./data";

// The landing page's reviews as a carousel: a native scroll-snap track (so
// touch swipes, trackpads and the keyboard all just work) with prev/next
// buttons and position dots. Three cards show on desktop, two on tablets,
// one and a peek on phones (viteo.css). With a mouse the track can also be
// dragged: snapping is off while it follows the pointer, then it glides to
// the nearest card (a quick flick carries on to the next). No autoplay; the
// buttons scroll smoothly unless reduced motion is on.

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Chevron = ({ back }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={back ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

export default function Reviews() {
  const trackRef = useRef(null);
  const stepRef = useRef(1);
  const drag = useRef(null);
  // index: the first fully visible card; stops: how many start positions there are.
  const [state, setState] = useState({ index: 0, stops: SAMPLE_REVIEWS.length });

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t || !t.children.length) return;
    const card = t.children[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
    const step = card + gap;
    stepRef.current = step;
    const perView = Math.max(1, Math.round((t.clientWidth + gap) / step));
    const stops = Math.max(1, t.children.length - perView + 1);
    const atEnd = t.scrollLeft >= t.scrollWidth - t.clientWidth - 2;
    const index = atEnd ? stops - 1 : Math.min(stops - 1, Math.round(t.scrollLeft / step));
    setState((s) => (s.index === index && s.stops === stops ? s : { index, stops }));
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    let frame = 0;
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); }); };
    measure();
    t.addEventListener("scroll", onScroll, { passive: true });
    // Re-measure when the track or a card changes size (cards can settle
    // after the first measure, e.g. once web fonts load).
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    if (t.children[0]) ro.observe(t.children[0]);
    return () => { t.removeEventListener("scroll", onScroll); ro.disconnect(); cancelAnimationFrame(frame); };
  }, [measure]);

  const go = (i) => {
    const t = trackRef.current;
    const card = t?.children[Math.max(0, Math.min(i, t.children.length - 1))];
    if (!card) return;
    t.scrollTo({ left: card.offsetLeft - t.children[0].offsetLeft, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  // Mouse drag (touch and trackpads already scroll the track natively).
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const t = trackRef.current;
    drag.current = { x: e.clientX, left: t.scrollLeft, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
    t.setPointerCapture(e.pointerId);
    t.classList.add("is-dragging"); // snapping off, grabbing cursor, no text selection
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 3) d.moved = true;
    trackRef.current.scrollLeft = d.left - dx;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.8 * ((e.clientX - d.lastX) / dt) + 0.2 * d.v; // px per ms, smoothed
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const t = trackRef.current;
    if (t.hasPointerCapture(e.pointerId)) t.releasePointerCapture(e.pointerId);
    // Where the throw would carry it, then the nearest card to that.
    const v = e.timeStamp - d.lastT > 80 ? 0 : d.v;
    const target = Math.round((t.scrollLeft - v * 180) / stepRef.current);
    go(Math.max(0, Math.min(state.stops - 1, target)));
    // Turn snapping back on once the glide ends (sooner would jump).
    const done = () => { t.classList.remove("is-dragging"); clearTimeout(timer); t.removeEventListener("scrollend", done); };
    const timer = setTimeout(done, 700);
    t.addEventListener("scrollend", done, { once: true });
  };

  const { index, stops } = state;
  const total = SAMPLE_REVIEWS.length;

  return (
    <div className="dl-carousel" role="region" aria-roledescription="carousel" aria-label="Reviews">
      <ul
        ref={trackRef}
        id="dl-reviews-track"
        className="dl-reviews"
        tabIndex={0}
        aria-label="Reviews: scroll sideways for more"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {SAMPLE_REVIEWS.map((r, i) => (
          <li key={r.name} className="dl-card dl-glass dl-review" aria-roledescription="slide" aria-label={`${i + 1} of ${total}`}>
            <p>&ldquo;{r.text}&rdquo;</p>
            <span className="dl-meta">
              {r.name} · {r.plan}
            </span>
          </li>
        ))}
      </ul>
      {stops > 1 && (
        <div className="dl-carousel-bar">
          <div className="dl-carousel-dots">
            {Array.from({ length: stops }, (_, i) => (
              <button
                key={i}
                type="button"
                className={i === index ? "is-on" : ""}
                aria-label={`Show review ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                aria-controls="dl-reviews-track"
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className="dl-carousel-nav">
            <button type="button" className="dl-corner" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous review" aria-controls="dl-reviews-track">
              <Chevron back />
            </button>
            <button type="button" className="dl-corner" onClick={() => go(index + 1)} disabled={index >= stops - 1} aria-label="Next review" aria-controls="dl-reviews-track">
              <Chevron />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
