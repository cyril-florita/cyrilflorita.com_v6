import { PRODUCTS } from "@/components/viteo/data";
import { Arrow, BigWordHead, Button, Logo, LogoMark, Pill, PillTray, ProductBox, ThemeSwitcher } from "@/components/viteo/ui";
import { CurrentTheme, Swatches } from "@/components/viteo/DesignTokens";
import RoutineGraph from "@/components/viteo/RoutineGraph";
import Reviews from "@/components/viteo/Reviews";
// Page-only styles (split out of viteo.css so the landing skips them).
import "@/app/pitch/viteo/css/design-system.css";
import "@/app/pitch/viteo/css/account.css";

export const metadata = {
  title: "Design system",
  description:
    "Viteo's design system: three themes with light and dark modes, WCAG AA color tokens, type, buttons, icon buttons, forms, surfaces, charts, accordions, carousels, overlays and 3D pill renders. Designed and built by Cyril Florita.",
  alternates: { canonical: "/pitch/viteo/design-system/" },
};

// Viteo's design system, rendered from the same tokens (viteo.css) and
// components the prototype uses, so it can't drift from the product. Static
// copies (the back-to-top button, the modal, the close-up) use the real
// classes, shown in place instead of floating or opening.

const SECTIONS = [
  ["brand", "Brand"],
  ["color", "Color"],
  ["type", "Type"],
  ["buttons", "Buttons"],
  ["icons", "Icon buttons"],
  ["forms", "Forms"],
  ["surfaces", "Surfaces"],
  ["pills", "Pills"],
  ["data", "Data"],
  ["disclosure", "Disclosure"],
  ["overlays", "Overlays"],
  ["labels", "Labels"],
  ["feedback", "Feedback"],
  ["foundations", "Foundations"],
];

const TYPE = [
  { cls: "dl-display", label: "Display · display font", sample: <>Made for <em>your days.</em></> },
  { cls: "dl-h2", label: "Heading 2 · display font", sample: "Three steps, no guesswork." },
  { cls: "dl-h3", label: "Heading 3 · body font 600", sample: "Delivery frequency" },
  { cls: "dl-lede", label: "Lede · body font 18/28", sample: "Every item comes with a plain reason it's there." },
  { cls: "", label: "Body · body font 16/26", sample: "Skip, pause or swap from your account in a tap." },
  { cls: "dl-meta", label: "Meta · body font 14", sample: "2,000 IU · softgel · $5/mo" },
  { cls: "dl-eyebrow", label: "Label · body font 13 caps (card labels)", sample: "Personalized daily vitamins" },
];

// Icons, 24px grid, 2px stroke, round caps (the same drawings as in the product).
const ICON = {
  arrow: <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="8 7 17 7 17 16" /></>,
  expand: <><path d="M14 4h6v6M20 4l-6.5 6.5" /><path d="M10 20H4v-6M4 20l6.5-6.5" /></>,
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  up: <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>,
  box: <path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" />,
};
const Icon = ({ name, rotate }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={rotate ? { rotate } : undefined}>
    {ICON[name]}
  </svg>
);

const ICON_BUTTONS = [
  ["arrow", "Go to (↗)"],
  ["arrow", "Down the page (↙)", "180deg"],
  ["expand", "Open more"],
  ["back", "Previous"],
  ["next", "Next"],
  ["close", "Close"],
];

const Section = ({ id, title, lede, children }) => (
  <section id={`ds-${id}`} className="dl-ds-section">
    <h2 className="dl-h2">{title}</h2>
    {lede && <p className="dl-section-lede">{lede}</p>}
    {children}
  </section>
);

const Sub = ({ children }) => <h3 className="dl-h4 dl-ds-sub">{children}</h3>;

export default function DesignSystem() {
  return (
    <div className="dl-ds">
      <div className="dl-wrap">
        <header className="dl-ds-head dl-panel dl-panel-1">
          {/* The brand, top right (the deeper capsule colours on this light panel). */}
          <span className="dl-ds-head-logo"><Logo /></span>
          <BigWordHead word="Design system">
            <h1 className="dl-display">Viteo, <em>in pieces.</em></h1>
          </BigWordHead>
          <p className="dl-lede">
            Three themes on one set of components. Aqua is crisp and graphic: navy ink on pastel blocks. Grove is
            fresh and botanical: a mint page, a leaf-green accent and a characterful grotesque. Peach is warm and
            editorial: a peach bento with periwinkle and apricot-gold blocks on navy ink, set in a soft serif. Each has dark
            and light modes, and every sample below is the real component.
          </p>
          <CurrentTheme />
          <nav className="dl-ds-nav" aria-label="On this page">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={`#ds-${id}`}>{label}</a>
            ))}
          </nav>
        </header>

        <Section id="brand" title="Brand" lede="Two capsules meeting in a V, in the theme's accent and ink, with a lowercase wordmark. The mark is printed on every box, and the box carries the customer's name once they've taken the quiz.">
          <div className="dl-ds-brand">
            <div className="dl-card dl-ds-brand-card">
              <span className="dl-pill-label">Logo</span>
              <div className="dl-ds-brand-stage dl-ds-brand-logo"><Logo /></div>
              <div className="dl-ds-brand-variants">
                <div className="dl-panel dl-panel-1"><Logo /></div>
                <div className="dl-panel dl-panel-2"><Logo /></div>
                <div className="dl-panel dl-panel-dark"><Logo /></div>
              </div>
              <p className="dl-meta">Wordmark in the display font, lowercase, tight tracking. On panels the ink and accent re-colour themselves.</p>
            </div>
            <div className="dl-card dl-panel dl-panel-1 dl-ds-brand-card">
              <span className="dl-pill-label">Mark</span>
              <div className="dl-ds-brand-stage"><span className="dl-logo dl-ds-brand-mark"><LogoMark /></span></div>
              <p className="dl-meta">Two capsules: one in the theme&apos;s accent gradient, one in ink. Hover it: each capsule spins a full turn around its own centre and settles back into the V.</p>
            </div>
            <div className="dl-card dl-panel dl-panel-dark dl-ds-brand-card">
              <span className="dl-pill-label">The printed pack</span>
              <div className="dl-ds-brand-stage">
                <div className="dl-product dl-product-xs dl-ds-pack"><ProductBox owner="Cyril" morph={false} /></div>
              </div>
              <p className="dl-meta">The mark in the top corner, a vertical wordmark, and the customer&apos;s name above the pack name. The same artwork is printed onto the 3D carton.</p>
            </div>
          </div>
        </Section>

        <Section id="color" title="Color" lede="One accent on a calm base, defined once per theme and mode as tokens. Accent is for actions; Accent text is the only accent used for text, so it stays readable. Every text pair passes WCAG AA in every theme and mode. Values below update with the switcher.">
          <Swatches />
        </Section>

        <Section id="type" title="Type" lede="Aqua pairs Plus Jakarta Sans and Inter, Grove pairs Outfit and Figtree, and Peach pairs Fraunces and DM Sans. Same scale in all three; highlighted display words take the theme's display accent.">
          <ul className="dl-type-list">
            {TYPE.map((t) => (
              <li key={t.label}>
                <span className="dl-meta">{t.label}</span>
                <p className={t.cls}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="buttons" title="Buttons" lede="Primary for the one main action on a screen; secondary and ghost for everything else. 48px tall, 44px minimum touch target at small size. The arrow loops on hover.">
          <div className="dl-ds-row">
            <Button size="lg">Primary large <Arrow /></Button>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
            <button type="button" className="dl-textlink">Text link</button>
          </div>
          <Sub>Call-to-action pill</Sub>
          <div className="dl-ds-row">
            <a className="dl-underline-cta" href="#ds-buttons">
              Take the 2-minute quiz
              <span className="dl-cta-chip"><Arrow /></span>
            </a>
          </div>
        </Section>

        <Section id="icons" title="Icon buttons" lede="One square spec for every icon-only button: 52px, 18px corners, a 22px icon on a 24px grid. The border and hover tint come from the text colour, so they're white-based on dark surfaces and ink-based on light or coloured ones. Hover adds a faint tint and darkens the border.">
          <div className="dl-ds-grid dl-ds-grid-wide">
            {[["", "On the page"], ["dl-panel dl-panel-1", "On the main bento"], ["dl-panel dl-panel-2", "On a colour block"], ["dl-panel dl-panel-dark", "On a dark panel"]].map(([cls, label]) => (
              <div key={label} className={`dl-card dl-ds-tile ${cls}`}>
                <span className="dl-pill-label">{label}</span>
                <div className="dl-ds-row">
                  {ICON_BUTTONS.map(([name, aria, rot]) => (
                    <button key={aria} type="button" className="dl-corner" aria-label={aria} title={aria}>
                      <Icon name={name} rotate={rot} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Sub>Floating and header buttons</Sub>
          <div className="dl-ds-row">
            <button type="button" className="dl-totop is-on dl-ds-static" aria-label="Back to top (example)"><Icon name="up" /></button>
            <span className="dl-meta">Back to top: the same spec over a light frost, since it floats over every section.</span>
          </div>
          <div className="dl-ds-row">
            <button type="button" className="dl-burger dl-ds-static" aria-label="Menu (example)"><span /><span /></button>
            <span className="dl-meta">Menu, on tablets and phones: 48px, so it lines up with back to top.</span>
          </div>
        </Section>

        <Section id="forms" title="Forms" lede="Labels always visible above the field; errors in plain language right under it. Control boundaries are at least 3:1 against their surface.">
          <div className="dl-ds-forms">
            <div className="dl-form-grid">
              <label className="dl-field dl-field-wide"><span>Email</span><input defaultValue="cyril@example.com" /></label>
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

        <Section id="surfaces" title="Surfaces" lede="A bento of panels on one full-bleed background. Each panel re-points the ink, accent and paper tokens, so any component inside it stays readable. Glass is a clear, blurred pane over the page's ambient light.">
          <div className="dl-ds-grid">
            {[["dl-panel dl-panel-1", "Panel 1 · main bento"], ["dl-panel dl-panel-2", "Panel 2 · colour block"], ["dl-panel dl-panel-3", "Panel 3 · soft block"], ["dl-panel dl-panel-dark", "Dark panel"], ["", "Paper card"]].map(([cls, label]) => (
              <div key={label} className={`dl-card dl-ds-tile dl-ds-surface ${cls}`}>
                <div className="dl-bento-card-top">
                  <span className="dl-pill-label">{label}</span>
                  <span className="dl-corner" aria-hidden="true"><Icon name="arrow" /></span>
                </div>
                <p className="dl-meta">Text, labels and buttons re-colour themselves to suit.</p>
              </div>
            ))}
            <div className="dl-ds-glass-demo">
              <div className="dl-card dl-glass dl-ds-tile">
                <span className="dl-pill-label">Glass</span>
                <p className="dl-meta">Blurred and translucent; the light behind it shows through.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="pills" title="Pills" lede="Modelled in 3D from each product's color and form, live in the hero and close-ups, and baked into images everywhere else by a script, so a new product needs no new artwork.">
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

        <Section id="data" title="Data" lede="Charts only ever show whether the pack was taken, never health outcomes. Lines draw in when they scroll into view; a month still in progress is dashed and labelled so far, so it never reads as a drop.">
          <div className="dl-ds-two">
            <div className="dl-card dl-panel dl-panel-dark dl-ds-tile">
              <span className="dl-pill-label">Comparison · two series</span>
              <RoutineGraph
                labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
                main={[18, 21, 26, 24, 27, 29]}
                compare={[12, 16, 13, 19, 15, 20]}
                tipIndex={3}
                tip="24 days"
                ariaLabel="Example chart: days on routine per month, this year against last"
                legend={[{ label: "This year", color: "var(--dl-dark-accent)" }, { label: "Last year", color: "var(--dl-panel-1)" }]}
              />
            </div>
            <div className="dl-card dl-panel dl-panel-dark dl-ds-tile">
              <span className="dl-pill-label">Tracker · month in progress</span>
              <RoutineGraph
                labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
                main={[19, 22, 21, 25, 26, 6]}
                max={31}
                openEnd
                tip="6 so far"
                ariaLabel="Example tracker: days the pack was taken, the last month still in progress"
                legend={[{ label: "Days you took your pack", color: "var(--dl-dark-accent)" }]}
              />
            </div>
          </div>
          <div className="dl-ds-two">
            <div className="dl-card dl-panel dl-panel-1 dl-ds-tile">
              <span className="dl-pill-label">Delivery timeline</span>
              <div className="dl-timeline" aria-hidden="true">
                <span className="dl-timeline-track" />
                {[["Today", 0], ["Nov", 0.32], ["Dec", 0.63], ["Jan", 0.95]].map(([l, at]) => (
                  <span key={l} className="dl-timeline-tick" style={{ "--at": at }}>{l}</span>
                ))}
                <span className="dl-timeline-pin" style={{ "--at": 0.18 }}>
                  <span className="dl-timeline-flag"><Icon name="box" /> Oct 21</span>
                </span>
              </div>
              <p className="dl-meta">A marker, not a handle: the date moves with Skip and Pause, and the marker slides to it.</p>
            </div>
            <div className="dl-card dl-panel dl-panel-3 dl-ds-tile">
              <span className="dl-pill-label">Week organizer</span>
              <ol className="dl-week" aria-label="Example week">
                {["T", "W", "T", "F", "S", "S", "M"].map((d, i) => (
                  <li key={i} className={`${i > 2 ? "is-done" : ""} ${i === 6 ? "is-today" : ""}`}>
                    <span className="dl-week-lid" aria-hidden="true">{d}</span>
                    {i > 2 && <span className="dl-week-pill" aria-hidden="true"><Pill id={["d3", "b12", "omega", "magnesium"][i % 4]} size="sm" tilt={-30 + ((i * 23) % 50)} /></span>}
                  </li>
                ))}
              </ol>
              <div className="dl-progress"><span style={{ width: "62%" }} /></div>
              <p className="dl-meta">A pill drops into each day's compartment when it's checked off.</p>
            </div>
          </div>
        </Section>

        <Section id="disclosure" title="Disclosure & navigation" lede="Accordions animate their height (instant where unsupported). The carousel is a native scroll-snap track with prev/next, mouse drag and position dots that follow the text colour like the icon buttons (white-based in dark mode, ink-based in light). The theme switcher saves the choice for the next visit.">
          <Sub>Accordion</Sub>
          <div className="dl-ds-faq">
            <details className="dl-glass dl-faq-item" open>
              <summary>How does the quiz decide what goes in my pack?</summary>
              <p>Your answers map to a short list of everyday nutrients, and each pill shows the answer that put it there.</p>
            </details>
            <details className="dl-glass dl-faq-item">
              <summary>Can I change, skip or pause my deliveries?</summary>
              <p>Yes, from your account, any time. Changes apply to your next box.</p>
            </details>
          </div>
          <Sub>Carousel</Sub>
          <Reviews />
          <Sub>Steps, segments and theme</Sub>
          <ol className="dl-stepper">
            <li className="is-done"><span className="dl-stepper-n">✓</span> Details</li>
            <li className="is-current"><span className="dl-stepper-n">2</span> Delivery</li>
            <li><span className="dl-stepper-n">3</span> Payment</li>
            <li><span className="dl-stepper-n">4</span> Review</li>
          </ol>
          <div className="dl-ds-row"><ThemeSwitcher /></div>
        </Section>

        <Section id="overlays" title="Overlays" lede="Native dialogs: focus moves in and returns to the button that opened them; Esc, the backdrop and ✕ close them. On phones the ingredient close-up becomes a bottom sheet that closes when dragged down. Shown here in place.">
          <div className="dl-ds-two">
            <div className="dl-ds-overlay">
              <form className="dl-modal-body dl-ds-modal">
                <h3 className="dl-h3">Edit delivery address</h3>
                <p className="dl-meta">Changes apply from your next box.</p>
                <div className="dl-form-grid">
                  <label className="dl-field dl-field-wide"><span>Street address</span><input defaultValue="1200 Sunset Ave" /></label>
                  <label className="dl-field"><span>City</span><input defaultValue="Santa Clarita" /></label>
                  <label className="dl-field"><span>ZIP code</span><input defaultValue="91350" /></label>
                </div>
                <div className="dl-modal-actions">
                  <Button variant="ghost">Cancel</Button>
                  <Button>Save address</Button>
                </div>
                <span className="dl-ing-close dl-modal-close" aria-hidden="true"><Icon name="close" /></span>
              </form>
              <span className="dl-meta">Modal · forms and confirmations</span>
            </div>
            <div className="dl-ds-overlay">
              <div className="dl-ing-dialog dl-panel dl-panel-1 dl-ds-closeup">
                <div className="dl-ing-sheet">
                  <div className="dl-ing-stage"><span className="dl-ing-stage-pill"><Pill id="magnesium" size="lg" tilt={-20} /></span></div>
                  <div className="dl-ing-body">
                    <p className="dl-eyebrow">Capsule</p>
                    <h3 className="dl-h2">Magnesium Glycinate</h3>
                    <p className="dl-meta">200 mg · $6/mo</p>
                    <p>Magnesium bound to glycine, a form known for being easy on the stomach.</p>
                  </div>
                </div>
              </div>
              <span className="dl-meta">Close-up · the card&apos;s pill morphs onto the stage</span>
            </div>
          </div>
        </Section>

        <Section id="labels" title="Labels & stamps" lede="Labels never look like buttons: no pill shape, border or fill. Sample and preview content is stamped like a batch code, in the accent text colour.">
          <div className="dl-ds-grid">
            <div className="dl-card dl-ds-tile"><span className="dl-code" data-lot="Lot 02">Sample content</span><span className="dl-meta">Stamp · sample or preview content</span></div>
            <div className="dl-card dl-ds-tile"><span className="dl-pill-label">Your routine tracker</span><span className="dl-meta">Card label</span></div>
            <div className="dl-card dl-ds-tile"><span className="dl-eyebrow">Next delivery</span><span className="dl-meta">Eyebrow · hero and card headers</span></div>
            <div className="dl-card dl-ds-tile"><span><span className="dl-tag dl-tag-sun">Save 15%</span> <span className="dl-tag">Next</span></span><span className="dl-meta">Tags · status and savings</span></div>
          </div>
        </Section>

        <Section id="feedback" title="Feedback" lede="Progress, notes and toasts. Toasts always offer Undo for anything that changes a delivery.">
          <div className="dl-progress"><span style={{ width: "62%" }} /></div>
          <div className="dl-note"><strong>Already taking something?</strong> Check with your doctor or pharmacist first.</div>
          <div className="dl-toast is-on dl-toast-static"><span>Skipped. Your next box is now Thu, Nov 20.</span><button type="button">Undo</button></div>
          <div className="dl-card dl-ds-card dl-item">
            <span className="dl-item-pill"><Pill id="d3" size="lg" tilt={-18} /></span>
            <div className="dl-item-body">
              <h3>Vitamin D3 <span className="dl-meta">2,000 IU</span></h3>
              <p className="dl-why"><span className="dl-why-label">Why it&apos;s here</span> You spend most of the day indoors.</p>
            </div>
          </div>
        </Section>

        <Section id="foundations" title="Foundations" lede="Shared shape, spacing and motion. Every animation turns off for people who prefer reduced motion.">
          <Sub>Radius</Sub>
          <ul className="dl-ds-radius">
            {[["12px", "Chips"], ["16px", "Menu button"], ["18px", "Icon buttons"], ["20px", "Cards"], ["28px", "Panels, dialogs"], ["999px", "Buttons, tags"]].map(([r, l]) => (
              <li key={r}><span style={{ "--r": r }} /><span className="dl-meta">{r}<br />{l}</span></li>
            ))}
          </ul>
          <Sub>Spacing</Sub>
          <ul className="dl-ds-space">
            {[4, 8, 12, 16, 20, 24, 32, 48, 64].map((n) => (
              <li key={n}><span style={{ "--s": `${n}px` }} /><span className="dl-meta">{n}</span></li>
            ))}
          </ul>
          <Sub>Motion</Sub>
          <dl className="dl-ds-motion">
            <div><dt>Easing</dt><dd>cubic-bezier(0.2, 0.8, 0.2, 1): quick out, soft landing</dd></div>
            <div><dt>Hover</dt><dd>0.2–0.35s: tints, borders, arrow loops</dd></div>
            <div><dt>Dialogs</dt><dd>0.35–0.5s: modal rise, pill morph onto the stage</dd></div>
            <div><dt>Pages</dt><dd>0.55s: view transitions, the printed pack glides between pages</dd></div>
            <div><dt>Intro</dt><dd>~1.75s on each landing visit, a GSAP timeline: the carton, then each pill at its own speed, bounce and spin; any click, key or scroll skips it</dd></div>
            <div><dt>Background</dt><dd>A WebGPU shader (WebGL2 fallback) a slow, pulsing ribbon of the theme&apos;s light behind the glass, ~30fps at low resolution; desktop only, off for reduced motion</dd></div>
            <div><dt>Quiz finale</dt><dd>A GSAP timeline: pills fall into the pack one by one, the pack squashes to catch each, and the plan opens when the last lands</dd></div>
            <div><dt>Reduced motion</dt><dd>Everything above is off; the content is all there at once</dd></div>
          </dl>
        </Section>
      </div>
    </div>
  );
}
