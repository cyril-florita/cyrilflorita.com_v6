"use client";

import { useRef } from "react";

// Phones, tablets and small laptops (≤1100px, where the header's nav is hidden): a menu button opening every page
// in a full-screen native <dialog> (Esc, focus trap and focus return come with it). A link, the
// close button, a press on the backdrop or Esc closes it.
export default function MobileMenu({ links }) {
  const dlg = useRef(null), btn = useRef(null);
  const close = () => { dlg.current?.close(); };
  return (
    <>
      <button ref={btn} type="button" className="cd-menu-btn" aria-haspopup="dialog" onClick={() => dlg.current?.showModal()}>
        <span className="cd-sr">Menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
      </button>
      <dialog ref={dlg} className="cd-menu" aria-label="Menu" onClick={(e) => { if (e.target === dlg.current) close(); }} onClose={() => btn.current?.focus()}>
        <div className="cd-menu-inner">
          <button type="button" className="cd-menu-close" onClick={close}><span className="cd-sr">Close menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <nav aria-label="Main">
            <ul>{links.map((l) => <li key={l.href}><a href={l.href} onClick={close}>{l.label}</a></li>)}</ul>
          </nav>
          <a className="cd-btn cd-btn-primary" href="/pitch/kord/build/" onClick={close}>Build a bike<span className="cd-arrow" aria-hidden="true">→</span></a>
        </div>
      </dialog>
    </>
  );
}
