"use client";

import { useEffect, useState } from "react";
import { BIKES, PAINTS, GROUPSETS, WHEELSETS, SHIP_DAYS, priceBuild, weighBuild, buildQuery, money, plain } from "@/components/kord/data";
import { useCart, removeFromCart } from "@/components/kord/cartStore";

// The cart (/pitch/kord/cart/): the builds saved in this browser (cartStore.js), each with its still,
// spec line, price, an edit link back into the builder and Remove; the subtotal, free delivery,
// the ship date and the 30-day ride, then Checkout. Empty: where to start.

export const describe = (x) => {
  const bike = BIKES.find((b) => b.id === x.bike), paint = PAINTS.find((p) => p.id === x.paint);
  const group = GROUPSETS.find((g) => g.id === x.group), wheels = WHEELSETS.find((w) => w.id === x.wheels);
  return { bike, paint, line: `Size ${x.size} · ${paint.name} · ${group.name} · ${wheels.short || bike.wheels} wheels · ${weighBuild(x).toFixed(2)} kg`, price: priceBuild(x) };
};
export const shipDate = () => {
  const d = new Date(); d.setDate(d.getDate() + SHIP_DAYS);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

export default function Cart() {
  const items = useCart();
  const [ship, setShip] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- a date in the visitor's own time zone
  useEffect(() => setShip(shipDate()), []);
  const total = items.reduce((s, x) => s + priceBuild(x), 0);

  if (!items.length) return (
    <div className="cd-cart-empty">
      <p className="cd-lede">Your cart is empty. Start with the bike that fits how you ride, or build one from scratch.</p>
      <div className="cd-find-actions">
        <a className="cd-btn cd-btn-primary" href="/pitch/kord/#find">Find your bike<span className="cd-arrow" aria-hidden="true">→</span></a>
        <a className="cd-btn cd-btn-ghost" href="/pitch/kord/build/">Build a bike</a>
      </div>
    </div>
  );

  return (
    <div className="cd-cart">
      <ul className="cd-cart-list">
        {items.map((x) => {
          const d = describe(x);
          return (
            <li key={x.id} className="cd-cart-item">
              <img src={`/pitch/kord/bikes/${x.bike}.webp`} width="1200" height="720" alt="" />
              <div>
                <h2 className="cd-h3">Kord® {d.bike.name}</h2>
                <p className="cd-cart-line">{d.line}</p>
                <p className="cd-find-links">
                  <a href={`/pitch/kord/build/${buildQuery(x)}`}>Edit this build</a>
                  <button type="button" onClick={() => removeFromCart(x.id)}>Remove<span className="cd-sr"> the {plain(d.bike.name)}</span></button>
                </p>
              </div>
              <p className="cd-cart-price">{money(d.price)}</p>
            </li>
          );
        })}
      </ul>
      <aside className="cd-cart-sum" aria-label="Order summary">
        <dl>
          <div><dt>Subtotal</dt><dd>{money(total)}</dd></div>
          <div><dt>Delivery</dt><dd>Free</dd></div>
          <div><dt>Ships by</dt><dd>{ship || " "}</dd></div>
        </dl>
        <p className="cd-cart-total"><span>Total</span><strong>{money(total)}</strong></p>
        <a className="cd-btn cd-btn-primary" href="/pitch/kord/checkout/">Checkout<span className="cd-arrow" aria-hidden="true">→</span></a>
        <p className="cd-cart-note">Built to order and fitted to you. Ride it for 30 days; if it isn&apos;t right, we collect it and refund you in full.</p>
      </aside>
    </div>
  );
}
