import { BASE, HOURS, PHONE, REFERRAL_FAX } from "@/components/hearthside/data";
import { DOCS, LIAISONS } from "@/components/hearthside/intake-data";
import { Button, Icon, PageHead, Row, Sample } from "@/components/hearthside/ui";
import ReferralForm from "@/components/hearthside/ReferralForm";

export const metadata = {
  title: "For referral partners",
  alternates: { canonical: "/pitch/hearthside/referrals/" },
};

// For physicians, hospitals and discharge planners: separate from the family
// pages, with the checklist, the secure (preview-mode) referral form, the
// status link and who to contact.

export default function Referrals() {
  return (
    <div className="hs-wrap">
      <PageHead
        photo={{ shot: "A clinician talks a care plan through with an older patient", src: "/img/hearthside/photos/pro-consult", alt: "A smiling nurse in blue scrubs talks with an older woman across a desk", position: "50% 35%" }}
        title={<>Refer a <em className="hs-title-em">patient</em></>}
        lede="For physicians, hospitals, discharge planners, and senior communities. Send a referral securely, see it acknowledged right away, and follow it from received to start of care."
      >
        <div className="hs-hero-ctas hs-mt-32">
          <Button href="#refer" lead="refer">Start a referral</Button>
          <Button href="#checklist" variant="secondary" lead="checklist">See the checklist</Button>
        </div>
      </PageHead>

      <Row label="Why partners refer" labelledBy="rf-why">
        <h2 id="rf-why" className="hs-visually-hidden">Why partners refer to us</h2>
        <ul className="hs-ruled">
          <li><h3>A fast first call</h3><p className="hs-muted">Every referral is routed to the coordinator for the patient&rsquo;s area the moment it arrives, and they call the family the same day.</p></li>
          <li><h3>No chasing paperwork</h3><p className="hs-muted">Send what you have. Missing documents are flagged and requested through the secure portal, not by email or fax tag.</p></li>
          <li><h3>Status you can see</h3><p className="hs-muted">A status link shows where each referral stands, from received to start of care, without any health details.</p></li>
          <li><h3>A straight answer</h3><p className="hs-muted">If we can&rsquo;t accept a referral, we tell you why and suggest agencies that can, so your patient isn&rsquo;t left waiting.</p></li>
        </ul>
      </Row>

      <Row id="checklist" label="Checklist" labelledBy="rf-check">
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="rf-check">Referral checklist</h2>
            <p>What helps us accept a referral quickly. Only the first five are required, and you don&rsquo;t need them all to send: we&rsquo;ll request anything missing.</p>
            <p>Patients must live in our <a href={`${BASE}/service-area/`}>service area</a>, be under a physician&rsquo;s care, and need intermittent skilled services.</p>
          </div>
          <ul className="hs-list">
            {DOCS.map((d) => <li key={d.id}><Icon name={d.required ? "check" : "info"} size={20} />{d.name}{!d.required && " (optional)"}</li>)}
          </ul>
        </div>
      </Row>

      <Row id="refer" label="Secure referral" labelledBy="rf-form">
        <h2 id="rf-form" className="hs-mb-32">Send a referral</h2>
        <ReferralForm />
      </Row>

      <Row label="Your contacts" labelledBy="rf-contacts" tight>
        <h2 id="rf-contacts" className="hs-visually-hidden">Your contacts</h2>
        <ul className="hs-ruled">
          {LIAISONS.map((l) => <li key={l.id}><h3>{l.name}</h3><p className="hs-muted">{l.role}</p><p className="hs-mt-8"><Sample /></p></li>)}
          <li><h3>Intake line</h3><p className="hs-muted"><a href={PHONE.href}>{PHONE.display}</a>, {HOURS}, with on-call coverage after hours.</p></li>
          <li><h3>Referral fax</h3><p className="hs-muted">{REFERRAL_FAX}, if your system can&rsquo;t use the secure form. We&rsquo;ll confirm receipt by phone.</p></li>
        </ul>
      </Row>
    </div>
  );
}
