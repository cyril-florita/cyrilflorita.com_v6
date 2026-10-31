import { AREAS, BASE, CREDENTIALS, FAQS, SERVICES } from "@/components/hearthside/data";
import { Button, CallBand, CallButton, Icon, LogoMark, PartnerLogos, Photo, Row, Sample, titleWords } from "@/components/hearthside/ui";
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
// (measure: true) are checked against that scheme's page color.
const TOKENS = [
  ["--hs-page", "Page", "The one page background"],
  ["--hs-surface", "Surface", "Inputs, floating cards"],
  ["--hs-sand", "Alt surface", "Preview bar, hovers, chips"],
  ["--hs-ink", "Ink", "Headings, body text, primary buttons", true],
  ["--hs-ink-2", "Ink 2", "Secondary text", true],
  ["--hs-rule", "Rule", "Section and column hairlines (decorative)"],
  ["--hs-control", "Control", "Input and control borders", true],
  ["--hs-line", "Line", "Hairlines inside components (inputs, tables)"],
  ["--hs-ember", "Accent", "Button hover, highlights; in Shore dark, the peach fill of the current page and accent labels"],
  ["--hs-ember-hover", "Accent hover", "Links and accent text on hover"],
  ["--hs-on-ember", "On accent", "Text on an accent fill"],
  ["--hs-ember-text", "Accent text", "Links, the How can we help? lede, step numerals, the steps rail", true],
  ["--hs-ember-soft", "Accent tint", "The nav's current-page leaf and accent labels (not used in Shore dark, where the peach itself is)"],
  ["--hs-sage", "Sage", "Finished statuses only (Accepted, Start of care)", true],
  ["--hs-window", "Warm accent", "A light left on: the hero's first-visit dot, never text on a light ground"],
  ["--hs-glow", "Glow", "The first-visit dot's breathing glow"],
  ["--hs-house", "House", "The closing band in light mode and the dark chapter (Behind the scenes)"],
  ["--hs-focus", "Focus", "Focus rings (≥3:1 against the page)"],
  ["--hs-photo", "Photo", "Photo placeholders"],
  ["--hs-hill-2", "Map", "The service-area map's hills"],
];
const SCHEMES = [
  {
    id: "tide", name: "Tide", note: "Cool: misty blue-gray pages, navy ink, a harbor-blue accent. Dark: navy pages, blue-tinted ink, a sky-blue accent.",
    v: {
      "--hs-page": ["#F2F5F7", "#1E2A36"], "--hs-surface": ["#FBFCFD", "#253340"], "--hs-sand": ["#E3EAEF", "#2A3846"],
      "--hs-ink": ["#1E2A36", "#E3EDF8"], "--hs-ink-2": ["#3F4D5A", "#C3CFDA"], "--hs-rule": ["#B8C5D0", "#455565"],
      "--hs-control": ["#75838F", "#8593A1"], "--hs-ember": ["#1F5E8C", "#7FB6E0"], "--hs-ember-text": ["#1B5480", "#93C3E8"],
      "--hs-sage": ["#2F6650", "#93C9AC"], "--hs-window": ["#D98A2B", "#F0A04A"],
      "--hs-line": ["#D3DCE3", "#34434F"], "--hs-ember-hover": ["#184B70", "#93C3E8"], "--hs-on-ember": ["#FFFFFF", "#0D1720"], "--hs-ember-soft": ["#DCE8F2", "#2A4560"],
      "--hs-glow": ["#FFC27A", "#FFB25C"], "--hs-house": ["#22303D", "#141D26"], "--hs-focus": ["#1F5FBF", "#8DB8FF"], "--hs-photo": ["#E1E8EE", "#26323F"], "--hs-hill-2": ["#9DB2C6", "#273644"],
    },
    band: { bg: ["#22303D", "#F2F5F7"], ink: ["#E3EDF8", "#1E2A36"], ink2: ["#C3CFDA", "#3F4D5A"], accent: ["#93C3E8", "#1B5480"] },
    pairs: [["Page on Ink (primary button)", "#F2F5F7", "#1E2A36", "#1E2A36", "#E3EDF8"], ["Label on Accent (button hover)", "#F2F5F7", "#1F5E8C", "#1E2A36", "#7FB6E0"], ["Current page / accent label", "#1B5480", "#DCE8F2", "#93C3E8", "#2A4560"], ["Ink 2 on Alt surface", "#3F4D5A", "#E3EAEF", "#C3CFDA", "#2A3846"]],
  },
  {
    id: "shore", name: "Shore", note: "The default, in dark mode. Warm and cool combined. Light: warm linen pages, navy ink, a harbor-blue accent. Dark: navy pages, warm ink, a peach accent.",
    v: {
      "--hs-page": ["#F6F2EA", "#1E2A36"], "--hs-surface": ["#FFFDF8", "#253240"], "--hs-sand": ["#ECE5D8", "#2B3745"],
      "--hs-ink": ["#1E2A36", "#F4EEE5"], "--hs-ink-2": ["#3E4956", "#CFC7BB"], "--hs-rule": ["#C7BDAD", "#485564"],
      "--hs-control": ["#7C8089", "#8A929C"], "--hs-ember": ["#1F5E8C", "#EE9466"], "--hs-ember-text": ["#1B5480", "#F4A77F"],
      "--hs-sage": ["#2F6650", "#93C9AC"], "--hs-window": ["#C0602E", "#EE9466"],
      "--hs-line": ["#DDD4C5", "#36424F"], "--hs-ember-hover": ["#184B70", "#F4A77F"], "--hs-on-ember": ["#FFFFFF", "#1B1410"], "--hs-ember-soft": ["#DCE6EE", "#4A2F22"],
      "--hs-glow": ["#FFB066", "#FFA459"], "--hs-house": ["#1E2A36", "#141B23"], "--hs-focus": ["#1F5FBF", "#8DB8FF"], "--hs-photo": ["#E7E0D5", "#27313D"], "--hs-hill-2": ["#A1AFBC", "#263442"],
    },
    band: { bg: ["#1E2A36", "#F6F2EA"], ink: ["#F4EEE5", "#1E2A36"], ink2: ["#CFC7BB", "#3E4956"], accent: ["#F4A77F", "#B0401A"] },
    pairs: [["Page on Ink (primary button)", "#F6F2EA", "#1E2A36", "#1E2A36", "#F4EEE5"], ["Label on Accent (button hover)", "#F6F2EA", "#1F5E8C", "#1E2A36", "#EE9466"], ["Current page / accent label (dark: on the peach)", "#1B5480", "#DCE6EE", "#1B1410", "#EE9466"], ["Ink 2 on Alt surface", "#3E4956", "#ECE5D8", "#CFC7BB", "#2B3745"]],
  },
];
// Status colors are shared by both schemes.
const STATUS_PAIRS = [
  ["Sage on Sage tint (status)", "#2F6650", "#DDEBE2", "#93C9AC", "#27443A"],
  ["Warning on Warning tint", "#7A5200", "#F7E8C6", "#E9C177", "#45381C"],
  ["Danger on Danger tint", "#A1342A", "#F7DEDA", "#F0998D", "#4A2A26"],
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
          <h1 className="hs-title-split" aria-label="Design system">{titleWords("Design system")}</h1>
          <p className="hs-lede">
            An editorial grid for a care brand: one calm background, generous space between sections, a label column beside every section, and type that&rsquo;s large and easy to read. Dark by default, with a full light mode; body text meets WCAG AAA (7:1) in both.
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
        <p className="hs-lede">Two color schemes, each with light and dark: Tide (cool) and Shore (warm and cool combined, the default, in dark mode). Switch them in the footer; the tables below follow the scheme you pick. Text ratios are computed from the values and measured against the page.</p>
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
            <h3 className="hs-ds-sub">{sc.name} closing band</h3>
            <p className="hs-ds-muted" style={{ marginBottom: 16 }}>The band (<code>--hb-*</code>) is navy in light mode and inverts to the scheme&rsquo;s light page in dark mode, so it stands out from the page either way. Ratios against the band.</p>
            <div className="hs-ds-table-wrap" tabIndex={0} role="region" aria-label={`${sc.name} closing band`}>
              <table className="hs-ds-table">
                <thead><tr><th scope="col">Band</th><th scope="col">Light mode</th><th scope="col">Dark mode</th></tr></thead>
                <tbody>
                  {[["Ink (heading)", "ink"], ["Ink 2 (lede)", "ink2"], ["Accent (text link)", "accent"]].map(([name, k]) => (
                    <tr key={k}>
                      <th scope="row">{name}</th>
                      {[0, 1].map((m) => <td key={m}><span className="hs-ds-pair" style={{ color: sc.band[k][m], background: sc.band.bg[m] }}>Aa</span><Ratio fg={sc.band[k][m]} bg={sc.band.bg[m]} /></td>)}
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
        <p className="hs-lede">Fraunces italic for page titles and the editorial accents. Hanken Grotesk for section headings, large and bold. Host Grotesk for body text at 18px (16px on phones). DM Mono for small labels and button text, never below 14px.</p>
        <div className="hs-ds-type">
          <div><span className="hs-label hs-ds-spec">Page title · Fraunces 400 italic · 44–84px · −0.05em</span><p className="hs-ds-display">Compassionate care at home.</p></div>
          <div><span className="hs-label hs-ds-spec">Heading 2 · Hanken 600 · 34–54px</span><p className="hs-ds-h2">How care begins</p></div>
          <div><span className="hs-label hs-ds-spec">Accent line · Fraunces italic</span><p className="hs-ds-h2">Coming home is a big day. <em className="hs-statement-em">We make the next part simple.</em></p></div>
          <div><span className="hs-label hs-ds-spec">Heading 3 · Hanken 600 · 24px</span><p className="hs-ds-h3">A clinician visits your home</p></div>
          <div><span className="hs-label hs-ds-spec">Lede · Host 400 · 20px</span><p className="hs-lede" style={{ marginTop: 0 }}>Four steps from your first call to your first visit.</p></div>
          <div><span className="hs-label hs-ds-spec">Body · Host 400 · 18px / 1.6</span><p>We confirm your address is in our service area, talk with your doctor&rsquo;s office, and review your insurance before anything is scheduled.</p></div>
          <div><span className="hs-label hs-ds-spec">Label · DM Mono 500 · 14px caps</span><p className="hs-label">What we do</p></div>
          <div><span className="hs-label hs-ds-spec">Quote · Fraunces italic · 26–38px</span><p className="hs-ds-quote">&ldquo;They called back within the hour.&rdquo;</p></div>
          <div><span className="hs-label hs-ds-spec">Step numerals · Fraunces italic · 112px</span><p className="hs-ds-numerals">1 2 3 4</p></div>
        </div>
      </Row>

      <Row id="buttons" label="Buttons" labelledBy="ds-buttons">
        <h2 id="ds-buttons">Buttons</h2>
        <p className="hs-lede">Ink-filled or outlined, 6px corners, labels in mono caps. 52px tall (44px small; 65px in the hero and page heads on tablets and up), well above the 24px minimum, because a shaky hand on a phone is our everyday user.</p>
        <ul className="hs-ruled hs-ds-btn-rules">
          <li><div className="hs-ds-row"><CallButton /><Button href="#request-a-call" variant="secondary" lead="callback">Request a call</Button><Button href={`${BASE}/referrals/`} variant="quiet" lead="refer">Refer a patient</Button></div>
            <p className="hs-ds-muted">The order everywhere a call is offered: Call first and filled, with the phone; Request a call outlined, with the calendar; Refer a patient as a text link, with the person-plus.</p></li>
          <li><div className="hs-ds-row"><Button href={`${BASE}/referrals/#checklist`} variant="secondary" lead="checklist">See the checklist</Button><Button href={`${BASE}/getting-started/`} variant="quiet" icon="arrow">How care begins</Button></div>
            <p className="hs-ds-muted">Lead icons name the action and stay still. A trailing arrow means the link takes you somewhere, and nudges on hover; buttons that act in place (submit, shuffle, mail) have none.</p></li>
          <li><div className="hs-ds-row"><Button size="sm">Join our team</Button><Button disabled>Unavailable</Button><ModeSwitch /></div>
            <p className="hs-ds-muted">Small (44px) for dense spots like the intake app; disabled at half opacity; the light/dark toggle matches the buttons&rsquo; border and corners.</p></li>
        </ul>
        <div className="hs-ds-band">
          <CallBand id="ds-band" title="Not sure where to start? Start with a call." lede="The closing band: the last section before the footer on Home, Services, and Getting started, with the calls to action in the hero's order." />
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
        <h2 id="ds-lists">Cards, figures, and switches</h2>
        <p className="hs-lede">Service cards are a leaf photo, the name with its icon flush right, then one line. Credentials are editorial figures: a large lead, then the rest of the sentence. On phones, &ldquo;How can we help?&rdquo; becomes a two-way switch whose raised thumb glides between the choices, and the current page in the nav sits in an accent leaf (the peach itself in Shore dark).</p>
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
          {CREDENTIALS.map((c) => <li key={c.value} className="hs-cred"><span className="hs-cred-value">{c.value}</span> <span className="hs-cred-text">{c.text}</span></li>)}
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
        <h3 className="hs-ds-sub">Page patterns</h3>
        <ul className="hs-ruled">
          <li><h3>Chapters</h3><p className="hs-ds-muted"><code>.hs-chapter</code>: full-bleed sections that break the run of rows. Sand (How can we help?, In their words, a sub-page&rsquo;s middle row) or dark (Behind the scenes), never side by side, since in dark mode the two are close.</p></li>
          <li><h3>Path cards</h3><p className="hs-ds-muted"><code>.hs-path</code>: a tag with its icon (families, clinician), a 16:9 photo, a title, and the calls to action pinned to the foot. On phones only the chosen card shows, under the switch.</p></li>
          <li><h3>Full-bleed pause</h3><p className="hs-ds-muted"><code>.hs-bleed</code>: one photo edge to edge, its line in the serif italic in a page-colored leaf panel at the foot. Never a gradient over a photo to carry text.</p></li>
          <li><h3>Steps</h3><p className="hs-ds-muted">A 4:3 leaf photo with the number in a page-colored leaf tile in its tight corner. On desktop the list pins and plays as a scroll story with a large serif numeral and a rail that fills as you go.</p></li>
          <li><h3>Clinicians</h3><p className="hs-ds-muted">A square leaf portrait, the name with credentials on a quieter line, role, then visits, languages, and experience on one line across the row. Their own words show on hover with a mouse, inline on touch.</p></li>
          <li><h3>Contact dock</h3><p className="hs-ds-muted">The site&rsquo;s one home for &ldquo;talk to us&rdquo;: Call and the page&rsquo;s main action, floating once the page&rsquo;s own buttons scroll away, plus back to top on desktop. Families get Request a call; referral pages get Refer a patient.</p></li>
        </ul>
        <div className="hs-ds-row" style={{ marginTop: 32 }}>
          <Sample /><Sample>Sample patient</Sample><Sample>Sample data</Sample><Sample>Sample partners</Sample>
        </div>
      </Row>

      <Row id="principles" label="Principles" labelledBy="ds-principles">
        <h2 id="ds-principles">Principles</h2>
        <ul className="hs-ruled" style={{ marginTop: 32 }}>
          <li><h3>Guide, never decide</h3><p className="hs-ds-muted">The site explains coverage and eligibility in general terms and routes people to a person. Clinical and coverage decisions stay with clinicians and the intake team.</p></li>
          <li><h3>Ask for less</h3><p className="hs-ds-muted">Minimal public forms; health details only in the secure intake system. No advertising pixels or session recording on intake pages.</p></li>
          <li><h3>Readable first</h3><p className="hs-ds-muted">18px+ body, AAA body text, 52px buttons, labels at 14px+ (not the tiny labels the editorial style usually uses), zoom always allowed, everything usable by keyboard.</p></li>
          <li><h3>Calm by design</h3><p className="hs-ds-muted">One background, space instead of boxes and rules, a chapter or two for rhythm, one closing band. Motion is slow and stops entirely under reduced motion.</p></li>
        </ul>
      </Row>
    </div>
  );
}
