"use client";

import { useEffect, useRef, useState } from "react";
import { priceBuild, money } from "@/components/kord/data";
import { useCart, clearCart } from "@/components/kord/cartStore";
import { describe, shipDate } from "@/components/kord/CartView";
import { Sample, Words } from "@/components/kord/ui";

// Checkout (/builds/kord/checkout/), a preview that can't take a real payment: sample delivery
// details in read-only fields, a fit call to book (or skip), and a card form whose fields are
// read-only and filled with a public test card. "Place order" shows a short busy state, then the
// confirmation — a sample order number and what happens next — and empties the cart.

const SAMPLE = { name: "Alex Rivera", email: "alex@example.com", address: "1220 Ocean Park Blvd, Santa Monica, CA 90405" };
const day = (n, h) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, 0, 0, 0); return d; };
const fmt = (d) => d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export default function Checkout() {
  const items = useCart();
  const [slots, setSlots] = useState([]);
  const [slot, setSlot] = useState("skip");
  const [stage, setStage] = useState("form");   // form | busy | done
  const [order, setOrder] = useState(null);
  const [said, setSaid] = useState("");
  const live = useRef(true), doneRef = useRef(null);
  useEffect(() => {
    live.current = true;   // (set again on mount: React's dev double mount runs the cleanup once first)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- times in the visitor's own time zone
    setSlots([fmt(day(2, 18)), fmt(day(3, 12)), fmt(day(5, 9))]);
    return () => { live.current = false; };
  }, []);
  useEffect(() => { if (stage === "done") doneRef.current?.focus(); }, [stage]);
  const total = items.reduce((s, x) => s + priceBuild(x), 0);

  const place = () => {
    if (stage !== "form") return;
    setStage("busy"); setSaid("Placing order…");
    setTimeout(() => {
      if (!live.current) return;
      setOrder({ n: `KD-${Math.floor(10000 + Math.random() * 89999)}`, items: items.map(describe), total, ship: shipDate(), fit: slot === "skip" ? null : slots[+slot] });
      clearCart(); setStage("done"); setSaid("Order placed.");
    }, 1400);
  };

  if (stage === "done" && order) return (
    <div className="cd-done">
      <h1 ref={doneRef} tabIndex={-1} className="cd-h2">Thanks, {SAMPLE.name.split(" ")[0]}. Your Kord® is on the build list.</h1>
      <p className="cd-subhead">Order {order.n} <Sample>Sample order</Sample></p>
      <ol className="cd-done-steps">
        <li><span>01</span><strong>Built to order</strong><em>Starting today: {order.items.map((d) => `the ${d.bike.name}`).join(", ")}.</em></li>
        <li><span>02</span><strong>Fitted to you</strong><em>{order.fit ? `Your fit call: ${order.fit}.` : "We set it up from your measurements; you can book a fit call any time."}</em></li>
        <li><span>03</span><strong>Shipped</strong><em>By {order.ship}, 95% assembled, in one box.</em></li>
        <li><span>04</span><strong>Ride it for 30 days</strong><em>If it isn&apos;t right, send it back for a refund of the bike price.</em></li>
      </ol>
      <p className="cd-done-total">Total {money(order.total)} · nothing was charged in this preview.</p>
      <a className="cd-btn cd-btn-ghost" href="/builds/kord/">Back to Kord®</a>
      <p className="cd-sr" role="status" aria-live="polite">{said}</p>
    </div>
  );

  if (!items.length) return (
    <div className="cd-cart-empty">
      <h1 className="cd-h2"><Words text="Checkout" /></h1>
      <p className="cd-lede">There&apos;s nothing to check out yet.</p>
      <div className="cd-find-actions">
        <a className="cd-btn cd-btn-primary" href="/builds/kord/build/">Build yours<span className="cd-arrow" aria-hidden="true">→</span></a>
        <a className="cd-btn cd-btn-ghost" href="/builds/kord/#find">Find your bike</a>
      </div>
    </div>
  );

  return (
    <div className="cd-cart cd-checkout">
      <div className="cd-checkout-steps">
        <h1 className="cd-h2"><Words text="Checkout" /></h1>
        <section aria-labelledby="co-1">
          <h2 id="co-1" className="cd-build-h"><span>01</span> Delivery <Sample>Sample details</Sample></h2>
          <div className="cd-fields">
            <label>Name<input readOnly value={SAMPLE.name} autoComplete="off" /></label>
            <label>Email<input readOnly value={SAMPLE.email} autoComplete="off" /></label>
            <label className="is-wide">Address<input readOnly value={SAMPLE.address} autoComplete="off" /></label>
          </div>
        </section>
        <section aria-labelledby="co-2">
          <h2 id="co-2" className="cd-build-h"><span>02</span> Fit call</h2>
          <p className="cd-build-note">A 20-minute video call with a fitter, to set your bar, stem and saddle. Or skip it: we set them from your <a href="/builds/kord/fit/">measurements</a>.</p>
          <div className="cd-build-opts is-2" role="radiogroup" aria-label="Fit call">
            {[...slots.map((s, i) => ({ id: String(i), label: s })), { id: "skip", label: "Skip, use my measurements" }].map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={slot === o.id} tabIndex={slot === o.id ? 0 : -1}
                className={`cd-build-opt${slot === o.id ? " is-on" : ""}`} onClick={() => setSlot(o.id)}><strong>{o.label}</strong></button>
            ))}
          </div>
        </section>
        <section aria-labelledby="co-3">
          <h2 id="co-3" className="cd-build-h"><span>03</span> Payment <Sample>Preview</Sample></h2>
          <p className="cd-build-note">Payments are switched off in this preview: the card is a public test card and nothing is charged.</p>
          <div className="cd-fields">
            <label className="is-wide">Card number<input readOnly value="4242 4242 4242 4242" autoComplete="off" inputMode="none" /></label>
            <label>Expiry<input readOnly value="12 / 34" autoComplete="off" /></label>
            <label>CVC<input readOnly value="123" autoComplete="off" /></label>
          </div>
        </section>
      </div>
      <aside className="cd-cart-sum" aria-label="Order summary">
        <ul className="cd-co-items">
          {items.map((x) => { const d = describe(x); return (
            <li key={x.id}><img src={`/builds/kord/bikes/${x.bike}-${x.paint}.webp`} width="1200" height="720" alt="" /><div><strong>Kord® {d.bike.name}</strong><span>{d.line}</span></div><em>{money(d.price)}</em></li>
          ); })}
        </ul>
        <dl>
          <div><dt>Subtotal</dt><dd>{money(total)}</dd></div>
          <div><dt>Delivery</dt><dd>Free</dd></div>
        </dl>
        <p className="cd-cart-total"><span>Total</span><strong>{money(total)}</strong></p>
        <button type="button" className="cd-btn cd-btn-primary" aria-disabled={stage !== "form"} onClick={place}>
          {stage === "busy" ? "Placing order…" : `Place order · ${money(total)}`}
        </button>
        <a className="cd-cart-back" href="/builds/kord/cart/">Back to cart</a>
      </aside>
      <p className="cd-sr" role="status" aria-live="polite">{said}</p>
    </div>
  );
}
