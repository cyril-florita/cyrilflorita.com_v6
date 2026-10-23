import { BASE, PHONE, REFERRAL_FAX } from "@/components/hearthside/data";
import { PageHead, PhoneLink, Row } from "@/components/hearthside/ui";
import { CallbackForm } from "@/components/hearthside/Forms";

export const metadata = {
  title: "Request a call",
  alternates: { canonical: "/pitch/hearthside/contact/" },
};

export default function Contact() {
  return (
    <div className="hs-wrap">
      <PageHead
        photo={{ shot: "An older parent on the phone at home, her daughter beside her", src: "/img/hearthside/photos/family-phone", alt: "An older woman talks on the phone on her sofa while her daughter sits close", position: "50% 30%" }}
        title="Request a call"
        lede="Tell us how to reach you and our intake team will call within one business day. No forms about your medical history: we'll ask what we need when we talk."
      />
      <Row label="Call me back" labelledBy="ct-form">
        <h2 id="ct-form" className="hs-visually-hidden">Request a call</h2>
        <div style={{ maxWidth: 760 }}><CallbackForm /></div>
      </Row>
      <Row label="Other ways" labelledBy="ct-other" tight>
        <h2 id="ct-other" className="hs-visually-hidden">Other ways to reach us</h2>
        <ul className="hs-ruled">
          <li><h3>Call intake</h3><p style={{ marginTop: 10 }}><PhoneLink /></p><p className="hs-muted">Monday to Friday, 8 am to 6 pm. On-call nurses after hours for current patients.</p></li>
          <li><h3>Referring a patient?</h3><p className="hs-muted">Use the <a href={`${BASE}/referrals/#refer`}>secure referral form</a>, or fax {REFERRAL_FAX}.</p></li>
          <li><h3>Emergencies</h3><p className="hs-muted">If someone needs urgent medical help, call 911.</p></li>
          <li><h3>Our office</h3><p className="hs-muted">Van Nuys, serving the San Fernando and Santa Clarita Valleys. Visits by appointment. <a href={PHONE.href}>Call first</a>.</p></li>
        </ul>
      </Row>
    </div>
  );
}
