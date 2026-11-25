"use client";

import { useCart } from "@/components/kord/cartStore";

// The header's cart link, with a count once there's something in it.
export default function CartLink() {
  const n = useCart().length;
  return (
    <a className="cd-cart-link" href="/pitch/kord/cart/" aria-label={n ? `Cart, ${n} ${n === 1 ? "bike" : "bikes"}` : "Cart"}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 7h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 7Z" /><path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
      </svg>
      {n > 0 && <span className="cd-cart-n" aria-hidden="true">{n}</span>}
    </a>
  );
}
