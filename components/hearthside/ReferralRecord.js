"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BASE } from "./data";
import { DECLINE_REASONS, DOCS, REGIONS, SERVICE_OPTIONS, coordinator, fmtDue, isOverdue, regionFor, sourceName, stageName } from "./intake-data";
import { accept, decline, logCall, receiveDoc, startOfCare, useIntake } from "./store";
import { Icon, Skeleton } from "./ui";

// One referral, staff view: what's next and the actions that move it along,
// its documents, details and the full activity log (the audit trail). Every
// action updates the referrer's status page.

const STAGE_TONE = { new: "", assigned: "hs-status-accent", contacted: "hs-status-accent", screening: "hs-status-accent", review: "hs-status-warn", accepted: "hs-status-ok", soc: "hs-status-ok", declined: "hs-status-danger" };
const fmt = (t) => new Date(t).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default function ReferralRecord() {
  const data = useIntake();
  const [id, setId] = useState(null);
  const [reason, setReason] = useState(DECLINE_REASONS[0]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id") || ""); // eslint-disable-line react-hooks/set-state-in-effect
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  if (!data || id === null) return <Skeleton blocks={2} />;
  const r = data.referrals.find((x) => x.id === id);
  if (!r) return <p>Referral not found. <Link href={`${BASE}/intake/`}>Back to the board</Link></p>;

  const c = coordinator(r.coordinator);
  const open = !["soc", "declined"].includes(r.stage);
  const missing = DOCS.filter((d) => d.required && !r.docs.includes(d.id));
  const region = regionFor(r.patient.zip);

  return (
    <>
      <p><Link href={`${BASE}/intake/`}>← Board</Link></p>
      <header className="hs-rec-head">
        <span className="hs-label">{r.id} <span className="hs-sample" style={{ marginLeft: 8 }}>Sample</span></span>
        <h1>{r.patient.name}, {r.patient.age}</h1>
        <div className="hs-rec-meta">
          <span className={`hs-status ${STAGE_TONE[r.stage]}`}>{stageName(r.stage)}</span>
          {isOverdue(r, now) && <span className="hs-status hs-status-danger">Overdue</span>}
          <span>From {sourceName(r.source)} ({r.contact})</span>
          <span>{c ? `Coordinator: ${c.name}` : "Unassigned"}</span>
          <Link href={`${BASE}/status/?ref=${r.id}`}>Referrer&rsquo;s status page</Link>
        </div>
      </header>

      <div className="hs-rec">
        <div>
          <section className="hs-panel" aria-labelledby="rec-next">
            <h2 id="rec-next">Next</h2>
            <div className="hs-panel-body hs-next">
              <b>{r.nextAction}</b>
              {r.due && open && <span className={isOverdue(r, now) ? "hs-error" : "hs-hint"}>{fmtDue(r.due, now)}</span>}
              {r.stage === "declined" && <p className="hs-muted">Reason recorded: {r.declineReason}</p>}
              {open && (
                <div className="hs-actions">
                  {["new", "assigned", "contacted"].includes(r.stage) && (
                    <>
                      <button type="button" className="hs-btn hs-btn-primary" onClick={() => logCall(r.id, true)}>Log call: reached</button>
                      <button type="button" className="hs-btn hs-btn-secondary" onClick={() => logCall(r.id, false)}>Log call: no answer</button>
                    </>
                  )}
                  {["screening", "review"].includes(r.stage) && (
                    <button type="button" className="hs-btn hs-btn-primary" onClick={() => accept(r.id)} disabled={missing.length > 0} title={missing.length ? "Receive the required documents first" : undefined}>Accept referral</button>
                  )}
                  {r.stage === "accepted" && <button type="button" className="hs-btn hs-btn-primary" onClick={() => startOfCare(r.id)}>Record start of care</button>}
                  <span className="hs-actions">
                    <label className="hs-visually-hidden" htmlFor="rec-reason">Reason not accepted</label>
                    <select id="rec-reason" className="hs-select" value={reason} onChange={(e) => setReason(e.target.value)}>
                      {DECLINE_REASONS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <button type="button" className="hs-btn hs-btn-secondary" onClick={() => decline(r.id, reason)}>Not accepted</button>
                  </span>
                </div>
              )}
              {["screening", "review"].includes(r.stage) && missing.length > 0 && <p className="hs-hint">Accepting needs every required document.</p>}
            </div>
          </section>

          <section className="hs-panel" aria-labelledby="rec-docs">
            <h2 id="rec-docs">Documents · {r.docs.filter((d) => DOCS.find((x) => x.id === d)?.required).length} of {DOCS.filter((d) => d.required).length} required</h2>
            <ul className="hs-docs">
              {DOCS.map((d) => {
                const has = r.docs.includes(d.id);
                return (
                  <li key={d.id}>
                    <span className="hs-doc-name">
                      <Icon name={has ? "check" : "info"} size={20} />
                      <span>{d.name}{!d.required && <span className="hs-hint"> (optional)</span>}</span>
                    </span>
                    {has ? <span className="hs-status hs-status-ok">Received</span> : open ? <button type="button" className="hs-doc-toggle" onClick={() => receiveDoc(r.id, d.id)}>Mark received<span className="hs-visually-hidden">: {d.name}</span></button> : <span className="hs-hint">Not received</span>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="hs-panel" aria-labelledby="rec-log">
            <h2 id="rec-log">Activity log</h2>
            <ol className="hs-timeline">
              {[...r.history].reverse().map((h, i) => (
                <li key={i} className={h.who === "System" ? "is-system" : ""}>
                  <span />
                  <div><p>{h.text}</p><small>{h.who} · {fmt(h.at)}</small></div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside>
          <section className="hs-panel" aria-labelledby="rec-details">
            <h2 id="rec-details">Referral</h2>
            <div className="hs-panel-body">
              <dl className="hs-kv">
                <dt>Reason</dt><dd>{r.patient.reason}</dd>
                <dt>Services</dt><dd>{r.services.map((s) => SERVICE_OPTIONS.find((o) => o.id === s)?.name).join(", ")}</dd>
                <dt>Insurance</dt><dd>{r.payer}</dd>
                <dt>Home</dt><dd>{r.patient.town}, {r.patient.zip}</dd>
                <dt>Region</dt><dd>{region ? REGIONS[region].name : "Outside service area"}</dd>
                <dt>Received</dt><dd>{fmt(r.createdAt)}</dd>
                {r.socAt && <><dt>Start of care</dt><dd>{fmt(r.socAt)}</dd></>}
              </dl>
            </div>
          </section>
          <section className="hs-panel" aria-labelledby="rec-privacy">
            <h2 id="rec-privacy">Handling</h2>
            <div className="hs-panel-body">
              <p className="hs-hint">Clinical assessment, eligibility, and care documentation live in the clinical record system, not here. Notifications to staff and referrers carry a link and reference number only, never health details.</p>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
