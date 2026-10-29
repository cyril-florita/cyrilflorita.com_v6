import { AREAS, FAQS, SERVICES } from "@/components/hearthside/data";
import { Button, Icon, LogoMark, PartnerLogos, PhoneLink, Photo, Row, Sample } from "@/components/hearthside/ui";
import { ModeSwitch, ZipCheck } from "@/components/hearthside/client";
import "@/app/pitch/hearthside/css/design-system.css";

export const metadata = {
  title: "Design system",
  description:
    "Hearthside Home Health's design system: an editorial grid, light and dark color tokens measured to WCAG AAA for body text, type, buttons, forms, status labels, and photo placeholders. Designed and built by Cyril Florita.",
  alternates: { canonical: "/pitch/hearthside/design-system/" },
};

// Rendered from the same tokens (hearthside.css) and components the site
// uses, in the site's own editorial layout. Contrast ratios are computed here
// from the token values, so keep SCHEMES in sync with hearthside.css.

const lum = (hex) => {
  const c = hex.slice(1).match(/../g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const grade = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "3:1 UI" : "Decorative");

// Every scheme's tokens, [light, dark], mirroring hearthside.css. Text rows
// (measure: true) are checked against that scheme's page colour.
const TOKENS = [
  ["--hs-page", "Page", "The one page background"],
  ["--hs-surface", "Surface", "Inputs, floating cards"],
  ["--hs-sand", "Alt surface", "Preview bar, hovers, chips"],
  ["--hs-ink", "Ink", "Headings, body text, primary buttons", true],
  ["--hs-ink-2", "Ink 2", "Secondary text", true],
  ["--hs-rule", "Rule", "Section and column hairlines (decorative)"],
  ["--hs-control", "Control", "Input and control borders", true],
  ["--hs-ember", "Accent", "Button hover, highlights"],
  ["--hs-ember-text", "Accent text", "Eyebrows, links", true],
  ["--hs-sage", "Sage", "Success and status", true],
  ["--hs-window", "Warm accent", "A warm note kept in every scheme (the old logo's lit window)"],
];
const SCHEMES = [
  {
    id: "tide", name: "Tide", note: "The default. Cool: misty blue-grey pages, navy ink, a harbour-blue accent.",
    v: {
      "--hs-page": ["#F2F5F7", "#10161C"], "--hs-surface": ["#FBFCFD", "#18212A"], "--hs-sand": ["#E3EAEF", "#1F2A35"],
      "--hs-ink": ["#17212B", "#EEF3F7"], "--hs-ink-2": ["#3F4D5A", "#C3CFDA"], "--hs-rule": ["#B8C5D0", "#3A4958"],
      "--hs-control": ["#75838F", "#7F8E9C"], "--hs-ember": ["#1F5E8C", "#7FB6E0"], "--hs-ember-text": ["#1B5480", "#93C3E8"],
      "--hs-sage": ["#2F6650", "#93C9AC"], "--hs-window": ["#D98A2B", "#F0A04A"],
    },
    pairs: [["Page on Ink (primary button)", "#F2F5F7", "#17212B", "#10161C", "#EEF3F7"], ["Text on Accent (button hover)", "#FFFFFF", "#1F5E8C", "#0D1720", "#7FB6E0"], ["Accent text on Accent tint", "#1B5480", "#DCE8F2", "#93C3E8", "#1B2E40"], ["Ink 2 on Alt surface", "#3F4D5A", "#E3EAEF", "#C3CFDA", "#1F2A35"]],
  },
  {
    id: "shore", name: "Shore", note: "Warm and cool combined. Light: warm linen pages, navy ink, a harbour-blue accent, a peach sky over blue hills. Dark: navy pages, warm ink, the ember accent.",
    v: {
      "--hs-page": ["#F6F2EA", "#121820"], "--hs-surface": ["#FFFDF8", "#1A222C"], "--hs-sand": ["#ECE5D8", "#222C37"],
      "--hs-ink": ["#1A2430", "#F4EEE5"], "--hs-ink-2": ["#3E4956", "#CFC7BB"], "--hs-rule": ["#C7BDAD", "#3C4856"],
      "--hs-control": ["#7C8089", "#848C96"], "--hs-ember": ["#1F5E8C", "#EE9466"], "--hs-ember-text": ["#1B5480", "#F4A77F"],
      "--hs-sage": ["#2F6650", "#93C9AC"], "--hs-window": ["#C0602E", "#EE9466"],
    },
    pairs: [["Page on Ink (primary button)", "#F6F2EA", "#1A2430", "#121820", "#F4EEE5"], ["Text on Accent (button hover)", "#FFFFFF", "#1F5E8C", "#1B1410", "#EE9466"], ["Accent text on Accent tint", "#1B5480", "#DCE6EE", "#F4A77F", "#3A2419"], ["Ink 2 on Alt surface", "#3E4956", "#ECE5D8", "#CFC7BB", "#222C37"]],
  },
];
// Status colours are shared by both schemes.
const STATUS_PAIRS = [
  ["Sage on Sage tint (status)", "#2F6650", "#DDEBE2", "#93C9AC", "#1F3329"],
  ["Warning on Warning tint", "#7A5200", "#F7E8C6", "#E9C177", "#3A2E16"],
  ["Danger on Danger tint", "#A1342A", "#F7DEDA", "#F0998D", "#3D201C"],
];

const SECTIONS = [["brand", "Brand"], ["layout", "Layout"], ["color", "Color"], ["type", "Type"], ["buttons", "Buttons"], ["forms", "Forms"], ["labels", "Labels"], ["imagery", "Imagery"], ["lists", "Components"], ["principles", "Principles"]];

function Ratio({ fg, bg }) {
  const r = ratio(fg, bg);
  return <span className="hs-ds-ratio">{r.toFixed(1)}:1 <em>{grade(r)}</em></span>;
}

export default function DesignSystem() {
  return (
    <div className="hs-wrap hs-ds">
      <header className="hs-ds-head">
        <div>
          <h1>Design system</h1>
          <p className="hs-lede">
            An editorial grid for a care brand: one calm background, generous space between sections, a label column beside every section, and type that&rsquo;s large and easy to read. Light by default, with a full dark mode; body text meets WCAG AAA (7:1) in both.
          </p>
          <div className="hs-ds-mode">
            <ModeSwitch />
            <span>Switch light and dark to see every token change.</span>
          </div>
        </div>
        <div className="hs-ds-head-logo" aria-hidden="true">
          <LogoMark size={112} />
          <span>Hearthside</span>
        </div>
      </header>
      <nav className="hs-ds-toc" aria-label="Sections">
        <ul>{SECTIONS.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ul>
      </nav>

      <Row id="brand" label="Brand" labelledBy="ds-brand">
        <h2 id="ds-brand">A light left on</h2>
        <p className="hs-lede">The mark is a plain H set in a leaf: the same shape that frames every photo, badge, and highlight on the site, with two corners swept wide and two kept tight. Simple enough to read at favicon size, and warm without trying.</p>
        <div className="hs-ruled hs-ds-brand">
          <div>
            <div className="hs-ds-logo-big"><LogoMark size={64} /><span><b>Hearthside</b><small>Home Health</small></span></div>
            <p>Lockup: the mark, a hairline, then the wordmark in Hanken Grotesk 600 (tracked tight) over the descriptor in widely spaced DM Mono caps.</p>
          </div>
          <div>
            <div className="hs-ds-marks"><LogoMark size={64} /><LogoMark size={40} /><LogoMark size={24} /></div>
            <p>The mark alone, from app icon down to 24px. Solid shapes only, so it holds up small: the H stays clear inside the leaf at every size.</p>
          </div>
        </div>
      </Row>

      <Row id="layout" label="Layout" labelledBy="ds-layout">
        <h2 id="ds-layout">The editorial grid</h2>
        <p className="hs-lede">Every section is a row: a 240px label column, then the content. Grids inside are separated by space rather than boxes or rules, and only a light hairline marks where one section ends. On phones the label stacks above its content, and lists of like things become swipe rows.</p>
        <div className="hs-ds-layout" aria-hidden="true">
          <div className="hs-ds-layout-label"><span className="hs-label">Label</span></div>
          <div className="hs-ds-layout-body">
            <span className="hs-ds-layout-h" />
            <span className="hs-ds-layout-p" />
            <div className="hs-ds-layout-grid"><span /><span /><span /><span /></div>
          </div>
        </div>
        <ul className="hs-ruled" style={{ marginTop: 32 }}>
          <li><h3>Rows</h3><p className="hs-ds-muted"><code>&lt;Row label=&hellip;&gt;</code>: label column, hairline above, content beside. 60px above content, 112px below; tighter on phones.</p></li>
          <li><h3>Grids</h3><p className="hs-ds-muted"><code>.hs-ruled</code>: two columns 80px apart, rows 56px apart, no rules; one column on phones.</p></li>
          <li><h3>Swipe rows</h3><p className="hs-ds-muted"><code>.hs-swipe</code>: on phones, services, steps, clinicians, and quotes scroll sideways with snapping, the next card peeking in.</p></li>
          <li><h3>Leaf radius</h3><p className="hs-ds-muted">Photos: 12px corners with two swept to 96px (64px on phones). Badges, highlights, and the switch use smaller leaves; buttons and inputs keep 6px.</p></li>
        </ul>
      </Row>

      <Row id="color" label="Color" labelledBy="ds-color">
        <h2 id="ds-color">Color</h2>
        <p className="hs-lede">Two color schemes, each with light and dark: Tide (cool, the default) and Shore (warm and cool combined). Switch them in the footer; the tables below follow the scheme you pick. Text ratios are computed from the values and measured against the page.</p>
        <ul className="hs-ruled hs-ds-schemes">
          {SCHEMES.map((sc) => (
            <li key={sc.id}>
              <div className="hs-ds-swatches" aria-hidden="true">
                {["--hs-page", "--hs-sand", "--hs-ink", "--hs-ember", "--hs-sage", "--hs-window"].map((t) => <span key={t} style={{ background: sc.v[t][0] }} />)}
              </div>
              <div className="hs-ds-swatches is-dark" aria-hidden="true">
                {["--hs-page", "--hs-sand", "--hs-ink", "--hs-ember", "--hs-sage", "--hs-window"].map((t) => <span key={t} style={{ background: sc.v[t][1] }} />)}
              </div>
              <h3>{sc.name}</h3>
              <p className="hs-ds-muted">{sc.note}</p>
            </li>
          ))}
        </ul>
        {SCHEMES.map((sc) => (
          <div key={sc.id} className="hs-ds-for" data-for={sc.id}>
            <h3 className="hs-ds-sub">{sc.name} tokens</h3>
            {/* Focusable so keyboard users can scroll it sideways on narrow screens. */}
            <div className="hs-ds-table-wrap" tabIndex={0} role="region" aria-label={`${sc.name} tokens`}>
              <table className="hs-ds-table">
                <thead>
                  <tr><th scope="col">Token</th><th scope="col">Light</th><th scope="col">Dark</th><th scope="col">Use</th></tr>
                </thead>
                <tbody>
                  {TOKENS.map(([token, name, use, measure]) => {
                    const [light, dark] = sc.v[token];
                    return (
                      <tr key={token}>
                        <th scope="row"><b>{name}</b><code>{token}</code></th>
                        <td><span className="hs-ds-chip" style={{ background: light }} />{light}{measure && <Ratio fg={light} bg={sc.v["--hs-page"][0]} />}</td>
                        <td><span className="hs-ds-chip" style={{ background: dark }} />{dark}{measure && <Ratio fg={dark} bg={sc.v["--hs-page"][1]} />}</td>
                        <td>{use}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <h3 className="hs-ds-sub">{sc.name} pairs</h3>
            <div className="hs-ds-table-wrap" tabIndex={0} role="region" aria-label={`${sc.name} contrast pairs`}>
              <table className="hs-ds-table">
                <thead><tr><th scope="col">Pair</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
                <tbody>
                  {[...sc.pairs, ...STATUS_PAIRS].map(([name, lf, lb, df, db]) => (
                    <tr key={name}>
                      <th scope="row">{name}</th>
                      <td><span className="hs-ds-pair" style={{ color: lf, background: lb }}>Aa</span><Ratio fg={lf} bg={lb} /></td>
                      <td><span className="hs-ds-pair" style={{ color: df, background: db }}>Aa</span><Ratio fg={df} bg={db} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </Row>

      <Row id="type" label="Type" labelledBy="ds-type">
        <h2 id="ds-type">Type</h2>
        <p className="hs-lede">Hanken Grotesk for headings, large and bold. Host Grotesk for body text at 18px (16px on phones). DM Mono for small labels and button text, never below 14px.</p>
        <div className="hs-ds-type">
          <div><span className="hs-label hs-ds-spec">Display · Hanken 600 · 44–84px</span><p className="hs-ds-display">Care at home, explained.</p></div>
          <div><span className="hs-label hs-ds-spec">Heading 2 · Hanken 600 · 34–54px</span><p className="hs-ds-h2">How care begins</p></div>
          <div><span className="hs-label hs-ds-spec">Feature title · Hanken 600 caps</span><p className="hs-ds-h2 hs-ds-caps">Care, close to home</p></div>
          <div><span className="hs-label hs-ds-spec">Heading 3 · Hanken 600 · 24px</span><p className="hs-ds-h3">A clinician visits your home</p></div>
          <div><span className="hs-label hs-ds-spec">Lede · Host 400 · 20px</span><p className="hs-lede" style={{ marginTop: 0 }}>Four steps from your first call to your first visit.</p></div>
          <div><span className="hs-label hs-ds-spec">Body · Host 400 · 18px / 1.6</span><p>We confirm your address is in our service area, talk with your doctor&rsquo;s office, and review your insurance before anything is scheduled.</p></div>
          <div><span className="hs-label hs-ds-spec">Label · DM Mono 500 · 14px caps</span><p className="hs-label">What we do</p></div>
          <div><span className="hs-label hs-ds-spec">Numerals · Hanken 300 · 56px</span><p className="hs-step-n">01 02 03 04</p></div>
        </div>
      </Row>

      <Row id="buttons" label="Buttons" labelledBy="ds-buttons">
        <h2 id="ds-buttons">Buttons</h2>
        <p className="hs-lede">Ink-filled, square-cornered, labels in mono caps, like the layout&rsquo;s editorial voice. Still 52px tall (44px small), well above the 24px minimum, because a shaky hand on a phone is our everyday user.</p>
        <ul className="hs-ruled">
          <li className="hs-ds-row"><Button icon="arrow">Request a call</Button><Button variant="secondary">Refer a patient</Button></li>
          <li className="hs-ds-row"><Button size="sm">Join our team</Button><Button variant="quiet" icon="arrow">See the checklist</Button></li>
          <li className="hs-ds-row"><PhoneLink /><ModeSwitch /></li>
          <li className="hs-ds-row"><Button disabled>Unavailable</Button></li>
        </ul>
        <div className="hs-band hs-ds-band-mini">
          <div className="hs-band-ctas" style={{ marginTop: 0 }}>
            <Button icon="arrow">Request a call</Button>
            <Button variant="secondary">Refer a patient</Button>
            <PhoneLink />
          </div>
        </div>
      </Row>

      <Row id="forms" label="Forms" labelledBy="ds-forms">
        <h2 id="ds-forms">Forms</h2>
        <p className="hs-lede">Labels always visible above the field, hints in plain language, errors that say how to fix it. Public forms ask only what we need to call back: never a medical history in an open text box.</p>
        <div className="hs-ruled">
          <div className="hs-ds-form">
            <div className="hs-field">
              <label htmlFor="ds-name">Your name</label>
              <input id="ds-name" className="hs-input" defaultValue="Ana Morales" readOnly />
            </div>
            <div className="hs-field">
              <label htmlFor="ds-phone">Best phone number</label>
              <input id="ds-phone" className="hs-input" defaultValue="(818) 555-01" aria-invalid="true" aria-describedby="ds-phone-err" readOnly />
              <p id="ds-phone-err" className="hs-error">Enter a 10-digit phone number, like (818) 675-0181.</p>
            </div>
            <div className="hs-field">
              <label htmlFor="ds-time">When should we call?</label>
              <select id="ds-time" className="hs-select" defaultValue="morning">
                <option value="morning">Morning (9 am–12 pm)</option>
                <option value="afternoon">Afternoon (12–5 pm)</option>
              </select>
              <p className="hs-hint">We call within one business day.</p>
            </div>
            <label className="hs-check"><input type="checkbox" defaultChecked /> I&rsquo;m calling for a family member</label>
          </div>
          <div><ZipCheck areas={AREAS} /></div>
        </div>
      </Row>

      <Row id="labels" label="Labels" labelledBy="ds-labels">
        <h2 id="ds-labels">Labels and notes</h2>
        <p className="hs-lede">Status labels for the intake pipeline always pair color with a word, so meaning never depends on color alone. The sample label marks anything invented.</p>
        <div className="hs-ds-row">
          <span className="hs-status">New</span>
          <span className="hs-status hs-status-accent">Assigned</span>
          <span className="hs-status hs-status-warn">Missing documents</span>
          <span className="hs-status hs-status-danger">Overdue</span>
          <span className="hs-status hs-status-ok">Accepted</span>
          <span className="hs-status hs-status-ok">Start of care</span>
          <Sample />
          <Sample>Placeholder credential</Sample>
        </div>
        <div className="hs-note" style={{ marginTop: 28, maxWidth: 640 }}><Icon name="info" /><p><strong>Note.</strong> For guidance that isn&rsquo;t a decision, like what Medicare generally covers.</p></div>
      </Row>

      <Row id="imagery" label="Imagery" labelledBy="ds-imagery">
        <h2 id="ds-imagery">Imagery</h2>
        <p className="hs-lede">Leaf-shaped photos with one cool, slightly faded grade, so pictures from different sources read as one set. A tiny blurred preview shows while each loads, and a photo beside a call to action eases in on its subject while you point at the button. Without a photo, the placeholder names the shot it&rsquo;s waiting for. Partner logos are illustrative marks.</p>
        <div className="hs-ruled">
          <figure className="hs-figure">
            <Photo src={SERVICES[0].photo.src} alt={SERVICES[0].photo.alt} position={SERVICES[0].photo.position} sizes="(max-width: 760px) 92vw, 40vw" />
            <figcaption><span>Skilled nursing</span><span>Granada Hills</span></figcaption>
          </figure>
          <div className="hs-ds-logos"><PartnerLogos /></div>
        </div>
      </Row>

      <Row id="lists" label="Components" labelledBy="ds-lists">
        <h2 id="ds-lists">Cards, badges, and switches</h2>
        <p className="hs-lede">Service cards are a leaf photo, the name with its icon flush right, then one line. Credentials are upright leaf badges. On phones, &ldquo;How can we help?&rdquo; becomes a two-way switch whose raised thumb glides between the choices, and the current page in the nav sits in a sand leaf.</p>
        <ul className="hs-services">
          {SERVICES.slice(0, 3).map((s) => (
            <li key={s.id} className="hs-service">
              <Photo src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(max-width: 760px) 92vw, 28vw" />
              <h3><Icon name={s.icon} /><span>{s.name}</span></h3>
              <p>{s.short}</p>
            </li>
          ))}
        </ul>
        <ul className="hs-creds" style={{ marginTop: 56 }}>
          {[["shield", "Medicare-certified"], ["clipboard", "State-licensed agency"], ["phone", "Intake answered seven days a week"]].map(([icon, text]) => (
            <li key={text} className="hs-cred"><span className="hs-cred-icon"><Icon name={icon} size={24} /></span><span>{text}</span></li>
          ))}
        </ul>
        <p className="hs-creds-note"><Sample /></p>
        <div className="hs-ds-row" style={{ marginTop: 40 }}>
          <span className="hs-ds-navleaf" aria-hidden="true"><span>Services</span><span className="is-on">Getting started</span><span>Careers</span></span>
          <span className="hs-ds-seg" aria-hidden="true"><span className="is-on">For families</span><span>For professionals</span></span>
        </div>
        <div className="hs-faq" style={{ marginTop: 40 }}>
          <details open><summary>{FAQS[0].q}</summary><p>{FAQS[0].a}</p></details>
          <details><summary>{FAQS[1].q}</summary><p>{FAQS[1].a}</p></details>
        </div>
      </Row>

      <Row id="principles" label="Principles" labelledBy="ds-principles">
        <h2 id="ds-principles">Principles</h2>
        <ul className="hs-ruled" style={{ marginTop: 32 }}>
          <li><h3>Guide, never decide</h3><p className="hs-ds-muted">The site explains coverage and eligibility in general terms and routes people to a person. Clinical and coverage decisions stay with clinicians and the intake team.</p></li>
          <li><h3>Ask for less</h3><p className="hs-ds-muted">Minimal public forms; health details only in the secure intake system. No advertising pixels or session recording on intake pages.</p></li>
          <li><h3>Readable first</h3><p className="hs-ds-muted">18px+ body, AAA body text, 52px buttons, labels at 14px+ (not the tiny labels the editorial style usually uses), zoom always allowed, everything usable by keyboard.</p></li>
          <li><h3>Calm by design</h3><p className="hs-ds-muted">One background, space instead of boxes and rules, one dark band per page. Motion is slow and stops entirely under reduced motion.</p></li>
        </ul>
      </Row>
    </div>
  );
}
