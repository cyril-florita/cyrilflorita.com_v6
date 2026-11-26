import BikeStory from "@/components/kord/BikeStory";
import { Header, Footer, Words } from "@/components/kord/ui";
import RangeCard from "@/components/kord/RangeCard";
import { BIKES, GUARANTEES } from "@/components/kord/data";

export default function KordHome() {
  return (
    <>
      <Header />
      <main id="main">
        <BikeStory />

        <section id="range" className="cd-section">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h2 className="cd-h2"><Words text="Four bikes. One for every road." /></h2>
              <p className="cd-subhead">The range</p>
            </div>
            <ul className="cd-range">
              {BIKES.map((b) => <RangeCard key={b.id} id={b.id} />)}
            </ul>
          </div>
        </section>

        {/* Help me choose lives in a dialog (FindModal, in the layout) since 2026-11-25; this band opens it */}
        <section id="find" className="cd-section cd-find-band">
          <div className="cd-wrap cd-find-band-row">
            <div>
              <h2 className="cd-h2"><Words text="Not sure which one?" /></h2>
              <p className="cd-subhead">Answer four questions</p>
            </div>
            <button type="button" className="cd-btn cd-btn-primary" data-open-find>Help me choose<span className="cd-arrow" aria-hidden="true">→</span></button>
          </div>
        </section>

        {/* The Kord® Guarantee has its own page since 2026-11-25; here, a teaser: the four figures and titles (their terms are on the page), linking there */}
        <section id="kord-guarantee" className="cd-section cd-guar-teaser">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h2 className="cd-h2"><Words text="Bought online. Backed for life." /></h2>
              <p className="cd-subhead">The Kord® Guarantee</p>
            </div>
            <ul className="cd-steps cd-guarantees">
              {GUARANTEES.map((g) => (
                <li key={g.id} className="cd-step">
                  <span className="cd-step-n cd-guarantee-n">{g.figure}</span>
                  <h3 className="cd-h3">{g.title}</h3>
                </li>
              ))}
            </ul>
            <a className="cd-btn cd-btn-ghost cd-guar-more" href="/pitch/kord/guarantee/">Read more of the Kord® Guarantee<span className="cd-arrow" aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="cd-band">
          <div className="cd-wrap cd-band-row">
            <h2 className="cd-band-title"><Words text="Your next ride starts here." /></h2>
            <a className="cd-btn cd-btn-dark" href="#range">Shop bikes<span className="cd-arrow" aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
