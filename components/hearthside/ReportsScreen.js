"use client";
import { useEffect, useState } from "react";
import { COORDINATORS, DECLINE_REASONS, OPEN_STAGES, SOURCES, STAGES, STAGE_LIMIT_H, firstResponseH, hoursInStage, isOverdue } from "./intake-data";
import { useIntake } from "./store";
import { Sample, Skeleton } from "./ui";

// Reports: one panel per question in the brief. Every chart is a single
// series (one colour), labelled and valued in text beside each bar, so it
// reads without colour and without hovering. Definitions sit under each.

const median = (xs) => { if (!xs.length) return null; const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const hrs = (h) => (h == null ? "—" : h < 1 ? `${Math.round(h * 60)} min` : `${h.toFixed(1)} h`);

function Bars({ rows, max, format = (v) => v, tone }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="hs-bars">
      {rows.map((r) => (
        <li key={r.label} className="hs-bar" title={`${r.label}: ${format(r.value)}`}>
          <span>{r.label}</span>
          <span className="hs-bar-track" aria-hidden="true"><span className={`hs-bar-fill${tone ? ` is-${tone(r)}` : ""}`} style={{ width: `${(r.value / top) * 100}%` }} /></span>
          <b>{format(r.value)}</b>
        </li>
      ))}
    </ul>
  );
}

export default function ReportsScreen() {
  const data = useIntake();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  if (!data) return <Skeleton blocks={4} />;
  const rs = data.referrals;

  // 1. Sources
  const bySource = SOURCES.map((s) => ({ label: s.name, value: rs.filter((r) => r.source === s.id).length })).filter((r) => r.value).sort((a, b) => b.value - a.value);
  // 2. Response
  const responses = rs.map(firstResponseH).filter((h) => h != null);
  const byCoord = COORDINATORS.map((c) => ({ label: c.name, value: median(rs.filter((r) => r.coordinator === c.id).map(firstResponseH).filter((h) => h != null)) ?? 0 }));
  // 3. Stalls
  const open = rs.filter((r) => OPEN_STAGES.includes(r.stage));
  const byStage = STAGES.filter((s) => OPEN_STAGES.includes(s.id)).map((s) => {
    const inStage = open.filter((r) => r.stage === s.id);
    return { label: s.name, value: inStage.length ? median(inStage.map((r) => hoursInStage(r, now))) : 0, late: inStage.filter((r) => isOverdue(r, now)).length, limit: STAGE_LIMIT_H[s.id] };
  });
  // 4. Conversion
  const decided = (id) => rs.filter((r) => r.source === id && ["accepted", "soc", "declined"].includes(r.stage));
  const conv = SOURCES.map((s) => { const d = decided(s.id); return { label: s.name, value: d.length ? Math.round((d.filter((r) => r.stage !== "declined").length / d.length) * 100) : null, n: d.length }; }).filter((r) => r.value !== null).sort((a, b) => b.value - a.value);
  const allDecided = rs.filter((r) => ["accepted", "soc", "declined"].includes(r.stage));
  const overall = allDecided.length ? Math.round((allDecided.filter((r) => r.stage !== "declined").length / allDecided.length) * 100) : 0;
  // 5. Reasons
  const reasons = DECLINE_REASONS.map((d) => ({ label: d, value: rs.filter((r) => r.declineReason === d).length })).filter((r) => r.value).sort((a, b) => b.value - a.value);

  return (
    <>
      <div className="hs-app-head"><div><h1>Reports</h1><p>Five questions about intake, answered from the referrals in the system. <Sample>Sample data</Sample></p></div></div>
      <div className="hs-reports">
        <section className="hs-report" aria-labelledby="rp-1">
          <h2 id="rp-1">Where do referrals come from?</h2>
          <p>Referrals received, by source.</p>
          <Bars rows={bySource} />
          <p className="hs-report-note">All referrals in the system, any stage. Website callbacks and family calls count as their own sources.</p>
        </section>

        <section className="hs-report" aria-labelledby="rp-2">
          <h2 id="rp-2">How quickly does the team respond?</h2>
          <p>Median time to first response.</p>
          <div className="hs-report-big"><b>{hrs(median(responses))}</b><span className="hs-hint">across {responses.length} referrals</span></div>
          <Bars rows={byCoord} format={hrs} />
          <p className="hs-report-note">First response: the first activity logged by a person (a call, a note) after the referral arrived. Automatic routing doesn&rsquo;t count.</p>
        </section>

        <section className="hs-report" aria-labelledby="rp-3">
          <h2 id="rp-3">Where do referrals stall?</h2>
          <p>Median time open referrals have spent in their current stage.</p>
          <Bars rows={byStage} format={hrs} tone={(r) => (r.late ? "alert" : null)} />
          <p className="hs-report-note">Red bars have at least one referral past the stage&rsquo;s limit: {byStage.filter((s) => s.late).map((s) => `${s.label} (${s.late} overdue)`).join(", ") || "none right now"}.</p>
        </section>

        <section className="hs-report" aria-labelledby="rp-4">
          <h2 id="rp-4">Which sources lead to admissions?</h2>
          <p>Share of decided referrals that were accepted, by source.</p>
          <div className="hs-report-big"><b>{overall}%</b><span className="hs-hint">overall, of {allDecided.length} decided</span></div>
          <Bars rows={conv.map((c) => ({ ...c, label: `${c.label} (${c.n})` }))} max={100} format={(v) => `${v}%`} />
          <p className="hs-report-note">Denominator: referrals with a decision (accepted, started care, or not accepted). Open referrals are left out, so early numbers move a lot.</p>
        </section>

        <section className="hs-report" aria-labelledby="rp-5">
          <h2 id="rp-5">Why are referrals not accepted?</h2>
          <p>Reasons recorded when a referral was not accepted.</p>
          {reasons.length ? <Bars rows={reasons} tone={() => "muted"} /> : <p className="hs-hint" style={{ marginTop: 16 }}>No referrals declined yet.</p>}
          <p className="hs-report-note">A reason is required to close a referral as not accepted, so this list is complete. It feeds the conversation with each partner.</p>
        </section>
      </div>
    </>
  );
}
