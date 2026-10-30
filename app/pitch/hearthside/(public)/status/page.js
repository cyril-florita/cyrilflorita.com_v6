import { PageHead, Row } from "@/components/hearthside/ui";
import StatusTracker from "@/components/hearthside/StatusTracker";

export const metadata = {
  title: "Referral status",
  alternates: { canonical: "/pitch/hearthside/status/" },
  // Only useful with a ?ref= reference, so not indexed.
  robots: { index: false, follow: true },
};

export default function Status() {
  return (
    <div className="hs-wrap">
      <PageHead
        title={<>Referral <em className="hs-title-em">status</em></>}
        lede="Where a referral stands, from received to start of care. No health details are shown here, so the link is safe to share with your team."
      />
      <Row label="Status" labelledBy="st">
        <span id="st" className="hs-visually-hidden">Status</span>
        <StatusTracker />
      </Row>
    </div>
  );
}
