"use client";
import { useState } from "react";
import { BASE, PHONE } from "./data";
import { Button } from "./ui";

// "Which kind of care fits?" One question, and a plain answer that points to
// the right next step. It explains the difference between skilled home
// health and non-medical home care; it never decides eligibility or
// coverage, and says so.

const OPTIONS = [
  { id: "medical", label: "Medical care at home", hint: "After a hospital stay, surgery, illness, or injury: wound care, medications, therapy." },
  { id: "daily", label: "Everyday help", hint: "Meals, housekeeping, errands, companionship, or someone to be there." },
  { id: "both", label: "Some of both", hint: "Medical needs, plus help with day-to-day life." },
  { id: "unsure", label: "I'm not sure yet", hint: "Something has changed and you're working out what's needed." },
];

const RESULTS = {
  medical: {
    title: "That sounds like home health",
    text: "Skilled home health is medical care your doctor orders: nurses and therapists visit on a schedule. It's what Hearthside provides. Your doctor and our intake team confirm whether it's the right fit and whether it's covered.",
    cta: "home",
  },
  daily: {
    title: "That sounds like non-medical home care",
    text: "Help with meals, housekeeping, and companionship is non-medical home care, a different service that Hearthside doesn't provide. The Eldercare Locator (a public service of the U.S. Administration on Aging) can point you to local options, and our intake team is happy to help you think it through.",
    cta: "elsewhere",
  },
  both: {
    title: "Many families use both",
    text: "Home health can cover the medical side while a home care agency helps with daily life. Start with a call: we'll talk through what home health can do and what you may need alongside it.",
    cta: "home",
  },
  unsure: {
    title: "Start with a conversation",
    text: "That's very common. Call our intake team or request a call back: we'll ask a few questions, explain your options in plain language and, if home health fits, work with your doctor on next steps.",
    cta: "home",
  },
};

export default function CareGuide() {
  const [pick, setPick] = useState(null);
  const r = pick && RESULTS[pick];
  return (
    <div className="hs-guide">
      <fieldset>
        <legend>What kind of help is needed?</legend>
        <div className="hs-guide-opts">
          {OPTIONS.map((o) => (
            <label key={o.id} className="hs-guide-opt">
              <input type="radio" name="hs-care" value={o.id} checked={pick === o.id} onChange={() => setPick(o.id)} />
              <span><b>{o.label}</b><span>{o.hint}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="hs-guide-result" role="status" aria-live="polite">
        {r ? (
          <>
            <h3>{r.title}</h3>
            <p>{r.text}</p>
            <div className="hs-hero-ctas">
              {r.cta === "home" ? (
                <>
                  <Button href="#request-a-call" icon="arrow">Request a call</Button>
                  <Button href={PHONE.href} variant="secondary">Call {PHONE.display}</Button>
                </>
              ) : (
                <>
                  <Button href="https://eldercare.acl.gov" variant="secondary" icon="external">Eldercare Locator</Button>
                  <Button href="#request-a-call" variant="quiet" icon="arrow">Talk it through with us</Button>
                </>
              )}
            </div>
          </>
        ) : (
          <p>Choose the option that sounds closest. This is a guide, not a decision: your doctor and our team confirm what fits.</p>
        )}
      </div>
    </div>
  );
}
