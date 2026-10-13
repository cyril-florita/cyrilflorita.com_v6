"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE, PLANS, PRODUCTS, money, priceFor } from "./data";
import { useHydrated, useStored, write } from "./store";
import { Arrow, BigWordHead, Button, Pill, PillTray } from "./ui";
import AccountTabs from "./AccountTabs";
import RoutineGraph from "./RoutineGraph";
import CancelFlow from "./CancelFlow";

// The subscriber's account: next delivery (skip with undo, pause, resume),
// the pack (remove / add, applied to the next box), delivery frequency,
// address (edited in a modal), a daily check-in streak with reminder
// settings, the routine tracker (days the pack was taken, month by month)
// and the upcoming schedule. Without a placed order it runs on a demo subscription, and the
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
  const session = useStored("session");
  const [toast, setToast] = useState(null); // { text, undo }
  const [pausing, setPausing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [draft, setDraft] = useState(null);
  const toastTimer = useRef(null);
  const addressDialog = useRef(null);
  const editButton = useRef(null);
  const [demo] = useState(() => (typeof window === "undefined" ? null : demoOrder()));
  const [now] = useState(() => Date.now());

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // The address editor is a modal: open and close the native dialog in step
  // with state (Esc, the backdrop and Cancel close it; focus returns to Edit).
  useEffect(() => {
    const d = addressDialog.current;
    if (!d) return;
    if (editing && !d.open) d.showModal();
    if (!editing && d.open) d.close();
  }, [editing]);

  if (!hydrated) return <section className="dl-account dl-wrap" aria-busy="true" />;

  // Signed out (sign-in is simulated, SignIn.js): a gate with both ways in.
  if (!session) {
    return (
      <section className="dl-account">
        <div className="dl-wrap">
          <div className="dl-card dl-panel dl-panel-1 dl-signin-card dl-account-gate">
            <BigWordHead word="Account">
              <h1 className="dl-h2">Sign in to manage your deliveries.</h1>
            </BigWordHead>
            <p className="dl-section-lede">Skip, pause or change your pack, check off today&apos;s pack and see your routine.</p>
            <div className="dl-hero-actions">
              <Button href={`${BASE}/sign-in/?next=account`} size="lg">Sign in <Arrow /></Button>
              <Button
                variant="ghost"
                onClick={() => write("session", { email: (stored?.address?.email) || "victoria@example.com", name: stored?.name || "Victoria", method: "sample", since: new Date().toISOString() })}
              >
                Explore the sample account
              </Button>
            </div>
            <p className="dl-meta dl-signin-note">
              <span className="dl-code" data-lot="Lot 07">Preview</span> Sign-in is simulated: nothing is sent anywhere.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const order = stored || demo || demoOrder();
  const items = order.cart.items;
  const ids = items.map((i) => i.id);
  const plan = PLANS.find((p) => p.id === order.plan) || PLANS[0];
  const price = priceFor(items, order.plan);
  const checkins = order.checkins || [];
  const today = dayKey(now);
  const tookToday = checkins.includes(today);

  const save = (patch) => write("order", { ...order, ...patch });
  const signOut = () => write("session", null);

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

  // Cancelling (CancelFlow.js) and coming back.
  const cancelSubscription = () => {
    const before = order;
    save({ cancelled: new Date(clock()).toISOString(), paused: null });
    notify("Subscription cancelled. No more boxes will ship.", () => write("order", before));
  };
  const restart = () => {
    const next = new Date(clock() + 3 * DAY).toISOString();
    save({ cancelled: null, paused: null, next });
    notify(`Welcome back. Your first box ships ${fmt(next)}.`);
  };
  const switchToThreeMonths = () => {
    const before = order;
    save({ plan: "three", cart: { ...order.cart, plan: "three" } });
    notify("Switched to a delivery every 3 months.", () => write("order", before));
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
  // Timeline: today → about three months out (further when paused longer).
  const span = Math.max(95, daysAway + 12);
  const ticks = Array.from({ length: Math.floor(span / 30) + 1 }, (_, i) => ({
    at: (i * 30) / span,
    label: i === 0 ? "Today" : new Date(now + i * 30 * DAY).toLocaleDateString("en-US", { month: "short" }),
  }));
  const upcoming = [0, 1, 2].map((n) => addMonths(order.next, n * plan.months));

  // Routine tracker: days the pack was taken in each of the last six months.
  // This month comes from the check-ins; in preview mode the earlier months
  // are sample history (a real account would have its own).
  const SAMPLE_HISTORY = [19, 22, 21, 25, 26];
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now);
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return { key: dayKey(d).slice(0, 7), label: d.toLocaleDateString("en-US", { month: "short" }) };
  });
  const taken = months.map((m, i) =>
    order.demo && i < 5 ? SAMPLE_HISTORY[i] : checkins.filter((k) => k.startsWith(m.key)).length,
  );
  const thisMonth = taken[5];
  const hour = new Date(now).getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const extras = Object.values(PRODUCTS).filter((p) => !ids.includes(p.id));

  return (
    <section className="dl-account">
      <div className="dl-wrap">
        <div className="dl-plan-head">
          <div>
            <BigWordHead word={order.demo ? "Account" : "Your account"}>
              <h1 className="dl-h2">{greeting}{order.name ? `, ${order.name}` : ""}.</h1>
            </BigWordHead>
          </div>
          {order.demo
            ? <p className="dl-meta">Signed in as {session.email}. <Link className="dl-textlink" href={`${BASE}/quiz/`}>Retake the quiz</Link> · <button type="button" className="dl-textlink" onClick={signOut}>Sign out</button></p>
            : <p className="dl-meta">Order {order.id} · Signed in as {session.email} · <button type="button" className="dl-textlink" onClick={signOut}>Sign out</button></p>}
        </div>

        <div className="dl-account-grid">
          {/* Next delivery */}
          <div id="acc-next" className={`dl-card dl-panel dl-panel-1 dl-next ${order.paused || order.cancelled ? "is-paused" : ""}`}>
            {order.cancelled ? (
              <>
                <p className="dl-eyebrow">Cancelled</p>
                <h2 className="dl-display dl-next-date">No boxes scheduled</h2>
                <p className="dl-meta">You cancelled on {fmt(order.cancelled)}. Your pack and routine history are kept.</p>
                <div className="dl-next-actions">
                  <Button onClick={restart}>Restart subscription</Button>
                </div>
              </>
            ) : (
            <>
            <p className="dl-eyebrow">{order.paused ? "Paused" : "Next delivery"}</p>
            <h2 className="dl-display dl-next-date">{fmt(order.next)}</h2>
            <p className="dl-meta">
              {order.paused ? `Deliveries resume ${fmt(order.paused)}.` : `${daysAway} ${daysAway === 1 ? "day" : "days"} away · ${money(price.total)} · ${plan.label.toLowerCase()}`}
            </p>
            {/* The box on its way: a labelled marker (not a handle: the date is
                changed with Skip and Pause), which slides along when it moves. */}
            <div className="dl-timeline" aria-hidden="true">
              <span className="dl-timeline-track" />
              {ticks.map((t) => (
                <span key={t.label} className="dl-timeline-tick" style={{ "--at": t.at }}>{t.label}</span>
              ))}
              <span className="dl-timeline-pin" style={{ "--at": daysAway / span }}>
                <span className="dl-timeline-flag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" /></svg>
                  {new Date(order.next).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </span>
            </div>
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
            </>
            )}
          </div>

          {/* Check-in */}
          <div id="acc-checkin" className="dl-card dl-panel dl-panel-3 dl-checkin">
            <p className="dl-eyebrow">Daily check-in</p>
            <h2 className="dl-h3">{streak > 0 ? `${streak}-day streak` : "Start a streak"}</h2>
            <ol className="dl-week" aria-label="This week">
              {/* A pill organizer: each day's compartment gets a pill once taken. */}
              {week.map((d, i) => (
                <li key={d.key} className={`${checkins.includes(d.key) ? "is-done" : ""} ${d.today ? "is-today" : ""}`}>
                  <span className="dl-sr">{d.key}{checkins.includes(d.key) ? ": taken" : ""}</span>
                  <span className="dl-week-lid" aria-hidden="true">{d.label}</span>
                  {checkins.includes(d.key) && (
                    <span className="dl-week-pill" aria-hidden="true">
                      <Pill id={ids[i % ids.length]} size="sm" tilt={-30 + ((i * 23) % 50)} />
                    </span>
                  )}
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

          {/* Routine tracker */}
          <div id="acc-tracker" className="dl-card dl-panel dl-panel-dark dl-tracker">
            <div className="dl-bento-card-top">
              <h2 className="dl-pill-label">Your routine tracker</h2>
              <span className="dl-meta">{thisMonth} {thisMonth === 1 ? "day" : "days"} this month</span>
            </div>
            <RoutineGraph
              labels={months.map((m) => m.label)}
              main={taken}
              max={31}
              width={760}
              openEnd
              tip={`${thisMonth} so far`}
              ariaLabel={`Days you took your pack, ${months[0].label} to ${months[5].label}: ${taken.join(", ")}`}
              legend={[{ label: "Days you took your pack", color: "var(--dl-dark-accent)" }]}
            />
            {order.demo && (
              <p className="dl-meta">
                <span className="dl-code" data-lot="Lot 03">Sample history</span> Earlier months are examples in preview
                mode; this month counts your check-ins.
              </p>
            )}
          </div>

          {/* Frequency + schedule */}
          <div id="acc-settings" className="dl-card dl-panel dl-panel-2">
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
            {order.cancelled ? (
              <p className="dl-meta">No deliveries scheduled.</p>
            ) : (
              <ol className="dl-schedule">
                {upcoming.map((d, i) => (
                  <li key={d}><span className="dl-schedule-dot" aria-hidden="true" />{fmt(d)}{i === 0 && !order.paused && <span className="dl-tag dl-tag-sun">Next</span>}</li>
                ))}
              </ol>
            )}
            {!order.cancelled && (
              <button type="button" className="dl-textlink dl-cancel-link" aria-haspopup="dialog" onClick={() => setCancelling(true)}>
                Cancel subscription
              </button>
            )}
          </div>

          {/* Pack */}
          <div id="acc-pack" className="dl-card dl-account-pack">
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

          {/* Address (edited in a modal) */}
          <div className="dl-card dl-account-address">
            <div className="dl-card-head">
              <h2 className="dl-h3">Delivery address</h2>
              <button
                ref={editButton}
                type="button"
                className="dl-textlink"
                aria-haspopup="dialog"
                onClick={() => { setDraft(order.address); setEditing(true); }}
              >
                Edit
              </button>
            </div>
            <address className="dl-address">
              {order.address.name}<br />
              {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
              {order.address.city}, {order.address.state} {order.address.zip}
            </address>
          </div>
        </div>

        <p className="dl-meta dl-fine">
          Preview mode: changes are saved in this browser.{" "}
          <button type="button" className="dl-textlink" onClick={() => { write("order", null); write("session", null); notify("Preview reset."); }}>Reset</button>
        </p>
      </div>

      <dialog
        ref={addressDialog}
        className="dl-modal"
        aria-labelledby="dl-address-title"
        onClose={() => { setEditing(false); editButton.current?.focus({ preventScroll: true }); }}
        onClick={(e) => e.target === e.currentTarget && setEditing(false)}
      >
        {editing && draft && (
          <form
            className="dl-modal-body"
            onSubmit={(e) => {
              e.preventDefault();
              save({ address: draft });
              setEditing(false);
              notify("Address updated for your next box.");
            }}
          >
            <h2 id="dl-address-title" className="dl-h3">Edit delivery address</h2>
            <p className="dl-meta">Changes apply from your next box.</p>
            <div className="dl-form-grid">
              {[["name", "Full name", "name"], ["line1", "Street address", "address-line1"], ["city", "City", "address-level2"], ["state", "State", "address-level1"], ["zip", "ZIP code", "postal-code"]].map(([k, l, ac], i) => (
                <label key={k} className={`dl-field ${["name", "line1"].includes(k) ? "dl-field-wide" : ""}`}>
                  <span>{l}</span>
                  <input value={draft[k] || ""} autoComplete={ac} autoFocus={i === 0} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} required />
                </label>
              ))}
            </div>
            <div className="dl-modal-actions">
              <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <button type="submit" className="dl-btn dl-btn-primary">Save address</button>
            </div>
            <button type="button" className="dl-ing-close dl-modal-close" onClick={() => setEditing(false)} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </form>
        )}
      </dialog>

      <CancelFlow
        open={cancelling}
        onClose={() => setCancelling(false)}
        order={order}
        nextDate={fmt(order.next)}
        threePrice={priceFor(items, "three").total}
        onSkip={skip}
        onPause={pause}
        onThreeMonths={switchToThreeMonths}
        onCancel={cancelSubscription}
      />

      <AccountTabs />
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

