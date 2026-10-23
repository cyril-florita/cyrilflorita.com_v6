import IntakeShell from "@/components/hearthside/IntakeShell";
import "@/app/pitch/hearthside/css/intake.css";

// The intake system (staff side of the pitch): its own app shell, sample data
// in the browser only. Not indexed.
export const metadata = {
  title: { default: "Intake", template: "%s · Intake — Hearthside Home Health" },
  robots: { index: false, follow: false },
  // No canonical: the root layout's "/" would otherwise point every intake
  // screen at the portfolio home page.
  alternates: { canonical: null },
};

export default function IntakeLayout({ children }) {
  return <IntakeShell>{children}</IntakeShell>;
}
