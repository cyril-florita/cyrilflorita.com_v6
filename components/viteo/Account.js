"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE, PLANS, PRODUCTS, money, priceFor } from "./data";
import { useHydrated, useStored, write } from "./store";
import { BigWordHead, Button, Pill, PillTray } from "./ui";

// The subscriber's account: next delivery (skip with undo, pause, resume),
// the pack (remove / add, applied to the next box), delivery frequency,
// address, a daily check-in streak with reminder settings, and the upcoming
// schedule. Without a placed order it runs on a demo subscription, and the
// first change saves it — so every control can be tried.

const DAY = 86400000;
// Event handlers read the clock through this (render code uses the `now`
// captured once on mount, so a render never depends on the time).
const clock = () => Date.now();
const fmt = (d) => new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const addMonths = (iso, n) => {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + n);
  return d.toISOString();
};
const dayKey = (d) => new Date(d).toISOString().slice(0, 10);

const demoOrder = () => {
  const next = new Date(Date.now() + 9 * DAY);
  next.setHours(12, 0, 0, 0);
  return {
    id: "VT-204816",
    demo: true,
    cart: {
      items: [
        { id: "d3", why: "You spend most of the day indoors." },
        { id: "b12", why: "You eat mostly or fully plant-based." },
        { id: "omega", why: "Fish isn't part of your diet." },
        { id: "magnesium", why: "You'd like help winding down." },
      ],
      plan: "two",
    },
    name: "Victoria",
    address: { name: "Victoria Rivera", line1: "1200 Sunset Ave", line2: "", city: "Santa Clarita", state: "CA", zip: "91350" },
    next: next.toISOString(),
    paused: null,
    plan: "two",
    time: "morning",
    reminders: true,
    checkins: [1, 2, 3].map((n) => dayKey(Date.now() - n * DAY)),
  };
};

export default function Account() {
  const hydrated = useHydrated();
  const stored = useStored("order");
  const [toast, setToast] = useState(null); // { text, undo }
  const [pausing, setPausing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const toastTimer = useRef(null);
  const [demo] = useState(() => (typeof window === "undefined" ? null : demoOrder()));
  const [now] = useState(() => Date.now());

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  if (!hydrated) return <section className="dl-account dl-wrap" aria-busy="true" />;

  const order = stored || demo || demoOrder();
  const items = order.cart.items;
  const ids = items.map((i) => i.id);
  const plan = PLANS.find((p) => p.id === order.plan) || PLANS[0];
  const price = priceFor(items, order.plan);
  const checkins = order.checkins || [];
  const today = dayKey(now);
  const tookToday = checkins.includes(today);

  const save = (patch) => write("order", { ...order, ...patch });

  const notify = (text, undo) => {
    clearTimeout(toastTimer.current);
    setToast({ text, undo });
    toastTimer.current = setTimeout(() => setToast(null), 6000);
  };

  const skip = () => {
    const before = order;
    const next = addMonths(order.next, plan.months);
    save({ next });
    notify(`Skipped. Your next box is now ${fmt(next)}.`, () => write("order", before));
  };

  const pause = (months) => {
    const before = order;
    const until = addMonths(new Date(clock()).toISOString(), months);
    save({ paused: until, next: until });
    setPausing(false);
    notify(`Paused until ${fmt(until)}.`, () => write("order", before));
  };

  const resume = () => {
    const next = new Date(clock() + 3 * DAY).toISOString();
    save({ paused: null, next });
    notify(`Welcome back. Your next box ships ${fmt(next)}.`);
  };

  const removeItem = (id) => {
    if (items.length <= 1) return;
    const before = order;
    save({ cart: { ...order.cart, items: items.filter((i) => i.id !== id) } });
    notify(`${PRODUCTS[id].name} removed from your next box.`, () => write("order", before));
  };

  const addItem = (id) => {
    save({ cart: { ...order.cart, items: [...items, { id, why: "You added this yourself." }] } });
    notify(`${PRODUCTS[id].name} added to your next box.`);
  };

  const checkIn = () => {
    if (tookToday) save({ checkins: checkins.filter((d) => d !== today) });
    else save({ checkins: [...checkins, today] });
  };

  // Streak: consecutive days up to today (or yesterday, if today isn't in yet).
  let streak = 0;
  for (let i = tookToday ? 0 : 1; checkins.includes(dayKey(now - i * DAY)); i++) streak++;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * DAY);
    return { key: dayKey(d), label: d.toLocaleDateString("en-US", { weekday: "narrow" }), today: i === 6 };
  });

  const daysAway = Math.max(0, Math.round((new Date(order.next) - now) / DAY));
  const upcoming = [0, 1, 2].map((n) => addMonths(order.next, n * plan.months));
  const hour = new Date(now).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const extras = Object.values(PRODUCTS).filter((p) => !ids.includes(p.id));

  return (
    <section className="dl-account">
      <div className="dl-wrap">
        <div className="dl-plan-head">
          <div>
            <BigWordHead word={order.demo ? "Demo account" : "Your account"}>
              <h1 className="dl-h2">{greeting}{order.name ? `, ${order.name}` : ""}.</h1>
            </BigWordHead>
          </div>
          {order.demo
            ? <p className="dl-meta">Every control works — try skipping or pausing. <Link className="dl-textlink" href={`${BASE}/quiz/`}>Or build your own pack</Link></p>
            : <p className="dl-meta">Order {order.id}</p>}
        </div>

        <div className="dl-account-grid">
          {/* Next delivery */}
          <div className={`dl-card dl-panel dl-panel-1 dl-next ${order.paused ? "is-paused" : ""}`}>
            <p className="dl-eyebrow">{order.paused ? "Paused" : "Next delivery"}</p>
            <h2 className="dl-display dl-next-date">{fmt(order.next)}</h2>
            <p className="dl-meta">
              {order.paused ? `Deliveries resume ${fmt(order.paused)}.` : `${daysAway} ${daysAway === 1 ? "day" : "days"} away · ${money(price.total)} · ${plan.label.toLowerCase()}`}
            </p>
            <div className="dl-next-actions">
              {order.paused ? (
                <Button onClick={resume}>Resume deliveries</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={skip}>Skip this box</Button>
                  <Button variant="ghost" onClick={() => setPausing((v) => !v)} aria-expanded={pausing}>Pause</Button>
                </>
              )}
            </div>
            {pausing && !order.paused && (
              <div className="dl-pause" role="group" aria-label="Pause for">
                <span className="dl-meta">Pause for</span>
                {[1, 2, 3].map((m) => (
                  <button key={m} type="button" className="dl-chip" onClick={() => pause(m)}>{m} {m === 1 ? "month" : "months"}</button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in */}
          <div className="dl-card dl-panel dl-panel-3 dl-checkin">
            <p className="dl-eyebrow">Daily check-in</p>
            <h2 className="dl-h3">{streak > 0 ? `${streak}-day streak` : "Start a streak"}</h2>
            <ol className="dl-week" aria-label="This week">
              {week.map((d) => (
                <li key={d.key} className={`${checkins.includes(d.key) ? "is-done" : ""} ${d.today ? "is-today" : ""}`}>
                  <span className="dl-sr">{d.key}{checkins.includes(d.key) ? ": taken" : ""}</span>
                  <span aria-hidden="true">{d.label}</span>
                </li>
              ))}
            </ol>
            <Button variant={tookToday ? "secondary" : "primary"} onClick={checkIn} aria-pressed={tookToday}>
              {tookToday ? "Taken today ✓" : "I took today's pack"}
            </Button>
            <label className="dl-switch">
              <input type="checkbox" checked={order.reminders !== false} onChange={(e) => save({ reminders: e.target.checked })} />
              <span className="dl-switch-ui" aria-hidden="true" />
              Remind me {order.time === "evening" ? "at 6:30 PM" : "at 8:00 AM"}
            </label>
          </div>

          {/* Pack */}
          <div className="dl-card dl-account-pack">
            <div className="dl-card-head">
              <h2 className="dl-h3">Your pack</h2>
              <span className="dl-meta">Changes apply to your next box</span>
            </div>
            <PillTray ids={ids} label="Your pack" size="sm" />
            <ul className="dl-summary-items">
              {items.map((i) => (
                <li key={i.id}>
                  <span><Pill id={i.id} size="sm" tilt={-20} /> {PRODUCTS[i.id].name}</span>
                  <button type="button" className="dl-textlink" onClick={() => removeItem(i.id)} disabled={items.length <= 1} aria-label={`Remove ${PRODUCTS[i.id].name}`}>Remove</button>
                </li>
              ))}
            </ul>
            {extras.length > 0 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setAdding((v) => !v)} aria-expanded={adding}>{adding ? "Done" : "Add an item"}</Button>
                {adding && (
                  <ul className="dl-extras-inline">
                    {extras.map((p) => (
                      <li key={p.id}>
                        <button type="button" className="dl-chip" onClick={() => addItem(p.id)}>
                          <Pill id={p.id} size="sm" tilt={-20} /> {p.name} <span className="dl-meta">+{money(p.price)}/mo</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Frequency + schedule */}
          <div className="dl-card dl-panel dl-panel-2">
            <h2 className="dl-h3">Delivery frequency</h2>
            <div className="dl-segment" role="radiogroup" aria-label="Delivery frequency">
              {PLANS.map((pl) => (
                <button key={pl.id} type="button" role="radio" aria-checked={order.plan === pl.id} className={order.plan === pl.id ? "is-on" : ""} onClick={() => save({ plan: pl.id, cart: { ...order.cart, plan: pl.id } })}>
                  {pl.months === 1 ? "Monthly" : `${pl.months} months`}
                </button>
              ))}
            </div>
            <p className="dl-meta">{money(price.total)} per box{price.savings > 0 ? ` · you save ${money(price.savings)}` : ""}</p>
            <h3 className="dl-h4">Coming up</h3>
            <ol className="dl-schedule">
              {upcoming.map((d, i) => (
                <li key={d}><span className="dl-schedule-dot" aria-hidden="true" />{fmt(d)}{i === 0 && !order.paused && <span className="dl-tag dl-tag-sun">Next</span>}</li>
              ))}
            </ol>
          </div>

          {/* Address */}
          <div className="dl-card">
            <div className="dl-card-head">
              <h2 className="dl-h3">Delivery address</h2>
              {!editing && <button type="button" className="dl-textlink" onClick={() => { setDraft(order.address); setEditing(true); }}>Edit</button>}
            </div>
            {editing ? (
              <form
                className="dl-form-grid"
                onSubmit={(e) => {
                  e.preventDefault();
                  save({ address: draft });
                  setEditing(false);
                  notify("Address updated for your next box.");
                }}
              >
                {[["name", "Full name"], ["line1", "Street address"], ["city", "City"], ["state", "State"], ["zip", "ZIP code"]].map(([k, l]) => (
                  <label key={k} className={`dl-field ${["name", "line1"].includes(k) ? "dl-field-wide" : ""}`}>
                    <span>{l}</span>
                    <input value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} required />
                  </label>
                ))}
                <div className="dl-quiz-nav dl-field-wide">
                  <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  <button type="submit" className="dl-btn dl-btn-primary">Save address</button>
                </div>
              </form>
            ) : (
              <address className="dl-address">
                {order.address.name}<br />
                {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
                {order.address.city}, {order.address.state} {order.address.zip}
              </address>
            )}
          </div>
        </div>

        <p className="dl-meta dl-fine">
          Prototype: changes are saved in this browser only.{" "}
          <button type="button" className="dl-textlink" onClick={() => { write("order", null); notify("Demo account reset."); }}>Reset demo</button>
        </p>
      </div>

      <div className={`dl-toast ${toast ? "is-on" : ""}`} role="status" aria-live="polite">
        {toast && (
          <>
            <span>{toast.text}</span>
            {toast.undo && (
              <button type="button" onClick={() => { toast.undo(); setToast(null); }}>Undo</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

