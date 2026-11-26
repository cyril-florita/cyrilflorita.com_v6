"use client";

import { useRef } from "react";

// Phones, tablets and small laptops (≤1100px, where the header's nav is hidden): a menu button opening every page
// in a full-screen native <dialog> (Esc, focus trap and focus return come with it). A link, the
// close button, a press on the backdrop or Esc closes it.
// Animated since 2026-11-25 (CSS, "the menu, animated" in kord.css): it opens as a shutter coming down
// from the top while each row rises out of its own mask in turn; closing (the ✕, Esc, the backdrop) plays
// it back up — `.is-closing` for 0.42s, then the dialog closes. A link closes it at once (the page is
// leaving, or Help me choose's dialog is opening over it). Instant under reduced motion.
const CLOSE_MS = 420;

export default function MobileMenu({ links }) {
  const dlg = useRef(null), btn = useRef(null), timer = useRef(0);
  const shut = () => {
    const d = dlg.current;
    clearTimeout(timer.current);
    if (d) { d.classList.remove("is-closing"); if (d.open) d.close(); }
  };
  const close = () => {
    const d = dlg.current;
    if (!d?.open || d.classList.contains("is-closing")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return shut();
    d.classList.add("is-closing");
    timer.current = setTimeout(shut, CLOSE_MS);
  };
  const open = () => { shut(); dlg.current?.showModal(); };
  return (
    <>
      <button ref={btn} type="button" className="cd-menu-btn" aria-haspopup="dialog" onClick={open}>
        <span className="cd-sr">Menu</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
      </button>
      <dialog ref={dlg} className="cd-menu" aria-label="Menu"
        onClick={(e) => { if (e.target === dlg.current) close(); }}
        onCancel={(e) => { e.preventDefault(); close(); }}
        onClose={() => btn.current?.focus()}>
        <div className="cd-menu-inner">
          <button type="button" className="cd-menu-close" onClick={close}><span className="cd-sr">Close menu</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
          <nav aria-label="Main">
            <ul>{links.map((l, i) => <li key={l.href} style={{ "--i": i }}><a href={l.href} onClick={shut}>{l.label}</a></li>)}</ul>
          </nav>
          <a className="cd-btn cd-btn-primary cd-menu-cta" style={{ "--i": links.length }} href="/builds/kord/build/" onClick={shut}>Build yours<span className="cd-arrow" aria-hidden="true">→</span></a>
        </div>
      </dialog>
    </>
  );
}
