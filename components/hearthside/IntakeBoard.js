"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BASE } from "./data";
import { COORDINATORS, OPEN_STAGES, STAGES, coordinator, fmtAgo, fmtDue, isOverdue, missingDocs, route, sourceName, SERVICE_OPTIONS } from "./intake-data";
import { assign, useIntake } from "./store";
import { Button, Icon, Skeleton } from "./ui";

// The pipeline board: open referrals by stage. Arriving from the referral
// form (?arrive=HS-…), the new card drops into New and glows, then the
// routing rule assigns it (animated with a view transition, so it travels
// to Assigned) while toasts report the rule, the first-call task and any
// missing documents. Reduced motion: the same steps, without the movement.

const initials = (name) => name.split(" ").map((p) => p[0]).join("");
const PLAYED = new Set();
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const short = (id) => SERVICE_OPTIONS.find((s) => s.id === id)?.name.split(" ")[0];

// `named`: the card gets its own view-transition layer only while an arrival
// is playing (so it can travel between columns); at other times every card
// moves with the screen, instead of flying separately on each screen change.
export function Card({ r, now, state, named }) {
  const c = coordinator(r.coordinator);
  const miss = missingDocs(r).length;
  const late = isOverdue(r, now);
  return (
    <Link href={`${BASE}/intake/referral/?id=${r.id}`} className={`hs-card-r${state ? ` is-${state}` : ""}`} style={named ? { viewTransitionName: `hs-${r.id}` } : undefined}>
      <span className="hs-card-r-top"><span>{r.id}</span><span>{fmtAgo(r.createdAt, now)}</span></span>
      <b>{r.patient.name}</b>
      <p>{r.patient.town} · {r.services.map(short).join(", ")}<br />From {sourceName(r.source)}</p>
      <span className="hs-card-r-foot">
        {late && <span className="hs-status hs-status-danger">Overdue</span>}
        {miss > 0 && <span className="hs-status hs-status-warn">{miss} doc{miss > 1 ? "s" : ""} missing</span>}
        {!late && !miss && r.due && <span className="hs-status">{fmtDue(r.due, now)}</span>}
        <span className={`hs-avatar${c ? "" : " is-empty"}`} title={c ? c.name : "Unassigned"} aria-label={c ? `Assigned to ${c.name}` : "Unassigned"}>{c ? initials(c.name) : "?"}</span>
      </span>
    </Link>
  );
}

export default function IntakeBoard() {
  const data = useIntake();
  const [who, setWho] = useState("all");
  const [onlyLate, setOnlyLate] = useState(false);
  const [arriving, setArriving] = useState(null);
  const [travel, setTravel] = useState(false); // cards carry view-transition names only while the arrival travels
  const [toasts, setToasts] = useState([]);
  const [now, setNow] = useState(() => Date.now());
  const boardRef = useRef(null);
  const [activeStage, setActiveStage] = useState(OPEN_STAGES[0]);

  // Phones: one stage per screen. The board scrolls sideways with snapping;
  // the stage tabs above it jump to a stage and follow the scroll.
  // Scroll only the board sideways (scrollIntoView would also move the page).
  const toStage = useCallback((id) => {
    const board = boardRef.current;
    const col = board?.querySelector(`[data-stage="${id}"]`);
    if (col) board.scrollTo({ left: col.offsetLeft - board.offsetLeft, behavior: reduced() ? "auto" : "smooth" });
  }, []);
  // Keep the active stage tab in view in its own scrolling row.
  const tabsRef = useRef(null);
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.querySelector('[aria-selected="true"]');
    if (tab && row.scrollWidth > row.clientWidth) row.scrollTo({ left: tab.offsetLeft - row.offsetLeft - 16, behavior: "smooth" });
  }, [activeStage]);
  useEffect(() => {
    const board = boardRef.current;
    if (!board || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActiveStage(e.target.dataset.stage)), { root: board, threshold: 0.6 });
    board.querySelectorAll("[data-stage]").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [data]);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  // The arrival sequence, once per referral (PLAYED). Its timers are never
  // cancelled: arriving client-side from the form, the board mounts with data
  // already loaded, and an effect cleanup (React's dev double-mount, or a
  // store update) used to clear them and leave the card stuck in New. A late
  // setState after a real unmount is harmless, and assign() should run anyway.
  useEffect(() => {
    if (!data) return;
    const id = new URLSearchParams(window.location.search).get("arrive");
    const r = id && data.referrals.find((x) => x.id === id);
    if (!r || PLAYED.has(id)) return;
    PLAYED.add(id);
    const later = (ms, fn) => setTimeout(fn, ms);
    const toast = (icon, text) => setToasts((t) => [...t, { id: Math.random(), icon, text }]);
    setArriving({ id, state: "arriving" }); // eslint-disable-line react-hooks/set-state-in-effect
    setTravel(r.stage === "new");
    toast("clipboard", `New referral ${id} from ${sourceName(r.source)}`);
    if (r.stage !== "new") { later(400, () => setArriving({ id, state: "landed" })); return; }
    const rt = route(r.patient.zip);
    later(reduced() ? 300 : 1800, () => {
      const run = () => flushSync(() => { assign(id); setArriving({ id, state: "landed" }); });
      if (document.startViewTransition && !reduced()) document.startViewTransition(run).finished.finally(() => setTravel(false));
      else { run(); setTravel(false); }
      if (rt) toast("map", `Routed by rule: ${rt.rule} → ${coordinator(rt.coordinator).name}`);
    });
    later(reduced() ? 600 : 2800, () => toast("check", "Task created: first call, due within 2 hours"));
    const miss = missingDocs(r);
    if (miss.length) later(reduced() ? 900 : 3600, () => toast("info", `Missing: ${miss.map((d) => d.name).join(", ")}. Request task added.`));
    later(12000, () => setToasts([]));
  }, [data]);

  if (!data) return <Skeleton blocks={4} />;
  const open = data.referrals.filter((r) => OPEN_STAGES.includes(r.stage));
  const shown = open.filter((r) => (who === "all" || r.coordinator === who || (who === "none" && !r.coordinator)) && (!onlyLate || isOverdue(r, now)));
  const overdue = open.filter((r) => isOverdue(r, now)).length;
  const missing = open.filter((r) => missingDocs(r).length).length;
  const today = data.referrals.filter((r) => now - r.createdAt < 24 * 3600e3).length;

  return (
    <>
      <div className="hs-app-head">
        <div>
          <h1>Intake board</h1>
          <p>Every open referral, from first contact to start of care.</p>
        </div>
        <Button href={`${BASE}/referrals/#refer`} variant="secondary" size="sm" lead="refer">Send a test referral</Button>
      </div>
      <div className="hs-kpis">
        <div className="hs-kpi"><b>{open.length}</b><span>Open referrals</span></div>
        <div className={`hs-kpi${overdue ? " is-alert" : ""}`}><b>{overdue}</b><span>Overdue</span></div>
        <div className="hs-kpi"><b>{missing}</b><span>Waiting on documents</span></div>
        <div className="hs-kpi"><b>{today}</b><span>Received in the last 24 h</span></div>
      </div>
      <div className="hs-filters" role="group" aria-label="Filter the board">
        {[["all", "Everyone"], ...COORDINATORS.map((c) => [c.id, c.name]), ["none", "Unassigned"]].map(([id, label]) => (
          <button key={id} type="button" className="hs-filter" aria-pressed={who === id} onClick={() => setWho(id)}>{label}</button>
        ))}
        <button type="button" className="hs-filter" aria-pressed={onlyLate} onClick={() => setOnlyLate(!onlyLate)}>Only overdue</button>
      </div>
      {shown.length === 0 && open.length > 0 && (
        <div className="hs-empty" role="status">
          <Icon name="search" size={28} />
          <div><b>No referrals match these filters</b><p>{onlyLate ? "Nothing is overdue for this coordinator." : "This coordinator has no open referrals."}</p></div>
          <button type="button" className="hs-btn hs-btn-secondary hs-btn-sm" onClick={() => { setWho("all"); setOnlyLate(false); }}>Clear filters</button>
        </div>
      )}
      <div className="hs-stage-tabs" role="tablist" aria-label="Stages" ref={tabsRef}>
        {STAGES.filter((s) => OPEN_STAGES.includes(s.id)).map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={activeStage === s.id} className="hs-stage-tab" onClick={() => toStage(s.id)}>
            {s.name} <span>{shown.filter((r) => r.stage === s.id).length}</span>
          </button>
        ))}
      </div>
      <div className="hs-board" ref={boardRef}>
        {STAGES.filter((s) => OPEN_STAGES.includes(s.id)).map((s) => {
          const cards = shown.filter((r) => r.stage === s.id).sort((a, b) => b.createdAt - a.createdAt);
          return (
            <section key={s.id} className="hs-col" data-stage={s.id} aria-labelledby={`col-${s.id}`}>
              <div className="hs-col-head"><h2 id={`col-${s.id}`}>{s.name}</h2><span>{cards.length}</span></div>
              <ul className="hs-col-list">
                {cards.length ? cards.map((r) => <li key={r.id}><Card r={r} now={now} state={arriving?.id === r.id ? arriving.state : null} named={travel} /></li>) : <li className="hs-col-empty"><Icon name="check" size={18} />Nothing here</li>}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="hs-hint hs-mt-16">Closed: {data.referrals.filter((r) => r.stage === "soc").length} started care, {data.referrals.filter((r) => r.stage === "declined").length} not accepted. See <Link href={`${BASE}/intake/reports/`}>Reports</Link>.</p>
      <ul className="hs-toasts" aria-live="polite">
        {toasts.map((t) => <li key={t.id} className="hs-toast"><Icon name={t.icon} size={20} />{t.text}</li>)}
      </ul>
    </>
  );
}
