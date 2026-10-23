"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BASE } from "./data";
import { LIAISONS, OPEN_STAGES, PARTNER_ORGS, coordinator, fmtDue, isOverdue, missingDocs } from "./intake-data";
import { toggleTask, useIntake } from "./store";
import { Icon, Sample, Skeleton } from "./ui";

const DAY = 24 * 3600e3;
const useNow = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  return now;
};
const fmtDay = (d) => (d === 0 ? "today" : d > 0 ? `in ${d} day${d > 1 ? "s" : ""}` : `${-d} day${d < -1 ? "s" : ""} ago`);

// Partners: referral relationships, separate from individual intake.
export function PartnersScreen() {
  const data = useIntake();
  if (!data) return <Skeleton blocks={3} />;
  const rows = PARTNER_ORGS.map((p) => {
    const rs = data.referrals.filter((r) => r.source === p.id);
    const admitted = rs.filter((r) => ["accepted", "soc"].includes(r.stage)).length;
    const decided = rs.filter((r) => ["accepted", "soc", "declined"].includes(r.stage)).length;
    return { ...p, total: rs.length, open: rs.filter((r) => OPEN_STAGES.includes(r.stage)).length, admitted, rate: decided ? Math.round((admitted / decided) * 100) : null, reasons: rs.filter((r) => r.declineReason).map((r) => r.declineReason) };
  });
  return (
    <>
      <div className="hs-app-head"><div><h1>Referral partners</h1><p>Relationships with the hospitals, practices, and communities that refer to us. <Sample>Sample partners</Sample></p></div></div>
      <div className="hs-table-wrap">
        <table className="hs-table hs-table-cards">
          <thead>
            <tr><th scope="col">Organization</th><th scope="col">Liaison</th><th scope="col">Last contact</th><th scope="col">Next follow-up</th><th scope="col" className="num">Referrals</th><th scope="col" className="num">Open</th><th scope="col" className="num">Admitted</th><th scope="col">Not admitted</th></tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <th scope="row"><b>{p.name}</b><small>{p.type} · {p.town}</small><small>{p.contact}</small></th>
                <td data-label="Liaison">{LIAISONS.find((l) => l.id === p.liaison).name}</td>
                <td data-label="Last contact">{fmtDay(p.lastContact)}</td>
                <td data-label="Next follow-up">{p.nextFollowUp < 0 ? <span className="hs-status hs-status-danger">{fmtDay(p.nextFollowUp)}</span> : fmtDay(p.nextFollowUp)}</td>
                <td className="num" data-label="Referrals">{p.total}</td>
                <td className="num" data-label="Open">{p.open}</td>
                <td className="num" data-label="Admitted">{p.admitted}{p.rate !== null && <small>{p.rate}% of decided</small>}</td>
                <td data-label="Not admitted">{p.reasons.length ? p.reasons.join("; ") : <span className="hs-hint">None</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hs-hint" style={{ marginTop: 14 }}>&ldquo;Admitted&rdquo; counts referrals accepted or started; the rate uses only referrals with a decision.</p>
    </>
  );
}

// Tasks: what needs doing, derived from referrals and partner follow-ups.
export function TasksScreen() {
  const data = useIntake();
  const now = useNow();
  if (!data) return <Skeleton blocks={3} />;
  const tasks = [];
  for (const r of data.referrals.filter((x) => OPEN_STAGES.includes(x.stage))) {
    const who = coordinator(r.coordinator)?.name ?? "Unassigned";
    if (r.due) tasks.push({ key: `${r.id}-next-${r.stageAt}`, text: r.nextAction, sub: `${r.id} · ${r.patient.name} · ${who}`, due: r.due, href: `${BASE}/intake/referral/?id=${r.id}`, late: isOverdue(r, now) });
    for (const d of missingDocs(r)) tasks.push({ key: `${r.id}-doc-${d.id}`, text: `Request: ${d.name}`, sub: `${r.id} · ${r.patient.name} · ${who}`, due: r.createdAt + DAY, href: `${BASE}/intake/referral/?id=${r.id}`, late: r.createdAt + DAY < now });
  }
  for (const p of PARTNER_ORGS) {
    const due = now + p.nextFollowUp * DAY;
    tasks.push({ key: `partner-${p.id}`, text: `Follow up with ${p.name}`, sub: `${p.contact} · ${LIAISONS.find((l) => l.id === p.liaison).name}`, due, href: `${BASE}/intake/partners/`, late: p.nextFollowUp < 0 });
  }
  tasks.sort((a, b) => a.due - b.due);
  const groups = [
    ["Overdue", tasks.filter((t) => t.late)],
    ["Due in the next 24 hours", tasks.filter((t) => !t.late && t.due - now < DAY)],
    ["Later", tasks.filter((t) => !t.late && t.due - now >= DAY)],
  ];
  return (
    <>
      <div className="hs-app-head"><div><h1>Tasks</h1><p>Follow-ups the rules created, and anything past its stage limit.</p></div></div>
      <div className="hs-tasks">
        {groups[0][1].length === 0 && (
          <div className="hs-empty" role="status">
            <Icon name="check" size={28} />
            <div><b>Nothing overdue</b><p>Every follow-up is within its time limit.</p></div>
          </div>
        )}
        {groups.map(([title, list]) => list.length > 0 && (
          <section key={title} className="hs-task-group" aria-label={title}>
            <h2>{title} · {list.length}</h2>
            <ul className="hs-task-list">
              {list.map((t) => {
                const done = data.done.includes(t.key);
                return (
                  <li key={t.key} className={`hs-task${done ? " is-done" : ""}`}>
                    <input type="checkbox" checked={done} onChange={() => toggleTask(t.key)} aria-label={`Done: ${t.text}`} />
                    <span className="hs-task-text"><Link href={t.href}>{t.text}</Link><small>{t.sub}</small></span>
                    <span className={`hs-task-due${t.late && !done ? " is-late" : ""}`}>{fmtDue(t.due, now)}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
