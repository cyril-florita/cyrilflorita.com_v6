"use client";
import { useEffect, useRef } from "react";
import { afterPreloader } from "./afterPreloader";

// The routine chart: days the pack was taken, month by month, as a smooth
// line (plus an optional comparison line), with the highlighted month marked
// and labelled. Used by the landing's sample card and the account's tracker.
// Its lines draw in when the chart scrolls into view (.dl.has-draw hides
// them; ScrollMotion only knows about charts present when a page mounts, so
// the chart watches itself too: the account renders after hydration).
// No health outcomes are charted, only whether the pack was taken.
// `width` widens the drawing (wide cards keep their text at its normal
// size); `openEnd` marks the last month as still in progress: its segment is
// dashed, so a month that has only just begun doesn't read as a drop.

const CH = 200;
const X0 = 36;

export default function RoutineGraph({ labels, main, compare, max = 30, tip, tipIndex = main.length - 1, ariaLabel, legend, width: CW = 520, openEnd = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // In view, and only once the preloader has completely faded, so the
    // draw-in isn't spent behind it (the account renders under it).
    let cancel = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        cancel = afterPreloader(() => el.classList.add("is-drawn"));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancel(); };
  }, []);

  const n = labels.length;
  const pt = (v, i) => [X0 + (i * (CW - X0 - 8)) / (n - 1), 12 + (1 - Math.min(v, max) / max) * (CH - 40)];
  const curve = (vals) =>
    vals.map(pt).reduce((d, [x, y], i, p) => {
      if (!i) return `M${x},${y}`;
      const [px, py] = p[i - 1];
      const mx = (px + x) / 2;
      return `${d} C${mx},${py} ${mx},${y} ${x},${y}`;
    }, "");
  const [tx, ty] = pt(main[tipIndex], tipIndex);
  const tipX = Math.max(0, Math.min(tx - 46, CW - 92)); // keep the label inside the chart

  return (
    <>
      <svg ref={ref} className="dl-chart" viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label={ariaLabel}>
        {[0, 10, 20, 30].map((v) => {
          const y = 12 + (1 - v / max) * (CH - 40);
          return (
            <g key={v}>
              <line className="dl-chart-grid" x1={X0} x2={CW - 8} y1={y} y2={y} strokeDasharray="3 5" />
              <text x="0" y={y + 4}>{v}</text>
            </g>
          );
        })}
        <path
          d={`${curve(main)} L${pt(0, n - 1)[0]},${CH - 28} L${X0},${CH - 28} Z`}
          fill="var(--dl-dark-accent)"
          opacity="0.14"
          className="dl-chart-area"
        />
        {compare && (
          <path d={curve(compare)} className="dl-chart-line" pathLength="1" fill="none" stroke="var(--dl-panel-1)" strokeWidth="2.5" />
        )}
        <path d={curve(openEnd ? main.slice(0, -1) : main)} className="dl-chart-line is-main" pathLength="1" fill="none" stroke="var(--dl-dark-accent)" strokeWidth="2.5" />
        {openEnd && (
          <path
            d={curve(main).split(" C").slice(-1).reduce((_, last) => `M${pt(main[n - 2], n - 2).join(",")} C${last}`, "")}
            className="dl-chart-mark"
            fill="none"
            stroke="var(--dl-dark-accent)"
            strokeWidth="2.5"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        )}
        <line className="dl-chart-mark" x1={tx} x2={tx} y1={ty} y2={CH - 28} stroke="var(--dl-dark-accent)" strokeWidth="1.5" />
        <circle className="dl-chart-mark" cx={tx} cy={ty} r="7" fill="var(--dl-dark-card)" stroke="var(--dl-dark-accent)" strokeWidth="3" />
        {tip && (
          <g className="dl-chart-tip dl-chart-mark" transform={`translate(${tipX}, ${Math.max(0, ty - 46)})`}>
            <rect width="92" height="28" rx="10" />
            <text x="46" y="18" textAnchor="middle">{tip}</text>
          </g>
        )}
        {labels.map((m, i) => (
          <text key={`${m}-${i}`} x={pt(0, i)[0]} y={CH - 6} textAnchor="middle">{m}</text>
        ))}
      </svg>
      {legend && (
        <p className="dl-chart-legend">
          {legend.map((l) => <span key={l.label} style={{ "--c": l.color }}>{l.label}</span>)}
        </p>
      )}
    </>
  );
}
