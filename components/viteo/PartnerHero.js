import Link from "next/link";
import { Arrow, BigWordHead, Button } from "./ui";

// The partners hero bento: a large circle photo of a smiling trainer on the
// left (public/img/viteo/partners-trainer.webp, always cropped from the top by
// CSS so the smile stays in frame), the pitch on the right. It opens
// /partners/ (an h1, with in-page links) and is the landing's "For
// professionals" section (an h2, with links into /partners/): `base` is the
// path the two links point at.
export default function PartnerHero({ headingAs: Heading = "h1", headingId, base = "", eager = false }) {
  return (
    <div className="dl-pro-hero dl-panel dl-panel-1">
      <span className="dl-pro-photo">
        <img
          src="/img/viteo/partners-trainer.webp"
          width="784"
          height="1168"
          alt="A smiling trainer holding a phone"
          {...(eager ? { fetchPriority: "high" } : { loading: "lazy" })}
          decoding="async"
        />
      </span>
      <div className="dl-pro-hero-copy">
        <BigWordHead word="Partners">
          <Heading id={headingId} className="dl-display">Your clients ask what to take. <em>Give them a clear answer.</em></Heading>
        </BigWordHead>
        <p className="dl-lede">
          Viteo for trainers, dietitians and nutritionists: share a personalized pack that explains every pill, give
          your clients 15% off their first box, and earn on every box they keep.
        </p>
        <div className="dl-ds-row">
          <Button href={`${base}#pro-apply`}>Apply to partner <Arrow /></Button>
          <Link className="dl-textlink" href={`${base}#pro-earnings`}>Estimate your earnings</Link>
        </div>
      </div>
    </div>
  );
}
