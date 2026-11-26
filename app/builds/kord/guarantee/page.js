import { Header, Footer, Words } from "@/components/kord/ui";
import { GUARANTEES, RETURN_STEPS, DIFFERENCES } from "@/components/kord/data";
import StudioHero from "@/components/kord/StudioHero";

// The Kord® Guarantee, its own page since 2026-11-25 (the user's call; it was a section of the landing, which
// now has a teaser linking here): a bike in the studio, the four guarantees and their terms, how a
// return works, how buying a Kord compares with a typical online store and a bike shop, then the promise
// and the calls to action in the closing band.
export const metadata = {
  title: "The Kord® Guarantee · Kord",
  description: "Ride it for 30 days, a lifetime frame warranty, crash replacement, and a year of fit adjustments. A design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/kord/guarantee/" },
  robots: { index: false, follow: true },
};

const Check = () => (
  <svg className="cd-diff-check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function GuaranteePage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        {/* the hero (StudioHero, shared with Virtual fit): the heading, and the landing's 3D Arc to drag round
            (the user's calls, 2026-11-25: a still of the Meridian at first, with copy and buttons that moved to the closing band) */}
        <StudioHero title="Four plain guarantees. No fine print surprises." subhead="What's covered" />

        <section className="cd-section cd-guar-list" aria-label="The four promises">
          <div className="cd-wrap">
            <ul className="cd-guar-grid">
              {GUARANTEES.map((g) => (
                <li key={g.id} className="cd-guar-card">
                  <span className="cd-step-n cd-guarantee-n">{g.figure}</span>
                  <h2 className="cd-h3">{g.title}</h2>
                  <p className="cd-guar-line">{g.line}</p>
                  {g.href && <a className="cd-card-build" href={g.href}>{g.cta}<span className="cd-arrow" aria-hidden="true">→</span></a>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="cd-section cd-guar-return" aria-labelledby="guar-return">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h2 id="guar-return" className="cd-h2"><Words text="Sending it back takes three steps." /></h2>
              <p className="cd-subhead">How a return works</p>
            </div>
            <ol className="cd-steps cd-steps-3">
              {RETURN_STEPS.map((s, i) => (
                <li key={s.id} className="cd-step">
                  <span className="cd-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="cd-h3">{s.title}</h3>
                  <p>{s.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cd-section cd-guar-diff" aria-labelledby="guar-diff">
          <div className="cd-wrap">
            <div className="cd-section-head">
              <h2 id="guar-diff" className="cd-h2"><Words text="How buying a Kord® compares." /></h2>
              <p className="cd-subhead">Kord®, an online store, a bike shop</p>
            </div>
            <div className="cd-diff">
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
                        <td className="is-kord"><Check />{r.kord}</td>
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

        <section className="cd-band cd-guar-cta" aria-labelledby="guar-cta">
          <div className="cd-wrap cd-band-row">
            <div className="cd-guar-cta-copy">
              <h2 id="guar-cta" className="cd-band-title"><Words text="Bought online. Backed for life." /></h2>
              <p>Every Kord® is built to order and fitted before it ships. If something still isn&apos;t right, four promises have you covered.</p>
            </div>
            <div className="cd-guar-actions">
              <a className="cd-btn cd-btn-dark" href="/pitch/kord/#range">Shop bikes<span className="cd-arrow" aria-hidden="true">→</span></a>
              <a className="cd-btn cd-btn-outline-dark" href="/pitch/kord/#find">Help me choose</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
