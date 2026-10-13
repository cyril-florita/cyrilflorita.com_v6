"use client";
import { useRef, useState } from "react";
import { LOT_LAB, PRODUCTS, SAMPLE_LOTS } from "./data";
import { BigWordHead, Pill } from "./ui";

// Batch results: type the lot code from the bottom of the box and see that
// batch's independent lab results (identity, potency against the label claim,
// heavy metals, microbials). Runs on sample lots (stamped as sample data);
// unknown codes get a plain explanation. Codes are matched loosely
// (case, spaces and dashes don't matter).

const norm = (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "");
const LOOKUP = Object.fromEntries(Object.keys(SAMPLE_LOTS).map((k) => [norm(k), k]));

const Rows = ({ rows }) => (
  <dl className="dl-lot-rows">
    {rows.map((r) => (
      <div key={r.test}>
        <dt>{r.test}</dt>
        <dd>{r.result}</dd>
        <dd className="dl-meta">{r.spec}</dd>
        <dd className={`dl-lot-status ${r.pass ? "is-pass" : ""}`}>{r.pass ? "Pass" : "Review"}</dd>
      </div>
    ))}
  </dl>
);

export default function LotLookup() {
  const [code, setCode] = useState("");
  const [lot, setLot] = useState(null); // { code, data } | { code, missing: true }
  const resultRef = useRef(null);

  const look = (value) => {
    const key = LOOKUP[norm(value)];
    setLot(key ? { code: key, data: SAMPLE_LOTS[key] } : { code: value.trim(), missing: true });
    requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: false }));
  };

  const d = lot?.data;
  const p = d && PRODUCTS[d.product];

  return (
    <section className="dl-lot">
      <div className="dl-wrap">
        <BigWordHead word="Batch results">
          <h1 className="dl-h2">Every batch, tested and published.</h1>
          <p className="dl-bigword-note">
            <span className="dl-code" data-lot="Lot 04">Sample data</span>
          </p>
        </BigWordHead>
        <p className="dl-section-lede">
          Each product is made in batches, and every batch is tested by an independent lab before it ships. The lot code
          is printed on the bottom of your box. Enter it to see that batch&apos;s results.
        </p>

        <form
          className="dl-card dl-lot-form"
          onSubmit={(e) => { e.preventDefault(); if (code.trim()) look(code); }}
        >
          <label className="dl-field dl-field-wide">
            <span>Lot code</span>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="VT-2410-07" autoComplete="off" spellCheck="false" />
          </label>
          <button type="submit" className="dl-btn dl-btn-primary">Look up</button>
          <p className="dl-meta dl-lot-try">
            Try a sample lot:{" "}
            {Object.keys(SAMPLE_LOTS).map((k, i) => (
              <span key={k}>
                {i > 0 && " · "}
                <button type="button" className="dl-textlink" onClick={() => { setCode(k); look(k); }}>{k}</button>
              </span>
            ))}
          </p>
        </form>

        <div ref={resultRef} tabIndex={-1} className="dl-lot-result" aria-live="polite">
          {lot?.missing && (
            <div className="dl-card dl-lot-missing">
              <h2 className="dl-h3">We couldn&apos;t find lot &ldquo;{lot.code}&rdquo;</h2>
              <p>Check the code on the bottom of your box: it starts with VT- followed by two sets of numbers. If it still doesn&apos;t match, write to us and we&apos;ll send that batch&apos;s certificate directly.</p>
            </div>
          )}
          {d && (
            <article className="dl-card dl-lot-card">
              <header className="dl-lot-head">
                <span className="dl-lot-pill"><Pill id={d.product} size="lg" tilt={-20} /></span>
                <div>
                  <p className="dl-eyebrow">Lot {lot.code}</p>
                  <h2 className="dl-h2">{p.name}</h2>
                  <p className="dl-meta">{p.dose} · {p.form}</p>
                </div>
                <span className="dl-lot-badge">Released</span>
              </header>
              <dl className="dl-lot-facts">
                <div><dt>Made</dt><dd>{d.made}</dd></div>
                <div><dt>Tested</dt><dd>{d.tested}</dd></div>
                <div><dt>Best by</dt><dd>{d.bestBy}</dd></div>
                <div><dt>Tested by</dt><dd>{LOT_LAB}</dd></div>
              </dl>

              <h3 className="dl-h4">Identity and strength</h3>
              <Rows rows={[
                { test: "Identity", result: "Confirmed", spec: "Matches the reference standard", pass: true },
                { test: "Potency", result: `${d.potency}% of label claim`, spec: "90–125% of label claim", pass: true },
              ]} />
              <h3 className="dl-h4">Heavy metals</h3>
              <Rows rows={d.metals} />
              <h3 className="dl-h4">Microbials</h3>
              <Rows rows={d.micro} />

              <div className="dl-lot-actions">
                <button type="button" className="dl-btn dl-btn-ghost" disabled title="Available at launch">Download certificate (PDF)</button>
                <span className="dl-meta">Certificates are available at launch; in preview mode the results above are sample data.</span>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
