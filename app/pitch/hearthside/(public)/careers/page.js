import { ROLES } from "@/components/hearthside/data";
import { Button, PageHead, Photo, Row, Sample } from "@/components/hearthside/ui";
import { ApplyForm } from "@/components/hearthside/Forms";

export const metadata = {
  title: "Careers",
  alternates: { canonical: "/pitch/hearthside/careers/" },
};

export default function Careers() {
  return (
    <div className="hs-wrap">
      <PageHead
        title="Care for your neighbors"
        lede="Nurses, therapists, aides, and coordinators who want to do their best work close to home, with the time to do it well."
      >
        <div className="hs-hero-ctas" style={{ marginTop: 28 }}><Button href="#roles" icon="arrow">See open roles</Button></div>
      </PageHead>

      <Row label="The work" labelledBy="cr-work">
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="cr-work">What the work is really like</h2>
            <p>Home health means driving between patients&rsquo; homes, working on your own for much of the day, and seeing the difference you make in the place people actually live. It&rsquo;s independent, and it&rsquo;s never the same twice.</p>
            <ul className="hs-list" style={{ marginTop: 8 }}>
              <li>Caseloads planned around where you live, to keep drive time down</li>
              <li>Mileage reimbursed, with a company tablet and phone</li>
              <li>Mentoring for clinicians new to home health</li>
              <li>Paid continuing education every year</li>
            </ul>
            <p><Sample>Sample benefits</Sample></p>
          </div>
          {/* Supplied by Cyril (AI-generated with Perplexity); same grade. */}
          <Photo shot="A nurse and her patient smiling together at home" alt="A smiling nurse in blue scrubs, holding a tablet, sits beside an older woman on her sofa" src="/img/hearthside/photos/careers-nurse-smiling" position="50% 30%" ratio="16 / 10" sizes="(max-width: 960px) 92vw, 40vw" />
        </div>
      </Row>

      <Row id="roles" label="Open roles" labelledBy="cr-roles">
        <h2 id="cr-roles" style={{ marginBottom: 32 }}>Open roles <Sample /></h2>
        <ul className="hs-roles">
          {ROLES.map((r) => (
            <li key={r.id} className="hs-role">
              <div><h3>{r.title}</h3><p>{r.text}</p></div>
              <div className="hs-role-meta"><span>{r.area}</span><span>{r.type}</span></div>
              <Button href={`#apply-${r.id}`} variant="secondary" size="sm">Apply<span className="hs-visually-hidden"> for {r.title}</span></Button>
            </li>
          ))}
        </ul>
      </Row>

      <Row id="apply" label="Apply" labelledBy="cr-apply">
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="cr-apply">Apply</h2>
            <p>A short application to start the conversation. It goes to our hiring team, completely separate from patient intake.</p>
          </div>
          <ApplyForm />
        </div>
      </Row>
    </div>
  );
}
