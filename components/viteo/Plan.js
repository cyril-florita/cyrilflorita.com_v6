"use client";
import Link from "next/link";
import { BASE, PLANS, PRODUCTS, money, priceFor, recommend } from "./data";
import { useHydrated, useStored, write } from "./store";
import { Arrow, BigWordHead, Button, Pill, PillTray } from "./ui";

// "Your plan": the recommended pack with a reason for every item, add /
// remove, a delivery-frequency picker, and a running price summary. Without
// quiz answers it shows a sample plan, so the page always has something to
// show.

const SAMPLE_ANSWERS = { name: "", goals: ["energy", "sleep"], diet: "vegetarian", sun: "rarely", sleep: "okay", activity: "moderate", time: "morning" };

export default function Plan() {
  const hydrated = useHydrated();
  const stored = useStored("cart");
  const answers = useStored("answers");
  const sample = !stored;
  const cart = stored || { items: recommend(SAMPLE_ANSWERS), plan: "two" };
  const ids = cart.items.map((i) => i.id);
  const price = priceFor(cart.items, cart.plan);
  const perDay = price.total / (price.plan.months * 30);

  const save = (next) => write("cart", { ...cart, ...next });
  const remove = (id) => cart.items.length > 1 && save({ items: cart.items.filter((i) => i.id !== id) });
  const add = (id) => save({ items: [...cart.items, { id, why: "You added this yourself." }] });

  if (!hydrated) return <section className="dl-plan dl-wrap" aria-busy="true" />;

  // The sample plan is nobody in particular, even if an old quiz left a name.
  const name = sample ? "" : answers?.name?.trim();
  const extras = Object.values(PRODUCTS).filter((p) => !ids.includes(p.id));

  return (
    <section className="dl-plan">
      <div className="dl-wrap">
        <div className="dl-plan-head">
          <div>
            <BigWordHead word={sample ? "Sample plan" : "Your plan"}>
              <h1 className="dl-h2">{name ? `${name}'s daily pack` : sample ? "A sample daily pack" : "Your daily pack"}</h1>
            </BigWordHead>
            <p className="dl-section-lede">
              {sample
                ? "This is an example for a mostly-indoors vegetarian. Take the quiz to get your own."
                : `${cart.items.length} essentials, one ${answers?.time === "evening" ? "evening" : "morning"} pack. Every item says why it's here, and you can change anything.`}
            </p>
          </div>
          <Link className="dl-textlink" href={`${BASE}/quiz/`}>{sample ? "Take the quiz" : "Retake the quiz"}</Link>
        </div>

        <div className="dl-plan-grid">
          <div className="dl-plan-main">
            <div className="dl-card dl-panel dl-panel-1 dl-plan-tray">
              <PillTray ids={ids} label="Your daily pack" />
              <span className="dl-meta">{ids.length} {ids.length === 1 ? "pill" : "pills"} a day · {answers?.time === "evening" ? "with dinner" : "with breakfast"}</span>
            </div>

            <ul className="dl-items" aria-label="In your pack">
              {cart.items.map((item) => {
                const p = PRODUCTS[item.id];
                return (
                  <li key={item.id} className="dl-card dl-item">
                    <span className="dl-item-pill"><Pill id={item.id} size="lg" tilt={-18} /></span>
                    <div className="dl-item-body">
                      <h3>{p.name} <span className="dl-meta">{p.dose}</span></h3>
                      <p className="dl-why"><span className="dl-why-label">Why it&apos;s here</span> {item.why}</p>
                    </div>
                    <div className="dl-item-side">
                      <span className="dl-price">{money(p.price)}<span className="dl-meta">/mo</span></span>
                      <button
                        type="button"
                        className="dl-textlink"
                        onClick={() => remove(item.id)}
                        disabled={cart.items.length <= 1}
                        aria-label={`Remove ${p.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {extras.length > 0 && (
              <div className="dl-extras">
                <h2 className="dl-h3">Add to your pack</h2>
                <ul>
                  {extras.map((p) => (
                    <li key={p.id}>
                      <button type="button" className="dl-chip" onClick={() => add(p.id)} aria-label={`Add ${p.name}`}>
                        <Pill id={p.id} size="sm" tilt={-20} /> {p.name} <span className="dl-meta">+{money(p.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="dl-note" role="note">
              <strong>Already taking something?</strong> Check with your doctor or pharmacist before starting any
              supplement, especially alongside medication. (In this concept, that&apos;s a real step in the flow.)
            </div>
          </div>

          <aside className="dl-card dl-panel dl-panel-3 dl-summary" aria-label="Plan summary">
            <h2 className="dl-h3">Delivery</h2>
            <div className="dl-plans" role="radiogroup" aria-label="Delivery frequency">
              {PLANS.map((pl) => {
                const p = priceFor(cart.items, pl.id);
                const on = cart.plan === pl.id;
                return (
                  <button
                    key={pl.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={`dl-plan-option ${on ? "is-on" : ""}`}
                    onClick={() => save({ plan: pl.id })}
                  >
                    <span>
                      {pl.label}
                      {pl.badge && <span className="dl-tag dl-tag-sun">{pl.badge}</span>}
                    </span>
                    <span className="dl-meta">{money(p.total)} per box · {pl.months * 30} days</span>
                  </button>
                );
              })}
            </div>

            <dl className="dl-totals">
              <div><dt>{cart.items.length} items × {price.plan.months} {price.plan.months === 1 ? "month" : "months"}</dt><dd>{money(price.subtotal)}</dd></div>
              {price.savings > 0 && <div className="dl-save"><dt>Multi-month saving</dt><dd>−{money(price.savings)}</dd></div>}
              <div><dt>Delivery</dt><dd>Free</dd></div>
              <div className="dl-total"><dt>Per box</dt><dd>{money(price.total)}</dd></div>
            </dl>
            <p className="dl-meta dl-perday">That&apos;s about {money(Math.round(perDay * 100) / 100)} a day.</p>
            <Button href={`${BASE}/checkout/`} size="lg" className="dl-btn-block" onClick={() => sample && write("cart", cart)}>
              Continue to checkout <Arrow />
            </Button>
            <p className="dl-meta dl-fine">Skip, pause or cancel anytime from your account.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
