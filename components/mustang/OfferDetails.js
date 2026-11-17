"use client";

import { useRef, useState } from "react";

const phone = () => window.matchMedia("(max-width: 999px)").matches;
const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

// "Offer details": opens the sample terms in a centered modal (a native
// <dialog>, after Viteo's ingredient close-up): everything on the page but the
// background fades out while it's open (mustang.css, `:has(.ms-offer-dialog[open])`).
// The car stays in view behind it (CarStage hears "ms:modal": it stops drawing
// the windows and, on desktop, glides the car to the top left). On phones the
// page scrolls back to the top so the car is in view above the sheet, and back
// to where it was on close. Esc, the × button, or a click on the backdrop that also started
// there closes it; focus returns to the button. Its calls to action (Book a test
// drive, Call us — the ad is pitched to one dealership) only show a preview note: nothing is booked from a concept.
export default function OfferDetails({ children }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const downOnBackdrop = useRef(false);
  const savedY = useRef(null);
  const [note, setNote] = useState("");
  const lock = useRef(null);
  const open = () => {
    if (phone()) {
      savedY.current = window.scrollY; window.scrollTo({ top: 0, behavior: smooth() });
      // keep the page still behind the sheet: block touch scrolls that start outside it
      const block = (e) => { if (!dialog.current?.contains(e.target)) e.preventDefault(); };
      document.addEventListener("touchmove", block, { passive: false });
      lock.current = () => document.removeEventListener("touchmove", block);
    }
    dialog.current?.showModal();
    window.dispatchEvent(new CustomEvent("ms:modal", { detail: true }));
  };
  const close = () => dialog.current?.close();
  return (
    <>
      <button ref={trigger} type="button" className="ms-btn" aria-haspopup="dialog" onClick={open}>
        Offer details
      </button>
      <dialog ref={dialog} className="ms-offer-dialog" aria-labelledby="ms-offer-dialog-title" onClose={() => {
          window.dispatchEvent(new CustomEvent("ms:modal", { detail: false }));
          setNote("");
          lock.current?.(); lock.current = null;
          if (savedY.current !== null) { window.scrollTo({ top: savedY.current, behavior: smooth() }); savedY.current = null; }
          trigger.current?.focus({ preventScroll: true });
        }}
        onPointerDown={(e) => { downOnBackdrop.current = e.target === e.currentTarget; }}
        onClick={(e) => { if (downOnBackdrop.current && e.target === e.currentTarget) close(); }}>
        <div className="ms-offer-panel">
          <button type="button" className="ms-offer-close" aria-label="Close offer details" onClick={close}>×</button>
          {children}
          <div className="ms-offer-actions">
            <button type="button" className="ms-btn" onClick={() => setNote("Preview: in a live ad, this would book a test drive at the dealership.")}>Book a test drive</button>
            <button type="button" className="ms-btn ms-btn-ghost" onClick={() => setNote("Preview: in a live ad, this would call the dealership's sales team.")}>Call us</button>
          </div>
          <p className="ms-offer-note" role="status" aria-live="polite">{note}</p>
          <p className="ms-offer-fine">All figures are sample content for this concept, not a real offer from Ford or a dealer.</p>
        </div>
      </dialog>
    </>
  );
}
