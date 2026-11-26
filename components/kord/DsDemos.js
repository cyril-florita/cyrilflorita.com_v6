"use client";

import { useState } from "react";
import { PAINTS, SIZES, FIND, HOTSPOTS, FIT_FIELDS, PAINT_PRICE, money } from "@/components/kord/data";
import Choice from "@/components/kord/Choice";
import DsChrome from "@/components/DsChrome";
import { Logo } from "@/components/kord/ui";

// The design system's live samples (/builds/kord/design-system/): the real components and classes,
// working, so the page shows how they behave as well as how they look.

const SIZE_FOR = Object.fromEntries(FIND.find((q) => q.id === "height").a.map((a) => [a.size, a.label]));
const onArrows = (e, i, n, pick) => {
  const k = e.key;
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(k)) return;
  e.preventDefault();
  const j = k === "Home" ? 0 : k === "End" ? n - 1 : (i + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + n) % n;
  pick?.(j); e.currentTarget.parentElement.children[j]?.focus();
};

export function Chrome({ sections }) {
  return (
    <DsChrome prefix="cd" sections={sections} logo={<Logo />} logoIsLink home="/builds/kord/" homeLabel="Back to Kord® home"
      homeClass="cd-btn cd-btn-ghost cd-btn-sm" linkIcon={<span className="cd-arrow" aria-hidden="true">→</span>} />
  );
}

export function SizeDemo() {
  const [v, setV] = useState("54");
  return <Choice label="Size (sample)" name="ds-size" value={v} options={SIZES.map((s) => ({ id: s }))} onPick={setV} className="is-sizes"
    render={(s) => (<><strong>{s.id}</strong><span>{SIZE_FOR[s.id]}</span></>)} />;
}

export function PaintChoiceDemo() {
  const [v, setV] = useState("stealth");
  return <Choice label="Paint (sample)" name="ds-paint" value={v} options={PAINTS} onPick={setV} className="is-2"
    render={(p) => (<><i className="cd-build-swatch" style={{ "--swatch": p.hex }} aria-hidden="true" /><strong>{p.name}</strong><em>{PAINT_PRICE[p.id] ? `Signature, +${money(PAINT_PRICE[p.id])}` : "Included"}</em></>)} />;
}

export function SwatchDemo() {
  const [v, setV] = useState(0);
  return (
    <div className="cd-ds-swatches">
      <div className="cd-paints-row" role="radiogroup" aria-label="Paint swatches (sample)">
        {PAINTS.map((p, i) => (
          <button key={p.id} type="button" role="radio" aria-checked={i === v} tabIndex={i === v ? 0 : -1} aria-label={p.name}
            className="cd-swatch" style={{ "--swatch": p.hex }} onClick={() => setV(i)} onKeyDown={(e) => onArrows(e, i, PAINTS.length, setV)} />
        ))}
      </div>
      <p className="cd-paints-label">Paint · <strong>{PAINTS[v].name}</strong></p>
    </div>
  );
}

export function FindOptDemo() {
  const q = FIND[0];
  const [v, setV] = useState(q.a[1].id);
  return (
    <div className="cd-find-opts" role="radiogroup" aria-label={`${q.q} (sample)`}>
      {q.a.map((o, i) => (
        <button key={o.id} type="button" role="radio" aria-checked={v === o.id} tabIndex={v === o.id ? 0 : -1}
          className={`cd-find-opt${v === o.id ? " is-on" : ""}`} onClick={() => setV(o.id)}
          onKeyDown={(e) => onArrows(e, i, q.a.length, (j) => setV(q.a[j].id))}>
          <span className="cd-find-opt-dot" aria-hidden="true" />{o.label}
        </button>
      ))}
    </div>
  );
}

export function HotspotDemo() {
  const h = HOTSPOTS[0];
  const [open, setOpen] = useState(true);
  return (
    <div className="cd-ds-hotstage">
      <div className={`cd-hot${open ? " is-open" : ""}`}>
        <button type="button" className="cd-hot-btn" aria-expanded={open} aria-controls="ds-hot" onClick={() => setOpen(!open)}>
          <span className="cd-sr">{h.title}</span>
        </button>
        <div id="ds-hot" className="cd-hot-card"><strong>{h.title}</strong><span>{h.line}</span></div>
      </div>
    </div>
  );
}

export function FieldDemo() {
  const f = FIT_FIELDS[1];
  const [v, setV] = useState(String(f.sample));
  return (
    <div className="cd-fit-form cd-ds-field">
      <label className="cd-fit-field">
        <span><strong>{f.label}</strong><em>{f.hint}</em></span>
        <input type="number" inputMode="decimal" min={f.min} max={f.max} step="0.5" value={v} onChange={(e) => setV(e.target.value)} />
      </label>
    </div>
  );
}
