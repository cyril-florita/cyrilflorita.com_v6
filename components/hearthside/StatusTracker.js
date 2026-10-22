"use client";
import { useEffect, useState } from "react";
import { BASE, PHONE } from "./data";
import { coordinator, sourceName } from "./intake-data";
import { STATUS_STEPS, statusStep, useIntake } from "./store";
import { Button, Icon } from "./ui";

// The referrer's status page: where a referral stands, like package
// tracking. Progress only: no diagnosis, documents or clinical notes, so the
// link is safe to share inside the referring team.

export default function StatusTracker() {
  const data = useIntake();
  const [ref, setRef] = useState(null);
  const [input, setInput] = useState("");
  useEffect(() => {
    setRef(new URLSearchParams(window.location.search).get("ref")?.toUpperCase() || ""); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  if (ref === null || !data) return <p aria-busy="true">Loading status…</p>;
  const r = data.referrals.find((x) => x.id === ref);

  const lookup = (e) => {
    e.preventDefault();
    const id = input.trim().toUpperCase();
    window.history.replaceState(null, "", `?ref=${id}`);
    setRef(id);
  };

  if (!r) {
    return (
      <form className="hs-zip" onSubmit={lookup} style={{ maxWidth: 520 }}>
        {ref && <p className="hs-error" role="alert">We couldn&rsquo;t find {ref}. Check the reference and try again.</p>}
        <label htmlFor="st-ref">Referral reference</label>
        <div className="hs-zip-row">
          <input id="st-ref" className="hs-input" placeholder="e.g. HS-24802" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
          <button className="hs-btn hs-btn-secondary" type="submit">Look up</button>
        </div>
        <p className="hs-hint">Sample references to try: HS-24802, HS-24806, HS-24811.</p>
      </form>
    );
  }

  const step = statusStep(r);
  const declined = r.stage === "declined";
  const when = [r.createdAt, step >= 1 ? r.history.find((h) => /Assigned|screening|Spoke|Called|Reached/i.test(h.text))?.at : null, step >= 2 ? r.history.find((h) => /Accepted/i.test(h.text))?.at : null, r.socAt];
  const fmt = (t) => t && new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const c = coordinator(r.coordinator);

  return (
    <div>
      <p className="hs-label">Reference {r.id}</p>
      <h2 style={{ marginTop: 10 }}>
        {declined ? "We couldn't accept this referral" : ["Received", "Under review", "Accepted", "Care has started"][step]}
      </h2>
      {declined ? (
        <div className="hs-note" style={{ marginTop: 24, maxWidth: 720 }}>
          <Icon name="info" />
          <p><strong>Reason: {r.declineReason}.</strong> We&rsquo;ve contacted your team with other agencies that can help. Call us if you&rsquo;d like to talk it through.</p>
        </div>
      ) : (
        <ol className="hs-track">
          {STATUS_STEPS.map((s, i) => (
            <li key={s} className={i < step ? "is-done" : i === step ? "is-now" : ""} aria-current={i === step ? "step" : undefined}>
              <span className="hs-track-dot">{i < step && <Icon name="check" size={14} />}</span>
              <b>{s}</b>
              <span>{i <= step ? fmt(when[i]) || "In progress" : "Not yet"}</span>
            </li>
          ))}
        </ol>
      )}
      <dl className="hs-track-meta">
        <div><dt>From</dt><dd>{sourceName(r.source)}</dd></div>
        <div><dt>Patient</dt><dd>{r.patient.name.split(" ")[0][0]}. {r.patient.name.split(" ")[1]}</dd></div>
        <div><dt>Coordinator</dt><dd>{c ? c.name : "Being assigned"}</dd></div>
      </dl>
      <div className="hs-hero-ctas">
        <Button href={PHONE.href} variant="secondary">Call intake {PHONE.display}</Button>
        <Button href={`${BASE}/intake/referral/?id=${r.id}`} variant="quiet" icon="arrow">See the staff view (demo)</Button>
      </div>
    </div>
  );
}
