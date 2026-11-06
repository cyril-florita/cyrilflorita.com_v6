import { Suspense } from "react";
import ReferralRecord from "@/components/hearthside/ReferralRecord";
import { Skeleton } from "@/components/hearthside/ui";

export const metadata = { title: "Referral" };

// ReferralRecord reads ?id= with useSearchParams, so it renders on the client
// below this boundary; the static HTML carries the skeleton.
export default function Referral() {
  return (
    <Suspense fallback={<Skeleton blocks={2} />}>
      <ReferralRecord />
    </Suspense>
  );
}
