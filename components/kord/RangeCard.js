"use client";

import { useState } from "react";
import { BIKES, PAINTS, money, plain } from "@/components/kord/data";

// A range card on the landing (2026-11-25): every bike starts in the same paint (Stealth) and its own
// swatches repaint its still and carry the paint into the builder, so paint reads as a choice you make,
// not part of a model (each bike used to be shown in "its" paint). The swatches are a radio group with
// roving focus and arrow keys, like the hero's paint rail.
export default function RangeCard({ id }) {
  const b = BIKES.find((x) => x.id === id);
  const [paint, setPaint] = useState(PAINTS[0].id);
  const cur = PAINTS.find((p) => p.id === paint);
  const onKey = (e, i) => {
    const k = e.key, n = PAINTS.length;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(k)) return;
    e.preventDefault();
    const j = k === "Home" ? 0 : k === "End" ? n - 1 : (i + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + n) % n;
    setPaint(PAINTS[j].id); e.currentTarget.parentElement.children[j]?.focus();
  };
  return (
    <li className={`cd-card cd-card-${b.id}`}>
      <span className="cd-shot cd-studio"><img className="cd-card-img" src={`/pitch/kord/bikes/${b.id}-${paint}.webp`} width="1200" height="720" alt={`The Kord ${plain(b.name)} in ${cur.name}`} loading="lazy" /></span>
      <div className="cd-card-body">
        <div className="cd-card-head">
          <h3 className="cd-h3">{b.name}</h3>
          <div className="cd-card-paint">
            <div className="cd-card-swatches" role="radiogroup" aria-label={`Paint for the ${plain(b.name)}`}>
              {PAINTS.map((p, i) => (
                <button key={p.id} type="button" role="radio" aria-checked={p.id === paint} tabIndex={p.id === paint ? 0 : -1}
                  aria-label={p.name} className="cd-card-swatch" style={{ "--swatch": p.hex }}
                  onClick={() => setPaint(p.id)} onKeyDown={(e) => onKey(e, i)} />
              ))}
            </div>
            <span className="cd-card-paint-name" aria-hidden="true">{cur.name}</span>
          </div>
        </div>
        <p className="cd-card-type">{b.type}</p>
        <p className="cd-card-line">{b.blurb}</p>
        <dl className="cd-card-specs">
          <div><dt>Weight</dt><dd>{b.weight} kg</dd></div>
          <div><dt>Wheels</dt><dd>{b.wheels}</dd></div>
          <div><dt>Tires</dt><dd>{b.tires}</dd></div>
        </dl>
        <div className="cd-card-foot">
          <p className="cd-card-price">From <strong>{money(b.from)}</strong></p>
          <a className="cd-card-build" href={`/pitch/kord/build/?bike=${b.id}&paint=${paint}`}>Build yours<span className="cd-arrow" aria-hidden="true">→</span><span className="cd-sr">: the {plain(b.name)} in {cur.name}</span></a>
        </div>
      </div>
    </li>
  );
}
