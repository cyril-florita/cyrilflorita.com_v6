"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// "Install the app" (footer). Viteo is a Progressive Web App: a manifest
// scoped to /pitch/viteo/ (public/pitch/viteo/manifest.webmanifest) and a
// small service worker (sw.js: network-first, branded offline page). This
// registers the worker and offers installing: where the browser has an
// install prompt (Chrome, Edge, Android) the button opens it; elsewhere
// (Safari on iPhone and iPad, which has no prompt) it shows how to add Viteo
// to the home screen. Hidden once Viteo is running installed.

// Running installed? (Server and first render say yes, so nothing renders
// until the browser has answered.)
const standaloneQuery = () => window.matchMedia("(display-mode: standalone)");
const subscribeStandalone = (cb) => {
  const q = standaloneQuery();
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
};
const isStandalone = () => standaloneQuery().matches || navigator.standalone === true;

export default function InstallApp() {
  const standaloneNow = useSyncExternalStore(subscribeStandalone, isStandalone, () => true);
  const [installed, setInstalled] = useState(false);
  const standalone = standaloneNow || installed;
  const [help, setHelp] = useState(false);
  const deferred = useRef(null);
  const dialog = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/pitch/viteo/sw.js", { scope: "/pitch/viteo/" }).catch(() => {});
    }
    const onPrompt = (e) => { e.preventDefault(); deferred.current = e; };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (help && !d.open) d.showModal();
    if (!help && d.open) d.close();
  }, [help]);

  if (standalone) return null;

  const install = async () => {
    if (deferred.current) {
      try {
        await deferred.current.prompt();
        await deferred.current.userChoice;
        deferred.current = null;
        return;
      } catch {
        // The browser refused the prompt: show the steps instead.
      }
    }
    setHelp(true);
  };

  return (
    <>
      <button ref={button} type="button" className="dl-footer-install" onClick={install} aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
        </svg>
        Install the app
      </button>
      <dialog
        ref={dialog}
        className="dl-modal"
        aria-labelledby="dl-install-title"
        onClose={() => { setHelp(false); button.current?.focus({ preventScroll: true }); }}
        onClick={(e) => e.target === e.currentTarget && setHelp(false)}
      >
        <div className="dl-modal-body">
          <h2 id="dl-install-title" className="dl-h3">Add Viteo to your home screen</h2>
          <p className="dl-meta">It opens full-screen with its own icon, like an app, and keeps your pack and account one tap away.</p>
          <dl className="dl-install-steps">
            <div><dt>iPhone and iPad</dt><dd>In Safari, tap Share, then &ldquo;Add to Home Screen&rdquo;.</dd></div>
            <div><dt>Android</dt><dd>In Chrome, open the menu (⋮) and tap &ldquo;Install app&rdquo;.</dd></div>
            <div><dt>Desktop</dt><dd>In Chrome or Edge, click the install icon at the right of the address bar.</dd></div>
          </dl>
          <div className="dl-modal-actions">
            <button type="button" className="dl-btn dl-btn-primary" onClick={() => setHelp(false)}>Got it</button>
          </div>
          <button type="button" className="dl-ing-close dl-modal-close" onClick={() => setHelp(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
