"use client";

import { useState } from "react";
import { FIT_FIELDS, fitFor } from "@/components/kord/data";
import { Sample } from "@/components/kord/ui";

// Virtual fit (/builds/kord/fit/): five measurements, starting from a sample rider, and a starting
// fit that updates as you type — size, saddle height, crank, stem, bar — each with why. Nothing is
// sent anywhere; "Build with this fit" opens the builder in that size.

export default function Fit() {
  const [m, setM] = useState(() => Object.fromEntries(FIT_FIELDS.map((f) => [f.k, String(f.sample)])));
  const f = fitFor(m);
  const out = [
    { label: "Frame size", value: f.size, why: `For a height of ${f.v.height} cm.` },
    { label: "Saddle height", value: `${f.saddle} mm`, why: "Your inseam × 0.883, from the crank's center to the top of the saddle." },
    { label: "Crank length", value: `${f.crank} mm`, why: `Matched to a ${f.v.inseam} cm inseam.` },
    { label: "Stem", value: `${f.stem} mm`, why: "Longer or shorter than 100 mm as your torso and arms are, for your height." },
    { label: "Bar width", value: `${f.bar} cm`, why: `Close to your ${f.v.shoulders} cm shoulders.` },
  ];
  return (
    <div className="cd-fit">
      <form className="cd-fit-form" onSubmit={(e) => e.preventDefault()} aria-label="Your measurements">
        <p className="cd-build-note">In centimeters. Start from our sample rider and change what&apos;s yours. <Sample>Sample rider</Sample></p>
        {FIT_FIELDS.map((x) => (
          <label key={x.k} className="cd-fit-field">
            <span><strong>{x.label}</strong><em>{x.hint}</em></span>
            <input type="number" inputMode="decimal" min={x.min} max={x.max} step="0.5" value={m[x.k]}
              onChange={(e) => setM((s) => ({ ...s, [x.k]: e.target.value }))} aria-describedby={`fit-${x.k}`} />
            <small id={`fit-${x.k}`} className="cd-sr">{x.hint}, {x.min} to {x.max} cm</small>
          </label>
        ))}
      </form>
      <section className="cd-fit-out" aria-labelledby="fit-out" aria-live="polite">
        <h2 id="fit-out" className="cd-build-h"><span>Your</span> starting fit</h2>
        <dl>
          {out.map((o) => (
            <div key={o.label}><dt>{o.label}</dt><dd><strong>{o.value}</strong><span>{o.why}</span></dd></div>
          ))}
        </dl>
        <p className="cd-build-note">A starting point, not the last word: a fitter checks it with you on a video call, or from two photos, before we build.</p>
        <a className="cd-btn cd-btn-primary" href={`/builds/kord/build/?size=${f.size}`}>Build with this fit<span className="cd-arrow" aria-hidden="true">→</span></a>
      </section>
    </div>
  );
}
