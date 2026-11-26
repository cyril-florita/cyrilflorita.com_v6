import Plan from "@/components/viteo/Plan";

export const metadata = {
  title: "Your plan",
  robots: { index: false, follow: true },
  alternates: { canonical: "/builds/viteo/plan/" },
};

export default function PlanPage() {
  return <Plan />;
}
