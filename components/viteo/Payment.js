"use client";
import { useEffect, useRef, useState } from "react";
import { money } from "./data";
import { Arrow, Button } from "./ui";

// Checkout's payment step, simulated and safe by construction: nobody can
// type a card number. Two experiences:
//  - Express: a wallet button (Apple Pay on Apple devices, Google Pay
//    elsewhere) that opens a mock payment sheet with a sample card,
//    a confirm step and a success tick.
//  - Card: the full card form, its fields read-only and filled with public
//    test cards. Stripe's 4242… succeeds; 4000…0002 is declined, so the
//    error path can be tried too. "Checking card…" stands in for the
//    provider's verification.
// Either way it reports { method, label } and nothing is charged or sent.

const CARDS = {
  ok: { number: "4242 4242 4242 4242", label: "Visa ···· 4242", note: "Test card · succeeds" },
  declined: { number: "4000 0000 0000 0002", label: "Visa ···· 0002", note: "Test card · declined" },
};
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? Math.min(ms, 150) : ms));

const Lock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);

export function PaymentStep({ headingRef, total, zip, onBack, onPaid }) {
  // Checkout renders only after hydration, so the device can be read directly.
  const [wallet] = useState(() => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "Apple Pay" : "Google Pay"));
  const [sheet, setSheet] = useState(null); // null | "review" | "paying" | "done"
  const [card, setCard] = useState("ok");
  const [checking, setChecking] = useState(false);
  const [declined, setDeclined] = useState(false);
  const dialog = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (sheet && !d.open) d.showModal();
    if (!sheet && d.open) d.close();
  }, [sheet]);

  const payWallet = async () => {
    setSheet("paying");
    await wait(1100);
    setSheet("done");
    await wait(700);
    setSheet(null);
    onPaid({ method: "wallet", label: `${wallet} · Visa ···· 4242` });
  };

  const payCard = async () => {
    setDeclined(false);
    setChecking(true);
    await wait(1200);
    setChecking(false);
    if (card === "declined") {
      setDeclined(true);
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }
    onPaid({ method: "card", label: CARDS.ok.label });
  };

  const c = CARDS[card];
  return (
    <div className="dl-pay">
      <h1 className="dl-h3" tabIndex={-1} ref={headingRef}>Payment</h1>
      <p className="dl-meta dl-pay-preview">
        <span className="dl-code" data-lot="Lot 00">Preview</span> Simulated payment: no card can be entered and nothing is charged.
      </p>

      {/* Express checkout */}
      <button type="button" className={`dl-wallet-btn ${wallet === "Apple Pay" ? "is-apple" : "is-google"}`} onClick={() => setSheet("review")} aria-haspopup="dialog">
        Pay with <strong>{wallet}</strong>
      </button>

      <p className="dl-or"><span>or pay with card</span></p>

      {/* Card form: read-only test cards */}
      <div className="dl-card-form" aria-describedby="dl-card-lock">
        <div className="dl-card-choice" role="radiogroup" aria-label="Test card">
          {Object.entries(CARDS).map(([k, v]) => (
            <button key={k} type="button" role="radio" aria-checked={card === k} className={`dl-chip ${card === k ? "is-on" : ""}`} onClick={() => { setCard(k); setDeclined(false); }}>
              {v.note}
            </button>
          ))}
        </div>
        <div className="dl-form-grid">
          <label className="dl-field dl-field-wide dl-field-locked">
            <span>Card number</span>
            <span className="dl-input-wrap">
              <input value={c.number} readOnly aria-readonly="true" autoComplete="off" inputMode="none" />
              <span className="dl-card-brand" aria-label="Visa">VISA</span>
            </span>
          </label>
          <label className="dl-field dl-field-locked"><span>Expiry</span><input value="12 / 34" readOnly aria-readonly="true" autoComplete="off" inputMode="none" /></label>
          <label className="dl-field dl-field-locked"><span>CVC</span><input value="123" readOnly aria-readonly="true" autoComplete="off" inputMode="none" /></label>
          <label className="dl-field dl-field-locked"><span>Billing ZIP</span><input value={zip || "91350"} readOnly aria-readonly="true" autoComplete="off" inputMode="none" /></label>
        </div>
        <p id="dl-card-lock" className="dl-meta dl-card-lock"><Lock /> Fields are locked to public test cards in preview mode, so a real card can never be entered.</p>
        {declined && (
          <div className="dl-pay-error" role="alert" tabIndex={-1} ref={errorRef}>
            <strong>Your card was declined.</strong> Nothing was charged. Try another card, or pay with {wallet}.
          </div>
        )}
      </div>

      <div className="dl-quiz-nav">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={payCard} disabled={checking} aria-busy={checking}>
          {checking ? <><span className="dl-spin dl-spin-sm" aria-hidden="true" /> Checking card…</> : <>Use this card <Arrow /></>}
        </Button>
      </div>

      {/* The simulated wallet sheet */}
      <dialog ref={dialog} className="dl-modal dl-syssheet dl-wallet-sheet" aria-labelledby="dl-wallet-title" onClose={() => setSheet(null)} onClick={(e) => e.target === e.currentTarget && sheet === "review" && setSheet(null)}>
        {sheet && (
          <div className="dl-modal-body">
            <p className="dl-wallet-head"><strong id="dl-wallet-title">{wallet}</strong><span className="dl-meta">Simulated</span></p>
            <dl className="dl-wallet-rows">
              <div><dt>Card</dt><dd>Visa ···· 4242</dd></div>
              <div><dt>Pay</dt><dd>Viteo</dd></div>
              <div className="is-total"><dt>Total</dt><dd>{money(total)} <span className="dl-meta">per box</span></dd></div>
            </dl>
            <div className="dl-wallet-status" role="status">
              {sheet === "review" && <span className="dl-meta">Charged when your first box ships</span>}
              {sheet === "paying" && <><span className="dl-spin" aria-hidden="true" /> {wallet === "Apple Pay" ? "Confirming with Face ID…" : "Confirming…"}</>}
              {sheet === "done" && <><span className="dl-syssheet-icon is-done" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg></span> Done</>}
            </div>
            {sheet === "review" && (
              <div className="dl-modal-actions">
                <button type="button" className="dl-btn dl-btn-ghost" onClick={() => setSheet(null)}>Cancel</button>
                <button type="button" className="dl-btn dl-btn-primary" onClick={payWallet} autoFocus>Pay {money(total)}</button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
