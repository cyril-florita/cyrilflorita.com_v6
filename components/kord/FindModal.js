"use client";

import { useEffect, useRef, useState } from "react";
import FindBike from "@/components/kord/FindBike";
import { WORDMARK } from "@/components/kord/wordmark";

// Help me choose, in a dialog (2026-11-25, the user's call; it was the landing's #find section). Mounted
// once in the Kord layout, so it opens on any page: from any link to #find (the nav, the cart, the
// builder's size note, checkout, Compare), from anything with data-open-find (the landing's band), and on
// load when the URL has #find or a shared ?find= result. Esc, the backdrop (only when the press started
// there too) or the close button closes it; focus goes back to what opened it; the page behind can't
// scroll. Its content mounts only while it's open, so it starts fresh (answers are remembered by FindBike).
// On the result the dialog is the studio (.cd-studio, since 2026-11-25): the bike stands in its light, with no frame of its own; the questions keep the plain panel.
export default function FindModal() {
  const ref = useRef(null), opener = useRef(null), pressedBackdrop = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = (from) => {
      opener.current = from || null;
      const d = ref.current;
      if (d && !d.open) { d.showModal(); setOpen(true); }
    };
    const onClick = (e) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const t = e.target.closest?.('a[href$="#find"], [data-open-find]');
      if (!t) return;
      e.preventDefault(); show(t);
    };
    document.addEventListener("click", onClick);
    if (location.hash === "#find" || new URLSearchParams(location.search).get("find")) show(null);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onClose = () => {
    setOpen(false);
    // a link that opened it (#find, ?find=) shouldn't reopen it on reload
    const q = new URLSearchParams(location.search);
    if (location.hash === "#find" || q.has("find")) {
      q.delete("find");
      const s = q.toString();
      history.replaceState(history.state, "", location.pathname + (s ? `?${s}` : ""));
    }
    opener.current?.focus?.({ preventScroll: true });
  };

  return (
    <dialog ref={ref} className="cd-modal cd-studio" aria-label="Help me choose your bike" onClose={onClose}
      onPointerDown={(e) => { pressedBackdrop.current = e.target === ref.current; }}
      onClick={(e) => { if (e.target === ref.current && pressedBackdrop.current) ref.current.close(); }}>
      <button type="button" className="cd-modal-close" onClick={() => ref.current?.close()} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      <span className="cd-modal-mark" aria-hidden="true">
        <span className="cd-modal-word">
          <svg viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} focusable="false"><path d={WORDMARK.d} fill="currentColor" /></svg>
          <span className="cd-reg">®</span>
        </span>
      </span>
      {open && <FindBike />}
    </dialog>
  );
}
