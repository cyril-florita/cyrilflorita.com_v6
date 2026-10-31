import { BASE, MEDICARE_CONDITIONS, MEDICARE_URL, PHONE, STEPS } from "@/components/hearthside/data";
import { Button, CallButton, CallBand, Icon, PageHead, Photo, Row } from "@/components/hearthside/ui";
import { StepStory } from "@/components/hearthside/client";

export const metadata = {
  title: "Getting started",
  alternates: { canonical: "/pitch/hearthside/getting-started/" },
};

// How care begins, what to have ready, the first visit, and coverage
// guidance. Coverage copy is general and points to medicare.gov; nothing here
// decides eligibility.

const READY = [
  "Your doctor's name and phone number",
  "Your Medicare or insurance card",
  "A list of current medications (or the bottles nearby)",
  "Hospital discharge papers, if you have them",
  "The best number to reach you or a family member",
];

const FIRST_VISIT = [
  ["Getting to know you", "Your nurse or therapist asks about your health, your goals, and what a normal day looks like."],
  ["Medications", "We review everything you take, including vitamins and over-the-counter medicines."],
  ["Home safety", "We look at stairs, rugs, the bathroom, and lighting, and suggest simple changes."],
  ["Your plan", "We work with your doctor on a plan of care: which services, how often, and for how long."],
];

export default function GettingStarted() {
  return (
    <div className="hs-wrap">
      <PageHead
        photo={{ shot: "A nurse talks a care plan through with a patient and her daughter", src: "/img/hearthside/photos/step-4", alt: "A nurse talks a care plan through with an older woman and her daughter at home", position: "50% 9%", ratio: "16 / 8" }}
        title={<>How <em className="hs-title-em">care begins</em></>}
        lede="From your first call to your first visit, usually in a few days. We'll tell you what's happening at every step, and we do the paperwork with your doctor's office."
      >
        <div className="hs-hero-ctas" style={{ marginTop: 28 }}>
          {/* As on Home: Call first (filled, phone icon), then Request a call. */}
          <CallButton />
          <Button href="#request-a-call" variant="secondary" lead="callback">Request a call</Button>
        </div>
      </PageHead>

      <Row label="The steps" labelledBy="gs-steps">
        <h2 id="gs-steps" className="hs-visually-hidden">The steps</h2>
        {/* Desktop: the pinned scroll story, as on Home (StepStory). */}
        <StepStory>
        <ol className="hs-ruled hs-swipe">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hs-step">
              <Photo shot={s.title} src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(max-width: 760px) 55vw, 30vw" />
              <span className="hs-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        </StepStory>
      </Row>

      <Row label="Have ready" labelledBy="gs-ready">
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="gs-ready">What to have ready when you call</h2>
            <p>Don&rsquo;t worry if you don&rsquo;t have everything. We can get most of it from your doctor&rsquo;s office.</p>
          </div>
          <ul className="hs-list">
            {READY.map((r) => <li key={r}><Icon name="check" size={20} />{r}</li>)}
          </ul>
        </div>
      </Row>

      {/* A sand chapter for the first visit (hearthside.css, .hs-chapter). */}
      <div className="hs-chapter is-sand">
      <Row label="The first visit" labelledBy="gs-first">
        <h2 id="gs-first">What happens at the first visit</h2>
        <p className="hs-lede">It usually takes one to two hours, at your home. A family member is welcome to join.</p>
        <ul className="hs-ruled">
          {FIRST_VISIT.map(([t, d]) => <li key={t}><h3>{t}</h3><p className="hs-muted">{d}</p></li>)}
        </ul>
      </Row>
      </div>

      <Row id="coverage" label="Insurance & payment" labelledBy="gs-coverage">
        <div className="hs-coverage">
          <div>
            <h2 id="gs-coverage">Coverage, in plain language</h2>
            <h3 style={{ marginTop: 32 }}>Medicare</h3>
            <p style={{ marginTop: 10 }}>Medicare covers home health care when certain conditions are met. Generally:</p>
            <ul className="hs-checks">
              {MEDICARE_CONDITIONS.map((c) => <li key={c}><Icon name="check" size={20} />{c}</li>)}
            </ul>
            <h3 style={{ marginTop: 32 }}>Medicare Advantage and other plans</h3>
            <p className="hs-muted">We work with many Medicare Advantage and commercial plans. Some need approval before care starts; we handle that request with your doctor&rsquo;s office.</p>
            <h3 style={{ marginTop: 32 }}>What home health doesn&rsquo;t cover</h3>
            <p className="hs-muted">Round-the-clock care, and non-medical help such as meals, housekeeping, or companionship on their own.</p>
          </div>
          <div>
            <div className="hs-note">
              <Icon name="info" />
              <p>
                <strong>This is general guidance, not a coverage decision.</strong> Your doctor and our intake team confirm eligibility, and we review your coverage with you before care begins, so there are no surprises.
              </p>
            </div>
            <div className="hs-coverage-links">
              <a href={MEDICARE_URL}>Medicare&rsquo;s home health guide <span className="hs-visually-hidden">(opens medicare.gov)</span></a>
              <a href={PHONE.href}>Questions? Call {PHONE.display}</a>
            </div>
          </div>
        </div>
      </Row>
      {/* The closing "start with a call" band, as on Home: the last section before the footer. */}
      <CallBand title="Ready when you are. Start with a call." lede={<>Our intake team checks your coverage and sets up the first visit with your doctor&rsquo;s office. No forms about your medical history: we&rsquo;ll ask what we need when we talk.</>} />
    </div>
  );
}
