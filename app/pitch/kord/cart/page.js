import { Header, Footer, Words } from "@/components/kord/ui";
import Cart from "@/components/kord/CartView";

export const metadata = {
  title: "Your cart · Kord",
  description: "Your Kord builds. A design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/kord/cart/" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        <section className="cd-section cd-compare-page">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h1 className="cd-h2"><Words text="Your cart" /></h1>
            </div>
            <Cart />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
