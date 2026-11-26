import Emails from "@/components/viteo/Emails";

export const metadata = {
  title: "Emails and messages",
  description: "Viteo's lifecycle messages: the shipping reminder with one-tap skip and pause, the order confirmation and the daily reminder text. Designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/viteo/emails/" },
};

export default function EmailsPage() {
  return <Emails />;
}
