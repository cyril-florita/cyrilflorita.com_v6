"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BASE, PRODUCTS, money, priceFor, recommend } from "./data";
import { useHydrated, useStored, write } from "./store";
import { Arrow, BigWordHead, Button, PillTray, ProductBox } from "./ui";

// Checkout in four steps (Details, Delivery, Payment, Review), then a
// confirmation. It's a prototype: there are no card fields and nothing is
// charged — the payment step is a clearly labelled demo. The order is saved
// to localStorage so the account page can show it.

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
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", line1: "", line2: "", city: "", state: "", zip: "" });
  const [errors, setErrors] = useState({});
  const [start, setStart] = useState(null);
  const [placed, setPlaced] = useState(null);
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
          <p className="dl-section-lede">Take the two-minute quiz to build one, or start from the sample plan.</p>
          <div className="dl-hero-actions">
            <Button href={`${BASE}/quiz/`}>Take the quiz <Arrow /></Button>
            <Button
              variant="ghost"
              onClick={() => write("cart", { items: recommend({ diet: "vegetarian", sun: "rarely", goals: ["energy"] }), plan: "two" })}
            >
              Use the sample plan
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const cart = stored || placed.cart;
  const price = priceFor(cart.items, cart.plan);
  const dates = startDates();
  const startDate = start ? new Date(start) : dates[0];

  const setField = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Add the name for the delivery.";
    if (!EMAIL.test(form.email.trim())) e.email = "That email doesn't look right.";
    if (!form.line1.trim()) e.line1 = "Add a street address.";
    if (!form.city.trim()) e.city = "Add a city.";
    if (!form.state.trim()) e.state = "Add a state.";
    if (!/^\d{5}$/.test(form.zip.trim())) e.zip = "Use a 5-digit ZIP code.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && !validate()) return;
    setStep((s) => s + 1);
  };

  const place = () => {
    const order = {
      id: orderId(),
      cart,
      name: answers?.name?.trim() || form.name.trim().split(" ")[0],
      address: form,
      start: startDate.toISOString(),
      next: startDate.toISOString(),
      plan: cart.plan,
      paused: null,
      created: new Date().toISOString(),
      time: answers?.time || "morning",
    };
    write("order", order);
    write("cart", null);
    setPlaced(order);
  };

  if (placed) {
    return (
      <section className="dl-checkout">
        <div className="dl-wrap dl-confirm dl-panel dl-panel-1">
          {/* The box that's on its way, in place of a generic success badge. */}
          <div className="dl-product dl-product-sm" aria-hidden="true">
            <ProductBox name={placed.time === "evening" ? "Evening pack" : "Morning pack"} />
          </div>
          <BigWordHead word="Confirmed">
            <h1 className="dl-h2" tabIndex={-1} ref={headingRef}>You&apos;re all set{placed.name ? `, ${placed.name}` : ""}.</h1>
          </BigWordHead>
          <p className="dl-section-lede">
            Order {placed.id} (demo). Your first box would arrive {fmt(new Date(placed.start))}. Nothing was charged — this is a design prototype.
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
                  <Field label="Full name" error={errors.name} wide><input value={form.name} onChange={setField("name")} autoComplete="name" /></Field>
                  <Field label="Email" error={errors.email} wide><input type="email" value={form.email} onChange={setField("email")} autoComplete="email" /></Field>
                  <Field label="Street address" error={errors.line1} wide><input value={form.line1} onChange={setField("line1")} autoComplete="address-line1" /></Field>
                  <Field label="Apartment, suite (optional)" wide><input value={form.line2} onChange={setField("line2")} autoComplete="address-line2" /></Field>
                  <Field label="City" error={errors.city}><input value={form.city} onChange={setField("city")} autoComplete="address-level2" /></Field>
                  <Field label="State" error={errors.state}><input value={form.state} onChange={setField("state")} autoComplete="address-level1" maxLength={20} /></Field>
                  <Field label="ZIP code" error={errors.zip}><input inputMode="numeric" value={form.zip} onChange={setField("zip")} autoComplete="postal-code" maxLength={5} /></Field>
                </div>
                <p className="dl-meta">Prototype only: what you type stays in this browser and is never sent anywhere.</p>
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
              <div>
                <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>Payment</h1>
                <div className="dl-demo-pay">
                  <span className="dl-code" data-lot="Lot 00">Demo</span>
                  <h2 className="dl-h3">This prototype doesn&apos;t take payments.</h2>
                  <p>
                    In a real store, a secure payment form from a provider like Stripe would sit here. To keep this
                    concept safe, there are no card fields at all.
                  </p>
                </div>
                <div className="dl-quiz-nav">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={next}>Use demo payment <Arrow /></Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>Review your order</h1>
                <dl className="dl-review-list">
                  <div><dt>Ship to</dt><dd>{form.name}<br />{form.line1}{form.line2 ? `, ${form.line2}` : ""}<br />{form.city}, {form.state} {form.zip}</dd><button type="button" className="dl-textlink" onClick={() => setStep(0)}>Edit</button></div>
                  <div><dt>First box</dt><dd>{fmt(startDate)}, then every {price.plan.months === 1 ? "month" : `${price.plan.months} months`}</dd><button type="button" className="dl-textlink" onClick={() => setStep(1)}>Edit</button></div>
                  <div><dt>Payment</dt><dd>Demo — nothing is charged</dd></div>
                </dl>
                <div className="dl-quiz-nav">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={place} size="lg">Place demo order <Arrow /></Button>
                </div>
              </div>
            )}
          </div>

          <aside className="dl-card dl-panel dl-panel-2 dl-summary" aria-label="Order summary">
            <h2 className="dl-h3">Your pack</h2>
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
            </dl>
            <Link className="dl-textlink" href={`${BASE}/plan/`}>Edit pack</Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
