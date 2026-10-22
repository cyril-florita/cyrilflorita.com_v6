"use client";
import { useSyncExternalStore } from "react";
import { coordinator, DOCS, missingDocs, route, seedReferrals, sourceName, stageName } from "./intake-data";

// The intake system's data, kept in this browser only (localStorage
// `hs-intake`) and shared by the public referral form, the status tracker and
// the staff app. Starts from the sample referrals; "Reset sample data" in the
// app restores them. Nothing is sent anywhere.

const KEY = "hs-intake";
const listeners = new Set();
let state = null;

const load = () => {
  if (state) return state;
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.v === 1) return (state = saved);
  } catch {}
  return (state = { v: 1, referrals: seedReferrals(), done: [] });
};
const save = (next) => {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  listeners.forEach((l) => l());
};
const subscribe = (l) => {
  listeners.add(l);
  const onStorage = (e) => { if (e.key === KEY) { state = null; load(); l(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
};

export function useIntake() {
  return useSyncExternalStore(subscribe, load, () => null);
}

const update = (id, fn) => {
  const s = load();
  save({ ...s, referrals: s.referrals.map((r) => (r.id === id ? fn({ ...r, history: [...r.history] }) : r)) });
};
const log = (r, text, who = "System", at = Date.now()) => { r.history.push({ at, text, who }); return r; };
const actor = (r) => coordinator(r.coordinator)?.name ?? "Intake team";

// A new referral from the public form. It lands in "New"; assign() routes it
// (the board does that a beat later, so you can watch it happen).
export function submitReferral({ patient, source, contact, services, payer, docs }) {
  const s = load();
  const n = Math.max(...s.referrals.map((r) => +r.id.slice(3))) + 1;
  const now = Date.now();
  const r = {
    id: `HS-${n}`, patient, source, contact, services, payer, docs,
    stage: "new", coordinator: null, createdAt: now, stageAt: now,
    nextAction: "Assign and make first call", due: now + 2 * 3600e3, arriving: true,
    history: [{ at: now, text: `Referral received from ${sourceName(source)} through the secure form`, who: "System" }],
  };
  save({ ...s, referrals: [r, ...s.referrals] });
  return r.id;
}

export function assign(id) {
  update(id, (r) => {
    const rt = route(r.patient.zip);
    if (!rt) return log(r, "No routing rule matched: left for the intake lead");
    const now = Date.now();
    r.coordinator = rt.coordinator;
    r.stage = "assigned";
    r.stageAt = now;
    r.arriving = false;
    r.nextAction = "First call to patient or family";
    r.due = now + 2 * 3600e3;
    log(r, `Assigned to ${coordinator(rt.coordinator).name} (${rt.rule})`);
    log(r, "Task created: first call, due within 2 hours");
    const miss = missingDocs(r);
    if (miss.length) log(r, `Flagged missing: ${miss.map((d) => d.name).join(", ")}`);
    return r;
  });
}

export function logCall(id, reached) {
  update(id, (r) => {
    const now = Date.now();
    if (reached) {
      r.stage = "screening"; r.stageAt = now;
      r.nextAction = missingDocs(r).length ? "Request missing documents" : "Review coverage";
      r.due = now + 24 * 3600e3;
      return log(r, "Reached the patient's family; screening started", actor(r));
    }
    if (r.stage !== "contacted") { r.stage = "contacted"; r.stageAt = now; }
    r.nextAction = "Try again"; r.due = now + 4 * 3600e3;
    return log(r, "Call attempt: no answer, left a voicemail", actor(r));
  });
}

export function receiveDoc(id, doc) {
  update(id, (r) => {
    if (r.docs.includes(doc)) return r;
    r.docs = [...r.docs, doc];
    log(r, `Received: ${DOCS.find((d) => d.id === doc).name}`, actor(r));
    if (!missingDocs(r).length && ["screening", "contacted"].includes(r.stage)) {
      r.stage = "review"; r.stageAt = Date.now(); r.nextAction = "Verify coverage and accept";
      log(r, "All required documents in: moved to coverage review");
    }
    return r;
  });
}

export function accept(id) {
  update(id, (r) => {
    const now = Date.now();
    r.stage = "accepted"; r.stageAt = now;
    r.nextAction = "First visit scheduled"; r.due = now + 48 * 3600e3;
    return log(r, "Accepted. Referrer notified through the status link.", actor(r));
  });
}

export function decline(id, reason) {
  update(id, (r) => {
    r.stage = "declined"; r.stageAt = Date.now(); r.declineReason = reason; r.due = null;
    r.nextAction = "Closed";
    return log(r, `Not accepted: ${reason}. Referrer notified.`, actor(r));
  });
}

export function startOfCare(id) {
  update(id, (r) => {
    const now = Date.now();
    r.stage = "soc"; r.stageAt = now; r.socAt = now; r.due = null;
    r.nextAction = "Visits follow the plan of care";
    return log(r, "Start of care completed", actor(r));
  });
}

export function toggleTask(key) {
  const s = load();
  save({ ...s, done: s.done.includes(key) ? s.done.filter((k) => k !== key) : [...s.done, key] });
}

export function resetSample() {
  save({ v: 1, referrals: seedReferrals(), done: [] });
}

// The referrer's view: progress only, no clinical details.
export const STATUS_STEPS = ["Received", "Under review", "Accepted", "Start of care"];
export const statusStep = (r) => ({ new: 0, assigned: 1, contacted: 1, screening: 1, review: 1, accepted: 2, soc: 3, declined: -1 })[r.stage];
export { stageName };
