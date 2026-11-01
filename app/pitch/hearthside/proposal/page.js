import { BASE, PITCH_EMAIL, PITCH_MAILTO } from "@/components/hearthside/data";
import { Button, Icon, Logo, PageHead, Row } from "@/components/hearthside/ui";
import { ModeSwitch, PrintButton } from "@/components/hearthside/client";
import "@/app/pitch/hearthside/css/proposal.css";

// The pitch's one-pager for agency owners: what Cyril would build for their
// agency, how the work runs, and what it costs. Outside (public), so it has
// no site nav or contact dock (it's a document, not part of the agency's
// site); prints cleanly to a PDF. Not indexed and not in the sitemap: it's
// shared by link, from the footer's "For agency owners" row.

export const metadata = {
  title: "A website and intake system for your agency",
  description: "A proposal for home health agency owners: a website families can use and the referral intake system behind it, designed and built by Cyril Florita.",
  alternates: { canonical: `${BASE}/proposal/` },
  robots: { index: false, follow: true },
};

const PROBLEMS = [
  ["Families can’t tell what fits", "Home health, home care, and hospice blur together, and coverage reads like fine print. Families tend to call the agency that explains it most clearly."],
  ["Referrals arrive by fax and voicemail", "Discharge planners send a patient and hear nothing back, so next time they send them somewhere that answers."],
  ["Intake lives in inboxes", "Nobody can see who owns a referral, what’s missing, or what’s overdue until a patient falls through."],
];

const BUILD = [
  {
    title: "Your website",
    icon: "website",
    points: [
      "Pages for families: services, how care begins, your clinicians, coverage guidance, and FAQ",
      "Pages for referral partners: a document checklist, a referral form, and a status link they can share",
      "Your service area, with a ZIP check",
      "A careers page, and a request-a-call form that opens right where you are",
      "Designed for phones first, accessible to WCAG AA, with AAA body text",
    ],
  },
  {
    title: "Your intake system",
    icon: "dashboard",
    points: [
      "A board of every open referral, by stage, with an owner and a time limit for each",
      "Routing by ZIP code to the right coordinator, with the first-call task created for them",
      "Missing documents flagged and requested through the secure portal",
      "Referral records with the next action, documents, and an activity log",
      "Tasks, partner follow-ups, and reports on speed, sources, and outcomes",
    ],
  },
];

const STEPS = [
  ["Discovery", "We map how referrals reach you today, who handles them, and where they stall. You get a written plan and a fixed quote.", "About two weeks"],
  ["Design", "Your brand, photos, and words on the pages, reviewed with you on real devices.", "Three to four weeks"],
  ["Build and launch", "The website goes live first. The intake system follows in stages, alongside how your team already works.", "Four to eight weeks"],
  ["Care", "Updates, new pages, accessibility checks, and improvements based on how families and partners use the site.", "Monthly"],
];

const PRICES = [
  ["Website", "$8,000–$15,000", "One time, depending on the number of pages and how much writing and photography you need."],
  ["Care and improvements", "$2,000–$3,000 a month", "Hosting, updates, content changes, accessibility checks, and ongoing improvements."],
  ["Intake system", "Quoted after discovery", "It depends on your volume, your team, and the systems it connects to, so it’s priced once we’ve mapped your intake together."],
];

const NEEDS = [
  "An hour with whoever handles intake today, and one with a referral partner if possible",
  "Your service area, services, and credentials",
  "Photos of your team, or time for a short shoot",
  "Who approves copy, so pages don’t wait on review",
];

export default function Proposal() {
  return (
    <div className="hs-shell hs-proposal">
      <header className="hs-prop-top">
        <div className="hs-wrap hs-prop-top-row">
          <Logo />
          <div className="hs-prop-top-actions">
            <PrintButton />
            <ModeSwitch />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="hs-wrap">
        <PageHead
          title="A website and intake system for your agency"
          lede="Hearthside is a working example: a website families can use, and the intake system that takes each referral from first call to start of care. Here’s how I’d build the same for your agency."
        >
          <div className="hs-prop-ctas">
            <Button href={PITCH_MAILTO} lead="mail">Email Cyril</Button>
            <Button href={`${BASE}/`} variant="secondary" prefetch={false}>See the example site</Button>
          </div>
        </PageHead>

        <Row label="The problem" labelledBy="pr-problem">
          <h2 id="pr-problem">Where agencies lose patients</h2>
          <ul className="hs-ruled hs-prop-problems">
            {PROBLEMS.map(([t, d]) => <li key={t}><h3>{t}</h3><p>{d}</p></li>)}
          </ul>
        </Row>

        <Row label="What you get" labelledBy="pr-build">
          <h2 id="pr-build">A website and an intake system, built together</h2>
          <div className="hs-ruled">
            {BUILD.map((b) => (
              <div key={b.title} className="hs-prop-build">
                <h3><Icon name={b.icon} />{b.title}</h3>
                <ul className="hs-list">{b.points.map((p) => <li key={p}><Icon name="check" size={20} />{p}</li>)}</ul>
              </div>
            ))}
          </div>
          <p className="hs-prop-try">Try both: <a href={`${BASE}/referrals/#refer`}>send a sample referral</a>, then <a href={`${BASE}/intake/`}>watch it arrive in intake</a>.</p>
        </Row>

        <Row label="How we work" labelledBy="pr-steps">
          <h2 id="pr-steps">Four steps, with one person doing the work</h2>
          <ol className="hs-prop-steps">
            {STEPS.map(([t, d, when], i) => (
              <li key={t}>
                <span className="hs-prop-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
                <span className="hs-prop-when">{when}</span>
              </li>
            ))}
          </ol>
        </Row>

        <Row label="Investment" labelledBy="pr-price">
          <h2 id="pr-price">What it costs</h2>
          <dl className="hs-prop-prices">
            {PRICES.map(([t, price, d]) => (
              <div key={t}>
                <dt>{t}</dt>
                <dd><b>{price}</b><span>{d}</span></dd>
              </div>
            ))}
          </dl>
          <p className="hs-hint hs-prop-note">These are ranges. Discovery ends with a fixed price for your agency.</p>
        </Row>

        <Row label="Privacy" labelledBy="pr-privacy">
          <h2 id="pr-privacy">Patient information: HIPAA-compliant hosting, staff sign-in, and an audit log</h2>
          <div className="hs-note"><Icon name="shield" /><p>The example stores nothing: its referral form can only send a generated sample patient, and everything stays in your browser. A live intake system holds protected health information, so it runs on HIPAA-compliant hosting under a business associate agreement, with sign-in for staff, role-based access, and an audit log. Public pages never collect health details, and the status link partners share shows progress only.</p></div>
        </Row>

        <Row label="From you" labelledBy="pr-needs">
          <h2 id="pr-needs">What I&rsquo;ll need</h2>
          <ul className="hs-list hs-prop-needs">{NEEDS.map((n) => <li key={n}><Icon name="check" size={20} />{n}</li>)}</ul>
        </Row>

        <Row label="About me" labelledBy="pr-me">
          <h2 id="pr-me">Cyril Florita</h2>
          <p className="hs-lede">I&rsquo;m a product designer and front-end developer. I design and build the whole thing myself, so the person you talk to is the person who makes it. Hearthside is one example; <a href="/viteo/">Viteo</a>, a subscription product, is another, and <a href="/">my portfolio</a> has the rest.</p>
        </Row>

        <section className="hs-band" aria-labelledby="pr-band">
          <h2 id="pr-band">Let&rsquo;s look at your intake together.</h2>
          <p>A 30-minute call: you tell me how referrals reach you today, and I&rsquo;ll show you where this would help. No pitch deck.</p>
          <div className="hs-band-ctas">
            <Button href={PITCH_MAILTO} lead="mail">Email Cyril</Button>
            <Button href={`${BASE}/intake/`} variant="secondary" icon="arrow">Try the intake demo</Button>
          </div>
          <p className="hs-prop-email">{PITCH_EMAIL}</p>
        </section>
      </main>
      <footer className="hs-wrap hs-prop-foot">
        <p>Design and Dev Pitch · &copy; {new Date().getFullYear()} Cyril Florita. All rights reserved.</p>
      </footer>
    </div>
  );
}
