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

// A saved referral the screens can render: a string id plus the fields they
// read without checks.
export const isReferral = (r) => !!r && typeof r === "object" && typeof r.id === "string" && typeof r.stage === "string"
  && !!r.patient && typeof r.patient === "object" && Array.isArray(r.history) && Array.isArray(r.docs) && Array.isArray(r.services);
// Saved state from localStorage, checked: anything not shaped like version 1
// (an edited or corrupt entry) gives null, and the caller starts from the
// seeds; malformed referrals are dropped.
export function parseSaved(saved) {
  if (saved?.v !== 1 || !Array.isArray(saved.referrals) || !Array.isArray(saved.done)) return null;
  return { ...saved, referrals: saved.referrals.filter(isReferral), done: saved.done.filter((k) => typeof k === "string") };
}
// The next reference number: one past the highest HS-<n> (the seeds' range
// when there are none).
export const SEED_BASE = 24816;
export function nextId(referrals) {
  const ns = referrals.map((r) => +String(r.id).slice(3)).filter(Number.isFinite);
  return `HS-${Math.max(SEED_BASE, ...ns) + 1}`;
}

const load = () => {
  if (state) return state;
  if (typeof window === "undefined") return null;
  try {
    const saved = parseSaved(JSON.parse(localStorage.getItem(KEY)));
    if (saved) return (state = saved);
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

// A new referral from the public form. It lands in "New" marked `arriving`;
// assign() routes it — the board a beat later, so you can watch it happen
// (?arrive=), or routePending() as soon as any other intake screen or the
// status page opens, so it's routed even if nobody watches.
export function submitReferral({ patient, source, contact, services, payer, docs }) {
  const s = load();
  const now = Date.now();
  const r = {
    id: nextId(s.referrals), patient, source, contact, services, payer, docs,
    stage: "new", coordinator: null, createdAt: now, stageAt: now,
    nextAction: "Assign and make first call", due: now + 2 * 3600e3, arriving: true,
    history: [{ at: now, text: `Referral received from ${sourceName(source)} through the secure form`, who: "System" }],
  };
  save({ ...s, referrals: [r, ...s.referrals] });
  return r.id;
}

export function assign(id) {
  update(id, (r) => {
    if (r.stage !== "new" || r.arriving === false) return r; // already routed or tried (the board's timer can land after routePending)
    r.arriving = false;
    const rt = route(r.patient.zip);
    if (!rt) return log(r, "No routing rule matched: left for the intake lead");
    const now = Date.now();
    r.coordinator = rt.coordinator;
    r.stage = "assigned";
    r.stageAt = now;
    r.nextAction = "First call to patient or family";
    r.due = now + 2 * 3600e3;
    log(r, `Assigned to ${coordinator(rt.coordinator).name} (${rt.rule})`);
    log(r, "Task created: first call, due within 2 hours");
    const miss = missingDocs(r);
    if (miss.length) log(r, `Flagged missing: ${miss.map((d) => d.name).join(", ")}`);
    return r;
  });
}

// Form referrals still waiting to be routed (`arriving`, still in New),
// except one the board is about to play (its ?arrive= id).
export const pendingRoutes = (referrals, except = null) =>
  referrals.filter((r) => r.arriving && r.stage === "new" && r.id !== except).map((r) => r.id);
export function routePending(except = null) {
  const s = load();
  if (s) pendingRoutes(s.referrals, except).forEach(assign);
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
