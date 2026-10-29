import { BASE, PHONE } from "@/components/hearthside/data";
import { Button, PageHead, Row } from "@/components/hearthside/ui";
import AreaMap from "@/components/hearthside/AreaMap";

export const metadata = {
  title: "Service area",
  alternates: { canonical: "/pitch/hearthside/service-area/" },
};

export default function ServiceArea() {
  return (
    <div className="hs-wrap">
      <PageHead
        title="Where we provide care"
        lede="Across the San Fernando and Santa Clarita Valleys. Check your ZIP code to see if we serve your address."
      />
      <Row label="The map" labelledBy="sa-map">
        <h2 id="sa-map" className="hs-visually-hidden">Map and ZIP check</h2>
        <AreaMap />
      </Row>
      <Row label="Outside the area" labelledBy="sa-outside" tight>
        <div className="hs-two">
          <div className="hs-prose">
            <h2 id="sa-outside">Not in our area?</h2>
            <p>Call us anyway. We&rsquo;ll help you find a home health agency that serves your address, and your doctor&rsquo;s office can usually suggest one too.</p>
          </div>
          <div className="hs-hero-ctas" style={{ marginTop: 0 }}>
            <Button href={PHONE.href} icon="arrow">Call {PHONE.display}</Button>
            <Button href="#request-a-call" variant="secondary">Request a call</Button>
          </div>
        </div>
      </Row>
    </div>
  );
}
