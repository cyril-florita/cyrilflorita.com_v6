"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE, PARTNERS, PRODUCTS, money, priceFor, recommend } from "./data";
import { useHydrated, useStored, write } from "./store";
import { PaymentStep } from "./Payment";
import { Arrow, BigWordHead, Button, PillTray, ProductBox } from "./ui";
// Page-only styles (split out of viteo.css so the landing skips them).
import "@/app/pitch/viteo/css/plan.css";
import "@/app/pitch/viteo/css/checkout.css";

// Checkout in four steps (Details, Delivery, Payment, Review), then a
// confirmation. The order is saved to localStorage so the account page can
// show it, and placing it signs you in (the account is created with it).
//
// Payment is simulated, and safe by construction: nobody can type a card.
// Two experiences: a wallet sheet (Apple Pay on Apple devices, Google Pay
// elsewhere) with a sample card, and a card form whose fields are read-only
// and filled with public test cards (Stripe's 4242… succeeds, 4000…0002 is
// declined, showing the error path). Nothing is charged or sent anywhere.

const STEPS = ["Details", "Delivery", "Payment", "Review"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Used only when an order is placed (an event, not a render).
const orderId = () => `VT-${Math.floor(100000 + Math.random() * 900000)}`;

const fmt = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// The next five weekdays, starting two days out.
const startDates = () => {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + 2);
  while (out.length < 5) {
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
};

const Field = ({ label, error, children, wide }) => (
  <label className={`dl-field ${wide ? "dl-field-wide" : ""} ${error ? "has-error" : ""}`}>
    <span>{label}</span>
    {children}
    {error && <span className="dl-error" role="alert">{error}</span>}
  </label>
);

export default function Checkout() {
  const hydrated = useHydrated();
  const stored = useStored("cart");
  const answers = useStored("answers");
  const session = useStored("session");
  const referral = useStored("referral");
  const [step, setStep] = useState(0);
  // name/email start null: until typed, they fall back to the signed-in account.
  const [form, setForm] = useState({ name: null, email: null, line1: "", line2: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState({});
  const [start, setStart] = useState(null);
  const [placed, setPlaced] = useState(null);
  const [payment, setPayment] = useState(null); // { method, label } once authorized
  const [placing, setPlacing] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step, placed]);


  if (!hydrated) return <section className="dl-checkout dl-wrap" aria-busy="true" />;

  if (!stored && !placed) {
    return (
      <section className="dl-checkout">
        <div className="dl-wrap dl-empty">
          <h1 className="dl-h2">Your pack is empty</h1>
          <p className="dl-section-lede">Take the two-minute quiz to build one, or start from an example pack.</p>
          <div className="dl-hero-actions">
            <Button href={`${BASE}/quiz/`}>Take the quiz <Arrow /></Button>
            <Button
              variant="ghost"
              onClick={() => write("cart", { items: recommend({ diet: "vegetarian", sun: "rarely", goals: ["energy"] }), plan: "two" })}
            >
              Start from an example
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const cart = stored || placed.cart;
  const fm = { ...form, name: form.name ?? session?.name ?? "", email: form.email ?? session?.email ?? "" };
  const price = priceFor(cart.items, cart.plan);
  const dates = startDates();
  const startDate = start ? new Date(start) : dates[0];

  const setField = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!fm.name.trim()) e.name = "Add the name for the delivery.";
    if (!EMAIL.test(fm.email.trim())) e.email = "That email doesn't look right.";
    if (!fm.line1.trim()) e.line1 = "Add a street address.";
    if (!fm.city.trim()) e.city = "Add a city.";
    if (!fm.state.trim()) e.state = "Add a state.";
    if (!/^\d{5}$/.test(fm.zip.trim())) e.zip = "Use a 5-digit ZIP code.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && !validate()) return;
    setStep((s) => s + 1);
  };

  const place = async () => {
    setPlacing(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    await new Promise((r) => setTimeout(r, reduce ? 150 : 1200));
    const order = {
      id: orderId(),
      cart,
      name: answers?.name?.trim() || fm.name.trim().split(" ")[0],
      address: fm,
      start: startDate.toISOString(),
      next: startDate.toISOString(),
      plan: cart.plan,
      paused: null,
      created: new Date().toISOString(),
      time: answers?.time || "morning",
      payment,
    };
    write("order", order);
    write("cart", null);
    // Placing an order creates the account and signs you in.
    write("session", { email: fm.email.trim(), name: order.name, method: "checkout", since: order.created });
    setPlacing(false);
    setPlaced(order);
  };

  if (placed) {
    return (
      <section className="dl-checkout">
        <div className="dl-wrap dl-confirm dl-panel dl-panel-1">
          {/* The box that's on its way, in place of a generic success badge. */}
          <div className="dl-product dl-product-sm" aria-hidden="true">
            <ProductBox name={placed.time === "evening" ? "Evening pack" : "Morning pack"} owner={placed.name || undefined} />
          </div>
          <BigWordHead word="Confirmed">
            <h1 className="dl-h2" tabIndex={-1} ref={headingRef}>You&apos;re all set{placed.name ? `, ${placed.name}` : ""}.</h1>
          </BigWordHead>
          <p className="dl-section-lede">
            Order {placed.id}. Your first box arrives {fmt(new Date(placed.start))}, and we&apos;ll email you when it ships. Preview mode: nothing was charged.
          </p>
          <PillTray ids={placed.cart.items.map((i) => i.id)} label="Your pack" />
          <div className="dl-hero-actions">
            <Button href={`${BASE}/account/`} size="lg">Go to your account <Arrow /></Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dl-checkout">
      <div className="dl-wrap">
        <ol className="dl-stepper" aria-label="Checkout steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? "is-current" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
              <span className="dl-stepper-n">{i < step ? "✓" : i + 1}</span> {s}
            </li>
          ))}
        </ol>

        <div className="dl-plan-grid">
          <div className="dl-card dl-checkout-main">
            {step === 0 && (
              <form onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>Where should we send it?</h1>
                <div className="dl-form-grid">
                  <Field label="Full name" error={errors.name} wide><input value={fm.name} onChange={setField("name")} autoComplete="name" /></Field>
                  <Field label="Email" error={errors.email} wide><input type="email" value={fm.email} onChange={setField("email")} autoComplete="email" /></Field>
                  <Field label="Street address" error={errors.line1} wide><input value={fm.line1} onChange={setField("line1")} autoComplete="address-line1" /></Field>
                  <Field label="Apartment, suite (optional)" wide><input value={fm.line2} onChange={setField("line2")} autoComplete="address-line2" /></Field>
                  <Field label="City" error={errors.city}><input value={fm.city} onChange={setField("city")} autoComplete="address-level2" /></Field>
                  <Field label="State" error={errors.state}><input value={fm.state} onChange={setField("state")} autoComplete="address-level1" maxLength={20} /></Field>
                  <Field label="ZIP code" error={errors.zip}><input inputMode="numeric" value={fm.zip} onChange={setField("zip")} autoComplete="postal-code" maxLength={5} /></Field>
                </div>
                {!session && <p className="dl-meta">Have an account? <Link className="dl-textlink" href={`${BASE}/sign-in/?next=checkout`}>Sign in</Link> to fill this in.</p>}
                <p className="dl-meta">Preview mode: your details stay in this browser and aren&apos;t sent anywhere.</p>
                <div className="dl-quiz-nav"><span /><button type="submit" className="dl-btn dl-btn-primary">Continue <Arrow /></button></div>
              </form>
            )}

            {step === 1 && (
              <div>
                <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>When should your first box arrive?</h1>
                <div className="dl-dates" role="radiogroup" aria-label="First delivery date">
                  {dates.map((d) => {
                    const on = startDate.toDateString() === d.toDateString();
                    return (
                      <button key={d.toISOString()} type="button" role="radio" aria-checked={on} className={`dl-date ${on ? "is-on" : ""}`} onClick={() => setStart(d.toISOString())}>
                        <span className="dl-meta">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <strong>{d.getDate()}</strong>
                        <span className="dl-meta">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="dl-section-lede">
                  After that, a new box every {price.plan.months === 1 ? "month" : `${price.plan.months} months`}.{" "}
                  <Link className="dl-textlink" href={`${BASE}/plan/`}>Change frequency</Link>
                </p>
                <div className="dl-quiz-nav">
                  <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
                  <Button onClick={next}>Continue <Arrow /></Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <PaymentStep
                headingRef={headingRef}
                total={price.total}
                zip={fm.zip}
                onBack={() => setStep(1)}
                onPaid={(p) => { setPayment(p); setStep(3); }}
              />
            )}

            {step === 3 && (
              <div>
                <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>Review your order</h1>
                <dl className="dl-review-list">
                  <div><dt>Ship to</dt><dd>{fm.name}<br />{fm.line1}{fm.line2 ? `, ${fm.line2}` : ""}<br />{fm.city}, {fm.state} {fm.zip}</dd><button type="button" className="dl-textlink" onClick={() => setStep(0)}>Edit</button></div>
                  <div><dt>First box</dt><dd>{fmt(startDate)}, then every {price.plan.months === 1 ? "month" : `${price.plan.months} months`}</dd><button type="button" className="dl-textlink" onClick={() => setStep(1)}>Edit</button></div>
                  <div><dt>Payment</dt><dd>{payment?.label || "Not added yet"}<br /><span className="dl-meta">Charged when your first box ships. Preview mode: nothing is charged.</span></dd><button type="button" className="dl-textlink" onClick={() => setStep(2)}>Edit</button></div>
                </dl>
                <div className="dl-quiz-nav">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={place} size="lg" disabled={placing || !payment} aria-busy={placing}>
                    {placing ? <><span className="dl-spin dl-spin-sm" aria-hidden="true" /> Placing order…</> : <>Place order <Arrow /></>}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside className="dl-card dl-panel dl-panel-2 dl-summary" aria-label="Order summary">
            <h2 className="dl-h3">Your pack</h2>
            <div className="dl-product dl-product-xs" aria-hidden="true">
              <ProductBox name={answers?.time === "evening" ? "Evening pack" : "Morning pack"} owner={answers?.name?.trim() || undefined} />
            </div>
            <PillTray ids={cart.items.map((i) => i.id)} label="Your pack" size="sm" />
            <ul className="dl-summary-items">
              {cart.items.map((i) => (
                <li key={i.id}><span>{PRODUCTS[i.id].name}</span><span className="dl-meta">{money(PRODUCTS[i.id].price)}/mo</span></li>
              ))}
            </ul>
            <dl className="dl-totals">
              <div><dt>{price.plan.label}</dt><dd>{money(price.subtotal)}</dd></div>
              {price.savings > 0 && <div className="dl-save"><dt>Saving</dt><dd>−{money(price.savings)}</dd></div>}
              <div><dt>Delivery</dt><dd>Free</dd></div>
              <div className="dl-total"><dt>Per box</dt><dd>{money(price.total)}</dd></div>
              {PARTNERS[referral?.id] && (() => {
                const pr = PARTNERS[referral.id];
                const off = Math.round(price.total * pr.discount * 100) / 100;
                return (
                  <>
                    <div className="dl-save"><dt>{pr.first}&apos;s code, first box ({Math.round(pr.discount * 100)}%)</dt><dd>−{money(off)}</dd></div>
                    <div className="dl-total"><dt>First box</dt><dd>{money(price.total - off)}</dd></div>
                  </>
                );
              })()}
            </dl>
            <Link className="dl-textlink" href={`${BASE}/plan/`}>Edit pack</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
