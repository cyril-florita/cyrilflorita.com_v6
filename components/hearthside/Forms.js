"use client";
import { useEffect, useId, useRef, useState } from "react";
import { BASE, PHONE, ROLES } from "./data";
import { Button, Icon } from "./ui";

// The public site's two small forms, both in preview mode: nothing is sent or
// stored. They ask only for what's needed to call back (no medical history,
// no free-text health details).

const digits = (v) => v.replace(/\D/g, "");

// "Request a call": name, phone, best time, who it's for. In the site's
// request-a-call modal (CallbackModal.js), which passes `onClose` so the
// confirmation can offer a Close button.
export function CallbackForm({ onClose }) {
  const id = useId();
  const doneRef = useRef(null);
  const [f, setF] = useState({ name: "", phone: "", time: "morning", who: "family" });
  const [errors, setErrors] = useState({});
  // form → leaving (the form fades out) → done (the confirmation fades in).
  // While it fades, the wrapper holds the form's height so the dialog
  // doesn't jump.
  const [phase, setPhase] = useState("form");
  const [held, setHeld] = useState(0);
  const wrapRef = useRef(null);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  // Functional update: autofill can change several fields at once, and a
  // snapshot of `f` would let the last field wipe the others.
  const set = (k) => (e) => { const v = e.target.value; setF((prev) => ({ ...prev, [k]: v })); };
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!f.name.trim()) err.name = "Enter your name.";
    if (digits(f.phone).length !== 10) err.phone = "Enter a 10-digit phone number, like (818) 675-0181.";
    setErrors(err);
    if (Object.keys(err).length) return document.getElementById(`${id}-${Object.keys(err)[0]}`)?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setPhase("done");
    setHeld(wrapRef.current?.offsetHeight || 0);
    setPhase("leaving");
    timer.current = window.setTimeout(() => setPhase("done"), 240);
  };
  // The submit button is gone once sent: bring focus to the confirmation.
  useEffect(() => { if (phase === "done") doneRef.current?.focus({ preventScroll: true }); }, [phase]);
  if (phase === "done") {
    return (
      <div className="hs-swap" style={held ? { minHeight: held } : undefined}>
      <div className="hs-done" role="status" tabIndex={-1} ref={doneRef}>
        <Icon name="check" />
        <h3>Thanks, {f.name.split(" ")[0]}. We&rsquo;ll call you {f.time === "morning" ? "tomorrow morning" : f.time === "afternoon" ? "tomorrow afternoon" : "as soon as we can"}.</h3>
        <p className="hs-muted">Our intake team calls back the same or next day. If it&rsquo;s urgent, call us now at <a href={PHONE.href}>{PHONE.display}</a>. If it&rsquo;s an emergency, call 911.</p>
        <p className="hs-hint">Preview mode: this request wasn&rsquo;t sent anywhere.</p>
        {onClose && <div><Button variant="secondary" onClick={onClose}>Close</Button></div>}
      </div>
      </div>
    );
  }
  return (
    <div className="hs-swap" ref={wrapRef} style={held ? { minHeight: held } : undefined}>
    <form className={`hs-form${phase === "leaving" ? " is-leaving" : ""}`} onSubmit={submit} noValidate inert={phase === "leaving"}>
      <div className="hs-form-grid">
        <div className="hs-field">
          <label htmlFor={`${id}-name`}>Your name</label>
          <input id={`${id}-name`} className="hs-input" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-e` : undefined} />
          {errors.name && <p id={`${id}-name-e`} className="hs-error">{errors.name}</p>}
        </div>
        <div className="hs-field">
          <label htmlFor={`${id}-phone`}>Best phone number</label>
          <input id={`${id}-phone`} className="hs-input" type="tel" autoComplete="tel" inputMode="tel" value={f.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-e` : undefined} />
          {errors.phone && <p id={`${id}-phone-e`} className="hs-error">{errors.phone}</p>}
        </div>
        <div className="hs-field">
          <label htmlFor={`${id}-time`}>When should we call?</label>
          <select id={`${id}-time`} className="hs-select" value={f.time} onChange={set("time")}>
            <option value="morning">Morning (9 am–12 pm)</option>
            <option value="afternoon">Afternoon (12–5 pm)</option>
            <option value="asap">As soon as possible</option>
          </select>
        </div>
        <fieldset className="hs-field">
          <legend style={{ fontFamily: "inherit", fontSize: 18, fontWeight: 600, letterSpacing: 0, textTransform: "none" }}>Who is the care for?</legend>
          <div className="hs-chips">
            {[["me", "Me"], ["family", "A family member"], ["pro", "I'm a professional"]].map(([v, l]) => (
              <label key={v} className="hs-chip"><input type="radio" name={`${id}-who`} value={v} checked={f.who === v} onChange={set("who")} />{l}</label>
            ))}
          </div>
        </fieldset>
      </div>
      {f.who === "pro" && <p className="hs-preview-note"><Icon name="info" /><span>Referring a patient? Use the <a href={`${BASE}/referrals/#refer`}>secure referral form</a> so documents go straight to intake.</span></p>}
      <p className="hs-hint">We only need this to call you back. Please don&rsquo;t include medical details here; we&rsquo;ll ask what we need when we talk.</p>
      <div className="hs-hero-ctas hs-mt-0">
        <Button type="submit" lead="callback">Request a call</Button>
        <span className="hs-hint">Preview mode: nothing is sent.</span>
      </div>
    </form>
    </div>
  );
}

// Careers: a short application, kept apart from patient intake.
export function ApplyForm() {
  const id = useId();
  const [role, setRole] = useState(ROLES[0].id);
  const [f, setF] = useState({ name: "", email: "", license: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  // "Apply" links on the roles list are #apply-<role>: no element has that id,
  // so this picks the role and brings the form into view itself (the page
  // used to stay put), then puts the cursor in the first field.
  useEffect(() => {
    const pick = () => {
      const m = window.location.hash.match(/^#apply-(\w+)/);
      if (!m || !ROLES.some((r) => r.id === m[1])) return;
      setRole(m[1]);
      const row = document.getElementById("apply");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      document.getElementById(`${id}-name`)?.focus({ preventScroll: true });
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [id]);
  const set = (k) => (e) => { const v = e.target.value; setF((prev) => ({ ...prev, [k]: v })); };
  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!f.name.trim()) err.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = "Enter an email address, like name@example.com.";
    setErrors(err);
    if (Object.keys(err).length) return document.getElementById(`${id}-${Object.keys(err)[0]}`)?.focus();
    setDone(true);
  };
  const title = ROLES.find((r) => r.id === role).title;
  if (done) {
    return (
      <div className="hs-done" role="status">
        <Icon name="check" />
        <h3>Thanks, {f.name.split(" ")[0]}. Your application for {title} is in.</h3>
        <p className="hs-muted">Our hiring team reviews applications within a week and will email you about next steps.</p>
        <p className="hs-hint">Preview mode: this application wasn&rsquo;t sent anywhere.</p>
      </div>
    );
  }
  return (
    <form className="hs-form" onSubmit={submit} noValidate>
      <div className="hs-form-grid">
        <div className="hs-field is-wide">
          <label htmlFor={`${id}-role`}>Role</label>
          <select id={`${id}-role`} className="hs-select" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLES.map((r) => <option key={r.id} value={r.id}>{r.title}, {r.area}</option>)}
          </select>
        </div>
        <div className="hs-field">
          <label htmlFor={`${id}-name`}>Full name</label>
          <input id={`${id}-name`} className="hs-input" autoComplete="name" value={f.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-e` : undefined} />
          {errors.name && <p id={`${id}-name-e`} className="hs-error">{errors.name}</p>}
        </div>
        <div className="hs-field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} className="hs-input" type="email" autoComplete="email" value={f.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-e` : undefined} />
          {errors.email && <p id={`${id}-email-e`} className="hs-error">{errors.email}</p>}
        </div>
        <div className="hs-field is-wide">
          <label htmlFor={`${id}-license`}>License or certification <span className="hs-hint">(optional)</span></label>
          <input id={`${id}-license`} className="hs-input" placeholder="e.g. RN, California" value={f.license} onChange={set("license")} />
        </div>
      </div>
      <div className="hs-hero-ctas hs-mt-0">
        <Button type="submit">Apply for this role</Button>
        <span className="hs-hint">Preview mode: nothing is sent.</span>
      </div>
    </form>
  );
}
