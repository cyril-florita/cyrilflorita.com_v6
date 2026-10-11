import { PRODUCTS } from "@/components/viteo/data";
import { Arrow, BigWordHead, Button, Logo, Pill, PillTray } from "@/components/viteo/ui";
import { CurrentTheme, Swatches } from "@/components/viteo/DesignTokens";

export const metadata = { title: "Design system" };

// Viteo's design system, rendered from the same tokens (viteo.css) and
// components the prototype uses, so it can't drift from the product.


const TYPE = [
  { cls: "dl-display", label: "Display · display font", sample: "Made for your days." },
  { cls: "dl-h2", label: "Heading 2 · display font", sample: "Three steps, no guesswork." },
  { cls: "dl-h3", label: "Heading 3 · body font 600", sample: "Delivery frequency" },
  { cls: "dl-lede", label: "Lede · body font 18/28", sample: "Every item comes with a plain reason it's there." },
  { cls: "", label: "Body · body font 16/26", sample: "Skip, pause or swap from your account in a tap." },
  { cls: "dl-meta", label: "Meta · body font 14", sample: "2,000 IU · softgel · $5/mo" },
  { cls: "dl-eyebrow", label: "Label · body font 13 caps (card labels, the hero)", sample: "Personalized daily vitamins" },
];

const Section = ({ id, title, lede, children }) => (
  <section id={id} className="dl-ds-section">
    <h2 className="dl-h2">{title}</h2>
    {lede && <p className="dl-section-lede">{lede}</p>}
    {children}
  </section>
);

export default function DesignSystem() {
  return (
    <div className="dl-ds">
      <div className="dl-wrap">
        <header className="dl-ds-head dl-panel dl-panel-1">
          <BigWordHead word="Design system">
            <h1 className="dl-display">Viteo, <em>in pieces.</em></h1>
          </BigWordHead>
          <p className="dl-lede">
            Two themes on one set of components. Aqua is crisp and graphic: navy ink on pastel blocks. Grove is
            fresh and botanical: a mint page, a leaf-green accent and a characterful grotesque. Each has dark
            and light modes, every page sits in the same rounded frame of panels, and every sample below is the
            real component.
          </p>
          <CurrentTheme />
          <nav className="dl-ds-nav" aria-label="On this page">
            {["Color", "Type", "Buttons", "Forms", "Pills", "Cards", "Feedback"].map((s) => (
              <a key={s} href={`#ds-${s.toLowerCase()}`}>{s}</a>
            ))}
          </nav>
        </header>

        <Section id="ds-color" title="Color" lede="One accent on a calm base, defined once per theme and mode as tokens. Accent is for actions; Accent text is the only accent used for text, so it stays readable. Values below update with the switcher.">
          <Swatches />
        </Section>

        <Section id="ds-type" title="Type" lede="Aqua pairs Plus Jakarta Sans and Inter; Grove pairs Outfit and Figtree. Same scale in both.">
          <ul className="dl-type-list">
            {TYPE.map((t) => (
              <li key={t.label}>
                <span className="dl-meta">{t.label}</span>
                <p className={t.cls}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="ds-buttons" title="Buttons" lede="Primary for the one main action on a screen; secondary and ghost for everything else. 48px tall, 44px minimum touch target at small size.">
          <div className="dl-ds-row">
            <Button size="lg">Primary large <Arrow /></Button>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
            <button type="button" className="dl-textlink">Text link</button>
          </div>
        </Section>

        <Section id="ds-forms" title="Forms" lede="Labels always visible above the field; errors in plain language right under it.">
          <div className="dl-ds-forms">
            <div className="dl-form-grid">
              <label className="dl-field dl-field-wide"><span>Email</span><input defaultValue="victoria@example.com" /></label>
              <label className="dl-field dl-field-wide has-error"><span>ZIP code</span><input defaultValue="913" /><span className="dl-error">Use a 5-digit ZIP code.</span></label>
            </div>
            <div className="dl-options">
              <button type="button" className="dl-option is-on" role="radio" aria-checked="true"><span className="dl-option-text"><span>Selected option</span><span className="dl-meta">With a hint</span></span><span className="dl-option-check" /></button>
              <button type="button" className="dl-option" role="radio" aria-checked="false"><span className="dl-option-text"><span>Unselected option</span></span><span className="dl-option-check" /></button>
            </div>
            <div className="dl-ds-row">
              <span className="dl-segment" role="radiogroup" aria-label="Example segmented control">
                <button type="button" className="is-on" role="radio" aria-checked="true">Monthly</button>
                <button type="button" role="radio" aria-checked="false">2 months</button>
                <button type="button" role="radio" aria-checked="false">3 months</button>
              </span>
              <label className="dl-switch"><input type="checkbox" defaultChecked /><span className="dl-switch-ui" aria-hidden="true" />Reminders</label>
              <button type="button" className="dl-chip"><Pill id="c" size="sm" tilt={-20} /> Vitamin C <span className="dl-meta">+$4</span></button>
            </div>
          </div>
        </Section>

        <Section id="ds-pills" title="Pills" lede="Modelled in 3D from each product's color and form and rendered by a script, so a new product needs no new artwork.">
          <ul className="dl-ds-pills">
            {Object.values(PRODUCTS).map((p) => (
              <li key={p.id}>
                <Pill id={p.id} size="lg" tilt={-20} />
                <span className="dl-meta">{p.name}<br />{p.form}</span>
              </li>
            ))}
          </ul>
          <PillTray ids={["d3", "omega", "magnesium", "b12"]} label="Pill tray example" />
        </Section>

        <Section id="ds-cards" title="Cards & tags" lede="Paper cards with a hairline border, 20px radius; a soft offset shadow in dark mode, flat in light mode.">
          <div className="dl-ds-row">
            <div className="dl-card dl-ds-card">
              <Logo small />
              <p>A card holds one idea. Tags label status or savings.</p>
              <span className="dl-code" data-lot="Lot 02">Sample content</span> <span className="dl-tag dl-tag-sun">Save 15%</span>
            </div>
            <div className="dl-card dl-ds-card dl-item">
              <span className="dl-item-pill"><Pill id="d3" size="lg" tilt={-18} /></span>
              <div className="dl-item-body">
                <h3>Vitamin D3 <span className="dl-meta">2,000 IU</span></h3>
                <p className="dl-why"><span className="dl-why-label">Why it&apos;s here</span> You spend most of the day indoors.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="ds-feedback" title="Feedback" lede="Progress, steps, notes and toasts. Toasts always offer Undo for anything that changes a delivery.">
          <div className="dl-progress"><span style={{ width: "62%" }} /></div>
          <ol className="dl-stepper">
            <li className="is-done"><span className="dl-stepper-n">✓</span> Details</li>
            <li className="is-current"><span className="dl-stepper-n">2</span> Delivery</li>
            <li><span className="dl-stepper-n">3</span> Payment</li>
            <li><span className="dl-stepper-n">4</span> Review</li>
          </ol>
          <div className="dl-note"><strong>Already taking something?</strong> Check with your doctor or pharmacist first.</div>
          <div className="dl-toast is-on dl-toast-static"><span>Skipped. Your next box is now Thu, Nov 20.</span><button type="button">Undo</button></div>
        </Section>
      </div>
    </div>
  );
}
