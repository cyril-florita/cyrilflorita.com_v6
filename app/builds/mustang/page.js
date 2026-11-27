import CarStage from "@/components/mustang/CarStage";
import Smoke from "@/components/mustang/Smoke";
import OfferDetails from "@/components/mustang/OfferDetails";
import SpecStrip from "@/components/mustang/SpecStrip";
import Grit from "@/components/mustang/Grit";
import Preloader from "@/components/mustang/Preloader";

// The ad: one stage (the car centered under the giant word, the hero text at
// the left, its windows, the paint choice and the offer under the car), a
// short spec strip, and the pitch notice. Offer figures are sample content.
const SPECS = [
  { value: "5.0 L", label: "V8 engine", short: "V8 engine" },
  { value: "500 hp", label: "Dark Horse horsepower", short: "Dark Horse" },
  { value: "RWD", label: "Rear-wheel drive", short: "Rear drive" },
  { value: "6 or 10", label: "Speeds, manual or auto", short: "Speeds" },
  { value: "2+2", label: "Fastback seating", short: "Seating" },
];

const Slashes = () => <span className="ms-slashes" aria-hidden="true"><i /><i /><i /><i /></span>;

export default function Page() {
  const year = new Date().getFullYear();
  return (
    <>
      <Preloader />
      <a className="ms-skip" href="#main">Skip to content</a>
      <main id="main">
        <CarStage>
          <div className="ms-bg" aria-hidden="true"><Grit /></div>
          <Smoke />
          <div className="ms-floor" aria-hidden="true" />
          <p className="ms-word" aria-hidden="true">MUSTANG</p>
          <p className="ms-top">
            <span>S650</span>
            <span>Mustang <Slashes /></span>
          </p>
          <div className="ms-copy">
            <h1 className="ms-title">Ford Mustang</h1>
            <p className="ms-sub">Turn it. Open it. Look closer. <Slashes /></p>
            <p>A long hood, a fastback roof, and three bars of light at every corner.<span className="ms-copy-3d"> Drag the car to see all of it, or open a window to look at the rear, the cockpit, and the headlights up close.</span></p>
          </div>
          <section className="ms-offer" id="offer" aria-labelledby="ms-offer-title">
            <h2 className="ms-offer-title" id="ms-offer-title">Yours from $499 a month.</h2>
            <p className="ms-offer-terms">36-month lease · $3,999 due at signing</p>
            <OfferDetails>
              <p className="ms-stamp">[ Sample terms ]</p>
              <h3 className="ms-offer-panel-title" id="ms-offer-dialog-title">Mustang GT Fastback</h3>
              <dl className="ms-offer-terms-list">
                <div><dt>Lease</dt><dd>$499 a month for 36 months, 10,500 miles a year ($0.25 a mile over).</dd></div>
                <div><dt>Due at signing</dt><dd>$3,999, including the first month&apos;s payment. No security deposit.</dd></div>
                <div><dt>Or finance</dt><dd>2.9% APR for 60 months, about $17.92 a month per $1,000 financed.</dd></div>
                <div><dt>Who qualifies</dt><dd>Well-qualified customers with credit approved by the lender.</dd></div>
                <div><dt>Not included</dt><dd>Tax, title, license, registration, and dealer fees.</dd></div>
              </dl>
            </OfferDetails>
            <p className="ms-stamp ms-offer-stamp">[ Sample offer ]</p>
          </section>
        </CarStage>

        <SpecStrip specs={SPECS} />

      </main>
      <footer className="ms-footer">
        <p>3D model: <a href="https://sketchfab.com/3d-models/free-2024-ford-mustang-dark-horse-a29c8bb07f6e41b594fe2248366cffbf" target="_blank" rel="noopener noreferrer">“[FREE] 2024 Ford Mustang Dark Horse”</a> by <a href="https://sketchfab.com/livanovbog" target="_blank" rel="noopener noreferrer">livanovbog</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> (closed up, recolored and compressed for this page).</p>
        <p>Unofficial concept. Not affiliated with or endorsed by Ford Motor Company. Ford and Mustang are trademarks of Ford Motor Company.</p>
        <p>Designed and built by Cyril Florita · © {year}. All rights reserved. · <a href="/builds/mustang/kit/">Campaign kit</a> · <a href="/">Back to portfolio</a></p>
      </footer>
    </>
  );
}
