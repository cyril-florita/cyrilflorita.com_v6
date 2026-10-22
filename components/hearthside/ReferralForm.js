"use client";
import { useState } from "react";
import { BASE } from "./data";
import { DOCS, PARTNER_ORGS, SERVICE_OPTIONS, samplePatient } from "./intake-data";
import { submitReferral } from "./store";
import { Button, Icon } from "./ui";

// The secure referral form, in preview mode: the patient is a generated
// sample (read-only fields, "New sample patient" shuffles them), so no real
// health information can be entered. The referrer picks the organization,
// the services and which sample documents to attach. Sending adds the
// referral to the intake system in this browser (store.js).

const FILES = { order: "Physician-order.pdf", f2f: "Face-to-face-note.pdf", hp: "Discharge-summary.pdf", meds: "Medication-list.pdf", insurance: "Insurance-card.jpg", demo: "Demographics.pdf" };

export default function ReferralForm() {
  const [patient, setPatient] = useState(() => samplePatient(0.37));
  const [source, setSource] = useState(PARTNER_ORGS[0].id);
  const [services, setServices] = useState(patient.services);
  const [docs, setDocs] = useState(["order", "hp", "meds"]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(null);
  const org = PARTNER_ORGS.find((p) => p.id === source);

  const shuffle = () => {
    const p = samplePatient(Math.random());
    setPatient(p);
    setServices(p.services);
  };
  const toggle = (list, set, id) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const send = (e) => {
    e.preventDefault();
    if (!services.length) return setError("Choose at least one service.");
    if (!consent) return setError("Please confirm the patient or their representative agreed to the referral.");
    setError("");
    const id = submitReferral({
      patient: { name: patient.name, age: patient.age, zip: patient.zip, town: patient.town, reason: patient.reason },
      source, contact: org.contact.split(",")[0], services, payer: patient.payer, docs,
    });
    setSent({ id, at: Date.now() });
    window.scrollTo({ top: document.getElementById("refer")?.offsetTop - 100, behavior: "smooth" });
  };

  if (sent) {
    const status = `${BASE}/status/?ref=${sent.id}`;
    return (
      <div className="hs-ack" role="status">
        <span className="hs-label">Referral received</span>
        <p className="hs-ack-ref">{sent.id}</p>
        <p>Received {new Date(sent.at).toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "2-digit" })}. Here&rsquo;s what happens next:</p>
        <ul className="hs-list">
          <li><Icon name="check" size={20} />It&rsquo;s routed to the intake coordinator for the patient&rsquo;s area right away.</li>
          <li><Icon name="check" size={20} />They call the patient or family, usually within two hours during business hours.</li>
          <li><Icon name="check" size={20} />If anything is missing, we&rsquo;ll ask through the secure portal, not by email.</li>
          <li><Icon name="check" size={20} />The status link shows progress without any health details, so it&rsquo;s safe to share with your team.</li>
        </ul>
        <div className="hs-copy"><code>cyrilflorita.com{status}</code></div>
        <div className="hs-ack-actions">
          <Button href={`${BASE}/intake/?arrive=${sent.id}`} icon="arrow">Watch it arrive in intake</Button>
          <Button href={status} variant="secondary">Check status</Button>
          <Button variant="quiet" onClick={() => { setSent(null); shuffle(); setConsent(false); }}>Send another</Button>
        </div>
        <p className="hs-hint">Preview mode: this referral exists only in your browser, for the demo.</p>
      </div>
    );
  }

  return (
    <form className="hs-form" onSubmit={send} noValidate>
      <div className="hs-preview-note">
        <Icon name="shield" />
        <p><strong>Preview mode.</strong> This form can&rsquo;t take real patient details: the patient below is a generated sample, and sending only adds it to the demo intake system in your browser.</p>
      </div>

      <fieldset>
        <legend>Referring organization</legend>
        <div className="hs-form-grid">
          <div className="hs-field">
            <label htmlFor="rf-org">Organization</label>
            <select id="rf-org" className="hs-select" value={source} onChange={(e) => setSource(e.target.value)}>
              {PARTNER_ORGS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="hs-field">
            <label htmlFor="rf-contact">Your name and role</label>
            <input id="rf-contact" className="hs-input" value={org.contact} readOnly />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Patient <span className="hs-sample" style={{ marginLeft: 8 }}>Sample patient</span></legend>
        <div className="hs-form-grid">
          <div className="hs-field"><label htmlFor="rf-name">Name</label><input id="rf-name" className="hs-input" value={patient.name} readOnly /></div>
          <div className="hs-field"><label htmlFor="rf-age">Age</label><input id="rf-age" className="hs-input" value={patient.age} readOnly /></div>
          <div className="hs-field"><label htmlFor="rf-zip">Home ZIP code</label><input id="rf-zip" className="hs-input" value={`${patient.zip} · ${patient.town}`} readOnly /></div>
          <div className="hs-field"><label htmlFor="rf-payer">Insurance</label><input id="rf-payer" className="hs-input" value={patient.payer} readOnly /></div>
          <div className="hs-field is-wide"><label htmlFor="rf-reason">Reason for referral</label><input id="rf-reason" className="hs-input" value={patient.reason} readOnly /></div>
        </div>
        <div><Button variant="quiet" icon="arrow" onClick={shuffle}>New sample patient</Button></div>
      </fieldset>

      <fieldset>
        <legend>Services requested</legend>
        <div className="hs-chips">
          {SERVICE_OPTIONS.map((s) => (
            <label key={s.id} className="hs-chip">
              <input type="checkbox" checked={services.includes(s.id)} onChange={() => toggle(services, setServices, s.id)} />
              {services.includes(s.id) && <Icon name="check" size={18} />}{s.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Documents</legend>
        <p className="hs-hint">Attach what you have. Anything missing is flagged for our team to request, so it won&rsquo;t hold up the referral.</p>
        <ul className="hs-docs">
          {DOCS.map((d) => {
            const on = docs.includes(d.id);
            return (
              <li key={d.id}>
                <span className="hs-doc-name">
                  <Icon name={on ? "check" : "clipboard"} size={20} />
                  <span>{d.name}{!d.required && <span className="hs-hint"> (optional)</span>}{on && <><br /><span className="hs-doc-file">{FILES[d.id]} · sample file</span></>}</span>
                </span>
                <button type="button" className="hs-doc-toggle" aria-pressed={on} onClick={() => toggle(docs, setDocs, d.id)}>
                  {on ? "Attached" : "Attach sample"}<span className="hs-visually-hidden"> {d.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <label className="hs-check"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> The patient or their representative agreed to this referral.</label>
      {error && <p className="hs-error" role="alert">{error}</p>}
      <div className="hs-hero-ctas" style={{ marginTop: 0 }}>
        <Button type="submit" icon="arrow">Send referral securely</Button>
      </div>
    </form>
  );
}
