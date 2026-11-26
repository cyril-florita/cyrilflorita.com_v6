import { Header, Footer } from "@/components/kord/ui";
import StudioHero from "@/components/kord/StudioHero";
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
        {/* the opening is the Guarantee page's (StudioHero, the user's call, 2026-11-25): the heading, and the 3D Arc to drag round */}
        <StudioHero title="Fitted to you, from home." subhead="Virtual fit"
          lede="Five measurements with a tape and a book. We set the stem, bar and saddle before the bike ships." />
        <section className="cd-section cd-fit-page" aria-label="Your measurements">
          <div className="cd-wrap">
            <Fit />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
