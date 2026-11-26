import Personalize from "@/components/viteo/Personalize";

export const metadata = {
  title: "Personalize your vitamin pack",
  description: "Eight quick questions build a daily vitamin pack, with the reason for every pill. A live, working personalization flow from Viteo, designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/viteo/personalize/" },
};

export default function PersonalizePage() {
  return <Personalize />;
}
