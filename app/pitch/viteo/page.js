import { BASE, PRODUCTS, money } from "@/components/viteo/data";
import Reviews from "@/components/viteo/Reviews";
import RoutineGraph from "@/components/viteo/RoutineGraph";
import Link from "next/link";
import HeroParallax from "@/components/viteo/HeroParallax";
import IntroMoment from "@/components/viteo/IntroMoment";
import ProductStory from "@/components/viteo/ProductStory";
import Ingredients from "@/components/viteo/Ingredients";
import PartnerHero from "@/components/viteo/PartnerHero";
import QuizBar from "@/components/viteo/QuizBar";
import { Arrow, BigWordHead, Button, LogoMark, Pill, ProductBox } from "@/components/viteo/ui";

export const metadata = {
  title: { absolute: "Viteo — Personalized vitamin subscription | Design & dev pitch by Cyril Florita" },
  alternates: { canonical: "/pitch/viteo/" },
  openGraph: {
    title: "Viteo — Personalized vitamin subscription | Design & dev pitch by Cyril Florita",
    url: "/pitch/viteo/",
    images: [{ url: "/og/viteo.jpg", width: 1200, height: 630, alt: "Viteo, a personalized vitamin subscription" }],
  },
};

const STEPS = [
  {
    n: "01",
    pill: "d3",
    title: "Take the 2-minute quiz",
    text: "Tell us how you eat, sleep and spend your days. You'll see your pack before you sign up for anything.",
  },
  {
    n: "02",
    pill: "magnesium",
    title: "Get a pack that explains itself",
    text: "Every pill comes with the answer that put it there. Remove or add anything before you order.",
  },
  {
    n: "03",
    pill: "c",
    title: "Stay in control",
    text: "Skip, pause or change your pack from your account anytime. No calls, no fine print.",
  },
];

const FAQ = [
  {
    q: "How does the quiz decide what goes in my pack?",
    a: "Your answers about diet, time outdoors, sleep, activity and goals map to a short list of everyday nutrients. Each pill in your plan shows the answer that put it there, and you can remove or add anything before you order.",
  },
  {
    q: "Should I talk to my doctor first?",
    a: "If you're pregnant or nursing, take prescription medication, or have a medical condition, check with your doctor or pharmacist before starting any supplement. We'll remind you before checkout, too.",
  },
  {
    q: "How are your vitamins made and tested?",
    a: "Every batch is made in a cGMP-certified facility and tested by an independent lab for identity, purity and potency, and the results are published: enter the lot code from the bottom of your box to see them. All nine are vegan and free from gluten, dairy and artificial colors.",
    link: { href: `${BASE}/lot/`, label: "Look up a batch" },
  },
  {
    q: "Can I change, skip or pause my deliveries?",
    a: "Yes. From your account you can add or remove items, change how often your box arrives, skip a delivery or pause for up to three months. Changes apply to your next box.",
  },
  {
    q: "How much does it cost?",
    a: "Each item is $4–9 a month, so most packs land between $20 and $35. Delivering every 2 or 3 months saves 10–15%, and shipping is always free.",
  },
  {
    q: "What arrives in the box?",
    a: "Thirty daily packs, one per day, printed with your name and the day. The box is recyclable and fits through most letterboxes.",
  },
];

const Corner = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
);

// A sample member's routine: days the pack was taken each month, this year
// against last. Clearly sample data — no health outcomes are charted. The
// real tracker lives in the account (Account.js); the arrow goes there.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const THIS_YEAR = [18, 21, 26, 24, 27, 29];
const LAST_YEAR = [12, 16, 13, 19, 15, 20];

const RoutineChart = () => (
  // Glass: a clear, blurred pane over the landing frame's ambient light.
  <div className="dl-glass-wrap">
    <div className="dl-panel dl-panel-dark dl-bento-card dl-glass">
      <div className="dl-bento-card-top">
        <span className="dl-pill-label">
          Track your routine <span className="dl-code" data-lot="Lot 01">Sample data</span>
        </span>
        <Link className="dl-corner" href={`${BASE}/account/#acc-tracker`} aria-label="See the routine tracker in your account">
          <Corner />
        </Link>
      </div>
      <RoutineGraph
        labels={MONTHS}
        main={THIS_YEAR}
        compare={LAST_YEAR}
        tipIndex={3}
        tip="24 days"
        ariaLabel="Sample member: days on routine per month, January to June, rising from 18 to 29 this year, versus 12 to 20 last year"
        legend={[{ label: "This year", color: "var(--dl-dark-accent)" }, { label: "Last year", color: "var(--dl-panel-1)" }]}
      />
    </div>
  </div>
);

// Hero product shot: all nine essentials bursting out around the box. Each
// is [product, x %, y %, scale, tilt].
const BURST = [
  ["magnesium", 72, 10, 1.6, -40],
  ["d3", 86, 25, 1.7, 20],
  ["omega", 71, 36, 1.6, -15],
  ["probiotic", 90, 46, 1.45, 62],
  ["b12", 76, 56, 1.4, 28],
  ["theanine", 8, 34, 1.35, 28],
  ["zinc", 60, 88, 1.4, 0],
  ["c", 41, 91, 1.5, 0],
  ["biotin", 15, 84, 1.3, -32],
];
const burst = ([id, x, y, scale, tilt], i) => (
  <span
    key={id}
    className="dl-burst"
    style={{ "--x": `${x}%`, "--y": `${y}%`, "--s": scale, "--i": i }}
  >
    <Pill id={id} tilt={tilt} />
  </span>
);

export default function Landing() {
  return (
    <>
      {/* Preloader: shown from the first paint (only while the intro is
          pending, see layout.js) until the page is ready, then faded out by
          the intro (IntroMoment.js). The logo's capsules spin on a loop. */}
      <div className="dl-preloader" aria-hidden="true">
        <span className="dl-preloader-mark"><LogoMark /></span>
        <span className="dl-preloader-word">viteo</span>
      </div>
      {/* Bento: hero panel (with a tab rising into the header) + three cards */}
      <section className="dl-bento">
        <div className="dl-wrap">
          <div className="dl-panel dl-panel-1 dl-bento-hero">
            <div className="dl-bento-tab">
              <Button href={`${BASE}/quiz/`} variant="secondary">
                Take the quiz
              </Button>
            </div>
            <div className="dl-bento-art">
              <span className="dl-orbit" aria-hidden="true" />
              <div
                className="dl-product"
                role="img"
                aria-label="A Viteo Morning pack box with all nine essentials spilling out around it"
              >
                <ProductBox morph={false} />
                {BURST.map(burst)}
              </div>
              <HeroParallax />
              <span className="dl-badge" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="dl-badge-path"
                      d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
                    />
                  </defs>
                  <text>
                    <textPath
                      href="#dl-badge-path"
                      textLength="236"
                      lengthAdjust="spacing"
                    >
                      Personalized · Explained · Daily ·
                    </textPath>
                  </text>
                </svg>
              </span>
            </div>
            <div className="dl-bento-copy">
              <h1 className="dl-display">
                 Your routine, <em>with the right vitamins.</em>
              </h1>
              <p className="dl-lede">
                Eight quick questions. One daily pack built around you, with every
                pill explained.
              </p>
              <Link className="dl-underline-cta" href={`${BASE}/quiz/`}>
                Take the 2-minute quiz
                <span className="dl-cta-chip" aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <p className="dl-bento-sub">
                <span>Free delivery · Skip anytime</span>
                <Link className="dl-textlink" href={`${BASE}/plan/`}>
                  See a sample plan
                </Link>
              </p>
            </div>
          </div>

          <div className="dl-bento-row">
            <RoutineChart />

            <div className="dl-panel dl-panel-2 dl-bento-card is-link">
              <div className="dl-bento-card-top">
                {/* A stopwatch, three-quarters round: "2 min". */}
                <svg
                  className="dl-watch"
                  viewBox="0 0 56 60"
                  aria-hidden="true"
                >
                  <rect x="24" y="1" width="8" height="5" rx="2" />
                  <line x1="28" y1="6" x2="28" y2="9" />
                  <circle className="dl-watch-track" cx="28" cy="34" r="22" />
                  <circle
                    className="dl-watch-arc"
                    cx="28"
                    cy="34"
                    r="22"
                    pathLength="100"
                  />
                  <line
                    className="dl-watch-hand"
                    x1="28"
                    y1="34"
                    x2="28"
                    y2="20"
                  />
                  <circle cx="28" cy="34" r="2.5" />
                </svg>
                <Link
                  className="dl-corner"
                  href={`${BASE}/quiz/`}
                  aria-label="Take the quiz"
                >
                  <Corner />
                </Link>
              </div>
              <div>
                <p className="dl-meta">From quiz to your pack</p>
                <p className="dl-big">2 min</p>
              </div>
            </div>

            <div className="dl-panel dl-panel-3 dl-bento-card is-link">
              <div className="dl-bento-card-top">
                <span className="dl-pill-label is-solid">9 essentials</span>
                <a
                  className="dl-corner dl-corner-down"
                  href="#ingredients"
                  aria-label="See the ingredients"
                >
                  <Corner />
                </a>
              </div>
              <h2 className="dl-h3">Every ingredient, explained.</h2>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="dl-section">
        <div className="dl-wrap">
          <BigWordHead word="How it works">
            <h2 className="dl-h2">Three steps, no guesswork.</h2>
          </BigWordHead>
          <ol className="dl-steps">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={`dl-panel dl-panel-${STEPS.indexOf(s) + 1} dl-step`}
              >
                {/* A pill docks here on its way down the page (ProductStory). */}
                <span className="dl-step-pill" data-story-pill={s.pill}>
                  <Pill id={s.pill} size="lg" tilt={-20} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {/* The list numbers the steps; the numeral is decoration. */}
                <span className="dl-step-n" aria-hidden="true">
                  {s.n}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ingredients */}
      <section id="ingredients" className="dl-section dl-section-tint">
        <div className="dl-wrap">
          <BigWordHead word="Ingredients">
            <h2 className="dl-h2">Nine essentials.</h2>
          </BigWordHead>
          <p className="dl-section-lede">
            Each one comes with its dose, its form, and why it might be in your
            pack.
          </p>
          <Ingredients />
        </div>
      </section>

      {/* Reviews */}
      <section className="dl-section">
        <div className="dl-wrap">
          <BigWordHead word="Reviews">
            <h2 className="dl-h2">Built around the things people asked for.</h2>
            <p className="dl-bigword-note">
              <span className="dl-code" data-lot="Lot 02">Sample content</span>
            </p>
          </BigWordHead>
          <Reviews />
          {/* Proof from the partner program (sample until it launches). */}
          <p className="dl-pro-proof">
            <span className="dl-pro-faces" aria-hidden="true"><span>RD</span><span>PT</span><span>RD</span></span>
            <span>Recommended by trainers and dietitians in our partner program.</span>
            <Link className="dl-textlink" href={`${BASE}/partners/`}>For professionals</Link>
            <span className="dl-code" data-lot="Lot 05">Sample data</span>
          </p>
        </div>
      </section>

      {/* Partner program: for trainers, dietitians and nutritionists. */}
      <section className="dl-section dl-pro-home" aria-labelledby="pro-band-title">
        <div className="dl-wrap">
          <PartnerHero headingAs="h2" headingId="pro-band-title" base={`${BASE}/partners/`} />
        </div>
      </section>

      {/* FAQ */}
      <section className="dl-section dl-section-tint">
        <div className="dl-wrap dl-faq-wrap">
          <div>
            <BigWordHead word="Questions" className="is-row">
              <h2 className="dl-h2">Good to know.</h2>
            </BigWordHead>
          </div>
          <div className="dl-faq">
            {FAQ.map((f) => (
              <details key={f.q} className="dl-glass dl-faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}{f.link && <> <Link className="dl-textlink" href={f.link.href}>{f.link.label}</Link></>}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dl-cta">
        <div className="dl-wrap dl-cta-inner">
          <h2 className="dl-display">
            Two minutes to a routine <em>that fits.</em>
          </h2>
          <Link className="dl-underline-cta" href={`${BASE}/quiz/`}>
            Start the quiz
            <span className="dl-cta-chip" aria-hidden="true">
              <Arrow />
            </span>
          </Link>
        </div>
      </section>
      {/* The 3D product story over the page (desktop). */}
      <ProductStory burst={BURST} />
      <IntroMoment />
      <QuizBar />
    </>
  );
}
