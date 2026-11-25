import { Header, Footer, Words } from "@/components/kord/ui";
import Fit from "@/components/kord/Fit";

export const metadata = {
  title: "Virtual fit · Kord",
  description: "Five measurements and a starting fit for your Kord: size, saddle height, crank, stem and bar. A design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/kord/fit/" },
  robots: { index: false, follow: true },
};

export default function FitPage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        <section className="cd-section cd-compare-page">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h1 className="cd-h2"><Words text="Fitted to you, from home." /></h1>
              <p className="cd-subhead">Virtual fit</p>
              <p className="cd-lede">Five measurements with a tape and a book. We set the stem, bar and saddle before the bike ships.</p>
            </div>
            <Fit />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
