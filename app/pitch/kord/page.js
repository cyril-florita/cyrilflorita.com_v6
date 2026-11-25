import BikeStory from "@/components/kord/BikeStory";
import FindBike from "@/components/kord/FindBike";
import { Header, Footer, Words } from "@/components/kord/ui";
import Preloader from "@/components/kord/Preloader";
import { BIKES, GUARANTEES, DIFFERENCES, money, plain } from "@/components/kord/data";

export default function KordHome() {
  return (
    <>
      <Preloader />
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
              {BIKES.map((b) => (
                <li key={b.id} className={`cd-card cd-card-${b.id}`}>
                  <img className="cd-card-img" src={`/pitch/kord/bikes/${b.id}.webp`} width="1200" height="720" alt={`The Kord ${plain(b.name)}`} loading="lazy" />
                  <div className="cd-card-body">
                    <h3 className="cd-h3">{b.name}</h3>
                    <p className="cd-card-type">{b.type}</p>
                    <p className="cd-card-line">{b.blurb}</p>
                    <dl className="cd-card-specs">
                      <div><dt>Weight</dt><dd>{b.weight} kg</dd></div>
                      <div><dt>Wheels</dt><dd>{b.wheels}</dd></div>
                      <div><dt>Tires</dt><dd>{b.tires}</dd></div>
                    </dl>
                    <div className="cd-card-foot">
                      <p className="cd-card-price">From <strong>{money(b.from)}</strong></p>
                      <a className="cd-card-build" href={`/pitch/kord/build/?bike=${b.id}`}>Build yours<span className="cd-arrow" aria-hidden="true">→</span><span className="cd-sr">: the {plain(b.name)}</span></a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <FindBike />

        {/* The Kord® Guarantee: the guarantees, then how buying one compares (it replaced How it works, 2026-11-24) */}
        <section id="kord-guarantee" className="cd-section">
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
                  <p>{g.line}</p>
                  {g.href && <a className="cd-card-build" href={g.href}>{g.cta}<span className="cd-arrow" aria-hidden="true">→</span></a>}
                </li>
              ))}
            </ul>
            <div className="cd-diff">
              <h3 className="cd-h3">How it compares</h3>
              <div className="cd-diff-scroll" tabIndex={0} role="region" aria-label="How Kord compares, a table that scrolls sideways on small screens">
                <table className="cd-diff-table">
                  <caption className="cd-sr">How buying a Kord compares with a typical online store and a bike shop</caption>
                  <thead>
                    <tr><td /><th scope="col" className="is-kord">Kord®</th><th scope="col">Typical online store</th><th scope="col">Bike shop</th></tr>
                  </thead>
                  <tbody>
                    {DIFFERENCES.map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        <td className="is-kord"><svg className="cd-diff-check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>{r.kord}</td>
                        <td>{r.online}</td>
                        <td>{r.shop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
