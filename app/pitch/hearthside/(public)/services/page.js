import { BASE, SERVICES } from "@/components/hearthside/data";
import { Button, Icon, PageHead, Photo, Row } from "@/components/hearthside/ui";
import CareGuide from "@/components/hearthside/CareGuide";

export const metadata = {
  title: "Services",
  alternates: { canonical: "/pitch/hearthside/services/" },
};

export default function Services() {
  return (
    <div className="hs-wrap">
      <PageHead
        photo={{ shot: "A nurse dresses a wound on a patient's arm at home", src: "/img/hearthside/photos/svc-nursing", alt: "A nurse in blue scrubs dresses a wound on an older man's forearm in his living room", position: "60% 35%" }}
        title="Skilled care, in your own home"
        lede="Home health is medical care your doctor orders, delivered by licensed clinicians who visit on a schedule. Here's what each kind of care covers, and how to tell whether home health is what you need."
      />

      <Row label="What we provide" labelledBy="sv-list">
        <h2 id="sv-list" className="hs-visually-hidden">What we provide</h2>
        {/* The same cards as Home's "Skilled care" section, with what each covers. */}
        <ul className="hs-services">
          {SERVICES.map((s) => (
            <li key={s.id} id={s.id} className="hs-service hs-service-detail">
              <Photo shot={s.photo.shot} src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(max-width: 760px) 92vw, (max-width: 960px) 45vw, 28vw" />
              <h3><Icon name={s.icon} />{s.name}</h3>
              <p>{s.lead}</p>
              <span className="hs-label">Often includes</span>
              <ul>{s.covers.map((c) => <li key={c}>{c}</li>)}</ul>
            </li>
          ))}
        </ul>
      </Row>

      <Row id="which-care" label="Which care fits?" labelledBy="sv-guide">
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="sv-guide">Home health or home care?</h2>
            <p>They sound alike but they&rsquo;re different services. <strong>Home health</strong> is skilled, medical care ordered by a doctor, such as nursing or therapy, usually for a period of recovery. <strong>Home care</strong> is non-medical help with daily life, like meals, housekeeping, or companionship.</p>
            <p>Medicare can cover home health when certain conditions are met. It generally doesn&rsquo;t cover ongoing non-medical help on its own.</p>
            <p><Button href={`${BASE}/getting-started/#coverage`} variant="quiet" icon="arrow">How coverage works</Button></p>
          </div>
          <CareGuide />
        </div>
      </Row>

      <Row label="How visits work" labelledBy="sv-visits">
        <h2 id="sv-visits">Visits that fit around your life</h2>
        <ul className="hs-ruled" style={{ marginTop: 32 }}>
          <li><h3>Scheduled, not round-the-clock</h3><p className="hs-muted">Clinicians visit for set appointments, often a few times a week, following the plan your doctor approves.</p></li>
          <li><h3>Your doctor stays in charge</h3><p className="hs-muted">We send updates to your doctor and adjust the plan with them as you progress.</p></li>
          <li><h3>Family in the loop</h3><p className="hs-muted">With your permission, a family member can get visit times and updates.</p></li>
          <li><h3>One number to call</h3><p className="hs-muted">Questions between visits go to the same intake team that set up your care.</p></li>
        </ul>
      </Row>
    </div>
  );
}
