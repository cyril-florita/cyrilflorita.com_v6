import { BASE, PRODUCTS, SAMPLE_REVIEWS, money } from "@/components/viteo/data";
import Link from "next/link";
import HeroParallax from "@/components/viteo/HeroParallax";
import ProductScene from "@/components/viteo/ProductScene";
import { Arrow, BigWordHead, Button, Pill, PillTray, ProductBox } from "@/components/viteo/ui";

export const metadata = {
  title: { absolute: "Viteo — personalized daily vitamins (concept)" },
};

const STEPS = [
  {
    n: "01",
    title: "Take the 2-minute quiz",
    text: "A few questions about how you eat, sleep and spend your days. No account needed.",
  },
  {
    n: "02",
    title: "Get a pack that explains itself",
    text: "Every item comes with a plain reason it's there, and you can add or remove anything.",
  },
  {
    n: "03",
    title: "Stay in control",
    text: "Skip, pause or swap from your account in a tap. No calls, no fine print.",
  },
];

const FAQ = [
  {
    q: "Is Viteo a real company?",
    a: "No. Viteo is a design concept by Cyril Florita, built to show product design and front-end work. Nothing here is for sale.",
  },
  {
    q: "Is this medical advice?",
    a: "No. The quiz suggests common supplements based on simple lifestyle answers. A real version would encourage everyone to check with a healthcare professional, especially if you take medication.",
  },
  {
    q: "Can I change my pack later?",
    a: "Yes — in the concept, you can add, remove or swap items at any time from your account, and changes apply to your next delivery.",
  },
  {
    q: "What happens if I'm away?",
    a: "Skip a single delivery or pause for up to three months. The prototype's account page lets you try both.",
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
// against last. Clearly sample data — no health outcomes are charted.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const THIS_YEAR = [18, 21, 26, 24, 27, 29];
const LAST_YEAR = [12, 16, 13, 19, 15, 20];
const CW = 520;
const CH = 200;
const X0 = 36;
const pt = (v, i) => [
  X0 + (i * (CW - X0 - 8)) / 5,
  12 + (1 - v / 30) * (CH - 40),
];
const curve = (vals) => {
  const p = vals.map(pt);
  return p.reduce((d, [x, y], i) => {
    if (!i) return `M${x},${y}`;
    const [px, py] = p[i - 1];
    const mx = (px + x) / 2;
    return `${d} C${mx},${py} ${mx},${y} ${x},${y}`;
  }, "");
};

const RoutineChart = () => {
  const [tx, ty] = pt(THIS_YEAR[3], 3);
  // Glass: a translucent, blurred pane over two soft drifting orbs (plus the
  // landing frame's fixed blue glow, see .dl-frame:has(.dl-bento-hero)).
  return (
    <div className="dl-glass-wrap">
      <span className="dl-glass-orbs" aria-hidden="true">
        <i />
        <i />
      </span>
      <div className="dl-panel dl-panel-dark dl-bento-card dl-glass">
        <div className="dl-bento-card-top">
          <span className="dl-pill-label">
            Your routine <span className="dl-code" data-lot="Lot 01">Sample data</span>
          </span>
          <Link
            className="dl-corner"
            href={`${BASE}/account/`}
            aria-label="Open the account dashboard"
          >
            <Corner />
          </Link>
        </div>
        <svg
          className="dl-chart"
          viewBox={`0 0 ${CW} ${CH}`}
          role="img"
          aria-label="Sample member: days on routine per month, January to June, rising from 18 to 29 this year, versus 12 to 20 last year"
        >
          {[0, 10, 20, 30].map((v) => {
            const y = 12 + (1 - v / 30) * (CH - 40);
            return (
              <g key={v}>
                <line
                  className="dl-chart-grid"
                  x1={X0}
                  x2={CW - 8}
                  y1={y}
                  y2={y}
                  strokeDasharray="3 5"
                />
                <text x="0" y={y + 4}>
                  {v}
                </text>
              </g>
            );
          })}
          <path
            d={`${curve(THIS_YEAR)} L${pt(0, 5)[0]},${CH - 28} L${X0},${CH - 28} Z`}
            fill="var(--dl-dark-accent)"
            opacity="0.14"
          />
          <path
            d={curve(LAST_YEAR)}
            fill="none"
            stroke="var(--dl-panel-1)"
            strokeWidth="2.5"
          />
          <path
            d={curve(THIS_YEAR)}
            fill="none"
            stroke="var(--dl-dark-accent)"
            strokeWidth="2.5"
          />
          <line
            x1={tx}
            x2={tx}
            y1={ty}
            y2={CH - 28}
            stroke="var(--dl-dark-accent)"
            strokeWidth="1.5"
          />
          <circle
            cx={tx}
            cy={ty}
            r="7"
            fill="var(--dl-dark-card)"
            stroke="var(--dl-dark-accent)"
            strokeWidth="3"
          />
          <g
            className="dl-chart-tip"
            transform={`translate(${tx - 46}, ${ty - 46})`}
          >
            <rect width="92" height="28" rx="10" />
            <text x="46" y="18" textAnchor="middle">
              24 days
            </text>
          </g>
          {MONTHS.map((m, i) => (
            <text key={m} x={pt(0, i)[0]} y={CH - 6} textAnchor="middle">
              {m}
            </text>
          ))}
        </svg>
        <p className="dl-chart-legend">
          <span style={{ "--c": "var(--dl-dark-accent)" }}>This year</span>
          <span style={{ "--c": "var(--dl-panel-1)" }}>Last year</span>
        </p>
      </div>
    </div>
  );
};

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
      {/* Bento: hero panel (with a tab rising into the header) + three cards */}
      <section className="dl-bento">
        <div className="dl-wrap">
          <div className="dl-panel dl-panel-1 dl-bento-hero">
            <div className="dl-bento-tab">
              <Button href={`${BASE}/quiz/`} variant="secondary">
                Take the quiz
              </Button>
            </div>
            <div className="dl-bento-copy">
              <p className="dl-eyebrow dl-hero-eyebrow">
                Personalized daily vitamins
              </p>
              <h1 className="dl-display">
                 Your routine, <em>with the right vitamins.</em>
              </h1>
              <p className="dl-lede">
                Answer eight quick questions. We&apos;ll build a daily pack
                tailored around your lifestyle, walk you through every ingredient, and
                deliver it on your schedule.
              </p>
              <Link className="dl-underline-cta" href={`${BASE}/quiz/`}>
                Take the 2-minute quiz
                <span className="dl-cta-chip" aria-hidden="true">
                  <Arrow />
                </span>
              </Link>
              <p className="dl-bento-sub">
                <span>Free delivery · Skip or pause anytime</span>
                <Link className="dl-textlink" href={`${BASE}/plan/`}>
                  See a sample plan
                </Link>
              </p>
            </div>
            <div className="dl-bento-art">
              <span className="dl-orbit" aria-hidden="true" />
              <div
                className="dl-product"
                role="img"
                aria-label="A Viteo Morning pack box with all nine essentials spilling out around it"
              >
                <ProductBox />
                {BURST.map(burst)}
                <ProductScene burst={BURST} />
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
          </div>

          <div className="dl-bento-row">
            <RoutineChart />

            <div className="dl-panel dl-panel-2 dl-bento-card">
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

            <div className="dl-panel dl-panel-3 dl-bento-card">
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
          <ul className="dl-ingredients">
            {Object.values(PRODUCTS).map((p) => (
              <li key={p.id} className="dl-card dl-glass dl-ingredient">
                <span className="dl-ingredient-pill">
                  <Pill id={p.id} size="lg" tilt={-20} />
                </span>
                <div>
                  <h3>{p.name}</h3>
                  <p className="dl-meta">
                    {p.dose} · {p.form} · {money(p.price)}/mo
                  </p>
                  <p>{p.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
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
          <ul className="dl-reviews">
            {SAMPLE_REVIEWS.map((r) => (
              <li key={r.name} className="dl-card dl-review">
                <p>&ldquo;{r.text}&rdquo;</p>
                <span className="dl-meta">
                  {r.name} · {r.plan}
                </span>
              </li>
            ))}
          </ul>
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
                <p>{f.a}</p>
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
    </>
  );
}
