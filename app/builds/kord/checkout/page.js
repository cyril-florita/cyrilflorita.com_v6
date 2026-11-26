import { Header, Footer } from "@/components/kord/ui";
import Checkout from "@/components/kord/Checkout";

export const metadata = {
  title: "Checkout · Kord",
  description: "Kord's checkout, in preview: nothing is charged. Designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/kord/checkout/" },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        <section className="cd-section cd-compare-page">
          <div className="cd-wrap"><Checkout /></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
