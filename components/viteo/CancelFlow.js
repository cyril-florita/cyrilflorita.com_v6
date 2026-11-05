"use client";
import { useEffect, useRef, useState } from "react";
import { BASE, money } from "./data";
import { Arrow, Button } from "./ui";
// Page-only styles (split out of viteo.css so the landing skips them).
import "@/app/pitch/viteo/css/account.css";

// Cancelling, without the trap. A modal in three short steps, each with a
// way straight to cancelling: (1) an optional reason; (2) one alternative
// that fits it (save by delivering less often, skip the next box, pause, or
// update your answers), applied in one tap, with "Continue to cancel" right next
// to it; (3) a plain confirmation where keeping and cancelling carry equal
// weight. Anything changed here can be undone from the toast.

const REASONS = [
  { id: "cost", label: "It costs more than I'd like" },
  { id: "surplus", label: "I still have plenty left" },
  { id: "break", label: "I'm taking a break or traveling" },
  { id: "changed", label: "My needs have changed" },
  { id: "other", label: "Something else" },
];

export default function CancelFlow({ open, onClose, order, nextDate, threePrice, onSkip, onPause, onThreeMonths, onCancel }) {
  const [step, setStep] = useState("reason");
  const [reason, setReason] = useState(null);
  const ref = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  // Each step moves focus to its heading.
  useEffect(() => { if (open) titleRef.current?.focus(); }, [open, step]);

  const close = () => { onClose(); setStep("reason"); setReason(null); };
  const hasOffer = (r) => r && r !== "other" && !(r === "cost" && order.plan === "three");

  const offer = {
    cost: {
      title: "Save by getting boxes less often",
      text: `Switch to a delivery every 3 months and save 15%: ${money(threePrice)} per box, with the same daily pack.`,
      action: <Button onClick={() => { onThreeMonths(); close(); }}>Switch to every 3 months</Button>,
    },
    surplus: {
      title: "Skip your next box instead",
      text: `Your next box won't ship on ${nextDate}; the one after it comes as usual. Nothing else changes.`,
      action: <Button onClick={() => { onSkip(); close(); }}>Skip my next box</Button>,
    },
    break: {
      title: "Pause for as long as you need",
      text: "No boxes while you're away; deliveries pick up again on their own, and you can resume early anytime.",
      action: (
        <span className="dl-cancel-pause">
          {[1, 2, 3].map((m) => (
            <Button key={m} onClick={() => { onPause(m); close(); }}>
              {m} {m === 1 ? "month" : "months"}
            </Button>
          ))}
        </span>
      ),
    },
    changed: {
      title: "Rebuild your pack in two minutes",
      text: "Personalize your pack again and your next box follows your new answers. Or add and remove items yourself from your pack.",
      action: <Button href={`${BASE}/personalize/`} onClick={close}>Update your answers</Button>,
    },
  }[reason];

  return (
    <dialog
      ref={ref}
      className="dl-modal dl-cancel"
      aria-labelledby="dl-cancel-title"
      onClose={close}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {open && (
        <div className="dl-modal-body">
          {step === "reason" && (
            <>
              <h2 id="dl-cancel-title" ref={titleRef} tabIndex={-1} className="dl-h3">Before you go, what&apos;s the main reason?</h2>
              <p className="dl-meta">Optional. It helps us improve, and we may have something that fits better.</p>
              <div className="dl-options" role="radiogroup" aria-label="Reason for cancelling">
                {REASONS.map((r) => (
                  <button key={r.id} type="button" role="radio" aria-checked={reason === r.id} className={`dl-option ${reason === r.id ? "is-on" : ""}`} onClick={() => setReason(r.id)}>
                    <span className="dl-option-text"><span>{r.label}</span></span>
                    <span className="dl-option-check" />
                  </button>
                ))}
              </div>
              <div className="dl-modal-actions">
                <Button variant="ghost" onClick={() => setStep("confirm")}>Skip and cancel</Button>
                <Button disabled={!reason} onClick={() => setStep(hasOffer(reason) ? "offer" : "confirm")}>Continue <Arrow /></Button>
              </div>
            </>
          )}

          {step === "offer" && offer && (
            <>
              <h2 id="dl-cancel-title" ref={titleRef} tabIndex={-1} className="dl-h3">{offer.title}</h2>
              <p>{offer.text}</p>
              <div className="dl-modal-actions dl-cancel-offer">
                <Button variant="ghost" onClick={() => setStep("confirm")}>Continue to cancel</Button>
                {offer.action}
              </div>
            </>
          )}

          {step === "confirm" && (
            <>
              <h2 id="dl-cancel-title" ref={titleRef} tabIndex={-1} className="dl-h3">Cancel your subscription?</h2>
              <ul className="dl-cancel-facts">
                <li>Your next box{order.paused ? "" : `, due ${nextDate},`} won&apos;t ship, and you won&apos;t be charged again.</li>
                <li>Your pack, reasons and routine history are kept, so you can restart in one tap.</li>
              </ul>
              <div className="dl-modal-actions">
                <Button onClick={close}>Keep my subscription</Button>
                <Button variant="ghost" className="dl-btn-danger" onClick={() => { onCancel(); close(); }}>Cancel subscription</Button>
              </div>
            </>
          )}

          <button type="button" className="dl-ing-close dl-modal-close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}
    </dialog>
  );
}
