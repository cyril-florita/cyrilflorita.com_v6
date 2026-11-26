import { Header, Footer, Words } from "@/components/kord/ui";
import Compare from "@/components/kord/Compare";

export const metadata = {
  title: "Compare the range · Kord",
  description: "The four Kord road bikes side by side: specs, riding position, mounts and geometry. Designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/kord/compare/" },
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        <section className="cd-section cd-compare-page">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h1 className="cd-h2"><Words text="Four bikes, side by side." /></h1>
              <p className="cd-subhead">Compare the range</p>
              <p className="cd-lede">Every frame is carbon, every bike is built to order. Not sure? <a href="/builds/kord/#find">Find your bike</a> in four questions.</p>
            </div>
            <Compare />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
