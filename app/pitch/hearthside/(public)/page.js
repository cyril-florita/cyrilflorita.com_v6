import { BASE, FAQS, MEDICARE_CONDITIONS, MEDICARE_URL, PHONE, SERVICES, STEPS, AREAS } from "@/components/hearthside/data";
import { Button, Icon, PartnerLogos, PhoneLink, Photo, Row, Sample } from "@/components/hearthside/ui";
import { HeroContour, ZipCheck } from "@/components/hearthside/client";
import Peeps, { STEP_FIGURES } from "@/components/hearthside/Peeps";

export const metadata = {
  title: { absolute: "Hearthside Home Health — Skilled care at home | Design & dev pitch by Cyril Florita" },
  alternates: { canonical: "/pitch/hearthside/" },
};

// Home, roughly in the order the brief sets out (services and geography up
// front, separate paths for families and professionals, services with the
// team's photos folded into their cards, how care begins, coverage guidance,
// service area, FAQ, contact), laid out as an editorial grid: each section a
// hairline-ruled row with a label column.

// The hero photo: a clinician and patient at home, in the site's photo grade
// (supplied by Cyril; 1168×784, one size only). It's mirrored at export so
// the nurse is on the left, where the headline's notch only covers her
// scrubs, and the patient's face sits clear on the right. The first-visit
// card sits bottom right.
function HeroArt() {
  return (
    <div className="hs-hero-art">
      <img className="hs-hero-img" src="/img/hearthside/photos/hero-care-1168.webp" width="1168" height="784"
        alt="A smiling older woman holds out her arm as a nurse in teal scrubs supports it, in a bright living room" fetchPriority="high" decoding="async" />
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
// Medical social work has none yet, so it keeps the shot-list placeholder.
const SERVICE_PHOTOS = {
  // Photo: Nappy (@nappystudio) on Unsplash, unsplash.com/photos/PSHCnGmOeUo, Unsplash License (free, no attribution required).
  nursing: { shot: "A nurse checks a patient's blood pressure at the kitchen table, morning light", alt: "A nurse in scrubs shows an older man his blood pressure reading at a kitchen table", src: "/img/hearthside/photos/nurse-blood-pressure", position: "50% 15%" },
  // Photos below: Unsplash License (free, no attribution required); cool-graded like the first.
  // Care Assure (@careassure), unsplash.com/photos/Zx4ddAfk0Ck
  pt: { shot: "A physical therapist works with a patient on strength exercises", alt: "A therapist kneels beside a smiling woman in a wheelchair as she lifts small dumbbells", src: "/img/hearthside/photos/pt-wheelchair-weights", position: "50% 35%" },
  // Age Cymru (@agecymru), unsplash.com/photos/2obyM4zYt3Y
  ot: { shot: "An occupational therapist helps a patient up with her walker", alt: "A caregiver holds an older woman's hands as she rises from her chair with a walker, both laughing", src: "/img/hearthside/photos/ot-walker", position: "60% 30%" },
  // Age Cymru (@agecymru), unsplash.com/photos/qW3DLnehg9w
  speech: { shot: "A speech therapist and patient in conversation", alt: "A clinician in teal scrubs smiles as she talks with an older woman", src: "/img/hearthside/photos/speech-conversation", position: "50% 30%" },
  social: { shot: "A medical social worker reviews resources with a patient and their daughter at the dining table" },
  // Age Cymru (@agecymru), unsplash.com/photos/GPrh_GLiWCI
  aide: { shot: "A home health aide and patient sharing a laugh", alt: "A young aide in glasses laughs with an older woman beside her", src: "/img/hearthside/photos/aide-laughing", position: "50% 25%" },
};

export default function HearthsideHome() {
  return (
    <div className="hs-wrap">
      {/* The hero, after a reference: one wide rectangular photo with the
          eyebrow in a tab cut into its top-right corner and the
          headline cut into its bottom-left corner (a page-coloured notch with
          rounded inverse corners, .hs-hero-notch), contoured line by line by
          HeroContour. Below 961px the notch is
          ordinary flow beside the photo. */}
      <section className="hs-hero" aria-labelledby="hs-hero-title">
        <div className="hs-hero-stage">
          <HeroArt />
          <HeroContour />
          <p className="hs-hero-tab"><span className="hs-eyebrow">Skilled home health · San Fernando &amp; Santa Clarita Valleys</span></p>
          <div className="hs-hero-notch">
            <h1 id="hs-hero-title"><span>Compassionate care at home.</span> <span>Clear guidance every step of the way.</span></h1>
          </div>
        </div>
        <div className="hs-hero-copy">
          <p className="hs-lede">
            Nurses and therapists who come to you after a hospital stay, an illness or an injury. Find out what we offer, check that we serve your area, and talk with our intake team about next steps.
          </p>
          <div className="hs-hero-actions">
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
      </section>

      <Row label="Referral partners" tight>
        <PartnerLogos />
        <p className="hs-logos-note"><Sample>Sample partners</Sample> Hospitals, physicians and senior communities across the Valley refer patients to us.</p>
      </Row>

      <Row label="Start here" labelledBy="hs-paths-title">
        <h2 id="hs-paths-title">How can we help?</h2>
        <div className="hs-ruled" style={{ marginTop: 40 }}>
          <article className="hs-path">
            <Peeps figures={[{ name: "elder-wheelchair" }, { name: "family-easing", flip: true }]} />
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
            <Peeps figures={[{ name: "doc-steth" }, { name: "planner-bun", flip: true }]} />
            <h3>I&rsquo;m a physician, hospital or discharge planner</h3>
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
        </div>
      </Row>

      <Row label="What we do" labelledBy="hs-services-title">
        <h2 id="hs-services-title">Skilled care, in your own home</h2>
        <p className="hs-lede">Home health is medical care your doctor orders, delivered by registered nurses and licensed therapists who live and work in the Valley, visiting on a schedule so you can recover where you&rsquo;re most comfortable.</p>
        <ul className="hs-services">
          {SERVICES.map((s) => {
            const ph = SERVICE_PHOTOS[s.id];
            return (
              <li key={s.id} className="hs-service">
                <Photo shot={ph.shot} src={ph.src} alt={ph.alt} position={ph.position} sizes="(max-width: 760px) 92vw, (max-width: 960px) 45vw, 28vw" />
                <h3><Icon name={s.icon} />{s.name}</h3>
                <p>{s.short}</p>
              </li>
            );
          })}
        </ul>
        <div className="hs-aside">
          <p><strong>Looking for help with meals, housekeeping or companionship?</strong> That&rsquo;s non-medical home care, a different service. We&rsquo;re happy to point you to local options.</p>
          <Button href={`${BASE}/services/#which-care`} variant="quiet" icon="arrow">Which kind of care fits?</Button>
        </div>
      </Row>

      <Row label="Getting started" labelledBy="hs-steps-title">
        <h2 id="hs-steps-title">How care begins</h2>
        <p className="hs-lede">Four steps from your first call to your first visit. We&rsquo;ll tell you what&rsquo;s happening at each one.</p>
        <ol className="hs-ruled">
          {STEPS.map((s, i) => (
            <li key={s.title} className="hs-step">
              <Peeps figures={STEP_FIGURES[i]} />
              <span className="hs-step-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
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
        <p>Our intake team will listen, answer your questions and tell you what happens next. No forms about your medical history: we&rsquo;ll ask what we need when we talk.</p>
        <div className="hs-band-ctas">
          <Button href={`${BASE}/contact/`} icon="arrow">Request a call</Button>
          <Button href={`${BASE}/referrals/`} variant="secondary">Refer a patient</Button>
          <PhoneLink />
        </div>
      </section>
    </div>
  );
}
