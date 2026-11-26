import { Footer, LogoMark, Sample } from "@/components/kord/ui";
import { WORDMARK } from "@/components/kord/wordmark";
import { BIKES, PAINTS, PAINT_PRICE, GUARANTEES, money, plain } from "@/components/kord/data";
import BikeViewer from "@/components/kord/BikeViewer";
import { Chrome, SizeDemo, PaintChoiceDemo, SwatchDemo, FindOptDemo, HotspotDemo, FieldDemo } from "@/components/kord/DsDemos";
import "../css/design-system.css";

export const metadata = {
  title: "Design system · Kord",
  description: "Kord's design system: the stretched wordmark, a chartreuse accent on near-black, Archivo and JetBrains Mono, buttons, choices, hotspots and the 3D studio. A design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/kord/design-system/" },
  robots: { index: false, follow: true },
};

// The design system (/pitch/kord/design-system/): every sample is the real class or component.
// Chrome is the shared DsChrome (Viteo's and Hearthside's): a sticky sidebar ≥1200px, a top bar
// and full-screen menu below. Contrast ratios are computed here from the token values, so keep
// TOKENS in sync with the top of kord.css.

const TOKENS = [
  ["--cd-bg", "#0b0c0e", "Page"],
  ["--cd-bg-2", "#131418", "Cards, options"],
  ["--cd-bg-3", "#1b1d22", "Raised surfaces"],
  ["--cd-ink", "#f2f3f5", "Headings, body"],
  ["--cd-ink-2", "#a6aab2", "Secondary text, labels"],
  ["--cd-accent", "#c8f031", "Chartreuse: actions, labels, focus"],
  ["--cd-on-accent", "#0b0c0e", "Text on the accent"],
];
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return ((x + 0.05) / (y + 0.05)).toFixed(1); };
const PAIRS = [
  ["Ink on page", "#f2f3f5", "#0b0c0e"], ["Ink-2 on page", "#a6aab2", "#0b0c0e"], ["Accent on page", "#c8f031", "#0b0c0e"],
  ["Ink-2 on card", "#a6aab2", "#131418"], ["Accent on card", "#c8f031", "#131418"], ["On-accent on accent", "#0b0c0e", "#c8f031"],
];

const SECTIONS = [
  ["brand", "Brand"], ["color", "Color"], ["type", "Type"], ["buttons", "Buttons"], ["choices", "Choices"],
  ["labels", "Labels"], ["cards", "Cards"], ["studio", "3D studio"], ["foundations", "Foundations"],
];

function Section({ id, title, lede, children }) {
  return (
    <section id={`ds-${id}`} className="cd-ds-section" aria-labelledby={`ds-${id}-h`}>
      <div className="cd-ds-section-head">
        <h2 id={`ds-${id}-h`} className="cd-h2">{title}</h2>
        {lede && <p className="cd-ds-lede">{lede}</p>}
      </div>
      {children}
    </section>
  );
}
const Sub = ({ children }) => <h3 className="cd-ds-sub">{children}</h3>;

export default function DesignSystem() {
  const arc = BIKES[0];
  const stealth = PAINTS[0];
  return (
    <>
      <div className="cd-ds">
        <div className="cd-wrap cd-ds-wrap">
          <div className="cd-ds-layout">
            <header className="cd-ds-chrome"><Chrome sections={SECTIONS.map(([id, l]) => [`ds-${id}`, l])} /></header>
            <main id="main" className="cd-ds-main" tabIndex={-1}>
              <header className="cd-ds-head">
                <span className="cd-ds-head-word" data-word="KORD" aria-hidden="true" />
                <h1 className="cd-h1">Kord®, in parts.</h1>
                <p className="cd-subhead">Design system</p>
                <p className="cd-lede">One dark studio, one chartreuse accent, one stretched wordmark. Every sample below is the real component, working.</p>
              </header>

              <Section id="brand" title="Brand" lede="The mark is a crank's circle with a chartreuse arc, the stroke of a pedal turn. The wordmark is Archivo Expanded Black stretched 2.2× wide and 0.8× tall, outlined as an SVG path, and the same type is printed on every down tube.">
                <div className="cd-ds-grid is-3">
                  <figure className="cd-ds-tile is-wide">
                    <div className="cd-ds-tile-stage"><span className="cd-ds-logo-lg"><LogoMark size={64} /><svg viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true"><path d={WORDMARK.d} fill="currentColor" /></svg><span className="cd-reg" aria-hidden="true">®</span></span></div>
                    <figcaption>Logo · mark + wordmark, 11px tall in the header</figcaption>
                  </figure>
                  <figure className="cd-ds-tile">
                    <div className="cd-ds-tile-stage"><LogoMark size={96} /></div>
                    <figcaption>Mark · the arc always in the accent</figcaption>
                  </figure>
                  <figure className="cd-ds-tile is-accent">
                    <div className="cd-ds-tile-stage"><span className="cd-ds-word-wrap"><svg className="cd-ds-word-only" viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true"><path d={WORDMARK.d} fill="currentColor" /></svg><span className="cd-reg" aria-hidden="true">®</span></span></div>
                    <figcaption>Wordmark on the accent</figcaption>
                  </figure>
                  <figure className="cd-ds-tile is-wide cd-ds-frame">
                    <div className="cd-ds-tile-stage"><img src={`/pitch/kord/bikes/${arc.id}-stealth.webp`} width="1200" height="720" alt="The Kord Arc in Stealth, with the KORD wordmark on its down tube" loading="lazy" /></div>
                    <figcaption>On the frame · KORD® on the down tube, the model name (ARC™) across the head tube</figcaption>
                  </figure>
                  <figure className="cd-ds-tile is-full">
                    <div className="cd-ds-tile-stage cd-ds-giant"><span aria-hidden="true">ARC</span></div>
                    <figcaption>The giant word · the model name behind the bike, white at 6%, without its ™</figcaption>
                  </figure>
                </div>
              </Section>

              <Section id="color" title="Color" lede="Near-black studio surfaces, two inks and one accent. Body text is AAA on every surface; the accent is for actions, labels and focus, never body copy.">
                <ul className="cd-ds-tokens">
                  {TOKENS.map(([name, hex, use]) => (
                    <li key={name}>
                      <i style={{ background: hex }} aria-hidden="true" />
                      <code>{name}</code>
                      <span className="cd-ds-hex">{hex.toUpperCase()}</span>
                      <span>{use}</span>
                    </li>
                  ))}
                  <li><i className="is-line" aria-hidden="true" /><code>--cd-line / -2</code><span className="cd-ds-hex">white 12% / 22%</span><span>Hairlines, borders</span></li>
                </ul>
                <Sub>Contrast</Sub>
                <ul className="cd-ds-contrast">
                  {PAIRS.map(([label, fg, bg]) => {
                    const r = ratio(fg, bg);
                    return (
                      <li key={label} style={{ color: fg, background: bg }}>
                        <strong>{r}:1</strong>
                        <span>{label}</span>
                        <em>{r >= 7 ? "AAA" : r >= 4.5 ? "AA" : "Large text"}</em>
                      </li>
                    );
                  })}
                </ul>
                <Sub>Paints</Sub>
                <ul className="cd-ds-paints">
                  {PAINTS.map((p) => (
                    <li key={p.id}>
                      <i style={{ background: p.hex }} aria-hidden="true" />
                      <strong>{p.name}</strong>
                      <span className="cd-ds-hex">{p.hex.toUpperCase()}</span>
                      <span>{PAINT_PRICE[p.id] ? `Signature, +${money(PAINT_PRICE[p.id])}` : "Included"}{p.id === "stealth" ? " · default" : ""}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="type" title="Type" lede="Archivo for everything, using its width axis: expanded and heavy for display, normal width for text. JetBrains Mono for specs and labels. Only headings are uppercase.">
                <div className="cd-ds-type">
                  <div><span className="cd-ds-spec">H1 · 800 · width 125 · 44–92px</span><p className="cd-h1">Built to order.</p></div>
                  <div><span className="cd-ds-spec">H2 · 800 · width 118 · 32–60px</span><p className="cd-h2">Four bikes. One for every road.</p></div>
                  <div><span className="cd-ds-spec">H3 · 750 · width 112 · 24px</span><p className="cd-h3 cd-ds-upper">Meridian™</p></div>
                  <div><span className="cd-ds-spec">Label · JetBrains Mono · 13px · 0.12em</span><p className="cd-subhead">The range</p></div>
                  <div><span className="cd-ds-spec">Lede · 19px · ink-2</span><p className="cd-lede">Tell us how you ride and we&apos;ll match you to a bike and a size.</p></div>
                  <div><span className="cd-ds-spec">Body · 17px / 1.55</span><p>Every frame is carbon, every bike is built to order and fitted to you before it ships.</p></div>
                </div>
              </Section>

              <Section id="buttons" title="Buttons" lede="Pills. One primary per area, filled in the accent; the rest are outlined. A trailing arrow only when the button takes you somewhere, and it nudges on hover.">
                <div className="cd-ds-row">
                  <a className="cd-btn cd-btn-primary" href="#ds-buttons">Find your bike<span className="cd-arrow" aria-hidden="true">→</span></a>
                  <button type="button" className="cd-btn cd-btn-ghost">Copy link</button>
                  <a className="cd-btn cd-btn-ghost cd-btn-sm" href="#ds-buttons">Build yours</a>
                  <a className="cd-card-build" href="#ds-buttons">Build yours<span className="cd-arrow" aria-hidden="true">→</span></a>
                </div>
                <div className="cd-ds-row cd-ds-on-accent">
                  <a className="cd-btn cd-btn-dark" href="#ds-buttons">Shop bikes<span className="cd-arrow" aria-hidden="true">→</span></a>
                  <span>On the accent band, the button inverts.</span>
                </div>
              </Section>

              <Section id="choices" title="Choices" lede="Every choice is a radio group: arrow keys move between options, the chosen one is ringed in the accent.">
                <Sub>Builder options</Sub>
                <SizeDemo />
                <div className="cd-ds-gap" />
                <PaintChoiceDemo />
                <Sub>Find your bike answers</Sub>
                <FindOptDemo />
                <Sub>Paint swatches</Sub>
                <SwatchDemo />
                <Sub>Fields</Sub>
                <FieldDemo />
              </Section>

              <Section id="labels" title="Labels" lede="Small caps in mono or the accent. Section labels sit under their headings, not above them.">
                <div className="cd-ds-row">
                  <span className="cd-subhead">Section label</span>
                  <span className="cd-card-type">Aero</span>
                  <Sample />
                  <Sample>Sample order</Sample>
                  <span className="cd-ds-badge"><span className="cd-cart-n">2</span> Cart count</span>
                </div>
                <Sub>Hotspot</Sub>
                <HotspotDemo />
              </Section>

              <Section id="cards" title="Cards" lede="Cards sit one step above the page with a hairline edge; on hover the edge brightens and the bike pushes in.">
                <div className="cd-ds-grid is-2">
                  <ul className="cd-range cd-ds-one">
                    <li className={`cd-card cd-card-${arc.id}`}>
                      <img className="cd-card-img" src={`/pitch/kord/bikes/${arc.id}-stealth.webp`} width="1200" height="720" alt={`The Kord ${plain(arc.name)}`} loading="lazy" />
                      <div className="cd-card-body">
                        <h3 className="cd-h3">{arc.name}</h3>
                        <p className="cd-card-type">{arc.type}</p>
                        <p className="cd-card-line">{arc.blurb}</p>
                        <dl className="cd-card-specs">
                          <div><dt>Weight</dt><dd>{arc.weight} kg</dd></div>
                          <div><dt>Wheels</dt><dd>{arc.wheels}</dd></div>
                          <div><dt>Tires</dt><dd>{arc.tires}</dd></div>
                        </dl>
                        <div className="cd-card-foot">
                          <p className="cd-card-price">From <strong>{money(arc.from)}</strong></p>
                          <a className="cd-card-build" href={`/pitch/kord/build/?bike=${arc.id}`}>Build yours<span className="cd-arrow" aria-hidden="true">→</span><span className="cd-sr">: the {plain(arc.name)}</span></a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <ul className="cd-steps cd-ds-steps">
                    {GUARANTEES.map((g) => (
                      <li key={g.id} className="cd-step"><span className="cd-step-n cd-guarantee-n">{g.figure}</span><h3 className="cd-h3">{g.title}</h3><p>{g.line}</p></li>
                    ))}
                  </ul>
                </div>
              </Section>

              <Section id="studio" title="3D studio" lede="The bike in its studio: a dark wall lit around the bike, a mottled floor with a baked shadow, matte paint. Drag it or use the arrow keys. Without WebGL the range still stays.">
                <BikeViewer paint={stealth} still={`/pitch/kord/bikes/${arc.id}-stealth.webp`} label="The Kord Arc" />
              </Section>

              <Section id="foundations" title="Foundations">
                <div className="cd-ds-grid is-3">
                  <div className="cd-ds-tile"><Sub>Radius</Sub>
                    <div className="cd-ds-radii"><span style={{ borderRadius: 12 }}>12<small>options</small></span><span style={{ borderRadius: 14 }}>14<small>cards</small></span><span style={{ borderRadius: 20 }}>20<small>studio</small></span><span style={{ borderRadius: 999 }}>pill<small>buttons</small></span></div>
                  </div>
                  <div className="cd-ds-tile"><Sub>Spacing</Sub>
                    <ul className="cd-ds-list"><li><code>--cd-gutter</code> 20–56px</li><li>Sections 80–150px</li><li>Cards 28px in</li><li>Options 10–12px apart</li></ul>
                  </div>
                  <div className="cd-ds-tile"><Sub>Motion</Sub>
                    <ul className="cd-ds-list"><li><code>--cd-ease</code> (0.22, 1, 0.36, 1)</li><li>Hover 0.2s, press to 0.97×</li><li>3D renders on demand only</li><li>Off under reduced motion</li></ul>
                  </div>
                </div>
              </Section>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
