"use client";
import { useEffect } from "react";
import Link from "next/link";
import { BASE, PARTNERS, PLANS, PRODUCTS, money, priceFor, recommend } from "./data";
import { useHydrated, useStored, write } from "./store";
import { Arrow, BigWordHead, Button, Pill, PillTray, ProductBox } from "./ui";
// Page-only styles (split out of viteo.css so the landing skips them).
import "@/app/pitch/viteo/css/plan.css";

// "Your plan": the recommended pack with a reason for every item, add /
// remove, a delivery-frequency picker, and a running price summary. Without
// quiz answers it shows a sample plan, so the page always has something to
// show. A partner's link (?pro=<id>, PARTNERS in data.js) loads the pack
// they suggest, with their reasons, a "Suggested by" banner and their
// first-box discount (applied at checkout).

const SAMPLE_ANSWERS = { name: "", goals: ["energy", "sleep"], diet: "vegetarian", sun: "rarely", sleep: "okay", activity: "moderate", time: "morning" };

export default function Plan() {
  const hydrated = useHydrated();
  const stored = useStored("cart");
  const answers = useStored("answers");
  // A partner's link: load their suggested pack (once per visit to the link).
  useEffect(() => {
    const pro = PARTNERS[new URLSearchParams(window.location.search).get("pro")];
    if (!pro) return;
    write("referral", { id: pro.id });
    write("cart", { items: pro.items, plan: "two", suggestedBy: pro.id });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
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
  const pro = PARTNERS[cart.suggestedBy];
  const extras = Object.values(PRODUCTS).filter((p) => !ids.includes(p.id));

  return (
    <section className="dl-plan">
      <div className="dl-wrap">
        <div className="dl-plan-head">
          <div>
            <BigWordHead word={sample ? "Sample plan" : "Your plan"}>
              <h1 className="dl-h2">{name ? `${name}'s daily pack` : pro ? "Your suggested pack" : sample ? "A sample daily pack" : "Your daily pack"}</h1>
            </BigWordHead>
            <p className="dl-section-lede">
              {pro
                ? `Suggested by ${pro.name}. Every item comes with ${pro.first}'s note, and you can change anything.`
                : sample
                ? "An example pack for a mostly-indoors vegetarian. Take the quiz to build yours."
                : `${cart.items.length} essentials, one ${answers?.time === "evening" ? "evening" : "morning"} pack. Every item says why it's here, and you can change anything.`}
            </p>
          </div>
          <Link className="dl-textlink" href={`${BASE}/quiz/`}>{sample ? "Take the quiz" : "Retake the quiz"}</Link>
        </div>

        <div className="dl-plan-grid">
          <div className="dl-plan-main">
            {pro && (
              <div className="dl-card dl-pro-suggested" role="note">
                <span className="dl-pro-avatar" aria-hidden="true">{pro.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}</span>
                <div>
                  <p className="dl-pro-suggested-by">Suggested by <strong>{pro.name}</strong> · {pro.role}</p>
                  <p className="dl-meta">&ldquo;{pro.note}&rdquo;</p>
                  <p className="dl-meta"><strong>{Math.round(pro.discount * 100)}% off your first box</strong> with {pro.first}&apos;s link, applied at checkout. <span className="dl-code" data-lot="Lot 05">Sample data</span></p>
                </div>
              </div>
            )}
            <div className="dl-card dl-panel dl-panel-1 dl-plan-tray">
              {/* The pack, printed for you. */}
              <div className="dl-product dl-product-xs" aria-hidden="true">
                <ProductBox name={answers?.time === "evening" ? "Evening pack" : "Morning pack"} owner={name || undefined} />
              </div>
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
                      <p className="dl-why"><span className="dl-why-label">{pro && item.why.startsWith(`${pro.first}'s note`) ? `${pro.first}'s note` : "Why it's here"}</span> {pro ? item.why.replace(`${pro.first}'s note: `, "") : item.why}</p>
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
              supplement, especially if you&apos;re pregnant, nursing or taking medication.
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
