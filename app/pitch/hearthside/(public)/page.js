import { BASE, FAQS, MEDICARE_CONDITIONS, MEDICARE_URL, PHONE, SERVICES, STEPS, AREAS } from "@/components/hearthside/data";
import { Button, Icon, PartnerLogos, PhoneLink, Photo, Row, Sample } from "@/components/hearthside/ui";
import { BehindTheScenes, PathSwitch, ScrollCue, ZipCheck } from "@/components/hearthside/client";
import { PHOTO_LQIP } from "@/components/hearthside/photo-lqip";

export const metadata = {
  title: { absolute: "Hearthside Home Health — Skilled care at home | Design & dev pitch by Cyril Florita" },
  alternates: { canonical: "/pitch/hearthside/" },
};

// Home, roughly in the order the brief sets out (services and geography up
// front, separate paths for families and professionals, services with the
// team's photos folded into their cards, how care begins, coverage guidance,
// service area, FAQ, contact), laid out as an editorial grid: each section a
// hairline-ruled row with a label column.

// The hero photo: a nurse, a patient and her daughter at home, in the site's
// photo grade (supplied by Cyril, AI-generated; 1536×1024, exported at 1400w
// and full size). The nurse sits left; the first-visit card sits bottom right.
function HeroArt() {
  return (
    <div className="hs-hero-art" style={{ backgroundImage: `url(${PHOTO_LQIP["/img/hearthside/photos/hero-care"]})` }}>
      <img className="hs-hero-img" src="/img/hearthside/photos/hero-care-1400.webp" width="1400" height="933"
        srcSet="/img/hearthside/photos/hero-care-1400.webp 1400w, /img/hearthside/photos/hero-care-1536.webp 1536w" sizes="(max-width: 1440px) 100vw, 1280px"
        alt="A smiling nurse in blue scrubs sits with an older woman on her sofa while the woman's daughter rests a hand on her shoulder" fetchPriority="high" decoding="async" />
      <div className="hs-art-card">
        <span className="hs-art-dot" aria-hidden="true" />
        <p>
          <strong>First visit: Tuesday, 10:00 am</strong>
          <span>Maria R., RN · we&rsquo;ll call when she&rsquo;s on her way</span>
        </p>
      </div>
    </div>
  );
}

// One photo per service card on Home (What we do), keyed by service id.
// Trust details (all sample content): credentials, the clinicians who visit
// (portraits supplied by Cyril, AI-generated with Perplexity),
// and what families say. Fictional but specific; no outcome claims.
const CREDENTIALS = [
  { icon: "shield", text: "Medicare-certified" },
  { icon: "clipboard", text: "State-licensed home health agency" },
  { icon: "check", text: "Bonded and insured" },
  { icon: "map", text: "Serving both valleys since 2009" },
  { icon: "phone", text: "Intake answered seven days a week" },
];
const CLINICIANS = [
  { photo: "/img/hearthside/photos/team-maria-reyes", initials: "MR", name: "Maria Reyes, RN", role: "Nurse case manager", area: "Granada Hills", languages: "English, Spanish", years: 14 },
  { photo: "/img/hearthside/photos/team-david-okafor", initials: "DO", name: "David Okafor, PT, DPT", role: "Physical therapist", area: "Valencia", languages: "English", years: 9 },
  { photo: "/img/hearthside/photos/team-ani-petrosyan", initials: "AP", name: "Ani Petrosyan, OTR/L", role: "Occupational therapist", area: "Burbank", languages: "English, Armenian", years: 11 },
  { photo: "/img/hearthside/photos/team-grace-atienza", initials: "GA", name: "Grace Atienza, CCC-SLP", role: "Speech-language pathologist", area: "Sherman Oaks", languages: "English, Tagalog", years: 8 },
];
const QUOTES = [
  { text: "The hospital sent the referral on a Tuesday, and Hearthside called me that afternoon. From then on, I always knew who was coming and when.", who: "Daughter of a patient, Santa Clarita" },
  { text: "Our therapist worked on Dad\u2019s own hallway and stairs, not a clinic\u2019s. He started looking forward to the visits.", who: "Son of a patient, Van Nuys" },
];

export default function HearthsideHome() {
  return (
    <div className="hs-wrap">
      {/* The hero: one wide rectangular photo with the eyebrow in a tab cut
          into its top-right corner, then the headline under it on the page,
          level with the calls to action on the right. */}
      <section className="hs-hero" aria-labelledby="hs-hero-title">
        <div className="hs-hero-stage">
          <HeroArt />
          <p className="hs-hero-tab"><span className="hs-eyebrow">Skilled home health · San Fernando &amp; Santa Clarita Valleys</span></p>
          <div className="hs-hero-notch">
            <h1 id="hs-hero-title"><span>Compassionate</span> <span>care at home.</span></h1>
          </div>
          <div className="hs-hero-actions" data-dock-hide>
            <div className="hs-hero-ctas">
              <Button href={`${BASE}/contact/`} icon="arrow">Request a call</Button>
              <Button href={`${BASE}/referrals/`} variant="secondary">Refer a patient</Button>
            </div>
            <p className="hs-hero-call">
              <span>Or call our intake team:</span>
              <PhoneLink />
            </p>
          </div>
        </div>
        <div className="hs-hero-copy">
          <p className="hs-lede">
            Nurses and therapists who come to you after a hospital stay, illness, or injury. We&rsquo;ll guide every next step.
          </p>
        </div>
      </section>

      <ScrollCue target="hs-creds" />
      <Row id="hs-creds" label="Credentials" labelledBy="hs-creds-title" tight>
        <h2 id="hs-creds-title" className="hs-visually-hidden">Credentials</h2>
        <ul className="hs-creds">
          {CREDENTIALS.map((c) => <li key={c.text} className="hs-cred"><span className="hs-cred-icon"><Icon name={c.icon} size={24} /></span>{c.text}</li>)}
        </ul>
        <p className="hs-creds-note"><Sample /></p>
      </Row>

      <Row label="Referral partners" tight>
        <PartnerLogos />
        <p className="hs-logos-note"><Sample>Sample partners</Sample> Hospitals, physicians, and senior communities across the Valley refer patients to us.</p>
      </Row>

      <Row label="Start here" labelledBy="hs-paths-title">
        <h2 id="hs-paths-title">How can we help?</h2>
        {/* Phones: a two-option switch above the cards shows one at a time
            (PathSwitch in client.js), so both choices are seen at once and the
            chosen card keeps its detail. Desktop and tablet show both cards. */}
        <PathSwitch labels={["For families", "For professionals"]}>
          <article className="hs-path">
            {/* Supplied by Cyril (AI-generated with Perplexity); same grade. */}
            <Photo shot="An older parent on the phone at home, her daughter beside her" src="/img/hearthside/photos/family-phone" alt="An older woman talks on the phone on her sofa while her daughter sits close, holding her arm" position="45% 30%" sizes="(max-width: 760px) 92vw, 40vw" />
            <h3>I&rsquo;m looking for care for myself or someone I love</h3>
            <ul className="hs-path-list">
              <li><Icon name="check" size={20} />Plain answers about what home health covers</li>
              <li><Icon name="check" size={20} />We work with your doctor, so you don&rsquo;t have to chase paperwork</li>
              <li><Icon name="check" size={20} />A short call, no forms about your medical history</li>
            </ul>
            <div className="hs-path-ctas">
              <Button href={`${BASE}/getting-started/`} icon="arrow">How care begins</Button>
              <Button href={`${BASE}/contact/`} variant="quiet">Request a call</Button>
            </div>
          </article>
          <article className="hs-path">
            {/* Supplied by Cyril (AI-generated with Perplexity); same grade. */}
            <Photo shot="A clinician talking a care plan through with an older patient at her desk" src="/img/hearthside/photos/pro-consult" alt="A smiling nurse in blue scrubs talks with an older woman across a desk with a laptop and paperwork" position="45% 30%" sizes="(max-width: 760px) 92vw, 40vw" />
            <h3>I&rsquo;m a physician, hospital, or discharge planner</h3>
            <ul className="hs-path-list">
              <li><Icon name="check" size={20} />A referral checklist and secure document submission</li>
              <li><Icon name="check" size={20} />Confirmation when your referral arrives</li>
              <li><Icon name="check" size={20} />A status link you can check, from received to start of care</li>
            </ul>
            <div className="hs-path-ctas">
              <Button href={`${BASE}/referrals/`} icon="arrow">Refer a patient</Button>
              <Button href={`${BASE}/referrals/#checklist`} variant="quiet">See the checklist</Button>
            </div>
          </article>
        </PathSwitch>
      </Row>

      <Row label="What we do" labelledBy="hs-services-title">
        <h2 id="hs-services-title">Skilled care, in your own home</h2>
        <p className="hs-lede">Home health is medical care your doctor orders, delivered by registered nurses and licensed therapists who live and work in the Valley, visiting on a schedule so you can recover where you&rsquo;re most comfortable.</p>
        <ul className="hs-services hs-swipe">
          {SERVICES.map((s) => {
            const ph = s.photo;
            return (
              <li key={s.id} className="hs-service">
                <Photo shot={ph.shot} src={ph.src} alt={ph.alt} position={ph.position} sizes="(max-width: 760px) 92vw, (max-width: 960px) 45vw, 28vw" />
                <h3><Icon name={s.icon} /><span>{s.name.slice(0, s.name.lastIndexOf(" "))} <span className="hs-l2">{s.name.slice(s.name.lastIndexOf(" ") + 1)}</span></span></h3>
                <p>{s.short}</p>
              </li>
            );
          })}
        </ul>
        <div className="hs-aside">
          <p><strong>Looking for help with meals, housekeeping, or companionship?</strong> That&rsquo;s non-medical home care, a different service. We&rsquo;re happy to point you to local options.</p>
          <Button href={`${BASE}/services/#which-care`} variant="quiet" icon="arrow">Which kind of care fits?</Button>
        </div>
      </Row>

      <Row label="Getting started" labelledBy="hs-steps-title">
        <h2 id="hs-steps-title">How care begins</h2>
        <p className="hs-lede">Four steps from your first call to your first visit. We&rsquo;ll tell you what&rsquo;s happening at each one.</p>
        <ol className="hs-ruled hs-swipe">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hs-step">
              <Photo shot={s.title} src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(max-width: 760px) 92vw, 30vw" />
              <span className="hs-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </Row>

      <Row label="Our clinicians" labelledBy="hs-team-title">
        <h2 id="hs-team-title">The people who visit</h2>
        <p className="hs-lede">Nurses and therapists who live and work in the Valley. You&rsquo;ll know your clinician&rsquo;s name before the first visit.</p>
        <ul className="hs-clinicians hs-swipe">
          {CLINICIANS.map((c) => (
            <li key={c.name} className="hs-clinician">
              <Photo shot={`Portrait of ${c.name}`} src={c.photo} alt={`${c.name}, ${c.role.toLowerCase()}`} ratio="1 / 1" position="50% 30%" sizes="(max-width: 600px) 92vw, (max-width: 1100px) 45vw, 20vw" />
              <h3>{c.name.split(", ")[0]}<span className="hs-clinician-cred">{c.name.split(", ").slice(1).join(", ")}</span></h3>
              <p className="hs-clinician-role">{c.role}</p>
              <dl className="hs-clinician-meta">
                <div><dt>Visits</dt><dd>{c.area}</dd></div>
                <div><dt>Speaks</dt><dd>{c.languages}</dd></div>
                <div><dt>Experience</dt><dd>{c.years} years</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="hs-creds-note"><Sample /></p>
      </Row>

      <Row label="Insurance & payment" labelledBy="hs-coverage-title">
        <div className="hs-coverage">
          <div>
            <h2 id="hs-coverage-title">Will Medicare cover home health?</h2>
            <p style={{ marginTop: 24 }}>Medicare covers home health care when certain conditions are met. Generally:</p>
            <ul className="hs-checks">
              {MEDICARE_CONDITIONS.map((c) => <li key={c}><Icon name="check" size={20} />{c}</li>)}
            </ul>
          </div>
          <div>
            <div className="hs-note">
              <Icon name="info" />
              <p>
                <strong>This is general guidance, not a coverage decision.</strong> Your doctor and our intake team confirm eligibility, and we review your coverage with you before care begins. We also work with many Medicare Advantage and commercial plans.
              </p>
            </div>
            <div className="hs-coverage-links">
              <a href={MEDICARE_URL}>Read Medicare&rsquo;s home health guide <span className="hs-visually-hidden">(opens medicare.gov)</span></a>
              <Button href={`${BASE}/getting-started/#coverage`} variant="secondary" icon="arrow">Insurance &amp; payment</Button>
            </div>
          </div>
        </div>
      </Row>

      <Row label="Service area" labelledBy="hs-area-title">
        <div className="hs-area">
          <div>
            <h2 id="hs-area-title">Where we provide care</h2>
            <p className="hs-lede" style={{ marginBottom: 32 }}>Across the San Fernando and Santa Clarita Valleys.</p>
            <div className="hs-area-list">
              {AREAS.map((a) => (
                <div key={a.id}>
                  <h3>{a.name}</h3>
                  <p>{a.communities.map(([town]) => town).join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ZipCheck areas={AREAS} />
            <p className="hs-hint" style={{ marginTop: 14 }}>
              Outside these areas? <a href={PHONE.href}>Call us</a> and we&rsquo;ll help you find an agency nearby.
            </p>
          </div>
        </div>
      </Row>

      {/* For agency owners: the system behind the site, in motion. */}
      <Row label="Behind the scenes" labelledBy="hs-bts-title">
        <div className="hs-bts-row">
          <div>
            <h2 id="hs-bts-title">Every referral, tracked from the first call</h2>
            <p className="hs-lede">The intake system behind this site routes each referral to the right coordinator by ZIP code, logs every call, and flags what&rsquo;s missing, so nothing waits in an inbox.</p>
            <div className="hs-hero-ctas" style={{ marginTop: 28 }}>
              <Button href={`${BASE}/intake/`} icon="arrow">Try the intake demo</Button>
              <Button href={`${BASE}/referrals/#refer`} variant="secondary">Send a test referral</Button>
            </div>
            <p style={{ marginTop: 18 }}><Sample>Sample data</Sample></p>
          </div>
          <BehindTheScenes />
        </div>
      </Row>

      <Row label="In their words" labelledBy="hs-quotes-title">
        <h2 id="hs-quotes-title" className="hs-visually-hidden">What families say</h2>
        <ul className="hs-ruled hs-swipe">
          {QUOTES.map((q) => (
            <li key={q.who}>
              <figure className="hs-quote">
                <blockquote><p>&ldquo;{q.text}&rdquo;</p></blockquote>
                <figcaption>{q.who}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="hs-creds-note"><Sample /></p>
      </Row>

      <Row label="Questions" labelledBy="hs-faq-title">
        <h2 id="hs-faq-title" style={{ marginBottom: 32 }}>What families ask us most</h2>
        <div className="hs-faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </Row>

      <section className="hs-band" aria-labelledby="hs-band-title">
        <h2 id="hs-band-title">Not sure where to start? Start with a call.</h2>
        <p>Our intake team will listen, answer your questions, and tell you what happens next. No forms about your medical history: we&rsquo;ll ask what we need when we talk.</p>
        <div className="hs-band-ctas">
          <Button href={`${BASE}/contact/`} icon="arrow">Request a call</Button>
          <Button href={`${BASE}/referrals/`} variant="secondary">Refer a patient</Button>
          <PhoneLink />
        </div>
      </section>
    </div>
  );
}
