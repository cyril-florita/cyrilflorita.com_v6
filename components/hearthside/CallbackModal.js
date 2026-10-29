"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHONE } from "./data";
import { CallbackForm } from "./Forms";
import { Icon, Photo } from "./ui";

// "Request a call", served in a modal wherever you are (there's no contact
// page). Mounted once in the public layout. Any link to #request-a-call opens
// it (the hero, the contact dock, the footer…); so does loading the page with
// that hash, or with ?call (the old /contact/ URL redirects there). A native
// <dialog>: Esc closes it, the page behind is inert, focus returns to what
// opened it. The form is mounted only while open, so it starts fresh each
// time and the photo isn't fetched until needed. Styles: css/modal.css.

const HASH = "#request-a-call";

export default function CallbackModal() {
  const ref = useRef(null);
  const opener = useRef(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    if (ref.current?.open) return;
    opener.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;
    setOpen(true);
  }, []);

  // Open the dialog once the form has rendered, so the browser's own focus
  // step sees it, then put the cursor in the first field: only where there's
  // a keyboard to type on (on touch it would cover half the form).
  useEffect(() => {
    const d = ref.current;
    if (!open || !d || d.open) return;
    d.showModal();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    (touch ? d.querySelector("h2") : d.querySelector("input"))?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target instanceof Element ? e.target.closest(`a[href="${HASH}"]`) : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      show();
    };
    const fromUrl = () => {
      const { hash, search, pathname } = window.location;
      if (hash === HASH || new URLSearchParams(search).has("call")) {
        window.history.replaceState(null, "", pathname); // the link opened it; keep the address clean
        show();
      }
    };
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromUrl);
    fromUrl();
    return () => { document.removeEventListener("click", onClick); window.removeEventListener("hashchange", fromUrl); };
  }, [show]);

  const close = () => ref.current?.close();
  const onClosed = () => {
    setOpen(false);
    const el = opener.current;
    opener.current = null;
    if (el?.isConnected) el.focus({ preventScroll: true });
  };

  return (
    <dialog
      ref={ref}
      className="hs-modal"
      aria-labelledby="hs-cb-title"
      onClose={onClosed}
      onClick={(e) => {
        // The backdrop (a click on the dialog itself), or any link that leaves the modal.
        if (e.target === ref.current) return close();
        const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
        if (a && !a.getAttribute("href").startsWith("tel:") && a.getAttribute("href") !== HASH) close();
      }}
    >
      <div className="hs-modal-box">
        {open && (
          <>
            <div className="hs-modal-photo" aria-hidden="true">
              <Photo shot="An older parent on the phone at home, her daughter beside her" alt="" src="/img/hearthside/photos/family-phone" position="38% 30%" sizes="400px" />
            </div>
            <div className="hs-modal-main">
              <h2 id="hs-cb-title" tabIndex={-1}>Request a call</h2>
              <p className="hs-modal-lede">Tell us how to reach you and our intake team will call within one business day.<span> No forms about your medical history: we&rsquo;ll ask what we need when we talk.</span></p>
              <CallbackForm onClose={close} />
              <p className="hs-modal-alt">
                Prefer to call? <a href={PHONE.href}>{PHONE.display}</a>, Monday to Friday, 8 am to 6 pm. In an emergency, call 911.
              </p>
            </div>
          </>
        )}
        <button type="button" className="hs-modal-close" onClick={close} aria-label="Close">
          <Icon name="close" size={22} />
        </button>
      </div>
    </dialog>
  );
}
