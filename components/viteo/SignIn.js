"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE } from "./data";
import { read, write } from "./store";
import { Arrow, BigWordHead } from "./ui";

// Sign in, passwordless, as a modern DTC brand would do it: an email
// sign-in link, or a passkey. Both are simulated (preview mode): the "email"
// arrives as an on-screen inbox notification you tap, and the passkey is a
// mock system sheet. A session is just `session` in this browser's storage;
// nothing is sent anywhere. Afterwards it goes back to ?next= (default:
// the account).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduced() ? Math.min(ms, 150) : ms));

const nameFrom = (email) => {
  const order = read("order");
  if (order?.address?.email === email && order.name) return order.name;
  const part = email.split("@")[0].split(/[._-]/)[0];
  return part ? part[0].toUpperCase() + part.slice(1) : "";
};

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [stage, setStage] = useState("form"); // form | sent | signing
  const [mail, setMail] = useState(false); // the simulated inbox notification
  const [passkey, setPasskey] = useState(null); // null | "ask" | "verifying" | "done"
  const sheet = useRef(null);
  const heading = useRef(null);

  const next = () => {
    const n = new URLSearchParams(window.location.search).get("next");
    return n && /^[a-z-]+\/?$/.test(n) ? `${BASE}/${n.replace(/\/?$/, "/")}` : `${BASE}/account/`;
  };

  const finish = async (addr, method) => {
    setStage("signing");
    await wait(700);
    write("session", { email: addr, name: nameFrom(addr), method, since: new Date().toISOString() });
    router.push(next());
  };

  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [stage]);

  // The sign-in "email" lands a moment after it's sent.
  useEffect(() => {
    if (stage !== "sent") return;
    const t = setTimeout(() => setMail(true), reduced() ? 0 : 1400);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    const d = sheet.current;
    if (!d) return;
    if (passkey && !d.open) d.showModal();
    if (!passkey && d.open) d.close();
  }, [passkey]);

  const send = (e) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) { setError("Enter the email you used for your order."); return; }
    setError("");
    setMail(false);
    setStage("sent");
  };

  const usePasskey = async () => {
    setPasskey("verifying");
    await wait(1100);
    setPasskey("done");
    await wait(500);
    setPasskey(null);
    finish(email.trim() || "victoria@example.com", "passkey");
  };

  return (
    <section className="dl-signin">
      <div className="dl-wrap">
        <div className="dl-card dl-panel dl-panel-1 dl-signin-card">
          {stage === "form" && (
            <>
              <BigWordHead word="Sign in">
                <h1 className="dl-h2" tabIndex={-1} ref={heading}>Welcome back.</h1>
              </BigWordHead>
              <p className="dl-section-lede">No password needed: we&apos;ll email you a link, or use the passkey on this device.</p>
              <form className="dl-signin-form" onSubmit={send} noValidate>
                <label className={`dl-field dl-field-wide ${error ? "has-error" : ""}`}>
                  <span>Email</span>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} autoComplete="email" placeholder="you@example.com" />
                  {error && <span className="dl-error" role="alert">{error}</span>}
                </label>
                <button type="submit" className="dl-btn dl-btn-primary dl-btn-block">Email me a sign-in link <Arrow /></button>
              </form>
              <p className="dl-or"><span>or</span></p>
              <button type="button" className="dl-btn dl-btn-secondary dl-btn-block" onClick={() => setPasskey("ask")} aria-haspopup="dialog">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="9" r="4" /><path d="M3 20c0-3 2.5-5 5-5 1.2 0 2.3.3 3.2.9M15 13a3 3 0 1 1 3 3v5l-1.5-1.5L18 18" /></svg>
                Sign in with a passkey
              </button>
              <p className="dl-meta dl-signin-note">
                <span className="dl-code" data-lot="Lot 07">Preview</span> Sign-in is simulated: nothing is emailed or sent anywhere.
              </p>
            </>
          )}

          {stage === "sent" && (
            <>
              <BigWordHead word="Inbox">
                <h1 className="dl-h2" tabIndex={-1} ref={heading}>Check your email.</h1>
              </BigWordHead>
              <p className="dl-section-lede">We sent a sign-in link to <strong>{email.trim()}</strong>. It works once and expires in 15 minutes.</p>
              <div className="dl-ds-row">
                <button type="button" className="dl-textlink" onClick={() => { setMail(false); setTimeout(() => setMail(true), reduced() ? 0 : 900); }}>Resend the link</button>
                <button type="button" className="dl-textlink" onClick={() => { setStage("form"); setMail(false); }}>Use a different email</button>
              </div>
              <p className="dl-meta dl-signin-note">
                <span className="dl-code" data-lot="Lot 07">Preview</span> The email arrives as a notification on this screen.
              </p>
            </>
          )}

          {stage === "signing" && (
            <div className="dl-signin-busy" role="status">
              <span className="dl-spin" aria-hidden="true" />
              <h1 className="dl-h3" tabIndex={-1} ref={heading}>Signing you in…</h1>
            </div>
          )}
        </div>
      </div>

      {/* The simulated inbox notification: tapping it is "opening the link". */}
      {stage === "sent" && mail && (
        <button type="button" className="dl-notify" onClick={() => { setMail(false); finish(email.trim(), "email"); }}>
          <span className="dl-notify-app" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
          </span>
          <span className="dl-notify-body">
            <span className="dl-notify-top"><strong>Mail</strong><span>now</span></span>
            <strong>Viteo: your sign-in link</strong>
            <span>Tap to sign in as {email.trim()}. Expires in 15 minutes.</span>
          </span>
        </button>
      )}

      {/* The simulated passkey system sheet. */}
      <dialog ref={sheet} className="dl-modal dl-syssheet" aria-labelledby="dl-passkey-title" onClose={() => setPasskey(null)} onClick={(e) => e.target === e.currentTarget && passkey === "ask" && setPasskey(null)}>
        {passkey && (
          <div className="dl-modal-body dl-syssheet-body">
            <span className={`dl-syssheet-icon ${passkey === "done" ? "is-done" : ""}`} aria-hidden="true">
              {passkey === "done" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 4a7 7 0 0 0-7 7v2M19 13v-2a7 7 0 0 0-3-5.7M9 12a3 3 0 0 1 6 0v3a6 6 0 0 1-1 3.3M12 12v4a8 8 0 0 1-1.5 4.5M6 17a11 11 0 0 0 1-4M17.5 17a14 14 0 0 1-.9 3" /></svg>
              )}
            </span>
            <h2 id="dl-passkey-title" className="dl-h3">{passkey === "done" ? "Signed in" : "Sign in to viteo?"}</h2>
            <p className="dl-meta">{passkey === "verifying" ? "Confirming it's you…" : "Use the passkey saved on this device for viteo.example."}</p>
            {passkey === "ask" && (
              <div className="dl-modal-actions">
                <button type="button" className="dl-btn dl-btn-ghost" onClick={() => setPasskey(null)}>Cancel</button>
                <button type="button" className="dl-btn dl-btn-primary" onClick={usePasskey} autoFocus>Continue</button>
              </div>
            )}
            <p className="dl-meta dl-syssheet-note">Simulated system prompt · preview mode</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
